// @glitzy/web/lib/seo-readiness — public API (SEO_VISIBILITY_OPS_PLAN v0.2 § 3)
//
// computeAllReadinessForInstance: 한 instance 의 모든 readiness-applicable entity 를 평가 + UPSERT.
//   - tenant tx 안에서 호출 (RLS · same-instance)
//   - 모든 entity loop — 100+ entity 라도 Promise.all 없이 순차 (트랜잭션 안 일관성)
// computeReadinessForEntity: 단일 entity (Phase 3 작성 폼 cycle 합류 시 사용)
//
// data flow:
//   1. instance.slug 로드 (internal links check 용)
//   2. entity 별 row + 연관 데이터 (primary keywords · content_entity_link · author FK 등) query
//   3. evaluator 호출 → ReadinessCheck[]
//   4. buildResult → score · grade · recommendations 채움
//   5. persistReadiness UPSERT

import type postgres from "postgres";

import { evaluateArticle } from "./evaluators/article";
import { evaluateTreatment } from "./evaluators/treatment";
import { evaluateSimple } from "./evaluators/simple";
import { buildResult, persistReadiness } from "./persist";
import type { ReadinessResult } from "./types";

export type ComputeReadinessSummary = {
  total: number;
  byEntityType: Record<string, number>;
};

async function loadInstanceSlug(tx: postgres.TransactionSql, instanceId: string): Promise<string> {
  const rows: Array<{ slug: string }> = await tx`
    SELECT slug FROM instance WHERE id = ${instanceId}::uuid LIMIT 1
  `;
  if (rows.length === 0) throw new Error(`instance not found: ${instanceId}`);
  return rows[0]!.slug;
}

async function loadPrimaryKeywordLabels(
  tx: postgres.TransactionSql,
  instanceId: string,
  entityType: string,
  entityId: string,
): Promise<string[]> {
  const rows: Array<{ label: string }> = await tx`
    SELECT kt.label
      FROM keyword_content_link kcl
      JOIN keyword_target kt
        ON kt.id = kcl.keyword_id AND kt.instance_id = kcl.instance_id
     WHERE kcl.instance_id = ${instanceId}::uuid
       AND kcl.entity_type = ${entityType}
       AND kcl.entity_id = ${entityId}::uuid
       AND kcl.is_primary = true
  `;
  return rows.map((r) => r.label);
}

async function loadLinkCounts(
  tx: postgres.TransactionSql,
  instanceId: string,
  sourceType: string,
  sourceId: string,
): Promise<{ evidenceCount: number; relatedFaqCount: number }> {
  const rows: Array<{ evidence: string; faq: string }> = await tx`
    SELECT
      COUNT(*) FILTER (
        WHERE relation_type IN ('cites', 'derived-from')
      )::text AS evidence,
      COUNT(*) FILTER (
        WHERE relation_type = 'related-to' AND target_type = 'FAQ'
      )::text AS faq
    FROM content_entity_link
    WHERE instance_id = ${instanceId}::uuid
      AND source_type = ${sourceType}
      AND source_id = ${sourceId}::uuid
  `;
  const r = rows[0];
  return {
    evidenceCount: r ? Number(r.evidence) : 0,
    relatedFaqCount: r ? Number(r.faq) : 0,
  };
}

async function computeForArticles(
  tx: postgres.TransactionSql,
  instanceId: string,
  instanceSlug: string,
): Promise<number> {
  const rows: Array<{
    id: string; title: string; summary: string | null; body_markdown: string;
    author_doctor_id: string | null; updated_at: Date;
  }> = await tx`
    SELECT id, title, summary, body_markdown, author_doctor_id, updated_at
      FROM article WHERE instance_id = ${instanceId}::uuid
  `;
  let count = 0;
  for (const row of rows) {
    const [primaryKeywordLabels, linkCounts] = await Promise.all([
      loadPrimaryKeywordLabels(tx, instanceId, "Article", row.id),
      loadLinkCounts(tx, instanceId, "Article", row.id),
    ]);
    const checks = evaluateArticle({
      row: {
        title: row.title,
        summary: row.summary,
        bodyMarkdown: row.body_markdown,
        authorDoctorId: row.author_doctor_id,
        updatedAt: row.updated_at,
      },
      primaryKeywordLabels,
      evidenceCount: linkCounts.evidenceCount,
      relatedFaqCount: linkCounts.relatedFaqCount,
      instanceSlug,
    });
    await persistReadiness(tx, instanceId, buildResult("Article", row.id, checks));
    count += 1;
  }
  return count;
}

