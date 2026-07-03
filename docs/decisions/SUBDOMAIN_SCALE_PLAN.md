# SUBDOMAIN_SCALE_PLAN (v1.1 · 2026-07-02 · Phase 0+1 구현 완료)

> **상태**: G0 4건 사용자 확정 (2026-07-02 · 전부 권장안 채택) → **Phase 0(SDS-00 track 패치) + Phase 1(SDS-01~05 코드) 구현 완료** — typecheck 0 · vitest 381 PASS(+57) · `pnpm web:build` 통과. **Phase 2(운영 1회성 — NS 위임·와일드카드·BASE env)는 사용자 플랫폼 작업 대기.**
>
> **목표**: "메인 도메인 1개(BASE) + 복제 인스턴스별 서브도메인" 을 **인스턴스 추가 시 env 수정·redeploy 없이(zero-touch)** 운영. 현재는 env `CUSTOM_DOMAIN_MAP`(exact-match JSON · module-load 1회 파싱)이 유일한 host→slug 소스라 서브도메인 1개마다 env 항목 추가 + Vercel 도메인/DNS + redeploy 가 필요하다.

## 배경

- PSR-DEFER-02 원 설계 의도부터 "subdomain `<slug>.glitzy.co` + custom domain CNAME" 즉 인스턴스별 서브도메인 N개였고 (PUBLIC_SITE_RENDER_PLAN.md:651), 구현은 단일 클라이언트 MVP 를 위해 정적 env 매핑으로 축소됐다 (2026-06-30 · bupyeong.key-mom.kr 라이브).
- host→slug 해석과 canonical 출력은 이미 단일 SoT (`lib/custom-domains.ts`) 로 통일 — middleware rewrite · siteBaseUrl · sitemap/robots/RSS · IndexNow · sitePathPrefix 가 전부 이 모듈만 본다. **파생 규칙을 이 모듈에만 추가하면 나머지가 자동 정합**되는 구조가 이 plan 의 토대다.
- 사업 결정 (2026-07-02): 서브도메인을 계속 늘린다 → env-per-instance 는 지속 불가.

## 결정

**"라벨=slug 규약 + 와일드카드 파생 fallback, 명시 맵 우선" 하이브리드.**

| 선택지 | 판정 | 사유 |
|---|---|---|
| A. env 맵 유지 (현행) | 기각 | 서브도메인마다 env+redeploy — 확장 모델과 모순 |
| B. `instance.custom_domain` DB 컬럼 승격 | **DEFER** (SDS-DEFER-01) | Edge middleware 에서 sync DB 조회 불가 (per-request fetch latency + 실패 모드). 성장 축이 자사 BASE 서브도메인인 동안 불필요. 임의 고객 apex 도메인이 대량화되면 재검토 |
| C. **BASE_SITE_DOMAIN 파생 + 명시 맵 우선** | **채택** | zero-touch. 기존 bupyeong(라벨≠slug) 은 명시 맵으로 영구 공존. 고객 독립 도메인 전환도 명시 맵 우선 규칙이 그대로 escape hatch |

파생 규칙: host 가 `<label>.<BASE>` (단일 라벨) 이고 label 이 파생 가능 조건을 통과하면 label = instance slug 로 해석. 역방향(slug→canonical host)도 동일 조건으로 `<slug>.<BASE>` 파생.

## 설계

### SDS-01 · custom-domains.ts 파생 — 대칭 불변식

**slugForHost 와 canonicalHostForSlug 는 반드시 하나의 공유 판정 함수를 쓴다** (비평: 비대칭 스펙은 hijacked/dead canonical 을 만든다). 파생 가능 조건 전부:

