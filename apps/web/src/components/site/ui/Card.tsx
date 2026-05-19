// @glitzy/web/components/site/ui/Card — Supanova Double-Bezel Card Architecture
// SoT: supanova-design-skill/soft-skill § 4.A
//   outer shell: bg-black/5 ring-1 ring-border/40 p-1.5 rounded-[2rem]
//   inner core: shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] rounded-[calc(2rem-0.375rem)]

import Link from "next/link";
import type { ReactNode } from "react";

type BaseProps = {
  children: ReactNode;
  variant?: "elevated" | "outline" | "tinted";
  padding?: "sm" | "md" | "lg" | "none";
  className?: string;
};

const PADDING_CLASS: Record<NonNullable<BaseProps["padding"]>, string> = {
  none: "",
  sm: "p-4",
  md: "p-6 md:p-7",
  lg: "p-8 md:p-10",
};

function shellClass({ variant = "elevated", className = "" }: { variant?: BaseProps["variant"]; className?: string }) {
  const shellBg =
    variant === "tinted" ? "bg-brand-primary-soft/40 ring-brand-primary/15"
    : variant === "outline" ? "bg-transparent ring-border"
    : "bg-ink-strong/[0.04] ring-border/40";
  return `relative rounded-[2rem] p-1.5 ring-1 ${shellBg} shadow-supanova ${className}`.trim();
}

function coreClass(padding: BaseProps["padding"], variant: BaseProps["variant"]) {
  const coreBg = variant === "tinted" ? "bg-elevated" : "bg-elevated";
  return `relative rounded-[calc(2rem-0.375rem)] ${coreBg} ${PADDING_CLASS[padding ?? "md"]} shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]`;
}

export function Card({ children, variant = "elevated", padding = "md", className = "" }: BaseProps) {
  return (
    <div className={shellClass({ variant, className })}>
      <div className={coreClass(padding, variant)}>{children}</div>
    </div>
  );
}

export function CardLink({
  href,
  external = false,
  children,
  variant = "elevated",
  padding = "md",
  className = "",
}: BaseProps & { href: string; external?: boolean }) {
  const wrapper = `group block ${shellClass({ variant, className })} transition-all duration-500 ease-supanova hover:-translate-y-1 hover:shadow-supanova-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary`;
  const inner = coreClass(padding, variant);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={wrapper}>
        <div className={inner}>{children}</div>
      </a>
    );
  }
  return (
    <Link href={href} className={wrapper}>
      <div className={inner}>{children}</div>
    </Link>
  );
}
