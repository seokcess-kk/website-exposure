// @glitzy/web/components/forms/InstanceContractForm — ADMIN_BUSINESS_ENTITIES_PLAN v1.0 § 2
// super-admin 의 instance_contract 편집 form. 8 필드.

"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useFormSuccessToast } from "@/hooks/useFormSuccessToast";
import { Field, SelectField } from "./Field";
import type { SaveResult } from "@/lib/save-result";

export type InstanceContractInitial = {
  status: string;
  planTier: string;
  billingCycle: string;
  amountKrw: string;
  startDate: string;
  endDate: string;
  contractHolderName: string;
  contractHolderEmail: string;
  notes: string;
};

const STATUS_OPTIONS = [
  { value: "trial", label: "체험 (trial)" },
  { value: "active", label: "정상 (active)" },
  { value: "suspended", label: "일시 정지 (suspended)" },
  { value: "terminated", label: "종료 (terminated)" },
];

const PLAN_TIER_OPTIONS = [
  { value: "starter", label: "starter" },
  { value: "standard", label: "standard" },
  { value: "pro", label: "pro" },
  { value: "custom", label: "custom (별 협의)" },
];

const BILLING_CYCLE_OPTIONS = [
  { value: "monthly", label: "월 결제" },
  { value: "yearly", label: "연 결제" },
  { value: "custom", label: "별 협의" },
];

export function InstanceContractForm({
  action,
  initial,
}: {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initial: InstanceContractInitial;
}) {
  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
  useFormSuccessToast(state);
  const [v, setV] = useState<InstanceContractInitial>(initial);
  const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;
  const set = (k: keyof InstanceContractInitial, val: string) =>
    setV((p) => ({ ...p, [k]: val }));

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

      <div className="grid gap-4 md:grid-cols-3">
        <SelectField
          name="status"
          label="상태"
          value={v.status}
          onChange={(x) => set("status", x)}
          options={STATUS_OPTIONS}
          errors={fieldErrors.status}
        />
        <SelectField
          name="planTier"
          label="플랜"
          value={v.planTier}
          onChange={(x) => set("planTier", x)}
          options={PLAN_TIER_OPTIONS}
          errors={fieldErrors.planTier}
        />
        <SelectField
          name="billingCycle"
          label="결제 주기"
          value={v.billingCycle}
          onChange={(x) => set("billingCycle", x)}
          options={BILLING_CYCLE_OPTIONS}
          errors={fieldErrors.billingCycle}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field
          name="amountKrw"
          label="금액 (KRW)"
          value={v.amountKrw}
          onChange={(x) => set("amountKrw", x)}
          errors={fieldErrors.amountKrw}
          hint="정수 · 결제 주기 단위 금액"
        />
        <Field
          name="startDate"
          label="시작일"
          type="date"
          required
          value={v.startDate}
          onChange={(x) => set("startDate", x)}
          errors={fieldErrors.startDate}
        />
        <Field
          name="endDate"
          label="종료일"
          type="date"
          value={v.endDate}
          onChange={(x) => set("endDate", x)}
          errors={fieldErrors.endDate}
          hint="비워두면 무기한 · 입력 시 시작일 이후"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          name="contractHolderName"
          label="계약자 이름"
          value={v.contractHolderName}
          onChange={(x) => set("contractHolderName", x)}
          errors={fieldErrors.contractHolderName}
          maxLength={100}
          placeholder="예: 홍길동 (대표)"
        />
        <Field
          name="contractHolderEmail"
          label="계약자 이메일"
          type="email"
          value={v.contractHolderEmail}
          onChange={(x) => set("contractHolderEmail", x)}
          errors={fieldErrors.contractHolderEmail}
          maxLength={200}
        />
      </div>

      <Field
        name="notes"
        label="운영자 메모"
        textarea
        rows={4}
        value={v.notes}
        onChange={(x) => set("notes", x)}
        errors={fieldErrors.notes}
        maxLength={2000}
        hint="계약 안 특이사항 · 협의 내용 등. 클라이언트에게 노출 X."
      />

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-3">
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
    >
      {pending ? "저장 중…" : "저장"}
    </button>
  );
}
