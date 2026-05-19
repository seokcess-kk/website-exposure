// @glitzy/web/components/admin/ui/DirtyIndicator — ADMIN_UX_REDESIGN v1.0 § 7.5 (UX-UI-05)
// 저장 안 된 변경 배지 + 페이지 이탈 경고 (beforeunload).

"use client";

import { useEffect } from "react";

export type DirtyIndicatorProps = {
  isDirty: boolean;
  lastSavedAt: string | null;
  /** 페이지 이탈 시 confirm 안내 (default true) */
  warnOnUnload?: boolean;
};

export function DirtyIndicator({ isDirty, lastSavedAt, warnOnUnload = true }: DirtyIndicatorProps) {
  // beforeunload — dirty 시 navigation/reload 차단 + confirm
  useEffect(() => {
    if (!warnOnUnload || !isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";  // Chrome 안 default message 표시
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty, warnOnUnload]);

  if (isDirty) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-warning-subtle px-2 py-1 text-xs font-medium text-warning">
        <span aria-hidden>💾</span>
        저장되지 않은 변경
        {lastSavedAt ? ` (마지막: ${new Date(lastSavedAt).toLocaleTimeString("ko-KR")})` : ""}
      </span>
    );
  }
  if (lastSavedAt) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-fg-muted">
        <span aria-hidden>✓</span>
        모든 변경 저장됨 ({new Date(lastSavedAt).toLocaleTimeString("ko-KR")})
      </span>
    );
  }
  return null;
}
