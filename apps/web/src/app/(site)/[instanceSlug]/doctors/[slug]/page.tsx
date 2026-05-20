// @glitzy/web/(site)/[instanceSlug]/doctors/[slug] — P-004 Doctor Profile
// v0.4 EC-RENDER-02: Publications + MediaAppearances inline + graph self-contained.

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { cache } from "react";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import {
  normalizeDoctor,
  normalizeArticle,
  normalizePublication,
  normalizeMediaAppearance,
  type DoctorProfileRow,
  type ArticleRow,
  type PublicationRow,
  type MediaAppearanceRow,
} from "@/lib/db-projection";
import { loadSiteInitial } from "@/lib/site-initial";
import { ArticleBody } from "@/components/site/ArticleBody";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/site-metadata";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { doctorProfileGraph } from "@/lib/json-ld/builders";
import { siteBaseUrl } from "@/lib/site-url";

export const revalidate = 60;

const loadDoctorProfile = cache(async (instanceSlug: string, slug: string) => {
  return withPublicTenantTransaction(instanceSlug, async (tx) => {
    const doctorRows = await tx<(DoctorProfileRow & { id: string })[]>`
      SELECT id::text AS id, slug, name, title, job_title, honorific, bio, photo_url, cv_photo_url, display_order, active, updated_at
        FROM doctor_profile
       WHERE slug = ${slug}
       LIMIT 1
    `;
    if (doctorRows.length === 0) return null;
    const doctor = normalizeDoctor(doctorRows[0]!);

    const articleRows = await tx<ArticleRow[]>`
      SELECT a.slug, a.title, a.summary, a.body_markdown, a.hero_image_url,
             a.published_at, a.author_doctor_id, a.category_id,
             ac.slug AS category_slug, a.updated_at
        FROM article a
        JOIN article_category ac
          ON a.category_id = ac.id AND a.instance_id = ac.instance_id
       WHERE a.author_doctor_id = ${doctorRows[0]!.id}::uuid
       ORDER BY a.published_at DESC NULLS LAST
       LIMIT 5
    `;
    const publicationRows = await tx<PublicationRow[]>`
      SELECT slug, title, authors, journal,
             to_char(published_date, 'YYYY-MM-DD') AS published_date,
             doi, pubmed_id, url, thumbnail_url, summary, author_doctor_id,
             published_at, updated_at
        FROM publication
       WHERE author_doctor_id = ${doctorRows[0]!.id}::uuid
       ORDER BY published_date DESC
    `;
    const mediaRows = await tx<MediaAppearanceRow[]>`
      SELECT slug, title, channel_name,
             channel_type::text AS channel_type,
             to_char(published_date, 'YYYY-MM-DD') AS published_date,
             duration_seconds, url, thumbnail_url, summary, author_doctor_id,
             published_at, updated_at
        FROM media_appearance
       WHERE author_doctor_id = ${doctorRows[0]!.id}::uuid
       ORDER BY published_date DESC
    `;
    return {
      doctor,
      articles: articleRows.map(normalizeArticle),
      publications: publicationRows.map(normalizePublication),
      media: mediaRows.map(normalizeMediaAppearance),
    };
  });
});

