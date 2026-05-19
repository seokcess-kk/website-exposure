# NOTIFICATIONS_M0_PLAN v0.1 — cycle 1 review (self-critique)

## summary
- 본 cycle 지적 수: blocking=4 major=5 minor=7 (총 16)
- closeableAfterPatch: false (blocking 잔존)
- 수렴 추세 추적: (이전 cycle 없음 — 본 cycle 이 첫)

## blocking

- **NFM-01**: recipients 산정 helper 시그니처 vs 호출 위치 불일치 (tx 안 vs sqlBase 안)
  - 위치: plan § 4.1·4.2 (NF-RECIP-01·04 — helper signature `tx: ScopedTx`) vs plan § 5.2 NF-API-05 (recipients tx 안 미리 산정 권장) vs plan § 6.5 NF-INTEGRATION-05 코드 예시 (`resolveRoleRecipients(sqlBase, ...)` 호출 — sqlBase 입력)
  - 근거(SoT): compliance-assistant M0 § 6.2 audit emit 패턴 — tx 안 비즈니스 로직 + tx commit 후 base role emit. 본 plan 도 동일 패턴 채택 명시 (§ 5.2 NF-API-05) 하지만 실 코드 예시 (§ 6.5) 안 sqlBase 호출 — 시그니처 불일치
  - 문제: helper 가 ScopedTx 만 받으면 § 6.5 예시 코드 컴파일 실패. sqlBase 도 받게 하려면 union type 또는 별도 함수 시그니처 필요. 또한 NF-API-05 의 "recipients tx 안 미리 산정 + tx 종료 후 사용" 권장과 § 6.5 안 "tx 종료 후 sqlBase 호출" 권장이 충돌 — 두 패턴 중 하나 선택 강제.
  - 권장 patch: § 4.1·4.2 helper signature 통일 — option A `(sql: postgres.Sql | ScopedTx, ...)` union type + base role 호출 시 SET LOCAL ROLE app_tenant_user 패턴 내장. option B 권장 = recipients 산정도 tx 안에서 만 (resolveRoleRecipients / resolveAuthorRecipient 둘 다 tx 안 호출) + 결과를 tx 외부로 반환 + tx commit 후 enqueueNotificationEnvelope 호출 시 recipients[] 직접 입력. § 6.5 예시 코드도 동일 패턴으로 수정.

- **NFM-02**: enqueueNotificationEnvelope ON CONFLICT DO NOTHING + UNION ALL SELECT race 안 0 row 결과 미처리 — `rows[0]!` non-null assertion crash 가능
  - 위치: plan § 5.1 NF-API-01·02 (helper 구현 코드 안 `const row = rows[0]!;`)
  - 근거(SoT): notifications spec § 3.3 idempotency 계약 — `duplicate caller 결과 계약` 안 "기존 receipt의 receiptState별 응답" 명시. 본 plan 안 UNION ALL fallback 으로 충분하지 않은 race window: (A) 동시 worker A·B 가 INSERT 시도 → A 성공 commit 전 B 의 ON CONFLICT 분기 → (B) 의 UNION ALL SELECT 시점 A 미commit → 0 row 반환
  - 문제: `rows[0]!` 안 non-null assertion 안 의해 runtime crash. notifications spec § 3.3 안 권장 polling pattern (`receiptState="accepted"` 시 최대 500ms 짧은 poll) 부재.
  - 권장 patch: § 5.1 helper 안 (1) 결과 length === 0 분기 — retryable error throw OR 1회 polling (100ms × 5 = 500ms · spec § 3.3 정합). (2) `SELECT` 가 단일 round trip 안 부재 결과 시 transaction retry 또는 SERIALIZABLE isolation 채택. 본 plan 채택 = 단일 round trip + length 0 분기 시 100ms 후 1회 재시도 (notifications spec § 3.3 안 짧은 poll 패턴 정합) — 재시도도 0 row 시 retryable error throw.

