// @glitzy/web/scripts/run-sql — psql 미설치 환경(Windows 등)에서 SQL 파일을 SEED_DATABASE_URL 로 실행하는 러너.
// 사용 예: pnpm --filter @glitzy/web run-sql apps/web/scripts/seed-demo-incheon-doctors.sql
//
// 동작:
//   - argv[2] 로 받은 SQL 파일 경로를 그대로 fs.readFile.
//   - SEED_DATABASE_URL 로 postgres.js 단일 접속 후 sql.unsafe(파일내용) 전체 한 번에 실행.
//   - psql \set ON_ERROR_STOP on 메타 명령은 무시 (postgres.js 는 메타 명령 미인식 — 한 줄 제거).
//   - RAISE NOTICE 출력을 stdout 으로 표시.

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";

async function main(): Promise<void> {
  const file = process.argv[2];
  if (!file) {
    console.error("usage: tsx scripts/run-sql.ts <path/to/file.sql>");
    process.exit(1);
  }
  const url = process.env.SEED_DATABASE_URL;
  if (!url) {
    console.error("SEED_DATABASE_URL 환경 변수 필요 (apps/web/.env 안 정의).");
    process.exit(1);
  }
  // pnpm filter 실행 시 cwd=apps/web. monorepo root 실행도 지원하기 위해 두 base 모두 시도.
  const candidates = [
    resolve(process.cwd(), file),
    resolve(process.cwd(), "..", "..", file),
    resolve(file),
  ];
  const absPath = candidates.find((p) => existsSync(p));
  if (!absPath) {
    console.error(`[run-sql] file not found. tried:\n${candidates.map((p) => `  - ${p}`).join("\n")}`);
    process.exit(1);
  }
  const raw = await readFile(absPath, "utf8");

  // psql 메타 명령(\set 등) 은 postgres.js 가 모르므로 제거.
  const sqlText = raw
    .split("\n")
    .filter((line) => !/^\s*\\\w/.test(line))
    .join("\n");

  const sql = postgres(url, {
    max: 1,
    onnotice: (n) => {
      const msg = typeof n === "string" ? n : n?.message ?? JSON.stringify(n);
      console.log(`[NOTICE] ${msg}`);
    },
  });
  try {
    console.log(`[run-sql] executing ${absPath}`);
    await sql.unsafe(sqlText);
    console.log("[run-sql] done.");
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error("[run-sql] failed:", err);
  process.exit(1);
});