1. **환경 가드**: `NODE_ENV !== 'development' && VERCEL_ENV === 'production'` (indexnow.ts:37-38 · middleware crossHostRedirectEnabled 와 동일 fail-closed 패턴). 근거: `vercel env pull` 이 로컬 .env 에 `VERCEL_ENV=production` 을 내려준 실사례 (commit 22002ec). 가드 없으면 dev/preview 에서 전 인스턴스 sitePathPrefix 가 `""` 로 flip → localhost 는 rewrite 가 없어 **모든 내부링크 404** (CLAUDE.md /demo 시각검수 4경로 포함). trade-off: preview 의 canonical 도 path 기반으로 남음 (preview 는 Vercel 이 noindex 부여 — 수용).
2. **BASE 설정**: `BASE_SITE_DOMAIN` env (예 `key-mom.kr`) — normalizeHost 적용, module-load 1회.
3. **DNS 라벨 유효성**: slug regex 는 64자·끝 하이픈을 허용하지만 DNS 라벨은 ≤63자·LDH(RFC 1123). 파생 라벨 검사는 `^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$` — 불통과 slug 는 path-based 로 남김.
4. **RESERVED 라벨 제외**: `admin`·`api`·`mail`·`ns1`·`ns2`·`smtp` 최소셋. `www` 는 normalizeHost 가 선제 strip 하므로 dead entry — 넣지 않는다 (비평 반영).
5. **제외 slug denylist**: env `BASE_DOMAIN_EXCLUDE_SLUGS` (CSV · Production scope). 기본 권장값 `demo` — 내부/세일즈 인스턴스가 클라이언트 브랜드 도메인 아래 색인 가능 상태로 노출되는 것 방지. 클라이언트 인스턴스에는 손대지 않으므로 zero-touch 유지.
6. **명시 맵 선점 검사**: 파생 결과 `<slug>.<BASE>` 가 `HOST_TO_SLUG` 에 **다른 slug 로** 이미 점유돼 있으면 파생 거부 (path-based 유지). 예: 명시 맵 `{"bupyeong.key-mom.kr":"daeatdiet-incheon"}` 상태에서 미래에 slug `bupyeong` 인스턴스를 만들면 — 선점 검사 없이는 canonical/sitemap/IndexNow 가 **타 인스턴스 콘텐츠를 서빙하는 host** 를 가리키게 된다.

부수 정리: `isCustomDomainHost` 는 소비처 0 인 dead export — 파생 도입으로 의미가 바뀌므로 삭제.

### SDS-02 · middleware 확장 — 호스트 전이표

신규 규칙 **(4) host-canonical dedupe**: slug 는 해석됐는데 `canonicalHostForSlug(slug) !== host` 이면 canonical host 로 301 (crossHostRedirectEnabled + GET/HEAD 한정). 규칙 (3) 은 파생 도입 순간 의미가 확장된다 — 아래 표를 vitest(순수 함수 분리)로 고정한다.

| 요청 host · path | 동작 | 비고 |
|---|---|---|
| 명시맵 canonical host `/…` | (1) rewrite (현행 유지) | bupyeong.key-mom.kr |
| 명시맵 canonical host `/<slug>/…` | (2) slug-strip 301 (현행 유지) | |
| 명시맵 alias host (2번째+ host) | **(4) canonical host 301** | 현행은 중복 콘텐츠 서빙 — 의도된 SEO 개선 (행동 변화 명시) |
| 파생 host (label=slug · 파생 가능) | (1)/(2) 동일 · canonical=자기 자신 → (4) 미발동 | site2.key-mom.kr |
| 파생 host 인데 명시맵이 그 slug 의 canonical 을 보유 | **(4) 301** → 명시맵 canonical | daeatdiet-incheon.key-mom.kr → bupyeong.key-mom.kr |
| vercel.app `/<명시맵 slug>/…` | (3) cross-host 301 (현행 유지) | |
| vercel.app `/<파생 가능 segment>/…` | (3) **확장 발동** — `<segment>.<BASE>` 로 301 | 아래 수용 trade-off |
| apex `key-mom.kr` · `www.key-mom.kr` (normalizeHost 로 동일) | 명시맵 alias 등록(G0-1) → (4) canonical 301 | 미등록 시 passthrough → RootLanding |
| **BASE 하위인데 파생 실패한 host** — 제외 slug(`demo.<BASE>`)·예약어(`mail.<BASE>`)·무효 라벨·다중 레벨 | **(5) 404 거부** (v1.1 리뷰 반영) | 방치 시 와일드카드 DNS 로 RootLanding·path-based 콘텐츠가 브랜드 도메인 아래 200 서빙 — 제외 정책 우회 |
| `www.<label>.<BASE>` (2-레벨) | 미지원 명시 | 와일드카드 인증서는 1-레벨만 커버 (RFC 6125) — TLS 단계에서 도달 불가. normalizeHost 의 www-strip 으로 구제되지 않음. 테스트 기대값 문서화 |

