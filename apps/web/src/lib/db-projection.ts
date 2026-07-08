// @glitzy/web/lib/db-projection — raw DB row → normalized projection (contract semantic)
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.2 PSR-COMP-05·06·07 + § 6 작업 #5
//
// Drizzle column 명과 DATA_MODEL contract field 명이 다른 entity 가 있어 변환 layer 필요.
// 예: TreatmentPage.title (DB) ↔ name (contract C-03), Article.title (DB) ↔ headline (contract C-04).
// JSON-LD 생성기 + 페이지 컴포넌트 모두 본 normalized projection 사용 (raw row 직접 사용 금지).

// === Raw rows (DB) ===

export type ClinicProfileRow = {
  name: string;
  description: string;
  long_description: string | null;
  slogan: string | null;
  logo_url: string;
  og_image_url: string | null; // C0055 — nullable (미설정 시 렌더타임 로고 폴백)
  favicon_url: string | null; // C0052 — 정사각형 전용 파비콘 (nullable · 미설정 시 로고 대체)
  legal_entity_name: string | null;
  founder: string | null;
  founding_date: string | null;
  business_registration_number: string | null;
  naver_site_verification?: string | null; // C0051 — optional (이 컬럼 미포함 SELECT 도 정합)
  primary_ctas: unknown; // JSONB array
  brand_tokens: unknown; // JSONB object — L1 brand 자동 추출 결과
  metadata: unknown;     // JSONB — C 하이브리드: treatmentPillars/standardPrinciples/keyStats/systemStrengths/sectionCopy
  updated_at: Date;
};

export type LocationProfileRow = {
  slug: string;
  name: string;
  street_address: string;
  address_locality: string;
  address_region: string;
  postal_code: string;
  address_country: string;
  latitude: string | null;
  longitude: string | null;
  phone: string | null;
  email: string | null;
  metadata: unknown; // JSONB
  updated_at: Date;
};

export type DoctorProfileRow = {
  slug: string;
  name: string;
  title: string | null;
  job_title: string | null;
  honorific: string | null;
  bio: string | null;
  photo_url: string | null;
  cv_photo_url: string | null;
  display_order: number;
  active: boolean;
  metadata?: unknown; // JSONB — credentials/medicalSpecialties C 하이브리드
  updated_at: Date;
};

export type TreatmentPageRow = {
  slug: string;
  title: string; // contract: C-03 name
  summary: string;
  body_markdown: string;
  hero_image_url: string | null;
  pillar_slug: string | null;   // C 하이브리드: clinic.metadata.treatmentPillars[].slug 매칭
  metadata: unknown;             // JSONB — treatment 별 principles override 가능
  published_at: Date | null;
  updated_at: Date;
};

export type MedicalConditionPageRow = {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  body_markdown: string;
  hero_image_url: string | null;
  primary_treatment_id: string | null;
  metadata: unknown;
  published_at: Date | null;
  updated_at: Date;
};

export type ArticleRow = {
  slug: string;
  title: string; // contract: C-04 headline
  summary: string;
  body_markdown: string;
  hero_image_url: string | null;
  external_url?: string | null; // 언론 보도 원문 URL — site detail 안 outbound CTA
  published_at: Date | null;
  author_doctor_id: string | null;
  category_id: string;        // v0.4 EC-SCHEMA-05: NOT NULL after C0013 staged migration
  category_slug: string;      // v0.4 EC-RENDER-04: SQL JOIN article_category ON ... — render layer 사용
  updated_at: Date;
};

export type LegalDocumentRow = {
  slug: string;
  document_type: string;
  title: string;
  body: string;
  effective_date: string;
  updated_at: Date;
};

// === Normalized projections (contract semantic) ===

export type PrimaryCta = {
  id: string;
  type: string;
  label: string;
  targetUrl: string;
};

export type BrandTokensProjection = {
  primaryHex: string | null;
  accentHex: string | null;
};

export type TreatmentPillarMeta = { slug: string; icon: string; title: string; subtitle: string };
export type PrincipleMeta = { n: string; icon: string; title: string; desc: string };
export type KeyStatMeta = { value: string; suffix?: string; label: string; source?: string };
export type SystemStrengthMeta = { icon: string; title: string; description: string };
export type SectionCopyMeta = {
  communityTitle?: string;
  communityDescription?: string;
  reservationHeadline?: string;
  reservationDescription?: string;
};
export type NaverPlaceMeta = {
  placeId: string;
  placeUrl: string;
};

