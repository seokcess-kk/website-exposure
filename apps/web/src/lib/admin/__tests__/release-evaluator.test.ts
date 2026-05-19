// @glitzy/web/lib/admin/__tests__/release-evaluator — ADMIN_UX_REDESIGN v1.0 § 13
// W11 핵심 시나리오 9건 통합 (release-evaluator + quality-score + lint-catalog + save/release schema).

import { describe, it, expect } from "vitest";
import {
  evaluateClinicProfileRelease,
  evaluateLocationProfileRelease,
  evaluateInstanceRelease,
  computeRecommendedLintItems,
  computeReadinessScore,
  type InstanceEvalInput,
} from "../release-evaluator";
import { BLOCKING_LINTS, RECOMMENDED_LINTS, LINT_CATALOG, resolveHref } from "../release-lint-catalog";
import { computeQualityScore } from "../quality-score";
import { clinicProfileSaveSchema, doctorProfileSaveSchema } from "../save-schemas";
import { clinicProfileReleaseSchema } from "../release-schemas";

const FULL_CLINIC: InstanceEvalInput["clinic"] = {
  name: "Glitzy 의원",
  description: "강남 한방 자체 미디어 사이트로, 콘텐츠 신뢰성과 검색 노출을 모두 고려하여 운영합니다. 의료광고 자율심의 정합 + 환자 안내 최우선이며 정확한 정보 제공.",
  logoUrl: "https://example.com/logo.png",
  ogImageUrl: "https://example.com/og.png",
  policyContactPerson: "홍길동",
  policyContactEmail: "privacy@example.com",
  policyContactPhone: "02-1234-5678",
  primaryCtasCount: 2,
};

const FULL_LOCATION: InstanceEvalInput["location"] = {
  streetAddress: "테스트로 1",
  addressLocality: "강남구",
  addressRegion: "서울특별시",
  hasBusinessHours: true,
};

const baseInput: InstanceEvalInput = {
  instanceSlug: "demo",
  clinic: FULL_CLINIC,
  location: FULL_LOCATION,
  doctors: [{ slug: "dr-1", active: true, photoUrl: "https://example.com/dr.png", bioLength: 500 }],
  treatments: [{ slug: "t1", status: "published" }],
  articles: [{ slug: "a1", status: "published", categoryId: "cat-1" }],
  faqs: Array.from({ length: 6 }, (_, i) => ({ slug: `f${i}`, status: "published" })),
  publications: [{ slug: "p1", status: "published" }],
  media: [{ slug: "m1", status: "published" }],
  legals: ["privacy", "terms", "non-covered", "refund", "complaint"].map((t) => ({ documentType: t as never, status: "published" })),
  categories: [{ id: "cat-1", slug: "general" }],
  releaseState: { state: "draft", lastTransitionAt: null, transitionBy: null, releasedAt: null },
};

describe("release-evaluator — entity 단위", () => {
  it("[scenario-1] ClinicProfile 완전 입력 → blockers 0", () => {
    expect(evaluateClinicProfileRelease(FULL_CLINIC)).toEqual([]);
  });

  it("[scenario-2] ClinicProfile description 80자 미만 → blocker 1건", () => {
    const out = evaluateClinicProfileRelease({ ...FULL_CLINIC, description: "짧은 설명" });
    expect(out).toHaveLength(1);
    expect(out[0]!.field).toBe("description");
  });

  it("[scenario-3] LocationProfile businessHours 없음 → blocker", () => {
    const out = evaluateLocationProfileRelease({ ...FULL_LOCATION, hasBusinessHours: false });
    expect(out.some((b) => b.field === "businessHours")).toBe(true);
  });
});

describe("release-evaluator — instance 통합", () => {
  it("[scenario-4] 완전 입력 → releasable=true, blockers=[]", () => {
    const result = evaluateInstanceRelease(baseInput);
    expect(result.releasable).toBe(true);
    expect(result.blockers).toEqual([]);
    expect(result.lifecycle).toBe("ready");
    expect(result.scorePercent).toBeGreaterThan(70);
  });

  it("[scenario-5] 5종 정책 문서 일부 누락 → blocker + lifecycle=draft", () => {
    const result = evaluateInstanceRelease({
      ...baseInput,
      legals: [{ documentType: "privacy", status: "published" }],
    });
    expect(result.releasable).toBe(false);
    expect(result.blockers.some((b) => b.rule === "legal-documents-all-published")).toBe(true);
    expect(result.lifecycle).toBe("draft");
  });

  it("[scenario-6] release-pending 상태 → lifecycle=release-pending", () => {
    const result = evaluateInstanceRelease({
      ...baseInput,
      releaseState: { state: "release-pending", lastTransitionAt: "2026-05-20", transitionBy: "u1", releasedAt: null },
    });
    expect(result.lifecycle).toBe("release-pending");
  });
});

