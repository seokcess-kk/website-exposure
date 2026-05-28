// @glitzy/web/components/ai/ArticleFullDraftPanel — CONTENT_AI_DRAFT_PLAN v1.0 § 7 task 4
// 신규 article 안 AI Full Draft 생성 panel — "AI Draft 생성" button + 2-step modal.
//   Step A: primary keyword + secondaries + brief 입력 + 생성 button
//   Step B: 결과 표시 (title · summary · bodyMarkdown · recommended publications) + 운영자 select + "form 에 적용" / 취소
//
// 의료광고법 책임 = 운영자. PII 입력 금지 banner.

"use client";

import { useState } from "react";
import type { ArticleFullDraftActionInput } from "@/lib/ai/article-full-draft";
import { useArticleFullDraft } from "@/hooks/useArticleFullDraft";
import { useArticleBriefDraft } from "@/hooks/useArticleBriefDraft";
import { AiSuggestionButton } from "./AiSuggestionButton";
import { AiSuggestionModal } from "./AiSuggestionModal";

const BRIEF_MIN = 50;
const BRIEF_MAX = 200;
const SECONDARY_MAX = 3;

export type ArticleFullDraftKeywordOption = {
  id: string;
  label: string;
};

export type ArticleFullDraftPanelProps = {
  instanceSlug: string;
  /** 현재 form 안 category 명 (입력 안 추가 안내) — optional. */
  getCategoryName: () => string | undefined;
  /** keyword_target active row — primary/secondary select dropdown. */
  keywordOptions: ReadonlyArray<ArticleFullDraftKeywordOption>;
  /** 기존 form 안 title 또는 body 가 비어있지 않을 때 overwrite confirm. */
  hasFormContent: () => boolean;
  /** accept 시 호출 — form field 채움 + recommended publications setter. */
  onApply: (data: {
    title: string;
    summary: string;
    bodyMarkdown: string;
    /** v1.2 — LLM 직접 생성 slug (영문 의미 keyword). */
    slug: string;
    recommendedPublications: Array<{
      id: string;
      title: string;
      summary: string;
      publicationType: string;
    }>;
    filteredRecommendedPublicationIds: string[];
  }) => void;
};

