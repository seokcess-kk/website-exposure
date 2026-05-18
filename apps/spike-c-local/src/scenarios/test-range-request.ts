// Spike C — test-range-request: range header GET 허용·out-of-range 416 명시 assert
// SPIKEC1-008 cycle2: 416 명시 assert·minio 명시 expected

import { PutObjectCommand } from "@aws-sdk/client-s3";

import { env } from "../env.js";
import { createRootS3Client } from "../storage-client.js";
import { issueSignedUrl } from "../sign-url.js";
import { ACTOR_A_OPERATOR, INSTANCE_A_ID, objectKeyFor } from "../fixtures.js";

async function main(): Promise<void> {
  const client = createRootS3Client();
  const key = objectKeyFor(INSTANCE_A_ID, "range-test/large-file.bin");
  const body = Buffer.alloc(100, 0x41);

  await client.send(new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    Body: body,
    ContentType: "application/octet-stream",
  }));

  const getUrl = await issueSignedUrl(client, {
    ctx: ACTOR_A_OPERATOR,
    objectKey: key,
    method: "GET",
  });

  // Case 1: Full GET → 200, 100 bytes
  const r1 = await fetch(getUrl.url, { method: "GET" });
  if (r1.status !== 200) throw new Error(`full GET: expected 200, got ${r1.status}`);
  const full = Buffer.from(await r1.arrayBuffer());
  if (full.length !== 100) throw new Error(`full GET length: expected 100, got ${full.length}`);
  console.log(`[range] case-1 full GET: 200·${full.length} bytes (PASS)`);

  // Case 2: Range 0-9 → 206, 10 bytes
  const r2 = await fetch(getUrl.url, { method: "GET", headers: { range: "bytes=0-9" } });
  if (r2.status !== 206) throw new Error(`Range 0-9: expected 206, got ${r2.status}`);
  const part2 = Buffer.from(await r2.arrayBuffer());
  if (part2.length !== 10) throw new Error(`Range 0-9 length: expected 10, got ${part2.length}`);
  console.log(`[range] case-2 Range 0-9: 206·${part2.length} bytes (PASS)`);

  // Case 3: Range 50-99 → 206, 50 bytes
  const r3 = await fetch(getUrl.url, { method: "GET", headers: { range: "bytes=50-99" } });
  if (r3.status !== 206) throw new Error(`Range 50-99: expected 206, got ${r3.status}`);
  const part3 = Buffer.from(await r3.arrayBuffer());
  if (part3.length !== 50) throw new Error(`Range 50-99 length: expected 50, got ${part3.length}`);
  console.log(`[range] case-3 Range 50-99: 206·${part3.length} bytes (PASS)`);

  // Case 4: Range 90-200 (overlap end) → 206, 10 bytes (minio·S3 모두 partial)
  const r4 = await fetch(getUrl.url, { method: "GET", headers: { range: "bytes=90-200" } });
  if (r4.status !== 206) throw new Error(`Range 90-200 overlap: expected 206 (partial), got ${r4.status}`);
  const part4 = Buffer.from(await r4.arrayBuffer());
  if (part4.length !== 10) throw new Error(`Range 90-200 length: expected 10 (truncated), got ${part4.length}`);
  console.log(`[range] case-4 Range 90-200 overlap-end: 206·${part4.length} bytes (PASS)`);

  // Case 5: Range 200-300 (entirely past EOF) → 416
  // minio: 416 Range Not Satisfiable
  // S3: 416 (same)
  const r5 = await fetch(getUrl.url, { method: "GET", headers: { range: "bytes=200-300" } });
  if (r5.status !== 416) {
    throw new Error(`Range 200-300 entirely-past-EOF: expected 416, got ${r5.status}`);
  }
  console.log(`[range] case-5 Range 200-300 past-EOF: 416 (PASS)`);

  console.log("\n✅ test-range-request: 5 cases PASS");
}

main().catch((err) => {
  console.error("[range] FAIL:", err);
  process.exit(1);
});
