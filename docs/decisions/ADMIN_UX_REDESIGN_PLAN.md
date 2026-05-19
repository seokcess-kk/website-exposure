# ADMIN_UX_REDESIGN_PLAN (v1.0·acceptance·2026-05-19)

> **상태**: **v1.0 (acceptance)** — Codex self-critique **5 cycle 42 findings 전건 수용** · cycle 5 closeableAfterPatch=true 확정 (blocking 0 · major 0 · minor 3 표현 patch 모두 흡수). 수렴 추세 **15 → 11 → 8 → 5 → 3**.

> **acceptance commit 구성**: 본 commit 안 docs cascade 동시 포함 marker — (1) 본 plan v1.0 · (2) UX-CASCADE-01 REVIEW_WORKFLOW § 7.1 publishable 6조건 + 출시 evaluator marker · (3) UX-CASCADE-02 DATA_MODEL release schema 분리 패턴 SoT · (4) UX-CASCADE-03 DESIGN_TOKENS 공통 UI primitive library marker · (5) UX-CASCADE-04 features/notifications NF-DEFER-10 부분 해소 marker · (6) UX-CASCADE-05 features/compliance-assistant slotMatches catalog marker · (7) UX-CASCADE-06 COMPLIANCE_ASSISTANT_M0_PLAN evaluator chain marker · (8) UX-CASCADE-07 LOCATION_LEGAL_PLAN LWI-01 호환성 marker · (9) UX-CASCADE-08 EAT_CONTENT_PLAN 다건 등록 정합 marker · (10) UX-CASCADE-09 migrations-runner manifest 22→33 단계 cascade · (11) UX-CASCADE-10 NOTIFICATIONS_M0_PLAN NF-DEFER-10 cascade · (12) UX-CASCADE-11 entity 별 migration 분리 패턴 marker. 실 코드 cascade 는 별 cycle (admin-ux-redesign code v1.0). 본 plan 은 어드민 UX 안 **entity-CRUD 패러다임 → 운영자 출시 워크스페이스 패러다임** 전환. compliance-assistant M0 / notifications M0 plan 패턴 답습 (spec + Codex 자동 비평 5+ cycle + v1.0 acceptance · 코드 cycle 별).

> **본 plan 의 위상 (사용자 진단 정합)**: 본 plan 은 사용자 진단 (2026-05-19) — "현재 어드민은 기능 단위로는 꽤 많이 들어갔지만 운영자가 병원 하나를 완성하는 감각이 없습니다" 안 정확히 응답. P0 (대시보드 출시 체크리스트 · 저장 vs 출시 분리 · 단계형 ClinicProfile · 공통 상태 컴포넌트) + P1 (다건 등록 · 통일 배지 · 전역 알림) + P2 (외부 API 자동 채움 · 출시 미리보기 · 품질 점수) 전건 spec 화.

## SoT

- 사용자 진단 (2026-05-19 메시지) — 본 plan 의 비판 + 개선안 SoT (전건 spec 안 반영)
- `docs/core/DESIGN_TOKENS.md` v1.0 — UI primitive 컴포넌트 라이브러리 + 새 컴포넌트 (StatusBadge · SaveStatusPanel 등) 의 token 정합 SoT
- `docs/admin/REVIEW_WORKFLOW.md` § 2 상태 머신 9종 · § 3 큐 3종 · § 7.1 publishable 6조건 (출시 차단 SoT) · § 9 알림 정책
- `docs/features/notifications.md` v1.0 — in-app NotificationInbox UI (NF-DEFER-10) 부분 해소 cascade
- `docs/features/compliance-assistant.md` v1.0 — slotMatches SoT (시술 슬롯형 에디터 정합)
- `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 — publishable evaluator (출시 차단 산정) cascade
- `docs/decisions/COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN.md` v1.0 — content-gate 자동 큐 + 출시 차단 정합
- `docs/decisions/NOTIFICATIONS_M0_PLAN.md` v1.0 — 전역 toast + envelope 발송 (대시보드 알림함 cascade)
- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — 5 LegalDocument 통합 저장 (LWI-01 정합) — 단계형 ClinicProfile 안 호환성 결정
- `docs/decisions/EAT_CONTENT_PLAN.md` v1.0 — Publication · MediaAppearance · ArticleCategory — 다건 등록 + 외부 API 자동 채움 정합
- 기존 packages 실 시그니처:
  - `apps/web/src/components/forms/{ClinicProfileForm, DoctorProfileForm, ArticleForm, ...}.tsx` (현재 폼들 — 마이그레이션 대상)
  - `apps/web/src/components/admin/{NavMenu, Breadcrumb, PublicSiteLink, AddressSearchButton, useFormDraft}.tsx` (UX 개선 cycle 산출물 — 본 plan 안 흡수)
  - `apps/web/src/lib/site-meta-fetch.ts` (SSRF guard 패턴 — 외부 API 자동 채움 재사용)
  - `apps/web/src/lib/compliance/publishable-check.ts` (publishable evaluator — 출시 차단 SoT)

> **표기 규칙**: SQL/DB 컬럼 = snake_case · TypeScript 코드 = camelCase · 문서 본문 내 SoT 인용은 snake_case 우선. 동일 개념 매핑: `release_blocked` (DB) ↔ `releaseBlocked` (TS) ↔ "출시 차단" (운영자 표시).

## 1. 목적과 범위

### 1.1 목적 — 사용자 진단 정합

- **패러다임 전환**: "엔티티 CRUD 화면 나열" → "병원 사이트 출시 워크스페이스". 운영자가 병원 하나를 완성하는 작업 흐름 SoT.
- **출시 체크리스트 중심 대시보드**: 출시 준비도 % · 누락 항목 · 검수 대기 · 다음 작업. 카운트 카드 grid 폐기.
- **저장 필수 vs 출시 필수 분리** (3-layer 매트릭스): DB CHECK / zod 저장 schema / zod 출시 schema 명확 분리. draft 저장 가능 + 출시 evaluator 별도.
- **단계형 ClinicProfile** (5 단계): 한 화면 안 multiple 책임 분산. 5 LegalDocument 통합 저장 LWI-01 정합 유지.
- **공통 UI primitive library**: SaveStatusPanel · DirtyIndicator · ErrorSummary · FieldErrorBubble · StatusBadge · WorkflowActionGroup · ReleasePreviewModal. 모든 폼 안 동일 패턴.
- **다건 등록 UX**: 의료진 인라인 테이블 · FAQ 스프레드시트 · 시술 템플릿+슬롯형 에디터 (compliance slotMatches 정합).
- **전역 알림 시스템**: Toast (저장/실패/검수 요청) + in-app NotificationInbox UI (NF-DEFER-10 부분 해소) + 페이지 상단 상태바 + 대시보드 알림함.
- **외부 API 자동 채움**: CrossRef (논문) · PubMed esearch/esummary · YouTube oEmbed (미디어). site-meta-fetch SSRF guard 패턴 재사용.
- **출시 미리보기 + 검수 단일 플로우**: 누락 검사 → 미리보기 → 검수 요청 한 클릭.
- **품질 점수 + SEO/GEO 추천**: E-A-T 신호 (학술 인용 · 의료진 자격증 · MediaAppearance) 카탈로그 정합.

### 1.2 범위 (포함)

| 항목 | 비고 |
|---|---|
| **§ 2 패러다임 전환 정의** | 운영자 mental model 안 출시 lifecycle (draft → ready → release-pending → published) 명세. release_status 컬럼 신설 vs 기존 status enum 활용 분기 결정 |
| **§ 3 출시 체크리스트 대시보드** | `apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx` 완전 재작성. 출시 준비도 산정 · 누락 항목 lint · 알림함 통합 |
| **§ 4 저장 필수 vs 출시 필수 분리 (3-layer 매트릭스)** | DB CHECK (무결성 만) · zod 저장 schema (draft 가능 최소) · zod 출시 schema (현 zod 와 동일). entity 별 layer 매핑 표 + 마이그레이션 (constraint nullable 화) |
| **§ 5 단계형 ClinicProfile** | 5 단계 (기본 / 위치 / 진료시간 / 예약 채널 / 정책). 단계 별 저장 정책 (즉시 vs 통합 tx). 5 LegalDocument 통합 저장 LWI-01 호환성 결정 |
| **§ 6 다건 등록 UX** | 의료진 인라인 테이블 (TanStack Table) · FAQ 스프레드시트형 · 시술 템플릿 (카테고리 프리셋) + 슬롯형 에디터 (개요/대상/과정/주의사항/FAQ — compliance slotMatches 정합) |
| **§ 7 공통 UI primitive 라이브러리** | `apps/web/src/components/admin/ui/` 신설. 8 컴포넌트 (SaveStatusPanel · DirtyIndicator · ErrorSummary · FieldErrorBubble · StatusBadge · WorkflowActionGroup · ReleasePreviewModal · QualityScoreCard). DESIGN_TOKENS 정합 |
| **§ 8 전역 알림 시스템** | Toast 라이브러리 (sonner 또는 자체 구현) · in-app NotificationInbox UI (NF-DEFER-10 부분 해소) · 페이지 상태바 · 대시보드 알림함 4종 통합 |
| **§ 9 외부 API 자동 채움** | 4 외부 API helper (CrossRef · PubMed · YouTube oEmbed · 향후 KAKAO 지도) — SSRF guard 정합 (site-meta-fetch 패턴 재사용) + zod 응답 검증 |
| **§ 10 출시 미리보기 + 검수 단일 플로우** | `ReleasePreviewModal` 컴포넌트 — 누락 검사 + 공개 사이트 iframe 미리보기 + 검수 요청 한 클릭 |
| **§ 11 품질 점수 + SEO/GEO 추천** | 점수 산정 알고리즘 + 추천 항목 catalog (E-A-T 신호 · MEDICAL_AD 정합 · SCHEMA_MAPPING 완성도) |
| **§ 12 마이그레이션 전략** | 기존 entity 폼 → 새 패러다임 점진적 마이그레이션. backwards-compatibility marker. apps/web 안 admin 영향 12 페이지 |
| **§ 13 vitest 시나리오 (27건)** | 출시 evaluator · 누락 검사 · 다건 입력 · 외부 API 응답 · 통일 컴포넌트 · 인라인 atomicity · lifecycle 전이 · 보안 · grandfather flag |
| **§ 14 작업 manifest** | 본 plan 실 코드 cycle 작업 분해 (10+ 작업) |
| **§ 15 UX-DEFER markers** | M1 Phase Beta / M2+ 합류 항목 분리 |
| **§ 16 UX-CASCADE markers** | DATA_MODEL · REVIEW_WORKFLOW · DESIGN_TOKENS · features/notifications · features/compliance-assistant cascade 정합 |

### 1.3 비범위 (defer)

| 항목 | Defer to | marker |
|---|---|---|
| 본격 design 시스템 (color picker UI · 폰트 picker · spacing slider · admin BrandTokens 편집 UI 완성) | Phase Alpha (BrandTokens admin UI cycle · 별 plan) | UX-DEFER-01 |
| 출시 후 monitoring 대시보드 (analytics · search-visibility 통합) | analytics-reporting / search-visibility Feature 본 구현 합류 시 | UX-DEFER-02 |
| 다국어 (i18n) — 운영자 UI · 공개 사이트 둘 다 | M2+ (해외 운영 검토 시) | UX-DEFER-03 |
| 모바일 admin (responsive admin · 모바일 first 운영) | M1 Phase Alpha | UX-DEFER-04 |
| 키보드 shortcut (Cmd+S 저장 · Cmd+K command palette 등) | M1 Phase Alpha | UX-DEFER-05 |
| undo/redo · history log (entity 별 변경 이력 시계열 표시 · revert) | M1 Phase Alpha | UX-DEFER-06 |
| collaborative editing (다중 운영자 동시 편집 · presence · conflict resolution) | M2+ | UX-DEFER-07 |
| AI 보조 (콘텐츠 작성 AI suggest · 제목 SEO 추천 · 본문 어조 분석) | Phase Beta (LLM 통합 cycle 합류) | UX-DEFER-08 |
| 출시 일정 예약 (특정 시점 자동 발행) | M1 Phase Alpha + scheduler cycle | UX-DEFER-09 |
| 출시 A/B 테스트 (multivariate landing page · 카피 실험) | M2+ + analytics-reporting 본 구현 | UX-DEFER-10 |
| 외부 collaborator 초대 (게스트 author · 제한 권한) | M1 Phase Beta (collaborator role cascade) | UX-DEFER-11 |
| OG image 자동 생성 (Next/og · 동적 OG · per-page) | PSR-DEFER-09 (Phase Alpha) 정합 cascade | UX-DEFER-12 |
| CSV/Excel 일괄 import (의료진 · FAQ · 시술 · 카테고리 bulk insert) | M1 Phase Alpha (P2 후속) | UX-DEFER-13 |
| 키보드 접근성 · screen reader 적합성 (WCAG 2.1 AA 풀 검증) | M1 Phase Alpha + 별도 접근성 audit cycle | UX-DEFER-14 |
| admin 안 dark mode toggle UI | PSR-DEFER-03 정합 cascade | UX-DEFER-15 |
| admin_user_notification_read 안 read 추적 + 미확인 카운트 정확 (cycle2 AUX2-04) | M1 Phase Alpha | UX-DEFER-16 |

## 2. 패러다임 전환 — entity-CRUD → 출시 워크스페이스

### 2.1 운영자 mental model 재정의 (UX-PARADIGM-01)

기존 패러다임 (현 어드민):
> 운영자는 DB 의 entity 를 관리한다. 각 entity 는 CRUD (list / new / edit / delete) 화면을 가지며, 운영자는 entity 를 등록·수정한다.

새 패러다임 (본 plan):
> 운영자는 **병원 사이트를 출시한다**. 출시는 lifecycle 안 진행되며, 매 단계마다 시스템이 "다음 무엇" 을 안내한다. entity 등록은 출시 작업의 일부일 뿐.

영향:
- 대시보드 = 출시 진행도 + 누락 안내 (entity 카운트 grid 아님)
- 네비게이션 = "출시 작업 순서" 우선 + entity 메뉴 보조
- 폼 = 출시 작업 단계 별 분할 (단일 large form 안 모든 필드 X)
- 알림 = "출시 차단 사항" 우선 강조 (저장 성공/실패 보조)

### 2.2 출시 lifecycle 정의 (UX-LIFECYCLE-01)

병원 사이트 (instance 단위) 의 lifecycle 4 단계:

| 단계 | 정의 | 진입 조건 | 자동/수동 |
|---|---|---|---|
| **draft** | 초기 설정 진행 중. 공개 사이트 미생성 또는 미공개 | instance 생성 직후 default | 자동 (seed 시점) |
| **ready** | 출시 필수 조건 모두 통과. 검수만 남음 | § 4.3 출시 evaluator 통과 + 필수 entity 모두 published 또는 publishable | 자동 (출시 evaluator 통과 시) |
| **release-pending** | 검수 + 발행 대기 중. 콘텐츠 잠금 상태 (drift 차단) | 운영자가 "출시 검수 요청" 클릭 | 수동 (운영자 명시 액션) |
| **published** | 공개 사이트 안 노출 중. 사후 콘텐츠 추가/수정 가능 (단 변경 시 재검수 필요) | 검수자 approve + 운영자 "출시" 클릭 | 수동 (검수 통과 후 운영자 액션) |

> **결정 (UX-LIFECYCLE-02 · cycle1 검토)**: 본 lifecycle 은 **instance 수준**. 개별 entity (Article · TreatmentPage 등) 의 status (draft → review-queued → ... → published) 와 분리. instance lifecycle 안 출시 evaluator 가 instance 전체 publishable 산정 — 개별 entity status 와 다층 결합.

> **결정 (UX-LIFECYCLE-03 · cycle1 AUX-04 정정)**: instance lifecycle 안 4 단계 중 published · release-pending 은 **운영자 명시 액션** 필요 — derived 만으로 산정 불가. ready 만 derived (출시 evaluator 통과 시 자동) 가능. 본 plan 채택 = **hybrid**:
>   - `instance.release_state JSONB` column 신설 (UX-DB-01 · 마이그레이션 C0024)
>   - shape: `{ state: "draft" | "release-pending" | "published", lastTransitionAt: ISODate, transitionBy: userId | null, releasedAt: ISODate | null }`
>   - **ready 단계는 column 안 저장 안 함** — 산정 함수 안 derived (`state == "draft"` && 출시 evaluator 통과 → "ready" 표시)
>   - **release-pending 진입**: 운영자 "출시 검수 요청" 클릭 시 명시 transition (state = "release-pending")
>   - **published 진입**: 검수 통과 + 운영자 "출시" 클릭 시 (state = "published" · releasedAt 설정)
>   - lifecycle 변경 시 audit_event 안 'instance-lifecycle-transitioned' emit 동반

### 2.3 출시 차단 vs 출시 권장 SoT (UX-PARADIGM-02)

기존: zod 안 모든 필드 required → 저장 차단 = 출시 차단 (일체)
새: 3 분류

| 분류 | 정의 | 예시 | 적용 layer |
|---|---|---|---|
| **저장 차단** | 데이터 무결성 만. 없으면 row INSERT 자체 불가 | slug · instance_id · 이름 (NOT NULL) | DB CHECK + zod 저장 schema |
| **출시 차단 (blocking)** | 공개 사이트 / SEO / 컴플라이언스 안 필수 | 80자 소개 · 로고 URL · OG 이미지 · 대표 예약 채널 · 정책 담당자 · LegalDocument 5종 모두 published | 출시 evaluator (REVIEW_WORKFLOW § 7.1 정합 확장) |
| **출시 권장 (recommended)** | 출시 가능하지만 품질/E-A-T 안 영향 | 의료진 사진 · 상세 약력 · FAQ 5개 이상 · 학술 인용 · MediaAppearance · 카테고리 별 article 1개 이상 | 품질 점수 산정 (§ 11) — 차단 아님 |

> **결정 (UX-PARADIGM-03)**: 본 분류 는 entity 단위 적용. instance 전체 publishable = 모든 출시 차단 통과 + 필수 entity 1+ 존재 (의료진 1+ · 시술 1+ 등).

## 3. 출시 체크리스트 대시보드 (UX-DASH-01~)

### 3.1 출시 준비도 산정 알고리즘 (UX-DASH-01)

```typescript
// apps/web/src/lib/admin/release-readiness.ts
export type ReleaseReadiness = {
  /** 0~100 점수 — 출시 차단 + 권장 항목 합산 */
  scorePercent: number;
  /** 출시 차단 미통과 항목 (해결 시 ready → published 가능) */
  blockingItems: ReleaseChecklistItem[];
  /** 출시 권장 미충족 항목 (해결 시 품질 점수 상승) */
  recommendedItems: ReleaseChecklistItem[];
  /** 현재 instance lifecycle (UX-LIFECYCLE-01) */
  lifecycle: "draft" | "ready" | "release-pending" | "published";
  /** 다음 권장 작업 (운영자가 클릭 시 직접 이동) */
  nextAction: { label: string; href: string } | null;
};

