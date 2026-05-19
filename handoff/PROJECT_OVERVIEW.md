# Website Exposure — 프로젝트 개요 (외부 전달용)

> **목적**: 본 문서는 솔루션이 *왜* 그렇게 설계되었고, *어떤 이론·구조*로 구현되고 있는지를 외부 이해관계자(파트너·법무·검수자·후속 합류 인력)에게 전달하기 위한 컴팩트 요약본이다.
> **상태**: v1.0 (2026-05-18)
> **상세 SoT**: `docs/ARCHITECTURE.md` 외 30+ 명세 문서. 본 문서는 그 표면을 다룬다.

---

## 1. 무엇을 만드는가

**네이버 검색 신뢰도 강화 흐름(2025~2026)**에 대응하는 **의료기관 웹사이트 솔루션**.

- 1호 클라이언트: 다이어트 한의원 (실재) — 의료광고 표현 리스크가 큰 영역. 여기를 통과한 표준은 다른 의료기관에 이식 가능.
- 배포 모델: **고객 도메인 독립 배포** (병원이 자체 도메인 보유, 솔루션이 그 위에 배포).
- 운영 모델: **Glitzy 전담·함께 운영** (콘텐츠 작성·발행은 Glitzy 대행, 클라이언트가 검토·승인).

> 표현 주의: "검색 노출 보장"은 사용하지 않는다. 솔루션은 **기술적·콘텐츠적 준비 상태를 표준화**한다.

---

## 2. 응답하는 외부 환경 (요약)

| 변화 | 내용 | 확신도 |
|---|---|---|
| AI 브리핑 (2025-03-27 출시) | 생성형 AI 검색 답변·출처 제공 | 검증됨 |
| 통합 랭킹 모델 (2025-11~) | 웹·블로그·카페·지식인·동영상 한 영역, 신뢰도 정렬 | 네이버 공식 |
| VLM 평가 | 시각적 요소까지 신뢰도 판단 | 네이버 공식 |
| AI 사이트 브리핑 / AI 스니펫 | 출처 메타 기반 자동 설명·답변 추출 | 검증됨 |
| 측정 효과 | 공공기관 +77.2%, 학술·연구 +30.7% (네이버 자체 측정) | 자체 측정치 |

→ 솔루션이 표준화해야 할 본질 7가지: ① 자체 도메인의 공식성 신호 ② JSON-LD 구조화 데이터 ③ VLM 부합 신뢰도 톤 ④ AI 브리핑 인용 가능 메타 ⑤ AI 스니펫 추출 가능 구조 ⑥ E-E-A-T 신호 노출 ⑦ 의료광고법·심의 준수.

---

## 3. 핵심 이론 — 두 평면 × 3 레이어 × Feature Modules

### 3.1 Control Plane / Data Plane 분리

```
[Control Plane = 어드민]                  [Data Plane = 빌드·사이트]
- 운영 상태·권한·승인·감사 원본       →  - Git 콘텐츠 원본 + CI/CD + 정적 사이트
- 컴플라이언스 게이트 강제                - 어드민이 죽어도 사이트는 동작
- 발행·롤백 트리거                        - Git 파일로 산출되어 빌드 입력
```

**원칙**: 사이트 빌드 입력은 모두 **버전 관리 가능한 파일**(Git). 운영 상태·권한·승인·감사·알림 이력은 **어드민 DB 원본**.

### 3.2 3-레이어 (선형 비증가)

```
L1. Core    — 모든 클라이언트 공유 (스키마·표준·게이트·렌더링 룰)
L2. Preset  — 업종별 (한의원·치과 …)
L3. Instance — 클라이언트별 데이터 + 선택 장착 Module
```

- **단방향 참조**: L3 → L2 → L1.
- **계약 기반**: 22개 데이터 계약(C-01~C-22) + 3개 공통 타입(CT-01~CT-03)만 노출.
- **선형 비증가**: 클라이언트가 늘어도 Core/Preset 코드는 선형으로 늘지 않는다.
- **추상화는 두 번째 사용에서**: 첫 클라이언트는 그대로 작성, 두 번째에서 패턴 추출.

### 3.3 Feature Modules (직각 차원, 8개)

Instance가 선택 장착. 가격 차등 위치.

| 모듈 | 책임 |
|---|---|
| **compliance-assistant** | 의료광고법 표현 리스크 자동 검수 (룰 + LLM) |
| **notifications** | 발행·검수·알림 (이메일·슬랙·SMS), idempotent envelope |
| **analytics-reporting** | GSC·네이버 서치어드바이저·GA4 연동 + 자동 리포트 |
| **search-visibility** | 사이트 전체 검색 가시성 (AI 브리핑 인용·통합 영역 진입 등) |
| **keyword-monitoring** | 사용자 지정 N개 키워드 순위·노출·CTR 모니터링 |
| **asset-ingestion** | 외부 자료 수집·파싱·PII·태깅·검수·promote |
| **crm-sync** | CRM·환자관리 시스템 양방향 동기화 |
| **content-migration** | 솔루션 내부 마이그레이션 (plan kind 6종·rollbackClass 3종) |

