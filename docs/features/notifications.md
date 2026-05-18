# Feature — notifications

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감 — 7개 지적 전건 수용)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 11 / `docs/admin/REVIEW_WORKFLOW.md` § 9
> **목적**: 어드민(Control Plane)의 워크플로 이벤트·SLA 임박·운영 알람을 인스턴스별 채널(이메일·Slack·in-app)로 발송하는 Feature Module의 단독 구현 명세 — idempotent 발송, 채널 어댑터, digest 정책 AST, 보류 큐, 재시도·DLQ·suppression(autoRelease 포함), 운영 지표, 내부 데이터 구조 11 tables + Redis.
> **외부 공유 시 주의**: 상위 문서와 동일. 수신자 식별 정보·이메일 주소·Slack webhook URL 노출 주의.
> **연관 문서**:
> - 이벤트 enum·페이로드·이벤트별 정책 매트릭스(fallback 채널 포함) SoT → `admin/REVIEW_WORKFLOW.md` § 9
> - audit log enum(`notification-dispatched`·`notification-resend-attempted`·`notification-read`) → `admin/REVIEW_WORKFLOW.md` § 10
> - 채널 활성화·트랜스포트 자격·`holidayCalendar` SoT → `core/DATA_MODEL.md` C-08
> - AdminUser·자격·알림 선호·suppression(autoReleaseAt) SoT → `core/DATA_MODEL.md` C-23
> - 운영시간 SoT → `core/DATA_MODEL.md` C-21 LocationProfile + CT-02 BusinessHours

---

## 0. 한 페이지 요약

- **Feature 식별자**: `notifications`
- **핵심 책임**: (a) 호출자(REVIEW_WORKFLOW·SLA 스케줄러 등) NotificationEvent 수신, (b) **단일 DB 트랜잭션에서 NotificationLog 생성 + NotificationEventReceipt 원자 선점**, (c) § 9.1.1 매트릭스(fallback 채널 포함) 라우팅, (d) NotificationPayloadRecord 영속 + 채널 어댑터 호출, (e) 재시도·DLQ·suppression 처리, (f) audit log + NotificationLog/DeliveryAttempt 기록
- **idempotency 원자 선점**: 1단계 단일 트랜잭션에서 Log insert → Receipt insert(`unique(instanceId, sourceEventId)`). 트랜잭션 commit 후에야 NotificationEventReceipt 가시화. 동일 sourceEventId 동시 호출은 unique 위반으로 한 쪽만 진입, 다른 쪽은 기존 결과 재구성 반환 (§ 14.2)
- **dedupe Redis SET NX EX**: 채널별 dedupe는 `SET key value NX EX <ttl>` 원자 연산. 선기록 성공 worker만 provider 호출. 실패 worker는 `deduped` (§ 4.3)
- **critical 우회 범위**: quietHours·businessHours·user opt-out **만**. inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe·instance membership은 critical도 적용. hard-suppressed 시 fallback은 **REVIEW_WORKFLOW § 9.1.1 매트릭스 컬럼 SoT** — 임의 활성 채널 라우팅 금지
- **Slack broadcast**: AdminUser.slackUserId 미보유 시 — broadcast 1건 (envelope 단위)·dedupeKey sentinel `"broadcast"`. per-recipient placeholder는 `skipped-broadcast-only` (집계 대상 아님)
- **인벤토리**: DB **11 tables** (Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·DeadLetterAttempt) + Redis 1 keyspace (DedupeCache)

---

## 1. 일반 규약

### 1.1 변경 정책

**두 축 분리**: 본 Feature는 (a) **패키지 SemVer**(코드 호환성)와 (b) **policyVersion**(매트릭스 의미)을 분리 관리.

| 변경 유형 | 패키지 SemVer | policyVersion | 비고 |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9 cascade |
| `NotificationEventType` enum 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9.1 cascade |
| `DeliveryStatus` enum 변경 | **MAJOR** | 별개 | |
| **§ 9.1.1 매트릭스 의미 변경** (수신자·채널·criticality 등) | MINOR (append-only 시) / MAJOR (기존 version 의미 변경) | **policyVersion 신규 부여** | 패키지는 신규 + 기존 version 병렬 보관 (§ 4.2). 인스턴스 manifest opt-in |
| § 14 데이터 구조 변경 | MINOR (append-only) / MAJOR (semantic) | 별개 | DB 마이그레이션 동반 |
| 채널 enum 추가 | MINOR | 별개 | C-08 `NotificationChannelsConfig` cascade |
| dedupe key 알고리즘 변경 | **MAJOR** | 별개 | |
| 재시도 분류표(§ 7.1) 변경 | MINOR | 별개 | |
| 운영 지표 항목 추가 | PATCH | 별개 | |

**매트릭스 정합 운영(병렬 보관 SoT)**: § 9.1.1 매트릭스가 변경되면 본 Feature 패키지에 **새 policyVersion을 추가하고 이전 버전도 병렬 보관**. 인스턴스는 InstanceManifest.config.`notificationPolicyVersion`이 명시한 버전을 사용. 롤백은 manifest의 version만 이전 값으로 변경 (§ 4.2). 운영 배포 순서: 매트릭스 SoT 갱신 → 패키지에 새 version 추가 + 이전 보관 → 인스턴스 manifest 갱신 (opt-in).

### 1.2 SoT 원칙

- 이벤트 enum·페이로드 타입·이벤트별 정책 매트릭스(fallback·criticality·quietHoursPolicy·optOutPolicy) SoT는 `admin/REVIEW_WORKFLOW.md` § 9
- 채널 활성화·트랜스포트 자격·`holidayCalendar` SoT는 `core/DATA_MODEL.md` C-08
- AdminUser·자격·알림 선호·suppression SoT는 `core/DATA_MODEL.md` C-23
- audit log enum SoT는 `admin/REVIEW_WORKFLOW.md` § 10.2.1
- 운영시간 SoT는 `core/DATA_MODEL.md` C-21·CT-02
- 본 문서 = **발송 구현·운영 SoT** + **본 Feature 내부 데이터 구조 SoT** (§ 14)

### 1.3 본 문서가 다루지 않는 영역

- 알림을 발생시키는 워크플로 트리거 — `admin/REVIEW_WORKFLOW.md` § 2·§ 6
- 이벤트 enum·페이로드 필드·정책 매트릭스 — `admin/REVIEW_WORKFLOW.md` § 9
- 사용자 자격 인증 — `admin/REVIEW_WORKFLOW.md` § 11.2 + DATA_MODEL C-23 `eligibilityEvidence`
- 이메일 템플릿 시각 디자인 — `core/DESIGN_TOKENS.md` (NT-05)

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "notifications"
specVersion: "1.0"               # 본 문서 명세 버전 (안정판)
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation:
  scope: "instance"
  default: true
```

> **세 버전 의미 차이** (N5-07): `specVersion`(본 문서 v0.x→1.0, 명세 자체) ≠ 패키지 SemVer(코드 호환성, InstanceManifest.features[].version) ≠ `notificationPolicyVersion`(§ 9.1.1 매트릭스 의미, § 1.1·§ 4.2).

### 2.2 Core 의존성

| Core 영역 | 의존 |
|---|---|
| `admin/REVIEW_WORKFLOW.md` § 9 | NotificationEventType·NotificationEvent/Payload·정책 매트릭스(fallback 채널 포함) |
| `admin/REVIEW_WORKFLOW.md` § 10.2.1 | AuditAction enum (`notification-dispatched`·`notification-resend-attempted`·`notification-read`) |
| `admin/REVIEW_WORKFLOW.md` § 11 | AdminUserRole·ApproverRole·자격 검증 |
| `core/DATA_MODEL.md` C-08 | `notificationChannels`·`adminBaseUrl`·`timezone`·`holidayCalendar`·features[] |
| `core/DATA_MODEL.md` C-23 | AdminUser·NotificationPreferences·suppression(autoReleaseAt) |
| `core/DATA_MODEL.md` C-21·CT-02 | LocationProfile(`@id="main"` 관례) + BusinessHours·SpecialClosure·LunchBreak |

### 2.3 InstanceManifest 통합

```yaml
adminBaseUrl: "https://admin.client-01.glitzy.kr"
timezone: "Asia/Seoul"

holidayCalendar:                                       # § 8.4 — clientApproverBusinessHoursAware=true 시 required
  region: "KR"
  source: "package-embedded"

notificationChannels:
  email: { enabled: true, transport: "ses", secretRef: "secretRef://EMAIL_TRANSPORT_KEY", sender: "notice@clinic.example.com", replyTo: "ops@glitzy.kr", rateLimitPerHour: 100 }
  slack: { enabled: true, webhookUrlSecretRef: "secretRef://SLACK_WEBHOOK_URL", rateLimitPerHour: 60 }
  inApp: { enabled: true }

