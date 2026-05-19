// @glitzy/web/components/admin/ui/StatusBadge — ADMIN_UX_REDESIGN v1.0 § 7.3 (UX-UI-03)
// entity 9 status 통일 배지. DESIGN_TOKENS semantic token 정합.

export type ContentStatus =
  | "draft"
  | "review-queued"
  | "in-review"
  | "approved"
  | "publishable"
  | "published"
  | "rejected"
  | "blocked"
  | "stale";

export type StatusBadgeProps = {
  status: ContentStatus;
  size?: "sm" | "md";
};

const STATUS_LABEL: Record<ContentStatus, string> = {
  draft: "초안",
  "review-queued": "검수 대기",
  "in-review": "검수 중",
  approved: "승인됨",
  publishable: "발행 가능",
  published: "발행됨",
  rejected: "거부됨",
  blocked: "차단됨",
  stale: "재검수 필요",
};

const STATUS_CLASS: Record<ContentStatus, string> = {
  draft: "bg-subtle text-fg-muted border-border",
  "review-queued": "bg-warning-subtle text-warning border-warning",
  "in-review": "bg-warning-subtle text-warning border-warning",
  approved: "bg-info-subtle text-info border-info",
  publishable: "bg-info-subtle text-info border-info",
  published: "bg-success-subtle text-fg-default border-success",
  rejected: "bg-error-subtle text-error border-error",
  blocked: "bg-error-subtle text-error border-error",
  stale: "bg-warning-subtle text-warning border-warning",
};

const STATUS_ICON: Record<ContentStatus, string> = {
  draft: "📝",
  "review-queued": "⏳",
  "in-review": "👁️",
  approved: "✓",
  publishable: "🚀",
  published: "✅",
  rejected: "✗",
  blocked: "🚫",
  stale: "⏰",
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border font-medium ${sizeClass} ${STATUS_CLASS[status]}`}
      aria-label={STATUS_LABEL[status]}
    >
      <span aria-hidden>{STATUS_ICON[status]}</span>
      {STATUS_LABEL[status]}
    </span>
  );
}
