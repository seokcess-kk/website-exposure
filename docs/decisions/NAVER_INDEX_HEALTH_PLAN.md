# NAVER_INDEX_HEALTH_PLAN (v0.0·stub·deferred·2026-06-01)

> **상태**: **stub — 미착수 / deferred.** NAVER_SEARCH_INGEST_PLAN NSI-DEFER-01 (OpenAPI client) 폐기 결정(2026-06-01)에서 분리된 항목. 네이버 공식 API 가 키워드 분석은 제공하지 않지만 **색인/수집 현황**은 제공하므로, 그 부분만 별도 진단 가치로 떼어 둔다. 착수 전 사용자 NSA 콘솔 권한으로 API 실 가용성 재검증 필요.

## 배경

NAVER_SEARCH_INGEST_PLAN 의 측정 루프는 "네이버에서 어떤 키워드로 노출·클릭되는가"를 paste 로 충족했다. 그러나 **"노출이 0인 게 콘텐츠 문제인가, 애초에 네이버가 우리 페이지를 색인하지 않은 것인가"**는 구분하지 못한다. 이 진단은 키워드 데이터가 아니라 색인/수집 상태 데이터가 필요하다.

네이버 서치어드바이저 공식 API 가 실제로 제공하는 것 (키워드 분석 ❌):
- 사이트 소유확인
- 사이트맵 / 개별 웹페이지 수집 요청
- 크롤링·인덱스 현황 요약 (페이지 색인 여부 등)

## 잠정 범위 (착수 시 cycle 0 에서 확정)

- **G0 gate** — 사용자 NSA 콘솔에서 API key 발급 + 색인/수집 현황 endpoint 의 실 응답 형식 sample 확보. (이게 없으면 본 plan 진입 불가 — NSI-DEFER-01 가 폐기된 이유와 동일한 함정 회피.)
- 색인 현황 주기 조회 → `search_property` 또는 신규 entity 에 "네이버 색인 상태" 저장.
- visibility-metrics 페이지 안 "네이버 색인 헬스" 표시 — 노출 0 + 미색인 → "색인 요청 필요" actionable signal.

## 비범위

- 키워드 노출·클릭·CTR (paste 경로가 영구 담당 — NAVER_SEARCH_INGEST_PLAN).
- Google 색인 현황 (GSC 가 별도 담당).

## 의존

- NAVER_SEARCH_INGEST_PLAN — source/property 모델 재사용.
- 착수 우선순위는 CAI/CCAL/MTL/NPL-DEFER 대비 낮음 (진단 가치는 있으나 paste 가 핵심 측정을 이미 충족).
