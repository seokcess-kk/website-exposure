# ADMIN_BUSINESS_ENTITIES_PLAN (v1.0·acceptance·2026-05-27)

> **상태**: **v1.0 (acceptance)** — 사용자 의도 (2026-05-27) = "최종 관리자(super-admin)로서 cross-instance 운영에 필요한 비즈니스 entity 도입". ADMIN_PERMISSION_SEPARATION v1 (R1·R2) cycle 직후 후속 — 3 신규 entity 합류.

## SoT

- 사용자 진단 (2026-05-27) — "/admin 안 super-admin 으로서 확인할 정보 검토" 결과 신규 entity 3종 도입 결정 (계약/구독 status · 운영 contact · last_login 추적).
- 기존 정합:
  - `clinic_profile.policy_contact_*` (의료법 정책 안내용) → 운영용 contact 와 의미 분리 필요
  - `admin_user` schema (session table 안 created_at 추정 가능하나 명시적 last_login 컬럼 없음)
  - `/admin` page 안 KpiBanner + InstanceCard HealthIndicators (직전 ADMIN_PERMISSION_SEPARATION v1 § R2 cycle)
  - `instance` table 안 별 contract/billing 데이터 없음
- 본 plan 외부 정합:
  - REVIEW_WORKFLOW · IMPROVEMENT_QUEUE 안 운영 정합 — contract status terminated/suspended 시 운영 자동화 영향 가능 (별 cycle 결정)
  - audit_event 안 신규 event type — `contract-changed` · `contact-updated` · `last-login` (last_login 은 audit 미emit 권장 — 빈도 너무 높음)

## 1. 목적과 범위

### 1.1 목적

- super-admin 가 cross-instance 운영 시 비즈니스 status (계약·구독·contact·휴면 사용자) 를 한 번에 파악
- 의료법 정책 정합 (policy_contact_*) 과 운영 contact (primary_contact_*) 의 의미 분리
- 클라이언트 휴면 식별 (last_login_at 30일 + 신호)

### 1.2 범위 (v1 — 본 cycle 포함)

| § | 항목 | 비고 |
|---|---|---|
| 2 | `instance_contract` entity 신규 (C0044) | status + plan_tier + billing_cycle + amount_krw + dates + notes + holder |
| 3 | `clinic_profile` 안 primary_contact 4 컬럼 (C0045) | name · phone · email · role |
| 4 | `admin_user.last_login_at` 컬럼 (C0046) | TIMESTAMPTZ NULL |
| 5 | drizzle schema.ts 업데이트 | 3 entity |
| 6 | `/admin/<slug>/contract` CRUD UI | super-admin only |
| 7 | ClinicProfileForm 안 primary_contact 4 필드 | operator 도 편집 가능 |
| 8 | magic-link consume + session refresh 시점 last_login_at UPDATE | packages/auth 안 |
| 9 | `/admin` dashboard 안 contract 합류 | KpiBanner 안 "계약 만료 임박" · InstanceCard 안 status pill |
| 10 | NavMenu setup 그룹 안 "계약" link | super-admin only |

### 1.3 비범위 (v1.x DEFER)

- ABE-DEFER-01: instance_contract 안 invoice 이력 (별 entity `contract_invoice`)
- ABE-DEFER-02: payment_method · auto_renewal · cancel_at_period_end 등 풀 billing 필드
- ABE-DEFER-03: multiple contact 1:N entity (현재 1:1 컬럼 — 대표자만)
- ABE-DEFER-04: 계약 만료 알림 (이메일/슬랙 outbound) — notifications-outbox 합류 별 cycle
- ABE-DEFER-05: admin_user 의 login 이력 시계열 (`admin_user_login_log` table) — last_login_at 만 보존
- ABE-DEFER-06: instance_membership 별 last_active (membership-level activity)
- ABE-DEFER-07: contract status 변경 시 클라이언트 어드민 접근 자동 차단/제한 (terminated 시 read-only mode 등)

## 2. instance_contract (C0044)

### 2.1 schema

```sql
CREATE TABLE instance_contract (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id     UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  status          TEXT NOT NULL,
  plan_tier       TEXT NOT NULL,
  billing_cycle   TEXT NOT NULL,
  amount_krw      INTEGER NOT NULL DEFAULT 0,
  start_date      DATE NOT NULL,
  end_date        DATE,
  contract_holder_name   TEXT,
  contract_holder_email  TEXT,
  notes           TEXT NOT NULL DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT instance_contract_status_enum CHECK (status IN ('trial','active','suspended','terminated')),
  CONSTRAINT instance_contract_plan_tier_enum CHECK (plan_tier IN ('starter','standard','pro','custom')),
  CONSTRAINT instance_contract_billing_cycle_enum CHECK (billing_cycle IN ('monthly','yearly','custom')),
  CONSTRAINT instance_contract_amount_nonneg CHECK (amount_krw >= 0),
  CONSTRAINT instance_contract_dates_order CHECK (end_date IS NULL OR end_date >= start_date),
  CONSTRAINT instance_contract_unique UNIQUE (instance_id)
);

CREATE INDEX instance_contract_status_idx ON instance_contract (status);
CREATE INDEX instance_contract_end_date_idx ON instance_contract (end_date) WHERE end_date IS NOT NULL;
```