**수용된 trade-off (기록)**: 규칙 (3) 확장은 DB-blind 라 vercel.app 의 임의 첫 segment(오타·스캐너)가 404 대신 `<segment>.<BASE>` 301→404 체인이 된다. Edge 에서 인스턴스 존재 검증 불가(= DB 컬럼안 기각 사유와 동일) — production·GET/HEAD 한정이므로 수용. 전환기 stale vercel.app 탭의 server action 후속 GET(예 consultation thank-you) 이 404 되는 것은 **현행 명시맵 slug 에서도 동일한 기존 수용 사항** (middleware.ts:35 주석) — 확장으로 새로 생기는 결함 아님.

### SDS-00 · [선행·독립] /api/track slug 유실 패치 — **라이브 버그**

비평 발견 (blocker · 2 critic 교차 확인): beacon 은 `page_path` 로 `window.location.pathname` 을 그대로 보내는데 (beacon.ts:82), 커스텀 도메인 루트 서빙에서는 경로에 slug prefix 가 없다. 서버 `extractSlugFromPagePath` 가 첫 segment(`treatments` 등)를 slug 로 오인 → instance 미존재 → **204 silent drop** (server.ts:129-134 · track/route.ts:94-96). 홈 `/` 는 zod min(2) 에서 거부.

→ **bupyeong.key-mom.kr 라이브에서 전환 이벤트(전화/예약 클릭)가 지금 전량 유실 중**. 파생 도입 시 전 인스턴스로 확대. `TRACK_ORIGIN_ALLOWLIST` 추가로는 해결 안 됨 (Origin 통과 후 slug 해석 단계에서 죽음).

수정 (v1.1 구현 — 방식 변경): **서버가 `x-forwarded-host ?? host` 를 `slugForHost` 로 우선 해석**하고 page_path 첫 segment 파싱은 fallback 으로 유지, `page_path` zod `min(2)→min(1)` (커스텀 도메인 홈 `/` 허용). beacon 은 무변경 — v1.0 초안의 "beacon body 에 instanceSlug 명시 전송"은 클라이언트 제어 값(100% 위조 가능)인 반면 host 는 Vercel 플랫폼이 설정하므로 host 우선이 보안상 우위이고, 배포 전 구버전 beacon 번들도 자동 커버된다 (구현: `resolveTrackInstanceSlug` — server.ts + track/route.ts). **파생 도입과 무관하게 즉시 패치 대상.**

### SDS-03 · GSC 정합

- `matchesInstanceDomain` (visibility-metrics/sync-actions.ts:47-68) 은 `PUBLIC_SITE_ORIGIN` 단일 host 만 비교 — 커스텀/파생 host 의 URL-prefix property 등록이 거부된다. → `canonicalHostForSlug(instanceSlug)` host 비교 추가.
- **property 전략 (G0-3)**: 권장 = **서브도메인별 URL-prefix property 유지** (인스턴스별 데이터 분리 — `sc-domain:key-mom.kr` Domain property 는 matchesInstanceDomain 이 per-instance 구분 불가). 소유확인은 전역 meta 토큰(verification-tokens.ts:8 · 전 페이지 출력)으로 자동 통과 — 동일 Glitzy GSC 계정 전제.
- per-instance 절차에 GSC 온보딩 명시 (§ 운영): property 등록 → SA 권한 → 어드민 addSearchProperty.

