// @glitzy/web — / root page (Plan v1.0 § 3.1 라우트 흐름)
// 미인증 → 200 landing page (NSA verification crawler 정합 · 2026-05-22) · 인증 → firstActiveMembershipSlug
// cycle3-3entity WEB-32·33: admin_user.active 검증 + asUuidV4 narrow
//
// 2026-05-22: NSA (네이버 서치어드바이저) crawler 가 redirect 안 따라가 검증 실패 — 미인증 응답을
// 307 redirect 에서 200 landing 으로 변경. meta tag (root layout) 가 함께 노출됨.

import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveSession } from "@glitzy/auth";
import { asUuidV4, type AdminUserId } from "@glitzy/shared-types";

import { getAuthCfg } from "@/lib/env";
import { getSqlBase } from "@/lib/db";
import { readSessionCookie } from "@/lib/session-cookie";
import { resolveFirstActiveMembershipSlug } from "@/lib/post-login-redirect";

function RootLanding() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
      <h1 className="text-2xl font-semibold">Glitzy 웹사이트 노출 솔루션</h1>
      <p className="text-sm text-slate-600">
        의료기관 웹사이트의 검색 노출을 관리하는 운영 콘솔입니다.
      </p>
      <Link
        href="/sign-in"
        className="inline-block rounded-md bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-slate-800"
      >
        관리자 로그인
      </Link>
    </main>
  );
}

export default async function RootPage() {
  const signedToken = readSessionCookie();
  if (!signedToken) {
    return <RootLanding />;
  }

  const sqlBase = getSqlBase();
  const cfg = getAuthCfg();

  let userIdStr: string;
  try {
    const session = await getActiveSession(sqlBase, cfg, signedToken);
    userIdStr = session.userId;
  } catch (err) {
    const reason =
      err && typeof err === "object" && "reason" in err && typeof (err as { reason: unknown }).reason === "string"
        ? (err as { reason: string }).reason
        : "session-not-found";
    redirect(`/sign-in/cleanup?reason=${reason}`);
  }

  // cycle3-3entity WEB-33: branded UUID narrow
  let userId: AdminUserId;
  try {
    userId = asUuidV4(userIdStr) as AdminUserId;
  } catch {
    redirect("/sign-in/cleanup?reason=session-not-found");
  }

  // cycle3-3entity WEB-32: admin_user.active 검증 (membership 만으로는 부족)
  const userRows = await sqlBase<{ active: boolean }[]>`
    SELECT active FROM admin_user WHERE id = ${userId}::uuid LIMIT 1
  `;
  if (userRows.length === 0 || userRows[0]!.active === false) {
    redirect("/sign-in/cleanup?reason=user-inactive");
  }

  // cycle1-code WEB-14: root redirect 는 read-only — audit emit 안 함 (consume route 만 audit)
  // PSR-CASCADE-01b: 어드민 URL `/admin/<slug>/...` prefix 격상 (PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1)
  const result = await resolveFirstActiveMembershipSlug(sqlBase, userId, { emitAudit: false });
  if (result.kind === "missing") {
    redirect("/sign-in?reason=no-active-membership");
  }
  redirect(`/admin/${result.slug}`);
}
