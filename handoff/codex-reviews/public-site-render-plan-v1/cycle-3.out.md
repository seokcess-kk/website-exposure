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
session id: 019e393a-83a3-7f13-b21d-c27da69d497b
--------
user
You are reviewing **cycle 3** of `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.3. Cycle 2 had **7 findings** (2 blocking + 4 major + 1 minor). All were patched. Verify convergence and surface remaining issues.

## Cycle 2 findings recap

| # | severity | title | patch summary |
|---|---|---|---|
| PSR-22 | blocking | robots.txt SoT 불일치 | starter 가 SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot B Allow, Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allow` 정정 |
| PSR-23 | major | themeColor 출처 | `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화) — SEARCH_STANDARDIZATION § 2.1 정합 |
| PSR-24 | blocking | admin URL cascade 미적용 | PSR-CASCADE-01 a/b 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴 |
| PSR-25 | major | manifest D0011 미적용 | `packages/migrations-runner/src/manifest.ts` 에 D0011 entry 추가 (10단계) |
| PSR-26 | major | Footer 법적 링크 broken | v0.1 단계 숨김 + 합류 후 동적 추가 |
| PSR-27 | minor | pgbouncer 경로 stale | `apps/spike-a/pgbouncer/userlist.txt` 정확 경로 |
| PSR-28 | major | root layout className 불일치 | plan acceptance precondition 명시 — Tailwind v0.2 + globals.css + root layout className 변경 동시 적용 |

추가 cascade 실 적용:
- `docs/core/SCHEMA_MAPPING.md` § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02)
- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03)

## Re-review scope (cycle 3)

### Patch 가 적용된 파일
- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.3
- `docs/core/SCHEMA_MAPPING.md` § 1.2 (신규 path-based 표 + entity continuity)
- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 (신규 SSR 재사용 표)
- `packages/migrations-runner/src/manifest.ts` (D0011 entry 추가)

### 기존 검증 SoT
- `docs/core/PAGE_TYPES.md`, `docs/core/SCHEMA_MAPPING.md` (§ 2.5 + § 3), `docs/core/SEARCH_STANDARDIZATION.md` (§ 3.1 4계열 + § 3.3 출력), `docs/core/DESIGN_TOKENS.md`, `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1, `packages/core-content/src/schema.ts`

## What to check (cycle 3)

1. **cycle 2 patch 가 SoT 와 일관**한지:
   - PSR-22 robots.txt starter 가 SEARCH_STANDARDIZATION § 3.3 출력 예시 정확 일치 (line-by-line)
   - PSR-23 themeColor 출처가 SEARCH_STANDARDIZATION § 2.1 + DESIGN_TOKENS § 6 BrandTokens 정합
   - PSR-24 CASCADE-01 a/b 분리 의도 — LOCATION_LEGAL plan/code 분리 패턴과 정합 (LOCATION_LEGAL_PLAN.md acceptance commit 안 docs cascade 만 포함, 코드 cascade 는 별 milestone code v1.0)
   - PSR-25 manifest.ts D0011 entry 의 dependsOn / creates 정합 — validateManifest() 가 dependency 검증 PASS
   - PSR-26 Footer 법적 링크 숨김 결정의 시나리오 영향 (시나리오 8 LegalDocument 404 정합)
   - PSR-27 pgbouncer 경로 정확
   - PSR-28 root layout className acceptance precondition 명시 — § 8 작업 #14 안 명시
   - PSR-CASCADE-02 SCHEMA_MAPPING § 1.2 path-based 표 — entity continuity 전환 룰 sound
   - PSR-CASCADE-03 M0_BUILD_EXPORT_PLAN § 2.1 SSR 재사용 표 — apps/worker 구현 시 컴포넌트 재사용 정합

2. **회귀 (regression)**:
   - manifest.ts validateManifest 안 D0011 의 dependsOn ["instance", "clinic_profile", ...] 가 이전 entries 의 creates 안 모두 존재
   - SCHEMA_MAPPING § 1.2 의 v0.1 임시 표가 SoT 표 (도메인 매핑 후) 와 entity-by-entity 정합 (Organization, MedicalClinic, Physician, MedicalProcedure, Article, WebSite, WebPage 7개)
   - M0_BUILD_EXPORT_PLAN § 2.1 의 컴포넌트 위치가 plan v0.3 § 8 작업 단위와 정확히 정합

3. **acceptance precondition (PSR-CASCADE-01~05) 최종 점검**:
   - PSR-CASCADE-01a: docs/admin/ARCHITECTURE.md § 3 patch — 아직 적용 안 됨 (TBD/FAIL)
   - PSR-CASCADE-02: SCHEMA_MAPPING § 1.2 — PASS (적용)
   - PSR-CASCADE-03: M0_BUILD_EXPORT_PLAN § 2.1 — PASS (적용)
   - PSR-CASCADE-04: manifest.ts D0011 — PASS (적용)
   - PSR-CASCADE-05: pgbouncer userlist.txt — 아직 미적용 (코드 cascade) — TBD/FAIL
   - PSR-CASCADE-01b: code v1.0 cycle 분리 marker — 본 plan acceptance 의 acceptance precondition 외

4. **새 finding** (있을 경우 PSR-29+ 부터)

5. **closeableAfterPatch 신호**:
   - blocking 0 + major 0 → closeableAfterPatch=true (acceptance 신호)
   - minor 잔존이면 다음 cycle 짧게

## Output format

```
# PUBLIC_SITE_RENDER_PLAN v0.3 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: cycle1=21 (6+11+4) → cycle2=7 (2+4+1) → cycle3=N (B+M+m)

## cycle 2 patch 검증
- PSR-22 ~ PSR-28 + 추가 cascade 02·03 각각 PASS / FAIL / PARTIAL + 근거 한 줄

## new blocking / major / minor (PSR-29+)

## acceptance precondition (PSR-CASCADE-01~05) 최종 점검
- PSR-CASCADE-01a: <PASS|FAIL|TBD>
- PSR-CASCADE-01b: <plan acceptance 외 — code v1.0 cycle marker>
- PSR-CASCADE-02: <PASS|FAIL|TBD>
- PSR-CASCADE-03: <PASS|FAIL|TBD>
- PSR-CASCADE-04: <PASS|FAIL|TBD>
- PSR-CASCADE-05: <PASS|FAIL|TBD>

## 누계 통계 + acceptance 권고
- cycle 1·2·3 합산 findings: <N>
- 본 cycle 결과 plan v1.0 acceptance 가능 여부
```

cycle 2 7건이 모두 PASS 이고 새 blocking/major 0 이면 closeableAfterPatch=true. 한국어로 응답.

