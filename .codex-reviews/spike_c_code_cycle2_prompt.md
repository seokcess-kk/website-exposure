# Spike C local prototype 코드 — codex 자동 비평 cycle 2

당신은 동일 reviewer. cycle 1에서 발견한 12개 결함 (blocking 5·major 7)에 대한 v0.2 patch를 검토하라.

## cycle 1 결과 (SoT)

closeable_after_patch: false. blocking 5: SPIKEC1-001(path traversal)·002(UUID 재검증)·003(ListBucket credential)·004(audit scrubber 범위)·005(replay SoT 충돌). major 7: SPIKEC1-006~012.

## cycle 2에서 적용한 v0.2 patch 요약

### 1. SoT cascade (가장 큰 변경)

`docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` § C.1·C.2·C.3 수정:
- **C.1**: `signed URL replay·... 차단` → `signed URL은 TTL-bound bearer semantics — pre-expiry replay 허용 (provider 표준)·만료 후 거부·revocation 불가 (one-time token이 필요하면 Phase 1+ worker proxy)`
- **C.2 시나리오**: 8개 → 8개 (이름 명시 + 한계 marker). #3은 TTL-bound bearer 실측·#5는 LOCAL/PROVIDER 한계·#6은 LOCAL_STUB/PROVIDER_REQUIRED·#7은 416 명시.
- **C.3 통과 기준**: 5항 → 9항. local 검증 가능 여부 column 추가.

### 2. tenant-context.ts — segment-based parser (SPIKEC1-001·002)

```ts
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ROOT_NAMESPACE = "instances";
const SEGMENT_CHAR_REGEX = /^[A-Za-z0-9_\-.()]+$/;

function parseObjectKey(objectKey) {
  // 1) control char (< 0x20·= 0x7F) reject
  // 2) URL-encoded slash/null/query/fragment/backslash reject (%2F·%5C·%00·?·#·\)
  // 3) leading/trailing/double slash reject
  // 4) split('/'); segments < 3 reject; segment === '' || '.' || '..' reject
  // 5) segments[0] === ROOT_NAMESPACE 강제
  // 6) segments[1] canonical UUID (UUID_REGEX) 강제 — 36자 hyphen·non-hex 모두 거부
  // 7) segments[2+] SEGMENT_CHAR_REGEX 강제
}
export function assertObjectKeyForInstance(ctx, key) { parseObjectKey(key); + check instanceId match }
export function assertObjectKeyForServiceRole(ctx, key) { service_role check + parseObjectKey(key) }
```

### 3. audit-log.ts — 모든 string field·URL decode·14 패턴 (SPIKEC1-004)

```ts
const FORBIDDEN_SUBSTRINGS = [
  // AWS SigV4 query params (7개)
  "x-amz-signature", "x-amz-credential", "x-amz-security-token", "x-amz-signedheaders",
  "x-amz-algorithm", "x-amz-date=", "x-amz-expires=",
  // generic credential (6개)
  "authorization:", "aws_access_key", "aws_secret_key", "secret_access_key", "access_token", "bearer ",
  // session/cookie (3개)
  "cookie:", "set-cookie", "sessionid=",
  // generic keyword (2개)
  "signature=", "credential=",
  // Cloudflare (2개)
  "cf-access-jwt", "cf-connecting-ip",
];

function decodedVariants(value) { return [value, decodeURIComponent(value), decodeURIComponent(once)]; }
function scanString(field, value) { for variant in decoded: lower includes any pattern → throw UrlLeakError; }

const STRING_FIELDS = ["instanceId", "actorId", "actorRole", "action", "objectKey", "method", "contentType", "result", "reason"];
function assertNoLeak(entry) { for field in STRING_FIELDS: scanString(field, entry[field]); }
```

### 4. env.ts·sign-url.ts — TTL SoT (SPIKEC1-007)

- env: TTL=600·refresh=60·MAX=86400 (24h) — INFRA v1.0 § Storage 정합
- env: instance-a·instance-b credential 추가
- sign-url: `ttl > env.SIGNED_URL_MAX_TTL_SECONDS` reject·`refresh_before >= ttl` reject
- refreshSignedUrl: 동일 ctx·method·objectKey·content headers
- `_issueShortTtlForExpiryTest`: TEST-ONLY raw helper — refresh_before 검증 우회 (만료 측정용)

### 5. storage-client.ts — client factory 분리 (SPIKEC1-010)

