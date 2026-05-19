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