export type ClinicMetadataProjection = {
  treatmentPillars: TreatmentPillarMeta[];
  standardPrinciples: PrincipleMeta[];
  keyStats: KeyStatMeta[];
  systemStrengths: SystemStrengthMeta[];
  sectionCopy: SectionCopyMeta;
  /** EXPOSURE_READINESS Phase D — 로컬 SEO 축: 지역 modifier 키워드 (예: "부평 다이어트 한의원", "인천 산후 다이어트"). JSON-LD Organization.keywords 자동 매핑. */
  localKeywords: string[];
  /** NAVER_PLACE_PLAN v1.0 — 네이버 플레이스 entity link (sameAs · 사이트 footer/contact). null 시 silent fallback. */
  naverPlace: NaverPlaceMeta | null;
};

export type ClinicProjection = {
  name: string;
  description: string;
  longDescription: string | null;
  slogan: string | null;
  logoUrl: string;
  /** C0055 — nullable. null 시 site-metadata 가 로고로 폴백. */
  ogImageUrl: string | null;
  /** C0052 — 정사각형 전용 파비콘 URL. null 시 layout 에서 로고 → 기본 아이콘 순으로 대체. */
  faviconUrl: string | null;
  legalEntityName: string | null;
  founder: string | null;
  foundingDate: string | null;
  businessRegistrationNumber: string | null;
  /** C0051 — 네이버 서치어드바이저 소유확인 토큰. null 시 사이트 head meta 미출력. */
  naverSiteVerification: string | null;
  primaryCtas: PrimaryCta[];
  /** L1 brand override (null 또는 empty 시 Layer 0 base theme 사용) */
  brandTokens: BrandTokensProjection | null;
  /** C 하이브리드 metadata — page hardcode override */
  metadata: ClinicMetadataProjection;
  updatedAt: Date;
};

export type BusinessHoursDay = {
  dayOfWeek: string[];
  opens?: string;
  closes?: string;
  from?: string;
  to?: string;
};

export type LocationProjection = {
  slug: string;
  name: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  latitude: number | null;
  longitude: number | null;
  telephone: string | null;
  email: string | null;
  businessHours: {
    openingHours: BusinessHoursDay[];
    receptionHours: BusinessHoursDay[];
    lunchBreaks: BusinessHoursDay[];
    specialClosures: Array<{ date: string; reason?: string }>;
  };
  updatedAt: Date;
};

export type CredentialMeta = {
  /** license = 의료인 면허 · board = 전문의/세부전문의 · certification = 학회/협회 인증 · membership = 학회 회원 · education = 학력 */
  type: "license" | "board" | "certification" | "membership" | "education";
  /** 인증·자격명 (예: "한의사 면허", "대한비만학회 인정의") */
  name: string;
  /** 발급 기관 (예: "보건복지부", "대한비만학회") */
  issuer?: string;
  /** 발급 연도 또는 ISO 날짜 (`YYYY` 또는 `YYYY-MM-DD`) */
  issuedAt?: string;
  /** 자격번호/식별자 (선택) */
  identifier?: string;
  /** 외부 검증 URL (선택) */
  url?: string;
};

export type DoctorMetadataProjection = {
  credentials: CredentialMeta[];
  /** schema.org medicalSpecialty — 자유 입력 (예: "비만의학", "한방재활의학") */
  medicalSpecialties: string[];
};

export type DoctorProjection = {
  slug: string;
  name: string;
  title: string | null;
  jobTitle: string | null;
  honorific: string | null;
  bio: string | null;
  photoUrl: string | null;
  cvPhotoUrl: string | null;
  displayOrder: number;
  active: boolean;
  metadata: DoctorMetadataProjection;
  updatedAt: Date;
};

export type TreatmentProjection = {
  slug: string;
  name: string; // DB title → contract name
  summary: string;
  body: string; // DB body_markdown → contract body
  heroImageUrl: string | null;
  pillarSlug: string | null;
  /** treatment 별 principles override (없으면 clinic.metadata.standardPrinciples 사용) */
  principles: PrincipleMeta[];
  publishedAt: Date | null;
  updatedAt: Date;
};

export type ConditionProjection = {
  slug: string;
  name: string;
  summary: string;
  body: string;
  heroImageUrl: string | null;
  primaryTreatmentId: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
};

