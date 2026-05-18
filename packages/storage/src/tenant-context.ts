// @glitzy/storage/tenant-context — Spike C segment-based parser
// M1 cycle2: UUID_V4_REGEX from @glitzy/shared-types — auth와 일관·v4 strict

import { UUID_V4_REGEX } from "@glitzy/shared-types";

import { MalformedObjectKeyError, TenantPrefixMismatchError } from "./errors.js";

const UUID_REGEX = UUID_V4_REGEX;
const ROOT_NAMESPACE = "instances";
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
  if (!isValidUuid(value)) throw new MalformedObjectKeyError(`invalid UUID: ${value}`);
  return value.toLowerCase();
}

export function instancePrefix(instanceId: string): string {
  return `${ROOT_NAMESPACE}/${canonicalUuid(instanceId)}/`;
}

function parseObjectKey(objectKey: string): { instanceId: string; restSegments: readonly string[] } {
  for (let i = 0; i < objectKey.length; i += 1) {
    const c = objectKey.charCodeAt(i);
    if (c < 0x20 || c === 0x7f) throw new MalformedObjectKeyError(`control char at ${i}`);
  }
  const lower = objectKey.toLowerCase();
  if (lower.includes("%2f") || lower.includes("%5c") || lower.includes("%00")) throw new MalformedObjectKeyError(`encoded slash/null`);
  if (lower.includes("?") || lower.includes("#")) throw new MalformedObjectKeyError(`query/fragment`);
  if (lower.includes("\\")) throw new MalformedObjectKeyError(`backslash`);
  if (objectKey.startsWith("/") || objectKey.endsWith("/") || objectKey.includes("//")) throw new MalformedObjectKeyError(`leading/trailing/double slash`);

  const segments = objectKey.split("/");
  if (segments.length < 3) throw new MalformedObjectKeyError(`too few segments`);
  if (segments[0] !== ROOT_NAMESPACE) throw new MalformedObjectKeyError(`expected root '${ROOT_NAMESPACE}'`);

  for (let i = 0; i < segments.length; i += 1) {
    const seg = segments[i]!;
    if (seg === "" || seg === "." || seg === "..") throw new MalformedObjectKeyError(`invalid segment '${seg}'`);
  }
  const instanceId = canonicalUuid(segments[1]!);
  for (let i = 2; i < segments.length; i += 1) {
    if (!SEGMENT_CHAR_REGEX.test(segments[i]!)) throw new MalformedObjectKeyError(`invalid char in segment '${segments[i]}'`);
  }
  return { instanceId, restSegments: segments.slice(2) };
}

export function assertObjectKeyForInstance(ctx: TenantContext, objectKey: string): void {
  const { instanceId } = parseObjectKey(objectKey);
  const expected = canonicalUuid(ctx.instanceId);
  if (instanceId !== expected) throw new TenantPrefixMismatchError(ctx.instanceId, objectKey);
}

export function assertObjectKeyForServiceRole(ctx: TenantContext, objectKey: string): void {
  if (ctx.actorRole !== "service_role") throw new TenantPrefixMismatchError(ctx.instanceId, objectKey);
  parseObjectKey(objectKey);
}

export { parseObjectKey };
