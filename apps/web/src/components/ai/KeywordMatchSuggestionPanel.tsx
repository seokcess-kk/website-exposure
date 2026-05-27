// @glitzy/web/components/ai/KeywordMatchSuggestionPanel — CONTENT_AI_ASSIST_PLAN v1.0 § 5.2
// 키워드 → 콘텐츠 매핑 AI 추천. unlinked keyword 옆 mount.
//   - "AI 추천 ✨" 클릭 → 최대 3 후보 modal → 운영자 1개 선택 → primary keyword_content_link UPSERT.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { suggestKeywordMatchesAction, type KeywordMatchSuggestOutputEnriched } from "@/lib/ai/suggest-keyword-matches";
import { applyKeywordMatchAction } from "@/lib/ai/apply-keyword-match";
import type { SuggestionResult } from "@/lib/ai/suggestion-result";

import { AiSuggestionButton } from "./AiSuggestionButton";
import { AiSuggestionModal } from "./AiSuggestionModal";

const ENTITY_LABEL: Record<"Article" | "TreatmentPage" | "FAQ", string> = {
  Article: "기사",
  TreatmentPage: "진료",
  FAQ: "FAQ",
};

const CONFIDENCE_LABEL: Record<"high" | "medium" | "low", string> = {
  high: "높음",
  medium: "중간",
  low: "낮음",
};

export type KeywordMatchSuggestionPanelProps = {
  instanceSlug: string;
  keywordId: string;
};

type Recommendation = KeywordMatchSuggestOutputEnriched["recommendations"][number];

export function KeywordMatchSuggestionPanel({ instanceSlug, keywordId }: KeywordMatchSuggestionPanelProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<SuggestionResult<KeywordMatchSuggestOutputEnriched> | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [pendingApply, setPendingApply] = useState(false);

  const trigger = async () => {
    setApplyError(null);
    const r = await suggestKeywordMatchesAction(instanceSlug, keywordId);
    setResult(r);
    setSelectedId(r.ok && r.data.recommendations[0] ? r.data.recommendations[0].entityId : null);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setResult(null);
    setSelectedId(null);
    setApplyError(null);
  };

  const handleAccept = async () => {
    if (!result || !result.ok || !selectedId) return;
    const rec = result.data.recommendations.find((r) => r.entityId === selectedId);
    if (!rec) return;
    setPendingApply(true);
    setApplyError(null);
    try {
      const out = await applyKeywordMatchAction(instanceSlug, {
        keywordId,
        entityType: rec.entityType,
        entityId: rec.entityId,
      });
      if (!out.ok) {
        setApplyError(out.message);
        return;
      }
      router.refresh();
    } finally {
      setPendingApply(false);
    }
  };

  const errorMessage = result && result.ok === false ? result.message : applyError;
  const logId = result?.logId ?? null;
  const data = result && result.ok ? result.data : null;

  return (
    <>
      <AiSuggestionButton
        onSuggest={trigger}
        label="AI 추천 ✨"
        title="AI 가 콘텐츠 중에서 이 키워드와 어울리는 후보를 최대 3개 추천합니다."
      />
      {open && (
        <AiSuggestionModal
          title="AI 추천 · 키워드 ↔ 콘텐츠 매핑"
          instanceSlug={instanceSlug}
          logId={logId}
          errorMessage={errorMessage}
          onClose={close}
          onAccept={handleAccept}
          acceptLabel={pendingApply ? "연결 중…" : "primary 연결"}
          acceptDisabled={!data || !selectedId || pendingApply}
        >
          {data && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-fg-muted">
                ※ 1개 선택 → 수락 시 해당 콘텐츠가 이 키워드의 primary 로 연결됩니다.
              </p>
              <ul className="flex flex-col gap-2">
                {data.recommendations.map((r) => (
                  <li key={r.entityId}>
                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition ${
                        selectedId === r.entityId
                          ? "border-brand-primary bg-brand-primary/5"
                          : "border-border bg-canvas hover:bg-subtle"
                      }`}
                    >
                      <input
                        type="radio"
                        name="ai-keyword-rec"
                        value={r.entityId}
                        checked={selectedId === r.entityId}
                        onChange={() => setSelectedId(r.entityId)}
                        className="mt-1"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-semibold uppercase text-fg-muted">
                            {ENTITY_LABEL[r.entityType]}
                          </span>
                          <span className="text-xs text-fg-muted">/ {r.slug}</span>
                          <ConfidenceBadge confidence={r.confidence} />
                        </div>
                        <div className="mt-1 text-sm font-medium text-fg-default">{r.title}</div>
                        <p className="mt-1 text-xs text-fg-muted">{r.reason}</p>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </AiSuggestionModal>
      )}
    </>
  );
}

function ConfidenceBadge({ confidence }: { confidence: "high" | "medium" | "low" }) {
  const color =
    confidence === "high"
      ? "border-success/40 bg-success/10 text-success"
      : confidence === "medium"
        ? "border-warning/40 bg-warning/10 text-warning"
        : "border-border bg-subtle text-fg-muted";
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${color}`}>
      신뢰도 {CONFIDENCE_LABEL[confidence]}
    </span>
  );
}