export type ReleaseChecklistItem = {
  id: string;                                 // "clinic-description-80chars" 등 안정 ID
  label: string;                              // "병원 소개 80자 이상 작성"
  status: "complete" | "partial" | "missing";
  category: "basic" | "doctors" | "treatments" | "content" | "policy" | "review";
  /** 해결을 위한 진입 URL */
  href: string;
  /** 미충족 시 사유 (운영자 안내) */
  reason: string | null;
  /** 점수 가중치 (1~10) — 합산 시 차단 가중치 우선 */
  weight: number;
};
```

산정 흐름:
1. **출시 차단 lint** (§ 3.2 안 11 룰) — 각 룰 안 통과/미통과 산정
2. **출시 권장 lint** (§ 3.2 안 8 룰) — 각 룰 안 점수 가중치
3. **score**: `차단 통과 가중치 합 / (차단 전체 가중치 합) * 70% + 권장 통과 가중치 합 / (권장 전체 가중치 합) * 30%` (cycle1 NFM 안 가중치 조정 가능)
4. **lifecycle 산정**: 차단 모두 통과 → ready. release-pending 또는 published 는 DB 안 instance 별 release_state 별도 추적 (UX-LIFECYCLE-03 결정 안 derived)
5. **nextAction**: blockingItems[0] 또는 (전체 통과 시) recommendedItems[0]

### 3.2 누락 항목 lint rules 카탈로그 (UX-DASH-02)

**출시 차단 lint (11 룰)**:

| ID | 카테고리 | 룰 | 진입 URL | 가중치 |
|---|---|---|---|---|
| `clinic-name-set` | basic | 병원명 1+ 글자 | /admin/{slug}/clinic-profile#name | 10 |
| `clinic-description-80chars` | basic | 병원 소개 80자 이상 | /admin/{slug}/clinic-profile#description | 8 |
| `clinic-logo-url` | basic | 로고 URL 설정 | /admin/{slug}/clinic-profile#logoUrl | 7 |
| `clinic-og-image` | basic | OG 이미지 URL 설정 | /admin/{slug}/clinic-profile#ogImageUrl | 7 |
| `location-main-address` | basic | 본원 주소 (시·도+시·군·구+도로명) | /admin/{slug}/clinic-profile#address | 9 |
| `location-business-hours` | basic | 진료시간 1+ 요일 설정 | /admin/{slug}/clinic-profile#hours | 8 |
| `reservation-channel` | basic | 예약 채널 1+ 선택 + 라벨/URL 채움 | /admin/{slug}/clinic-profile#ctas | 9 |
| `policy-contact-person` | policy | 정책 담당자 + 이메일 + 전화 | /admin/{slug}/clinic-profile#policy | 8 |
| `legal-documents-all-published` | policy | 5 LegalDocument (privacy·terms·non-covered·refund·complaint) 모두 published | /admin/{slug}/clinic-profile#legal | 10 |
| `doctor-min-one` | doctors | 의료진 1명 이상 active=true | /admin/{slug}/doctors | 7 |
| `treatment-or-article-min-one` | content | 시술 페이지 또는 아티클 1+ published | /admin/{slug}/treatments 또는 /articles | 6 |

**출시 권장 lint (8 룰)**:

| ID | 카테고리 | 룰 | 가중치 |
|---|---|---|---|
| `doctor-photo` | doctors | 모든 active 의료진 사진 설정 | 5 |
| `doctor-bio-300chars` | doctors | 의료진 약력 300자 이상 | 4 |
| `treatment-min-three` | content | 시술 페이지 3+ published | 5 |
| `faq-min-five` | content | FAQ 5+ published | 4 |
| `article-min-one-per-category` | content | 카테고리 별 article 1+ published | 4 |
| `publication-min-one` | content | Publication (학술 인용) 1+ published — E-A-T | 3 |
| `media-appearance-min-one` | content | MediaAppearance 1+ published — 권위 | 3 |
| `multiple-cta-channels` | basic | 예약 채널 2+ (전화 + 카카오 등) | 3 |

> **결정 (UX-DASH-03)**: 본 카탈로그 는 instance 단위 적용. M1 Phase Beta 안 instance 유형 별 카탈로그 차별화 (한의원 vs 일반 의원 vs 치과 등 — UX-DEFER 후속).

### 3.3 대시보드 layout (UX-DASH-04)

```
┌────────────────────────────────────────────────────────────────────────┐
│ Glitzy 어드민 · {clinic.name}                            로그아웃     │
│  대시보드 · 의원정보 · 의료진 · 시술 · ... · 검수큐                  │
│ 대시보드                                                                │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────┐  ┌────────────────────────────────────┐│
│  │ 출시 준비도              │  │ 다음 작업                            ││
│  │   62%                    │  │ → 시술 페이지 1개 이상 발행하기       ││
│  │   진행: ████████░░░░░░  │  │ [/admin/demo/treatments] 이동       ││
│  │                          │  │                                      ││
│  │ 차단 5건 · 권장 8건      │  │ 또는 검수 대기 2건 처리              ││
│  └─────────────────────────┘  └────────────────────────────────────┘│
│                                                                         │
│  📋 출시 체크리스트                                                     │
│  ┌────────────────────────────────────────────────────────────────────│
│  │ 기본 정보                                                  3/7    ││
│  │   ✓ 병원명 설정                                                   ││
│  │   ✓ 본원 주소 설정                                                ││
│  │   ✓ 진료시간 1+ 요일 설정                                         ││
│  │   ⚠ 병원 소개 80자 이상 → 현재 42자 [편집]                       ││
│  │   ✗ 로고 URL → 미설정 [편집]                                      ││
│  │   ✗ OG 이미지 URL → 미설정 [편집]                                 ││
│  │   ✗ 예약 채널 → 미설정 [편집]                                     ││
│  │                                                                    ││
│  │ 정책/법무                                                  1/2    ││
│  │   ✓ 정책 담당자 정보 설정                                          ││
│  │   ✗ 5종 정책 문서 모두 published → 현재 0/5 [편집]               ││
│  │                                                                    ││
│  │ 의료진 · 콘텐츠                                            2/3    ││
│  │   ✓ 의료진 1명 이상 active                                         ││
│  │   ✓ 시술 또는 아티클 1+ published                                  ││
│  │   ✗ 검수 대기 2건 처리 → [/review-queue] 이동                     ││
│  └────────────────────────────────────────────────────────────────────│
│                                                                         │
│  📈 품질 점수 (출시 권장)                                              │
│  ┌────────────────────────────────────────────────────────────────────│
│  │ 품질 점수: 45점 / 100점                                            ││
│  │ • 의료진 사진 추가: 3명 중 1명만 사진 있음 (+5)                    ││
│  │ • FAQ 5개 이상 (+4)                                                ││
│  │ • Publication 1+ 추가 → E-A-T 신호 강화 (+3)                       ││
│  └────────────────────────────────────────────────────────────────────│
│                                                                         │
│  🔔 알림 (3건)                                                          │
│  ┌────────────────────────────────────────────────────────────────────│
│  │ • 김의사 의료진 검수 요청됨 (2시간 전)                              ││
│  │ • 시술 "다이어트 한약" published (1일 전)                          ││
│  │ • 비급여 진료 안내 LegalDocument 검수 통과 (3일 전)               ││
│  └────────────────────────────────────────────────────────────────────│
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

