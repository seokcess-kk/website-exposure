// @glitzy/compliance-rules — hash
// SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 3.4 (CAP-26 - catalogHash 데이터 한정 · schemaHash 별도)

import { createHash } from "node:crypto";

export type HashableFile = { name: string; content: string };

function normalize(content: string): string {
  return content.trim().replace(/\r\n/g, "\n");
}

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

/**
 * catalogHash - 6 YAML 데이터 파일만 hash (schema.json 미포함).
 *   환경 차이 영향 없음 (kssAvailable 등 runtime capability 미포함).
 */
export function computeCatalogHash(files: HashableFile[]): string {
  const sorted = files.slice().sort((a, b) => a.name.localeCompare(b.name));
  const normalized = sorted.map((f) => `${f.name}\n${normalize(f.content)}`);
  return sha256(normalized.join("\n---\n"));
}

/**
 * schemaHash - schema.json 단일 파일 hash. 검증 규칙 변경 추적용.
 */
export function computeSchemaHash(schemaContent: string): string {
  return sha256(normalize(schemaContent));
}
