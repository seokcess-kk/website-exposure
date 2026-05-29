// @glitzy/web/components/admin/super/InstanceActiveToggle — 사이트 활성/비활성 toggle 버튼
// ADMIN_PERMISSION_SEPARATION v1.1 § 8.3.
// 비활성화는 공개 사이트 + 어드민 접근을 모두 차단하므로 2단계 확인을 거친다.

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { setInstanceActiveAction } from "@/app/(admin)/admin/super/instances/actions";

export function InstanceActiveToggle({
  instanceId,
  slug,
  active,
}: {
  instanceId: string;
  slug: string;
  active: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const run = () => {
    setError(null);
    startTransition(async () => {
      const result = await setInstanceActiveAction(instanceId, !active);
      if (result.ok) {
        setConfirming(false);
        router.refresh();
      } else {
        setError(result.reason);
        setConfirming(false);
      }
    });
  };

  if (confirming) {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-fg-muted">
            {active ? (
              <>
                <code className="font-mono">{slug}</code> 사이트를 비활성화할까요?
              </>
            ) : (
              <>
                <code className="font-mono">{slug}</code> 사이트를 다시 활성화할까요?
              </>
            )}
          </span>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={pending}
            className="rounded-md border border-border px-2.5 py-1 text-[11px] text-fg-default hover:bg-bg-hover disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={run}
            disabled={pending}
            className={
              active
                ? "rounded-md bg-error px-3 py-1 text-[11px] font-medium text-fg-inverse hover:opacity-90 disabled:opacity-50"
                : "rounded-md bg-brand-primary px-3 py-1 text-[11px] font-medium text-fg-inverse hover:bg-brand-primary-hover disabled:opacity-50"
            }
          >
            {pending ? "처리 중…" : active ? "비활성화" : "활성화"}
          </button>
        </div>
        {active && (
          <span className="text-[10px] text-error">
            공개 사이트와 어드민 접근이 즉시 차단됩니다.
          </span>
        )}
        {error && <span className="text-[10px] text-error">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => {
          setError(null);
          setConfirming(true);
        }}
        disabled={pending}
        className={
          active
            ? "rounded-md border border-error/40 px-3 py-1 text-[11px] font-medium text-error hover:bg-error/10 disabled:opacity-50"
            : "rounded-md border border-brand-primary/40 px-3 py-1 text-[11px] font-medium text-brand-primary hover:bg-brand-primary-soft disabled:opacity-50"
        }
      >
        {active ? "비활성화" : "활성화"}
      </button>
      {error && <span className="text-[10px] text-error">{error}</span>}
    </div>
  );
}
