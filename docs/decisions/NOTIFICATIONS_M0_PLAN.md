# notifications M0 vertical slice plan (v1.0·acceptance·2026-05-19)

> **상태**: **v1.0 (acceptance)** — Codex self-critique **5 cycle 40 findings 전건 수용** · cycle 5 closeableAfterPatch=true 확정 (blocking 0 · major 0 · minor 5 잔존 표현/정합 patch 모두 흡수). 수렴 추세 **16 → 12 → 11 → 6 → 5**. compliance-assistant M0 v1.0 acceptance 패턴 답습. `LL-DEFER-01` admin scope 완전 해소 + `CA-DEFER-14` 부분 해소 (envelope persist + 4 eventType emit) 목적. notifications Feature 본 구현 (11 tables · channel adapter · digest · suppression · DLQ · broadcast) 은 별 cycle (NF-DEFER-01).

> **acceptance commit 구성 (compliance-assistant M0 v1.0 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan v1.0 · (2) NF-CASCADE-01 REVIEW_WORKFLOW § 9 M0 활성화 marker (4 active eventType + 1 enum 등록만) · (3) NF-CASCADE-02 LOCATION_LEGAL_PLAN LL-DEFER-01 **admin scope 완전 해소** marker · (4) NF-CASCADE-03 COMPLIANCE_ASSISTANT_M0_PLAN CA-DEFER-14 **부분 해소** marker · (5) NF-CASCADE-04 DATA_MODEL C-10 metadata 슬롯 `submitterUserId` 키 marker · (6) NF-CASCADE-05 manifest **20 단계** marker · (7) NF-CASCADE-06 REVIEW_WORKFLOW § 10.2.1 audit eventType `notification-envelope-enqueued` marker · (8) NF-CASCADE-07 packages/notifications-outbox v0.2 Spike B 패턴 통합 전략 marker. 실 SQL 코드 cascade 는 별 cycle (notifications M0 code v1.0).

> **본 plan 의 위상 명시**: 본 plan 은 compliance-assistant M0 v1.0 § 9.2 안 `CA-DEFER-14 (NotificationEvent envelope · LL-DEFER-01 의 알림 부분)` 의 vertical slice 1차 해소. envelope shape + 단일 outbox 테이블 persist + 4종 eventType emit + recipients fan-out 까지 다룬다. **channel adapter (email/slack/inApp) · digest · suppression · DLQ · broadcast · in-app inbox · worker harness 는 본 plan 의 비범위** — notifications Feature 본 구현 별 cycle (NF-DEFER-01).

## SoT

- `docs/features/notifications.md` v1.0 — Feature spec (§ 3 notify() · § 4 발송 파이프라인 · § 14 11 tables · § 9 운영 메트릭). **본 plan 의 envelope shape SoT** — § 9.2 `NotificationEvent` 그대로 운영. **본 plan 의 idempotency SoT** — § 9.2.1 `sourceEventId` 권장 패턴 `sha256(eventType + contentRef + workflowTransitionTimestamp)`.
- `docs/admin/REVIEW_WORKFLOW.md` — § 9 알림 인터페이스·정책 SoT · § 9.1 NotificationEventType enum (46종 풀 enum) · § 9.1.1 매트릭스 (수신자·즉시 채널·fallback·digest·criticality·quietHoursPolicy·optOutPolicy) · § 9.2 NotificationEvent/Payload · § 10.2.1 AuditAction enum (`notification-dispatched`).
- `docs/core/DATA_MODEL.md` — C-23 AdminUser (`active`·`is_super_admin`·`legal_reviewer_eligible`·`physician_reviewer_eligible`·`client_approver_eligible`) + instance_membership (`role` 4종 `operator`·`physician-reviewer`·`legal-reviewer`·`client-approver`) · C-08 InstanceManifest (`notificationChannels` — M0 v0.1 비합류 marker만).
- `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 — `CA-DEFER-14` 의 본 plan 매핑 · § 6.2 audit emit 4종 (`content-submitted-for-review`·`content-approved`·`content-rejected`·`content-published`) — 본 plan 의 NotificationEvent emit 시점 정합.
- `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md` v1.0 — § 12 `enqueueContentGateIfNeeded` (CA-DEFER-15 부분 해소) — 본 plan 의 `content-gate-queued` 발송 시점 정합 (`apps/web/src/lib/compliance/auto-gate.ts`).
- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — `LL-DEFER-01` 의 NotificationEvent envelope 부분 (본 plan 으로 완전 해소). § 2 비범위 표 cascade.
- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 — audit_event matrix · emit 시점 정책 (tx commit 후 base role) · 실패 정책 (try/catch + console.error) — 본 plan 의 NotificationEvent emit 정합.
- 기존 packages 실 시그니처:
  - `packages/auth/src/audit.ts` (`emitAuditEvent` 패턴)
  - `packages/auth/src/resolve-tenant-context.ts` (TenantContext shape)
  - `packages/db/src/scoped-tx.ts` (`ScopedTx`·`withTenantTransaction` 패턴)
  - `apps/web/src/lib/compliance/server-actions.ts` (4 server action · submitForReview/approveContent/rejectContent/publishContent)
  - `apps/web/src/lib/compliance/entity-actions.ts` + `apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts` (tx commit 후 base role emit 패턴)
  - `apps/web/src/lib/compliance/auto-gate.ts` (content-gate 자동 큐 진입 helper)
  - `packages/notifications-outbox/src/outbox.ts` v0.2 (Spike B 패턴 — claim/SKIP LOCKED 향후 worker 합류 시 재사용 marker)

> **표기 규칙**: SQL/DB 컬럼 = snake_case · TypeScript 코드 = camelCase · 문서 본문 내 SoT 인용은 snake_case 우선. 동일 개념 매핑: `source_event_id` (DB) ↔ `sourceEventId` (TS).

## 1. 목적과 범위

### 1.1 목적

- **LL-DEFER-01 완전 해소**: LegalDocument 발행 게이트의 4단계 중 잔존 envelope 발송. `legalCounsel`/`legalCounselAt` 강제 (compliance-assistant M0 DB CHECK) · `review-queued` 전이 (compliance-assistant M0 server action) · `ComplianceRecord pre-publish` (compliance-assistant M0) · `status=published` (compliance-assistant M0 publishContent) 이미 완료. 본 plan 이 마지막 잔존인 **`NotificationEvent envelope` 발송**을 추가하여 LL-DEFER-01 의 4단계 모두 완료.
- **CA-DEFER-14 부분 해소**: notifications Feature 의 vertical slice 1차 — envelope 영속 + 4 eventType emit + recipients fan-out 기본형. 본 plan 의 outbox 테이블 + emit helper 가 향후 notifications Feature 본 구현 (NF-DEFER-01) 의 입력 채널이 되거나 Receipt/Log/PayloadRecord 로 마이그레이션될 수 있도록 envelope shape SoT (REVIEW_WORKFLOW § 9.2) 그대로 직렬화.
- **emit 4종 eventType M0 활성**: REVIEW_WORKFLOW § 9.1.1 매트릭스에서 본 cycle 적용 대상은 **`reviewer-approved`·`reviewer-rejected`·`publish`·`content-gate-queued` 4종**. M0 의 audit emit 패턴 (compliance-assistant M0 § 6.2) 정합 — tx commit 후 base role · try/catch fallback. **`content-submitted-for-review` 는 NotificationEventType 미정의** (§ 9.1 enum 부재 — 운영자 본인 액션은 자기 자신에게 알릴 필요 없음 운영 결정) → NotificationEvent 발송 안 함.
- **채널 라우팅·digest·suppression·DLQ·broadcast 미합류 marker**: envelope.metadata 안 § 9.1.1 매트릭스 정책 (criticality·immediateChannels·digestCadence·quietHoursPolicy·optOutPolicy) **표기는 함** — 실 채널 발송·digest 묶음·suppression 필터·broadcast 모드는 NF-DEFER-01 (notifications Feature 본 구현).
- **운영자 수동 발송·DLQ resend UI 미합류**: NF-DEFER-04 (worker harness 합류 시).

### 1.2 범위 (포함)

| 항목 | 비고 |
|---|---|
| C0020 `notification_outbox` 신규 table (NF-SCHEMA-01) | envelope persist + idempotent insert. `UNIQUE(instance_id, source_event_id)` · RLS · GRANT app_tenant_user. `status` 컬럼 (`pending`/`completed`/`deduped`) v0.1 — M0 worker 없음 (NF-DEFER-04) 으로 `pending` 만 사용. `completed`/`deduped`/`failed-permanent` 등 worker-driven 전이는 NF-DEFER-04 합류 시 ADD VALUE cascade |
| 5 enum 신규 (NF-SCHEMA-02) | `notification_event_type` (5종 — 4 M0 활성 + `blocked-correction-required` 등록만 · enum extensibility 보존 marker) · `notification_criticality` (3종 critical/high/normal) · `notification_recipient_role` (4종 operator/medical/legal/author) · `notification_outbox_status` (3종 pending/completed/deduped) · `notification_channel_marker` (4종 email/slack/inApp/digest — M0 envelope.metadata 안 표기 만) |
| `NotificationEvent` TypeScript shape (NF-EVENT-01) | REVIEW_WORKFLOW § 9.2 SoT 그대로 — `eventId`·`sourceEventId`·`eventType`·`contentRef`·`contentTitle`·`recipients[]`·`criticality`·`metadata`·`createdAt`. **`payloadId`·`ctaUrl`·`DeliveryAttempt` 등 fan-out per-recipient 단위는 본 plan 비범위** (notifications Feature 본 구현 § 14.3·§ 14.4 합류 시) |
| `sourceEventId` 결정 함수 (NF-EVENT-02) | REVIEW_WORKFLOW § 9.2.1 권장 패턴 — `sha256(eventType + ":" + instanceId + ":" + contentRef + ":" + workflowTransitionTimestamp)` hex. 동일 transition 재실행 시 항상 동일 ID 보장 → `notification_outbox_unique` 위반으로 idempotent |
| recipients 산정 helper (NF-RECIP-01) | finalRoles[] (compliance_record.auto_check_result.requiredApproverRoles + content_type/risk_level 기반 calculateFinalRoles 결과) → role 매핑 `operator`→`operator` · `medical`→`physician-reviewer` · `legal`→`legal-reviewer` → admin_user.active=true · instance_membership.active=true row 조회 → AdminUser.active=true 필터 → recipients[]. **`author` 산정 (NF-RECIP-02)**: compliance_record.metadata 안 `submitterUserId` 슬롯 (submitForReview 시 채움) 활용 |
| `enqueueNotificationEnvelope()` helper (NF-API-01) | `apps/web/src/lib/notifications/enqueue.ts` 신설. signature: `(sqlBase, input: NotificationEventInput): Promise<{outboxId: string; deduped: boolean}>`. base role 호출 (tx commit 후). UNIQUE 위반 시 `deduped=true` 반환 + 기존 row id 반환 |
| 4 server-action 안 emit 통합 (NF-INTEGRATION-01) | (1) submitForReview 안 content-gate 자동 큐 진입 시 `content-gate-queued` emit (auto-gate.ts 의 `enqueueContentGateIfNeeded` 가 entryId 반환 시) · (2) approveContent 안 `allApproved=true` 시 `reviewer-approved` emit · (3) rejectContent 안 항상 `reviewer-rejected` emit · (4) publishContent 안 항상 `publish` emit |
| emit 시점 결정 (NF-INTEGRATION-02) | **tx commit 후 base role** (sqlBase) 안에서 `enqueueNotificationEnvelope` 호출. compliance-assistant M0 § 6.2 audit emit 패턴과 동일. tx 안 emit 시 RLS scope 충돌·rollback 시 phantom envelope 회피 |
| emit 실패 정책 (NF-INTEGRATION-03) | try/catch + console.error — action 성공 자체에 영향 없음 (기존 audit emit fallback 정책 정합). audit_event 의 `notification-dispatched` envelope-요약 emit 은 NF-DEFER-05 (worker 합류 시) — M0 v0.1 audit 안 outbox-enqueue 발생 자체 별도 audit `notification-envelope-enqueued` 만 부수 emit (envelope ID + recipients count). **(cycle1 NFM-07 정정)** `audit_event.event_type` 컬럼 타입 = **TEXT** (`apps/spike-e/migrations/004_audit_event.sql` 정합) — 신규 eventType 추가 시 DB 마이그레이션 **불필요** (enum 아님) · manifest 단계 20 유지 |
| `submitterUserId` slot 추가 (NF-METADATA-01) | submitForReview 안 `compliance_record.metadata.submitterUserId` 슬롯 채움 (CA-DEFER-13 의 submitter 추적). 후속 reviewer-approved/rejected 시 author recipient 산정 입력. **DATA_MODEL C-10 cascade marker** — submitterUserId 슬롯 명세 |
| § 9.1.1 매트릭스 정책 metadata 직렬화 (NF-METADATA-02) | `envelope.metadata.matrix` 안 `{criticality, immediateChannels[], fallbackChannels[], digestCadence, quietHoursPolicy, optOutPolicy}` — 호출 시점 매트릭스 값 freeze (향후 worker 처리 안 매트릭스 drift 회피). M0 worker 미합류로 기록 만 |
| Drizzle schema v0.6 — 1 신규 table + 5 enum + compliance_record.submitterUserId slot (NF-SCHEMA-03) | `packages/core-content/src/schema.ts` |
| manifest 20단계 patch (19 + C0020) | `packages/migrations-runner/src/manifest.ts` |
| vitest scenarios **15건** (NF-TEST-01 · cycle5 NFM5-01 정정) | envelope shape (3 case) · idempotent insert (2 case) · recipients 산정 (4 case · sentinel/deactivated 분리) · 4 eventType emit 시점 (4 case) · emit 실패 fallback (2 case) |
| docs cascade — REVIEW_WORKFLOW M0 활성화 marker · LOCATION_LEGAL_PLAN LL-DEFER-01 완전 해소 marker · COMPLIANCE_ASSISTANT_M0_PLAN CA-DEFER-14 부분 해소 marker · DATA_MODEL C-10 submitterUserId marker · manifest 20단계 marker · audit eventType cascade · Spike B 패턴 통합 전략 marker | doc patches (NF-CASCADE-**01~07** · cycle5 NFM5-02 정정) |

### 1.3 비범위 (defer)

| 항목 | Defer to | marker |
|---|---|---|
| notifications Feature 본 구현 11 tables (Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·DeadLetterAttempt) + Redis DedupeCache | notifications Feature 본 구현 별 cycle | NF-DEFER-01 |
| 채널 어댑터 (email/slack/inApp) · provider 호출 · rate limit · DeliveryAttempt attemptNumber 동시성 · advisory lock per `(payloadId, channel)` | NF-DEFER-01 동반 | NF-DEFER-02 |
| dedupe Redis SET NX EX 원자 + dedupeWindowSeconds · sourceEventId 재사용 차단 (envelope 내 idempotency 와 별개) | NF-DEFER-01 동반 | NF-DEFER-03 |
| worker harness — claim (SKIP LOCKED) · markCompleted · markRetry · markFailedPermanent · reclaimStale (`packages/notifications-outbox` v0.2 Spike B 패턴 합류) · audit_event `notification-dispatched` envelope 요약 emit | notifications Feature 본 구현 별 cycle | NF-DEFER-04 |
| audit_event `notification-dispatched` envelope 종료 요약 (REVIEW_WORKFLOW § 10.2.1) | NF-DEFER-04 동반 (worker 완료 시 emit) | NF-DEFER-05 |
| digest 모드 (DigestPolicy AST · DigestBucket · DigestBucketPayload · daily/weekly cadence · digestOptOut 정책) | NF-DEFER-01 동반 | NF-DEFER-06 |
| suppression (soft/hard suppression · autoReleaseAt · 채널별 카운터 · 운영자 수동 unsuppress · `notification-suppression-unsuppressed` audit) | NF-DEFER-01 동반 | NF-DEFER-07 |
| DLQ + DeadLetterAttempt · `resendDeadLetter` command · `notification-resend-attempted` audit · 30일 보존 | NF-DEFER-01 동반 | NF-DEFER-08 |
| broadcast 모드 (slackUserId 미보유 시 channel 단위 1건 broadcast · sentinel dedupeKey · `broadcastAttemptId` · critical 이벤트만 허용) | NF-DEFER-01 동반 | NF-DEFER-09 |
| in-app NotificationInbox UI · `readAt` 마킹 · `notification-read` audit · inactive 사용자 historical inbox 정책 | NF-DEFER-01 동반 | NF-DEFER-10 |
| critical-aware 필터 순서 (instance membership · disabled-channel · dedupe · opt-out · suppression · quietHours · businessHours · invalid locationRef · rate-limit) · `skipped-*` DeliveryStatus 13종 | NF-DEFER-01 동반 | NF-DEFER-11 |
| LocationProfile `metadata.locationRef` · businessHours (90일 탐색 한계 · `failed-permanent` 처리) · holidayCalendar (`region`·`source`·연간 minor·임시공휴일 patch) | NF-DEFER-01 동반 | NF-DEFER-12 |
| `notificationPolicyVersion` 병렬 보관 (REVIEW_WORKFLOW § 9.1.1 매트릭스 버전 관리 · 12개월 최소 지원 · deprecation · build fail 메시지) | NF-DEFER-01 동반 | NF-DEFER-13 |
| `content @createdBy` column 정식 추적 (M0 는 `compliance_record.metadata.submitterUserId` 슬롯 fallback) | 콘텐츠 모델 작성자 추적 cycle (별 plan) | NF-DEFER-14 |
| 외부 작성자 (클라이언트 직접 입력 콘텐츠 — AdminUser 없는 author) 발송 정책 → operator fallback 처리 (REVIEW_WORKFLOW § 9.1.1 `recipientRole="author"` 산정 규칙) | NF-DEFER-04 동반 (worker 합류 시) | NF-DEFER-15 |
| `ctaUrl` 자동 합성 (notifications Feature `adminBaseUrl + ctaRouteTemplates[contentType]`) — M0 envelope.metadata.adminPath 만 (`/admin/{instanceSlug}/review-queue/{entryId}` 등 routing seed) | NF-DEFER-01 동반 | NF-DEFER-19 |
| `search-visibility-*`·`keyword-monitoring-*`·`asset-ingestion-*`·`crm-sync-*`·`content-migration-*` **28종** NotificationEventType (REVIEW_WORKFLOW § 9.1 안 다른 Feature cascade enum) — search-visibility 5 + keyword-monitoring 8 + asset-ingestion 5 + crm-sync 4 + content-migration 6 | 각 Feature 본 구현 cycle | NF-DEFER-16 |
| `prior-review-result`·`sla-imminent`·`sla-overdue`·`stale-queued`·`warning-queued` 5종 NotificationEventType | CA-DEFER-05/06/08 + SLA scheduler cycle | NF-DEFER-17 |
| `analytics-report-ready`·`media-threshold-reached`·`media-threshold-released` 3종 NotificationEventType (analytics-reporting Feature cascade) | analytics-reporting Feature 본 구현 cycle | NF-DEFER-18 |
| `manual-review-queued` NotificationEventType 신설 — manual-review 큐 진입 시 finalRoles 안 운영자 외 검수자 (medical · legal) 통보 (운영 risk 인지 marker · cycle1 NFM-11) | REVIEW_WORKFLOW § 9.1 enum 추가 cascade + 본 Feature cascade (Phase Alpha 또는 운영 시점) | NF-DEFER-20 |
| super-admin (admin_user.is_super_admin=true) recipient 산정 — instance_membership row 부재 안전 fallback (admin_user 직접 SELECT). M0 4 active 이벤트 모두 super-admin 부재 (cycle2 NFM2-03) | Phase Alpha 안 다른 Feature cascade 합류 시 (content-migration · crm-sync 등) | NF-DEFER-21 |
| action actor self-suppression — recipients 산정 안 actor.userId 제외 옵션 (cycle2 NFM2-07) | Phase Alpha 안 운영 결정 합류 | NF-DEFER-22 |
| recipients[] per-user dedup — 동일 user 가 다중 role 보유 시 1건 통합 (M0 v0.1 안 보존 · cycle4 NFM4-02 신설) | NF-DEFER-04 worker 합류 시 (per-recipient dedupe 통합) | NF-DEFER-23 |

## 2. 데이터 모델 결정

### 2.1 C0020 `notification_outbox` 신규 table (NF-SCHEMA-01)

```sql
-- packages/core-content/migrations/C0020_notification_outbox.sql
-- SoT: docs/features/notifications.md § 9.2 NotificationEvent (envelope shape SoT)
--       docs/admin/REVIEW_WORKFLOW.md § 9.1 NotificationEventType enum
-- M0 v0.1 scope: envelope persist + idempotent insert. worker 미합류 (NF-DEFER-04).

CREATE TYPE notification_event_type AS ENUM (
  'reviewer-approved',
  'reviewer-rejected',
  'publish',
  'content-gate-queued',
  'blocked-correction-required'  -- M0 emit 없음 (CA-DEFER-15 까지) · enum extensibility 보존
);

CREATE TYPE notification_criticality AS ENUM ('critical', 'high', 'normal');

CREATE TYPE notification_recipient_role AS ENUM ('operator', 'medical', 'legal', 'author');
-- M0 v0.1 client M0 미합류 (CA-DEFER-10). operations 토큰은 author/operator 와 중첩으로 미등록.

CREATE TYPE notification_outbox_status AS ENUM ('pending', 'completed', 'deduped');
-- M0 v0.1 worker 없음 — 모든 row 'pending' 으로 INSERT. completed/deduped 는 향후 NF-DEFER-04 worker 합류 시 사용.
-- failed-permanent 등 추가 상태는 NF-DEFER-04 합류 시 ADD VALUE.

CREATE TYPE notification_channel_marker AS ENUM ('email', 'slack', 'inApp', 'digest');
-- M0 envelope.metadata.matrix 안 표기 만 — 실 라우팅 NF-DEFER-01/02.

-- NF-SCHEMA-06 (cycle1 NFM-09 정정): outbox.id = NotificationEvent.eventId (REVIEW_WORKFLOW § 9.2 SoT).
-- 향후 NF-DEFER-01 마이그레이션 시 NotificationLog.id = outbox.id 보존 strategy 필수 (eventId 결정성 보장).
-- 분할 마이그레이션 (option b) 시 Log.id = outbox.id INSERT 패턴 운영.

CREATE TABLE notification_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),    -- = NotificationEvent.eventId
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  source_event_id TEXT NOT NULL,                   -- sha256 hex (NF-EVENT-02)
  event_type notification_event_type NOT NULL,
  content_ref TEXT NOT NULL,
  content_title TEXT NOT NULL,
  criticality notification_criticality NOT NULL,
  recipients JSONB NOT NULL,                       -- [{ recipientId, recipientRole }] — array, app 안 schema 검증
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,     -- matrix 정책 freeze · adminPath · submitterUserId · workflowTransitionId 등
  status notification_outbox_status NOT NULL DEFAULT 'pending',
  enqueued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,                        -- NF-DEFER-04 합류 시 worker 가 채움
  CONSTRAINT notification_outbox_unique UNIQUE (instance_id, source_event_id),
  CONSTRAINT notification_outbox_recipients_nonempty CHECK (jsonb_typeof(recipients) = 'array' AND jsonb_array_length(recipients) >= 1),
  CONSTRAINT notification_outbox_completed_requires_at CHECK (
    status <> 'completed' OR completed_at IS NOT NULL
  )
);

