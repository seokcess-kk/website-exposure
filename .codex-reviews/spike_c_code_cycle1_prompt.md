# Spike C local prototype 코드 — codex 자동 비평 cycle 1

당신은 신중하고 적대적인 senior reviewer다. 본 prompt 안의 모든 코드와 SoT 명세를 직접 읽고, **acceptance를 막을 수 있는 모든 수준의 결함**을 찾아라. 칭찬·요약·동의는 무가치하다. 결함 지적·반증·반례·구체 패치 제안이 유일한 가치다.

## 범위·SoT

- 본 spike의 가설·acceptance criteria SoT: `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` § "Spike C: Cloudflare R2 — local + provider 분리 (SPIKE1-04·11·12)" (§ C.1~C.6)
- 인프라 결정 SoT: `docs/decisions/INFRA_DECISIONS_DRAFT.md` v1.0 (Storage = Cloudflare R2 + minio local·signed URL server-only)
- 관련 Feature 명세: `docs/features/asset-ingestion.md` v1.0·`docs/features/search-visibility.md` v1.0 (blob upload·signed URL 사용처)
- Spike A·B 패턴 참고: `apps/spike-a/` `apps/spike-b/` — RLS·tenant context·audit log·invariant runner 디자인 paradigm

## Spike C 가설 (SoT 인용)

> R2 (S3 호환) object key prefix isolation·server-only signed URL issuer·IAM PolicyDocument로 instance 격리. signed URL replay·method confusion·ListBucket·range request 우회 차단. TTL·refresh 정상 동작.

## C.3-local 통과 기준 (SoT 인용)

| 검증 | 기준 (correctness) |
|---|---|
| prefix isolation | cross-instance 접근 시도 100% block |
| method confusion | 100% block |
| content-type 불일치 | 100% block |
| ListBucket | 100% block |
| URL audit log | signature 미저장 — log scrubber 검증 |

## 본 cycle 검토 대상 (v0.1 코드)

```
apps/spike-c-local/
├── docker-compose.yml           # minio + mc-init
├── .env.example
├── package.json (@glitzy/spike-c-local)
├── tsconfig.json
└── src/
    ├── env.ts
    ├── errors.ts
    ├── tenant-context.ts
    ├── audit-log.ts
    ├── storage-client.ts
    ├── sign-url.ts
    ├── fixtures.ts
    ├── seed.ts
    └── scenarios/
        ├── test-isolation.ts
        ├── test-method-confusion.ts
        ├── test-content-type.ts
        ├── test-list-bucket.ts
        ├── test-range-request.ts
        ├── test-replay.ts
        ├── test-audit-scrubbing.ts
        └── invariant-runner.ts
```

## 검토 관점 (지적할 차원의 예)

### 1. 가설 자체와 SoT 일치 여부
- C.2 시나리오 8항목이 모두 검증되는가? (시나리오 누락·과대구현·과소구현)
- C.3 통과 기준 5항을 코드가 자동으로 보장하는가? (수동 확인 의존 제거)
- C.5 fallback 시나리오 (minio와 R2 동작 차이)를 명시 인지하는가?
- C.4-provider 범위와 C.2-local 범위 경계가 코드/시나리오에서 명확히 구분되는가? (provider semantics에만 의존하는 동작 → C.4에서 검증, C.2에서는 stub로 마킹)

### 2. tenant isolation 정확성
- `tenant-context.ts::KEY_PATTERN`이 path traversal·utf-8 trick·prefix collision (`instances/{A}-{B}`)·case·trailing slash·empty segment·null byte 등 회피를 모두 막는가?
- service_role bypass의 권한 분리: `assertObjectKeyForServiceRole`이 실제 audit 강제와 결합되는가?
- malformed UUID·non-canonical UUID·UUID with whitespace·UUID with leading zero 변형이 모두 거부되는가?

### 3. signed URL issuer 의무
- PUT presign 시 `signableHeaders: Set(["content-type", "content-length"])` 만으로 strict 강제가 보장되는가? 또는 별도 conditions (S3 POST policy)·또는 anti-cors·browser hint이 필요한가?
- TTL 상한 (`7 * 24 * 3600`)이 합리적인가? — 정책 SoT 부재 시 어디서 결정해야 하는가?
- refresh 시 동일 instance·동일 method 강제가 충분한가? — 만료된 URL을 다른 method로 refresh하는 attack vector?

