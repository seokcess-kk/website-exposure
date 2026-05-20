// @glitzy/web/lib/public-tenant — withPublicTenantTransaction helper
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.1 PSR-DATA-03 + § 6 작업 #4
//
// 공개 사이트 SSR 단계의 instance lookup + RLS scope 설정.
// 흐름:
//   1. instance slug 조회 (RLS public_reader_instance_select policy USING active=true)
//   2. SELECT set_config('app.current_instance_id', <id>, true) — transaction-scoped
//   3. callback 실행 (content table SELECT 가 RLS 자동 적용)
//   4. return result

import type { Sql, TransactionSql } from "postgres";
import { cache } from "react";
import { getSqlPublic } from "./public-db";

export type PublicTenantContext = {
  readonly instanceId: string;
  readonly instanceSlug: string;
};

const resolvePublicTenantContext = cache(async (instanceSlug: string): Promise<PublicTenantContext | null> => {
  const sql: Sql = getSqlPublic();
  const rows = await sql<{ id: string }[]>`
    SELECT id FROM instance WHERE slug = ${instanceSlug} LIMIT 1
  `;
  if (rows.length === 0) return null;
  return { instanceId: rows[0]!.id, instanceSlug };
});

/**
 * 공개 사이트 SSR 단계의 instance lookup + transaction-scoped RLS scope 설정.
 *
 * @param instanceSlug — URL path 안 [instanceSlug] (URL slug 정규식 검증은 callback 진입 전 별도)
 * @param fn — instance scope 안 SELECT 콜백. tx 는 같은 connection 의 transaction sql tag.
 * @returns fn 결과. instance 미존재 / inactive 시 null
 */
export async function withPublicTenantTransaction<T>(
  instanceSlug: string,
  fn: (tx: TransactionSql, ctx: PublicTenantContext) => Promise<T>,
): Promise<T | null> {
  const sql: Sql = getSqlPublic();
  const ctx = await resolvePublicTenantContext(instanceSlug);
  if (!ctx) return null;

  // PSRC-03 patch: postgres-js begin() 안 callback 의 첫 인자 = TransactionSql.
  // null 도 fn 반환과 함께 union 으로 사용 가능하도록 generic 명시.
  return sql.begin<T | null>(async (tx: TransactionSql) => {
    // transaction-scoped instance scope
    await tx`SELECT set_config('app.current_instance_id', ${ctx.instanceId}, true)`;

    return fn(tx, ctx);
  }) as Promise<T | null>;
}
