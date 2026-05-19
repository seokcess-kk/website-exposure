// @glitzy/web/lib/admin/save-schemas — ADMIN_UX_REDESIGN v1.0 § 5.2
//
// "저장 schema" — DB CHECK 정합 만 검증 (느슨). 출시 evaluator 와 분리.
//   - 자동저장 / wizard 단계 저장 / draft 저장 안 사용.
//   - 필수성/길이 등 release-only constraint 는 제거.
//   - DB NOT NULL / 형식 (URL/email/phone/date) 만 검증.
//
// 10 entity:
//   1. ClinicProfile
//   2. LocationProfile
//   3. DoctorProfile
//   4. TreatmentPage
//   5. Article
//   6. FAQ
//   7. Publication
//   8. MediaAppearance
//   9. LegalDocument (effectiveDate override · clinic-profile 통합)
//   10. ArticleCategory

import { z } from "zod";
import { UUID_V4_REGEX } from "@glitzy/shared-types";

// === 공통 helper ===

const trimNullable = (max = 10_000) =>
  z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || v.length <= max, { message: `최대 ${max}자` });

const httpUrlNullable = (max = 2048) =>
  z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine(
      (v) => v === null || v === undefined || (/^https?:\/\//.test(v) && v.length <= max),
      { message: `URL 은 http/https · ${max}자 이내` },
    );

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
const PHONE_REGEX = /^(?:(?:\+82-?[1-9][0-9]?|0[1-9][0-9]?)(?:[- ]?[0-9]{3,4}){2}|1[5-9][0-9]{2}[- ]?[0-9]{4})$/;

const isoDateNullable = z
  .string()
  .transform((v) => v.trim())
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional()
  .refine((v) => v === null || v === undefined || ISO_DATE_REGEX.test(v), { message: "ISO 날짜 (YYYY-MM-DD)" });

const phoneNullable = z
  .string()
  .transform((v) => v.trim())
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional()
  .refine((v) => v === null || v === undefined || PHONE_REGEX.test(v), {
    message: "전화번호 형식이 올바르지 않습니다 (예: 02-1234-5678 / 010-1234-5678 / 1533-8191).",
  });

const emailNullable = z
  .string()
  .transform((v) => v.trim())
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional()
  .refine(
    (v) => v === null || v === undefined || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
    "이메일 형식이 올바르지 않습니다.",
  );

const uuidNullable = z
  .string()
  .transform((v) => v.trim())
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional()
  .refine((v) => v === null || v === undefined || UUID_V4_REGEX.test(v), { message: "UUID 형식 오류" });

const slugRequired = (min = 3, max = 100) =>
  z
    .string({ required_error: "slug 는 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => new RegExp(`^[a-z0-9][a-z0-9-]{${min - 1},${max - 1}}$`).test(v), {
      message: `slug 는 ${min}~${max}자 (소문자/숫자/하이픈)`,
    });

// === 1. ClinicProfile (save) ===

export const clinicProfileSaveSchema = z.object({
  name: trimNullable(100),
  description: trimNullable(300),
  logoUrl: httpUrlNullable(),
  ogImageUrl: httpUrlNullable(),
  businessRegistrationNumber: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v.trim()))
    .nullable()
    .optional()
    .refine(
      (v) => v === null || v === undefined || /^\d{3}-\d{2}-\d{5}$/.test(v),
      "사업자등록번호 형식이 올바르지 않습니다 (000-00-00000).",
    ),
  alternateName: trimNullable(100),
  legalEntityName: trimNullable(200),
  slogan: trimNullable(200),
  longDescription: trimNullable(2000),
  foundingDate: isoDateNullable,
  founder: trimNullable(100),
});
export type ClinicProfileSaveInput = z.infer<typeof clinicProfileSaveSchema>;

// === 2. LocationProfile (save) ===

