// @glitzy/web/(admin)/admin/super/instances/[id] — 사이트 상세 (멤버 일람 + 콘텐츠 통계 + 활성 toggle)
// ADMIN_PERMISSION_SEPARATION v1.1 § 8.1 (per-instance 상세). 가드는 부모 super/layout.tsx.

import Link from "next/link";
import { notFound } from "next/navigation";

import { getSqlBase } from "@/lib/db";
import { contractStatusLabel, type ContractStatus } from "@/lib/admin/super-admin-overview";
import { InstanceActiveToggle } from "@/components/admin/super/InstanceActiveToggle";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ROLE_LABEL: Record<string, string> = {
  operator: "운영자(클라이언트)",
  "legal-reviewer": "의료법 검수자",
  "physician-reviewer": "의료 콘텐츠 검수자",
  "client-approver": "클라이언트 승인자",
};

type InstanceDetail = {
  id: string;
  slug: string;
  display_name: string;
  active: boolean;
  created_at: Date;
  clinic_name: string | null;
  active_doctors: string;
  published_treatments: string;
  total_treatments: string;
  published_articles: string;
  published_faqs: string;
  published_publications: string;
  published_media: string;
  published_legals: string;
};

type MemberRow = {
  id: string;
  email: string;
  display_name: string;
  user_active: boolean;
  is_super_admin: boolean;
  role: string;
};

type ContractRow = { status: string; plan_tier: string; end_date: Date | null };

