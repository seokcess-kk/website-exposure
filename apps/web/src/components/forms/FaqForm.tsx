// @glitzy/web/components/forms/FaqForm — EAT_CONTENT_PLAN v1.0 § 4.1
//   v0.1 단계 status='draft' DB CHECK 강제. 발행 자체 차단 (EC-DEFER-12).
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Field, SelectField } from "./Field";
import { useAutoSlug } from "@/hooks/useAutoSlug";
import type { SaveResult } from "@/lib/save-result";

export type FaqInitial = {
  slug: string;
  question: string;
  answer: string;
  displayOrder: string;
  categoryId: string;
  authorDoctorId: string;
  relatedTreatmentId: string;
  status: string;
};

const empty: FaqInitial = {
  slug: "",
  question: "",
  answer: "",
  displayOrder: "0",
  categoryId: "",
  authorDoctorId: "",
  relatedTreatmentId: "",
  status: "draft",
};

const STATUS_OPTIONS = [{ value: "draft", label: "초안" }];

export function FaqForm({
  action,
  initial,
  isNew,
  categoryOptions,
  doctorOptions,
  treatmentOptions,
}: {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initial: FaqInitial | null;
  isNew: boolean;
  categoryOptions: ReadonlyArray<{ value: string; label: string }>;
  doctorOptions: ReadonlyArray<{ value: string; label: string }>;
  treatmentOptions: ReadonlyArray<{ value: string; label: string }>;
}) {
  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
  const [v, setV] = useState<FaqInitial>(initial ?? empty);
  const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;
  const set = (k: keyof FaqInitial, val: string) => setV((p) => ({ ...p, [k]: val }));

  const { markSlugDirty } = useAutoSlug({
    source: v.question,
    setSlug: (s) => set("slug", s),
    isNew,
    options: { maxLength: 99, fallbackPrefix: "faq" },
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

      <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
        현재는 초안 저장만 가능합니다. 공개 전 검수 기능이 준비되면 발행할 수 있습니다.
      </div>

      <Field name="slug" label="slug" required value={v.slug} onChange={(x) => { markSlugDirty(); set("slug", x); }} errors={fieldErrors.slug} maxLength={100} hint="질문 입력 시 자동 생성 · 직접 수정 가능" />
      <Field name="question" label="질문" required value={v.question} onChange={(x) => set("question", x)} errors={fieldErrors.question} minLength={10} maxLength={200} hint="10~200자" />
      <Field name="answer" label="답변 (Markdown)" required textarea rows={10} value={v.answer} onChange={(x) => set("answer", x)} errors={fieldErrors.answer} minLength={50} maxLength={2000} hint="50~2000자" />
      <Field name="displayOrder" label="표시 순서" required value={v.displayOrder} onChange={(x) => set("displayOrder", x)} errors={fieldErrors.displayOrder} />
      <SelectField name="categoryId" label="카테고리 (선택)" value={v.categoryId} onChange={(x) => set("categoryId", x)} options={categoryOptions} errors={fieldErrors.categoryId} />
      <SelectField name="authorDoctorId" label="작성자 (의료진 · 선택)" value={v.authorDoctorId} onChange={(x) => set("authorDoctorId", x)} options={doctorOptions} errors={fieldErrors.authorDoctorId} />
      <SelectField name="relatedTreatmentId" label="관련 진료 페이지 (선택)" value={v.relatedTreatmentId} onChange={(x) => set("relatedTreatmentId", x)} options={treatmentOptions} errors={fieldErrors.relatedTreatmentId} />
      {/* CAM-18 정정: status workflow action 버튼 전이만 — read-only display. */}
      <label className="flex flex-col gap-1 text-sm">
        <span>발행 상태</span>
        {/* CWI-01 정정: name 제거 — FormData 안 status 미포함 */}
        <input type="text" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
      </label>

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