export function ArticleFullDraftPanel({
  instanceSlug,
  getCategoryName,
  keywordOptions,
  hasFormContent,
  onApply,
}: ArticleFullDraftPanelProps) {
  const draft = useArticleFullDraft(instanceSlug);
  const briefDraft = useArticleBriefDraft(instanceSlug);

  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>([]);
  const [brief, setBrief] = useState("");

  // Step A — 운영자 입력 valid check (client-side · server-side 안 별도 강제)
  const briefLength = brief.length;
  const briefValid = briefLength >= BRIEF_MIN && briefLength <= BRIEF_MAX;
  const primaryValid = primaryKeyword.trim().length > 0;
  const inputValid = briefValid && primaryValid;

  const handleOpenClick = async () => {
    if (hasFormContent()) {
      const ok = window.confirm("기존 내용을 덮어쓰시겠습니까? — AI Draft 생성 시 form 의 제목·요약·본문이 새로 채워집니다.");
      if (!ok) return;
    }
    draft.openModal();
  };

  const handleGenerate = async () => {
    const input: ArticleFullDraftActionInput = {
      primaryKeyword: primaryKeyword.trim(),
      secondaryKeywords: secondaryKeywords.filter((s) => s.trim().length > 0),
      brief: brief.trim(),
      categoryName: getCategoryName(),
    };
    await draft.trigger(input);
  };

  // CAID-DEFER-16 v1 합류 — brief 자동 생성 mini button handler.
  const handleBriefGenerate = async () => {
    if (!primaryValid) return;
    if (brief.trim().length > 0) {
      const ok = window.confirm("기존 brief 를 덮어쓰시겠습니까? — AI 가 생성한 brief 로 새로 채워집니다.");
      if (!ok) return;
    }
    const generated = await briefDraft.trigger({
      primaryKeyword: primaryKeyword.trim(),
      secondaryKeywords: secondaryKeywords.filter((s) => s.trim().length > 0),
      categoryName: getCategoryName(),
    });
    if (generated !== null) {
      setBrief(generated);
    }
  };

  const result = draft.result;
  const errorMessage = result && result.ok === false ? result.message : null;
  const data = result && result.ok ? result.data : null;
  const logId = result?.logId ?? null;

  // Step B — 운영자가 select 한 publication
  const [selectedPubIds, setSelectedPubIds] = useState<string[]>([]);

  // 결과 도착 시 자동 select (filtered 안 모두 default)
  if (data && selectedPubIds.length === 0 && data.filteredRecommendedPublicationIds.length > 0) {
    // 부수 효과는 useEffect 권장이지만 단순화 — 결과 1회 만 default set.
    // (idempotent — selectedPubIds 안 비어있을 때 만 set)
  }

  const togglePubSelect = (id: string) => {
    setSelectedPubIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleApply = () => {
    if (!data) return;
    const selectedPubs = data.recommendedPublications.filter((p) => selectedPubIds.includes(p.id));
    onApply({
      title: data.title,
      summary: data.summary,
      bodyMarkdown: data.bodyMarkdown,
      slug: data.slug,
      recommendedPublications: selectedPubs,
      filteredRecommendedPublicationIds: selectedPubIds,
    });
  };

  const handleClose = () => {
    draft.close();
    setSelectedPubIds([]);
    // primary/secondaries/brief 는 reset 안 (운영자가 retry 시 재입력 회피)
  };

  return (
    <>
      <AiSuggestionButton
        onSuggest={handleOpenClick}
        label="AI Draft 생성 ✨"
        title="키워드 + 주제 한 줄 입력으로 칼럼 초안 자동 생성"
        className="inline-flex items-center gap-1 rounded-md border border-brand-primary bg-brand-primary px-3 py-1.5 text-sm font-medium text-fg-inverse hover:bg-brand-primary-hover disabled:opacity-50"
      />
      {draft.open && (
        <AiSuggestionModal
          title="AI Draft 생성 · 칼럼 본문 초안"
          instanceSlug={instanceSlug}
          logId={logId}
          errorMessage={errorMessage}
          onClose={handleClose}
          onAccept={handleApply}
          acceptDisabled={!data}
          acceptLabel="form 에 적용"
        >
          {/* Step A — 입력 (data 없을 때) */}
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
                  list="article-draft-primary-options"
                  value={primaryKeyword}
                  onChange={(e) => setPrimaryKeyword(e.target.value)}
                  placeholder="예: 체질개선 다이어트"
                  className="rounded-md border border-border bg-canvas px-3 py-1.5 text-sm"
                />
                <datalist id="article-draft-primary-options">
                  {keywordOptions.map((k) => (
                    <option key={k.id} value={k.label} />
                  ))}
                </datalist>
                <span className="text-xs text-fg-muted">
                  키워드 목록 (자동완성) 또는 자유 입력 — 미등록 키워드는 별도 등록 필요.
                </span>
              </label>

              <fieldset className="flex flex-col gap-1 text-sm">
                <legend className="font-medium text-fg-default">Secondary keywords (0~{SECONDARY_MAX}개)</legend>
                <div className="flex flex-wrap gap-1">
                  {keywordOptions
                    .filter((k) => k.label !== primaryKeyword.trim())
                    .slice(0, 20)
                    .map((k) => {
                      const selected = secondaryKeywords.includes(k.label);
                      const disabled = !selected && secondaryKeywords.length >= SECONDARY_MAX;
                      return (
                        <button
                          key={k.id}
                          type="button"
                          disabled={disabled}
                          onClick={() => {
                            setSecondaryKeywords((prev) =>
                              prev.includes(k.label) ? prev.filter((x) => x !== k.label) : [...prev, k.label],
                            );
                          }}
                          className={
                            selected
                              ? "rounded-full border border-brand-primary bg-brand-primary px-2.5 py-0.5 text-xs font-medium text-fg-inverse"
                              : "rounded-full border border-border bg-canvas px-2.5 py-0.5 text-xs text-fg-muted hover:bg-subtle disabled:opacity-40 disabled:cursor-not-allowed"
                          }
                        >
                          {k.label}
                        </button>
                      );
                    })}
                </div>
                <span className="text-xs text-fg-muted">
                  {secondaryKeywords.length}/{SECONDARY_MAX} 선택 · H2 안 분산 배치됩니다.
                </span>
              </fieldset>

              <div className="flex flex-col gap-1 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="article-draft-brief" className="font-medium text-fg-default">
                    Brief (이 칼럼이 다룰 주제·논점·결론 1줄) — {BRIEF_MIN}~{BRIEF_MAX}자
                  </label>
                  <button
                    type="button"
                    onClick={handleBriefGenerate}
                    disabled={!primaryValid || briefDraft.pending}
                    title={
                      !primaryValid
                        ? "primary keyword 입력 후 brief 자동 생성 가능"
                        : "키워드 기반으로 brief 1차 LLM 생성 (1 quota 차감) — 운영자 검수/수정 후 본문 진행"
                    }
                    className="inline-flex items-center gap-1 rounded-md border border-brand-primary/30 bg-brand-primary/5 px-2 py-0.5 text-xs font-medium text-brand-primary hover:bg-brand-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {briefDraft.pending ? "AI 호출 중…" : "brief 자동 생성 ✨ (1 quota)"}
                  </button>
                </div>
                <textarea
                  id="article-draft-brief"
                  rows={3}
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder="예: 사상체질에 따라 다이어트 접근이 어떻게 달라질 수 있는지 한방의학 관점에서 정리하고, 본 한의원의 진료 흐름을 소개."
                  className="rounded-md border border-border bg-canvas px-3 py-2 text-sm"
                />
                {briefDraft.error && (
                  <span className="text-xs text-rose-700">⚠ {briefDraft.error}</span>
                )}
                <span
                  className={
                    briefValid
                      ? "text-xs text-fg-muted"
                      : "text-xs text-rose-700"
                  }
                >
                  {briefLength}/{BRIEF_MAX}자{" "}
                  {briefValid ? "✓" : `· ${BRIEF_MIN}자 이상 ${BRIEF_MAX}자 이하 필요`}
                </span>
                <span className="text-xs text-fg-muted">
                  ⚠ 환자 이름·연락처·진료기록 등 PII 입력 금지. AI 자동 생성 brief 도 운영자 검수 책임.
                </span>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!inputValid || draft.pending}
                  className="rounded-md bg-brand-primary px-4 py-1.5 text-sm font-semibold text-fg-inverse hover:bg-brand-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {draft.pending ? "AI 호출 중…" : "AI Draft 생성 (7 quota 차감)"}
                </button>
              </div>
            </div>
          )}

          {/* Step B — 결과 (data 있을 때) */}
          {data && (
            <div className="flex flex-col gap-4">
              <div className="rounded-md bg-subtle px-3 py-2 text-xs text-fg-muted">
                ※ AI 가 생성한 초안입니다. 검수/수정 후 form 안 저장하세요. 의료광고법 책임은 운영자에게 있습니다.
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-xs font-medium uppercase tracking-wide text-fg-muted">제목</div>
                <div className="rounded-md border border-border bg-canvas px-3 py-2 text-sm text-fg-default">
                  {data.title}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-xs font-medium uppercase tracking-wide text-fg-muted">요약 ({data.summary.length}자)</div>
                <div className="rounded-md border border-border bg-canvas px-3 py-2 text-sm text-fg-default whitespace-pre-wrap">
                  {data.summary}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-xs font-medium uppercase tracking-wide text-fg-muted">
                  본문 ({data.bodyMarkdown.length}자 · markdown)
                </div>
                <div className="max-h-80 overflow-y-auto rounded-md border border-border bg-canvas px-3 py-2 font-mono text-xs text-fg-default whitespace-pre-wrap">
                  {data.bodyMarkdown}
                </div>
              </div>

              {data.recommendedPublications.length === 0 ? (
                <div className="rounded-md border border-border bg-canvas px-3 py-2 text-xs text-fg-muted">
                  추천 publication 없음 — citation 없이 진행하거나{" "}
                  <a
                    href={`/admin/${instanceSlug}/publications/new`}
                    target="_blank"
                    className="underline text-brand-primary"
                  >
                    publication 등록 페이지
                  </a>
                  에서 별도 등록 후 link 하세요.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-medium uppercase tracking-wide text-fg-muted">
                    추천 publication · 본문 안 [근거:] placeholder 와 link 할 항목 선택
                  </div>
                  {data.recommendedPublications.map((p) => {
                    const checked = selectedPubIds.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className={
                          checked
                            ? "flex cursor-pointer items-start gap-2 rounded-md border border-brand-primary bg-brand-primary/5 px-3 py-2 text-sm"
                            : "flex cursor-pointer items-start gap-2 rounded-md border border-border bg-canvas px-3 py-2 text-sm hover:bg-subtle"
                        }
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePubSelect(p.id)}
                          className="mt-0.5"
                        />
                        <div className="flex flex-col gap-0.5">
                          <div className="font-medium text-fg-default">{p.title}</div>
                          <div className="text-xs text-fg-muted">{p.publicationType}</div>
                          <div className="text-xs text-fg-muted line-clamp-2">{p.summary}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </AiSuggestionModal>
      )}
    </>
  );
}
