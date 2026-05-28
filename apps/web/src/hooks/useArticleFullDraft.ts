// @glitzy/web/hooks/useArticleFullDraft — CONTENT_AI_DRAFT_PLAN v1.0 § 7 task 4
// 신규 article 안 AI Full Draft 생성 modal state hook.

"use client";

import { useState } from "react";
import {
  generateArticleFullDraftAction,
  type ArticleFullDraftActionInput,
  type ArticleFullDraftResult,
} from "@/lib/ai/article-full-draft";

export type ArticleFullDraftState = {
  open: boolean;
  pending: boolean;
  result: ArticleFullDraftResult | null;
  openModal: () => void;
  trigger: (input: ArticleFullDraftActionInput) => Promise<void>;
  close: () => void;
};

export function useArticleFullDraft(instanceSlug: string): ArticleFullDraftState {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ArticleFullDraftResult | null>(null);

  const openModal = () => {
    setOpen(true);
  };

  const trigger = async (input: ArticleFullDraftActionInput) => {
    if (pending) return;
    setPending(true);
    try {
      const r = await generateArticleFullDraftAction(instanceSlug, input);
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