const KST_DATE = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export default async function SuperInstanceDetailPage({ params }: { params: { id: string } }) {
  if (!UUID_RE.test(params.id)) notFound();

  const sql = getSqlBase();
  const [instanceRows, memberRows, contractRows] = await Promise.all([
    sql<InstanceDetail[]>`
      SELECT
        i.id, i.slug, i.display_name, i.active, i.created_at,
        cp.name AS clinic_name,
        (SELECT count(*) FROM doctor_profile   WHERE instance_id = i.id AND active = true)::text AS active_doctors,
        (SELECT count(*) FROM treatment_page   WHERE instance_id = i.id AND status = 'published')::text AS published_treatments,
        (SELECT count(*) FROM treatment_page   WHERE instance_id = i.id)::text AS total_treatments,
        (SELECT count(*) FROM article          WHERE instance_id = i.id AND status = 'published')::text AS published_articles,
        (SELECT count(*) FROM faq              WHERE instance_id = i.id AND status = 'published')::text AS published_faqs,
        (SELECT count(*) FROM publication      WHERE instance_id = i.id AND status = 'published')::text AS published_publications,
        (SELECT count(*) FROM media_appearance WHERE instance_id = i.id AND status = 'published')::text AS published_media,
        (SELECT count(*) FROM legal_document   WHERE instance_id = i.id AND status = 'published')::text AS published_legals
      FROM instance i
      LEFT JOIN LATERAL (
        SELECT name FROM clinic_profile WHERE instance_id = i.id AND slug = 'clinic' LIMIT 1
      ) cp ON true
      WHERE i.id = ${params.id}::uuid
      LIMIT 1
    `,
    sql<MemberRow[]>`
      SELECT au.id, au.email, au.display_name, au.active AS user_active, au.is_super_admin, im.role
        FROM instance_membership im
        JOIN admin_user au ON au.id = im.user_id
       WHERE im.instance_id = ${params.id}::uuid AND im.active = true
       ORDER BY im.role, au.display_name
    `,
    sql<ContractRow[]>`
      SELECT status, plan_tier, end_date FROM instance_contract WHERE instance_id = ${params.id}::uuid LIMIT 1
    `.catch(() => [] as ContractRow[]),
  ]);

  if (instanceRows.length === 0) notFound();
  const inst = instanceRows[0]!;
  const contract = contractRows[0] ?? null;

  const stats: { label: string; value: string }[] = [
    { label: "활성 의료진", value: inst.active_doctors },
    { label: "발행 시술", value: `${inst.published_treatments} / ${inst.total_treatments}` },
    { label: "발행 칼럼", value: inst.published_articles },
    { label: "발행 FAQ", value: inst.published_faqs },
    { label: "발행 논문", value: inst.published_publications },
    { label: "발행 미디어", value: inst.published_media },
    { label: "발행 약관", value: `${inst.published_legals} / 5` },
  ];

  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Link href="/admin/super/instances" className="text-xs text-brand-primary hover:underline">
          ← 사이트 관리
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl font-semibold text-fg-default">{inst.display_name}</h1>
              {inst.active ? (
                <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                  ● 활성
                </span>
              ) : (
                <span className="rounded-full bg-fg-muted/10 px-2 py-0.5 text-[11px] font-medium text-fg-muted">
                  ○ 비활성
                </span>
              )}
            </div>
            <p className="text-sm text-fg-muted">
              <code className="font-mono">/{inst.slug}</code>
              {inst.clinic_name && inst.clinic_name !== inst.display_name && <span> · {inst.clinic_name}</span>}
              <span> · 생성 {KST_DATE.format(inst.created_at)}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {inst.active && (
              <Link
                href={`/admin/${inst.slug}`}
                className="rounded-md border border-brand-primary/40 px-3 py-1.5 text-xs font-medium text-brand-primary hover:bg-brand-primary-soft"
              >
                어드민 열기 →
              </Link>
            )}
            <InstanceActiveToggle instanceId={inst.id} slug={inst.slug} active={inst.active} />
          </div>
        </div>
      </header>

      {/* 계약 정보 */}
      <section className="rounded-md border border-border bg-elevated p-4">
        <h2 className="mb-2 text-sm font-semibold text-fg-default">계약</h2>
        {contract ? (
          <p className="text-sm text-fg-default">
            <span className="font-medium">{contractStatusLabel(contract.status as ContractStatus)}</span>
            <span className="text-fg-muted"> · {contract.plan_tier}</span>
            {contract.end_date && (
              <span className="text-fg-muted"> · 종료 {KST_DATE.format(contract.end_date)}</span>
            )}
          </p>
        ) : (
          <p className="text-xs text-fg-muted">등록된 계약 정보가 없습니다.</p>
        )}
      </section>

      {/* 콘텐츠 통계 */}
      <section className="rounded-md border border-border bg-elevated p-4">
        <h2 className="mb-3 text-sm font-semibold text-fg-default">콘텐츠 현황</h2>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-0.5 rounded-md border border-border/60 bg-bg-default p-3">
              <dt className="text-[11px] text-fg-muted">{s.label}</dt>
              <dd className="text-lg font-semibold text-fg-default">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 멤버 일람 */}
      <section className="overflow-hidden rounded-md border border-border bg-elevated">
        <header className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <h2 className="text-sm font-semibold text-fg-default">멤버 ({memberRows.length})</h2>
          <Link href="/admin/super/users" className="text-[11px] text-brand-primary hover:underline">
            사용자 관리 →
          </Link>
        </header>
        {memberRows.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-fg-muted">활성 멤버가 없습니다.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-subtle text-left text-xs text-fg-muted">
                <th className="px-4 py-2 font-medium">사용자</th>
                <th className="px-4 py-2 font-medium">역할</th>
                <th className="px-4 py-2 text-right font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {memberRows.map((m) => (
                <tr key={m.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-fg-default">
                        {m.display_name}
                        {m.is_super_admin && (
                          <span className="ml-2 rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-medium text-violet-700">
                            super-admin
                          </span>
                        )}
                        {!m.user_active && (
                          <span className="ml-2 rounded-full bg-fg-muted/10 px-1.5 py-0.5 text-[10px] font-medium text-fg-muted">
                            계정 비활성
                          </span>
                        )}
                      </span>
                      <span className="text-[11px] text-fg-muted">{m.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-fg-default">{ROLE_LABEL[m.role] ?? m.role}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/super/users/${m.id}`}
                      className="text-[11px] text-brand-primary hover:underline"
                    >
                      상세 →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
