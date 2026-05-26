// @glitzy/web/lib/admin/keyword-content-link — SEO_KEYWORD_STRATEGY_PLAN v0.2 Phase 2 helper
//
// EVIDENCE_LINKING_PLAN 의 content-entity-link 패턴 답습. 차이점:
//   - source 가 항상 keyword_target (id)
//   - target 5종 (Article · TreatmentPage · FAQ · Publication · MediaAppearance)
//   - is_primary marker — readiness `title-has-target-keyword` check 에 영향
//   - relation_type 개념 없음 (v1)
//
// SoT: docs/decisions/SEO_KEYWORD_STRATEGY_PLAN.md v0.2 § 4.3 · § 5.5

import type postgres from "postgres";
import { z } from "zod";

import type { SeoKeywordEntityType } from "@glitzy/core-content";

// ============================================================================
// Types
// ============================================================================

export type KeywordContentLink = {
  keywordId: string;
  entityType: SeoKeywordEntityType;
  entityId: string;
  isPrimary: boolean;
  relevanceScore: number;
};

export type DesiredKeywordLink = {
  entityType: SeoKeywordEntityType;
  entityId: string;
  isPrimary: boolean;
};

export class KeywordLinkValidationError extends Error {
  constructor(
    public readonly code:
      | "invalid-entity-type"
      | "cross-tenant-or-missing"
      | "malformed-input",
    message: string,
  ) {
    super(message);
    this.name = "KeywordLinkValidationError";
  }
}

// ============================================================================
// Load existing links
// ============================================================================

export async function loadKeywordContentLinks(
  tx: postgres.TransactionSql,
  instanceId: string,
  keywordId: string,
): Promise<KeywordContentLink[]> {
  const rows: Array<{
    keyword_id: string;
    entity_type: SeoKeywordEntityType;
    entity_id: string;
    is_primary: boolean;
    relevance_score: number;
  }> = await tx`
    SELECT keyword_id, entity_type, entity_id, is_primary, relevance_score
      FROM keyword_content_link
     WHERE instance_id = ${instanceId}::uuid
       AND keyword_id = ${keywordId}::uuid
     ORDER BY entity_type ASC, entity_id ASC
  `;
  return rows.map((r) => ({
    keywordId: r.keyword_id,
    entityType: r.entity_type,
    entityId: r.entity_id,
    isPrimary: r.is_primary,
    relevanceScore: r.relevance_score,
  }));
}

// ============================================================================
// Parse form input — formData.getAll() + primaryKeywordLinks (cycle 1 #7)
// ============================================================================

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ENTITY_TYPES: ReadonlyArray<SeoKeywordEntityType> = [
  "Article",
  "TreatmentPage",
  "FAQ",
  "Publication",
  "MediaAppearance",
];

const linkTokenSchema = z
  .string()
  .regex(/^[A-Za-z]+:[0-9a-f-]+$/, "expected '<EntityType>:<uuid>'")
  .transform((s, ctx) => {
    const [type, id] = s.split(":", 2);
    if (!type || !id) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "malformed token" });
      return z.NEVER;
    }
    if (!ENTITY_TYPES.includes(type as SeoKeywordEntityType)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `unknown entity_type: ${type}` });
      return z.NEVER;
    }
    if (!UUID_REGEX.test(id)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `invalid uuid: ${id}` });
      return z.NEVER;
    }
    return { entityType: type as SeoKeywordEntityType, entityId: id.toLowerCase() };
  });
const linkArraySchema = z.array(linkTokenSchema);

/**
 * formData.getAll() 패턴 + primaryKeywordLinks 별도 input 으로 primary marker 회수.
 * SEO_KEYWORD_STRATEGY_PLAN v0.2 § 4.3 정합.
 */
export function parseKeywordLinks(formData: FormData): DesiredKeywordLink[] {
  const allLinkTokens: string[] = [];
  for (const type of ENTITY_TYPES) {
    const raw = formData.getAll(`keywordLinks_${type}`)
      .filter((v): v is string => typeof v === "string" && v.length > 0);
    allLinkTokens.push(...raw);
  }
  const primaryTokens = formData.getAll("primaryKeywordLinks")
    .filter((v): v is string => typeof v === "string" && v.length > 0);

  if (allLinkTokens.length === 0 && primaryTokens.length === 0) return [];

  const linksParsed = linkArraySchema.safeParse(allLinkTokens);
  if (!linksParsed.success) {
    const first = linksParsed.error.issues[0];
    throw new KeywordLinkValidationError(
      "malformed-input",
      first ? `keywordLinks 토큰: ${first.message}` : "keywordLinks 토큰 파싱 실패",
    );
  }
  const primaryParsed = linkArraySchema.safeParse(primaryTokens);
  if (!primaryParsed.success) {
    const first = primaryParsed.error.issues[0];
    throw new KeywordLinkValidationError(
      "malformed-input",
      first ? `primaryKeywordLinks: ${first.message}` : "primary 토큰 파싱 실패",
    );
  }
  const primarySet = new Set(primaryParsed.data.map((t) => `${t.entityType}:${t.entityId}`));

  // dedupe + primary marker 매칭
  const seen = new Set<string>();
  const out: DesiredKeywordLink[] = [];
  for (const t of linksParsed.data) {
    const key = `${t.entityType}:${t.entityId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      entityType: t.entityType,
      entityId: t.entityId,
      isPrimary: primarySet.has(key),
    });
  }
  // primary 만 있고 keywordLinks 안 없는 경우 — primary set 안 token 도 추가 (운영자가 primary 만 체크한 경우 자동 link)
  for (const t of primaryParsed.data) {
    const key = `${t.entityType}:${t.entityId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ entityType: t.entityType, entityId: t.entityId, isPrimary: true });
  }
  return out;
}

