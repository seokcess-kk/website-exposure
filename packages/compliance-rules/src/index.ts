// @glitzy/compliance-rules — public API
// SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 3.1

export * from "./types.js";
export { loadCatalog, getCachedCatalog, clearCatalogCache, ComplianceCatalogError } from "./loader.js";
export { matchRules } from "./matcher.js";
export { evaluateInline } from "./inline-flags.js";
export { inferRisk, maxRisk, riskHigher } from "./risk-inference.js";
export { evaluateSlots } from "./slot-match.js";
export { computeCatalogHash, computeSchemaHash } from "./hash.js";
export { isKssAvailable, splitSentences } from "./kss.js";
