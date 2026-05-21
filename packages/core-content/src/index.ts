// @glitzy/core-content — M0 vertical slice schema + templates (v0.5·COMPLIANCE_ASSISTANT_M0_PLAN v1.0)

export {
  instance,
  contentPublicationStatusEnum,
  riskLevelEnum,
  legalDocumentTypeEnum,
  mediaChannelTypeEnum,
  clinicProfile,
  locationProfile,
  doctorProfile,
  treatmentPage,
  article,
  legalDocument,
  articleCategory,
  publication,
  mediaAppearance,
  faq,
  complianceRecord,
  reviewQueueEntry,
  complianceRecordPhaseEnum,
  complianceContentTypeEnum,
  reviewQueueTypeEnum,
  reviewQueueStatusEnum,
  reviewQueuePriorityEnum,
  approverRoleEnum,
  keywordTarget,
  keywordContentLink,
  contentEntityLink,
  seoReadinessSnapshot,
} from "./schema.js";

// SEO_VISIBILITY_OPS_PLAN v0.2 types (C0031~C0034)
export type {
  KeywordType,
  KeywordIntent,
  KeywordPriority,
  KeywordStatus,
  SeoLinkSourceType,
  SeoLinkTargetType,
  SeoLinkRelationType,
  SeoKeywordEntityType,
  SeoReadinessEntityType,
  SeoReadinessGrade,
} from "./schema.js";

export {
  TEMPLATES,
  CLOSED_DOCUMENT_TYPES,
  CLOSED_DOCUMENT_TYPES_ALPHA,
  renderTemplate,
  listTemplateVariables,
  TemplateRenderError,
} from "./templates/index.js";

export type {
  ClosedLegalDocumentType,
  LegalDocumentType,
  Template,
  RenderContext,
} from "./templates/index.js";
