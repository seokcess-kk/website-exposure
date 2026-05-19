// @glitzy/web/components/admin/ui/ReleasePreviewModal — ADMIN_UX_REDESIGN v1.0 § 7.8 + § 10 (UX-UI-08 · UX-PREVIEW-01)
// 출시 미리보기 + 누락 검사 + 검수 요청 한 클릭. iframe src 안 same-origin.

"use client";

import { useState } from "react";
import type { InstanceReleaseResult, ReleaseBlocker, ReleaseChecklistItem } from "@/lib/admin/release-evaluator-types";

export type ReleasePreviewModalProps = {
  instanceSlug: string;
  evalResult: InstanceReleaseResult;
  onConfirm: () => Promise<void>;
  onClose: () => void;
};

export function ReleasePreviewModal({ instanceSlug, evalResult, onConfirm, onClose }: ReleasePreviewModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "출시 검수 요청에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="release-preview-title"
    >
      <div className="flex h-[90vh] w-[95vw] max-w-6xl flex-col rounded-lg border border-border bg-elevated shadow-xl">
        {/* header */}
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 id="release-preview-title" className="text-lg font-semibold text-fg-default">
            🚀 출시 미리보기 · 검수 요청
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-fg-muted hover:bg-subtle hover:text-fg-default"
            aria-label="닫기"
          >
            ✕
          </button>
        </header>

        {/* body — left: checklist · right: iframe preview */}
        <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden p-4 md:grid-cols-[20rem_1fr]">
          {/* 왼쪽: 누락 검사 결과 */}
          <aside className="flex flex-col gap-3 overflow-y-auto pr-2">
            <div className="rounded-md border border-border bg-canvas p-3">
              <div className="mb-1 text-xs font-medium text-fg-muted">출시 준비도</div>
              <div className="text-3xl font-semibold text-fg-default">{evalResult.scorePercent}%</div>
              <div className="mt-1 text-xs text-fg-muted">
                {evalResult.releasable ? "✅ 출시 가능" : `${evalResult.blockers.length}개 차단 항목`}
              </div>
            </div>

            {evalResult.blockers.length > 0 && (
              <section className="rounded-md border border-error bg-error-subtle p-3">
                <div className="mb-2 text-sm font-semibold text-fg-default">❌ 출시 차단</div>
                <ul className="flex flex-col gap-1 text-xs">
                  {evalResult.blockers.map((b: ReleaseBlocker, i) => (
                    <li key={`${b.source}-${b.field}-${i}`} className="text-fg-default">
                      <strong>{b.field}</strong>: {b.message}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {evalResult.recommendedItems.length > 0 && (
              <section className="rounded-md border border-warning bg-warning-subtle p-3">
                <div className="mb-2 text-sm font-semibold text-fg-default">⚠️ 출시 권장</div>
                <ul className="flex flex-col gap-1 text-xs">
                  {evalResult.recommendedItems.map((r: ReleaseChecklistItem) => (
                    <li key={r.id} className="text-fg-default">
                      <a href={r.href} className="hover:underline" target="_blank" rel="noopener noreferrer">
                        {r.label}
                      </a>
                      {r.reason && <span className="text-fg-muted"> · {r.reason}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>

          {/* 오른쪽: iframe 공개 사이트 미리보기 (same-origin) */}
          <div className="flex flex-col overflow-hidden rounded-md border border-border">
            <div className="border-b border-border bg-subtle px-3 py-1 text-xs text-fg-muted">
              공개 사이트 미리보기 · /{instanceSlug}/
            </div>
            <iframe
              src={`/${instanceSlug}/`}
              title={`${instanceSlug} 공개 사이트 미리보기`}
              className="flex-1 bg-canvas"
              sandbox="allow-same-origin allow-scripts allow-forms"
            />
          </div>
        </div>

        {/* footer */}
        <footer className="flex items-center justify-between gap-3 border-t border-border px-6 py-4">
          {error && (
            <div className="flex-1 rounded-md border border-error bg-error-subtle px-3 py-2 text-xs text-fg-default">
              {error}
            </div>
          )}
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border bg-elevated px-4 py-2 text-sm text-fg-default hover:bg-subtle"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!evalResult.releasable || submitting}
              className="rounded-md bg-brand-primary px-5 py-2 text-sm font-semibold text-fg-inverse hover:bg-brand-primary-hover disabled:opacity-50"
            >
              {submitting ? "요청 중…" : evalResult.releasable ? "출시 검수 요청" : `차단 ${evalResult.blockers.length}개 해결 후 가능`}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