- **unique (instance_id)** — 1 instance = 1 active contract (v1 단순 모델). 계약 갱신 시 update_at 만 갱신 · 이력 X (ABE-DEFER-01)
- **RLS**: 본 table 은 **super-admin only** 작업이라 tenant_isolation policy 미적용. admin role 직접 조회 (raw sql).
  - 또는 RLS + super-admin context bypass (CLAUDE.md 안 raw sql 패턴 답습)
  - 본 plan 권장: **RLS 미적용** (admin only · cross-instance · /admin context)

### 2.2 status·plan_tier·billing_cycle enum 값

| status | 의미 |
|---|---|
| `trial` | 무료 체험 |
| `active` | 정상 운영 |
| `suspended` | 일시 정지 (미결제 등) |
| `terminated` | 종료 (계약 해지) |

| plan_tier | 의미 |
|---|---|
| `starter` | 기본 |
| `standard` | 표준 |
| `pro` | 전문 |
| `custom` | 별도 협의 |

| billing_cycle | 의미 |
|---|---|
| `monthly` | 월 결제 |
| `yearly` | 연 결제 |
| `custom` | 별 협의 |

### 2.3 UI

- **신규 페이지** `/admin/<slug>/contract` — super-admin only · 8 필드 form
- **operator 진입 시** — "권한 필요" 안내 (사이트별 dashboard 클론 page 와 동일 패턴)
- form 내용:
  - status (select)
  - plan_tier (select)
  - billing_cycle (select)
  - amount_krw (integer)
  - start_date (date)
  - end_date (date · nullable)
  - contract_holder_name (text)
  - contract_holder_email (text · email regex)
  - notes (textarea)

### 2.4 dashboard 합류

- `/admin` KpiBanner — "계약 만료 임박 (30일 안)" 카드 추가 (alert tier)
- `/admin` InstanceCard — status pill 추가 (active=green · trial=blue · suspended=amber · terminated=rose)

## 3. clinic_profile 안 primary_contact (C0045)

### 3.1 schema

```sql
ALTER TABLE clinic_profile
  ADD COLUMN primary_contact_name  TEXT NOT NULL DEFAULT '',
  ADD COLUMN primary_contact_phone TEXT NOT NULL DEFAULT '',
  ADD COLUMN primary_contact_email TEXT NOT NULL DEFAULT '',
  ADD COLUMN primary_contact_role  TEXT NOT NULL DEFAULT '';

ALTER TABLE clinic_profile
  ADD CONSTRAINT clinic_profile_primary_contact_name_len  CHECK (char_length(primary_contact_name)  <= 100),
  ADD CONSTRAINT clinic_profile_primary_contact_phone_len CHECK (char_length(primary_contact_phone) <= 40),
  ADD CONSTRAINT clinic_profile_primary_contact_email_len CHECK (char_length(primary_contact_email) <= 200),
  ADD CONSTRAINT clinic_profile_primary_contact_role_len  CHECK (char_length(primary_contact_role)  <= 80);
```

### 3.2 의미 분리

| 컬럼 | 용도 |
|---|---|
| `policy_contact_*` (기존) | 의료법 시행령 안 정책 안내 contact (개인정보 책임자 · 외부 공개 · clinic_profile 안 표시 가능) |
| `primary_contact_*` (신규) | 운영자 ↔ 클라이언트 일상 contact (전화·카톡·이메일 · 외부 비공개 · admin 내부 만) |

### 3.3 UI

- ClinicProfileForm 안 **신규 section** "운영 contact (운영자 전용)" — policy_contact_* 와 시각 분리
- 4 필드 — name · phone · email · role (예: "대표원장 · 실무자 · 디자이너")
- operator 도 편집 가능 (자기 사이트의 contact 정보는 자기가 입력)
- 단 site 안 공개 노출 X — clinic_profile.tsx db-projection 안 미포함

## 4. admin_user.last_login_at (C0046)

### 4.1 schema

```sql
ALTER TABLE admin_user
  ADD COLUMN last_login_at TIMESTAMPTZ NULL;

CREATE INDEX admin_user_last_login_idx ON admin_user (last_login_at DESC NULLS LAST);
```

### 4.2 update 시점

- **magic-link consume** (`/sign-in/consume`) — magic link click 시 session 생성 시점에 update
- **session refresh** (sessionRefreshInterval 안 자동 갱신) — packages/auth/src/resolve-tenant-context.ts:151 안 refreshSessionByDbToken 호출 시점에 update

