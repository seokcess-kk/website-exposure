// @glitzy/web/components/site/ConsultationForm — 1:1 비밀 상담 form (단아 v1.0)

"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitConsultation, type SubmitResult } from "@/lib/site-actions/consultation-actions";

export function ConsultationForm({ instanceSlug }: { instanceSlug: string }) {
  const [state, formAction] = useFormState<SubmitResult | null, FormData>(
    submitConsultation.bind(null, instanceSlug),
    null,
  );
  const fieldErrors = state && state.ok === false ? state.fieldErrors ?? {} : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {formError && (
        <div className="rounded-xl border border-error bg-error-subtle px-4 py-3 text-sm text-fg-default">
          ❌ {formError}
        </div>
      )}

      <Field name="title" label="제목" required errors={fieldErrors.title} placeholder="예: 1개월에 5kg 감량 가능한가요?" maxLength={100} />

      <Field name="displayName" label="이름 또는 닉네임" required errors={fieldErrors.displayName} placeholder="예: 김OO" maxLength={50} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field name="contactPhone" label="전화 (선택)" errors={fieldErrors.contactPhone} placeholder="010-1234-5678" type="tel" />
        <Field name="contactEmail" label="이메일 (선택)" errors={fieldErrors.contactEmail} placeholder="you@example.com" type="email" />
      </div>
      <p className="-mt-3 text-xs text-fg-muted">전화 또는 이메일 중 하나는 필수입니다.</p>

      <FieldTextarea name="message" label="상담 내용" required errors={fieldErrors.message} placeholder="증상, 진료 가능 여부, 비용 문의 등 자유롭게 적어주세요 (10자 이상)" rows={6} maxLength={5000} />

      <div className="rounded-xl border border-border bg-subtle/60 p-3 text-xs text-fg-muted">
        제출 시 개인정보처리방침에 동의하신 것으로 간주됩니다. 본 상담 내용은 진료 외 목적으로 사용되지 않으며, 해결 후 일정 기간 안 안전하게 폐기됩니다.
      </div>

      <SubmitButton />
    </form>
  );
}

function Field({ name, label, required, errors, ...rest }: {
  name: string; label: string; required?: boolean; errors?: string[];
  type?: string; placeholder?: string; maxLength?: number;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink-strong">
        {label}{required && <span className="ml-1 text-error">*</span>}
      </span>
      <input
        name={name}
        required={required}
        className="rounded-xl border border-border bg-elevated px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        {...rest}
      />
      {errors && errors.length > 0 && <span className="text-xs text-error">{errors.join(", ")}</span>}
    </label>
  );
}

function FieldTextarea({ name, label, required, errors, rows, ...rest }: {
  name: string; label: string; required?: boolean; errors?: string[];
  rows?: number; placeholder?: string; maxLength?: number;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink-strong">
        {label}{required && <span className="ml-1 text-error">*</span>}
      </span>
      <textarea
        name={name}
        rows={rows ?? 4}
        required={required}
        className="rounded-xl border border-border bg-elevated px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        {...rest}
      />
      {errors && errors.length > 0 && <span className="text-xs text-error">{errors.join(", ")}</span>}
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start rounded-full bg-brand-primary px-8 py-3 text-sm font-semibold text-fg-inverse shadow-md transition hover:bg-brand-primary-hover hover:shadow-lg disabled:opacity-60"
    >
      {pending ? "접수 중…" : "🔒 비공개 상담 접수"}
    </button>
  );
}
