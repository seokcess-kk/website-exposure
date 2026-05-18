// @glitzy/storage/audit-log — URL scrubber 14 patterns·9 string fields·1~2 URL decode
// Spike C LOCAL_PASS 패턴

import { UrlLeakError } from "./errors.js";

export type AuditEntry = {
  readonly timestamp: number;
  readonly instanceId: string;
  readonly actorId: string;
  readonly actorRole: string;
  readonly action: "signed-url-issued" | "signed-url-rejected" | "object-uploaded" | "object-listed" | "cross-instance-copy";
  readonly objectKey: string | null;
  readonly method: "GET" | "PUT" | "DELETE" | "HEAD" | null;
  readonly contentType: string | null;
  readonly ttlSeconds: number | null;
  readonly result: "success" | "denied";
  readonly reason: string | null;
};

const FORBIDDEN_SUBSTRINGS = [
  "x-amz-signature", "x-amz-credential", "x-amz-security-token", "x-amz-signedheaders", "x-amz-algorithm",
  "x-amz-date=", "x-amz-expires=",
  "authorization:", "aws_access_key", "aws_secret_key", "secret_access_key", "access_token", "bearer ",
  "cookie:", "set-cookie", "sessionid=",
  "signature=", "credential=",
  "cf-access-jwt", "cf-connecting-ip",
] as const;

function decodedVariants(value: string): string[] {
  const variants: string[] = [value];
  try {
    const once = decodeURIComponent(value);
    if (once !== value) variants.push(once);
    try {
      const twice = decodeURIComponent(once);
      if (twice !== once) variants.push(twice);
    } catch { /* ignore */ }
  } catch { /* ignore */ }
  return variants;
}

function scanString(field: string, value: string): void {
  for (const variant of decodedVariants(value)) {
    const lower = variant.toLowerCase();
    for (const pattern of FORBIDDEN_SUBSTRINGS) {
      if (lower.includes(pattern)) throw new UrlLeakError(field, pattern);
    }
  }
  if (value.includes("?") && (value.toLowerCase().includes("x-amz-") || value.toLowerCase().includes("signature"))) {
    throw new UrlLeakError(field, "query-string-with-signature-fragment");
  }
}

const STRING_FIELDS: ReadonlyArray<keyof AuditEntry> = [
  "instanceId", "actorId", "actorRole", "action", "objectKey", "method", "contentType", "result", "reason",
];

function assertNoLeak(entry: AuditEntry): void {
  for (const field of STRING_FIELDS) {
    const value = entry[field];
    if (typeof value !== "string") continue;
    scanString(String(field), value);
  }
}

class AuditLog {
  private readonly entries: AuditEntry[] = [];
  append(entry: AuditEntry): void {
    assertNoLeak(entry);
    this.entries.push(entry);
  }
  list(): readonly AuditEntry[] { return this.entries; }
  clear(): void { this.entries.length = 0; }
  countByResult(result: AuditEntry["result"]): number {
    return this.entries.filter((e) => e.result === result).length;
  }
}

export const auditLog = new AuditLog();
