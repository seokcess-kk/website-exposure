// @glitzy/web/(site)/[instanceSlug]/insights/[category]/[slug] — P-010 Article Detail
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1 + EAT_CONTENT_PLAN v1.0 § 5.4 (EC-RENDER-04, PSR-DEFER-15 해소)
//   article JOIN article_category ON ... — category.slug 일치 검증 (mismatch → 404).

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { normalizeArticle, normalizeDoctor, type ArticleRow, type DoctorProfileRow } from "@/lib/db-projection";
import { loadSiteInitial } from "@/lib/site-initial";
import { ArticleBody } from "@/components/site/ArticleBody";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/site-metadata";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { articleDetailGraph } from "@/lib/json-ld/builders";
import { siteBaseUrl } from "@/lib/site-url";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { instanceSlug: string; category: string; slug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  const a = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
    const rows = await tx<ArticleRow[]>`
      SELECT a.slug, a.title, a.summary, a.body_markdown, a.hero_image_url,
             a.published_at, a.author_doctor_id, a.category_id,
             ac.slug AS category_slug, a.updated_at
        FROM article a
        JOIN article_category ac
          ON a.category_id = ac.id AND a.instance_id = ac.instance_id
       WHERE a.slug = ${params.slug}
         AND ac.slug = ${params.category}
       LIMIT 1
    `;
    return rows.length > 0 ? normalizeArticle(rows[0]!) : null;
  });
  if (!a) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: a.headline,
    description: a.summary,
    canonicalPath: `/insights/${a.categorySlug}/${a.slug}`,
    ogType: "article",
    imageUrl: a.heroImageUrl ?? undefined,
  });
}

export default async function ArticleDetailPage({
  params,
}: {
  params: { instanceSlug: string; category: string; slug: string };
}) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();

  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
    const rows = await tx<ArticleRow[]>`
      SELECT a.slug, a.title, a.summary, a.body_markdown, a.hero_image_url,
             a.published_at, a.author_doctor_id, a.category_id,
             ac.slug AS category_slug, a.updated_at
        FROM article a
        JOIN article_category ac
          ON a.category_id = ac.id AND a.instance_id = ac.instance_id
       WHERE a.slug = ${params.slug}
         AND ac.slug = ${params.category}
       LIMIT 1
    `;
    if (rows.length === 0) return null;
    const article = normalizeArticle(rows[0]!);
    let author = null;
    if (article.authorDoctorId) {
      const doctorRows = await tx<DoctorProfileRow[]>`
        SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
          FROM doctor_profile
         WHERE id = ${article.authorDoctorId}::uuid
         LIMIT 1
      `;
      author = doctorRows.length > 0 ? normalizeDoctor(doctorRows[0]!) : null;
    }
    return { article, author };
  });
  if (!data) notFound();

  const base = `/${params.instanceSlug}`;
  const hostOrigin = siteBaseUrl(params.instanceSlug);
  const graph = articleDetailGraph(
    { siteBaseUrl: hostOrigin, pagePath: `/insights/${data.article.categorySlug}/${data.article.slug}` },
    initial.clinic,
    data.article,
    data.author,
  );

  return (
    <>
      <JsonLdScript graph={graph} />
      <Breadcrumb items={[
        { label: "홈", href: base },
        { label: "인사이트", href: null },
        { label: data.article.headline, href: null },
      ]} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        {data.article.heroImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.article.heroImageUrl} alt="" className="mb-6 aspect-video w-full rounded-md object-cover" />
        ) : null}
        <h1 className="text-3xl font-bold text-fg-default">{data.article.headline}</h1>
        <p className="mt-2 text-base text-fg-muted">{data.article.summary}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-fg-muted">
          {data.article.publishedAt ? (
            <time dateTime={data.article.publishedAt.toISOString()}>
              {data.article.publishedAt.toISOString().slice(0, 10)}
            </time>
          ) : null}
          {data.author ? <span>저자: {data.author.name}</span> : null}
        </div>
        <div className="mt-8">
          <ArticleBody markdown={data.article.body} hostOrigin={hostOrigin} />
        </div>
      </article>
    </>
  );
}