features:
  - name: "notifications"
    version: "0.4.0"
    enabled: true
    config:
      notificationPolicyVersion: "9.1.1-2026-05-14"  # § 4.2 병렬 보관 SoT
      digestSchedule: { daily: "09:00", weekly: "MON 09:00" }
      dedupeWindowSeconds: 60
      retryMaxAttempts: 3
      retryBackoffSeconds: [30, 300, 1800]
      ctaRouteTemplates:
        Article: "/admin/content/article/{contentRef}"
        TreatmentPage: "/admin/content/treatment/{contentRef}"
        LegalDocument: "/admin/legal/{contentRef}"
        default: "/admin/content/{contentType}/{contentRef}"
      clientApproverBusinessHoursAware: true
      businessHoursReference: "openingHours"
      logRetentionDaysAfterDlqExpiry: 90
      receiptRetentionDays: 365                        # § 4.3 — sourceEventId 재사용 차단 기간 (dedupeWindow ≪ receipt retention)
      suppression:
        softSuppressionThreshold: 3
        softSuppressionAutoReleaseDays: 14            # C-23 autoReleaseAt 계산 (§ 7.4 worker)
      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://MONITORING_DSN" }
```

---

## 3. 입력·출력

### 3.1 입력 — NotificationEvent

REVIEW_WORKFLOW § 9.2 SoT. 핵심:

- `sourceEventId` — idempotency key (필수)
- `recipients[]` — 비어 있으면 fail
- `criticality` 미지정 시 본 Feature가 § 9.1.1에서 자동 산정
- `metadata.locationRef` — multi-location 인스턴스 권장 (§ 8.4)
- recipient의 AdminUser `instanceMemberships[]`에 본 인스턴스 미포함 시 → `skipped-missing-user` (§ 4.1 4.a — instance membership 검증)

### 3.2 출력 — DeliveryResult·DeliveryStatus

```ts
type DeliveryResult = {
  eventId: string;
  sourceEventId: string;
  eventType: NotificationEventType;
  contentRef: string;
  receiptState: ReceiptState;
  acceptedAt: ISODateString;
  perRecipient: Array<{
    recipientId: string;
    deliveries: Array<{
      payloadId: string;
      channel: "email" | "slack" | "inApp";
      deliveryMode: "perRecipient" | "broadcast-placeholder";
      broadcastAttemptId?: string;     // broadcast-placeholder인 경우 실제 broadcast attempt id 참조
      status: DeliveryStatus;
      attempts: number;
      lastAttemptAt: ISODateString;
      provider?: string;
      providerResponseCode?: string;
      error?: string;
    }>;
  }>;
  broadcastDeliveries?: Array<{
    broadcastAttemptId: string;        // envelope+channel 단위 1건
    channel: "slack";
    status: DeliveryStatus;
    attempts: number;
    lastAttemptAt: ISODateString;
    provider?: string;
    providerResponseCode?: string;
    error?: string;
  }>;
};

type ReceiptState = "accepted" | "processing" | "completed" | "failed";

type DeliveryStatus =
  | "delivered"
  | "deferred-digest"
  | "deferred-quiet-hours"
  | "deferred-business-hours"
  | "deferred-rate-limit"
  | "failed-permanent"
  | "failed-retrying"
  | "deduped"
  | "skipped-missing-user"           // AdminUser 미존재·active=false·instanceMemberships에 본 인스턴스 미포함
  | "skipped-disabled-channel"
  | "skipped-opt-out"
  | "skipped-suppressed"
  | "skipped-missing-location"       // metadata.locationRef가 InstanceManifest에 없는 ID — § 8.4 invalid locationRef
  | "skipped-broadcast-only";        // per-recipient placeholder — 집계 대상 아님

// 내부 attempt-level 상태 — DeliveryAttempt.status에만 사용 (외부 DeliveryStatus와 분리, N5-03)
type DeliveryAttemptStatus =
  | "processing"                      // attemptNumber 선점 후 provider 호출 전 (§ 4.4)
  | DeliveryStatus;
```

**DeliveryResult 소비 규칙** (REVIEW_WORKFLOW·운영 UI 정합):
- 성공/실패 집계는 `broadcastDeliveries[]`(broadcast 모드) + `perRecipient[].deliveries[]`(`skipped-broadcast-only` 제외)를 합산
- `skipped-broadcast-only`는 per-recipient 추적 placeholder만 — `broadcastAttemptId`로 실제 broadcast 결과 참조 가능
- `deferred-rate-limit`·`deferred-*`·`skipped-*`·`deduped`는 발송 성공율 분모 제외 (§ 9.1)

### 3.3 단일 엔트리포인트 — `notify()`

```ts
async function notify(event: NotificationEvent): Promise<DeliveryResult>
```

**idempotency 계약** (REVIEW_WORKFLOW § 9.2.1 — 트랜잭션 안전):
- 1단계 단일 DB 트랜잭션 (immediate FK — Receipt.notificationLogId는 같은 트랜잭션에서 먼저 insert된 Log를 참조하므로 deferred FK 불필요):
  1. NotificationLog insert (UUID 생성)
  2. NotificationEventReceipt insert (`unique(instanceId, sourceEventId)` 위반 시 transaction abort)
  3. Receipt insert 성공 시 트랜잭션 commit → receiptState="accepted"
- **abort 원인 분기** (N4-01):
  - `unique(instanceId, sourceEventId)` violation → idempotent duplicate. 기존 Log·Receipt 조인 → DeliveryResult 재구성 반환 (early exit)
  - 그 외 abort (FK 오류·DB timeout·connection 장애 등) → **retryable internal error 반환** (호출자가 재시도 책임). DeliveryResult 반환하지 않음
- **duplicate caller 결과 계약** (N4-02): 기존 receipt의 receiptState별 응답:
  - `receiptState="completed"` → 완성 DeliveryResult 반환
  - `receiptState="accepted"` 또는 `"processing"` → 짧은 poll(최대 500ms, 100ms 간격) 후 completed면 완성 결과, 미완성이면 `receiptState="processing"`로 부분 DeliveryResult 반환 (호출자가 후속 query 가능)
  - `receiptState="failed"` → 마지막 실패 결과 반환
- `sourceEventId` 재사용 금지: NotificationEventReceipt는 `receiptRetentionDays`(기본 365일) 보존. 보존 만료 후 동일 sourceEventId는 새 이벤트로 처리 가능하지만 운영자가 명시적으로 manifest나 호출자 정책에 합치하지 않으면 사용 자제

**resendDeadLetter** — § 7.2 별도 command (notify() 경로 우회)

**ctaUrl 자동 합성**: `adminBaseUrl + ctaRouteTemplates[contentType].replace("{contentRef}", contentRef)` (default 사용)

---

## 4. 발송 파이프라인

### 4.1 실행 순서 (critical-aware filter ordering)

```
1. idempotency 원자 선점 (단일 DB 트랜잭션 — immediate FK):
   - NotificationLog insert (UUID 생성)
   - NotificationEventReceipt insert (unique(instanceId, sourceEventId))
   - **abort 원인 분기** (N5-02·§ 3.3 정합):
     - `unique(instanceId, sourceEventId)` violation → idempotent duplicate. 기존 NotificationLog·Receipt 조인으로 DeliveryResult 재구성 반환 (receiptState별 응답 — § 3.3 duplicate caller 계약)
     - 그 외 abort (FK 오류·DB timeout·connection 장애 등) → **retryable internal error 반환**. DeliveryResult 반환하지 않음

2. fan-out + NotificationPayloadRecord 영속:
   - recipients[] 각각 payloadId(UUID) 부여
   - ctaUrl 자동 합성
   - criticality 미지정 시 § 9.1.1 매트릭스 산정
   - NotificationPayloadRecord 저장 (payloadId·eventId·recipientId·contentRef·ctaUrl·metadata·criticality — channel별 추적은 DeliveryAttempt가 담당, PayloadRecord는 recipient-envelope unit)
   - receiptState="processing"

3. 즉시 채널 라우팅 — § 9.1.1 매트릭스:
   - immediateChannels(매트릭스) ∩ InstanceManifest.notificationChannels.<channel>.enabled=true
   - digest 채널은 § 6 별도 경로

