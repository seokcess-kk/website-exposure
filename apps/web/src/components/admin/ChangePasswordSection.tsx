// @glitzy/web/components/admin/ChangePasswordSection — 로그인 사용자 본인 비밀번호 변경

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { changeMyPasswordAction } from "@/app/(admin)/admin/account/actions";

const MIN_PASSWORD_LENGTH = 10;

export function ChangePasswordSection() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const canSubmit = current.length > 0 && next.length >= MIN_PASSWORD_LENGTH && !pending;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setError(null);
    setDone(false);
    startTransition(async () => {
      const result = await changeMyPasswordAction(current, next);
      if (result.ok) {
        setCurrent("");
        setNext("");
        setDone(true);
        router.refresh();
      } else {
        setError(result.reason);
      }
    });
  };

  return (
    <section className="rounded-md border border-border bg-elevated p-4">
      <h2 className="mb-1 text-sm font-semibold text-fg-default">비밀번호 변경</h2>
      <p className="mb-3 text-xs text-fg-muted">현재 비밀번호 확인 후 새 비밀번호로 변경합니다.</p>

      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-fg-default">현재 비밀번호</span>
          <input
            type="password"
            value={current}
            onChange={(e) => {
              setCurrent(e.target.value);
              setDone(false);
            }}
            autoComplete="current-password"
            maxLength={200}
            disabled={pending}
            className="rounded-md border border-border bg-bg-default px-3 py-2 text-sm text-fg-default disabled:opacity-50"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-fg-default">새 비밀번호 (최소 {MIN_PASSWORD_LENGTH}자)</span>
          <input
            type="password"
            value={next}
            onChange={(e) => {
              setNext(e.target.value);
              setDone(false);
            }}
            autoComplete="new-password"
            maxLength={200}
            disabled={pending}
            className="rounded-md border border-border bg-bg-default px-3 py-2 text-sm text-fg-default disabled:opacity-50"
          />
        </label>
      </div>

      {error && (
        <div className="mt-3 rounded-md border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">
          {error}
        </div>
      )}
      {done && (
        <div className="mt-3 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-xs text-success">
          비밀번호가 변경되었습니다.
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="rounded-md bg-brand-primary px-4 py-1.5 text-xs font-medium text-fg-inverse hover:bg-brand-primary-hover disabled:opacity-50"
        >
          {pending ? "변경 중…" : "비밀번호 변경"}
        </button>
      </div>
    </section>
  );
}
