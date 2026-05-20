// @glitzy/web/(admin) layout — auth guard + sign-out button (Plan v1.0 § 3 ADMIN-UI-74)
// middleware 미사용 — cookie read + redirect 모두 server-side layout 에서 수행
// UX 개선 (P0·P1): NavMenu 글로벌 top-nav · Breadcrumb 자동 표시 · max-w-7xl 확장

import Link from "next/link";
import { redirect } from "next/navigation";

import { readSessionCookie } from "@/lib/session-cookie";
import { NavMenu } from "@/components/admin/NavMenu";
import { Breadcrumb } from "@/components/admin/Breadcrumb";
import { ToastProvider } from "@/components/admin/ToastProvider";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const signedToken = readSessionCookie();
  if (!signedToken) {
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
