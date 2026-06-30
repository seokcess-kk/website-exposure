// @glitzy/web/components/site/EvidenceCard — EVIDENCE_LINKING_PLAN v0.2 § 7·8 · 9
//
// 공개 사이트 안 "이 글의 근거" 섹션에서 노출되는 카드.
// target_type 별 분기 layout — Publication/MediaAppearance/TreatmentPage/FAQ/Article 모두 cover.

import Link from "next/link";

import type { SeoLinkTargetType } from "@glitzy/core-content";

export type EvidenceCardItem = {
  targetType: SeoLinkTargetType;
  targetId: string;
  slug: string;
  title: string;
  /** Publication·MediaAppearance: 발행 매체/저널. Treatment: pillar. Article: category. FAQ: 부재. */
  sublabel?: string | null;
  /** Article 전용 — 정확한 내부 path `/insights/{categorySlug}/{slug}` 생성용. 부재 시 /insights 인덱스 fallback. */
  categorySlug?: string | null;
  /** 외부 자료 (Publication.url · MediaAppearance.url) 가 있으면 새 탭으로. 아니면 내부 site path. */
  externalUrl?: string | null;
  /** 발행일자 (Publication.publishedDate / MediaAppearance.publishedDate) — YYYY-MM-DD */
  publishedDate?: string | null;
};

function badgeFor(targetType: SeoLinkTargetType): { label: string; tone: string } {
  switch (targetType) {
    case "Publication":
      return { label: "논문", tone: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    case "MediaAppearance":
      return { label: "미디어 출연", tone: "bg-rose-50 text-rose-700 border-rose-200" };
    case "TreatmentPage":
      return { label: "관련 진료", tone: "bg-sky-50 text-sky-700 border-sky-200" };
    case "MedicalConditionPage":
      return { label: "관련 증상", tone: "bg-violet-50 text-violet-700 border-violet-200" };
    case "FAQ":
      return { label: "관련 FAQ", tone: "bg-amber-50 text-amber-700 border-amber-200" };
    case "Article":
      return { label: "관련 글", tone: "bg-slate-100 text-slate-700 border-slate-200" };
  }
}

function internalHref(instanceSlug: string, item: EvidenceCardItem): string | null {
  switch (item.targetType) {
    case "Publication":
      return `/${instanceSlug}/publications/${item.slug}`;
    case "MediaAppearance":
      return `/${instanceSlug}/media-appearances/${item.slug}`;
    case "TreatmentPage":
      return `/${instanceSlug}/treatments/${item.slug}`;
    case "MedicalConditionPage":
      // MVP 단순화 — conditions 공개 라우트 제거됨. 내부 링크 없음(외부 url 있으면 그쪽 사용).
      return null;
    case "Article":
      // categorySlug 있으면 정확한 detail path, 없으면 insights 인덱스로 fallback
      return item.categorySlug
        ? `/${instanceSlug}/insights/${item.categorySlug}/${item.slug}`
        : `/${instanceSlug}/insights`;
    case "FAQ":
      // MVP 단순화 — /faq 공개 목록 제거됨. 인라인 FAQ 만 유지.
      return null;
  }
}

export function EvidenceCard({
  item,
  instanceSlug,
}: {
  item: EvidenceCardItem;
  instanceSlug: string;
}) {
  const badge = badgeFor(item.targetType);

  // 외부 link 우선 (논문·미디어), 그 외 내부 site path
  const usesExternal = Boolean(item.externalUrl);
  const href = usesExternal ? item.externalUrl! : internalHref(instanceSlug, item);
  if (!href) return null;

  const inner = (
    <article className="flex h-full flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-400 hover:shadow-sm">
      <header className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${badge.tone}`}
        >
          {badge.label}
        </span>
        {item.publishedDate && (
          <time className="text-[11px] text-slate-500">{item.publishedDate}</time>
        )}
      </header>
      <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
        {item.title}
      </h4>
      {item.sublabel && (
        <p className="line-clamp-1 text-xs text-slate-500">{item.sublabel}</p>
      )}
      {usesExternal && (
        <span className="mt-auto text-[11px] text-slate-400">↗ 원문 새 창으로</span>
      )}
    </article>
  );

  return usesExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
      {inner}
    </a>
  ) : (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  );
}
