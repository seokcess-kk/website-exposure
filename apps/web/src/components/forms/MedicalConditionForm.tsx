// @glitzy/web/components/forms/MedicalConditionForm
// EXPOSURE_READINESS Phase B — Conditions 격상.
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useFormSuccessToast } from "@/hooks/useFormSuccessToast";
import { Field, SelectField } from "./Field";
import { AdminLivePreview, EmptyPreview, PreviewText, type AppliedLocation } from "./AdminLivePreview";
import { ImageSourceField } from "./ImageSourceField";
import { useAutoSlug } from "@/hooks/useAutoSlug";
import type { SaveResult } from "@/lib/save-result";
import { EvidenceLinkPanel } from "@/components/admin/EvidenceLinkPanel";
import type { EvidenceLink } from "@/lib/admin/content-entity-link";
import type { EvidenceLinkOptions } from "@/lib/admin/evidence-link-options";

export type MedicalConditionInitial = {
  slug: string;
  title: string;
  summary: string;
  bodyMarkdown: string;
  riskLevel: string;
  heroImageUrl: string;
  primaryTreatmentId: string;
};

const empty: MedicalConditionInitial = {
  slug: "",
  title: "",
  summary: "",
  bodyMarkdown: "",
  riskLevel: "",
  heroImageUrl: "",
  primaryTreatmentId: "",
};

const RISK_OPTIONS = [
  { value: "", label: "(미지정)" },
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

export type TreatmentOption = { value: string; label: string };

export function MedicalConditionForm({
  action,
  initial,
  isNew,
  instanceSlug,
  treatmentOptions,
  evidenceOptions,
  existingEvidenceLinks,
}: {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initial: MedicalConditionInitial | null;
  isNew: boolean;
  instanceSlug: string;
  treatmentOptions: ReadonlyArray<TreatmentOption>;
  evidenceOptions: EvidenceLinkOptions;
  existingEvidenceLinks: ReadonlyArray<EvidenceLink>;
}) {
  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
  useFormSuccessToast(state);
  const [values, setValues] = useState<MedicalConditionInitial>(initial ?? empty);
  const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;
  const set = (k: keyof MedicalConditionInitial, v: string) => setValues((p) => ({ ...p, [k]: v }));

  const { markSlugDirty } = useAutoSlug({
    source: values.title,
    setSlug: (s) => set("slug", s),
    isNew,
    options: { maxLength: 99, fallbackPrefix: "condition" },
  });

  const previewSlug = values.slug.trim() || "condition";
  const locations: AppliedLocation[] = [
    { label: "증상 안내 목록 (/conditions)", href: `/${instanceSlug}/conditions` },
    { label: "증상 상세 페이지", href: `/${instanceSlug}/conditions/${previewSlug}` },
    {
      label: "관련 진료 페이지 → 이 증상 inverse 노출",
      href: values.primaryTreatmentId ? `/${instanceSlug}/treatments` : `/${instanceSlug}/treatments`,
      note: "primary_treatment 선택 시 해당 진료 상세 페이지 안 inverse 합류 (다음 cycle).",
    },
  ];

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex flex-col gap-5">
          {state?.ok === true && (
            <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
              저장되었습니다.
            </div>
          )}
          {formError && (
            <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">{formError}</div>
          )}

          <Field name="slug" label="slug" required value={values.slug} onChange={(v) => { markSlugDirty(); set("slug", v); }} errors={fieldErrors.slug} maxLength={99} hint="3~99자 · 소문자/숫자/하이픈 · 제목 입력 시 자동 생성" />
          <Field name="title" label="증상명 (제목)" required value={values.title} onChange={(v) => set("title", v)} errors={fieldErrors.title} maxLength={200} placeholder="예: 산후 비만 · 갱년기 체중 증가" />
          <Field name="summary" label="요약 (50~160자)" textarea rows={3} required value={values.summary} onChange={(v) => set("summary", v)} errors={fieldErrors.summary} maxLength={160} hint="검색 결과 안 노출되는 짧은 요약" />
          <Field name="bodyMarkdown" label="본문 (Markdown)" textarea rows={18} required value={values.bodyMarkdown} onChange={(v) => set("bodyMarkdown", v)} errors={fieldErrors.bodyMarkdown} hint="h2/h3 anchor 자동 부착 + 좌측 TOC 자동 생성" />

          <SelectField name="primaryTreatmentId" label="관련 진료 (Primary Treatment)" value={values.primaryTreatmentId} onChange={(v) => set("primaryTreatmentId", v)} errors={fieldErrors.primaryTreatmentId} options={[{ value: "", label: "(없음)" }, ...treatmentOptions]} hint="이 증상의 1차 진료/시술. 상세 페이지 안 CTA + 진료 페이지 inverse 합류" />

          <SelectField name="riskLevel" label="위험도" value={values.riskLevel} onChange={(v) => set("riskLevel", v)} errors={fieldErrors.riskLevel} options={RISK_OPTIONS} />

          <ImageSourceField
            label="히어로 이미지"
            urlFieldName="heroImageUrl"
            fileFieldName="heroImageFile"
            modeFieldName="heroImageMode"
            url={values.heroImageUrl}
            onUrlChange={(v) => set("heroImageUrl", v)}
            errors={fieldErrors.heroImageUrl}
            instanceSlug={instanceSlug}
            uploadKind="condition-hero"
            recommendedSize="1600×1200 (4:3 · 증상 비유 이미지)"
            usageHint="증상 상세 hero 우측 + 증상 카드 thumbnail"
          />

          <EvidenceLinkPanel
            sourceType="MedicalConditionPage"
            options={evidenceOptions}
            existingLinks={existingEvidenceLinks}
          />

          <div className="sticky bottom-0 z-10 -mx-4 mt-6 flex items-center justify-end gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
            <SubmitButton isNew={isNew} />
          </div>
        </div>

        <AdminLivePreview locations={locations}>
          {values.title.trim() || values.summary.trim() ? (
            <article className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-[11px] font-semibold uppercase text-slate-400">증상</div>
              <h3 className="mt-1 text-lg font-semibold leading-snug text-slate-950">
                <PreviewText value={values.title} fallback="증상명" />
              </h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">
                <PreviewText value={values.summary} fallback="요약" />
              </p>
            </article>
          ) : (
            <EmptyPreview label="증상명과 요약을 입력하면 미리보기가 표시됩니다." />
          )}
        </AdminLivePreview>
      </div>
    </form>
  );
}

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60">
      {pending ? "저장 중…" : isNew ? "추가" : "저장"}
    </button>
  );
}
