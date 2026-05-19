// @glitzy/web/components/admin/DashboardClient — ADMIN_UX_REDESIGN v1.0 § 4.2 + § 10
// 대시보드 client wrapper — ReleasePreviewModal trigger + 출시 server action.

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ReleaseReadinessCard } from "@/components/admin/ui/ReleaseReadinessCard";
import { ReleasePreviewModal } from "@/components/admin/ui/ReleasePreviewModal";
import type { ReleaseReadiness } from "@/lib/admin/release-readiness";
import { requestReleaseReview, publishInstance } from "@/app/(admin)/admin/[instanceSlug]/release-actions";
import { useToast } from "@/components/admin/ToastProvider";

export type DashboardClientProps = {
  readiness: ReleaseReadiness;
  instanceSlug: string;
  isSuperAdmin: boolean;
};

export function DashboardClient({ readiness, instanceSlug, isSuperAdmin }: DashboardClientProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  const handleConfirm = async () => {
    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        const result = await requestReleaseReview(instanceSlug);
        if (result.ok) {
          toast.show({ kind: "success", message: "출시 검수 요청을 전송했습니다." });
          router.refresh();
          resolve();
        } else {
          toast.show({ kind: "error", message: result.reason });
          reject(new Error(result.reason));
        }
      });
    });
  };

  const handlePublish = () => {
    startTransition(async () => {
      const result = await publishInstance(instanceSlug);
      if (result.ok) {
        toast.show({ kind: "success", message: "🚀 발행 완료" });
        router.refresh();
      } else {
        toast.show({ kind: "error", message: result.reason });
      }
    });
  };

  return (
    <>
      <ReleaseReadinessCard
        readiness={readiness}
        instanceSlug={instanceSlug}
        onOpenPreview={() => setOpen(true)}
      />

      {/* super-admin 안 release-pending 시 발행 trigger */}
      {isSuperAdmin && readiness.lifecycle === "release-pending" && (
        <div className="rounded-md border border-info bg-info-subtle p-3 text-sm">
          <div className="mb-2 font-medium text-fg-default">검수 대기 중 · super-admin 발행 가능</div>
          <button
            type="button"
            onClick={handlePublish}
            disabled={pending}
            className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-fg-inverse hover:bg-brand-primary-hover disabled:opacity-50"
          >
            {pending ? "발행 중…" : "🚀 지금 발행"}
          </button>
        </div>
      )}

      {open && (
        <ReleasePreviewModal
          instanceSlug={instanceSlug}
          evalResult={readiness}
          onConfirm={handleConfirm}
          onClose={() => setOpen(false)}
        />
      )}
      {pending && (
        <div className="fixed bottom-4 right-4 z-50 rounded-md bg-elevated px-4 py-2 text-sm text-fg-default shadow">
          처리 중…
        </div>
      )}
    </>
  );
}
