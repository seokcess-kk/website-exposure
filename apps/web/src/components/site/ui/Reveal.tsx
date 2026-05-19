// @glitzy/web/components/site/ui/Reveal — Supanova scroll entry animation wrapper
// SoT: supanova-design-skill/soft-skill § 5.C
//   IntersectionObserver 안 viewport 진입 시 fadeInUp (opacity + translateY + blur) animation.
//   stagger 시 delayMs prop 안 cascade.

"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function Reveal({
  children,
  delayMs = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delayMs?: number;
  as?: "div" | "section" | "article" | "li" | "header";
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("in-view");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("in-view");
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`supanova-reveal ${className}`}
      style={{ animationDelay: delayMs > 0 ? `${delayMs}ms` : undefined }}
    >
      {children}
    </Tag>
  );
}
