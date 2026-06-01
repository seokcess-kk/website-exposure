// @glitzy/web/components/forms/FaqForm — EAT_CONTENT_PLAN v1.0 § 4.1
//   v0.1 단계 status='draft' DB CHECK 강제. 발행 자체 차단 (EC-DEFER-12).
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Field, SelectField } from "./Field";
import { AdminLivePreview, EmptyPreview, PreviewText, type AppliedLocation } from "./AdminLivePreview";
import { useAutoSlug } from "@/hooks/useAutoSlug";
import type { SaveResult } from "@/lib/save-result";
import { EvidenceLinkPanel } from "@/components/admin/EvidenceLinkPanel";
import type { EvidenceLink } from "@/lib/admin/content-entity-link";
import type { EvidenceLinkOptions } from "@/lib/admin/evidence-link-options";
import { SeoMetaSuggestionPanel } from "@/components/ai/SeoMetaSuggestionPanel";
import { FaqFullDraftPanel } from "@/components/ai/EntityFullDraftPanel";

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
  instanceSlug,
  evidenceOptions,
  existingEvidenceLinks,
}: {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initial: FaqInitial | null;
  isNew: boolean;
  categoryOptions: ReadonlyArray<{ value: string; label: string }>;
  doctorOptions: ReadonlyArray<{ value: string; label: string }>;
  treatmentOptions: ReadonlyArray<{ value: string; label: string }>;
  instanceSlug: string;
  evidenceOptions: EvidenceLinkOptions;
  existingEvidenceLinks: ReadonlyArray<EvidenceLink>;
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
  const previewSlug = v.slug.trim() || "faq";
  const locations: AppliedLocation[] = [
    { label: "메인 > 소통 공간 > 자주 묻는 질문", href: `/${instanceSlug}#community-faq`, note: "공개 상태가 되면 메인 FAQ 영역에 노출됩니다." },
    { label: "FAQ 목록 페이지", href: `/${instanceSlug}/faq#faq-${previewSlug}` },
    { label: "1:1 비밀 상담소 상단 안내", href: `/${instanceSlug}#community-1on1`, note: "상담 전 참고 FAQ로 연결됩니다." },
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

          <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
            현재는 초안 저장만 가능합니다. 공개 전 검수 기능이 준비되면 발행할 수 있습니다.
          </div>

          {isNew && (
            <div className="flex items-center justify-between gap-2 rounded-md border border-brand-primary/20 bg-brand-primary/5 px-3 py-2">
              <div className="text-sm font-medium text-slate-900">
                AI Draft 생성
                <span className="ml-1 text-xs font-normal text-slate-500">키워드 + 질문 의도 한 줄 → 질문·답변 자동 초안</span>
              </div>
              <FaqFullDraftPanel
                instanceSlug={instanceSlug}
                hasFormContent={() => v.question.trim().length > 0 || v.answer.trim().length > 0}
                onApply={(d) => {
                  setV((p) => ({ ...p, question: d.question, answer: d.answer, slug: d.slug }));
                  markSlugDirty();
                }}
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-medium text-slate-900">SEO 메타 (질문 · 답변 요약 · slug)</div>
            <SeoMetaSuggestionPanel
              instanceSlug={instanceSlug}
              entityType="FAQ"
              disabled={v.question.trim().length < 5 && v.answer.trim().length < 10}
              getInput={() => ({
                currentTitle: v.question.trim() || undefined,
                currentDescription: v.answer.trim().slice(0, 400) || undefined,
                category: categoryOptions.find((c) => c.value === v.categoryId)?.label,
              })}
              onApply={(data) => {
                setV((p) => ({
                  ...p,
                  question: data.title,
                  slug: data.slug,
                  // answer 은 markdown 본문이라 SEO description 으로 덮어쓰지 않음 (v1: 운영자 직접 작성).
                }));
                markSlugDirty();
              }}
            />
          </div>
          <Field name="question" label="질문" required value={v.question} onChange={(x) => set("question", x)} errors={fieldErrors.question} minLength={10} maxLength={200} hint="10~200자" />
          <Field name="answer" label="답변 (Markdown)" required textarea rows={10} value={v.answer} onChange={(x) => set("answer", x)} errors={fieldErrors.answer} minLength={50} maxLength={2000} hint="50~2000자" />
          <Field name="displayOrder" label="표시 순서" required value={v.displayOrder} onChange={(x) => set("displayOrder", x)} errors={fieldErrors.displayOrder} />
          <SelectField name="categoryId" label="카테고리 (선택)" value={v.categoryId} onChange={(x) => set("categoryId", x)} options={categoryOptions} errors={fieldErrors.categoryId} />
          <SelectField name="authorDoctorId" label="작성자 (의료진 · 선택)" value={v.authorDoctorId} onChange={(x) => set("authorDoctorId", x)} options={doctorOptions} errors={fieldErrors.authorDoctorId} />
          <SelectField name="relatedTreatmentId" label="관련 진료 페이지 (선택)" value={v.relatedTreatmentId} onChange={(x) => set("relatedTreatmentId", x)} options={treatmentOptions} errors={fieldErrors.relatedTreatmentId} />
          <Field
            name="slug"
            label="URL 주소 (slug)"
            required
            value={v.slug}
            onChange={(x) => { markSlugDirty(); set("slug", x); }}
            errors={fieldErrors.slug}
            maxLength={100}
            hint="자동 생성됩니다. SEO 위해 영문 키워드로 직접 수정 권장 (예: how-long-program · safe-for-pregnancy · side-effects). 한국어 질문 입력 시 임시 ID 가 생성됩니다."
          />

          <EvidenceLinkPanel
            sourceType="FAQ"
            options={evidenceOptions}
            existingLinks={existingEvidenceLinks}
          />

          <SubmitButton isNew={isNew} />
        </div>

        <AdminLivePreview locations={locations}>
          {v.question.trim() || v.answer.trim() ? (
            <article className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-2 text-[11px] font-semibold uppercase text-slate-400">FAQ</div>
              <h3 className="text-base font-semibold leading-snug text-slate-950">
                <PreviewText value={v.question} fallback="질문이 여기에 표시됩니다." />
              </h3>
              <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                <PreviewText value={v.answer} fallback="답변 내용이 여기에 표시됩니다." />
              </div>
            </article>
          ) : (
            <EmptyPreview label="질문과 답변을 입력하면 FAQ 미리보기가 표시됩니다." />
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
