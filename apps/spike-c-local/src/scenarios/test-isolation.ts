// Spike C — test-isolation: cross-instance·malformed·traversal·non-canonical UUID
// SPIKEC1-001·002 cycle2: segment parser·encoded slash·hyphen-only string·case 등 회피 모두 차단

import { createRootS3Client } from "../storage-client.js";
import { issueSignedUrl } from "../sign-url.js";
import { ACTOR_A_OPERATOR, ACTOR_B_OPERATOR, INSTANCE_A_ID, INSTANCE_B_ID, objectKeyFor } from "../fixtures.js";
import { TenantPrefixMismatchError, MalformedObjectKeyError } from "../errors.js";
import { auditLog } from "../audit-log.js";

type NegativeCase = {
  readonly label: string;
  readonly objectKey: string;
  readonly expected: typeof TenantPrefixMismatchError | typeof MalformedObjectKeyError;
};

const NEGATIVE_CASES: ReadonlyArray<NegativeCase> = [
  { label: "cross-instance A→B", objectKey: objectKeyFor(INSTANCE_B_ID, "seed/file-0.txt"), expected: TenantPrefixMismatchError },
  { label: "malformed: no prefix", objectKey: "no-prefix.txt", expected: MalformedObjectKeyError },
  { label: "malformed: empty rest", objectKey: `instances/${INSTANCE_A_ID}/`, expected: MalformedObjectKeyError },
  { label: "malformed: only root", objectKey: "instances/", expected: MalformedObjectKeyError },
  { label: "malformed: too few segments", objectKey: `instances/${INSTANCE_A_ID}`, expected: MalformedObjectKeyError },
  { label: "path traversal ..", objectKey: `instances/${INSTANCE_A_ID}/../${INSTANCE_B_ID}/seed/file-0.txt`, expected: MalformedObjectKeyError },
  { label: "single dot segment", objectKey: `instances/${INSTANCE_A_ID}/./file-0.txt`, expected: MalformedObjectKeyError },
  { label: "encoded slash %2F", objectKey: `instances/${INSTANCE_A_ID}/seed%2Ffile-0.txt`, expected: MalformedObjectKeyError },
  { label: "encoded backslash %5C", objectKey: `instances/${INSTANCE_A_ID}/seed%5Cfile-0.txt`, expected: MalformedObjectKeyError },
  { label: "encoded null %00", objectKey: `instances/${INSTANCE_A_ID}/seed/file%00.txt`, expected: MalformedObjectKeyError },
  { label: "null byte literal", objectKey: `instances/${INSTANCE_A_ID}/seed/file\0.txt`, expected: MalformedObjectKeyError },
  { label: "double slash", objectKey: `instances/${INSTANCE_A_ID}//file-0.txt`, expected: MalformedObjectKeyError },
  { label: "trailing slash", objectKey: `instances/${INSTANCE_A_ID}/seed/file-0.txt/`, expected: MalformedObjectKeyError },
  { label: "leading slash", objectKey: `/instances/${INSTANCE_A_ID}/seed/file-0.txt`, expected: MalformedObjectKeyError },
  { label: "query in key", objectKey: `instances/${INSTANCE_A_ID}/seed/file-0.txt?x=1`, expected: MalformedObjectKeyError },
  { label: "fragment in key", objectKey: `instances/${INSTANCE_A_ID}/seed/file-0.txt#frag`, expected: MalformedObjectKeyError },
  { label: "backslash in key", objectKey: `instances/${INSTANCE_A_ID}/seed\\file-0.txt`, expected: MalformedObjectKeyError },
  { label: "non-canonical UUID (36 hyphens)", objectKey: `instances/------------------------------------/seed/file-0.txt`, expected: MalformedObjectKeyError },
  { label: "non-canonical UUID (uppercase G)", objectKey: `instances/gggggggg-gggg-4ggg-gggg-gggggggggggg/seed/file-0.txt`, expected: MalformedObjectKeyError },
  { label: "non-canonical UUID (wrong length)", objectKey: `instances/aaaa-bbbb-cccc/seed/file-0.txt`, expected: MalformedObjectKeyError },
  { label: "non-canonical UUID (no hyphens)", objectKey: `instances/aaaaaaaaaaaa4aaaaaaaaaaaaaaaaaaaaaaa/seed/file-0.txt`, expected: MalformedObjectKeyError },
  { label: "control char in segment", objectKey: `instances/${INSTANCE_A_ID}/seed/file\x01.txt`, expected: MalformedObjectKeyError },
];

async function main(): Promise<void> {
  auditLog.clear();
  const client = createRootS3Client();

  // Positive: self-prefix sign → success
  const okResult = await issueSignedUrl(client, {
    ctx: ACTOR_A_OPERATOR,
    objectKey: objectKeyFor(INSTANCE_A_ID, "seed/file-0.txt"),
    method: "GET",
  });
  if (!okResult.url.startsWith("http")) {
    throw new Error(`expected http URL, got ${okResult.url}`);
  }
  console.log("[isolation] positive self-prefix sign: PASS");

  // Negative: 22 case
  let denied = 0;
  for (const c of NEGATIVE_CASES) {
    let caught = false;
    try {
      await issueSignedUrl(client, {
        ctx: ACTOR_A_OPERATOR,
        objectKey: c.objectKey,
        method: "GET",
      });
    } catch (err) {
      if (err instanceof c.expected) {
        caught = true;
      } else {
        throw new Error(`[isolation] ${c.label}: expected ${c.expected.name}, got ${err instanceof Error ? err.name : err}`);
      }
    }
    if (!caught) throw new Error(`[isolation] ${c.label}: should have been denied`);
    denied += 1;
    console.log(`[isolation] negative '${c.label}': DENIED (PASS)`);
  }

  // B로 A prefix sign 시도 (positive·negative 대칭 검증)
  let crossDeniedB = false;
  try {
    await issueSignedUrl(client, {
      ctx: ACTOR_B_OPERATOR,
      objectKey: objectKeyFor(INSTANCE_A_ID, "seed/file-0.txt"),
      method: "GET",
    });
  } catch (err) {
    if (err instanceof TenantPrefixMismatchError) crossDeniedB = true;
  }
  if (!crossDeniedB) throw new Error("[isolation] cross B→A should have been denied");
  console.log("[isolation] cross B→A: DENIED (PASS)");

  // audit 검증
  const success = auditLog.countByResult("success");
  const deniedAudit = auditLog.countByResult("denied");
  const expectedDenied = NEGATIVE_CASES.length + 1; // 22 + 1 (B→A)
  console.log(`[isolation] audit: success=${success}, denied=${deniedAudit}`);
  if (success !== 1) throw new Error(`expected 1 success audit, got ${success}`);
  if (deniedAudit !== expectedDenied) throw new Error(`expected ${expectedDenied} denied audit, got ${deniedAudit}`);

  console.log(`\n✅ test-isolation: positive 1 + negative ${NEGATIVE_CASES.length + 1} = ${NEGATIVE_CASES.length + 2} cases PASS`);
}

main().catch((err) => {
  console.error("[isolation] FAIL:", err);
  process.exit(1);
});
