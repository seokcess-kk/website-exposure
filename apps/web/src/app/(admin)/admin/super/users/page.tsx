// @glitzy/web/(admin)/admin/super/users — super-admin 사용자 관리 (일람 + 초대)
// ADMIN_PERMISSION_SEPARATION v1.2 § 9.1. 가드는 부모 super/layout.tsx.
// admin_user 는 auth 테이블 — raw getSqlBase() 직접 query (/admin root · super/instances 동일 패턴).

import Link from "next/link";

import { getSqlBase } from "@/lib/db";
import { CreateAdminUserSection } from "@/components/admin/super/CreateAdminUserSection";

type UserRow = {
  id: string;
  email: string;
  display_name: string;
  active: boolean;
  is_super_admin: boolean;
  last_login_at: Date | null;
  membership_count: string;
};

const KST_DATETIME = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function SuperUsersPage() {
  const sql = getSqlBase();
  const rows = await sql<UserRow[]>`
    SELECT
      au.id, au.email, au.display_name, au.active, au.is_super_admin, au.last_login_at,
      (SELECT count(*) FROM instance_membership im WHERE im.user_id = au.id AND im.active = true)::text AS membership_count
    FROM admin_user au
    ORDER BY au.is_super_admin DESC, au.active DESC, au.created_at ASC
  `;

  const activeCount = rows.filter((r) => r.active).length;
  const superCount = rows.filter((r) => r.is_super_admin).length;

  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-semibold text-fg-default">사용자 관리</h1>
          <span className="text-xs text-fg-muted">super-admin</span>
        </div>
        <p className="text-sm text-fg-muted">
          총 <strong className="text-fg-default">{rows.length}</strong>명 ·{" "}
          활성 <strong className="text-fg-default">{activeCount}</strong> ·{" "}
          super-admin <strong className="text-fg-default">{superCount}</strong> ·{" "}
          <Link href="/admin/super/instances" className="text-brand-primary hover:underline">
            사이트 관리 →
          </Link>
        </p>
      </header>

      <CreateAdminUserSection />

      <section className="overflow-hidden rounded-md border border-border bg-elevated">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-subtle text-left text-xs text-fg-muted">
              <th className="px-4 py-2 font-medium">사용자</th>
              <th className="px-4 py-2 font-medium">권한</th>
              <th className="px-4 py-2 font-medium">멤버십</th>
              <th className="px-4 py-2 font-medium">마지막 로그인</th>
              <th className="px-4 py-2 text-right font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-fg-default">
                      {r.display_name}
                      {!r.active && (
                        <span className="ml-2 rounded-full bg-fg-muted/10 px-2 py-0.5 text-[10px] font-medium text-fg-muted">
                          비활성
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-fg-muted">{r.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {r.is_super_admin ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-medium text-violet-700">
                      🛡️ super-admin
                    </span>
                  ) : (
                    <span className="text-[11px] text-fg-muted">일반</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-fg-muted">{r.membership_count}개 사이트</td>
                <td className="px-4 py-3 text-xs text-fg-muted">
                  {r.last_login_at ? KST_DATETIME.format(r.last_login_at) : "없음"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/super/users/${r.id}`}
                    className="text-[11px] text-brand-primary hover:underline"
                  >
                    상세 →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
