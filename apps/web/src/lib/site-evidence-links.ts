// @glitzy/web/lib/site-evidence-links — EVIDENCE_LINKING_PLAN v0.2 Phase A § 7·8
//
// 공개 사이트 SSR 안 source entity (Article/TreatmentPage) 의 content_entity_link 를
// target 별 JOIN 으로 readonly published-only fetch. orphan link 는 자동 필터.
//
// 호출 위치: insights/[category]/[slug]/page.tsx · treatments/[slug]/page.tsx 의 loadXxxDetail 안.

import type postgres from "postgres";

import type { SeoLinkRelationType, SeoLinkSourceType } from "@glitzy/core-content";

import type { EvidenceCardItem } from "@/components/site/EvidenceCard";

export type SiteEvidenceLinks = {
  cites: EvidenceCardItem[];        // Publication + MediaAppearance
  derivedFrom: EvidenceCardItem[];  // Publication only
  related: EvidenceCardItem[];      // Article + TreatmentPage (FAQ 분리)
  relatedFaqs: EvidenceCardItem[];  // FAQ only (별도 mini list 노출용)
};

const EMPTY: SiteEvidenceLinks = { cites: [], derivedFrom: [], related: [], relatedFaqs: [] };

export async function loadSiteEvidenceLinks(
  tx: postgres.TransactionSql,
  sourceType: SeoLinkSourceType,
  sourceId: string,
): Promise<SiteEvidenceLinks> {
  // 단일 query 안에서 모든 target table LEFT JOIN — published filter 는 NULL 로 떨어지면 자동 제외.
  const rows = await tx<Array<{
    relation_type: SeoLinkRelationType;
    target_type: string;
    target_id: string;
    display_order: number;
    title: string | null;
    slug: string | null;
    sublabel: string | null;
    category_slug: string | null;
    external_url: string | null;
    published_date: string | null;
  }>>`
    SELECT
      cel.relation_type,
      cel.target_type,
      cel.target_id,
      cel.display_order,
      COALESCE(p.title, m.title, t.title, a.title, f.question) AS title,
      COALESCE(p.slug, m.slug, t.slug, a.slug, f.slug) AS slug,
      CASE cel.target_type
        WHEN 'Publication' THEN p.journal
        WHEN 'MediaAppearance' THEN m.channel_name
        WHEN 'TreatmentPage' THEN t.pillar_slug
        ELSE NULL
      END AS sublabel,
      ac.slug AS category_slug,
      CASE cel.target_type
        WHEN 'Publication' THEN p.url
        WHEN 'MediaAppearance' THEN m.url
        ELSE NULL
      END AS external_url,
      CASE cel.target_type
        WHEN 'Publication' THEN to_char(p.published_date, 'YYYY-MM-DD')
        WHEN 'MediaAppearance' THEN to_char(m.published_date, 'YYYY-MM-DD')
        ELSE NULL
      END AS published_date
    FROM content_entity_link cel
    LEFT JOIN publication p
      ON cel.target_type = 'Publication'
     AND p.id = cel.target_id
     AND p.instance_id = cel.instance_id
     AND p.status = 'published'
    LEFT JOIN media_appearance m
      ON cel.target_type = 'MediaAppearance'
     AND m.id = cel.target_id
     AND m.instance_id = cel.instance_id
     AND m.status = 'published'
    LEFT JOIN treatment_page t
      ON cel.target_type = 'TreatmentPage'
     AND t.id = cel.target_id
     AND t.instance_id = cel.instance_id
     AND t.status = 'published'
    LEFT JOIN article a
      ON cel.target_type = 'Article'
     AND a.id = cel.target_id
     AND a.instance_id = cel.instance_id
     AND a.status = 'published'
    LEFT JOIN article_category ac
      ON a.category_id = ac.id
     AND ac.instance_id = a.instance_id
    LEFT JOIN faq f
      ON cel.target_type = 'FAQ'
     AND f.id = cel.target_id
     AND f.instance_id = cel.instance_id
     AND f.status = 'published'
    WHERE cel.source_type = ${sourceType}
      AND cel.source_id = ${sourceId}::uuid
      AND COALESCE(p.id, m.id, t.id, a.id, f.id) IS NOT NULL
    ORDER BY cel.relation_type ASC, cel.display_order ASC
  `;

  if (rows.length === 0) return EMPTY;

  const cites: EvidenceCardItem[] = [];
  const derivedFrom: EvidenceCardItem[] = [];
  const related: EvidenceCardItem[] = [];
  const relatedFaqs: EvidenceCardItem[] = [];

  for (const r of rows) {
    if (!r.title || !r.slug) continue;
    const item: EvidenceCardItem = {
      targetType: r.target_type as EvidenceCardItem["targetType"],
      targetId: r.target_id,
      slug: r.slug,
      title: r.title,
      sublabel: r.sublabel,
      categorySlug: r.category_slug,
      externalUrl: r.external_url,
      publishedDate: r.published_date,
    };
    if (r.relation_type === "cites") cites.push(item);
    else if (r.relation_type === "derived-from") derivedFrom.push(item);
    else if (r.relation_type === "related-to") {
      if (r.target_type === "FAQ") relatedFaqs.push(item);
      else related.push(item);
    }
  }

  return { cites, derivedFrom, related, relatedFaqs };
}
