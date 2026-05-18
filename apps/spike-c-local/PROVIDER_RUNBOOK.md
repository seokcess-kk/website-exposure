# Spike C PROVIDER_PASS Runbook — Cloudflare R2 staging (Day 8)

본 runbook은 LOCAL_PASS 완료된 Spike C를 Cloudflare R2 staging 환경에서 검증하는 절차다.

## 사전 조건

- Cloudflare 계정 (free tier OK·R2 활성화 필요)
- R2 활성화는 dashboard에서 `Workers & Pages → R2` 이동·`Enable R2` 클릭 (요금: 10 GB 무료·이후 $0.015/GB·request 요금 별도)
- node 20+·pnpm 10+
- LOCAL_PASS 완료 (`pnpm scenario:all`이 PASS)

## Step 1: R2 bucket 생성

```
Dashboard → R2 → Create bucket
Name: spike-c-staging
Location hint: APAC (ap-northeast-2 region 유사)
```

## Step 2: API tokens 발급

### Root token (bucket 관리·seed용)
```
Dashboard → R2 → Manage R2 API Tokens → Create API Token
Token name: spike-c-root
Permissions: Object Read & Write
Bucket: spike-c-staging
Specify TTL: 7d (Day 8 검증 후 revoke)
```
출력: Access Key ID·Secret Access Key — `.env`의 `S3_ROOT_*`에 입력

### Instance principal tokens (instance-a·instance-b)
**중요**: R2는 AWS S3 IAM PolicyDocument를 완전 지원하지 않음. prefix-scoped token 또는 Workers binding으로 대체.

옵션 A — prefix-scoped token (간단·LOCAL과 가장 유사):
```
Create API Token → Object Read & Write → Bucket: spike-c-staging
Object: include prefix instances/aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa/
```

옵션 B — Workers binding (production-grade·본 spike 범위 외):
- Cloudflare Workers 함수 작성·R2 binding (`env.MY_BUCKET`)
- Workers 함수가 instance scope 검증 후 R2 호출

본 PROVIDER_PASS는 옵션 A로 진행·옵션 B는 Phase 1+.

## Step 3: 환경 변수 설정

```bash
cp .env.provider.example .env.provider
# 위에서 발급한 token 입력
```

## Step 4: PROVIDER smoke 실행

```bash
pnpm provider:smoke    # 본 spike에서 추가될 script
```

## acceptance checklist

| 검증 | 기준 | LOCAL_PASS와의 비교 |
|---|---|---|
| prefix isolation (app-layer) | cross-instance sign 시도 100% deny·TenantPrefixMismatchError | LOCAL 동등 |
| prefix isolation (credential-layer) | instance-a-key로 instance-b 경로 GetObject → 403 AccessDenied | LOCAL과 표 status·body code 차이 명시 |
| method confusion | GET URL로 PUT/DELETE → 403 SignatureDoesNotMatch | LOCAL minio 400·R2 403 정확 |
| content-type 불일치 | PUT presigned·CT mismatch → 403 | minio·R2 양쪽 동등 |
| content-length 불일치 | raw HTTP로 정확 mismatch 주입 → 400/403 | LOCAL은 node fetch 자동 재계산 (INCONCLUSIVE)·R2에서 PROVIDER_DENIED 확정 |
| ListBucket | prefix-scoped token으로 cross prefix list → 403 | LOCAL minio policy condition·R2 token scope |
| TTL bound (signed URL 만료) | TTL 2s 후 fetch → 401/403 | 동등 |
| URL audit scrubbing | audit log에 X-Amz-Signature·credential 미저장 | LOCAL 동등 |
| range request | bytes=0-9 → 206·10 bytes·out-of-range 416 | 동등 |
| invariant runner | 3 instances × 20 objects·50 cross attempts·unexpected 0 | 동등 |

## PROVIDER_GATE 명시 (LOCAL에서 부분만)

LOCAL_PASS에서 LOCAL_CLIENT_BLOCKED·LOCAL_SMOKE marker로 분류된 영역:
- **content-length server-side 강제**: raw HTTP로만 정확 검증 가능·node fetch는 자동 재계산
- **R2 IAM Condition 동등성**: LOCAL minio policy condition은 logic-only·R2 token scope는 별도

본 PROVIDER_PASS smoke에서 위 영역들이 LOCAL 한계를 보완.

## 비용 estimate

- 검증용 객체 ~50 × 1KB → 50 KB 저장·~$0.0001
- request 수 ~200 → free tier 내
- 총 < $0.01·검증 후 bucket 삭제

## acceptance 후 cleanup

```
mc rm --recursive --force spike-c-staging/  # 또는 R2 dashboard에서 bucket empty
R2 dashboard → spike-c-staging → Delete bucket
API tokens → spike-c-root·spike-c-instance-* → Revoke
```

## 알려진 R2 vs minio 차이

| 항목 | minio | R2 (예상) | 영향 |
|---|---|---|---|
| GET→PUT URL error | 400 AccessDenied (signed-header-mismatch) | 403 SignatureDoesNotMatch | smoke가 [400, 401, 403] 모두 허용 — 양쪽 PASS |
| ListBucket without policy | root 모든 list 가능 | prefix-scoped token은 root list 거부 | smoke에서 명시 |
| Range past-EOF | 416 | 416 (S3 표준) | 동등 |
| Content-Type signed header | signed url query에 포함 시 강제 | 동일 | 동등 |
| Multipart upload | 5MB 이상 권장 | R2도 동일·LOCAL에서 미검증 | 본 PROVIDER_PASS 범위 외·Phase 1 |