export type ArticleProjection = {
  slug: string;
  headline: string; // DB title → contract headline
  summary: string;
  body: string;
  heroImageUrl: string | null;
  externalUrl: string | null;
  publishedAt: Date | null;
  authorDoctorId: string | null;
  categoryId: string;
  categorySlug: string;
  updatedAt: Date;
};

export type LegalProjection = {
  slug: string;
  documentType: string;
  title: string;
  body: string;
  effectiveDate: string;
  updatedAt: Date;
};

// === normalize functions ===

function pickString(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function parsePrimaryCtas(raw: unknown): PrimaryCta[] {
  if (!Array.isArray(raw)) return [];
  const out: PrimaryCta[] = [];
  for (const elem of raw) {
    if (typeof elem !== "object" || elem === null) continue;
    const e = elem as Record<string, unknown>;
    const id = pickString(e.id);
    const type = pickString(e.type);
    const label = pickString(e.label);
    const targetUrl = pickString(e.targetUrl);
    if (!id || !type || !label || !targetUrl) continue;
    out.push({ id, type, label, targetUrl });
  }
  return out;
}

function parseBusinessHours(raw: unknown): LocationProjection["businessHours"] {
  const empty: LocationProjection["businessHours"] = {
    openingHours: [],
    receptionHours: [],
    lunchBreaks: [],
    specialClosures: [],
  };
  if (typeof raw !== "object" || raw === null) return empty;
  const r = raw as Record<string, unknown>;
  const bh = r.businessHours;
  if (typeof bh !== "object" || bh === null) return empty;
  const b = bh as Record<string, unknown>;
  const arr = (k: string): unknown[] => (Array.isArray(b[k]) ? (b[k] as unknown[]) : []);
  return {
    openingHours: arr("openingHours").filter(isOpeningHours),
    receptionHours: arr("receptionHours").filter(isOpeningHours),
    lunchBreaks: arr("lunchBreaks").filter(isLunchBreak),
    specialClosures: arr("specialClosures").filter(isSpecialClosure),
  };
}

// PSRC-11 patch: opening/reception 은 `dayOfWeek: string[]` + `opens: HH:mm` + `closes: HH:mm` 강제
const TIME_REGEX = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function isOpeningHours(x: unknown): x is BusinessHoursDay {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return isStringArray(o.dayOfWeek)
    && typeof o.opens === "string" && TIME_REGEX.test(o.opens)
    && typeof o.closes === "string" && TIME_REGEX.test(o.closes);
}

function isLunchBreak(x: unknown): x is BusinessHoursDay {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return isStringArray(o.dayOfWeek)
    && typeof o.from === "string" && TIME_REGEX.test(o.from)
    && typeof o.to === "string" && TIME_REGEX.test(o.to);
}

function isSpecialClosure(x: unknown): x is { date: string; reason?: string } {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  if (typeof o.date !== "string" || !ISO_DATE_REGEX.test(o.date)) return false;
  if (o.reason !== undefined && typeof o.reason !== "string") return false;
  return true;
}

function parseBrandTokens(raw: unknown): BrandTokensProjection | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as { primaryHex?: unknown; accentHex?: unknown };
  const isHex = (v: unknown): v is string => typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v);
  const primaryHex = isHex(o.primaryHex) ? o.primaryHex : null;
  const accentHex = isHex(o.accentHex) ? o.accentHex : null;
  if (primaryHex === null && accentHex === null) return null;
  return { primaryHex, accentHex };
}

