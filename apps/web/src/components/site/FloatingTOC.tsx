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

export function FloatingTOC({
  items,
  eyebrow = "Contents",
  anchorElementId,
}: {
  items: ReadonlyArray<TocItem>;
  eyebrow?: string;
  /** 측정 대상 element id — TOC 상단을 이 element 의 viewport top 에 정렬 (예: "hero-sub-badge") */
  anchorElementId?: string;
}) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);
  const [topPx, setTopPx] = useState<number | null>(null);

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

  // === anchor 측정 — TOC 최상단을 anchor element 의 viewport top 에 align ===
  useEffect(() => {
    if (!anchorElementId) return;
    function measure() {
      const el = document.getElementById(anchorElementId!);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // 페이지 안 anchor 의 절대 Y (scroll=0 가정 시 viewport top)
      setTopPx(rect.top + window.scrollY);
    }
    measure();
    // 폰트/이미지 로딩 후 layout 변경 가능 — 다음 frame 에서 재측정
    const raf = window.requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, [anchorElementId]);

  if (items.length === 0) return null;

  let chapter = 0;
  let section = 0;
  const indexedItems = items.map((it) => {
    if (it.level === 2) {
      section += 1;
      return { ...it, index: `${chapter}.${section}` };
    }
    chapter += 1;
    section = 0;
    return { ...it, index: `${chapter}` };
  });

  return (
    <aside
      aria-label="목차"
      className={cn(
        "pointer-events-none fixed left-4 z-30 hidden w-52 lg:block 2xl:left-10 2xl:w-64",
        topPx === null && "top-44",
      )}
      style={topPx !== null ? { top: `${topPx}px` } : undefined}
    >
      <nav className="pointer-events-auto rounded-xl border border-border/50 bg-elevated/90 p-3 shadow-supanova backdrop-blur">
        <div className="mb-3 border-b border-border/60 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-fg-muted">
          {eyebrow}
        </div>
        <ol className="flex flex-col gap-1.5">
          {indexedItems.map((it) => (
            <li key={it.id} className={cn(it.level === 2 && "ml-2")}>
              <a
                href={`#${it.id}`}
                className={cn(
                  "grid grid-cols-[1.55rem_minmax(0,1fr)] items-baseline gap-1 rounded-md px-2 py-1 text-xs leading-snug transition-all duration-300 ease-out",
                  active === it.id
                    ? "bg-brand-primary-soft font-semibold text-brand-primary"
                    : "text-fg-muted hover:bg-subtle hover:text-ink-strong",
                )}
              >
                <span className="font-mono text-[10px] tabular-nums opacity-70">{it.index}</span>
                <span>{it.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}
