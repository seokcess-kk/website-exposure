# Search Console Ingestion Runbook

SEARCH_VISIBILITY_INGEST_PLAN v0.3 § 3·5·11 운영용 — Google Search Console (GSC) service account 발급 + Search property 등록 + sync 운영.

본 문서는 **운영자 1명이 처음부터 끝까지 따라할 수 있는 단계별 절차**를 담는다. 코드 변경이 필요한 부분은 모두 plan 안 § 3·5 에 정합.

---

## 1. Service Account 발급 (GCP)

1. https://console.cloud.google.com → 프로젝트 선택 (없으면 신규 생성).
2. **IAM & Admin → Service Accounts → Create service account**.
   - Name: `glitzy-search-console` (자유)
   - Role: 부여 불요 (Search Console 권한은 GSC 측에서 별도)
3. 생성된 SA → **Keys → Add key → JSON** 다운로드. 파일 분실 시 재발급만 가능 (재다운로드 불가).
4. JSON 안 두 필드 추출:
   - `client_email` → `GOOGLE_SEARCH_CONSOLE_SA_EMAIL`
   - `private_key` → `GOOGLE_SEARCH_CONSOLE_SA_PRIVATE_KEY` (PEM, `\n` 포함)

## 2. GSC property 권한 부여

각 instance 의 GSC property 마다 반복:

1. https://search.google.com/search-console → property 선택
2. **Settings → Users and permissions → Add user**
3. Email: SA 의 `client_email`
4. Permission: **Restricted user** (필수 — 데이터 조회만 필요, Owner 권한 부여 금지)

> SA email 은 사람 계정처럼 보이지만 비밀번호 로그인 불가 — 권한만 위임받는다.

## 3. 환경 변수 설정

### 로컬 개발

`apps/web/.env.local` 안:

```bash
GOOGLE_SEARCH_CONSOLE_SA_EMAIL=glitzy-search-console@<project>.iam.gserviceaccount.com
GOOGLE_SEARCH_CONSOLE_SA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
```

- PEM 안 줄바꿈은 `\n` literal 그대로 두면 env loader 가 escape 해서 한 줄로 저장. 코드 (`getSearchConsoleCredentials`) 가 `\n` → 진짜 줄바꿈으로 재변환.
- 둘 다 set 또는 둘 다 unset (pair 강제). 한쪽만 채우면 boot 실패.

### Vercel

1. Vercel Project Settings → Environment Variables
2. 두 변수 모두 **Encrypted** + Production·Preview·Development 전 환경 동일하게 추가
3. 변경 후 재배포 필요 (env 변경은 새 deployment 부터 반영)

## 4. Admin UI 등록

1. `/admin/<instance>/visibility-metrics` → "Search property 추가" 버튼
2. Source: `google-search-console`
3. Property URL: GSC 안 표기와 동일하게 입력
   - **URL prefix property**: `https://example.com/` (경로 끝 `/` 까지 포함)
   - **Domain property**: `sc-domain:example.com` (prefix `sc-domain:` 필수)
4. "검증" 클릭 → SA 로 `sites.get` 호출 → status 가 `verified` 되어야 sync 가능

검증 실패 사유 (자주 발생):
- "Permission denied" — § 2 안 user 추가 누락 또는 잘못된 property URL
- "User key invalid" — env 안 private_key escape 깨짐 (보통 줄바꿈 \n 누락)

## 5. Sync 운영

### 수동 sync (UI)

- "이제 동기화" → 최근 28일 (default) 데이터 fetch
- "180일 backfill" → 최대 180일 backfill (한 번만, 이후는 28일 incremental)

### 자동 sync (cron — v1.1 SVI-DEFER-09)

v1.0 안 자동 sync 미구현. 운영자가 매일 1회 수동 실행 또는 외부 cron (예: GitHub Actions) 으로 `/api/sync/search-visibility` 호출.

### Sync 상태

- `running` — 진행 중 (lock 보유). 30분 이상 stale 이면 다음 sync 시 강제 해제 + warning 기록.
- `success` — 정상 완료.
- `partial` — 일부 날짜 실패 (metadata.failedDates 참고). 다음 sync 시 자동 재시도.
- `failed` — 전체 실패. `last_error` 확인 후 수동 재시도.

## 6. 데이터 보존

- 기본 90일 일별 snapshot 유지.
- backfill 한도 180일.
- 자동 cleanup 은 v1.1 (SVI-DEFER-11). 그 전까진 수동 SQL `DELETE FROM search_visibility_snapshot WHERE snapshot_date < NOW() - INTERVAL '180 days'`.

## 7. 보안 체크리스트

- [ ] SA private_key 는 Vercel env 또는 1Password 외에 평문 저장 금지
- [ ] git diff 안 SA email/key 노출 없는지 PR 마다 확인
- [ ] SA 권한은 **Restricted user** — Owner/Full user 부여 금지
- [ ] SA 가 더 이상 필요 없을 때 GCP Console 안 SA 삭제 + GSC 안 user 제거
- [ ] 로그·에러 메시지에 private_key 노출 없는지 확인 (코드 안 SECURITY 주석 참고)

## 8. 트러블슈팅

| 증상 | 원인 | 해결 |
|---|---|---|
| boot 실패: "must be both set or both unset" | env 한 쪽만 채움 | 둘 다 채우거나 둘 다 비우기 |
| 검증 실패: "User key invalid" | private_key escape | `\n` literal 그대로 두기 (코드가 변환) |
| 검증 실패: "Permission denied" | GSC user 누락 | § 2 재수행 |
| sync 30분째 running | 프로세스 crash | 다음 sync 시 stale lock 자동 해제 |
| ctr 1.0 초과 또는 음수 | GSC 응답 이상 | snapshot insert 시 CHECK 위반 → skip + metadata.skippedRows 기록 |
| avg_position 1000 초과 | 매우 낮은 노출 | CHECK 위반 → skip (정상 동작) |

## 9. 참고

- Plan: `docs/decisions/SEARCH_VISIBILITY_INGEST_PLAN.md`
- GSC API: https://developers.google.com/webmaster-tools/search-console-api-original
- DB schema: `packages/core-content/migrations/C0035~C0037_*.sql`
