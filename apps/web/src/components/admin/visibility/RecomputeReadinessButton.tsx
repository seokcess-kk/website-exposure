// @glitzy/web/components/admin/visibility/RecomputeReadinessButton — readiness 재계산 trigger
// SEO_VISIBILITY_OPS_PLAN v0.2 § 5

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { recomputeAllReadinessAction } from "@/app/(admin)/admin/[instanceSlug]/visibility-actions";

export function RecomputeReadinessButton({ instanceSlug }: { instanceSlug: string }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleClick = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await recomputeAllReadinessAction(instanceSlug);
      if (result.ok) {
        setMessage(`재계산 완료 (${result.total}개 entity)`);
        router.refresh();
      } else {
        setMessage(result.reason);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="rounded-md border border-border bg-elevated px-3 py-1.5 text-xs font-medium text-fg-default hover:bg-bg-hover disabled:opacity-50"
      >
        {pending ? "재계산 중…" : "전체 재계산"}
      </button>
      {message && <span className="text-xs text-fg-muted">{message}</span>}
    </div>
  );
}
