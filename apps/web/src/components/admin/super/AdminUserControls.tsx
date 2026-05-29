// @glitzy/web/components/admin/super/AdminUserControls — admin_user 상세 toggle 묶음
// ADMIN_PERMISSION_SEPARATION v1.2 § 9.4 — active · super-admin · eligibility 3종.
// self-lockout: 본인(isSelf) 의 super-admin/active 끄기는 UI disabled + server 가드 이중.

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  setAdminUserActiveAction,
  setEligibilityAction,
  setSuperAdminFlagAction,
  type ActionResult,
} from "@/app/(admin)/admin/super/users/actions";

type Props = {
  userId: string;
  isSelf: boolean;
  active: boolean;
  isSuperAdmin: boolean;
  legalReviewerEligible: boolean;
  physicianReviewerEligible: boolean;
  clientApproverEligible: boolean;
};

export function AdminUserControls(props: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const run = (fn: () => Promise<ActionResult>) => {
    setError(null);
    startTransition(async () => {
      const result = await fn();
      if (result.ok) router.refresh();
      else setError(result.reason);
    });
  };

  return (
    <section className="rounded-md border border-border bg-elevated p-4">
      <h2 className="mb-3 text-sm font-semibold text-fg-default">권한 설정</h2>

      <div className="flex flex-col divide-y divide-border/60">
        <ToggleRow
          label="계정 활성"
          description="비활성 시 로그인(allowlist) 차단"
          value={props.active}
          disabled={pending || (props.isSelf && props.active)}
          disabledHint={props.isSelf && props.active ? "본인 계정은 비활성화할 수 없습니다" : undefined}
          onToggle={() => run(() => setAdminUserActiveAction(props.userId, !props.active))}
        />
        <ToggleRow
          label="super-admin"
          description="전체 instance 접근 + 시스템 관리"
          value={props.isSuperAdmin}
          disabled={pending || (props.isSelf && props.isSuperAdmin)}
          disabledHint={
            props.isSelf && props.isSuperAdmin ? "본인의 super-admin 권한은 해제할 수 없습니다" : undefined
          }
          onToggle={() => run(() => setSuperAdminFlagAction(props.userId, !props.isSuperAdmin))}
        />
        <ToggleRow
          label="의료법 검수 자격"
          description="legal-reviewer 역할 부여 전제"
          value={props.legalReviewerEligible}
          disabled={pending}
          onToggle={() =>
            run(() => setEligibilityAction(props.userId, "legal_reviewer_eligible", !props.legalReviewerEligible))
          }
        />
        <ToggleRow
          label="의료 콘텐츠 검수 자격"
          description="physician-reviewer 역할 부여 전제"
          value={props.physicianReviewerEligible}
          disabled={pending}
          onToggle={() =>
            run(() =>
              setEligibilityAction(props.userId, "physician_reviewer_eligible", !props.physicianReviewerEligible),
            )
          }
        />
        <ToggleRow
          label="클라이언트 승인 자격"
          description="client-approver 역할 부여 전제"
          value={props.clientApproverEligible}
          disabled={pending}
          onToggle={() =>
            run(() => setEligibilityAction(props.userId, "client_approver_eligible", !props.clientApproverEligible))
          }
        />
      </div>

      {error && (
        <div className="mt-3 rounded-md border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">
          {error}
        </div>
      )}
    </section>
  );
}

function ToggleRow({
  label,
  description,
  value,
  disabled,
  disabledHint,
  onToggle,
}: {
  label: string;
  description: string;
  value: boolean;
  disabled: boolean;
  disabledHint?: string;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-fg-default">{label}</span>
        <span className="text-[11px] text-fg-muted">{disabledHint ?? description}</span>
      </div>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-pressed={value}
        className={
          value
            ? "inline-flex min-w-[3.5rem] items-center justify-center rounded-full bg-success px-3 py-1 text-[11px] font-medium text-fg-inverse disabled:opacity-50"
            : "inline-flex min-w-[3.5rem] items-center justify-center rounded-full border border-border px-3 py-1 text-[11px] font-medium text-fg-muted hover:bg-bg-hover disabled:opacity-50"
        }
      >
        {value ? "켜짐" : "꺼짐"}
      </button>
    </div>
  );
}