CREATE INDEX notification_outbox_instance_idx ON notification_outbox (instance_id);
CREATE INDEX notification_outbox_status_idx ON notification_outbox (instance_id, status, enqueued_at);
CREATE INDEX notification_outbox_event_type_idx ON notification_outbox (instance_id, event_type);
CREATE INDEX notification_outbox_content_idx ON notification_outbox (instance_id, content_ref);

ALTER TABLE notification_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_outbox FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON notification_outbox FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON notification_outbox TO app_tenant_user;
```

**결정 (NF-SCHEMA-01~04)**:
- **(NF-SCHEMA-01)** `notification_outbox` 단일 테이블 — envelope 단위 1 row. notifications Feature 본 구현 § 14.2 `NotificationEventReceipt` 와 § 14.6 `NotificationLog` 의 vertical slice 합본. **향후 NF-DEFER-01 합류 시 마이그레이션 전략**: (a) 본 테이블을 worker 의 input queue 로 재사용 (Receipt/Log/PayloadRecord 신설 + outbox.id → Receipt.id 매핑) 또는 (b) outbox row → Receipt+Log 1:1 분할 마이그레이션 (data 보존). plan 합류 시점에 결정.
- **(NF-SCHEMA-02)** `notification_outbox_unique (instance_id, source_event_id)` — REVIEW_WORKFLOW § 9.2.1 idempotency 계약. 동일 sourceEventId 재호출 시 UNIQUE 위반 → app helper `enqueueNotificationEnvelope` 안 `ON CONFLICT DO NOTHING RETURNING id` 패턴 + 기존 row 별도 SELECT 로 dedupe 처리.
- **(NF-SCHEMA-03)** `recipients JSONB NOT NULL` + CHECK nonempty — `[{recipientId, recipientRole}]`. recipientId 는 admin_user.id UUID v4 hex · recipientRole 은 `notification_recipient_role` enum 값. JSONB schema 검증은 app layer 책임 (zod). DB level 은 array nonempty 만 강제.
- **(NF-SCHEMA-04)** `notification_outbox_status` 3종 — `pending` (INSERT 직후 default · M0 v0.1 모든 row) · `completed` (worker 가 발송 완료 · M0 v0.1 미사용) · `deduped` (UNIQUE 위반 시 helper 반환 — DB row 없음 · 호출자 결과 컨텍스트). M0 v0.1 worker 부재로 DB row 안 `completed`/`deduped` 전이 없음. `failed-permanent`·`processing` 등 worker-driven 상태는 NF-DEFER-04 합류 시 ADD VALUE cascade.

### 2.2 C-10 ComplianceRecord `submitterUserId` 슬롯 추가 (NF-METADATA-01)

DB 컬럼 신설 없음 — 기존 `metadata JSONB` 슬롯 안 `submitterUserId` key 추가. DATA_MODEL C-10 spec cascade marker 만 (NF-CASCADE-04):

```jsonc
// compliance_record.metadata JSONB schema (M0 v0.1 안 인정 키)
{
  "manualReview": true,
  "catalogVersion": "m0-stub-v0.1",
  "catalogHash": "stub",
  "exemptReason": "LegalDocument-CONTENT_STANDARDS-7.1.1.1",  // optional
  "sentinel": true,                                            // C0016 sentinel backfill row 만
  "submitterUserId": "uuid-v4-hex"                             // NF-METADATA-01 신설 — submitForReview actor
}
```

**결정 (NF-METADATA-01)**:
- submitForReview server action 안 INSERT 시 `metadata.submitterUserId = ctx.userId` 채움. 기존 plan v1.0 § 4.3 호출 시점 안 추가.
- 후속 server action (approveContent · rejectContent · publishContent) 안 author recipient 산정 시 `compliance_record.metadata->>'submitterUserId'` 조회.
- DATA_MODEL C-10 spec cascade — metadata 슬롯 안 `submitterUserId` 키 정의 marker 추가 (NF-CASCADE-04). 풀 컬럼 화 (예: `submitter_user_id UUID` 신설) 는 NF-DEFER-14 (콘텐츠 모델 작성자 추적 cycle 합류 시 entity content row 안 `@createdBy` column 신설 동반).

### 2.3 enum extensibility 결정 (NF-SCHEMA-05) — cycle1 NFM-10·14 정정

- `notification_event_type` 5종 enum 만 M0 v0.1 등록 (4 M0 활성 + `blocked-correction-required` enum 등록 만 · CA-DEFER-15 합류 까지 emit 없음). REVIEW_WORKFLOW § 9.1 의 **41종 풀 enum** 모두 등록하지 **않음** — 향후 Feature cascade 시 ADD VALUE 단계적 cascade (NF-DEFER-16/17/18 매핑).
- `notification_recipient_role` 4종 enum — REVIEW_WORKFLOW § 9.2 `recipientRole` (`ApproverRole | "author" | "operations"`) 의 M0 subset. `client` (CA-DEFER-10 까지 미합류) · `operations` (M0 author/operator 와 중첩으로 미등록).
- `notification_criticality` 3종 enum — REVIEW_WORKFLOW § 9.1.1 매트릭스 SoT.
- `notification_outbox_status` 3종 · `notification_channel_marker` 4종 — M0 v0.1 vertical slice subset. NF-DEFER-04 합류 시 ADD VALUE cascade.
- **(NF-SCHEMA-05b · cycle1 NFM-14 정정)** PostgreSQL 12+ 정합 — `ALTER TYPE ... ADD VALUE` transaction 안 실행 허용 (PostgreSQL 12+). migrations-runner 안 single-tx 운영 안전. PostgreSQL 12 미만 미지원 marker (Spike A · D 결정 정합).
- **(NF-SCHEMA-05c · cycle1 NFM-10 정정)** REVIEW_WORKFLOW § 9.1 NotificationEventType enum 실 멤버 = **41종** (awk 실측 — `# features/...` cascade comment 포함 정합). 누적 매핑:
  - **M0 v1.0 active 4종**: content-gate-queued · reviewer-approved · reviewer-rejected · publish
  - **enum 등록 만 1종**: blocked-correction-required (CA-DEFER-15 룰 카탈로그 합류 시 emit 활성)
  - **NF-DEFER-17 (SLA/CA defer) 5종**: prior-review-result · sla-imminent · sla-overdue · stale-queued · warning-queued
  - **NF-DEFER-18 (analytics-reporting) 3종**: analytics-report-ready · media-threshold-reached · media-threshold-released
  - **NF-DEFER-16 (다른 Feature) 28종**: search-visibility 5 (anomaly-critical · anomaly-warning · monitoring-failed · ai-briefing-citation-first-detected · ai-briefing-citation-lost) + keyword-monitoring 8 (rank-improved · rank-dropped · impressions-spike · impressions-drop · ctr-anomaly · rank-bucket-improved · rank-bucket-dropped · monitoring-failed) + asset-ingestion 5 (batch-completed · batch-failed · review-required · pii-detected · asset-promoted) + crm-sync 4 (batch-failed · conflict-detected · credential-expired · credential-expiring-soon) + content-migration 6 (plan-legal-approved · run-completed · run-failed · rollback-triggered · run-aborted · step-compensated)
  - **합계**: 4 + 1 + 5 + 3 + 28 = **41 ✓**