```ts
createRootS3Client()             // root admin (bucket setup·seed)
createInstanceClient("a"|"b")    // minio per-instance user (limited principal)
createServiceRoleClient()        // root credential 재사용 (local) — PROVIDER에서는 STS
```

### 6. docker-compose.yml — minio per-instance user·policy

```yaml
mc-init:
  entrypoint: |
    mc mb local/spike-c
    INSTANCE_A=aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa
    INSTANCE_B=bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb
    # policy: instances/{uuid}/* + ListBucket Condition StringLike s3:prefix=instances/{uuid}/*
    mc admin policy create local instance-a-policy /tmp/policy-a.json
    mc admin policy create local instance-b-policy /tmp/policy-b.json
    mc admin user add local instance-a-key instance-a-secret-12345
    mc admin user add local instance-b-key instance-b-secret-12345
    mc admin policy attach local instance-a-policy --user instance-a-key
    mc admin policy attach local instance-b-policy --user instance-b-key
```

### 7. 시나리오 patch

| 시나리오 | v0.1 | v0.2 |
|---|---|---|
| test-isolation | 5 case | positive 1 + negative 22 (table-driven: cross·malformed·traversal·encoded·UUID 변형·control char) + cross B→A |
| test-method-confusion | 4 case | 5 case + XML body code (`SignatureDoesNotMatch`·`AccessDenied` 등) 명시 assert |
| test-content-type | 4 case | 4 case + provider awsCode assert + client-side vs provider 구분 |
| test-list-bucket | 3 case (app-layer only) | 3 app-layer + 3 credential-layer (minio per-instance user) |
| test-range-request | 4 case (status soft) | 5 case (overlap-end 추가)·case 5 416 명시 assert (throw) |
| test-replay | 4 case (replay 차단 가정) | 7 case (bearer semantics·refresh·TTL bounds·만료 실측 via short-ttl helper) |
| test-audit-scrubbing | 3 case (objectKey·reason) | positive 1 + negative 11 (모든 field·encoded leak·credential·cookie·cf-access-jwt) |
| invariant-runner | manual uuid()·all errors as deny | `crypto.randomUUID()`·TenantPrefixMismatchError만 deny·unexpectedError 즉시 fail |

## v0.2 코드 본문

### tenant-context.ts (현 상태)

```ts
import { MalformedObjectKeyError, TenantPrefixMismatchError } from "./errors.js";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ROOT_NAMESPACE = "instances";
const SEGMENT_CHAR_REGEX = /^[A-Za-z0-9_\-.()]+$/;

export type TenantContext = {
  readonly instanceId: string;
  readonly actorId: string;
  readonly actorRole: "operator" | "admin" | "service_role";
};

export function isValidUuid(value: string): boolean { return UUID_REGEX.test(value); }
export function canonicalUuid(value: string): string {
  if (!isValidUuid(value)) throw new MalformedObjectKeyError(`invalid UUID: ${value}`);
  return value.toLowerCase();
}
export function instancePrefix(instanceId: string): string {
  return `${ROOT_NAMESPACE}/${canonicalUuid(instanceId)}/`;
}

function parseObjectKey(objectKey) {
  // 1) control char (< 0x20·= 0x7F)
  for (let i = 0; i < objectKey.length; i += 1) {
    const c = objectKey.charCodeAt(i);
    if (c < 0x20 || c === 0x7f) throw new MalformedObjectKeyError(`control char at ${i}: ${objectKey}`);
  }
  // 2) encoded slash/null·query·fragment·backslash
  const lower = objectKey.toLowerCase();
  if (lower.includes("%2f") || lower.includes("%5c") || lower.includes("%00")) throw new MalformedObjectKeyError(...);
  if (lower.includes("?") || lower.includes("#")) throw new MalformedObjectKeyError(...);
  if (lower.includes("\\")) throw new MalformedObjectKeyError(...);
  // 3) leading/trailing/double slash
  if (objectKey.startsWith("/") || objectKey.endsWith("/") || objectKey.includes("//")) throw new MalformedObjectKeyError(...);
  const segments = objectKey.split("/");
  if (segments.length < 3) throw new MalformedObjectKeyError(...);
  if (segments[0] !== ROOT_NAMESPACE) throw new MalformedObjectKeyError(...);
  // 4) 각 segment 검사
  for (let i = 0; i < segments.length; i += 1) {
    const seg = segments[i]!;
    if (seg === "" || seg === "." || seg === "..") throw new MalformedObjectKeyError(...);
  }
  // 5) instanceId canonical
  const instanceId = canonicalUuid(segments[1]!);
  // 6) rest segment charset
  for (let i = 2; i < segments.length; i += 1) {
    if (!SEGMENT_CHAR_REGEX.test(segments[i]!)) throw new MalformedObjectKeyError(...);
  }
  return { instanceId, restSegments: segments.slice(2) };
}

export function assertObjectKeyForInstance(ctx, objectKey) {
  const { instanceId } = parseObjectKey(objectKey);
  const expected = canonicalUuid(ctx.instanceId);
  if (instanceId !== expected) throw new TenantPrefixMismatchError(ctx.instanceId, objectKey);
}

export function assertObjectKeyForServiceRole(ctx, objectKey) {
  if (ctx.actorRole !== "service_role") throw new TenantPrefixMismatchError(ctx.instanceId, objectKey);
  parseObjectKey(objectKey);
}
```