### 4. audit log scrubbing
- `FORBIDDEN_SUBSTRINGS` 목록이 완전한가? AWS Sig v4 외 다른 credential leak 패턴 누락? (eg. SAS token·Cloudflare token·Bearer·Cookie)
- 평문 lower casing만으로 path-encoded·URL-encoded 패턴이 검출되는가?
- audit entry의 **모든 string field**를 스캔하는가, 일부만? actorId·instanceId 등이 외부 입력이면 leak vector?

### 5. minio↔R2 동작 차이 (검증 가치 약화)
- C-local PASS의 의미 — R2 PROVIDER_PASS에서 차이가 큰 가설은 명시 제외해야. 어떤 시나리오가 R2 전용 (IAM PolicyDocument)이라 minio에서 사실상 가짜 PASS인가?
- minio의 `forcePathStyle: true`와 R2 native virtual-host style 차이가 sign 동작에 미치는 영향?
- minio가 content-length 검증·content-type 강제를 R2와 동일하게 하는가? (실측 전에 회의)

### 6. 시나리오 robustness
- test-isolation case-5 path traversal: regex가 `instances/A/../B/...`를 어떻게 처리하는지 정확한 예측 가능한가?
- test-method-confusion: HTTP 401·403·SignatureDoesNotMatch·MethodNotAllowed 응답 코드의 minio 실제 동작 확인 필요
- test-content-type case-3 (missing CT header): node 18 fetch가 자동으로 content-type 추가하지 않는지 확인
- test-replay case-2 (100× pre-expiry replay): replay 100회가 실제로 성공해야 하는가? signed URL은 expiry까지 무한 재사용 가능하므로 의미 있는가?
- test-range case-4: minio out-of-range 응답 (206 empty vs 416)의 실측 결과를 기다리지 말고 명시 결정 필요
- test-audit-scrubbing: leak 검사는 audit-log.ts의 책임 — 시나리오에서 ad-hoc JSON.stringify scan은 중복일 수도

### 7. 코드 품질·신뢰성
- error type별 명시 try-catch — 다른 error가 의도치 않게 PASS로 swallow?
- TypeScript `any` 사용 (`list: any`·`result: any`) — `@aws-sdk/client-s3` 타입을 import해서 strict 가능한가?
- `crypto.randomUUID()` 가능한데 invariant-runner의 manual uuid() 함수는 필요한가?
- `process.exit(1)` 사용 — Node.js cleanup 보장 (audit log flush·s3client destroy 등) 부재
- `sleep` 함수가 test-replay에서만 정의 — 공통 utility로 분리?
- minio bucket 이름 'spike-c'가 docker-compose에서 mc-init·.env.example·코드 사이에 hardcoded — single SoT 필요
- seed.ts의 clearAllObjects가 ListObjectsV2 1000 페이지 한계 페이지네이션 확인 필요

### 8. 보안 결함
- root credentials (minioadmin/minioadmin)이 docker-compose에 평문 — `.env`·secret store 사용 필요? LOCAL_PASS에서는 OK?
- `S3_ROOT_*` credentials이 `env.ts`에서 required — production에서는 IAM role·STS 사용 필요. SoT 명시 누락?
- signed URL TTL 60s가 default — 정책 SoT에서 max·default 별도 결정 필요?
- 모든 시나리오가 root credentials로 signing — 실제 production은 별도 limited principal 필요. 명시 marker?

### 9. 운영·관측성·복구
- audit log가 in-memory — 프로세스 crash 시 전부 손실. 본 spike에서는 LOCAL ONLY OK, but 실 production에서 어떻게 promote할지 marker?
- invariant runner 시간 측정만 — 실 production에서 SLO marker (p50/p95) 없음
- error 발생 시 audit append → throw 순서: append가 throw하면 outer try가 swallow하지 않음 (UrlLeakError) — 의도된 동작인지?
- docker compose down -v는 minio data volume 삭제 → 재현 가능. 명시 documentation?

