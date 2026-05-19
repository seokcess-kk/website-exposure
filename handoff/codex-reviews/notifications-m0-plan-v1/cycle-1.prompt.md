You are reviewing `docs/decisions/NOTIFICATIONS_M0_PLAN.md` v0.1 (draft). 본 plan 은 notifications Feature spec v1.0 (976 line · 5 cycle 7+30+23+22+22 finding · M1 acceptance · 11 tables + Redis · channel adapter · digest AST · suppression · DLQ · broadcast) 의 **M0 vertical slice scope** — envelope persist + 4 eventType emit + recipients fan-out 까지. **channel adapter · digest · suppression · DLQ · broadcast · in-app inbox · worker harness 는 모두 NF-DEFER**. 핵심 M0 정합 + LL-DEFER-01 완전 해소 + CA-DEFER-14 부분 해소.

This is **cycle 1**. Produce a strict, broad critique on whether the plan correctly maps onto notifications Feature spec, REVIEW_WORKFLOW § 9, DATA_MODEL C-23, COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6.2 audit emit 패턴, LOCATION_LEGAL_PLAN LL-DEFER-01, packages/auth `emitAuditEvent` 패턴, packages/notifications-outbox v0.2 (Spike B 잔재). 가능한 한 광범위하게.

## SoT to read

