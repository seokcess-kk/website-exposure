// Spike E — magic link (cycle2 patch)
//   - SPIKEE1-003: next-auth table 이름 — "verificationToken"
//   - SPIKEE1-008: CAS에 expires_at > now() 포함·SELECT-UPDATE race 차단
//   - SPIKEE1-009: normalizeIdentifier (trim·NFC·toLowerCase·email regex)

import { createHash, randomBytes } from "node:crypto";
import postgres from "postgres";

import { env } from "./env.js";
import { AuthDeniedError } from "./errors.js";

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

export async function issueMagicLink(sql: postgres.Sql, identifier: string): Promise<MagicLinkIssued> {
  const normalized = normalizeIdentifier(identifier);
  const tokenPlain = randomBytes(32).toString("base64url");
  const tokenHashed = hashToken(tokenPlain);
  const expiresAt = new Date(Date.now() + env.MAGIC_LINK_TTL_SECONDS * 1000);
  await sql`
    INSERT INTO "verificationToken" ("identifier", "token", "expires")
    VALUES (${normalized}, ${tokenHashed}, ${expiresAt})
  `;
  if (env.RESEND_MODE === "mock") {
    mockMailbox.push({ to: normalized, tokenPlain, at: Date.now() });
  }
  return { identifier: normalized, tokenPlain, expiresAt };
}

/**
 * Consume: single atomic UPDATE with consumedAt IS NULL AND expires > now().
 * SPIKEE1-008 cycle2: SELECT-UPDATE race 차단.
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

  // CAS 실패 원인 분석 (race-free)
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
