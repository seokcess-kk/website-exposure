// @glitzy/web/(admin)/admin/super/instances — super-admin 사이트 관리 (일람 + 생성 + 활성 toggle)
// ADMIN_PERMISSION_SEPARATION v1.1 § 8.
//
// super-admin 가드는 부모 super/layout.tsx 가 수행. 본 page 는 전체 instance (active + inactive) 일람.
// /admin root 는 KPI 일람(운영 현황), 본 page 는 instance 관리(생성·활성 toggle) — 역할 분리.
// 일람 query 는 cross-tenant — admin role 직접 query (WEB_DATABASE_URL · /admin root 동일 패턴).

import Link from "next/link";

import { getSqlBase } from "@/lib/db";
import {
  CreateInstanceSection,
  type InstanceSource,
} from "@/components/admin/super/CreateInstanceSection";
import { InstanceActiveToggle } from "@/components/admin/super/InstanceActiveToggle";

type InstanceRow = {
  id: string;
  slug: string;
  display_name: string;
  active: boolean;
  created_at: Date;
  clinic_name: string | null;
};

const KST_DATE = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export default async function SuperInstancesPage() {
  const sql = getSqlBase();
  const rows = await sql<InstanceRow[]>`
    SELECT
      i.id, i.slug, i.display_name, i.active, i.created_at,
      cp.name AS clinic_name
    FROM instance i
    LEFT JOIN LATERAL (
      SELECT name FROM clinic_profile WHERE instance_id = i.id AND slug = 'clinic' LIMIT 1
    ) cp ON true
    ORDER BY i.active DESC, i.created_at DESC
  `;

  const activeCount = rows.filter((r) => r.active).length;
  const inactiveCount = rows.length - activeCount;
  const sources: InstanceSource[] = rows
    .filter((r) => r.active)
    .map((r) => ({ slug: r.slug, displayName: r.display_name }));

  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-semibold text-fg-default">사이트 관리</h1>
          <span className="text-xs text-fg-muted">super-admin</span>
        </div>
        <p className="text-sm text-fg-muted">
          전체 <strong className="text-fg-default">{rows.length}</strong>개 ·{" "}
          활성 <strong className="text-fg-default">{activeCount}</strong> ·{" "}
          비활성 <strong className="text-fg-default">{inactiveCount}</strong> ·{" "}
          <Link href="/admin/super/users" className="text-brand-primary hover:underline">
            사용자 관리 →
          </Link>{" "}
          ·{" "}
          <Link href="/admin" className="text-brand-primary hover:underline">
            운영 현황(KPI) →
          </Link>
        </p>
      </header>

      <CreateInstanceSection sources={sources} />

      <section className="overflow-hidden rounded-md border border-border bg-elevated">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-subtle text-left text-xs text-fg-muted">
              <th className="px-4 py-2 font-medium">사이트</th>
              <th className="px-4 py-2 font-medium">상태</th>
              <th className="px-4 py-2 font-medium">생성일</th>
              <th className="px-4 py-2 text-right font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-fg-default">{r.display_name}</span>
                    <span className="text-[11px] text-fg-muted">
                      <code className="font-mono">/{r.slug}</code>
                      {r.clinic_name && r.clinic_name !== r.display_name && (
                        <span> · {r.clinic_name}</span>
                      )}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {r.active ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                      ● 활성
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-fg-muted/10 px-2 py-0.5 text-[11px] font-medium text-fg-muted">
                      ○ 비활성
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-fg-muted">{KST_DATE.format(r.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/super/instances/${r.id}`}
                      className="text-[11px] text-brand-primary hover:underline"
                    >
                      상세 →
                    </Link>
                    {r.active && (
                      <Link
                        href={`/admin/${r.slug}`}
                        className="text-[11px] text-brand-primary hover:underline"
                      >
                        어드민 →
                      </Link>
                    )}
                    <InstanceActiveToggle instanceId={r.id} slug={r.slug} active={r.active} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
