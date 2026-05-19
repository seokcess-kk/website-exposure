// @glitzy/web/components/site/TreatmentPillarsGrid — 진료 영역(pillars) 카드 그리드
// 4개 일반에 sm:grid-cols-2 lg:grid-cols-4 반응형 + hover 미세 lift + iconify-icon 라인 아이콘.

export type TreatmentPillar = {
  readonly icon: string; // iconify icon name (e.g. "mdi:fire-outline")
  readonly title: string;
  readonly subtitle: string;
};

export function TreatmentPillarsGrid({ pillars }: { pillars: ReadonlyArray<TreatmentPillar> }) {
  if (pillars.length === 0) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {pillars.map((p) => (
        <div
          key={p.title}
          className="group relative rounded-2xl bg-elevated p-6 ring-1 ring-border/40 shadow-supanova transition-all duration-500 ease-supanova hover:-translate-y-1 hover:shadow-supanova-lg"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary-soft text-brand-primary ring-1 ring-brand-primary/10 transition-colors duration-500 group-hover:bg-brand-primary group-hover:text-canvas">
            <iconify-icon icon={p.icon} width="26" height="26" />
          </div>
          <h3 className="text-base font-semibold tracking-tight text-ink-strong">{p.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{p.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
