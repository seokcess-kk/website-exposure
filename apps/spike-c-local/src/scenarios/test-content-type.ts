// Spike C — test-content-type: PUT presign content-type/length 강제·error code 검증
// SPIKEC1-006/011 cycle2: status·awsCode 명시 assertion·client-side vs provider error 구분

import { createRootS3Client } from "../storage-client.js";
import { issueSignedUrl } from "../sign-url.js";
import { ACTOR_A_OPERATOR, INSTANCE_A_ID, objectKeyFor } from "../fixtures.js";

type HttpResult = { status: number; bodyText: string; awsCode: string | null; clientError: string | null };

async function attemptPut(url: string, body: string, headers: Record<string, string>): Promise<HttpResult> {
  try {
    const res = await fetch(url, { method: "PUT", body, headers });
    const text = await res.text();
    const codeMatch = /<Code>([^<]+)<\/Code>/.exec(text);
    return { status: res.status, bodyText: text, awsCode: codeMatch ? codeMatch[1] ?? null : null, clientError: null };
  } catch (err) {
    return { status: -1, bodyText: "", awsCode: null, clientError: err instanceof Error ? err.message : String(err) };
  }
}

const PROVIDER_DENY_CODES = ["SignatureDoesNotMatch", "AccessDenied", "InvalidRequest", "XAmzContentSHA256Mismatch", "InvalidArgument", "BadRequest"];

const STRICT_LOCAL_PASS = process.env.STRICT_LOCAL_PASS === "1";

/**
 * SPIKEC4-004 cycle5: clientError는 PASS가 아니다.
 * STRICT_LOCAL_PASS=1이면 fail·아니면 INCONCLUSIVE marker로 처리 (caller 책임).
 * 단, content-type/method case 2/3는 provider 도달이 필수 — clientError는 본 helper에서 throw.
 */
function assertProviderDeny(label: string, r: HttpResult, expectedStatuses: number[]): void {
  if (r.clientError) {
    throw new Error(`[content-type] ${label}: client-side rejection ('${r.clientError}') — provider never received request, cannot verify provider deny. PROVIDER_GATE 필수.`);
  }
  if (!expectedStatuses.includes(r.status)) {
    throw new Error(`[content-type] ${label}: expected status in ${expectedStatuses.join("|")}, got ${r.status} awsCode=${r.awsCode} body=${r.bodyText.slice(0, 200)}`);
  }
  if (!r.awsCode || !PROVIDER_DENY_CODES.includes(r.awsCode)) {
    throw new Error(`[content-type] ${label}: provider returned ${r.status} but unknown awsCode='${r.awsCode}' body=${r.bodyText.slice(0, 200)}`);
  }
}

