# ADMIN_PERMISSION_SEPARATION_PLAN (v1.0·acceptance·2026-05-27)

> **상태**: **v1.0 (acceptance)** — 사용자 의도 = "운영자(super-admin = 본인) ↔ 웹사이트 관리자(클라이언트 = operator role) 권한 분리". 매일 노출 view 안 즉시 효과 큰 핵심 v1 + instance/admin_user/membership 관리 UI v1.1/v1.2 단계 명시.

## SoT

- 사용자 진단 (2026-05-27) — 본 cycle 직전 ADMIN_SIMPLIFY v2 cycle (단순화) 후 "권한 분리 구조 우선" 결정.
- 기존 권한 시스템:
  - `packages/auth/src/resolve-tenant-context.ts:13-31` 안 `TenantContext` — `userId · email · instanceId · role · isSuperAdmin · sessionToken · user`
  - `packages/auth/src/resolve-tenant-context.ts:194-198` 안 `ActionType` 14 enum — operator-publish/unpublish/edit-content + 11 reviewer action
  - `admin_user.is_super_admin` boolean — flag (membership 없이 모든 instance 접근 + 모든 14 action 통과)
  - `instance_membership.role` 4 enum — `operator · legal-reviewer · physician-reviewer · client-approver`
- 본 plan 외부 plan 안 보존되어야 하는 정합:
  - SEO_VISIBILITY_OPS · NAVER_SEARCH_INGEST 안 super-admin 권한 분기 (이미 적용)
  - REVIEW_WORKFLOW 안 14 action eligibility (기존 유지)

> **표기 규칙**: 사용자 표시 = "운영자(나)" = super-admin, "관리자(클라이언트)" = operator. 내부 코드 = `ctx.isSuperAdmin` · `ctx.role === "operator"`.

## 1. 목적과 범위

### 1.1 목적

- super-admin (본인) 만 사용 가능한 instance 단위/시스템 관리 작업과, operator (클라이언트) 의 일상 콘텐츠 관리 작업을 명확히 분리
- 클라이언트 어드민 UI 안 super-admin 전용 기능 노출 차단 (혼란 회피 · 사고 차단)
- 서버 액션 단위 권한 enforcement (UI hide 만으로 보안 보장 X · server-side 가드 필수)

### 1.2 범위 (v1 — 본 cycle 포함)

| § | 항목 | 비고 |
|---|---|---|
| 2 | 권한 매트릭스 정의 | super-admin vs operator vs reviewer 별 가능 작업 정리 |
| 3 | clone-actions super-admin enforcement | `ctx.isSuperAdmin` 가드 server + lib 양쪽 |
| 4 | NavMenu 안 super-admin only item visibility | "사이트 복제" link operator 안 hide · isSuperAdmin prop 전달 |
| 5 | dashboard 안 super-admin tier 분리 | super-admin only widget (예: instance 일람 link · 시스템 setup checklist) |
| 6 | property CRUD 권한 (이미 적용 — 확인) | sync-actions · VisibilityMetricsView 안 이미 isSuperAdmin 분기 |
| 7 | review-queue 정합 확인 | 현재 NavMenu hide 상태 (즉시 발행 모드) · 별 변경 없음 |

### 1.3 범위 (v1.1 — instance UI · 별 cycle)

| § | 항목 | 비고 |
|---|---|---|
| 8 | `/admin/super/instances` 신규 — instance 일람 + 생성 form | super-admin only · 현재 `pnpm web:seed` CLI 대체 |
| 9 | instance 생성 server action | `instance` table insert + 기본 `clinic_profile`/`location_profile` skeleton + audit_event |
| 10 | instance 비활성/삭제 (soft delete) | 콘텐츠 보존 + active=false |

### 1.4 범위 (v1.2 — admin_user/membership UI · 별 cycle)

| § | 항목 | 비고 |
|---|---|---|
| 11 | `/admin/super/users` 신규 — admin_user 일람 + 초대 form (이메일) | magic link 통합 (signed token 생성 + 발송) |
| 12 | `/admin/super/users/[id]/memberships` — instance 별 role 부여 | operator/legal-reviewer/physician-reviewer/client-approver 4 role |
| 13 | super-admin flag toggle | 본인 외 super-admin 추가/취소 · 단 자기 자신 super-admin 취소 차단 |

### 1.5 비범위 (DEFER · 본 plan 외)

