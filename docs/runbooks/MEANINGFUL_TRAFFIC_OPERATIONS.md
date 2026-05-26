# MEANINGFUL_TRAFFIC_OPERATIONS.md

> MEANINGFUL_TRAFFIC_LOOP_PLAN v1.0 § 9 task #6 산출물. 본 plan v1 안 코드 외 운영 매뉴얼 (MTL-DEFER-11). 4 part outline — 실 운영 시점 운영자가 단계별 적용.

## 1. 5 채널 안내 문구 (Traffic Seed Kit · MTL-DEFER-03 운영 매뉴얼)

자동 발송은 NF-DEFER-02 (notifications SMS/카카오 채널 adapter) 본 구현 후. v1 안 운영자 수동 발송 — 아래 5 문구 템플릿을 그대로 사용.

### 1.1 상담 후 안내 문자

```
[다이트한의원 인천 부평점]
상담 감사합니다. 진료 전 확인하실 내용을 정리했어요.
· 다이어트 한약 부작용 안내: https://<site>/insights/health/diet-side-effects
· 시술 진행 절차: https://<site>/treatments/diet-herbs
문의: 카카오 채널 @glitzy
```

### 1.2 예약 완료 메시지

```
[예약 완료] 다이트한의원 진료가 확정됐습니다.
· 진료 전 준비: https://<site>/treatments/diet-herbs#preparation
· 변경/취소: 02-XXX-XXXX
```

### 1.3 진료 후 회복 가이드

```
[다이트한의원] 진료 잘 마치셨습니다.
· 회복 가이드: https://<site>/insights/recovery/post-treatment
· FAQ: https://<site>/faq
```

### 1.4 카카오 채널 자동응답

운영자가 카카오 채널 관리자 안 자동응답 안 아래 link 묶음 설정:
- 진료 안내 → `/treatments`
- 부작용/주의사항 → `/faq#side-effects`
- 비용 안내 → `/treatments/diet-herbs#cost`
- 1:1 비밀 상담 → `/community/consultation`

### 1.5 네이버 플레이스 소식

네이버 플레이스 안 "소식" 영역 안 주간 1회 게시 권장:
- 신규 콘텐츠 (`/insights` 안 신규 article) 의 첫 1 문단 + link
- 시술 안내 페이지 link

## 2. 5 Naver 체크리스트 (Naver Distribution Checklist · MTL-DEFER-07)

운영자 일상 점검 항목. UI 합류 (`/admin/<slug>/distribution-checklist`) 는 별 cycle.

| # | 항목 | 점검 방법 | 빈도 |
|---|---|---|---|
| 1 | 네이버 서치어드바이저 등록 + 사이트 인증 | https://searchadvisor.naver.com 안 본 도메인 등록 + meta tag 인증 | 1회 (setup) |
| 2 | 네이버 플레이스 대표 URL | 플레이스 관리자 안 "기본 정보" 안 공식 사이트 URL 등록 | 1회 (setup) |
| 3 | 네이버 블로그 글 안 사이트 link | 신규 블로그 글마다 본문/하단 안 관련 상세 페이지 link | 주간 |
| 4 | sitemap.xml + robots.txt | `/sitemap.xml` 응답 200 OK · `/robots.txt` 안 Allow / Disallow 정합 | 월간 |
| 5 | 주요 페이지 색인 상태 | 네이버 서치어드바이저 안 "색인 현황" 안 미색인 페이지 확인 | 월간 |

## 3. 5 인용 자산 (Local Topic Pack · MTL-DEFER-02 콘텐츠 매뉴얼)

`topic_seed` table 자동 생성 합류는 v4. v1 안 운영자 수동 작성.

| 유형 | 예시 | 본 솔루션 안 entity |
|---|---|---|
| 체크리스트 | "다이어트 한약 시작 전 확인 5가지" | Article (category=guides) |
| 비교표 | "다이어트 한약 vs 식욕억제제 7항목 비교" | Article (category=comparisons) |
| 관리표 | "치료 전후 6주 관리 가이드" | Article (category=after-care) |
| 부작용 대응 | "다이어트 한약 부작용 5종 + 대응" | FAQ + Article |
| FAQ | "출산 후 다이어트 한약 가능 여부 등 long-tail Q" | FAQ |

