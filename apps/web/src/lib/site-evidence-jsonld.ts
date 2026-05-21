// @glitzy/web/lib/site-evidence-jsonld — EVIDENCE_LINKING_PLAN v0.2 Phase B § 9·10
//
// JSON-LD enrichment 용 데이터 loader. site-evidence-links.ts 와 별도 — cards 는 슬림 projection 만
// 필요한 반면, JSON-LD 는 full Publication/MediaAppearance projection 필요 (DOI · authors · journal 등).
// 호출 위치: insights/[category]/[slug]/page.tsx · treatments/[slug]/page.tsx 의 loadXxxDetail 안.

import type postgres from "postgres";

import { normalizeMediaAppearance, normalizePublication } from "@/lib/db-projection";
import type {
  MediaAppearanceProjection,
  MediaAppearanceRow,
  PublicationProjection,
  PublicationRow,
} from "@/lib/db-projection";
import type { SeoLinkSourceType } from "@glitzy/core-content";

export type EvidencePublicationLink = {
  publication: PublicationProjection;
  relationType: "cites" | "derived-from";
};

export type EvidenceMediaLink = {
  media: MediaAppearanceProjection;
  relationType: "cites";
};

export type EvidenceMention = {
  targetType: "Article" | "TreatmentPage" | "FAQ";
  slug: string;
  title: string;
  /** Article 만 — JSON-LD mention 의 url 산정 시 카테고리 prefix 필요 */
  categorySlug?: string | null;
};

export type EvidenceForJsonLd = {
  publications: EvidencePublicationLink[];
  media: EvidenceMediaLink[];
  mentions: EvidenceMention[];
};

const EMPTY: EvidenceForJsonLd = { publications: [], media: [], mentions: [] };

export async function loadEvidenceForJsonLd(
  tx: postgres.TransactionSql,
  sourceType: SeoLinkSourceType,
  sourceId: string,
): Promise<EvidenceForJsonLd> {
  // Publication / MediaAppearance / 콘텐츠 entity (Article·TreatmentPage·FAQ) 세 갈래 — Promise.all 병렬
  const [pubRows, mediaRows, mentionRows] = await Promise.all([
    tx<Array<PublicationRow & { relation_type: "cites" | "derived-from" }>>`
      SELECT
        p.slug, p.title, p.authors, p.journal,
        to_char(p.published_date, 'YYYY-MM-DD') AS published_date,
        p.doi, p.pubmed_id, p.url, p.thumbnail_url, p.summary,
        p.author_doctor_id, p.published_at, p.updated_at,
        cel.relation_type
      FROM content_entity_link cel
      JOIN publication p
        ON cel.target_type = 'Publication'
       AND p.id = cel.target_id
       AND p.instance_id = cel.instance_id
       AND p.status = 'published'
      WHERE cel.source_type = ${sourceType}
        AND cel.source_id = ${sourceId}::uuid
        AND cel.relation_type IN ('cites', 'derived-from')
      ORDER BY cel.relation_type, cel.display_order ASC
    `,
    tx<Array<MediaAppearanceRow & { relation_type: "cites" }>>`
      SELECT
        m.slug, m.title, m.channel_name,
        m.channel_type::text AS channel_type,
        to_char(m.published_date, 'YYYY-MM-DD') AS published_date,
        m.duration_seconds, m.url, m.thumbnail_url, m.summary,
        m.author_doctor_id, m.published_at, m.updated_at,
        cel.relation_type
      FROM content_entity_link cel
      JOIN media_appearance m
        ON cel.target_type = 'MediaAppearance'
       AND m.id = cel.target_id
       AND m.instance_id = cel.instance_id
       AND m.status = 'published'
      WHERE cel.source_type = ${sourceType}
        AND cel.source_id = ${sourceId}::uuid
        AND cel.relation_type = 'cites'
      ORDER BY cel.display_order ASC
    `,
    tx<Array<{
      target_type: "Article" | "TreatmentPage" | "FAQ";
      slug: string;
      title: string;
      category_slug: string | null;
    }>>`
      SELECT 'Article' AS target_type, a.slug, a.title, ac.slug AS category_slug
        FROM content_entity_link cel
        JOIN article a
          ON cel.target_type = 'Article'
         AND a.id = cel.target_id
         AND a.instance_id = cel.instance_id
         AND a.status = 'published'
        LEFT JOIN article_category ac
          ON ac.id = a.category_id AND ac.instance_id = a.instance_id
       WHERE cel.source_type = ${sourceType}
         AND cel.source_id = ${sourceId}::uuid
         AND cel.relation_type = 'related-to'
      UNION ALL
      SELECT 'TreatmentPage' AS target_type, t.slug, t.title, NULL::text AS category_slug
        FROM content_entity_link cel
        JOIN treatment_page t
          ON cel.target_type = 'TreatmentPage'
         AND t.id = cel.target_id
         AND t.instance_id = cel.instance_id
         AND t.status = 'published'
       WHERE cel.source_type = ${sourceType}
         AND cel.source_id = ${sourceId}::uuid
         AND cel.relation_type = 'related-to'
      UNION ALL
      SELECT 'FAQ' AS target_type, f.slug, f.question AS title, NULL::text AS category_slug
        FROM content_entity_link cel
        JOIN faq f
          ON cel.target_type = 'FAQ'
         AND f.id = cel.target_id
         AND f.instance_id = cel.instance_id
         AND f.status = 'published'
       WHERE cel.source_type = ${sourceType}
         AND cel.source_id = ${sourceId}::uuid
         AND cel.relation_type = 'related-to'
    `,
  ]);

  if (pubRows.length === 0 && mediaRows.length === 0 && mentionRows.length === 0) return EMPTY;

  return {
    publications: pubRows.map((r) => ({
      publication: normalizePublication(r),
      relationType: r.relation_type,
    })),
    media: mediaRows.map((r) => ({
      media: normalizeMediaAppearance(r),
      relationType: r.relation_type,
    })),
    mentions: mentionRows.map((r) => ({
      targetType: r.target_type,
      slug: r.slug,
      title: r.title,
      categorySlug: r.category_slug,
    })),
  };
}
