// @glitzy/web/components/forms/AdvancedSection — ADMIN_SIMPLIFY A1
// 폼 안 기술 필드 (slug · displayOrder · SEO 메타 등) 묶음 collapsible. default 접힘.
// children 은 항상 mount (CSS hide) — input form data 안 form submit 시 누락 회피.

"use client";

import { useState, type ReactNode } from "react";

export function AdvancedSection({
  title = "고급 설정",
  description,
  children,
  defaultOpen = false,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="rounded-md border border-slate-200 bg-slate-50/50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-100"
      >
        <span className="flex flex-col gap-0.5">
          <span>{title}</span>
          {description && (
            <span className="text-xs font-normal text-slate-500">{description}</span>
          )}
        </span>
        <span aria-hidden className="text-slate-400">{open ? "▾" : "▸"}</span>
      </button>
      <div
        className={`flex flex-col gap-5 border-t border-slate-200 px-4 py-4 ${open ? "" : "hidden"}`}
        aria-hidden={!open}
      >
        {children}
      </div>
    </section>
  );
}
