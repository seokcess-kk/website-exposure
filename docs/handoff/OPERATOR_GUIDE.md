# 운영자 가이드 — 어드민 사용 절차

> **목적**: Glitzy 의료기관 웹사이트 노출 솔루션의 어드민 안 실제 콘텐츠 입력·운영 절차. 신규 운영자 (병원 마케터·콘텐츠 매니저) 가 단독으로 사이트를 운영할 수 있도록 단계별 가이드.
>
> **작성일**: 2026-05-26 (EXPOSURE_READINESS Phase D — 외부 비평 잔여 4건 흡수)
> **대상**: 의료기관 운영자 · 콘텐츠 매니저 · 신규 합류 마케터
> **선행 자료**:
> - 스키마·구조 → `docs/handoff/MEDICAL_SCHEMA_AND_INFO_ARCHITECTURE.md`
> - 키워드 전략 → `docs/handoff/KEYWORD_URL_MAPPING.md`
>
> **첫 적용 인스턴스**: `demo` (다이트한의원 인천 부평점)

---

## 0. 어드민 접근

http://localhost:3002/admin/demo (dev) 또는 production `https://<domain>/admin/<instanceSlug>` 접근. demo 모드 안 자동 로그인 (env `DEMO_ADMIN_AUTO_LOGIN_EMAIL` 활성 시).

좌측 nav menu 안 주요 entity:
- 대시보드 · 의원 정보 · 의료진 · 시술/진료 · **증상 안내** · 아티클 · FAQ · 키워드 · 개선 큐 · 검색 노출

---

## 1. 신규 instance 셋업 절차

### 1.1 의원 정보 (ClinicProfile)

`/admin/<slug>/clinic-profile` 안 단계별 wizard:

1. **기본 정보**: 이름 · 법인명 · slogan · description · founder · founding date · 로고
2. **연락처 (Primary CTA)**: 전화 · 카카오 · 네이버 예약 등 3~5개 채널
3. **위치 (LocationProfile main)**: 주소 · 좌표 · 영업시간 · 점심시간 · 특별 휴무
4. **법정 문서 (LegalDocument)**: 5종 (개인정보·이용약관·비급여·환불·민원) — auto-generate
5. **C 하이브리드 metadata**: treatmentPillars · standardPrinciples · keyStats · systemStrengths · sectionCopy · **localKeywords** (Phase D 신설)

**Phase D 신설 — `localKeywords` 입력 가이드**:
- 어떤 지역에서 검색에 잡히고 싶은가? (예: "부평 다이어트 한의원", "인천 산후 다이어트")
- 자유 입력 — 5~10개 권장. JSON-LD `Organization.keywords` 로 자동 출력.
- 본문 (Article · Treatment · Condition body) 안 지역명을 자연스럽게 1~2회 포함하면 검색 매칭 향상.

### 1.2 의료진 (DoctorProfile)

`/admin/<slug>/doctors/new`:
- slug · 이름 · 직함 · 약력 · 사진 (Hero + CV)
- **자격·인증·전문분야** (Phase B 신설): 면허 · 전문의 · 인증 · 학회 회원 · 학력 5종 + 자유 전문분야 chip → `hasCredential` JSON-LD 자동 출력

### 1.3 시술/진료 (TreatmentPage)

`/admin/<slug>/treatments/new`:
- slug · 제목 · 요약 (50~160자) · 본문 (Markdown · h2/h3 anchor 자동) · 위험도 · 히어로 이미지
- **Pillar slug 선택** (clinic.metadata.treatmentPillars 안 정의된 4 Pillar 중 1) — 같은 pillar 시술끼리 "관련 진료" grid 노출
- **Principles 안 override** (선택) — 시술 별 KEY_EFFECTS 3-step 변경
- **Evidence Link Panel** (cites · related-to · derived-from) — Publication · Media · 다른 Treatment · FAQ · **MedicalConditionPage** (Phase B 합류) 와 link
- **Keyword Link** — 이 시술이 잡을 키워드 1차 매칭

