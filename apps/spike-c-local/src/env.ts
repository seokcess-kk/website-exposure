// Spike C — environment variable resolver
// SPIKEC1 cycle2: TTL/refresh SoT INFRA v1.0 § Storage 정합 (600/60/86400)

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing env: ${name}`);
  }
  return value;
}

function optionalInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw || raw.trim() === "") return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid env: ${name} must be positive integer, got ${raw}`);
  }
  return parsed;
}

export const env = {
  S3_ENDPOINT: required("S3_ENDPOINT"),
  S3_REGION: required("S3_REGION"),
  S3_BUCKET: required("S3_BUCKET"),
  // root credential — bucket setup·service_role bypass·seed
  S3_ROOT_ACCESS_KEY: required("S3_ROOT_ACCESS_KEY"),
  S3_ROOT_SECRET_KEY: required("S3_ROOT_SECRET_KEY"),
  // instance principal — minio per-instance user (mc-init이 생성). limited principal 흉내.
  S3_INSTANCE_A_ACCESS_KEY: required("S3_INSTANCE_A_ACCESS_KEY"),
  S3_INSTANCE_A_SECRET_KEY: required("S3_INSTANCE_A_SECRET_KEY"),
  S3_INSTANCE_B_ACCESS_KEY: required("S3_INSTANCE_B_ACCESS_KEY"),
  S3_INSTANCE_B_SECRET_KEY: required("S3_INSTANCE_B_SECRET_KEY"),
  // signed URL policy (SoT: INFRA v1.0 § Storage)
  SIGNED_URL_TTL_SECONDS: optionalInt("SIGNED_URL_TTL_SECONDS", 600),
  SIGNED_URL_REFRESH_BEFORE_SECONDS: optionalInt("SIGNED_URL_REFRESH_BEFORE_SECONDS", 60),
  SIGNED_URL_MAX_TTL_SECONDS: optionalInt("SIGNED_URL_MAX_TTL_SECONDS", 86400),
  // invariant
  INVARIANT_INSTANCES: optionalInt("INVARIANT_INSTANCES", 5),
  INVARIANT_OBJECTS_PER_INSTANCE: optionalInt("INVARIANT_OBJECTS_PER_INSTANCE", 100),
  INVARIANT_CROSS_ATTEMPTS: optionalInt("INVARIANT_CROSS_ATTEMPTS", 200),
} as const;
