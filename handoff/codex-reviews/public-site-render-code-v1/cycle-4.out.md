Reading prompt from stdin...
OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e397c-7892-7fb0-9179-622ad1a4d8a9
--------
user
You are reviewing **cycle 4** of PUBLIC_SITE_RENDER code v1.0. Cycle 3 had 2 findings (blocking 1 + major 1). All 2 patched. typecheck PASS.

## Cycle 3 patch summary

| # | severity | title | patch |
|---|---|---|---|
| PSRC-19 | blocking | ItemList.item `{@id, name}` pure ref unresolved | `item` 에 `@type: "Physician" / "MedicalProcedure"` 추가 → inline self-contained · itemListEntity 시그니처에 itemType 인자 추가 · 2 caller 갱신 |
| PSRC-20 | major | cross-page allowlist 가 origin 만 비교 | tenant base path 까지 비교 — `isCrossPageRef` 와 새 `isSameTenantUrl` 모두 path prefix 검사 |

## Re-review scope (cycle 4)

- `apps/web/src/lib/json-ld/entities.ts` (itemListEntity 시그니처)
- `apps/web/src/lib/json-ld/builders.ts` (2 caller)
- `apps/web/src/lib/json-ld/__tests__/validate.ts` (allowlist + same-tenant check)
- pages 4 (variant changes)

## What to check (cycle 4)

1. cycle 3 patch 정합 — Inline `@type` 객체가 rule checker self-contained inline 으로 통과
2. `isSameTenantUrl` 의 tenant base path prefix 검사 정합 (multi-tenant 회피)
3. typecheck 유지
4. 새 finding (PSRC-21+)
5. closeableAfterPatch=true 신호 검증

## Output format

```
# PUBLIC_SITE_RENDER code v1.0 — cycle 4 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=15 → cycle2=3 → cycle3=2 → cycle4=N

## cycle 3 patch 검증
- PSRC-19: PASS|FAIL
- PSRC-20: PASS|FAIL

## new findings (PSRC-21+)

## acceptance 판정
```

cycle 3 2건 모두 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true. 한국어로 응답.

codex
`seo-geo` 스킬은 이번 요청이 코드 리뷰라 직접 적용하지 않습니다. 지정된 파일과 관련 테스트만 좁게 확인한 뒤, findings 우선으로 판단하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'git status --short' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "itemListEntity|isSameTenantUrl|isCrossPageRef|allowlist|cross-page|same-tenant" apps/web/src/lib/json-ld apps/web/src/app apps/web/src/pages' in C:\Users\assag\solution\website-exposure
2026-05-18T05:08:46.146971Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.5 seconds
Output:
apps/web/src/lib/json-ld\builders.ts:53://   풀 entity 출력 안 함. cross-page reference (`${siteBaseUrl}/#clinic` · `#organization` · `#website`) 는
apps/web/src/lib/json-ld\builders.ts:54://   rule checker 의 cross-page allowlist 로 통과 (PSRC-16 patch).
apps/web/src/lib/json-ld\builders.ts:65:    E.itemListEntity(
apps/web/src/lib/json-ld\builders.ts:103:    E.itemListEntity(
apps/web/src/lib/json-ld\entities.ts:147://   `isPartOf` 의 WebSite 참조는 cross-page reference allowlist 대상 (PSRC-16 patch).
apps/web/src/lib/json-ld\entities.ts:189:export function itemListEntity(
apps/web/src/app\sign-in\actions.ts:2:// cycle5 ADMIN-UI-75: allowlist 체크 (self-provision 방지) + magic-link 발급
apps/web/src/app\sign-in\actions.ts:38:  // Plan § 3.2 step 1 ADMIN-UI-75: allowlist 체크 (자동 INSERT 없음)
apps/web/src/app\sign-in\actions.ts:42:  const allowlisted = rows.length > 0 && rows[0]!.active === true;
apps/web/src/app\sign-in\actions.ts:44:  if (!allowlisted) {
apps/web/src/app\sign-in\actions.ts:49:        payload: { identifier: normalized, reason: "not-allowlisted" },
apps/web/src/lib/json-ld\__tests__\validate.ts:19://   2. pure ref (`@id` 만 있는 객체) 는 graph entity 또는 cross-page reference allowlist 또는 외부 origin URL.
apps/web/src/lib/json-ld\__tests__\validate.ts:20://   3. cross-page reference allowlist: `${siteBaseUrl}/#organization` · `/#website` · `/#clinic` —
apps/web/src/lib/json-ld\__tests__\validate.ts:21://      SCHEMA_MAPPING § 2.5 "참조만" 페이지의 cross-page ref 패턴 (PSRC-16 patch).
apps/web/src/lib/json-ld\__tests__\validate.ts:27:function isCrossPageRef(ref: string, siteBaseUrl: string | null): boolean {
apps/web/src/lib/json-ld\__tests__\validate.ts:46:function isSameTenantUrl(ref: string, siteBaseUrl: string | null): boolean {
apps/web/src/lib/json-ld\__tests__\validate.ts:94:  //   PSRC-16 patch: cross-page reference allowlist (`#organization`/`#website`/`#clinic`) 는 graph entity 미존재 OK.
apps/web/src/lib/json-ld\__tests__\validate.ts:107:      if (!ids.has(ref) && !isCrossPageRef(ref, siteBaseUrl)) {
apps/web/src/lib/json-ld\__tests__\validate.ts:108:        if (isSameTenantUrl(ref, siteBaseUrl)) {
apps/web/src/lib/json-ld\__tests__\validate.ts:109:          errors.push(`unresolved same-tenant reference at ${path}: ${ref}`);
apps/web/src/app\sign-in\page.tsx:15:  // cycle4-code WEB-58: sent=1 generic banner (enumeration 방지 — allowlisted/미존재 동일 응답)
apps/web/src/app\sign-in\consume\route.ts:55:  // cycle5-code WEB-64: identifier normalize + admin_user allowlist 검증을 CAS 소비 전에 수행
apps/web/src/app\sign-in\consume\route.ts:72:  // 1) admin_user allowlist/active lookup (CAS 소비 전 · cycle5-code WEB-64)
apps/web/src/app\sign-in\consume\route.ts:79:      eventType: "user-not-allowlisted-on-consume",
apps/web/src/app\sign-in\consume\route.ts:90:      eventType: "user-not-allowlisted-on-consume",
apps/web/src/app\sign-in\consume\route.ts:96:  // 2) consume magic-link (allowlist 통과 후에만 CAS 소비)
rg: apps/web/src/pages: 지정된 파일을 찾을 수 없습니다. (os error 2)

 exited 1 in 541ms:
apps/web/src/lib/json-ld\builders.ts:53://   풀 entity 출력 안 함. cross-page reference (`${siteBaseUrl}/#clinic` · `#organization` · `#website`) 는
apps/web/src/lib/json-ld\builders.ts:54://   rule checker 의 cross-page allowlist 로 통과 (PSRC-16 patch).
apps/web/src/lib/json-ld\builders.ts:65:    E.itemListEntity(
apps/web/src/lib/json-ld\builders.ts:103:    E.itemListEntity(
apps/web/src/lib/json-ld\entities.ts:147://   `isPartOf` 의 WebSite 참조는 cross-page reference allowlist 대상 (PSRC-16 patch).
apps/web/src/lib/json-ld\entities.ts:189:export function itemListEntity(
apps/web/src/app\sign-in\actions.ts:2:// cycle5 ADMIN-UI-75: allowlist 체크 (self-provision 방지) + magic-link 발급
apps/web/src/app\sign-in\actions.ts:38:  // Plan § 3.2 step 1 ADMIN-UI-75: allowlist 체크 (자동 INSERT 없음)
apps/web/src/app\sign-in\actions.ts:42:  const allowlisted = rows.length > 0 && rows[0]!.active === true;
apps/web/src/app\sign-in\actions.ts:44:  if (!allowlisted) {
apps/web/src/app\sign-in\actions.ts:49:        payload: { identifier: normalized, reason: "not-allowlisted" },
apps/web/src/lib/json-ld\__tests__\validate.ts:19://   2. pure ref (`@id` 만 있는 객체) 는 graph entity 또는 cross-page reference allowlist 또는 외부 origin URL.
apps/web/src/lib/json-ld\__tests__\validate.ts:20://   3. cross-page reference allowlist: `${siteBaseUrl}/#organization` · `/#website` · `/#clinic` —
apps/web/src/lib/json-ld\__tests__\validate.ts:21://      SCHEMA_MAPPING § 2.5 "참조만" 페이지의 cross-page ref 패턴 (PSRC-16 patch).
apps/web/src/lib/json-ld\__tests__\validate.ts:27:function isCrossPageRef(ref: string, siteBaseUrl: string | null): boolean {
apps/web/src/lib/json-ld\__tests__\validate.ts:46:function isSameTenantUrl(ref: string, siteBaseUrl: string | null): boolean {
apps/web/src/lib/json-ld\__tests__\validate.ts:94:  //   PSRC-16 patch: cross-page reference allowlist (`#organization`/`#website`/`#clinic`) 는 graph entity 미존재 OK.
apps/web/src/lib/json-ld\__tests__\validate.ts:107:      if (!ids.has(ref) && !isCrossPageRef(ref, siteBaseUrl)) {
apps/web/src/lib/json-ld\__tests__\validate.ts:108:        if (isSameTenantUrl(ref, siteBaseUrl)) {
apps/web/src/lib/json-ld\__tests__\validate.ts:109:          errors.push(`unresolved same-tenant reference at ${path}: ${ref}`);
apps/web/src/app\sign-in\page.tsx:15:  // cycle4-code WEB-58: sent=1 generic banner (enumeration 방지 — allowlisted/미존재 동일 응답)
apps/web/src/app\sign-in\consume\route.ts:55:  // cycle5-code WEB-64: identifier normalize + admin_user allowlist 검증을 CAS 소비 전에 수행
apps/web/src/app\sign-in\consume\route.ts:72:  // 1) admin_user allowlist/active lookup (CAS 소비 전 · cycle5-code WEB-64)
apps/web/src/app\sign-in\consume\route.ts:79:      eventType: "user-not-allowlisted-on-consume",
apps/web/src/app\sign-in\consume\route.ts:90:      eventType: "user-not-allowlisted-on-consume",
apps/web/src/app\sign-in\consume\route.ts:96:  // 2) consume magic-link (allowlist 통과 후에만 CAS 소비)
rg: apps/web/src/pages: 지정된 파일을 찾을 수 없습니다. (os error 2)

 succeeded in 548ms:
 M apps/spike-a/pgbouncer/userlist.txt
 M apps/web/.env.example
 M apps/web/package.json
 D apps/web/src/app/(admin)/[instanceSlug]/articles/[slug]/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/articles/actions.ts
 D apps/web/src/app/(admin)/[instanceSlug]/articles/new/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/articles/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/doctors/[slug]/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/doctors/actions.ts
 D apps/web/src/app/(admin)/[instanceSlug]/doctors/new/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/doctors/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/treatments/[slug]/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/treatments/actions.ts
 D apps/web/src/app/(admin)/[instanceSlug]/treatments/new/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/treatments/page.tsx
 M apps/web/src/app/layout.tsx
 M apps/web/src/app/page.tsx
 M apps/web/src/app/sign-in/consume/route.ts
 M apps/web/src/lib/env.ts
 M apps/web/src/styles/globals.css
 M apps/web/tailwind.config.ts
 M docs/core/SCHEMA_MAPPING.md
 M docs/decisions/M0_BUILD_EXPORT_PLAN.md
 M pnpm-lock.yaml
?? apps/web/src/app/(admin)/admin/
?? apps/web/src/app/(site)/
?? apps/web/src/components/forms/ClinicProfileForm.tsx
?? apps/web/src/components/site/
?? apps/web/src/lib/db-projection.ts
?? apps/web/src/lib/errors.ts
?? apps/web/src/lib/json-ld/
?? apps/web/src/lib/markdown.ts
?? apps/web/src/lib/public-db.ts
?? apps/web/src/lib/public-tenant.ts
?? apps/web/src/lib/site-initial.ts
?? apps/web/src/lib/site-metadata.ts
?? apps/web/src/lib/site-url.ts
?? docs/admin/ARCHITECTURE.md
?? docs/core/CONTENT_STANDARDS.md
?? docs/decisions/ADMIN_UI_SKELETON_PLAN.md
?? docs/decisions/LOCATION_LEGAL_PLAN.md
?? docs/decisions/PUBLIC_SITE_RENDER_PLAN.md
?? handoff/PROJECT_OVERVIEW.md
?? handoff/codex-reviews/
?? packages/core-content/migrations/C0002_location_profile.sql
?? packages/core-content/migrations/C0006_legal_document.sql
?? packages/core-content/migrations/C0008_location_profile_parent_clinic.sql
?? packages/core-content/package.json
?? packages/core-content/src/schema.ts
?? packages/db/migrations/D0011_public_reader.sql
?? packages/migrations-runner/src/

codex
작업 트리에 기존 변경이 많이 있습니다. 리뷰 범위의 JSON-LD 파일들은 신규/변경 상태라, 해당 파일 내용과 관련 페이지 생성부를 기준으로 결함 여부만 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/json-ld/entities.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/json-ld/builders.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/json-ld/__tests__/validate.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"build.*JsonLd|JsonLd|jsonLd|itemListEntity|variant|doctor|treatment|article|siteBaseUrl\" apps/web/src/app/\\(site\\) apps/web/src/components/site apps/web/src/lib -g \"*.ts\" -g \"*.tsx\"" in C:\Users\assag\solution\website-exposure
2026-05-18T05:08:53.946054Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
[31;1msite\: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … octor|treatment|article|siteBaseUrl" apps/web/src/app/\([36;1msite\[0m) apps/w …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'site\' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 exited 1 in 598ms:
[31;1msite\: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … octor|treatment|article|siteBaseUrl" apps/web/src/app/\([36;1msite\[0m) apps/w …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'site\' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 succeeded in 684ms:
// @glitzy/web/lib/json-ld/builders — 페이지 타입 별 graph builder
// SoT: SCHEMA_MAPPING § 3 + PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-11

import type {
  ClinicProjection,
  LocationProjection,
  DoctorProjection,
  TreatmentProjection,
  ArticleProjection,
} from "@/lib/db-projection";
import type { JsonLdGraph, GraphBuilderContext } from "./types";
import * as E from "./entities";

const CONTEXT = "https://schema.org" as const;

function graph(entities: ReturnType<typeof E.organizationEntity>[]): JsonLdGraph {
  return { "@context": CONTEXT, "@graph": entities };
}

// === P-001 Home ===
export function homeGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  location: LocationProjection | null,
): JsonLdGraph {
  const entities = [
    E.organizationEntity(ctx, clinic),
    ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
    E.webSiteEntity(ctx, clinic.name),
    E.webPageEntity(ctx, clinic.name, clinic.description),
  ];
  return graph(entities);
}

// === P-002 About ===
export function aboutGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  location: LocationProjection | null,
  title: string,
  description: string,
): JsonLdGraph {
  return graph([
    E.organizationEntity(ctx, clinic),
    ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
    E.webPageEntity(ctx, title, description),
    E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "소개", path: null }]),
  ]);
}

// === P-003 Doctors List ===
// PSRC-17 patch: plan SoT (SCHEMA_MAPPING § 2.5 + PUBLIC_SITE_RENDER § 5.4) 정합 — `[참조] MedicalClinic` only.
//   풀 entity 출력 안 함. cross-page reference (`${siteBaseUrl}/#clinic` · `#organization` · `#website`) 는
//   rule checker 의 cross-page allowlist 로 통과 (PSRC-16 patch).
export function doctorsListGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  doctors: DoctorProjection[],
  description: string,
): JsonLdGraph {
  return graph([
    E.organizationEntity(ctx, clinic),
    E.webPageEntity(ctx, "의료진", description),
    E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "의료진", path: null }]),
    E.itemListEntity(
      ctx,
      doctors.map((d) => ({ name: d.name, itemId: `${ctx.siteBaseUrl}/doctors/${d.slug}#physician`, itemType: "Physician" as const })),
      "doctors",
    ),
  ]);
}

// === P-004 Doctor Profile ===
export function doctorProfileGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  doctor: DoctorProjection,
  description: string,
): JsonLdGraph {
  return graph([
    E.organizationEntity(ctx, clinic),
    E.physicianEntity(ctx, doctor),
    E.webPageEntity(ctx, doctor.name, description),
    E.breadcrumbListEntity(ctx, [
      { name: "홈", path: "/" },
      { name: "의료진", path: "/doctors" },
      { name: doctor.name, path: null },
    ]),
  ]);
}

// === P-005 Treatments List ===
export function treatmentsListGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  treatments: TreatmentProjection[],
  description: string,
): JsonLdGraph {
  return graph([
    E.organizationEntity(ctx, clinic),
    E.webPageEntity(ctx, "진료", description),
    E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "진료", path: null }]),
    E.itemListEntity(
      ctx,
      treatments.map((t) => ({ name: t.name, itemId: `${ctx.siteBaseUrl}/treatments/${t.slug}#procedure`, itemType: "MedicalProcedure" as const })),
      "treatments",
    ),
  ]);
}

// === P-006 Treatment Detail ===
// SCHEMA_MAPPING § 2.5 — P-006 은 MedicalClinic 풀 entity 출력 (예약 CTA · 본원 정보 의미).
export function treatmentDetailGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  location: LocationProjection | null,
  treatment: TreatmentProjection,
  description: string,
): JsonLdGraph {
  return graph([
    E.organizationEntity(ctx, clinic),
    ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
    E.medicalProcedureEntity(ctx, treatment),
    E.webPageEntity(ctx, treatment.name, description),
    E.breadcrumbListEntity(ctx, [
      { name: "홈", path: "/" },
      { name: "진료", path: "/treatments" },
      { name: treatment.name, path: null },
    ]),
  ]);
}

// === P-010 Article Detail ===
// PSRC-17 patch: P-010 도 `[참조] MedicalClinic` only — graph 안 풀 entity 출력 안 함.
export function articleDetailGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  article: ArticleProjection,
  author: DoctorProjection | null,
  category: string,
): JsonLdGraph {
  return graph([
    E.organizationEntity(ctx, clinic),
    E.articleEntity(ctx, article, author, category),
    E.webPageEntity(ctx, article.headline, article.summary),
    E.breadcrumbListEntity(ctx, [
      { name: "홈", path: "/" },
      { name: "인사이트", path: null },
      { name: article.headline, path: null },
    ]),
  ]);
}

// === P-012 Contact ===
export function contactGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  location: LocationProjection,
  description: string,
): JsonLdGraph {
  return graph([
    E.organizationEntity(ctx, clinic),
    E.medicalClinicEntity(ctx, clinic, location),
    E.webPageEntity(ctx, "연락처", description),
    E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "연락처", path: null }]),
  ]);
}

