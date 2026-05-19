// @glitzy/compliance-rules — loader
// SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 3 (CAP-02·26 - catalogHash/schemaHash 분리)

import { readFile, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";

/**
 * monorepo root 자동 검색 - process.cwd() 부터 상향 데이터/compliance-rules/meta.yaml 존재 확인.
 *   apps/web 안 vitest 실행 시 process.cwd()=apps/web 라서 ../.. 검색 필요.
 */
async function findCatalogRoot(startDir: string): Promise<string> {
  let dir = startDir;
  for (let i = 0; i < 10; i++) {
    const candidate = resolve(dir, "data", "compliance-rules", "meta.yaml");
    try {
      await access(candidate);
      return resolve(dir, "data", "compliance-rules");
    } catch {
      const parent = dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }
  throw new ComplianceCatalogError(`catalog root not found - searched from ${startDir}`);
}
import { parse as parseYaml } from "yaml";
import Ajv from "ajv";
import addFormats from "ajv-formats";

import type {
  ContentScope,
  ContextException,
  LoadedCatalog,
  MedicalLawRevision,
  RiskRule,
  RiskRuleOverride,
  SlotMatchDefinition,
} from "./types.js";
import { computeCatalogHash, computeSchemaHash, type HashableFile } from "./hash.js";
import { isKssAvailable } from "./kss.js";

const ENGINE_VERSION = "1.0.0";

export class ComplianceCatalogError extends Error {
  override readonly name = "ComplianceCatalogError";
}

type RulesFileShape = {
  version: string;
  sourceDoc?: string;
  sourceDocVersion?: string;
  rules?: RiskRule[];
  overrides?: RiskRuleOverride[];
};

type ContextExceptionsFileShape = {
  version: string;
  exceptions: ContextException[];
};

type MedicalLawTrackingFileShape = {
  version: string;
  revisions: MedicalLawRevision[];
};

type SlotMatchesFileShape = {
  version: string;
  slots: SlotMatchDefinition[];
};

type MetaFileShape = {
  catalogVersion: string;
  medicalLawRevisionRef: string;
  loadOrder: {
    rules: string[];
    contextExceptions: string[];
    tracking: string[];
    slotMatches: string[];
  };
  files?: Record<string, { version: string; description?: string }>;
};

export async function loadCatalog(opts?: { rootDir?: string }): Promise<LoadedCatalog> {
  const rootDir = opts?.rootDir ?? (await findCatalogRoot(process.cwd()));

  // 1. meta.yaml 먼저 로드 - 파일 부재 시 ComplianceCatalogError throw (CAP-CODE3-03 fail closed)
  let metaContent: string;
  let schemaContent: string;
  try {
    metaContent = await readFile(resolve(rootDir, "meta.yaml"), "utf-8");
    schemaContent = await readFile(resolve(rootDir, "schema.json"), "utf-8");
  } catch (e) {
    throw new ComplianceCatalogError(`catalog file read failed at ${rootDir}: ${(e as Error).message}`);
  }
  const meta = parseYaml(metaContent) as MetaFileShape;

  // 3. AJV 초기화 + schema 컴파일 (CAP-CODE-01 정정 - 실 검증 활성화)
  //   schema.json 안 #/definitions/* 참조 해소 위해 root schema 자체를 addSchema 안 등록 + $id 별 getSchema 호출.
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  let schemaJson: { files?: Record<string, unknown>; definitions?: Record<string, unknown> };
  try {
    schemaJson = JSON.parse(schemaContent) as { files?: Record<string, unknown>; definitions?: Record<string, unknown> };
  } catch (e) {
    throw new ComplianceCatalogError(`schema.json parse failed: ${(e as Error).message}`);
  }
  const schemaFiles = schemaJson.files ?? {};
  // CAP-CODE-01 - 각 파일 sub-schema 안 $id 부여 + root schema 안 definitions 통합 후 compile
  const validators = new Map<string, ReturnType<typeof ajv.compile>>();
  // CAP-CODE2-05 정정 - schema 컴파일 실패 시 fail closed (catalog 로드 중단).
  for (const [key, schemaDef] of Object.entries(schemaFiles)) {
    try {
      const combined = {
        ...(schemaDef as object),
        definitions: schemaJson.definitions ?? {},
      };
      validators.set(key, ajv.compile(combined));
    } catch (e) {
      throw new ComplianceCatalogError(`schema ${key} compile failed: ${(e as Error).message}`);
    }
  }
  function validateAgainstSchema(filename: string, schemaKey: string, data: unknown): void {
    const validate = validators.get(schemaKey);
    if (!validate) {
      // CAP-CODE2-05 - validator 누락 시 fail closed (schema.json 안 sub-schema key 미정의)
      throw new ComplianceCatalogError(`${filename}: validator for schema "${schemaKey}" not found`);
    }
    if (!validate(data)) {
      const errors = (validate.errors ?? []).map((err) => `${err.instancePath} ${err.message}`).join(" · ");
      throw new ComplianceCatalogError(`${filename} schema validation failed: ${errors}`);
    }
  }

  // 4. meta.yaml 검증 + 각 파일 로드 + 검증 (CAP-CODE-01)
  validateAgainstSchema("meta.yaml", "metaFile", meta);

  const warnings: string[] = [];
  const hashableFiles: HashableFile[] = [{ name: "meta.yaml", content: metaContent }];
  const allRules: RiskRule[] = [];
  const allOverrides: RiskRuleOverride[] = [];

  for (const ruleFile of meta.loadOrder.rules) {
    const content = await readFile(resolve(rootDir, ruleFile), "utf-8");
    hashableFiles.push({ name: ruleFile, content });
    const data = parseYaml(content) as RulesFileShape;
    validateAgainstSchema(ruleFile, "rulesFile", data);
    if (data.rules) allRules.push(...data.rules);
    if (data.overrides) allOverrides.push(...data.overrides);
  }

  const contextExceptions: ContextException[] = [];
  for (const exFile of meta.loadOrder.contextExceptions) {
    const content = await readFile(resolve(rootDir, exFile), "utf-8");
    hashableFiles.push({ name: exFile, content });
    const data = parseYaml(content) as ContextExceptionsFileShape;
    validateAgainstSchema(exFile, "contextExceptionsFile", data);
    contextExceptions.push(...data.exceptions);
  }

  const medicalLawTracking: MedicalLawRevision[] = [];
  for (const trackingFile of meta.loadOrder.tracking) {
    const content = await readFile(resolve(rootDir, trackingFile), "utf-8");
    hashableFiles.push({ name: trackingFile, content });
    const data = parseYaml(content) as MedicalLawTrackingFileShape;
    validateAgainstSchema(trackingFile, "medicalLawTrackingFile", data);
    medicalLawTracking.push(...data.revisions);
  }

  const slotMatches: SlotMatchDefinition[] = [];
  for (const slotFile of meta.loadOrder.slotMatches) {
    const content = await readFile(resolve(rootDir, slotFile), "utf-8");
    hashableFiles.push({ name: slotFile, content });
    const data = parseYaml(content) as SlotMatchesFileShape;
    validateAgainstSchema(slotFile, "slotMatchesFile", data);
    if (data.slots) slotMatches.push(...data.slots);
  }

  // 5. overrides 머지 (RISK_LEVELS § 3.4.2)
  const mergedRules = mergeOverrides(allRules, allOverrides);

  // 6. id 중복 검증
  const idSet = new Set<string>();
  for (const r of mergedRules) {
    if (idSet.has(r.id)) {
      throw new ComplianceCatalogError(`duplicate RiskRule.id: ${r.id}`);
    }
    idSet.add(r.id);
  }

  // 7. field/block/feature scope 룰 skip + warning (CAP-23·24)
  const filteredRules = mergedRules.filter((rule) => {
    for (const s of rule.scope) {
      if (s.type === "field") {
        warnings.push(`rule ${rule.id} skipped — field scope unsupported (CA-DEFER-20)`);
        return false;
      }
      if (s.type === "block" && s.blockType !== "qa") {
        warnings.push(`rule ${rule.id} skipped — block scope ${s.blockType} unsupported (CA-DEFER-21)`);
        return false;
      }
      if (s.type === "feature") {
        warnings.push(`rule ${rule.id} skipped — feature scope unsupported (CA-DEFER-16)`);
        return false;
      }
    }
    return true;
  });

  // 8. client role 등록 룰 warning (CAP-15)
  for (const rule of filteredRules) {
    if (rule.requiredApproverRoles?.includes("client")) {
      warnings.push(`rule ${rule.id} contains client role (CA-DEFER-10) — runtime queue unavailable`);
    }
  }

  // 9. 해시 산정
  const catalogHash = computeCatalogHash(hashableFiles);
  const schemaHash = computeSchemaHash(schemaContent);
  const kssAvailable = isKssAvailable();

  return {
    rules: filteredRules,
    contextExceptions,
    slotMatches,
    medicalLawTracking,
    catalogVersion: meta.catalogVersion,
    catalogHash,
    schemaHash,
    engineVersion: ENGINE_VERSION,
    kssAvailable,
    warnings,
  };
}

function mergeOverrides(rules: RiskRule[], overrides: RiskRuleOverride[]): RiskRule[] {
  if (overrides.length === 0) return rules;

  // override targetRuleId 중복 검증
  const overrideMap = new Map<string, RiskRuleOverride>();
  for (const ov of overrides) {
    if (overrideMap.has(ov.targetRuleId)) {
      throw new ComplianceCatalogError(`duplicate override for: ${ov.targetRuleId}`);
    }
    overrideMap.set(ov.targetRuleId, ov);
  }

  const result: RiskRule[] = [];
  for (const rule of rules) {
    const ov = overrideMap.get(rule.id);
    if (!ov) {
      result.push(rule);
      continue;
    }
    // patch 적용 - 스칼라/배열 전체 교체 · 객체 deep merge 안 함 (배열 union 아님)
    const merged: RiskRule = { ...rule, ...(ov.patch as Partial<RiskRule>) } as RiskRule;
    result.push(merged);
    overrideMap.delete(rule.id);
  }
  // target 매칭 안 된 override 검증
  for (const [targetId] of overrideMap) {
    throw new ComplianceCatalogError(`override target not found: ${targetId}`);
  }
  return result;
}

// in-memory 캐시
let cachedCatalog: LoadedCatalog | null = null;
let cachedRootDir: string | null = null;

export async function getCachedCatalog(opts?: { rootDir?: string }): Promise<LoadedCatalog> {
  const rootDir = opts?.rootDir ?? (await findCatalogRoot(process.cwd()));
  if (cachedCatalog && cachedRootDir === rootDir) return cachedCatalog;
  cachedCatalog = await loadCatalog({ rootDir });
  cachedRootDir = rootDir;
  return cachedCatalog;
}

export function clearCatalogCache(): void {
  cachedCatalog = null;
  cachedRootDir = null;
}
