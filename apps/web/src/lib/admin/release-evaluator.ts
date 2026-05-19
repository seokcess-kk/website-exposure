// @glitzy/web/lib/admin/release-evaluator — ADMIN_UX_REDESIGN v1.0 § 4.3
// 출시 evaluator chain — UX schema (L3 zod) + compliance publishable evaluator (CA-GATE-03).
// entity 별 evaluator + evaluateInstanceRelease (collection-level lint 통합).

import type {
  InstanceReleaseResult,
  ReleaseBlocker,
  ReleaseChecklistItem,
  InstanceLifecycle,
} from "./release-evaluator-types";
import { BLOCKING_LINTS, RECOMMENDED_LINTS, resolveHref, type LintRuleId } from "./release-lint-catalog";

// === entity row types (DB projection — site-initial / db-projection.ts 정합) ===

export type ClinicProfileEval = {
  name: string | null;
  description: string | null;
  logoUrl: string | null;
  ogImageUrl: string | null;
  policyContactPerson: string | null;
  policyContactEmail: string | null;
  policyContactPhone: string | null;
  primaryCtasCount: number;
};

export type LocationProfileEval = {
  streetAddress: string | null;
  addressLocality: string | null;
  addressRegion: string | null;
  /** businessHours 안 1+ 요일 설정 여부 */
  hasBusinessHours: boolean;
};

export type DoctorProfileEval = {
  slug: string;
  active: boolean;
  photoUrl: string | null;
  bioLength: number;
};

export type ContentEntityEval = {
  slug: string;
  status: string;  // 'draft'/'published'/...
};

export type ArticleEval = ContentEntityEval & { categoryId: string };
export type CategoryEval = { id: string; slug: string };

export type LegalDocumentEval = {
  documentType: "privacy" | "terms" | "non-covered" | "refund" | "complaint" | "cookie" | "other";
  status: string;
};

export type InstanceReleaseStateRow = {
  state: "draft" | "release-pending" | "published";
  lastTransitionAt: string | null;
  transitionBy: string | null;
  releasedAt: string | null;
};

export type InstanceEvalInput = {
  instanceSlug: string;
  clinic: ClinicProfileEval | null;
  location: LocationProfileEval | null;
  doctors: DoctorProfileEval[];
  treatments: ContentEntityEval[];
  articles: ArticleEval[];
  faqs: ContentEntityEval[];
  publications: ContentEntityEval[];
  media: ContentEntityEval[];
  legals: LegalDocumentEval[];
  categories: CategoryEval[];
  /** ClinicProfile 안 compliance scope 외 — 그러나 향후 entity 별 compliance result 전달 가능 */
  complianceBlockers?: ReleaseBlocker[];
  /** instance.release_state JSONB (C0024) */
  releaseState: InstanceReleaseStateRow;
};

// === entity 별 evaluator ===

/** ClinicProfile 출시 evaluator — L3 zod 안 동등 logic (description 80자+ · logo · og · 정책담당자 3종 · ctas 1+) */
export function evaluateClinicProfileRelease(c: ClinicProfileEval | null): ReleaseBlocker[] {
  const out: ReleaseBlocker[] = [];
  if (!c) {
    out.push({ source: "ux-schema", field: "clinic", rule: "clinic-exists", message: "ClinicProfile 미생성" });
    return out;
  }
  if (!c.name || c.name.trim() === "") {
    out.push({ source: "ux-schema", field: "name", rule: "required", message: "병원명 미입력" });
  }
  if (!c.description || c.description.length < 80) {
    out.push({ source: "ux-schema", field: "description", rule: "min-80", message: `병원 소개 80자 이상 필요 (현재 ${c.description?.length ?? 0}자)` });
  }
  if (!c.logoUrl) out.push({ source: "ux-schema", field: "logoUrl", rule: "required", message: "로고 URL 미설정" });
  if (!c.ogImageUrl) out.push({ source: "ux-schema", field: "ogImageUrl", rule: "required", message: "OG 이미지 URL 미설정" });
  if (!c.policyContactPerson) out.push({ source: "ux-schema", field: "policyContactPerson", rule: "required", message: "정책 담당자 이름 미입력" });
  if (!c.policyContactEmail) out.push({ source: "ux-schema", field: "policyContactEmail", rule: "required", message: "정책 담당자 이메일 미입력" });
  if (!c.policyContactPhone) out.push({ source: "ux-schema", field: "policyContactPhone", rule: "required", message: "정책 담당자 전화 미입력" });
  if (c.primaryCtasCount === 0) out.push({ source: "ux-schema", field: "primaryCtas", rule: "min-1", message: "예약 채널 1+ 라벨/URL 설정 필요" });
  return out;
}