- **NFM-03**: `workflowTransitionTimestamp` 출처 server action 별 모호 — 결정성 보장 안 됨
  - 위치: plan § 3.2 NF-EVENT-03 ("tx 안 갱신된 row 의 updated_at 값 사용" · "compliance_record.updated_at 또는 review_queue_entry.updated_at")
  - 근거(SoT): notifications spec § 9.2.1 idempotency 계약 — `sourceEventId` 호출자 결정적 생성 요구. 본 plan 안 sourceEventId 안 timestamp 가 결정성 입력. 그러나:
    - submitForReviewAction: review_queue_entry (manual-review · content-gate 2건) + compliance_record (1건) INSERT — 3+ row update_at 중 어느?
    - approveEntryAction: review_queue_entry.updated_at vs compliance_record.updated_at vs entity.updated_at — 어느?
    - publishContentAction: compliance_record.updated_at vs entity.updated_at — 어느?
  - 문제: 동일 PostgreSQL tx 안 `now()` 동일 보장이지만 multi-row UPDATE 안 trigger updated_at 가 동일 값 보장 위해서는 동일 query 안 또는 동일 statement_timestamp. 본 plan 안 server action 별 명시 부재 → 구현 안 분기 결정 부재 → 코드 cycle 안 drift 위험.
  - 권장 patch: § 3.2 NF-EVENT-03 안 server action 별 timestamp 출처 표 추가:
    - `submitForReviewAction` → `compliance_record.updated_at` (1차 INSERT 의 RETURNING)
    - `approveEntryAction` (allApproved=true 시) → `compliance_record.updated_at` (role 슬롯 채움 UPDATE 의 RETURNING — entity 전이는 derived 이므로 record 가 SoT)
    - `rejectEntryAction` → `review_queue_entry.updated_at` (entry 'resolved' UPDATE 안 RETURNING — rejection 은 entry 단위)
    - `publishContentAction` → `compliance_record.updated_at` (record_phase='published' UPDATE 안 RETURNING)
    - 모든 case 결정 공식 = `<row>.updated_at::text` (ISO 직렬화) 사용.

- **NFM-04**: NotificationEventType enum 매핑 안 count 부정합 — plan § 9.2 안 "32+5+1 = 38" 표현 vs spec § 9.1 실 enum 41종
  - 위치: plan § 1.3 안 NF-DEFER-16/17/18 description + plan § 9.2 안 부분 표기 (`"32+5+1"` 표현 자체는 plan 안 미발견 — but `"46종"` 표현은 plan 본문 안 부재; recipient role 안 "client M0 미합류" 등 표기 정합 검증 필요)
  - 근거(SoT): REVIEW_WORKFLOW § 9.1 NotificationEventType enum SoT 실제 멤버 수 = **41종** (awk 실측). plan 안 41종 매핑 표 부재 — NF-DEFER-16 (32종 다른 Feature) · NF-DEFER-17 (5종 SLA/CA) · NF-DEFER-18 (1종 analytics) 분류 합산 = 32+5+1 = 38 이지만 실 매핑은:
    - search-visibility 5 + keyword-monitoring 8 + asset-ingestion 5 + crm-sync 4 + content-migration 6 = **28** (NF-DEFER-16)
    - SLA/CA: prior-review-result + sla-imminent + sla-overdue + stale-queued + warning-queued = **5** (NF-DEFER-17)
    - analytics: analytics-report-ready + media-threshold-reached + media-threshold-released = **3** (NF-DEFER-18)
    - M0 active 4 + enum 등록만 1 = 5
    - 합계 = 28 + 5 + 3 + 5 = **41 ✓**
  - 문제: plan § 1.3 NF-DEFER-18 안 `analytics-report-ready` 만 명시 — 그러나 `media-threshold-*` 2종도 analytics-reporting Feature 산하 (REVIEW_WORKFLOW § 9.1 안 cascade comment `# features/analytics-reporting.md 1차 cycle cascade (F-2)`). NF-DEFER-18 description 정정 필요. 또한 NF-DEFER-16 안 "32종" 표기는 plan 본문 안 발견 안 됨 — 정확 표기 = 28종.
  - 권장 patch: § 1.3 NF-DEFER-18 description 정정 — `analytics-report-ready · media-threshold-reached · media-threshold-released 3종`. § 9.2 NF-DEFER-16 description 안 28종 명시 (search-vis 5 + keyword 8 + asset 5 + crm 4 + migration 6). cycle 1 acceptance precondition 안 매핑 41종 100% 정합 검증 추가.

## major