### SDS-04 · 어드민 인스턴스 생성/복제 검증

- CreateInstanceSection + clone-instance action 에 파생 관점 검증 추가: RESERVED 라벨 · DNS 라벨 유효성(≤63·끝 하이픈) · 명시맵 라벨 충돌 (`<slug>.<BASE>` ∈ HOST_TO_SLUG keys) — 위반 slug 는 생성 차단 또는 "서브도메인 미발급" 경고.
- 안내 문구 갱신: 현행 "URL `/<slug>` 에 사용" → "서브도메인 `<slug>.<BASE>` 로 서빙" 규약 안내.

### SDS-05 · env 문서화 + 문서/테스트 정합

- `.env.example` 에 미문서 env 일괄 추가: `CUSTOM_DOMAIN_MAP` · `BASE_SITE_DOMAIN` · `BASE_DOMAIN_EXCLUDE_SLUGS` · `PUBLIC_SITE_ORIGIN` · `TRACK_ORIGIN_ALLOWLIST` · `NAVER_INDEXNOW_KEY` (미설정 시 IndexNow 조용히 비활성 — indexnow.ts:39).
- CLAUDE.md:104 회귀 방지 규칙("canonical/host 는 env(CUSTOM_DOMAIN_MAP 역방향·PUBLIC_SITE_ORIGIN)로 계산")에 BASE_SITE_DOMAIN 반영. custom-domains.ts:1 의 PSR-DEFER-02 SoT 주석 → 본 plan 참조 추가.
- vitest (site-path-prefix.test.ts 의 module-reset(importWithDomainMap) 패턴 재사용):
  - custom-domains: 파생 우선순위(명시맵>파생) · RESERVED · denylist · DNS 라벨 경계(63자/trailing hyphen) · 명시맵 선점 · 환경 가드 · apex/다중레벨/www-2레벨 거부.
  - middleware 전이표 (§ SDS-02 매트릭스 전체 — 판정 로직 순수 함수 분리).
  - site-metadata canonical + indexnow canonicalBaseForNotify: **간접 커버** — 두 소비처 모두 `canonicalHostForSlug` 단일 경로이며 custom-domains.test 가 파생을 직접 고정 (v1.1 확정).
  - track: `resolveTrackInstanceSlug` host 우선 + page_path fallback (resolve-slug.test).

## 운영 (1회성) — Vercel 와일드카드 runbook (BASE = onwell.site · 2026-07-03 확정)

**BASE 도메인 결정 (2026-07-03)**: 사용자가 4-렌즈 네이밍 리서치(네이밍·네이버 SEO/신뢰·의료법/상표·경쟁 선점) 후 **`onwell.site` 구매 확정** — 범용(병의원 주력·브랜드 비종속) 전환. notion.site 패턴의 "조용한 인프라" 문법으로 `<slug>.onwell.site` 가 지점명처럼 읽힘. 리서치 규칙: 메디/닥터/-닥 계열 포화·클리닉은 의료법 제42조 유사명칭(복지부 유권해석)·최상급/유인성 단어 금지.

Vercel 공식 문서 확인: **와일드카드 도메인은 nameservers 방식 검증 필수** (vercel.com/docs/domains/working-with-domains/add-a-domain).

**신규 도메인의 운영 보너스**: onwell.site 는 레코드 0 의 백지 상태 — v1.0 runbook 에서 가장 위험하던 "기존 레코드 선등록 + 라이브 클라이언트 무중단 모니터링" 단계가 통째로 사라짐. **key-mom.kr 의 NS 위임은 불필요해짐** — bupyeong.key-mom.kr 은 현행 CNAME + 명시맵으로 그대로 공존.

