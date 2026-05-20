// @glitzy/web/components/forms/AdminLivePreview — admin form side preview + applied locations.
"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export type AppliedLocation = {
  label: string;
  href?: string;
  note?: string;
};

export function AdminLivePreview({
  title = "실시간 미리보기",
  description = "저장 전 화면에 보일 형태를 본문까지 확인할 수 있습니다.",
  locations,
  children,
}: {
  title?: string;
  description?: string;
  locations: ReadonlyArray<AppliedLocation>;
  children: ReactNode;
}) {
  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start">
      <section className="shrink-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-950">적용 위치</h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          {locations.map((location) => (
            <li key={location.label} className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2">
              {location.href ? (
                <Link href={location.href} className="font-medium text-blue-700 hover:underline">
                  {location.label}
                </Link>
              ) : (
                <span className="font-medium text-slate-800">{location.label}</span>
              )}
              {location.note ? <p className="mt-0.5 text-xs text-slate-500">{location.note}</p> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex min-h-0 flex-1 flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>
        </div>
        <div className="min-h-[24rem] flex-1 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 p-3">
          {children}
        </div>
      </section>
    </aside>
  );
}

export function EmptyPreview({ label }: { label: string }) {
  return (
    <div className="flex min-h-32 items-center justify-center rounded-md border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500">
      {label}
    </div>
  );
}

export function PreviewText({ value, fallback }: { value: string; fallback: string }) {
  return <>{value.trim() ? value : <span className="text-slate-400">{fallback}</span>}</>;
}
