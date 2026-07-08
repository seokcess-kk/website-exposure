// @glitzy/web/lib/admin/publish-auto-link — 발행 시 readiness 연결 자동화
//
// publishContentAction 이 발행 성공 직후(별도 tx · non-blocking) 호출한다. 목적: 운영자가
// 콘텐츠 1건 발행 시 키워드/FAQ 연결을 수동으로 챙기지 않아도 readiness 기본 항목이 채워지게.
//
// 규칙 (전부 데이터 파생 — 인스턴스 하드코딩 없음):
//   (1) 키워드 primary — 이 엔티티에 primary 링크가 하나도 없을 때만, 제목에 실제 포함된
//       active 키워드 라벨 중 가장 긴 것 1개를 자동 연결. (제목 미포함 라벨을 연결하면
//       title check 가 warn→fail 로 오히려 감점되므로 포함 검증이 필수 — 2026-07-08 교훈.)
//   (2) FAQ related-to — 이 엔티티에 FAQ 링크가 없을 때만, 이 인스턴스에서 가장 많이 연결된
//       발행 FAQ 1건을 연결 (기존 운영 연결 패턴에서 학습). 링크 이력이 전무하면 display_order
//       최상위 발행 FAQ 로 폴백, 발행 FAQ 자체가 없으면 no-op.
//
// 운영자가 이미 연결해 뒀으면 어느 쪽도 건드리지 않는다 (사람 선택 우선).

import type postgres from "postgres";

export type AutoLinkContentType = "Article" | "TreatmentPage";

export type AutoLinkResult = {
  entityId: string | null;
  keywordLinked: string | null; // 연결한 키워드 label (없으면 null)
  faqLinked: string | null; // 연결한 FAQ slug (없으면 null)
};

/** 제목에 포함된 라벨 중 가장 긴 것 — 없으면 null. (pure · vitest 대상) */
export function pickLongestContainedLabel(title: string, labels: string[]): string | null {
  let best: string | null = null;
  for (const label of labels) {
    const t = label.trim();
    if (t.length === 0 || !title.includes(t)) continue;
    if (best === null || t.length > best.length) best = t;
  }
  return best;
}

export async function autoLinkOnPublish(
  tx: postgres.TransactionSql,
  instanceId: string,
  contentType: AutoLinkContentType,
  contentRef: string,
): Promise<AutoLinkResult> {
  const rows: Array<{ id: string; title: string }> =
    contentType === "Article"
      ? await tx`SELECT id, title FROM article
                  WHERE instance_id = ${instanceId}::uuid AND slug = ${contentRef} LIMIT 1`
      : await tx`SELECT id, title FROM treatment_page
                  WHERE instance_id = ${instanceId}::uuid AND slug = ${contentRef} LIMIT 1`;
  if (rows.length === 0) return { entityId: null, keywordLinked: null, faqLinked: null };
  const { id: entityId, title } = rows[0]!;

  // (1) 키워드 primary 자동 연결
  let keywordLinked: string | null = null;
  const primaryCount: Array<{ n: string }> = await tx`
    SELECT COUNT(*)::text AS n FROM keyword_content_link
     WHERE instance_id = ${instanceId}::uuid AND entity_type = ${contentType}
       AND entity_id = ${entityId}::uuid AND is_primary = true
  `;
  if (Number(primaryCount[0]?.n ?? "0") === 0) {
    const keywords: Array<{ id: string; label: string }> = await tx`
      SELECT id, label FROM keyword_target
       WHERE instance_id = ${instanceId}::uuid AND status = 'active'
    `;
    const label = pickLongestContainedLabel(title, keywords.map((k) => k.label));
    if (label) {
      const kw = keywords.find((k) => k.label === label)!;
      await tx`
        INSERT INTO keyword_content_link
          (id, instance_id, keyword_id, entity_type, entity_id, relevance_score, is_primary, metadata, created_at, updated_at)
        VALUES
          (gen_random_uuid(), ${instanceId}::uuid, ${kw.id}::uuid, ${contentType}, ${entityId}::uuid,
           85, true, ${tx.json({ autoLinkedOnPublish: true })}, NOW(), NOW())
        ON CONFLICT (instance_id, keyword_id, entity_type, entity_id) DO NOTHING
      `;
      keywordLinked = label;
    }
  }

  // (2) FAQ related-to 자동 연결
  let faqLinked: string | null = null;
  const faqLinkCount: Array<{ n: string }> = await tx`
    SELECT COUNT(*)::text AS n FROM content_entity_link
     WHERE instance_id = ${instanceId}::uuid AND source_type = ${contentType}
       AND source_id = ${entityId}::uuid AND relation_type = 'related-to' AND target_type = 'FAQ'
  `;
  if (Number(faqLinkCount[0]?.n ?? "0") === 0) {
    // 가장 많이 연결된 발행 FAQ → 폴백: display_order 최상위 발행 FAQ
    const faqRows: Array<{ id: string; slug: string }> = await tx`
      SELECT f.id, f.slug
        FROM faq f
        LEFT JOIN content_entity_link cel
          ON cel.instance_id = f.instance_id AND cel.target_type = 'FAQ'
         AND cel.target_id = f.id AND cel.relation_type = 'related-to'
       WHERE f.instance_id = ${instanceId}::uuid AND f.status = 'published'
       GROUP BY f.id, f.slug, f.display_order, f.created_at
       ORDER BY COUNT(cel.id) DESC, f.display_order ASC, f.created_at ASC
       LIMIT 1
    `;
    if (faqRows.length > 0) {
      await tx`
        INSERT INTO content_entity_link
          (id, instance_id, source_type, source_id, target_type, target_id, relation_type, display_order, metadata, created_at, updated_at)
        VALUES
          (gen_random_uuid(), ${instanceId}::uuid, ${contentType}, ${entityId}::uuid,
           'FAQ', ${faqRows[0]!.id}::uuid, 'related-to', 0, ${tx.json({ autoLinkedOnPublish: true })}, NOW(), NOW())
        ON CONFLICT (instance_id, source_type, source_id, target_type, target_id, relation_type) DO NOTHING
      `;
      faqLinked = faqRows[0]!.slug;
    }
  }

  return { entityId, keywordLinked, faqLinked };
}
