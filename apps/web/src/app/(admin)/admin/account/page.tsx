// @glitzy/web/(admin)/admin/account — 본인 계정 (비밀번호 변경)
// (admin)/layout.tsx 쿠키 가드가 보호. loadAdminUser 로 표시 정보 조회.

import { redirect } from "next/navigation";

import { loadAdminUser } from "@/lib/admin/super-admin-context";
import { ChangePasswordSection } from "@/components/admin/ChangePasswordSection";

export default async function AccountPage() {
  const u = await loadAdminUser();
  if (u.kind === "no-cookie") redirect("/sign-in");
  if (u.kind === "denied") redirect(`/sign-in/cleanup?reason=${u.reason}`);
  if (u.kind === "no-user") redirect("/sign-in/cleanup?reason=admin-user-not-found");

  return (
    <main className="mx-auto flex max-w-lg flex-col gap-6 px-6 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-fg-default">계정</h1>
        <p className="text-sm text-fg-muted">{u.displayName}</p>
      </header>
      <ChangePasswordSection />
    </main>
  );
}