- **NFM-05**: notifications spec § 9.2.1 권장 sourceEventId 패턴 (instanceId 미포함) vs plan § 3.2 안 instanceId 추가 — 결정 marker 부재
  - 위치: plan § 3.2 NF-EVENT-02 (`canonical = ${eventType}:${instanceId}:${contentRef}:${workflowTransitionTimestamp}`)
  - 근거(SoT): notifications spec § 9.2.1 안 "권장 패턴: `sourceEventId = hash(eventType + contentRef + workflowTransitionTimestamp)` (호출자 책임)" — instanceId 미포함. 본 plan 안 instanceId 추가는 spec 권장과 분기.
  - 문제: spec 안 `UNIQUE(instanceId, sourceEventId)` 안 instanceId 가 이미 UNIQUE scope. hash 안 추가 instanceId 는 redundant. 본 plan 채택 결정 (안전성 강화 vs spec 권장 충실성) 명시 marker 부재.
  - 권장 patch: § 3.2 NF-EVENT-02 안 결정 marker 추가 — "spec § 9.2.1 권장 패턴은 instanceId 미포함이나 본 plan 안 multi-tenant scope 안전성 강화 (cross-instance source 사고 회피) 위해 추가. UNIQUE scope 와 redundant 이지만 hash collision audit 안 instance 별 격리 검증 가능 — 운영 결정". 또는 patch 대안 = spec 권장 패턴 (instanceId 미포함) 으로 통일 — UNIQUE 가 scope 책임.

- **NFM-06**: notification_outbox.recipients JSONB schema 검증 부재 — DB CHECK 안 array nonempty 만 · recipientId UUID 검증·recipientRole enum 매칭 검증 없음
  - 위치: plan § 2.1 NF-SCHEMA-03 (`CONSTRAINT notification_outbox_recipients_nonempty CHECK ...`)
  - 근거(SoT): notifications spec § 14.1 안 "모든 테이블 `id` UUID PK" · § 14.2 NotificationEventReceipt 안 `sourceEventId: string`. 본 plan 안 recipients JSONB shape `[{recipientId: UUID, recipientRole: enum}]` 검증 책임은 app layer (helper).
  - 문제: app layer 안 zod 검증 명시 부재. helper 안 recipients 입력 검증 없이 그대로 INSERT → GIGO. invalid recipientId (non-UUID string) 또는 invalid recipientRole (enum 외 값) 입력 시 DB 안 잘못된 envelope 영속 → 향후 worker 처리 안 오류.
  - 권장 patch: § 5.1 helper 안 zod schema 검증 명시 — `recipientsSchema = z.array(z.object({ recipientId: z.string().uuid(), recipientRole: z.enum(["operator","medical","legal","author"]) })).nonempty()`. helper 진입 시 검증 + InvalidEnvelopeInputError throw. 또는 PostgreSQL JSONB CHECK 안 추가 검증 (jsonb_path_exists 등) — 단 복잡도 trade-off. 본 plan 채택 = app layer zod 권장.

- **NFM-07**: `audit_event.event_type` 컬럼 타입 검증 부재 — `notification-envelope-enqueued` 신규 enum 추가 시 마이그레이션 필요 여부 불명
  - 위치: plan § 1.2 (audit_event 통합 행) · § 6.4 NF-INTEGRATION-04 · § 8 작업 9 · § 10 NF-CASCADE-06
  - 근거(SoT): `apps/spike-e/migrations/004_audit_event.sql` 안 `event_type TEXT NOT NULL` 정합 — enum 아닌 TEXT 컬럼. 신규 eventType 추가 시 DB 마이그레이션 불필요.
  - 문제: plan 안 audit_event.event_type 컬럼 타입 명시 부재 → 잘못 enum 으로 가정 시 manifest 21단계 (audit_event ALTER TYPE ADD VALUE) 잘못 추가 위험.
  - 권장 patch: § 6.4 안 audit_event.event_type = TEXT 컬럼 명시 (마이그레이션 불필요) + § 8 작업 9 안 "audit_event eventType `notification-envelope-enqueued` 신규 — DB 마이그레이션 없음 (TEXT 컬럼)" 명시. manifest 단계 20 유지.

