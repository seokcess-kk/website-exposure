// @glitzy/web/lib/admin/content-entity-link — EVIDENCE_LINKING_PLAN v0.2 Phase A.1 helper
//
// 책임:
//   - loadContentEntityLinks: source 별 기존 link 로드
//   - parseEvidenceLinks: formData.getAll() + zod → DesiredLink[]
//   - verifySameTenant: switch 기반 정적 SQL allowlist (cycle 1 #2 정합)
//   - cleanupLinksForEntityDelete: orphan cleanup (cycle 1 #3 정합)
//   - EvidenceLinkValidationError: caller 안 친화 에러 변환용
//
// SoT: docs/decisions/EVIDENCE_LINKING_PLAN.md v0.2 § 4.4 · § 5 · § 5.1 · § 5.5

import type postgres from "postgres";
import { z } from "zod";

import type {
  SeoLinkRelationType,
  SeoLinkSourceType,
  SeoLinkTargetType,
} from "@glitzy/core-content";

// ============================================================================
// Types
// ============================================================================

export type EvidenceLink = {
  sourceType: SeoLinkSourceType;
  sourceId: string;
  targetType: SeoLinkTargetType;
  targetId: string;
  relationType: SeoLinkRelationType;
  displayOrder: number;
};

export type DesiredEvidenceLink = {
  targetType: SeoLinkTargetType;
  targetId: string;
  relationType: SeoLinkRelationType;
  displayOrder: number;
};

/**
 * relation_type 별 허용되는 target_type whitelist.
 * EVIDENCE_LINKING_PLAN v0.2 § 3.1 매트릭스 정합 + EXPOSURE_READINESS Phase B (MedicalConditionPage 합류).
 */
export const RELATION_TARGET_MATRIX: Record<
  SeoLinkSourceType,
  Partial<Record<SeoLinkRelationType, ReadonlyArray<SeoLinkTargetType>>>
> = {
  Article: {
    cites: ["Publication", "MediaAppearance"],
    "related-to": ["Article", "TreatmentPage", "MedicalConditionPage", "FAQ"],
  },
  TreatmentPage: {
    cites: ["Publication", "MediaAppearance"],
    "derived-from": ["Publication"],
    "related-to": ["TreatmentPage", "MedicalConditionPage", "FAQ", "Article"],
  },
  // EXPOSURE_READINESS Phase B — 증상 → 진료/논문/미디어/관련 글/FAQ link.
  //   "이 증상 → 어떤 시술" 의 1차 매칭은 medical_condition_page.primary_treatment_id FK SoT 이며,
  //   해당 FK 외 추가 시술 cross-link 또는 다른 증상·글·FAQ 연결은 이 매트릭스 사용.
  MedicalConditionPage: {
    cites: ["Publication", "MediaAppearance"],
    "related-to": ["Article", "TreatmentPage", "MedicalConditionPage", "FAQ"],
  },
  FAQ: {
    "related-to": ["Article", "MedicalConditionPage", "FAQ"], // TreatmentPage 는 기존 relatedTreatmentId FK SoT
  },
};

// ============================================================================
// Errors
// ============================================================================

export class EvidenceLinkValidationError extends Error {
  constructor(
    public readonly code:
      | "invalid-target-type"
      | "invalid-relation-type"
      | "invalid-combination"
      | "cross-tenant-or-missing"
      | "malformed-input",
    message: string,
  ) {
    super(message);
    this.name = "EvidenceLinkValidationError";
  }
}

// ============================================================================
// Load existing links
// ============================================================================