### 4.3 노출

- v1 안 직접 UI 노출 없음 (instance_membership 일람 UI 없음)
- v1.2 cycle (`/admin/super/users`) 합류 시 활용
- 단 본 cycle 안 InstanceCard 안 "(클라이언트) 최근 로그인 N일 전" mini text 추가 — operator membership 의 admin_user 의 last_login_at MAX 합산 (휴면 클라이언트 식별)
- 정합 — admin role 직접 query · instance_membership LEFT JOIN admin_user · MAX(last_login_at)

## 5. drizzle schema.ts 업데이트

- `packages/core-content/src/schema.ts` 안 `instanceContract` 신규 table
- `clinicProfile` 안 4 컬럼 추가
- `adminUser` 안 `lastLoginAt` 추가
- migration 정의는 SQL 파일 (manifest 외 등록 — 직전 C0021~C0029 패턴)

## 6. /admin dashboard 합류

### 6.1 super-admin-overview.ts 안 contract 데이터

- 신규 query — instance_contract 안 status + end_date per instance
- helper — `isExpiringSoon(endDate, days=30)` (today + 30일 안 만료)
- per-instance InstanceOverview 안 `contract: { status; planTier; endDate } | null` 추가
- totals 안 `contractExpiringSoonCount` · `contractTerminatedCount`

### 6.2 KpiBanner 안 카드 신규

- "계약 만료 임박 (30일)" — alert tier 시 N건
- 단 4 → 5 카드 (UI grid lg:grid-cols-4 → lg:grid-cols-5 또는 두 줄)
- 권장 — lg:grid-cols-5 + 모바일 grid-cols-2 정합

### 6.3 InstanceCard 안 status pill

- 신규 pill — contract status (active/trial/suspended/terminated/없음)
- 색 코드 — active=emerald · trial=sky · suspended=amber · terminated=rose · 없음=neutral

## 7. NavMenu

- setup 그룹 안 "계약" link 추가 (super-admin only)
- 또는 super-admin only segment 안 그룹 시작 (instance level 안 super-admin 도구 일관성)
- 권장 — setup 그룹 안 superAdminOnly 합류 (사이트 복제 link 와 동일 패턴)

## 8. 검증

### 8.1 typecheck + vitest + build

- 본 cycle 변경 후 모두 PASS 필수
- vitest 안 contract / contact 별 단위 테스트는 v1.x 합류 (현재는 manual 시각 검수)

### 8.2 마이그레이션 적용

- prod 마이그레이션은 사용자 별 step:
  - `pnpm --filter @glitzy/web run-sql apps/web/scripts/migrate-business-entities.sql`
  - 또는 manifest 안 등록 후 `pnpm migrate-late` (직전 C0021~C0029 정합)
- 본 plan 권장 — **manifest 외 등록 + run-sql script 안 통합 SQL 파일** (C0021~C0029 패턴)

### 8.3 시각 검수 권장 경로

1. super-admin `/admin/<slug>/contract` 진입 → 8 필드 form
2. operator `/admin/<slug>/contract` 진입 → "권한 필요" 안내
3. `/admin` 안 KpiBanner 안 "계약 만료 임박" 카드 (contract 데이터 있을 시)
4. InstanceCard 안 contract status pill + 최근 로그인 mini text
5. ClinicProfileForm 안 운영 contact section 안 4 필드

## 9. ABE-DEFER 목록

| ID | 항목 | 비고 |
|---|---|---|
| ABE-DEFER-01 | contract_invoice (이력) | 별 entity · invoice별 amount/issued_at/paid_at |
| ABE-DEFER-02 | 풀 billing 필드 | payment_method · auto_renewal · cancel_at_period_end |
| ABE-DEFER-03 | multiple contact 1:N | instance_contact entity 별도 |
| ABE-DEFER-04 | 계약 만료 알림 (outbound) | notifications-outbox 합류 |
| ABE-DEFER-05 | admin_user login 시계열 | admin_user_login_log table |
| ABE-DEFER-06 | instance_membership last_active | membership-level activity tracking |
| ABE-DEFER-07 | contract status 기반 자동 access 제한 | terminated 안 read-only mode 등 |
| ABE-DEFER-08 | contract change audit_event emit | audit_event 안 contract-changed event_type |

## 10. 수용 기준

1. 3 신규 entity 의 schema 가 정확히 정의 + RLS · CHECK · index 정합
2. `/admin/<slug>/contract` CRUD UI 안 super-admin only · operator 시 안내
3. ClinicProfileForm 안 4 신규 필드 form 안 정상 동작
4. magic-link consume + session refresh 시점 안 last_login_at UPDATE 적용
5. `/admin` dashboard 안 contract 합류 (KpiBanner + InstanceCard pill)
6. NavMenu setup 그룹 안 "계약" link super-admin only
7. typecheck + vitest + build PASS