- **NFM-08**: tx commit 후 recipients 산정 vs tx 안 산정 분기 안 race 명시 부재 — author user 의 tx 종료 후 deactivation 발생 시 envelope 안 invalid recipient 잔존
  - 위치: plan § 5.2 NF-API-05 ("recipients 산정은 tx 안 (동일 read view + RLS scope)") vs plan § 6.5 NF-INTEGRATION-05 예시 코드 (sqlBase 안 산정)
  - 근거(SoT): notifications spec § 4.1 4.a 안 "AdminUser 미존재·active=false·instanceMemberships에 본 인스턴스 미포함 → `skipped-missing-user`" — worker 안 발송 직전 재검증 책임. 본 plan 안 worker 부재 (NF-DEFER-04) → recipient validation 은 envelope insert 시점에 만.
  - 문제: tx 안 산정 후 tx commit 시점 race window 안 user deactivation 가능. envelope insert 시점 가에는 invalid recipient 보존. 향후 worker 합류 시 발송 직전 재검증 marker 명시 정합 정합.
  - 권장 patch: § 5.2 NF-API-05 안 race window 명시 — "tx 안 recipients 산정 vs tx commit 시점 race window 안 user state drift 가능. M0 v0.1 안 envelope 발생 당시 snapshot 보존 + 향후 NF-DEFER-04 worker 합류 시 발송 직전 admin_user.active=true · instance_membership.active=true 재검증 (spec § 4.1 4.a 정합)" + recipients[] 안 each row 안 `recipientStateAt=<ISO>` 메타 추가 권장 (drift audit 용).

- **NFM-09**: notification_outbox.id ↔ NotificationEvent.eventId 매핑 명시 부재 — notifications Feature 본 구현 마이그레이션 시 충돌 위험
  - 위치: plan § 3.1 NF-EVENT-01 (`eventId: string; // UUID v4 — outbox row id`) + plan § 2.1 NF-SCHEMA-01 (`id UUID PRIMARY KEY DEFAULT gen_random_uuid()`)
  - 근거(SoT): REVIEW_WORKFLOW § 9.2 `NotificationEvent.eventId: string` · notifications spec § 14.6 `NotificationLog.eventId: string` · § 14.2 `NotificationEventReceipt.notificationLogId: UUID`. spec 안 eventId 는 notify() 의 envelope ID. Receipt-Log 분리 안 Receipt.notificationLogId = Log.id = eventId.
  - 문제: 본 plan 안 outbox.id = eventId 매핑. 향후 NF-DEFER-01 합류 시 outbox row → Log+Receipt 분할 마이그레이션 안 Log.id 가 outbox.id 와 동일 보존되어야 NotificationEvent.eventId 결정성 유지. plan 안 명시 부재.
  - 권장 patch: § 2.1 NF-SCHEMA-01 안 명시 추가 — "outbox.id = NotificationEvent.eventId (REVIEW_WORKFLOW § 9.2 SoT). 향후 NF-DEFER-01 마이그레이션 시 NotificationLog.id = outbox.id 보존 strategy 필수 (eventId 결정성 보장)". 마이그레이션 전략 (a/b) 안 (b) 분할 마이그레이션 시 Log.id = outbox.id INSERT 명시.

## minor

- **NFM-10**: plan 본문 안 NotificationEventType "46종" 표현 부정확 — 실 enum 41종
  - 위치: plan 본문 안 직접 표현 없음 — but cycle-1 prompt 안 "46종 풀 enum" 표기. plan 안 NF-DEFER-16 description "32종" 도 비공식 수치.
  - 근거(SoT): REVIEW_WORKFLOW § 9.1 NotificationEventType enum 실 멤버 = 41종 (awk 실측).
  - 권장 patch: prompt + plan 안 모든 NotificationEventType count 표기 41종 정합 (M0 active 4 + enum 등록만 1 + SLA/CA 5 + analytics 3 + search-vis 5 + keyword 8 + asset 5 + crm 4 + migration 6 = 41).