**runbook (onwell.site)**:
1. Vercel 프로젝트에 `*.onwell.site` (와일드카드) 도메인 추가 — Vercel 이 안내하는 네임서버(ns1/ns2.vercel-dns.com)를 확인.
2. 구매한 레지스트라에서 onwell.site 의 NS 를 Vercel 네임서버로 변경 (신규 도메인이라 전파 대기 외 리스크 없음).
3. 전파 후 와일드카드 TLS 발급 확인 — `curl -sI https://test.onwell.site` 가 TLS 성립(응답은 404 여도 무관).
4. Vercel **Production 환경 전용**으로 `BASE_SITE_DOMAIN=onwell.site` 설정 → redeploy 1회. `BASE_DOMAIN_EXCLUDE_SLUGS` 는 미설정 유지(코드 기본값 demo). **순서 강제: 와일드카드 TLS 라이브 전에 BASE 설정 금지** (역순이면 vercel.app 301 이 dead host 행).
5. `TRACK_ORIGIN_ALLOWLIST` 에 `*.onwell.site` 추가 (기존 bupyeong.key-mom.kr 항목 유지).
6. 로컬 `vercel env pull` 오염 대응: pull 후 .env 에서 BASE_SITE_DOMAIN 제거 (코드 가드가 2중 방어).
7. **apex `onwell.site` 는 프로젝트에 연결하지 않음** (미연결 = 무응답) — 연결 시 RootLanding(관리자 랜딩)이 노출됨. 추후 서비스 소개 랜딩을 만들 때 연결 (SDS-DEFER-04).

**배포 후 스모크 (onwell.site 기준 · BASE 설정 직전 instance 목록 실사 — 명시맵/제외 외 slug 가 있으면 그 인스턴스는 canonical flip)**:
- `daeatdiet-incheon.onwell.site/x` → **301 → bupyeong.key-mom.kr/x** (규칙 4 — 명시맵 canonical 우선)
- `demo.onwell.site` · `mail.onwell.site` → **404** (규칙 5 — 제외 slug·예약어)
- `<미존재라벨>.onwell.site` → 404 (rewrite 후 인스턴스 미존재)
- 신규 인스턴스 생성 후: `<slug>.onwell.site` 200 · sitemap.xml loc / robots.txt Sitemap / rss.xml link 가 해당 origin 일치 · vercel.app/`<slug>` → 301 · 어드민 PublicSiteLink 정합 · /api/track 이벤트 적재 (bupyeong 에서도 SDS-00 fix 적재 확인)

**(선택 · 별도 트랙) key-mom.kr apex**: 구 G0-1 결정(apex → bupyeong 301)은 BASE 전환으로 Phase 2 필수에서 제외 — 원하면 key-mom.kr(apex)을 Vercel 프로젝트에 도메인 추가(TXT 검증 · NS 위임 불필요)하고 `CUSTOM_DOMAIN_MAP` 에 `"key-mom.kr":"daeatdiet-incheon"` alias 를 추가하면 규칙 (4) 가 301 처리. 현재는 TLS 미발급으로 죽어 있는 상태 그대로 무해.

## 운영 (per-instance · 이후 반복 절차)

1. 어드민 `/admin/super` 복제 — slug = 원하는 서브도메인 라벨 (SDS-04 검증 통과). **코드/env/DNS/redeploy 불필요** (옵션 A 기준).
2. 네이버 서치어드바이저: 신규 서브도메인 사이트 등록 + 소유확인 토큰을 어드민 의원정보 폼 입력 (C0051 per-instance 컬럼) + sitemap/RSS 제출.
3. GSC: URL-prefix property 등록 (전역 meta 토큰으로 소유확인 자동) → SA email 권한 부여 → 어드민 검색노출 addSearchProperty.
4. `TRACK_ORIGIN_ALLOWLIST` 는 `*.key-mom.kr` 1회 등록으로 이후 자동 커버 (site-tracking suffix 와일드카드 기지원).

**canonical flip 재색인 절차** (기존 path-based 로 색인/등록된 인스턴스가 파생으로 flip 되는 경우): 신규 host 로 NSA 사이트 **재등록** (NSA 크롤러는 301 을 따라가지 않음 — app/page.tsx:4-6 의 2026-05-22 실사고) + GSC 신규 property 등록·sitemap 재제출 (GSC 데이터는 property 간 이전 불가 — 구 property 는 이력 보관). 현재 라이브 클라이언트는 daeatdiet-incheon 1건(명시맵 유지 — flip 없음)이라 초기 적용 영향 없음. **배포 전 instance 목록 실사로 재확인.**