## 3. NotificationEvent envelope shape 결정

### 3.1 TypeScript type (NF-EVENT-01)

REVIEW_WORKFLOW § 9.2 SoT 그대로:

```typescript
// apps/web/src/lib/notifications/types.ts
import type { NotificationEventType, NotificationCriticality, NotificationRecipientRole } from "@glitzy/core-content";

export type NotificationRecipient = {
  recipientId: string;          // admin_user.id (UUID v4 hex)
  recipientRole: NotificationRecipientRole;  // operator | medical | legal | author
  recipientStateAt: string;     // ISO 8601 — NF-RECIP-08 drift audit (cycle1 NFM-08 정정)
};

export type NotificationEventInput = {
  // sourceEventId 는 helper 안 결정 (NF-EVENT-02). 호출자 미제공.
  eventType: NotificationEventType;
  instanceId: string;
  contentRef: string;
  contentTitle: string;
  recipients: NotificationRecipient[];
  criticality?: NotificationCriticality;   // 미지정 시 § 9.1.1 매트릭스 자동 산정 (helper 안)
  metadata?: Record<string, unknown>;       // 호출자 추가 정보 (workflowTransitionId · adminPath · submitterUserId 등)
  workflowTransitionTimestamp: string;     // ISO — sourceEventId 결정 입력
};

export type NotificationEventEnvelope = NotificationEventInput & {
  eventId: string;            // UUID v4 — outbox row id
  sourceEventId: string;      // sha256 hex
  criticality: NotificationCriticality;  // 산정 후
  metadata: Record<string, unknown>;     // matrix freeze 포함
  enqueuedAt: string;         // ISO
};
```

> **본 plan 비범위 (notifications Feature 본 구현 § 14.3 cascade)**: `NotificationPayload` (per-recipient fan-out · payloadId · ctaUrl · DeliveryAttempt 연결) · `DeliveryResult` (perRecipient[] · broadcastDeliveries[] · ReceiptState · DeliveryStatus 13종) · attemptNumber 동시성 · provider 호출. 본 plan 은 envelope 단위 persist 까지 만.

### 3.2 sourceEventId 결정 함수 (NF-EVENT-02) — cycle1 NFM-05 정정

REVIEW_WORKFLOW § 9.2.1 권장 패턴 (`hash(eventType + contentRef + workflowTransitionTimestamp)`) 대비 본 plan 안 instanceId 추가 — multi-tenant scope 안전성 강화 (NFM-05 marker):

```typescript
// apps/web/src/lib/notifications/source-event-id.ts
import { createHash } from "node:crypto";

export function computeSourceEventId(input: {
  eventType: string;
  instanceId: string;
  contentRef: string;
  workflowTransitionTimestamp: string;  // ISO 8601 string
}): string {
  const canonical = `${input.eventType}:${input.instanceId}:${input.contentRef}:${input.workflowTransitionTimestamp}`;
  return createHash("sha256").update(canonical, "utf8").digest("hex");
}
```

**결정 (NF-EVENT-02·03)**:
- **(NF-EVENT-02)** 결정성 보장 — 동일 transition 의 emit 재시도 (server action 재실행 등) 시 항상 동일 sourceEventId. UNIQUE 위반 시 helper 안 dedupe 처리.
- **(NF-EVENT-02b · cycle1 NFM-05 정정)** spec § 9.2.1 권장 패턴은 instanceId 미포함 (UNIQUE scope 가 책임) 이나 본 plan 안 multi-tenant scope 안전성 강화 위해 추가 — (a) cross-instance source 사고 회피 (workflowTransitionTimestamp 동일 + contentRef 동일 시 hash collision 회피) · (b) hash collision audit 안 instance 별 격리 검증 가능. UNIQUE scope 와 redundant 이지만 운영 안전성 우선 결정.
- **(NF-EVENT-03 · cycle1 NFM-03 정정)** `workflowTransitionTimestamp` 는 호출자 결정 — server action 별 timestamp 출처 표 (모호성 차단):

| server action | timestamp 출처 (RETURNING 으로 확보) | 이유 |
|---|---|---|
| `submitForReviewAction` (content-gate-queued emit 시) | `compliance_record.updated_at` (1차 INSERT RETURNING) | compliance_record 가 review-queue 보다 SoT (review_queue_entry 는 derived) |
| `approveEntryAction` (allApproved=true 시 `reviewer-approved` emit) | `compliance_record.updated_at` (role 슬롯 UPDATE RETURNING) | 게이트 충족 결정은 record 슬롯 갱신 단위 |
| `rejectEntryAction` (`reviewer-rejected` emit) | `review_queue_entry.updated_at` (entry 'resolved' UPDATE RETURNING) | rejection 은 entry 단위 (record_phase 전이 없음) |
| `publishContentAction` (`publish` emit) | `compliance_record.updated_at` (record_phase='published' UPDATE RETURNING) | record_phase 전이가 publish 의 SoT |

모든 case 공식 = `<row>.updated_at::text` (ISO 8601 직렬화) 사용. 동일 PostgreSQL tx 안 `now()` 결정성 보장 — 동일 tx 재실행 시 동일 timestamp. 별도 server action 재호출 (예: 운영자가 직접 같은 발행 액션 재시도) 은 별 envelope 으로 처리 (transition 자체가 별개).

### 3.3 4종 eventType M0 활성 정합 매트릭스 (NF-EVENT-04)

REVIEW_WORKFLOW § 9.1.1 SoT 부분 발췌 — 본 plan 의 4 M0 활성 이벤트 매트릭스 정합:

