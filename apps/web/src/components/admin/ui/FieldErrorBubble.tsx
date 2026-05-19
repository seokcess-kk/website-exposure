// @glitzy/web/components/admin/ui/FieldErrorBubble — ADMIN_UX_REDESIGN v1.0 § 7.7 (UX-UI-07)
// 개별 input 아래 인라인 빨강 텍스트 (운영자 언어).

export type FieldErrorBubbleProps = {
  fieldName: string;
  errors: string[] | undefined;
};

export function FieldErrorBubble({ errors }: FieldErrorBubbleProps) {
  if (!errors || errors.length === 0) return null;
  return (
    <p className="mt-1 text-xs text-error" role="alert">
      {errors.join(" · ")}
    </p>
  );
}
