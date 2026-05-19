// @glitzy/web/components/admin/ui/ErrorSummary — ADMIN_UX_REDESIGN v1.0 § 7.6 (UX-UI-06)
// fieldErrors 통합 list + click 시 해당 input 으로 scroll/focus.

"use client";

import { humanizeFieldName } from "@/lib/admin/field-humanizer";

export type ErrorSummaryProps = {
  errors: Record<string, string[]>;  // fieldName → messages[]
  /** field click 시 콜백 — default 동작: document.querySelector(`[name="${field}"]`) scrollIntoView + focus */
  onClickField?: (field: string) => void;
};

export function ErrorSummary({ errors, onClickField }: ErrorSummaryProps) {
  const fieldNames = Object.keys(errors).filter((k) => (errors[k]?.length ?? 0) > 0);
  if (fieldNames.length === 0) return null;

  const handleClick = (field: string) => {
    if (onClickField) {
      onClickField(field);
      return;
    }
    // default: name 안 첫 segment 안 querySelector
    const targetName = field.split(".")[0]!;
    const el = document.querySelector<HTMLElement>(`[name="${targetName}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      if ("focus" in el && typeof (el as HTMLInputElement).focus === "function") {
        setTimeout(() => (el as HTMLInputElement).focus(), 300);
      }
    }
  };

  return (
    <div className="rounded-md border border-error bg-error-subtle px-4 py-3 text-sm text-fg-default">
      <div className="mb-2 font-semibold">
        ❌ {fieldNames.length}개 필드 오류
      </div>
      <ul className="flex flex-col gap-1 text-xs">
        {fieldNames.map((field) => (
          <li key={field}>
            <button
              type="button"
              onClick={() => handleClick(field)}
              className="text-left underline hover:text-error"
            >
              <strong>{humanizeFieldName(field)}</strong>
              {": "}
              {(errors[field] ?? []).join(", ")}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
