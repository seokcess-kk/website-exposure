# 자동 비평 의뢰 — `docs/features/notifications.md` v0.3 (3차 사이클)

## 컨텍스트

v0.2의 22개 지적을 전건 수용하여 v0.3로 정리. 이번 cycle의 주요 도입:
- idempotency 원자 선점 — § 14.2 NotificationEventReceipt `unique(instanceId, sourceEventId)` insert-if-absent
- critical 우회 범위 한정 — quietHours·businessHours·user opt-out만. inactive 사용자·인스턴스 채널 비활성·dedupe·idempotency는 critical도 적용
- Slack broadcast 모드 정식 모델링 — DeliveryAttempt `deliveryMode`·`recipientId` nullable. DeliveryResult.`broadcastDeliveries[]` 별도 슬롯
- dedupe key 정식 표기 — `notif:dedupe:{instanceId}:{sourceEventId}:{recipientId}:{channel}` (instanceId 추가)
- NotificationPayloadRecord 신설 — payload 본문 영속 저장. digest·quietHours·businessHours 보류 큐에서 본문 복원
- DigestPolicy 객체 구조화 — § 6.1 매트릭스 자연어 → policy[] 코드 생성
- § 14 DB 8 tables + Redis 1 keyspace 인벤토리 확정 + FK·UNIQUE·INDEX 명시
- resendDeadLetter notify() 우회 별도 command
- locationRef 산정 + LocationProfile.businessHours 정밀화 (openingHours/receptionHours·specialClosures·PublicHoliday·lunchBreaks)
- timezone 우선순위 명시
- C-23 NotificationPreferences.suppression cascade (EmailSuppressionState·ChannelSuppressionState)
- DATA_MODEL v0.13 승격
- deferred-rate-limit DeliveryStatus 분리
- logRetentionDaysAfterDlqExpiry 보존 순서
- notificationPolicyVersion 빌드 검증

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\notifications.md` v0.3를 다시 엄정하게 비평하라. 2차 사이클의 정정이 새로운 모순을 만들었는지 + 잔재한 빈틈을 점검:

1. **idempotency·dedupe·resendDeadLetter 상호작용**:
   - NotificationEventReceipt 선점 → NotificationLog 생성 순서가 트랜잭션 안전한지
   - 동일 sourceEventId가 receipt 미존재 시 race condition 가능성 — DB unique constraint로 충분한지
   - resendDeadLetter 별도 command이지만 NotificationLog summary 갱신·DeliveryAttempt 추가의 동시성 문제
   - 재시도 worker가 DeliveryAttempt에 attemptNumber를 증가시킬 때의 UNIQUE 제약 충돌
   - dedupeKey `failed-permanent` TTL = dedupeWindow → TTL 만료 후 다른 호출자가 같은 sourceEventId로 들어오면? (idempotency receipt에 막힐 듯하지만 명시 필요)

2. **필터 순서·broadcast 모드 결과 표현**:
   - § 4.1 4.c suppression 필터에서 "critical + hard-suppressed → 다른 활성 채널로 자동 라우팅"이 § 9.1.1 매트릭스(immediateChannels) 위반 가능성
   - broadcast 모드의 `skipped-broadcast-only` per-recipient 슬롯 + `broadcastDeliveries[]` 실제 결과 — DeliveryResult 소비자(REVIEW_WORKFLOW)가 어떻게 해석하는지 명시 필요
   - per-recipient 모드 사용자와 broadcast 모드 사용자가 같은 이벤트에서 섞일 때 결과 매핑 정합

3. **NotificationPayloadRecord·NotificationLog·DeliveryAttempt 데이터 흐름**:
   - § 14.3 PayloadRecord의 `directSentAt` vs `digestSentAt`이 동시 이벤트 처리에서 어떻게 갱신되는지
   - 동일 payload가 즉시 채널 + digest 채널 양쪽 라우팅되는 경우 (예: stale-queued — inApp 즉시 + email digest)의 PayloadRecord/DeliveryAttempt 관계
   - § 14.6 NotificationLog.summary 집계 갱신 시점 (각 attempt 완료마다 vs 종결 시점) 동시성
   - DeliveryResult 재구성 시 누락 가능한 필드 (broadcastDeliveries 등)

4. **digest 정책 매트릭스 코드 생성**:
   - § 6.1 DigestPolicy의 `when.condition`이 자연어 표현(`metadata.staleTriggeredBy startsWith ...`) — 실제 코드 생성 시 안전한 DSL인지
   - § 9.1.1 매트릭스 변경 → notificationPolicyVersion 갱신 → 패키지 재빌드의 운영 흐름이 매트릭스 수정 즉시 반영되는지 (race·롤백 정책)
   - DigestBucket join table NotificationDigestBucketPayload의 cascade 정책 (ON DELETE CASCADE) vs PayloadRecord의 RESTRICT 정합

5. **businessHours·locationRef·timezone 정합성**:
   - LocationProfile.businessHours가 BusinessHours(CT-02)의 어떤 daysOfWeek 구조인지 검증 필요 (CT-02 실제 정의 확인)
   - PublicHoliday가 어디에 정의되어 있는지 (CT-02·C-21 어느 쪽?) — 본 문서는 CT-02로 표기하나 실제 DATA_MODEL 정합 확인
   - businessHoursReference 기본값 openingHours — receptionHours 선택 시의 의미 차이 (의료기관 도메인 정합)
   - multi-location 인스턴스에서 NotificationEvent.metadata.locationRef가 콘텐츠 소속 location과 다를 수 있는 경우 (예: 본원 콘텐츠 → 분원 검수자) 처리

6. **suppression cascade 정합 (C-23)**:
   - EmailSuppressionState.state="soft-suppressed" 자동 해제(`softSuppressionAutoReleaseDays` 14일) 흐름이 § 14에 worker 정의되어 있는지
   - 사용자가 mandatory critical 이벤트 발송 직전 hard-suppressed 상태이면 `inApp 우선 라우팅` 시 inApp도 막혀 있으면? (외부 sink alert만 — 충분한가)
   - suppression.lastObservedAt·observedCount 갱신이 동시 multi-worker 환경에서 안전한지

7. **REVIEW_WORKFLOW § 10.2.1 cascade·v0.13 DATA_MODEL 정합**:
   - REVIEW_WORKFLOW § 10.2.1 AuditAction에 `notification-resend-attempted`·`notification-read` 후속 enum 표기는 본 문서가 의뢰. 실제 REVIEW_WORKFLOW에는 미반영 상태 — 점검 필요
   - DATA_MODEL v0.13 변경 이력이 § 0 한 페이지 요약·§ 1.1 인벤토리와 정합
   - C-23 AdminUser의 `instanceMemberships[]`이 인스턴스 격리(§ 14.1)와 정합

8. **§ 14 데이터 구조 안정성**:
   - § 14.4 DeliveryAttempt `UNIQUE(payloadId, channel, attemptNumber, dedupeMode)` — resend는 attemptNumber max+1이라 unique 위반 없음, 그러나 동시 재시도 worker가 attemptNumber를 race로 증가시키면? 별도 sequence·lock 정책 필요
   - § 14.7 DigestBucket cadenceWindow 표기 (`2026-W19`) — 주간은 ISO week, 일간은? 표기 일관성
   - § 14.11 DLQ `UNIQUE(payloadId, failingChannel, resolvedAt IS NULL)` — partial unique index 표기 정합 (DBMS별 지원)
   - inActive 사용자가 NotificationInbox에 alreay 누적된 메시지 — § 4.1에서 inactive 막아도 historical inbox 노출 정책 (소프트 삭제·표시 분기)

9. **명세 자체의 정합성·문구**:
   - § 0 한 페이지 요약 ↔ § 4 ↔ § 14 인벤토리 일관성
   - § 1.1 변경 정책 ↔ 실제 변경 영향
   - 잔재 미해소 표시(NT-XX·후속 enum 등)·표 컬럼 정합·DigestPolicy DSL 표기 일관성

## 출력 형식

이전과 동일 JSON 스키마.

타당한 지적은 모두 제기하라. 2차 수용된 영역의 새 모순이 가장 중요한 발견 대상.

## 참고할 SoT 문서 경로

- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md` (대상 — v0.3)
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md` (모범 사례)
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md` (cascade 동반)
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md` (cascade 동반 — v0.13)
- `C:\Users\assag\solution\website-exposure\docs\ARCHITECTURE.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\RISK_LEVELS.md`