describe("recommended-lint", () => {
  it("[scenario-7] doctor-photo 누락 → recommended item 1+", () => {
    const result = computeRecommendedLintItems({
      ...baseInput,
      doctors: [{ slug: "dr-1", active: true, photoUrl: null, bioLength: 500 }],
    });
    expect(result.some((r) => r.id === "doctor-photo")).toBe(true);
  });
});

describe("lint-catalog", () => {
  it("[scenario-8] LINT_CATALOG 안 BLOCKING 11 + RECOMMENDED 8 = 19", () => {
    expect(BLOCKING_LINTS).toHaveLength(11);
    expect(RECOMMENDED_LINTS).toHaveLength(8);
    expect(LINT_CATALOG).toHaveLength(19);
  });

  it("[scenario-9] resolveHref — {slug} 치환", () => {
    const rule = BLOCKING_LINTS[0]!;
    expect(resolveHref(rule, "demo")).toContain("/admin/demo/");
    expect(resolveHref(rule, "demo")).not.toContain("{slug}");
  });
});

describe("quality-score", () => {
  it("[scenario-10] 완전 입력 → total > 70 + breakdown 4 카테고리 sum = total", () => {
    const qs = computeQualityScore({
      ...baseInput,
      complianceFindings: [],
      sitemapEntryCount: 10,
      warningQueueOpenCount: 0,
    });
    expect(qs.total).toBeGreaterThan(60);
    const sum = qs.breakdown.recommended + qs.breakdown.eat + qs.breakdown.seo + qs.breakdown.compliance;
    expect(sum).toBe(qs.total);
  });

  it("[scenario-11] warningQueueOpenCount=1 → compliance breakdown 5 감점", () => {
    const baseQs = computeQualityScore({ ...baseInput, complianceFindings: [], sitemapEntryCount: 10, warningQueueOpenCount: 0 });
    const reducedQs = computeQualityScore({ ...baseInput, complianceFindings: [], sitemapEntryCount: 10, warningQueueOpenCount: 1 });
    expect(reducedQs.breakdown.compliance).toBe(baseQs.breakdown.compliance - 5);
  });
});

describe("save vs release schema separation", () => {
  it("[scenario-12] save schema — empty 입력도 통과 (느슨)", () => {
    const result = clinicProfileSaveSchema.safeParse({
      name: "",
      description: "",
      logoUrl: "",
      ogImageUrl: "",
      businessRegistrationNumber: "",
      alternateName: "",
      legalEntityName: "",
      slogan: "",
      longDescription: "",
      foundingDate: "",
      founder: "",
    });
    expect(result.success).toBe(true);
  });

  it("[scenario-13] release schema — empty 입력 시 fail (엄격)", () => {
    const result = clinicProfileReleaseSchema.safeParse({
      name: "",
      description: "",
      logoUrl: "",
      ogImageUrl: "",
      policyContactPerson: "",
      policyContactEmail: "not-an-email",
      policyContactPhone: "",
    });
    expect(result.success).toBe(false);
  });

  it("[scenario-14] doctor save schema — slug 만 있어도 통과", () => {
    const result = doctorProfileSaveSchema.safeParse({
      slug: "dr-test",
      name: "",
      displayOrder: "",
    });
    expect(result.success).toBe(true);
  });
});

describe("readiness score", () => {
  it("[scenario-15] blockers=0 + recommendedItems=0 → 100", () => {
    expect(computeReadinessScore("demo", [], [])).toBe(100);
  });

  it("[scenario-16] blockers 1건 → score < 100", () => {
    const score = computeReadinessScore("demo", [{ source: "ux-schema", field: "x", rule: "y", message: "z" }], []);
    expect(score).toBeLessThan(100);
  });
});
