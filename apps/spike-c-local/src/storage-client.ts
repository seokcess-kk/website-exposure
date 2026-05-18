// Spike C — S3 client factory
// SPIKEC1-010 cycle2: root/instance-principal/service-role 분리. instancePrincipal은 per-instance credential.
// minio limit: per-instance user policy로 credential-level isolation 일부 검증·R2 IAM Condition 동등 아님

import { S3Client } from "@aws-sdk/client-s3";

import { env } from "./env.js";

export type S3ClientKind = "root" | "instance-a" | "instance-b" | "service-role";

function build(accessKeyId: string, secretAccessKey: string): S3Client {
  return new S3Client({
    endpoint: env.S3_ENDPOINT,
    region: env.S3_REGION,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  });
}

export function createRootS3Client(): S3Client {
  return build(env.S3_ROOT_ACCESS_KEY, env.S3_ROOT_SECRET_KEY);
}

export function createInstanceClient(slot: "a" | "b"): S3Client {
  return slot === "a"
    ? build(env.S3_INSTANCE_A_ACCESS_KEY, env.S3_INSTANCE_A_SECRET_KEY)
    : build(env.S3_INSTANCE_B_ACCESS_KEY, env.S3_INSTANCE_B_SECRET_KEY);
}

// service-role은 root credential 재사용 — local에서는 break-glass 구분만 의미
// production R2에서는 별도 IAM role STS credential 필요 (PROVIDER_REQUIRED marker)
export function createServiceRoleClient(): S3Client {
  return build(env.S3_ROOT_ACCESS_KEY, env.S3_ROOT_SECRET_KEY);
}
