// @glitzy/web/components/forms/ArticleCategoryForm — EAT_CONTENT_PLAN v1.0 § 4.1
//   v0.1 minimal: slug · name · description · displayOrder. EC-DEFER-10 (parentCategory · pillar · coverImageUrl · seoMeta · articleTypeDefault).
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Field } from "./Field";
import { useAutoSlug } from "@/hooks/useAutoSlug";
import type { SaveResult } from "@/lib/save-result";

export type ArticleCategoryInitial = {
  slug: string;
  name: string;
  description: string;
  displayOrder: string;
};

const empty: ArticleCategoryInitial = {
  slug: "",
  name: "",
  description: "",
  displayOrder: "0",
};

export function ArticleCategoryForm({
  action,
  initial,
  isNew,
  isDefault = false,
}: {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initial: ArticleCategoryInitial | null;
  isNew: boolean;
  isDefault?: boolean;
}) {
  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
  const [v, setV] = useState<ArticleCategoryInitial>(initial ?? empty);
  const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;
  const set = (k: keyof ArticleCategoryInitial, val: string) => setV((p) => ({ ...p, [k]: val }));

  const { markSlugDirty } = useAutoSlug({
    source: v.name,
    setSlug: (s) => set("slug", s),
    isNew: isNew && !isDefault,
    options: { maxLength: 64, fallbackPrefix: "category" },
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
      {isDefault && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
          기본 카테고리(general) 는 시스템 invariant 입니다. slug 변경 · 삭제가 차단됩니다.
        </div>
      )}

      {isDefault ? (
        <label className="flex flex-col gap-1 text-sm">
          <span>slug<span className="ml-1 text-rose-600">*</span></span>
          <input
            type="text"
            name="slug"
            value={v.slug}
            readOnly
            className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500"
          />
        </label>
      ) : (
        <Field name="slug" label="slug" required value={v.slug} onChange={(x) => { markSlugDirty(); set("slug", x); }} errors={fieldErrors.slug} maxLength={64} hint="3~64자 · 소문자/숫자/하이픈 · 이름 입력 시 자동 생성" />
      )}
      <Field name="name" label="이름" required value={v.name} onChange={(x) => set("name", x)} errors={fieldErrors.name} maxLength={50} />
      <Field name="description" label="설명" textarea rows={3} value={v.description} onChange={(x) => set("description", x)} errors={fieldErrors.description} maxLength={200} hint="입력 시 80~200자 (선택)" />
      <Field name="displayOrder" label="표시 순서" required value={v.displayOrder} onChange={(x) => set("displayOrder", x)} errors={fieldErrors.displayOrder} hint="0 ~ 9999" />

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