// === P-014 Location Detail ===
export function locationDetailGraph(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  location: LocationProjection,
  description: string,
): JsonLdGraph {
  return graph([
    E.organizationEntity(ctx, clinic),
    E.medicalClinicEntity(ctx, clinic, location),
    E.webPageEntity(ctx, location.name, description),
    E.breadcrumbListEntity(ctx, [
      { name: "홈", path: "/" },
      { name: "위치", path: null },
      { name: location.name, path: null },
    ]),
  ]);
}

 succeeded in 689ms:
// @glitzy/web/lib/json-ld/entities — entity builder helpers
// SoT: SCHEMA_MAPPING § 3 페이지 그래프 + § 2.5 공통 entity 출력 정책

import type {
  ClinicProjection,
  LocationProjection,
  DoctorProjection,
  TreatmentProjection,
  ArticleProjection,
  PrimaryCta,
} from "@/lib/db-projection";
import { formatAddress } from "@/lib/db-projection";
import type { JsonLdEntity, GraphBuilderContext } from "./types";

const NAVER_RESERVATION_CHANNELS = new Set(["phone", "email", "kakao-talk", "naver-reservation", "naver-talk", "form"]);

export function organizationEntity(ctx: GraphBuilderContext, clinic: ClinicProjection): JsonLdEntity {
  const id = `${ctx.siteBaseUrl}/#organization`;
  const contactPoints = clinic.primaryCtas
    .filter((c) => NAVER_RESERVATION_CHANNELS.has(c.type))
    .map((c) => contactPointEntity(ctx, c));
  return {
    "@type": "Organization",
    "@id": id,
    name: clinic.name,
    ...(clinic.legalEntityName ? { legalName: clinic.legalEntityName } : {}),
    description: clinic.description,
    ...(clinic.slogan ? { slogan: clinic.slogan } : {}),
    url: ctx.siteBaseUrl,
    logo: clinic.logoUrl,
    ...(clinic.founder ? { founder: { "@type": "Person", name: clinic.founder } } : {}),
    ...(clinic.foundingDate ? { foundingDate: clinic.foundingDate } : {}),
    ...(contactPoints.length > 0 ? { contactPoint: contactPoints } : {}),
  };
}

// PSRC-14 patch: ContactPoint @id 를 absolute pattern (`${siteBaseUrl}/#contact-...`) 으로 통일
function contactPointEntity(ctx: GraphBuilderContext, cta: PrimaryCta): JsonLdEntity {
  const contactType = cta.type === "phone" ? "reservations" : cta.label;
  return {
    "@type": "ContactPoint",
    "@id": `${ctx.siteBaseUrl}/#contact-${cta.id}`,
    contactType,
    ...(cta.type === "phone" && cta.targetUrl.startsWith("tel:") ? { telephone: cta.targetUrl.slice(4) } : { url: cta.targetUrl }),
  } as JsonLdEntity;
}

export function medicalClinicEntity(
  ctx: GraphBuilderContext,
  clinic: ClinicProjection,
  location: LocationProjection,
): JsonLdEntity {
  return {
    "@type": "MedicalClinic",
    "@id": `${ctx.siteBaseUrl}/#clinic`,
    name: clinic.name,
    parentOrganization: { "@id": `${ctx.siteBaseUrl}/#organization` },
    address: {
      "@type": "PostalAddress",
      streetAddress: location.streetAddress,
      addressLocality: location.addressLocality,
      addressRegion: location.addressRegion,
      postalCode: location.postalCode,
      addressCountry: location.addressCountry,
    },
    ...(location.telephone ? { telephone: location.telephone } : {}),
    ...(location.email ? { email: location.email } : {}),
    ...(location.latitude !== null && location.longitude !== null ? {
      geo: {
        "@type": "GeoCoordinates",
        latitude: location.latitude,
        longitude: location.longitude,
      },
    } : {}),
    ...(location.businessHours.openingHours.length > 0 ? {
      openingHoursSpecification: location.businessHours.openingHours.map((oh) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: oh.dayOfWeek.map((d) => `https://schema.org/${d}`),
        opens: oh.opens,
        closes: oh.closes,
      })),
    } : {}),
  };
}

export function medicalClinicRef(ctx: GraphBuilderContext): JsonLdEntity {
  return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#clinic` };
}

export function organizationRef(ctx: GraphBuilderContext): JsonLdEntity {
  return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#organization` };
}

export function physicianEntity(ctx: GraphBuilderContext, doctor: DoctorProjection): JsonLdEntity {
  return {
    "@type": "Physician",
    "@id": `${ctx.siteBaseUrl}/doctors/${doctor.slug}#physician`,
    name: doctor.name,
    ...(doctor.title ? { jobTitle: doctor.title } : {}),
    ...(doctor.bio ? { description: stripMarkdown(doctor.bio).slice(0, 200) } : {}),
    ...(doctor.photoUrl ? { image: doctor.photoUrl } : {}),
    worksFor: { "@id": `${ctx.siteBaseUrl}/#organization` },
    medicalSpecialty: "MedicalSpecialty",
  };
}

export function medicalProcedureEntity(ctx: GraphBuilderContext, treatment: TreatmentProjection): JsonLdEntity {
  return {
    "@type": "MedicalProcedure",
    "@id": `${ctx.siteBaseUrl}/treatments/${treatment.slug}#procedure`,
    name: treatment.name,
    description: treatment.summary,
    ...(treatment.heroImageUrl ? { image: treatment.heroImageUrl } : {}),
  };
}

