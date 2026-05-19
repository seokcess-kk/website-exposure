// @glitzy/web/(site)/[instanceSlug]/about — P-002 About
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.3 + EAT_CONTENT_PLAN v1.0 § 5.3 EC-RENDER-03
//   All Publications + All MediaAppearances (author_doctor_id 무관) inline + graph self-contained.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import {
  normalizePublication,
  normalizeMediaAppearance,
  type PublicationRow,
  type MediaAppearanceRow,
} from "@/lib/db-projection";
import { loadSiteInitial } from "@/lib/site-initial";
import { ArticleBody } from "@/components/site/ArticleBody";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/site-metadata";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { aboutGraph } from "@/lib/json-ld/builders";
import { siteBaseUrl } from "@/lib/site-url";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { instanceSlug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: "소개",
    description: initial.clinic.description,
    canonicalPath: "/about",
    ogType: "website",
  });
}

export default async function AboutPage({ params }: { params: { instanceSlug: string } }) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();
  const base = `/${params.instanceSlug}`;
  const hostOrigin = siteBaseUrl(params.instanceSlug);
  const longDesc = initial.clinic.longDescription ?? initial.clinic.description;

  const eatData = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
    const publicationRows = await tx<PublicationRow[]>`
      SELECT slug, title, authors, journal,
             to_char(published_date, 'YYYY-MM-DD') AS published_date,
             doi, pubmed_id, url, thumbnail_url, summary, author_doctor_id,
             published_at, updated_at
        FROM publication
       ORDER BY published_date DESC
    `;
    const mediaRows = await tx<MediaAppearanceRow[]>`
      SELECT slug, title, channel_name,
             channel_type::text AS channel_type,
             to_char(published_date, 'YYYY-MM-DD') AS published_date,
             duration_seconds, url, thumbnail_url, summary, author_doctor_id,
             published_at, updated_at
        FROM media_appearance
       ORDER BY published_date DESC
    `;
    return {
      publications: publicationRows.map(normalizePublication),
      media: mediaRows.map(normalizeMediaAppearance),
    };
  });

  const publications = eatData?.publications ?? [];
  const media = eatData?.media ?? [];

  const graph = aboutGraph(
    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/about" },
    initial.clinic,
    initial.locationMain,
    `소개 | ${initial.clinic.name}`,
    initial.clinic.description,
    publications,
    media,
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
      <Breadcrumb items={[{ label: "홈", href: base }, { label: "소개", href: null }]} />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-6 text-3xl font-bold text-fg-default">소개</h1>
        <ArticleBody markdown={longDesc} hostOrigin={hostOrigin} />
        {initial.clinic.founder || initial.clinic.foundingDate ? (
          <dl className="mt-10 grid grid-cols-1 gap-3 rounded-md border border-border bg-elevated p-4 text-sm sm:grid-cols-2">
            {initial.clinic.founder ? (
              <div><dt className="text-fg-muted">설립자</dt><dd className="font-medium text-fg-default">{initial.clinic.founder}</dd></div>
            ) : null}
            {initial.clinic.foundingDate ? (
              <div><dt className="text-fg-muted">설립일</dt><dd className="font-medium text-fg-default">{initial.clinic.foundingDate}</dd></div>
            ) : null}
            {initial.clinic.legalEntityName ? (
              <div><dt className="text-fg-muted">법인명</dt><dd className="font-medium text-fg-default">{initial.clinic.legalEntityName}</dd></div>
            ) : null}
            {initial.clinic.businessRegistrationNumber ? (
              <div><dt className="text-fg-muted">사업자등록번호</dt><dd className="font-medium text-fg-default">{initial.clinic.businessRegistrationNumber}</dd></div>
            ) : null}
          </dl>
        ) : null}

        {publications.length > 0 ? (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-semibold text-fg-default">학술 인용</h2>
            <ul className="flex flex-col gap-3">
              {publications.map((p) => (
                <li key={p.slug} className="rounded-md border border-border bg-elevated p-4">
                  <h3 className="font-medium text-fg-default">{p.title}</h3>
                  <p className="mt-1 text-xs text-fg-muted">
                    {p.authors.join(", ")}
                    {p.journal ? ` · ${p.journal}` : ""} · {p.publishedDate}
                  </p>
                  <p className="mt-2 text-sm text-fg-default">{p.summary}</p>
                  <a
                    href={p.url}
                    rel="nofollow noopener noreferrer"
                    target="_blank"
                    className="mt-2 inline-block text-xs text-brand-primary hover:text-brand-primary-hover"
                  >
                    원문 보기 →
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {media.length > 0 ? (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-semibold text-fg-default">미디어 출연</h2>
            <ul className="flex flex-col gap-3">
              {media.map((m) => (
                <li key={m.slug} className="rounded-md border border-border bg-elevated p-4">
                  <div className="flex items-start gap-3">
                    {m.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.thumbnailUrl} alt="" className="h-24 w-32 rounded object-cover" />
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
