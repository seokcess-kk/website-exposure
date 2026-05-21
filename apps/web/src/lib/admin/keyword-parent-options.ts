// @glitzy/web/lib/admin/keyword-parent-options — SEO_KEYWORD_STRATEGY_PLAN v0.2 § 3.3
//
// secondary keyword 의 parent select 옵션 — primary keyword 만 회수 (cycle 1 #1 정합).
// 편집 모드 시 자기 자신은 제외 (자기참조 금지).

import type postgres from "postgres";

import type { EvidenceLinkOptions } from "./evidence-link-options";

export type KeywordParentOption = {
  value: string;       // keyword UUID
  label: string;       // keyword label
  sublabel?: string;   // intent/priority short text
};

export async function loadKeywordParentOptions(
  tx: postgres.TransactionSql,
  instanceId: string,
  excludeId: string | null,
): Promise<KeywordParentOption[]> {
  const rows: Array<{ id: string; label: string; intent: string; priority: string }> = await tx`
    SELECT id, label, intent, priority
      FROM keyword_target
     WHERE instance_id = ${instanceId}::uuid
       AND keyword_type = 'primary'
       AND status = 'active'
       ${excludeId ? tx`AND id <> ${excludeId}::uuid` : tx``}
     ORDER BY priority ASC, label ASC
  `;
  return rows.map((r) => ({
    value: r.id,
    label: r.label,
    sublabel: `${r.intent} · ${r.priority}`,
  }));
}

/**
 * 키워드 ↔ 콘텐츠 매핑 UI 안 사용할 entity options.
 * evidence-link-options 의 5 entity loader 를 재사용.
 * 단순 re-export 패턴 — keyword 안 own helper 가 필요한 경우 갈라치기.
 */
export type { EvidenceLinkOptions } from "./evidence-link-options";
export { loadEvidenceLinkOptions as loadKeywordContentOptions } from "./evidence-link-options";

/** evidence options 의 단순 sum count — UI 안 빈 상태 표시용 */
export function totalContentOptionsCount(options: EvidenceLinkOptions): number {
  return (
    options.publications.length +
    options.mediaAppearances.length +
    options.faqs.length +
    options.treatmentPages.length +
    options.articles.length
  );
}
