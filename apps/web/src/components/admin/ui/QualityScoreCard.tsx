// @glitzy/web/components/admin/ui/QualityScoreCard — ADMIN_UX_REDESIGN v1.0 § 7.9 + § 11 (UX-UI-09 · UX-QUALITY-01)
// 품질 점수 표시 + 4 카테고리 breakdown + 추천 항목 list.

import Link from "next/link";

export type QualityScore = {
  total: number;                          // 0~100
  breakdown: {
    recommended: number;                  // 0~30
    eat: number;                          // 0~30
    seo: number;                          // 0~20
    compliance: number;                   // 0~20
  };
  suggestions: Array<{
    id: string;
    label: string;
    pointsGain: number;
    href: string;
  }>;
};

export type QualityScoreCardProps = { score: QualityScore };

const CATEGORY_LABEL: Record<keyof QualityScore["breakdown"], string> = {
  recommended: "출시 권장",
  eat: "신뢰 자료",
  seo: "검색 노출",
  compliance: "표현 검수",
};

const CATEGORY_MAX: Record<keyof QualityScore["breakdown"], number> = {
  recommended: 30,
  eat: 30,
  seo: 20,
  compliance: 20,
};

export function QualityScoreCard({ score }: QualityScoreCardProps) {
  const scoreColor = score.total >= 80 ? "text-success" : score.total >= 50 ? "text-warning" : "text-error";

  return (
    <section className="flex flex-col gap-4 rounded-md border border-border bg-elevated p-5">
      <header className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-fg-default">📈 품질 점수</h2>
        <div className={`text-3xl font-semibold ${scoreColor}`}>{score.total}<span className="text-base text-fg-muted">/100</span></div>
      </header>

      {/* breakdown 4 카테고리 progress bar */}
      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(score.breakdown) as Array<keyof QualityScore["breakdown"]>).map((cat) => {
          const value = score.breakdown[cat];
          const max = CATEGORY_MAX[cat];
          const percent = max === 0 ? 0 : Math.round((value / max) * 100);
          return (
            <div key={cat} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-fg-muted">{CATEGORY_LABEL[cat]}</span>
                <span className="font-medium text-fg-default">{value}/{max}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-subtle">
                <div
                  className="h-full bg-brand-primary"
                  style={{ width: `${percent}%` }}
                  aria-label={`${CATEGORY_LABEL[cat]} ${percent}%`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 추천 항목 list (정렬: pointsGain DESC) */}
      {score.suggestions.length > 0 && (
        <div className="border-t border-border pt-3">
          <div className="mb-2 text-xs font-medium text-fg-muted">개선 추천 (최대 5건)</div>
          <ul className="flex flex-col gap-1">
            {score.suggestions.slice(0, 5).map((s) => (
              <li key={s.id}>
                <Link
                  href={s.href}
                  className="flex items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-subtle"
                >
                  <span className="text-fg-default">{s.label}</span>
                  <span className="text-xs font-medium text-brand-primary">+{s.pointsGain}점</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