- ADP-DEFER-01: 본인 외 운영자 안 다른 운영자 instance switching UI (super-admin 만 가능 · operator 자기 instance 만)
- ADP-DEFER-02: 권한 변경 후 기존 session 무효화 (현재 session refresh 안 자동 재검증 — 즉시 반영 정도 confirm)
- ADP-DEFER-03: instance 별 role 안 `client-approver` 활용 (현재 미사용 — REVIEW_WORKFLOW v2 안 합류 시점)
- ADP-DEFER-04: super-admin 의 emergency operator 가장 (impersonate) 모드
- ADP-DEFER-05: 권한 변경 audit log view UI (audit_event 안 이미 emit · view 별 cycle)

## 2. 권한 매트릭스

### 2.1 일상 콘텐츠 관리 (operator + super-admin 둘 다 가능)

| 작업 | 진입 | 비고 |
|---|---|---|
| 의료진 · 시술 · 증상 · 아티클 · FAQ · 논문 · 미디어 CRUD | NavMenu 콘텐츠 그룹 | 매일 작업 |
| 키워드 매핑 · 근거 연결 | `/admin/<slug>/keywords` · entity edit 안 EvidenceLinkPanel | operator 도 가능 |
| 개선 큐 · 캘린더 · 검색 노출 sync · 대시보드 | NavMenu 운영 일상 그룹 | 매일 점검 |
| LLM 호출 (AI 메타 추천 · 키워드 추천 · 검수 코멘트) | 3 진입점 | per-instance daily cap 안 |

### 2.2 instance 단위 관리 (super-admin only)

| 작업 | 진입 | 가드 |
|---|---|---|
| 사이트 복제 (instance 생성의 유일한 UI 경로) | `/admin/<slug>/clone` | server action 안 `ctx.isSuperAdmin` 가드 · NavMenu hide |
| GSC/NSA property add/verify/delete | `/admin/<slug>/visibility-metrics` 안 form | sync-actions 안 이미 가드 (이미 적용) · UI 안 이미 분기 |
| instance 생성 (v1.1) | `/admin/super/instances` | super-admin only |
| instance 비활성/삭제 (v1.1) | 동상 | 동상 |

### 2.3 시스템 단위 관리 (super-admin only · v1.2)

| 작업 | 진입 | 가드 |
|---|---|---|
| admin_user 초대 · 활성화/비활성화 | `/admin/super/users` | super-admin only |
| instance_membership 부여 · 취소 | `/admin/super/users/<id>/memberships` | 동상 |
| super-admin flag toggle | 동상 | super-admin only · 자기 자신 차단 |

### 2.4 검수자 작업 (reviewer role 만 · eligibility flag 필수)

| 작업 | role | flag |
|---|---|---|
| 의료법 검수 (legal-review-*) | legal-reviewer | `legal_reviewer_eligible=true` |
| 의료 콘텐츠 검수 (physician-review-*) | physician-reviewer | `physician_reviewer_eligible=true` |
| 클라이언트 승인 (client-approval-*) | client-approver | `client_approver_eligible=true` |

> 현재 REVIEW_WORKFLOW 즉시 발행 모드 (CLAUDE.md 안 명시) — review-queue NavMenu hide. 본 plan 안 검수자 role UI 분리는 v2 (REVIEW_WORKFLOW 재활성화) 합류 시 plan 수립.

## 3. clone-actions super-admin enforcement (v1)

### 3.1 서버 가드 위치

- `apps/web/src/app/(admin)/admin/[instanceSlug]/clone-actions.ts:21` 안 `cloneInstanceAction` 진입 직후 `pageCtx.ctx.isSuperAdmin` 가드 추가
- `apps/web/src/lib/admin/clone-instance.ts` (cloneInstance 본체) 안에도 이중 가드 — server action 우회 회피 (RSC + server action 안 lib 직접 호출 잠재 risk)
- 가드 실패 시 `{ ok: false, reason: "super-admin-required" }` 응답 · audit_event emit (이벤트 타입 = `permission-denied` · payload = `{ action: "clone-instance", role: ctx.role }`)

### 3.2 UI

- 본 cycle § 4 안 NavMenu hide + `/admin/<slug>/clone` page 진입 시 operator 안 "권한 없음" 안내 (server-side check + early return)
- 단 page 자체 진입은 막지 않음 (URL 직접 입력 시 안내 UI · 가드 실패 위치 통일)

## 4. NavMenu 안 super-admin only item visibility (v1)

### 4.1 isSuperAdmin prop 전달 경로