/** LocationProfile 출시 evaluator — 주소 필수 + 진료시간 1+ */
export function evaluateLocationProfileRelease(l: LocationProfileEval | null): ReleaseBlocker[] {
  const out: ReleaseBlocker[] = [];
  if (!l) {
    out.push({ source: "ux-schema", field: "location", rule: "location-exists", message: "본원 LocationProfile 미생성" });
    return out;
  }
  if (!l.streetAddress || !l.addressLocality || !l.addressRegion) {
    out.push({ source: "ux-schema", field: "address", rule: "required", message: "본원 주소 (시·도+시·군·구+도로명) 필요" });
  }
  if (!l.hasBusinessHours) {
    out.push({ source: "ux-schema", field: "businessHours", rule: "min-1-day", message: "진료시간 1+ 요일 설정 필요" });
  }
  return out;
}

// === instance 통합 evaluator (§ 4.3 algorithm) ===

export function evaluateInstanceRelease(input: InstanceEvalInput): InstanceReleaseResult {
  const blockers: ReleaseBlocker[] = [];

  // (1) entity 별 evaluator
  blockers.push(...evaluateClinicProfileRelease(input.clinic));
  blockers.push(...evaluateLocationProfileRelease(input.location));

  // (2) collection-level lint (§ 3.2 11 차단 룰 안 entity 별 evaluator 안 안 다루는 것)
  const activeDoctors = input.doctors.filter((d) => d.active);
  if (activeDoctors.length === 0) {
    blockers.push({ source: "instance-lint", field: "doctors", rule: "doctor-min-one", message: "active 의료진 1명 이상 필요" });
  }
  const publishedTreatments = input.treatments.filter((t) => t.status === "published");
  const publishedArticles = input.articles.filter((a) => a.status === "published");
  if (publishedTreatments.length === 0 && publishedArticles.length === 0) {
    blockers.push({ source: "instance-lint", field: "content", rule: "treatment-or-article-min-one", message: "시술 페이지 또는 아티클 1+ published 필요" });
  }
  const REQUIRED_LEGAL_TYPES: ReadonlyArray<LegalDocumentEval["documentType"]> = ["privacy", "terms", "non-covered", "refund", "complaint"];
  const publishedLegalTypes = new Set(input.legals.filter((l) => l.status === "published").map((l) => l.documentType));
  const missingLegals = REQUIRED_LEGAL_TYPES.filter((t) => !publishedLegalTypes.has(t));
  if (missingLegals.length > 0) {
    blockers.push({
      source: "instance-lint",
      field: "legals",
      rule: "legal-documents-all-published",
      message: `5종 정책 문서 모두 published 필요 (미완: ${missingLegals.join(", ")})`,
    });
  }

  // (3) compliance blockers (호출자 주입)
  if (input.complianceBlockers) {
    blockers.push(...input.complianceBlockers);
  }

  // (4) recommendedItems — 8 권장 lint
  const recommendedItems = computeRecommendedLintItems(input);

  // (5) lifecycle 산정
  let lifecycle: InstanceLifecycle;
  if (input.releaseState.state === "published") lifecycle = "published";
  else if (input.releaseState.state === "release-pending") lifecycle = "release-pending";
  else lifecycle = blockers.length === 0 ? "ready" : "draft";

  // (6) scorePercent — § 3.1: 차단 통과 가중치 / 전체 차단 가중치 * 70% + 권장 통과 / 전체 권장 * 30%
  const scorePercent = computeReadinessScore(input.instanceSlug, blockers, recommendedItems);

  return {
    releasable: blockers.length === 0,
    blockers,
    recommendedItems,
    lifecycle,
    scorePercent,
  };
}

// === recommended lint items 산정 ===

