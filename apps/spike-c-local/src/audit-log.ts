// Spike C — in-memory audit log with URL scrubbing
// SPIKEC1-004 cycle2: 모든 string field·URL decode 1~2회·확장 credential patterns

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

/**
 * 금지 패턴 (lowercased):
 *   - AWS SigV4: x-amz-signature, x-amz-credential, x-amz-security-token, x-amz-signedheaders, x-amz-algorithm, x-amz-date=, x-amz-expires=
 *   - 일반 credential: authorization:, bearer , aws_access_key, aws_secret_key, access_token, secret_access_key
 *   - cookie/session: cookie:, set-cookie, sessionid=
 *   - Cloudflare: cf-access-jwt-assertion, cf-connecting-ip, cloudflare:
 *   - 일반 signature/credential keyword 패턴
 */
const FORBIDDEN_SUBSTRINGS = [
  // AWS SigV4 query params
  "x-amz-signature",
  "x-amz-credential",
  "x-amz-security-token",
  "x-amz-signedheaders",
  "x-amz-algorithm",
  "x-amz-date=",
  "x-amz-expires=",
  // generic credential leak patterns
  "authorization:",
  "aws_access_key",
  "aws_secret_key",
  "secret_access_key",
  "access_token",
  "bearer ",
  // session/cookie
  "cookie:",
  "set-cookie",
  "sessionid=",
  // generic
  "signature=",
  "credential=",
  // Cloudflare
  "cf-access-jwt",
  "cf-connecting-ip",
] as const;

export class UrlLeakError extends Error {
  override readonly name = "UrlLeakError";
  constructor(public readonly field: string, public readonly pattern: string) {
    super(`audit entry field '${field}' contains forbidden pattern '${pattern}' — possible URL/credential leak`);
  }
}

/**
 * 1~2회 URL decode 후 lowercase scan.
 * decode 실패 (malformed % sequence)는 원문만 scan.
 */
function decodedVariants(value: string): string[] {
  const variants: string[] = [value];
  try {
    const once = decodeURIComponent(value);
    if (once !== value) variants.push(once);
    try {
      const twice = decodeURIComponent(once);
      if (twice !== once) variants.push(twice);
    } catch {
      // ignore double-decode failure
    }
  } catch {
    // ignore single-decode failure (malformed %)
  }
  return variants;
}

function scanString(field: string, value: string): void {
  for (const variant of decodedVariants(value)) {
    const lower = variant.toLowerCase();
    for (const pattern of FORBIDDEN_SUBSTRINGS) {
      if (lower.includes(pattern)) {
        throw new UrlLeakError(field, pattern);
      }
    }
  }
  // additional: query string itself in objectKey-like field
  if (value.includes("?") && (value.toLowerCase().includes("x-amz-") || value.toLowerCase().includes("signature"))) {
    throw new UrlLeakError(field, "query-string-with-signature-fragment");
  }
}

const STRING_FIELDS: ReadonlyArray<keyof AuditEntry> = [
  "instanceId",
  "actorId",
  "actorRole",
  "action",
  "objectKey",
  "method",
  "contentType",
  "result",
  "reason",
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

  list(): readonly AuditEntry[] {
    return this.entries;
  }

  clear(): void {
    this.entries.length = 0;
  }

  countByAction(action: AuditEntry["action"]): number {
    return this.entries.filter((e) => e.action === action).length;
  }

  countByResult(result: AuditEntry["result"]): number {
    return this.entries.filter((e) => e.result === result).length;
  }
}

export const auditLog = new AuditLog();
