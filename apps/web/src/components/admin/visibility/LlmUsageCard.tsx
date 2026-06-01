// @glitzy/web/components/admin/visibility/LlmUsageCard — CONTENT_AI_ASSIST_PLAN v1.0 cycle 2 #16
// 오늘 attempted calls + 이번 달 success calls/cost + prompt_template 분포.
// daily quota 게이지 + 0 row 시 안내 message.

import type { LlmUsageSummary } from "@/lib/admin/llm-usage-summary";
import type { LlmPromptTemplate } from "@glitzy/core-content";

const TEMPLATE_LABEL: Record<LlmPromptTemplate, string> = {
  "seo-meta-suggest": "SEO 메타",
  "keyword-match-suggest": "키워드 매핑",
  "review-comment-suggest": "검수 코멘트",
  "article-full-draft": "칼럼 Draft",
  "article-brief-draft": "Brief Draft",
  "treatment-page-full-draft": "시술 Draft",
  "medical-condition-page-full-draft": "증상 Draft",
  "faq-full-draft": "FAQ Draft",
};

function formatCost(cost: number): string {
  if (cost === 0) return "$0";
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  return `$${cost.toFixed(2)}`;
}

export function LlmUsageCard({ data }: { data: LlmUsageSummary }) {
  const todayUsageRatio = Math.min(data.today.attemptedCalls / Math.max(data.dailyCap, 1), 1);
  const todayPct = Math.round(todayUsageRatio * 100);
  const nearCap = todayUsageRatio >= 0.8;
  const totalTemplate = Object.values(data.byTemplate).reduce((s, n) => s + n, 0);

  return (
    <article className="flex flex-col gap-2 rounded-md border border-border bg-elevated p-4">
      <header className="flex items-baseline justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
          AI 보조 사용량
        </h3>
        <span className="text-[10px] text-fg-muted">{data.todayKst}</span>
      </header>

      {/* 오늘 호출 + cap 게이지 */}
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-fg-default">
            {data.today.attemptedCalls}
          </span>
          <span className="text-xs text-fg-muted">/ {data.dailyCap} 오늘</span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-bg-default" aria-hidden>
          <div
            className={`h-full ${nearCap ? "bg-warning" : "bg-brand-primary"}`}
            style={{ width: `${todayPct}%` }}
          />
        </div>
        {nearCap && (
          <p className="mt-1 text-[11px] text-warning">
            오늘 quota 의 {todayPct}% 사용 — 초과 시 modal 안 안내 표시
          </p>
        )}
      </div>

      {/* 이번 달 누적 + cost */}
      <div className="border-t border-border pt-2">
        <div className="flex items-baseline justify-between text-xs text-fg-muted">
          <span>이번 달 성공 호출</span>
          <span className="font-semibold text-fg-default">{data.month.successCalls}회</span>
        </div>
        <div className="flex items-baseline justify-between text-xs text-fg-muted">
          <span>이번 달 비용</span>
          <span className="font-semibold text-fg-default">{formatCost(data.month.totalCostUsd)}</span>
        </div>
      </div>

      {/* template 분포 */}
      <div className="border-t border-border pt-2">
        {totalTemplate === 0 ? (
          <p className="text-[11px] text-fg-muted">
            아직 AI 보조 사용 기록이 없습니다. 콘텐츠 편집 안 "AI 제안 ✨" 으로 시작하세요.
          </p>
        ) : (
          <ul className="flex flex-col gap-0.5 text-xs text-fg-default">
            {(Object.keys(TEMPLATE_LABEL) as LlmPromptTemplate[]).map((t) => (
              <li key={t} className="flex items-center justify-between">
                <span className="text-fg-muted">{TEMPLATE_LABEL[t]}</span>
                <span className="font-medium">{data.byTemplate[t]}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