→ 8개 Feature 명세 전체 acceptance 완료 (44 cycle 570 지적 누계).

---

## 4. UI 차별화 이론 — "제약된 자유"

```
[고정 영역 — 신뢰도 톤 유지]            [가변 영역 — 브랜드 차별화]
- 정보 위계·시맨틱 구조 룰              - 디자인 토큰 (Core 변수 → Instance 값)
- 페이지 타입 정보 슬롯                 - 레이아웃·컴포넌트 변형 카탈로그
- 광고성 시각 요소 금지 룰              - 브랜드 페르소나 모드
- 접근성·성능 기준                      - 실제 사진·이미지
```

> 옷장 비유: Core가 옷걸이·치수 규격을 제공하고, Instance는 그 안에서 옷을 고른다.

DESIGN_TOKENS v1.0: 3-tier 토큰 · 4파일 SoT · 22 컬러 필드 · 접근성 30 쌍 자동 검증.

---

## 5. 컴플라이언스 — 의료광고법 게이트

### 5.1 RiskLevel 3등급 + 4 승인 역할

| 등급 | 자동검수 | 동료검수 | 의료진승인 | 법무자문 |
|---|:---:|:---:|:---:|:---:|
| **Low** (진료시간·소식·약도) | ✅ | ✅ | 선택 | 불필요 |
| **Medium** (시술 원리·예방법) | ✅ | ✅ | ✅ | 선택 |
| **High** (치료효과·후기·전후·가격) | ✅ | ✅ | ✅ | ✅ |

### 5.2 게이트 흐름

```
작성 → 위험도 분류 → 자동 검수 → 동료 검수 → 등급별 추가 승인 → 심의 필요성 판단 → 발행
```

### 5.3 SoT 인용

`MEDICAL_AD_COMPLIANCE_COMMON v1.0` — 의료법 제56조제2항 15호, 시행령 제23조·제24조 인용. `legalBasis[]` 패턴으로 모든 룰이 법조문 출처를 보존.

### 5.4 ComplianceRecord

- 검수자·시각·승인 로그 = **어드민 DB 원본** (감사 증빙 진실).
- 위험도·심의통과 플래그·발행일 = DB 마스터 → **Git 사본** (빌드 참조).

---

## 6. 구현 단계 — Vertical Slice → M0/M1/M2/M3

**Admin-first 점진 구축**. 처음부터 풀어드민을 만들지 않는다.

| 단계 | 범위 |
|---|---|
| **M0 — Vertical Slice** | 6 화면 (대시보드 · ClinicProfile · Doctor · Treatment · Article · Preview/발행), 처음부터 끝까지 한 줄 관통 |
| **M1 — Phase Alpha** | Slice 직후 합류 기능 |
| **M2 — Phase Beta** | 2~5호 클라이언트 동시 운영 |
| **M3 — Phase GA** | 제품화 완성 |

### Phase 0 — Spike 5종 (Week 1~2 검증)

| Spike | 검증 가설 | 상태 |
|---|---|---|
| **A** | Single DB + RLS + `withTenantTransaction` | LOCAL_PASS |
| **B** | Outbox SKIP LOCKED + idempotent at-least-once with exactly-once observable | LOCAL_PASS |
| **C** | Storage (R2/MinIO) per-instance policy + TTL-bound signed URL | LOCAL_PASS |
| **D** | Drizzle Kit + advisory lock + expand/contract migration | LOCAL_PASS |
| **E** | Magic link CAS + HMAC session + `resolveTenantContext` | LOCAL_PASS |

---

## 7. 모노레포 구조 (현재)

```
website-exposure/
├── apps/
│   ├── web/                    ← Next.js 14 (Admin Control Plane + Public Site Data Plane)
│   └── spike-{a,b,c-local,d,e}/  ← Phase 0 검증 prototype (PASS 완료)
├── packages/
│   ├── core-content/           ← C-01~C-22 entities + migrations
│   ├── db/                     ← D0010 Instance 외 / Drizzle 스키마
│   ├── auth/                   ← 자체 magic link + session (Auth.js DrizzleAdapter shape)
│   ├── migrations-runner/      ← advisory lock + manifest 기반
│   ├── notifications-outbox/   ← Spike B 승격
│   ├── storage/                ← Spike C 승격 (R2)
│   ├── shared-errors/
│   └── shared-types/
└── docs/                       ← 30+ 명세 SoT
    ├── ARCHITECTURE.md         ← 최상위
    ├── core/  (7 docs)         ← PAGE_TYPES, DATA_MODEL, SCHEMA_MAPPING, DESIGN_TOKENS,
    │                              CONTENT_STANDARDS, SEARCH_STANDARDIZATION
    ├── admin/ (2 docs)         ← ARCHITECTURE, REVIEW_WORKFLOW
    ├── features/ (8 docs)      ← Feature Module 명세
    ├── compliance/ (2 docs)    ← RISK_LEVELS, MEDICAL_AD_COMPLIANCE_COMMON
    ├── decisions/              ← Plan 문서 (PSR · LL · ADMIN_UI_SKELETON · M0 · INFRA · ...)
    └── research/               ← 네이버 검색 변화 외부 자료 분석
```

