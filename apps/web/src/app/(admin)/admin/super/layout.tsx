// @glitzy/web/(admin)/admin/super layout — super-admin 전용 라우트 가드
// ADMIN_PERMISSION_SEPARATION v1.1 § 8.1 — ctx.isSuperAdmin === false 시 /admin redirect.
//
// 부모 (admin)/layout.tsx 가 헤더·sign-out·Provider 를 제공하고 cookie 부재만 검사한다.
// 본 layout 은 그 안에서 super-admin 여부까지 확정 — operator(클라이언트) 가 URL 직접 진입해도 차단.
// server action 은 layout 가드와 별개로 자체 재검증한다 (clone-actions 패턴 · UI hide 만으로 보안 X).

import { redirect } from "next/navigation";

import { loadAdminUser } from "@/lib/admin/super-admin-context";

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const u = await loadAdminUser();

  if (u.kind === "no-cookie") redirect("/sign-in");
  if (u.kind === "denied") redirect(`/sign-in/cleanup?reason=${u.reason}`);
  if (u.kind === "no-user") redirect("/sign-in/cleanup?reason=admin-user-not-found");
  if (!u.isSuperAdmin) redirect("/admin");

  return <div className="mx-auto max-w-7xl px-6 py-6">{children}</div>;
}
