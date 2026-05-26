# NAVER_PLACE_PLAN (v1.0·acceptance·2026-05-26)

> **상태**: **v1.0 (acceptance)** — cycle 1 (12건) + cycle 2 (4건) + cycle 3 (2건) + cycle 4 (0건 수렴) self-critique 전건 흡수. **누계 18건 · 4 cycle 수렴**. acceptance 근거: (a) v1 scope = `clinic.metadata.naverPlace` jsonb (placeId + placeUrl) + JSON-LD sameAs (Organization + MedicalClinic) + 사이트 footer/contact link · (b) DB 변경 X · form 변경 X (metadataJson 직접 활용) · (c) silent fallback (invalid 시 null · 사이트 link 미렌더) · (d) NPL-DEFER 9건 · NPL-CASCADE 4건.

> **cycle 3 흡수 (2건)** + **cycle 4 (0건 수렴)**:
> (a) **#17** v1 시나리오 NPL-V01~V07 정정 — form 가정 → metadataJson 직접 편집 + silent fallback ·
> (b) **#18** buildClinicSameAs 안 `clinic.metadata.naverPlace` 경로 정확화 ·
> **cycle 4 수렴** — plan 변경 0건. acceptance criteria #1 충족.

> **cycle 2 흡수 (4건)**:
> (a) **#13** ClinicProfileForm 안 metadata 입력 = `metadataJson: string` 직접 편집 — 본 plan v1 안 별 input field 추가 비범위 (NPL-DEFER-09) · 운영자가 metadataJson 안 `naverPlace` 키 직접 추가 · runbook 안 예시 명시 ·
> (b) **#14** sameAs 합류 Organization · MedicalClinic 안 같은 URL 중복 — schema.org 안 정합 OK (다른 entity 의 별 sameAs · entity recognition 강화) ·
> (c) **#15** v1.0 acceptance criteria 7 task → 4 task (form input 비범위) ·
> (d) **#16** vitest — `validate.test.ts` 안 sameAs 시나리오 추가 + `db-projection.test.ts` 안 parseNaverPlace 시나리오 추가. v1 acceptance scope = **placeId + sameAs link mount 만** (최소 통합 · DB 변경 X · 외부 API X · 리뷰 ingest X). `clinic.metadata.naverPlace` jsonb 안 placeId + placeUrl 저장 + JSON-LD Organization · MedicalClinic graph sameAs 안 placeUrl 합류 + 사이트 footer/contact 안 link mount.

> **cycle 1 흡수 (12건)**:
> (a) **#1** organizationEntity + medicalClinicEntity 안 sameAs **신규 추가** (이전 미존재 — v1 안 first introduction) ·
> (b) **#2** MedicalBusiness entity 부재 — Organization + MedicalClinic 2 entity 만 합류 ·
> (c) **#3** naver host whitelist 확장 — `pcmap.place.naver.com` (PC map) 추가 ·
> (d) **#4** `ClinicMetadataProjection` 안 `naverPlace: NaverPlaceMeta | null` 필드 추가 — `localKeywords` 패턴 답습 ·
> (e) **#5** ClinicProfileForm 실제 metadata 입력 패턴 확인 (5 키 jsonb input 방식) ·
> (f) **#6** 운영자 hands-on flow — `MEANINGFUL_TRAFFIC_OPERATIONS.md` 안 placeId/placeUrl 추출 안내 추가 ·
> (g) **#7** clinic-profile-actions zod 통합 — server action 안 metadata.naverPlace 형식 ·
> (h) **#8** SiteFooter contactLinks `external` flag 패턴 답습 ·
> (i) **#9** view-source 검증 — JSON-LD `@graph` 내부 Organization sameAs 합산 ·
> (j) **#10** JSON-LD validate.test.ts 안 sameAs 시나리오 추가 ·
> (k) **#11** sameAs 합류 entity 정확화 — Organization + MedicalClinic (MedicalBusiness 부재) ·
> (l) **#12** parseClinicMetadata 안 parseNaverPlace helper 추가 (zod safeParse 패턴).

