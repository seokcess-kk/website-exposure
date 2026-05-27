// @glitzy/web/components/admin/TodayActionsCard — Option A 운영자 일상 단순화 v1.0
// 대시보드 최상단 — improvement-queue 안 top 3 action.
// 0 action 시 healthy 안내.

import Link from "next/link";
import type { TodayAction } from "@/lib/admin/today-actions";

export function TodayActionsCard({
  actions,
  improvementQueueHref,
  healthyCount,
  affectedEntityCount,
}: {
  actions: ReadonlyArray<TodayAction>;
  /** 모든 항목 보기 link (개선 큐 page 진입). */
  improvementQueueHref: string;
  healthyCount: number;
  affectedEntityCount: number;
}) {
  return (
    <section className="rounded-lg border border-border bg-elevated p-5">
      <header className="mb-3 flex items-baseline justify-between gap-2">
        <h2 className="text-base font-semibold text-fg-default">오늘 할 일</h2>
        {actions.length > 0 && (
          <Link href={improvementQueueHref} className="text-xs text-brand-primary hover:underline">
            전체 개선 큐 →
          </Link>
        )}
      </header>

      {actions.length === 0 ? (
        <div className="rounded-md border border-success/40 bg-success/5 px-4 py-3 text-sm text-fg-default">
          오늘 행동 권장 항목이 없습니다.
          {healthyCount > 0 && (
            <span className="ml-1 text-fg-muted">건강한 발행 콘텐츠 {healthyCount}건 · 잘 운영되고 있습니다.</span>
          )}
        </div>
      ) : (
        <ol className="flex flex-col gap-2">
          {actions.map((a, idx) => (
            <li key={a.category}>
              <Link
                href={a.href}
                className="flex items-center justify-between gap-3 rounded-md border border-border bg-canvas px-4 py-3 transition hover:border-brand-primary hover:bg-bg-hover"
              >
                <div className="flex items-baseline gap-3 min-w-0">
                  <span className="shrink-0 text-xs font-semibold text-fg-muted">{idx + 1}.</span>
                  <span className="truncate text-sm text-fg-default">{a.title}</span>
                </div>
                <span className="shrink-0 text-xs font-medium text-brand-primary">→</span>
              </Link>
            </li>
          ))}
        </ol>
      )}

      {actions.length > 0 && (
        <footer className="mt-3 text-[11px] text-fg-muted">
          개선 영향 콘텐츠 {affectedEntityCount}건 · 건강한 콘텐츠 {healthyCount}건
        </footer>
      )}
    </section>
  );
}
