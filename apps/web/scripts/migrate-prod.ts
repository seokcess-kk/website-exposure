// @glitzy/web/scripts/migrate-prod — production DB 안 manifest 순서대로 마이그레이션 sequential apply
//
// 사용:
//   $env:SEED_DATABASE_URL = "postgres://postgres.xxxxx:[pw]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"
//   pnpm --filter @glitzy/web exec tsx scripts/migrate-prod.ts
//
// 동작:
//   - @glitzy/migrations-runner 의 orderedMigrations (manifest v0.1) 를 import
//   - 각 SQL 파일을 monorepo root 기준 경로로 읽고 postgres.js sql.unsafe 로 실행
//   - SSL: require (Supabase pooler 강제)
//   - RAISE NOTICE 는 stdout 출력
//   - fail-fast — 첫 에러 발생 시 중단

import { orderedMigrations } from "@glitzy/migrations-runner";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";

async function main(): Promise<void> {
  const url = process.env.SEED_DATABASE_URL;
  if (!url) {
    console.error("SEED_DATABASE_URL 환경 변수 필요 (Supabase pooler URI · 6543 transaction mode).");
    process.exit(1);
  }

  // monorepo root 추정 (apps/web 또는 root 어디서 실행해도 동작)
  const candidatesRoot = [
    resolve(process.cwd(), "..", ".."),  // apps/web 안 실행 시
    resolve(process.cwd()),                // monorepo root 안 실행 시
  ];
  const monorepoRoot = candidatesRoot.find((p) =>
    existsSync(resolve(p, "packages/db/migrations/D0010_instance.sql")),
  );
  if (!monorepoRoot) {
    console.error("[migrate-prod] monorepo root 추정 실패 — packages/db/migrations 존재하는 디렉토리에서 실행하세요.");
    process.exit(1);
  }

  const sql = postgres(url, {
    max: 1,
    ssl: "require",
    onnotice: (n) => {
      const msg = typeof n === "string" ? n : (n as { message?: string })?.message ?? JSON.stringify(n);
      console.log(`[NOTICE] ${msg}`);
    },
  });

  let applied = 0;
  try {
    for (const m of orderedMigrations) {
      const filePath = resolve(monorepoRoot, m.file);
      if (!existsSync(filePath)) {
        throw new Error(`migration file not found: ${m.file}`);
      }
      const sqlText = await readFile(filePath, "utf8");
      // psql 메타 명령 제거 (postgres.js 미인식)
      const clean = sqlText
        .split("\n")
        .filter((line) => !/^\s*\\\w/.test(line))
        .join("\n");

      const tag = `[${(applied + 1).toString().padStart(2, "0")}/${orderedMigrations.length}]`;
      console.log(`${tag} ${m.file}`);
      await sql.unsafe(clean);
      applied += 1;
    }
    console.log(`[migrate-prod] done — ${applied}/${orderedMigrations.length} migrations applied.`);
  } catch (err) {
    console.error(`[migrate-prod] failed at migration ${applied + 1}/${orderedMigrations.length}:`, err);
    process.exitCode = 1;
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error("[migrate-prod] unexpected error:", err);
  process.exit(1);
});
