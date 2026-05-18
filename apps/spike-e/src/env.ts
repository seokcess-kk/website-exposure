// Spike E — env resolver

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") throw new Error(`Missing env: ${name}`);
  return value;
}

function optionalInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw || raw.trim() === "") return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid env: ${name} must be positive integer`);
  }
  return parsed;
}

export const env = {
  DATABASE_URL: required("DATABASE_URL"),
  MAGIC_LINK_TTL_SECONDS: optionalInt("MAGIC_LINK_TTL_SECONDS", 900),
  SESSION_TTL_SECONDS: optionalInt("SESSION_TTL_SECONDS", 86400),
  SESSION_REFRESH_INTERVAL_SECONDS: optionalInt("SESSION_REFRESH_INTERVAL_SECONDS", 300),
  AUTH_SECRET: required("AUTH_SECRET"),
  RESEND_MODE: process.env.RESEND_MODE ?? "mock",
} as const;

if (env.AUTH_SECRET.length < 32) {
  throw new Error("AUTH_SECRET must be at least 32 chars");
}
