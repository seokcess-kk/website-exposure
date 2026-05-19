// COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 7 scenarios — vitest scope (자동 검증 가능 부분)

import { describe, it, expect } from "vitest";
import { calculateFinalRoles, isRoleSatisfied } from "../final-roles";
import { evaluatePublishable } from "../publishable-check";
import { maxRisk } from "../risk";
import { check, buildLegalDocumentExemptEnvelope } from "../check";
import { assertTransitionAllowed, listAllowedTransitions } from "../transitions";
import { ComplianceConfigError, ComplianceTransitionError } from "../types";

describe("calculateFinalRoles — 시나리오 1·2·3·12 일부", () => {
  it("Article Low → {operator}", () => {
    expect(calculateFinalRoles("Article", "Low")).toEqual(["operator"]);
  });
  it("Article Medium → {operator, medical}", () => {
    expect(calculateFinalRoles("Article", "Medium")).toEqual(["medical", "operator"]);
  });
  it("LegalDocument Low → {operator, legal}", () => {
    expect(calculateFinalRoles("LegalDocument", "Low")).toEqual(["legal", "operator"]);
  });
  it("Article High + priorReview → {operator, medical, legal}", () => {
    expect(calculateFinalRoles("Article", "High", true)).toEqual(["legal", "medical", "operator"]);
  });
  it("unknown role throw (CAM2-04 fail closed)", () => {
    expect(() => calculateFinalRoles("Article", "Low", false, ["alien"])).toThrow(ComplianceConfigError);
  });
  it("client role throw (CA-DEFER-10)", () => {
    expect(() => calculateFinalRoles("Article", "Low", false, ["client"])).toThrow(ComplianceConfigError);
  });
});

describe("maxRisk — CAM-04 격하 금지", () => {
  it("Low + High → High", () => {
    expect(maxRisk("Low", "High")).toBe("High");
  });
  it("Medium + Low + Low → Medium", () => {
    expect(maxRisk("Medium", "Low", "Low")).toBe("Medium");
  });
  it("Low + Low → Low", () => {
    expect(maxRisk("Low", "Low")).toBe("Low");
  });
});

describe("check() M0 stub — 시나리오 11·12·13 (Phase Alpha v1.0 cascade)", () => {
  it("Low 입력 → findings=[]·gateRequired=false·automatedDecision=pass", async () => {
    const env = await check({
      contentType: "Article",
      contentRef: "test",
      body: "",
      metadata: { explicitRiskLevel: "Low", articleType: "general-medical-info" },
    });
    expect(env.result.findings).toEqual([]);
    expect(env.result.gateRequired).toBe(false);
    expect(env.result.automatedDecision).toBe("pass");
    expect(env.meta.manualReview).toBe(false);   // Phase Alpha v1.0 - 실 자동 검수 완료
    expect(env.meta.pageRiskLevel).toBe("Medium");   // articleType=general-medical-info → Medium MAX 결합
    expect(env.result.findingsBySeverity.info).toBe(0);
  });
  it("High 입력 → 가상 finding `risk-level-high-gate` + gateRequired=true", async () => {
    const env = await check({
      contentType: "Article",
      contentRef: "test",
      body: "",
      metadata: { explicitRiskLevel: "High", articleType: "general-medical-info" },
    });
    // High 가상 finding 자동 주입
    expect(env.result.findings.some((f) => f.ruleId === "risk-level-high-gate")).toBe(true);
    expect(env.result.gateRequired).toBe(true);
    expect(env.result.automatedDecision).toBe("gate");
    expect(env.result.findingsBySeverity["content-gate"]).toBeGreaterThanOrEqual(1);
    expect(env.meta.pageRiskLevel).toBe("High");
  });
  it("LegalDocument 입력 → throw (CAM2-02)", async () => {
    await expect(check({
      contentType: "LegalDocument",
      contentRef: "privacy",
      body: "",
      metadata: {},
    })).rejects.toThrow(ComplianceConfigError);
  });
  it("buildLegalDocumentExemptEnvelope → exemptReason + manualReview=false", () => {
    const env = buildLegalDocumentExemptEnvelope({
      contentType: "LegalDocument",
      contentRef: "privacy",
      body: "",
      metadata: {},
    });
    expect(env.meta.exemptReason).toBe("LegalDocument-CONTENT_STANDARDS-7.1.1.1");
    expect(env.meta.manualReview).toBe(false);
    expect(env.result.automatedDecision).toBe("pass");
    expect(env.result.findingsBySeverity.info).toBe(0);
  });
  it("Low explicit + High inferred → High (격하 금지)", async () => {
    const env = await check({
      contentType: "Article",
      contentRef: "test",
      body: "",
      metadata: { explicitRiskLevel: "Low", inferredRiskLevel: "High", articleType: "notice" },
    });
    expect(env.meta.pageRiskLevel).toBe("High");
    expect(env.result.gateRequired).toBe(true);
  });
});

