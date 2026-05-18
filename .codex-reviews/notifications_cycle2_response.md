{
  "summary": "v0.2는 1차 지적을 상당수 수용했지만, 새로 추가된 idempotency·dedupe·보류 큐·broadcast·데이터 구조가 구현 가능한 수준으로 닫히지 않았다. 특히 NotificationLog 기반 idempotency가 원자적이지 않고, § 4.1의 라우팅/필터 순서가 mandatory·critical 정책을 깨며, § 14 테이블은 unique/FK/index/영속 payload 저장소가 부족해 DeliveryResult 재구성·digest·DLQ 재발송이 불안정하다. 또한 DATA_MODEL은 문서 상태가 v0.12인데 notifications는 C-08/C-23 v0.13을 전제로 하여 cascade 정합성 자체가 흔들린다.",
  "findings": [
    {
      "id": "F-1",
      "severity": "fail",
      "section": "§ 3.3, § 4.1, § 14.2",
      "location_quote": "동일 `sourceEventId` 재호출 → 기존 DeliveryResult 반환 (NotificationLog 조회로 재구성).\nNotificationLog에서 sourceEventId 조회",
      "issue": "idempotency가 NotificationLog 조회 기반인데 NotificationLog는 파이프라인 마지막에 기록된다. 동시에 같은 sourceEventId가 들어오면 둘 다 미존재로 보고 fan-out/발송할 수 있다.",
      "rationale": "idempotency key는 수락 시점에 원자적으로 선점되어야 한다. 현재 § 14.2도 `sourceEventId`를 indexed로만 두고 unique constraint나 insert-if-absent 계약이 없어 중복 발송을 막지 못한다.",
      "suggested_fix": "notify() 1단계에서 `NotificationLog(sourceEventId)` 또는 별도 `NotificationEventReceipt`를 unique insert로 생성하고, 실패 시 기존 결과/진행 상태를 반환하도록 정의한다. § 14.2에 `unique(instanceId, sourceEventId)`와 상태(`accepted|processing|completed|failed`)를 추가한다."
    },
    {
      "id": "F-2",
      "severity": "fail",
      "section": "§ 4.1, § 8.3",
      "location_quote": "활성 채널 교집합 — InstanceManifest.notificationChannels(C-08) ∩ AdminUser.notificationPreferences.channels(C-23)\nmandatory 이벤트 ... `channels.inApp=false`이어도 inApp 활성",
      "issue": "사용자 채널 선호를 라우팅 단계에서 먼저 교집합으로 제거하므로, 뒤의 mandatory/optOutPolicy가 이미 제거된 채널을 복구할 수 없다.",
      "rationale": "§ 8.3은 mandatory 이벤트에서 사용자 inApp off를 무시한다고 하지만 § 4.1 순서상 inApp이 먼저 탈락한다. REVIEW_WORKFLOW § 9.1.1의 optOutPolicy=mandatory 구현과 직접 모순이다.",
      "suggested_fix": "라우팅 단계는 매트릭스 즉시 채널 ∩ 인스턴스 활성 채널까지만 계산하고, AdminUser.notificationPreferences는 opt-out 필터 단계에서 `optOutPolicy`를 고려해 적용한다. mandatory는 사용자 opt-out만 우회하고 인스턴스 채널 비활성은 우회하지 않는다고 명시한다."
    },
    {
      "id": "F-3",
      "severity": "major",
      "section": "§ 4.1",
      "location_quote": "criticality=\"critical\" — § 9.1.1 quietHoursPolicy=bypass + optOutPolicy=mandatory → 모든 필터 우회",
      "issue": "critical 이벤트가 '모든 필터'를 우회한다고 되어 있어 inactive/missing user, disabled channel, dedupe까지 우회하는 해석이 가능하다.",
      "rationale": "REVIEW_WORKFLOW § 9.1.1은 critical이 quietHours·opt-out·businessHours를 우회한다고만 정의한다. 비활성 사용자, 인스턴스 채널 비활성, idempotency/dedupe는 안전장치라 우회하면 잘못된 수신자 발송·중복 발송·비밀 설정 미비 채널 호출이 발생한다.",
      "suggested_fix": "critical 우회 범위를 `quietHours`, `businessHours`, `user opt-out`으로 한정한다. `missing/inactive user`, `instance disabled channel`, `idempotency`, `dedupe`는 critical에서도 적용한다고 § 4.1과 § 8에 명시한다."
    },
    {
      "id": "F-4",
      "severity": "major",
      "section": "§ 5.2, § 3.2, § 9.1",
      "location_quote": "broadcast 모드 ... workspace/channel에 단일 메시지 게시 ... 결과는 `skipped-broadcast-only`로 audit (envelope 1건만 발송)",
      "issue": "Slack broadcast는 실제로 메시지를 발송하는데 DeliveryStatus는 skipped 계열이고, DeliveryResult는 per-recipient deliveries만 표현한다.",
      "rationale": "실제 발송 성공/실패가 `skipped-broadcast-only`로 기록되면 성공률·DLQ·provider 응답·rate limit 지표가 왜곡된다. 또한 recipientId가 없는 envelope 단위 Slack attempt를 § 14.3 DeliveryAttempt 모델에 저장할 방법이 없다.",
      "suggested_fix": "Slack broadcast를 별도 `NotificationBroadcastAttempt`로 모델링하거나 `NotificationDeliveryAttempt.recipientId` nullable + `deliveryMode: broadcast|perRecipient`를 추가한다. status는 실제 결과(`delivered`, `failed-*`)를 사용하고, per-recipient 미추적은 별도 플래그로 표현한다."
    },
    {
      "id": "F-5",
      "severity": "major",
      "section": "§ 4.3, § 14.6",
      "location_quote": "dedupeKey = hash(sourceEventId + recipientId + channel)\n`notif:dedupe:{sourceEventId}:{recipientId}:{channel}`",
      "issue": "본문의 dedupe key는 hash인데 Redis 키는 원문 구성요소를 그대로 사용한다. instanceId도 포함되지 않는다.",
      "rationale": "멀티테넌트 어드민 DB/Redis에서 서로 다른 인스턴스가 동일 sourceEventId·recipientId·channel을 만들면 충돌할 수 있다. hash/비hash 불일치는 구현자가 다른 키를 사용하게 만들어 dedupe가 무력화될 수 있다.",
      "suggested_fix": "정식 키를 `notif:dedupe:{instanceId}:{sourceEventId}:{recipientId}:{channel}`로 고정하거나 그 전체를 hash한 값을 사용한다고 통일한다. § 4.3과 § 14.6을 동일 문자열로 맞춘다."
    },
    {
      "id": "F-6",
      "severity": "major",
      "section": "§ 4.3, § 7.1",
      "location_quote": "failed-permanent → dedupeKey 즉시 만료 (재시도·수동 재발송 가능)\npermanent는 재시도 없이 DLQ.",
      "issue": "permanent 실패 후 dedupe key 즉시 만료가 재시도 정책과 모순된다.",
      "rationale": "permanent는 자동 재시도 대상이 아니고, 수동 재발송은 이미 dedupe 우회로 정의되어 있다. 즉시 만료하면 같은 이벤트가 race나 재호출로 다시 provider를 때려 hard bounce/invalid webhook alert를 반복할 수 있다.",
      "suggested_fix": "failed-permanent dedupe 항목은 최소 dedupeWindow 동안 유지하고, 수동 `resendDeadLetter`만 명시적으로 우회하도록 한다. 또는 '설정 수정 후 재발송' 액션에서만 dedupe 삭제를 허용한다."
    },
    {
      "id": "F-7",
      "severity": "major",
      "section": "§ 14.2, § 14.3, § 3.3",
      "location_quote": "`NotificationLog` (운영 메트릭 SoT — envelope 단위)\n동일 `sourceEventId` 재호출 → 기존 DeliveryResult 반환",
      "issue": "NotificationLog가 envelope summary만 갖고 있어 기존 DeliveryResult를 완전 재구성할 수 없다.",
      "rationale": "DeliveryResult에는 recipient별 payloadId/channel/status/attempt/provider/error가 필요하지만 § 14.2는 summary만 저장한다. § 14.3 DeliveryAttempt를 조인해야 하며, skipped/deferred/deduped처럼 provider attempt가 없는 결과는 DeliveryAttempt에 남는지도 불명확하다.",
      "suggested_fix": "NotificationLog에 per-recipient/channel 결과 스냅샷을 저장하거나 `NotificationDelivery` 테이블을 추가해 모든 최종 DeliveryStatus를 저장한다. DeliveryAttempt는 실제 provider/DB 시도 이력으로 분리한다."
    },
    {
      "id": "F-8",
      "severity": "major",
      "section": "§ 14.5, § 6.2",
      "location_quote": "`payloadIds` | string[] | ✅ | NotificationPayload[] — 발송 대기\n발송 시점에 해당 recipient의 버킷 내 NotificationPayload[]를 묶음 처리",
      "issue": "DigestBucket은 payloadIds만 저장하지만 NotificationPayload 본문을 영속 저장하는 테이블이 없다.",
      "rationale": "payloadId만으로 contentTitle, ctaUrl, metadata, criticality, eventType을 복원할 수 없다. NotificationPayload는 fan-out 내부 산출물인데 § 14에 영속 저장소가 없으므로 digest 발송·quietHours 재개·businessHours 재개가 구현 불가능하다.",
      "suggested_fix": "`NotificationPayloadRecord` 또는 `NotificationDelivery` 테이블을 추가해 payloadId별 eventId, recipientId, channel, ctaUrl, metadata, createdAt을 저장한다. 보류 큐는 payloadId FK만 참조하게 한다."
    },
    {
      "id": "F-9",
      "severity": "major",
      "section": "§ 4.1, § 14.5",
      "location_quote": "deferred-* → DigestBucket·QuietHoursQueue 누적\n`NotificationDigestBucket`·`QuietHoursQueue`·`BusinessHoursQueue`",
      "issue": "deferred-business-hours가 결과 처리에서는 BusinessHoursQueue에 들어가지 않는다.",
      "rationale": "DeliveryStatus 11종 중 `deferred-business-hours`가 § 8.4에서는 BusinessHoursQueue를 요구하지만 § 4.1 결과 처리에서는 DigestBucket·QuietHoursQueue만 언급한다. 구현자가 businessHours 보류를 누락할 수 있다.",
      "suggested_fix": "§ 4.1 6단계를 status별로 분해해 `deferred-digest → NotificationDigestBucket`, `deferred-quiet-hours → NotificationQuietHoursQueue`, `deferred-business-hours → NotificationBusinessHoursQueue`로 명시한다."
    },
    {
      "id": "F-10",
      "severity": "major",
      "section": "§ 14",
      "location_quote": "admin DB 테이블 7종:\nNotificationInbox·Log·DeliveryAttempt·DeadLetter·DigestBucket·QuietHoursQueue·BusinessHoursQueue·DedupeCache",
      "issue": "본문은 테이블 7종이라고 하지만 목록은 8종이고, § 10.1은 '테이블 5종 생성'이라고 한다.",
      "rationale": "마이그레이션 산출물이 불명확하다. DedupeCache는 Redis 권장이라 DB 테이블인지도 모호하고, § 14.5는 Digest/Quiet/Business를 공통 구조 하나로 묶어 실제 테이블 수를 더 흐린다.",
      "suggested_fix": "물리 저장소 기준으로 테이블/Redis 키를 분리해 인벤토리를 고정한다. 예: DB 7 tables + Redis 1 keyspace, 또는 DB 8 tables. § 10.1 설치 단계도 같은 숫자로 수정한다."
    },
    {
      "id": "F-11",
      "severity": "major",
      "section": "§ 14",
      "location_quote": "`notificationLogId` | UUID | ✅ | NotificationLog.@id\n`payloadId` | string | ✅ |",
      "issue": "§ 14 데이터 구조에 foreign key, unique constraint, index 정의가 거의 없다.",
      "rationale": "NotificationLog-DeliveryAttempt-DLQ-Queue-Inbox 간 참조 정합이 보장되지 않는다. payloadId 중복, 동일 attemptNumber 중복, 같은 payload의 중복 inbox 생성, bucket 중복 생성, DLQ와 attempt 이력 불일치가 모두 가능하다.",
      "suggested_fix": "최소 제약을 추가한다: `NotificationLog unique(instanceId, sourceEventId)`, `DeliveryAttempt unique(notificationLogId, payloadId, channel, attemptNumber)`, `Inbox unique(payloadId)`, `DeadLetter unique(payloadId, channel, unresolved)`, `Queue unique(bucketKey)`, `payloadIds`는 FK 가능한 join table로 정규화한다."
    },
    {
      "id": "F-12",
      "severity": "major",
      "section": "§ 7.2, § 3.3",
      "location_quote": "`resendDeadLetter(deadLetterId)` 액션 — dedupe 우회, 새 NotificationDeliveryAttempt 생성, 원본 sourceEventId 유지 (idempotency 흐름과 연결)",
      "issue": "DLQ 재발송이 원본 sourceEventId를 유지하면 notify() idempotency와 충돌한다.",
      "rationale": "재발송을 notify() 경로로 태우면 기존 DeliveryResult를 반환하고 발송하지 않아야 한다. 반대로 내부에서 직접 attempt만 만들면 NotificationLog completed 상태와 summary 갱신, audit 요약, dedupe 책임이 불명확하다.",
      "suggested_fix": "`resendDeadLetter`는 notify()가 아닌 별도 command로 정의하고 `resendAttemptId`를 갖게 한다. 원본 sourceEventId는 참조만 유지하고, NotificationLog summary/DeliveryAttempt/DLQ resolvedAt 갱신 규칙을 명시한다."
    },
    {
      "id": "F-13",
      "severity": "major",
      "section": "§ 6.3, REVIEW_WORKFLOW § 9.1.1",
      "location_quote": "`stale-queued` ... digest 주기 | email — 의료법 개정은 일일, 기타는 주간\n`criticality=high` digest 이벤트 ... 단 `의료법 개정 stale`은 mandatory",
      "issue": "의료법 개정 stale의 mandatory + daily email 분기가 구조화되어 있지 않다.",
      "rationale": "매트릭스의 digest 셀은 채널과 cadence와 조건을 한 문자열에 섞고, § 6.3은 opt-out 예외만 서술한다. DigestBucket key도 `(recipientId + digestCadence)`라 eventType/trigger/mandatory 여부를 반영하지 못한다.",
      "suggested_fix": "정책 매트릭스를 코드 생성 가능한 구조로 분해한다. 예: `digest: [{channel:'email', cadence:'daily', when: metadata.staleTriggeredBy startsWith medical-law-revision, optOutPolicy:'mandatory'}, ...]`. DigestBucket key에 eventType 또는 policyKey를 포함한다."
    },
    {
      "id": "F-14",
      "severity": "major",
      "section": "§ 8.1, § 6.1, DATA_MODEL C-23",
      "location_quote": "`timezone` | IANATimezone | optional | 사용자 timezone — quietHours·digest 발송 기준. 미지정 시 인스턴스 timezone(C-08) fallback\n일일 요약: 인스턴스 timezone(C-08) 기준",
      "issue": "AdminUser.timezone이 digest 기준이라고 C-23은 말하지만 notifications § 6.1은 인스턴스 timezone만 사용한다.",
      "rationale": "사용자별 digest 기준과 인스턴스별 digest 기준이 충돌한다. 또한 § 8.1은 `quietHours`를 사용자 timezone 기준이라고만 쓰고, `notificationPreferences.quietHours.timezone`과 `AdminUser.timezone`의 우선순위를 정하지 않는다.",
      "suggested_fix": "timezone 우선순위를 명시한다. 예: quietHours는 `notificationPreferences.quietHours.timezone > AdminUser.timezone > InstanceManifest.timezone`, digest는 제품 정책상 instance 기준 또는 recipient 기준 중 하나로 고정하고 C-23 설명과 맞춘다."
    },
    {
      "id": "F-15",
      "severity": "major",
      "section": "§ 8.4, DATA_MODEL C-21",
      "location_quote": "의료기관 운영시간(LocationProfile.businessHours, C-21) 외에는 `client-approver` recipient에 한해 즉시 채널을 보류",
      "issue": "multi-location 인스턴스에서 어떤 LocationProfile.businessHours를 사용할지 정해져 있지 않다.",
      "rationale": "contentRef가 특정 지점 콘텐츠인지, 클라이언트 승인자가 특정 지점 소속인지, 인스턴스 대표 지점 기준인지에 따라 운영시간이 달라진다. NotificationEvent/Payload에는 locationRef가 없어 계산 근거도 없다.",
      "suggested_fix": "NotificationEvent metadata 또는 Payload에 `locationRef`를 표준화하거나, contentRef→LocationProfile 매핑 규칙과 fallback(`main`)을 정의한다. 다지점에서 locationRef 미해결 시 build warning/fail 기준도 추가한다."
    },
    {
      "id": "F-16",
      "severity": "major",
      "section": "§ 8.4, DATA_MODEL CT-02",
      "location_quote": "종료 시각: 다음 운영시간 시작\nBusinessHours: openingHours, receptionHours, lunchBreaks, holidayPolicy, specialClosures",
      "issue": "businessHours 보류가 휴진·공휴일·특별 휴무를 계산 가능한 형태로 다루지 않는다.",
      "rationale": "CT-02에는 `holidayPolicy`가 Markdown이고 `specialClosures`가 있으며 PublicHoliday도 존재한다. § 8.4의 '다음 운영시간 시작'만으로는 공휴일 캘린더, 점심시간, 접수시간 기준 여부를 결정할 수 없다.",
      "suggested_fix": "client-approver 알림 기준을 `openingHours` 또는 `receptionHours` 중 하나로 고정하고, `specialClosures`와 PublicHoliday 캘린더 적용 규칙을 명시한다. `holidayPolicy` Markdown은 표시용이며 계산에는 쓰지 않는다고 구분한다."
    },
    {
      "id": "F-17",
      "severity": "major",
      "section": "§ 4.2, § 1.1",
      "location_quote": "본 Feature는 매트릭스를 코드 상수로 import ... 표를 빌드 시점 코드 생성·embed\n이벤트 정책 매트릭스(§ 9.1.1) 변경 | MAJOR",
      "issue": "Markdown 표를 코드 상수로 import한다는 정책이 MAJOR 변경 운영과 맞물리는 방식이 불명확하다.",
      "rationale": "정책 변경이 MAJOR라면 어떤 matrix version/hash가 패키지에 포함됐는지, 런타임 InstanceManifest feature version과 REVIEW_WORKFLOW 문서 버전이 맞는지 검증해야 한다. 현재는 재배포 필요만 있고 불일치 감지가 없다.",
      "suggested_fix": "생성된 정책 상수에 `notificationPolicyVersion`과 source hash를 포함하고, Feature package version/InstanceManifest와 빌드 검증에서 비교한다. 매트릭스 변경 시 migration note와 운영 배포 순서를 § 1.1에 추가한다."
    },
    {
      "id": "F-18",
      "severity": "major",
      "section": "REVIEW_WORKFLOW § 9.1.1, notifications § 4.2",
      "location_quote": "`blocked-correction-required` | blocked 정정 요청 | 작성자 + operator\n수신자 산정 컬럼 — 호출자(REVIEW_WORKFLOW)가 NotificationEvent.recipients[]로 채워 전달",
      "issue": "blocked-correction-required의 '작성자' 식별 출처가 정의되어 있지 않다.",
      "rationale": "AdminUser C-23에는 author 역할이 없고, 콘텐츠 계약에도 공통 author AdminUser 참조가 보장되지 않는다. 작성자가 외부 클라이언트인지 operator인지에 따라 recipientId 산정이 달라진다.",
      "suggested_fix": "작성자 source를 명시한다. 예: workflow transition actorId, content owner AdminUser ref, 또는 content metadata authorAdminUserId. 작성자가 AdminUser가 아니면 operator fallback/외부 이메일 금지 같은 정책도 정의한다."
    },
    {
      "id": "F-19",
      "severity": "major",
      "section": "DATA_MODEL.md 헤더, C-08, C-23",
      "location_quote": "**상태**: Draft v0.12\n`adminBaseUrl` ... (v0.13 +)\n### C-23. `AdminUser` — 어드민 사용자 (v0.13 신규)",
      "issue": "DATA_MODEL 문서 상태와 변경이력은 v0.12인데, notifications가 의존하는 C-08 v0.13/C-23 v0.13 필드가 본문에 섞여 있다.",
      "rationale": "cascade가 완료됐는지 불명확하다. notifications v0.2는 C-08 v0.13과 C-23을 required SoT로 삼지만 DATA_MODEL의 버전 헤더·요약·변경 이력은 이를 반영하지 않는다.",
      "suggested_fix": "DATA_MODEL을 v0.13으로 승격하고 헤더, 한 페이지 요약의 계약 수, 변경 이력에 C-08 notification 확장과 C-23 신설을 명시한다. 또는 notifications에서 v0.12 기준으로 의존성을 낮출 수 없음을 명확히 표시한다."
    },
    {
      "id": "F-20",
      "severity": "minor",
      "section": "§ 7.3, § 4.4, § 12",
      "location_quote": "한도 초과 시 → 채널 호출 큐 지연 (status=`failed-retrying`)\n본 한도 초과 자체는 알림으로 통지하지 않음 — § 7.3 외부 monitoring sink로 알림",
      "issue": "rate limit 초과를 failed-retrying으로 기록하면서 동시에 외부 sink alert 대상으로 둔다.",
      "rationale": "rate limiting은 정상 backpressure일 수 있는데 실패율과 alert를 오염시킨다. DeliveryStatus에도 `deferred-rate-limit` 또는 `rate-limited`가 없어 운영자가 장애와 용량 제어를 구분하기 어렵다.",
      "suggested_fix": "rate limit은 별도 status(`deferred-rate-limit` 또는 `rate-limited`)로 분리하거나, failed-retrying에 포함한다면 SLO/alert 계산에서 제외하는 규칙을 § 9.1·§ 9.3에 추가한다."
    },
    {
      "id": "F-21",
      "severity": "minor",
      "section": "§ 7.2, § 12",
      "location_quote": "보존 기간: 30일 (NT-12 운영 정책)\nNT-13 | NotificationLog 보존 기간 — 메트릭 누적 정책",
      "issue": "DLQ 보존 기간은 30일로 사실상 쓰고 있지만 NotificationLog 보존은 미결정이다.",
      "rationale": "DLQ가 NotificationLog와 DeliveryAttempt를 참조하는 구조라면 NotificationLog가 먼저 삭제될 수 없다. 반대로 NotificationDeadLetter.failedAttempts가 embedded copy라면 FK와 중복 데이터 정책을 명시해야 한다.",
      "suggested_fix": "보존 순서를 정한다. 예: NotificationLog/DeliveryAttempt는 DLQ expiresAt 이후 최소 N일 보존, audit log는 7년 별도. § 14.4의 `failedAttempts`가 snapshot인지 FK인지도 명시한다."
    },
    {
      "id": "F-22",
      "severity": "minor",
      "section": "§ 7.1, § 12",
      "location_quote": "hard bounce ... invalid recipient | 즉시 DLQ + 외부 monitoring sink alert\nNT-14 | 이메일 hard bounce suppression 운영 — 자동 inactive 처리 시점",
      "issue": "hard bounce가 AdminUser.active 또는 suppression 상태와 연결되지 않는다.",
      "rationale": "동일 AdminUser 이메일이 계속 hard bounce하면 이후 mandatory/critical 이벤트마다 DLQ와 alert가 반복된다. NT-14가 남아 있어도 최소한 suppression 기록 위치와 active 자동 변경 여부의 기본 정책이 필요하다.",
      "suggested_fix": "hard bounce 시 `AdminUserNotificationSuppression` 또는 AdminUser notificationPreferences.email 상태를 갱신하는 정책을 추가한다. `active=false`는 로그인 차단까지 포함하므로 자동 비활성화와 이메일 suppression은 분리하는 편이 안전하다."
    }
  ]
}