async function main(): Promise<void> {
  const client = createRootS3Client();
  const expectedCT = "image/jpeg";
  const body = "fake-image-bytes";

  // Case 1: PUT matching CT → 200
  const putUrl1 = await issueSignedUrl(client, {
    ctx: ACTOR_A_OPERATOR,
    objectKey: objectKeyFor(INSTANCE_A_ID, "ct-test/object-1.jpg"),
    method: "PUT",
    contentType: expectedCT,
    contentLength: body.length,
  });
  const r1 = await attemptPut(putUrl1.url, body, {
    "content-type": expectedCT,
    "content-length": String(body.length),
  });
  if (r1.status !== 200) {
    throw new Error(`PUT matching CT: expected 200, got ${r1.status} awsCode=${r1.awsCode} body=${r1.bodyText.slice(0, 200)}`);
  }
  console.log("[content-type] case-1 matching CT: 200 (PASS)");

  // Case 2: PUT mismatched CT → provider deny
  const putUrl2 = await issueSignedUrl(client, {
    ctx: ACTOR_A_OPERATOR,
    objectKey: objectKeyFor(INSTANCE_A_ID, "ct-test/object-2.jpg"),
    method: "PUT",
    contentType: expectedCT,
    contentLength: body.length,
  });
  const r2 = await attemptPut(putUrl2.url, body, {
    "content-type": "application/octet-stream",
    "content-length": String(body.length),
  });
  assertProviderDeny("mismatched CT", r2, [400, 403]);
  console.log(`[content-type] case-2 mismatched CT: ${r2.status} awsCode=${r2.awsCode} (PASS)`);

  // Case 3: PUT missing CT header
  const putUrl3 = await issueSignedUrl(client, {
    ctx: ACTOR_A_OPERATOR,
    objectKey: objectKeyFor(INSTANCE_A_ID, "ct-test/object-3.jpg"),
    method: "PUT",
    contentType: expectedCT,
    contentLength: body.length,
  });
  // node 18 fetch는 body string에 대해 자동으로 content-type 추가할 수 있음 — 명시 제거 시도
  // 강제 missing 위해 ArrayBuffer로 변환
  const buf = new TextEncoder().encode(body);
  const r3 = await attemptPut(putUrl3.url, body, {
    "content-length": String(body.length),
    // intentionally no content-type
  });
  // node fetch는 body string + 명시 헤더 없으면 자동 'text/plain;charset=UTF-8' 추가 가능
  // 따라서 client-side에서 자동 추가된 ct가 signed ct와 mismatch → provider deny
  // 또는 client-side가 사전 reject (rare)
  assertProviderDeny("missing CT (auto-added by client)", r3, [400, 403]);
  console.log(`[content-type] case-3 missing/auto CT: ${r3.status} awsCode=${r3.awsCode} (PASS)`);
  void buf;

  // Case 4: PUT content-length mismatch (signed=3·send=10)
  // SPIKEC2-004 cycle3: client-side rejection은 PROVIDER_GATE 의미 부여 안 함.
  // node fetch는 body length로 content-length 자동 재계산하므로 정확한 mismatch 주입 불가 →
  // 본 case는 LOCAL_CLIENT_BLOCKED marker로 분류·acceptance는 C-provider R2 staging gate에서 raw HTTP로 검증.
  const tinyBody = "AAA";
  const wrongBody = "BBBBBBBBBB";
  const putUrl4 = await issueSignedUrl(client, {
    ctx: ACTOR_A_OPERATOR,
    objectKey: objectKeyFor(INSTANCE_A_ID, "ct-test/object-4.txt"),
    method: "PUT",
    contentType: "text/plain",
    contentLength: tinyBody.length,
  });
  const r4 = await attemptPut(putUrl4.url, wrongBody, {
    "content-type": "text/plain",
    "content-length": String(tinyBody.length),
  });
  // SPIKEC3-004 cycle4: provider 미도달 시 PASS 미선언·INCONCLUSIVE marker 별도 출력
  // local PASS가 provider gate를 만족하지 않도록 명시
  let case4Status: "PROVIDER_DENIED" | "INCONCLUSIVE" | "FAIL" = "FAIL";
  if (r4.clientError) {
    case4Status = "INCONCLUSIVE";
  } else if (r4.status === 200) {
    throw new Error(`PUT length mismatch reached provider as 200 — fail`);
  } else {
    if (r4.status !== 400 && r4.status !== 403) {
      throw new Error(`PUT length mismatch provider response ${r4.status} unexpected`);
    }
    if (r4.awsCode && !PROVIDER_DENY_CODES.includes(r4.awsCode)) {
      throw new Error(`provider awsCode '${r4.awsCode}' not in expected set`);
    }
    case4Status = "PROVIDER_DENIED";
  }

  if (case4Status === "PROVIDER_DENIED") {
    console.log(`[content-type] case-4 length mismatch: PROVIDER_DENIED ${r4.status} awsCode=${r4.awsCode} (PASS)`);
    console.log("\n✅ test-content-type: 3 enforced + 1 PROVIDER_DENIED = 4 cases PASS");
  } else {
    // SPIKEC4-005 cycle5: STRICT_LOCAL_PASS=1이면 exit non-zero·INCONCLUSIVE는 LOCAL_PASS로 인정 안 함
    console.log(`[content-type] case-4 length mismatch: INCONCLUSIVE (client-side block·provider 미도달)`);
    if (STRICT_LOCAL_PASS) {
      throw new Error(`STRICT_LOCAL_PASS=1: content-length INCONCLUSIVE — PROVIDER_GATE 미충족, LOCAL_PASS 인정 불가`);
    }
    console.log("\n⚠️  test-content-type: 3 enforced PASS + 1 INCONCLUSIVE (PROVIDER_GATE 필수)");
    console.log("ℹ️  PROVIDER_GATE (Day 8 R2 staging·raw HTTP): content-length server-side 강제는 LOCAL_PASS로 만족 불가·PROVIDER_PASS gate 필수");
    console.log("ℹ️  CI에서 strict mode 사용: pnpm scenario:all:strict — INCONCLUSIVE 시 exit 1");
  }
}

main().catch((err) => {
  console.error("[content-type] FAIL:", err);
  process.exit(1);
});