export function articleEntity(
  ctx: GraphBuilderContext,
  article: ArticleProjection,
  author: DoctorProjection | null,
  category: string,
): JsonLdEntity {
  // PSRC-05 patch: author 는 graph 안 풀 Physician 미포함 페이지 (P-010 인) 경우 inline minimal 객체로 — name/image/jobTitle 포함
  const authorBlock = author ? {
    author: {
      "@type": "Physician",
      "@id": `${ctx.siteBaseUrl}/doctors/${author.slug}#physician`,
      name: author.name,
      ...(author.title ? { jobTitle: author.title } : {}),
      ...(author.photoUrl ? { image: author.photoUrl } : {}),
    },
  } : {};
  return {
    "@type": "Article",
    "@id": `${ctx.siteBaseUrl}/insights/${category}/${article.slug}#article`,
    headline: article.headline,
    description: article.summary,
    inLanguage: "ko-KR",
    ...(article.heroImageUrl ? { image: article.heroImageUrl } : {}),
    ...(article.publishedAt ? { datePublished: article.publishedAt.toISOString(), dateModified: article.publishedAt.toISOString() } : {}),
    publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
    ...authorBlock,
  };
}

// PSRC-17 patch: SCHEMA_MAPPING § 2.5 정합 — `about` 옵션 제거 (참조만 페이지에서 dangling ref 회피).
//   `isPartOf` 의 WebSite 참조는 cross-page reference allowlist 대상 (PSRC-16 patch).
export function webPageEntity(ctx: GraphBuilderContext, title: string, description: string): JsonLdEntity {
  return {
    "@type": "WebPage",
    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#webpage`,
    url: `${ctx.siteBaseUrl}${ctx.pagePath}`,
    name: title,
    description,
    inLanguage: "ko-KR",
    isPartOf: { "@id": `${ctx.siteBaseUrl}/#website` },
  };
}

export function webSiteEntity(ctx: GraphBuilderContext, name: string): JsonLdEntity {
  return {
    "@type": "WebSite",
    "@id": `${ctx.siteBaseUrl}/#website`,
    name,
    url: ctx.siteBaseUrl,
    inLanguage: "ko-KR",
    publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
  };
}

export function breadcrumbListEntity(
  ctx: GraphBuilderContext,
  items: Array<{ name: string; path: string | null }>,
): JsonLdEntity {
  return {
    "@type": "BreadcrumbList",
    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#breadcrumb`,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.path ? { item: `${ctx.siteBaseUrl}${it.path}` } : {}),
    })),
  };
}

// PSRC-19 patch: item 을 inline self-contained 로 — schema.org `@type` 명시 (Physician/MedicalProcedure 등).
//   `@type` 있는 객체는 rule checker 에서 inline 으로 인정 (PSRC-18 정합).
export function itemListEntity(
  ctx: GraphBuilderContext,
  items: Array<{ name: string; itemId: string; itemType: "Physician" | "MedicalProcedure" }>,
  listId: string,
): JsonLdEntity {
  return {
    "@type": "ItemList",
    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#${listId}`,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": it.itemType, "@id": it.itemId, name: it.name },
    })),
  };
}