// ============================================================================
// Same-tenant verification (switch-based static SQL — cycle 1 #2 정합)
// ============================================================================

export async function verifySameTenantForKeywordLinks(
  tx: postgres.TransactionSql,
  instanceId: string,
  links: ReadonlyArray<{ entityType: SeoKeywordEntityType; entityId: string }>,
): Promise<void> {
  for (const link of links) {
    let rows: Array<{ exists: number }>;
    switch (link.entityType) {
      case "Article":
        rows = await tx`SELECT 1 AS exists FROM article
                         WHERE instance_id = ${instanceId}::uuid AND id = ${link.entityId}::uuid LIMIT 1`;
        break;
      case "TreatmentPage":
        rows = await tx`SELECT 1 AS exists FROM treatment_page
                         WHERE instance_id = ${instanceId}::uuid AND id = ${link.entityId}::uuid LIMIT 1`;
        break;
      case "FAQ":
        rows = await tx`SELECT 1 AS exists FROM faq
                         WHERE instance_id = ${instanceId}::uuid AND id = ${link.entityId}::uuid LIMIT 1`;
        break;
      case "Publication":
        rows = await tx`SELECT 1 AS exists FROM publication
                         WHERE instance_id = ${instanceId}::uuid AND id = ${link.entityId}::uuid LIMIT 1`;
        break;
      case "MediaAppearance":
        rows = await tx`SELECT 1 AS exists FROM media_appearance
                         WHERE instance_id = ${instanceId}::uuid AND id = ${link.entityId}::uuid LIMIT 1`;
        break;
      case "MedicalConditionPage":
        // EXPOSURE_READINESS Phase C — Conditions 합류 (C0040 keyword_content_link CHECK 확장).
        rows = await tx`SELECT 1 AS exists FROM medical_condition_page
                         WHERE instance_id = ${instanceId}::uuid AND id = ${link.entityId}::uuid LIMIT 1`;
        break;
      default: {
        const exhaustive: never = link.entityType;
        throw new KeywordLinkValidationError(
          "invalid-entity-type",
          `unsupported entity_type: ${exhaustive as string}`,
        );
      }
    }
    if (rows.length === 0) {
      throw new KeywordLinkValidationError(
        "cross-tenant-or-missing",
        `${link.entityType}/${link.entityId} 가 같은 instance 안 존재하지 않거나 다른 instance 소속입니다`,
      );
    }
  }
}

// ============================================================================
// Diff + Apply
// ============================================================================

function linkKey(l: { entityType: string; entityId: string }): string {
  return `${l.entityType}:${l.entityId}`;
}

export function diffKeywordLinks(
  existing: ReadonlyArray<KeywordContentLink>,
  desired: ReadonlyArray<DesiredKeywordLink>,
): {
  toAdd: DesiredKeywordLink[];
  toRemove: KeywordContentLink[];
  toUpdate: Array<{ existing: KeywordContentLink; desired: DesiredKeywordLink }>;
} {
  const existingMap = new Map(existing.map((e) => [linkKey(e), e]));
  const desiredMap = new Map(desired.map((d) => [linkKey(d), d]));
  const toAdd: DesiredKeywordLink[] = [];
  const toRemove: KeywordContentLink[] = [];
  const toUpdate: Array<{ existing: KeywordContentLink; desired: DesiredKeywordLink }> = [];

  for (const d of desired) {
    const e = existingMap.get(linkKey(d));
    if (!e) {
      toAdd.push(d);
    } else if (e.isPrimary !== d.isPrimary) {
      toUpdate.push({ existing: e, desired: d });
    }
  }
  for (const e of existing) {
    if (!desiredMap.has(linkKey(e))) toRemove.push(e);
  }
  return { toAdd, toRemove, toUpdate };
}