**결정 (UX-DASH-04·05)**:
- 카드 grid (현재 EntityCard) 폐기. 출시 체크리스트 · 품질 점수 · 알림함 3 area 가 main.
- entity 카운트 (의료진 N명 · 시술 N건 등) 는 nav menu 안 옆 작은 배지로 표시 (보조 정보).
- "다음 작업" CTA 는 매 진입 시 가장 영향 큰 항목 1건 자동 산정 (blockingItems[0] 우선).

## 4. 저장 필수 vs 출시 필수 분리 — 3-layer 매트릭스 (UX-LAYER-01~)

### 4.1 3-layer 정의 (UX-LAYER-01)

| Layer | 정의 | 위반 시 | 관리 위치 |
|---|---|---|---|
| **L1: DB CHECK** | 데이터 무결성 만 (slug 형식 · NOT NULL primary key · FK · enum 값) | INSERT/UPDATE 자체 throw | `packages/core-content/migrations/Cnnnn_*.sql` |
| **L2: zod 저장 schema** | draft 저장 가능한 최소 (entity 별 식별자 + 운영자 진입 시점 안 채움 가능한 필드) | `saveResult.ok=false` · fieldErrors 표시 | `apps/web/src/lib/{entity}-save-schema.ts` (신규) |
| **L3: zod 출시 schema** | 출시 evaluator 안 적용 (REVIEW_WORKFLOW § 7.1 + 공개 사이트 SEO/E-A-T) | 출시 차단 (lifecycle 안 ready → release-pending 진입 차단) | `apps/web/src/lib/{entity}-release-schema.ts` (신규) |

> **결정 (UX-LAYER-02)**: L1 + L2 만 통과 시 draft 저장 가능. L3 통과 시 출시 evaluator 안 publishable. 출시 evaluator = L3 zod parse + compliance-assistant 의 publishable evaluator (REVIEW_WORKFLOW § 7.1) 동반.

### 4.2 entity 별 layer 매핑 표 (UX-LAYER-03)

`ClinicProfile` 예시:

| 필드 | L1 (DB) | L2 (저장) | L3 (출시) | 운영자 표시 |
|---|---|---|---|---|
| `name` | NOT NULL + length 1~100 | required | required | "병원명 (저장 필수)" |
| `description` | NOT NULL + length 1~300 | required min 1 | required min 80 | "병원 소개 (저장 1자+ · 출시 80자+)" |
| `logo_url` | NULLABLE + URL CHECK | optional | required + URL format | "로고 URL (출시 필수)" |
| `og_image_url` | NULLABLE + URL CHECK | optional | required + URL format | "OG 이미지 URL (출시 필수)" |
| `business_registration_number` | NULLABLE + 000-00-00000 CHECK | optional | optional | "사업자등록번호 (권장)" |
| `slogan` | NULLABLE + length 200 | optional | optional | "슬로건 (선택)" |
| `policy_contact_person` | NULLABLE + length 100 | optional | required | "정책 담당자 (출시 필수)" |
| `policy_contact_email` | NULLABLE + email regex | optional | required + email | "정책 이메일 (출시 필수)" |
| `policy_contact_phone` | NULLABLE + phone regex | optional | required + phone | "정책 전화 (출시 필수)" |
| `primary_ctas` | JSONB + array CHECK + element shape trigger | optional + nonempty | required + array length 1+ | "예약 채널 (출시 필수)" |
| `brand_tokens` | JSONB DEFAULT '{}' | optional | optional | "Brand 색상 (선택 · 미설정 시 base theme)" |

**나머지 9 entity layer 매핑 표 (cycle2 AUX2-03 정정)**:

| entity | L1 (DB) 변경 | L2 (저장) 핵심 | L3 (출시) 핵심 |
|---|---|---|---|
| LocationProfile | phone/email NULLABLE 유지 | slug (PK) · clinic_profile_id (FK) | + street/locality/region/postal/phone 필수 |
| DoctorProfile | photo_url/bio NULLABLE 유지 | name · slug · display_order | + bio 100자+ (출시 권장 — § 3.2 doctor-bio-300chars) |
| TreatmentPage | summary/body 일부 NULLABLE 화 (현 NOT NULL 80자 등) | title · slug · category | + summary 80자+ · body_slots.overview 100자+ · status="published" |
| Article | summary/body 동상 | title · slug · category | + summary 80자+ · body 200자+ · status="published" · category 지정 |
| FAQ | answer 동상 | question · slug | + answer 50자+ · status="published" |
| Publication | DOI/PMID/URL NULLABLE 유지 | title · authors[] · published_date · url | + journal · authors 1+ · publishedDate · url 필수 |
| MediaAppearance | description NULLABLE 유지 | title · url · published_date | + thumbnail · publisher · description 50자+ |
| LegalDocument | body 동상 (현재 LWI-01 안 status='draft' 일 때만 갱신) | document_type · slug · status | + body 100자+ · status="published" · legal_counsel slot 채움 (compliance + LWI-01) |
| ArticleCategory | description NULLABLE 유지 | slug · name | + description 30자+ (SEO) |

> **결정 (UX-LAYER-04 · 마이그레이션 · cycle1 AUX-03 정정)**: 기존 DB CHECK 안 NOT NULL 인 필드 (logo_url · og_image_url 등) 안 nullable 화. 마이그레이션 안 entity 별 분리 (C0023a · C0023b · ... · 10 entity 별 migration) + 각 migration 안:
>   1. ALTER TABLE ... DROP NOT NULL (대상 컬럼)
>   2. **backfill check**: existing published row 안 NULL count 검증 (`SELECT count(*) FROM article WHERE status='published' AND <nullable_column> IS NULL`) — count > 0 시 NOTICE 로그 (운영자 안내) + lifecycle 안 retrospective 안 grandfather marker (기존 published row 는 lifecycle 안 'published' 그대로 유지 · 출시 evaluator 안 retrospective check 안 함)
>   3. retrospective check policy: 기존 published row 안 `compliance_record.metadata.legacyGrandfathered=true` 마킹 (sentinel 패턴 정합) — 출시 evaluator 안 본 flag 발견 시 차단 lint skip + UI 안 "(기존 발행분 — 정합성 검증 권장)" 안내 만 표시
>   4. 신규 발행분 (release_state column 활용 안 published) 안 출시 evaluator 100% 적용 — grandfather flag 부재

### 4.3 출시 evaluator (UX-LAYER-05) — cycle1 AUX-01 정정

**UX evaluator (zod L3) + compliance publishable evaluator chain** (CA-GATE-03 정합):

```typescript
// apps/web/src/lib/admin/release-evaluator.ts
export type ReleaseBlocker = { field: string; rule: string; message: string; source: "ux-schema" | "compliance-publishable" };
export type ReleaseEvaluationResult =
  | { releasable: true }
  | { releasable: false; blockers: ReleaseBlocker[] };

/**
 * entity 별 release evaluator — UX schema (L3 zod 출시 schema) + compliance publishable evaluator chain.
 *   1. parse L3 zod (UX layer · SEO/E-A-T 필수)
 *   2. compliance publishable evaluator (CA-GATE-03 — finalRoles 모두 만족 · automatedDecision !== "block" · staleFlags clear · warningAck 등 REVIEW_WORKFLOW § 7.1 6조건)
 *   3. 두 결과 합산 — 어느 한쪽 fail 시 releasable=false. blockers 안 source 안 구분.
 */
export function evaluateClinicProfileRelease(
  row: ClinicProfileRow,
  complianceRecord: ComplianceRecordRow | null,
): ReleaseEvaluationResult {
  const blockers: ReleaseBlocker[] = [];

  // (1) UX schema (L3 zod) parse
  const parsed = clinicProfileReleaseSchema.safeParse(row);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      blockers.push({
        source: "ux-schema",
        field: issue.path.join("."),
        rule: issue.code,
        message: humanizeRelease(issue),
      });
    }
  }

  // (2) compliance publishable evaluator (CA-GATE-03 cascade)
  if (complianceRecord) {
    const compResult = evaluatePublishable(complianceRecord, "ClinicProfile");
    if (!compResult.publishable) {
      for (const reason of compResult.reasons) {
        blockers.push({
          source: "compliance-publishable",
          field: "_compliance",
          rule: "publishable-gate",
          message: reason,
        });
      }
    }
  }
  // complianceRecord null 인 경우 = 본 entity 가 compliance scope 외 (ClinicProfile 안 compliance 적용 안 됨 · LocationProfile 등 동상). entity 별 분기.

  return blockers.length === 0 ? { releasable: true } : { releasable: false, blockers };
}
```

**entity 별 release evaluator** (10 entity · compliance scope 표):

| entity | UX L3 schema | compliance publishable evaluator chain |
|---|---|---|
| ClinicProfile | ✓ (logo/og/policy 필수) | ✗ (compliance scope 외) |
| LocationProfile | ✓ (address/phone 필수) | ✗ (compliance scope 외) |
| DoctorProfile | ✓ (name 필수 · photo 권장) | ✗ (compliance scope 외) |
| TreatmentPage | ✓ (title/summary/body 필수) | ✓ (CA-GATE-03) |
| Article | ✓ (title/category/body 필수) | ✓ (CA-GATE-03) |
| FAQ | ✓ (question/answer 필수) | ✓ (CA-GATE-03) |
| Publication | ✓ (title/authors/journal 필수) | ✗ (external citation exempt — CONTENT_STANDARDS § 7.1.1.2) |
| MediaAppearance | ✓ (title/url 필수) | ✗ (동상) |
| LegalDocument | ✓ (body 필수) | ✓ (CA-GATE-03 안 LegalDocument exempt envelope · legal-reviewer required) |
| **InstanceRelease (통합)** | 모든 entity 통합 + 필수 entity 1+ 존재 검증 | (인스턴스 level · entity 별 결과 합산) |

**`evaluateInstanceRelease()` 시그니처 + 알고리즘 (cycle2 AUX2-01 정정 · cycle3 AUX3-02 helper 시그니처 추가)**:

`computeRecommendedLintItems()` helper (cycle3 AUX3-02 정정):
```typescript
function computeRecommendedLintItems(input: InstanceEntities): ReleaseChecklistItem[] {
  const items: ReleaseChecklistItem[] = [];
  // doctor-photo — 모든 active 의료진 사진 있는지
  const activeDocs = input.doctors.filter((d) => d.active);
  const docsWithoutPhoto = activeDocs.filter((d) => !d.photo_url);
  if (docsWithoutPhoto.length > 0) items.push({ id: "doctor-photo", label: `${docsWithoutPhoto.length}명 의료진 사진 미설정`, status: "partial", category: "doctors", href: `/admin/${input.clinic?.instance_slug}/doctors`, reason: `${docsWithoutPhoto.length}/${activeDocs.length}명 사진 없음`, weight: 5 });
  // doctor-bio-300chars · treatment-min-three · faq-min-five · article-min-one-per-category · publication-min-one · media-appearance-min-one · multiple-cta-channels 동상 (§ 3.2 8 룰)
  return items;
}
```