4. critical-aware 필터 (순서 중요):
   a. **항상 적용** (critical 우회 불가):
      - AdminUser 미존재·active=false·instanceMemberships에 본 인스턴스 미포함 → `skipped-missing-user`
      - 인스턴스 채널 비활성 → `skipped-disabled-channel`
      - dedupe 매칭 (§ 4.3 Redis SET NX EX) → `deduped`
   b. **사용자 opt-out 필터** (mandatory 우회):
      - matrix.optOutPolicy="mandatory" → opt-out 무시 + 사용자 채널 off 무시 (단 인스턴스 채널 활성 channel만)
      - 그 외 + AdminUser.notificationPreferences.channels.<channel>=false → `skipped-opt-out`
      - digest 채널 + AdminUser.digestOptOut=true (digestOptOut-allowed 정책) → `skipped-opt-out`
   c. **suppression 필터**:
      - C-23 suppression.<channel>.state ∈ {soft-suppressed, hard-suppressed} → 원 채널에 `skipped-suppressed` DeliveryAttempt 기록
      - 단 hard-suppressed인 채널 + 매트릭스 `fallback 채널` 컬럼이 정의되어 있으면 → **fallback 채널은 해당 eventType의 immediateChannels 집합 안에 있어야 함**(N4-07) 검증 후 라우팅 시도
      - **fallback 채널도 hard-suppressed인 경우** (N4-08): fallback 채널에도 별도 `skipped-suppressed` DeliveryAttempt 기록 + DeliveryAttempt.metadata에 `fallbackExhausted=true` 마킹 + 외부 monitoring sink alert. 호출자/운영 UI는 두 attempt를 보고 "원 채널·fallback 모두 막힘"을 추적 가능
   d. **criticality=critical은 e~f만 우회**:
      - **(e) quietHours** → `deferred-quiet-hours` (critical 우회 → 즉시 발송)
      - **(f) businessHours 평가** (§ 8.4 client-approver):
        - **(f-pre) invalid locationRef** (N5-04): `metadata.locationRef`가 InstanceManifest LocationProfile에 없는 ID → `skipped-missing-location` + 외부 monitoring sink alert. main fallback으로 보정하지 않음. critical 이벤트도 본 분기는 우회하지 않음 (runtime 입력 오류 감지)
        - (f-main) businessHours 외 → `deferred-business-hours` (critical 우회)
   e. high/normal은 e·f 모두 적용

5. 채널 어댑터 호출 (§ 5):
   - rate limit 평가 → 초과 시 `deferred-rate-limit`
   - 정상 → provider 호출
   - DeliveryAttempt 생성·갱신 (§ 14.4 — 동시성 안전 § 4.4)

6. 결과별 처리:
   - delivered → NotificationLog summary 갱신
   - failed-retrying → 재시도 큐
   - failed-permanent → DLQ 저장 (§ 7.2) + suppression 갱신(§ 7.1) + 외부 sink alert
   - deferred-digest → NotificationDigestBucket (§ 14.6·14.7)
   - deferred-quiet-hours → NotificationQuietHoursQueue (§ 14.8)
   - deferred-business-hours → NotificationBusinessHoursQueue (§ 14.9)
   - deferred-rate-limit → 채널별 rate limit 큐

7. receiptState="completed" + audit log `notification-dispatched` (envelope 1건)
```

### 4.2 매트릭스 병렬 보관 — notificationPolicyVersion

- 본 Feature 패키지는 매트릭스(§ 9.1.1)를 **policyVersion별 병렬 보관**
- 패키지 빌드 시 매트릭스 SoT의 hash + version 메타 포함
- 인스턴스 manifest의 `notificationPolicyVersion`이 명시한 버전을 런타임에 라우팅
- 빌드 검증(§ 11): manifest version이 본 Feature 패키지에 등록된 version 중 하나여야 함 (불일치 fail)
- 매트릭스 변경 운영:
  - REVIEW_WORKFLOW § 9.1.1 갱신 → 본 Feature 패키지에 새 policyVersion 추가 (이전 버전도 보관) → 인스턴스 manifest의 `notificationPolicyVersion` 갱신 (opt-in)
  - 롤백: manifest version을 이전 값으로 변경 (패키지 변경 없음)
- **보관 정책** (N4-10):
  - **최소 지원 기간**: 1 policyVersion당 12개월 (사용 인스턴스 0건 이후에도)
  - **deprecation 절차**: 새 policyVersion 추가 시 — 6개월 후 deprecation 마킹 + 모든 활성 인스턴스에 migration report 발송 (운영팀). 12개월 후 사용 0건 확인 시 제거 가능
  - **archived/복구 인스턴스 처리**: 복구 인스턴스가 deprecated/removed version 참조 시 — build fail 메시지 "policyVersion <X> not found. Available: [<list>]. See migration report at <docs>" 표시
  - 패키지 SemVer와 분리: policyVersion append는 패키지 MINOR. policyVersion semantic 변경(같은 version의 의미 변경)은 금지 — 항상 새 version 부여

### 4.3 dedupe 알고리즘 (Redis SET NX EX 원자)

```
dedupeKey:
  notif:dedupe:{instanceId}:{sourceEventId}:{recipientId}:{channel}
  broadcast 모드: recipientId 위치에 sentinel "broadcast" 사용
    notif:dedupe:{instanceId}:{sourceEventId}:broadcast:{channel}

저장소: Redis (§ 14.10)

원자 연산: SET key value NX EX <ttl>
  - 성공(키 생성) → worker가 provider 호출 진행
  - 실패(키 존재) → DeliveryAttempt status=deduped 기록, provider 호출 생략

값 구조: { state, payloadId, attemptedAt }
state 머신:
  - 발송 시도 직전: SET NX EX "failed-retrying" (dedupeWindowSeconds + 300)
  - delivered → SET XX EX "delivered" (dedupeWindowSeconds)
  - failed-permanent → SET XX EX "failed-permanent" (dedupeWindowSeconds) — 재시도 자동 차단

수동 resendDeadLetter:
  - dedupe key 검사 우회 + dedupe key 갱신하지 않음
  - 별도 attempt(dedupeMode="resend") 생성. 기존 dedupe TTL 자연 만료

sourceEventId 재사용:
  - dedupeWindowSeconds(기본 60초) << receiptRetentionDays(기본 365일)
  - dedupe TTL 만료 후라도 NotificationEventReceipt(§ 14.2)가 unique(instanceId, sourceEventId)로 막음
  - receipt 보존 기간 만료 후 재사용은 새 이벤트로 처리됨 — 운영 정책상 sourceEventId 재사용 금지 권장
