// @glitzy/web/(admin)/admin/super/instances/actions — 인스턴스 활성/비활성 toggle server action
// ADMIN_PERMISSION_SEPARATION v1.1 § 8.3.
//
// 비활성(active=false) 효과:
//   - 공개 사이트: slug-resolver(active=true) + RLS public_reader_instance_select → 404
//   - 어드민 /admin/[slug]/*: requirePageContext → slugResolver(active=true) → notFound()
//   - 재활성화는 /admin/super/instances (active 필터 없는 일람) 에서만 가능 → 락아웃 위험 없음
//
// 가드: layout 가드와 별개로 server action 자체 super-admin 재검증 (clone-actions 이중 가드 패턴).

"use server";

import { revalidatePath } from "next/cache";
import { emitAuditEvent } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { loadAdminUser } from "@/lib/admin/super-admin-context";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type SetInstanceActiveResult = { ok: true; slug: string } | { ok: false; reason: string };

export async function setInstanceActiveAction(
  instanceId: string,
  active: boolean,
): Promise<SetInstanceActiveResult> {
  const u = await loadAdminUser();
  if (u.kind !== "ok") {
    return { ok: false, reason: "세션이 만료되었습니다. 다시 로그인해 주세요." };
  }
  if (!u.isSuperAdmin) {
    return { ok: false, reason: "사이트 활성/비활성은 운영자(super-admin) 만 가능합니다." };
  }
  if (!UUID_RE.test(instanceId)) {
    return { ok: false, reason: "잘못된 사이트 식별자입니다." };
  }

  const sql = getSqlBase();
  const rows = await sql<{ slug: string }[]>`
    UPDATE instance
       SET active = ${active}, updated_at = now()
     WHERE id = ${instanceId}::uuid
    RETURNING slug
  `;
  if (rows.length === 0) {
    return { ok: false, reason: "사이트를 찾을 수 없습니다." };
  }
  const slug = rows[0]!.slug;

  await emitAuditEvent(sql, {
    eventType: active ? "instance.reactivated" : "instance.deactivated",
    actorUserId: u.userId,
    toInstanceId: instanceId,
    payload: { slug, active },
  });

  revalidatePath("/admin/super/instances");
  revalidatePath("/admin");
  return { ok: true, slug };
}
