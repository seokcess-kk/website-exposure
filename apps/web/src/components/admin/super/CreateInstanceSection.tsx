// @glitzy/web/components/admin/super/CreateInstanceSection — 신규 사이트 생성 (원본 선택형 복제)
// ADMIN_PERMISSION_SEPARATION v1.1 § 8.2 — 생성 경로는 clone 으로 통일 (사용자 결정 2026-05-29).
//   기존 CloneInstanceSection 은 "현재 instance" 고정 원본. 본 컴포넌트는 super-admin 이
//   원본 instance 를 드롭다운에서 골라 신규 생성. 생성 로직·가드는 cloneInstanceAction 재사용.

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { cloneInstanceAction } from "@/app/(admin)/admin/[instanceSlug]/clone-actions";

// SDS-04: slug 는 서브도메인 라벨(<slug>.<메인도메인>)로도 쓰임 — DNS 라벨 규칙 (3~63자·끝 하이픈 금지).
// 서버(clone-instance)의 slugSubdomainIssue 와 동일 정책 (예약어·명시맵 선점은 서버에서 추가 검증).
const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;

export type InstanceSource = { slug: string; displayName: string };

export function CreateInstanceSection({ sources }: { sources: InstanceSource[] }) {
  const [sourceSlug, setSourceSlug] = useState(sources[0]?.slug ?? "");
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
  const sourceValid = sources.some((s) => s.slug === sourceSlug);
  const canSubmit = slugValid && nameValid && sourceValid && !pending;

  if (sources.length === 0) {
    return (
      <section className="rounded-md border border-border bg-elevated p-4">
        <h2 className="mb-1 text-sm font-semibold text-fg-default">새 사이트 만들기</h2>
        <p className="text-xs text-fg-muted">
          새 사이트는 기존 활성 사이트를 원본으로 복제해 만듭니다. 활성 상태의 원본 사이트가 없어
          아직 생성할 수 없습니다.
        </p>
      </section>
    );
  }

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
      <header className="mb-3">
        <h2 className="text-sm font-semibold text-fg-default">새 사이트 만들기</h2>
        <p className="mt-1 text-xs text-fg-muted">
          원본 사이트의 디자인 토큰·시술 카탈로그·약관 템플릿·콘텐츠 분류 체계는 그대로 복사되고,
          병원 식별 정보(상호·주소·사업자번호)와 의료진·기사·논문·미디어·FAQ 는 비워진 상태로 시작합니다.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-fg-default">원본 사이트</span>
          <select
            value={sourceSlug}
            onChange={(e) => setSourceSlug(e.target.value)}
            disabled={pending}
            className="rounded-md border border-border bg-bg-default px-3 py-2 text-sm text-fg-default disabled:opacity-50"
          >
            {sources.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.displayName} ({s.slug})
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-xs font-medium text-fg-default">새 사이트 식별자 (slug)</span>
            <input
              type="text"
              value={targetSlug}
              onChange={(e) => setTargetSlug(e.target.value)}
              placeholder="songdo"
              pattern="^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$"
              disabled={pending}
              className="rounded-md border border-border bg-bg-default px-3 py-2 font-mono text-sm text-fg-default disabled:opacity-50"
            />
            <span className="text-[11px] text-fg-muted">
              3~63자 · 소문자/숫자/하이픈(끝 하이픈 불가) · 서브도메인{" "}
              <code>{slugTrim || "<slug>"}.&lt;메인도메인&gt;</code> 과 URL{" "}
              <code>/{slugTrim || "<slug>"}</code> 에 사용
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
              <code className="font-mono">{sourceSlug}</code> →{" "}
              <code className="font-mono">{slugTrim}</code> 로 생성할까요?
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
              {pending ? "생성 중…" : "확인하고 생성"}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              setError(null);
              if (!sourceValid) {
                setError("원본 사이트를 선택해 주세요.");
                return;
              }
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
            새 사이트 생성
          </button>
        )}
      </div>
    </section>
  );
}
