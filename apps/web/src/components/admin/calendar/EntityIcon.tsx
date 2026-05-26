// @glitzy/web/components/admin/calendar/EntityIcon — entity type 별 emoji.
// CONTENT_CALENDAR_PLAN v1.0 § 2.3 · cycle 1 #9 + cycle 2 #18.

import type { CalendarEntityType } from "@/lib/admin/calendar-events";

const ENTITY_ICON: Record<CalendarEntityType, string> = {
  Article: "📝",
  TreatmentPage: "🏥",
  MedicalConditionPage: "🩺",
  FAQ: "💬",
  Publication: "📚",
  MediaAppearance: "🎬",
  LegalDocument: "⚖️",
};

const ENTITY_LABEL: Record<CalendarEntityType, string> = {
  Article: "아티클",
  TreatmentPage: "시술/진료",
  MedicalConditionPage: "증상",
  FAQ: "FAQ",
  Publication: "논문",
  MediaAppearance: "미디어",
  LegalDocument: "법적 문서",
};

export function entityIcon(type: CalendarEntityType): string {
  return ENTITY_ICON[type];
}

export function entityLabel(type: CalendarEntityType): string {
  return ENTITY_LABEL[type];
}

const LEGAL_DOCUMENT_TYPE_LABEL: Record<string, string> = {
  privacy: "개인정보처리방침",
  terms: "이용약관",
  "non-covered": "비급여 안내",
  refund: "환불 약관",
  complaint: "민원 처리",
  cookie: "쿠키 정책",
  other: "기타",
};

/** LegalDocument 안 slug 또는 type 안 한글 label (cycle 1 #9). */
export function legalDocumentTypeLabel(slugOrType: string): string {
  return LEGAL_DOCUMENT_TYPE_LABEL[slugOrType] ?? slugOrType;
}

/** entity 의 admin edit page link (cycle 2 #18). */
export function entityEditLink(instanceSlug: string, entityType: CalendarEntityType, entitySlug: string): string {
  const base = `/admin/${instanceSlug}`;
  switch (entityType) {
    case "Article": return `${base}/articles/${entitySlug}`;
    case "TreatmentPage": return `${base}/treatments/${entitySlug}`;
    case "MedicalConditionPage": return `${base}/conditions/${entitySlug}`;
    case "FAQ": return `${base}/faqs/${entitySlug}`;
    case "Publication": return `${base}/publications/${entitySlug}`;
    case "MediaAppearance": return `${base}/media-appearances/${entitySlug}`;
    case "LegalDocument": return `${base}/clinic-profile#legal`;
  }
}

export const EVENT_TYPE_EMOJI: Record<"published" | "effective" | "stale-threshold", string> = {
  published: "🟢",
  effective: "🟦",
  "stale-threshold": "🟡",
};

export const EVENT_TYPE_LABEL: Record<"published" | "effective" | "stale-threshold", string> = {
  published: "발행",
  effective: "발효",
  "stale-threshold": "stale 임박",
};
