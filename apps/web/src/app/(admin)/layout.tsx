// @glitzy/web/(admin) layout — auth guard + sign-out button (Plan v1.0 § 3 ADMIN-UI-74)
// middleware 미사용 — cookie read + redirect 모두 server-side layout 에서 수행
// UX 개선 (P0·P1): NavMenu 글로벌 top-nav · Breadcrumb 자동 표시 · max-w-7xl 확장
//
// Demo auto-login (2026-05-22): DEMO_ADMIN_AUTO_LOGIN_EMAIL env set 시 cookie 없어도 children
// 통과 — 자식 layout/page (admin/[instanceSlug]/layout.tsx, admin/page.tsx) 가 instanceSlug
// 기반으로 /{slug}/demo-admin-enter 자동 진입 처리. 프로젝트 개발 단계 한정 — env 미설정 시
// 기존대로 /sign-in redirect (demo-admin-enter route 와 동일 보안 trade-off).

import Link from "next/link";
import { redirect } from "next/navigation";

import { readSessionCookie } from "@/lib/session-cookie";
import { NavMenu } from "@/components/admin/NavMenu";
import { Breadcrumb } from "@/components/admin/Breadcrumb";
import { ToastProvider } from "@/components/admin/ToastProvider";

function isAutoLoginEnabled(): boolean {
  return Boolean(process.env.DEMO_ADMIN_AUTO_LOGIN_EMAIL);
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const signedToken = readSessionCookie();
  if (!signedToken && !isAutoLoginEnabled()) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-slate-50/30">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/" className="text-sm font-semibold hover:underline">
            관리자
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
      <div className="mx-auto max-w-7xl px-6 py-6">
        <ToastProvider>{children}</ToastProvider>
      </div>
    </div>
  );
}
