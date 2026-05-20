// @glitzy/web/lib/slug-resolver — slug → instanceId lookup (Plan v1.0 § 5.2)
// cycle4·8 결정: sqlBase 직접 SELECT + audit_event emit (withServiceRole 미사용)
// cycle3-code WEB-44·51: audit best-effort + slug regex 사전 검증

import type postgres from "postgres";
import { emitAuditEvent } from "@glitzy/auth";
import { asUuidV4, type AdminUserId, type InstanceId } from "@glitzy/shared-types";

// D0010_instance.sql instance_slug_regex 정합 — 3~64자
const INSTANCE_SLUG_REGEX = /^[a-z0-9][a-z0-9-]{2,63}$/;

async function emitBestEffort(sqlBase: postgres.Sql, input: Parameters<typeof emitAuditEvent>[1]): Promise<void> {
  try {
    await emitAuditEvent(sqlBase, input);
  } catch (err) {
    console.error("[slug-resolver] audit emit failed", err);
  }
}

export async function slugResolver(
  sqlBase: postgres.Sql,
  slug: string,
  actorUserId?: AdminUserId,
): Promise<InstanceId | null> {
  // cycle3-code WEB-51: slug 길이/형식 사전 검증 — bloat / 불필요 lookup 방지
  if (!INSTANCE_SLUG_REGEX.test(slug)) {
    await emitBestEffort(sqlBase, {
      eventType: "slug-lookup-not-found",
      ...(actorUserId ? { actorUserId } : {}),
      reason: "invalid-slug-format",
      payload: { slugSample: slug.slice(0, 64) },
    });
    return null;
  }
  const rows = await sqlBase<{ id: string }[]>`
    SELECT id FROM instance WHERE slug = ${slug} AND active = true LIMIT 1
  `;
  if (rows.length === 0) {
    await emitBestEffort(sqlBase, {
      eventType: "slug-lookup-not-found",
      ...(actorUserId ? { actorUserId } : {}),
      reason: "instance-slug-not-found-or-inactive",
      payload: { slug },
    });
    return null;
  }
  return asUuidV4(rows[0]!.id) as InstanceId;
}
