// @glitzy/web/sign-in — 계정 + 비밀번호 로그인 폼

import { signInReasonMessage, isSignInReason } from "@/lib/deny-reason-map";
import { signInWithPasswordAction } from "./actions";

export default function SignInPage({
  searchParams,
}: {
  searchParams: { reason?: string };
}) {
  // cycle3-code WEB-38: type guard 로 narrow — 임의 값 → null (generic 메시지)
  const reason = isSignInReason(searchParams.reason) ? searchParams.reason : null;
  const banner = signInReasonMessage(reason);

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
      <h1 className="text-2xl font-semibold">관리자 로그인</h1>
      <p className="text-sm text-slate-600">이메일과 비밀번호를 입력해 로그인하세요.</p>

      {banner && (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {banner}
        </div>
      )}

      <form action={signInWithPasswordAction} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span>이메일</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>비밀번호</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          로그인
        </button>
      </form>
    </main>
  );
}
