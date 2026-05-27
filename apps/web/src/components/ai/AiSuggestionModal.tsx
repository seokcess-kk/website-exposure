// @glitzy/web/components/ai/AiSuggestionModal — CONTENT_AI_ASSIST_PLAN v1.0 § 6.2
// 공통 chrome (header · body · accept/reject footer) — body children 은 caller 가 렌더링.
// accept/reject 시 respondToSuggestionAction 호출 → llm_call_log.accepted UPDATE.

"use client";

import { useState, type ReactNode } from "react";
import { respondToSuggestionAction } from "@/lib/ai/respond-to-suggestion";

export type AiSuggestionModalProps = {
  title: string;
  instanceSlug: string;
  logId: string | null;
  errorMessage?: string | null;
  /** 결과 body 렌더링 — null 시 안내 메시지 표시. */
  children?: ReactNode;
  /** accept 클릭 시 호출 (form field 채움 등) — caller 가 정의. logId UPDATE 는 본 modal 내부 처리. */
  onAccept?: () => void | Promise<void>;
  onClose: () => void;
  acceptLabel?: string;
  /** accept 버튼 비활성화 (예: 파싱 실패 · LLM 응답 없음) */
  acceptDisabled?: boolean;
};

export function AiSuggestionModal({
  title,
  instanceSlug,
  logId,
  errorMessage,
  children,
  onAccept,
  onClose,
  acceptLabel = "수락",
  acceptDisabled,
}: AiSuggestionModalProps) {
  const [pending, setPending] = useState(false);
  const [responseError, setResponseError] = useState<string | null>(null);

  const handleAccept = async () => {
    if (pending) return;
    setPending(true);
    setResponseError(null);
    try {
      if (onAccept) await onAccept();
      if (logId) {
        const res = await respondToSuggestionAction(instanceSlug, logId, true);
        if (!res.ok) setResponseError(res.message);
      }
      onClose();
    } catch (e) {
      setResponseError(e instanceof Error ? e.message : "수락 처리 중 오류");
    } finally {
      setPending(false);
    }
  };

  const handleReject = async () => {
    if (pending) return;
    setPending(true);
    setResponseError(null);
    try {
      if (logId) {
        const res = await respondToSuggestionAction(instanceSlug, logId, false);
        if (!res.ok) setResponseError(res.message);
      }
      onClose();
    } catch (e) {
      setResponseError(e instanceof Error ? e.message : "거절 처리 중 오류");
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-modal p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-suggestion-title"
    >
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-lg border border-border bg-elevated shadow-xl">
        <header className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 id="ai-suggestion-title" className="text-base font-semibold text-fg-default">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="rounded-md p-1 text-fg-muted hover:bg-subtle hover:text-fg-default disabled:opacity-50"
            aria-label="닫기"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 text-sm text-fg-default">
          {errorMessage ? (
            <div className="rounded-md border border-error bg-error-subtle px-3 py-2 text-fg-default">
              {errorMessage}
            </div>
          ) : (
            children
          )}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-border px-5 py-3">
          {responseError && (
            <div className="flex-1 truncate text-xs text-fg-muted">{responseError}</div>
          )}
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={handleReject}
              disabled={pending}
              className="rounded-md border border-border bg-elevated px-3 py-1.5 text-sm text-fg-default hover:bg-subtle disabled:opacity-50"
            >
              {errorMessage ? "닫기" : "거절"}
            </button>
            {!errorMessage && (
              <button
                type="button"
                onClick={handleAccept}
                disabled={pending || acceptDisabled}
                className="rounded-md bg-brand-primary px-4 py-1.5 text-sm font-semibold text-fg-inverse hover:bg-brand-primary-hover disabled:opacity-50"
              >
                {pending ? "처리 중…" : acceptLabel}
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
