// @glitzy/web/components/admin/CloneInstanceSection — 대시보드 안 "이 사이트 복제" 섹션
// 현재 instance 를 source 로 새 instance 를 생성한다. 복제 정책은 lib/admin/clone-instance.ts 참고.

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { cloneInstanceAction } from "@/app/(admin)/admin/[instanceSlug]/clone-actions";

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{2,63}$/;

export function CloneInstanceSection({ sourceSlug }: { sourceSlug: string }) {
  const [targetSlug, setTargetSlug] = useState("");
  const [targetName, setTargetName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const slugTrim = targetSlug.trim();
  const nameTrim = targetName.trim();
  const slugValid = SLUG_REGEX.test(slugTrim);
  const nameValid = nameTrim.length > 0 && nameTrim.length <= 200;
  const canSubmit = slugValid && nameValid && !pending;

  const reset = () => {
    setTargetSlug("");
    setTargetName("");
    setError(null);
    setConfirming(false);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    setError(null);
    startTransition(async () => {
      const result = await cloneInstanceAction(sourceSlug, slugTrim, nameTrim);
      if (result.ok) {
        router.push(`/admin/${result.result.newInstanceSlug}`);
        router.refresh();
      } else {
        setError(result.reason);
        setConfirming(false);
      }
    });
  };

  return (
    <section className="rounded-md border border-border bg-elevated p-4">
      <header className="mb-3 flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-fg-default">이 사이트 복제</h2>
        <span className="text-xs text-fg-muted">원본: <code className="font-mono">{sourceSlug}</code></span>
      </header>
      <p className="mb-4 text-xs text-fg-muted">
        디자인 토큰·시술 카탈로그·약관 템플릿·콘텐츠 분류 체계는 그대로 복사되고,
        병원 식별 정보(상호·주소·사업자번호·정책 담당자)와 의료진·기사·논문·미디어·FAQ 는 비워진 상태로 새 사이트가 만들어집니다.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-xs font-medium text-fg-default">새 사이트 식별자 (slug)</span>
          <input
            type="text"
            value={targetSlug}
            onChange={(e) => setTargetSlug(e.target.value)}
            placeholder="songdo"
            pattern="^[a-z0-9][a-z0-9-]{2,63}$"
            disabled={pending}
            className="rounded-md border border-border bg-bg-default px-3 py-2 font-mono text-sm text-fg-default disabled:opacity-50"
          />
          <span className="text-[11px] text-fg-muted">
            3~64자 · 소문자/숫자/하이픈 · URL <code>/{slugTrim || "<slug>"}</code> 에 사용
          </span>
        </label>

        <label className="flex flex-1 flex-col gap-1">
          <span className="text-xs font-medium text-fg-default">새 사이트 표시 이름</span>
          <input
            type="text"
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
            placeholder="다이트한의원 송도점"
            maxLength={200}
            disabled={pending}
            className="rounded-md border border-border bg-bg-default px-3 py-2 text-sm text-fg-default disabled:opacity-50"
          />
          <span className="text-[11px] text-fg-muted">1~200자 · 어드민 헤더와 audit 로그에 표시</span>
        </label>
      </div>

      {error && (
        <div className="mt-3 rounded-md border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">
          {error}
        </div>
      )}

      <div className="mt-4 flex items-center justify-end gap-2">
        {confirming ? (
          <>
            <span className="text-xs text-fg-muted">
              <code className="font-mono">{slugTrim}</code> 로 복제할까요?
            </span>
            <button
              type="button"
              onClick={reset}
              disabled={pending}
              className="rounded-md border border-border px-3 py-1.5 text-xs text-fg-default hover:bg-bg-hover disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="rounded-md bg-brand-primary px-4 py-1.5 text-xs font-medium text-fg-inverse hover:bg-brand-primary-hover disabled:opacity-50"
            >
              {pending ? "복제 중…" : "확인하고 복제"}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              setError(null);
              if (!slugValid) {
                setError("식별자 형식 오류: 3~64자, 소문자/숫자/하이픈만 가능합니다.");
                return;
              }
              if (!nameValid) {
                setError("표시 이름은 1~200자여야 합니다.");
                return;
              }
              setConfirming(true);
            }}
            disabled={pending}
            className="rounded-md bg-brand-primary px-4 py-1.5 text-xs font-medium text-fg-inverse hover:bg-brand-primary-hover disabled:opacity-50"
          >
            새 사이트로 복제
          </button>
        )}
      </div>
    </section>
  );
}
