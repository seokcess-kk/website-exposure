// @glitzy/web/seed — operator + instance + membership bootstrap (Plan v1.0 § 7.1)
// cycle1-2-code:
//   - WEB-03 snake_case columns
//   - WEB-04 SEED_DATABASE_URL fallback 제거
//   - WEB-13 normalizeIdentifier
//   - WEB-20 instance_membership active/inactive 분기 lookup
//   - WEB-21 SYSTEM_ACTOR DO UPDATE (재실행 수렴)
//   - WEB-35 전체 bootstrap 단일 transaction

import postgres from "postgres";
import { normalizeIdentifier } from "@glitzy/auth";

import { slugSubdomainIssue } from "./lib/custom-domains";

const SYSTEM_ACTOR_ID = "00000000-0000-4000-8000-000000000001";

type Args = {
  email: string;
  displayName: string;
  instanceSlug: string;
  instanceName: string;
};

function parseArgs(argv: ReadonlyArray<string>): Args {
  const map = new Map<string, string>();
  for (const a of argv) {
    const m = a.match(/^--([^=]+)=(.*)$/);
    if (m) map.set(m[1]!, m[2]!);
  }
  const email = map.get("email");
  const displayName = map.get("display-name");
  const instanceSlug = map.get("instance-slug");
  const instanceName = map.get("instance-name");
  if (!email || !displayName || !instanceSlug || !instanceName) {
    console.error(
      "usage: pnpm --filter @glitzy/web seed --email=<email> --display-name=<name> --instance-slug=<slug> --instance-name=<name>",
    );
    process.exit(1);
  }
  // cycle4-code WEB-59: instanceSlug regex + displayName 길이 사전 검증 (한국어 메시지)
  if (!/^[a-z0-9][a-z0-9-]{2,63}$/.test(instanceSlug)) {
    console.error("[seed] instance-slug 형식 오류: 3~64자, 소문자/숫자/하이픈 (^[a-z0-9][a-z0-9-]{2,63}$)");
    process.exit(1);
  }
  // SUBDOMAIN_SCALE_PLAN SDS-04 — slug 는 서브도메인 라벨로 쓰임 (clone-instance 와 동일 검증)
  const subdomainIssue = slugSubdomainIssue(instanceSlug);
  if (subdomainIssue) {
    console.error(
      `[seed] instance-slug 서브도메인 규칙 위반 (${subdomainIssue}): 3~63자·끝 하이픈 금지·예약어(admin/api 등)·커스텀 도메인 매핑 선점 slug 불가`,
    );
    process.exit(1);
  }
  if (displayName.trim().length === 0 || displayName.length > 200) {
    console.error("[seed] display-name 길이 오류: 1~200자");
    process.exit(1);
  }
  if (instanceName.trim().length === 0 || instanceName.length > 200) {
    console.error("[seed] instance-name 길이 오류: 1~200자");
    process.exit(1);
  }
  return { email, displayName, instanceSlug, instanceName };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const url = process.env.SEED_DATABASE_URL;
  if (!url) {
    console.error("SEED_DATABASE_URL 환경 변수 필요 (WEB_DATABASE_URL fallback 미허용 — Plan § 7.1)");
    process.exit(1);
  }
  const normalizedEmail = normalizeIdentifier(args.email);
  const sql = postgres(url, { max: 1, onnotice: () => {} });

  try {
    // cycle2-code WEB-35: 전체 bootstrap 을 단일 transaction 으로 — partial state 회피
    // cycle3-code WEB-49: pg_advisory_xact_lock 으로 동시 seed 실행 직렬화
    // postgres library template parameter 는 number/string 만 — bigint 대신 정수 사용
    const SEED_LOCK_KEY = 1431655765; // arbitrary unique int for advisory lock
    const result = await sql.begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(${SEED_LOCK_KEY})`;
      // 1) system actor — cycle2-code WEB-21: DO UPDATE 로 재실행 수렴 보장
      await tx`
        INSERT INTO admin_user (
          id, email, display_name, active, is_super_admin,
          legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
        ) VALUES (
          ${SYSTEM_ACTOR_ID}::uuid, 'system@glitzy.internal', 'System', false, false,
          false, false, false
        )
        ON CONFLICT (id) DO UPDATE
          SET email = EXCLUDED.email,
              display_name = EXCLUDED.display_name,
              active = false,
              is_super_admin = false,
              legal_reviewer_eligible = false,
              physician_reviewer_eligible = false,
              client_approver_eligible = false
      `;

      // 2) instance upsert
      const instanceRows = await tx<{ id: string }[]>`
        INSERT INTO instance (slug, display_name, active)
          VALUES (${args.instanceSlug}, ${args.instanceName}, true)
        ON CONFLICT (slug) DO UPDATE
          SET display_name = EXCLUDED.display_name,
              active = true
        RETURNING id
      `;
      const iRow = instanceRows[0];
      if (!iRow) throw new Error("instance upsert returned no row");

      // 3) admin_user(operator) upsert — cycle4-code WEB-53: 모든 flag reset (재실행 결정성)
      const userRows = await tx<{ id: string }[]>`
        INSERT INTO admin_user (
          email, display_name, active, is_super_admin,
          legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
        ) VALUES (
          ${normalizedEmail}, ${args.displayName}, true, false,
          false, false, false
        )
        ON CONFLICT (email) DO UPDATE
          SET display_name = EXCLUDED.display_name,
              active = EXCLUDED.active,
              is_super_admin = EXCLUDED.is_super_admin,
              legal_reviewer_eligible = EXCLUDED.legal_reviewer_eligible,
              physician_reviewer_eligible = EXCLUDED.physician_reviewer_eligible,
              client_approver_eligible = EXCLUDED.client_approver_eligible,
              updated_at = now()
        RETURNING id
      `;
      const uRow = userRows[0];
      if (!uRow) throw new Error("admin_user upsert returned no row");

      // 4) instance_membership — cycle2-code WEB-20: active 우선 분기 lookup
      //    (a) active row 존재 → UPDATE role only
      //    (b) inactive row 만 존재 → reactivate (deactivated_* NULL 복귀 · WEB-87)
      //    (c) 없으면 INSERT
      await tx`
        WITH existing_active AS (
          SELECT id FROM instance_membership
           WHERE user_id = ${uRow.id}::uuid AND instance_id = ${iRow.id}::uuid AND active = true
           LIMIT 1
        ), existing_inactive AS (
          SELECT id FROM instance_membership
           WHERE user_id = ${uRow.id}::uuid AND instance_id = ${iRow.id}::uuid AND active = false
             AND NOT EXISTS (SELECT 1 FROM existing_active)
           LIMIT 1
        ), update_active AS (
          UPDATE instance_membership
             SET role = 'operator', updated_at = now()
           WHERE id = (SELECT id FROM existing_active)
           RETURNING id
        ), reactivate AS (
          UPDATE instance_membership
             SET role = 'operator',
                 active = true,
                 deactivated_at = NULL,
                 deactivated_by_user_id = NULL,
                 updated_at = now()
           WHERE id = (SELECT id FROM existing_inactive)
           RETURNING id
        ), insert_new AS (
          INSERT INTO instance_membership (user_id, instance_id, role, active)
          SELECT ${uRow.id}::uuid, ${iRow.id}::uuid, 'operator', true
           WHERE NOT EXISTS (SELECT 1 FROM existing_active)
             AND NOT EXISTS (SELECT 1 FROM existing_inactive)
           RETURNING id
        )
        SELECT id FROM update_active
        UNION ALL SELECT id FROM reactivate
        UNION ALL SELECT id FROM insert_new
      `;

      // 4.5) default `general` article_category — EAT_CONTENT v1.0 EC-SCHEMA-03 (cycle 1 ECP-09)
      //   instance 별 idempotent INSERT. C0013 staged migration 안 backfill 과 동일 row 보장.
      await tx`
        INSERT INTO article_category (instance_id, slug, name, display_order)
        VALUES (${iRow.id}::uuid, 'general', '일반', 0)
        ON CONFLICT (instance_id, slug) DO NOTHING
      `;

      // 5) seed audit — audit_event (audit_log 는 instance_id NOT NULL)
      await tx`
        INSERT INTO audit_event (event_type, actor_user_id, to_instance_id, payload)
        VALUES (
          'seed-completed',
          ${SYSTEM_ACTOR_ID}::uuid,
          ${iRow.id}::uuid,
          ${tx.json({ slug: args.instanceSlug, email: normalizedEmail, displayName: args.displayName })}::jsonb
        )
      `;

      return { instanceId: iRow.id, userId: uRow.id };
    });

    console.log(
      JSON.stringify(
        {
          ok: true,
          systemActorId: SYSTEM_ACTOR_ID,
          userId: result.userId,
          instanceId: result.instanceId,
          instanceSlug: args.instanceSlug,
          email: normalizedEmail,
          next: `NEW_ADMIN_PASSWORD='...' pnpm --filter @glitzy/web set-password --email=${normalizedEmail} 로 초기 비밀번호 설정 후 /sign-in 로그인`,
        },
        null,
        2,
      ),
    );
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error("[seed] failed", err);
  process.exit(1);
});
