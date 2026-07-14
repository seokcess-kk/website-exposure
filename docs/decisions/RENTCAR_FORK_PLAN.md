# RENTCAR_FORK_PLAN (v2.1 · 2026-07-13 · 장기렌트/리스 범용 버전 신규 프로젝트)

> **상태**: 기획 v2.1 — 리서치 2건(광고 규제·네이버 키워드 생태계) + 적대적 비평 3건(구현 정합성 [코드 67회 대조] · SEO 노출 전략 · 리드/개인정보/규제) 반영 완료. 코드 미착수 — 구현 착수 가능.
>
> **목표**: 현행 의료기관 노출 솔루션을 fork 해 **렌트카(장기렌트/리스) 업종용 신규 프로젝트**를 만든다. 의료 특화 부분을 제거·개조하고, 네이버 노출을 목표로 콘텐츠 DB 관리 + **방문자 견적 문의(리드 캡처)** 를 모두 갖춘 사이트를 구성한다.
>
> **범위 확정 (2026-07-13 사용자 결정)**: ① "DB까지 입력 받는 사이트" = 콘텐츠 DB 렌더링 + 리드 캡처 **둘 다**. ② 타깃 업종 = **렌트카 — 장기렌트/리스**. ③ 디자인은 IA·전환 동선·커스텀 경계까지 기획에서 확정, 비주얼 디테일은 구현 반복.

## 배경

- 현행 repo 는 라이브 클라이언트 2곳(인천·대전)이 걸린 프로덕션. 의료광고법과 렌트/리스 광고 규제(여신전문금융업법·표시광고법)는 룰 내용이 완전히 달라 단일 스키마 유지 실익이 낮다.
- 코드 인벤토리 결과(2026-07-13 탐색 + v2.1 비평 보정): **구조 개조가 필요한 곳은 `compliance_record`(physician/legal 승인자 컬럼 + CHECK)가 핵심**이고, author/related FK 계열(article·faq)의 rename cascade 가 뒤따른다. 나머지 의료색은 (a) 룰 YAML, (b) LLM 프롬프트 문자열, (c) 하드코딩 페르소나 콘텐츠, (d) schema.org 타입, (e) enum 값에 집중 — rename·교체로 범용화 가능.
- 의료 버전 노출 부진의 주 원인은 구조가 아니라 **도메인 전환 리셋 + 신규 도메인 나이**. 다만 그 과정의 교훈(도메인 불변·발행 페이싱·유사문서 방지)을 신규 버전에는 **시스템으로** 박아 넣는다 (§노출 구조 원칙).
- 리드 캡처의 전신이 이미 존재: `consultation_request` 테이블(1:1 상담 폼 INSERT) + `conversion_event`(/api/track 익명 beacon). 견적 폼은 이를 확장한다.

## 결정

**Fork & Strip — 신규 모노레포 + 신규 인프라(Supabase·Vercel·BASE 도메인) 완전 분리.**

| 선택지 | 판정 | 사유 |
|---|---|---|
| A. **Fork & Strip (신규 repo)** | **채택** | 검증된 엔진(RLS·노출 엔진·AI 파이프라인·컴플라이언스 엔진) 즉시 재사용, 라이브 프로덕션 무위험, 빠른 착수 |
| B. 현 repo 안 일반화 (의료를 Preset 강등) | 기각 | 라이브 DB rename 마이그레이션 리스크. 의료/금융 규제 분리 실익 없음. 두 제품 모두 성장한 뒤 공통 커널 추출이 순서 |
| C. 제로 재작성 | 기각 | 검증 자산 폐기 — 비합리 |

부속 결정:

- **RCF-D1 · 도메인 불변**: 신규 BASE 도메인을 첫날부터 최종본으로 취득, 전환 금지 명문화 (의료 버전 최대 손실 = key-mom.kr→onwell.site 리셋). `onwell.site` 공유는 업종 혼합으로 비권장.
- **RCF-D2 · 마이그레이션 스쿼시**: C0001~C0056 이력을 복제하지 않고, 개조 후 최종 스키마를 **신규 베이스라인 C0001 하나**로 굽는다 (§Phase 0-6).
- **RCF-D3 · 컴플라이언스 엔진 유지 + 소폭 확장** (v2.1 비평 반영): `packages/compliance-rules` 엔진(loader/matcher/risk-inference)은 도메인 중립 — 이식하되 **"YAML 만 교체"로는 부족**. 렌트카 룰셋의 두 축이 현 엔진 표현력을 벗어남이 코드 검증으로 확인됨: ① 인스턴스 자격 조건부 룰(#1·#2) — `RiskRule`/`ComplianceCheckInput` 에 인스턴스 설정 입력이 없음 → **`instanceConditions` 필드 + check() 입력에 company_profile 발췌 전달** 확장 필요. ② 부재(absence) 검출형 조건병기 룰 — composite matcher 는 AND 전용(NOT 없음) → 조건병기 계열은 **PriceDisclosure 구조화 필드(RCF-S10)로 일원화**하고, 룰은 "본문 자유 텍스트 가격 표기 감지"(정규식 가능)로 역할 축소. 이 2건은 Phase 0-3 의 명시 작업.
- **RCF-D4 · 승인 워크플로 축소 + client 승인 신규 구현**: physician-reviewer/legal-reviewer 롤 제거 → **operator + client-approver 2롤**. `compliance_record` 승인자 컬럼·CHECK 재정의. **주의 (v2.1 코드 검증): client 승인은 현재 미구현(fail-closed)** — `final-roles.ts` 가 client 롤에 `ComplianceConfigError`(CA-DEFER-10) 를 throw 하고 `client_approver` 컬럼을 채우는 경로가 없다. 즉 이 작업은 "제거"가 아니라 **physician/legal 제거 + client 승인 플로우 신규 구현(CA-DEFER-10 해소)** — 공수 계상 필요. (v1 단순화 대안: client-approver 승인도 operator 가 대행 기록하는 운영 규약으로 시작 가능.)
- **RCF-D5 · 리드 캡처 = 1급 기능**: `consultation_request` → `lead` 로 승격 (drizzle 스키마 편입 + 필드 확장 + attribution 연결). 공개 INSERT 경로는 RLS INSERT-only 정책 + rate limit + honeypot.
- **RCF-D6 · 첫 사이트 성격 = 렌트카 업체 클라이언트용** (2026-07-13 사용자 확정 · 구 OPEN-01): 인스턴스 = 렌트카 업체, 현행 멀티테넌트 모델 유지. 개인정보 구조 — **개인정보처리자 = 클라이언트 업체, Glitzy = 처리 수탁자(시스템 운영 위탁)**. 리드 폼 동의 문구는 업체명(company_profile) 기반으로 렌더링. 인스턴스별 개인정보처리방침(legal_document)에 처리 위탁 관계 명시(§26② 공개 의무). **이와 별개로 클라이언트별 위수탁 계약 문서 체결이 §26① 법정 의무** (v2.1 — 표준 템플릿 1회 작성 후 재사용 · 사용자 액션 ⑥). 계약서에 **재수탁 체인(Supabase·Vercel 등) + 백업 잔존 기간** 명시 (§26⑥ 재위탁 제한은 위탁자 동의 사항). **lead 데이터는 LLM 보조 기능(Anthropic·국외 이전)에 절대 유입 금지** — 코드 레벨 가드로 명문화. 어드민의 리드 상세 열람·export 는 audit_event 기록 (수탁자 접속기록 의무 상응).
- **RCF-D7 · BASE 도메인 = `onrent.kr`** (2026-07-13 권장 확정 · 구 OPEN-02): "on-" 브랜드 패밀리(onwell 의료 ↔ onrent 렌트카) · 6자 · rent 키워드 · `.kr` 신뢰 TLD(의료 `.site` 교훈 — RCF-D1 도메인 불변이므로 처음부터 신뢰 TLD). DNS 1차 필터 통과(NXDOMAIN) · 동명 렌트카 업체 검색 無 · rentree 는 기존 렌탈 플랫폼 '렌트리'와 혼동 리스크로 탈락. **사용자 액션 2건: 레지스트라 실시간 가용 확인 후 즉시 등록 + KIPRIS '온렌트' 상표 확인.** `onrent.co.kr` 은 선점(파킹 추정) — `.kr` 단독 감수. 와일드카드(`*.onrent.kr`)는 Vercel 네임서버 위임 — onwell.site 와 동일 구성.
- **RCF-D8 · 워크스페이스 네임스페이스 = `@onrent/*`** (구 OPEN-04): 도메인 브랜드 준용. Phase 0-1 에서 일괄 치환.
- **RCF-D9 · 차량 카탈로그 정형화 유보** (구 OPEN-03): 초기엔 service_page 본문 + `lead.vehicle_interest` 자유입력으로 흡수. `vehicle` 정형 테이블은 리드가 실제 축적된 뒤(Phase 4 이후) 도입 재검토.
- **RCF-D10 · publication/mediaAppearance 미이식 확정** (구 OPEN-06): 초기 제외. 언론보도 니즈 발생 시 `press` 단일 엔티티로 부활 검토 (Phase 4 이후).
- **RCF-D11 · 리스 취급 게이트** (2026-07-13 규제 리서치 — 부록 A §3 · v2.1 비평 보강): 리스(시설대여)는 금소법상 **대출성 금융상품** — 미등록 업체의 리스 상품 광고·모집은 금소법 제22조 위반 소지(미등록 대리·중개는 5년 이하 징역/2억원 이하 벌금). 게이트는 **상품 페이지·견적 폼·CTA 3면 모두**에 작동해야 한다:
  - ① `company_profile.leaseSales` 를 boolean 이 아닌 **`{registrationNo, verifiedAt, verifiedBy}` 구조**로 신설 (자기신고 boolean 은 분쟁 시 Glitzy 를 보호하지 못함). 온보딩 체크리스트에 여신금융협회 등록번호 대조 명시.
  - ② 미등록 인스턴스: 리스 **상품 페이지** 발행 차단 (부록 A 룰 #1·#2 — RCF-D3 ① 엔진 확장 전제).
  - ③ 미등록 인스턴스: **견적 폼의 `contract_type='lease'` 옵션을 서버·클라이언트 양쪽에서 제거** (클라 조작 대비 서버 액션 거부 포함). 리스 의향 접수 자체가 중개 신호의 최대치.
  - ④ 미등록 인스턴스: 리스 가이드(P2 클러스터)의 **CTA variant 중립화** — 글로벌 고정 견적 CTA(헤더·모바일 바)를 리스 클러스터 페이지에서 억제하거나 "장기렌트 상담" 문구로 전환. 전환 동선의 CTA 배치 표준에 pillar 별 variant 로직으로 명시.
  - ⑤ **게이트 상태 변경(등록 만료·취소) 시**: 플래그 변경 서버 액션이 해당 인스턴스 리스 상품 페이지를 강제 비공개(published→review) + audit_event + sitemap 제거·IndexNow 재제출까지 원자 처리.
  - ⑥ 정보 콘텐츠+CTA 결합의 허용선은 **법률 검토 필요**로 유보 (부록 A §3-5).
- **RCF-D12 · 멀티테넌트 콘텐츠 자기잠식 정책** (v2.1 SEO 비평 — 신규 인지 리스크): 장기렌트 키워드는 **전국·비대면이라 의료(부평/대전)와 달리 지역 분리 축이 없다**. 인스턴스 2호부터 같은 키워드·같은 프롬프트로 생성한 콘텐츠가 `*.onrent.kr` 서브도메인들에 병렬 발행되면 네이버 유사문서 필터가 원본 1개만 남기고, 최악엔 BASE 도메인 전체가 양산 네트워크로 묶인다 (의료 버전은 지역 축이 있는데도 인천·대전 22주제 비중복 설계를 수동으로 해야 했음). **정책: ① 키워드 풀은 인스턴스 간 배타 분할을 기본**(keyword_target 등록 시 BASE 도메인 내 타 인스턴스 중복 경고 — super-admin 교차 조회), **② 콘텐츠 차별화 축 강제**(업체 실데이터·취급 차종·고객군 특화를 프롬프트 필수 입력으로), ③ 그래도 부족하면 2호+ 는 커스텀 도메인 분리 검토. 인스턴스 영업 시 "키워드 독점 배정"을 상품 조건으로 명시하면 사업 모델과 정합.

## 도메인 모델 매핑

| 현행 | 신규 | 처리 |
|---|---|---|
| `clinic_profile` | `company_profile` | rename + metadata JSONB 키 재정의 (treatmentPillars→servicePillars 등 5키 상응) |
| `doctor_profile` | `expert_profile` | rename. metadata credentials(면허/전문의/학회/학력) → 자격/경력/취급영역으로 JSONB 스키마 교체. E-E-A-T 저자 역할 유지 |
| `treatment_page` | `service_page` | rename. Pillar/Spoke 계층(`pillar_slug`) 그대로 — 장기렌트/오토리스 Pillar + 대상·유형별 Spoke |
| `medical_condition_page` | `guide_page` | rename·개조. "증상 유입" → "상황별 가이드"(개인사업자 경비처리·신용 낮을 때 등 정보형 롱테일 유입 페이지). 노출 전략 핵심이므로 제거 아닌 개조 |
| `consultation_request` (raw SQL only) | `lead` | 승격: drizzle 스키마 편입 + 필드 확장 + 상태 6종 — 전체 스펙은 RCF-S1 (C0027 공개 SELECT 승계 금지 포함) |
| `publication` · `media_appearance` | (미이식) | 초기 제외. 언론보도 니즈가 생기면 `press` 로 부활 (RCF-D10) |
| `compliance_record` | 개조 | `physician_approver`/`legal_counsel` 컬럼 + `medHighRequiresPhysician`/`legalDocRequiresLegal` CHECK 제거 → client-approver 기반 재정의. `complianceContentTypeEnum` 값 교체 |
| `legal_document` | 유지 | `non-covered`(비급여) enum 값 → 렌트카 약관 유형으로 교체 + **partial unique index WHERE 절의 'non-covered' 리터럴 동반 재정의** (schema.ts:368 · v2.1). 리드를 받는 순간 개인정보처리방침이 법적 필수 — 비중 상승 |
| `review_queue_entry` | 개조 | `approver_role` enum 에서 medical/legal **제거** (client 는 이미 존재). drizzle `text[]` vs raw SQL `approver_role[]` 괴리 — 스쿼시 시 raw SQL 을 SoT 로 (v2.1) |
| `conversion_event` | 개조 | eventName CHECK 교체: `phone_click`·`kakao_click`·`quote_form_start`·`quote_form_complete`·`calculator_use` (RCF-S2) |
| `article` · `faq` | 개조 | **rename cascade 직격** (v2.1 — "그대로" 아님): `article.author_doctor_id`+FK → author_expert_id · `faq.related_treatment_id`/`related_condition_id`/`author_doctor_id`+FK 3개 → 상응 rename |
| `content_entity_link` · `content_calendar_event` · `seo_readiness_snapshot` | 개조 | entity_type CHECK 값 교체 (TreatmentPage·MedicalConditionPage·Publication·MediaAppearance → ServicePage·GuidePage 체계) (v2.1) |
| `keyword_content_link` · `llm_call_log` | 개조 | RCF-S4 (entityType CHECK + primary 유니크) · RCF-S3 (템플릿 enum) |
| 나머지 8개 테이블 | 그대로 | instance · location_profile · article_category · keyword_target(+`angle` 필드 추가) · search_property · search_visibility_snapshot · search_sync_state · instance_contract |

**guide_page 전제 조건** (v2.1): 구 `medical_condition_page` 에는 `pillar_slug` 가 **없다** (treatment_page 전용 · C0029). B-5 클러스터 참여를 위해 guide_page 에 **`pillar_slug` 컬럼 신설** + `site-cluster-links` 브리지 SQL 확장이 필요.

`shared-types` `TenantRole` = `operator | client-approver` 로 축소, `ActionType` 의 physician/legal 액션 제거.

## 사이트 IA — 페이지 템플릿 패밀리

현행 라우트 골격(flat slug + pillar_slug 클러스터)을 유지해 이식 비용을 최소화한다.

| 라우트 | 템플릿 | 원본 | JSON-LD |
|---|---|---|---|
| `/` | 홈: 히어로(+견적 CTA) · 서비스 Pillar 카드 · 렌트vs리스 요약비교 · 이용절차 4단계 · 전문가 · 최신 가이드 · FAQ 발췌 · 최종 CTA | page.tsx **전면 재작성** (DOCTOR_INTRO_DATA 하드코딩 제거) | `Organization` + `AutoRental` + `WebSite` |
| `/services` · `/services/[slug]` | 서비스(상품): 장기렌트/오토리스 Pillar + 개인·개인사업자·법인·신차·중고 Spoke. 월 납입료 표기는 PriceDisclosure(RCF-S10) 강제. **리스 상품은 RCF-D11 게이트** — 미등록 인스턴스 발행 차단 | treatments 개조 | `Service`/`Product`+`Offer` |
| `/guides` · `/guides/[slug]` | 가이드 — **정보형 키워드 타깃은 전부 guide** (검색 유입 주력 · 키워드 primary). **도구(계산기·판단기)는 독립 URL 없이 guide 본문의 인터랙티브 블록으로 임베드** (RCF-S7 · 원칙 4) | **신규 개발** (v2.1 — conditions 공개 라우트는 MVP 단순화 때 삭제·어드민 CRUD 0건이라 개조 원본이 없음. treatments 템플릿 참조 신작 · 필요 시 fork 전 현행 repo 이력에서 구 conditions 라우트 추출) | `Article` + `FAQPage` |
| `/insights` · `/insights/[slug]` | 아티클 — **키워드 비타깃 한정** (시황·브랜드 관점·발행 페이싱용 소재). 질의응답형 주제는 guide 로 (v2.1 배타 기준 — 이원화가 유사문서 표면적을 늘리지 않도록) | 그대로 | `Article` |
| `/experts` · `/experts/[slug]` | 전문가(카매니저) — 저자 페이지 | doctors 개조 | `Person` |
| `/about` | 회사 소개(연혁·제휴 캐피탈·인증) | about 개조 | `Organization` |
| `/locations` | 지점 (비대면 중심이어도 유지 — LocalBusiness 신호) | 그대로 | `AutoRental`(LocalBusiness) |
| `/quote` (+ `/quote/complete`) | **견적 문의 (신규 승격)**: lead 폼 + 완료 페이지(전환 추적) | community/consultation 개조·승격 | `ContactPage` |
| `/faq` | FAQ 모음 (guide 내 FAQ 블록의 발췌 허브) | **신규(소형)** — 현행에 독립 /faq 라우트 없음 (홈 발췌·상세 인라인뿐 · v2.1) | `FAQPage` |
| `/legal/[type]` | 개인정보처리방침·이용약관 | 그대로 (enum 교체) | — |
| sitemap/robots/rss/favicon | 시스템 | 그대로 | — |
| (제거) | publications · media-appearances · community · contact(→ quote/about 에 흡수) | — | — |

schema.org 교체: `MedicalClinic`→`AutoRental`, `Physician`→`Person`, `MedicalProcedure`→`Service`/`Product`+`Offer`, `MedicalCondition`→제거. `builders.ts` 그래프 조립 로직은 재사용, `entities.ts` 빌더만 교체. (함정 #5: `@type` 존재가 compliance inline-flag 판정과 연동 — 교체 시 회귀 확인.)

### C 하이브리드 metadata 경계 (Instance 커스텀 키)

`company_profile.metadata` 5키: `servicePillars`(Pillar 카드) · `processSteps`(이용절차) · `keyStats`(제휴사 수 등 — **출처 명시 필수** 원칙 유지) · `strengths` · `copy`(히어로 문안·브랜드 톤). 어드민에서 비우면 fallback, 채우면 커스텀 — 현행 패턴 유지.

## 전환 동선

주 전환 = **견적 문의(lead)**. 보조 = 전화 클릭, 카카오채널.

| 동선 | 경로 | 설계 포인트 |
|---|---|---|
| A. 정보형 검색 유입 | guide/insight → (자동 내부링크) → service → `/quote` | 본문 하단 **컨텍스트 CTA**: 글 주제가 '개인사업자'면 lead 폼 고객유형 프리필 |
| B. 도구 블록 유입 | guide 내 도구 블록 → 결과 → **의도 분기 CTA** (RCF-S7: 해지→승계 상담 · 반납→신규 견적 · 인수→억제) | 입력값을 `prefill` 로 폼에 전달. 전환 효율 단정은 계측 후 (v2.1) |
| C. 직접/브랜드 유입 | 홈 히어로 CTA → `/quote` | — |

- **CTA 배치 표준**: 전 페이지 헤더 우측 고정 "견적 문의" + 콘텐츠 하단 컨텍스트 CTA + 모바일 하단 고정 바(전화 | 견적). 플로팅은 모바일 한정. **CTA 는 pillar 별 variant** (v2.1 · RCF-D11 ④): 리스 클러스터(P2) 페이지는 미등록 인스턴스에서 견적 CTA 억제 또는 "장기렌트 상담" 중립 문구. 도구 블록 CTA 는 의도 분기 (RCF-S7).
- **attribution**: `/api/track` 의 익명 `session_token` 을 lead submit 시 lead row 에 저장 → conversion_event(utm·referrer·pagePath)와 조인해 "유입 페이지/키워드 → 리드" 리포트. CTA_ID whitelist 교체(`hero-quote`·`calc-quote`·`context-quote`·`mobile-bar-call` 등).
- **폼 필드 (필수 최소화)**: 이름 · 연락처 · 관심 차종(자유입력) · 계약형태(장기렌트/리스/미정 — 리스 옵션은 RCF-D11 ③ 게이트) · 고객유형(개인/개인사업자/법인) · 희망시기 · **개인정보 수집 동의(필수)**. 마케팅 동의는 v1 미수집 (RCF-S1). 스팸 방어는 신규 구축 (§견적 폼 스펙).
- **알림**: lead INSERT 시 notifications-outbox 로 운영자 알림 — **Phase 2 (폼 라이브와 동시)**.

## 어드민 IA — 8메뉴

대시보드(+리드 KPI) · **리드(신규)** · 서비스(상품) · 아티클(가이드·칼럼·FAQ) · 키워드 · 검색노출 · 전문가 · 회사정보. super-admin(인스턴스·유저 관리)·account 는 그대로.

## 상세 스펙 (구현 착수용)

### RCF-S1 · `lead` 테이블 — `consultation_request`(C0026) 승격

C0026 의 골격을 답습: FORCE RLS + **app_public_reader INSERT-only 정책** + app_tenant_user 전체 정책 + instance/status 인덱스. 여기에 견적 필드를 확장한다.

**⚠ C0027 승계 금지** (v2.1 코드 검증): 현행 `consultation_request` 는 C0027 이 **공개 SELECT 정책 + 컬럼 GRANT**(id·title·display_name·is_locked·status 등 — "비밀 상담소" 목록 노출용)를 추가한 상태다. lead 는 **INSERT-only 로 회귀** — 덤프-rename 으로 승계하면 공개 SELECT 가 따라와 PII 노출 경로가 된다. C0027 의 `title`/`is_locked` 컬럼은 폐기.

| 컬럼 | 타입/제약 | 비고 |
|---|---|---|
| id · instance_id · created_at | C0026 동일 | |
| display_name | TEXT NOT NULL · 1~50자 CHECK | |
| contact_phone | TEXT **NOT NULL** · `^[0-9+\-\s]{8,30}$` | 견적 상담은 전화 필수 (consultation 은 nullable 이었음) |
| contact_email | TEXT NULL · email regex CHECK | |
| contract_type | TEXT NOT NULL CHECK `('long-term-rent','lease','undecided')` | |
| customer_type | TEXT NOT NULL CHECK `('personal','sole-proprietor','corporate','undecided')` | 컨텍스트 CTA 프리필 대상 |
| vehicle_interest | TEXT NULL ≤200자 | 자유입력 (카탈로그 정형화는 RCF-D9 유보) |
| desired_timing | TEXT NULL CHECK `('asap','within-1m','within-3m','browsing')` | |
| message | TEXT NULL ≤5000자 | consultation 은 필수 10자+ — 견적 폼은 선택으로 완화 |
| privacy_consent_at | TIMESTAMPTZ **NOT NULL** | 동의 시각 증적. false submit 자체를 서버가 거부 |
| consent_notice_version | TEXT **NOT NULL** | **동의 시점에 노출된 고지 문구 버전** (legal_document 버전 참조) — 시각만으로는 §15② 고지 사실 입증 불가 (v2.1) |
| third_party_consent_at | TIMESTAMPTZ NULL | 제3자 제공 별도 동의 시각 — 제공 활성 인스턴스는 서버가 NOT NULL 강제 (v2.1) |
| third_party_recipient | TEXT NULL | 동의 시점 제공처(캐피탈사명) 스냅샷 (v2.1) |
| retention_expires_at | TIMESTAMPTZ **NOT NULL** | 보유기간 만료일 (submit 시 instance 설정으로 산출 · 기본 상담 종료 후 6개월) — 파기 cron 의 기준 (v2.1) |
| session_token | TEXT NULL · 64자 CHECK | conversion_event 조인 키 (attribution) |
| source_path | TEXT NULL ≤512자 | 제출 페이지 경로 |
| prefill | JSONB DEFAULT '{}' | 계산기 입력값/컨텍스트 CTA 스냅샷 |
| status | TEXT NOT NULL DEFAULT 'new' CHECK `('new','in-progress','won','lost','invalid','archived')` | **`invalid`(스팸/허위) 별도** — lost 로 뭉개면 KPI·attribution 오염 (v2.1) |
| status_changed_at | TIMESTAMPTZ NULL | resolved_at 일반화 |
| anonymized_at | TIMESTAMPTZ NULL | 파기(익명화) 실행 시각 — 익명화 후 row 는 통계용 잔존 (v2.1) |
| admin_note | TEXT NULL ≤5000자 | 운영 메모. **주민번호 패턴 저장 거부 + 개인정보 추가 입력 금지 경고문** (v2.1) |

- 상태 전이는 콘텐츠 9-상태 머신(WorkflowActionButtons)과 **무관한 단순 전이** — 리드 상세 화면의 전용 버튼으로 처리 (compliance 게이트 미적용).
- **마케팅 동의는 v1 에서 수집하지 않는다** (v2.1 결정): 플랫폼에 발송 기능이 없어 "쓰지 않을 동의" 수집은 최소수집 원칙과 충돌. 발송 채널 도입 시 `marketing_consent_at`+철회 컬럼+어드민 철회 버튼을 세트로 재도입.
- **파기 cron** (v2.1 신설 · Phase 2 필수): 일일 cron 이 `retention_expires_at` 경과분 + `won` 전이 후 90일 경과분을 **익명화**(이름·전화·이메일·message·admin_note → NULL, row 는 통계 잔존) + audit_event 기록. 고지한 기간을 지키지 않으면 개보법 §21 위반 — 고지문이 위반의 증거가 됨. 계약 체결 후 고객관리는 클라이언트 자체 시스템 몫 (수탁 DB 의 CRM 화 = 목적 외 이용).
- **정보주체 권리 처리** (v2.1): 어드민 리드 상세에 "삭제(즉시 익명화)" 버튼 + audit 기록 — 위탁자(업체) 경유 열람·삭제 요구 이행 수단. 파기 cron 과 동일 익명화 함수 재사용.

### RCF-S2 · conversion_event / CTA 교체

- `eventName` CHECK (C0042 의 5종) → `('phone_click','kakao_click','quote_form_start','quote_form_complete','calculator_use')` — booking_click·consult_form_* 대체.
- `/api/track` CTA_ID whitelist → `hero-quote` · `context-quote` · `calc-quote` · `mobile-bar-call` · `mobile-bar-quote` · `header-quote` · `footer-call`.
- lead.session_token ↔ conversion_event.session_token 조인으로 "유입 페이지/utm → 리드" 리포트 (어드민 대시보드·검색노출 메뉴).

### RCF-S3 · LLM 템플릿 enum + 프롬프트 노트

`llm_call_log` template CHECK 교체: `treatment-page-full-draft`→`service-page-full-draft` · `medical-condition-page-full-draft`→`guide-page-full-draft` · `clinic-metadata-draft`→`company-metadata-draft` (나머지 6종 유지).

`SHARED_MEDICAL_AD_NOTE` → `SHARED_RENTCAR_AD_NOTE` 골자: "한국 렌트카(장기렌트·오토리스) 업체 운영자를 보조. 월 납입료 표기 시 조건(계약기간·선납금/보증금·약정거리·정비 포함 여부) 병기. 승인 보장·무심사·최저가 보장·확정 절세 단정 표현 금지. 리스는 금융상품 — 확정적 이익 단정 금지. 검증 불가 수치 생성 금지(keyStats 패턴 유지)." 세부 금지 표현은 §부록 A 룰셋에서 상속.

Full draft 프롬프트에 **인용형 콘텐츠 표준(노출 원칙 7)** 반영: 첫 문단 질의 직답 · 소제목 2~7개(H2 상한 — 의료 v1.3 변주 규칙 승계) · **3,000~5,000자** (v2.1: 검증된 것은 구조이지 분량이 아님) · 1차 출처(금융위·국세청·공정위·소비자원) 인용 슬롯 명시 · TL;DR + FAQ 블록 유지 · **keyword_target.angle 명세 주입** (RCF-S4).

### RCF-S4 · 키워드당 1편 가드 (노출 원칙 3의 구현)

- `keyword_content_link` entityType CHECK → `('Article','ServicePage','GuidePage','FAQ')` (Publication/MediaAppearance 제거).
- **신규 unique partial index**: `(instance_id, keyword_id) WHERE is_primary = true` — 현행은 일반 인덱스라 키워드당 primary 다수 허용됨. 유니크로 승격해 "키워드당 대표 콘텐츠 1편"을 DB 가 강제.
- **primary 배정 규칙** (v2.1 — 부록 B-2 의 "가이드+FAQ/도구" 복수 유형과의 모순 해소): 키워드 타깃의 **primary 는 항상 guide 페이지**. FAQ·도구 임베드·관련 아티클은 `is_primary=false` 지원 링크.
- AI 초안 생성 진입점: primary 존재 키워드 선택 시 **"기존 글 업데이트 모드"로 라우팅** (원칙 9 — 차단이 아니라 갱신 유도) + **제목+H2 셋 유사도 검사 게이트** (원칙 3 ② — DB 제약이 못 잡는 본문 단위 유사를 생성 시점에 차단).
- `keyword_target` 에 **`angle` 명세 필드 추가** — 인접 키워드의 앵글 분리(예: "단점"=나열 vs "하지마라"=반박·판단 기준)를 저장하고 프롬프트에 강제 주입.

### RCF-S5 · company_profile.metadata 5키 (C 하이브리드 유지)

| 키 | 형태 | fallback |
|---|---|---|
| `servicePillars` | `[{slug,title,summary,icon}]` | Pillar 4카드 하드코드 |
| `processSteps` | `[{step,title,description}]` | 이용절차 4단계 기본 |
| `keyStats` | `[{label,value,source}]` — **source 필수** (검증 불가 수치 금지 원칙 유지) | 미표시 |
| `strengths` | `[{title,description,icon}]` | 기본 3종 |
| `copy` | `{heroHeadline,heroSub,quoteCtaLabel,brandTone}` | 업종 기본 문안 |

### RCF-S6 · expert_profile metadata

`doctor-metadata.ts` 의 credentials(license/board/certification/membership/education) → `[{type:'career'|'certification'|'education'|'award', title, organization, year}]` + `specialties: string[]` (취급 영역: 수입차·법인·신용 컨설팅 등). 면허번호류 필드 제거.

### RCF-S7 · 도구형 임베드 블록 (Phase 2)

**도구는 독립 URL 이 아니라 해당 키워드 guide 페이지의 인터랙티브 블록** (v2.1 — 노출 원칙 4). 색인 표면은 guide 본문(산식 해설 · 표준약관 해당 조항 · 예시 계산표 등 충분한 SSR 텍스트)이고, 도구는 그 안의 클라이언트 컴포넌트다. 우선순위는 부록 B §4 경쟁 공백 준용 — 견적/가격 비교는 진입 비추천, 월 납입료 계산기는 후순위.

| 순위 | 도구 블록 | 호스트 guide (B-5) | 입력 → 출력 | CTA (의도 분기 — v2.1) |
|---|---|---|---|---|
| 1 | **중도해지 위약금 계산기** | early-termination-penalty | 월 렌트료 · 잔여 개월 · 요율(약관 30~50% 체감형) → 위약금 추정 밴드 | 해지 의도 → **승계 상담** CTA (contract-succession 연결) |
| 2 | **만기 인수 vs 반납 판단기** | buyout-vs-return | 잔존가치 · 예상 중고시세 · 주행거리 → 판단 가이드 | 반납 → 신규 견적 CTA · 인수 → CTA 억제 |
| 3+ | 총비용 비교 / 주행거리 정산 / 절세 시뮬레이터 | buy-vs-rent-vs-lease · mileage-overage · sole-proprietor-expense | — | Phase 3 이후 순차 |

공통 스펙: 출력은 **추정 밴드** + PriceDisclosure `estimate` 모드 고지 (RCF-S10) · 산출 근거(표준약관·국세청) 본문 명시 · `calculator_use` beacon · CTA 는 입력값을 `prefill` JSONB 로 `/quote` 전달. **"최고 전환 동선" 단정은 계측 전까지 보류** — 도구 1·2 의 사용자는 신규 계약이 아니라 기존 계약의 출구를 찾는 사람이므로 CTA 의도 분기가 전환의 전제.

### RCF-S8 · 발행 페이싱 큐 (노출 원칙 2의 구현 · Phase 3)

콘텐츠 테이블(article·guide_page)에 `publish_after TIMESTAMPTZ NULL` 추가 (content_calendar_event 는 콘텐츠 FK 없는 마커 테이블 — 큐 저장소로 부적합 · v2.1 통일). 운영자는 대량 작성 후 발행 예약만 걸고, 일일 cron 이 도래분을 발행 + IndexNow 제출. **상한은 instance 설정(하드코드 금지) — 기본 프로파일: 발행 개시 0~8주 주 2~3건, 색인·노출 선행지표 확인 후 점증** (의료 실측 교훈 기반).

**상태 머신 정합 (v2.1 재설계 — 코드 검증 반영)**: 전이표에 approved→published 직행은 **없다** (`approved→publishable→published`). 따라서:
- 운영자 UX: 콘텐츠가 **`publishable` 도달 후** `publish_after` 예약 (approved 단계 예약 아님).
- cron 은 `publishable` + `publish_after` 도래분만 발행. 기존 indexnow cron 은 service-role **읽기 전용**이라 패턴 이식 불가 — cron 이 인스턴스별 **sentinel actor(`system@glitzy.internal`) 기반 TenantContext 를 합성**해 `withTenantTransaction` + `publishContent()`(발행 자격 검사·sentinel compliance 매핑 포함 — `lib/compliance/publishable-check.ts` 경유) 를 호출하는 신규 경로 구현. eligibility 검사(`assertReviewerEligibility`)는 sentinel actor 허용 규약을 추가.

### RCF-S9 · seo-readiness catalog 교체

`has-author-doctor`("의료진 저자 연결") → `has-author-expert`. 엔티티 참조(TreatmentPage 등) rename 동반 — catalog 외 evaluators·visibility-overview 도 (0-3). 가중치 체계는 유지하되 렌트카 항목 추가 검토: 가격 표기 페이지의 PriceDisclosure 완결성 · 도구 블록 보유 guide 여부 · 1차 출처 인용 수(원칙 7).

### 어드민 리드 메뉴 스펙 (Phase 1~4)

- 목록: 생성일 · 이름 · 연락처 · 관심차종 · 고객유형 · 계약형태 · 상태 · 유입(source_path) — 상태 필터 + 기간 필터 + 동일 전화번호 중복 표시.
- 상세: 전체 필드 + prefill 스냅샷 + attribution(세션 conversion_event 타임라인) + admin_note + 상태 전이 버튼(new→in-progress→won/lost/**invalid**, archived) + **삭제(즉시 익명화) 버튼** (정보주체 권리 이행 · v2.1). **상세 열람·export 는 audit_event 기록** (RCF-D6 접속기록 의무 · v2.1).
- 대시보드 KPI: 주간 리드 수 · quote_form_start→complete 전환율 · 유입 상위 페이지 — **`invalid` 는 집계 제외** (지표 오염 방지 · v2.1).
- 알림: lead INSERT 시 notifications-outbox enqueue — **Phase 2 (폼 라이브와 동시 · v2.1 승격)**.

### RCF-S10 · PriceDisclosure 컴포넌트 + 사이트 신원표시

- **PriceDisclosure 는 2모드** (v2.1 — 상품 가격과 도구 산출물은 규제 범주가 다름):
  - `offer` 모드 (service_page 가격 블록): 부록 A §2 병기 체크리스트를 구조화 필드로 강제 — VAT 포함 여부 · 계약기간 · 보증금/선납금 · 약정거리 · 정비 포함 · 만기 옵션 · "심사 결과에 따라 변동" · 견적 기준일.
  - `estimate` 모드 (도구 결과 추정 밴드): "심사 결과에 따라 변동·확정가 아님" 고지 + 산출 근거(표준약관·세법 기준) 링크만 강제.
- **강제 지점은 어드민 저장 시점** (v2.1 — 사이트측 silent 미렌더는 운영자가 본문에 가격을 직접 써서 우회하게 만드는 UI): offer 필수 필드 미입력 시 가격 블록 **저장 거부 + 누락 필드 명시**. 사이트는 "저장된 것은 항상 완전"을 전제로 렌더. 본문 자유 텍스트 가격 표기는 룰 #7 이 감지 (severity: content-gate).
- **JSON-LD 단일 소스** (v2.1): `Product`+`Offer` 의 `offers.price` 는 PriceDisclosure 데이터에서만 파생 — 화면에 없는 가격이 구조화 데이터에만 존재하면 그 자체가 기만·스팸 판정 소재.
- **사이트 신원표시**: Footer 에 상호·대표자·주소·전화·이메일·사업자등록번호 상시 표시 (전자상거래법 — 부록 A 보조 룰). `company_profile` 기존 필드로 충당 — seed 시 필수화.

### 견적 폼 (site `/quote`) 스펙

- 필드: §RCF-S1 의 사용자 입력 컬럼. 필수 = 이름·연락처·계약형태·고객유형·개인정보 동의. **주민등록번호·소득 정보는 수집 금지** (최소수집 원칙 — 심사는 등록 금융사/캐피탈 영역).
- 동의 고지: 개인정보보호법 제15조 제2항 **법정 4항목** — ① 수집·이용 목적(견적 상담) ② 수집 항목 ③ 보유·이용 기간(instance 설정 · 기본 N개월) ④ 동의 거부 권리와 불이익. 업체명(company_profile) 치환 템플릿 + 처리 위탁(Glitzy 시스템 운영) 명시 (RCF-D6). 리드를 제휴 캐피탈사에 전달하는 인스턴스는 **제3자 제공 별도 동의** 블록 활성화 (instance 설정).
- **마케팅 동의는 분리된 선택 체크** (필수 묶음 금지 — 부록 A 룰 #22). 문자/이메일 광고 발송은 정보통신망법 제50조 사전 동의 + 수신거부 수단 전제.
- 스팸 방어는 **신규 구축** (v2.1 정정 — 코드 검증 결과 consultation-actions 에는 honeypot/rate limit 이 없고, /api/track 의 rate limit 은 클라이언트 쿠키 seed 기반 in-memory Map 이라 리드 폼 수준엔 부적합): **IP 기반 키 + 지속 스토어**(Upstash 등) + honeypot + 제출 최소 체류시간 검사 + 동일 전화번호 단기 중복 dedupe 표시. 전화번호는 국내 프리픽스 정규화 + 형식 검증 (SMS OTP 는 전환율 훼손 — 스팸율 임계 초과 시 승격하는 트리거만 정의). 서버 액션에서 privacy_consent 미체크 즉시 거부.
- 제출 성공 → `/quote/complete` redirect (+ `quote_form_complete` 추적 — 기존 ConsultCompleteTracker 패턴) + **outbox 알림 즉시 발송 (Phase 2 완료 기준 — 알림 없는 리드 캡처는 RCF-D5 와 모순)**.
- 참조: 개인정보보호위원회 「렌터카 업무 개인정보 처리 가이드」(privacy.go.kr) — 동의 문구 상세화 시 1차 문서.

## 노출 구조 원칙 — 시스템 반영 지점

| # | 원칙 | 반영 지점 |
|---|---|---|
| 1 | **도메인 불변 + 조기 aging** | 신규 BASE 첫날 확정(RCF-D1) · 전환 금지. **도메인 취득 즉시(Phase 0-7) 홀딩 페이지 1장 + 서치어드바이저/GSC 등록 + sitemap 제출** — 개발 기간(Phase 0~2) 전체를 도메인 aging 기간으로 전환 (v2.1: 의료 버전의 SA 등록 실기 반복 방지) |
| 2 | **발행 페이싱** | 콘텐츠 테이블의 `publish_after` + 일일 cron **발행 큐** (RCF-S8). 상한은 **도메인 연령 단계별 instance 설정: 0~8주 주 2~3건 → 색인·노출 확인 후 점증** (v2.1: 의료 실측 교훈 — 대량 발행 41편 중 ~10편 근사중복 사고. 일 1~3건은 나이 0 도메인에서 블로그팜 지문) |
| 3 | **키워드당 1편 + 유사문서 게이트** | ① `keyword_content_link` primary 유니크(RCF-S4) ② **AI 초안 생성 시 기존 발행본과 제목+H2 유사도 검사 게이트** (v2.1: 유니크 인덱스는 "두 번째 primary"만 막음 — 의료 실사고는 키워드가 제각각인 유사 본문에서 발생) ③ keyword_target 에 **앵글 명세 필드** — 인접 키워드(단점 vs 하지마라)의 앵글 분리를 프롬프트에 강제 주입 |
| 4 | **도구형 콘텐츠 = guide 임베드** | 계산기·판단기는 **독립 URL 이 아니라 해당 키워드 guide 페이지에 임베드** (v2.1: 클라이언트 컴포넌트 도구는 SSR 텍스트가 얇아 웹문서 판에 등장 불가 — 산식 해설·약관 조항·예시 계산표를 갖춘 guide 본문이 색인 표면, 도구는 그 안의 인터랙션 블록. 키워드당 1편 원칙과도 정합) |
| 5 | **구조화 데이터 확장** | Product/Offer 가격 ↔ PriceDisclosure 단일 소스(RCF-S10) ↔ 컴플라이언스 룰 연동 |
| 6 | **채널 기대치 숫자 정렬** | 사이트 = "전환의 종착지". **외부 독립 사이트는 네이버 오가닉 9.5%·AI 브리핑 인용 16.5%의 구조적 소수 지분 — 초기 12주 노출 주력은 블로그 위성일 가능성이 높다** (v2.1 숫자 명시). AI 브리핑 인용은 트래픽 KPI 가 아닌 **신뢰 신호 KPI** 로 분리 (제로클릭 위험). 블로그 위성·플레이스 정책은 부록 C |
| 7 | **인용형 콘텐츠 표준** | 첫 문단 질의 직답 · 소제목 2~7개 · **본문 3,000~5,000자** (v2.1 하향: 검증된 것은 구조이지 분량이 아님 — 장문 상향은 환각·본문 중복·규제 검토 부담만 증가) · 1차 출처(금융위·국세청·공정위·소비자원) 인용 명시. RCF-S3·RCF-S9 반영 |
| 8 | **외부 신호 확보** (v2.1 신설) | 온페이지만으로 C-rank 류 사이트 신뢰도는 못 쌓는다: **스마트플레이스 등록+홈페이지 연결**(온보딩 필수 — 나이 0 도메인이 즉시 얻는 유일한 네이버 내 유입 신호) · 커뮤니티(보배드림·클리앙 자동차) 도구 시딩 · 제휴 캐피탈/딜러 상호링크 · '온렌트+업체명' 브랜드 검색 조성 |
| 9 | **리프레시 루프** (v2.1 신설) | 키워드당 1편은 그 1편을 갱신할 때만 유효: primary 존재 키워드 선택 시 **"기존 글 업데이트 모드"로 라우팅** (신규 생성 차단이 아니라) + **분기별 리프레시 큐** (세법 한도·보조금·약관이 매년 바뀌는 버티컬 — updated_at 갱신 → 기존 IndexNow cron 재제출 재사용) |

## Phase 0 — Fork & Strip 실행 목록

### 함정 목록 (코드 검증 확정 — 본문 참조용)

| # | 함정 | 위치 |
|---|---|---|
| 1 | 홈에 1호 인스턴스 실콘텐츠 하드코딩 (`DOCTOR_INTRO_DATA` — 신수용 스토리) | `(site)/[instanceSlug]/page.tsx` |
| 2 | 의료 리터럴이 로직에 혼입 — `regionToken` 필터 조건에 "다이어트 한방 진료" 문자열 | `components/site/Hero.tsx` |
| 3 | 리드 전신 테이블이 drizzle 스키마에 없음 — raw SQL(C0026/27)에만 존재 | `consultation_request` |
| 4 | compliance_record 가 발행 게이트에 하드 결합 — 동시 변경 세트는 0-3 참조 | DB CHECK + lib/compliance + sentinel + guard 트리거 |
| 5 | JSON-LD `@type` 존재가 compliance inline-flag 판정과 연동 — 타입 교체 시 회귀 확인 | `lib/json-ld/entities.ts` (PSRC-18) |
| 6 | 의료 용어가 SEO/AI 인프라에 침투 — grep 누락 위험 | `seo-readiness/catalog.ts`·`db-projection.ts`·`check.ts` P-코드 맵 |
| 7 | ~~빌드 산출물 커밋~~ — v2.1 검증 결과 **해당 없음** (git ls-files 0건 · .gitignore 존재) | — |
| 8 | pillar 내부링크 브리지가 `treatment_page.pillar_slug` 컬럼명에 의존 — rename 시 SQL 동반 수정 | `lib/site-cluster-links.ts` |

### 0-1. 신규 repo 부트스트랩

1. 현행 repo 를 신규 repo 로 복제 (git history 미보존 — squash init 권장. 의료 클라이언트 실데이터/스토리가 이력에 있음). **복제 전에 구 conditions 라우트(MVP 단순화 때 삭제됨)를 현행 repo 이력에서 참고용으로 추출해 둘지 결정** — /guides 신규 개발의 참고 자료 (v2.1).
2. `apps/spike-a~e` 삭제.
3. 워크스페이스 네임스페이스 `@glitzy/*` → `@onrent/*` 일괄 치환 (RCF-D8. fork 직후가 가장 싼 시점).

### 0-2. 제거 [A]

- `data/compliance-rules/rules.medical-ad.yaml` · `medical-law-tracking.yaml`
- `apps/web/scripts/seed-demo-*.sql` 전체 · `seed-fixture*.sql` · `readiness-*-daeatdiet-incheon.sql` · `rename-instance-slug-*.sql` · `delete-seed-doctors.sql` · `update-favicon-url.sql`(인스턴스 특정 데이터 · v2.1)
- 홈 `page.tsx` 의 `DOCTOR_INTRO_DATA` 하드코딩 블록 (신수용/다이트 실콘텐츠 — 함정 #1)
- `publication` · `media_appearance` 테이블 + `publications/`·`media-appearances/` site/admin 라우트 + `fetch-publication-meta` API + `external-metadata` 의 PubMed 분기
- JSON-LD `MedicalCondition` 빌더

### 0-3. 개조 [B] — rename·룰·프롬프트 교체

- **schema.ts + raw SQL**: §도메인 모델 매핑 표 전체. `compliance_record` 구조 개조(RCF-D4)는 발행 게이트(DB CHECK)와 하드 결합 — **동시 변경 세트** (v2.1 코드 검증으로 확장): `lib/compliance/{check,final-roles,eligibility,transitions,server-actions,publishable-check,errors,deny-reason-map}.ts` + **`lib/sentinel-compliance.ts`**(legal_counsel 직접 기입 — 대전 저장 실패 실사고 지점) + `lib/admin/clone-instance.ts` + shared-types 롤 + **`published_content_compliance_guard` 트리거 함수 재작성** (C0040 함수 본문이 `CASE TG_TABLE_NAME WHEN 'treatment_page'...'publication'...` 테이블명 하드코딩 — rename·제거 시 필수).
- **룰 YAML**: `rules.core.yaml`(과장·단정·보장 표현 14종)은 상당수 재활용 — 부록 A 룰셋으로 재작성. **`meta.yaml` 은 구조 유지가 아니라 수정 필수** (v2.1 — `loadOrder.tracking` 이 medical-law-tracking.yaml 을 참조: 파일 제거 시 로더가 read 에서 죽음). `context-exceptions.yaml`·`slot-matches.yaml` 도 내용 교체 대상. `risk-inference.ts` 의 `ARTICLE_TYPE_BASE`(general-medical-info 등 하드코딩) → 렌트카 article type 체계로 교체.
- **super-admin** (v2.1 — [C]에서 이동): `admin/super/users/actions.ts` + `AdminUserControls.tsx` 의 physician/legal eligibility 토글 제거 + `admin_user.physician_reviewer_eligible`/`legal_reviewer_eligible` 컬럼 처리 (드랍 또는 client_approver_eligible 개조).
- **추적 계열** (v2.1 — [C]에서 이동): `api/track/route.ts`(zod enum + CTA_ID_WHITELIST) · `site-tracking/beacon.ts` · `admin/conversion-summary.ts` 의 `consult_form_*`/`booking_click` 하드코딩 → RCF-S2 체계.
- **seo-readiness** (v2.1 확장): `catalog.ts` 외 `evaluators/treatment.ts`·`evaluators/article.ts`·`lib/admin/visibility-overview.ts` 의 `has-author-doctor` 계열 참조.
- **keyword/링크 lib** (v2.1 확장): `lib/admin/keyword-content-link.ts`(TreatmentPage/MedicalConditionPage 리터럴 분기) · `evidence-link-options.ts` · `content-entity-link.ts`.
- **LLM 프롬프트**: `lib/ai/prompt-templates.ts`(약 620줄) 전면 재작성 — `SHARED_MEDICAL_AD_NOTE` → 렌트카 광고 표기 노트, 아이콘 whitelist 교체. llm_call_log 템플릿 CHECK 값 교체 (RCF-S3). 오케스트레이션(`*-full-draft.ts`)은 재사용.
- **site 컴포넌트**: SiteHeader(메뉴 하드코딩) · Hero(**리터럴이 regionToken 로직에 섞임 — 함정 #2, 로직 수정 필요**) · DoctorIntroSection→ExpertIntro · TreatmentCard→ServiceCard · EvidenceCard 뱃지 · ConsultationForm→QuoteForm · BusinessHoursTable 카피.
- **admin**: NavMenu 8메뉴 · doctors/→experts/ · treatments/→services/ · clinic-profile/→company-profile/ + 대응 폼들 · **리드 메뉴 신규**.
- **lib**: `doctor-metadata.ts`(JSONB 스키마 재정의) · `db-projection.ts`(projection 타입명) · `seo-readiness/catalog.ts`(`has-author-doctor` 등 라벨 — 함정 #6) · `site-cluster-links.ts`(`treatment_page.pillar_slug` 참조 SQL 동반 수정 — 함정 #8) · `local-keywords.ts` 예시 · `check.ts` P-코드 페이지타입 맵.

### 0-4. 이식 [C] — 무수정 (검증된 자산)

compliance 엔진 코어(matcher·composite·kss·hash·exceptions — 단 loader/risk-inference/types 는 0-3 개조) · 네이버 노출 엔진(indexnow + cron 2종 + GSC ingestion + naver-paste-parser — seo-readiness/keyword lib 는 0-3 의 리터럴 교체 후) · 멀티테넌트 인프라(site-url · custom-domains · site-routing · db/tenant · auth/db/storage/notifications-outbox/migrations-runner 패키지) · 콘텐츠 골격(markdown · internal-linkify · article CRUD · site/ui/* · admin 코어) · AI 인프라(anthropic-client · llm-audit) · 범용 스크립트(run-sql · migrate-* · set-password · indexnow-backfill · insert-body-internal-links[용어맵 교체] · recompute-readiness). (v2.1: 추적 계열·super-admin 은 하드코딩 교체가 필요해 0-3 으로 이동 — "무수정" 아님.)

### 0-5. 리드 캡처 신설 (RCF-D5)

`consultation_request` → `lead` 승격 (**주의: 이 테이블은 raw SQL 마이그레이션에만 존재, schema.ts 에 없음 — 함정 #3**). drizzle 스키마 편입 + §전환 동선 폼 필드 + `session_token` attribution + 상태 컬럼. RLS: 공개 INSERT-only(조회 불가) 정책 신설. 어드민 리드 메뉴(목록·상태 전이·유입 리포트).

### 0-6. 마이그레이션 스쿼시 (RCF-D2) — v2.1 절차 재정의

**전제 (코드 검증)**: 이 repo 는 drizzle-kit 미사용 · **raw SQL 이 DDL SoT** — schema.ts→DDL 생성 도구가 없고, schema.ts 는 raw SQL 대비 불완전(`treatment_page.pillar_slug`/`body_slots` · `article.external_url` · `consultation_request` 전체 · C0040 CHECK 확장 · `approver_role[]` enum array 등 미반영). 따라서 "schema.ts 먼저"는 실행 불가 — 절차는 DB 기준:

1. 로컬 신규 DB 에 **구 마이그레이션 전량 적용** — `init-prod-roles.sql` + `init-prod-auth.sql` + **D 시리즈(packages/db — `app_public_reader` 는 D0011/D0014 에서 생성됨. 누락 시 C0001 의 GRANT 가 role 부재로 실패)** + C0001~C0056.
2. 그 위에 **개조 ALTER 스크립트 1벌 실행** — §도메인 모델 매핑 표의 rename/DROP/CHECK 교체/컬럼 신설(lead 승격 · guide_page.pillar_slug · publish_after · keyword_target.angle 등) + `published_content_compliance_guard` 함수 재작성 + C0027 공개 SELECT 정책 제거.
3. `pg_dump --schema-only` → 정리해 **신규 C0001 베이스라인** 작성 (roles/auth 부트스트랩과의 경계: init-prod-roles + init-prod-auth 는 별도 유지, C0001 은 그 이후 전부).
4. **schema.ts 는 덤프 이후 그에 맞춰 재작성** (drizzle 는 쿼리 빌더 용도 — DDL SoT 아님을 주석 유지).
5. manifest 에 C0001 단일 등록 — `migrate-late` 목록은 공백으로 리셋 (manifest 외 부채를 갖고 가지 않는다).
6. seed: 렌트카 데모 시드 신규 작성 (sentinel ComplianceRecord 패턴 유지 — 승인자 컬럼 개조 반영).

### 0-7. 신규 인프라 + 조기 aging

신규 Supabase(Seoul · Session/Transaction pooler 분리 규칙 동일) + Vercel(icn1) + BASE 도메인(RCF-D7) + `vercel.json` cron 이관(IndexNow·GSC sync + 신규: 발행 페이싱·lead 파기) + env 세트(BASE_SITE_DOMAIN · ANTHROPIC_API_KEY · INDEXNOW 등). **도메인 연결 즉시 홀딩 페이지 1장 + 네이버 서치어드바이저/GSC 소유확인·등록 + sitemap 제출** — 개발 기간을 도메인 aging 으로 전환 (원칙 1 · v2.1).

### Phase 0 완료 기준

`pnpm typecheck:all` 0 · vitest 그린(의료 시나리오 테스트는 렌트카 픽스처로 교체) · `pnpm web:build` 통과 · 로컬 `/demo` 4경로 렌더 · 신규 DB 에 C0001+seed 1회 적용 성공.

### Phase 0 권장 실행 순서 (커밋 단위)

1. repo 복제 + spike 삭제 + `@glitzy→@onrent` 치환 → typecheck 그린 확인 (기능 무변경 커밋)
2. 스키마 개조 일괄 — **개조 ALTER 스크립트(0-6 의 SoT) + schema.ts 정합** (rename + enum + compliance_record 구조 + lead 승격 + RCF-S4 인덱스) + db-projection + shared-types 롤 — **한 커밋** (DATA_MODEL cascade 동시 규칙 준수)
3. `lib/compliance/*` 롤·페이지타입 재정의 + **엔진 확장 2건**(instanceConditions · 조건병기의 PriceDisclosure 일원화 — RCF-D3) + 룰 YAML 교체 (부록 A) — 발행 게이트가 안 막히는지 vitest 로 고정
4. site/admin 라우트·컴포넌트 rename + 홈 재작성 + Hero 로직 수정
5. LLM 프롬프트 재작성 + 템플릿 enum 정합
6. 마이그레이션 스쿼시 C0001 + seed 신규 + 로컬 부트스트랩 검증
7. 신규 인프라 연결 (Supabase·Vercel·onrent.kr·cron·env)

## 검증 계획

- **vitest 이관 대상**: site-routing 전이표(도메인만 교체) · 룰 로더/매처(픽스처 교체) · markdown/internal-link · slug 유효성 · 워크플로 전이. **신규 작성**: lead INSERT 서버 액션(동의 미체크 거부·honeypot·필드 검증·미등록 인스턴스 lease 옵션 거부) · RCF-S4 유니크 가드 + 유사도 게이트 · 계산기 추정식 · 페이싱 큐 전이(cron 대행 발행) · **파기 cron 익명화** · **견적 폼 법정 고지 4항목 렌더 단정 + Footer 신원표시** (룰 엔진 밖 검사 — 부록 A 실행 평면 분리) · **리스 게이트 3면**(상품 발행 차단·폼 옵션·CTA variant).
- **RLS 수동 검증**: app_public_reader 로 lead SELECT 시도 → 거부 확인 (C0026 패턴 회귀).
- **시각 검수 4경로** (CLAUDE.md 규칙 상응): `/demo` 홈 · `/demo/services` · `/demo/quote` · `/admin/demo`.
- **컴플라이언스 회귀**: JSON-LD `@type` 교체 후 inline-flag 판정(함정 #5) vitest 케이스 필수.
- **E2E smoke**: 견적 폼 제출 → lead row + quote_form_complete 이벤트 + `/quote/complete` 리다이렉트 + outbox 알림 1루프.

## 성과 기대치와 검증 게이트 (v2.1 신설)

의료 버전 실측(발행 41편 · 노출 전부 브랜드 쿼리 · 클릭 0 · 발행 후 수 주 경과)이 보여주듯 **나이 0 도메인의 초기 무노출 공백은 확정적**이다. 이를 전제로 기획한다:

- **선행지표 사다리** (주차별 게이트 — 검색노출 메뉴에서 추적): ① SA/GSC 색인 URL 수 → ② 브랜드 쿼리 노출·클릭 → ③ 논브랜드 롱테일 노출 → ④ 순위·클릭. 다음 단계가 안 오면 앞 단계를 진단.
- **전환 기대치 (보수 가정)**: 정보형 유입 CVR 0.5~2% → 월 리드 10건 = 월 방문 500~2,000 필요. 오가닉 9.5% 판에서 나이 0 도메인이 이 트래픽에 도달하기까지 **수 개월 공백을 클라이언트 계약·커뮤니케이션에 명시** (막연한 "노출 됩니다" 영업 금지 — 의료 1호의 현재 상태가 반례).
- **공백기 리드 브리지**: 스마트플레이스(원칙 8 — 즉시 유입 가능한 유일한 네이버 내 신호) + 필요 시 파워링크 소액 (솔루션 밖 · 클라이언트 결정).
- **전략 리뷰 트리거**: 발행 12주 후 논브랜드 노출이 기준 미달이면 전략 리뷰 (블로그 위성 격상 · 유료 브리지 확대 · 키워드 재조정). 성패 판정 기준 없는 지속은 금지 — 반증 가능성 확보.
- **P4(저신용·무직·회생) 클러스터는 리드 KPI 에서 분리** — 정직 해설(무보증 실체 등)은 다수 방문자에게 '안 됩니다'가 답이라 전환과 상충. 신뢰 구축용으로 재정의하고 이 트레이드오프를 감수한다 (룰 #3·#4 와의 충돌 방지가 우선).

## 로드맵 (Phase 1~4)

| Phase | 내용 | 완료 기준 (코드 + **노출/운영**) |
|---|---|---|
| 1 · 도메인 모델 | 스키마 확정(company/expert/service/guide/lead) · 어드민 8메뉴 · metadata 5키 재정의 | admin CRUD 동작 |
| 2 · 사이트 + 리드 폼 | §IA 템플릿 · 견적 폼 → lead INSERT · **outbox 알림 + 파기 cron** (v2.1 승격 — 리드 첫날부터의 의무) · 도구 임베드 블록 1~2종 · JSON-LD | 사이트 라이브 · **폼 제출→알림 1루프 검증** |
| 3 · 노출 엔진 가동 | IndexNow · 키워드 타깃 등록(+angle) · AI 초안 파이프라인 · 발행 페이싱 큐 · **키워드 인벤토리 보충 파이프라인**(네이버 검색광고 keywordstool API — 39종 소진 대비, v2.1) | 점진 발행 개시 · **SA 색인 N URL + 브랜드 쿼리 노출 확인** |
| 4 · 리드 운영 | 리드 보드 · attribution 리포트 · **정보주체 삭제(익명화) 버튼** · **NSA paste 경과 경고 배지** | 운영 루프 완성 · **12주 논브랜드 노출 게이트 판정** |

(서치어드바이저/GSC 등록은 Phase 3이 아니라 **Phase 0-7 시점** — 원칙 1 조기 aging.)

## 열린 결정 (OPEN) — 전건 처리 완료

| # | 처리 | 내용 |
|---|---|---|
| OPEN-01 | **확정 → RCF-D6** | 렌트카 업체 클라이언트용 — 처리자=업체 · Glitzy=수탁자 |
| OPEN-02 | **확정 → RCF-D7** | `onrent.kr` (사용자 액션: 레지스트라 등록 + KIPRIS 확인) |
| OPEN-03 | **확정 → RCF-D9** | 차량 카탈로그 정형화 유보 (리드 축적 후 재검토) |
| OPEN-04 | **확정 → RCF-D8** | `@onrent/*` |
| OPEN-05 | **리서치 완료 → 부록 A** | 렌트/리스 광고 규제 룰셋 후보 (2026-07-13 리서치) |
| OPEN-06 | **확정 → RCF-D10** | publication/mediaAppearance 미이식 · `press` 부활은 Phase 4 이후 |

**남은 사용자 액션 (코드 외)**: ① onrent.kr 레지스트라 등록 (+KIPRIS '온렌트' 확인) ② 신규 Supabase/Vercel 프로젝트 생성 + **도메인 연결 즉시 SA/GSC 등록** (원칙 1) ③ 첫 클라이언트 업체 확정 시 company_profile 실데이터·개인정보 보관기간 정책 확인 ④ 클라이언트가 리스 취급 시 **여신금융협회 등록번호 확보** (RCF-D11 ①) ⑤ 정보 콘텐츠+견적 CTA 결합의 금소법상 허용선 법률 자문 (부록 A §3-5) ⑥ **개인정보 처리 위수탁 계약 표준 템플릿 작성·체결** (RCF-D6 · §26① 법정 의무 — 재수탁 체인 포함) ⑦ 클라이언트 **스마트플레이스 등록 + 홈페이지 URL 연결** (원칙 8 — 공백기 유일한 네이버 내 유입 신호) ⑧ 노출 공백 기대치의 계약·커뮤니케이션 반영 (성과 기대치 섹션).

---

## 부록 C · 채널 운영 정책 + 측정 런북 (v2.1 신설)

### C-1. 네이버 블로그 위성 채널 정책

전제: 외부 독립 사이트는 오가닉 9.5%·AI 브리핑 인용 16.5%의 소수 지분 채널 — 초기 12주 노출 주력은 블로그일 가능성이 높다 (원칙 6). 신규 블로그도 C-rank 0 에서 시작하므로 "병행"은 선언이 아니라 운영 설계가 필요하다:

- **주체**: 클라이언트 업체 명의 공식 블로그 (Glitzy 는 콘텐츠 소재·가이드 제공 — 솔루션 범위 밖 운영은 클라이언트 책임임을 계약에 명시).
- **주제 배타 분할** (본체-위성 유사문서 역전 방지): 블로그 = 후기·경험·사례형 (출고 후기·상담 사례·차종 리뷰) / 사이트 = 산식·제도·1차 출처 인용형 (가이드 클러스터). **같은 키워드를 양쪽에서 타깃하지 않는다.**
- **링크 규칙**: 블로그 글 말미 → 사이트 관련 guide 딥링크 (요약+링크 원칙 — 본문 복제 금지). 사이트 → 블로그 링크는 불요.
- **측정**: 블로그 프로필의 AI 브리핑 인용수(네이버 제공)는 블로그 지표, 사이트는 C-2 런북으로 별도.

### C-2. 측정 런북

- **격주 SERP 스냅샷** (외부 사이트는 AI 브리핑 인용을 계측할 공식 지표가 없음): 정보형 상위 10 키워드에 대해 격주로 수동 검색 → 노출 여부 + 노출 판(웹문서/스마트블록/AI브리핑) 기록. keyword lib 에 스냅샷 기록 필드 확장 (Phase 4). 담당·요일 고정 (예: 격주 월요일).
- **NSA paste 케이던스**: 네이버 서치어드바이저 리포트는 90일 제한 — 격주 붙여넣기 누락 시 데이터 영구 소실. 어드민 검색노출 메뉴에 "마지막 NSA ingestion N일 경과" 경고 배지 (Phase 4). 멀티테넌트 확장 시 인스턴스 수에 선형 증가하는 수동 병목임을 인지 — 인스턴스 5개+ 시점에 자동화 재검토.
- **선행지표 사다리 판정** (성과 기대치 섹션): 색인 수 → 브랜드 → 논브랜드 → 순위. 12주 게이트 미달 시 전략 리뷰 트리거.

---

## 부록 A · 렌트/리스 광고 규제 룰셋 후보 (2026-07-13 리서치)

### A-0. 규제 지형 (룰 엔진 설계 전제)

| 영역 | 적용 법률 | 비고 |
|---|---|---|
| 장기렌트(자동차대여) 광고 | **표시광고법** 제3조 — 거짓·과장 / 기만 / 부당비교 / 비방 4유형 | 여객자동차법은 광고 특유 조항 없음 (등록 제28조 · 대여약관 신고 제31조) |
| 자동차리스 광고 | **금소법 제22조** — 리스(시설대여)·할부금융은 시행령상 "대출성 상품" | 여전법 제50조의9·10 은 캐피탈사 본인 적용 |
| 미등록자의 금융광고 | 금소법 제22조 제1항 + 미등록 대리·중개 영업 시 5년 이하 징역·2억원 이하 벌금 | RCF-D11 게이트의 근거 |
| 사이트 공통 | 전자상거래법(신원표시) · 개인정보보호법(§15·17·26) · 정보통신망법 §50(광고 수신동의) | |

의료광고법 엔진과의 구조 차이: 의료는 "금지표현" 중심, 렌트/리스는 **(a) 광고 주체 자격(리스), (b) 가격 표기 조건병기(기만 회피)** 가 축. **schema.json 검증 완료 (v2.1)**: `disposition` 필드는 없고 severity 4종(fail/content-gate/warning/info)뿐 — **스키마 확장 없이 severity + suggestion 필드 규약으로 매핑** (하단 매핑 표).

### A-1. 룰 후보 22종

리스크: High=법 위반 소지 명확 · Med=기만광고 판단 소지 · Low=운영 권고.

| # | rule-id | 트리거 예시 | 리스크 | 근거 | 처리 |
|---|---|---|---|---|---|
| 1 | `unregistered-lease-product-ad` | 미등록 인스턴스의 "리스 월 XX만원"·캐피탈 상품명+조건 노출 | **High** | 금소법 §22① | 금지 (RCF-D11 연동) |
| 2 | `lease-brokerage-signal` | "전 금융사 리스 비교 후 진행", "리스 승인까지 대행" | **High** | 금소법 미등록 대리·중개 (조문 요확인) | 금지 + 법률 검토 |
| 3 | `approval-guarantee` | "100% 승인", "전원 승인", "누구나 가능" | **High** | 금소법 §22④ + 불법금융광고 유형 | 금지 |
| 4 | `no-credit-screening` | "무심사", "심사 없이", "신용무관", "신용불량 OK" | **High** | 불법금융광고 유형 · 대부업법 §9의2 유추 | 금지 |
| 5 | `low-rate-vague` | "최저금리" (이자율 범위·산정방법 미표기) | **High** | 금소법 §22④4호 가목 | 금지/조건병기 |
| 6 | `daily-rate-framing` | "하루 커피 한 잔 값", "일 X천원" 환산 | Med~High | 금소법 §22④4호 나목 · 표시광고법 기만 | 조건병기 (월 총액) |
| 7 | `monthly-price-no-terms` | "월 XX만원" 단독 (기간·보증금·주행거리 없음) | Med | 표시광고법 §3①2호 기만 | 조건병기 (A-2) |
| 8 | `vat-ambiguous-price` | 부가세 포함 여부 불명시 가격 | Med | 표시광고법 기만 (실피해 다수) | 조건병기 (VAT 총액) |
| 9 | `zero-initial-cost` | "초기비용 0원" (보증금/선납 별도 존재) | Med~High | 표시광고법 거짓·과장/기만 | 조건병기/금지 |
| 10 | `free-claim` | "무료", "공짜", "0원 이벤트" (비용 전가) | Med | 표시광고법 거짓·과장/기만 | 조건병기 |
| 11 | `full-expense-deduction` | "전액 경비처리", "100% 비용처리" | **High** | 표시광고법 거짓·과장 (세법 한도 연 800만/1,500만 존재 — 조문 요확인) | 금지/조건병기 |
| 12 | `tax-saving-certainty` | "확실한 절세", "무조건 세금 절감" | Med | 표시광고법 거짓·과장 | 톤다운 (+세무상담 병기) |
| 13 | `lowest-price-guarantee` | "최저가 보장", "업계 최저가" | **High** | 표시광고법 §3①1호 (공정위 제재 사례) | 금지 (근거 없으면) |
| 14 | `superlative-no-basis` | "업계 1위", "국내 최대", "최다 출고" | Med | 표시광고법 거짓·과장 | 출처요구 (기준·시점) |
| 15 | `unfair-comparison` | "타사 대비 30% 저렴" (기준 미명시) | Med | 표시광고법 §3①3호 | 출처요구 |
| 16 | `competitor-disparage` | 타사 실명 + 부정 단정 | **High** | 표시광고법 §3①4호 | 금지 |
| 17 | `pre-screening-fixed-quote` | "심사 없이 확정 견적" | Med | 표시광고법 기만 · 금소법 오인 | 조건병기 ("심사 결과 변동") |
| 18 | `maturity-option-omit` | "만기 시 내 차" (인수가 미기재) | Med | 표시광고법 기만 | 조건병기 |
| 19 | `authority-endorsement-fake` | "정부 인증", "금감원 승인 업체" | **High** | 표시광고법 + 상호도용형 불법광고 | 금지 |
| 20 | `undisclosed-endorsement` | 대가성 후기·추천 광고 미표시 | Med | 추천·보증 심사지침 | 출처요구 (대가 표시) |
| 21 | `lead-form-privacy-notice-missing` | 견적 폼 법정 고지 4항목 누락 | **High** | 개인정보보호법 §15② | 조건병기 (폼 스펙) |
| 22 | `marketing-consent-bundled` | 마케팅 동의 필수 묶음 | Med | 개보법 동의 구분 + 정보통신망법 §50① | 조건병기 (분리) |

**룰 구현 평면 분리 (v2.1 — 비평 반영)**:
- **#21·#22 + `site-identity-missing` 은 룰 엔진 밖** — 엔진 입력은 markdown 본문이라 폼/Footer 구조가 존재하지 않음. vitest(폼 컴포넌트 고지 4항목 렌더 단정) + E2E smoke + seo-readiness 류 사이트 점검 항목으로 재배치. "룰셋 구현 완료" 판정은 #1~#20 기준.
- **조건병기 계열(#5·#7·#8·#18)은 부재(absence) 검출** — composite matcher 는 AND 전용(NOT 없음)이라 표현 불가 (RCF-D3 ②). 존재 강제는 PriceDisclosure 구조화 필드가 담당하고, 룰은 "본문 자유 텍스트 가격 표기 감지"(정규식 가능 — 감지 시 content-gate 로 구조화 블록 사용 유도)로 역할 축소.
- **#1·#2 는 인스턴스 조건부** (RCF-D3 ① 엔진 확장 전제) — "리스" 단독이 아니라 **(상품명|금융사명|월납입 수치|신청·상담 CTA) 조합 매칭** (AND 조합은 기존 composite 지원)으로 정보성 가이드 오탐 방지.

**disposition ↔ severity 매핑 확정 (v2.1 — 스키마 확장 없이 기존 severity + suggestion 필드 규약)**: 금지=`content-gate`(발행 차단) · 조건병기=`fail`(수정 요구 · suggestion 에 병기 문구 제시) · 출처요구=`warning`(suggestion 에 근거 링크 요구) · 톤다운=`warning`(suggestion 에 대체 문구). High 룰은 전부 content-gate.

### A-2. 가격 표기 병기 체크리스트 (PriceDisclosure 필드 SoT)

렌트(비금융)는 항목 열거 조항이 없으나 누락 시 표시광고법 기만 판단 소지 → 사실상 의무로 취급. 리스는 금소법 §22③3호 라목이 대출조건 표시를 법정 의무화 (세부는 시행령 — 요확인).

부가세 포함 총액 · 계약기간 · 보증금/선납금(율 또는 금액, "0원" 시 월납입 영향) · 연 약정거리(+초과 km당 단가) · 정비 포함 범위 · 보험 담보(면책금·한도) · 만기 옵션(인수가 산정 방식) · "심사 결과에 따라 변동" · 견적 기준(차종·트림·기준일) · 중도해지 위약금 존재 사실.

### A-3. 리스 취급 가능 여부 결론 (RCF-D11 근거)

미등록 렌트카 업체의 자사 사이트 리스 상품 광고·모집은 **원칙적 불가**. ① 리스=금소법상 대출성 상품 ② §22① 판매업자등 아닌 자의 광고 금지 ③ 모집은 대출성 상품 판매대리·중개업자 등록 필요(여신협회 — 리스·할부 모집인 3.1만명 등록) ④ 금융위 유권해석: 판매 과정 적극 개입 시 '광고 주체' — "가입 관련 비대면 서비스 제공" 문구는 위험 신호 ⑤ 일반적 제도 설명(정보 콘텐츠)은 '광고' 비해당 여지 있으나 **견적 CTA·리드 폼 결합 시 중개 평가 리스크 — 법률 검토 필요**.

### A-4. 요확인 5건 (룰 YAML 에 `verify: true` 플래그)

① 금소법 판매대리·중개업 등록 의무·벌칙 조문 번호 ② 금소법 시행령·감독규정의 대출성 상품 광고 세부 포함사항(경고문구 문안) ③ 「중요한 표시·광고사항 고시」 자동차대여 업종 포함 여부 ④ 업무용승용차 비용 한도 세법 조문(법인세법 §27의2 추정) ⑤ 개보법 제3자 제공 고지 조문(§17② 추정) ⑥ 판매대리·중개업자의 광고 시 등록 사실·번호 고지 의무 여부 (v2.1 추가).

### A-5. 핵심 출처

금소법 §22 (law.go.kr lsId 013704) · 금융위 금융광고규제 가이드라인 (fsc.go.kr 76045) · 금융위 유권해석 — 플랫폼 광고 주체 구분 (better.fsc.go.kr lawreqIdx 3933) · 대출모집인 등록 현황 (fsc.go.kr 77178) · 표시광고법 + 부당 표시·광고 유형 고시 (law.go.kr) · 자동차대여 표준약관 제10064호 (ftc.go.kr) · 불법금융광고 유형 (easylaw csmSeq 901) · 개보위 「렌터카 업무 개인정보 처리 가이드」 (privacy.go.kr FILE_000000000837358) · 소비자원 렌터카 피해 (kca.go.kr).

---

## 부록 B · 네이버 키워드·콘텐츠 전략 (2026-07-13 리서치)

### B-1. 헤드 키워드 지형 판정

2026-06 기준 네이버 모바일 SERP = "AI 브리핑 → 광고/쇼핑 → 오가닉" 재편 완료. 오가닉에서 네이버 생태계 90.5% · 커뮤니티 65.5% · **외부 독립 사이트 9.5%**. 장기렌트 헤드 키워드("장기렌트"·"장기렌트카 가격")는 파워링크 과열 + 3층 광고주(대형사 직영 / 비교 플랫폼 다나와·겟차·카눈 / 저신용 니치 중개) — **헤드 오가닉 진입은 비현실적**. AI 브리핑은 상업형(추천·비교) 질의에서 노출 제한, **"원인·이유·방법형" 정보 질의에서 안정 작동 + Top10 밖 문서도 인용**. 독립 사이트 진입 틈 = ① 정보형 롱테일 웹문서 ② 도구형 콘텐츠 ③ 1차 출처 인용형(GEO). **보정**: AI 브리핑의 네이버 내부 플랫폼 인용 우선 경향 → 네이버 블로그 위성 채널 병행 (노출 원칙 6).

### B-2. 롱테일 키워드 39종 (keyword_target 초기 등록분)

| # | 키워드 | 의도 | 유형 | Pillar |
|---|---|---|---|---|
| 1 | 장기렌트 리스 차이 | 비교 | 가이드(Pillar급) | P1 |
| 2 | 장기렌트 단점 (현실) | 정보 | 칼럼 | P1 |
| 3 | 장기렌트 하지마라 이유 | 정보 | 칼럼 | P1 |
| 4 | 장기렌트 심사 기준 신용점수 | 정보 | 가이드+FAQ | P1 |
| 5 | 장기렌트 신용등급 영향 | 정보 | FAQ | P1 |
| 6 | 장기렌트 선납금 보증금 차이 | 정보 | 가이드 | P1 |
| 7 | 장기렌트 초기비용 무보증 | 정보 | 가이드 | P1 |
| 8 | 하 허 호 번호판 의미 | 정보 | 칼럼 | P1 |
| 9 | 장기렌트 보험경력 인정 | 정보 | 가이드 (금융위 2024.4 인용) | P1 |
| 10 | 장기렌트 사고 처리 절차 | 정보 | 가이드 | P1 |
| 11 | 장기렌트 면책금 자기부담금 차이 | 정보 | FAQ | P1 |
| 12 | 장기렌트 약정거리 초과 비용 | 정보 | FAQ+도구 | P1 |
| 13 | 장기렌트 중도해지 위약금 계산 | 정보 | 가이드+도구 | P1 |
| 14 | 장기렌트 승계 방법 | 정보/전환 | 가이드 | P1 |
| 15 | 장기렌트 만기 인수 vs 반납 | 비교 | 가이드+도구 | P1 |
| 16 | 장기렌트 잔존가치 뜻 | 정보 | FAQ | P1 |
| 17 | 중고차 장기렌트 단점 | 정보/비교 | 칼럼 | P1 |
| 18 | 월렌트 장기렌트 차이 | 비교 | 가이드 | P1 |
| 19 | 장기렌트 포함 내역 (세금·보험·정비) | 정보 | FAQ | P1 |
| 20 | 운용리스 금융리스 차이 | 비교 | 가이드(Pillar급) | P2 |
| 21 | 자동차리스 장단점 | 정보 | 칼럼 | P2 |
| 22 | 리스 승계 절차 | 정보/전환 | 가이드 | P2 |
| 23 | 리스 중도해지 위약금 규정손해금 | 정보 | 가이드 | P2 |
| 24 | 자동차리스 신용등급 영향 | 정보 | FAQ | P2 |
| 25 | 리스 만기 인수·반납·재리스 | 정보 | 가이드 | P2 |
| 26 | 리스 번호판 일반 번호판 | 정보 | FAQ | P2 |
| 27 | 개인사업자 장기렌트 경비처리 한도 | 정보 | 가이드(Pillar급 · 국세청 인용) | P3 |
| 28 | 장기렌트 부가세 환급 조건 차종 | 정보 | FAQ | P3 |
| 29 | 법인 장기렌트 비용처리 1500만원 한도 | 정보 | 가이드 | P3 |
| 30 | 업무용승용차 운행기록부 작성법 | 정보 | 가이드+양식 | P3 |
| 31 | 법인차 임직원 전용보험 | 정보 | FAQ | P3 |
| 32 | 사업자 구매 vs 장기렌트 vs 리스 절세 | 비교 | 가이드+도구 | P3 |
| 33 | 장기렌트 종합소득세 절세 효과 | 정보 | 칼럼 | P3 |
| 34 | 사회초년생 첫차 장기렌트 | 정보/전환 | 칼럼 | P4 |
| 35 | 저신용 장기렌트 조건 (무보증 실체) | 정보/전환 | 가이드 | P4 |
| 36 | 신용회복 개인회생 장기렌트 가능 | 정보/전환 | FAQ | P4 |
| 37 | 무직자 장기렌트 조건 | 정보/전환 | FAQ | P4 |
| 38 | 전기차 장기렌트 보조금 적용 | 정보 | 가이드 (ev.or.kr 인용) | P4 |
| 39 | 전기차 장기렌트 단점 | 정보 | 칼럼 | P4 |

키워드당 1편 원칙 (RCF-S4). **앵글 분리 주의**: #2/#3 (단점 나열 vs 반박·판단 기준), #13/#14 (위약금 산식 vs 승계 절차) — 본문 중복 시 유사문서 리스크. 앵글은 `keyword_target.angle` 필드에 저장해 프롬프트 강제 주입.

**유형 재배정 (v2.1 — 표의 유형 열은 다음 규칙으로 해석)**: 키워드 타깃 콘텐츠의 **primary 는 전부 guide** (RCF-S4). 표의 "칼럼" = guide 로 발행하되 앵글이 칼럼형인 것, "FAQ" = guide 본문 내 FAQ 블록 + `/faq` 발췌 (독립 FAQ 항목은 네이버 웹문서 판에서 랭킹할 URL 실체가 없음 — 11개 키워드를 랭킹 불가 표면에 배정하지 않는다), "도구" = guide 임베드 블록 (RCF-S7). `insights` 아티클은 키워드 비타깃 소재 전용.

### B-3. 콘텐츠 갭 = 기회

현 롱테일 점유 4군: ① 애드센스 블로그팜(AI 양산 저품질 — 품질로 이기기 가장 쉬움) ② 업체 콘텐츠 허브(겟차·이어카·차즘 — 전환 유도형, 중립성 없음) ③ 핀테크/세무 서비스(품질 높으나 렌트 전문성 낮음) ④ 커뮤니티·위키. **핵심 갭 = 1차 출처 인용 웹문서 부재**: 금융위(보험경력 인정 2024.4) · 국세청(업무용승용차 연 800만+1,500만 한도) · 공정위(표준약관) · 소비자원(피해 3년 957건) · ev.or.kr(전기차 보조금) — 전부 인용 가능한데 체계적으로 인용한 콘텐츠가 없음. 세부 기회: 저신용/무심사 정직 해설 · 위약금/승계(이어카 독점 → 중립 산식+계산기 침투) · 사업자 세금.

### B-4. 도구형 경쟁 공백 (RCF-S7 우선순위 근거)

견적/가격 비교 = 다나와·카눈 강점 (진입 비추천) · 위약금 계산기 = 영세 (기회) · **인수 vs 반납 판단기 = 사실상 부재 (최대 기회)** · 총비용 비교/주행거리 정산/절세 시뮬레이터 = 부재 (기회) · 월 납입금 계산기 = 영세 (보통).

### B-5. Pillar/Spoke 클러스터 (guide_page 4 Pillar)

**URL 은 현행 라우팅 구조 유지 — flat `/guides/[slug]` + `pillar_slug` 컬럼으로 클러스터 표현** (리서치 원안의 2-depth URL 은 라우트 구조 변경 비용 대비 이득 없음. 내부링크 브리지가 pillar 매칭으로 클러스터를 만들므로 URL depth 불필요).

- **P1 `long-term-rental`** (장기렌트 완전 가이드): rental-vs-lease · disadvantages · screening-credit-score · deposit-vs-prepayment · ha-heo-ho-plate · insurance-career-recognition · accident-deductible · mileage-overage · early-termination-penalty · contract-succession · buyout-vs-return · residual-value · used-car-rental · monthly-vs-long-term
- **P2 `car-lease`** (자동차리스): operating-vs-financial · pros-and-cons · lease-succession · early-termination · credit-impact · maturity-options · normal-plate
- **P3 `business-tax`** (사업자 세금·경비): sole-proprietor-expense · vat-refund · corporate-expense-limit · driving-logbook · employee-only-insurance · buy-vs-rent-vs-lease · income-tax-saving
- **P4 `situations`** (상황별): first-car-new-employee · low-credit-rental · credit-recovery-rental · no-income-rental · ev-rental-subsidy · ev-rental-disadvantages
- **도구 블록 (독립 URL 없음 — v2.1 RCF-S7)**: 위약금 계산기→early-termination-penalty · 인수vs반납 판단기→buyout-vs-return · 총비용 비교→buy-vs-rent-vs-lease · 주행거리 정산→mileage-overage · 절세 시뮬레이터→sole-proprietor-expense 각 guide 에 임베드

내부링크: P1↔P2 (렌트/리스 비교축) · P3→P1/P2 (세금→상품) · 도구 보유 guide ↔ 인접 guide 양방향 · guide→service (전환 동선 A). service_page 의 pillar_slug 와 guide 카테고리 pillar 를 매칭시켜 기존 클러스터 브리지(`site-cluster-links`) 재사용.

### B-6. 콘텐츠 표준 (노출 원칙 7 상세)

AI 브리핑 인용 문서에서 **검증된 것은 구조**: 첫 문단 질의 직답 · 소제목 2~7개 · 출처 명시 (인용 문서의 출처 표기 비율 최대 50% — 절반은 출처조차 없다는 뜻). 분량은 **3,000~5,000자** (v2.1 — 리서치 원문의 6,000~8,000자 관찰치는 상관관계일 뿐 검증된 랭킹 요인이 아니며, 장문 상향은 환각 표면적·인접 키워드 본문 중복·규제 검토 부담을 키움). 발행 페이싱(원칙 2)과 결합: P1 Pillar급(1·13·15·27) 우선 발행 → Spoke 순차.

### B-7. 핵심 출처

seonews.co.kr 2026-06 네이버 검색 리포트 · AI 브리핑 노출 규칙/GEO 분석 · ampm.co.kr 장기렌트 검색광고 실무 · fsc.go.kr 보험경력 인정 · nts.go.kr 업무용승용차 Q&A · ftc.go.kr 표준약관 · kca.go.kr 렌터카 피해 · ev.or.kr 보조금 · 경쟁 표본(겟차·이어카·차즘·다나와·카눈·mycals 등).
