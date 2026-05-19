// @glitzy/compliance-rules — inline-flags
// SoT: docs/compliance/RISK_LEVELS.md § 5.1 + COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 8

import type {
  Finding,
  InlineRiskExtractionInput,
  InlineRiskExtractionResult,
  InlineRiskFlag,
  InlineRiskFlagEvidence,
  MatchSpan,
} from "./types.js";
import { matchRegex } from "./matcher-simple.js";

// RISK_LEVELS § 5.1.1 SoT 7 카테고리 정확 매칭 (CAP-05)
const EFFECT_CLAIM_CATEGORIES = new Set<string>([
  "효과 단정",
  "전문성 단정 (단독 어휘)",
  "전문성 단정 (효과·결과·보장 결합)",
  "보장 표현",
  "수치·기간 단정 (보장어 없음)",
  "수치·기간 보장",
  "체질·맞춤 과대 표현",
]);

// CAP-21 - SoT regex 전건
const PRICING_REGEX = /[₩$￥]\s*\d|\d{2,}\s*(원|만원|달러)|(가격|비용|수가|비급여|총\s*비용)/gu;
const EVENT_REGEX = /(이벤트|할인|세일|프로모션|기간\s*한정|선착순|특가|프로모)/gu;
const BEFORE_AFTER_REGEX = /(전후|비포어\s*애프터|before\s*\/?\s*after|B\/A)/giu;

function spansFromRegex(body: string, pattern: RegExp): Array<{ location: MatchSpan; matchedText: string }> {
  const result: Array<{ location: MatchSpan; matchedText: string }> = [];
  const regex = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");
  let m: RegExpExecArray | null;
  while ((m = regex.exec(body)) !== null) {
    if (m.index === undefined) break;
    result.push({
      location: { start: m.index, end: m.index + m[0].length },
      matchedText: m[0],
    });
    if (m[0].length === 0) regex.lastIndex++;
  }
  return result;
}

/**
 * CAP-22 - LegalDocument false-positive 완화 표는 dead code marker (check() 진입 차단).
 * 실 적용: LocationProfile + Article articleType=notice 만.
 */
function shouldSkipLevelUp(flag: InlineRiskFlag, input: InlineRiskExtractionInput): boolean {
  if (flag === "includes-event") {
    if (input.contentType === "Article" && input.articleType === "notice") return true;
    if (
      input.contentType === "LocationProfile" &&
      (input.locationProfileField === "branchDescription" ||
        input.locationProfileField === "transportInfo" ||
        input.locationProfileField === "parkingInfo")
    ) {
      return true;
    }
  }
  return false;
}

export function evaluateInline(
  body: string,
  findings: Finding[],
  input: InlineRiskExtractionInput,
): InlineRiskExtractionResult {
  const evidence: InlineRiskFlagEvidence = {};
  const flagSet = new Set<InlineRiskFlag>();
  // CAP-CODE-07 정정 - SoT (RISK_LEVELS § 5.1.2) - flag 자체는 보존 + RiskLevel 격상 제외만
  //   flagSet 안 항상 add · suppressedLevelUp 별도 추적 → RiskInference 입력 안 flag 제외
  const suppressedLevelUp = new Set<InlineRiskFlag>();

  // includes-effect-claim - matchResult.findings 안 SoT 7 카테고리 정확 매칭 (CAP-05)
  const effectClaimEvidence: Array<{ location: MatchSpan; matchedText: string }> = [];
  for (const f of findings) {
    if (EFFECT_CLAIM_CATEGORIES.has(f.category)) {
      effectClaimEvidence.push({ location: f.location, matchedText: f.pattern });
    }
  }
  if (effectClaimEvidence.length > 0) {
    flagSet.add("includes-effect-claim");
    evidence["includes-effect-claim"] = effectClaimEvidence;
  }

  // includes-pricing
  const pricingEv = spansFromRegex(body, PRICING_REGEX);
  if (pricingEv.length > 0) {
    flagSet.add("includes-pricing");
    evidence["includes-pricing"] = pricingEv;
  }

  // includes-event - CAP-CODE-07 정정 - flag 보존 + 격상만 제외
  const eventEv = spansFromRegex(body, EVENT_REGEX);
  if (eventEv.length > 0) {
    flagSet.add("includes-event");   // 항상 add (감사 정보 보존)
    evidence["includes-event"] = eventEv;
    if (shouldSkipLevelUp("includes-event", input)) {
      suppressedLevelUp.add("includes-event");   // RiskInference 격상만 제외
    }
  }

  // includes-before-after
  const baEv: Array<{ location: MatchSpan; matchedText: string }> = [];
  const baMatches = spansFromRegex(body, BEFORE_AFTER_REGEX);
  baEv.push(...baMatches);
  // ReviewPolicy + media attachment 부가 입력
  if (input.reviewPolicy?.beforeAfterPhotoAllowed === true && (input.mediaAttachments?.length ?? 0) > 0) {
    baEv.push({ location: { start: 0, end: 0 }, matchedText: "(meta:beforeAfterPhotoAllowed+mediaAttachments)" });
  }
  if (baEv.length > 0) {
    flagSet.add("includes-before-after");
    evidence["includes-before-after"] = baEv;
  }

  // includes-testimonial - testimonial-001 finding category 기반 (CAP-20)
  for (const f of findings) {
    if (f.ruleId === "testimonial-001") {
      flagSet.add("includes-testimonial");
      const arr = evidence["includes-testimonial"] ?? [];
      arr.push({ location: f.location, matchedText: f.pattern });
      evidence["includes-testimonial"] = arr;
    }
  }

  return {
    inlineRiskFlags: Array.from(flagSet),
    evidence,
    suppressedLevelUp: Array.from(suppressedLevelUp),   // CAP-CODE-07 - RiskInference 안 격상 제외 영역
  };
}
