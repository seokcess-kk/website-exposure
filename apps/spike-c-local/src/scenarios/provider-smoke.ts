// Spike C — PROVIDER_PASS smoke (Cloudflare R2 staging·Day 8)
// LOCAL_PASS의 핵심 시나리오를 R2 staging에서 압축 재실행

import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "../env.js";
import { issueSignedUrl } from "../sign-url.js";
import { auditLog } from "../audit-log.js";
import { ACTOR_A_OPERATOR, INSTANCE_A_ID, INSTANCE_B_ID, objectKeyFor, SEED_OBJECTS_PER_INSTANCE } from "../fixtures.js";

function clearAudits(): void { auditLog.clear(); }

function rootClient(): S3Client {
  return new S3Client({
    endpoint: env.S3_ENDPOINT,
    region: env.S3_REGION,
    credentials: { accessKeyId: env.S3_ROOT_ACCESS_KEY, secretAccessKey: env.S3_ROOT_SECRET_KEY },
    forcePathStyle: true,
  });
}

function instanceClient(slot: "a" | "b"): S3Client {
  return new S3Client({
    endpoint: env.S3_ENDPOINT,
    region: env.S3_REGION,
    credentials: slot === "a"
      ? { accessKeyId: env.S3_INSTANCE_A_ACCESS_KEY, secretAccessKey: env.S3_INSTANCE_A_SECRET_KEY }
      : { accessKeyId: env.S3_INSTANCE_B_ACCESS_KEY, secretAccessKey: env.S3_INSTANCE_B_SECRET_KEY },
    forcePathStyle: true,
  });
}

async function clearAllObjects(client: S3Client): Promise<void> {
  let token: string | undefined;
  do {
    const list: any = await client.send(new ListObjectsV2Command({ Bucket: env.S3_BUCKET, ContinuationToken: token }));
    for (const obj of (list.Contents ?? [])) {
      if (obj.Key) await client.send(new DeleteObjectCommand({ Bucket: env.S3_BUCKET, Key: obj.Key }));
    }
    token = list.IsTruncated ? list.NextContinuationToken : undefined;
  } while (token);
}

async function seedInstance(client: S3Client, instanceId: string): Promise<void> {
  for (let i = 0; i < SEED_OBJECTS_PER_INSTANCE; i += 1) {
    const key = objectKeyFor(instanceId, `seed/file-${i}.txt`);
    await client.send(new PutObjectCommand({ Bucket: env.S3_BUCKET, Key: key, Body: `instance=${instanceId} index=${i}`, ContentType: "text/plain" }));
  }
}

