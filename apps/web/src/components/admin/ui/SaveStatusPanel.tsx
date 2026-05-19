// @glitzy/web/components/admin/ui/SaveStatusPanel — ADMIN_UX_REDESIGN v1.0 § 7.2 (UX-UI-02)
// 저장 진행/성공/실패/dirty 상태 통일 표시. sticky 하단 또는 상단 mirror 패턴.

import { humanizeFieldName } from "@/lib/admin/field-humanizer";

export type SaveStatusPanelProps = {
  status: "idle" | "saving" | "success" | "error";
  errorCount?: number;
  firstErrorField?: string | null;
  successMessage?: string;
  errorMessage?: string;
  lastSavedAt?: string | null;
  isDirty?: boolean;
  /** sticky 하단 (default) vs 상단 mirror */
  variant?: "sticky-bottom" | "banner";
};

export function SaveStatusPanel({
  status,
  errorCount = 0,
  firstErrorField,
  successMessage = "저장되었습니다.",
  errorMessage,
  lastSavedAt,
  isDirty,
  variant = "banner",
}: SaveStatusPanelProps) {
  const container = variant === "sticky-bottom"
    ? "sticky bottom-0 -mx-6 flex flex-col gap-2 border-t border-border bg-elevated/95 px-6 py-3 backdrop-blur"
    : "";

  // idle 상태 — dirty 또는 lastSavedAt 표시 만 (idle 상태 안 banner variant 시)
  if (status === "idle") {
    if (variant === "sticky-bottom") return null;  // sticky 안 idle 안 표시 안 함 (button 만)
    if (isDirty) {
      return (
        <div className={`${container} rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900`}>
          💾 저장되지 않은 변경 있음{lastSavedAt ? ` (마지막 저장: ${new Date(lastSavedAt).toLocaleTimeString("ko-KR")})` : ""}
        </div>
      );
    }
    if (lastSavedAt) {
      return (
        <div className={`${container} text-xs text-fg-muted`}>
          ✓ 모든 변경 저장됨 ({new Date(lastSavedAt).toLocaleTimeString("ko-KR")})
        </div>
      );
    }
    return null;
  }

  if (status === "saving") {
    return (
      <div className={`${container} rounded-md border border-info-subtle bg-info-subtle px-4 py-2 text-sm text-info`}>
        <span className="inline-block animate-spin">⏳</span> 저장 중…
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className={`${container} rounded-md border border-success bg-success-subtle px-4 py-3 text-sm text-fg-default`}>
        ✅ <strong>{successMessage}</strong>
      </div>
    );
  }

  // error
  return (
    <div className={`${container} rounded-md border border-error bg-error-subtle px-4 py-3 text-sm text-fg-default`}>
      ❌ <strong>저장 실패</strong>
      {errorMessage && <div className="mt-1">{errorMessage}</div>}
      {errorCount > 0 && (
        <div className="mt-1 text-xs">
          {errorCount}개 필드 오류
          {firstErrorField && (
            <> — 첫 오류 필드: <strong>{humanizeFieldName(firstErrorField)}</strong> (자동 스크롤됨)</>
          )}
        </div>
      )}
    </div>
  );
}
