// @glitzy/web/lib/errors — DB constraint violation → field/form error mapping
// cycle1-3entity WEB-08: ClinicProfile + DoctorProfile + TreatmentPage + Article constraint 추가
// LOCATION_LEGAL_PLAN v1.0 (cycle3 LL-44 + cycle4 LL-48): LegalDocument + LocationProfile + clinic_profile policy/primary_ctas + MainLocationMissingError

/**
 * LL-ACTION-21 (cycle3 LL-44 patch): assertHasMainLocationAfterTx 안전망 throw class.
 * mapDbErrorToResult 와는 별개 (DB error 가 아닌 application-level invariant).
 */
export class MainLocationMissingError extends Error {
  override readonly name = "MainLocationMissingError";
  constructor(message = "본원 정보 저장에 실패했습니다. 페이지를 새로고침하고 다시 시도하세요.") {
    super(message);
  }
}

export type FieldErrors = Record<string, string[]>;

type Mapping = { field: string | null; message: string };

// constraint_name → field + 한국어 메시지
const CONSTRAINT_MAP: Record<string, Mapping> = {
  // ClinicProfile (C0001)
  clinic_profile_name_length: { field: "name", message: "기관명은 1~100자여야 합니다." },
  clinic_profile_description_length: { field: "description", message: "간략 소개는 80~300자여야 합니다." },
  clinic_profile_slug_regex: { field: "slug", message: "slug 형식이 올바르지 않습니다." },
  clinic_profile_brn_regex: { field: "businessRegistrationNumber", message: "사업자등록번호 형식이 올바르지 않습니다 (000-00-00000)." },
  clinic_profile_instance_slug_unique: { field: "slug", message: "이미 사용 중인 slug 입니다." },

  // DoctorProfile (C0003)
  doctor_profile_slug_regex: { field: "slug", message: "slug 형식이 올바르지 않습니다. (3~64자, 소문자/숫자/하이픈)" },
  doctor_profile_name_length: { field: "name", message: "이름은 1~100자여야 합니다." },
  doctor_profile_instance_slug_unique: { field: "slug", message: "이미 사용 중인 slug 입니다." },

  // TreatmentPage (C0004)
  treatment_page_slug_regex: { field: "slug", message: "slug 형식이 올바르지 않습니다. (3~100자)" },
  treatment_page_title_length: { field: "title", message: "제목은 1~200자여야 합니다." },
  treatment_page_summary_length: { field: "summary", message: "요약은 50~160자여야 합니다." },
  treatment_page_published_requires_at: { field: null, message: "발행 상태일 때 발행일이 필요합니다." },
  treatment_page_instance_slug_unique: { field: "slug", message: "이미 사용 중인 slug 입니다." },

  // Article (C0005)
  article_slug_regex: { field: "slug", message: "slug 형식이 올바르지 않습니다. (3~100자)" },
  article_title_length: { field: "title", message: "제목은 1~200자여야 합니다." },
  article_summary_length: { field: "summary", message: "요약은 80~200자여야 합니다." },
  article_published_requires_at: { field: null, message: "발행 상태일 때 발행일이 필요합니다." },
  article_instance_slug_unique: { field: "slug", message: "이미 사용 중인 slug 입니다." },
  article_author_fk: { field: "authorDoctorId", message: "해당 의료진을 찾을 수 없습니다." },

  // ClinicProfile policy + primary_ctas (C0007 · LOCATION_LEGAL_PLAN v1.0)
  clinic_profile_policy_email_regex: { field: "policyContactEmail", message: "개인정보 보호책임자 이메일 형식이 올바르지 않습니다." },
  clinic_profile_policy_phone_format: { field: "policyContactPhone", message: "전화번호 형식이 올바르지 않습니다 (예: 02-1234-5678 / 010-1234-5678 / 1533-8191)." },
  clinic_profile_primary_ctas_array: { field: "primaryCtas", message: "예약 채널 입력값이 올바르지 않습니다." },
  clinic_profile_primary_ctas_shape: { field: "primaryCtas", message: "예약 채널을 체크한 경우 표시 라벨과 URL 둘 다 입력해야 합니다. 둘 중 하나가 비어 있으면 거부됩니다 (또는 사용 안 할 채널은 체크 해제)." },

  // LocationProfile parentClinic (C0008 · LL-SCHEMA-14)
  location_profile_clinic_fk: { field: null, message: "본원과 위치 정보가 일치하지 않습니다. 페이지를 새로고침하고 다시 시도하세요." },
  // LLC-10 patch: LocationProfile phone CHECK (C0002)
  location_profile_phone_format: { field: "locationTelephone", message: "본원 전화번호 형식이 올바르지 않습니다 (예: 02-1234-5678 / 010-1234-5678 / 1533-8191)." },

  // LegalDocument (C0006 · LOCATION_LEGAL_PLAN v1.0)
  legal_document_instance_5type_unique: { field: null, message: "동일 정책 문서가 이미 존재합니다. 잠시 후 다시 시도하세요." },
  legal_document_status_skeleton_limit: { field: null, message: "정책 문서 상태 변경(검수 진입·발행)은 후속 단계입니다. 본 화면에서는 draft 만 저장 가능하며, 검수 진입은 compliance-assistant Feature 합류(M0 v1.0 본 구현 완료 시점) 후 검수 큐 화면에서 가능합니다." },
  legal_document_published_at_null: { field: null, message: "정책 문서 발행은 후속 단계입니다. 발행 게이트(compliance-assistant + ComplianceRecord UI) 합류 후 발행 화면에서 가능합니다." },
  legal_document_risk_level_skeleton_limit: { field: null, message: "정책 문서 위험도는 현재 단계에서 Low 만 허용됩니다. 위험도 수동 분류는 위험도 분류 UI(M0 v1.0) 합류 후 가능합니다." },
  legal_document_title_length: { field: null, message: "정책 문서 제목은 1~100자여야 합니다." },
  legal_document_body_length: { field: null, message: "정책 문서 본문 길이가 허용 범위(1~200000자)를 벗어났습니다." },
  legal_document_email_regex: { field: null, message: "정책 문서의 연락처 이메일 형식이 올바르지 않습니다." },
  legal_document_slug_regex: { field: null, message: "정책 문서 slug 형식이 올바르지 않습니다." },
  legal_document_instance_slug_unique: { field: null, message: "동일 slug 의 정책 문서가 이미 존재합니다." },
  legal_document_template_version_format: { field: null, message: "정책 문서 템플릿 버전 형식이 올바르지 않습니다." },
  legal_document_auto_generated_template_ver: { field: null, message: "자동 생성 정책 문서에는 템플릿 버전이 필요합니다." },

  // === EAT_CONTENT v1.0 cascade — 4 신규 entity ===

  // ArticleCategory (C0009)
  article_category_slug_regex: { field: "slug", message: "카테고리 slug 형식이 올바르지 않습니다 (3~64자, 소문자/숫자/하이픈)." },
  article_category_name_length: { field: "name", message: "카테고리 이름은 1~50자여야 합니다." },
  article_category_description_length: { field: "description", message: "카테고리 설명은 입력 시 80~200자여야 합니다." },
  article_category_cover_image_url_format: { field: "coverImageUrl", message: "카테고리 커버 이미지 URL 은 http/https 로 시작해야 합니다." },
  article_category_instance_slug_unique: { field: "slug", message: "이미 사용 중인 카테고리 slug 입니다." },
  article_category_parent_fk: { field: null, message: "상위 카테고리를 찾을 수 없습니다." },

  // Article.category_id (C0013 staged FK)
  article_category_fk: { field: "categoryId", message: "해당 카테고리를 찾을 수 없습니다." },

  // Publication (C0010)
  publication_slug_regex: { field: "slug", message: "publication slug 형식이 올바르지 않습니다 (3~100자)." },
  publication_title_length: { field: "title", message: "제목은 1~300자여야 합니다." },
  publication_summary_length: { field: "summary", message: "요약은 50~300자여야 합니다." },
  publication_url_format: { field: "url", message: "원문 URL 은 http/https 로 시작해야 합니다." },
  publication_thumbnail_url_format: { field: "thumbnailUrl", message: "썸네일 URL 은 http/https 로 시작해야 합니다." },
  publication_doi_format: { field: "doi", message: "DOI 형식이 올바르지 않습니다 (예: 10.1000/xyz123)." },
  publication_pubmed_id_format: { field: "pubmedId", message: "PubMed ID 는 1~9자리 숫자여야 합니다." },
  publication_authors_array: { field: "authors", message: "저자는 1명 이상이어야 합니다." },
  publication_risk_level_low_only: { field: null, message: "Publication 위험도는 Low 만 허용됩니다 (외부 학술 인용)." },
  publication_published_requires_at: { field: null, message: "발행 상태일 때 발행일이 필요합니다." },
  publication_instance_slug_unique: { field: "slug", message: "이미 사용 중인 publication slug 입니다." },
  publication_author_doctor_fk: { field: "authorDoctorId", message: "해당 의료진을 찾을 수 없습니다." },

  // MediaAppearance (C0011)
  media_appearance_slug_regex: { field: "slug", message: "media appearance slug 형식이 올바르지 않습니다 (3~100자)." },
  media_appearance_title_length: { field: "title", message: "제목은 1~300자여야 합니다." },
  media_appearance_summary_length: { field: "summary", message: "요약은 50~300자여야 합니다." },
  media_appearance_channel_name_length: { field: "channelName", message: "채널명은 1~100자여야 합니다." },
  media_appearance_url_format: { field: "url", message: "원문 URL 은 http/https 로 시작해야 합니다." },
  media_appearance_thumbnail_url_format: { field: "thumbnailUrl", message: "썸네일 URL 은 http/https 로 시작해야 합니다." },
  media_appearance_duration_positive: { field: "durationSeconds", message: "길이(초) 는 양의 정수여야 합니다." },
  media_appearance_risk_level_low_only: { field: null, message: "MediaAppearance 위험도는 Low 만 허용됩니다." },
  media_appearance_published_requires_at: { field: null, message: "발행 상태일 때 발행일이 필요합니다." },
  media_appearance_instance_slug_unique: { field: "slug", message: "이미 사용 중인 media appearance slug 입니다." },
  media_appearance_author_doctor_fk: { field: "authorDoctorId", message: "해당 의료진을 찾을 수 없습니다." },

  // FAQ (C0012)
  faq_slug_regex: { field: "slug", message: "FAQ slug 형식이 올바르지 않습니다 (3~100자)." },
  faq_question_length: { field: "question", message: "질문은 10~200자여야 합니다." },
  faq_answer_length: { field: "answer", message: "답변은 50~2000자여야 합니다." },
  faq_status_v01_limit: { field: null, message: "FAQ 발행은 compliance-assistant + 위험도 자동 추론 합류 후 가능합니다 (EC-DEFER-05·12). 현재 단계에서는 draft 만 저장 가능합니다." },
  faq_published_at_null_v01: { field: null, message: "FAQ 발행은 후속 단계입니다 (EC-DEFER-05·12)." },
  faq_instance_slug_unique: { field: "slug", message: "이미 사용 중인 FAQ slug 입니다." },
  faq_category_fk: { field: "categoryId", message: "해당 카테고리를 찾을 수 없습니다." },
  faq_author_doctor_fk: { field: "authorDoctorId", message: "해당 의료진을 찾을 수 없습니다." },
  faq_related_treatment_fk: { field: "relatedTreatmentId", message: "해당 진료 페이지를 찾을 수 없습니다." },

  // === EVIDENCE_LINKING_PLAN v0.2 cascade — content_entity_link · keyword_target · keyword_content_link · seo_readiness_snapshot ===
  content_entity_link_unique: { field: null, message: "이미 동일한 근거·관련 연결이 존재합니다." },
  content_entity_link_not_self: { field: null, message: "콘텐츠는 자기 자신과 연결할 수 없습니다." },
  content_entity_link_source_type_check: { field: null, message: "출처 타입이 허용되지 않습니다 (Article/Treatment/FAQ 만 가능)." },
  content_entity_link_target_type_check: { field: null, message: "대상 타입이 허용되지 않습니다." },
  content_entity_link_relation_type_check: { field: null, message: "관계 유형이 허용되지 않습니다 (cites/related-to/derived-from)." },
  keyword_target_instance_slug_unique: { field: "slug", message: "이미 사용 중인 키워드 slug 입니다." },
  keyword_target_slug_regex: { field: "slug", message: "slug 형식이 올바르지 않습니다 (3~64자, 한글/소문자/숫자/하이픈)." },
  keyword_target_label_length: { field: "label", message: "라벨은 1~100자여야 합니다." },
  keyword_target_keyword_type_check: { field: "keywordType", message: "키워드 유형은 primary/secondary 만 가능합니다." },
  keyword_target_intent_check: { field: "intent", message: "검색 의도는 informational/comparison/pre-booking/local 중 하나여야 합니다." },
  keyword_target_priority_check: { field: "priority", message: "우선순위는 P0/P1/P2 만 가능합니다." },
  keyword_target_status_check: { field: "status", message: "상태는 active/paused/won/dropped 중 하나여야 합니다." },
  keyword_target_difficulty_range: { field: "difficulty", message: "난이도는 0~100 정수여야 합니다." },
  keyword_target_parent_fk: { field: "parentId", message: "대표 키워드를 찾을 수 없습니다." },
  keyword_content_link_unique: { field: null, message: "이미 동일한 키워드 연결이 존재합니다." },
  keyword_content_link_keyword_fk: { field: null, message: "키워드를 찾을 수 없습니다 (이미 삭제됐을 수 있음)." },
  keyword_content_link_entity_type_check: { field: null, message: "엔티티 타입이 허용되지 않습니다." },
  keyword_content_link_relevance_range: { field: null, message: "관련도 점수는 1~100 사이여야 합니다." },
  seo_readiness_snapshot_unique: { field: null, message: "readiness 캐시 중복 — 잠시 후 다시 시도해주세요." },
  // SEARCH_VISIBILITY_INGEST_PLAN v0.3 — search_property · search_visibility_snapshot · search_sync_state
  search_property_source_check: { field: null, message: "Source 는 google-search-console·naver-searchadvisor·bing-webmaster 중 하나여야 합니다." },
  search_property_verification_check: { field: null, message: "검증 상태가 잘못되었습니다." },
  // NAVER_SEARCH_INGEST_PLAN v0.4 task #8 — NSA 검증 방식 + paste ingestion
  search_property_verification_method_check: { field: "verificationMethod", message: "검증 방식은 gsc-service-account / naver-meta-tag / naver-html-file / naver-dns-record 중 하나여야 합니다." },
  search_property_url_format: { field: "propertyUrl", message: "Property URL 은 https:// 또는 sc-domain: 으로 시작해야 합니다." },
  search_property_instance_source_url_unique: { field: "propertyUrl", message: "이미 동일한 property URL 이 등록되어 있습니다." },
  svs_impressions_nonneg: { field: null, message: "노출 수는 0 이상이어야 합니다." },
  svs_clicks_nonneg: { field: null, message: "클릭 수는 0 이상이어야 합니다." },
  svs_clicks_le_impressions: { field: null, message: "클릭 수가 노출 수를 초과합니다." },
  svs_ctr_range: { field: null, message: "CTR 값이 0~1 범위를 벗어났습니다." },
  svs_position_range: { field: null, message: "평균 순위 값이 허용 범위 (0 초과 ~ 1000 이하) 를 벗어났습니다." },
  svs_unique_dimensions: { field: null, message: "동일 차원 (날짜·페이지·키워드) 의 snapshot 이 이미 존재합니다." },
  svs_property_fk: { field: null, message: "Property 를 찾을 수 없습니다 (이미 삭제됐을 수 있음)." },
  sss_status_check: { field: null, message: "sync 상태 값이 잘못되었습니다." },
  sss_running_requires_lock: { field: null, message: "running 상태는 sync_started_at + lock_token 이 필요합니다." },
  sss_property_unique: { field: null, message: "이 property 의 sync state 가 이미 존재합니다." },
  sss_property_fk: { field: null, message: "Property 를 찾을 수 없습니다." },
};

