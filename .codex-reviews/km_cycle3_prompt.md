# 자동 비평 의뢰 — `docs/features/keyword-monitoring.md` v0.3 (3차 사이클)

## 컨텍스트

v0.2의 9개 지적 전건 수용 → v0.3. 주요 도입:
- DATA_MODEL C-08 KeywordMonitoringConfig.serpCrawler v1.0 build fail 정정 (legalApproved 무관)
- KeywordTrackingTarget partial unique `WHERE active=true` + reactivate 정책
- rank-bucket outbox sourceId=transitionEventId (hash 산식 명시) — 동일 target 후속 transition 정상 enqueue
- migration v0.2→v0.3 정책 § 10.3 — targetSearchEngines 배열 분해·queryHash 재계산·FK 승계
- correlatedSearchVisibilityAnomalyId 매핑 정확화 (insert 직전 1회 lookup·다건 매칭 우선순위)
- § 3.1.1 audit log contract — 4종 AuditAction의 contentRef·metadata shape
- zeroBaselinePolicy enum first-observed·hold만 허용 (spike 제거) + build fail
- ctr-up dashboard 표시 규칙 (queryKeywordSignals 포함·notify=false 구분)
- SEARCH_ENGINE_TO_ANALYTICS_SOURCE 명시 매핑 테이블 + exhaustive build validation

## 의뢰

v0.3을 다시 엄정하게 비평하라. 2차 정정의 새 모순과 잔재 빈틈 점검:

1. **v0.2 정정의 새 모순**:
   - partial unique `WHERE active=true`가 다른 DBMS에서 generated column으로 대체될 때 reactivate 로직 정합 (UPDATE 시 active=true·registeredAt 갱신 — 기존 ID 유지)
   - rank-bucket-transition outbox sourceId=transitionEventId — KeywordRankBucketState.lastTransitionEventId 갱신과 outbox UNIQUE 제약 race condition 가능성
   - migration § 10.3 운영 액션 `migrateKeywordTrackingTargetsV02toV03`이 KM-16 audit cascade 후속 — v1.0 마감 시점 audit 누락 영향
   - correlatedSearchVisibilityAnomalyId lookup transaction 경계 — KeywordAnomalyRecord insert와 search-visibility AnomalyRecord 조회가 동일 transaction이면 cross-Feature read 권한 정합

2. **detector·dedupe 정합 (v0.3 강화)**:
   - zeroBaselinePolicy "first-observed"·"hold" 외 향후 추가 (예: "spike-rules") 시 cascade — patternlearning이 가능한가
   - ctr-up이 outbox 미enqueue + dashboard 표시는 read API anomalyInWindow에 포함 — read API metadata enum에 `notify=false` 필드 추가 명시 부재
   - SEARCH_ENGINE_TO_ANALYTICS_SOURCE 매핑이 코드 상수면 변경은 패키지 MAJOR — search-visibility approvedScope.searchEngines와 정합

3. **migration·audit 운영 영향**:
   - § 10.3 migration은 v0.1·v0.2 운영 데이터 보유 인스턴스 한정 — 신규 인스턴스에는 영향 없음 명시
   - KM-16 audit (`keyword-tracking-target-migrated-v02-v03`)을 v1.0 마감 후 v1.x patch cascade로 분리해도 안전한지

4. **build fail 룰 완전성**:
   - § 11.1 신규 build fail 룰 — 모든 v0.3 정정 사항이 검증 대상에 포함
   - § 1.1 변경 정책 ↔ § 11.1 build fail 룰 정합

5. **v1.0 마감 가능성 점검**:
   - 잔류 미결정 (KM-01·02·03·04·05·06·07·14·15·16) 분류 — 운영·인프라·M2+/M3+·v1.x patch 후속으로 적절
   - cascade 동반 변경 (REVIEW_WORKFLOW·DATA_MODEL) 정합
   - 5차 마감 도달 가능성 — 3차 잔류 finding 수 예상

## 출력 형식

이전과 동일 JSON 스키마. status에 `closeableAfterPatch` 또는 `needs-fourth-cycle` 평가 포함 권장.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\keyword-monitoring.md` (v0.3)
- `C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md`
- `C:\Users\assag\solution\website-exposure\docs\features\analytics-reporting.md`
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
