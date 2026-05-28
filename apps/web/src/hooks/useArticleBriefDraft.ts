// @glitzy/web/hooks/useArticleBriefDraft — CONTENT_AI_DRAFT_PLAN v1.0 CAID-DEFER-16 v1 합류
// brief 자동 생성 mini button 안 state hook — modal 없이 textarea 안 직접 채움.

"use client";

import { useState } from "react";
import {
  generateArticleBriefDraftAction,
  type ArticleBriefDraftActionInput,
  type ArticleBriefDraftResult,
} from "@/lib/ai/article-brief-draft";

export type ArticleBriefDraftState = {
  pending: boolean;
  error: string | null;
  trigger: (input: ArticleBriefDraftActionInput) => Promise<string | null>;
  clearError: () => void;
};

export function useArticleBriefDraft(instanceSlug: string): ArticleBriefDraftState {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trigger = async (input: ArticleBriefDraftActionInput): Promise<string | null> => {
    if (pending) return null;
    setPending(true);
    setError(null);
    try {
      const r: ArticleBriefDraftResult = await generateArticleBriefDraftAction(instanceSlug, input);
      if (!r.ok) {
        setError(r.message);
        return null;
      }
      return r.data.brief;
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI 호출 중 오류");
      return null;
    } finally {
      setPending(false);
    }
  };

  const clearError = () => setError(null);

  return { pending, error, trigger, clearError };
}
