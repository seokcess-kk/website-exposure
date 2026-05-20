// @glitzy/web/components/forms/PublicationForm — EAT_CONTENT_PLAN v1.0 § 4.1
// 자동 채우기 (사용자 검수 2026-05-20): DOI/URL 입력 후 한 번 클릭으로 모든 필드 자동 채움
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useFormSuccessToast } from "@/hooks/useFormSuccessToast";
import { Field, SelectField } from "./Field";
import { AdminLivePreview, EmptyPreview, PreviewText, type AppliedLocation } from "./AdminLivePreview";
import { ImageSourceField } from "./ImageSourceField";
import { useAutoSlug } from "@/hooks/useAutoSlug";
import type { SaveResult } from "@/lib/save-result";

// SLUG_AUTOGEN_PLAN v0.3 § 4 — DOI → PubMed → title 우선순위
function getPublicationSlugSource(form: { doi: string; pubmedId: string; title: string }): string {
  if (form.doi.trim() && /^10\.\d{4,9}\//.test(form.doi.trim())) {
    return `doi-${form.doi.trim()}`;
  }
  if (form.pubmedId.trim() && /^\d{1,9}$/.test(form.pubmedId.trim())) {
    return `pubmed-${form.pubmedId.trim()}`;
  }
  return form.title;
}

export type PublicationInitial = {
  slug: string;
  title: string;
  authors: string;
  journal: string;
  publishedDate: string;
  doi: string;
  pubmedId: string;
  url: string;
  thumbnailUrl: string;
  summary: string;
  authorDoctorId: string;
  status: string;
};

const empty: PublicationInitial = {
  slug: "",
  title: "",
  authors: "",
  journal: "",
  publishedDate: "",
  doi: "",
  pubmedId: "",
  url: "",
  thumbnailUrl: "",
  summary: "",
  authorDoctorId: "",
  status: "draft",
};

// EC-FORM-02 — v0.1 단계 status='draft' 만
const STATUS_OPTIONS = [{ value: "draft", label: "초안" }];