### audit-log.ts (현 상태)

```ts
const FORBIDDEN_SUBSTRINGS = [
  "x-amz-signature", "x-amz-credential", "x-amz-security-token", "x-amz-signedheaders", "x-amz-algorithm",
  "x-amz-date=", "x-amz-expires=", "authorization:", "aws_access_key", "aws_secret_key",
  "secret_access_key", "access_token", "bearer ", "cookie:", "set-cookie", "sessionid=",
  "signature=", "credential=", "cf-access-jwt", "cf-connecting-ip",
];

function decodedVariants(value) {
  const variants = [value];
  try { const once = decodeURIComponent(value); if (once !== value) variants.push(once);
        try { const twice = decodeURIComponent(once); if (twice !== once) variants.push(twice); } catch {} }
  catch {}
  return variants;
}

function scanString(field, value) {
  for (const variant of decodedVariants(value)) {
    const lower = variant.toLowerCase();
    for (const pattern of FORBIDDEN_SUBSTRINGS) {
      if (lower.includes(pattern)) throw new UrlLeakError(field, pattern);
    }
  }
  if (value.includes("?") && (value.toLowerCase().includes("x-amz-") || value.toLowerCase().includes("signature"))) {
    throw new UrlLeakError(field, "query-string-with-signature-fragment");
  }
}

const STRING_FIELDS = ["instanceId", "actorId", "actorRole", "action", "objectKey", "method", "contentType", "result", "reason"];

function assertNoLeak(entry) {
  for (const field of STRING_FIELDS) {
    const value = entry[field];
    if (typeof value !== "string") continue;
    scanString(field, value);
  }
}
```

### sign-url.ts (현 상태)

```ts
export async function issueSignedUrl(client, req) {
  const ttl = req.ttlSeconds ?? env.SIGNED_URL_TTL_SECONDS;
  if (ttl <= 0 || ttl > env.SIGNED_URL_MAX_TTL_SECONDS) throw new Error(`ttlSeconds out of range`);
  if (env.SIGNED_URL_REFRESH_BEFORE_SECONDS >= ttl) throw new Error(`REFRESH_BEFORE_SECONDS must be < ttl`);
  try { assertObjectKeyForInstance(req.ctx, req.objectKey); } catch (err) { audit denied; throw; }
  const command = buildCommand(req);
  const url = await getSignedUrl(client, command, {
    expiresIn: ttl,
    signableHeaders: req.method === "PUT" ? new Set(["content-type", "content-length"]) : undefined,
  });
  audit success;
  return { url, method, objectKey, contentType, contentLength, issuedAt, expiresAt, refreshAt };
}

export async function refreshSignedUrl(client, previous, ctx) {
  return issueSignedUrl(client, { ctx, objectKey: previous.objectKey, method: previous.method,
    contentType: previous.contentType ?? undefined, contentLength: previous.contentLength ?? undefined });
}

// TEST-ONLY
export async function _issueShortTtlForExpiryTest(client, req) {
  assertObjectKeyForInstance(req.ctx, req.objectKey);
  const url = await getSignedUrl(client, buildCommand(req), { expiresIn: req.ttlSeconds, signableHeaders: ... });
  return { url, ... };
}
```

### storage-client.ts (현 상태)

