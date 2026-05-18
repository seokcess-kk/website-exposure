// @glitzy/core-content/templates — LOCATION_LEGAL_PLAN v1.0 § 5
//
// LL-TEMPLATE-04 marker: 본 5종 표준 템플릿 본문은 본 plan 의 검토 범위 외.
// 법무 검토 필수 — 별도 cascade 로 법무 검토 받은 본문으로 교체.

import {
  PRIVACY_BODY,
  TERMS_BODY,
  NON_COVERED_BODY,
  REFUND_BODY,
  COMPLAINT_BODY,
} from "./bodies.js";

export type ClosedLegalDocumentType =
  | "privacy"
  | "terms"
  | "non-covered"
  | "refund"
  | "complaint";

export type LegalDocumentType = ClosedLegalDocumentType | "cookie" | "other";

export type Template = {
  readonly documentType: ClosedLegalDocumentType;
  readonly slug: string;
  readonly title: string;
  readonly version: string;
  readonly body: string;
};

export const TEMPLATES: Record<ClosedLegalDocumentType, Template> = {
  privacy: {
    documentType: "privacy",
    slug: "privacy",
    title: "개인정보처리방침",
    version: "privacy@1.0.0",
    body: PRIVACY_BODY,
  },
  terms: {
    documentType: "terms",
    slug: "terms",
    title: "이용약관",
    version: "terms@1.0.0",
    body: TERMS_BODY,
  },
  "non-covered": {
    documentType: "non-covered",
    slug: "non-covered",
    title: "비급여 진료비 안내",
    version: "non-covered@1.0.0",
    body: NON_COVERED_BODY,
  },
  refund: {
    documentType: "refund",
    slug: "refund",
    title: "환불 규정",
    version: "refund@1.0.0",
    body: REFUND_BODY,
  },
  complaint: {
    documentType: "complaint",
    slug: "complaint",
    title: "민원 처리 안내",
    version: "complaint@1.0.0",
    body: COMPLAINT_BODY,
  },
};

export const CLOSED_DOCUMENT_TYPES: readonly ClosedLegalDocumentType[] = [
  "privacy",
  "terms",
  "non-covered",
  "refund",
  "complaint",
];

// LL-ACTION-04 patch: alpha sort (deadlock 회피 순서) — server action 안 잠금 순서와 동일.
export const CLOSED_DOCUMENT_TYPES_ALPHA: readonly ClosedLegalDocumentType[] = [
  "complaint",
  "non-covered",
  "privacy",
  "refund",
  "terms",
];

export { renderTemplate, listTemplateVariables, TemplateRenderError } from "./render.js";
export type { RenderContext } from "./render.js";
