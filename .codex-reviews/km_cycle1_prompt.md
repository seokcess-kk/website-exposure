# 자동 비평 의뢰 — `docs/features/keyword-monitoring.md` v0.1

## 컨텍스트

본 프로젝트는 의료기관 웹사이트 솔루션. 이전에 compliance-assistant·notifications·analytics-reporting·search-visibility Feature 4종이 각각 Codex CLI 5사이클 비평을 거쳐 v1.0 안정판 도달. 본 비평은 5번째 Feature `keyword-monitoring`의 v0.1 초안에 대한 1차 사이클.

본 Feature는 **사용자 지정 N개 키워드 단위** 검색 가시성 모니터링. search-visibility(사이트 전체·자동 query set)의 좁은 영역 대비. analytics-reporting v1.0의 queryNormalizedMetrics에 의존 + serp-crawler 옵션.

ARCHITECTURE § 11.2의 책임 경계:
- keyword-monitoring: 사용자 지정 N개 키워드, 순위·노출·CTR, 알림 빈도 즉시
- search-visibility: 사이트 전체, AI 브리핑·통합 영역·백링크, 추세 변화·이상 감지

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\keyword-monitoring.md` v0.1을 엄정하게 비평하라:

1. **SoT 정합** — 상위/Core/Feature 문서와의 일관성:
   - analytics-reporting v1.0 `queryNormalizedMetrics` 계약과 본 문서 사용 (특히 query dimension·sourceFilter)
   - notifications v1.0 notify() + REVIEW_WORKFLOW § 9.1.1 매트릭스 cascade (신규 8종 이벤트 enum 추가 요구)
   - DATA_MODEL C-08 v0.17 cascade — `keywordMonitoringConfig`·`keywordMonitoringPolicyVersion`(notifications·analytics·search-visibility 동일 패턴) + SerpCrawlerApprovedScope 재사용
   - search-visibility v1.0의 outbox·suppression·rank bucket transition 패턴 차용 — 정확한 차이점 명시

2. **vs search-visibility 책임 경계**:
   - keyword-monitoring은 KeywordTrackingTarget 명시 등록 (search-visibility는 자동 query set)
   - target 단위가 keywordTargetId (search-visibility는 page·query·domain·site)
   - signal 4종 vs search-visibility 4종 비교 — 중복·차이 명확화
   - 두 Feature 동시 활성 시 정합성 (예: 사용자가 search-visibility query에 포함된 키워드를 별도 keyword-monitoring 등록 — 중복 알림 위험)

3. **구현 안정성·운영 빈틈**:
   - KeywordTrackingTarget registerKeyword·unregisterKeyword 운영 흐름·권한·audit log
   - maxKeywordsPerInstance(기본 100) 초과 시 runtime fail vs build fail vs warning
   - signal별 detector 알고리즘 정확성 (rank moving-average vs EWMA·CTR z-score·impressions delta-percentage)
   - signal별 hysteresis와 anomaly suppression ledger의 정합

4. **알림 정책**:
   - improved/spike 계열도 outbox enqueue (search-visibility unifiedRankingPresence first-detected는 enqueue 안 함 — 정책 차이 rationale)
   - severity별 매트릭스 — info·warning·critical 매핑
   - mode="alerting" vs "monitor-only" 분리
   - retroactive command (search-visibility § 7.5 패턴 동일)

5. **데이터 source·serp-crawler 정합**:
   - analytics-derived만으로 운영 가능 (serp-crawler는 옵션)
   - serp-crawler 활성 시 search-visibility blobStorage·artifact·IAM 정책 재사용 가능 여부
   - KeywordMonitoringSerpArtifact 신설 vs search-visibility SerpCrawlerArtifact 공용

6. **cascade 영향**:
   - REVIEW_WORKFLOW § 9.1·§ 9.1.1 — 8종 신규 NotificationEventType 추가 cascade
   - DATA_MODEL C-08 — keywordMonitoringConfig + keywordMonitoringPolicyVersion (v0.17)
   - REVIEW_WORKFLOW § 10.2.1 — `keyword-anomaly-resolution-updated`·`keyword-monitoring-retroactive-enqueue-requested` AuditAction cascade

7. **데이터 모델·정규화**:
   - KeywordTrackingTarget UNIQUE(instanceId, keyword, locale, device) — 동일 키워드 다른 locale·device 분리
   - KeywordSignalSnapshot.sourceUsed enum (analytics-derived·serp-crawler) + analyticsSource(gsc·naver-search-advisor) 분리
   - KeywordRankBucketState `FK ON DELETE CASCADE` — KeywordTrackingTarget 삭제 시 state 정리 정상 동작

8. **명세 자체의 정합성·문구**:
   - § 0 한 페이지 요약 ↔ § 13 인벤토리 (8 tables) 일관성
   - § 1.1 변경 정책 ↔ 다른 절의 실제 변경 영향
   - 미결정 항목 분류(KM-XX)의 적절성

## 출력 형식

다음 JSON 스키마:

```json
{
  "summary": "전체 평가 한 문단",
  "findings": [
    {
      "id": "F-1",
      "severity": "fail | major | minor | critical | high | medium | low",
      "section": "§ 번호 또는 절 제목",
      "location_quote": "지적 대상 원문 1~2줄 인용",
      "issue": "무엇이 문제인가",
      "rationale": "왜 문제인가",
      "suggested_fix": "구체적 정정 방향"
    }
  ]
}
```

타당한 지적은 모두 제기하라.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\keyword-monitoring.md` (대상)
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md` (모범)
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md` (모범)
- `C:\Users\assag\solution\website-exposure\docs\features\analytics-reporting.md` (의존)
- `C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md` (자매 Feature — 패턴 참조)
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\ARCHITECTURE.md`