async function computeForTreatments(
  tx: postgres.TransactionSql,
  instanceId: string,
  instanceSlug: string,
): Promise<number> {
  const rows: Array<{
    id: string; title: string; summary: string | null; body_markdown: string | null;
    updated_at: Date; metadata: unknown;
  }> = await tx`
    SELECT id, title, summary, body_markdown, updated_at, metadata
      FROM treatment_page WHERE instance_id = ${instanceId}::uuid
  `;
  let count = 0;
  for (const row of rows) {
    // TreatmentPage 에 author_doctor_id FK 가 없음 — metadata.authorDoctorSlug 또는 content_entity_link 도입 전엔 metadata 만 확인
    const meta = (row.metadata as Record<string, unknown> | null) ?? {};
    const authorDoctorPresent = typeof meta.authorDoctorSlug === "string" && meta.authorDoctorSlug.length > 0;
    const [primaryKeywordLabels, linkCounts] = await Promise.all([
      loadPrimaryKeywordLabels(tx, instanceId, "TreatmentPage", row.id),
      loadLinkCounts(tx, instanceId, "TreatmentPage", row.id),
    ]);
    const checks = evaluateTreatment({
      row: {
        title: row.title,
        summary: row.summary,
        bodyMarkdown: row.body_markdown,
        authorDoctorPresent,
        updatedAt: row.updated_at,
      },
      primaryKeywordLabels,
      evidenceCount: linkCounts.evidenceCount,
      relatedFaqCount: linkCounts.relatedFaqCount,
      instanceSlug,
    });
    await persistReadiness(tx, instanceId, buildResult("TreatmentPage", row.id, checks));
    count += 1;
  }
  return count;
}

async function computeForSimpleEntity(
  tx: postgres.TransactionSql,
  instanceId: string,
  entityType: "FAQ" | "Publication" | "MediaAppearance" | "DoctorProfile" | "ClinicProfile",
): Promise<number> {
  // entity_type → table name + summary 컬럼 매핑
  const tableMap: Record<typeof entityType, { table: string; summaryCol: string }> = {
    FAQ: { table: "faq", summaryCol: "answer" },
    Publication: { table: "publication", summaryCol: "summary" },
    MediaAppearance: { table: "media_appearance", summaryCol: "summary" },
    DoctorProfile: { table: "doctor_profile", summaryCol: "bio" },
    ClinicProfile: { table: "clinic_profile", summaryCol: "description" },
  };
  const { table, summaryCol } = tableMap[entityType];
  // postgres-js 안 dynamic table/column 은 tx() 안 raw — 안전 위해 switch 분기 SQL 작성
  let rows: Array<{ id: string; summary_source: string | null; updated_at: Date }> = [];
  if (entityType === "FAQ") {
    rows = await tx`SELECT id, answer AS summary_source, updated_at FROM faq WHERE instance_id = ${instanceId}::uuid`;
  } else if (entityType === "Publication") {
    rows = await tx`SELECT id, summary AS summary_source, updated_at FROM publication WHERE instance_id = ${instanceId}::uuid`;
  } else if (entityType === "MediaAppearance") {
    rows = await tx`SELECT id, summary AS summary_source, updated_at FROM media_appearance WHERE instance_id = ${instanceId}::uuid`;
  } else if (entityType === "DoctorProfile") {
    rows = await tx`SELECT id, bio AS summary_source, updated_at FROM doctor_profile WHERE instance_id = ${instanceId}::uuid`;
  } else if (entityType === "ClinicProfile") {
    rows = await tx`SELECT id, description AS summary_source, updated_at FROM clinic_profile WHERE instance_id = ${instanceId}::uuid`;
  }
  // unused vars (kept for catalog clarity)
  void table; void summaryCol;

  let count = 0;
  for (const row of rows) {
    const checks = evaluateSimple({
      entityType,
      row: { summary: row.summary_source, updatedAt: row.updated_at },
    });
    if (checks.length === 0) continue;
    await persistReadiness(tx, instanceId, buildResult(entityType, row.id, checks));
    count += 1;
  }
  return count;
}

export async function computeAllReadinessForInstance(
  tx: postgres.TransactionSql,
  instanceId: string,
): Promise<ComputeReadinessSummary> {
  const slug = await loadInstanceSlug(tx, instanceId);
  const byEntityType: Record<string, number> = {};

  byEntityType.Article = await computeForArticles(tx, instanceId, slug);
  byEntityType.TreatmentPage = await computeForTreatments(tx, instanceId, slug);
  byEntityType.FAQ = await computeForSimpleEntity(tx, instanceId, "FAQ");
  byEntityType.Publication = await computeForSimpleEntity(tx, instanceId, "Publication");
  byEntityType.MediaAppearance = await computeForSimpleEntity(tx, instanceId, "MediaAppearance");
  byEntityType.DoctorProfile = await computeForSimpleEntity(tx, instanceId, "DoctorProfile");
  byEntityType.ClinicProfile = await computeForSimpleEntity(tx, instanceId, "ClinicProfile");

  const total = Object.values(byEntityType).reduce((a, b) => a + b, 0);
  return { total, byEntityType };
}

export type { ReadinessResult } from "./types";
export { buildResult, persistReadiness } from "./persist";