```ts
function build(accessKeyId, secretAccessKey) {
  return new S3Client({ endpoint, region, credentials: { accessKeyId, secretAccessKey }, forcePathStyle: true });
}
export function createRootS3Client() { return build(env.S3_ROOT_ACCESS_KEY, env.S3_ROOT_SECRET_KEY); }
export function createInstanceClient(slot: "a"|"b") {
  return slot === "a"
    ? build(env.S3_INSTANCE_A_ACCESS_KEY, env.S3_INSTANCE_A_SECRET_KEY)
    : build(env.S3_INSTANCE_B_ACCESS_KEY, env.S3_INSTANCE_B_SECRET_KEY);
}
export function createServiceRoleClient() { return build(env.S3_ROOT_ACCESS_KEY, env.S3_ROOT_SECRET_KEY); }
```

### test-isolation.ts NEGATIVE_CASES (22개)

cross A→B, malformed: no prefix·empty rest·only root·too few segments·path traversal `..`·single dot `.`·encoded slash `%2F`·encoded backslash `%5C`·encoded null `%00`·null byte literal·double slash·trailing slash·leading slash·query `?`·fragment `#`·backslash `\\`·UUID 36 hyphens·UUID uppercase G·UUID wrong length·UUID no hyphens·control char `\x01`, + cross B→A = 23

### test-list-bucket.ts cred-layer

- case 4: instance-a credential → ListBucket prefix=instances/A/* → 200 + 5 keys
- case 5: instance-a → ListBucket prefix=instances/B/* → 403 (Condition StringLike mismatch)
- case 6: instance-b credential → instances/B/* → 200 + 5 keys

### test-replay.ts case 7 (test-only helper)

```ts
const shortUrl = await _issueShortTtlForExpiryTest(client, { ..., ttlSeconds: 2 });
// 7a within-TTL → 200
// 7b sleep(3000) → 401/403
```

### invariant-runner.ts crossDenied 검증

```ts
catch (err) {
  if (err instanceof InvariantViolationError) throw err;
  if (err instanceof TenantPrefixMismatchError) crossDenied += 1;
  else { unexpectedError += 1; unexpectedErrors.push(...); }
}
if (unexpectedError > 0) throw new InvariantViolationError(...);
```

## 본 cycle 검토 관점

cycle 1 12개 결함이 v0.2에서 closeable 상태로 patch 되었는지 검증·새 결함 발견 시 보고.

특별히 주의할 영역:
1. **segment parser 회피 path**: UTF-8 BOM·non-ASCII·overlong UTF-8·percent-encoded non-ASCII·zero-width chars·Unicode normalization·case folding 회피·whitespace variants
2. **audit scrubber FN/FP**: positive case에서 lower casing이 binary data·base64·legitimate "credential" 단어 (eg. `accreditation`) 등을 잘못 catch하는지
3. **minio policy 동작**: ListBucket Condition StringLike s3:prefix의 minio 정확한 동작·R2 IAM과 차이·`s3:prefix` 빈 값 처리
4. **HEAD method 처리**: HEAD signed URL 발급 후 HEAD 요청·GET 요청·PUT 요청 시 minio 동작
5. **TTL 만료 실측**: `_issueShortTtlForExpiryTest`의 TEST-ONLY 마커가 production 코드와 분리 보장되는가
6. **refresh policy 누락**: 만료된 URL을 refresh 호출하면 동작 (`expiresAt < now`)·membership 변경 후 refresh
7. **invariant 정확성**: `unexpectedError`가 진짜 0이 되는지·기존 success audit이 cross attempt audit과 섞이지 않는지
8. **C-provider gate marker**: 시나리오에 LOCAL_STUB/PROVIDER_REQUIRED 마커가 명확한지·acceptance 의미가 약화되었는지
9. **method confusion case 5 HEAD/GET interop**: minio의 정확한 동작·R2 차이
10. **사용자 입력 validation**: actorId·instanceId 등이 외부 입력일 때 audit scrubber 의존도

## 평가 형식

```json
{
  "cycle": 2,
  "closeable_after_patch": false | true,
  "previous_cycle_closed_findings": ["SPIKEC1-001", ...],
  "previous_cycle_remaining_findings": [],
  "new_blocking_findings": [
    {"id": "SPIKEC2-001", "severity": "blocking|major|minor", "category": "...", "file": "...", "line_range": "...", "issue": "...", "evidence": "...", "suggested_patch": "..."}
  ],
  "convergence_signal": "cycle 1 12개 중 N개 close·N개 remaining·신규 M개 발견. 수렴 추세 self-report",
  "next_cycle_focus": "..."
}
```
