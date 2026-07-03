// @glitzy/web/components/admin/super/CreateAdminUserSection — 사용자 등록 (admin_user + 초기 비밀번호)
// ADMIN_PERMISSION_SEPARATION v1.2 § 9.2. super-admin 이 초기 비밀번호를 지정 · 사용자는 이후 본인이 변경.

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createAdminUserAction } from "@/app/(admin)/admin/super/users/actions";

const MIN_PASSWORD_LENGTH = 10;

export function CreateAdminUserSection() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const emailTrim = email.trim();
  const nameTrim = displayName.trim();
  const canSubmit =
    emailTrim.length > 0 &&
    nameTrim.length > 0 &&
    nameTrim.length <= 200 &&
    password.length >= MIN_PASSWORD_LENGTH &&
    !pending;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setError(null);
    startTransition(async () => {
      const result = await createAdminUserAction(emailTrim, nameTrim, password);
      if (result.ok) {
        setEmail("");
        setDisplayName("");
        setPassword("");
        router.push(`/admin/super/users/${result.userId}`);
        router.refresh();
      } else {
        setError(result.reason);
      }
    });
  };

  return (
    <section className="rounded-md border border-border bg-elevated p-4">
      <header className="mb-1">
        <h2 className="text-sm font-semibold text-fg-default">사용자 등록</h2>
        <p className="mt-1 text-xs text-fg-muted">
          이메일·표시 이름과 초기 비밀번호를 지정해 계정을 만듭니다. 사용자는 로그인 후 본인이 비밀번호를
          변경할 수 있고, 분실 시 상세 페이지에서 재설정할 수 있습니다.
        </p>
      </header>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-xs font-medium text-fg-default">이메일</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="client@example.com"
            maxLength={254}
            disabled={pending}
            className="rounded-md border border-border bg-bg-default px-3 py-2 text-sm text-fg-default disabled:opacity-50"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-xs font-medium text-fg-default">표시 이름</span>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="홍길동 (부평점 담당)"
            maxLength={200}
            disabled={pending}
            className="rounded-md border border-border bg-bg-default px-3 py-2 text-sm text-fg-default disabled:opacity-50"
          />
        </label>
      </div>

      <label className="mt-3 flex flex-col gap-1">
        <span className="text-xs font-medium text-fg-default">초기 비밀번호 (최소 {MIN_PASSWORD_LENGTH}자)</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="rounded-md bg-brand-primary px-4 py-1.5 text-xs font-medium text-fg-inverse hover:bg-brand-primary-hover disabled:opacity-50"
        >
          {pending ? "등록 중…" : "사용자 등록"}
        </button>
      </div>
    </section>
  );
}
