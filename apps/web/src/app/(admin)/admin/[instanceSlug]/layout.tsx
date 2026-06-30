// @glitzy/web/(admin)/admin/[instanceSlug] layout — dev convenience auto-enter (2026-05-22)
// + ADMIN_PERMISSION_SEPARATION v1 § 4 (2026-05-27) — instance scope 안 NavMenu/Breadcrumb mount
//   + isSuperAdmin prop 전달.
//
// 부모 (admin)/layout.tsx 는 dev mode + DEMO env set 시 cookie 없어도 children 통과.
// 본 layout 이 instanceSlug params 를 받아 /{instanceSlug}/demo-admin-enter 로 정확히 redirect.
// 그 route 가 session 생성 + cookie set + /admin/{instanceSlug} 로 다시 redirect.
//
// production 흐름: 부모 layout 에서 이미 cookie 검증 후 /sign-in redirect — 본 layout 도달 안 함.

import { redirect } from "next/navigation";

import { readSessionCookie } from "@/lib/session-cookie";
import { NavMenu } from "@/components/admin/NavMenu";
import { Breadcrumb } from "@/components/admin/Breadcrumb";

export default async function AdminInstanceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { instanceSlug: string };
}) {
  const signedToken = readSessionCookie();
  if (!signedToken) {
    // 부모 layout 이 dev mode 만 통과시키므로 여기 도달 = dev mode + DEMO env set.
    redirect(`/${params.instanceSlug}/demo-admin-enter`);
  }

  return (
    <>
      <NavMenu />
      <Breadcrumb />
      <div className="mx-auto max-w-7xl px-6 py-6">{children}</div>
    </>
  );
}
