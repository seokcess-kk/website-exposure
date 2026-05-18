{
  "reviewTarget": "docs/features/notifications.md v0.3",
  "reviewMode": "strict_consistency_review_cycle_3",
  "summary": {
    "totalFindings": 18,
    "critical": 5,
    "major": 10,
    "minor": 3,
    "overallAssessment": "v0.3는 v0.2 지적을 상당 부분 흡수했지만, 새로 도입한 Receipt/Payload/Attempt/DLQ 모델이 트랜잭션 순서, 테이블 인벤토리, broadcast 결과 표현, suppression fallback에서 새 모순을 만들었다. 특히 §14 데이터 구조는 구현 직전 정리가 필요하다."
  },
  "findings": [
    {
      "id": "N3-01",
      "severity": "critical",
      "category": "idempotency_transaction",
      "location": "notifications.md:227-229, 254-257, 696-708",
      "issue": "NotificationEventReceipt를 먼저 insert한다고 하지만, §14.2의 notificationLogId가 required FK다. NotificationLog가 아직 생성되지 않은 상태에서는 receipt 선점 insert가 불가능하거나, log를 먼저 만들면 'receipt 선점이 1단계'라는 계약이 깨진다.",
      "impact": "동일 sourceEventId race 제거의 핵심 경로가 구현 불가능하거나 DB별 deferred FK에 의존한다. 또한 receipt insert 후 log 생성 전 장애가 나면 재호출 시 기존 결과 재구성이 불가능하다.",
      "recommendation": "하나의 DB 트랜잭션 안에서 (a) NotificationLog를 먼저 생성하고 Receipt를 unique insert 하도록 순서를 바꾸거나, (b) receipt.notificationLogId를 nullable로 두고 log 생성 후 같은 트랜잭션에서 채우도록 명시한다. 중간 장애 시 receiptState='accepted' stale receipt 복구/실패 처리도 정의해야 한다."
    },
    {
      "id": "N3-02",
      "severity": "critical",
      "category": "data_inventory",
      "location": "notifications.md:228, 256, 680, 684-688, 850-866",
      "issue": "문서는 'DB 8 tables + Redis 1 keyspace'라고 고정하지만 §14에는 Receipt, PayloadRecord, DeliveryAttempt, Inbox, Log, DigestBucket, QuietHoursQueue, BusinessHoursQueue, DeadLetter만 세어도 9개 테이블이다. 여기에 NotificationDigestBucketPayload join table까지 포함하면 10개다. 반대로 §3.3/§4.1은 NotificationDelivery 테이블을 조인한다고 하나 §14에는 해당 테이블이 없다.",
      "impact": "마이그레이션 인벤토리, 설치 단계, DeliveryResult 재구성 경로가 서로 맞지 않는다. v0.3 변경 이력의 'NotificationDelivery 신설'도 실제 스키마와 불일치한다.",
      "recommendation": "테이블 수를 재산정하고 NotificationDelivery를 실제로 둘지 제거할지 결정한다. DeliveryAttempt만으로 충분하다면 모든 'NotificationDelivery' 참조와 변경 이력 문구를 삭제한다. DigestBucketPayload가 물리 테이블이면 인벤토리에 포함한다."
    },
    {
      "id": "N3-03",
      "severity": "critical",
      "category": "attempt_concurrency",
      "location": "notifications.md:464-465, 733-755",
      "issue": "resendDeadLetter와 재시도 worker가 attemptNumber = 기존 max + 1로 새 DeliveryAttempt를 만든다고 하나, 동시 worker/동시 수동 resend에서 같은 max를 읽으면 UNIQUE(payloadId, channel, attemptNumber, dedupeMode) 충돌이 난다.",
      "impact": "재시도/수동 재발송이 간헐적으로 실패하거나, 성공한 provider 호출 뒤 DB insert만 실패하는 이중 장애가 생길 수 있다.",
      "recommendation": "payloadId+channel 단위 row lock, DB sequence, advisory lock, 또는 AttemptCounter 테이블을 명시한다. provider 호출 전 attempt row를 먼저 'processing'으로 선점하고, 성공/실패 결과를 update하는 순서도 고정해야 한다."
    },
    {
      "id": "N3-04",
      "severity": "critical",
      "category": "payload_channel_model",
      "location": "notifications.md:263, 711-731, 420-433",
      "issue": "§4.1은 PayloadRecord에 channel을 저장한다고 쓰지만 §14.3 스키마에는 channel 필드가 없다. 동시에 하나의 payloadId가 inApp 즉시 + email digest 또는 quietHours queue에 들어갈 수 있다고 하면서 directSentAt/digestSentAt은 payload 단위 단일 필드다.",
      "impact": "inApp 즉시 발송으로 directSentAt이 찍힌 뒤 email quietHours worker가 같은 payload의 directSentAt을 보고 중복 발송으로 오판할 수 있다. 채널별 상태 복원이 불가능하다.",
      "recommendation": "PayloadRecord를 recipient-envelope 단위로 둘지 channel-delivery 단위로 둘지 확정해야 한다. 전자를 유지한다면 sentAt/status는 channel별 DeliveryAttempt/DeliveryState로만 판단하고, PayloadRecord의 directSentAt/digestSentAt은 제거하거나 channel-scoped 구조로 바꾼다."
    },
    {
      "id": "N3-05",
      "severity": "critical",
      "category": "policy_matrix_violation",
      "location": "notifications.md:279-282, REVIEW_WORKFLOW.md:450-461",
      "issue": "suppression 필터에서 critical + hard-suppressed 채널이면 다른 활성 채널로 자동 라우팅한다고 했지만, REVIEW_WORKFLOW §9.1.1의 immediateChannels가 SoT다. 예를 들어 sla-overdue는 email만 즉시 채널인데, email hard-suppressed 시 inApp 우선 자동 라우팅은 매트릭스에 없는 채널 추가가 된다.",
      "impact": "정책 매트릭스 변경 없이 실제 발송 채널이 늘어난다. compliance/audit 관점에서 '어떤 이벤트가 어떤 채널로 나가는지' SoT가 깨진다.",
      "recommendation": "fallbackChannels를 §9.1.1 매트릭스에 별도 컬럼으로 추가하거나, 자동 라우팅은 immediateChannels 내부에서만 허용한다고 제한한다. 외부 monitoring sink alert는 recipient 발송 대체가 아님을 분리 표기한다."
    },
    {
      "id": "N3-06",
      "severity": "major",
      "category": "dedupe_atomicity",
      "location": "notifications.md:274, 314-332",
      "issue": "dedupeKey 매칭 후 발송 직전에 failed-retrying을 선기록한다고 하나, Redis 원자 연산 조건이 없다. 두 worker가 동시에 no-key를 확인하면 둘 다 provider 호출로 진입할 수 있다.",
      "impact": "idempotency 외부의 worker 중복 실행, rate-limit queue 재처리, 보류 queue release에서 중복 발송 가능성이 남는다.",
      "recommendation": "Redis SET key value NX EX 또는 Lua compare-and-set을 필수로 명시한다. 선기록 성공 worker만 provider 호출하고, 실패 worker는 deduped로 기록해야 한다."
    },
    {
      "id": "N3-07",
      "severity": "major",
      "category": "dedupe_idempotency_interaction",
      "location": "notifications.md:317-332, 696-709",
      "issue": "failed-permanent dedupe TTL은 dedupeWindowSeconds뿐이다. TTL 만료 후 같은 sourceEventId notify 재호출은 receipt가 막을 것으로 보이지만, receipt/log 보존 기간과 dedupe TTL의 관계가 명시되지 않았다.",
      "impact": "운영자가 dedupe TTL만 보고 같은 sourceEventId 재호출 가능 여부를 오해할 수 있다. receipt 보존 만료 후 같은 sourceEventId가 재사용되면 중복 발송된다.",
      "recommendation": "NotificationEventReceipt 보존 기간은 dedupeWindow보다 길고 sourceEventId 재사용 금지라는 규칙을 §4.3에 명시한다. 보존 만료 후 재호출 정책도 정의한다."
    },
    {
      "id": "N3-08",
      "severity": "major",
      "category": "broadcast_result_mapping",
      "location": "notifications.md:172-190, 356-367, REVIEW_WORKFLOW.md:518",
      "issue": "v0.3는 Slack을 per-recipient와 broadcast 혼합 모델로 정의하지만 REVIEW_WORKFLOW는 여전히 'Slack은 broadcast 채널'이라고 적는다. 또한 broadcastDeliveries[] 실제 결과와 perRecipient[].deliveries[].status='skipped-broadcast-only'를 소비자가 어떻게 집계해야 하는지 명확하지 않다.",
      "impact": "REVIEW_WORKFLOW나 운영 UI가 skipped-broadcast-only를 실패/스킵으로 계산하면 실제 broadcast 성공 이벤트가 누락 또는 실패로 표시될 수 있다.",
      "recommendation": "REVIEW_WORKFLOW §9.3를 v0.3 모델로 cascade 수정한다. DeliveryResult 소비 규칙에 skipped-broadcast-only는 per-recipient 추적 placeholder이며 성공/실패 집계는 broadcastDeliveries[]를 우선한다는 규칙을 추가한다."
    },
    {
      "id": "N3-09",
      "severity": "major",
      "category": "broadcast_mixed_recipients",
      "location": "notifications.md:361-367, 842-846",
      "issue": "같은 이벤트에서 slackUserId가 있는 사용자와 없는 사용자가 섞일 때, broadcast를 missing 사용자마다 1건 보낼지 event/channel당 1건 보낼지 불명확하다. dedupeKey도 recipientId를 포함하므로 broadcast recipientId=null 처리 시 키가 충돌하거나 반대로 recipient별 broadcast 중복 게시가 생길 수 있다.",
      "impact": "Slack channel에 같은 envelope가 여러 번 게시되거나, 일부 recipient의 skipped-broadcast-only 매핑이 실제 broadcast와 연결되지 않을 수 있다.",
      "recommendation": "broadcast attempt는 instanceId+sourceEventId+channel+deliveryMode 단위로 1건만 생성한다고 명시하고, perRecipient placeholder들과 broadcastAttemptId를 연결하는 매핑 필드를 둔다. broadcast dedupe key는 recipientId 대신 'broadcast' sentinel을 사용한다."
    },
    {
      "id": "N3-10",
      "severity": "major",
      "category": "digest_policy_dsl",
      "location": "notifications.md:382-409",
      "issue": "DigestPolicy.when.condition이 문자열 DSL이며 예시가 `metadata.staleTriggeredBy startsWith ...` 형태다. 허용 연산자, 필드 경로, 타입 검증, escaping, default 우선순위가 정의되지 않았다.",
      "impact": "자연어 매트릭스에서 코드 생성 가능한 구조로 분해했다는 v0.3 목표가 아직 충족되지 않는다. 런타임 eval 유혹도 생긴다.",
      "recommendation": "condition을 `{field: 'metadata.staleTriggeredBy', op: 'startsWith', value: 'medical-law-revision-'}` 같은 구조화 AST로 바꾸고, 허용 필드/연산자 enum과 매칭 우선순위를 명시한다."
    },
    {
      "id": "N3-11",
      "severity": "major",
      "category": "policy_version_rollout",
      "location": "notifications.md:48, 307-312, 635-640",
      "issue": "매트릭스 변경 순서가 'REVIEW_WORKFLOW 갱신 → Feature 빌드 → 인스턴스 재배포'인데, REVIEW_WORKFLOW가 canonical SoT라 문서 갱신 순간부터 실행 중 패키지와 SoT가 불일치한다. 롤백/동시 배포 정책도 없다.",
      "impact": "운영 중 일부 인스턴스는 구 매트릭스로 발송하고 문서는 신 매트릭스를 SoT로 주장하는 과도기가 생긴다.",
      "recommendation": "policyVersion별 매트릭스를 병렬 보관하고 InstanceManifest가 명시한 버전으로 라우팅한다고 정의한다. 배포는 새 패키지 배포 후 manifest opt-in, 롤백은 이전 policyVersion 유지로 처리하도록 바꾼다."
    },
    {
      "id": "N3-12",
      "severity": "major",
      "category": "digest_fk_lifecycle",
      "location": "notifications.md:690-693, 807-808",
      "issue": "§14.1은 FK 기본 ON DELETE RESTRICT라고 하지만 NotificationDigestBucketPayload는 'FK ON DELETE CASCADE'라고만 적어 bucketId와 payloadId 양쪽 모두 cascade인지 불명확하다.",
      "impact": "PayloadRecord 보존 정책과 join row 삭제 정책이 충돌할 수 있다. payload 삭제가 join row cascade로 허용되면 DLQ/로그 보존 순서와 맞지 않는다.",
      "recommendation": "bucketId FK는 ON DELETE CASCADE, payloadId FK는 ON DELETE RESTRICT로 분리 표기한다. bucket 삭제 시 payload는 보존되고 join row만 삭제된다는 생명주기를 명시한다."
    },
    {
      "id": "N3-13",
      "severity": "major",
      "category": "business_hours_sot",
      "location": "notifications.md:56, 91, 509-522, DATA_MODEL.md:150-185",
      "issue": "notifications.md는 PublicHoliday 캘린더가 CT-02에 정의된 것처럼 말하지만 DATA_MODEL CT-02에는 PublicHoliday가 dayOfWeek enum 값으로만 있고 국가별/IANA 캘린더 엔티티나 holiday source가 없다.",
      "impact": "한국 공휴일 적용 계산을 구현할 SoT가 없다. holidayPolicy는 표시용이라고 배제했기 때문에 실제 공휴일 산정 근거가 비어 있다.",
      "recommendation": "PublicHolidayCalendar 공통 타입 또는 InstanceManifest holidayRegion 설정을 DATA_MODEL에 cascade 추가한다. CT-02 dayOfWeek의 PublicHoliday enum과 외부 캘린더 적용 규칙을 분리한다."
    },
    {
      "id": "N3-14",
      "severity": "major",
      "category": "location_ref_consistency",
      "location": "notifications.md:145, 160, 512-515, DATA_MODEL.md:736-742",
      "issue": "notifications.md는 LocationProfile main=true fallback을 말하지만 DATA_MODEL C-21은 main boolean이 아니라 단지점/대표 지점을 slug 또는 @id='main' 관례로 설명한다.",
      "impact": "build warning 조건과 fallback lookup이 실제 DATA_MODEL과 맞지 않는다.",
      "recommendation": "fallback 기준을 `LocationProfile.@id == 'main'` 또는 ClinicProfile.locations[0] 등 실제 DATA_MODEL 필드로 정정한다. main boolean을 쓰려면 C-21에 필드를 cascade 추가해야 한다."
    },
    {
      "id": "N3-15",
      "severity": "major",
      "category": "suppression_lifecycle",
      "location": "notifications.md:121-123, 441-454, 620-622, DATA_MODEL.md:846-856",
      "issue": "config에는 softSuppressionAutoReleaseDays=14가 있지만 §7/§14에는 soft-suppressed 자동 해제 worker, autoReleaseAt, release 조건이 없다. C-23 suppression state에도 자동 해제 예정 시각 필드가 없다.",
      "impact": "soft-suppressed 상태가 자동 해제 가능하다는 모델 설명과 실제 운영 흐름이 불일치한다.",
      "recommendation": "suppression state에 autoReleaseAt 또는 lastObservedAt+config 기반 해제 규칙을 추가하고, 주기 worker가 state를 active로 되돌리는 조건 및 observedCount 리셋 정책을 명시한다."
    },
    {
      "id": "N3-16",
      "severity": "major",
      "category": "suppression_concurrency",
      "location": "notifications.md:443-448, DATA_MODEL.md:850-854",
      "issue": "observedCount++와 lastObservedAt 갱신이 multi-worker 환경에서 원자적인지 정의가 없다.",
      "impact": "동시 transient 실패가 발생하면 softSuppressionThreshold 도달 판정이 누락되거나 중복 alert가 발생할 수 있다.",
      "recommendation": "AdminUser suppression subdocument 갱신을 DB atomic increment/update로 수행하고, threshold crossing은 compare-and-set으로 한 번만 발생하도록 정의한다."
    },
    {
      "id": "N3-17",
      "severity": "major",
      "category": "audit_cascade",
      "location": "notifications.md:374, 467, 656, REVIEW_WORKFLOW.md:550-560",
      "issue": "notifications.md는 audit log `notification-resend-attempted`와 후속 `notification-read`를 언급하지만 REVIEW_WORKFLOW §10.2.1 AuditAction enum에는 `notification-dispatched`만 있다.",
      "impact": "실제 audit log writer가 enum validation을 하면 resend/read 이벤트 기록이 실패한다.",
      "recommendation": "REVIEW_WORKFLOW §10.2.1에 두 enum을 cascade 반영하거나, notifications.md에서 후속 enum을 실제 구현 범위 밖으로 명확히 제외한다. resendDeadLetter가 v0.3 범위라면 enum 추가도 같은 cycle에 포함되어야 한다."
    },
    {
      "id": "N3-18",
      "severity": "minor",
      "category": "db_portability",
      "location": "notifications.md:866-867",
      "issue": "`UNIQUE(payloadId, failingChannel, resolvedAt IS NULL)`은 SQL 표준 unique constraint 표기가 아니며 DBMS별 expression/partial index 지원에 의존한다.",
      "impact": "마이그레이션 생성 시 DBMS별 구현이 달라질 수 있다.",
      "recommendation": "PostgreSQL 기준이면 `CREATE UNIQUE INDEX ... WHERE resolvedAt IS NULL`로 표기하고, 다른 DB는 generated column `isActive`를 둔다고 명시한다."
    },
    {
      "id": "N3-19",
      "severity": "minor",
      "category": "fk_modeling",
      "location": "notifications.md:859, 866-869",
      "issue": "NotificationDeadLetter.failedAttemptIds를 UUID[] FK 배열이라고 표현하지만 일반 RDBMS에서 배열 원소 FK는 제약으로 보장하기 어렵다.",
      "impact": "DeadLetter와 Attempt 참조 무결성이 문서상 보장되는 것보다 약하다.",
      "recommendation": "NotificationDeadLetterAttempt join table을 추가하거나, failedAttemptIds는 비정규화 snapshot이며 무결성 보장 대상이 아니라고 낮춰 표현한다."
    },
    {
      "id": "N3-20",
      "severity": "minor",
      "category": "timezone_consistency",
      "location": "notifications.md:486-490, DATA_MODEL.md:829-843",
      "issue": "notifications.md는 digest 발송 시각을 InstanceManifest.timezone 고정이라고 하는데 DATA_MODEL C-23 AdminUser.timezone 설명은 'quietHours·digest 발송 기준'이라고 되어 있다.",
      "impact": "사용자 timezone이 digest에 적용되는지 문서 간 해석이 갈린다.",
      "recommendation": "DATA_MODEL C-23의 AdminUser.timezone 설명을 quietHours 기준으로 좁히거나, notifications.md에서 digest timezone 정책을 사용자별로 바꾼다."
    }
  ],
  "residualChecks": [
    {
      "topic": "inactive user historical inbox",
      "status": "gap",
      "note": "notifications.md는 inactive 사용자를 신규 발송 대상에서 제외하지만 기존 NotificationInbox 노출/숨김/소프트 삭제 정책은 없다. 운영 UI 정책으로 남길지 §5.3 또는 §14.5에 표시 분기를 추가해야 한다."
    },
    {
      "topic": "cadenceWindow format",
      "status": "gap",
      "note": "DigestBucket 예시는 weekly `2026-W19`만 있다. daily window 표기, timezone 기준 일자, ISO week 사용 여부를 §14.7에 명시해야 한다."
    },
    {
      "topic": "instanceMemberships isolation",
      "status": "gap",
      "note": "AdminUser.instanceMemberships[]는 DATA_MODEL에 있으나 notifications.md §14.1의 instanceId 격리와 연결된 recipient membership 검증 규칙이 없다. source instance에 속하지 않은 recipientId는 skipped-missing-user인지 build/runtime error인지 정의가 필요하다."
    }
  ]
}