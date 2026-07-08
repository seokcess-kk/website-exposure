// @glitzy/web/lib/clinic-profile-schema — LOCATION_LEGAL_PLAN v1.0 § 3.2
//
// ClinicProfile + LocationProfile(main) + 5 LegalDocument override 통합 zod schema SoT.
// form / server action 양쪽 모두 동일 SoT (LL-FORM-09).
//
// 변수 정합성:
//   - businessHours 7요일 + 점심 (LL-FORM-07/10)
//   - primaryCtas 3종 minimal (CT-03 SoT token: phone/kakao-talk/naver-reservation — cycle4 LL-51)
//   - 5종 LegalDocument effectiveDate override (LL-FORM-13 · cycle3 LL-39 flat key + parser helper)

import { z } from "zod";
import { CLOSED_DOCUMENT_TYPES, type ClosedLegalDocumentType } from "@glitzy/core-content";

// === 공통 helper (apps/web v1.2 패턴 재사용) ===

const optionalStr = (max: number) =>
  z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || v.length <= max, {
      message: `최대 ${max}자입니다.`,
    });

const requiredTrimmed = (min: number, max: number, label: string) =>
  z
    .string({ required_error: `${label}은(는) 필수입니다.` })
    .transform((v) => v.trim())
    .refine((v) => v.length >= min, { message: `${label}은(는) ${min}자 이상이어야 합니다.` })
    .refine((v) => v.length <= max, { message: `${label}은(는) ${max}자를 넘을 수 없습니다.` });

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
// LL-FORM-12 (cycle1 LL-20): 한국 + 국제 +82 — '.' 구분자 거절
// 2026-05-19 patch: 대표번호 (1500~1999 4자리 + 4자리) 분기 추가 — 1533-8191 형태
const PHONE_REGEX = /^(?:(?:\+82-?[1-9][0-9]?|0[1-9][0-9]?)(?:[- ]?[0-9]{3,4}){2}|1[5-9][0-9]{2}[- ]?[0-9]{4})$/;

const optionalDate = z
  .string()
  .transform((v) => v.trim())
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional()
  .refine((v) => v === null || v === undefined || ISO_DATE_REGEX.test(v), {
    message: "날짜는 ISO 형식 (YYYY-MM-DD) 이어야 합니다.",
  })
  .refine(
    (v) => {
      if (v === null || v === undefined) return true;
      const [y, m, d] = v.split("-").map(Number) as [number, number, number];
      const dt = new Date(Date.UTC(y, m - 1, d));
      return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
    },
    { message: "유효한 날짜가 아닙니다." },
  );

const requiredDate = z
  .string({ required_error: "날짜는 필수입니다." })
  .transform((v) => v.trim())
  .refine((v) => ISO_DATE_REGEX.test(v), {
    message: "날짜는 ISO 형식 (YYYY-MM-DD) 이어야 합니다.",
  })
  .refine(
    (v) => {
      const [y, m, d] = v.split("-").map(Number) as [number, number, number];
      const dt = new Date(Date.UTC(y, m - 1, d));
      return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
    },
    { message: "유효한 날짜가 아닙니다." },
  );

// === BusinessHours (7요일 단순 입력 형식 — form input 단) ===

