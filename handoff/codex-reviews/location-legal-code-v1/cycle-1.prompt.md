You are reviewing the **code implementation** of `docs/decisions/LOCATION_LEGAL_PLAN.md v1.0` (acceptance · 6 cycle · 59 findings 전건 처리 완료). Your job: produce a strict critique on whether the code faithfully realizes the plan's decisions and is correct/secure/atomic/accessible. This is **cycle 1** of the LOCATION_LEGAL **code** review — assume nothing is sacred.

## SoT to read first

1. `docs/decisions/LOCATION_LEGAL_PLAN.md` — plan SoT (v1.0 acceptance). Decisions: LL-SCHEMA-01~20, LL-FORM-01~15, LL-ACTION-01~21, LL-TEMPLATE-01~07, LL-CASCADE-01~05.
2. `docs/admin/ARCHITECTURE.md` — § 3.2 화면 ② + § 3.8.1/§ 3.8.2 (LL-CASCADE-01 target)
3. `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` — § 5.5 audit matrix + § 8.1 시나리오 (LL-CASCADE-02 target)
4. `docs/core/CONTENT_STANDARDS.md` — § 7 ContentType 예외 (LL-CASCADE-03 target)
5. `docs/decisions/M0_BUILD_EXPORT_PLAN.md` — LL-CASCADE-04 placeholder

## Code under review

| # | File | 역할 |
|---|---|---|
| 1 | `packages/core-content/migrations/C0006_legal_document.sql` | LegalDocument table + RLS + 5종 partial unique |
| 2 | `packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql` | ClinicProfile policy_* + primary_ctas + trigger |
| 3 | `packages/core-content/migrations/C0008_location_profile_parent_clinic.sql` | LocationProfile composite FK |
| 4 | `packages/core-content/src/templates/index.ts` | TEMPLATES record + CLOSED_DOCUMENT_TYPES + alpha sort |
| 5 | `packages/core-content/src/templates/render.ts` | renderTemplate + variable whitelist + TemplateRenderError |
| 6 | `packages/core-content/src/templates/bodies.ts` | 5종 표준 템플릿 Markdown 본문 (PRIVACY/TERMS/NON-COVERED/REFUND/COMPLAINT) |
| 7 | `packages/core-content/src/templates/__tests__.ts` | build-time unknown-key 검증 |
| 8 | `packages/core-content/src/schema.ts` | drizzle schema v0.3 (LegalDocument + ClinicProfile + LocationProfile + content_publication_status enum) |
| 9 | `apps/web/src/lib/clinic-profile-schema.ts` | zod bundle schema (4 sections) + parser helpers + CT-02 변환 |
| 10 | `apps/web/src/lib/errors.ts` | mapDbErrorToResult + MainLocationMissingError |
| 11 | `apps/web/src/components/forms/ClinicProfileForm.tsx` | 3 섹션 + 5 LegalDocument override + a11y + URL scrape prefill |
| 12 | `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/page.tsx` | initial DB read + round-trip render |
| 13 | `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts` | saveClinicProfile server action (single tx + 7 audit row + 3단계 안전망) |

## What to check (review principles)

### Plan SoT 합치
- 모든 LL-SCHEMA / LL-FORM / LL-ACTION / LL-TEMPLATE / LL-CASCADE 결정이 코드에 반영됐는가
- 특히 cycle1~6의 patch 결정 (LL-01~LL-59) 이 모두 코드에 살아있는가
- LL-CASCADE-01 (ARCH § 3.8.2 변수 화이트리스트 reference), LL-CASCADE-02 (ADMIN_UI_SKELETON § 5.5 audit matrix), LL-CASCADE-03 (CONTENT_STANDARDS § 7 LegalDocument 면제), LL-CASCADE-04 (M0_BUILD_EXPORT_PLAN placeholder), LL-CASCADE-05 (migrations-runner manifest) 각각 실제 docs/패키지에 반영됐는가 — **반영 안 됐으면 blocking**

### 정합성 / 원자성
- single transaction 안 3계약 + 5 LegalDocument upsert 의 atomic 보장
- 잠금 순서 결정성 (clinic → location main → legal alpha 5종)
- assertHasMainLocationAfterTx 안전망 + MainLocationMissingError → tx rollback 흐름
- audit 7 row sequential emit + per-row try/catch + partial/failed fallback row + 3단계 안전망 (Sentry pre-integration)
- LL-ACTION-08 build-time reference 정합 (LocationProfile.metadata 에 reservationChannels 자체는 저장 안 함 — marker 만)

