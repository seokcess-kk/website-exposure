// @glitzy/web/components/site/ui/PillButton — Supanova Pill CTA
// SoT: supanova-design-skill/soft-skill § 4.B
//   structure: rounded-full px-8 py-4 + nested circular arrow wrapper
//   hover: scale-[1.02] · active: scale-[0.98] · cubic-bezier 0.5s

import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const VARIANT: Record<Variant, { bg: string; text: string; ring: string }> = {
  primary: {
    bg: "bg-brand-primary hover:bg-brand-primary-hover",
    text: "text-fg-inverse",
    ring: "",
  },
  secondary: {
    bg: "bg-elevated hover:bg-brand-primary-soft/70",
    text: "text-brand-primary",
    ring: "ring-1 ring-brand-primary/20",
  },
  ghost: {
    bg: "bg-transparent hover:bg-brand-primary-soft/70",
    text: "text-brand-primary",
    ring: "",
  },
};

// 사용자 요청 (2026-05-20): 모든 버튼 화살표 제거 — 단순 pill text 만.
const SIZE: Record<Size, { wrapper: string }> = {
  md: { wrapper: "px-6 py-2.5 text-sm" },
  lg: { wrapper: "px-8 py-3 text-base" },
};

function classes(variant: Variant, size: Size, className: string) {
  const v = VARIANT[variant];
  const s = SIZE[size];
  return `inline-flex items-center justify-center rounded-full font-semibold transition-all duration-500 ease-supanova hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 ${s.wrapper} ${v.bg} ${v.text} ${v.ring} ${className}`.trim();
}

function content(children: ReactNode) {
  return <span>{children}</span>;
}

export function PillLink({
  href,
  external = false,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: {
  href: string;
  external?: boolean;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes(variant, size, className)}>
        {content(children)}
      </a>
    );
  }
  return (
    <Link href={href} className={classes(variant, size, className)}>
      {content(children)}
    </Link>
  );
}

export function PillAnchor({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  onClick,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <a href={href} className={classes(variant, size, className)} onClick={onClick}>
      {content(children)}
    </a>
  );
}
