// @glitzy/web/components/admin/super/PasswordResetSection — super-admin 이 대상 계정 비밀번호 재설정
// 현재 비밀번호 불필요 (관리자 재설정 · 분실 대응). AdminUserControls 의 run()/useTransition 패턴 재사용.

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { setUserPasswordAction } from "@/app/(admin)/admin/super/users/actions";

const MIN_PASSWORD_LENGTH = 10;

export function PasswordResetSection({ userId }: { userId: string }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const canSubmit = password.length >= MIN_PASSWORD_LENGTH && !pending;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setError(null);
    setDone(false);
    startTransition(async () => {
      const result = await setUserPasswordAction(userId, password);
      if (result.ok) {
        setPassword("");
        setDone(true);
        router.refresh();
      } else {
        setError(result.reason);
      }
    });
  };

  return (
    <section className="rounded-md border border-border bg-elevated p-4">
      <h2 className="mb-1 text-sm font-semibold text-fg-default">비밀번호 재설정</h2>
      <p className="mb-3 text-xs text-fg-muted">
        이 계정의 비밀번호를 새로 지정합니다. 현재 비밀번호는 필요하지 않습니다(관리자 재설정).
      </p>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-fg-default">새 비밀번호 (최소 {MIN_PASSWORD_LENGTH}자)</span>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setDone(false);
          }}
          autoComplete="new-password"
          maxLength={200}
          disabled={pending}
          className="rounded-md border border-border bg-bg-default px-3 py-2 text-sm text-fg-default disabled:opacity-50"
        />
      </label>

      {error && (
        <div className="mt-3 rounded-md border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">
          {error}
        </div>
      )}
      {done && (
        <div className="mt-3 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-xs text-success">
          비밀번호가 재설정되었습니다.
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="rounded-md bg-brand-primary px-4 py-1.5 text-xs font-medium text-fg-inverse hover:bg-brand-primary-hover disabled:opacity-50"
        >
          {pending ? "재설정 중…" : "비밀번호 재설정"}
        </button>
      </div>
    </section>
  );
}
