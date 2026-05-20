// @glitzy/web/scripts/migrate-late — manifest 외 후속 마이그레이션 적용
//
// migrations-runner manifest v0.1 은 C0019/D0014 까지만 (EAT_CONTENT v1.0 시점).
// 그 이후 19개 (C0021~C0029 포함) 가 별도 적용 필요. dev 안 사용자가 manual 적용,
// production 안 본 script 로 일괄 적용.
//
// 사용:
//   pnpm --filter @glitzy/web migrate-late
//
// 향후: manifest.ts 에 19 entries 통합 권장 (LL-DEFER-20 본 구현 안).

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";

// manifest 외 누락 마이그레이션 (alphabetical 순서)
const LATE_MIGRATIONS: ReadonlyArray<string> = [
  "packages/core-content/migrations/C0021_phone_format_extend.sql",
  "packages/core-content/migrations/C0022_clinic_profile_brand_tokens.sql",
  "packages/core-content/migrations/C0023a_clinic_profile_release_split.sql",
  "packages/core-content/migrations/C0023b_location_profile_release_split.sql",
  "packages/core-content/migrations/C0023c_doctor_profile_release_split.sql",
  "packages/core-content/migrations/C0023d_treatment_page_release_split.sql",
  "packages/core-content/migrations/C0023e_article_release_split.sql",
  "packages/core-content/migrations/C0023f_faq_release_split.sql",
  "packages/core-content/migrations/C0023g_publication_release_split.sql",
  "packages/core-content/migrations/C0023h_media_appearance_release_split.sql",
  "packages/core-content/migrations/C0023i_legal_document_release_split.sql",
  "packages/core-content/migrations/C0023j_article_category_release_split.sql",
  "packages/core-content/migrations/C0024_instance_release_state.sql",
  "packages/core-content/migrations/C0025_faq_unlock_v0_1.sql",
  "packages/core-content/migrations/C0026_consultation_request.sql",
  "packages/core-content/migrations/C0027_consultation_request_title.sql",
  "packages/core-content/migrations/C0028_article_external_url.sql",
  "packages/core-content/migrations/C0029_treatment_page_pillar_slug.sql",
  "packages/core-content/migrations/C0030_doctor_profile_cv_photo_url.sql",
];

async function main(): Promise<void> {
  const url = process.env.SEED_DATABASE_URL;
  if (!url) {
    console.error("SEED_DATABASE_URL 환경 변수 필요.");
    process.exit(1);
  }

  const candidatesRoot = [resolve(process.cwd(), "..", ".."), resolve(process.cwd())];
  const monorepoRoot = candidatesRoot.find((p) =>
    existsSync(resolve(p, "packages/db/migrations/D0010_instance.sql")),
  );
  if (!monorepoRoot) {
    console.error("[migrate-late] monorepo root 추정 실패.");
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
    for (const file of LATE_MIGRATIONS) {
      const filePath = resolve(monorepoRoot, file);
      if (!existsSync(filePath)) {
        throw new Error(`migration file not found: ${file}`);
      }
      const sqlText = await readFile(filePath, "utf8");
      const clean = sqlText
        .split("\n")
        .filter((line) => !/^\s*\\\w/.test(line))
        .join("\n");

      const tag = `[${(applied + 1).toString().padStart(2, "0")}/${LATE_MIGRATIONS.length}]`;
      console.log(`${tag} ${file}`);
      await sql.unsafe(clean);
      applied += 1;
    }
    console.log(`[migrate-late] done — ${applied}/${LATE_MIGRATIONS.length} migrations applied.`);
  } catch (err) {
    console.error(`[migrate-late] failed at migration ${applied + 1}/${LATE_MIGRATIONS.length}:`, err);
    process.exitCode = 1;
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error("[migrate-late] unexpected error:", err);
  process.exit(1);
});
