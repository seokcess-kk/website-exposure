// @glitzy/web/(admin)/admin/super/users/[id] — 사용자 상세 (권한 toggle + 멤버십 관리)
// ADMIN_PERMISSION_SEPARATION v1.2 § 9.1. 가드는 부모 super/layout.tsx.

import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getSqlBase } from "@/lib/db";
import { loadAdminUser } from "@/lib/admin/super-admin-context";
import { AdminUserControls } from "@/components/admin/super/AdminUserControls";
import {
  MembershipManager,
  type AssignableInstance,
  type MembershipView,
} from "@/components/admin/super/MembershipManager";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type UserDetail = {
  id: string;
  email: string;
  display_name: string;
  active: boolean;
  is_super_admin: boolean;
  legal_reviewer_eligible: boolean;
  physician_reviewer_eligible: boolean;
  client_approver_eligible: boolean;
  last_login_at: Date | null;
  created_at: Date;
};

type MembershipRow = { id: string; role: string; instance_slug: string; instance_name: string };

export default async function SuperUserDetailPage({ params }: { params: { id: string } }) {
  if (!UUID_RE.test(params.id)) notFound();

  const acting = await loadAdminUser();
  if (acting.kind !== "ok") redirect("/admin");

  const sql = getSqlBase();
  const [userRows, membershipRows, instanceRows] = await Promise.all([
    sql<UserDetail[]>`
      SELECT id, email, display_name, active, is_super_admin,
             legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible,
             last_login_at, created_at
        FROM admin_user WHERE id = ${params.id}::uuid LIMIT 1
    `,
    sql<MembershipRow[]>`
      SELECT im.id, im.role, i.slug AS instance_slug, i.display_name AS instance_name
        FROM instance_membership im
        JOIN instance i ON i.id = im.instance_id
       WHERE im.user_id = ${params.id}::uuid AND im.active = true
       ORDER BY i.display_name
    `,
    sql<{ id: string; slug: string; display_name: string }[]>`
      SELECT id, slug, display_name FROM instance WHERE active = true ORDER BY display_name
    `,
  ]);

  if (userRows.length === 0) notFound();
  const user = userRows[0]!;
  const isSelf = acting.userId === user.id;

  const memberships: MembershipView[] = membershipRows.map((m) => ({
    id: m.id,
    role: m.role,
    instanceSlug: m.instance_slug,
    instanceName: m.instance_name,
  }));
  const instances: AssignableInstance[] = instanceRows.map((i) => ({
    id: i.id,
    slug: i.slug,
    displayName: i.display_name,
  }));

  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <Link href="/admin/super/users" className="text-xs text-brand-primary hover:underline">
          ← 사용자 관리
        </Link>
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-semibold text-fg-default">{user.display_name}</h1>
          {isSelf && <span className="text-xs text-fg-muted">(본인)</span>}
        </div>
        <p className="text-sm text-fg-muted">{user.email}</p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminUserControls
          userId={user.id}
          isSelf={isSelf}
          active={user.active}
          isSuperAdmin={user.is_super_admin}
          legalReviewerEligible={user.legal_reviewer_eligible}
          physicianReviewerEligible={user.physician_reviewer_eligible}
          clientApproverEligible={user.client_approver_eligible}
        />
        <MembershipManager userId={user.id} memberships={memberships} instances={instances} />
      </div>
    </main>
  );
}
