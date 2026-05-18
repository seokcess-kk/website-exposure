# 자동 비평 의뢰 — `docs/features/notifications.md` v0.2 (2차 사이클)

## 컨텍스트

v0.1에 대한 1차 비평(22개 지적)을 전건 수용하여 v0.2로 정리. cascade 동반:
- `docs/admin/REVIEW_WORKFLOW.md` § 9 — NotificationEventType canonical enum, § 9.1.1 이벤트 정책 매트릭스, NotificationEvent envelope + NotificationPayload per-recipient 분리, sourceEventId idempotency 계약, `blocked-correction-required` 추가
- `docs/admin/REVIEW_WORKFLOW.md` § 10 — AuditAction에 `notification-dispatched` 추가, NotificationLog와 분리 SoT 명시
- `docs/admin/REVIEW_WORKFLOW.md` § 3.3 — § 9.1.1 매트릭스 정렬
- `docs/core/DATA_MODEL.md` C-08 v0.13 — `adminBaseUrl`(URL)·`timezone`(IANATimezone) 신설, `notificationChannels` 확장(`NotificationChannelsConfig`)
- `docs/core/DATA_MODEL.md` C-23 신설 — `AdminUser` (id·email·role·approverRoleEligibility·eligibilityEvidence·slackUserId·timezone·notificationPreferences·instanceMemberships·active)

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\notifications.md` v0.2를 다시 엄정하게 비평하라. 1차 사이클에서 놓친 항목과 새로 도입된 § 14 데이터 구조·idempotency·businessHours·broadcast 모드 등을 중심으로:

1. **1차 수용 결과의 잔재·내부 모순** — 22개 지적이 전건 수용되었지만 다음을 점검:
   - § 4.1 실행 순서가 idempotency·fan-out·필터·dedupe 순서를 정확히 표현하는지
   - § 9.1.1 매트릭스의 dimension(즉시 채널·digest 주기·criticality·quietHoursPolicy·optOutPolicy)이 § 4.1·§ 6·§ 8 구현 영역에서 빠짐없이 사용되는지
   - DeliveryStatus 11종이 § 4·§ 5·§ 6·§ 7·§ 8 흐름과 빠짐없이 매핑되는지
   - NotificationEvent envelope vs NotificationPayload per-recipient 분리가 § 3·§ 5·§ 14 일관되게 적용되는지
   - C-23 AdminUser 필드(timezone fallback, eligibilityEvidence)가 실제 발송 흐름에서 활용되는지
   - C-08 cascade 필드(adminBaseUrl·timezone·notificationChannels 확장)가 빌드 검증·운영 흐름에서 정합하는지

2. **§ 14 내부 데이터 구조의 구현 안정성** — admin DB 테이블 7종:
   - NotificationInbox·Log·DeliveryAttempt·DeadLetter·DigestBucket·QuietHoursQueue·BusinessHoursQueue·DedupeCache
   - 인덱스·unique constraint·외래키 정합·N+1 위험·idempotency 안정성
   - resendDeadLetter 흐름에서 NotificationLog와 DeliveryAttempt의 연결 안정성
   - DigestBucket의 `payloadIds[]` vs DeliveryAttempt의 `payloadId` 정합

3. **이벤트 정책 매트릭스(§ 9.1.1)와 구현 분기**:
   - 매트릭스를 "코드 상수로 import"한다는 정책이 실제 운영 변경(MAJOR 버전)을 정합하게 반영하는지
   - criticality=critical 이벤트의 모든 필터 우회 정책이 일관된지 (quietHours·businessHours·opt-out·dedupe 등)
   - `의료법 개정 stale`이 mandatory + digest 일일 발송이라는 특수 분기가 매트릭스 + § 6.3 + § 8 정책에서 모순 없이 표현되는지
   - blocked-correction-required의 수신자에 "작성자"가 포함되는데 작성자 식별은 어디서 오는지

4. **dedupe·idempotency 알고리즘 안정성**:
   - § 4.3 dedupe key(`sourceEventId + recipientId + channel`)와 § 14.6 NotificationDedupeCache 키의 일치
   - failed-permanent → dedupe key 즉시 만료 → 재시도·수동 재발송 흐름의 정합
   - notify() idempotency가 NotificationLog 조회 기반인데 NotificationLog 미존재 시 fan-out 시점 race condition 발생 가능성
   - dedupe와 idempotency 두 layer의 책임 분리 명확성

5. **운영시간·timezone 처리**:
   - LocationProfile.businessHours가 multi-location 인스턴스에서 어느 location 기준인지
   - § 8.4 client-approver businessHours 정책이 휴진·공휴일·예외 운영시간을 다루는지
   - § 6.1 missed run + DST 처리가 IANA 표준과 정합한지

6. **외부 monitoring sink·rate limiting·DLQ 운영**:
   - § 7.3 externalMonitoringSink와 § 4.4 rate limiting의 alert 사이클 명확성
   - DLQ 보존 30일(NT-12)과 NotificationLog 보존(NT-13) 정합
   - hard bounce → AdminUser.active 자동 처리 가능성(NT-14)

7. **명세 자체의 정합성·문서 표현**:
   - § 0 한 페이지 요약 ↔ § 3 ↔ § 4 ↔ § 9.1.1 ↔ § 14 일관성
   - § 1.1 변경 정책 ↔ 다른 절의 실제 변경 영향
   - 잔재 문구·미해소 미결정 표시(NT-XX)·표 컬럼 정합

## 출력 형식

이전 사이클과 동일 JSON 스키마:

```json
{
  "summary": "전체 평가 한 문단",
  "findings": [
    {
      "id": "F-1",
      "severity": "fail | major | minor",
      "section": "§ 번호 또는 절 제목",
      "location_quote": "지적 대상 원문 1~2줄 인용",
      "issue": "무엇이 문제인가",
      "rationale": "왜 문제인가 (SoT 정합·구현 안정성 등)",
      "suggested_fix": "구체적 정정 방향 (필요 시 cascade 동반 변경 명시)"
    }
  ]
}
```

타당한 지적은 모두 제기하라. 1차에서 수용되어 정정된 영역은 그 자체가 새 모순을 만들었는지 점검.

## 참고할 SoT 문서 경로

- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md` (대상 — v0.2)
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md` (모범 사례)
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md` (cascade 동반)
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md` (cascade 동반 — C-08 v0.13·C-23 신설)
- `C:\Users\assag\solution\website-exposure\docs\ARCHITECTURE.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\RISK_LEVELS.md`