const dayInputSchema = z
  .object({
    closed: z.boolean(),
    open: z.string().optional(),
    close: z.string().optional(),
    lunchEnabled: z.boolean(),
    lunchFrom: z.string().optional(),
    lunchTo: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.closed) return; // 휴진 — 다른 입력 무시
    if (!val.open || !TIME_REGEX.test(val.open)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "오픈 시간이 올바르지 않습니다 (HH:mm).", path: ["open"] });
    }
    if (!val.close || !TIME_REGEX.test(val.close)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "마감 시간이 올바르지 않습니다 (HH:mm).", path: ["close"] });
    }
    if (val.open && val.close && TIME_REGEX.test(val.open) && TIME_REGEX.test(val.close)) {
      if (val.open >= val.close) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "오픈 시간이 마감 시간보다 빨라야 합니다.", path: ["close"] });
      }
    }
    if (val.lunchEnabled) {
      if (!val.lunchFrom || !TIME_REGEX.test(val.lunchFrom)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "점심 시작 시간이 올바르지 않습니다.", path: ["lunchFrom"] });
      }
      if (!val.lunchTo || !TIME_REGEX.test(val.lunchTo)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "점심 종료 시간이 올바르지 않습니다.", path: ["lunchTo"] });
      }
      if (
        val.lunchFrom && val.lunchTo &&
        TIME_REGEX.test(val.lunchFrom) && TIME_REGEX.test(val.lunchTo)
      ) {
        if (val.lunchFrom >= val.lunchTo) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "점심 시작이 종료보다 빨라야 합니다.", path: ["lunchTo"] });
        }
        if (val.open && val.close && (val.lunchFrom < val.open || val.lunchTo > val.close)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "점심 시간이 영업 시간 범위를 벗어났습니다.", path: ["lunchFrom"] });
        }
      }
    }
  });

export type DayInput = z.infer<typeof dayInputSchema>;

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
export type DayOfWeek = (typeof DAYS)[number];

export const businessHoursSchema = z
  .object({
    monday: dayInputSchema,
    tuesday: dayInputSchema,
    wednesday: dayInputSchema,
    thursday: dayInputSchema,
    friday: dayInputSchema,
    saturday: dayInputSchema,
    sunday: dayInputSchema,
  })
  .superRefine((val, ctx) => {
    // 평일 (mon~fri) 5일 중 1일 이상 영업 필수
    const weekdayOpen = (["monday", "tuesday", "wednesday", "thursday", "friday"] as const).some(
      (d) => !val[d].closed,
    );
    if (!weekdayOpen) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "평일 (월~금) 중 1일 이상은 영업해야 합니다.",
        path: ["monday"],
      });
    }
  });

export type BusinessHoursInput = z.infer<typeof businessHoursSchema>;

// === PrimaryCTA (CT-03 SoT — UI subset 3종: cycle4 LL-51) ===

const primaryCtaTypeEnum = z.enum(["phone", "kakao-talk", "naver-reservation"], {
  errorMap: () => ({ message: "예약 채널 유형이 올바르지 않습니다." }),
});

const primaryCtaSchema = z.object({
  id: z.string().min(1).max(64),
  type: primaryCtaTypeEnum,
  label: z.string().min(1).max(100),
  targetUrl: z.string().min(1).max(2048),
});

export type PrimaryCtaInput = z.infer<typeof primaryCtaSchema>;

export const primaryCtasSchema = z
  .array(primaryCtaSchema)
  .min(1, { message: "최소 1개의 예약 채널이 필요합니다." })
  .max(3, { message: "예약 채널은 최대 3개입니다." });

// === Section (a) ClinicProfile 기관 정체성 ===

const sectionASchema = z.object({
  name: requiredTrimmed(1, 100, "기관명"),
  description: requiredTrimmed(80, 300, "간략 소개"),
  logoUrl: z
    .string({ required_error: "로고 URL 은 필수입니다." })
    .transform((v) => v.trim())
    .pipe(z.string().url("로고 URL 형식이 올바르지 않습니다.").max(2048)),
  // C0055 — OG 는 선택 입력: 빈 값 → null → 사이트는 로고로 폴백 (faviconUrl 과 동일 패턴 ·
  // 의원정보 간소화). 공유 미리보기 최적 비율(1200×630)이 필요할 때만 별도 지정.
  ogImageUrl: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine(
      (v) => v === null || v === undefined || (v.length <= 2048 && z.string().url().safeParse(v).success),
      { message: "OG 이미지 URL 형식이 올바르지 않습니다." },
    ),
  // C0052 — 정사각형 전용 파비콘 URL. logo_url/og_image_url 과 동일한 이미지 URL 필드지만
  // 선택(빈 값 → null → 사이트는 로고 대체). URL 형식·max(2048) 는 logoUrl 규칙과 동일.
  faviconUrl: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine(
      (v) => v === null || v === undefined || (v.length <= 2048 && z.string().url().safeParse(v).success),
      { message: "파비콘 URL 형식이 올바르지 않습니다." },
    ),
  businessRegistrationNumber: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v.trim()))
    .nullable()
    .optional()
    .refine(
      (v) => v === null || v === undefined || /^\d{3}-\d{2}-\d{5}$/.test(v),
      "사업자등록번호 형식이 올바르지 않습니다 (000-00-00000).",
    ),
  alternateName: optionalStr(100),
  legalEntityName: optionalStr(200),
  slogan: optionalStr(200),
  longDescription: optionalStr(2000),
  foundingDate: optionalDate,
  founder: optionalStr(100),
});

