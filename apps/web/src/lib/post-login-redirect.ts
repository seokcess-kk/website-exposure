// @glitzy/web/lib/post-login-redirect — first active operator membership instance slug (Plan v1.0 § 3.2)
// cycle4·5 결정: sqlBase 직접 + audit_event emit (withServiceRole 미사용)
// session 발급 전 호출 (ADMIN-UI-76 — 무권한 유효 세션 발급 방지)

import type postgres from "postgres";
import { emitAuditEvent } from "@glitzy/auth";
import type { AdminUserId } from "@glitzy/shared-types";

export type PostLoginRedirectResult =
  | { kind: "resolved"; slug: string }
  | { kind: "missing" };

// cycle1-code WEB-14: emitAudit 옵션 — consume route 는 true, root page 는 false (false positive 방지)
export async function resolveFirstActiveMembershipSlug(
  sqlBase: postgres.Sql,
  userId: AdminUserId,
  options: { emitAudit: boolean },
): Promise<PostLoginRedirectResult> {
  const rows = await sqlBase<{ slug: string }[]>`
    SELECT i.slug
      FROM instance_membership m
      JOIN instance i ON i.id = m.instance_id
     WHERE m.user_id = ${userId}
       AND m.role = 'operator'
       AND m.active = true
       AND i.active = true
     ORDER BY m.created_at, m.id  -- cycle3-code WEB-45: stable tie-breaker
     LIMIT 1
  `;

  if (rows.length === 0) {
    if (options.emitAudit) {
      await emitAuditEvent(sqlBase, {
        eventType: "first-active-membership-missing",
        actorUserId: userId,
        targetUserId: userId,
        payload: { reason: "no-active-operator-membership" },
      });
    }
    return { kind: "missing" };
  }

  const slug = rows[0]!.slug;
  if (options.emitAudit) {
    await emitAuditEvent(sqlBase, {
      eventType: "first-active-membership-resolved",
      actorUserId: userId,
      targetUserId: userId,
      payload: { slug },
    });
  }
  return { kind: "resolved", slug };
}
