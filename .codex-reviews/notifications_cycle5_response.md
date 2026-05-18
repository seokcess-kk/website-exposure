{
  "reviewTarget": "docs/features/notifications.md v0.5",
  "cycle": 5,
  "verdict": {
    "readyForV1": false,
    "closeableAfterPatch": true,
    "reviewerJudgment": "마감 가능 수준이다. 다만 REVIEW_WORKFLOW fallback 매트릭스 충돌과 enum/status 잔재는 구현자가 그대로 따르면 실패하므로 v1.0 태그 전 소규모 정정이 필요하다.",
    "findingCount": 7
  },
  "findings": [
    {
      "id": "N5-01",
      "severity": "major",
      "category": "EXTERNAL_SOT_CONFLICT",
      "title": "REVIEW_WORKFLOW fallback 컬럼이 notifications의 immediateChannels 제약과 충돌",
      "evidence": [
        "docs/features/notifications.md:266 — fallback 채널은 해당 eventType의 immediateChannels 집합 안에 있어야 한다고 명시",
        "docs/admin/REVIEW_WORKFLOW.md:460 — sla-imminent immediate=email, fallback=inApp",
        "docs/admin/REVIEW_WORKFLOW.md:461 — sla-overdue immediate=email, fallback=inApp"
      ],
      "impact": "v0.5 신규 제약을 적용하면 sla-imminent, sla-overdue의 fallback은 빌드/정책 검증 실패 대상이다.",
      "recommendation": "두 이벤트의 즉시 채널을 `email + inApp`으로 바꾸거나 fallback을 `(없음)`으로 바꿔 매트릭스를 제약과 맞춘다."
    },
    {
      "id": "N5-02",
      "severity": "major",
      "category": "RESIDUAL_CONTRADICTION",
      "title": "§4.1 idempotency 요약에 abort 원인 분기 이전 문구가 남아 있음",
      "evidence": [
        "docs/features/notifications.md:242 — 트랜잭션 abort 시 기존 NotificationLog 조인으로 DeliveryResult 재구성 반환",
        "docs/features/notifications.md:221-225 — unique violation만 idempotent path, 그 외 abort는 retryable internal error"
      ],
      "impact": "DB timeout/FK 오류까지 idempotent duplicate처럼 처리하는 잘못된 구현을 유도한다.",
      "recommendation": "§4.1 1단계 문구를 §3.3과 동일하게 `unique(instanceId, sourceEventId) violation만 기존 결과 재구성, 그 외 abort는 retryable internal error`로 정정한다."
    },
    {
      "id": "N5-03",
      "severity": "major",
      "category": "ENUM_CONTRACT",
      "title": "DeliveryAttempt.status가 사용하는 processing이 DeliveryStatus enum에 없음",
      "evidence": [
        "docs/features/notifications.md:186-200 — DeliveryStatus enum에 processing 없음",
        "docs/features/notifications.md:785 — NotificationDeliveryAttempt.status 설명은 processing(선점) 상태를 사용",
        "docs/features/notifications.md:503,798 — 큐 중복 방지 쿼리와 partial index도 status='processing'을 참조"
      ],
      "impact": "스키마 타입과 쿼리가 불일치해 단독 구현 시 enum validation 또는 DB constraint에서 막힌다.",
      "recommendation": "DeliveryStatus에 `processing`을 추가하거나, 외부 DeliveryStatus와 내부 DeliveryAttemptStatus를 분리 정의한다."
    },
    {
      "id": "N5-04",
      "severity": "medium",
      "category": "FLOW_GAP",
      "title": "skipped-missing-location이 §3.2와 §8.4에는 있으나 §4.1 필터 흐름에 빠져 있음",
      "evidence": [
        "docs/features/notifications.md:199 — DeliveryStatus enum에 skipped-missing-location 추가",
        "docs/features/notifications.md:607 — invalid locationRef 처리 명시",
        "docs/features/notifications.md:270 — §4.1 businessHours 단계에는 deferred-business-hours만 있고 invalid locationRef 분기 없음"
      ],
      "impact": "실행 순서만 보고 구현하면 invalid locationRef를 main fallback 또는 businessHours deferred로 잘못 처리할 수 있다.",
      "recommendation": "§4.1의 businessHours 평가 직전에 `metadata.locationRef invalid → skipped-missing-location + external sink alert` 분기를 추가한다."
    },
    {
      "id": "N5-05",
      "severity": "medium",
      "category": "DB_SCHEMA",
      "title": "MySQL generated column 대체 unique schema가 inactive DLQ 다수를 허용하지 않음",
      "evidence": [
        "docs/features/notifications.md:955-956 — isActive BOOLEAN generated + UNIQUE(payloadId, failingChannel, isActive)",
        "docs/features/notifications.md:958 — isActive=false row는 다수 허용이라고 설명"
      ],
      "impact": "MySQL unique key는 `(payloadId, failingChannel, false)` 중복을 막으므로 resolved DLQ 이력 다수를 저장할 수 없다.",
      "recommendation": "generated column을 `activeKey = CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END` 형태로 두고 `UNIQUE(payloadId, failingChannel, activeKey)`를 사용한다."
    },
    {
      "id": "N5-06",
      "severity": "medium",
      "category": "CASCADE_INCOMPLETE",
      "title": "AdminUserRole system cascade가 DATA_MODEL C-23 설명에 반영되지 않음",
      "evidence": [
        "docs/admin/REVIEW_WORKFLOW.md:581-590 — AdminUserRole enum에 system 추가",
        "docs/core/DATA_MODEL.md:827 — AdminUser.role 설명은 REVIEW_WORKFLOW §11.1 enum 5종이라고 표기",
        "docs/core/DATA_MODEL.md:833 — instanceMemberships.role도 AdminUserRole을 참조"
      ],
      "impact": "`system`이 DB row 미생성 audit 전용 role인지, C-23 AdminUser.role/instanceMemberships.role에 허용되는지 타입 경계가 모호하다.",
      "recommendation": "DATA_MODEL C-23에 `system은 audit actorRole 표기 전용이며 AdminUser.role/instanceMemberships.role에는 저장 불가`를 명시하거나 DB role 타입을 별도 명명한다."
    },
    {
      "id": "N5-07",
      "severity": "minor",
      "category": "VERSION_METADATA",
      "title": "문서 상태는 v0.5인데 Feature metadata specVersion은 0.4",
      "evidence": [
        "docs/features/notifications.md:3 — 상태 Draft v0.5",
        "docs/features/notifications.md:74 — specVersion: \"0.4\""
      ],
      "impact": "패키지 SemVer와 policyVersion을 분리한 문서에서 specVersion까지 오래된 값이면 빌드/검증 기준 버전이 불명확하다.",
      "recommendation": "v1.0 안정판 전 `specVersion`을 의도한 값으로 갱신하고, package SemVer/policyVersion/specVersion의 의미 차이를 한 줄로 구분한다."
    }
  ],
  "checkedNoIssue": [
    "§0 인벤토리 11 tables와 §14 테이블 목록은 정합",
    "§14.4에서 broadcastAttemptId 필드 제거 및 broadcast DeliveryAttempt.id를 결과 합성 시 참조하는 정책은 §5.2와 대체로 정합",
    "fallback 두 attempt 기록은 UNIQUE(payloadId, channel, attemptNumber)와 충돌하지 않음",
    "provider 호출을 lock/transaction 밖에서 수행하고 processing 선점 row로 큐 worker가 중복 발송을 회피하는 흐름은 정합",
    "수동 unsuppress의 observedCount=0 reset은 threshold 1회 alert 정책과 충돌하지 않음",
    "§12 미결정은 운영/인프라/M2+/v1.x 후속으로 분류되어 v1.0 자체를 막는 성격은 아님"
  ]
}