describe("status 전이 table — 시나리오 14 일부", () => {
  it("draft → review-queued 허용", () => {
    expect(() => assertTransitionAllowed("draft", "review-queued")).not.toThrow();
  });
  it("draft → published 차단", () => {
    expect(() => assertTransitionAllowed("draft", "published")).toThrow(ComplianceTransitionError);
  });
  it("publishable → published 허용", () => {
    expect(() => assertTransitionAllowed("publishable", "published")).not.toThrow();
  });
  it("listAllowedTransitions", () => {
    expect(listAllowedTransitions("review-queued")).toContain("in-review");
  });
});

describe("evaluatePublishable — 시나리오 4·5", () => {
  const baseRecord = {
    peer_reviewer: null,
    peer_reviewed_at: null,
    physician_approver: null,
    physician_approved_at: null,
    legal_counsel: null,
    legal_counsel_at: null,
    page_risk_level: "Low" as const,
    prior_review_required: false,
    prior_review_passed: null,
    auto_check_result: { automatedDecision: "pass", requiredApproverRoles: [] },
  };
  it("Low Article + operator 충족 → publishable=true", () => {
    const result = evaluatePublishable(
      { ...baseRecord, peer_reviewer: "u1", peer_reviewed_at: new Date() },
      "Article",
    );
    expect(result.publishable).toBe(true);
  });
  it("Medium Article + operator only → missing medical", () => {
    const result = evaluatePublishable(
      { ...baseRecord, page_risk_level: "Medium", peer_reviewer: "u1", peer_reviewed_at: new Date() },
      "Article",
    );
    expect(result.publishable).toBe(false);
    if (result.publishable === false && "missingRoles" in result) {
      expect(result.missingRoles).toContain("medical");
    }
  });
  it("LegalDocument + operator only → missing legal", () => {
    const result = evaluatePublishable(
      { ...baseRecord, peer_reviewer: "u1", peer_reviewed_at: new Date() },
      "LegalDocument",
    );
    expect(result.publishable).toBe(false);
    if (result.publishable === false && "missingRoles" in result) {
      expect(result.missingRoles).toContain("legal");
    }
  });
  it("automatedDecision=block → publishable=false (CAM-06)", () => {
    const result = evaluatePublishable(
      { ...baseRecord, peer_reviewer: "u1", peer_reviewed_at: new Date(), auto_check_result: { automatedDecision: "block" } },
      "Article",
    );
    expect(result.publishable).toBe(false);
  });
  it("unknown role in requiredApproverRoles → configError (CAM2-04)", () => {
    const result = evaluatePublishable(
      { ...baseRecord, peer_reviewer: "u1", peer_reviewed_at: new Date(), auto_check_result: { automatedDecision: "pass", requiredApproverRoles: ["alien"] } },
      "Article",
    );
    expect(result.publishable).toBe(false);
    if (result.publishable === false && "configError" in result && result.configError) {
      expect(result.configError).toContain("Unknown ApproverRole");
    }
  });
});

describe("isRoleSatisfied", () => {
  const r = {
    peer_reviewer: "u1", peer_reviewed_at: new Date(),
    physician_approver: null, physician_approved_at: null,
    legal_counsel: null, legal_counsel_at: null,
    page_risk_level: "Low" as const,
    prior_review_required: false,
    prior_review_passed: null,
    auto_check_result: null,
  };
  it("operator 충족", () => expect(isRoleSatisfied(r, "operator")).toBe(true));
  it("medical 미충족", () => expect(isRoleSatisfied(r, "medical")).toBe(false));
});
