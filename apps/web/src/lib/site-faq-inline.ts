// @glitzy/web/lib/site-faq-inline — Treatment/Condition detail 안 인라인 FAQ + FAQPage schema 병합
// SoT: EXPOSURE_READINESS Phase E (2026-05-26) — 외부 비평 #3 흡수.
//   "AI/검색 답변 노출은 FAQ 전용 페이지보다 각 Condition/Treatment/Article 안의 문맥형 Q&A 가 더 강할 때가 많다"
//   → content_entity_link 안 `related-to FAQ` 로 link 된 FAQ row 의 question + answer 풀 회수.

import type postgres from "postgres";

import type { SeoLinkSourceType } from "@glitzy/core-content";
import { normalizeFaq, type FaqProjection, type FaqRow } from "./db-projection";

/**
 * source entity (TreatmentPage · MedicalConditionPage · Article) 와 `related-to` 로 link 된
 * published FAQ row 의 풀 projection 회수. detail 페이지 안 인라인 "자주 묻는 질문" 섹션 + FAQPage JSON-LD 사용.
 *
 * 정책:
 *   - relation_type = 'related-to' AND target_type = 'FAQ' 만
 *   - faq.status = 'published'
 *   - display_order ASC (link 안 운영자가 정한 순서)
 *   - 최대 12개 — schema.org FAQPage 권장 + UX overload 회피
 */
export async function loadInlineFaqsForEntity(
  tx: postgres.TransactionSql,
  sourceType: SeoLinkSourceType,
  sourceId: string,
): Promise<FaqProjection[]> {
  const rows = await tx<FaqRow[]>`
    SELECT f.slug, f.question, f.answer, f.display_order, f.category_id,
           f.related_treatment_id, f.author_doctor_id, f.published_at, f.updated_at
      FROM content_entity_link cel
      JOIN faq f
        ON f.id = cel.target_id
       AND f.instance_id = cel.instance_id
       AND f.status = 'published'
     WHERE cel.source_type = ${sourceType}
       AND cel.source_id = ${sourceId}::uuid
       AND cel.target_type = 'FAQ'
       AND cel.relation_type = 'related-to'
     ORDER BY cel.display_order ASC, f.display_order ASC
     LIMIT 12
  `;
  return rows.map(normalizeFaq);
}
