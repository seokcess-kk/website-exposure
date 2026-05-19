// @glitzy/web/components/site/ui/IconBadge — 아이콘 frame (gold soft bg + ring)
// "단아" design system v1.0 — 한방 톤 안 icon 안 framing.

export function IconBadge({
  children,
  size = "md",
  variant = "accent",
}: {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "accent" | "primary" | "neutral";
}) {
  const sizeClass =
    size === "sm" ? "h-9 w-9 text-base"
    : size === "lg" ? "h-16 w-16 text-2xl"
    : "h-12 w-12 text-xl";
  // 다이트 브랜드: accent variant 안 cream (#FDE1B8) 10% 한정 정합 — text 안 ink-strong 사용
  const variantClass =
    variant === "primary" ? "bg-brand-primary-soft text-brand-primary ring-brand-primary/20"
    : variant === "neutral" ? "bg-subtle text-fg-default ring-border"
    : "bg-brand-accent-soft text-ink-strong ring-brand-accent/30";

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full ring-1 ${sizeClass} ${variantClass}`}
    >
      {children}
    </span>
  );
}