1. `docs/features/notifications.md` v1.0 — Feature spec (§ 0 한 페이지 요약 · § 3 입력·출력·notify() · § 4 발송 파이프라인 · § 5 채널 어댑터 · § 6 digest · § 7 재시도·DLQ·suppression · § 9 운영 지표 · § 11 빌드 검증 · § 14 11 tables · § 14.2 NotificationEventReceipt · § 14.6 NotificationLog)
2. `docs/admin/REVIEW_WORKFLOW.md` — § 9 알림 인터페이스·정책 SoT · § 9.1 NotificationEventType enum 46종 · § 9.1.1 매트릭스 SoT · § 9.2 NotificationEvent/Payload · § 9.2.1 idempotency 계약 · § 9.3 채널·운영 · § 10.2.1 AuditAction enum
3. `docs/core/DATA_MODEL.md` C-23 AdminUser + instance_membership (role 4종 · active · notificationPreferences) · C-08 InstanceManifest notificationChannels · C-10 ComplianceRecord (metadata 슬롯 schema)
4. `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 — § 6.2 audit emit 4종 · § 9.2 안 CA-DEFER-14 (해소 대상) · § 10 CA-CASCADE-06
5. `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md` v1.0 — § 12 enqueueContentGateIfNeeded · CA-DEFER-15 부분 해소
6. `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — § 2 비범위 · § 9.1 LL-DEFER-01 (완전 해소 대상)
7. `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 — audit emit 시점 정책 (tx commit 후 base role) · 실패 정책
8. `packages/auth/src/audit.ts` (emitAuditEvent 시그니처)
9. `packages/auth/src/resolve-tenant-context.ts` (TenantContext shape)
10. `packages/notifications-outbox/src/outbox.ts` v0.2 (Spike B 패턴 — enqueue/claim/SKIP LOCKED — 본 plan 합류 시 재사용 marker)
11. `apps/web/src/lib/compliance/server-actions.ts` (4 server action 현 구현 — submit/approve/reject/publish)
12. `apps/web/src/lib/compliance/entity-actions.ts` + `apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts` (현 audit emit 패턴)
13. `apps/web/src/lib/compliance/auto-gate.ts` (enqueueContentGateIfNeeded 결과 → content-gate-queued 발송 시점)
14. `packages/core-content/src/schema.ts` v0.5 (현재 Drizzle SoT — 정합 확인)
15. `apps/spike-e/migrations/002_admin_user.sql` (admin_user · instance_membership 스키마 SoT)

## Plan under review

`docs/decisions/NOTIFICATIONS_M0_PLAN.md` v0.1 — 핵심 결정 22종:
- NF-SCHEMA-01·02·03·04·05 notification_outbox 신규 table (envelope persist) + 5 enum (notification_event_type 5종 · criticality · recipient_role · outbox_status · channel_marker) + recipients JSONB CHECK
- NF-METADATA-01 compliance_record.metadata.submitterUserId 슬롯
- NF-METADATA-02 envelope.metadata.matrix 안 § 9.1.1 정책 snapshot freeze
- NF-EVENT-01·02·03·04·05·06·07·08 envelope shape (REVIEW_WORKFLOW § 9.2 SoT) + sourceEventId sha256 결정 함수 + 4 eventType M0 활성 매트릭스 + AND 게이트 충족 시 만 reviewer-approved + content-submitted-for-review/blocked-correction-required 미발송
- NF-RECIP-01·02·03·04·05·06·07 recipients 산정 — finalRoles → instance_membership.role 매핑 · admin_user.active=true 필터 · author = compliance_record.metadata.submitterUserId fallback · recipients=[] skip
- NF-API-01·02·03·04·05·06·07 enqueueNotificationEnvelope helper (base role + SET LOCAL ROLE + ON CONFLICT DO NOTHING) + tx commit 후 호출 + workflowTransitionTimestamp = updated_at
- NF-INTEGRATION-01·02·03·04·05 4 server action emit 통합 + content_title 산정 + submitterUserId 슬롯 채움 + emit 실패 try/catch + reviewer-approved AND 게이트 충족 시 만
- 19 NF-DEFER marker + 6 NF-CASCADE marker
- 14 vitest 시나리오

## What to check (cycle 1)

### Plan SoT 합치
- REVIEW_WORKFLOW § 9.2 NotificationEvent shape vs plan § 3.1 NotificationEventInput / NotificationEventEnvelope — 필드 누락 없는지 (eventId · sourceEventId · eventType · contentRef · contentTitle · recipients[] · criticality · metadata · createdAt). M0 비범위 (payloadId · ctaUrl) 명시 정합
- REVIEW_WORKFLOW § 9.2.1 idempotency 계약 — sourceEventId = sha256(eventType + ":" + instanceId + ":" + contentRef + ":" + workflowTransitionTimestamp) 권장 패턴 정합 (spec 안 `hash(eventType + contentRef + workflowTransitionTimestamp)` 표현 vs plan 안 instanceId 추가 — multi-tenant scope 안전 vs spec 권장 패턴 일치성)
- REVIEW_WORKFLOW § 9.1.1 매트릭스 — 4 M0 활성 이벤트 (`content-gate-queued`·`reviewer-approved`·`reviewer-rejected`·`publish`) 각 행의 수신자·criticality·immediateChannels·fallbackChannels·digestCadence·quietHoursPolicy·optOutPolicy 가 plan § 3.3 표 정합. operator·medical·legal·client·author 산정 정합
- REVIEW_WORKFLOW § 9.1 NotificationEventType enum 46종 vs plan § 2.1 안 5종 등록 만 — 정합. 향후 ADD VALUE cascade marker NF-DEFER-16/17/18 매핑 정합
- DATA_MODEL C-23 admin_user.active · instance_membership.role 4종 (operator·physician-reviewer·legal-reviewer·client-approver) vs plan § 4.1 매핑 (operator→operator · medical→physician-reviewer · legal→legal-reviewer) 정합
- DATA_MODEL C-10 ComplianceRecord metadata 슬롯 — plan § 2.2 안 submitterUserId 키 추가 정합 + CA-DEFER-13 매핑 표 안 NF-DEFER-14 marker (풀 컬럼 화) 정합
- notifications Feature spec § 14.2 NotificationEventReceipt 안 `UNIQUE(instance_id, source_event_id)` 와 plan § 2.1 안 `notification_outbox_unique` 동일 SoT. notifications Feature 합류 시 마이그레이션 전략 (a/b) 정합

### Scope · NF-DEFER 정합
- 19 NF-DEFER marker 가 spec § 의 모든 미합류 영역 포함 — 누락 없는지 (11 tables · channel adapter · dedupe · worker · digest · suppression · DLQ · broadcast · in-app inbox · critical filter · locationRef · policyVersion · ctaUrl · 작성자 추적 · 외부 author · 32+5+1 NotificationEventType cascade)
- NF-DEFER-04 worker harness 합류 시 packages/notifications-outbox v0.2 Spike B 패턴 재사용 marker 정합 — 본 plan 의 notification_outbox 테이블 vs Spike B 의 outbox 테이블 schema 차이 명시 정합
- NF-DEFER-16/17/18 NotificationEventType cascade — REVIEW_WORKFLOW § 9.1 enum 46종 - 4 M0 active - 1 enum 등록만 (blocked-correction-required) - 5 SLA/CA - 32 다른 Feature - 1 analytics = 41 매핑 정합 검증
- NF-DEFER-14 author 추적 — compliance_record.metadata.submitterUserId fallback vs entity content @createdBy column 정식 분리 정합

### DB 마이그레이션
- C0020 notification_outbox 5 enum + CHECK 2건 + RLS + GRANT 정합 — compliance-assistant M0 C0014/C0015 패턴 정합
- 기존 manifest 19단계 (compliance-assistant M0) → 20단계 patch (C0020 추가) 의존성 정합 — C0020 의 dependsOn (instance · admin_user 의 직접 FK 없음 정합)
- notification_outbox.recipients JSONB CHECK nonempty — array shape 검증 정합 (PostgreSQL `jsonb_typeof = 'array' AND jsonb_array_length >= 1`)
- notification_outbox_completed_requires_at CHECK — M0 v0.1 미사용 (worker 부재) 이지만 schema 안 정합 정의 정합
- C0020 enum extensibility — notification_event_type 5종 (4 M0 + 1 enum 등록 만) vs 향후 ADD VALUE 41종 cascade 충돌 없는지

### NF-API 시그니처
- enqueueNotificationEnvelope (sqlBase, input) → EnqueueResult — base role + SET LOCAL ROLE app_tenant_user + SET LOCAL app.current_instance_id 패턴 정합 (Spike A · audit emit 패턴 정합)
- ON CONFLICT DO NOTHING RETURNING id + UNION ALL fallback SELECT — 단일 round trip 정합. INSERT 성공 vs UNIQUE 위반 분기 정합. was_inserted boolean 컬럼 SoT
- workflowTransitionTimestamp = tx 안 갱신된 row 의 updated_at — server action 안 RETURNING updated_at 패턴 정합. 결정성 보장 검증
- recipients 산정 = tx 안 (RLS scope · 동일 read view) vs envelope emit = tx commit 후 base role 분기 정합. tx commit 안 rollback 시 phantom recipient 회피 정합

### 4 server action 안 emit 통합
- submitForReviewAction 안 contentGateEntryId !== null 분기 — auto-gate.ts (enqueueContentGateIfNeeded) 반환값 정합. content-gate-queued audit emit 과 envelope emit 양쪽 분리 정합
- approveEntryAction 안 allApproved === true 시 만 emit — NF-EVENT-05 (AND 게이트 충족 시 만) 결정 vs REVIEW_WORKFLOW § 9.1.1 `reviewer-approved` 의미 (envelope 단위 vs 최종 approved 전이) 정합 검증. 운영 결정 명시
- rejectEntryAction 안 author 만 발송 → author skip 시 envelope 자체 skip + console.warn — NF-RECIP-06 marker · 운영자 정정 통로 부재 risk 인지 정합
- publishContentAction 안 operator 만 (client-approver CA-DEFER-10 까지 미합류) — recipients=[operator] 정합. operator 0건 → envelope skip 정합 + console.warn
- emit 시점 = tx commit 후 base role — compliance-assistant M0 § 6.2 패턴 정합

### recipients 산정
- finalRoles → instance_membership.role 매핑 정합 (operator→operator · medical→physician-reviewer · legal→legal-reviewer) — instance_membership_role_check CHECK 정합 (spike-e/migrations/002 안 4종)
- admin_user.active=true · instance_membership.active=true 양쪽 필터 — UNIQUE active partial index 정합
- author = compliance_record.metadata->>'submitterUserId' — null/deactivated user fallback 정합
- recipients=[] 검증 — DB CHECK nonempty 충돌 회피 정합. helper 안 EnqueueResult.skipped="no-recipients" 분기 정합
- 1 user 가 다중 role 보유 시 — DISTINCT (user_id, role) 정합. recipients[] 안 동일 user 의 다중 row 보존 정합

### 시나리오 14건 정합
- 시나리오 1~14 통과 기준 명시 — 자동 검증 가능 vs e2e 검증 분리 정합
- 시나리오 5 (Medium approve 시 allApproved=false) → envelope 0 row — NF-EVENT-05 결정 정합
- 시나리오 10 LegalDocument 발행 시퀀스 → 2 envelope (reviewer-approved + publish) — LegalDocument exempt 라 content-gate-queued 없음 정합. submit 안 manual-review 만 → emit 없음 정합. 검증 케이스 명확성
- 시나리오 11 recipients=[] skipped="no-recipients" — DB CHECK nonempty 와 helper 분기 정합
- 시나리오 13 notification-envelope-enqueued audit emit — NF-DEFER-05 worker 합류 시 notification-dispatched 로 대체 정합

### docs cascade · NF-CASCADE 6종
- NF-CASCADE-01~06 docs 정합 — 각 cascade 가 정확한 SoT 문서 + § 위치 식별
- NF-CASCADE-02 LOCATION_LEGAL_PLAN LL-DEFER-01 **완전 해소** marker — 4단계 (legalCounsel 강제 · review-queued 전이 · ComplianceRecord pre-publish · NotificationEvent envelope) 모두 완료 정합. legaldoc-workflow-integration v1.0 안 `LL-DEFER-01 부분 해소 잔재 (NotificationEvent CA-DEFER-14)` 표현 → 본 plan 으로 잔재 해소 정합
- NF-CASCADE-03 COMPLIANCE_ASSISTANT_M0_PLAN CA-DEFER-14 → **부분 해소** marker — 11 tables · channel adapter 등 NF-DEFER-01 cascade 정합. CA-CASCADE-04 (LL-DEFER-01 부분 해소 marker) 와 충돌 없는지
- NF-CASCADE-06 REVIEW_WORKFLOW § 10.2.1 AuditAction enum `notification-envelope-enqueued` 신규 — 본 plan 의 M0 v0.1 부수 audit emit · NF-DEFER-05 worker 합류 시 notification-dispatched 로 대체 marker 정합

### 분쟁 위험 영역
- envelope.metadata.matrix snapshot freeze — 호출 시점 매트릭스 값 vs 처리 당시 매트릭스 drift 회피 운영 결정 명시 vs notifications Feature spec § 1.1 두 축 분리 (패키지 SemVer · notificationPolicyVersion) 정합. notificationPolicyVersion 미합류 (NF-DEFER-13) 으로 M0 안 snapshot 만 보존 — 향후 마이그레이션 시 policyVersion 입력 가능 marker
- sourceEventId 안 instanceId 포함 vs spec 권장 패턴 (instanceId 미포함) — multi-tenant scope 안전성 vs spec 충실성. 본 plan 안 instanceId 추가는 안전 강화 (cross-instance 충돌 회피) 정합 marker
- recipients 산정 tx 안 vs envelope emit tx commit 후 — recipients drift (tx 안 산정 후 tx commit 직후 user deactivation 발생) risk 인지 marker. 별도 cycle 합류 시 worker 가 발송 직전 재검증 정합 (NF-DEFER-04 worker harness 합류 시)
- audit_event 안 `notification-envelope-enqueued` 신규 enum — REVIEW_WORKFLOW § 10.2.1 cascade marker 필요. AuditAction enum 안 ADD VALUE 정합

## Output format

```
# NOTIFICATIONS_M0_PLAN v0.1 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: (이전 cycle 없음 — 본 cycle 이 첫)