---

## 8. 인프라 결정 (요약)

| 영역 | 결정 |
|---|---|
| **Multi-tenant** | Single DB + RLS + `withTenantTransaction` + `scopedDb` brand |
| **Provider** | Resend(이메일) · Sentry(에러) · Upstash(Redis) · Postgres hard quota |
| **Storage** | **Cloudflare R2** (Supabase Storage 결정 번복) |
| **Phase 0 게이트** | Week 1 Spike A·B·C gate + P0 patterns + legal-reviewer 단계 |
| **개인정보** | PIPA + GDPR 동시 대응 (internal beta 한정 workflow validation) |

---

## 9. 데이터 계약 인벤토리 (22 + 3)

**Core L1·L3 계약 (22개)**:
- 정체성: C-01 ClinicProfile · C-21 LocationProfile · C-02 DoctorProfile
- 콘텐츠: C-03 TreatmentPage · C-04 Article · C-11 MedicalConditionPage · C-12 FAQ · C-17 PricingPage · C-18 FacilitiesPage · C-19 NewsItem · C-20 ReservationPage
- 운영: C-05 RiskLevel · C-06 PageMeta · C-07 BrandTokens · C-08 InstanceManifest · C-09 FeatureModuleConfig · C-10 ComplianceRecord · C-13 ReviewPolicy · C-14 MedicalSpecialty · C-15 SchemaInput · C-16 LegalDocument · C-22 ArticleCategory

**공통 타입 (CT)**:
- CT-01 TrustMetric · CT-02 BusinessHours · CT-03 CTAConfig

---

## 10. 품질 보증 이론 — Codex 자동 비평 사이클

각 명세·코드는 **Codex CLI 자동 비평**으로 다중 사이클 수렴하여 acceptance 한다.

- **수렴 기준**: 5차 고정이 아닌 `closeableAfterPatch` 신호 기반 (6·7차 가능).
- **누계 (2026-05-18 기준)**: 133 cycle, 1,167 지적 수용.
- **SoT cascade 패턴**: 한 명세가 변경되면 의존 SoT 명세도 동시 cascade patch (예: LOCATION_LEGAL → ADMIN-UI/DATA_MODEL/migrations-runner).

### 주요 acceptance 마일스톤

| 영역 | 도달 명세 |
|---|---|
| Core | SCHEMA_MAPPING v1.0 · SEARCH_STANDARDIZATION v1.0 · CONTENT_STANDARDS v1.3 · RISK_LEVELS v1.2 · MEDICAL_AD_COMMON v1.0 · DESIGN_TOKENS v1.0 |
| Admin | REVIEW_WORKFLOW v1.0 (상태 머신 9종 · 검수 큐 3종 · multi-role AND 게이트) |
| Feature | 8/8 Feature 모두 v1.0 acceptance |
| Infra | 인프라 결정 v1.0 · Spike 계획 v1.0 · Spike A·B·C·D·E LOCAL_PASS · Packages 골격/추출 v1.0 |
| Code | M0 schema · Admin UI walking skeleton · 3 entity forms · Onboarding URL scrape · LOCATION_LEGAL plan + code · PUBLIC_SITE_RENDER plan |

---

## 11. 외부 전달 시 주의

1. **표현 리스크 어휘 금지**: "보장", "최고", "유일", "회피" 등.
2. **F/I 분리**: 사실(F)과 내부 추론(I)을 섞지 않는다. 외부 공유 시 "내부 추론" 명시.
3. **법조문 인용**: 의료광고 관련 주장은 `legalBasis[]` 인용을 동반한다.
4. **버전 명시**: 명세는 SemVer, Instance는 `InstanceManifest`에 Core·Preset·Module 버전을 고정.

---

## 12. 한 문장 요약

> 네이버 검색 신뢰도 강화 흐름에 정렬된 의료기관 웹사이트 솔루션을, **Control Plane(어드민) / Data Plane(빌드·사이트)** 분리와 **3-레이어(Core·Preset·Instance) + 8 Feature Modules** 위에, **의료광고법 컴플라이언스 게이트**를 1급 시민으로 두고, **Admin-first Vertical Slice**로 점진 구축한다.