## 4. 개인정보처리방침 추가 권장 문구

`legal_document` 안 `privacy-policy` template 안 운영자가 수동 추가 권장. v1 안 자동 통합 X (MTL-CASCADE-04).

### 4.1 트래킹 항목 (수집·이용·보관)

```
[행위 데이터 수집 안내]
본 사이트는 운영 개선을 위해 다음 행위 데이터를 수집합니다.
· 수집 항목: 전화 클릭 · 카카오 클릭 · 예약 클릭 · 상담 폼 시작/완료 시점 + 페이지 경로
· 수집 방법: 자체 beacon (외부 분석 서비스 미사용)
· 수집 ID: anonymized session token (개인 식별 불가 · sha256 + 일자 salt rotation)
· 미수집 항목: IP · raw User-Agent · 쿠키 식별자 본체 · 폼 입력 내용
· 보관 기간: 180일 (이후 referrer host · User-Agent family · UTM 등 raw 컬럼 NULL update · 집계 통계 무기한)
· 위탁/제공: 외부 위탁 없음 · 제3자 제공 없음
· 동의: 본 항목은 가명정보 (PIPA 제2조제1호의 가명정보 정합) 라 별도 쿠키 동의 게이트 없음
```

### 4.2 향후 추가 합류 시 (v2+)

- page_view event 자동 트래킹 합류 시 (MTL-DEFER-08) → 본 항목 안 "방문 페이지" 추가
- 광고 attribution 합류 시 (MTL-DEFER-01) → "UTM/gclid/fbclid 안 광고 캠페인 ID" 추가
- consent banner 합류 시 (MTL-DEFER-09) → "쿠키 동의 게이트" 항목 신설

## 5. 네이버 플레이스 연결 안내 (NAVER_PLACE_PLAN v1.0)

운영자가 ClinicProfile 안 네이버 플레이스 URL · placeId 입력 시 — 사이트 footer + contact 페이지 안 link + JSON-LD sameAs (Organization · MedicalClinic) 자동 노출.

### 5.1 placeId 추출

1. 네이버 플레이스 안 사업장 등록 (https://smartplace.naver.com 안)
2. 플레이스 상세 페이지 URL 복사 — 예 `https://map.naver.com/v5/entry/place/1234567890`
3. URL 안 마지막 segment 안 placeId 추출 (예 `1234567890`)

### 5.2 어드민 입력 (metadataJson textarea)

`/admin/<slug>/clinic-profile` 안 metadataJson textarea 안 기존 JSON 안 `naverPlace` 키 추가:

```jsonc
{
  "treatmentPillars": [ /* 기존 */ ],
  "standardPrinciples": [ /* 기존 */ ],
  "keyStats": [ /* 기존 */ ],
  "systemStrengths": [ /* 기존 */ ],
  "sectionCopy": { /* 기존 */ },
  "localKeywords": [ /* 기존 */ ],
  "naverPlace": {
    "placeId": "1234567890",
    "placeUrl": "https://map.naver.com/v5/entry/place/1234567890"
  }
}
```

### 5.3 허용 host whitelist

- `map.naver.com` · `m.place.naver.com` · `pcmap.place.naver.com` · `naver.me`
- 위 외 host 입력 시 — silent fallback (사이트 link 미렌더 · 에러 표시 없음)
- placeId 형식 `^\d{6,12}$` (6~12자리 숫자) 외 입력 시 동일 silent fallback

### 5.4 시각 검증

- 사이트 footer "연락처" column 안 "네이버 플레이스 ↗" link 노출 확인
- `/<instanceSlug>/contact` 안 "네이버 플레이스" dl item 노출
- view-source 안 `<script type="application/ld+json">` 의 `@graph` → Organization · MedicalClinic 양쪽 `sameAs` 배열 안 placeUrl 포함

## 6. 운영 SLA 권장

- **Traffic Seed Kit 발송**: 주 1회 (네이버 플레이스 소식) · 상담/예약 직후 (문자/카카오)
- **Naver Checklist 점검**: 월 1회 (3·4·5번 항목 정합)
- **인용 자산 작성**: 주 1건 권장 (long-tail 1 article 또는 FAQ 5건)
- **대시보드 ConversionTrafficCard 확인**: 주 1회 — 7일 5 event count 추세