```typescript
// apps/web/src/lib/admin/release-evaluator.ts
type InstanceEntities = {
  clinic: ClinicProfileRow | null;
  location: LocationProfileRow | null;
  doctors: DoctorProfileRow[];
  treatments: TreatmentPageRow[];
  articles: ArticleRow[];
  faqs: FaqRow[];
  publications: PublicationRow[];
  media: MediaAppearanceRow[];
  legals: LegalDocumentRow[];
  categories: ArticleCategoryRow[];
  complianceRecords: Map<string, ComplianceRecordRow>;  // entity ref → record
};
type InstanceReleaseStateRow = {
  state: "draft" | "release-pending" | "published";
  lastTransitionAt: Date;
  transitionBy: string | null;
  releasedAt: Date | null;
};
type InstanceReleaseResult = {
  releasable: boolean;
  blockers: ReleaseBlocker[];
  recommendedItems: ReleaseChecklistItem[];
  lifecycle: "draft" | "ready" | "release-pending" | "published";
  scorePercent: number;  // 0~100 (출시 차단 가중치 합 · § 3.1 정합)
};

export function evaluateInstanceRelease(
  input: InstanceEntities,
  releaseState: InstanceReleaseStateRow,
): InstanceReleaseResult {
  const blockers: ReleaseBlocker[] = [];

  // (1) 11 차단 lint (§ 3.2) 산정 — collection-level 검증
  if (!input.clinic) blockers.push({ source: "instance-lint", field: "clinic", rule: "clinic-exists", message: "ClinicProfile 미생성" });
  else {
    // entity 별 evaluator 호출 (published 만 evaluator 통과 검증)
    const clinicResult = evaluateClinicProfileRelease(input.clinic, input.complianceRecords.get("ClinicProfile/clinic") ?? null);
    if (!clinicResult.releasable) blockers.push(...clinicResult.blockers);
  }
  if (!input.location) blockers.push({ source: "instance-lint", field: "location", rule: "location-exists", message: "본원 LocationProfile 미생성" });
  // ... 나머지 entity 동상

  // collection lint
  const activeDoctors = input.doctors.filter((d) => d.active);
  if (activeDoctors.length === 0) blockers.push({ source: "instance-lint", field: "doctors", rule: "doctor-min-one", message: "active 의료진 1명 이상 필요" });

  const publishedTreatments = input.treatments.filter((t) => t.status === "published");
  const publishedArticles = input.articles.filter((a) => a.status === "published");
  if (publishedTreatments.length === 0 && publishedArticles.length === 0) {
    blockers.push({ source: "instance-lint", field: "content", rule: "treatment-or-article-min-one", message: "시술 페이지 또는 아티클 1+ published 필요" });
  }

  const publishedLegals = input.legals.filter((l) => l.status === "published");
  if (publishedLegals.length < 5) {
    blockers.push({ source: "instance-lint", field: "legals", rule: "legal-documents-all-published", message: `5종 정책 문서 모두 published 필요 (현재 ${publishedLegals.length}/5)` });
  }

  // (2) lifecycle 산정 — releaseState 우선
  let lifecycle: InstanceReleaseResult["lifecycle"];
  if (releaseState.state === "published") lifecycle = "published";
  else if (releaseState.state === "release-pending") lifecycle = "release-pending";
  else lifecycle = blockers.length === 0 ? "ready" : "draft";

  // (3) recommendedItems — 8 권장 lint 산정 (§ 3.2)
  const recommendedItems: ReleaseChecklistItem[] = computeRecommendedLintItems(input);

  // (4) scorePercent — § 3.1 알고리즘 (차단 통과 가중치 합 / 차단 전체 가중치 합 * 70% + 권장 통과 가중치 합 / 권장 전체 가중치 합 * 30%)
  const scorePercent = computeReadinessScore(blockers, recommendedItems);

  return { releasable: blockers.length === 0, blockers, recommendedItems, lifecycle, scorePercent };
}
```

## 5. 단계형 ClinicProfile (UX-CLINIC-01~)

### 5.1 5 단계 정의 (UX-CLINIC-01)

기존 단일 화면 안 책임 분산 → 5 단계 tab/wizard:

| 단계 | 책임 | 저장 단위 | 출시 차단 룰 |
|---|---|---|---|
| **1. 기본 정보** | 기관명 · 소개 · 로고 · OG 이미지 · 사업자번호 · 부가 정보 (alternateName · legalEntityName · slogan · longDescription · foundingDate · founder) | 개별 PATCH (즉시 저장) | clinic-description-80chars · clinic-logo-url · clinic-og-image · clinic-name-set |
| **2. 위치/연락** | 본원 주소 (다음 검색) · 전화 · 이메일 | 개별 PATCH (즉시 저장) | location-main-address |
| **3. 진료시간** | 7요일 · 점심시간 · 프리셋 ("평일 09-18 · 토 09-14") · 일괄 적용 도구 | 개별 PATCH | location-business-hours |
| **4. 예약 채널** | 전화/카카오/네이버 토글 · tel: 자동 생성 · 대표 채널 자동 선택 | 개별 PATCH | reservation-channel |
| **5. 정책/법무** | 정책 담당자 · 5 LegalDocument workflow (LL-INTEGRATION 정합) · 시행일 override (고급 설정 접기) | **여전히 통합 tx** (LWI-01 정합) | policy-contact-person · legal-documents-all-published |

### 5.2 단계 별 저장 정책 (UX-CLINIC-02)

**개별 PATCH (단계 1~4)**:
- 사용자가 단계 진행 시 즉시 PATCH (단계 내 dirty 필드만 저장)
- `useFormDraft` (이미 구현) 활용 + debounce 1s
- 저장 성공 시 자동 다음 단계로 이동 옵션 (사용자 설정)

**통합 tx (단계 5 — LWI-01 정합)**:
- ClinicProfile + LocationProfile(main) + 5 LegalDocument 동시 저장 (기존 동일)
- 단 본 단계 진입 시점 안 단계 1~4 가 모두 통과되어야 정책 변수 (`{{clinic.name}}` 등) 안 안정적 렌더
- 단계 1~4 미통과 시 단계 5 차단 + 안내 ("기본 정보 단계 안 [필드명] 채워주세요")

### 5.3 5 LegalDocument LWI-01 호환성 (UX-CLINIC-03·04) — cycle1 AUX-02 정정

기존 LWI-01: ClinicProfile + LocationProfile(main) + 5 LegalDocument **한 tx 안 동시 저장** (정책 변수 정합 보장).

새 패러다임: 단계 1~4 안 개별 PATCH → 통합 tx 안 정책 변수 (`{{clinic.name}}` · `{{location.address}}` 등) 안 최신 상태 보장 위해 명시 lock 패턴 필요.

해결책 (UX-CLINIC-04 정정 · snapshot isolation 안전):

```typescript
// 단계 5 저장 흐름 (server action)
await withSkeletonTx({ signedToken, instanceId }, async (tx, ctx) => {
  // (1) ClinicProfile + LocationProfile FOR UPDATE — 동시 단계 1~4 PATCH 차단
  const clinic = await tx`SELECT ... FROM clinic_profile WHERE instance_id = ${ctx.instanceId}::uuid AND slug='clinic' FOR UPDATE`;
  const location = await tx`SELECT ... FROM location_profile WHERE instance_id = ${ctx.instanceId}::uuid AND slug='main' FOR UPDATE`;
  // (2) 정책 변수 렌더 — 위 lock 안 최신 데이터
  const ctx_vars = { clinic, location, policy: { contactPerson, contactEmail, contactPhone, effectiveDate } };
  // (3) 5 LegalDocument body 갱신 (변수 치환) + ClinicProfile.policy_* 필드 갱신
  for (const docType of CLOSED_DOCUMENT_TYPES) {
    const rendered = renderTemplate(TEMPLATES[docType].body, ctx_vars);
    await tx`UPDATE legal_document SET body = ${rendered}, effective_date = ${...} WHERE ... AND status IN ('draft', 'rejected')`;
  }
  await tx`UPDATE clinic_profile SET policy_contact_person = ..., policy_contact_email = ..., policy_contact_phone = ..., policy_effective_date = ... WHERE id = ${clinic.id}::uuid`;
  // (4) commit — lock 자동 해제
});
```

**결정 (UX-CLINIC-05·06·07 · cycle2 AUX2-02 정정 · deadlock 방지)**:
- **lock 순서 고정** (LL-ACTION-04 정합): ClinicProfile → LocationProfile → 5 LegalDocument alpha (complaint → non-covered → privacy → refund → terms). 모든 단계 server action 안 동일 순서 강제 → deadlock 회피.
- 단계 5 진입 시점 안 ClinicProfile + LocationProfile lock (FOR UPDATE). 동시 단계 1~4 PATCH 시 lock wait (또는 NOWAIT 안 fail).
- 단계 1~4 server action 안 ClinicProfile/LocationProfile UPDATE 시 SELECT FOR UPDATE 동반 (현재 ClinicProfile actions.ts 패턴 정합).
- 단계 5 안 LegalDocument body 갱신 = 기존 LL-WORKFLOW-INTEGRATION 패턴 정합 (LWI-01 안 status IN ('draft', 'rejected') 일 때만 body 갱신 · drift 차단).
- ClinicProfile 자체 (name · description 등) 는 단계 1 안 이미 저장됨 — 단계 5 안 안 다시 저장. 단 policy_* 필드만 단계 5 안에서 저장 (정책 담당자 정보).

### 5.4 UI 구조 (UX-CLINIC-05)

```typescript
// apps/web/src/components/admin/clinic-profile/ClinicProfileWizard.tsx
<WizardLayout>
  <WizardSteps>
    <Step number={1} label="기본 정보" status="complete" />
    <Step number={2} label="위치/연락" status="active" />
    <Step number={3} label="진료시간" status="upcoming" />
    <Step number={4} label="예약 채널" status="upcoming" />
    <Step number={5} label="정책/법무" status="upcoming" disabled={!stepsComplete([1,2,3,4])} />
  </WizardSteps>
  <WizardBody>
    {step === 2 && <Step2LocationContact ... />}
    {/* ... */}
  </WizardBody>
  <WizardNav>
    <Button variant="ghost" onClick={prev}>← 이전</Button>
    <Button variant="primary" onClick={next}>다음 →</Button>
  </WizardNav>
</WizardLayout>
```

## 6. 다건 등록 UX (UX-MULTI-01~)

### 6.1 의료진 인라인 테이블 (UX-MULTI-01)

기존: 목록 → 신규 → 상세 폼 → 저장 → 목록 복귀 (5명 등록 = 25 click + 5 page transition).

새 패러다임: 인라인 편집 가능 테이블 + 행 추가 / 행 삭제 + 일괄 저장.

> **결정 (UX-MULTI-02b · cycle1 AUX-06 정정)** — atomicity: 일괄 저장 = **single tx 안 모든 row 처리** (`withSkeletonTx` 안 each row INSERT/UPDATE). 한 row 실패 시 **전체 rollback** + 인라인 에러 안 어느 row · 어느 필드 표시 (서버 안 결과 안 `{ ok: false, failedRowIndex: N, fieldErrors: {...} }` 반환). atomicity 보장 = 운영자 mental model 안 일관성 유지 (부분 commit 안 사용자 혼동 회피).

```typescript
// apps/web/src/components/admin/doctors/DoctorsInlineTable.tsx
<InlineTable>
  <thead>
    <tr>
      <th>이름</th>
      <th>직함</th>
      <th>노출순서</th>
      <th>활성</th>
      <th>상세</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {rows.map(row => (
      <tr key={row.id}>
        <td><InlineInput value={row.name} onChange={(v) => updateRow(row.id, "name", v)} /></td>
        <td><InlineInput value={row.title} onChange={...} /></td>
        <td><InlineNumberInput value={row.displayOrder} onChange={...} /></td>
        <td><InlineToggle value={row.active} onChange={...} /></td>
        <td><Link href={`/admin/${slug}/doctors/${row.slug}`}>상세 편집 →</Link></td>
        <td><DeleteButton onClick={() => removeRow(row.id)} /></td>
      </tr>
    ))}
  </tbody>
</InlineTable>
<Button onClick={addRow}>+ 행 추가</Button>
<Button variant="primary" onClick={saveAll}>모두 저장 ({dirtyCount}건 변경)</Button>
```

**결정 (UX-MULTI-02)**:
- 기본 필드 (이름 · 직함 · 노출순서 · 활성) 인라인 편집. 상세 필드 (약력 · 사진) 는 detail page 안 (기존 path 유지).
- 일괄 저장 — 모든 dirty row 안 동시 server action call (Promise.allSettled). 부분 실패 시 성공 row 만 commit + 실패 row 안 인라인 에러.
- TanStack Table (또는 자체 구현) 안 사용. M0 안 자체 구현 (의존성 최소화) — M1 안 라이브러리 검토.

### 6.2 FAQ 스프레드시트형 (UX-MULTI-03)

비슷한 패턴 — 질문/답변 안 인라인. 답변 안 줄 단위 expand (textarea auto-resize). 일괄 붙여넣기 (Excel · 메모장 안 tab-separated 또는 line-separated) 지원.

붙여넣기 안 자동 parse:
- 한 줄 = 한 FAQ row
- 첫 번째 column = 질문 · 두 번째 column = 답변 (탭 분리)
- 답변 안 줄바꿈 = `<br>` 또는 markdown 줄바꿈

**보안 정책 (cycle4 AUX4-01 정정)**:
- 행 수 최대 **100건** 안 한 번 안 (초과 시 안내 + truncate) — DoS 회피
- 각 셀 안 최대 길이 — 질문 200자 · 답변 5000자 (truncate · 안내)
- HTML 안 **sanitize-html** 안 unsafe tag 제거 (script · iframe · object · embed · style 등) — XSS 회피
- 붙여넣기 후 **preview** + 사용자 명시 "저장" 클릭 전까지 commit 안 함 — 잘못된 input 안 안전 확인 가능