export function PublicationForm({
  action,
  initial,
  isNew,
  doctorOptions,
  instanceSlug,
}: {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initial: PublicationInitial | null;
  isNew: boolean;
  doctorOptions: ReadonlyArray<{ value: string; label: string }>;
  instanceSlug: string;
}) {
  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
  useFormSuccessToast(state);
  const [v, setV] = useState<PublicationInitial>(initial ?? empty);
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchSource, setFetchSource] = useState<string | null>(null);
  const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;
  const set = (k: keyof PublicationInitial, val: string) => setV((p) => ({ ...p, [k]: val }));

  // 자동 채우기 — 원문 URL 입력 후 호출. 빈 필드만 채움 (기존 입력 보존).
  async function handleAutoFill() {
    const input = v.url.trim();
    if (!input) {
      setFetchError("원문 URL 을 먼저 입력해주세요.");
      return;
    }
    setFetchingMeta(true);
    setFetchError(null);
    setFetchSource(null);
    try {
      const res = await fetch("/api/admin/fetch-publication-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, instanceSlug }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setFetchError(json.error ?? "자동 채우기 실패");
        return;
      }
      const m = json.meta as {
        title: string | null;
        authors: string[];
        journal: string | null;
        publishedDate: string | null;
        doi: string | null;
        pubmedId: string | null;
        url: string | null;
        thumbnailUrl: string | null;
        summary: string | null;
        source: string;
      };
      setFetchSource(m.source);
      setV((p) => ({
        ...p,
        title: m.title ?? p.title,
        authors: m.authors.length > 0 ? m.authors.join(", ") : p.authors,
        journal: m.journal ?? p.journal,
        publishedDate: m.publishedDate ?? p.publishedDate,
        doi: m.doi ?? p.doi,
        pubmedId: m.pubmedId ?? p.pubmedId,
        url: m.url ?? p.url,
        thumbnailUrl: m.thumbnailUrl ?? p.thumbnailUrl,
        summary: m.summary ?? p.summary,
      }));
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "자동 채우기 실패");
    } finally {
      setFetchingMeta(false);
    }
  }

  const slugSource = getPublicationSlugSource({ doi: v.doi, pubmedId: v.pubmedId, title: v.title });
  const { markSlugDirty } = useAutoSlug({
    source: slugSource,
    setSlug: (s) => set("slug", s),
    isNew,
    options: { maxLength: 99, fallbackPrefix: "publication" },
  });
  const previewSlug = v.slug.trim() || "publication";
  const locations: AppliedLocation[] = [
    { label: "메인 > 논문 섹션", href: `/${instanceSlug}#trust-papers`, note: "공개 상태가 되면 메인 신뢰 자료 영역에 노출됩니다." },
    { label: "논문 목록 페이지", href: `/${instanceSlug}/publications` },
    { label: "논문 상세 페이지", href: `/${instanceSlug}/publications/${previewSlug}` },
    { label: "의료진 상세 페이지", href: `/${instanceSlug}/doctors`, note: "대표 의료진을 선택하면 해당 의료진 페이지에도 연결됩니다." },
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

          {/* === 자동 채우기 (URL 만 입력하면 나머지 자동) === */}
          <div className="flex flex-col gap-2 rounded-md border border-sky-200 bg-sky-50/60 p-4">
            <div>
              <div className="text-sm font-medium text-sky-900">URL로 자동 채우기</div>
              <div className="mt-0.5 text-xs text-sky-700">원문 URL을 입력하면 논문 정보를 자동으로 불러와 제목·저자·학술지·게재일·초록을 채웁니다.</div>
            </div>
            <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <Field name="url" label="원문 URL" type="url" required value={v.url} onChange={(x) => set("url", x)} errors={fieldErrors.url} maxLength={2048} />
              <button
                type="button"
                onClick={handleAutoFill}
                disabled={fetchingMeta}
                className="shrink-0 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
              >
                {fetchingMeta ? "가져오는 중…" : "자동 채우기"}
              </button>
            </div>
            {fetchSource ? (
              <div className="text-xs text-emerald-700">
                자동 채우기가 완료되었습니다. 빈 필드만 채워졌고 기존 입력은 유지했습니다.
              </div>
            ) : null}
            {fetchError ? (
              <div className="text-xs text-rose-700">⚠ {fetchError}</div>
            ) : null}
          </div>

          <Field name="title" label="제목" required value={v.title} onChange={(x) => set("title", x)} errors={fieldErrors.title} maxLength={300} />
          <Field name="authors" label="저자 (콤마 또는 줄바꿈 구분)" required textarea rows={2} value={v.authors} onChange={(x) => set("authors", x)} errors={fieldErrors.authors} hint="1명 이상 필수 · 각 100자 이내" />
          <Field name="journal" label="학술지" value={v.journal} onChange={(x) => set("journal", x)} errors={fieldErrors.journal} maxLength={200} />
          <Field name="publishedDate" label="게재일" type="date" required value={v.publishedDate} onChange={(x) => set("publishedDate", x)} errors={fieldErrors.publishedDate} />
          <Field name="doi" label="DOI" value={v.doi} onChange={(x) => set("doi", x)} errors={fieldErrors.doi} hint="예: 10.1000/xyz123" />
          <Field name="pubmedId" label="PubMed ID" value={v.pubmedId} onChange={(x) => set("pubmedId", x)} errors={fieldErrors.pubmedId} maxLength={9} hint="1~9자리 숫자" />
          <ImageSourceField
            label="썸네일 이미지"
            urlFieldName="thumbnailUrl"
            fileFieldName="thumbnailFile"
            modeFieldName="thumbnailMode"
            url={v.thumbnailUrl}
            onUrlChange={(x) => set("thumbnailUrl", x)}
            errors={fieldErrors.thumbnailUrl ?? fieldErrors.thumbnailFile}
            instanceSlug={instanceSlug}
            uploadKind="publication-thumbnail"
            recommendedSize="600×800 (3:4 · 학술 논문 표지)"
            usageHint="논문 카드 썸네일 + 상세 페이지 표지"
          />
          <Field name="summary" label="요약" required textarea rows={4} value={v.summary} onChange={(x) => set("summary", x)} errors={fieldErrors.summary} minLength={50} maxLength={300} hint="50~300자" />
          <SelectField
            name="authorDoctorId"
            label="대표 의료진 (선택)"
            value={v.authorDoctorId}
            onChange={(x) => set("authorDoctorId", x)}
            options={doctorOptions}
            errors={fieldErrors.authorDoctorId}
            hint="저자 의료진을 선택하면 해당 의료진 페이지에도 논문이 함께 표시됩니다."
          />
          <Field
            name="slug"
            label="URL 주소 (slug)"
            required
            value={v.slug}
            onChange={(x) => { markSlugDirty(); set("slug", x); }}
            errors={fieldErrors.slug}
            maxLength={100}
            hint="자동 생성됩니다 (DOI → PubMed → 제목 우선순위). SEO 위해 영문 키워드로 직접 수정 권장 (예: herbal-diet-clinical-2024 · sasang-bmi-correlation)."
          />
          <div className="sticky bottom-0 z-10 -mx-4 mt-6 flex items-center justify-end gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
            <SubmitButton isNew={isNew} />
          </div>
        </div>

        <AdminLivePreview locations={locations}>
          {v.title.trim() || v.summary.trim() ? (
            <article className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-2 text-[11px] font-semibold uppercase text-slate-400">논문</div>
              <h3 className="text-base font-semibold leading-snug text-slate-950">
                <PreviewText value={v.title} fallback="논문 제목이 여기에 표시됩니다." />
              </h3>
              <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500">
                <span><PreviewText value={v.authors} fallback="저자" /></span>
                <span>·</span>
                <span><PreviewText value={v.journal} fallback="학술지" /></span>
                <span>·</span>
                <span><PreviewText value={v.publishedDate} fallback="게재일" /></span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                <PreviewText value={v.summary} fallback="요약이 여기에 표시됩니다." />
              </p>
              {v.doi.trim() ? (
                <div className="mt-3 inline-flex rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-600">
                  DOI {v.doi}
                </div>
              ) : null}
            </article>
          ) : (
            <EmptyPreview label="논문 정보를 입력하면 카드 미리보기가 표시됩니다." />
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