- `NavMenu` 가 client component (`"use client"`) → server-side context 직접 fetch 불가 → props 필요
- `(admin)/admin/[instanceSlug]/layout.tsx` (server) 안 `requirePageContext(instanceSlug)` 호출 → `ctx.isSuperAdmin` 추출 → `<NavMenu isSuperAdmin={...} />` props 전달
- `(admin)/layout.tsx` (instance 없는 root) 안 NavMenu mount 위치 변경 또는 그대로 유지 (현재는 `(admin)/layout.tsx:45` 안 mount)
- **변경**: NavMenu 를 `(admin)/admin/[instanceSlug]/layout.tsx` 안 mount 로 이동 (instance context 안 super-admin 분기) · root admin layout 안 mount 제거
  - 또는 `(admin)/admin/[instanceSlug]/layout.tsx` 가 NavMenu prop 전달 wrapper 만 mount

### 4.2 super-admin only item

- "사이트 복제" link — `group: "setup"` 안 — `isSuperAdmin === false` 시 hide
- 향후 추가 가능 항목 (v1.1/v1.2 cycle 안 합류):
  - `/admin/super/instances` (v1.1)
  - `/admin/super/users` (v1.2)

### 4.3 review-queue 정합

- 현재 NavMenu 안 review-queue 미노출 (즉시 발행 모드 · CLAUDE.md 안 사용자 검수 2026-05-20)
- 본 plan 안 변경 없음
- 추후 REVIEW_WORKFLOW 재활성화 시 reviewer role 별 가시 분리 plan 별 cycle

## 5. dashboard 안 super-admin tier 분리 (v1)

### 5.1 super-admin only widget

- `SuperAdminSetupCard` 신규 (`components/admin/SuperAdminSetupCard.tsx`)
  - 현재 instance 안 property 미등록 시 안내 ("GSC/NSA property 가 없습니다 → 검색 노출 > 등록")
  - 다른 instance 일람 (v1.1 안 `/admin/super/instances` mount 시 합류)
  - lightweight `instance` count + 현재 instance name
- mount 위치: 대시보드 안 TodayActionsCard 다음, 빠른 작업 카드 이전 (super-admin 시만)

### 5.2 client (operator) tier

- 변경 없음. 기존 view 그대로 유지

## 6. property CRUD 권한 (이미 적용)

- audit 결과:
  - `apps/web/src/app/(admin)/admin/[instanceSlug]/visibility-metrics/sync-actions.ts` 안 addSearchProperty (line 143) · verifySearchProperty (line 214) · deleteSearchProperty (line 293) 모두 `ctx.isSuperAdmin` 가드 적용
  - `apps/web/src/components/admin/visibility/VisibilityMetricsView.tsx` 안 AddPropertyForm (line 315) · verify/delete button (line 258·293) 모두 `isSuperAdmin` 분기
- 본 cycle 변경 없음 — v1 acceptance criteria 자동 충족

## 7. review-queue 정합 (이미 hide)

- 현재 NavMenu 안 review-queue 미노출 (`NavMenu.tsx:111` comment 안 명시 — "categories · review-queue menu 안 hide (즉시 발행 모드)")
- 본 cycle 변경 없음

## 8. v1.1 — instance UI (별 cycle)

### 8.1 페이지 구조

```
/admin/super              ← super-admin 진입점 (instance 일람)
/admin/super/instances    ← 생성 + 일람 + 비활성/활성 toggle
/admin/super/instances/[id]  ← 상세 (member 일람 + 콘텐츠 통계 + soft-delete)
```

- 상위 layout (`(admin)/admin/super/layout.tsx`) 안 `ctx.isSuperAdmin === false` 시 403 redirect

### 8.2 instance 생성 server action

- input: `slug` · `displayName` · `address` (default empty) · 옵션으로 source instance slug (선택 시 clone)
- internal step:
  1. `instance` insert
  2. `clinic_profile` (slug='clinic') skeleton insert (empty metadata · name=displayName)
  3. `location_profile` (slug='main') skeleton insert
  4. 5 LegalDocument (privacy · terms · non-covered · refund · complaint) skeleton insert (status=draft · 자동 발행은 사용자 검토 후)
  5. audit_event emit (event=`instance-created` · payload={ instanceId, sourceInstanceId, actorId })
- 자체 transaction · withSkeletonTx 안 super-admin scope (selectedInstanceId 임시 set 후 작업 · rollback safe)

### 8.3 instance 비활성/soft-delete

- `instance.active = false` (column 신규 — 현재 schema 안 active 있나 확인 필요 · 없으면 마이그레이션)
- public site 안 active=false 시 404 (resolver 안 분기)
- audit_event emit (event=`instance-deactivated`)

## 9. v1.2 — admin_user/membership UI (별 cycle)

### 9.1 페이지 구조