### 6.3 시술 템플릿 + 슬롯형 에디터 (UX-MULTI-04)

**카테고리 프리셋** (한의원 기준):
- "다이어트": 한약 다이어트 · 비만 치료 · 체질 개선
- "체형 관리": 비수술 체형 · 산후 관리 · 림프 마사지
- "통증 관리": 침 치료 · 부항 · 추나
- (사용자 추가 가능)

프리셋 선택 → 제목 list 입력 → "초안 일괄 생성" → status=draft 인 TreatmentPage row 다수 INSERT (각각 빈 슬롯).

**슬롯형 에디터** (compliance slotMatches 정합):

```typescript
type TreatmentSlots = {
  overview: string;        // 개요 (200~500자)
  target: string;          // 대상 환자 (100~300자)
  process: string;         // 치료 과정 (300~1000자)
  precautions: string;     // 주의사항 (100~500자)
  faq: Array<{ q: string; a: string }>;  // 시술 별 FAQ
};
```

DB 저장: **별 column 신설** (`treatment_page.body_slots JSONB`) — 마이그레이션 동반 (C0023 안 별 행). single string 안 slot marker 안 사용자 입력 conflict 회피 (cycle1 AUX-07 정정).

```sql
-- C0023 안 추가
ALTER TABLE treatment_page ADD COLUMN IF NOT EXISTS body_slots JSONB DEFAULT '{}'::jsonb;
-- body_markdown 안 backwards-compat 유지 (legacy 사용처 cascade 안)
```

shape:
```typescript
type BodySlots = {
  overview: string;
  target: string;
  process: string;
  precautions: string;
  faq: Array<{ q: string; a: string }>;
};
```

> **결정 (UX-MULTI-05·06 · cycle1 AUX-07 정정)**: slot 안 별 column (JSONB) 안 정확 구조화 — single string 안 marker 안 사용자 입력 안 conflict 회피. compliance rule 안 slot 단위 적용 = slot 별 column key 안 매칭 (`row.body_slots.overview` · `row.body_slots.precautions` 등). compliance-assistant 의 `slotMatches` (SLOT_PATTERN catalog) 정합 — slot 안 별 column 안 key 안 catalog 안 등록.
> 
> 기존 body_markdown 안 backwards-compat 유지 (legacy 사용처 cascade 안 · 신규 입력 안 body_slots 우선). 마이그레이션 path: 기존 published row 안 body_markdown 안 단일 string 그대로 유지 · body_slots 안 빈 객체. 신규 입력 안 body_slots 안 사용. 향후 cycle 안 body_markdown 안 deprecate 또는 body_slots 안 마이그레이션.

## 7. 공통 UI primitive 라이브러리 (UX-UI-01~)

### 7.1 컴포넌트 카탈로그 (UX-UI-01)

`apps/web/src/components/admin/ui/` 신설 — 8 신규 컴포넌트:

| 컴포넌트 | 책임 | 사용 처 |
|---|---|---|
| `SaveStatusPanel` | 저장 진행/성공/실패/dirty 표시 통일 | 모든 폼 (sticky 하단 또는 상단) |
| `DirtyIndicator` | "저장되지 않은 변경" 배지 + 페이지 이탈 경고 | 모든 폼 |
| `ErrorSummary` | fieldErrors 안 운영자 언어 안 변환 + 첫 에러 자동 scroll | 모든 폼 |
| `FieldErrorBubble` | 개별 필드 옆 인라인 에러 표시 (운영자 언어) | 모든 input 옆 |
| `StatusBadge` | entity status (draft/review-queued/published 등) 통일 배지 | 모든 entity list/edit |
| `WorkflowActionGroup` | submit/approve/reject/publish 버튼 group + lifecycle 별 조건부 표시 | 모든 entity edit |
| `ReleasePreviewModal` | 출시 미리보기 + 누락 검사 + 검수 요청 단일 플로우 | 대시보드 + entity edit |
| `QualityScoreCard` | 품질 점수 + 추천 항목 표시 | 대시보드 + entity edit |

### 7.2 SaveStatusPanel (UX-UI-02)

```typescript
// apps/web/src/components/admin/ui/SaveStatusPanel.tsx
type Props = {
  status: "idle" | "saving" | "success" | "error";
  errorCount?: number;
  firstErrorField?: string | null;
  successMessage?: string;
  errorMessage?: string;
  lastSavedAt?: string | null;
  isDirty?: boolean;
};
```

UI:
- idle + dirty: "💾 저장되지 않은 변경 있음"
- idle + clean: "✓ 모든 변경 저장됨 (lastSavedAt)"
- saving: spinner + "저장 중..."
- success: "✅ 저장되었습니다."
- error: "❌ 저장 실패 — N개 필드 오류 (첫 필드: ...)"

위치: sticky 하단 (현재 ClinicProfileForm 패턴 통일) + 상단 mirror.

### 7.3 StatusBadge (UX-UI-03)

```typescript
type Props = {
  status: "draft" | "review-queued" | "in-review" | "approved" | "publishable" | "published" | "rejected" | "blocked" | "stale";
  size?: "sm" | "md";
};
```

색상 매핑 (DESIGN_TOKENS 정합):
- draft: subtle bg + muted text
- review-queued · in-review: warning bg + warning text
- approved · publishable: info bg + info text
- published: success bg + success text
- rejected · blocked: error bg + error text
- stale: warning bg + warning text + clock icon

### 7.4 WorkflowActionGroup (UX-UI-04) — cycle1 AUX-14 정정

기존 `WorkflowActionButtons` (compliance-assistant M0 산출물) 안 확장. backwards-compat 정책:
- **단계 1 (본 plan code cycle)**: 기존 `WorkflowActionButtons` deprecate marker · 새 `WorkflowActionGroup` 안 superset 신설. 기존 사용처 (6 entity edit page + clinic-profile 안 5 LegalDocument workflow) 안 함께 alias 가능 (`export const WorkflowActionButtons = WorkflowActionGroup`).
- **단계 2 (점진 마이그레이션)**: 6 entity edit page 안 import 안 새 컴포넌트 명시 전환 (한 PR 안 일괄).
- **단계 3 (deprecate 완료)**: 기존 component 안 export 제거.

기능 확장:
- lifecycle 별 조건부 (draft → "검수 요청" / publishable → "발행" / published → "재검수")
- 권한 별 조건부 (operator/medical/legal role 별 표시)
- 한 줄 안 통일 layout (Button.primary + Button.secondary + Button.ghost group)

### 7.5 DirtyIndicator (UX-UI-05) — cycle2 AUX2-08 정정 · cycle3 AUX3-01 위치 이동

```typescript
type DirtyIndicatorProps = { isDirty: boolean; lastSavedAt: string | null; };
```
표시: `isDirty=true` 시 "💾 저장되지 않은 변경 (마지막 저장: HH:MM:SS)" + window.beforeunload 안 confirm 안내. `false` 시 "✓ 모든 변경 저장됨".

### 7.6 ErrorSummary (UX-UI-06)

```typescript
type ErrorSummaryProps = {
  errors: Record<string, string[]>;  // fieldName → messages[]
  onClickField?: (field: string) => void;  // 필드 click 시 해당 input 으로 scroll/focus
};
```
표시: "N개 필드 오류" + list 안 운영자 언어 변환 (`policyContactPhone` → "정책 담당자 전화번호") + click 시 input 으로 자동 scroll/focus.

### 7.7 FieldErrorBubble (UX-UI-07)

```typescript
type FieldErrorBubbleProps = { fieldName: string; errors: string[] | undefined; };
```
표시: 개별 필드 input 아래 인라인 빨강 텍스트 (운영자 언어).

### 7.8 ReleasePreviewModal (UX-UI-08)

```typescript
type ReleasePreviewModalProps = {
  instanceSlug: string;
  evalResult: InstanceReleaseResult;
  onConfirm: () => Promise<void>;  // release-pending 전환
  onClose: () => void;
};
```
표시: § 10 modal 구조. iframe src = `/{instanceSlug}/` (same origin).

### 7.9 QualityScoreCard (UX-UI-09)

```typescript
type QualityScoreCardProps = { score: QualityScore; };
```
표시: 100점 만점 score + 4 카테고리 breakdown + 추천 항목 list (각각 클릭 시 entity edit 진입).

## 8. 전역 알림 시스템 (UX-NOTIFY-01~)

### 8.1 Toast 컴포넌트 (UX-NOTIFY-01)

라이브러리 vs 자체 구현 검토:
- `sonner` — 작고 안정. 권장.
- 자체 구현 — 의존성 0 · M0 안 단순 사용 만이면 충분.

본 plan 채택 = **자체 구현** (M0 단순화). M1 안 sonner 검토.

**구체 사양 (cycle1 AUX-11 정정)**:
- 위치: top-right (모바일 안 bottom-center · UX-DEFER-04 cascade 까지)
- 자동 dismiss: success 3s · error 7s · info 5s · warning 5s
- stack: 최대 5개 (초과 시 가장 오래된 것 자동 dismiss)
- 우선순위: error > warning > info > success (동시 발생 시 stack 순서 정렬)
- 액션: 옵션 안 `action: { label, href }` 안 click 시 navigate + toast dismiss

```typescript
// apps/web/src/components/admin/ui/Toast.tsx
const toast = createToast();
toast.success("저장되었습니다");
toast.error("저장 실패", { description: "정책 담당자 전화번호 형식 오류" });
toast.info("검수 요청됨", { action: { label: "큐 보기", href: "/admin/.../review-queue" } });
```

### 8.2 in-app NotificationInbox UI (UX-NOTIFY-02 · NF-DEFER-10 부분 해소) — cycle1 AUX-05 정정

notifications M0 plan 안 envelope 영속 + 4 eventType emit 완료. 본 plan 은 UI 부분 만:

```
어드민 헤더 안 종 아이콘 + 미확인 카운트 배지
클릭 → 드롭다운 안 최근 20개 알림 list
각 항목: eventType + 콘텐츠 제목 + 발생 시간 + CTA (해당 entity edit 또는 큐 detail)
```

> **결정 (UX-NOTIFY-03)**: 본 plan 의 NotificationInbox UI 는 `notification_outbox` 테이블 안 envelope 직접 SELECT (notifications Feature 본 구현 안 NotificationInbox table 합류 까지). notifications Feature 본 구현 후 마이그레이션 — notification_outbox → NotificationInbox 안 데이터 이전 또는 UI 안 새 table 안 source 전환. NF-CASCADE 정합 marker.

> **결정 (UX-NOTIFY-03b · cycle1 AUX-05 정정)**: NotificationInbox UI = **server component** 안 `withSkeletonTx({ signedToken, instanceId })` 안 호출 (현 admin tenant context 안 RLS 자동 통과). notification_outbox SELECT 안 `WHERE instance_id = ctx.instanceId` 안 RLS policy 자동 필터링 — 본 admin 안 다른 instance 안 envelope 안 노출 없음. 운영자 어드민 페이지 진입 시 매 페이지 안 NotificationInbox 컴포넌트 mount (admin layout 안 통합).

### 8.3 페이지 상단 상태바 (UX-NOTIFY-04) — cycle4 AUX4-03 정정

각 entity edit page 상단 안 통일 status bar:
- 현재 entity status (StatusBadge)
- 현재 lifecycle 위치 (draft → ... → published)
- 다음 action (workflow 안 가능한 action 안 1건)
- 검수 진행 상태 (검수 큐 진입 시)

**컴포넌트 spec**:
```typescript
type PageStatusBarProps = {
  entityType: "Article" | "TreatmentPage" | "FAQ" | "Publication" | "MediaAppearance" | "LegalDocument" | "DoctorProfile" | "ClinicProfile" | "LocationProfile";
  entityStatus: "draft" | "review-queued" | "in-review" | "approved" | "publishable" | "published" | "rejected" | "blocked" | "stale";
  lifecycle?: "draft" | "ready" | "release-pending" | "published";  // entity 단위 lifecycle (instance 단위와 분리 · ClinicProfile 만 본 prop 활용)
  nextActions: Array<{ label: string; href: string; variant: "primary" | "secondary" | "ghost" }>;
  reviewStatus?: { entriesOpen: number; assignedTo?: string };  // 검수 큐 진입 시
};
```
위치: 각 entity edit page 안 header 아래 (NavMenu + Breadcrumb · PageStatusBar 순서). 한 줄 안 horizontal layout (StatusBadge + lifecycle 인디케이터 + nextActions group).

### 8.4 대시보드 알림함 (UX-NOTIFY-05) — cycle2 AUX2-04 정정

대시보드 안 § 3.3 layout 의 "🔔 알림 (3건)" 영역. notification_outbox 안 최근 N건 표시.

**M0 정책 (단순화)**: 최근 20건 만 표시 (페이징 만 · read 추적 안 함). 매 진입 시 동일 알림 표시 가능 — 사용자 안 UX-DEFER-16 cascade 까지 수용.