## blocking
- **NFM-01**: <짧은 제목>
  - 위치: <file>:<line> 또는 plan § XX
  - 근거(SoT): notifications spec § X · REVIEW_WORKFLOW § 9.Y · DATA_MODEL C-23 · COMPLIANCE_ASSISTANT_M0_PLAN § ZZ 등
  - 문제: ...
  - 권장 patch: ...

## major
## minor

## acceptance precondition 점검
- NF-DEFER 매핑 완비성 (19종 + 41 NotificationEventType cascade 매핑): <PASS|FAIL>
- envelope shape REVIEW_WORKFLOW § 9.2 SoT 정합: <PASS|FAIL>
- sourceEventId 결정 함수 idempotency 계약 정합: <PASS|FAIL>
- recipients 산정 (finalRoles + author) DATA_MODEL C-23 정합: <PASS|FAIL>
- 4 server action emit 시점 (tx commit 후 base role) compliance-assistant M0 § 6.2 정합: <PASS|FAIL>
- LL-DEFER-01 완전 해소 marker 정합: <PASS|FAIL>
- CA-DEFER-14 부분 해소 marker (11 tables · channel · digest · suppression · DLQ · broadcast NF-DEFER-01 cascade) 정합: <PASS|FAIL>
```

가능한 한 광범위하게 보고, plan § 또는 file:line 인용. 한국어로 응답.
