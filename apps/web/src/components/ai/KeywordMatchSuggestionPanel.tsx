// @glitzy/web/components/ai/KeywordMatchSuggestionPanel — CONTENT_AI_ASSIST_PLAN v1.0 § 5.2 + v1.1 (CAI-DEFER-13)
// 키워드 → 콘텐츠 매핑 AI 추천 + primary 1 (radio) + secondary N (checkbox · primary row 안 자동 disable).

"use client";

import { useEffect, useState } from "react";
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
  const [primaryId, setPrimaryId] = useState<string | null>(null);
  const [secondaryIds, setSecondaryIds] = useState<Set<string>>(new Set());
  const [applyError, setApplyError] = useState<string | null>(null);
  const [pendingApply, setPendingApply] = useState(false);

  const trigger = async () => {
    setApplyError(null);
    const r = await suggestKeywordMatchesAction(instanceSlug, keywordId);
    setResult(r);
    if (r.ok && r.data.recommendations[0]) {
      setPrimaryId(r.data.recommendations[0].entityId);
      setSecondaryIds(new Set());
    } else {
      setPrimaryId(null);
      setSecondaryIds(new Set());
    }
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setResult(null);
    setPrimaryId(null);
    setSecondaryIds(new Set());
    setApplyError(null);
  };

  // primary 변경 시 secondary 안에서 자동 제거 (mutual exclusion)
  useEffect(() => {
    if (!primaryId) return;
    setSecondaryIds((prev) => {
      if (!prev.has(primaryId)) return prev;
      const next = new Set(prev);
      next.delete(primaryId);
      return next;
    });
  }, [primaryId]);

  const toggleSecondary = (entityId: string) => {
    if (entityId === primaryId) return; // primary row 안 토글 차단
    setSecondaryIds((prev) => {
      const next = new Set(prev);
      if (next.has(entityId)) next.delete(entityId);
      else next.add(entityId);
      return next;
    });
  };

  const handleAccept = async () => {
    if (!result || !result.ok || !primaryId) return;
    const primaryRec = result.data.recommendations.find((r) => r.entityId === primaryId);
    if (!primaryRec) return;
    const secondaryRecs = result.data.recommendations.filter((r) => secondaryIds.has(r.entityId));

    setPendingApply(true);
    setApplyError(null);
    try {
      const out = await applyKeywordMatchAction(instanceSlug, {
        keywordId,
        primary: { entityType: primaryRec.entityType, entityId: primaryRec.entityId },
        secondaries: secondaryRecs.map((r) => ({ entityType: r.entityType, entityId: r.entityId })),
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
  const secondaryCount = secondaryIds.size;
  const acceptLabel = pendingApply
    ? "연결 중…"
    : secondaryCount > 0
      ? `primary 1 + secondary ${secondaryCount} 연결`
      : "primary 1 연결";

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
          acceptLabel={acceptLabel}
          acceptDisabled={!data || !primaryId || pendingApply}
        >
          {data && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-fg-muted">
                ※ primary 1개 필수 (★) + secondary 0~N개 (☆) 선택 가능. 수락 시 모두 keyword 와 연결됩니다.
              </p>
              <ul className="flex flex-col gap-2">
                {data.recommendations.map((r) => (
                  <RecommendationRow
                    key={r.entityId}
                    rec={r}
                    isPrimary={primaryId === r.entityId}
                    isSecondary={secondaryIds.has(r.entityId)}
                    onSelectPrimary={() => setPrimaryId(r.entityId)}
                    onToggleSecondary={() => toggleSecondary(r.entityId)}
                  />
                ))}
              </ul>
            </div>
          )}
        </AiSuggestionModal>
      )}
    </>
  );
}

function RecommendationRow({
  rec,
  isPrimary,
  isSecondary,
  onSelectPrimary,
  onToggleSecondary,
}: {
  rec: Recommendation;
  isPrimary: boolean;
  isSecondary: boolean;
  onSelectPrimary: () => void;
  onToggleSecondary: () => void;
}) {
  const borderClass = isPrimary
    ? "border-brand-primary bg-brand-primary/5"
    : isSecondary
      ? "border-warning/50 bg-warning/5"
      : "border-border bg-canvas hover:bg-subtle";
  return (
    <li>
      <div className={`flex items-start gap-3 rounded-md border p-3 transition ${borderClass}`}>
        <div className="flex flex-col gap-1.5 pt-1 text-xs">
          <label className="flex items-center gap-1 cursor-pointer" title="primary 로 지정">
            <input
              type="radio"
              name="ai-keyword-primary"
              checked={isPrimary}
              onChange={onSelectPrimary}
              className="cursor-pointer"
            />
            <span className={isPrimary ? "font-semibold text-brand-primary" : "text-fg-muted"}>★ primary</span>
          </label>
          <label className={`flex items-center gap-1 ${isPrimary ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`} title={isPrimary ? "primary 인 항목은 secondary 가 될 수 없습니다" : "secondary 로 추가"}>
            <input
              type="checkbox"
              checked={isSecondary}
              onChange={onToggleSecondary}
              disabled={isPrimary}
              className={isPrimary ? "cursor-not-allowed" : "cursor-pointer"}
            />
            <span className={isSecondary ? "font-semibold text-warning" : "text-fg-muted"}>☆ secondary</span>
          </label>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-semibold uppercase text-fg-muted">
              {ENTITY_LABEL[rec.entityType]}
            </span>
            <span className="text-xs text-fg-muted">/ {rec.slug}</span>
            <ConfidenceBadge confidence={rec.confidence} />
          </div>
          <div className="mt-1 text-sm font-medium text-fg-default">{rec.title}</div>
          <p className="mt-1 text-xs text-fg-muted">{rec.reason}</p>
        </div>
      </div>
    </li>
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