- **NFM-11**: NF-EVENT-07 안 manual-review 큐 진입 시 finalRoles 안 operator 외 검수자 (medical · legal) 통보 부재 — § 9.1 enum 부재 위에 운영 risk 명시
  - 위치: plan § 3.3 NF-EVENT-07 ("운영자 본인 액션 (submitForReview) 의 결과 NotificationEvent emit 안 함")
  - 근거(SoT): REVIEW_WORKFLOW § 9.1 enum 안 `content-submitted-for-review` 부재 정합. 그러나 manual-review 큐 진입 시 finalRoles=['operator', 'medical'] 안 medical 검수자가 알 수 없음 (operator 본인 액션이지만 medical/legal 검수 대기자에게 통보 필요).
  - 문제: 운영 알림 부재 — medical/legal 검수자가 큐 화면 polling 만으로 인지. SLA P0 (72시간) 안 검수자 알림 부재 risk.
  - 권장 patch: § 3.3 NF-EVENT-07 안 운영 결정 명시 — "manual-review 큐 진입 알림 부재 (§ 9.1 enum 부재) · medical/legal 검수자는 /review-queue 화면 polling 으로 인지. 향후 NF-DEFER-XX 신설 — `manual-review-queued` NotificationEventType 신설 cascade (REVIEW_WORKFLOW § 9.1 enum 추가 + 본 Feature cascade)". NF-DEFER-20 신설.

- **NFM-12**: plan § 5.1 helper 안 input.instanceId UUID v4 검증 명시 부재 — SQL injection 안전성 OK 이지만 PostgreSQL ::uuid cast 안 invalid input 시 throw
  - 위치: plan § 5.1 NF-API-01 안 `${input.instanceId}::uuid` 캐스트
  - 근거(SoT): postgres.js parameterized — SQL injection 안전. 그러나 invalid UUID string 입력 시 PostgreSQL "invalid input syntax for type uuid" throw → helper 안 throw bubble up.
  - 권장 patch: § 5.1 helper 진입 시 zod 검증 명시 — `z.string().uuid()` 검증 + InvalidInstanceIdError throw (recipients 검증 묶음 — NFM-06 patch 안 통합).

- **NFM-13**: NF-CASCADE-02 안 "LL-DEFER-01 완전 해소" 표현 — LL-DEFER-01 의 status=published 부분 (LOCATION_LEGAL_PLAN § 9.1 안 "apps/worker + Git commit cascade") defer marker 충돌
  - 위치: plan § 10 NF-CASCADE-02 ("LegalDocument 발행 게이트의 4단계 중 잔존 envelope 발송 ... LL-DEFER-01 의 4단계 모두 완료")
  - 근거(SoT): LOCATION_LEGAL_PLAN § 9.1 안 LL-DEFER-01 description 안 "LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제 · review-queued 전이 + ComplianceRecord pre-publish + NotificationEvent envelope · status=published). compliance-assistant Feature + ComplianceRecord UI cascade." — status=published 자체는 compliance-assistant M0 publishContent 안에서 처리됨 (admin DB level). apps/worker + Git commit cascade 는 LL-DEFER-XX 별도 (사이트 빌드 export).
  - 문제: "완전 해소" 표현 안 admin DB level 의 4단계만 의미 vs 사이트 빌드 export level (apps/worker + Git commit) 포함 의미 모호. M0_BUILD_EXPORT plan 안 별도 marker 존재.
  - 권장 patch: NF-CASCADE-02 안 명시 정정 — "admin DB level 4단계 (legalCounsel 강제 · review-queued 전이 · ComplianceRecord pre-publish · NotificationEvent envelope) 모두 완료 — LL-DEFER-01 admin scope 완전 해소. 사이트 빌드 export (apps/worker + Git commit) 는 M0_BUILD_EXPORT plan 안 별 marker · LL-DEFER-01 scope 외".

- **NFM-14**: enum extensibility 결정 (NF-SCHEMA-05) 안 ADD VALUE 안전성 — PostgreSQL ENUM 안 ALTER TYPE ADD VALUE 가 transaction 안 미허용 (PostgreSQL 12+ 일부 해제) marker 부재
  - 위치: plan § 2.3 NF-SCHEMA-05 ("향후 Feature cascade 시 ADD VALUE 단계적 cascade")
  - 근거(SoT): PostgreSQL 안 `ALTER TYPE ... ADD VALUE` 는 PostgreSQL 12+ 안에서 transaction 안 실행 허용 (이전 버전은 transaction 외 만). migrations-runner 안 single-tx vs split-tx 결정 영향.
  - 권장 patch: § 2.3 NF-SCHEMA-05 안 marker 추가 — "ADD VALUE 마이그레이션 안 PostgreSQL 12+ 정합 (transaction 안 ADD VALUE 가능). migrations-runner 안 single-tx 운영 안전. PostgreSQL 12 미만 미지원 marker (Spike A 결정 정합)".