```
/admin/super/users         ← 일람 + 초대 form
/admin/super/users/[id]    ← 상세 (eligibility flag + memberships + super-admin toggle)
```

### 9.2 admin_user 초대

- 운영자(super-admin)가 이메일 입력 → magic link 발송 (기존 sign-in flow 와 동일)
- 본인이 첫 매직링크 클릭 시 admin_user row 자동 생성 (`active=true`)
- 또는 직접 row insert + `pending=true` 패턴 — UX 검토 후 결정

### 9.3 instance_membership 부여

- target admin_user + target instance + role (4 enum) → row insert
- 동일 (user, instance) 안 row 1개만 (unique constraint · 이미 schema 안 정합)
- eligibility flag 필요한 role (legal-reviewer 등) 자동 fail — 명시 안내

### 9.4 super-admin flag toggle

- `admin_user.is_super_admin` 변경
- 자기 자신 super-admin 취소 차단 (server 가드 · UI disabled)
- 변경 시 audit_event emit + 기존 session 안 즉시 효과는 sessionRefreshInterval 안 갱신 (별 ADP-DEFER-02)

## 10. 마이그레이션

### 10.1 v1 (본 cycle)

- DB 변경 없음. 모든 가드는 application layer 안 처리

### 10.2 v1.1 (별 cycle)

- `instance.active` column 안 NOT NULL DEFAULT TRUE 추가 (현재 schema 확인 후)
- audit_event 안 신규 event type 추가 (`instance-created · instance-deactivated · permission-denied`)

### 10.3 v1.2 (별 cycle)

- 변경 없음 (기존 admin_user · instance_membership table 활용)

## 11. 검증

### 11.1 server-side 가드 시나리오 (vitest 권장 · 본 cycle 안 신규 fixture)

- operator session 안 cloneInstanceAction → `{ ok: false, reason: "super-admin-required" }`
- super-admin session 안 cloneInstanceAction → 정상
- audit_event 안 `permission-denied` 1건 emit (operator 시도 시)

### 11.2 UI 시각 검수

- super-admin session 시 NavMenu 안 "사이트 복제" 노출
- operator session 시 NavMenu 안 "사이트 복제" 숨김
- 대시보드 안 SuperAdminSetupCard 가시 분기 동상

### 11.3 typecheck + build

- `pnpm exec tsc --noEmit` PASS
- `pnpm web:build` PASS
- vitest 전체 PASS (slugify SLG-02 pre-existing 1 fail 무관)

## 12. ADP-DEFER 목록

| ID | 항목 | 비고 |
|---|---|---|
| ADP-DEFER-01 | super-admin 의 다른 운영자 instance switching UI | 현재는 super-admin 만 모든 instance · operator 는 자기 instance · UI X |
| ADP-DEFER-02 | 권한 변경 후 기존 session 무효화 | sessionRefreshInterval 만 — 즉시 무효화 X |
| ADP-DEFER-03 | client-approver role 활용 | REVIEW_WORKFLOW v2 합류 시 |
| ADP-DEFER-04 | super-admin emergency operator 가장 (impersonate) | 별 cycle |
| ADP-DEFER-05 | 권한 변경 audit log view UI | audit_event 안 emit 됨 · view 별 cycle |
| ADP-DEFER-06 | instance soft-delete 후 hard-delete | 콘텐츠 archive + 제거 정책 별 cycle |
| ADP-DEFER-07 | 다중 super-admin 안 lock 정책 | 동시 instance 작업 시 race · 별 cycle |
| ADP-DEFER-08 | super-admin 의 cross-instance 통계 view | 모든 instance 의 KPI 합산 dashboard 별 cycle |

## 13. 수용 기준 (acceptance criteria)

### 13.1 v1 (본 cycle 안 충족)

1. clone-actions / clone-instance lib 안 super-admin 가드 — operator 가 cloneInstanceAction 직접 호출 시 deny
2. NavMenu 안 isSuperAdmin prop 전달 + "사이트 복제" link operator 안 hide
3. 대시보드 안 SuperAdminSetupCard super-admin 만 노출
4. property CRUD 가드 audit 결과 명시 (이미 적용 · 추가 변경 없음)
5. review-queue NavMenu hide 상태 명시 (이미 hide · 변경 없음)
6. typecheck + vitest + web:build PASS

### 13.2 v1.1 (별 cycle)

- instance 생성/비활성/일람 UI 안 super-admin only
- audit_event 안 instance-created · instance-deactivated emit

### 13.3 v1.2 (별 cycle)

- admin_user 초대 + super-admin flag toggle + membership 부여 UI
- 본인 super-admin 취소 차단
