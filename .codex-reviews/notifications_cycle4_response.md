{
  "schemaVersion": "auto-critique.v1",
  "target": "docs/features/notifications.md v0.4",
  "reviewedAt": "2026-05-14",
  "summary": {
    "verdict": "v0.4는 v0.3 주요 지적 상당수를 해소했지만, 동시성 경계·fallback 결과 표현·broadcast payload 모델·운영 캘린더·suppression 수동 해제·audit actor 모델에서 새 모순 또는 미정의 영역이 남아 있다.",
    "findingCount": 24,
    "bySeverity": {
      "critical": 0,
      "high": 8,
      "medium": 14,
      "low": 2
    }
  },
  "findings": [
    {
      "id": "N4-01",
      "severity": "high",
      "category": "transaction-concurrency",
      "section": "§ 3.3, § 4.1, § 14.2",
      "issue": "트랜잭션 abort 경로가 unique violation과 기타 DB 장애를 구분하지 않는다.",
      "evidence": "notify() 계약은 Receipt insert unique 위반 시 transaction abort 후 기존 receipt를 조인한다고 쓰지만, 중간 장애·FK 오류·DB timeout도 abort를 만들 수 있다.",
      "impact": "기존 receipt가 없는 장애까지 idempotent duplicate로 오인해 빈 DeliveryResult 또는 잘못된 성공 응답을 반환할 수 있다.",
      "recommendation": "abort 원인을 명시적으로 분기하라. unique(instanceId, sourceEventId) 충돌만 기존 receipt 재구성 경로로 보내고, 그 외 abort는 retryable/internal error로 반환해야 한다."
    },
    {
      "id": "N4-02",
      "severity": "high",
      "category": "transaction-concurrency",
      "section": "§ 3.3, § 4.1",
      "issue": "동시 duplicate 호출이 winner 트랜잭션 commit 직후, fan-out 완료 전 receipt를 읽을 때의 결과 계약이 불명확하다.",
      "evidence": "1단계 commit 후 receiptState='accepted'가 가시화되고, 이후 fan-out·DeliveryAttempt가 생성된다. duplicate caller는 기존 Log·PayloadRecord·DeliveryAttempt 조인으로 DeliveryResult를 재구성한다고 되어 있다.",
      "impact": "duplicate caller가 accepted/processing 상태의 receipt를 보면서 아직 attempts가 없는 불완전 DeliveryResult를 받을 수 있다.",
      "recommendation": "기존 receipt가 accepted/processing이면 `receiptState='processing'` 결과를 허용할지, 짧은 poll/wait 후 completed를 반환할지, 202-style 응답으로 분리할지 명시하라."
    },
    {
      "id": "N4-03",
      "severity": "medium",
      "category": "transaction-concurrency",
      "section": "§ 3.3, § 14.2",
      "issue": "Log → Receipt insert 순서에서는 FK deferred constraint가 필요 없지만, 명세가 이를 명시하지 않아 구현자가 불필요한 deferred FK를 도입할 여지가 있다.",
      "evidence": "Receipt.notificationLogId는 같은 트랜잭션 안에서 먼저 insert된 NotificationLog를 참조한다.",
      "impact": "deferred FK를 켜면 오류 발견 시점이 commit으로 밀려 장애 원인 분리가 어려워질 수 있다.",
      "recommendation": "동일 트랜잭션에서 parent Log를 먼저 insert하므로 일반 immediate FK로 충분하다고 명시하라. deferred FK는 순환 참조가 생길 때만 예외로 둔다."
    },
    {
      "id": "N4-04",
      "severity": "high",
      "category": "delivery-attempt-concurrency",
      "section": "§ 4.4, § 14.3, § 14.4",
      "issue": "PayloadRecord row lock 설명이 `(payloadId, channel)` 조합을 lock한다고 하지만 PayloadRecord에는 channel 필드가 없다.",
      "evidence": "§ 14.3은 PayloadRecord에서 channel 필드를 제거했고, § 4.4는 `SELECT ... FOR UPDATE on (payloadId, channel)`라고 쓴다.",
      "impact": "구현자가 존재하지 않는 row lock 대상을 만들거나, 채널별 lock과 payload 단위 lock의 직렬화 범위를 다르게 구현할 수 있다.",
      "recommendation": "운영 SoT를 하나로 닫아라. 예: PostgreSQL advisory lock `hash(payloadId, channel)`을 표준으로 삼거나, PayloadRecord row lock은 payload 전체 채널을 직렬화한다고 명시하라."
    },
    {
      "id": "N4-05",
      "severity": "high",
      "category": "delivery-attempt-concurrency",
      "section": "§ 4.4, § 14.4",
      "issue": "attemptNumber scope는 `(payloadId, channel)`인데 unique constraint는 `dedupeMode`를 포함한다.",
      "evidence": "§ 4.4는 attemptNumber가 `(payloadId, channel)` 범위 sequence라고 정의하지만 § 14.4는 `UNIQUE(payloadId, channel, attemptNumber, dedupeMode)`이다.",
      "impact": "normal attemptNumber=1과 resend attemptNumber=1이 동시에 존재할 수 있어, sequence 의미와 운영 UI 정렬이 깨진다.",
      "recommendation": "sequence가 정말 `(payloadId, channel)` 범위라면 unique를 `UNIQUE(payloadId, channel, attemptNumber)`로 바꾸고 dedupeMode는 일반 컬럼으로 둔다."
    },
    {
      "id": "N4-06",
      "severity": "medium",
      "category": "delivery-attempt-concurrency",
      "section": "§ 4.4",
      "issue": "provider 호출을 lock/transaction 안에서 하는지 밖에서 하는지 문구가 모호하다.",
      "evidence": "§ 4.4는 lock 보유 상태에서 INSERT 후 `status='processing', provider 호출 후 update`라고 읽힌다.",
      "impact": "DB transaction을 외부 provider 호출 동안 유지하면 lock 시간이 길어지고 deadlock·connection pool 고갈 위험이 커진다.",
      "recommendation": "권장 순서를 명확히 하라: 짧은 transaction에서 lock → max+1 → processing attempt insert → commit, 이후 provider 호출 → 별도 transaction으로 attempt update."
    },
    {
      "id": "N4-07",
      "severity": "medium",
      "category": "fallback-policy",
      "section": "§ 4.1, REVIEW_WORKFLOW § 9.1.1",
      "issue": "fallback 채널이 즉시 채널 외부인지 여부는 REVIEW_WORKFLOW에는 닫혔지만 notifications.md 자체에는 같은 제약이 직접 반영되지 않았다.",
      "evidence": "REVIEW_WORKFLOW § 9.1.1은 즉시 채널 외부 임의 추가 금지라고 쓰지만, notifications.md § 4.1은 매트릭스 fallback 채널로 라우팅한다고만 쓴다.",
      "impact": "notifications.md만 보고 구현하면 fallback으로 즉시 채널 외 채널을 허용할 수 있다.",
      "recommendation": "§ 4.1에도 `fallback 채널은 해당 eventType의 immediateChannels 집합 안에 있어야 한다`를 명시하라."
    },
    {
      "id": "N4-08",
      "severity": "high",
      "category": "fallback-result-model",
      "section": "§ 3.2, § 4.1, § 7.3",
      "issue": "원 채널 hard-suppressed 후 fallback도 hard-suppressed인 경우 DeliveryAttempt/DeliveryResult 표현이 없다.",
      "evidence": "§ 4.1은 외부 monitoring sink alert만, recipient 발송 없음이라고 하지만 DeliveryStatus에는 external-alert-only 또는 fallback-exhausted 상태가 없다.",
      "impact": "호출자와 운영 UI가 해당 recipient/channel이 왜 결과에서 사라졌는지 구분할 수 없다.",
      "recommendation": "원 채널에는 `skipped-suppressed` attempt를 남기고, fallback 실패도 별도 `skipped-suppressed` attempt로 남길지 정의하라. 외부 sink alert만 발생한 경우도 DeliveryResult에 추적 가능한 상태를 두어야 한다."
    },
    {
      "id": "N4-09",
      "severity": "medium",
      "category": "policy-versioning",
      "section": "§ 1.1, § 4.2",
      "issue": "policyVersion 추가 운영과 SemVer MAJOR 정책의 관계가 불명확하다.",
      "evidence": "§ 1.1은 이벤트 정책 매트릭스 변경을 MAJOR라고 하지만, § 4.2는 새 policyVersion 추가 후 manifest opt-in으로 운영한다고만 한다.",
      "impact": "패키지 버전 MAJOR bump가 필요한지, 단순 policyVersion append가 minor/patch인지 릴리즈 판단이 갈린다.",
      "recommendation": "`매트릭스 의미 변경은 policyVersion 기준 MAJOR이며, 패키지에는 append-only 추가 시 MINOR 가능`처럼 버전 축을 분리해서 명시하라."
    },
    {
      "id": "N4-10",
      "severity": "medium",
      "category": "policy-versioning",
      "section": "§ 4.2",
      "issue": "policyVersion 보관 상한·지원 기간·deprecation 절차가 부족하다.",
      "evidence": "§ 4.2는 사용 인스턴스 0건이면 제거 가능하다고만 한다.",
      "impact": "장기 운영 시 패키지에 무제한 매트릭스가 쌓이거나, 비활성 인스턴스/복구 인스턴스가 참조하는 버전이 제거될 수 있다.",
      "recommendation": "최소 지원 기간, 제거 전 migration report, archived instance 처리, build fail 메시지 정책을 추가하라."
    },
    {
      "id": "N4-11",
      "severity": "medium",
      "category": "digest-policy-ast",
      "section": "§ 6.1, REVIEW_WORKFLOW § 9.2",
      "issue": "DigestConditionField는 일부 metadata 경로만 enum으로 닫았지만, NotificationEvent.metadata 자체의 스키마와 cascade 규칙이 없다.",
      "evidence": "DigestConditionField는 `metadata.staleTriggeredBy` 등 4개 경로를 열거하지만 REVIEW_WORKFLOW § 9.2의 metadata는 object로만 정의된다.",
      "impact": "새 metadata 필드를 digest 조건에 쓰려면 어디를 어떻게 갱신해야 하는지 불명확하다.",
      "recommendation": "eventType별 metadata schema를 REVIEW_WORKFLOW에 두거나, DigestConditionField 추가 시 REVIEW_WORKFLOW § 9.2와 notifications § 6.1 모두 cascade해야 한다고 명시하라."
    },
    {
      "id": "N4-12",
      "severity": "medium",
      "category": "digest-policy-ast",
      "section": "§ 6.1",
      "issue": "`exists`/`notExists`의 deep path 평가 규칙이 없다.",
      "evidence": "`metadata.priorReviewSubmissionId` 같은 dotted path를 허용하지만 missing parent, null, empty string, false 값을 어떻게 판정하는지 정의하지 않는다.",
      "impact": "런타임마다 digest bucket 분류가 달라질 수 있다.",
      "recommendation": "path resolution 규칙을 명시하라. 예: missing property만 notExists, null은 exists=false로 볼지, empty string은 exists=true로 볼지 고정한다."
    },
    {
      "id": "N4-13",
      "severity": "low",
      "category": "digest-policy-ast",
      "section": "§ 6.1",
      "issue": "default policy의 유일성 검증이 없다.",
      "evidence": "배열 순서와 default 마지막은 정의되어 있지만 default가 0개 또는 2개 이상일 때 build fail인지 불명확하다.",
      "impact": "digest 주기가 없는 이벤트 또는 중복 default가 조용히 잘못 분류될 수 있다.",
      "recommendation": "각 eventType/channel별 default는 최대 1개, digest 셀이 있는 경우 최소 1개를 build 검증하라."
    },
    {
      "id": "N4-14",
      "severity": "high",
      "category": "broadcast-data-flow",
      "section": "§ 4.1, § 5.2, § 14.3, § 14.4",
      "issue": "broadcast 모드에서 PayloadRecord가 recipient별로 생성되는지 envelope당 1건 생성되는지 상충한다.",
      "evidence": "§ 4.1은 recipients 각각 payloadId를 부여한다고 하고, § 5.2는 broadcast attempt는 envelope+channel 단위 1건이라고 한다. § 14.3은 PayloadRecord.recipientId nullable broadcast를 허용한다.",
      "impact": "broadcast DeliveryAttempt의 payloadId FK가 어떤 PayloadRecord를 참조해야 하는지 구현이 갈린다.",
      "recommendation": "broadcast용 PayloadRecord를 envelope+channel 단위로 1건 생성할지, recipient별 PayloadRecord 중 대표 1건을 참조할지, 별도 BroadcastPayload 테이블을 둘지 명확히 하라."
    },
    {
      "id": "N4-15",
      "severity": "medium",
      "category": "broadcast-data-flow",
      "section": "§ 3.2, § 5.2, § 14.4",
      "issue": "broadcastAttemptId가 실제 attempt.id인지 별도 UUID인지 모호하다.",
      "evidence": "§ 14.4는 `broadcastAttemptId(UUID) 자기 참조`라고 쓰지만 DeliveryAttempt에는 이미 `id`가 있다.",
      "impact": "per-recipient placeholder가 실제 DeliveryAttempt.id를 참조할지 별도 group id를 참조할지 달라져 조인이 깨질 수 있다.",
      "recommendation": "`broadcastAttemptId = broadcast DeliveryAttempt.id`로 고정하거나, 별도 `broadcastGroupId`로 이름을 바꿔 자기 참조 의미를 제거하라."
    },
    {
      "id": "N4-16",
      "severity": "medium",
      "category": "broadcast-data-flow",
      "section": "§ 3.2, § 14.4",
      "issue": "broadcast-placeholder가 DB row인지 DeliveryResult 합성 값인지 불명확하다.",
      "evidence": "DeliveryResult에는 placeholder가 있고, § 14.4 deliveryMode enum에도 `broadcast-placeholder`가 있다.",
      "impact": "placeholder rows를 DB에 만들면 skipped 결과가 recipient 수만큼 DeliveryAttempt에 쌓이고, 만들지 않으면 § 14.4 enum이 불필요하다.",
      "recommendation": "placeholder를 DB에 저장하는지 명시하라. 저장한다면 status, attemptNumber, payloadId FK, 집계 제외 규칙을 함께 정의해야 한다."
    },
    {
      "id": "N4-17",
      "severity": "high",
      "category": "business-hours-calendar",
      "section": "§ 8.4, DATA_MODEL C-08",
      "issue": "package-embedded holidayCalendar의 갱신·배포 정책이 없다.",
      "evidence": "KR 공휴일 데이터를 Feature 패키지에 embed한다고만 되어 있다.",
      "impact": "임시공휴일·대체공휴일 지정처럼 사후 변경되는 한국 공휴일을 놓칠 수 있다.",
      "recommendation": "공휴일 데이터 버전, 연간 갱신 일정, 긴급 패치 절차, external-api override 우선순위를 정의하라."
    },
    {
      "id": "N4-18",
      "severity": "medium",
      "category": "business-hours-calendar",
      "section": "§ 8.4",
      "issue": "다음 운영 가능 시각 산정의 탐색 한계가 없다.",
      "evidence": "종료 시각은 다음 운영 가능 시각이라고만 한다.",
      "impact": "연속 휴일, 장기 휴진, 잘못된 businessHours 설정, lunchBreak 전일 덮음 같은 입력에서 무한 루프 또는 과도한 계산이 발생할 수 있다.",
      "recommendation": "최대 탐색 기간 예: 90일, 실패 시 `failed-permanent` 또는 외부 sink alert, build warning/fail 기준을 정의하라."
    },
    {
      "id": "N4-19",
      "severity": "medium",
      "category": "business-hours-location",
      "section": "§ 8.4, REVIEW_WORKFLOW § 9.1.1",
      "issue": "NotificationEvent.metadata.locationRef가 존재하지만 InstanceManifest에 해당 LocationProfile이 없을 때 처리가 없다.",
      "evidence": "locationRef 산정은 metadata.locationRef 우선이라고만 하고 invalid reference 처리를 정의하지 않는다.",
      "impact": "잘못된 locationRef가 main fallback으로 조용히 보정되거나, worker 장애로 이어질 수 있다.",
      "recommendation": "invalid locationRef는 build-time이 아니라 runtime 입력 문제이므로 `deferred-business-hours` 대신 failed/skipped 상태와 external sink alert 중 하나로 고정하라."
    },
    {
      "id": "N4-20",
      "severity": "medium",
      "category": "suppression",
      "section": "§ 7.1, § 7.4, DATA_MODEL C-23",
      "issue": "hard-suppressed 수동 해제의 UI·권한·audit log 흐름이 없다.",
      "evidence": "DATA_MODEL에는 unsuppressedBy/unsuppressedAt이 있지만 notifications.md는 운영자 명시 unsuppress만 언급한다.",
      "impact": "누가 어떤 권한으로 suppression을 해제했는지 감사 추적이 끊긴다.",
      "recommendation": "수동 unsuppress command, required role, AuditAction 추가 여부, metadata, observedCount reset 정책을 정의하라."
    },
    {
      "id": "N4-21",
      "severity": "medium",
      "category": "suppression",
      "section": "§ 7.1, § 7.4",
      "issue": "운영자 unsuppress 후 threshold 재도달 시 alert 재발생 여부가 불명확하다.",
      "evidence": "soft auto-release는 observedCount=0으로 reset하지만 manual unsuppress의 observedCount 처리는 없다.",
      "impact": "재발 장애가 alert되지 않거나, 반대로 과거 count 때문에 즉시 재-alert될 수 있다.",
      "recommendation": "manual unsuppress도 observedCount=0, firstObservedAt/lastObservedAt 정책을 명시하거나, 별도 suppression epoch을 둬 alert 1회 보장을 epoch 단위로 바꾸라."
    },
    {
      "id": "N4-22",
      "severity": "medium",
      "category": "suppression",
      "section": "§ 7.1, § 7.4",
      "issue": "soft-suppressed 상태에서 hard bounce/permanent failure가 발생했을 때 soft → hard 전이 규칙이 없다.",
      "evidence": "7.1 표는 transient threshold와 permanent hard-suppressed를 따로 설명하지만 상태 우선순위는 없다.",
      "impact": "autoReleaseAt이 남아 있는 hard-suppressed 레코드가 생기거나, hard suppression이 soft auto-release worker에 의해 풀리는 버그가 생길 수 있다.",
      "recommendation": "hard 전이는 soft보다 우선하며 autoReleaseAt=null로 정리하고, worker 조건은 state만 아니라 hard 상태 불변성을 검증한다고 명시하라."
    },
    {
      "id": "N4-23",
      "severity": "high",
      "category": "queue-deduplication",
      "section": "§ 6.4, § 14.4, § 14.8, § 14.9",
      "issue": "큐 worker의 DeliveryAttempt status 검사만으로 중복 발송을 막는 정확한 쿼리·index·lock이 없다.",
      "evidence": "§ 6.4는 status 검사로 중복 방지한다고 하지만 어떤 status를 차단할지, processing row를 어떻게 원자 선점할지 없다.",
      "impact": "QuietHoursQueue와 BusinessHoursQueue가 같은 payload/channel을 동시에 release하면 둘 다 provider 호출할 수 있다.",
      "recommendation": "`WHERE payloadId=? AND channel=? AND status IN ('processing','delivered','deferred-*')` 검사와 attempt insert를 같은 lock 안에서 수행하고, `(payloadId, channel, status)` 또는 partial index를 추가하라."
    },
    {
      "id": "N4-24",
      "severity": "medium",
      "category": "data-model",
      "section": "§ 14.5, § 14.4",
      "issue": "inApp 발송 시 NotificationInbox row와 DeliveryAttempt row의 원자성·정합 규칙이 없다.",
      "evidence": "§ 5.3은 Inbox 저장소를, § 14.4는 DeliveryAttempt를 정의하지만 두 row 생성 순서와 실패 처리 상태가 없다.",
      "impact": "Inbox는 생성됐지만 DeliveryAttempt는 failed/누락이거나, delivered attempt는 있는데 Inbox가 없는 상태가 생길 수 있다.",
      "recommendation": "inApp은 단일 DB transaction에서 Inbox insert + DeliveryAttempt delivered insert를 원자 처리한다고 명시하고, UNIQUE(payloadId) 충돌 시 deduped/delivered 재구성 규칙을 추가하라."
    },
    {
      "id": "N4-25",
      "severity": "medium",
      "category": "dlq-schema",
      "section": "§ 14.11",
      "issue": "NotificationDeadLetterAttempt가 동일 attempt를 여러 DeadLetter에 연결할 수 있다.",
      "evidence": "constraint는 `UNIQUE(deadLetterId, attemptId)`뿐이고 attemptId 단독 unique가 없다.",
      "impact": "한 DeliveryAttempt가 여러 DLQ 항목에 중복 연결되어 resend/resolved summary가 꼬일 수 있다.",
      "recommendation": "attempt는 하나의 DLQ에만 속한다면 `UNIQUE(attemptId)`를 추가하라. 여러 DLQ 연결을 허용하려면 그 의미와 집계 규칙을 명시하라."
    },
    {
      "id": "N4-26",
      "severity": "low",
      "category": "dlq-schema",
      "section": "§ 14.11",
      "issue": "PostgreSQL partial unique index의 다른 DBMS 대체 스키마가 정확하지 않다.",
      "evidence": "다른 DBMS는 generated column `isActive`로 대체한다고만 쓰고 column definition과 unique key를 제시하지 않는다.",
      "impact": "MySQL 등에서 active DLQ unique 보장이 구현자별로 달라질 수 있다.",
      "recommendation": "`isActive = resolvedAt IS NULL` generated column과 `UNIQUE(payloadId, failingChannel, isActive)` 등 구체 schema를 추가하라."
    },
    {
      "id": "N4-27",
      "severity": "medium",
      "category": "audit-log",
      "section": "§ 5.3, REVIEW_WORKFLOW § 10.2",
      "issue": "`notification-read`의 actorRole 산정이 없다.",
      "evidence": "AuditLogEntry.actorRole은 AdminUserRole required이고, notification-read는 사용자가 inApp 클릭 시 기록한다고만 한다.",
      "impact": "client approver, operator, medical/legal 같은 역할 중 어떤 값을 기록할지 구현이 갈린다.",
      "recommendation": "actorRole은 AdminUser.instanceMemberships의 현재 instance role로 기록한다고 명시하고, approverRoleEligibility와 구분하라."
    },
    {
      "id": "N4-28",
      "severity": "medium",
      "category": "audit-log",
      "section": "§ 4.1, REVIEW_WORKFLOW § 10.2",
      "issue": "system actor의 actorRole이 required enum과 충돌한다.",
      "evidence": "AuditLogEntry.actorId는 사용자 ID 또는 `system`을 허용하지만 actorRole은 AdminUserRole required다. notifications.md § 4.1은 envelope 완료 시 `notification-dispatched` audit log를 자동 기록한다.",
      "impact": "시스템 자동 발송 요약 audit에 넣을 actorRole 값이 없다.",
      "recommendation": "actorRole에 `system`을 추가하거나, actorRole을 optional로 만들고 actorType을 분리하라."
    },
    {
      "id": "N4-29",
      "severity": "medium",
      "category": "cross-document-consistency",
      "section": "§ 8.4, § 11, DATA_MODEL C-21",
      "issue": "LocationProfile `main` 부재가 DATA_MODEL에서는 단지점 필수처럼 보이지만 notifications 빌드 검증에서는 warning에 그친다.",
      "evidence": "DATA_MODEL C-21은 단지점은 `slug=main` 1개 필수라고 하고, notifications § 11은 multi-location + main 부재를 warning으로 둔다.",
      "impact": "businessHours fallback이 첫 LocationProfile로 조용히 바뀌어 다지점 알림 시간이 잘못 계산될 수 있다.",
      "recommendation": "clientApproverBusinessHoursAware=true인 multi-location에서 main 부재는 fail로 격상하거나, 모든 NotificationEvent에 valid locationRef required로 바꾸라."
    },
    {
      "id": "N4-30",
      "severity": "medium",
      "category": "open-issues",
      "section": "§ 5.3, § 12",
      "issue": "inactive 사용자 historical inbox 정책이 본문에서는 해소된 것처럼 쓰였지만 § 12 미결정에 NT-16으로 남아 있다.",
      "evidence": "§ 5.3은 기본 숨김 + override 가능을 정의하고, § 12는 NT-16을 미결정으로 유지한다.",
      "impact": "해소/미해소 상태가 충돌한다.",
      "recommendation": "NT-16을 해소된 미결정으로 이동하거나, override 세부가 아직 미결정이면 본문 표현을 운영 기본안으로 낮춰라."
    }
  ],
  "validatedCorrections": [
    {
      "item": "Receipt FK deferred 여부",
      "result": "Log를 먼저 insert하고 Receipt가 이를 참조하므로 일반 immediate FK로 충분하다. 다만 abort 원인 분기는 필요하다."
    },
    {
      "item": "fallback 채널 외부 채널 허용 여부",
      "result": "REVIEW_WORKFLOW § 9.1.1에는 즉시 채널 외부 임의 추가 금지가 반영되어 있다. notifications.md 본문에도 같은 제약을 중복 명시하는 것이 안전하다."
    },
    {
      "item": "DigestPolicy 매칭 우선순위",
      "result": "배열 순서 첫 매칭과 default 마지막 원칙은 명시되어 있다. 남은 문제는 default 유일성 검증과 deep path semantics다."
    },
    {
      "item": "테이블 인벤토리",
      "result": "DB 11 tables + Redis 1 keyspace 산정은 § 0과 § 14 기준으로 대체로 일치한다."
    }
  ]
}