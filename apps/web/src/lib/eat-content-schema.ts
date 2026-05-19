// @glitzy/web/lib/eat-content-schema — EAT_CONTENT_PLAN v1.0 § 4.3 EC-FORM-03
//
// Publication · MediaAppearance · Faq · ArticleCategory 어드민 폼 통합 zod SoT.
// DB CHECK 정합 — DOI anchored regex (cycle 1 ECP-08) · status enum subset (cycle 1 ECP-10·11).
//
// v0.1 단계 status zod = z.enum(['draft']) 만. EC-DEFER-12 까지 — compliance-assistant + risk 자동 추론 합류 시점.

import { z } from "zod";
import { UUID_V4_REGEX } from "@glitzy/shared-types";

// === 공통 helper ===

const requiredTrimmed = (min: number, max: number, label: string) =>
  z
    .string({ required_error: `${label}은(는) 필수입니다.` })
    .transform((v) => v.trim())
    .refine((v) => v.length >= min, { message: `${label}은(는) ${min}자 이상이어야 합니다.` })
    .refine((v) => v.length <= max, { message: `${label}은(는) ${max}자를 넘을 수 없습니다.` });

const optionalTrimmed = (max: number) =>
  z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || v.length <= max, {
      message: `최대 ${max}자입니다.`,
    });

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const isoDateRequired = (label: string) =>
  z
    .string({ required_error: `${label}은(는) 필수입니다.` })
    .transform((v) => v.trim())
    .refine((v) => ISO_DATE_REGEX.test(v), { message: `${label}은(는) ISO 형식 (YYYY-MM-DD)` })
    .refine(
      (v) => {
        const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (m === null) return false;
        const y = Number(m[1]);
        const mo = Number(m[2]);
        const d = Number(m[3]);
        const dt = new Date(Date.UTC(y, mo - 1, d));
        return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
      },
      { message: `${label}은(는) 실제 존재하는 날짜여야 합니다.` },
    );

const httpUrlRequired = (label: string) =>
  z
    .string({ required_error: `${label}은(는) 필수입니다.` })
    .transform((v) => v.trim())
    .refine((v) => /^https?:\/\//.test(v), { message: `${label}은(는) http:// 또는 https:// 로 시작해야 합니다.` })
    .refine((v) => v.length <= 2048, { message: `${label}은(는) 2048자를 넘을 수 없습니다.` });

const httpUrlOptional = () =>
  z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || (/^https?:\/\//.test(v) && v.length <= 2048), {
      message: "URL 은 http/https · 2048자",
    });

const uuidOptional = (label: string) =>
  z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || UUID_V4_REGEX.test(v), {
      message: `${label}은(는) UUID 형식이어야 합니다.`,
    });

const intOptional = (min: number, label: string) =>
  z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || /^[0-9]+$/.test(v), {
      message: `${label}은(는) 양의 정수`,
    })
    .refine((v) => v === null || v === undefined || Number(v) >= min, {
      message: `${label}은(는) ${min} 이상`,
    });

const intRequired = (min: number, max: number, label: string) =>
  z
    .string({ required_error: `${label}은(는) 필수입니다.` })
    .transform((v) => v.trim())
    .refine((v) => /^[0-9]+$/.test(v), { message: `${label}은(는) 양의 정수` })
    .refine((v) => {
      const n = Number(v);
      return n >= min && n <= max;
    }, { message: `${label}은(는) ${min}~${max}` });

// EC-FORM-02 + CWI-01 정정: status field 자체 form schema 에서 제거.
//   status 전이는 workflow action (submitForReview · publishContent) 만 변경.
//   save action 안 form 의 status 값 무시 + DB 안 current status 보존.
//   (구) EatStatusSchema z.enum(['draft']) 는 deprecated — 호환성 위해 export 유지.
export const EatStatusSchema = z.enum(["draft"], {
  errorMap: () => ({ message: "v0.1 단계 발행 상태는 draft 만 허용됩니다 (deprecated · CWI-01 정정)" }),
});

// EC-FORM-03 (DOI anchored — DB CHECK 와 동일)
export const DOI_REGEX = /^10\.[0-9]{4,9}\/[-._;()/:A-Z0-9a-z]+$/;
export const PUBMED_ID_REGEX = /^[0-9]{1,9}$/;
export const SLUG_REGEX_LONG = /^[a-z0-9][a-z0-9-]{2,99}$/;
export const SLUG_REGEX_SHORT = /^[a-z0-9][a-z0-9-]{2,63}$/;

