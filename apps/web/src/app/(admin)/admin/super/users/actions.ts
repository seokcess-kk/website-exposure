// @glitzy/web/(admin)/admin/super/users/actions — admin_user · instance_membership 관리 server action
// ADMIN_PERMISSION_SEPARATION v1.2 § 9.
//
// 계정 생성 = admin_user row + 초기 비밀번호 지정 (super-admin 관리 · 이메일 인프라 불필요).
//   사용자는 /admin/account 에서 본인 비밀번호를 변경할 수 있고, 분실 시 super-admin 이 재설정한다.
// 모든 action 은 super-admin 자체 재검증 (layout 가드와 별개 · clone-actions 이중 가드 패턴).
// self-lockout 가드: 자기 자신의 super-admin/active 해제 차단 (§9.4).

"use server";

import { revalidatePath } from "next/cache";
import { AuthDeniedError, emitAuditEvent, normalizeIdentifier, hashPassword, validatePasswordStrength } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { loadAdminUser } from "@/lib/admin/super-admin-context";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ROLES = ["operator", "legal-reviewer", "physician-reviewer", "client-approver"] as const;
type Role = (typeof ROLES)[number];

// reviewer role → 필요한 admin_user eligibility 컬럼 (operator 는 없음)
const ROLE_ELIGIBILITY: Partial<Record<Role, string>> = {
  "legal-reviewer": "legal_reviewer_eligible",
  "physician-reviewer": "physician_reviewer_eligible",
  "client-approver": "client_approver_eligible",
};

const ELIGIBILITY_FIELDS = [
  "legal_reviewer_eligible",
  "physician_reviewer_eligible",
  "client_approver_eligible",
] as const;
type EligibilityField = (typeof ELIGIBILITY_FIELDS)[number];

export type ActionResult = { ok: true } | { ok: false; reason: string };
export type ActionResultWith<T> = ({ ok: true } & T) | { ok: false; reason: string };

/** super-admin 재검증 — 모든 action 공통 진입 가드. */
async function requireSuperAdmin(): Promise<{ ok: true; userId: string } | { ok: false; reason: string }> {
  const u = await loadAdminUser();
  if (u.kind !== "ok") return { ok: false, reason: "세션이 만료되었습니다. 다시 로그인해 주세요." };
  if (!u.isSuperAdmin) return { ok: false, reason: "사용자 관리는 운영자(super-admin) 만 가능합니다." };
  return { ok: true, userId: u.userId };
}

// === 1. admin_user 생성 (초대 = allowlist 등록) ===
export async function createAdminUserAction(
  email: string,
  displayName: string,
  initialPassword: string,
): Promise<ActionResultWith<{ userId: string }>> {
  const guard = await requireSuperAdmin();
  if (!guard.ok) return guard;

  let normalized: string;
  try {
    normalized = normalizeIdentifier(email);
  } catch (err) {
    if (err instanceof AuthDeniedError) return { ok: false, reason: "이메일 형식이 올바르지 않습니다." };
    throw err;
  }
  const name = displayName.trim();
  if (name.length < 1 || name.length > 200) {
    return { ok: false, reason: "표시 이름은 1~200자여야 합니다." };
  }
  const strength = validatePasswordStrength(initialPassword);
  if (!strength.ok) return { ok: false, reason: strength.reason };

  const passwordHash = await hashPassword(initialPassword);
  const sql = getSqlBase();
  const rows = await sql<{ id: string }[]>`
    INSERT INTO admin_user (email, display_name, active, password_hash, password_updated_at)
    VALUES (${normalized}, ${name}, true, ${passwordHash}, now())
    ON CONFLICT (email) DO NOTHING
    RETURNING id
  `;
  if (rows.length === 0) {
    return { ok: false, reason: `이미 등록된 이메일입니다: ${normalized}` };
  }
  const userId = rows[0]!.id;

  await emitAuditEvent(sql, {
    eventType: "admin-user.created",
    actorUserId: guard.userId,
    targetUserId: userId,
    payload: { email: normalized, displayName: name, hasPassword: true },
  });

  revalidatePath("/admin/super/users");
  return { ok: true, userId };
}