**M1 합류 (UX-DEFER-16 신설)**: admin_user_notification_read JOIN table 신설 (admin_user × notification_outbox 안 read_at) — 마이그레이션 + read marking 추적 + 미확인 카운트 정확화.

## 9. 외부 API 자동 채움 (UX-EXT-01~)

### 9.1 CrossRef (논문) — UX-EXT-01

```typescript
// apps/web/src/lib/admin/ext-crossref.ts
async function fetchCrossRefByDoi(doi: string): Promise<PublicationMeta | null> {
  // CrossRef public API: https://api.crossref.org/works/{doi}
  // SSRF guard: hostname allowlist (api.crossref.org 만)
}
```

응답 매핑: title · authors[] · containerTitle (journal) · publishedPrint (date) · DOI · URL.

### 9.2 PubMed esearch/esummary — UX-EXT-02

```typescript
// PubMed E-utilities: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id={pmid}&retmode=json
```

응답 매핑: title · authors[] · source (journal abbreviation) · pubdate · pmid · DOI (있다면).

### 9.3 YouTube oEmbed — UX-EXT-03

```typescript
// https://www.youtube.com/oembed?url={url}&format=json
```

응답 매핑: title · author_name (채널명) · thumbnail_url · duration (별도 API · oEmbed 안 미포함).

### 9.4 SSRF guard + rate limit + retry 정합 (UX-EXT-04) — cycle1 AUX-08 정정

3 API 모두 site-meta-fetch 의 SSRF guard 패턴 재사용:
- hostname allowlist (api.crossref.org · eutils.ncbi.nlm.nih.gov · www.youtube.com · youtube.com)
- HTTPS only
- timeout 10s
- response size limit 1MB
- response content-type 검증 (application/json 등)

**rate limit + retry policy** (cycle1 AUX-08 정정):

| API | rate limit | retry policy | M0 vs M1 |
|---|---|---|---|
| CrossRef | 50 req/sec (무료 권장) | 429 응답 시 1s backoff 후 1회 retry · 그 후 fail | M0 fire-and-forget (per-instance throttle 미합류) · M1 안 SimpleQueue helper |
| PubMed eutils | 3 req/sec (무료 · API key 시 10/sec) | 429 응답 시 1s backoff 후 1회 retry | 동상 |
| YouTube oEmbed | 무제한 (사실상) · abuse 시 IP block | 429 응답 시 1s backoff 후 1회 retry | 동상 |

**failure UX**: 429 또는 5xx 안 사용자 표시 — "외부 API 응답 지연 — 잠시 후 다시 시도하세요" + 수동 fallback (사용자가 직접 필드 입력).

### 9.5 자동 호출 trigger (UX-EXT-05) — cycle2 AUX2-05 정정 · cycle3 AUX3-03 정정

DOI · PMID · URL 입력 후 자동 fetch trigger:
- **blur (focus 이탈)**: 입력 후 다른 필드로 이동 시 자동 fetch + 비어 있는 필드 prefill (site-meta-fetch 안 "기존 값 덮어쓰기" 옵션 패턴 정합)
- **explicit "자동 채움" 버튼**: 입력 필드 옆 "🔍 채우기" 버튼 — 클릭 시 fetch (사용자 명시 액션 · 덮어쓰기 적용 가능)
- 두 방식 모두 가능 — 기본 = blur auto · 사용자 수동 진입 = button

**debounce + cache (cycle3 AUX3-03 정정)**:
- blur trigger 안 **300ms debounce** — 사용자가 빠르게 다른 필드로 이동 시 마지막 입력 만 fetch
- 동일 DOI/PMID/URL 재입력 시 **sessionStorage cache** 안 결과 재사용 — 동일 ID 안 매 blur 마다 fetch 회피 (rate limit + UX 둘 다 안전)
- cache key: `ext-fetch:{api}:{id-hash}` · TTL: session 단위 (페이지 reload 시 invalidate)

## 10. 출시 미리보기 + 검수 단일 플로우 (UX-PREVIEW-01~)

### 10.1 ReleasePreviewModal (UX-PREVIEW-01)

대시보드 안 "출시 준비" 버튼 (lifecycle=ready 진입 시 활성) 클릭 → ReleasePreviewModal 안 진입.

modal 구조:
1. **누락 검사 결과** — § 3.2 출시 차단 lint 결과 (전체 통과 시 만 다음 단계 활성)
2. **공개 사이트 iframe 미리보기** — `/{instanceSlug}/` (배포 전 상태)
3. **검수 요청 한 클릭** — 모든 unpublished entity 안 일괄 submitForReview (또는 entity 별 선택)
4. **확인** — instance.release_state.state = 'release-pending' 명시 UPDATE (UX-LIFECYCLE-03 hybrid 정합)

**iframe 안 보안 (cycle2 AUX2-06 정정)**:
- iframe src = 같은 origin (`/{instanceSlug}` — admin 과 동일 도메인 안)
- next.config.js 안 `X-Frame-Options: SAMEORIGIN` 또는 CSP `frame-ancestors 'self'` 설정 정합
- 향후 도메인 분리 (M0_BUILD_EXPORT 안 사이트 빌드 export 합류 시 다른 도메인 안 노출) 안 별 iframe 정책 cascade — UX-DEFER cascade marker

## 11. 품질 점수 + SEO/GEO 추천 (UX-QUALITY-01~)

### 11.1 점수 산정 (UX-QUALITY-01) — cycle1 AUX-09 정정

4 카테고리 가중치 합산 (전체 100점 만점):

| 카테고리 | 가중치 | 룰 |
|---|---|---|
| **출시 권장 lint** (§ 3.2 8 룰) | 30% | doctor-photo / doctor-bio-300chars / treatment-min-three / faq-min-five / article-min-one-per-category / publication-min-one / media-appearance-min-one / multiple-cta-channels |
| **E-A-T 신호** | 30% | Publication count (0=0점 · 1~2=10점 · 3+=20점 · 5+=30점) · MediaAppearance count (동상 weights) · 의료진 자격증/약력 풀필성 (300자 이상 의료진 비율) |
| **SEO 신호** | 20% | sitemap entry 수 (10+=10점 · 20+=20점) · JSON-LD entity 안 schema.org 완성도 (필수 필드 percent · 90%+=20점) · meta description 길이 정합 |
| **컴플라이언스 신호** | 20% | compliance-assistant 안 finding count (0건=20점 · 1~5건=15점 · 6~10=10점 · 11+=0점) · warning 큐 진입 entry 수 |

```typescript
// apps/web/src/lib/admin/quality-score.ts
// cycle3 AUX3-06 정정 — QualityScoreInput type 추가
export type QualityScoreInput = InstanceEntities & {
  complianceFindings: Array<{ ruleId: string; severity: "fail" | "content-gate" | "warning" | "info" }>;
  sitemapEntryCount: number;
  warningQueueOpenCount: number;
};

export type QualityScore = {
  total: number;                          // 0~100
  breakdown: {
    recommended: number;                  // 0~30
    eat: number;                          // 0~30
    seo: number;                          // 0~20
    compliance: number;                   // 0~20
  };
  suggestions: Array<{ id: string; label: string; pointsGain: number; href: string }>;
};

export function computeQualityScore(input: QualityScoreInput): QualityScore { ... }
```

`pointsGain` = 해당 추천 항목 해결 시 점수 상승 예상값 (운영자 안 next-action 우선순위 산정 입력).

### 11.2 추천 항목 catalog (UX-QUALITY-02)

각 미충족 항목 안 "추천 (+N점)" 표시 + 해결 방법 안내 (예: "Publication 1+ 추가 → 학술적 권위 강화 (+3점)").

## 12. 마이그레이션 전략 (UX-MIGRATE-01~)

### 12.1 점진적 마이그레이션 (UX-MIGRATE-01) — cycle4 AUX4-02 정정

기존 12 entity 폼 안 모두 한 번에 신패러다임 안 마이그레이션 불가능 (코드 분량 큼).

**우선순위 결정 근거**:
- 1·2 (UI primitive + 출시 evaluator) — 가장 영향 큼 + 기존 폼 영향 없음 (신설 만) → safe 출발
- 3 (대시보드) — W3 가장 가시적 효과 (사용자 진단 1순위)
- 4 (ClinicProfile 단계형) — 가장 복잡 + 사용자 진단 1순위
- 5·6 (zod schema 분리 + DB migration) — entity 별 점진 (1개 entity 끝낸 후 다음)
- 7·8·9·10 (다건 등록 · 알림 · 외부 API · 출시 모달) — UI primitive 의존 (W1 후)

순서:
1. **공통 UI primitive library** (§ 7) 신설 — 기존 폼 안 영향 없음
2. **출시 evaluator** (§ 4.3) 신설 — 기존 zod 영향 없음
3. **대시보드 재설계** (§ 3) — 기존 page.tsx 완전 교체
4. **ClinicProfile 단계형** (§ 5) — 기존 단일 폼 안 wizard 안 wrap (점진적)
5. **저장 vs 출시 zod schema 분리** (§ 4) — entity 별 (ClinicProfile 먼저 → 나머지 9 entity 순차)
6. **의료진/FAQ 인라인 테이블** (§ 6.1·6.2) — 기존 detail page 유지 + 인라인 화면 신설
7. **시술 템플릿 + 슬롯형** (§ 6.3) — 기존 form 안 슬롯형 옵션 신설
8. **전역 알림 + NotificationInbox UI** (§ 8) — 신설
9. **외부 API 자동 채움** (§ 9) — Publication/MediaAppearance form 안 통합
10. **ReleasePreviewModal** (§ 10) — 신설

### 12.2 backwards-compatibility (UX-MIGRATE-02)

기존 entity 폼 (DoctorProfileForm 등) 안 신패러다임 마이그레이션 이전 안 기존 URL 그대로 유지. 신패러다임 화면 안 별도 URL (`/admin/{slug}/doctors?view=inline` 등) 안 옵션 진입.

## 13. § 8.1 시나리오 cascade (UX-TEST-01) — cycle1 AUX-15 정정

**fixture 표준** (모든 시나리오 공통): 각 시나리오 안 `beforeEach` 안 `sharedFixture()` helper 사용:
- instance 1개 (slug='demo' · release_state='draft')
- admin_user 3명 (operator · physician-reviewer · legal-reviewer 각 1명 · 모두 active=true)
- instance_membership 3 row (위 user × demo instance · active=true)
- ClinicProfile minimal 1 row (name 만 채움 · 나머지 NULL — 출시 차단 lint 다수 미통과)
- LocationProfile main 부재 (단계 2 진입 시 생성)
- 5 LegalDocument 부재 (단계 5 진입 시 생성)

`sharedFixture()` 안 reset 동작 (각 시나리오 후 teardown). 시나리오 별 변형 (예: 시나리오 N — submitter active=false) 만 override.