export type DbErrorResult =
  | { kind: "field"; errors: FieldErrors }
  | { kind: "form"; message: string };

/**
 * postgres-js error 의 `code` (SQLSTATE) 와 `constraint_name` 으로 field/form 매핑.
 * 23514 = check_violation, 23505 = unique_violation, 23503 = foreign_key_violation
 */
export function mapDbErrorToResult(err: unknown): DbErrorResult | null {
  if (typeof err !== "object" || err === null) return null;
  const e = err as { code?: string; constraint_name?: string; constraint?: string };
  const code = e.code;
  const constraint = e.constraint_name ?? e.constraint;
  if (!code || !constraint) return null;
  if (code !== "23514" && code !== "23505" && code !== "23503") return null;

  const mapping = CONSTRAINT_MAP[constraint];
  if (mapping) {
    if (mapping.field === null) return { kind: "form", message: mapping.message };
    return { kind: "field", errors: { [mapping.field]: [mapping.message] } };
  }

  // unknown constraint — generic (서버 로그 안 진단 위해 stderr 출력)
  // eslint-disable-next-line no-console
  console.warn(`[mapDbErrorToResult] unmapped constraint code=${code} constraint=${constraint}`);
  if (code === "23505") return { kind: "form", message: `중복된 값이 있어 저장하지 못했습니다. (constraint: ${constraint})` };
  if (code === "23503") return { kind: "form", message: `참조 무결성 오류 — 연결된 데이터가 없거나 삭제되었습니다. (constraint: ${constraint})` };
  if (code === "23514") return { kind: "form", message: `입력값이 데이터 제약을 만족하지 못합니다. (constraint: ${constraint})` };
  return null;
}

/** 기존 호출처 호환 — FieldErrors 만 반환 (form 메시지는 null) */
export function mapDbErrorToFieldErrors(err: unknown): FieldErrors | null {
  const result = mapDbErrorToResult(err);
  if (result === null) return null;
  if (result.kind === "field") return result.errors;
  return null;
}