// === Section (b) LocationProfile main ===

const sectionBSchema = z.object({
  streetAddress: requiredTrimmed(1, 200, "도로명 주소"),
  addressLocality: requiredTrimmed(1, 100, "시·군·구"),
  addressRegion: requiredTrimmed(1, 100, "시·도"),
  postalCode: requiredTrimmed(1, 20, "우편번호"),
  addressCountry: z
    .string()
    .default("KR")
    .refine((v) => /^[A-Z]{2}$/.test(v), { message: "국가 코드는 ISO 3166-1 alpha-2 (대문자 2자) 이어야 합니다." }),
  locationTelephone: z
    .string({ required_error: "본원 전화번호는 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => PHONE_REGEX.test(v), {
      message: "전화번호 형식이 올바르지 않습니다 (예: 02-1234-5678 / 010-1234-5678 / 1533-8191).",
    }),
  locationEmail: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine(
      (v) => v === null || v === undefined || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
      "이메일 형식이 올바르지 않습니다.",
    ),
  businessHours: businessHoursSchema,
  primaryCtas: primaryCtasSchema,
  featuredChannelId: z.string().min(1).max(64),
});

// === Section (c) Policy variables ===

const sectionCSchema = z.object({
  policyContactPerson: requiredTrimmed(1, 100, "개인정보 보호책임자"),
  policyContactEmail: z
    .string({ required_error: "개인정보 보호책임자 이메일은 필수입니다." })
    .transform((v) => v.trim())
    .pipe(
      z
        .string()
        .email("이메일 형식이 올바르지 않습니다.")
        .max(200),
    ),
  policyContactPhone: z
    .string({ required_error: "개인정보 보호책임자 전화번호는 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => PHONE_REGEX.test(v), {
      message: "전화번호 형식이 올바르지 않습니다 (예: 02-1234-5678 / 010-1234-5678 / 1533-8191).",
    }),
  policyEffectiveDate: requiredDate,
  // ADMIN_BUSINESS_ENTITIES v1 § 3 — 운영 contact (선택 · 외부 비공개)
  primaryContactName: z.string().trim().max(100).default(""),
  primaryContactPhone: z.string().trim().max(40).default(""),
  primaryContactEmail: z.string().trim().max(200).default(""),
  primaryContactRole: z.string().trim().max(80).default(""),
});

// === Section (d) 5 LegalDocument effectiveDate override (cycle3 LL-39 flat key) ===

export const legalDocEffectiveOverrideSchema = z.record(
  z.enum(CLOSED_DOCUMENT_TYPES as unknown as [ClosedLegalDocumentType, ...ClosedLegalDocumentType[]]),
  z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || ISO_DATE_REGEX.test(v), {
      message: "정책 시행일은 ISO 형식 (YYYY-MM-DD) 이어야 합니다.",
    })
    .refine(
      (v) => {
        if (v === null || v === undefined) return true;
        const [y, m, d] = v.split("-").map(Number) as [number, number, number];
        const dt = new Date(Date.UTC(y, m - 1, d));
        return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
      },
      { message: "유효한 날짜가 아닙니다." },
    ),
);

// === Section (e) BrandTokens (Layer 1 · 2026-05-19) ===

