// @glitzy/shared-types — cross-package types

/** UUID v4 canonical lowercase */
export type UuidV4 = string & { __brand: "UuidV4" };

/** Branded instance ID (multi-tenant scope) */
export type InstanceId = UuidV4 & { __scope: "instance" };

/** Admin user ID */
export type AdminUserId = UuidV4 & { __scope: "admin-user" };

/** Content reference (compliance-assistant·audit·notifications에서 cross-reference) */
export type ContentRef = string & { __brand: "ContentRef" };

/** Tenant role enum (REVIEW_WORKFLOW SoT 정합·Spike E cascade) */
export type TenantRole = "operator" | "physician-reviewer" | "legal-reviewer" | "client-approver";
export type EffectiveRole = TenantRole | "super-admin";

/** Action eligibility (Spike E SoT cascade·REVIEW_WORKFLOW 정합) */
export type ActionType =
  | "legal-review-approve" | "legal-review-reject" | "legal-review-request-changes" | "legal-review-delegate"
  | "physician-review-approve" | "physician-review-reject" | "physician-review-request-changes" | "physician-review-delegate"
  | "client-approval-approve" | "client-approval-reject" | "client-approval-request-changes"
  | "operator-publish" | "operator-unpublish" | "operator-edit-content";

/** Service-role function enum (Spike A·service_role guard SoT) */
export type ServiceRoleFunction =
  | "migrationRunner" | "driftCheck" | "seedRunner"
  | "mediaImporter" | "notificationDispatcher" | "complianceAssistant"
  | "analyticsCollector" | "searchVisibilityScanner" | "crmSyncProcessor" | "contentMigrationApplier"
  | "instanceCloner";

/** UUID v4 strict validation regex (Spike E SoT) */
export const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuidV4(value: unknown): value is UuidV4 {
  return typeof value === "string" && value.length === 36 && UUID_V4_REGEX.test(value);
}

export function asUuidV4(value: string): UuidV4 {
  if (!isUuidV4(value)) throw new Error(`invalid UUID v4: ${value}`);
  return value.toLowerCase() as UuidV4;
}
