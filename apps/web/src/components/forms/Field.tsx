// @glitzy/web/components/forms/Field — 공통 input/textarea/select field
"use client";

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