## SoT

- 사용자 진단 (2026-05-26) — "(b) 네이버 플레이스 메타 합류" plan. SVO 권장 순서 완주 (Phase 6) 후 다음 우선순위.
- `docs/decisions/MEANINGFUL_TRAFFIC_LOOP_PLAN.md` v1.0 — MTL-DEFER-07 (Naver Distribution Checklist UI) 와 인접 cycle (본 plan 안 미흡수 · 별 cycle).
- `docs/decisions/NAVER_SEARCH_INGEST_PLAN.md` v1.0 — NSA 와 별 entity (NSA = 검색 측정 · 본 plan = 플레이스 entity link).
- 기존 packages 시그니처:
  - `packages/core-content/src/schema.ts` 안 `clinic_profile.metadata` jsonb (C 하이브리드 — pillars/principles/stats/strengths/copy 5 키)
  - `apps/web/src/lib/db-projection.ts` 안 `ClinicProjection` (metadata 안 normalize)
  - `apps/web/src/lib/json-ld/entities.ts` 안 LocalBusiness · MedicalBusiness · MedicalClinic builder (sameAs 배열)
  - `apps/web/src/components/site/SiteFooter.tsx` 안 contactLinks (전화·이메일 등) — 플레이스 link 추가 후보
  - `apps/web/src/app/(site)/[instanceSlug]/contact/page.tsx` — 플레이스 link 추가 후보
  - `apps/web/src/components/forms/ClinicProfileForm.tsx` 안 metadata 입력 (5 키 기존 형식)

> **표기 규칙**: 사용자 표시 = "네이버 플레이스", 내부 키 = "naverPlace" · "naver-place".

## 1. 목적과 범위

### 1.1 목적

- 운영자가 ClinicProfile 안 네이버 플레이스 URL · placeId 입력 → 사이트 안 link + JSON-LD sameAs 자동 노출
- 네이버 검색 안 브랜드 entity 의 사이트 ↔ 플레이스 양방향 연결 확립 (AI 크롤러 entity recognition · 통합 랭킹 신뢰도)
- v1 = read-only metadata · DB 변경 X · 외부 API X · 리뷰 ingest X

### 1.2 범위 (v1 — 포함)

| § | 항목 | 비고 |
|---|---|---|
| 2 | `clinic.metadata.naverPlace` shape + zod 검증 | `{ placeId: string, placeUrl: string }` |
| 3 | ClinicProfileForm 안 입력 UI | placeId + placeUrl 2 input · C 하이브리드 패턴 답습 |
| 4 | db-projection 안 ClinicProjection.naverPlace normalize | metadata.naverPlace 안 정규화 출력 |
| 5 | JSON-LD sameAs 안 placeUrl 추가 | LocalBusiness · MedicalBusiness · MedicalClinic graph 안 |
| 6 | 사이트 link mount | SiteFooter (연락처 column) + contact 페이지 |
| 7 | 검증 시나리오 NPL-V01~V07 | 폼 입력 · zod · JSON-LD · 사이트 link · 빈 값 · placeId regex · placeUrl host 검증 |
| 8 | 작업 manifest 5 task | projection · form · entities · footer/contact · vitest |
| 9 | NPL-CASCADE 4건 | ClinicProfileForm · entities.ts · SiteFooter · MTL-DEFER-07 별 cycle marker |

### 1.3 비범위 (defer · NPL-DEFER)