// === C 하이브리드 metadata parsers (safe unknown→typed) ===
function parseStr(v: unknown): string | undefined {
  return typeof v === "string" && v.trim().length > 0 ? v : undefined;
}
function parseTreatmentPillars(raw: unknown): TreatmentPillarMeta[] {
  if (!Array.isArray(raw)) return [];
  const out: TreatmentPillarMeta[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const o = item as Record<string, unknown>;
    const slug = parseStr(o.slug); const icon = parseStr(o.icon);
    const title = parseStr(o.title); const subtitle = parseStr(o.subtitle);
    if (slug && icon && title && subtitle) out.push({ slug, icon, title, subtitle });
  }
  return out;
}
function parsePrinciples(raw: unknown): PrincipleMeta[] {
  if (!Array.isArray(raw)) return [];
  const out: PrincipleMeta[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const o = item as Record<string, unknown>;
    const n = parseStr(o.n); const icon = parseStr(o.icon);
    const title = parseStr(o.title); const desc = parseStr(o.desc);
    if (n && icon && title && desc) out.push({ n, icon, title, desc });
  }
  return out;
}
function parseKeyStats(raw: unknown): KeyStatMeta[] {
  if (!Array.isArray(raw)) return [];
  const out: KeyStatMeta[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const o = item as Record<string, unknown>;
    const value = parseStr(o.value); const label = parseStr(o.label);
    if (value && label) {
      out.push({ value, label, suffix: parseStr(o.suffix), source: parseStr(o.source) });
    }
  }
  return out;
}
function parseSystemStrengths(raw: unknown): SystemStrengthMeta[] {
  if (!Array.isArray(raw)) return [];
  const out: SystemStrengthMeta[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const o = item as Record<string, unknown>;
    const icon = parseStr(o.icon); const title = parseStr(o.title); const description = parseStr(o.description);
    if (icon && title && description) out.push({ icon, title, description });
  }
  return out;
}
function parseSectionCopy(raw: unknown): SectionCopyMeta {
  if (typeof raw !== "object" || raw === null) return {};
  const o = raw as Record<string, unknown>;
  return {
    communityTitle: parseStr(o.communityTitle),
    communityDescription: parseStr(o.communityDescription),
    reservationHeadline: parseStr(o.reservationHeadline),
    reservationDescription: parseStr(o.reservationDescription),
  };
}
function parseClinicMetadata(raw: unknown): ClinicMetadataProjection {
  const o = coerceJsonbObject(raw);
  if (o === null) {
    return {
      treatmentPillars: [], standardPrinciples: [], keyStats: [],
      systemStrengths: [], sectionCopy: {}, localKeywords: [], naverPlace: null,
    };
  }
  return {
    treatmentPillars: parseTreatmentPillars(o.treatmentPillars),
    standardPrinciples: parsePrinciples(o.standardPrinciples),
    keyStats: parseKeyStats(o.keyStats),
    systemStrengths: parseSystemStrengths(o.systemStrengths),
    sectionCopy: parseSectionCopy(o.sectionCopy),
    localKeywords: parseLocalKeywords(o.localKeywords),
    naverPlace: parseNaverPlace(o.naverPlace),
  };
}

function parseLocalKeywords(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item === "string" && item.trim().length > 0 && item.length <= 100) {
      out.push(item.trim());
    }
  }
  return out;
}

const NAVER_PLACE_HOSTS = new Set([
  "map.naver.com",
  "m.place.naver.com",
  "pcmap.place.naver.com",
  "naver.me",
]);

/** NAVER_PLACE_PLAN v1.0 § 4.2 — placeId/placeUrl 검증 + silent fallback. */
export function parseNaverPlace(raw: unknown): NaverPlaceMeta | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const placeId = typeof o.placeId === "string" ? o.placeId.trim() : "";
  const placeUrl = typeof o.placeUrl === "string" ? o.placeUrl.trim() : "";
  if (!/^\d{6,12}$/.test(placeId)) return null;
  let host: string;
  try {
    host = new URL(placeUrl).host;
  } catch {
    return null;
  }
  if (!NAVER_PLACE_HOSTS.has(host)) return null;
  return { placeId, placeUrl };
}

export function normalizeClinic(row: ClinicProfileRow): ClinicProjection {
  return {
    name: row.name,
    description: row.description,
    longDescription: row.long_description,
    slogan: row.slogan,
    logoUrl: row.logo_url,
    ogImageUrl: row.og_image_url,
    faviconUrl: row.favicon_url,
    legalEntityName: row.legal_entity_name,
    founder: row.founder,
    foundingDate: row.founding_date,
    businessRegistrationNumber: row.business_registration_number,
    naverSiteVerification: row.naver_site_verification ?? null,
    primaryCtas: parsePrimaryCtas(row.primary_ctas),
    brandTokens: parseBrandTokens(row.brand_tokens),
    metadata: parseClinicMetadata(row.metadata),
    updatedAt: row.updated_at,
  };
}

export function normalizeLocation(row: LocationProfileRow): LocationProjection {
  return {
    slug: row.slug,
    name: row.name,
    streetAddress: row.street_address,
    addressLocality: row.address_locality,
    addressRegion: row.address_region,
    postalCode: row.postal_code,
    addressCountry: row.address_country,
    latitude: row.latitude !== null ? Number(row.latitude) : null,
    longitude: row.longitude !== null ? Number(row.longitude) : null,
    telephone: row.phone,
    email: row.email,
    businessHours: parseBusinessHours(row.metadata),
    updatedAt: row.updated_at,
  };
}