export async function loadContentEntityLinks(
  tx: postgres.TransactionSql,
  instanceId: string,
  sourceType: SeoLinkSourceType,
  sourceId: string,
): Promise<EvidenceLink[]> {
  const rows: Array<{
    source_type: SeoLinkSourceType;
    source_id: string;
    target_type: SeoLinkTargetType;
    target_id: string;
    relation_type: SeoLinkRelationType;
    display_order: number;
  }> = await tx`
    SELECT source_type, source_id, target_type, target_id, relation_type, display_order
      FROM content_entity_link
     WHERE instance_id = ${instanceId}::uuid
       AND source_type = ${sourceType}
       AND source_id = ${sourceId}::uuid
     ORDER BY relation_type ASC, display_order ASC, target_type ASC, target_id ASC
  `;
  return rows.map((r) => ({
    sourceType: r.source_type,
    sourceId: r.source_id,
    targetType: r.target_type,
    targetId: r.target_id,
    relationType: r.relation_type,
    displayOrder: r.display_order,
  }));
}

// ============================================================================
// Parse form input (formData.getAll() pattern — cycle 1 #4)
// ============================================================================

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TARGET_TYPES: ReadonlyArray<SeoLinkTargetType> = [
  "Publication",
  "MediaAppearance",
  "FAQ",
  "TreatmentPage",
  "Article",
];
const RELATION_TYPES: ReadonlyArray<SeoLinkRelationType> = ["cites", "related-to", "derived-from"];

const linkTokenSchema = z
  .string()
  .regex(/^[A-Za-z]+:[0-9a-f-]+$/, "expected '<TargetType>:<uuid>'")
  .transform((s, ctx) => {
    const [type, id] = s.split(":", 2);
    if (!type || !id) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "malformed token" });
      return z.NEVER;
    }
    if (!TARGET_TYPES.includes(type as SeoLinkTargetType)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `unknown target_type: ${type}` });
      return z.NEVER;
    }
    if (!UUID_REGEX.test(id)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `invalid uuid: ${id}` });
      return z.NEVER;
    }
    return { targetType: type as SeoLinkTargetType, targetId: id.toLowerCase() };
  });

const linkArraySchema = z.array(linkTokenSchema);

/**
 * formData 의 다음 3 key 에서 link 토큰 회수 + zod 검증 + matrix 확인 + 중복 제거.
 *   - evidenceLinks_cites
 *   - evidenceLinks_relatedTo
 *   - evidenceLinks_derivedFrom
 * 각 key 안 다중 hidden input — getAll() 로 string[] 회수.
 */
