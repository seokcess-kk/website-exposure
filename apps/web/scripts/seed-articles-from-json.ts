// @glitzy/web/scripts/seed-articles-from-json — JSON 배열 → 발행 아티클 일괄 시드 (다발 발행 엔진)
//
// 사용: SEED_DATABASE_URL=<url> pnpm --filter @glitzy/web exec tsx scripts/seed-articles-from-json.ts <json파일> [instanceSlug=demo]
// JSON 형식: { result: { articles: [...] } } | { articles: [...] } | [...]
//   각 article: { slug, title, summary, bodyMarkdown, keywordLabel, keywordSlug, regionScope, intent }
// 패턴: saveArticle 즉시발행 동일 — sentinel compliance_record + status='published' + published_at + general 카테고리.
//   keyword_target(있으면) + keyword_content_link primary 매핑. 전부 ON CONFLICT → idempotent.

import { readFile } from "node:fs/promises";
import postgres from "postgres";

const SLUG_RE = /^[a-z0-9][a-z0-9-]{2,99}$/;
const KW_SLUG_RE = /^[a-z0-9가-힣][a-z0-9가-힣-]{1,63}$/;
const INTENTS = new Set(["informational", "comparison", "pre-booking", "local"]);

const AUTO_CHECK = JSON.stringify({
  automatedDecision: "pass", buildBlocked: false, gateRequired: false, hasWarnings: false,
  findingsBySeverity: { fail: 0, "content-gate": 0, warning: 0, info: 0 }, findings: [],
});
const SENTINEL_META = JSON.stringify({
  sentinel: true, manualReview: true, catalogVersion: "m0-stub-v0.1", exemptReason: "bulk info-article seed",
});

type Article = {
  slug: string; title: string; summary: string; bodyMarkdown: string;
  keywordLabel?: string | null; keywordSlug?: string | null; regionScope?: string | null; intent?: string | null;
};

