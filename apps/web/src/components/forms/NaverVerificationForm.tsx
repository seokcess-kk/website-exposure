// @glitzy/web/components/forms/NaverVerificationForm — C0051
// 네이버 서치어드바이저 "HTML 태그" 소유확인 토큰 입력 (격리 폼).
// content="..." 의 값만 입력 — 사이트 <head> 에 <meta name="naver-site-verification"> 로 출력.

"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { SaveResult } from "@/app/(admin)/admin/[instanceSlug]/clinic-profile/actions";

type Props = {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initialToken: string;
};

export function NaverVerificationForm({ action, initialToken }: Props) {
  const [state, formAction] = useFormState(action, null);
  const fieldError = state && state.ok === false ? state.fieldErrors.naverSiteVerification?.[0] : undefined;
  const formError = state && state.ok === false ? state.formError : undefined;
  const saved = state?.ok === true;

  return (
    <section className="rounded-md border border-slate-200 bg-white p-4">
      <h2 className="mb-1 text-base font-medium">네이버 검색 소유확인</h2>
      <p className="mb-3 text-xs text-slate-500">
        네이버 서치어드바이저(searchadvisor.naver.com) → 사이트 추가 → 소유확인 → <strong>HTML 태그</strong> 방식에서{" "}
        <code className="rounded bg-slate-100 px-1">{`<meta name="naver-site-verification" content="여기값" />`}</code>{" "}
        의 <strong>content 값</strong>만 붙여넣고 저장하세요. 저장하면 공개 사이트 전 페이지 <code>&lt;head&gt;</code> 에 자동 출력됩니다.
      </p>
      <form action={formAction} className="flex flex-col gap-2">
        <input
          type="text"
          name="naverSiteVerification"
          defaultValue={initialToken}
          placeholder="예: 1a2b3c4d5e6f… (영문·숫자 8~200자 · 비우면 해제)"
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-mono"
          autoComplete="off"
          spellCheck={false}
        />
        {fieldError && <p className="text-xs text-rose-700">{fieldError}</p>}
        {formError && <p className="text-xs text-rose-700">{formError}</p>}
        {saved && <p className="text-xs text-emerald-700">저장됨 — 공개 사이트 head 에 meta 출력. 서치어드바이저에서 소유확인을 진행하세요.</p>}
        <div>
          <SubmitButton />
        </div>
      </form>
    </section>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
    >
      {pending ? "저장 중…" : "소유확인 토큰 저장"}
    </button>
  );
}
