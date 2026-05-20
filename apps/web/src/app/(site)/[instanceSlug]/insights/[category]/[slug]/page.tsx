// @glitzy/web/(site)/[instanceSlug]/insights/[category]/[slug] — P-010 Article Detail v2 (M 스코프 정합 · 사용자 검수 2026-05-20)
//
// 레이아웃 (treatment 상세 v3 패턴 정합):
//   1. Breadcrumb (홈 / 인사이트 / {카테고리} / {제목})
//   2. Hero 2-col light (eyebrow=카테고리 · H1 · summary · author/date chip · 우측 hero image)
//   3. 본문 2-col (좌 ArticleBody · 우 sticky aside — 저자 mini 카드 + 진료 상담 카드)
//   4. 관련 article grid (같은 카테고리 다른 article 3개)
//   5. 마지막 예약 CTA (메인페이지 Card variant=tinted 패턴 정합)

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import {
  normalizeArticle,
  normalizeDoctor,
  formatAddress,
  type ArticleRow,
  type DoctorProfileRow,
} from "@/lib/db-projection";
import { loadSiteInitial } from "@/lib/site-initial";
import { ArticleBody } from "@/components/site/ArticleBody";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { ReservationChannels } from "@/components/site/ReservationChannels";
import { ArticleListCard, type ArticleListCardItem } from "@/components/site/ArticleListCard";
import { buildPageMetadata } from "@/lib/site-metadata";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { articleDetailGraph } from "@/lib/json-ld/builders";
import { siteBaseUrl } from "@/lib/site-url";
import { Card, PillLink, Reveal, SectionHeading } from "@/components/site/ui";

export const revalidate = 60;