// === 1b. 비밀번호 재설정 (super-admin 이 대상 계정 비번을 새로 지정 — 현재 비번 불필요) ===
export async function setUserPasswordAction(userId: string, newPassword: string): Promise<ActionResult> {
  const guard = await requireSuperAdmin();
  if (!guard.ok) return guard;
  if (!UUID_RE.test(userId)) return { ok: false, reason: "잘못된 사용자 식별자입니다." };
  const strength = validatePasswordStrength(newPassword);
  if (!strength.ok) return { ok: false, reason: strength.reason };

  const passwordHash = await hashPassword(newPassword);
  const sql = getSqlBase();
  const rows = await sql<{ email: string }[]>`
    UPDATE admin_user
       SET password_hash = ${passwordHash}, password_updated_at = now(),
           failed_login_count = 0, locked_until = NULL, updated_at = now()
     WHERE id = ${userId}::uuid
    RETURNING email
  `;
  if (rows.length === 0) return { ok: false, reason: "사용자를 찾을 수 없습니다." };

  await emitAuditEvent(sql, {
    eventType: "admin-user.password-reset",
    actorUserId: guard.userId,
    targetUserId: userId,
    payload: { email: rows[0]!.email },
  });
  revalidatePath(`/admin/super/users/${userId}`);
  return { ok: true };
}

// === 2. super-admin flag toggle (자기 자신 해제 차단) ===
export async function setSuperAdminFlagAction(
  userId: string,
  isSuperAdmin: boolean,
): Promise<ActionResult> {
  const guard = await requireSuperAdmin();
  if (!guard.ok) return guard;
  if (!UUID_RE.test(userId)) return { ok: false, reason: "잘못된 사용자 식별자입니다." };
  if (userId === guard.userId && !isSuperAdmin) {
    return { ok: false, reason: "자기 자신의 super-admin 권한은 해제할 수 없습니다." };
  }

  const sql = getSqlBase();
  const rows = await sql<{ email: string }[]>`
    UPDATE admin_user SET is_super_admin = ${isSuperAdmin}, updated_at = now()
    WHERE id = ${userId}::uuid RETURNING email
  `;
  if (rows.length === 0) return { ok: false, reason: "사용자를 찾을 수 없습니다." };

  await emitAuditEvent(sql, {
    eventType: "admin-user.super-admin-changed",
    actorUserId: guard.userId,
    targetUserId: userId,
    payload: { email: rows[0]!.email, isSuperAdmin },
  });
  revalidatePath(`/admin/super/users/${userId}`);
  revalidatePath("/admin/super/users");
  return { ok: true };
}

// === 3. active toggle (자기 자신 비활성 차단) ===
export async function setAdminUserActiveAction(
  userId: string,
  active: boolean,
): Promise<ActionResult> {
  const guard = await requireSuperAdmin();
  if (!guard.ok) return guard;
  if (!UUID_RE.test(userId)) return { ok: false, reason: "잘못된 사용자 식별자입니다." };
  if (userId === guard.userId && !active) {
    return { ok: false, reason: "자기 자신의 계정은 비활성화할 수 없습니다." };
  }

  const sql = getSqlBase();
  const rows = await sql<{ email: string }[]>`
    UPDATE admin_user SET active = ${active}, updated_at = now()
    WHERE id = ${userId}::uuid RETURNING email
  `;
  if (rows.length === 0) return { ok: false, reason: "사용자를 찾을 수 없습니다." };

  await emitAuditEvent(sql, {
    eventType: "admin-user.active-changed",
    actorUserId: guard.userId,
    targetUserId: userId,
    payload: { email: rows[0]!.email, active },
  });
  revalidatePath(`/admin/super/users/${userId}`);
  revalidatePath("/admin/super/users");
  return { ok: true };
}

// === 4. eligibility flag toggle (검수 role 자격) ===
export async function setEligibilityAction(
  userId: string,
  field: string,
  value: boolean,
): Promise<ActionResult> {
  const guard = await requireSuperAdmin();
  if (!guard.ok) return guard;
  if (!UUID_RE.test(userId)) return { ok: false, reason: "잘못된 사용자 식별자입니다." };
  if (!ELIGIBILITY_FIELDS.includes(field as EligibilityField)) {
    return { ok: false, reason: "잘못된 자격 항목입니다." };
  }

  const sql = getSqlBase();
  // field 는 화이트리스트 검증 통과한 컬럼명만 — sql.unsafe 대신 분기로 injection 회피.
  const col = field as EligibilityField;
  const rows = await sql<{ email: string }[]>`
    UPDATE admin_user
       SET ${sql(col)} = ${value}, updated_at = now()
     WHERE id = ${userId}::uuid
    RETURNING email
  `;
  if (rows.length === 0) return { ok: false, reason: "사용자를 찾을 수 없습니다." };

  await emitAuditEvent(sql, {
    eventType: "admin-user.eligibility-changed",
    actorUserId: guard.userId,
    targetUserId: userId,
    payload: { email: rows[0]!.email, field: col, value },
  });
  revalidatePath(`/admin/super/users/${userId}`);
  return { ok: true };
}