```

### 4.4 rate limiting·DeliveryAttempt 동시성

**rate limiting**:
- 채널별 시간당 한도: C-08 `rateLimitPerHour`
- 초과 → `deferred-rate-limit` + 채널별 rate limit 큐. 다음 윈도우 재시도
- 메트릭 제외: § 9.1 성공율·실패율 계산 분모에서 제외

**DeliveryAttempt attemptNumber 동시성** (multi-worker race 방지 — N4-04·05·06):
- attemptNumber는 `(payloadId, channel)` 범위 sequence (PayloadRecord에 channel 필드 없음 — lock 대상은 PayloadRecord row 자체이고 channel은 query 조건)
- **운영 SoT lock 메커니즘**: PostgreSQL advisory lock `pg_advisory_xact_lock(hash(payloadId, channel))` (다른 DBMS는 동등한 named lock — 운영 결정 NT-17)
- **provider 호출은 lock·DB transaction 밖에서 진행** — lock 시간 최소화·deadlock·connection pool 고갈 방지:
  ```
  1. 짧은 transaction 시작
  2. advisory lock acquire (hash(payloadId, channel))
  3. SELECT MAX(attemptNumber)+1 FROM NotificationDeliveryAttempt WHERE payloadId=? AND channel=?
  4. INSERT NotificationDeliveryAttempt (status="processing", attemptNumber=max+1, ...)
  5. transaction commit (lock 자동 해제)
  6. 별도 비-트랜잭션 영역에서 provider 호출
  7. 별도 transaction에서 attempt UPDATE (status=delivered/failed-*, providerResponseCode, ...)
  ```
- 실패 처리: 6단계 직후 worker 장애 시 attempt status="processing" 그대로 남음. 운영 worker가 stale processing(>SLA) 감지 → status="failed-retrying" 또는 운영 alert로 정리 (NT-17)
- **resendDeadLetter도 동일 메커니즘** — attemptNumber sequence 통합 관리

---

## 5. 채널 어댑터

### 5.1 email

- C-08 `notificationChannels.email` 적용 (transport·secretRef·sender·replyTo)
- 템플릿: Markdown → HTML, BrandTokens(C-07) (NT-05 운영)
- 본문 필수: 이벤트 제목·콘텐츠 제목·CTA 버튼·발신자/Reply-To
- 실패 분류: § 7.1 표 → suppression 갱신 자동

### 5.2 Slack (per-recipient vs broadcast 모드)

- C-08 webhookUrlSecretRef
- 포맷: Slack Block Kit

**per-recipient 모드** (slackUserId 보유):
- mention(`<@U12345>`) 포함
- DeliveryAttempt: `deliveryMode="perRecipient"` + `recipientId`
- dedupeKey: `notif:dedupe:{instanceId}:{sourceEventId}:{recipientId}:slack`
- 일반 필터(dedupe·opt-out·quietHours·suppression) 정상 적용

**broadcast 모드** (slackUserId 미보유, recipients 중 1명 이상):
- 매트릭스 immediateChannels에 slack 포함 + `criticality=critical` 이벤트만 허용. 그 외는 broadcast 미발송
- **broadcast 데이터 모델** (N4-14·N4-15·N4-16):
  - **NotificationPayloadRecord 1건 생성** — envelope+channel 단위 (recipientId=NULL). § 14.3 broadcast 모드에서 PayloadRecord 1건만, 추가 broadcast-only recipient에 대한 PayloadRecord는 생성하지 않음
  - **NotificationDeliveryAttempt 1건 생성** — envelope+channel 단위 (deliveryMode="broadcast", recipientId=NULL, payloadId=위 broadcast PayloadRecord)
  - `broadcastAttemptId` = **broadcast DeliveryAttempt.id 그대로 참조** (별도 group id 아님 — 자기 참조 의미 제거)
  - `perRecipient[].deliveries[]`의 broadcast-only placeholder는 **DB row 없는 합성 값** — DeliveryResult 합성 시점에 만들어지고 `broadcastAttemptId`로 broadcastDeliveries 매핑. DB에 placeholder DeliveryAttempt를 만들지 않음 → § 14.4 deliveryMode enum에서 `broadcast-placeholder` 제거
- dedupeKey: `notif:dedupe:{instanceId}:{sourceEventId}:broadcast:slack` (sentinel "broadcast" 사용)
- broadcast 결과는 `DeliveryResult.broadcastDeliveries[]`에 기록 (broadcastAttemptId = broadcast DeliveryAttempt.id)
- 실패/성공 집계는 `broadcastDeliveries[]`가 SoT, `perRecipient[].deliveries[].status="skipped-broadcast-only"`는 placeholder (집계 제외)

**suppression fallback** (§ 9.1.1 매트릭스):
- slack hard-suppressed (workspace 4xx 등) → fallback 채널(매트릭스 컬럼)로 라우팅. fallback도 막히면 외부 sink alert
- broadcast 모드는 workspace 단위 suppression 대상이 아님 (per-user suppression 없음)

### 5.3 in-app

- 저장소: NotificationInbox (§ 14.5)
- 표시: 어드민 종 아이콘 미확인 카운트
- **발송 원자성** (N4-24): inApp은 **단일 DB transaction에서 NotificationInbox insert + NotificationDeliveryAttempt(status=delivered) insert를 원자 처리**. `UNIQUE(payloadId)` 충돌 시 (race) — 이미 존재하는 Inbox·Attempt 조회하여 `status=deduped` 결과 반환
- 클릭 시: `readAt` 마킹 + audit log `notification-read` (REVIEW_WORKFLOW § 10.2.1 enum). **actorRole 산정** (N4-27): `AdminUser.instanceMemberships` 중 본 instance의 `role`로 기록 (approverRoleEligibility와 구분 — instance-membership role이 actor 신원)
- **inactive 사용자의 historical inbox**: `active=false` 사용자 inbox는 어드민 UI에서 기본 숨김. 단 DB row는 보존 (감사). 사용자 reactive 시 자동 재노출. 본 정책은 v0.5 기본 운영 결정 — NT-16 해소

---

## 6. digest 모드 (DigestPolicy AST)

### 6.1 정책 AST 구조 (자연어 매트릭스 → 구조화)

REVIEW_WORKFLOW § 9.1.1의 `digest 주기` 컬럼은 본 Feature 패키지 빌드 시 다음 AST로 코드 생성:

```ts
type DigestPolicy = {
  channel: "email";                                  // 현재 email만
  cadence: "daily" | "weekly";
  when?: DigestCondition;                             // 미지정 시 default
  optOutPolicy: "mandatory" | "digestOptOut-allowed";
  policyKey: string;                                  // 매트릭스 빌드 시 결정적 부여
};

type DigestCondition = {
  field: DigestConditionField;                        // 허용 enum
  op: "equals" | "notEquals" | "startsWith" | "endsWith" | "contains" | "exists" | "notExists";
  value?: string | number | boolean;                  // op="exists"·"notExists"는 미지정
};

type DigestConditionField =
  | "metadata.staleTriggeredBy"
  | "metadata.rejectReason"
  | "metadata.priorReviewSubmissionId"
  | "metadata.locationRef"
  | "criticality"
  | "eventType";
