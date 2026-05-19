// @glitzy/web/(admin) layout — auth guard + sign-out button (Plan v1.0 § 3 ADMIN-UI-74)
// middleware 미사용 — cookie read + redirect 모두 server-side layout 에서 수행
// UX 개선 (P0·P1): NavMenu 글로벌 top-nav · Breadcrumb 자동 표시 · max-w-7xl 확장

import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthDeniedError, getActiveSession } from "@glitzy/auth";

import { getAuthCfg } from "@/lib/env";
import { getSqlBase } from "@/lib/db";
import { readSessionCookie } from "@/lib/session-cookie";
import { NavMenu } from "@/components/admin/NavMenu";
import { Breadcrumb } from "@/components/admin/Breadcrumb";
import { ToastProvider } from "@/components/admin/ToastProvider";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const signedToken = readSessionCookie();
  if (!signedToken) {
    redirect("/sign-in");
  }

  // session signature 검증만 — full tenant resolve 는 각 page 가 수행 (§ 3.2 step 3)
  // cycle1-code WEB-06: tampered/expired cookie 시 cleanup route 로 redirect → cookie clear + audit
  try {
    await getActiveSession(getSqlBase(), getAuthCfg(), signedToken);
  } catch (err) {
    const reason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
    redirect(`/sign-in/cleanup?reason=${reason}`);
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50/30">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            <Link href="/" className="text-sm font-semibold hover:underline">
              Glitzy 어드민 (M0 walking skeleton)
            </Link>
            <form action="/sign-out" method="post">
              <button
                type="submit"
                className="rounded-md border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100"
              >
                로그아웃
              </button>
            </form>
          </div>
        </header>
        <NavMenu />
        <Breadcrumb />
        <div className="mx-auto max-w-7xl px-6 py-6">{children}</div>
      </div>
    </ToastProvider>
  );
}