| eventType | 수신자 (M0) | criticality | immediateChannels | fallbackChannels | digestCadence | quietHoursPolicy | optOutPolicy | 본 plan 발송 시점 |
|---|---|---|---|---|---|---|---|---|
| `content-gate-queued` | finalRoles[] 매칭 검수자 (operator + 등급 medical + 룰 추가 역할 합집합) | critical | email + slack + inApp | inApp | — | bypass | mandatory | submitForReview 안 `enqueueContentGateIfNeeded` 가 `entryId !== null` 반환 시 |
| `reviewer-approved` | author + operator | normal | inApp | (없음) | (옵션) email 일일 요약 | respect | digestOptOut 허용 | approveContent 안 `allApproved=true` 시 만 |
| `reviewer-rejected` | author | high | email + inApp | inApp | — | respect | mandatory | rejectContent 안 항상 |
| `publish` | operator + client-approver (client M0 미합류 CA-DEFER-10 — operator 만) | normal | inApp | (없음) | (옵션) email 일일 요약 | respect | digestOptOut 허용 | publishContent 안 항상 |

- **(NF-EVENT-04)** 매트릭스 freeze — envelope.metadata.matrix 안 호출 시점 위 컬럼 값 snapshot (`{criticality, immediateChannels[], fallbackChannels[], digestCadence, quietHoursPolicy, optOutPolicy}`). M0 v0.1 worker 미합류로 실 라우팅 없음 · 향후 NF-DEFER-04/13 합류 시 매트릭스 drift 회피 (envelope 발생 당시 정책 vs 처리 당시 정책 불일치 분쟁 회피).
- **(NF-EVENT-05)** `reviewer-approved` 발송 시점 — AND 게이트 충족 시 만 (`allApproved=true`). 게이트 미충족 단일 role approve (예: medical 만 approve · operator 잔존) 는 emit 없음 — REVIEW_WORKFLOW § 9.1.1 의 `reviewer-approved` 정의가 "검수자 approve (envelope 단위)" 인지 "최종 approved 전이" 인지 모호 → 보수적 선택 = 후자 (최종 approved 전이 시 1건). M0 운영 단순화 + 알림 노이즈 회피.
- **(NF-EVENT-06)** `client-approver` 수신자 — CA-DEFER-10 까지 client 미합류. `publish` 이벤트 의 client-approver 수신자는 M0 안 산정 자체 skip (admin_user.active=true · instance_membership.active=true client-approver row 없을 것). recipients 최종 nonempty 보장 = operator 가 항상 1+ 존재 가정.
- **(NF-EVENT-07 · cycle1 NFM-11 정정)** `content-submitted-for-review` 미발송 — § 9.1 NotificationEventType enum 부재. 운영자 본인 액션 (submitForReview) 의 결과 NotificationEvent emit 안 함. audit_event 안 `content-submitted-for-review` 는 별도 유지 (이미 compliance-assistant M0). **운영 risk 인지 marker** — manual-review 큐 진입 시 finalRoles=['operator', 'medical'] 안 medical 검수자가 알 수 없음 (큐 화면 polling 만 가능). SLA P0 (72시간) 안 검수자 알림 부재. **NF-DEFER-20 신설** — `manual-review-queued` NotificationEventType 신설 cascade (REVIEW_WORKFLOW § 9.1 enum 추가 cascade + 본 Feature cascade) Phase Alpha 또는 운영 시점 합류.
- **(NF-EVENT-08)** `blocked-correction-required` 미발송 — M0 stub 의 check() 가 `automatedDecision='block'` 반환하지 않음 (High 입력 시 'gate' 만). CA-DEFER-15 의 룰 카탈로그 합류 시 활성 — enum 만 등록.

## 4. recipients 산정 결정 — cycle1 NFM-01 정정 (helper signature 통일)

> **(cycle1 NFM-01 정정)** recipients 산정 helper 는 **`ScopedTx` 만 받는 단일 시그니처** — tx 안 산정 + 결과를 tx 외부로 반환 + tx commit 후 `enqueueNotificationEnvelope` 호출 시 recipients[] 직접 입력 (sqlBase 안 산정 미허용). compliance-assistant M0 § 6.2 audit emit 패턴 정합 — tx 안 비즈니스 로직 + tx 외부 emit.

### 4.1 finalRoles → instance_membership 매핑 (NF-RECIP-01)

```typescript
// apps/web/src/lib/notifications/recipients.ts
import type { ApproverRole } from "@/lib/compliance/types";
import type { ScopedTx } from "@glitzy/db";

const MEMBERSHIP_ROLE_MAP: Record<ApproverRole, string> = {
  operator: "operator",
  medical: "physician-reviewer",
  legal: "legal-reviewer",
};

export async function resolveRoleRecipients(
  tx: ScopedTx,
  instanceId: string,
  approverRoles: ApproverRole[],
): Promise<Array<{ recipientId: string; recipientRole: ApproverRole; recipientStateAt: string }>> {
  if (approverRoles.length === 0) return [];
  const dbRoles = approverRoles.map((r) => MEMBERSHIP_ROLE_MAP[r]);
  const rows = await tx<{ user_id: string; role: string }[]>`
    SELECT DISTINCT im.user_id, im.role
      FROM instance_membership im
      JOIN admin_user au ON au.id = im.user_id
     WHERE im.instance_id = ${instanceId}::uuid
       AND im.active = true
       AND au.active = true
       AND im.role = ANY(${dbRoles}::text[])
  `;
  // cycle2 NFM2-02 정정 — helper 안 recipientStateAt 자동 부착 (호출자 .map 책임 제거)
  const recipientStateAt = new Date().toISOString();
  // db role → ApproverRole 역매핑
  const REVERSE_MAP: Record<string, ApproverRole> = {
    "operator": "operator",
    "physician-reviewer": "medical",
    "legal-reviewer": "legal",
  };
  return rows.map((r) => ({
    recipientId: r.user_id,
    recipientRole: REVERSE_MAP[r.role]!,
    recipientStateAt,
  }));
}
```

**결정 (NF-RECIP-01·02·03)**:
- **(NF-RECIP-01)** finalRoles `operator`/`medical`/`legal` → instance_membership.role `operator`/`physician-reviewer`/`legal-reviewer` 매핑. admin_user.active=true · instance_membership.active=true 양쪽 필터.
- **(NF-RECIP-02)** 1 user 가 다중 role 보유 시 — 각 role 별 1건씩 recipients[] 안 등록 (DISTINCT (user_id, role)). 동일 user 의 동일 role 중복은 없음 (instance_membership UNIQUE active partial).
- **(NF-RECIP-03)** finalRoles 안 결과 0건 (해당 role active membership 없음) → 본 plan 에서 발송 자체 skip (envelope insert 안 함). 운영 alert (admin_user 가 누락된 instance 검출) 은 NF-DEFER-04 합류 시 worker 가 처리. M0 v0.1 일단 console.warn 로그 + envelope skip.

### 4.2 author 산정 (NF-RECIP-04)

```typescript
// apps/web/src/lib/notifications/recipients.ts (계속)
export async function resolveAuthorRecipient(
  tx: ScopedTx,
  instanceId: string,
  recordId: string,
): Promise<{ recipientId: string; recipientRole: "author"; recipientStateAt: string } | null> {
  const rows = await tx<{ metadata: { submitterUserId?: string } }[]>`
    SELECT metadata FROM compliance_record
     WHERE id = ${recordId}::uuid AND instance_id = ${instanceId}::uuid
     LIMIT 1
  `;
  const submitter = rows[0]?.metadata?.submitterUserId;
  if (!submitter) return null;
  // admin_user.active=true 검증
  const userRows = await tx<{ id: string }[]>`
    SELECT id FROM admin_user WHERE id = ${submitter}::uuid AND active = true LIMIT 1
  `;
  if (userRows.length === 0) return null;
  // cycle2 NFM2-02 정정 — helper 안 recipientStateAt 자동 부착
  return { recipientId: submitter, recipientRole: "author", recipientStateAt: new Date().toISOString() };
}
```

**결정 (NF-RECIP-04·05·06)**:
- **(NF-RECIP-04)** author 산정 — compliance_record.metadata.submitterUserId 슬롯 활용. 미존재 (예: sentinel ComplianceRecord backfill row) 또는 deactivated user 시 → recipient skip (null 반환). recipients[] 안 author 누락 시에도 다른 role recipient 가 1+ 있으면 envelope emit 정상 진행.
- **(NF-RECIP-05)** 외부 작성자 (AdminUser 없는 author — 향후 클라이언트 직접 입력 콘텐츠) 처리 정책은 NF-DEFER-15 (worker 합류 시 operator fallback 처리).
- **(NF-RECIP-06)** `reviewer-rejected` 안 author 만 발송 — author skip 시 envelope 자체 skip (다른 role recipient 없음). 운영자 정정 통로 부재 risk 인지 marker.
- **(NF-RECIP-08 · cycle1 NFM-08 정정)** recipients 산정 시점 (tx 안) vs envelope emit 시점 (tx commit 후) race window 명시 — tx commit 시점 가 ~ envelope insert 시점 가 사이 (수ms~수십ms) 안 admin_user.active=false 전이 가능. M0 v0.1 안 envelope 발생 당시 snapshot 보존 (recipient validation 안 함) · 향후 NF-DEFER-04 worker 합류 시 발송 직전 admin_user.active=true · instance_membership.active=true 재검증 (notifications spec § 4.1 4.a 정합). 본 plan 안 recipients[] 안 각 row 안 `recipientStateAt=<ISO>` 메타 추가 — drift audit 용 (envelope.recipients 의 형식은 `[{ recipientId, recipientRole, recipientStateAt }]`).

### 4.3 envelope-별 recipients 산정 로직 (NF-RECIP-07)

| eventType | recipients 산정 |
|---|---|
| `content-gate-queued` | resolveRoleRecipients(tx, instanceId, finalRoles) — finalRoles 는 envelope.metadata 안 카탈로그 (auto_check_result.requiredApproverRoles + calculateFinalRoles 결과 = ['operator', 'medical', 'legal' 안 매칭] 합집합). 0건 → envelope skip + console.warn |
| `reviewer-approved` | author (resolveAuthorRecipient) + operator (resolveRoleRecipients(tx, instanceId, ['operator'])) 합집합. author skip 시 operator 만. operator 0건 → envelope skip + console.warn |
| `reviewer-rejected` | author 만 (resolveAuthorRecipient). author skip 시 envelope 자체 skip + console.warn (NF-RECIP-06 marker) |
| `publish` | operator (resolveRoleRecipients(tx, instanceId, ['operator'])) 만. client-approver (CA-DEFER-10) 미합류. **operator 0건 → envelope skip + console.warn (cycle2 NFM2-05 정정 · NF-RECIP-03 정합)** |

> **(cycle2 NFM2-06 정정)** recipients[] 합집합 시 (recipientId, recipientRole) 페어 단위 **보존** — 동일 user 가 operator + author 양쪽 산정될 경우 두 row 모두 보존 (REVIEW_WORKFLOW § 9.1.1 안 recipientRole 는 라우팅·표시 컨텍스트). dedup 안 함. UI level 에서 동일 user 의 중복 알림 회피는 NF-DEFER-04 합류 시 worker 의 per-recipient dedupe 처리.

## 5. `enqueueNotificationEnvelope()` helper 결정

### 5.1 시그니처 (NF-API-01) — cycle1 NFM-02·06·12 정정