```

**DigestConditionField 추가 cascade 정책** (N4-11): DigestConditionField에 새 metadata 필드를 추가하려면 (a) REVIEW_WORKFLOW § 9.2 NotificationEvent.metadata 타입에 해당 필드를 명시 cascade, (b) 본 enum 추가, (c) 본 Feature 패키지 새 policyVersion. metadata 필드의 enum 한정이 SoT.

**exists/notExists deep path 평가 규칙** (N4-12):
- `missing parent` (예: `metadata.priorReviewSubmissionId` 평가 시 `metadata` 객체에 본 키 자체 부재) → `exists=false`
- `null` 값 → `exists=false`
- `undefined` 값 → `exists=false`
- `""` (빈 문자열) → `exists=true`
- `0`·`false` → `exists=true`

**default policy 유일성 검증** (N4-13): 본 Feature 패키지 빌드 시 — 각 `(eventType, channel)`별 매트릭스 셀이 digest 정책을 가지면 (a) `when: undefined` default 정책 정확히 1개, (b) 조건부 정책 0개 이상. default 부재·중복은 build fail.

**예시 (stale-queued 셀 "email — 의료법 개정은 일일, 기타는 주간" 분해)**:

```ts
[
  {
    channel: "email",
    cadence: "daily",
    when: {
      field: "metadata.staleTriggeredBy",
      op: "startsWith",
      value: "medical-law-revision-"
    },
    optOutPolicy: "mandatory",
    policyKey: "stale-queued.email.daily.medical-law-revision"
  },
  {
    channel: "email",
    cadence: "weekly",
    when: undefined,                                  // default — 위 when 미충족 시
    optOutPolicy: "digestOptOut-allowed",
    policyKey: "stale-queued.email.weekly.default"
  }
]
```

**매칭 우선순위**: 배열 순서대로 평가, 첫 매칭 정책 사용. when 미지정(default)은 항상 마지막. 평가 안전:
- 허용 field/op 외 사용 금지 (빌드 시 fail)
- 값 타입 검증: `equals`/`notEquals`는 일치 타입, `startsWith` 등은 string 한정
- 런타임 eval·임의 식 평가 금지

### 6.2 발송 트리거

- 일일: InstanceManifest.timezone 기준 `digestSchedule.daily`
- 주간: `digestSchedule.weekly`
- 스케줄러: 외부 cron 또는 내부 (NT-08)
- missed run: ±10분 → 다음 cycle carry-over
- DST: IANA 기준 자동 (fall-back 중복 시 첫 발생, spring-forward 누락 시 다음 정상 시각)

### 6.3 그룹화·발송

- DigestBucket key: `(recipientId + policyKey + cadenceWindow)` — § 14.6·14.7 join table
- **cadenceWindow 표기 (§ 14.6 정합)**:
  - daily: `YYYY-MM-DD` (인스턴스 timezone 기준 일자)
  - weekly: `YYYY-Wnn` (ISO week)
- 발송 시점에 join table 조인 → NotificationPayloadRecord[] 묶음 처리
- 발송 완료 → bucket `digestSentAt` 기록 (중복 발송 방지)
- opt-out 평가:
  - policy.optOutPolicy="mandatory" → AdminUser.digestOptOut 무시
  - "digestOptOut-allowed" → digestOptOut=true 시 `skipped-opt-out` (bucket 누적 안 함)

### 6.4 큐 분리·중복 발송 방지 정확화

- DigestBucket·QuietHoursQueue·BusinessHoursQueue 별도 테이블 (§ 14)
- 동일 payloadId가 여러 큐에 동시 누적 가능. **큐 worker 중복 발송 방지 SoT 쿼리** (N4-23):
  ```
  1. advisory lock acquire (hash(payloadId, channel)) — § 4.4와 동일 메커니즘
  2. SELECT 1 FROM NotificationDeliveryAttempt
     WHERE payloadId=? AND channel=? AND status IN ('processing', 'delivered', 'deferred-digest', 'deferred-quiet-hours', 'deferred-business-hours')
     LIMIT 1
  3. row 존재 시 → 본 worker는 발송 생략 (다른 worker가 이미 처리 중·완료)
  4. row 미존재 시 → § 4.4 attemptNumber lock·INSERT processing → commit → provider 호출
  5. advisory lock 해제
  ```
- **인덱스**: `NotificationDeliveryAttempt(payloadId, channel, status)` partial index (status IN above 집합) — 위 쿼리 최적화 (§ 14.4 추가 인덱스)

---

## 7. 재시도·실패·suppression

### 7.1 채널별 실패 분류표

| 채널 | 분류 | 트리거 | 처리 | suppression 갱신 |
|---|---|---|---|---|
| email | `transient` | SMTP 4xx, network timeout, provider 5xx | 재시도 3회 | **atomic increment** `observedCount`. **compare-and-set**으로 threshold 도달 시 1회만 state=`soft-suppressed` + `autoReleaseAt = lastObservedAt + softSuppressionAutoReleaseDays` 설정 |
| email | `permanent` (hard bounce) | 5xx 영구·invalid recipient | DLQ + sink alert | 즉시 `hard-suppressed` (자동 해제 없음) |
| email | `permanent` (config) | provider auth 401/403 | DLQ + sink alert (긴급) | 갱신 없음 |
| email | `permanent` (spam) | spam complaint | DLQ + sink alert | 즉시 `hard-suppressed` |
| email | `rate-limited` | 429 | `deferred-rate-limit` | 갱신 없음 |
| slack | `transient` | webhook 5xx, timeout | 재시도 | (per-recipient 모드에서만) atomic increment |
| slack | `permanent` | 4xx (404·403) | DLQ + sink alert | webhook 자체 문제 — webhookUrlSecretRef 점검 alert |
| slack | `rate-limited` | 429 + Retry-After | header + retryBackoff | 갱신 없음 |
| inApp | `transient` | DB 일시 | 1회 재시도, 실패 시 DLQ | 갱신 없음 |
| inApp | `permanent` | DB 스키마·constraint | DLQ + sink alert (긴급) | 갱신 없음 |

**suppression atomic 갱신 규칙** (N3-16 해소):
- `observedCount` 증가는 DB atomic increment (`UPDATE ... SET observedCount = observedCount + 1`)
- threshold 도달 판정: `UPDATE ... SET state='soft-suppressed', autoReleaseAt=... WHERE state='active' AND observedCount >= threshold` — 영향 row 1건일 때만 자동 sink alert 발생 (중복 alert 방지)

**soft → hard 전이** (N4-22):
- soft-suppressed 상태에서 hard bounce·spam complaint 발생 시 → **hard가 soft를 무조건 override**: `UPDATE ... SET state='hard-suppressed', autoReleaseAt=NULL, observedCount=observedCount(보존)` — autoReleaseAt 제거 + observedCount는 운영 추적용 보존
- worker(§ 7.4)는 자동 해제 조건에 `state='soft-suppressed'` 명시적으로 추가하여 hard 상태 불변성 보장

### 7.2 DLQ + resendDeadLetter

- 저장소: NotificationDeadLetter (§ 14.10) + join table NotificationDeadLetterAttempt (§ 14.11 — N3-19 정정)
- `failedAttemptIds`는 join table FK 참조 — RDBMS 무결성 보장

**resendDeadLetter(deadLetterId)** — notify() 우회 별도 command:
- 새 resendAttemptId(UUID) 생성
- 새 NotificationDeliveryAttempt(attemptNumber = § 4.4 lock 메커니즘 사용, dedupeMode="resend") 생성. dedupe 우회
- 발송 성공 → DeadLetter.resolvedAt 마킹 + NotificationLog summary 재계산
- 발송 실패 → join table에 새 attempt 추가, DeadLetter unresolved 유지
- audit log: `notification-resend-attempted` (REVIEW_WORKFLOW § 10.2.1 — cascade 완료)

**보존 기간·순서** (N3-21 해소):
- DLQ `expiresAt`: 기본 30일 (NT-12)
- NotificationLog·PayloadRecord·DeliveryAttempt: DLQ `expiresAt` + `logRetentionDaysAfterDlqExpiry`(기본 90일) 이상 보존
- ON DELETE RESTRICT FK로 보존 순서 강제

### 7.3 self-notification 차단 — 외부 sink

| sink | 트리거 | 대상 |
|---|---|---|
| `externalMonitoringSink` | permanent 실패, DB 장애, DLQ 누적 임계 초과, rate-limit 발생률 > 30%, fallback 채널도 hard-suppressed | Sentry·Datadog·PagerDuty |
| `auditLog` | envelope 종결·재발송·읽음 | 어드민 콘솔 |
| `NotificationLog` | per-payload·per-attempt | 운영 메트릭 SoT |

### 7.4 suppression auto-release worker + 운영자 수동 해제 (N3-15·N4-20·N4-21 해소)

**자동 해제 worker** (soft-suppressed 한정):
- 주기 worker: 1시간 간격
- 조건: `state='soft-suppressed' AND autoReleaseAt <= now()` (hard-suppressed 자동 해제 금지)
- 액션: `state='active', observedCount=0, autoReleaseAt=NULL, firstObservedAt=NULL, lastObservedAt=NULL`
- 동시성 안전: 위 WHERE 조건부 update (DB atomic)

**운영자 수동 해제** (hard-suppressed·soft-suppressed 공통):
- **권한**: `super-admin`·`operator` (REVIEW_WORKFLOW § 11.1)
- **command**: `unsuppressAdminUserChannel(adminUserId, channel, reason)` — notify() 우회 별도 command
- **갱신**: `state='active', observedCount=0, firstObservedAt=NULL, lastObservedAt=NULL, autoReleaseAt=NULL, unsuppressedBy=actor.id, unsuppressedAt=now()`
- **observedCount reset 정책**: 수동 해제 시 0 리셋 — 다음 transient 발생부터 새 epoch으로 카운트. threshold 재도달 시 정상 alert 발생 (즉시 재-alert 방지하면서 재발 추적 보장)
- **audit log**: `notification-suppression-unsuppressed` (REVIEW_WORKFLOW § 10.2.1 — cascade 완료). metadata: `{adminUserId, channel, reason, priorState}`

---

## 8. 사용자 설정·옵트아웃·운영시간

### 8.1 timezone 우선순위

- **quietHours**: `AdminUser.notificationPreferences.quietHours.timezone > AdminUser.timezone > InstanceManifest.timezone`
- **digest 발송 시각**: **InstanceManifest.timezone 고정** (DATA_MODEL C-23 v0.13 cascade로 AdminUser.timezone 설명을 quietHours 한정으로 좁힘 — N3-20)

### 8.2 quietHours

- 즉시 채널(email·slack-perRecipient) 보류 → `deferred-quiet-hours` → NotificationQuietHoursQueue (§ 14.8)
- inApp은 quietHours 무시
- critical은 quietHours 우회

### 8.3 글로벌 opt-out

- 모든 채널 off + digestOptOut=true:
  - mandatory 이벤트 → opt-out 우회 + 사용자 채널 off 무시 (단 인스턴스 채널 비활성은 우회 안 함). 인스턴스 inApp 활성 시 강제 inApp
  - 그 외 → `skipped-opt-out`
- 강제 inApp 발송 사전 고지 — 어드민 알림 설정 화면

### 8.4 인스턴스 운영시간 — client-approver

- 적용 조건: `clientApproverBusinessHoursAware=true` + recipient.recipientRole="client"
- **locationRef 산정**:
  1. NotificationEvent.metadata.locationRef
  2. fallback — **LocationProfile `@id="main"`** (C-21 SoT 관례, N3-14 정정)
  3. main 부재 → § 11 빌드 검증 fail (multi-location + main 부재는 fail로 격상 — N4-29)
- **invalid locationRef 처리** (N4-19): metadata.locationRef가 InstanceManifest에 없는 ID이면 → 본 recipient는 `status="skipped-missing-location"` (DeliveryStatus enum 신규 — § 3.2) + 외부 monitoring sink alert. main fallback으로 조용히 보정하지 않음 (runtime 입력 오류 감지)
- 기준 필드: `businessHoursReference` (`openingHours` | `receptionHours` — 기본 openingHours)
- 휴진·공휴일·점심:
  - `openingHours`/`receptionHours`의 `dayOfWeek` 시간 범위
  - `lunchBreaks` 제외 (점심 종료 후 발송)
  - `specialClosures[]` (특정 일자)
  - **PublicHoliday 처리**: BusinessHours.dayOfWeek="PublicHoliday" 룰 평가 시 — **C-08 `holidayCalendar.region`** SoT의 한국 공휴일 캘린더 매칭 (`region: "KR"` → 본 Feature 패키지 embed 한국 공휴일 데이터, N3-13 cascade)
- `holidayPolicy` Markdown 필드는 표시용. 계산에 사용 안 함
- 종료 시각 산정 (N4-18): "다음 운영 가능 시각" 탐색 — **최대 90일 탐색 한계**. 90일 내 운영 시각 미발견 시 → `status="failed-permanent"` + 외부 sink alert. 연속 휴일·잘못된 businessHours 설정 등 입력 오류 감지
- **package-embedded holidayCalendar 갱신 정책** (N4-17):
  - 본 Feature 패키지 buld에 한국 공휴일 데이터 embed (해당 연도 + 다음 연도 + 1)
  - **연간 갱신**: 매년 12월 패키지 minor release에 차차년도 공휴일 추가
  - **긴급 패치**: 임시공휴일·대체공휴일 지정 시 본 Feature 패키지 patch release (1-2주 내). 운영팀이 모든 인스턴스에 패치 알림
  - `holidayCalendar.source="external-api"` override 우선 — 패키지 데이터보다 외부 API가 최신이면 외부 우선 (NT-18 인프라 결정)
- 큐: NotificationBusinessHoursQueue (§ 14.9)
- critical은 businessHours 우회
- operator·physician·legal·super-admin: 본 정책 미적용

---

## 9. 운영 지표

### 9.1 핵심 지표

| 지표 | 정의 | 목표 |
|---|---|---|
| 발송 지연 (즉시) | event 수신 → delivered/deferred-* 종결 | < 30초 (p95) |
| 발송 성공율 | delivered / (delivered + failed-permanent) — `deferred-*`·`skipped-*`·`deduped`는 분모 제외 | > 99% (email·slack), > 99.9% (inApp) |
| transient 재시도율 | failed-retrying / 전체 | < 5% |
| rate-limit 발생율 | deferred-rate-limit / 전체 | < 10% |
| DLQ 신규 발생 | failed-permanent / 일 | < 10 |
| dedupe 적중률 | deduped / 전체 | baseline |
| digest 적시성 | 예정 시각 ± 5분 | > 95% |
| broadcast 비율 (Slack) | broadcastDeliveries / 전체 slack | baseline |
| suppression 누적 | hard-suppressed AdminUser 수 | M2+ baseline |

### 9.2 측정·로깅

- NotificationLog·DeliveryAttempt·PayloadRecord가 SoT
- audit log는 envelope 요약·재발송·읽음만

### 9.3 자체 alert (외부 sink)

- 성공율 < 95% (10분 이동평균)
- DLQ 신규 > 10/일
- 발송 지연 p95 > 60초
- rate-limit > 30% (1시간)

---

## 10. 설치·설정

### 10.1 빌드 단계

```bash
# 1. Feature 활성화 (InstanceManifest.features[])
# 2. notificationChannels·adminBaseUrl·timezone·holidayCalendar 설정 (C-08 v0.13)
# 3. secretRef 등록 (이메일·Slack·monitoring sink)
# 4. 어드민 DB 마이그레이션 — § 14 인벤토리 (DB 11 tables + Redis 1 keyspace)
# 5. AdminUser(C-23) 등록
# 6. notificationPolicyVersion 확인 — 본 Feature 패키지의 매트릭스 보관 버전 중 하나와 일치
```

### 10.2 설정 예시 — § 2.3 참조

---

## 11. 빌드 검증

| 레벨 | 본 Feature 영역 |
|---|---|
| **fail** | `enabled=true` + 전체 채널 `enabled=false`, email 활성 + secretRef·sender 누락, slack 활성 + webhookUrlSecretRef 누락, `adminBaseUrl`·`timezone` 누락, `ctaRouteTemplates.default` 누락, `externalMonitoringSink.dsnSecretRef` 누락, `notificationPolicyVersion` 누락 또는 본 Feature 패키지 보관 버전과 불일치, `clientApproverBusinessHoursAware=true` + `holidayCalendar` 누락, **`clientApproverBusinessHoursAware=true` + multi-location 인스턴스 + LocationProfile `@id="main"` 부재** (N4-29 fail 격상) |
| **warning** | AdminUser(C-23) 0건, slack 활성 + slackUserId 등록 0건(broadcast 모드만), `clientApproverBusinessHoursAware=true` + LocationProfile.businessHours 미설정 |

---

## 12. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| NT-04 | 이메일 트랜스포트 — SMTP vs SES vs Mailgun | 운영 결정 |
| NT-05 | 이메일 템플릿 — BrandTokens·다국어 | M2+ |
| NT-08 | digest 스케줄러 — 외부 cron vs 내부 | 인프라 결정 |
| NT-11 | SMS 채널 도입 시점 | v1.x |
| NT-12 | DLQ 보존 기간 — 기본 30일 vs 운영 | 운영 정책 |
| NT-17 | DeliveryAttempt advisory lock 메커니즘 — PostgreSQL `pg_advisory_xact_lock` vs 다른 DBMS named lock + stale processing worker 정리 정책 | 인프라 결정 |
| NT-18 | holidayCalendar external-api override 운영 — provider 선택·API 호출 빈도 | 인프라 결정 |

### 12.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~NT-01~~ | Slack webhook secretRef | v0.2 |
| ~~NT-02~~ | AdminUser cascade | v0.2 — C-23 신설 |
| ~~NT-03~~ | dedupe 저장소 | v0.2 — Redis (v0.4 SET NX EX 원자) |
| ~~NT-06~~ | Slack 사용자 매핑 | v0.2/v0.3 — slackUserId·broadcast 모드. v0.4 — broadcast attempt envelope+channel 단위 1건, sentinel dedupeKey |
| ~~NT-07~~ | NotificationInbox 스키마 | v0.2 |
| ~~NT-09~~ | 글로벌 opt-out | v0.3 |
| ~~NT-10~~ | NotificationLog vs audit log | v0.2 |
| ~~NT-13~~ | NotificationLog 보존 | v0.3 — DLQ + logRetentionDaysAfterDlqExpiry |
| ~~NT-14~~ | hard bounce suppression | v0.3 — C-23 suppression. v0.4 — autoReleaseAt + worker |
| ~~NT-15~~ | notification-read audit | v0.4 — REVIEW_WORKFLOW § 10.2.1 cascade |
| ~~NT-16~~ | inactive 사용자 historical inbox | v0.5 — 기본 숨김 운영 결정 (§ 5.3). 인스턴스 옵션 override 없음 |

---

## 13. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 |
| 2026-05-14 | v0.2 | codex 1차 (22 지적) |
| 2026-05-14 | v0.3 | codex 2차 (22 지적) |
| 2026-05-14 | v0.4 | codex 3차 (23 지적) |
| 2026-05-14 | v0.5 | codex 4차 (30 지적 전건 수용) — 트랜잭션 abort 분기·attemptNumber lock SoT·UNIQUE 정정·fallback 두 attempt·두 축 분리·DigestPolicy AST 검증·broadcast 단일 PayloadRecord·holidayCalendar 갱신·businessHours 90일·skipped-missing-location·운영자 수동 unsuppress·soft→hard·큐 worker 중복 방지·inApp 원자성·DeadLetter UNIQUE·MySQL schema·actorRole·AdminUserRole system·main 부재 fail
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (7개 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1.1 매트릭스 정정** — `sla-imminent`·`sla-overdue` 즉시 채널을 `email + inApp`으로 변경. fallback=inApp이 immediateChannels 집합 안에 포함되도록 cascade (N5-01), (2) **§ 4.1 1단계 abort 원인 분기 명시** — unique violation만 idempotent path, 그 외 abort는 retryable internal error 반환. § 3.3과 정합 (N5-02), (3) **DeliveryAttemptStatus 별도 정의** — 내부 attempt-level "processing"을 외부 DeliveryStatus와 분리. `DeliveryAttemptStatus = "processing" | DeliveryStatus` 합 타입 (N5-03), (4) **§ 4.1 흐름에 invalid locationRef 분기 추가** — businessHours 평가 직전 (f-pre)에 `skipped-missing-location` 명시. critical 이벤트도 본 분기는 우회하지 않음 (N5-04), (5) **MySQL generated column unique schema 정정** — `activeKey INT GENERATED AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END)` + `UNIQUE(payloadId, failingChannel, activeKey)`. resolved DLQ 이력 다수 허용 (N5-05), (6) **DATA_MODEL C-23 AdminUser.role cascade 정정** — `system` enum 값은 audit log actorRole 표기 전용. C-23 `role` 및 `instanceMemberships[].role`에는 저장 금지 명시 (N5-06), (7) **specVersion 1.0 + 세 버전 의미 차이** — specVersion(명세)·패키지 SemVer·notificationPolicyVersion 구분 한 줄 설명 (N5-07) (1) **트랜잭션 abort 원인 분기** — unique violation만 idempotent path, 그 외 retryable error (N4-01·N4-03), (2) **duplicate caller receiptState별 응답 계약** (N4-02), (3) **DeliveryAttempt advisory lock SoT** — pg_advisory_xact_lock + provider 호출은 lock 밖 (N4-04·N4-06). NT-17, (4) **UNIQUE(payloadId, channel, attemptNumber)** — dedupeMode 제외 (N4-05), (5) **§ 4.1 fallback immediateChannels 제약** 명시 (N4-07), (6) **fallback 실패 두 attempt 기록** + fallbackExhausted 메타 (N4-08), (7) **두 축 분리 정책** — 패키지 SemVer ↔ policyVersion (N4-09), (8) **policyVersion 보관 정책** — 12개월 최소 지원·deprecation·build fail 메시지 (N4-10), (9) **DigestConditionField cascade 규칙** (N4-11), (10) **exists/notExists deep path 평가 규칙** (N4-12), (11) **default policy 유일성 검증** (N4-13), (12) **broadcast PayloadRecord envelope+channel 단위 1건** + broadcast-placeholder는 DB row 아님 + broadcastAttemptId = broadcast DeliveryAttempt.id (N4-14·N4-15·N4-16), (13) **holidayCalendar 갱신·배포 정책** — 연간 minor·임시공휴일 patch·external-api override (N4-17). NT-18, (14) **businessHours 90일 탐색 한계** + failed-permanent (N4-18), (15) **invalid locationRef → `skipped-missing-location`** DeliveryStatus 신규 (N4-19), (16) **운영자 수동 unsuppress command** + REVIEW_WORKFLOW § 10.2.1 `notification-suppression-unsuppressed` cascade (N4-20·N4-21), (17) **soft → hard 전이 정책** (N4-22), (18) **큐 worker 중복 발송 방지 SoT 쿼리** + partial index (N4-23), (19) **inApp 단일 transaction 원자성** (N4-24), (20) **DeadLetterAttempt UNIQUE(attemptId)** — 1 attempt 1 DLQ (N4-25), (21) **MySQL generated column 대체 schema** 구체 명시 (N4-26), (22) **notification-read actorRole = instanceMemberships 현재 instance role** (N4-27), (23) **AdminUserRole `system` 추가** — REVIEW_WORKFLOW § 11.1 cascade (N4-28), (24) **multi-location + main 부재 fail 격상** (N4-29), (25) **NT-16 해소** (N4-30) (20 finding + 3 residual = 23 지적 전건 수용)**: (1) **Receipt-Log 트랜잭션 순서** — 단일 DB 트랜잭션에서 Log insert → Receipt insert. abort 시 양쪽 롤백 (N3-01), (2) **테이블 인벤토리 재산정 — 11 tables + Redis 1** — Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·**DeadLetterAttempt(신설)** + DedupeCache. `NotificationDelivery` 가상 참조 제거 (N3-02·N3-19), (3) **DeliveryAttempt attemptNumber 동시성** — payloadId+channel 범위 row lock 또는 advisory lock + processing 선점 (N3-03), (4) **PayloadRecord recipient-envelope unit 명확화** — channel 필드 제거, directSentAt/digestSentAt 제거. 채널별 sentAt 추적은 DeliveryAttempt status만 사용 (N3-04), (5) **fallback 채널 매트릭스 SoT** — REVIEW_WORKFLOW § 9.1.1 컬럼 cascade. 임의 활성 채널 라우팅 금지, fallback도 막히면 외부 sink alert만 (N3-05), (6) **dedupe Redis SET NX EX 원자** — 명시 (N3-06), (7) **receipt vs dedupe TTL 관계** — `receiptRetentionDays`(기본 365일) ≫ dedupeWindowSeconds. sourceEventId 재사용 금지 (N3-07), (8) **REVIEW_WORKFLOW § 9.3 cascade** — Slack 2가지 동작 모드·DeliveryResult 소비 규칙 명시 (N3-08), (9) **broadcast envelope 단위 1건** — broadcastAttemptId·sentinel dedupeKey·perRecipient placeholder broadcastAttemptId 참조 (N3-09), (10) **DigestPolicy AST 구조화** — DigestCondition({field, op, value}) + 허용 enum (N3-10), (11) **policyVersion 병렬 보관** — 패키지에 버전별 매트릭스 보관, manifest opt-in, 롤백은 manifest 변경만 (N3-11), (12) **DigestBucketPayload FK 분리** — bucketId CASCADE, payloadId RESTRICT (N3-12), (13) **C-08 holidayCalendar cascade** — region·source. PublicHoliday SoT 정합. CT-02 dayOfWeek enum과 분리 (N3-13), (14) **LocationProfile `@id="main"` 관례 정합** — C-21 SoT 정합 (N3-14), (15) **suppression autoReleaseAt + worker** — § 7.4 1시간 주기. DATA_MODEL C-23 cascade (N3-15), (16) **suppression atomic increment** — DB atomic + compare-and-set threshold 1회 alert (N3-16), (17) **REVIEW_WORKFLOW § 10.2.1 enum cascade** — `notification-resend-attempted`·`notification-read` (N3-17), (18) **DLQ SQL syntax PostgreSQL** — partial unique index 표기 (N3-18), (19) **DATA_MODEL C-23 timezone 설명 정정** — quietHours 한정 (N3-20), (20) **inactive 사용자 historical inbox 정책** — 기본 숨김 + 인스턴스 옵션 (NT-16) (Residual), (21) **cadenceWindow 포맷 명시** — daily `YYYY-MM-DD`, weekly `YYYY-Wnn` (Residual), (22) **instanceMemberships 검증** — recipient AdminUser.instanceMemberships에 본 인스턴스 미포함 시 `skipped-missing-user` (Residual) |

---

## 14. 본 Feature 내부 데이터 구조 (admin DB 11 tables + Redis 1 keyspace)

### 14.1 공통 원칙

- 모든 테이블 `id` UUID PK, `createdAt` Date
- FK 기본 ON DELETE RESTRICT — 보존 순서 보장 (DigestBucketPayload만 분리, § 14.7)
- 인스턴스 격리: `instanceId` 컬럼 + index. recipient의 AdminUser.instanceMemberships에 본 instanceId 미포함 시 `skipped-missing-user` 처리 (§ 4.1 4.a)

### 14.2 `NotificationEventReceipt` (idempotency 선점)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | PK |
| `instanceId` | Slug | ✅ | |
| `sourceEventId` | string | ✅ | idempotency key |
| `notificationLogId` | UUID | ✅ | NotificationLog FK |
| `receiptState` | enum | ✅ | accepted/processing/completed/failed |
| `acceptedAt` | Date | ✅ | |
| `completedAt` | Date | optional | |

**Constraints**: `UNIQUE(instanceId, sourceEventId)`. **트랜잭션 순서**: 단일 트랜잭션에서 NotificationLog INSERT → Receipt INSERT. abort 시 양쪽 롤백.
**Index**: `(instanceId, sourceEventId)` unique, `(receiptState, acceptedAt)`.
**보존**: `receiptRetentionDays`(기본 365일) — sourceEventId 재사용 차단.

### 14.3 `NotificationPayloadRecord` (recipient-envelope unit)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | = payloadId |
| `notificationLogId` | UUID | ✅ | FK |
| `eventId` | string | ✅ | |
| `recipientId` | Ref<C-23> | optional | **broadcast 모드: NULL (envelope+channel 단위 1건 — N4-14)**. per-recipient 모드: AdminUser @id |
| `recipientRole` | enum | optional | broadcast 모드 NULL. per-recipient 모드 ✅ |
| `eventType` | NotificationEventType | ✅ | |
| `contentRef` | string | ✅ | |
| `contentTitle` | string | ✅ | |
| `ctaUrl` | URL | ✅ | |
| `criticality` | enum | ✅ | |
| `metadata` | object | ✅ | |
| `createdAt` | Date | ✅ | |

> 채널별 sentAt 추적은 NotificationDeliveryAttempt.status로만 판단 (per-channel scope). PayloadRecord에는 channel 필드·sentAt 필드 없음 — N3-04 정정.
>
> **broadcast 모드 PayloadRecord 생성 규칙** (N4-14): envelope+channel 단위 1건만 생성 (recipientId=NULL, recipientRole=NULL). broadcast-only 추가 recipient들에 대해 별도 PayloadRecord 생성하지 않음. perRecipient[] DeliveryResult의 broadcast-placeholder는 DB row 없는 합성값 (N4-16).

**Constraints**: `FK notificationLogId ON DELETE RESTRICT`.
**Index**: `(notificationLogId)`, `(recipientId, createdAt)`.

### 14.4 `NotificationDeliveryAttempt`

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `notificationLogId` | UUID | ✅ | FK |
| `payloadId` | UUID | ✅ | PayloadRecord FK |
| `recipientId` | Ref<C-23> | optional | broadcast → null |
| `channel` | enum | ✅ | email·slack·inApp |
| `deliveryMode` | enum | ✅ | perRecipient·broadcast (broadcast-placeholder는 DB row 아님 — N4-16: DeliveryResult 합성값) |
| `attemptNumber` | integer (1~) | ✅ | payloadId+channel 범위 sequence (§ 4.4 lock 메커니즘) |
| `dedupeMode` | enum | ✅ | normal·resend |
| `status` | DeliveryStatus | ✅ | processing(선점) → delivered/failed-*/deferred-*/deduped/skipped-* |
| `provider` | string | optional | |
| `providerResponseCode` | string | optional | |
| `providerResponseBody` | string | optional | 민감 마스킹 |
| `error` | string | optional | |
| `latencyMs` | number | optional | |
| `attemptedAt` | Date | ✅ | |
| `completedAt` | Date | optional | |
| `failureClassification` | enum {transient, permanent, rate-limited} | optional | § 7.1 |

**Constraints**:
- `FK notificationLogId ON DELETE RESTRICT`, `FK payloadId ON DELETE RESTRICT`
- `UNIQUE(payloadId, channel, attemptNumber)` — N4-05 정정: sequence가 `(payloadId, channel)` 범위이므로 dedupeMode를 unique에서 제외. dedupeMode는 일반 컬럼
**Index**: `(notificationLogId)`, `(payloadId, channel)`, `(status, attemptedAt)`, `(failureClassification, attemptedAt)`, **`(payloadId, channel, status)` partial index where status IN ('processing','delivered','deferred-digest','deferred-quiet-hours','deferred-business-hours')** (§ 6.4 큐 worker 중복 방지 최적화 — N4-23).

> `broadcastAttemptId` 필드는 별도 보관하지 않음 (N4-15). broadcast DeliveryAttempt.id 자체가 식별자. DeliveryResult 합성 시 `broadcastDeliveries[].broadcastAttemptId = broadcast attempt.id`로 매핑.

### 14.5 `NotificationInbox` (in-app)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `recipientId` | Ref<C-23> | ✅ | |
| `payloadId` | UUID | ✅ | FK |
| `notificationLogId` | UUID | ✅ | |
| `eventType` | NotificationEventType | ✅ | |
| `contentRef` | string | ✅ | |
| `contentTitle` | string | ✅ | |
| `ctaUrl` | URL | ✅ | |
| `criticality` | enum | ✅ | |
| `createdAt` | Date | ✅ | |
| `readAt` | Date | optional | |

**Constraints**: `FK payloadId ON DELETE RESTRICT`. `UNIQUE(payloadId)`.
**Index**: `(recipientId, readAt)`, `(recipientId, createdAt DESC)`.
**inactive UI 정책**: § 5.3 (NT-16 운영).

### 14.6 `NotificationLog` (envelope 단위 메트릭)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `instanceId` | Slug | ✅ | |
| `eventId` | string | ✅ | |
| `sourceEventId` | string | ✅ | |
| `eventType` | NotificationEventType | ✅ | |
| `contentRef` | string | ✅ | |
| `criticality` | enum | ✅ | |
| `acceptedAt` | Date | ✅ | |
| `completedAt` | Date | optional | |
| `summary` | `{delivered, failed, deferred, deduped, skipped, broadcast: number}` | ✅ | |

**Constraints**: `UNIQUE(eventId)`, `UNIQUE(instanceId, sourceEventId)`.
**Index**: `(instanceId, sourceEventId)`, `(eventType, acceptedAt)`, `(completedAt)`.

### 14.7 `NotificationDigestBucket` + `NotificationDigestBucketPayload` (join table)

**NotificationDigestBucket**:
| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketKey` | string | ✅ — `digest:{recipientId}:{policyKey}:{cadenceWindow}` |
| `recipientId` | Ref<C-23> | ✅ |
| `policyKey` | string | ✅ |
| `cadenceWindow` | string | ✅ — `YYYY-MM-DD` (daily) 또는 `YYYY-Wnn` (weekly) |
| `scheduledFor` | Date | ✅ |
| `digestSentAt` | Date | optional |
| `createdAt` | Date | ✅ |

