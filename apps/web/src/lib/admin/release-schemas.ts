// @glitzy/web/lib/admin/release-schemas — ADMIN_UX_REDESIGN v1.0 § 5.2
//
// "출시 schema" — release evaluator 와 정합 (엄격).
//   - save-schemas.ts 안 동일 필드 + 필수성/길이 강화.
//   - 출시 trigger 시점 (release evaluator) 안 사용.
//   - 기존 actions.ts 안 InputSchema 도 release schema 와 동등 — alias 재export.
//
// release evaluator 안 entity 별 logic 와 1:1 정합 (release-evaluator.ts 안 evaluateXRelease).

import { z } from "zod";
import { UUID_V4_REGEX } from "@glitzy/shared-types";

// === 공통 helper ===

const requiredTrimmed = (min: number, max: number, label: string) =>
  z
    .string({ required_error: `${label}은(는) 필수입니다.` })
    .transform((v) => v.trim())
    .refine((v) => v.length >= min, { message: `${label}은(는) ${min}자 이상` })
    .refine((v) => v.length <= max, { message: `${label}은(는) ${max}자 이내` });

const httpUrlRequired = (label: string, max = 2048) =>
  z
    .string({ required_error: `${label}은(는) 필수입니다.` })
    .transform((v) => v.trim())
    .refine((v) => /^https?:\/\//.test(v), { message: `${label}은(는) http/https` })
    .refine((v) => v.length <= max, { message: `${label}은(는) ${max}자 이내` });

// C0055 — OG 이미지 선택 입력 (비우면 렌더타임 로고 폴백)
const httpUrlOptional = (label: string, max = 2048) =>
  z
    .string()
    .optional()
    .transform((v) => (v ?? "").trim())
    .transform((v) => (v === "" ? null : v))
    .refine((v) => v === null || (/^https?:\/\//.test(v) && v.length <= max), {
      message: `${label}은(는) http/https · ${max}자 이내`,
    });

const isoDateRequired = (label: string) =>
  z
    .string({ required_error: `${label}은(는) 필수입니다.` })
    .transform((v) => v.trim())
    .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), { message: `${label}은(는) ISO 날짜` });

// === 1. ClinicProfile (release) ===
//   evaluateClinicProfileRelease 정합: name + description(80자+) + logo + og + 정책담당자 3종 + ctas 1+

export const clinicProfileReleaseSchema = z.object({
  name: requiredTrimmed(1, 100, "병원명"),
  description: requiredTrimmed(80, 300, "병원 소개"),
  logoUrl: httpUrlRequired("로고 URL"),
  // C0055 — OG 선택 입력 (미설정 시 로고 폴백 · release-evaluator 도 동일 완화)
  ogImageUrl: httpUrlOptional("OG 이미지 URL"),
  policyContactPerson: requiredTrimmed(1, 100, "정책 담당자 이름"),
  policyContactEmail: z
    .string({ required_error: "정책 담당자 이메일 필수" })
    .email("이메일 형식 오류")
    .max(200),
  policyContactPhone: requiredTrimmed(1, 30, "정책 담당자 전화"),
});
export type ClinicProfileReleaseInput = z.infer<typeof clinicProfileReleaseSchema>;

// === 2. LocationProfile (release) ===
//   evaluateLocationProfileRelease 정합: 시·도 + 시·군·구 + 도로명 + businessHours 1+ 요일

export const locationProfileReleaseSchema = z.object({
  streetAddress: requiredTrimmed(1, 200, "도로명 주소"),
  addressLocality: requiredTrimmed(1, 100, "시·군·구"),
  addressRegion: requiredTrimmed(1, 100, "시·도"),
  postalCode: requiredTrimmed(1, 20, "우편번호"),
  // businessHours 안 평일 1+ 영업 검증은 형 외 — release-evaluator.ts 안 hasBusinessHours boolean.
  hasBusinessHours: z.boolean().refine((v) => v === true, { message: "진료시간 1+ 요일 설정 필요" }),
  primaryCtasCount: z.number().min(1, "예약 채널 1+ 필요"),
});
export type LocationProfileReleaseInput = z.infer<typeof locationProfileReleaseSchema>;

// === 3. DoctorProfile (release) ===
//   release evaluator 안 active 의료진 1명 이상. entity 단위 release validation 안 강한 필드는 name 만.

export const doctorProfileReleaseSchema = z.object({
  slug: requiredTrimmed(3, 64, "slug").refine((v) => /^[a-z0-9][a-z0-9-]{2,63}$/.test(v), {
    message: "slug 는 소문자/숫자/하이픈",
  }),
  name: requiredTrimmed(1, 100, "이름"),
  active: z.boolean(),
});
export type DoctorProfileReleaseInput = z.infer<typeof doctorProfileReleaseSchema>;

// === 4. TreatmentPage (release) ===
//   release 시 published 전이 가능: title + summary + body 모두 입력.

