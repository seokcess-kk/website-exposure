// @glitzy/web/components/forms/DoctorProfileForm
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Field } from "./Field";
import type { SaveResult } from "@/lib/save-result";

export type DoctorProfileInitial = {
  slug: string;
  name: string;
  title: string;
  jobTitle: string;
  honorific: string;
  bio: string;
  photoUrl: string;
  displayOrder: string;
  active: boolean;
};

const empty: DoctorProfileInitial = {
  slug: "",
  name: "",
  title: "",
  jobTitle: "",
  honorific: "",
  bio: "",
  photoUrl: "",
  displayOrder: "0",
  active: true,
};

export function DoctorProfileForm({
  action,
  initial,
  isNew,
}: {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initial: DoctorProfileInitial | null;
  isNew: boolean;
}) {
  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
  const [values, setValues] = useState<DoctorProfileInitial>(initial ?? empty);
  const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;
  const set = (k: keyof DoctorProfileInitial, v: string | boolean) =>
    setValues((p) => ({ ...p, [k]: v }));

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.ok === true && (
        <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
          저장되었습니다.
        </div>
      )}
      {formError && (
        <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">
          {formError}
        </div>
      )}

      <Field name="slug" label="slug" required value={values.slug} onChange={(v) => set("slug", v)} errors={fieldErrors.slug} maxLength={64} hint="3~64자 · 소문자/숫자/하이픈" />
      <Field name="name" label="이름" required value={values.name} onChange={(v) => set("name", v)} errors={fieldErrors.name} maxLength={100} />
      <Field name="title" label="직함" value={values.title} onChange={(v) => set("title", v)} errors={fieldErrors.title} maxLength={100} placeholder="예: 대표원장" />
      <Field name="jobTitle" label="직책" value={values.jobTitle} onChange={(v) => set("jobTitle", v)} errors={fieldErrors.jobTitle} maxLength={100} />
      <Field name="honorific" label="호칭" value={values.honorific} onChange={(v) => set("honorific", v)} errors={fieldErrors.honorific} maxLength={20} placeholder="예: 박사" />
      <Field name="bio" label="약력" textarea rows={6} value={values.bio} onChange={(v) => set("bio", v)} errors={fieldErrors.bio} maxLength={2000} />
      <Field name="photoUrl" label="사진 URL" type="url" value={values.photoUrl} onChange={(v) => set("photoUrl", v)} errors={fieldErrors.photoUrl} maxLength={2048} />
      <Field name="displayOrder" label="표시 순서" value={values.displayOrder} onChange={(v) => set("displayOrder", v)} errors={fieldErrors.displayOrder} hint="작을수록 앞 (정수)" />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="active"
          value="true"
          checked={values.active}
          onChange={(e) => set("active", e.target.checked)}
        />
        <span>활성</span>
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