const CREDENTIAL_TYPES = new Set(["license", "board", "certification", "membership", "education"]);

function parseCredentials(raw: unknown): CredentialMeta[] {
  if (!Array.isArray(raw)) return [];
  const out: CredentialMeta[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const o = item as Record<string, unknown>;
    const type = parseStr(o.type);
    const name = parseStr(o.name);
    if (!type || !CREDENTIAL_TYPES.has(type) || !name) continue;
    const entry: CredentialMeta = { type: type as CredentialMeta["type"], name };
    const issuer = parseStr(o.issuer);
    if (issuer) entry.issuer = issuer;
    const issuedAt = parseStr(o.issuedAt);
    if (issuedAt) entry.issuedAt = issuedAt;
    const identifier = parseStr(o.identifier);
    if (identifier) entry.identifier = identifier;
    const url = parseStr(o.url);
    if (url) entry.url = url;
    out.push(entry);
  }
  return out;
}

function parseMedicalSpecialties(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item === "string" && item.trim().length > 0) out.push(item.trim());
  }
  return out;
}

function parseDoctorMetadata(raw: unknown): DoctorMetadataProjection {
  const obj = coerceJsonbObject(raw);
  if (obj === null) return { credentials: [], medicalSpecialties: [] };
  return {
    credentials: parseCredentials(obj.credentials),
    medicalSpecialties: parseMedicalSpecialties(obj.medicalSpecialties),
  };
}

/**
 * postgres.js + prepare:false 환경에서 jsonb 컬럼이 raw JSON string 으로 들어올 수 있음.
 * 두 형태 (object · string) 모두 정규화. invalid JSON 또는 array/scalar 는 null.
 */
function coerceJsonbObject(raw: unknown): Record<string, unknown> | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return null;
    }
  }
  return null;
}

export function normalizeDoctor(row: DoctorProfileRow): DoctorProjection {
  return {
    slug: row.slug,
    name: row.name,
    title: row.title,
    jobTitle: row.job_title,
    honorific: row.honorific,
    bio: row.bio,
    photoUrl: row.photo_url,
    cvPhotoUrl: row.cv_photo_url,
    displayOrder: row.display_order,
    active: row.active,
    metadata: parseDoctorMetadata(row.metadata),
    updatedAt: row.updated_at,
  };
}

export function normalizeCondition(row: MedicalConditionPageRow): ConditionProjection {
  return {
    slug: row.slug,
    name: row.title,
    summary: row.summary,
    body: row.body_markdown,
    heroImageUrl: row.hero_image_url,
    primaryTreatmentId: row.primary_treatment_id,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}

export function normalizeTreatment(row: TreatmentPageRow): TreatmentProjection {
  const meta = (typeof row.metadata === "object" && row.metadata !== null)
    ? row.metadata as Record<string, unknown>
    : {};
  return {
    slug: row.slug,
    name: row.title, // contract C-03 name = DB title
    summary: row.summary,
    body: row.body_markdown,
    heroImageUrl: row.hero_image_url,
    pillarSlug: row.pillar_slug,
    principles: parsePrinciples(meta.principles),
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}

export function normalizeArticle(row: ArticleRow): ArticleProjection {
  return {
    slug: row.slug,
    headline: row.title, // contract C-04 headline = DB title
    summary: row.summary,
    body: row.body_markdown,
    heroImageUrl: row.hero_image_url,
    externalUrl: row.external_url ?? null,
    publishedAt: row.published_at,
    authorDoctorId: row.author_doctor_id,
    categoryId: row.category_id,
    categorySlug: row.category_slug,
    updatedAt: row.updated_at,
  };
}

// === EAT_CONTENT v1.0 cascade — 4 신규 entity normalize ===

export type ArticleCategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  display_order: number;
  updated_at: Date;
};

export type ArticleCategoryProjection = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  displayOrder: number;
  updatedAt: Date;
};

export function normalizeArticleCategory(row: ArticleCategoryRow): ArticleCategoryProjection {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    displayOrder: row.display_order,
    updatedAt: row.updated_at,
  };
}

export type PublicationType =
  | "internal-research"
  | "external-authority"
  | "government"
  | "academic-society"
  | "statistics";

