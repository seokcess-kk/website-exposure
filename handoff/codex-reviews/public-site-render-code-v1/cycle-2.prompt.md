You are reviewing **cycle 2** of the PUBLIC_SITE_RENDER code v1.0. Cycle 1 had **15 findings** (blocking=3, major=9, minor=3). All 15 were patched. `pnpm --filter @glitzy/web typecheck` now PASS.

## Cycle 1 patch summary

| # | severity | title | patch |
|---|---|---|---|
| PSRC-01 | blocking | ClinicProfileForm.tsx stale import | `@/app/(admin)/admin/[instanceSlug]/clinic-profile/actions` |
| PSRC-02 | blocking | sanitize-html lockfile + transformTags 타입 | pnpm-lock.yaml 갱신 + `transformTags.a` 콜백 파라미터 타입 명시 |
| PSRC-03 | blocking | withPublicTenantTransaction 타입 | `TransactionSql` callback param + `sql.begin<T \| null>` |
| PSRC-04 | major | D0011 password 하드코딩 | `CREATE ROLE app_public_reader LOGIN` 만, password 는 환경별 provision |
| PSRC-05 | major | JSON-LD MedicalClinic ref 미참조 + Article author inline 누락 | `webPageEntity` 안 `aboutClinic` 옵션 + `articleEntity` author inline `name/jobTitle/image`. P-003·P-004·P-005·P-006·P-010 graph 안 MedicalClinic 풀 entity 추가 (location 있을 때) |
| PSRC-06 | major | rule checker cross-reference 약함 | `validateJsonLdGraph(graph, { siteBaseUrl })` — same-origin URL 은 graph entity 필수, 외부 origin 만 dereferenceable 예외 |
| PSRC-07 | major | sitemap minimal 페이지 빈 상태 미포함 + lastmod | P-003/P-005 항상 포함 · `MAX(updated_at)` aggregate |
| PSRC-08 | major | canonical URL request-aware absolute | `siteBaseUrl()` 호출 + `siteMetadata.ts` 안 absolute URL 생성 |
| PSRC-09 | major | Host header spoof | env `PUBLIC_SITE_ORIGIN` 우선, 미지정 시 request host fallback |
| PSRC-10 | major | layout-level loader 반복 호출 | `cache(loadSiteInitial)` — render pass 안 한 번 SELECT |
| PSRC-11 | major | businessHours narrowing 약함 | opens/closes/from/to TIME_REGEX + ISO date regex strict |
| PSRC-12 | major | Markdown 외부 링크 rel 누락 (protocol-relative) | `//evil.example` 도 외부 분류 |
| PSRC-13 | minor | Home article teaser + location summary 누락 | Home 에 Articles + Contact 섹션 추가 |
| PSRC-14 | minor | ContactPoint @id 상대 fragment | `${siteBaseUrl}/#contact-${id}` absolute |
| PSRC-15 | minor | Legal route hostOrigin 하드코딩 | `siteBaseUrl(params.instanceSlug)` |

추가 의존성: `sanitize-html@2.13` + `@types/sanitize-html@2.13` (pnpm-lock.yaml 갱신 완료).
환경 변수 추가: `WEB_PUBLIC_DATABASE_URL`, `PUBLIC_SITE_ORIGIN`(optional).

## Re-review scope (cycle 2)

같은 코드/docs 영역 모두 다시 점검:
- 코드: apps/web/src/app/(site)/[instanceSlug]/* · apps/web/src/components/site/* · apps/web/src/lib/(public-db|public-tenant|db-projection|site-initial|site-url|site-metadata|markdown).ts · apps/web/src/lib/json-ld/* · packages/db/migrations/D0011_public_reader.sql · packages/migrations-runner/src/manifest.ts
- 어드민 prefix: `apps/web/src/app/(admin)/admin/[instanceSlug]/*` · `apps/web/src/app/page.tsx` · `apps/web/src/app/sign-in/consume/route.ts`
- docs: 변경 없음 — cycle 1 cascade docs (ARCH § 3.12 · SCHEMA_MAPPING § 1.2 · M0_BUILD_EXPORT § 2.1) 보존 확인

## What to check (cycle 2)

1. cycle 1 patch 가 plan SoT 와 일관 + typecheck PASS 유지
2. 회귀 (regression) — 시그니처 변경 cascade (doctorsListGraph/doctorProfileGraph/treatmentsListGraph/articleDetailGraph 안 location 인자 추가 → caller 모두 갱신했는가)
3. PSR-CASCADE-01b 코드 cascade 완료 검증
4. plan SoT § 7 시나리오 1~23 의 실제 통과 여부 추론
5. 새 finding (PSRC-16+ 부터)

## Output format

```
# PUBLIC_SITE_RENDER code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: cycle1=15 (3+9+3) → cycle2=N (B+M+m)

## cycle 1 patch 검증
- PSRC-01 ~ PSRC-15 각각 PASS / FAIL / PARTIAL

## new blocking / major / minor (PSRC-16+)

## acceptance precondition (PSR-CASCADE-01b) 점검
- PSR-CASCADE-01b: <PASS|FAIL|PARTIAL>
```

가능한 한 광범위하게 보고, 파일을 line 단위로 인용하라. 한국어로 응답.
