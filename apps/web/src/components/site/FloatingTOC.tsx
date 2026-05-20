// @glitzy/web/components/site/FloatingTOC — 좌측 플로팅 목차 (위키/나무위키 패턴)
// 사용자 결정 2026-05-20 — 신수용 대표원장 개인 페이지 컨셉, 점프링크 + 활성 섹션 하이라이트.
// 데스크탑(lg+) 좌측 sticky · 모바일 비표시 (대신 헤더 menu).

"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type TocItem = {
  /** anchor id (page section id 와 매칭) */
  id: string;
  /** 표시 라벨 */
  label: string;
  /** 들여쓰기 (1=상위, 2=하위) */
  level?: 1 | 2;
};

export function FloatingTOC({ items, eyebrow = "Contents" }: { items: ReadonlyArray<TocItem>; eyebrow?: string }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0) return;
    const sections = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0]!.target.id;
          if (id) setActive(id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside
      aria-label="목차"
      className="pointer-events-none fixed left-6 top-32 z-30 hidden w-52 lg:block xl:left-10 xl:w-60"
    >
      <nav className="pointer-events-auto rounded-2xl border border-border/40 bg-elevated/90 p-4 shadow-supanova backdrop-blur">
        <div className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-fg-muted">
          {eyebrow}
        </div>
        <ol className="flex flex-col gap-1.5">
          {items.map((it) => (
            <li key={it.id} className={cn(it.level === 2 && "ml-3")}>
              <a
                href={`#${it.id}`}
                className={cn(
                  "block rounded-md px-2 py-1 text-xs leading-snug transition-all duration-300 ease-out",
                  active === it.id
                    ? "bg-brand-primary-soft font-semibold text-brand-primary"
                    : "text-fg-muted hover:bg-subtle hover:text-ink-strong",
                )}
              >
                {it.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}
