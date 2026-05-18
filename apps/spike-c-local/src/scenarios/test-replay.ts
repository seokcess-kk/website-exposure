// Spike C — test-replay: TTL-bound bearer semantics·refresh policy
// SPIKEC1-005 cycle2: SoT 정합 (replay 차단이 아니라 TTL-bound bearer)
// SPIKEC2-001 cycle3: short-TTL helper를 production module 밖으로 inline
// SPIKEC2-002 cycle3: refresh policy (expired/premature) 검증 추가

import { GetObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "../env.js";
import { createRootS3Client } from "../storage-client.js";
import {
  issueSignedUrl,
  refreshSignedUrl,
  RefreshRejectedError,
  type SignedUrlResult,
} from "../sign-url.js";
import { assertObjectKeyForInstance, type TenantContext } from "../tenant-context.js";
import { ACTOR_A_OPERATOR, INSTANCE_A_ID, objectKeyFor } from "../fixtures.js";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * TEST-LOCAL raw issuer — production policy 우회·만료 동작 측정 전용.
 * 본 함수는 scenario file 안에서만 정의되어 production code path에서 import 불가.
 * tenant guard만 그대로 강제 (회피 의도 방지).
 */
async function _localShortTtlIssue(
  client: S3Client,
  ctx: TenantContext,
  objectKey: string,
  ttlSeconds: number,
): Promise<SignedUrlResult> {
  assertObjectKeyForInstance(ctx, objectKey);
  const command = new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: objectKey });
  const url = await getSignedUrl(client, command, { expiresIn: ttlSeconds });
  const now = Date.now();
  return {
    url,
    method: "GET",
    objectKey,
    contentType: null,
    contentLength: null,
    issuedAt: now,
    expiresAt: now + ttlSeconds * 1000,
    refreshAt: now + Math.max(0, ttlSeconds - 1) * 1000,
  };
}

