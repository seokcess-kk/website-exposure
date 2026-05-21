// @glitzy/web/lib/admin/improvement-queue — CONTENT_IMPROVEMENT_QUEUE_PLAN v0.2 Phase 4
//
// seo_readiness_snapshot 의 fail/warn check 결과를 카테고리별 view 로 합침.
// DB 변경 없음 — 단일 SQL polymorphic JOIN + TS 분류 + zod 방어.

import type postgres from "postgres";
import { z } from "zod";

import type { SeoReadinessEntityType, SeoReadinessGrade } from "@glitzy/core-content";

// ============================================================================
// Types · category 매핑
// ============================================================================

export type ImprovementCategory =
  | "low-readiness"
  | "evidence-missing"
  | "seo-improve"
  | "stale"
  | "relations-thin";

const CHECK_TO_CATEGORY: Record<string, ImprovementCategory> = {
  "has-evidence-link": "evidence-missing",
  "has-author-doctor": "evidence-missing",
  "title-has-target-keyword": "seo-improve",
  "summary-length-ok": "seo-improve",
  "freshness-ok": "stale",
  "has-related-faq": "relations-thin",
  "internal-links-min": "relations-thin",
};

/**
 * § 2.2 매트릭스 — entity_type 별 category 적용 범위.
 * 같은 fail check 라도 evaluator 가 적용 안 한 entity 는 큐 안 표시 X.
 */
const CATEGORY_APPLICABILITY: Record<SeoReadinessEntityType, Set<ImprovementCategory>> = {
  Article: new Set(["low-readiness", "evidence-missing", "seo-improve", "stale", "relations-thin"]),
  TreatmentPage: new Set(["low-readiness", "evidence-missing", "seo-improve", "stale", "relations-thin"]),
  FAQ: new Set(["low-readiness", "stale"]), // simple evaluator — evidence/seo-improve/relations-thin 안 적용
  Publication: new Set(["stale"]),
  MediaAppearance: new Set(["stale"]),
  DoctorProfile: new Set(["stale"]),
  ClinicProfile: new Set(["stale"]),
};

function isApplicable(entityType: SeoReadinessEntityType, category: ImprovementCategory): boolean {
  return CATEGORY_APPLICABILITY[entityType]?.has(category) ?? false;
}

export type ImprovementQueueItem = {
  entityType: SeoReadinessEntityType;
  entityId: string;
  slug: string;
  title: string;
  status: string | null;
  score: number;
  grade: SeoReadinessGrade;
  failedChecks: Array<{ key: string; label: string; detail: string | null; status: "fail" | "warn" }>;
};

export type ImprovementQueueOverview = {
  lowReadiness: ImprovementQueueItem[];
  evidenceMissing: ImprovementQueueItem[];
  seoImprove: ImprovementQueueItem[];
  stale: ImprovementQueueItem[];
  relationsThin: ImprovementQueueItem[];
  totalImprovementItems: number;  // 카테고리 중복 포함
  affectedEntityCount: number;    // distinct entity
  healthyCount: number;            // grade A/B + published + checks pass
};

const EMPTY_OVERVIEW: ImprovementQueueOverview = {
  lowReadiness: [],
  evidenceMissing: [],
  seoImprove: [],
  stale: [],
  relationsThin: [],
  totalImprovementItems: 0,
  affectedEntityCount: 0,
  healthyCount: 0,
};

// ============================================================================
// checks jsonb shape guard — cycle 1 #6
// ============================================================================

const checkItemSchema = z.object({
  key: z.string(),
  label: z.string(),
  weight: z.number(),
  status: z.enum(["pass", "fail", "warn"]),
  detail: z.string().optional(),
});
const checksArraySchema = z.array(checkItemSchema);

// ============================================================================
// loadImprovementQueue — 단일 SQL polymorphic JOIN + TS 분류
// ============================================================================

type RawRow = {
  entity_type: SeoReadinessEntityType;
  entity_id: string;
  score: number;
  grade: SeoReadinessGrade;
  checks: unknown;
  slug: string | null;
  title: string | null;
  status: string | null;
};