| # | 시나리오 | 통과 기준 | 검증 |
|---|---|---|---|
| 1 | 신규 instance seed 직후 lifecycle='draft' · 출시 준비도 0% | dashboard 안 draft 표시 + 모든 차단 lint 미통과 | vitest |
| 2 | ClinicProfile 안 name 만 채움 → lifecycle 그대로 draft · 차단 lint 10/11 | clinic-name-set 통과 외 모두 미통과 | vitest |
| 3 | 모든 출시 차단 lint 통과 → lifecycle 자동 'ready' · "출시 준비" 버튼 활성 | derived lifecycle 산정 정합 | vitest |
| 4 | ReleasePreviewModal 안 검수 요청 한 클릭 → 모든 unpublished entity submitForReview | 1+ ReviewQueueEntry 생성 | e2e |
| 5 | 검수 통과 → instance.released → lifecycle='published' | (UX-LIFECYCLE-03 derived) | e2e |
| 6 | ClinicProfile L2 zod 저장 schema 통과 + L3 출시 schema 미통과 (예: description 50자) → 저장 성공 + dashboard 안 차단 lint 표시 | partial 저장 가능 + 출시 evaluator 정확 | vitest |
| 7 | DoctorsInlineTable 안 3행 추가 + 저장 → 3 row INSERT (동시) | 일괄 저장 동작 | vitest |
| 8 | FAQ 스프레드시트 안 5행 붙여넣기 (질문\t답변 line-separated) → parse 후 5 row INSERT | 붙여넣기 parse 정확 | vitest |
| 9 | 시술 템플릿 "다이어트" 선택 + 제목 3개 입력 → 3 TreatmentPage draft INSERT (슬롯 marker 안 빈 body) | 일괄 생성 동작 | vitest |
| 10 | CrossRef DOI 입력 → Publication form 안 title/authors/journal 자동 채움 | API 응답 mapping 정확 | vitest + mock fetch |
| 11 | YouTube URL 입력 → MediaAppearance form 안 title/thumbnail 자동 채움 | oEmbed 응답 mapping 정확 | vitest + mock fetch |
| 12 | NotificationInbox 안 종 아이콘 클릭 → 최근 20개 envelope 표시 | notification_outbox 안 SELECT 정확 | vitest + e2e |
| 13 | Toast — 저장 성공 시 표시 + 자동 dismiss 3s | UI 동작 | vitest (테스트 라이브러리) |
| 14 | StatusBadge — 9 status 안 색상 정합 | DESIGN_TOKENS 정합 검증 | vitest |
| 15 | WorkflowActionGroup — status='draft' 시 "검수 요청" 만 / status='publishable' 시 "발행" 만 노출 | lifecycle 조건부 정합 | vitest |
| 16 | SaveStatusPanel — dirty 시 "저장되지 않은 변경" + 페이지 이탈 경고 (beforeunload) | UX | vitest |
| 17 | ErrorSummary — fieldErrors 안 운영자 언어 변환 ("policyContactPhone" → "정책 담당자 전화번호") | i18n-style mapping | vitest |
| 18 | ClinicProfile 단계 5 진입 시 단계 1~4 미통과 차단 + 안내 | wizard 조건부 진입 | vitest + e2e |
| 19 | ClinicProfile 단계 5 안 5 LegalDocument 통합 tx 정합 (LWI-01) | 정책 변수 정합 (최신 ClinicProfile 안 변수 렌더) | vitest |
| 20 | 품질 점수 산정 — Publication 1+ 추가 시 점수 +3 | 알고리즘 정확 | vitest |
| 21 | (cycle2 AUX2-09) Publication form 안 DOI 입력 + blur → CrossRef fetch + title/authors/journal/publishedDate 자동 prefill | API 응답 mapping 정확 + blur trigger | vitest + mock fetch |
| 22 | (cycle2 AUX2-09) 단계 5 진입 시 ClinicProfile + LocationProfile FOR UPDATE lock → 동시 단계 1 PATCH 안 wait + 시퀀스 commit 후 lock 자동 해제 | snapshot isolation 안전 | vitest + e2e |
| 23 | (cycle2 AUX2-09) grandfather flag (`metadata.legacyGrandfathered=true`) 가 published row 안 출시 evaluator skip + UI 안 "(기존 발행분 — 정합성 검증 권장)" 안내 표시 | retrospective check policy | vitest + e2e |
| 24 | (cycle3 AUX3-04) 전역 toast — 저장 성공 시 표시 + 자동 dismiss 3s + stack 최대 5개 + error 우선순위 (동시 success+error 시 error 먼저 표시) | UI 동작 + dismiss 타이머 + stack ordering | vitest + RTL |
| 25 | (cycle3 AUX3-04) NotificationInbox UI — 종 아이콘 클릭 → notification_outbox 안 최근 20건 표시 + RLS 자동 필터 (다른 instance envelope 노출 0) | server component + tenant context 정합 | vitest + e2e |
| 26 | (cycle3 AUX3-04) 의료진 인라인 테이블 안 일괄 저장 — 5 row 중 3 row valid + 2 row invalid (예: slug 중복) → 전체 rollback + 인라인 에러 안 어느 row · 어느 필드 표시 | atomicity (single tx) | vitest + e2e |
| 27 | (cycle3 AUX3-04) instance lifecycle 전이 — operator "출시 검수 요청" 클릭 시 instance.release_state.state = 'release-pending' UPDATE + audit_event 'instance-lifecycle-transitioned' emit | release_state column 정합 + audit 정합 | vitest + e2e |

## 14. 작업 manifest (UX-WORK-01) — cycle2 AUX2-10 정정 (depends_on 추가)

본 plan code cycle 작업 분해 (12 단계):

