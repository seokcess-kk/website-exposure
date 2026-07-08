// @glitzy/web/scripts/recompute-readiness — SEO readiness 스냅샷 전체 재계산 (CLI)
// 사용: pnpm --filter @glitzy/web exec tsx --env-file=.env scripts/recompute-readiness.ts --instance-slug=daeatdiet-incheon
//
// 어드민의 RecomputeReadinessButton 과 동일한 computeAllReadinessForInstance 를 SEED_DATABASE_URL
// (BYPASSRLS) 트랜잭션으로 실행한다 — 대량 데이터 정비(근거 링크·FAQ 발행 등) 직후 어드민 UI 를
// 거치지 않고 스냅샷을 즉시 갱신하기 위한 운영 도구.

import postgres from "postgres";

import { computeAllReadinessForInstance } from "../src/lib/seo-readiness";

async function main(): Promise<void> {
  const slugArg = process.argv.find((a) => a.startsWith("--instance-slug="));
  const slug = slugArg?.split("=")[1];
  if (!slug) {
    console.error("usage: tsx scripts/recompute-readiness.ts --instance-slug=<slug>");
    process.exit(1);
  }
  const url = process.env.SEED_DATABASE_URL;
  if (!url) {
    console.error("SEED_DATABASE_URL 환경 변수 필요 (apps/web/.env 안 정의).");
    process.exit(1);
  }
  const sql = postgres(url, { max: 1 });
  try {
    const rows = await sql`SELECT id FROM instance WHERE slug = ${slug} LIMIT 1`;
    if (rows.length === 0) {
      console.error(`[recompute-readiness] instance not found: ${slug}`);
      process.exit(1);
    }
    const instanceId = rows[0]!.id as string;
    const summary = await sql.begin(async (tx) =>
      computeAllReadinessForInstance(tx as unknown as postgres.TransactionSql, instanceId),
    );
    console.log(`[recompute-readiness] ${slug} 완료:`, JSON.stringify(summary));
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error("[recompute-readiness] failed:", err);
  process.exit(1);
});