export async function generateMetadata({ params }: { params: { instanceSlug: string; slug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  const data = await loadDoctorProfile(params.instanceSlug, params.slug);
  if (!data) return {};
  const doctor = data.doctor;
  const description = doctor.bio ? doctor.bio.replace(/[#*_`>]/g, "").slice(0, 160) : `${initial.clinic.name} 의료진 ${doctor.name}`;
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: doctor.name,
    description,
    canonicalPath: `/doctors/${doctor.slug}`,
    ogType: "profile",
    imageUrl: doctor.photoUrl ?? undefined,
  });
}

export default async function DoctorProfilePage({
  params,
}: {
  params: { instanceSlug: string; slug: string };
}) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();
  const data = await loadDoctorProfile(params.instanceSlug, params.slug);
  if (!data) notFound();

  const base = `/${params.instanceSlug}`;
  const hostOrigin = siteBaseUrl(params.instanceSlug);
  const graph = doctorProfileGraph(
    { siteBaseUrl: hostOrigin, pagePath: `/doctors/${data.doctor.slug}` },
    initial.clinic,
    data.doctor,
    data.doctor.bio ? data.doctor.bio.replace(/[#*_`>]/g, "").slice(0, 160) : `${initial.clinic.name} 의료진 ${data.doctor.name}`,
    data.publications,
    data.media,
  );

  function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  return (
    <>
      <JsonLdScript graph={graph} />
      <Breadcrumb items={[
        { label: "홈", href: base },
        { label: "의료진", href: `${base}/doctors` },
        { label: data.doctor.name, href: null },
      ]} />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <header className="mb-8 flex flex-col items-center gap-4 text-center md:flex-row md:items-start md:text-left">
          {data.doctor.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.doctor.photoUrl} alt={`${data.doctor.name}${data.doctor.title ? ` ${data.doctor.title}` : ""} 프로필 사진`} loading="eager" decoding="async" fetchPriority="high" className="h-32 w-32 rounded-full object-cover" />
          ) : null}
          <div>
            <h1 className="text-3xl font-bold text-fg-default">{data.doctor.name}</h1>
            {data.doctor.title ? <p className="mt-1 text-base text-fg-muted">{data.doctor.title}</p> : null}
            {data.doctor.jobTitle ? <p className="mt-0.5 text-sm text-fg-muted">{data.doctor.jobTitle}</p> : null}
          </div>
        </header>
        {data.doctor.bio ? <ArticleBody markdown={data.doctor.bio} hostOrigin={hostOrigin} /> : null}
        {data.articles.length > 0 ? (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-semibold text-fg-default">작성 아티클</h2>
            <ul className="flex flex-col gap-3">
              {data.articles.map((a) => (
                <li key={a.slug} className="rounded-md border border-border bg-elevated p-3">
                  <Link href={`${base}/insights/${a.categorySlug}/${a.slug}`} className="font-medium text-brand-primary hover:text-brand-primary-hover">
                    {a.headline}
                  </Link>
                  <p className="mt-1 text-sm text-fg-muted">{a.summary}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {data.publications.length > 0 ? (
          <section className="mt-12">
            <h2 className="mb-4 flex items-baseline gap-2 text-xl font-semibold text-fg-default">
              논문
              <span className="text-sm font-normal text-fg-muted">({data.publications.length})</span>
            </h2>
            <ol className="flex flex-col">
              {data.publications.map((p, idx) => {
                const year = p.publishedDate.slice(0, 4);
                const firstAuthor = p.authors[0] ?? "";
                const others = p.authors.length > 1 ? " 외" : "";
                return (
                  <li key={p.slug} className="flex gap-3 border-b border-border py-4 last:border-b-0">
                    <span className="shrink-0 pt-0.5 font-mono text-sm tabular-nums text-fg-muted">
                      [{String(idx + 1).padStart(2, "0")}]
                    </span>
                    <div className="flex-1">
                      <h3 className="text-base font-medium leading-snug text-fg-default">{p.title}</h3>
                      <p className="mt-1.5 text-xs text-fg-muted">
                        {firstAuthor}
                        {others}.{p.journal ? <> <em className="not-italic font-medium text-fg-default">{p.journal}</em>.</> : null} {year}.
                      </p>
                      <p className="mt-2 text-sm text-fg-default">{p.summary}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {p.doi ? (
                          <a
                            href={`https://doi.org/${p.doi}`}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            className="rounded border border-border bg-elevated px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-fg-muted hover:border-brand-primary hover:text-brand-primary"
                          >
                            DOI
                          </a>
                        ) : null}
                        {p.pubmedId ? (
                          <a
                            href={`https://pubmed.ncbi.nlm.nih.gov/${p.pubmedId}`}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            className="rounded border border-border bg-elevated px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-fg-muted hover:border-brand-primary hover:text-brand-primary"
                          >
                            PubMed
                          </a>
                        ) : null}
                        {!p.doi && !p.pubmedId && p.journal ? (
                          <span className="rounded border border-border bg-elevated px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-fg-muted">
                            학회지
                          </span>
                        ) : null}
                        <a
                          href={p.url}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="ml-auto text-xs text-brand-primary hover:text-brand-primary-hover"
                        >
                          원문 보기 →
                        </a>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ) : null}

        {data.media.length > 0 ? (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-semibold text-fg-default">미디어</h2>
            <ul className="flex flex-col gap-3">
              {data.media.map((m) => (
                <li key={m.slug} className="rounded-md border border-border bg-elevated p-4">
                  <div className="flex items-start gap-3">
                    {m.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.thumbnailUrl} alt={`${m.title} 미디어 썸네일`} loading="lazy" decoding="async" className="h-24 w-32 rounded object-cover" />
                    ) : null}
                    <div className="flex-1">
                      <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-xs uppercase text-slate-600">
                        {m.channelType}
                      </span>
                      <h3 className="mt-1 font-medium text-fg-default">{m.title}</h3>
                      <p className="mt-1 text-xs text-fg-muted">
                        {m.channelName} · {m.publishedDate}
                        {m.durationSeconds !== null ? ` · ${formatDuration(m.durationSeconds)}` : ""}
                      </p>
                      <p className="mt-2 text-sm text-fg-default">{m.summary}</p>
                      <a
                        href={m.url}
                        rel="nofollow noopener noreferrer"
                        target="_blank"
                        className="mt-2 inline-block text-xs text-brand-primary hover:text-brand-primary-hover"
                      >
                        영상 보기 →
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </section>
    </>
  );
}