### 10. 누락된 시나리오
- 이름이 path-encoded UTF-8·non-ASCII·매우 긴 (1KB+)·SQL/HTML special character — 모두 sign 가능한가?
- multipart upload (R2/S3 5MB 이상 권장) — local에서 검증 안 함?
- abort multipart upload — credential leak·중간 상태?
- Server-Side Encryption (SSE) — header 강제 필요? (R2 SSE-S3 default)
- CORS origin 강제 — browser 직접 PUT 시 origin 검증 필요?
- versioning enabled bucket·object delete marker — 영향?

## 평가 형식 — 반드시 다음 JSON 스키마

```json
{
  "cycle": 1,
  "closeable_after_patch": false,
  "blocking_findings": [
    {
      "id": "SPIKEC1-001",
      "severity": "blocking | major | minor",
      "category": "tenant-isolation | signed-url | audit | minio-r2-gap | scenario-robustness | code-quality | security | missing-scenario | other",
      "file": "src/tenant-context.ts",
      "line_range": "L12-L30",
      "issue": "구체 결함 1~3문장",
      "evidence": "코드 인용 또는 SoT 인용 또는 실측 예시",
      "suggested_patch": "코드 수정 방향·신규 시나리오·SoT cascade 등 구체 행동"
    }
  ],
  "convergence_signal": "지적 0~N개. 매 cycle 감소 추세인지·새 결함이 더 나오지 않는지 self-report",
  "next_cycle_focus": "다음 cycle에서 review할 핵심 1~2 영역"
}
```

본 cycle에서 발견한 모든 blocking + major 결함을 빠짐없이 나열하라. minor는 closeableAfterPatch 판단의 가중치만 — 모두 패치 후 closeable 가능하면 `closeable_after_patch: true`.

## 코드 본문 (v0.1)

### apps/spike-c-local/docker-compose.yml
```yaml
version: "3.9"

services:
  minio:
    image: minio/minio:RELEASE.2025-01-20T14-49-07Z
    container_name: spike-c-minio
    command: server /data --console-address ":9101"
    ports:
      - "9100:9000"
      - "9101:9101"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
      MINIO_REGION: us-east-1
    volumes:
      - minio-data:/data
    healthcheck:
      test: ["CMD", "mc", "ready", "local"]
      interval: 5s
      timeout: 3s
      retries: 5

  mc-init:
    image: minio/mc:RELEASE.2025-01-17T23-25-50Z
    container_name: spike-c-mc-init
    depends_on:
      minio:
        condition: service_healthy
    entrypoint: >
      /bin/sh -c "
        mc alias set local http://minio:9000 minioadmin minioadmin &&
        mc mb --ignore-existing local/spike-c &&
        echo 'minio bucket spike-c ready'
      "

volumes:
  minio-data:
```

### .env.example
```
S3_ENDPOINT=http://localhost:9100
S3_REGION=us-east-1
S3_BUCKET=spike-c
S3_ROOT_ACCESS_KEY=minioadmin
S3_ROOT_SECRET_KEY=minioadmin
SIGNED_URL_TTL_SECONDS=60
SIGNED_URL_REFRESH_BEFORE_SECONDS=10
INVARIANT_INSTANCES=5
INVARIANT_OBJECTS_PER_INSTANCE=100
INVARIANT_CROSS_ATTEMPTS=200
```

### src/env.ts
(env validation·required·optionalInt — env.ts 전문은 위 list 참조)

### src/errors.ts
6 domain errors: TenantPrefixMismatchError·MethodNotAllowedError·ContentTypeMismatchError·MalformedObjectKeyError·SignedUrlExpiredError·InvariantViolationError

### src/tenant-context.ts
```ts
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const KEY_PATTERN = /^instances\/([0-9a-f-]{36})\/[^/].*$/i;

export function isValidUuid(value: string): boolean { return UUID_REGEX.test(value); }
export function instancePrefix(instanceId: string): string {
  if (!isValidUuid(instanceId)) throw new MalformedObjectKeyError(`instance/${instanceId}/`);
  return `instances/${instanceId.toLowerCase()}/`;
}
export function assertObjectKeyForInstance(ctx, objectKey) {
  const match = KEY_PATTERN.exec(objectKey);
  if (!match) throw new MalformedObjectKeyError(objectKey);
  const keyInstanceId = match[1].toLowerCase();
  const expected = ctx.instanceId.toLowerCase();
  if (keyInstanceId !== expected) throw new TenantPrefixMismatchError(ctx.instanceId, objectKey);
}
export function assertObjectKeyForServiceRole(ctx, objectKey) {
  if (ctx.actorRole !== "service_role") throw new TenantPrefixMismatchError(ctx.instanceId, objectKey);
  const match = KEY_PATTERN.exec(objectKey);
  if (!match) throw new MalformedObjectKeyError(objectKey);
}
```