## 리스크 & 트레이드오프 (기록)

- **공유 도메인 구조**: 단일 도메인 아래 서로 다른 의료기관(제3자) N개는 Google **site reputation abuse** 스팸 정책의 표적 패턴과 형태가 같다. 현재는 BASE 권위가 낮아 '호스트 권위 이용' 요건이 약하고, 프로젝트 진입 전략(정보형 롱테일+AI 브리핑 인용)은 도메인 권위 의존이 낮아 당장의 모순은 없음. 단 (a) 한 서브도메인의 저품질/제재가 도메인 전체에 파급될 수 있고, (b) 네이버는 대표주소(서브도메인)별 별개 사이트로 취급하므로 신규 인스턴스가 BASE 권위를 상속한다는 보장도 없음 — 공유 BASE 의 근거는 운영 편의다. **exit 경로**: 성과 나는 클라이언트는 독립 도메인 구매 → CUSTOM_DOMAIN_MAP 명시 등록 (우선 규칙이 그대로 escape hatch).
- 어드민 세션은 host-only cookie — 서브도메인마다 별도 로그인. 운영 규칙: 어드민은 지정 host(현행 vercel.app 또는 추후 admin 전용 host) 에서만 사용 (SDS-DEFER-03).
- Google 소유확인 전역 하드코드 토큰: 동일 Glitzy GSC 계정 전제. 클라이언트별 계정 필요 시 C0051 패턴 컬럼 이관 (SDS-DEFER-02).

## G0 — 사용자 결정 (2026-07-02 확정 · 전부 권장안 채택)

| # | 결정 | 확정 |
|---|---|---|
| G0-1 | **apex `key-mom.kr`(=www) 서빙 방침** — 현재 TLS 깨진 채 죽어 있고, 프로젝트에 붙이면 RootLanding(관리자 로그인 랜딩)이 브랜드 루트에 노출됨 | ✅ 대표 서브도메인(bupyeong) 301 — alias 매핑으로 규칙 (4) 가 처리. **v1.2: BASE 가 onwell.site 로 바뀌며 Phase 2 필수에서 선택 항목으로 강등** (§운영 말미 별도 트랙) |
| G0-2 | **`BASE_DOMAIN_EXCLUDE_SLUGS` 초기값** | ✅ `demo` 제외 — env 미설정 시 코드 기본값도 `{"demo"}` (fail-safe) |
| G0-3 | **GSC property 전략** | ✅ 서브도메인별 URL-prefix 유지 (데이터 분리) |
| G0-4 | **운영 옵션 A(NS 위임) vs B(서브도메인별 CNAME)** | ✅ A — **v1.2: 적용 대상이 key-mom.kr → 신규 BASE `onwell.site` 로 변경** (레코드 0 백지라 이관 리스크 자체가 소멸 · key-mom.kr NS 위임 불필요) |
| G0-5 | **BASE 도메인 확정** (2026-07-03) | ✅ `onwell.site` 구매 완료 — 4-렌즈 네이밍 리서치 (온웰: 溫/on+wellness · 발음↔철자 1:1 · 의료법 저촉 단어 없음 · notion.site 형 인프라 문법). 잔여 권고: KIPRIS 상표(35/42/44류) 조회 + `onwell.kr` 방어 등록 검토(리서치 시점 미등록 신호) |

## 비범위 / DEFER

- **SDS-DEFER-01**: `instance.custom_domain` DB 컬럼 + RLS 승격 — 임의 고객 도메인 대량화 시 (Edge 제약 재설계 포함).
- **SDS-DEFER-02**: Google 소유확인 토큰 per-instance 컬럼화.
- **SDS-DEFER-03**: 어드민 전용 host 단일화 (admin.onwell.site 등 — RESERVED 에 이미 선점).
- **SDS-DEFER-04**: apex `onwell.site` 서비스 소개 랜딩 — 연결 전까지 apex 미연결 유지 (RootLanding 노출 방지).
- 메인 도메인 루트의 통합 sitemap/robots (apex 는 인스턴스 사이트가 아님 — G0-1 로 301 처리 시 불필요).

