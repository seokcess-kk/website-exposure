// Spike C — test-method-confusion: GET signed URL로 PUT/DELETE 시도 → 401/403 + XML body code assert
// SPIKEC1-006/011 cycle2: error body XML code 검증·minio 실제 응답 확인

import { createRootS3Client } from "../storage-client.js";
import { issueSignedUrl } from "../sign-url.js";
import { ACTOR_A_OPERATOR, INSTANCE_A_ID, objectKeyFor } from "../fixtures.js";

type HttpResult = { status: number; bodyText: string; awsCode: string | null };

async function attemptHttp(url: string, method: string, body?: string, ct?: string): Promise<HttpResult> {
  const headers: Record<string, string> = {};
  if (body) {
    if (ct) headers["content-type"] = ct;
    headers["content-length"] = String(body.length);
  }
  const res = await fetch(url, { method, body: body ?? undefined, headers });
  const text = await res.text();
  // S3/minio XML response: <Code>SignatureDoesNotMatch</Code> 등
  const codeMatch = /<Code>([^<]+)<\/Code>/.exec(text);
  return { status: res.status, bodyText: text, awsCode: codeMatch ? codeMatch[1] ?? null : null };
}

const ALLOWED_ERROR_CODES = [
  "SignatureDoesNotMatch",
  "AccessDenied",
  "MethodNotAllowed",
  "AuthorizationQueryParametersError",
  "InvalidRequest",
];

function assertProviderDeny(label: string, r: HttpResult, expectedStatuses: number[]): void {
  if (expectedStatuses.includes(r.status)) {
    if (!r.awsCode || !ALLOWED_ERROR_CODES.includes(r.awsCode)) {
      throw new Error(`[method-confusion] ${label}: provider returned ${r.status} but unknown awsCode='${r.awsCode}' body=${r.bodyText.slice(0, 200)}`);
    }
  } else {
    throw new Error(`[method-confusion] ${label}: expected status in ${expectedStatuses.join("|")}, got ${r.status} awsCode=${r.awsCode} body=${r.bodyText.slice(0, 200)}`);
  }
}

async function main(): Promise<void> {
  const client = createRootS3Client();
  const key = objectKeyFor(INSTANCE_A_ID, "seed/file-0.txt");

  // Issue GET signed URL
  const getUrl = await issueSignedUrl(client, {
    ctx: ACTOR_A_OPERATOR,
    objectKey: key,
    method: "GET",
  });

  // Case 1: GET → GET URL → 200
  const r1 = await attemptHttp(getUrl.url, "GET");
  if (r1.status !== 200) throw new Error(`GET→GET: expected 200, got ${r1.status}`);
  console.log("[method-confusion] case-1 GET→GET: 200 (PASS)");

  // Case 2: PUT → GET URL → 401/403/400 (provider deny — minio 400·S3 403)
  const r2 = await attemptHttp(getUrl.url, "PUT", "malicious", "text/plain");
  assertProviderDeny("PUT→GET URL", r2, [400, 401, 403]);
  console.log(`[method-confusion] case-2 PUT→GET URL: ${r2.status} awsCode=${r2.awsCode} (PASS)`);

  // Case 3: DELETE → GET URL → 401/403/400
  const r3 = await attemptHttp(getUrl.url, "DELETE");
  assertProviderDeny("DELETE→GET URL", r3, [400, 401, 403]);
  console.log(`[method-confusion] case-3 DELETE→GET URL: ${r3.status} awsCode=${r3.awsCode} (PASS)`);

  // Case 4: GET → PUT URL → 401/403/400 (minio는 400 AccessDenied·signed-header-mismatch)
  const putUrl = await issueSignedUrl(client, {
    ctx: ACTOR_A_OPERATOR,
    objectKey: objectKeyFor(INSTANCE_A_ID, "method-test/object-fresh.txt"),
    method: "PUT",
    contentType: "text/plain",
    contentLength: 20,
  });
  const r4 = await attemptHttp(putUrl.url, "GET");
  assertProviderDeny("GET→PUT URL", r4, [400, 401, 403]);
  console.log(`[method-confusion] case-4 GET→PUT URL: ${r4.status} awsCode=${r4.awsCode} (PASS)`);

  // Case 5: HEAD ↔ GET — empirical-provider-behavior (informational only)
  // SoT (PHASE0_WEEK1_SPIKES_DRAFT § C.2-4·§ C.3): AWS SigV4 canonical request에 HTTPMethod
  // 포함되어 엄밀히는 method-bound이지만, 실 provider 동작은 다양 (S3·minio·R2 차이 가능).
  // 본 case는 정보 기록만 — PASS 카운트 미산입·assert 안 함. 실 정책은 PROVIDER_GATE 결정 후 SoT cascade.
  const r5 = await attemptHttp(getUrl.url, "HEAD");
  console.log(`[method-confusion] case-5 HEAD→GET URL (empirical, informational only): status=${r5.status}`);

  console.log("\n✅ test-method-confusion: 4 enforced PASS + 1 informational recorded");
}

main().catch((err) => {
  console.error("[method-confusion] FAIL:", err);
  process.exit(1);
});
