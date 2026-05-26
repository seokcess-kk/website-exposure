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

type LinkCountsBreakdown = {
  evidence: { publishedCount: number; draftCount: number };
  relatedFaq: { publishedCount: number; draftCount: number };
};

/**
 * source 의 link 들을 target table 별 status 와 JOIN 해서 published / draft 분리.
 * EVIDENCE_LINKING_PLAN v0.2 § 6.1 정합 — draft target 만 연결 시 readiness 가 warn 으로 동작.
 *
 * Implementation: target_type 별로 CASE 안 inline subquery (5종 모두 cover).
 * target row 가 삭제됐다면 target_is_published = NULL (counted as draft 로 처리 — 그래야 warn 시그널 유지).
 */
async function loadLinkCounts(
  tx: postgres.TransactionSql,
  instanceId: string,
  sourceType: string,
  sourceId: string,
): Promise<LinkCountsBreakdown> {
  const rows: Array<{
    evidence_published: string;
    evidence_draft: string;
    faq_published: string;
    faq_draft: string;
  }> = await tx`
    WITH link_with_status AS (
      SELECT
        cel.relation_type,
        cel.target_type,
        cel.target_id,
        CASE cel.target_type
          WHEN 'Publication' THEN
            (SELECT status::text FROM publication
              WHERE id = cel.target_id AND instance_id = cel.instance_id)
          WHEN 'MediaAppearance' THEN
            (SELECT status::text FROM media_appearance
              WHERE id = cel.target_id AND instance_id = cel.instance_id)
          WHEN 'FAQ' THEN
            (SELECT status::text FROM faq
              WHERE id = cel.target_id AND instance_id = cel.instance_id)
          WHEN 'TreatmentPage' THEN
            (SELECT status::text FROM treatment_page
              WHERE id = cel.target_id AND instance_id = cel.instance_id)
          WHEN 'Article' THEN
            (SELECT status::text FROM article
              WHERE id = cel.target_id AND instance_id = cel.instance_id)
          ELSE NULL
        END AS target_status
      FROM content_entity_link cel
      WHERE cel.instance_id = ${instanceId}::uuid
        AND cel.source_type = ${sourceType}
        AND cel.source_id = ${sourceId}::uuid
    )
    SELECT
      COUNT(*) FILTER (
        WHERE relation_type IN ('cites', 'derived-from') AND target_status = 'published'
      )::text AS evidence_published,
      COUNT(*) FILTER (
        WHERE relation_type IN ('cites', 'derived-from') AND (target_status IS NULL OR target_status <> 'published')
      )::text AS evidence_draft,
      COUNT(*) FILTER (
        WHERE relation_type = 'related-to' AND target_type = 'FAQ' AND target_status = 'published'
      )::text AS faq_published,
      COUNT(*) FILTER (
        WHERE relation_type = 'related-to' AND target_type = 'FAQ' AND (target_status IS NULL OR target_status <> 'published')
      )::text AS faq_draft
    FROM link_with_status
  `;
  const r = rows[0];
  return {
    evidence: {
      publishedCount: r ? Number(r.evidence_published) : 0,
      draftCount: r ? Number(r.evidence_draft) : 0,
    },
    relatedFaq: {
      publishedCount: r ? Number(r.faq_published) : 0,
      draftCount: r ? Number(r.faq_draft) : 0,
    },
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
      evidence: linkCounts.evidence,
      relatedFaq: linkCounts.relatedFaq,
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
      evidence: linkCounts.evidence,
      relatedFaq: linkCounts.relatedFaq,
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

// ============================================================================
// computeReadinessForEntity — 단일 entity 재계산 (EVIDENCE_LINKING_PLAN v0.2 § 6)
// ============================================================================
//   save / delete action 끝에 호출되어 link 변경 시 즉시 readiness 갱신.
//   entity_type 별 row fetch + evaluator → persist (cycle wrapper 와 유사하지만 단일 entity).
//   row 가 사라졌으면 (delete 후 호출 등) seo_readiness_snapshot 도 함께 정리.

// EXPOSURE_READINESS Phase B — MedicalConditionPage 합류 (readiness 계산은 별 cycle).
//   현 cycle 안 type compatibility 만 확보 — 실제 readiness 계산 로직 합류 시 entityType switch 안 case 추가 필요.
export type SingleEntityType =
  | "Article" | "TreatmentPage" | "MedicalConditionPage" | "FAQ"
  | "Publication" | "MediaAppearance" | "DoctorProfile" | "ClinicProfile";

export async function computeReadinessForEntity(
  tx: postgres.TransactionSql,
  instanceId: string,
  entityType: SingleEntityType,
  entityId: string,
): Promise<{ persisted: boolean }> {
  // EXPOSURE_READINESS Phase B — MedicalConditionPage 는 readiness 계산 미합류 (별 cycle).
  //   type compatibility 만 확보 — early return.
  if (entityType === "MedicalConditionPage") {
    return { persisted: false };
  }
  if (entityType === "Article") {
    const rows: Array<{
      id: string; title: string; summary: string | null; body_markdown: string;
      author_doctor_id: string | null; updated_at: Date;
    }> = await tx`
      SELECT id, title, summary, body_markdown, author_doctor_id, updated_at
        FROM article WHERE instance_id = ${instanceId}::uuid AND id = ${entityId}::uuid LIMIT 1
    `;
    if (rows.length === 0) {
      await deleteReadinessSnapshot(tx, instanceId, entityType, entityId);
      return { persisted: false };
    }
    const row = rows[0]!;
    const slug = await loadInstanceSlug(tx, instanceId);
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
      evidence: linkCounts.evidence,
      relatedFaq: linkCounts.relatedFaq,
      instanceSlug: slug,
    });
    await persistReadiness(tx, instanceId, buildResult("Article", row.id, checks));
    return { persisted: true };
  }

  if (entityType === "TreatmentPage") {
    const rows: Array<{
      id: string; title: string; summary: string | null; body_markdown: string | null;
      updated_at: Date; metadata: unknown;
    }> = await tx`
      SELECT id, title, summary, body_markdown, updated_at, metadata
        FROM treatment_page WHERE instance_id = ${instanceId}::uuid AND id = ${entityId}::uuid LIMIT 1
    `;
    if (rows.length === 0) {
      await deleteReadinessSnapshot(tx, instanceId, entityType, entityId);
      return { persisted: false };
    }
    const row = rows[0]!;
    const meta = (row.metadata as Record<string, unknown> | null) ?? {};
    const authorDoctorPresent = typeof meta.authorDoctorSlug === "string" && meta.authorDoctorSlug.length > 0;
    const slug = await loadInstanceSlug(tx, instanceId);
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
      evidence: linkCounts.evidence,
      relatedFaq: linkCounts.relatedFaq,
      instanceSlug: slug,
    });
    await persistReadiness(tx, instanceId, buildResult("TreatmentPage", row.id, checks));
    return { persisted: true };
  }

  // simple entities — summary/answer/description 만 + freshness
  const simpleRows = await loadSimpleEntityRow(tx, instanceId, entityType, entityId);
  if (simpleRows.length === 0) {
    await deleteReadinessSnapshot(tx, instanceId, entityType, entityId);
    return { persisted: false };
  }
  const row = simpleRows[0]!;
  const checks = evaluateSimple({
    entityType,
    row: { summary: row.summary_source, updatedAt: row.updated_at },
  });
  if (checks.length === 0) return { persisted: false };
  await persistReadiness(tx, instanceId, buildResult(entityType, row.id, checks));
  return { persisted: true };
}

