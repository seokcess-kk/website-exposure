// @glitzy/web/components/ai/ReviewCommentSuggestionPanel — CONTENT_AI_ASSIST_PLAN v1.0 § 5.3
// 검수자 코멘트 보조 — reject textarea 옆 "AI 보조 ✨".

"use client";

import { useState } from "react";
import { suggestReviewCommentAction } from "@/lib/ai/suggest-review-comment";
import type { ReviewCommentSuggestOutput } from "@/lib/ai/prompt-templates";
import type { SuggestionResult } from "@/lib/ai/suggestion-result";

import { AiSuggestionButton } from "./AiSuggestionButton";
import { AiSuggestionModal } from "./AiSuggestionModal";

export type ReviewCommentSuggestionPanelProps = {
  instanceSlug: string;
  entryId: string;
  /** 현 textarea 값 (운영자 short note). LLM input 안 reviewerShortNote 로 사용. */
  getShortNote: () => string;
  /** accept 시 textarea 값 갱신 — caller 가 정의. */
  onApply: (comment: string) => void;
};

export function ReviewCommentSuggestionPanel({
  instanceSlug,
  entryId,
  getShortNote,
  onApply,
}: ReviewCommentSuggestionPanelProps) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<SuggestionResult<ReviewCommentSuggestOutput> | null>(null);
  const [pending, setPending] = useState(false);

  const trigger = async () => {
    if (pending) return;
    setPending(true);
    try {
      const note = getShortNote().trim();
      const r = await suggestReviewCommentAction(instanceSlug, {
        entryId,
        reviewerShortNote: note.length > 0 ? note : undefined,
      });
      setResult(r);
      setOpen(true);
    } finally {
      setPending(false);
    }
  };

  const close = () => {
    setOpen(false);
    setResult(null);
  };

  const errorMessage = result && result.ok === false ? result.message : null;
  const data = result && result.ok ? result.data : null;
  const logId = result?.logId ?? null;

  return (
    <>
      <AiSuggestionButton
        onSuggest={trigger}
        label="AI 보조 ✨"
        disabled={pending}
        title="현재 거부 사유 짧은 메모 + 의료광고법 검수 결과를 종합해 AI 가 코멘트 초안을 생성합니다."
      />
      {open && (
        <AiSuggestionModal
          title="AI 보조 · 검수 코멘트 초안"
          instanceSlug={instanceSlug}
          logId={logId}
          errorMessage={errorMessage}
          onClose={close}
          onAccept={() => {
            if (data) onApply(data.comment);
          }}
          acceptDisabled={!data}
        >
          {data && (
            <div className="flex flex-col gap-3">
              <div className="rounded-md border border-border bg-canvas px-3 py-2 text-sm text-fg-default whitespace-pre-wrap">
                {data.comment}
              </div>
              <p className="rounded-md bg-subtle px-3 py-2 text-xs text-fg-muted">
                ※ 수락 시 거부 사유 텍스트박스에 적용됩니다. 필요 시 직접 수정 후 거부하세요. 검수 책임은 검수자에게 있습니다.
              </p>
            </div>
          )}
        </AiSuggestionModal>
      )}
    </>
  );
}