**Constraints**: `UNIQUE(bucketKey)`.

**NotificationDigestBucketPayload** (join):
| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketId` | UUID | ✅ — FK NotificationDigestBucket ON DELETE CASCADE |
| `payloadId` | UUID | ✅ — FK NotificationPayloadRecord ON DELETE RESTRICT |
| `createdAt` | Date | ✅ |

**Constraints**: `UNIQUE(bucketId, payloadId)`. bucketId CASCADE (bucket 삭제 시 join row만 삭제), payloadId RESTRICT (PayloadRecord 보존 — N3-12 정정).
**Index**: `(scheduledFor, digestSentAt IS NULL)`, `(recipientId, policyKey)`.

### 14.8 `NotificationQuietHoursQueue`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketKey` | string | ✅ — `quiet:{recipientId}:{quietHoursWindowStart}` |
| `recipientId` | Ref<C-23> | ✅ |
| `payloadId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `channel` | enum | ✅ |
| `scheduledFor` | Date | ✅ — quietHours 종료 |
| `releasedAt` | Date | optional |

**Constraints**: `UNIQUE(payloadId, channel)`.
**Index**: `(scheduledFor, releasedAt IS NULL)`.

### 14.9 `NotificationBusinessHoursQueue`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketKey` | string | ✅ — `business:{recipientId}:{instanceId}:{locationRef}:{releaseAt}` |
| `recipientId` | Ref<C-23> | ✅ |
| `payloadId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `channel` | enum | ✅ |
| `locationRef` | string | ✅ |
| `scheduledFor` | Date | ✅ |
| `releasedAt` | Date | optional |

**Constraints**: `UNIQUE(payloadId, channel)`.
**Index**: `(scheduledFor, releasedAt IS NULL)`.

### 14.10 `NotificationDedupeCache` (Redis SoT)

```
키: notif:dedupe:{instanceId}:{sourceEventId}:{recipientId|"broadcast"}:{channel}
값: { state: "failed-retrying" | "delivered" | "failed-permanent", payloadId, attemptedAt }
원자 연산: SET key value NX EX <ttl>
TTL:
  failed-retrying: dedupeWindowSeconds + 300
  delivered·failed-permanent: dedupeWindowSeconds
