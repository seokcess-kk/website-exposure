# 자동 비평 의뢰 — `docs/features/keyword-monitoring.md` v0.2 (2차 사이클)

## 컨텍스트

v0.1의 18개 지적 전건 수용 → v0.2. 주요 cascade·도입:
- REVIEW_WORKFLOW § 9.1·§ 9.1.1 — 8종 NotificationEventType + 매트릭스 8행 cascade
- REVIEW_WORKFLOW § 10.2.1 — keyword-monitoring AuditAction 4종 cascade (registered/unregistered·resolution-updated·retroactive-enqueue-requested)
- DATA_MODEL C-08 v0.17 — keywordMonitoringConfig + keywordMonitoringPolicyVersion 신설 (SerpCrawlerApprovedScope 재사용)
- KeywordTrackingTarget.searchEngine 단일 enum 정규화 + UNIQUE(instanceId, keyword, country, device, searchEngine)
- locale → country 매핑 (analytics-reporting QueryDimension 정합)
- queryNormalizedMetrics 호출에 device·country dimension/filter 추가, sourceFilter target.searchEngine 매핑
- v1.0 serp-crawler.enabled=true build fail (KM-14는 v1.x 후속)
- outbox sourceKind/sourceId 일반화 (anomaly·monitoring-log·rank-bucket-state 3종)
- anomalySeverity vs notificationCriticality 컬럼 분리
- algorithm enum moving-average만 (EWMA는 KM-07)
- zero baseline·CTR direction·minBaselineDays·minVariance 정확화
- signal별 dedupe 주체 표 (ledger vs state machine)
- search-visibility 중복 정책 § 0.1 + correlatedSearchVisibilityAnomalyId
- register/unregister soft delete + audit cascade
- maxKeywordsPerInstance drift alert 분리
- § 0.1: search-visibility와 동시 활성 시 중복 정책

## 의뢰

v0.2를 다시 엄정하게 비평하라. 1차 정정의 새 모순·잔재 빈틈 점검:

1. **v0.1 정정의 새 모순**:
   - searchEngine 단일 enum 정규화 + UNIQUE 변경 → migrate 정책 부재
   - country 매핑 정확화 — 다국어 키워드 추적 시 운영 한계
   - sourceFilter `target.searchEngine === "naver" ? ["naver-search-advisor"] : ["gsc"]` — naver/google 외 검색엔진 도입 시 확장 정책 부재
   - outbox sourceKind/sourceId 일반화 후 UNIQUE(sourceKind, sourceId, eventType) — 동일 keyword target에 여러 event 동시 발생 시 중복 방지 정상 동작
   - § 0.1 correlatedSearchVisibilityAnomalyId best-effort 매핑 알고리즘·시점·실패 처리 부재
   - register/unregister soft delete 후 동일 (keyword, country, device, searchEngine) 재등록 시 UNIQUE 충돌 처리

2. **v1.0 serp-crawler build fail 정합**:
   - DATA_MODEL C-08 KeywordMonitoringConfig.serpCrawler 필드는 정의됐는데 v1.0은 enabled=true build fail
   - SerpCrawlerApprovedScope 재사용 명시 — search-visibility와 다른 인스턴스에서 동일 scope 적용 정합
   - v1.x에서 활성 시 KeywordMonitoringSerpArtifact 신설 vs SerpCrawlerArtifact 공용 (KM-14) — v1.0 마감 영향 없음 확인

3. **detector·dedupe 정합**:
   - § 4.2 zeroBaselinePolicy="first-observed" + observedThresholdImpressions 정합
   - § 4.3 keywordCTR direction "ctr-up"은 매트릭스 미포함 — AnomalyRecord만 저장. dashboard에서 어떻게 표시되는지 명세 부재
   - § 7 ledger key에 severity 포함 → warning → critical escalation 처리 (search-visibility 동일 패턴)

4. **outbox·운영 액션**:
   - sourceKind="rank-bucket-state"는 state transition 시 AnomalyRecord와 별개로 outbox row 생성 가능 — § 6.2와 § 4.4 정합
   - registerKeyword·unregisterKeyword의 audit log contentRef·metadata shape 명시 부재
   - retroactive command audit log contentRef는 "instance:{instanceId}" (search-visibility § 7.5 패턴 동일?)

5. **cascade 정합 (외부 문서)**:
   - REVIEW_WORKFLOW § 9.1 enum에 8종 추가됨 검증
   - § 9.1.1 매트릭스에 8행 추가됨 검증
   - § 10.2.1 audit 4종 추가됨 검증
   - DATA_MODEL C-08 v0.17 KeywordMonitoringConfig + keywordMonitoringPolicyVersion 정합

6. **명세 자체의 정합성·문구**:
   - § 0 한 페이지 요약 ↔ § 13 인벤토리 (8 tables) 일관성
   - § 1.1 변경 정책 ↔ 다른 절의 실제 변경 영향
   - § 11 build fail 룰의 v0.2 신규 사유 포함

## 출력 형식

이전과 동일 JSON 스키마.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\keyword-monitoring.md` (v0.2)
- `C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md` (자매 Feature)
- `C:\Users\assag\solution\website-exposure\docs\features\analytics-reporting.md`
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\ARCHITECTURE.md`