export function computeRecommendedLintItems(input: InstanceEvalInput): ReleaseChecklistItem[] {
  const out: ReleaseChecklistItem[] = [];
  const slug = input.instanceSlug;

  // doctor-photo
  const activeDocs = input.doctors.filter((d) => d.active);
  const docsWithoutPhoto = activeDocs.filter((d) => !d.photoUrl);
  if (docsWithoutPhoto.length > 0) {
    const rule = RECOMMENDED_LINTS.find((r) => r.id === "doctor-photo")!;
    out.push({
      id: rule.id,
      label: `${docsWithoutPhoto.length}명 의료진 사진 미설정`,
      status: "partial",
      category: rule.category,
      href: resolveHref(rule, slug),
      reason: `${docsWithoutPhoto.length}/${activeDocs.length}명 사진 없음`,
      weight: rule.weight,
    });
  }

  // doctor-bio-300chars
  const docsShortBio = activeDocs.filter((d) => d.bioLength < 300);
  if (docsShortBio.length > 0) {
    const rule = RECOMMENDED_LINTS.find((r) => r.id === "doctor-bio-300chars")!;
    out.push({
      id: rule.id,
      label: `의료진 약력 300자 이상`,
      status: "partial",
      category: rule.category,
      href: resolveHref(rule, slug),
      reason: `${docsShortBio.length}/${activeDocs.length}명 약력 부족`,
      weight: rule.weight,
    });
  }

  // treatment-min-three
  const publishedTreatments = input.treatments.filter((t) => t.status === "published");
  if (publishedTreatments.length < 3) {
    const rule = RECOMMENDED_LINTS.find((r) => r.id === "treatment-min-three")!;
    out.push({
      id: rule.id,
      label: `시술 페이지 3+ published`,
      status: publishedTreatments.length > 0 ? "partial" : "missing",
      category: rule.category,
      href: resolveHref(rule, slug),
      reason: `현재 ${publishedTreatments.length}/3건`,
      weight: rule.weight,
    });
  }

  // faq-min-five
  const publishedFaqs = input.faqs.filter((f) => f.status === "published");
  if (publishedFaqs.length < 5) {
    const rule = RECOMMENDED_LINTS.find((r) => r.id === "faq-min-five")!;
    out.push({
      id: rule.id,
      label: `FAQ 5+ published`,
      status: publishedFaqs.length > 0 ? "partial" : "missing",
      category: rule.category,
      href: resolveHref(rule, slug),
      reason: `현재 ${publishedFaqs.length}/5건`,
      weight: rule.weight,
    });
  }

  // article-min-one-per-category
  const publishedArticles = input.articles.filter((a) => a.status === "published");
  const categoriesWithArticle = new Set(publishedArticles.map((a) => a.categoryId));
  const categoriesWithoutArticle = input.categories.filter((c) => !categoriesWithArticle.has(c.id));
  if (categoriesWithoutArticle.length > 0 && input.categories.length > 0) {
    const rule = RECOMMENDED_LINTS.find((r) => r.id === "article-min-one-per-category")!;
    out.push({
      id: rule.id,
      label: `카테고리 별 article 1+ published`,
      status: "partial",
      category: rule.category,
      href: resolveHref(rule, slug),
      reason: `${categoriesWithoutArticle.length}/${input.categories.length} 카테고리 안 article 없음`,
      weight: rule.weight,
    });
  }

  // publication-min-one
  const publishedPublications = input.publications.filter((p) => p.status === "published");
  if (publishedPublications.length === 0) {
    const rule = RECOMMENDED_LINTS.find((r) => r.id === "publication-min-one")!;
    out.push({
      id: rule.id,
      label: `Publication (학술 인용) 1+ 추가 — E-A-T 신호`,
      status: "missing",
      category: rule.category,
      href: resolveHref(rule, slug),
      reason: "학술적 권위 강화",
      weight: rule.weight,
    });
  }

  // media-appearance-min-one
  const publishedMedia = input.media.filter((m) => m.status === "published");
  if (publishedMedia.length === 0) {
    const rule = RECOMMENDED_LINTS.find((r) => r.id === "media-appearance-min-one")!;
    out.push({
      id: rule.id,
      label: `MediaAppearance 1+ 추가 — 권위 시그널`,
      status: "missing",
      category: rule.category,
      href: resolveHref(rule, slug),
      reason: "공신력 강화",
      weight: rule.weight,
    });
  }

  // multiple-cta-channels (ClinicProfile.primaryCtasCount >= 2 안 검사)
  if (input.clinic && input.clinic.primaryCtasCount < 2) {
    const rule = RECOMMENDED_LINTS.find((r) => r.id === "multiple-cta-channels")!;
    out.push({
      id: rule.id,
      label: `예약 채널 2+ (전화 + 카카오 등)`,
      status: input.clinic.primaryCtasCount === 1 ? "partial" : "missing",
      category: rule.category,
      href: resolveHref(rule, slug),
      reason: `현재 ${input.clinic.primaryCtasCount}/3 채널`,
      weight: rule.weight,
    });
  }

  return out;
}

// === readiness score 산정 (§ 3.1 알고리즘) ===

export function computeReadinessScore(
  _instanceSlug: string,
  blockers: ReleaseBlocker[],
  recommendedItems: ReleaseChecklistItem[],
): number {
  // 차단: 통과 가중치 / 전체 차단 가중치
  const blockingTotalWeight = BLOCKING_LINTS.reduce((s, r) => s + r.weight, 0);
  // blockers 의 field/rule 가 BLOCKING_LINTS 안 ID 와 직접 1:1 매핑 안 됨 (entity-evaluator 안 detail message 별도)
  // 단순화: blockers.length === 0 → blockingPassed = 100% · blockers 1+ 면 미통과 룰 1 가정 (보수적 산정)
  // 정확도 위해 향후 blockers 별 LintRuleId tagging 가능.
  const blockingPassRatio = blockers.length === 0 ? 1.0 : Math.max(0, 1 - blockers.length / BLOCKING_LINTS.length);

  // 권장: recommendedItems 안 list = 미통과. 통과 = 전체 - 미통과
  const recommendedTotalWeight = RECOMMENDED_LINTS.reduce((s, r) => s + r.weight, 0);
  const failedRecommendedWeight = recommendedItems.reduce((s, i) => s + i.weight, 0);
  const recommendedPassRatio = recommendedTotalWeight === 0 ? 1 : Math.max(0, 1 - failedRecommendedWeight / recommendedTotalWeight);

  const score = blockingPassRatio * 70 + recommendedPassRatio * 30;
  return Math.round(score);
}