```typescript
// apps/web/src/lib/notifications/enqueue.ts
import type postgres from "postgres";
import { z } from "zod";
import { computeSourceEventId } from "./source-event-id";
import { resolveCriticality, resolveMatrixSnapshot } from "./matrix";
import type { NotificationEventInput } from "./types";

// cycle1 NFM-06·12 정정 — helper 진입 시 zod 검증
const recipientSchema = z.object({
  recipientId: z.string().uuid(),
  recipientRole: z.enum(["operator", "medical", "legal", "author"]),
  recipientStateAt: z.string().datetime(),  // NF-RECIP-08 drift audit
});
const envelopeInputSchema = z.object({
  // cycle3 NFM3-08 marker — eventType enum 은 packages/core-content 의 notificationEventTypeEnumValues 재사용 권장
  // (M0 v0.1 안 5종 만 등록 · Phase Alpha 안 ADD VALUE 시 자동 동기화)
  eventType: z.enum([
    "content-gate-queued", "reviewer-approved", "reviewer-rejected", "publish", "blocked-correction-required",
  ]),
  instanceId: z.string().uuid(),
  contentRef: z.string().min(1),
  contentTitle: z.string().min(1),
  recipients: z.array(recipientSchema).min(1),
  criticality: z.enum(["critical", "high", "normal"]).optional(),
  metadata: z.record(z.unknown()).optional(),
  workflowTransitionTimestamp: z.string().datetime(),
});

export class InvalidEnvelopeInputError extends Error {
  constructor(message: string) {
    super(`InvalidEnvelopeInputError: ${message}`);
    this.name = "InvalidEnvelopeInputError";
  }
}
export class EnvelopeEnqueueRaceError extends Error {
  constructor(sourceEventId: string) {
    super(`EnvelopeEnqueueRaceError: ${sourceEventId} — INSERT race + dedupe SELECT both returned 0 row after retry`);
    this.name = "EnvelopeEnqueueRaceError";
  }
}

export type EnqueueResult =
  | { ok: true; outboxId: string; deduped: false }
  | { ok: true; outboxId: string; deduped: true }      // UNIQUE 위반 — 기존 row 반환
  | { ok: false; skipped: "no-recipients" };           // helper 진입 전 recipients=[] 분기

export async function enqueueNotificationEnvelope(
  sqlBase: postgres.Sql,
  input: NotificationEventInput,
): Promise<EnqueueResult> {
  // (a) 진입 검증 — recipients=[] 분기 + zod schema (NFM-06·12 정정)
  if (input.recipients.length === 0) {
    return { ok: false, skipped: "no-recipients" };
  }
  const parsed = envelopeInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new InvalidEnvelopeInputError(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", "));
  }
  const validated = parsed.data;

  const sourceEventId = computeSourceEventId({
    eventType: validated.eventType,
    instanceId: validated.instanceId,
    contentRef: validated.contentRef,
    workflowTransitionTimestamp: validated.workflowTransitionTimestamp,
  });
  const criticality = validated.criticality ?? resolveCriticality(validated.eventType);
  const matrixSnapshot = resolveMatrixSnapshot(validated.eventType);
  const metadata = {
    ...(validated.metadata ?? {}),
    matrix: matrixSnapshot,
  };

  // (b) 단일 시도 + (c) length===0 분기 시 100ms 후 1회 polling (NFM-02 정정)
  // cycle4 NFM4-03 marker — setTimeout polling 안 AbortSignal 미지원 (M0 v0.1 단순화) · NF-DEFER-04 합류 시 AbortController 통합 검토
  const insertAndFallback = async (): Promise<{ id: string; was_inserted: boolean }[]> => {
    return await sqlBase.begin(async (tx) => {
      // base role 호출 — RLS policy 통과 위해 SET LOCAL ROLE + SET LOCAL app.current_instance_id (Spike A · audit-emit 패턴 정합).
      await tx`SET LOCAL ROLE app_tenant_user`;
      await tx`SELECT set_config('app.current_instance_id', ${validated.instanceId}, true)`;
      return await tx<{ id: string; was_inserted: boolean }[]>`
        WITH ins AS (
          INSERT INTO notification_outbox (
            instance_id, source_event_id, event_type, content_ref, content_title,
            criticality, recipients, metadata
          ) VALUES (
            ${validated.instanceId}::uuid,
            ${sourceEventId},
            ${validated.eventType}::notification_event_type,
            ${validated.contentRef},
            ${validated.contentTitle},
            ${criticality}::notification_criticality,
            ${tx.json(validated.recipients as any)},  /* cycle4 NFM4-04 marker — postgres.js tx.json() generic type narrow 부재 · zod 검증 후 안전 */
            ${tx.json(metadata as any)}
          )
          ON CONFLICT (instance_id, source_event_id) DO NOTHING
          RETURNING id, true AS was_inserted
        )
        SELECT id, was_inserted FROM ins
        UNION ALL
        SELECT id, false AS was_inserted FROM notification_outbox
         WHERE instance_id = ${validated.instanceId}::uuid AND source_event_id = ${sourceEventId}
         LIMIT 1
      `;
    });
  };

  let rows = await insertAndFallback();
  if (rows.length === 0) {
    // 1차 시도 race window — A worker INSERT 미commit 시점 가 ~ B worker SELECT 시점 사이.
    // 100ms 후 1회 재시도 (notifications spec § 3.3 짧은 poll 패턴 정합).
    await new Promise<void>((resolve) => setTimeout(resolve, 100));
    rows = await insertAndFallback();
  }
  if (rows.length === 0) {
    throw new EnvelopeEnqueueRaceError(sourceEventId);
  }
  const row = rows[0]!;
  return row.was_inserted
    ? { ok: true, outboxId: row.id, deduped: false }
    : { ok: true, outboxId: row.id, deduped: true };
}
```

**결정 (NF-API-01~07)**:
- **(NF-API-01)** base role + SET LOCAL ROLE app_tenant_user 패턴 — RLS policy 통과 보장. admin DB pool 안 base role 은 BYPASSRLS 권한 보유 가정 (Spike A pattern). compliance audit-emit 안 `emitAuditEvent` 도 동일 sqlBase 호출 (`packages/auth/src/audit.ts`).
- **(NF-API-02)** `INSERT ... ON CONFLICT DO NOTHING RETURNING id` + UNION ALL fallback SELECT — 단일 round trip. INSERT 성공 시 `was_inserted=true` · UNIQUE 위반 시 `was_inserted=false` 로 기존 row id 반환.
- **(NF-API-03)** `EnqueueResult` 분기 — `deduped=true` 는 helper 호출 자체 성공이지만 새 envelope 생성 안 함 (idempotent path · 호출자 로그용). `skipped="no-recipients"` 는 recipients=[] 입력 시 (4.3 안 검증 결과 0건). caller 가 분기 결정.
- **(NF-API-04)** tx 안 `SET LOCAL` 사용 — tx commit 시 GUC 자동 reset. base role 호출 정합.
- **(NF-API-05 · cycle1 NFM-02 정정)** race window 안 0 row 처리 — A worker INSERT 미commit 시점 가 ~ B worker UNION ALL SELECT 시점 사이 안 race window 안 length === 0 가능. 100ms × 1회 polling (notifications spec § 3.3 짧은 poll 패턴 정합 · 최대 500ms 권장 중 100ms 단일 retry 채택). 2차 시도도 0 row 시 `EnvelopeEnqueueRaceError` throw — caller 안 try/catch + console.error fallback (NF-INTEGRATION-04 정합). 운영 안 본 error 빈도 추적 시 NF-DEFER-04 worker 합류 시 SERIALIZABLE isolation 검토.
- **(NF-API-06 · cycle1 NFM-06 정정)** zod schema 검증 helper 진입 시 — recipients 배열 안 각 row 의 recipientId UUID v4 + recipientRole enum + recipientStateAt ISO 검증. instanceId UUID v4 · workflowTransitionTimestamp ISO 검증. 실패 시 `InvalidEnvelopeInputError` throw (caller try/catch fallback).
- **(NF-API-07 · cycle1 NFM-12 정정)** input.instanceId 의 UUID 검증은 zod schema 안 통합 (NF-API-06). PostgreSQL `::uuid` 캐스트 안 invalid input 시 throw → zod 가 사전 차단.
- **(NF-API-07b · cycle2 NFM2-11 marker)** `enqueueNotificationEnvelope` 은 **Node runtime 안 호출** (server action default Node runtime · Edge runtime 미사용). 100ms `setTimeout` polling 은 Node runtime 정합. Vercel Edge Functions 안 60s 한계 무관 (server action 안 default Node runtime).

### 5.2 호출 위치 (NF-API-08) — cycle1 NFM-01 정정

**모든 호출 = tx commit 후 base role** (compliance-assistant M0 § 6.2 audit emit 패턴 정합). **recipients 산정은 tx 안 만** (NFM-01 정정 — sqlBase 안 산정 미허용).

```typescript
// 패턴 (server action 안 예시):
const txResult = await withSkeletonTx({ signedToken, instanceId }, async (tx, ctx) => {
  // ... 비즈니스 로직 tx 안 수행 (compliance_record UPDATE 등 + RETURNING updated_at) ...
  const updatedRecord = await tx<{ updated_at: Date }[]>`
    UPDATE compliance_record
       SET physician_approver = ${ctx.userId}::uuid,
           physician_approved_at = now(),
           updated_at = now()
     WHERE id = ${recordId}::uuid
     RETURNING updated_at
  `;
  // cycle3 NFM3-11 marker — UPDATE SET 절은 server action 별 분기 (operator approve · medical approve · publish 등).
  // 본 예시는 medical role approve case · 다른 case 는 (peer_reviewer · legal_counsel · record_phase 등) 슬롯 갱신.
  // recipients 산정도 tx 안 (RLS scope · 동일 read view · NFM-01 정정 — ScopedTx 만 받는 단일 시그니처)
  // helper 가 recipientStateAt 자동 부착 (cycle2 NFM2-02 정정)
  const roleRecipients = await resolveRoleRecipients(tx, ctx.instanceId, ["operator"]);
  const author = await resolveAuthorRecipient(tx, ctx.instanceId, recordId);
  const recipients = [...roleRecipients, ...(author ? [author] : [])];
  return { recipients, ctx, transitionTimestamp: updatedRecord[0]!.updated_at };
});

// tx commit 후 base role 발송 — recipients 는 tx 안 산정 결과를 그대로 사용 (cycle2 NFM2-02 정정 — helper 안 recipientStateAt 자동 부착 · 호출자 .map 책임 제거)
try {
  const result = await enqueueNotificationEnvelope(sqlBase, {
    eventType: "reviewer-approved",
    instanceId: txResult.ctx.instanceId,
    contentRef,
    contentTitle,
    recipients: txResult.recipients,  // helper 가 이미 recipientStateAt 부착
    workflowTransitionTimestamp: txResult.transitionTimestamp.toISOString(),
    metadata: {
      recordId,
      adminPath: `/admin/${instanceSlug}/review-queue/${entryId}`,  // NF-DEFER-19 까지 ctaUrl seed
    },
  });
  if (result.ok && !result.deduped) {
    // (옵션) audit_event 안 'notification-envelope-enqueued' emit (운영 가시화)
  }
} catch (err) {
  console.error("[reviewer-approved emit] failed", err);
  // action 성공 자체에 영향 없음 (NF-API-09 정합)
}
```

**결정 (NF-API-08·09)**:
- **(NF-API-08 · cycle1 NFM-01 정정)** recipients 산정 = tx 안 만 (resolveRoleRecipients · resolveAuthorRecipient 둘 다 ScopedTx 받음). envelope insert = tx commit 후 base role + sqlBase. recipients 결과를 tx 외부로 반환 + enqueueNotificationEnvelope 호출 시 그대로 입력. compliance-assistant M0 § 6.2 정합. recipients tx 안 산정 vs envelope emit tx commit 후 race window 는 NF-RECIP-08 (recipientStateAt 메타) 로 추적.
- **(NF-API-09)** emit 실패 시 try/catch + console.error — 기존 audit emit fallback 패턴 정합. 본 action 의 성공 자체에 영향 없음 (사용자 UX 우선). `EnvelopeEnqueueRaceError`·`InvalidEnvelopeInputError` 둘 다 caller try/catch 안 console.error 로 fallback.

### 5.3 매트릭스 snapshot 결정 (NF-API-10) — cycle2 NFM2-09 정정 · cycle3 NFM3-01 위치 이동

