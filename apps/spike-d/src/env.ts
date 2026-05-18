// Spike D — environment variable resolver

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing env: ${name}`);
  }
  return value;
}

export type DbTarget = "dev" | "staging" | "shadow" | "prod";

export const env = {
  DATABASE_URL_DEV: required("DATABASE_URL_DEV"),
  DATABASE_URL_STAGING: required("DATABASE_URL_STAGING"),
  DATABASE_URL_SHADOW: required("DATABASE_URL_SHADOW"),
  DATABASE_URL_PROD: required("DATABASE_URL_PROD"),
  SERVICE_ROLE_ALLOWED_FUNCTIONS: required("SERVICE_ROLE_ALLOWED_FUNCTIONS").split(",").map((s) => s.trim()),
  SUPER_ADMIN_CONFIRMATION_TOKEN: required("SUPER_ADMIN_CONFIRMATION_TOKEN"),
  MIGRATION_ADVISORY_LOCK_KEY: required("MIGRATION_ADVISORY_LOCK_KEY"),
} as const;

export function getDatabaseUrl(target: DbTarget): string {
  switch (target) {
    case "dev": return env.DATABASE_URL_DEV;
    case "staging": return env.DATABASE_URL_STAGING;
    case "shadow": return env.DATABASE_URL_SHADOW;
    case "prod": return env.DATABASE_URL_PROD;
  }
}
