// @glitzy/web/components/forms/ArticleForm
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Field, SelectField } from "./Field";
import { AdminLivePreview, EmptyPreview, PreviewText, type AppliedLocation } from "./AdminLivePreview";
import { ImageSourceField } from "./ImageSourceField";
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
  externalUrl: string;
  contentSource: "internal" | "external";
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
  externalUrl: "",
  contentSource: "internal",
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
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;
  const set = (k: keyof ArticleInitial, val: string) => setV((p) => ({ ...p, [k]: val }));

  async function handleExternalAutoFill() {
    const url = v.externalUrl.trim();
    if (!url) {
      setFetchError("외부 기사 URL을 먼저 입력해주세요.");
      return;
    }
    setFetchingMeta(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/site-meta-fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, instanceSlug }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setFetchError(json.error ?? "자동 채우기 실패");
        return;
      }
      const meta = json.meta as {
        name: string | null;
        description: string | null;
        ogImageUrl: string | null;
        resolvedUrl: string;
      };
      setV((p) => ({
        ...p,
        title: meta.name ?? p.title,
        summary: meta.description ? meta.description.slice(0, 200) : p.summary,
        heroImageUrl: meta.ogImageUrl ?? p.heroImageUrl,
        externalUrl: meta.resolvedUrl ?? p.externalUrl,
      }));
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "자동 채우기 실패");
    } finally {
      setFetchingMeta(false);
    }
  }

  const { markSlugDirty } = useAutoSlug({
    source: v.title,
    setSlug: (s) => set("slug", s),
    isNew,
    options: { maxLength: 99, fallbackPrefix: "article" },
  });
  const previewSlug = v.slug.trim() || "article";
  const summaryLength = v.summary.trim().length;
  const summaryLengthMessage =
    summaryLength === 0 ? "80~200자" : summaryLength < 80 ? `${summaryLength}/80자 · 요약을 조금 더 보강해주세요.` : `${summaryLength}/200자`;
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

          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 text-sm font-medium text-slate-900">작성 유형</div>
            <div className="inline-flex rounded-md border border-slate-200 bg-white p-0.5 text-sm">
              <button
                type="button"
                onClick={() => set("contentSource", "internal")}
                className={v.contentSource === "internal" ? "rounded bg-slate-900 px-3 py-1.5 text-white" : "px-3 py-1.5 text-slate-600"}
              >
                직접 작성
              </button>
              <button
                type="button"
                onClick={() => set("contentSource", "external")}
                className={v.contentSource === "external" ? "rounded bg-slate-900 px-3 py-1.5 text-white" : "px-3 py-1.5 text-slate-600"}
              >
                외부 기사 URL 등록
              </button>
            </div>
            <input type="hidden" name="contentSource" value={v.contentSource} />
          </div>

          {v.contentSource === "external" ? (
            <div className="flex flex-col gap-2 rounded-md border border-sky-200 bg-sky-50/60 p-4">
              <div>
                <div className="text-sm font-medium text-sky-900">URL로 자동 채우기</div>
                <div className="mt-0.5 text-xs text-sky-700">외부 기사 URL을 입력하면 제목·요약·이미지를 자동으로 불러옵니다.</div>
              </div>
              <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                <Field name="externalUrl" label="외부 기사 URL" type="url" required value={v.externalUrl} onChange={(x) => set("externalUrl", x)} errors={fieldErrors.externalUrl} maxLength={2048} />
                <button
                  type="button"
                  onClick={handleExternalAutoFill}
                  disabled={fetchingMeta}
                  className="shrink-0 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
                >
                  {fetchingMeta ? "가져오는 중..." : "자동 채우기"}
                </button>
              </div>
              {fetchError ? <div className="text-xs text-rose-700">⚠ {fetchError}</div> : null}
            </div>
          ) : (
            <input type="hidden" name="externalUrl" value="" />
          )}

          <Field name="title" label="제목" required value={v.title} onChange={(x) => set("title", x)} errors={fieldErrors.title} maxLength={200} />
          <Field name="summary" label="요약" required textarea rows={3} value={v.summary} onChange={(x) => set("summary", x)} errors={fieldErrors.summary} minLength={80} maxLength={200} hint={summaryLengthMessage} />
          {v.contentSource === "internal" ? (
            <Field name="bodyMarkdown" label="본문 (Markdown)" required textarea rows={18} value={v.bodyMarkdown} onChange={(x) => set("bodyMarkdown", x)} errors={fieldErrors.bodyMarkdown} maxLength={100000} />
          ) : (
            <input type="hidden" name="bodyMarkdown" value={v.bodyMarkdown} />
          )}
          <ImageSourceField
            label="대표 이미지"
            urlFieldName="heroImageUrl"
            fileFieldName="heroImageFile"
            modeFieldName="heroImageMode"
            url={v.heroImageUrl}
            onUrlChange={(x) => set("heroImageUrl", x)}
            errors={fieldErrors.heroImageUrl ?? fieldErrors.heroImageFile}
            instanceSlug={instanceSlug}
            uploadKind="article-hero"
            recommendedSize="1600×900 (16:9)"
            usageHint="메인 § 기사·칼럼 카드 + insights 상세 페이지 hero"
          />
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

          <Field
            name="slug"
            label="URL 주소 (slug)"
            required
            value={v.slug}
            onChange={(x) => { markSlugDirty(); set("slug", x); }}
            errors={fieldErrors.slug}
            maxLength={100}
            hint="자동 생성됩니다. SEO 위해 영문 키워드로 직접 수정 권장 (예: yoyo-prevention-5-rules · sasang-constitution-101). 한국어 제목 입력 시 임시 ID 가 생성됩니다."
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
                <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase text-slate-400">
                  <span>기사 및 칼럼</span>
                  {v.contentSource === "external" ? (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">외부 기사</span>
                  ) : null}
                </div>
                <h3 className="text-base font-semibold leading-snug text-slate-950">
                  <PreviewText value={v.title} fallback="아티클 제목이 여기에 표시됩니다." />
                </h3>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                  <PreviewText value={v.summary} fallback="요약이 여기에 표시됩니다." />
                </p>
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <div className="mb-2 text-xs font-medium text-slate-500">{v.contentSource === "external" ? "외부 기사" : "본문"}</div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {v.contentSource === "external" ? (
                      <div className="flex flex-col gap-2">
                        <a href={v.externalUrl || "#"} target="_blank" rel="noopener noreferrer" className="break-all font-medium text-blue-700 underline">
                          {v.externalUrl || "원문 URL을 입력하면 여기에 표시됩니다."}
                        </a>
                        <span className="text-xs text-slate-500">공개 카드에서는 외부 기사 배지가 함께 노출됩니다.</span>
                      </div>
                    ) : (
                      <PreviewText value={v.bodyMarkdown} fallback="본문을 입력하면 이 영역에서 길게 확인할 수 있습니다." />
                    )}
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
