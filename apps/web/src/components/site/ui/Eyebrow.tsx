// @glitzy/web/components/site/ui/Eyebrow — uppercase label (section 위 hint)
// "단아" design system v1.0 — heading 위 작은 라벨, gold accent + letter-spacing wide.

export function Eyebrow({ children, as = "span" }: { children: React.ReactNode; as?: "span" | "div" }) {
  const Tag = as;
  return <Tag className="text-eyebrow">{children}</Tag>;
}
