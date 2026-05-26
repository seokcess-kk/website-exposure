// @glitzy/web/components/site/ArticleListCard — Supanova Double-Bezel (TreatmentCard 패턴 정합)
// SoT: 사용자 검수 2026-05-20 — /insights list 페이지 안 article card

import Link from "next/link";

export type ArticleListCardItem = {
  slug: string;
  headline: string;
  summary: string;
  heroImageUrl: string | null;
  categorySlug: string;
  categoryName?: string | null;
  publishedAt: Date | null;
  authorName: string | null;
  externalUrl: string | null;
};

export function ArticleListCard({
  article,
  baseHref,
}: {
  article: ArticleListCardItem;
  baseHref: string;
}) {
  // 위키형 정보계층 정합 — 외부 매체 보도 글도 internal detail 페이지로 통일.
  //   detail 페이지에서 "언론 보도" 배지 + "원문 보기" 버튼 + body_markdown 발췌 노출.
  //   externalUrl 은 detail 페이지 안 outbound CTA 로만 사용.
  const internalHref = `${baseHref}/insights/${article.categorySlug}/${article.slug}`;
  const isExternal = Boolean(article.externalUrl);

  return (
    <Link
      href={internalHref}
      className="group relative block overflow-hidden rounded-[2rem] bg-elevated ring-1 ring-border/40 shadow-supanova transition-all duration-500 ease-supanova hover:-translate-y-1 hover:shadow-supanova-lg"
    >
      <div className="relative">
        {article.heroImageUrl ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.heroImageUrl}
              alt={article.headline}
              className="aspect-video w-full object-cover transition-transform duration-700 ease-supanova group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            {/* 외부 보도 자료 — 우상단 배지 */}
            {isExternal ? (
              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-canvas/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-primary backdrop-blur">
                <iconify-icon icon="solar:arrow-right-up-bold" width="11" />
                언론 보도
              </span>
            ) : null}
          </div>
        ) : (
          <div className="relative">
            <div
              aria-hidden
              className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-brand-primary-soft via-subtle to-elevated"
            >
              <iconify-icon icon="solar:document-text-bold-duotone" width="48" className="text-brand-primary/40" />
            </div>
            {isExternal ? (
              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-canvas/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-primary backdrop-blur">
                <iconify-icon icon="solar:arrow-right-up-bold" width="11" />
                언론 보도
              </span>
            ) : null}
          </div>
        )}
        <div className="flex flex-col gap-3 p-6 md:p-7">
          {article.categoryName ? (
            <span className="text-xs font-medium uppercase tracking-wider text-brand-primary">
              {article.categoryName}
            </span>
          ) : null}
          <h3 className="text-xl font-bold tracking-tight text-ink-strong transition-colors duration-500 ease-supanova group-hover:text-brand-primary">
            {article.headline}
          </h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-fg-muted">{article.summary}</p>
          {article.authorName || article.publishedAt ? (
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-muted">
              {article.authorName ? (
                <span className="font-medium text-ink-strong">{article.authorName}</span>
              ) : null}
              {article.publishedAt ? (
                <time dateTime={article.publishedAt.toISOString()}>
                  {article.publishedAt.toISOString().slice(0, 10)}
                </time>
              ) : null}
            </div>
          ) : null}
          <span className="mt-1 inline-flex items-center text-xs font-medium text-brand-primary">
            자세히 보기
          </span>
        </div>
      </div>
    </Link>
  );
}