```

### 14.11 `NotificationDeadLetter` + `NotificationDeadLetterAttempt` (join table)

**NotificationDeadLetter**:
| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `notificationLogId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `payloadId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `failingChannel` | enum | ✅ |
| `failureClassification` | enum | ✅ — permanent |
| `firstFailedAt` | Date | ✅ |
| `lastResendBy` | string | optional |
| `lastResendAt` | Date | optional |
| `resolvedAt` | Date | optional |
| `expiresAt` | Date | ✅ — 기본 30일 |

**Constraints (PostgreSQL 기준)**:
```sql
CREATE UNIQUE INDEX notification_dead_letter_active_unique
  ON notification_dead_letter (payload_id, failing_channel)
  WHERE resolved_at IS NULL;
```
(다른 DBMS는 generated column `isActive`로 대체 — N3-18 정정)

**Index**: `(expiresAt)`, `(resolvedAt IS NULL, firstFailedAt)`.

**NotificationDeadLetterAttempt** (join — N3-19 신설):
| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `deadLetterId` | UUID | ✅ — FK NotificationDeadLetter ON DELETE CASCADE |
| `attemptId` | UUID | ✅ — FK NotificationDeliveryAttempt ON DELETE RESTRICT |
| `createdAt` | Date | ✅ |

**Constraints**:
- `UNIQUE(deadLetterId, attemptId)` (deadLetter 내 동일 attempt 중복 방지)
- **`UNIQUE(attemptId)`** — 1개 DeliveryAttempt는 정확히 1개 DLQ에만 속함 (N4-25 정정). 여러 DLQ 연결 의미 모호 회피

> NotificationDeliveryAttempt 보존 ≥ DeadLetter 보존 + `logRetentionDaysAfterDlqExpiry`. join FK가 RESTRICT라 보존 순서 강제.

#### 14.11.1 다른 DBMS (MySQL 등) 대체 schema (N4-26)

PostgreSQL partial unique index 미지원 DBMS에서는 generated column + 일반 unique constraint로 대체:

```sql
-- NotificationDeadLetter 추가 컬럼 (MySQL 5.7+/MariaDB 등 generated column 지원):
-- 활성 DLQ는 1 (resolved 안 됨), 종결된 DLQ는 NULL (unique 제약 무시) — N5-05 정정
activeKey INT GENERATED ALWAYS AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END) STORED,
UNIQUE KEY notification_dead_letter_active_unique (payloadId, failingChannel, activeKey)

-- 결과:
--   - activeKey=1 row가 (payloadId, failingChannel)별 0~1건 (active DLQ unique)
--   - activeKey=NULL row(resolved 이력)는 unique 제약에서 무시 — MySQL NULL은 unique 충돌 발생 안 함, 다수 보존 허용
```

---
