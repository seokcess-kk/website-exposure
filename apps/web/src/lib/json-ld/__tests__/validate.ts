// @glitzy/web/lib/json-ld/__tests__/validate — 자체 JSON-LD rule checker (LOCAL_PASS)
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-14 (cycle1 PSR-17 — 외부 validator manual QA)
//
// 통과 기준:
//   1. JSON parse OK
//   2. @context = "https://schema.org" + @graph 배열
//   3. @id 유일 (graph 안 중복 없음)
//   4. cross-reference 무결성 — `{ "@id": "..." }` 참조가 그래프 안 entity @id 또는 외부 dereferenceable URL
//   5. 페이지 타입별 expected entities 존재 (SCHEMA_MAPPING § 2.5 정합)

import type { JsonLdGraph, JsonLdEntity } from "../types";

export type ValidationResult =
  | { ok: true }
  | { ok: false; errors: string[] };

// PSRC-06 / PSRC-16 / PSRC-18 patch:
//   1. inline minimal 객체 (`@id` + `@type` + 추가 필드) 는 self-contained inline 으로 인정 (검사 제외).
//   2. pure ref (`@id` 만 있는 객체) 는 graph entity 또는 cross-page reference allowlist 또는 외부 origin URL.
//   3. cross-page reference allowlist: `${siteBaseUrl}/#organization` · `/#website` · `/#clinic` —
//      SCHEMA_MAPPING § 2.5 "참조만" 페이지의 cross-page ref 패턴 (PSRC-16 patch).

const CROSS_PAGE_REF_FRAGMENTS = new Set(["organization", "website", "clinic"]);

function hasSchemaType(value: unknown): value is string | string[] {
  return typeof value === "string" || (Array.isArray(value) && value.length > 0 && value.every((t) => typeof t === "string"));
}

function entityTypes(value: JsonLdEntity): string[] {
  return Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]];
}

// PSRC-20 patch: tenant base path 까지 비교 — multi-tenant 환경에서 다른 path tenant 의 fragment 가 통과되지 않도록.
//   v0.1 path-based SoT 의 `https://<host>/<instanceSlug>/#fragment` 패턴 정합.
function isCrossPageRef(ref: string, siteBaseUrl: string | null): boolean {
  if (!siteBaseUrl) return false;
  try {
    const u = new URL(ref);
    const base = new URL(siteBaseUrl);
    if (u.origin !== base.origin) return false;
    // base pathname (예: `/glitzy-clinic`) 와 ref pathname 의 tenant root 일치 검사.
    // ref 는 `<base.pathname>/#fragment` 또는 `<base.pathname><path>#fragment` 형태.
    const basePath = base.pathname.replace(/\/$/, "");
    const refPath = u.pathname.replace(/\/$/, "");
    if (refPath !== basePath && !refPath.startsWith(`${basePath}/`)) return false;
    if (!u.hash.startsWith("#")) return false;
    return CROSS_PAGE_REF_FRAGMENTS.has(u.hash.slice(1));
  } catch {
    return false;
  }
}

// PSRC-20 patch: same-origin 검사도 tenant base path 까지 비교.
function isSameTenantUrl(ref: string, siteBaseUrl: string | null): boolean {
  if (!siteBaseUrl) return false;
  try {
    const u = new URL(ref);
    const base = new URL(siteBaseUrl);
    if (u.origin !== base.origin) return false;
    const basePath = base.pathname.replace(/\/$/, "");
    const refPath = u.pathname.replace(/\/$/, "");
    return refPath === basePath || refPath.startsWith(`${basePath}/`);
  } catch {
    return false;
  }
}

export function validateJsonLdGraph(graph: unknown, opts: { siteBaseUrl?: string } = {}): ValidationResult {
  const errors: string[] = [];

  // (1)(2) shape
  if (typeof graph !== "object" || graph === null) return { ok: false, errors: ["graph must be object"] };
  const g = graph as Record<string, unknown>;
  if (g["@context"] !== "https://schema.org") errors.push("@context must be https://schema.org");
  const arr = g["@graph"];
  if (!Array.isArray(arr)) {
    return { ok: false, errors: [...errors, "@graph must be array"] };
  }

  const siteBaseUrl = opts.siteBaseUrl ?? null;

  // (3) @id 유일
  const ids = new Set<string>();
  const idMap = new Map<string, JsonLdEntity>();
  for (const ent of arr) {
    if (typeof ent !== "object" || ent === null) {
      errors.push("entity must be object");
      continue;
    }
    const e = ent as Record<string, unknown>;
    if (!hasSchemaType(e["@type"])) errors.push(`entity missing @type`);
    if (typeof e["@id"] !== "string") errors.push(`entity missing @id`);
    if (typeof e["@id"] === "string") {
      if (ids.has(e["@id"])) errors.push(`duplicate @id: ${e["@id"]}`);
      ids.add(e["@id"]);
      idMap.set(e["@id"], e as JsonLdEntity);
    }
  }

  // (4) cross-reference — pure ref `{ "@id": "..." }` 만 검사 (inline `{@id, @type, ...}` 객체는 self-contained).
  //   PSRC-18 patch: `@type` 존재 시 inline minimal entity 로 간주 (검사 제외, recurse 만).
  //   PSRC-16 patch: cross-page reference allowlist (`#organization`/`#website`/`#clinic`) 는 graph entity 미존재 OK.
  function checkRefs(value: unknown, path: string): void {
    if (typeof value !== "object" || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((v, i) => checkRefs(v, `${path}[${i}]`));
      return;
    }
    const v = value as Record<string, unknown>;
    const hasId = typeof v["@id"] === "string";
    const hasType = hasSchemaType(v["@type"]);
    if (hasId && !hasType) {
      // pure ref
      const ref = v["@id"] as string;
      if (!ids.has(ref) && !isCrossPageRef(ref, siteBaseUrl)) {
        const refOrigin = tryOrigin(ref);
        const siteOrigin = siteBaseUrl ? tryOrigin(siteBaseUrl) : null;
        if (refOrigin === null) {
          errors.push(`unresolved reference at ${path}: ${ref}`);
        } else if (siteOrigin && refOrigin === siteOrigin) {
          // PSRC-21 patch: same-origin (cross-tenant 포함) 은 dereferenceable 예외에서 제외 — graph entity 또는 cross-page allowlist 필수.
          if (isSameTenantUrl(ref, siteBaseUrl)) {
            errors.push(`unresolved same-tenant reference at ${path}: ${ref}`);
          } else {
            errors.push(`cross-tenant reference forbidden at ${path}: ${ref}`);
          }
        }
        // 진짜 외부 origin URL → dereferenceable 예외 (통과)
      }
    }
    for (const [k, vv] of Object.entries(v)) {
      if (k === "@type" || k === "@id") continue;
      checkRefs(vv, `${path}.${k}`);
    }
  }
  arr.forEach((ent, i) => checkRefs(ent, `@graph[${i}]`));

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}

function tryOrigin(url: string): string | null {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

/**
 * 페이지 타입별 expected entity types 검증
 */
export function validateExpectedEntities(graph: JsonLdGraph, expected: ReadonlyArray<string>): ValidationResult {
  const present = new Set(graph["@graph"].flatMap(entityTypes));
  const missing = expected.filter((t) => !present.has(t));
  if (missing.length === 0) return { ok: true };
  return { ok: false, errors: [`missing expected entities: ${missing.join(", ")}`] };
}