export async function loadImprovementQueue(
  tx: postgres.TransactionSql,
  instanceId: string,
): Promise<ImprovementQueueOverview> {
  const rows: RawRow[] = await tx`
    SELECT
      s.entity_type, s.entity_id, s.score, s.grade, s.checks,
      COALESCE(a.slug, t.slug, f.slug, p.slug, m.slug, d.slug, cp.slug) AS slug,
      COALESCE(a.title, t.title, f.question, p.title, m.title, d.name, cp.name) AS title,
      CASE s.entity_type
        WHEN 'Article'         THEN a.status::text
        WHEN 'TreatmentPage'   THEN t.status::text
        WHEN 'FAQ'             THEN f.status::text
        WHEN 'Publication'     THEN p.status::text
        WHEN 'MediaAppearance' THEN m.status::text
        ELSE NULL
      END AS status
    FROM seo_readiness_snapshot s
    LEFT JOIN article a
      ON s.entity_type = 'Article' AND a.id = s.entity_id AND a.instance_id = s.instance_id
    LEFT JOIN treatment_page t
      ON s.entity_type = 'TreatmentPage' AND t.id = s.entity_id AND t.instance_id = s.instance_id
    LEFT JOIN faq f
      ON s.entity_type = 'FAQ' AND f.id = s.entity_id AND f.instance_id = s.instance_id
    LEFT JOIN publication p
      ON s.entity_type = 'Publication' AND p.id = s.entity_id AND p.instance_id = s.instance_id
    LEFT JOIN media_appearance m
      ON s.entity_type = 'MediaAppearance' AND m.id = s.entity_id AND m.instance_id = s.instance_id
    LEFT JOIN doctor_profile d
      ON s.entity_type = 'DoctorProfile' AND d.id = s.entity_id AND d.instance_id = s.instance_id
    LEFT JOIN clinic_profile cp
      ON s.entity_type = 'ClinicProfile' AND cp.id = s.entity_id AND cp.instance_id = s.instance_id
    WHERE s.instance_id = ${instanceId}::uuid
    ORDER BY s.score ASC, s.computed_at DESC
  `;

  if (rows.length === 0) return EMPTY_OVERVIEW;

  const buckets = {
    lowReadiness: [] as ImprovementQueueItem[],
    evidenceMissing: [] as ImprovementQueueItem[],
    seoImprove: [] as ImprovementQueueItem[],
    stale: [] as ImprovementQueueItem[],
    relationsThin: [] as ImprovementQueueItem[],
  };
  let healthyCount = 0;
  const affectedSet = new Set<string>();

  for (const row of rows) {
    // checks 파싱 + 방어 (cycle 1 #6)
    const parsed = checksArraySchema.safeParse(row.checks);
    if (!parsed.success) {
      // eslint-disable-next-line no-console
      console.warn(
        `[improvement-queue] invalid checks shape — skip ${row.entity_type}/${row.entity_id}`,
      );
      continue;
    }
    if (!row.slug || !row.title) {
      // entity row 가 사라졌거나 JOIN 누락 — skip
      continue;
    }
    const failedChecks = parsed.data.filter((c) => c.status !== "pass");

    // healthy 판정 (큐 외 별도 — cycle 1 #2)
    const eligiblePublishedEntity = (["Article", "TreatmentPage", "FAQ"] as SeoReadinessEntityType[])
      .includes(row.entity_type);
    const isPublished = row.status === "published";
    const isHealthy =
      eligiblePublishedEntity &&
      isPublished &&
      (row.grade === "A" || row.grade === "B") &&
      failedChecks.length === 0;
    if (isHealthy) healthyCount += 1;

    // failed 가 0건이면 (healthy 또는 published 아닌 entity) 큐 안 등장 안 함
    const isLowReadiness =
      eligiblePublishedEntity &&
      isPublished &&
      (row.grade === "C" || row.grade === "D" || row.grade === "F");
    if (failedChecks.length === 0 && !isLowReadiness) continue;

    // base item — failedChecks 는 카테고리별 filter 후 채움
    const baseItem: Omit<ImprovementQueueItem, "failedChecks"> = {
      entityType: row.entity_type,
      entityId: row.entity_id,
      slug: row.slug,
      title: row.title,
      status: row.status,
      score: row.score,
      grade: row.grade,
    };

    let pushedToAnyBucket = false;

    // low-readiness 별도 — score/grade/status 기반
    if (isLowReadiness && isApplicable(row.entity_type, "low-readiness")) {
      buckets.lowReadiness.push({
        ...baseItem,
        failedChecks: failedChecks.map((c) => ({
          key: c.key,
          label: c.label,
          detail: c.detail ?? null,
          status: c.status as "fail" | "warn",
        })),
      });
      pushedToAnyBucket = true;
    }

    // 카테고리별 분류 — failedChecks 를 group
    const byCategory: Partial<Record<ImprovementCategory, typeof failedChecks>> = {};
    for (const c of failedChecks) {
      const cat = CHECK_TO_CATEGORY[c.key];
      if (!cat) continue;
      if (!isApplicable(row.entity_type, cat)) continue;
      byCategory[cat] = byCategory[cat] ?? [];
      byCategory[cat]!.push(c);
    }
    for (const [cat, checks] of Object.entries(byCategory) as Array<
      [ImprovementCategory, typeof failedChecks]
    >) {
      const bucketKey: keyof typeof buckets = (() => {
        if (cat === "low-readiness") return "lowReadiness";
        if (cat === "evidence-missing") return "evidenceMissing";
        if (cat === "seo-improve") return "seoImprove";
        if (cat === "stale") return "stale";
        return "relationsThin";
      })();
      // low-readiness 는 위에서 이미 처리
      if (bucketKey === "lowReadiness") continue;
      buckets[bucketKey].push({
        ...baseItem,
        failedChecks: checks.map((c) => ({
          key: c.key,
          label: c.label,
          detail: c.detail ?? null,
          status: c.status as "fail" | "warn",
        })),
      });
      pushedToAnyBucket = true;
    }

    if (pushedToAnyBucket) {
      affectedSet.add(`${row.entity_type}:${row.entity_id}`);
    }
  }

  const totalImprovementItems =
    buckets.lowReadiness.length +
    buckets.evidenceMissing.length +
    buckets.seoImprove.length +
    buckets.stale.length +
    buckets.relationsThin.length;

  return {
    ...buckets,
    totalImprovementItems,
    affectedEntityCount: affectedSet.size,
    healthyCount,
  };
}