async function main(): Promise<void> {
  const file = process.argv[2];
  const instanceSlug = process.argv[3] ?? "demo";
  if (!file) { console.error("usage: tsx scripts/seed-articles-from-json.ts <json> [instanceSlug]"); process.exit(1); }
  const url = process.env.SEED_DATABASE_URL;
  if (!url) { console.error("SEED_DATABASE_URL 환경변수 필요"); process.exit(1); }

  const parsed = JSON.parse(await readFile(file, "utf8")) as unknown;
  const articles: Article[] =
    (parsed as { result?: { articles?: Article[] } }).result?.articles ??
    (parsed as { articles?: Article[] }).articles ??
    (Array.isArray(parsed) ? (parsed as Article[]) : []);
  if (!articles.length) { console.error("articles 0건"); process.exit(1); }

  const sql = postgres(url, { max: 1, prepare: false });
  let seeded = 0;
  try {
    await sql.begin(async (tx) => {
      const instRows = await tx<{ id: string }[]>`SELECT id FROM instance WHERE slug = ${instanceSlug} LIMIT 1`;
      if (instRows.length === 0) throw new Error(`instance '${instanceSlug}' 없음`);
      const instanceId = instRows[0]!.id;
      await tx`SELECT set_config('app.current_instance_id', ${instanceId}, true)`;

      const catRows = await tx<{ id: string }[]>`SELECT id FROM article_category WHERE instance_id = ${instanceId}::uuid AND slug = 'general' LIMIT 1`;
      if (catRows.length === 0) throw new Error("general 카테고리 없음");
      const categoryId = catRows[0]!.id;

      const docRows = await tx<{ id: string }[]>`SELECT id FROM doctor_profile WHERE instance_id = ${instanceId}::uuid AND active = true ORDER BY display_order ASC, id ASC LIMIT 1`;
      const authorId = docRows[0]?.id ?? null;

      let userRows = await tx<{ id: string }[]>`SELECT user_id AS id FROM instance_membership WHERE instance_id = ${instanceId}::uuid AND active = true LIMIT 1`;
      if (userRows.length === 0) userRows = await tx<{ id: string }[]>`SELECT id FROM admin_user ORDER BY created_at ASC LIMIT 1`;
      if (userRows.length === 0) throw new Error("admin_user 없음");
      const userId = userRows[0]!.id;

      for (const a of articles) {
        if (!SLUG_RE.test(a.slug)) { console.warn(`skip ${a.slug}: slug regex 위반`); continue; }
        if (a.summary.length < 80 || a.summary.length > 200) { console.warn(`skip ${a.slug}: summary ${a.summary.length}자 (80~200)`); continue; }
        if (a.title.length < 1 || a.title.length > 200) { console.warn(`skip ${a.slug}: title 길이`); continue; }

        const sentRows = await tx<{ id: string }[]>`
          INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level, auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by, record_phase, record_version, metadata)
          VALUES (${instanceId}::uuid, 'Article', ${a.slug}, 'Low', ${AUTO_CHECK}::jsonb, ${userId}::uuid, NOW(), NOW(), ${userId}::uuid, 'published', 1, ${SENTINEL_META}::jsonb)
          ON CONFLICT (instance_id, content_type, content_ref, record_version) DO UPDATE SET updated_at = NOW()
          RETURNING id`;
        const sentinelId = sentRows[0]!.id;

        const artRows = await tx<{ id: string }[]>`
          INSERT INTO article (instance_id, slug, title, summary, body_markdown, status, risk_level, author_doctor_id, category_id, compliance_record_id, published_at)
          VALUES (${instanceId}::uuid, ${a.slug}, ${a.title}, ${a.summary}, ${a.bodyMarkdown}, 'published', 'Low', ${authorId}::uuid, ${categoryId}::uuid, ${sentinelId}::uuid, NOW())
          ON CONFLICT (instance_id, slug) DO UPDATE SET
            title = EXCLUDED.title, summary = EXCLUDED.summary, body_markdown = EXCLUDED.body_markdown,
            status = 'published', risk_level = 'Low', author_doctor_id = EXCLUDED.author_doctor_id,
            category_id = EXCLUDED.category_id, compliance_record_id = EXCLUDED.compliance_record_id,
            published_at = COALESCE(article.published_at, NOW()), updated_at = NOW()
          RETURNING id`;
        const articleId = artRows[0]!.id;

        if (a.keywordLabel && a.keywordSlug && KW_SLUG_RE.test(a.keywordSlug) && a.keywordLabel.length <= 100) {
          const intent = a.intent && INTENTS.has(a.intent) ? a.intent : "informational";
          const kwRows = await tx<{ id: string }[]>`
            INSERT INTO keyword_target (instance_id, slug, label, keyword_type, intent, priority, region_scope, status)
            VALUES (${instanceId}::uuid, ${a.keywordSlug}, ${a.keywordLabel}, 'primary', ${intent}, 'P1', ${a.regionScope ?? null}, 'active')
            ON CONFLICT (instance_id, slug) DO UPDATE SET label = EXCLUDED.label, intent = EXCLUDED.intent, region_scope = EXCLUDED.region_scope, status = 'active', updated_at = NOW()
            RETURNING id`;
          await tx`
            INSERT INTO keyword_content_link (instance_id, keyword_id, entity_type, entity_id, relevance_score, is_primary)
            VALUES (${instanceId}::uuid, ${kwRows[0]!.id}::uuid, 'Article', ${articleId}::uuid, 80, true)
            ON CONFLICT (instance_id, keyword_id, entity_type, entity_id) DO UPDATE SET is_primary = true, relevance_score = 80, updated_at = NOW()`;
        }
        seeded++;
        console.log(`✓ ${a.slug} — ${a.title}`);
      }
    });
    console.log(`\n총 ${seeded}/${articles.length}편 발행 완료 (instance=${instanceSlug})`);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => { console.error("[seed-articles] 실패:", err); process.exit(1); });
