// @glitzy/web/sign-in — 이메일 입력 폼 (Plan v1.0 § 3.2 step 1)

import { redirect } from "next/navigation";

import { signInReasonMessage, isSignInReason } from "@/lib/deny-reason-map";
import { MockMailbox } from "@/components/dev/MockMailbox";
import { issueMagicLinkAction } from "./actions";

export default function SignInPage({
  searchParams,
}: {
  searchParams: { reason?: string; sent?: string };
}) {
  // Dev convenience (2026-05-22): DEMO env set 시 default slug 의 demo-admin-enter 로 자동 진입.
  // 사용자가 /sign-in 을 직접 입력하거나 다른 경로로 도달했을 때 안전망.
  if (process.env.NODE_ENV !== "production" && process.env.DEMO_ADMIN_AUTO_LOGIN_EMAIL) {
    const defaultSlug = process.env.DEMO_DEFAULT_INSTANCE_SLUG ?? "demo";
    redirect(`/${defaultSlug}/demo-admin-enter`);
  }

  // cycle3-code WEB-38: type guard 로 narrow — 임의 값 → null (generic 메시지)
  const reason = isSignInReason(searchParams.reason) ? searchParams.reason : null;
  const banner = signInReasonMessage(reason);
  // cycle4-code WEB-58: sent=1 generic banner (enumeration 방지 — allowlisted/미존재 동일 응답)
  const sent = searchParams.sent === "1";

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
      <h1 className="text-2xl font-semibold">관리자 로그인</h1>
      <p className="text-sm text-slate-600">
        가입된 이메일을 입력하면 로그인 링크가 발송됩니다.
      </p>

      {banner && (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {banner}
        </div>
      )}
      {sent && !banner && (
        <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          확인용 메일을 발송했습니다. 받은편지함을 확인해주세요.
        </div>
      )}

      <form action={issueMagicLinkAction} className="flex flex-col gap-3">
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
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          로그인 링크 발송
        </button>
      </form>

      {/* Plan § 7 ADMIN-UI-19: server-side 3중 가드 — components/dev/MockMailbox.tsx (cycle1-code WEB-16) */}
      <MockMailbox />
    </main>
  );
}