```typescript
// apps/web/src/lib/notifications/matrix.ts
import type { NotificationEventType, NotificationCriticality } from "@glitzy/core-content";

export type MatrixSnapshot = {
  criticality: NotificationCriticality;
  immediateChannels: Array<"email" | "slack" | "inApp">;
  fallbackChannels: Array<"email" | "slack" | "inApp">;
  digestCadence: "daily" | "weekly" | null;     // null = digest 미적용
  quietHoursPolicy: "bypass" | "respect";
  optOutPolicy: "mandatory" | "digestOptOut-allowed";
};

// cycle3 NFM3-07 정정 — constructor 완전 명시
export class MatrixNotRegisteredError extends Error {
  constructor(message: string) {
    super(`MatrixNotRegisteredError: ${message}`);
    this.name = "MatrixNotRegisteredError";
  }
}

// REVIEW_WORKFLOW § 9.1.1 매트릭스 SoT · M0 v0.1 5종 만 등록 (4 active + 1 enum 등록)
const M0_MATRIX: Partial<Record<NotificationEventType, MatrixSnapshot>> = {
  "content-gate-queued": {
    criticality: "critical",
    immediateChannels: ["email", "slack", "inApp"],
    fallbackChannels: ["inApp"],
    digestCadence: null,
    quietHoursPolicy: "bypass",
    optOutPolicy: "mandatory",
  },
  "reviewer-approved": {
    criticality: "normal",
    immediateChannels: ["inApp"],
    fallbackChannels: [],
    digestCadence: "daily",
    quietHoursPolicy: "respect",
    optOutPolicy: "digestOptOut-allowed",
  },
  "reviewer-rejected": {
    criticality: "high",
    immediateChannels: ["email", "inApp"],
    fallbackChannels: ["inApp"],
    digestCadence: null,
    quietHoursPolicy: "respect",
    optOutPolicy: "mandatory",
  },
  "publish": {
    criticality: "normal",
    immediateChannels: ["inApp"],
    fallbackChannels: [],
    digestCadence: "daily",
    quietHoursPolicy: "respect",
    optOutPolicy: "digestOptOut-allowed",
  },
  "blocked-correction-required": {
    criticality: "critical",
    immediateChannels: ["email", "slack", "inApp"],
    fallbackChannels: ["inApp"],
    digestCadence: null,
    quietHoursPolicy: "bypass",
    optOutPolicy: "mandatory",
  },
};

export function resolveMatrixSnapshot(eventType: NotificationEventType): MatrixSnapshot {
  const snap = M0_MATRIX[eventType];
  if (!snap) {
    throw new MatrixNotRegisteredError(
      `Matrix not registered for eventType=${eventType}. M0 v0.1 supports 5 eventTypes only (NF-DEFER-16/17/18/20 cascade).`,
    );
  }
  return snap;
}

export function resolveCriticality(eventType: NotificationEventType): NotificationCriticality {
  return resolveMatrixSnapshot(eventType).criticality;
}
```

**결정 (NF-API-10·11)**:
- **(NF-API-10)** M0 v0.1 안 5 eventType 만 매트릭스 등록 — 4 active + 1 enum 등록 만 (`blocked-correction-required` · CA-DEFER-15 까지 emit 없음 · 매트릭스 만 보존). 다른 36종 (41 - 5) NotificationEventType 입력 시 `MatrixNotRegisteredError` throw — NF-DEFER-16/17/18/20 cascade 합류 시 ADD VALUE + matrix row 추가.
- **(NF-API-11)** envelope.metadata.matrix snapshot freeze — 호출 시점 매트릭스 값 그대로 저장. 향후 매트릭스 drift 회피 (NF-DEFER-13 policyVersion 병렬 보관 cascade 까지).

## 6. server-action 통합 결정

### 6.1 4 server action 안 emit 통합 (NF-INTEGRATION-01)

`apps/web/src/lib/compliance/entity-actions.ts` + `apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts` 안 patch:

| server action | emit 트리거 | NotificationEventType | recipients 산정 | content_title 출처 |
|---|---|---|---|---|
| `submitForReviewAction` | `contentGateEntryId !== null` 시 (자동 큐 진입 — auto-gate.ts) | `content-gate-queued` | resolveRoleRecipients(tx, instanceId, finalRoles). 0건 → skip + console.warn | entity row 안 title 컬럼 (Article.title · TreatmentPage.title · LegalDocument.title · FAQ.question · Publication.title · MediaAppearance.title) |
| `approveEntryAction` | `out.allApproved === true` 시 만 (AND 게이트 충족) | `reviewer-approved` | resolveRoleRecipients(operator) + resolveAuthorRecipient. operator 0건 → skip + console.warn | 동상 |
| `rejectEntryAction` | 항상 | `reviewer-rejected` | resolveAuthorRecipient 만. author skip 시 envelope 자체 skip + console.warn | 동상 |
| `publishContentAction` | 항상 | `publish` | resolveRoleRecipients(operator) 만. client-approver (CA-DEFER-10) 미합류. **operator 0건 → skip + console.warn (cycle2 NFM2-05 정정)** | 동상 |

> **submitForReviewAction 안 manual-review 큐 진입은 NotificationEvent emit 없음** — § 9.1 NotificationEventType enum 안 해당 이벤트 부재 (운영자 본인 액션). audit_event 안 `content-submitted-for-review` 는 별도 유지 (compliance-assistant M0). manual-review 큐 진입 시 medical/legal 검수자 알림 부재는 운영 risk — NF-DEFER-20 (manual-review-queued NotificationEventType cascade · cycle1 NFM-11).

> **(cycle2 NFM2-07 marker)** publish 액션 actor (operator role 보유) 가 recipients 안 operator 합집합 안 포함 시 actor 자기 자신 알림 발생 — notifications spec § 5.3 in-app self-notification 일반 허용 정합. Phase Alpha 안 actor self-suppression 옵션 운영 결정 — NF-DEFER-22 cascade.

### 6.2 content_title 산정 (NF-INTEGRATION-02) — cycle2 NFM2-10 marker

**(cycle2 NFM2-10 marker)** 6 entity 안 title 컬럼 실 schema 검증은 code cycle 안 (packages/core-content/migrations/C0001~C0006/C0010~C0012 또는 schema.ts 안 컬럼명 정합 grep). 본 plan 안 표 = 예상 매핑 (운영 시 컬럼명 변경 시 patch 동반).

server action tx 안 entity row 안 title 컬럼 SELECT 추가 (기존 row 조회 시점 합산):

| contentType | title 컬럼 |
|---|---|
| Article | `article.title` |
| TreatmentPage | `treatment_page.title` |
| LegalDocument | `legal_document.title` |
| FAQ | `faq.question` |
| Publication | `publication.title` |
| MediaAppearance | `media_appearance.title` |

NULL/빈 문자 fallback = `"<제목 없음>"` (envelope.metadata 안 `contentTitleSource='fallback'` 마킹). **(cycle3 NFM3-10 marker)** XSS 위험 없음 — envelope.metadata 저장 만 · UI render 시 sanitize 책임은 NF-DEFER-10 (in-app inbox UI cycle).

### 6.3 submitterUserId 슬롯 채움 (NF-INTEGRATION-03)

`submitForReview` server action 안 ComplianceRecord INSERT 시 metadata 안 추가:

```typescript
// apps/web/src/lib/compliance/server-actions.ts § submitForReview INSERT
${JSON.stringify({
  manualReview: envelope.meta.manualReview,
  catalogVersion: envelope.meta.catalogVersion,
  catalogHash: envelope.meta.catalogHash,
  ...(envelope.meta.exemptReason ? { exemptReason: envelope.meta.exemptReason } : {}),
  submitterUserId: ctx.userId,   // NF-INTEGRATION-03 신설
})}::jsonb
```

C0016 sentinel backfill row 안 submitterUserId 없음 (정상 — author recipient null 처리).

### 6.4 emit 실패 정책 (NF-INTEGRATION-04)

- try/catch + console.error — action 성공 자체에 영향 없음 (compliance-assistant M0 § 6.2 정합).
- `deduped=true` 시 console.info 로그 (운영 가시화 — 동일 transition 재실행 검출).
- `skipped="no-recipients"` 시 console.warn 로그 (운영 alert seed — admin_user 누락 instance 검출).
- audit_event 안 `notification-envelope-enqueued` 1건 부수 emit (M0 v0.1 — 향후 NF-DEFER-05 worker 합류 시 `notification-dispatched` 로 대체). payload 안 `{outboxId, eventType, recipientsCount, deduped}`. **(cycle5 NFM5-05 정정)** `recipientsCount = recipients.length` (row 수 · 동일 user 가 다중 role 보유 시 다중 count — NF-DEFER-23 cascade 까지). 본 audit eventType 은 신규 — REVIEW_WORKFLOW § 10.2.1 cascade marker (NF-CASCADE-06).

### 6.5 reviewer-approved 발송 조건 (NF-INTEGRATION-05) — cycle3 NFM3-02·05 정정

`approveEntryAction` 안 `result.out.allApproved === true` 시 만 emit. AND 게이트 미충족 시 (`entryStatus === "in-progress"` 잔존) emit 없음. NF-EVENT-05 결정 정합. **(cycle3 NFM3-02·05 정정)** recipients 는 tx 안 산정 후 txResult 안 반환 — sqlBase 안 산정 미허용 (cycle1 NFM-01 결정 정합):

```typescript
// approve server action 패턴 — tx 안 recipients 산정 후 tx commit 후 envelope emit
const txResult = await withSkeletonTx({ signedToken, instanceId }, async (tx, ctx) => {
  const out = await approveContent(tx, ctx, { ... });
  if (!out.allApproved) {
    return { ok: true as const, ctx, out, recipients: null, transitionTimestamp: null };
  }
  // allApproved=true 시 만 recipients 산정 + transitionTimestamp 확보
  const recordRows = await tx<{ updated_at: Date }[]>`
    SELECT updated_at FROM compliance_record WHERE id = ${args.recordId}::uuid
  `;
  const roleRecipients = await resolveRoleRecipients(tx, ctx.instanceId, ["operator"]);
  const author = await resolveAuthorRecipient(tx, ctx.instanceId, args.recordId);
  const recipients = [...roleRecipients, ...(author ? [author] : [])];
  return {
    ok: true as const, ctx, out, recipients,
    transitionTimestamp: recordRows[0]!.updated_at,
  };
});

// tx commit 후 envelope emit
if (txResult.ok === true && txResult.out.allApproved === true && txResult.recipients !== null && txResult.recipients.length > 0) {
  try {
    await enqueueNotificationEnvelope(sqlBase, {
      eventType: "reviewer-approved",
      instanceId: txResult.ctx.instanceId,
      contentRef: args.contentRef,
      contentTitle, // entity row 안 title 컬럼 SELECT (NF-INTEGRATION-02)
      recipients: txResult.recipients,
      workflowTransitionTimestamp: txResult.transitionTimestamp!.toISOString(),
      metadata: {
        recordId: args.recordId,
        adminPath: `/admin/${instanceSlug}/review-queue/${entryId}`,
      },
    });
  } catch (err) {
    console.error("[reviewer-approved emit] failed", err);
    // action 성공 자체에 영향 없음 (NF-API-09 정합)
  }
} else if (txResult.ok === true && txResult.out.allApproved === true && txResult.recipients !== null && txResult.recipients.length === 0) {
  console.warn("[reviewer-approved emit] skipped — recipients=[] (operator 0건 활성 instance_membership)");
}
```

> **(cycle3 NFM3-05 정정)** recipients 는 tx 안 산정 후 tx 외부로 반환 (cycle1 NFM-01 결정 — sqlBase 안 산정 미허용). 추가 round trip 회피 + recipients drift race window NF-RECIP-08 (recipientStateAt 메타) 로 추적.

## 7. § 8.1 시나리오 cascade — NF-TEST-01

