// @glitzy/storage/storage-client — S3Client factory (root·instance principal·service-role)

import { S3Client } from "@aws-sdk/client-s3";

import type { S3Credentials, StorageConfig } from "./config.js";

export function createS3Client(cfg: StorageConfig, creds: S3Credentials): S3Client {
  return new S3Client({
    endpoint: cfg.s3Endpoint,
    region: cfg.s3Region,
    credentials: { accessKeyId: creds.accessKeyId, secretAccessKey: creds.secretAccessKey },
    forcePathStyle: cfg.forcePathStyle,
  });
}
