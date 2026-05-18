# 자동 비평 의뢰 — `docs/features/notifications.md` v0.4 (4차 사이클)

## 컨텍스트

v0.3의 20 finding + 3 residual = 23 지적을 전건 수용하여 v0.4 정리. 이번 cycle의 주요 도입:
- Receipt-Log 트랜잭션 순서: 단일 DB transaction에서 Log → Receipt insert
- 테이블 인벤토리 재산정: DB 11 tables + Redis 1 keyspace. NotificationDelivery 가상 참조 제거. NotificationDeadLetterAttempt join table 신설
- DeliveryAttempt attemptNumber row lock 또는 advisory lock + processing 선점
- PayloadRecord recipient-envelope unit 명확화: channel·sentAt 필드 제거. 채널별 추적은 DeliveryAttempt status만
- REVIEW_WORKFLOW § 9.1.1 매트릭스에 fallback 채널 컬럼 SoT cascade
- dedupe Redis SET NX EX 원자 명시
- receiptRetentionDays(기본 365일) — sourceEventId 재사용 차단 기간
- REVIEW_WORKFLOW § 9.3 — Slack 2가지 모드·DeliveryResult 소비 규칙 cascade
- broadcast envelope+channel 단위 1건. sentinel "broadcast" dedupeKey. broadcastAttemptId 매핑
- DigestPolicy AST 구조(DigestCondition.field/op/value enum)
- policyVersion 병렬 보관: 패키지가 버전별 매트릭스 보관, manifest opt-in
- DigestBucketPayload FK 분리: bucketId CASCADE, payloadId RESTRICT
- DATA_MODEL C-08 `holidayCalendar` cascade
- LocationProfile `@id="main"` 관례 (C-21 SoT 정합)
- suppression autoReleaseAt + § 7.4 worker
- suppression atomic increment + compare-and-set threshold
- REVIEW_WORKFLOW § 10.2.1 — `notification-resend-attempted`·`notification-read` enum cascade
- DLQ PostgreSQL partial unique index 표기
- NotificationDeadLetterAttempt join table
- DATA_MODEL C-23 timezone 설명 quietHours 한정으로 정정
- inactive 사용자 historical inbox 기본 숨김 정책
- cadenceWindow 표기 (`YYYY-MM-DD` daily / `YYYY-Wnn` weekly)
- instanceMemberships 검증 → skipped-missing-user

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\notifications.md` v0.4를 다시 엄정하게 비평하라. 3차 사이클의 정정이 새 모순을 만들었는지 + 잔재한 빈틈을 점검:

1. **트랜잭션·동시성 안정성 재검토**:
   - § 4.1 1단계 단일 트랜잭션이 NotificationLog UUID 생성 + Receipt FK insert → "단일 DB 트랜잭션 안에서" 두 row 모두 commit/rollback이 진행되는데, 대규모 RDBMS에서 FK constraint deferred 옵션이 필요한지·default behavior로 충분한지
   - 트랜잭션 abort 시 "기존 결과 재구성 반환" 흐름이 receipt를 본 worker가 다시 읽을 때 row visibility(트랜잭션 isolation) 문제 없는지
   - § 4.4 DeliveryAttempt attemptNumber lock — row lock on PayloadRecord vs advisory lock on hash(payloadId+channel)의 선택이 운영 정책 SoT로 닫혀 있는지
   - § 4.4 "INSERT commit 후 lock 해제 → 다른 worker는 다음 max+1" — 트랜잭션 commit 시점과 max+1 산정 시점 사이 race 가능성

2. **매트릭스 fallback·policyVersion 정합**:
   - § 9.1.1의 fallback 채널 컬럼이 즉시 채널 컬럼의 채널 중에서만 선택되는지, 아니면 외부 채널도 가능한지 (현재 사례는 모두 inApp으로 통일되어 있음)
   - § 4.1 4.c "fallback 채널도 hard-suppressed면 외부 sink alert만" — 이때 NotificationDeliveryAttempt status·DeliveryResult 항목 표현 명시 부재
   - § 4.2 policyVersion 병렬 보관 — 패키지가 보관하는 version 수 상한·deprecation 정책 명시 부재
   - § 4.2 매트릭스 변경이 `MAJOR`라는 § 1.1 정책과 "policyVersion 추가는 minor"라는 운영 흐름 정합

3. **DigestPolicy AST 안전성**:
   - § 6.1 DigestCondition.field enum이 6종으로 한정되어 있는데 metadata.* 필드는 enum으로 닫히지 않음 — 새 metadata 필드 추가 시 cascade
   - DigestCondition.op="exists"·"notExists"가 metadata 객체 깊은 경로(`metadata.priorReviewSubmissionId`)에서 어떻게 평가되는지
   - DigestPolicy 매칭 우선순위(배열 순서)의 운영 정합성·default fallback 명확성

4. **broadcast 모드 데이터 흐름**:
   - § 14.4 broadcastAttemptId 자기 참조 의미 — perRecipient placeholder의 broadcastAttemptId vs broadcast attempt 자신의 id
   - § 3.2 DeliveryResult.broadcastDeliveries[]가 NotificationDeliveryAttempt에서 어떻게 추출되는지 (recipientId=null + deliveryMode="broadcast")
   - broadcast 모드 시 NotificationPayloadRecord는 broadcast-only recipient들 각각 1건씩 생성되는지·envelope당 1건만 생성되는지

5. **businessHours·locationRef·holidayCalendar 운영**:
   - § 8.4 PublicHoliday 처리에서 `holidayCalendar.source="package-embedded"` — 본 Feature 패키지가 국가별 공휴일 데이터를 어떻게 갱신·deploy하는지
   - 한국 공휴일 임시·대체공휴일 처리 (예: 임시공휴일 지정)
   - § 8.4 종료 시각 산정 "다음 운영 가능 시각"의 무한 루프 방지(연속 휴일·휴진·점심 등) 보장
   - locationRef가 NotificationEvent에 채워졌으나 InstanceManifest에 해당 LocationProfile 미존재 시 처리

6. **suppression worker·atomic 정합**:
   - § 7.4 worker가 hard-suppressed 자동 해제하지 않는다고 정의됐는데, 운영자 수동 해제(unsuppressedBy·unsuppressedAt)의 UI/audit log 흐름 부재
   - § 7.1 atomic increment + compare-and-set threshold 도달 시 sink alert가 1회만 발생 — 운영자가 unsuppress 후 다시 threshold 도달 시 다시 alert 발생하는지 (observedCount 리셋 정책)
   - soft → hard 전이 흐름 (autoRelease 도중 hard bounce 발생 등) 미정의

7. **§ 14 데이터 구조 정합 재점검**:
   - PayloadRecord에서 directSentAt/digestSentAt 제거 후 — § 6.4 "큐 worker가 DeliveryAttempt status 검사로 중복 방지" 정확한 쿼리·index 명시 부재
   - NotificationDeadLetterAttempt join table의 의미 — 동일 attempt가 여러 DLQ에 join될 수 있는지 (`UNIQUE(deadLetterId, attemptId)`만 있고 attemptId 단독 unique 없음)
   - § 14.11 partial unique index가 다른 DBMS에서 generated column 대체 — 정확한 schema 표기 미명시
   - inApp 발송 시 NotificationInbox + DeliveryAttempt 양쪽에 row가 생기는데 두 row 사이 정합 (예: Inbox는 생성됐으나 Attempt는 failed인 경우)

8. **audit log·notification-read 흐름**:
   - § 5.3 notification-read audit log 기록 — 사용자가 어떤 actorRole로 기록되는지 (operator? client-approver?)
   - REVIEW_WORKFLOW § 10.2.1 cascade가 본 cycle에 완료됐는데 actorRole field가 모든 enum에 대해 정의 가능한지

9. **REVIEW_WORKFLOW·DATA_MODEL cascade 정합**:
   - REVIEW_WORKFLOW § 9.1.1 fallback 컬럼은 추가됐는데 § 9.2 NotificationPayload·NotificationEvent 타입 정의에 fallback 필드는 없음 (이게 매트릭스 SoT만으로 충분한가)
   - DATA_MODEL C-23 `autoReleaseAt` 필드가 추가됐는데 InstanceManifest C-08의 suppression 설정과 정합한지
   - DATA_MODEL C-21 `@id="main"` 관례가 multi-location 인스턴스에서 main 부재 시 build warning만으로 충분한지 (fail로 격상 필요 여부)

10. **명세 자체의 정합성·문구**:
    - § 0 한 페이지 요약 ↔ § 4 ↔ § 14 인벤토리 일관성
    - § 1.1 변경 정책 ↔ 다른 절의 실제 변경 영향
    - 잔재 미해소·표 컬럼 정합·AST DSL 표기

## 출력 형식

이전과 동일 JSON 스키마.

타당한 지적은 모두 제기하라.

## 참고할 SoT 문서 경로

- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md` (대상 — v0.4)
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\ARCHITECTURE.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\RISK_LEVELS.md`
