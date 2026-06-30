// @glitzy/web/lib/site-cluster-links — 렌더타임 자동 클러스터 교차링크 (INTERNAL_LINK_AUTOMATION v1)
//
// 책임: 공개 사이트 SSR 안에서 아티클 ↔ 시술(Pillar 클러스터) 의 내부 링크를
//   운영자의 수동 큐레이션(content_entity_link) 없이 taxonomy 로 자동 도출한다.
//
// 연결 신호 (union · dedup · 랭킹):
//   1) Cluster ↔ Pillar 브리지 (1차 · 결정적):
//        article_category.pillar  ==  treatment_page.pillar_slug
//        → KEYWORD_URL_MAPPING § 2.3 의 "cluster ↔ Pillar" 매핑을 기존 컬럼으로 인코딩.
//   2) 공유 keyword_content_link (2차 · 정밀):
//        같은 keyword_target 에 연결된 아티클·시술은 토픽상 연관.
//   둘 중 하나라도 매칭되면 후보. 공유 키워드 수 desc → 최신순 으로 랭킹.
//
// 안전: published-only · same-tenant (tx 의 RLS app.current_instance_id 컨텍스트) · graceful empty.
//   호출 위치: insights/[category]/[slug]/page.tsx · treatments/[slug]/page.tsx 의 loadXxxDetail 안 (단일 tx).

import type postgres from "postgres";

import { normalizeTreatment, type TreatmentPageRow, type TreatmentProjection } from "@/lib/db-projection";
import type { ArticleListCardItem } from "@/components/site/ArticleListCard";

/**
 * slug 기준 중복 제거 + 제외 목록 필터 + 상한. (순수 함수 — 단위 테스트 대상)
 *   - excludeSlugs: 이미 다른 섹션(수동 큐레이션 등)에 노출된 slug → 중복 노출 방지.
 *   - 입력 순서(=SQL 랭킹) 보존.
 */
export function dedupeBySlug<T extends { slug: string }>(
  items: ReadonlyArray<T>,
  excludeSlugs: Iterable<string>,
  limit: number,
): T[] {
  const exclude = new Set(excludeSlugs);
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    if (exclude.has(item.slug) || seen.has(item.slug)) continue;
    seen.add(item.slug);
    out.push(item);
    if (out.length >= limit) break;
  }
  return out;
}

/**
 * 아티클 → 토픽 연관 시술(Pillar 클러스터). TreatmentCard 그리드용 projection 반환.
 *
 * @param categoryPillar  아티클이 속한 article_category.pillar 값 (없으면 null → 1차 브리지 skip)
 * @param excludeSlugs    이미 "관련 콘텐츠"(evidence.related) 등에 노출된 시술 slug
 */
export async function loadRelatedTreatmentsForArticle(
  tx: postgres.TransactionSql,
  instanceId: string,
  args: {
    articleId: string;
    categoryPillar: string | null;
    excludeSlugs?: ReadonlyArray<string>;
    limit?: number;
  },
): Promise<TreatmentProjection[]> {
  const limit = args.limit ?? 3;
  const rows = await tx<TreatmentPageRow[]>`
    WITH shared AS (
      SELECT k2.entity_id AS treatment_id, COUNT(DISTINCT k2.keyword_id) AS shared_kw
        FROM keyword_content_link k1
        JOIN keyword_content_link k2
          ON k2.instance_id = k1.instance_id
         AND k2.keyword_id = k1.keyword_id
         AND k2.entity_type = 'TreatmentPage'
       WHERE k1.instance_id = ${instanceId}::uuid
         AND k1.entity_type = 'Article'
         AND k1.entity_id = ${args.articleId}::uuid
       GROUP BY k2.entity_id
    )
    SELECT t.slug, t.title, t.summary, t.body_markdown, t.hero_image_url,
           t.pillar_slug, t.metadata, t.published_at, t.updated_at
      FROM treatment_page t
      LEFT JOIN shared s ON s.treatment_id = t.id
     WHERE t.instance_id = ${instanceId}::uuid
       AND t.status = 'published'
       AND (
         -- pillar 클러스터: 해당 Pillar 의 Spoke(pillar_slug 매칭) + Pillar 페이지 자체(slug 매칭)
         (${args.categoryPillar}::text IS NOT NULL AND (t.pillar_slug = ${args.categoryPillar} OR t.slug = ${args.categoryPillar}))
         OR s.shared_kw IS NOT NULL
       )
     ORDER BY COALESCE(s.shared_kw, 0) DESC, t.published_at DESC NULLS LAST, t.slug ASC
     LIMIT ${limit + 6}
  `;
  return dedupeBySlug(rows.map(normalizeTreatment), args.excludeSlugs ?? [], limit);
}