const dayInputSave = z
  .object({
    closed: z.boolean(),
    open: z.string().optional(),
    close: z.string().optional(),
    lunchEnabled: z.boolean(),
    lunchFrom: z.string().optional(),
    lunchTo: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.closed) return;
    if (val.open && !TIME_REGEX.test(val.open)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "오픈 시간 형식 (HH:mm)", path: ["open"] });
    }
    if (val.close && !TIME_REGEX.test(val.close)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "마감 시간 형식 (HH:mm)", path: ["close"] });
    }
    if (val.lunchEnabled) {
      if (val.lunchFrom && !TIME_REGEX.test(val.lunchFrom)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "점심 시작 형식 (HH:mm)", path: ["lunchFrom"] });
      }
      if (val.lunchTo && !TIME_REGEX.test(val.lunchTo)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "점심 종료 형식 (HH:mm)", path: ["lunchTo"] });
      }
    }
  });

export const businessHoursSaveSchema = z.object({
  monday: dayInputSave,
  tuesday: dayInputSave,
  wednesday: dayInputSave,
  thursday: dayInputSave,
  friday: dayInputSave,
  saturday: dayInputSave,
  sunday: dayInputSave,
});

const primaryCtaSave = z.object({
  id: z.string().min(1).max(64),
  type: z.enum(["phone", "kakao-talk", "naver-reservation"]),
  label: z.string().min(1).max(100),
  targetUrl: z.string().min(1).max(2048),
});

export const locationProfileSaveSchema = z.object({
  streetAddress: trimNullable(200),
  addressLocality: trimNullable(100),
  addressRegion: trimNullable(100),
  postalCode: trimNullable(20),
  addressCountry: z
    .string()
    .default("KR")
    .refine((v) => /^[A-Z]{2}$/.test(v), { message: "국가 코드는 ISO alpha-2" }),
  locationTelephone: phoneNullable,
  locationEmail: emailNullable,
  businessHours: businessHoursSaveSchema.optional(),
  primaryCtas: z.array(primaryCtaSave).max(3).optional(),
  featuredChannelId: z.string().max(64).optional(),
});
export type LocationProfileSaveInput = z.infer<typeof locationProfileSaveSchema>;

// === 3. DoctorProfile (save) ===

export const doctorProfileSaveSchema = z.object({
  slug: slugRequired(3, 64),
  name: trimNullable(100),
  title: trimNullable(100),
  jobTitle: trimNullable(100),
  honorific: trimNullable(20),
  bio: trimNullable(5000),
  photoUrl: httpUrlNullable(),
  displayOrder: z
    .string()
    .transform((v) => (v.trim() === "" ? "0" : v.trim()))
    .refine((v) => /^-?\d+$/.test(v), { message: "표시 순서는 정수" })
    .transform((v) => parseInt(v, 10))
    .refine((n) => Number.isFinite(n) && n >= -2_147_483_648 && n <= 2_147_483_647, {
      message: "표시 순서 범위 오류",
    }),
  active: z
    .string()
    .optional()
    .transform((v) => v === "true" || v === "on"),
});
export type DoctorProfileSaveInput = z.infer<typeof doctorProfileSaveSchema>;

// === 4. TreatmentPage (save) ===

const RISK_LEVELS = ["Low", "Medium", "High"] as const;

export const treatmentPageSaveSchema = z.object({
  slug: slugRequired(3, 100),
  title: trimNullable(200),
  summary: trimNullable(300),
  bodyMarkdown: trimNullable(50_000),
  riskLevel: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || (RISK_LEVELS as readonly string[]).includes(v), {
      message: "위험도는 Low/Medium/High",
    }),
  heroImageUrl: httpUrlNullable(),
});
export type TreatmentPageSaveInput = z.infer<typeof treatmentPageSaveSchema>;

// === 5. Article (save) ===

export const articleSaveSchema = z.object({
  slug: slugRequired(3, 100),
  title: trimNullable(200),
  summary: trimNullable(300),
  bodyMarkdown: trimNullable(100_000),
  riskLevel: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || (RISK_LEVELS as readonly string[]).includes(v), {
      message: "위험도는 Low/Medium/High",
    }),
  heroImageUrl: httpUrlNullable(),
  authorDoctorId: uuidNullable,
  categoryId: uuidNullable,
});
export type ArticleSaveInput = z.infer<typeof articleSaveSchema>;