### 1.4 증상 안내 (MedicalConditionPage · Phase B 신설)

`/admin/<slug>/conditions/new`:
- slug · 증상명 · 요약 · 본문 (Markdown · TOC 자동) · 위험도 · 히어로
- **관련 진료 (Primary Treatment)** — 이 증상의 1차 진료 선택. Condition Detail Hero 안 CTA + Treatment Detail 안 inverse 노출
- **Evidence Link Panel** (Phase D 합류) — 외부 권위 인용 + 다른 entity 매핑

**증상 페이지 작성 표준**:
- h2 = "증상의 특징" · "한방 접근 단계별" · "자주 묻는 질문"
- h3 = 세부 단계 · 주의사항 등
- 본문 안 "부평", "인천" 같은 지역명 자연 1~2회 포함 (local SEO)
- 단정 표현 금지 ("100% 효과", "완치 보장" 등)

### 1.5 아티클 (Article)

`/admin/<slug>/articles/new`:
- slug · 제목 · 요약 · 본문 · 카테고리 (7 신규 cluster + 3 기존)
- **External URL** (외부 매체 보도 시) — site 안 internal detail 페이지 유지 + 큰 "원문 보기" 버튼
- **저자 (Doctor)** — Physician @id cross-reference
- **Evidence Link Panel** — 인용·관련 entity 매핑

#### 카테고리 선택 가이드 (Phase C 신설 7 cluster)

| cluster | 어떤 글 |
|---|---|
| `weight-loss-science` | 다이어트 메커니즘 · 호르몬 · 대사 · 과학적 근거 |
| `lifecycle-diet` | 산후 · 갱년기 · 사춘기 · 노년 등 단계별 |
| `herbal-prescription` | 한약 · 약침 · 처방 가이드 · 임상 사례 |
| `yoyo-maintenance` | 요요 차단 · 사후 관리 · 평생 유지 |
| `body-shape` | 복부 · 하체 · 부분비만 |
| `lifestyle-diet` | 식단 · 운동 · 수면 · 스트레스 통합 코칭 |
| `precautions` | 부작용 · 금기 · 안전성 |
| `general/diet/health` (기존) | 7 cluster 중 어디에도 안 맞을 때 (또는 운영 초기 일반 글) |

### 1.6 논문·미디어 (Publication · MediaAppearance)

`/admin/<slug>/publications/new` · `/admin/<slug>/media-appearances/new`:

#### Publication (Phase D 안 외부 권위 자료 확장)

**자료 유형 (`publication_type`)** 5종:
- `internal-research` — 의료진 자체 논문 (기본값)
- `external-authority` — 학회·기관 가이드 일반
- `government` — 질병관리청·복지부·식약처 등
- `academic-society` — 대한비만학회·한방비만학회 등
- `statistics` — 국가통계·OECD 등

**활용 예**:
- "질병관리청 비만 통계" → publication_type=government · publisher_name=질병관리청
- "대한비만학회 진료 지침" → publication_type=academic-society · publisher_name=대한비만학회
- 의료진 자체 논문 → publication_type=internal-research · 자체 organization 자동

운영자가 외부 자료 link 만 등록해도 schema.org `ScholarlyArticle.publisher` 가 type 별 자동 차별화 (`GovernmentOrganization` · `MedicalOrganization` · `Organization`) — AI 검색 안 인용 신뢰도 ↑.

---

## 2. 콘텐츠 운영 절차 (주간 cycle)

### 2.1 주간 콘텐츠 추가 권장 quota
- Article 1~2건 (cluster 별 균등 분배)
- Condition 0~1건 (월 2~4건 누적)
- Publication / MediaAppearance — 발생 시
- FAQ 5~10건 (월 누적)

