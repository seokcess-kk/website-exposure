// @glitzy/web/lib/admin/visibility-overview — Phase 1 대시보드 6 카드 데이터 helper
// SEO_VISIBILITY_OPS_PLAN v0.2 § 4.2
//
// 호출자: /admin/[instanceSlug]/page.tsx (server component)
// 입력: tx (scoped) + instanceId
// 출력: 6 카드 + 부수 데이터 (top N 목록)

import type postgres from "postgres";

const STALE_DAYS = 30;

export type ListedItem = {
  entityType: string;
  entityId: string;
  slug: string;
  title: string;
  score?: number;
  grade?: string;
  daysOld?: number;
};

export type VisibilityOverview = {
  keywordCoverage: {
    totalKeywords: number;
    keywordsWithPrimary: number;
    wonCount: number;
    unlinkedTopKeywords: Array<{ id: string; slug: string; label: string }>;
  };
  averageReadiness: {
    score: number | null;
    grade: string | null;
    distribution: Record<"A" | "B" | "C" | "D" | "F", number>;
    sampleSize: number;
  };
  unlinkedEvidence: {
    count: number;
    items: ListedItem[]; // top 5
  };
  staleContent: {
    count: number;
    items: ListedItem[]; // top 5 oldest
  };
  jsonLdDefect: {
    count: number;
    items: ListedItem[]; // top 5
  };
  lowReadinessPublished: {
    count: number;
    items: ListedItem[]; // top 5 lowest score
  };
};

