// @glitzy/web/components/forms/ArticleForm
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Field, SelectField } from "./Field";
import { AdminLivePreview, EmptyPreview, PreviewText, type AppliedLocation } from "./AdminLivePreview";
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
  instanceSlug,
}: {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initial: ArticleInitial | null;
  isNew: boolean;
  doctorOptions: ReadonlyArray<{ value: string; label: string }>;
  categoryOptions: ReadonlyArray<{ value: string; label: string }>;
  instanceSlug: string;
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
  const previewSlug = v.slug.trim() || "article";
  const locations: AppliedLocation[] = [
    { label: "메인 > 기사 및 칼럼 섹션", href: `/${instanceSlug}#trust-articles`, note: "공개 상태가 되면 메인 카드 영역에 노출됩니다." },
    { label: "기사 및 칼럼 목록", href: `/${instanceSlug}/insights` },
    { label: "아티클 상세 페이지", href: `/${instanceSlug}/insights/general/${previewSlug}`, note: "실제 상세 주소는 선택한 카테고리에 따라 달라집니다." },
    { label: "저자 의료진 페이지", href: `/${instanceSlug}/doctors`, note: "저자를 선택하면 의료진 페이지와 연결됩니다." },
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
            <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">{formError}</div>
          )}

          <Field name="slug" label="slug" required value={v.slug} onChange={(x) => { markSlugDirty(); set("slug", x); }} errors={fieldErrors.slug} maxLength={100} hint="제목 입력 시 자동 생성 · 직접 수정 가능" />
          <Field name="title" label="제목" required value={v.title} onChange={(x) => set("title", x)} errors={fieldErrors.title} maxLength={200} />
          <Field name="summary" label="요약" required textarea rows={3} value={v.summary} onChange={(x) => set("summary", x)} errors={fieldErrors.summary} minLength={80} maxLength={200} hint="80~200자" />
          <Field name="bodyMarkdown" label="본문 (Markdown)" required textarea rows={18} value={v.bodyMarkdown} onChange={(x) => set("bodyMarkdown", x)} errors={fieldErrors.bodyMarkdown} maxLength={100000} />
          <Field name="heroImageUrl" label="hero 이미지 URL" type="url" value={v.heroImageUrl} onChange={(x) => set("heroImageUrl", x)} errors={fieldErrors.heroImageUrl} maxLength={2048} />
          <SelectField
            name="authorDoctorId"
            label="저자"
            value={v.authorDoctorId}
            onChange={(x) => set("authorDoctorId", x)}
            options={doctorOptions}
            errors={fieldErrors.authorDoctorId}
            hint="선택 시 해당 의료진의 저자 정보로 연결됩니다."
          />
          <SelectField
            name="categoryId"
            label="카테고리"
            value={v.categoryId}
            onChange={(x) => set("categoryId", x)}
            options={categoryOptions}
            errors={fieldErrors.categoryId}
            hint="비워두면 기본 카테고리를 사용합니다."
          />

          <SubmitButton isNew={isNew} />
        </div>

        <AdminLivePreview locations={locations}>
          {v.title.trim() || v.summary.trim() || v.heroImageUrl.trim() ? (
            <article className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              {v.heroImageUrl.trim() ? (
                <div className="aspect-video bg-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.heroImageUrl} alt="" className="h-full w-full object-cover" />
                </div>
              ) : null}
              <div className="p-4">
                <div className="mb-2 text-[11px] font-semibold uppercase text-slate-400">기사 및 칼럼</div>
                <h3 className="text-base font-semibold leading-snug text-slate-950">
                  <PreviewText value={v.title} fallback="아티클 제목이 여기에 표시됩니다." />
                </h3>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                  <PreviewText value={v.summary} fallback="요약이 여기에 표시됩니다." />
                </p>
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <div className="mb-2 text-xs font-medium text-slate-500">본문</div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    <PreviewText value={v.bodyMarkdown} fallback="본문을 입력하면 이 영역에서 길게 확인할 수 있습니다." />
                  </div>
                </div>
              </div>
            </article>
          ) : (
            <EmptyPreview label="제목과 요약을 입력하면 아티클 카드 미리보기가 표시됩니다." />
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
