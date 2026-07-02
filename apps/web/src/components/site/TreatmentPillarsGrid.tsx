// @glitzy/web/components/site/TreatmentPillarsGrid — 진료 영역(pillars) 카드 그리드
// 4개 일반에 sm:grid-cols-2 lg:grid-cols-4 반응형 + hover 미세 lift + iconify-icon 라인 아이콘.
// INTERNAL_LINK_AUTOMATION v1 — baseHref + slug 가 있으면 /treatments#pillar-{slug} 클러스터 진입 링크.

import Link from "next/link";

export type TreatmentPillar = {
  readonly icon: string; // iconify icon name (e.g. "mdi:fire-outline")
  readonly title: string;
  readonly subtitle: string;
  readonly slug?: string; // Pillar 클러스터 anchor (/treatments#pillar-{slug}) 용
};

const CARD_CLASS =
  "group relative block rounded-xl bg-elevated p-6 ring-1 ring-border/40 shadow-supanova transition-all duration-500 ease-supanova hover:-translate-y-0.5 hover:shadow-supanova";

export function TreatmentPillarsGrid({
  pillars,
  baseHref,
}: {
  pillars: ReadonlyArray<TreatmentPillar>;
  baseHref?: string;
}) {
  if (pillars.length === 0) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {pillars.map((p) => {
        const inner = (
          <>
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary-soft text-brand-primary ring-1 ring-brand-primary/10 transition-colors duration-500 group-hover:bg-brand-primary group-hover:text-canvas">
              <iconify-icon icon={p.icon} width="26" height="26" />
            </div>
            <h3 className="text-base font-semibold tracking-tight text-ink-strong">{p.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{p.subtitle}</p>
          </>
        );
        // baseHref 는 커스텀 도메인에서 "" (유효한 루트 prefix) — truthiness 로 판정하면 링크가 사라진다.
        const href = baseHref !== undefined && p.slug ? `${baseHref}/treatments#pillar-${p.slug}` : null;
        return href ? (
          <Link key={p.title} href={href} className={`${CARD_CLASS} hover:ring-brand-primary/30`}>
            {inner}
            <span className="mt-3 inline-flex items-center text-xs font-medium text-brand-primary opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              진료 보기 →
            </span>
          </Link>
        ) : (
          <div key={p.title} className={CARD_CLASS}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
