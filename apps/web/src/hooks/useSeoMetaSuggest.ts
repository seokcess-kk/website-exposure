// @glitzy/web/hooks/useSeoMetaSuggest — CONTENT_AI_ASSIST_PLAN v1.0 § 6
// SEO 메타 AI 제안 modal state hook — 3 entity form 공통.

"use client";

import { useState } from "react";
import {
  suggestSeoMetaAction,
  type SuggestSeoMetaActionInput,
} from "@/lib/ai/suggest-seo-meta";
import type { SeoMetaSuggestOutput } from "@/lib/ai/prompt-templates";
import type { SuggestionResult } from "@/lib/ai/suggestion-result";

export type SeoMetaSuggestState = {
  open: boolean;
  pending: boolean;
  result: SuggestionResult<SeoMetaSuggestOutput> | null;
  trigger: (input: SuggestSeoMetaActionInput) => Promise<void>;
  close: () => void;
};

export function useSeoMetaSuggest(instanceSlug: string): SeoMetaSuggestState {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<SuggestionResult<SeoMetaSuggestOutput> | null>(null);

  const trigger = async (input: SuggestSeoMetaActionInput) => {
    if (pending) return;
    setPending(true);
    try {
      const r = await suggestSeoMetaAction(instanceSlug, input);
      setResult(r);
      setOpen(true);
    } catch (e) {
      setResult({
        ok: false,
        reason: "api-error",
        message: e instanceof Error ? e.message : "AI 호출 중 오류",
      });
      setOpen(true);
    } finally {
      setPending(false);
    }
  };

  const close = () => {
    setOpen(false);
    setResult(null);
  };

  return { open, pending, result, trigger, close };
}