export async function loadVisibilityOverview(
  tx: postgres.TransactionSql,
  instanceId: string,
): Promise<VisibilityOverview> {
  const [
    keywordCounts,
    unlinkedKeywords,
    readinessAgg,
    readinessDist,
    unlinkedEvidenceCount,
    unlinkedEvidenceList,
    staleCount,
    staleList,
    jsonLdDefectCount,
    jsonLdDefectList,
    lowReadinessCount,
    lowReadinessList,
  ] = await Promise.all([
    // SEO_KEYWORD_STRATEGY_PLAN v0.2 § 9 — denominator 명확화
    //   분모: status='active' 만 (paused/dropped 제외, won 은 별도 footer count)
    //   분자: 위 분모 중 is_primary=true link 가 1건+ 인 키워드
    tx`
      SELECT
        (SELECT count(*) FROM keyword_target
          WHERE instance_id = ${instanceId}::uuid AND status = 'active')::text AS total,
        (SELECT count(DISTINCT kcl.keyword_id) FROM keyword_content_link kcl
          JOIN keyword_target kt
            ON kt.id = kcl.keyword_id AND kt.instance_id = kcl.instance_id
          WHERE kcl.instance_id = ${instanceId}::uuid
            AND kcl.is_primary = true
            AND kt.status = 'active')::text AS with_primary,
        (SELECT count(*) FROM keyword_target
          WHERE instance_id = ${instanceId}::uuid AND status = 'won')::text AS won_count
    ` as Promise<Array<{ total: string; with_primary: string; won_count: string }>>,
    tx`
      SELECT kt.id, kt.slug, kt.label
        FROM keyword_target kt
       WHERE kt.instance_id = ${instanceId}::uuid
         AND kt.status = 'active'
         AND NOT EXISTS (
           SELECT 1 FROM keyword_content_link kcl
            WHERE kcl.instance_id = kt.instance_id
              AND kcl.keyword_id = kt.id
              AND kcl.is_primary = true
         )
       ORDER BY kt.priority ASC, kt.created_at ASC
       LIMIT 3
    ` as Promise<Array<{ id: string; slug: string; label: string }>>,
    tx`
      SELECT AVG(score)::int AS avg_score
        FROM seo_readiness_snapshot
       WHERE instance_id = ${instanceId}::uuid
         AND entity_type IN ('Article', 'TreatmentPage', 'FAQ')
    ` as Promise<Array<{ avg_score: number | null }>>,
    tx`
      SELECT grade, count(*)::text AS n
        FROM seo_readiness_snapshot
       WHERE instance_id = ${instanceId}::uuid
         AND entity_type IN ('Article', 'TreatmentPage', 'FAQ')
       GROUP BY grade
    ` as Promise<Array<{ grade: "A" | "B" | "C" | "D" | "F"; n: string }>>,
    // EVIDENCE_LINKING_PLAN v0.2 § 4.1 #3 정합 — readiness `has-evidence-link` check 와 동일 기준
    // (link 만 본다. author 는 별도 `has-author-doctor` check). article + treatment 둘 다 cover.
    tx`
      SELECT count(*)::text AS n
        FROM (
          SELECT a.id FROM article a
           WHERE a.instance_id = ${instanceId}::uuid
             AND NOT EXISTS (
               SELECT 1 FROM content_entity_link cel
                WHERE cel.instance_id = a.instance_id
                  AND cel.source_type = 'Article'
                  AND cel.source_id = a.id
                  AND cel.relation_type IN ('cites', 'derived-from')
             )
          UNION ALL
          SELECT t.id FROM treatment_page t
           WHERE t.instance_id = ${instanceId}::uuid
             AND NOT EXISTS (
               SELECT 1 FROM content_entity_link cel
                WHERE cel.instance_id = t.instance_id
                  AND cel.source_type = 'TreatmentPage'
                  AND cel.source_id = t.id
                  AND cel.relation_type IN ('cites', 'derived-from')
             )
        ) sub
    ` as Promise<Array<{ n: string }>>,
    tx`
      SELECT entity_type, entity_id, slug, title FROM (
        SELECT 'Article' AS entity_type, a.id AS entity_id, a.slug, a.title, a.updated_at
          FROM article a
         WHERE a.instance_id = ${instanceId}::uuid
           AND NOT EXISTS (
             SELECT 1 FROM content_entity_link cel
              WHERE cel.instance_id = a.instance_id
                AND cel.source_type = 'Article'
                AND cel.source_id = a.id
                AND cel.relation_type IN ('cites', 'derived-from')
           )
        UNION ALL
        SELECT 'TreatmentPage', t.id, t.slug, t.title, t.updated_at
          FROM treatment_page t
         WHERE t.instance_id = ${instanceId}::uuid
           AND NOT EXISTS (
             SELECT 1 FROM content_entity_link cel
              WHERE cel.instance_id = t.instance_id
                AND cel.source_type = 'TreatmentPage'
                AND cel.source_id = t.id
                AND cel.relation_type IN ('cites', 'derived-from')
           )
      ) sub
      ORDER BY updated_at DESC
      LIMIT 5
    ` as Promise<Array<{ entity_type: string; entity_id: string; slug: string; title: string }>>,
    tx`
      SELECT count(*)::text AS n FROM (
        SELECT id FROM article
         WHERE instance_id = ${instanceId}::uuid AND status = 'published'
           AND updated_at < NOW() - INTERVAL '${tx.unsafe(String(STALE_DAYS))} days'
        UNION ALL
        SELECT id FROM treatment_page
         WHERE instance_id = ${instanceId}::uuid AND status = 'published'
           AND updated_at < NOW() - INTERVAL '${tx.unsafe(String(STALE_DAYS))} days'
        UNION ALL
        SELECT id FROM faq
         WHERE instance_id = ${instanceId}::uuid AND status = 'published'
           AND updated_at < NOW() - INTERVAL '${tx.unsafe(String(STALE_DAYS))} days'
      ) sub
    ` as Promise<Array<{ n: string }>>,
    tx`
      SELECT entity_type, entity_id, slug, title, days_old
        FROM (
          SELECT 'Article' AS entity_type, id AS entity_id, slug, title,
                 EXTRACT(EPOCH FROM (NOW() - updated_at))/86400 AS days_old, updated_at
            FROM article
           WHERE instance_id = ${instanceId}::uuid AND status = 'published'
             AND updated_at < NOW() - INTERVAL '${tx.unsafe(String(STALE_DAYS))} days'
          UNION ALL
          SELECT 'TreatmentPage', id, slug, title,
                 EXTRACT(EPOCH FROM (NOW() - updated_at))/86400, updated_at
            FROM treatment_page
           WHERE instance_id = ${instanceId}::uuid AND status = 'published'
             AND updated_at < NOW() - INTERVAL '${tx.unsafe(String(STALE_DAYS))} days'
          UNION ALL
          SELECT 'FAQ', id, slug, question AS title,
                 EXTRACT(EPOCH FROM (NOW() - updated_at))/86400, updated_at
            FROM faq
           WHERE instance_id = ${instanceId}::uuid AND status = 'published'
             AND updated_at < NOW() - INTERVAL '${tx.unsafe(String(STALE_DAYS))} days'
        ) sub
       ORDER BY updated_at ASC
       LIMIT 5
    ` as Promise<Array<{ entity_type: string; entity_id: string; slug: string; title: string; days_old: string }>>,
    tx`
      SELECT count(*)::text AS n
        FROM seo_readiness_snapshot
       WHERE instance_id = ${instanceId}::uuid
         AND blocking_issues @> '[{"severity":"high"}]'::jsonb
    ` as Promise<Array<{ n: string }>>,
    tx`
      SELECT s.entity_type, s.entity_id, s.score, s.grade,
             COALESCE(a.slug, t.slug, f.slug) AS slug,
             COALESCE(a.title, t.title, f.question) AS title
        FROM seo_readiness_snapshot s
        LEFT JOIN article a ON s.entity_type = 'Article' AND a.id = s.entity_id AND a.instance_id = s.instance_id
        LEFT JOIN treatment_page t ON s.entity_type = 'TreatmentPage' AND t.id = s.entity_id AND t.instance_id = s.instance_id
        LEFT JOIN faq f ON s.entity_type = 'FAQ' AND f.id = s.entity_id AND f.instance_id = s.instance_id
       WHERE s.instance_id = ${instanceId}::uuid
         AND s.blocking_issues @> '[{"severity":"high"}]'::jsonb
       LIMIT 5
    ` as Promise<Array<{ entity_type: string; entity_id: string; slug: string | null; title: string | null; score: number; grade: string }>>,
    tx`
      SELECT count(*)::text AS n
        FROM seo_readiness_snapshot s
        JOIN (
          SELECT 'Article' AS entity_type, id FROM article
            WHERE instance_id = ${instanceId}::uuid AND status = 'published'
          UNION ALL
          SELECT 'TreatmentPage', id FROM treatment_page
            WHERE instance_id = ${instanceId}::uuid AND status = 'published'
          UNION ALL
          SELECT 'FAQ', id FROM faq
            WHERE instance_id = ${instanceId}::uuid AND status = 'published'
        ) pub ON s.entity_type = pub.entity_type AND s.entity_id = pub.id
       WHERE s.instance_id = ${instanceId}::uuid
         AND s.grade IN ('C', 'D', 'F')
    ` as Promise<Array<{ n: string }>>,
    tx`
      SELECT s.entity_type, s.entity_id, s.score, s.grade,
             COALESCE(a.slug, t.slug, f.slug) AS slug,
             COALESCE(a.title, t.title, f.question) AS title
        FROM seo_readiness_snapshot s
        JOIN (
          SELECT 'Article' AS entity_type, id FROM article
            WHERE instance_id = ${instanceId}::uuid AND status = 'published'
          UNION ALL
          SELECT 'TreatmentPage', id FROM treatment_page
            WHERE instance_id = ${instanceId}::uuid AND status = 'published'
          UNION ALL
          SELECT 'FAQ', id FROM faq
            WHERE instance_id = ${instanceId}::uuid AND status = 'published'
        ) pub ON s.entity_type = pub.entity_type AND s.entity_id = pub.id
        LEFT JOIN article a ON s.entity_type = 'Article' AND a.id = s.entity_id AND a.instance_id = s.instance_id
        LEFT JOIN treatment_page t ON s.entity_type = 'TreatmentPage' AND t.id = s.entity_id AND t.instance_id = s.instance_id
        LEFT JOIN faq f ON s.entity_type = 'FAQ' AND f.id = s.entity_id AND f.instance_id = s.instance_id
       WHERE s.instance_id = ${instanceId}::uuid
         AND s.grade IN ('C', 'D', 'F')
       ORDER BY s.score ASC
       LIMIT 5
    ` as Promise<Array<{ entity_type: string; entity_id: string; slug: string | null; title: string | null; score: number; grade: string }>>,
  ]);

  const kc = keywordCounts[0];
  const ra = readinessAgg[0];

  const distribution: Record<"A" | "B" | "C" | "D" | "F", number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  for (const r of readinessDist) distribution[r.grade] = Number(r.n);
  const distSum = Object.values(distribution).reduce((a, b) => a + b, 0);
  const avgScore = ra?.avg_score ?? null;
  const avgGrade = avgScore === null ? null
    : avgScore >= 90 ? "A"
      : avgScore >= 75 ? "B"
        : avgScore >= 60 ? "C"
          : avgScore >= 40 ? "D" : "F";

  return {
    keywordCoverage: {
      totalKeywords: kc ? Number(kc.total) : 0,
      keywordsWithPrimary: kc ? Number(kc.with_primary) : 0,
      wonCount: kc ? Number(kc.won_count) : 0,
      unlinkedTopKeywords: unlinkedKeywords,
    },
    averageReadiness: {
      score: avgScore,
      grade: avgGrade,
      distribution,
      sampleSize: distSum,
    },
    unlinkedEvidence: {
      count: unlinkedEvidenceCount[0] ? Number(unlinkedEvidenceCount[0].n) : 0,
      items: unlinkedEvidenceList.map((r) => ({
        entityType: r.entity_type, entityId: r.entity_id, slug: r.slug, title: r.title,
      })),
    },
    staleContent: {
      count: staleCount[0] ? Number(staleCount[0].n) : 0,
      items: staleList.map((r) => ({
        entityType: r.entity_type, entityId: r.entity_id, slug: r.slug, title: r.title,
        daysOld: Math.round(Number(r.days_old)),
      })),
    },
    jsonLdDefect: {
      count: jsonLdDefectCount[0] ? Number(jsonLdDefectCount[0].n) : 0,
      items: jsonLdDefectList.map((r) => ({
        entityType: r.entity_type, entityId: r.entity_id,
        slug: r.slug ?? "(unknown)", title: r.title ?? "(제목 없음)",
        score: r.score, grade: r.grade,
      })),
    },
    lowReadinessPublished: {
      count: lowReadinessCount[0] ? Number(lowReadinessCount[0].n) : 0,
      items: lowReadinessList.map((r) => ({
        entityType: r.entity_type, entityId: r.entity_id,
        slug: r.slug ?? "(unknown)", title: r.title ?? "(제목 없음)",
        score: r.score, grade: r.grade,
      })),
    },
  };
}