export type PublicationRow = {
  slug: string;
  title: string;
  authors: unknown; // JSONB array of string
  journal: string | null;
  published_date: string;
  doi: string | null;
  pubmed_id: string | null;
  url: string;
  thumbnail_url: string | null;
  summary: string;
  author_doctor_id: string | null;
  publication_type?: string | null;
  publisher_name?: string | null;
  published_at: Date | null;
  updated_at: Date;
};

export type PublicationProjection = {
  slug: string;
  title: string;
  authors: string[];
  journal: string | null;
  publishedDate: string;
  doi: string | null;
  pubmedId: string | null;
  url: string;
  thumbnailUrl: string | null;
  summary: string;
  authorDoctorId: string | null;
  publicationType: PublicationType;
  publisherName: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
};

function parseAuthors(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const a of raw) {
    if (typeof a === "string" && a.trim().length > 0) out.push(a.trim());
  }
  return out;
}

const PUBLICATION_TYPE_VALUES: ReadonlySet<PublicationType> = new Set([
  "internal-research",
  "external-authority",
  "government",
  "academic-society",
  "statistics",
]);

function coercePublicationType(raw: unknown): PublicationType {
  if (typeof raw === "string" && PUBLICATION_TYPE_VALUES.has(raw as PublicationType)) {
    return raw as PublicationType;
  }
  return "internal-research";
}

export function normalizePublication(row: PublicationRow): PublicationProjection {
  return {
    slug: row.slug,
    title: row.title,
    authors: parseAuthors(row.authors),
    journal: row.journal,
    publishedDate: row.published_date,
    doi: row.doi,
    pubmedId: row.pubmed_id,
    url: row.url,
    thumbnailUrl: row.thumbnail_url,
    summary: row.summary,
    authorDoctorId: row.author_doctor_id,
    publicationType: coercePublicationType(row.publication_type),
    publisherName: row.publisher_name ?? null,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}

export type MediaAppearanceRow = {
  slug: string;
  title: string;
  channel_name: string;
  channel_type: "broadcast" | "youtube" | "podcast" | "press";
  published_date: string;
  duration_seconds: number | null;
  url: string;
  thumbnail_url: string | null;
  summary: string;
  author_doctor_id: string | null;
  published_at: Date | null;
  updated_at: Date;
};

export type MediaAppearanceProjection = {
  slug: string;
  title: string;
  channelName: string;
  channelType: "broadcast" | "youtube" | "podcast" | "press";
  publishedDate: string;
  durationSeconds: number | null;
  url: string;
  thumbnailUrl: string | null;
  summary: string;
  authorDoctorId: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
};

export function normalizeMediaAppearance(row: MediaAppearanceRow): MediaAppearanceProjection {
  return {
    slug: row.slug,
    title: row.title,
    channelName: row.channel_name,
    channelType: row.channel_type,
    publishedDate: row.published_date,
    durationSeconds: row.duration_seconds,
    url: row.url,
    thumbnailUrl: row.thumbnail_url,
    summary: row.summary,
    authorDoctorId: row.author_doctor_id,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}

export type FaqRow = {
  slug: string;
  question: string;
  answer: string;
  display_order: number;
  category_id: string | null;
  related_treatment_id: string | null;
  author_doctor_id: string | null;
  published_at: Date | null;
  updated_at: Date;
};

export type FaqProjection = {
  slug: string;
  question: string;
  answer: string;
  displayOrder: number;
  categoryId: string | null;
  relatedTreatmentId: string | null;
  authorDoctorId: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
};

export function normalizeFaq(row: FaqRow): FaqProjection {
  return {
    slug: row.slug,
    question: row.question,
    answer: row.answer,
    displayOrder: row.display_order,
    categoryId: row.category_id,
    relatedTreatmentId: row.related_treatment_id,
    authorDoctorId: row.author_doctor_id,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}

export function normalizeLegal(row: LegalDocumentRow): LegalProjection {
  return {
    slug: row.slug,
    documentType: row.document_type,
    title: row.title,
    body: row.body,
    effectiveDate: row.effective_date,
    updatedAt: row.updated_at,
  };
}

// === Helper: address 한 줄 결합 ===
export function formatAddress(loc: LocationProjection): string {
  return `${loc.addressRegion} ${loc.addressLocality} ${loc.streetAddress} (${loc.postalCode})`;
}