- **NFM-15**: plan § 6.5 reviewer-approved 예시 코드 안 enqueueNotificationEnvelope 인수 누락 — `enqueueNotificationEnvelope(sqlBase, { ... })` 의 `{ ... }` 안 실 인수 (`eventType` · `instanceId` · `contentRef` · `contentTitle` · `recipients` · `workflowTransitionTimestamp` · `metadata`) 미명시
  - 위치: plan § 6.5 NF-INTEGRATION-05 코드 예시
  - 근거(SoT): plan § 3.1 NotificationEventInput 정의 — 모든 required 필드.
  - 권장 patch: § 6.5 예시 코드 완성 — 모든 required 필드 명시.

- **NFM-16**: NF-CASCADE 안 packages/notifications-outbox v0.2 Spike B 패턴 vs 본 plan notification_outbox table schema 차이 marker 부재
  - 위치: plan § 10 NF-CASCADE markers
  - 근거(SoT): packages/notifications-outbox v0.2 (Spike B 패턴) 의 outbox table = `(id, instance_id, source_event_id, status, payload JSONB, attempts, max_attempts, next_attempt_at, locked_at, locked_by, last_error, last_error_class, completed_at, exhausted_at)` — worker harness 패턴. 본 plan 의 notification_outbox = envelope-only persist (status 3종 · attempts/locked 등 worker 컬럼 없음).
  - 문제: NF-DEFER-04 합류 시 두 schema 통합 전략 marker 부재 — (a) 본 plan notification_outbox 에 worker 컬럼 ALTER ADD COLUMN OR (b) 별도 worker_queue 테이블 신설.
  - 권장 patch: NF-CASCADE-07 신설 — "packages/notifications-outbox v0.2 Spike B 패턴 vs 본 plan notification_outbox table 차이 marker. NF-DEFER-04 worker harness 합류 시 통합 전략 (a/b) 결정 정합 marker".

## acceptance precondition 점검

- NF-DEFER 매핑 완비성 (19종 + 41 NotificationEventType cascade 매핑): **FAIL** — NF-DEFER-18 description 부정확 (`media-threshold-*` 누락, NFM-04 patch 필요)
- envelope shape REVIEW_WORKFLOW § 9.2 SoT 정합: **PASS** (NotificationEvent 9 필드 + M0 비범위 NotificationPayload·DeliveryResult 명시 정합)
- sourceEventId 결정 함수 idempotency 계약 정합: **CONDITIONAL** — spec § 9.2.1 권장 패턴 (instanceId 미포함) vs 본 plan (instanceId 포함) 분기 결정 marker 부재 (NFM-05). NFM-03 workflowTransitionTimestamp 출처 결정 부재.
- recipients 산정 (finalRoles + author) DATA_MODEL C-23 정합: **CONDITIONAL** — NFM-01 helper signature 불일치 · NFM-08 race window marker 부재
- 4 server action emit 시점 (tx commit 후 base role) compliance-assistant M0 § 6.2 정합: **CONDITIONAL** — § 5.2 NF-API-05 vs § 6.5 NF-INTEGRATION-05 코드 예시 분기 (NFM-01)
- LL-DEFER-01 완전 해소 marker 정합: **CONDITIONAL** — admin scope vs build/export scope 모호 (NFM-13)
- CA-DEFER-14 부분 해소 marker (11 tables · channel · digest · suppression · DLQ · broadcast NF-DEFER-01 cascade) 정합: **PASS**

## 후속 cycle 권장 진행

cycle-2 patch sweep:
1. NFM-01 (blocking): § 4.1·4.2 helper signature 통일 — recipients tx 안 산정 + tx 외부 반환 + § 6.5 예시 코드 정합 patch
2. NFM-02 (blocking): § 5.1 helper 안 length === 0 분기 + 100ms × 1회 polling 정합 patch
3. NFM-03 (blocking): § 3.2 NF-EVENT-03 안 server action 별 timestamp 출처 표 추가
4. NFM-04 (blocking): § 1.3 NF-DEFER-16/17/18 description 정정 + § 9.2 안 41종 매핑 표 추가
5. NFM-05~09 (major) · NFM-10~16 (minor) 동반 patch

cycle-2 입력 = 본 cycle 16 finding 전건 수용 patch + v0.2 변경 이력.
