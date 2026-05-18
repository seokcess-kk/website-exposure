# 자동 비평 의뢰 — `docs/features/search-visibility.md` v0.1

## 컨텍스트

본 프로젝트는 의료기관 웹사이트 솔루션. 이전에 compliance-assistant·notifications·analytics-reporting Feature가 각각 Codex CLI 5사이클 비평을 거쳐 v1.0 안정판 도달. 본 비평은 4번째 Feature `search-visibility`의 v0.1 초안에 대한 1차 사이클.

본 Feature는 사이트 전체·페이지별 검색 가시성 모니터링 — (a) 노출도 추세, (b) AI 브리핑 인용, (c) 통합 영역 진입, (d) 외부 백링크 변동. analytics-reporting v1.0의 `queryNormalizedMetrics`·`queryDailyUserMeasurements` API에 의존. notifications notify()로 알림 발송.

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md` v0.1을 엄정하게 비평하라:

1. **SoT 정합** — 상위/Core 문서와의 일관성:
   - `features/analytics-reporting.md` v1.0 `queryNormalizedMetrics`·`queryDailyUserMeasurements` API 계약과 본 문서 사용
   - `features/notifications.md` v1.0 notify() 호출 + REVIEW_WORKFLOW § 9.1.1 매트릭스 cascade (신규 5종 이벤트 추가 요구 — 위 ARCHITECTURE.md F-01·F-04·F-07 외부 컨텍스트 정합)
   - DATA_MODEL C-08 `searchVisibilityConfig`(v0.16 cascade) 신설 요구
   - ARCHITECTURE § 11.2 keyword-monitoring vs search-visibility 책임 경계

2. **구현 안정성·운영 빈틈**:
   - 2 엔트리포인트(`runMonitoring()`·`detectAnomalies()`) + read API 의 idempotency·실패 처리
   - source 3종 (analytics-derived·serp-crawler·backlink-source)의 신뢰성·자격증명 관리
   - serp-crawler 법적·ToS 위험 (SV-01 미결정으로 남겨도 운영 시작 가능한가)
   - anomaly detection 알고리즘 정확성·false-positive 완화·streak·suppress 윈도우
   - 신호 4종 정의의 정밀도 (exposureTrend·aiBriefingCitation·unifiedRankingPresence·backlinkChange)

3. **cascade 영향**:
   - REVIEW_WORKFLOW § 9.1.1·§ 9.2 — 신규 5종 NotificationEventType cascade
   - DATA_MODEL C-08 — `searchVisibilityConfig` 신설 + `searchVisibilityPolicyVersion` (notifications·analytics-reporting 패턴)
   - SEARCH_STANDARDIZATION 추가 cascade 필요성

4. **외부 의존성 안정성**:
   - 네이버·Google SERP 크롤링의 IP 차단·DOM 변경 대응
   - Ahrefs·SEMrush·Moz API quota·정확도 비교
   - analytics-reporting 데이터 의존이 schedule 순서·dataCompleteness에 어떻게 영향

5. **신호·anomaly 알고리즘**:
   - rolling-zscore vs EWMA vs percentile 알고리즘별 의료기관 도메인 적합성
   - 28일 window가 짧은 추세 변동에 충분한지
   - zscoreThreshold 2.5의 의료 운영 환경 적합성
   - streak 2일·suppress 24시간 default 정합

6. **데이터 모델·정규화**:
   - VisibilitySignalSnapshot UNIQUE(instanceId, signal, target, date)의 target="site-overall"·page path 혼합 처리
   - AnomalyRecord acknowledged 운영 흐름 — 누가·언제 acknowledged
   - SerpCrawlerArtifact HTML/screenshot blob 저장소 (S3·GCS) — 인스턴스별 격리

7. **명세 자체의 정합성**:
   - § 0 한 페이지 요약 ↔ § 13 인벤토리 ↔ § 4 신호 정의 ↔ § 7 알림 매핑
   - § 1.1 변경 정책 ↔ 다른 절의 실제 변경 영향
   - 미결정 항목 분류(SV-XX)의 적절성

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

- `C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md` (대상)
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md` (모범)
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md` (모범)
- `C:\Users\assag\solution\website-exposure\docs\features\analytics-reporting.md` (의존)
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\core\SEARCH_STANDARDIZATION.md`
- `C:\Users\assag\solution\website-exposure\docs\ARCHITECTURE.md`
