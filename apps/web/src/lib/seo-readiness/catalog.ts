// @glitzy/web/lib/seo-readiness/catalog — check 항목 catalog (v1 — 7종)
// SEO_VISIBILITY_OPS_PLAN v0.2 § 3.1
//
// 각 check 의 weight 합 = 100 (entity 별). entity 별로 미적용 check 는 weight 0.

import type { SeoReadinessEntityType } from "@glitzy/core-content";

export type CheckKey =
  | "title-has-target-keyword"
  | "summary-length-ok"
  | "has-author-doctor"
  | "has-evidence-link"
  | "has-related-faq"
  | "internal-links-min"
  | "freshness-ok";

export type CheckCatalogEntry = {
  key: CheckKey;
  label: string;
  weight: Partial<Record<SeoReadinessEntityType, number>>;
  recommendationHint?: string;
};

export const CHECK_CATALOG: CheckCatalogEntry[] = [
  {
    key: "title-has-target-keyword",
    label: "제목에 타깃 키워드 포함",
    weight: { Article: 20, TreatmentPage: 20 },
    recommendationHint: "primary 로 연결된 키워드 라벨을 제목에 자연스럽게 포함시키세요.",
  },
  {
    key: "summary-length-ok",
    label: "요약/메타 설명 길이 적정",
    weight: { Article: 10, TreatmentPage: 10, FAQ: 15 },
    recommendationHint: "요약은 80~200자가 검색 노출에 적합합니다.",
  },
  {
    key: "has-author-doctor",
    label: "의료진 저자 연결",
    weight: { Article: 15, TreatmentPage: 15 },
    recommendationHint: "E-E-A-T 시그널을 위해 작성 폼의 의료진 필드를 채우세요.",
  },
  {
    key: "has-evidence-link",
    label: "논문/미디어 근거 연결",
    weight: { Article: 20, TreatmentPage: 25 },
    recommendationHint: "관련 논문(cites) 또는 임상 근거(derived-from)를 연결하세요.",
  },
  {
    key: "has-related-faq",
    label: "관련 FAQ 연결",
    weight: { Article: 10, TreatmentPage: 10 },
    recommendationHint: "타깃 키워드 의도에 맞는 FAQ를 related-to 로 연결하세요.",
  },
  {
    key: "internal-links-min",
    label: "내부 링크 ≥ 3개",
    weight: { Article: 10, TreatmentPage: 10 },
    recommendationHint: "본문에 같은 사이트의 시술/아티클 페이지 3개 이상 링크하세요.",
  },
  {
    key: "freshness-ok",
    label: "30일 이내 업데이트",
    weight: { Article: 15, TreatmentPage: 10, FAQ: 25, Publication: 30, MediaAppearance: 30, DoctorProfile: 30, ClinicProfile: 40 },
    recommendationHint: "30일 이상 미업데이트 콘텐츠는 신선도 시그널이 약합니다.",
  },
];

export function getApplicableChecks(entityType: SeoReadinessEntityType): CheckCatalogEntry[] {
  return CHECK_CATALOG.filter((c) => (c.weight[entityType] ?? 0) > 0);
}