type RelatedRow = {
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

export async function generateMetadata({
  params,
}: {
  params: { instanceSlug: string; category: string; slug: string };
}): Promise<Metadata> {
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
    const rows = await tx<(ArticleRow & { category_name: string })[]>`
      SELECT a.slug, a.title, a.summary, a.body_markdown, a.hero_image_url,
             a.published_at, a.author_doctor_id, a.category_id,
             ac.slug AS category_slug, ac.name AS category_name, a.updated_at
        FROM article a
        JOIN article_category ac
          ON a.category_id = ac.id AND a.instance_id = ac.instance_id
       WHERE a.slug = ${params.slug}
         AND ac.slug = ${params.category}
       LIMIT 1
    `;
    if (rows.length === 0) return null;
    const articleRow = rows[0]!;
    const article = normalizeArticle(articleRow);
    const categoryName = articleRow.category_name;

    let author: ReturnType<typeof normalizeDoctor> | null = null;
    if (article.authorDoctorId) {
      const doctorRows = await tx<DoctorProfileRow[]>`
        SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
          FROM doctor_profile
         WHERE id = ${article.authorDoctorId}::uuid
         LIMIT 1
      `;
      author = doctorRows.length > 0 ? normalizeDoctor(doctorRows[0]!) : null;
    }

    const relatedRows = await tx<RelatedRow[]>`
      SELECT a.slug, a.title, a.summary, a.hero_image_url, a.published_at, a.external_url,
             ac.slug AS category_slug, ac.name AS category_name,
             dp.name AS author_name
        FROM article a
        JOIN article_category ac ON a.category_id = ac.id AND a.instance_id = ac.instance_id
        LEFT JOIN doctor_profile dp ON a.author_doctor_id = dp.id AND a.instance_id = dp.instance_id
       WHERE a.status = 'published'
         AND ac.slug = ${params.category}
         AND a.slug <> ${params.slug}
       ORDER BY a.published_at DESC NULLS LAST
       LIMIT 3
    `;

    return { article, categoryName, author, related: relatedRows };
  });

  if (!data) notFound();
  const { article, categoryName, author, related } = data;
  const base = `/${params.instanceSlug}`;
  const hostOrigin = siteBaseUrl(params.instanceSlug);
  const graph = articleDetailGraph(
    { siteBaseUrl: hostOrigin, pagePath: `/insights/${article.categorySlug}/${article.slug}` },
    initial.clinic,
    article,
    author,
  );

  const breadcrumbItems: Array<{ label: string; href: string | null }> = [
    { label: "홈", href: base },
    { label: "인사이트", href: `${base}/insights` },
    { label: categoryName, href: `${base}/insights/${article.categorySlug}` },
    { label: article.headline, href: null },
  ];

  const relatedItems: ArticleListCardItem[] = related.map((r) => ({
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

  return (
    <>
      <JsonLdScript graph={graph} />
      <Breadcrumb items={breadcrumbItems} />

      {/* === 1. Hero 2-col light === */}
      <section className="bg-subtle/50 py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* 좌측 텍스트 */}
            <Reveal>
              <div>
                <span className="text-eyebrow">{categoryName}</span>
                <h1 className="mt-5 font-serif-display text-4xl tracking-tightest text-ink-strong md:text-5xl lg:text-6xl">
                  {article.headline}
                </h1>
                <p className="mt-6 text-lg leading-[1.7] text-fg-muted md:text-xl">
                  {article.summary}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-fg-muted">
                  {author ? (
                    <span className="inline-flex items-center gap-2">
                      <iconify-icon icon="solar:user-circle-bold-duotone" width="18" className="text-brand-primary" />
                      <span className="font-semibold text-ink-strong">{author.name}</span>
                      {author.title ? <span>· {author.title}</span> : null}
                    </span>
                  ) : null}
                  {article.publishedAt ? (
                    <span className="inline-flex items-center gap-2">
                      <iconify-icon icon="solar:calendar-bold-duotone" width="18" className="text-brand-primary" />
                      <time dateTime={article.publishedAt.toISOString()}>
                        {article.publishedAt.toISOString().slice(0, 10)}
                      </time>
                    </span>
                  ) : null}
                </div>
              </div>
            </Reveal>

            {/* 우측 hero image */}
            <Reveal delayMs={120}>
              <div className="relative">
                {article.heroImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.heroImageUrl}
                    alt={article.headline}
                    className="aspect-[4/3] w-full rounded-3xl object-cover shadow-supanova-lg ring-1 ring-border/40"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="flex aspect-[4/3] w-full items-center justify-center rounded-3xl bg-gradient-to-br from-brand-primary-soft via-subtle to-elevated shadow-supanova-lg ring-1 ring-border/40"
                  >
                    <iconify-icon icon="solar:document-text-bold-duotone" width="72" className="text-brand-primary/40" />
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* === 2. 본문 2-col + sticky aside === */}
      <section className="bg-canvas py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
            {/* 좌측 ArticleBody */}
            <article className="min-w-0">
              <ArticleBody markdown={article.body} hostOrigin={hostOrigin} />
            </article>

            {/* 우측 sticky aside */}
            <aside className="lg:sticky lg:top-32 lg:self-start space-y-4">
              {/* 저자 mini 카드 */}
              {author ? (
                <Card padding="lg" variant="tinted">
                  <div className="text-eyebrow mb-3">저자</div>
                  <div className="flex items-start gap-4">
                    {author.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={author.photoUrl}
                        alt={`${author.name}${author.title ? ` ${author.title}` : ""} 프로필 사진`}
                        className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-1 ring-border/40"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-primary-soft text-brand-primary">
                        <iconify-icon icon="solar:user-circle-bold-duotone" width="32" />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold tracking-tight text-ink-strong">{author.name}</h3>
                      {author.title ? (
                        <p className="mt-0.5 text-xs text-fg-muted">{author.title}</p>
                      ) : null}
                      {author.bio ? (
                        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-fg-muted">{author.bio}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-4">
                    <PillLink href={`${base}/doctors/${author.slug}`} variant="ghost" size="md">
                      의료진 소개 보기
                    </PillLink>
                  </div>
                </Card>
              ) : null}

              {/* 진료 상담 카드 */}
              <Card padding="lg" variant="tinted">
                <div className="text-eyebrow mb-3">예약 / 상담</div>
                <h3 className="text-xl font-bold tracking-tight text-ink-strong">진료 안내</h3>
                {initial.locationMain ? (
                  <ul className="mt-5 space-y-3 text-sm text-fg-muted">
                    <li className="flex items-start gap-2">
                      <iconify-icon
                        icon="solar:map-point-bold-duotone"
                        width="18"
                        className="mt-0.5 shrink-0 text-brand-primary"
                      />
                      <span>{formatAddress(initial.locationMain)}</span>
                    </li>
                    {initial.locationMain.telephone ? (
                      <li className="flex items-start gap-2">
                        <iconify-icon
                          icon="solar:phone-calling-bold-duotone"
                          width="18"
                          className="mt-0.5 shrink-0 text-brand-primary"
                        />
                        <a
                          href={`tel:${initial.locationMain.telephone}`}
                          className="font-semibold text-ink-strong hover:text-brand-primary"
                        >
                          {initial.locationMain.telephone}
                        </a>
                      </li>
                    ) : null}
                  </ul>
                ) : null}
                {initial.clinic.primaryCtas.length > 0 ? (
                  <div className="mt-6 border-t border-border/60 pt-6">
                    <ReservationChannels ctas={initial.clinic.primaryCtas} />
                  </div>
                ) : null}
              </Card>

              <p className="text-xs leading-relaxed text-fg-muted/80">
                * 본 인사이트는 일반 정보 제공 목적이며, 개별 진료 가이드는 한의사 진료 후 결정됩니다.<br />
                * 진료 시간 외 문의는 1:1 비밀 상담소를 이용해 주세요.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* === 3. 관련 article grid === */}
      {relatedItems.length > 0 ? (
        <section className="bg-subtle/50 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <SectionHeading
                eyebrow="관련 인사이트"
                title={`${categoryName} 카테고리의 다른 글`}
                description={`${initial.clinic.name} 의 ${categoryName} 카테고리 인사이트를 더 살펴보세요.`}
              />
            </Reveal>
            <Reveal delayMs={120}>
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedItems.map((a) => (
                  <ArticleListCard key={a.slug} article={a} baseHref={base} />
                ))}
              </div>
            </Reveal>
            <Reveal delayMs={240}>
              <div className="mt-10 flex justify-center">
                <PillLink href={`${base}/insights`} variant="secondary" size="md">
                  기사 및 칼럼 모두 보기
                </PillLink>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* === 4. 마지막 예약 CTA (메인페이지 program-reservation 패턴 정합) === */}
      {initial.locationMain || initial.clinic.primaryCtas.length > 0 ? (
        <section className="bg-canvas py-12 md:py-16">
          <div className="mx-auto max-w-5xl px-6">
            <Card padding="lg" variant="tinted">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[auto_1fr_auto] md:items-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary text-fg-inverse shadow-supanova">
                  <iconify-icon icon="solar:calendar-mark-bold-duotone" width="32" />
                </span>
                <div>
                  <div className="text-eyebrow mb-2">예약 안내</div>
                  <h3 className="text-2xl font-bold tracking-tight text-ink-strong">진료 일정을 잡으세요</h3>
                  {initial.locationMain ? (
                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-fg-muted">
                      <span className="inline-flex items-center gap-2">
                        <iconify-icon icon="solar:map-point-bold-duotone" width="18" className="text-brand-primary" />
                        {formatAddress(initial.locationMain)}
                      </span>
                      {initial.locationMain.telephone ? (
                        <span className="inline-flex items-center gap-2">
                          <iconify-icon icon="solar:phone-calling-bold-duotone" width="18" className="text-brand-primary" />
                          <a
                            href={`tel:${initial.locationMain.telephone}`}
                            className="font-semibold text-ink-strong hover:text-brand-primary"
                          >
                            {initial.locationMain.telephone}
                          </a>
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                {initial.clinic.primaryCtas.length > 0 ? (
                  <div className="md:ml-auto">
                    <ReservationChannels ctas={initial.clinic.primaryCtas} />
                  </div>
                ) : null}
              </div>
            </Card>
          </div>
        </section>
      ) : null}
    </>
  );
}