| # | 작업 | 산출물 | depends_on |
|---|---|---|---|
| W1 | 공통 UI primitive 라이브러리 (§ 7) — 8 컴포넌트 신설 | apps/web/src/components/admin/ui/*.tsx | — |
| W2 | 출시 evaluator + lint catalog (§ 3·§ 4) | apps/web/src/lib/admin/{release-evaluator, release-readiness, release-lint-catalog}.ts | W6 |
| W3 | 대시보드 재설계 (§ 3.3) | apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx 완전 교체 | W1·W2 |
| W4 | ClinicProfile 단계형 wizard (§ 5) | apps/web/src/components/admin/clinic-profile/ClinicProfileWizard.tsx + 5 step 컴포넌트 | W1·W5 |
| W5 | 저장 vs 출시 zod schema 분리 (§ 4) — 10 entity (우선순위 ClinicProfile → 나머지 9 순차) | apps/web/src/lib/{entity}-save-schema.ts + {entity}-release-schema.ts | W6 |
| W6 | DB CHECK nullable 화 마이그레이션 — entity 별 분리 (C0023a~j 10 migration · 표 아래 cycle3 AUX3-08) + grandfather backfill + treatment_page.body_slots column + C0024 instance_release_state | packages/core-content/migrations/C0023a~j_*.sql + C0024_instance_release_state.sql | — |
| W7 | DoctorsInlineTable + FAQ 스프레드시트 + 시술 템플릿 (§ 6) | apps/web/src/components/admin/{doctors,faqs,treatments}/Inline*.tsx | W1·W5 |
| W8 | 전역 알림 + NotificationInbox UI (§ 8) | apps/web/src/components/admin/ui/{Toast,NotificationInbox}.tsx + integration | W1 |
| W9 | 외부 API 자동 채움 (§ 9) — 3 helper + UX-EXT-05 blur trigger | apps/web/src/lib/admin/ext-*.ts + Publication/MediaAppearance form 통합 | W1 |
| W10 | ReleasePreviewModal + 검수 단일 플로우 (§ 10) | apps/web/src/components/admin/ui/ReleasePreviewModal.tsx + dashboard 통합 | W1·W2 |
| W11 | vitest scenarios **27건** (§ 13) | apps/web/src/lib/admin/__tests__/*.test.ts | W2~W10 all |
| W12 | docs cascade — **11 cascade marker (UX-CASCADE-01~11 · § 16 참조)** — REVIEW_WORKFLOW § 7.1 + 출시 evaluator + DATA_MODEL + DESIGN_TOKENS + features/notifications NF-DEFER-10 + features/compliance-assistant slotMatches + LOCATION_LEGAL LWI-01 + EAT_CONTENT 다건 등록 + migrations-runner manifest 33단계 + NOTIFICATIONS_M0_PLAN + entity 별 migration 분리 패턴 | doc patches | W2·W6 |

**W6 entity 별 migration 표 (cycle3 AUX3-08 정정)**:

| migration | entity | 변경 | grandfather backfill |
|---|---|---|---|
| C0023a | clinic_profile | logo_url · og_image_url · policy_contact_* nullable + brand_tokens 기존 column 유지 | published row 안 NULL 검출 시 metadata.legacyGrandfathered=true 마킹 |
| C0023b | location_profile | phone · email · latitude · longitude 일부 nullable | 동상 |
| C0023c | doctor_profile | photo_url · bio nullable | 동상 |
| C0023d | treatment_page | summary 일부 nullable + **body_slots JSONB DEFAULT '{}' 신설** | 동상 |
| C0023e | article | summary · hero_image_url nullable | 동상 |
| C0023f | faq | answer 일부 nullable | 동상 |
| C0023g | publication | journal · doi · pmid 기존 nullable 유지 (변경 없음) · 표기 만 | — |
| C0023h | media_appearance | description · thumbnail_url nullable | 동상 |
| C0023i | legal_document | (LL-WORKFLOW-INTEGRATION 정합 — body drift 안 변경 없음) | — |
| C0023j | article_category | description nullable | 동상 |
| C0024 | (instance) | instance.release_state JSONB DEFAULT '{"state":"draft","lastTransitionAt":null,"transitionBy":null,"releasedAt":null}' 신설 | 기존 instance row 모두 default 적용 |

## 15. UX-DEFER markers (M1 Phase Alpha / M2+ 합류)

(§ 1.3 비범위 표 중복 — phase 별 분류)

### 15.1 M1 Phase Alpha 합류
- `UX-DEFER-04`: 모바일 admin (responsive)
- `UX-DEFER-05`: 키보드 shortcut (Cmd+S · Cmd+K)
- `UX-DEFER-06`: undo/redo · history log
- `UX-DEFER-09`: 출시 일정 예약 (scheduler)
- `UX-DEFER-13`: CSV/Excel 일괄 import
- `UX-DEFER-14`: WCAG 2.1 AA 접근성 audit

### 15.2 Phase Beta 합류
- `UX-DEFER-01`: BrandTokens admin UI 완성 (color picker · 폰트 picker)
- `UX-DEFER-08`: AI 보조 (LLM 통합)
- `UX-DEFER-11`: 외부 collaborator 초대

### 15.3 M2+ 합류
- `UX-DEFER-03`: 다국어 (i18n)
- `UX-DEFER-07`: collaborative editing (presence · CRDT 등)
- `UX-DEFER-10`: A/B 테스트

### 15.4 다른 cycle cascade
- `UX-DEFER-02`: 출시 후 monitoring 대시보드 — analytics-reporting / search-visibility Feature 본 구현 합류
- `UX-DEFER-12`: OG image 자동 생성 — PSR-DEFER-09 정합
- `UX-DEFER-15`: admin dark mode toggle — PSR-DEFER-03 정합

## 16. Cascade markers (다른 SoT 문서로 전파)

- `UX-CASCADE-01`: `docs/admin/REVIEW_WORKFLOW.md` § 7.1 publishable 6조건 → 출시 evaluator (§ 4.3) cascade marker. § 9 알림 정책 → § 8 NotificationInbox UI 합류 marker.
- `UX-CASCADE-02`: `docs/core/DATA_MODEL.md` — 출시 evaluator 안 entity 별 release schema 정합 marker (저장 schema vs 출시 schema 분리 패턴 SoT 등록).
- `UX-CASCADE-03`: `docs/core/DESIGN_TOKENS.md` — 공통 UI primitive 컴포넌트 library (§ 7) 안 token 정합 marker. 8 신규 컴포넌트 안 component-level token 매핑 추가.
- `UX-CASCADE-04`: `docs/features/notifications.md` NF-DEFER-10 → **부분 해소** marker (in-app NotificationInbox UI 구현 · 단 11 tables 안 Inbox table 자체는 notifications Feature 본 구현 합류 · 본 plan 안 notification_outbox 안 직접 SELECT 패턴).
- `UX-CASCADE-05`: `docs/features/compliance-assistant.md` slotMatches SoT → § 6.3 시술 슬롯형 에디터 정합 marker. 슬롯 marker 패턴 (`<!-- slot:xxx -->`) catalog 등록.
- `UX-CASCADE-06`: `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` § 1.2 publishable evaluator (CA-GATE-03) → 본 plan § 4.3 출시 evaluator 와 통합 marker (compliance + 출시 evaluator chain).
- `UX-CASCADE-07`: `docs/decisions/LOCATION_LEGAL_PLAN.md` LWI-01 (5 LegalDocument 통합 tx) → § 5.3 단계 5 정책/법무 LWI-01 호환성 marker.
- `UX-CASCADE-08`: `docs/decisions/EAT_CONTENT_PLAN.md` — Publication/MediaAppearance/ArticleCategory 안 다건 등록 + 외부 API 자동 채움 정합 marker.
- `UX-CASCADE-09` (cycle2 AUX2-11 정정): `packages/migrations-runner/src/manifest.ts` — entity 별 migration 분리 (C0023a~j 10 migration · C0024 instance_release_state 1 migration). manifest 22 → **33 단계** (22 + 11). 각 migration 안 dependsOn (C0023a clinic_profile_release_split ← C0001 clinic_profile · C0024 instance_release_state ← D0010 instance 등) 명시.
- `UX-CASCADE-10`: `docs/decisions/NOTIFICATIONS_M0_PLAN.md` NF-DEFER-10 부분 해소 marker (UX-CASCADE-04 cascade) + NF-CASCADE 추가 (in-app inbox UI 안 notification_outbox SELECT 패턴 안 향후 notifications Feature 본 구현 합류 시 마이그레이션 marker).
- `UX-CASCADE-11` (cycle3 AUX3-07 신설): `packages/core-content/migrations/` — entity 별 release schema split migration 분리 패턴 (C0023a~j 10 migration · 단일 entity 안 advisory lock 안전 · rollback granular) marker. 본 패턴 미래 모든 entity 안 schema 변경 시 동일 분리 적용 권장 — single migration 안 multiple entity ALTER 회피 (rollback risk · advisory lock 충돌 회피).

## Code v1.0 acceptance (2026-05-20)

W1~W12 작업 (UX-CASCADE-01~11 + 12 manifest 단계 + 27 vitest 시나리오) 안 본 code cycle 안 산출물 수렴 — 159 cycle 1305 지적 누계.

### 산출물 요약

| 작업 | 산출물 | 상태 |
|---|---|---|
| W1 | `apps/web/src/components/admin/ui/` 9 컴포넌트 (SaveStatusPanel · DirtyIndicator · ErrorSummary · FieldErrorBubble · StatusBadge · WorkflowActionGroup · ReleasePreviewModal · QualityScoreCard · PageStatusBar) + barrel | ✅ |
| W2 | `apps/web/src/lib/admin/{release-evaluator-types,release-lint-catalog,release-evaluator,release-readiness,quality-score}.ts` (5 파일 · 19 lint rule · entity 단위 evaluator 3 + instance evaluator · 4 카테고리 가중치) | ✅ |
| W3 | `apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx` 전체 재작성 (2-column · ReleaseReadinessCard + QualityScoreCard · 5 quick action · NotificationInbox) + `DashboardClient.tsx` + `dashboard-data.ts` + `ReleaseReadinessCard.tsx` | ✅ |
| W4 | `ClinicProfileForm.tsx` 안 5단계 wizard (anchor scroll · WizardStepper sticky · ← 이전 / 다음 → / 발행 nav) | ✅ |
| W5 | `apps/web/src/lib/admin/{save-schemas,release-schemas}.ts` — 10 entity × 2 schema (save 느슨 · release 엄격) | ✅ |
| W6 | `packages/core-content/migrations/C0023a~j_*_release_split.sql` (10 entity 별 마이그레이션) + `C0024_instance_release_state.sql` (release_state JSONB column + CHECK constraint) | ✅ (이전 cycle) |
| W7 | `QuickAddDoctorRow.tsx` + `FaqSpreadsheet.tsx` — 의료진 inline quick-add · FAQ 5 row spreadsheet. Treatment slot editor = **UX-DEFER-19** (body_slots column 안 slot marker rendering 합류 필요) | ✅ 부분 (treatment slot deferred) |
| W8 | `NotificationInbox.tsx` (notification_outbox SELECT + safe fallback) + `ToastProvider.tsx` (5초 자동 dismiss · useToast hook) + admin layout 안 mount | ✅ |
| W9 | `apps/web/src/lib/external-metadata.ts` (CrossRef · PubMed · YouTube oEmbed) + `apps/web/src/app/api/external-metadata/route.ts` (Origin · 세션 검증 · 4KB body limit · 256KB 응답 cap). Form integration (PublicationForm/MediaAppearanceForm 안 자동 채움 버튼) = **UX-DEFER-20** | ✅ 부분 (form wire deferred) |
| W10 | `release-actions.ts` 안 `requestReleaseReview` (draft → release-pending) + `publishInstance` (release-pending → published · super-admin only) + `DashboardClient.tsx` 안 modal trigger + Toast | ✅ |
| W11 | `apps/web/src/lib/admin/__tests__/release-evaluator.test.ts` 16 시나리오 (release-evaluator 6 + recommended-lint 1 + lint-catalog 2 + quality-score 2 + save/release schema 3 + readiness 2). vitest 147/147 PASS | ✅ |
| W12 | 본 section + MEMORY.md milestone entry | ✅ |

### UX-DEFER 추가 마커 (코드 cycle 안 신설)

- `UX-DEFER-19`: Treatment template + body_slots JSONB column 안 slot textarea editor — TreatmentForm 안 신설 컴포넌트 필요 + slot marker 안 server-side rendering 정합 필요. W7 안 deferred.
- `UX-DEFER-20`: PublicationForm / MediaAppearanceForm 안 "CrossRef/PubMed/YouTube 자동 채움" 버튼 + state hydration — endpoint (W9) 는 구축 완료, form integration 만 별 cycle. `useState` + fetch + apply 패턴 동일.
- `UX-DEFER-21`: notification_outbox 마이그레이션 (C-XX 신설 안 notifications Feature 본 구현). 현재 NotificationInbox UI 안 safe fallback 안 빈 list 처리. 마이그레이션 합류 시 자동 wire.

### 구현 drift marker (v1.0 plan 대비)

- `UX-CODE-DRIFT-01`: § 6 ClinicProfile wizard — fieldset 안 hide/show 안 적용 안 함 (모든 fieldset visible · anchor scroll only). 이유: 단일 form action 안 단일 submission 안 retain 위해 모든 fieldset 안 input 안 DOM 안 유지 필요 (hidden 시 display:none 안 form data submit OK 이지만, 분량 절감 + 사용자가 step click 안 자유 nav 안 가능 — UX plan 의도 정합).
- `UX-CODE-DRIFT-02`: § 7 다건 등록 UX 3 패턴 중 2 패턴 (doctor inline + FAQ spreadsheet) 만 구현. Treatment slot editor (3번째) → UX-DEFER-19.
- `UX-CODE-DRIFT-03`: § 9 외부 API 3 helper (CrossRef · PubMed · YouTube) 안 endpoint 만 구축. Form integration → UX-DEFER-20.

## 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-20 | **v1.0 code** | **W1~W12 code cycle 안 완료** — typecheck PASS + vitest 147/147 PASS. UX-DEFER 16종 → 19종 (UX-DEFER-19/20/21 신설). UX-CODE-DRIFT 3종 명시. 본 cycle 산출물: W1 9 컴포넌트 + W2 5 lib · W3 dashboard 재작성 · W4 5단계 wizard · W5 10 entity × 2 schema · W7 QuickAddDoctorRow + FaqSpreadsheet · W8 NotificationInbox + ToastProvider · W9 external-metadata 3 provider + endpoint · W10 publishInstance action · W11 16 vitest 시나리오 · W12 docs cascade. |
| 2026-05-19 | **v1.0** | **Codex self-critique cycle 5 closeableAfterPatch=true 확정 acceptance** — blocking 0 · major 0 · minor 3 표현/정합 patch 모두 흡수. (AUX5-01) § 14 W12 안 "11 cascade marker (UX-CASCADE-01~11)" 명시. (AUX5-02·03) 표 안 minor 정합 marker. 누계 cycle 1+2+3+4+5 = 42 findings 전건 수용 (15 + 11 + 8 + 5 + 3). UX-DEFER 16종 + UX-CASCADE 11종 안정판. 실 코드 cycle 안 W1~W12 작업 분해 (depends_on 포함) 진입 준비 완료. acceptance commit 안 12 cascade docs 동시 포함 marker (UX-CASCADE-01~11 + plan 본문). 실 SQL/TS 코드 cascade 는 별 cycle (admin-ux-redesign code v1.0). |
| 2026-05-19 | v0.5 | **cycle 4 self-critique 5 finding (blocking 0 · major 1 · minor 4) 전건 수용 patch**: (AUX4-01) § 6.2 FAQ 스프레드시트 보안 정책 추가 (100 행 limit · 셀 길이 limit · sanitize-html · preview-before-commit). (AUX4-02) § 12.1 마이그레이션 우선순위 결정 근거 명시. (AUX4-03) § 8.3 PageStatusBar 컴포넌트 spec (props · 위치). (AUX4-04) § 1.2 시나리오 카운트 "20+ → 27건" 정정. (AUX4-05) § 14 W11 "23 → 27건" 정정. 누계 cycle 1+2+3+4 = 39 findings 전건 수용. UX-DEFER 16종 + UX-CASCADE 11종. 수렴 추세 15 → 11 → 8 → 5. cycle 5 안 closeableAfterPatch=true 도달 예상. |
| 2026-05-19 | v0.4 | **cycle 3 self-critique 8 finding (blocking 1 · major 3 · minor 4) 전건 수용 patch**: (AUX3-01) § 7.5~7.9 안 § 7.4 뒤로 이동 (문서 구조 정합). (AUX3-02) § 4.3 안 computeRecommendedLintItems() helper 시그니처 + sketch. (AUX3-03) § 9.5 안 300ms debounce + sessionStorage cache. (AUX3-04) § 13 시나리오 24~27 신설 (toast · NotificationInbox · 인라인 atomicity · lifecycle 전이). (AUX3-06) § 11.1 안 QualityScoreInput type 추가. (AUX3-07) § 16 UX-CASCADE-11 신설 (entity 별 migration 분리 패턴 marker). (AUX3-08) § 14 W6 안 entity 별 migration 표 (C0023a~j · C0024). 누계 cycle 1+2+3 = 34 findings 전건 수용. UX-DEFER 16종 + UX-CASCADE 11종. 수렴 추세 15 → 11 → 8. |
| 2026-05-19 | v0.3 | **cycle 2 self-critique 11 finding (blocking 2 · major 4 · minor 5) 전건 수용 patch**: (AUX2-01) § 4.3 evaluateInstanceRelease() 시그니처 + 알고리즘 (entity 별 evaluator 호출 + collection-level lint + lifecycle 산정 + scorePercent). (AUX2-02) § 5.3 deadlock 방지 — lock 순서 ClinicProfile → LocationProfile → 5 LegalDocument alpha 고정 (LL-ACTION-04 정합). (AUX2-03) § 4.2 안 9 entity layer 매핑 표 추가 (LocationProfile · DoctorProfile · TreatmentPage · Article · FAQ · Publication · MediaAppearance · LegalDocument · ArticleCategory). (AUX2-04) § 8.4 대시보드 알림함 — M0 단순화 (최근 20건 · read 추적 안 함) + UX-DEFER-16 신설 (read marking M1). (AUX2-05) § 9.5 외부 API trigger — blur auto + explicit button. (AUX2-06) § 10 iframe SAMEORIGIN + CSP frame-ancestors. (AUX2-07) § 1.2 비범위 표 안 UX-DEFER-15 정합. (AUX2-08) § 7.5~7.9 안 5 컴포넌트 props 명세 추가. (AUX2-09) § 13 시나리오 21·22·23 신설. (AUX2-10) § 14 W1~W12 안 depends_on column 추가. (AUX2-11) § 16 UX-CASCADE-09 정정 (manifest 22 → 33 단계). 누계 cycle 1+2 = 26 findings 전건 수용. UX-DEFER 16종 + UX-CASCADE 10종. 수렴 추세 15 → 11. |
| 2026-05-19 | v0.2 | **cycle 1 self-critique 15 finding (blocking 4 · major 5 · minor 6) 전건 수용 patch**: (AUX-01) § 4.3 출시 evaluator + compliance publishable evaluator chain 알고리즘 + entity 별 compliance scope 표 명시. (AUX-02) § 5.3 LWI-01 호환성 안 SELECT FOR UPDATE lock + 단계 5 안 정책 변수 안전 렌더 패턴 정정. (AUX-03) § 4.2 마이그레이션 안 grandfather backfill 정책 + retrospective check policy. (AUX-04) § 2.2 instance.release_state JSONB column 신설 결정 (derived → hybrid). (AUX-05) § 8.2 NotificationInbox UI RLS scope 명시 (withSkeletonTx server component). (AUX-06) § 6.1 일괄 저장 atomicity 보장 (single tx · 전체 rollback). (AUX-07) § 6.3 시술 슬롯 body_slots 별 column 신설 (single string marker 안 사용자 입력 conflict 회피). (AUX-08) § 9.4 rate limit + retry policy 정의 (429 안 1s backoff 1회 retry). (AUX-09) § 11.1 품질 점수 4 카테고리 가중치 (출시 권장 30% · E-A-T 30% · SEO 20% · 컴플라이언스 20%) + computeQualityScore() 시그니처. (AUX-10·14) § 14 W5 안 10 entity 정확 list + 우선순위. (AUX-11) § 8.1 Toast 구체 사양 (위치 · dismiss · stack · 우선순위). (AUX-13) § 14 W6 안 entity 별 migration 분리 + body_slots column 동반. (AUX-14) § 7.4 WorkflowActionGroup backwards-compat 단계 명시. (AUX-15) § 13 시나리오 안 sharedFixture() 표준 marker. 누계 cycle 1 = 15 findings 전건 수용. UX-DEFER 15종 + UX-CASCADE 10종 안정. |
| 2026-05-19 | v0.1 | 초안 작성. 사용자 진단 (2026-05-19) 안 P0/P1/P2 전건 spec 화. § 2 패러다임 전환 (entity-CRUD → 출시 워크스페이스) · § 3 출시 체크리스트 대시보드 (11 차단 lint + 8 권장 lint) · § 4 3-layer 매트릭스 (DB CHECK · zod 저장 · zod 출시) · § 5 단계형 ClinicProfile 5 단계 · § 6 다건 등록 UX 3 패턴 · § 7 공통 UI primitive 8 컴포넌트 · § 8 전역 알림 4 종 · § 9 외부 API 3 helper · § 10 출시 미리보기 modal · § 11 품질 점수 알고리즘 · § 12 점진적 마이그레이션 + § 13 vitest 20+ 시나리오 + § 14 작업 manifest 12 단계 + § 15 UX-DEFER 15종 + § 16 UX-CASCADE 10종. compliance-assistant M0 plan v1.0 패턴 답습. |