### 2.2 신규 글 작성 → 발행 흐름
1. 어드민 안 entity 편집 페이지 → 본문 입력 → 저장 (즉시 published)
2. 사이트 안 `/insights/{cluster}/{slug}` URL 확인
3. JSON-LD validator (https://validator.schema.org/) 안 URL 검수
4. Google Rich Results Test 안 rich snippet 자격 확인
5. 며칠 후 Naver Search Advisor / Google Search Console 안 색인 확인

### 2.3 키워드 등록 → 매핑
1. `/admin/<slug>/keywords/new` 안 키워드 추가 (label · intent · priority)
2. 부모 키워드 묶음 (parent_id self-FK 활용) — 동의어 군집화
3. 키워드 편집 페이지 안 "관련 콘텐츠" 섹션 — entity 5종 (Article · TreatmentPage · MedicalConditionPage · FAQ · Publication · MediaAppearance) row 선택 + 1차 매칭 표시
4. 대시보드 안 `KeywordCoverageCard` 안 매핑 비율 모니터링

자세한 키워드 전략 → `docs/handoff/KEYWORD_URL_MAPPING.md`

---

## 3. Article 재분류 절차 (Phase C cleanup)

Phase C 안 7 신규 cluster 추가. 기존 articles 가 `general` · `diet` · `health` 3개 안 분포. 운영자 재분류 절차:

### 3.1 점진 재분류 방법

1. `/admin/<slug>/articles` 안 list 페이지 진입
2. **기존 `general` · `diet` · `health` 카테고리의 article** 식별 (현재 display_order=100~102 후순위)
3. 각 article 편집 페이지 진입 → "카테고리" select 안 7 신규 cluster 중 1 선택 → 저장
4. 사이트 안 `/insights/{cluster}/{slug}` 새 URL 확인

### 3.2 재분류 추천 매핑

| 기존 article 종류 | 추천 cluster |
|---|---|
| 다이어트 원리·메커니즘 글 | `weight-loss-science` |
| 산후·갱년기·사춘기 글 | `lifecycle-diet` |
| 한약·약침·처방 글 | `herbal-prescription` |
| 요요·유지 글 | `yoyo-maintenance` |
| 복부·하체 등 부분 비만 | `body-shape` |
| 식단·운동·수면 · 일반 건강 | `lifestyle-diet` |
| 부작용·주의사항 | `precautions` |
| 어디에도 안 맞음 | `general` 유지 (또는 글 자체 폐기) |

### 3.3 외부 매체 보도 글 (`external_url` 있음)

언론 매체 본문 주제에 따라 cluster 선택. 본문 짧거나 빈 글이면 cluster 매칭 어려울 수 있음 — 그 경우 `general` 유지.

### 3.4 기존 3 카테고리 폐기 (선택)

모든 articles 가 7 신규 cluster 로 이동한 후, 기존 `general` · `diet` · `health` 카테고리는 어드민 안 삭제 가능. 단, 빈 카테고리는 sitemap 안 자동 제외되므로 즉시 삭제 안 해도 영향 없음.

**SQL 직접 삭제 (선택)**:
```sql
DELETE FROM article_category
 WHERE instance_id = (SELECT id FROM instance WHERE slug = 'demo')
   AND slug IN ('general', 'diet', 'health')
   AND NOT EXISTS (
     SELECT 1 FROM article WHERE article.category_id = article_category.id
   );
```

---

## 4. 외부 검증·모니터링 도구

| 도구 | URL | 용도 | 주기 |
|---|---|---|---|
| schema.org Validator | https://validator.schema.org/ | JSON-LD 구문 + 필수 필드 | 신규 글 발행 후 1회 |
| Google Rich Results Test | https://search.google.com/test/rich-results | rich snippet 자격 | 신규 글 발행 후 1회 |
| Naver Search Advisor | https://searchadvisor.naver.com/ | 네이버 색인·노출 데이터 | 주간 (대시보드 안 NSA paste ingestion) |
| Google Search Console | https://search.google.com/search-console | 구글 색인·노출 데이터 | 주간 (대시보드 안 GSC OAuth sync) |
| 사이트 안 KeywordCoverageCard | `/admin/<slug>` | 키워드 매핑 비율 + won/active/dropped | 주간 |
| 사이트 안 개선 큐 | `/admin/<slug>/improvement-queue` | low-readiness · evidence-missing · stale 글 | 주간 |

---

## 5. 자주 묻는 운영자 질문

### Q1. 즉시 발행 vs 검수 큐는 무엇이 다른가?
demo (현재) 는 즉시 발행 모드 — 저장하면 곧바로 `status=published` + 사이트 노출. 실 production 운영 시 검수 큐 활성화 권장 (사용자 검수 2026-05-20 — `auto-publish-mode`).

### Q2. 의료광고법 표현 가이드?
- 단정형 ("완치 100%", "절대 안전") **금지**
- 비교형 ("최고", "유일한") **금지**
- 가격·할인 ("50% 할인", "이벤트") **금지** (`Discount` schema 자체 출력 안 됨)
- 사례형은 환자 동의 + 익명 처리 필수
- 임신·수유·만성질환 환자 주의사항 표시 필수

### Q3. 외부 매체 보도 article 등록 시?
1. `external_url` 필드에 원문 URL 입력
2. 본문 (body_markdown) 은 발췌만 (또는 비워둠) — 저작권 문제 회피
3. 본문 비어있으면 detail 페이지 안 fallback 안내 박스 + "원문 보기" 버튼 자동 노출

### Q4. 의료진 자격·인증 입력은 필수인가?
필수는 아니지만 입력 강력 권장. 입력하면 schema.org `Physician.hasCredential` JSON-LD 자동 출력 → AI 검색 안 의료진 권위 신호 + E-A-T 강화.

### Q5. 한 의료진 페이지에 논문이 너무 많아요. 어떻게 줄이나요?
Doctor Detail 안 published 5건만 시간순. 추가 논문은 운영자가 `status=draft` 로 비공개 처리하거나 metadata.featured 안 표시.

### Q6. 키워드 difficulty 추정이 어려워요.
KEYWORD_URL_MAPPING.md § 4.3 가이드 + Naver Search Advisor 안 SERP 직접 확인 → 자사 사이트가 상위 30위 안 있으면 difficulty 30~50, 50위 밖이면 50~80.

---

## 6. 운영자 체크리스트

### 6.1 신규 instance launch 시
- [ ] ClinicProfile 5단계 wizard 모두 완료
- [ ] LocationProfile (main) 영업시간 · 좌표 · 연락처 완료
- [ ] LegalDocument 5종 자동 생성 + 발행 확인
- [ ] 의료진 1명 이상 등록 + 자격·인증 입력
- [ ] 시술 1개 이상 등록 (대표 시술)
- [ ] 키워드 10개 이상 등록 (P0 핵심)
- [ ] sitemap.xml 안 모든 URL 노출 확인
- [ ] robots.txt 안 GEO 정책 확인 (AI bot Allow)
- [ ] Naver/Google Search Console 안 사이트 등록

### 6.2 주간 운영
- [ ] Article 1~2건 발행
- [ ] 키워드 매핑 비율 ≥ 80% 유지
- [ ] 개선 큐 안 high-priority 항목 처리
- [ ] Naver/Google Search Console 안 색인·노출 추이 점검

### 6.3 월간 운영
- [ ] won 키워드 점검 (top 3 안 진입)
- [ ] dropped 키워드 정리 (3개월 이상 미진입)
- [ ] Publication / MediaAppearance 신규 발생 시 등록
- [ ] FAQ 신규 추가 (자주 받는 질문)
- [ ] LocalKeywords 갱신 (지역 변화 시)

---

## 7. 변경 이력

- **2026-05-26 (v1.0)**: 최초 작성 (EXPOSURE_READINESS Phase D). 외부 비평 잔여 4건 (#4 외부 권위 citation · #6 로컬 SEO · Phase B 보강 · Phase C 보강) 흡수 시 운영자 가이드 통합 도출. ClinicProfile · DoctorProfile · TreatmentPage · MedicalConditionPage · Article · Publication 6 entity 운영 절차 + Article 재분류 운영자 매뉴얼 + 외부 검증 도구 + FAQ + 체크리스트.
