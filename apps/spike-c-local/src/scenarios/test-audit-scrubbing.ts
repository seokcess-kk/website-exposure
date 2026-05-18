// Spike C — test-audit-scrubbing: 모든 string field·URL-encoded leak·확장 credential patterns
// SPIKEC1-004 cycle2: actorId·contentType·encoded leak 케이스 추가

import { createRootS3Client } from "../storage-client.js";
import { issueSignedUrl } from "../sign-url.js";
import { auditLog, UrlLeakError, type AuditEntry } from "../audit-log.js";
import { ACTOR_A_OPERATOR, INSTANCE_A_ID, objectKeyFor } from "../fixtures.js";

type LeakCase = {
  readonly label: string;
  readonly field: keyof AuditEntry;
  readonly mutator: (e: AuditEntry) => AuditEntry;
};

const baseEntry: AuditEntry = {
  timestamp: Date.now(),
  instanceId: INSTANCE_A_ID,
  actorId: "actor",
  actorRole: "operator",
  action: "signed-url-issued",
  objectKey: "instances/aaa/x.txt",
  method: "GET",
  contentType: null,
  ttlSeconds: 60,
  result: "success",
  reason: null,
};

const LEAK_CASES: ReadonlyArray<LeakCase> = [
  { label: "objectKey: signature in query", field: "objectKey", mutator: (e) => ({ ...e, objectKey: "http://x.com/p?X-Amz-Signature=deadbeef" }) },
  { label: "objectKey: encoded signature %3F", field: "objectKey", mutator: (e) => ({ ...e, objectKey: "instances/aaa/x.txt%3FX-Amz-Signature%3Ddeadbeef" }) },
  { label: "objectKey: double-encoded", field: "objectKey", mutator: (e) => ({ ...e, objectKey: "instances/aaa/x.txt%253FX-Amz-Signature%253Ddeadbeef" }) },
  { label: "reason: X-Amz-Credential", field: "reason", mutator: (e) => ({ ...e, result: "denied" as const, reason: "failed at X-Amz-Credential=AKIAFOO/20260515/us-east-1/s3/aws4_request" }) },
  { label: "actorId: bearer token", field: "actorId", mutator: (e) => ({ ...e, actorId: "bearer abcdefghijklm" }) },
  { label: "actorId: encoded credential", field: "actorId", mutator: (e) => ({ ...e, actorId: "user%2BX-Amz-Credential%3DAKIA" }) },
  { label: "contentType: cookie leak", field: "contentType", mutator: (e) => ({ ...e, contentType: "text/plain; cookie: sessionid=abc" }) },
  { label: "contentType: AWS access key", field: "contentType", mutator: (e) => ({ ...e, contentType: "text/plain; aws_access_key=AKIATEST" }) },
  { label: "reason: authorization header", field: "reason", mutator: (e) => ({ ...e, result: "denied" as const, reason: "header authorization: AWS4-HMAC-SHA256 ..." }) },
  { label: "reason: cf-access-jwt", field: "reason", mutator: (e) => ({ ...e, result: "denied" as const, reason: "cf-access-jwt-assertion=eyJhbGciOi..." }) },
  { label: "reason: signature= keyword", field: "reason", mutator: (e) => ({ ...e, result: "denied" as const, reason: "?signature=deadbeef" }) },
];

async function main(): Promise<void> {
  auditLog.clear();
  const client = createRootS3Client();

  // === Positive: issue 5 signed URLs → scan ===
  for (let i = 0; i < 5; i += 1) {
    await issueSignedUrl(client, {
      ctx: ACTOR_A_OPERATOR,
      objectKey: objectKeyFor(INSTANCE_A_ID, `audit-test/${i}.txt`),
      method: i % 2 === 0 ? "GET" : "PUT",
      contentType: i % 2 === 0 ? undefined : "text/plain",
      contentLength: i % 2 === 0 ? undefined : 10,
    });
  }
  const positive = auditLog.list();
  if (positive.length !== 5) throw new Error(`expected 5 entries, got ${positive.length}`);

  const forbidden = ["X-Amz-Signature", "X-Amz-Credential", "X-Amz-Security-Token"];
  for (const entry of positive) {
    const blob = JSON.stringify(entry);
    for (const f of forbidden) {
      if (blob.toLowerCase().includes(f.toLowerCase())) {
        throw new Error(`audit leaked '${f}': ${blob}`);
      }
    }
  }
  console.log(`[audit-scrub] positive ${positive.length} entries: no leak (PASS)`);

  // === Negative: leak detection ===
  let detected = 0;
  for (const c of LEAK_CASES) {
    let caught = false;
    const entry = c.mutator(baseEntry);
    try {
      auditLog.append(entry);
    } catch (err) {
      if (err instanceof UrlLeakError) caught = true;
    }
    if (!caught) {
      throw new Error(`[audit-scrub] '${c.label}': UrlLeakError should be raised. entry=${JSON.stringify(entry)}`);
    }
    detected += 1;
    console.log(`[audit-scrub] negative '${c.label}': LEAK DETECTED (PASS)`);
  }

  console.log(`\n✅ test-audit-scrubbing: positive 1 + negative ${detected} cases PASS`);
}

main().catch((err) => {
  console.error("[audit-scrub] FAIL:", err);
  process.exit(1);
});