export async function applyKeywordLinkDiff(
  tx: postgres.TransactionSql,
  args: {
    instanceId: string;
    keywordId: string;
    toAdd: ReadonlyArray<DesiredKeywordLink>;
    toRemove: ReadonlyArray<KeywordContentLink>;
    toUpdate: ReadonlyArray<{ existing: KeywordContentLink; desired: DesiredKeywordLink }>;
  },
): Promise<void> {
  for (const link of args.toRemove) {
    await tx`
      DELETE FROM keyword_content_link
       WHERE instance_id = ${args.instanceId}::uuid
         AND keyword_id = ${args.keywordId}::uuid
         AND entity_type = ${link.entityType}
         AND entity_id = ${link.entityId}::uuid
    `;
  }
  for (const link of args.toAdd) {
    await tx`
      INSERT INTO keyword_content_link (
        instance_id, keyword_id, entity_type, entity_id, is_primary, relevance_score
      ) VALUES (
        ${args.instanceId}::uuid,
        ${args.keywordId}::uuid,
        ${link.entityType},
        ${link.entityId}::uuid,
        ${link.isPrimary},
        50
      )
      ON CONFLICT (instance_id, keyword_id, entity_type, entity_id) DO UPDATE SET
        is_primary = EXCLUDED.is_primary,
        updated_at = NOW()
    `;
  }
  for (const { desired } of args.toUpdate) {
    await tx`
      UPDATE keyword_content_link
         SET is_primary = ${desired.isPrimary},
             updated_at = NOW()
       WHERE instance_id = ${args.instanceId}::uuid
         AND keyword_id = ${args.keywordId}::uuid
         AND entity_type = ${desired.entityType}
         AND entity_id = ${desired.entityId}::uuid
    `;
  }
}

// ============================================================================
// processKeywordLinks — save action 안 통합 helper
// ============================================================================

export async function processKeywordLinks(
  tx: postgres.TransactionSql,
  args: {
    instanceId: string;
    keywordId: string;
    formData: FormData;
  },
): Promise<{ added: number; removed: number; updated: number; affectedEntities: Array<{ entityType: SeoKeywordEntityType; entityId: string }> }> {
  const existing = await loadKeywordContentLinks(tx, args.instanceId, args.keywordId);
  const desired = parseKeywordLinks(args.formData);
  const { toAdd, toRemove, toUpdate } = diffKeywordLinks(existing, desired);
  if (toAdd.length > 0) {
    await verifySameTenantForKeywordLinks(tx, args.instanceId, toAdd);
  }
  await applyKeywordLinkDiff(tx, {
    instanceId: args.instanceId,
    keywordId: args.keywordId,
    toAdd,
    toRemove,
    toUpdate,
  });
  // 영향 받은 entity 목록: 추가/제거/primary 토글 — readiness 재계산 대상
  const affectedKeys = new Set<string>();
  const affectedEntities: Array<{ entityType: SeoKeywordEntityType; entityId: string }> = [];
  const add = (e: { entityType: SeoKeywordEntityType; entityId: string }) => {
    const k = linkKey(e);
    if (affectedKeys.has(k)) return;
    affectedKeys.add(k);
    affectedEntities.push({ entityType: e.entityType, entityId: e.entityId });
  };
  for (const l of toAdd) add(l);
  for (const l of toRemove) add(l);
  for (const u of toUpdate) add(u.desired);
  return { added: toAdd.length, removed: toRemove.length, updated: toUpdate.length, affectedEntities };
}

// ============================================================================
// Orphan cleanup — entity delete 시 keyword_content_link 정리 (cycle 1 #3)
// ============================================================================

/**
 * source entity 삭제 시 keyword_content_link 의 entity_type/entity_id row 정리.
 * EVIDENCE_LINKING_PLAN 의 cleanupLinksForEntityDelete 와 나란히 호출 (5 delete action 안).
 * 영향 받은 keyword 목록 반환 — caller 가 dashboard revalidate 결정 (현재는 별도 readiness 영향 X — keyword 자체는 그대로).
 */
export async function cleanupKeywordLinksForEntityDelete(
  tx: postgres.TransactionSql,
  instanceId: string,
  entityType: SeoKeywordEntityType,
  entityId: string,
): Promise<{ affectedKeywords: string[] }> {
  const rows: Array<{ keyword_id: string }> = await tx`
    SELECT DISTINCT keyword_id FROM keyword_content_link
     WHERE instance_id = ${instanceId}::uuid
       AND entity_type = ${entityType}
       AND entity_id = ${entityId}::uuid
  `;
  await tx`
    DELETE FROM keyword_content_link
     WHERE instance_id = ${instanceId}::uuid
       AND entity_type = ${entityType}
       AND entity_id = ${entityId}::uuid
  `;
  return { affectedKeywords: rows.map((r) => r.keyword_id) };
}
