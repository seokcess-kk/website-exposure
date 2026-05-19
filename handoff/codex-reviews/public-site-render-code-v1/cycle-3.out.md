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
session id: 019e3977-93b3-7aa1-87dd-a38bec8dc917
--------
user
You are reviewing **cycle 3** of the PUBLIC_SITE_RENDER code v1.0. Cycle 2 had **3 findings** (blocking=1, major=2). All 3 patched. `pnpm --filter @glitzy/web typecheck` PASS.

## Cycle 2 patches

| # | severity | title | patch summary |
|---|---|---|---|
| PSRC-16 | blocking | rule checker가 `#website` unresolved 로 실패 | cross-page reference allowlist (`#organization`/`#website`/`#clinic`) — same-origin URL + 등록된 fragment 는 graph entity 미존재 OK |
| PSRC-17 | major | P-003/004/005/010 MedicalClinic 풀 entity가 plan SoT(`[참조]`) 와 충돌 | builders 의 cycle 1 PSR-05 patch 일부 revert — 풀 entity 출력 제거, webPageEntity `aboutClinic` 옵션 제거. P-006 만 풀 entity 유지 (SCHEMA_MAPPING § 2.5 정합) |
| PSRC-18 | major | inline `@id` 참조도 검사 안 됨 | rule checker — `@type` 있는 객체 = self-contained inline (검사 제외, recurse 만). pure ref (`@id` 만) 만 same-origin 검사 |

caller 4곳 (doctors/page · doctors/[slug] · treatments/page · insights) 의 builder 호출 시그니처도 cycle 1 patch 의 location 인자 제거.

## Re-review scope (cycle 3)

같은 영역 + 누적 점검:
- `apps/web/src/lib/json-ld/builders.ts` · `entities.ts` · `__tests__/validate.ts`
- 4 caller pages

## What to check (cycle 3)

1. cycle 2 patch 가 plan SoT 와 일관
   - rule checker 안 cross-page allowlist 가 SCHEMA_MAPPING § 2.5 의 SoT cross-page reference 패턴 (P-002+ 모든 페이지의 `isPartOf #website` · WebPage.about ref 등) 을 정확히 표현
   - PSRC-17 revert 가 SCHEMA_MAPPING § 2.5 표 (P-003/4/5/10 = `[참조]` MedicalClinic) 정합
   - inline `@id` 객체 (Article author with `name/jobTitle/image`) 가 checker 통과
2. 회귀 — typecheck PASS 유지 + 시그니처 변경 cascade 정합
3. scenario 1~23 통과 추론 (특히 #10 entity 풀/참조 + #18 자체 rule checker)
4. 새 finding (PSRC-19+)

## Output format

```
# PUBLIC_SITE_RENDER code v1.0 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=15 → cycle2=3 → cycle3=N

## cycle 2 patch 검증
- PSRC-16: PASS|FAIL|PARTIAL
- PSRC-17: PASS|FAIL|PARTIAL
- PSRC-18: PASS|FAIL|PARTIAL

## new findings (PSRC-19+)

## acceptance precondition (PSR-CASCADE-01b)
- PSR-CASCADE-01b: <PASS|FAIL>

## acceptance 판정
- closeableAfterPatch=true 이면 acceptance 권고
```

한국어로 응답.

codex
검토 범위 파일과 현재 diff부터 확인하겠습니다. 먼저 cycle 2 패치가 실제 코드에 어떻게 반영됐는지 보고, 그 다음 테스트/타입체크 상태를 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'git status --short' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files apps/web/src/lib/json-ld apps/web/src/app | rg "(builders|entities|validate|doctors|treatments|insights|page)"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "#website|#organization|#clinic|aboutClinic|MedicalClinic|isPartOf|@id|validate" apps/web/src/lib/json-ld apps/web/src/app -g "*.ts" -g "*.tsx"' in C:\Users\assag\solution\website-exposure
 succeeded in 636ms:
apps/web/src/app\page.tsx
apps/web/src/lib/json-ld\entities.ts
apps/web/src/lib/json-ld\builders.ts
apps/web/src/app\sign-in\page.tsx
apps/web/src/lib/json-ld\__tests__\validate.ts
apps/web/src/app\(site)\[instanceSlug]\page.tsx
apps/web/src/app\(site)\[instanceSlug]\treatments\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\page.tsx
apps/web/src/app\(site)\[instanceSlug]\doctors\page.tsx
apps/web/src/app\(site)\[instanceSlug]\about\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\page.tsx
apps/web/src/app\(site)\[instanceSlug]\contact\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\actions.ts
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\actions.ts
apps/web/src/app\(site)\[instanceSlug]\treatments\[slug]\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\page.tsx
apps/web/src/app\(site)\[instanceSlug]\locations\[slug]\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\new\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\new\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\page.tsx
apps/web/src/app\(site)\[instanceSlug]\legal\[type]\page.tsx
apps/web/src/app\(site)\[instanceSlug]\doctors\[slug]\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\[slug]\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\[slug]\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\new\page.tsx
apps/web/src/app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx

 succeeded in 642ms:
apps/web/src/lib/json-ld\builders.ts:52:// PSRC-17 patch: plan SoT (SCHEMA_MAPPING § 2.5 + PUBLIC_SITE_RENDER § 5.4) 정합 — `[참조] MedicalClinic` only.
apps/web/src/lib/json-ld\builders.ts:53://   풀 entity 출력 안 함. cross-page reference (`${siteBaseUrl}/#clinic` · `#organization` · `#website`) 는
apps/web/src/lib/json-ld\builders.ts:112:// SCHEMA_MAPPING § 2.5 — P-006 은 MedicalClinic 풀 entity 출력 (예약 CTA · 본원 정보 의미).
apps/web/src/lib/json-ld\builders.ts:134:// PSRC-17 patch: P-010 도 `[참조] MedicalClinic` only — graph 안 풀 entity 출력 안 함.
apps/web/src/lib/json-ld\entities.ts:18:  const id = `${ctx.siteBaseUrl}/#organization`;
apps/web/src/lib/json-ld\entities.ts:24:    "@id": id,
apps/web/src/lib/json-ld\entities.ts:37:// PSRC-14 patch: ContactPoint @id 를 absolute pattern (`${siteBaseUrl}/#contact-...`) 으로 통일
apps/web/src/lib/json-ld\entities.ts:42:    "@id": `${ctx.siteBaseUrl}/#contact-${cta.id}`,
apps/web/src/lib/json-ld\entities.ts:54:    "@type": "MedicalClinic",
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
apps/web/src/lib/json-ld\entities.ts:147://   `isPartOf` 의 WebSite 참조는 cross-page reference allowlist 대상 (PSRC-16 patch).
apps/web/src/lib/json-ld\entities.ts:151:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#webpage`,
apps/web/src/lib/json-ld\entities.ts:156:    isPartOf: { "@id": `${ctx.siteBaseUrl}/#website` },
apps/web/src/lib/json-ld\entities.ts:163:    "@id": `${ctx.siteBaseUrl}/#website`,
apps/web/src/lib/json-ld\entities.ts:167:    publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib/json-ld\entities.ts:177:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#breadcrumb`,
apps/web/src/lib/json-ld\entities.ts:194:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#${listId}`,
apps/web/src/lib/json-ld\entities.ts:198:      item: { "@id": it.itemId, name: it.name },
apps/web/src/lib/json-ld\types.ts:2:// SoT: SCHEMA_MAPPING § 1.2 @id 네이밍 + § 2.5 공통 entity 출력 정책 + PUBLIC_SITE_RENDER_PLAN § 5.4
apps/web/src/lib/json-ld\types.ts:11:  "@id": string;
apps/web/src/lib/json-ld\__tests__\validate.ts:1:// @glitzy/web/lib/json-ld/__tests__/validate — 자체 JSON-LD rule checker (LOCAL_PASS)
apps/web/src/lib/json-ld\__tests__\validate.ts:7://   3. @id 유일 (graph 안 중복 없음)
apps/web/src/lib/json-ld\__tests__\validate.ts:8://   4. cross-reference 무결성 — `{ "@id": "..." }` 참조가 그래프 안 entity @id 또는 외부 dereferenceable URL
apps/web/src/lib/json-ld\__tests__\validate.ts:18://   1. inline minimal 객체 (`@id` + `@type` + 추가 필드) 는 self-contained inline 으로 인정 (검사 제외).
apps/web/src/lib/json-ld\__tests__\validate.ts:19://   2. pure ref (`@id` 만 있는 객체) 는 graph entity 또는 cross-page reference allowlist 또는 외부 origin URL.
apps/web/src/lib/json-ld\__tests__\validate.ts:20://   3. cross-page reference allowlist: `${siteBaseUrl}/#organization` · `/#website` · `/#clinic` —
apps/web/src/lib/json-ld\__tests__\validate.ts:37:export function validateJsonLdGraph(graph: unknown, opts: { siteBaseUrl?: string } = {}): ValidationResult {
apps/web/src/lib/json-ld\__tests__\validate.ts:51:  // (3) @id 유일
apps/web/src/lib/json-ld\__tests__\validate.ts:61:    if (typeof e["@id"] !== "string") errors.push(`entity missing @id`);
apps/web/src/lib/json-ld\__tests__\validate.ts:62:    if (typeof e["@id"] === "string") {
apps/web/src/lib/json-ld\__tests__\validate.ts:63:      if (ids.has(e["@id"])) errors.push(`duplicate @id: ${e["@id"]}`);
apps/web/src/lib/json-ld\__tests__\validate.ts:64:      ids.add(e["@id"]);
apps/web/src/lib/json-ld\__tests__\validate.ts:65:      idMap.set(e["@id"], e as JsonLdEntity);
apps/web/src/lib/json-ld\__tests__\validate.ts:69:  // (4) cross-reference — pure ref `{ "@id": "..." }` 만 검사 (inline `{@id, @type, ...}` 객체는 self-contained).
apps/web/src/lib/json-ld\__tests__\validate.ts:71:  //   PSRC-16 patch: cross-page reference allowlist (`#organization`/`#website`/`#clinic`) 는 graph entity 미존재 OK.
apps/web/src/lib/json-ld\__tests__\validate.ts:79:    const hasId = typeof v["@id"] === "string";
apps/web/src/lib/json-ld\__tests__\validate.ts:83:      const ref = v["@id"] as string;
apps/web/src/lib/json-ld\__tests__\validate.ts:95:      if (k === "@type" || k === "@id") continue;
apps/web/src/lib/json-ld\__tests__\validate.ts:115:export function validateExpectedEntities(graph: JsonLdGraph, expected: ReadonlyArray<string>): ValidationResult {
apps/web/src/app\(site)\[instanceSlug]\about\page.tsx:14:export const revalidate = 60;
apps/web/src/app\(site)\[instanceSlug]\layout.tsx:9:export const revalidate = 60;
apps/web/src/app\(site)\[instanceSlug]\contact\page.tsx:15:export const revalidate = 60;
apps/web/src/app\(site)\[instanceSlug]\page.tsx:28:export const revalidate = 60;
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\actions.ts:6:import { revalidatePath } from "next/cache";
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\actions.ts:193:      revalidatePath(`/admin/${instanceSlug}/articles`);
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\actions.ts:194:      revalidatePath(`/admin/${instanceSlug}/articles/${txResult.slug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\actions.ts:196:        revalidatePath(`/admin/${instanceSlug}/articles/${originalSlug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\actions.ts:198:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\actions.ts:256:    revalidatePath(`/admin/${instanceSlug}/articles`);
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\actions.ts:257:    revalidatePath(`/admin/${instanceSlug}/articles/${slug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\actions.ts:258:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:15:import { revalidatePath } from "next/cache";
apps/web/src/app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:426:    revalidatePath(`/admin/${instanceSlug}/clinic-profile`);
apps/web/src/app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:427:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app\(site)\[instanceSlug]\doctors\page.tsx:15:export const revalidate = 60;
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\actions.ts:8:import { revalidatePath } from "next/cache";
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\actions.ts:156:      revalidatePath(`/admin/${instanceSlug}/treatments`);
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\actions.ts:157:      revalidatePath(`/admin/${instanceSlug}/treatments/${txResult.slug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\actions.ts:159:        revalidatePath(`/admin/${instanceSlug}/treatments/${originalSlug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\actions.ts:161:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\actions.ts:221:    revalidatePath(`/admin/${instanceSlug}/treatments`);
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\actions.ts:222:    revalidatePath(`/admin/${instanceSlug}/treatments/${slug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\actions.ts:223:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\actions.ts:8://   - WEB-10 slug 변경 시 old path revalidate
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\actions.ts:14:import { revalidatePath } from "next/cache";
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\actions.ts:158:      revalidatePath(`/admin/${instanceSlug}/doctors`);
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\actions.ts:159:      revalidatePath(`/admin/${instanceSlug}/doctors/${txResult.slug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\actions.ts:160:      // cycle1-3entity WEB-10: slug 변경 시 old path 도 revalidate
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\actions.ts:162:        revalidatePath(`/admin/${instanceSlug}/doctors/${originalSlug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\actions.ts:164:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\actions.ts:254:    revalidatePath(`/admin/${instanceSlug}/doctors`);
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\actions.ts:255:    revalidatePath(`/admin/${instanceSlug}/doctors/${slug}`);
apps/web/src/app\(admin)\admin\[instanceSlug]\doctors\actions.ts:256:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app\(site)\[instanceSlug]\legal\[type]\page.tsx:16:export const revalidate = 60;
apps/web/src/app\(site)\[instanceSlug]\treatments\page.tsx:15:export const revalidate = 60;
apps/web/src/app\(site)\[instanceSlug]\doctors\[slug]\page.tsx:16:export const revalidate = 60;
apps/web/src/app\(site)\[instanceSlug]\locations\[slug]\page.tsx:15:export const revalidate = 60;
apps/web/src/app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:16:export const revalidate = 60;
apps/web/src/app\(site)\[instanceSlug]\treatments\[slug]\page.tsx:16:export const revalidate = 60;

 succeeded in 660ms:
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
작업트리는 원래부터 큰 변경 묶음이 있는 상태라, 이번 리뷰 대상 안에서만 판단하겠습니다. 이제 builder/entity/checker와 4개 caller의 실제 그래프 구성을 대조합니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw apps/web/src/lib/json-ld/builders.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw apps/web/src/lib/json-ld/entities.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw apps/web/src/lib/json-ld/__tests__/validate.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Select-String -Path docs/core/SCHEMA_MAPPING.md -Pattern "2.5|P-003|P-004|P-005|P-006|P-010|MedicalClinic|WebSite|isPartOf" -Context 2,4' in C:\Users\assag\solution\website-exposure
 succeeded in 680ms:
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

export function itemListEntity(
  ctx: GraphBuilderContext,
  items: Array<{ name: string; itemId: string }>,
  listId: string,
): JsonLdEntity {
  return {
    "@type": "ItemList",
    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#${listId}`,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@id": it.itemId, name: it.name },
    })),
  };
}

function stripMarkdown(md: string): string {
  return md.replace(/[#*_`>]/g, "").replace(/\s+/g, " ").trim();
}


 succeeded in 693ms:
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

function isCrossPageRef(ref: string, siteOrigin: string | null): boolean {
  if (!siteOrigin) return false;
  try {
    const u = new URL(ref);
    if (u.origin !== siteOrigin) return false;
    if (!u.hash.startsWith("#")) return false;
    return CROSS_PAGE_REF_FRAGMENTS.has(u.hash.slice(1));
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

  const siteOrigin = opts.siteBaseUrl ? tryOrigin(opts.siteBaseUrl) : null;

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
      if (!ids.has(ref) && !isCrossPageRef(ref, siteOrigin)) {
        const refOrigin = tryOrigin(ref);
        if (refOrigin && siteOrigin && refOrigin === siteOrigin) {
          errors.push(`unresolved same-origin reference at ${path}: ${ref}`);
        } else if (refOrigin === null) {
          errors.push(`unresolved reference at ${path}: ${ref}`);
        }
        // 외부 origin URL → dereferenceable 예외 (통과)
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


 succeeded in 709ms:
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
      doctors.map((d) => ({ name: d.name, itemId: `${ctx.siteBaseUrl}/doctors/${d.slug}#physician` })),
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
      treatments.map((t) => ({ name: t.name, itemId: `${ctx.siteBaseUrl}/treatments/${t.slug}#procedure` })),
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


 succeeded in 780ms:

  docs\core\SCHEMA_MAPPING.md:18:
  docs\core\SCHEMA_MAPPING.md:19:- 모든 페이지는 **하나의 JSON-LD 그래프**(@graph 형태)로 통합 출력. 페이지 타입별 grap
h 구성 표준화.
> docs\core\SCHEMA_MAPPING.md:20:- 핵심 schema: `Organization`·`[7mMedicalClinic[0m`·`Physician`·`MedicalProcedure`·`MedicalC[0m
[7m[0mondition`·`Article`·`FAQPage`·`BreadcrumbList`·`WebSite`. (`MedicalClinic`은 LocalBusiness sub-class이므로 별도 `LocalB[0m
[7m[0musiness` 타입 출력 안 함)[0m
> docs\core\SCHEMA_MAPPING.md:21:- 단지점·다지점은 **`[7mMedicalClinic[0m` 지점 entity가 LocationProfile 1:1 매핑**. ClinicPr[0m
[7m[0mofile은 `Organization`(상위 entity), 본원 LocationProfile은 본원 `MedicalClinic`(`#clinic`)으로 표현.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:22:- **금지 schema** — `Review`·`AggregateRating`·`Offer`·`HealthAndBeautyBusiness`·`Medi[0m
[7m[0mcalIndication` 단정형·`MedicalRiskFactor` 등은 **빌드 실패 (fail)** — § 8 참조.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:23:- `C-15 SchemaInput` 인터페이스를 본 문서 § 6에서 정식 정의 (DATA_MODEL.md placeholder[0m
[7m[0m 해소).[0m
> docs\core\SCHEMA_MAPPING.md:24:- **공통 entity별 페이지 출력 정책은 § [7m2.5[0m가 단일 SoT** — 페이지별 graph 구성(§ 3·§ 4)[0m
[7m[0m이 본 표를 따른다.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:25:- **빌드 검증**: **자체 JSON schema/rule checker**가 빌드 게이트 (필수 필드·풀 entity [0m
[7m[0m누락·금지 schema 사용 시 빌드 실패). schema.org official validator·Google Rich Results Test는 **운영 모니터링·수동 QA**[0m
[7m[0m (§ 7.2).[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:26:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:27:---[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:28:[0m
  docs\core\SCHEMA_MAPPING.md:39:  "@graph": [
  docs\core\SCHEMA_MAPPING.md:40:    { "@type": "Organization", "@id": "...", ... },
> docs\core\SCHEMA_MAPPING.md:41:    { "@type": "[7mMedicalClinic[0m", "@id": "...", ... },[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:42:    { "@type": "BreadcrumbList", "itemListElement": [...] },[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:43:    { "@type": "Article", "@id": "...", ... }[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:44:  ][0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:45:}[0m
  docs\core\SCHEMA_MAPPING.md:55:|---|---|---|
  docs\core\SCHEMA_MAPPING.md:56:| `Organization` (ClinicProfile) | `https://{domain}/#organization` | `https://example
.com/#organization` |
> docs\core\SCHEMA_MAPPING.md:57:| `[7mMedicalClinic[0m` 본원 (LocationProfile main) | `https://{domain}/#clinic` | `https://[0m
[7m[0mexample.com/#clinic` |[0m
> docs\core\SCHEMA_MAPPING.md:58:| `[7mMedicalClinic[0m` 지점 (LocationProfile main 외) | `https://{domain}/locations/{slug}#[0m
[7m[0mclinic` | `https://example.com/locations/gangnam#clinic` |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:59:| `Physician` (DoctorProfile) | `https://{domain}/doctors/{slug}#physician` | |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:60:| `MedicalProcedure` (TreatmentPage) | `https://{domain}/treatments/{slug}#procedure` [0m
[7m[0m| |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:61:| `MedicalCondition` (MedicalConditionPage) | `https://{domain}/conditions/{slug}#cond[0m
[7m[0mition` | |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:62:| `Article` | `https://{domain}/insights/{category}/{slug}#article` | |[0m
> docs\core\SCHEMA_MAPPING.md:63:| `[7mWebSite[0m` | `https://{domain}/#website` | |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:64:| `WebPage` | `https://{domain}{path}#webpage` | 본문 페이지 entity |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:65:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:66:> `@id`는 dereferenceable URL + fragment 형식. 같은 entity는 항상 같은 `@id`를 사용해 [0m
[7m[0m페이지 간 일관성 확보.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:67:[0m
  docs\core\SCHEMA_MAPPING.md:73:|---|---|---|
  docs\core\SCHEMA_MAPPING.md:74:| `Organization` | `https://<host>/<instanceSlug>/#organization` | `https://<customDom
ain>/#organization` |
> docs\core\SCHEMA_MAPPING.md:75:| `[7mMedicalClinic[0m` (`#clinic` 본원) | `https://<host>/<instanceSlug>/#clinic` | `https:[0m
[7m[0m//<customDomain>/#clinic` |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:76:| `Physician` | `https://<host>/<instanceSlug>/doctors/<slug>#physician` | `https://<c[0m
[7m[0mustomDomain>/doctors/<slug>#physician` |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:77:| `MedicalProcedure` | `https://<host>/<instanceSlug>/treatments/<slug>#procedure` | `[0m
[7m[0mhttps://<customDomain>/treatments/<slug>#procedure` |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:78:| `Article` | `https://<host>/<instanceSlug>/insights/<category>/<slug>#article` | `ht[0m
[7m[0mtps://<customDomain>/insights/<category>/<slug>#article` |[0m
> docs\core\SCHEMA_MAPPING.md:79:| `[7mWebSite[0m` | `https://<host>/<instanceSlug>/#website` | `https://<customDomain>/#webs[0m
[7m[0mite` |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:80:| `WebPage` | `https://<host>/<instanceSlug><path>#webpage` | `https://<customDomain><[0m
[7m[0mpath>#webpage` |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:81:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:82:**Entity continuity 전환 룰 (M0 v1.0 도메인 매핑 합류 시점)**:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:83:- 도메인 매핑 후 entity `@id` 가 변경된다. 검색 엔진의 entity 연속성 (knowledge graph [0m
[7m[0m등) 을 위해:[0m
  docs\core\SCHEMA_MAPPING.md:84:  - **HTTP 301 redirect**: v0.1 path-based URL → M0 도메인 매핑 URL (운영 트래픽 영향)
> docs\core\SCHEMA_MAPPING.md:85:  - **`sameAs` 보조 marker**: M0 단계 Organization/[7mMedicalClinic[0m 의 `sameAs` 배열 에 v[0m
[7m[0m0.1 path-based URL 을 한시 (3~6 개월) 포함하여 entity identity 연속성 신호 제공[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:86:  - **sitemap 의 lastmod** 갱신 — 전환 시 모든 페이지 lastmod 1회 갱신해 재크롤 유도[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:87:- 본 전환 작업은 M0 v1.0 본 구현 cascade (PSR-DEFER-02 도메인 매핑) 와 동반.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:88:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:89:### 1.3 entity Cross-reference[0m
  docs\core\SCHEMA_MAPPING.md:106:본원은 항상 단일 entity `#clinic`로 통일. 다지점의 비본원 지점만 별도 entity. **alias
 사용 안 함** (entity identity 명확성).
  docs\core\SCHEMA_MAPPING.md:107:
> docs\core\SCHEMA_MAPPING.md:108:| 인스턴스 형태 | Organization | [7mMedicalClinic[0m |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:109:|---|---|---|[0m
> docs\core\SCHEMA_MAPPING.md:110:| **단지점** | `Organization`(`#organization`) 1개 | **`[7mMedicalClinic[0m`(`#clinic`) 1개[0m
[7m[0m** — LocationProfile(slug=`main`)에 매핑. P-014 페이지(URL `/locations/main`)의 mainEntity도 같은 `#clinic` (URL ≠ enti[0m
[7m[0mty @id) |[0m
> docs\core\SCHEMA_MAPPING.md:111:| **다지점** | `Organization`(`#organization`) 1개 | **본원: `[7mMedicalClinic[0m`(`#clinic[0m
[7m[0m`)** — LocationProfile(slug=`main`). **비본원 지점들: `MedicalClinic`(`/locations/{slug}#clinic`)** 각각 별도 entity. [0m
[7m[0m모두 `parentOrganization` = Organization |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:112:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:113:> P-014 페이지가 단지점 main을 다룰 때도 entity @id는 `#clinic` 유지 — URL은 `/locati[0m
[7m[0mons/main`이지만 mainEntity 참조는 `#clinic`. 다지점 비본원 지점 P-014만 `/locations/{slug}#clinic` entity 사용.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:114:[0m
> docs\core\SCHEMA_MAPPING.md:115:**`Organization` vs `[7mMedicalClinic[0m`의 책임 분리**:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:116:- `Organization`: 법인 정체성 (ClinicProfile의 `legalEntityName`·`founder`·`foundingD[0m
[7m[0mate`·`awards`·`memberOf`·`affiliatedInstitutes`)[0m
> docs\core\SCHEMA_MAPPING.md:117:- `[7mMedicalClinic[0m`: 지점 단위 의료기관 정체성 (LocationProfile의 `address`·`telephone`[0m
[7m[0m·`openingHours`·`geo`·`medicalSpecialty` 등). `parentOrganization`으로 `Organization` 참조.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:118:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:119:### 1.5 `inLanguage`[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:120:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:121:**CreativeWork 계열과 페이지 entity에만** `inLanguage` 명시 (기본 `"ko-KR"`). PageMet[0m
[7m[0ma.inLanguage를 따른다.[0m
  docs\core\SCHEMA_MAPPING.md:123:| 명시 | 명시 안 함 |
  docs\core\SCHEMA_MAPPING.md:124:|---|---|
> docs\core\SCHEMA_MAPPING.md:125:| `Article`·`NewsArticle`·`BlogPosting`·`WebPage`·`FAQPage`·`Blog`·`VideoObject`·`Ima
geObject` 등 CreativeWork 계열 | `Organization`·`[7mMedicalClinic[0m`·`LocalBusiness`·`Physician`·`Person`·`ContactPoint` 등 [0m
[7m[0m— Schema.org 표준상 inLanguage 속성 부재 또는 부적합 |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:126:[0m
> docs\core\SCHEMA_MAPPING.md:127:> Organization·[7mMedicalClinic[0m·Physician 같은 entity에 inLanguage를 박으면 validator 노[0m
[7m[0m이즈. 보조 메타로 헤더의 `<html lang="ko-KR">`·meta inLanguage가 이미 표시함 (SEARCH_STANDARDIZATION § 2.1 정합).[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:128:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:129:---[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:130:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:131:## 2. Schema 모듈 카탈로그[0m
  docs\core\SCHEMA_MAPPING.md:138:|---|---|---|
  docs\core\SCHEMA_MAPPING.md:139:| `Organization` | 모든 페이지 (그래프에 1회) | ClinicProfile (C-01) |
> docs\core\SCHEMA_MAPPING.md:140:| `[7mWebSite[0m` | **Home만 풀 엔티티 출력**. 나머지 페이지는 WebPage.isPartOf로 `#website[0m
[7m[0m` 참조만 (graph 비대화 방지) | (생성기 자동) |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:141:| `WebPage` | 모든 페이지 — 본문 entity | PageMeta (C-06) |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:142:| `BreadcrumbList` | Home 제외 모든 페이지 | (생성기 자동, 경로 기반) |[0m
> docs\core\SCHEMA_MAPPING.md:143:| `[7mMedicalClinic[0m` | 본원(`#clinic`) — § 2.5 정책에 따라 페이지별 풀/참조. 다지점 비본[0m
[7m[0m원 지점은 P-012·P-014에서 N개 entity | LocationProfile (C-21) |[0m
> docs\core\SCHEMA_MAPPING.md:144:| `LocalBusiness` | **별도 출력 안 함** — `[7mMedicalClinic[0m`이 LocalBusiness sub-class. [0m
[7m[0mLocalBusiness 계열 속성(`address`·`openingHoursSpecification`·`geo`·`hasMap`·`potentialAction.ReserveAction`)은 `Medica[0m
[7m[0mlClinic` entity 위에서 사용 | (해당 없음 — 데이터는 LocationProfile, 타입은 MedicalClinic) |[0m
> docs\core\SCHEMA_MAPPING.md:145:| `Physician` | [7mP-004[0m Doctor Profile, Article의 author·reviewedBy | DoctorProfile (C-[0m
[7m[0m02) |[0m
> docs\core\SCHEMA_MAPPING.md:146:| `MedicalProcedure` | [7mP-006[0m Treatment Detail | TreatmentPage (C-03) |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:147:| `MedicalCondition` | P-008 Condition Detail | MedicalConditionPage (C-11) |[0m
> docs\core\SCHEMA_MAPPING.md:148:| `Article` | [7mP-010[0m Article Detail | Article (C-04) |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:149:| `NewsArticle` | (대체 — News 카테고리) | NewsItem (C-19) |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:150:| `FAQPage` | P-011 FAQ, FAQ 블록 포함 페이지 | FAQ[] (C-12) |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:151:| `Question` / `Answer` | FAQPage.mainEntity | FAQ |[0m
> docs\core\SCHEMA_MAPPING.md:152:| `ItemList` | List 페이지 ([7mP-003[0m·P-005·P-007·P-009·...) | (생성기 자동) |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:153:| `Blog` | P-009 대체 (콘텐츠 운영 명확 시) | (선택) |[0m
> docs\core\SCHEMA_MAPPING.md:154:| `VideoObject` | Article.embeddedMedia[].type=youtube·video, [7mP-010[0m의 contentFormat=v[0m
[7m[0mideo | EmbeddedMedia |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:155:| `ImageObject` | 이미지 자산 (사진·로고·OG 등) | (생성기 자동) |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:156:| `Person` | Author가 Physician이 아닌 경우 (`authorType` ≠ clinician) — **M0 외 후속[0m
[7m[0m** (현재 `Article.author: Ref<C-02>` 만 지원. authorType != clinician 케이스는 데이터 모델 확장 시 합류 — DM 추가) | ([0m
[7m[0m선택, M0 외) |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:157:| `EducationalOrganization` / `MedicalOrganization` | `affiliatedInstitutes`·`memberO[0m
[7m[0mf` 참조 entity | ResearchInstitute, Affiliation |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:158:| `PostalAddress` | Address 하위 | Address |[0m
  docs\core\SCHEMA_MAPPING.md:160:| `OpeningHoursSpecification` | BusinessHours 하위 | OpeningHoursSpec |
  docs\core\SCHEMA_MAPPING.md:161:| `ContactPoint` | 전화·이메일·CTA | (생성기 자동) |
> docs\core\SCHEMA_MAPPING.md:162:| `SearchAction` | [7mWebSite[0m.potentialAction **Conditional** — `/search` 라우트가 실제 [0m
[7m[0m구현된 경우에만 출력. M0 미출력 | (생성기 자동) |[0m
> docs\core\SCHEMA_MAPPING.md:163:| `ReserveAction` | **[7mMedicalClinic[0m.potentialAction** — Conditional: **(a) `#clinic` [0m
[7m[0m풀 entity가 출력되는 페이지에서만** + **(b) `LocationProfile.reservationChannels` 중 예약 채널이 실제 존재하거나 페이지[0m
[7m[0m/시술 CTA가 예약 채널일 때**. LocalBusiness 별도 미사용 | ReservationPage, LocationProfile.reservationChannels |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:164:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:165:### 2.2 금지·주의 Schema — 요약 (상세는 § 8)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:166:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:167:| Schema | 룰 레벨 | 이유 |[0m
  docs\core\SCHEMA_MAPPING.md:175:| `HealthInsurancePlan` | **fail** | 보험 광고 제한 |
  docs\core\SCHEMA_MAPPING.md:176:| `MedicalDiagnosis`·`Quiz` | **fail** | 진단 단정 |
> docs\core\SCHEMA_MAPPING.md:177:| `HealthAndBeautyBusiness` (단독·병행) | **fail** | [7mMedicalClinic[0m만 사용 |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:178:| `SpecialAnnouncement` | content-gate | 평상 휴진 미출력. 중대 공지만 별도 정책 |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:179:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:180:> 본 요약은 § 8 상세표와 일치한다. § 7.3에 룰 레벨 정의 (fail/warning/content-gate).[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:181:[0m
  docs\core\SCHEMA_MAPPING.md:189:- `BreadcrumbList` — 빵부스러기 노출
  docs\core\SCHEMA_MAPPING.md:190:- `VideoObject` — 비디오 캐러셀 (Google Rich Results 최소 필드 충족 시)
> docs\core\SCHEMA_MAPPING.md:191:- `LocalBusiness` 계열 (`[7mMedicalClinic[0m` 포함) — 로컬 비즈니스 패널 (Google 비즈니스 [0m
[7m[0m프로필 연계)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:192:- `Person` / `Physician` — 의료진 카드 (제한적)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:193:[0m
> docs\core\SCHEMA_MAPPING.md:194:> `HowTo`는 미사용 (M0 사용 계획 없음). 미래에 [7mP-006[0m `visitFlow`·`process`를 HowTo로 [0m
[7m[0m매핑할 경우 카탈로그·결정표·의료 리스크 룰을 함께 추가해야 함 (SM 신규 필요).[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:195:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:196:**B. Entity 의미 전달 (검색 엔진의 entity 그래프 구성)**:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:197:- `Organization` — 법인 identity[0m
> docs\core\SCHEMA_MAPPING.md:198:- `[7mMedicalClinic[0m` 본원·지점 — 의료기관 entity[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:199:- `Physician` — 의료진 entity (Rich Results는 제한적)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:200:- `MedicalProcedure` / `MedicalCondition` — 의료 entity (Rich Results는 의료 분야 제[0m
[7m[0m한적)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:201:- `WebPage` — 페이지 entity[0m
> docs\core\SCHEMA_MAPPING.md:202:- `[7mWebSite[0m` — 사이트 entity + SearchAction (Home에서만 풀)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:203:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:204:> **운영 함의**: A 카테고리는 빌드 검증·콘텐츠 패턴 최적화 우선. B 카테고리는 검색 엔[0m
[7m[0m진 신뢰도·entity 그래프에 의미 전달. 의료 schema는 유효해도 Google Rich Results 혜택이 제한적이므로 **A 카테고리를 위주[0m
[7m[0m로 효율 추구, B 카테고리는 신뢰도 신호로 두는 전략**.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:205:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:206:### 2.4 Schema 출력 결정 — Allowed / Conditional / Blocked[0m
  docs\core\SCHEMA_MAPPING.md:218:| Schema | 결정 | 조건/이유 |
  docs\core\SCHEMA_MAPPING.md:219:|---|---|---|
> docs\core\SCHEMA_MAPPING.md:220:| `Organization`·`[7mWebSite[0m` (Home)·`WebPage`·`BreadcrumbList` (Home 제외) | Allowed | [0m
[7m[0m|[0m
> docs\core\SCHEMA_MAPPING.md:221:| `[7mMedicalClinic[0m` | **§ 2.5 정책에 따라 full 또는 ref** | 본원(`#clinic`) 풀/참조 위[0m
[7m[0m치는 § 2.5 SoT. 다지점 비본원 지점은 P-012·P-014에 풀 |[0m
> docs\core\SCHEMA_MAPPING.md:222:| `Physician` 풀 엔티티 | Conditional | [7mP-004[0m 상세 페이지에서만 풀, 다른 페이지는 참[0m
[7m[0m조 |[0m
> docs\core\SCHEMA_MAPPING.md:223:| `MedicalProcedure` 풀 엔티티 | Conditional | [7mP-006[0m 상세 페이지에서만 풀 |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:224:| `MedicalCondition` 풀 엔티티 | Conditional | P-008 상세 페이지에서만 풀 |[0m
> docs\core\SCHEMA_MAPPING.md:225:| `Article` 풀 엔티티 | Conditional | [7mP-010[0m 상세 페이지에서만 풀 |
> docs\core\SCHEMA_MAPPING.md:226:| `FAQPage` | Conditional | P-011 또는 FAQ 블록 포함 페이지 ([7mP-006[0m·P-008·P-010 등) |
> docs\core\SCHEMA_MAPPING.md:227:| `ItemList` | Conditional | List 페이지 ([7mP-003[0m·P-005·P-007·P-009) |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:228:| `VideoObject` | Conditional | Article.contentFormat=video 또는 embeddedMedia.type∈{[0m
[7m[0myoutube, vimeo, external-video} (최소 필드 충족 시) |[0m
> docs\core\SCHEMA_MAPPING.md:229:| `ReserveAction` | Conditional | **(a) `#clinic` 풀 entity가 출력되는 페이지** + **(
b) `LocationProfile.reservationChannels` 중 예약 채널(type∈{naver-reservation, video-consultation, external}) 있거나 페
이지/시술 CTA가 예약 채널일 때** — 두 조건 모두 충족 시 `[7mMedicalClinic[0m.potentialAction`으로 출력 |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:230:| `Review` | **Blocked** | 의료광고법 (§ 8) |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:231:| `AggregateRating` | **Blocked** | 의료광고법 (§ 8) |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:232:| `Offer`·`DrugCost`·`MedicalCost` | **Blocked** | 의료 가격 광고 제한 |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:233:| `MedicalRiskFactor`·`MedicalRiskEstimator` (schema 출력) | **Blocked (fail)** | 진[0m
[7m[0m단 단정 위험 (§ 8). 본문 원인·위험요인 표현은 별도 content-gate (compliance-assistant) — schema 출력과 분리 |[0m
  docs\core\SCHEMA_MAPPING.md:235:| `MedicalGuideline` | **Blocked** | 자체 작성 의료 권고 위반 소지 |
  docs\core\SCHEMA_MAPPING.md:236:| `HealthInsurancePlan` | **Blocked** | 보험 광고 제한 |
> docs\core\SCHEMA_MAPPING.md:237:| `HealthAndBeautyBusiness` | **Blocked (fail)** | 의료기관 사이트는 `[7mMedicalClinic[0m`[0m
[7m[0m만 사용. 단독·병행 모두 미사용 |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:238:| `SpecialAnnouncement` | Conditional → 사실상 미출력 | 평상 휴진은 본문/메타. 중대 [0m
[7m[0m공지(예: 보건 위기 대응)만 별도 정책 |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:239:| `Quiz` (비표준)·`MedicalDiagnosis` | **Blocked** | P-106 Self-test는 `WebPage`·`Med[0m
[7m[0micalWebPage`로 |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:240:| `Person` — Organization.founder | Allowed (inline) | 항상 허용 — Organization 내부[0m
[7m[0m에서 founder를 Person으로 inline 표현 |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:241:| `Person` — Article.author (authorType != clinician) | M0 외 후속 | M0는 Physician만[0m
[7m[0m 지원. 데이터 모델 확장 시 합류 |[0m
  docs\core\SCHEMA_MAPPING.md:242:
> docs\core\SCHEMA_MAPPING.md:243:### [7m2.5[0m 공통 entity별 페이지 출력 정책 (단일 SoT)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:244:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:245:> 페이지별 graph 구성(§ 3·§ 4)의 단일 진실 원본. 같은 정책이 다른 섹션에서 다르게 표[0m
[7m[0m현되면 본 표가 우선.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:246:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:247:**용어 정의**:[0m
  docs\core\SCHEMA_MAPPING.md:252:|---|---|---|
  docs\core\SCHEMA_MAPPING.md:253:| `Organization` (`#organization`) | **모든 페이지에 풀 entity 1회 포함** | P-001 ~ P
-014, P-101 ~ P-106 |
> docs\core\SCHEMA_MAPPING.md:254:| `[7mWebSite[0m` (`#website`) | **Home만 풀 entity** | P-001 |[0m
> docs\core\SCHEMA_MAPPING.md:255:| `[7mWebSite[0m` 참조 | **Home 외 모든 페이지 WebPage.isPartOf로 참조** | P-002 ~ |
> docs\core\SCHEMA_MAPPING.md:256:| `[7mMedicalClinic[0m` (`#clinic` 본원) | **풀 entity 출력** — 위치·시간·연락이 본문에 의[0m
[7m[0m미 있게 표시되거나 예약 action이 풀 entity로 필요한 페이지 | P-001(Home), P-002(About), P-006(Treatment Detail — 예약 C[0m
[7m[0mTA·담당 의료진 연계), P-012(Contact), P-014(Location main), P-105(Reservation — 예약 action 풀 필요) |[0m
> docs\core\SCHEMA_MAPPING.md:257:| `[7mMedicalClinic[0m` 참조 | **참조만** — 위치 정보가 페이지 본문에 표시되지 않는 페이지 [0m
[7m[0m| P-003(Doctors List), P-004(Doctor Profile), **P-005(Treatments List — 시술 카드 목록 위주, 위치 슬롯 없음)**, P-007/8[0m
[7m[0m(Conditions), P-009/10(Articles), P-011(FAQ), P-013(Legal), P-101(Reviews), P-102(Pricing), P-103(Facilities), P-104(Ne[0m
[7m[0mws), P-106(Self-test) |[0m
> docs\core\SCHEMA_MAPPING.md:258:| `[7mMedicalClinic[0m` 지점 (`/locations/{slug}#clinic`) | 다지점만, P-012·P-014에 풀 enti[0m
[7m[0mty | 다지점 P-012·P-014 |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:259:| `BreadcrumbList` | **Home 제외 모든 페이지 풀** | P-002 ~ |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:260:| `WebPage` | **모든 페이지 풀** (각 페이지의 본문 entity) | 전 페이지 |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:261:| `Physician`, `MedicalProcedure`, `MedicalCondition`, `Article`, `FAQPage` | 상세 페[0m
[7m[0m이지에서 풀, 다른 페이지(목록·연관 참조)에서 참조 또는 inline 최소 | § 3 참조 |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:262:[0m
  docs\core\SCHEMA_MAPPING.md:273:**Graph 구성**:
  docs\core\SCHEMA_MAPPING.md:274:1. `Organization` (ClinicProfile)
> docs\core\SCHEMA_MAPPING.md:275:2. `[7mMedicalClinic[0m` (LocationProfile main) — 본원[0m
> docs\core\SCHEMA_MAPPING.md:276:3. `[7mWebSite[0m` (SearchAction 포함)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:277:4. `WebPage` (Home의 본문 entity)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:278:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:279:**Organization 필드 매핑**:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:280:[0m
  docs\core\SCHEMA_MAPPING.md:299:| `contactPoint` | `primaryCtas[]` 중 phone·email → `ContactPoint` |
  docs\core\SCHEMA_MAPPING.md:300:
> docs\core\SCHEMA_MAPPING.md:301:**[7mMedicalClinic[0m 필드 매핑 (본원, LocationProfile main)**:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:302:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:303:| Schema 필드 | 출처 (LocationProfile main) |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:304:|---|---|[0m
> docs\core\SCHEMA_MAPPING.md:305:| `@type` | `"[7mMedicalClinic[0m"` |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:306:| `@id` | `https://{domain}/#clinic` |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:307:| `name` | `name` |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:308:| `parentOrganization` | `{"@id": "https://{domain}/#organization"}` |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:309:| `address` | `address` → `PostalAddress` |[0m
  docs\core\SCHEMA_MAPPING.md:315:| `potentialAction` | `reservationChannels[]` 중 예약 채널 **또는 페이지/시술 CTA가 
예약 채널**일 때 → `ReserveAction` (Conditional, § 2.1·§ 2.4 참조) |
  docs\core\SCHEMA_MAPPING.md:316:
> docs\core\SCHEMA_MAPPING.md:317:**[7mWebSite[0m 필드 (Home에서만 풀 엔티티 출력 — § 2.5)**:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:318:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:319:```json[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:320:{[0m
> docs\core\SCHEMA_MAPPING.md:321:  "@type": "[7mWebSite[0m",
> docs\core\SCHEMA_MAPPING.md:322:  "@id": "https://{domain}/#[7mwebsite[0m",[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:323:  "url": "https://{domain}",[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:324:  "name": "{ClinicProfile.name}",[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:325:  "publisher": { "@id": "https://{domain}/#organization" },[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:326:  "inLanguage": "ko-KR"[0m
  docs\core\SCHEMA_MAPPING.md:340:> PAGE_TYPES.md PT-03(Search 페이지)이 Phase Beta+ 미결정 상태이므로 M0에서는 SearchA
ction 미출력. 검색 기능 활성화 시 빌드 트리거.
  docs\core\SCHEMA_MAPPING.md:341:
> docs\core\SCHEMA_MAPPING.md:342:**다른 페이지의 [7mWebSite[0m 참조**: WebPage 엔티티에 `isPartOf: { "@id": "https://{domain[0m
[7m[0m}/#website" }` 참조만. 풀 엔티티 미출력.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:343:[0m
> docs\core\SCHEMA_MAPPING.md:344:**WebPage 필드**: PageMeta 매핑 (title·description·canonical·image) + `[7misPartOf[0m: {@id[0m
[7m[0m: "#website"}` (Home 외).[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:345:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:346:**BreadcrumbList**: Home에는 미적용.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:347:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:348:---[0m
  docs\core\SCHEMA_MAPPING.md:352:**Graph 구성**:
  docs\core\SCHEMA_MAPPING.md:353:1. `Organization` (법인 identity 풀필드)
> docs\core\SCHEMA_MAPPING.md:354:2. `[7mMedicalClinic[0m` (본원 — 주소·시간·연락 SoT)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:355:3. `BreadcrumbList`[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:356:4. `WebPage` (about page)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:357:[0m
> docs\core\SCHEMA_MAPPING.md:358:**Organization**: P-001과 동일하되 **풀필드 노출** (about에서 가장 풍부) — `legalName
`·`founder`·`foundingDate`·`award`·`memberOf`·`subOrganization`·`sameAs` 모두 포함. **`address`는 매핑하지 않음** — Loc
ationProfile/[7mMedicalClinic[0m이 SoT.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:359:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:360:**mediaCoverage 처리**: Schema.org `Organization`에 `mediaCoverage` 표준 속성이 없으[0m
[7m[0m므로 직접 매핑 안 함. 대신:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:361:- 외부 미디어 링크 (인터뷰·기고 URL)는 `sameAs` 배열 끝에 보조 추가 또는[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:362:- 본문에 별도 `CreativeWork[]` 또는 `Article[]` entity로 표현 (외부 매체 기사의 경우 [0m
[7m[0m`isBasedOn`/`citation`)[0m
  docs\core\SCHEMA_MAPPING.md:376:---
  docs\core\SCHEMA_MAPPING.md:377:
> docs\core\SCHEMA_MAPPING.md:378:### [7mP-003[0m. Doctors List[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:379:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:380:**Graph 구성**:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:381:1. `Organization` — **[풀]**[0m
> docs\core\SCHEMA_MAPPING.md:382:2. `[7mMedicalClinic[0m` (본원) — **[참조만]** (§ 2.5)
> docs\core\SCHEMA_MAPPING.md:383:3. `WebPage` (list page) — **[풀]**, `[7misPartOf[0m: #website`[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:384:4. `BreadcrumbList` — **[풀]**[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:385:5. `ItemList` (의료진 목록) — **[풀]** — `itemListElement[]`에 최소 inline 필드 + `@i[0m
[7m[0md` 참조[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:386:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:387:```json[0m
  docs\core\SCHEMA_MAPPING.md:406:```
  docs\core\SCHEMA_MAPPING.md:407:
> docs\core\SCHEMA_MAPPING.md:408:> 정책 변경 (피드백 반영): 목록에는 `name`·`url`·`image`·`jobTitle` 등 **최소 inline 
필드** 포함 (검색 엔진이 외부 fragment를 따라가지 않는 경우 대응). 각 Physician 풀필드는 [7mP-004[0m 상세 페이지의 그래프에서[0m
[7m[0m 정의.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:409:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:410:---[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:411:[0m
> docs\core\SCHEMA_MAPPING.md:412:### [7mP-004[0m. Doctor Profile[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:413:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:414:**Graph 구성**:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:415:1. `Organization` — **[풀]**[0m
> docs\core\SCHEMA_MAPPING.md:416:2. `[7mMedicalClinic[0m` (본원) — **[참조만]** (§ 2.5)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:417:3. `Physician` (DoctorProfile 풀필드) — **[풀]**[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:418:4. `BreadcrumbList` — **[풀]**[0m
> docs\core\SCHEMA_MAPPING.md:419:5. `WebPage` — **[풀]**, `[7misPartOf[0m: #website`[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:420:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:421:**Physician 필드 매핑**:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:422:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:423:| Schema 필드 | 출처 (DoctorProfile) |[0m
  docs\core\SCHEMA_MAPPING.md:443:---
  docs\core\SCHEMA_MAPPING.md:444:
> docs\core\SCHEMA_MAPPING.md:445:### [7mP-005[0m. Treatments List[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:446:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:447:**Graph 구성**:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:448:1. `Organization` — **[풀]**[0m
> docs\core\SCHEMA_MAPPING.md:449:2. `[7mMedicalClinic[0m` (본원) — **[참조만]** (§ 2.5 — 시술 카드 목록 위주, 위치 정보 슬롯[0m
[7m[0m 없음)[0m
> docs\core\SCHEMA_MAPPING.md:450:3. `WebPage` — **[풀]**, `[7misPartOf[0m: #website`[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:451:4. `BreadcrumbList` — **[풀]**[0m
> docs\core\SCHEMA_MAPPING.md:452:5. `ItemList` — **[풀]** — 최소 inline + `@id` 참조 ([7mP-003[0m과 동일 패턴)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:453:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:454:```json[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:455:{[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:456:  "@type": "ItemList",[0m
  docs\core\SCHEMA_MAPPING.md:473:---
  docs\core\SCHEMA_MAPPING.md:474:
> docs\core\SCHEMA_MAPPING.md:475:### [7mP-006[0m. Treatment Detail[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:476:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:477:**Graph 구성**:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:478:1. `Organization` — **[풀]**[0m
> docs\core\SCHEMA_MAPPING.md:479:2. `[7mMedicalClinic[0m` (본원) — **[풀]** (§ 2.5 — 예약 CTA·담당 의료진 연계로 풀 entity [0m
[7m[0m필요)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:480:3. `MedicalProcedure` (TreatmentPage 풀필드) — **[풀]**[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:481:4. `BreadcrumbList` — **[풀]**[0m
> docs\core\SCHEMA_MAPPING.md:482:5. `WebPage` — **[풀]**, `[7misPartOf[0m: #website`[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:483:6. (FAQ 블록 포함 시) `FAQPage` — **[풀]** (Conditional)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:484:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:485:**MedicalProcedure 필드 매핑**:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:486:[0m
  docs\core\SCHEMA_MAPPING.md:529:**Graph 구성**:
  docs\core\SCHEMA_MAPPING.md:530:1. `Organization` — **[풀]**
> docs\core\SCHEMA_MAPPING.md:531:2. `[7mMedicalClinic[0m` (본원) — **[참조만]** (§ 2.5)[0m
> docs\core\SCHEMA_MAPPING.md:532:3. `WebPage` — **[풀]**, `[7misPartOf[0m: #website`[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:533:4. `BreadcrumbList` — **[풀]**[0m
> docs\core\SCHEMA_MAPPING.md:534:5. `ItemList` — **[풀]** — 최소 inline (`name`·`url`·`description`) + `MedicalConditi
on` `@id` 참조 ([7mP-003[0m·P-005 패턴 동일)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:535:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:536:### P-008. Condition Detail[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:537:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:538:**Graph 구성**:[0m
  docs\core\SCHEMA_MAPPING.md:539:1. `Organization` — **[풀]**
> docs\core\SCHEMA_MAPPING.md:540:2. `[7mMedicalClinic[0m` (본원) — **[참조만]** (§ 2.5)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:541:3. `MedicalCondition` (풀필드) — **[풀]**[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:542:4. `BreadcrumbList` — **[풀]**[0m
> docs\core\SCHEMA_MAPPING.md:543:5. `WebPage` — **[풀]**, `[7misPartOf[0m: #website`[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:544:6. (FAQ) `FAQPage` — **[풀]** (Conditional)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:545:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:546:**MedicalCondition 필드**:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:547:[0m
  docs\core\SCHEMA_MAPPING.md:561:**Graph 구성**:
  docs\core\SCHEMA_MAPPING.md:562:1. `Organization` — **[풀]**
> docs\core\SCHEMA_MAPPING.md:563:2. `[7mMedicalClinic[0m` (본원) — **[참조만]** (§ 2.5)[0m
> docs\core\SCHEMA_MAPPING.md:564:3. `WebPage` — **[풀]**, `[7misPartOf[0m: #website`[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:565:4. `BreadcrumbList` — **[풀]**[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:566:5. `ItemList` 또는 `Blog` — **[풀]**[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:567:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:568:`ItemList` 사용 (권장 — Rich Results A 카테고리 대상):[0m
  docs\core\SCHEMA_MAPPING.md:602:```
  docs\core\SCHEMA_MAPPING.md:603:
> docs\core\SCHEMA_MAPPING.md:604:### [7mP-010[0m. Article Detail[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:605:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:606:**Graph 구성** (entity별 [풀]/[참조+inline 최소]/[참조만] 표기):[0m
> docs\core\SCHEMA_MAPPING.md:607:1. `Organization` — **[풀]** (§ [7m2.5[0m: 모든 페이지 풀)
> docs\core\SCHEMA_MAPPING.md:608:2. `[7mMedicalClinic[0m` (본원) — **[참조만]** (§ 2.5)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:609:3. `Article` — **[풀]**[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:610:4. `Physician` (author) — **[참조 + inline 최소: name·image·jobTitle]** (실효성 위해 [0m
[7m[0m인라인)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:611:5. `Physician` (reviewedBy, 해당 시) — **[참조 + inline 최소]**[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:612:6. `BreadcrumbList` — **[풀]**[0m
> docs\core\SCHEMA_MAPPING.md:613:7. `WebPage` — **[풀]**, `[7misPartOf[0m: #website`[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:614:8. (Q&A 블록 포함 시) `FAQPage` — **[풀]** (Conditional)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:615:9. (contentFormat=video 또는 embeddedMedia.type∈{youtube,vimeo,external-video} 시) `V[0m
[7m[0mideoObject` — **[풀, 최소 필드 충족]** (Conditional)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:616:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:617:**Article 필드 매핑**:[0m
  docs\core\SCHEMA_MAPPING.md:666:**Graph 구성**:
  docs\core\SCHEMA_MAPPING.md:667:1. `Organization` — **[풀]**
> docs\core\SCHEMA_MAPPING.md:668:2. `[7mMedicalClinic[0m` (본원) — **[참조만]** (§ 2.5)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:669:3. `FAQPage` (Question/Answer) — **[풀]**[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:670:4. `BreadcrumbList` — **[풀]**[0m
> docs\core\SCHEMA_MAPPING.md:671:5. `WebPage` — **[풀]**, `[7misPartOf[0m: #website`[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:672:[0m
> docs\core\SCHEMA_MAPPING.md:673:**FAQPage**: 위 [7mP-006[0m FAQPage와 동일 구조. 페이지 전체가 Question 모음일 때 `mainEnti[0m
[7m[0mty` 배열.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:674:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:675:### P-012. Contact / Visit (Conversion Hub)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:676:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:677:**Graph 구성**:[0m
  docs\core\SCHEMA_MAPPING.md:678:1. `Organization` — **[풀]**
> docs\core\SCHEMA_MAPPING.md:679:2. `[7mMedicalClinic[0m` (본원 `#clinic`) — **[풀]** (§ 2.5 — Conversion Hub 핵심 entity)[0m
> docs\core\SCHEMA_MAPPING.md:680:3. (다지점 시) `[7mMedicalClinic[0m` (비본원 지점 `/locations/{slug}#clinic`) — **[풀]** 각[0m
[7m[0m각[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:681:4. `BreadcrumbList` — **[풀]**[0m
> docs\core\SCHEMA_MAPPING.md:682:5. `WebPage` — **[풀]**, `[7misPartOf[0m: #website`
> docs\core\SCHEMA_MAPPING.md:683:6. (다지점) `ItemList` — **[풀]** → 각 지점 `[7mMedicalClinic[0m` @id 참조[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:684:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:685:**다지점 처리**:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:686:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:687:```json[0m
  docs\core\SCHEMA_MAPPING.md:689:  "@graph": [
  docs\core\SCHEMA_MAPPING.md:690:    { "@type": "Organization", "@id": "https://{domain}/#organization", ... },
> docs\core\SCHEMA_MAPPING.md:691:    { "@type": "[7mMedicalClinic[0m", "@id": "https://{domain}/#clinic", ... },      // 본[0m
[7m[0m원[0m
> docs\core\SCHEMA_MAPPING.md:692:    { "@type": "[7mMedicalClinic[0m", "@id": "https://{domain}/locations/gangnam#clinic", .[0m
[7m[0m.. },[0m
> docs\core\SCHEMA_MAPPING.md:693:    { "@type": "[7mMedicalClinic[0m", "@id": "https://{domain}/locations/bundang#clinic", .[0m
[7m[0m.. },[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:694:    { "@type": "ItemList", "itemListElement": [...] }[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:695:  ][0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:696:}[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:697:```[0m
  docs\core\SCHEMA_MAPPING.md:699:**예약·상담 채널 표현** (`reservationChannels: CTAConfig[]`):
  docs\core\SCHEMA_MAPPING.md:700:
> docs\core\SCHEMA_MAPPING.md:701:각 CTAConfig는 `[7mMedicalClinic[0m.potentialAction` 또는 `contactPoint`로 변환.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:702:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:703:```json[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:704:"potentialAction": [[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:705:  {[0m
  docs\core\SCHEMA_MAPPING.md:722:**Graph 구성**:
  docs\core\SCHEMA_MAPPING.md:723:1. `Organization` — **[풀]**
> docs\core\SCHEMA_MAPPING.md:724:2. `[7mMedicalClinic[0m` (본원) — **[참조만]** (§ 2.5)[0m
> docs\core\SCHEMA_MAPPING.md:725:3. `WebPage` — **[풀]**, `[7misPartOf[0m: #website`[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:726:4. `BreadcrumbList` — **[풀]**[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:727:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:728:**Note**: 정책 페이지는 검색 노출 우선순위 낮음. `MedicalSchema`·`Article` 적용 안 함[0m
[7m[0m. 단순 `WebPage`로 표현.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:729:[0m
  docs\core\SCHEMA_MAPPING.md:732:**Graph 구성**:
  docs\core\SCHEMA_MAPPING.md:733:1. `Organization` — **[풀]**
> docs\core\SCHEMA_MAPPING.md:734:2. `[7mMedicalClinic[0m` (해당 지점 풀필드) — **[풀]** — `parentOrganization` Organization [0m
[7m[0m참조[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:735:   - **단지점 main**: `@id` = `https://{domain}/#clinic` (URL은 `/locations/main`이지[0m
[7m[0m만 entity는 본원 `#clinic`과 동일)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:736:   - **다지점 비본원**: `@id` = `https://{domain}/locations/{slug}#clinic` (별도 enti[0m
[7m[0mty)[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:737:3. `BreadcrumbList` — **[풀]**[0m
> docs\core\SCHEMA_MAPPING.md:738:4. `WebPage` — **[풀]**, `[7misPartOf[0m: #website`[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:739:[0m
> docs\core\SCHEMA_MAPPING.md:740:**[7mMedicalClinic[0m 필드 매핑 (지점 LocationProfile)**:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:741:[0m
> docs\core\SCHEMA_MAPPING.md:742:P-001의 본원 `[7mMedicalClinic[0m`과 동일 구조 + 다음:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:743:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:744:| Schema 필드 | 출처 |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:745:|---|---|[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:746:| `branchOf` | `{"@id": "https://{domain}/#organization"}` |[0m
  docs\core\SCHEMA_MAPPING.md:748:| `image` | `images[]` → `ImageObject[]` |
  docs\core\SCHEMA_MAPPING.md:749:
> docs\core\SCHEMA_MAPPING.md:750:> 본원(`@id: #clinic`)과 지점(`@id: /locations/{slug}#clinic`)은 다른 entity. `branch
Of`는 Schema.org의 LocalBusiness 계열에서 더 적합 ([7mMedicalClinic[0m은 `parentOrganization`을 우선).[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:751:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:752:---[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:753:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:754:## 4. 페이지 타입별 Schema 매핑 (선택 7종 — 간략)[0m
  docs\core\SCHEMA_MAPPING.md:755:
  docs\core\SCHEMA_MAPPING.md:756:### P-101. Reviews
> docs\core\SCHEMA_MAPPING.md:757:**Graph 구성**: `Organization`[풀] + `[7mMedicalClinic[0m`(본원)[참조만, § 2.5] + `WebPage`[0m
[7m[0m[풀] + `BreadcrumbList`[풀].[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:758:**주의**: `Review`/`AggregateRating` 사용 **금지** (의료광고법 — § 8 참조). 후기 페이[0m
[7m[0m지는 schema 빈약하더라도 의도된 선택.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:759:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:760:### P-102. Pricing[0m
> docs\core\SCHEMA_MAPPING.md:761:**Graph 구성**: `Organization`[풀] + `[7mMedicalClinic[0m`(본원)[참조만, § 2.5] + `WebPage`[0m
[7m[0m[풀] + `BreadcrumbList`[풀].[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:762:**주의**: `Offer` schema **사용 안 함** (의료 가격 광고 제한). 본문 정보만 표시.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:763:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:764:### P-103. Facilities / Equipment[0m
> docs\core\SCHEMA_MAPPING.md:765:**Graph 구성**: `Organization`[풀] + `[7mMedicalClinic[0m`(본원)[참조만, § 2.5] + `WebPage`[0m
[7m[0m[풀] + `BreadcrumbList`[풀]. 사진은 본문 갤러리 또는 `WebPage.image: ImageObject[]`로 표현 (`ImageGallery`는 사용 안 함[0m
[7m[0m — 카탈로그·결정표 미등재).[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:766:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:767:### P-104. News / Event[0m
> docs\core\SCHEMA_MAPPING.md:768:**Graph 구성**: `Organization`[풀] + `[7mMedicalClinic[0m`(본원)[참조만, § 2.5] + `WebPage`[0m
[7m[0m[풀] + `BreadcrumbList`[풀] + (개별 News 항목) `NewsArticle` 또는 `Article`[풀].[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:769:**주의**: 이벤트 카테고리는 `Offer`·할인 schema 안 함.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:770:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:771:### P-105. Reservation[0m
> docs\core\SCHEMA_MAPPING.md:772:**Graph 구성**: `Organization`[풀] + `[7mMedicalClinic[0m`(본원)[**풀**, § 2.5 — 예약 actio[0m
[7m[0mn 풀 entity 필요] + `WebPage`[풀] + `BreadcrumbList`[풀].[0m
> docs\core\SCHEMA_MAPPING.md:773:`[7mMedicalClinic[0m.potentialAction`에 `ReserveAction` 상세 필드 포함 (P-012와 유사하되 예[0m
[7m[0m약 안내 페이지답게 채널·시간·절차 등 상세 명시). ReserveAction은 독립 풀 entity가 아닌 `MedicalClinic.potentialAction`[0m
[7m[0m에 중첩되는 구조.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:774:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:775:### P-106. Self-test / Quiz[0m
> docs\core\SCHEMA_MAPPING.md:776:**Graph 구성**: `Organization`[풀] + `[7mMedicalClinic[0m`(본원)[참조만, § 2.5] + `WebPage`[0m
[7m[0m 또는 `MedicalWebPage`[풀] + `BreadcrumbList`[풀]. **`Quiz`·`MedicalDiagnosis`·`MedicalRiskEstimator`는 fail** (§ 2.4·§[0m
[7m[0m 8). 일반 정보 형태의 `MedicalWebPage` 또는 단순 `WebPage`만.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:777:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:778:---[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:779:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:780:## 5. 데이터 계약 ↔ Schema 필드 매핑 (참조 인덱스)[0m
  docs\core\SCHEMA_MAPPING.md:801:| C-18 `FacilitiesPage` | `WebPage` + 사진 갤러리 | |
  docs\core\SCHEMA_MAPPING.md:802:| C-19 `NewsItem` | `Article` 또는 `NewsArticle` | event-price 카테고리는 schema 신중
 |
> docs\core\SCHEMA_MAPPING.md:803:| C-20 `ReservationPage` | `[7mMedicalClinic[0m.potentialAction.ReserveAction` (LocalBusine[0m
[7m[0mss 별도 출력 안 함) | |[0m
> docs\core\SCHEMA_MAPPING.md:804:| C-21 `LocationProfile` | `[7mMedicalClinic[0m` (지점 단위 별도 entity. LocalBusiness sub-[0m
[7m[0mclass) | 본원·지점 각각 |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:805:| C-22 `ArticleCategory` | (비매핑) — Article.articleSection 문자열 | |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:806:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:807:| 공통 타입 (CT) | 매핑 Schema |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:808:|---|---|[0m
  docs\core\SCHEMA_MAPPING.md:844:| `naver-talk`·`kakao-talk`·`kakao-channel` | `ContactPoint{contactType: "customer se
rvice", url}` 또는 `CommunicateAction` |
  docs\core\SCHEMA_MAPPING.md:845:| `form` | (schema 미적용 — 본문 폼) |
> docs\core\SCHEMA_MAPPING.md:846:| `map` | `[7mMedicalClinic[0m.hasMap`: targetUrl |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:847:| `external` | `potentialAction` 일반 또는 schema 미적용 |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:848:| `sms`·`email` | `ContactPoint` |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:849:| `video-consultation` | `ReserveAction` 또는 `CommunicateAction` |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:850:[0m
  docs\core\SCHEMA_MAPPING.md:880:| 페이지 타입 | 추가 입력 필드 |
  docs\core\SCHEMA_MAPPING.md:881:|---|---|
> docs\core\SCHEMA_MAPPING.md:882:| [7mP-004[0m Doctor Profile | `doctor: DoctorProfile` |[0m
> docs\core\SCHEMA_MAPPING.md:883:| [7mP-006[0m Treatment Detail | `treatment: TreatmentPage`, `relatedDoctors: DoctorProfile[0m
[7m[0m[]`, `relatedConditions: MedicalConditionPage[]`, `faqs: FAQ[]` |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:884:| P-008 Condition Detail | `condition: MedicalConditionPage`, `relatedTreatments: Tre[0m
[7m[0matmentPage[]`, `faqs: FAQ[]` |[0m
> docs\core\SCHEMA_MAPPING.md:885:| [7mP-010[0m Article Detail | `article: Article`, `author: DoctorProfile`, `reviewer?: Doc[0m
[7m[0mtorProfile`, `relatedArticles: Article[]`, `relatedTreatments: TreatmentPage[]` |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:886:| P-011 FAQ | `faqs: FAQ[]` |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:887:| P-014 Location Detail | `location: LocationProfile`, `doctorsAtLocation: DoctorProf[0m
[7m[0mile[]`, `treatmentsAvailable: TreatmentPage[]` |[0m
> docs\core\SCHEMA_MAPPING.md:888:| List 페이지 ([7mP-003[0m·P-005·P-007·P-009) | `items: T[]` (해당 entity 메타) |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:889:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:890:### 6.3 Schema 생성기 출력[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:891:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:892:`SchemaGenerator.generate(input: SchemaInput): JsonLdGraph`[0m
  docs\core\SCHEMA_MAPPING.md:909:| 페이지 타입 | 필수 entity / 필드 |
  docs\core\SCHEMA_MAPPING.md:910:|---|---|
> docs\core\SCHEMA_MAPPING.md:911:| **공통 일반 룰 (§ [7m2.5[0m 정합)** | **§ 2.5에서 "풀"로 지정된 entity는 해당 페이지 grap[0m
[7m[0mh에 풀필드 출력 필수**. 누락 시 빌드 실패. **선택 페이지(P-101~P-106)는 인스턴스에서 활성화된 경우에만 검증** (`Feature[0m
[7m[0mModuleConfig`·`InstanceManifest`·라우트 설정 기준 — P-103·P-104·P-105는 Instance 결정, P-106은 Feature Module 기반 등 [0m
[7m[0m활성화 경로가 페이지별로 다를 수 있음) |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:912:| 모든 페이지 | `Organization`·`WebPage`[풀] + PageMeta의 `title`·`description` + **r[0m
[7m[0mesolved canonical URL** (PageMeta.canonical 또는 SchemaInput.canonicalUrl로 결정. 둘 다 부재 시 빌드 실패) |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:913:| Home 제외 | `BreadcrumbList` |[0m
> docs\core\SCHEMA_MAPPING.md:914:| P-001·P-002·[7mP-006[0m·P-012·P-014 (필수) / P-105 (활성화 시) | **`MedicalClinic` 풀** ([0m
[7m[0m§ 2.5 풀 지정) + `name`·`address`·`telephone`·`openingHoursSpecification` |[0m
> docs\core\SCHEMA_MAPPING.md:915:| [7mP-004[0m | `Physician` + `name`·`jobTitle`·`medicalSpecialty`·`hasCredential` |
> docs\core\SCHEMA_MAPPING.md:916:| [7mP-006[0m | `MedicalProcedure` + `name`·`description`·`howPerformed` |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:917:| P-008 | `MedicalCondition` + `name`·`description` |[0m
> docs\core\SCHEMA_MAPPING.md:918:| [7mP-010[0m | `Article` + `headline`·`description`·`datePublished`·`author`·`publisher` |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:919:| P-011 | `FAQPage` + `mainEntity[]` 최소 1개 |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:920:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:921:누락 시 **빌드 실패**.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:922:[0m
  docs\core\SCHEMA_MAPPING.md:955:| `MedicalIndication` (단정형 schema) | **fail** | Schema 출력 금지. 본문 효능 표현은
 별도 content-gate |
  docs\core\SCHEMA_MAPPING.md:956:| `Quiz` (비표준)·진단형 schema | **fail** | P-106 Self-test는 `WebPage`·`MedicalWebP
age`로 |
> docs\core\SCHEMA_MAPPING.md:957:| `HealthAndBeautyBusiness` (단독·병행) | **fail** | 의료기관 사이트는 [7mMedicalClinic[0m
[7m[0m만 |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:958:| `SpecialAnnouncement` | **content-gate** | 평상 휴진 미출력. 중대 공지만 별도 정책 [0m
[7m[0m|[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:959:[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:960:> 컴플라이언스 정책의 세부 조건과 표현 가이드는 `compliance/RISK_LEVELS.md` 후속 문서[0m
[7m[0m에서 확장. 본 문서는 schema 출력 결정의 룰 레벨만 명시.[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:961:[0m
  docs\core\SCHEMA_MAPPING.md:982:|---|---|---|
  docs\core\SCHEMA_MAPPING.md:983:| 2026-05-14 | v0.1 | 최초 작성 — 통합 graph 표준, M0 필수 14종 풀 graph 매핑, 선택 7
종 간략 매핑, 데이터 계약↔schema 필드 매핑 인덱스, SchemaInput 정식 정의 (C-15), 빌드 검증, 금지·주의 schema 8종 |
> docs\core\SCHEMA_MAPPING.md:984:| 2026-05-14 | v0.2 | **피드백 정합 정정**: (1) **C-15/CT-15 혼동 → C-15로 통일** (Sc
hemaInput은 데이터 계약, CT 아님), (2) **inLanguage 정책 좁힘** — CreativeWork·페이지 entity에만, (3) **[7mMedicalClinic[0m [0m
[7m[0m사용처 정합** — § 2.1 카탈로그 "전 페이지 본원 1개 포함" 명시 (그래프 정의와 일치), (4) **P-002 About 정정** — address [0m
[7m[0m매핑 제거(LocationProfile SoT), mediaCoverage는 sameAs 또는 CreativeWork 보조로, (5) **ItemList inline 필드 추가** — P-[0m
[7m[0m003/P-005/P-007/P-009에 name·url·image·기타 최소 필드 + @id 참조 병행, (6) **List 페이지 그래프에 WebPage 추가** — § 7.[0m
[7m[0m1 검증 룰과 정합 (이전 누락), (7) **evidenceNotes 매핑 보수화** — `MedicalStudy` → `citation`/`CreativeWork` (EvidenceN[0m
[7m[0mote 필드로 MedicalStudy 구성 부족), (8) **§ 2.3 신규** — Schema Rich Results 실효 vs Entity 의미 전달 분류 |[0m
> docs\core\SCHEMA_MAPPING.md:985:| 2026-05-14 | v0.3 | **빌드 가능 규칙화** (피드백 10건): (1) **§ 1.1 Core 출력 범위 
한정** — 외부 위젯 schema 충돌 가능성 명시, (2) **§ 1.4 본원 @id 일관성 (SM-05 해소)** — `/#clinic` 단일 entity, 다지점
 비본원만 `/locations/{slug}#clinic`, alias 금지, (3) **§ 2.1 [7mWebSite[0m Home 전용** — 다른 페이지는 `isPartOf` 참조만, (4[0m
[7m[0m) **§ 2.1 Person M0 외 후속** — authorType != clinician은 데이터 모델 확장 후, (5) **§ 2.4 신규 — Allowed/Conditional/B[0m
[7m[0mlocked 3단계 분류**, (6) **§ 3 P-010 graph 구성 [풀]/[참조+inline]/[참조만] 표기 명확화** + VideoObject Google Rich Res[0m
[7m[0mults 최소 필드 (name·description·thumbnailUrl·uploadDate·contentUrl/embedUrl), (7) **§ 5.1 dayOfWeek enum 변환표** + sp[0m
[7m[0mecialClosures 기본 미출력 정책, (8) **§ 7.2 빌드 게이트 vs 운영 모니터링 분리** — 공식 validator는 모니터링·수동 QA로, [0m
[7m[0m(9) **§ 7.3 룰 레벨 분류 (fail/warning/content-gate)** + **§ 8 표에 룰 레벨 명시** |[0m
> docs\core\SCHEMA_MAPPING.md:986:| 2026-05-14 | v0.4 | **잔재 정리·룰 충돌 해소** (피드백 8건): (1) **§ 2.3 A/B 카테고
리 풀명세 재펼침** ("이전과 동일" 잔재 제거), (2) **inLanguage 잔재 4곳 제거** — Organization·[7mMedicalClinic[0m·Physician·M[0m
[7m[0medicalProcedure 매핑 표, (3) **MedicalRiskFactor 룰 충돌 해소** — schema 출력은 **fail로 통일**, 본문 표현(원인·위험요[0m
[7m[0m인)은 별도 content-gate 분리, (4) **§ 9 미결정 정리** — SM-05·SM-07 "해소" 표시, (5) **P-106 Quiz 제거** — `WebPage`/`M[0m
[7m[0medicalWebPage`만, (6) **P-103 ImageGallery 제거** — 본문 갤러리 또는 `WebPage.image: ImageObject[]`, (7) **§ 5 C-02 Per[0m
[7m[0mson 후속** 명시 (M0 외), (8) **§ 7.3 warning 예시에서 MedicalRiskFactor 제거** (fail로 통일) — `MedicalIndication` 단정[0m
[7m[0m형·`HealthAndBeautyBusiness` 단독 사용 등으로 교체 |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:987:| 2026-05-14 | v0.5 | **미세 잔재 해소·룰 단순화** (피드백 7건): (1) **P-008 riskFact[0m
[7m[0mor → MedicalRiskFactor 행 삭제** — fail 정책 정합. causes[]는 description 보조·본문 표현으로, (2) **P-008 주석 정정** —[0m
[7m[0m "신중" → "schema 출력 안 함, 본문은 content-gate", (3) **HealthAndBeautyBusiness fail로 통일** (§ 2.4·§ 8 모두) — 단독[0m
[7m[0m·병행 모두 미사용, (4) **MedicalIndication fail로 통일** — Schema 출력 금지, 본문 효능 표현만 content-gate, (5) **HowTo[0m
[7m[0m Rich Results A 목록에서 제거** — 미사용. 미래 확장 시 카탈로그·결정표·의료 리스크 룰 추가, (6) **§ 2.4에 Person 두 케[0m
[7m[0m이스 분리** — Organization.founder는 Allowed inline / Article.author (non-clinician)는 M0 외 후속, (7) **VideoObject 필[0m
[7m[0m수 필드 표현 명확화** — `name·description·thumbnailUrl·uploadDate` 4개 필수 + `contentUrl`/`embedUrl` 중 1개 |[0m
> docs\core\SCHEMA_MAPPING.md:988:| 2026-05-14 | v0.6 | **정책 표 정합화** (피드백 7건): (1) **§ [7m2.5[0m 신설 — 공통 entity[0m
[7m[0m별 페이지 출력 정책 (단일 SoT)** — Organization/WebSite/MedicalClinic의 풀 entity vs 참조 위치 명시. § 7.1 룰 checker가[0m
[7m[0m 본 표 기준으로 검증, (2) "풀 entity vs 참조" 용어 정의 — graph[]에 entity 정의 여부 명확, (3) **§ 0 요약 일관화** — "[0m
[7m[0m신중하게" → fail로, validator 표현을 § 7.2와 일치 (자체 checker = 빌드, 공식 validator = 모니터링), (4) **LocalBusiness[0m
[7m[0m 별도 출력 제거** — § 2.1·§ 5 C-20 정정. `MedicalClinic`이 LocalBusiness sub-class이므로 `@type: "MedicalClinic"`만 사[0m
[7m[0m용, LocalBusiness 계열 속성 활용, (5) **SearchAction Conditional** — `/search` 라우트 부재 시 미출력 (M0 미출력, 검색 [0m
[7m[0m기능 활성화 시 합류), (6) **§ 7.3 warning 예시 교체** — MedicalIndication·HealthAndBeautyBusiness 제거(둘 다 fail). 비[0m
[7m[0m차단 항목(외부 위젯 @id 충돌·VideoObject 권장 필드 누락·본문 길이 미달 등)으로 교체 |[0m
> docs\core\SCHEMA_MAPPING.md:989:| 2026-05-14 | v0.7 | **§ [7m2.5[0m SoT 기준 일괄 동기화** (피드백 7건): (1) **§ 2.1 Search[0m
[7m[0mAction Conditional 명시**, **ReserveAction을 LocalBusiness → MedicalClinic.potentialAction**으로 정정, (2) **§ 2.4 Medi[0m
[7m[0mcalClinic 결정 변경** — "본원 1개 전 페이지" → "§ 2.5 정책에 따라 full 또는 ref", (3) **§ 2.5 P-105 Reservation 풀 enti[0m
[7m[0mty로 재분류**, P-101~P-106 일괄 ref 거친 표현 세분화, (4) **§ 3·§ 4 페이지별 graph 구성 [풀]/[참조]/[참조+inline] 표기 [0m
[7m[0m일괄 적용** — P-003·P-004·P-007·P-008·P-009·P-010·P-011·P-013·P-101~P-106, (5) **§ 7.1 검증 룰 정정** — "PageMeta.canon[0m
[7m[0mical 필수" → "**resolved canonical URL 필수** (PageMeta.canonical 또는 SchemaInput.canonicalUrl로 결정)" |[0m
> docs\core\SCHEMA_MAPPING.md:990:| 2026-05-14 | v0.8 | **§ [7m2.5[0m cascade 마무리** (피드백 6건): (1) **P-005 MedicalClini[0m
[7m[0mc [참조만]로 변경** — PAGE_TYPES § 3 P-005에 위치 정보 슬롯 없음. § 2.5 풀 지정 페이지에서 제거, (2) **P-005·P-006·P-01[0m
[7m[0m2·P-014 [풀]/[참조] 표기 적용** — v0.7 일괄 적용 시 누락된 페이지 보완, (3) **P-014 @id 분기 명시** — 단지점 main = `#c[0m
[7m[0mlinic` (본원 entity와 동일), 다지점 비본원 = `/locations/{slug}#clinic` (별도 entity), (4) **§ 7.1 일반 검증 룰 추가** [0m
[7m[0m— "§ 2.5에서 풀로 지정된 entity는 해당 페이지 필수" (룰 checker의 일반 룰. 페이지별 명시는 보조), (5) **§ 7.1 MedicalCl[0m
[7m[0minic 풀 페이지 목록 확장** — P-001·P-002·P-006·P-012·P-014·P-105 (이전 P-012·P-014만), (6) **§ 2.1 ReserveAction Condit[0m
[7m[0mional 명확화** — "reservationChannels 또는 페이지 예약 CTA가 실제 있을 때만" |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:991:| 2026-05-14 | v0.9 | **Conditional·미결정 다듬기** (피드백 5건): (1) **ReserveAction[0m
[7m[0m 조건 § 2.1·§ 2.4 통일** — `(a) #clinic 풀 entity 페이지 + (b) reservationChannels 예약 채널 존재 또는 페이지/시술 CTA[0m
[7m[0m가 예약 채널`, (2) **§ 7.1 선택 페이지 검증 단서** — "선택 페이지(P-101~P-106)는 인스턴스에서 활성화된 경우에만 검증" ([0m
[7m[0mFeatureModuleConfig·라우트 설정 기준). P-105 등 풀 필수 페이지 목록에 "활성화 시" 명시, (3) **SM-03 수준 낮춤** — 완전 [0m
[7m[0m미결정 → "출력 포맷 세부 확정 필요" (정책은 § 5.1에 정의됨), (4) **SM-06 이름 정정** — "Quiz·Self-test schema 모범" → "[0m
[7m[0mP-106 Self-test의 `MedicalWebPage` 세부 필드 정책" (Quiz는 fail로 확정) |[0m
> docs\core\SCHEMA_MAPPING.md:992:| 2026-05-14 | v0.10 | **미세 표현 정합** (피드백 4건): (1) § 3 P-001 [7mMedicalClinic[0m p[0m
[7m[0motentialAction 행에 "페이지/시술 CTA가 예약 채널일 때"도 포함 명시, (2) § 4 P-105 — "ReserveAction 풀필드" → "**상세 필[0m
[7m[0m드 포함** (독립 entity 아닌 MedicalClinic.potentialAction 중첩 구조)", (3) § 7.1 선택 페이지 검증 기준에 **InstanceMani[0m
[7m[0mfest 추가** — P-103·P-104·P-105는 Instance 결정·P-106은 Feature Module 기반 등 활성화 경로 다양화, (4) **§ 2.2 제목에 "[0m
[7m[0m룰 레벨 상세는 § 8" 명시** — fail/warning/content-gate 기조와 정합 |[0m
[7m[0m  docs\core\SCHEMA_MAPPING.md:993:| 2026-05-14 | **v1.0** | **구현 명세 안정판 격상**: (1) **§ 2.2 표에 룰 레벨 열 추가[0m
[7m[0m** — § 8 상세표와 일치하는 요약. § 8 이동 없이 한눈에 파악 가능, (2) **v0.10 → v1.0 격상** — 사용자 메타-피드백 "다음 [0m
[7m[0m안정판을 v1.0으로" 채택. 핵심 정책·표 정합·룰 일관성 완성. 다음 단계는 SchemaGenerator/rule checker 실제 구현 + 그 과정[0m
[7m[0m의 발견 사항을 문서에 되먹이기 |[0m


exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$lines=Get-Content docs/core/SCHEMA_MAPPING.md; $lines[245..330]' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw "apps/web/src/app/(site)/[instanceSlug]/doctors/page.tsx"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw "apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw "apps/web/src/app/(site)/[instanceSlug]/treatments/page.tsx"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw "apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx"' in C:\Users\assag\solution\website-exposure
 succeeded in 718ms:

**용어 정의**:
- **풀 entity (Full)**: graph[]에 entity 정의 — `@type`, `@id`, 필드 모두 출력
- **참조 (Ref)**: graph[]에 entity 정의 없음. 다른 entity의 속성에 `{"@id": "..."}` 참조만 (예: `Article.publisher = {"@id": "#organization"}`)

| Entity | 정책 | 페이지 |
|---|---|---|
| `Organization` (`#organization`) | **모든 페이지에 풀 entity 1회 포함** | P-001 ~ P-014, P-101 ~ P-106 |
| `WebSite` (`#website`) | **Home만 풀 entity** | P-001 |
| `WebSite` 참조 | **Home 외 모든 페이지 WebPage.isPartOf로 참조** | P-002 ~ |
| `MedicalClinic` (`#clinic` 본원) | **풀 entity 출력** — 위치·시간·연락이 본문에 의미 있게 표시되거나 예약 action이 풀 entity로 필요한 페이지 | P-001(Home), P-002(About), P-006(Treatment Detail — 예약 CTA·담당 의료진 연계), P-012(Contact), P-014(Location main), P-105(Reservation — 예약 action 풀 필요) |
| `MedicalClinic` 참조 | **참조만** — 위치 정보가 페이지 본문에 표시되지 않는 페이지 | P-003(Doctors List), P-004(Doctor Profile), **P-005(Treatments List — 시술 카드 목록 위주, 위치 슬롯 없음)**, P-007/8(Conditions), P-009/10(Articles), P-011(FAQ), P-013(Legal), P-101(Reviews), P-102(Pricing), P-103(Facilities), P-104(News), P-106(Self-test) |
| `MedicalClinic` 지점 (`/locations/{slug}#clinic`) | 다지점만, P-012·P-014에 풀 entity | 다지점 P-012·P-014 |
| `BreadcrumbList` | **Home 제외 모든 페이지 풀** | P-002 ~ |
| `WebPage` | **모든 페이지 풀** (각 페이지의 본문 entity) | 전 페이지 |
| `Physician`, `MedicalProcedure`, `MedicalCondition`, `Article`, `FAQPage` | 상세 페이지에서 풀, 다른 페이지(목록·연관 참조)에서 참조 또는 inline 최소 | § 3 참조 |

> § 7.1 빌드 룰 checker는 본 표를 기준으로 페이지별 필수 풀 entity 존재 여부를 검증한다.

---

## 3. 페이지 타입별 Schema 그래프 (M0 필수 14종)

각 페이지 타입의 graph 구성 + 핵심 필드 + 매핑 출처.

### P-001. Home

**Graph 구성**:
1. `Organization` (ClinicProfile)
2. `MedicalClinic` (LocationProfile main) — 본원
3. `WebSite` (SearchAction 포함)
4. `WebPage` (Home의 본문 entity)

**Organization 필드 매핑**:

| Schema 필드 | 출처 (ClinicProfile) |
|---|---|
| `@type` | `"Organization"` |
| `@id` | `https://{domain}/#organization` |
| `name` | `name` |
| `alternateName` | `alternateName` |
| `legalName` | `legalEntityName` |
| `description` | `description` |
| `slogan` | `slogan` |
| `url` | `https://{domain}` |
| `logo` | `logoUrl` → `ImageObject` |
| `founder` | `founder` → `Person` |
| `foundingDate` | `foundingDate` |
| `award` | `awards[].name` |
| `memberOf` | `memberOf[]` → `Organization`(학회) |
| `subOrganization` | `affiliatedInstitutes[]` → `Organization`(연구소) |
| `sameAs` | `socialMedia.*` 배열로 변환 |
| `knowsAbout` | `medicalSpecialty[]` (보조) |
| `contactPoint` | `primaryCtas[]` 중 phone·email → `ContactPoint` |

**MedicalClinic 필드 매핑 (본원, LocationProfile main)**:

| Schema 필드 | 출처 (LocationProfile main) |
|---|---|
| `@type` | `"MedicalClinic"` |
| `@id` | `https://{domain}/#clinic` |
| `name` | `name` |
| `parentOrganization` | `{"@id": "https://{domain}/#organization"}` |
| `address` | `address` → `PostalAddress` |
| `telephone` | `telephone` |
| `email` | `email` |
| `openingHoursSpecification` | `businessHours.openingHours[]` → `OpeningHoursSpecification[]` |
| `geo` | `geo` → `GeoCoordinates` |
| `medicalSpecialty` | ClinicProfile.medicalSpecialty 또는 LocationProfile 특화 |
| `potentialAction` | `reservationChannels[]` 중 예약 채널 **또는 페이지/시술 CTA가 예약 채널**일 때 → `ReserveAction` (Conditional, § 2.1·§ 2.4 참조) |

**WebSite 필드 (Home에서만 풀 엔티티 출력 — § 2.5)**:

```json
{
  "@type": "WebSite",
  "@id": "https://{domain}/#website",
  "url": "https://{domain}",
  "name": "{ClinicProfile.name}",
  "publisher": { "@id": "https://{domain}/#organization" },
  "inLanguage": "ko-KR"
}
```

**`potentialAction.SearchAction` 추가 조건 (Conditional)** — 사이트 내 검색 기능이 실제 구현되고 `/search` 라우트가 존재할 때만:


2026-05-18T05:03:46.545646Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Raw "apps/web/src/app/(site)/[instanceSlug]/doctors/page[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/doctors/page.tsx does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 804ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Raw "apps/web/src/app/(site)/[instanceSlug]/doctors/page[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/doctors/page.tsx does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

2026-05-18T05:03:46.587351Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Raw "apps/web/src/app/(site)/[instanceSlug]/doctors/[slu[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 783ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Raw "apps/web/src/app/(site)/[instanceSlug]/doctors/[slu[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 774ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Raw "apps/web/src/app/(site)/[instanceSlug]/insights/[ca[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

2026-05-18T05:03:46.594853Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Raw "apps/web/src/app/(site)/[instanceSlug]/insights/[ca[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

2026-05-18T05:03:46.612025Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Raw "apps/web/src/app/(site)/[instanceSlug]/treatments/p[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/treatments/page.tsx does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 797ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Raw "apps/web/src/app/(site)/[instanceSlug]/treatments/p[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/treatments/page.tsx does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw -LiteralPath 'apps/web/src/app/(site)/[instanceSlug]/doctors/page.tsx'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw -LiteralPath 'apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw -LiteralPath 'apps/web/src/app/(site)/[instanceSlug]/treatments/page.tsx'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw -LiteralPath 'apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx'" in C:\Users\assag\solution\website-exposure
 succeeded in 619ms:
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


 succeeded in 630ms:
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


 succeeded in 628ms:
// @glitzy/web/(site)/[instanceSlug]/insights/[category]/[slug] — P-010 Article Detail (1샘플)
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1 (Article URL `/insights/[category]/[slug]` · v0.1 fallback `general`)

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { normalizeArticle, normalizeDoctor, type ArticleRow, type DoctorProfileRow } from "@/lib/db-projection";
import { loadSiteInitial } from "@/lib/site-initial";
import { ArticleBody } from "@/components/site/ArticleBody";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/site-metadata";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { articleDetailGraph } from "@/lib/json-ld/builders";
import { siteBaseUrl } from "@/lib/site-url";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { instanceSlug: string; category: string; slug: string } }): Promise<Metadata> {
  if (params.category !== "general") return {};
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  const a = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
    const rows = await tx<ArticleRow[]>`
      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
        FROM article WHERE slug = ${params.slug} LIMIT 1
    `;
    return rows.length > 0 ? normalizeArticle(rows[0]!) : null;
  });
  if (!a) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: a.headline,
    description: a.summary,
    canonicalPath: `/insights/${params.category}/${a.slug}`,
    ogType: "article",
    imageUrl: a.heroImageUrl ?? undefined,
  });
}

export default async function ArticleDetailPage({
  params,
}: {
  params: { instanceSlug: string; category: string; slug: string };
}) {
  // v0.1 단일 fallback category `general` — PSR-DEFER-15
  if (params.category !== "general") notFound();
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();

  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
    const rows = await tx<ArticleRow[]>`
      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
        FROM article
       WHERE slug = ${params.slug}
       LIMIT 1
    `;
    if (rows.length === 0) return null;
    const article = normalizeArticle(rows[0]!);
    let author = null;
    if (article.authorDoctorId) {
      const doctorRows = await tx<DoctorProfileRow[]>`
        SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
          FROM doctor_profile
         WHERE id = ${article.authorDoctorId}::uuid
         LIMIT 1
      `;
      author = doctorRows.length > 0 ? normalizeDoctor(doctorRows[0]!) : null;
    }
    return { article, author };
  });
  if (!data) notFound();

  const base = `/${params.instanceSlug}`;
  const hostOrigin = siteBaseUrl(params.instanceSlug);
  const graph = articleDetailGraph(
    { siteBaseUrl: hostOrigin, pagePath: `/insights/${params.category}/${data.article.slug}` },
    initial.clinic,
    data.article,
    data.author,
    params.category,
  );

  return (
    <>
      <JsonLdScript graph={graph} />
      <Breadcrumb items={[
        { label: "홈", href: base },
        { label: "인사이트", href: null },
        { label: data.article.headline, href: null },
      ]} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        {data.article.heroImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.article.heroImageUrl} alt="" className="mb-6 aspect-video w-full rounded-md object-cover" />
        ) : null}
        <h1 className="text-3xl font-bold text-fg-default">{data.article.headline}</h1>
        <p className="mt-2 text-base text-fg-muted">{data.article.summary}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-fg-muted">
          {data.article.publishedAt ? (
            <time dateTime={data.article.publishedAt.toISOString()}>
              {data.article.publishedAt.toISOString().slice(0, 10)}
            </time>
          ) : null}
          {data.author ? <span>저자: {data.author.name}</span> : null}
        </div>
        <div className="mt-8">
          <ArticleBody markdown={data.article.body} hostOrigin={hostOrigin} />
        </div>
      </article>
    </>
  );
}


 succeeded in 659ms:
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
caller 시그니처는 location 인자가 제거된 형태로 정리되어 있습니다. 다만 checker가 실제 expected-entity 시나리오를 얼마나 잡는지 확인하려고 테스트 파일/스크립트도 같이 보겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "validateJsonLdGraph|validateExpectedEntities|doctorsListGraph|articleDetailGraph|treatmentDetailGraph|MedicalClinic|expected" apps/web -g "*.test.ts" -g "*.spec.ts" -g "*.ts"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw apps/web/src/lib/json-ld/types.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw apps/web/package.json' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "scenario|PSR-CASCADE|PUBLIC_SITE_RENDER|LOCAL_PASS|PSRC" handoff docs apps/web/src/lib/json-ld -g "*.md" -g "*.ts"' in C:\Users\assag\solution\website-exposure
 succeeded in 630ms:
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


 succeeded in 635ms:
apps/web\scripts\local-pass.ts:46:      throw new Error(`unexpected status: ${consumeRes.status}`);
apps/web\scripts\local-pass.ts:52:      throw new Error(`unexpected redirect: ${location}`);
apps/web\scripts\local-pass.ts:89:    const expected = ["magic-link-consumed", "session-created", "first-active-membership-resolved", "tenant-resolved"];
apps/web\scripts\local-pass.ts:90:    const missing = expected.filter((t) => !events.some((e) => e.event_type === t));
apps/web\src\app\api\site-meta-fetch\route.ts:165:    console.error("[site-meta-fetch] unexpected", err);
apps/web\src\app\api\site-meta-fetch\route.ts:170:      reason: "unexpected",
apps/web\src\lib\json-ld\builders.ts:52:// PSRC-17 patch: plan SoT (SCHEMA_MAPPING § 2.5 + PUBLIC_SITE_RENDER § 5.4) 정합 — `[참조] MedicalClinic` only.
apps/web\src\lib\json-ld\builders.ts:55:export function doctorsListGraph(
apps/web\src\lib\json-ld\builders.ts:112:// SCHEMA_MAPPING § 2.5 — P-006 은 MedicalClinic 풀 entity 출력 (예약 CTA · 본원 정보 의미).
apps/web\src\lib\json-ld\builders.ts:113:export function treatmentDetailGraph(
apps/web\src\lib\json-ld\builders.ts:134:// PSRC-17 patch: P-010 도 `[참조] MedicalClinic` only — graph 안 풀 entity 출력 안 함.
apps/web\src\lib\json-ld\builders.ts:135:export function articleDetailGraph(
apps/web\src\lib\json-ld\entities.ts:54:    "@type": "MedicalClinic",
apps/web\src\lib\json-ld\__tests__\validate.ts:9://   5. 페이지 타입별 expected entities 존재 (SCHEMA_MAPPING § 2.5 정합)
apps/web\src\lib\json-ld\__tests__\validate.ts:37:export function validateJsonLdGraph(graph: unknown, opts: { siteBaseUrl?: string } = {}): ValidationResult {
apps/web\src\lib\json-ld\__tests__\validate.ts:113: * 페이지 타입별 expected entity types 검증
apps/web\src\lib\json-ld\__tests__\validate.ts:115:export function validateExpectedEntities(graph: JsonLdGraph, expected: ReadonlyArray<string>): ValidationResult {
apps/web\src\lib\json-ld\__tests__\validate.ts:117:  const missing = expected.filter((t) => !present.has(t));
apps/web\src\lib\json-ld\__tests__\validate.ts:119:  return { ok: false, errors: [`missing expected entities: ${missing.join(", ")}`] };
apps/web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:220:    console.error("[saveArticle] unexpected", err);
apps/web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:272:    console.error("[deleteArticle] unexpected", err);
apps/web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:461:    console.error("[saveClinicProfile] unexpected error", err);
apps/web\src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:182:    console.error("[saveTreatmentPage] unexpected", err);
apps/web\src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:236:    console.error("[deleteTreatmentPage] unexpected", err);
apps/web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:188:    console.error("[saveDoctorProfile] unexpected", err);
apps/web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:276:    console.error("[deleteDoctorProfile] unexpected", err);

 succeeded in 611ms:
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


 succeeded in 621ms:
apps/web/src/lib/json-ld\builders.ts:2:// SoT: SCHEMA_MAPPING § 3 + PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-11
apps/web/src/lib/json-ld\builders.ts:52:// PSRC-17 patch: plan SoT (SCHEMA_MAPPING § 2.5 + PUBLIC_SITE_RENDER § 5.4) 정합 — `[참조] MedicalClinic` only.
apps/web/src/lib/json-ld\builders.ts:54://   rule checker 의 cross-page allowlist 로 통과 (PSRC-16 patch).
apps/web/src/lib/json-ld\builders.ts:134:// PSRC-17 patch: P-010 도 `[참조] MedicalClinic` only — graph 안 풀 entity 출력 안 함.
apps/web/src/lib/json-ld\entities.ts:37:// PSRC-14 patch: ContactPoint @id 를 absolute pattern (`${siteBaseUrl}/#contact-...`) 으로 통일
apps/web/src/lib/json-ld\entities.ts:123:  // PSRC-05 patch: author 는 graph 안 풀 Physician 미포함 페이지 (P-010 인) 경우 inline minimal 객체로 — name/image/jobTitle 포함
apps/web/src/lib/json-ld\entities.ts:146:// PSRC-17 patch: SCHEMA_MAPPING § 2.5 정합 — `about` 옵션 제거 (참조만 페이지에서 dangling ref 회피).
apps/web/src/lib/json-ld\entities.ts:147://   `isPartOf` 의 WebSite 참조는 cross-page reference allowlist 대상 (PSRC-16 patch).
apps/web/src/lib/json-ld\types.ts:2:// SoT: SCHEMA_MAPPING § 1.2 @id 네이밍 + § 2.5 공통 entity 출력 정책 + PUBLIC_SITE_RENDER_PLAN § 5.4
apps/web/src/lib/json-ld\types.ts:16:  /** v0.1 path-based — `https://<host>/<instanceSlug>` (M0 도메인 매핑 합류 시 `https://<customDomain>` cascade · PSR-CASCADE-02) */
handoff\PROJECT_OVERVIEW.md:138:| **A** | Single DB + RLS + `withTenantTransaction` | LOCAL_PASS |
handoff\PROJECT_OVERVIEW.md:139:| **B** | Outbox SKIP LOCKED + idempotent at-least-once with exactly-once observable | LOCAL_PASS |
handoff\PROJECT_OVERVIEW.md:140:| **C** | Storage (R2/MinIO) per-instance policy + TTL-bound signed URL | LOCAL_PASS |
handoff\PROJECT_OVERVIEW.md:141:| **D** | Drizzle Kit + advisory lock + expand/contract migration | LOCAL_PASS |
handoff\PROJECT_OVERVIEW.md:142:| **E** | Magic link CAS + HMAC session + `resolveTenantContext` | LOCAL_PASS |
handoff\PROJECT_OVERVIEW.md:214:| Infra | 인프라 결정 v1.0 · Spike 계획 v1.0 · Spike A·B·C·D·E LOCAL_PASS · Packages 골격/추출 v1.0 |
handoff\PROJECT_OVERVIEW.md:215:| Code | M0 schema · Admin UI walking skeleton · 3 entity forms · Onboarding URL scrape · LOCATION_LEGAL plan + code · PUBLIC_SITE_RENDER plan |
apps/web/src/lib/json-ld\__tests__\validate.ts:1:// @glitzy/web/lib/json-ld/__tests__/validate — 자체 JSON-LD rule checker (LOCAL_PASS)
apps/web/src/lib/json-ld\__tests__\validate.ts:2:// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-14 (cycle1 PSR-17 — 외부 validator manual QA)
apps/web/src/lib/json-ld\__tests__\validate.ts:17:// PSRC-06 / PSRC-16 / PSRC-18 patch:
apps/web/src/lib/json-ld\__tests__\validate.ts:21://      SCHEMA_MAPPING § 2.5 "참조만" 페이지의 cross-page ref 패턴 (PSRC-16 patch).
apps/web/src/lib/json-ld\__tests__\validate.ts:70:  //   PSRC-18 patch: `@type` 존재 시 inline minimal entity 로 간주 (검사 제외, recurse 만).
apps/web/src/lib/json-ld\__tests__\validate.ts:71:  //   PSRC-16 patch: cross-page reference allowlist (`#organization`/`#website`/`#clinic`) 는 graph entity 미존재 OK.
docs\admin\ARCHITECTURE.md:280:### 3.12 apps/web route group 구조 (PSR-CASCADE-01a · PUBLIC_SITE_RENDER_PLAN v0.x)
docs\admin\ARCHITECTURE.md:282:Phase 0 단계 `apps/web` 안 어드민 + 공개 사이트 두 영역을 같은 Next.js 앱 안 route group 으로 분리한다. PUBLIC_SITE_RENDER_PLAN v0.x § 2.1 의 acceptance precondition cascade.
docs\admin\ARCHITECTURE.md:286:| `(admin)` | `/admin/<instanceSlug>/...` | 운영자 어드민 — ClinicProfile · DoctorProfile · TreatmentPage · Article · LegalDocument 입력/편집 | ADMIN_UI_SKELETON code v1.0 합류 (현재 `/<instanceSlug>/...` → `/admin/<instanceSlug>/...` 격상 cascade는 PUBLIC_SITE_RENDER code v1.0 cycle 안 동반 — PSR-CASCADE-01b) |
docs\admin\ARCHITECTURE.md:287:| `(site)` | `/<instanceSlug>/...` | 공개 사이트 — Home · About · Doctors · Treatments · Insights (1샘플) · Contact · Locations · Legal (v0.x 차단) | PUBLIC_SITE_RENDER code v1.0 합류 (M0 게이트 #1 사이트 측 페이지 빌드 가능 단계) |
docs\core\SCHEMA_MAPPING.md:68:#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)
docs\core\SCHEMA_MAPPING.md:70:`PUBLIC_SITE_RENDER_PLAN.md` v0.x § 5.4 PSR-SEO-12 의 SSR + path-based routing 단계 (Phase 0) 에서는 도메인 매핑 (subdomain/custom domain) 합류 전이므로 **임시로 instanceSlug 가 path 에 들어간 `@id` 패턴** 을 사용한다:
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:11:> **cycle4 핵심 결정 (ADMIN-UI-63·66·67·68·71 일괄 close)** — cycle5·7 표현 정정 ADMIN-UI-75·93: walking skeleton 의 control-plane operation (slug → id resolve · **admin_user upsert는 seed 단계 한정** (consume route는 lookup-only · allowlist 강제) · first active membership resolve · seed) 은 **모두 withServiceRole 미사용** 으로 변경한다. 이유: `withServiceRole` 의 pre-insert audit이 `audit_log.instance_id NOT NULL` 을 요구하는데, 이들 operation은 instance scope 가 없거나 (slug resolve) instance 가 아직 결정 안 됨 (admin_user upsert 시점). Spike A audit_log migration 의 NOT NULL 제약은 LOCAL_PASS 통과 SoT 이므로 reversal 위험. 대신 sqlBase 직접 SQL + audit_event 명시 emit. `ServiceRoleFunction` enum cascade 도 precondition 에서 제거 (M0 v1.0 instance-scoped service-role 작업 시점에 enum 추가). audit 일관성은 § 5.5 event matrix 가 명시.
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:22:- `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` v1.0 (Spike A/B/C/D/E LOCAL_PASS 패턴)
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:85:> **Image upload cascade marker** (사용자 피드백): ClinicProfile logo / og:image 직접 파일 업로드는 별도 cascade — packages/storage R2 통합 (INFRA v1.0 결정 · Spike C LOCAL_PASS 패턴 차용) + multipart Server Action + signed URL 발급 + EXIF/PII scrub. M0 v1.0 본 구현 또는 별도 onboarding-assistant Feature spec.
docs\decisions\M0_BUILD_EXPORT_PLAN.md:49:- 시나리오 LOCAL_PASS — 발행 트리거 → Git commit → 빌드 성공.
docs\decisions\M0_BUILD_EXPORT_PLAN.md:51:### 2.1 PUBLIC_SITE_RENDER_PLAN SSR 컴포넌트 재사용 (PSR-CASCADE-03)
docs\decisions\M0_BUILD_EXPORT_PLAN.md:53:`PUBLIC_SITE_RENDER_PLAN.md` v0.x 가 apps/web 안 `(site)` route group · SSR + Next ISR 로 먼저 공개 페이지를 렌더한다 (Phase 0). 본 M0 v1.0 본 구현 시점에 같은 컴포넌트 트리를 정적 build/export 로 재사용한다:
docs\decisions\M0_BUILD_EXPORT_PLAN.md:65:본 § 2.1 은 `PUBLIC_SITE_RENDER_PLAN` 의 acceptance precondition cascade (PSR-CASCADE-03) — apps/worker 구현 시 별도 컴포넌트 작성 부담 없음. 본 plan v1.0 합류 시 § 2.1 상세화.
docs\decisions\INFRA_DECISIONS_DRAFT.md:312:각 Spike 상태 분류: `LOCAL_PASS`·`PROVIDER_PASS`·`PROVIDER_FAIL`·`INCONCLUSIVE`.
docs\decisions\INFRA_DECISIONS_DRAFT.md:316:- A `LOCAL_PASS but PROVIDER_PASS pending` → Week 3 schema는 진행 가능·Week 4 production-like 검증 대기
docs\decisions\INFRA_DECISIONS_DRAFT.md:317:- B `LOCAL_PASS` → Week 4-5 outbox base·worker skeleton·notifications dispatch 진행
docs\decisions\INFRA_DECISIONS_DRAFT.md:320:- D `LOCAL_PASS` → Week 4 M0 vertical slice migration 진행
docs\decisions\INFRA_DECISIONS_DRAFT.md:322:- E `LOCAL_PASS but PROVIDER_PASS pending` → admin UI middleware **hold** until provider gate
docs\decisions\LOCATION_LEGAL_PLAN.md:542:| 12 | 시나리오 14~22 LOCAL_PASS 검증 | apps/web/README.md 또는 별도 scenario doc |
docs\decisions\M0_SCHEMA_PLAN.md:74:| @glitzy/db | D | D0001 base (이미 LOCAL_PASS 검증)·D0010+ M0 |
docs\decisions\M0_SCHEMA_PLAN.md:75:| @glitzy/auth | A | A0001~A0004 (이미 spike-e LOCAL_PASS 검증) |
docs\decisions\M0_SCHEMA_PLAN.md:122:| **M0-07** migrations-runner manifest·depends_on | packages/migrations-runner v0.3 separate scope | Spike D LOCAL_PASS 패턴 (advisory lock·drift check 등)을 production module로 승격하는 별도 작업·M0 schema와 독립 |
docs\decisions\M0_SCHEMA_PLAN.md:131:| **M0-20** SQL apply·RLS·drizzle-kit diff empirical gate | M0 v1.0 Phase 0 Week 4 LOCAL_PASS 실측 | docker postgres apply·RLS scenario 실 검증·drizzle-kit generate diff 0·본 v0.x는 static typecheck·byte-equal 시점 별도 |
docs\decisions\PACKAGES_STRUCTURE.md:3:본 문서는 Phase 0 Week 2~6 본 구현을 위한 monorepo packages 구조다. **Spike A·B·C·D·E의 LOCAL_PASS 코드를 production-ready package로 승격**하여 `apps/web`·`apps/worker`·`apps/spike-*` 모두에서 재사용 가능하게 한다.
docs\decisions\PACKAGES_STRUCTURE.md:9:- 각 Spike의 LOCAL_PASS 코드: `apps/spike-{a,b,c-local,d,e}/src/` — production package에 복사 source
docs\decisions\PACKAGES_STRUCTURE.md:18:│   ├── spike-a/  spike-b/  spike-c-local/  spike-d/  spike-e/  (LOCAL_PASS·기존 prototype)
docs\decisions\PACKAGES_STRUCTURE.md:200:- apps/spike-* LOCAL_PASS regression test (package import 후 동일 PASS): **cycle 3+ deferred** — 본 v0.1·v0.2는 build/typecheck PASS만 측정·실 코드 복사 cycle에서 regression 검증
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md:1:You are reviewing the **plan** `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.1 (draft). This is the **first** Codex critique cycle. Produce a strict, broad review covering plan SoT cascade, data model decisions, routing, RLS/permission, JSON-LD, SEO/AEO/GEO standards, design tokens, scenarios.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md:5:1. `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.1 — the plan under review.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md:18:14. `packages/migrations-runner/src/manifest.ts` (PSR-CASCADE-04 target).
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md:19:15. `apps/web/src/app/(admin)/[instanceSlug]/...` (현 어드민 URL 패턴 · PSR-CASCADE-01 의 출발점).
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md:25:- 모든 PSR-* 결정 (PSR-ROUTE / PSR-DATA / PSR-COMP / PSR-SEO / PSR-DEFER / PSR-CASCADE) 이 reference SoT 와 일관
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md:31:- ADMIN_UI_SKELETON v1.0 acceptance commit 후 어드민 URL 변경 (PSR-CASCADE-01) 의 회귀 영향
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md:42:- `/<instanceSlug>/...` path-based 와 어드민 URL 변경 (PSR-CASCADE-01) 의 회귀 — 기존 sign-in/sign-out/cleanup/api route 영향
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md:71:- PSR-CASCADE-01: 어드민 URL `/admin` prefix — apps/web 디렉토리 구조 변경 + ADMIN_UI_SKELETON code v1.0 patch
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md:72:- PSR-CASCADE-02: SCHEMA_MAPPING § 1.2 v0.1 marker
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md:73:- PSR-CASCADE-03: M0_BUILD_EXPORT_PLAN § 2 patch
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md:74:- PSR-CASCADE-04: migrations-runner manifest 10단계
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md:75:- PSR-CASCADE-05: pgbouncer userlist
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md:80:# PUBLIC_SITE_RENDER_PLAN v0.1 — cycle 1 review
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md:101:- PSR-CASCADE-01~05: <PASS|FAIL|TBD>
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:353:│   └── test-scenarios.ts
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:429:| `LOCAL_PASS` | 로컬 docker-compose 환경에서 통과 |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:439:| A `LOCAL_PASS·PROVIDER pending` | Week 3 schema migration (local·staging) | Week 4 production-readiness·prod deploy hold |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:441:| B `LOCAL_PASS` | Week 4-5 outbox base·worker skeleton·notifications dispatch base | — |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:444:| C `LOCAL_PASS·PROVIDER FAIL` | local prototype은 진행 | Storage ADR 재작성·Supabase Storage reversal 검토 hold·R2 production 미적용 |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:445:| D `LOCAL_PASS` | Week 4 M0 vertical slice migration 진행 |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:448:| E `LOCAL_PASS·PROVIDER pending` | UI 컴포넌트·DESIGN_TOKENS는 진행 가능 | **admin UI middleware·login flow hold** until E provider gate |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:455:| A PROVIDER_PASS + D LOCAL_PASS + B LOCAL_PASS + C/E provider pending 또는 LOCAL_PASS (SPIKE3-01 정정) | Week 3 schema/migration·worker skeleton·UI 컴포넌트 | Week 4 production-readiness·Storage 적용·admin login flow until provider gate | minor |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:468:| 2026-05-15 | **v1.0** | **codex 3차 비평 후 `ready_for_acceptance=true` 확정**. SPIKE3-01 Day 10 의사결정 매트릭스 D LOCAL_PASS 정정 (D는 local-only gate). SPIKE3-02 INFRA 요약부 cleanup은 후속 (minor). **3 cycle 누계 27 지적 전건 수용** (SPIKE1: 18 + SPIKE2: 7 + SPIKE3: 2). SoT cascade 완료: INFRA §4.1·4.2·REVIEW_WORKFLOW AuditAction 4종·DATA_MODEL C-23 v0.24 |
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:469:| 2026-05-15 | (v0.3 비고) | codex 2차 비평 7 지적 전건 수용: (1) INFRA v1.0 §4.1·§4.2 5 Spike/10일 동기화 (SPIKE2-01), (2) **E-provider smoke gate Day 10 추가** — Vercel preview + Auth.js production-like + session DB persistence + 403 matrix (SPIKE2-02), (3) **DATA_MODEL C-23 v0.24 cascade** — instanceMemberships에 active·deactivatedAt·deactivatedBy (SPIKE2-03), (4) **REVIEW_WORKFLOW signed-url-revoked → signed-url-revocation-requested rename** — bearer URL은 즉시 revoke 불가·credential/object rotation으로 후속 처리 (SPIKE2-04), (5) **partial state matrix + Week 3-6 unlock/hold 규칙** — LOCAL_PASS·PROVIDER_PASS·PROVIDER_FAIL·INCONCLUSIVE (SPIKE2-05), (6) **A fallback reversal blast radius 상세** — affected SoT·packages·schedule delta·owner (SPIKE2-06), (7) **D·E artifact 명시** — D는 SQL/log/drift sample·E는 preview report/403 matrix/session DB row (SPIKE2-07) |
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:197:apps\spike-c-local\src\scenarios\test-range-request.ts:20:    ContentType: "application/octet-stream",
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:205:apps\spike-c-local\src\scenarios\provider-smoke.ts:48:    await client.send(new PutObjectCommand({ Bucket: env.S3_BUCKET, Key: key, Body: `instance=${instanceId} index=${i}`, ContentType: "text/plain" }));
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:206:apps\spike-c-local\src\scenarios\provider-smoke.ts:105:  await root.send(new PutObjectCommand({ Bucket: env.S3_BUCKET, Key: largeKey, Body: Buffer.alloc(100, 0x41), ContentType: "application/octet-stream" }));
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:226:docs\decisions\M0_SCHEMA_PLAN.md:122:| **M0-07** migrations-runner manifest·depends_on | packages/migrations-runner v0.3 separate scope | Spike D LOCAL_PASS 패턴 (advisory lock·drift check 등)을 production module로 승격하는 별도 작업·M0 schema와 독립 |
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:344:packages\migrations-runner\src\index.ts:1:// @glitzy/migrations-runner — Spike D LOCAL_PASS 승격 (placeholder·v0.1)
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3081:   1: // @glitzy/migrations-runner — Spike D LOCAL_PASS 승격 (placeholder·v0.1)
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3450:docs\decisions\M0_SCHEMA_PLAN.md:122:| **M0-07** migrations-runner manifest·depends_on | packages/migrations-runner v0.3 separate scope | Spike D LOCAL_PASS 패턴 (advisory lock·drift check 등)을 production module로 승격하는 별도 작업·M0 schema와 독립 |
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4076:docs/decisions/ADMIN_UI_SKELETON_PLAN.md:11:> **cycle4 핵심 결정 (ADMIN-UI-63·66·67·68·71 일괄 close)** — cycle5·7 표현 정정 ADMIN-UI-75·93: walking skeleton 의 control-plane operation (slug → id resolve · **admin_user upsert는 seed 단계 한정** (consume route는 lookup-only · allowlist 강제) · first active membership resolve · seed) 은 **모두 withServiceRole 미사용** 으로 변경한다. 이유: `withServiceRole` 의 pre-insert audit이 `audit_log.instance_id NOT NULL` 을 요구하는데, 이들 operation은 instance scope 가 없거나 (slug resolve) instance 가 아직 결정 안 됨 (admin_user upsert 시점). Spike A audit_log migration 의 NOT NULL 제약은 LOCAL_PASS 통과 SoT 이므로 reversal 위험. 대신 sqlBase 직접 SQL + audit_event 명시 emit. `ServiceRoleFunction` enum cascade 도 precondition 에서 제거 (M0 v1.0 instance-scoped service-role 작업 시점에 enum 추가). audit 일관성은 § 5.5 event matrix 가 명시.
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4483:  23:     "spike-a:all": "pnpm --filter @glitzy/spike-a scenario:all",
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4489:  29:     "spike-b:all": "pnpm --filter @glitzy/spike-b scenario:all",
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4494:  34:     "spike-c:all": "pnpm --filter @glitzy/spike-c-local scenario:all",
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4499:  39:     "spike-d:all": "pnpm --filter @glitzy/spike-d scenario:all",
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4505:  45:     "spike-e:all": "pnpm --filter @glitzy/spike-e scenario:all"
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4871:  - 근거(plan SoT): `LL-SCHEMA-02`, `LL-ACTION-04`, scenario 17
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4877:  - 근거(plan SoT): `LL-ACTION-12`, scenario 19
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4907:  - 근거(plan SoT): scenario 15, ADMIN_UI § 8.1 cascade
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4980:  - 근거(plan SoT): `LL-SCHEMA-02`, `LL-ACTION-04`, scenario 17
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:4986:  - 근거(plan SoT): `LL-ACTION-12`, scenario 19
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:5016:  - 근거(plan SoT): scenario 15, ADMIN_UI § 8.1 cascade
handoff\codex-reviews\public-site-render-code-v1\cycle-1.prompt.md:1:You are reviewing the **code implementation** of `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 (acceptance · 5 cycle · 31 findings 전건 처리). This is **cycle 1** of the code review. Produce a strict, broad critique on whether the code faithfully realizes every plan decision (PSR-ROUTE / PSR-DATA / PSR-COMP / PSR-SEO / PSR-DEFER / PSR-CASCADE) and is correct/secure/atomic/accessible.
handoff\codex-reviews\public-site-render-code-v1\cycle-1.prompt.md:5:1. `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 — plan SoT
handoff\codex-reviews\public-site-render-code-v1\cycle-1.prompt.md:16:### PSR-CASCADE-01b (admin URL `/admin` prefix 격상)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.prompt.md:81:- PSR-CASCADE-01b: admin URL `/admin` prefix · revalidatePath 6 곳 · sign-in/consume redirect target · seed.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-1.prompt.md:115:- ARCHITECTURE.md § 3.12 (PSR-CASCADE-01a)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.prompt.md:120:- 가능한 한 scenario 별 통과 여부 추론 (테스트 코드 없음 — 코드 베이스로 추론)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.prompt.md:125:# PUBLIC_SITE_RENDER code v1.0 — cycle 1 review
handoff\codex-reviews\public-site-render-code-v1\cycle-1.prompt.md:133:- **PSRC-01**: <짧은 제목>
handoff\codex-reviews\public-site-render-code-v1\cycle-1.prompt.md:142:## acceptance precondition (PSR-CASCADE-01b) 점검
handoff\codex-reviews\public-site-render-code-v1\cycle-1.prompt.md:143:- PSR-CASCADE-01b: <PASS|FAIL|PARTIAL>
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:3:> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 cycle 5 회 closeableAfterPatch=true 확정. 누계 31 findings 전건 수용 · 수렴 추세 **21 → 7 → 2 → 1 → 0**. 5 PSR-CASCADE 모두 PASS (01a docs · 02 SCHEMA_MAPPING § 1.2 · 03 M0_BUILD_EXPORT_PLAN § 2.1 · 04 manifest D0011 · 05 pgbouncer userlist). 01b (apps/web 디렉토리 이동 + redirect/revalidate 변경) 는 별 **PUBLIC_SITE_RENDER code v1.0** cycle 분리 (LOCATION_LEGAL plan/code 분리 패턴 정합). ADMIN_UI_SKELETON code v1.0 + LOCATION_LEGAL code v1.0 acceptance 직후 진입하는 첫 공개 사이트 plan.
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:5:> **acceptance commit 구성 (LL-33 패턴 정합)**: 본 commit 에 다음 cascade 동시 포함 — (1) PUBLIC_SITE_RENDER_PLAN.md v1.0 (본 문서) (2) PSR-CASCADE-01a docs/admin/ARCHITECTURE.md § 3.12 patch (3) PSR-CASCADE-02 docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based 표 + entity continuity 전환 룰 (4) PSR-CASCADE-03 docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 SSR 재사용 표 (5) PSR-CASCADE-04 packages/migrations-runner/src/manifest.ts D0011 entry (6) PSR-CASCADE-05 apps/spike-a/pgbouncer/userlist.txt 안 `app_public_reader` 추가. PSR-CASCADE-01b 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 의 acceptance commit 에서 별도 진행.
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:30:  - `apps/web/src/app/sign-in/...` (consume route — redirect target `/<firstSlug>` → `/admin/<firstSlug>` 로 patch · PSR-CASCADE-01)
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:45:| **어드민 URL prefix `/admin/<instanceSlug>/...`** (cycle1 PSR-02 격상) | 공개 path namespace 와 분리. acceptance precondition. 코드 cascade (PSR-CASCADE-01) 동시 적용 |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:77:| Google Rich Results Test / schema.org validator 자동 게이트 | manual QA marker · LOCAL_PASS 는 자체 rule checker (cycle1 PSR-17) | PSR-DEFER-14 |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:111:├─ sign-in/...                           -- (변경: consume redirect target `/admin/<slug>` · PSR-CASCADE-01)
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:219:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:430:- (PSR-SEO-04) canonical v0.1: `https://<host>/<instanceSlug><path>` path-based. M0 v1.0 도메인 매핑 합류 시 entity continuity migration (PSR-CASCADE-02 참조).
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:560:- (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:562:- (PSR-SEO-14 · cycle1 PSR-17) **자체 JSON-LD rule checker** (LOCAL_PASS 게이트): JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 검증. Google Rich Results Test / schema.org validator 는 manual QA marker (PSR-DEFER-14) — CI 게이트 X.
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:565:  - LOCAL_PASS 시나리오 18 의 통과 기준 = 자체 checker 통과
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:583:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:585:| 7 | `packages/migrations-runner/src/manifest.ts` v0.x — D0011 10단계 추가 (PSR-CASCADE-04) | acceptance precondition |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:588:| 10 | LOCATION_LEGAL code v1.1 cascade — admin URL 변경 (PSR-CASCADE-01) 의 revalidatePath 6 곳 patch | acceptance precondition |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:589:| 11 | ADMIN_UI_SKELETON code v1.1 cascade — sign-in/consume redirect `/admin/<slug>` (PSR-CASCADE-01) | acceptance precondition |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:590:| 12 | apps/web seed scenario 도 admin URL 변경 정합 (`apps/web/src/seed.ts`) | acceptance precondition |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:592:## 7. § 8.1 시나리오 (LOCAL_PASS 검증) — cycle1 PSR-17·18 정정
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:610:| 15 | 어드민 측 도메인 (`/admin/<slug>/...`) 와 공개 도메인 (`/<slug>/...`) 충돌 없음 — PSR-CASCADE-01 정합 | 어드민 prefix `/admin` · 공개 prefix 없음. sign-in consume redirect `/admin/<firstSlug>` |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:611:| 16 | dark mode CSS vars 출력 (UI toggle 미지원) | `[data-theme="dark"]` 블록 안 22개 토큰 모두 dark 값 정의 — 자체 rule checker (LOCAL_PASS) · UI toggle 은 marker 만 |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:634:| 11 | 자체 JSON-LD rule checker (LOCAL_PASS) | apps/web/src/lib/json-ld/__tests__/validate.ts |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:638:| 15 | **어드민 URL `/admin` prefix 격상 (PSR-CASCADE-01)** | apps/web/src/app/(admin)/admin/[instanceSlug]/ 디렉토리 이동 + revalidatePath 6 곳 + sign-in/consume redirect target + seed.ts |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:639:| 16 | docs/admin/ARCHITECTURE.md § 3 patch — `(site)` 신설 + `/admin` prefix (PSR-CASCADE-01) | doc |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:640:| 17 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` marker + entity continuity note (PSR-CASCADE-02) | doc |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:641:| 18 | docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2 patch — apps/worker 가 본 plan SSR 컴포넌트 재사용 marker (PSR-CASCADE-03) | doc |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:642:| 19 | packages/migrations-runner manifest 10단계 (D0011 추가 — PSR-CASCADE-04) | manifest.ts |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:643:| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05 · cycle2 PSR-27 경로 정정) | apps/spike-a/pgbouncer/userlist.txt |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:644:| 21 | 시나리오 1~23 LOCAL_PASS 검증 | apps/web/scripts/site-scenarios.ts |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:680:> **acceptance 순서 정합 (LL-33 패턴)**: PSR-CASCADE-01~05 는 plan v1.0 acceptance 와 **동시 또는 직전** 에 적용. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:682:- `PSR-CASCADE-01` (cycle1 PSR-02 격상 + cycle2 PSR-24 a/b 분리):
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:683:  - **PSR-CASCADE-01a (docs · plan acceptance commit 안 동반)**: `docs/admin/ARCHITECTURE.md` § 3 patch — `(site)` 신설 + `/admin` prefix 격상 marker.
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:684:  - **PSR-CASCADE-01b (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEGAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · doctors · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/seed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance ≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 에서 별도 사이클 진행.
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:685:- `PSR-CASCADE-02` (cycle1 PSR-08 보강): `docs/core/SCHEMA_MAPPING.md` § 1.2 patch — v0.1 임시 path-based `@id` 패턴 + 도메인 매핑 후 (M0 v1.0) entity @id 전환 시 redirect/301/`sameAs` 처리 룰 추가 marker.
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:686:- `PSR-CASCADE-03`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 patch — apps/worker 의 build/export 시점에 본 plan SSR 컴포넌트 + JSON-LD 생성기 + sitemap/robots route handler 재사용 marker.
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:687:- `PSR-CASCADE-04`: `packages/migrations-runner/src/manifest.ts` — D0011 10단계 추가 (현 9단계 → 10단계).
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:688:- `PSR-CASCADE-05` (cycle2 PSR-27 경로 정정): `apps/spike-a/pgbouncer/userlist.txt` — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade). 본 파일은 `apps/spike-a/docker-compose.yml` 의 pgbouncer 컨테이너에 mount 되는 정확 경로.
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:695:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:696:| 2026-05-18 | **v1.0** | **Codex 비평 cycle 5 0 findings 확정 acceptance** — closeableAfterPatch=true. 수렴 추세 21 → 7 → 2 → 1 → 0. blocking 0 · major 0 · minor 0 잔존. 5 PSR-CASCADE 모두 PASS (01a · 02 · 03 · 04 · 05). 01b 는 별 code v1.0 cycle 분리. 누계 31 findings 전건 수용. acceptance commit 6 cascade 동시 포함 (LL-33 패턴 정합). |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:697:| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 1 minor finding 전건 수용 patch**: (PSR-31) § 5.3 SoT 요약 3줄 stale 정정 — § 3.1 4계열 명시 (A 일반검색 / B AI 검색 / C User-triggered / D 학습), § 3.2 enum `allow / disallowTraining / disallowAll / custom`, § 3.3 `allow` 시 `aiCrawlerLegalApproved: true` fail-gate. 5 PSR-CASCADE 모두 PASS. closeableAfterPatch=true 신호 + plan v1.0 acceptance commit 권고. 누계 cycle 1+2+3+4 = 31 findings 전건 수용. |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:698:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch**: (PSR-29) acceptance scenario #21 themeColor 기대값 stale 정정 — `BrandTokens.colors.light.primary` default `#2563eb` (light) / `#60a5fa` (dark). (PSR-30) robots.txt starter SoT line-by-line 정합 — 헤더/일반 룰/C 계열/meta-externalagent 코멘트 + Sitemap placeholder `{domain}` 통일 (SEARCH_STANDARDIZATION § 3.3 그대로). 추가 cascade 실 적용: docs/admin/ARCHITECTURE.md § 3.12 신설 (PSR-CASCADE-01a — apps/web route group `(admin)` + `(site)` 분리). apps/spike-a/pgbouncer/userlist.txt 에 `app_public_reader` 추가 (PSR-CASCADE-05). 누계 cycle 1+2+3 = 30 findings 전건 수용. 5 cascade 중 4 PASS, 01b 는 별 code v1.0 cycle. |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:699:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:1:You are reviewing **cycle 2** of the PUBLIC_SITE_RENDER code v1.0. Cycle 1 had **15 findings** (blocking=3, major=9, minor=3). All 15 were patched. `pnpm --filter @glitzy/web typecheck` now PASS.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:7:| PSRC-01 | blocking | ClinicProfileForm.tsx stale import | `@/app/(admin)/admin/[instanceSlug]/clinic-profile/actions` |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:8:| PSRC-02 | blocking | sanitize-html lockfile + transformTags 타입 | pnpm-lock.yaml 갱신 + `transformTags.a` 콜백 파라미터 타입 명시 |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:9:| PSRC-03 | blocking | withPublicTenantTransaction 타입 | `TransactionSql` callback param + `sql.begin<T \| null>` |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:10:| PSRC-04 | major | D0011 password 하드코딩 | `CREATE ROLE app_public_reader LOGIN` 만, password 는 환경별 provision |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:11:| PSRC-05 | major | JSON-LD MedicalClinic ref 미참조 + Article author inline 누락 | `webPageEntity` 안 `aboutClinic` 옵션 + `articleEntity` author inline `name/jobTitle/image`. P-003·P-004·P-005·P-006·P-010 graph 안 MedicalClinic 풀 entity 추가 (location 있을 때) |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:12:| PSRC-06 | major | rule checker cross-reference 약함 | `validateJsonLdGraph(graph, { siteBaseUrl })` — same-origin URL 은 graph entity 필수, 외부 origin 만 dereferenceable 예외 |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:13:| PSRC-07 | major | sitemap minimal 페이지 빈 상태 미포함 + lastmod | P-003/P-005 항상 포함 · `MAX(updated_at)` aggregate |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:14:| PSRC-08 | major | canonical URL request-aware absolute | `siteBaseUrl()` 호출 + `siteMetadata.ts` 안 absolute URL 생성 |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:15:| PSRC-09 | major | Host header spoof | env `PUBLIC_SITE_ORIGIN` 우선, 미지정 시 request host fallback |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:16:| PSRC-10 | major | layout-level loader 반복 호출 | `cache(loadSiteInitial)` — render pass 안 한 번 SELECT |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:17:| PSRC-11 | major | businessHours narrowing 약함 | opens/closes/from/to TIME_REGEX + ISO date regex strict |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:18:| PSRC-12 | major | Markdown 외부 링크 rel 누락 (protocol-relative) | `//evil.example` 도 외부 분류 |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:19:| PSRC-13 | minor | Home article teaser + location summary 누락 | Home 에 Articles + Contact 섹션 추가 |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:20:| PSRC-14 | minor | ContactPoint @id 상대 fragment | `${siteBaseUrl}/#contact-${id}` absolute |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:21:| PSRC-15 | minor | Legal route hostOrigin 하드코딩 | `siteBaseUrl(params.instanceSlug)` |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:37:3. PSR-CASCADE-01b 코드 cascade 완료 검증
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:39:5. 새 finding (PSRC-16+ 부터)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:44:# PUBLIC_SITE_RENDER code v1.0 — cycle 2 review
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:52:- PSRC-01 ~ PSRC-15 각각 PASS / FAIL / PARTIAL
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:54:## new blocking / major / minor (PSRC-16+)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:56:## acceptance precondition (PSR-CASCADE-01b) 점검
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md:57:- PSR-CASCADE-01b: <PASS|FAIL|PARTIAL>
docs\decisions\PROVIDER_PASS_PLAN.md:3:본 문서는 Phase 0 Week 1 5 Spike (A·B·C·D·E)의 LOCAL_PASS 완료 후 진행하는 PROVIDER_PASS gate 통합 계획이다. **모든 spike의 LOCAL_PASS 검증이 통과되었으나, 실 cloud provider 환경에서의 동등성·차이를 검증해야 production 진입이 가능**.
docs\decisions\PROVIDER_PASS_PLAN.md:29:3. `apps/spike-{x}/src/scenarios/provider-smoke.ts` — provider 환경에서 LOCAL_PASS 핵심 시나리오 압축 재실행
docs\decisions\PROVIDER_PASS_PLAN.md:34:- LOCAL_PASS와의 동등성: 동일 시나리오에서 PASS·status code·error body가 provider 표준 (S3·next-auth·postgres-pooler) 정합
docs\decisions\PROVIDER_PASS_PLAN.md:35:- LOCAL_PASS와의 차이: provider-specific 차이는 명시·SoT cascade
handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:1508:    1: // @glitzy/migrations-runner — Spike D LOCAL_PASS 승격 (placeholder·v0.1) + manifest spec (v0.1 — LL-CASCADE-05)
handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:5138:    "spike-a:all": "pnpm --filter @glitzy/spike-a scenario:all",
handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:5144:    "spike-b:all": "pnpm --filter @glitzy/spike-b scenario:all",
handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:5149:    "spike-c:all": "pnpm --filter @glitzy/spike-c-local scenario:all",
handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:5154:    "spike-d:all": "pnpm --filter @glitzy/spike-d scenario:all",
handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:5160:    "spike-e:all": "pnpm --filter @glitzy/spike-e scenario:all"
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:14:You are reviewing the **plan** `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.1 (draft). This is the **first** Codex critique cycle. Produce a strict, broad review covering plan SoT cascade, data model decisions, routing, RLS/permission, JSON-LD, SEO/AEO/GEO standards, design tokens, scenarios.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:18:1. `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.1 — the plan under review.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:31:14. `packages/migrations-runner/src/manifest.ts` (PSR-CASCADE-04 target).
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:32:15. `apps/web/src/app/(admin)/[instanceSlug]/...` (현 어드민 URL 패턴 · PSR-CASCADE-01 의 출발점).
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:38:- 모든 PSR-* 결정 (PSR-ROUTE / PSR-DATA / PSR-COMP / PSR-SEO / PSR-DEFER / PSR-CASCADE) 이 reference SoT 와 일관
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:44:- ADMIN_UI_SKELETON v1.0 acceptance commit 후 어드민 URL 변경 (PSR-CASCADE-01) 의 회귀 영향
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:55:- `/<instanceSlug>/...` path-based 와 어드민 URL 변경 (PSR-CASCADE-01) 의 회귀 — 기존 sign-in/sign-out/cleanup/api route 영향
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:84:- PSR-CASCADE-01: 어드민 URL `/admin` prefix — apps/web 디렉토리 구조 변경 + ADMIN_UI_SKELETON code v1.0 patch
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:85:- PSR-CASCADE-02: SCHEMA_MAPPING § 1.2 v0.1 marker
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:86:- PSR-CASCADE-03: M0_BUILD_EXPORT_PLAN § 2 patch
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:87:- PSR-CASCADE-04: migrations-runner manifest 10단계
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:88:- PSR-CASCADE-05: pgbouncer userlist
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:93:# PUBLIC_SITE_RENDER_PLAN v0.1 — cycle 1 review
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:114:- PSR-CASCADE-01~05: <PASS|FAIL|TBD>
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:149:apps\spike-c-local\tsconfig.scenarios.json
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:163:apps\spike-d\tsconfig.scenarios.json
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:185:docs\decisions\PUBLIC_SITE_RENDER_PLAN.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:231:apps\spike-c-local\src\scenarios\test-replay.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:232:apps\spike-c-local\src\scenarios\test-range-request.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:233:apps\spike-c-local\src\scenarios\test-method-confusion.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:234:apps\spike-c-local\src\scenarios\test-list-bucket.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:235:apps\spike-c-local\src\scenarios\test-isolation.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:236:apps\spike-c-local\src\scenarios\test-content-type.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:237:apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:238:apps\spike-c-local\src\scenarios\provider-smoke.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:239:apps\spike-c-local\src\scenarios\invariant-runner.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:265:apps\spike-b\src\scenarios\provider-smoke.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:266:apps\spike-b\src\scenarios\test-failure-injection.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:267:apps\spike-b\src\scenarios\test-basic-100.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:268:apps\spike-b\src\scenarios\test-idempotency.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:270:apps\spike-b\src\scenarios\test-invariant-runner.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:271:apps\spike-a\src\scenarios\test-invariant-runner.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:272:apps\spike-a\src\scenarios\test-audit.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:273:apps\spike-a\src\scenarios\provider-smoke.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:280:apps\spike-a\src\scenarios\test-write.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:281:apps\spike-a\src\scenarios\test-rollback.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:282:apps\spike-a\src\scenarios\test-read.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:283:apps\spike-a\src\scenarios\test-pgbouncer-auth.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:284:apps\spike-a\src\scenarios\test-perf.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:285:apps\spike-a\src\scenarios\test-nested-tx.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:286:apps\spike-a\src\scenarios\test-negative.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:291:apps\spike-b\src\scenarios\test-stale-reclaim.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:292:apps\spike-b\src\scenarios\test-rls-mismatch.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:293:apps\spike-b\src\scenarios\test-retry-permanent.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:294:apps\spike-b\src\scenarios\test-no-cross-tenant.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:297:apps\spike-d\src\scenarios\test-staging-apply.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:298:apps\spike-d\src\scenarios\test-forward-only-hotfix.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:299:apps\spike-d\src\scenarios\test-failure-rollback.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:300:apps\spike-d\src\scenarios\test-expand-contract.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:301:apps\spike-d\src\scenarios\test-drift-check.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:302:apps\spike-d\src\scenarios\test-dev-apply.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:303:apps\spike-d\src\scenarios\test-deploy-gate.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:304:apps\spike-d\src\scenarios\test-canonical-generation.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:305:apps\spike-d\src\scenarios\test-audit.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:306:apps\spike-d\src\scenarios\test-advisory-lock.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:337:apps\spike-e\tsconfig.scenarios.json
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:398:apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:399:apps\spike-e\src\scenarios\test-invariant.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:400:apps\spike-e\src\scenarios\test-invalid-instance-id.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:401:apps\spike-e\src\scenarios\test-inactive-user.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:402:apps\spike-e\src\scenarios\test-drizzle-adapter-smoke.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:403:apps\spike-e\src\scenarios\test-client-tampering.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:404:apps\spike-e\src\scenarios\test-action-eligibility.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:405:apps\spike-e\src\scenarios\provider-smoke.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:406:apps\spike-e\src\scenarios\test-session-refresh.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:407:apps\spike-e\src\scenarios\test-rls-integration.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:408:apps\spike-e\src\scenarios\test-membership-removal.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:409:apps\spike-e\src\scenarios\test-magic-link-login.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:410:apps\spike-e\src\scenarios\test-super-admin-switch.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:411:apps\spike-e\src\scenarios\test-tenant-resolve-cross.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:412:apps\spike-e\src\scenarios\test-tenant-resolve-own.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:702:?? docs/decisions/PUBLIC_SITE_RENDER_PLAN.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:714:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/decisions/PUBLIC_SITE_RENDER_PLAN.md | ForEach-Object { '"'{0,4}: {1}' -f (++"'$i), $_ }' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:827: 106: - 현재 어드민 URL = `/<instanceSlug>/clinic-profile` 형태이므로 **충돌**. v0.1 patch: 어드민을 `/admin/<instanceSlug>/...` 로 prefix 추가. ADMIN_UI cascade marker (PSR-CASCADE-01).
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1010: 289: - (PSR-SEO-10) `@id` 패턴: SCHEMA_MAPPING § 1.2 정합. v0.1 path-based domain (`https://<host>/<instanceSlug>/#organization` 등) — M0 v1.0 도메인 매핑 합류 시 (`https://<customDomain>/#organization`) 으로 변경 가능. cascade marker (PSR-CASCADE-02).
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1021: 300: - D0011 migration — `app_public_reader` role 생성. packages/migrations-runner manifest 9단계 → 10단계 (D0011 추가 — PSR-CASCADE-04).
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1022: 301: - pgbouncer userlist 에 `app_public_reader` 추가 (Spike A v0.x cascade — PSR-CASCADE-05).
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1026: 305: ## 7. § 8.1 시나리오 (LOCAL_PASS 검증)
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1044: 323: | 15 | 어드민 측 도메인 (`/admin/...`) 와 공개 도메인 (`/...`) 충돌 없음 | 어드민 prefix `/admin` 으로 분리 — PSR-CASCADE-01 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1066: 345: | 12 | 어드민 경로 `/admin` prefix 추가 (PSR-CASCADE-01) | apps/web/src/app/(admin) 의 path 분리 (예: `(admin)/admin/[instanceSlug]/`) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1067: 346: | 13 | 시나리오 1~20 LOCAL_PASS 검증 | apps/web/scripts/site-scenarios.ts |
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1068: 347: | 14 | docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2 patch — apps/worker 의 build/export 시점에 본 plan 의 SSR 컴포넌트 재사용 marker | PSR-CASCADE-03 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1069: 348: | 15 | docs/admin/ARCHITECTURE.md § 3 patch — `(site)` route group + `/admin` prefix 분리 정합 | PSR-CASCADE-01 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1070: 349: | 16 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` pattern marker (도메인 매핑 합류 시 변경) | PSR-CASCADE-02 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1071: 350: | 17 | packages/migrations-runner manifest 10단계 (D0011 추가) | PSR-CASCADE-04 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1072: 351: | 18 | Spike A pgbouncer userlist 에 `app_public_reader` 추가 marker | PSR-CASCADE-05 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1102: 381: > **acceptance 순서 정합 (LL-33 패턴)**: PSR-CASCADE-01~05 는 plan v1.0 acceptance 와 **동시 또는 직전** 에 적용 (plan acceptance commit 안 포함). plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1104: 383: - `PSR-CASCADE-01`: `docs/admin/ARCHITECTURE.md` § 3 — `(site)` route group 신설 + 어드민 `/admin` prefix 분리 마커 추가. ADMIN_UI_SKELETON code v1.0 의 어드민 URL 도 `/admin/<instanceSlug>/...` 로 정정 (코드 cascade — apps/web/src/app/(admin) 디렉토리 구조 변경).
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1105: 384: - `PSR-CASCADE-02`: `docs/core/SCHEMA_MAPPING.md` § 1.2 — v0.1 path-based `@id` pattern marker (`https://<host>/<instanceSlug>/#organization` 등). M0 v1.0 도메인 매핑 합류 시 (`https://<customDomain>/#organization`) 로 변경.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1106: 385: - `PSR-CASCADE-03`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 — apps/worker 의 build/export 시점에 본 plan SSR 컴포넌트 재사용 marker.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1107: 386: - `PSR-CASCADE-04`: `packages/migrations-runner/src/manifest.ts` — D0011 추가 (9 → 10 entry).
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1108: 387: - `PSR-CASCADE-05`: `apps/spike-a` pgbouncer userlist — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade).
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:6741:  49: - 시나리오 LOCAL_PASS — 발행 트리거 → Git commit → 빌드 성공.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7297: 542: | 12 | 시나리오 14~22 LOCAL_PASS 검증 | apps/web/README.md 또는 별도 scenario doc |
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7377:  11: > **cycle4 핵심 결정 (ADMIN-UI-63·66·67·68·71 일괄 close)** — cycle5·7 표현 정정 ADMIN-UI-75·93: walking skeleton 의 control-plane operation (slug → id resolve · **admin_user upsert는 seed 단계 한정** (consume route는 lookup-only · allowlist 강제) · first active membership resolve · seed) 은 **모두 withServiceRole 미사용** 으로 변경한다. 이유: `withServiceRole` 의 pre-insert audit이 `audit_log.instance_id NOT NULL` 을 요구하는데, 이들 operation은 instance scope 가 없거나 (slug resolve) instance 가 아직 결정 안 됨 (admin_user upsert 시점). Spike A audit_log migration 의 NOT NULL 제약은 LOCAL_PASS 통과 SoT 이므로 reversal 위험. 대신 sqlBase 직접 SQL + audit_event 명시 emit. `ServiceRoleFunction` enum cascade 도 precondition 에서 제거 (M0 v1.0 instance-scoped service-role 작업 시점에 enum 추가). audit 일관성은 § 5.5 event matrix 가 명시.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7388:  22: - `docs/decisions/PHASE0_WEEK1_SPIKES_DRAFT.md` v1.0 (Spike A/B/C/D/E LOCAL_PASS 패턴)
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:7451:  85: > **Image upload cascade marker** (사용자 피드백): ClinicProfile logo / og:image 직접 파일 업로드는 별도 cascade — packages/storage R2 통합 (INFRA v1.0 결정 · Spike C LOCAL_PASS 패턴 차용) + multipart Server Action + signed URL 발급 + EXIF/PII scrub. M0 v1.0 본 구현 또는 별도 onboarding-assistant Feature spec.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:8119:   2: // Spike E LOCAL_PASS 패턴 그대로·env 의존 제거·cfg 주입
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:9937:# PUBLIC_SITE_RENDER_PLAN v0.1 — cycle 1 review
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:9946:  - 위치: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:11`, `:39`, `:66`, `:273-286`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:9952:  - 위치: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:102-106`, `:345`, `:383`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:9955:  - 권장 patch: PSR-CASCADE-01을 acceptance precondition으로 격상해 코드 tree를 `(admin)/admin/[instanceSlug]/...`로 명시하고, redirect/sign-out/cleanup/API/site-meta-fetch 영향 범위와 회귀 시나리오를 포함.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:9958:  - 위치: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:159-174`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:9964:  - 위치: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:245-267`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:9970:  - 위치: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:115-132`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:9976:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:40`, `:145`, `:196`, `:316`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:9983:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:275-286`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:9989:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:289`, `:384`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:9992:  - 권장 patch: PSR-CASCADE-02에 v0.1 임시 canonical base 정의와 M0 도메인 전환 시 migration/redirect/entity-id stability note 추가.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:9995:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:236-243`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10001:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:219-227`, `:291-295`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10007:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:93`, `:104`, `:194`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10013:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:187-196`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10019:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:206-210`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10025:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:208`, `:324`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10031:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:120-129`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10037:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:138-145`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10043:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:326`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10045:  - 문제: Google Rich Results/schema.org validator 통과를 LOCAL_PASS 필수로 두면 외부 validator 의존 게이트가 된다.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10046:  - 권장 patch: LOCAL_PASS는 자체 rule checker/JSON parse/필수 entity 검증으로 두고 외부 validator는 manual QA marker로 낮춤.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10049:- **PSR-18**: scenario #1 통과 기준 문구 반대
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10050:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:309`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10055:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:198-202`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10060:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:202`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10065:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:132`, `:299-301`, `:351`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10070:- PSR-CASCADE-01: FAIL — marker는 있으나 실제 admin URL 코드 tree/redirect/API 영향이 acceptance precondition으로 충분히 구체화되지 않음.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10071:- PSR-CASCADE-02: FAIL — SCHEMA_MAPPING § 1.2 path-based `@id` marker 필요. 현재 SoT는 domain root pattern만 보유.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10072:- PSR-CASCADE-03: TBD — M0_BUILD_EXPORT_PLAN placeholder는 존재하지만 SSR component 재사용 marker는 아직 § 2에 없음.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10073:- PSR-CASCADE-04: FAIL — manifest는 현재 9단계 `orderedMigrations`이고 D0011 public reader 10번째 entry가 없음 (`manifest.ts:26-102`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10074:- PSR-CASCADE-05: TBD — pgbouncer userlist 추가 대상은 marker만 있고 실제 Spike A/userlist cascade 범위가 불명확.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10077:# PUBLIC_SITE_RENDER_PLAN v0.1 — cycle 1 review
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10086:  - 위치: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:11`, `:39`, `:66`, `:273-286`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10092:  - 위치: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:102-106`, `:345`, `:383`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10095:  - 권장 patch: PSR-CASCADE-01을 acceptance precondition으로 격상해 코드 tree를 `(admin)/admin/[instanceSlug]/...`로 명시하고, redirect/sign-out/cleanup/API/site-meta-fetch 영향 범위와 회귀 시나리오를 포함.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10098:  - 위치: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:159-174`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10104:  - 위치: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:245-267`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10110:  - 위치: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:115-132`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10116:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:40`, `:145`, `:196`, `:316`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10123:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:275-286`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10129:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:289`, `:384`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10132:  - 권장 patch: PSR-CASCADE-02에 v0.1 임시 canonical base 정의와 M0 도메인 전환 시 migration/redirect/entity-id stability note 추가.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10135:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:236-243`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10141:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:219-227`, `:291-295`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10147:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:93`, `:104`, `:194`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10153:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:187-196`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10159:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:206-210`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10165:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:208`, `:324`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10171:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:120-129`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10177:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:138-145`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10183:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:326`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10185:  - 문제: Google Rich Results/schema.org validator 통과를 LOCAL_PASS 필수로 두면 외부 validator 의존 게이트가 된다.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10186:  - 권장 patch: LOCAL_PASS는 자체 rule checker/JSON parse/필수 entity 검증으로 두고 외부 validator는 manual QA marker로 낮춤.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10189:- **PSR-18**: scenario #1 통과 기준 문구 반대
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10190:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:309`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10195:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:198-202`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10200:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:202`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10205:  - 위치: `PUBLIC_SITE_RENDER_PLAN.md:132`, `:299-301`, `:351`
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10210:- PSR-CASCADE-01: FAIL — marker는 있으나 실제 admin URL 코드 tree/redirect/API 영향이 acceptance precondition으로 충분히 구체화되지 않음.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10211:- PSR-CASCADE-02: FAIL — SCHEMA_MAPPING § 1.2 path-based `@id` marker 필요. 현재 SoT는 domain root pattern만 보유.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10212:- PSR-CASCADE-03: TBD — M0_BUILD_EXPORT_PLAN placeholder는 존재하지만 SSR component 재사용 marker는 아직 § 2에 없음.
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10213:- PSR-CASCADE-04: FAIL — manifest는 현재 9단계 `orderedMigrations`이고 D0011 public reader 10번째 entry가 없음 (`manifest.ts:26-102`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10214:- PSR-CASCADE-05: TBD — pgbouncer userlist 추가 대상은 marker만 있고 실제 Spike A/userlist cascade 범위가 불명확.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:14:You are reviewing **cycle 2** of the PUBLIC_SITE_RENDER code v1.0. Cycle 1 had **15 findings** (blocking=3, major=9, minor=3). All 15 were patched. `pnpm --filter @glitzy/web typecheck` now PASS.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:20:| PSRC-01 | blocking | ClinicProfileForm.tsx stale import | `@/app/(admin)/admin/[instanceSlug]/clinic-profile/actions` |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:21:| PSRC-02 | blocking | sanitize-html lockfile + transformTags 타입 | pnpm-lock.yaml 갱신 + `transformTags.a` 콜백 파라미터 타입 명시 |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:22:| PSRC-03 | blocking | withPublicTenantTransaction 타입 | `TransactionSql` callback param + `sql.begin<T \| null>` |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:23:| PSRC-04 | major | D0011 password 하드코딩 | `CREATE ROLE app_public_reader LOGIN` 만, password 는 환경별 provision |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:24:| PSRC-05 | major | JSON-LD MedicalClinic ref 미참조 + Article author inline 누락 | `webPageEntity` 안 `aboutClinic` 옵션 + `articleEntity` author inline `name/jobTitle/image`. P-003·P-004·P-005·P-006·P-010 graph 안 MedicalClinic 풀 entity 추가 (location 있을 때) |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:25:| PSRC-06 | major | rule checker cross-reference 약함 | `validateJsonLdGraph(graph, { siteBaseUrl })` — same-origin URL 은 graph entity 필수, 외부 origin 만 dereferenceable 예외 |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:26:| PSRC-07 | major | sitemap minimal 페이지 빈 상태 미포함 + lastmod | P-003/P-005 항상 포함 · `MAX(updated_at)` aggregate |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:27:| PSRC-08 | major | canonical URL request-aware absolute | `siteBaseUrl()` 호출 + `siteMetadata.ts` 안 absolute URL 생성 |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:28:| PSRC-09 | major | Host header spoof | env `PUBLIC_SITE_ORIGIN` 우선, 미지정 시 request host fallback |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:29:| PSRC-10 | major | layout-level loader 반복 호출 | `cache(loadSiteInitial)` — render pass 안 한 번 SELECT |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:30:| PSRC-11 | major | businessHours narrowing 약함 | opens/closes/from/to TIME_REGEX + ISO date regex strict |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:31:| PSRC-12 | major | Markdown 외부 링크 rel 누락 (protocol-relative) | `//evil.example` 도 외부 분류 |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:32:| PSRC-13 | minor | Home article teaser + location summary 누락 | Home 에 Articles + Contact 섹션 추가 |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:33:| PSRC-14 | minor | ContactPoint @id 상대 fragment | `${siteBaseUrl}/#contact-${id}` absolute |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:34:| PSRC-15 | minor | Legal route hostOrigin 하드코딩 | `siteBaseUrl(params.instanceSlug)` |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:50:3. PSR-CASCADE-01b 코드 cascade 완료 검증
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:52:5. 새 finding (PSRC-16+ 부터)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:57:# PUBLIC_SITE_RENDER code v1.0 — cycle 2 review
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:65:- PSRC-01 ~ PSRC-15 각각 PASS / FAIL / PARTIAL
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:67:## new blocking / major / minor (PSRC-16+)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:69:## acceptance precondition (PSR-CASCADE-01b) 점검
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:70:- PSR-CASCADE-01b: <PASS|FAIL|PARTIAL>
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:139:apps\spike-c-local\tsconfig.scenarios.json
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:159:apps\spike-d\tsconfig.scenarios.json
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:238:docs\decisions\PUBLIC_SITE_RENDER_PLAN.md
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:265:apps\spike-e\tsconfig.scenarios.json
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:274:apps\spike-c-local\src\scenarios\test-isolation.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:275:apps\spike-c-local\src\scenarios\test-content-type.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:276:apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:277:apps\spike-c-local\src\scenarios\provider-smoke.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:278:apps\spike-c-local\src\scenarios\invariant-runner.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:279:apps\spike-c-local\src\scenarios\test-method-confusion.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:280:apps\spike-c-local\src\scenarios\test-list-bucket.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:281:apps\spike-c-local\src\scenarios\test-range-request.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:282:apps\spike-c-local\src\scenarios\test-replay.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:299:apps\spike-d\src\scenarios\test-staging-apply.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:300:apps\spike-d\src\scenarios\test-forward-only-hotfix.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:301:apps\spike-d\src\scenarios\test-failure-rollback.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:302:apps\spike-d\src\scenarios\test-expand-contract.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:303:apps\spike-d\src\scenarios\test-drift-check.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:304:apps\spike-d\src\scenarios\test-dev-apply.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:305:apps\spike-d\src\scenarios\test-deploy-gate.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:306:apps\spike-d\src\scenarios\test-canonical-generation.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:307:apps\spike-d\src\scenarios\test-audit.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:308:apps\spike-d\src\scenarios\test-advisory-lock.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:313:apps\spike-b\src\scenarios\test-invariant-runner.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:314:apps\spike-b\src\scenarios\test-idempotency.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:315:apps\spike-b\src\scenarios\test-failure-injection.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:316:apps\spike-b\src\scenarios\test-basic-100.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:317:apps\spike-b\src\scenarios\provider-smoke.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:318:apps\spike-b\src\scenarios\test-retry-permanent.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:319:apps\spike-b\src\scenarios\test-no-cross-tenant.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:320:apps\spike-b\src\scenarios\test-rls-mismatch.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:321:apps\spike-b\src\scenarios\test-stale-reclaim.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:322:apps\spike-a\src\scenarios\test-nested-tx.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:323:apps\spike-a\src\scenarios\test-negative.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:324:apps\spike-a\src\scenarios\test-invariant-runner.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:325:apps\spike-a\src\scenarios\test-audit.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:326:apps\spike-a\src\scenarios\provider-smoke.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:327:apps\spike-a\src\scenarios\test-read.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:328:apps\spike-a\src\scenarios\test-pgbouncer-auth.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:329:apps\spike-a\src\scenarios\test-perf.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:330:apps\spike-a\src\scenarios\test-rollback.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:331:apps\spike-a\src\scenarios\test-write.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:375:apps\spike-e\src\scenarios\test-invariant.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:376:apps\spike-e\src\scenarios\test-invalid-instance-id.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:377:apps\spike-e\src\scenarios\test-inactive-user.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:378:apps\spike-e\src\scenarios\test-drizzle-adapter-smoke.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:379:apps\spike-e\src\scenarios\test-client-tampering.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:380:apps\spike-e\src\scenarios\test-action-eligibility.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:381:apps\spike-e\src\scenarios\provider-smoke.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:382:apps\spike-e\src\scenarios\test-rls-integration.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:383:apps\spike-e\src\scenarios\test-membership-removal.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:384:apps\spike-e\src\scenarios\test-magic-link-login.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:385:apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:386:apps\spike-e\src\scenarios\test-super-admin-switch.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:387:apps\spike-e\src\scenarios\test-session-refresh.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:388:apps\spike-e\src\scenarios\test-tenant-resolve-cross.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:389:apps\spike-e\src\scenarios\test-tenant-resolve-own.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:488:?? docs/decisions/PUBLIC_SITE_RENDER_PLAN.md
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:504:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.12|1\\.2|2\\.1|PSR-CASCADE|Scenario|시나리오|P-003|P-004|P-005|P-006|P-010|7\\.\" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md docs/ARCHITECTURE.md docs/core/SCHEMA_MAPPING.md docs/decisions/M0_BUILD_EXPORT_PLAN.md" in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:527:docs/decisions/M0_BUILD_EXPORT_PLAN.md:49:- 시나리오 LOCAL_PASS — 발행 트리거 → Git commit → 빌드 성공.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:528:docs/decisions/M0_BUILD_EXPORT_PLAN.md:51:### 2.1 PUBLIC_SITE_RENDER_PLAN SSR 컴포넌트 재사용 (PSR-CASCADE-03)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:530:docs/decisions/M0_BUILD_EXPORT_PLAN.md:65:본 § 2.1 은 `PUBLIC_SITE_RENDER_PLAN` 의 acceptance precondition cascade (PSR-CASCADE-03) — apps/worker 구현 시 별도 컴포넌트 작성 부담 없음. 본 plan v1.0 합류 시 § 2.1 상세화.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:543:docs/core/SCHEMA_MAPPING.md:68:#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:594:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:3:> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 cycle 5 회 closeableAfterPatch=true 확정. 누계 31 findings 전건 수용 · 수렴 추세 **21 → 7 → 2 → 1 → 0**. 5 PSR-CASCADE 모두 PASS (01a docs · 02 SCHEMA_MAPPING § 1.2 · 03 M0_BUILD_EXPORT_PLAN § 2.1 · 04 manifest D0011 · 05 pgbouncer userlist). 01b (apps/web 디렉토리 이동 + redirect/revalidate 변경) 는 별 **PUBLIC_SITE_RENDER code v1.0** cycle 분리 (LOCATION_LEGAL plan/code 분리 패턴 정합). ADMIN_UI_SKELETON code v1.0 + LOCATION_LEGAL code v1.0 acceptance 직후 진입하는 첫 공개 사이트 plan.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:595:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:5:> **acceptance commit 구성 (LL-33 패턴 정합)**: 본 commit 에 다음 cascade 동시 포함 — (1) PUBLIC_SITE_RENDER_PLAN.md v1.0 (본 문서) (2) PSR-CASCADE-01a docs/admin/ARCHITECTURE.md § 3.12 patch (3) PSR-CASCADE-02 docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based 표 + entity continuity 전환 룰 (4) PSR-CASCADE-03 docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 SSR 재사용 표 (5) PSR-CASCADE-04 packages/migrations-runner/src/manifest.ts D0011 entry (6) PSR-CASCADE-05 apps/spike-a/pgbouncer/userlist.txt 안 `app_public_reader` 추가. PSR-CASCADE-01b 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 의 acceptance commit 에서 별도 진행.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:596:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:15:- `docs/core/PAGE_TYPES.md` — 필수 14종 페이지 (P-001~P-014) · M0 게이트 #1 의 10페이지: **P-001·P-002·P-003·P-004·P-005·P-006·P-012·P-013·P-014 + P-010 1샘플** (cycle1 PSR-01 정정).
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:597:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:16:- `docs/core/SCHEMA_MAPPING.md` — 페이지별 graph 구성 (§ 2.5 공통 entity 출력 정책 + § 3 페이지 그래프 + § 1.2 `@id` 네이밍 규약).
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:598:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:18:- `docs/core/CONTENT_STANDARDS.md` v1.3 — answer-first AST · § 7.1.1.1 LegalDocument 면제.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:599:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:30:  - `apps/web/src/app/sign-in/...` (consume route — redirect target `/<firstSlug>` → `/admin/<firstSlug>` 로 patch · PSR-CASCADE-01)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:600:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:40:### 1.2 범위 (포함) — cycle1 PSR-01·02·06·11 정정
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:601:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:45:| **어드민 URL prefix `/admin/<instanceSlug>/...`** (cycle1 PSR-02 격상) | 공개 path namespace 와 분리. acceptance precondition. 코드 cascade (PSR-CASCADE-01) 동시 적용 |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:602:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:46:| **10페이지 minimal** (cycle1 PSR-01 정정) | P-001 `/` · P-002 `/about` · P-003 `/doctors` · P-004 `/doctors/[slug]` · P-005 `/treatments` · P-006 `/treatments/[slug]` · P-010 `/insights/[category]/[slug]` (1샘플) · P-012 `/contact` · P-013 `/legal/[type]` (5종) · P-014 `/locations/[slug]` (main 1건) |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:603:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:52:| Next metadata API + theme-color + og:type 매핑 (cycle1 PSR-10 정정) | title · description · canonical · OpenGraph · Twitter · robots · `themeColor` 2값 (light/dark) · og:type P-004 `profile`, P-006/P-010 `article`, 기타 `website` |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:604:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:82:### 2.1 route group 구조 (PSR-ROUTE-01) — cycle1 PSR-02·03 정정
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:605:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:96:│     │  ├─ page.tsx                     -- P-003 Doctors List
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:606:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:97:│     │  └─ [slug]/page.tsx              -- P-004 Doctor Profile
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:607:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:99:│     │  ├─ page.tsx                     -- P-005 Treatments List
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:608:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:100:│     │  └─ [slug]/page.tsx              -- P-006 Treatment Detail
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:609:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:103:│     │     └─ [slug]/page.tsx           -- P-010 Article Detail (1샘플 · category=general v0.1)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:610:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:111:├─ sign-in/...                           -- (변경: consume redirect target `/admin/<slug>` · PSR-CASCADE-01)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:611:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:126:  - 시나리오: 어드민 진입 시 `/admin/<slug>` 로 자동 redirect. 공개 site `/<slug>` 는 별 응답
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:612:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:219:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:613:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:327:| P-003 Doctors List | `<DoctorCard>` grid | DoctorProfile (active ORDER BY displayOrder ASC, id ASC) |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:614:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:328:| P-004 Doctor Profile | `<DoctorHero>` · `<ArticleBody markdown={doctor.bio}>` · `<RelatedTreatments>` · `<RelatedArticles>` | DoctorProfile + 본인 author Articles |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:615:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:329:| P-005 Treatments List | `<TreatmentCard>` grid | TreatmentPage (RLS 자동 published only ORDER BY publishedAt DESC) |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:616:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:330:| P-006 Treatment Detail | `<TreatmentHero>` · `<ArticleBody markdown={treatment.body_markdown}>` · `<TreatmentSummary>` · `<ContactCta>` | TreatmentPage |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:617:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:331:| P-010 Article Detail (1샘플) | `<ArticleHero>` (title·summary·publishedAt·author) · `<ArticleBody markdown={article.body_markdown}>` | Article + author Doctor |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:618:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:344:- LegalDocument 본문 (CONTENT_STANDARDS § 7.1.1.1 면제) 도 동일 컴포넌트 사용 — answer-first AST · 표현 검사 미적용은 어드민 저장 단계의 결정이지 렌더 단계와 무관.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:619:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:409:    type: <page-specific>,        // P-001/P-002/P-003/P-005/P-012/P-014 = "website" · P-004 = "profile" · P-006 = "article" · P-010 = "article" · P-013 = "website" (v0.1 미노출)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:620:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:428:- (PSR-SEO-02 · cycle1 PSR-10 + cycle2 PSR-23 정정) `themeColor` 2값 출처 — DESIGN_TOKENS § 6 `BrandTokens.colors.light.primary` / `BrandTokens.colors.dark.primary` (= `color.brand.primary` 의 light/dark 평면화 결과). 인스턴스별 brandTokens 미주입 단계 (v0.1) 는 DESIGN_TOKENS § 3.2 default `color.brand.primary` light = `blue.600` (#2563eb) / dark = `blue.400` (#60a5fa) fallback. SEARCH_STANDARDIZATION § 2.1 정합.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:621:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:429:- (PSR-SEO-03 · cycle1 PSR-10) `og:type` 매핑 — P-004 `profile` · P-006 `article` · P-010 `article` · 그 외 `website`.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:622:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:430:- (PSR-SEO-04) canonical v0.1: `https://<host>/<instanceSlug><path>` path-based. M0 v1.0 도메인 매핑 합류 시 entity continuity migration (PSR-CASCADE-02 참조).
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:623:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:444:| P-003 Doctors List | monthly | 0.7 |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:624:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:445:| P-004 Doctor Profile | monthly | 0.7 |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:625:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:446:| P-005 Treatments List | monthly | 0.8 |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:626:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:447:| P-006 Treatment Detail | monthly | 0.8 |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:627:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:448:| P-010 Article Detail | monthly | 0.5 |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:628:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:454:  - Article (P-010): `Article.dateModified` 우선. C-04 에 별도 `dateModified` 컬럼 없음 v0.1 — `published_at` 사용 (M1 cascade).
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:629:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:455:  - Treatment (P-006): C-03 명시 `dateModified` 없음 v0.1 — `published_at` fallback.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:630:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:550:| P-003 Doctors List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(Physician refs) |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:631:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:551:| P-004 Doctor Profile | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Physician` · `[풀] WebPage` · `[풀] BreadcrumbList` |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:632:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:552:| P-005 Treatments List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(MedicalProcedure refs) |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:633:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:553:| P-006 Treatment Detail | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] MedicalProcedure` · `[풀] WebPage` · `[풀] BreadcrumbList` |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:634:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:554:| P-010 Article Detail | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Article` · `[풀] WebPage` · `[풀] BreadcrumbList` |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:635:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:560:- (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:636:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:565:  - LOCAL_PASS 시나리오 18 의 통과 기준 = 자체 checker 통과
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:637:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:583:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:638:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:585:| 7 | `packages/migrations-runner/src/manifest.ts` v0.x — D0011 10단계 추가 (PSR-CASCADE-04) | acceptance precondition |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:639:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:588:| 10 | LOCATION_LEGAL code v1.1 cascade — admin URL 변경 (PSR-CASCADE-01) 의 revalidatePath 6 곳 patch | acceptance precondition |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:640:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:589:| 11 | ADMIN_UI_SKELETON code v1.1 cascade — sign-in/consume redirect `/admin/<slug>` (PSR-CASCADE-01) | acceptance precondition |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:641:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:592:## 7. § 8.1 시나리오 (LOCAL_PASS 검증) — cycle1 PSR-17·18 정정
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:642:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:594:| # | 시나리오 | 통과 기준 |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:643:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:602:| 7 | Article published 5건 → `/<instanceSlug>/insights/general/<slug>` 진입 가능 (1샘플) | P-010 단일 페이지 렌더 |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:644:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:610:| 15 | 어드민 측 도메인 (`/admin/<slug>/...`) 와 공개 도메인 (`/<slug>/...`) 충돌 없음 — PSR-CASCADE-01 정합 | 어드민 prefix `/admin` · 공개 prefix 없음. sign-in consume redirect `/admin/<firstSlug>` |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:645:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:617:| 22 | P-004 OG type = `profile` · P-006 OG type = `article` · P-010 OG type = `article` (cycle1 PSR-10) | meta `property="og:type"` 확인 |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:646:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:638:| 15 | **어드민 URL `/admin` prefix 격상 (PSR-CASCADE-01)** | apps/web/src/app/(admin)/admin/[instanceSlug]/ 디렉토리 이동 + revalidatePath 6 곳 + sign-in/consume redirect target + seed.ts |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:647:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:639:| 16 | docs/admin/ARCHITECTURE.md § 3 patch — `(site)` 신설 + `/admin` prefix (PSR-CASCADE-01) | doc |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:648:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:640:| 17 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` marker + entity continuity note (PSR-CASCADE-02) | doc |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:649:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:641:| 18 | docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2 patch — apps/worker 가 본 plan SSR 컴포넌트 재사용 marker (PSR-CASCADE-03) | doc |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:650:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:642:| 19 | packages/migrations-runner manifest 10단계 (D0011 추가 — PSR-CASCADE-04) | manifest.ts |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:651:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:643:| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05 · cycle2 PSR-27 경로 정정) | apps/spike-a/pgbouncer/userlist.txt |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:652:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:644:| 21 | 시나리오 1~23 LOCAL_PASS 검증 | apps/web/scripts/site-scenarios.ts |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:653:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:680:> **acceptance 순서 정합 (LL-33 패턴)**: PSR-CASCADE-01~05 는 plan v1.0 acceptance 와 **동시 또는 직전** 에 적용. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:654:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:682:- `PSR-CASCADE-01` (cycle1 PSR-02 격상 + cycle2 PSR-24 a/b 분리):
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:655:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:683:  - **PSR-CASCADE-01a (docs · plan acceptance commit 안 동반)**: `docs/admin/ARCHITECTURE.md` § 3 patch — `(site)` 신설 + `/admin` prefix 격상 marker.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:656:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:684:  - **PSR-CASCADE-01b (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEGAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · doctors · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/seed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance ≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 에서 별도 사이클 진행.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:657:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:685:- `PSR-CASCADE-02` (cycle1 PSR-08 보강): `docs/core/SCHEMA_MAPPING.md` § 1.2 patch — v0.1 임시 path-based `@id` 패턴 + 도메인 매핑 후 (M0 v1.0) entity @id 전환 시 redirect/301/`sameAs` 처리 룰 추가 marker.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:658:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:686:- `PSR-CASCADE-03`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 patch — apps/worker 의 build/export 시점에 본 plan SSR 컴포넌트 + JSON-LD 생성기 + sitemap/robots route handler 재사용 marker.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:659:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:687:- `PSR-CASCADE-04`: `packages/migrations-runner/src/manifest.ts` — D0011 10단계 추가 (현 9단계 → 10단계).
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:660:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:688:- `PSR-CASCADE-05` (cycle2 PSR-27 경로 정정): `apps/spike-a/pgbouncer/userlist.txt` — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade). 본 파일은 `apps/spike-a/docker-compose.yml` 의 pgbouncer 컨테이너에 mount 되는 정확 경로.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:661:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:695:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:662:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:696:| 2026-05-18 | **v1.0** | **Codex 비평 cycle 5 0 findings 확정 acceptance** — closeableAfterPatch=true. 수렴 추세 21 → 7 → 2 → 1 → 0. blocking 0 · major 0 · minor 0 잔존. 5 PSR-CASCADE 모두 PASS (01a · 02 · 03 · 04 · 05). 01b 는 별 code v1.0 cycle 분리. 누계 31 findings 전건 수용. acceptance commit 6 cascade 동시 포함 (LL-33 패턴 정합). |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:663:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:697:| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 1 minor finding 전건 수용 patch**: (PSR-31) § 5.3 SoT 요약 3줄 stale 정정 — § 3.1 4계열 명시 (A 일반검색 / B AI 검색 / C User-triggered / D 학습), § 3.2 enum `allow / disallowTraining / disallowAll / custom`, § 3.3 `allow` 시 `aiCrawlerLegalApproved: true` fail-gate. 5 PSR-CASCADE 모두 PASS. closeableAfterPatch=true 신호 + plan v1.0 acceptance commit 권고. 누계 cycle 1+2+3+4 = 31 findings 전건 수용. |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:664:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:698:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch**: (PSR-29) acceptance scenario #21 themeColor 기대값 stale 정정 — `BrandTokens.colors.light.primary` default `#2563eb` (light) / `#60a5fa` (dark). (PSR-30) robots.txt starter SoT line-by-line 정합 — 헤더/일반 룰/C 계열/meta-externalagent 코멘트 + Sitemap placeholder `{domain}` 통일 (SEARCH_STANDARDIZATION § 3.3 그대로). 추가 cascade 실 적용: docs/admin/ARCHITECTURE.md § 3.12 신설 (PSR-CASCADE-01a — apps/web route group `(admin)` + `(site)` 분리). apps/spike-a/pgbouncer/userlist.txt 에 `app_public_reader` 추가 (PSR-CASCADE-05). 누계 cycle 1+2+3 = 30 findings 전건 수용. 5 cascade 중 4 PASS, 01b 는 별 code v1.0 cycle. |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:665:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:699:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:701:apps/web/src/lib/json-ld\entities.ts:37:// PSRC-14 patch: ContactPoint @id 를 absolute pattern (`${siteBaseUrl}/#contact-...`) 으로 통일
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:727:apps/web/src/lib/json-ld\entities.ts:146:// PSRC-05 patch: WebPage 안 `about` 으로 MedicalClinic ref 를 명시 — graph 안 풀 entity 가 어떤 페이지에서 누구를 가리키는지 SCHEMA_MAPPING § 2.5 정합
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:754:apps/web/src/lib/json-ld\builders.ts:52:// PSRC-05 patch: graph 안 MedicalClinic 풀 entity 출력 (location 있을 때) — WebPage.about 으로 명시.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:821:apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:45:  const hostOrigin = siteBaseUrl(params.instanceSlug); // PSRC-15 patch
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:855:apps/web/.env.example:16:#   필수 grant (PUBLIC_SITE_RENDER_PLAN v1.0 § 3.1 PSR-DATA-01 / D0011_public_reader.sql):
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:864:packages/db/migrations/D0011_public_reader.sql:12:-- PSRC-04 patch: migration 안 password 하드코딩 금지. role/권한/policy 만 생성하고
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:884:packages/migrations-runner/src/manifest.ts:23: * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 + PUBLIC_SITE_RENDER_PLAN v0.x § 8/§ 10 의 D0011 (10단계 — PSR-25/PSR-CASCADE-04 patch).
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:885:packages/migrations-runner/src/manifest.ts:102:  // (10) app_public_reader role + per-table SELECT policy 7개 (PUBLIC_SITE_RENDER_PLAN v0.x · PSR-25 / PSR-CASCADE-04 patch)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:957:apps/web/src/lib\markdown.ts:140:  // PSRC-12 patch: protocol-relative `//evil.example/...` 도 외부 URL 로 분류 — single slash path 만 내부.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:968:apps/web/src/lib\public-tenant.ts:31:  // PSRC-03 patch: postgres-js begin() 안 callback 의 첫 인자 = TransactionSql.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:976:apps/web/src/lib\site-initial.ts:7:// PSRC-10 patch: React `cache()` 로 render pass 안 중복 SELECT 회피.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:982:apps/web/src/lib\site-url.ts:5:// PSRC-09 patch: Host/X-Forwarded headers 의 spoof 회피 — env `PUBLIC_SITE_ORIGIN` (또는 production deployment URL)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:989:apps/web/src/app/(site)\[instanceSlug]\robots.txt\route.ts:9:  // PSRC-09 patch: siteOrigin() 가 PUBLIC_SITE_ORIGIN env 우선 → Host spoof 회피
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:990:apps/web/src/lib\json-ld\entities.ts:37:// PSRC-14 patch: ContactPoint @id 를 absolute pattern (`${siteBaseUrl}/#contact-...`) 으로 통일
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:998:apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:17:  // PSRC-09 patch: siteOrigin() 가 PUBLIC_SITE_ORIGIN env 우선 → Host spoof 회피
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1006:apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:31:    // PSRC-07 patch: lastmod aggregate — list 페이지는 max(updated_at) 사용
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1055:apps/web/src/app/page.tsx:52:  // PSR-CASCADE-01b: 어드민 URL `/admin/<slug>/...` prefix 격상 (PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1069:apps/web/src/app/sign-in/consume/route.ts:177:  // 6) cookie set + redirect — PSR-CASCADE-01b: admin URL `/admin/<slug>` prefix 격상
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1162:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' | ForEach-Object { if("'$i -ge 540 -and $i -le 570){ '"'{0,4}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1164:   1: // @glitzy/web/lib/json-ld/__tests__/validate — 자체 JSON-LD rule checker (LOCAL_PASS)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1165:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-14 (cycle1 PSR-17 — 외부 validator manual QA)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1180:  17: // PSRC-06 patch: validate(graph, opts) — same-origin @id reference 는 graph entity 필수,
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1285: 560: - (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1287: 562: - (PSR-SEO-14 · cycle1 PSR-17) **자체 JSON-LD rule checker** (LOCAL_PASS 게이트): JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 검증. Google Rich Results Test / schema.org validator 는 manual QA marker (PSR-DEFER-14) — CI 게이트 X.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1290: 565:   - LOCAL_PASS 시나리오 18 의 통과 기준 = 자체 checker 통과
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1299:   2: // SoT: SCHEMA_MAPPING § 3 + PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-11
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1349:  52: // PSRC-05 patch: graph 안 MedicalClinic 풀 entity 출력 (location 있을 때) — WebPage.about 으로 명시.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1528:  37: // PSRC-14 patch: ContactPoint @id 를 absolute pattern (`${siteBaseUrl}/#contact-...`) 으로 통일
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1614: 123:   // PSRC-05 patch: author 는 graph 안 풀 Physician 미포함 페이지 (P-010 인) 경우 inline minimal 객체로 — name/image/jobTitle 포함
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1637: 146: // PSRC-05 patch: WebPage 안 `about` 으로 MedicalClinic ref 를 명시 — graph 안 풀 entity 가 어떤 페이지에서 누구를 가리키는지 SCHEMA_MAPPING § 2.5 정합
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1713:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-12 (v0.1 path-based · M0 도메인 매핑 PSR-CASCADE-02)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1715:   4: // PSRC-08 patch: canonical/OpenGraph URL 은 항상 absolute URL.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1716:   5: // PSRC-09 patch: Host/X-Forwarded headers 의 spoof 회피 — env `PUBLIC_SITE_ORIGIN` (또는 production deployment URL)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1728:  17:   // PSRC-09: production trusted origin 우선 — Host header spoof 회피
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1756:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.1 PSR-SEO-01·02·03·04·05·06
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1795:  41:   // PSRC-08 patch: canonical / OpenGraph URL 은 absolute (request-aware)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1943:   3: //      PUBLIC_SITE_RENDER_PLAN v1.0 § 5.2 PSR-SEO-07 (P-013 sitemap 제외)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1957:  17:   // PSRC-09 patch: siteOrigin() 가 PUBLIC_SITE_ORIGIN env 우선 → Host spoof 회피
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:1971:  31:     // PSRC-07 patch: lastmod aggregate — list 페이지는 max(updated_at) 사용
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:2001:  61:   // P-003 Doctors List — PSRC-07: 빈 상태도 항상 포함 (minimal 페이지)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:2007:  67:   // P-005 Treatments List — PSRC-07: 빈 상태도 항상 포함
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:2067:   3: //      PUBLIC_SITE_RENDER_PLAN v1.0 § 5.3 PSR-SEO-09 (cycle2 PSR-22 + cycle3 PSR-30 정합)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:2073:   9:   // PSRC-09 patch: siteOrigin() 가 PUBLIC_SITE_ORIGIN env 우선 → Host spoof 회피
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:2155:   2: -- SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.1 PSR-DATA-01 + PSR-25 + PSR-15
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:2165:  12: -- PSRC-04 patch: migration 안 password 하드코딩 금지. role/권한/policy 만 생성하고
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:2236:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.1 PSR-DATA-03 + § 6 작업 #4
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:2265:  31:   // PSRC-03 patch: postgres-js begin() 안 callback 의 첫 인자 = TransactionSql.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:2335: 140:   // PSRC-12 patch: protocol-relative `//evil.example/...` 도 외부 URL 로 분류 — single slash path 만 내부.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:2381: 223: // PSRC-11 patch: opening/reception 은 `dayOfWeek: string[]` + `opens: HH:mm` + `closes: HH:mm` 강제
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:2430:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-04 + § 6 작업 #6
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:2435:   7: // PSRC-10 patch: React `cache()` 로 render pass 안 중복 SELECT 회피.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:2491:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-01·02 (cycle1 PSR-03 정합 — root layout 만 <html>/<body>)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:2520:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.4 PSR-COMP-09 + § 6 작업 #9
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:2657:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.2 PSR-DATA-07 + § 4.3 + PSR-DEFER-13 (= LL-DEFER-01 alias)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:2700:  45:   const hostOrigin = siteBaseUrl(params.instanceSlug); // PSRC-15 patch
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:2903:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1 (Article URL `/insights/[category]/[slug]` · v0.1 fallback `general`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3108:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.12|\\(site\\)|/admin|PUBLIC_SITE_RENDER|PSR-CASCADE\" docs/admin/ARCHITECTURE.md docs/core/SCHEMA_MAPPING.md docs/decisions/M0_BUILD_EXPORT_PLAN.md" in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3120:docs/decisions/M0_BUILD_EXPORT_PLAN.md:51:### 2.1 PUBLIC_SITE_RENDER_PLAN SSR 컴포넌트 재사용 (PSR-CASCADE-03)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3121:docs/decisions/M0_BUILD_EXPORT_PLAN.md:53:`PUBLIC_SITE_RENDER_PLAN.md` v0.x 가 apps/web 안 `(site)` route group · SSR + Next ISR 로 먼저 공개 페이지를 렌더한다 (Phase 0). 본 M0 v1.0 본 구현 시점에 같은 컴포넌트 트리를 정적 build/export 로 재사용한다:
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3124:docs/decisions/M0_BUILD_EXPORT_PLAN.md:65:본 § 2.1 은 `PUBLIC_SITE_RENDER_PLAN` 의 acceptance precondition cascade (PSR-CASCADE-03) — apps/worker 구현 시 별도 컴포넌트 작성 부담 없음. 본 plan v1.0 합류 시 § 2.1 상세화.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3125:docs/core/SCHEMA_MAPPING.md:68:#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3126:docs/core/SCHEMA_MAPPING.md:70:`PUBLIC_SITE_RENDER_PLAN.md` v0.x § 5.4 PSR-SEO-12 의 SSR + path-based routing 단계 (Phase 0) 에서는 도메인 매핑 (subdomain/custom domain) 합류 전이므로 **임시로 instanceSlug 가 path 에 들어간 `@id` 패턴** 을 사용한다:
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3127:docs/admin/ARCHITECTURE.md:280:### 3.12 apps/web route group 구조 (PSR-CASCADE-01a · PUBLIC_SITE_RENDER_PLAN v0.x)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3128:docs/admin/ARCHITECTURE.md:282:Phase 0 단계 `apps/web` 안 어드민 + 공개 사이트 두 영역을 같은 Next.js 앱 안 route group 으로 분리한다. PUBLIC_SITE_RENDER_PLAN v0.x § 2.1 의 acceptance precondition cascade.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3129:docs/admin/ARCHITECTURE.md:286:| `(admin)` | `/admin/<instanceSlug>/...` | 운영자 어드민 — ClinicProfile · DoctorProfile · TreatmentPage · Article · LegalDocument 입력/편집 | ADMIN_UI_SKELETON code v1.0 합류 (현재 `/<instanceSlug>/...` → `/admin/<instanceSlug>/...` 격상 cascade는 PUBLIC_SITE_RENDER code v1.0 cycle 안 동반 — PSR-CASCADE-01b) |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3130:docs/admin/ARCHITECTURE.md:287:| `(site)` | `/<instanceSlug>/...` | 공개 사이트 — Home · About · Doctors · Treatments · Insights (1샘플) · Contact · Locations · Legal (v0.x 차단) | PUBLIC_SITE_RENDER code v1.0 합류 (M0 게이트 #1 사이트 측 페이지 빌드 가능 단계) |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3175:apps/web/src/app/sign-in/consume/route.ts:177:  // 6) cookie set + redirect — PSR-CASCADE-01b: admin URL `/admin/<slug>` prefix 격상
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3177:apps/web/src/app/page.tsx:52:  // PSR-CASCADE-01b: 어드민 URL `/admin/<slug>/...` prefix 격상 (PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3186:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' | ForEach-Object { if("'$i -ge 592 -and $i -le 620){ '"'{0,4}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3188: 592: ## 7. § 8.1 시나리오 (LOCAL_PASS 검증) — cycle1 PSR-17·18 정정
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3206: 610: | 15 | 어드민 측 도메인 (`/admin/<slug>/...`) 와 공개 도메인 (`/<slug>/...`) 충돌 없음 — PSR-CASCADE-01 정합 | 어드민 prefix `/admin` · 공개 prefix 없음. sign-in consume redirect `/admin/<firstSlug>` |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3207: 611: | 16 | dark mode CSS vars 출력 (UI toggle 미지원) | `[data-theme="dark"]` 블록 안 22개 토큰 모두 dark 값 정의 — 자체 rule checker (LOCAL_PASS) · UI toggle 은 marker 만 |
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3240:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-03 (cycle2 PSR-26: 법적 페이지 링크 v0.1 단계 숨김 — broken link 회피)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3289:   2: // SoT: LL-SCHEMA-16 CT-02 + PUBLIC_SITE_RENDER_PLAN v1.0 § 4.3 PSR-COMP-08
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3351:# PUBLIC_SITE_RENDER code v1.0 — cycle 2 review
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3360:- PSRC-01: PASS — `ClinicProfileForm` 타입 import가 `/admin/[instanceSlug]` 경로로 갱신됨 (`apps/web/src/components/forms/ClinicProfileForm.tsx:14`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3361:- PSRC-02: PASS — `sanitize-html` 의존성/타입 존재, `transformTags.a` 콜백 타입 명시 (`apps/web/package.json`, `apps/web/src/lib/markdown.ts:44-61`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3362:- PSRC-03: PASS — `TransactionSql` + `sql.begin<T | null>` 반영 (`apps/web/src/lib/public-tenant.ts:11`, `apps/web/src/lib/public-tenant.ts:33`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3363:- PSRC-04: PASS — D0011 migration 안 password 하드코딩 제거 (`packages/db/migrations/D0011_public_reader.sql:12-15`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3364:- PSRC-05: PARTIAL — Article author inline은 반영됐지만, P-003/P-004/P-005/P-010에 `MedicalClinic` 풀 entity를 출력해 plan SoT의 `[참조] MedicalClinic`과 충돌함. PSRC-17 참조.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3365:- PSRC-06: PARTIAL — same-origin singleton ref 검사는 추가됐지만 현재 그래프 자체가 `#website` unresolved로 실패하고, inline `@id` ref는 여전히 검사하지 않음. PSRC-16/18 참조.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3366:- PSRC-07: PASS — P-003/P-005 빈 목록 sitemap 포함 + list `MAX(updated_at)` 반영 (`sitemap.xml/route.ts:31-39`, `:61-68`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3367:- PSRC-08: PASS — metadata canonical/OG URL absolute 처리 (`apps/web/src/lib/site-metadata.ts:41-54`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3368:- PSRC-09: PASS — `PUBLIC_SITE_ORIGIN` 우선, fallback은 request host (`apps/web/src/lib/site-url.ts:16-26`, `:32-40`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3369:- PSRC-10: PASS — `loadSiteInitial = cache(...)` 반영 (`apps/web/src/lib/site-initial.ts:28`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3370:- PSRC-11: PASS — `TIME_REGEX`, ISO date regex narrowing 반영 (`apps/web/src/lib/db-projection.ts:223-252`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3371:- PSRC-12: PASS — protocol-relative 외부 링크 처리 (`apps/web/src/lib/markdown.ts:139-147`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3372:- PSRC-13: PASS — Home에 Article teaser + Contact 섹션 존재 (`apps/web/src/app/(site)/[instanceSlug]/page.tsx:125-134` 등)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3373:- PSRC-14: PASS — ContactPoint `@id` absolute (`apps/web/src/lib/json-ld/entities.ts:37-44`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3374:- PSRC-15: PASS — Legal route `siteBaseUrl(params.instanceSlug)` 사용 (`apps/web/src/app/(site)/[instanceSlug]/legal/[type]/page.tsx:44-57`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3376:## new blocking / major / minor (PSRC-16+)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3378:### PSRC-16 [blocking] JSON-LD rule checker가 P-002+ 대부분 페이지에서 unresolved `#website`로 실패
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3381:따라서 P-002/P-003/P-004/P-005/P-006/P-010/P-012/P-014의 JSON-LD checker는 `#website` 참조를 unresolved로 봅니다. plan §7 scenario #18의 통과 기준이 “자체 JSON-LD rule checker 통과”이므로 acceptance gate 실패입니다 (`docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:613`).
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3385:### PSRC-17 [major] P-003/P-004/P-005/P-010 `MedicalClinic` 출력 정책이 plan SoT와 불일치
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3386:plan SoT는 P-003, P-004, P-005, P-010을 `[참조] MedicalClinic`로 정의합니다 (`docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:550-554`). 현재 builders는 해당 페이지들에 location이 있으면 `medicalClinicEntity` 풀 entity를 graph에 넣습니다:
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3392:이건 scenario #10의 “P-001~P-014 별 entity 풀/참조 정합”을 깨뜨립니다 (`docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:605`). 코드 주석도 “SCHEMA_MAPPING cascade marker”라고 되어 있어 코드가 plan acceptance SoT를 따라가지 않고 별도 future cascade를 전제합니다 (`apps/web/src/lib/json-ld/builders.ts:51-54`).
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3394:### PSRC-18 [major] cross-reference checker가 inline `@id` 참조를 여전히 놓침
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3397:PSRC-06 patch summary의 “same-origin URL은 graph entity 필수” 기준으로는 PARTIAL입니다. 반대로 inline minimal ref를 허용하려는 정책이라면 checker 주석/plan 문구를 바꿔야 합니다. 지금은 검증 규칙이 구현 의도를 정확히 표현하지 못합니다.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3399:## scenario 1~23 통과 여부 추론
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3400:- FAIL: #10, #18 — 위 PSRC-16/17 때문에 JSON-LD graph entity 정합 및 checker 통과 불가.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3401:- PASS 추정: #1~9, #11~17, #19~23 — RLS/route/sitemap/robots/metadata/admin-prefix/typecheck 관점에서 코드상 큰 차단은 보이지 않음. 단 실제 DB fixture 기반 LOCAL_PASS 스크립트는 별도 실행되지 않았습니다.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3403:## acceptance precondition (PSR-CASCADE-01b) 점검
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3404:- PSR-CASCADE-01b: PASS
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3408:# PUBLIC_SITE_RENDER code v1.0 — cycle 2 review
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3417:- PSRC-01: PASS — `ClinicProfileForm` 타입 import가 `/admin/[instanceSlug]` 경로로 갱신됨 (`apps/web/src/components/forms/ClinicProfileForm.tsx:14`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3418:- PSRC-02: PASS — `sanitize-html` 의존성/타입 존재, `transformTags.a` 콜백 타입 명시 (`apps/web/package.json`, `apps/web/src/lib/markdown.ts:44-61`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3419:- PSRC-03: PASS — `TransactionSql` + `sql.begin<T | null>` 반영 (`apps/web/src/lib/public-tenant.ts:11`, `apps/web/src/lib/public-tenant.ts:33`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3420:- PSRC-04: PASS — D0011 migration 안 password 하드코딩 제거 (`packages/db/migrations/D0011_public_reader.sql:12-15`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3421:- PSRC-05: PARTIAL — Article author inline은 반영됐지만, P-003/P-004/P-005/P-010에 `MedicalClinic` 풀 entity를 출력해 plan SoT의 `[참조] MedicalClinic`과 충돌함. PSRC-17 참조.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3422:- PSRC-06: PARTIAL — same-origin singleton ref 검사는 추가됐지만 현재 그래프 자체가 `#website` unresolved로 실패하고, inline `@id` ref는 여전히 검사하지 않음. PSRC-16/18 참조.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3423:- PSRC-07: PASS — P-003/P-005 빈 목록 sitemap 포함 + list `MAX(updated_at)` 반영 (`sitemap.xml/route.ts:31-39`, `:61-68`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3424:- PSRC-08: PASS — metadata canonical/OG URL absolute 처리 (`apps/web/src/lib/site-metadata.ts:41-54`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3425:- PSRC-09: PASS — `PUBLIC_SITE_ORIGIN` 우선, fallback은 request host (`apps/web/src/lib/site-url.ts:16-26`, `:32-40`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3426:- PSRC-10: PASS — `loadSiteInitial = cache(...)` 반영 (`apps/web/src/lib/site-initial.ts:28`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3427:- PSRC-11: PASS — `TIME_REGEX`, ISO date regex narrowing 반영 (`apps/web/src/lib/db-projection.ts:223-252`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3428:- PSRC-12: PASS — protocol-relative 외부 링크 처리 (`apps/web/src/lib/markdown.ts:139-147`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3429:- PSRC-13: PASS — Home에 Article teaser + Contact 섹션 존재 (`apps/web/src/app/(site)/[instanceSlug]/page.tsx:125-134` 등)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3430:- PSRC-14: PASS — ContactPoint `@id` absolute (`apps/web/src/lib/json-ld/entities.ts:37-44`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3431:- PSRC-15: PASS — Legal route `siteBaseUrl(params.instanceSlug)` 사용 (`apps/web/src/app/(site)/[instanceSlug]/legal/[type]/page.tsx:44-57`)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3433:## new blocking / major / minor (PSRC-16+)
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3435:### PSRC-16 [blocking] JSON-LD rule checker가 P-002+ 대부분 페이지에서 unresolved `#website`로 실패
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3438:따라서 P-002/P-003/P-004/P-005/P-006/P-010/P-012/P-014의 JSON-LD checker는 `#website` 참조를 unresolved로 봅니다. plan §7 scenario #18의 통과 기준이 “자체 JSON-LD rule checker 통과”이므로 acceptance gate 실패입니다 (`docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:613`).
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3442:### PSRC-17 [major] P-003/P-004/P-005/P-010 `MedicalClinic` 출력 정책이 plan SoT와 불일치
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3443:plan SoT는 P-003, P-004, P-005, P-010을 `[참조] MedicalClinic`로 정의합니다 (`docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:550-554`). 현재 builders는 해당 페이지들에 location이 있으면 `medicalClinicEntity` 풀 entity를 graph에 넣습니다:
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3449:이건 scenario #10의 “P-001~P-014 별 entity 풀/참조 정합”을 깨뜨립니다 (`docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:605`). 코드 주석도 “SCHEMA_MAPPING cascade marker”라고 되어 있어 코드가 plan acceptance SoT를 따라가지 않고 별도 future cascade를 전제합니다 (`apps/web/src/lib/json-ld/builders.ts:51-54`).
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3451:### PSRC-18 [major] cross-reference checker가 inline `@id` 참조를 여전히 놓침
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3454:PSRC-06 patch summary의 “same-origin URL은 graph entity 필수” 기준으로는 PARTIAL입니다. 반대로 inline minimal ref를 허용하려는 정책이라면 checker 주석/plan 문구를 바꿔야 합니다. 지금은 검증 규칙이 구현 의도를 정확히 표현하지 못합니다.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3456:## scenario 1~23 통과 여부 추론
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3457:- FAIL: #10, #18 — 위 PSRC-16/17 때문에 JSON-LD graph entity 정합 및 checker 통과 불가.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3458:- PASS 추정: #1~9, #11~17, #19~23 — RLS/route/sitemap/robots/metadata/admin-prefix/typecheck 관점에서 코드상 큰 차단은 보이지 않음. 단 실제 DB fixture 기반 LOCAL_PASS 스크립트는 별도 실행되지 않았습니다.
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3460:## acceptance precondition (PSR-CASCADE-01b) 점검
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md:3461:- PSR-CASCADE-01b: PASS
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:14:You are reviewing **cycle 3** of the PUBLIC_SITE_RENDER code v1.0. Cycle 2 had **3 findings** (blocking=1, major=2). All 3 patched. `pnpm --filter @glitzy/web typecheck` PASS.
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:20:| PSRC-16 | blocking | rule checker가 `#website` unresolved 로 실패 | cross-page reference allowlist (`#organization`/`#website`/`#clinic`) — same-origin URL + 등록된 fragment 는 graph entity 미존재 OK |
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:21:| PSRC-17 | major | P-003/004/005/010 MedicalClinic 풀 entity가 plan SoT(`[참조]`) 와 충돌 | builders 의 cycle 1 PSR-05 patch 일부 revert — 풀 entity 출력 제거, webPageEntity `aboutClinic` 옵션 제거. P-006 만 풀 entity 유지 (SCHEMA_MAPPING § 2.5 정합) |
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:22:| PSRC-18 | major | inline `@id` 참조도 검사 안 됨 | rule checker — `@type` 있는 객체 = self-contained inline (검사 제외, recurse 만). pure ref (`@id` 만) 만 same-origin 검사 |
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:36:   - PSRC-17 revert 가 SCHEMA_MAPPING § 2.5 표 (P-003/4/5/10 = `[참조]` MedicalClinic) 정합
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:39:3. scenario 1~23 통과 추론 (특히 #10 entity 풀/참조 + #18 자체 rule checker)
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:40:4. 새 finding (PSRC-19+)
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:45:# PUBLIC_SITE_RENDER code v1.0 — cycle 3 review
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:53:- PSRC-16: PASS|FAIL|PARTIAL
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:54:- PSRC-17: PASS|FAIL|PARTIAL
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:55:- PSRC-18: PASS|FAIL|PARTIAL
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:57:## new findings (PSRC-19+)
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:59:## acceptance precondition (PSR-CASCADE-01b)
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:60:- PSR-CASCADE-01b: <PASS|FAIL>
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:107:apps/web/src/lib/json-ld\builders.ts:52:// PSRC-17 patch: plan SoT (SCHEMA_MAPPING § 2.5 + PUBLIC_SITE_RENDER § 5.4) 정합 — `[참조] MedicalClinic` only.
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:110:apps/web/src/lib/json-ld\builders.ts:134:// PSRC-17 patch: P-010 도 `[참조] MedicalClinic` only — graph 안 풀 entity 출력 안 함.
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:113:apps/web/src/lib/json-ld\entities.ts:37:// PSRC-14 patch: ContactPoint @id 를 absolute pattern (`${siteBaseUrl}/#contact-...`) 으로 통일
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:126:apps/web/src/lib/json-ld\entities.ts:147://   `isPartOf` 의 WebSite 참조는 cross-page reference allowlist 대상 (PSRC-16 patch).
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:134:apps/web/src/lib/json-ld\types.ts:2:// SoT: SCHEMA_MAPPING § 1.2 @id 네이밍 + § 2.5 공통 entity 출력 정책 + PUBLIC_SITE_RENDER_PLAN § 5.4
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:136:apps/web/src/lib/json-ld\__tests__\validate.ts:1:// @glitzy/web/lib/json-ld/__tests__/validate — 자체 JSON-LD rule checker (LOCAL_PASS)
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:150:apps/web/src/lib/json-ld\__tests__\validate.ts:71:  //   PSRC-16 patch: cross-page reference allowlist (`#organization`/`#website`/`#clinic`) 는 graph entity 미존재 OK.
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:239:?? docs/decisions/PUBLIC_SITE_RENDER_PLAN.md
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:297:// PSRC-14 patch: ContactPoint @id 를 absolute pattern (`${siteBaseUrl}/#contact-...`) 으로 통일
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:383:  // PSRC-05 patch: author 는 graph 안 풀 Physician 미포함 페이지 (P-010 인) 경우 inline minimal 객체로 — name/image/jobTitle 포함
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:406:// PSRC-17 patch: SCHEMA_MAPPING § 2.5 정합 — `about` 옵션 제거 (참조만 페이지에서 dangling ref 회피).
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:407://   `isPartOf` 의 WebSite 참조는 cross-page reference allowlist 대상 (PSRC-16 patch).
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:469:// @glitzy/web/lib/json-ld/__tests__/validate — 자체 JSON-LD rule checker (LOCAL_PASS)
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:470:// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-14 (cycle1 PSR-17 — 외부 validator manual QA)
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:485:// PSRC-06 / PSRC-16 / PSRC-18 patch:
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:489://      SCHEMA_MAPPING § 2.5 "참조만" 페이지의 cross-page ref 패턴 (PSRC-16 patch).
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:538:  //   PSRC-18 patch: `@type` 존재 시 inline minimal entity 로 간주 (검사 제외, recurse 만).
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:539:  //   PSRC-16 patch: cross-page reference allowlist (`#organization`/`#website`/`#clinic`) 는 graph entity 미존재 OK.
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:593:// SoT: SCHEMA_MAPPING § 3 + PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-11
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:643:// PSRC-17 patch: plan SoT (SCHEMA_MAPPING § 2.5 + PUBLIC_SITE_RENDER § 5.4) 정합 — `[참조] MedicalClinic` only.
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:645://   rule checker 의 cross-page allowlist 로 통과 (PSRC-16 patch).
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:725:// PSRC-17 patch: P-010 도 `[참조] MedicalClinic` only — graph 안 풀 entity 출력 안 함.
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:1747:// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1 (Article URL `/insights/[category]/[slug]` · v0.1 fallback `general`)
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:1986:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "scenario|PSR-CASCADE|PUBLIC_SITE_RENDER|LOCAL_PASS|PSRC" handoff docs apps/web/src/lib/json-ld -g "*.md" -g "*.ts"' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:1989:// SoT: SCHEMA_MAPPING § 1.2 @id 네이밍 + § 2.5 공통 entity 출력 정책 + PUBLIC_SITE_RENDER_PLAN § 5.4
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:2003:  /** v0.1 path-based — `https://<host>/<instanceSlug>` (M0 도메인 매핑 합류 시 `https://<customDomain>` cascade · PSR-CASCADE-02) */
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:2017:apps/web\src\lib\json-ld\builders.ts:52:// PSRC-17 patch: plan SoT (SCHEMA_MAPPING § 2.5 + PUBLIC_SITE_RENDER § 5.4) 정합 — `[참조] MedicalClinic` only.
handoff\codex-reviews\public-site-render-code-v1\cycle-3.out.md:2021:apps/web\src\lib\json-ld\builders.ts:134:// PSRC-17 patch: P-010 도 `[참조] MedicalClinic` only — graph 안 풀 entity 출력 안 함.
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:14:You are reviewing the **code implementation** of `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 (acceptance · 5 cycle · 31 findings 전건 처리). This is **cycle 1** of the code review. Produce a strict, broad critique on whether the code faithfully realizes every plan decision (PSR-ROUTE / PSR-DATA / PSR-COMP / PSR-SEO / PSR-DEFER / PSR-CASCADE) and is correct/secure/atomic/accessible.
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:18:1. `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 — plan SoT
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:29:### PSR-CASCADE-01b (admin URL `/admin` prefix 격상)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:94:- PSR-CASCADE-01b: admin URL `/admin` prefix · revalidatePath 6 곳 · sign-in/consume redirect target · seed.ts
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:128:- ARCHITECTURE.md § 3.12 (PSR-CASCADE-01a)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:133:- 가능한 한 scenario 별 통과 여부 추론 (테스트 코드 없음 — 코드 베이스로 추론)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:138:# PUBLIC_SITE_RENDER code v1.0 — cycle 1 review
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:146:- **PSRC-01**: <짧은 제목>
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:155:## acceptance precondition (PSR-CASCADE-01b) 점검
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:156:- PSR-CASCADE-01b: <PASS|FAIL|PARTIAL>
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:168:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "PSR-|CASCADE|Phase|themeColor|sitemap|robots|JSON-LD|revalidatePath|seed|scenario|Scenario|§ 7|PUBLIC_SITE_RENDER" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:172:3:> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 cycle 5 회 closeableAfterPatch=true 확정. 누계 31 findings 전건 수용 · 수렴 추세 **21 → 7 → 2 → 1 → 0**. 5 PSR-CASCADE 모두 PASS (01a docs · 02 SCHEMA_MAPPING § 1.2 · 03 M0_BUILD_EXPORT_PLAN § 2.1 · 04 manifest D0011 · 05 pgbouncer userlist). 01b (apps/web 디렉토리 이동 + redirect/revalidate 변경) 는 별 **PUBLIC_SITE_RENDER code v1.0** cycle 분리 (LOCATION_LEGAL plan/code 분리 패턴 정합). ADMIN_UI_SKELETON code v1.0 + LOCATION_LEGAL code v1.0 acceptance 직후 진입하는 첫 공개 사이트 plan.
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:173:5:> **acceptance commit 구성 (LL-33 패턴 정합)**: 본 commit 에 다음 cascade 동시 포함 — (1) PUBLIC_SITE_RENDER_PLAN.md v1.0 (본 문서) (2) PSR-CASCADE-01a docs/admin/ARCHITECTURE.md § 3.12 patch (3) PSR-CASCADE-02 docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based 표 + entity continuity 전환 룰 (4) PSR-CASCADE-03 docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 SSR 재사용 표 (5) PSR-CASCADE-04 packages/migrations-runner/src/manifest.ts D0011 entry (6) PSR-CASCADE-05 apps/spike-a/pgbouncer/userlist.txt 안 `app_public_reader` 추가. PSR-CASCADE-01b 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 의 acceptance commit 에서 별도 진행.
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:180:30:  - `apps/web/src/app/sign-in/...` (consume route — redirect target `/<firstSlug>` → `/admin/<firstSlug>` 로 patch · PSR-CASCADE-01)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:184:45:| **어드민 URL prefix `/admin/<instanceSlug>/...`** (cycle1 PSR-02 격상) | 공개 path namespace 와 분리. acceptance precondition. 코드 cascade (PSR-CASCADE-01) 동시 적용 |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:207:77:| Google Rich Results Test / schema.org validator 자동 게이트 | manual QA marker · LOCAL_PASS 는 자체 rule checker (cycle1 PSR-17) | PSR-DEFER-14 |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:214:111:├─ sign-in/...                           -- (변경: consume redirect target `/admin/<slug>` · PSR-CASCADE-01)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:229:219:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:260:430:- (PSR-SEO-04) canonical v0.1: `https://<host>/<instanceSlug><path>` path-based. M0 v1.0 도메인 매핑 합류 시 entity continuity migration (PSR-CASCADE-02 참조).
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:279:560:- (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:281:562:- (PSR-SEO-14 · cycle1 PSR-17) **자체 JSON-LD rule checker** (LOCAL_PASS 게이트): JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 검증. Google Rich Results Test / schema.org validator 는 manual QA marker (PSR-DEFER-14) — CI 게이트 X.
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:286:583:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:288:585:| 7 | `packages/migrations-runner/src/manifest.ts` v0.x — D0011 10단계 추가 (PSR-CASCADE-04) | acceptance precondition |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:289:588:| 10 | LOCATION_LEGAL code v1.1 cascade — admin URL 변경 (PSR-CASCADE-01) 의 revalidatePath 6 곳 patch | acceptance precondition |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:290:589:| 11 | ADMIN_UI_SKELETON code v1.1 cascade — sign-in/consume redirect `/admin/<slug>` (PSR-CASCADE-01) | acceptance precondition |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:291:590:| 12 | apps/web seed scenario 도 admin URL 변경 정합 (`apps/web/src/seed.ts`) | acceptance precondition |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:292:592:## 7. § 8.1 시나리오 (LOCAL_PASS 검증) — cycle1 PSR-17·18 정정
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:297:610:| 15 | 어드민 측 도메인 (`/admin/<slug>/...`) 와 공개 도메인 (`/<slug>/...`) 충돌 없음 — PSR-CASCADE-01 정합 | 어드민 prefix `/admin` · 공개 prefix 없음. sign-in consume redirect `/admin/<firstSlug>` |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:306:634:| 11 | 자체 JSON-LD rule checker (LOCAL_PASS) | apps/web/src/lib/json-ld/__tests__/validate.ts |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:309:638:| 15 | **어드민 URL `/admin` prefix 격상 (PSR-CASCADE-01)** | apps/web/src/app/(admin)/admin/[instanceSlug]/ 디렉토리 이동 + revalidatePath 6 곳 + sign-in/consume redirect target + seed.ts |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:310:639:| 16 | docs/admin/ARCHITECTURE.md § 3 patch — `(site)` 신설 + `/admin` prefix (PSR-CASCADE-01) | doc |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:311:640:| 17 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` marker + entity continuity note (PSR-CASCADE-02) | doc |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:312:641:| 18 | docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2 patch — apps/worker 가 본 plan SSR 컴포넌트 재사용 marker (PSR-CASCADE-03) | doc |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:313:642:| 19 | packages/migrations-runner manifest 10단계 (D0011 추가 — PSR-CASCADE-04) | manifest.ts |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:314:643:| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05 · cycle2 PSR-27 경로 정정) | apps/spike-a/pgbouncer/userlist.txt |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:315:644:| 21 | 시나리오 1~23 LOCAL_PASS 검증 | apps/web/scripts/site-scenarios.ts |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:333:680:> **acceptance 순서 정합 (LL-33 패턴)**: PSR-CASCADE-01~05 는 plan v1.0 acceptance 와 **동시 또는 직전** 에 적용. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:334:682:- `PSR-CASCADE-01` (cycle1 PSR-02 격상 + cycle2 PSR-24 a/b 분리):
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:335:683:  - **PSR-CASCADE-01a (docs · plan acceptance commit 안 동반)**: `docs/admin/ARCHITECTURE.md` § 3 patch — `(site)` 신설 + `/admin` prefix 격상 marker.
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:336:684:  - **PSR-CASCADE-01b (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEGAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · doctors · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/seed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance ≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 에서 별도 사이클 진행.
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:337:685:- `PSR-CASCADE-02` (cycle1 PSR-08 보강): `docs/core/SCHEMA_MAPPING.md` § 1.2 patch — v0.1 임시 path-based `@id` 패턴 + 도메인 매핑 후 (M0 v1.0) entity @id 전환 시 redirect/301/`sameAs` 처리 룰 추가 marker.
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:338:686:- `PSR-CASCADE-03`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 patch — apps/worker 의 build/export 시점에 본 plan SSR 컴포넌트 + JSON-LD 생성기 + sitemap/robots route handler 재사용 marker.
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:339:687:- `PSR-CASCADE-04`: `packages/migrations-runner/src/manifest.ts` — D0011 10단계 추가 (현 9단계 → 10단계).
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:340:688:- `PSR-CASCADE-05` (cycle2 PSR-27 경로 정정): `apps/spike-a/pgbouncer/userlist.txt` — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade). 본 파일은 `apps/spike-a/docker-compose.yml` 의 pgbouncer 컨테이너에 mount 되는 정확 경로.
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:341:695:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:342:696:| 2026-05-18 | **v1.0** | **Codex 비평 cycle 5 0 findings 확정 acceptance** — closeableAfterPatch=true. 수렴 추세 21 → 7 → 2 → 1 → 0. blocking 0 · major 0 · minor 0 잔존. 5 PSR-CASCADE 모두 PASS (01a · 02 · 03 · 04 · 05). 01b 는 별 code v1.0 cycle 분리. 누계 31 findings 전건 수용. acceptance commit 6 cascade 동시 포함 (LL-33 패턴 정합). |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:343:697:| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 1 minor finding 전건 수용 patch**: (PSR-31) § 5.3 SoT 요약 3줄 stale 정정 — § 3.1 4계열 명시 (A 일반검색 / B AI 검색 / C User-triggered / D 학습), § 3.2 enum `allow / disallowTraining / disallowAll / custom`, § 3.3 `allow` 시 `aiCrawlerLegalApproved: true` fail-gate. 5 PSR-CASCADE 모두 PASS. closeableAfterPatch=true 신호 + plan v1.0 acceptance commit 권고. 누계 cycle 1+2+3+4 = 31 findings 전건 수용. |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:344:698:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch**: (PSR-29) acceptance scenario #21 themeColor 기대값 stale 정정 — `BrandTokens.colors.light.primary` default `#2563eb` (light) / `#60a5fa` (dark). (PSR-30) robots.txt starter SoT line-by-line 정합 — 헤더/일반 룰/C 계열/meta-externalagent 코멘트 + Sitemap placeholder `{domain}` 통일 (SEARCH_STANDARDIZATION § 3.3 그대로). 추가 cascade 실 적용: docs/admin/ARCHITECTURE.md § 3.12 신설 (PSR-CASCADE-01a — apps/web route group `(admin)` + `(site)` 분리). apps/spike-a/pgbouncer/userlist.txt 에 `app_public_reader` 추가 (PSR-CASCADE-05). 누계 cycle 1+2+3 = 30 findings 전건 수용. 5 cascade 중 4 PASS, 01b 는 별 code v1.0 cycle. |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:345:699:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:363:68:#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:364:70:`PUBLIC_SITE_RENDER_PLAN.md` v0.x § 5.4 PSR-SEO-12 의 SSR + path-based routing 단계 (Phase 0) 에서는 도메인 매핑 (subdomain/custom domain) 합류 전이므로 **임시로 instanceSlug 가 path 에 들어간 `@id` 패턴** 을 사용한다:
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:763:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.12|\\(site\\)|/admin|route group|PUBLIC_SITE_RENDER\" docs/admin/ARCHITECTURE.md docs/decisions/M0_BUILD_EXPORT_PLAN.md docs/core/SCHEMA_MAPPING.md" in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:784:docs/decisions/M0_BUILD_EXPORT_PLAN.md:51:### 2.1 PUBLIC_SITE_RENDER_PLAN SSR 컴포넌트 재사용 (PSR-CASCADE-03)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:785:docs/decisions/M0_BUILD_EXPORT_PLAN.md:53:`PUBLIC_SITE_RENDER_PLAN.md` v0.x 가 apps/web 안 `(site)` route group · SSR + Next ISR 로 먼저 공개 페이지를 렌더한다 (Phase 0). 본 M0 v1.0 본 구현 시점에 같은 컴포넌트 트리를 정적 build/export 로 재사용한다:
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:788:docs/decisions/M0_BUILD_EXPORT_PLAN.md:65:본 § 2.1 은 `PUBLIC_SITE_RENDER_PLAN` 의 acceptance precondition cascade (PSR-CASCADE-03) — apps/worker 구현 시 별도 컴포넌트 작성 부담 없음. 본 plan v1.0 합류 시 § 2.1 상세화.
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:789:docs/admin/ARCHITECTURE.md:280:### 3.12 apps/web route group 구조 (PSR-CASCADE-01a · PUBLIC_SITE_RENDER_PLAN v0.x)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:790:docs/admin/ARCHITECTURE.md:282:Phase 0 단계 `apps/web` 안 어드민 + 공개 사이트 두 영역을 같은 Next.js 앱 안 route group 으로 분리한다. PUBLIC_SITE_RENDER_PLAN v0.x § 2.1 의 acceptance precondition cascade.
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:792:docs/admin/ARCHITECTURE.md:286:| `(admin)` | `/admin/<instanceSlug>/...` | 운영자 어드민 — ClinicProfile · DoctorProfile · TreatmentPage · Article · LegalDocument 입력/편집 | ADMIN_UI_SKELETON code v1.0 합류 (현재 `/<instanceSlug>/...` → `/admin/<instanceSlug>/...` 격상 cascade는 PUBLIC_SITE_RENDER code v1.0 cycle 안 동반 — PSR-CASCADE-01b) |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:793:docs/admin/ARCHITECTURE.md:287:| `(site)` | `/<instanceSlug>/...` | 공개 사이트 — Home · About · Doctors · Treatments · Insights (1샘플) · Contact · Locations · Legal (v0.x 차단) | PUBLIC_SITE_RENDER code v1.0 합류 (M0 게이트 #1 사이트 측 페이지 빌드 가능 단계) |
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:796:docs/core/SCHEMA_MAPPING.md:68:#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:797:docs/core/SCHEMA_MAPPING.md:70:`PUBLIC_SITE_RENDER_PLAN.md` v0.x § 5.4 PSR-SEO-12 의 SSR + path-based routing 단계 (Phase 0) 에서는 도메인 매핑 (subdomain/custom domain) 합류 전이므로 **임시로 instanceSlug 가 path 에 들어간 `@id` 패턴** 을 사용한다:
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:856:apps/web/tailwind.config.ts:2:// SoT: DESIGN_TOKENS v1.0 § 3.2 semantic 22 + PUBLIC_SITE_RENDER_PLAN v1.0 § 4.5 PSR-COMP-10·11·12
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:1133:packages/migrations-runner/src/manifest.ts:102:  // (10) app_public_reader role + per-table SELECT policy 7개 (PUBLIC_SITE_RENDER_PLAN v0.x · PSR-25 / PSR-CASCADE-04 patch)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:1223:apps/web/src\lib\env.ts:9:  // PUBLIC_SITE_RENDER_PLAN v1.0 § 6 — 공개 사이트 SSR 용 app_public_reader connection
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:1264:apps/web/src\app\page.tsx:52:  // PSR-CASCADE-01b: 어드민 URL `/admin/<slug>/...` prefix 격상 (PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:1334:apps/web/src\lib\json-ld\types.ts:2:// SoT: SCHEMA_MAPPING § 1.2 @id 네이밍 + § 2.5 공통 entity 출력 정책 + PUBLIC_SITE_RENDER_PLAN § 5.4
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:1418:apps/web/src\app\sign-in\consume\route.ts:177:  // 6) cookie set + redirect — PSR-CASCADE-01b: admin URL `/admin/<slug>` prefix 격상
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:1674:apps/web/src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:2:// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1 (Article URL `/insights/[category]/[slug]` · v0.1 fallback `general`)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:1726:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.1 PSR-DATA-03 + § 6 작업 #4
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:1774:   2: -- SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.1 PSR-DATA-01 + PSR-25 + PSR-15
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:1851:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-12 (v0.1 path-based · M0 도메인 매핑 PSR-CASCADE-02)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:1869:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.1 PSR-SEO-01·02·03·04·05·06
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:1953:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-01·02 (cycle1 PSR-03 정합 — root layout 만 <html>/<body>)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:1983:   3: //      PUBLIC_SITE_RENDER_PLAN v1.0 § 5.2 PSR-SEO-07 (P-013 sitemap 제외)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:2110:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.4 PSR-COMP-09 + § 6 작업 #9
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:2261:   3: //      PUBLIC_SITE_RENDER_PLAN v1.0 § 5.3 PSR-SEO-09 (cycle2 PSR-22 + cycle3 PSR-30 정합)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:2350:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' | ForEach-Object { "'$i++; if($i -ge 434 -and $i -le 456){ '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:2352:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' | ForEach-Object { "'$i++; if($i -ge 468 -and $i -le 531){ '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:2541:   2: // SoT: SCHEMA_MAPPING § 1.1 + PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:2557:   1: // @glitzy/web/lib/json-ld/__tests__/validate — 자체 JSON-LD rule checker (LOCAL_PASS)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:2558:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-14 (cycle1 PSR-17 — 외부 validator manual QA)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:2640:   2: // SoT: SCHEMA_MAPPING § 3 + PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-11
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:3156:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.3 PSR-COMP-08 (Home row)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:3256:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1 (Article URL `/insights/[category]/[slug]` · v0.1 fallback `general`)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:3377:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.3 PSR-COMP-08
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:3819:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.2 PSR-DATA-07 + § 4.3 + PSR-DEFER-13 (= LL-DEFER-01 alias)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:3881:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-04 + § 6 작업 #6
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:3938:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.2 PSR-COMP-05·06·07 + § 6 작업 #5
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:4272:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-03
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:4314:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-03 (cycle2 PSR-26: 법적 페이지 링크 v0.1 단계 숨김 — broken link 회피)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:4390:   2: // SoT: LL-SCHEMA-16 CT-02 + PUBLIC_SITE_RENDER_PLAN v1.0 § 4.3 PSR-COMP-08
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:4634: 177:   // 6) cookie set + redirect — PSR-CASCADE-01b: admin URL `/admin/<slug>` prefix 격상
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:4712:  52:   // PSR-CASCADE-01b: 어드민 URL `/admin/<slug>/...` prefix 격상 (PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:4798:   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.1 PSR-DATA-01 + § 6 작업 #3
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:4839:   9:   // PUBLIC_SITE_RENDER_PLAN v1.0 § 6 — 공개 사이트 SSR 용 app_public_reader connection
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:4940: 102:   // (10) app_public_reader role + per-table SELECT policy 7개 (PUBLIC_SITE_RENDER_PLAN v0.x · PSR-25 / PSR-CASCADE-04 patch)
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5399:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' | ForEach-Object { "'$i++; if($i -ge 132 -and $i -le 205){ '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5602:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' | ForEach-Object { "'$i++; if($i -ge 243 -and $i -le 251){ '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5615:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' | ForEach-Object { "'$i++; if($i -ge 251 -and $i -le 252){ '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5647:# PUBLIC_SITE_RENDER code v1.0 — cycle 1 review
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5656:- **PSRC-01**: PSR-CASCADE-01b 이후 stale import 때문에 web typecheck 실패
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5658:  - 근거(plan SoT): PSR-CASCADE-01b — admin route는 `(admin)/admin/[instanceSlug]`
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5662:- **PSRC-02**: `sanitize-html` 도입이 lock/install에 반영되지 않아 typecheck 실패
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5668:- **PSRC-03**: `withPublicTenantTransaction` 타입이 postgres-js transaction 타입과 맞지 않아 typecheck 실패
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5675:- **PSRC-04**: D0011이 공개 DB role password를 migration에 하드코딩
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5681:- **PSRC-05**: JSON-LD graph가 SCHEMA_MAPPING §2.5의 ref/full 정책을 충실히 구현하지 않음
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5687:- **PSRC-06**: JSON-LD checker가 cross-reference 무결성을 사실상 검증하지 못함
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5690:  - 문제: 절대 URL이면 graph 내부 누락 참조도 통과한다. 현재 Article author처럼 graph에 없는 Physician ref가 LOCAL_PASS 될 수 있다.
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5693:- **PSRC-07**: sitemap이 minimal 페이지와 lastmod SoT를 안정적으로 반영하지 않음
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5695:  - 근거(plan SoT): PUBLIC_SITE_RENDER_PLAN §7 scenario #11, §5.2; SEARCH_STANDARDIZATION §4.3
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5699:- **PSRC-08**: canonical/OpenGraph URL이 request-aware absolute URL이 아님
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5705:- **PSRC-09**: Host/X-Forwarded headers를 검증 없이 SEO 산출물에 반영
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5711:- **PSRC-10**: layout-level loader가 “한 번 SELECT” 결정과 다르게 페이지/metadata에서 반복 호출됨
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5717:- **PSRC-11**: CT-02 businessHours narrowing이 너무 약해 잘못된 JSON이 렌더/JSON-LD까지 통과
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5723:- **PSRC-12**: Markdown 외부 링크 rel 자동화가 protocol-relative URL을 놓침
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5730:- **PSRC-13**: Home이 P-001 정보 슬롯 일부를 렌더하지 않음
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5736:- **PSRC-14**: ContactPoint `@id`가 path-based absolute 패턴이 아님
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5742:- **PSRC-15**: Legal route 내부 hostOrigin이 하드코딩
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5748:## acceptance precondition (PSR-CASCADE-01b) 점검
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5749:- PSR-CASCADE-01b: PARTIAL
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5754:# PUBLIC_SITE_RENDER code v1.0 — cycle 1 review
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5763:- **PSRC-01**: PSR-CASCADE-01b 이후 stale import 때문에 web typecheck 실패
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5765:  - 근거(plan SoT): PSR-CASCADE-01b — admin route는 `(admin)/admin/[instanceSlug]`
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5769:- **PSRC-02**: `sanitize-html` 도입이 lock/install에 반영되지 않아 typecheck 실패
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5775:- **PSRC-03**: `withPublicTenantTransaction` 타입이 postgres-js transaction 타입과 맞지 않아 typecheck 실패
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5782:- **PSRC-04**: D0011이 공개 DB role password를 migration에 하드코딩
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5788:- **PSRC-05**: JSON-LD graph가 SCHEMA_MAPPING §2.5의 ref/full 정책을 충실히 구현하지 않음
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5794:- **PSRC-06**: JSON-LD checker가 cross-reference 무결성을 사실상 검증하지 못함
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5797:  - 문제: 절대 URL이면 graph 내부 누락 참조도 통과한다. 현재 Article author처럼 graph에 없는 Physician ref가 LOCAL_PASS 될 수 있다.
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5800:- **PSRC-07**: sitemap이 minimal 페이지와 lastmod SoT를 안정적으로 반영하지 않음
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5802:  - 근거(plan SoT): PUBLIC_SITE_RENDER_PLAN §7 scenario #11, §5.2; SEARCH_STANDARDIZATION §4.3
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5806:- **PSRC-08**: canonical/OpenGraph URL이 request-aware absolute URL이 아님
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5812:- **PSRC-09**: Host/X-Forwarded headers를 검증 없이 SEO 산출물에 반영
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5818:- **PSRC-10**: layout-level loader가 “한 번 SELECT” 결정과 다르게 페이지/metadata에서 반복 호출됨
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5824:- **PSRC-11**: CT-02 businessHours narrowing이 너무 약해 잘못된 JSON이 렌더/JSON-LD까지 통과
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5830:- **PSRC-12**: Markdown 외부 링크 rel 자동화가 protocol-relative URL을 놓침
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5837:- **PSRC-13**: Home이 P-001 정보 슬롯 일부를 렌더하지 않음
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5843:- **PSRC-14**: ContactPoint `@id`가 path-based absolute 패턴이 아님
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5849:- **PSRC-15**: Legal route 내부 hostOrigin이 하드코딩
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5855:## acceptance precondition (PSR-CASCADE-01b) 점검
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md:5856:- PSR-CASCADE-01b: PARTIAL
handoff\codex-reviews\public-site-render-code-v1\cycle-3.prompt.md:1:You are reviewing **cycle 3** of the PUBLIC_SITE_RENDER code v1.0. Cycle 2 had **3 findings** (blocking=1, major=2). All 3 patched. `pnpm --filter @glitzy/web typecheck` PASS.
handoff\codex-reviews\public-site-render-code-v1\cycle-3.prompt.md:7:| PSRC-16 | blocking | rule checker가 `#website` unresolved 로 실패 | cross-page reference allowlist (`#organization`/`#website`/`#clinic`) — same-origin URL + 등록된 fragment 는 graph entity 미존재 OK |
handoff\codex-reviews\public-site-render-code-v1\cycle-3.prompt.md:8:| PSRC-17 | major | P-003/004/005/010 MedicalClinic 풀 entity가 plan SoT(`[참조]`) 와 충돌 | builders 의 cycle 1 PSR-05 patch 일부 revert — 풀 entity 출력 제거, webPageEntity `aboutClinic` 옵션 제거. P-006 만 풀 entity 유지 (SCHEMA_MAPPING § 2.5 정합) |
handoff\codex-reviews\public-site-render-code-v1\cycle-3.prompt.md:9:| PSRC-18 | major | inline `@id` 참조도 검사 안 됨 | rule checker — `@type` 있는 객체 = self-contained inline (검사 제외, recurse 만). pure ref (`@id` 만) 만 same-origin 검사 |
handoff\codex-reviews\public-site-render-code-v1\cycle-3.prompt.md:23:   - PSRC-17 revert 가 SCHEMA_MAPPING § 2.5 표 (P-003/4/5/10 = `[참조]` MedicalClinic) 정합
handoff\codex-reviews\public-site-render-code-v1\cycle-3.prompt.md:26:3. scenario 1~23 통과 추론 (특히 #10 entity 풀/참조 + #18 자체 rule checker)
handoff\codex-reviews\public-site-render-code-v1\cycle-3.prompt.md:27:4. 새 finding (PSRC-19+)
handoff\codex-reviews\public-site-render-code-v1\cycle-3.prompt.md:32:# PUBLIC_SITE_RENDER code v1.0 — cycle 3 review
handoff\codex-reviews\public-site-render-code-v1\cycle-3.prompt.md:40:- PSRC-16: PASS|FAIL|PARTIAL
handoff\codex-reviews\public-site-render-code-v1\cycle-3.prompt.md:41:- PSRC-17: PASS|FAIL|PARTIAL
handoff\codex-reviews\public-site-render-code-v1\cycle-3.prompt.md:42:- PSRC-18: PASS|FAIL|PARTIAL
handoff\codex-reviews\public-site-render-code-v1\cycle-3.prompt.md:44:## new findings (PSRC-19+)
handoff\codex-reviews\public-site-render-code-v1\cycle-3.prompt.md:46:## acceptance precondition (PSR-CASCADE-01b)
handoff\codex-reviews\public-site-render-code-v1\cycle-3.prompt.md:47:- PSR-CASCADE-01b: <PASS|FAIL>
handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:94:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"v1\\.1|LL-ACTION-18|LL-DEFER-21|8단계|9단계|C0003|tenant-resolve-denied|ForbiddenAccessPage|failedDetails|LL-CASCADE-0[1-5]|LLC-12|Next 15|scenario|시나리오 15\" docs/decisions/LOCATION_LEGAL_PLAN.md" in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:113:542:| 12 | 시나리오 14~22 LOCAL_PASS 검증 | apps/web/README.md 또는 별도 scenario doc |
handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:159:apps\spike-e\src\scenarios\test-tenant-resolve-cross.ts:28:      WHERE event_type = 'tenant-resolve-denied' AND actor_user_id = ${u[0]!.id} AND to_instance_id = ${INSTANCE_B_ID}::uuid
handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:160:apps\spike-e\src\scenarios\test-tenant-resolve-cross.ts:30:    if (audit[0]!.count < 1) throw new Error("tenant-resolve-denied audit missing");
handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:169:apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:33:    const audit = await sql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM audit_event WHERE event_type = 'tenant-resolve-denied' AND reason = 'legal-reviewer-ineligible'`;
handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:170:apps\spike-e\src\scenarios\test-invariant.ts:78:    const deniedCount = auditMap.get("tenant-resolve-denied") ?? 0;
handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:171:apps\spike-e\src\scenarios\test-invariant.ts:80:    if (deniedCount !== crossDenied) throw new InvariantViolationError("audit tenant-resolve-denied mismatch", { deniedCount, crossDenied });
handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:172:apps\spike-e\src\scenarios\test-invariant.ts:83:    console.log(`[invariant] audit: tenant-resolved=${resolvedCount}, tenant-resolve-denied=${deniedCount}`);
handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:173:apps\spike-e\src\scenarios\test-invalid-instance-id.ts:41:    const audit = await sql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM audit_event WHERE event_type = 'tenant-resolve-denied' AND reason = 'invalid-instance-id'`;
handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:208:packages\migrations-runner\src\index.ts:1:// @glitzy/migrations-runner — Spike D LOCAL_PASS 승격 (placeholder·v0.1) + manifest spec (v0.1 — LL-CASCADE-05)
handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:782:2:// Spike E LOCAL_PASS 패턴 그대로·env 의존 제거·cfg 주입
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md:1:You are reviewing **cycle 2** of `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md`. Cycle 1 had **21 findings** (6 blocking + 11 major + 4 minor). All were patched in v0.2. Verify convergence and surface remaining issues.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md:8:| PSR-02 | blocking | admin URL 충돌 | `/admin/<slug>/...` prefix 격상. § 2.1 PSR-ROUTE-02 + § 8 작업 #15 + PSR-CASCADE-01 격상 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md:14:| PSR-08 | major | @id path-based cascade detail | PSR-CASCADE-02 보강 — entity continuity migration note |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md:23:| PSR-17 | major | 외부 JSON-LD validator 게이트 | 자체 rule checker LOCAL_PASS · 외부 validator manual QA · PSR-DEFER-14 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md:24:| PSR-18 | minor | scenario #1 문구 반대 | "보임" 정정 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md:32:- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.2 (대규모 재작성)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md:35:- `docs/admin/ARCHITECTURE.md` (PSR-CASCADE-01)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md:36:- `docs/core/SCHEMA_MAPPING.md` § 1.2 (PSR-CASCADE-02)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md:37:- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 (PSR-CASCADE-03)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md:38:- `packages/migrations-runner/src/manifest.ts` (PSR-CASCADE-04)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md:39:- `apps/spike-a/.../userlist.txt` (PSR-CASCADE-05)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md:65:3. **새 cascade marker (PSR-DEFER-13~17, PSR-CASCADE-01 격상)**:
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md:71:   - PSR-CASCADE-01 격상 — acceptance precondition 코드 cascade 가 LOCATION_LEGAL code v1.1 + ADMIN_UI_SKELETON code v1.1 patch 동반 필요
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md:73:4. **acceptance precondition (PSR-CASCADE-01~05)** 최종 점검
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md:80:# PUBLIC_SITE_RENDER_PLAN v0.2 — cycle 2 review
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md:92:## acceptance precondition (PSR-CASCADE-01~05) 재점검
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md:93:- PSR-CASCADE-01: <PASS|FAIL|TBD>
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:14:You are reviewing **cycle 2** of `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md`. Cycle 1 had **21 findings** (6 blocking + 11 major + 4 minor). All were patched in v0.2. Verify convergence and surface remaining issues.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:21:| PSR-02 | blocking | admin URL 충돌 | `/admin/<slug>/...` prefix 격상. § 2.1 PSR-ROUTE-02 + § 8 작업 #15 + PSR-CASCADE-01 격상 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:27:| PSR-08 | major | @id path-based cascade detail | PSR-CASCADE-02 보강 — entity continuity migration note |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:36:| PSR-17 | major | 외부 JSON-LD validator 게이트 | 자체 rule checker LOCAL_PASS · 외부 validator manual QA · PSR-DEFER-14 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:37:| PSR-18 | minor | scenario #1 문구 반대 | "보임" 정정 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:45:- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.2 (대규모 재작성)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:48:- `docs/admin/ARCHITECTURE.md` (PSR-CASCADE-01)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:49:- `docs/core/SCHEMA_MAPPING.md` § 1.2 (PSR-CASCADE-02)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:50:- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 (PSR-CASCADE-03)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:51:- `packages/migrations-runner/src/manifest.ts` (PSR-CASCADE-04)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:52:- `apps/spike-a/.../userlist.txt` (PSR-CASCADE-05)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:78:3. **새 cascade marker (PSR-DEFER-13~17, PSR-CASCADE-01 격상)**:
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:84:   - PSR-CASCADE-01 격상 — acceptance precondition 코드 cascade 가 LOCATION_LEGAL code v1.1 + ADMIN_UI_SKELETON code v1.1 patch 동반 필요
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:86:4. **acceptance precondition (PSR-CASCADE-01~05)** 최종 점검
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:93:# PUBLIC_SITE_RENDER_PLAN v0.2 — cycle 2 review
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:105:## acceptance precondition (PSR-CASCADE-01~05) 재점검
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:106:- PSR-CASCADE-01: <PASS|FAIL|TBD>
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:117:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "''^#|PSR-|P-0|robots|sitemap|LegalDocument|D0011|CREATE POLICY|sanitize|theme|og:type|Tailwind|semantic|ADMIN|admin|NOLOGIN|MEMBERSHIP|Footer|footer|revalidatePath|aiCrawlerPolicy|disallowTraining|@id|Article|TreatmentPage|Location|MedicalClinic|schema|status='"'published'|status = 'published'|published\" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md" in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:560:26:  - `apps/web/src/app/sign-in/...` (consume route — redirect target `/<firstSlug>` → `/admin/<firstSlug>` 로 patch · PSR-CASCADE-01)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:565:41:| **어드민 URL prefix `/admin/<instanceSlug>/...`** (cycle1 PSR-02 격상) | 공개 path namespace 와 분리. acceptance precondition. 코드 cascade (PSR-CASCADE-01) 동시 적용 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:591:73:| Google Rich Results Test / schema.org validator 자동 게이트 | manual QA marker · LOCAL_PASS 는 자체 rule checker (cycle1 PSR-17) | PSR-DEFER-14 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:610:107:├─ sign-in/...                           -- (변경: consume redirect target `/admin/<slug>` · PSR-CASCADE-01)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:647:215:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:722:425:- (PSR-SEO-04) canonical v0.1: `https://<host>/<instanceSlug><path>` path-based. M0 v1.0 도메인 매핑 합류 시 entity continuity migration (PSR-CASCADE-02 참조).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:763:540:- (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:765:542:- (PSR-SEO-14 · cycle1 PSR-17) **자체 JSON-LD rule checker** (LOCAL_PASS 게이트): JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 검증. Google Rich Results Test / schema.org validator 는 manual QA marker (PSR-DEFER-14) — CI 게이트 X.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:771:563:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:773:565:| 7 | `packages/migrations-runner/src/manifest.ts` v0.x — D0011 10단계 추가 (PSR-CASCADE-04) | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:776:568:| 10 | LOCATION_LEGAL code v1.1 cascade — admin URL 변경 (PSR-CASCADE-01) 의 revalidatePath 6 곳 patch | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:777:569:| 11 | ADMIN_UI_SKELETON code v1.1 cascade — sign-in/consume redirect `/admin/<slug>` (PSR-CASCADE-01) | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:778:570:| 12 | apps/web seed scenario 도 admin URL 변경 정합 (`apps/web/src/seed.ts`) | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:779:572:## 7. § 8.1 시나리오 (LOCAL_PASS 검증) — cycle1 PSR-17·18 정정
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:790:590:| 15 | 어드민 측 도메인 (`/admin/<slug>/...`) 와 공개 도메인 (`/<slug>/...`) 충돌 없음 — PSR-CASCADE-01 정합 | 어드민 prefix `/admin` · 공개 prefix 없음. sign-in consume redirect `/admin/<firstSlug>` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:791:591:| 16 | dark mode CSS vars 출력 (UI toggle 미지원) | `[data-theme="dark"]` 블록 안 22개 토큰 모두 dark 값 정의 — 자체 rule checker (LOCAL_PASS) · UI toggle 은 marker 만 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:807:618:| 15 | **어드민 URL `/admin` prefix 격상 (PSR-CASCADE-01)** | apps/web/src/app/(admin)/admin/[instanceSlug]/ 디렉토리 이동 + revalidatePath 6 곳 + sign-in/consume redirect target + seed.ts |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:808:619:| 16 | docs/admin/ARCHITECTURE.md § 3 patch — `(site)` 신설 + `/admin` prefix (PSR-CASCADE-01) | doc |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:809:620:| 17 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` marker + entity continuity note (PSR-CASCADE-02) | doc |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:810:621:| 18 | docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2 patch — apps/worker 가 본 plan SSR 컴포넌트 재사용 marker (PSR-CASCADE-03) | doc |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:811:622:| 19 | packages/migrations-runner manifest 10단계 (D0011 추가 — PSR-CASCADE-04) | manifest.ts |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:812:623:| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05) | apps/spike-a/userlist.txt |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:835:660:> **acceptance 순서 정합 (LL-33 패턴)**: PSR-CASCADE-01~05 는 plan v1.0 acceptance 와 **동시 또는 직전** 에 적용. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:836:662:- `PSR-CASCADE-01` (cycle1 PSR-02 격상): `docs/admin/ARCHITECTURE.md` § 3 patch + `apps/web` 디렉토리 구조 변경 (`(admin)/admin/[instanceSlug]/...`) + revalidatePath 6 곳 + sign-in/consume redirect target + seed.ts. **코드 cascade — LOCATION_LEGAL code v1.1 + ADMIN_UI_SKELETON code v1.1 patch acceptance precondition**.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:837:663:- `PSR-CASCADE-02` (cycle1 PSR-08 보강): `docs/core/SCHEMA_MAPPING.md` § 1.2 patch — v0.1 임시 path-based `@id` 패턴 + 도메인 매핑 후 (M0 v1.0) entity @id 전환 시 redirect/301/`sameAs` 처리 룰 추가 marker.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:838:664:- `PSR-CASCADE-03`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 patch — apps/worker 의 build/export 시점에 본 plan SSR 컴포넌트 + JSON-LD 생성기 + sitemap/robots route handler 재사용 marker.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:839:665:- `PSR-CASCADE-04`: `packages/migrations-runner/src/manifest.ts` — D0011 10단계 추가 (현 9단계 → 10단계).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:840:666:- `PSR-CASCADE-05`: `apps/spike-a` pgbouncer userlist — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:842:673:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:853:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "admin|/admin|instanceSlug|sign-in|revalidatePath|seed|dashboard|cleanup|PSR-CASCADE|PUBLIC_SITE" docs/admin/ARCHITECTURE.md docs/decisions/M0_BUILD_EXPORT_PLAN.md packages/migrations-runner/src/manifest.ts apps/spike-a/userlist.txt' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1869:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"\\| "'`.*` '"\\| "'`color'"\\.|bg-canvas|text-fg|border-|ring-|overlay\" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md" in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1871:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "User-agent:|GPTBot|ClaudeBot|Google-Extended|CCBot|anthropic-ai|OAI-SearchBot|PerplexityBot|Claude-SearchBot|ChatGPT-User|Perplexity-User|Claude-User|Yeti|Bingbot|Googlebot|meta-externalagent|Sitemap" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md docs/core/SEARCH_STANDARDIZATION.md' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1873:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "themeColor|theme-color|BrandTokens|color.surface.background|brand.primary" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md docs/core/SEARCH_STANDARDIZATION.md docs/core/DESIGN_TOKENS.md' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1875:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "app_public_reader|D0011|10단계|public_reader|NOLOGIN|MEMBERSHIP|manifest|C0008|D0011_public_reader" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md packages/migrations-runner/src/manifest.ts docs/decisions/LOCATION_LEGAL_PLAN.md' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1928:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:467:User-agent: *
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1929:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:471:User-agent: GPTBot
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1930:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:474:User-agent: Google-Extended
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1931:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:477:User-agent: CCBot
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1932:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:480:User-agent: anthropic-ai
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1933:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:483:User-agent: ClaudeBot
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1934:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:486:User-agent: Bytespider
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1935:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:489:User-agent: PerplexityBot
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1936:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:492:User-agent: cohere-ai
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1937:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:495:User-agent: Diffbot
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1938:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:499:User-agent: OAI-SearchBot
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1939:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:502:User-agent: ChatGPT-User
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1940:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:505:User-agent: Claude-SearchBot
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1941:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:508:User-agent: PerplexityBot-User
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1942:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:512:User-agent: Yeti
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1943:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:515:Sitemap: https://<host>/<instanceSlug>/sitemap.xml
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1944:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:587:| 12 | `/<instanceSlug>/robots.txt` 응답 | SEARCH_STANDARDIZATION § 3 v0.1 starter `disallowTraining` 정합 (학습 봇 Disallow + 답변 봇 Allow + Naver Yeti Allow) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2001:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:13:- `docs/core/SEARCH_STANDARDIZATION.md` — § 2 메타 태그 표준 (theme-color · og:type 매핑) · § 3 robots.txt (aiCrawlerPolicy + 4계열 user-agent + disallowTraining starter) · § 4.3 sitemap changefreq/priority · § 5 canonical resolve.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2002:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:16:- `docs/core/DESIGN_TOKENS.md` v1.0 — 3-tier 토큰 (primitive·semantic·component) · § 3.2 light/dark semantic 22 · § 3.3 `data-theme="light"|"dark"` 분기 · semantic naming SoT (`color.surface.background` 등).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2003:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:34:- 노출 의도 일직선: SEARCH_STANDARDIZATION 정합 robots/sitemap/canonical · schema.org JSON-LD · Next.js metadata · theme-color · OpenGraph · 자체 JSON-LD rule checker 같은 검색·AI 인용 신호를 v0.1 단계부터 표준 정합으로 출력.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2004:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:48:| Next metadata API + theme-color + og:type 매핑 (cycle1 PSR-10 정정) | title · description · canonical · OpenGraph · Twitter · robots · `themeColor` 2값 (light/dark) · og:type P-004 `profile`, P-006/P-010 `article`, 기타 `website` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2005:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:347:| `bg-canvas` · `bg-surface` | `color.surface.background` | `--color-surface-background` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2006:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:356:| `bg-brand` · `text-brand` | `color.brand.primary` | `--color-brand-primary` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2007:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:357:| `bg-brand-hover` | `color.brand.primary.hover` | `--color-brand-primary-hover` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2008:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:372:- (PSR-COMP-11 · cycle1 PSR-13) Tailwind alias 는 semantic 22 round-trip 보장 — `bg-canvas` ↔ `color.surface.background` ↔ `--color-surface-background`. 본 표가 SoT.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2009:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:377:  --color-surface-background: #f9fafb;  /* gray.50 */
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2010:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:382:  --color-surface-background: #111827;  /* gray.900 */
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2011:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:415:  themeColor: [
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2012:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:423:- (PSR-SEO-02 · cycle1 PSR-10) `themeColor` 2값 출력 — DESIGN_TOKENS § 3.2 의 `color.surface.background` 토큰 (light/dark).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2013:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:596:| 21 | Next metadata API `themeColor` 2값 (light + dark) 출력 — cycle1 PSR-10 | `<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f9fafb">` + dark 변형 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2014:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:615:| 12 | Next metadata API (페이지별 generateMetadata · themeColor · og:type) | 각 page.tsx 안 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2015:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:673:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2033:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:44:| `app_public_reader` PostgreSQL role + per-table SELECT policy (cycle1 PSR-05·15 정정) | 신규 D0011 migration 안 instance lookup policy + 6 content table policy 명시 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2034:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:54:| env / pgbouncer / role membership cascade (cycle1 PSR-21 정정) | `WEB_PUBLIC_DATABASE_URL` env · `.env.example` · pgbouncer userlist · `app_public_reader NOLOGIN MEMBERSHIP` 등 acceptance checklist |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2035:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:128:### 3.1 D0011 — `app_public_reader` role + per-table policy (PSR-DATA-01) — cycle1 PSR-05·15 정정
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2036:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:131:-- packages/db/migrations/D0011_public_reader.sql (신규)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2037:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:133:-- cycle1 PSR-05 patch: NOLOGIN 으로 생성 후 별도 application user (예: app_public_user)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2038:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:134:-- 가 MEMBERSHIP 으로 SET ROLE. login user 자체 는 운영 환경 별 secret cascade.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2039:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:135:-- v0.1 은 LOGIN role 한 개 (`app_public_reader`) 로 단순화 — production 분리 marker.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2040:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:136:CREATE ROLE app_public_reader LOGIN;
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2041:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:138:GRANT USAGE ON SCHEMA public TO app_public_reader;
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2042:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:143:GRANT SELECT ON instance TO app_public_reader;
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2043:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:145:CREATE POLICY public_reader_instance_select
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2044:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:148:  TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2045:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:157:  TO app_public_reader;
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2046:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:159:CREATE POLICY public_reader_clinic_profile_select
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2047:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:160:  ON clinic_profile FOR SELECT TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2048:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:163:CREATE POLICY public_reader_location_profile_select
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2049:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:164:  ON location_profile FOR SELECT TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2050:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:167:CREATE POLICY public_reader_doctor_profile_select
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2051:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:168:  ON doctor_profile FOR SELECT TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2052:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:174:CREATE POLICY public_reader_treatment_page_select
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2053:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:175:  ON treatment_page FOR SELECT TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2054:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:183:CREATE POLICY public_reader_article_select
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2055:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:184:  ON article FOR SELECT TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2056:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:196:CREATE POLICY public_reader_legal_document_select
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2057:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:197:  ON legal_document FOR SELECT TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2058:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:205:- (PSR-DATA-02 · cycle1 PSR-05) `app_public_reader` LOGIN — v0.1 단순화. production 단 NOLOGIN + MEMBERSHIP 분리 marker (PSR-DEFER-16 신설).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2059:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:211:- (PSR-DATA-04) `app_public_reader` 는 audit_event INSERT 권한 없음 — 공개 페이지 access log 는 별도 (CDN / Vercel analytics · PSR-DEFER-10).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2060:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:215:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2061:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:223:| Entity | RLS USING (D0011) | 의미 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2062:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:559:| 1 | `D0011_public_reader.sql` 작성 + per-table policy 7개 (instance + 6 content table) | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2063:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:561:| 3 | `apps/web/src/lib/public-db.ts` 신규 — `app_public_reader` connection helper (singleton) | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2064:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:563:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2065:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:564:| 6 | role membership / NOLOGIN 분리 production marker | PSR-DEFER-16 (M0 v1.0 본 구현 합류) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2066:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:565:| 7 | `packages/migrations-runner/src/manifest.ts` v0.x — D0011 10단계 추가 (PSR-CASCADE-04) | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2067:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:584:| 9 | tenant A 가 `/<tenantB>` 접근 — A 콘텐츠 미노출, B 콘텐츠만 | RLS app_public_reader USING `instance_id` 정합 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2068:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:604:| 1 | D0011 migration — `app_public_reader` LOGIN + 7개 policy (instance + 6 content table) | packages/db/migrations/D0011_public_reader.sql |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2069:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:622:| 19 | packages/migrations-runner manifest 10단계 (D0011 추가 — PSR-CASCADE-04) | manifest.ts |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2070:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:635:- `PSR-DEFER-16` (cycle1 PSR-05): `app_public_reader` NOLOGIN + MEMBERSHIP 분리 production 패턴.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2071:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:665:- `PSR-CASCADE-04`: `packages/migrations-runner/src/manifest.ts` — D0011 10단계 추가 (현 9단계 → 10단계).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2072:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:666:- `PSR-CASCADE-05`: `apps/spike-a` pgbouncer userlist — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2073:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:673:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2084:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "legal|privacy|terms|non-covered|refund|complaint|Footer|SiteFooter|legal/" apps/web/src docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2086:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:42:| **10페이지 minimal** (cycle1 PSR-01 정정) | P-001 `/` · P-002 `/about` · P-003 `/doctors` · P-004 `/doctors/[slug]` · P-005 `/treatments` · P-006 `/treatments/[slug]` · P-010 `/insights/[category]/[slug]` (1샘플) · P-012 `/contact` · P-013 `/legal/[type]` (5종) · P-014 `/locations/[slug]` (main 1건) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2087:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:46:| 페이지 컴포넌트 minimal | Hero · About · DoctorCard · TreatmentCard · ArticleBody · ContactCard · LegalRenderer · LocationCard · Footer · Header · BreadcrumbList |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2088:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:72:| LegalDocument 공개 노출 (status=published) | LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel 합류) | PSR-DEFER-13 (LL-DEFER-01 alias) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2089:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:101:│     ├─ legal/[type]/page.tsx           -- P-013 Legal/Policy (5 closed types) · noindex v0.1
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2090:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:156:                treatment_page, article, legal_document
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2091:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:196:CREATE POLICY public_reader_legal_document_select
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2092:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:197:  ON legal_document FOR SELECT TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2093:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:230:| `legal_document` | `status = 'published'` | **v0.1 단계 published row 0개 — 공개 렌더 차단** (DB CHECK 가 draft 만 허용 · LL-SCHEMA-03) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2094:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:233:- (PSR-DATA-07) LegalDocument 의 `/legal/[type]` 라우트 는 v0.1 응답:
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2095:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:237:- LegalDocument 공개 노출은 **LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel 합류) 시점** 까지 차단. PSR-DEFER-13 = LL-DEFER-01 alias.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2096:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:245:- `legal_document[type]` 매칭 0행 (v0.1 단계 항상) → `notFound()`
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2097:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:264:      <SiteFooter initial={initial} />
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2098:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:272:- (PSR-COMP-03) Header: ClinicProfile.name + 네비 (Home · About · Doctors · Treatments · Contact · Locations · CTA primaryCtas[0]). Footer: 주소·전화·진료시간·법적 페이지 링크.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2099:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:273:- (PSR-COMP-04) `loadSiteInitial` 가 layout 안에서 한 번 SELECT — Header/Footer 가 같은 데이터 사용. 페이지 안 별도 SELECT 는 entity 별 추가 데이터만.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2100:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:281:| ClinicProfile | `name` | C-01 `name` | Hero/Header/Footer |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2101:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:289:| LocationProfile | `phone` | C-21 `telephone` | Contact/Footer |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2102:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:290:| LocationProfile | `email` | C-21 `email` | Contact/Footer |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2103:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:328:| P-013 Legal/Policy `/legal/[type]` | (v0.1 항상 404 — DB CHECK 가 draft 만 허용 + RLS published 만 SELECT) | (none — defer) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2104:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:461:  - § 3.3: 정책별 출력 예시 + 법무 승인 필드 3종 required (`legalApprovalAt` · `legalApprovedBy` · `legalApprovalNote`) for `allowAll`.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2105:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:583:| 8 | LegalDocument 5종 draft → `/<instanceSlug>/legal/<type>` 응답 = 404 (v0.1 noindex + DB CHECK draft 만) | Next `notFound()` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2106:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:634:- `PSR-DEFER-13` (= LL-DEFER-01 alias · cycle1 PSR-06): LegalDocument 공개 노출 — compliance-assistant + ComplianceRecord legalCounsel/legalCounselAt 합류 시점.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2107:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:673:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3320:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"PUBLIC_SITE|PSR-CASCADE|/admin|\\(site\\)|admin/<|<instanceSlug>|완료 게이트|사이트 측\" docs/admin/ARCHITECTURE.md docs/decisions/M0_BUILD_EXPORT_PLAN.md" in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3346:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md:39:- `apps/spike-a/.../userlist.txt` (PSR-CASCADE-05)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3349:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:52:- `apps/spike-a/.../userlist.txt` (PSR-CASCADE-05)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3355:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:647:215:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3356:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:771:563:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3358:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:812:623:| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05) | apps/spike-a/userlist.txt |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3360:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:840:666:- `PSR-CASCADE-05`: `apps/spike-a` pgbouncer userlist — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3361:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:842:673:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3362:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:853:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "admin|/admin|instanceSlug|sign-in|revalidatePath|seed|dashboard|cleanup|PSR-CASCADE|PUBLIC_SITE" docs/admin/ARCHITECTURE.md docs/decisions/M0_BUILD_EXPORT_PLAN.md packages/migrations-runner/src/manifest.ts apps/spike-a/userlist.txt' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3366:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1875:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "app_public_reader|D0011|10단계|public_reader|NOLOGIN|MEMBERSHIP|manifest|C0008|D0011_public_reader" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md packages/migrations-runner/src/manifest.ts docs/decisions/LOCATION_LEGAL_PLAN.md' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3367:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2015:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:673:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3368:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2033:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:44:| `app_public_reader` PostgreSQL role + per-table SELECT policy (cycle1 PSR-05·15 정정) | 신규 D0011 migration 안 instance lookup policy + 6 content table policy 명시 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3369:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2034:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:54:| env / pgbouncer / role membership cascade (cycle1 PSR-21 정정) | `WEB_PUBLIC_DATABASE_URL` env · `.env.example` · pgbouncer userlist · `app_public_reader NOLOGIN MEMBERSHIP` 등 acceptance checklist |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3370:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2035:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:128:### 3.1 D0011 — `app_public_reader` role + per-table policy (PSR-DATA-01) — cycle1 PSR-05·15 정정
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3371:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2039:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:135:-- v0.1 은 LOGIN role 한 개 (`app_public_reader`) 로 단순화 — production 분리 marker.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3372:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2040:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:136:CREATE ROLE app_public_reader LOGIN;
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3373:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2041:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:138:GRANT USAGE ON SCHEMA public TO app_public_reader;
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3374:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2042:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:143:GRANT SELECT ON instance TO app_public_reader;
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3375:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2044:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:148:  TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3376:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2045:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:157:  TO app_public_reader;
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3377:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2047:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:160:  ON clinic_profile FOR SELECT TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3378:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2049:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:164:  ON location_profile FOR SELECT TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3379:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2051:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:168:  ON doctor_profile FOR SELECT TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3380:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2053:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:175:  ON treatment_page FOR SELECT TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3381:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2055:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:184:  ON article FOR SELECT TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3382:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2057:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:197:  ON legal_document FOR SELECT TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3383:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2058:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:205:- (PSR-DATA-02 · cycle1 PSR-05) `app_public_reader` LOGIN — v0.1 단순화. production 단 NOLOGIN + MEMBERSHIP 분리 marker (PSR-DEFER-16 신설).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3384:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2059:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:211:- (PSR-DATA-04) `app_public_reader` 는 audit_event INSERT 권한 없음 — 공개 페이지 access log 는 별도 (CDN / Vercel analytics · PSR-DEFER-10).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3385:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2060:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:215:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3386:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2063:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:561:| 3 | `apps/web/src/lib/public-db.ts` 신규 — `app_public_reader` connection helper (singleton) | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3387:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2064:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:563:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3388:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2067:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:584:| 9 | tenant A 가 `/<tenantB>` 접근 — A 콘텐츠 미노출, B 콘텐츠만 | RLS app_public_reader USING `instance_id` 정합 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3389:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2068:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:604:| 1 | D0011 migration — `app_public_reader` LOGIN + 7개 policy (instance + 6 content table) | packages/db/migrations/D0011_public_reader.sql |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3390:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2070:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:635:- `PSR-DEFER-16` (cycle1 PSR-05): `app_public_reader` NOLOGIN + MEMBERSHIP 분리 production 패턴.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3391:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2072:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:666:- `PSR-CASCADE-05`: `apps/spike-a` pgbouncer userlist — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3392:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2073:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:673:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3393:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2092:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:197:  ON legal_document FOR SELECT TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3394:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2107:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:673:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3399:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md:75:- PSR-CASCADE-05: pgbouncer userlist
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3403:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:88:- PSR-CASCADE-05: pgbouncer userlist
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3404:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:283:apps\spike-a\src\scenarios\test-pgbouncer-auth.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3417:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1021: 300: - D0011 migration — `app_public_reader` role 생성. packages/migrations-runner manifest 9단계 → 10단계 (D0011 추가 — PSR-CASCADE-04).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3418:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1022: 301: - pgbouncer userlist 에 `app_public_reader` 추가 (Spike A v0.x cascade — PSR-CASCADE-05).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3421:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1072: 351: | 18 | Spike A pgbouncer userlist 에 `app_public_reader` 추가 marker | PSR-CASCADE-05 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3422:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1108: 387: - `PSR-CASCADE-05`: `apps/spike-a` pgbouncer userlist — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3431:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10074:- PSR-CASCADE-05: TBD — pgbouncer userlist 추가 대상은 marker만 있고 실제 Spike A/userlist cascade 범위가 불명확.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3440:.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10214:- PSR-CASCADE-05: TBD — pgbouncer userlist 추가 대상은 marker만 있고 실제 Spike A/userlist cascade 범위가 불명확.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3442:.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:375:apps\spike-a\src\scenarios\test-pgbouncer-auth.ts
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3447:.\apps\spike-a\src\scenarios\test-pgbouncer-auth.ts:1:// Spike A — Scenario 0 (pre-flight): pgbouncer auth smoke
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3448:.\apps\spike-a\src\scenarios\test-pgbouncer-auth.ts:2:// SPIKEA2-005 정정: app_tenant_user가 pgbouncer 경로(6433)로 로그인 가능한지 검증
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3449:.\apps\spike-a\src\scenarios\test-pgbouncer-auth.ts:10:  console.log("pgbouncer auth smoke (DATABASE_URL_TENANT)");
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3450:.\apps\spike-a\src\scenarios\test-pgbouncer-auth.ts:19:  console.log(`pgbouncer-auth: ${isAppTenant ? "PASS" : "FAIL"}`);
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3451:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:44:| `app_public_reader` PostgreSQL role + per-table SELECT policy (cycle1 PSR-05·15 정정) | 신규 D0011 migration 안 instance lookup policy + 6 content table policy 명시 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3452:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:54:| env / pgbouncer / role membership cascade (cycle1 PSR-21 정정) | `WEB_PUBLIC_DATABASE_URL` env · `.env.example` · pgbouncer userlist · `app_public_reader NOLOGIN MEMBERSHIP` 등 acceptance checklist |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3453:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:128:### 3.1 D0011 — `app_public_reader` role + per-table policy (PSR-DATA-01) — cycle1 PSR-05·15 정정
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3454:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:135:-- v0.1 은 LOGIN role 한 개 (`app_public_reader`) 로 단순화 — production 분리 marker.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3455:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:136:CREATE ROLE app_public_reader LOGIN;
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3456:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:138:GRANT USAGE ON SCHEMA public TO app_public_reader;
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3457:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:143:GRANT SELECT ON instance TO app_public_reader;
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3458:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:148:  TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3459:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:157:  TO app_public_reader;
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3460:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:160:  ON clinic_profile FOR SELECT TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3461:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:164:  ON location_profile FOR SELECT TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3462:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:168:  ON doctor_profile FOR SELECT TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3463:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:175:  ON treatment_page FOR SELECT TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3464:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:184:  ON article FOR SELECT TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3465:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:197:  ON legal_document FOR SELECT TO app_public_reader
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3466:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:205:- (PSR-DATA-02 · cycle1 PSR-05) `app_public_reader` LOGIN — v0.1 단순화. production 단 NOLOGIN + MEMBERSHIP 분리 marker (PSR-DEFER-16 신설).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3467:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:211:- (PSR-DATA-04) `app_public_reader` 는 audit_event INSERT 권한 없음 — 공개 페이지 access log 는 별도 (CDN / Vercel analytics · PSR-DEFER-10).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3468:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:215:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3469:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:561:| 3 | `apps/web/src/lib/public-db.ts` 신규 — `app_public_reader` connection helper (singleton) | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3470:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:563:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3471:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:584:| 9 | tenant A 가 `/<tenantB>` 접근 — A 콘텐츠 미노출, B 콘텐츠만 | RLS app_public_reader USING `instance_id` 정합 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3472:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:604:| 1 | D0011 migration — `app_public_reader` LOGIN + 7개 policy (instance + 6 content table) | packages/db/migrations/D0011_public_reader.sql |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3473:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:623:| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05) | apps/spike-a/userlist.txt |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3474:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:635:- `PSR-DEFER-16` (cycle1 PSR-05): `app_public_reader` NOLOGIN + MEMBERSHIP 분리 production 패턴.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3475:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:666:- `PSR-CASCADE-05`: `apps/spike-a` pgbouncer userlist — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3476:.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:673:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3478:.\apps\spike-a\src\scenarios\test-perf.ts:2:// SPIKEA2-004 정정: 동일 pgbouncer 경로에서 baseline 분리
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3479:.\apps\spike-a\src\scenarios\test-perf.ts:36:  // Baseline 2: dbTenant transaction (pgbouncer 경로·RLS deny) — RLS context 없음. 0 rows 반환
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3499:.\apps\spike-a\package.json:13:    "scenario:pgbouncer-auth": "tsx --env-file=.env src/scenarios/test-pgbouncer-auth.ts",
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3500:.\apps\spike-a\package.json:22:    "scenario:all": "pnpm scenario:pgbouncer-auth && pnpm seed && pnpm scenario:read && pnpm seed && pnpm scenario:write && pnpm seed && pnpm scenario:rollback && pnpm seed && pnpm scenario:nested && pnpm seed && pnpm scenario:audit && pnpm seed && pnpm scenario:negative && pnpm seed && pnpm scenario:invariant && pnpm seed && pnpm scenario:perf",
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3501:.\apps\spike-a\README.md:35:pnpm dotenv -e .env -- pnpm scenario:pgbouncer-auth
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3508:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/PUBLIC_SITE_RENDER_PLAN.md | Select-Object -Skip 343 -First 28' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3540:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/PUBLIC_SITE_RENDER_PLAN.md | Select-Object -Skip 373 -First 18' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3562:# PUBLIC_SITE_RENDER_PLAN v0.2 — cycle 2 review
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3570:- PSR-01: PASS — plan의 10페이지는 `PUBLIC_SITE_RENDER_PLAN.md:42`, `PAGE_TYPES.md:23`, `PAGE_TYPES.md:631-640`과 정합. P-009 제외, P-014 포함, P-010 1샘플.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3571:- PSR-02: PARTIAL — plan은 `/admin/<slug>` 격상을 명시하지만(`PUBLIC_SITE_RENDER_PLAN.md:115-123`), 실제 코드는 아직 `apps/web/src/app/(admin)/[instanceSlug]`이고 root redirect도 `/${result.slug}` (`apps/web/src/app/page.tsx:56`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3572:- PSR-03: PARTIAL — plan은 site layout fragment만 명시(`PUBLIC_SITE_RENDER_PLAN.md:88`, `:123`, `:271`)했으나 실제 root layout class는 plan의 `bg-canvas text-fg-default`가 아니라 `bg-slate-50 text-slate-900` (`apps/web/src/app/layout.tsx:13`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3574:- PSR-05: PASS — instance lookup policy + content table 6개 + legal 포함 총 7 policy가 명시됨(`PUBLIC_SITE_RENDER_PLAN.md:145-200`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3575:- PSR-06: PASS — LegalDocument 공개 404/noindex 방침은 명시됨(`PUBLIC_SITE_RENDER_PLAN.md:233-237`, `:328`, `:583`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3577:- PSR-08: PASS — path-based `@id`와 continuity cascade marker가 있음(`PUBLIC_SITE_RENDER_PLAN.md:540`, `:663`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3578:- PSR-09: PASS — sitemap changefreq/priority 표는 SEARCH_STANDARDIZATION §4.3과 M0 대상 cell 정합(`PUBLIC_SITE_RENDER_PLAN.md:437-446`, `SEARCH_STANDARDIZATION.md:347-362`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3579:- PSR-10: PARTIAL — og:type은 정합(`PUBLIC_SITE_RENDER_PLAN.md:404`, `:424`; `SEARCH_STANDARDIZATION.md:103-123`)이나 themeColor 출처가 SoT와 불일치. 상세 PSR-23.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3580:- PSR-11: PASS — `/insights/[category]/[slug]`, fallback `general`, PSR-DEFER-15가 명시됨(`PUBLIC_SITE_RENDER_PLAN.md:99`, `:647-648`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3581:- PSR-12: PASS — `schema.ts` 실 컬럼과 mapping 표가 주요 entry에서 정합. 예: Treatment `title/body_markdown/published_at`는 `schema.ts:170-184`, plan은 `PUBLIC_SITE_RENDER_PLAN.md:296-300`.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3582:- PSR-13: PASS — semantic 22 alias 전체가 표에 있음(`PUBLIC_SITE_RENDER_PLAN.md:347-369`) and DESIGN_TOKENS §3.2 22개와 정합(`DESIGN_TOKENS.md:178-199`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3583:- PSR-14: PASS — light/dark CSS vars 양쪽 출력 방침 있음(`PUBLIC_SITE_RENDER_PLAN.md:373-388`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3584:- PSR-15: PASS — instance + 6 content table + LegalDocument 총 7 policy 명시(`PUBLIC_SITE_RENDER_PLAN.md:145-200`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3585:- PSR-16: PASS — `legal_document` RLS `status='published'`와 DB CHECK `status='draft'` 충돌은 의도된 0-row 공개 차단(`PUBLIC_SITE_RENDER_PLAN.md:192-200`; `LOCATION_LEGAL_PLAN.md:117-121`, `:145-149`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3586:- PSR-17: PASS — 자체 rule checker LOCAL_PASS, 외부 validator manual QA로 분리(`PUBLIC_SITE_RENDER_PLAN.md:542`, `:652`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3587:- PSR-18: PASS — scenario #1 문구 “보임” 정정됨(`PUBLIC_SITE_RENDER_PLAN.md:576`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3588:- PSR-19: PASS — `sanitize-html` 채택 및 PSR-DEFER-17 명시(`PUBLIC_SITE_RENDER_PLAN.md:331-335`, `:643`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3589:- PSR-20: PASS — rel 값 `nofollow noopener noreferrer` 명시(`PUBLIC_SITE_RENDER_PLAN.md:338`, `:595`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3590:- PSR-21: PARTIAL — checklist는 분해됐지만 PSR-CASCADE-04/05 실 대상 상태가 불완전. 상세 PSR-25/27.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3596:  - plan은 `PerplexityBot`을 학습 차단 그룹에 넣음(`PUBLIC_SITE_RENDER_PLAN.md:489`)인데 SoT는 B “AI 검색 인덱싱·답변용 — Allow”(`SEARCH_STANDARDIZATION.md:216`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3597:  - plan은 `PerplexityBot-User`를 출력(`PUBLIC_SITE_RENDER_PLAN.md:508`)하지만 SoT user-triggered UA는 `Perplexity-User`(`SEARCH_STANDARDIZATION.md:226`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3599:  - plan에는 `Bytespider`, `cohere-ai`, `Diffbot`이 추가됨(`PUBLIC_SITE_RENDER_PLAN.md:486-495`)이나 SoT starter에는 없음(`SEARCH_STANDARDIZATION.md:233-248`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3600:  - 추가로 plan은 enum을 `allowAll`로 표현(`PUBLIC_SITE_RENDER_PLAN.md:460`, `:518`)하지만 SoT enum은 `allow / disallowTraining / disallowAll / custom`(`SEARCH_STANDARDIZATION.md:174-183`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3603:  - plan은 `(admin)/admin/[instanceSlug]` 이동과 sign-in redirect patch를 acceptance precondition으로 둠(`PUBLIC_SITE_RENDER_PLAN.md:115-120`, `:662`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3609:  - plan은 `color.surface.background`를 themeColor로 사용한다고 명시(`PUBLIC_SITE_RENDER_PLAN.md:423`)하고 scenario도 `#f9fafb`를 기대함(`PUBLIC_SITE_RENDER_PLAN.md:596`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3612:- PSR-25 — PSR-CASCADE-04 manifest precondition 미적용.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3613:  - plan은 D0011을 manifest 10단계에 추가해야 한다고 명시(`PUBLIC_SITE_RENDER_PLAN.md:565`, `:622`, `:665`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3617:  - plan은 Footer에 “법적 페이지 링크”를 넣는다고 함(`PUBLIC_SITE_RENDER_PLAN.md:272`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3618:  - 동시에 P-013은 v0.1 항상 404라고 함(`PUBLIC_SITE_RENDER_PLAN.md:233-237`, `:328`, `:583`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3622:  - plan은 root layout이 `<body className="bg-canvas text-fg-default">`라고 전제(`PUBLIC_SITE_RENDER_PLAN.md:252`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3627:- PSR-27 — PSR-CASCADE-05 파일 경로가 stale.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3628:  - plan은 `apps/spike-a/userlist.txt` 또는 `apps/spike-a/...userlist.txt`를 가리킴(`PUBLIC_SITE_RENDER_PLAN.md:563`, `:623`, `:666`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3632:## acceptance precondition (PSR-CASCADE-01~05) 재점검
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3633:- PSR-CASCADE-01: FAIL — code route/sign-in/root redirect/revalidate cascade 미적용. 현재 `(admin)/[instanceSlug]` 구조와 `/${slug}` redirect 잔존.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3634:- PSR-CASCADE-02: TBD — plan marker는 있으나 `SCHEMA_MAPPING.md` §1.2 자체는 아직 domain-only SoT(`SCHEMA_MAPPING.md:52-66`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3635:- PSR-CASCADE-03: TBD — `M0_BUILD_EXPORT_PLAN.md`는 placeholder 수준이고 본 plan SSR component 재사용 marker는 확인되지 않음.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3636:- PSR-CASCADE-04: FAIL — `manifest.ts`에 D0011 10단계 추가 없음.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3637:- PSR-CASCADE-05: FAIL — 대상 경로 stale + `app_public_reader` userlist 추가 확인 안 됨.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3640:# PUBLIC_SITE_RENDER_PLAN v0.2 — cycle 2 review
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3648:- PSR-01: PASS — plan의 10페이지는 `PUBLIC_SITE_RENDER_PLAN.md:42`, `PAGE_TYPES.md:23`, `PAGE_TYPES.md:631-640`과 정합. P-009 제외, P-014 포함, P-010 1샘플.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3649:- PSR-02: PARTIAL — plan은 `/admin/<slug>` 격상을 명시하지만(`PUBLIC_SITE_RENDER_PLAN.md:115-123`), 실제 코드는 아직 `apps/web/src/app/(admin)/[instanceSlug]`이고 root redirect도 `/${result.slug}` (`apps/web/src/app/page.tsx:56`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3650:- PSR-03: PARTIAL — plan은 site layout fragment만 명시(`PUBLIC_SITE_RENDER_PLAN.md:88`, `:123`, `:271`)했으나 실제 root layout class는 plan의 `bg-canvas text-fg-default`가 아니라 `bg-slate-50 text-slate-900` (`apps/web/src/app/layout.tsx:13`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3652:- PSR-05: PASS — instance lookup policy + content table 6개 + legal 포함 총 7 policy가 명시됨(`PUBLIC_SITE_RENDER_PLAN.md:145-200`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3653:- PSR-06: PASS — LegalDocument 공개 404/noindex 방침은 명시됨(`PUBLIC_SITE_RENDER_PLAN.md:233-237`, `:328`, `:583`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3655:- PSR-08: PASS — path-based `@id`와 continuity cascade marker가 있음(`PUBLIC_SITE_RENDER_PLAN.md:540`, `:663`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3656:- PSR-09: PASS — sitemap changefreq/priority 표는 SEARCH_STANDARDIZATION §4.3과 M0 대상 cell 정합(`PUBLIC_SITE_RENDER_PLAN.md:437-446`, `SEARCH_STANDARDIZATION.md:347-362`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3657:- PSR-10: PARTIAL — og:type은 정합(`PUBLIC_SITE_RENDER_PLAN.md:404`, `:424`; `SEARCH_STANDARDIZATION.md:103-123`)이나 themeColor 출처가 SoT와 불일치. 상세 PSR-23.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3658:- PSR-11: PASS — `/insights/[category]/[slug]`, fallback `general`, PSR-DEFER-15가 명시됨(`PUBLIC_SITE_RENDER_PLAN.md:99`, `:647-648`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3659:- PSR-12: PASS — `schema.ts` 실 컬럼과 mapping 표가 주요 entry에서 정합. 예: Treatment `title/body_markdown/published_at`는 `schema.ts:170-184`, plan은 `PUBLIC_SITE_RENDER_PLAN.md:296-300`.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3660:- PSR-13: PASS — semantic 22 alias 전체가 표에 있음(`PUBLIC_SITE_RENDER_PLAN.md:347-369`) and DESIGN_TOKENS §3.2 22개와 정합(`DESIGN_TOKENS.md:178-199`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3661:- PSR-14: PASS — light/dark CSS vars 양쪽 출력 방침 있음(`PUBLIC_SITE_RENDER_PLAN.md:373-388`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3662:- PSR-15: PASS — instance + 6 content table + LegalDocument 총 7 policy 명시(`PUBLIC_SITE_RENDER_PLAN.md:145-200`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3663:- PSR-16: PASS — `legal_document` RLS `status='published'`와 DB CHECK `status='draft'` 충돌은 의도된 0-row 공개 차단(`PUBLIC_SITE_RENDER_PLAN.md:192-200`; `LOCATION_LEGAL_PLAN.md:117-121`, `:145-149`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3664:- PSR-17: PASS — 자체 rule checker LOCAL_PASS, 외부 validator manual QA로 분리(`PUBLIC_SITE_RENDER_PLAN.md:542`, `:652`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3665:- PSR-18: PASS — scenario #1 문구 “보임” 정정됨(`PUBLIC_SITE_RENDER_PLAN.md:576`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3666:- PSR-19: PASS — `sanitize-html` 채택 및 PSR-DEFER-17 명시(`PUBLIC_SITE_RENDER_PLAN.md:331-335`, `:643`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3667:- PSR-20: PASS — rel 값 `nofollow noopener noreferrer` 명시(`PUBLIC_SITE_RENDER_PLAN.md:338`, `:595`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3668:- PSR-21: PARTIAL — checklist는 분해됐지만 PSR-CASCADE-04/05 실 대상 상태가 불완전. 상세 PSR-25/27.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3674:  - plan은 `PerplexityBot`을 학습 차단 그룹에 넣음(`PUBLIC_SITE_RENDER_PLAN.md:489`)인데 SoT는 B “AI 검색 인덱싱·답변용 — Allow”(`SEARCH_STANDARDIZATION.md:216`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3675:  - plan은 `PerplexityBot-User`를 출력(`PUBLIC_SITE_RENDER_PLAN.md:508`)하지만 SoT user-triggered UA는 `Perplexity-User`(`SEARCH_STANDARDIZATION.md:226`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3677:  - plan에는 `Bytespider`, `cohere-ai`, `Diffbot`이 추가됨(`PUBLIC_SITE_RENDER_PLAN.md:486-495`)이나 SoT starter에는 없음(`SEARCH_STANDARDIZATION.md:233-248`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3678:  - 추가로 plan은 enum을 `allowAll`로 표현(`PUBLIC_SITE_RENDER_PLAN.md:460`, `:518`)하지만 SoT enum은 `allow / disallowTraining / disallowAll / custom`(`SEARCH_STANDARDIZATION.md:174-183`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3681:  - plan은 `(admin)/admin/[instanceSlug]` 이동과 sign-in redirect patch를 acceptance precondition으로 둠(`PUBLIC_SITE_RENDER_PLAN.md:115-120`, `:662`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3687:  - plan은 `color.surface.background`를 themeColor로 사용한다고 명시(`PUBLIC_SITE_RENDER_PLAN.md:423`)하고 scenario도 `#f9fafb`를 기대함(`PUBLIC_SITE_RENDER_PLAN.md:596`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3690:- PSR-25 — PSR-CASCADE-04 manifest precondition 미적용.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3691:  - plan은 D0011을 manifest 10단계에 추가해야 한다고 명시(`PUBLIC_SITE_RENDER_PLAN.md:565`, `:622`, `:665`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3695:  - plan은 Footer에 “법적 페이지 링크”를 넣는다고 함(`PUBLIC_SITE_RENDER_PLAN.md:272`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3696:  - 동시에 P-013은 v0.1 항상 404라고 함(`PUBLIC_SITE_RENDER_PLAN.md:233-237`, `:328`, `:583`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3700:  - plan은 root layout이 `<body className="bg-canvas text-fg-default">`라고 전제(`PUBLIC_SITE_RENDER_PLAN.md:252`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3705:- PSR-27 — PSR-CASCADE-05 파일 경로가 stale.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3706:  - plan은 `apps/spike-a/userlist.txt` 또는 `apps/spike-a/...userlist.txt`를 가리킴(`PUBLIC_SITE_RENDER_PLAN.md:563`, `:623`, `:666`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3710:## acceptance precondition (PSR-CASCADE-01~05) 재점검
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3711:- PSR-CASCADE-01: FAIL — code route/sign-in/root redirect/revalidate cascade 미적용. 현재 `(admin)/[instanceSlug]` 구조와 `/${slug}` redirect 잔존.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3712:- PSR-CASCADE-02: TBD — plan marker는 있으나 `SCHEMA_MAPPING.md` §1.2 자체는 아직 domain-only SoT(`SCHEMA_MAPPING.md:52-66`).
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3713:- PSR-CASCADE-03: TBD — `M0_BUILD_EXPORT_PLAN.md`는 placeholder 수준이고 본 plan SSR component 재사용 marker는 확인되지 않음.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3714:- PSR-CASCADE-04: FAIL — `manifest.ts`에 D0011 10단계 추가 없음.
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3715:- PSR-CASCADE-05: FAIL — 대상 경로 stale + `app_public_reader` userlist 추가 확인 안 됨.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.prompt.md:1:You are reviewing **cycle 5** of `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.5. Cycle 4 had 1 minor finding (PSR-31 stale SoT summary 3 lines). Patched.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.prompt.md:4:- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` § 5.3 robots.txt 위 SoT 요약 3줄 정정:
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.prompt.md:14:3. 5 PSR-CASCADE 모두 PASS 잔존
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.prompt.md:21:# PUBLIC_SITE_RENDER_PLAN v0.5 — cycle 5 review
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.prompt.md:31:## 5 PSR-CASCADE 최종 확정
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:14:You are reviewing **cycle 3** of `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.3. Cycle 2 had **7 findings** (2 blocking + 4 major + 1 minor). All were patched. Verify convergence and surface remaining issues.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:22:| PSR-24 | blocking | admin URL cascade 미적용 | PSR-CASCADE-01 a/b 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:29:- `docs/core/SCHEMA_MAPPING.md` § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:30:- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:35:- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.3
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:53:   - PSR-CASCADE-02 SCHEMA_MAPPING § 1.2 path-based 표 — entity continuity 전환 룰 sound
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:54:   - PSR-CASCADE-03 M0_BUILD_EXPORT_PLAN § 2.1 SSR 재사용 표 — apps/worker 구현 시 컴포넌트 재사용 정합
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:61:3. **acceptance precondition (PSR-CASCADE-01~05) 최종 점검**:
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:62:   - PSR-CASCADE-01a: docs/admin/ARCHITECTURE.md § 3 patch — 아직 적용 안 됨 (TBD/FAIL)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:63:   - PSR-CASCADE-02: SCHEMA_MAPPING § 1.2 — PASS (적용)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:64:   - PSR-CASCADE-03: M0_BUILD_EXPORT_PLAN § 2.1 — PASS (적용)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:65:   - PSR-CASCADE-04: manifest.ts D0011 — PASS (적용)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:66:   - PSR-CASCADE-05: pgbouncer userlist.txt — 아직 미적용 (코드 cascade) — TBD/FAIL
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:67:   - PSR-CASCADE-01b: code v1.0 cycle 분리 marker — 본 plan acceptance 의 acceptance precondition 외
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:78:# PUBLIC_SITE_RENDER_PLAN v0.3 — cycle 3 review
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:90:## acceptance precondition (PSR-CASCADE-01~05) 최종 점검
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:91:- PSR-CASCADE-01a: <PASS|FAIL|TBD>
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:92:- PSR-CASCADE-01b: <plan acceptance 외 — code v1.0 cycle marker>
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:93:- PSR-CASCADE-02: <PASS|FAIL|TBD>
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:94:- PSR-CASCADE-03: <PASS|FAIL|TBD>
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:95:- PSR-CASCADE-04: <PASS|FAIL|TBD>
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:96:- PSR-CASCADE-05: <PASS|FAIL|TBD>
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:108:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "PSR-22|PSR-23|PSR-24|PSR-25|PSR-26|PSR-27|PSR-28|PSR-CASCADE|robots.txt|themeColor|D0011|pgbouncer|root layout|className|Footer|legal|LegalDocument|admin|SCHEMA_MAPPING|M0_BUILD_EXPORT" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:110:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "PerplexityBot|Perplexity-User|Googlebot|Bingbot|Claude-User|Bytespider|cohere-ai|Diffbot|robots.txt|User-agent|Disallow|Allow" docs/core/SEARCH_STANDARDIZATION.md docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:114:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "BrandTokens|themeColor|color.brand.primary|primary|light|dark|§ 2.1|2.1" docs/core/SEARCH_STANDARDIZATION.md docs/core/DESIGN_TOKENS.md docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:116:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:13:- `docs/core/SEARCH_STANDARDIZATION.md` — § 2 메타 태그 표준 (theme-color · og:type 매핑) · § 3 robots.txt (aiCrawlerPolicy + 4계열 user-agent + disallowTraining starter) · § 4.3 sitemap changefreq/priority · § 5 canonical resolve.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:117:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:49:| sitemap.xml · robots.txt (cycle1 PSR-04·09 정정) | per-instance · SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` required + § 4.3 changefreq/priority SoT 정합 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:118:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:105:│     ├─ robots.txt/route.ts             -- per-instance robots
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:119:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:456:### 5.3 robots.txt — cycle1 PSR-04 정정 (PSR-SEO-08)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:120:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:458:- `apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts` — Next Route Handler.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:121:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:468:# robots.txt — auto-generated (Glitzy · SEARCH_STANDARDIZATION § 3.3 disallowTraining)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:122:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:471:User-agent: *
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:123:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:472:Disallow: /admin/
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:124:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:473:Disallow: /auth/
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:125:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:474:Disallow: /api/
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:126:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:475:Allow: /
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:127:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:477:# A. 일반 검색 색인 — Allow
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:128:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:478:User-agent: Googlebot
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:129:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:479:Allow: /
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:130:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:481:User-agent: Yeti
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:131:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:482:Allow: /
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:132:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:484:User-agent: Bingbot
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:133:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:485:Allow: /
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:134:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:487:# B. AI 검색 인덱싱·답변용 — Allow
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:135:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:488:User-agent: OAI-SearchBot
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:136:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:489:Allow: /
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:137:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:491:User-agent: PerplexityBot
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:138:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:492:Allow: /
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:139:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:494:User-agent: Claude-SearchBot
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:140:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:495:Allow: /
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:141:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:497:# C. User-triggered fetch — Allow (best-effort · § 3.1 주의)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:142:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:498:User-agent: ChatGPT-User
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:143:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:499:Allow: /
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:144:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:501:User-agent: Perplexity-User
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:145:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:502:Allow: /
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:146:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:504:User-agent: Claude-User
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:147:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:505:Allow: /
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:148:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:507:# D. AI 학습·모델 개선용 — Disallow
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:149:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:508:User-agent: GPTBot
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:150:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:509:Disallow: /
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:151:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:511:User-agent: ClaudeBot
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:152:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:512:Disallow: /
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:153:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:514:User-agent: Google-Extended
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:154:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:515:Disallow: /
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:155:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:517:User-agent: CCBot
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:156:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:518:Disallow: /
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:157:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:520:User-agent: anthropic-ai
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:158:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:521:Disallow: /
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:159:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:529:  - `allow` (= 학습 포함 전체 허용): D 계열 모두 Allow + `aiCrawlerLegalApproved: true` 필수 (fail-gate)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:160:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:530:  - `disallowAll`: B·C·D 계열 모두 Disallow (A 만 Allow)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:161:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:601:| 12 | `/<instanceSlug>/robots.txt` 응답 | SEARCH_STANDARDIZATION § 3 v0.1 starter `disallowTraining` 정합 (학습 봇 Disallow + 답변 봇 Allow + Naver Yeti Allow) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:162:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:630:| 13 | sitemap.xml + robots.txt route handler (SEARCH_STANDARDIZATION 정합) | apps/web/src/app/(site)/[instanceSlug]/{sitemap.xml,robots.txt}/route.ts |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:163:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:689:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:164:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:690:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:283:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:7:> **scope limit (PSR-INTRO-01)**: 본 plan 은 **SSR + Next ISR** 만 다룬다. static export to Git · 도메인 매핑 (subdomain / custom domain) · CDN cache 정책 · Open Graph 이미지 동적 생성 · dark mode UI toggle 등은 M0 v1.0 본 구현 / M1 cascade. v0.1 은 `/<instanceSlug>/...` path-based routing 으로 **개발자가 접근 가능한 단계** 까지.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:284:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:16:- `docs/core/DESIGN_TOKENS.md` v1.0 — 3-tier 토큰 (primitive·semantic·component) · § 3.2 light/dark semantic 22 · § 3.3 `data-theme="light"|"dark"` 분기 · semantic naming SoT (`color.surface.background` 등).
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:285:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:18:- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — ClinicProfile 3계약 + LegalDocument 5종 + primaryCtas + businessHours · LegalDocument DB CHECK `status='draft' AND risk_level='Low' AND published_at IS NULL` (LL-SCHEMA-03·06).
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:286:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:48:| Next metadata API + theme-color + og:type 매핑 (cycle1 PSR-10 정정) | title · description · canonical · OpenGraph · Twitter · robots · `themeColor` 2값 (light/dark) · og:type P-004 `profile`, P-006/P-010 `article`, 기타 `website` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:287:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:50:| 디자인 토큰 통합 + light/dark CSS vars 출력 (cycle1 PSR-13·14 정정) | Tailwind v3.4 + DESIGN_TOKENS v1.0 semantic 22 alias 표. CSS custom property 는 light/dark 둘 다 출력. UI toggle 만 defer |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:288:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:62:| dark mode UI toggle | M1 Phase Alpha — CSS vars 는 v0.1 부터 두 테마 출력 (DESIGN_TOKENS § 3.3) · PSR-14 정합 | PSR-DEFER-03 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:289:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:78:### 2.1 route group 구조 (PSR-ROUTE-01) — cycle1 PSR-02·03 정정
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:290:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:123:- (PSR-ROUTE-03 · cycle1 PSR-03 patch) site layout 은 fragment 만 — `<html>`/`<body>` 중복 출력 금지. root layout 의 `<html lang="ko-KR">` SoT 유지. site layout 안 클래스/테마 처리는 `<body>` 의 추가 className 으로 root layout 이 segment-aware 분기 — 또는 별 wrapper `<div data-theme="light" data-site>` 구조 채택.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:291:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:252:- `apps/web/src/app/layout.tsx` (root · 본 plan acceptance commit 안 patch) — `<html lang="ko-KR" data-theme="light">` + `<body className="bg-canvas text-fg-default">`. **모든 segment 가 root layout 의 html/body 공유**.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:292:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:273:- (PSR-COMP-03 · cycle2 PSR-26 정정) Header: ClinicProfile.name + 네비 (Home · About · Doctors · Treatments · Contact · Locations · CTA primaryCtas[0]). Footer: 주소·전화·진료시간. **법적 페이지 5종 링크는 v0.1 단계 숨김** — LegalDocument 공개 노출이 PSR-DEFER-13 (= LL-DEFER-01 alias) 합류 시점까지 404 이므로 broken link 회피. 합류 후 Footer 에 동적 추가 (LegalDocument 가 published 상태 row 가 존재할 때만 렌더).
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:293:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:288:| ClinicProfile | `primary_ctas` (JSONB) | C-01 `primaryCtas[]` | CTA buttons |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:294:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:328:| P-012 Contact | `<ContactHero>` · `<BusinessHoursTable>` (CT-02 SoT 형식 — 7요일 + 점심 + 특수 휴진) · `<ReservationChannels>` (primaryCtas[]) | LocationMain + ClinicProfile.primary_ctas |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:295:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:338:- 허용 속성: 전 태그 `class`/`id`/`lang` · `a` 만 `href`/`rel`/`target` · `code`/`pre` `class` (syntax highlight)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:296:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:351:| `text-fg-default` · `text-primary-fg` | `color.text.primary` | `--color-text-primary` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:297:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:357:| `bg-brand` · `text-brand` | `color.brand.primary` | `--color-brand-primary` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:298:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:358:| `bg-brand-hover` | `color.brand.primary.hover` | `--color-brand-primary-hover` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:299:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:374:- (PSR-COMP-12 · cycle1 PSR-14) light/dark CSS vars 둘 다 출력. `apps/web/src/styles/globals.css`:
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:300:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:377::root, [data-theme="light"] {
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:301:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:379:  --color-text-primary: #111827;        /* gray.900 */
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:302:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:380:  /* ... 22 토큰 모두 light 값 */
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:303:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:382:[data-theme="dark"] {
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:304:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:384:  --color-text-primary: #f9fafb;        /* gray.50 */
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:305:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:385:  /* ... 22 토큰 모두 dark 값 */
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:306:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:389:  - root layout 안 `<html data-theme="light">` 고정 v0.1. UI toggle 만 defer (PSR-DEFER-03).
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:307:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:416:  themeColor: [
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:308:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:417:    { media: "(prefers-color-scheme: light)", color: "<BrandTokens.colors.light.primary>" },  // 평면화 결과 (DESIGN_TOKENS § 6 BrandTokens · `color.brand.primary` light)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:309:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:418:    { media: "(prefers-color-scheme: dark)", color: "<BrandTokens.colors.dark.primary>" },    // 평면화 결과 — `color.brand.primary` dark
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:310:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:424:- (PSR-SEO-02 · cycle1 PSR-10 + cycle2 PSR-23 정정) `themeColor` 2값 출처 — DESIGN_TOKENS § 6 `BrandTokens.colors.light.primary` / `BrandTokens.colors.dark.primary` (= `color.brand.primary` 의 light/dark 평면화 결과). 인스턴스별 brandTokens 미주입 단계 (v0.1) 는 DESIGN_TOKENS § 3.2 default `color.brand.primary` light = `blue.600` (#2563eb) / dark = `blue.400` (#60a5fa) fallback. SEARCH_STANDARDIZATION § 2.1 정합.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:311:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:580:| 8 | Tailwind v0.2 patch — DESIGN_TOKENS v1.0 semantic 22 alias + globals.css 안 CSS vars (light + dark 양쪽) | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:312:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:590:| 1 | 어드민이 저장한 ClinicProfile 가 `/<instanceSlug>` (P-001 Home) 에 정확히 표시 | name · description · primaryCtas[0].label 가 페이지 안 **보임** (cycle1 PSR-18 정정) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:313:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:605:| 16 | dark mode CSS vars 출력 (UI toggle 미지원) | `[data-theme="dark"]` 블록 안 22개 토큰 모두 dark 값 정의 — 자체 rule checker (LOCAL_PASS) · UI toggle 은 marker 만 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:314:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:610:| 21 | Next metadata API `themeColor` 2값 (light + dark) 출력 — cycle1 PSR-10 | `<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f9fafb">` + dark 변형 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:315:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:629:| 12 | Next metadata API (페이지별 generateMetadata · themeColor · og:type) | 각 page.tsx 안 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:316:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:631:| 14 | Tailwind v0.2 patch — DESIGN_TOKENS v1.0 semantic 22 alias + globals.css light/dark | apps/web/tailwind.config.ts · src/styles/globals.css |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:317:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:653:- `PSR-DEFER-03`: dark mode UI toggle (CSS vars 는 v0.1 부터 두 테마 출력 — DESIGN_TOKENS § 3.3 정합).
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:318:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:689:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:319:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:690:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:431:26:  - `apps/web/src/app/sign-in/...` (consume route — redirect target `/<firstSlug>` → `/admin/<firstSlug>` 로 patch · PSR-CASCADE-01)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:432:41:| **어드민 URL prefix `/admin/<instanceSlug>/...`** (cycle1 PSR-02 격상) | 공개 path namespace 와 분리. acceptance precondition. 코드 cascade (PSR-CASCADE-01) 동시 적용 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:447:107:├─ sign-in/...                           -- (변경: consume redirect target `/admin/<slug>` · PSR-CASCADE-01)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:461:215:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:487:426:- (PSR-SEO-04) canonical v0.1: `https://<host>/<instanceSlug><path>` path-based. M0 v1.0 도메인 매핑 합류 시 entity continuity migration (PSR-CASCADE-02 참조).
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:499:554:- (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:502:577:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:503:579:| 7 | `packages/migrations-runner/src/manifest.ts` v0.x — D0011 10단계 추가 (PSR-CASCADE-04) | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:504:582:| 10 | LOCATION_LEGAL code v1.1 cascade — admin URL 변경 (PSR-CASCADE-01) 의 revalidatePath 6 곳 patch | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:505:583:| 11 | ADMIN_UI_SKELETON code v1.1 cascade — sign-in/consume redirect `/admin/<slug>` (PSR-CASCADE-01) | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:506:584:| 12 | apps/web seed scenario 도 admin URL 변경 정합 (`apps/web/src/seed.ts`) | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:509:604:| 15 | 어드민 측 도메인 (`/admin/<slug>/...`) 와 공개 도메인 (`/<slug>/...`) 충돌 없음 — PSR-CASCADE-01 정합 | 어드민 prefix `/admin` · 공개 prefix 없음. sign-in consume redirect `/admin/<firstSlug>` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:514:632:| 15 | **어드민 URL `/admin` prefix 격상 (PSR-CASCADE-01)** | apps/web/src/app/(admin)/admin/[instanceSlug]/ 디렉토리 이동 + revalidatePath 6 곳 + sign-in/consume redirect target + seed.ts |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:515:633:| 16 | docs/admin/ARCHITECTURE.md § 3 patch — `(site)` 신설 + `/admin` prefix (PSR-CASCADE-01) | doc |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:516:634:| 17 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` marker + entity continuity note (PSR-CASCADE-02) | doc |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:517:635:| 18 | docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2 patch — apps/worker 가 본 plan SSR 컴포넌트 재사용 marker (PSR-CASCADE-03) | doc |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:518:636:| 19 | packages/migrations-runner manifest 10단계 (D0011 추가 — PSR-CASCADE-04) | manifest.ts |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:519:637:| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05 · cycle2 PSR-27 경로 정정) | apps/spike-a/pgbouncer/userlist.txt |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:521:674:> **acceptance 순서 정합 (LL-33 패턴)**: PSR-CASCADE-01~05 는 plan v1.0 acceptance 와 **동시 또는 직전** 에 적용. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:522:676:- `PSR-CASCADE-01` (cycle1 PSR-02 격상 + cycle2 PSR-24 a/b 분리):
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:523:677:  - **PSR-CASCADE-01a (docs · plan acceptance commit 안 동반)**: `docs/admin/ARCHITECTURE.md` § 3 patch — `(site)` 신설 + `/admin` prefix 격상 marker.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:524:678:  - **PSR-CASCADE-01b (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEGAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · doctors · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/seed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance ≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 에서 별도 사이클 진행.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:525:679:- `PSR-CASCADE-02` (cycle1 PSR-08 보강): `docs/core/SCHEMA_MAPPING.md` § 1.2 patch — v0.1 임시 path-based `@id` 패턴 + 도메인 매핑 후 (M0 v1.0) entity @id 전환 시 redirect/301/`sameAs` 처리 룰 추가 marker.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:526:680:- `PSR-CASCADE-03`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 patch — apps/worker 의 build/export 시점에 본 plan SSR 컴포넌트 + JSON-LD 생성기 + sitemap/robots route handler 재사용 marker.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:527:681:- `PSR-CASCADE-04`: `packages/migrations-runner/src/manifest.ts` — D0011 10단계 추가 (현 9단계 → 10단계).
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:528:682:- `PSR-CASCADE-05` (cycle2 PSR-27 경로 정정): `apps/spike-a/pgbouncer/userlist.txt` — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade). 본 파일은 `apps/spike-a/docker-compose.yml` 의 pgbouncer 컨테이너에 mount 되는 정확 경로.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:529:689:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:530:690:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:535:23: * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 + PUBLIC_SITE_RENDER_PLAN v0.x § 8/§ 10 의 D0011 (10단계 — PSR-25/PSR-CASCADE-04 patch).
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:607:- 시나리오 LOCAL_PASS — 발행 트리거 → Git commit → 빌드 성공.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:609:### 2.1 PUBLIC_SITE_RENDER_PLAN SSR 컴포넌트 재사용 (PSR-CASCADE-03)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:611:`PUBLIC_SITE_RENDER_PLAN.md` v0.x 가 apps/web 안 `(site)` route group · SSR + Next ISR 로 먼저 공개 페이지를 렌더한다 (Phase 0). 본 M0 v1.0 본 구현 시점에 같은 컴포넌트 트리를 정적 build/export 로 재사용한다:
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:623:본 § 2.1 은 `PUBLIC_SITE_RENDER_PLAN` 의 acceptance precondition cascade (PSR-CASCADE-03) — apps/worker 구현 시 별도 컴포넌트 작성 부담 없음. 본 plan v1.0 합류 시 § 2.1 상세화.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:670:#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:672:`PUBLIC_SITE_RENDER_PLAN.md` v0.x § 5.4 PSR-SEO-12 의 SSR + path-based routing 단계 (Phase 0) 에서는 도메인 매핑 (subdomain/custom domain) 합류 전이므로 **임시로 instanceSlug 가 path 에 들어간 `@id` 패턴** 을 사용한다:
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:752: * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 + PUBLIC_SITE_RENDER_PLAN v0.x § 8/§ 10 의 D0011 (10단계 — PSR-25/PSR-CASCADE-04 patch).
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:831:  // (10) app_public_reader role + per-table SELECT policy 7개 (PUBLIC_SITE_RENDER_PLAN v0.x · PSR-25 / PSR-CASCADE-04 patch)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:931:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"site|PUBLIC_SITE_RENDER|/admin|페이지 타입 9종|10 페이지|route group|\\(site\\)|PSR-CASCADE|admin prefix|prefix\" docs/admin/ARCHITECTURE.md" in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:935:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "PUBLIC_SITE_RENDER|SSR|Hero|About|DoctorCard|TreatmentCard|ArticleBody|ContactCard|LegalRenderer|LocationCard|Footer|Header|BreadcrumbList|json-ld|robots|sitemap|markdown|Tailwind|globals.css" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md docs/decisions/M0_BUILD_EXPORT_PLAN.md' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:937:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "themeColor|theme-color|#f9fafb|#2563eb|BrandTokens.colors.light.primary|color.surface.background|color.brand.primary" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md docs/core/SEARCH_STANDARDIZATION.md docs/core/DESIGN_TOKENS.md' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:995:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:13:- `docs/core/SEARCH_STANDARDIZATION.md` — § 2 메타 태그 표준 (theme-color · og:type 매핑) · § 3 robots.txt (aiCrawlerPolicy + 4계열 user-agent + disallowTraining starter) · § 4.3 sitemap changefreq/priority · § 5 canonical resolve.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:996:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:16:- `docs/core/DESIGN_TOKENS.md` v1.0 — 3-tier 토큰 (primitive·semantic·component) · § 3.2 light/dark semantic 22 · § 3.3 `data-theme="light"|"dark"` 분기 · semantic naming SoT (`color.surface.background` 등).
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:997:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:34:- 노출 의도 일직선: SEARCH_STANDARDIZATION 정합 robots/sitemap/canonical · schema.org JSON-LD · Next.js metadata · theme-color · OpenGraph · 자체 JSON-LD rule checker 같은 검색·AI 인용 신호를 v0.1 단계부터 표준 정합으로 출력.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:998:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:48:| Next metadata API + theme-color + og:type 매핑 (cycle1 PSR-10 정정) | title · description · canonical · OpenGraph · Twitter · robots · `themeColor` 2값 (light/dark) · og:type P-004 `profile`, P-006/P-010 `article`, 기타 `website` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:999:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:348:| `bg-canvas` · `bg-surface` | `color.surface.background` | `--color-surface-background` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1000:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:357:| `bg-brand` · `text-brand` | `color.brand.primary` | `--color-brand-primary` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1001:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:358:| `bg-brand-hover` | `color.brand.primary.hover` | `--color-brand-primary-hover` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1002:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:373:- (PSR-COMP-11 · cycle1 PSR-13) Tailwind alias 는 semantic 22 round-trip 보장 — `bg-canvas` ↔ `color.surface.background` ↔ `--color-surface-background`. 본 표가 SoT.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1003:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:378:  --color-surface-background: #f9fafb;  /* gray.50 */
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1004:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:383:  --color-surface-background: #111827;  /* gray.900 */
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1005:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:384:  --color-text-primary: #f9fafb;        /* gray.50 */
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1006:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:416:  themeColor: [
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1007:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:417:    { media: "(prefers-color-scheme: light)", color: "<BrandTokens.colors.light.primary>" },  // 평면화 결과 (DESIGN_TOKENS § 6 BrandTokens · `color.brand.primary` light)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1008:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:418:    { media: "(prefers-color-scheme: dark)", color: "<BrandTokens.colors.dark.primary>" },    // 평면화 결과 — `color.brand.primary` dark
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1009:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:424:- (PSR-SEO-02 · cycle1 PSR-10 + cycle2 PSR-23 정정) `themeColor` 2값 출처 — DESIGN_TOKENS § 6 `BrandTokens.colors.light.primary` / `BrandTokens.colors.dark.primary` (= `color.brand.primary` 의 light/dark 평면화 결과). 인스턴스별 brandTokens 미주입 단계 (v0.1) 는 DESIGN_TOKENS § 3.2 default `color.brand.primary` light = `blue.600` (#2563eb) / dark = `blue.400` (#60a5fa) fallback. SEARCH_STANDARDIZATION § 2.1 정합.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1010:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:610:| 21 | Next metadata API `themeColor` 2값 (light + dark) 출력 — cycle1 PSR-10 | `<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f9fafb">` + dark 변형 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1011:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:629:| 12 | Next metadata API (페이지별 generateMetadata · themeColor · og:type) | 각 page.tsx 안 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1012:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:689:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1013:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:690:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1016:docs/decisions/M0_BUILD_EXPORT_PLAN.md:51:### 2.1 PUBLIC_SITE_RENDER_PLAN SSR 컴포넌트 재사용 (PSR-CASCADE-03)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1017:docs/decisions/M0_BUILD_EXPORT_PLAN.md:53:`PUBLIC_SITE_RENDER_PLAN.md` v0.x 가 apps/web 안 `(site)` route group · SSR + Next ISR 로 먼저 공개 페이지를 렌더한다 (Phase 0). 본 M0 v1.0 본 구현 시점에 같은 컴포넌트 트리를 정적 build/export 로 재사용한다:
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1023:docs/decisions/M0_BUILD_EXPORT_PLAN.md:65:본 § 2.1 은 `PUBLIC_SITE_RENDER_PLAN` 의 acceptance precondition cascade (PSR-CASCADE-03) — apps/worker 구현 시 별도 컴포넌트 작성 부담 없음. 본 plan v1.0 합류 시 § 2.1 상세화.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1024:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:5:본 문서는 `apps/web` 안에 **`(site)` route group**(공개 사이트)을 신설하고, 어드민 route 도 동시에 **`/admin/<instanceSlug>/...`** prefix 로 격상해 path namespace 충돌을 해소한다. 어드민에서 저장한 6 entity (ClinicProfile · LocationProfile · DoctorProfile · TreatmentPage · Article · LegalDocument)를 minimal 디자인 + 정합 JSON-LD + SEARCH_STANDARDIZATION v1.1 정합 robots/sitemap 과 함께 렌더한다.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1025:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:7:> **scope limit (PSR-INTRO-01)**: 본 plan 은 **SSR + Next ISR** 만 다룬다. static export to Git · 도메인 매핑 (subdomain / custom domain) · CDN cache 정책 · Open Graph 이미지 동적 생성 · dark mode UI toggle 등은 M0 v1.0 본 구현 / M1 cascade. v0.1 은 `/<instanceSlug>/...` path-based routing 으로 **개발자가 접근 가능한 단계** 까지.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1026:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:13:- `docs/core/SEARCH_STANDARDIZATION.md` — § 2 메타 태그 표준 (theme-color · og:type 매핑) · § 3 robots.txt (aiCrawlerPolicy + 4계열 user-agent + disallowTraining starter) · § 4.3 sitemap changefreq/priority · § 5 canonical resolve.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1027:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:24:  - `packages/core-content/src/schema.ts` v0.3 (Drizzle SoT — 실 column 명: `title`/`body_markdown`)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1028:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:33:- M0 v1.0 본 구현(static export to Git) 의 콘텐츠 변환 룰(JSON-LD·SEO meta·페이지 graph)을 v0.1 SSR 시점에 미리 확정 → 본 구현 시점에 코드 재사용.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1029:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:34:- 노출 의도 일직선: SEARCH_STANDARDIZATION 정합 robots/sitemap/canonical · schema.org JSON-LD · Next.js metadata · theme-color · OpenGraph · 자체 JSON-LD rule checker 같은 검색·AI 인용 신호를 v0.1 단계부터 표준 정합으로 출력.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1030:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:45:| SSR + Next ISR | `export const revalidate = 60` minimal |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1031:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:46:| 페이지 컴포넌트 minimal | Hero · About · DoctorCard · TreatmentCard · ArticleBody · ContactCard · LegalRenderer · LocationCard · Footer · Header · BreadcrumbList |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1032:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:48:| Next metadata API + theme-color + og:type 매핑 (cycle1 PSR-10 정정) | title · description · canonical · OpenGraph · Twitter · robots · `themeColor` 2값 (light/dark) · og:type P-004 `profile`, P-006/P-010 `article`, 기타 `website` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1033:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:49:| sitemap.xml · robots.txt (cycle1 PSR-04·09 정정) | per-instance · SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` required + § 4.3 changefreq/priority SoT 정합 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1034:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:50:| 디자인 토큰 통합 + light/dark CSS vars 출력 (cycle1 PSR-13·14 정정) | Tailwind v3.4 + DESIGN_TOKENS v1.0 semantic 22 alias 표. CSS custom property 는 light/dark 둘 다 출력. UI toggle 만 defer |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1035:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:53:| Markdown sanitizer SSR 정합 (cycle1 PSR-19·20 정정) | `sanitize-html` (SSR 호환) + 외부 링크 `rel="nofollow noopener noreferrer"` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1036:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:64:| 검색 콘솔 sitemap submission 자동화 | M1 Phase Alpha | PSR-DEFER-05 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1037:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:90:│     ├─ about/page.tsx                  -- P-002 About
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1038:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:104:│     ├─ sitemap.xml/route.ts            -- per-instance sitemap
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1039:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:105:│     ├─ robots.txt/route.ts             -- per-instance robots
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1040:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:253:- **cycle2 PSR-28 patch (acceptance precondition · plan acceptance commit 동반)**: 현 root layout 의 `<body className="bg-slate-50 text-slate-900">` 임시 토큰 → DESIGN_TOKENS v1.0 semantic alias (`bg-canvas` · `text-fg-default`) 로 전환. § 8 작업 #14 Tailwind v0.2 patch + globals.css 안 CSS vars 적용 + root layout className 변경 모두 acceptance 직전 동시 적용.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1041:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:263:      <SiteHeader initial={initial} />
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1042:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:265:      <SiteFooter initial={initial} />
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1043:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:273:- (PSR-COMP-03 · cycle2 PSR-26 정정) Header: ClinicProfile.name + 네비 (Home · About · Doctors · Treatments · Contact · Locations · CTA primaryCtas[0]). Footer: 주소·전화·진료시간. **법적 페이지 5종 링크는 v0.1 단계 숨김** — LegalDocument 공개 노출이 PSR-DEFER-13 (= LL-DEFER-01 alias) 합류 시점까지 404 이므로 broken link 회피. 합류 후 Footer 에 동적 추가 (LegalDocument 가 published 상태 row 가 존재할 때만 렌더).
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1044:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:274:- (PSR-COMP-04) `loadSiteInitial` 가 layout 안에서 한 번 SELECT — Header/Footer 가 같은 데이터 사용. 페이지 안 별도 SELECT 는 entity 별 추가 데이터만.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1045:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:282:| ClinicProfile | `name` | C-01 `name` | Hero/Header/Footer |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1046:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:283:| ClinicProfile | `description` | C-01 `description` | Hero · OG description fallback |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1047:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:284:| ClinicProfile | `long_description` | C-01 `longDescription` | About 본문 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1048:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:285:| ClinicProfile | `slogan` | C-01 `slogan` | Hero subtitle |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1049:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:286:| ClinicProfile | `logo_url` | C-01 `logoUrl` | Header logo |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1050:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:290:| LocationProfile | `phone` | C-21 `telephone` | Contact/Footer |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1051:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:291:| LocationProfile | `email` | C-21 `email` | Contact/Footer |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1052:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:299:| TreatmentPage | `body_markdown` | C-03 `bodyMarkdown` (contract `body`) | ArticleBody render |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1053:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:300:| TreatmentPage | `hero_image_url` | C-03 `heroImageUrl` | Hero image · OG fallback |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1054:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:301:| TreatmentPage | `published_at` | C-03 `publishedAt` (== `dateModified` v0.1) | sitemap lastmod · Article meta |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1055:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:304:| Article | `body_markdown` | C-04 `bodyMarkdown` (contract `body`) | ArticleBody render |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1056:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:305:| Article | `hero_image_url` | C-04 `heroImageUrl` | Hero · OG |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1057:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:306:| Article | `published_at` | C-04 `datePublished` / `dateModified` v0.1 | sitemap lastmod |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1058:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:314:- (PSR-COMP-06) public renderer 는 **Drizzle column 명을 직접 사용** + 컴포넌트 prop 으로 넘길 때 contract semantic name 사용 (예: `<TreatmentHero title={row.title}>` 의 prop 명은 `name` 으로 — DATA_MODEL contract 일관). renderer 코드 안에 mapping function `normalizeTreatment(row)` / `normalizeArticle(row)` 두기.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1059:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:321:| P-001 Home | `<Hero>` (slogan/description) · `<DoctorsTeaser>` (3명) · `<TreatmentsTeaser>` (3건) · `<ContactCard>` | ClinicProfile + LocationMain + DoctorProfile (active LIMIT 3 ORDER BY displayOrder ASC) + TreatmentPage (published LIMIT 3 ORDER BY publishedAt DESC) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1060:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:322:| P-002 About | `<ArticleBody markdown={clinic.long_description}>` · `<FoundingInfo>` | ClinicProfile |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1061:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:323:| P-003 Doctors List | `<DoctorCard>` grid | DoctorProfile (active ORDER BY displayOrder ASC, id ASC) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1062:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:324:| P-004 Doctor Profile | `<DoctorHero>` · `<ArticleBody markdown={doctor.bio}>` · `<RelatedTreatments>` · `<RelatedArticles>` | DoctorProfile + 본인 author Articles |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1063:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:325:| P-005 Treatments List | `<TreatmentCard>` grid | TreatmentPage (RLS 자동 published only ORDER BY publishedAt DESC) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1064:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:326:| P-006 Treatment Detail | `<TreatmentHero>` · `<ArticleBody markdown={treatment.body_markdown}>` · `<TreatmentSummary>` · `<ContactCta>` | TreatmentPage |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1065:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:327:| P-010 Article Detail (1샘플) | `<ArticleHero>` (title·summary·publishedAt·author) · `<ArticleBody markdown={article.body_markdown}>` | Article + author Doctor |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1066:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:328:| P-012 Contact | `<ContactHero>` · `<BusinessHoursTable>` (CT-02 SoT 형식 — 7요일 + 점심 + 특수 휴진) · `<ReservationChannels>` (primaryCtas[]) | LocationMain + ClinicProfile.primary_ctas |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1067:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:330:| P-014 Location Detail `/locations/[slug]` | `<LocationHero>` · `<LocationAddress>` · `<BusinessHoursTable>` · `<ReservationChannels>` · `<DirectionsAndParking>` (metadata 안 info v0.1 fallback 미입력) | LocationProfile (slug='main' v0.1) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1068:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:332:### 4.4 ArticleBody (Markdown → HTML) (PSR-COMP-09) — cycle1 PSR-19·20 정정
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1069:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:334:- `apps/web/src/lib/markdown.ts` 신설 — SSR 호환 sanitizer:
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1070:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:335:  - 채택: **`sanitize-html`** (SSR 호환 · 의존성 작음) 또는 `rehype-sanitize` (unified pipeline · 더 표준)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1071:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:346:| Tailwind class | semantic token (DESIGN_TOKENS SoT) | CSS custom property (v0.1 신설) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1072:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:373:- (PSR-COMP-11 · cycle1 PSR-13) Tailwind alias 는 semantic 22 round-trip 보장 — `bg-canvas` ↔ `color.surface.background` ↔ `--color-surface-background`. 본 표가 SoT.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1073:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:374:- (PSR-COMP-12 · cycle1 PSR-14) light/dark CSS vars 둘 다 출력. `apps/web/src/styles/globals.css`:
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1074:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:412:  robots: {
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1075:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:430:### 5.2 sitemap.xml — cycle1 PSR-09 정정 (PSR-SEO-07)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1076:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:432:- `apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts` — Next Route Handler.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1077:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:439:| P-002 About | monthly | 0.8 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1078:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:446:| P-013 Legal | yearly | 0.3 (v0.1 단계 sitemap 에서 제외 — noindex) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1079:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:454:- M0 v1.0 합류 시 static sitemap.xml 도 export.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1080:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:456:### 5.3 robots.txt — cycle1 PSR-04 정정 (PSR-SEO-08)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1081:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:458:- `apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts` — Next Route Handler.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1082:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:468:# robots.txt — auto-generated (Glitzy · SEARCH_STANDARDIZATION § 3.3 disallowTraining)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1083:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:525:Sitemap: https://<host>/<instanceSlug>/sitemap.xml
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1084:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:532:  - SEARCH_STANDARDIZATION § 3.3.1 룰 적용 (`/admin/`·`/auth/`·`/api/` 공통 차단 · `noIndex: true` 페이지는 robots 차단 X · `environment` 별 결정)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1085:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:543:| P-002 About | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] WebPage` · `[풀] BreadcrumbList` · `WebSite` 참조 (`isPartOf`) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1086:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:544:| P-003 Doctors List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(Physician refs) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1087:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:545:| P-004 Doctor Profile | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Physician` · `[풀] WebPage` · `[풀] BreadcrumbList` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1088:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:546:| P-005 Treatments List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(MedicalProcedure refs) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1089:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:547:| P-006 Treatment Detail | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] MedicalProcedure` · `[풀] WebPage` · `[풀] BreadcrumbList` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1090:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:548:| P-010 Article Detail | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Article` · `[풀] WebPage` · `[풀] BreadcrumbList` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1091:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:549:| P-012 Contact | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] WebPage` · `[풀] BreadcrumbList` (cycle1 PSR-07: ContactPage 삭제 · SoT 는 WebPage + MedicalClinic 풀) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1092:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:550:| P-013 Legal/Policy | (v0.1 단계 미노출 — graph 출력 없음) · 정상 노출 시 `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1093:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:551:| P-014 Location Detail | `[풀] Organization` · `[풀] MedicalClinic`(`#clinic` 단지점 main 의 entity @id 그대로 — SCHEMA_MAPPING § 1.4 정합) · `[풀] WebPage` · `[풀] BreadcrumbList` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1094:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:557:  - rule checker 위치: `apps/web/src/lib/json-ld/__tests__/validate.ts` 신설
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1095:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:580:| 8 | Tailwind v0.2 patch — DESIGN_TOKENS v1.0 semantic 22 alias + globals.css 안 CSS vars (light + dark 양쪽) | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1096:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:595:| 6 | TreatmentPage `/<instanceSlug>/treatments/<slug>` 진입 시 body_markdown 렌더링 | `<h1>`·`<h2>`·`<p>` 표준 출력 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1097:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:600:| 11 | `/<instanceSlug>/sitemap.xml` 응답 | XML sitemap (P-013 제외 9페이지 + 동적 slug) + SEARCH_STANDARDIZATION § 4.3 changefreq/priority 정확 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1098:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:601:| 12 | `/<instanceSlug>/robots.txt` 응답 | SEARCH_STANDARDIZATION § 3 v0.1 starter `disallowTraining` 정합 (학습 봇 Disallow + 답변 봇 Allow + Naver Yeti Allow) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1099:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:606:| 17 | sitemap.xml 의 lastmod 가 entity updatedAt (Article 은 datePublished/publishedAt) 과 정확히 일치 | ISO 8601 형식 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1100:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:609:| 20 | Markdown ArticleBody 안 외부 링크 `rel="nofollow noopener noreferrer"` (cycle1 PSR-20) | 내부 링크 (`/<slug>/...`) 는 그대로 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1101:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:612:| 23 | P-013 Legal route 가 noindex robots meta + sitemap 제외 (cycle1 PSR-06) | `<meta name="robots" content="noindex,follow">` + sitemap.xml 에 없음 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1102:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:625:| 8 | 사이트 컴포넌트 (Hero · DoctorCard · TreatmentCard · ArticleBody · ContactCard · LocationCard · BreadcrumbList 등) | apps/web/src/components/site/* |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1103:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:626:| 9 | Markdown 렌더 (`sanitize-html` + 외부 링크 rel) | apps/web/src/lib/markdown.ts |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1104:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:627:| 10 | JSON-LD 생성기 (페이지 타입 별 graph builder · normalize projection 사용) | apps/web/src/lib/json-ld/* |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1105:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:628:| 11 | 자체 JSON-LD rule checker (LOCAL_PASS) | apps/web/src/lib/json-ld/__tests__/validate.ts |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1106:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:630:| 13 | sitemap.xml + robots.txt route handler (SEARCH_STANDARDIZATION 정합) | apps/web/src/app/(site)/[instanceSlug]/{sitemap.xml,robots.txt}/route.ts |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1107:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:631:| 14 | Tailwind v0.2 patch — DESIGN_TOKENS v1.0 semantic 22 alias + globals.css light/dark | apps/web/tailwind.config.ts · src/styles/globals.css |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1108:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:635:| 18 | docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2 patch — apps/worker 가 본 plan SSR 컴포넌트 재사용 marker (PSR-CASCADE-03) | doc |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1109:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:644:- `PSR-DEFER-01`: static export to Git — apps/worker + isomorphic-git/simple-git. v0.1 SSR 의 컴포넌트 트리 재사용 + `generateStaticParams` + `next export`.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1110:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:654:- `PSR-DEFER-05`: 검색 콘솔 sitemap submission 자동화.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1111:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:678:  - **PSR-CASCADE-01b (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEGAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · doctors · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/seed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance ≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 에서 별도 사이클 진행.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1112:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:680:- `PSR-CASCADE-03`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 patch — apps/worker 의 build/export 시점에 본 plan SSR 컴포넌트 + JSON-LD 생성기 + sitemap/robots route handler 재사용 marker.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1113:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:689:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1114:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:690:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1123:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "Organization|MedicalClinic|Physician|MedicalProcedure|Article|WebSite|WebPage|@id|#organization|#clinic|#physician|#procedure|#article|#website|#webpage" docs/core/SCHEMA_MAPPING.md docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1161:docs/core/SCHEMA_MAPPING.md:68:#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1162:docs/core/SCHEMA_MAPPING.md:70:`PUBLIC_SITE_RENDER_PLAN.md` v0.x § 5.4 PSR-SEO-12 의 SSR + path-based routing 단계 (Phase 0) 에서는 도메인 매핑 (subdomain/custom domain) 합류 전이므로 **임시로 instanceSlug 가 path 에 들어간 `@id` 패턴** 을 사용한다:
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1405:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:5:본 문서는 `apps/web` 안에 **`(site)` route group**(공개 사이트)을 신설하고, 어드민 route 도 동시에 **`/admin/<instanceSlug>/...`** prefix 로 격상해 path namespace 충돌을 해소한다. 어드민에서 저장한 6 entity (ClinicProfile · LocationProfile · DoctorProfile · TreatmentPage · Article · LegalDocument)를 minimal 디자인 + 정합 JSON-LD + SEARCH_STANDARDIZATION v1.1 정합 robots/sitemap 과 함께 렌더한다.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1406:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:12:- `docs/core/SCHEMA_MAPPING.md` — 페이지별 graph 구성 (§ 2.5 공통 entity 출력 정책 + § 3 페이지 그래프 + § 1.2 `@id` 네이밍 규약).
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1407:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:15:- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-02 DoctorProfile · C-03 TreatmentPage · C-04 Article · C-16 LegalDocument · C-21 LocationProfile · aiCrawlerPolicy.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1408:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:17:- `docs/admin/ARCHITECTURE.md` v0.7 § 3.11 완료 게이트 #1 — "사이트 측 페이지 타입 9종 + Article 1샘플 빌드 (총 10 페이지)".
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1409:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:43:| **P-009 Articles List · P-011 FAQ · P-007/008 Conditions** | M0 미합류 — 별 plan (FAQ 는 EAT_CONTENT plan v0.1) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1410:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:46:| 페이지 컴포넌트 minimal | Hero · About · DoctorCard · TreatmentCard · ArticleBody · ContactCard · LegalRenderer · LocationCard · Footer · Header · BreadcrumbList |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1411:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:51:| status filter (cycle1 PSR-06·16 정정) | TreatmentPage·Article: `status='published' AND published_at <= now()`. **LegalDocument: v0.1 단계 noindex + 어드민 인증 필요 preview 만** (draft 공개 노출 차단 — 법무 게이트 우회 회피) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1412:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:70:| P-009 Articles List · P-011 FAQ · P-007/008 Conditions | 별 plan (EAT_CONTENT plan v0.1 안 FAQ · 별도 plan Conditions) | PSR-DEFER-11 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1413:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:74:| Article URL `/insights/[category]/[slug]` 의 category 운영 추가 (현재 C-04 article.category 없음) | EAT_CONTENT plan v0.1 또는 Article schema cascade · v0.1 은 단일 fallback category `"general"` | PSR-DEFER-15 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1414:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:99:│     │     └─ [slug]/page.tsx           -- P-010 Article Detail (1샘플 · category=general v0.1)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1415:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:299:| TreatmentPage | `body_markdown` | C-03 `bodyMarkdown` (contract `body`) | ArticleBody render |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1416:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:301:| TreatmentPage | `published_at` | C-03 `publishedAt` (== `dateModified` v0.1) | sitemap lastmod · Article meta |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1417:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:302:| **Article** | `title` (DB) | **DATA_MODEL C-04 `headline` (contract)** — Drizzle 차이 marker | Article heading |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1418:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:303:| Article | `summary` | C-04 `summary` | Card · meta description |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1419:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:304:| Article | `body_markdown` | C-04 `bodyMarkdown` (contract `body`) | ArticleBody render |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1420:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:305:| Article | `hero_image_url` | C-04 `heroImageUrl` | Hero · OG |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1421:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:306:| Article | `published_at` | C-04 `datePublished` / `dateModified` v0.1 | sitemap lastmod |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1422:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:307:| Article | `author_doctor_id` | C-04 `author` ref to Doctor | Article hero · JSON-LD |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1423:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:314:- (PSR-COMP-06) public renderer 는 **Drizzle column 명을 직접 사용** + 컴포넌트 prop 으로 넘길 때 contract semantic name 사용 (예: `<TreatmentHero title={row.title}>` 의 prop 명은 `name` 으로 — DATA_MODEL contract 일관). renderer 코드 안에 mapping function `normalizeTreatment(row)` / `normalizeArticle(row)` 두기.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1424:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:322:| P-002 About | `<ArticleBody markdown={clinic.long_description}>` · `<FoundingInfo>` | ClinicProfile |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1425:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:324:| P-004 Doctor Profile | `<DoctorHero>` · `<ArticleBody markdown={doctor.bio}>` · `<RelatedTreatments>` · `<RelatedArticles>` | DoctorProfile + 본인 author Articles |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1426:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:326:| P-006 Treatment Detail | `<TreatmentHero>` · `<ArticleBody markdown={treatment.body_markdown}>` · `<TreatmentSummary>` · `<ContactCta>` | TreatmentPage |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1427:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:327:| P-010 Article Detail (1샘플) | `<ArticleHero>` (title·summary·publishedAt·author) · `<ArticleBody markdown={article.body_markdown}>` | Article + author Doctor |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1428:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:332:### 4.4 ArticleBody (Markdown → HTML) (PSR-COMP-09) — cycle1 PSR-19·20 정정
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1429:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:444:| P-010 Article Detail | monthly | 0.5 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1430:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:450:  - Article (P-010): `Article.dateModified` 우선. C-04 에 별도 `dateModified` 컬럼 없음 v0.1 — `published_at` 사용 (M1 cascade).
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1431:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:542:| P-001 Home | `[풀] Organization` · `[풀] MedicalClinic`(`#clinic` 본원) · `[풀] WebSite` · `[풀] WebPage` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1432:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:543:| P-002 About | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] WebPage` · `[풀] BreadcrumbList` · `WebSite` 참조 (`isPartOf`) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1433:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:544:| P-003 Doctors List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(Physician refs) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1434:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:545:| P-004 Doctor Profile | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Physician` · `[풀] WebPage` · `[풀] BreadcrumbList` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1435:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:546:| P-005 Treatments List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(MedicalProcedure refs) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1436:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:547:| P-006 Treatment Detail | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] MedicalProcedure` · `[풀] WebPage` · `[풀] BreadcrumbList` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1437:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:548:| P-010 Article Detail | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Article` · `[풀] WebPage` · `[풀] BreadcrumbList` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1438:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:549:| P-012 Contact | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] WebPage` · `[풀] BreadcrumbList` (cycle1 PSR-07: ContactPage 삭제 · SoT 는 WebPage + MedicalClinic 풀) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1439:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:550:| P-013 Legal/Policy | (v0.1 단계 미노출 — graph 출력 없음) · 정상 노출 시 `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1440:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:551:| P-014 Location Detail | `[풀] Organization` · `[풀] MedicalClinic`(`#clinic` 단지점 main 의 entity @id 그대로 — SCHEMA_MAPPING § 1.4 정합) · `[풀] WebPage` · `[풀] BreadcrumbList` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1441:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:554:- (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1442:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:555:- (PSR-SEO-13) `inLanguage` 명시 정책: SCHEMA_MAPPING § 1.5 정합 — CreativeWork 계열 (Article · WebPage · FAQPage 등) 만 명시. Organization · MedicalClinic · Physician 등은 미명시.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1443:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:556:- (PSR-SEO-14 · cycle1 PSR-17) **자체 JSON-LD rule checker** (LOCAL_PASS 게이트): JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 검증. Google Rich Results Test / schema.org validator 는 manual QA marker (PSR-DEFER-14) — CI 게이트 X.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1444:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:596:| 7 | Article published 5건 → `/<instanceSlug>/insights/general/<slug>` 진입 가능 (1샘플) | P-010 단일 페이지 렌더 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1445:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:606:| 17 | sitemap.xml 의 lastmod 가 entity updatedAt (Article 은 datePublished/publishedAt) 과 정확히 일치 | ISO 8601 형식 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1446:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:607:| 18 | **자체 JSON-LD rule checker** 통과 (cycle1 PSR-17 정정) | JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 — Google 외부 validator 는 manual QA marker (PSR-DEFER-14) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1447:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:609:| 20 | Markdown ArticleBody 안 외부 링크 `rel="nofollow noopener noreferrer"` (cycle1 PSR-20) | 내부 링크 (`/<slug>/...`) 는 그대로 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1448:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:625:| 8 | 사이트 컴포넌트 (Hero · DoctorCard · TreatmentCard · ArticleBody · ContactCard · LocationCard · BreadcrumbList 등) | apps/web/src/components/site/* |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1449:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:634:| 17 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` marker + entity continuity note (PSR-CASCADE-02) | doc |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1450:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:662:- `PSR-DEFER-15` (cycle1 PSR-11): Article `category` 컬럼 + URL 패턴 운영 — 현재 C-04 article.category 없음. v0.1 단일 fallback `general`.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1451:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:679:- `PSR-CASCADE-02` (cycle1 PSR-08 보강): `docs/core/SCHEMA_MAPPING.md` § 1.2 patch — v0.1 임시 path-based `@id` 패턴 + 도메인 매핑 후 (M0 v1.0) entity @id 전환 시 redirect/301/`sameAs` 처리 룰 추가 marker.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1452:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:689:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1453:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:690:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1519:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/core/SEARCH_STANDARDIZATION.md | Select-Object -Skip 188 -First 62; Get-Content docs/decisions/PUBLIC_SITE_RENDER_PLAN.md | Select-Object -Skip 466 -First 62' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1658:?? docs/decisions/PUBLIC_SITE_RENDER_PLAN.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1668:# PUBLIC_SITE_RENDER_PLAN v0.3 — cycle 3 review
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1677:- PSR-23: PARTIAL — 본문 `themeColor` 출처는 `BrandTokens.colors.light/dark.primary`로 정정됐으나 acceptance scenario #21 기대값이 아직 `#f9fafb`로 stale.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1683:- PSR-CASCADE-02: PASS — SCHEMA_MAPPING § 1.2 path-based 7 entity 표와 301/sameAs/lastmod 전환 룰 sound.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1684:- PSR-CASCADE-03: PASS — M0_BUILD_EXPORT_PLAN § 2.1 SSR 재사용 표는 plan § 8 작업 단위와 정합.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1687:- PSR-29 major — acceptance scenario #21 themeColor 기대값 stale: [PUBLIC_SITE_RENDER_PLAN.md](C:/Users/assag/solution/website-exposure/docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:610) 은 light 값을 `#f9fafb`로 요구하지만 SoT는 `BrandTokens.colors.light.primary` = default `#2563eb`, dark `#60a5fa`.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1690:## acceptance precondition (PSR-CASCADE-01~05) 최종 점검
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1691:- PSR-CASCADE-01a: FAIL — `docs/admin/ARCHITECTURE.md` § 3 patch marker 미적용.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1692:- PSR-CASCADE-01b: plan acceptance 외 — code v1.0 cycle marker
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1693:- PSR-CASCADE-02: PASS
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1694:- PSR-CASCADE-03: PASS
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1695:- PSR-CASCADE-04: PASS
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1696:- PSR-CASCADE-05: FAIL/TBD — 파일은 존재하나 `app_public_reader` 미추가.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1703:# PUBLIC_SITE_RENDER_PLAN v0.3 — cycle 3 review
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1712:- PSR-23: PARTIAL — 본문 `themeColor` 출처는 `BrandTokens.colors.light/dark.primary`로 정정됐으나 acceptance scenario #21 기대값이 아직 `#f9fafb`로 stale.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1718:- PSR-CASCADE-02: PASS — SCHEMA_MAPPING § 1.2 path-based 7 entity 표와 301/sameAs/lastmod 전환 룰 sound.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1719:- PSR-CASCADE-03: PASS — M0_BUILD_EXPORT_PLAN § 2.1 SSR 재사용 표는 plan § 8 작업 단위와 정합.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1722:- PSR-29 major — acceptance scenario #21 themeColor 기대값 stale: [PUBLIC_SITE_RENDER_PLAN.md](C:/Users/assag/solution/website-exposure/docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:610) 은 light 값을 `#f9fafb`로 요구하지만 SoT는 `BrandTokens.colors.light.primary` = default `#2563eb`, dark `#60a5fa`.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1725:## acceptance precondition (PSR-CASCADE-01~05) 최종 점검
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1726:- PSR-CASCADE-01a: FAIL — `docs/admin/ARCHITECTURE.md` § 3 patch marker 미적용.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1727:- PSR-CASCADE-01b: plan acceptance 외 — code v1.0 cycle marker
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1728:- PSR-CASCADE-02: PASS
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1729:- PSR-CASCADE-03: PASS
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1730:- PSR-CASCADE-04: PASS
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md:1731:- PSR-CASCADE-05: FAIL/TBD — 파일은 존재하나 `app_public_reader` 미추가.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:14:You are reviewing **cycle 4** of `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.4. Cycle 3 had 2 findings (0 blocking + 1 major + 1 minor):
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:18:| PSR-29 | major | acceptance scenario #21 themeColor stale | `#2563eb` (light) / `#60a5fa` (dark) — BrandTokens.colors.light/dark.primary default |
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:22:- `docs/admin/ARCHITECTURE.md` § 3.12 신설 — PSR-CASCADE-01a `apps/web` route group `(admin)` + `(site)` 분리 + `/admin/<slug>` prefix 격상 marker
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:23:- `apps/spike-a/pgbouncer/userlist.txt` — `app_public_reader app_public_reader_pw` 추가 (PSR-CASCADE-05)
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:28:- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.4 (scenario #21 + robots.txt 본문 + 변경 이력 v0.4 entry)
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:35:- `docs/core/SCHEMA_MAPPING.md` § 1.2 (PSR-CASCADE-02 path-based 표 PASS)
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:36:- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 (PSR-CASCADE-03 SSR 재사용 표 PASS)
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:42:   - PSR-29: scenario #21 의 themeColor 기대값 `#2563eb` / `#60a5fa` 가 SoT (DESIGN_TOKENS § 3.2 `color.brand.primary` light=`blue.600` (#2563eb) · dark=`blue.400` (#60a5fa)) 정합
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:43:   - PSR-30: PUBLIC_SITE_RENDER_PLAN robots.txt starter 가 SEARCH_STANDARDIZATION § 3.3 출력 예시와 entry-by-entry + comment-by-comment 정합
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:44:   - PSR-CASCADE-01a: ARCH § 3.12 신설 → PSR-CASCADE-01a PASS 판정 가능한가
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:45:   - PSR-CASCADE-05: userlist.txt 에 `app_public_reader` 항목 추가 → PSR-CASCADE-05 PASS 판정 가능한가
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:51:3. **acceptance precondition (PSR-CASCADE-01~05) 최종**:
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:52:   - PSR-CASCADE-01a (docs · plan acceptance commit): 적용?
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:53:   - PSR-CASCADE-01b (코드 · 별 code v1.0 cycle): plan acceptance precondition 외 — code v1.0 milestone 의 작업
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:54:   - PSR-CASCADE-02 (SCHEMA_MAPPING § 1.2): cycle 3 에서 PASS
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:55:   - PSR-CASCADE-03 (M0_BUILD_EXPORT_PLAN § 2.1): cycle 3 에서 PASS
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:56:   - PSR-CASCADE-04 (manifest D0011): cycle 3 에서 PASS
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:57:   - PSR-CASCADE-05 (pgbouncer userlist): 적용?
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:64:# PUBLIC_SITE_RENDER_PLAN v0.4 — cycle 4 review
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:74:- PSR-CASCADE-01a (ARCH § 3.12): 동일
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:75:- PSR-CASCADE-05 (pgbouncer): 동일
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:79:## acceptance precondition (PSR-CASCADE-01~05) 최종 확정
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:101:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.12|PSR-CASCADE-01a|\\(admin\\)|\\(site\\)|/admin/<slug>|route group\" docs/admin/ARCHITECTURE.md" in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:103:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"scenario #21|#21|themeColor|robots\\.txt|v0\\.4|PSR-CASCADE-01|PSR-CASCADE-05|PSR-29|PSR-30\" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md" in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:105:280:### 3.12 apps/web route group 구조 (PSR-CASCADE-01a · PUBLIC_SITE_RENDER_PLAN v0.x)
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:106:282:Phase 0 단계 `apps/web` 안 어드민 + 공개 사이트 두 영역을 같은 Next.js 앱 안 route group 으로 분리한다. PUBLIC_SITE_RENDER_PLAN v0.x § 2.1 의 acceptance precondition cascade.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:108:286:| `(admin)` | `/admin/<instanceSlug>/...` | 운영자 어드민 — ClinicProfile · DoctorProfile · TreatmentPage · Article · LegalDocument 입력/편집 | ADMIN_UI_SKELETON code v1.0 합류 (현재 `/<instanceSlug>/...` → `/admin/<instanceSlug>/...` 격상 cascade는 PUBLIC_SITE_RENDER code v1.0 cycle 안 동반 — PSR-CASCADE-01b) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:109:287:| `(site)` | `/<instanceSlug>/...` | 공개 사이트 — Home · About · Doctors · Treatments · Insights (1샘플) · Contact · Locations · Legal (v0.x 차단) | PUBLIC_SITE_RENDER code v1.0 합류 (M0 게이트 #1 사이트 측 페이지 빌드 가능 단계) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:156:26:  - `apps/web/src/app/sign-in/...` (consume route — redirect target `/<firstSlug>` → `/admin/<firstSlug>` 로 patch · PSR-CASCADE-01)
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:157:41:| **어드민 URL prefix `/admin/<instanceSlug>/...`** (cycle1 PSR-02 격상) | 공개 path namespace 와 분리. acceptance precondition. 코드 cascade (PSR-CASCADE-01) 동시 적용 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:161:107:├─ sign-in/...                           -- (변경: consume redirect target `/admin/<slug>` · PSR-CASCADE-01)
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:162:215:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:168:579:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:169:584:| 10 | LOCATION_LEGAL code v1.1 cascade — admin URL 변경 (PSR-CASCADE-01) 의 revalidatePath 6 곳 patch | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:170:585:| 11 | ADMIN_UI_SKELETON code v1.1 cascade — sign-in/consume redirect `/admin/<slug>` (PSR-CASCADE-01) | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:172:606:| 15 | 어드민 측 도메인 (`/admin/<slug>/...`) 와 공개 도메인 (`/<slug>/...`) 충돌 없음 — PSR-CASCADE-01 정합 | 어드민 prefix `/admin` · 공개 prefix 없음. sign-in consume redirect `/admin/<firstSlug>` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:176:634:| 15 | **어드민 URL `/admin` prefix 격상 (PSR-CASCADE-01)** | apps/web/src/app/(admin)/admin/[instanceSlug]/ 디렉토리 이동 + revalidatePath 6 곳 + sign-in/consume redirect target + seed.ts |
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:177:635:| 16 | docs/admin/ARCHITECTURE.md § 3 patch — `(site)` 신설 + `/admin` prefix (PSR-CASCADE-01) | doc |
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:178:639:| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05 · cycle2 PSR-27 경로 정정) | apps/spike-a/pgbouncer/userlist.txt |
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:179:676:> **acceptance 순서 정합 (LL-33 패턴)**: PSR-CASCADE-01~05 는 plan v1.0 acceptance 와 **동시 또는 직전** 에 적용. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:180:678:- `PSR-CASCADE-01` (cycle1 PSR-02 격상 + cycle2 PSR-24 a/b 분리):
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:181:679:  - **PSR-CASCADE-01a (docs · plan acceptance commit 안 동반)**: `docs/admin/ARCHITECTURE.md` § 3 patch — `(site)` 신설 + `/admin` prefix 격상 marker.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:182:680:  - **PSR-CASCADE-01b (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEGAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · doctors · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/seed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance ≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 에서 별도 사이클 진행.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:183:684:- `PSR-CASCADE-05` (cycle2 PSR-27 경로 정정): `apps/spike-a/pgbouncer/userlist.txt` — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade). 본 파일은 `apps/spike-a/docker-compose.yml` 의 pgbouncer 컨테이너에 mount 되는 정확 경로.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:184:691:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:185:692:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch**: (PSR-29) acceptance scenario #21 themeColor 기대값 stale 정정 — `BrandTokens.colors.light.primary` default `#2563eb` (light) / `#60a5fa` (dark). (PSR-30) robots.txt starter SoT line-by-line 정합 — 헤더/일반 룰/C 계열/meta-externalagent 코멘트 + Sitemap placeholder `{domain}` 통일 (SEARCH_STANDARDIZATION § 3.3 그대로). 추가 cascade 실 적용: docs/admin/ARCHITECTURE.md § 3.12 신설 (PSR-CASCADE-01a — apps/web route group `(admin)` + `(site)` 분리). apps/spike-a/pgbouncer/userlist.txt 에 `app_public_reader` 추가 (PSR-CASCADE-05). 누계 cycle 1+2+3 = 30 findings 전건 수용. 5 cascade 중 4 PASS, 01b 는 별 code v1.0 cycle. |
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:186:693:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:194:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/PUBLIC_SITE_RENDER_PLAN.md | Select-Object -Skip 410 -First 90' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:289:- (PSR-SEO-04) canonical v0.1: `https://<host>/<instanceSlug><path>` path-based. M0 v1.0 도메인 매핑 합류 시 entity continuity migration (PSR-CASCADE-02 참조).
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:588:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/PUBLIC_SITE_RENDER_PLAN.md | Select-Object -Skip 468 -First 55' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:647:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/PUBLIC_SITE_RENDER_PLAN.md | Select-Object -Skip 523 -First 20' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:673:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "allowAll|allowApprovedOnly|legalApprovalAt|legalApprovedBy|legalApprovalNote|전통 SEO|네이버 AI|AI 크롤러 분류" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md docs/core/SEARCH_STANDARDIZATION.md' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:675:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"aiCrawlerPolicy|aiCrawlerLegalApproved|disallowAll|allow \\| disallowTraining\" docs/core/SEARCH_STANDARDIZATION.md docs/decisions/PUBLIC_SITE_RENDER_PLAN.md" in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:677:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "PSR-CASCADE-02|PSR-CASCADE-03|D0011|public_site|app_public_reader" docs/core/SCHEMA_MAPPING.md docs/decisions/M0_BUILD_EXPORT_PLAN.md packages/migrations-runner/src/manifest.ts apps/spike-a/pgbouncer/userlist.txt' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:686:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:460:  - § 3.1: AI 크롤러 분류 4계열 (전통 SEO · 학습 봇 · 답변 봇 · 네이버 AI).
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:687:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:461:  - § 3.2: `aiCrawlerPolicy` enum **required** (`disallowTraining` / `allowAll` / `allowApprovedOnly` / `custom`) — 미설정 시 빌드 fail.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:688:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:462:  - § 3.3: 정책별 출력 예시 + 법무 승인 필드 3종 required (`legalApprovalAt` · `legalApprovedBy` · `legalApprovalNote`) for `allowAll`.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:689:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:465:- (PSR-SEO-09 · cycle1 PSR-04 + cycle2 PSR-22) v0.1 단계 ClinicProfile.metadata.aiCrawlerPolicy 컬럼 부재 — InstanceManifest 합류 (M0 v1.0 cascade · PSR-DEFER-10) 전까지는 fixed `disallowTraining` starter (enum 값 = `disallowTraining` · SoT 4종 `allow / disallowTraining / disallowAll / custom`):
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:690:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:532:  - `disallowAll`: B·C·D 계열 모두 Disallow (A 만 Allow)
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:691:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:693:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:694:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:13:- `docs/core/SEARCH_STANDARDIZATION.md` — § 2 메타 태그 표준 (theme-color · og:type 매핑) · § 3 robots.txt (aiCrawlerPolicy + 4계열 user-agent + disallowTraining starter) · § 4.3 sitemap changefreq/priority · § 5 canonical resolve.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:695:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:15:- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-02 DoctorProfile · C-03 TreatmentPage · C-04 Article · C-16 LegalDocument · C-21 LocationProfile · aiCrawlerPolicy.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:696:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:49:| sitemap.xml · robots.txt (cycle1 PSR-04·09 정정) | per-instance · SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` required + § 4.3 changefreq/priority SoT 정합 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:697:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:461:  - § 3.2: `aiCrawlerPolicy` enum **required** (`disallowTraining` / `allowAll` / `allowApprovedOnly` / `custom`) — 미설정 시 빌드 fail.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:698:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:465:- (PSR-SEO-09 · cycle1 PSR-04 + cycle2 PSR-22) v0.1 단계 ClinicProfile.metadata.aiCrawlerPolicy 컬럼 부재 — InstanceManifest 합류 (M0 v1.0 cascade · PSR-DEFER-10) 전까지는 fixed `disallowTraining` starter (enum 값 = `disallowTraining` · SoT 4종 `allow / disallowTraining / disallowAll / custom`):
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:699:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:530:- (PSR-SEO-10) M0 v1.0 InstanceManifest.aiCrawlerPolicy 합류 시 (PSR-DEFER-10) row-driven 출력:
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:700:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:531:  - `allow` (= 학습 포함 전체 허용): D 계열 모두 Allow + `aiCrawlerLegalApproved: true` 필수 (fail-gate)
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:701:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:532:  - `disallowAll`: B·C·D 계열 모두 Disallow (A 만 Allow)
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:702:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:649:- `PSR-DEFER-10`: AI 크롤러 인증 + InstanceManifest.aiCrawlerPolicy row-driven 출력 + 법무 승인 필드 3종 verify (SEARCH_STANDARDIZATION § 3.3.1 룰).
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:703:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:691:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:723:docs/decisions/M0_BUILD_EXPORT_PLAN.md:51:### 2.1 PUBLIC_SITE_RENDER_PLAN SSR 컴포넌트 재사용 (PSR-CASCADE-03)
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:724:docs/decisions/M0_BUILD_EXPORT_PLAN.md:65:본 § 2.1 은 `PUBLIC_SITE_RENDER_PLAN` 의 acceptance precondition cascade (PSR-CASCADE-03) — apps/worker 구현 시 별도 컴포넌트 작성 부담 없음. 본 plan v1.0 합류 시 § 2.1 상세화.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:725:packages/migrations-runner/src/manifest.ts:23: * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 + PUBLIC_SITE_RENDER_PLAN v0.x § 8/§ 10 의 D0011 (10단계 — PSR-25/PSR-CASCADE-04 patch).
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:726:packages/migrations-runner/src/manifest.ts:102:  // (10) app_public_reader role + per-table SELECT policy 7개 (PUBLIC_SITE_RENDER_PLAN v0.x · PSR-25 / PSR-CASCADE-04 patch)
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:729:docs/core/SCHEMA_MAPPING.md:68:#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:732:# PUBLIC_SITE_RENDER_PLAN v0.4 — cycle 4 review
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:740:- PSR-29: PASS — scenario #21 기대값이 `#2563eb` light / `#60a5fa` dark로 정정됨. `DESIGN_TOKENS.md` § 3.2 `color.brand.primary` light=`blue.600`, dark=`blue.400` 및 § 3.4 hex와 정합.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:741:- PSR-30: PASS — `PUBLIC_SITE_RENDER_PLAN.md` robots.txt starter 본문은 `SEARCH_STANDARDIZATION.md` § 3.3 예시와 header, 일반 룰, A/B/C/D 계열, `meta-externalagent` 코멘트, `Sitemap: https://{domain}/sitemap.xml`까지 entry-by-entry 정합.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:742:- PSR-CASCADE-01a (ARCH § 3.12): PASS — `docs/admin/ARCHITECTURE.md` § 3.12에 `(admin)` `/admin/<instanceSlug>/...`와 `(site)` `/<instanceSlug>/...` 분리 및 PSR-CASCADE-01b 코드 격상 marker가 들어감.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:743:- PSR-CASCADE-05 (pgbouncer): PASS — `apps/spike-a/pgbouncer/userlist.txt`에 `"app_public_reader" "app_public_reader_pw"` 추가됨.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:746:- PSR-31 / minor — `PUBLIC_SITE_RENDER_PLAN.md` § 5.3 robots.txt SoT 요약 3줄이 stale.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:751:## acceptance precondition (PSR-CASCADE-01~05) 최종 확정
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:764:# PUBLIC_SITE_RENDER_PLAN v0.4 — cycle 4 review
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:772:- PSR-29: PASS — scenario #21 기대값이 `#2563eb` light / `#60a5fa` dark로 정정됨. `DESIGN_TOKENS.md` § 3.2 `color.brand.primary` light=`blue.600`, dark=`blue.400` 및 § 3.4 hex와 정합.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:773:- PSR-30: PASS — `PUBLIC_SITE_RENDER_PLAN.md` robots.txt starter 본문은 `SEARCH_STANDARDIZATION.md` § 3.3 예시와 header, 일반 룰, A/B/C/D 계열, `meta-externalagent` 코멘트, `Sitemap: https://{domain}/sitemap.xml`까지 entry-by-entry 정합.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:774:- PSR-CASCADE-01a (ARCH § 3.12): PASS — `docs/admin/ARCHITECTURE.md` § 3.12에 `(admin)` `/admin/<instanceSlug>/...`와 `(site)` `/<instanceSlug>/...` 분리 및 PSR-CASCADE-01b 코드 격상 marker가 들어감.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:775:- PSR-CASCADE-05 (pgbouncer): PASS — `apps/spike-a/pgbouncer/userlist.txt`에 `"app_public_reader" "app_public_reader_pw"` 추가됨.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:778:- PSR-31 / minor — `PUBLIC_SITE_RENDER_PLAN.md` § 5.3 robots.txt SoT 요약 3줄이 stale.
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md:783:## acceptance precondition (PSR-CASCADE-01~05) 최종 확정
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:1:You are reviewing **cycle 3** of `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.3. Cycle 2 had **7 findings** (2 blocking + 4 major + 1 minor). All were patched. Verify convergence and surface remaining issues.
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:9:| PSR-24 | blocking | admin URL cascade 미적용 | PSR-CASCADE-01 a/b 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:16:- `docs/core/SCHEMA_MAPPING.md` § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:17:- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:22:- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.3
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:40:   - PSR-CASCADE-02 SCHEMA_MAPPING § 1.2 path-based 표 — entity continuity 전환 룰 sound
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:41:   - PSR-CASCADE-03 M0_BUILD_EXPORT_PLAN § 2.1 SSR 재사용 표 — apps/worker 구현 시 컴포넌트 재사용 정합
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:48:3. **acceptance precondition (PSR-CASCADE-01~05) 최종 점검**:
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:49:   - PSR-CASCADE-01a: docs/admin/ARCHITECTURE.md § 3 patch — 아직 적용 안 됨 (TBD/FAIL)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:50:   - PSR-CASCADE-02: SCHEMA_MAPPING § 1.2 — PASS (적용)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:51:   - PSR-CASCADE-03: M0_BUILD_EXPORT_PLAN § 2.1 — PASS (적용)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:52:   - PSR-CASCADE-04: manifest.ts D0011 — PASS (적용)
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:53:   - PSR-CASCADE-05: pgbouncer userlist.txt — 아직 미적용 (코드 cascade) — TBD/FAIL
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:54:   - PSR-CASCADE-01b: code v1.0 cycle 분리 marker — 본 plan acceptance 의 acceptance precondition 외
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:65:# PUBLIC_SITE_RENDER_PLAN v0.3 — cycle 3 review
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:77:## acceptance precondition (PSR-CASCADE-01~05) 최종 점검
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:78:- PSR-CASCADE-01a: <PASS|FAIL|TBD>
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:79:- PSR-CASCADE-01b: <plan acceptance 외 — code v1.0 cycle marker>
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:80:- PSR-CASCADE-02: <PASS|FAIL|TBD>
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:81:- PSR-CASCADE-03: <PASS|FAIL|TBD>
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:82:- PSR-CASCADE-04: <PASS|FAIL|TBD>
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md:83:- PSR-CASCADE-05: <PASS|FAIL|TBD>
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:14:You are reviewing **cycle 5** of `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.5. Cycle 4 had 1 minor finding (PSR-31 stale SoT summary 3 lines). Patched.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:17:- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` § 5.3 robots.txt 위 SoT 요약 3줄 정정:
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:27:3. 5 PSR-CASCADE 모두 PASS 잔존
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:34:# PUBLIC_SITE_RENDER_PLAN v0.5 — cycle 5 review
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:44:## 5 PSR-CASCADE 최종 확정
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:314:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"v0\\.5|5\\.3|robots\\.txt|SoT|PSR-CASCADE|PASS|aiCrawlerPolicy|aiCrawlerLegalApproved|AI 크롤러|변경 이력\" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md" in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:329:3:> **상태**: **v0.5 (draft)** — Codex 자동 비평 cycle 1+2+3+4 (31 findings: 8 blocking + 16 major + 7 minor) 전건 수용 patch. 누계 수렴 추세 21 → 7 → 2 → 1. 5 PSR-CASCADE 모두 PASS (01a docs 적용 · 02·03·04 적용 · 05 pgbouncer 적용). 01b (코드 cascade) 는 별 code v1.0 cycle 분리. ADMIN_UI_SKELETON code v1.0 + LOCATION_LEGAL code v1.0 acceptance 직후 진입하는 첫 공개 사이트 plan. 본 plan 은 운영자(어드민)가 입력·저장한 콘텐츠를 실 클라이언트가 보는 공개 사이트로 렌더링 하는 minimal 흐름을 정의한다.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:336:26:  - `apps/web/src/app/sign-in/...` (consume route — redirect target `/<firstSlug>` → `/admin/<firstSlug>` 로 patch · PSR-CASCADE-01)
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:337:41:| **어드민 URL prefix `/admin/<instanceSlug>/...`** (cycle1 PSR-02 격상) | 공개 path namespace 와 분리. acceptance precondition. 코드 cascade (PSR-CASCADE-01) 동시 적용 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:340:73:| Google Rich Results Test / schema.org validator 자동 게이트 | manual QA marker · LOCAL_PASS 는 자체 rule checker (cycle1 PSR-17) | PSR-DEFER-14 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:343:107:├─ sign-in/...                           -- (변경: consume redirect target `/admin/<slug>` · PSR-CASCADE-01)
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:345:215:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:353:426:- (PSR-SEO-04) canonical v0.1: `https://<host>/<instanceSlug><path>` path-based. M0 v1.0 도메인 매핑 합류 시 entity continuity migration (PSR-CASCADE-02 참조).
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:367:556:- (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:368:558:- (PSR-SEO-14 · cycle1 PSR-17) **자체 JSON-LD rule checker** (LOCAL_PASS 게이트): JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 검증. Google Rich Results Test / schema.org validator 는 manual QA marker (PSR-DEFER-14) — CI 게이트 X.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:369:561:  - LOCAL_PASS 시나리오 18 의 통과 기준 = 자체 checker 통과
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:371:579:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:372:581:| 7 | `packages/migrations-runner/src/manifest.ts` v0.x — D0011 10단계 추가 (PSR-CASCADE-04) | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:373:584:| 10 | LOCATION_LEGAL code v1.1 cascade — admin URL 변경 (PSR-CASCADE-01) 의 revalidatePath 6 곳 patch | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:374:585:| 11 | ADMIN_UI_SKELETON code v1.1 cascade — sign-in/consume redirect `/admin/<slug>` (PSR-CASCADE-01) | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:375:588:## 7. § 8.1 시나리오 (LOCAL_PASS 검증) — cycle1 PSR-17·18 정정
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:377:606:| 15 | 어드민 측 도메인 (`/admin/<slug>/...`) 와 공개 도메인 (`/<slug>/...`) 충돌 없음 — PSR-CASCADE-01 정합 | 어드민 prefix `/admin` · 공개 prefix 없음. sign-in consume redirect `/admin/<firstSlug>` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:378:607:| 16 | dark mode CSS vars 출력 (UI toggle 미지원) | `[data-theme="dark"]` 블록 안 22개 토큰 모두 dark 값 정의 — 자체 rule checker (LOCAL_PASS) · UI toggle 은 marker 만 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:380:630:| 11 | 자체 JSON-LD rule checker (LOCAL_PASS) | apps/web/src/lib/json-ld/__tests__/validate.ts |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:382:634:| 15 | **어드민 URL `/admin` prefix 격상 (PSR-CASCADE-01)** | apps/web/src/app/(admin)/admin/[instanceSlug]/ 디렉토리 이동 + revalidatePath 6 곳 + sign-in/consume redirect target + seed.ts |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:383:635:| 16 | docs/admin/ARCHITECTURE.md § 3 patch — `(site)` 신설 + `/admin` prefix (PSR-CASCADE-01) | doc |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:384:636:| 17 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` marker + entity continuity note (PSR-CASCADE-02) | doc |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:385:637:| 18 | docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2 patch — apps/worker 가 본 plan SSR 컴포넌트 재사용 marker (PSR-CASCADE-03) | doc |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:386:638:| 19 | packages/migrations-runner manifest 10단계 (D0011 추가 — PSR-CASCADE-04) | manifest.ts |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:387:639:| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05 · cycle2 PSR-27 경로 정정) | apps/spike-a/pgbouncer/userlist.txt |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:388:640:| 21 | 시나리오 1~23 LOCAL_PASS 검증 | apps/web/scripts/site-scenarios.ts |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:391:676:> **acceptance 순서 정합 (LL-33 패턴)**: PSR-CASCADE-01~05 는 plan v1.0 acceptance 와 **동시 또는 직전** 에 적용. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:392:678:- `PSR-CASCADE-01` (cycle1 PSR-02 격상 + cycle2 PSR-24 a/b 분리):
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:393:679:  - **PSR-CASCADE-01a (docs · plan acceptance commit 안 동반)**: `docs/admin/ARCHITECTURE.md` § 3 patch — `(site)` 신설 + `/admin` prefix 격상 marker.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:394:680:  - **PSR-CASCADE-01b (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEGAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · doctors · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/seed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance ≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 에서 별도 사이클 진행.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:395:681:- `PSR-CASCADE-02` (cycle1 PSR-08 보강): `docs/core/SCHEMA_MAPPING.md` § 1.2 patch — v0.1 임시 path-based `@id` 패턴 + 도메인 매핑 후 (M0 v1.0) entity @id 전환 시 redirect/301/`sameAs` 처리 룰 추가 marker.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:396:682:- `PSR-CASCADE-03`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 patch — apps/worker 의 build/export 시점에 본 plan SSR 컴포넌트 + JSON-LD 생성기 + sitemap/robots route handler 재사용 marker.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:397:683:- `PSR-CASCADE-04`: `packages/migrations-runner/src/manifest.ts` — D0011 10단계 추가 (현 9단계 → 10단계).
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:398:684:- `PSR-CASCADE-05` (cycle2 PSR-27 경로 정정): `apps/spike-a/pgbouncer/userlist.txt` — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade). 본 파일은 `apps/spike-a/docker-compose.yml` 의 pgbouncer 컨테이너에 mount 되는 정확 경로.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:400:691:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:401:692:| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 1 minor finding 전건 수용 patch**: (PSR-31) § 5.3 SoT 요약 3줄 stale 정정 — § 3.1 4계열 명시 (A 일반검색 / B AI 검색 / C User-triggered / D 학습), § 3.2 enum `allow / disallowTraining / disallowAll / custom`, § 3.3 `allow` 시 `aiCrawlerLegalApproved: true` fail-gate. 5 PSR-CASCADE 모두 PASS. closeableAfterPatch=true 신호 + plan v1.0 acceptance commit 권고. 누계 cycle 1+2+3+4 = 31 findings 전건 수용. |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:402:693:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch**: (PSR-29) acceptance scenario #21 themeColor 기대값 stale 정정 — `BrandTokens.colors.light.primary` default `#2563eb` (light) / `#60a5fa` (dark). (PSR-30) robots.txt starter SoT line-by-line 정합 — 헤더/일반 룰/C 계열/meta-externalagent 코멘트 + Sitemap placeholder `{domain}` 통일 (SEARCH_STANDARDIZATION § 3.3 그대로). 추가 cascade 실 적용: docs/admin/ARCHITECTURE.md § 3.12 신설 (PSR-CASCADE-01a — apps/web route group `(admin)` + `(site)` 분리). apps/spike-a/pgbouncer/userlist.txt 에 `app_public_reader` 추가 (PSR-CASCADE-05). 누계 cycle 1+2+3 = 30 findings 전건 수용. 5 cascade 중 4 PASS, 01b 는 별 code v1.0 cycle. |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:403:694:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:414:PUBLIC_SITE_RENDER_PLAN.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:421:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "PSR-CASCADE-01|PSR-CASCADE-02|PSR-CASCADE-03|PSR-CASCADE-04|PSR-CASCADE-05|PASS|완료|적용" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md docs/admin/ARCHITECTURE.md docs/core/SCHEMA_MAPPING.md docs/decisions/M0_BUILD_EXPORT_PLAN.md packages/migrations-runner/src/manifest.ts apps/spike-a/pgbouncer/userlist.txt' in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:427:docs/decisions/M0_BUILD_EXPORT_PLAN.md:49:- 시나리오 LOCAL_PASS — 발행 트리거 → Git commit → 빌드 성공.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:428:docs/decisions/M0_BUILD_EXPORT_PLAN.md:51:### 2.1 PUBLIC_SITE_RENDER_PLAN SSR 컴포넌트 재사용 (PSR-CASCADE-03)
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:429:docs/decisions/M0_BUILD_EXPORT_PLAN.md:65:본 § 2.1 은 `PUBLIC_SITE_RENDER_PLAN` 의 acceptance precondition cascade (PSR-CASCADE-03) — apps/worker 구현 시 별도 컴포넌트 작성 부담 없음. 본 plan v1.0 합류 시 § 2.1 상세화.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:432:packages/migrations-runner/src/manifest.ts:23: * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 + PUBLIC_SITE_RENDER_PLAN v0.x § 8/§ 10 의 D0011 (10단계 — PSR-25/PSR-CASCADE-04 patch).
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:433:packages/migrations-runner/src/manifest.ts:102:  // (10) app_public_reader role + per-table SELECT policy 7개 (PUBLIC_SITE_RENDER_PLAN v0.x · PSR-25 / PSR-CASCADE-04 patch)
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:435:docs/core/SCHEMA_MAPPING.md:68:#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:447:docs/admin/ARCHITECTURE.md:280:### 3.12 apps/web route group 구조 (PSR-CASCADE-01a · PUBLIC_SITE_RENDER_PLAN v0.x)
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:448:docs/admin/ARCHITECTURE.md:286:| `(admin)` | `/admin/<instanceSlug>/...` | 운영자 어드민 — ClinicProfile · DoctorProfile · TreatmentPage · Article · LegalDocument 입력/편집 | ADMIN_UI_SKELETON code v1.0 합류 (현재 `/<instanceSlug>/...` → `/admin/<instanceSlug>/...` 격상 cascade는 PUBLIC_SITE_RENDER code v1.0 cycle 안 동반 — PSR-CASCADE-01b) |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:452:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:3:> **상태**: **v0.5 (draft)** — Codex 자동 비평 cycle 1+2+3+4 (31 findings: 8 blocking + 16 major + 7 minor) 전건 수용 patch. 누계 수렴 추세 21 → 7 → 2 → 1. 5 PSR-CASCADE 모두 PASS (01a docs 적용 · 02·03·04 적용 · 05 pgbouncer 적용). 01b (코드 cascade) 는 별 code v1.0 cycle 분리. ADMIN_UI_SKELETON code v1.0 + LOCATION_LEGAL code v1.0 acceptance 직후 진입하는 첫 공개 사이트 plan. 본 plan 은 운영자(어드민)가 입력·저장한 콘텐츠를 실 클라이언트가 보는 공개 사이트로 렌더링 하는 minimal 흐름을 정의한다.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:453:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:17:- `docs/admin/ARCHITECTURE.md` v0.7 § 3.11 완료 게이트 #1 — "사이트 측 페이지 타입 9종 + Article 1샘플 빌드 (총 10 페이지)".
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:454:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:26:  - `apps/web/src/app/sign-in/...` (consume route — redirect target `/<firstSlug>` → `/admin/<firstSlug>` 로 patch · PSR-CASCADE-01)
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:455:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:41:| **어드민 URL prefix `/admin/<instanceSlug>/...`** (cycle1 PSR-02 격상) | 공개 path namespace 와 분리. acceptance precondition. 코드 cascade (PSR-CASCADE-01) 동시 적용 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:456:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:73:| Google Rich Results Test / schema.org validator 자동 게이트 | manual QA marker · LOCAL_PASS 는 자체 rule checker (cycle1 PSR-17) | PSR-DEFER-14 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:457:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:107:├─ sign-in/...                           -- (변경: consume redirect target `/admin/<slug>` · PSR-CASCADE-01)
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:458:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:209:  3. content table SELECT (RLS USING 자동 적용)
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:459:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:215:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:460:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:253:- **cycle2 PSR-28 patch (acceptance precondition · plan acceptance commit 동반)**: 현 root layout 의 `<body className="bg-slate-50 text-slate-900">` 임시 토큰 → DESIGN_TOKENS v1.0 semantic alias (`bg-canvas` · `text-fg-default`) 로 전환. § 8 작업 #14 Tailwind v0.2 patch + globals.css 안 CSS vars 적용 + root layout className 변경 모두 acceptance 직전 동시 적용.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:461:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:340:- LegalDocument 본문 (CONTENT_STANDARDS § 7.1.1.1 면제) 도 동일 컴포넌트 사용 — answer-first AST · 표현 검사 미적용은 어드민 저장 단계의 결정이지 렌더 단계와 무관.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:462:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:426:- (PSR-SEO-04) canonical v0.1: `https://<host>/<instanceSlug><path>` path-based. M0 v1.0 도메인 매핑 합류 시 entity continuity migration (PSR-CASCADE-02 참조).
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:463:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:534:  - SEARCH_STANDARDIZATION § 3.3.1 룰 적용 (`/admin/`·`/auth/`·`/api/` 공통 차단 · `noIndex: true` 페이지는 robots 차단 X · `environment` 별 결정)
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:464:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:556:- (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:465:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:558:- (PSR-SEO-14 · cycle1 PSR-17) **자체 JSON-LD rule checker** (LOCAL_PASS 게이트): JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 검증. Google Rich Results Test / schema.org validator 는 manual QA marker (PSR-DEFER-14) — CI 게이트 X.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:466:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:561:  - LOCAL_PASS 시나리오 18 의 통과 기준 = 자체 checker 통과
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:467:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:579:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:468:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:581:| 7 | `packages/migrations-runner/src/manifest.ts` v0.x — D0011 10단계 추가 (PSR-CASCADE-04) | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:469:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:584:| 10 | LOCATION_LEGAL code v1.1 cascade — admin URL 변경 (PSR-CASCADE-01) 의 revalidatePath 6 곳 patch | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:470:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:585:| 11 | ADMIN_UI_SKELETON code v1.1 cascade — sign-in/consume redirect `/admin/<slug>` (PSR-CASCADE-01) | acceptance precondition |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:471:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:588:## 7. § 8.1 시나리오 (LOCAL_PASS 검증) — cycle1 PSR-17·18 정정
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:472:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:606:| 15 | 어드민 측 도메인 (`/admin/<slug>/...`) 와 공개 도메인 (`/<slug>/...`) 충돌 없음 — PSR-CASCADE-01 정합 | 어드민 prefix `/admin` · 공개 prefix 없음. sign-in consume redirect `/admin/<firstSlug>` |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:473:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:607:| 16 | dark mode CSS vars 출력 (UI toggle 미지원) | `[data-theme="dark"]` 블록 안 22개 토큰 모두 dark 값 정의 — 자체 rule checker (LOCAL_PASS) · UI toggle 은 marker 만 |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:474:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:630:| 11 | 자체 JSON-LD rule checker (LOCAL_PASS) | apps/web/src/lib/json-ld/__tests__/validate.ts |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:475:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:634:| 15 | **어드민 URL `/admin` prefix 격상 (PSR-CASCADE-01)** | apps/web/src/app/(admin)/admin/[instanceSlug]/ 디렉토리 이동 + revalidatePath 6 곳 + sign-in/consume redirect target + seed.ts |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:476:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:635:| 16 | docs/admin/ARCHITECTURE.md § 3 patch — `(site)` 신설 + `/admin` prefix (PSR-CASCADE-01) | doc |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:477:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:636:| 17 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` marker + entity continuity note (PSR-CASCADE-02) | doc |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:478:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:637:| 18 | docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2 patch — apps/worker 가 본 plan SSR 컴포넌트 재사용 marker (PSR-CASCADE-03) | doc |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:479:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:638:| 19 | packages/migrations-runner manifest 10단계 (D0011 추가 — PSR-CASCADE-04) | manifest.ts |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:480:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:639:| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05 · cycle2 PSR-27 경로 정정) | apps/spike-a/pgbouncer/userlist.txt |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:481:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:640:| 21 | 시나리오 1~23 LOCAL_PASS 검증 | apps/web/scripts/site-scenarios.ts |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:482:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:676:> **acceptance 순서 정합 (LL-33 패턴)**: PSR-CASCADE-01~05 는 plan v1.0 acceptance 와 **동시 또는 직전** 에 적용. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:483:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:678:- `PSR-CASCADE-01` (cycle1 PSR-02 격상 + cycle2 PSR-24 a/b 분리):
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:484:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:679:  - **PSR-CASCADE-01a (docs · plan acceptance commit 안 동반)**: `docs/admin/ARCHITECTURE.md` § 3 patch — `(site)` 신설 + `/admin` prefix 격상 marker.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:485:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:680:  - **PSR-CASCADE-01b (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEGAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · doctors · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/seed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance ≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 에서 별도 사이클 진행.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:486:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:681:- `PSR-CASCADE-02` (cycle1 PSR-08 보강): `docs/core/SCHEMA_MAPPING.md` § 1.2 patch — v0.1 임시 path-based `@id` 패턴 + 도메인 매핑 후 (M0 v1.0) entity @id 전환 시 redirect/301/`sameAs` 처리 룰 추가 marker.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:487:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:682:- `PSR-CASCADE-03`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 patch — apps/worker 의 build/export 시점에 본 plan SSR 컴포넌트 + JSON-LD 생성기 + sitemap/robots route handler 재사용 marker.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:488:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:683:- `PSR-CASCADE-04`: `packages/migrations-runner/src/manifest.ts` — D0011 10단계 추가 (현 9단계 → 10단계).
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:489:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:684:- `PSR-CASCADE-05` (cycle2 PSR-27 경로 정정): `apps/spike-a/pgbouncer/userlist.txt` — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade). 본 파일은 `apps/spike-a/docker-compose.yml` 의 pgbouncer 컨테이너에 mount 되는 정확 경로.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:490:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:691:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:491:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:692:| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 1 minor finding 전건 수용 patch**: (PSR-31) § 5.3 SoT 요약 3줄 stale 정정 — § 3.1 4계열 명시 (A 일반검색 / B AI 검색 / C User-triggered / D 학습), § 3.2 enum `allow / disallowTraining / disallowAll / custom`, § 3.3 `allow` 시 `aiCrawlerLegalApproved: true` fail-gate. 5 PSR-CASCADE 모두 PASS. closeableAfterPatch=true 신호 + plan v1.0 acceptance commit 권고. 누계 cycle 1+2+3+4 = 31 findings 전건 수용. |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:492:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:693:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch**: (PSR-29) acceptance scenario #21 themeColor 기대값 stale 정정 — `BrandTokens.colors.light.primary` default `#2563eb` (light) / `#60a5fa` (dark). (PSR-30) robots.txt starter SoT line-by-line 정합 — 헤더/일반 룰/C 계열/meta-externalagent 코멘트 + Sitemap placeholder `{domain}` 통일 (SEARCH_STANDARDIZATION § 3.3 그대로). 추가 cascade 실 적용: docs/admin/ARCHITECTURE.md § 3.12 신설 (PSR-CASCADE-01a — apps/web route group `(admin)` + `(site)` 분리). apps/spike-a/pgbouncer/userlist.txt 에 `app_public_reader` 추가 (PSR-CASCADE-05). 누계 cycle 1+2+3 = 30 findings 전건 수용. 5 cascade 중 4 PASS, 01b 는 별 code v1.0 cycle. |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:493:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:694:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:606:# PUBLIC_SITE_RENDER_PLAN v0.5 — cycle 5 review
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:615:- 근거: [PUBLIC_SITE_RENDER_PLAN.md](C:/Users/assag/solution/website-exposure/docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:460) § 5.3 SoT 요약 3줄이 [SEARCH_STANDARDIZATION.md](C:/Users/assag/solution/website-exposure/docs/core/SEARCH_STANDARDIZATION.md:159) § 3.1 4계열, § 3.2 enum 4종, `allow`의 `aiCrawlerLegalApproved: true` fail-gate와 정합.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:617:## 5 PSR-CASCADE 최종 확정
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:619:- 01b: 외 — 별도 PUBLIC_SITE_RENDER code v1.0 cycle 분리로 명시되어 plan acceptance blocker 아님
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:631:# PUBLIC_SITE_RENDER_PLAN v0.5 — cycle 5 review
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:640:- 근거: [PUBLIC_SITE_RENDER_PLAN.md](C:/Users/assag/solution/website-exposure/docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:460) § 5.3 SoT 요약 3줄이 [SEARCH_STANDARDIZATION.md](C:/Users/assag/solution/website-exposure/docs/core/SEARCH_STANDARDIZATION.md:159) § 3.1 4계열, § 3.2 enum 4종, `allow`의 `aiCrawlerLegalApproved: true` fail-gate와 정합.
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:642:## 5 PSR-CASCADE 최종 확정
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md:644:- 01b: 외 — 별도 PUBLIC_SITE_RENDER code v1.0 cycle 분리로 명시되어 plan acceptance blocker 아님
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:118:apps\spike-c-local\tsconfig.scenarios.json
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:174:apps\spike-c-local\src\scenarios\test-replay.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:175:apps\spike-c-local\src\scenarios\test-range-request.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:176:apps\spike-c-local\src\scenarios\test-method-confusion.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:177:apps\spike-c-local\src\scenarios\test-list-bucket.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:178:apps\spike-c-local\src\scenarios\test-isolation.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:179:apps\spike-c-local\src\scenarios\test-content-type.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:180:apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:181:apps\spike-c-local\src\scenarios\provider-smoke.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:182:apps\spike-c-local\src\scenarios\invariant-runner.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:351:apps\spike-e\tsconfig.scenarios.json
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:356:apps\spike-d\tsconfig.scenarios.json
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:372:apps\spike-a\src\scenarios\test-write.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:373:apps\spike-a\src\scenarios\test-rollback.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:374:apps\spike-a\src\scenarios\test-read.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:375:apps\spike-a\src\scenarios\test-pgbouncer-auth.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:376:apps\spike-a\src\scenarios\test-perf.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:377:apps\spike-a\src\scenarios\test-nested-tx.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:378:apps\spike-a\src\scenarios\test-negative.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:379:apps\spike-a\src\scenarios\test-invariant-runner.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:380:apps\spike-a\src\scenarios\test-audit.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:381:apps\spike-a\src\scenarios\provider-smoke.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:389:apps\spike-b\src\scenarios\test-stale-reclaim.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:390:apps\spike-b\src\scenarios\test-rls-mismatch.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:391:apps\spike-b\src\scenarios\test-retry-permanent.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:392:apps\spike-b\src\scenarios\test-no-cross-tenant.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:393:apps\spike-b\src\scenarios\test-invariant-runner.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:394:apps\spike-b\src\scenarios\test-idempotency.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:395:apps\spike-b\src\scenarios\test-failure-injection.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:396:apps\spike-b\src\scenarios\test-basic-100.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:397:apps\spike-b\src\scenarios\provider-smoke.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:433:apps\spike-e\src\scenarios\test-tenant-resolve-own.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:434:apps\spike-e\src\scenarios\test-tenant-resolve-cross.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:435:apps\spike-e\src\scenarios\test-super-admin-switch.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:436:apps\spike-e\src\scenarios\test-session-refresh.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:437:apps\spike-e\src\scenarios\test-rls-integration.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:438:apps\spike-e\src\scenarios\test-membership-removal.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:439:apps\spike-e\src\scenarios\test-magic-link-login.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:440:apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:441:apps\spike-e\src\scenarios\test-invariant.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:442:apps\spike-e\src\scenarios\test-invalid-instance-id.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:443:apps\spike-e\src\scenarios\test-inactive-user.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:444:apps\spike-e\src\scenarios\test-drizzle-adapter-smoke.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:445:apps\spike-e\src\scenarios\test-client-tampering.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:446:apps\spike-e\src\scenarios\test-action-eligibility.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:447:apps\spike-e\src\scenarios\provider-smoke.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:454:apps\spike-d\src\scenarios\test-staging-apply.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:455:apps\spike-d\src\scenarios\test-forward-only-hotfix.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:456:apps\spike-d\src\scenarios\test-failure-rollback.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:457:apps\spike-d\src\scenarios\test-expand-contract.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:458:apps\spike-d\src\scenarios\test-drift-check.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:459:apps\spike-d\src\scenarios\test-dev-apply.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:460:apps\spike-d\src\scenarios\test-deploy-gate.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:461:apps\spike-d\src\scenarios\test-canonical-generation.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:462:apps\spike-d\src\scenarios\test-audit.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:463:apps\spike-d\src\scenarios\test-advisory-lock.ts
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:676:.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:94:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"v1\\.1|LL-ACTION-18|LL-DEFER-21|8단계|9단계|C0003|tenant-resolve-denied|ForbiddenAccessPage|failedDetails|LL-CASCADE-0[1-5]|LLC-12|Next 15|scenario|시나리오 15\" docs/decisions/LOCATION_LEGAL_PLAN.md" in C:\Users\assag\solution\website-exposure
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:694:.\handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md:208:packages\migrations-runner\src\index.ts:1:// @glitzy/migrations-runner — Spike D LOCAL_PASS 승격 (placeholder·v0.1) + manifest spec (v0.1 — LL-CASCADE-05)
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:776:.\handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md:1508:    1: // @glitzy/migrations-runner — Spike D LOCAL_PASS 승격 (placeholder·v0.1) + manifest spec (v0.1 — LL-CASCADE-05)
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:814:.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:226:docs\decisions\M0_SCHEMA_PLAN.md:122:| **M0-07** migrations-runner manifest·depends_on | packages/migrations-runner v0.3 separate scope | Spike D LOCAL_PASS 패턴 (advisory lock·drift check 등)을 production module로 승격하는 별도 작업·M0 schema와 독립 |
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:832:.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3450:docs\decisions\M0_SCHEMA_PLAN.md:122:| **M0-07** migrations-runner manifest·depends_on | packages/migrations-runner v0.3 separate scope | Spike D LOCAL_PASS 패턴 (advisory lock·drift check 등)을 production module로 승격하는 별도 작업·M0 schema와 독립 |
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:895:.\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:469:| 2026-05-15 | (v0.3 비고) | codex 2차 비평 7 지적 전건 수용: (1) INFRA v1.0 §4.1·§4.2 5 Spike/10일 동기화 (SPIKE2-01), (2) **E-provider smoke gate Day 10 추가** — Vercel preview + Auth.js production-like + session DB persistence + 403 matrix (SPIKE2-02), (3) **DATA_MODEL C-23 v0.24 cascade** — instanceMemberships에 active·deactivatedAt·deactivatedBy (SPIKE2-03), (4) **REVIEW_WORKFLOW signed-url-revoked → signed-url-revocation-requested rename** — bearer URL은 즉시 revoke 불가·credential/object rotation으로 후속 처리 (SPIKE2-04), (5) **partial state matrix + Week 3-6 unlock/hold 규칙** — LOCAL_PASS·PROVIDER_PASS·PROVIDER_FAIL·INCONCLUSIVE (SPIKE2-05), (6) **A fallback reversal blast radius 상세** — affected SoT·packages·schedule delta·owner (SPIKE2-06), (7) **D·E artifact 명시** — D는 SQL/log/drift sample·E는 preview report/403 matrix/session DB row (SPIKE2-07) |
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:917:.\docs\decisions\M0_SCHEMA_PLAN.md:122:| **M0-07** migrations-runner manifest·depends_on | packages/migrations-runner v0.3 separate scope | Spike D LOCAL_PASS 패턴 (advisory lock·drift check 등)을 production module로 승격하는 별도 작업·M0 schema와 독립 |
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:918:.\apps\spike-a\README.md:3:> **상태**: prototype **v0.3 LOCAL_PASS candidate** (codex 1·2차 비평 26 지적 반영)
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:957:.\packages\migrations-runner\src\index.ts:1:// @glitzy/migrations-runner — Spike D LOCAL_PASS 승격 (placeholder·v0.1) + manifest spec (v0.1 — LL-CASCADE-05)
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:1:You are reviewing **cycle 4** of `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.4. Cycle 3 had 2 findings (0 blocking + 1 major + 1 minor):
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:5:| PSR-29 | major | acceptance scenario #21 themeColor stale | `#2563eb` (light) / `#60a5fa` (dark) — BrandTokens.colors.light/dark.primary default |
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:9:- `docs/admin/ARCHITECTURE.md` § 3.12 신설 — PSR-CASCADE-01a `apps/web` route group `(admin)` + `(site)` 분리 + `/admin/<slug>` prefix 격상 marker
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:10:- `apps/spike-a/pgbouncer/userlist.txt` — `app_public_reader app_public_reader_pw` 추가 (PSR-CASCADE-05)
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:15:- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.4 (scenario #21 + robots.txt 본문 + 변경 이력 v0.4 entry)
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:22:- `docs/core/SCHEMA_MAPPING.md` § 1.2 (PSR-CASCADE-02 path-based 표 PASS)
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:23:- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 (PSR-CASCADE-03 SSR 재사용 표 PASS)
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:29:   - PSR-29: scenario #21 의 themeColor 기대값 `#2563eb` / `#60a5fa` 가 SoT (DESIGN_TOKENS § 3.2 `color.brand.primary` light=`blue.600` (#2563eb) · dark=`blue.400` (#60a5fa)) 정합
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:30:   - PSR-30: PUBLIC_SITE_RENDER_PLAN robots.txt starter 가 SEARCH_STANDARDIZATION § 3.3 출력 예시와 entry-by-entry + comment-by-comment 정합
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:31:   - PSR-CASCADE-01a: ARCH § 3.12 신설 → PSR-CASCADE-01a PASS 판정 가능한가
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:32:   - PSR-CASCADE-05: userlist.txt 에 `app_public_reader` 항목 추가 → PSR-CASCADE-05 PASS 판정 가능한가
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:38:3. **acceptance precondition (PSR-CASCADE-01~05) 최종**:
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:39:   - PSR-CASCADE-01a (docs · plan acceptance commit): 적용?
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:40:   - PSR-CASCADE-01b (코드 · 별 code v1.0 cycle): plan acceptance precondition 외 — code v1.0 milestone 의 작업
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:41:   - PSR-CASCADE-02 (SCHEMA_MAPPING § 1.2): cycle 3 에서 PASS
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:42:   - PSR-CASCADE-03 (M0_BUILD_EXPORT_PLAN § 2.1): cycle 3 에서 PASS
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:43:   - PSR-CASCADE-04 (manifest D0011): cycle 3 에서 PASS
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:44:   - PSR-CASCADE-05 (pgbouncer userlist): 적용?
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:51:# PUBLIC_SITE_RENDER_PLAN v0.4 — cycle 4 review
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:61:- PSR-CASCADE-01a (ARCH § 3.12): 동일
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:62:- PSR-CASCADE-05 (pgbouncer): 동일
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md:66:## acceptance precondition (PSR-CASCADE-01~05) 최종 확정

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files handoff/codex-reviews/public-site-render-code-v1' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Select-String -Path docs/decisions/PUBLIC_SITE_RENDER_PLAN.md -Pattern "scenario|#10|#18|PSR-CASCADE-01b|JSON-LD|admin URL|/admin|revalidatePath|sign-in|seed" -Context 2,3' in C:\Users\assag\solution\website-exposure
 succeeded in 534ms:
handoff/codex-reviews/public-site-render-code-v1\cycle-3.prompt.md
handoff/codex-reviews/public-site-render-code-v1\cycle-3.out.md
handoff/codex-reviews/public-site-render-code-v1\cycle-2.prompt.md
handoff/codex-reviews/public-site-render-code-v1\cycle-2.out.md
handoff/codex-reviews/public-site-render-code-v1\cycle-1.prompt.md
handoff/codex-reviews/public-site-render-code-v1\cycle-1.out.md

 succeeded in 599ms:

  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:3:> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 cycle 5 회 closeableA
fterPatch=true 확정. 누계 31 findings 전건 수용 · 수렴 추세 **21 → 7 → 2 → 1 → 0**. 5 PSR-CASCADE 모두 PASS (01a docs ·
 02 SCHEMA_MAPPING § 1.2 · 03 M0_BUILD_EXPORT_PLAN § 2.1 · 04 manifest D0011 · 05 pgbouncer userlist). 01b (apps/web 디
렉토리 이동 + redirect/revalidate 변경) 는 별 **PUBLIC_SITE_RENDER code v1.0** cycle 분리 (LOCATION_LEGAL plan/code 분
리 패턴 정합). ADMIN_UI_SKELETON code v1.0 + LOCATION_LEGAL code v1.0 acceptance 직후 진입하는 첫 공개 사이트 plan.
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:4:
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:5:> **acceptance commit 구성 (LL-33 패턴 정합)**: 본 commit 에 다음 cascade
 동시 포함 — (1) PUBLIC_SITE_RENDER_PLAN.md v1.0 (본 문서) (2) PSR-CASCADE-01a docs[7m/admin[0m/ARCHITECTURE.md § 3.12 patch [0m
[7m[0m(3) PSR-CASCADE-02 docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based 표 + entity continuity 전환 룰 (4) PSR-CASCADE-03 [0m
[7m[0mdocs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 SSR 재사용 표 (5) PSR-CASCADE-04 packages/migrations-runner/src/manifest.t[0m
[7m[0ms D0011 entry (6) PSR-CASCADE-05 apps/spike-a/pgbouncer/userlist.txt 안 `app_public_reader` 추가. PSR-CASCADE-01b 코드 [0m
[7m[0mcascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 의 acceptance commit 에서 별도 진행.[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:6:[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:7:본 plan 은 운영자(어드민)가 입력·저장한 콘텐츠를 실 클라이언트가 보는 공[0m
[7m[0m개 사이트로 렌더링 하는 minimal 흐름을 정의한다.[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:8:[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:9:본 문서는 `apps/web` 안에 **`(site)` route group**(공개 사이트)을 신설하
고, 어드민 route 도 동시에 **`[7m/admin[0m/<instanceSlug>/...`** prefix 로 격상해 path namespace 충돌을 해소한다. 어드민에서 [0m
[7m[0m저장한 6 entity (ClinicProfile · LocationProfile · DoctorProfile · TreatmentPage · Article · LegalDocument)를 minimal [0m
[7m[0m디자인 + 정합 JSON-LD + SEARCH_STANDARDIZATION v1.1 정합 robots/sitemap 과 함께 렌더한다.[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:10:[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:11:> **scope limit (PSR-INTRO-01)**: 본 plan 은 **SSR + Next ISR** 만 다룬[0m
[7m[0m다. static export to Git · 도메인 매핑 (subdomain / custom domain) · CDN cache 정책 · Open Graph 이미지 동적 생성 · dar[0m
[7m[0mk mode UI toggle 등은 M0 v1.0 본 구현 / M1 cascade. v0.1 은 `/<instanceSlug>/...` path-based routing 으로 **개발자가 접[0m
[7m[0m근 가능한 단계** 까지.[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:12:[0m
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:19:- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-02 DoctorProfi
le · C-03 TreatmentPage · C-04 Article · C-16 LegalDocument · C-21 LocationProfile · aiCrawlerPolicy.
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:20:- `docs/core/DESIGN_TOKENS.md` v1.0 — 3-tier 토큰 (primitive·semantic·co
mponent) · § 3.2 light/dark semantic 22 · § 3.3 `data-theme="light"|"dark"` 분기 · semantic naming SoT (`color.surface.
background` 등).
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:21:- `docs[7m/admin[0m/ARCHITECTURE.md` v0.7 § 3.11 완료 게이트 #1 — "사이트 측 [0m
[7m[0m페이지 타입 9종 + Article 1샘플 빌드 (총 10 페이지)".[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:22:- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — ClinicProfile 3계약 + L[0m
[7m[0megalDocument 5종 + primaryCtas + businessHours · LegalDocument DB CHECK `status='draft' AND risk_level='Low' AND publis[0m
[7m[0mhed_at IS NULL` (LL-SCHEMA-03·06).[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:23:- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 placeholder — M0 v1.0 st[0m
[7m[0matic export to Git cascade target.[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:24:- 기존 packages/apps 실 시그니처:[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:25:  - `apps/web/src/app/(admin)/[instanceSlug]/...` (현 어드민 — cycle1 PS
R-02 patch 후 `(admin)[7m/admin[0m/[instanceSlug]/...` 로 prefix 격상)[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:26:  - `apps/web/src/app/layout.tsx` (root layout · `<html><body>` SoT — si[0m
[7m[0mte layout 은 fragment 만)[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:27:  - `apps/web/src/lib/{db, env, page-context, tenant}.ts`[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:28:  - `packages/core-content/src/schema.ts` v0.3 (Drizzle SoT — 실 column [0m
[7m[0m명: `title`/`body_markdown`)[0m
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:29:  - `packages/auth/src/...` (resolveTenantContext + audit)
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:30:  - `apps/web/src/app/[7msign-in[0m/...` (consume route — redirect target `/<f[0m
[7m[0mirstSlug>` → `/admin/<firstSlug>` 로 patch · PSR-CASCADE-01)[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:31:[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:32:## 1. 목적과 범위[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:33:[0m
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:35:
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:36:- 운영자가 어드민에서 저장한 6 entity 콘텐츠를 **실제 클라이언트 사이트*
* 처럼 렌더 — 운영자가 입력 결과를 즉시 검증 가능.
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:37:- M0 v1.0 본 구현(static export to Git) 의 콘텐츠 변환 룰([7mJSON-LD[0m·SEO me[0m
[7m[0mta·페이지 graph)을 v0.1 SSR 시점에 미리 확정 → 본 구현 시점에 코드 재사용.[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:38:- 노출 의도 일직선: SEARCH_STANDARDIZATION 정합 robots/sitemap/canonical
 · schema.org [7mJSON-LD[0m · Next.js metadata · theme-color · OpenGraph · 자체 JSON-LD rule checker 같은 검색·AI 인용 신호를[0m
[7m[0m v0.1 단계부터 표준 정합으로 출력.[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:39:[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:40:### 1.2 범위 (포함) — cycle1 PSR-01·02·06·11 정정[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:41:[0m
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:43:|---|---|
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:44:| `apps/web/src/app/(site)/[instanceSlug]/...` route group 신설 | 공개 
사이트 |
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:45:| **어드민 URL prefix `[7m/admin[0m/<instanceSlug>/...`** (cycle1 PSR-02 격상)[0m
[7m[0m | 공개 path namespace 와 분리. acceptance precondition. 코드 cascade (PSR-CASCADE-01) 동시 적용 |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:46:| **10페이지 minimal** (cycle1 PSR-01 정정) | P-001 `/` · P-002 `/about`[0m
[7m[0m · P-003 `/doctors` · P-004 `/doctors/[slug]` · P-005 `/treatments` · P-006 `/treatments/[slug]` · P-010 `/insights/[ca[0m
[7m[0mtegory]/[slug]` (1샘플) · P-012 `/contact` · P-013 `/legal/[type]` (5종) · P-014 `/locations/[slug]` (main 1건) |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:47:| **P-009 Articles List · P-011 FAQ · P-007/008 Conditions** | M0 미합류[0m
[7m[0m — 별 plan (FAQ 는 EAT_CONTENT plan v0.1) |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:48:| `app_public_reader` PostgreSQL role + per-table SELECT policy (cycle1 [0m
[7m[0mPSR-05·15 정정) | 신규 D0011 migration 안 instance lookup policy + 6 content table policy 명시 |[0m
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:49:| SSR + Next ISR | `export const revalidate = 60` minimal |
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:50:| 페이지 컴포넌트 minimal | Hero · About · DoctorCard · TreatmentCard · 
ArticleBody · ContactCard · LegalRenderer · LocationCard · Footer · Header · BreadcrumbList |
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:51:| [7mJSON-LD[0m 통합 graph + 자체 rule checker (cycle1 PSR-07·17 정정) | SCHEM[0m
[7m[0mA_MAPPING § 2.5 + § 3 정합. 페이지당 단일 `<script>`. 자체 JSON parse + 필수 entity 검증 (Google validator 는 manual QA[0m
[7m[0m marker) |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:52:| Next metadata API + theme-color + og:type 매핑 (cycle1 PSR-10 정정) | [0m
[7m[0mtitle · description · canonical · OpenGraph · Twitter · robots · `themeColor` 2값 (light/dark) · og:type P-004 `profile[0m
[7m[0m`, P-006/P-010 `article`, 기타 `website` |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:53:| sitemap.xml · robots.txt (cycle1 PSR-04·09 정정) | per-instance · SEAR[0m
[7m[0mCH_STANDARDIZATION § 3 `aiCrawlerPolicy` required + § 4.3 changefreq/priority SoT 정합 |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:54:| 디자인 토큰 통합 + light/dark CSS vars 출력 (cycle1 PSR-13·14 정정) | [0m
[7m[0mTailwind v3.4 + DESIGN_TOKENS v1.0 semantic 22 alias 표. CSS custom property 는 light/dark 둘 다 출력. UI toggle 만 def[0m
[7m[0mer |[0m
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:86:├─ layout.tsx                            -- root layout (HTML/BODY SoT ·
 변경 없음)
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:87:├─ (admin)/
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:88:│  └─ admin/                             -- cycle1 PSR-02 patch: `[7m/admin[0m
[7m[0m` prefix 격상[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:89:│     └─ [instanceSlug]/                 -- 기존 어드민 (clinic-profile,[0m
[7m[0m doctors, treatments, articles, ...)[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:90:├─ (site)/[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:91:│  └─ [instanceSlug]/[0m
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:109:│     ├─ robots.txt/route.ts             -- per-instance robots
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:110:│     └─ not-found.tsx                   -- per-instance 404
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:111:├─ [7msign-in[0m/...                           -- (변경: consume redirect tar[0m
[7m[0mget `/admin/<slug>` · PSR-CASCADE-01)[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:112:├─ sign-out/...[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:113:├─ [7msign-in[0m/cleanup/...[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:114:├─ api/site-meta-fetch/...[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:115:└─ ...[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:116:```[0m
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:117:
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:118:**결정**:
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:119:- (PSR-ROUTE-02 · cycle1 PSR-02 patch) 어드민 URL 격상 `/<instanceSlug>
/...` → `[7m/admin[0m/<instanceSlug>/...`. ADMIN_UI_SKELETON code v1.0 의 다음 코드가 cascade 영향 (acceptance precondition):[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:120:  - `apps/web/src/app/(admin)/[instanceSlug]/...` → `apps/web/src/app/(
admin)[7m/admin[0m/[instanceSlug]/...` 디렉토리 이동[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:121:  - `apps/web/src/app/[7msign-in[0m/consume/route.ts` 의 redirect target `/<f[0m
[7m[0mirstSlug>` → `/admin/<firstSlug>` (firstActiveMembershipResolver 결과)[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:122:  - `apps/web/src/app/sign-out/route.ts` · `apps/web/src/app/[7msign-in[0m/cl[0m
[7m[0meanup/route.ts` 의 referrer/return-to 처리 영향 검토 (현재는 별 영향 없음 — 단순 `/sign-in` 또는 `/` 로 redirect)[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:123:  - `apps/web/src/components/forms/{ClinicProfileForm, DoctorProfileFor
m, ...}` 안 `[7mrevalidatePath[0m('/${instanceSlug}/...')` 호출 → `'/admin/${instanceSlug}/...'` 로 patch (LOCATION_LEGAL cod[0m
[7m[0me v1.1 cascade)[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:124:  - `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts`
 의 `[7mrevalidatePath[0m` 2 곳[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:125:  - `apps/web/src/app/api/site-meta-fetch/route.ts` 인증 redirect path[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:126:  - 시나리오: 어드민 진입 시 `[7m/admin[0m/<slug>` 로 자동 redirect. 공개 sit[0m
[7m[0me `/<slug>` 는 별 응답[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:127:- (PSR-ROUTE-03 · cycle1 PSR-03 patch) site layout 은 fragment 만 — `<h[0m
[7m[0mtml>`/`<body>` 중복 출력 금지. root layout 의 `<html lang="ko-KR">` SoT 유지. site layout 안 클래스/테마 처리는 `<body>[0m
[7m[0m` 의 추가 className 으로 root layout 이 segment-aware 분기 — 또는 별 wrapper `<div data-theme="light" data-site>` 구조 [0m
[7m[0m채택.[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:128:- (PSR-ROUTE-04) path-based routing 결정 — v0.1 단계 `/<instanceSlug>/<[0m
[7m[0mpage>`. 도메인 매핑 합류 시 (PSR-DEFER-02) middleware 가 host header → instanceSlug rewrite.[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:129:[0m
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:309:| Article | `hero_image_url` | C-04 `heroImageUrl` | Hero · OG |
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:310:| Article | `published_at` | C-04 `datePublished` / `dateModified` v0.1
 | sitemap lastmod |
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:311:| Article | `author_doctor_id` | C-04 `author` ref to Doctor | Article 
hero · [7mJSON-LD[0m |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:312:| LegalDocument | `title` | C-16 `title` | Legal heading (v0.1 단계 노[0m
[7m[0m출 X) |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:313:| LegalDocument | `body` | C-16 `body` (Markdown rendered) | Legal body[0m
[7m[0m |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:314:| LegalDocument | `document_type` | C-16 `documentType` | Routing key |[0m
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:317:**결정**:
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:318:- (PSR-COMP-06) public renderer 는 **Drizzle column 명을 직접 사용** + 
컴포넌트 prop 으로 넘길 때 contract semantic name 사용 (예: `<TreatmentHero title={row.title}>` 의 prop 명은 `name` 으
로 — DATA_MODEL contract 일관). renderer 코드 안에 mapping function `normalizeTreatment(row)` / `normalizeArticle(row)`
 두기.
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:319:- (PSR-COMP-07) `apps/web/src/lib/db-projection.ts` 신규 — entity 별 ra
w DB row → normalized projection 변환. [7mJSON-LD[0m 생성기 도 normalized projection 사용.[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:320:[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:321:### 4.3 페이지별 컴포넌트 (PSR-COMP-08)[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:322:[0m
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:474:# 일반 룰
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:475:User-agent: *
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:476:Disallow: [7m/admin[0m/[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:477:Disallow: /auth/[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:478:Disallow: /api/[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:479:Allow: /[0m
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:536:  - `disallowAll`: B·C·D 계열 모두 Disallow (A 만 Allow)
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:537:  - `custom`: § 3.4 merge/replace 룰
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:538:  - SEARCH_STANDARDIZATION § 3.3.1 룰 적용 (`[7m/admin[0m/`·`/auth/`·`/api/` [0m
[7m[0m공통 차단 · `noIndex: true` 페이지는 robots 차단 X · `environment` 별 결정)[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:539:[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:540:### 5.4 [7mJSON-LD[0m 통합 graph (PSR-SEO-11) — cycle1 PSR-07·08·17 정정[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:541:[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:542:- 모든 페이지 `<head>` 안 단일 `<script type="application/ld+json">` bl[0m
[7m[0mock 출력.[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:543:- 구조: `{ "@context": "https://schema.org", "@graph": [...] }` (SCHEMA[0m
[7m[0m_MAPPING § 1.1 정합).[0m
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:560:- (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<h
ost>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_
MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 enti
ty continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2
 patch (PSR-CASCADE-02).
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:561:- (PSR-SEO-13) `inLanguage` 명시 정책: SCHEMA_MAPPING § 1.5 정합 — Crea
tiveWork 계열 (Article · WebPage · FAQPage 등) 만 명시. Organization · MedicalClinic · Physician 등은 미명시.
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:562:- (PSR-SEO-14 · cycle1 PSR-17) **자체 [7mJSON-LD[0m rule checker** (LOCAL_PAS[0m
[7m[0mS 게이트): JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 검증. Google Rich Results Test / schema.[0m
[7m[0morg validator 는 manual QA marker (PSR-DEFER-14) — CI 게이트 X.[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:563:  - rule checker 위치: `apps/web/src/lib/[7mjson-ld[0m/__tests__/validate.ts`[0m
[7m[0m 신설[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:564:  - 페이지별 expected entities 정의 (위 표 그대로)[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:565:  - LOCAL_PASS 시나리오 18 의 통과 기준 = 자체 checker 통과[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:566:[0m
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:586:| 8 | Tailwind v0.2 patch — DESIGN_TOKENS v1.0 semantic 22 alias + glob
als.css 안 CSS vars (light + dark 양쪽) | acceptance precondition |
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:587:| 9 | `sanitize-html` 의존성 추가 (`apps/web/package.json`) | acceptanc
e precondition |
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:588:| 10 | LOCATION_LEGAL code v1.1 cascade — [7madmin URL[0m 변경 (PSR-CASCADE-0[0m
[7m[0m1) 의 revalidatePath 6 곳 patch | acceptance precondition |[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:589:| 11 | ADMIN_UI_SKELETON code v1.1 cascade — [7msign-in[0m/consume redirect `[0m
[7m[0m/admin/<slug>` (PSR-CASCADE-01) | acceptance precondition |[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:590:| 12 | apps/web [7mseed[0m scenario 도 admin URL 변경 정합 (`apps/web/src/see[0m
[7m[0md.ts`) | acceptance precondition |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:591:[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:592:## 7. § 8.1 시나리오 (LOCAL_PASS 검증) — cycle1 PSR-17·18 정정[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:593:[0m
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:608:| 13 | XSS payload `<script>` 가 어드민에 저장된 bodyMarkdown 에 포함 
시 렌더 단계에서 escape | `<script>` literal 출력 — execution X (sanitize-html) |
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:609:| 14 | active=false instance → `/<instanceSlug>` 진입 시 404 | Next `no
tFound()` (instance lookup policy USING `active=true`) |
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:610:| 15 | 어드민 측 도메인 (`[7m/admin[0m/<slug>/...`) 와 공개 도메인 (`/<slug>/[0m
[7m[0m...`) 충돌 없음 — PSR-CASCADE-01 정합 | 어드민 prefix `/admin` · 공개 prefix 없음. sign-in consume redirect `/admin/<fi[0m
[7m[0mrstSlug>` |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:611:| 16 | dark mode CSS vars 출력 (UI toggle 미지원) | `[data-theme="dark"[0m
[7m[0m]` 블록 안 22개 토큰 모두 dark 값 정의 — 자체 rule checker (LOCAL_PASS) · UI toggle 은 marker 만 |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:612:| 17 | sitemap.xml 의 lastmod 가 entity updatedAt (Article 은 datePubli[0m
[7m[0mshed/publishedAt) 과 정확히 일치 | ISO 8601 형식 |[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:613:| 18 | **자체 [7mJSON-LD[0m rule checker** 통과 (cycle1 PSR-17 정정) | JSON p[0m
[7m[0marse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 — Google 외부 validator 는 manual QA marker (PSR-DEFER-14[0m
[7m[0m) |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:614:| 19 | LocationProfile.metadata.businessHours (CT-02 SoT) 가 `/<instanc[0m
[7m[0meSlug>/contact` + `/<instanceSlug>/locations/main` 에 7요일 표 + 점심 시간 표시 | LL-SCHEMA-16 정합 · 두 페이지 동일 표[0m
[7m[0m 출력 |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:615:| 20 | Markdown ArticleBody 안 외부 링크 `rel="nofollow noopener norefe[0m
[7m[0mrrer"` (cycle1 PSR-20) | 내부 링크 (`/<slug>/...`) 는 그대로 |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:616:| 21 | Next metadata API `themeColor` 2값 (light + dark) 출력 — cycle1 [0m
[7m[0mPSR-10 + cycle3 PSR-29 정정 | `<meta name="theme-color" media="(prefers-color-scheme: light)" content="#2563eb">` (= `B[0m
[7m[0mrandTokens.colors.light.primary` default · `color.brand.primary` light) + `<meta name="theme-color" media="(prefers-col[0m
[7m[0mor-scheme: dark)" content="#60a5fa">` (dark). 인스턴스별 brandTokens 주입 시 override |[0m
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:631:| 8 | 사이트 컴포넌트 (Hero · DoctorCard · TreatmentCard · ArticleBody 
· ContactCard · LocationCard · BreadcrumbList 등) | apps/web/src/components/site/* |
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:632:| 9 | Markdown 렌더 (`sanitize-html` + 외부 링크 rel) | apps/web/src/li
b/markdown.ts |
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:633:| 10 | [7mJSON-LD[0m 생성기 (페이지 타입 별 graph builder · normalize project[0m
[7m[0mion 사용) | apps/web/src/lib/json-ld/* |[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:634:| 11 | 자체 [7mJSON-LD[0m rule checker (LOCAL_PASS) | apps/web/src/lib/json-l[0m
[7m[0md/__tests__/validate.ts |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:635:| 12 | Next metadata API (페이지별 generateMetadata · themeColor · og:t[0m
[7m[0mype) | 각 page.tsx 안 |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:636:| 13 | sitemap.xml + robots.txt route handler (SEARCH_STANDARDIZATION [0m
[7m[0m정합) | apps/web/src/app/(site)/[instanceSlug]/{sitemap.xml,robots.txt}/route.ts |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:637:| 14 | Tailwind v0.2 patch — DESIGN_TOKENS v1.0 semantic 22 alias + glo[0m
[7m[0mbals.css light/dark | apps/web/tailwind.config.ts · src/styles/globals.css |[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:638:| 15 | **어드민 URL `[7m/admin[0m` prefix 격상 (PSR-CASCADE-01)** | apps/web/[0m
[7m[0msrc/app/(admin)/admin/[instanceSlug]/ 디렉토리 이동 + revalidatePath 6 곳 + sign-in/consume redirect target + seed.ts |[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:639:| 16 | docs[7m/admin[0m/ARCHITECTURE.md § 3 patch — `(site)` 신설 + `/admin` [0m
[7m[0mprefix (PSR-CASCADE-01) | doc |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:640:| 17 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` [0m
[7m[0mmarker + entity continuity note (PSR-CASCADE-02) | doc |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:641:| 18 | docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2 patch — apps/worker [0m
[7m[0m가 본 plan SSR 컴포넌트 재사용 marker (PSR-CASCADE-03) | doc |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:642:| 19 | packages/migrations-runner manifest 10단계 (D0011 추가 — PSR-CAS[0m
[7m[0mCADE-04) | manifest.ts |[0m
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:643:| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05 · cycle2 PSR-27
 경로 정정) | apps/spike-a/pgbouncer/userlist.txt |
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:644:| 21 | 시나리오 1~23 LOCAL_PASS 검증 | apps/web/scripts/site-[7mscenario[0ms.[0m
[7m[0mts |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:645:[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:646:## 9. M0 v1.0 cascade markers (defer 정리)[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:647:[0m
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:665:### 9.3 EAT_CONTENT plan v0.1 합류
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:666:
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:667:- `PSR-DEFER-11(부분)`: FAQ (P-011) 추가 — schema.org `FAQPage` [7mJSON-LD[0m
[7m[0m.[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:668:- `PSR-DEFER-15` (cycle1 PSR-11): Article `category` 컬럼 + URL 패턴 운[0m
[7m[0m영 — 현재 C-04 article.category 없음. v0.1 단일 fallback `general`.[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:669:[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:670:### 9.4 외부 / manual QA[0m
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:681:
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:682:- `PSR-CASCADE-01` (cycle1 PSR-02 격상 + cycle2 PSR-24 a/b 분리):
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:683:  - **PSR-CASCADE-01a (docs · plan acceptance commit 안 동반)**: `docs[7m/[0m
[7madmin[0m/ARCHITECTURE.md` § 3 patch — `(site)` 신설 + `/admin` prefix 격상 marker.[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:684:  - **[7mPSR-CASCADE-01b[0m (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEG[0m
[7m[0mAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src[0m
[7m[0m/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · docto[0m
[7m[0mrs · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/[0m
[7m[0mseed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance [0m
[7m[0m≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER[0m
[7m[0m code v1.0 cycle 에서 별도 사이클 진행.[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:685:- `PSR-CASCADE-02` (cycle1 PSR-08 보강): `docs/core/SCHEMA_MAPPING.md` [0m
[7m[0m§ 1.2 patch — v0.1 임시 path-based `@id` 패턴 + 도메인 매핑 후 (M0 v1.0) entity @id 전환 시 redirect/301/`sameAs` 처리 [0m
[7m[0m룰 추가 marker.[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:686:- `PSR-CASCADE-03`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 patch 
— apps/worker 의 build/export 시점에 본 plan SSR 컴포넌트 + [7mJSON-LD[0m 생성기 + sitemap/robots route handler 재사용 marker[0m
[7m[0m.[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:687:- `PSR-CASCADE-04`: `packages/migrations-runner/src/manifest.ts` — D001[0m
[7m[0m1 10단계 추가 (현 9단계 → 10단계).[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:688:- `PSR-CASCADE-05` (cycle2 PSR-27 경로 정정): `apps/spike-a/pgbouncer/u[0m
[7m[0mserlist.txt` — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade). 본 파일은 `apps/spike-a/docker-compose.yml` 의[0m
[7m[0m pgbouncer 컨테이너에 mount 되는 정확 경로.[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:689:[0m
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:693:|---|---|---|
  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:694:| 2026-05-18 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. |
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:695:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11
 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 UR
L `[7m/admin[0m/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root lay[0m
[7m[0mout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disa[0m
[7m[0mllow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production N[0m
[7m[0mOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PS[0m
[7m[0mR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P[0m
[7m[0m-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/[0m
[7m[0mpriority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-0[0m
[7m[0m06/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFE[0m
[7m[0mR-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). ([0m
[7m[0mPSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. [0m
[7m[0m(PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안[0m
[7m[0m published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DE[0m
[7m[0mFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-[0m
[7m[0mDEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + r[0m
[7m[0mole membership cascade 분해 (§ 6 acceptance checklist). |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:696:| 2026-05-18 | **v1.0** | **Codex 비평 cycle 5 0 findings 확정 acceptan[0m
[7m[0mce** — closeableAfterPatch=true. 수렴 추세 21 → 7 → 2 → 1 → 0. blocking 0 · major 0 · minor 0 잔존. 5 PSR-CASCADE 모두 [0m
[7m[0mPASS (01a · 02 · 03 · 04 · 05). 01b 는 별 code v1.0 cycle 분리. 누계 31 findings 전건 수용. acceptance commit 6 cascade[0m
[7m[0m 동시 포함 (LL-33 패턴 정합). |[0m
[7m[0m  docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:697:| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 1 minor finding 전건 수용 pa[0m
[7m[0mtch**: (PSR-31) § 5.3 SoT 요약 3줄 stale 정정 — § 3.1 4계열 명시 (A 일반검색 / B AI 검색 / C User-triggered / D 학습), [0m
[7m[0m§ 3.2 enum `allow / disallowTraining / disallowAll / custom`, § 3.3 `allow` 시 `aiCrawlerLegalApproved: true` fail-gate[0m
[7m[0m. 5 PSR-CASCADE 모두 PASS. closeableAfterPatch=true 신호 + plan v1.0 acceptance commit 권고. 누계 cycle 1+2+3+4 = 31 fi[0m
[7m[0mndings 전건 수용. |[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:698:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 2 findings (0 blocking + 1 m
ajor + 1 minor) 전건 수용 patch**: (PSR-29) acceptance [7mscenario[0m #21 themeColor 기대값 stale 정정 — `BrandTokens.colors.[0m
[7m[0mlight.primary` default `#2563eb` (light) / `#60a5fa` (dark). (PSR-30) robots.txt starter SoT line-by-line 정합 — 헤더/[0m
[7m[0m일반 룰/C 계열/meta-externalagent 코멘트 + Sitemap placeholder `{domain}` 통일 (SEARCH_STANDARDIZATION § 3.3 그대로). [0m
[7m[0m추가 cascade 실 적용: docs/admin/ARCHITECTURE.md § 3.12 신설 (PSR-CASCADE-01a — apps/web route group `(admin)` + `(site[0m
[7m[0m)` 분리). apps/spike-a/pgbouncer/userlist.txt 에 `app_public_reader` 추가 (PSR-CASCADE-05). 누계 cycle 1+2+3 = 30 findi[0m
[7m[0mngs 전건 수용. 5 cascade 중 4 PASS, 01b 는 별 code v1.0 cycle. |[0m
> docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:699:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 m
ajor + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그
대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohe
re-ai/Diffbot 제거, `[7m/admin[0m//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeCol[0m
[7m[0mor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_S[0m
[7m[0mTANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cyc[0m
[7m[0mle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 1[0m
[7m[0m0단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) [0m
[7m[0mpgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` [0m
[7m[0m→ `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_[0m
[7m[0mMAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EX[0m
[7m[0mPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. [0m
[7m[0m|[0m


exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Raw handoff/codex-reviews/public-site-render-code-v1/cycle-2.out.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"PSR-CASCADE-01b|revalidatePath|redirect\\(|/admin/|firstSlug|seed|href=\\{|router.push|replace\\(\" apps/web/src -g \"*.ts\" -g \"*.tsx\"" in C:\Users\assag\solution\website-exposure
 succeeded in 541ms:
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
session id: 019e396f-dd7c-78a0-8dc3-6205ed9a7a2a
--------
user
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

codex
cycle 2 리뷰로 진행하겠습니다. 먼저 관련 파일과 문서 위치를 빠르게 맵핑한 뒤, 패치 검증과 새 회귀를 분리해서 보겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'git status --short' in C:\Users\assag\solution\website-exposure
 succeeded in 575ms:
tsconfig.base.json
skills-lock.json
pnpm-workspace.yaml
pnpm-lock.yaml
packages\storage\tsconfig.json
packages\storage\src\tenant-context.ts
packages\storage\src\storage-client.ts
packages\storage\src\sign-url.ts
packages\storage\src\index.ts
packages\storage\src\errors.ts
packages\storage\src\config.ts
packages\storage\src\audit-log.ts
packages\storage\package.json
package.json
packages\auth\tsconfig.json
packages\shared-types\tsconfig.json
packages\migrations-runner\tsconfig.json
packages\db\tsconfig.json
packages\core-content\tsconfig.json
packages\notifications-outbox\tsconfig.json
handoff\PROJECT_OVERVIEW.md
handoff\glitzy-website-audit.md
packages\auth\src\session.ts
packages\auth\src\resolve-tenant-context.ts
packages\auth\src\magic-link.ts
packages\shared-errors\tsconfig.json
packages\migrations-runner\src\manifest.ts
packages\migrations-runner\src\index.ts
packages\migrations-runner\package.json
packages\shared-types\package.json
packages\shared-types\src\index.ts
packages\db\src\tenant.ts
packages\db\src\service-role.ts
packages\db\src\index.ts
packages\db\src\errors.ts
packages\db\src\advisory-lock.ts
packages\db\package.json
packages\notifications-outbox\package.json
packages\auth\src\config.ts
packages\auth\src\audit.ts
packages\auth\package.json
packages\auth\src\errors.ts
packages\auth\src\index.ts
packages\notifications-outbox\src\provider-adapter.ts
packages\notifications-outbox\src\outbox.ts
packages\notifications-outbox\src\index.ts
packages\notifications-outbox\src\errors.ts
packages\core-content\src\index.ts
packages\core-content\package.json
packages\core-content\src\schema.ts
docs\research\REFERENCE_DEEP_DIVE_2026-05.md
docs\research\REFERENCE_ANALYSIS_2026-05.md
packages\auth\src\internal\session-internal.ts
packages\shared-errors\src\index.ts
packages\shared-errors\package.json
packages\db\migrations\D0011_public_reader.sql
packages\db\migrations\D0010_instance.sql
apps\spike-c-local\tsconfig.scenarios.json
apps\spike-c-local\tsconfig.json
docs\compliance\RISK_LEVELS.md
docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md
docs\ARCHITECTURE.md
apps\web\tsconfig.json
apps\web\tailwind.config.ts
packages\core-content\migrations\C0008_location_profile_parent_clinic.sql
packages\core-content\migrations\C0007_clinic_profile_policy_vars.sql
packages\core-content\migrations\C0006_legal_document.sql
packages\core-content\migrations\C0005_article.sql
packages\core-content\migrations\C0004_treatment_page.sql
packages\core-content\migrations\C0003_doctor_profile.sql
packages\core-content\migrations\C0002_location_profile.sql
packages\core-content\migrations\C0001_clinic_profile.sql
packages\core-content\src\templates\bodies.ts
packages\core-content\src\templates\index.ts
apps\spike-c-local\package.json
apps\spike-c-local\docker-compose.yml
apps\spike-c-local\PROVIDER_RUNBOOK.md
apps\spike-d\tsconfig.scenarios.json
apps\spike-d\tsconfig.json
packages\core-content\src\templates\__tests__.ts
packages\core-content\src\templates\render.ts
apps\spike-d\package.json
apps\spike-a\tsconfig.json
docs\features\search-visibility.md
docs\features\notifications.md
docs\features\keyword-monitoring.md
docs\features\crm-sync.md
docs\features\content-migration.md
docs\features\compliance-assistant.md
docs\features\asset-ingestion.md
docs\features\analytics-reporting.md
apps\spike-b\tsconfig.json
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.prompt.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-5.out.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.prompt.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-4.out.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.prompt.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-3.out.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md
handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md
apps\web\package.json
apps\web\next.config.mjs
docs\admin\REVIEW_WORKFLOW.md
docs\admin\ARCHITECTURE.md
handoff\codex-reviews\location-legal-code-v1\cycle-3.out.md
handoff\codex-reviews\location-legal-code-v1\cycle-2.prompt.md
handoff\codex-reviews\location-legal-code-v1\cycle-2.out.md
handoff\codex-reviews\location-legal-code-v1\cycle-1.prompt.md
handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md
handoff\codex-reviews\location-legal-code-v1\cycle-4.prompt.md
handoff\codex-reviews\location-legal-code-v1\cycle-4.out.md
handoff\codex-reviews\location-legal-code-v1\cycle-3.prompt.md
handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md
handoff\codex-reviews\location-legal-code-v1\cycle-5.prompt.md
apps\spike-d\docker-compose.yml
apps\spike-d\drizzle.config.ts
apps\spike-b\package.json
apps\spike-c-local\src\tenant-context.ts
apps\spike-c-local\src\storage-client.ts
apps\spike-c-local\src\sign-url.ts
apps\spike-c-local\src\seed.ts
apps\spike-d\migrations\010_contract_check_constraint.sql
apps\spike-d\migrations\009_backfill_published_at.sql
apps\spike-d\migrations\008_expand_add_nullable.sql
apps\spike-d\migrations\007_tenant_audit_log_view.sql
apps\spike-d\migrations\006_audit_event.sql
apps\spike-d\migrations\005_migration_ledger.sql
apps\spike-d\migrations\004_audit_log.sql
apps\spike-d\migrations\003_instance_user_partial_unique.sql
apps\spike-d\migrations\002_content_test.sql
apps\spike-d\migrations\001_roles_and_extensions.sql
handoff\codex-reviews\public-site-render-code-v1\cycle-1.prompt.md
handoff\codex-reviews\public-site-render-code-v1\cycle-1.out.md
handoff\codex-reviews\public-site-render-code-v1\cycle-2.out.md
handoff\codex-reviews\public-site-render-code-v1\cycle-2.prompt.md
apps\spike-b\PROVIDER_RUNBOOK.md
apps\spike-b\README.md
docs\core\SEARCH_STANDARDIZATION.md
docs\core\SCHEMA_MAPPING.md
docs\core\PAGE_TYPES.md
docs\core\DESIGN_TOKENS.md
docs\core\DATA_MODEL.md
docs\core\CONTENT_STANDARDS.md
apps\spike-b\docker-compose.yml
apps\spike-a\README.md
apps\spike-a\PROVIDER_RUNBOOK.md
apps\spike-d\src\service-role.ts
apps\spike-a\src\tenant.ts
apps\spike-a\src\service-role.ts
apps\spike-a\src\seed.ts
apps\spike-a\src\schema.ts
apps\spike-b\src\worker.ts
apps\spike-b\src\tenant.ts
apps\spike-b\src\seed.ts
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md
docs\decisions\PROVIDER_PASS_PLAN.md
docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md
docs\decisions\PACKAGES_STRUCTURE.md
docs\decisions\M0_SCHEMA_PLAN.md
docs\decisions\M0_BUILD_EXPORT_PLAN.md
docs\decisions\LOCATION_LEGAL_PLAN.md
docs\decisions\INFRA_DECISIONS_DRAFT.md
docs\decisions\ADMIN_UI_SKELETON_PLAN.md
apps\spike-a\package.json
apps\spike-b\src\fake-provider.ts
apps\spike-b\src\failure-injection.ts
apps\spike-b\src\errors.ts
apps\spike-b\src\db.ts
apps\spike-b\src\migrate.ts
apps\spike-b\src\fixtures.ts
apps\spike-b\src\outbox.ts
apps\spike-a\src\errors.ts
apps\spike-a\src\db.ts
apps\spike-a\src\fixtures.ts
apps\spike-a\src\migrate.ts
apps\spike-c-local\src\env.ts
apps\spike-c-local\src\audit-log.ts
apps\spike-c-local\src\errors.ts
apps\spike-c-local\src\fixtures.ts
apps\spike-d\src\env.ts
apps\spike-d\src\drift-check.ts
apps\spike-e\tsconfig.scenarios.json
apps\spike-e\tsconfig.json
apps\spike-d\docker\init-multi-db.sh
apps\spike-a\docker-compose.yml
apps\spike-d\src\errors.ts
apps\spike-d\src\migrate.ts
apps\spike-a\pgbouncer\userlist.txt
apps\spike-a\pgbouncer\pgbouncer.ini
apps\spike-a\scripts\wait-db.js
apps\spike-c-local\src\scenarios\test-isolation.ts
apps\spike-c-local\src\scenarios\test-content-type.ts
apps\spike-c-local\src\scenarios\test-audit-scrubbing.ts
apps\spike-c-local\src\scenarios\provider-smoke.ts
apps\spike-c-local\src\scenarios\invariant-runner.ts
apps\spike-c-local\src\scenarios\test-method-confusion.ts
apps\spike-c-local\src\scenarios\test-list-bucket.ts
apps\spike-c-local\src\scenarios\test-range-request.ts
apps\spike-c-local\src\scenarios\test-replay.ts
apps\spike-e\package.json
apps\spike-e\PROVIDER_RUNBOOK.md
apps\spike-b\migrations\007_provider_attempt_log.sql
apps\spike-b\migrations\006_permanent_alert.sql
apps\spike-b\migrations\005_invariant_log.sql
apps\spike-b\migrations\004_external_call_log.sql
apps\spike-b\migrations\003_inbox.sql
apps\spike-b\migrations\002_outbox.sql
apps\spike-b\migrations\001_roles.sql
apps\web\README.md
apps\web\postcss.config.mjs
apps\spike-a\migrations\004_invariant_log.sql
apps\spike-a\migrations\003_audit_log.sql
apps\spike-a\migrations\002_content_test.sql
apps\spike-a\migrations\001_roles.sql
apps\web\src\types\react-dom-stable.d.ts
apps\spike-d\src\scenarios\test-staging-apply.ts
apps\spike-d\src\scenarios\test-forward-only-hotfix.ts
apps\spike-d\src\scenarios\test-failure-rollback.ts
apps\spike-d\src\scenarios\test-expand-contract.ts
apps\spike-d\src\scenarios\test-drift-check.ts
apps\spike-d\src\scenarios\test-dev-apply.ts
apps\spike-d\src\scenarios\test-deploy-gate.ts
apps\spike-d\src\scenarios\test-canonical-generation.ts
apps\spike-d\src\scenarios\test-audit.ts
apps\spike-d\src\scenarios\test-advisory-lock.ts
apps\spike-e\docker-compose.yml
apps\web\src\seed.ts
apps\spike-d\src\db\client.ts
apps\spike-d\src\db\schema.ts
apps\spike-b\src\scenarios\test-invariant-runner.ts
apps\spike-b\src\scenarios\test-idempotency.ts
apps\spike-b\src\scenarios\test-failure-injection.ts
apps\spike-b\src\scenarios\test-basic-100.ts
apps\spike-b\src\scenarios\provider-smoke.ts
apps\spike-b\src\scenarios\test-retry-permanent.ts
apps\spike-b\src\scenarios\test-no-cross-tenant.ts
apps\spike-b\src\scenarios\test-rls-mismatch.ts
apps\spike-b\src\scenarios\test-stale-reclaim.ts
apps\spike-a\src\scenarios\test-nested-tx.ts
apps\spike-a\src\scenarios\test-negative.ts
apps\spike-a\src\scenarios\test-invariant-runner.ts
apps\spike-a\src\scenarios\test-audit.ts
apps\spike-a\src\scenarios\provider-smoke.ts
apps\spike-a\src\scenarios\test-read.ts
apps\spike-a\src\scenarios\test-pgbouncer-auth.ts
apps\spike-a\src\scenarios\test-perf.ts
apps\spike-a\src\scenarios\test-rollback.ts
apps\spike-a\src\scenarios\test-write.ts
apps\spike-e\src\session.ts
apps\spike-e\src\seed.ts
apps\spike-e\migrations\005_rls_test_table.sql
apps\spike-e\migrations\004_audit_event.sql
apps\spike-e\migrations\003_auth_session.sql
apps\spike-e\migrations\002_admin_user.sql
apps\spike-e\migrations\001_roles_extensions.sql
apps\web\src\app\layout.tsx
apps\web\src\lib\tenant.ts
apps\web\src\lib\slug-resolver.ts
apps\web\src\lib\site-url.ts
apps\web\src\lib\site-metadata.ts
apps\web\src\lib\site-meta-fetch.ts
apps\web\src\lib\site-initial.ts
apps\web\src\lib\session-cookie.ts
apps\web\src\lib\save-result.ts
apps\web\src\lib\public-tenant.ts
apps\web\src\lib\public-db.ts
apps\web\src\lib\post-login-redirect.ts
apps\web\src\lib\page-context.ts
apps\web\src\lib\markdown.ts
apps\web\src\styles\globals.css
apps\web\scripts\local-pass.ts
apps\web\src\app\page.tsx
apps\spike-e\src\errors.ts
apps\spike-e\src\env.ts
apps\web\src\lib\db.ts
apps\web\src\lib\db-projection.ts
apps\web\src\lib\clinic-profile-schema.ts
apps\web\src\lib\action-context.ts
apps\web\src\lib\env.ts
apps\web\src\lib\deny-reason-map.ts
apps\web\src\lib\errors.ts
apps\spike-e\src\audit.ts
apps\spike-e\src\magic-link.ts
apps\spike-e\src\fixtures.ts
apps\spike-e\src\migrate.ts
apps\spike-e\src\resolve-tenant-context.ts
apps\web\src\app\sign-out\route.ts
apps\web\src\lib\json-ld\entities.ts
apps\web\src\lib\json-ld\builders.ts
apps\web\src\lib\json-ld\JsonLdScript.tsx
apps\web\src\lib\json-ld\types.ts
apps\spike-e\src\scenarios\test-invariant.ts
apps\spike-e\src\scenarios\test-invalid-instance-id.ts
apps\spike-e\src\scenarios\test-inactive-user.ts
apps\spike-e\src\scenarios\test-drizzle-adapter-smoke.ts
apps\spike-e\src\scenarios\test-client-tampering.ts
apps\spike-e\src\scenarios\test-action-eligibility.ts
apps\spike-e\src\scenarios\provider-smoke.ts
apps\spike-e\src\scenarios\test-rls-integration.ts
apps\spike-e\src\scenarios\test-membership-removal.ts
apps\spike-e\src\scenarios\test-magic-link-login.ts
apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts
apps\spike-e\src\scenarios\test-super-admin-switch.ts
apps\spike-e\src\scenarios\test-session-refresh.ts
apps\spike-e\src\scenarios\test-tenant-resolve-cross.ts
apps\spike-e\src\scenarios\test-tenant-resolve-own.ts
apps\web\src\app\sign-in\page.tsx
apps\web\src\components\forms\TreatmentPageForm.tsx
apps\web\src\components\forms\Field.tsx
apps\web\src\components\forms\DoctorProfileForm.tsx
apps\web\src\components\forms\DeleteForm.tsx
apps\web\src\components\forms\ClinicProfileForm.tsx
apps\web\src\components\forms\ArticleForm.tsx
apps\web\src\app\sign-in\actions.ts
apps\web\src\app\(admin)\layout.tsx
apps\spike-e\src\db\client.ts
apps\web\src\components\site\TreatmentCard.tsx
apps\web\src\components\site\SiteHeader.tsx
apps\web\src\components\site\SiteFooter.tsx
apps\web\src\components\site\ReservationChannels.tsx
apps\web\src\components\site\Hero.tsx
apps\web\src\components\site\DoctorCard.tsx
apps\web\src\components\site\BusinessHoursTable.tsx
apps\web\src\components\site\Breadcrumb.tsx
apps\web\src\components\site\ArticleBody.tsx
apps\web\src\components\dev\MockMailbox.tsx
apps\web\src\lib\json-ld\__tests__\validate.ts
apps\web\src\app\api\health\route.ts
apps\web\src\app\api\site-meta-fetch\route.ts
apps\web\src\app\sign-in\consume\route.ts
apps\web\src\app\sign-in\cleanup\route.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\page.tsx
apps\web\src\app\(site)\[instanceSlug]\page.tsx
apps\web\src\app\(site)\[instanceSlug]\not-found.tsx
apps\web\src\app\(site)\[instanceSlug]\treatments\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\[slug]\page.tsx
apps\web\src\app\(site)\[instanceSlug]\treatments\[slug]\page.tsx
apps\web\src\app\(site)\[instanceSlug]\layout.tsx
apps\web\src\app\(site)\[instanceSlug]\sitemap.xml\route.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\treatments\new\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\page.tsx
apps\web\src\app\(site)\[instanceSlug]\about\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts
apps\web\src\app\(site)\[instanceSlug]\doctors\page.tsx
apps\web\src\app\(site)\[instanceSlug]\robots.txt\route.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\actions.ts
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\[slug]\page.tsx
apps\web\src\app\(site)\[instanceSlug]\contact\page.tsx
apps\web\src\app\(site)\[instanceSlug]\legal\[type]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\doctors\new\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx
apps\web\src\app\(admin)\admin\[instanceSlug]\articles\new\page.tsx
apps\web\src\app\(site)\[instanceSlug]\locations\[slug]\page.tsx
apps\web\src\app\(site)\[instanceSlug]\doctors\[slug]\page.tsx
apps\web\src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx

 succeeded in 592ms:
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
작업트리가 큰 변경 세트를 포함하고 있습니다. 리뷰 범위가 새 파일 중심이라, 기존 삭제/이동 상태는 되돌리지 않고 현재 상태 기준으로 검증하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"function|export|doctorsListGraph|doctorProfileGraph|treatmentsListGraph|articleDetailGraph|location|validateJsonLdGraph|MedicalClinic|siteBaseUrl|transformTags|sanitizeHtml|cache\\(|withPublicTenantTransaction|businessHours|ContactPoint|PUBLIC_SITE_ORIGIN|WEB_PUBLIC_DATABASE_URL\" apps/web/src/lib apps/web/src/app/\\(site\\) apps/web/src/components/site packages/db/migrations/D0011_public_reader.sql packages/migrations-runner/src/manifest.ts apps/web/src/app/\\(admin\\)/admin apps/web/src/app/page.tsx apps/web/src/app/sign-in/consume/route.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.12|1\\.2|2\\.1|PSR-CASCADE|Scenario|시나리오|P-003|P-004|P-005|P-006|P-010|7\\.\" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md docs/ARCHITECTURE.md docs/core/SCHEMA_MAPPING.md docs/decisions/M0_BUILD_EXPORT_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'pnpm --filter @glitzy/web typecheck' in C:\Users\assag\solution\website-exposure
2026-05-18T04:55:13.739455Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.5 seconds
Output:
[31;1msite\: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … UBLIC_DATABASE_URL" apps/web/src/lib apps/web/src/app/\([36;1msite\[0m) apps/w …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'site\' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 exited 1 in 537ms:
[31;1msite\: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … UBLIC_DATABASE_URL" apps/web/src/lib apps/web/src/app/\([36;1msite\[0m) apps/w …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'site\' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 succeeded in 586ms:
docs/decisions/M0_BUILD_EXPORT_PLAN.md:22:### 1.2 LL-CASCADE-04 책임 (LOCATION_LEGAL_PLAN v1.0 cascade)
docs/decisions/M0_BUILD_EXPORT_PLAN.md:49:- 시나리오 LOCAL_PASS — 발행 트리거 → Git commit → 빌드 성공.
docs/decisions/M0_BUILD_EXPORT_PLAN.md:51:### 2.1 PUBLIC_SITE_RENDER_PLAN SSR 컴포넌트 재사용 (PSR-CASCADE-03)
docs/decisions/M0_BUILD_EXPORT_PLAN.md:63:| `@id` entity 패턴 | path-based (SCHEMA_MAPPING § 1.2 v0.1 임시 표) | 도메인 매핑 SoT 표 — entity continuity 전환 룰 (301 redirect + `sameAs` 보조 marker) |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:65:본 § 2.1 은 `PUBLIC_SITE_RENDER_PLAN` 의 acceptance precondition cascade (PSR-CASCADE-03) — apps/worker 구현 시 별도 컴포넌트 작성 부담 없음. 본 plan v1.0 합류 시 § 2.1 상세화.
docs/ARCHITECTURE.md:51:| F-06 | 네이버 공식 블로그: 개편 이후 공공기관 출처 클릭 77.2%, 학술·연구 30.7% 증가 | 네이버 공식 블로그 | 사용자 공유 본문 | 게시: 2025 추정 | 네이버 자체 측정치. 외부 검증 불가 |
docs/ARCHITECTURE.md:77:| 측정된 효과 | 공공기관 +77.2%, 학술·연구 +30.7% | F-06 |
docs/ARCHITECTURE.md:79:### 1.2 솔루션이 표준화해야 할 본질
docs/ARCHITECTURE.md:87:7. 의료광고법·심의 표준 준수
docs/ARCHITECTURE.md:95:### 2.1 두 평면 + 3 레이어 + Feature Modules
docs/ARCHITECTURE.md:161:7. **Plane 분리**: Control Plane(어드민)이 죽어도 Data Plane(이미 빌드된 사이트)은 작동한다. 어드민의 일시 중단이 사이트 서비스 중단을 의미하지 않는다.
docs/ARCHITECTURE.md:350:## 5. 확장 시나리오
docs/ARCHITECTURE.md:401:## 7. 세부 명세 문서 로드맵
docs/ARCHITECTURE.md:533:### 11.2 keyword-monitoring vs search-visibility 책임 경계
docs/ARCHITECTURE.md:601:| 2026-05-13 | v0.4 | **주요 갱신** (피드백 3차): (1) Control Plane / Data Plane 위상 도입 (§ 0, § 2.1, § 10), (2) Admin-first 개발 접근 명시, (3) Vertical Slice (M0) 개념 + 6개 화면 명세 (Article 포함), (4) Git 원본 vs 어드민 DB 원본 데이터 분리 명확화 (§ 2.5), (5) ComplianceRecord 마스터 정리 (§ 9.4), (6) Feature Modules에 **search-visibility** 신규 추가, keyword-monitoring과 책임 경계 명시 (§ 11.2), (7) D-21 추가, D-10 결정 완료 | Glitzy (Claude 페어링) |
docs/core/SCHEMA_MAPPING.md:25:- **빌드 검증**: **자체 JSON schema/rule checker**가 빌드 게이트 (필수 필드·풀 entity 누락·금지 schema 사용 시 빌드 실패). schema.org official validator·Google Rich Results Test는 **운영 모니터링·수동 QA** (§ 7.2).
docs/core/SCHEMA_MAPPING.md:52:### 1.2 `@id` 네이밍 규약
docs/core/SCHEMA_MAPPING.md:68:#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)
docs/core/SCHEMA_MAPPING.md:127:> Organization·MedicalClinic·Physician 같은 entity에 inLanguage를 박으면 validator 노이즈. 보조 메타로 헤더의 `<html lang="ko-KR">`·meta inLanguage가 이미 표시함 (SEARCH_STANDARDIZATION § 2.1 정합).
docs/core/SCHEMA_MAPPING.md:135:### 2.1 표준 Schema 모듈
docs/core/SCHEMA_MAPPING.md:145:| `Physician` | P-004 Doctor Profile, Article의 author·reviewedBy | DoctorProfile (C-02) |
docs/core/SCHEMA_MAPPING.md:146:| `MedicalProcedure` | P-006 Treatment Detail | TreatmentPage (C-03) |
docs/core/SCHEMA_MAPPING.md:148:| `Article` | P-010 Article Detail | Article (C-04) |
docs/core/SCHEMA_MAPPING.md:152:| `ItemList` | List 페이지 (P-003·P-005·P-007·P-009·...) | (생성기 자동) |
docs/core/SCHEMA_MAPPING.md:154:| `VideoObject` | Article.embeddedMedia[].type=youtube·video, P-010의 contentFormat=video | EmbeddedMedia |
docs/core/SCHEMA_MAPPING.md:180:> 본 요약은 § 8 상세표와 일치한다. § 7.3에 룰 레벨 정의 (fail/warning/content-gate).
docs/core/SCHEMA_MAPPING.md:194:> `HowTo`는 미사용 (M0 사용 계획 없음). 미래에 P-006 `visitFlow`·`process`를 HowTo로 매핑할 경우 카탈로그·결정표·의료 리스크 룰을 함께 추가해야 함 (SM 신규 필요).
docs/core/SCHEMA_MAPPING.md:222:| `Physician` 풀 엔티티 | Conditional | P-004 상세 페이지에서만 풀, 다른 페이지는 참조 |
docs/core/SCHEMA_MAPPING.md:223:| `MedicalProcedure` 풀 엔티티 | Conditional | P-006 상세 페이지에서만 풀 |
docs/core/SCHEMA_MAPPING.md:225:| `Article` 풀 엔티티 | Conditional | P-010 상세 페이지에서만 풀 |
docs/core/SCHEMA_MAPPING.md:226:| `FAQPage` | Conditional | P-011 또는 FAQ 블록 포함 페이지 (P-006·P-008·P-010 등) |
docs/core/SCHEMA_MAPPING.md:227:| `ItemList` | Conditional | List 페이지 (P-003·P-005·P-007·P-009) |
docs/core/SCHEMA_MAPPING.md:256:| `MedicalClinic` (`#clinic` 본원) | **풀 entity 출력** — 위치·시간·연락이 본문에 의미 있게 표시되거나 예약 action이 풀 entity로 필요한 페이지 | P-001(Home), P-002(About), P-006(Treatment Detail — 예약 CTA·담당 의료진 연계), P-012(Contact), P-014(Location main), P-105(Reservation — 예약 action 풀 필요) |
docs/core/SCHEMA_MAPPING.md:257:| `MedicalClinic` 참조 | **참조만** — 위치 정보가 페이지 본문에 표시되지 않는 페이지 | P-003(Doctors List), P-004(Doctor Profile), **P-005(Treatments List — 시술 카드 목록 위주, 위치 슬롯 없음)**, P-007/8(Conditions), P-009/10(Articles), P-011(FAQ), P-013(Legal), P-101(Reviews), P-102(Pricing), P-103(Facilities), P-104(News), P-106(Self-test) |
docs/core/SCHEMA_MAPPING.md:263:> § 7.1 빌드 룰 checker는 본 표를 기준으로 페이지별 필수 풀 entity 존재 여부를 검증한다.
docs/core/SCHEMA_MAPPING.md:315:| `potentialAction` | `reservationChannels[]` 중 예약 채널 **또는 페이지/시술 CTA가 예약 채널**일 때 → `ReserveAction` (Conditional, § 2.1·§ 2.4 참조) |
docs/core/SCHEMA_MAPPING.md:378:### P-003. Doctors List
docs/core/SCHEMA_MAPPING.md:408:> 정책 변경 (피드백 반영): 목록에는 `name`·`url`·`image`·`jobTitle` 등 **최소 inline 필드** 포함 (검색 엔진이 외부 fragment를 따라가지 않는 경우 대응). 각 Physician 풀필드는 P-004 상세 페이지의 그래프에서 정의.
docs/core/SCHEMA_MAPPING.md:412:### P-004. Doctor Profile
docs/core/SCHEMA_MAPPING.md:445:### P-005. Treatments List
docs/core/SCHEMA_MAPPING.md:452:5. `ItemList` — **[풀]** — 최소 inline + `@id` 참조 (P-003과 동일 패턴)
docs/core/SCHEMA_MAPPING.md:475:### P-006. Treatment Detail
docs/core/SCHEMA_MAPPING.md:527:### P-007. Conditions List
docs/core/SCHEMA_MAPPING.md:534:5. `ItemList` — **[풀]** — 최소 inline (`name`·`url`·`description`) + `MedicalCondition` `@id` 참조 (P-003·P-005 패턴 동일)
docs/core/SCHEMA_MAPPING.md:604:### P-010. Article Detail
docs/core/SCHEMA_MAPPING.md:613:7. `WebPage` — **[풀]**, `isPartOf: #website`
docs/core/SCHEMA_MAPPING.md:673:**FAQPage**: 위 P-006 FAQPage와 동일 구조. 페이지 전체가 Question 모음일 때 `mainEntity` 배열.
docs/core/SCHEMA_MAPPING.md:882:| P-004 Doctor Profile | `doctor: DoctorProfile` |
docs/core/SCHEMA_MAPPING.md:883:| P-006 Treatment Detail | `treatment: TreatmentPage`, `relatedDoctors: DoctorProfile[]`, `relatedConditions: MedicalConditionPage[]`, `faqs: FAQ[]` |
docs/core/SCHEMA_MAPPING.md:885:| P-010 Article Detail | `article: Article`, `author: DoctorProfile`, `reviewer?: DoctorProfile`, `relatedArticles: Article[]`, `relatedTreatments: TreatmentPage[]` |
docs/core/SCHEMA_MAPPING.md:888:| List 페이지 (P-003·P-005·P-007·P-009) | `items: T[]` (해당 entity 메타) |
docs/core/SCHEMA_MAPPING.md:905:## 7. 빌드 시 검증
docs/core/SCHEMA_MAPPING.md:907:### 7.1 필수 필드 검증
docs/core/SCHEMA_MAPPING.md:914:| P-001·P-002·P-006·P-012·P-014 (필수) / P-105 (활성화 시) | **`MedicalClinic` 풀** (§ 2.5 풀 지정) + `name`·`address`·`telephone`·`openingHoursSpecification` |
docs/core/SCHEMA_MAPPING.md:915:| P-004 | `Physician` + `name`·`jobTitle`·`medicalSpecialty`·`hasCredential` |
docs/core/SCHEMA_MAPPING.md:916:| P-006 | `MedicalProcedure` + `name`·`description`·`howPerformed` |
docs/core/SCHEMA_MAPPING.md:918:| P-010 | `Article` + `headline`·`description`·`datePublished`·`author`·`publisher` |
docs/core/SCHEMA_MAPPING.md:923:### 7.2 빌드 게이트 vs 운영 모니터링 분리
docs/core/SCHEMA_MAPPING.md:933:### 7.3 룰 레벨 분류 (§ 8 금지·주의 schema 처리)
docs/core/SCHEMA_MAPPING.md:974:| SM-07 | ~~Schema validator 도구 선정~~ | **v0.3 해소** — 빌드 게이트는 **자체 JSON schema/rule checker** (§ 7.2). 공식 validator·Google Rich Results Test는 운영 모니터링·수동 QA로 분리 |
docs/core/SCHEMA_MAPPING.md:984:| 2026-05-14 | v0.2 | **피드백 정합 정정**: (1) **C-15/CT-15 혼동 → C-15로 통일** (SchemaInput은 데이터 계약, CT 아님), (2) **inLanguage 정책 좁힘** — CreativeWork·페이지 entity에만, (3) **MedicalClinic 사용처 정합** — § 2.1 카탈로그 "전 페이지 본원 1개 포함" 명시 (그래프 정의와 일치), (4) **P-002 About 정정** — address 매핑 제거(LocationProfile SoT), mediaCoverage는 sameAs 또는 CreativeWork 보조로, (5) **ItemList inline 필드 추가** — P-003/P-005/P-007/P-009에 name·url·image·기타 최소 필드 + @id 참조 병행, (6) **List 페이지 그래프에 WebPage 추가** — § 7.1 검증 룰과 정합 (이전 누락), (7) **evidenceNotes 매핑 보수화** — `MedicalStudy` → `citation`/`CreativeWork` (EvidenceNote 필드로 MedicalStudy 구성 부족), (8) **§ 2.3 신규** — Schema Rich Results 실효 vs Entity 의미 전달 분류 |
docs/core/SCHEMA_MAPPING.md:985:| 2026-05-14 | v0.3 | **빌드 가능 규칙화** (피드백 10건): (1) **§ 1.1 Core 출력 범위 한정** — 외부 위젯 schema 충돌 가능성 명시, (2) **§ 1.4 본원 @id 일관성 (SM-05 해소)** — `/#clinic` 단일 entity, 다지점 비본원만 `/locations/{slug}#clinic`, alias 금지, (3) **§ 2.1 WebSite Home 전용** — 다른 페이지는 `isPartOf` 참조만, (4) **§ 2.1 Person M0 외 후속** — authorType != clinician은 데이터 모델 확장 후, (5) **§ 2.4 신규 — Allowed/Conditional/Blocked 3단계 분류**, (6) **§ 3 P-010 graph 구성 [풀]/[참조+inline]/[참조만] 표기 명확화** + VideoObject Google Rich Results 최소 필드 (name·description·thumbnailUrl·uploadDate·contentUrl/embedUrl), (7) **§ 5.1 dayOfWeek enum 변환표** + specialClosures 기본 미출력 정책, (8) **§ 7.2 빌드 게이트 vs 운영 모니터링 분리** — 공식 validator는 모니터링·수동 QA로, (9) **§ 7.3 룰 레벨 분류 (fail/warning/content-gate)** + **§ 8 표에 룰 레벨 명시** |
docs/core/SCHEMA_MAPPING.md:986:| 2026-05-14 | v0.4 | **잔재 정리·룰 충돌 해소** (피드백 8건): (1) **§ 2.3 A/B 카테고리 풀명세 재펼침** ("이전과 동일" 잔재 제거), (2) **inLanguage 잔재 4곳 제거** — Organization·MedicalClinic·Physician·MedicalProcedure 매핑 표, (3) **MedicalRiskFactor 룰 충돌 해소** — schema 출력은 **fail로 통일**, 본문 표현(원인·위험요인)은 별도 content-gate 분리, (4) **§ 9 미결정 정리** — SM-05·SM-07 "해소" 표시, (5) **P-106 Quiz 제거** — `WebPage`/`MedicalWebPage`만, (6) **P-103 ImageGallery 제거** — 본문 갤러리 또는 `WebPage.image: ImageObject[]`, (7) **§ 5 C-02 Person 후속** 명시 (M0 외), (8) **§ 7.3 warning 예시에서 MedicalRiskFactor 제거** (fail로 통일) — `MedicalIndication` 단정형·`HealthAndBeautyBusiness` 단독 사용 등으로 교체 |
docs/core/SCHEMA_MAPPING.md:988:| 2026-05-14 | v0.6 | **정책 표 정합화** (피드백 7건): (1) **§ 2.5 신설 — 공통 entity별 페이지 출력 정책 (단일 SoT)** — Organization/WebSite/MedicalClinic의 풀 entity vs 참조 위치 명시. § 7.1 룰 checker가 본 표 기준으로 검증, (2) "풀 entity vs 참조" 용어 정의 — graph[]에 entity 정의 여부 명확, (3) **§ 0 요약 일관화** — "신중하게" → fail로, validator 표현을 § 7.2와 일치 (자체 checker = 빌드, 공식 validator = 모니터링), (4) **LocalBusiness 별도 출력 제거** — § 2.1·§ 5 C-20 정정. `MedicalClinic`이 LocalBusiness sub-class이므로 `@type: "MedicalClinic"`만 사용, LocalBusiness 계열 속성 활용, (5) **SearchAction Conditional** — `/search` 라우트 부재 시 미출력 (M0 미출력, 검색 기능 활성화 시 합류), (6) **§ 7.3 warning 예시 교체** — MedicalIndication·HealthAndBeautyBusiness 제거(둘 다 fail). 비차단 항목(외부 위젯 @id 충돌·VideoObject 권장 필드 누락·본문 길이 미달 등)으로 교체 |
docs/core/SCHEMA_MAPPING.md:989:| 2026-05-14 | v0.7 | **§ 2.5 SoT 기준 일괄 동기화** (피드백 7건): (1) **§ 2.1 SearchAction Conditional 명시**, **ReserveAction을 LocalBusiness → MedicalClinic.potentialAction**으로 정정, (2) **§ 2.4 MedicalClinic 결정 변경** — "본원 1개 전 페이지" → "§ 2.5 정책에 따라 full 또는 ref", (3) **§ 2.5 P-105 Reservation 풀 entity로 재분류**, P-101~P-106 일괄 ref 거친 표현 세분화, (4) **§ 3·§ 4 페이지별 graph 구성 [풀]/[참조]/[참조+inline] 표기 일괄 적용** — P-003·P-004·P-007·P-008·P-009·P-010·P-011·P-013·P-101~P-106, (5) **§ 7.1 검증 룰 정정** — "PageMeta.canonical 필수" → "**resolved canonical URL 필수** (PageMeta.canonical 또는 SchemaInput.canonicalUrl로 결정)" |
docs/core/SCHEMA_MAPPING.md:990:| 2026-05-14 | v0.8 | **§ 2.5 cascade 마무리** (피드백 6건): (1) **P-005 MedicalClinic [참조만]로 변경** — PAGE_TYPES § 3 P-005에 위치 정보 슬롯 없음. § 2.5 풀 지정 페이지에서 제거, (2) **P-005·P-006·P-012·P-014 [풀]/[참조] 표기 적용** — v0.7 일괄 적용 시 누락된 페이지 보완, (3) **P-014 @id 분기 명시** — 단지점 main = `#clinic` (본원 entity와 동일), 다지점 비본원 = `/locations/{slug}#clinic` (별도 entity), (4) **§ 7.1 일반 검증 룰 추가** — "§ 2.5에서 풀로 지정된 entity는 해당 페이지 필수" (룰 checker의 일반 룰. 페이지별 명시는 보조), (5) **§ 7.1 MedicalClinic 풀 페이지 목록 확장** — P-001·P-002·P-006·P-012·P-014·P-105 (이전 P-012·P-014만), (6) **§ 2.1 ReserveAction Conditional 명확화** — "reservationChannels 또는 페이지 예약 CTA가 실제 있을 때만" |
docs/core/SCHEMA_MAPPING.md:991:| 2026-05-14 | v0.9 | **Conditional·미결정 다듬기** (피드백 5건): (1) **ReserveAction 조건 § 2.1·§ 2.4 통일** — `(a) #clinic 풀 entity 페이지 + (b) reservationChannels 예약 채널 존재 또는 페이지/시술 CTA가 예약 채널`, (2) **§ 7.1 선택 페이지 검증 단서** — "선택 페이지(P-101~P-106)는 인스턴스에서 활성화된 경우에만 검증" (FeatureModuleConfig·라우트 설정 기준). P-105 등 풀 필수 페이지 목록에 "활성화 시" 명시, (3) **SM-03 수준 낮춤** — 완전 미결정 → "출력 포맷 세부 확정 필요" (정책은 § 5.1에 정의됨), (4) **SM-06 이름 정정** — "Quiz·Self-test schema 모범" → "P-106 Self-test의 `MedicalWebPage` 세부 필드 정책" (Quiz는 fail로 확정) |
docs/core/SCHEMA_MAPPING.md:992:| 2026-05-14 | v0.10 | **미세 표현 정합** (피드백 4건): (1) § 3 P-001 MedicalClinic potentialAction 행에 "페이지/시술 CTA가 예약 채널일 때"도 포함 명시, (2) § 4 P-105 — "ReserveAction 풀필드" → "**상세 필드 포함** (독립 entity 아닌 MedicalClinic.potentialAction 중첩 구조)", (3) § 7.1 선택 페이지 검증 기준에 **InstanceManifest 추가** — P-103·P-104·P-105는 Instance 결정·P-106은 Feature Module 기반 등 활성화 경로 다양화, (4) **§ 2.2 제목에 "룰 레벨 상세는 § 8" 명시** — fail/warning/content-gate 기조와 정합 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:3:> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 cycle 5 회 closeableAfterPatch=true 확정. 누계 31 findings 전건 수용 · 수렴 추세 **21 → 7 → 2 → 1 → 0**. 5 PSR-CASCADE 모두 PASS (01a docs · 02 SCHEMA_MAPPING § 1.2 · 03 M0_BUILD_EXPORT_PLAN § 2.1 · 04 manifest D0011 · 05 pgbouncer userlist). 01b (apps/web 디렉토리 이동 + redirect/revalidate 변경) 는 별 **PUBLIC_SITE_RENDER code v1.0** cycle 분리 (LOCATION_LEGAL plan/code 분리 패턴 정합). ADMIN_UI_SKELETON code v1.0 + LOCATION_LEGAL code v1.0 acceptance 직후 진입하는 첫 공개 사이트 plan.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:5:> **acceptance commit 구성 (LL-33 패턴 정합)**: 본 commit 에 다음 cascade 동시 포함 — (1) PUBLIC_SITE_RENDER_PLAN.md v1.0 (본 문서) (2) PSR-CASCADE-01a docs/admin/ARCHITECTURE.md § 3.12 patch (3) PSR-CASCADE-02 docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based 표 + entity continuity 전환 룰 (4) PSR-CASCADE-03 docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 SSR 재사용 표 (5) PSR-CASCADE-04 packages/migrations-runner/src/manifest.ts D0011 entry (6) PSR-CASCADE-05 apps/spike-a/pgbouncer/userlist.txt 안 `app_public_reader` 추가. PSR-CASCADE-01b 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 의 acceptance commit 에서 별도 진행.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:15:- `docs/core/PAGE_TYPES.md` — 필수 14종 페이지 (P-001~P-014) · M0 게이트 #1 의 10페이지: **P-001·P-002·P-003·P-004·P-005·P-006·P-012·P-013·P-014 + P-010 1샘플** (cycle1 PSR-01 정정).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:16:- `docs/core/SCHEMA_MAPPING.md` — 페이지별 graph 구성 (§ 2.5 공통 entity 출력 정책 + § 3 페이지 그래프 + § 1.2 `@id` 네이밍 규약).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:18:- `docs/core/CONTENT_STANDARDS.md` v1.3 — answer-first AST · § 7.1.1.1 LegalDocument 면제.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:30:  - `apps/web/src/app/sign-in/...` (consume route — redirect target `/<firstSlug>` → `/admin/<firstSlug>` 로 patch · PSR-CASCADE-01)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:40:### 1.2 범위 (포함) — cycle1 PSR-01·02·06·11 정정
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:45:| **어드민 URL prefix `/admin/<instanceSlug>/...`** (cycle1 PSR-02 격상) | 공개 path namespace 와 분리. acceptance precondition. 코드 cascade (PSR-CASCADE-01) 동시 적용 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:46:| **10페이지 minimal** (cycle1 PSR-01 정정) | P-001 `/` · P-002 `/about` · P-003 `/doctors` · P-004 `/doctors/[slug]` · P-005 `/treatments` · P-006 `/treatments/[slug]` · P-010 `/insights/[category]/[slug]` (1샘플) · P-012 `/contact` · P-013 `/legal/[type]` (5종) · P-014 `/locations/[slug]` (main 1건) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:52:| Next metadata API + theme-color + og:type 매핑 (cycle1 PSR-10 정정) | title · description · canonical · OpenGraph · Twitter · robots · `themeColor` 2값 (light/dark) · og:type P-004 `profile`, P-006/P-010 `article`, 기타 `website` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:82:### 2.1 route group 구조 (PSR-ROUTE-01) — cycle1 PSR-02·03 정정
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:96:│     │  ├─ page.tsx                     -- P-003 Doctors List
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:97:│     │  └─ [slug]/page.tsx              -- P-004 Doctor Profile
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:99:│     │  ├─ page.tsx                     -- P-005 Treatments List
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:100:│     │  └─ [slug]/page.tsx              -- P-006 Treatment Detail
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:103:│     │     └─ [slug]/page.tsx           -- P-010 Article Detail (1샘플 · category=general v0.1)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:111:├─ sign-in/...                           -- (변경: consume redirect target `/admin/<slug>` · PSR-CASCADE-01)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:126:  - 시나리오: 어드민 진입 시 `/admin/<slug>` 로 자동 redirect. 공개 site `/<slug>` 는 별 응답
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:219:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:327:| P-003 Doctors List | `<DoctorCard>` grid | DoctorProfile (active ORDER BY displayOrder ASC, id ASC) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:328:| P-004 Doctor Profile | `<DoctorHero>` · `<ArticleBody markdown={doctor.bio}>` · `<RelatedTreatments>` · `<RelatedArticles>` | DoctorProfile + 본인 author Articles |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:329:| P-005 Treatments List | `<TreatmentCard>` grid | TreatmentPage (RLS 자동 published only ORDER BY publishedAt DESC) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:330:| P-006 Treatment Detail | `<TreatmentHero>` · `<ArticleBody markdown={treatment.body_markdown}>` · `<TreatmentSummary>` · `<ContactCta>` | TreatmentPage |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:331:| P-010 Article Detail (1샘플) | `<ArticleHero>` (title·summary·publishedAt·author) · `<ArticleBody markdown={article.body_markdown}>` | Article + author Doctor |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:344:- LegalDocument 본문 (CONTENT_STANDARDS § 7.1.1.1 면제) 도 동일 컴포넌트 사용 — answer-first AST · 표현 검사 미적용은 어드민 저장 단계의 결정이지 렌더 단계와 무관.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:409:    type: <page-specific>,        // P-001/P-002/P-003/P-005/P-012/P-014 = "website" · P-004 = "profile" · P-006 = "article" · P-010 = "article" · P-013 = "website" (v0.1 미노출)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:428:- (PSR-SEO-02 · cycle1 PSR-10 + cycle2 PSR-23 정정) `themeColor` 2값 출처 — DESIGN_TOKENS § 6 `BrandTokens.colors.light.primary` / `BrandTokens.colors.dark.primary` (= `color.brand.primary` 의 light/dark 평면화 결과). 인스턴스별 brandTokens 미주입 단계 (v0.1) 는 DESIGN_TOKENS § 3.2 default `color.brand.primary` light = `blue.600` (#2563eb) / dark = `blue.400` (#60a5fa) fallback. SEARCH_STANDARDIZATION § 2.1 정합.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:429:- (PSR-SEO-03 · cycle1 PSR-10) `og:type` 매핑 — P-004 `profile` · P-006 `article` · P-010 `article` · 그 외 `website`.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:430:- (PSR-SEO-04) canonical v0.1: `https://<host>/<instanceSlug><path>` path-based. M0 v1.0 도메인 매핑 합류 시 entity continuity migration (PSR-CASCADE-02 참조).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:444:| P-003 Doctors List | monthly | 0.7 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:445:| P-004 Doctor Profile | monthly | 0.7 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:446:| P-005 Treatments List | monthly | 0.8 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:447:| P-006 Treatment Detail | monthly | 0.8 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:448:| P-010 Article Detail | monthly | 0.5 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:454:  - Article (P-010): `Article.dateModified` 우선. C-04 에 별도 `dateModified` 컬럼 없음 v0.1 — `published_at` 사용 (M1 cascade).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:455:  - Treatment (P-006): C-03 명시 `dateModified` 없음 v0.1 — `published_at` fallback.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:550:| P-003 Doctors List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(Physician refs) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:551:| P-004 Doctor Profile | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Physician` · `[풀] WebPage` · `[풀] BreadcrumbList` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:552:| P-005 Treatments List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(MedicalProcedure refs) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:553:| P-006 Treatment Detail | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] MedicalProcedure` · `[풀] WebPage` · `[풀] BreadcrumbList` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:554:| P-010 Article Detail | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Article` · `[풀] WebPage` · `[풀] BreadcrumbList` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:560:- (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:565:  - LOCAL_PASS 시나리오 18 의 통과 기준 = 자체 checker 통과
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:583:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:585:| 7 | `packages/migrations-runner/src/manifest.ts` v0.x — D0011 10단계 추가 (PSR-CASCADE-04) | acceptance precondition |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:588:| 10 | LOCATION_LEGAL code v1.1 cascade — admin URL 변경 (PSR-CASCADE-01) 의 revalidatePath 6 곳 patch | acceptance precondition |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:589:| 11 | ADMIN_UI_SKELETON code v1.1 cascade — sign-in/consume redirect `/admin/<slug>` (PSR-CASCADE-01) | acceptance precondition |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:592:## 7. § 8.1 시나리오 (LOCAL_PASS 검증) — cycle1 PSR-17·18 정정
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:594:| # | 시나리오 | 통과 기준 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:602:| 7 | Article published 5건 → `/<instanceSlug>/insights/general/<slug>` 진입 가능 (1샘플) | P-010 단일 페이지 렌더 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:610:| 15 | 어드민 측 도메인 (`/admin/<slug>/...`) 와 공개 도메인 (`/<slug>/...`) 충돌 없음 — PSR-CASCADE-01 정합 | 어드민 prefix `/admin` · 공개 prefix 없음. sign-in consume redirect `/admin/<firstSlug>` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:617:| 22 | P-004 OG type = `profile` · P-006 OG type = `article` · P-010 OG type = `article` (cycle1 PSR-10) | meta `property="og:type"` 확인 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:638:| 15 | **어드민 URL `/admin` prefix 격상 (PSR-CASCADE-01)** | apps/web/src/app/(admin)/admin/[instanceSlug]/ 디렉토리 이동 + revalidatePath 6 곳 + sign-in/consume redirect target + seed.ts |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:639:| 16 | docs/admin/ARCHITECTURE.md § 3 patch — `(site)` 신설 + `/admin` prefix (PSR-CASCADE-01) | doc |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:640:| 17 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` marker + entity continuity note (PSR-CASCADE-02) | doc |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:641:| 18 | docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2 patch — apps/worker 가 본 plan SSR 컴포넌트 재사용 marker (PSR-CASCADE-03) | doc |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:642:| 19 | packages/migrations-runner manifest 10단계 (D0011 추가 — PSR-CASCADE-04) | manifest.ts |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:643:| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05 · cycle2 PSR-27 경로 정정) | apps/spike-a/pgbouncer/userlist.txt |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:644:| 21 | 시나리오 1~23 LOCAL_PASS 검증 | apps/web/scripts/site-scenarios.ts |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:680:> **acceptance 순서 정합 (LL-33 패턴)**: PSR-CASCADE-01~05 는 plan v1.0 acceptance 와 **동시 또는 직전** 에 적용. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:682:- `PSR-CASCADE-01` (cycle1 PSR-02 격상 + cycle2 PSR-24 a/b 분리):
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:683:  - **PSR-CASCADE-01a (docs · plan acceptance commit 안 동반)**: `docs/admin/ARCHITECTURE.md` § 3 patch — `(site)` 신설 + `/admin` prefix 격상 marker.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:684:  - **PSR-CASCADE-01b (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEGAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · doctors · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/seed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance ≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 에서 별도 사이클 진행.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:685:- `PSR-CASCADE-02` (cycle1 PSR-08 보강): `docs/core/SCHEMA_MAPPING.md` § 1.2 patch — v0.1 임시 path-based `@id` 패턴 + 도메인 매핑 후 (M0 v1.0) entity @id 전환 시 redirect/301/`sameAs` 처리 룰 추가 marker.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:686:- `PSR-CASCADE-03`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 patch — apps/worker 의 build/export 시점에 본 plan SSR 컴포넌트 + JSON-LD 생성기 + sitemap/robots route handler 재사용 marker.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:687:- `PSR-CASCADE-04`: `packages/migrations-runner/src/manifest.ts` — D0011 10단계 추가 (현 9단계 → 10단계).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:688:- `PSR-CASCADE-05` (cycle2 PSR-27 경로 정정): `apps/spike-a/pgbouncer/userlist.txt` — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade). 본 파일은 `apps/spike-a/docker-compose.yml` 의 pgbouncer 컨테이너에 mount 되는 정확 경로.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:695:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:696:| 2026-05-18 | **v1.0** | **Codex 비평 cycle 5 0 findings 확정 acceptance** — closeableAfterPatch=true. 수렴 추세 21 → 7 → 2 → 1 → 0. blocking 0 · major 0 · minor 0 잔존. 5 PSR-CASCADE 모두 PASS (01a · 02 · 03 · 04 · 05). 01b 는 별 code v1.0 cycle 분리. 누계 31 findings 전건 수용. acceptance commit 6 cascade 동시 포함 (LL-33 패턴 정합). |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:697:| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 1 minor finding 전건 수용 patch**: (PSR-31) § 5.3 SoT 요약 3줄 stale 정정 — § 3.1 4계열 명시 (A 일반검색 / B AI 검색 / C User-triggered / D 학습), § 3.2 enum `allow / disallowTraining / disallowAll / custom`, § 3.3 `allow` 시 `aiCrawlerLegalApproved: true` fail-gate. 5 PSR-CASCADE 모두 PASS. closeableAfterPatch=true 신호 + plan v1.0 acceptance commit 권고. 누계 cycle 1+2+3+4 = 31 findings 전건 수용. |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:698:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch**: (PSR-29) acceptance scenario #21 themeColor 기대값 stale 정정 — `BrandTokens.colors.light.primary` default `#2563eb` (light) / `#60a5fa` (dark). (PSR-30) robots.txt starter SoT line-by-line 정합 — 헤더/일반 룰/C 계열/meta-externalagent 코멘트 + Sitemap placeholder `{domain}` 통일 (SEARCH_STANDARDIZATION § 3.3 그대로). 추가 cascade 실 적용: docs/admin/ARCHITECTURE.md § 3.12 신설 (PSR-CASCADE-01a — apps/web route group `(admin)` + `(site)` 분리). apps/spike-a/pgbouncer/userlist.txt 에 `app_public_reader` 추가 (PSR-CASCADE-05). 누계 cycle 1+2+3 = 30 findings 전건 수용. 5 cascade 중 4 PASS, 01b 는 별 code v1.0 cycle. |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:699:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |

 succeeded in 2110ms:

> @glitzy/web@0.1.0 typecheck C:\Users\assag\solution\website-exposure\apps\web
> tsc --noEmit -p tsconfig.json


codex
`pnpm --filter @glitzy/web typecheck`는 현재도 PASS입니다. 이제 타입 통과로 가려지지 않는 라우팅/JSON-LD/시나리오 정합성 쪽을 라인 단위로 좁혀보겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "doctorsListGraph|doctorProfileGraph|treatmentsListGraph|articleDetailGraph|homeGraph|aboutGraph|contactGraph|locationGraph|legal|MedicalClinic|validateJsonLdGraph|siteBaseUrl|canonical|location" "apps/web/src/lib/json-ld" "apps/web/src/app/(site)"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"withPublicTenantTransaction|TransactionSql|begin|WEB_PUBLIC_DATABASE_URL|PUBLIC_SITE_ORIGIN|cache\\(|MAX\\(|updated_at|lastmod|transformTags|sanitizeHtml|protocol|nofollow|businessHours|TIME_REGEX|ISO|ContactPoint\" \"apps/web/src/lib\" \"apps/web/src/components/site\" \"apps/web/src/app/(site)\"" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"revalidatePath|redirect\\(|/admin/|admin/|ClinicProfileForm|actions\" \"apps/web/src/app/(admin)/admin/[instanceSlug]\" \"apps/web/src/app/page.tsx\" \"apps/web/src/app/sign-in/consume/route.ts\" \"apps/web/src/components/forms/ClinicProfileForm.tsx\"" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "app_public_reader|PASSWORD|password|CREATE ROLE|D0011|public_reader" "packages/db/migrations/D0011_public_reader.sql" "packages/migrations-runner/src/manifest.ts" "apps/web/.env.example" "apps/web/package.json" "pnpm-lock.yaml"' in C:\Users\assag\solution\website-exposure
 succeeded in 670ms:
apps/web/src/lib/json-ld\__tests__\validate.ts:18://   외부 origin URL 만 dereferenceable 예외. opts.siteBaseUrl 가 주어지면 그 origin 안 URL 은 graph entity 강제.
apps/web/src/lib/json-ld\__tests__\validate.ts:19:export function validateJsonLdGraph(graph: unknown, opts: { siteBaseUrl?: string } = {}): ValidationResult {
apps/web/src/lib/json-ld\__tests__\validate.ts:31:  const siteOrigin = opts.siteBaseUrl ? tryOrigin(opts.siteBaseUrl) : null;
apps/web/src/lib/json-ld\types.ts:17:  readonly siteBaseUrl: string;
apps/web/src/lib/json-ld\types.ts:18:  /** current page path relative to siteBaseUrl (예: `/about`, `/doctors/hong`) */
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:11:import { aboutGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:12:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:22:    canonicalPath: "/about",
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:31:  const hostOrigin = siteBaseUrl(params.instanceSlug);
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:33:  const graph = aboutGraph(
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:34:    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/about" },
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:36:    initial.locationMain,
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:56:            {initial.clinic.legalEntityName ? (
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:57:              <div><dt className="text-fg-muted">법인명</dt><dd className="font-medium text-fg-default">{initial.clinic.legalEntityName}</dd></div>
apps/web/src/lib/json-ld\entities.ts:18:  const id = `${ctx.siteBaseUrl}/#organization`;
apps/web/src/lib/json-ld\entities.ts:26:    ...(clinic.legalEntityName ? { legalName: clinic.legalEntityName } : {}),
apps/web/src/lib/json-ld\entities.ts:29:    url: ctx.siteBaseUrl,
apps/web/src/lib/json-ld\entities.ts:37:// PSRC-14 patch: ContactPoint @id 를 absolute pattern (`${siteBaseUrl}/#contact-...`) 으로 통일
apps/web/src/lib/json-ld\entities.ts:42:    "@id": `${ctx.siteBaseUrl}/#contact-${cta.id}`,
apps/web/src/lib/json-ld\entities.ts:51:  location: LocationProjection,
apps/web/src/lib/json-ld\entities.ts:54:    "@type": "MedicalClinic",
apps/web/src/lib/json-ld\entities.ts:55:    "@id": `${ctx.siteBaseUrl}/#clinic`,
apps/web/src/lib/json-ld\entities.ts:57:    parentOrganization: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib/json-ld\entities.ts:60:      streetAddress: location.streetAddress,
apps/web/src/lib/json-ld\entities.ts:61:      addressLocality: location.addressLocality,
apps/web/src/lib/json-ld\entities.ts:62:      addressRegion: location.addressRegion,
apps/web/src/lib/json-ld\entities.ts:63:      postalCode: location.postalCode,
apps/web/src/lib/json-ld\entities.ts:64:      addressCountry: location.addressCountry,
apps/web/src/lib/json-ld\entities.ts:66:    ...(location.telephone ? { telephone: location.telephone } : {}),
apps/web/src/lib/json-ld\entities.ts:67:    ...(location.email ? { email: location.email } : {}),
apps/web/src/lib/json-ld\entities.ts:68:    ...(location.latitude !== null && location.longitude !== null ? {
apps/web/src/lib/json-ld\entities.ts:71:        latitude: location.latitude,
apps/web/src/lib/json-ld\entities.ts:72:        longitude: location.longitude,
apps/web/src/lib/json-ld\entities.ts:75:    ...(location.businessHours.openingHours.length > 0 ? {
apps/web/src/lib/json-ld\entities.ts:76:      openingHoursSpecification: location.businessHours.openingHours.map((oh) => ({
apps/web/src/lib/json-ld\entities.ts:87:  return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#clinic` };
apps/web/src/lib/json-ld\entities.ts:91:  return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#organization` };
apps/web/src/lib/json-ld\entities.ts:97:    "@id": `${ctx.siteBaseUrl}/doctors/${doctor.slug}#physician`,
apps/web/src/lib/json-ld\entities.ts:102:    worksFor: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib/json-ld\entities.ts:110:    "@id": `${ctx.siteBaseUrl}/treatments/${treatment.slug}#procedure`,
apps/web/src/lib/json-ld\entities.ts:127:      "@id": `${ctx.siteBaseUrl}/doctors/${author.slug}#physician`,
apps/web/src/lib/json-ld\entities.ts:135:    "@id": `${ctx.siteBaseUrl}/insights/${category}/${article.slug}#article`,
apps/web/src/lib/json-ld\entities.ts:141:    publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib/json-ld\entities.ts:146:// PSRC-05 patch: WebPage 안 `about` 으로 MedicalClinic ref 를 명시 — graph 안 풀 entity 가 어떤 페이지에서 누구를 가리키는지 SCHEMA_MAPPING § 2.5 정합
apps/web/src/lib/json-ld\entities.ts:155:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#webpage`,
apps/web/src/lib/json-ld\entities.ts:156:    url: `${ctx.siteBaseUrl}${ctx.pagePath}`,
apps/web/src/lib/json-ld\entities.ts:160:    isPartOf: { "@id": `${ctx.siteBaseUrl}/#website` },
apps/web/src/lib/json-ld\entities.ts:161:    ...(options.aboutClinic ? { about: { "@id": `${ctx.siteBaseUrl}/#clinic` } } : {}),
apps/web/src/lib/json-ld\entities.ts:168:    "@id": `${ctx.siteBaseUrl}/#website`,
apps/web/src/lib/json-ld\entities.ts:170:    url: ctx.siteBaseUrl,
apps/web/src/lib/json-ld\entities.ts:172:    publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib/json-ld\entities.ts:182:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#breadcrumb`,
apps/web/src/lib/json-ld\entities.ts:187:      ...(it.path ? { item: `${ctx.siteBaseUrl}${it.path}` } : {}),
apps/web/src/lib/json-ld\entities.ts:199:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#${listId}`,
apps/web/src/app/(site)\[instanceSlug]\page.tsx:25:import { homeGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\page.tsx:26:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\page.tsx:36:    canonicalPath: "/",
apps/web/src/app/(site)\[instanceSlug]\page.tsx:74:  const graph = homeGraph(
apps/web/src/app/(site)\[instanceSlug]\page.tsx:75:    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/" },
apps/web/src/app/(site)\[instanceSlug]\page.tsx:77:    initial.locationMain,
apps/web/src/app/(site)\[instanceSlug]\page.tsx:125:      {initial.locationMain ? (
apps/web/src/app/(site)\[instanceSlug]\page.tsx:132:            <p className="text-base text-fg-default">{formatAddress(initial.locationMain)}</p>
apps/web/src/app/(site)\[instanceSlug]\page.tsx:133:            {initial.locationMain.telephone ? (
apps/web/src/app/(site)\[instanceSlug]\page.tsx:134:              <p className="mt-2 text-sm text-fg-muted">대표 전화: <a href={`tel:${initial.locationMain.telephone}`} className="text-brand-primary hover:text-brand-primary-hover">{initial.locationMain.telephone}</a></p>
apps/web/src/lib/json-ld\builders.ts:21:export function homeGraph(
apps/web/src/lib/json-ld\builders.ts:24:  location: LocationProjection | null,
apps/web/src/lib/json-ld\builders.ts:28:    ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
apps/web/src/lib/json-ld\builders.ts:36:export function aboutGraph(
apps/web/src/lib/json-ld\builders.ts:39:  location: LocationProjection | null,
apps/web/src/lib/json-ld\builders.ts:45:    ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
apps/web/src/lib/json-ld\builders.ts:52:// PSRC-05 patch: graph 안 MedicalClinic 풀 entity 출력 (location 있을 때) — WebPage.about 으로 명시.
apps/web/src/lib/json-ld\builders.ts:55:export function doctorsListGraph(
apps/web/src/lib/json-ld\builders.ts:58:  location: LocationProjection | null,
apps/web/src/lib/json-ld\builders.ts:64:    ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
apps/web/src/lib/json-ld\builders.ts:65:    E.webPageEntity(ctx, "의료진", description, { aboutClinic: location !== null }),
apps/web/src/lib/json-ld\builders.ts:69:      doctors.map((d) => ({ name: d.name, itemId: `${ctx.siteBaseUrl}/doctors/${d.slug}#physician` })),
apps/web/src/lib/json-ld\builders.ts:76:export function doctorProfileGraph(
apps/web/src/lib/json-ld\builders.ts:79:  location: LocationProjection | null,
apps/web/src/lib/json-ld\builders.ts:85:    ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
apps/web/src/lib/json-ld\builders.ts:87:    E.webPageEntity(ctx, doctor.name, description, { aboutClinic: location !== null }),
apps/web/src/lib/json-ld\builders.ts:97:export function treatmentsListGraph(
apps/web/src/lib/json-ld\builders.ts:100:  location: LocationProjection | null,
apps/web/src/lib/json-ld\builders.ts:106:    ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
apps/web/src/lib/json-ld\builders.ts:107:    E.webPageEntity(ctx, "진료", description, { aboutClinic: location !== null }),
apps/web/src/lib/json-ld\builders.ts:111:      treatments.map((t) => ({ name: t.name, itemId: `${ctx.siteBaseUrl}/treatments/${t.slug}#procedure` })),
apps/web/src/lib/json-ld\builders.ts:121:  location: LocationProjection | null,
apps/web/src/lib/json-ld\builders.ts:127:    ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
apps/web/src/lib/json-ld\builders.ts:129:    E.webPageEntity(ctx, treatment.name, description, { aboutClinic: location !== null }),
apps/web/src/lib/json-ld\builders.ts:139:export function articleDetailGraph(
apps/web/src/lib/json-ld\builders.ts:142:  location: LocationProjection | null,
apps/web/src/lib/json-ld\builders.ts:149:    ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
apps/web/src/lib/json-ld\builders.ts:151:    E.webPageEntity(ctx, article.headline, article.summary, { aboutClinic: location !== null }),
apps/web/src/lib/json-ld\builders.ts:161:export function contactGraph(
apps/web/src/lib/json-ld\builders.ts:164:  location: LocationProjection,
apps/web/src/lib/json-ld\builders.ts:169:    E.medicalClinicEntity(ctx, clinic, location),
apps/web/src/lib/json-ld\builders.ts:176:export function locationDetailGraph(
apps/web/src/lib/json-ld\builders.ts:179:  location: LocationProjection,
apps/web/src/lib/json-ld\builders.ts:184:    E.medicalClinicEntity(ctx, clinic, location),
apps/web/src/lib/json-ld\builders.ts:185:    E.webPageEntity(ctx, location.name, description),
apps/web/src/lib/json-ld\builders.ts:189:      { name: location.name, path: null },
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:12:import { treatmentsListGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:13:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:23:    canonicalPath: "/treatments",
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:40:  const graph = treatmentsListGraph(
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:41:    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/treatments" },
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:43:    initial.locationMain,
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:14:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:32:    canonicalPath: `/treatments/${t.slug}`,
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:58:  const hostOrigin = siteBaseUrl(params.instanceSlug);
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:60:    { siteBaseUrl: hostOrigin, pagePath: `/treatments/${treatment.slug}` },
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:62:    initial.locationMain,
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:12:import { contactGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:13:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:23:    canonicalPath: "/contact",
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:30:  if (!initial.locationMain) {
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:38:  const loc = initial.locationMain;
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:39:  const graph = contactGraph(
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:40:    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/contact" },
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:25:    const locationRows = await tx<{ slug: string; updated_at: Date }[]>`
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:26:      SELECT slug, updated_at FROM location_profile WHERE slug = 'main' LIMIT 1
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:46:      locationMain: locationRows[0] ?? null,
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:90:  if (data.locationMain) {
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:92:      loc: `${base}/locations/${data.locationMain.slug}`,
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:93:      lastmod: data.locationMain.updated_at.toISOString(),
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:12:import { doctorsListGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:13:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:23:    canonicalPath: "/doctors",
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:40:  const graph = doctorsListGraph(
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:41:    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/doctors" },
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:43:    initial.locationMain,
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:1:// @glitzy/web/(site)/[instanceSlug]/legal/[type] — P-013 Legal/Policy
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:6:// 합류 시점 (compliance-assistant + ComplianceRecord legalCounsel) 이후에 정상 노출.
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:14:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:31:  const legal = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:36:        FROM legal_document
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:37:       WHERE document_type = ${params.type}::legal_document_type
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:42:  if (!legal) notFound();
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:45:  const hostOrigin = siteBaseUrl(params.instanceSlug); // PSRC-15 patch
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:52:        { label: legal.title, href: null },
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:55:        <h1 className="mb-2 text-3xl font-bold text-fg-default">{legal.title}</h1>
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:56:        <p className="mb-8 text-sm text-fg-muted">시행일: {legal.effectiveDate}</p>
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:57:        <ArticleBody markdown={legal.body} hostOrigin={hostOrigin} />
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:1:// @glitzy/web/(site)/[instanceSlug]/locations/[slug] — P-014 Location Detail (v0.1 main 1건)
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:12:import { locationDetailGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:13:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:20:  if (!initial || !initial.locationMain) return {};
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:22:    pageTitle: initial.locationMain.name,
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:23:    description: `${initial.locationMain.name} · ${formatAddress(initial.locationMain)}`,
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:24:    canonicalPath: `/locations/${params.slug}`,
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:36:  if (!initial || !initial.locationMain) notFound();
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:37:  const loc = initial.locationMain;
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:39:  const graph = locationDetailGraph(
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:40:    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: `/locations/${loc.slug}` },
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:13:import { doctorProfileGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:14:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:33:    canonicalPath: `/doctors/${doctor.slug}`,
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:68:  const hostOrigin = siteBaseUrl(params.instanceSlug);
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:69:  const graph = doctorProfileGraph(
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:70:    { siteBaseUrl: hostOrigin, pagePath: `/doctors/${data.doctor.slug}` },
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:72:    initial.locationMain,
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:13:import { articleDetailGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:14:import { siteBaseUrl } from "@/lib/site-url";
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:33:    canonicalPath: `/insights/${params.category}/${a.slug}`,
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:73:  const hostOrigin = siteBaseUrl(params.instanceSlug);
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:74:  const graph = articleDetailGraph(
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:75:    { siteBaseUrl: hostOrigin, pagePath: `/insights/${params.category}/${data.article.slug}` },
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:77:    initial.locationMain,

 succeeded in 643ms:
apps/web/.env.example:13:WEB_DATABASE_URL=postgres://web_role:password@localhost:5432/glitzy_dev
apps/web/.env.example:15:# WEB_PUBLIC_DATABASE_URL: 공개 사이트 SSR 전용 — app_public_reader (read-only · RLS instance_id scope)
apps/web/.env.example:16:#   필수 grant (PUBLIC_SITE_RENDER_PLAN v1.0 § 3.1 PSR-DATA-01 / D0011_public_reader.sql):
apps/web/.env.example:17:#     CREATE ROLE app_public_reader LOGIN PASSWORD 'app_public_reader_pw';
apps/web/.env.example:18:#     GRANT USAGE ON SCHEMA public TO app_public_reader;
apps/web/.env.example:20:#                     doctor_profile, treatment_page, article, legal_document TO app_public_reader;
apps/web/.env.example:21:#     + per-table CREATE POLICY public_reader_*_select (instance_id USING + status published)
apps/web/.env.example:22:WEB_PUBLIC_DATABASE_URL=postgres://app_public_reader:app_public_reader_pw@localhost:5432/glitzy_dev
apps/web/.env.example:25:SEED_DATABASE_URL=postgres://postgres:password@localhost:5432/glitzy_dev
packages/db/migrations/D0011_public_reader.sql:1:-- @glitzy/db — D0011 app_public_reader role + per-table SELECT policy
packages/db/migrations/D0011_public_reader.sql:10:-- IF NOT EXISTS 처리는 raw SQL 외 (Postgres 는 CREATE ROLE IF NOT EXISTS 미지원) → migration runner 책임.
packages/db/migrations/D0011_public_reader.sql:12:-- PSRC-04 patch: migration 안 password 하드코딩 금지. role/권한/policy 만 생성하고
packages/db/migrations/D0011_public_reader.sql:13:-- password 는 환경별 provision 단계에서 별도 설정 (예: 로컬 dev `ALTER ROLE app_public_reader PASSWORD '...'`,
packages/db/migrations/D0011_public_reader.sql:15:CREATE ROLE app_public_reader LOGIN;
packages/db/migrations/D0011_public_reader.sql:17:GRANT USAGE ON SCHEMA public TO app_public_reader;
packages/db/migrations/D0011_public_reader.sql:22:GRANT SELECT ON instance TO app_public_reader;
packages/db/migrations/D0011_public_reader.sql:24:CREATE POLICY public_reader_instance_select
packages/db/migrations/D0011_public_reader.sql:27:  TO app_public_reader
packages/db/migrations/D0011_public_reader.sql:36:  TO app_public_reader;
packages/db/migrations/D0011_public_reader.sql:38:CREATE POLICY public_reader_clinic_profile_select
packages/db/migrations/D0011_public_reader.sql:39:  ON clinic_profile FOR SELECT TO app_public_reader
packages/db/migrations/D0011_public_reader.sql:42:CREATE POLICY public_reader_location_profile_select
packages/db/migrations/D0011_public_reader.sql:43:  ON location_profile FOR SELECT TO app_public_reader
packages/db/migrations/D0011_public_reader.sql:46:CREATE POLICY public_reader_doctor_profile_select
packages/db/migrations/D0011_public_reader.sql:47:  ON doctor_profile FOR SELECT TO app_public_reader
packages/db/migrations/D0011_public_reader.sql:54:CREATE POLICY public_reader_treatment_page_select
packages/db/migrations/D0011_public_reader.sql:55:  ON treatment_page FOR SELECT TO app_public_reader
packages/db/migrations/D0011_public_reader.sql:63:CREATE POLICY public_reader_article_select
packages/db/migrations/D0011_public_reader.sql:64:  ON article FOR SELECT TO app_public_reader
packages/db/migrations/D0011_public_reader.sql:74:CREATE POLICY public_reader_legal_document_select
packages/db/migrations/D0011_public_reader.sql:75:  ON legal_document FOR SELECT TO app_public_reader
packages/migrations-runner/src/manifest.ts:23: * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 + PUBLIC_SITE_RENDER_PLAN v0.x § 8/§ 10 의 D0011 (10단계 — PSR-25/PSR-CASCADE-04 patch).
packages/migrations-runner/src/manifest.ts:102:  // (10) app_public_reader role + per-table SELECT policy 7개 (PUBLIC_SITE_RENDER_PLAN v0.x · PSR-25 / PSR-CASCADE-04 patch)
packages/migrations-runner/src/manifest.ts:105:    file: "packages/db/migrations/D0011_public_reader.sql",
packages/migrations-runner/src/manifest.ts:108:      "app_public_reader",
packages/migrations-runner/src/manifest.ts:109:      "public_reader_instance_select",
packages/migrations-runner/src/manifest.ts:110:      "public_reader_clinic_profile_select",
packages/migrations-runner/src/manifest.ts:111:      "public_reader_location_profile_select",
packages/migrations-runner/src/manifest.ts:112:      "public_reader_doctor_profile_select",
packages/migrations-runner/src/manifest.ts:113:      "public_reader_treatment_page_select",
packages/migrations-runner/src/manifest.ts:114:      "public_reader_article_select",
packages/migrations-runner/src/manifest.ts:115:      "public_reader_legal_document_select",

 succeeded in 657ms:
apps/web/src/components/site\BusinessHoursTable.tsx:16:export function BusinessHoursTable({ hours }: { hours: LocationProjection["businessHours"] }) {
apps/web/src/lib\env.ts:10:  WEB_PUBLIC_DATABASE_URL: z.string().min(1, "WEB_PUBLIC_DATABASE_URL required"),
apps/web/src/lib\db-projection.ts:22:  updated_at: Date;
apps/web/src/lib\db-projection.ts:38:  updated_at: Date;
apps/web/src/lib\db-projection.ts:51:  updated_at: Date;
apps/web/src/lib\db-projection.ts:61:  updated_at: Date;
apps/web/src/lib\db-projection.ts:72:  updated_at: Date;
apps/web/src/lib\db-projection.ts:81:  updated_at: Date;
apps/web/src/lib\db-projection.ts:128:  businessHours: {
apps/web/src/lib\db-projection.ts:202:function parseBusinessHours(raw: unknown): LocationProjection["businessHours"] {
apps/web/src/lib\db-projection.ts:203:  const empty: LocationProjection["businessHours"] = {
apps/web/src/lib\db-projection.ts:211:  const bh = r.businessHours;
apps/web/src/lib\db-projection.ts:224:const TIME_REGEX = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
apps/web/src/lib\db-projection.ts:225:const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
apps/web/src/lib\db-projection.ts:235:    && typeof o.opens === "string" && TIME_REGEX.test(o.opens)
apps/web/src/lib\db-projection.ts:236:    && typeof o.closes === "string" && TIME_REGEX.test(o.closes);
apps/web/src/lib\db-projection.ts:243:    && typeof o.from === "string" && TIME_REGEX.test(o.from)
apps/web/src/lib\db-projection.ts:244:    && typeof o.to === "string" && TIME_REGEX.test(o.to);
apps/web/src/lib\db-projection.ts:250:  if (typeof o.date !== "string" || !ISO_DATE_REGEX.test(o.date)) return false;
apps/web/src/lib\db-projection.ts:268:    updatedAt: row.updated_at,
apps/web/src/lib\db-projection.ts:285:    businessHours: parseBusinessHours(row.metadata),
apps/web/src/lib\db-projection.ts:286:    updatedAt: row.updated_at,
apps/web/src/lib\db-projection.ts:301:    updatedAt: row.updated_at,
apps/web/src/lib\db-projection.ts:313:    updatedAt: row.updated_at,
apps/web/src/lib\db-projection.ts:326:    updatedAt: row.updated_at,
apps/web/src/lib\db-projection.ts:337:    updatedAt: row.updated_at,
apps/web/src/lib\clinic-profile-schema.ts:7://   - businessHours 7요일 + 점심 (LL-FORM-07/10)
apps/web/src/lib\clinic-profile-schema.ts:34:const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
apps/web/src/lib\clinic-profile-schema.ts:35:const TIME_REGEX = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
apps/web/src/lib\clinic-profile-schema.ts:45:  .refine((v) => v === null || v === undefined || ISO_DATE_REGEX.test(v), {
apps/web/src/lib\clinic-profile-schema.ts:46:    message: "날짜는 ISO 형식 (YYYY-MM-DD) 이어야 합니다.",
apps/web/src/lib\clinic-profile-schema.ts:61:  .refine((v) => ISO_DATE_REGEX.test(v), {
apps/web/src/lib\clinic-profile-schema.ts:62:    message: "날짜는 ISO 형식 (YYYY-MM-DD) 이어야 합니다.",
apps/web/src/lib\clinic-profile-schema.ts:86:    if (!val.open || !TIME_REGEX.test(val.open)) {
apps/web/src/lib\clinic-profile-schema.ts:89:    if (!val.close || !TIME_REGEX.test(val.close)) {
apps/web/src/lib\clinic-profile-schema.ts:92:    if (val.open && val.close && TIME_REGEX.test(val.open) && TIME_REGEX.test(val.close)) {
apps/web/src/lib\clinic-profile-schema.ts:98:      if (!val.lunchFrom || !TIME_REGEX.test(val.lunchFrom)) {
apps/web/src/lib\clinic-profile-schema.ts:101:      if (!val.lunchTo || !TIME_REGEX.test(val.lunchTo)) {
apps/web/src/lib\clinic-profile-schema.ts:106:        TIME_REGEX.test(val.lunchFrom) && TIME_REGEX.test(val.lunchTo)
apps/web/src/lib\clinic-profile-schema.ts:123:export const businessHoursSchema = z
apps/web/src/lib\clinic-profile-schema.ts:147:export type BusinessHoursInput = z.infer<typeof businessHoursSchema>;
apps/web/src/lib\clinic-profile-schema.ts:209:    .refine((v) => /^[A-Z]{2}$/.test(v), { message: "국가 코드는 ISO 3166-1 alpha-2 (대문자 2자) 이어야 합니다." }),
apps/web/src/lib\clinic-profile-schema.ts:226:  businessHours: businessHoursSchema,
apps/web/src/lib\clinic-profile-schema.ts:263:    .refine((v) => v === null || v === undefined || ISO_DATE_REGEX.test(v), {
apps/web/src/lib\clinic-profile-schema.ts:264:      message: "정책 시행일은 ISO 형식 (YYYY-MM-DD) 이어야 합니다.",
apps/web/src/lib\clinic-profile-schema.ts:318: * FormData key: businessHours_<day>_<field> (예: businessHours_monday_open=09:30)
apps/web/src/lib\clinic-profile-schema.ts:324:      closed: formData.get(`businessHours_${day}_closed`) === "on",
apps/web/src/lib\clinic-profile-schema.ts:325:      open: (formData.get(`businessHours_${day}_open`) as string | null) ?? undefined,
apps/web/src/lib\clinic-profile-schema.ts:326:      close: (formData.get(`businessHours_${day}_close`) as string | null) ?? undefined,
apps/web/src/lib\clinic-profile-schema.ts:327:      lunchEnabled: formData.get(`businessHours_${day}_lunchEnabled`) === "on",
apps/web/src/lib\clinic-profile-schema.ts:328:      lunchFrom: (formData.get(`businessHours_${day}_lunchFrom`) as string | null) ?? undefined,
apps/web/src/lib\clinic-profile-schema.ts:329:      lunchTo: (formData.get(`businessHours_${day}_lunchTo`) as string | null) ?? undefined,
apps/web/src/components/site\SiteFooter.tsx:22:        {loc && loc.businessHours.openingHours.length > 0 ? (
apps/web/src/components/site\SiteFooter.tsx:26:              {loc.businessHours.openingHours.map((oh, i) => (
apps/web/src/components/site\SiteFooter.tsx:31:              {loc.businessHours.lunchBreaks.map((lb, i) => (
apps/web/src/lib\markdown.ts:5:// 외부 링크: rel="nofollow noopener noreferrer" 자동.
apps/web/src/lib\markdown.ts:8:import sanitizeHtml from "sanitize-html";
apps/web/src/lib\markdown.ts:44:  const sanitized = sanitizeHtml(html, {
apps/web/src/lib\markdown.ts:49:    transformTags: {
apps/web/src/lib\markdown.ts:57:            ...(isExternal ? { rel: "nofollow noopener noreferrer", target: "_blank" } : {}),
apps/web/src/lib\markdown.ts:140:  // PSRC-12 patch: protocol-relative `//evil.example/...` 도 외부 URL 로 분류 — single slash path 만 내부.
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:61:        <BusinessHoursTable hours={loc.businessHours} />
apps/web/src/app/(site)\[instanceSlug]\page.tsx:9:import { withPublicTenantTransaction } from "@/lib/public-tenant";
apps/web/src/app/(site)\[instanceSlug]\page.tsx:45:  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\page.tsx:47:      SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
apps/web/src/app/(site)\[instanceSlug]\page.tsx:53:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
apps/web/src/app/(site)\[instanceSlug]\page.tsx:60:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
apps/web/src/lib\public-tenant.ts:1:// @glitzy/web/lib/public-tenant — withPublicTenantTransaction helper
apps/web/src/lib\public-tenant.ts:11:import type { Sql, TransactionSql } from "postgres";
apps/web/src/lib\public-tenant.ts:26:export async function withPublicTenantTransaction<T>(
apps/web/src/lib\public-tenant.ts:28:  fn: (tx: TransactionSql, ctx: PublicTenantContext) => Promise<T>,
apps/web/src/lib\public-tenant.ts:31:  // PSRC-03 patch: postgres-js begin() 안 callback 의 첫 인자 = TransactionSql.
apps/web/src/lib\public-tenant.ts:33:  return sql.begin<T | null>(async (tx: TransactionSql) => {
apps/web/src/lib\public-db.ts:24:  const sql = postgres(env.WEB_PUBLIC_DATABASE_URL, {
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:5:import { withPublicTenantTransaction } from "@/lib/public-tenant";
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:30:  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:32:      SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
apps/web/src/lib\site-meta-fetch.ts:137:  if (url.protocol !== "http:" && url.protocol !== "https:") {
apps/web/src/lib\site-meta-fetch.ts:271:  if (resolved.protocol !== "http:" && resolved.protocol !== "https:") return null;
apps/web/src/lib\site-initial.ts:7:// PSRC-10 patch: React `cache()` 로 render pass 안 중복 SELECT 회피.
apps/web/src/lib\site-initial.ts:11:import { withPublicTenantTransaction } from "./public-tenant";
apps/web/src/lib\site-initial.ts:28:export const loadSiteInitial = cache(async (instanceSlug: string): Promise<SiteInitial | null> => {
apps/web/src/lib\site-initial.ts:29:  return withPublicTenantTransaction(instanceSlug, async (tx, ctx) => {
apps/web/src/lib\site-initial.ts:34:             business_registration_number, primary_ctas, updated_at
apps/web/src/lib\site-initial.ts:45:             phone, email, metadata, updated_at
apps/web/src/lib\site-url.ts:5:// PSRC-09 patch: Host/X-Forwarded headers 의 spoof 회피 — env `PUBLIC_SITE_ORIGIN` (또는 production deployment URL)
apps/web/src/lib\site-url.ts:12: * 예: `https://glitzy.example.com/glitzy-clinic` (production · PUBLIC_SITE_ORIGIN 설정)
apps/web/src/lib\site-url.ts:18:  const trustedOrigin = process.env.PUBLIC_SITE_ORIGIN;
apps/web/src/lib\site-url.ts:33:  const trustedOrigin = process.env.PUBLIC_SITE_ORIGIN;
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:10:import { withPublicTenantTransaction } from "@/lib/public-tenant";
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:31:  const legal = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\legal\[type]\page.tsx:35:             updated_at
apps/web/src/app/(site)\[instanceSlug]\robots.txt\route.ts:9:  // PSRC-09 patch: siteOrigin() 가 PUBLIC_SITE_ORIGIN env 우선 → Host spoof 회피
apps/web/src/lib\json-ld\entities.ts:37:// PSRC-14 patch: ContactPoint @id 를 absolute pattern (`${siteBaseUrl}/#contact-...`) 으로 통일
apps/web/src/lib\json-ld\entities.ts:41:    "@type": "ContactPoint",
apps/web/src/lib\json-ld\entities.ts:75:    ...(location.businessHours.openingHours.length > 0 ? {
apps/web/src/lib\json-ld\entities.ts:76:      openingHoursSpecification: location.businessHours.openingHours.map((oh) => ({
apps/web/src/lib\json-ld\entities.ts:140:    ...(article.publishedAt ? { datePublished: article.publishedAt.toISOString(), dateModified: article.publishedAt.toISOString() } : {}),
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:2:// SoT: SEARCH_STANDARDIZATION § 4.2 형식 + § 4.3 changefreq/priority + § 4.4 lastmod
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:6:import { withPublicTenantTransaction } from "@/lib/public-tenant";
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:11:  lastmod: string; // ISO 8601
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:17:  // PSRC-09 patch: siteOrigin() 가 PUBLIC_SITE_ORIGIN env 우선 → Host spoof 회피
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:21:  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:22:    const clinicRows = await tx<{ updated_at: Date }[]>`
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:23:      SELECT updated_at FROM clinic_profile WHERE slug = 'clinic' LIMIT 1
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:25:    const locationRows = await tx<{ slug: string; updated_at: Date }[]>`
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:26:      SELECT slug, updated_at FROM location_profile WHERE slug = 'main' LIMIT 1
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:28:    const doctorRows = await tx<{ slug: string; updated_at: Date }[]>`
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:29:      SELECT slug, updated_at FROM doctor_profile ORDER BY display_order ASC, id ASC
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:31:    // PSRC-07 patch: lastmod aggregate — list 페이지는 max(updated_at) 사용
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:33:      SELECT MAX(updated_at) AS latest FROM doctor_profile
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:35:    const treatmentRows = await tx<{ slug: string; published_at: Date | null; updated_at: Date }[]>`
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:36:      SELECT slug, published_at, updated_at FROM treatment_page ORDER BY published_at DESC NULLS LAST
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:39:      SELECT MAX(updated_at) AS latest FROM treatment_page
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:41:    const articleRows = await tx<{ slug: string; published_at: Date | null; updated_at: Date }[]>`
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:42:      SELECT slug, published_at, updated_at FROM article ORDER BY published_at DESC NULLS LAST
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:45:      clinicLastmod: clinicRows[0]?.updated_at.toISOString() ?? new Date().toISOString(),
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:48:      doctorListLastmod: doctorAggRows[0]?.latest?.toISOString() ?? clinicRows[0]?.updated_at.toISOString() ?? new Date().toISOString(),
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:50:      treatmentListLastmod: treatmentAggRows[0]?.latest?.toISOString() ?? clinicRows[0]?.updated_at.toISOString() ?? new Date().toISOString(),
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:58:  entries.push({ loc: `${base}`, lastmod: data.clinicLastmod, changefreq: "weekly", priority: "1.0" });
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:60:  entries.push({ loc: `${base}/about`, lastmod: data.clinicLastmod, changefreq: "monthly", priority: "0.8" });
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:62:  entries.push({ loc: `${base}/doctors`, lastmod: data.doctorListLastmod, changefreq: "monthly", priority: "0.7" });
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:65:    entries.push({ loc: `${base}/doctors/${d.slug}`, lastmod: d.updated_at.toISOString(), changefreq: "monthly", priority: "0.7" });
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:68:  entries.push({ loc: `${base}/treatments`, lastmod: data.treatmentListLastmod, changefreq: "monthly", priority: "0.8" });
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:73:      lastmod: (t.published_at ?? t.updated_at).toISOString(),
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:82:      lastmod: (a.published_at ?? a.updated_at).toISOString(),
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:88:  entries.push({ loc: `${base}/contact`, lastmod: data.clinicLastmod, changefreq: "yearly", priority: "0.6" });
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:93:      lastmod: data.locationMain.updated_at.toISOString(),
apps/web/src/app/(site)\[instanceSlug]\sitemap.xml\route.ts:110:    <lastmod>${e.lastmod}</lastmod>
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:6:import { withPublicTenantTransaction } from "@/lib/public-tenant";
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:21:  const doctor = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:23:      SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:46:  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:48:      SELECT id::text AS id, slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:57:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:6:import { withPublicTenantTransaction } from "@/lib/public-tenant";
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:22:  const a = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:24:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:49:  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:51:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:61:        SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:100:            <time dateTime={data.article.publishedAt.toISOString()}>
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:101:              {data.article.publishedAt.toISOString().slice(0, 10)}
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:65:        <BusinessHoursTable hours={loc.businessHours} />
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:5:import { withPublicTenantTransaction } from "@/lib/public-tenant";
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:30:  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:32:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:5:import { withPublicTenantTransaction } from "@/lib/public-tenant";
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:21:  const t = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:23:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:46:  const treatment = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:48:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at

 succeeded in 659ms:
apps/web/src/app/page.tsx:17:    redirect("/sign-in");
apps/web/src/app/page.tsx:32:    redirect(`/sign-in/cleanup?reason=${reason}`);
apps/web/src/app/page.tsx:40:    redirect("/sign-in/cleanup?reason=session-not-found");
apps/web/src/app/page.tsx:48:    redirect("/sign-in/cleanup?reason=user-inactive");
apps/web/src/app/page.tsx:52:  // PSR-CASCADE-01b: 어드민 URL `/admin/<slug>/...` prefix 격상 (PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1)
apps/web/src/app/page.tsx:55:    redirect("/sign-in?reason=no-active-membership");
apps/web/src/app/page.tsx:57:  redirect(`/admin/${result.slug}`);
apps/web/src/components/forms/ClinicProfileForm.tsx:1:// @glitzy/web/components/forms/ClinicProfileForm — LOCATION_LEGAL_PLAN v1.0 § 3
apps/web/src/components/forms/ClinicProfileForm.tsx:14:import type { SaveResult } from "@/app/(admin)/admin/[instanceSlug]/clinic-profile/actions";
apps/web/src/components/forms/ClinicProfileForm.tsx:133:export function ClinicProfileForm({
apps/web/src/app/sign-in/consume/route.ts:52:    return NextResponse.redirect(new URL("/sign-in?reason=magic-link-invalid", req.url));
apps/web/src/app/sign-in/consume/route.ts:67:      return NextResponse.redirect(new URL(`/sign-in?reason=${err.reason}`, req.url));
apps/web/src/app/sign-in/consume/route.ts:82:    return NextResponse.redirect(new URL("/sign-in?reason=user-inactive", req.url));
apps/web/src/app/sign-in/consume/route.ts:93:    return NextResponse.redirect(new URL("/sign-in?reason=user-inactive", req.url));
apps/web/src/app/sign-in/consume/route.ts:110:      return NextResponse.redirect(new URL(`/sign-in?reason=${err.reason}`, req.url));
apps/web/src/app/sign-in/consume/route.ts:125:    return NextResponse.redirect(new URL("/sign-in?reason=no-active-membership", req.url));
apps/web/src/app/sign-in/consume/route.ts:146:    return NextResponse.redirect(new URL("/sign-in?reason=no-active-membership", req.url));
apps/web/src/app/sign-in/consume/route.ts:162:    return NextResponse.redirect(new URL("/sign-in?reason=session-not-found", req.url));
apps/web/src/app/sign-in/consume/route.ts:177:  // 6) cookie set + redirect — PSR-CASCADE-01b: admin URL `/admin/<slug>` prefix 격상
apps/web/src/app/sign-in/consume/route.ts:178:  const res = NextResponse.redirect(new URL(`/admin/${membershipResult.slug}`, req.url));
apps/web/src/app/(admin)/admin/[instanceSlug]\page.tsx:75:                href={`/admin/${params.instanceSlug}/clinic-profile`}
apps/web/src/app/(admin)/admin/[instanceSlug]\page.tsx:85:                href={`/admin/${params.instanceSlug}/clinic-profile`}
apps/web/src/app/(admin)/admin/[instanceSlug]\page.tsx:96:            href={`/admin/${params.instanceSlug}/doctors`}
apps/web/src/app/(admin)/admin/[instanceSlug]\page.tsx:102:            href={`/admin/${params.instanceSlug}/treatments`}
apps/web/src/app/(admin)/admin/[instanceSlug]\page.tsx:108:            href={`/admin/${params.instanceSlug}/articles`}
apps/web/src/app/(admin)/admin/[instanceSlug]\page.tsx:120:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\page.tsx:45:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\page.tsx:58:        <Link href={`/admin/${params.instanceSlug}/treatments/new`} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\page.tsx:92:                  <Link href={`/admin/${params.instanceSlug}/treatments/${r.slug}`} className="text-xs text-blue-700 underline">
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:1:// @glitzy/web/(admin)/[instanceSlug]/treatments/actions
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:8:import { revalidatePath } from "next/cache";
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:156:      revalidatePath(`/admin/${instanceSlug}/treatments`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:157:      revalidatePath(`/admin/${instanceSlug}/treatments/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:159:        revalidatePath(`/admin/${instanceSlug}/treatments/${originalSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:161:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:163:        redirect(`/admin/${instanceSlug}/treatments/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:177:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:221:    revalidatePath(`/admin/${instanceSlug}/treatments`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:222:    revalidatePath(`/admin/${instanceSlug}/treatments/${slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:223:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:224:    redirect(`/admin/${instanceSlug}/treatments`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\actions.ts:229:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\page.tsx:11:  ClinicProfileForm,
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\page.tsx:14:} from "@/components/forms/ClinicProfileForm";
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\page.tsx:21:import { saveClinicProfile } from "./actions";
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\page.tsx:244:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\page.tsx:261:      <ClinicProfileForm action={boundSave} initial={initial} instanceSlug={params.instanceSlug} />
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\actions.ts:1:// @glitzy/web/(admin)/[instanceSlug]/clinic-profile/actions — LOCATION_LEGAL_PLAN v1.0 § 4
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\actions.ts:15:import { revalidatePath } from "next/cache";
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\actions.ts:96:  if (!signedToken) redirect("/sign-in");
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\actions.ts:106:    redirect(`/sign-in/cleanup?reason=${reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\actions.ts:113:    redirect("/sign-in/cleanup?reason=session-not-found");
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\actions.ts:426:    revalidatePath(`/admin/${instanceSlug}/clinic-profile`);
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\actions.ts:427:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\clinic-profile\actions.ts:455:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\new\page.tsx:8:import { saveTreatmentPage } from "../actions";
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\new\page.tsx:28:        <Link href={`/admin/${params.instanceSlug}/treatments`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\[slug]\page.tsx:12:import { deleteTreatmentPage, saveTreatmentPage } from "../actions";
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\[slug]\page.tsx:68:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\treatments\[slug]\page.tsx:85:        <Link href={`/admin/${params.instanceSlug}/treatments`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\page.tsx:45:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\page.tsx:59:          href={`/admin/${params.instanceSlug}/doctors/new`}
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\page.tsx:93:                  <Link href={`/admin/${params.instanceSlug}/doctors/${r.slug}`} className="text-xs text-blue-700 underline">
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:1:// @glitzy/web/(admin)/[instanceSlug]/articles/actions
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:6:import { revalidatePath } from "next/cache";
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:193:      revalidatePath(`/admin/${instanceSlug}/articles`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:194:      revalidatePath(`/admin/${instanceSlug}/articles/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:196:        revalidatePath(`/admin/${instanceSlug}/articles/${originalSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:198:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:200:        redirect(`/admin/${instanceSlug}/articles/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:214:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:256:    revalidatePath(`/admin/${instanceSlug}/articles`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:257:    revalidatePath(`/admin/${instanceSlug}/articles/${slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:258:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:259:    redirect(`/admin/${instanceSlug}/articles`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\actions.ts:264:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:1:// @glitzy/web/(admin)/[instanceSlug]/doctors/actions
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:14:import { revalidatePath } from "next/cache";
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:158:      revalidatePath(`/admin/${instanceSlug}/doctors`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:159:      revalidatePath(`/admin/${instanceSlug}/doctors/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:162:        revalidatePath(`/admin/${instanceSlug}/doctors/${originalSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:164:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:166:        redirect(`/admin/${instanceSlug}/doctors/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:183:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:254:    revalidatePath(`/admin/${instanceSlug}/doctors`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:255:    revalidatePath(`/admin/${instanceSlug}/doctors/${slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:256:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:257:    redirect(`/admin/${instanceSlug}/doctors`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\actions.ts:263:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\page.tsx:48:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\page.tsx:61:        <Link href={`/admin/${params.instanceSlug}/articles/new`} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\page.tsx:93:                  <Link href={`/admin/${params.instanceSlug}/articles/${r.slug}`} className="text-xs text-blue-700 underline">편집</Link>
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\[slug]\page.tsx:12:import { saveDoctorProfile, deleteDoctorProfile } from "../actions";
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\[slug]\page.tsx:69:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\[slug]\page.tsx:86:        <Link href={`/admin/${params.instanceSlug}/doctors`} className="text-sm text-slate-600 hover:underline">
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\new\page.tsx:13:import { saveArticle } from "../actions";
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\new\page.tsx:44:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\new\page.tsx:58:        <Link href={`/admin/${params.instanceSlug}/articles`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\[slug]\page.tsx:12:import { deleteArticle, saveArticle } from "../actions";
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\[slug]\page.tsx:84:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]\articles\[slug]\page.tsx:101:        <Link href={`/admin/${params.instanceSlug}/articles`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\new\page.tsx:8:import { saveDoctorProfile } from "../actions";
apps/web/src/app/(admin)/admin/[instanceSlug]\doctors\new\page.tsx:28:        <Link href={`/admin/${params.instanceSlug}/doctors`} className="text-sm text-slate-600 hover:underline">← 목록</Link>

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/lib/json-ld/builders.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/lib/json-ld/__tests__/validate.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/lib/json-ld/entities.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' | ForEach-Object { if("'$i -ge 540 -and $i -le 570){ '"'{0,4}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 1919ms:
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
  17: // PSRC-06 patch: validate(graph, opts) — same-origin @id reference 는 graph entity 필수,
  18: //   외부 origin URL 만 dereferenceable 예외. opts.siteBaseUrl 가 주어지면 그 origin 안 URL 은 graph entity 강제.
  19: export function validateJsonLdGraph(graph: unknown, opts: { siteBaseUrl?: string } = {}): ValidationResult {
  20:   const errors: string[] = [];
  21: 
  22:   // (1)(2) shape
  23:   if (typeof graph !== "object" || graph === null) return { ok: false, errors: ["graph must be object"] };
  24:   const g = graph as Record<string, unknown>;
  25:   if (g["@context"] !== "https://schema.org") errors.push("@context must be https://schema.org");
  26:   const arr = g["@graph"];
  27:   if (!Array.isArray(arr)) {
  28:     return { ok: false, errors: [...errors, "@graph must be array"] };
  29:   }
  30: 
  31:   const siteOrigin = opts.siteBaseUrl ? tryOrigin(opts.siteBaseUrl) : null;
  32: 
  33:   // (3) @id 유일
  34:   const ids = new Set<string>();
  35:   const idMap = new Map<string, JsonLdEntity>();
  36:   for (const ent of arr) {
  37:     if (typeof ent !== "object" || ent === null) {
  38:       errors.push("entity must be object");
  39:       continue;
  40:     }
  41:     const e = ent as Record<string, unknown>;
  42:     if (typeof e["@type"] !== "string") errors.push(`entity missing @type`);
  43:     if (typeof e["@id"] !== "string") errors.push(`entity missing @id`);
  44:     if (typeof e["@id"] === "string") {
  45:       if (ids.has(e["@id"])) errors.push(`duplicate @id: ${e["@id"]}`);
  46:       ids.add(e["@id"]);
  47:       idMap.set(e["@id"], e as JsonLdEntity);
  48:     }
  49:   }
  50: 
  51:   // (4) cross-reference — graph 안 `{ "@id": "..." }` 참조가 idMap 안 또는 외부 dereferenceable URL
  52:   function checkRefs(value: unknown, path: string): void {
  53:     if (typeof value !== "object" || value === null) return;
  54:     if (Array.isArray(value)) {
  55:       value.forEach((v, i) => checkRefs(v, `${path}[${i}]`));
  56:       return;
  57:     }
  58:     const v = value as Record<string, unknown>;
  59:     if (typeof v["@id"] === "string" && Object.keys(v).length === 1) {
  60:       const ref = v["@id"];
  61:       if (!ids.has(ref)) {
  62:         const refOrigin = tryOrigin(ref);
  63:         if (refOrigin && siteOrigin && refOrigin === siteOrigin) {
  64:           // same-origin → graph entity 필수
  65:           errors.push(`unresolved same-origin reference at ${path}: ${ref}`);
  66:         } else if (refOrigin === null) {
  67:           // relative fragment or invalid URL
  68:           errors.push(`unresolved reference at ${path}: ${ref}`);
  69:         }
  70:         // 외부 origin URL → dereferenceable 예외 (통과)
  71:       }
  72:     }
  73:     for (const [k, vv] of Object.entries(v)) {
  74:       if (k === "@type" || k === "@id") continue;
  75:       checkRefs(vv, `${path}.${k}`);
  76:     }
  77:   }
  78:   arr.forEach((ent, i) => checkRefs(ent, `@graph[${i}]`));
  79: 
  80:   return errors.length === 0 ? { ok: true } : { ok: false, errors };
  81: }
  82: 
  83: function tryOrigin(url: string): string | null {
  84:   try {
  85:     return new URL(url).origin;
  86:   } catch {
  87:     return null;
  88:   }
  89: }
  90: 
  91: /**
  92:  * 페이지 타입별 expected entity types 검증
  93:  */
  94: export function validateExpectedEntities(graph: JsonLdGraph, expected: ReadonlyArray<string>): ValidationResult {
  95:   const present = new Set(graph["@graph"].map((e) => e["@type"]));
  96:   const missing = expected.filter((t) => !present.has(t));
  97:   if (missing.length === 0) return { ok: true };
  98:   return { ok: false, errors: [`missing expected entities: ${missing.join(", ")}`] };
  99: }

 succeeded in 1925ms:
 540: ### 5.4 JSON-LD 통합 graph (PSR-SEO-11) — cycle1 PSR-07·08·17 정정
 541: 
 542: - 모든 페이지 `<head>` 안 단일 `<script type="application/ld+json">` block 출력.
 543: - 구조: `{ "@context": "https://schema.org", "@graph": [...] }` (SCHEMA_MAPPING § 1.1 정합).
 544: - **페이지별 graph 구성 (SCHEMA_MAPPING § 2.5 + § 3 SoT 그대로 — `[풀]` vs `[참조]`)**:
 545: 
 546: | 페이지 | graph entities (cycle1 PSR-07 정정) |
 547: |---|---|
 548: | P-001 Home | `[풀] Organization` · `[풀] MedicalClinic`(`#clinic` 본원) · `[풀] WebSite` · `[풀] WebPage` |
 549: | P-002 About | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] WebPage` · `[풀] BreadcrumbList` · `WebSite` 참조 (`isPartOf`) |
 550: | P-003 Doctors List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(Physician refs) |
 551: | P-004 Doctor Profile | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Physician` · `[풀] WebPage` · `[풀] BreadcrumbList` |
 552: | P-005 Treatments List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(MedicalProcedure refs) |
 553: | P-006 Treatment Detail | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] MedicalProcedure` · `[풀] WebPage` · `[풀] BreadcrumbList` |
 554: | P-010 Article Detail | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Article` · `[풀] WebPage` · `[풀] BreadcrumbList` |
 555: | P-012 Contact | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] WebPage` · `[풀] BreadcrumbList` (cycle1 PSR-07: ContactPage 삭제 · SoT 는 WebPage + MedicalClinic 풀) |
 556: | P-013 Legal/Policy | (v0.1 단계 미노출 — graph 출력 없음) · 정상 노출 시 `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` |
 557: | P-014 Location Detail | `[풀] Organization` · `[풀] MedicalClinic`(`#clinic` 단지점 main 의 entity @id 그대로 — SCHEMA_MAPPING § 1.4 정합) · `[풀] WebPage` · `[풀] BreadcrumbList` |
 558: 
 559: **결정**:
 560: - (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
 561: - (PSR-SEO-13) `inLanguage` 명시 정책: SCHEMA_MAPPING § 1.5 정합 — CreativeWork 계열 (Article · WebPage · FAQPage 등) 만 명시. Organization · MedicalClinic · Physician 등은 미명시.
 562: - (PSR-SEO-14 · cycle1 PSR-17) **자체 JSON-LD rule checker** (LOCAL_PASS 게이트): JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 검증. Google Rich Results Test / schema.org validator 는 manual QA marker (PSR-DEFER-14) — CI 게이트 X.
 563:   - rule checker 위치: `apps/web/src/lib/json-ld/__tests__/validate.ts` 신설
 564:   - 페이지별 expected entities 정의 (위 표 그대로)
 565:   - LOCAL_PASS 시나리오 18 의 통과 기준 = 자체 checker 통과
 566: 
 567: ### 5.5 OpenGraph / Twitter (PSR-SEO-15)
 568: 
 569: - 페이지 entity 의 `hero_image_url` 또는 `og_image_url` 사용. 부재 시 clinic.og_image_url fallback.
 570: - v0.1 단계 동적 OG 이미지 생성 미지원 (PSR-DEFER-09).

 succeeded in 2033ms:
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
  52: // PSRC-05 patch: graph 안 MedicalClinic 풀 entity 출력 (location 있을 때) — WebPage.about 으로 명시.
  53: //   SCHEMA_MAPPING § 2.5 의 "참조만" 해석을 v0.1 단계에서 "graph 안 entity + WebPage.about ref" 로 운영.
  54: //   SCHEMA_MAPPING cascade marker — 본 plan code v1.0 acceptance commit 직후 SCHEMA_MAPPING 별 cycle.
  55: export function doctorsListGraph(
  56:   ctx: GraphBuilderContext,
  57:   clinic: ClinicProjection,
  58:   location: LocationProjection | null,
  59:   doctors: DoctorProjection[],
  60:   description: string,
  61: ): JsonLdGraph {
  62:   return graph([
  63:     E.organizationEntity(ctx, clinic),
  64:     ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
  65:     E.webPageEntity(ctx, "의료진", description, { aboutClinic: location !== null }),
  66:     E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "의료진", path: null }]),
  67:     E.itemListEntity(
  68:       ctx,
  69:       doctors.map((d) => ({ name: d.name, itemId: `${ctx.siteBaseUrl}/doctors/${d.slug}#physician` })),
  70:       "doctors",
  71:     ),
  72:   ]);
  73: }
  74: 
  75: // === P-004 Doctor Profile ===
  76: export function doctorProfileGraph(
  77:   ctx: GraphBuilderContext,
  78:   clinic: ClinicProjection,
  79:   location: LocationProjection | null,
  80:   doctor: DoctorProjection,
  81:   description: string,
  82: ): JsonLdGraph {
  83:   return graph([
  84:     E.organizationEntity(ctx, clinic),
  85:     ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
  86:     E.physicianEntity(ctx, doctor),
  87:     E.webPageEntity(ctx, doctor.name, description, { aboutClinic: location !== null }),
  88:     E.breadcrumbListEntity(ctx, [
  89:       { name: "홈", path: "/" },
  90:       { name: "의료진", path: "/doctors" },
  91:       { name: doctor.name, path: null },
  92:     ]),
  93:   ]);
  94: }
  95: 
  96: // === P-005 Treatments List ===
  97: export function treatmentsListGraph(
  98:   ctx: GraphBuilderContext,
  99:   clinic: ClinicProjection,
 100:   location: LocationProjection | null,
 101:   treatments: TreatmentProjection[],
 102:   description: string,
 103: ): JsonLdGraph {
 104:   return graph([
 105:     E.organizationEntity(ctx, clinic),
 106:     ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
 107:     E.webPageEntity(ctx, "진료", description, { aboutClinic: location !== null }),
 108:     E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "진료", path: null }]),
 109:     E.itemListEntity(
 110:       ctx,
 111:       treatments.map((t) => ({ name: t.name, itemId: `${ctx.siteBaseUrl}/treatments/${t.slug}#procedure` })),
 112:       "treatments",
 113:     ),
 114:   ]);
 115: }
 116: 
 117: // === P-006 Treatment Detail ===
 118: export function treatmentDetailGraph(
 119:   ctx: GraphBuilderContext,
 120:   clinic: ClinicProjection,
 121:   location: LocationProjection | null,
 122:   treatment: TreatmentProjection,
 123:   description: string,
 124: ): JsonLdGraph {
 125:   return graph([
 126:     E.organizationEntity(ctx, clinic),
 127:     ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
 128:     E.medicalProcedureEntity(ctx, treatment),
 129:     E.webPageEntity(ctx, treatment.name, description, { aboutClinic: location !== null }),
 130:     E.breadcrumbListEntity(ctx, [
 131:       { name: "홈", path: "/" },
 132:       { name: "진료", path: "/treatments" },
 133:       { name: treatment.name, path: null },
 134:     ]),
 135:   ]);
 136: }
 137: 
 138: // === P-010 Article Detail ===
 139: export function articleDetailGraph(
 140:   ctx: GraphBuilderContext,
 141:   clinic: ClinicProjection,
 142:   location: LocationProjection | null,
 143:   article: ArticleProjection,
 144:   author: DoctorProjection | null,
 145:   category: string,
 146: ): JsonLdGraph {
 147:   return graph([
 148:     E.organizationEntity(ctx, clinic),
 149:     ...(location ? [E.medicalClinicEntity(ctx, clinic, location)] : []),
 150:     E.articleEntity(ctx, article, author, category),
 151:     E.webPageEntity(ctx, article.headline, article.summary, { aboutClinic: location !== null }),
 152:     E.breadcrumbListEntity(ctx, [
 153:       { name: "홈", path: "/" },
 154:       { name: "인사이트", path: null },
 155:       { name: article.headline, path: null },
 156:     ]),
 157:   ]);
 158: }
 159: 
 160: // === P-012 Contact ===
 161: export function contactGraph(
 162:   ctx: GraphBuilderContext,
 163:   clinic: ClinicProjection,
 164:   location: LocationProjection,
 165:   description: string,
 166: ): JsonLdGraph {
 167:   return graph([
 168:     E.organizationEntity(ctx, clinic),
 169:     E.medicalClinicEntity(ctx, clinic, location),
 170:     E.webPageEntity(ctx, "연락처", description),
 171:     E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "연락처", path: null }]),
 172:   ]);
 173: }
 174: 
 175: // === P-014 Location Detail ===
 176: export function locationDetailGraph(
 177:   ctx: GraphBuilderContext,
 178:   clinic: ClinicProjection,
 179:   location: LocationProjection,
 180:   description: string,
 181: ): JsonLdGraph {
 182:   return graph([
 183:     E.organizationEntity(ctx, clinic),
 184:     E.medicalClinicEntity(ctx, clinic, location),
 185:     E.webPageEntity(ctx, location.name, description),
 186:     E.breadcrumbListEntity(ctx, [
 187:       { name: "홈", path: "/" },
 188:       { name: "위치", path: null },
 189:       { name: location.name, path: null },
 190:     ]),
 191:   ]);
 192: }

 succeeded in 2132ms:
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
 146: // PSRC-05 patch: WebPage 안 `about` 으로 MedicalClinic ref 를 명시 — graph 안 풀 entity 가 어떤 페이지에서 누구를 가리키는지 SCHEMA_MAPPING § 2.5 정합
 147: export function webPageEntity(
 148:   ctx: GraphBuilderContext,
 149:   title: string,
 150:   description: string,
 151:   options: { aboutClinic?: boolean } = {},
 152: ): JsonLdEntity {
 153:   return {
 154:     "@type": "WebPage",
 155:     "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#webpage`,
 156:     url: `${ctx.siteBaseUrl}${ctx.pagePath}`,
 157:     name: title,
 158:     description,
 159:     inLanguage: "ko-KR",
 160:     isPartOf: { "@id": `${ctx.siteBaseUrl}/#website` },
 161:     ...(options.aboutClinic ? { about: { "@id": `${ctx.siteBaseUrl}/#clinic` } } : {}),
 162:   };
 163: }
 164: 
 165: export function webSiteEntity(ctx: GraphBuilderContext, name: string): JsonLdEntity {
 166:   return {
 167:     "@type": "WebSite",
 168:     "@id": `${ctx.siteBaseUrl}/#website`,
 169:     name,
 170:     url: ctx.siteBaseUrl,
 171:     inLanguage: "ko-KR",
 172:     publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
 173:   };
 174: }
 175: 
 176: export function breadcrumbListEntity(
 177:   ctx: GraphBuilderContext,
 178:   items: Array<{ name: string; path: string | null }>,
 179: ): JsonLdEntity {
 180:   return {
 181:     "@type": "BreadcrumbList",
 182:     "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#breadcrumb`,
 183:     itemListElement: items.map((it, i) => ({
 184:       "@type": "ListItem",
 185:       position: i + 1,
 186:       name: it.name,
 187:       ...(it.path ? { item: `${ctx.siteBaseUrl}${it.path}` } : {}),
 188:     })),
 189:   };
 190: }
 191: 
 192: export function itemListEntity(
 193:   ctx: GraphBuilderContext,
 194:   items: Array<{ name: string; itemId: string }>,
 195:   listId: string,
 196: ): JsonLdEntity {
 197:   return {
 198:     "@type": "ItemList",
 199:     "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#${listId}`,
 200:     itemListElement: items.map((it, i) => ({
 201:       "@type": "ListItem",
 202:       position: i + 1,
 203:       item: { "@id": it.itemId, name: it.name },
 204:     })),
 205:   };
 206: }
 207: 
 208: function stripMarkdown(md: string): string {
 209:   return md.replace(/[#*_`>]/g, "").replace(/\s+/g, " ").trim();
 210: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/lib/site-url.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/lib/site-metadata.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 686ms:
   1: // @glitzy/web/lib/site-url — request-aware site base URL helper
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-12 (v0.1 path-based · M0 도메인 매핑 PSR-CASCADE-02)
   3: //
   4: // PSRC-08 patch: canonical/OpenGraph URL 은 항상 absolute URL.
   5: // PSRC-09 patch: Host/X-Forwarded headers 의 spoof 회피 — env `PUBLIC_SITE_ORIGIN` (또는 production deployment URL)
   6: // 가 설정되어 있으면 우선. 없으면 request host fallback (dev/staging 한정).
   7: 
   8: import { headers } from "next/headers";
   9: 
  10: /**
  11:  * Compute the v0.1 path-based site base URL for the current request.
  12:  * 예: `https://glitzy.example.com/glitzy-clinic` (production · PUBLIC_SITE_ORIGIN 설정)
  13:  *     `http://localhost:3000/glitzy-clinic` (dev fallback)
  14:  * M0 v1.0 도메인 매핑 cascade 시 (PSR-DEFER-02) middleware rewrite + 본 helper 의 instanceSlug 제거.
  15:  */
  16: export function siteBaseUrl(instanceSlug: string): string {
  17:   // PSRC-09: production trusted origin 우선 — Host header spoof 회피
  18:   const trustedOrigin = process.env.PUBLIC_SITE_ORIGIN;
  19:   if (trustedOrigin && trustedOrigin.length > 0) {
  20:     return `${trustedOrigin.replace(/\/$/, "")}/${instanceSlug}`;
  21:   }
  22:   // dev/staging fallback — request host
  23:   const h = headers();
  24:   const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  25:   const proto = h.get("x-forwarded-proto") ?? "http";
  26:   return `${proto}://${host}/${instanceSlug}`;
  27: }
  28: 
  29: /**
  30:  * Compute origin only (no instanceSlug suffix). For sitemap/robots sitemap URL.
  31:  */
  32: export function siteOrigin(): string {
  33:   const trustedOrigin = process.env.PUBLIC_SITE_ORIGIN;
  34:   if (trustedOrigin && trustedOrigin.length > 0) {
  35:     return trustedOrigin.replace(/\/$/, "");
  36:   }
  37:   const h = headers();
  38:   const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  39:   const proto = h.get("x-forwarded-proto") ?? "http";
  40:   return `${proto}://${host}`;
  41: }

 succeeded in 706ms:
   1: // @glitzy/web/lib/site-metadata — Next metadata 공통 헬퍼
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.1 PSR-SEO-01·02·03·04·05·06
   3: 
   4: import type { Metadata, ResolvingMetadata } from "next";
   5: import type { ClinicProjection } from "./db-projection";
   6: import { siteBaseUrl } from "./site-url";
   7: 
   8: export type PageMetaInput = {
   9:   /** Next.js metadata title — page-specific (e.g. "소개", "의료진"). 자동으로 `${title} | ${clinic.name}` 결합 */
  10:   pageTitle: string;
  11:   /** page-specific description (50~160자 권장). 부재 시 clinic.description fallback */
  12:   description?: string;
  13:   /** og:type — P-001/2/3/5/12/13/14 = "website" · P-004 = "profile" · P-006/P-010 = "article" */
  14:   ogType?: "website" | "profile" | "article";
  15:   /** page 의 hero image URL — 부재 시 clinic.ogImageUrl fallback */
  16:   imageUrl?: string;
  17:   /** canonical path (e.g. "/about", "/doctors/hong"). instance prefix 자동 prepend */
  18:   canonicalPath?: string;
  19:   /** robots: index — P-013 Legal v0.1 false */
  20:   noindex?: boolean;
  21: };
  22: 
  23: /**
  24:  * Build Next.js metadata for a site page.
  25:  *
  26:  * @param clinic — site initial 의 clinic projection (Header/Footer 공통)
  27:  * @param instanceSlug — URL prefix
  28:  * @param input — page-specific overrides
  29:  */
  30: export function buildPageMetadata(
  31:   clinic: ClinicProjection,
  32:   instanceSlug: string,
  33:   input: PageMetaInput,
  34: ): Metadata {
  35:   const title = input.pageTitle === clinic.name
  36:     ? clinic.name
  37:     : `${input.pageTitle} | ${clinic.name}`;
  38:   const description = input.description ?? clinic.description;
  39:   const image = input.imageUrl ?? clinic.ogImageUrl;
  40:   const canonicalPath = input.canonicalPath ?? "/";
  41:   // PSRC-08 patch: canonical / OpenGraph URL 은 absolute (request-aware)
  42:   const baseUrl = siteBaseUrl(instanceSlug);
  43:   const canonical = canonicalPath === "/" ? baseUrl : `${baseUrl}${canonicalPath}`;
  44: 
  45:   return {
  46:     title,
  47:     description,
  48:     alternates: { canonical },
  49:     openGraph: {
  50:       title,
  51:       description,
  52:       type: input.ogType ?? "website",
  53:       url: canonical,
  54:       images: image ? [{ url: image }] : undefined,
  55:       locale: "ko_KR",
  56:       siteName: clinic.name,
  57:     },
  58:     twitter: {
  59:       card: "summary_large_image",
  60:       title,
  61:       description,
  62:       images: image ? [image] : undefined,
  63:     },
  64:     robots: {
  65:       index: input.noindex ? false : true,
  66:       follow: true,
  67:     },
  68:     // PSR-SEO-02 (cycle3 PSR-29 정정): themeColor 출처 BrandTokens.colors.light/dark.primary
  69:     // v0.1 default — DESIGN_TOKENS § 3.2 color.brand.primary light=#2563eb · dark=#60a5fa
  70:     themeColor: [
  71:       { media: "(prefers-color-scheme: light)", color: "#2563eb" },
  72:       { media: "(prefers-color-scheme: dark)", color: "#60a5fa" },
  73:     ],
  74:   };
  75: }
  76: 
  77: export type { Metadata, ResolvingMetadata };

2026-05-18T04:56:05.775072Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m $i=1; [36;1mGet-Content 'apps/web/src/app/(site)/[instanceSlug]/sitemap.xml[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

2026-05-18T04:56:05.777084Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m $i=1; [36;1mGet-Content 'apps/web/src/app/(site)/[instanceSlug]/robots.txt/[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 779ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m $i=1; [36;1mGet-Content 'apps/web/src/app/(site)/[instanceSlug]/robots.txt/[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 794ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m $i=1; [36;1mGet-Content 'apps/web/src/app/(site)/[instanceSlug]/sitemap.xml[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content 'apps/web/package.json'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "<JsonLdScript|validateJsonLdGraph|validateExpectedEntities|JsonLdScript" "apps/web/src/app/(site)" "apps/web/src/lib/json-ld"' in C:\Users\assag\solution\website-exposure
 succeeded in 688ms:
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

 succeeded in 717ms:
apps/web/src/lib/json-ld\JsonLdScript.tsx:1:// @glitzy/web/lib/json-ld/JsonLdScript — 통합 graph 단일 <script> 출력
apps/web/src/lib/json-ld\JsonLdScript.tsx:6:export function JsonLdScript({ graph }: { graph: JsonLdGraph }) {
apps/web/src/lib/json-ld\__tests__\validate.ts:19:export function validateJsonLdGraph(graph: unknown, opts: { siteBaseUrl?: string } = {}): ValidationResult {
apps/web/src/lib/json-ld\__tests__\validate.ts:94:export function validateExpectedEntities(graph: JsonLdGraph, expected: ReadonlyArray<string>): ValidationResult {
apps/web/src/app/(site)\[instanceSlug]\page.tsx:24:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)\[instanceSlug]\page.tsx:82:      <JsonLdScript graph={graph} />
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:11:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)\[instanceSlug]\contact\page.tsx:48:      <JsonLdScript graph={graph} />
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:10:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:43:      <JsonLdScript graph={graph} />
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:11:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)\[instanceSlug]\doctors\page.tsx:50:      <JsonLdScript graph={graph} />
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:12:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:79:      <JsonLdScript graph={graph} />
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:11:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)\[instanceSlug]\treatments\page.tsx:50:      <JsonLdScript graph={graph} />
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:11:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)\[instanceSlug]\locations\[slug]\page.tsx:48:      <JsonLdScript graph={graph} />
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:12:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:85:      <JsonLdScript graph={graph} />
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:12:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)\[instanceSlug]\treatments\[slug]\page.tsx:69:      <JsonLdScript graph={graph} />

 succeeded in 729ms:
   1: // @glitzy/web/(site)/[instanceSlug]/sitemap.xml — per-instance sitemap
   2: // SoT: SEARCH_STANDARDIZATION § 4.2 형식 + § 4.3 changefreq/priority + § 4.4 lastmod
   3: //      PUBLIC_SITE_RENDER_PLAN v1.0 § 5.2 PSR-SEO-07 (P-013 sitemap 제외)
   4: 
   5: import { NextResponse } from "next/server";
   6: import { withPublicTenantTransaction } from "@/lib/public-tenant";
   7: import { siteOrigin } from "@/lib/site-url";
   8: 
   9: type SitemapEntry = {
  10:   loc: string;
  11:   lastmod: string; // ISO 8601
  12:   changefreq: "weekly" | "monthly" | "yearly";
  13:   priority: string;
  14: };
  15: 
  16: export async function GET(_req: Request, { params }: { params: { instanceSlug: string } }) {
  17:   // PSRC-09 patch: siteOrigin() 가 PUBLIC_SITE_ORIGIN env 우선 → Host spoof 회피
  18:   const origin = siteOrigin();
  19:   const base = `${origin}/${params.instanceSlug}`;
  20: 
  21:   const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  22:     const clinicRows = await tx<{ updated_at: Date }[]>`
  23:       SELECT updated_at FROM clinic_profile WHERE slug = 'clinic' LIMIT 1
  24:     `;
  25:     const locationRows = await tx<{ slug: string; updated_at: Date }[]>`
  26:       SELECT slug, updated_at FROM location_profile WHERE slug = 'main' LIMIT 1
  27:     `;
  28:     const doctorRows = await tx<{ slug: string; updated_at: Date }[]>`
  29:       SELECT slug, updated_at FROM doctor_profile ORDER BY display_order ASC, id ASC
  30:     `;
  31:     // PSRC-07 patch: lastmod aggregate — list 페이지는 max(updated_at) 사용
  32:     const doctorAggRows = await tx<{ latest: Date | null }[]>`
  33:       SELECT MAX(updated_at) AS latest FROM doctor_profile
  34:     `;
  35:     const treatmentRows = await tx<{ slug: string; published_at: Date | null; updated_at: Date }[]>`
  36:       SELECT slug, published_at, updated_at FROM treatment_page ORDER BY published_at DESC NULLS LAST
  37:     `;
  38:     const treatmentAggRows = await tx<{ latest: Date | null }[]>`
  39:       SELECT MAX(updated_at) AS latest FROM treatment_page
  40:     `;
  41:     const articleRows = await tx<{ slug: string; published_at: Date | null; updated_at: Date }[]>`
  42:       SELECT slug, published_at, updated_at FROM article ORDER BY published_at DESC NULLS LAST
  43:     `;
  44:     return {
  45:       clinicLastmod: clinicRows[0]?.updated_at.toISOString() ?? new Date().toISOString(),
  46:       locationMain: locationRows[0] ?? null,
  47:       doctors: doctorRows,
  48:       doctorListLastmod: doctorAggRows[0]?.latest?.toISOString() ?? clinicRows[0]?.updated_at.toISOString() ?? new Date().toISOString(),
  49:       treatments: treatmentRows,
  50:       treatmentListLastmod: treatmentAggRows[0]?.latest?.toISOString() ?? clinicRows[0]?.updated_at.toISOString() ?? new Date().toISOString(),
  51:       articles: articleRows,
  52:     };
  53:   });
  54:   if (!data) return new NextResponse("instance not found", { status: 404 });
  55: 
  56:   const entries: SitemapEntry[] = [];
  57:   // P-001 Home
  58:   entries.push({ loc: `${base}`, lastmod: data.clinicLastmod, changefreq: "weekly", priority: "1.0" });
  59:   // P-002 About
  60:   entries.push({ loc: `${base}/about`, lastmod: data.clinicLastmod, changefreq: "monthly", priority: "0.8" });
  61:   // P-003 Doctors List — PSRC-07: 빈 상태도 항상 포함 (minimal 페이지)
  62:   entries.push({ loc: `${base}/doctors`, lastmod: data.doctorListLastmod, changefreq: "monthly", priority: "0.7" });
  63:   // P-004 Doctor Profile (each)
  64:   for (const d of data.doctors) {
  65:     entries.push({ loc: `${base}/doctors/${d.slug}`, lastmod: d.updated_at.toISOString(), changefreq: "monthly", priority: "0.7" });
  66:   }
  67:   // P-005 Treatments List — PSRC-07: 빈 상태도 항상 포함
  68:   entries.push({ loc: `${base}/treatments`, lastmod: data.treatmentListLastmod, changefreq: "monthly", priority: "0.8" });
  69:   // P-006 Treatment Detail (each)
  70:   for (const t of data.treatments) {
  71:     entries.push({
  72:       loc: `${base}/treatments/${t.slug}`,
  73:       lastmod: (t.published_at ?? t.updated_at).toISOString(),
  74:       changefreq: "monthly",
  75:       priority: "0.8",
  76:     });
  77:   }
  78:   // P-010 Article Detail (각 article — v0.1 fallback category `general`)
  79:   for (const a of data.articles) {
  80:     entries.push({
  81:       loc: `${base}/insights/general/${a.slug}`,
  82:       lastmod: (a.published_at ?? a.updated_at).toISOString(),
  83:       changefreq: "monthly",
  84:       priority: "0.5",
  85:     });
  86:   }
  87:   // P-012 Contact
  88:   entries.push({ loc: `${base}/contact`, lastmod: data.clinicLastmod, changefreq: "yearly", priority: "0.6" });
  89:   // P-014 Location Detail
  90:   if (data.locationMain) {
  91:     entries.push({
  92:       loc: `${base}/locations/${data.locationMain.slug}`,
  93:       lastmod: data.locationMain.updated_at.toISOString(),
  94:       changefreq: "monthly",
  95:       priority: "0.7",
  96:     });
  97:   }
  98:   // P-013 Legal — v0.1 단계 sitemap 제외 (noindex · PSR-SEO-07)
  99: 
 100:   const xml = renderSitemap(entries);
 101:   return new NextResponse(xml, {
 102:     status: 200,
 103:     headers: { "content-type": "application/xml; charset=utf-8" },
 104:   });
 105: }
 106: 
 107: function renderSitemap(entries: SitemapEntry[]): string {
 108:   const urls = entries.map((e) => `  <url>
 109:     <loc>${escapeXml(e.loc)}</loc>
 110:     <lastmod>${e.lastmod}</lastmod>
 111:     <changefreq>${e.changefreq}</changefreq>
 112:     <priority>${e.priority}</priority>
 113:   </url>`).join("\n");
 114:   return `<?xml version="1.0" encoding="UTF-8"?>
 115: <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
 116: ${urls}
 117: </urlset>`;
 118: }
 119: 
 120: function escapeXml(s: string): string {
 121:   return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
 122: }

 succeeded in 718ms:
   1: // @glitzy/web/(site)/[instanceSlug]/robots.txt — per-instance robots
   2: // SoT: SEARCH_STANDARDIZATION § 3.3 disallowTraining 출력 예시 (line-by-line 정합)
   3: //      PUBLIC_SITE_RENDER_PLAN v1.0 § 5.3 PSR-SEO-09 (cycle2 PSR-22 + cycle3 PSR-30 정합)
   4: 
   5: import { NextResponse } from "next/server";
   6: import { siteOrigin } from "@/lib/site-url";
   7: 
   8: export async function GET(_req: Request, { params }: { params: { instanceSlug: string } }) {
   9:   // PSRC-09 patch: siteOrigin() 가 PUBLIC_SITE_ORIGIN env 우선 → Host spoof 회피
  10:   const origin = siteOrigin();
  11:   const sitemapUrl = `${origin}/${params.instanceSlug}/sitemap.xml`;
  12: 
  13:   // SEARCH_STANDARDIZATION § 3.3 `disallowTraining` 출력 예시 그대로 (v0.1 starter)
  14:   // 운영 단계 ClinicProfile.metadata.aiCrawlerPolicy row-driven 합류는 PSR-DEFER-10
  15:   const body = `# robots.txt — 자동 생성 by Glitzy Core (SEARCH_STANDARDIZATION § 3)
  16: 
  17: # 일반 룰
  18: User-agent: *
  19: Disallow: /admin/
  20: Disallow: /auth/
  21: Disallow: /api/
  22: Allow: /
  23: 
  24: # A. 일반 검색 색인 — Allow
  25: User-agent: Googlebot
  26: Allow: /
  27: 
  28: User-agent: Yeti
  29: Allow: /
  30: 
  31: User-agent: Bingbot
  32: Allow: /
  33: 
  34: # B. AI 검색 인덱싱·답변용 — Allow
  35: User-agent: OAI-SearchBot
  36: Allow: /
  37: 
  38: User-agent: PerplexityBot
  39: Allow: /
  40: 
  41: User-agent: Claude-SearchBot
  42: Allow: /
  43: 
  44: # C. User-triggered fetch — Allow
  45: User-agent: ChatGPT-User
  46: Allow: /
  47: 
  48: User-agent: Perplexity-User
  49: Allow: /
  50: 
  51: User-agent: Claude-User
  52: Allow: /
  53: 
  54: # D. AI 학습·모델 개선용 — Disallow
  55: User-agent: GPTBot
  56: Disallow: /
  57: 
  58: User-agent: ClaudeBot
  59: Disallow: /
  60: 
  61: User-agent: Google-Extended
  62: Disallow: /
  63: 
  64: User-agent: CCBot
  65: Disallow: /
  66: 
  67: User-agent: anthropic-ai
  68: Disallow: /
  69: 
  70: # meta-externalagent는 experimentalAiBots=true 시에만 추가 (외부 관측 기반·공식 검증 전)
  71: 
  72: Sitemap: ${sitemapUrl}
  73: `;
  74: 
  75:   return new NextResponse(body, {
  76:     status: 200,
  77:     headers: { "content-type": "text/plain; charset=utf-8" },
  78:   });
  79: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/lib/public-tenant.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'packages/db/migrations/D0011_public_reader.sql' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/lib/db-projection.ts' | ForEach-Object { if("'$i -ge 190 -and $i -le 260){ '"'{0,4}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/lib/markdown.ts' | ForEach-Object { if("'$i -ge 35 -and $i -le 75 -or $i -ge 130 -and $i -le 155){ '"'{0,4}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 686ms:
   1: -- @glitzy/db — D0011 app_public_reader role + per-table SELECT policy
   2: -- SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.1 PSR-DATA-01 + PSR-25 + PSR-15
   3: --
   4: -- 본 migration 은 공개 사이트 SSR 단계에서 사용하는 read-only role 을 생성하고,
   5: -- instance lookup + 6 content table 의 per-table SELECT policy 를 명시한다.
   6: --
   7: -- M0 v1.0 production 단계에는 NOLOGIN + MEMBERSHIP 분리 합류 (PSR-DEFER-16).
   8: 
   9: -- LOGIN role — v0.1 단순화 (production NOLOGIN/MEMBERSHIP cascade marker PSR-DEFER-16).
  10: -- IF NOT EXISTS 처리는 raw SQL 외 (Postgres 는 CREATE ROLE IF NOT EXISTS 미지원) → migration runner 책임.
  11: --
  12: -- PSRC-04 patch: migration 안 password 하드코딩 금지. role/권한/policy 만 생성하고
  13: -- password 는 환경별 provision 단계에서 별도 설정 (예: 로컬 dev `ALTER ROLE app_public_reader PASSWORD '...'`,
  14: -- production secret manager). 본 migration 은 idempotent 한 GRANT/POLICY 만.
  15: CREATE ROLE app_public_reader LOGIN;
  16: 
  17: GRANT USAGE ON SCHEMA public TO app_public_reader;
  18: 
  19: -- ===== instance lookup policy =====
  20: -- public reader 가 처음 instance 테이블 SELECT 로 slug → id 매핑. 본 SELECT 는 RLS USING 검증 전이므로
  21: -- 별도 policy (active=true 만 노출).
  22: GRANT SELECT ON instance TO app_public_reader;
  23: 
  24: CREATE POLICY public_reader_instance_select
  25:   ON instance
  26:   FOR SELECT
  27:   TO app_public_reader
  28:   USING (active = true);
  29: 
  30: -- ===== 6 content table per-table policy =====
  31: -- 모든 policy USING `instance_id = current_setting('app.current_instance_id')`
  32: -- helper `withPublicTenantTransaction` 가 instance lookup 직후 SET LOCAL app.current_instance_id 수행.
  33: 
  34: GRANT SELECT ON clinic_profile, location_profile, doctor_profile,
  35:                 treatment_page, article, legal_document
  36:   TO app_public_reader;
  37: 
  38: CREATE POLICY public_reader_clinic_profile_select
  39:   ON clinic_profile FOR SELECT TO app_public_reader
  40:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  41: 
  42: CREATE POLICY public_reader_location_profile_select
  43:   ON location_profile FOR SELECT TO app_public_reader
  44:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  45: 
  46: CREATE POLICY public_reader_doctor_profile_select
  47:   ON doctor_profile FOR SELECT TO app_public_reader
  48:   USING (
  49:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
  50:     AND active = true
  51:   );
  52: 
  53: -- TreatmentPage: published + 미래 발행 제외
  54: CREATE POLICY public_reader_treatment_page_select
  55:   ON treatment_page FOR SELECT TO app_public_reader
  56:   USING (
  57:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
  58:     AND status = 'published'
  59:     AND published_at IS NOT NULL
  60:     AND published_at <= now()
  61:   );
  62: 
  63: CREATE POLICY public_reader_article_select
  64:   ON article FOR SELECT TO app_public_reader
  65:   USING (
  66:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
  67:     AND status = 'published'
  68:     AND published_at IS NOT NULL
  69:     AND published_at <= now()
  70:   );
  71: 
  72: -- LegalDocument: v0.1 단계 published row 0 개 (DB CHECK status='draft' 만 허용)
  73: --   → SELECT 0 행 → 자동 404. published 합류는 LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel) cascade.
  74: CREATE POLICY public_reader_legal_document_select
  75:   ON legal_document FOR SELECT TO app_public_reader
  76:   USING (
  77:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
  78:     AND status = 'published'
  79:   );

 succeeded in 712ms:
   1: // @glitzy/web/lib/public-tenant — withPublicTenantTransaction helper
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.1 PSR-DATA-03 + § 6 작업 #4
   3: //
   4: // 공개 사이트 SSR 단계의 instance lookup + RLS scope 설정.
   5: // 흐름:
   6: //   1. instance slug 조회 (RLS public_reader_instance_select policy USING active=true)
   7: //   2. SELECT set_config('app.current_instance_id', <id>, true) — transaction-scoped
   8: //   3. callback 실행 (content table SELECT 가 RLS 자동 적용)
   9: //   4. return result
  10: 
  11: import type { Sql, TransactionSql } from "postgres";
  12: import { getSqlPublic } from "./public-db";
  13: 
  14: export type PublicTenantContext = {
  15:   readonly instanceId: string;
  16:   readonly instanceSlug: string;
  17: };
  18: 
  19: /**
  20:  * 공개 사이트 SSR 단계의 instance lookup + transaction-scoped RLS scope 설정.
  21:  *
  22:  * @param instanceSlug — URL path 안 [instanceSlug] (URL slug 정규식 검증은 callback 진입 전 별도)
  23:  * @param fn — instance scope 안 SELECT 콜백. tx 는 같은 connection 의 transaction sql tag.
  24:  * @returns fn 결과. instance 미존재 / inactive 시 null
  25:  */
  26: export async function withPublicTenantTransaction<T>(
  27:   instanceSlug: string,
  28:   fn: (tx: TransactionSql, ctx: PublicTenantContext) => Promise<T>,
  29: ): Promise<T | null> {
  30:   const sql: Sql = getSqlPublic();
  31:   // PSRC-03 patch: postgres-js begin() 안 callback 의 첫 인자 = TransactionSql.
  32:   // null 도 fn 반환과 함께 union 으로 사용 가능하도록 generic 명시.
  33:   return sql.begin<T | null>(async (tx: TransactionSql) => {
  34:     // 1) instance lookup — RLS public_reader_instance_select policy USING active=true
  35:     const rows = await tx<{ id: string }[]>`
  36:       SELECT id FROM instance WHERE slug = ${instanceSlug} LIMIT 1
  37:     `;
  38:     if (rows.length === 0) return null;
  39:     const instanceId = rows[0]!.id;
  40: 
  41:     // 2) transaction-scoped instance scope
  42:     await tx`SELECT set_config('app.current_instance_id', ${instanceId}, true)`;
  43: 
  44:     // 3) callback
  45:     return fn(tx, { instanceId, instanceSlug });
  46:   }) as Promise<T | null>;
  47: }

 succeeded in 687ms:
  35:  *
  36:  * @param input — raw markdown 또는 raw HTML
  37:  * @param hostOrigin — 사이트 도메인 (외부 링크 판별용 · v0.1 path-based 단계 `<host>/<instanceSlug>` 형태 prefix)
  38:  */
  39: export function renderMarkdownToHtml(input: string, hostOrigin: string): string {
  40:   // 1) minimal Markdown → HTML (v0.1: 헤더 + 줄바꿈 + 링크 만)
  41:   const html = minimalMarkdownToHtml(input);
  42: 
  43:   // 2) sanitize
  44:   const sanitized = sanitizeHtml(html, {
  45:     allowedTags: ALLOWED_TAGS,
  46:     allowedAttributes: ALLOWED_ATTRIBUTES,
  47:     allowedSchemes: ALLOWED_SCHEMES,
  48:     allowedSchemesAppliedToAttributes: ["href"],
  49:     transformTags: {
  50:       a: (tagName: string, attribs: Record<string, string>) => {
  51:         const href = attribs.href ?? "";
  52:         const isExternal = isExternalLink(href, hostOrigin);
  53:         return {
  54:           tagName,
  55:           attribs: {
  56:             ...attribs,
  57:             ...(isExternal ? { rel: "nofollow noopener noreferrer", target: "_blank" } : {}),
  58:           },
  59:         };
  60:       },
  61:     },
  62:   });
  63:   return sanitized;
  64: }
  65: 
  66: /**
  67:  * minimal Markdown → HTML (v0.1).
  68:  * 지원: `# H1` · `## H2` · `### H3` · 빈 줄 단락 · `- ` 리스트 · `**bold**` · `*italic*` · `[link](url)` · `` `code` ``.
  69:  * PSR-DEFER-17 합류 시 remark/marked 로 전환.
  70:  */
  71: function minimalMarkdownToHtml(md: string): string {
  72:   // raw HTML 그대로 있을 수도 있고 markdown 일 수도. sanitize 가 어차피 escape 하므로 안전.
  73:   const lines = md.split(/\r?\n/);
  74:   const out: string[] = [];
  75:   let inList = false;
 130: }
 131: 
 132: function escapeHtml(text: string): string {
 133:   return text
 134:     .replace(/&/g, "&amp;")
 135:     .replace(/</g, "&lt;")
 136:     .replace(/>/g, "&gt;");
 137: }
 138: 
 139: function isExternalLink(href: string, hostOrigin: string): boolean {
 140:   // PSRC-12 patch: protocol-relative `//evil.example/...` 도 외부 URL 로 분류 — single slash path 만 내부.
 141:   if (href.startsWith("//")) return true;
 142:   if (href.startsWith("/") || href.startsWith("#")) return false;
 143:   try {
 144:     const u = new URL(href, hostOrigin);
 145:     const host = new URL(hostOrigin).host;
 146:     return u.host !== host;
 147:   } catch {
 148:     return false;
 149:   }
 150: }

 succeeded in 708ms:
 190:     if (typeof elem !== "object" || elem === null) continue;
 191:     const e = elem as Record<string, unknown>;
 192:     const id = pickString(e.id);
 193:     const type = pickString(e.type);
 194:     const label = pickString(e.label);
 195:     const targetUrl = pickString(e.targetUrl);
 196:     if (!id || !type || !label || !targetUrl) continue;
 197:     out.push({ id, type, label, targetUrl });
 198:   }
 199:   return out;
 200: }
 201: 
 202: function parseBusinessHours(raw: unknown): LocationProjection["businessHours"] {
 203:   const empty: LocationProjection["businessHours"] = {
 204:     openingHours: [],
 205:     receptionHours: [],
 206:     lunchBreaks: [],
 207:     specialClosures: [],
 208:   };
 209:   if (typeof raw !== "object" || raw === null) return empty;
 210:   const r = raw as Record<string, unknown>;
 211:   const bh = r.businessHours;
 212:   if (typeof bh !== "object" || bh === null) return empty;
 213:   const b = bh as Record<string, unknown>;
 214:   const arr = (k: string): unknown[] => (Array.isArray(b[k]) ? (b[k] as unknown[]) : []);
 215:   return {
 216:     openingHours: arr("openingHours").filter(isOpeningHours),
 217:     receptionHours: arr("receptionHours").filter(isOpeningHours),
 218:     lunchBreaks: arr("lunchBreaks").filter(isLunchBreak),
 219:     specialClosures: arr("specialClosures").filter(isSpecialClosure),
 220:   };
 221: }
 222: 
 223: // PSRC-11 patch: opening/reception 은 `dayOfWeek: string[]` + `opens: HH:mm` + `closes: HH:mm` 강제
 224: const TIME_REGEX = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
 225: const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
 226: 
 227: function isStringArray(v: unknown): v is string[] {
 228:   return Array.isArray(v) && v.every((x) => typeof x === "string");
 229: }
 230: 
 231: function isOpeningHours(x: unknown): x is BusinessHoursDay {
 232:   if (typeof x !== "object" || x === null) return false;
 233:   const o = x as Record<string, unknown>;
 234:   return isStringArray(o.dayOfWeek)
 235:     && typeof o.opens === "string" && TIME_REGEX.test(o.opens)
 236:     && typeof o.closes === "string" && TIME_REGEX.test(o.closes);
 237: }
 238: 
 239: function isLunchBreak(x: unknown): x is BusinessHoursDay {
 240:   if (typeof x !== "object" || x === null) return false;
 241:   const o = x as Record<string, unknown>;
 242:   return isStringArray(o.dayOfWeek)
 243:     && typeof o.from === "string" && TIME_REGEX.test(o.from)
 244:     && typeof o.to === "string" && TIME_REGEX.test(o.to);
 245: }
 246: 
 247: function isSpecialClosure(x: unknown): x is { date: string; reason?: string } {
 248:   if (typeof x !== "object" || x === null) return false;
 249:   const o = x as Record<string, unknown>;
 250:   if (typeof o.date !== "string" || !ISO_DATE_REGEX.test(o.date)) return false;
 251:   if (o.reason !== undefined && typeof o.reason !== "string") return false;
 252:   return true;
 253: }
 254: 
 255: export function normalizeClinic(row: ClinicProfileRow): ClinicProjection {
 256:   return {
 257:     name: row.name,
 258:     description: row.description,
 259:     longDescription: row.long_description,
 260:     slogan: row.slogan,

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/lib/markdown.ts' | ForEach-Object { if("'$i -ge 1 -and $i -le 135){ '"'{0,4}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/layout.tsx' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/lib/site-initial.ts' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/legal/[type]/page.tsx' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 664ms:
   1: // @glitzy/web/lib/site-initial — layout-level data loader for public site
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-04 + § 6 작업 #6
   3: //
   4: // (site) layout 안 한 번 SELECT — Header/Footer + 모든 페이지가 공유.
   5: // instance 미존재 / inactive → null (page 가 notFound() 처리).
   6: //
   7: // PSRC-10 patch: React `cache()` 로 render pass 안 중복 SELECT 회피.
   8: // layout / page / generateMetadata 가 모두 같은 transaction 결과 공유.
   9: 
  10: import { cache } from "react";
  11: import { withPublicTenantTransaction } from "./public-tenant";
  12: import {
  13:   normalizeClinic,
  14:   normalizeLocation,
  15:   type ClinicProjection,
  16:   type ClinicProfileRow,
  17:   type LocationProjection,
  18:   type LocationProfileRow,
  19: } from "./db-projection";
  20: 
  21: export type SiteInitial = {
  22:   readonly instanceSlug: string;
  23:   readonly instanceId: string;
  24:   readonly clinic: ClinicProjection;
  25:   readonly locationMain: LocationProjection | null; // location main 미생성 시 null
  26: };
  27: 
  28: export const loadSiteInitial = cache(async (instanceSlug: string): Promise<SiteInitial | null> => {
  29:   return withPublicTenantTransaction(instanceSlug, async (tx, ctx) => {
  30:     const clinicRows = await tx<ClinicProfileRow[]>`
  31:       SELECT name, description, long_description, slogan, logo_url, og_image_url,
  32:              legal_entity_name, founder,
  33:              to_char(founding_date, 'YYYY-MM-DD') AS founding_date,
  34:              business_registration_number, primary_ctas, updated_at
  35:         FROM clinic_profile
  36:        WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'clinic'
  37:        LIMIT 1
  38:     `;
  39:     if (clinicRows.length === 0) return null;
  40:     const clinic = normalizeClinic(clinicRows[0]!);
  41: 
  42:     const locationRows = await tx<LocationProfileRow[]>`
  43:       SELECT slug, name, street_address, address_locality, address_region, postal_code, address_country,
  44:              latitude::text AS latitude, longitude::text AS longitude,
  45:              phone, email, metadata, updated_at
  46:         FROM location_profile
  47:        WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'main'
  48:        LIMIT 1
  49:     `;
  50:     const locationMain = locationRows.length > 0 ? normalizeLocation(locationRows[0]!) : null;
  51: 
  52:     return {
  53:       instanceSlug: ctx.instanceSlug,
  54:       instanceId: ctx.instanceId,
  55:       clinic,
  56:       locationMain,
  57:     };
  58:   });
  59: });

 succeeded in 679ms:
   1: // @glitzy/web/(site)/[instanceSlug]/layout — 공개 사이트 layout (fragment only)
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-01·02 (cycle1 PSR-03 정합 — root layout 만 <html>/<body>)
   3: 
   4: import { notFound } from "next/navigation";
   5: import { loadSiteInitial } from "@/lib/site-initial";
   6: import { SiteHeader } from "@/components/site/SiteHeader";
   7: import { SiteFooter } from "@/components/site/SiteFooter";
   8: 
   9: export const revalidate = 60;
  10: 
  11: export default async function SiteLayout({
  12:   params,
  13:   children,
  14: }: {
  15:   params: { instanceSlug: string };
  16:   children: React.ReactNode;
  17: }) {
  18:   const initial = await loadSiteInitial(params.instanceSlug);
  19:   if (!initial) notFound();
  20:   return (
  21:     <>
  22:       <SiteHeader initial={initial} />
  23:       <main className="min-h-screen">{children}</main>
  24:       <SiteFooter initial={initial} />
  25:     </>
  26:   );
  27: }

 succeeded in 699ms:
   1: // @glitzy/web/lib/markdown — SSR-safe Markdown 렌더
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.4 PSR-COMP-09 + § 6 작업 #9
   3: //
   4: // 채택: sanitize-html (SSR 호환 · 의존성 작음). PSR-DEFER-17: rehype-sanitize 전환은 FAQ 합류 시.
   5: // 외부 링크: rel="nofollow noopener noreferrer" 자동.
   6: // LegalDocument body 도 동일 컴포넌트 사용 (CONTENT_STANDARDS § 7.1.1.1 면제는 어드민 저장 단계 결정).
   7: 
   8: import sanitizeHtml from "sanitize-html";
   9: 
  10: const ALLOWED_TAGS = [
  11:   "h1", "h2", "h3", "h4",
  12:   "p",
  13:   "ul", "ol", "li",
  14:   "a",
  15:   "strong", "em", "code", "pre",
  16:   "blockquote",
  17:   "table", "thead", "tbody", "tr", "th", "td",
  18:   "hr", "br",
  19: ];
  20: 
  21: const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  22:   "*": ["class", "id", "lang"],
  23:   a: ["href", "rel", "target"],
  24:   code: ["class"],
  25:   pre: ["class"],
  26: };
  27: 
  28: const ALLOWED_SCHEMES = ["http", "https", "mailto", "tel"];
  29: 
  30: /**
  31:  * Markdown 또는 raw HTML → sanitized HTML.
  32:  * v0.1 단계는 raw HTML 만 sanitize. 진짜 Markdown parsing (marked/remark) 은 next iteration.
  33:  * 어드민 저장 단계의 bodyMarkdown 은 raw Markdown 인데, v0.1 SSR 단계에서는 단순 escape + 줄바꿈 처리 → sanitize.
  34:  * 본 함수는 raw HTML / 단순 Markdown 양쪽 모두 동작.
  35:  *
  36:  * @param input — raw markdown 또는 raw HTML
  37:  * @param hostOrigin — 사이트 도메인 (외부 링크 판별용 · v0.1 path-based 단계 `<host>/<instanceSlug>` 형태 prefix)
  38:  */
  39: export function renderMarkdownToHtml(input: string, hostOrigin: string): string {
  40:   // 1) minimal Markdown → HTML (v0.1: 헤더 + 줄바꿈 + 링크 만)
  41:   const html = minimalMarkdownToHtml(input);
  42: 
  43:   // 2) sanitize
  44:   const sanitized = sanitizeHtml(html, {
  45:     allowedTags: ALLOWED_TAGS,
  46:     allowedAttributes: ALLOWED_ATTRIBUTES,
  47:     allowedSchemes: ALLOWED_SCHEMES,
  48:     allowedSchemesAppliedToAttributes: ["href"],
  49:     transformTags: {
  50:       a: (tagName: string, attribs: Record<string, string>) => {
  51:         const href = attribs.href ?? "";
  52:         const isExternal = isExternalLink(href, hostOrigin);
  53:         return {
  54:           tagName,
  55:           attribs: {
  56:             ...attribs,
  57:             ...(isExternal ? { rel: "nofollow noopener noreferrer", target: "_blank" } : {}),
  58:           },
  59:         };
  60:       },
  61:     },
  62:   });
  63:   return sanitized;
  64: }
  65: 
  66: /**
  67:  * minimal Markdown → HTML (v0.1).
  68:  * 지원: `# H1` · `## H2` · `### H3` · 빈 줄 단락 · `- ` 리스트 · `**bold**` · `*italic*` · `[link](url)` · `` `code` ``.
  69:  * PSR-DEFER-17 합류 시 remark/marked 로 전환.
  70:  */
  71: function minimalMarkdownToHtml(md: string): string {
  72:   // raw HTML 그대로 있을 수도 있고 markdown 일 수도. sanitize 가 어차피 escape 하므로 안전.
  73:   const lines = md.split(/\r?\n/);
  74:   const out: string[] = [];
  75:   let inList = false;
  76:   let inPara: string[] = [];
  77:   const flushPara = () => {
  78:     if (inPara.length === 0) return;
  79:     out.push(`<p>${formatInline(inPara.join(" "))}</p>`);
  80:     inPara = [];
  81:   };
  82:   const flushList = () => {
  83:     if (!inList) return;
  84:     out.push("</ul>");
  85:     inList = false;
  86:   };
  87:   for (const raw of lines) {
  88:     const line = raw.trim();
  89:     if (line === "") {
  90:       flushPara();
  91:       flushList();
  92:       continue;
  93:     }
  94:     const h = /^(#{1,4})\s+(.+)$/.exec(line);
  95:     if (h) {
  96:       flushPara();
  97:       flushList();
  98:       const level = h[1]!.length;
  99:       out.push(`<h${level}>${formatInline(h[2]!)}</h${level}>`);
 100:       continue;
 101:     }
 102:     if (line.startsWith("- ") || line.startsWith("* ")) {
 103:       flushPara();
 104:       if (!inList) {
 105:         out.push("<ul>");
 106:         inList = true;
 107:       }
 108:       out.push(`<li>${formatInline(line.slice(2))}</li>`);
 109:       continue;
 110:     }
 111:     flushList();
 112:     inPara.push(line);
 113:   }
 114:   flushPara();
 115:   flushList();
 116:   return out.join("\n");
 117: }
 118: 
 119: function formatInline(text: string): string {
 120:   let out = escapeHtml(text);
 121:   // [link](url)
 122:   out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => `<a href="${url}">${label}</a>`);
 123:   // **bold**
 124:   out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
 125:   // *italic*
 126:   out = out.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
 127:   // `code`
 128:   out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
 129:   return out;
 130: }
 131: 
 132: function escapeHtml(text: string): string {
 133:   return text
 134:     .replace(/&/g, "&amp;")
 135:     .replace(/</g, "&lt;")

 succeeded in 667ms:
   1: // @glitzy/web/(site)/[instanceSlug]/legal/[type] — P-013 Legal/Policy
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.2 PSR-DATA-07 + § 4.3 + PSR-DEFER-13 (= LL-DEFER-01 alias)
   3: //
   4: // v0.1 단계: DB CHECK 가 status='draft' 만 허용하고 RLS 는 status='published' 만 SELECT.
   5: // → 항상 0 row → notFound().
   6: // 합류 시점 (compliance-assistant + ComplianceRecord legalCounsel) 이후에 정상 노출.
   7: 
   8: import type { Metadata } from "next";
   9: import { notFound } from "next/navigation";
  10: import { withPublicTenantTransaction } from "@/lib/public-tenant";
  11: import { normalizeLegal, type LegalDocumentRow } from "@/lib/db-projection";
  12: import { ArticleBody } from "@/components/site/ArticleBody";
  13: import { Breadcrumb } from "@/components/site/Breadcrumb";
  14: import { siteBaseUrl } from "@/lib/site-url";
  15: 
  16: export const revalidate = 60;
  17: 
  18: const CLOSED_TYPES = ["privacy", "terms", "non-covered", "refund", "complaint"] as const;
  19: 
  20: export const metadata: Metadata = {
  21:   robots: { index: false, follow: true },
  22: };
  23: 
  24: export default async function LegalPage({
  25:   params,
  26: }: {
  27:   params: { instanceSlug: string; type: string };
  28: }) {
  29:   if (!CLOSED_TYPES.includes(params.type as (typeof CLOSED_TYPES)[number])) notFound();
  30: 
  31:   const legal = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  32:     const rows = await tx<LegalDocumentRow[]>`
  33:       SELECT slug, document_type::text AS document_type, title, body,
  34:              to_char(effective_date, 'YYYY-MM-DD') AS effective_date,
  35:              updated_at
  36:         FROM legal_document
  37:        WHERE document_type = ${params.type}::legal_document_type
  38:        LIMIT 1
  39:     `;
  40:     return rows.length > 0 ? normalizeLegal(rows[0]!) : null;
  41:   });
  42:   if (!legal) notFound();
  43: 
  44:   const base = `/${params.instanceSlug}`;
  45:   const hostOrigin = siteBaseUrl(params.instanceSlug); // PSRC-15 patch
  46: 
  47:   return (
  48:     <>
  49:       <Breadcrumb items={[
  50:         { label: "홈", href: base },
  51:         { label: "정책", href: null },
  52:         { label: legal.title, href: null },
  53:       ]} />
  54:       <section className="mx-auto max-w-3xl px-4 py-12">
  55:         <h1 className="mb-2 text-3xl font-bold text-fg-default">{legal.title}</h1>
  56:         <p className="mb-8 text-sm text-fg-muted">시행일: {legal.effectiveDate}</p>
  57:         <ArticleBody markdown={legal.body} hostOrigin={hostOrigin} />
  58:       </section>
  59:     </>
  60:   );
  61: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/locations/[slug]/page.tsx' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx' | ForEach-Object { if("'$i -ge 1 -and $i -le 95){ '"'{0,4}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/treatments/[slug]/page.tsx' | ForEach-Object { if("'$i -ge 1 -and $i -le 90){ '"'{0,4}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 685ms:
   1: // @glitzy/web/(site)/[instanceSlug]/locations/[slug] — P-014 Location Detail (v0.1 main 1건)
   2: 
   3: import { notFound } from "next/navigation";
   4: import type { Metadata } from "next";
   5: import { loadSiteInitial } from "@/lib/site-initial";
   6: import { formatAddress } from "@/lib/db-projection";
   7: import { BusinessHoursTable } from "@/components/site/BusinessHoursTable";
   8: import { ReservationChannels } from "@/components/site/ReservationChannels";
   9: import { Breadcrumb } from "@/components/site/Breadcrumb";
  10: import { buildPageMetadata } from "@/lib/site-metadata";
  11: import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
  12: import { locationDetailGraph } from "@/lib/json-ld/builders";
  13: import { siteBaseUrl } from "@/lib/site-url";
  14: 
  15: export const revalidate = 60;
  16: 
  17: export async function generateMetadata({ params }: { params: { instanceSlug: string; slug: string } }): Promise<Metadata> {
  18:   if (params.slug !== "main") return {};
  19:   const initial = await loadSiteInitial(params.instanceSlug);
  20:   if (!initial || !initial.locationMain) return {};
  21:   return buildPageMetadata(initial.clinic, params.instanceSlug, {
  22:     pageTitle: initial.locationMain.name,
  23:     description: `${initial.locationMain.name} · ${formatAddress(initial.locationMain)}`,
  24:     canonicalPath: `/locations/${params.slug}`,
  25:   });
  26: }
  27: 
  28: export default async function LocationDetailPage({
  29:   params,
  30: }: {
  31:   params: { instanceSlug: string; slug: string };
  32: }) {
  33:   // v0.1 단계 main 만 지원 (PSR-DEFER-11 부분)
  34:   if (params.slug !== "main") notFound();
  35:   const initial = await loadSiteInitial(params.instanceSlug);
  36:   if (!initial || !initial.locationMain) notFound();
  37:   const loc = initial.locationMain;
  38:   const base = `/${params.instanceSlug}`;
  39:   const graph = locationDetailGraph(
  40:     { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: `/locations/${loc.slug}` },
  41:     initial.clinic,
  42:     loc,
  43:     `${loc.name} · ${formatAddress(loc)}`,
  44:   );
  45: 
  46:   return (
  47:     <>
  48:       <JsonLdScript graph={graph} />
  49:       <Breadcrumb items={[
  50:         { label: "홈", href: base },
  51:         { label: "위치", href: null },
  52:         { label: loc.name, href: null },
  53:       ]} />
  54:       <section className="mx-auto max-w-3xl px-4 py-12">
  55:         <h1 className="mb-2 text-3xl font-bold text-fg-default">{loc.name}</h1>
  56:         <p className="mb-8 text-base text-fg-muted">{formatAddress(loc)}</p>
  57: 
  58:         <dl className="mb-10 grid grid-cols-1 gap-3 rounded-md border border-border bg-elevated p-4 text-sm sm:grid-cols-2">
  59:           <div><dt className="text-fg-muted">주소</dt><dd className="font-medium text-fg-default">{formatAddress(loc)}</dd></div>
  60:           {loc.telephone ? <div><dt className="text-fg-muted">전화</dt><dd className="font-medium text-fg-default"><a href={`tel:${loc.telephone}`}>{loc.telephone}</a></dd></div> : null}
  61:           {loc.email ? <div><dt className="text-fg-muted">이메일</dt><dd className="font-medium text-fg-default"><a href={`mailto:${loc.email}`}>{loc.email}</a></dd></div> : null}
  62:         </dl>
  63: 
  64:         <h2 className="mb-3 text-xl font-semibold text-fg-default">진료 시간</h2>
  65:         <BusinessHoursTable hours={loc.businessHours} />
  66: 
  67:         {initial.clinic.primaryCtas.length > 0 ? (
  68:           <>
  69:             <h2 className="mb-3 mt-10 text-xl font-semibold text-fg-default">예약 채널</h2>
  70:             <ReservationChannels ctas={initial.clinic.primaryCtas} />
  71:           </>
  72:         ) : null}
  73:       </section>
  74:     </>
  75:   );
  76: }

 succeeded in 680ms:
   1: // @glitzy/web/(site)/[instanceSlug]/doctors/[slug] — P-004 Doctor Profile
   2: 
   3: import { notFound } from "next/navigation";
   4: import Link from "next/link";
   5: import type { Metadata } from "next";
   6: import { withPublicTenantTransaction } from "@/lib/public-tenant";
   7: import { normalizeDoctor, normalizeArticle, type DoctorProfileRow, type ArticleRow } from "@/lib/db-projection";
   8: import { loadSiteInitial } from "@/lib/site-initial";
   9: import { ArticleBody } from "@/components/site/ArticleBody";
  10: import { Breadcrumb } from "@/components/site/Breadcrumb";
  11: import { buildPageMetadata } from "@/lib/site-metadata";
  12: import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
  13: import { doctorProfileGraph } from "@/lib/json-ld/builders";
  14: import { siteBaseUrl } from "@/lib/site-url";
  15: 
  16: export const revalidate = 60;
  17: 
  18: export async function generateMetadata({ params }: { params: { instanceSlug: string; slug: string } }): Promise<Metadata> {
  19:   const initial = await loadSiteInitial(params.instanceSlug);
  20:   if (!initial) return {};
  21:   const doctor = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  22:     const rows = await tx<DoctorProfileRow[]>`
  23:       SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
  24:         FROM doctor_profile WHERE slug = ${params.slug} LIMIT 1
  25:     `;
  26:     return rows.length > 0 ? normalizeDoctor(rows[0]!) : null;
  27:   });
  28:   if (!doctor) return {};
  29:   const description = doctor.bio ? doctor.bio.replace(/[#*_`>]/g, "").slice(0, 160) : `${initial.clinic.name} 의료진 ${doctor.name}`;
  30:   return buildPageMetadata(initial.clinic, params.instanceSlug, {
  31:     pageTitle: doctor.name,
  32:     description,
  33:     canonicalPath: `/doctors/${doctor.slug}`,
  34:     ogType: "profile",
  35:     imageUrl: doctor.photoUrl ?? undefined,
  36:   });
  37: }
  38: 
  39: export default async function DoctorProfilePage({
  40:   params,
  41: }: {
  42:   params: { instanceSlug: string; slug: string };
  43: }) {
  44:   const initial = await loadSiteInitial(params.instanceSlug);
  45:   if (!initial) notFound();
  46:   const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  47:     const doctorRows = await tx<(DoctorProfileRow & { id: string })[]>`
  48:       SELECT id::text AS id, slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
  49:         FROM doctor_profile
  50:        WHERE slug = ${params.slug}
  51:        LIMIT 1
  52:     `;
  53:     if (doctorRows.length === 0) return null;
  54:     const doctor = normalizeDoctor(doctorRows[0]!);
  55: 
  56:     const articleRows = await tx<ArticleRow[]>`
  57:       SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
  58:         FROM article
  59:        WHERE author_doctor_id = ${doctorRows[0]!.id}::uuid
  60:        ORDER BY published_at DESC NULLS LAST
  61:        LIMIT 5
  62:     `;
  63:     return { doctor, articles: articleRows.map(normalizeArticle) };
  64:   });
  65:   if (!data) notFound();
  66: 
  67:   const base = `/${params.instanceSlug}`;
  68:   const hostOrigin = siteBaseUrl(params.instanceSlug);
  69:   const graph = doctorProfileGraph(
  70:     { siteBaseUrl: hostOrigin, pagePath: `/doctors/${data.doctor.slug}` },
  71:     initial.clinic,
  72:     initial.locationMain,
  73:     data.doctor,
  74:     data.doctor.bio ? data.doctor.bio.replace(/[#*_`>]/g, "").slice(0, 160) : `${initial.clinic.name} 의료진 ${data.doctor.name}`,
  75:   );
  76: 
  77:   return (
  78:     <>
  79:       <JsonLdScript graph={graph} />
  80:       <Breadcrumb items={[
  81:         { label: "홈", href: base },
  82:         { label: "의료진", href: `${base}/doctors` },
  83:         { label: data.doctor.name, href: null },
  84:       ]} />
  85:       <section className="mx-auto max-w-3xl px-4 py-12">
  86:         <header className="mb-8 flex flex-col items-center gap-4 text-center md:flex-row md:items-start md:text-left">
  87:           {data.doctor.photoUrl ? (
  88:             // eslint-disable-next-line @next/next/no-img-element
  89:             <img src={data.doctor.photoUrl} alt="" className="h-32 w-32 rounded-full object-cover" />
  90:           ) : null}
  91:           <div>
  92:             <h1 className="text-3xl font-bold text-fg-default">{data.doctor.name}</h1>
  93:             {data.doctor.title ? <p className="mt-1 text-base text-fg-muted">{data.doctor.title}</p> : null}
  94:             {data.doctor.jobTitle ? <p className="mt-0.5 text-sm text-fg-muted">{data.doctor.jobTitle}</p> : null}
  95:           </div>

 succeeded in 718ms:
   1: // @glitzy/web/(site)/[instanceSlug]/insights/[category]/[slug] — P-010 Article Detail (1샘플)
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1 (Article URL `/insights/[category]/[slug]` · v0.1 fallback `general`)
   3: 
   4: import { notFound } from "next/navigation";
   5: import type { Metadata } from "next";
   6: import { withPublicTenantTransaction } from "@/lib/public-tenant";
   7: import { normalizeArticle, normalizeDoctor, type ArticleRow, type DoctorProfileRow } from "@/lib/db-projection";
   8: import { loadSiteInitial } from "@/lib/site-initial";
   9: import { ArticleBody } from "@/components/site/ArticleBody";
  10: import { Breadcrumb } from "@/components/site/Breadcrumb";
  11: import { buildPageMetadata } from "@/lib/site-metadata";
  12: import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
  13: import { articleDetailGraph } from "@/lib/json-ld/builders";
  14: import { siteBaseUrl } from "@/lib/site-url";
  15: 
  16: export const revalidate = 60;
  17: 
  18: export async function generateMetadata({ params }: { params: { instanceSlug: string; category: string; slug: string } }): Promise<Metadata> {
  19:   if (params.category !== "general") return {};
  20:   const initial = await loadSiteInitial(params.instanceSlug);
  21:   if (!initial) return {};
  22:   const a = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  23:     const rows = await tx<ArticleRow[]>`
  24:       SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
  25:         FROM article WHERE slug = ${params.slug} LIMIT 1
  26:     `;
  27:     return rows.length > 0 ? normalizeArticle(rows[0]!) : null;
  28:   });
  29:   if (!a) return {};
  30:   return buildPageMetadata(initial.clinic, params.instanceSlug, {
  31:     pageTitle: a.headline,
  32:     description: a.summary,
  33:     canonicalPath: `/insights/${params.category}/${a.slug}`,
  34:     ogType: "article",
  35:     imageUrl: a.heroImageUrl ?? undefined,
  36:   });
  37: }
  38: 
  39: export default async function ArticleDetailPage({
  40:   params,
  41: }: {
  42:   params: { instanceSlug: string; category: string; slug: string };
  43: }) {
  44:   // v0.1 단일 fallback category `general` — PSR-DEFER-15
  45:   if (params.category !== "general") notFound();
  46:   const initial = await loadSiteInitial(params.instanceSlug);
  47:   if (!initial) notFound();
  48: 
  49:   const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  50:     const rows = await tx<ArticleRow[]>`
  51:       SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
  52:         FROM article
  53:        WHERE slug = ${params.slug}
  54:        LIMIT 1
  55:     `;
  56:     if (rows.length === 0) return null;
  57:     const article = normalizeArticle(rows[0]!);
  58:     let author = null;
  59:     if (article.authorDoctorId) {
  60:       const doctorRows = await tx<DoctorProfileRow[]>`
  61:         SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
  62:           FROM doctor_profile
  63:          WHERE id = ${article.authorDoctorId}::uuid
  64:          LIMIT 1
  65:       `;
  66:       author = doctorRows.length > 0 ? normalizeDoctor(doctorRows[0]!) : null;
  67:     }
  68:     return { article, author };
  69:   });
  70:   if (!data) notFound();
  71: 
  72:   const base = `/${params.instanceSlug}`;
  73:   const hostOrigin = siteBaseUrl(params.instanceSlug);
  74:   const graph = articleDetailGraph(
  75:     { siteBaseUrl: hostOrigin, pagePath: `/insights/${params.category}/${data.article.slug}` },
  76:     initial.clinic,
  77:     initial.locationMain,
  78:     data.article,
  79:     data.author,
  80:     params.category,
  81:   );
  82: 
  83:   return (
  84:     <>
  85:       <JsonLdScript graph={graph} />
  86:       <Breadcrumb items={[
  87:         { label: "홈", href: base },
  88:         { label: "인사이트", href: null },
  89:         { label: data.article.headline, href: null },
  90:       ]} />
  91:       <article className="mx-auto max-w-3xl px-4 py-12">
  92:         {data.article.heroImageUrl ? (
  93:           // eslint-disable-next-line @next/next/no-img-element
  94:           <img src={data.article.heroImageUrl} alt="" className="mb-6 aspect-video w-full rounded-md object-cover" />
  95:         ) : null}
  96:         <h1 className="text-3xl font-bold text-fg-default">{data.article.headline}</h1>
  97:         <p className="mt-2 text-base text-fg-muted">{data.article.summary}</p>
  98:         <div className="mt-4 flex flex-wrap gap-3 text-sm text-fg-muted">
  99:           {data.article.publishedAt ? (
 100:             <time dateTime={data.article.publishedAt.toISOString()}>
 101:               {data.article.publishedAt.toISOString().slice(0, 10)}
 102:             </time>
 103:           ) : null}
 104:           {data.author ? <span>저자: {data.author.name}</span> : null}
 105:         </div>
 106:         <div className="mt-8">
 107:           <ArticleBody markdown={data.article.body} hostOrigin={hostOrigin} />
 108:         </div>
 109:       </article>
 110:     </>
 111:   );
 112: }

 succeeded in 741ms:
   1: // @glitzy/web/(site)/[instanceSlug]/treatments/[slug] — P-006 Treatment Detail
   2: 
   3: import { notFound } from "next/navigation";
   4: import type { Metadata } from "next";
   5: import { withPublicTenantTransaction } from "@/lib/public-tenant";
   6: import { normalizeTreatment, type TreatmentPageRow } from "@/lib/db-projection";
   7: import { loadSiteInitial } from "@/lib/site-initial";
   8: import { ArticleBody } from "@/components/site/ArticleBody";
   9: import { Breadcrumb } from "@/components/site/Breadcrumb";
  10: import { ReservationChannels } from "@/components/site/ReservationChannels";
  11: import { buildPageMetadata } from "@/lib/site-metadata";
  12: import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
  13: import { treatmentDetailGraph } from "@/lib/json-ld/builders";
  14: import { siteBaseUrl } from "@/lib/site-url";
  15: 
  16: export const revalidate = 60;
  17: 
  18: export async function generateMetadata({ params }: { params: { instanceSlug: string; slug: string } }): Promise<Metadata> {
  19:   const initial = await loadSiteInitial(params.instanceSlug);
  20:   if (!initial) return {};
  21:   const t = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  22:     const rows = await tx<TreatmentPageRow[]>`
  23:       SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
  24:         FROM treatment_page WHERE slug = ${params.slug} LIMIT 1
  25:     `;
  26:     return rows.length > 0 ? normalizeTreatment(rows[0]!) : null;
  27:   });
  28:   if (!t) return {};
  29:   return buildPageMetadata(initial.clinic, params.instanceSlug, {
  30:     pageTitle: t.name,
  31:     description: t.summary,
  32:     canonicalPath: `/treatments/${t.slug}`,
  33:     ogType: "article",
  34:     imageUrl: t.heroImageUrl ?? undefined,
  35:   });
  36: }
  37: 
  38: export default async function TreatmentDetailPage({
  39:   params,
  40: }: {
  41:   params: { instanceSlug: string; slug: string };
  42: }) {
  43:   const initial = await loadSiteInitial(params.instanceSlug);
  44:   if (!initial) notFound();
  45: 
  46:   const treatment = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  47:     const rows = await tx<TreatmentPageRow[]>`
  48:       SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
  49:         FROM treatment_page
  50:        WHERE slug = ${params.slug}
  51:        LIMIT 1
  52:     `;
  53:     return rows.length > 0 ? normalizeTreatment(rows[0]!) : null;
  54:   });
  55:   if (!treatment) notFound();
  56: 
  57:   const base = `/${params.instanceSlug}`;
  58:   const hostOrigin = siteBaseUrl(params.instanceSlug);
  59:   const graph = treatmentDetailGraph(
  60:     { siteBaseUrl: hostOrigin, pagePath: `/treatments/${treatment.slug}` },
  61:     initial.clinic,
  62:     initial.locationMain,
  63:     treatment,
  64:     treatment.summary,
  65:   );
  66: 
  67:   return (
  68:     <>
  69:       <JsonLdScript graph={graph} />
  70:       <Breadcrumb items={[
  71:         { label: "홈", href: base },
  72:         { label: "진료", href: `${base}/treatments` },
  73:         { label: treatment.name, href: null },
  74:       ]} />
  75:       <section className="mx-auto max-w-3xl px-4 py-12">
  76:         {treatment.heroImageUrl ? (
  77:           // eslint-disable-next-line @next/next/no-img-element
  78:           <img src={treatment.heroImageUrl} alt="" className="mb-6 aspect-video w-full rounded-md object-cover" />
  79:         ) : null}
  80:         <h1 className="text-3xl font-bold text-fg-default">{treatment.name}</h1>
  81:         <p className="mt-2 text-base text-fg-muted">{treatment.summary}</p>
  82:         <div className="mt-8">
  83:           <ArticleBody markdown={treatment.body} hostOrigin={hostOrigin} />
  84:         </div>
  85:         {initial.clinic.primaryCtas.length > 0 ? (
  86:           <div className="mt-12 rounded-md border border-border bg-subtle p-6">
  87:             <h2 className="mb-3 text-lg font-semibold text-fg-default">예약 / 상담</h2>
  88:             <ReservationChannels ctas={initial.clinic.primaryCtas} />
  89:           </div>
  90:         ) : null}

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.12|\\(site\\)|/admin|PUBLIC_SITE_RENDER|PSR-CASCADE\" docs/admin/ARCHITECTURE.md docs/core/SCHEMA_MAPPING.md docs/decisions/M0_BUILD_EXPORT_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"href=\\{"'`/'"\\"'$'"\\{params\\.instanceSlug|href=\\\"/\\"'$'"\\{params|redirect\\("'`/'"\\"'$'"\\{instanceSlug|revalidatePath\\("'`/'"\\"'$'"\\{instanceSlug|/\\"'$'"\\{instanceSlug\\}\" \"apps/web/src/app/(admin)/admin/[instanceSlug]\" \"apps/web/src/app/page.tsx\" \"apps/web/src/app/sign-in/consume/route.ts\" \"apps/web/src/seed.ts\"" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"from \\\"@/app/\\(admin\\)/\\[instanceSlug\\]|@/app/\\(admin\\)/\\[instanceSlug\\]|/admin/\\"'$'"\\{firstSlug\\}|/\\"'$'"\\{firstSlug\\}\" apps/web/src apps/web/src/seed.ts" in C:\Users\assag\solution\website-exposure
2026-05-18T04:57:09.209278Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.5 seconds
Output:

 exited 1 in 522ms:
 succeeded in 635ms:
docs/decisions/M0_BUILD_EXPORT_PLAN.md:9:- `docs/admin/ARCHITECTURE.md` v0.7 § 3 Vertical Slice · § 3.8.1·3.8.2 자동 생성 규칙 · § 3.11 완료 게이트 #1
docs/decisions/M0_BUILD_EXPORT_PLAN.md:51:### 2.1 PUBLIC_SITE_RENDER_PLAN SSR 컴포넌트 재사용 (PSR-CASCADE-03)
docs/decisions/M0_BUILD_EXPORT_PLAN.md:53:`PUBLIC_SITE_RENDER_PLAN.md` v0.x 가 apps/web 안 `(site)` route group · SSR + Next ISR 로 먼저 공개 페이지를 렌더한다 (Phase 0). 본 M0 v1.0 본 구현 시점에 같은 컴포넌트 트리를 정적 build/export 로 재사용한다:
docs/decisions/M0_BUILD_EXPORT_PLAN.md:57:| 페이지 컴포넌트 | `apps/web/src/app/(site)/[instanceSlug]/...` server component | `next export` + `generateStaticParams` 또는 별도 Astro/Next static 변환 |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:59:| sitemap.xml / robots.txt | `apps/web/src/app/(site)/[instanceSlug]/{sitemap.xml,robots.txt}/route.ts` | static file generate — instance 별 directory 안 `sitemap.xml` · `robots.txt` |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:65:본 § 2.1 은 `PUBLIC_SITE_RENDER_PLAN` 의 acceptance precondition cascade (PSR-CASCADE-03) — apps/worker 구현 시 별도 컴포넌트 작성 부담 없음. 본 plan v1.0 합류 시 § 2.1 상세화.
docs/core/SCHEMA_MAPPING.md:68:#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)
docs/core/SCHEMA_MAPPING.md:70:`PUBLIC_SITE_RENDER_PLAN.md` v0.x § 5.4 PSR-SEO-12 의 SSR + path-based routing 단계 (Phase 0) 에서는 도메인 매핑 (subdomain/custom domain) 합류 전이므로 **임시로 instanceSlug 가 path 에 들어간 `@id` 패턴** 을 사용한다:
docs/admin/ARCHITECTURE.md:280:### 3.12 apps/web route group 구조 (PSR-CASCADE-01a · PUBLIC_SITE_RENDER_PLAN v0.x)
docs/admin/ARCHITECTURE.md:282:Phase 0 단계 `apps/web` 안 어드민 + 공개 사이트 두 영역을 같은 Next.js 앱 안 route group 으로 분리한다. PUBLIC_SITE_RENDER_PLAN v0.x § 2.1 의 acceptance precondition cascade.
docs/admin/ARCHITECTURE.md:286:| `(admin)` | `/admin/<instanceSlug>/...` | 운영자 어드민 — ClinicProfile · DoctorProfile · TreatmentPage · Article · LegalDocument 입력/편집 | ADMIN_UI_SKELETON code v1.0 합류 (현재 `/<instanceSlug>/...` → `/admin/<instanceSlug>/...` 격상 cascade는 PUBLIC_SITE_RENDER code v1.0 cycle 안 동반 — PSR-CASCADE-01b) |
docs/admin/ARCHITECTURE.md:287:| `(site)` | `/<instanceSlug>/...` | 공개 사이트 — Home · About · Doctors · Treatments · Insights (1샘플) · Contact · Locations · Legal (v0.x 차단) | PUBLIC_SITE_RENDER code v1.0 합류 (M0 게이트 #1 사이트 측 페이지 빌드 가능 단계) |
docs/admin/ARCHITECTURE.md:289:**격상 의도**: 어드민 `/<slug>` 와 공개 `/<slug>` 가 같은 path namespace 를 공유하면 충돌. 본 격상으로 `(admin)` 은 `/admin/<slug>` · `(site)` 는 `/<slug>` 로 분리. M0 v1.0 도메인 매핑 (PSR-DEFER-02) 합류 시 어드민 도메인 (`app.glitzy.co`) 분리 가능 — 그 시점에 `/admin` prefix 유지 또는 제거 결정.
docs/admin/ARCHITECTURE.md:402:> 상세 필드는 `docs/admin/DATA_MODEL.md`.

2026-05-18T04:57:09.317146Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.5 seconds
Output:
[31;1mParserError: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m rg -n "from \"[36;1m@[0m/app/\(admin\)/\[instanceSlug\]|@/app/\(admin\)/\[inst …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m               ~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mUnrecognized token in source text.[0m

 exited 1 in 540ms:
[31;1mParserError: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m rg -n "from \"[36;1m@[0m/app/\(admin\)/\[instanceSlug\]|@/app/\(admin\)/\[inst …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m               ~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mUnrecognized token in source text.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n '@/app/\\(admin\\)/\\[instanceSlug\\]|/\\"'$'"\\{firstSlug\\}|redirect\\("'`/'"\\"'$'"\\{result\\.slug\\}|href=\\{"'`/'"\\"'$'"\\{params\\.instanceSlug|revalidatePath\\("'`/'"\\"'$'"\\{instanceSlug' apps/web/src" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'admin/\\"'$'"\\{firstSlug\\}|/admin/\\"'$'"\\{|/admin/|/\\"'$'"\\{firstSlug\\}' apps/web/src/seed.ts apps/web/src/app/page.tsx apps/web/src/app/sign-in/consume/route.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n 'from \"@/app/\\(admin\\)|from \"\\.\\./actions\"|from \"\\./actions\"|actions' apps/web/src/components/forms apps/web/src/app/\\(admin\\)/admin" in C:\Users\assag\solution\website-exposure
2026-05-18T04:57:16.761785Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
[31;1madmin\: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … tions' apps/web/src/components/forms apps/web/src/app/\([36;1madmin\[0m)/admin[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin\' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 exited 1 in 572ms:
[31;1madmin\: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … tions' apps/web/src/components/forms apps/web/src/app/\([36;1madmin\[0m)/admin[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin\' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 succeeded in 645ms:
apps/web/src/app/sign-in/consume/route.ts:177:  // 6) cookie set + redirect — PSR-CASCADE-01b: admin URL `/admin/<slug>` prefix 격상
apps/web/src/app/sign-in/consume/route.ts:178:  const res = NextResponse.redirect(new URL(`/admin/${membershipResult.slug}`, req.url));
apps/web/src/app/page.tsx:52:  // PSR-CASCADE-01b: 어드민 URL `/admin/<slug>/...` prefix 격상 (PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1)
apps/web/src/app/page.tsx:57:  redirect(`/admin/${result.slug}`);

2026-05-18T04:57:16.834852Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:

 exited 1 in 661ms:
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' | ForEach-Object { if("'$i -ge 592 -and $i -le 620){ '"'{0,4}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 579ms:
 592: ## 7. § 8.1 시나리오 (LOCAL_PASS 검증) — cycle1 PSR-17·18 정정
 593: 
 594: | # | 시나리오 | 통과 기준 |
 595: |---|---|---|
 596: | 1 | 어드민이 저장한 ClinicProfile 가 `/<instanceSlug>` (P-001 Home) 에 정확히 표시 | name · description · primaryCtas[0].label 가 페이지 안 **보임** (cycle1 PSR-18 정정) |
 597: | 2 | DoctorProfile 3건 등록 후 `/<instanceSlug>/doctors` 페이지에 3 card 표시 | active=true 만 보임 · displayOrder ASC 정렬 |
 598: | 3 | DoctorProfile.active=false 한 row → `/<instanceSlug>/doctors` 리스트에서 사라짐 | row count 2 |
 599: | 4 | TreatmentPage status='draft' → `/<instanceSlug>/treatments` 리스트에 미노출 (RLS 자동 차단) | 0건 |
 600: | 5 | TreatmentPage status='published' + publishedAt now() → 노출 | 1건 |
 601: | 6 | TreatmentPage `/<instanceSlug>/treatments/<slug>` 진입 시 body_markdown 렌더링 | `<h1>`·`<h2>`·`<p>` 표준 출력 |
 602: | 7 | Article published 5건 → `/<instanceSlug>/insights/general/<slug>` 진입 가능 (1샘플) | P-010 단일 페이지 렌더 |
 603: | 8 | LegalDocument 5종 draft → `/<instanceSlug>/legal/<type>` 응답 = 404 (v0.1 noindex + DB CHECK draft 만) | Next `notFound()` |
 604: | 9 | tenant A 가 `/<tenantB>` 접근 — A 콘텐츠 미노출, B 콘텐츠만 | RLS app_public_reader USING `instance_id` 정합 |
 605: | 10 | 모든 페이지 `<script type="application/ld+json">` 단일 출력 | `@graph` 안 P-001~P-014 별 entity 풀/참조 정합 (§ 5.4 PSR-SEO-11 표) |
 606: | 11 | `/<instanceSlug>/sitemap.xml` 응답 | XML sitemap (P-013 제외 9페이지 + 동적 slug) + SEARCH_STANDARDIZATION § 4.3 changefreq/priority 정확 |
 607: | 12 | `/<instanceSlug>/robots.txt` 응답 | SEARCH_STANDARDIZATION § 3 v0.1 starter `disallowTraining` 정합 (학습 봇 Disallow + 답변 봇 Allow + Naver Yeti Allow) |
 608: | 13 | XSS payload `<script>` 가 어드민에 저장된 bodyMarkdown 에 포함 시 렌더 단계에서 escape | `<script>` literal 출력 — execution X (sanitize-html) |
 609: | 14 | active=false instance → `/<instanceSlug>` 진입 시 404 | Next `notFound()` (instance lookup policy USING `active=true`) |
 610: | 15 | 어드민 측 도메인 (`/admin/<slug>/...`) 와 공개 도메인 (`/<slug>/...`) 충돌 없음 — PSR-CASCADE-01 정합 | 어드민 prefix `/admin` · 공개 prefix 없음. sign-in consume redirect `/admin/<firstSlug>` |
 611: | 16 | dark mode CSS vars 출력 (UI toggle 미지원) | `[data-theme="dark"]` 블록 안 22개 토큰 모두 dark 값 정의 — 자체 rule checker (LOCAL_PASS) · UI toggle 은 marker 만 |
 612: | 17 | sitemap.xml 의 lastmod 가 entity updatedAt (Article 은 datePublished/publishedAt) 과 정확히 일치 | ISO 8601 형식 |
 613: | 18 | **자체 JSON-LD rule checker** 통과 (cycle1 PSR-17 정정) | JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 — Google 외부 validator 는 manual QA marker (PSR-DEFER-14) |
 614: | 19 | LocationProfile.metadata.businessHours (CT-02 SoT) 가 `/<instanceSlug>/contact` + `/<instanceSlug>/locations/main` 에 7요일 표 + 점심 시간 표시 | LL-SCHEMA-16 정합 · 두 페이지 동일 표 출력 |
 615: | 20 | Markdown ArticleBody 안 외부 링크 `rel="nofollow noopener noreferrer"` (cycle1 PSR-20) | 내부 링크 (`/<slug>/...`) 는 그대로 |
 616: | 21 | Next metadata API `themeColor` 2값 (light + dark) 출력 — cycle1 PSR-10 + cycle3 PSR-29 정정 | `<meta name="theme-color" media="(prefers-color-scheme: light)" content="#2563eb">` (= `BrandTokens.colors.light.primary` default · `color.brand.primary` light) + `<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#60a5fa">` (dark). 인스턴스별 brandTokens 주입 시 override |
 617: | 22 | P-004 OG type = `profile` · P-006 OG type = `article` · P-010 OG type = `article` (cycle1 PSR-10) | meta `property="og:type"` 확인 |
 618: | 23 | P-013 Legal route 가 noindex robots meta + sitemap 제외 (cycle1 PSR-06) | `<meta name="robots" content="noindex,follow">` + sitemap.xml 에 없음 |
 619: 
 620: ## 8. 작업 단위 (cycle1 PSR-21 cascade 분해)

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"data-theme=\\\"dark\\\"|--color|bg-canvas|text-fg-default|themeColor|bg-slate-50|text-slate-900\" apps/web/src/styles/globals.css apps/web/src/app/layout.tsx apps/web/tailwind.config.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/components/site/BusinessHoursTable.tsx' | ForEach-Object { '{0,4}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content '"'apps/web/src/components/site/SiteFooter.tsx' | ForEach-Object { if("'$i -ge 1 -and $i -le 90){ '"'{0,4}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
2026-05-18T04:57:30.360482Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
rg: regex parse error:
    (?:data-theme=\)
    ^
error: unclosed group

 exited 1 in 573ms:
rg: regex parse error:
    (?:data-theme=\)
    ^
error: unclosed group

 succeeded in 606ms:
   1: // @glitzy/web/components/site/SiteFooter — 공개 사이트 푸터
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-03 (cycle2 PSR-26: 법적 페이지 링크 v0.1 단계 숨김 — broken link 회피)
   3: 
   4: import type { SiteInitial } from "@/lib/site-initial";
   5: import { formatAddress } from "@/lib/db-projection";
   6: 
   7: export function SiteFooter({ initial }: { initial: SiteInitial }) {
   8:   const loc = initial.locationMain;
   9:   return (
  10:     <footer className="mt-12 border-t border-border bg-subtle">
  11:       <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-fg-muted md:flex-row md:justify-between">
  12:         <div>
  13:           <div className="text-base font-semibold text-fg-default">{initial.clinic.name}</div>
  14:           {loc ? (
  15:             <ul className="mt-2 space-y-1">
  16:               <li>주소: {formatAddress(loc)}</li>
  17:               {loc.telephone ? <li>전화: {loc.telephone}</li> : null}
  18:               {loc.email ? <li>이메일: {loc.email}</li> : null}
  19:             </ul>
  20:           ) : null}
  21:         </div>
  22:         {loc && loc.businessHours.openingHours.length > 0 ? (
  23:           <div>
  24:             <div className="font-medium text-fg-default">진료 시간</div>
  25:             <ul className="mt-2 space-y-1">
  26:               {loc.businessHours.openingHours.map((oh, i) => (
  27:                 <li key={i}>
  28:                   {oh.dayOfWeek.join(", ")}: {oh.opens} – {oh.closes}
  29:                 </li>
  30:               ))}
  31:               {loc.businessHours.lunchBreaks.map((lb, i) => (
  32:                 <li key={`lunch-${i}`}>
  33:                   점심 ({lb.dayOfWeek.join(", ")}): {lb.from} – {lb.to}
  34:                 </li>
  35:               ))}
  36:             </ul>
  37:           </div>
  38:         ) : null}
  39:         <div className="text-xs text-fg-disabled">
  40:           © {new Date().getUTCFullYear()} {initial.clinic.name}
  41:           {initial.clinic.legalEntityName ? ` (${initial.clinic.legalEntityName})` : null}
  42:         </div>
  43:       </div>
  44:       {/* PSR-26: LegalDocument 공개 합류 (PSR-DEFER-13) 시점에 정책 5종 링크 추가 */}
  45:     </footer>
  46:   );
  47: }

 succeeded in 615ms:
   1: // @glitzy/web/components/site/BusinessHoursTable
   2: // SoT: LL-SCHEMA-16 CT-02 + PUBLIC_SITE_RENDER_PLAN v1.0 § 4.3 PSR-COMP-08
   3: 
   4: import type { LocationProjection } from "@/lib/db-projection";
   5: 
   6: const DAY_KO: Record<string, string> = {
   7:   Monday: "월",
   8:   Tuesday: "화",
   9:   Wednesday: "수",
  10:   Thursday: "목",
  11:   Friday: "금",
  12:   Saturday: "토",
  13:   Sunday: "일",
  14: };
  15: 
  16: export function BusinessHoursTable({ hours }: { hours: LocationProjection["businessHours"] }) {
  17:   if (hours.openingHours.length === 0) {
  18:     return <div className="text-sm text-fg-muted">진료 시간 정보가 등록되지 않았습니다.</div>;
  19:   }
  20:   return (
  21:     <div className="overflow-x-auto">
  22:       <table className="w-full border-collapse border border-border text-sm">
  23:         <thead className="bg-subtle">
  24:           <tr>
  25:             <th scope="col" className="border border-border px-3 py-2 text-left">요일</th>
  26:             <th scope="col" className="border border-border px-3 py-2 text-left">진료 시간</th>
  27:             <th scope="col" className="border border-border px-3 py-2 text-left">점심</th>
  28:           </tr>
  29:         </thead>
  30:         <tbody>
  31:           {hours.openingHours.map((oh, i) => {
  32:             const dayLabel = oh.dayOfWeek.map((d) => DAY_KO[d] ?? d).join(", ");
  33:             const lb = hours.lunchBreaks.find((l) => l.dayOfWeek.some((d) => oh.dayOfWeek.includes(d)));
  34:             return (
  35:               <tr key={i}>
  36:                 <th scope="row" className="border border-border px-3 py-2 text-left font-medium">{dayLabel}</th>
  37:                 <td className="border border-border px-3 py-2">{oh.opens} – {oh.closes}</td>
  38:                 <td className="border border-border px-3 py-2 text-fg-muted">{lb ? `${lb.from} – ${lb.to}` : "—"}</td>
  39:               </tr>
  40:             );
  41:           })}
  42:           {hours.specialClosures.length > 0 ? (
  43:             <tr>
  44:               <th scope="row" className="border border-border px-3 py-2 text-left font-medium">특수 휴진</th>
  45:               <td colSpan={2} className="border border-border px-3 py-2 text-fg-muted">
  46:                 {hours.specialClosures.map((c) => `${c.date}${c.reason ? ` (${c.reason})` : ""}`).join(", ")}
  47:               </td>
  48:             </tr>
  49:           ) : null}
  50:         </tbody>
  51:       </table>
  52:     </div>
  53:   );
  54: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n '/admin/|admin/' apps/web/src/seed.ts" in C:\Users\assag\solution\website-exposure
2026-05-18T04:57:59.277756Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:

 exited 1 in 566ms:
codex
# PUBLIC_SITE_RENDER code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=1 major=2 minor=0 (총 3)
- closeableAfterPatch: false
- 수렴 추세 추적: cycle1=15 (3+9+3) → cycle2=3 (1+2+0)
- 확인 실행: `pnpm --filter @glitzy/web typecheck` PASS

## cycle 1 patch 검증
- PSRC-01: PASS — `ClinicProfileForm` 타입 import가 `/admin/[instanceSlug]` 경로로 갱신됨 (`apps/web/src/components/forms/ClinicProfileForm.tsx:14`)
- PSRC-02: PASS — `sanitize-html` 의존성/타입 존재, `transformTags.a` 콜백 타입 명시 (`apps/web/package.json`, `apps/web/src/lib/markdown.ts:44-61`)
- PSRC-03: PASS — `TransactionSql` + `sql.begin<T | null>` 반영 (`apps/web/src/lib/public-tenant.ts:11`, `apps/web/src/lib/public-tenant.ts:33`)
- PSRC-04: PASS — D0011 migration 안 password 하드코딩 제거 (`packages/db/migrations/D0011_public_reader.sql:12-15`)
- PSRC-05: PARTIAL — Article author inline은 반영됐지만, P-003/P-004/P-005/P-010에 `MedicalClinic` 풀 entity를 출력해 plan SoT의 `[참조] MedicalClinic`과 충돌함. PSRC-17 참조.
- PSRC-06: PARTIAL — same-origin singleton ref 검사는 추가됐지만 현재 그래프 자체가 `#website` unresolved로 실패하고, inline `@id` ref는 여전히 검사하지 않음. PSRC-16/18 참조.
- PSRC-07: PASS — P-003/P-005 빈 목록 sitemap 포함 + list `MAX(updated_at)` 반영 (`sitemap.xml/route.ts:31-39`, `:61-68`)
- PSRC-08: PASS — metadata canonical/OG URL absolute 처리 (`apps/web/src/lib/site-metadata.ts:41-54`)
- PSRC-09: PASS — `PUBLIC_SITE_ORIGIN` 우선, fallback은 request host (`apps/web/src/lib/site-url.ts:16-26`, `:32-40`)
- PSRC-10: PASS — `loadSiteInitial = cache(...)` 반영 (`apps/web/src/lib/site-initial.ts:28`)
- PSRC-11: PASS — `TIME_REGEX`, ISO date regex narrowing 반영 (`apps/web/src/lib/db-projection.ts:223-252`)
- PSRC-12: PASS — protocol-relative 외부 링크 처리 (`apps/web/src/lib/markdown.ts:139-147`)
- PSRC-13: PASS — Home에 Article teaser + Contact 섹션 존재 (`apps/web/src/app/(site)/[instanceSlug]/page.tsx:125-134` 등)
- PSRC-14: PASS — ContactPoint `@id` absolute (`apps/web/src/lib/json-ld/entities.ts:37-44`)
- PSRC-15: PASS — Legal route `siteBaseUrl(params.instanceSlug)` 사용 (`apps/web/src/app/(site)/[instanceSlug]/legal/[type]/page.tsx:44-57`)

## new blocking / major / minor (PSRC-16+)

### PSRC-16 [blocking] JSON-LD rule checker가 P-002+ 대부분 페이지에서 unresolved `#website`로 실패
`webPageEntity`는 모든 페이지에 `isPartOf: { "@id": "${siteBaseUrl}/#website" }`를 넣습니다 (`apps/web/src/lib/json-ld/entities.ts:153-161`). 하지만 `webSiteEntity`는 Home graph에만 포함됩니다 (`apps/web/src/lib/json-ld/builders.ts:21-31`). 반면 checker는 same-origin singleton ref가 graph 안에 없으면 오류 처리합니다 (`apps/web/src/lib/json-ld/__tests__/validate.ts:59-65`).

따라서 P-002/P-003/P-004/P-005/P-006/P-010/P-012/P-014의 JSON-LD checker는 `#website` 참조를 unresolved로 봅니다. plan §7 scenario #18의 통과 기준이 “자체 JSON-LD rule checker 통과”이므로 acceptance gate 실패입니다 (`docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:613`).

권장 패치: non-home graph에도 `WebSite` 풀 entity를 포함하거나, checker에서 `#website` 같은 명시 허용 ref 정책을 SoT와 함께 정의해야 합니다. 현재 구현/검증 규칙은 서로 양립하지 않습니다.

### PSRC-17 [major] P-003/P-004/P-005/P-010 `MedicalClinic` 출력 정책이 plan SoT와 불일치
plan SoT는 P-003, P-004, P-005, P-010을 `[참조] MedicalClinic`로 정의합니다 (`docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:550-554`). 현재 builders는 해당 페이지들에 location이 있으면 `medicalClinicEntity` 풀 entity를 graph에 넣습니다:
- P-003: `apps/web/src/lib/json-ld/builders.ts:62-65`
- P-004: `apps/web/src/lib/json-ld/builders.ts:83-87`
- P-005: `apps/web/src/lib/json-ld/builders.ts:104-107`
- P-010: `apps/web/src/lib/json-ld/builders.ts:147-151`

이건 scenario #10의 “P-001~P-014 별 entity 풀/참조 정합”을 깨뜨립니다 (`docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:605`). 코드 주석도 “SCHEMA_MAPPING cascade marker”라고 되어 있어 코드가 plan acceptance SoT를 따라가지 않고 별도 future cascade를 전제합니다 (`apps/web/src/lib/json-ld/builders.ts:51-54`).

### PSRC-18 [major] cross-reference checker가 inline `@id` 참조를 여전히 놓침
checker는 `Object.keys(v).length === 1`인 `{ "@id": "..." }` 형태만 검사합니다 (`apps/web/src/lib/json-ld/__tests__/validate.ts:59`). 그러나 실제 graph에는 inline minimal 객체에 `@id`가 붙는 참조가 존재합니다. 예: Article author는 같은 origin physician `@id`를 갖지만 `name/jobTitle/image`가 같이 있어 검사 대상에서 빠집니다 (`apps/web/src/lib/json-ld/entities.ts:123-131`). ItemList도 `{ "@id": ..., name: ... }` 형태입니다 (`apps/web/src/lib/json-ld/entities.ts:200-204`).

PSRC-06 patch summary의 “same-origin URL은 graph entity 필수” 기준으로는 PARTIAL입니다. 반대로 inline minimal ref를 허용하려는 정책이라면 checker 주석/plan 문구를 바꿔야 합니다. 지금은 검증 규칙이 구현 의도를 정확히 표현하지 못합니다.

## scenario 1~23 통과 여부 추론
- FAIL: #10, #18 — 위 PSRC-16/17 때문에 JSON-LD graph entity 정합 및 checker 통과 불가.
- PASS 추정: #1~9, #11~17, #19~23 — RLS/route/sitemap/robots/metadata/admin-prefix/typecheck 관점에서 코드상 큰 차단은 보이지 않음. 단 실제 DB fixture 기반 LOCAL_PASS 스크립트는 별도 실행되지 않았습니다.

## acceptance precondition (PSR-CASCADE-01b) 점검
- PSR-CASCADE-01b: PASS
- 근거: root redirect `/admin/${result.slug}` (`apps/web/src/app/page.tsx:52-57`), sign-in consume redirect `/admin/${membershipResult.slug}` (`apps/web/src/app/sign-in/consume/route.ts:177-178`), admin actions `revalidatePath('/admin/...')` 반영 (`doctors/actions.ts:158-166`, `treatments/actions.ts:156-164`, `articles/actions.ts:193-200`, `clinic-profile/actions.ts:426-427`), stale admin import도 제거됨.
tokens used
87,550
# PUBLIC_SITE_RENDER code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=1 major=2 minor=0 (총 3)
- closeableAfterPatch: false
- 수렴 추세 추적: cycle1=15 (3+9+3) → cycle2=3 (1+2+0)
- 확인 실행: `pnpm --filter @glitzy/web typecheck` PASS

## cycle 1 patch 검증
- PSRC-01: PASS — `ClinicProfileForm` 타입 import가 `/admin/[instanceSlug]` 경로로 갱신됨 (`apps/web/src/components/forms/ClinicProfileForm.tsx:14`)
- PSRC-02: PASS — `sanitize-html` 의존성/타입 존재, `transformTags.a` 콜백 타입 명시 (`apps/web/package.json`, `apps/web/src/lib/markdown.ts:44-61`)
- PSRC-03: PASS — `TransactionSql` + `sql.begin<T | null>` 반영 (`apps/web/src/lib/public-tenant.ts:11`, `apps/web/src/lib/public-tenant.ts:33`)
- PSRC-04: PASS — D0011 migration 안 password 하드코딩 제거 (`packages/db/migrations/D0011_public_reader.sql:12-15`)
- PSRC-05: PARTIAL — Article author inline은 반영됐지만, P-003/P-004/P-005/P-010에 `MedicalClinic` 풀 entity를 출력해 plan SoT의 `[참조] MedicalClinic`과 충돌함. PSRC-17 참조.
- PSRC-06: PARTIAL — same-origin singleton ref 검사는 추가됐지만 현재 그래프 자체가 `#website` unresolved로 실패하고, inline `@id` ref는 여전히 검사하지 않음. PSRC-16/18 참조.
- PSRC-07: PASS — P-003/P-005 빈 목록 sitemap 포함 + list `MAX(updated_at)` 반영 (`sitemap.xml/route.ts:31-39`, `:61-68`)
- PSRC-08: PASS — metadata canonical/OG URL absolute 처리 (`apps/web/src/lib/site-metadata.ts:41-54`)
- PSRC-09: PASS — `PUBLIC_SITE_ORIGIN` 우선, fallback은 request host (`apps/web/src/lib/site-url.ts:16-26`, `:32-40`)
- PSRC-10: PASS — `loadSiteInitial = cache(...)` 반영 (`apps/web/src/lib/site-initial.ts:28`)
- PSRC-11: PASS — `TIME_REGEX`, ISO date regex narrowing 반영 (`apps/web/src/lib/db-projection.ts:223-252`)
- PSRC-12: PASS — protocol-relative 외부 링크 처리 (`apps/web/src/lib/markdown.ts:139-147`)
- PSRC-13: PASS — Home에 Article teaser + Contact 섹션 존재 (`apps/web/src/app/(site)/[instanceSlug]/page.tsx:125-134` 등)
- PSRC-14: PASS — ContactPoint `@id` absolute (`apps/web/src/lib/json-ld/entities.ts:37-44`)
- PSRC-15: PASS — Legal route `siteBaseUrl(params.instanceSlug)` 사용 (`apps/web/src/app/(site)/[instanceSlug]/legal/[type]/page.tsx:44-57`)

## new blocking / major / minor (PSRC-16+)

### PSRC-16 [blocking] JSON-LD rule checker가 P-002+ 대부분 페이지에서 unresolved `#website`로 실패
`webPageEntity`는 모든 페이지에 `isPartOf: { "@id": "${siteBaseUrl}/#website" }`를 넣습니다 (`apps/web/src/lib/json-ld/entities.ts:153-161`). 하지만 `webSiteEntity`는 Home graph에만 포함됩니다 (`apps/web/src/lib/json-ld/builders.ts:21-31`). 반면 checker는 same-origin singleton ref가 graph 안에 없으면 오류 처리합니다 (`apps/web/src/lib/json-ld/__tests__/validate.ts:59-65`).

따라서 P-002/P-003/P-004/P-005/P-006/P-010/P-012/P-014의 JSON-LD checker는 `#website` 참조를 unresolved로 봅니다. plan §7 scenario #18의 통과 기준이 “자체 JSON-LD rule checker 통과”이므로 acceptance gate 실패입니다 (`docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:613`).

권장 패치: non-home graph에도 `WebSite` 풀 entity를 포함하거나, checker에서 `#website` 같은 명시 허용 ref 정책을 SoT와 함께 정의해야 합니다. 현재 구현/검증 규칙은 서로 양립하지 않습니다.

### PSRC-17 [major] P-003/P-004/P-005/P-010 `MedicalClinic` 출력 정책이 plan SoT와 불일치
plan SoT는 P-003, P-004, P-005, P-010을 `[참조] MedicalClinic`로 정의합니다 (`docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:550-554`). 현재 builders는 해당 페이지들에 location이 있으면 `medicalClinicEntity` 풀 entity를 graph에 넣습니다:
- P-003: `apps/web/src/lib/json-ld/builders.ts:62-65`
- P-004: `apps/web/src/lib/json-ld/builders.ts:83-87`
- P-005: `apps/web/src/lib/json-ld/builders.ts:104-107`
- P-010: `apps/web/src/lib/json-ld/builders.ts:147-151`

이건 scenario #10의 “P-001~P-014 별 entity 풀/참조 정합”을 깨뜨립니다 (`docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:605`). 코드 주석도 “SCHEMA_MAPPING cascade marker”라고 되어 있어 코드가 plan acceptance SoT를 따라가지 않고 별도 future cascade를 전제합니다 (`apps/web/src/lib/json-ld/builders.ts:51-54`).

### PSRC-18 [major] cross-reference checker가 inline `@id` 참조를 여전히 놓침
checker는 `Object.keys(v).length === 1`인 `{ "@id": "..." }` 형태만 검사합니다 (`apps/web/src/lib/json-ld/__tests__/validate.ts:59`). 그러나 실제 graph에는 inline minimal 객체에 `@id`가 붙는 참조가 존재합니다. 예: Article author는 같은 origin physician `@id`를 갖지만 `name/jobTitle/image`가 같이 있어 검사 대상에서 빠집니다 (`apps/web/src/lib/json-ld/entities.ts:123-131`). ItemList도 `{ "@id": ..., name: ... }` 형태입니다 (`apps/web/src/lib/json-ld/entities.ts:200-204`).

PSRC-06 patch summary의 “same-origin URL은 graph entity 필수” 기준으로는 PARTIAL입니다. 반대로 inline minimal ref를 허용하려는 정책이라면 checker 주석/plan 문구를 바꿔야 합니다. 지금은 검증 규칙이 구현 의도를 정확히 표현하지 못합니다.

## scenario 1~23 통과 여부 추론
- FAIL: #10, #18 — 위 PSRC-16/17 때문에 JSON-LD graph entity 정합 및 checker 통과 불가.
- PASS 추정: #1~9, #11~17, #19~23 — RLS/route/sitemap/robots/metadata/admin-prefix/typecheck 관점에서 코드상 큰 차단은 보이지 않음. 단 실제 DB fixture 기반 LOCAL_PASS 스크립트는 별도 실행되지 않았습니다.

## acceptance precondition (PSR-CASCADE-01b) 점검
- PSR-CASCADE-01b: PASS
- 근거: root redirect `/admin/${result.slug}` (`apps/web/src/app/page.tsx:52-57`), sign-in consume redirect `/admin/${membershipResult.slug}` (`apps/web/src/app/sign-in/consume/route.ts:177-178`), admin actions `revalidatePath('/admin/...')` 반영 (`doctors/actions.ts:158-166`, `treatments/actions.ts:156-164`, `articles/actions.ts:193-200`, `clinic-profile/actions.ts:426-427`), stale admin import도 제거됨.


 succeeded in 543ms:
apps/web/src\seed.ts:1:// @glitzy/web/seed — operator + instance + membership bootstrap (Plan v1.0 § 7.1)
apps/web/src\seed.ts:34:      "usage: pnpm --filter @glitzy/web seed --email=<email> --display-name=<name> --instance-slug=<slug> --instance-name=<name>",
apps/web/src\seed.ts:40:    console.error("[seed] instance-slug 형식 오류: 3~64자, 소문자/숫자/하이픈 (^[a-z0-9][a-z0-9-]{2,63}$)");
apps/web/src\seed.ts:44:    console.error("[seed] display-name 길이 오류: 1~200자");
apps/web/src\seed.ts:48:    console.error("[seed] instance-name 길이 오류: 1~200자");
apps/web/src\seed.ts:66:    // cycle3-code WEB-49: pg_advisory_xact_lock 으로 동시 seed 실행 직렬화
apps/web/src\seed.ts:164:      // 5) seed audit — audit_event (audit_log 는 instance_id NOT NULL)
apps/web/src\seed.ts:168:          'seed-completed',
apps/web/src\seed.ts:199:  console.error("[seed] failed", err);
apps/web/src\lib\action-context.ts:32:  if (!signedToken) redirect("/sign-in");
apps/web/src\lib\action-context.ts:42:    redirect(`/sign-in/cleanup?reason=${reason}`);
apps/web/src\lib\action-context.ts:50:    redirect("/sign-in/cleanup?reason=session-not-found");
apps/web/src\lib\action-context.ts:59: * Next.js App Router 의 redirect()/notFound() 가 throw 하는 control-flow error 판별.
apps/web/src\app\page.tsx:17:    redirect("/sign-in");
apps/web/src\app\page.tsx:32:    redirect(`/sign-in/cleanup?reason=${reason}`);
apps/web/src\app\page.tsx:40:    redirect("/sign-in/cleanup?reason=session-not-found");
apps/web/src\app\page.tsx:48:    redirect("/sign-in/cleanup?reason=user-inactive");
apps/web/src\app\page.tsx:52:  // PSR-CASCADE-01b: 어드민 URL `/admin/<slug>/...` prefix 격상 (PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1)
apps/web/src\app\page.tsx:55:    redirect("/sign-in?reason=no-active-membership");
apps/web/src\app\page.tsx:57:  redirect(`/admin/${result.slug}`);
apps/web/src\components\dev\MockMailbox.tsx:29:              href={`/sign-in/consume?identifier=${encodeURIComponent(entry.to)}&token=${encodeURIComponent(entry.tokenPlain)}`}
apps/web/src\components\site\Breadcrumb.tsx:15:              <Link href={item.href} className="hover:text-fg-default">{item.label}</Link>
apps/web/src\lib\markdown.ts:122:  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => `<a href="${url}">${label}</a>`);
apps/web/src\lib\markdown.ts:124:  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
apps/web/src\lib\markdown.ts:126:  out = out.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
apps/web/src\lib\markdown.ts:128:  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
apps/web/src\lib\markdown.ts:134:    .replace(/&/g, "&amp;")
apps/web/src\lib\markdown.ts:135:    .replace(/</g, "&lt;")
apps/web/src\lib\markdown.ts:136:    .replace(/>/g, "&gt;");
apps/web/src\app\sign-out\route.ts:77:  const res = NextResponse.redirect(new URL("/sign-in", req.url), { status: 303 });
apps/web/src\lib\page-context.ts:41:  if (!signedToken) redirect("/sign-in");
apps/web/src\lib\page-context.ts:51:    redirect(`/sign-in/cleanup?reason=${reason}`);
apps/web/src\lib\page-context.ts:59:    redirect("/sign-in/cleanup?reason=session-not-found");
apps/web/src\lib\page-context.ts:70:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\components\forms\ClinicProfileForm.tsx:14:import type { SaveResult } from "@/app/(admin)/admin/[instanceSlug]/clinic-profile/actions";
apps/web/src\app\(admin)\layout.tsx:14:    redirect("/sign-in");
apps/web/src\app\(admin)\layout.tsx:23:    redirect(`/sign-in/cleanup?reason=${reason}`);
apps/web/src\app\api\health\route.ts:16:    // cycle1-code WEB-15: systemActorPresent=false 면 seed precondition 실패 → 503
apps/web/src\app\api\health\route.ts:23:          error: "시스템 액터 미존재 — 먼저 `pnpm web:seed --email=… --display-name=… --instance-slug=… --instance-name=…` 실행",
apps/web/src\app\sign-in\actions.ts:22:    redirect("/sign-in?reason=magic-link-invalid");
apps/web/src\app\sign-in\actions.ts:33:      redirect(`/sign-in?reason=${err.reason}`);
apps/web/src\app\sign-in\actions.ts:54:    redirect("/sign-in?sent=1");
apps/web/src\app\sign-in\actions.ts:67:  redirect("/sign-in?sent=1");
apps/web/src\components\site\Hero.tsx:17:            href={cta.targetUrl}
apps/web/src\lib\json-ld\entities.ts:204:  return md.replace(/[#*_`>]/g, "").replace(/\s+/g, " ").trim();
apps/web/src\components\site\DoctorCard.tsx:7:      href={`${baseHref}/doctors/${doctor.slug}`}
apps/web/src\components\site\TreatmentCard.tsx:7:      href={`${baseHref}/treatments/${treatment.slug}`}
apps/web/src\components\site\ReservationChannels.tsx:24:          href={c.targetUrl}
apps/web/src\components\site\SiteHeader.tsx:13:        <Link href={base} className="flex items-center gap-3" aria-label={`${initial.clinic.name} 홈`}>
apps/web/src\components\site\SiteHeader.tsx:22:            <li><Link href={`${base}/about`} className="hover:text-fg-default">소개</Link></li>
apps/web/src\components\site\SiteHeader.tsx:23:            <li><Link href={`${base}/doctors`} className="hover:text-fg-default">의료진</Link></li>
apps/web/src\components\site\SiteHeader.tsx:24:            <li><Link href={`${base}/treatments`} className="hover:text-fg-default">진료</Link></li>
apps/web/src\components\site\SiteHeader.tsx:25:            <li><Link href={`${base}/contact`} className="hover:text-fg-default">연락처</Link></li>
apps/web/src\components\site\SiteHeader.tsx:26:            <li><Link href={`${base}/locations/main`} className="hover:text-fg-default">위치</Link></li>
apps/web/src\components\site\SiteHeader.tsx:31:            href={cta.targetUrl}
apps/web/src\lib\site-meta-fetch.ts:334:    const noUserInfo = trimmed.replace(/^[^/]*@/, "");
apps/web/src\app\sign-in\cleanup\route.ts:40:  const res = NextResponse.redirect(new URL(`/sign-in?reason=${reason}`, req.url));
apps/web/src\app\sign-in\consume\route.ts:52:    return NextResponse.redirect(new URL("/sign-in?reason=magic-link-invalid", req.url));
apps/web/src\app\sign-in\consume\route.ts:67:      return NextResponse.redirect(new URL(`/sign-in?reason=${err.reason}`, req.url));
apps/web/src\app\sign-in\consume\route.ts:82:    return NextResponse.redirect(new URL("/sign-in?reason=user-inactive", req.url));
apps/web/src\app\sign-in\consume\route.ts:93:    return NextResponse.redirect(new URL("/sign-in?reason=user-inactive", req.url));
apps/web/src\app\sign-in\consume\route.ts:110:      return NextResponse.redirect(new URL(`/sign-in?reason=${err.reason}`, req.url));
apps/web/src\app\sign-in\consume\route.ts:125:    return NextResponse.redirect(new URL("/sign-in?reason=no-active-membership", req.url));
apps/web/src\app\sign-in\consume\route.ts:146:    return NextResponse.redirect(new URL("/sign-in?reason=no-active-membership", req.url));
apps/web/src\app\sign-in\consume\route.ts:162:    return NextResponse.redirect(new URL("/sign-in?reason=session-not-found", req.url));
apps/web/src\app\sign-in\consume\route.ts:177:  // 6) cookie set + redirect — PSR-CASCADE-01b: admin URL `/admin/<slug>` prefix 격상
apps/web/src\app\sign-in\consume\route.ts:178:  const res = NextResponse.redirect(new URL(`/admin/${membershipResult.slug}`, req.url));
apps/web/src\app\(site)\[instanceSlug]\contact\page.tsx:56:          {loc.telephone ? <div><dt className="text-fg-muted">대표 전화</dt><dd className="font-medium text-fg-default"><a href={`tel:${loc.telephone}`}>{loc.telephone}</a></dd></div> : null}
apps/web/src\app\(site)\[instanceSlug]\contact\page.tsx:57:          {loc.email ? <div><dt className="text-fg-muted">이메일</dt><dd className="font-medium text-fg-default"><a href={`mailto:${loc.email}`}>{loc.email}</a></dd></div> : null}
apps/web/src\lib\site-url.ts:20:    return `${trustedOrigin.replace(/\/$/, "")}/${instanceSlug}`;
apps/web/src\lib\site-url.ts:35:    return trustedOrigin.replace(/\/$/, "");
apps/web/src\app\(site)\[instanceSlug]\page.tsx:89:            <Link href={`${baseHref}/doctors`} className="text-sm text-brand-primary hover:text-brand-primary-hover">전체 보기 →</Link>
apps/web/src\app\(site)\[instanceSlug]\page.tsx:101:            <Link href={`${baseHref}/treatments`} className="text-sm text-brand-primary hover:text-brand-primary-hover">전체 보기 →</Link>
apps/web/src\app\(site)\[instanceSlug]\page.tsx:117:                <Link href={`${baseHref}/insights/general/${a.slug}`} className="font-medium text-fg-default hover:text-brand-primary">{a.headline}</Link>
apps/web/src\app\(site)\[instanceSlug]\page.tsx:129:            <Link href={`${baseHref}/contact`} className="text-sm text-brand-primary hover:text-brand-primary-hover">상세 보기 →</Link>
apps/web/src\app\(site)\[instanceSlug]\page.tsx:134:              <p className="mt-2 text-sm text-fg-muted">대표 전화: <a href={`tel:${initial.locationMain.telephone}`} className="text-brand-primary hover:text-brand-primary-hover">{initial.locationMain.telephone}</a></p>
apps/web/src\app\(admin)\admin\[instanceSlug]\page.tsx:75:                href={`/admin/${params.instanceSlug}/clinic-profile`}
apps/web/src\app\(admin)\admin\[instanceSlug]\page.tsx:85:                href={`/admin/${params.instanceSlug}/clinic-profile`}
apps/web/src\app\(admin)\admin\[instanceSlug]\page.tsx:96:            href={`/admin/${params.instanceSlug}/doctors`}
apps/web/src\app\(admin)\admin\[instanceSlug]\page.tsx:102:            href={`/admin/${params.instanceSlug}/treatments`}
apps/web/src\app\(admin)\admin\[instanceSlug]\page.tsx:108:            href={`/admin/${params.instanceSlug}/articles`}
apps/web/src\app\(admin)\admin\[instanceSlug]\page.tsx:120:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\page.tsx:136:      href={href}
apps/web/src\app\(site)\[instanceSlug]\robots.txt\route.ts:19:Disallow: /admin/
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx:244:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(site)\[instanceSlug]\doctors\[slug]\page.tsx:29:  const description = doctor.bio ? doctor.bio.replace(/[#*_`>]/g, "").slice(0, 160) : `${initial.clinic.name} 의료진 ${doctor.name}`;
apps/web/src\app\(site)\[instanceSlug]\doctors\[slug]\page.tsx:73:    data.doctor.bio ? data.doctor.bio.replace(/[#*_`>]/g, "").slice(0, 160) : `${initial.clinic.name} 의료진 ${data.doctor.name}`,
apps/web/src\app\(site)\[instanceSlug]\doctors\[slug]\page.tsx:103:                  <Link href={`${base}/insights/general/${a.slug}`} className="font-medium text-brand-primary hover:text-brand-primary-hover">
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:15:import { revalidatePath } from "next/cache";
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:96:  if (!signedToken) redirect("/sign-in");
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:106:    redirect(`/sign-in/cleanup?reason=${reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:113:    redirect("/sign-in/cleanup?reason=session-not-found");
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:426:    revalidatePath(`/admin/${instanceSlug}/clinic-profile`);
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:427:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts:455:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:6:import { revalidatePath } from "next/cache";
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:193:      revalidatePath(`/admin/${instanceSlug}/articles`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:194:      revalidatePath(`/admin/${instanceSlug}/articles/${txResult.slug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:196:        revalidatePath(`/admin/${instanceSlug}/articles/${originalSlug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:198:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:200:        redirect(`/admin/${instanceSlug}/articles/${txResult.slug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:214:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:256:    revalidatePath(`/admin/${instanceSlug}/articles`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:257:    revalidatePath(`/admin/${instanceSlug}/articles/${slug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:258:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:259:    redirect(`/admin/${instanceSlug}/articles`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:264:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts:121:  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\page.tsx:48:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\page.tsx:61:        <Link href={`/admin/${params.instanceSlug}/articles/new`} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\page.tsx:93:                  <Link href={`/admin/${params.instanceSlug}/articles/${r.slug}`} className="text-xs text-blue-700 underline">편집</Link>
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:14:import { revalidatePath } from "next/cache";
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:158:      revalidatePath(`/admin/${instanceSlug}/doctors`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:159:      revalidatePath(`/admin/${instanceSlug}/doctors/${txResult.slug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:162:        revalidatePath(`/admin/${instanceSlug}/doctors/${originalSlug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:164:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:166:        redirect(`/admin/${instanceSlug}/doctors/${txResult.slug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:183:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:254:    revalidatePath(`/admin/${instanceSlug}/doctors`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:255:    revalidatePath(`/admin/${instanceSlug}/doctors/${slug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:256:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:257:    redirect(`/admin/${instanceSlug}/doctors`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts:263:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(site)\[instanceSlug]\locations\[slug]\page.tsx:60:          {loc.telephone ? <div><dt className="text-fg-muted">전화</dt><dd className="font-medium text-fg-default"><a href={`tel:${loc.telephone}`}>{loc.telephone}</a></dd></div> : null}
apps/web/src\app\(site)\[instanceSlug]\locations\[slug]\page.tsx:61:          {loc.email ? <div><dt className="text-fg-muted">이메일</dt><dd className="font-medium text-fg-default"><a href={`mailto:${loc.email}`}>{loc.email}</a></dd></div> : null}
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:8:import { revalidatePath } from "next/cache";
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:156:      revalidatePath(`/admin/${instanceSlug}/treatments`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:157:      revalidatePath(`/admin/${instanceSlug}/treatments/${txResult.slug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:159:        revalidatePath(`/admin/${instanceSlug}/treatments/${originalSlug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:161:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:163:        redirect(`/admin/${instanceSlug}/treatments/${txResult.slug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:177:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:221:    revalidatePath(`/admin/${instanceSlug}/treatments`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:222:    revalidatePath(`/admin/${instanceSlug}/treatments/${slug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:223:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:224:    redirect(`/admin/${instanceSlug}/treatments`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts:229:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\page.tsx:45:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\page.tsx:59:          href={`/admin/${params.instanceSlug}/doctors/new`}
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\page.tsx:93:                  <Link href={`/admin/${params.instanceSlug}/doctors/${r.slug}`} className="text-xs text-blue-700 underline">
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\page.tsx:45:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\page.tsx:58:        <Link href={`/admin/${params.instanceSlug}/treatments/new`} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\page.tsx:92:                  <Link href={`/admin/${params.instanceSlug}/treatments/${r.slug}`} className="text-xs text-blue-700 underline">
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\new\page.tsx:44:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\new\page.tsx:58:        <Link href={`/admin/${params.instanceSlug}/articles`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:84:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:101:        <Link href={`/admin/${params.instanceSlug}/articles`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\new\page.tsx:28:        <Link href={`/admin/${params.instanceSlug}/treatments`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\new\page.tsx:28:        <Link href={`/admin/${params.instanceSlug}/doctors`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\[slug]\page.tsx:69:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\[slug]\page.tsx:86:        <Link href={`/admin/${params.instanceSlug}/doctors`} className="text-sm text-slate-600 hover:underline">
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\[slug]\page.tsx:68:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\[slug]\page.tsx:85:        <Link href={`/admin/${params.instanceSlug}/treatments`} className="text-sm text-slate-600 hover:underline">← 목록</Link>

codex
cycle 2의 세 지적 자체는 코드상 반영되어 보입니다. 마지막으로 타입체크를 직접 재확인하고, checker가 대표 그래프를 실제로 통과시키는지 간단한 정적/런타임 근거를 확보하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'pnpm --filter @glitzy/web typecheck' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content apps/web/src/lib/json-ld/builders.ts | ForEach-Object { if($i -ge 45 -and $i -le 145){ '"'{0,4}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content apps/web/src/lib/json-ld/__tests__/validate.ts | ForEach-Object { if($i -ge 17 -and $i -le 105){ '"'{0,4}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=1; Get-Content apps/web/src/lib/json-ld/entities.ts | ForEach-Object { if(($i -ge 120 -and $i -le 170) -or ($i -ge 190 -and $i -le 205)){ '"'{0,4}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 677ms:
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
  67:       doctors.map((d) => ({ name: d.name, itemId: `${ctx.siteBaseUrl}/doctors/${d.slug}#physician` })),
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
 105:       treatments.map((t) => ({ name: t.name, itemId: `${ctx.siteBaseUrl}/treatments/${t.slug}#procedure` })),
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

 succeeded in 659ms:
  17: // PSRC-06 / PSRC-16 / PSRC-18 patch:
  18: //   1. inline minimal 객체 (`@id` + `@type` + 추가 필드) 는 self-contained inline 으로 인정 (검사 제외).
  19: //   2. pure ref (`@id` 만 있는 객체) 는 graph entity 또는 cross-page reference allowlist 또는 외부 origin URL.
  20: //   3. cross-page reference allowlist: `${siteBaseUrl}/#organization` · `/#website` · `/#clinic` —
  21: //      SCHEMA_MAPPING § 2.5 "참조만" 페이지의 cross-page ref 패턴 (PSRC-16 patch).
  22: 
  23: const CROSS_PAGE_REF_FRAGMENTS = new Set(["organization", "website", "clinic"]);
  24: 
  25: function isCrossPageRef(ref: string, siteOrigin: string | null): boolean {
  26:   if (!siteOrigin) return false;
  27:   try {
  28:     const u = new URL(ref);
  29:     if (u.origin !== siteOrigin) return false;
  30:     if (!u.hash.startsWith("#")) return false;
  31:     return CROSS_PAGE_REF_FRAGMENTS.has(u.hash.slice(1));
  32:   } catch {
  33:     return false;
  34:   }
  35: }
  36: 
  37: export function validateJsonLdGraph(graph: unknown, opts: { siteBaseUrl?: string } = {}): ValidationResult {
  38:   const errors: string[] = [];
  39: 
  40:   // (1)(2) shape
  41:   if (typeof graph !== "object" || graph === null) return { ok: false, errors: ["graph must be object"] };
  42:   const g = graph as Record<string, unknown>;
  43:   if (g["@context"] !== "https://schema.org") errors.push("@context must be https://schema.org");
  44:   const arr = g["@graph"];
  45:   if (!Array.isArray(arr)) {
  46:     return { ok: false, errors: [...errors, "@graph must be array"] };
  47:   }
  48: 
  49:   const siteOrigin = opts.siteBaseUrl ? tryOrigin(opts.siteBaseUrl) : null;
  50: 
  51:   // (3) @id 유일
  52:   const ids = new Set<string>();
  53:   const idMap = new Map<string, JsonLdEntity>();
  54:   for (const ent of arr) {
  55:     if (typeof ent !== "object" || ent === null) {
  56:       errors.push("entity must be object");
  57:       continue;
  58:     }
  59:     const e = ent as Record<string, unknown>;
  60:     if (typeof e["@type"] !== "string") errors.push(`entity missing @type`);
  61:     if (typeof e["@id"] !== "string") errors.push(`entity missing @id`);
  62:     if (typeof e["@id"] === "string") {
  63:       if (ids.has(e["@id"])) errors.push(`duplicate @id: ${e["@id"]}`);
  64:       ids.add(e["@id"]);
  65:       idMap.set(e["@id"], e as JsonLdEntity);
  66:     }
  67:   }
  68: 
  69:   // (4) cross-reference — pure ref `{ "@id": "..." }` 만 검사 (inline `{@id, @type, ...}` 객체는 self-contained).
  70:   //   PSRC-18 patch: `@type` 존재 시 inline minimal entity 로 간주 (검사 제외, recurse 만).
  71:   //   PSRC-16 patch: cross-page reference allowlist (`#organization`/`#website`/`#clinic`) 는 graph entity 미존재 OK.
  72:   function checkRefs(value: unknown, path: string): void {
  73:     if (typeof value !== "object" || value === null) return;
  74:     if (Array.isArray(value)) {
  75:       value.forEach((v, i) => checkRefs(v, `${path}[${i}]`));
  76:       return;
  77:     }
  78:     const v = value as Record<string, unknown>;
  79:     const hasId = typeof v["@id"] === "string";
  80:     const hasType = typeof v["@type"] === "string";
  81:     if (hasId && !hasType) {
  82:       // pure ref
  83:       const ref = v["@id"] as string;
  84:       if (!ids.has(ref) && !isCrossPageRef(ref, siteOrigin)) {
  85:         const refOrigin = tryOrigin(ref);
  86:         if (refOrigin && siteOrigin && refOrigin === siteOrigin) {
  87:           errors.push(`unresolved same-origin reference at ${path}: ${ref}`);
  88:         } else if (refOrigin === null) {
  89:           errors.push(`unresolved reference at ${path}: ${ref}`);
  90:         }
  91:         // 외부 origin URL → dereferenceable 예외 (통과)
  92:       }
  93:     }
  94:     for (const [k, vv] of Object.entries(v)) {
  95:       if (k === "@type" || k === "@id") continue;
  96:       checkRefs(vv, `${path}.${k}`);
  97:     }
  98:   }
  99:   arr.forEach((ent, i) => checkRefs(ent, `@graph[${i}]`));
 100: 
 101:   return errors.length === 0 ? { ok: true } : { ok: false, errors };
 102: }
 103: 
 104: function tryOrigin(url: string): string | null {
 105:   try {

 succeeded in 677ms:
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
 190:   listId: string,
 191: ): JsonLdEntity {
 192:   return {
 193:     "@type": "ItemList",
 194:     "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#${listId}`,
 195:     itemListElement: items.map((it, i) => ({
 196:       "@type": "ListItem",
 197:       position: i + 1,
 198:       item: { "@id": it.itemId, name: it.name },
 199:     })),
 200:   };
 201: }
 202: 
 203: function stripMarkdown(md: string): string {
 204:   return md.replace(/[#*_`>]/g, "").replace(/\s+/g, " ").trim();
 205: }

 succeeded in 2122ms:

> @glitzy/web@0.1.0 typecheck C:\Users\assag\solution\website-exposure\apps\web
> tsc --noEmit -p tsconfig.json


codex
한 가지 회귀가 보입니다. checker 주석은 “pure ref = `@id`만”이라고 하지만 구현은 “`@type` 없는 모든 `@id` 객체”를 pure ref로 처리해서, 목록 페이지의 `item: { @id, name }`이 실제 데이터가 있을 때 unresolved로 실패합니다. 간단한 재현도 확인하겠습니다. 

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "@'
import { validateJsonLdGraph } from './apps/web/src/lib/json-ld/__tests__/validate.ts';
const siteBaseUrl = 'https://example.com/demo';
const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': "'`${siteBaseUrl}/#organization`, name: '"'Demo' },
    { '@type': 'WebPage', '@id': "'`${siteBaseUrl}/doctors#webpage`, isPartOf: { '"'@id': "'`${siteBaseUrl}/#website` } },
    { '"'@type': 'BreadcrumbList', '@id': "'`${siteBaseUrl}/doctors#breadcrumb`, itemListElement: [] },
    { '"'@type': 'ItemList', '@id': "'`${siteBaseUrl}/doctors#doctors`, itemListElement: [
      { '"'@type': 'ListItem', position: 1, item: { '@id': "'`${siteBaseUrl}/doctors/hong#physician`, name: '"'홍길동' } }
    ] }
  ]
};
console.log(validateJsonLdGraph(graph, { siteBaseUrl }));
'@ | pnpm exec tsx --tsconfig apps/web/tsconfig.json -" in C:\Users\assag\solution\website-exposure
2026-05-18T05:05:31.678620Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 1 seconds
Output:
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "tsx" not found
'tsx' is not recognized as an internal or external command,
operable program or batch file.

 exited 1 in 1041ms:
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "tsx" not found
'tsx' is not recognized as an internal or external command,
operable program or batch file.

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "@'
import { validateJsonLdGraph } from './src/lib/json-ld/__tests__/validate.ts';
const siteBaseUrl = 'https://example.com/demo';
const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': "'`${siteBaseUrl}/#organization`, name: '"'Demo' },
    { '@type': 'WebPage', '@id': "'`${siteBaseUrl}/doctors#webpage`, isPartOf: { '"'@id': "'`${siteBaseUrl}/#website` } },
    { '"'@type': 'BreadcrumbList', '@id': "'`${siteBaseUrl}/doctors#breadcrumb`, itemListElement: [] },
    { '"'@type': 'ItemList', '@id': "'`${siteBaseUrl}/doctors#doctors`, itemListElement: [
      { '"'@type': 'ListItem', position: 1, item: { '@id': "'`${siteBaseUrl}/doctors/hong#physician`, name: '"'홍길동' } }
    ] }
  ]
};
console.log(validateJsonLdGraph(graph, { siteBaseUrl }));
'@ | pnpm --filter @glitzy/web exec tsx -" in C:\Users\assag\solution\website-exposure
2026-05-18T05:05:43.844393Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 1.3 seconds
Output:
undefined
C:\Users\assag\solution\website-exposure\apps\web:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "tsx" not found
node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

Error: spawn EPERM
    at ChildProcess.spawn (node:internal/child_process:421:11)
    at Object.spawn (node:child_process:796:9)
    at ensureServiceIsRunning (C:\Users\assag\solution\website-exposure\node_modules\.pnpm\esbuild@0.28.0\node_modules\esbuild\lib\main.js:2268:29)
    at startSyncServiceWorker (C:\Users\assag\solution\website-exposure\node_modules\.pnpm\esbuild@0.28.0\node_modules\esbuild\lib\main.js:2474:19)
    at Object.<anonymous> (C:\Users\assag\solution\website-exposure\node_modules\.pnpm\esbuild@0.28.0\node_modules\esbuild\lib\main.js:2515:3)
    at Module._compile (node:internal/modules/cjs/loader:1761:14)
    at Object..js (node:internal/modules/cjs/loader:1893:10)
    at Module.load (node:internal/modules/cjs/loader:1481:32)
    at Module._load (node:internal/modules/cjs/loader:1300:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14) {
  errno: -4048,
  code: 'EPERM',
  syscall: 'spawn',
  name: 'TransformError'
}

Node.js v24.12.0

 exited 1 in 1300ms:
undefined
C:\Users\assag\solution\website-exposure\apps\web:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "tsx" not found
node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

Error: spawn EPERM
    at ChildProcess.spawn (node:internal/child_process:421:11)
    at Object.spawn (node:child_process:796:9)
    at ensureServiceIsRunning (C:\Users\assag\solution\website-exposure\node_modules\.pnpm\esbuild@0.28.0\node_modules\esbuild\lib\main.js:2268:29)
    at startSyncServiceWorker (C:\Users\assag\solution\website-exposure\node_modules\.pnpm\esbuild@0.28.0\node_modules\esbuild\lib\main.js:2474:19)
    at Object.<anonymous> (C:\Users\assag\solution\website-exposure\node_modules\.pnpm\esbuild@0.28.0\node_modules\esbuild\lib\main.js:2515:3)
    at Module._compile (node:internal/modules/cjs/loader:1761:14)
    at Object..js (node:internal/modules/cjs/loader:1893:10)
    at Module.load (node:internal/modules/cjs/loader:1481:32)
    at Module._load (node:internal/modules/cjs/loader:1300:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14) {
  errno: -4048,
  code: 'EPERM',
  syscall: 'spawn',
  name: 'TransformError'
}

Node.js v24.12.0

codex
# PUBLIC_SITE_RENDER code v1.0 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=1 major=1 minor=0 (총 2)
- closeableAfterPatch: false
- 수렴 추세: cycle1=15 → cycle2=3 → cycle3=2

## cycle 2 patch 검증
- PSRC-16: PASS
  - `#website/#organization/#clinic` allowlist가 추가되어 P-002+의 `WebPage.isPartOf #website` dangling 문제는 해소됨.
- PSRC-17: PASS
  - P-003/P-004/P-005/P-010에서 `MedicalClinic` 풀 entity 제거 확인. § 2.5의 `[참조] MedicalClinic` 정책과 정합.
- PSRC-18: PASS
  - `@type` 있는 inline `@id` 객체는 self-contained inline으로 처리되어 Article author inline `Physician`은 통과 방향.

## new findings (PSRC-19+)

### PSRC-19 [blocking] List page의 `ItemList.item { @id, name }`이 checker에서 unresolved same-origin ref로 실패
[itemListEntity](C:/Users/assag/solution/website-exposure/apps/web/src/lib/json-ld/entities.ts:195)는 목록 item을 `{ "@id": it.itemId, name: it.name }` 형태로 출력합니다. 그런데 checker는 `@id`가 있고 `@type`이 없으면 extra field 유무와 관계없이 pure ref로 검사합니다: [validate.ts](C:/Users/assag/solution/website-exposure/apps/web/src/lib/json-ld/__tests__/validate.ts:79).

그래서 P-003 doctors list와 P-005 treatments list에 실제 item이 1개라도 있으면 `.../doctors/{slug}#physician`, `.../treatments/{slug}#procedure`가 graph 안에 없고 allowlist fragment도 아니라 unresolved same-origin reference가 됩니다. scenario #18 자체 rule checker 통과 추론이 깨집니다.

패치 방향: `item`을 inline self-contained로 만들려면 `@type: "Physician"` / `"MedicalProcedure"`를 함께 넣거나, 정말 pure ref 정책이면 `name`을 제거하고 checker의 “pure ref” 조건을 `Object.keys(v).length === 1`로 제한해야 합니다.

### PSRC-20 [major] cross-page allowlist가 path-based tenant base를 보지 않고 origin만 봄
SCHEMA_MAPPING v0.1 path-based SoT는 `https://<host>/<instanceSlug>/#website` 패턴입니다. 현재 [isCrossPageRef](C:/Users/assag/solution/website-exposure/apps/web/src/lib/json-ld/__tests__/validate.ts:25)는 `u.origin === siteOrigin`만 확인해서 같은 host의 다른 path tenant `https://example.com/other/#website`도 통과시킵니다.

실제 builder는 현재 올바른 `siteBaseUrl`을 만들지만, checker가 scenario #18의 cross-reference 무결성을 정확히 표현하지 못합니다. `origin` 대신 `new URL(siteBaseUrl).pathname`까지 포함한 현재 tenant root와 fragment를 함께 비교해야 합니다.

## acceptance precondition (PSR-CASCADE-01b)
- PSR-CASCADE-01b: PASS
- root redirect, sign-in consume redirect, admin action `revalidatePath('/admin/...')`, 4개 caller 시그니처 cascade 모두 현재 범위에서 정합.
- `pnpm --filter @glitzy/web typecheck`: PASS

## acceptance 판정
- closeableAfterPatch=false
- PSRC-19는 실제 데이터가 있는 P-003/P-005에서 scenario #18을 실패시키는 acceptance blocker입니다.
tokens used
111,618
# PUBLIC_SITE_RENDER code v1.0 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=1 major=1 minor=0 (총 2)
- closeableAfterPatch: false
- 수렴 추세: cycle1=15 → cycle2=3 → cycle3=2

## cycle 2 patch 검증
- PSRC-16: PASS
  - `#website/#organization/#clinic` allowlist가 추가되어 P-002+의 `WebPage.isPartOf #website` dangling 문제는 해소됨.
- PSRC-17: PASS
  - P-003/P-004/P-005/P-010에서 `MedicalClinic` 풀 entity 제거 확인. § 2.5의 `[참조] MedicalClinic` 정책과 정합.
- PSRC-18: PASS
  - `@type` 있는 inline `@id` 객체는 self-contained inline으로 처리되어 Article author inline `Physician`은 통과 방향.

## new findings (PSRC-19+)

### PSRC-19 [blocking] List page의 `ItemList.item { @id, name }`이 checker에서 unresolved same-origin ref로 실패
[itemListEntity](C:/Users/assag/solution/website-exposure/apps/web/src/lib/json-ld/entities.ts:195)는 목록 item을 `{ "@id": it.itemId, name: it.name }` 형태로 출력합니다. 그런데 checker는 `@id`가 있고 `@type`이 없으면 extra field 유무와 관계없이 pure ref로 검사합니다: [validate.ts](C:/Users/assag/solution/website-exposure/apps/web/src/lib/json-ld/__tests__/validate.ts:79).

그래서 P-003 doctors list와 P-005 treatments list에 실제 item이 1개라도 있으면 `.../doctors/{slug}#physician`, `.../treatments/{slug}#procedure`가 graph 안에 없고 allowlist fragment도 아니라 unresolved same-origin reference가 됩니다. scenario #18 자체 rule checker 통과 추론이 깨집니다.

패치 방향: `item`을 inline self-contained로 만들려면 `@type: "Physician"` / `"MedicalProcedure"`를 함께 넣거나, 정말 pure ref 정책이면 `name`을 제거하고 checker의 “pure ref” 조건을 `Object.keys(v).length === 1`로 제한해야 합니다.

### PSRC-20 [major] cross-page allowlist가 path-based tenant base를 보지 않고 origin만 봄
SCHEMA_MAPPING v0.1 path-based SoT는 `https://<host>/<instanceSlug>/#website` 패턴입니다. 현재 [isCrossPageRef](C:/Users/assag/solution/website-exposure/apps/web/src/lib/json-ld/__tests__/validate.ts:25)는 `u.origin === siteOrigin`만 확인해서 같은 host의 다른 path tenant `https://example.com/other/#website`도 통과시킵니다.

실제 builder는 현재 올바른 `siteBaseUrl`을 만들지만, checker가 scenario #18의 cross-reference 무결성을 정확히 표현하지 못합니다. `origin` 대신 `new URL(siteBaseUrl).pathname`까지 포함한 현재 tenant root와 fragment를 함께 비교해야 합니다.

## acceptance precondition (PSR-CASCADE-01b)
- PSR-CASCADE-01b: PASS
- root redirect, sign-in consume redirect, admin action `revalidatePath('/admin/...')`, 4개 caller 시그니처 cascade 모두 현재 범위에서 정합.
- `pnpm --filter @glitzy/web typecheck`: PASS

## acceptance 판정
- closeableAfterPatch=false
- PSRC-19는 실제 데이터가 있는 P-003/P-005에서 scenario #18을 실패시키는 acceptance blocker입니다.
