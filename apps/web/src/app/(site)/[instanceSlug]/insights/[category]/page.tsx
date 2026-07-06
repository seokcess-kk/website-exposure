// @glitzy/web/(site)/[instanceSlug]/insights/[category] — Insights List (카테고리별)
// 사용자 검수 2026-05-20 — /insights 와 동일 구조 + breadcrumb + 카테고리 description.

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { loadSiteInitial } from "@/lib/site-initial";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/site-metadata";
import { SectionHeading } from "@/components/site/ui";
import { ArticleListCard, type ArticleListCardItem } from "@/components/site/ArticleListCard";
import { sitePathPrefix } from "@/lib/custom-domains";
import { siteBaseUrl } from "@/lib/site-url";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { insightsCategoryListGraph } from "@/lib/json-ld/builders";

export const revalidate = 300;

type ArticleListRow = {
  slug: string;
  title: string;
  summary: string;
  hero_image_url: string | null;
  published_at: Date | null;
  external_url: string | null;
  category_slug: string;
  category_name: string;
  author_name: string | null;
};

type CategoryRow = {
  slug: string;
  name: string;
  description: string | null;
};

export async function generateMetadata({
  params,
}: {
  params: { instanceSlug: string; category: string };
}): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  const cat = await withPublicTenantTransaction(params.instanceSlug, async (tx, ctx) => {
    const rows = await tx<CategoryRow[]>`
      SELECT slug, name, description FROM article_category
       WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${params.category}
       LIMIT 1
    `;
    return rows.length > 0 ? rows[0]! : null;
  });
  if (!cat) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: `${cat.name} | 인사이트`,
    description: cat.description ?? `${initial.clinic.name} ${cat.name} 카테고리 기사·칼럼.`,
    canonicalPath: `/insights/${cat.slug}`,
  });
}

export default async function InsightsCategoryListPage({
  params,
}: {
  params: { instanceSlug: string; category: string };
}) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();

  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx, ctx) => {
    const catRows = await tx<CategoryRow[]>`
      SELECT slug, name, description FROM article_category
       WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${params.category}
       LIMIT 1
    `;
    if (catRows.length === 0) return null;
    const articleRows = await tx<ArticleListRow[]>`
      SELECT a.slug, a.title, a.summary, a.hero_image_url, a.published_at, a.external_url,
             ac.slug AS category_slug, ac.name AS category_name,
             dp.name AS author_name
        FROM article a
        JOIN article_category ac ON a.category_id = ac.id AND a.instance_id = ac.instance_id
        LEFT JOIN doctor_profile dp ON a.author_doctor_id = dp.id AND a.instance_id = dp.instance_id
       WHERE a.instance_id = ${ctx.instanceId}::uuid
         AND a.status = 'published' AND a.published_at IS NOT NULL AND a.published_at <= now()
         AND ac.slug = ${params.category}
       ORDER BY a.published_at DESC NULLS LAST
    `;
    const allCategoryRows = await tx<{ slug: string; name: string }[]>`
      SELECT slug, name FROM article_category
       WHERE instance_id = ${ctx.instanceId}::uuid
       ORDER BY display_order ASC, name ASC
    `;
    return { category: catRows[0]!, articles: articleRows, allCategories: allCategoryRows };
  });

  if (!data) notFound();
  const base = sitePathPrefix(params.instanceSlug);
  const { category, articles, allCategories } = data;

  const articleItems: ArticleListCardItem[] = articles.map((r) => ({
    slug: r.slug,
    headline: r.title,
    summary: r.summary,
    heroImageUrl: r.hero_image_url,
    categorySlug: r.category_slug,
    categoryName: r.category_name,
    publishedAt: r.published_at,
    authorName: r.author_name,
    externalUrl: r.external_url,
  }));

  const listGraph = insightsCategoryListGraph(
    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: `/insights/${category.slug}` },
    initial.clinic,
    { name: category.name, slug: category.slug },
    articles.map((a) => ({ slug: a.slug, title: a.title, categorySlug: a.category_slug })),
    category.description ?? `${initial.clinic.name} 의 ${category.name} 카테고리 기사·칼럼 모음.`,
  );

  return (
    <>
      <JsonLdScript graph={listGraph} />
      <Breadcrumb items={[
        { label: "홈", href: base || "/" },
        { label: "인사이트", href: `${base}/insights` },
        { label: category.name, href: null },
      ]} />

      <section className="bg-canvas py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            level={1}
            eyebrow="INSIGHTS"
            title={category.name}
            description={category.description ?? `${initial.clinic.name} 의 ${category.name} 카테고리 기사·칼럼 모음.`}
          />

          {/* 카테고리 chip 필터 — 활성 카테고리 강조 */}
          {allCategories.length > 0 ? (
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              <Link
                href={`${base}/insights`}
                className="inline-flex items-center rounded-full border border-border/60 bg-elevated px-4 py-2 text-sm font-medium text-fg-default transition-all duration-500 ease-supanova hover:border-brand-primary/40 hover:bg-brand-primary-soft hover:text-brand-primary"
              >
                전체
              </Link>
              {allCategories.map((c) => {
                const isActive = c.slug === category.slug;
                return (
                  <Link
                    key={c.slug}
                    href={`${base}/insights/${c.slug}`}
                    className={
                      isActive
                        ? "inline-flex items-center rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-fg-inverse"
                        : "inline-flex items-center rounded-full border border-border/60 bg-elevated px-4 py-2 text-sm font-medium text-fg-default transition-all duration-500 ease-supanova hover:border-brand-primary/40 hover:bg-brand-primary-soft hover:text-brand-primary"
                    }
                  >
                    {c.name}
                  </Link>
                );
              })}
            </div>
          ) : null}

          <div className="mt-12">
            {articleItems.length === 0 ? (
              <p className="text-center text-sm text-fg-muted">
                이 카테고리에 등록된 기사가 없습니다.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articleItems.map((a) => (
                  <ArticleListCard key={a.slug} article={a} baseHref={base} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