export const treatmentPageReleaseSchema = z.object({
  slug: requiredTrimmed(3, 100, "slug").refine((v) => /^[a-z0-9][a-z0-9-]{2,99}$/.test(v), {
    message: "slug 는 소문자/숫자/하이픈",
  }),
  title: requiredTrimmed(1, 200, "제목"),
  summary: requiredTrimmed(50, 160, "요약"),
  bodyMarkdown: requiredTrimmed(1, 50_000, "본문"),
});
export type TreatmentPageReleaseInput = z.infer<typeof treatmentPageReleaseSchema>;

// === 5. Article (release) ===

export const articleReleaseSchema = z.object({
  slug: requiredTrimmed(3, 100, "slug").refine((v) => /^[a-z0-9][a-z0-9-]{2,99}$/.test(v), {
    message: "slug 는 소문자/숫자/하이픈",
  }),
  title: requiredTrimmed(1, 200, "제목"),
  summary: requiredTrimmed(80, 200, "요약"),
  bodyMarkdown: requiredTrimmed(1, 100_000, "본문"),
  categoryId: z.string().refine((v) => UUID_V4_REGEX.test(v), { message: "카테고리 UUID 필수" }),
});
export type ArticleReleaseInput = z.infer<typeof articleReleaseSchema>;

// === 6. FAQ (release) ===

export const faqReleaseSchema = z.object({
  slug: requiredTrimmed(3, 100, "slug").refine((v) => /^[a-z0-9][a-z0-9-]{2,99}$/.test(v), {
    message: "slug 는 소문자/숫자/하이픈",
  }),
  question: requiredTrimmed(10, 200, "질문"),
  answer: requiredTrimmed(50, 2000, "답변"),
  displayOrder: z.number().int().min(0).max(9999),
});
export type FaqReleaseInput = z.infer<typeof faqReleaseSchema>;

// === 7. Publication (release) ===

const DOI_REGEX = /^10\.[0-9]{4,9}\/[-._;()/:A-Z0-9a-z]+$/;
const PUBMED_ID_REGEX = /^[0-9]{1,9}$/;

const authorsRequired = z
  .string({ required_error: "저자 필수" })
  .transform((v) =>
    v
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0),
  )
  .refine((arr) => arr.length >= 1, { message: "저자 1명 이상" });

export const publicationReleaseSchema = z.object({
  slug: requiredTrimmed(3, 100, "slug"),
  title: requiredTrimmed(1, 300, "제목"),
  authors: authorsRequired,
  publishedDate: isoDateRequired("게재일"),
  url: httpUrlRequired("URL"),
  summary: requiredTrimmed(50, 300, "요약"),
  doi: z
    .string()
    .optional()
    .nullable()
    .refine((v) => !v || DOI_REGEX.test(v), { message: "DOI 형식" }),
  pubmedId: z
    .string()
    .optional()
    .nullable()
    .refine((v) => !v || PUBMED_ID_REGEX.test(v), { message: "PubMed ID 1~9자리" }),
});
export type PublicationReleaseInput = z.infer<typeof publicationReleaseSchema>;

// === 8. MediaAppearance (release) ===

export const MEDIA_CHANNEL_TYPES_RELEASE = ["broadcast", "youtube", "podcast", "press"] as const;

export const mediaAppearanceReleaseSchema = z.object({
  slug: requiredTrimmed(3, 100, "slug"),
  title: requiredTrimmed(1, 300, "제목"),
  channelName: requiredTrimmed(1, 100, "채널명"),
  channelType: z.enum(MEDIA_CHANNEL_TYPES_RELEASE),
  publishedDate: isoDateRequired("게재일"),
  url: httpUrlRequired("URL"),
  summary: requiredTrimmed(50, 300, "요약"),
});
export type MediaAppearanceReleaseInput = z.infer<typeof mediaAppearanceReleaseSchema>;

// === 9. LegalDocument (release) ===
//   5종 정책 문서 모두 status='published'. effectiveDate 필수.

export const legalDocumentReleaseSchema = z.object({
  documentType: z.enum(["privacy", "terms", "non-covered", "refund", "complaint"]),
  effectiveDate: isoDateRequired("정책 시행일"),
  bodyMarkdown: z
    .string()
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || v.length <= 50_000, { message: "본문 50000자 이내" }),
});
export type LegalDocumentReleaseInput = z.infer<typeof legalDocumentReleaseSchema>;

// === 10. ArticleCategory (release) ===

export const articleCategoryReleaseSchema = z.object({
  slug: requiredTrimmed(3, 64, "slug").refine((v) => /^[a-z0-9][a-z0-9-]{2,63}$/.test(v), {
    message: "slug 는 소문자/숫자/하이픈",
  }),
  name: requiredTrimmed(1, 50, "이름"),
  description: z
    .string()
    .optional()
    .nullable()
    .refine((v) => !v || (v.length >= 80 && v.length <= 200), { message: "설명 입력 시 80~200자" }),
  displayOrder: z.number().int().min(0).max(9999),
});
export type ArticleCategoryReleaseInput = z.infer<typeof articleCategoryReleaseSchema>;