/**
 * 시술 → 토픽 연관 아티클(같은 Pillar 클러스터의 칼럼). ArticleListCard 그리드용 item 반환.
 *
 * @param clusterKey    시술의 클러스터 키 = pillar_slug ?? slug (Spoke 면 자기 Pillar, Pillar 면 자기 slug).
 *                      article_category.pillar 와 매칭. 없으면 null → 1차 브리지 skip.
 * @param excludeSlugs  이미 "관련 콘텐츠"(evidence.related) 등에 노출된 아티클 slug
 */
export async function loadRelatedArticlesForTreatment(
  tx: postgres.TransactionSql,
  instanceId: string,
  args: {
    treatmentId: string;
    clusterKey: string | null;
    excludeSlugs?: ReadonlyArray<string>;
    limit?: number;
  },
): Promise<ArticleListCardItem[]> {
  const limit = args.limit ?? 3;
  const rows = await tx<Array<{
    slug: string;
    title: string;
    summary: string;
    hero_image_url: string | null;
    category_slug: string;
    category_name: string;
    author_name: string | null;
    published_at: Date | null;
    external_url: string | null;
  }>>`
    WITH shared AS (
      SELECT k2.entity_id AS article_id, COUNT(DISTINCT k2.keyword_id) AS shared_kw
        FROM keyword_content_link k1
        JOIN keyword_content_link k2
          ON k2.instance_id = k1.instance_id
         AND k2.keyword_id = k1.keyword_id
         AND k2.entity_type = 'Article'
       WHERE k1.instance_id = ${instanceId}::uuid
         AND k1.entity_type = 'TreatmentPage'
         AND k1.entity_id = ${args.treatmentId}::uuid
       GROUP BY k2.entity_id
    )
    SELECT a.slug, a.title, a.summary, a.hero_image_url, a.external_url,
           ac.slug AS category_slug, ac.name AS category_name,
           dp.name AS author_name, a.published_at
      FROM article a
      JOIN article_category ac
        ON a.category_id = ac.id AND a.instance_id = ac.instance_id
      LEFT JOIN doctor_profile dp
        ON a.author_doctor_id = dp.id AND a.instance_id = dp.instance_id
      LEFT JOIN shared s ON s.article_id = a.id
     WHERE a.instance_id = ${instanceId}::uuid
       AND a.status = 'published'
       AND (
         (${args.clusterKey}::text IS NOT NULL AND ac.pillar = ${args.clusterKey})
         OR s.shared_kw IS NOT NULL
       )
     ORDER BY COALESCE(s.shared_kw, 0) DESC, a.published_at DESC NULLS LAST, a.slug ASC
     LIMIT ${limit + 6}
  `;
  const items: ArticleListCardItem[] = rows.map((r) => ({
    slug: r.slug,
    headline: r.title,
    summary: r.summary,
    heroImageUrl: r.hero_image_url,
    categorySlug: r.category_slug,
    categoryName: r.category_name,
    publishedAt: r.published_at,
    authorName: r.author_name,
    externalUrl: r.external_url,
  }));
  return dedupeBySlug(items, args.excludeSlugs ?? [], limit);
}
