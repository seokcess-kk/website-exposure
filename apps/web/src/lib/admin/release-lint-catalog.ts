// @glitzy/web/lib/admin/release-lint-catalog — ADMIN_UX_REDESIGN v1.0 § 3.2
// 출시 차단 11 룰 + 출시 권장 8 룰 카탈로그. plan v1.0 § 3.2 표 정합.

import type { ReleaseChecklistItem } from "./release-evaluator-types";

export type LintRuleId =
  // 출시 차단 11종 (BLOCKING)
  | "clinic-name-set"
  | "clinic-description-80chars"
  | "clinic-logo-url"
  | "clinic-og-image"
  | "location-main-address"
  | "location-business-hours"
  | "reservation-channel"
  | "policy-contact-person"
  | "legal-documents-all-published"
  | "doctor-min-one"
  | "treatment-or-article-min-one"
  // 출시 권장 8종 (RECOMMENDED)
  | "doctor-photo"
  | "doctor-bio-300chars"
  | "treatment-min-three"
  | "faq-min-five"
  | "article-min-one-per-category"
  | "publication-min-one"
  | "media-appearance-min-one"
  | "multiple-cta-channels";

export type LintRuleDef = {
  id: LintRuleId;
  kind: "blocking" | "recommended";
  category: ReleaseChecklistItem["category"];
  label: string;
  weight: number;
  /** href template — `{slug}` 안 instanceSlug 치환 */
  hrefTemplate: string;
};

export const LINT_CATALOG: ReadonlyArray<LintRuleDef> = [
  // === 출시 차단 (BLOCKING · 11종) ===
  { id: "clinic-name-set", kind: "blocking", category: "basic", label: "병원명 설정", weight: 10, hrefTemplate: "/admin/{slug}/clinic-profile#name" },
  { id: "clinic-description-80chars", kind: "blocking", category: "basic", label: "병원 소개 80자 이상 작성", weight: 8, hrefTemplate: "/admin/{slug}/clinic-profile#description" },
  { id: "clinic-logo-url", kind: "blocking", category: "basic", label: "로고 URL 설정", weight: 7, hrefTemplate: "/admin/{slug}/clinic-profile#logoUrl" },
  { id: "clinic-og-image", kind: "blocking", category: "basic", label: "OG 이미지 URL 설정", weight: 7, hrefTemplate: "/admin/{slug}/clinic-profile#ogImageUrl" },
  { id: "location-main-address", kind: "blocking", category: "basic", label: "본원 주소 (시·도+시·군·구+도로명) 설정", weight: 9, hrefTemplate: "/admin/{slug}/clinic-profile#address" },
  { id: "location-business-hours", kind: "blocking", category: "basic", label: "진료시간 1+ 요일 설정", weight: 8, hrefTemplate: "/admin/{slug}/clinic-profile#hours" },
  { id: "reservation-channel", kind: "blocking", category: "basic", label: "예약 채널 1+ 라벨/URL 설정", weight: 9, hrefTemplate: "/admin/{slug}/clinic-profile#ctas" },
  { id: "policy-contact-person", kind: "blocking", category: "policy", label: "정책 담당자 정보 (이름·이메일·전화) 설정", weight: 8, hrefTemplate: "/admin/{slug}/clinic-profile#policy" },
  { id: "legal-documents-all-published", kind: "blocking", category: "policy", label: "5종 정책 문서 모두 published", weight: 10, hrefTemplate: "/admin/{slug}/clinic-profile#legal" },
  { id: "doctor-min-one", kind: "blocking", category: "doctors", label: "의료진 1명 이상 active", weight: 7, hrefTemplate: "/admin/{slug}/doctors" },
  { id: "treatment-or-article-min-one", kind: "blocking", category: "content", label: "시술/진료 페이지 또는 아티클 1+ published", weight: 6, hrefTemplate: "/admin/{slug}/treatments" },

  // === 출시 권장 (RECOMMENDED · 8종) ===
  { id: "doctor-photo", kind: "recommended", category: "doctors", label: "모든 active 의료진 사진 설정", weight: 5, hrefTemplate: "/admin/{slug}/doctors" },
  { id: "doctor-bio-300chars", kind: "recommended", category: "doctors", label: "의료진 약력 300자 이상", weight: 4, hrefTemplate: "/admin/{slug}/doctors" },
  { id: "treatment-min-three", kind: "recommended", category: "content", label: "시술/진료 페이지 3+ published", weight: 5, hrefTemplate: "/admin/{slug}/treatments" },
  { id: "faq-min-five", kind: "recommended", category: "content", label: "FAQ 5+ published", weight: 4, hrefTemplate: "/admin/{slug}/faqs" },
  { id: "article-min-one-per-category", kind: "recommended", category: "content", label: "카테고리 별 article 1+ published", weight: 4, hrefTemplate: "/admin/{slug}/articles" },
  { id: "publication-min-one", kind: "recommended", category: "content", label: "공개 논문 1개 이상", weight: 3, hrefTemplate: "/admin/{slug}/publications" },
  { id: "media-appearance-min-one", kind: "recommended", category: "content", label: "공개 미디어 1개 이상", weight: 3, hrefTemplate: "/admin/{slug}/media-appearances" },
  { id: "multiple-cta-channels", kind: "recommended", category: "basic", label: "예약 채널 2+ (전화 + 카카오 등)", weight: 3, hrefTemplate: "/admin/{slug}/clinic-profile#ctas" },
];

export const BLOCKING_LINTS = LINT_CATALOG.filter((r) => r.kind === "blocking");
export const RECOMMENDED_LINTS = LINT_CATALOG.filter((r) => r.kind === "recommended");

export function resolveHref(rule: LintRuleDef, instanceSlug: string): string {
  return rule.hrefTemplate.replace("{slug}", instanceSlug);
}
