// @glitzy/web/components/admin/super/MembershipManager — instance_membership 부여/취소
// ADMIN_PERMISSION_SEPARATION v1.2 § 9.3. reviewer role 은 eligibility 필요 — server 가 enforce.

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { addMembershipAction, revokeMembershipAction } from "@/app/(admin)/admin/super/users/actions";

export type MembershipView = {
  id: string;
  instanceSlug: string;
  instanceName: string;
  role: string;
};

export type AssignableInstance = { id: string; slug: string; displayName: string };

const ROLE_LABEL: Record<string, string> = {
  operator: "운영자(클라이언트)",
  "legal-reviewer": "의료법 검수자",
  "physician-reviewer": "의료 콘텐츠 검수자",
  "client-approver": "클라이언트 승인자",
};

const ROLE_OPTIONS = ["operator", "legal-reviewer", "physician-reviewer", "client-approver"] as const;

export function MembershipManager({
  userId,
  memberships,
  instances,
}: {
  userId: string;
  memberships: MembershipView[];
  instances: AssignableInstance[];
}) {
  const [instanceId, setInstanceId] = useState(instances[0]?.id ?? "");
  const [role, setRole] = useState<string>("operator");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const assignedInstanceIds = new Set(
    memberships.map((m) => instances.find((i) => i.slug === m.instanceSlug)?.id).filter(Boolean) as string[],
  );
  const availableInstances = instances.filter((i) => !assignedInstanceIds.has(i.id));

  const add = () => {
    if (!instanceId) return;
    setError(null);
    startTransition(async () => {
      const result = await addMembershipAction(userId, instanceId, role);
      if (result.ok) {
        setError(null);
        router.refresh();
      } else {
        setError(result.reason);
      }
    });
  };

  const revoke = (membershipId: string) => {
    setError(null);
    startTransition(async () => {
      const result = await revokeMembershipAction(membershipId);
      if (result.ok) router.refresh();
      else setError(result.reason);
    });
  };

  return (
    <section className="rounded-md border border-border bg-elevated p-4">
      <h2 className="mb-3 text-sm font-semibold text-fg-default">사이트 멤버십</h2>

      {memberships.length === 0 ? (
        <p className="text-xs text-fg-muted">부여된 멤버십이 없습니다.</p>
      ) : (
        <ul className="mb-4 flex flex-col divide-y divide-border/60">
          {memberships.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-4 py-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-fg-default">{m.instanceName}</span>
                <span className="text-[11px] text-fg-muted">
                  <code className="font-mono">/{m.instanceSlug}</code> · {ROLE_LABEL[m.role] ?? m.role}
                </span>
              </div>
              <button
                type="button"
                onClick={() => revoke(m.id)}
                disabled={pending}
                className="rounded-md border border-error/40 px-3 py-1 text-[11px] font-medium text-error hover:bg-error/10 disabled:opacity-50"
              >
                취소
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="rounded-md border border-border/60 bg-bg-default p-3">
        <h3 className="mb-2 text-xs font-semibold text-fg-default">멤버십 부여</h3>
        {availableInstances.length === 0 ? (
          <p className="text-[11px] text-fg-muted">부여할 수 있는 활성 사이트가 없습니다.</p>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className="flex flex-1 flex-col gap-1">
              <span className="text-[11px] font-medium text-fg-default">사이트</span>
              <select
                value={instanceId}
                onChange={(e) => setInstanceId(e.target.value)}
                disabled={pending}
                className="rounded-md border border-border bg-elevated px-2 py-1.5 text-xs text-fg-default disabled:opacity-50"
              >
                {availableInstances.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.displayName} ({i.slug})
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-1 flex-col gap-1">
              <span className="text-[11px] font-medium text-fg-default">역할</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={pending}
                className="rounded-md border border-border bg-elevated px-2 py-1.5 text-xs text-fg-default disabled:opacity-50"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABEL[r]}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={add}
              disabled={pending || !instanceId}
              className="rounded-md bg-brand-primary px-4 py-1.5 text-xs font-medium text-fg-inverse hover:bg-brand-primary-hover disabled:opacity-50"
            >
              부여
            </button>
          </div>
        )}
        <p className="mt-2 text-[10px] text-fg-muted">
          검수자 역할(의료법·의료 콘텐츠·승인)은 위 "권한 설정"에서 해당 자격을 먼저 켜야 부여됩니다.
        </p>
      </div>

      {error && (
        <div className="mt-3 rounded-md border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">
          {error}
        </div>
      )}
    </section>
  );
}
