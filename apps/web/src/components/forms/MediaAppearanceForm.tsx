// @glitzy/web/components/forms/MediaAppearanceForm — EAT_CONTENT_PLAN v1.0 § 4.1
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Field, SelectField } from "./Field";
import { useAutoSlug } from "@/hooks/useAutoSlug";
import type { SaveResult } from "@/lib/save-result";

export type MediaAppearanceInitial = {
  slug: string;
  title: string;
  channelName: string;
  channelType: string;
  publishedDate: string;
  durationSeconds: string;
  url: string;
  thumbnailUrl: string;
  summary: string;
  authorDoctorId: string;
  status: string;
};

const empty: MediaAppearanceInitial = {
  slug: "",
  title: "",
  channelName: "",
  channelType: "youtube",
  publishedDate: "",
  durationSeconds: "",
  url: "",
  thumbnailUrl: "",
  summary: "",
  authorDoctorId: "",
  status: "draft",
};

const CHANNEL_OPTIONS = [
  { value: "broadcast", label: "방송 (BroadcastEvent EC-DEFER-11)" },
  { value: "youtube", label: "유튜브" },
  { value: "podcast", label: "팟캐스트" },
  { value: "press", label: "기사 (NewsArticle EC-DEFER-11)" },
];

const STATUS_OPTIONS = [{ value: "draft", label: "초안" }];

export function MediaAppearanceForm({
  action,
  initial,
  isNew,
  doctorOptions,
}: {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initial: MediaAppearanceInitial | null;
  isNew: boolean;
  doctorOptions: ReadonlyArray<{ value: string; label: string }>;
}) {
  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
  const [v, setV] = useState<MediaAppearanceInitial>(initial ?? empty);
  const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;
  const set = (k: keyof MediaAppearanceInitial, val: string) => setV((p) => ({ ...p, [k]: val }));

  const { markSlugDirty } = useAutoSlug({
    source: v.title,
    setSlug: (s) => set("slug", s),
    isNew,
    options: { maxLength: 99, fallbackPrefix: "media" },
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
      <Field name="title" label="제목" required value={v.title} onChange={(x) => set("title", x)} errors={fieldErrors.title} maxLength={300} />
      <Field name="channelName" label="채널명" required value={v.channelName} onChange={(x) => set("channelName", x)} errors={fieldErrors.channelName} maxLength={100} />
      <SelectField name="channelType" label="채널 종류" required value={v.channelType} onChange={(x) => set("channelType", x)} options={CHANNEL_OPTIONS} errors={fieldErrors.channelType} hint="v0.1 단계 모두 schema.org VideoObject 단일화" />
      <Field name="publishedDate" label="게재일" type="date" required value={v.publishedDate} onChange={(x) => set("publishedDate", x)} errors={fieldErrors.publishedDate} />
      <Field name="durationSeconds" label="길이 (초)" value={v.durationSeconds} onChange={(x) => set("durationSeconds", x)} errors={fieldErrors.durationSeconds} hint="양의 정수 · 선택" />
      <Field name="url" label="원문 URL" type="url" required value={v.url} onChange={(x) => set("url", x)} errors={fieldErrors.url} maxLength={2048} />
      <Field name="thumbnailUrl" label="썸네일 URL" type="url" value={v.thumbnailUrl} onChange={(x) => set("thumbnailUrl", x)} errors={fieldErrors.thumbnailUrl} maxLength={2048} />
      <Field name="summary" label="요약" required textarea rows={4} value={v.summary} onChange={(x) => set("summary", x)} errors={fieldErrors.summary} minLength={50} maxLength={300} hint="50~300자" />
      <SelectField
        name="authorDoctorId"
        label="출연 의료진 (선택)"
        value={v.authorDoctorId}
        onChange={(x) => set("authorDoctorId", x)}
        options={doctorOptions}
        errors={fieldErrors.authorDoctorId}
      />
      {/* CAM-18 정정: status workflow action 버튼 전이만 — read-only display. */}
      <label className="flex flex-col gap-1 text-sm">
        <span>발행 상태 (workflow actions 통해서만 전이)</span>
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
