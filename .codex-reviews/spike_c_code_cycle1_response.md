{
  "cycle": 1,
  "closeable_after_patch": false,
  "blocking_findings": [
    {
      "id": "SPIKEC1-001",
      "severity": "blocking",
      "category": "tenant-isolation",
      "file": "apps/spike-c-local/src/tenant-context.ts",
      "line_range": "L9-L11, L34-L44",
      "issue": "path traversal key가 차단되지 않는다. `instances/{A}/../{B}/...`는 KEY_PATTERN에 매치되고 captured instanceId가 A라서 `assertObjectKeyForInstance(A, key)`가 성공한다.",
      "evidence": "KEY_PATTERN은 `^instances\\/([0-9a-f-]{36})\\/[^/].*$`라서 rest segment의 `..`를 허용한다. 그런데 `test-isolation.ts` case-5는 이 입력이 deny된다고 가정한다.",
      "suggested_patch": "objectKey를 `/`로 split해서 정확히 `instances/{canonicalUuid}/{nonEmptySegments...}` 구조를 검증하고, 각 segment에서 `.`, `..`, empty segment, backslash, control char, null byte, encoded slash/traversal 후보를 거부하라. `test-isolation`에 현재 반례를 실제로 실패시키는 assertion을 추가하라."
    },
    {
      "id": "SPIKEC1-002",
      "severity": "blocking",
      "category": "tenant-isolation",
      "file": "apps/spike-c-local/src/tenant-context.ts",
      "line_range": "L7-L11, L34-L58",
      "issue": "object key 안의 instanceId가 canonical UUID인지 검증되지 않는다. `KEY_PATTERN`은 36자의 hex/hyphen 조합만 확인하므로 malformed UUID를 MalformedObjectKeyError로 일관되게 차단하지 못하고, service_role path에서는 그대로 통과한다.",
      "evidence": "`assertObjectKeyForInstance`와 `assertObjectKeyForServiceRole` 모두 match[1]에 대해 `isValidUuid()`를 호출하지 않는다. `------------------------------------` 같은 36자 hyphen 문자열도 pattern match 후 service_role에서는 통과한다.",
      "suggested_patch": "KEY_PATTERN의 capture 후 반드시 `UUID_REGEX` 검증을 수행하고, non-canonical UUID는 모든 role에서 `MalformedObjectKeyError`로 거부하라. whitespace, uppercase 정규화 정책, hyphen 위치 오류, empty/trailing slash를 포함한 table-driven negative test를 추가하라."
    },
    {
      "id": "SPIKEC1-003",
      "severity": "blocking",
      "category": "minio-r2-gap",
      "file": "apps/spike-c-local/src/scenarios/test-list-bucket.ts",
      "line_range": "L1-L6, L22-L63",
      "issue": "C.3의 `ListBucket 100% block`을 검증하지 않는다. 시나리오는 instance credential이 아니라 root credential로 ListObjectsV2를 호출하고, 시나리오 내부 helper의 application-layer prefix check만 테스트한다.",
      "evidence": "SoT C.2는 `instance-a credential로 instance-b prefix list → fail`을 요구한다. 구현 주석은 `Local minio admin credential은 ListBucket 전체 가능`이라고 인정하고, 실제 client도 `createRootS3Client()`를 사용한다.",
      "suggested_patch": "C-local에서는 이 항목을 credential-level PASS로 표시하지 말고 `LOCAL_STUB`/`PROVIDER_REQUIRED`로 명시하라. 가능하면 minio policy/user를 instance별로 생성해 deny를 실측하고, 최종 acceptance는 C-provider R2 IAM Condition 테스트에 연결하라."
    },
    {
      "id": "SPIKEC1-004",
      "severity": "blocking",
      "category": "audit",
      "file": "apps/spike-c-local/src/audit-log.ts",
      "line_range": "L23-L35, L44-L56",
      "issue": "audit scrubber가 모든 string field를 검사하지 않고, URL-encoded leak도 잡지 못한다. actorId, actorRole, instanceId, contentType 같은 string field에 presigned URL query나 credential fragment가 들어가면 audit에 저장된다.",
      "evidence": "`stringFields`가 `['objectKey', 'reason']`뿐이다. `actorId='x?X-Amz-Signature=...'` 또는 `objectKey='x%3FX-Amz-Signature%3D...'` 같은 입력은 현재 scrubber를 우회한다.",
      "suggested_patch": "AuditEntry의 모든 string/null string field를 순회하고, 원문 lower-case뿐 아니라 URL decode 1~2회, query-key parsing, common credential patterns(`signature=`, `credential=`, `access_token`, `bearer `, `cookie`, `cf-`, `aws_secret_access_key`)을 검사하라. test-audit-scrubbing에 actorId/contentType/encoded URL leak 반례를 추가하라."
    },
    {
      "id": "SPIKEC1-005",
      "severity": "blocking",
      "category": "signed-url",
      "file": "apps/spike-c-local/src/scenarios/test-replay.ts",
      "line_range": "L1-L4, L29-L39",
      "issue": "replay 요구사항이 SoT와 구현에서 충돌한다. C.1은 `signed URL replay ... 차단`을 가설로 쓰지만, C.2와 구현은 pre-expiry replay 100회를 모두 성공해야 PASS로 둔다.",
      "evidence": "`test-replay.ts` case-2는 `pre-expiry replay should be 100/100 success`를 강제한다. 이는 bearer presigned URL의 기본 동작이지만, `replay 차단` acceptance와는 반대다.",
      "suggested_patch": "SoT를 먼저 결정하라. presigned URL replay를 허용할 것이라면 C.1/C.3에서 `replay 차단` 표현을 제거하고 TTL-bound bearer semantics + revocation 불가를 acceptance로 바꿔라. replay 차단이 필요하면 presigned URL 단독이 아니라 one-time token proxy/worker를 설계하고 local scenario를 바꿔라."
    },
    {
      "id": "SPIKEC1-006",
      "severity": "major",
      "category": "signed-url",
      "file": "apps/spike-c-local/src/sign-url.ts",
      "line_range": "L44-L56, L100-L103",
      "issue": "PUT content-length/content-type 강제가 실제 S3/R2에서 보장된다는 증거가 없다. `signableHeaders`와 PutObjectCommand header signing만으로 browser direct PUT의 size policy를 강제한다고 acceptance할 수 없다.",
      "evidence": "C.3은 `content-type 불일치 100% block`을 요구한다. 구현은 `content-type`과 `content-length`를 signed header로 넣지만, S3 presigned PUT은 content-length range condition 같은 POST policy semantics와 다르며, node fetch의 content-length mismatch 테스트도 클라이언트 레벨 오류와 provider 거부를 구분하지 못한다.",
      "suggested_patch": "R2에서 content-type/header signing 실측을 C-provider gate로 올리고, local에서는 HTTP 요청이 실제 provider에 도달했는지와 응답 XML code를 assert하라. content-length hard bound가 필수라면 presigned POST policy, checksum/content-md5, upload proxy, multipart policy 중 하나로 SoT를 수정하라."
    },
    {
      "id": "SPIKEC1-007",
      "severity": "major",
      "category": "signed-url",
      "file": "apps/spike-c-local/src/sign-url.ts",
      "line_range": "L73-L77, L138-L150",
      "issue": "TTL/refresh 정책이 Feature/Infra SoT와 맞지 않고 refresh lifetime 제한도 없다. Feature와 INFRA는 TTL 600초, refresh 60초 전을 명시하지만 spike default는 60초/10초이고 max TTL은 근거 없이 7일이다.",
      "evidence": "INFRA_DECISIONS_DRAFT v1.0 Storage section은 `TTL 600초`와 `만료 60초 전 자동 refresh`를 명시한다. `.env.example`과 env fallback은 60/10이며 `issueSignedUrl`은 7일 TTL까지 허용한다.",
      "suggested_patch": "default TTL=600, refreshBefore=60으로 맞추고 max TTL도 SoT에 명시하라. `refreshSignedUrl`은 previous result의 `expiresAt`, `refreshAt`, original method/objectKey/content headers를 검증하고, 만료 후 무기한 refresh가 가능한지 정책을 문서화하거나 차단하라."
    },
    {
      "id": "SPIKEC1-008",
      "severity": "major",
      "category": "scenario-robustness",
      "file": "apps/spike-c-local/src/scenarios/test-range-request.ts",
      "line_range": "L63-L74",
      "issue": "range out-of-range case가 어떤 status여도 PASS한다. `416`이 아니어도 로그만 찍고 최종 `ALL 4 CASES PASS`를 출력하므로 scenario가 regression을 잡지 못한다.",
      "evidence": "L68-L72에서 `r4.status !== 416`이면 console.log만 수행하고 throw하지 않는다.",
      "suggested_patch": "허용 status set을 SoT로 정하고 assert하라. minio/R2 차이가 있으면 local expected와 provider expected를 분리하고, unknown status는 실패로 처리하라."
    },
    {
      "id": "SPIKEC1-009",
      "severity": "major",
      "category": "scenario-robustness",
      "file": "apps/spike-c-local/src/scenarios/invariant-runner.ts",
      "line_range": "L55-L65",
      "issue": "cross-instance invariant가 모든 예외를 denial로 계산한다. network error, env error, signer bug, AWS SDK error도 crossDenied로 증가하므로 `100% block` 증명이 거짓 양성 PASS가 될 수 있다.",
      "evidence": "catch 블록은 `InvariantViolationError`만 재throw하고 나머지는 전부 `crossDenied += 1` 처리한다.",
      "suggested_patch": "cross attempt는 반드시 `TenantPrefixMismatchError`만 success-denial로 인정하라. `MalformedObjectKeyError` 등 기대 가능한 별도 negative case는 분리하고, 그 외 error는 즉시 fail하라."
    },
    {
      "id": "SPIKEC1-010",
      "severity": "major",
      "category": "minio-r2-gap",
      "file": "apps/spike-c-local/src/storage-client.ts",
      "line_range": "L7-L16",
      "issue": "모든 signing과 scenario가 root credential + path-style minio endpoint에 고정되어 provider semantics와 분리되지 않는다. R2 native endpoint/virtual-host style, limited principal, IAM PrincipalTag/PolicyDocument 경계가 코드에 모델링되지 않는다.",
      "evidence": "`createRootS3Client()`는 `S3_ROOT_ACCESS_KEY`, `S3_ROOT_SECRET_KEY`, `forcePathStyle: true`를 항상 사용한다. C.4는 instance-a credential로 Get/List/Put/CopyObject fail을 요구하지만 local 코드에는 limited principal 개념이 없다.",
      "suggested_patch": "client factory를 `root/admin`, `instancePrincipal`, `serviceRole`로 분리하고 local에는 minio policy stub 또는 explicit `PROVIDER_ONLY` markers를 둬라. C-provider scenario 파일을 별도 추가해 R2 endpoint style과 IAM Condition을 acceptance gate로 연결하라."
    },
    {
      "id": "SPIKEC1-011",
      "severity": "major",
      "category": "scenario-robustness",
      "file": "apps/spike-c-local/src/scenarios/test-content-type.ts",
      "line_range": "L63-L83, L85-L106",
      "issue": "content-type missing과 content-length mismatch case가 provider-level block을 충분히 검증하지 않는다. case-3은 status가 201/204/400/500이어도 200만 아니면 PASS이고, case-4는 node fetch가 요청 전 content-length mismatch를 거부할 가능성을 provider block으로 오인한다.",
      "evidence": "case-3은 `if (r3.status === 200) throw` 외에 허용 status를 제한하지 않는다. case-4도 `r4.status === 200`만 실패로 본다.",
      "suggested_patch": "각 case에서 expected provider error code와 error body code를 assert하라. fetch client-side exception과 HTTP response를 구분하고, mismatch 요청이 실제 minio/R2에 도달했는지 server access log 또는 response body로 확인하라."
    },
    {
      "id": "SPIKEC1-012",
      "severity": "major",
      "category": "tenant-isolation",
      "file": "apps/spike-c-local/src/scenarios/test-list-bucket.ts",
      "line_range": "L22-L43",
      "issue": "service_role bypass가 audit 강제와 결합되어 있지 않고, reusable production helper도 아니다. `assertObjectKeyForServiceRole`은 caller audit 책임이라는 주석만 있고, list helper도 scenario 내부 지역 함수라 실제 issuer/list API invariant가 아니다.",
      "evidence": "`assertObjectKeyForServiceRole`은 audit append를 수행하지 않는다. `tenantListObjects`는 scenario 파일 안에만 존재해 production code path가 이 검증을 공유하지 않는다.",
      "suggested_patch": "service_role bypass는 공통 storage API 함수로만 노출하고, 그 함수 안에서 audit append와 reason/action을 강제하라. bypass 사용처별 시나리오에서 audit 누락 시 실패하는 invariant를 추가하라."
    }
  ],
  "convergence_signal": "cycle 1에서 acceptance를 막는 blocking 5개와 major 7개가 확인됐다. 특히 tenant key parser, ListBucket 검증 의미, replay 정책 충돌, audit scrubber 범위는 패치 없이는 close 불가하다.",
  "next_cycle_focus": "다음 cycle은 canonical object key parser/table-driven negative tests와 C-local/C-provider gate 분리, 그리고 audit scrubber의 모든 string field/encoded leak 검증을 우선 재검토해야 한다."
}