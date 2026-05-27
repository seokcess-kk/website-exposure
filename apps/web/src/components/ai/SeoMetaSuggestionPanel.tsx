// @glitzy/web/components/ai/SeoMetaSuggestionPanel — CONTENT_AI_ASSIST_PLAN v1.0 § 6
// SEO 메타 AI 제안 — 3 entity form 안 mount 공통 컴포넌트.
//   - "AI 제안 ✨" 버튼 + 결과 modal (title · metaDescription · slug · 수락 시 form field 채움).
//   - body 안 LLM JSON 결과 표시 + accept 시 onApply 호출.

"use client";

import type { SeoMetaSuggestOutput } from "@/lib/ai/prompt-templates";
import { useSeoMetaSuggest } from "@/hooks/useSeoMetaSuggest";
import { AiSuggestionButton } from "./AiSuggestionButton";
import { AiSuggestionModal } from "./AiSuggestionModal";

export type SeoMetaSuggestionPanelProps = {
  instanceSlug: string;
  entityType: "Article" | "TreatmentPage" | "FAQ";
  /** 현재 form state 안 입력값을 dynamic 하게 LLM input 으로 전달. */
  getInput: () => {
    currentTitle?: string;
    currentDescription?: string;
    category?: string;
    targetKeyword?: string;
    entityId?: string;
  };
  /** accept 시 호출 — form field 채움. */
  onApply: (data: SeoMetaSuggestOutput) => void;
  /** 버튼 label override (FAQ 안 "AI 제안 — 질문/답변" 등). */
  buttonLabel?: string;
  /** 버튼 disabled (currentTitle 길이 부족 등). */
  disabled?: boolean;
};

export function SeoMetaSuggestionPanel({
  instanceSlug,
  entityType,
  getInput,
  onApply,
  buttonLabel,
  disabled,
}: SeoMetaSuggestionPanelProps) {
  const suggest = useSeoMetaSuggest(instanceSlug);

  const handleSuggest = async () => {
    const input = getInput();
    await suggest.trigger({ entityType, ...input });
  };

  const result = suggest.result;
  const errorMessage = result && result.ok === false ? result.message : null;
  const data = result && result.ok ? result.data : null;
  const logId = result?.logId ?? null;

  return (
    <>
      <AiSuggestionButton
        onSuggest={handleSuggest}
        label={buttonLabel ?? "AI 제안 ✨"}
        disabled={disabled || suggest.pending}
        title="AI 가 SEO 메타 (제목 · 설명 · slug) 를 제안합니다."
      />
      {suggest.open && (
        <AiSuggestionModal
          title="AI 제안 · SEO 메타"
          instanceSlug={instanceSlug}
          logId={logId}
          errorMessage={errorMessage}
          onClose={suggest.close}
          onAccept={() => {
            if (data) onApply(data);
          }}
          acceptDisabled={!data}
        >
          {data && (
            <div className="flex flex-col gap-3">
              <SuggestionRow label="제목" value={data.title} />
              <SuggestionRow label="설명" value={data.metaDescription} />
              <SuggestionRow label="slug" value={data.slug} mono />
              <p className="rounded-md bg-subtle px-3 py-2 text-xs text-fg-muted">
                ※ 수락 시 폼 입력란이 채워집니다. 필요 시 직접 수정 후 저장하세요. 의료광고법 검수 책임은 운영자에게 있습니다.
              </p>
            </div>
          )}
        </AiSuggestionModal>
      )}
    </>
  );
}

function SuggestionRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs font-medium uppercase tracking-wide text-fg-muted">{label}</div>
      <div
        className={
          mono
            ? "rounded-md border border-border bg-canvas px-3 py-1.5 font-mono text-xs text-fg-default"
            : "rounded-md border border-border bg-canvas px-3 py-2 text-sm text-fg-default whitespace-pre-wrap"
        }
      >
        {value}
      </div>
    </div>
  );
}