function stripMarkdown(md: string): string {
  return md.replace(/[#*_`>]/g, "").replace(/\s+/g, " ").trim();
}

 succeeded in 679ms:
// @glitzy/web/lib/json-ld/__tests__/validate — 자체 JSON-LD rule checker (LOCAL_PASS)
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-14 (cycle1 PSR-17 — 외부 validator manual QA)
//
// 통과 기준:
//   1. JSON parse OK
//   2. @context = "https://schema.org" + @graph 배열
//   3. @id 유일 (graph 안 중복 없음)
//   4. cross-reference 무결성 — `{ "@id": "..." }` 참조가 그래프 안 entity @id 또는 외부 dereferenceable URL
//   5. 페이지 타입별 expected entities 존재 (SCHEMA_MAPPING § 2.5 정합)

import type { JsonLdGraph, JsonLdEntity } from "../types";

export type ValidationResult =
  | { ok: true }
  | { ok: false; errors: string[] };

// PSRC-06 / PSRC-16 / PSRC-18 patch:
//   1. inline minimal 객체 (`@id` + `@type` + 추가 필드) 는 self-contained inline 으로 인정 (검사 제외).
//   2. pure ref (`@id` 만 있는 객체) 는 graph entity 또는 cross-page reference allowlist 또는 외부 origin URL.
//   3. cross-page reference allowlist: `${siteBaseUrl}/#organization` · `/#website` · `/#clinic` —
//      SCHEMA_MAPPING § 2.5 "참조만" 페이지의 cross-page ref 패턴 (PSRC-16 patch).

const CROSS_PAGE_REF_FRAGMENTS = new Set(["organization", "website", "clinic"]);

// PSRC-20 patch: tenant base path 까지 비교 — multi-tenant 환경에서 다른 path tenant 의 fragment 가 통과되지 않도록.
//   v0.1 path-based SoT 의 `https://<host>/<instanceSlug>/#fragment` 패턴 정합.
function isCrossPageRef(ref: string, siteBaseUrl: string | null): boolean {
  if (!siteBaseUrl) return false;
  try {
    const u = new URL(ref);
    const base = new URL(siteBaseUrl);
    if (u.origin !== base.origin) return false;
    // base pathname (예: `/glitzy-clinic`) 와 ref pathname 의 tenant root 일치 검사.
    // ref 는 `<base.pathname>/#fragment` 또는 `<base.pathname><path>#fragment` 형태.
    const basePath = base.pathname.replace(/\/$/, "");
    const refPath = u.pathname.replace(/\/$/, "");
    if (refPath !== basePath && !refPath.startsWith(`${basePath}/`)) return false;
    if (!u.hash.startsWith("#")) return false;
    return CROSS_PAGE_REF_FRAGMENTS.has(u.hash.slice(1));
  } catch {
    return false;
  }
}

// PSRC-20 patch: same-origin 검사도 tenant base path 까지 비교.
function isSameTenantUrl(ref: string, siteBaseUrl: string | null): boolean {
  if (!siteBaseUrl) return false;
  try {
    const u = new URL(ref);
    const base = new URL(siteBaseUrl);
    if (u.origin !== base.origin) return false;
    const basePath = base.pathname.replace(/\/$/, "");
    const refPath = u.pathname.replace(/\/$/, "");
    return refPath === basePath || refPath.startsWith(`${basePath}/`);
  } catch {
    return false;
  }
}

export function validateJsonLdGraph(graph: unknown, opts: { siteBaseUrl?: string } = {}): ValidationResult {
  const errors: string[] = [];

  // (1)(2) shape
  if (typeof graph !== "object" || graph === null) return { ok: false, errors: ["graph must be object"] };
  const g = graph as Record<string, unknown>;
  if (g["@context"] !== "https://schema.org") errors.push("@context must be https://schema.org");
  const arr = g["@graph"];
  if (!Array.isArray(arr)) {
    return { ok: false, errors: [...errors, "@graph must be array"] };
  }

  const siteBaseUrl = opts.siteBaseUrl ?? null;

  // (3) @id 유일
  const ids = new Set<string>();
  const idMap = new Map<string, JsonLdEntity>();
  for (const ent of arr) {
    if (typeof ent !== "object" || ent === null) {
      errors.push("entity must be object");
      continue;
    }
    const e = ent as Record<string, unknown>;
    if (typeof e["@type"] !== "string") errors.push(`entity missing @type`);
    if (typeof e["@id"] !== "string") errors.push(`entity missing @id`);
    if (typeof e["@id"] === "string") {
      if (ids.has(e["@id"])) errors.push(`duplicate @id: ${e["@id"]}`);
      ids.add(e["@id"]);
      idMap.set(e["@id"], e as JsonLdEntity);
    }
  }

  // (4) cross-reference — pure ref `{ "@id": "..." }` 만 검사 (inline `{@id, @type, ...}` 객체는 self-contained).
  //   PSRC-18 patch: `@type` 존재 시 inline minimal entity 로 간주 (검사 제외, recurse 만).
  //   PSRC-16 patch: cross-page reference allowlist (`#organization`/`#website`/`#clinic`) 는 graph entity 미존재 OK.
  function checkRefs(value: unknown, path: string): void {
    if (typeof value !== "object" || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((v, i) => checkRefs(v, `${path}[${i}]`));
      return;
    }
    const v = value as Record<string, unknown>;
    const hasId = typeof v["@id"] === "string";
    const hasType = typeof v["@type"] === "string";
    if (hasId && !hasType) {
      // pure ref
      const ref = v["@id"] as string;
      if (!ids.has(ref) && !isCrossPageRef(ref, siteBaseUrl)) {
        if (isSameTenantUrl(ref, siteBaseUrl)) {
          errors.push(`unresolved same-tenant reference at ${path}: ${ref}`);
        } else if (tryOrigin(ref) === null) {
          errors.push(`unresolved reference at ${path}: ${ref}`);
        }
        // 외부 origin / 다른 tenant URL → dereferenceable 예외 (통과)
      }
    }
    for (const [k, vv] of Object.entries(v)) {
      if (k === "@type" || k === "@id") continue;
      checkRefs(vv, `${path}.${k}`);
    }
  }
  arr.forEach((ent, i) => checkRefs(ent, `@graph[${i}]`));

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}

function tryOrigin(url: string): string | null {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

/**
 * 페이지 타입별 expected entity types 검증
 */
export function validateExpectedEntities(graph: JsonLdGraph, expected: ReadonlyArray<string>): ValidationResult {
  const present = new Set(graph["@graph"].map((e) => e["@type"]));
  const missing = expected.filter((t) => !present.has(t));
  if (missing.length === 0) return { ok: true };
  return { ok: false, errors: [`missing expected entities: ${missing.join(", ")}`] };
}

codex
현재까지 PSRC-19의 inline `item` 형태와 두 caller의 타입 전달은 의도대로 보입니다. 다음은 path 기반 tenant 판정이 실제 테스트 케이스와 빌더 사용 경로에서 빠지는지 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "validateJsonLdGraph|validateExpectedEntities|homeGraph|doctorsListGraph|treatmentsListGraph|doctorProfileGraph|treatmentDetailGraph|articleDetailGraph|contactGraph|locationDetailGraph|siteBaseUrl" "apps/web/src/lib/json-ld" "apps/web/src/app/(site)" "apps/web/src/components/site" "apps/web/src/lib" -g "*.ts" -g "*.tsx"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files apps/web/src/lib/json-ld apps/web/src/app/(site) apps/web/src/components/site' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/package.json' in C:\Users\assag\solution\website-exposure
 succeeded in 585ms:
apps/web/src/lib\json-ld\entities.ts:18:  const id = `${ctx.siteBaseUrl}/#organization`;
apps/web/src/lib\json-ld\entities.ts:29:    url: ctx.siteBaseUrl,
apps/web/src/lib\json-ld\entities.ts:37:// PSRC-14 patch: ContactPoint @id 를 absolute pattern (`${siteBaseUrl}/#contact-...`) 으로 통일
apps/web/src/lib\json-ld\entities.ts:42:    "@id": `${ctx.siteBaseUrl}/#contact-${cta.id}`,
apps/web/src/lib\json-ld\entities.ts:55:    "@id": `${ctx.siteBaseUrl}/#clinic`,
apps/web/src/lib\json-ld\entities.ts:57:    parentOrganization: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib\json-ld\entities.ts:87:  return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#clinic` };
apps/web/src/lib\json-ld\entities.ts:91:  return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#organization` };
apps/web/src/lib\json-ld\entities.ts:97:    "@id": `${ctx.siteBaseUrl}/doctors/${doctor.slug}#physician`,
apps/web/src/lib\json-ld\entities.ts:102:    worksFor: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib\json-ld\entities.ts:110:    "@id": `${ctx.siteBaseUrl}/treatments/${treatment.slug}#procedure`,
apps/web/src/lib\json-ld\entities.ts:127:      "@id": `${ctx.siteBaseUrl}/doctors/${author.slug}#physician`,
apps/web/src/lib\json-ld\entities.ts:135:    "@id": `${ctx.siteBaseUrl}/insights/${category}/${article.slug}#article`,
apps/web/src/lib\json-ld\entities.ts:141:    publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib\json-ld\entities.ts:151:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#webpage`,
apps/web/src/lib\json-ld\entities.ts:152:    url: `${ctx.siteBaseUrl}${ctx.pagePath}`,
apps/web/src/lib\json-ld\entities.ts:156:    isPartOf: { "@id": `${ctx.siteBaseUrl}/#website` },
apps/web/src/lib\json-ld\entities.ts:163:    "@id": `${ctx.siteBaseUrl}/#website`,
apps/web/src/lib\json-ld\entities.ts:165:    url: ctx.siteBaseUrl,
apps/web/src/lib\json-ld\entities.ts:167:    publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib\json-ld\entities.ts:177:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#breadcrumb`,
apps/web/src/lib\json-ld\entities.ts:182:      ...(it.path ? { item: `${ctx.siteBaseUrl}${it.path}` } : {}),
apps/web/src/lib\json-ld\entities.ts:196:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#${listId}`,
apps/web/src/lib\json-ld\types.ts:17:  readonly siteBaseUrl: string;
apps/web/src/lib\json-ld\types.ts:18:  /** current page path relative to siteBaseUrl (예: `/about`, `/doctors/hong`) */
apps/web/src/lib\json-ld\builders.ts:21:export function homeGraph(
apps/web/src/lib\json-ld\builders.ts:53://   풀 entity 출력 안 함. cross-page reference (`${siteBaseUrl}/#clinic` · `#organization` · `#website`) 는
apps/web/src/lib\json-ld\builders.ts:55:export function doctorsListGraph(
apps/web/src/lib\json-ld\builders.ts:67:      doctors.map((d) => ({ name: d.name, itemId: `${ctx.siteBaseUrl}/doctors/${d.slug}#physician`, itemType: "Physician" as const })),
apps/web/src/lib\json-ld\builders.ts:74:export function doctorProfileGraph(
apps/web/src/lib\json-ld\builders.ts:93:export function treatmentsListGraph(
apps/web/src/lib\json-ld\builders.ts:105:      treatments.map((t) => ({ name: t.name, itemId: `${ctx.siteBaseUrl}/treatments/${t.slug}#procedure`, itemType: "MedicalProcedure" as const })),
apps/web/src/lib\json-ld\builders.ts:113:export function treatmentDetailGraph(
apps/web/src/lib\json-ld\builders.ts:135:export function articleDetailGraph(
apps/web/src/lib\json-ld\builders.ts:155:export function contactGraph(
apps/web/src/lib\json-ld\builders.ts:170:export function locationDetailGraph(
apps/web/src/lib\site-metadata.ts:6:import { siteBaseUrl } from "./site-url";
apps/web/src/lib\site-metadata.ts:42:  const baseUrl = siteBaseUrl(instanceSlug);
apps/web/src/lib\site-url.ts:16:export function siteBaseUrl(instanceSlug: string): string {
apps/web/src/lib/json-ld\builders.ts:21:export function homeGraph(
apps/web/src/lib/json-ld\builders.ts:53://   풀 entity 출력 안 함. cross-page reference (`${siteBaseUrl}/#clinic` · `#organization` · `#website`) 는
apps/web/src/lib/json-ld\builders.ts:55:export function doctorsListGraph(
apps/web/src/lib/json-ld\builders.ts:67:      doctors.map((d) => ({ name: d.name, itemId: `${ctx.siteBaseUrl}/doctors/${d.slug}#physician`, itemType: "Physician" as const })),
apps/web/src/lib/json-ld\builders.ts:74:export function doctorProfileGraph(
apps/web/src/lib/json-ld\builders.ts:93:export function treatmentsListGraph(
apps/web/src/lib/json-ld\builders.ts:105:      treatments.map((t) => ({ name: t.name, itemId: `${ctx.siteBaseUrl}/treatments/${t.slug}#procedure`, itemType: "MedicalProcedure" as const })),
apps/web/src/lib/json-ld\builders.ts:113:export function treatmentDetailGraph(
apps/web/src/lib/json-ld\builders.ts:135:export function articleDetailGraph(
apps/web/src/lib/json-ld\builders.ts:155:export function contactGraph(
apps/web/src/lib/json-ld\builders.ts:170:export function locationDetailGraph(
apps/web/src/lib/json-ld\entities.ts:18:  const id = `${ctx.siteBaseUrl}/#organization`;
apps/web/src/lib/json-ld\entities.ts:29:    url: ctx.siteBaseUrl,
apps/web/src/lib/json-ld\entities.ts:37:// PSRC-14 patch: ContactPoint @id 를 absolute pattern (`${siteBaseUrl}/#contact-...`) 으로 통일
apps/web/src/lib/json-ld\entities.ts:42:    "@id": `${ctx.siteBaseUrl}/#contact-${cta.id}`,
apps/web/src/lib/json-ld\entities.ts:55:    "@id": `${ctx.siteBaseUrl}/#clinic`,
apps/web/src/lib/json-ld\entities.ts:57:    parentOrganization: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib/json-ld\entities.ts:87:  return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#clinic` };
apps/web/src/lib/json-ld\entities.ts:91:  return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#organization` };
apps/web/src/lib/json-ld\entities.ts:97:    "@id": `${ctx.siteBaseUrl}/doctors/${doctor.slug}#physician`,
apps/web/src/lib/json-ld\entities.ts:102:    worksFor: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib/json-ld\entities.ts:110:    "@id": `${ctx.siteBaseUrl}/treatments/${treatment.slug}#procedure`,
apps/web/src/lib/json-ld\entities.ts:127:      "@id": `${ctx.siteBaseUrl}/doctors/${author.slug}#physician`,
apps/web/src/lib/json-ld\entities.ts:135:    "@id": `${ctx.siteBaseUrl}/insights/${category}/${article.slug}#article`,
apps/web/src/lib/json-ld\entities.ts:141:    publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib/json-ld\entities.ts:151:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#webpage`,
apps/web/src/lib/json-ld\entities.ts:152:    url: `${ctx.siteBaseUrl}${ctx.pagePath}`,
apps/web/src/lib/json-ld\entities.ts:156:    isPartOf: { "@id": `${ctx.siteBaseUrl}/#website` },
apps/web/src/lib/json-ld\entities.ts:163:    "@id": `${ctx.siteBaseUrl}/#website`,
apps/web/src/lib/json-ld\entities.ts:165:    url: ctx.siteBaseUrl,
apps/web/src/lib/json-ld\entities.ts:167:    publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib/json-ld\entities.ts:177:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#breadcrumb`,
apps/web/src/lib/json-ld\entities.ts:182:      ...(it.path ? { item: `${ctx.siteBaseUrl}${it.path}` } : {}),
apps/web/src/lib/json-ld\entities.ts:196:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#${listId}`,
apps/web/src/lib\json-ld\__tests__\validate.ts:20://   3. cross-page reference allowlist: `${siteBaseUrl}/#organization` · `/#website` · `/#clinic` —
apps/web/src/lib\json-ld\__tests__\validate.ts:27:function isCrossPageRef(ref: string, siteBaseUrl: string | null): boolean {
apps/web/src/lib\json-ld\__tests__\validate.ts:28:  if (!siteBaseUrl) return false;
apps/web/src/lib\json-ld\__tests__\validate.ts:31:    const base = new URL(siteBaseUrl);
apps/web/src/lib\json-ld\__tests__\validate.ts:46:function isSameTenantUrl(ref: string, siteBaseUrl: string | null): boolean {
apps/web/src/lib\json-ld\__tests__\validate.ts:47:  if (!siteBaseUrl) return false;
apps/web/src/lib\json-ld\__tests__\validate.ts:50:    const base = new URL(siteBaseUrl);
apps/web/src/lib\json-ld\__tests__\validate.ts:60:export function validateJsonLdGraph(graph: unknown, opts: { siteBaseUrl?: string } = {}): ValidationResult {
apps/web/src/lib\json-ld\__tests__\validate.ts:72:  const siteBaseUrl = opts.siteBaseUrl ?? null;
apps/web/src/lib\json-ld\__tests__\validate.ts:107:      if (!ids.has(ref) && !isCrossPageRef(ref, siteBaseUrl)) {
apps/web/src/lib\json-ld\__tests__\validate.ts:108:        if (isSameTenantUrl(ref, siteBaseUrl)) {
apps/web/src/lib\json-ld\__tests__\validate.ts:137:export function validateExpectedEntities(graph: JsonLdGraph, expected: ReadonlyArray<string>): ValidationResult {
apps/web/src/lib/json-ld\types.ts:17:  readonly siteBaseUrl: string;
apps/web/src/lib/json-ld\types.ts:18:  /** current page path relative to siteBaseUrl (예: `/about`, `/doctors/hong`) */
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:12:import { contactGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:13:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:39:  const graph = contactGraph(
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:40:    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/contact" },
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:12:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:31:  const hostOrigin = siteBaseUrl(params.instanceSlug);
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:34:    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/about" },
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:12:import { doctorsListGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:13:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:40:  const graph = doctorsListGraph(
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:41:    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/doctors" },
apps/web/src/app/(site)\[instanceSlug]\page.tsx:25:import { homeGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\page.tsx:26:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\page.tsx:74:  const graph = homeGraph(
apps/web/src/app/(site)\[instanceSlug]\page.tsx:75:    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/" },
apps/web/src/lib/json-ld\__tests__\validate.ts:20://   3. cross-page reference allowlist: `${siteBaseUrl}/#organization` · `/#website` · `/#clinic` —
apps/web/src/lib/json-ld\__tests__\validate.ts:27:function isCrossPageRef(ref: string, siteBaseUrl: string | null): boolean {
apps/web/src/lib/json-ld\__tests__\validate.ts:28:  if (!siteBaseUrl) return false;
apps/web/src/lib/json-ld\__tests__\validate.ts:31:    const base = new URL(siteBaseUrl);
apps/web/src/lib/json-ld\__tests__\validate.ts:46:function isSameTenantUrl(ref: string, siteBaseUrl: string | null): boolean {
apps/web/src/lib/json-ld\__tests__\validate.ts:47:  if (!siteBaseUrl) return false;
apps/web/src/lib/json-ld\__tests__\validate.ts:50:    const base = new URL(siteBaseUrl);
apps/web/src/lib/json-ld\__tests__\validate.ts:60:export function validateJsonLdGraph(graph: unknown, opts: { siteBaseUrl?: string } = {}): ValidationResult {
apps/web/src/lib/json-ld\__tests__\validate.ts:72:  const siteBaseUrl = opts.siteBaseUrl ?? null;
apps/web/src/lib/json-ld\__tests__\validate.ts:107:      if (!ids.has(ref) && !isCrossPageRef(ref, siteBaseUrl)) {
apps/web/src/lib/json-ld\__tests__\validate.ts:108:        if (isSameTenantUrl(ref, siteBaseUrl)) {
apps/web/src/lib/json-ld\__tests__\validate.ts:137:export function validateExpectedEntities(graph: JsonLdGraph, expected: ReadonlyArray<string>): ValidationResult {
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:13:import { doctorProfileGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:14:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:68:  const hostOrigin = siteBaseUrl(params.instanceSlug);
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:69:  const graph = doctorProfileGraph(
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:70:    { siteBaseUrl: hostOrigin, pagePath: `/doctors/${data.doctor.slug}` },
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:14:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:45:  const hostOrigin = siteBaseUrl(params.instanceSlug); // PSRC-15 patch
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:12:import { locationDetailGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:13:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:39:  const graph = locationDetailGraph(
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:40:    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: `/locations/${loc.slug}` },
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:12:import { treatmentsListGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:13:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:40:  const graph = treatmentsListGraph(
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:41:    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/treatments" },
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:13:import { articleDetailGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:14:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:73:  const hostOrigin = siteBaseUrl(params.instanceSlug);
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:74:  const graph = articleDetailGraph(
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:75:    { siteBaseUrl: hostOrigin, pagePath: `/insights/${params.category}/${data.article.slug}` },
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:13:import { treatmentDetailGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:14:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:58:  const hostOrigin = siteBaseUrl(params.instanceSlug);
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:59:  const graph = treatmentDetailGraph(
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:60:    { siteBaseUrl: hostOrigin, pagePath: `/treatments/${treatment.slug}` },

 succeeded in 572ms:
{
  "name": "@glitzy/web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "seed": "tsx --env-file=.env src/seed.ts"
  },
  "dependencies": {
    "@glitzy/auth": "workspace:*",
    "@glitzy/core-content": "workspace:*",
    "@glitzy/db": "workspace:*",
    "@glitzy/shared-errors": "workspace:*",
    "@glitzy/shared-types": "workspace:*",
    "drizzle-orm": "^0.36.4",
    "next": "^14.2.0",
    "postgres": "^3.4.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "cheerio": "^1.0.0",
    "ipaddr.js": "^2.2.0",
    "undici": "^6.21.0",
    "sanitize-html": "^2.13.1",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^22.10.5",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@types/sanitize-html": "^2.13.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3"
  }
}

2026-05-18T05:09:02.327677Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
[31;1msite: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m rg --files apps/web/src/lib/json-ld apps/web/src/app/([36;1msite[0m) apps/web/ …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                       ~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'site' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 exited 1 in 736ms:
[31;1msite: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m rg --files apps/web/src/lib/json-ld apps/web/src/app/([36;1msite[0m) apps/web/ …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                       ~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'site' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files "apps/web/src/lib/json-ld" "apps/web/src/app/(site)" "apps/web/src/components/site"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/site-url.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path apps/web/src/lib/json-ld/types.ts' in C:\Users\assag\solution\website-exposure
 succeeded in 611ms:
// @glitzy/web/lib/json-ld/types — JSON-LD graph builder types
// SoT: SCHEMA_MAPPING § 1.2 @id 네이밍 + § 2.5 공통 entity 출력 정책 + PUBLIC_SITE_RENDER_PLAN § 5.4

export type JsonLdGraph = {
  "@context": "https://schema.org";
  "@graph": JsonLdEntity[];
};

export type JsonLdEntity = {
  "@type": string;
  "@id": string;
  [key: string]: unknown;
};

export type GraphBuilderContext = {
  /** v0.1 path-based — `https://<host>/<instanceSlug>` (M0 도메인 매핑 합류 시 `https://<customDomain>` cascade · PSR-CASCADE-02) */
  readonly siteBaseUrl: string;
  /** current page path relative to siteBaseUrl (예: `/about`, `/doctors/hong`) */
  readonly pagePath: string;
};

 succeeded in 653ms:
apps/web/src/components/site\TreatmentCard.tsx
apps/web/src/components/site\SiteHeader.tsx
apps/web/src/components/site\SiteFooter.tsx
apps/web/src/components/site\ReservationChannels.tsx
apps/web/src/components/site\Hero.tsx
apps/web/src/components/site\DoctorCard.tsx
apps/web/src/components/site\BusinessHoursTable.tsx
apps/web/src/components/site\Breadcrumb.tsx
apps/web/src/components/site\ArticleBody.tsx
apps/web/src/app/(site)\[instanceSlug]\layout.tsx
apps/web/src/app/(site)\[instanceSlug]\page.tsx
apps/web/src/app/(site)\[instanceSlug]\not-found.tsx
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx
apps/web/src/app/(site)\[instanceSlug]\robots.txt\route.ts
apps/web/src/lib/json-ld\entities.ts
apps/web/src/lib/json-ld\builders.ts
apps/web/src/lib/json-ld\JsonLdScript.tsx
apps/web/src/lib/json-ld\types.ts
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx
apps/web/src/lib/json-ld\__tests__\validate.ts
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx

 succeeded in 655ms:
// @glitzy/web/lib/site-url — request-aware site base URL helper
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-12 (v0.1 path-based · M0 도메인 매핑 PSR-CASCADE-02)
//
// PSRC-08 patch: canonical/OpenGraph URL 은 항상 absolute URL.
// PSRC-09 patch: Host/X-Forwarded headers 의 spoof 회피 — env `PUBLIC_SITE_ORIGIN` (또는 production deployment URL)
// 가 설정되어 있으면 우선. 없으면 request host fallback (dev/staging 한정).

import { headers } from "next/headers";

/**
 * Compute the v0.1 path-based site base URL for the current request.
 * 예: `https://glitzy.example.com/glitzy-clinic` (production · PUBLIC_SITE_ORIGIN 설정)
 *     `http://localhost:3000/glitzy-clinic` (dev fallback)
 * M0 v1.0 도메인 매핑 cascade 시 (PSR-DEFER-02) middleware rewrite + 본 helper 의 instanceSlug 제거.
 */
export function siteBaseUrl(instanceSlug: string): string {
  // PSRC-09: production trusted origin 우선 — Host header spoof 회피
  const trustedOrigin = process.env.PUBLIC_SITE_ORIGIN;
  if (trustedOrigin && trustedOrigin.length > 0) {
    return `${trustedOrigin.replace(/\/$/, "")}/${instanceSlug}`;
  }
  // dev/staging fallback — request host
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}/${instanceSlug}`;
}

/**
 * Compute origin only (no instanceSlug suffix). For sitemap/robots sitemap URL.
 */
export function siteOrigin(): string {
  const trustedOrigin = process.env.PUBLIC_SITE_ORIGIN;
  if (trustedOrigin && trustedOrigin.length > 0) {
    return trustedOrigin.replace(/\/$/, "");
  }
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

codex
tenant prefix 검사는 `refPath === basePath || refPath.startsWith(basePath + "/")`라 `/clinic` 과 `/clinic2` 혼동을 막습니다. 이제 타입체크를 직접 돌려 cycle 4 기준 PASS 여부를 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'pnpm --filter @glitzy/web typecheck' in C:\Users\assag\solution\website-exposure
 succeeded in 2059ms:

> @glitzy/web@0.1.0 typecheck C:\Users\assag\solution\website-exposure\apps\web
> tsc --noEmit -p tsconfig.json


exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path "apps/web/src/app/(site)/[instanceSlug]/doctors/page.tsx"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path "apps/web/src/app/(site)/[instanceSlug]/treatments/page.tsx"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path "apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path "apps/web/src/app/(site)/[instanceSlug]/treatments/[slug]/page.tsx"' in C:\Users\assag\solution\website-exposure
2026-05-18T05:09:23.997141Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path "apps/web/src/app/(site)/[instanceSlug]/treatments/[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/treatments/page.tsx does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 769ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path "apps/web/src/app/(site)/[instanceSlug]/treatments/[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/treatments/page.tsx does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

2026-05-18T05:09:24.010101Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path "apps/web/src/app/(site)/[instanceSlug]/doctors/[sl[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 776ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path "apps/web/src/app/(site)/[instanceSlug]/doctors/[sl[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 777ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path "apps/web/src/app/(site)/[instanceSlug]/treatments/[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/treatments/[slug]/page.tsx does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 792ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path "apps/web/src/app/(site)/[instanceSlug]/doctors/pag[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/doctors/page.tsx does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

2026-05-18T05:09:24.012312Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path "apps/web/src/app/(site)/[instanceSlug]/treatments/[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/treatments/[slug]/page.tsx does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

2026-05-18T05:09:24.014488Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path "apps/web/src/app/(site)/[instanceSlug]/doctors/pag[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/doctors/page.tsx does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -LiteralPath "apps/web/src/app/(site)/[instanceSlug]/doctors/page.tsx"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -LiteralPath "apps/web/src/app/(site)/[instanceSlug]/treatments/page.tsx"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -LiteralPath "apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -LiteralPath "apps/web/src/app/(site)/[instanceSlug]/treatments/[slug]/page.tsx"' in C:\Users\assag\solution\website-exposure
 succeeded in 608ms:
// @glitzy/web/(site)/[instanceSlug]/treatments/[slug] — P-006 Treatment Detail

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { normalizeTreatment, type TreatmentPageRow } from "@/lib/db-projection";
import { loadSiteInitial } from "@/lib/site-initial";
import { ArticleBody } from "@/components/site/ArticleBody";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { ReservationChannels } from "@/components/site/ReservationChannels";
import { buildPageMetadata } from "@/lib/site-metadata";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { treatmentDetailGraph } from "@/lib/json-ld/builders";
import { siteBaseUrl } from "@/lib/site-url";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { instanceSlug: string; slug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  const t = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
    const rows = await tx<TreatmentPageRow[]>`
      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
        FROM treatment_page WHERE slug = ${params.slug} LIMIT 1
    `;
    return rows.length > 0 ? normalizeTreatment(rows[0]!) : null;
  });
  if (!t) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: t.name,
    description: t.summary,
    canonicalPath: `/treatments/${t.slug}`,
    ogType: "article",
    imageUrl: t.heroImageUrl ?? undefined,
  });
}

export default async function TreatmentDetailPage({
  params,
}: {
  params: { instanceSlug: string; slug: string };
}) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();

  const treatment = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
    const rows = await tx<TreatmentPageRow[]>`
      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
        FROM treatment_page
       WHERE slug = ${params.slug}
       LIMIT 1
    `;
    return rows.length > 0 ? normalizeTreatment(rows[0]!) : null;
  });
  if (!treatment) notFound();

  const base = `/${params.instanceSlug}`;
  const hostOrigin = siteBaseUrl(params.instanceSlug);
  const graph = treatmentDetailGraph(
    { siteBaseUrl: hostOrigin, pagePath: `/treatments/${treatment.slug}` },
    initial.clinic,
    initial.locationMain,
    treatment,
    treatment.summary,
  );

  return (
    <>
      <JsonLdScript graph={graph} />
      <Breadcrumb items={[
        { label: "홈", href: base },
        { label: "진료", href: `${base}/treatments` },
        { label: treatment.name, href: null },
      ]} />
      <section className="mx-auto max-w-3xl px-4 py-12">
        {treatment.heroImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={treatment.heroImageUrl} alt="" className="mb-6 aspect-video w-full rounded-md object-cover" />
        ) : null}
        <h1 className="text-3xl font-bold text-fg-default">{treatment.name}</h1>
        <p className="mt-2 text-base text-fg-muted">{treatment.summary}</p>
        <div className="mt-8">
          <ArticleBody markdown={treatment.body} hostOrigin={hostOrigin} />
        </div>
        {initial.clinic.primaryCtas.length > 0 ? (
          <div className="mt-12 rounded-md border border-border bg-subtle p-6">
            <h2 className="mb-3 text-lg font-semibold text-fg-default">예약 / 상담</h2>
            <ReservationChannels ctas={initial.clinic.primaryCtas} />
          </div>
        ) : null}
      </section>
    </>
  );
}

 succeeded in 631ms:
// @glitzy/web/(site)/[instanceSlug]/doctors — P-003 Doctors List

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { normalizeDoctor, type DoctorProfileRow } from "@/lib/db-projection";
import { loadSiteInitial } from "@/lib/site-initial";
import { DoctorCard } from "@/components/site/DoctorCard";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/site-metadata";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { doctorsListGraph } from "@/lib/json-ld/builders";
import { siteBaseUrl } from "@/lib/site-url";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { instanceSlug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: "의료진",
    description: `${initial.clinic.name}의 의료진 소개 페이지입니다.`,
    canonicalPath: "/doctors",
  });
}

export default async function DoctorsListPage({ params }: { params: { instanceSlug: string } }) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();
  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
    const rows = await tx<DoctorProfileRow[]>`
      SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
        FROM doctor_profile
       ORDER BY display_order ASC, id ASC
    `;
    return rows.map(normalizeDoctor);
  });
  if (!data) notFound();
  const base = `/${params.instanceSlug}`;
  const graph = doctorsListGraph(
    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/doctors" },
    initial.clinic,
    data,
    `${initial.clinic.name}의 의료진 소개 페이지입니다.`,
  );

  return (
    <>
      <JsonLdScript graph={graph} />
      <Breadcrumb items={[{ label: "홈", href: base }, { label: "의료진", href: null }]} />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="mb-6 text-3xl font-bold text-fg-default">의료진</h1>
        {data.length === 0 ? (
          <p className="text-sm text-fg-muted">의료진 정보가 아직 등록되지 않았습니다.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {data.map((d) => <DoctorCard key={d.slug} doctor={d} baseHref={base} />)}
          </div>
        )}
      </section>
    </>
  );
}

 succeeded in 641ms:
// @glitzy/web/(site)/[instanceSlug]/treatments — P-005 Treatments List

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { normalizeTreatment, type TreatmentPageRow } from "@/lib/db-projection";
import { loadSiteInitial } from "@/lib/site-initial";
import { TreatmentCard } from "@/components/site/TreatmentCard";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/site-metadata";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { treatmentsListGraph } from "@/lib/json-ld/builders";
import { siteBaseUrl } from "@/lib/site-url";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { instanceSlug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: "진료",
    description: `${initial.clinic.name}의 진료 안내`,
    canonicalPath: "/treatments",
  });
}

export default async function TreatmentsListPage({ params }: { params: { instanceSlug: string } }) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();
  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
    const rows = await tx<TreatmentPageRow[]>`
      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
        FROM treatment_page
       ORDER BY published_at DESC NULLS LAST
    `;
    return rows.map(normalizeTreatment);
  });
  if (!data) notFound();
  const base = `/${params.instanceSlug}`;
  const graph = treatmentsListGraph(
    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/treatments" },
    initial.clinic,
    data,
    `${initial.clinic.name}의 진료 안내`,
  );

  return (
    <>
      <JsonLdScript graph={graph} />
      <Breadcrumb items={[{ label: "홈", href: base }, { label: "진료", href: null }]} />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="mb-6 text-3xl font-bold text-fg-default">진료</h1>
        {data.length === 0 ? (
          <p className="text-sm text-fg-muted">등록된 진료 페이지가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {data.map((t) => <TreatmentCard key={t.slug} treatment={t} baseHref={base} />)}
          </div>
        )}
      </section>
    </>
  );
}

 succeeded in 646ms:
// @glitzy/web/(site)/[instanceSlug]/doctors/[slug] — P-004 Doctor Profile

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { normalizeDoctor, normalizeArticle, type DoctorProfileRow, type ArticleRow } from "@/lib/db-projection";
import { loadSiteInitial } from "@/lib/site-initial";
import { ArticleBody } from "@/components/site/ArticleBody";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/site-metadata";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { doctorProfileGraph } from "@/lib/json-ld/builders";
import { siteBaseUrl } from "@/lib/site-url";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { instanceSlug: string; slug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  const doctor = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
    const rows = await tx<DoctorProfileRow[]>`
      SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
        FROM doctor_profile WHERE slug = ${params.slug} LIMIT 1
    `;
    return rows.length > 0 ? normalizeDoctor(rows[0]!) : null;
  });
  if (!doctor) return {};
  const description = doctor.bio ? doctor.bio.replace(/[#*_`>]/g, "").slice(0, 160) : `${initial.clinic.name} 의료진 ${doctor.name}`;
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: doctor.name,
    description,
    canonicalPath: `/doctors/${doctor.slug}`,
    ogType: "profile",
    imageUrl: doctor.photoUrl ?? undefined,
  });
}

export default async function DoctorProfilePage({
  params,
}: {
  params: { instanceSlug: string; slug: string };
}) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();
  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
    const doctorRows = await tx<(DoctorProfileRow & { id: string })[]>`
      SELECT id::text AS id, slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
        FROM doctor_profile
       WHERE slug = ${params.slug}
       LIMIT 1
    `;
    if (doctorRows.length === 0) return null;
    const doctor = normalizeDoctor(doctorRows[0]!);

    const articleRows = await tx<ArticleRow[]>`
      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
        FROM article
       WHERE author_doctor_id = ${doctorRows[0]!.id}::uuid
       ORDER BY published_at DESC NULLS LAST
       LIMIT 5
    `;
    return { doctor, articles: articleRows.map(normalizeArticle) };
  });
  if (!data) notFound();

  const base = `/${params.instanceSlug}`;
  const hostOrigin = siteBaseUrl(params.instanceSlug);
  const graph = doctorProfileGraph(
    { siteBaseUrl: hostOrigin, pagePath: `/doctors/${data.doctor.slug}` },
    initial.clinic,
    data.doctor,
    data.doctor.bio ? data.doctor.bio.replace(/[#*_`>]/g, "").slice(0, 160) : `${initial.clinic.name} 의료진 ${data.doctor.name}`,
  );

  return (
    <>
      <JsonLdScript graph={graph} />
      <Breadcrumb items={[
        { label: "홈", href: base },
        { label: "의료진", href: `${base}/doctors` },
        { label: data.doctor.name, href: null },
      ]} />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <header className="mb-8 flex flex-col items-center gap-4 text-center md:flex-row md:items-start md:text-left">
          {data.doctor.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.doctor.photoUrl} alt="" className="h-32 w-32 rounded-full object-cover" />
          ) : null}
          <div>
            <h1 className="text-3xl font-bold text-fg-default">{data.doctor.name}</h1>
            {data.doctor.title ? <p className="mt-1 text-base text-fg-muted">{data.doctor.title}</p> : null}
            {data.doctor.jobTitle ? <p className="mt-0.5 text-sm text-fg-muted">{data.doctor.jobTitle}</p> : null}
          </div>
        </header>
        {data.doctor.bio ? <ArticleBody markdown={data.doctor.bio} hostOrigin={hostOrigin} /> : null}
        {data.articles.length > 0 ? (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-semibold text-fg-default">작성 아티클</h2>
            <ul className="flex flex-col gap-3">
              {data.articles.map((a) => (
                <li key={a.slug} className="rounded-md border border-border bg-elevated p-3">
                  <Link href={`${base}/insights/general/${a.slug}`} className="font-medium text-brand-primary hover:text-brand-primary-hover">
                    {a.headline}
                  </Link>
                  <p className="mt-1 text-sm text-fg-muted">{a.summary}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </section>
    </>
  );
}

codex
한 가지 경계 사례가 보입니다. allowlist 자체는 tenant path를 보지만, allowlist에서 탈락한 “같은 origin의 다른 tenant path” 참조가 바로 아래 dereferenceable 예외로 다시 통과하는 구조인지 라인 단위로 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -LiteralPath apps/web/src/lib/json-ld/__tests__/validate.ts | ForEach-Object { '"'{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -LiteralPath apps/web/src/lib/json-ld/entities.ts | ForEach-Object { '"'{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -LiteralPath apps/web/src/lib/json-ld/builders.ts | ForEach-Object { '"'{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 598ms:
   1: // @glitzy/web/lib/json-ld/entities — entity builder helpers
   2: // SoT: SCHEMA_MAPPING § 3 페이지 그래프 + § 2.5 공통 entity 출력 정책
   3: 
   4: import type {
   5:   ClinicProjection,
   6:   LocationProjection,
   7:   DoctorProjection,
   8:   TreatmentProjection,
   9:   ArticleProjection,
  10:   PrimaryCta,
  11: } from "@/lib/db-projection";
  12: import { formatAddress } from "@/lib/db-projection";
  13: import type { JsonLdEntity, GraphBuilderContext } from "./types";
  14: 
  15: const NAVER_RESERVATION_CHANNELS = new Set(["phone", "email", "kakao-talk", "naver-reservation", "naver-talk", "form"]);
  16: 
  17: export function organizationEntity(ctx: GraphBuilderContext, clinic: ClinicProjection): JsonLdEntity {
  18:   const id = `${ctx.siteBaseUrl}/#organization`;
  19:   const contactPoints = clinic.primaryCtas
  20:     .filter((c) => NAVER_RESERVATION_CHANNELS.has(c.type))
  21:     .map((c) => contactPointEntity(ctx, c));
  22:   return {
  23:     "@type": "Organization",
  24:     "@id": id,
  25:     name: clinic.name,
  26:     ...(clinic.legalEntityName ? { legalName: clinic.legalEntityName } : {}),
  27:     description: clinic.description,
  28:     ...(clinic.slogan ? { slogan: clinic.slogan } : {}),
  29:     url: ctx.siteBaseUrl,
  30:     logo: clinic.logoUrl,
  31:     ...(clinic.founder ? { founder: { "@type": "Person", name: clinic.founder } } : {}),
  32:     ...(clinic.foundingDate ? { foundingDate: clinic.foundingDate } : {}),
  33:     ...(contactPoints.length > 0 ? { contactPoint: contactPoints } : {}),
  34:   };
  35: }
  36: 
  37: // PSRC-14 patch: ContactPoint @id 를 absolute pattern (`${siteBaseUrl}/#contact-...`) 으로 통일
  38: function contactPointEntity(ctx: GraphBuilderContext, cta: PrimaryCta): JsonLdEntity {
  39:   const contactType = cta.type === "phone" ? "reservations" : cta.label;
  40:   return {
  41:     "@type": "ContactPoint",
  42:     "@id": `${ctx.siteBaseUrl}/#contact-${cta.id}`,
  43:     contactType,
  44:     ...(cta.type === "phone" && cta.targetUrl.startsWith("tel:") ? { telephone: cta.targetUrl.slice(4) } : { url: cta.targetUrl }),
  45:   } as JsonLdEntity;
  46: }
  47: 
  48: export function medicalClinicEntity(
  49:   ctx: GraphBuilderContext,
  50:   clinic: ClinicProjection,
  51:   location: LocationProjection,
  52: ): JsonLdEntity {
  53:   return {
  54:     "@type": "MedicalClinic",
  55:     "@id": `${ctx.siteBaseUrl}/#clinic`,
  56:     name: clinic.name,
  57:     parentOrganization: { "@id": `${ctx.siteBaseUrl}/#organization` },
  58:     address: {
  59:       "@type": "PostalAddress",
  60:       streetAddress: location.streetAddress,
  61:       addressLocality: location.addressLocality,
  62:       addressRegion: location.addressRegion,
  63:       postalCode: location.postalCode,
  64:       addressCountry: location.addressCountry,
  65:     },
  66:     ...(location.telephone ? { telephone: location.telephone } : {}),
  67:     ...(location.email ? { email: location.email } : {}),
  68:     ...(location.latitude !== null && location.longitude !== null ? {
  69:       geo: {
  70:         "@type": "GeoCoordinates",
  71:         latitude: location.latitude,
  72:         longitude: location.longitude,
  73:       },
  74:     } : {}),
  75:     ...(location.businessHours.openingHours.length > 0 ? {
  76:       openingHoursSpecification: location.businessHours.openingHours.map((oh) => ({
  77:         "@type": "OpeningHoursSpecification",
  78:         dayOfWeek: oh.dayOfWeek.map((d) => `https://schema.org/${d}`),
  79:         opens: oh.opens,
  80:         closes: oh.closes,
  81:       })),
  82:     } : {}),
  83:   };
  84: }
  85: 
  86: export function medicalClinicRef(ctx: GraphBuilderContext): JsonLdEntity {
  87:   return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#clinic` };
  88: }
  89: 
  90: export function organizationRef(ctx: GraphBuilderContext): JsonLdEntity {
  91:   return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#organization` };
  92: }
  93: 
  94: export function physicianEntity(ctx: GraphBuilderContext, doctor: DoctorProjection): JsonLdEntity {
  95:   return {
  96:     "@type": "Physician",
  97:     "@id": `${ctx.siteBaseUrl}/doctors/${doctor.slug}#physician`,
  98:     name: doctor.name,
  99:     ...(doctor.title ? { jobTitle: doctor.title } : {}),
 100:     ...(doctor.bio ? { description: stripMarkdown(doctor.bio).slice(0, 200) } : {}),
 101:     ...(doctor.photoUrl ? { image: doctor.photoUrl } : {}),
 102:     worksFor: { "@id": `${ctx.siteBaseUrl}/#organization` },
 103:     medicalSpecialty: "MedicalSpecialty",
 104:   };
 105: }
 106: 
 107: export function medicalProcedureEntity(ctx: GraphBuilderContext, treatment: TreatmentProjection): JsonLdEntity {
 108:   return {
 109:     "@type": "MedicalProcedure",
 110:     "@id": `${ctx.siteBaseUrl}/treatments/${treatment.slug}#procedure`,
 111:     name: treatment.name,
 112:     description: treatment.summary,
 113:     ...(treatment.heroImageUrl ? { image: treatment.heroImageUrl } : {}),
 114:   };
 115: }
 116: 
 117: export function articleEntity(
 118:   ctx: GraphBuilderContext,
 119:   article: ArticleProjection,
 120:   author: DoctorProjection | null,
 121:   category: string,
 122: ): JsonLdEntity {
 123:   // PSRC-05 patch: author 는 graph 안 풀 Physician 미포함 페이지 (P-010 인) 경우 inline minimal 객체로 — name/image/jobTitle 포함
 124:   const authorBlock = author ? {
 125:     author: {
 126:       "@type": "Physician",
 127:       "@id": `${ctx.siteBaseUrl}/doctors/${author.slug}#physician`,
 128:       name: author.name,
 129:       ...(author.title ? { jobTitle: author.title } : {}),
 130:       ...(author.photoUrl ? { image: author.photoUrl } : {}),
 131:     },
 132:   } : {};
 133:   return {
 134:     "@type": "Article",
 135:     "@id": `${ctx.siteBaseUrl}/insights/${category}/${article.slug}#article`,
 136:     headline: article.headline,
 137:     description: article.summary,
 138:     inLanguage: "ko-KR",
 139:     ...(article.heroImageUrl ? { image: article.heroImageUrl } : {}),
 140:     ...(article.publishedAt ? { datePublished: article.publishedAt.toISOString(), dateModified: article.publishedAt.toISOString() } : {}),
 141:     publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
 142:     ...authorBlock,
 143:   };
 144: }
 145: 
 146: // PSRC-17 patch: SCHEMA_MAPPING § 2.5 정합 — `about` 옵션 제거 (참조만 페이지에서 dangling ref 회피).
 147: //   `isPartOf` 의 WebSite 참조는 cross-page reference allowlist 대상 (PSRC-16 patch).
 148: export function webPageEntity(ctx: GraphBuilderContext, title: string, description: string): JsonLdEntity {
 149:   return {
 150:     "@type": "WebPage",
 151:     "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#webpage`,
 152:     url: `${ctx.siteBaseUrl}${ctx.pagePath}`,
 153:     name: title,
 154:     description,
 155:     inLanguage: "ko-KR",
 156:     isPartOf: { "@id": `${ctx.siteBaseUrl}/#website` },
 157:   };
 158: }
 159: 
 160: export function webSiteEntity(ctx: GraphBuilderContext, name: string): JsonLdEntity {
 161:   return {
 162:     "@type": "WebSite",
 163:     "@id": `${ctx.siteBaseUrl}/#website`,
 164:     name,
 165:     url: ctx.siteBaseUrl,
 166:     inLanguage: "ko-KR",
 167:     publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
 168:   };
 169: }
 170: 
 171: export function breadcrumbListEntity(
 172:   ctx: GraphBuilderContext,
 173:   items: Array<{ name: string; path: string | null }>,
 174: ): JsonLdEntity {
 175:   return {
 176:     "@type": "BreadcrumbList",
 177:     "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#breadcrumb`,
 178:     itemListElement: items.map((it, i) => ({
 179:       "@type": "ListItem",
 180:       position: i + 1,
 181:       name: it.name,
 182:       ...(it.path ? { item: `${ctx.siteBaseUrl}${it.path}` } : {}),
 183:     })),
 184:   };
 185: }
 186: 
 187: // PSRC-19 patch: item 을 inline self-contained 로 — schema.org `@type` 명시 (Physician/MedicalProcedure 등).
 188: //   `@type` 있는 객체는 rule checker 에서 inline 으로 인정 (PSRC-18 정합).
 189: export function itemListEntity(
 190:   ctx: GraphBuilderContext,
 191:   items: Array<{ name: string; itemId: string; itemType: "Physician" | "MedicalProcedure" }>,
 192:   listId: string,
 193: ): JsonLdEntity {
 194:   return {
 195:     "@type": "ItemList",
 196:     "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#${listId}`,
 197:     itemListElement: items.map((it, i) => ({
 198:       "@type": "ListItem",
 199:       position: i + 1,
 200:       item: { "@type": it.itemType, "@id": it.itemId, name: it.name },
 201:     })),
 202:   };
 203: }
 204: 
 205: function stripMarkdown(md: string): string {
 206:   return md.replace(/[#*_`>]/g, "").replace(/\s+/g, " ").trim();
 207: }

 succeeded in 604ms:
   1: // @glitzy/web/lib/json-ld/__tests__/validate — 자체 JSON-LD rule checker (LOCAL_PASS)
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-14 (cycle1 PSR-17 — 외부 validator manual QA)
   3: //
   4: // 통과 기준:
   5: //   1. JSON parse OK
   6: //   2. @context = "https://schema.org" + @graph 배열
   7: //   3. @id 유일 (graph 안 중복 없음)
   8: //   4. cross-reference 무결성 — `{ "@id": "..." }` 참조가 그래프 안 entity @id 또는 외부 dereferenceable URL
   9: //   5. 페이지 타입별 expected entities 존재 (SCHEMA_MAPPING § 2.5 정합)
  10: 
  11: import type { JsonLdGraph, JsonLdEntity } from "../types";
  12: 
  13: export type ValidationResult =
  14:   | { ok: true }
  15:   | { ok: false; errors: string[] };
  16: 
  17: // PSRC-06 / PSRC-16 / PSRC-18 patch:
  18: //   1. inline minimal 객체 (`@id` + `@type` + 추가 필드) 는 self-contained inline 으로 인정 (검사 제외).
  19: //   2. pure ref (`@id` 만 있는 객체) 는 graph entity 또는 cross-page reference allowlist 또는 외부 origin URL.
  20: //   3. cross-page reference allowlist: `${siteBaseUrl}/#organization` · `/#website` · `/#clinic` —
  21: //      SCHEMA_MAPPING § 2.5 "참조만" 페이지의 cross-page ref 패턴 (PSRC-16 patch).
  22: 
  23: const CROSS_PAGE_REF_FRAGMENTS = new Set(["organization", "website", "clinic"]);
  24: 
  25: // PSRC-20 patch: tenant base path 까지 비교 — multi-tenant 환경에서 다른 path tenant 의 fragment 가 통과되지 않도록.
  26: //   v0.1 path-based SoT 의 `https://<host>/<instanceSlug>/#fragment` 패턴 정합.
  27: function isCrossPageRef(ref: string, siteBaseUrl: string | null): boolean {
  28:   if (!siteBaseUrl) return false;
  29:   try {
  30:     const u = new URL(ref);
  31:     const base = new URL(siteBaseUrl);
  32:     if (u.origin !== base.origin) return false;
  33:     // base pathname (예: `/glitzy-clinic`) 와 ref pathname 의 tenant root 일치 검사.
  34:     // ref 는 `<base.pathname>/#fragment` 또는 `<base.pathname><path>#fragment` 형태.
  35:     const basePath = base.pathname.replace(/\/$/, "");
  36:     const refPath = u.pathname.replace(/\/$/, "");
  37:     if (refPath !== basePath && !refPath.startsWith(`${basePath}/`)) return false;
  38:     if (!u.hash.startsWith("#")) return false;
  39:     return CROSS_PAGE_REF_FRAGMENTS.has(u.hash.slice(1));
  40:   } catch {
  41:     return false;
  42:   }
  43: }
  44: 
  45: // PSRC-20 patch: same-origin 검사도 tenant base path 까지 비교.
  46: function isSameTenantUrl(ref: string, siteBaseUrl: string | null): boolean {
  47:   if (!siteBaseUrl) return false;
  48:   try {
  49:     const u = new URL(ref);
  50:     const base = new URL(siteBaseUrl);
  51:     if (u.origin !== base.origin) return false;
  52:     const basePath = base.pathname.replace(/\/$/, "");
  53:     const refPath = u.pathname.replace(/\/$/, "");
  54:     return refPath === basePath || refPath.startsWith(`${basePath}/`);
  55:   } catch {
  56:     return false;
  57:   }
  58: }
  59: 
  60: export function validateJsonLdGraph(graph: unknown, opts: { siteBaseUrl?: string } = {}): ValidationResult {
  61:   const errors: string[] = [];
  62: 
  63:   // (1)(2) shape
  64:   if (typeof graph !== "object" || graph === null) return { ok: false, errors: ["graph must be object"] };
  65:   const g = graph as Record<string, unknown>;
  66:   if (g["@context"] !== "https://schema.org") errors.push("@context must be https://schema.org");
  67:   const arr = g["@graph"];
  68:   if (!Array.isArray(arr)) {
  69:     return { ok: false, errors: [...errors, "@graph must be array"] };
  70:   }
  71: 
  72:   const siteBaseUrl = opts.siteBaseUrl ?? null;
  73: 
  74:   // (3) @id 유일
  75:   const ids = new Set<string>();
  76:   const idMap = new Map<string, JsonLdEntity>();
  77:   for (const ent of arr) {
  78:     if (typeof ent !== "object" || ent === null) {
  79:       errors.push("entity must be object");
  80:       continue;
  81:     }
  82:     const e = ent as Record<string, unknown>;
  83:     if (typeof e["@type"] !== "string") errors.push(`entity missing @type`);
  84:     if (typeof e["@id"] !== "string") errors.push(`entity missing @id`);
  85:     if (typeof e["@id"] === "string") {
  86:       if (ids.has(e["@id"])) errors.push(`duplicate @id: ${e["@id"]}`);
  87:       ids.add(e["@id"]);
  88:       idMap.set(e["@id"], e as JsonLdEntity);
  89:     }
  90:   }
  91: 
  92:   // (4) cross-reference — pure ref `{ "@id": "..." }` 만 검사 (inline `{@id, @type, ...}` 객체는 self-contained).
  93:   //   PSRC-18 patch: `@type` 존재 시 inline minimal entity 로 간주 (검사 제외, recurse 만).
  94:   //   PSRC-16 patch: cross-page reference allowlist (`#organization`/`#website`/`#clinic`) 는 graph entity 미존재 OK.
  95:   function checkRefs(value: unknown, path: string): void {
  96:     if (typeof value !== "object" || value === null) return;
  97:     if (Array.isArray(value)) {
  98:       value.forEach((v, i) => checkRefs(v, `${path}[${i}]`));
  99:       return;
 100:     }
 101:     const v = value as Record<string, unknown>;
 102:     const hasId = typeof v["@id"] === "string";
 103:     const hasType = typeof v["@type"] === "string";
 104:     if (hasId && !hasType) {
 105:       // pure ref
 106:       const ref = v["@id"] as string;
 107:       if (!ids.has(ref) && !isCrossPageRef(ref, siteBaseUrl)) {
 108:         if (isSameTenantUrl(ref, siteBaseUrl)) {
 109:           errors.push(`unresolved same-tenant reference at ${path}: ${ref}`);
 110:         } else if (tryOrigin(ref) === null) {
 111:           errors.push(`unresolved reference at ${path}: ${ref}`);
 112:         }
 113:         // 외부 origin / 다른 tenant URL → dereferenceable 예외 (통과)
 114:       }
 115:     }
 116:     for (const [k, vv] of Object.entries(v)) {
 117:       if (k === "@type" || k === "@id") continue;
 118:       checkRefs(vv, `${path}.${k}`);
 119:     }
 120:   }
 121:   arr.forEach((ent, i) => checkRefs(ent, `@graph[${i}]`));
 122: 
 123:   return errors.length === 0 ? { ok: true } : { ok: false, errors };
 124: }
 125: 
 126: function tryOrigin(url: string): string | null {
 127:   try {
 128:     return new URL(url).origin;
 129:   } catch {
 130:     return null;
 131:   }
 132: }
 133: 
 134: /**
 135:  * 페이지 타입별 expected entity types 검증
 136:  */
 137: export function validateExpectedEntities(graph: JsonLdGraph, expected: ReadonlyArray<string>): ValidationResult {
 138:   const present = new Set(graph["@graph"].map((e) => e["@type"]));
 139:   const missing = expected.filter((t) => !present.has(t));
 140:   if (missing.length === 0) return { ok: true };
 141:   return { ok: false, errors: [`missing expected entities: ${missing.join(", ")}`] };
 142: }

 succeeded in 573ms:
   1: // @glitzy/web/lib/json-ld/builders — 페이지 타입 별 graph builder
   2: // SoT: SCHEMA_MAPPING § 3 + PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-11
   3: 
   4: import type {
   5:   ClinicProjection,
   6:   LocationProjection,
   7:   DoctorProjection,
   8:   TreatmentProjection,
   9:   ArticleProjection,
  10: } from "@/lib/db-projection";
  11: import type { JsonLdGraph, GraphBuilderContext } from "./types";
  12: import * as E from "./entities";
  13: 
  14: const CONTEXT = "https://schema.org" as const;
  15: 
  16: function graph(entities: ReturnType<typeof E.organizationEntity>[]): JsonLdGraph {
  17:   return { "@context": CONTEXT, "@graph": entities };
  18: }
  19: 
  20: // === P-001 Home ===
  21: export function homeGraph(
  22:   ctx: GraphBuilderContext,
  23:   clinic: ClinicProjection,
  24:   location: LocationProjection | null,
  25: ): JsonLdGraph {
  26:   const entities = [
  27:     E.organizationEntity(ctx, clinic),
  28:     ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
  29:     E.webSiteEntity(ctx, clinic.name),
  30:     E.webPageEntity(ctx, clinic.name, clinic.description),
  31:   ];
  32:   return graph(entities);
  33: }
  34: 
  35: // === P-002 About ===
  36: export function aboutGraph(
  37:   ctx: GraphBuilderContext,
  38:   clinic: ClinicProjection,
  39:   location: LocationProjection | null,
  40:   title: string,
  41:   description: string,
  42: ): JsonLdGraph {
  43:   return graph([
  44:     E.organizationEntity(ctx, clinic),
  45:     ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
  46:     E.webPageEntity(ctx, title, description),
  47:     E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "소개", path: null }]),
  48:   ]);
  49: }
  50: 
  51: // === P-003 Doctors List ===
  52: // PSRC-17 patch: plan SoT (SCHEMA_MAPPING § 2.5 + PUBLIC_SITE_RENDER § 5.4) 정합 — `[참조] MedicalClinic` only.
  53: //   풀 entity 출력 안 함. cross-page reference (`${siteBaseUrl}/#clinic` · `#organization` · `#website`) 는
  54: //   rule checker 의 cross-page allowlist 로 통과 (PSRC-16 patch).
  55: export function doctorsListGraph(
  56:   ctx: GraphBuilderContext,
  57:   clinic: ClinicProjection,
  58:   doctors: DoctorProjection[],
  59:   description: string,
  60: ): JsonLdGraph {
  61:   return graph([
  62:     E.organizationEntity(ctx, clinic),
  63:     E.webPageEntity(ctx, "의료진", description),
  64:     E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "의료진", path: null }]),
  65:     E.itemListEntity(
  66:       ctx,
  67:       doctors.map((d) => ({ name: d.name, itemId: `${ctx.siteBaseUrl}/doctors/${d.slug}#physician`, itemType: "Physician" as const })),
  68:       "doctors",
  69:     ),
  70:   ]);
  71: }
  72: 
  73: // === P-004 Doctor Profile ===
  74: export function doctorProfileGraph(
  75:   ctx: GraphBuilderContext,
  76:   clinic: ClinicProjection,
  77:   doctor: DoctorProjection,
  78:   description: string,
  79: ): JsonLdGraph {
  80:   return graph([
  81:     E.organizationEntity(ctx, clinic),
  82:     E.physicianEntity(ctx, doctor),
  83:     E.webPageEntity(ctx, doctor.name, description),
  84:     E.breadcrumbListEntity(ctx, [
  85:       { name: "홈", path: "/" },
  86:       { name: "의료진", path: "/doctors" },
  87:       { name: doctor.name, path: null },
  88:     ]),
  89:   ]);
  90: }
  91: 
  92: // === P-005 Treatments List ===
  93: export function treatmentsListGraph(
  94:   ctx: GraphBuilderContext,
  95:   clinic: ClinicProjection,
  96:   treatments: TreatmentProjection[],
  97:   description: string,
  98: ): JsonLdGraph {
  99:   return graph([
 100:     E.organizationEntity(ctx, clinic),
 101:     E.webPageEntity(ctx, "진료", description),
 102:     E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "진료", path: null }]),
 103:     E.itemListEntity(
 104:       ctx,
 105:       treatments.map((t) => ({ name: t.name, itemId: `${ctx.siteBaseUrl}/treatments/${t.slug}#procedure`, itemType: "MedicalProcedure" as const })),
 106:       "treatments",
 107:     ),
 108:   ]);
 109: }
 110: 
 111: // === P-006 Treatment Detail ===
 112: // SCHEMA_MAPPING § 2.5 — P-006 은 MedicalClinic 풀 entity 출력 (예약 CTA · 본원 정보 의미).
 113: export function treatmentDetailGraph(
 114:   ctx: GraphBuilderContext,
 115:   clinic: ClinicProjection,
 116:   location: LocationProjection | null,
 117:   treatment: TreatmentProjection,
 118:   description: string,
 119: ): JsonLdGraph {
 120:   return graph([
 121:     E.organizationEntity(ctx, clinic),
 122:     ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
 123:     E.medicalProcedureEntity(ctx, treatment),
 124:     E.webPageEntity(ctx, treatment.name, description),
 125:     E.breadcrumbListEntity(ctx, [
 126:       { name: "홈", path: "/" },
 127:       { name: "진료", path: "/treatments" },
 128:       { name: treatment.name, path: null },
 129:     ]),
 130:   ]);
 131: }
 132: 
 133: // === P-010 Article Detail ===
 134: // PSRC-17 patch: P-010 도 `[참조] MedicalClinic` only — graph 안 풀 entity 출력 안 함.
 135: export function articleDetailGraph(
 136:   ctx: GraphBuilderContext,
 137:   clinic: ClinicProjection,
 138:   article: ArticleProjection,
 139:   author: DoctorProjection | null,
 140:   category: string,
 141: ): JsonLdGraph {
 142:   return graph([
 143:     E.organizationEntity(ctx, clinic),
 144:     E.articleEntity(ctx, article, author, category),
 145:     E.webPageEntity(ctx, article.headline, article.summary),
 146:     E.breadcrumbListEntity(ctx, [
 147:       { name: "홈", path: "/" },
 148:       { name: "인사이트", path: null },
 149:       { name: article.headline, path: null },
 150:     ]),
 151:   ]);
 152: }
 153: 
 154: // === P-012 Contact ===
 155: export function contactGraph(
 156:   ctx: GraphBuilderContext,
 157:   clinic: ClinicProjection,
 158:   location: LocationProjection,
 159:   description: string,
 160: ): JsonLdGraph {
 161:   return graph([
 162:     E.organizationEntity(ctx, clinic),
 163:     E.medicalClinicEntity(ctx, clinic, location),
 164:     E.webPageEntity(ctx, "연락처", description),
 165:     E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "연락처", path: null }]),
 166:   ]);
 167: }
 168: 
 169: // === P-014 Location Detail ===
 170: export function locationDetailGraph(
 171:   ctx: GraphBuilderContext,
 172:   clinic: ClinicProjection,
 173:   location: LocationProjection,
 174:   description: string,
 175: ): JsonLdGraph {
 176:   return graph([
 177:     E.organizationEntity(ctx, clinic),
 178:     E.medicalClinicEntity(ctx, clinic, location),
 179:     E.webPageEntity(ctx, location.name, description),
 180:     E.breadcrumbListEntity(ctx, [
 181:       { name: "홈", path: "/" },
 182:       { name: "위치", path: null },
 183:       { name: location.name, path: null },
 184:     ]),
 185:   ]);
 186: }

codex
# PUBLIC_SITE_RENDER code v1.0 — cycle 4 review

## summary
- 본 cycle 지적 수: blocking=0 major=1 minor=0 (총 1)
- closeableAfterPatch: false
- 수렴 추세: cycle1=15 → cycle2=3 → cycle3=2 → cycle4=1

## cycle 3 patch 검증
- PSRC-19: PASS
- PSRC-20: FAIL

## new findings (PSRC-21+)

**PSRC-21 major — 다른 tenant path 참조가 allowlist 탈락 후 dereferenceable 예외로 다시 통과**

[validate.ts](/abs/path/C:/Users/assag/solution/website-exposure/apps/web/src/lib/json-ld/__tests__/validate.ts:107)에서 `isCrossPageRef()`는 tenant base path를 비교하므로 `/tenant-b/#organization`을 allowlist로 통과시키지는 않습니다. 하지만 바로 아래 분기에서 `isSameTenantUrl()`이 false이면, `tryOrigin(ref) !== null`인 모든 절대 URL을 통과시킵니다.

즉 `siteBaseUrl=https://host/tenant-a`일 때 pure ref `{ "@id": "https://host/tenant-b/#organization" }`는 같은 origin의 다른 tenant인데도 error가 나지 않습니다. PSRC-20의 “multi-tenant 환경에서 다른 path tenant의 fragment가 통과되지 않도록”이라는 목적을 실제 validator 결과가 보장하지 못합니다.

권장 패치: `u.origin === base.origin` 이면서 tenant prefix가 다르면 외부 dereferenceable 예외로 취급하지 말고 별도 오류로 fail 처리해야 합니다. 외부 예외는 진짜 cross-origin에만 허용하는 쪽이 안전합니다.

## acceptance 판정
- typecheck: PASS (`pnpm --filter @glitzy/web typecheck`)
- PSRC-19는 inline `item: { @type, @id, name }`로 self-contained inline 규칙에 부합합니다.
- PSRC-20은 함수 단위 prefix 비교는 들어갔지만 validator 전체 경로에서 다른 tenant absolute URL이 여전히 통과하므로 FAIL입니다.
- 새 major 1건이 있어 `closeableAfterPatch=false`입니다.
tokens used
51,070
# PUBLIC_SITE_RENDER code v1.0 — cycle 4 review

## summary
- 본 cycle 지적 수: blocking=0 major=1 minor=0 (총 1)
- closeableAfterPatch: false
- 수렴 추세: cycle1=15 → cycle2=3 → cycle3=2 → cycle4=1

## cycle 3 patch 검증
- PSRC-19: PASS
- PSRC-20: FAIL

## new findings (PSRC-21+)

**PSRC-21 major — 다른 tenant path 참조가 allowlist 탈락 후 dereferenceable 예외로 다시 통과**

[validate.ts](/abs/path/C:/Users/assag/solution/website-exposure/apps/web/src/lib/json-ld/__tests__/validate.ts:107)에서 `isCrossPageRef()`는 tenant base path를 비교하므로 `/tenant-b/#organization`을 allowlist로 통과시키지는 않습니다. 하지만 바로 아래 분기에서 `isSameTenantUrl()`이 false이면, `tryOrigin(ref) !== null`인 모든 절대 URL을 통과시킵니다.

즉 `siteBaseUrl=https://host/tenant-a`일 때 pure ref `{ "@id": "https://host/tenant-b/#organization" }`는 같은 origin의 다른 tenant인데도 error가 나지 않습니다. PSRC-20의 “multi-tenant 환경에서 다른 path tenant의 fragment가 통과되지 않도록”이라는 목적을 실제 validator 결과가 보장하지 못합니다.

권장 패치: `u.origin === base.origin` 이면서 tenant prefix가 다르면 외부 dereferenceable 예외로 취급하지 말고 별도 오류로 fail 처리해야 합니다. 외부 예외는 진짜 cross-origin에만 허용하는 쪽이 안전합니다.

## acceptance 판정
- typecheck: PASS (`pnpm --filter @glitzy/web typecheck`)
- PSRC-19는 inline `item: { @type, @id, name }`로 self-contained inline 규칙에 부합합니다.
- PSRC-20은 함수 단위 prefix 비교는 들어갔지만 validator 전체 경로에서 다른 tenant absolute URL이 여전히 통과하므로 FAIL입니다.
- 새 major 1건이 있어 `closeableAfterPatch=false`입니다.
