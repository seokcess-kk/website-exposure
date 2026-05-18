// @glitzy/core-content — M0 vertical slice schema + templates (v0.3·LOCATION_LEGAL_PLAN v1.0)

export {
  instance,
  contentPublicationStatusEnum,
  riskLevelEnum,
  legalDocumentTypeEnum,
  clinicProfile,
  locationProfile,
  doctorProfile,
  treatmentPage,
  article,
  legalDocument,
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