| # | 시나리오 | 통과 기준 | 검증 방식 |
|---|---|---|---|
| 1 | Article (Low) submitForReview (auto-gate 없음 — High 입력 없을 시) → `notification_outbox` 0 row | row count = 0 (envelope skip 정상 — manual-review 는 NotificationEventType 미정의). **(fixture)** admin_user.active=true · instance_membership.active=true operator 1+ | vitest |
| 2 | Article (High) submitForReview → check() stub gateRequired=true → auto-gate.ts 가 entry 생성 → `content-gate-queued` envelope 1 row · recipients={operator, medical} | row.event_type='content-gate-queued' · row.criticality='critical' · recipients[].recipientRole array 안 operator+medical · row.metadata.matrix.criticality='critical'. **(cycle3 NFM3-03 fixture)** admin_user.active=true · instance_membership.active=true operator 1+ · physician-reviewer 1+ 사용자 setup | vitest |
| 3 | `enqueueNotificationEnvelope` 동일 sourceEventId 재호출 (동일 transition · workflowTransitionTimestamp 동일) → 두 번째 호출 `deduped=true` · row count = 1 | source_event_id sha256 결정성 · UNIQUE 보장 | vitest |
| 4 | Article (Low) approveEntryAction(operator) → AND 게이트 충족 (operator 1 role only) → `reviewer-approved` envelope 1 row · recipients={author, operator} | row.event_type='reviewer-approved' · recipients 안 author (submitter) + operator (활성 instance_membership) · row.criticality='normal'. **(fixture)** submitter active=true · operator 1+ | vitest |
| 5 | Article (Medium) approveEntryAction(operator) → AND 게이트 미충족 (medical 잔존) → envelope 0 row (NF-EVENT-05 · allApproved=false) | row count = 0 | vitest |
| 6 | Article (Medium) approveEntryAction(operator) → approveEntryAction(medical) 순차 → 두 번째 호출 안 envelope 1 row | row.event_type='reviewer-approved' · 두 번째 호출 만 emit. **(fixture)** operator 1+ · physician-reviewer 1+ · submitter active=true | vitest |
| 7 | rejectEntryAction(reason ≥ 50자) → `reviewer-rejected` envelope 1 row · recipients={author 만} | row.event_type='reviewer-rejected' · row.criticality='high' · recipients 안 author 만 (operator 미포함). **(fixture)** submitter active=true | vitest |
| 8 | rejectEntryAction author skip (submitter deactivated) → envelope 0 row + console.warn 로그 | row count = 0 · NF-RECIP-06 marker. **(fixture)** submitter active=false | vitest |
| 9 | publishContentAction → `publish` envelope 1 row · recipients={operator 만} | row.event_type='publish' · client-approver 미포함 (CA-DEFER-10) · row.criticality='normal'. **(fixture)** operator 1+ | vitest |
| 10 | LegalDocument 발행 시퀀스 (submit → approve(operator) → approve(legal) → publish) → emit timing 별 검증 (cycle3 NFM3-04 정정) | (1) submit → emit 없음 (manual-review · LegalDocument exempt 이므로 content-gate 도 없음). (2) operator approve → emit 없음 (allApproved=false · legal 잔존). (3) legal approve → `reviewer-approved` emit 1건 (allApproved=true). (4) publish → `publish` emit 1건. 총 2건. **(fixture)** operator 1+ · legal-reviewer 1+ · submitter active=true | vitest + e2e |
| 11 | (cycle4 NFM4-06 정정) `content-gate-queued` 발송 case 한정 — finalRoles 매칭 사용자 0건 → helper 가 envelope 생성 전 `skipped='no-recipients'` 분기 · row count = 0 (author recipient 는 본 시나리오 외 — content-gate-queued 는 author 미산정) | helper 분기 · CHECK nonempty 위반 회피. **(fixture)** admin_user.active=true · instance_membership.active=true 사용자 0건 (operator · physician-reviewer · legal-reviewer 모든 role) | vitest |
| 12 | emit 실패 (sqlBase pool exhausted simulation) → server action 자체 ok=true 반환 + console.error 로그 | UX 영향 없음 | vitest |
| 13 | `notification-envelope-enqueued` audit row 1건 부수 emit · payload 안 `{outboxId, eventType, recipientsCount, deduped:false}` | audit_event 안 NotificationEvent 별 1건 | vitest |
| 14 | `compliance_record.metadata->>'submitterUserId'` = submitForReview actor.userId · 후속 reject 안 author recipient 동일 user | NF-METADATA-01 정합 | vitest + e2e |
| 15 | (cycle3 NFM3-09 신설 · **cycle4 NFM4-01 정정** — sentinel 키워드 제거) submitter user 가 submit 후 deactivated 된 일반 (non-sentinel) ComplianceRecord 안 후속 reviewer-approved 발송 시 author skip + console.warn · operator 만 발송. reviewer-rejected case 는 시나리오 8 안 검증 (envelope 자체 skip) | reviewer-approved: recipients 안 author 미포함 · operator 만. **(fixture)** submitter active=false (submit 후 deactivated 시뮬레이션) · operator 1+ active=true | vitest + e2e |

## 8. 작업 단위

| # | 작업 | 산출물 |
|---|---|---|
| 1 | C0020 notification_outbox migration | packages/core-content/migrations/C0020_notification_outbox.sql |
| 2 | Drizzle schema v0.6 — 1 신규 table + 5 enum + compliance_record.metadata schema cascade marker | packages/core-content/src/schema.ts |
| 3 | NotificationEvent shape · sourceEventId helper · matrix snapshot helper | apps/web/src/lib/notifications/{types, source-event-id, matrix}.ts |
| 4 | recipients 산정 helper (resolveRoleRecipients · resolveAuthorRecipient) | apps/web/src/lib/notifications/recipients.ts |
| 5 | enqueueNotificationEnvelope helper (base role + SET LOCAL + ON CONFLICT DO NOTHING) | apps/web/src/lib/notifications/enqueue.ts |
| 6 | submitForReview 안 compliance_record.metadata.submitterUserId 슬롯 채움 + entity row title 컬럼 추가 SELECT | apps/web/src/lib/compliance/server-actions.ts |
| 7 | 4 server action emit 통합 (submitForReviewAction · approveEntryAction · rejectEntryAction · publishContentAction) | apps/web/src/lib/compliance/entity-actions.ts + apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts |
| 8 | manifest 20단계 patch (19 + C0020) | packages/migrations-runner/src/manifest.ts |
| 9 | audit_event eventType `notification-envelope-enqueued` 추가 + REVIEW_WORKFLOW § 10.2.1 cascade marker (**cycle2 NFM2-08 정정**: audit_event.event_type=TEXT 컬럼 정합 — DB 마이그레이션 불필요 · 문서 cascade 만) | doc patch only |
| 10 | vitest scenarios 1~14 | apps/web/src/lib/notifications/__tests__/enqueue.test.ts |
| 11 | docs cascade — **7 NF-CASCADE marker** (cycle2 NFM2-04 정정): REVIEW_WORKFLOW M0 활성화 marker (NF-CASCADE-01) · LOCATION_LEGAL_PLAN LL-DEFER-01 admin scope 완전 해소 marker (NF-CASCADE-02) · COMPLIANCE_ASSISTANT_M0_PLAN CA-DEFER-14 부분 해소 marker (NF-CASCADE-03) · DATA_MODEL C-10 submitterUserId marker (NF-CASCADE-04) · manifest 20단계 marker (NF-CASCADE-05) · REVIEW_WORKFLOW § 10.2.1 `notification-envelope-enqueued` marker (NF-CASCADE-06) · packages/notifications-outbox v0.2 Spike B 패턴 통합 전략 marker (NF-CASCADE-07) | doc patches |

## 9. M0 v1.0 cascade markers (defer 정리)

### 9.1 notifications Feature 본 구현 합류 (별 cycle)

- `NF-DEFER-01`: notifications Feature 본 구현 11 tables + Redis (Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·DeadLetterAttempt + DedupeCache)
- `NF-DEFER-02`: 채널 어댑터 (email/slack/inApp) · provider 호출 · rate limit · DeliveryAttempt attemptNumber 동시성 · advisory lock per (payloadId, channel)
- `NF-DEFER-03`: dedupe Redis SET NX EX 원자 · dedupeWindowSeconds · sourceEventId 재사용 차단 (envelope 내 idempotency 와 별개)
- `NF-DEFER-04`: worker harness (claim SKIP LOCKED · markCompleted · markRetry · markFailedPermanent · reclaimStale · `packages/notifications-outbox` v0.2 Spike B 패턴 합류)
- `NF-DEFER-05`: audit_event `notification-dispatched` envelope 종료 요약 (REVIEW_WORKFLOW § 10.2.1 — worker 완료 시 emit. M0 v0.1 안 `notification-envelope-enqueued` 부수 emit 으로 대체)
- `NF-DEFER-06`: digest 모드 (DigestPolicy AST · DigestBucket · DigestBucketPayload · daily/weekly cadence · digestOptOut 정책)
- `NF-DEFER-07`: suppression (soft/hard · autoReleaseAt · 채널별 카운터 · 운영자 수동 unsuppress · `notification-suppression-unsuppressed` audit)
- `NF-DEFER-08`: DLQ + DeadLetterAttempt · `resendDeadLetter` command · `notification-resend-attempted` audit · 30일 보존
- `NF-DEFER-09`: broadcast 모드 (slackUserId 미보유 시 · sentinel dedupeKey · `broadcastAttemptId` · critical 이벤트만 허용)
- `NF-DEFER-10`: in-app NotificationInbox UI · `readAt` 마킹 · `notification-read` audit · inactive 사용자 historical inbox 정책
- `NF-DEFER-11`: critical-aware 필터 순서 13단계 · `skipped-*` DeliveryStatus 13종
- `NF-DEFER-12`: LocationProfile metadata.locationRef · businessHours 90일 탐색 · holidayCalendar
- `NF-DEFER-13`: `notificationPolicyVersion` 병렬 보관 (12개월 최소 지원 · deprecation · build fail)
- `NF-DEFER-19`: `ctaUrl` 자동 합성 (adminBaseUrl + ctaRouteTemplates) — M0 envelope.metadata.adminPath 만

### 9.1.1 본 plan 별 cycle 합류 (cycle1·2 신설 markers — § 1.3 비범위 표 동반)

- `NF-DEFER-20` (cycle1 NFM-11 신설): `manual-review-queued` NotificationEventType — manual-review 큐 진입 시 finalRoles 안 운영자 외 검수자 (medical · legal) 통보. REVIEW_WORKFLOW § 9.1 enum 추가 cascade + 본 Feature cascade — Phase Alpha 또는 운영 시점 합류
- `NF-DEFER-21` (cycle2 NFM2-03 신설): super-admin (admin_user.is_super_admin=true) recipient 산정 — instance_membership row 부재 안전 fallback (admin_user 직접 SELECT). M0 v1.0 안 super-admin 수신자 이벤트 부재 (4 M0 active 모두 super-admin 부재) → defer. Phase Alpha 안 다른 Feature cascade 합류 시 합류 (content-migration · crm-sync 등)
- `NF-DEFER-22` (cycle2 NFM2-07 신설): action actor self-suppression — recipients 산정 안 actor.userId 제외 옵션 (Phase Alpha 안 운영 결정). M0 v0.1 안 actor 자기 자신 포함 (notifications spec § 5.3 in-app self-notification 허용 정합)
- `NF-DEFER-23` (cycle4 NFM4-02 신설): recipients[] per-user dedup — 동일 user 가 다중 role 보유 시 (예: operator + author) 1건 통합. M0 v0.1 안 (recipientId, recipientRole) 페어 단위 보존 · NF-DEFER-04 worker 합류 시 per-recipient dedupe 통합 (notifications spec § 4.1 4.c dedupe 정합)

### 9.2 다른 cycle 합류

- `NF-DEFER-14`: `content @createdBy` column 정식 추적 — 콘텐츠 모델 작성자 추적 cycle (별 plan)
- `NF-DEFER-15`: 외부 작성자 (AdminUser 없는 author — 클라이언트 직접 입력 콘텐츠) 발송 정책 — NF-DEFER-04 동반 (worker fallback 처리)
- `NF-DEFER-16` (cycle1 NFM-04 정정 cascade): `search-visibility-*`·`keyword-monitoring-*`·`asset-ingestion-*`·`crm-sync-*`·`content-migration-*` **28종** NotificationEventType (search-visibility 5 + keyword-monitoring 8 + asset-ingestion 5 + crm-sync 4 + content-migration 6) — 각 Feature 본 구현 cycle
- `NF-DEFER-17`: `prior-review-result`·`sla-imminent`·`sla-overdue`·`stale-queued`·`warning-queued` 5종 — CA-DEFER-05/06/08 + SLA scheduler cycle
- `NF-DEFER-18` (cycle1 NFM-04 정정 cascade): `analytics-report-ready`·`media-threshold-reached`·`media-threshold-released` **3종** — analytics-reporting Feature 본 구현 cycle

## 10. Cascade markers (다른 SoT 문서로 전파)

