// @glitzy/web/components/ai/EntityFullDraftPanel — CONTENT_AI_DRAFT_ENTITY_PLAN v1.0 (CAID-DEFER-02)
// 제네릭 AI Full Draft panel 셸 + page/faq wrapper.
//   - 신규 entity 생성 form 안 "AI Draft 생성" button + modal.
//   - Step A: primary keyword (free text) + secondary keywords (쉼표 · 최대 3) + brief (50~200자).
//   - Step B: 결과 preview (entity 별 renderResult) + "form 에 적용".
// brief 2-stage mini button · publication 추천 없음 (article 과 차이 · 사용자 결정).
// 의료광고법 책임 = 운영자. PII 입력 금지 banner.

"use client";

import { useState, type ReactNode } from "react";
import { useEntityDraft, type EntityDraftInput } from "@/hooks/useEntityDraft";
import type { SuggestionResult } from "@/lib/ai/suggestion-result";
import {
  generatePageFullDraftAction,
  type PageFullDraftActionInput,
} from "@/lib/ai/page-full-draft";
import type { PageEntityKind, PageFullDraftOutput } from "@/lib/ai/prompt-templates";
import { AiSuggestionButton } from "./AiSuggestionButton";
import { AiSuggestionModal } from "./AiSuggestionModal";

const BRIEF_MIN = 50;
const BRIEF_MAX = 200;
const SECONDARY_MAX = 3;

function parseSecondary(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, SECONDARY_MAX);
}

type EntityFullDraftPanelProps<TData> = {
  instanceSlug: string;
  modalTitle: string;
  buttonTitle: string;
  quotaWeight: number;
  action: (input: EntityDraftInput) => Promise<SuggestionResult<TData>>;
  hasFormContent: () => boolean;
  /** Step B 결과 preview — entity 별 필드 렌더. */
  renderResult: (data: TData) => ReactNode;
  /** accept 시 form field 채움. */
  onApply: (data: TData) => void;
  /** primary keyword input placeholder. */
  primaryPlaceholder: string;
  /** brief textarea placeholder. */
  briefPlaceholder: string;
};

function EntityFullDraftPanel<TData>({
  instanceSlug,
  modalTitle,
  buttonTitle,
  quotaWeight,
  action,
  hasFormContent,
  renderResult,
  onApply,
  primaryPlaceholder,
  briefPlaceholder,
}: EntityFullDraftPanelProps<TData>) {
  const draft = useEntityDraft<TData>(action);

  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [secondaryRaw, setSecondaryRaw] = useState("");
  const [brief, setBrief] = useState("");

  const briefLength = brief.length;
  const briefValid = briefLength >= BRIEF_MIN && briefLength <= BRIEF_MAX;
  const primaryValid = primaryKeyword.trim().length > 0;
  const inputValid = briefValid && primaryValid;

  const handleOpenClick = async () => {
    if (hasFormContent()) {
      const ok = window.confirm("기존 내용을 덮어쓰시겠습니까? — AI Draft 생성 시 form 의 내용이 새로 채워집니다.");
      if (!ok) return;
    }
    draft.openModal();
  };

  const handleGenerate = async () => {
    await draft.trigger({
      primaryKeyword: primaryKeyword.trim(),
      secondaryKeywords: parseSecondary(secondaryRaw),
      brief: brief.trim(),
    });
  };

  const result = draft.result;
  const errorMessage = result && result.ok === false ? result.message : null;
  const data = result && result.ok ? result.data : null;
  const logId = result?.logId ?? null;

  const handleApply = () => {
    if (data) onApply(data);
  };

  const handleClose = () => {
    draft.close();
    // primary/secondary/brief 는 reset 안 함 (retry 시 재입력 회피).
  };

  return (
    <>
      <AiSuggestionButton
        onSuggest={handleOpenClick}
        label="AI Draft 생성 ✨"
        title={buttonTitle}
        className="inline-flex items-center gap-1 rounded-md border border-brand-primary bg-brand-primary px-3 py-1.5 text-sm font-medium text-fg-inverse hover:bg-brand-primary-hover disabled:opacity-50"
      />
      {draft.open && (
        <AiSuggestionModal
          title={modalTitle}
          instanceSlug={instanceSlug}
          logId={logId}
          errorMessage={errorMessage}
          onClose={handleClose}
          onAccept={handleApply}
          acceptDisabled={!data}
          acceptLabel="form 에 적용"
        >
          {!data && (
            <div className="flex flex-col gap-4">
              <div className="rounded-md border border-rose-400 bg-rose-50 px-3 py-2 text-xs text-rose-900">
                <strong>⚠ 주의:</strong> 이 panel 안 입력하신 브리프는 Anthropic API 안 전송됩니다.{" "}
                환자 실명·연락처·진료기록·진단 정보 입력 시 PIPA 위반 + 의료법 위반 책임은 운영자에게 있습니다.
              </div>

              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-fg-default">Primary keyword (필수)</span>
                <input
                  type="text"
                  value={primaryKeyword}
                  onChange={(e) => setPrimaryKeyword(e.target.value)}
                  placeholder={primaryPlaceholder}
                  className="rounded-md border border-border bg-canvas px-3 py-1.5 text-sm"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-fg-default">Secondary keywords (선택 · 쉼표로 구분 · 최대 {SECONDARY_MAX})</span>
                <input
                  type="text"
                  value={secondaryRaw}
                  onChange={(e) => setSecondaryRaw(e.target.value)}
                  placeholder="예: 부작용, 회복 기간, 주의사항"
                  className="rounded-md border border-border bg-canvas px-3 py-1.5 text-sm"
                />
                <span className="text-xs text-fg-muted">
                  {parseSecondary(secondaryRaw).length}/{SECONDARY_MAX} 인식됨 · 본문 안 분산 배치됩니다.
                </span>
              </label>

              <div className="flex flex-col gap-1 text-sm">
                <label htmlFor="entity-draft-brief" className="font-medium text-fg-default">
                  Brief (이 페이지가 다룰 주제·논점·결론 1줄) — {BRIEF_MIN}~{BRIEF_MAX}자
                </label>
                <textarea
                  id="entity-draft-brief"
                  rows={3}
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder={briefPlaceholder}
                  className="rounded-md border border-border bg-canvas px-3 py-2 text-sm"
                />
                <span className={briefValid ? "text-xs text-fg-muted" : "text-xs text-rose-700"}>
                  {briefLength}/{BRIEF_MAX}자 {briefValid ? "✓" : `· ${BRIEF_MIN}자 이상 ${BRIEF_MAX}자 이하 필요`}
                </span>
                <span className="text-xs text-fg-muted">
                  ⚠ 환자 이름·연락처·진료기록 등 PII 입력 금지. AI 초안도 운영자 검수 책임.
                </span>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!inputValid || draft.pending}
                  className="rounded-md bg-brand-primary px-4 py-1.5 text-sm font-semibold text-fg-inverse hover:bg-brand-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {draft.pending ? "AI 호출 중…" : `AI Draft 생성 (${quotaWeight} quota 차감)`}
                </button>
              </div>
            </div>
          )}

          {data && (
            <div className="flex flex-col gap-4">
              <div className="rounded-md bg-subtle px-3 py-2 text-xs text-fg-muted">
                ※ AI 가 생성한 초안입니다. 검수/수정 후 form 안 저장하세요. 의료광고법 책임은 운영자에게 있습니다.
              </div>
              {renderResult(data)}
            </div>
          )}
        </AiSuggestionModal>
      )}
    </>
  );
}

