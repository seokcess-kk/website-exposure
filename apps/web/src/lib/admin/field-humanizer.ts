// @glitzy/web/lib/admin/field-humanizer — fieldErrors 안 운영자 언어 변환
// ADMIN_UX_REDESIGN v1.0 § 7.6 ErrorSummary + SaveStatusPanel 정합.
// camelCase 필드명 → 한국어 라벨.

const FIELD_LABELS: Record<string, string> = {
  // ClinicProfile
  name: "기관명",
  description: "병원 소개",
  logoUrl: "로고 URL",
  ogImageUrl: "OG 이미지 URL",
  businessRegistrationNumber: "사업자등록번호",
  alternateName: "대체명",
  legalEntityName: "법인명",
  slogan: "슬로건",
  longDescription: "상세 설명",
  foundingDate: "설립일",
  founder: "설립자",
  policyContactPerson: "정책 담당자",
  policyContactEmail: "정책 담당자 이메일",
  policyContactPhone: "정책 담당자 전화번호",
  policyEffectiveDate: "정책 시행일",
  primaryCtas: "예약 채널",
  featuredChannelId: "강조 채널",
  brandTokens: "Brand 색상",
  // LocationProfile
  streetAddress: "도로명 주소",
  addressLocality: "시·군·구",
  addressRegion: "시·도",
  postalCode: "우편번호",
  addressCountry: "국가 코드",
  locationTelephone: "본원 전화",
  locationEmail: "본원 이메일",
  featuredChannelIdLocation: "강조 채널 (본원)",
  businessHours: "진료시간",
  // DoctorProfile
  title: "직함",
  jobTitle: "직책",
  honorific: "호칭",
  bio: "약력",
  photoUrl: "사진 URL",
  displayOrder: "표시 순서",
  active: "활성",
  // Article
  summary: "요약",
  bodyMarkdown: "본문",
  status: "상태",
  riskLevel: "위험도",
  heroImageUrl: "히어로 이미지",
  authorDoctorId: "저자 (의료진)",
  categoryId: "카테고리",
  // FAQ
  question: "질문",
  answer: "답변",
  // Publication
  authors: "저자",
  journal: "학술지",
  publishedDate: "발행일",
  doi: "DOI",
  pubmedId: "PubMed ID",
  url: "URL",
  thumbnailUrl: "썸네일",
  // MediaAppearance
  publisher: "출판사",
  mediaType: "매체 유형",
  // slug 류
  slug: "슬러그",
};

/** camelCase 필드명 → 한국어 라벨. mapping 부재 시 원본 그대로. */
export function humanizeFieldName(fieldName: string): string {
  // path 안 첫 segment 만 사용 (예: "primaryCtas.0.targetUrl" → "primaryCtas")
  const first = fieldName.split(".")[0]!;
  return FIELD_LABELS[first] ?? fieldName;
}