### 보안 / RLS / 권한
- withSkeletonTx (RLS app_tenant_user) 사용 정합
- clinic_profile_id composite FK 의 cross-tenant 방어
- variable whitelist strict (unknown key throw) · HTML escape 책임 분리
- URL scrape prefill 의 safeUrl(http/https only · max 2048)
- session cookie + cleanup redirect 패턴
- assertActionEligibility('operator-edit-content')

### 데이터 모델
- CHECK constraint: name 1~100, description 80~300, summary 50~160, body 1~200000, slug regex, phone/email regex
- partial UNIQUE 5종 (privacy/terms/non-covered/refund/complaint) — cookie/other 미강제
- status='draft' CHECK + risk_level='Low' CHECK + published_at NULL CHECK (skeleton 제한 3종)
- auto_generated=true → template_version NOT NULL CHECK
- composite FK (instance_id, clinic_profile_id) DEFERRABLE INITIALLY DEFERRED
- DEFAULT vs CHECK 충돌 가능성 (e.g. status DEFAULT 'draft' 와 CHECK status='draft' 의 미래 변경 marker 필요 여부)

### Form UX / 접근성
- a11y: businessHours row aria-labelledby / aria-describedby / aria-controls (LL-FORM-07)
- 5 LegalDocument <details> a11y (LL-FORM-14)
- featuredChannelId validation (primaryCtas[].id 중 하나 매칭)
- 평일 1일 이상 영업 필수 (LL-FORM-03)
- primaryCtas UI subset 3종 SoT token 정확성 (`phone`/`kakao-talk`/`naver-reservation` — 기존 `kakao`/`naver-booking` 잘못된 별명 흔적 없는지)
- 자동 재렌더링 안내문 (LL-FORM-15)
- URL scrape prefill 의 "비어 있는 필드만" 정책

### TypeScript / 코드 품질
- unknown narrowing (parsePrimaryCtas / parseBusinessHoursMetadata)
- enum 일관성 (DAY_TO_ENUM · primaryCtaTypeEnum · ClosedLegalDocumentType)
- error 처리: isNextControlFlowError rethrow · TenantResolveError mapAuthDenyReasonToUi · TemplateRenderError 분기 · MainLocationMissingError 분기
- revalidatePath 범위
- date timezone (Asia/Seoul 명시 LL-ACTION-07 — DB CURRENT_DATE 사용 여부 vs JS new Date)
- effective_date round-trip: page.tsx 의 override 추출 로직 (fallback 과 동일하면 빈 string 보존)

### 시나리오 (LOCATION_LEGAL § 7 + ADMIN_UI § 8.1 cascade)
시나리오 14~22 가 코드에서 실제로 보장되는지:
14. tenant A 본원 저장 → location main 1행 + legal 5행
15. tenant B 가 /A/clinic-profile 접근 → 403
16. legal_document status='published' UPDATE 시도 → CHECK 위반
17. 같은 documentType (closed 5종) 두 번 INSERT → partial UNIQUE 위반
18. businessHours monday.open > monday.close → zod 위반
19. 변수 화이트리스트 외 키 build-time test 실패
20. location_profile.clinic_profile_id 다른 tenant id 변조 → composite FK + RLS WITH CHECK 위반
21. legal_document risk_level='High' UPDATE 시도 → CHECK 위반
22. businessHours 7요일 → CT-02 round-trip 정합

## Output format (markdown — 반드시 이 형식)

```
# LOCATION_LEGAL code v1.0 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: (이전 cycle 없음 — 본 cycle 이 첫)

## blocking
- **LLC-01**: <짧은 제목>
  - 위치: <file>:<line> 또는 <doc § ...>
  - 근거(plan SoT): LL-... §...
  - 문제: ...
  - 권장 patch: ...

## major
- **LLC-NN**: ...

## minor
- **LLC-NN**: ...

## cascade marker 누락 (있을 경우 blocking)
- ...

## acceptance precondition 위배 (LL-CASCADE-01~05) 점검
- LL-CASCADE-01 (ARCH § 3.8.2): <검증 결과>
- LL-CASCADE-02 (ADMIN_UI § 5.5): <검증 결과>
- LL-CASCADE-03 (CONTENT_STANDARDS § 7): <검증 결과>
- LL-CASCADE-04 (M0_BUILD_EXPORT_PLAN): <검증 결과>
- LL-CASCADE-05 (migrations-runner): <검증 결과>
```

closeableAfterPatch=true 의 정의: 본 cycle 지적 모두 patch 가능 + blocking=0 AND major=0 잔존 (minor 만 잔존 또는 0). 첫 cycle 이므로 보통 false.

가능한 한 광범위하게 보고, 추측이 아니라 파일을 실제로 읽고 line 단위로 인용하라. 한국어로 응답.
