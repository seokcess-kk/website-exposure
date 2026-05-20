// @glitzy/web/components/forms/MediaAppearanceForm — EAT_CONTENT_PLAN v1.0 § 4.1
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Field, SelectField } from "./Field";
import { AdminLivePreview, EmptyPreview, PreviewText, type AppliedLocation } from "./AdminLivePreview";
import { ImageSourceField } from "./ImageSourceField";
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
  { value: "broadcast", label: "방송" },
  { value: "youtube", label: "유튜브" },
  { value: "podcast", label: "팟캐스트" },
  { value: "press", label: "기사" },
];

const STATUS_OPTIONS = [{ value: "draft", label: "초안" }];

export function MediaAppearanceForm({
  action,
  initial,
  isNew,
  doctorOptions,
  instanceSlug,
}: {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initial: MediaAppearanceInitial | null;
  isNew: boolean;
  doctorOptions: ReadonlyArray<{ value: string; label: string }>;
  instanceSlug: string;
}) {
  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
  const [v, setV] = useState<MediaAppearanceInitial>(initial ?? empty);
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchSource, setFetchSource] = useState<string | null>(null);
  const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;
  const set = (k: keyof MediaAppearanceInitial, val: string) => setV((p) => ({ ...p, [k]: val }));

  // 자동 채우기 — URL 입력 후 호출. YouTube oEmbed 또는 og:* meta scrape.
  async function handleAutoFill() {
    const url = v.url.trim();
    if (!url) {
      setFetchError("원문 URL 을 먼저 입력해주세요.");
      return;
    }
    setFetchingMeta(true);
    setFetchError(null);
    setFetchSource(null);
    try {
      const res = await fetch("/api/admin/fetch-media-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, instanceSlug }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setFetchError(json.error ?? "자동 채우기 실패");
        return;
      }
      const m = json.meta as {
        title: string | null;
        channelName: string | null;
        channelType: "broadcast" | "youtube" | "podcast" | "press" | null;
        publishedDate: string | null;
        durationSeconds: number | null;
        url: string | null;
        thumbnailUrl: string | null;
        summary: string | null;
        source: string;
      };
      setFetchSource(m.source);
      setV((p) => ({
        ...p,
        title: m.title ?? p.title,
        channelName: m.channelName ?? p.channelName,
        channelType: m.channelType ?? p.channelType,
        publishedDate: m.publishedDate ?? p.publishedDate,
        durationSeconds: m.durationSeconds !== null ? String(m.durationSeconds) : p.durationSeconds,
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

  const { markSlugDirty } = useAutoSlug({
    source: v.title,
    setSlug: (s) => set("slug", s),
    isNew,
    options: { maxLength: 99, fallbackPrefix: "media" },
  });
  const previewSlug = v.slug.trim() || "media";
  const locations: AppliedLocation[] = [
    { label: "메인 > 미디어 섹션", href: `/${instanceSlug}#trust-media`, note: "공개 상태가 되면 메인 미디어 영역에 노출됩니다." },
    { label: "미디어 목록 페이지", href: `/${instanceSlug}/media-appearances` },
    { label: "미디어 상세 페이지", href: `/${instanceSlug}/media-appearances/${previewSlug}` },
    { label: "의료진 상세 페이지", href: `/${instanceSlug}/doctors`, note: "출연 의료진을 선택하면 해당 의료진 페이지에도 연결됩니다." },
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
              <div className="mt-0.5 text-xs text-sky-700">원문 URL을 입력하면 제목·채널·썸네일·요약을 자동으로 불러옵니다.</div>
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
                자동 채우기가 완료되었습니다. 빈 필드만 채워졌고 기존 입력은 유지했습니다. 게재일·재생시간 같은 일부 필드는 직접 입력이 필요할 수 있습니다.
              </div>
            ) : null}
            {fetchError ? (
              <div className="text-xs text-rose-700">⚠ {fetchError}</div>
            ) : null}
          </div>

          <Field name="title" label="제목" required value={v.title} onChange={(x) => set("title", x)} errors={fieldErrors.title} maxLength={300} />
          <Field name="channelName" label="채널명" required value={v.channelName} onChange={(x) => set("channelName", x)} errors={fieldErrors.channelName} maxLength={100} />
          <SelectField name="channelType" label="채널 종류" required value={v.channelType} onChange={(x) => set("channelType", x)} options={CHANNEL_OPTIONS} errors={fieldErrors.channelType} />
          <Field name="publishedDate" label="게재일" type="date" required value={v.publishedDate} onChange={(x) => set("publishedDate", x)} errors={fieldErrors.publishedDate} />
          <Field name="durationSeconds" label="길이 (초)" value={v.durationSeconds} onChange={(x) => set("durationSeconds", x)} errors={fieldErrors.durationSeconds} hint="양의 정수 · 선택" />
          <ImageSourceField
            label="썸네일 이미지"
            urlFieldName="thumbnailUrl"
            fileFieldName="thumbnailFile"
            modeFieldName="thumbnailMode"
            url={v.thumbnailUrl}
            onUrlChange={(x) => set("thumbnailUrl", x)}
            errors={fieldErrors.thumbnailUrl ?? fieldErrors.thumbnailFile}
            instanceSlug={instanceSlug}
            uploadKind="media-thumbnail"
            recommendedSize="1280×720 (16:9 · YouTube 표준)"
            usageHint="미디어 출연 카드 + 상세 페이지 썸네일"
          />
          <Field name="summary" label="요약" required textarea rows={4} value={v.summary} onChange={(x) => set("summary", x)} errors={fieldErrors.summary} minLength={50} maxLength={300} hint="50~300자" />
          <SelectField
            name="authorDoctorId"
            label="출연 의료진 (선택)"
            value={v.authorDoctorId}
            onChange={(x) => set("authorDoctorId", x)}
            options={doctorOptions}
            errors={fieldErrors.authorDoctorId}
          />
          <Field
            name="slug"
            label="URL 주소 (slug)"
            required
            value={v.slug}
            onChange={(x) => { markSlugDirty(); set("slug", x); }}
            errors={fieldErrors.slug}
            maxLength={100}
            hint="자동 생성됩니다. SEO 위해 영문 키워드로 직접 수정 권장 (예: mbc-health-diet-2024 · youtube-shorts-detox). 한국어 제목 입력 시 임시 ID 가 생성됩니다."
          />
          <SubmitButton isNew={isNew} />
        </div>

        <AdminLivePreview locations={locations}>
          {v.title.trim() || v.thumbnailUrl.trim() || v.summary.trim() ? (
            <article className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="aspect-video bg-slate-200">
                {v.thumbnailUrl.trim() ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={v.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">썸네일</div>
                )}
              </div>
              <div className="p-4">
                <div className="mb-2 text-[11px] font-semibold uppercase text-slate-400">미디어</div>
                <h3 className="text-base font-semibold leading-snug text-slate-950">
                  <PreviewText value={v.title} fallback="미디어 제목이 여기에 표시됩니다." />
                </h3>
                <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500">
                  <span><PreviewText value={v.channelName} fallback="채널명" /></span>
                  <span>·</span>
                  <span><PreviewText value={v.publishedDate} fallback="게재일" /></span>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                  <PreviewText value={v.summary} fallback="요약이 여기에 표시됩니다." />
                </p>
              </div>
            </article>
          ) : (
            <EmptyPreview label="미디어 정보를 입력하면 카드 미리보기가 표시됩니다." />
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