const hexColorSchema = z.string().regex(/^#[0-9a-f]{6}$/i, "hex 색상 형식이 올바르지 않습니다 (#RRGGBB).");

export const brandTokensSchema = z
  .object({
    primaryHex: hexColorSchema.nullable(),
    accentHex: hexColorSchema.nullable(),
    palette: z.array(hexColorSchema).max(5),
    source: z.enum(["logo", "ogImage", "themeColor", "manual", "none"]),
  })
  .nullable()
  .optional();

export type BrandTokensInput = z.infer<typeof brandTokensSchema>;

// === 통합 Input schema (section a + b + c + d + e) ===

export const clinicProfileBundleInputSchema = sectionASchema
  .merge(sectionBSchema)
  .merge(sectionCSchema)
  .extend({
    legalDocEffectiveOverrides: legalDocEffectiveOverrideSchema,
    brandTokens: brandTokensSchema,
    // Phase 3 C 하이브리드: 메인/about/treatments hardcode 이관용 metadata JSON 문자열
    metadataJson: z.string().max(20_000, "metadata JSON 은 20000자 이하").optional().default(""),
  })
  .superRefine((val, ctx) => {
    // featuredChannelId 가 primaryCtas[].id 중 하나에 매칭되어야 함
    const ctaIds = new Set(val.primaryCtas.map((c) => c.id));
    if (!ctaIds.has(val.featuredChannelId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "강조 채널이 입력된 예약 채널 중 하나여야 합니다.",
        path: ["featuredChannelId"],
      });
    }
  });

export type ClinicProfileBundleInput = z.infer<typeof clinicProfileBundleInputSchema>;

// === FormData parser helpers (cycle3 LL-39 flat key → nested object) ===

/**
 * extractLegalDocEffectiveOverrides — cycle3 LL-39 patch
 * FormData 의 flat key `legalDocEffective_<documentType>` → Record<DocumentType, string|undefined>
 */
export function extractLegalDocEffectiveOverrides(
  formData: FormData,
): Record<ClosedLegalDocumentType, string | undefined> {
  const result: Partial<Record<ClosedLegalDocumentType, string | undefined>> = {};
  for (const t of CLOSED_DOCUMENT_TYPES) {
    const v = formData.get(`legalDocEffective_${t}`);
    if (typeof v === "string") result[t] = v;
  }
  return result as Record<ClosedLegalDocumentType, string | undefined>;
}

/**
 * extractBusinessHours — 7요일 dayInput FormData → BusinessHoursInput
 * FormData key: businessHours_<day>_<field> (예: businessHours_monday_open=09:30)
 */
export function extractBusinessHours(formData: FormData): unknown {
  const result: Record<string, DayInput> = {};
  for (const day of DAYS) {
    result[day] = {
      closed: formData.get(`businessHours_${day}_closed`) === "on",
      open: (formData.get(`businessHours_${day}_open`) as string | null) ?? undefined,
      close: (formData.get(`businessHours_${day}_close`) as string | null) ?? undefined,
      lunchEnabled: formData.get(`businessHours_${day}_lunchEnabled`) === "on",
      lunchFrom: (formData.get(`businessHours_${day}_lunchFrom`) as string | null) ?? undefined,
      lunchTo: (formData.get(`businessHours_${day}_lunchTo`) as string | null) ?? undefined,
    };
  }
  return result;
}

/**
 * extractPrimaryCtas — 3종 type 별 입력 FormData → PrimaryCtaInput[]
 * FormData key: cta_<type>_label / cta_<type>_targetUrl (입력 없으면 제외)
 */