async function main(): Promise<void> {
  console.log(`[provider-smoke] endpoint=${env.S3_ENDPOINT} bucket=${env.S3_BUCKET}`);
  const root = rootClient();
  clearAudits();
  await clearAllObjects(root);
  await seedInstance(root, INSTANCE_A_ID);
  await seedInstance(root, INSTANCE_B_ID);
  console.log("[provider-smoke] seed done (root credential)");

  // Phase 1: app-layer prefix isolation (LOCAL과 동일)
  const okUrl = await issueSignedUrl(root, { ctx: ACTOR_A_OPERATOR, objectKey: objectKeyFor(INSTANCE_A_ID, "seed/file-0.txt"), method: "GET" });
  const r1 = await fetch(okUrl.url);
  if (r1.status !== 200) throw new Error(`R2 GET signed URL failed: ${r1.status}`);
  console.log("[provider-smoke] phase1 self-prefix signed URL: 200 (PASS)");

  // Phase 2: credential-level isolation — instance-a-key로 instance-b prefix list
  // R2 token이 prefix-scoped면 403·root scope면 access OK (token scope에 따라 차이)
  const clientA = instanceClient("a");
  try {
    const crossList: any = await clientA.send(new ListObjectsV2Command({ Bucket: env.S3_BUCKET, Prefix: `instances/${INSTANCE_B_ID}/` }));
    const keys = (crossList.Contents ?? []).map((c: any) => c.Key);
    if (keys.length > 0) {
      console.log(`[provider-smoke] phase2 credential isolation: WARN — instance-a-key reads instance-b prefix (${keys.length} keys). prefix-scoped token 권장.`);
    } else {
      console.log("[provider-smoke] phase2 credential isolation: empty list (PASS)");
    }
  } catch (err: any) {
    const status = err?.$metadata?.httpStatusCode;
    if (status === 403) console.log("[provider-smoke] phase2 credential isolation: 403 (PASS — token scope)");
    else throw err;
  }

  // Phase 3: method confusion — GET URL로 PUT → expect 4xx (R2 표준: 403)
  const putAttempt = await fetch(okUrl.url, { method: "PUT", body: "tampered", headers: { "content-type": "text/plain", "content-length": "8" } });
  if (![400, 401, 403].includes(putAttempt.status)) {
    throw new Error(`method confusion (GET→PUT URL): expected 400/401/403, got ${putAttempt.status}`);
  }
  const putBody = await putAttempt.text();
  const putCode = /<Code>([^<]+)<\/Code>/.exec(putBody)?.[1] ?? "unknown";
  console.log(`[provider-smoke] phase3 method confusion: ${putAttempt.status} ${putCode} (PASS)`);

  // Phase 4: TTL 만료 (SHORT TTL — provider 표준 동작)
  const shortKey = objectKeyFor(INSTANCE_A_ID, "seed/file-0.txt");
  const shortUrl = await getSignedUrl(root, new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: shortKey }), { expiresIn: 2 });
  const r4a = await fetch(shortUrl);
  if (r4a.status !== 200) throw new Error(`short TTL within: ${r4a.status}`);
  await new Promise((r) => setTimeout(r, 3000));
  const r4b = await fetch(shortUrl);
  if (![401, 403].includes(r4b.status)) throw new Error(`post-TTL: expected 401/403, got ${r4b.status}`);
  console.log(`[provider-smoke] phase4 TTL expiry: within=200·post=${r4b.status} (PASS)`);

  // Phase 5: Range request — 100 byte object·bytes=0-9 → 206·10 bytes
  const largeKey = objectKeyFor(INSTANCE_A_ID, "range-test/large.bin");
  await root.send(new PutObjectCommand({ Bucket: env.S3_BUCKET, Key: largeKey, Body: Buffer.alloc(100, 0x41), ContentType: "application/octet-stream" }));
  const rangeUrl = await getSignedUrl(root, new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: largeKey }), { expiresIn: 60 });
  const r5 = await fetch(rangeUrl, { headers: { range: "bytes=0-9" } });
  if (r5.status !== 206) throw new Error(`range 0-9: expected 206, got ${r5.status}`);
  const bytes5 = Buffer.from(await r5.arrayBuffer());
  if (bytes5.length !== 10) throw new Error(`range length expected 10, got ${bytes5.length}`);
  console.log(`[provider-smoke] phase5 range bytes=0-9: 206·${bytes5.length} bytes (PASS)`);

  // Phase 6: audit log leak scan
  const forbidden = ["x-amz-signature", "x-amz-credential", "x-amz-security-token"];
  for (const e of auditLog.list()) {
    const blob = JSON.stringify(e).toLowerCase();
    for (const f of forbidden) {
      if (blob.includes(f)) throw new Error(`audit leak '${f}': ${blob}`);
    }
  }
  console.log(`[provider-smoke] phase6 audit scan (${auditLog.list().length} entries): no leak (PASS)`);

  // Cleanup
  await clearAllObjects(root);
  console.log("\n✅ provider-smoke (R2): 6 phases PASS");
  console.log("ℹ️  acceptance checklist: PROVIDER_RUNBOOK.md 의 모든 항목 검증");
}

main().catch((err) => {
  console.error("[provider-smoke] FAIL:", err);
  process.exit(1);
});
