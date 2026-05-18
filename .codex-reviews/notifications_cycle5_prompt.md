# 자동 비평 의뢰 — `docs/features/notifications.md` v0.5 (5차 사이클·v1.0 마감)

## 컨텍스트

v0.4의 30개 지적을 전건 수용하여 v0.5 정리. 본 사이클은 **5차 마감 사이클** — v1.0 안정판 도달 목표.

v0.5의 주요 도입:
- 트랜잭션 abort 원인 분기 — unique violation만 idempotent, 그 외 retryable error
- duplicate caller receiptState별 응답 계약 (500ms poll)
- DeliveryAttempt advisory lock SoT (`pg_advisory_xact_lock`) + provider 호출은 lock·transaction 밖
- `UNIQUE(payloadId, channel, attemptNumber)` — dedupeMode unique 제외
- fallback immediateChannels 제약 + fallback 실패 두 attempt 기록 + fallbackExhausted 메타
- 두 축 분리: 패키지 SemVer ↔ policyVersion
- policyVersion 12개월 보관·deprecation 절차·build fail 메시지
- DigestConditionField cascade 규칙·exists/notExists deep path 평가·default 유일성 검증
- broadcast PayloadRecord envelope+channel 단위 1건. broadcast-placeholder는 DB row 아닌 합성값. broadcastAttemptId = broadcast DeliveryAttempt.id
- holidayCalendar 연간 minor + 임시공휴일 patch + external-api override
- businessHours 90일 탐색 한계
- invalid locationRef → `skipped-missing-location` DeliveryStatus 신규
- 운영자 수동 unsuppress command + audit `notification-suppression-unsuppressed`
- soft → hard 전이 우선
- 큐 worker 중복 발송 방지 정확한 쿼리·partial index
- inApp 단일 transaction Inbox+Attempt 원자성
- DeadLetterAttempt UNIQUE(attemptId) — 1 attempt 1 DLQ
- MySQL generated column 대체 schema
- notification-read actorRole = instanceMemberships 현재 instance role
- AdminUserRole `"system"` 추가 cascade
- multi-location + main 부재 fail 격상

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\notifications.md` v0.5를 v1.0 안정판 도달 직전 마지막 비평으로 점검하라.

**5차 사이클 가이드**: 이전 사이클의 동일 패턴(SCHEMA_MAPPING·SEARCH_STANDARDIZATION·CONTENT_STANDARDS·RISK_LEVELS·MEDICAL_AD·DESIGN_TOKENS·REVIEW_WORKFLOW·compliance-assistant Feature)에서 5차 사이클은 0-7개 지적이 일반적이며, 마감 가능 수준 도달 여부를 판단한다. 다음 점검:

1. **잔재 모순·문구 충돌**:
   - § 0 한 페이지 요약과 § 14 인벤토리 (11 tables) 정합
   - § 14.4 DeliveryAttempt에서 broadcastAttemptId 필드는 제거됐지만 broadcast 모드 관련 설명 일관성
   - § 14.4 deliveryMode enum (perRecipient·broadcast — broadcast-placeholder 제거됨)이 본문 다른 영역과 정합
   - § 12 미결정 vs § 13 변경 이력 정합
   - 새로 추가된 `skipped-missing-location` DeliveryStatus가 § 3.2 enum과 § 4.1 흐름에 빠짐없이 반영

2. **v0.5 신규 정정이 새 모순 생성하지 않았는지**:
   - § 4.1 fallback 두 attempt 기록 정책이 § 14.4 UNIQUE(payloadId, channel, attemptNumber) constraint와 충돌하지 않는지 (원 채널·fallback 채널은 channel이 다르므로 별 문제 없을 듯)
   - § 4.4 lock 밖에서 provider 호출 → 별도 transaction에서 attempt update 흐름이 § 6.4 큐 worker 쿼리(`status IN (...)` 검사)와 정합 (lock 해제 후 provider 호출 중에는 attempt status="processing"으로 보일 텐데 큐 worker가 이를 "이미 처리 중"으로 정상 인식)
   - § 7.4 운영자 수동 unsuppress observedCount=0 reset이 § 7.1 atomic compare-and-set threshold 1회 alert 정책과 충돌하지 않는지

3. **명세 자체의 단독 구현 가능성** — v1.0 안정판 기준:
   - 본 문서만으로 단독 구현이 가능한 수준인지
   - 모든 미결정(NT-XX)이 운영 결정·M2+·v1.x 후속 영역으로 적절히 분류되어 v1.0 안정판 도달을 막지 않는지
   - cascade 동반 변경 (REVIEW_WORKFLOW·DATA_MODEL) 정합성

4. **외부 문서 정합성** — 5차 사이클에서 발견 시 점검:
   - REVIEW_WORKFLOW § 9.1.1 매트릭스의 fallback 컬럼이 본 문서 모든 영역에서 일관 참조
   - REVIEW_WORKFLOW § 10.2.1 audit enum 4종이 본 문서 모든 audit 기록에서 정확히 사용
   - REVIEW_WORKFLOW § 11.1 AdminUserRole "system" 추가가 audit log actor·자동 트리거에서 정확히 사용
   - DATA_MODEL C-08·C-23 v0.13 cascade가 본 문서 의존성과 정합

## 출력 형식

이전과 동일 JSON 스키마.

5차 사이클은 v1.0 안정판 마감을 결정하는 사이클. 0개 지적이면 즉시 v1.0 도달. 1-7개 지적이면 마감 가능 수준으로 보고 reviewer 판단을 제시.

## 참고할 SoT 문서 경로

- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md` (대상 — v0.5, v1.0 안정판 도달 후보)
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\ARCHITECTURE.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\RISK_LEVELS.md`
