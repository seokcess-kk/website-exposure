// @glitzy/auth/magic-link — atomic CAS·SHA-256·NFC normalize·EMAIL_REGEX
// Spike E LOCAL_PASS 패턴 그대로

import { createHash, randomBytes } from "node:crypto";
import type postgres from "postgres";

import { AuthDeniedError } from "./errors.js";
import type { AuthConfig } from "./config.js";

export type MagicLinkIssued = {
  readonly identifier: string;
  readonly tokenPlain: string;
  readonly expiresAt: Date;
};

const mockMailbox: Array<{ to: string; tokenPlain: string; at: number }> = [];
export function getMockMailbox(): ReadonlyArray<{ to: string; tokenPlain: string; at: number }> { return mockMailbox; }
export function clearMockMailbox(): void { mockMailbox.length = 0; }

function hashToken(plain: string): string {
  return createHash("sha256").update(plain).digest("hex");
}

const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

export function normalizeIdentifier(input: string): string {
  if (typeof input !== "string") throw new AuthDeniedError("magic-link-invalid", `identifier must be string`);
  const trimmed = input.trim();
  if (trimmed.length === 0 || trimmed.length > 254) {
    throw new AuthDeniedError("magic-link-invalid", `identifier length invalid`);
  }
  const normalized = trimmed.normalize("NFC").toLowerCase();
  if (!EMAIL_REGEX.test(normalized)) {
    throw new AuthDeniedError("magic-link-invalid", `invalid email format`);
  }
  return normalized;
}

export async function issueMagicLink(
  sql: postgres.Sql,
  cfg: AuthConfig,
  identifier: string,
): Promise<MagicLinkIssued> {
  const normalized = normalizeIdentifier(identifier);
  const tokenPlain = randomBytes(32).toString("base64url");
  const tokenHashed = hashToken(tokenPlain);
  const expiresAt = new Date(Date.now() + cfg.magicLinkTtlSeconds * 1000);
  await sql`
    INSERT INTO "verificationToken" ("identifier", "token", "expires")
    VALUES (${normalized}, ${tokenHashed}, ${expiresAt})
  `;
  if (cfg.resendMode === "mock") {
    mockMailbox.push({ to: normalized, tokenPlain, at: Date.now() });
  }
  return { identifier: normalized, tokenPlain, expiresAt };
}

/**
 * Consume: atomic CAS UPDATE with consumedAt IS NULL AND expires > now()
 */
export async function consumeMagicLink(sql: postgres.Sql, identifier: string, tokenPlain: string): Promise<string> {
  const normalized = normalizeIdentifier(identifier);
  const tokenHashed = hashToken(tokenPlain);

  const updated = await sql<{ identifier: string }[]>`
    UPDATE "verificationToken"
    SET "consumedAt" = now()
    WHERE "identifier" = ${normalized}
      AND "token" = ${tokenHashed}
      AND "consumedAt" IS NULL
      AND "expires" > now()
    RETURNING "identifier"
  `;
  if (updated.length === 1) return normalized;

  const lookup = await sql<{ expires: Date; consumed_at: Date | null }[]>`
    SELECT "expires", "consumedAt" AS consumed_at FROM "verificationToken"
    WHERE "identifier" = ${normalized} AND "token" = ${tokenHashed}
  `;
  if (lookup.length === 0) throw new AuthDeniedError("magic-link-not-found", "magic link not found");
  const row = lookup[0]!;
  if (row.consumed_at !== null) throw new AuthDeniedError("magic-link-consumed", "magic link already consumed");
  if (row.expires.getTime() <= Date.now()) throw new AuthDeniedError("magic-link-expired", "magic link expired");
  throw new AuthDeniedError("magic-link-invalid", "magic link CAS failed");
}
