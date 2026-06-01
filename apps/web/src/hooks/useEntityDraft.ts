// @glitzy/web/hooks/useEntityDraft — CONTENT_AI_DRAFT_ENTITY_PLAN v1.0 (CAID-DEFER-02)
// 제네릭 AI Full Draft modal state hook — page (treatment/condition) · faq 공용.
// useArticleFullDraft 패턴을 entity 무관하게 일반화 (action 은 호출부에서 bind).

"use client";

import { useState } from "react";
import type { SuggestionResult } from "@/lib/ai/suggestion-result";

export type EntityDraftInput = {
  primaryKeyword: string;
  secondaryKeywords: string[];
  brief: string;
};

export type EntityDraftState<TData> = {
  open: boolean;
  pending: boolean;
  result: SuggestionResult<TData> | null;
  openModal: () => void;
  trigger: (input: EntityDraftInput) => Promise<void>;
  close: () => void;
};

export function useEntityDraft<TData>(
  action: (input: EntityDraftInput) => Promise<SuggestionResult<TData>>,
): EntityDraftState<TData> {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<SuggestionResult<TData> | null>(null);

  const openModal = () => setOpen(true);

  const trigger = async (input: EntityDraftInput) => {
    if (pending) return;
    setPending(true);
    try {
      const r = await action(input);
      setResult(r);
    } catch (e) {
      setResult({
        ok: false,
        reason: "api-error",
        message: e instanceof Error ? e.message : "AI 호출 중 오류",
      });
    } finally {
      setPending(false);
    }
  };

  const close = () => {
    setOpen(false);
    setResult(null);
  };

  return { open, pending, result, openModal, trigger, close };
}