// === 6. FAQ (save) ===

export const faqSaveSchema = z.object({
  slug: slugRequired(3, 100),
  question: trimNullable(500),
  answer: trimNullable(5000),
  displayOrder: z
    .string()
    .transform((v) => (v.trim() === "" ? "0" : v.trim()))
    .refine((v) => /^\d+$/.test(v), { message: "표시 순서는 양의 정수" })
    .transform((v) => parseInt(v, 10))
    .refine((n) => n >= 0 && n <= 9999, { message: "표시 순서 0~9999" }),
  categoryId: uuidNullable,
  authorDoctorId: uuidNullable,
  relatedTreatmentId: uuidNullable,
});
export type FaqSaveInput = z.infer<typeof faqSaveSchema>;

// === 7. Publication (save) ===

const DOI_REGEX = /^10\.[0-9]{4,9}\/[-._;()/:A-Z0-9a-z]+$/;
const PUBMED_ID_REGEX = /^[0-9]{1,9}$/;

const authorsSaveSchema = z
  .string()
  .optional()
  .transform((v) => {
    if (!v || v.trim() === "") return [] as string[];
    return v
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  })
  .refine((arr) => arr.every((s) => s.length <= 100), { message: "저자명은 100자 이내" });

export const publicationSaveSchema = z.object({
  slug: slugRequired(3, 100),
  title: trimNullable(500),
  authors: authorsSaveSchema,
  journal: trimNullable(200),
  publishedDate: isoDateNullable,
  doi: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || DOI_REGEX.test(v), { message: "DOI 형식 오류" }),
  pubmedId: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || PUBMED_ID_REGEX.test(v), { message: "PubMed ID 1~9자리" }),
  url: httpUrlNullable(),
  thumbnailUrl: httpUrlNullable(),
  summary: trimNullable(500),
  authorDoctorId: uuidNullable,
});
export type PublicationSaveInput = z.infer<typeof publicationSaveSchema>;

// === 8. MediaAppearance (save) ===

export const MEDIA_CHANNEL_TYPES_SAVE = ["broadcast", "youtube", "podcast", "press"] as const;

export const mediaAppearanceSaveSchema = z.object({
  slug: slugRequired(3, 100),
  title: trimNullable(500),
  channelName: trimNullable(100),
  channelType: z
    .enum(MEDIA_CHANNEL_TYPES_SAVE)
    .optional(),
  publishedDate: isoDateNullable,
  durationSeconds: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v.trim()))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || /^\d+$/.test(v), { message: "길이는 양의 정수" }),
  url: httpUrlNullable(),
  thumbnailUrl: httpUrlNullable(),
  summary: trimNullable(500),
  authorDoctorId: uuidNullable,
});
export type MediaAppearanceSaveInput = z.infer<typeof mediaAppearanceSaveSchema>;

// === 9. LegalDocument (save) — effectiveDate + body override ===

export const legalDocumentSaveSchema = z.object({
  bodyMarkdown: trimNullable(50_000),
  effectiveDate: isoDateNullable,
});
export type LegalDocumentSaveInput = z.infer<typeof legalDocumentSaveSchema>;

// === 10. ArticleCategory (save) ===

export const articleCategorySaveSchema = z.object({
  slug: slugRequired(3, 64),
  name: trimNullable(50),
  description: trimNullable(500),
  displayOrder: z
    .string()
    .transform((v) => (v.trim() === "" ? "0" : v.trim()))
    .refine((v) => /^\d+$/.test(v), { message: "표시 순서는 양의 정수" })
    .transform((v) => parseInt(v, 10))
    .refine((n) => n >= 0 && n <= 9999, { message: "표시 순서 0~9999" }),
});
export type ArticleCategorySaveInput = z.infer<typeof articleCategorySaveSchema>;
