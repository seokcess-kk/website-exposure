// @glitzy/web/components/forms/TreatmentPrinciplesEditor — Phase 4 정교화
// TreatmentPage 별 principles override (3원칙). row 별 add/remove + 4 field 편집.
// JSON string 양방향 변환 (TreatmentPageForm.principlesJson state 와 호환).

"use client";

import { useEffect, useMemo, useState } from "react";

type Principle = { n: string; icon: string; title: string; desc: string };

function s(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function parseInitial(raw: string): Principle[] {
  if (raw.trim() === "") return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((x) => {
      const o = (typeof x === "object" && x !== null ? x : {}) as Record<string, unknown>;
      return { n: s(o.n), icon: s(o.icon), title: s(o.title), desc: s(o.desc) };
    });
  } catch {
    return [];
  }
}

function serialize(rows: Principle[]): string {
  const clean = rows.filter((p) => p.n || p.icon || p.title || p.desc);
  if (clean.length === 0) return "";
  return JSON.stringify(clean, null, 2);
}

export function TreatmentPrinciplesEditor({
  value,
  onChange,
  errors,
}: {
  value: string;
  onChange: (json: string) => void;
  errors?: string[];
}) {
  const initial = useMemo(() => parseInitial(value), [value]);
  const [rows, setRows] = useState<Principle[]>(initial);

  useEffect(() => {
    onChange(serialize(rows));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  const update = (i: number, key: keyof Principle, v: string) =>
    setRows((r) => r.map((p, idx) => (idx === i ? { ...p, [key]: v } : p)));
  const add = () =>
    setRows((r) => [...r, { n: String(r.length + 1).padStart(2, "0"), icon: "", title: "", desc: "" }]);
  const remove = (i: number) => setRows((r) => r.filter((_, idx) => idx !== i));

  return (
    <fieldset className="flex flex-col gap-3 rounded-md border border-slate-200 p-3">
      <div className="flex items-baseline justify-between gap-3">
        <legend className="px-1 text-xs font-medium text-slate-700">
          시술별 principles override
        </legend>
        <button
          type="button"
          onClick={add}
          className="rounded border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
        >
          + 추가
        </button>
      </div>
      <p className="text-[11px] text-slate-500">
        비워두면 ClinicProfile.metadata.standardPrinciples 사용. 시술 특화 단계가 필요한 경우만 입력.
      </p>

      {errors && errors.length > 0 ? (
        <div className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900">
          {errors.join(" · ")}
        </div>
      ) : null}

      {rows.length === 0 ? (
        <p className="text-[11px] italic text-slate-400">(비어 있음 — clinic.metadata.standardPrinciples 사용)</p>
      ) : (
        rows.map((p, i) => (
          <div key={`p-${i}`} className="flex flex-col gap-2 rounded border border-slate-100 bg-slate-50/40 p-2 md:flex-row md:flex-wrap md:items-start">
            <div className="flex flex-1 flex-wrap gap-2">
              <Mini label="n" value={p.n} onChange={(v) => update(i, "n", v)} placeholder="01" />
              <Mini label="icon" value={p.icon} onChange={(v) => update(i, "icon", v)} placeholder="mdi:account-search" />
              <Mini label="title" value={p.title} onChange={(v) => update(i, "title", v)} placeholder="체질 진단" />
              <Mini label="desc" value={p.desc} onChange={(v) => update(i, "desc", v)} placeholder="사상체질 진단·신진대사 평가" wide />
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="self-end rounded border border-rose-200 bg-white px-2 py-0.5 text-[11px] font-medium text-rose-600 hover:bg-rose-50"
            >
              삭제
            </button>
          </div>
        ))
      )}

      {/* hidden input — server action 안 FormData 안 principlesJson 키로 전달 */}
      <input type="hidden" name="principlesJson" value={value} />
    </fieldset>
  );
}

function Mini({
  label, value, onChange, placeholder, wide,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; wide?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-0.5 text-[11px] text-slate-600 ${wide ? "w-full" : "w-44"}`}>
      <span className="font-mono">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded border border-slate-300 px-2 py-1 text-xs"
      />
    </label>
  );
}
