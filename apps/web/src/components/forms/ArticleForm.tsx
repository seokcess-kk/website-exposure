// @glitzy/web/components/forms/ArticleForm
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Field, SelectField } from "./Field";
import { useAutoSlug } from "@/hooks/useAutoSlug";
import type { SaveResult } from "@/lib/save-result";

export type ArticleInitial = {
  slug: string;
  title: string;
  summary: string;
  bodyMarkdown: string;
  status: string;
  riskLevel: string;
  heroImageUrl: string;
  authorDoctorId: string;
  categoryId: string;
};

const empty: ArticleInitial = {
  slug: "",
  title: "",
  summary: "",
  bodyMarkdown: "",
  status: "draft",
  riskLevel: "",
  heroImageUrl: "",
  authorDoctorId: "",
  categoryId: "",
};

const STATUS_OPTIONS = [
  { value: "draft", label: "초안" },
  { value: "review-queued", label: "검수 대기" },
  { value: "in-review", label: "검수 중" },
  { value: "approved", label: "승인됨" },
  { value: "publishable", label: "발행 가능" },
  { value: "published", label: "발행됨" },
  { value: "blocked", label: "차단" },
  { value: "rejected", label: "거부" },
  { value: "stale", label: "만료" },
];

const RISK_OPTIONS = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

export function ArticleForm({
  action,
  initial,
  isNew,
  doctorOptions,
  categoryOptions,
}: {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initial: ArticleInitial | null;
  isNew: boolean;
  doctorOptions: ReadonlyArray<{ value: string; label: string }>;
  categoryOptions: ReadonlyArray<{ value: string; label: string }>;
}) {
  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
  const [v, setV] = useState<ArticleInitial>(initial ?? empty);
  const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;
  const set = (k: keyof ArticleInitial, val: string) => setV((p) => ({ ...p, [k]: val }));

  const { markSlugDirty } = useAutoSlug({
    source: v.title,
    setSlug: (s) => set("slug", s),
    isNew,
    options: { maxLength: 99, fallbackPrefix: "article" },
  });

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.ok === true && (
        <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
          저장되었습니다.
        </div>
      )}
      {formError && (
        <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">{formError}</div>
      )}

      <Field name="slug" label="slug" required value={v.slug} onChange={(x) => { markSlugDirty(); set("slug", x); }} errors={fieldErrors.slug} maxLength={100} hint="제목 입력 시 자동 생성 · 직접 수정 가능" />
      <Field name="title" label="제목" required value={v.title} onChange={(x) => set("title", x)} errors={fieldErrors.title} maxLength={200} />
      <Field name="summary" label="요약" required textarea rows={3} value={v.summary} onChange={(x) => set("summary", x)} errors={fieldErrors.summary} minLength={80} maxLength={200} hint="80~200자" />
      <Field name="bodyMarkdown" label="본문 (Markdown)" required textarea rows={18} value={v.bodyMarkdown} onChange={(x) => set("bodyMarkdown", x)} errors={fieldErrors.bodyMarkdown} maxLength={100000} />
      <Field name="heroImageUrl" label="hero 이미지 URL" type="url" value={v.heroImageUrl} onChange={(x) => set("heroImageUrl", x)} errors={fieldErrors.heroImageUrl} maxLength={2048} />
      {/* CAM-18 정정: status 직접 선택 차단 — workflow action 버튼 통해서만 전이. read-only display. */}
      <label className="flex flex-col gap-1 text-sm">
        <span>발행 상태 (workflow actions 통해서만 전이)</span>
        {/* CWI-01 정정: name 제거 — FormData 안 status 미포함 */}
        <input type="text" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
      </label>
      <SelectField name="riskLevel" label="위험도" value={v.riskLevel} onChange={(x) => set("riskLevel", x)} options={RISK_OPTIONS} errors={fieldErrors.riskLevel} />
      <SelectField
        name="authorDoctorId"
        label="저자 (DoctorProfile)"
        value={v.authorDoctorId}
        onChange={(x) => set("authorDoctorId", x)}
        options={doctorOptions}
        errors={fieldErrors.authorDoctorId}
        hint="선택 시 해당 의료진의 저자 권위 표시"
      />
      <SelectField
        name="categoryId"
        label="카테고리"
        value={v.categoryId}
        onChange={(x) => set("categoryId", x)}
        options={categoryOptions}
        errors={fieldErrors.categoryId}
        hint="비워두면 기본 카테고리(general) 사용"
      />

      <SubmitButton isNew={isNew} />
    </form>
  );
}

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
    >
      {pending ? "저장 중…" : isNew ? "추가" : "저장"}
    </button>
  );
}