### src/audit-log.ts
in-memory AuditLog class·assertNoLeak with FORBIDDEN_SUBSTRINGS:
```ts
const FORBIDDEN_SUBSTRINGS = [
  "x-amz-signature", "x-amz-credential", "x-amz-security-token",
  "x-amz-signedheaders", "x-amz-algorithm", "x-amz-date=", "x-amz-expires=",
  "authorization:", "aws_access_key", "aws_secret_key",
];
```
- 검사 대상 string fields: `["objectKey", "reason"]`만
- 평문 lower casing 후 includes 검사

### src/sign-url.ts
```ts
export async function issueSignedUrl(client, req): Promise<SignedUrlResult> {
  const ttl = req.ttlSeconds ?? env.SIGNED_URL_TTL_SECONDS;
  if (ttl <= 0 || ttl > 7 * 24 * 3600) throw new Error(`ttlSeconds out of range`);
  try { assertObjectKeyForInstance(req.ctx, req.objectKey); }
  catch (err) { audit append denied; throw err; }
  const command = buildCommand(req);
  const url = await getSignedUrl(client, command, {
    expiresIn: ttl,
    signableHeaders: req.method === "PUT" ? new Set(["content-type", "content-length"]) : undefined,
  });
  audit append success;
  return { url, method, objectKey, contentType, contentLength, issuedAt, expiresAt, refreshAt };
}
```

### src/scenarios/test-isolation.ts (5 case)
1. self-prefix sign → success
2. A→B cross sign → TenantPrefixMismatchError
3. B→A cross sign → TenantPrefixMismatchError
4. malformed key (`no-prefix.txt`) → MalformedObjectKeyError
5. path traversal (`instances/A/../B/...`) → expect denial
audit: success=1, denied=4

### src/scenarios/test-method-confusion.ts (4 case)
1. GET → GET URL: 200
2. PUT → GET URL: expect 401/403
3. DELETE → GET URL: expect 401/403
4. GET → PUT URL: expect 401/403

### src/scenarios/test-content-type.ts (4 case)
1. PUT matching CT: 200
2. PUT mismatch CT: expect 400/403
3. PUT missing CT header: expect non-200
4. PUT content-length mismatch (signed=3, body=10): expect non-200

### src/scenarios/test-list-bucket.ts (3 case)
1. A own prefix list → 5 objects (all prefixed with instances/A/)
2. A → B prefix list → denied (application layer)
3. service_role → B prefix list → 5 objects (with audit)

### src/scenarios/test-range-request.ts (4 case)
1. Full GET → 200, 100 bytes
2. Range bytes=0-9 → 206, 10 bytes
3. Range bytes=50-99 → 206, 50 bytes
4. Range bytes=200-300 → 416 (or 206 empty — minio dependent)

### src/scenarios/test-replay.ts (4 case)
1. Within-TTL GET → 200
2. Replay 100× pre-expiry → all 200
3. Post-TTL GET → 401/403
4. refreshSignedUrl → new URL → 200

### src/scenarios/test-audit-scrubbing.ts (3 case)
1. Issue 5 signed URLs → scan audit entries → no leak
2. Attempt to append leaky entry (X-Amz-Signature in objectKey) → UrlLeakError
3. Leak in reason field → UrlLeakError

### src/scenarios/invariant-runner.ts
- N instances (env.INVARIANT_INSTANCES=5) generated by manual uuid()
- Phase 1: each instance signs M (=100) own-prefix objects
- Phase 2: X (=200) cross-instance attempts — all must deny
- Invariants:
  - selfSuccess === audit.success
  - crossDenied === audit.denied
  - leak scan on all audit entries (forbidden 3 patterns)
  - all success audit objectKey starts with own prefix

## 본 cycle 결과 제출 후

지적을 JSON으로 출력하라. 다음 cycle은 본 지적에 대한 코드/spec 수정 후 새 prompt로 진행한다. closeable_after_patch는 신중히 — 본 cycle은 cycle 1이므로 false가 자연스러움.
