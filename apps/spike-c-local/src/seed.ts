// Spike C — seed: 2 instance × 5 object, bucket clean·put with content-type
// 사전 docker compose up -d 필요·mc-init이 bucket 'spike-c' 생성 완료

import { DeleteObjectCommand, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";

import { env } from "./env.js";
import { createRootS3Client } from "./storage-client.js";
import { INSTANCE_A_ID, INSTANCE_B_ID, SEED_OBJECTS_PER_INSTANCE, objectKeyFor } from "./fixtures.js";
import { auditLog } from "./audit-log.js";

async function clearAllObjects(): Promise<void> {
  const client = createRootS3Client();
  let continuationToken: string | undefined = undefined;
  let deleted = 0;
  do {
    const list: any = await client.send(new ListObjectsV2Command({
      Bucket: env.S3_BUCKET,
      ContinuationToken: continuationToken,
    }));
    const contents = list.Contents ?? [];
    for (const obj of contents) {
      if (!obj.Key) continue;
      await client.send(new DeleteObjectCommand({ Bucket: env.S3_BUCKET, Key: obj.Key }));
      deleted += 1;
    }
    continuationToken = list.IsTruncated ? list.NextContinuationToken : undefined;
  } while (continuationToken);
  console.log(`[seed] deleted ${deleted} pre-existing objects`);
}

async function seedInstance(instanceId: string): Promise<void> {
  const client = createRootS3Client();
  for (let i = 0; i < SEED_OBJECTS_PER_INSTANCE; i += 1) {
    const key = objectKeyFor(instanceId, `seed/file-${i}.txt`);
    const body = `instance=${instanceId} index=${i}`;
    await client.send(new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key,
      Body: body,
      ContentType: "text/plain",
    }));
  }
  console.log(`[seed] instance=${instanceId} put ${SEED_OBJECTS_PER_INSTANCE} objects`);
}

async function main(): Promise<void> {
  auditLog.clear();
  await clearAllObjects();
  await seedInstance(INSTANCE_A_ID);
  await seedInstance(INSTANCE_B_ID);
  console.log("[seed] done");
}

main().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
