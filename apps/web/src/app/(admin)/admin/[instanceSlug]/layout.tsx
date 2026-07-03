// @glitzy/web/(admin)/admin/[instanceSlug] layout — ADMIN_PERMISSION_SEPARATION v1 § 4 (2026-05-27)
//   instance scope 안 NavMenu/Breadcrumb mount + isSuperAdmin prop 전달.
//   cookie 부재는 부모 (admin)/layout.tsx 가 이미 /sign-in 으로 처리 — 본 가드는 방어적 중복.

import { redirect } from "next/navigation";

import { readSessionCookie } from "@/lib/session-cookie";
import { NavMenu } from "@/components/admin/NavMenu";
import { Breadcrumb } from "@/components/admin/Breadcrumb";

export default async function AdminInstanceLayout({ children }: { children: React.ReactNode }) {
  const signedToken = readSessionCookie();
  if (!signedToken) redirect("/sign-in");

  return (
    <>
      <NavMenu />
      <Breadcrumb />
      <div className="mx-auto max-w-7xl px-6 py-6">{children}</div>
    </>
  );
}
