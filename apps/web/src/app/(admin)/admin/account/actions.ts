// @glitzy/web/(admin)/admin/account/actions — 로그인 사용자 본인 비밀번호 변경
// 현재 비밀번호 확인 후 새 비밀번호로 교체. loadAdminUser 로 호출자 확정 (세션 기반).

"use server";

import { verifyPassword, validatePasswordStrength, hashPassword, emitAuditEvent } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { loadAdminUser } from "@/lib/admin/super-admin-context";

export type ChangePasswordResult = { ok: true } | { ok: false; reason: string };

export async function changeMyPasswordAction(
  currentPassword: string,
  newPassword: string,
): Promise<ChangePasswordResult> {
  const u = await loadAdminUser();
  if (u.kind !== "ok") return { ok: false, reason: "세션이 만료되었습니다. 다시 로그인해 주세요." };

  const strength = validatePasswordStrength(newPassword);
  if (!strength.ok) return { ok: false, reason: strength.reason };

  const sql = getSqlBase();
  const rows = await sql<{ password_hash: string | null }[]>`
    SELECT password_hash FROM admin_user WHERE id = ${u.userId}::uuid LIMIT 1
  `;
  if (rows.length === 0) return { ok: false, reason: "계정을 찾을 수 없습니다." };

  const currentHash = rows[0]!.password_hash;
  const currentOk = currentHash ? await verifyPassword(currentPassword, currentHash) : false;
  if (!currentOk) return { ok: false, reason: "현재 비밀번호가 올바르지 않습니다." };

  const newHash = await hashPassword(newPassword);
  await sql`
    UPDATE admin_user
       SET password_hash = ${newHash}, password_updated_at = now(), updated_at = now()
     WHERE id = ${u.userId}::uuid
  `;
  await emitAuditEvent(sql, {
    eventType: "admin-user.password-changed-self",
    actorUserId: u.userId,
    targetUserId: u.userId,
  });
  return { ok: true };
}
