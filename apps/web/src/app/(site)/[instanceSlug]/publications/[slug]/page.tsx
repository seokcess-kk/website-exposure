// @glitzy/web/(site)/[instanceSlug]/publications/[slug] — 논문 detail

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { cache } from "react";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { normalizePublication, type PublicationRow } from "@/lib/db-projection";
import { loadSiteInitial } from "@/lib/site-initial";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/site-metadata";

export const revalidate = 300;

const loadPublicationDetail = cache(async (instanceSlug: string, slug: string) => {
  return withPublicTenantTransaction(instanceSlug, async (tx, ctx) => {
    const rows = await tx<PublicationRow[]>`
      SELECT slug, title, authors, journal,
             to_char(published_date, 'YYYY-MM-DD') AS published_date,
             doi, pubmed_id, url, thumbnail_url, summary, author_doctor_id, published_at, updated_at
        FROM publication
       WHERE instance_id = ${ctx.instanceId}::uuid
         AND status = 'published' AND slug = ${slug}
       LIMIT 1
    `;
    return rows.length === 0 ? null : normalizePublication(rows[0]!);
  });
});

export async function generateMetadata({ params }: { params: { instanceSlug: string; slug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  const pub = await loadPublicationDetail(params.instanceSlug, params.slug);
  if (!pub) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: pub.title,
    description: pub.summary,
    canonicalPath: `/publications/${pub.slug}`,
    imageUrl: pub.thumbnailUrl ?? undefined,
  });
}

export default async function PublicationDetailPage({ params }: { params: { instanceSlug: string; slug: string } }) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();
  const pub = await loadPublicationDetail(params.instanceSlug, params.slug);
  if (!pub) notFound();
  const base = `/${params.instanceSlug}`;

  return (
    <>
      <Breadcrumb items={[
        { label: "홈", href: base },
        { label: "논문", href: `${base}/publications` },
        { label: pub.title, href: null },
      ]} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <header className="mb-6 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-fg-default">{pub.title}</h1>
          <div className="text-sm text-fg-muted">
            {pub.authors.join(", ")}
            {pub.journal && <> · <span className="italic">{pub.journal}</span></>}
            {" · "}{pub.publishedDate}
          </div>
        </header>

        {pub.thumbnailUrl && (
          <img src={pub.thumbnailUrl} alt={`${pub.title} 학술 논문 표지`} loading="lazy" decoding="async" className="mb-6 max-h-96 w-full rounded-md object-contain bg-subtle" />
        )}

        <section className="prose prose-sm mb-6 max-w-none text-fg-default">
          <h2 className="text-lg font-semibold">초록</h2>
          <p>{pub.summary}</p>
        </section>

        <section className="flex flex-col gap-2 rounded-md border border-border bg-elevated p-4 text-sm">
          <div className="font-semibold text-fg-default">외부 링크</div>
          <a href={pub.url} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
            원문 ({pub.url}) ↗
          </a>
          {pub.doi && (
            <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
              DOI: {pub.doi} ↗
            </a>
          )}
          {pub.pubmedId && (
            <a href={`https://pubmed.ncbi.nlm.nih.gov/${pub.pubmedId}/`} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
              PubMed: {pub.pubmedId} ↗
            </a>
          )}
        </section>

        <div className="mt-8">
          <Link href={`${base}/publications`} className="text-sm text-brand-primary hover:underline">
            ← 논문 목록으로
          </Link>
        </div>
      </article>
    </>
  );
}
