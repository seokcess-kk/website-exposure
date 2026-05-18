// Spike E — test-drizzle-adapter-smoke (SPIKEE1-003·SPIKEE2-001 cycle3)
//   Auth.js DrizzleAdapter 호환성 smoke: createVerificationToken·useVerificationToken·createSession·getSessionAndUser·deleteSession 핵심 API
//
// LOCAL_SMOKE: next-auth/@auth/drizzle-adapter 실 import 시 npm 의존성 큼 → 본 spike는 schema shape만 검증.
// PROVIDER_GATE (Day 10 Vercel preview): 실 Auth.js + magic link callback round-trip 검증.

import postgres from "postgres";
import { env } from "../env.js";

async function main(): Promise<void> {
  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
  try {
    // Case 1: "session" table에 Auth.js DrizzleAdapter 필수 컬럼 존재
    // (sessionToken·userId·expires — Auth.js Drizzle adapter shape)
    const sessionCols = await sql<{ column_name: string; data_type: string }[]>`
      SELECT column_name, data_type FROM information_schema.columns
      WHERE table_schema='public' AND table_name='session'
    `;
    const sessionColNames = new Set(sessionCols.map((c) => c.column_name));
    for (const required of ["sessionToken", "userId", "expires"]) {
      if (!sessionColNames.has(required)) throw new Error(`session.${required} required by Auth.js DrizzleAdapter`);
    }
    console.log(`[adapter-smoke] case-1 session columns: ${[...sessionColNames].join(", ")} (PASS)`);

    // Case 2: "verificationToken" composite PK·필수 컬럼
    const vtCols = await sql<{ column_name: string }[]>`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema='public' AND table_name='verificationToken'
    `;
    const vtNames = new Set(vtCols.map((c) => c.column_name));
    for (const required of ["identifier", "token", "expires"]) {
      if (!vtNames.has(required)) throw new Error(`verificationToken.${required} required by Auth.js DrizzleAdapter`);
    }
    const pk = await sql<{ column_name: string }[]>`
      SELECT a.attname AS column_name
      FROM pg_index i
      JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
      JOIN pg_class c ON c.oid = i.indrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE i.indisprimary AND n.nspname='public' AND c.relname='verificationToken'
      ORDER BY a.attnum
    `;
    const pkCols = pk.map((r) => r.column_name).sort();
    if (pkCols.length !== 2 || pkCols[0] !== "identifier" || pkCols[1] !== "token") {
      throw new Error(`verificationToken PK must be (identifier, token), got (${pkCols.join(",")})`);
    }
    console.log(`[adapter-smoke] case-2 verificationToken PK = (identifier, token) (PASS)`);

    // Case 3: session.userId FK → admin_user.id (Auth.js user table 대체)
    // SPIKEE3-002 cycle4: column-specific FK (session."userId" → admin_user.id 정확히)
    const fkSpec = await sql<{ src_col: string; ref_table: string; ref_col: string }[]>`
      SELECT
        a.attname AS src_col,
        cl2.relname AS ref_table,
        a2.attname AS ref_col
      FROM pg_constraint con
      JOIN pg_class cl ON con.conrelid = cl.oid
      JOIN pg_class cl2 ON con.confrelid = cl2.oid
      JOIN pg_attribute a ON a.attrelid = cl.oid AND a.attnum = con.conkey[1]
      JOIN pg_attribute a2 ON a2.attrelid = cl2.oid AND a2.attnum = con.confkey[1]
      WHERE con.contype = 'f' AND cl.relname = 'session'
    `;
    // SPIKEE3-002 cycle5: session 테이블에 FK 정확히 1개·column-specific
    if (fkSpec.length !== 1) {
      throw new Error(`session must have exactly 1 FK, got ${fkSpec.length}: ${JSON.stringify(fkSpec)}`);
    }
    const fkOnly = fkSpec[0]!;
    if (fkOnly.src_col !== "userId" || fkOnly.ref_table !== "admin_user" || fkOnly.ref_col !== "id") {
      throw new Error(`session FK must be userId→admin_user.id, got ${JSON.stringify(fkOnly)}`);
    }
    console.log(`[adapter-smoke] case-3 session."userId" → admin_user.id (single exact FK, PASS)`);

    // Case 4: Spike E 확장 컬럼 (lastRefreshedAt·superAdminSelectedInstanceId) 존재
    for (const ext of ["lastRefreshedAt", "superAdminSelectedInstanceId"]) {
      if (!sessionColNames.has(ext)) throw new Error(`Spike E extension column session.${ext} missing`);
    }
    console.log(`[adapter-smoke] case-4 Spike E extension columns present (PASS)`);

    // Case 5: verificationToken.consumedAt 확장 (Spike E one-time consume)
    if (!vtNames.has("consumedAt")) throw new Error("verificationToken.consumedAt (Spike E extension) missing");
    console.log("[adapter-smoke] case-5 verificationToken.consumedAt extension (PASS)");

    console.log("\n✅ test-drizzle-adapter-smoke: 5 cases PASS (Auth.js DrizzleAdapter schema shape)");
    console.log("ℹ️  PROVIDER_GATE (Day 10): next-auth + @auth/drizzle-adapter 실 import + magic link callback round-trip 검증 필수");
  } finally { await sql.end({ timeout: 5 }); }
}

main().catch((err) => { console.error("[adapter-smoke] FAIL:", err); process.exit(1); });
