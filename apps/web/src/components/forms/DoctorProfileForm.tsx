// @glitzy/web/components/forms/DoctorProfileForm
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Field } from "./Field";
import { AdminLivePreview, EmptyPreview, PreviewText, type AppliedLocation } from "./AdminLivePreview";
import { useAutoSlug } from "@/hooks/useAutoSlug";
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
  instanceSlug,
}: {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initial: DoctorProfileInitial | null;
  isNew: boolean;
  instanceSlug: string;
}) {
  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
  const [values, setValues] = useState<DoctorProfileInitial>(initial ?? empty);
  const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;
  const set = (k: keyof DoctorProfileInitial, v: string | boolean) =>
    setValues((p) => ({ ...p, [k]: v }));

  const { markSlugDirty } = useAutoSlug({
    source: values.name,
    setSlug: (s) => set("slug", s),
    isNew,
    options: { maxLength: 64, fallbackPrefix: "doctor" },
  });
  const previewSlug = values.slug.trim() || "doctor";
  const locations: AppliedLocation[] = [
    { label: "메인 > 대표원장 이야기", href: `/${instanceSlug}#doctor-intro`, note: "대표 의료진으로 노출될 때 소개 영역에 반영됩니다." },
    { label: "메인 > 약력", href: `/${instanceSlug}#doctor-cv` },
    { label: "의료진 상세 페이지", href: `/${instanceSlug}/doctors/${previewSlug}` },
    { label: "아티클 저자/논문/미디어 연결", href: `/${instanceSlug}/doctors`, note: "콘텐츠에서 이 의료진을 선택하면 함께 연결됩니다." },
  ];

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex flex-col gap-5">
          {state?.ok === true && (
            <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
              저장되었습니다. 적용 위치에서 공개 화면을 확인할 수 있습니다.
            </div>
          )}
          {formError && (
            <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">
              {formError}
            </div>
          )}

          <Field name="slug" label="slug" required value={values.slug} onChange={(v) => { markSlugDirty(); set("slug", v); }} errors={fieldErrors.slug} maxLength={64} hint="3~64자 · 소문자/숫자/하이픈 · 이름 입력 시 자동 생성" />
          <Field name="name" label="이름" required value={values.name} onChange={(v) => set("name", v)} errors={fieldErrors.name} maxLength={100} />
          <Field name="title" label="직함" value={values.title} onChange={(v) => set("title", v)} errors={fieldErrors.title} maxLength={100} placeholder="예: 대표원장" />
          <Field name="jobTitle" label="직책" value={values.jobTitle} onChange={(v) => set("jobTitle", v)} errors={fieldErrors.jobTitle} maxLength={100} />
          <Field name="honorific" label="호칭" value={values.honorific} onChange={(v) => set("honorific", v)} errors={fieldErrors.honorific} maxLength={20} placeholder="예: 박사" />
          <Field name="bio" label="약력" textarea rows={6} value={values.bio} onChange={(v) => set("bio", v)} errors={fieldErrors.bio} maxLength={2000} />
          <Field name="photoUrl" label="사진 URL" type="url" value={values.photoUrl} onChange={(v) => set("photoUrl", v)} errors={fieldErrors.photoUrl} maxLength={2048} hint="권장 600×750 (4:5 · 인물 세로) · 의료진 카드 + 상세 페이지 + SiteHeader avatar" />
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
        </div>

        <AdminLivePreview locations={locations}>
          {values.name.trim() || values.bio.trim() || values.photoUrl.trim() ? (
            <article className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-slate-200">
                  {values.photoUrl.trim() ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={values.photoUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-400">사진</div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase text-slate-400">의료진</div>
                  <h3 className="mt-1 text-lg font-semibold leading-snug text-slate-950">
                    <PreviewText value={values.name} fallback="이름" />
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    <PreviewText value={values.title || values.jobTitle} fallback="직함" />
                  </p>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                <PreviewText value={values.bio} fallback="약력이 여기에 표시됩니다." />
              </p>
            </article>
          ) : (
            <EmptyPreview label="이름과 약력을 입력하면 의료진 미리보기가 표시됩니다." />
          )}
        </AdminLivePreview>
      </div>
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
