// @glitzy/web/components/forms/TreatmentPageForm
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Field, SelectField } from "./Field";
import { TreatmentPrinciplesEditor } from "./TreatmentPrinciplesEditor";
import { useAutoSlug } from "@/hooks/useAutoSlug";
import type { SaveResult } from "@/lib/save-result";

export type TreatmentPageInitial = {
  slug: string;
  title: string;
  summary: string;
  bodyMarkdown: string;
  status: string;
  riskLevel: string;
  heroImageUrl: string;
  /** C 하이브리드: clinic.metadata.treatmentPillars[].slug 매칭. 빈 문자열 = null */
  pillarSlug: string;
  /** treatment 별 principles override (JSON 배열 문자열). 빈 문자열 = clinic.metadata.standardPrinciples 사용 */
  principlesJson: string;
};

const empty: TreatmentPageInitial = {
  slug: "",
  title: "",
  summary: "",
  bodyMarkdown: "",
  status: "draft",
  riskLevel: "",
  heroImageUrl: "",
  pillarSlug: "",
  principlesJson: "",
};

export type PillarOption = { value: string; label: string };

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

export function TreatmentPageForm({
  action,
  initial,
  isNew,
  pillarOptions = [],
}: {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initial: TreatmentPageInitial | null;
  isNew: boolean;
  /** clinic.metadata.treatmentPillars 기반 옵션. 비어 있으면 select 비활성 */
  pillarOptions?: ReadonlyArray<PillarOption>;
}) {
  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
  const [v, setV] = useState<TreatmentPageInitial>(initial ?? empty);
  const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;
  const set = (k: keyof TreatmentPageInitial, val: string) => setV((p) => ({ ...p, [k]: val }));

  const { markSlugDirty } = useAutoSlug({
    source: v.title,
    setSlug: (s) => set("slug", s),
    isNew,
    options: { maxLength: 99, fallbackPrefix: "treatment" },
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

      <Field name="slug" label="slug" required value={v.slug} onChange={(x) => { markSlugDirty(); set("slug", x); }} errors={fieldErrors.slug} maxLength={100} hint="3~100자 · 제목 입력 시 자동 생성" />
      <Field name="title" label="제목" required value={v.title} onChange={(x) => set("title", x)} errors={fieldErrors.title} maxLength={200} />
      <Field name="summary" label="요약" required textarea rows={3} value={v.summary} onChange={(x) => set("summary", x)} errors={fieldErrors.summary} minLength={50} maxLength={160} hint="50~160자 (검색 결과 노출용)" />
      <Field name="bodyMarkdown" label="본문 (Markdown)" required textarea rows={14} value={v.bodyMarkdown} onChange={(x) => set("bodyMarkdown", x)} errors={fieldErrors.bodyMarkdown} maxLength={50000} hint="Markdown 형식" />
      <Field name="heroImageUrl" label="hero 이미지 URL" type="url" value={v.heroImageUrl} onChange={(x) => set("heroImageUrl", x)} errors={fieldErrors.heroImageUrl} maxLength={2048} />

      {/* Phase 3: pillar select + treatment 별 principles override (C 하이브리드) */}
      <SelectField
        name="pillarSlug"
        label="진료 영역 (Pillar)"
        value={v.pillarSlug}
        onChange={(x) => set("pillarSlug", x)}
        options={[{ value: "", label: pillarOptions.length === 0 ? "(설정된 진료 영역 없음)" : "(미분류)" }, ...pillarOptions]}
        errors={fieldErrors.pillarSlug}
        hint="시술/진료가 속한 진료 영역입니다. 선택하면 공개 사이트에서 관련 진료와 함께 정리됩니다."
      />
      <TreatmentPrinciplesEditor
        value={v.principlesJson}
        onChange={(x) => set("principlesJson", x)}
        errors={fieldErrors.principlesJson}
      />

      {/* CAM-18 정정: status workflow action 버튼 전이만 — read-only display. */}
      <label className="flex flex-col gap-1 text-sm">
        <span>발행 상태</span>
        {/* CWI-01 정정: name 제거 — FormData 안 status 미포함 → schema/server 양쪽 안전 */}
        <input type="text" value={v.status} readOnly className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" />
      </label>
      <SelectField name="riskLevel" label="위험도 (의료광고법)" value={v.riskLevel} onChange={(x) => set("riskLevel", x)} options={RISK_OPTIONS} errors={fieldErrors.riskLevel} />

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
