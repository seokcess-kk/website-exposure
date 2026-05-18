# 자동 비평 의뢰 — `docs/features/analytics-reporting.md` v0.1

## 컨텍스트

본 프로젝트는 의료기관 웹사이트 솔루션이며, 이전에 `docs/features/compliance-assistant.md`(첫 Feature)·`docs/features/notifications.md`(두 번째 Feature)가 각각 Codex CLI 자동 비평 5사이클을 거쳐 v1.0 안정판에 도달함. 본 비평은 세 번째 Feature Module인 `analytics-reporting`의 v0.1 초안에 대한 1차 사이클.

본 명세는 GSC·네이버 서치어드바이저·GA4·자체 RUM 등 외부 분석 도구 연동, 데이터 정규화·캐시, 자동 리포트 생성·발송, 다른 Feature(keyword-monitoring·search-visibility)를 위한 데이터 인터페이스, 의료법 일평균 이용자 10만 측정 결과 기록(MA-02)을 담당하는 Feature Module이다.

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\analytics-reporting.md`를 다음 관점에서 엄정하게 비평하라:

1. **SoT 정합** — 상위/Core 문서와의 일관성:
   - `core/SEARCH_STANDARDIZATION.md` § 6.3 PerformanceEvent·§ 7 외부 도구 연동 인터페이스
   - `core/DATA_MODEL.md` C-08 `searchConsoleVerification` + 본 문서가 cascade 요구하는 `analyticsConfig` 신설
   - `core/DATA_MODEL.md` C-10 ComplianceRecord — 일평균 이용자 측정 결과 슬롯 cascade 요구
   - `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 4 (MA-02 v1.0 — 클라이언트 책임)
   - `features/notifications.md` v1.0 — 리포트 발송 인터페이스. 본 문서가 cascade 요구하는 신규 NotificationEventType 3종(`analytics-report-ready`·`media-threshold-reached`·`media-threshold-released`) — REVIEW_WORKFLOW § 9.1.1 매트릭스 cascade 필요
   - 같은 패턴의 모범 사례 — `docs/features/compliance-assistant.md` v1.0, `docs/features/notifications.md` v1.0

2. **구현 안정성·운영 빈틈**:
   - 2개 엔트리포인트(`runCollection()`·`generateReport()`) + `queryNormalizedMetrics()` export의 idempotency·실패 처리
   - 외부 API rate limit·credential 관리·재시도 전략의 안정성
   - GSC 데이터 2-3일 지연·GA4 데이터 1일 지연 등 source별 특성 반영
   - PII 처리(GA4 user ID 익명화·RUM IP 마스킹)의 GDPR·개인정보보호법 정합
   - 일평균 이용자 10만 측정 알고리즘의 정확성 (rolling average 90일)
   - `analytics-report-ready`·`media-threshold-reached`·`media-threshold-released` 신규 이벤트의 매트릭스 위치(criticality·채널·digest·opt-out)

3. **cascade 영향** — 본 명세가 요구하는 상위 문서 변경:
   - DATA_MODEL C-08에 `analyticsConfig` 신설 (sources·collectionSchedule·retentionDays·reportTemplates·mediaThresholdMeasurement·rateLimit)
   - DATA_MODEL C-10 ComplianceRecord에 일평균 이용자 측정 결과 슬롯 추가
   - REVIEW_WORKFLOW § 9.1.1·§ 9.2 NotificationEventType enum 신규 3종 cascade
   - SEARCH_STANDARDIZATION § 6.3·§ 7.3에 추가 측정 이벤트(PageViewEvent·ConversionEvent 등) cascade 가능성

4. **의료 도메인 적합성**:
   - MA-02 일평균 이용자 10만 측정 책임 분리 — Glitzy(측정 데이터 제공자) vs 클라이언트(법적 판단)
   - 임계 도달·해제 이벤트가 사전심의 워크플로(REVIEW_WORKFLOW priorReviewRequired)와 어떻게 연동되는지
   - ComplianceRecord 기록 시점·내용·재검수 트리거 정합

5. **다른 Feature와의 의존성**:
   - keyword-monitoring·search-visibility가 `queryNormalizedMetrics` API를 어떻게 사용하는지
   - 본 Feature 비활성 시 의존 Feature의 정상 동작 불가 처리
   - notifications Feature 비활성 시 reportTemplates 동작 처리

6. **데이터 모델·정규화 스키마**:
   - NormalizedMetricRow의 dimension 조합이 source별 차이 처리 (예: GSC의 query·position vs GA4의 medium·source)
   - `UNIQUE(instanceId, date, source, page, query, country, device, medium)`이 NULL dimension 조합에서 어떻게 동작
   - 보존 정책(retentionDays.raw 90일·normalized 730일)과 GDPR 개인정보 보존 한도 정합

7. **명세 자체의 정합성**:
   - § 0 한 페이지 요약 ↔ § 3 입력/출력 ↔ § 4 실행 순서 ↔ § 14 인벤토리
   - § 1.1 변경 정책 ↔ 다른 절의 실제 변경 영향
   - 미결정 항목 분류(AR-XX)의 적절성

## 출력 형식

다음 JSON 스키마:

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
      "rationale": "왜 문제인가",
      "suggested_fix": "구체적 정정 방향 (필요 시 cascade 동반 변경 명시)"
    }
  ]
}
```

타당한 지적은 모두 제기하라.

## 참고할 SoT 문서 경로

- `C:\Users\assag\solution\website-exposure\docs\features\analytics-reporting.md` (대상)
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md` (모범 사례)
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md` (모범 사례)
- `C:\Users\assag\solution\website-exposure\docs\core\SEARCH_STANDARDIZATION.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\ARCHITECTURE.md`