// === ArticleCategory ===

export const ArticleCategoryInputSchema = z.object({
  slug: requiredTrimmed(3, 64, "slug").refine((v) => SLUG_REGEX_SHORT.test(v), {
    message: "slug 는 소문자/숫자/하이픈 (3~64자)",
  }),
  name: requiredTrimmed(1, 50, "이름"),
  description: optionalTrimmed(200).refine(
    (v) => v === null || v === undefined || v.length >= 80,
    { message: "설명은 입력 시 80~200자" },
  ),
  displayOrder: intRequired(0, 9999, "표시 순서"),
});

export type ArticleCategoryInput = z.infer<typeof ArticleCategoryInputSchema>;

// === Publication ===

const authorsSchema = z
  .string({ required_error: "저자는 필수입니다." })
  .transform((v) => v.trim())
  .transform((v) =>
    v
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0),
  )
  .refine((arr) => arr.length >= 1, { message: "저자는 1명 이상" })
  .refine((arr) => arr.every((s) => s.length <= 100), { message: "저자명은 100자 이내" });

export const PublicationInputSchema = z.object({
  slug: requiredTrimmed(3, 100, "slug").refine((v) => SLUG_REGEX_LONG.test(v), {
    message: "slug 는 소문자/숫자/하이픈 (3~100자)",
  }),
  title: requiredTrimmed(1, 300, "제목"),
  authors: authorsSchema,
  journal: optionalTrimmed(200),
  publishedDate: isoDateRequired("게재일"),
  doi: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || DOI_REGEX.test(v), {
      message: "DOI 형식 오류 (예: 10.1000/xyz123)",
    }),
  pubmedId: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || PUBMED_ID_REGEX.test(v), {
      message: "PubMed ID 는 1~9 자리 숫자",
    }),
  url: httpUrlRequired("URL"),
  thumbnailUrl: httpUrlOptional(),
  summary: requiredTrimmed(50, 300, "요약"),
  authorDoctorId: uuidOptional("저자(의료진)"),
  // CWI-01 정정: status field 제거 — workflow action 만 status 전이.
});

export type PublicationInput = z.infer<typeof PublicationInputSchema>;

// === MediaAppearance ===

export const MEDIA_CHANNEL_TYPES = ["broadcast", "youtube", "podcast", "press"] as const;

export const MediaAppearanceInputSchema = z.object({
  slug: requiredTrimmed(3, 100, "slug").refine((v) => SLUG_REGEX_LONG.test(v), {
    message: "slug 는 소문자/숫자/하이픈 (3~100자)",
  }),
  title: requiredTrimmed(1, 300, "제목"),
  channelName: requiredTrimmed(1, 100, "채널명"),
  channelType: z.enum(MEDIA_CHANNEL_TYPES, {
    errorMap: () => ({ message: "채널 종류는 broadcast/youtube/podcast/press 중 하나" }),
  }),
  publishedDate: isoDateRequired("게재일"),
  durationSeconds: intOptional(1, "길이(초)"),
  url: httpUrlRequired("URL"),
  thumbnailUrl: httpUrlOptional(),
  summary: requiredTrimmed(50, 300, "요약"),
  authorDoctorId: uuidOptional("출연 의료진"),
  // CWI-01 정정: status field 제거 — workflow action 만 status 전이.
});

export type MediaAppearanceInput = z.infer<typeof MediaAppearanceInputSchema>;

// === FAQ ===

export const FaqInputSchema = z.object({
  slug: requiredTrimmed(3, 100, "slug").refine((v) => SLUG_REGEX_LONG.test(v), {
    message: "slug 는 소문자/숫자/하이픈 (3~100자)",
  }),
  question: requiredTrimmed(10, 200, "질문"),
  answer: requiredTrimmed(50, 2000, "답변"),
  displayOrder: intRequired(0, 9999, "표시 순서"),
  categoryId: uuidOptional("카테고리"),
  authorDoctorId: uuidOptional("작성자(의료진)"),
  relatedTreatmentId: uuidOptional("관련 진료 페이지"),
  // CWI-01 정정: status field 제거 — workflow action 만 status 전이.
});

export type FaqInput = z.infer<typeof FaqInputSchema>;
