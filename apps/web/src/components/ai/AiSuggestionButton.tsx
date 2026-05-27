// @glitzy/web/components/ai/AiSuggestionButton — CONTENT_AI_ASSIST_PLAN v1.0 § 6.1
// 공통 "AI 제안 ✨" 버튼. pending state 안 spinner · disabled prop 외부 전달.

"use client";

import { useState, type ReactNode } from "react";

export type AiSuggestionButtonProps = {
  onSuggest: () => Promise<void>;
  label?: ReactNode;
  disabled?: boolean;
  className?: string;
  title?: string;
};

export function AiSuggestionButton({
  onSuggest,
  label = "AI 제안 ✨",
  disabled,
  className,
  title,
}: AiSuggestionButtonProps) {
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    if (pending || disabled) return;
    setPending(true);
    try {
      await onSuggest();
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending || disabled}
      title={title}
      className={
        className ??
        "inline-flex items-center gap-1 rounded-md border border-brand-primary/30 bg-brand-primary/5 px-2.5 py-1 text-xs font-medium text-brand-primary hover:bg-brand-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
      }
    >
      {pending ? "AI 호출 중…" : label}
    </button>
  );
}