async function loadSimpleEntityRow(
  tx: postgres.TransactionSql,
  instanceId: string,
  entityType: "FAQ" | "Publication" | "MediaAppearance" | "DoctorProfile" | "ClinicProfile",
  entityId: string,
): Promise<Array<{ id: string; summary_source: string | null; updated_at: Date }>> {
  switch (entityType) {
    case "FAQ":
      return tx`SELECT id, answer AS summary_source, updated_at
                  FROM faq WHERE instance_id = ${instanceId}::uuid AND id = ${entityId}::uuid LIMIT 1`;
    case "Publication":
      return tx`SELECT id, summary AS summary_source, updated_at
                  FROM publication WHERE instance_id = ${instanceId}::uuid AND id = ${entityId}::uuid LIMIT 1`;
    case "MediaAppearance":
      return tx`SELECT id, summary AS summary_source, updated_at
                  FROM media_appearance WHERE instance_id = ${instanceId}::uuid AND id = ${entityId}::uuid LIMIT 1`;
    case "DoctorProfile":
      return tx`SELECT id, bio AS summary_source, updated_at
                  FROM doctor_profile WHERE instance_id = ${instanceId}::uuid AND id = ${entityId}::uuid LIMIT 1`;
    case "ClinicProfile":
      return tx`SELECT id, description AS summary_source, updated_at
                  FROM clinic_profile WHERE instance_id = ${instanceId}::uuid AND id = ${entityId}::uuid LIMIT 1`;
  }
}

async function deleteReadinessSnapshot(
  tx: postgres.TransactionSql,
  instanceId: string,
  entityType: string,
  entityId: string,
): Promise<void> {
  await tx`
    DELETE FROM seo_readiness_snapshot
     WHERE instance_id = ${instanceId}::uuid
       AND entity_type = ${entityType}
       AND entity_id = ${entityId}::uuid
  `;
}

export type { ReadinessResult } from "./types";
export { buildResult, persistReadiness } from "./persist";
