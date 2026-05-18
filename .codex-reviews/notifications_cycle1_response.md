{
  "summary": "v0.1은 알림 Feature의 큰 책임 범위는 잡았지만, 현재 상태로는 안정판 후보가 아니라 구현 전 재작성 대상에 가깝다. 가장 큰 문제는 REVIEW_WORKFLOW §9가 SoT로 둔 NotificationPayload를 “새 페이로드 타입 신설하지 않음”이라고 선언하면서 실제로는 recipients 배열을 가진 NotificationEvent를 새로 정의한다는 점이다. 또한 AdminUser, notificationPreferences, NotificationInbox, NotificationLog, DLQ, retry queue, digest bucket, admin base URL, timezone 같은 구현 필수 계약이 대부분 미결정으로 남아 있어 단독 구현이 불가능하다. 의료 도메인 관점에서도 사전심의 결과·의료법 critical 이벤트·운영시간 외 알림·5종 권한별 수신 정책이 충분히 닫혀 있지 않다.",
  "findings": [
    {
      "id": "F-1",
      "severity": "fail",
      "section": "§ 0, § 3.1",
      "location_quote": "출력 SoT: NotificationPayload 형식 (REVIEW_WORKFLOW § 9.2). 본 Feature는 새 페이로드 타입 신설하지 않음\n type NotificationEvent = { ... recipients: NotificationRecipient[]; ... }",
      "issue": "NotificationPayload를 SoT로 따른다고 하면서 실제 입력 타입은 별도 NotificationEvent로 신설했다.",
      "rationale": "REVIEW_WORKFLOW §9.2의 NotificationPayload는 단일 recipientId, recipientRole, ctaUrl을 필수로 갖는다. notifications.md의 NotificationEvent는 recipients 배열을 도입하고 ctaUrl을 metadata 내부 선택값처럼 취급한다. 이는 SoT 직접 충돌이다.",
      "suggested_fix": "notify() 입력을 NotificationPayload 단건 또는 NotificationPayload[] 배치로 바꾸거나, REVIEW_WORKFLOW §9에 BatchNotificationEvent/NotificationEnvelope를 정식 cascade로 추가하고 필드 매핑 표를 명시해야 한다."
    },
    {
      "id": "F-2",
      "severity": "fail",
      "section": "§ 3.2, § 3.3",
      "location_quote": "status: \"delivered\" | \"deferred\" | \"failed\" | \"deduped\" | \"skipped-quiet-hours\";\nrecipientId가 AdminUser DB에 없으면 → 해당 recipient는 `skipped-missing-user` 상태로 결과 기록",
      "issue": "DeliveryResult.status enum과 실제 사용하는 상태값이 불일치한다.",
      "rationale": "명세상 결과 타입에 없는 `skipped-missing-user`를 반환하도록 되어 있어 타입 구현이 불가능하다. quiet hours 보류도 `skipped-quiet-hours`인지 `deferred`인지 불명확하다.",
      "suggested_fix": "DeliveryStatus enum을 `delivered | deferred-digest | deferred-quiet-hours | failed | deduped | skipped-missing-user | skipped-disabled-channel | skipped-opt-out` 등으로 확정하고 §4, §6, §8의 상태 전이를 같은 enum으로 통일한다."
    },
    {
      "id": "F-3",
      "severity": "fail",
      "section": "§ 3.1",
      "location_quote": "type NotificationEventType =\n  | \"content-gate-queued\" ... | \"sla-overdue\";",
      "issue": "REVIEW_WORKFLOW §9.1 표를 enum SoT처럼 참조하지만, 상위 문서에는 실제 NotificationEventType enum 정의가 없다.",
      "rationale": "REVIEW_WORKFLOW §9.1은 한국어 이벤트명 표이고 §9.2는 NotificationPayload 타입만 정의한다. notifications.md가 임의 영문 enum을 만들면 호출자와 구현자가 같은 값을 쓴다는 보장이 없다.",
      "suggested_fix": "REVIEW_WORKFLOW §9.1에 canonical enum 컬럼을 추가하고 notifications.md는 그 enum을 그대로 import/참조한다. 각 한국어 이벤트명과 영문 eventType의 1:1 매핑 표도 필요하다."
    },
    {
      "id": "F-4",
      "severity": "major",
      "section": "§ 4.2",
      "location_quote": "| content-gate-queued | email + Slack + inApp | ? |\n| stale-queued | inApp 즉시 | email 일일 요약 |",
      "issue": "REVIEW_WORKFLOW의 권장 알림 채널·주기와 라우팅 표가 충돌한다.",
      "rationale": "REVIEW_WORKFLOW §3.3은 content-gate를 일일 요약, stale을 주간 요약으로 둔다. REVIEW_WORKFLOW §9.1은 stale을 이메일 + 일일/주간 요약으로 둔다. notifications.md는 content-gate를 즉시 전체 채널, stale을 in-app 즉시 + email 일일 요약으로 바꾼다.",
      "suggested_fix": "REVIEW_WORKFLOW §3.3, §9.1, notifications.md §4.2 중 하나를 SoT로 정하고 나머지를 cascade 수정한다. 이벤트별 `immediateChannels`, `digestCadence`, `recipientPolicy`, `criticalOverride`를 표준화해야 한다."
    },
    {
      "id": "F-5",
      "severity": "major",
      "section": "§ 3.1, § 4.2",
      "location_quote": "type NotificationEventType = ... \"sla-imminent\" | \"sla-overdue\";\nblocked 정정 (fail 흐름, 큐 아님) | 24시간 내 작성자 응답 | 즉시 이메일·Slack (작성자)",
      "issue": "REVIEW_WORKFLOW §3.3의 blocked 정정 알림 이벤트가 NotificationEventType에 없다.",
      "rationale": "의료광고 fail로 blocked 된 콘텐츠는 사용자 노출 차단과 정정 SLA가 중요한데, notifications.md에는 blocked/fail correction 이벤트가 없어 호출자와 라우팅을 구현할 수 없다.",
      "suggested_fix": "`blocked-correction-required` 또는 `content-blocked` 이벤트를 REVIEW_WORKFLOW §9.1과 notifications.md §3.1에 추가하고 작성자 수신, 즉시 이메일·Slack, SLA 24시간 정책을 명시한다."
    },
    {
      "id": "F-6",
      "severity": "fail",
      "section": "§ 3.3, § 8.1, § 12",
      "location_quote": "recipientId가 AdminUser DB에 없으면 ...\nAdminUser 모델에 다음 필드 cascade 필요 (NT-02)",
      "issue": "AdminUser 및 notificationPreferences가 SoT 없이 미결정으로 남아 있다.",
      "rationale": "현재 `docs/admin/DATA_MODEL.md`가 없고, core DATA_MODEL에도 AdminUser가 없다. 수신자 조회, 역할 매핑, 이메일 주소, Slack 식별자, 선호 채널, quiet hours를 구현할 수 없다.",
      "suggested_fix": "AdminUser를 어드민 DB 데이터 계약으로 신설하고 `id`, `role`, `approverRoleEligibility`, `email`, `slackUserId?`, `notificationPreferences`, `timezone`, `active` 등을 정의한다. NT-02는 v1.0 전에 해소해야 한다."
    },
    {
      "id": "F-7",
      "severity": "fail",
      "section": "§ 5.3, § 7.2, § 9.2, § 12",
      "location_quote": "저장소: 어드민 DB `NotificationInbox` 테이블 (NT-07)\n발송 결과 → audit log + 본 Feature 전용 NotificationLog 테이블 (NT-10)",
      "issue": "NotificationInbox, NotificationLog, DLQ, retry queue, digest bucket의 데이터 계약이 없다.",
      "rationale": "in-app 표시, 읽음 처리, digest 누적, 재시도, DLQ 수동 재발송, dedupe 이력은 모두 영속 저장소가 필요한데 스키마가 전부 NT 미결정이다. 이는 단독 구현 불가 사유다.",
      "suggested_fix": "DATA_MODEL 또는 별도 admin data contract에 `NotificationInbox`, `NotificationLog`, `NotificationDeliveryAttempt`, `NotificationDigestBucket`, `NotificationDeadLetter`를 신설하고 보존 기간·인덱스·idempotency key를 명시한다."
    },
    {
      "id": "F-8",
      "severity": "major",
      "section": "§ 3.3",
      "location_quote": "metadata.ctaUrl 미지정 시 → 본 Feature가 인스턴스 어드민 base URL + 콘텐츠 경로로 자동 합성",
      "issue": "인스턴스 어드민 base URL의 출처가 DATA_MODEL C-08에 없다.",
      "rationale": "C-08 InstanceManifest에는 adminBaseUrl 또는 controlPlaneUrl이 없다. NotificationPayload SoT에서는 ctaUrl이 필수인데, 본 문서는 이를 자동 합성한다고 하면서 필요한 데이터 계약을 정의하지 않았다.",
      "suggested_fix": "C-08에 `adminBaseUrl` 또는 Control Plane instance URL 필드를 추가하거나, REVIEW_WORKFLOW 호출자가 ctaUrl을 항상 채워 넘기는 것으로 계약을 고정한다. 자동 합성 시 contentType별 route template도 필요하다."
    },
    {
      "id": "F-9",
      "severity": "major",
      "section": "§ 2.3, § 10.2",
      "location_quote": "notificationChannels:\n  email: true\n  slack:\n    webhookUrl: \"secretRef://SLACK_WEBHOOK_URL\"",
      "issue": "DATA_MODEL C-08의 notificationChannels는 너무 얕고, 명세의 설정 요구와 맞지 않는다.",
      "rationale": "C-08은 `{email?: boolean, slack?: {webhookUrl: string}, inApp?: boolean}`만 정의한다. 하지만 notifications.md는 emailSender, emailReplyTo, 이메일 서비스 키, secretRef, rate limit, digest schedule, channel별 enable 상태를 사용한다.",
      "suggested_fix": "C-08 `notificationChannels`를 확장할지, `features[name=notifications].config`에 모두 둘지 경계를 정해야 한다. secretRef 형식, email transport secret, channel별 rateLimit, sender/replyTo의 위치를 SoT로 고정한다."
    },
    {
      "id": "F-10",
      "severity": "major",
      "section": "§ 4.3",
      "location_quote": "dedupeKey = hash(eventType + contentRef + recipientId)\n미존재 → 발송 진행 + dedupeKey 저장 (TTL 설정)",
      "issue": "dedupe key가 실제 알림 의미를 충분히 식별하지 못하고 저장 시점도 위험하다.",
      "rationale": "같은 contentRef에 대해 60초 안에 서로 다른 rejectReason, priorReview 결과, SLA 단계, 수신 채널이 발생하면 잘못 dedupe될 수 있다. 또한 발송 성공 전 key를 저장하면 실패한 알림의 즉시 재시도나 수동 재발송이 막힐 수 있다.",
      "suggested_fix": "`sourceEventId` 또는 workflow transition id를 필수화하고, key에 `eventType`, `contentRef`, `recipientId`, `channel`, `semanticVersion/sourceEventId`를 포함한다. dedupe 기록은 `accepted`, `delivered`, `failed` 상태를 분리해야 한다."
    },
    {
      "id": "F-11",
      "severity": "fail",
      "section": "§ 3.3, § 7.1",
      "location_quote": "async function notify(event: NotificationEvent): Promise<DeliveryResult>\n이메일: 3회 지수 백오프 ... Slack: 동일",
      "issue": "notify()의 idempotency 계약이 없다.",
      "rationale": "notify()가 호출될 때마다 새 notificationId를 반환하고, 입력에는 idempotencyKey나 sourceEventId가 없다. 네트워크 재시도, 호출자 재시도, 워커 중복 실행 시 정확히 한 번 또는 최소 중복 억제를 보장할 수 없다.",
      "suggested_fix": "NotificationPayload 또는 NotificationEvent에 `sourceEventId`, `idempotencyKey`, `origin`, `workflowTransitionId` 중 하나를 필수로 추가하고, notify()는 같은 key에 대해 기존 DeliveryResult를 반환하도록 정의한다."
    },
    {
      "id": "F-12",
      "severity": "major",
      "section": "§ 7.1, § 7.2",
      "location_quote": "Slack: 동일\nDLQ 저장 항목: NotificationEvent 전체 + DeliveryResult + 실패 사유",
      "issue": "재시도·DLQ 알고리즘이 채널별 실패 의미를 구분하지 않는다.",
      "rationale": "Slack 4xx는 보통 설정 오류라 재시도해도 해결되지 않고, 5xx/429는 retryable이다. 이메일도 hard bounce, suppression, provider auth error, transient error가 다르다. 이 구분 없이 3회 재시도하면 운영 노이즈와 지연이 발생한다.",
      "suggested_fix": "채널별 `retryable`, `permanentFailure`, `rateLimited`, `misconfigured` 분류표를 추가한다. DLQ는 recipient/channel 단위로 저장하고 수동 재발송 시 원본 event와 새 attempt를 연결해야 한다."
    },
    {
      "id": "F-13",
      "severity": "major",
      "section": "§ 6.1, § 6.3, § 8.1",
      "location_quote": "주간 요약: `config.digestSchedule.weekly` (예: 매주 월요일 09:00)\ndigestOptOut?: boolean;",
      "issue": "digest 모드가 일일·주간 스케줄, opt-out, 실패 재발송을 충분히 정의하지 않는다.",
      "rationale": "§4.2에서는 대부분 email 일일 요약만 쓰고 weekly는 stale SLA와 연결되지 않는다. digestOptOut이 warning/stale에 적용되는지, critical 이벤트에는 무시되는지, 실패한 digest를 다음 cycle에 재발송할 때 중복 방지하는 방법도 없다.",
      "suggested_fix": "eventType별 `digestCadence: none | daily | weekly`, opt-out 가능 여부, bucket key, cutoff time, sent marker, retry marker, duplicate suppression 규칙을 추가한다."
    },
    {
      "id": "F-14",
      "severity": "major",
      "section": "§ 4.4, § 7.3, § 9.3",
      "location_quote": "한도 초과 시 → 발송 지연 (queue) + 운영팀 alert\n본 Feature 자체의 실패는 알림으로 보내지 않음",
      "issue": "self-notification 차단 정책과 운영 alert 정책이 충돌한다.",
      "rationale": "§4.4와 §7.1은 발송 실패·한도 초과 시 운영팀 alert를 만들고, §9.3은 DLQ 일일 요약을 둔다. 하지만 §7.3은 본 Feature 자체 실패를 알림으로 보내지 않는다고 한다. 어떤 alert가 외부 모니터링이고 어떤 것이 notifications를 통하는지 불명확하다.",
      "suggested_fix": "운영 alert sink를 `externalMonitoringOnly`와 `notificationModuleAllowed`로 분리한다. notifications 자체 장애, DLQ, rate limit은 Sentry/Datadog/PagerDuty 등 외부 sink만 사용한다고 명시하거나 별도 out-of-band 채널을 정의한다."
    },
    {
      "id": "F-15",
      "severity": "major",
      "section": "§ 8.2, § 8.3",
      "location_quote": "예외: `sla-overdue` 등 critical 이벤트는 quiet hours 무시\n의료법 관련 critical 이벤트 (예: 사전심의 결과)는 옵트아웃 불가 (강제 in-app)",
      "issue": "critical 이벤트 분류와 quiet hours/opt-out 우선순위가 닫혀 있지 않다.",
      "rationale": "사전심의 결과는 §8.3에서 critical 예시지만 §8.2의 quiet hours 예외에는 명시되지 않는다. 또한 §4.2는 prior-review-result를 email + inApp 즉시로 둔 반면 §8.3은 강제 in-app만 말한다.",
      "suggested_fix": "eventType별 `criticality`, `quietHoursPolicy`, `optOutPolicy`, `minimumChannel`을 표로 정의한다. 사전심의 결과, blocked, sla-overdue, 의료법 개정 stale은 opt-out 불가 및 quiet hours 우회 여부를 명확히 해야 한다."
    },
    {
      "id": "F-16",
      "severity": "major",
      "section": "§ 6.1, § 8.1",
      "location_quote": "일일 요약: 인스턴스 timezone 기준 `config.digestSchedule.daily`\nquietHours?: { start: \"HH:MM\"; end: \"HH:MM\"; timezone: string };",
      "issue": "인스턴스 timezone의 SoT가 없다.",
      "rationale": "C-08 InstanceManifest에는 timezone 필드가 없다. 사용자 quietHours에는 timezone이 있지만 digest는 인스턴스 timezone 기준이라고만 한다. DST, 한국 외 지점, 다지점 운영에서 발송 시각 보장이 불가능하다.",
      "suggested_fix": "C-08 또는 LocationProfile에 `timezone`을 명시하고, notifications config가 이를 참조하도록 한다. digest scheduling은 IANA timezone, missed run 처리, DST 중복/누락 처리까지 정의한다."
    },
    {
      "id": "F-17",
      "severity": "major",
      "section": "§ 8.2",
      "location_quote": "사용자가 설정한 quiet hours 동안은 즉시 발송 모드 이메일·Slack 발송 보류\n보류된 알림은 quiet hours 종료 후 발송",
      "issue": "의료기관 운영시간 외 알림 정책이 없다.",
      "rationale": "의료기관 도메인에서는 사용자 개인 quiet hours와 별개로 병원 운영시간, 휴진, 공휴일, 긴급 이벤트를 구분해야 한다. DATA_MODEL C-21에는 businessHours가 있지만 notifications.md는 이를 전혀 사용하지 않는다.",
      "suggested_fix": "LocationProfile.businessHours를 참조해 `clinicBusinessHoursPolicy`를 추가한다. 운영시간 외에는 일반 이벤트 digest 이월, critical 이벤트 즉시, 고객 측 client-approver 알림 제한 등 정책을 정의한다."
    },
    {
      "id": "F-18",
      "severity": "major",
      "section": "§ 3.1, § 4.1",
      "location_quote": "recipientRole: ApproverRole | \"author\" | \"operations\";\n수신자 선호 채널 → AdminUser.notificationPreferences",
      "issue": "ApproverRole과 AdminUserRole 5종 권한의 매핑이 없다.",
      "rationale": "REVIEW_WORKFLOW §11.1은 `super-admin`, `operator`, `physician-reviewer`, `legal-reviewer`, `client-approver`를 정의한다. NotificationRecipient는 `ApproverRole` 기반이라 super-admin, operations, author, client-approver의 실제 수신 규칙을 구현할 수 없다.",
      "suggested_fix": "수신자 산정 규칙을 `eventType -> eligible AdminUserRole -> ApproverRole eligibility -> instance membership` 순서로 정의한다. 5종 권한별 필수/선택 알림 표를 추가해야 한다."
    },
    {
      "id": "F-19",
      "severity": "major",
      "section": "§ 5.2",
      "location_quote": "mention: 미사용 (Slack 사용자 ID 매핑 미보유, NT-06)",
      "issue": "Slack 채널이 recipient 단위 알림 모델과 맞지 않는다.",
      "rationale": "Incoming Webhook 하나로 workspace/channel에 게시하면서 recipientId별 dedupe, preference, quiet hours, 역할별 수신을 적용한다고 되어 있다. Slack 사용자 매핑이 없으면 특정 검수자에게만 보내거나 opt-out을 반영하기 어렵다.",
      "suggested_fix": "v0.1에서는 Slack을 인스턴스 운영 채널 broadcast로 제한하고 recipient별 delivery와 분리하거나, AdminUser.slackUserId/Slack channel mapping을 DATA_MODEL cascade로 확정한다."
    },
    {
      "id": "F-20",
      "severity": "major",
      "section": "§ 9.2, REVIEW_WORKFLOW § 10",
      "location_quote": "발송 결과 → audit log + 본 Feature 전용 NotificationLog 테이블 (NT-10)\nAuditLogEntry = { actorId, actorRole, action, contentRef, ... }",
      "issue": "audit log에 알림 발송 결과를 어떻게 기록할지 SoT가 없다.",
      "rationale": "REVIEW_WORKFLOW §10의 AuditLogEntry는 actor/action/contentRef 중심이다. 알림 발송은 system actor, recipient, channel, provider response, retry attempt가 필요한데 action enum과 metadata 규칙이 없다.",
      "suggested_fix": "AuditAction에 `notification-delivery-attempted`, `notification-delivered`, `notification-failed`, `notification-deduped`, `notification-read` 등을 추가하거나, audit log에는 요약만 남기고 상세는 NotificationLog가 SoT라고 분리한다."
    },
    {
      "id": "F-21",
      "severity": "minor",
      "section": "§ 2.1, § 2.3, § 10.2",
      "location_quote": "specVersion: \"0.1\"\nfeatures:\n  - name: \"notifications\"\n    version: \"1.0.0\"",
      "issue": "Draft v0.1 명세 예시가 Feature version 1.0.0을 사용한다.",
      "rationale": "compliance-assistant 모범 사례는 안정판 도달 후 v1.0으로 정리되어 있다. notifications는 Draft v0.1인데 InstanceManifest 예시는 1.0.0이라 릴리즈 상태를 오해하게 한다.",
      "suggested_fix": "v0.1 초안 예시는 `version: \"0.1.0\"` 또는 `specVersion: \"0.1\"`과 명확히 구분된 implementation package version으로 표기한다."
    },
    {
      "id": "F-22",
      "severity": "major",
      "section": "§ 11",
      "location_quote": "| **warning** | 어떤 채널도 활성이지만 수신자 선호 설정 미적용 운영, DLQ 누적 운영 임계 초과 |",
      "issue": "빌드 검증에 런타임 운영 상태가 섞여 있고 문장도 모순적이다.",
      "rationale": "DLQ 누적은 빌드 시점 검증이 아니라 운영 관측 지표다. 또한 '어떤 채널도 활성이지만'은 의미상 '채널은 활성화되어 있지만' 또는 '어떤 채널도 비활성' 중 하나로 정정해야 한다.",
      "suggested_fix": "빌드 검증은 정적 설정 오류만 다루고, DLQ·성공률·지연은 §9 운영 지표로만 둔다. 문구는 `채널은 활성화되어 있으나 수신자 선호 설정 모델이 미구현`처럼 정리한다."
    }
  ]
}