| 항목 | Defer | marker |
|---|---|---|
| Naver Distribution Checklist UI (MTL-DEFER-07 흡수) | 별 cycle · 본 plan v2 또는 독립 plan | NPL-DEFER-01 |
| 네이버 플레이스 OpenAPI client (사업장 정보 조회 · 리뷰 ingest) | v2+ · 사용자 OpenAPI 키 발급 후 | NPL-DEFER-02 |
| 플레이스 리뷰/평점 ingestion (paste 또는 API) | v2+ — NSA paste 패턴 답습 가능 | NPL-DEFER-03 |
| 플레이스 안 소식 게시 자동화 (Traffic Seed Kit 합류) | NF-DEFER-02 본 구현 후 별 cycle | NPL-DEFER-04 |
| location_profile 안 지점별 placeId (다지점 instance 시) | v2+ — 첫 클라이언트 단일 지점 라 단순화 | NPL-DEFER-05 |
| 네이버 지도 API embed (사이트 안 지도 iframe) | v2+ — 외부 의존 + privacy 고려 | NPL-DEFER-06 |
| identifier PropertyValue 안 placeId 명시 (JSON-LD) | v1 = sameAs link 만. 더 구체적 표시는 v2+ | NPL-DEFER-07 |
| 플레이스 ↔ GSC ↔ NSA gap 분석 | NSI-DEFER 별 cycle | NPL-DEFER-08 |
| ClinicProfileForm 안 별 input field (placeId + placeUrl 2 input · cycle 2 #13) | 운영자 UX 친화 — v2+ 폼 변경 cycle | NPL-DEFER-09 |

## 2. `clinic.metadata.naverPlace` shape

### 2.1 zod schema

```ts
// apps/web/src/lib/clinic-metadata-schema.ts (또는 기존 파일 안 추가)
export const naverPlaceSchema = z.object({
  placeId: z.string().regex(/^\d{6,12}$/, "placeId 는 6~12자리 숫자"),
  placeUrl: z.string().url("placeUrl 형식 오류").refine(
    (url) => {
      try {
        const h = new URL(url).host;
        return (
          h === "map.naver.com" ||
          h === "m.place.naver.com" ||
          h === "pcmap.place.naver.com" ||  // cycle 1 #3
          h === "naver.me"
        );
      } catch {
        return false;
      }
    },
    "naver 도메인 host 만 허용 (map.naver.com · m.place.naver.com · pcmap.place.naver.com · naver.me)",
  ),
});

export type NaverPlaceMeta = z.infer<typeof naverPlaceSchema>;
```

### 2.2 metadata 안 위치

```jsonc
{
  // 기존 5 키 (pillars · principles · stats · strengths · copy) 그대로
  "naverPlace": {
    "placeId": "1234567890",
    "placeUrl": "https://map.naver.com/v5/entry/place/1234567890"
  }
}
```

빈 객체 또는 미존재 시 — 사이트 안 link 미렌더 + JSON-LD sameAs 안 미포함 (fallback OK).

### 2.3 운영자 입력 안 활용 link

운영자 안내 (`docs/runbooks/MEANINGFUL_TRAFFIC_OPERATIONS.md` 안 추가 권장):
- 네이버 플레이스 안 사업장 등록 후 → 플레이스 URL 안 복사 (예 `https://map.naver.com/v5/entry/place/1234567890`)
- URL 안 마지막 segment 안 placeId 추출

## 3. ClinicProfileForm — metadataJson 안 직접 추가 (cycle 2 #13)

### 3.1 입력 방식

ClinicProfileForm 의 metadata 입력 = **`metadataJson: string` (raw JSON 직접 편집)**. v1 = 운영자가 본 textarea 안 `naverPlace` 키 직접 추가:

```jsonc
{
  "treatmentPillars": [ /* 기존 */ ],
  "standardPrinciples": [ /* 기존 */ ],
  // ...
  "localKeywords": [ /* 기존 */ ],
  "naverPlace": {
    "placeId": "1234567890",
    "placeUrl": "https://map.naver.com/v5/entry/place/1234567890"
  }
}
```

### 3.2 별 input field 비범위 (NPL-DEFER-09)

ClinicProfileForm 안 별 input field 2개 (placeId + placeUrl) 추가는 v2+:
- 폼 변경 비용 (ClinicProfileInitial type · server action · validation flow 모두 영향)
- v1 안 의도된 단순 — metadataJson 직접 편집 활용

### 3.3 server action 검증

`clinic-profile-actions` 안 metadataJson safeParse 후 `parseClinicMetadata` 호출 — § 4.2 안 `parseNaverPlace` 가 자동 검증 (invalid 시 null fallback). 운영자가 잘못된 URL/placeId 입력 시 사이트 안 link 미렌더 (silent fallback).

### 3.4 runbook 안 예시 (cycle 1 #6)

`docs/runbooks/MEANINGFUL_TRAFFIC_OPERATIONS.md` 안 새 part 추가 — "네이버 플레이스 연결 안내":
- 네이버 플레이스 안 사업장 등록
- 플레이스 URL 안 placeId 추출 (예 `https://map.naver.com/v5/entry/place/1234567890` → `1234567890`)
- 어드민 ClinicProfile 안 metadataJson textarea 안 `naverPlace` 키 추가 예시 JSON

## 4. db-projection 안 ClinicProjection.naverPlace

### 4.1 시그니처 (cycle 1 #4 — ClinicMetadataProjection 안 합류)

`ClinicProjection.metadata: ClinicMetadataProjection` 안 신규 키 — `localKeywords` 패턴 답습.

```ts
// apps/web/src/lib/db-projection.ts
import type { NaverPlaceMeta } from "./clinic-metadata-schema";

export type ClinicMetadataProjection = {
  treatmentPillars: TreatmentPillarMeta[];
  standardPrinciples: PrincipleMeta[];
  keyStats: KeyStatMeta[];
  systemStrengths: SystemStrengthMeta[];
  sectionCopy: SectionCopyMeta;
  localKeywords: string[];
  /** v1 안 신규 — placeId + placeUrl. null 시 fallback (link 미렌더 · JSON-LD sameAs 미포함). */
  naverPlace: NaverPlaceMeta | null;
};
```

### 4.2 normalize (cycle 1 #12 — parseClinicMetadata 안 합류)

```ts
function parseNaverPlace(raw: unknown): NaverPlaceMeta | null {
  if (!raw || typeof raw !== "object") return null;
  const parsed = naverPlaceSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

// parseClinicMetadata 안:
function parseClinicMetadata(raw: unknown): ClinicMetadataProjection {
  // ... 기존 키 normalize
  const naverPlace = parseNaverPlace((raw as Record<string, unknown>)?.naverPlace);
  return { /* 기존 키 */ ..., naverPlace };
}
```

## 5. JSON-LD sameAs 안 placeUrl

### 5.1 위치 + 합류 entity (cycle 1 #1·#2·#11)

`apps/web/src/lib/json-ld/entities.ts` 안:
- `organizationEntity` (Organization) — sameAs **신규 추가** (이전 미존재)
- `medicalClinicEntity` (MedicalClinic) — sameAs **신규 추가** (이전 미존재)

> MedicalBusiness entity 부재 — 본 plan 안 미적용.

### 5.2 patch

```ts
// entities.ts 안 buildSameAs helper 신규 + organizationEntity · medicalClinicEntity 두 곳 호출.
function buildClinicSameAs(clinic: ClinicProjection): string[] {
  const list: string[] = [];
  if (clinic.metadata.naverPlace?.placeUrl) {
    list.push(clinic.metadata.naverPlace.placeUrl);
  }
  // v1 = naverPlace 만. 추가 social URL 합류는 v2+ (NPL-DEFER 미정의 — 추후)
  return list;
}

// organizationEntity 안:
const sameAs = buildClinicSameAs(clinic);
return {
  // ... 기존 필드
  ...(sameAs.length > 0 ? { sameAs } : {}),
};

// medicalClinicEntity 안 동일 패턴.
```

### 5.3 정합

- LocalBusiness · MedicalBusiness · MedicalClinic 의 schema.org 안 `sameAs` 가 표준 (URL 배열)
- AI 크롤러 (네이버 + Google AI Overview) 안 entity 의 cross-platform 동일성 알림
- 중복 검사 — 같은 URL 가 두 번 push 안 되도록 Set deduplicate

## 6. 사이트 link mount

### 6.1 SiteFooter — 연락처 column 안 추가 (cycle 1 #8)

`apps/web/src/components/site/SiteFooter.tsx` 안 `contactLinks` 배열 안 — 기존 `external?: boolean` 패턴 답습:

```ts
const naverPlaceUrl = initial.clinic.metadata.naverPlace?.placeUrl;
if (naverPlaceUrl) {
  contactLinks.push({
    href: naverPlaceUrl,
    label: "네이버 플레이스",
    external: true,  // SiteFooter 안 external=true 시 새 탭 + rel=noopener
  });
}
```

### 6.2 contact 페이지 안 추가

`apps/web/src/app/(site)/[instanceSlug]/contact/page.tsx` 안 dl/dt/dd 안 항목 추가:

```tsx
{initial.clinic.metadata.naverPlace ? (
  <div>
    <dt className="text-fg-muted">네이버 플레이스</dt>
    <dd>
      <a
        href={initial.clinic.metadata.naverPlace.placeUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        네이버 지도 안 보기 →
      </a>
    </dd>
  </div>
) : null}
```

### 6.3 비범위 — Hero · Treatment Detail 안 link

v1 안 footer + contact 만. Hero · treatment detail · article detail 등 추가 mount 는 v2+ (운영자 요구 시).

## 7. 검증 시나리오 (v1 — 7건 · cycle 3 #17 정정)

| # | 시나리오 | 기대 결과 |
|---|---|---|
| NPL-V01 | 운영자 ClinicProfileForm 안 metadataJson textarea 안 `"naverPlace": {"placeId":"...", "placeUrl":"..."}` 추가 후 저장 | metadata.naverPlace 안 정상 저장. 폼 reload 시 metadataJson 안 값 유지 |
| NPL-V02 | placeId 만 있고 placeUrl 누락된 metadataJson 저장 | parseClinicMetadata 안 parseNaverPlace = null (zod fail 안 silent fallback). 사이트 안 link 미렌더 |
| NPL-V03 | placeUrl 안 외부 host (예 example.com) 입력 | parseNaverPlace = null (host whitelist fail) · silent fallback |
| NPL-V04 | placeId 안 영문 (`abcd`) 입력 | parseNaverPlace = null (regex fail) · silent fallback |
| NPL-V05 | 양쪽 정상 + 사이트 (`/demo`) reload | SiteFooter 안 "네이버 플레이스" link 노출 · contact 페이지 안 "네이버 지도 안 보기" link |
| NPL-V06 | view-source 안 Organization · MedicalClinic JSON-LD entity 의 sameAs 배열 안 placeUrl 포함 | 두 entity 모두 sameAs 안 같은 placeUrl 합산 (schema.org 정합) |
| NPL-V07 | 빈 metadata (naverPlace 미저장) | footer link 미렌더 · contact dl item 미렌더 · JSON-LD sameAs key 자체 미포함 |

vitest fixture (v1):
- `apps/web/src/lib/db-projection.test.ts` 안 parseNaverPlace 시나리오 추가 (기존 file 안 · normal + 4 fallback case)
- `apps/web/src/lib/json-ld/__tests__/validate.test.ts` 안 sameAs 시나리오 추가 (clinic.metadata.naverPlace 안 placeUrl → Organization + MedicalClinic sameAs 합산 · cycle 1 #10)

## 8. 작업 manifest (v1 — 4 task · cycle 2 #15)

| # | 작업 | 산출물 | 의존 |
|---|---|---|---|
| 1 | naverPlaceSchema (clinic-metadata-schema.ts 또는 신규 file) + NaverPlaceMeta type | schema | — |
| 2 | db-projection.ts 안 ClinicMetadataProjection 안 naverPlace 합류 + parseNaverPlace helper | projection | 1 |
| 3 | json-ld/entities.ts 안 buildClinicSameAs helper + organizationEntity · medicalClinicEntity 안 sameAs 합류 + SiteFooter contactLinks 안 추가 + contact/page.tsx 안 dl item + runbook 안 예시 | 5 file | 2 |
| 4 | vitest fixture (validate.test.ts 안 sameAs · db-projection.test.ts 안 parseNaverPlace) + typecheck + 시각 검수 NPL-V01~V07 + commit | — | 1·2·3 |

**추정**: 1일 (DB 변경 X · form 변경 X · metadata jsonb · 5 file 정도 patch).

## 9. NPL-CASCADE markers

| marker | 대상 | patch 디테일 |
|---|---|---|
| NPL-CASCADE-01 | `docs/decisions/MEANINGFUL_TRAFFIC_LOOP_PLAN.md` | MTL-DEFER-07 (Naver Distribution Checklist UI) 본 plan 미흡수 → 별 cycle 또는 본 plan v2 marker |
| NPL-CASCADE-02 | `apps/web/src/lib/json-ld/entities.ts` | sameAs 배열 안 placeUrl 합류 (LocalBusiness · MedicalBusiness · MedicalClinic graph) |
| NPL-CASCADE-03 | `apps/web/src/components/site/SiteFooter.tsx` · contact/page.tsx | naverPlace.placeUrl 안 link mount |
| NPL-CASCADE-04 | `CLAUDE.md` 안 "현재 milestone" 행 | NAVER_PLACE v1.0 acceptance 시 추가 |

## 10. v1.0 acceptance criteria

### 10.1 plan + code 같은 cycle 합류

- CONTENT_IMPROVEMENT_QUEUE 패턴 답습 (MEANINGFUL_TRAFFIC · CONTENT_CALENDAR 도 동일)

### 10.2 acceptance 충족 조건

1. self-critique 수렴 cycle 1회 도달
2. § 8 manifest 5 task 완료
3. 검증 시나리오 NPL-V01~V07 사용자 환경 안 시각 검수
4. typecheck PASS · vitest 전체 PASS (신규 fixture 포함)
5. dev 안 `/admin/demo/clinic-profile` 안 placeId + placeUrl 입력 후 `/demo` 안 footer + contact 안 link 표시 + view-source 안 JSON-LD sameAs 안 URL 확인

### 10.3 v1.0 milestone marker

acceptance 시 — `memory/milestone_naver_place_v1.md` 작성 + `CLAUDE.md` 안 "현재 milestone" 한 줄 + 변경 이력 추가 (NPL-CASCADE-04).

## 11. 변경 이력

- **2026-05-26**: v0.1 draft 작성 — 사용자 (b) plan. scope 결정 (placeId + sameAs link mount · DB 변경 X · metadata jsonb · sameAs 만). NPL-DEFER 8건 (Checklist UI · OpenAPI · 리뷰 ingest · 소식 자동화 · location 지점별 · 지도 embed · identifier PropertyValue · gap 분석).
- **2026-05-26**: **v1.0 acceptance** — cycle 3 (2건) + cycle 4 (0건 수렴) 흡수:
  - **#17** v1 시나리오 정정 — metadataJson 직접 편집 + silent fallback · **#18** buildClinicSameAs `clinic.metadata.naverPlace` 경로 · **cycle 4 수렴** acceptance.

- **2026-05-26**: v0.3 draft — cycle 2 self-critique (4건) 전건 흡수:
  - **#13** ClinicProfileForm metadataJson 직접 편집 · **#14** sameAs 중복 OK · **#15** task 5 → 4 · **#16** vitest 시나리오

- **2026-05-26**: v0.2 draft — cycle 1 self-critique (12건) 전건 흡수:
  - **#1·#2·#11** organizationEntity + medicalClinicEntity 안 sameAs 신규 추가 (MedicalBusiness 부재) · **#3** pcmap.place.naver.com host 추가 · **#4·#12** ClinicMetadataProjection 안 naverPlace 필드 + parseNaverPlace helper · **#5** ClinicProfileForm 입력 패턴 · **#6** runbook hands-on flow · **#7** clinic-profile-actions zod 통합 · **#8** SiteFooter external flag 답습 · **#9** view-source 검증 · **#10** validate.test.ts sameAs 시나리오