/** extractBrandTokens — form 안 hidden input `brandTokens` (JSON string) → BrandTokensInput */
export function extractBrandTokens(formData: FormData): unknown {
  const raw = formData.get("brandTokens");
  if (typeof raw !== "string" || raw.trim() === "") return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export function extractPrimaryCtas(formData: FormData): unknown {
  const TYPES: ReadonlyArray<"phone" | "kakao-talk" | "naver-reservation"> = [
    "phone", "kakao-talk", "naver-reservation",
  ];
  const result: Array<{ id: string; type: string; label: string; targetUrl: string }> = [];
  for (const t of TYPES) {
    const labelRaw = formData.get(`cta_${t}_label`);
    const targetUrlRaw = formData.get(`cta_${t}_targetUrl`);
    const labelStr = typeof labelRaw === "string" ? labelRaw.trim() : "";
    const urlStr = typeof targetUrlRaw === "string" ? targetUrlRaw.trim() : "";
    // CtaRow 안 enabled=true 시 만 input render — HTML5 required 가 partial 입력 1차 차단.
    // 만약 어떤 이유로 partial 도달 시 — 양쪽 다 채워야 push (DB CHECK 위반 회피).
    // 한쪽 만 빈 경우 = skip (사용자에게 명확한 메시지: "최소 1개 예약 채널 필요").
    if (labelStr === "" || urlStr === "") continue;
    result.push({
      id: `${t}-1`,
      type: t,
      label: labelStr,
      targetUrl: urlStr,
    });
  }
  return result;
}

// === BusinessHours → CT-02 SoT 변환 (LL-ACTION-09) ===

export type CT02BusinessHours = {
  openingHours: Array<{ dayOfWeek: string[]; opens: string; closes: string }>;
  receptionHours: Array<{ dayOfWeek: string[]; opens: string; closes: string }>;
  lunchBreaks: Array<{ dayOfWeek: string[]; from: string; to: string }>;
  specialClosures: Array<{ date: string; reason?: string }>;
};

const DAY_TO_ENUM: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

/**
 * convertToOpeningHoursSpec — LL-ACTION-09 (cycle1 LL-05 + cycle2 LL-30)
 * 7요일 단순 입력 → CT-02 SoT 형식. 동일 (open,close) 행 grouping.
 * receptionHours/specialClosures 는 v0.3 빈 배열 (LL-DEFER-16).
 */
export function convertToOpeningHoursSpec(hours: BusinessHoursInput): CT02BusinessHours {
  // open/close grouping
  const openClose = new Map<string, string[]>();
  const lunchGroup = new Map<string, string[]>();

  for (const day of DAYS) {
    const d = hours[day];
    if (d.closed || !d.open || !d.close) continue;
    const key = `${d.open}-${d.close}`;
    const arr = openClose.get(key) ?? [];
    arr.push(DAY_TO_ENUM[day]);
    openClose.set(key, arr);

    if (d.lunchEnabled && d.lunchFrom && d.lunchTo) {
      const lkey = `${d.lunchFrom}-${d.lunchTo}`;
      const larr = lunchGroup.get(lkey) ?? [];
      larr.push(DAY_TO_ENUM[day]);
      lunchGroup.set(lkey, larr);
    }
  }

  return {
    openingHours: [...openClose.entries()].map(([key, days]) => {
      const [opens, closes] = key.split("-") as [string, string];
      return { dayOfWeek: days, opens, closes };
    }),
    lunchBreaks: [...lunchGroup.entries()].map(([key, days]) => {
      const [from, to] = key.split("-") as [string, string];
      return { dayOfWeek: days, from, to };
    }),
    receptionHours: [],
    specialClosures: [],
  };
}

/**
 * 역변환 helper — DB metadata 의 CT-02 형식 → form (b) 의 7요일 입력 형식 (round-trip).
 */
export function convertFromOpeningHoursSpec(spec: CT02BusinessHours | null): BusinessHoursInput {
  const empty: DayInput = { closed: true, lunchEnabled: false };
  const out: Record<string, DayInput> = {};
  for (const d of DAYS) out[d] = { ...empty };
  if (!spec) return out as BusinessHoursInput;

  const enumToDay: Record<string, DayOfWeek> = Object.fromEntries(
    (Object.entries(DAY_TO_ENUM) as Array<[DayOfWeek, string]>).map(([k, v]) => [v, k]),
  );

  for (const oh of spec.openingHours) {
    for (const dEnum of oh.dayOfWeek) {
      const d = enumToDay[dEnum];
      if (d) out[d] = { ...out[d]!, closed: false, open: oh.opens, close: oh.closes };
    }
  }
  for (const lb of spec.lunchBreaks) {
    for (const dEnum of lb.dayOfWeek) {
      const d = enumToDay[dEnum];
      if (d) out[d] = { ...out[d]!, lunchEnabled: true, lunchFrom: lb.from, lunchTo: lb.to };
    }
  }
  return out as BusinessHoursInput;
}
