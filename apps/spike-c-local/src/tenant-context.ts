// Spike C — tenant context + prefix isolation
// SPIKEC1-001 cycle2: segment-based parser·path traversal·encoded slash·control char 차단
// SPIKEC1-002 cycle2: captured UUID에 UUID_REGEX 재검증·malformed UUID 일관 거부

import { MalformedObjectKeyError, TenantPrefixMismatchError } from "./errors.js";

// Canonical UUID v4 형식 — lowercase hex (RFC 4122 normalization)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Top-level object key namespace
const ROOT_NAMESPACE = "instances";

// Allowed character set for non-instance segments: alnum·hyphen·underscore·dot·slash 제외·whitespace 제외
// 단 segment 내부에서 dot 1개는 허용 (filename 확장자) — `..`은 별도 거부
const SEGMENT_CHAR_REGEX = /^[A-Za-z0-9_\-.()]+$/;

export type TenantContext = {
  readonly instanceId: string;
  readonly actorId: string;
  readonly actorRole: "operator" | "admin" | "service_role";
};

export function isValidUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

export function canonicalUuid(value: string): string {
  if (!isValidUuid(value)) {
    throw new MalformedObjectKeyError(`invalid UUID: ${value}`);
  }
  return value.toLowerCase();
}

export function instancePrefix(instanceId: string): string {
  return `${ROOT_NAMESPACE}/${canonicalUuid(instanceId)}/`;
}

/**
 * Parse and validate object key segments.
 * Returns canonical instanceId or throws MalformedObjectKeyError.
 *
 * 거부:
 *   - control character (0x00-0x1F, 0x7F)
 *   - null byte ('\0')
 *   - empty segment (`//`·trailing slash)
 *   - `.` `..` segment
 *   - URL-encoded slash (`%2F`·`%2f`)·URL-encoded backslash (`%5C`)
 *   - non-canonical UUID (hyphen 36자만으로 통과 불가)
 *   - 잘못된 char (whitespace·`?`·`#`·`\\`·non-printable·non-ascii — 본 spike LOCAL 가드)
 */
function parseObjectKey(objectKey: string): { instanceId: string; restSegments: readonly string[] } {
  // 1) control char / null byte 거부
  for (let i = 0; i < objectKey.length; i += 1) {
    const c = objectKey.charCodeAt(i);
    if (c < 0x20 || c === 0x7f) {
      throw new MalformedObjectKeyError(`control char at ${i}: ${objectKey}`);
    }
  }

  // 2) URL-encoded slash/backslash·query·fragment 거부
  const lower = objectKey.toLowerCase();
  if (lower.includes("%2f") || lower.includes("%5c") || lower.includes("%00")) {
    throw new MalformedObjectKeyError(`encoded slash/null: ${objectKey}`);
  }
  if (lower.includes("?") || lower.includes("#")) {
    throw new MalformedObjectKeyError(`query/fragment: ${objectKey}`);
  }
  if (lower.includes("\\")) {
    throw new MalformedObjectKeyError(`backslash: ${objectKey}`);
  }

  // 3) leading/trailing slash·double slash 거부
  if (objectKey.startsWith("/") || objectKey.endsWith("/") || objectKey.includes("//")) {
    throw new MalformedObjectKeyError(`leading/trailing/double slash: ${objectKey}`);
  }

  const segments = objectKey.split("/");
  if (segments.length < 3) {
    throw new MalformedObjectKeyError(`too few segments: ${objectKey}`);
  }
  if (segments[0] !== ROOT_NAMESPACE) {
    throw new MalformedObjectKeyError(`expected root segment '${ROOT_NAMESPACE}', got '${segments[0]}'`);
  }

  // 4) 각 segment 비어있지 않고·`.`·`..` 아님
  for (let i = 0; i < segments.length; i += 1) {
    const seg = segments[i]!;
    if (seg === "" || seg === "." || seg === "..") {
      throw new MalformedObjectKeyError(`invalid segment '${seg}' at index ${i}: ${objectKey}`);
    }
  }

  // 5) instanceId segment는 canonical UUID
  const instanceIdRaw = segments[1]!;
  const instanceId = canonicalUuid(instanceIdRaw);

  // 6) 나머지 segment는 허용 charset (alnum·hyphen·underscore·dot·괄호)
  for (let i = 2; i < segments.length; i += 1) {
    const seg = segments[i]!;
    if (!SEGMENT_CHAR_REGEX.test(seg)) {
      throw new MalformedObjectKeyError(`invalid char in segment '${seg}' at index ${i}: ${objectKey}`);
    }
  }

  return { instanceId, restSegments: segments.slice(2) };
}

/**
 * Validate that `objectKey` belongs to `ctx.instanceId`.
 * Always enforces canonical parsing — caller cannot skip.
 */
export function assertObjectKeyForInstance(ctx: TenantContext, objectKey: string): void {
  const { instanceId } = parseObjectKey(objectKey);
  const expected = canonicalUuid(ctx.instanceId);
  if (instanceId !== expected) {
    throw new TenantPrefixMismatchError(ctx.instanceId, objectKey);
  }
}

/**
 * service_role bypass — cross-instance copy 등 명시 의도.
 * 호출 시 audit insert 책임은 caller. (Spike A audit pattern과 동일)
 * canonical parsing은 동일 강제 — service_role도 malformed key는 거부.
 */
export function assertObjectKeyForServiceRole(ctx: TenantContext, objectKey: string): void {
  if (ctx.actorRole !== "service_role") {
    throw new TenantPrefixMismatchError(ctx.instanceId, objectKey);
  }
  parseObjectKey(objectKey); // throws on malformed
}

// 테스트 헬퍼 export — invariant runner·시나리오에서 instance generation에 사용
export { parseObjectKey };