export function parseEvidenceLinks(
  formData: FormData,
  sourceType: SeoLinkSourceType,
): DesiredEvidenceLink[] {
  const groups: Array<{ relation: SeoLinkRelationType; formKey: string }> = [
    { relation: "cites", formKey: "evidenceLinks_cites" },
    { relation: "related-to", formKey: "evidenceLinks_relatedTo" },
    { relation: "derived-from", formKey: "evidenceLinks_derivedFrom" },
  ];

  const matrix = RELATION_TARGET_MATRIX[sourceType];
  const out: DesiredEvidenceLink[] = [];
  const seen = new Set<string>(); // dedupe key: "<relation>:<targetType>:<targetId>"

  for (const { relation, formKey } of groups) {
    const raw = formData.getAll(formKey).filter((v): v is string => typeof v === "string" && v.length > 0);
    if (raw.length === 0) continue;

    const allowedTargets = matrix[relation];
    if (!allowedTargets || allowedTargets.length === 0) {
      // sourceType 안 해당 relation 미허용인데 input 이 들어옴 → invalid
      throw new EvidenceLinkValidationError(
        "invalid-combination",
        `${sourceType} 안 relation_type='${relation}' 는 허용되지 않습니다`,
      );
    }

    const parsed = linkArraySchema.safeParse(raw);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      throw new EvidenceLinkValidationError(
        "malformed-input",
        first ? `${formKey}: ${first.message}` : `${formKey}: 토큰 파싱 실패`,
      );
    }

    let displayOrder = 0;
    for (const { targetType, targetId } of parsed.data) {
      if (!allowedTargets.includes(targetType)) {
        throw new EvidenceLinkValidationError(
          "invalid-combination",
          `${sourceType} → ${relation} → ${targetType} 는 허용되지 않습니다`,
        );
      }
      const key = `${relation}:${targetType}:${targetId}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ targetType, targetId, relationType: relation, displayOrder });
      displayOrder += 1;
    }
  }

  void RELATION_TYPES; // 참조 보존 (lint)
  return out;
}

// ============================================================================
// Same-tenant verification (switch-based static SQL — cycle 1 #2)
// ============================================================================

export async function verifySameTenant(
  tx: postgres.TransactionSql,
  instanceId: string,
  links: ReadonlyArray<{ targetType: SeoLinkTargetType; targetId: string }>,
): Promise<void> {
  for (const link of links) {
    let rows: Array<{ exists: number }>;
    switch (link.targetType) {
      case "Publication":
        rows = await tx`
          SELECT 1 AS exists FROM publication
           WHERE instance_id = ${instanceId}::uuid AND id = ${link.targetId}::uuid LIMIT 1
        `;
        break;
      case "MediaAppearance":
        rows = await tx`
          SELECT 1 AS exists FROM media_appearance
           WHERE instance_id = ${instanceId}::uuid AND id = ${link.targetId}::uuid LIMIT 1
        `;
        break;
      case "FAQ":
        rows = await tx`
          SELECT 1 AS exists FROM faq
           WHERE instance_id = ${instanceId}::uuid AND id = ${link.targetId}::uuid LIMIT 1
        `;
        break;
      case "TreatmentPage":
        rows = await tx`
          SELECT 1 AS exists FROM treatment_page
           WHERE instance_id = ${instanceId}::uuid AND id = ${link.targetId}::uuid LIMIT 1
        `;
        break;
      case "Article":
        rows = await tx`
          SELECT 1 AS exists FROM article
           WHERE instance_id = ${instanceId}::uuid AND id = ${link.targetId}::uuid LIMIT 1
        `;
        break;
      case "MedicalConditionPage":
        // EXPOSURE_READINESS Phase B — Conditions 합류 (C0040 migration).
        rows = await tx`
          SELECT 1 AS exists FROM medical_condition_page
           WHERE instance_id = ${instanceId}::uuid AND id = ${link.targetId}::uuid LIMIT 1
        `;
        break;
      default: {
        const exhaustive: never = link.targetType;
        throw new EvidenceLinkValidationError(
          "invalid-target-type",
          `unsupported target_type: ${exhaustive as string}`,
        );
      }
    }
    if (rows.length === 0) {
      throw new EvidenceLinkValidationError(
        "cross-tenant-or-missing",
        `${link.targetType}/${link.targetId} 가 같은 instance 안 존재하지 않거나 다른 instance 소속입니다`,
      );
    }
  }
}

// ============================================================================
// Diff helpers
// ============================================================================

function linkKey(l: { targetType: string; targetId: string; relationType: string }): string {
  return `${l.relationType}:${l.targetType}:${l.targetId}`;
}

export function diffLinks(
  existing: ReadonlyArray<EvidenceLink>,
  desired: ReadonlyArray<DesiredEvidenceLink>,
): {
  toAdd: DesiredEvidenceLink[];
  toRemove: EvidenceLink[];
} {
  const existingKeys = new Set(existing.map(linkKey));
  const desiredKeys = new Set(desired.map(linkKey));
  return {
    toAdd: desired.filter((d) => !existingKeys.has(linkKey(d))),
    toRemove: existing.filter((e) => !desiredKeys.has(linkKey(e))),
  };
}

// ============================================================================
// Apply diff — INSERT toAdd, DELETE toRemove (single tx)
// ============================================================================

export async function applyLinkDiff(
  tx: postgres.TransactionSql,
  args: {
    instanceId: string;
    sourceType: SeoLinkSourceType;
    sourceId: string;
    toAdd: ReadonlyArray<DesiredEvidenceLink>;
    toRemove: ReadonlyArray<EvidenceLink>;
  },
): Promise<void> {
  for (const link of args.toRemove) {
    await tx`
      DELETE FROM content_entity_link
       WHERE instance_id = ${args.instanceId}::uuid
         AND source_type = ${args.sourceType}
         AND source_id = ${args.sourceId}::uuid
         AND target_type = ${link.targetType}
         AND target_id = ${link.targetId}::uuid
         AND relation_type = ${link.relationType}
    `;
  }
  for (const link of args.toAdd) {
    await tx`
      INSERT INTO content_entity_link (
        instance_id, source_type, source_id, target_type, target_id, relation_type, display_order
      ) VALUES (
        ${args.instanceId}::uuid,
        ${args.sourceType},
        ${args.sourceId}::uuid,
        ${link.targetType},
        ${link.targetId}::uuid,
        ${link.relationType},
        ${link.displayOrder}
      )
      ON CONFLICT (instance_id, source_type, source_id, target_type, target_id, relation_type) DO NOTHING
    `;
  }
}

// ============================================================================
// processEvidenceLinks — save action 안 통합 helper
// ============================================================================
//   순서: load existing → parse formData → diff → verify same-tenant → apply.
//   readiness 재계산은 caller 가 별도 호출 (entity row 가 트랜잭션 안에서 commit 후 visible).

export async function processEvidenceLinks(
  tx: postgres.TransactionSql,
  args: {
    instanceId: string;
    sourceType: SeoLinkSourceType;
    sourceId: string;
    formData: FormData;
  },
): Promise<{ added: number; removed: number }> {
  const existing = await loadContentEntityLinks(tx, args.instanceId, args.sourceType, args.sourceId);
  const desired = parseEvidenceLinks(args.formData, args.sourceType);
  const { toAdd, toRemove } = diffLinks(existing, desired);
  if (toAdd.length > 0) {
    await verifySameTenant(tx, args.instanceId, toAdd);
  }
  await applyLinkDiff(tx, {
    instanceId: args.instanceId,
    sourceType: args.sourceType,
    sourceId: args.sourceId,
    toAdd,
    toRemove,
  });
  return { added: toAdd.length, removed: toRemove.length };
}

// ============================================================================
// Orphan cleanup (delete action 안 호출 — cycle 1 #3 필수)
// ============================================================================

const SOURCE_CAPABLE: ReadonlyArray<string> = ["Article", "TreatmentPage", "FAQ"];

/**
 * entity 삭제 시 source/target 양방향 link 정리 + 영향 받은 source 목록 반환.
 * caller 가 affectedSources 를 readiness 재계산에 사용.
 */
export async function cleanupLinksForEntityDelete(
  tx: postgres.TransactionSql,
  instanceId: string,
  entityType: SeoLinkSourceType | SeoLinkTargetType,
  entityId: string,
): Promise<{ affectedSources: Array<{ sourceType: SeoLinkSourceType; sourceId: string }> }> {
  // (1) target 으로 등장한 link 의 source 들 미리 수집 — readiness 재계산 위해
  const targetSources: Array<{ source_type: SeoLinkSourceType; source_id: string }> = await tx`
    SELECT DISTINCT source_type, source_id
      FROM content_entity_link
     WHERE instance_id = ${instanceId}::uuid
       AND target_type = ${entityType}
       AND target_id = ${entityId}::uuid
  `;

  // (2) source 로 등장한 link 삭제 (entity 가 source_type 가능한 경우만)
  if (SOURCE_CAPABLE.includes(entityType)) {
    await tx`
      DELETE FROM content_entity_link
       WHERE instance_id = ${instanceId}::uuid
         AND source_type = ${entityType}
         AND source_id = ${entityId}::uuid
    `;
  }

  // (3) target 으로 등장한 link 삭제
  await tx`
    DELETE FROM content_entity_link
     WHERE instance_id = ${instanceId}::uuid
       AND target_type = ${entityType}
       AND target_id = ${entityId}::uuid
  `;

  return {
    affectedSources: targetSources.map((r) => ({
      sourceType: r.source_type,
      sourceId: r.source_id,
    })),
  };
}