function PreviewField({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs font-medium uppercase tracking-wide text-fg-muted">{label}</div>
      <div
        className={
          mono
            ? "max-h-80 overflow-y-auto rounded-md border border-border bg-canvas px-3 py-2 font-mono text-xs text-fg-default whitespace-pre-wrap"
            : "rounded-md border border-border bg-canvas px-3 py-2 text-sm text-fg-default whitespace-pre-wrap"
        }
      >
        {value}
      </div>
    </div>
  );
}

// === page (treatment/condition) wrapper ===

export type PageFullDraftPanelProps = {
  instanceSlug: string;
  entityKind: PageEntityKind;
  hasFormContent: () => boolean;
  onApply: (data: { title: string; summary: string; bodyMarkdown: string; slug: string }) => void;
};

export function PageFullDraftPanel({ instanceSlug, entityKind, hasFormContent, onApply }: PageFullDraftPanelProps) {
  const noun = entityKind === "TreatmentPage" ? "시술/진료" : "증상/질환";
  return (
    <EntityFullDraftPanel<PageFullDraftOutput>
      instanceSlug={instanceSlug}
      modalTitle={`AI Draft 생성 · ${noun} 페이지 본문`}
      buttonTitle={`키워드 + 주제 한 줄 입력으로 ${noun} 페이지 초안 자동 생성`}
      quotaWeight={7}
      action={(input: EntityDraftInput) =>
        generatePageFullDraftAction(instanceSlug, entityKind, input as PageFullDraftActionInput)
      }
      hasFormContent={hasFormContent}
      onApply={(d) => onApply({ title: d.title, summary: d.summary, bodyMarkdown: d.bodyMarkdown, slug: d.slug })}
      primaryPlaceholder={entityKind === "TreatmentPage" ? "예: 비만 약침 치료" : "예: 갱년기 체중 증가"}
      briefPlaceholder={
        entityKind === "TreatmentPage"
          ? "예: 비만 약침의 원리·적용 대상·시술 흐름·주의사항을 객관적으로 정리."
          : "예: 갱년기 체중 증가의 원인·동반 증상·일상 관리·관련 진료를 정리."
      }
      renderResult={(d) => (
        <>
          <PreviewField label="제목" value={d.title} />
          <PreviewField label={`요약 (${d.summary.length}자)`} value={d.summary} />
          <PreviewField label={`본문 (${d.bodyMarkdown.length}자 · markdown)`} value={d.bodyMarkdown} mono />
          <PreviewField label="slug" value={d.slug} />
        </>
      )}
    />
  );
}
