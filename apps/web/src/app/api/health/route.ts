// @glitzy/web/api/health — DB ping + systemActorPresent (Plan v1.0 § 9 게이트 #8 ADMIN-UI-71)

import { NextResponse } from "next/server";
import { getSqlBase } from "@/lib/db";

const SYSTEM_ACTOR_ID = "00000000-0000-4000-8000-000000000001";

export async function GET(): Promise<NextResponse> {
  try {
    const sql = getSqlBase();
    await sql`SELECT 1`;
    const rows = await sql<{ exists: boolean }[]>`
      SELECT EXISTS(SELECT 1 FROM admin_user WHERE id = ${SYSTEM_ACTOR_ID}::uuid) AS exists
    `;
    const systemActorPresent = rows[0]?.exists === true;
    // cycle1-code WEB-15: systemActorPresent=false 면 seed precondition 실패 → 503
    if (!systemActorPresent) {
      // cycle3-code WEB-50: 한국어 메시지 + 루트 script 기준 사용법
      return NextResponse.json(
        {
          ok: false,
          systemActorPresent: false,
          error: "시스템 액터 미존재 — 먼저 `pnpm web:seed --email=… --display-name=… --instance-slug=… --instance-name=…` 실행",
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: true, systemActorPresent });
  } catch (err) {
    // cycle2-code WEB-33: 외부 응답에 DB connection string / role / SQL 상세 누설 방지
    console.error("[/api/health] DB error", err);
    // cycle3-3entity WEB-44: 한국어 generic 메시지
    return NextResponse.json({ ok: false, error: "내부 오류" }, { status: 500 });
  }
}