codex
검토 모드로 진행하겠습니다. 먼저 관련 문서와 manifest의 현재 상태를 읽고, SoT와 패치 파일 간 라인 단위 정합성을 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "PSR-22|PSR-23|PSR-24|PSR-25|PSR-26|PSR-27|PSR-28|PSR-CASCADE|robots.txt|themeColor|D0011|pgbouncer|root layout|className|Footer|legal|LegalDocument|admin|SCHEMA_MAPPING|M0_BUILD_EXPORT" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "PerplexityBot|Perplexity-User|Googlebot|Bingbot|Claude-User|Bytespider|cohere-ai|Diffbot|robots.txt|User-agent|Disallow|Allow" docs/core/SEARCH_STANDARDIZATION.md docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "D0011|validateManifest|creates|dependsOn|clinic_profile|instance" packages/migrations-runner/src/manifest.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "BrandTokens|themeColor|color.brand.primary|primary|light|dark|§ 2.1|2.1" docs/core/SEARCH_STANDARDIZATION.md docs/core/DESIGN_TOKENS.md docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' in C:\Users\assag\solution\website-exposure
 succeeded in 678ms:
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:13:- `docs/core/SEARCH_STANDARDIZATION.md` — § 2 메타 태그 표준 (theme-color · og:type 매핑) · § 3 robots.txt (aiCrawlerPolicy + 4계열 user-agent + disallowTraining starter) · § 4.3 sitemap changefreq/priority · § 5 canonical resolve.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:49:| sitemap.xml · robots.txt (cycle1 PSR-04·09 정정) | per-instance · SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` required + § 4.3 changefreq/priority SoT 정합 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:105:│     ├─ robots.txt/route.ts             -- per-instance robots
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:456:### 5.3 robots.txt — cycle1 PSR-04 정정 (PSR-SEO-08)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:458:- `apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts` — Next Route Handler.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:468:# robots.txt — auto-generated (Glitzy · SEARCH_STANDARDIZATION § 3.3 disallowTraining)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:471:User-agent: *
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:472:Disallow: /admin/
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:473:Disallow: /auth/
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:474:Disallow: /api/
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:475:Allow: /
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:477:# A. 일반 검색 색인 — Allow
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:478:User-agent: Googlebot
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:479:Allow: /
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:481:User-agent: Yeti
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:482:Allow: /
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:484:User-agent: Bingbot
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:485:Allow: /
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:487:# B. AI 검색 인덱싱·답변용 — Allow
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:488:User-agent: OAI-SearchBot
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:489:Allow: /
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:491:User-agent: PerplexityBot
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:492:Allow: /
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:494:User-agent: Claude-SearchBot
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:495:Allow: /
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:497:# C. User-triggered fetch — Allow (best-effort · § 3.1 주의)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:498:User-agent: ChatGPT-User
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:499:Allow: /
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:501:User-agent: Perplexity-User
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:502:Allow: /
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:504:User-agent: Claude-User
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:505:Allow: /
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:507:# D. AI 학습·모델 개선용 — Disallow
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:508:User-agent: GPTBot
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:509:Disallow: /
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:511:User-agent: ClaudeBot
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:512:Disallow: /
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:514:User-agent: Google-Extended
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:515:Disallow: /
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:517:User-agent: CCBot
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:518:Disallow: /
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:520:User-agent: anthropic-ai
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:521:Disallow: /
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:529:  - `allow` (= 학습 포함 전체 허용): D 계열 모두 Allow + `aiCrawlerLegalApproved: true` 필수 (fail-gate)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:530:  - `disallowAll`: B·C·D 계열 모두 Disallow (A 만 Allow)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:601:| 12 | `/<instanceSlug>/robots.txt` 응답 | SEARCH_STANDARDIZATION § 3 v0.1 starter `disallowTraining` 정합 (학습 봇 Disallow + 답변 봇 Allow + Naver Yeti Allow) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:630:| 13 | sitemap.xml + robots.txt route handler (SEARCH_STANDARDIZATION 정합) | apps/web/src/app/(site)/[instanceSlug]/{sitemap.xml,robots.txt}/route.ts |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:689:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:690:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |
docs/core/SEARCH_STANDARDIZATION.md:7:> **목적**: Core가 빌드 시 출력하는 검색 표준 산출물 — 메타 태그·robots.txt·sitemap.xml·canonical 처리·성능 기준 — 의 단독 구현 가능한 명세.
docs/core/SEARCH_STANDARDIZATION.md:19:- Core가 빌드 시 자동 생성하는 **5개 표준 산출물**: head 메타 태그·robots.txt·sitemap.xml·canonical URL·성능 budget.
docs/core/SEARCH_STANDARDIZATION.md:21:- robots.txt는 **AI 크롤러 정책을 인스턴스 단위로 명시적 결정 — `aiCrawlerPolicy` required (미설정 시 빌드 fail)**. enum: `allow | disallowTraining | disallowAll | custom`. **`allow`는 법무 승인 플래그 `aiCrawlerLegalApproved: true` 필수 (fail-gate)**, 다른 정책은 승인 기록 권장. starter template은 `disallowTraining` 제안 — 검색·답변 노출 유지하면서 학습 데이터 사용 차단.
docs/core/SEARCH_STANDARDIZATION.md:35:| robots.txt 자동 생성 | ✅ | |
docs/core/SEARCH_STANDARDIZATION.md:47:- **robots.txt**: 플레인 텍스트 — 사이트 루트 (`/robots.txt`)
docs/core/SEARCH_STANDARDIZATION.md:72:**Allowed (항상 출력) / Conditional (조건부) / Blocked (출력 안 함)** 분류:
docs/core/SEARCH_STANDARDIZATION.md:76:| `<title>` | **Allowed** (모든 페이지 필수) | `PageMeta.title` (10~70자) |
docs/core/SEARCH_STANDARDIZATION.md:77:| `<meta name="description">` | **Allowed** (모든 페이지 필수) | `PageMeta.description` (80~160자) |
docs/core/SEARCH_STANDARDIZATION.md:78:| `<link rel="canonical">` | **Allowed** (모든 페이지 필수) | `PageMeta.canonical` 또는 빌드 시 자동 resolve (§ 5) |
docs/core/SEARCH_STANDARDIZATION.md:79:| `<meta name="robots">` | **Allowed** (모든 페이지) | `PageMeta.robots` (기본 `"index, follow, max-snippet:-1, max-image-preview:large"`) |
docs/core/SEARCH_STANDARDIZATION.md:80:| `<meta name="viewport">` | **Allowed** | 고정 `"width=device-width, initial-scale=1"` |
docs/core/SEARCH_STANDARDIZATION.md:81:| `<meta charset>` | **Allowed** | 고정 `"utf-8"` |
docs/core/SEARCH_STANDARDIZATION.md:82:| `<html lang>` | **Allowed** | **저장값 `ko-KR`을 그대로 `<html lang>`에 출력** (BCP 47 유효, 지역 정보 보존 — hreflang·og:locale·SchemaInput과 단일 일관). og:locale은 `ko_KR` (underscore) 형식으로만 변환 |
docs/core/SEARCH_STANDARDIZATION.md:83:| `<meta property="og:type">` | **Allowed** | 페이지 타입에 따라 자동 — `P-004`는 `profile`, `P-006/P-008/P-010`은 `article`, 나머지는 `website` (§ 2.2 매핑 참조) |
docs/core/SEARCH_STANDARDIZATION.md:84:| `<meta property="og:title">` | **Allowed** | `PageMeta.ogTitle` 또는 `title` |
docs/core/SEARCH_STANDARDIZATION.md:85:| `<meta property="og:description">` | **Allowed** | `PageMeta.ogDescription` 또는 `description` |
docs/core/SEARCH_STANDARDIZATION.md:86:| `<meta property="og:url">` | **Allowed** | resolved canonical URL |
docs/core/SEARCH_STANDARDIZATION.md:87:| `<meta property="og:site_name">` | **Allowed** | `ClinicProfile.name` |
docs/core/SEARCH_STANDARDIZATION.md:88:| `<meta property="og:image">` | **Allowed** | `PageMeta.ogImageUrl` 또는 `ClinicProfile.ogImageUrl` |
docs/core/SEARCH_STANDARDIZATION.md:89:| `<meta property="og:locale">` | **Allowed** | `inLanguage` (`ko-KR`)에서 OG locale 형식으로 변환: `ko_KR` (underscore) |
docs/core/SEARCH_STANDARDIZATION.md:90:| `<meta name="twitter:card">` | **Allowed** | `PageMeta.twitterCard` (기본 `summary_large_image`) |
docs/core/SEARCH_STANDARDIZATION.md:99:| `<meta name="theme-color">` | **Allowed (의무)** | light·dark 두 값 모두 출력 — `BrandTokens.colors.light.primary` + `BrandTokens.colors.dark.primary` (media 쿼리 별도). `DESIGN_TOKENS.md` § 9.4.1 SoT |
docs/core/SEARCH_STANDARDIZATION.md:130:- `noIndex: true`인 페이지는 sitemap 자동 제외 + `<meta name="robots" content="noindex, follow">` 출력 + robots.txt 차단 안 함 (§ 3.3.1 noIndex 원칙 정합)
docs/core/SEARCH_STANDARDIZATION.md:151:## 3. robots.txt 표준
docs/core/SEARCH_STANDARDIZATION.md:159:| **A. 일반 검색 색인** | `Googlebot` / `Yeti` (네이버) / `Bingbot` | 일반 검색 결과 색인 — 의료기관 노출의 1차 채널 | 각 검색 엔진 공식 문서 |
docs/core/SEARCH_STANDARDIZATION.md:160:| **B. AI 검색 인덱싱·답변용** | `OAI-SearchBot` (ChatGPT 검색용) / `PerplexityBot` (Perplexity 검색용) / `Claude-SearchBot` (Anthropic 검색용) | AI 답변·검색에서 사이트를 발견·인용하기 위한 인덱싱 크롤러 | OpenAI publisher FAQ; Perplexity crawlers; Anthropic crawler help |
docs/core/SEARCH_STANDARDIZATION.md:161:| **C. User-triggered fetch** | `ChatGPT-User` (사용자 GPT 요청 시 fetch) / `Perplexity-User` (사용자 Perplexity 요청 시 fetch) / `Claude-User` (사용자 Claude 요청 시 fetch) | **사용자 직접 요청**에 의해 페이지를 fetch. 제품별 robots.txt 해석·우선순위가 일반 크롤러와 다를 수 있으므로 **차단 보장 수단으로 보지 않음** (각 제품 공식 문서 확인 권장) | 동일 공식 출처 |
docs/core/SEARCH_STANDARDIZATION.md:164:> **분류 갱신 책임**: 본 표는 공식 출처 기반 + 분기 1회 재검증. `anthropic-ai`는 alias·legacy 추정 (Anthropic 공식 표기는 `ClaudeBot`·`Claude-SearchBot`·`Claude-User`).
docs/core/SEARCH_STANDARDIZATION.md:170:> - Google robots.txt spec — https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt
docs/core/SEARCH_STANDARDIZATION.md:180:| `allow` | Allow | Allow | Allow | Allow | **`aiCrawlerLegalApproved: true` 필수 (fail-gate)** |
docs/core/SEARCH_STANDARDIZATION.md:181:| `disallowTraining` (**권장 기본**) | Allow | Allow | Allow | **Disallow** | 승인 기록 권장 (warning 수준) |
docs/core/SEARCH_STANDARDIZATION.md:182:| `disallowAll` | Allow | **Disallow** | **Disallow** | **Disallow** | 승인 기록 권장 |
docs/core/SEARCH_STANDARDIZATION.md:185:> **C 계열 (User-triggered fetch) 주의**: 제품별 robots.txt 해석 정책이 일반 검색·학습 크롤러와 다를 수 있음. `disallowAll`을 선택해도 **C 계열에 대한 완전 차단을 보장하는 수단으로 보지 않는다** — 각 제품 공식 문서·고객지원 채널 확인 권장.
docs/core/SEARCH_STANDARDIZATION.md:193:# robots.txt — 자동 생성 by Glitzy Core (SEARCH_STANDARDIZATION § 3)
docs/core/SEARCH_STANDARDIZATION.md:196:User-agent: *
docs/core/SEARCH_STANDARDIZATION.md:197:Disallow: /admin/
docs/core/SEARCH_STANDARDIZATION.md:198:Disallow: /auth/
docs/core/SEARCH_STANDARDIZATION.md:199:Disallow: /api/
docs/core/SEARCH_STANDARDIZATION.md:200:Allow: /
docs/core/SEARCH_STANDARDIZATION.md:202:# A. 일반 검색 색인 — Allow
docs/core/SEARCH_STANDARDIZATION.md:203:User-agent: Googlebot
docs/core/SEARCH_STANDARDIZATION.md:204:Allow: /
docs/core/SEARCH_STANDARDIZATION.md:206:User-agent: Yeti
docs/core/SEARCH_STANDARDIZATION.md:207:Allow: /
docs/core/SEARCH_STANDARDIZATION.md:209:User-agent: Bingbot
docs/core/SEARCH_STANDARDIZATION.md:210:Allow: /
docs/core/SEARCH_STANDARDIZATION.md:212:# B. AI 검색 인덱싱·답변용 — Allow
docs/core/SEARCH_STANDARDIZATION.md:213:User-agent: OAI-SearchBot
docs/core/SEARCH_STANDARDIZATION.md:214:Allow: /
docs/core/SEARCH_STANDARDIZATION.md:216:User-agent: PerplexityBot
docs/core/SEARCH_STANDARDIZATION.md:217:Allow: /
docs/core/SEARCH_STANDARDIZATION.md:219:User-agent: Claude-SearchBot
docs/core/SEARCH_STANDARDIZATION.md:220:Allow: /
docs/core/SEARCH_STANDARDIZATION.md:222:# C. User-triggered fetch — Allow
docs/core/SEARCH_STANDARDIZATION.md:223:User-agent: ChatGPT-User
docs/core/SEARCH_STANDARDIZATION.md:224:Allow: /
docs/core/SEARCH_STANDARDIZATION.md:226:User-agent: Perplexity-User
docs/core/SEARCH_STANDARDIZATION.md:227:Allow: /
docs/core/SEARCH_STANDARDIZATION.md:229:User-agent: Claude-User
docs/core/SEARCH_STANDARDIZATION.md:230:Allow: /
docs/core/SEARCH_STANDARDIZATION.md:232:# D. AI 학습·모델 개선용 — Disallow
docs/core/SEARCH_STANDARDIZATION.md:233:User-agent: GPTBot
docs/core/SEARCH_STANDARDIZATION.md:234:Disallow: /
docs/core/SEARCH_STANDARDIZATION.md:236:User-agent: ClaudeBot
docs/core/SEARCH_STANDARDIZATION.md:237:Disallow: /
docs/core/SEARCH_STANDARDIZATION.md:239:User-agent: Google-Extended
docs/core/SEARCH_STANDARDIZATION.md:240:Disallow: /
docs/core/SEARCH_STANDARDIZATION.md:242:User-agent: CCBot
docs/core/SEARCH_STANDARDIZATION.md:243:Disallow: /
docs/core/SEARCH_STANDARDIZATION.md:245:User-agent: anthropic-ai
docs/core/SEARCH_STANDARDIZATION.md:246:Disallow: /
docs/core/SEARCH_STANDARDIZATION.md:253:> `InstanceManifest.experimentalAiBots: true`(default `false`)일 때만 `meta-externalagent` 등 외부 관측 기반 user-agent가 robots.txt에 포함된다. 공식 검증된 user-agent만 기본 출력.
docs/core/SEARCH_STANDARDIZATION.md:257:위 예시에서 D 계열 모두 `Allow: /`로 변경.
docs/core/SEARCH_STANDARDIZATION.md:261:B·C·D 계열 모두 `Disallow: /`. A 계열만 Allow. (**C 계열은 차단 보장 수단으로 보지 않음** — § 3.1·§ 3.2 주의)
docs/core/SEARCH_STANDARDIZATION.md:263:### 3.3.1 robots.txt 룰 (Allowed / Blocked / Conditional)
docs/core/SEARCH_STANDARDIZATION.md:268:| `/admin/`·`/auth/`·`/api/` 차단 | **Allowed** (Core 기본 — 모든 정책에 공통) | |
docs/core/SEARCH_STANDARDIZATION.md:270:| 미발행 드래프트 차단 | (sitemap에서 제외 + 라우트 자체 없음) | robots.txt에서 별도 명시 안 함 |
docs/core/SEARCH_STANDARDIZATION.md:271:| **`noIndex: true` 페이지를 robots.txt에서 Disallow** | **Blocked** (Core 룰) | **robots.txt로 차단하면 크롤러가 meta noindex를 읽지 못함**. noIndex 페이지는 robots.txt 차단 X + sitemap 제외 + `<meta name="robots" content="noindex, follow">`로 처리 (참고: Google robots.txt intro) |
docs/core/SEARCH_STANDARDIZATION.md:272:| `User-agent: *  Disallow: /` (전체 차단) | **environment별 결정** | `environment=production`에서는 **Blocked** (의료기관 사이트 노출 필수). `environment=staging`·`preview`에서는 **Allowed** (또는 Basic Auth 권장 — `InstanceManifest.environment` 기반) |
docs/core/SEARCH_STANDARDIZATION.md:276:**Append 방식 금지** (같은 user-agent에 Allow/Disallow 중복 시 크롤러별 해석 차이·longest-match 문제 발생). 대신 user-agent 단위 merge·replace:
docs/core/SEARCH_STANDARDIZATION.md:282:| 기존 user-agent 룰 **부분 추가** | 인스턴스가 명시한 Allow/Disallow 라인을 해당 user-agent 블록에 merge — 단 같은 path에 Allow와 Disallow가 동시에 나오면 빌드 실패 (충돌) |
docs/core/SEARCH_STANDARDIZATION.md:284:**예시 — `aiCrawlerPolicy: allow` (기본 모두 허용)에서 PerplexityBot 일부 경로만 차단**:
docs/core/SEARCH_STANDARDIZATION.md:287:# Core 기본 (allow 정책, PerplexityBot 블록)
docs/core/SEARCH_STANDARDIZATION.md:288:User-agent: PerplexityBot
docs/core/SEARCH_STANDARDIZATION.md:289:Allow: /
docs/core/SEARCH_STANDARDIZATION.md:293:  - userAgent: PerplexityBot
docs/core/SEARCH_STANDARDIZATION.md:299:User-agent: PerplexityBot
docs/core/SEARCH_STANDARDIZATION.md:300:Disallow: /reviews
docs/core/SEARCH_STANDARDIZATION.md:301:Disallow: /pricing
docs/core/SEARCH_STANDARDIZATION.md:302:Allow: /
docs/core/SEARCH_STANDARDIZATION.md:305:> `InstanceManifest.robotsOverrides`(DATA_MODEL C-08·`RobotsOverride` 하위 타입)에 user-agent별 룰 명시. 빌드 시 Core 기본 + 오버라이드를 merge하고 같은 path에 Allow/Disallow 충돌 시 빌드 실패.
docs/core/SEARCH_STANDARDIZATION.md:317:| 필수 페이지 타입 (P-001 ~ P-014) | **Allowed** — 인스턴스에서 활성화된 페이지 |
docs/core/SEARCH_STANDARDIZATION.md:319:| 인스턴스 콘텐츠 (Articles·Treatments·Doctors·Conditions·FAQ·Locations) | **Allowed** — 발행된 모든 콘텐츠 |
docs/core/SEARCH_STANDARDIZATION.md:520:- robots.txt에 `Sitemap:` 라인 자동 출력 — 검색 엔진 자동 발견
docs/core/SEARCH_STANDARDIZATION.md:537:| **fail** | 빌드 실패 | title·description·canonical 누락, robots.txt 전체 차단, sitemap 출력 실패, Lighthouse Performance < 60 등 |
docs/core/SEARCH_STANDARDIZATION.md:554:| SS-01 | robots.txt 신규 AI 크롤러 갱신 — **주기는 분기 1회로 결정**. 미정인 부분: 재검증 책임자(Glitzy Core 팀 vs 운영자) / 업데이트 PR 흐름(Core 패키지 MINOR 릴리즈 vs 인스턴스 robotsOverrides) | 운영 프로세스 결정 |
docs/core/SEARCH_STANDARDIZATION.md:574:| 2026-05-14 | v0.1 | 최초 작성 — 메타 태그 표준(28종), robots.txt(AI 크롤러 화이트리스트), sitemap.xml(페이지별 changefreq/priority), canonical resolve 우선순위, 성능 기준(빌드 lab + 운영 field), Core 인터페이스 vs analytics-reporting 모듈 책임 분리, 빌드 검증 룰 레벨 |
docs/core/SEARCH_STANDARDIZATION.md:576:| 2026-05-14 | v0.3 | **AI 크롤러 정책 정밀화·environment 분기** (피드백 8건): (1) **§ 3.1 AI 크롤러 3계열 분리** — A 검색 색인 / B AI 검색·답변용 / C AI 학습. **OAI-SearchBot·Perplexity-User·Bingbot·meta-externalagent 추가**, (2) **Google-Extended를 C 학습 계열로 정리** (이전 잘못된 A 분류 정정), (3) **§ 3.2 `aiCrawlerPolicy` required, 미설정 시 빌드 fail** — Core 자동 적용 기본값 없음. starter template만 `disallowTraining` 제안, (4) **§ 2.1 `<html lang>` ko-KR 그대로 출력** — normalize 제거. BCP 47 유효, 지역 정보 보존, (5) DATA_MODEL ogType cascade 이미 적용됨(v0.10 — 사용자 시점차), (6) **§ 3.3.1 noIndex vs robots.txt 원칙 명시** — robots.txt 차단 X + sitemap 제외 + meta noindex (참고: Google robots.txt intro), (7) **§ 2.3 publisher 검증 분리** — head meta에는 article:publisher 없음 → JSON-LD `Article.publisher`로 강제(SCHEMA_MAPPING § 3 P-010 책임). § 2.3는 article:published_time/modified_time/author만, (8) **§ 3.3.1 environment 분기** — production은 전체 차단 Blocked, staging/preview는 Allowed (Basic Auth 권장. `InstanceManifest.environment` 기반) |
docs/core/SEARCH_STANDARDIZATION.md:577:| 2026-05-14 | v0.4 | **AI 봇 분류 정확화** (피드백 8건): (1) **§ 0 요약 정정** — "Core 기본 allow" 잔재 제거, `required·미설정 fail`로 통일, (2) **Anthropic 봇 분류 정정** — `ClaudeBot`을 D 학습 계열로, `Claude-SearchBot`을 B 검색 인덱싱, `Claude-User`를 C user-triggered로. `anthropic-ai`는 legacy/alias 주석, (3) **OpenAI `ChatGPT-User` 추가** — C user-triggered 계열, (4) **3계열 → 4계열 재구성** — A 일반 검색 / B AI 검색 인덱싱 / **C User-triggered fetch** / D AI 학습. C 계열은 robots.txt 무시 가능성 주의, (5) **공식 출처 URL 명시** — 각 user-agent에 OpenAI publisher FAQ·Anthropic crawler help·Perplexity crawlers·Google robots-meta 참조. `meta-externalagent`는 외부 관측 기반 표기. 분기 1회 재검증 책임 명시, (6) **§ 0·§ 2.1 og:type 잔재 정정** — P-004 profile·P-006/P-008/P-010 article·나머지 website, (7) **SCHEMA_MAPPING § 1.5 `<html lang="ko">` → `<html lang="ko-KR">` cascade 정합**, (8) **법무 승인 플래그 룰 완화** — `allow`만 fail-gate, 다른 정책은 승인 기록 권장(warning 수준) |
docs/core/SEARCH_STANDARDIZATION.md:578:| 2026-05-14 | v0.5 | **C-08 InstanceManifest cascade·미세 정합** (피드백 6건): (1) **DATA_MODEL C-08에 8개 필드 추가** — `environment`·`aiCrawlerPolicy`·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` + `RobotsOverride`·`PerformanceBudget` 하위 타입 신설. **본 문서가 단독 구현 가능한 명세로 작동**, (2) **§ 2.3 `PageMeta.noIndex` vs `robots` 우선순위 명시** — noIndex 항상 우선, 충돌 시 warning, (3) **§ 2.3 P-006/P-008 modified_time fallback** — `TreatmentPage.dateModified`/`MedicalConditionPage.dateModified` 또는 공통 `@updatedAt`로 fallback, (4) **§ 3.4 custom 예시 정정** — **`aiCrawlerPolicy: allow` 기반** PerplexityBot 일부 경로 차단(`/reviews`·`/pricing`) 예시로 교체, (5) **§ 7.3 analytics-reporting 후속 문서 안내** — `docs/features/` 디렉터리 미생성 명시, (6) **§ 3.3 meta-externalagent를 `experimentalAiBots`로 분리** — 공식 검증 전 user-agent는 별도 플래그 활성화 시에만 robots.txt 포함 |
docs/core/SEARCH_STANDARDIZATION.md:579:| 2026-05-14 | v0.6 | **룰·게이트·참고 URL 미세 정합** (피드백 5건): (1) **§ 2.3 P-006/P-008 modified_time 룰 정확화** — "명시적 dateModified 부재로 공통 `@updatedAt` fallback 사용" warning. modified_time 출력 자체는 누락 안 됨. C-11 풀명세 시 dateModified 추가 검토 명시, (2) v0.5 변경 이력 정정 — "disallowTraining 기반" → "**`aiCrawlerPolicy: allow` 기반**" PerplexityBot 일부 경로 차단 예시, (3) **DATA_MODEL C-08 cascade — `aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** (감사 추적 게이트 강화), (4) **DATA_MODEL C-08 PerformanceBudget 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (§ 6.1 budget 항목 모두 override 가능), (5) **§ 3.1 Google 참고 URL 정정** — robots.txt spec + Google-Extended 문서로 교체. robots-meta-tag는 noindex 등 별도 참조로 분리 |
docs/core/SEARCH_STANDARDIZATION.md:581:| 2026-05-14 | v0.8 | **OG article 메타 범위 정밀화** (피드백 4건): (1) **§ 2.1 `article:published_time`을 P-010 전용으로 좁힘** — P-006/P-008은 `@createdAt`을 공개 발행일로 매핑하기 부자연스러움. 미출력, (2) **§ 2.1 `article:section`도 P-010 전용** — P-006/P-008은 ArticleCategory 개념 없음. `article:modified_time`·`article:author`만 P-006/P-008에 conditional 적용, (3) **SS-04 미결정 해소 표시** — PerformanceBudget 강화 override 범위는 v0.6/v0.7에서 결정 완료, (4) **§ 3.1·§ 3.2 C 계열 표현 완화** — "robots.txt를 일반 크롤러처럼 따르지 않을 수 있음" → "**제품별 robots.txt 해석·우선순위가 일반 크롤러와 다를 수 있으므로 차단 보장 수단으로 보지 않음**" (법무·운영 문서 톤) |
docs/core/SEARCH_STANDARDIZATION.md:584:| 2026-05-14 | **v1.1** | **DESIGN_TOKENS v1.0 cascade**: § 2.1 메타 표 theme-color Conditional → **Allowed(의무)**로 격상. light·dark 두 값 출력 (`BrandTokens.colors.light.primary` + `colors.dark.primary`). SS-05 해소 |

 succeeded in 679ms:
docs/core/SEARCH_STANDARDIZATION.md:11:> - 데이터 계약 (`PageMeta` C-06, `BrandTokens`, `InstanceManifest` 등) → `core/DATA_MODEL.md`
docs/core/SEARCH_STANDARDIZATION.md:68:### 2.1 페이지별 출력 메타 (단일 SoT)
docs/core/SEARCH_STANDARDIZATION.md:99:| `<meta name="theme-color">` | **Allowed (의무)** | light·dark 두 값 모두 출력 — `BrandTokens.colors.light.primary` + `BrandTokens.colors.dark.primary` (media 쿼리 별도). `DESIGN_TOKENS.md` § 9.4.1 SoT |
docs/core/SEARCH_STANDARDIZATION.md:123:> **의도적 예외**: P-006·P-008은 `og:type=article`이지만 `article:*` 부가 메타는 **제한 출력** — `article:modified_time`·`article:author`만 (P-010은 모든 부가 메타 출력). P-006/P-008은 `article:published_time`·`article:section` 미출력 (의료 정보 페이지에 공개 발행일·ArticleCategory 매핑 부자연스러움). § 2.1 표 참조.
docs/core/SEARCH_STANDARDIZATION.md:447:> - **min score 계열 (클수록 강화)**: `lighthousePerformanceMinOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` — Core 기본값보다 **커야** 강화로 허용
docs/core/SEARCH_STANDARDIZATION.md:566:| ~~SS-05~~ | `theme-color` 메타 자동 출력 정책 | v1.0 — `DESIGN_TOKENS.md` § 9.4.1 SoT 확정. light·dark 두 값 모두 출력 (`<meta name="theme-color">` + `media="(prefers-color-scheme: dark)"` 별도). 값은 `BrandTokens.colors.primary` 평면화 hex |
docs/core/SEARCH_STANDARDIZATION.md:576:| 2026-05-14 | v0.3 | **AI 크롤러 정책 정밀화·environment 분기** (피드백 8건): (1) **§ 3.1 AI 크롤러 3계열 분리** — A 검색 색인 / B AI 검색·답변용 / C AI 학습. **OAI-SearchBot·Perplexity-User·Bingbot·meta-externalagent 추가**, (2) **Google-Extended를 C 학습 계열로 정리** (이전 잘못된 A 분류 정정), (3) **§ 3.2 `aiCrawlerPolicy` required, 미설정 시 빌드 fail** — Core 자동 적용 기본값 없음. starter template만 `disallowTraining` 제안, (4) **§ 2.1 `<html lang>` ko-KR 그대로 출력** — normalize 제거. BCP 47 유효, 지역 정보 보존, (5) DATA_MODEL ogType cascade 이미 적용됨(v0.10 — 사용자 시점차), (6) **§ 3.3.1 noIndex vs robots.txt 원칙 명시** — robots.txt 차단 X + sitemap 제외 + meta noindex (참고: Google robots.txt intro), (7) **§ 2.3 publisher 검증 분리** — head meta에는 article:publisher 없음 → JSON-LD `Article.publisher`로 강제(SCHEMA_MAPPING § 3 P-010 책임). § 2.3는 article:published_time/modified_time/author만, (8) **§ 3.3.1 environment 분기** — production은 전체 차단 Blocked, staging/preview는 Allowed (Basic Auth 권장. `InstanceManifest.environment` 기반) |
docs/core/SEARCH_STANDARDIZATION.md:577:| 2026-05-14 | v0.4 | **AI 봇 분류 정확화** (피드백 8건): (1) **§ 0 요약 정정** — "Core 기본 allow" 잔재 제거, `required·미설정 fail`로 통일, (2) **Anthropic 봇 분류 정정** — `ClaudeBot`을 D 학습 계열로, `Claude-SearchBot`을 B 검색 인덱싱, `Claude-User`를 C user-triggered로. `anthropic-ai`는 legacy/alias 주석, (3) **OpenAI `ChatGPT-User` 추가** — C user-triggered 계열, (4) **3계열 → 4계열 재구성** — A 일반 검색 / B AI 검색 인덱싱 / **C User-triggered fetch** / D AI 학습. C 계열은 robots.txt 무시 가능성 주의, (5) **공식 출처 URL 명시** — 각 user-agent에 OpenAI publisher FAQ·Anthropic crawler help·Perplexity crawlers·Google robots-meta 참조. `meta-externalagent`는 외부 관측 기반 표기. 분기 1회 재검증 책임 명시, (6) **§ 0·§ 2.1 og:type 잔재 정정** — P-004 profile·P-006/P-008/P-010 article·나머지 website, (7) **SCHEMA_MAPPING § 1.5 `<html lang="ko">` → `<html lang="ko-KR">` cascade 정합**, (8) **법무 승인 플래그 룰 완화** — `allow`만 fail-gate, 다른 정책은 승인 기록 권장(warning 수준) |
docs/core/SEARCH_STANDARDIZATION.md:579:| 2026-05-14 | v0.6 | **룰·게이트·참고 URL 미세 정합** (피드백 5건): (1) **§ 2.3 P-006/P-008 modified_time 룰 정확화** — "명시적 dateModified 부재로 공통 `@updatedAt` fallback 사용" warning. modified_time 출력 자체는 누락 안 됨. C-11 풀명세 시 dateModified 추가 검토 명시, (2) v0.5 변경 이력 정정 — "disallowTraining 기반" → "**`aiCrawlerPolicy: allow` 기반**" PerplexityBot 일부 경로 차단 예시, (3) **DATA_MODEL C-08 cascade — `aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** (감사 추적 게이트 강화), (4) **DATA_MODEL C-08 PerformanceBudget 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (§ 6.1 budget 항목 모두 override 가능), (5) **§ 3.1 Google 참고 URL 정정** — robots.txt spec + Google-Extended 문서로 교체. robots-meta-tag는 noindex 등 별도 참조로 분리 |
docs/core/SEARCH_STANDARDIZATION.md:580:| 2026-05-14 | v0.7 | **잔여 문구·표 정합** (피드백 5건): (1) **§ 3.1 표 D 계열 출처 정정** — "Google search-console robots-meta" → "**Google-Extended controls (overview-google-crawlers)**" (Google 봇 분류 근거 정확화), (2) **§ 4.4 sitemap lastmod 출처 분리** — P-010 Article은 `Article.dateModified`, P-006·P-008은 명시 필드 부재 시 `@updatedAt` (§ 2.3 정합), (3) **§ 2.1 메타 태그 출처 칸 세분화** — `article:published_time`·`modified_time`·`author`를 P-006/P-008/P-010별로 분리 명시. P-010 fail/P-006·P-008 conditional fallback 차등, (4) **v0.6 변경 이력 "6건 → 5건" 오기 수정**, (5) **§ 6.1 강화 판정 방향 명시** — max 계열(LCP·CLS·TBT·bundle·image)은 작을수록 강화, min score 계열(Performance·SEO·Accessibility)은 클수록 강화. 반대 방향 입력 시 빌드 실패 |
docs/core/SEARCH_STANDARDIZATION.md:581:| 2026-05-14 | v0.8 | **OG article 메타 범위 정밀화** (피드백 4건): (1) **§ 2.1 `article:published_time`을 P-010 전용으로 좁힘** — P-006/P-008은 `@createdAt`을 공개 발행일로 매핑하기 부자연스러움. 미출력, (2) **§ 2.1 `article:section`도 P-010 전용** — P-006/P-008은 ArticleCategory 개념 없음. `article:modified_time`·`article:author`만 P-006/P-008에 conditional 적용, (3) **SS-04 미결정 해소 표시** — PerformanceBudget 강화 override 범위는 v0.6/v0.7에서 결정 완료, (4) **§ 3.1·§ 3.2 C 계열 표현 완화** — "robots.txt를 일반 크롤러처럼 따르지 않을 수 있음" → "**제품별 robots.txt 해석·우선순위가 일반 크롤러와 다를 수 있으므로 차단 보장 수단으로 보지 않음**" (법무·운영 문서 톤) |
docs/core/SEARCH_STANDARDIZATION.md:583:| 2026-05-14 | v0.10 | **잔재 정합 마감** (피드백 3건): (1) **§ 2.1 `article:modified_time` 출처 표** — "warning 수준" 잔재 제거. fallback 사용은 silent로 명시, (2) **v0.9 변경 이력 표현 정정** — warning은 명시 필드 도입 후 값 부재에만 적용. `@updatedAt` resolve 실패는 fail로 분리 (이전 표현이 둘을 warning에 모두 묶어서 모순), (3) **§ 2.3 `article:section` 룰 이름 정확화** — "누락 warning" → "**`Article.category` / `ArticleCategory.name` resolve 실패**" (Article.category는 required, 누락 가능 케이스는 참조 resolve 실패) |
docs/core/SEARCH_STANDARDIZATION.md:584:| 2026-05-14 | **v1.1** | **DESIGN_TOKENS v1.0 cascade**: § 2.1 메타 표 theme-color Conditional → **Allowed(의무)**로 격상. light·dark 두 값 출력 (`BrandTokens.colors.light.primary` + `colors.dark.primary`). SS-05 해소 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:7:> **scope limit (PSR-INTRO-01)**: 본 plan 은 **SSR + Next ISR** 만 다룬다. static export to Git · 도메인 매핑 (subdomain / custom domain) · CDN cache 정책 · Open Graph 이미지 동적 생성 · dark mode UI toggle 등은 M0 v1.0 본 구현 / M1 cascade. v0.1 은 `/<instanceSlug>/...` path-based routing 으로 **개발자가 접근 가능한 단계** 까지.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:16:- `docs/core/DESIGN_TOKENS.md` v1.0 — 3-tier 토큰 (primitive·semantic·component) · § 3.2 light/dark semantic 22 · § 3.3 `data-theme="light"|"dark"` 분기 · semantic naming SoT (`color.surface.background` 등).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:18:- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — ClinicProfile 3계약 + LegalDocument 5종 + primaryCtas + businessHours · LegalDocument DB CHECK `status='draft' AND risk_level='Low' AND published_at IS NULL` (LL-SCHEMA-03·06).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:48:| Next metadata API + theme-color + og:type 매핑 (cycle1 PSR-10 정정) | title · description · canonical · OpenGraph · Twitter · robots · `themeColor` 2값 (light/dark) · og:type P-004 `profile`, P-006/P-010 `article`, 기타 `website` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:50:| 디자인 토큰 통합 + light/dark CSS vars 출력 (cycle1 PSR-13·14 정정) | Tailwind v3.4 + DESIGN_TOKENS v1.0 semantic 22 alias 표. CSS custom property 는 light/dark 둘 다 출력. UI toggle 만 defer |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:62:| dark mode UI toggle | M1 Phase Alpha — CSS vars 는 v0.1 부터 두 테마 출력 (DESIGN_TOKENS § 3.3) · PSR-14 정합 | PSR-DEFER-03 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:78:### 2.1 route group 구조 (PSR-ROUTE-01) — cycle1 PSR-02·03 정정
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:123:- (PSR-ROUTE-03 · cycle1 PSR-03 patch) site layout 은 fragment 만 — `<html>`/`<body>` 중복 출력 금지. root layout 의 `<html lang="ko-KR">` SoT 유지. site layout 안 클래스/테마 처리는 `<body>` 의 추가 className 으로 root layout 이 segment-aware 분기 — 또는 별 wrapper `<div data-theme="light" data-site>` 구조 채택.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:252:- `apps/web/src/app/layout.tsx` (root · 본 plan acceptance commit 안 patch) — `<html lang="ko-KR" data-theme="light">` + `<body className="bg-canvas text-fg-default">`. **모든 segment 가 root layout 의 html/body 공유**.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:273:- (PSR-COMP-03 · cycle2 PSR-26 정정) Header: ClinicProfile.name + 네비 (Home · About · Doctors · Treatments · Contact · Locations · CTA primaryCtas[0]). Footer: 주소·전화·진료시간. **법적 페이지 5종 링크는 v0.1 단계 숨김** — LegalDocument 공개 노출이 PSR-DEFER-13 (= LL-DEFER-01 alias) 합류 시점까지 404 이므로 broken link 회피. 합류 후 Footer 에 동적 추가 (LegalDocument 가 published 상태 row 가 존재할 때만 렌더).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:288:| ClinicProfile | `primary_ctas` (JSONB) | C-01 `primaryCtas[]` | CTA buttons |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:328:| P-012 Contact | `<ContactHero>` · `<BusinessHoursTable>` (CT-02 SoT 형식 — 7요일 + 점심 + 특수 휴진) · `<ReservationChannels>` (primaryCtas[]) | LocationMain + ClinicProfile.primary_ctas |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:338:- 허용 속성: 전 태그 `class`/`id`/`lang` · `a` 만 `href`/`rel`/`target` · `code`/`pre` `class` (syntax highlight)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:351:| `text-fg-default` · `text-primary-fg` | `color.text.primary` | `--color-text-primary` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:357:| `bg-brand` · `text-brand` | `color.brand.primary` | `--color-brand-primary` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:358:| `bg-brand-hover` | `color.brand.primary.hover` | `--color-brand-primary-hover` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:374:- (PSR-COMP-12 · cycle1 PSR-14) light/dark CSS vars 둘 다 출력. `apps/web/src/styles/globals.css`:
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:377::root, [data-theme="light"] {
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:379:  --color-text-primary: #111827;        /* gray.900 */
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:380:  /* ... 22 토큰 모두 light 값 */
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:382:[data-theme="dark"] {
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:384:  --color-text-primary: #f9fafb;        /* gray.50 */
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:385:  /* ... 22 토큰 모두 dark 값 */
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:389:  - root layout 안 `<html data-theme="light">` 고정 v0.1. UI toggle 만 defer (PSR-DEFER-03).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:416:  themeColor: [
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:417:    { media: "(prefers-color-scheme: light)", color: "<BrandTokens.colors.light.primary>" },  // 평면화 결과 (DESIGN_TOKENS § 6 BrandTokens · `color.brand.primary` light)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:418:    { media: "(prefers-color-scheme: dark)", color: "<BrandTokens.colors.dark.primary>" },    // 평면화 결과 — `color.brand.primary` dark
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:424:- (PSR-SEO-02 · cycle1 PSR-10 + cycle2 PSR-23 정정) `themeColor` 2값 출처 — DESIGN_TOKENS § 6 `BrandTokens.colors.light.primary` / `BrandTokens.colors.dark.primary` (= `color.brand.primary` 의 light/dark 평면화 결과). 인스턴스별 brandTokens 미주입 단계 (v0.1) 는 DESIGN_TOKENS § 3.2 default `color.brand.primary` light = `blue.600` (#2563eb) / dark = `blue.400` (#60a5fa) fallback. SEARCH_STANDARDIZATION § 2.1 정합.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:580:| 8 | Tailwind v0.2 patch — DESIGN_TOKENS v1.0 semantic 22 alias + globals.css 안 CSS vars (light + dark 양쪽) | acceptance precondition |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:590:| 1 | 어드민이 저장한 ClinicProfile 가 `/<instanceSlug>` (P-001 Home) 에 정확히 표시 | name · description · primaryCtas[0].label 가 페이지 안 **보임** (cycle1 PSR-18 정정) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:605:| 16 | dark mode CSS vars 출력 (UI toggle 미지원) | `[data-theme="dark"]` 블록 안 22개 토큰 모두 dark 값 정의 — 자체 rule checker (LOCAL_PASS) · UI toggle 은 marker 만 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:610:| 21 | Next metadata API `themeColor` 2값 (light + dark) 출력 — cycle1 PSR-10 | `<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f9fafb">` + dark 변형 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:629:| 12 | Next metadata API (페이지별 generateMetadata · themeColor · og:type) | 각 page.tsx 안 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:631:| 14 | Tailwind v0.2 patch — DESIGN_TOKENS v1.0 semantic 22 alias + globals.css light/dark | apps/web/tailwind.config.ts · src/styles/globals.css |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:653:- `PSR-DEFER-03`: dark mode UI toggle (CSS vars 는 v0.1 부터 두 테마 출력 — DESIGN_TOKENS § 3.3 정합).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:689:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:690:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |
docs/core/DESIGN_TOKENS.md:10:> - 페이지 타입·헤딩 위계 → `core/PAGE_TYPES.md` § 2.1
docs/core/DESIGN_TOKENS.md:21:- **출력 형식 2종**: (a) CSS Custom Properties (`:root`·`[data-theme="dark"]`), (b) `tokens.json` (Style Dictionary 호환 — 빌드 도구 변환 가능)
docs/core/DESIGN_TOKENS.md:22:- **다크모드**: 기본 light + dark 2개 테마. semantic 단계에서 분기, primitive·component는 동일
docs/core/DESIGN_TOKENS.md:23:- **접근성**: WCAG 2.1 AA 명도 대비(텍스트 4.5:1·UI 3:1) + 포커스 표시 의무
docs/core/DESIGN_TOKENS.md:47:  - `semantic.light.tokens.json` (semantic — light 테마)
docs/core/DESIGN_TOKENS.md:48:  - `semantic.dark.tokens.json` (semantic — dark 테마)
docs/core/DESIGN_TOKENS.md:63:### 2.1 primitive (원시값)
docs/core/DESIGN_TOKENS.md:74:font.size.12·14·16·18·20·24·30·36·48·60·72         (11단계 — § 4.2 표 SoT)
docs/core/DESIGN_TOKENS.md:78:spacing.0·1·2·3·4·6·8·12·16·24·32·48·64           (13단계 — § 5.1 표 SoT)
docs/core/DESIGN_TOKENS.md:94:color.surface.background  → light: color.gray.50,  dark: color.gray.900
docs/core/DESIGN_TOKENS.md:95:color.text.primary        → light: color.gray.900, dark: color.gray.50
docs/core/DESIGN_TOKENS.md:96:color.text.secondary      → light: color.gray.600, dark: color.gray.300
docs/core/DESIGN_TOKENS.md:97:color.brand.primary       → color.blue.600 (Preset/Instance override)
docs/core/DESIGN_TOKENS.md:110:button.primary.background       → color.brand.primary
docs/core/DESIGN_TOKENS.md:111:button.primary.text             → color.text.inverse
docs/core/DESIGN_TOKENS.md:112:button.primary.hover.background → color.brand.primary.hover
docs/core/DESIGN_TOKENS.md:149:| `color.white` | 절대값 `#ffffff` — surface.elevated(light) 등에서 사용 |
docs/core/DESIGN_TOKENS.md:174:### 3.2 semantic 색상 (light/dark 분기)
docs/core/DESIGN_TOKENS.md:176:| 토큰 | light | dark |
docs/core/DESIGN_TOKENS.md:181:| `color.text.primary` | gray.900 | gray.50 |
docs/core/DESIGN_TOKENS.md:187:| `color.brand.primary` | blue.600 | blue.400 |
docs/core/DESIGN_TOKENS.md:188:| `color.brand.primary.hover` | blue.700 | blue.300 |
docs/core/DESIGN_TOKENS.md:206:- HTML 속성 `data-theme="light" | "dark"`로 분기
docs/core/DESIGN_TOKENS.md:208:- 기본값 — `light`
docs/core/DESIGN_TOKENS.md:348:| 토큰 | light | dark (opacity 상향 — DT-04 해소) |
docs/core/DESIGN_TOKENS.md:355:#### 6.2.1 DTCG structured 형식 (Style Dictionary 입력)
docs/core/DESIGN_TOKENS.md:423:| `button.primary.background` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:424:| `button.primary.text` | color.text.inverse |
docs/core/DESIGN_TOKENS.md:425:| `button.primary.hover.background` | color.brand.primary.hover |
docs/core/DESIGN_TOKENS.md:427:| `button.secondary.text` | color.text.primary |
docs/core/DESIGN_TOKENS.md:452:| `input.text` | color.text.primary |
docs/core/DESIGN_TOKENS.md:479:| `badge.text` | color.text.primary |
docs/core/DESIGN_TOKENS.md:488:| `link.text` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:489:| `link.text.hover` | color.brand.primary.hover |
docs/core/DESIGN_TOKENS.md:498:| `table.header.text` | color.text.primary |
docs/core/DESIGN_TOKENS.md:521:| `tabs.trigger.text.active` | color.text.primary |
docs/core/DESIGN_TOKENS.md:522:| `tabs.trigger.border.active` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:531:| `nav.link.text` | color.text.primary |
docs/core/DESIGN_TOKENS.md:532:| `nav.link.text.hover` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:566:| `breadcrumb.text.current` | color.text.primary |
docs/core/DESIGN_TOKENS.md:576:| `cta-cluster.background` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:587:| `timeline.node.color` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:611:  --color-text-primary: var(--color-gray-900);
docs/core/DESIGN_TOKENS.md:612:  --color-brand-primary: var(--color-blue-600);
docs/core/DESIGN_TOKENS.md:614:  --button-primary-background: var(--color-brand-primary);
docs/core/DESIGN_TOKENS.md:617:[data-theme="dark"] {
docs/core/DESIGN_TOKENS.md:619:  --color-text-primary: var(--color-gray-50);
docs/core/DESIGN_TOKENS.md:632:├── semantic.light.tokens.json  # semantic — light 테마
docs/core/DESIGN_TOKENS.md:633:├── semantic.dark.tokens.json   # semantic — dark 테마
docs/core/DESIGN_TOKENS.md:657:**semantic.light.tokens.json 예시**:
docs/core/DESIGN_TOKENS.md:667:      "primary": { "value": "{color.blue.600}", "type": "color", "description": "BrandTokens.colors.light.primary 매핑" }
docs/core/DESIGN_TOKENS.md:678:    "primary": {
docs/core/DESIGN_TOKENS.md:679:      "background": { "value": "{color.brand.primary}", "type": "color" },
docs/core/DESIGN_TOKENS.md:692:- theme 분기 — light/dark용 semantic 파일 별도. 빌드 시 token set으로 결합 (`StyleDictionary.config({ source: [primitive, semantic.light, component] })`)
docs/core/DESIGN_TOKENS.md:698:| `dist/tokens/light.css` | light 테마 CSS Custom Properties (:root) |
docs/core/DESIGN_TOKENS.md:699:| `dist/tokens/dark.css` | dark 테마 ([data-theme="dark"]) |
docs/core/DESIGN_TOKENS.md:701:| `dist/tokens/light.json` | light 테마 평면화 JSON |
docs/core/DESIGN_TOKENS.md:702:| `dist/tokens/dark.json` | dark 테마 평면화 JSON |
docs/core/DESIGN_TOKENS.md:706:## 9.4 DATA_MODEL C-07 BrandTokens 매핑
docs/core/DESIGN_TOKENS.md:708:DATA_MODEL의 C-07 `BrandTokens`는 어드민·인스턴스 단위 브랜드 최종값. 본 문서의 토큰 카탈로그와 다음과 같이 매핑:
docs/core/DESIGN_TOKENS.md:710:| `BrandTokens` 필드 | 본 문서 토큰 매핑 |
docs/core/DESIGN_TOKENS.md:713:| `colors` | § 3.2 semantic 색상 전체 — `{ light: ColorTokens, dark: ColorTokens }` 양층 구조. 핵심 키 `colors.light.primary`·`colors.dark.primary`는 각 테마의 `color.brand.primary` 평면화 결과 |
docs/core/DESIGN_TOKENS.md:721:### 9.4.0 BrandTokens 세부 타입 정의
docs/core/DESIGN_TOKENS.md:729:  primary: string;
docs/core/DESIGN_TOKENS.md:730:  primary_hover: string;
docs/core/DESIGN_TOKENS.md:737:  text_primary: string;
docs/core/DESIGN_TOKENS.md:760:// BrandTokens.colors는 light·dark 두 ColorTokens 분리 구조
docs/core/DESIGN_TOKENS.md:761:type BrandTokensColors = {
docs/core/DESIGN_TOKENS.md:762:  light: ColorTokens;
docs/core/DESIGN_TOKENS.md:763:  dark: ColorTokens;
docs/core/DESIGN_TOKENS.md:766:// 참조 표기: BrandTokens.colors.light.primary, BrandTokens.colors.dark.primary (colors.<theme>.<token> 순)
docs/core/DESIGN_TOKENS.md:785:// DTCG shadow 객체 — § 6.2.1 structured 모델
docs/core/DESIGN_TOKENS.md:801:// BrandTokens.shadow도 light·dark 양층 구조 (colors와 동일 패턴)
docs/core/DESIGN_TOKENS.md:803:  light: ShadowTokens;
docs/core/DESIGN_TOKENS.md:804:  dark: ShadowTokens;
docs/core/DESIGN_TOKENS.md:813:빌드 시 light·dark 두 meta 모두 출력:
docs/core/DESIGN_TOKENS.md:815:- **light**: `<meta name="theme-color" content="<light-hex>">` — 값은 `BrandTokens.colors.light.primary` 평면화 hex
docs/core/DESIGN_TOKENS.md:816:- **dark**: `<meta name="theme-color" content="<dark-hex>" media="(prefers-color-scheme: dark)">` — 값은 `BrandTokens.colors.dark.primary` 평면화 hex
docs/core/DESIGN_TOKENS.md:818:미디어 쿼리 미지정 meta가 light 기본값을 의미. 양 theme 모두 출력 의무 — **한쪽만 출력 시 fail** (`SEARCH_STANDARDIZATION.md` § 2.1 Allowed 의무와 정합).
docs/core/DESIGN_TOKENS.md:825:Core (data/design-tokens/{primitive,semantic.light,semantic.dark,component}.tokens.json)
docs/core/DESIGN_TOKENS.md:827:Preset (presets/<presetSlug>/design-tokens/{primitive,semantic.light,semantic.dark,component}.tokens.json)
docs/core/DESIGN_TOKENS.md:829:Instance (instances/<instanceId>/design-tokens/{primitive,semantic.light,semantic.dark,component}.tokens.json)
docs/core/DESIGN_TOKENS.md:854:3. **theme별 머지**: light·dark token set은 각각 독립 머지. 한쪽만 override 시 다른 쪽 영향 없음
docs/core/DESIGN_TOKENS.md:865:## 11. 접근성 (WCAG 2.1 AA)
docs/core/DESIGN_TOKENS.md:878:빌드 시 다음 쌍을 light·dark 두 테마 모두 검증. Preset/Instance가 `color.brand.primary` 등을 변경하면 본 검증 자동 재실행.
docs/core/DESIGN_TOKENS.md:882:| 본문 텍스트 | `color.text.primary` / `color.surface.background` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:883:| 본문 텍스트 — elevated | `color.text.primary` / `color.surface.elevated` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:884:| 본문 텍스트 — subtle | `color.text.primary` / `color.surface.subtle` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:886:| 역색 텍스트 | `color.text.inverse` / `color.brand.primary` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:887:| 버튼 primary 텍스트 | `button.primary.text` / `button.primary.background` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:892:| 콜아웃 info 텍스트 | `color.text.primary` / `callout.info.background` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:893:| 콜아웃 warning 텍스트 | `color.text.primary` / `callout.warning.background` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:900:> ⚠️ `color.border.default`처럼 시각 분리 목적의 일반 border는 WCAG 2.1 의 1.4.11(Non-text Contrast) 비대상 — 검증 카탈로그에서 제외. focus ring·input.border.focus 등 의미 boundary만 검증.
docs/core/DESIGN_TOKENS.md:938:| ~~DT-04~~ | 다크모드 그림자 opacity 값 | v0.2 — § 6.2 shadow를 semantic theme-aware로 이동, light·dark 두 값 명시 |
docs/core/DESIGN_TOKENS.md:948:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (8개 지적 전건 수용)**: (1) § 5.1 spacing.0~96 잔재 → 0~64 (13단계) 정합, (2) § 9.4 BrandTokens.colors 잔재 정정 — `{ light, dark }` 양층 구조 명시. § 9.2 description 예시도 `colors.light.primary`로, (3) § 9.4.0 ShadowScale 양층화 — `{ light: ShadowTokens, dark: ShadowTokens }`. DTCG ShadowValue 객체 타입 신설, (4) § 9.4.0 RadiusScale에 `none` 필드 추가 — § 6.1 `radius.0` round-trip, (5) § 9.4.1 dark theme-color 한쪽만 출력 시 fail로 통일 (SEARCH_STANDARDIZATION § 2.1 Allowed 의무와 정합), (6) § 10.2 private.* CSS 변수명 변환 규칙 명시 — dot → `-` 치환 + `--` prefix, (7) § 9.2 표기 명확화 — Style Dictionary v3+ `value`·`type` 채택, DTCG draft의 `$value`/`$type` 미채택. 타입 값은 DTCG 카테고리 호환, (8) § 2.1 breakpoint 구분자 정리 `xl.2xl` → `xl·2xl` |
docs/core/DESIGN_TOKENS.md:949:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (9개 지적 전건 수용)**: (1) § 4.2 font.size 잔재 "10~96" → "12~72 11단계"로 정합, (2) § 2.1 primitive 목록에서 container 제거 (§ 5.3 semantic). § 5.3 container.max-width를 `breakpoint.xl` alias로 정정. raw 1280px 제거. grid.columns는 raw integer 명시, (3) § 12 fail 룰에 "overlay 외 semantic 색상이 raw hex·rgb·hsl 보유 시 fail" 명시, (4) § 6.2.1 DTCG structured shadow 객체 형식 + Style Dictionary shadow/css transform 변환 규칙 명시, (5) § 9.4.0 ColorTokens 22필드로 확장 — text_disabled·border_subtle·status_*_subtle 4종·overlay_modal·overlay_scrim 추가. §3.2 semantic 색상 전체 round-trip 가능, (6) BrandTokens.colors 구조를 `{ light: ColorTokens, dark: ColorTokens }`로 명확화. 참조 표기 `colors.<theme>.<token>` 순서 통일. § 9.4.1 dark theme-color 값 산출도 같은 형식, (7) **SEARCH_STANDARDIZATION § 2.1 메타 표 cascade** — theme-color Conditional → Allowed(의무) light·dark 두 값 출력으로 정합, (8) § 10.2 `private.*` 적용 범위 — semantic·component 양쪽 layer 모두 허용 명시, (9) DT-07 해소 설명 § 7.1.1 참조 정정 — CONTENT_STANDARDS § 7.1.1 명시 |
docs/core/DESIGN_TOKENS.md:950:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 0 요약 fail 조건 정밀화 — § 2.4 색상·shadow만 semantic 의무로 일치. typography·spacing·radius·motion 허용 명시, (2) § 2.1 primitive 목록 완전화 — green·amber 색상 추가, breakpoint·container·border.width·font.weight·line.height·letter.spacing 추가. § 4.2·§ 5.1 표 SoT와 정합 (font.size 11단계·spacing 13단계), (3) § 2.1 font.size 범위 12~72로 정합, (4) § 2.1 spacing 범위 0~64로 정합, (5) § 3.2 overlay 그룹 raw rgba 예외 규칙 명시 — `color.overlay.*`만 직접 rgba 허용. 다른 semantic은 primitive alias 의무 유지, (6) § 9.4.0 BrandTokens 세부 타입 정의 — ColorTokens(15필드)·TypographyTokens·RadiusScale·ShadowScale + 평면화 규칙(dot path → underscore), (7) § 9.4.1 dark theme-color 산출 명시 — dark resolve 결과 + media 쿼리 별도. 미디어 미지정이 light 기본값, (8) DT-07 해소 — `private.*` dot 컨벤션 확정. § 13.1 해소 표에 추가 |
docs/core/DESIGN_TOKENS.md:951:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 1.2 SoT 4파일 구조 통일 (`primitive`·`semantic.light`·`semantic.dark`·`component` tokens.json) — 단일 core.tokens.json 잔재 제거. § 10.1 흐름도 4파일 머지 명시, (2) § 0·§ 12 fail 조건 좁힘 — 색상·shadow component에서 primitive 직접 참조만 fail. typography·spacing·radius·motion 허용, (3) § 2.1 primitive 목록 shadow 잔재 제거 — shadow는 semantic 단계 명시. font.weight·line.height·letter.spacing·border.width 추가, (4) modal.overlay 직접 hex → semantic `color.overlay.modal` 분리. `color.overlay.scrim`도 신설, (5) § 9.4 personaMode enum 정규화 규칙 명시 — PascalCase → lowercase preset slug, (6) § 9.4 BrandTokens.spacing — primitive scale 배수 override(tight 0.85·standard 1.0·spacious 1.25) + MAJOR 변경 명시, (7) **SEARCH_STANDARDIZATION SS-05 해소 cascade** — § 9.4.1 theme-color light/dark 출력이 SoT임을 SEARCH_STANDARDIZATION § 9.1에 기록, (8) `private:` prefix → `private.*` dot 네임스페이스로 정정 — JSON path·CSS 변수명·tokens.json 모두 동일 형식, (9) § 11.2 검증 색상 쌍에서 `color.border.default` 제거 — WCAG 1.4.11 비대상(일반 시각 분리 border). 30개 쌍으로 정합, (10) § 11.3·§ 11.4 헤딩 번호 중복 정정 |
docs/core/DESIGN_TOKENS.md:952:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (10개 지적 전건 수용)**: (1) § 2.4 참조 규칙 정밀화 — color·shadow는 semantic 의무, spacing·radius·font·motion은 primitive 허용. component→component 금지, (2) § 3.1·§ 3.2 `color.white`·`color.black` primitive 절대값 추가. semantic `white` 잔재 정정, (3) § 9.4 DATA_MODEL C-07 BrandTokens 매핑 표 + § 9.4.1 theme-color SEARCH_STANDARDIZATION 정합, (4) § 9.2 Style Dictionary v3+ 표준 포맷으로 재작성 — primitive/semantic.light/semantic.dark/component 파일 분리, DTCG type 필드 명시, (5) § 6.2 shadow를 semantic theme-aware로 이동 — primitive 무관 원칙 보호. light·dark opacity 명시(DT-04 해소), (6) § 10.3 머지 알고리즘 강화 — 타입별 머지·theme별 머지·alias 재해석 순서·unknown key 처리(`private:` prefix)·접근성 재검증·순환 참조 검출, (7) § 11.2 자동 검증 색상 쌍 카탈로그 16개 × 2테마 = 32개 명시. Preset/Instance brand 변경 시 재검증 자동, (8) § 4.1 한국어 폰트 — Pretendard 우선 + § 4.1.1 웹폰트 로딩 정책(font-display: swap·preload·OFL 라이선스 검토 완료) + § 4.1.2 letter-spacing 한국어 본문 적용 제한, (9) § 8.7~§ 8.14 컴포넌트 토큰 카탈로그 확장 8종(table·accordion·tabs·nav/header/footer·modal·toast·avatar/breadcrumb·CTA cluster·timeline/map/embed), (10) § 13 미결정 정리 — § 3.4 primitive hex 카탈로그(DT-02 해소) + § 6.2 dark shadow(DT-04 해소). DT-06·DT-07 신설 |

 succeeded in 682ms:
5:본 문서는 `apps/web` 안에 **`(site)` route group**(공개 사이트)을 신설하고, 어드민 route 도 동시에 **`/admin/<instanceSlug>/...`** prefix 로 격상해 path namespace 충돌을 해소한다. 어드민에서 저장한 6 entity (ClinicProfile · LocationProfile · DoctorProfile · TreatmentPage · Article · LegalDocument)를 minimal 디자인 + 정합 JSON-LD + SEARCH_STANDARDIZATION v1.1 정합 robots/sitemap 과 함께 렌더한다.
12:- `docs/core/SCHEMA_MAPPING.md` — 페이지별 graph 구성 (§ 2.5 공통 entity 출력 정책 + § 3 페이지 그래프 + § 1.2 `@id` 네이밍 규약).
13:- `docs/core/SEARCH_STANDARDIZATION.md` — § 2 메타 태그 표준 (theme-color · og:type 매핑) · § 3 robots.txt (aiCrawlerPolicy + 4계열 user-agent + disallowTraining starter) · § 4.3 sitemap changefreq/priority · § 5 canonical resolve.
14:- `docs/core/CONTENT_STANDARDS.md` v1.3 — answer-first AST · § 7.1.1.1 LegalDocument 면제.
15:- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-02 DoctorProfile · C-03 TreatmentPage · C-04 Article · C-16 LegalDocument · C-21 LocationProfile · aiCrawlerPolicy.
17:- `docs/admin/ARCHITECTURE.md` v0.7 § 3.11 완료 게이트 #1 — "사이트 측 페이지 타입 9종 + Article 1샘플 빌드 (총 10 페이지)".
18:- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — ClinicProfile 3계약 + LegalDocument 5종 + primaryCtas + businessHours · LegalDocument DB CHECK `status='draft' AND risk_level='Low' AND published_at IS NULL` (LL-SCHEMA-03·06).
19:- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 placeholder — M0 v1.0 static export to Git cascade target.
21:  - `apps/web/src/app/(admin)/[instanceSlug]/...` (현 어드민 — cycle1 PSR-02 patch 후 `(admin)/admin/[instanceSlug]/...` 로 prefix 격상)
22:  - `apps/web/src/app/layout.tsx` (root layout · `<html><body>` SoT — site layout 은 fragment 만)
26:  - `apps/web/src/app/sign-in/...` (consume route — redirect target `/<firstSlug>` → `/admin/<firstSlug>` 로 patch · PSR-CASCADE-01)
41:| **어드민 URL prefix `/admin/<instanceSlug>/...`** (cycle1 PSR-02 격상) | 공개 path namespace 와 분리. acceptance precondition. 코드 cascade (PSR-CASCADE-01) 동시 적용 |
42:| **10페이지 minimal** (cycle1 PSR-01 정정) | P-001 `/` · P-002 `/about` · P-003 `/doctors` · P-004 `/doctors/[slug]` · P-005 `/treatments` · P-006 `/treatments/[slug]` · P-010 `/insights/[category]/[slug]` (1샘플) · P-012 `/contact` · P-013 `/legal/[type]` (5종) · P-014 `/locations/[slug]` (main 1건) |
44:| `app_public_reader` PostgreSQL role + per-table SELECT policy (cycle1 PSR-05·15 정정) | 신규 D0011 migration 안 instance lookup policy + 6 content table policy 명시 |
46:| 페이지 컴포넌트 minimal | Hero · About · DoctorCard · TreatmentCard · ArticleBody · ContactCard · LegalRenderer · LocationCard · Footer · Header · BreadcrumbList |
47:| JSON-LD 통합 graph + 자체 rule checker (cycle1 PSR-07·17 정정) | SCHEMA_MAPPING § 2.5 + § 3 정합. 페이지당 단일 `<script>`. 자체 JSON parse + 필수 entity 검증 (Google validator 는 manual QA marker) |
48:| Next metadata API + theme-color + og:type 매핑 (cycle1 PSR-10 정정) | title · description · canonical · OpenGraph · Twitter · robots · `themeColor` 2값 (light/dark) · og:type P-004 `profile`, P-006/P-010 `article`, 기타 `website` |
49:| sitemap.xml · robots.txt (cycle1 PSR-04·09 정정) | per-instance · SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` required + § 4.3 changefreq/priority SoT 정합 |
51:| status filter (cycle1 PSR-06·16 정정) | TreatmentPage·Article: `status='published' AND published_at <= now()`. **LegalDocument: v0.1 단계 noindex + 어드민 인증 필요 preview 만** (draft 공개 노출 차단 — 법무 게이트 우회 회피) |
54:| env / pgbouncer / role membership cascade (cycle1 PSR-21 정정) | `WEB_PUBLIC_DATABASE_URL` env · `.env.example` · pgbouncer userlist · `app_public_reader NOLOGIN MEMBERSHIP` 등 acceptance checklist |
72:| LegalDocument 공개 노출 (status=published) | LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel 합류) | PSR-DEFER-13 (LL-DEFER-01 alias) |
82:├─ layout.tsx                            -- root layout (HTML/BODY SoT · 변경 없음)
83:├─ (admin)/
84:│  └─ admin/                             -- cycle1 PSR-02 patch: `/admin` prefix 격상
101:│     ├─ legal/[type]/page.tsx           -- P-013 Legal/Policy (5 closed types) · noindex v0.1
105:│     ├─ robots.txt/route.ts             -- per-instance robots
107:├─ sign-in/...                           -- (변경: consume redirect target `/admin/<slug>` · PSR-CASCADE-01)
115:- (PSR-ROUTE-02 · cycle1 PSR-02 patch) 어드민 URL 격상 `/<instanceSlug>/...` → `/admin/<instanceSlug>/...`. ADMIN_UI_SKELETON code v1.0 의 다음 코드가 cascade 영향 (acceptance precondition):
116:  - `apps/web/src/app/(admin)/[instanceSlug]/...` → `apps/web/src/app/(admin)/admin/[instanceSlug]/...` 디렉토리 이동
117:  - `apps/web/src/app/sign-in/consume/route.ts` 의 redirect target `/<firstSlug>` → `/admin/<firstSlug>` (firstActiveMembershipResolver 결과)
119:  - `apps/web/src/components/forms/{ClinicProfileForm, DoctorProfileForm, ...}` 안 `revalidatePath('/${instanceSlug}/...')` 호출 → `'/admin/${instanceSlug}/...'` 로 patch (LOCATION_LEGAL code v1.1 cascade)
120:  - `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts` 의 `revalidatePath` 2 곳
122:  - 시나리오: 어드민 진입 시 `/admin/<slug>` 로 자동 redirect. 공개 site `/<slug>` 는 별 응답
123:- (PSR-ROUTE-03 · cycle1 PSR-03 patch) site layout 은 fragment 만 — `<html>`/`<body>` 중복 출력 금지. root layout 의 `<html lang="ko-KR">` SoT 유지. site layout 안 클래스/테마 처리는 `<body>` 의 추가 className 으로 root layout 이 segment-aware 분기 — 또는 별 wrapper `<div data-theme="light" data-site>` 구조 채택.
128:### 3.1 D0011 — `app_public_reader` role + per-table policy (PSR-DATA-01) — cycle1 PSR-05·15 정정
131:-- packages/db/migrations/D0011_public_reader.sql (신규)
156:                treatment_page, article, legal_document
192:-- cycle1 PSR-06·16 patch: LegalDocument 는 v0.1 공개 렌더 차단.
196:CREATE POLICY public_reader_legal_document_select
197:  ON legal_document FOR SELECT TO app_public_reader
215:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
223:| Entity | RLS USING (D0011) | 의미 |
230:| `legal_document` | `status = 'published'` | **v0.1 단계 published row 0개 — 공개 렌더 차단** (DB CHECK 가 draft 만 허용 · LL-SCHEMA-03) |
233:- (PSR-DATA-07) LegalDocument 의 `/legal/[type]` 라우트 는 v0.1 응답:
237:- LegalDocument 공개 노출은 **LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel 합류) 시점** 까지 차단. PSR-DEFER-13 = LL-DEFER-01 alias.
245:- `legal_document[type]` 매칭 0행 (v0.1 단계 항상) → `notFound()`
250:### 4.1 root layout 책임 분리 (PSR-COMP-01) — cycle1 PSR-03 정정 + cycle2 PSR-28 정정
252:- `apps/web/src/app/layout.tsx` (root · 본 plan acceptance commit 안 patch) — `<html lang="ko-KR" data-theme="light">` + `<body className="bg-canvas text-fg-default">`. **모든 segment 가 root layout 의 html/body 공유**.
253:- **cycle2 PSR-28 patch (acceptance precondition · plan acceptance commit 동반)**: 현 root layout 의 `<body className="bg-slate-50 text-slate-900">` 임시 토큰 → DESIGN_TOKENS v1.0 semantic alias (`bg-canvas` · `text-fg-default`) 로 전환. § 8 작업 #14 Tailwind v0.2 patch + globals.css 안 CSS vars 적용 + root layout className 변경 모두 acceptance 직전 동시 적용.
264:      <main className="min-h-screen">{children}</main>
265:      <SiteFooter initial={initial} />
272:- (PSR-COMP-02 · cycle1 PSR-03) site layout 의 `<html>`/`<body>` 미반환. root layout 이 SoT. `<html lang="ko-KR">` 는 root layout 안.
273:- (PSR-COMP-03 · cycle2 PSR-26 정정) Header: ClinicProfile.name + 네비 (Home · About · Doctors · Treatments · Contact · Locations · CTA primaryCtas[0]). Footer: 주소·전화·진료시간. **법적 페이지 5종 링크는 v0.1 단계 숨김** — LegalDocument 공개 노출이 PSR-DEFER-13 (= LL-DEFER-01 alias) 합류 시점까지 404 이므로 broken link 회피. 합류 후 Footer 에 동적 추가 (LegalDocument 가 published 상태 row 가 존재할 때만 렌더).
274:- (PSR-COMP-04) `loadSiteInitial` 가 layout 안에서 한 번 SELECT — Header/Footer 가 같은 데이터 사용. 페이지 안 별도 SELECT 는 entity 별 추가 데이터만.
282:| ClinicProfile | `name` | C-01 `name` | Hero/Header/Footer |
290:| LocationProfile | `phone` | C-21 `telephone` | Contact/Footer |
291:| LocationProfile | `email` | C-21 `email` | Contact/Footer |
308:| LegalDocument | `title` | C-16 `title` | Legal heading (v0.1 단계 노출 X) |
309:| LegalDocument | `body` | C-16 `body` (Markdown rendered) | Legal body |
310:| LegalDocument | `document_type` | C-16 `documentType` | Routing key |
311:| LegalDocument | `effective_date` | C-16 `effectiveDate` | Legal meta |
329:| P-013 Legal/Policy `/legal/[type]` | (v0.1 항상 404 — DB CHECK 가 draft 만 허용 + RLS published 만 SELECT) | (none — defer) |
340:- LegalDocument 본문 (CONTENT_STANDARDS § 7.1.1.1 면제) 도 동일 컴포넌트 사용 — answer-first AST · 표현 검사 미적용은 어드민 저장 단계의 결정이지 렌더 단계와 무관.
389:  - root layout 안 `<html data-theme="light">` 고정 v0.1. UI toggle 만 defer (PSR-DEFER-03).
416:  themeColor: [
424:- (PSR-SEO-02 · cycle1 PSR-10 + cycle2 PSR-23 정정) `themeColor` 2값 출처 — DESIGN_TOKENS § 6 `BrandTokens.colors.light.primary` / `BrandTokens.colors.dark.primary` (= `color.brand.primary` 의 light/dark 평면화 결과). 인스턴스별 brandTokens 미주입 단계 (v0.1) 는 DESIGN_TOKENS § 3.2 default `color.brand.primary` light = `blue.600` (#2563eb) / dark = `blue.400` (#60a5fa) fallback. SEARCH_STANDARDIZATION § 2.1 정합.
426:- (PSR-SEO-04) canonical v0.1: `https://<host>/<instanceSlug><path>` path-based. M0 v1.0 도메인 매핑 합류 시 entity continuity migration (PSR-CASCADE-02 참조).
456:### 5.3 robots.txt — cycle1 PSR-04 정정 (PSR-SEO-08)
458:- `apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts` — Next Route Handler.
462:  - § 3.3: 정책별 출력 예시 + 법무 승인 필드 3종 required (`legalApprovalAt` · `legalApprovedBy` · `legalApprovalNote`) for `allowAll`.
464:**결정 (v0.1 starter template)** — cycle2 PSR-22 정정 (SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로):
465:- (PSR-SEO-09 · cycle1 PSR-04 + cycle2 PSR-22) v0.1 단계 ClinicProfile.metadata.aiCrawlerPolicy 컬럼 부재 — InstanceManifest 합류 (M0 v1.0 cascade · PSR-DEFER-10) 전까지는 fixed `disallowTraining` starter (enum 값 = `disallowTraining` · SoT 4종 `allow / disallowTraining / disallowAll / custom`):
468:# robots.txt — auto-generated (Glitzy · SEARCH_STANDARDIZATION § 3.3 disallowTraining)
472:Disallow: /admin/
532:  - SEARCH_STANDARDIZATION § 3.3.1 룰 적용 (`/admin/`·`/auth/`·`/api/` 공통 차단 · `noIndex: true` 페이지는 robots 차단 X · `environment` 별 결정)
537:- 구조: `{ "@context": "https://schema.org", "@graph": [...] }` (SCHEMA_MAPPING § 1.1 정합).
538:- **페이지별 graph 구성 (SCHEMA_MAPPING § 2.5 + § 3 SoT 그대로 — `[풀]` vs `[참조]`)**:
551:| P-014 Location Detail | `[풀] Organization` · `[풀] MedicalClinic`(`#clinic` 단지점 main 의 entity @id 그대로 — SCHEMA_MAPPING § 1.4 정합) · `[풀] WebPage` · `[풀] BreadcrumbList` |
554:- (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
555:- (PSR-SEO-13) `inLanguage` 명시 정책: SCHEMA_MAPPING § 1.5 정합 — CreativeWork 계열 (Article · WebPage · FAQPage 등) 만 명시. Organization · MedicalClinic · Physician 등은 미명시.
573:| 1 | `D0011_public_reader.sql` 작성 + per-table policy 7개 (instance + 6 content table) | acceptance precondition |
577:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
579:| 7 | `packages/migrations-runner/src/manifest.ts` v0.x — D0011 10단계 추가 (PSR-CASCADE-04) | acceptance precondition |
582:| 10 | LOCATION_LEGAL code v1.1 cascade — admin URL 변경 (PSR-CASCADE-01) 의 revalidatePath 6 곳 patch | acceptance precondition |
583:| 11 | ADMIN_UI_SKELETON code v1.1 cascade — sign-in/consume redirect `/admin/<slug>` (PSR-CASCADE-01) | acceptance precondition |
584:| 12 | apps/web seed scenario 도 admin URL 변경 정합 (`apps/web/src/seed.ts`) | acceptance precondition |
597:| 8 | LegalDocument 5종 draft → `/<instanceSlug>/legal/<type>` 응답 = 404 (v0.1 noindex + DB CHECK draft 만) | Next `notFound()` |
601:| 12 | `/<instanceSlug>/robots.txt` 응답 | SEARCH_STANDARDIZATION § 3 v0.1 starter `disallowTraining` 정합 (학습 봇 Disallow + 답변 봇 Allow + Naver Yeti Allow) |
604:| 15 | 어드민 측 도메인 (`/admin/<slug>/...`) 와 공개 도메인 (`/<slug>/...`) 충돌 없음 — PSR-CASCADE-01 정합 | 어드민 prefix `/admin` · 공개 prefix 없음. sign-in consume redirect `/admin/<firstSlug>` |
610:| 21 | Next metadata API `themeColor` 2값 (light + dark) 출력 — cycle1 PSR-10 | `<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f9fafb">` + dark 변형 |
618:| 1 | D0011 migration — `app_public_reader` LOGIN + 7개 policy (instance + 6 content table) | packages/db/migrations/D0011_public_reader.sql |
629:| 12 | Next metadata API (페이지별 generateMetadata · themeColor · og:type) | 각 page.tsx 안 |
630:| 13 | sitemap.xml + robots.txt route handler (SEARCH_STANDARDIZATION 정합) | apps/web/src/app/(site)/[instanceSlug]/{sitemap.xml,robots.txt}/route.ts |
632:| 15 | **어드민 URL `/admin` prefix 격상 (PSR-CASCADE-01)** | apps/web/src/app/(admin)/admin/[instanceSlug]/ 디렉토리 이동 + revalidatePath 6 곳 + sign-in/consume redirect target + seed.ts |
633:| 16 | docs/admin/ARCHITECTURE.md § 3 patch — `(site)` 신설 + `/admin` prefix (PSR-CASCADE-01) | doc |
634:| 17 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` marker + entity continuity note (PSR-CASCADE-02) | doc |
635:| 18 | docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2 patch — apps/worker 가 본 plan SSR 컴포넌트 재사용 marker (PSR-CASCADE-03) | doc |
636:| 19 | packages/migrations-runner manifest 10단계 (D0011 추가 — PSR-CASCADE-04) | manifest.ts |
637:| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05 · cycle2 PSR-27 경로 정정) | apps/spike-a/pgbouncer/userlist.txt |
648:- `PSR-DEFER-13` (= LL-DEFER-01 alias · cycle1 PSR-06): LegalDocument 공개 노출 — compliance-assistant + ComplianceRecord legalCounsel/legalCounselAt 합류 시점.
674:> **acceptance 순서 정합 (LL-33 패턴)**: PSR-CASCADE-01~05 는 plan v1.0 acceptance 와 **동시 또는 직전** 에 적용. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
676:- `PSR-CASCADE-01` (cycle1 PSR-02 격상 + cycle2 PSR-24 a/b 분리):
677:  - **PSR-CASCADE-01a (docs · plan acceptance commit 안 동반)**: `docs/admin/ARCHITECTURE.md` § 3 patch — `(site)` 신설 + `/admin` prefix 격상 marker.
678:  - **PSR-CASCADE-01b (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEGAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · doctors · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/seed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance ≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 에서 별도 사이클 진행.
679:- `PSR-CASCADE-02` (cycle1 PSR-08 보강): `docs/core/SCHEMA_MAPPING.md` § 1.2 patch — v0.1 임시 path-based `@id` 패턴 + 도메인 매핑 후 (M0 v1.0) entity @id 전환 시 redirect/301/`sameAs` 처리 룰 추가 marker.
680:- `PSR-CASCADE-03`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 patch — apps/worker 의 build/export 시점에 본 plan SSR 컴포넌트 + JSON-LD 생성기 + sitemap/robots route handler 재사용 marker.
681:- `PSR-CASCADE-04`: `packages/migrations-runner/src/manifest.ts` — D0011 10단계 추가 (현 9단계 → 10단계).
682:- `PSR-CASCADE-05` (cycle2 PSR-27 경로 정정): `apps/spike-a/pgbouncer/userlist.txt` — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade). 본 파일은 `apps/spike-a/docker-compose.yml` 의 pgbouncer 컨테이너에 mount 되는 정확 경로.
689:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
690:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |

 succeeded in 697ms:
17:  readonly creates: ReadonlyArray<string>;
19:  readonly dependsOn: ReadonlyArray<string>;
23: * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 + PUBLIC_SITE_RENDER_PLAN v0.x § 8/§ 10 의 D0011 (10단계 — PSR-25/PSR-CASCADE-04 patch).
27:  // (1) instance (multi-tenant root)
29:    file: "packages/db/migrations/D0010_instance.sql",
31:    creates: ["instance"],
32:    dependsOn: [],
34:  // (2) clinic_profile
36:    file: "packages/core-content/migrations/C0001_clinic_profile.sql",
38:    creates: ["clinic_profile"],
39:    dependsOn: ["instance"],
41:  // (3) location_profile (base table — clinic_profile_id 미포함 · C0008 에서 ALTER)
45:    creates: ["location_profile"],
46:    dependsOn: ["instance"],
52:    creates: ["doctor_profile"],
53:    dependsOn: ["instance"],
59:    creates: ["treatment_page", "content_publication_status"],
60:    dependsOn: ["instance"],
66:    creates: ["article", "risk_level"],
67:    dependsOn: ["instance", "doctor_profile", "content_publication_status"],
73:    creates: ["legal_document", "legal_document_type"],
74:    dependsOn: ["instance", "content_publication_status", "risk_level"],
76:  // (8) clinic_profile policy + primary_ctas (ALTER)
78:    file: "packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql",
80:    creates: [
81:      "clinic_profile.policy_contact_person",
82:      "clinic_profile.policy_contact_email",
83:      "clinic_profile.policy_contact_phone",
84:      "clinic_profile.policy_effective_date",
85:      "clinic_profile.primary_ctas",
86:      "clinic_profile_primary_ctas_validate",
87:      "clinic_profile_primary_ctas_trigger",
89:    dependsOn: ["clinic_profile"],
95:    creates: [
96:      "location_profile.clinic_profile_id",
100:    dependsOn: ["clinic_profile", "location_profile"],
103:  // depends_on = instance + 6 content table 모두. policy 가 모든 table 에 걸리므로 manifest 마지막.
105:    file: "packages/db/migrations/D0011_public_reader.sql",
107:    creates: [
109:      "public_reader_instance_select",
110:      "public_reader_clinic_profile_select",
117:    dependsOn: [
118:      "instance",
119:      "clinic_profile",
130: * validateManifest — runner 가 sequential apply 직전 호출.
131: * 각 entry 의 dependsOn 이 이전 entries 의 creates 안에 모두 존재함을 verify.
134:export function validateManifest(): ReadonlyArray<string> {
138:    for (const dep of m.dependsOn) {
143:    for (const c of m.creates) seen.add(c);

codex
초기 grep 결과상 cycle 2 패치 대부분은 문서에 반영되어 있습니다. 이제 세부 표를 직접 대조합니다. 특히 robots 예시는 줄 단위로, SCHEMA_MAPPING의 path-based @id 표는 7개 entity별로 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/core/SCHEMA_MAPPING.md | Select-Object -Skip 35 -First 90' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/M0_BUILD_EXPORT_PLAN.md | Select-Object -Skip 35 -First 95' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content packages/migrations-runner/src/manifest.ts | Select-Object -First 180' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/LOCATION_LEGAL_PLAN.md | Select-Object -Skip 560 -First 120' in C:\Users\assag\solution\website-exposure
 succeeded in 737ms:
### 1.3 LL-CASCADE-04 외 (M0 v1.0 합류 시점에 확장)

- DoctorProfile · TreatmentPage · Article 의 schema.org JSON-LD 변환.
- ComplianceRecord (audit DB · ARCH § 6.3 cross-data) → Git output 사본.
- InstanceManifest · BrandTokens · FeatureModuleConfig.
- 미디어 자산 (이미지/동영상) — Cloudflare R2 → Git LFS 또는 referenced URL.

## 2. 작업 단위 (M0 v1.0 합류 시)

- apps/worker 신설 — Next.js 외 Node.js standalone worker (cron-triggered + 발행 트리거).
- Git client (isomorphic-git 또는 simple-git) 통합.
- DB → Git output 변환 함수 (entity 별 + JSON-LD generator).
- CI pipeline 통합 (변환 결과 commit → 사이트 빌드 trigger).
- 시나리오 LOCAL_PASS — 발행 트리거 → Git commit → 빌드 성공.

### 2.1 PUBLIC_SITE_RENDER_PLAN SSR 컴포넌트 재사용 (PSR-CASCADE-03)

`PUBLIC_SITE_RENDER_PLAN.md` v0.x 가 apps/web 안 `(site)` route group · SSR + Next ISR 로 먼저 공개 페이지를 렌더한다 (Phase 0). 본 M0 v1.0 본 구현 시점에 같은 컴포넌트 트리를 정적 build/export 로 재사용한다:

| 영역 | v0.x SSR 위치 | M0 v1.0 본 구현 변환 |
|---|---|---|
| 페이지 컴포넌트 | `apps/web/src/app/(site)/[instanceSlug]/...` server component | `next export` + `generateStaticParams` 또는 별도 Astro/Next static 변환 |
| JSON-LD 생성기 | `apps/web/src/lib/json-ld/*` (페이지 타입 별 graph builder) | 동일 코드 — build-time 호출 → HTML 안 inline |
| sitemap.xml / robots.txt | `apps/web/src/app/(site)/[instanceSlug]/{sitemap.xml,robots.txt}/route.ts` | static file generate — instance 별 directory 안 `sitemap.xml` · `robots.txt` |
| Markdown 렌더 | `apps/web/src/lib/markdown.ts` (sanitize-html) | 동일 — build-time pre-render |
| 디자인 토큰 (Tailwind + CSS vars) | `apps/web/tailwind.config.ts` + `globals.css` (light/dark 둘 다 출력) | 동일 — build-time CSS extraction |
| 도메인 매핑 | path-based `/<instanceSlug>/...` v0.x | subdomain / custom domain (PSR-DEFER-02) + Vercel/Cloud Run middleware host rewrite |
| `@id` entity 패턴 | path-based (SCHEMA_MAPPING § 1.2 v0.1 임시 표) | 도메인 매핑 SoT 표 — entity continuity 전환 룰 (301 redirect + `sameAs` 보조 marker) |

본 § 2.1 은 `PUBLIC_SITE_RENDER_PLAN` 의 acceptance precondition cascade (PSR-CASCADE-03) — apps/worker 구현 시 별도 컴포넌트 작성 부담 없음. 본 plan v1.0 합류 시 § 2.1 상세화.

## 3. 비범위 (M0 v1.0 외)

- PR 워크플로우 (Direct push 외) — M2 Phase Beta.
- Git history 시각화 UI — M2 Phase Beta.
- 다국어 출력 — M3.

## 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-16 | v0.1 | LOCATION_LEGAL_PLAN v1.0 acceptance precondition 으로 placeholder 신설. LL-CASCADE-04 책임 명시 (ClinicProfile.locations / LocationProfile.parentClinic·reservationChannels / primary_ctas `id` → `@id` alias). |

 succeeded in 780ms:
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "...", ... },
    { "@type": "MedicalClinic", "@id": "...", ... },
    { "@type": "BreadcrumbList", "itemListElement": [...] },
    { "@type": "Article", "@id": "...", ... }
  ]
}
</script>
```

- 페이지 타입별 graph 구성 표준은 § 3·§ 4.
- 통합 그래프 사용 이유: entity cross-reference(@id 참조)가 깔끔, validator·검색 엔진의 entity 해석 명확.

### 1.2 `@id` 네이밍 규약

| Entity | `@id` 패턴 | 예시 |
|---|---|---|
| `Organization` (ClinicProfile) | `https://{domain}/#organization` | `https://example.com/#organization` |
| `MedicalClinic` 본원 (LocationProfile main) | `https://{domain}/#clinic` | `https://example.com/#clinic` |
| `MedicalClinic` 지점 (LocationProfile main 외) | `https://{domain}/locations/{slug}#clinic` | `https://example.com/locations/gangnam#clinic` |
| `Physician` (DoctorProfile) | `https://{domain}/doctors/{slug}#physician` | |
| `MedicalProcedure` (TreatmentPage) | `https://{domain}/treatments/{slug}#procedure` | |
| `MedicalCondition` (MedicalConditionPage) | `https://{domain}/conditions/{slug}#condition` | |
| `Article` | `https://{domain}/insights/{category}/{slug}#article` | |
| `WebSite` | `https://{domain}/#website` | |
| `WebPage` | `https://{domain}{path}#webpage` | 본문 페이지 entity |

> `@id`는 dereferenceable URL + fragment 형식. 같은 entity는 항상 같은 `@id`를 사용해 페이지 간 일관성 확보.

#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)

`PUBLIC_SITE_RENDER_PLAN.md` v0.x § 5.4 PSR-SEO-12 의 SSR + path-based routing 단계 (Phase 0) 에서는 도메인 매핑 (subdomain/custom domain) 합류 전이므로 **임시로 instanceSlug 가 path 에 들어간 `@id` 패턴** 을 사용한다:

| Entity | v0.1 path-based 임시 패턴 | M0 v1.0 도메인 매핑 후 (SoT 표 위) |
|---|---|---|
| `Organization` | `https://<host>/<instanceSlug>/#organization` | `https://<customDomain>/#organization` |
| `MedicalClinic` (`#clinic` 본원) | `https://<host>/<instanceSlug>/#clinic` | `https://<customDomain>/#clinic` |
| `Physician` | `https://<host>/<instanceSlug>/doctors/<slug>#physician` | `https://<customDomain>/doctors/<slug>#physician` |
| `MedicalProcedure` | `https://<host>/<instanceSlug>/treatments/<slug>#procedure` | `https://<customDomain>/treatments/<slug>#procedure` |
| `Article` | `https://<host>/<instanceSlug>/insights/<category>/<slug>#article` | `https://<customDomain>/insights/<category>/<slug>#article` |
| `WebSite` | `https://<host>/<instanceSlug>/#website` | `https://<customDomain>/#website` |
| `WebPage` | `https://<host>/<instanceSlug><path>#webpage` | `https://<customDomain><path>#webpage` |

**Entity continuity 전환 룰 (M0 v1.0 도메인 매핑 합류 시점)**:
- 도메인 매핑 후 entity `@id` 가 변경된다. 검색 엔진의 entity 연속성 (knowledge graph 등) 을 위해:
  - **HTTP 301 redirect**: v0.1 path-based URL → M0 도메인 매핑 URL (운영 트래픽 영향)
  - **`sameAs` 보조 marker**: M0 단계 Organization/MedicalClinic 의 `sameAs` 배열 에 v0.1 path-based URL 을 한시 (3~6 개월) 포함하여 entity identity 연속성 신호 제공
  - **sitemap 의 lastmod** 갱신 — 전환 시 모든 페이지 lastmod 1회 갱신해 재크롤 유도
- 본 전환 작업은 M0 v1.0 본 구현 cascade (PSR-DEFER-02 도메인 매핑) 와 동반.

### 1.3 entity Cross-reference

다른 entity 참조는 `@id`만 사용:

```json
{
  "@type": "Article",
  "@id": "https://example.com/insights/diet/yoyo#article",
  "author": { "@id": "https://example.com/doctors/hong#physician" },
  "publisher": { "@id": "https://example.com/#organization" }
}
```

전체 entity 정의는 페이지 그래프 안에 한 번만. 다른 위치는 `@id`만으로 참조.

### 1.4 단지점 vs 다지점 (SM-05 해소)

본원은 항상 단일 entity `#clinic`로 통일. 다지점의 비본원 지점만 별도 entity. **alias 사용 안 함** (entity identity 명확성).

| 인스턴스 형태 | Organization | MedicalClinic |
|---|---|---|
| **단지점** | `Organization`(`#organization`) 1개 | **`MedicalClinic`(`#clinic`) 1개** — LocationProfile(slug=`main`)에 매핑. P-014 페이지(URL `/locations/main`)의 mainEntity도 같은 `#clinic` (URL ≠ entity @id) |
| **다지점** | `Organization`(`#organization`) 1개 | **본원: `MedicalClinic`(`#clinic`)** — LocationProfile(slug=`main`). **비본원 지점들: `MedicalClinic`(`/locations/{slug}#clinic`)** 각각 별도 entity. 모두 `parentOrganization` = Organization |

> P-014 페이지가 단지점 main을 다룰 때도 entity @id는 `#clinic` 유지 — URL은 `/locations/main`이지만 mainEntity 참조는 `#clinic`. 다지점 비본원 지점 P-014만 `/locations/{slug}#clinic` entity 사용.

**`Organization` vs `MedicalClinic`의 책임 분리**:
- `Organization`: 법인 정체성 (ClinicProfile의 `legalEntityName`·`founder`·`foundingDate`·`awards`·`memberOf`·`affiliatedInstitutes`)
- `MedicalClinic`: 지점 단위 의료기관 정체성 (LocationProfile의 `address`·`telephone`·`openingHours`·`geo`·`medicalSpecialty` 등). `parentOrganization`으로 `Organization` 참조.

### 1.5 `inLanguage`

**CreativeWork 계열과 페이지 entity에만** `inLanguage` 명시 (기본 `"ko-KR"`). PageMeta.inLanguage를 따른다.

| 명시 | 명시 안 함 |
|---|---|
| `Article`·`NewsArticle`·`BlogPosting`·`WebPage`·`FAQPage`·`Blog`·`VideoObject`·`ImageObject` 등 CreativeWork 계열 | `Organization`·`MedicalClinic`·`LocalBusiness`·`Physician`·`Person`·`ContactPoint` 등 — Schema.org 표준상 inLanguage 속성 부재 또는 부적합 |

 succeeded in 752ms:
// @glitzy/migrations-runner — cross-package migrations manifest spec (v0.1)
// SoT cascade: LL-CASCADE-05 · LOCATION_LEGAL_PLAN v1.0 § 6 의존성 표
//
// 본 manifest 는 cross-package migrations 의 sequential apply 순서와 명시적 depends_on 을 SoT 로 보존한다.
// 실 runner 코드 (sequential apply + fail-fast) 합류는 LL-DEFER-20 (M0 v1.0 본 구현). 본 spec 작성까지가
// plan v1.0 acceptance precondition (LL-CASCADE-05 강도).
//
// orderedMigrations 의 순서를 runner 가 그대로 따른다. orderIndex 가 강한 결정성 (이름 정렬 불가 — 다른
// 패키지의 D0010 과 C0001 비교 등은 lexicographic 으로 의도와 충돌).

export type MigrationDescriptor = {
  /** 미가공 절대 경로 (repo root 기준 상대) */
  readonly file: string;
  /** 적용 단계 — 동일 패키지 내 마이그레이션은 항상 alphabetic 순서로 시퀀스 됨. cross-package 순서는 본 manifest 가 결정. */
  readonly package: "@glitzy/db" | "@glitzy/core-content" | "@glitzy/auth" | "@glitzy/storage";
  /** 본 마이그레이션이 만드는 핵심 객체 (table·enum·index·function) — depends_on 추적용 */
  readonly creates: ReadonlyArray<string>;
  /** 본 마이그레이션이 의존하는 객체 — apply 전 모두 존재해야 함 */
  readonly dependsOn: ReadonlyArray<string>;
};

/**
 * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 + PUBLIC_SITE_RENDER_PLAN v0.x § 8/§ 10 의 D0011 (10단계 — PSR-25/PSR-CASCADE-04 patch).
 * runner 는 이 배열 순서대로 sequential apply (fail-fast).
 */
export const orderedMigrations: ReadonlyArray<MigrationDescriptor> = [
  // (1) instance (multi-tenant root)
  {
    file: "packages/db/migrations/D0010_instance.sql",
    package: "@glitzy/db",
    creates: ["instance"],
    dependsOn: [],
  },
  // (2) clinic_profile
  {
    file: "packages/core-content/migrations/C0001_clinic_profile.sql",
    package: "@glitzy/core-content",
    creates: ["clinic_profile"],
    dependsOn: ["instance"],
  },
  // (3) location_profile (base table — clinic_profile_id 미포함 · C0008 에서 ALTER)
  {
    file: "packages/core-content/migrations/C0002_location_profile.sql",
    package: "@glitzy/core-content",
    creates: ["location_profile"],
    dependsOn: ["instance"],
  },
  // (4) doctor_profile — article.author_doctor_id FK 의존성 (plan § 6 미언급 보강)
  {
    file: "packages/core-content/migrations/C0003_doctor_profile.sql",
    package: "@glitzy/core-content",
    creates: ["doctor_profile"],
    dependsOn: ["instance"],
  },
  // (5) treatment_page — content_publication_status enum 생성 (C0006 precondition)
  {
    file: "packages/core-content/migrations/C0004_treatment_page.sql",
    package: "@glitzy/core-content",
    creates: ["treatment_page", "content_publication_status"],
    dependsOn: ["instance"],
  },
  // (6) article — risk_level enum 생성 (C0006 precondition) + doctor_profile FK
  {
    file: "packages/core-content/migrations/C0005_article.sql",
    package: "@glitzy/core-content",
    creates: ["article", "risk_level"],
    dependsOn: ["instance", "doctor_profile", "content_publication_status"],
  },
  // (7) legal_document — content_publication_status + risk_level enum FK
  {
    file: "packages/core-content/migrations/C0006_legal_document.sql",
    package: "@glitzy/core-content",
    creates: ["legal_document", "legal_document_type"],
    dependsOn: ["instance", "content_publication_status", "risk_level"],
  },
  // (8) clinic_profile policy + primary_ctas (ALTER)
  {
    file: "packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql",
    package: "@glitzy/core-content",
    creates: [
      "clinic_profile.policy_contact_person",
      "clinic_profile.policy_contact_email",
      "clinic_profile.policy_contact_phone",
      "clinic_profile.policy_effective_date",
      "clinic_profile.primary_ctas",
      "clinic_profile_primary_ctas_validate",
      "clinic_profile_primary_ctas_trigger",
    ],
    dependsOn: ["clinic_profile"],
  },
  // (9) location_profile parentClinic composite FK (ALTER)
  {
    file: "packages/core-content/migrations/C0008_location_profile_parent_clinic.sql",
    package: "@glitzy/core-content",
    creates: [
      "location_profile.clinic_profile_id",
      "location_profile_clinic_fk",
      "location_profile_clinic_idx",
    ],
    dependsOn: ["clinic_profile", "location_profile"],
  },
  // (10) app_public_reader role + per-table SELECT policy 7개 (PUBLIC_SITE_RENDER_PLAN v0.x · PSR-25 / PSR-CASCADE-04 patch)
  // depends_on = instance + 6 content table 모두. policy 가 모든 table 에 걸리므로 manifest 마지막.
  {
    file: "packages/db/migrations/D0011_public_reader.sql",
    package: "@glitzy/db",
    creates: [
      "app_public_reader",
      "public_reader_instance_select",
      "public_reader_clinic_profile_select",
      "public_reader_location_profile_select",
      "public_reader_doctor_profile_select",
      "public_reader_treatment_page_select",
      "public_reader_article_select",
      "public_reader_legal_document_select",
    ],
    dependsOn: [
      "instance",
      "clinic_profile",
      "location_profile",
      "doctor_profile",
      "treatment_page",
      "article",
      "legal_document",
    ],
  },
];

/**
 * validateManifest — runner 가 sequential apply 직전 호출.
 * 각 entry 의 dependsOn 이 이전 entries 의 creates 안에 모두 존재함을 verify.
 * 실 runner 합류 (LL-DEFER-20) 시점에 적용.
 */
export function validateManifest(): ReadonlyArray<string> {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const [i, m] of orderedMigrations.entries()) {
    for (const dep of m.dependsOn) {
      if (!seen.has(dep)) {
        errors.push(`[${m.file}] depends on "${dep}" but it is not created by any earlier migration (orderIndex=${i})`);
      }
    }
    for (const c of m.creates) seen.add(c);
  }
  return errors;
}

 succeeded in 759ms:
- `LL-DEFER-07`: latitude/longitude 지도 pinpoint.
- `LL-DEFER-10`: 템플릿 major 버전 변경 시 운영자 수동 확인.
- `LL-DEFER-12`: `cookie`/`other` documentType UI (manual 입력 + custom template).
- `LL-DEFER-13`: custom (`documentType=other`) template_version namespace 규약.
- `LL-DEFER-16` (cycle2 LL-30 patch): form (b) 에 receptionHours + specialClosures (공휴일/임시 휴진) UI 추가.
- `LL-DEFER-19` (cycle4 LL-50 + cycle5 LL-57 patch — phase 단일화): primaryCtas UI subset 확장 — CT-03 11종 중 phone/kakao-talk/naver-reservation 외 8종 (`email`/`sms`/`kakao-channel`/`naver-talk`/`form`/`map`/`external`/`video-consultation`) 의 UI 입력. M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 — 추가 8종은 M1.

### 9.3 M0 v1.0 본 구현 합류 (LocationProfile 편집 화면 cascade · cycle4 LL-52 patch)

> **§1.3 비범위 vs §9.3 phase 정합 정정 (cycle4 LL-52)**: LL-DEFER-04/05 의 합류 시점은 LocationProfile 편집 화면 (M0 v1.0 본 구현). M2 Phase Beta 합류로 표시했던 v0.4 까지의 표기는 §1.3 비범위 표 ("LocationProfile 편집 화면 합류 시점") 와 충돌. v0.5 에서 통일.

- `LL-DEFER-04`: reservationChannels 풀세트 (LocationProfile 편집 화면 + 지점별 override). **M0 v1.0 본 구현 합류**.
- `LL-DEFER-05`: representativeDoctors · doctorsAtLocation · availableTreatments ref 입력 UI (다지점 합류 시점). **M0 v1.0 본 구현 합류** (단지점도 LocationProfile 편집 화면에서 입력).

### 9.3.1 M2 Phase Beta 합류 (다지점 + 외부 사용자 RBAC)

- (현재 비어 있음 — 다지점 UI 자체는 M0 v1.0 본 구현. M2 Phase Beta 는 외부 사용자 RBAC · 풀 권한 모델.)

### 9.4 Migration / 운영 cascade (시점 무관 · 조건부)

- `LL-DEFER-14` (cycle2 LL-28 patch): location_profile.clinic_profile_id NOT NULL data migration — 기존 row 존재 시 backfill 정책. v0.4 skeleton 가정은 row 없음.
- `LL-DEFER-17` (cycle2 LL-36 patch): cookie/other 가 closed type 으로 승격 시 partial unique index DROP + 새 7종 partial unique CREATE — migration cascade marker.

### 9.5 Closed (이전 cycle 에서 합류 완료)

- ~~`LL-DEFER-08`~~: cycle1 LL-15 patch — 5종 LegalDocument 별 effectiveDate override 합류 완료 (v0.2 acceptance).

## 10. Cascade marker (다른 SoT 문서로 전파)

> **acceptance 순서 정합 (cycle2 LL-33)**: LL-CASCADE-01 은 plan v1.0 acceptance 와 **동시 또는 직전** 에 ARCH patch 적용 (plan acceptance commit 안 포함). LL-CASCADE-02 · LL-CASCADE-03 · LL-CASCADE-04 도 동일 정책. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.

- `LL-CASCADE-01`: `docs/admin/ARCHITECTURE.md` § 3.8.2 표 — body 변수 화이트리스트 11개 (clinic 4 + location 3 + policy 4) reference 추가. ARCH v0.8 patch. **acceptance precondition**.
- `LL-CASCADE-02`: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 audit matrix — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed row 추가. **acceptance precondition**.
- `LL-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표 — LegalDocument 면제 marker 추가 (answer-first AST · 표현 검사 면제 · 변수 화이트리스트 별도 룰). **acceptance precondition**.
- `LL-CASCADE-04` (cycle3 LL-41 + cycle4 LL-49 + **cycle5 LL-56 patch — placeholder 실 파일 작성 완료**): **cascade target 정정** — ADMIN_UI_SKELETON_PLAN § 6 은 walking skeleton 의 actions 영역으로 build/export 부재 → **`docs/decisions/M0_BUILD_EXPORT_PLAN.md` (v0.1 placeholder · 2026-05-16 작성 완료)** + 본 plan 의 LL-CASCADE-04 marker reference. apps/worker · M0 v1.0 Git export 책임: LocationProfile.reservationChannels Git 출력 시 `clinic_profile.primary_ctas` deep clone, LocationProfile.@id = `"main"`, LocationProfile.parentClinic = ClinicProfile.@id reference, ClinicProfile.locations[] = SELECT 결과, primary_ctas DB key `id` → Git output `@id` alias 변환. **acceptance 강도 = placeholder 작성 완료** (`docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 1.2 LL-CASCADE-04 책임 표 명시). 실 구현은 M0 v1.0 본 구현.
- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch + **v1.1 LLC-18 patch — "8단계" → "9단계" stale wording 정정**): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 **9단계 의존성 표** cascade · v1.1 LLC-15 patch 로 8→9단계 갱신 정합). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.

## 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-16 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. |
| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
| 2026-05-16 | v0.6 | **Codex 비평 cycle5 3 findings (1 blocking + 0 major + 2 minor) 전건 수용 patch**: (LL-56) `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 실 파일 작성 완료 (v0.1 — §1.2 LL-CASCADE-04 책임 표 포함). (LL-57) LL-DEFER-19 phase 단일화 — §9.1 M0 v1.0 그룹 → §9.2 M1 Phase Alpha 그룹 으로 이동 ("M0 v1.0 또는 M1" 모호 표현 정정). M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 명시. (LL-58) Sentry SDK 초기화 위치 = `apps/web/src/lib/observability.ts` (init + captureException + addBreadcrumb helper) 한 줄 명시 — LL-DEFER-18 내. **누계 58 findings 전건 수용**. |
| 2026-05-16 | **v1.0** | **Codex 비평 cycle6 1 minor finding (LL-59) 수용 + closeableAfterPatch=true 확정 acceptance**: (LL-59) §2.2 본문 "M0 v1.0 또는 M1 cascade" → "M1 Phase Alpha cascade" 단일화 (LL-DEFER-19 § 9.2 위치와 정합). **수렴 추세 25→12→10→8→3→1 · blocking 0 · major 0 · minor 0 잔존**. cycle6 결과 acceptance commit 5 cascade (LL-CASCADE-01~05) 동시 포함 결정. **누계 59 findings 전건 처리 완료**. |
| 2026-05-18 | v1.1 | **Code review (cycle 1~3) 결과 plan SoT 보강 patch — 본 plan 의 코드 구현 cycle 동안 발견된 plan-code 불일치 4건 수용**: (LLC-15) § 6 migration 의존성 표 8단계 → 9단계 (C0003 doctor_profile 추가 — C0005 article.author_doctor_id FK precondition). (LLC-16) § 7 시나리오 15 "403" → `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 정정. 정확한 HTTP 403 status 보장은 § 9.1 `LL-DEFER-21` 신설 (Next.js 14 server component status code 한계 → Next 15 `unauthorized()/forbidden()` 합류 cascade). (LLC-17) § 4.4 LL-ACTION-18 fallback payload 에 `failedDetails: [{target, code, name, message}]` 추가 명시. (LLC-18) § 10 LL-CASCADE-05 본문 + manifest 주석의 "8단계" stale wording → "9단계"로 정정. 코드 누계 cycle 3 회 (14→3→1) · 누계 18 findings 수용 (cycle 6 plan acceptance 59 + cycle 1·2·3 code review 14+3+1). |

codex
검토 중 두 가지 잔재가 보입니다. 하나는 themeColor acceptance 시나리오의 기대값이 아직 surface 배경값으로 남은 부분이고, 다른 하나는 robots.txt 예시의 코멘트 라인이 SoT와 완전 동일하지 않은 부분입니다. 나머지 cascade 파일은 계속 확인 중입니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"site|PUBLIC_SITE_RENDER|/admin|페이지 타입 9종|10 페이지|route group|\\(site\\)|PSR-CASCADE|admin prefix|prefix\" docs/admin/ARCHITECTURE.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "if (Test-Path apps/spike-a/pgbouncer/userlist.txt) { Get-Content apps/spike-a/pgbouncer/userlist.txt } else { Write-Output 'MISSING' }" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "PUBLIC_SITE_RENDER|SSR|Hero|About|DoctorCard|TreatmentCard|ArticleBody|ContactCard|LegalRenderer|LocationCard|Footer|Header|BreadcrumbList|json-ld|robots|sitemap|markdown|Tailwind|globals.css" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md docs/decisions/M0_BUILD_EXPORT_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "themeColor|theme-color|#f9fafb|#2563eb|BrandTokens.colors.light.primary|color.surface.background|color.brand.primary" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md docs/core/SEARCH_STANDARDIZATION.md docs/core/DESIGN_TOKENS.md' in C:\Users\assag\solution\website-exposure
 succeeded in 736ms:
273:| 1 | 사이트 측 페이지 타입 9종 + Article 1샘플 빌드 (총 10 페이지) | Home·About·Doctors List·Doctor Profile·Treatments List·Treatment Detail·**Contact**·**Location Detail (main 자동)**·**Legal/Policy (자동, 법무 검토)**·Article Detail 1개 — 정적 빌드 가능. 상세는 PAGE_TYPES.md § 6 |
391:> 상세 필드는 `docs/admin/DATA_MODEL.md`.

 succeeded in 641ms:
docs/core/SEARCH_STANDARDIZATION.md:99:| `<meta name="theme-color">` | **Allowed (의무)** | light·dark 두 값 모두 출력 — `BrandTokens.colors.light.primary` + `BrandTokens.colors.dark.primary` (media 쿼리 별도). `DESIGN_TOKENS.md` § 9.4.1 SoT |
docs/core/SEARCH_STANDARDIZATION.md:566:| ~~SS-05~~ | `theme-color` 메타 자동 출력 정책 | v1.0 — `DESIGN_TOKENS.md` § 9.4.1 SoT 확정. light·dark 두 값 모두 출력 (`<meta name="theme-color">` + `media="(prefers-color-scheme: dark)"` 별도). 값은 `BrandTokens.colors.primary` 평면화 hex |
docs/core/SEARCH_STANDARDIZATION.md:584:| 2026-05-14 | **v1.1** | **DESIGN_TOKENS v1.0 cascade**: § 2.1 메타 표 theme-color Conditional → **Allowed(의무)**로 격상. light·dark 두 값 출력 (`BrandTokens.colors.light.primary` + `colors.dark.primary`). SS-05 해소 |
docs/core/DESIGN_TOKENS.md:94:color.surface.background  → light: color.gray.50,  dark: color.gray.900
docs/core/DESIGN_TOKENS.md:97:color.brand.primary       → color.blue.600 (Preset/Instance override)
docs/core/DESIGN_TOKENS.md:110:button.primary.background       → color.brand.primary
docs/core/DESIGN_TOKENS.md:112:button.primary.hover.background → color.brand.primary.hover
docs/core/DESIGN_TOKENS.md:166:| `gray` | `#f9fafb` | `#f3f4f6` | `#e5e7eb` | `#d1d5db` | `#9ca3af` | `#6b7280` | `#4b5563` | `#374151` | `#1f2937` | `#111827` |
docs/core/DESIGN_TOKENS.md:167:| `blue` | `#eff6ff` | `#dbeafe` | `#bfdbfe` | `#93c5fd` | `#60a5fa` | `#3b82f6` | `#2563eb` | `#1d4ed8` | `#1e40af` | `#1e3a8a` |
docs/core/DESIGN_TOKENS.md:178:| `color.surface.background` | gray.50 | gray.900 |
docs/core/DESIGN_TOKENS.md:187:| `color.brand.primary` | blue.600 | blue.400 |
docs/core/DESIGN_TOKENS.md:188:| `color.brand.primary.hover` | blue.700 | blue.300 |
docs/core/DESIGN_TOKENS.md:423:| `button.primary.background` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:425:| `button.primary.hover.background` | color.brand.primary.hover |
docs/core/DESIGN_TOKENS.md:488:| `link.text` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:489:| `link.text.hover` | color.brand.primary.hover |
docs/core/DESIGN_TOKENS.md:519:| `tabs.background` | color.surface.background |
docs/core/DESIGN_TOKENS.md:522:| `tabs.trigger.border.active` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:529:| `nav.background` | color.surface.background |
docs/core/DESIGN_TOKENS.md:532:| `nav.link.text.hover` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:576:| `cta-cluster.background` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:587:| `timeline.node.color` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:606:  --color-gray-50: #f9fafb;
docs/core/DESIGN_TOKENS.md:607:  --color-blue-600: #2563eb;
docs/core/DESIGN_TOKENS.md:610:  --color-surface-background: var(--color-gray-50);
docs/core/DESIGN_TOKENS.md:612:  --color-brand-primary: var(--color-blue-600);
docs/core/DESIGN_TOKENS.md:614:  --button-primary-background: var(--color-brand-primary);
docs/core/DESIGN_TOKENS.md:618:  --color-surface-background: var(--color-gray-900);
docs/core/DESIGN_TOKENS.md:644:      "50": { "value": "#f9fafb", "type": "color" },
docs/core/DESIGN_TOKENS.md:648:      "600": { "value": "#2563eb", "type": "color" }
docs/core/DESIGN_TOKENS.md:667:      "primary": { "value": "{color.blue.600}", "type": "color", "description": "BrandTokens.colors.light.primary 매핑" }
docs/core/DESIGN_TOKENS.md:679:      "background": { "value": "{color.brand.primary}", "type": "color" },
docs/core/DESIGN_TOKENS.md:689:- 토큰 ID — JSON path를 `.`로 join (예: `color.surface.background`)
docs/core/DESIGN_TOKENS.md:713:| `colors` | § 3.2 semantic 색상 전체 — `{ light: ColorTokens, dark: ColorTokens }` 양층 구조. 핵심 키 `colors.light.primary`·`colors.dark.primary`는 각 테마의 `color.brand.primary` 평면화 결과 |
docs/core/DESIGN_TOKENS.md:766:// 참조 표기: BrandTokens.colors.light.primary, BrandTokens.colors.dark.primary (colors.<theme>.<token> 순)
docs/core/DESIGN_TOKENS.md:808:- **평면화 규칙**: dot path를 underscore로 변환 (예: `color.surface.background` → `surface_background`). 어드민·빌드 도구가 본 규칙으로 평면화 결과 출력
docs/core/DESIGN_TOKENS.md:811:### 9.4.1 theme-color 메타 (SEARCH_STANDARDIZATION 정합)
docs/core/DESIGN_TOKENS.md:815:- **light**: `<meta name="theme-color" content="<light-hex>">` — 값은 `BrandTokens.colors.light.primary` 평면화 hex
docs/core/DESIGN_TOKENS.md:816:- **dark**: `<meta name="theme-color" content="<dark-hex>" media="(prefers-color-scheme: dark)">` — 값은 `BrandTokens.colors.dark.primary` 평면화 hex
docs/core/DESIGN_TOKENS.md:878:빌드 시 다음 쌍을 light·dark 두 테마 모두 검증. Preset/Instance가 `color.brand.primary` 등을 변경하면 본 검증 자동 재실행.
docs/core/DESIGN_TOKENS.md:882:| 본문 텍스트 | `color.text.primary` / `color.surface.background` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:885:| 보조 텍스트 | `color.text.secondary` / `color.surface.background` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:886:| 역색 텍스트 | `color.text.inverse` / `color.brand.primary` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:889:| 링크 | `link.text` / `color.surface.background` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:890:| 링크 hover | `link.text.hover` / `color.surface.background` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:891:| 포커스 링 | `color.focus.ring` / `color.surface.background` | 3:1 |
docs/core/DESIGN_TOKENS.md:896:| 입력 focus 테두리 | `input.border.focus` / `color.surface.background` | 3:1 |
docs/core/DESIGN_TOKENS.md:948:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (8개 지적 전건 수용)**: (1) § 5.1 spacing.0~96 잔재 → 0~64 (13단계) 정합, (2) § 9.4 BrandTokens.colors 잔재 정정 — `{ light, dark }` 양층 구조 명시. § 9.2 description 예시도 `colors.light.primary`로, (3) § 9.4.0 ShadowScale 양층화 — `{ light: ShadowTokens, dark: ShadowTokens }`. DTCG ShadowValue 객체 타입 신설, (4) § 9.4.0 RadiusScale에 `none` 필드 추가 — § 6.1 `radius.0` round-trip, (5) § 9.4.1 dark theme-color 한쪽만 출력 시 fail로 통일 (SEARCH_STANDARDIZATION § 2.1 Allowed 의무와 정합), (6) § 10.2 private.* CSS 변수명 변환 규칙 명시 — dot → `-` 치환 + `--` prefix, (7) § 9.2 표기 명확화 — Style Dictionary v3+ `value`·`type` 채택, DTCG draft의 `$value`/`$type` 미채택. 타입 값은 DTCG 카테고리 호환, (8) § 2.1 breakpoint 구분자 정리 `xl.2xl` → `xl·2xl` |
docs/core/DESIGN_TOKENS.md:949:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (9개 지적 전건 수용)**: (1) § 4.2 font.size 잔재 "10~96" → "12~72 11단계"로 정합, (2) § 2.1 primitive 목록에서 container 제거 (§ 5.3 semantic). § 5.3 container.max-width를 `breakpoint.xl` alias로 정정. raw 1280px 제거. grid.columns는 raw integer 명시, (3) § 12 fail 룰에 "overlay 외 semantic 색상이 raw hex·rgb·hsl 보유 시 fail" 명시, (4) § 6.2.1 DTCG structured shadow 객체 형식 + Style Dictionary shadow/css transform 변환 규칙 명시, (5) § 9.4.0 ColorTokens 22필드로 확장 — text_disabled·border_subtle·status_*_subtle 4종·overlay_modal·overlay_scrim 추가. §3.2 semantic 색상 전체 round-trip 가능, (6) BrandTokens.colors 구조를 `{ light: ColorTokens, dark: ColorTokens }`로 명확화. 참조 표기 `colors.<theme>.<token>` 순서 통일. § 9.4.1 dark theme-color 값 산출도 같은 형식, (7) **SEARCH_STANDARDIZATION § 2.1 메타 표 cascade** — theme-color Conditional → Allowed(의무) light·dark 두 값 출력으로 정합, (8) § 10.2 `private.*` 적용 범위 — semantic·component 양쪽 layer 모두 허용 명시, (9) DT-07 해소 설명 § 7.1.1 참조 정정 — CONTENT_STANDARDS § 7.1.1 명시 |
docs/core/DESIGN_TOKENS.md:950:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 0 요약 fail 조건 정밀화 — § 2.4 색상·shadow만 semantic 의무로 일치. typography·spacing·radius·motion 허용 명시, (2) § 2.1 primitive 목록 완전화 — green·amber 색상 추가, breakpoint·container·border.width·font.weight·line.height·letter.spacing 추가. § 4.2·§ 5.1 표 SoT와 정합 (font.size 11단계·spacing 13단계), (3) § 2.1 font.size 범위 12~72로 정합, (4) § 2.1 spacing 범위 0~64로 정합, (5) § 3.2 overlay 그룹 raw rgba 예외 규칙 명시 — `color.overlay.*`만 직접 rgba 허용. 다른 semantic은 primitive alias 의무 유지, (6) § 9.4.0 BrandTokens 세부 타입 정의 — ColorTokens(15필드)·TypographyTokens·RadiusScale·ShadowScale + 평면화 규칙(dot path → underscore), (7) § 9.4.1 dark theme-color 산출 명시 — dark resolve 결과 + media 쿼리 별도. 미디어 미지정이 light 기본값, (8) DT-07 해소 — `private.*` dot 컨벤션 확정. § 13.1 해소 표에 추가 |
docs/core/DESIGN_TOKENS.md:951:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 1.2 SoT 4파일 구조 통일 (`primitive`·`semantic.light`·`semantic.dark`·`component` tokens.json) — 단일 core.tokens.json 잔재 제거. § 10.1 흐름도 4파일 머지 명시, (2) § 0·§ 12 fail 조건 좁힘 — 색상·shadow component에서 primitive 직접 참조만 fail. typography·spacing·radius·motion 허용, (3) § 2.1 primitive 목록 shadow 잔재 제거 — shadow는 semantic 단계 명시. font.weight·line.height·letter.spacing·border.width 추가, (4) modal.overlay 직접 hex → semantic `color.overlay.modal` 분리. `color.overlay.scrim`도 신설, (5) § 9.4 personaMode enum 정규화 규칙 명시 — PascalCase → lowercase preset slug, (6) § 9.4 BrandTokens.spacing — primitive scale 배수 override(tight 0.85·standard 1.0·spacious 1.25) + MAJOR 변경 명시, (7) **SEARCH_STANDARDIZATION SS-05 해소 cascade** — § 9.4.1 theme-color light/dark 출력이 SoT임을 SEARCH_STANDARDIZATION § 9.1에 기록, (8) `private:` prefix → `private.*` dot 네임스페이스로 정정 — JSON path·CSS 변수명·tokens.json 모두 동일 형식, (9) § 11.2 검증 색상 쌍에서 `color.border.default` 제거 — WCAG 1.4.11 비대상(일반 시각 분리 border). 30개 쌍으로 정합, (10) § 11.3·§ 11.4 헤딩 번호 중복 정정 |
docs/core/DESIGN_TOKENS.md:952:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (10개 지적 전건 수용)**: (1) § 2.4 참조 규칙 정밀화 — color·shadow는 semantic 의무, spacing·radius·font·motion은 primitive 허용. component→component 금지, (2) § 3.1·§ 3.2 `color.white`·`color.black` primitive 절대값 추가. semantic `white` 잔재 정정, (3) § 9.4 DATA_MODEL C-07 BrandTokens 매핑 표 + § 9.4.1 theme-color SEARCH_STANDARDIZATION 정합, (4) § 9.2 Style Dictionary v3+ 표준 포맷으로 재작성 — primitive/semantic.light/semantic.dark/component 파일 분리, DTCG type 필드 명시, (5) § 6.2 shadow를 semantic theme-aware로 이동 — primitive 무관 원칙 보호. light·dark opacity 명시(DT-04 해소), (6) § 10.3 머지 알고리즘 강화 — 타입별 머지·theme별 머지·alias 재해석 순서·unknown key 처리(`private:` prefix)·접근성 재검증·순환 참조 검출, (7) § 11.2 자동 검증 색상 쌍 카탈로그 16개 × 2테마 = 32개 명시. Preset/Instance brand 변경 시 재검증 자동, (8) § 4.1 한국어 폰트 — Pretendard 우선 + § 4.1.1 웹폰트 로딩 정책(font-display: swap·preload·OFL 라이선스 검토 완료) + § 4.1.2 letter-spacing 한국어 본문 적용 제한, (9) § 8.7~§ 8.14 컴포넌트 토큰 카탈로그 확장 8종(table·accordion·tabs·nav/header/footer·modal·toast·avatar/breadcrumb·CTA cluster·timeline/map/embed), (10) § 13 미결정 정리 — § 3.4 primitive hex 카탈로그(DT-02 해소) + § 6.2 dark shadow(DT-04 해소). DT-06·DT-07 신설 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:13:- `docs/core/SEARCH_STANDARDIZATION.md` — § 2 메타 태그 표준 (theme-color · og:type 매핑) · § 3 robots.txt (aiCrawlerPolicy + 4계열 user-agent + disallowTraining starter) · § 4.3 sitemap changefreq/priority · § 5 canonical resolve.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:16:- `docs/core/DESIGN_TOKENS.md` v1.0 — 3-tier 토큰 (primitive·semantic·component) · § 3.2 light/dark semantic 22 · § 3.3 `data-theme="light"|"dark"` 분기 · semantic naming SoT (`color.surface.background` 등).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:34:- 노출 의도 일직선: SEARCH_STANDARDIZATION 정합 robots/sitemap/canonical · schema.org JSON-LD · Next.js metadata · theme-color · OpenGraph · 자체 JSON-LD rule checker 같은 검색·AI 인용 신호를 v0.1 단계부터 표준 정합으로 출력.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:48:| Next metadata API + theme-color + og:type 매핑 (cycle1 PSR-10 정정) | title · description · canonical · OpenGraph · Twitter · robots · `themeColor` 2값 (light/dark) · og:type P-004 `profile`, P-006/P-010 `article`, 기타 `website` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:348:| `bg-canvas` · `bg-surface` | `color.surface.background` | `--color-surface-background` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:357:| `bg-brand` · `text-brand` | `color.brand.primary` | `--color-brand-primary` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:358:| `bg-brand-hover` | `color.brand.primary.hover` | `--color-brand-primary-hover` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:373:- (PSR-COMP-11 · cycle1 PSR-13) Tailwind alias 는 semantic 22 round-trip 보장 — `bg-canvas` ↔ `color.surface.background` ↔ `--color-surface-background`. 본 표가 SoT.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:378:  --color-surface-background: #f9fafb;  /* gray.50 */
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:383:  --color-surface-background: #111827;  /* gray.900 */
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:384:  --color-text-primary: #f9fafb;        /* gray.50 */
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:416:  themeColor: [
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:417:    { media: "(prefers-color-scheme: light)", color: "<BrandTokens.colors.light.primary>" },  // 평면화 결과 (DESIGN_TOKENS § 6 BrandTokens · `color.brand.primary` light)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:418:    { media: "(prefers-color-scheme: dark)", color: "<BrandTokens.colors.dark.primary>" },    // 평면화 결과 — `color.brand.primary` dark
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:424:- (PSR-SEO-02 · cycle1 PSR-10 + cycle2 PSR-23 정정) `themeColor` 2값 출처 — DESIGN_TOKENS § 6 `BrandTokens.colors.light.primary` / `BrandTokens.colors.dark.primary` (= `color.brand.primary` 의 light/dark 평면화 결과). 인스턴스별 brandTokens 미주입 단계 (v0.1) 는 DESIGN_TOKENS § 3.2 default `color.brand.primary` light = `blue.600` (#2563eb) / dark = `blue.400` (#60a5fa) fallback. SEARCH_STANDARDIZATION § 2.1 정합.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:610:| 21 | Next metadata API `themeColor` 2값 (light + dark) 출력 — cycle1 PSR-10 | `<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f9fafb">` + dark 변형 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:629:| 12 | Next metadata API (페이지별 generateMetadata · themeColor · og:type) | 각 page.tsx 안 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:689:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:690:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |

 succeeded in 684ms:
docs/decisions/M0_BUILD_EXPORT_PLAN.md:51:### 2.1 PUBLIC_SITE_RENDER_PLAN SSR 컴포넌트 재사용 (PSR-CASCADE-03)
docs/decisions/M0_BUILD_EXPORT_PLAN.md:53:`PUBLIC_SITE_RENDER_PLAN.md` v0.x 가 apps/web 안 `(site)` route group · SSR + Next ISR 로 먼저 공개 페이지를 렌더한다 (Phase 0). 본 M0 v1.0 본 구현 시점에 같은 컴포넌트 트리를 정적 build/export 로 재사용한다:
docs/decisions/M0_BUILD_EXPORT_PLAN.md:55:| 영역 | v0.x SSR 위치 | M0 v1.0 본 구현 변환 |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:58:| JSON-LD 생성기 | `apps/web/src/lib/json-ld/*` (페이지 타입 별 graph builder) | 동일 코드 — build-time 호출 → HTML 안 inline |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:59:| sitemap.xml / robots.txt | `apps/web/src/app/(site)/[instanceSlug]/{sitemap.xml,robots.txt}/route.ts` | static file generate — instance 별 directory 안 `sitemap.xml` · `robots.txt` |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:60:| Markdown 렌더 | `apps/web/src/lib/markdown.ts` (sanitize-html) | 동일 — build-time pre-render |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:61:| 디자인 토큰 (Tailwind + CSS vars) | `apps/web/tailwind.config.ts` + `globals.css` (light/dark 둘 다 출력) | 동일 — build-time CSS extraction |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:65:본 § 2.1 은 `PUBLIC_SITE_RENDER_PLAN` 의 acceptance precondition cascade (PSR-CASCADE-03) — apps/worker 구현 시 별도 컴포넌트 작성 부담 없음. 본 plan v1.0 합류 시 § 2.1 상세화.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:5:본 문서는 `apps/web` 안에 **`(site)` route group**(공개 사이트)을 신설하고, 어드민 route 도 동시에 **`/admin/<instanceSlug>/...`** prefix 로 격상해 path namespace 충돌을 해소한다. 어드민에서 저장한 6 entity (ClinicProfile · LocationProfile · DoctorProfile · TreatmentPage · Article · LegalDocument)를 minimal 디자인 + 정합 JSON-LD + SEARCH_STANDARDIZATION v1.1 정합 robots/sitemap 과 함께 렌더한다.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:7:> **scope limit (PSR-INTRO-01)**: 본 plan 은 **SSR + Next ISR** 만 다룬다. static export to Git · 도메인 매핑 (subdomain / custom domain) · CDN cache 정책 · Open Graph 이미지 동적 생성 · dark mode UI toggle 등은 M0 v1.0 본 구현 / M1 cascade. v0.1 은 `/<instanceSlug>/...` path-based routing 으로 **개발자가 접근 가능한 단계** 까지.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:13:- `docs/core/SEARCH_STANDARDIZATION.md` — § 2 메타 태그 표준 (theme-color · og:type 매핑) · § 3 robots.txt (aiCrawlerPolicy + 4계열 user-agent + disallowTraining starter) · § 4.3 sitemap changefreq/priority · § 5 canonical resolve.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:24:  - `packages/core-content/src/schema.ts` v0.3 (Drizzle SoT — 실 column 명: `title`/`body_markdown`)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:33:- M0 v1.0 본 구현(static export to Git) 의 콘텐츠 변환 룰(JSON-LD·SEO meta·페이지 graph)을 v0.1 SSR 시점에 미리 확정 → 본 구현 시점에 코드 재사용.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:34:- 노출 의도 일직선: SEARCH_STANDARDIZATION 정합 robots/sitemap/canonical · schema.org JSON-LD · Next.js metadata · theme-color · OpenGraph · 자체 JSON-LD rule checker 같은 검색·AI 인용 신호를 v0.1 단계부터 표준 정합으로 출력.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:45:| SSR + Next ISR | `export const revalidate = 60` minimal |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:46:| 페이지 컴포넌트 minimal | Hero · About · DoctorCard · TreatmentCard · ArticleBody · ContactCard · LegalRenderer · LocationCard · Footer · Header · BreadcrumbList |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:48:| Next metadata API + theme-color + og:type 매핑 (cycle1 PSR-10 정정) | title · description · canonical · OpenGraph · Twitter · robots · `themeColor` 2값 (light/dark) · og:type P-004 `profile`, P-006/P-010 `article`, 기타 `website` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:49:| sitemap.xml · robots.txt (cycle1 PSR-04·09 정정) | per-instance · SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` required + § 4.3 changefreq/priority SoT 정합 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:50:| 디자인 토큰 통합 + light/dark CSS vars 출력 (cycle1 PSR-13·14 정정) | Tailwind v3.4 + DESIGN_TOKENS v1.0 semantic 22 alias 표. CSS custom property 는 light/dark 둘 다 출력. UI toggle 만 defer |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:53:| Markdown sanitizer SSR 정합 (cycle1 PSR-19·20 정정) | `sanitize-html` (SSR 호환) + 외부 링크 `rel="nofollow noopener noreferrer"` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:64:| 검색 콘솔 sitemap submission 자동화 | M1 Phase Alpha | PSR-DEFER-05 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:90:│     ├─ about/page.tsx                  -- P-002 About
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:104:│     ├─ sitemap.xml/route.ts            -- per-instance sitemap
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:105:│     ├─ robots.txt/route.ts             -- per-instance robots
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:253:- **cycle2 PSR-28 patch (acceptance precondition · plan acceptance commit 동반)**: 현 root layout 의 `<body className="bg-slate-50 text-slate-900">` 임시 토큰 → DESIGN_TOKENS v1.0 semantic alias (`bg-canvas` · `text-fg-default`) 로 전환. § 8 작업 #14 Tailwind v0.2 patch + globals.css 안 CSS vars 적용 + root layout className 변경 모두 acceptance 직전 동시 적용.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:263:      <SiteHeader initial={initial} />
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:265:      <SiteFooter initial={initial} />
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:273:- (PSR-COMP-03 · cycle2 PSR-26 정정) Header: ClinicProfile.name + 네비 (Home · About · Doctors · Treatments · Contact · Locations · CTA primaryCtas[0]). Footer: 주소·전화·진료시간. **법적 페이지 5종 링크는 v0.1 단계 숨김** — LegalDocument 공개 노출이 PSR-DEFER-13 (= LL-DEFER-01 alias) 합류 시점까지 404 이므로 broken link 회피. 합류 후 Footer 에 동적 추가 (LegalDocument 가 published 상태 row 가 존재할 때만 렌더).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:274:- (PSR-COMP-04) `loadSiteInitial` 가 layout 안에서 한 번 SELECT — Header/Footer 가 같은 데이터 사용. 페이지 안 별도 SELECT 는 entity 별 추가 데이터만.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:282:| ClinicProfile | `name` | C-01 `name` | Hero/Header/Footer |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:283:| ClinicProfile | `description` | C-01 `description` | Hero · OG description fallback |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:284:| ClinicProfile | `long_description` | C-01 `longDescription` | About 본문 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:285:| ClinicProfile | `slogan` | C-01 `slogan` | Hero subtitle |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:286:| ClinicProfile | `logo_url` | C-01 `logoUrl` | Header logo |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:290:| LocationProfile | `phone` | C-21 `telephone` | Contact/Footer |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:291:| LocationProfile | `email` | C-21 `email` | Contact/Footer |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:299:| TreatmentPage | `body_markdown` | C-03 `bodyMarkdown` (contract `body`) | ArticleBody render |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:300:| TreatmentPage | `hero_image_url` | C-03 `heroImageUrl` | Hero image · OG fallback |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:301:| TreatmentPage | `published_at` | C-03 `publishedAt` (== `dateModified` v0.1) | sitemap lastmod · Article meta |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:304:| Article | `body_markdown` | C-04 `bodyMarkdown` (contract `body`) | ArticleBody render |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:305:| Article | `hero_image_url` | C-04 `heroImageUrl` | Hero · OG |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:306:| Article | `published_at` | C-04 `datePublished` / `dateModified` v0.1 | sitemap lastmod |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:314:- (PSR-COMP-06) public renderer 는 **Drizzle column 명을 직접 사용** + 컴포넌트 prop 으로 넘길 때 contract semantic name 사용 (예: `<TreatmentHero title={row.title}>` 의 prop 명은 `name` 으로 — DATA_MODEL contract 일관). renderer 코드 안에 mapping function `normalizeTreatment(row)` / `normalizeArticle(row)` 두기.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:321:| P-001 Home | `<Hero>` (slogan/description) · `<DoctorsTeaser>` (3명) · `<TreatmentsTeaser>` (3건) · `<ContactCard>` | ClinicProfile + LocationMain + DoctorProfile (active LIMIT 3 ORDER BY displayOrder ASC) + TreatmentPage (published LIMIT 3 ORDER BY publishedAt DESC) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:322:| P-002 About | `<ArticleBody markdown={clinic.long_description}>` · `<FoundingInfo>` | ClinicProfile |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:323:| P-003 Doctors List | `<DoctorCard>` grid | DoctorProfile (active ORDER BY displayOrder ASC, id ASC) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:324:| P-004 Doctor Profile | `<DoctorHero>` · `<ArticleBody markdown={doctor.bio}>` · `<RelatedTreatments>` · `<RelatedArticles>` | DoctorProfile + 본인 author Articles |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:325:| P-005 Treatments List | `<TreatmentCard>` grid | TreatmentPage (RLS 자동 published only ORDER BY publishedAt DESC) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:326:| P-006 Treatment Detail | `<TreatmentHero>` · `<ArticleBody markdown={treatment.body_markdown}>` · `<TreatmentSummary>` · `<ContactCta>` | TreatmentPage |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:327:| P-010 Article Detail (1샘플) | `<ArticleHero>` (title·summary·publishedAt·author) · `<ArticleBody markdown={article.body_markdown}>` | Article + author Doctor |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:328:| P-012 Contact | `<ContactHero>` · `<BusinessHoursTable>` (CT-02 SoT 형식 — 7요일 + 점심 + 특수 휴진) · `<ReservationChannels>` (primaryCtas[]) | LocationMain + ClinicProfile.primary_ctas |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:330:| P-014 Location Detail `/locations/[slug]` | `<LocationHero>` · `<LocationAddress>` · `<BusinessHoursTable>` · `<ReservationChannels>` · `<DirectionsAndParking>` (metadata 안 info v0.1 fallback 미입력) | LocationProfile (slug='main' v0.1) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:332:### 4.4 ArticleBody (Markdown → HTML) (PSR-COMP-09) — cycle1 PSR-19·20 정정
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:334:- `apps/web/src/lib/markdown.ts` 신설 — SSR 호환 sanitizer:
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:335:  - 채택: **`sanitize-html`** (SSR 호환 · 의존성 작음) 또는 `rehype-sanitize` (unified pipeline · 더 표준)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:346:| Tailwind class | semantic token (DESIGN_TOKENS SoT) | CSS custom property (v0.1 신설) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:373:- (PSR-COMP-11 · cycle1 PSR-13) Tailwind alias 는 semantic 22 round-trip 보장 — `bg-canvas` ↔ `color.surface.background` ↔ `--color-surface-background`. 본 표가 SoT.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:374:- (PSR-COMP-12 · cycle1 PSR-14) light/dark CSS vars 둘 다 출력. `apps/web/src/styles/globals.css`:
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:412:  robots: {
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:430:### 5.2 sitemap.xml — cycle1 PSR-09 정정 (PSR-SEO-07)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:432:- `apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts` — Next Route Handler.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:439:| P-002 About | monthly | 0.8 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:446:| P-013 Legal | yearly | 0.3 (v0.1 단계 sitemap 에서 제외 — noindex) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:454:- M0 v1.0 합류 시 static sitemap.xml 도 export.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:456:### 5.3 robots.txt — cycle1 PSR-04 정정 (PSR-SEO-08)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:458:- `apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts` — Next Route Handler.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:468:# robots.txt — auto-generated (Glitzy · SEARCH_STANDARDIZATION § 3.3 disallowTraining)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:525:Sitemap: https://<host>/<instanceSlug>/sitemap.xml
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:532:  - SEARCH_STANDARDIZATION § 3.3.1 룰 적용 (`/admin/`·`/auth/`·`/api/` 공통 차단 · `noIndex: true` 페이지는 robots 차단 X · `environment` 별 결정)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:543:| P-002 About | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] WebPage` · `[풀] BreadcrumbList` · `WebSite` 참조 (`isPartOf`) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:544:| P-003 Doctors List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(Physician refs) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:545:| P-004 Doctor Profile | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Physician` · `[풀] WebPage` · `[풀] BreadcrumbList` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:546:| P-005 Treatments List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(MedicalProcedure refs) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:547:| P-006 Treatment Detail | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] MedicalProcedure` · `[풀] WebPage` · `[풀] BreadcrumbList` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:548:| P-010 Article Detail | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Article` · `[풀] WebPage` · `[풀] BreadcrumbList` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:549:| P-012 Contact | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] WebPage` · `[풀] BreadcrumbList` (cycle1 PSR-07: ContactPage 삭제 · SoT 는 WebPage + MedicalClinic 풀) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:550:| P-013 Legal/Policy | (v0.1 단계 미노출 — graph 출력 없음) · 정상 노출 시 `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:551:| P-014 Location Detail | `[풀] Organization` · `[풀] MedicalClinic`(`#clinic` 단지점 main 의 entity @id 그대로 — SCHEMA_MAPPING § 1.4 정합) · `[풀] WebPage` · `[풀] BreadcrumbList` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:557:  - rule checker 위치: `apps/web/src/lib/json-ld/__tests__/validate.ts` 신설
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:580:| 8 | Tailwind v0.2 patch — DESIGN_TOKENS v1.0 semantic 22 alias + globals.css 안 CSS vars (light + dark 양쪽) | acceptance precondition |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:595:| 6 | TreatmentPage `/<instanceSlug>/treatments/<slug>` 진입 시 body_markdown 렌더링 | `<h1>`·`<h2>`·`<p>` 표준 출력 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:600:| 11 | `/<instanceSlug>/sitemap.xml` 응답 | XML sitemap (P-013 제외 9페이지 + 동적 slug) + SEARCH_STANDARDIZATION § 4.3 changefreq/priority 정확 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:601:| 12 | `/<instanceSlug>/robots.txt` 응답 | SEARCH_STANDARDIZATION § 3 v0.1 starter `disallowTraining` 정합 (학습 봇 Disallow + 답변 봇 Allow + Naver Yeti Allow) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:606:| 17 | sitemap.xml 의 lastmod 가 entity updatedAt (Article 은 datePublished/publishedAt) 과 정확히 일치 | ISO 8601 형식 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:609:| 20 | Markdown ArticleBody 안 외부 링크 `rel="nofollow noopener noreferrer"` (cycle1 PSR-20) | 내부 링크 (`/<slug>/...`) 는 그대로 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:612:| 23 | P-013 Legal route 가 noindex robots meta + sitemap 제외 (cycle1 PSR-06) | `<meta name="robots" content="noindex,follow">` + sitemap.xml 에 없음 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:625:| 8 | 사이트 컴포넌트 (Hero · DoctorCard · TreatmentCard · ArticleBody · ContactCard · LocationCard · BreadcrumbList 등) | apps/web/src/components/site/* |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:626:| 9 | Markdown 렌더 (`sanitize-html` + 외부 링크 rel) | apps/web/src/lib/markdown.ts |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:627:| 10 | JSON-LD 생성기 (페이지 타입 별 graph builder · normalize projection 사용) | apps/web/src/lib/json-ld/* |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:628:| 11 | 자체 JSON-LD rule checker (LOCAL_PASS) | apps/web/src/lib/json-ld/__tests__/validate.ts |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:630:| 13 | sitemap.xml + robots.txt route handler (SEARCH_STANDARDIZATION 정합) | apps/web/src/app/(site)/[instanceSlug]/{sitemap.xml,robots.txt}/route.ts |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:631:| 14 | Tailwind v0.2 patch — DESIGN_TOKENS v1.0 semantic 22 alias + globals.css light/dark | apps/web/tailwind.config.ts · src/styles/globals.css |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:635:| 18 | docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2 patch — apps/worker 가 본 plan SSR 컴포넌트 재사용 marker (PSR-CASCADE-03) | doc |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:644:- `PSR-DEFER-01`: static export to Git — apps/worker + isomorphic-git/simple-git. v0.1 SSR 의 컴포넌트 트리 재사용 + `generateStaticParams` + `next export`.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:654:- `PSR-DEFER-05`: 검색 콘솔 sitemap submission 자동화.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:678:  - **PSR-CASCADE-01b (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEGAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · doctors · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/seed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance ≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 에서 별도 사이클 진행.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:680:- `PSR-CASCADE-03`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 patch — apps/worker 의 build/export 시점에 본 plan SSR 컴포넌트 + JSON-LD 생성기 + sitemap/robots route handler 재사용 marker.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:689:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:690:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |

 succeeded in 689ms:
"postgres" "postgres"
"app_tenant_user" "app_tenant_pw"

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "tsx|ts-node|migrations-runner|typecheck|vitest|validateManifest" package.json packages/migrations-runner/package.json tsconfig.json' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "Organization|MedicalClinic|Physician|MedicalProcedure|Article|WebSite|WebPage|@id|#organization|#clinic|#physician|#procedure|#article|#website|#webpage" docs/core/SCHEMA_MAPPING.md docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' in C:\Users\assag\solution\website-exposure
2026-05-18T03:57:26.536179Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
package.json:11:    "pkg:build": "pnpm --filter @glitzy/shared-types build && pnpm --filter @glitzy/shared-errors build && pnpm --filter @glitzy/db build && pnpm --filter @glitzy/auth build && pnpm --filter @glitzy/storage build && pnpm --filter @glitzy/notifications-outbox build && pnpm --filter @glitzy/migrations-runner build && pnpm --filter @glitzy/core-content build",
package.json:12:    "pkg:typecheck": "pnpm pkg:build && pnpm --filter @glitzy/shared-types typecheck && pnpm --filter @glitzy/shared-errors typecheck && pnpm --filter @glitzy/db typecheck && pnpm --filter @glitzy/auth typecheck && pnpm --filter @glitzy/storage typecheck && pnpm --filter @glitzy/notifications-outbox typecheck && pnpm --filter @glitzy/migrations-runner typecheck && pnpm --filter @glitzy/core-content typecheck",
package.json:16:    "typecheck:all": "pnpm pkg:typecheck && pnpm --filter @glitzy/web typecheck",
packages/migrations-runner/package.json:2:  "name": "@glitzy/migrations-runner",
packages/migrations-runner/package.json:13:    "typecheck": "tsc --noEmit -p tsconfig.json"
rg: tsconfig.json: 지정된 파일을 찾을 수 없습니다. (os error 2)

 exited 1 in 596ms:
package.json:11:    "pkg:build": "pnpm --filter @glitzy/shared-types build && pnpm --filter @glitzy/shared-errors build && pnpm --filter @glitzy/db build && pnpm --filter @glitzy/auth build && pnpm --filter @glitzy/storage build && pnpm --filter @glitzy/notifications-outbox build && pnpm --filter @glitzy/migrations-runner build && pnpm --filter @glitzy/core-content build",
package.json:12:    "pkg:typecheck": "pnpm pkg:build && pnpm --filter @glitzy/shared-types typecheck && pnpm --filter @glitzy/shared-errors typecheck && pnpm --filter @glitzy/db typecheck && pnpm --filter @glitzy/auth typecheck && pnpm --filter @glitzy/storage typecheck && pnpm --filter @glitzy/notifications-outbox typecheck && pnpm --filter @glitzy/migrations-runner typecheck && pnpm --filter @glitzy/core-content typecheck",
package.json:16:    "typecheck:all": "pnpm pkg:typecheck && pnpm --filter @glitzy/web typecheck",
packages/migrations-runner/package.json:2:  "name": "@glitzy/migrations-runner",
packages/migrations-runner/package.json:13:    "typecheck": "tsc --noEmit -p tsconfig.json"
rg: tsconfig.json: 지정된 파일을 찾을 수 없습니다. (os error 2)

 succeeded in 594ms:
docs/core/SCHEMA_MAPPING.md:20:- 핵심 schema: `Organization`·`MedicalClinic`·`Physician`·`MedicalProcedure`·`MedicalCondition`·`Article`·`FAQPage`·`BreadcrumbList`·`WebSite`. (`MedicalClinic`은 LocalBusiness sub-class이므로 별도 `LocalBusiness` 타입 출력 안 함)
docs/core/SCHEMA_MAPPING.md:21:- 단지점·다지점은 **`MedicalClinic` 지점 entity가 LocationProfile 1:1 매핑**. ClinicProfile은 `Organization`(상위 entity), 본원 LocationProfile은 본원 `MedicalClinic`(`#clinic`)으로 표현.
docs/core/SCHEMA_MAPPING.md:33:**Core가 출력하는 JSON-LD는 페이지당 단일 `<script type="application/ld+json">` 블록**으로 통합 그래프 출력. (외부 통합 — 네이버 예약 위젯·카카오톡 등 — 이 자체 schema를 삽입할 수 있으나 Core 책임 외. Core graph와 충돌 시 entity @id 중복 검출은 빌드 시 경고.)
docs/core/SCHEMA_MAPPING.md:40:    { "@type": "Organization", "@id": "...", ... },
docs/core/SCHEMA_MAPPING.md:41:    { "@type": "MedicalClinic", "@id": "...", ... },
docs/core/SCHEMA_MAPPING.md:43:    { "@type": "Article", "@id": "...", ... }
docs/core/SCHEMA_MAPPING.md:50:- 통합 그래프 사용 이유: entity cross-reference(@id 참조)가 깔끔, validator·검색 엔진의 entity 해석 명확.
docs/core/SCHEMA_MAPPING.md:52:### 1.2 `@id` 네이밍 규약
docs/core/SCHEMA_MAPPING.md:54:| Entity | `@id` 패턴 | 예시 |
docs/core/SCHEMA_MAPPING.md:56:| `Organization` (ClinicProfile) | `https://{domain}/#organization` | `https://example.com/#organization` |
docs/core/SCHEMA_MAPPING.md:57:| `MedicalClinic` 본원 (LocationProfile main) | `https://{domain}/#clinic` | `https://example.com/#clinic` |
docs/core/SCHEMA_MAPPING.md:58:| `MedicalClinic` 지점 (LocationProfile main 외) | `https://{domain}/locations/{slug}#clinic` | `https://example.com/locations/gangnam#clinic` |
docs/core/SCHEMA_MAPPING.md:59:| `Physician` (DoctorProfile) | `https://{domain}/doctors/{slug}#physician` | |
docs/core/SCHEMA_MAPPING.md:60:| `MedicalProcedure` (TreatmentPage) | `https://{domain}/treatments/{slug}#procedure` | |
docs/core/SCHEMA_MAPPING.md:62:| `Article` | `https://{domain}/insights/{category}/{slug}#article` | |
docs/core/SCHEMA_MAPPING.md:63:| `WebSite` | `https://{domain}/#website` | |
docs/core/SCHEMA_MAPPING.md:64:| `WebPage` | `https://{domain}{path}#webpage` | 본문 페이지 entity |
docs/core/SCHEMA_MAPPING.md:66:> `@id`는 dereferenceable URL + fragment 형식. 같은 entity는 항상 같은 `@id`를 사용해 페이지 간 일관성 확보.
docs/core/SCHEMA_MAPPING.md:68:#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)
docs/core/SCHEMA_MAPPING.md:70:`PUBLIC_SITE_RENDER_PLAN.md` v0.x § 5.4 PSR-SEO-12 의 SSR + path-based routing 단계 (Phase 0) 에서는 도메인 매핑 (subdomain/custom domain) 합류 전이므로 **임시로 instanceSlug 가 path 에 들어간 `@id` 패턴** 을 사용한다:
docs/core/SCHEMA_MAPPING.md:74:| `Organization` | `https://<host>/<instanceSlug>/#organization` | `https://<customDomain>/#organization` |
docs/core/SCHEMA_MAPPING.md:75:| `MedicalClinic` (`#clinic` 본원) | `https://<host>/<instanceSlug>/#clinic` | `https://<customDomain>/#clinic` |
docs/core/SCHEMA_MAPPING.md:76:| `Physician` | `https://<host>/<instanceSlug>/doctors/<slug>#physician` | `https://<customDomain>/doctors/<slug>#physician` |
docs/core/SCHEMA_MAPPING.md:77:| `MedicalProcedure` | `https://<host>/<instanceSlug>/treatments/<slug>#procedure` | `https://<customDomain>/treatments/<slug>#procedure` |
docs/core/SCHEMA_MAPPING.md:78:| `Article` | `https://<host>/<instanceSlug>/insights/<category>/<slug>#article` | `https://<customDomain>/insights/<category>/<slug>#article` |
docs/core/SCHEMA_MAPPING.md:79:| `WebSite` | `https://<host>/<instanceSlug>/#website` | `https://<customDomain>/#website` |
docs/core/SCHEMA_MAPPING.md:80:| `WebPage` | `https://<host>/<instanceSlug><path>#webpage` | `https://<customDomain><path>#webpage` |
docs/core/SCHEMA_MAPPING.md:83:- 도메인 매핑 후 entity `@id` 가 변경된다. 검색 엔진의 entity 연속성 (knowledge graph 등) 을 위해:
docs/core/SCHEMA_MAPPING.md:85:  - **`sameAs` 보조 marker**: M0 단계 Organization/MedicalClinic 의 `sameAs` 배열 에 v0.1 path-based URL 을 한시 (3~6 개월) 포함하여 entity identity 연속성 신호 제공
docs/core/SCHEMA_MAPPING.md:91:다른 entity 참조는 `@id`만 사용:
docs/core/SCHEMA_MAPPING.md:95:  "@type": "Article",
docs/core/SCHEMA_MAPPING.md:96:  "@id": "https://example.com/insights/diet/yoyo#article",
docs/core/SCHEMA_MAPPING.md:97:  "author": { "@id": "https://example.com/doctors/hong#physician" },
docs/core/SCHEMA_MAPPING.md:98:  "publisher": { "@id": "https://example.com/#organization" }
docs/core/SCHEMA_MAPPING.md:102:전체 entity 정의는 페이지 그래프 안에 한 번만. 다른 위치는 `@id`만으로 참조.
docs/core/SCHEMA_MAPPING.md:106:본원은 항상 단일 entity `#clinic`로 통일. 다지점의 비본원 지점만 별도 entity. **alias 사용 안 함** (entity identity 명확성).
docs/core/SCHEMA_MAPPING.md:108:| 인스턴스 형태 | Organization | MedicalClinic |
docs/core/SCHEMA_MAPPING.md:110:| **단지점** | `Organization`(`#organization`) 1개 | **`MedicalClinic`(`#clinic`) 1개** — LocationProfile(slug=`main`)에 매핑. P-014 페이지(URL `/locations/main`)의 mainEntity도 같은 `#clinic` (URL ≠ entity @id) |
docs/core/SCHEMA_MAPPING.md:111:| **다지점** | `Organization`(`#organization`) 1개 | **본원: `MedicalClinic`(`#clinic`)** — LocationProfile(slug=`main`). **비본원 지점들: `MedicalClinic`(`/locations/{slug}#clinic`)** 각각 별도 entity. 모두 `parentOrganization` = Organization |
docs/core/SCHEMA_MAPPING.md:113:> P-014 페이지가 단지점 main을 다룰 때도 entity @id는 `#clinic` 유지 — URL은 `/locations/main`이지만 mainEntity 참조는 `#clinic`. 다지점 비본원 지점 P-014만 `/locations/{slug}#clinic` entity 사용.
docs/core/SCHEMA_MAPPING.md:115:**`Organization` vs `MedicalClinic`의 책임 분리**:
docs/core/SCHEMA_MAPPING.md:116:- `Organization`: 법인 정체성 (ClinicProfile의 `legalEntityName`·`founder`·`foundingDate`·`awards`·`memberOf`·`affiliatedInstitutes`)
docs/core/SCHEMA_MAPPING.md:117:- `MedicalClinic`: 지점 단위 의료기관 정체성 (LocationProfile의 `address`·`telephone`·`openingHours`·`geo`·`medicalSpecialty` 등). `parentOrganization`으로 `Organization` 참조.
docs/core/SCHEMA_MAPPING.md:125:| `Article`·`NewsArticle`·`BlogPosting`·`WebPage`·`FAQPage`·`Blog`·`VideoObject`·`ImageObject` 등 CreativeWork 계열 | `Organization`·`MedicalClinic`·`LocalBusiness`·`Physician`·`Person`·`ContactPoint` 등 — Schema.org 표준상 inLanguage 속성 부재 또는 부적합 |
docs/core/SCHEMA_MAPPING.md:127:> Organization·MedicalClinic·Physician 같은 entity에 inLanguage를 박으면 validator 노이즈. 보조 메타로 헤더의 `<html lang="ko-KR">`·meta inLanguage가 이미 표시함 (SEARCH_STANDARDIZATION § 2.1 정합).
docs/core/SCHEMA_MAPPING.md:139:| `Organization` | 모든 페이지 (그래프에 1회) | ClinicProfile (C-01) |
docs/core/SCHEMA_MAPPING.md:140:| `WebSite` | **Home만 풀 엔티티 출력**. 나머지 페이지는 WebPage.isPartOf로 `#website` 참조만 (graph 비대화 방지) | (생성기 자동) |
docs/core/SCHEMA_MAPPING.md:141:| `WebPage` | 모든 페이지 — 본문 entity | PageMeta (C-06) |
docs/core/SCHEMA_MAPPING.md:143:| `MedicalClinic` | 본원(`#clinic`) — § 2.5 정책에 따라 페이지별 풀/참조. 다지점 비본원 지점은 P-012·P-014에서 N개 entity | LocationProfile (C-21) |
docs/core/SCHEMA_MAPPING.md:144:| `LocalBusiness` | **별도 출력 안 함** — `MedicalClinic`이 LocalBusiness sub-class. LocalBusiness 계열 속성(`address`·`openingHoursSpecification`·`geo`·`hasMap`·`potentialAction.ReserveAction`)은 `MedicalClinic` entity 위에서 사용 | (해당 없음 — 데이터는 LocationProfile, 타입은 MedicalClinic) |
docs/core/SCHEMA_MAPPING.md:145:| `Physician` | P-004 Doctor Profile, Article의 author·reviewedBy | DoctorProfile (C-02) |
docs/core/SCHEMA_MAPPING.md:146:| `MedicalProcedure` | P-006 Treatment Detail | TreatmentPage (C-03) |
docs/core/SCHEMA_MAPPING.md:148:| `Article` | P-010 Article Detail | Article (C-04) |
docs/core/SCHEMA_MAPPING.md:149:| `NewsArticle` | (대체 — News 카테고리) | NewsItem (C-19) |
docs/core/SCHEMA_MAPPING.md:154:| `VideoObject` | Article.embeddedMedia[].type=youtube·video, P-010의 contentFormat=video | EmbeddedMedia |
docs/core/SCHEMA_MAPPING.md:156:| `Person` | Author가 Physician이 아닌 경우 (`authorType` ≠ clinician) — **M0 외 후속** (현재 `Article.author: Ref<C-02>` 만 지원. authorType != clinician 케이스는 데이터 모델 확장 시 합류 — DM 추가) | (선택, M0 외) |
docs/core/SCHEMA_MAPPING.md:157:| `EducationalOrganization` / `MedicalOrganization` | `affiliatedInstitutes`·`memberOf` 참조 entity | ResearchInstitute, Affiliation |
docs/core/SCHEMA_MAPPING.md:162:| `SearchAction` | WebSite.potentialAction **Conditional** — `/search` 라우트가 실제 구현된 경우에만 출력. M0 미출력 | (생성기 자동) |
docs/core/SCHEMA_MAPPING.md:163:| `ReserveAction` | **MedicalClinic.potentialAction** — Conditional: **(a) `#clinic` 풀 entity가 출력되는 페이지에서만** + **(b) `LocationProfile.reservationChannels` 중 예약 채널이 실제 존재하거나 페이지/시술 CTA가 예약 채널일 때**. LocalBusiness 별도 미사용 | ReservationPage, LocationProfile.reservationChannels |
docs/core/SCHEMA_MAPPING.md:177:| `HealthAndBeautyBusiness` (단독·병행) | **fail** | MedicalClinic만 사용 |
docs/core/SCHEMA_MAPPING.md:188:- `Article` / `BlogPosting` / `NewsArticle` — 기사 리치 카드
docs/core/SCHEMA_MAPPING.md:191:- `LocalBusiness` 계열 (`MedicalClinic` 포함) — 로컬 비즈니스 패널 (Google 비즈니스 프로필 연계)
docs/core/SCHEMA_MAPPING.md:192:- `Person` / `Physician` — 의료진 카드 (제한적)
docs/core/SCHEMA_MAPPING.md:197:- `Organization` — 법인 identity
docs/core/SCHEMA_MAPPING.md:198:- `MedicalClinic` 본원·지점 — 의료기관 entity
docs/core/SCHEMA_MAPPING.md:199:- `Physician` — 의료진 entity (Rich Results는 제한적)
docs/core/SCHEMA_MAPPING.md:200:- `MedicalProcedure` / `MedicalCondition` — 의료 entity (Rich Results는 의료 분야 제한적)
docs/core/SCHEMA_MAPPING.md:201:- `WebPage` — 페이지 entity
docs/core/SCHEMA_MAPPING.md:202:- `WebSite` — 사이트 entity + SearchAction (Home에서만 풀)
docs/core/SCHEMA_MAPPING.md:220:| `Organization`·`WebSite` (Home)·`WebPage`·`BreadcrumbList` (Home 제외) | Allowed | |
docs/core/SCHEMA_MAPPING.md:221:| `MedicalClinic` | **§ 2.5 정책에 따라 full 또는 ref** | 본원(`#clinic`) 풀/참조 위치는 § 2.5 SoT. 다지점 비본원 지점은 P-012·P-014에 풀 |
docs/core/SCHEMA_MAPPING.md:222:| `Physician` 풀 엔티티 | Conditional | P-004 상세 페이지에서만 풀, 다른 페이지는 참조 |
docs/core/SCHEMA_MAPPING.md:223:| `MedicalProcedure` 풀 엔티티 | Conditional | P-006 상세 페이지에서만 풀 |
docs/core/SCHEMA_MAPPING.md:225:| `Article` 풀 엔티티 | Conditional | P-010 상세 페이지에서만 풀 |
docs/core/SCHEMA_MAPPING.md:228:| `VideoObject` | Conditional | Article.contentFormat=video 또는 embeddedMedia.type∈{youtube, vimeo, external-video} (최소 필드 충족 시) |
docs/core/SCHEMA_MAPPING.md:229:| `ReserveAction` | Conditional | **(a) `#clinic` 풀 entity가 출력되는 페이지** + **(b) `LocationProfile.reservationChannels` 중 예약 채널(type∈{naver-reservation, video-consultation, external}) 있거나 페이지/시술 CTA가 예약 채널일 때** — 두 조건 모두 충족 시 `MedicalClinic.potentialAction`으로 출력 |
docs/core/SCHEMA_MAPPING.md:237:| `HealthAndBeautyBusiness` | **Blocked (fail)** | 의료기관 사이트는 `MedicalClinic`만 사용. 단독·병행 모두 미사용 |
docs/core/SCHEMA_MAPPING.md:239:| `Quiz` (비표준)·`MedicalDiagnosis` | **Blocked** | P-106 Self-test는 `WebPage`·`MedicalWebPage`로 |
docs/core/SCHEMA_MAPPING.md:240:| `Person` — Organization.founder | Allowed (inline) | 항상 허용 — Organization 내부에서 founder를 Person으로 inline 표현 |
docs/core/SCHEMA_MAPPING.md:241:| `Person` — Article.author (authorType != clinician) | M0 외 후속 | M0는 Physician만 지원. 데이터 모델 확장 시 합류 |
docs/core/SCHEMA_MAPPING.md:248:- **풀 entity (Full)**: graph[]에 entity 정의 — `@type`, `@id`, 필드 모두 출력
docs/core/SCHEMA_MAPPING.md:249:- **참조 (Ref)**: graph[]에 entity 정의 없음. 다른 entity의 속성에 `{"@id": "..."}` 참조만 (예: `Article.publisher = {"@id": "#organization"}`)
docs/core/SCHEMA_MAPPING.md:253:| `Organization` (`#organization`) | **모든 페이지에 풀 entity 1회 포함** | P-001 ~ P-014, P-101 ~ P-106 |
docs/core/SCHEMA_MAPPING.md:254:| `WebSite` (`#website`) | **Home만 풀 entity** | P-001 |
docs/core/SCHEMA_MAPPING.md:255:| `WebSite` 참조 | **Home 외 모든 페이지 WebPage.isPartOf로 참조** | P-002 ~ |
docs/core/SCHEMA_MAPPING.md:256:| `MedicalClinic` (`#clinic` 본원) | **풀 entity 출력** — 위치·시간·연락이 본문에 의미 있게 표시되거나 예약 action이 풀 entity로 필요한 페이지 | P-001(Home), P-002(About), P-006(Treatment Detail — 예약 CTA·담당 의료진 연계), P-012(Contact), P-014(Location main), P-105(Reservation — 예약 action 풀 필요) |
docs/core/SCHEMA_MAPPING.md:257:| `MedicalClinic` 참조 | **참조만** — 위치 정보가 페이지 본문에 표시되지 않는 페이지 | P-003(Doctors List), P-004(Doctor Profile), **P-005(Treatments List — 시술 카드 목록 위주, 위치 슬롯 없음)**, P-007/8(Conditions), P-009/10(Articles), P-011(FAQ), P-013(Legal), P-101(Reviews), P-102(Pricing), P-103(Facilities), P-104(News), P-106(Self-test) |
docs/core/SCHEMA_MAPPING.md:258:| `MedicalClinic` 지점 (`/locations/{slug}#clinic`) | 다지점만, P-012·P-014에 풀 entity | 다지점 P-012·P-014 |
docs/core/SCHEMA_MAPPING.md:260:| `WebPage` | **모든 페이지 풀** (각 페이지의 본문 entity) | 전 페이지 |
docs/core/SCHEMA_MAPPING.md:261:| `Physician`, `MedicalProcedure`, `MedicalCondition`, `Article`, `FAQPage` | 상세 페이지에서 풀, 다른 페이지(목록·연관 참조)에서 참조 또는 inline 최소 | § 3 참조 |
docs/core/SCHEMA_MAPPING.md:274:1. `Organization` (ClinicProfile)
docs/core/SCHEMA_MAPPING.md:275:2. `MedicalClinic` (LocationProfile main) — 본원
docs/core/SCHEMA_MAPPING.md:276:3. `WebSite` (SearchAction 포함)
docs/core/SCHEMA_MAPPING.md:277:4. `WebPage` (Home의 본문 entity)
docs/core/SCHEMA_MAPPING.md:279:**Organization 필드 매핑**:
docs/core/SCHEMA_MAPPING.md:283:| `@type` | `"Organization"` |
docs/core/SCHEMA_MAPPING.md:284:| `@id` | `https://{domain}/#organization` |
docs/core/SCHEMA_MAPPING.md:295:| `memberOf` | `memberOf[]` → `Organization`(학회) |
docs/core/SCHEMA_MAPPING.md:296:| `subOrganization` | `affiliatedInstitutes[]` → `Organization`(연구소) |
docs/core/SCHEMA_MAPPING.md:301:**MedicalClinic 필드 매핑 (본원, LocationProfile main)**:
docs/core/SCHEMA_MAPPING.md:305:| `@type` | `"MedicalClinic"` |
docs/core/SCHEMA_MAPPING.md:306:| `@id` | `https://{domain}/#clinic` |
docs/core/SCHEMA_MAPPING.md:308:| `parentOrganization` | `{"@id": "https://{domain}/#organization"}` |
docs/core/SCHEMA_MAPPING.md:317:**WebSite 필드 (Home에서만 풀 엔티티 출력 — § 2.5)**:
docs/core/SCHEMA_MAPPING.md:321:  "@type": "WebSite",
docs/core/SCHEMA_MAPPING.md:322:  "@id": "https://{domain}/#website",
docs/core/SCHEMA_MAPPING.md:325:  "publisher": { "@id": "https://{domain}/#organization" },
docs/core/SCHEMA_MAPPING.md:342:**다른 페이지의 WebSite 참조**: WebPage 엔티티에 `isPartOf: { "@id": "https://{domain}/#website" }` 참조만. 풀 엔티티 미출력.
docs/core/SCHEMA_MAPPING.md:344:**WebPage 필드**: PageMeta 매핑 (title·description·canonical·image) + `isPartOf: {@id: "#website"}` (Home 외).
docs/core/SCHEMA_MAPPING.md:353:1. `Organization` (법인 identity 풀필드)
docs/core/SCHEMA_MAPPING.md:354:2. `MedicalClinic` (본원 — 주소·시간·연락 SoT)
docs/core/SCHEMA_MAPPING.md:356:4. `WebPage` (about page)
docs/core/SCHEMA_MAPPING.md:358:**Organization**: P-001과 동일하되 **풀필드 노출** (about에서 가장 풍부) — `legalName`·`founder`·`foundingDate`·`award`·`memberOf`·`subOrganization`·`sameAs` 모두 포함. **`address`는 매핑하지 않음** — LocationProfile/MedicalClinic이 SoT.
docs/core/SCHEMA_MAPPING.md:360:**mediaCoverage 처리**: Schema.org `Organization`에 `mediaCoverage` 표준 속성이 없으므로 직접 매핑 안 함. 대신:
docs/core/SCHEMA_MAPPING.md:362:- 본문에 별도 `CreativeWork[]` 또는 `Article[]` entity로 표현 (외부 매체 기사의 경우 `isBasedOn`/`citation`)
docs/core/SCHEMA_MAPPING.md:381:1. `Organization` — **[풀]**
docs/core/SCHEMA_MAPPING.md:382:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
docs/core/SCHEMA_MAPPING.md:383:3. `WebPage` (list page) — **[풀]**, `isPartOf: #website`
docs/core/SCHEMA_MAPPING.md:385:5. `ItemList` (의료진 목록) — **[풀]** — `itemListElement[]`에 최소 inline 필드 + `@id` 참조
docs/core/SCHEMA_MAPPING.md:390:  "@id": "https://{domain}/doctors#itemlist",
docs/core/SCHEMA_MAPPING.md:396:        "@type": "Physician",
docs/core/SCHEMA_MAPPING.md:397:        "@id": "https://{domain}/doctors/hong#physician",
docs/core/SCHEMA_MAPPING.md:408:> 정책 변경 (피드백 반영): 목록에는 `name`·`url`·`image`·`jobTitle` 등 **최소 inline 필드** 포함 (검색 엔진이 외부 fragment를 따라가지 않는 경우 대응). 각 Physician 풀필드는 P-004 상세 페이지의 그래프에서 정의.
docs/core/SCHEMA_MAPPING.md:415:1. `Organization` — **[풀]**
docs/core/SCHEMA_MAPPING.md:416:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
docs/core/SCHEMA_MAPPING.md:417:3. `Physician` (DoctorProfile 풀필드) — **[풀]**
docs/core/SCHEMA_MAPPING.md:419:5. `WebPage` — **[풀]**, `isPartOf: #website`
docs/core/SCHEMA_MAPPING.md:421:**Physician 필드 매핑**:
docs/core/SCHEMA_MAPPING.md:425:| `@type` | `"Physician"` |
docs/core/SCHEMA_MAPPING.md:426:| `@id` | `https://{domain}/doctors/{slug}#physician` |
docs/core/SCHEMA_MAPPING.md:434:| `alumniOf` | `education[]` → `EducationalOrganization` |
docs/core/SCHEMA_MAPPING.md:435:| `worksFor` | `{"@id": "https://{domain}/#organization"}` |
docs/core/SCHEMA_MAPPING.md:436:| `affiliation` | `affiliations[]` → `Organization` |
docs/core/SCHEMA_MAPPING.md:448:1. `Organization` — **[풀]**
docs/core/SCHEMA_MAPPING.md:449:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5 — 시술 카드 목록 위주, 위치 정보 슬롯 없음)
docs/core/SCHEMA_MAPPING.md:450:3. `WebPage` — **[풀]**, `isPartOf: #website`
docs/core/SCHEMA_MAPPING.md:452:5. `ItemList` — **[풀]** — 최소 inline + `@id` 참조 (P-003과 동일 패턴)
docs/core/SCHEMA_MAPPING.md:462:        "@type": "MedicalProcedure",
docs/core/SCHEMA_MAPPING.md:463:        "@id": "https://{domain}/treatments/{slug}#procedure",
docs/core/SCHEMA_MAPPING.md:478:1. `Organization` — **[풀]**
docs/core/SCHEMA_MAPPING.md:479:2. `MedicalClinic` (본원) — **[풀]** (§ 2.5 — 예약 CTA·담당 의료진 연계로 풀 entity 필요)
docs/core/SCHEMA_MAPPING.md:480:3. `MedicalProcedure` (TreatmentPage 풀필드) — **[풀]**
docs/core/SCHEMA_MAPPING.md:482:5. `WebPage` — **[풀]**, `isPartOf: #website`
docs/core/SCHEMA_MAPPING.md:485:**MedicalProcedure 필드 매핑**:
docs/core/SCHEMA_MAPPING.md:489:| `@type` | `"MedicalProcedure"` |
docs/core/SCHEMA_MAPPING.md:490:| `@id` | `https://{domain}/treatments/{slug}#procedure` |
docs/core/SCHEMA_MAPPING.md:530:1. `Organization` — **[풀]**
docs/core/SCHEMA_MAPPING.md:531:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
docs/core/SCHEMA_MAPPING.md:532:3. `WebPage` — **[풀]**, `isPartOf: #website`
docs/core/SCHEMA_MAPPING.md:534:5. `ItemList` — **[풀]** — 최소 inline (`name`·`url`·`description`) + `MedicalCondition` `@id` 참조 (P-003·P-005 패턴 동일)
docs/core/SCHEMA_MAPPING.md:539:1. `Organization` — **[풀]**
docs/core/SCHEMA_MAPPING.md:540:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
docs/core/SCHEMA_MAPPING.md:543:5. `WebPage` — **[풀]**, `isPartOf: #website`
docs/core/SCHEMA_MAPPING.md:551:| `@id` | `https://{domain}/conditions/{slug}#condition` |
docs/core/SCHEMA_MAPPING.md:555:| `possibleTreatment` | `treatmentOptions[]` → MedicalProcedure 참조 |
docs/core/SCHEMA_MAPPING.md:559:### P-009. Articles List
docs/core/SCHEMA_MAPPING.md:562:1. `Organization` — **[풀]**
docs/core/SCHEMA_MAPPING.md:563:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
docs/core/SCHEMA_MAPPING.md:564:3. `WebPage` — **[풀]**, `isPartOf: #website`
docs/core/SCHEMA_MAPPING.md:577:        "@type": "Article",
docs/core/SCHEMA_MAPPING.md:578:        "@id": "https://{domain}/insights/{cat}/{slug}#article",
docs/core/SCHEMA_MAPPING.md:579:        "headline": "{Article.headline}",
docs/core/SCHEMA_MAPPING.md:581:        "image": "{Article.coverImageUrl}",
docs/core/SCHEMA_MAPPING.md:582:        "datePublished": "{Article.datePublished}",
docs/core/SCHEMA_MAPPING.md:583:        "author": { "@id": "https://{domain}/doctors/{author.slug}#physician" }
docs/core/SCHEMA_MAPPING.md:594:  "@id": "https://{domain}/insights#blog",
docs/core/SCHEMA_MAPPING.md:595:  "name": "{Articles List title}",
docs/core/SCHEMA_MAPPING.md:596:  "publisher": { "@id": "https://{domain}/#organization" },
docs/core/SCHEMA_MAPPING.md:598:    { "@id": "https://{domain}/insights/{cat}/{slug}#article" }
docs/core/SCHEMA_MAPPING.md:604:### P-010. Article Detail
docs/core/SCHEMA_MAPPING.md:607:1. `Organization` — **[풀]** (§ 2.5: 모든 페이지 풀)
docs/core/SCHEMA_MAPPING.md:608:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
docs/core/SCHEMA_MAPPING.md:609:3. `Article` — **[풀]**
docs/core/SCHEMA_MAPPING.md:610:4. `Physician` (author) — **[참조 + inline 최소: name·image·jobTitle]** (실효성 위해 인라인)
docs/core/SCHEMA_MAPPING.md:611:5. `Physician` (reviewedBy, 해당 시) — **[참조 + inline 최소]**
docs/core/SCHEMA_MAPPING.md:613:7. `WebPage` — **[풀]**, `isPartOf: #website`
docs/core/SCHEMA_MAPPING.md:617:**Article 필드 매핑**:
docs/core/SCHEMA_MAPPING.md:619:| Schema 필드 | 출처 (Article) |
docs/core/SCHEMA_MAPPING.md:621:| `@type` | `"Article"` (또는 `"BlogPosting"`·`"NewsArticle"` 변형) |
docs/core/SCHEMA_MAPPING.md:622:| `@id` | `https://{domain}/insights/{cat}/{slug}#article` |
docs/core/SCHEMA_MAPPING.md:626:| `articleSection` | ArticleCategory.name |
docs/core/SCHEMA_MAPPING.md:629:| `author` | `{"@id": "https://{domain}/doctors/{author.slug}#physician"}` |
docs/core/SCHEMA_MAPPING.md:630:| `editor` | `reviewedBy` (해당 시) → Physician @id |
docs/core/SCHEMA_MAPPING.md:631:| `publisher` | `{"@id": "https://{domain}/#organization"}` |
docs/core/SCHEMA_MAPPING.md:632:| `mainEntityOfPage` | `{"@id": "https://{domain}{path}#webpage"}` |
docs/core/SCHEMA_MAPPING.md:638:| `about` | 관련 시술·질환 entity (`relatedTreatments`·`relatedConditions`) @id |
docs/core/SCHEMA_MAPPING.md:646:  "name": "{EmbeddedMedia.title 또는 Article.headline}",
docs/core/SCHEMA_MAPPING.md:647:  "description": "{EmbeddedMedia.caption 또는 Article.summary}",
docs/core/SCHEMA_MAPPING.md:648:  "thumbnailUrl": "{Article.coverImageUrl 또는 EmbeddedMedia 추출 썸네일}",
docs/core/SCHEMA_MAPPING.md:649:  "uploadDate": "{Article.datePublished}",
docs/core/SCHEMA_MAPPING.md:662:**Note**: Article의 `contentSource` (original/syndicated/republished)와 `externalUrl`은 schema 직접 매핑 X. `republished`·`syndicated`인 경우 `isBasedOn`: `externalUrl`로 표현.
docs/core/SCHEMA_MAPPING.md:667:1. `Organization` — **[풀]**
docs/core/SCHEMA_MAPPING.md:668:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
docs/core/SCHEMA_MAPPING.md:671:5. `WebPage` — **[풀]**, `isPartOf: #website`
docs/core/SCHEMA_MAPPING.md:678:1. `Organization` — **[풀]**
docs/core/SCHEMA_MAPPING.md:679:2. `MedicalClinic` (본원 `#clinic`) — **[풀]** (§ 2.5 — Conversion Hub 핵심 entity)
docs/core/SCHEMA_MAPPING.md:680:3. (다지점 시) `MedicalClinic` (비본원 지점 `/locations/{slug}#clinic`) — **[풀]** 각각
docs/core/SCHEMA_MAPPING.md:682:5. `WebPage` — **[풀]**, `isPartOf: #website`
docs/core/SCHEMA_MAPPING.md:683:6. (다지점) `ItemList` — **[풀]** → 각 지점 `MedicalClinic` @id 참조
docs/core/SCHEMA_MAPPING.md:690:    { "@type": "Organization", "@id": "https://{domain}/#organization", ... },
docs/core/SCHEMA_MAPPING.md:691:    { "@type": "MedicalClinic", "@id": "https://{domain}/#clinic", ... },      // 본원
docs/core/SCHEMA_MAPPING.md:692:    { "@type": "MedicalClinic", "@id": "https://{domain}/locations/gangnam#clinic", ... },
docs/core/SCHEMA_MAPPING.md:693:    { "@type": "MedicalClinic", "@id": "https://{domain}/locations/bundang#clinic", ... },
docs/core/SCHEMA_MAPPING.md:701:각 CTAConfig는 `MedicalClinic.potentialAction` 또는 `contactPoint`로 변환.
docs/core/SCHEMA_MAPPING.md:723:1. `Organization` — **[풀]**
docs/core/SCHEMA_MAPPING.md:724:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
docs/core/SCHEMA_MAPPING.md:725:3. `WebPage` — **[풀]**, `isPartOf: #website`
docs/core/SCHEMA_MAPPING.md:728:**Note**: 정책 페이지는 검색 노출 우선순위 낮음. `MedicalSchema`·`Article` 적용 안 함. 단순 `WebPage`로 표현.
docs/core/SCHEMA_MAPPING.md:733:1. `Organization` — **[풀]**
docs/core/SCHEMA_MAPPING.md:734:2. `MedicalClinic` (해당 지점 풀필드) — **[풀]** — `parentOrganization` Organization 참조
docs/core/SCHEMA_MAPPING.md:735:   - **단지점 main**: `@id` = `https://{domain}/#clinic` (URL은 `/locations/main`이지만 entity는 본원 `#clinic`과 동일)
docs/core/SCHEMA_MAPPING.md:736:   - **다지점 비본원**: `@id` = `https://{domain}/locations/{slug}#clinic` (별도 entity)
docs/core/SCHEMA_MAPPING.md:738:4. `WebPage` — **[풀]**, `isPartOf: #website`
docs/core/SCHEMA_MAPPING.md:740:**MedicalClinic 필드 매핑 (지점 LocationProfile)**:
docs/core/SCHEMA_MAPPING.md:742:P-001의 본원 `MedicalClinic`과 동일 구조 + 다음:
docs/core/SCHEMA_MAPPING.md:746:| `branchOf` | `{"@id": "https://{domain}/#organization"}` |
docs/core/SCHEMA_MAPPING.md:747:| `parentOrganization` | 동일 |
docs/core/SCHEMA_MAPPING.md:750:> 본원(`@id: #clinic`)과 지점(`@id: /locations/{slug}#clinic`)은 다른 entity. `branchOf`는 Schema.org의 LocalBusiness 계열에서 더 적합 (MedicalClinic은 `parentOrganization`을 우선).
docs/core/SCHEMA_MAPPING.md:757:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀].
docs/core/SCHEMA_MAPPING.md:761:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀].
docs/core/SCHEMA_MAPPING.md:765:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀]. 사진은 본문 갤러리 또는 `WebPage.image: ImageObject[]`로 표현 (`ImageGallery`는 사용 안 함 — 카탈로그·결정표 미등재).
docs/core/SCHEMA_MAPPING.md:768:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀] + (개별 News 항목) `NewsArticle` 또는 `Article`[풀].
docs/core/SCHEMA_MAPPING.md:772:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[**풀**, § 2.5 — 예약 action 풀 entity 필요] + `WebPage`[풀] + `BreadcrumbList`[풀].
docs/core/SCHEMA_MAPPING.md:773:`MedicalClinic.potentialAction`에 `ReserveAction` 상세 필드 포함 (P-012와 유사하되 예약 안내 페이지답게 채널·시간·절차 등 상세 명시). ReserveAction은 독립 풀 entity가 아닌 `MedicalClinic.potentialAction`에 중첩되는 구조.
docs/core/SCHEMA_MAPPING.md:776:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage` 또는 `MedicalWebPage`[풀] + `BreadcrumbList`[풀]. **`Quiz`·`MedicalDiagnosis`·`MedicalRiskEstimator`는 fail** (§ 2.4·§ 8). 일반 정보 형태의 `MedicalWebPage` 또는 단순 `WebPage`만.
docs/core/SCHEMA_MAPPING.md:784:| C-01 `ClinicProfile` | `Organization` | 브랜드·법인 identity. 위치·시간·연락은 LocationProfile로 위임 |
docs/core/SCHEMA_MAPPING.md:785:| C-02 `DoctorProfile` | `Physician` | M0는 `Article.author: Ref<C-02>`만 지원. 비의료인 author(`authorType` != `clinician`) → `Person` 매핑은 데이터 모델 확장 후 합류 (M0 외) |
docs/core/SCHEMA_MAPPING.md:786:| C-03 `TreatmentPage` | `MedicalProcedure` | `programVariants`·`recommendedFor`·`visitFlow`는 비매핑 (본문) |
docs/core/SCHEMA_MAPPING.md:787:| C-04 `Article` | `Article` (또는 `BlogPosting`·`NewsArticle` 변형). VideoObject 동반 가능 | `contentSource` → `isBasedOn` |
docs/core/SCHEMA_MAPPING.md:789:| C-06 `PageMeta` | `WebPage` 필드 일부 + head meta tag | 상세는 `SEARCH_STANDARDIZATION.md` |
docs/core/SCHEMA_MAPPING.md:793:| C-10 `ComplianceRecord` | (비매핑 — 운영 메타) | Git 사본의 `publishedAt`·`lastModifiedAt`은 Article.datePublished/dateModified로 사용됨 |
docs/core/SCHEMA_MAPPING.md:799:| C-16 `LegalDocument` | `WebPage`만 (정책 페이지는 검색 노출 우선순위 낮음) | |
docs/core/SCHEMA_MAPPING.md:801:| C-18 `FacilitiesPage` | `WebPage` + 사진 갤러리 | |
docs/core/SCHEMA_MAPPING.md:802:| C-19 `NewsItem` | `Article` 또는 `NewsArticle` | event-price 카테고리는 schema 신중 |
docs/core/SCHEMA_MAPPING.md:803:| C-20 `ReservationPage` | `MedicalClinic.potentialAction.ReserveAction` (LocalBusiness 별도 출력 안 함) | |
docs/core/SCHEMA_MAPPING.md:804:| C-21 `LocationProfile` | `MedicalClinic` (지점 단위 별도 entity. LocalBusiness sub-class) | 본원·지점 각각 |
docs/core/SCHEMA_MAPPING.md:805:| C-22 `ArticleCategory` | (비매핑) — Article.articleSection 문자열 | |
docs/core/SCHEMA_MAPPING.md:846:| `map` | `MedicalClinic.hasMap`: targetUrl |
docs/core/SCHEMA_MAPPING.md:866:  mainLocation: LocationProfile;  // C-21 main — 전 페이지 공통 (Organization 외 본원 entity)
docs/core/SCHEMA_MAPPING.md:885:| P-010 Article Detail | `article: Article`, `author: DoctorProfile`, `reviewer?: DoctorProfile`, `relatedArticles: Article[]`, `relatedTreatments: TreatmentPage[]` |
docs/core/SCHEMA_MAPPING.md:912:| 모든 페이지 | `Organization`·`WebPage`[풀] + PageMeta의 `title`·`description` + **resolved canonical URL** (PageMeta.canonical 또는 SchemaInput.canonicalUrl로 결정. 둘 다 부재 시 빌드 실패) |
docs/core/SCHEMA_MAPPING.md:914:| P-001·P-002·P-006·P-012·P-014 (필수) / P-105 (활성화 시) | **`MedicalClinic` 풀** (§ 2.5 풀 지정) + `name`·`address`·`telephone`·`openingHoursSpecification` |
docs/core/SCHEMA_MAPPING.md:915:| P-004 | `Physician` + `name`·`jobTitle`·`medicalSpecialty`·`hasCredential` |
docs/core/SCHEMA_MAPPING.md:916:| P-006 | `MedicalProcedure` + `name`·`description`·`howPerformed` |
docs/core/SCHEMA_MAPPING.md:918:| P-010 | `Article` + `headline`·`description`·`datePublished`·`author`·`publisher` |
docs/core/SCHEMA_MAPPING.md:928:| **빌드 게이트 (Sanity)** | JSON-LD 파싱 가능 여부·@id uniqueness·@context 유효성 | 빌드 실패 |
docs/core/SCHEMA_MAPPING.md:938:| **warning** | 출력 시 경고 + 어드민 검토 큐로 전달 (빌드는 통과) | 외부 위젯 schema와 `@id` 충돌 / VideoObject 권장 필드 누락 (필수는 충족하나 권장 미충족) / 본문 길이 권장 미달 등 — 비차단 운영 관찰 항목 |
docs/core/SCHEMA_MAPPING.md:956:| `Quiz` (비표준)·진단형 schema | **fail** | P-106 Self-test는 `WebPage`·`MedicalWebPage`로 |
docs/core/SCHEMA_MAPPING.md:957:| `HealthAndBeautyBusiness` (단독·병행) | **fail** | 의료기관 사이트는 MedicalClinic만 |
docs/core/SCHEMA_MAPPING.md:968:| SM-01 | `Article` vs `BlogPosting` vs `NewsArticle` 변형 선택 정책 — `articleType`별 자동 매핑 | 후속 결정 |
docs/core/SCHEMA_MAPPING.md:972:| SM-05 | ~~다지점 시 본원 `@id` alias 처리~~ | **v0.3 해소** — `/#clinic` 단일 entity로 고정. alias 사용 안 함 (§ 1.4) |
docs/core/SCHEMA_MAPPING.md:973:| SM-06 | P-106 Self-test의 `MedicalWebPage` 세부 필드 정책 — `medicalAudience`·`lastReviewed`·`reviewedBy` 등 활용 범위. (Quiz는 fail로 확정됨 — § 2.4·§ 8) | P-106 도입 시 |
docs/core/SCHEMA_MAPPING.md:975:| SM-08 | Article의 `contentSource: republished` 시 `isBasedOn` vs `citation` 사용 정책 | 후속 결정 |
docs/core/SCHEMA_MAPPING.md:984:| 2026-05-14 | v0.2 | **피드백 정합 정정**: (1) **C-15/CT-15 혼동 → C-15로 통일** (SchemaInput은 데이터 계약, CT 아님), (2) **inLanguage 정책 좁힘** — CreativeWork·페이지 entity에만, (3) **MedicalClinic 사용처 정합** — § 2.1 카탈로그 "전 페이지 본원 1개 포함" 명시 (그래프 정의와 일치), (4) **P-002 About 정정** — address 매핑 제거(LocationProfile SoT), mediaCoverage는 sameAs 또는 CreativeWork 보조로, (5) **ItemList inline 필드 추가** — P-003/P-005/P-007/P-009에 name·url·image·기타 최소 필드 + @id 참조 병행, (6) **List 페이지 그래프에 WebPage 추가** — § 7.1 검증 룰과 정합 (이전 누락), (7) **evidenceNotes 매핑 보수화** — `MedicalStudy` → `citation`/`CreativeWork` (EvidenceNote 필드로 MedicalStudy 구성 부족), (8) **§ 2.3 신규** — Schema Rich Results 실효 vs Entity 의미 전달 분류 |
docs/core/SCHEMA_MAPPING.md:985:| 2026-05-14 | v0.3 | **빌드 가능 규칙화** (피드백 10건): (1) **§ 1.1 Core 출력 범위 한정** — 외부 위젯 schema 충돌 가능성 명시, (2) **§ 1.4 본원 @id 일관성 (SM-05 해소)** — `/#clinic` 단일 entity, 다지점 비본원만 `/locations/{slug}#clinic`, alias 금지, (3) **§ 2.1 WebSite Home 전용** — 다른 페이지는 `isPartOf` 참조만, (4) **§ 2.1 Person M0 외 후속** — authorType != clinician은 데이터 모델 확장 후, (5) **§ 2.4 신규 — Allowed/Conditional/Blocked 3단계 분류**, (6) **§ 3 P-010 graph 구성 [풀]/[참조+inline]/[참조만] 표기 명확화** + VideoObject Google Rich Results 최소 필드 (name·description·thumbnailUrl·uploadDate·contentUrl/embedUrl), (7) **§ 5.1 dayOfWeek enum 변환표** + specialClosures 기본 미출력 정책, (8) **§ 7.2 빌드 게이트 vs 운영 모니터링 분리** — 공식 validator는 모니터링·수동 QA로, (9) **§ 7.3 룰 레벨 분류 (fail/warning/content-gate)** + **§ 8 표에 룰 레벨 명시** |
docs/core/SCHEMA_MAPPING.md:986:| 2026-05-14 | v0.4 | **잔재 정리·룰 충돌 해소** (피드백 8건): (1) **§ 2.3 A/B 카테고리 풀명세 재펼침** ("이전과 동일" 잔재 제거), (2) **inLanguage 잔재 4곳 제거** — Organization·MedicalClinic·Physician·MedicalProcedure 매핑 표, (3) **MedicalRiskFactor 룰 충돌 해소** — schema 출력은 **fail로 통일**, 본문 표현(원인·위험요인)은 별도 content-gate 분리, (4) **§ 9 미결정 정리** — SM-05·SM-07 "해소" 표시, (5) **P-106 Quiz 제거** — `WebPage`/`MedicalWebPage`만, (6) **P-103 ImageGallery 제거** — 본문 갤러리 또는 `WebPage.image: ImageObject[]`, (7) **§ 5 C-02 Person 후속** 명시 (M0 외), (8) **§ 7.3 warning 예시에서 MedicalRiskFactor 제거** (fail로 통일) — `MedicalIndication` 단정형·`HealthAndBeautyBusiness` 단독 사용 등으로 교체 |
docs/core/SCHEMA_MAPPING.md:987:| 2026-05-14 | v0.5 | **미세 잔재 해소·룰 단순화** (피드백 7건): (1) **P-008 riskFactor → MedicalRiskFactor 행 삭제** — fail 정책 정합. causes[]는 description 보조·본문 표현으로, (2) **P-008 주석 정정** — "신중" → "schema 출력 안 함, 본문은 content-gate", (3) **HealthAndBeautyBusiness fail로 통일** (§ 2.4·§ 8 모두) — 단독·병행 모두 미사용, (4) **MedicalIndication fail로 통일** — Schema 출력 금지, 본문 효능 표현만 content-gate, (5) **HowTo Rich Results A 목록에서 제거** — 미사용. 미래 확장 시 카탈로그·결정표·의료 리스크 룰 추가, (6) **§ 2.4에 Person 두 케이스 분리** — Organization.founder는 Allowed inline / Article.author (non-clinician)는 M0 외 후속, (7) **VideoObject 필수 필드 표현 명확화** — `name·description·thumbnailUrl·uploadDate` 4개 필수 + `contentUrl`/`embedUrl` 중 1개 |
docs/core/SCHEMA_MAPPING.md:988:| 2026-05-14 | v0.6 | **정책 표 정합화** (피드백 7건): (1) **§ 2.5 신설 — 공통 entity별 페이지 출력 정책 (단일 SoT)** — Organization/WebSite/MedicalClinic의 풀 entity vs 참조 위치 명시. § 7.1 룰 checker가 본 표 기준으로 검증, (2) "풀 entity vs 참조" 용어 정의 — graph[]에 entity 정의 여부 명확, (3) **§ 0 요약 일관화** — "신중하게" → fail로, validator 표현을 § 7.2와 일치 (자체 checker = 빌드, 공식 validator = 모니터링), (4) **LocalBusiness 별도 출력 제거** — § 2.1·§ 5 C-20 정정. `MedicalClinic`이 LocalBusiness sub-class이므로 `@type: "MedicalClinic"`만 사용, LocalBusiness 계열 속성 활용, (5) **SearchAction Conditional** — `/search` 라우트 부재 시 미출력 (M0 미출력, 검색 기능 활성화 시 합류), (6) **§ 7.3 warning 예시 교체** — MedicalIndication·HealthAndBeautyBusiness 제거(둘 다 fail). 비차단 항목(외부 위젯 @id 충돌·VideoObject 권장 필드 누락·본문 길이 미달 등)으로 교체 |
docs/core/SCHEMA_MAPPING.md:989:| 2026-05-14 | v0.7 | **§ 2.5 SoT 기준 일괄 동기화** (피드백 7건): (1) **§ 2.1 SearchAction Conditional 명시**, **ReserveAction을 LocalBusiness → MedicalClinic.potentialAction**으로 정정, (2) **§ 2.4 MedicalClinic 결정 변경** — "본원 1개 전 페이지" → "§ 2.5 정책에 따라 full 또는 ref", (3) **§ 2.5 P-105 Reservation 풀 entity로 재분류**, P-101~P-106 일괄 ref 거친 표현 세분화, (4) **§ 3·§ 4 페이지별 graph 구성 [풀]/[참조]/[참조+inline] 표기 일괄 적용** — P-003·P-004·P-007·P-008·P-009·P-010·P-011·P-013·P-101~P-106, (5) **§ 7.1 검증 룰 정정** — "PageMeta.canonical 필수" → "**resolved canonical URL 필수** (PageMeta.canonical 또는 SchemaInput.canonicalUrl로 결정)" |
docs/core/SCHEMA_MAPPING.md:990:| 2026-05-14 | v0.8 | **§ 2.5 cascade 마무리** (피드백 6건): (1) **P-005 MedicalClinic [참조만]로 변경** — PAGE_TYPES § 3 P-005에 위치 정보 슬롯 없음. § 2.5 풀 지정 페이지에서 제거, (2) **P-005·P-006·P-012·P-014 [풀]/[참조] 표기 적용** — v0.7 일괄 적용 시 누락된 페이지 보완, (3) **P-014 @id 분기 명시** — 단지점 main = `#clinic` (본원 entity와 동일), 다지점 비본원 = `/locations/{slug}#clinic` (별도 entity), (4) **§ 7.1 일반 검증 룰 추가** — "§ 2.5에서 풀로 지정된 entity는 해당 페이지 필수" (룰 checker의 일반 룰. 페이지별 명시는 보조), (5) **§ 7.1 MedicalClinic 풀 페이지 목록 확장** — P-001·P-002·P-006·P-012·P-014·P-105 (이전 P-012·P-014만), (6) **§ 2.1 ReserveAction Conditional 명확화** — "reservationChannels 또는 페이지 예약 CTA가 실제 있을 때만" |
docs/core/SCHEMA_MAPPING.md:991:| 2026-05-14 | v0.9 | **Conditional·미결정 다듬기** (피드백 5건): (1) **ReserveAction 조건 § 2.1·§ 2.4 통일** — `(a) #clinic 풀 entity 페이지 + (b) reservationChannels 예약 채널 존재 또는 페이지/시술 CTA가 예약 채널`, (2) **§ 7.1 선택 페이지 검증 단서** — "선택 페이지(P-101~P-106)는 인스턴스에서 활성화된 경우에만 검증" (FeatureModuleConfig·라우트 설정 기준). P-105 등 풀 필수 페이지 목록에 "활성화 시" 명시, (3) **SM-03 수준 낮춤** — 완전 미결정 → "출력 포맷 세부 확정 필요" (정책은 § 5.1에 정의됨), (4) **SM-06 이름 정정** — "Quiz·Self-test schema 모범" → "P-106 Self-test의 `MedicalWebPage` 세부 필드 정책" (Quiz는 fail로 확정) |
docs/core/SCHEMA_MAPPING.md:992:| 2026-05-14 | v0.10 | **미세 표현 정합** (피드백 4건): (1) § 3 P-001 MedicalClinic potentialAction 행에 "페이지/시술 CTA가 예약 채널일 때"도 포함 명시, (2) § 4 P-105 — "ReserveAction 풀필드" → "**상세 필드 포함** (독립 entity 아닌 MedicalClinic.potentialAction 중첩 구조)", (3) § 7.1 선택 페이지 검증 기준에 **InstanceManifest 추가** — P-103·P-104·P-105는 Instance 결정·P-106은 Feature Module 기반 등 활성화 경로 다양화, (4) **§ 2.2 제목에 "룰 레벨 상세는 § 8" 명시** — fail/warning/content-gate 기조와 정합 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:5:본 문서는 `apps/web` 안에 **`(site)` route group**(공개 사이트)을 신설하고, 어드민 route 도 동시에 **`/admin/<instanceSlug>/...`** prefix 로 격상해 path namespace 충돌을 해소한다. 어드민에서 저장한 6 entity (ClinicProfile · LocationProfile · DoctorProfile · TreatmentPage · Article · LegalDocument)를 minimal 디자인 + 정합 JSON-LD + SEARCH_STANDARDIZATION v1.1 정합 robots/sitemap 과 함께 렌더한다.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:12:- `docs/core/SCHEMA_MAPPING.md` — 페이지별 graph 구성 (§ 2.5 공통 entity 출력 정책 + § 3 페이지 그래프 + § 1.2 `@id` 네이밍 규약).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:15:- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-02 DoctorProfile · C-03 TreatmentPage · C-04 Article · C-16 LegalDocument · C-21 LocationProfile · aiCrawlerPolicy.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:17:- `docs/admin/ARCHITECTURE.md` v0.7 § 3.11 완료 게이트 #1 — "사이트 측 페이지 타입 9종 + Article 1샘플 빌드 (총 10 페이지)".
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:43:| **P-009 Articles List · P-011 FAQ · P-007/008 Conditions** | M0 미합류 — 별 plan (FAQ 는 EAT_CONTENT plan v0.1) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:46:| 페이지 컴포넌트 minimal | Hero · About · DoctorCard · TreatmentCard · ArticleBody · ContactCard · LegalRenderer · LocationCard · Footer · Header · BreadcrumbList |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:51:| status filter (cycle1 PSR-06·16 정정) | TreatmentPage·Article: `status='published' AND published_at <= now()`. **LegalDocument: v0.1 단계 noindex + 어드민 인증 필요 preview 만** (draft 공개 노출 차단 — 법무 게이트 우회 회피) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:70:| P-009 Articles List · P-011 FAQ · P-007/008 Conditions | 별 plan (EAT_CONTENT plan v0.1 안 FAQ · 별도 plan Conditions) | PSR-DEFER-11 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:74:| Article URL `/insights/[category]/[slug]` 의 category 운영 추가 (현재 C-04 article.category 없음) | EAT_CONTENT plan v0.1 또는 Article schema cascade · v0.1 은 단일 fallback category `"general"` | PSR-DEFER-15 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:99:│     │     └─ [slug]/page.tsx           -- P-010 Article Detail (1샘플 · category=general v0.1)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:299:| TreatmentPage | `body_markdown` | C-03 `bodyMarkdown` (contract `body`) | ArticleBody render |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:301:| TreatmentPage | `published_at` | C-03 `publishedAt` (== `dateModified` v0.1) | sitemap lastmod · Article meta |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:302:| **Article** | `title` (DB) | **DATA_MODEL C-04 `headline` (contract)** — Drizzle 차이 marker | Article heading |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:303:| Article | `summary` | C-04 `summary` | Card · meta description |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:304:| Article | `body_markdown` | C-04 `bodyMarkdown` (contract `body`) | ArticleBody render |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:305:| Article | `hero_image_url` | C-04 `heroImageUrl` | Hero · OG |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:306:| Article | `published_at` | C-04 `datePublished` / `dateModified` v0.1 | sitemap lastmod |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:307:| Article | `author_doctor_id` | C-04 `author` ref to Doctor | Article hero · JSON-LD |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:314:- (PSR-COMP-06) public renderer 는 **Drizzle column 명을 직접 사용** + 컴포넌트 prop 으로 넘길 때 contract semantic name 사용 (예: `<TreatmentHero title={row.title}>` 의 prop 명은 `name` 으로 — DATA_MODEL contract 일관). renderer 코드 안에 mapping function `normalizeTreatment(row)` / `normalizeArticle(row)` 두기.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:322:| P-002 About | `<ArticleBody markdown={clinic.long_description}>` · `<FoundingInfo>` | ClinicProfile |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:324:| P-004 Doctor Profile | `<DoctorHero>` · `<ArticleBody markdown={doctor.bio}>` · `<RelatedTreatments>` · `<RelatedArticles>` | DoctorProfile + 본인 author Articles |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:326:| P-006 Treatment Detail | `<TreatmentHero>` · `<ArticleBody markdown={treatment.body_markdown}>` · `<TreatmentSummary>` · `<ContactCta>` | TreatmentPage |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:327:| P-010 Article Detail (1샘플) | `<ArticleHero>` (title·summary·publishedAt·author) · `<ArticleBody markdown={article.body_markdown}>` | Article + author Doctor |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:332:### 4.4 ArticleBody (Markdown → HTML) (PSR-COMP-09) — cycle1 PSR-19·20 정정
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:444:| P-010 Article Detail | monthly | 0.5 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:450:  - Article (P-010): `Article.dateModified` 우선. C-04 에 별도 `dateModified` 컬럼 없음 v0.1 — `published_at` 사용 (M1 cascade).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:542:| P-001 Home | `[풀] Organization` · `[풀] MedicalClinic`(`#clinic` 본원) · `[풀] WebSite` · `[풀] WebPage` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:543:| P-002 About | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] WebPage` · `[풀] BreadcrumbList` · `WebSite` 참조 (`isPartOf`) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:544:| P-003 Doctors List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(Physician refs) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:545:| P-004 Doctor Profile | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Physician` · `[풀] WebPage` · `[풀] BreadcrumbList` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:546:| P-005 Treatments List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(MedicalProcedure refs) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:547:| P-006 Treatment Detail | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] MedicalProcedure` · `[풀] WebPage` · `[풀] BreadcrumbList` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:548:| P-010 Article Detail | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Article` · `[풀] WebPage` · `[풀] BreadcrumbList` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:549:| P-012 Contact | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] WebPage` · `[풀] BreadcrumbList` (cycle1 PSR-07: ContactPage 삭제 · SoT 는 WebPage + MedicalClinic 풀) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:550:| P-013 Legal/Policy | (v0.1 단계 미노출 — graph 출력 없음) · 정상 노출 시 `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:551:| P-014 Location Detail | `[풀] Organization` · `[풀] MedicalClinic`(`#clinic` 단지점 main 의 entity @id 그대로 — SCHEMA_MAPPING § 1.4 정합) · `[풀] WebPage` · `[풀] BreadcrumbList` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:554:- (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:555:- (PSR-SEO-13) `inLanguage` 명시 정책: SCHEMA_MAPPING § 1.5 정합 — CreativeWork 계열 (Article · WebPage · FAQPage 등) 만 명시. Organization · MedicalClinic · Physician 등은 미명시.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:556:- (PSR-SEO-14 · cycle1 PSR-17) **자체 JSON-LD rule checker** (LOCAL_PASS 게이트): JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 검증. Google Rich Results Test / schema.org validator 는 manual QA marker (PSR-DEFER-14) — CI 게이트 X.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:596:| 7 | Article published 5건 → `/<instanceSlug>/insights/general/<slug>` 진입 가능 (1샘플) | P-010 단일 페이지 렌더 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:606:| 17 | sitemap.xml 의 lastmod 가 entity updatedAt (Article 은 datePublished/publishedAt) 과 정확히 일치 | ISO 8601 형식 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:607:| 18 | **자체 JSON-LD rule checker** 통과 (cycle1 PSR-17 정정) | JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 — Google 외부 validator 는 manual QA marker (PSR-DEFER-14) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:609:| 20 | Markdown ArticleBody 안 외부 링크 `rel="nofollow noopener noreferrer"` (cycle1 PSR-20) | 내부 링크 (`/<slug>/...`) 는 그대로 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:625:| 8 | 사이트 컴포넌트 (Hero · DoctorCard · TreatmentCard · ArticleBody · ContactCard · LocationCard · BreadcrumbList 등) | apps/web/src/components/site/* |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:634:| 17 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` marker + entity continuity note (PSR-CASCADE-02) | doc |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:662:- `PSR-DEFER-15` (cycle1 PSR-11): Article `category` 컬럼 + URL 패턴 운영 — 현재 C-04 article.category 없음. v0.1 단일 fallback `general`.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:679:- `PSR-CASCADE-02` (cycle1 PSR-08 보강): `docs/core/SCHEMA_MAPPING.md` § 1.2 patch — v0.1 임시 path-based `@id` 패턴 + 도메인 매핑 후 (M0 v1.0) entity @id 전환 시 redirect/301/`sameAs` 처리 룰 추가 marker.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:689:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:690:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |

codex
manifest 쪽은 정적 대조상 D0011 의존 객체가 모두 이전 creates에 있습니다. 실제 `validateManifest()`도 타입체크 또는 직접 호출로 확인해 보겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'pnpm --filter @glitzy/migrations-runner typecheck' in C:\Users\assag\solution\website-exposure
 succeeded in 1171ms:

> @glitzy/migrations-runner@0.1.0 typecheck C:\Users\assag\solution\website-exposure\packages\migrations-runner
> tsc --noEmit -p tsconfig.json


exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "pnpm exec tsx -e \"import { validateManifest } from './packages/migrations-runner/src/manifest.ts'; const errors = validateManifest(); if (errors.length) { console.error(errors.join('\\n')); process.exit(1); } console.log('validateManifest PASS');\"" in C:\Users\assag\solution\website-exposure
2026-05-18T03:57:37.090093Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 1 seconds
Output:
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "tsx" not found
'tsx' is not recognized as an internal or external command,
operable program or batch file.

 exited 1 in 953ms:
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "tsx" not found
'tsx' is not recognized as an internal or external command,
operable program or batch file.

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content packages/migrations-runner/package.json' in C:\Users\assag\solution\website-exposure
 succeeded in 579ms:
{
  "name": "@glitzy/migrations-runner",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc --noEmit -p tsconfig.json"
  },
  "dependencies": {
    "@glitzy/db": "workspace:*",
    "@glitzy/shared-errors": "workspace:*",
    "@glitzy/shared-types": "workspace:*",
    "postgres": "^3.4.5"
  },
  "devDependencies": {
    "typescript": "^5.7.3"
  }
}

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "pnpm --filter @glitzy/migrations-runner build && node -e \"import('./packages/migrations-runner/dist/manifest.js').then(m => { const errors = m.validateManifest(); if (errors.length) { console.error(errors.join('\\n')); process.exit(1); } console.log('validateManifest PASS'); })\"" in C:\Users\assag\solution\website-exposure
 succeeded in 1359ms:

> @glitzy/migrations-runner@0.1.0 build C:\Users\assag\solution\website-exposure\packages\migrations-runner
> tsc -p tsconfig.json

validateManifest PASS

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/core/SEARCH_STANDARDIZATION.md | Select-Object -Skip 188 -First 62; Get-Content docs/decisions/PUBLIC_SITE_RENDER_PLAN.md | Select-Object -Skip 466 -First 62' in C:\Users\assag\solution\website-exposure
 succeeded in 646ms:

#### `aiCrawlerPolicy: disallowTraining` (권장 기본)

```
# robots.txt — 자동 생성 by Glitzy Core (SEARCH_STANDARDIZATION § 3)

# 일반 룰
User-agent: *
Disallow: /admin/
Disallow: /auth/
Disallow: /api/
Allow: /

# A. 일반 검색 색인 — Allow
User-agent: Googlebot
Allow: /

User-agent: Yeti
Allow: /

User-agent: Bingbot
Allow: /

# B. AI 검색 인덱싱·답변용 — Allow
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

# C. User-triggered fetch — Allow
User-agent: ChatGPT-User
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Claude-User
Allow: /

# D. AI 학습·모델 개선용 — Disallow
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

# meta-externalagent는 experimentalAiBots=true 시에만 추가 (외부 관측 기반·공식 검증 전)

Sitemap: https://{domain}/sitemap.xml
```
# robots.txt — auto-generated (Glitzy · SEARCH_STANDARDIZATION § 3.3 disallowTraining)

# 일반 룰 (Core 기본)
User-agent: *
Disallow: /admin/
Disallow: /auth/
Disallow: /api/
Allow: /

# A. 일반 검색 색인 — Allow
User-agent: Googlebot
Allow: /

User-agent: Yeti
Allow: /

User-agent: Bingbot
Allow: /

# B. AI 검색 인덱싱·답변용 — Allow
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

# C. User-triggered fetch — Allow (best-effort · § 3.1 주의)
User-agent: ChatGPT-User
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Claude-User
Allow: /

# D. AI 학습·모델 개선용 — Disallow
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

# meta-externalagent 는 experimentalAiBots=true 시에만 추가 (외부 관측 기반 · 공식 검증 전 · § 3.3 footnote)

Sitemap: https://<host>/<instanceSlug>/sitemap.xml
```

- (PSR-SEO-10) M0 v1.0 InstanceManifest.aiCrawlerPolicy 합류 시 (PSR-DEFER-10) row-driven 출력:

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'git status --short' in C:\Users\assag\solution\website-exposure
 succeeded in 542ms:
 M docs/core/SCHEMA_MAPPING.md
 M docs/decisions/M0_BUILD_EXPORT_PLAN.md
?? apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/
?? apps/web/src/components/forms/ClinicProfileForm.tsx
?? apps/web/src/lib/errors.ts
?? docs/admin/ARCHITECTURE.md
?? docs/core/CONTENT_STANDARDS.md
?? docs/decisions/ADMIN_UI_SKELETON_PLAN.md
?? docs/decisions/LOCATION_LEGAL_PLAN.md
?? docs/decisions/PUBLIC_SITE_RENDER_PLAN.md
?? handoff/codex-reviews/
?? packages/core-content/migrations/C0002_location_profile.sql
?? packages/core-content/migrations/C0006_legal_document.sql
?? packages/core-content/migrations/C0008_location_profile_parent_clinic.sql
?? packages/core-content/package.json
?? packages/core-content/src/schema.ts
?? packages/migrations-runner/src/

codex
# PUBLIC_SITE_RENDER_PLAN v0.3 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=0 major=1 minor=1 (총 2)
- closeableAfterPatch: false
- 수렴 추세 추적: cycle1=21 (6+11+4) → cycle2=7 (2+4+1) → cycle3=2 (0+1+1)

## cycle 2 patch 검증
- PSR-22: PARTIAL — robots user-agent/Allow/Disallow 본문은 SoT와 정합하나, `SEARCH_STANDARDIZATION § 3.3` 예시와 코멘트 라인이 line-by-line 동일하지 않음.
- PSR-23: PARTIAL — 본문 `themeColor` 출처는 `BrandTokens.colors.light/dark.primary`로 정정됐으나 acceptance scenario #21 기대값이 아직 `#f9fafb`로 stale.
- PSR-24: PASS — CASCADE-01a/docs와 01b/code 분리 의도는 LOCATION_LEGAL plan/code 분리 패턴과 정합.
- PSR-25: PASS — D0011 entry 추가됨. `pnpm --filter @glitzy/migrations-runner build` 후 `validateManifest()` 실행 결과 PASS.
- PSR-26: PASS — Footer 법적 링크 숨김은 v0.1 LegalDocument 404 시나리오 #8과 정합.
- PSR-27: PASS — pgbouncer 경로는 `apps/spike-a/pgbouncer/userlist.txt`로 정정됨.
- PSR-28: PASS — root layout className 전환은 § 4.1 및 § 8 작업 #14 acceptance precondition에 명시됨.
- PSR-CASCADE-02: PASS — SCHEMA_MAPPING § 1.2 path-based 7 entity 표와 301/sameAs/lastmod 전환 룰 sound.
- PSR-CASCADE-03: PASS — M0_BUILD_EXPORT_PLAN § 2.1 SSR 재사용 표는 plan § 8 작업 단위와 정합.

## new blocking / major / minor (PSR-29+)
- PSR-29 major — acceptance scenario #21 themeColor 기대값 stale: [PUBLIC_SITE_RENDER_PLAN.md](C:/Users/assag/solution/website-exposure/docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:610) 은 light 값을 `#f9fafb`로 요구하지만 SoT는 `BrandTokens.colors.light.primary` = default `#2563eb`, dark `#60a5fa`.
- PSR-30 minor — robots.txt starter가 “정확 일치” 조건을 충족하지 않음: 본문 정책은 맞지만 헤더/일반 룰/C 계열/meta-externalagent 코멘트 및 Sitemap placeholder가 [SEARCH_STANDARDIZATION.md](C:/Users/assag/solution/website-exposure/docs/core/SEARCH_STANDARDIZATION.md:193) 예시와 다름.

## acceptance precondition (PSR-CASCADE-01~05) 최종 점검
- PSR-CASCADE-01a: FAIL — `docs/admin/ARCHITECTURE.md` § 3 patch marker 미적용.
- PSR-CASCADE-01b: plan acceptance 외 — code v1.0 cycle marker
- PSR-CASCADE-02: PASS
- PSR-CASCADE-03: PASS
- PSR-CASCADE-04: PASS
- PSR-CASCADE-05: FAIL/TBD — 파일은 존재하나 `app_public_reader` 미추가.

## 누계 통계 + acceptance 권고
- cycle 1·2·3 합산 findings: 30
- 본 cycle 결과 plan v1.0 acceptance: 아직 비권고. PSR-29 major만 고치면 blocking/major 0 조건에 접근하며, PSR-30은 코멘트 정합 minor라 짧은 follow-up cycle로 닫을 수 있음.
tokens used
79,096
# PUBLIC_SITE_RENDER_PLAN v0.3 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=0 major=1 minor=1 (총 2)
- closeableAfterPatch: false
- 수렴 추세 추적: cycle1=21 (6+11+4) → cycle2=7 (2+4+1) → cycle3=2 (0+1+1)

## cycle 2 patch 검증
- PSR-22: PARTIAL — robots user-agent/Allow/Disallow 본문은 SoT와 정합하나, `SEARCH_STANDARDIZATION § 3.3` 예시와 코멘트 라인이 line-by-line 동일하지 않음.
- PSR-23: PARTIAL — 본문 `themeColor` 출처는 `BrandTokens.colors.light/dark.primary`로 정정됐으나 acceptance scenario #21 기대값이 아직 `#f9fafb`로 stale.
- PSR-24: PASS — CASCADE-01a/docs와 01b/code 분리 의도는 LOCATION_LEGAL plan/code 분리 패턴과 정합.
- PSR-25: PASS — D0011 entry 추가됨. `pnpm --filter @glitzy/migrations-runner build` 후 `validateManifest()` 실행 결과 PASS.
- PSR-26: PASS — Footer 법적 링크 숨김은 v0.1 LegalDocument 404 시나리오 #8과 정합.
- PSR-27: PASS — pgbouncer 경로는 `apps/spike-a/pgbouncer/userlist.txt`로 정정됨.
- PSR-28: PASS — root layout className 전환은 § 4.1 및 § 8 작업 #14 acceptance precondition에 명시됨.
- PSR-CASCADE-02: PASS — SCHEMA_MAPPING § 1.2 path-based 7 entity 표와 301/sameAs/lastmod 전환 룰 sound.
- PSR-CASCADE-03: PASS — M0_BUILD_EXPORT_PLAN § 2.1 SSR 재사용 표는 plan § 8 작업 단위와 정합.

## new blocking / major / minor (PSR-29+)
- PSR-29 major — acceptance scenario #21 themeColor 기대값 stale: [PUBLIC_SITE_RENDER_PLAN.md](C:/Users/assag/solution/website-exposure/docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:610) 은 light 값을 `#f9fafb`로 요구하지만 SoT는 `BrandTokens.colors.light.primary` = default `#2563eb`, dark `#60a5fa`.
- PSR-30 minor — robots.txt starter가 “정확 일치” 조건을 충족하지 않음: 본문 정책은 맞지만 헤더/일반 룰/C 계열/meta-externalagent 코멘트 및 Sitemap placeholder가 [SEARCH_STANDARDIZATION.md](C:/Users/assag/solution/website-exposure/docs/core/SEARCH_STANDARDIZATION.md:193) 예시와 다름.

## acceptance precondition (PSR-CASCADE-01~05) 최종 점검
- PSR-CASCADE-01a: FAIL — `docs/admin/ARCHITECTURE.md` § 3 patch marker 미적용.
- PSR-CASCADE-01b: plan acceptance 외 — code v1.0 cycle marker
- PSR-CASCADE-02: PASS
- PSR-CASCADE-03: PASS
- PSR-CASCADE-04: PASS
- PSR-CASCADE-05: FAIL/TBD — 파일은 존재하나 `app_public_reader` 미추가.

## 누계 통계 + acceptance 권고
- cycle 1·2·3 합산 findings: 30
- 본 cycle 결과 plan v1.0 acceptance: 아직 비권고. PSR-29 major만 고치면 blocking/major 0 조건에 접근하며, PSR-30은 코멘트 정합 minor라 짧은 follow-up cycle로 닫을 수 있음.