## 구현 순서 & 수용 기준

| Phase | 내용 | 검증 | 상태 |
|---|---|---|---|
| 0 | SDS-00 track 패치 (라이브 버그 — 즉시) + SDS-05 .env.example | vitest + bupyeong 실이벤트 적재 확인 | ✅ 코드 완료 (실이벤트 적재는 배포 후 확인) |
| 1 | SDS-01 파생 + SDS-02 middleware + SDS-03 GSC + SDS-04 어드민 검증 | typecheck 0 · 신규 vitest 전부 PASS (전이표 포함) · `pnpm web:build` | ✅ 완료 — vitest 381 (+57: 파생 21·전이표 12·track 4 등) |
| 2 | 운영 1회성 runbook (G0-4=A) + BASE env 설정 | 배포 후 스모크 체크리스트 전항 | ⏳ 사용자 플랫폼 작업 (NS 위임 → *.key-mom.kr → BASE env) |
| 3 | per-instance 절차 첫 실행 (2호 인스턴스) 으로 zero-touch 실증 | 신규 서브도메인 200 + NSA/GSC 온보딩 완료 | ⏳ Phase 2 이후 |

구현 파일 (Phase 0+1): `lib/custom-domains.ts`(파생+검증) · `lib/site-routing.ts`(신설 — 판정 순수 함수) · `middleware.ts`(슬림화) · `lib/site-tracking/server.ts`+`app/api/track/route.ts`(SDS-00) · `visibility-metrics/sync-actions.ts`(SDS-03) · `lib/admin/clone-instance.ts`+`CreateInstanceSection.tsx`(SDS-04) · `.env.example`+CLAUDE.md(SDS-05) · vitest 3파일 신설.

## 변경 이력

- **2026-07-02 v1.0**: 최초 작성. 5-agent 구조 감사 + 3-lens 적대적 비평(정합성·SEO/운영·완전성) 반영 — track slug 유실(라이브)·파생 대칭 불변식·환경 가드·명시맵 선점·전이표·NS 위임 runbook·재색인 절차·공유 도메인 트레이드오프 수록.
- **2026-07-02 v1.1**: G0 4건 확정(전부 권장안 — apex 는 alias 매핑으로 코드 0줄 처리) + Phase 0/1 구현 완료. isCustomDomainHost dead export 삭제. 구현 후 3-lens 적대적 리뷰(회귀·파생 정확성·보안/운영 — 3/3 approve · blocker 0) 지적 반영: (a) SDS-00 을 beacon body 방식 → 서버 host 우선 해석으로 변경(보안 우위·구버전 호환), (b) 규칙 (5) 신설 — BASE 하위 비파생 host 404 (demo/예약어 fall-through 노출 차단), (c) claimed 선점 검사를 BASE env 무관 판정으로 강화(Phase 2 이전 시간창 공백 해소), (d) seed.ts 에도 SDS-04 검증 적용, (e) EXCLUDE env 대체(replace) 동작 경고 문서화.
- **2026-07-03 v1.2**: BASE 도메인 **onwell.site** 구매 확정 (G0-5 — 범용 전환 · 4-렌즈 네이밍 리서치). 운영 runbook 을 onwell.site 기준으로 재작성 — 신규 백지 도메인이라 기존 레코드 이관·라이브 무중단 모니터링 단계 소멸, **key-mom.kr NS 위임 불필요화** (bupyeong 은 현행 CNAME+명시맵 공존). 구 G0-1(key-mom.kr apex 301)은 선택 트랙으로 강등, apex onwell.site 는 미연결 유지(SDS-DEFER-04). 코드 변경 없음 — env 값만 다름.
