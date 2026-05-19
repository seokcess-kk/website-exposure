// @glitzy/web/components/admin/ui/ReleaseReadinessCard — ADMIN_UX_REDESIGN v1.0 § 4.2 + § 7
// 대시보드 안 출시 준비도 카드 — blockers + recommendedItems + nextAction + lifecycle badge + 출시 trigger.

import Link from "next/link";
import type { ReleaseReadiness } from "@/lib/admin/release-readiness";

export type ReleaseReadinessCardProps = {
  readiness: ReleaseReadiness;
  instanceSlug: string;
  /** 출시 미리보기 열기 trigger — 부모 client component 안 ReleasePreviewModal mount */
  onOpenPreview?: () => void;
};

const LIFECYCLE_LABEL: Record<ReleaseReadiness["lifecycle"], string> = {
  draft: "초기 설정 중",
  ready: "출시 준비 완료",
  "release-pending": "검수 대기 중",
  published: "발행됨",
};

const LIFECYCLE_COLOR: Record<ReleaseReadiness["lifecycle"], string> = {
  draft: "bg-warning-subtle text-warning",
  ready: "bg-success-subtle text-success",
  "release-pending": "bg-info-subtle text-info",
  published: "bg-success-subtle text-success",
};

export function ReleaseReadinessCard({ readiness, instanceSlug, onOpenPreview }: ReleaseReadinessCardProps) {
  const scoreColor = readiness.scorePercent >= 80
    ? "text-success"
    : readiness.scorePercent >= 50
    ? "text-warning"
    : "text-error";

  return (
    <section className="flex flex-col gap-4 rounded-md border border-border bg-elevated p-5">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-fg-default">🚀 출시 준비도</h2>
        <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${LIFECYCLE_COLOR[readiness.lifecycle]}`}>
          {LIFECYCLE_LABEL[readiness.lifecycle]}
        </span>
      </header>

      {/* 점수 + 출시 trigger */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className={`text-4xl font-semibold ${scoreColor}`}>
            {readiness.scorePercent}<span className="text-base text-fg-muted">%</span>
          </div>
          <div className="mt-1 text-xs text-fg-muted">
            {readiness.releasable
              ? "✅ 출시 가능"
              : `차단 ${readiness.blockers.length}건 / 권장 ${readiness.recommendedItems.length}건`}
          </div>
        </div>
        {onOpenPreview && (
          <button
            type="button"
            onClick={onOpenPreview}
            className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-fg-inverse hover:bg-brand-primary-hover disabled:opacity-50"
            disabled={readiness.lifecycle === "published"}
          >
            {readiness.lifecycle === "published" ? "발행됨" : "출시 미리보기"}
          </button>
        )}
      </div>

      {/* nextAction (가장 영향 큰 1건) */}
      {readiness.nextAction && (
        <div className={`rounded-md border px-3 py-2 text-sm ${
          readiness.nextAction.kind === "blocking"
            ? "border-error bg-error-subtle"
            : "border-warning bg-warning-subtle"
        }`}>
          <div className="text-xs font-medium text-fg-muted">
            {readiness.nextAction.kind === "blocking" ? "❌ 다음 차단" : "⚠️ 다음 권장"}
          </div>
          <Link
            href={resolveHref(readiness.nextAction.href, instanceSlug)}
            className="mt-0.5 block text-fg-default hover:underline"
          >
            {readiness.nextAction.label}
          </Link>
        </div>
      )}

      {/* blockers list (top 5) */}
      {readiness.blockers.length > 0 && (
        <details open className="rounded-md border border-border bg-canvas p-3">
          <summary className="cursor-pointer text-sm font-semibold text-error">
            출시 차단 {readiness.blockers.length}건
          </summary>
          <ul className="mt-2 flex flex-col gap-1 text-xs">
            {readiness.blockers.slice(0, 5).map((b, i) => (
              <li key={`${b.field}-${i}`} className="text-fg-default">
                <strong>{b.field}</strong>: {b.message}
              </li>
            ))}
            {readiness.blockers.length > 5 && (
              <li className="text-fg-muted">+ {readiness.blockers.length - 5}건 더</li>
            )}
          </ul>
        </details>
      )}

      {/* recommendedItems link */}
      <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
        <Link
          href={`/admin/${instanceSlug}/release-checklist`}
          className="text-brand-primary hover:underline"
        >
          전체 체크리스트 보기 →
        </Link>
        <span className="text-fg-muted">권장 {readiness.recommendedItems.length}건</span>
      </div>
    </section>
  );
}

function resolveHref(href: string, slug: string): string {
  return href.replace("{slug}", slug);
}
