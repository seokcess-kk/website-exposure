// @glitzy/web/components/forms/Field — 공통 input/textarea/select field
"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";

export type FieldProps = {
  name: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  errors?: string[];
  textarea?: boolean;
  type?: "text" | "url" | "date" | "email" | "datetime-local";
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  hint?: string;
  rows?: number;
};

const inputClass =
  "rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900";

export function Field(p: FieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span>
        {p.label}
        {p.required && <span className="ml-1 text-rose-600">*</span>}
      </span>
      {p.textarea ? (
        <textarea
          name={p.name}
          required={p.required}
          value={p.value}
          onChange={(e) => p.onChange(e.target.value)}
          minLength={p.minLength}
          maxLength={p.maxLength}
          placeholder={p.placeholder}
          rows={p.rows ?? 5}
          className={inputClass}
        />
      ) : (
        <input
          type={p.type ?? "text"}
          name={p.name}
          required={p.required}
          value={p.value}
          onChange={(e) => p.onChange(e.target.value)}
          minLength={p.minLength}
          maxLength={p.maxLength}
          placeholder={p.placeholder}
          className={inputClass}
        />
      )}
      {p.hint && <span className="text-xs text-slate-500">{p.hint}</span>}
      {p.errors && p.errors.length > 0 && (
        <span className="text-xs text-rose-700">{p.errors.join(", ")}</span>
      )}
    </label>
  );
}

export function SelectField({
  name,
  label,
  value,
  onChange,
  options,
  required,
  errors,
  hint,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: ReadonlyArray<{ value: string; label: string }>;
  required?: boolean;
  errors?: string[];
  hint?: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span>
        {label}
        {required && <span className="ml-1 text-rose-600">*</span>}
      </span>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={inputClass}
      >
        {!required && <option value="">— 선택 —</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
      {errors && errors.length > 0 && (
        <span className="text-xs text-rose-700">{errors.join(", ")}</span>
      )}
    </label>
  );
}

// ============================================================================
// MultiSelectField — EVIDENCE_LINKING_PLAN v0.2 § 2 (v1 축소: 체크박스 리스트 + chip 요약)
// ============================================================================
// FormData 직렬화: 선택된 value 마다 동일 name 다중 hidden input → formData.getAll(name) 패턴
// (cycle1 #4 정합 — CSV 미사용). zod 안 z.array(z.string()) 자연 지원.
// v1 안 검색·combobox·aria-multiselectable 키보드 정합은 ELI-DEFER-01 (cycle 1.1) 합류.

export type MultiSelectOption = {
  value: string;
  label: string;
  sublabel?: string;
  disabled?: boolean;
};

export function MultiSelectField({
  name,
  label,
  options,
  defaultValue,
  description,
  emptyLabel,
  maxItems = 20,
  errors,
}: {
  name: string;
  label: string;
  options: ReadonlyArray<MultiSelectOption>;
  defaultValue?: ReadonlyArray<string>;
  description?: ReactNode;
  emptyLabel?: string;
  maxItems?: number;
  errors?: string[];
}) {
  const id = useId();
  // 외부 폼 reset 시에는 controlled state 가 살짝 어색해질 수 있으나 v1 안 신경 안 씀
  const [selected, setSelected] = useState<Set<string>>(() => new Set(defaultValue ?? []));

  const toggle = (value: string, currentlyChecked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (currentlyChecked) {
        next.delete(value);
      } else {
        if (next.size >= maxItems) return prev;
        next.add(value);
      }
      return next;
    });
  };

  const remove = (value: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(value);
      return next;
    });
  };

  const selectedOptions = options.filter((o) => selected.has(o.value));
  const atLimit = selected.size >= maxItems;

  return (
    <fieldset className="flex flex-col gap-2 rounded-md border border-slate-200 bg-white px-3 py-3 text-sm">
      <legend className="px-1 text-sm font-semibold text-slate-800">{label}</legend>
      {description && <div className="text-xs text-slate-500">{description}</div>}

      {/* 선택된 항목 chip 요약 */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedOptions.map((o) => (
            <span
              key={o.value}
              className="inline-flex max-w-full items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
            >
              <span className="truncate" title={o.label}>{o.label}</span>
              <button
                type="button"
                onClick={() => remove(o.value)}
                aria-label={`${o.label} 선택 해제`}
                className="-mr-0.5 rounded-full px-1 leading-none text-slate-500 hover:bg-slate-200 hover:text-slate-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 동일 name 다중 hidden input — formData.getAll() 회수 패턴 */}
      {selectedOptions.map((o) => (
        <input key={o.value} type="hidden" name={name} value={o.value} />
      ))}

      {/* 옵션 체크박스 리스트 */}
      {options.length === 0 ? (
        <div className="rounded-md bg-slate-50 px-3 py-4 text-center text-xs text-slate-500">
          {emptyLabel ?? "선택할 항목이 없습니다."}
        </div>
      ) : (
        <ul className="flex max-h-56 flex-col gap-0.5 overflow-y-auto rounded-md border border-slate-100 bg-slate-50/40 px-2 py-1.5">
          {options.map((o) => {
            const checked = selected.has(o.value);
            const optionId = `${id}-${o.value}`;
            const disabled = o.disabled || (!checked && atLimit);
            return (
              <li key={o.value}>
                <label
                  htmlFor={optionId}
                  className={`flex items-start gap-2 rounded px-1.5 py-1 ${
                    disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    id={optionId}
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggle(o.value, checked)}
                    className="mt-0.5 h-3.5 w-3.5"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="truncate text-xs text-slate-800" title={o.label}>{o.label}</span>
                    {o.sublabel && (
                      <span className="ml-1 text-[10px] text-slate-500">· {o.sublabel}</span>
                    )}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {atLimit && (
        <div className="text-[11px] text-amber-700">
          최대 {maxItems}개까지 선택 가능. 다른 항목을 해제한 뒤 추가하세요.
        </div>
      )}
      {errors && errors.length > 0 && (
        <div className="text-xs text-rose-700">{errors.join(", ")}</div>
      )}
    </fieldset>
  );
}