// === 5. instance_membership 부여 ===
export async function addMembershipAction(
  userId: string,
  instanceId: string,
  role: string,
): Promise<ActionResult> {
  const guard = await requireSuperAdmin();
  if (!guard.ok) return guard;
  if (!UUID_RE.test(userId) || !UUID_RE.test(instanceId)) {
    return { ok: false, reason: "잘못된 식별자입니다." };
  }
  if (!ROLES.includes(role as Role)) return { ok: false, reason: "잘못된 역할입니다." };

  const sql = getSqlBase();

  // 대상 사용자 + eligibility 확인
  const userRows = await sql<Record<string, boolean>[]>`
    SELECT legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
      FROM admin_user WHERE id = ${userId}::uuid LIMIT 1
  `;
  if (userRows.length === 0) return { ok: false, reason: "사용자를 찾을 수 없습니다." };

  const eligField = ROLE_ELIGIBILITY[role as Role];
  if (eligField && userRows[0]![eligField] !== true) {
    return {
      ok: false,
      reason: "이 역할은 먼저 해당 검수 자격(eligibility) 을 부여해야 합니다.",
    };
  }

  // 활성 instance 인지 확인
  const instRows = await sql<{ slug: string }[]>`
    SELECT slug FROM instance WHERE id = ${instanceId}::uuid AND active = true LIMIT 1
  `;
  if (instRows.length === 0) return { ok: false, reason: "활성 상태의 사이트가 아닙니다." };

  // 이미 활성 멤버십이 있으면 차단 (partial unique 정합 — 사전 안내)
  const existing = await sql<{ id: string }[]>`
    SELECT id FROM instance_membership
     WHERE user_id = ${userId}::uuid AND instance_id = ${instanceId}::uuid AND active = true
     LIMIT 1
  `;
  if (existing.length > 0) {
    return { ok: false, reason: "이미 이 사이트의 활성 멤버입니다. 역할 변경은 취소 후 다시 부여하세요." };
  }

  await sql`
    INSERT INTO instance_membership (user_id, instance_id, role, active)
    VALUES (${userId}::uuid, ${instanceId}::uuid, ${role}, true)
  `;

  await emitAuditEvent(sql, {
    eventType: "membership.granted",
    actorUserId: guard.userId,
    targetUserId: userId,
    toInstanceId: instanceId,
    payload: { slug: instRows[0]!.slug, role },
  });
  revalidatePath(`/admin/super/users/${userId}`);
  return { ok: true };
}

// === 6. instance_membership 취소 (active=false + deactivated 일관성 CHECK 충족) ===
export async function revokeMembershipAction(membershipId: string): Promise<ActionResult> {
  const guard = await requireSuperAdmin();
  if (!guard.ok) return guard;
  if (!UUID_RE.test(membershipId)) return { ok: false, reason: "잘못된 멤버십 식별자입니다." };

  const sql = getSqlBase();
  const rows = await sql<{ user_id: string; instance_id: string; role: string }[]>`
    UPDATE instance_membership
       SET active = false, deactivated_at = now(), deactivated_by_user_id = ${guard.userId}::uuid, updated_at = now()
     WHERE id = ${membershipId}::uuid AND active = true
    RETURNING user_id, instance_id, role
  `;
  if (rows.length === 0) return { ok: false, reason: "활성 멤버십을 찾을 수 없습니다." };

  await emitAuditEvent(sql, {
    eventType: "membership.revoked",
    actorUserId: guard.userId,
    targetUserId: rows[0]!.user_id,
    toInstanceId: rows[0]!.instance_id,
    payload: { role: rows[0]!.role },
  });
  revalidatePath(`/admin/super/users/${rows[0]!.user_id}`);
  return { ok: true };
}