- `NF-CASCADE-01`: `docs/admin/REVIEW_WORKFLOW.md` § 9 M0 활성화 marker — NotificationEventType M0 활성 4종 + `blocked-correction-required` enum 등록 만. § 9.1.1 매트릭스 안 본 plan 적용 행 (`content-gate-queued`·`reviewer-approved`·`reviewer-rejected`·`publish`) 의 M0 active marker 추가. fallback 채널 등 실 라우팅은 NF-DEFER-01.
- `NF-CASCADE-02` (**cycle1 NFM-13 정정**): `docs/decisions/LOCATION_LEGAL_PLAN.md` § 2 비범위 표 + § 9.1 LL-DEFER-01 항목 → **admin scope 완전 해소** marker. **admin DB level 4단계** (legalCounsel 강제 · review-queued 전이 · ComplianceRecord pre-publish · NotificationEvent envelope) 모두 완료 — NotificationEvent envelope 부분이 본 plan 으로 해소. **사이트 빌드 export scope** (apps/worker + Git commit cascade — LegalDocument body 변경분 정적 사이트 반영) 은 M0_BUILD_EXPORT plan 안 별 marker — LL-DEFER-01 의 4단계 description 안 "status=published" 는 admin DB 상태 전이 (compliance-assistant M0 publishContent 가 책임) 이고 사이트 빌드 emit 은 LL-DEFER-01 scope 외.
- `NF-CASCADE-03`: `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` § 9.2 CA-DEFER-14 → **부분 해소** marker (envelope persist + 4 eventType emit + recipients fan-out 까지). 11 tables · channel adapter · digest · suppression · DLQ · broadcast 는 NF-DEFER-01.
- `NF-CASCADE-04` (**cycle4 NFM4-05 강화**): `docs/core/DATA_MODEL.md` C-10 ComplianceRecord metadata 슬롯 marker — `submitterUserId` 키 명세 추가. C-10 안 metadata 슬롯 schema 명시 부재 (freeform JSONB) → 본 plan 안 신설 키 (`submitterUserId`) 명세 추가 marker. CA-DEFER-13 매핑 표 안 NF-DEFER-14 marker (풀 컬럼 화 시 entity 모델 작성자 추적 cycle).
- `NF-CASCADE-05`: `packages/migrations-runner/src/manifest.ts` — **20 단계** (19 + C0020). C0020 의 dependsOn = `instance` 만 (admin_user · instance_membership · audit_event 안 직접 FK 없음 — application layer 의존성 만).
- `NF-CASCADE-06`: `docs/admin/REVIEW_WORKFLOW.md` § 10.2.1 AuditAction enum — `notification-envelope-enqueued` 신규 enum 추가 (M0 v0.1 부수 audit emit · NF-DEFER-05 worker 합류 시 `notification-dispatched` 로 대체). **(cycle1 NFM-07 정정)** audit_event.event_type = TEXT 컬럼 정합 — enum cascade 마이그레이션 불필요 (문서 cascade 만).
- `NF-CASCADE-07` (**cycle1 NFM-16 정정**): `packages/notifications-outbox/src/outbox.ts` v0.2 Spike B 패턴 vs 본 plan `notification_outbox` table schema 차이 marker. Spike B 의 outbox table 컬럼 (status 5종 / attempts / max_attempts / next_attempt_at / locked_at / locked_by / last_error / last_error_class / completed_at / exhausted_at) vs 본 plan (status 3종 · worker 컬럼 없음). NF-DEFER-04 worker harness 합류 시 통합 전략 결정 marker — **(a)** 본 plan notification_outbox 에 worker 컬럼 ALTER ADD COLUMN (단일 table 유지) **OR (b)** 별도 worker_queue 테이블 신설 + outbox row → worker_queue 1:1 fan-out. 본 plan 채택 = NF-DEFER-04 합류 cycle 안 결정.

## 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-19 | **v1.0** | **Codex self-critique cycle 5 closeableAfterPatch=true 확정 acceptance** — blocking 0 · major 0 · minor 5 잔존 표현/정합 patch 모두 흡수. (NFM5-01) § 1.2 안 "vitest 14건" → "15건" 정정 + recipients 산정 3 → 4 case 분리. (NFM5-02) § 1.2 안 "NF-CASCADE-01~06" → "01~07" 정정. (NFM5-03) § 1.3 비범위 표 안 NF-DEFER-19 row 위치 정합 (NF-DEFER-15·16 사이로 이동). (NFM5-04) § 7 시나리오 fixture marker 안 "admin_user.active=true · instance_membership.active=true" 양쪽 명시 일괄 patch. (NFM5-05) § 6.4 audit_event payload `recipientsCount = recipients.length` 정합 marker (NF-DEFER-23 cascade 까지 row 수 · 동일 user 다중 role 시 다중 count). 누계 cycle 1+2+3+4+5 = 50 findings 전건 수용 (16+12+11+6+5). NF-DEFER 23종 + NF-CASCADE 7종 안정판. 실 SQL 코드 cascade 는 별 cycle (notifications M0 code v1.0). |
| 2026-05-19 | v0.5 | **cycle 4 self-critique 6 finding (blocking 1 · major 0 · minor 5) 전건 수용 patch**: (NFM4-01) 시나리오 15 의미 정정 — sentinel 키워드 제거 (sentinel ComplianceRecord 는 published 안 시작 · 워크플로 전이 안 됨) → 일반 ComplianceRecord 안 submitter submit 후 deactivated case (reviewer-approved 안 author skip + operator 만 발송). (NFM4-02) NF-DEFER-23 신설 (recipients[] per-user dedup — NF-DEFER-04 worker 합류 시). (NFM4-03) § 5.1 setTimeout polling 안 AbortSignal 미지원 marker. (NFM4-04) § 5.1 tx.json() 안 `as any` postgres.js 타입 제한 marker. (NFM4-05) NF-CASCADE-04 안 DATA_MODEL C-10 metadata 슬롯 schema 명시 부재 → 본 plan 안 submitterUserId 키 신설 marker 강화. (NFM4-06) 시나리오 11 fixture 정정 — content-gate-queued case 한정 (author 미산정 이벤트). 누계 cycle 1+2+3+4 = 45 findings 전건 수용. NF-DEFER 23종 + NF-CASCADE 7종. 수렴 추세 16 → 12 → 11 → 6. |
| 2026-05-19 | v0.4 | **cycle 3 self-critique 11 finding (blocking 2 · major 3 · minor 6) 전건 수용 patch**: (NFM3-01) § 5.3 NF-API-10 섹션 위치 정정 — § 5.2 NF-API-08 직후 (§ 6. server-action 통합 결정 앞) 으로 이동. (NFM3-02) § 6.5 NF-INTEGRATION-05 예시 코드 안 sqlBase 안 resolveRoleRecipients 호출 잔재 → tx 안 산정 + tx 외부 반환 + enqueueNotificationEnvelope 호출 시 recipients 직접 입력 패턴 정합 (cycle1 NFM-01 결정 정합). (NFM3-03) § 7 시나리오 1~10·15 안 test fixture 안 instance_membership active=true 사용자 setup 명시. (NFM3-04) 시나리오 10 LegalDocument 발행 시퀀스 안 emit timing 별 검증 (operator approve→emit 없음 · legal approve→emit 1건 · publish→emit 1건 · 총 2건). (NFM3-05) § 6.5 하단 주석 정정 — "후자 권장" → "tx 안 산정 (cycle1 NFM-01 결정)". (NFM3-06) 시나리오 11 표현 정정 — "recipients=[] envelope" → "recipients=[] 입력 시 helper 가 envelope 생성 전 skipped 분기". (NFM3-07) MatrixNotRegisteredError constructor 완전 명시. (NFM3-08) eventType zod enum 안 core-content 의 notificationEventTypeEnumValues 재사용 marker. (NFM3-09) 시나리오 15 신설 — C0016 sentinel ComplianceRecord 안 author skip 시나리오. (NFM3-10) § 6.2 XSS 위험 없음 marker. (NFM3-11) § 5.2 UPDATE SET 절 medical role approve 예시 + 다른 case 분기 marker. § 9.2 NF-DEFER-16·18 description 정정 (28종 · 3종). 누계 cycle 1+2+3 = 39 findings 전건 수용. NF-DEFER 22종 + NF-CASCADE 7종. 수렴 추세 16 → 12 → 11. |
| 2026-05-19 | v0.3 | **cycle 2 self-critique 12 finding (blocking 1 · major 4 · minor 7) 전건 수용 patch**: (NFM2-01) § 3.1 NotificationRecipient TypeScript 타입 안 recipientStateAt 추가 — zod schema 와 통일. (NFM2-02) § 4.1·4.2 helper 반환 타입 안 recipientStateAt 자동 부착 + § 5.2 예시 코드 .map 제거. (NFM2-03) NF-DEFER-21 신설 (super-admin recipient 산정). (NFM2-04) § 8 작업 11 안 7 NF-CASCADE marker 정정. (NFM2-05) § 4.3·6.1 publish 행 안 operator 0건 → skip + console.warn 명시 (NF-RECIP-03 정합). (NFM2-06) § 4.3 "dedup" 표현 → "보존" 정정. (NFM2-07) NF-DEFER-22 신설 (action actor self-suppression). (NFM2-08) § 8 작업 9 안 audit_event.event_type=TEXT 명시 (DB 마이그레이션 불필요). (NFM2-09) § 5.3 NF-API-10 신설 — resolveMatrixSnapshot helper 시그니처 + M0_MATRIX 5종 + MatrixNotRegisteredError. (NFM2-10) § 6.2 안 6 entity title 컬럼 실 schema 검증 marker (code cycle). (NFM2-11) § 5.1 NF-API-07b 안 Node runtime 명시. (NFM2-12) § 9.1.1 신설 + § 1.3 비범위 표 안 NF-DEFER-20~22 추가. 누계 cycle 1+2 = 28 findings 전건 수용. NF-DEFER 22종 + NF-CASCADE 7종. 수렴 추세 16 → 12. |
| 2026-05-19 | v0.2 | **cycle 1 self-critique 16 finding (blocking 4 · major 5 · minor 7) 전건 수용 patch**: (NFM-01) recipients 산정 helper signature 통일 — ScopedTx 만 받는 단일 시그니처 + tx 안 산정 + tx 외부 반환 + § 6.5 예시 코드 정합. (NFM-02) enqueueNotificationEnvelope race window 안 length===0 분기 + 100ms × 1회 polling + EnvelopeEnqueueRaceError throw. (NFM-03) workflowTransitionTimestamp 출처 server action 별 표 추가 (submit/approve→record.updated_at · reject→entry.updated_at · publish→record.updated_at). (NFM-04) NF-DEFER-18 description 정정 (analytics-report-ready + media-threshold-reached/released 3종) + NF-DEFER-16 28종 정확 표기 + § 2.3 NF-SCHEMA-05c 41종 누적 매핑 표. (NFM-05) sourceEventId 안 instanceId 추가 결정 marker (spec 권장 vs 안전성 강화 분기 명시). (NFM-06) helper 진입 zod schema 검증 + InvalidEnvelopeInputError. (NFM-07) audit_event.event_type=TEXT 명시 (마이그레이션 불필요 · manifest 20 유지). (NFM-08) recipients tx vs envelope emit race window marker + recipientStateAt 메타 (NF-RECIP-08). (NFM-09) outbox.id = NotificationEvent.eventId 명시 + 향후 마이그레이션 strategy. (NFM-10) "46종" → "41종" 정정. (NFM-11) NF-EVENT-07 운영 risk 명시 + NF-DEFER-20 신설 (manual-review-queued). (NFM-12) instanceId UUID 검증 zod 통합. (NFM-13) NF-CASCADE-02 admin scope 완전 해소 정정 (build/export scope 분리). (NFM-14) PostgreSQL 12+ ADD VALUE in-tx 정합 marker. (NFM-15) § 6.5 예시 코드 완성. (NFM-16) NF-CASCADE-07 신설 (packages/notifications-outbox v0.2 Spike B 패턴 통합 전략 marker). 누계 cycle 1 = 16 findings 전건 수용. NF-DEFER 20종 + NF-CASCADE 7종. |
| 2026-05-19 | v0.1 | 초안 작성. M0 vertical slice scope — notification_outbox 1 신규 table + 5 enum + envelope shape + sourceEventId 결정 함수 + recipients 산정 helper + enqueueNotificationEnvelope helper + 4 server action emit 통합 + 14 vitest 시나리오. 19 NF-DEFER marker. 6 NF-CASCADE marker. LL-DEFER-01 완전 해소 + CA-DEFER-14 부분 해소 목적. |