async function main(): Promise<void> {
  const client = createRootS3Client();
  const key = objectKeyFor(INSTANCE_A_ID, "seed/file-0.txt");

  // Case 1: default TTL signed URL (env 600s) → 200
  const defaultUrl = await issueSignedUrl(client, {
    ctx: ACTOR_A_OPERATOR,
    objectKey: key,
    method: "GET",
  });
  const r1 = await fetch(defaultUrl.url, { method: "GET" });
  if (r1.status !== 200) throw new Error(`default TTL fetch: expected 200, got ${r1.status}`);
  console.log("[replay] case-1 default TTL fetch: 200 (PASS)");

  // Case 2: bearer semantics — pre-expiry replay × 50 → 모두 200
  let replaySuccess = 0;
  for (let i = 0; i < 50; i += 1) {
    const r = await fetch(defaultUrl.url, { method: "GET" });
    if (r.status === 200) replaySuccess += 1;
  }
  if (replaySuccess !== 50) {
    throw new Error(`pre-expiry replay: expected 50/50 (bearer semantics), got ${replaySuccess}`);
  }
  console.log(`[replay] case-2 pre-expiry replay × 50: ${replaySuccess}/50 (PASS — TTL-bound bearer SoT)`);

  // Case 3: refresh → new URL (signature 다름)
  await sleep(1100);
  const refreshed = await refreshSignedUrl(client, defaultUrl, ACTOR_A_OPERATOR);
  if (refreshed.url === defaultUrl.url) {
    throw new Error("refreshed URL should differ (different X-Amz-Date·Signature)");
  }
  const r3 = await fetch(refreshed.url, { method: "GET" });
  if (r3.status !== 200) throw new Error(`refresh fetch: expected 200, got ${r3.status}`);
  console.log("[replay] case-3 refresh new URL fetch: 200 (PASS)");

  // Case 4: refresh metadata invariants
  if (refreshed.method !== defaultUrl.method) throw new Error("refresh changed method");
  if (refreshed.objectKey !== defaultUrl.objectKey) throw new Error("refresh changed objectKey");
  if (refreshed.contentType !== defaultUrl.contentType) throw new Error("refresh changed contentType");
  if (refreshed.contentLength !== defaultUrl.contentLength) throw new Error("refresh changed contentLength");
  console.log("[replay] case-4 refresh metadata invariants: PASS");

  // Case 5: TTL > max → reject
  let overTtlRejected = false;
  try {
    await issueSignedUrl(client, { ctx: ACTOR_A_OPERATOR, objectKey: key, method: "GET", ttlSeconds: 86401 });
  } catch (err) {
    if (err instanceof Error && err.message.includes("out of range")) overTtlRejected = true;
  }
  if (!overTtlRejected) throw new Error("over-max TTL should reject");
  console.log("[replay] case-5 max TTL bound: PASS");

  // Case 6: TTL <= 0 → reject
  let zeroTtlRejected = false;
  try {
    await issueSignedUrl(client, { ctx: ACTOR_A_OPERATOR, objectKey: key, method: "GET", ttlSeconds: 0 });
  } catch (err) {
    if (err instanceof Error && err.message.includes("out of range")) zeroTtlRejected = true;
  }
  if (!zeroTtlRejected) throw new Error("zero TTL should reject");
  console.log("[replay] case-6 zero TTL bound: PASS");

  // === TTL expiry 실측 (test-local helper) ===

  // Case 7a: short TTL=2s within → 200
  const shortUrl = await _localShortTtlIssue(client, ACTOR_A_OPERATOR, key, 2);
  const r7a = await fetch(shortUrl.url, { method: "GET" });
  if (r7a.status !== 200) throw new Error(`short TTL within: expected 200, got ${r7a.status}`);
  console.log("[replay] case-7a short TTL within: 200 (PASS)");

  // Case 7b: post-TTL → 401/403
  await sleep(3000);
  const r7b = await fetch(shortUrl.url, { method: "GET" });
  if (r7b.status === 200) throw new Error("post-TTL fetch should NOT succeed");
  if (r7b.status !== 403 && r7b.status !== 401) {
    throw new Error(`post-TTL fetch: expected 401/403, got ${r7b.status}`);
  }
  console.log(`[replay] case-7b post-TTL fetch: ${r7b.status} (PASS — TTL bound)`);

  // === Refresh policy ===

  // Case 8: 만료된 URL을 refresh 호출 → RefreshRejectedError('expired')
  let expiredRefreshRejected = false;
  try {
    // shortUrl은 이미 만료됨 (sleep 3000 후)
    await refreshSignedUrl(client, shortUrl, ACTOR_A_OPERATOR);
  } catch (err) {
    if (err instanceof RefreshRejectedError && err.code === "expired") expiredRefreshRejected = true;
  }
  if (!expiredRefreshRejected) throw new Error("refresh after expiry should reject");
  console.log("[replay] case-8 refresh after expiry: REJECTED (PASS — refresh policy)");

  // Case 9: requireRefreshAtReached=true·refreshAt 도래 전 → premature reject
  const freshUrl = await issueSignedUrl(client, {
    ctx: ACTOR_A_OPERATOR,
    objectKey: key,
    method: "GET",
  });
  let prematureRejected = false;
  try {
    await refreshSignedUrl(client, freshUrl, ACTOR_A_OPERATOR, {
      graceMs: 0,
      requireRefreshAtReached: true,
    });
  } catch (err) {
    if (err instanceof RefreshRejectedError && err.code === "premature") prematureRejected = true;
  }
  if (!prematureRejected) throw new Error("premature refresh should reject when requireRefreshAtReached");
  console.log("[replay] case-9 premature refresh: REJECTED (PASS — refresh policy)");

  // Case 10: graceMs로 만료 후 짧은 시간 허용
  const shortUrl2 = await _localShortTtlIssue(client, ACTOR_A_OPERATOR, key, 2);
  await sleep(2200); // 만료 직후
  const refreshedWithGrace = await refreshSignedUrl(client, shortUrl2, ACTOR_A_OPERATOR, {
    graceMs: 5000,
    requireRefreshAtReached: false,
  });
  if (!refreshedWithGrace.url.startsWith("http")) throw new Error("refresh with grace should issue new URL");
  console.log("[replay] case-10 refresh within grace window: PASS");

  // === SPIKEC3-002 cycle4: RefreshPolicy validation ===

  type InvalidPolicy = { label: string; policy: any };
  const INVALID_POLICIES: ReadonlyArray<InvalidPolicy> = [
    { label: "policy null", policy: null },
    { label: "policy string primitive", policy: "policy" as any },
    { label: "policy number primitive", policy: 42 as any },
    { label: "policy array", policy: [0, false] as any },
    { label: "graceMs NaN", policy: { graceMs: NaN, requireRefreshAtReached: false } },
    { label: "graceMs Infinity", policy: { graceMs: Infinity, requireRefreshAtReached: false } },
    { label: "graceMs negative", policy: { graceMs: -100, requireRefreshAtReached: false } },
    { label: "graceMs non-integer", policy: { graceMs: 1.5, requireRefreshAtReached: false } },
    { label: "graceMs over MAX", policy: { graceMs: 60 * 60 * 1000 + 1, requireRefreshAtReached: false } },
    { label: "requireRefreshAtReached non-boolean", policy: { graceMs: 0, requireRefreshAtReached: "yes" } },
  ];

  let invalidPolicyRejected = 0;
  for (const c of INVALID_POLICIES) {
    let caught = false;
    try {
      await refreshSignedUrl(client, freshUrl, ACTOR_A_OPERATOR, c.policy);
    } catch (err) {
      if (err instanceof RefreshRejectedError && err.code === "invalid-policy") caught = true;
    }
    if (!caught) throw new Error(`[replay] invalid policy '${c.label}': should reject`);
    invalidPolicyRejected += 1;
    console.log(`[replay] case-11.${invalidPolicyRejected} invalid policy '${c.label}': REJECTED (PASS)`);
  }

  console.log(`\n✅ test-replay: 10 + ${invalidPolicyRejected} = ${10 + invalidPolicyRejected} cases PASS`);
}

main().catch((err) => {
  console.error("[replay] FAIL:", err);
  process.exit(1);
});
