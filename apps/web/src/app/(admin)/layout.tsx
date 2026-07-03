// @glitzy/web/(admin) layout — auth guard + sign-out button (Plan v1.0 § 3 ADMIN-UI-74)
// middleware 미사용 — cookie read + redirect 모두 server-side layout 에서 수행
// UX 개선 (P0·P1): NavMenu 글로벌 top-nav · Breadcrumb 자동 표시 · max-w-7xl 확장

import Link from "next/link";
import { redirect } from "next/navigation";

import { readSessionCookie } from "@/lib/session-cookie";
import { BreadcrumbProvider } from "@/components/admin/BreadcrumbContext";
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
          {/* /admin = 사이트 일람 hub (super-admin: 전체 instance · operator: 본인 instance 1개면 auto-redirect). */}
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-brand-primary"
          >
            <span aria-hidden>🏠</span>
            <span>사이트 일람</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/account"
              className="rounded-md border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100"
            >
              계정
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
        </div>
      </header>
      {/* ADMIN_PERMISSION_SEPARATION v1 § 4 — NavMenu/Breadcrumb 는 instance-level layout 안 mount (super-admin prop 전달용). */}
      <BreadcrumbProvider>
        <ToastProvider>{children}</ToastProvider>
      </BreadcrumbProvider>
    </div>
  );
}
