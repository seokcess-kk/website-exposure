# SUBDOMAIN_SCALE_PLAN (v1.3 · 2026-07-03 · BASE=onwell.site · key-mom.kr 완전 폐기)

> **상태**: Phase 0+1 코드 구현 완료 (main 머지·push — commit `dc59f3a`). typecheck 0 · vitest 383 · `pnpm web:build` 통과. **Phase 2(운영 1회성 — onwell.site 와일드카드 + BASE env)는 사용자 플랫폼 작업 대기.**
>
> **v1.3 방향 전환 (2026-07-03)**: 사용자가 `key-mom.kr` 을 **완전 폐기**(301 브릿지 없이 즉시 · 기존 색인 자산 소멸 감수)하고 라이브 클라이언트(slug `daeatdiet-incheon`)를 **`daeatdiet-incheon.onwell.site`** 로 이전하기로 결정. slug=서브도메인 라벨이라 **BASE 파생이 자동 처리 → 명시맵(CUSTOM_DOMAIN_MAP) 자체가 불필요**해짐. 프로덕션에서 명시맵은 비운다(코드 기능은 미래 임의 고객 도메인용으로 유지).
>
> **목표**: "메인 도메인 1개(BASE) + 복제 인스턴스별 서브도메인" 을 **인스턴스 추가 시 env 수정·redeploy 없이(zero-touch)** 운영.

## 배경

- PSR-DEFER-02 원 설계 의도부터 "subdomain `<slug>.glitzy.co` + custom domain CNAME" 즉 인스턴스별 서브도메인 N개였고 (PUBLIC_SITE_RENDER_PLAN.md:651), 구현은 단일 클라이언트 MVP 를 위해 정적 env 매핑으로 축소됐다 (2026-06-30 · 구 `bupyeong.key-mom.kr` 라이브 — 2026-07-03 폐기).
- host→slug 해석과 canonical 출력은 이미 단일 SoT (`lib/custom-domains.ts`) 로 통일 — middleware rewrite · siteBaseUrl · sitemap/robots/RSS · IndexNow · sitePathPrefix 가 전부 이 모듈만 본다. **파생 규칙을 이 모듈에만 추가하면 나머지가 자동 정합**되는 구조가 이 plan 의 토대다.
- 사업 결정 (2026-07-02): 서브도메인을 계속 늘린다 → env-per-instance 는 지속 불가. (2026-07-03) BASE 를 범용 도메인 `onwell.site` 로 확정하고 브랜드색 있는 `key-mom.kr` 은 폐기.

## 결정

**"라벨=slug 규약 + 와일드카드 파생 fallback, 명시 맵 우선" 하이브리드.**

| 선택지 | 판정 | 사유 |
|---|---|---|
| A. env 맵 유지 (현행) | 기각 | 서브도메인마다 env+redeploy — 확장 모델과 모순 |
| B. `instance.custom_domain` DB 컬럼 승격 | **DEFER** (SDS-DEFER-01) | Edge middleware 에서 sync DB 조회 불가 (per-request fetch latency + 실패 모드). 성장 축이 자사 BASE 서브도메인인 동안 불필요. 임의 고객 apex 도메인이 대량화되면 재검토 |
| C. **BASE_SITE_DOMAIN 파생 + 명시 맵 우선** | **채택** | zero-touch. 라이브 클라이언트 `daeatdiet-incheon` 은 slug=라벨이라 **파생으로 자동** (명시맵 불필요). 명시맵은 미래에 임의 고객 독립 도메인(라벨≠slug)이 생길 때만 쓰는 escape hatch 로 남긴다 |

파생 규칙: host 가 `<label>.<BASE>` (단일 라벨) 이고 label 이 파생 가능 조건을 통과하면 label = instance slug 로 해석. 역방향(slug→canonical host)도 동일 조건으로 `<slug>.<BASE>` 파생.

## 설계

### SDS-01 · custom-domains.ts 파생 — 대칭 불변식

**slugForHost 와 canonicalHostForSlug 는 반드시 하나의 공유 판정 함수를 쓴다** (비평: 비대칭 스펙은 hijacked/dead canonical 을 만든다). 파생 가능 조건 전부:

1. **환경 가드**: `NODE_ENV !== 'development' && VERCEL_ENV === 'production'` (indexnow.ts:37-38 · middleware crossHostRedirectEnabled 와 동일 fail-closed 패턴). 근거: `vercel env pull` 이 로컬 .env 에 `VERCEL_ENV=production` 을 내려준 실사례 (commit 22002ec). 가드 없으면 dev/preview 에서 전 인스턴스 sitePathPrefix 가 `""` 로 flip → localhost 는 rewrite 가 없어 **모든 내부링크 404** (CLAUDE.md /demo 시각검수 4경로 포함). trade-off: preview 의 canonical 도 path 기반으로 남음 (preview 는 Vercel 이 noindex 부여 — 수용).
2. **BASE 설정**: `BASE_SITE_DOMAIN` env (프로덕션 `onwell.site`) — normalizeHost 적용, module-load 1회.
3. **DNS 라벨 유효성**: slug regex 는 64자·끝 하이픈을 허용하지만 DNS 라벨은 ≤63자·LDH(RFC 1123). 파생 라벨 검사는 `^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$` — 불통과 slug 는 path-based 로 남김.
4. **RESERVED 라벨 제외**: `admin`·`api`·`mail`·`ns1`·`ns2`·`smtp` 최소셋. `www` 는 normalizeHost 가 선제 strip 하므로 dead entry — 넣지 않는다 (비평 반영).
5. **제외 slug denylist**: env `BASE_DOMAIN_EXCLUDE_SLUGS` (CSV · Production scope). 기본값 `demo` — 내부/세일즈 인스턴스가 브랜드 도메인 아래 색인 가능 상태로 노출되는 것 방지. 클라이언트 인스턴스에는 손대지 않으므로 zero-touch 유지.
6. **명시 맵 선점 검사**: 파생 결과 `<slug>.<BASE>` 가 `HOST_TO_SLUG` 에 **다른 slug 로** 이미 점유돼 있으면 파생 거부 (path-based 유지). 미래에 명시맵을 다시 쓰게 될 때(임의 고객 도메인) canonical/sitemap/IndexNow 가 타 인스턴스 콘텐츠 host 를 가리키는 hijack 을 방지한다. 현재 프로덕션은 명시맵이 비어 있어 무발동.

부수 정리: `isCustomDomainHost` 는 소비처 0 인 dead export — 파생 도입으로 의미가 바뀌므로 삭제.

### SDS-02 · middleware 확장 — 호스트 전이표

신규 규칙 **(4) host-canonical dedupe**: slug 는 해석됐는데 `canonicalHostForSlug(slug) !== host` 이면 canonical host 로 301 (crossHostRedirectEnabled + GET/HEAD 한정). 규칙 (3) 은 파생 도입 순간 의미가 확장된다 — 아래 표를 vitest(순수 함수 분리)로 고정한다. (예시의 `clinic.example.com` 은 "미래 임의 고객 도메인" 명시맵 시나리오 — 현재 프로덕션엔 명시맵 없음.)

| 요청 host · path | 동작 | 비고 |
|---|---|---|
| 파생 host `daeatdiet-incheon.onwell.site/…` | (1) rewrite → `/daeatdiet-incheon/…` | 라이브 클라이언트 · canonical=자기 자신 → (4) 미발동 |
| 파생 host `.../<slug>/…` (slug prefix 직접 접근) | (2) slug-strip 301 → 루트 경로 | 중복 URL 정리 |
| (명시맵) canonical host `clinic.example.com/…` | (1) rewrite | 미래 임의 고객 도메인 |
| (명시맵) alias host (2번째+ host) | **(4) canonical host 301** | 중복 콘텐츠 서빙 방지 |
| (명시맵) 파생 host 인데 명시맵이 그 slug 의 canonical 보유 | **(4) 301** → 명시맵 canonical | 명시맵 우선 |
| vercel.app `/<파생 가능 slug>/…` | (3) cross-host 301 → `<slug>.onwell.site` | 예: vercel.app/daeatdiet-incheon → daeatdiet-incheon.onwell.site |
| vercel.app `/<파생 가능 임의 segment>/…` | (3) **확장 발동** — `<segment>.onwell.site` 로 301 | 아래 수용 trade-off |
| **BASE 하위인데 파생 실패한 host** — 제외 slug(`demo.onwell.site`)·예약어(`mail.onwell.site`)·무효 라벨·다중 레벨 | **(5) 404 거부** | 방치 시 와일드카드 DNS 로 RootLanding·path-based 콘텐츠가 브랜드 도메인 아래 200 서빙 — 제외 정책 우회 |
| apex `onwell.site` · `www.onwell.site` | 미연결 (프로젝트에 추가 안 함) | 연결 시 RootLanding 노출 — SDS-DEFER-04 |
| `www.<label>.onwell.site` (2-레벨) | 미지원 명시 | 와일드카드 인증서는 1-레벨만 커버 (RFC 6125) — TLS 단계에서 도달 불가 |

**수용된 trade-off (기록)**: 규칙 (3) 확장은 DB-blind 라 vercel.app 의 임의 첫 segment(오타·스캐너)가 404 대신 `<segment>.onwell.site` 301→404 체인이 된다. Edge 에서 인스턴스 존재 검증 불가(= DB 컬럼안 기각 사유와 동일) — production·GET/HEAD 한정이므로 수용. 전환기 stale vercel.app 탭의 server action 후속 GET(예 consultation thank-you) 이 404 되는 것은 **기존 수용 사항** (middleware.ts 주석) — 확장으로 새로 생기는 결함 아님.

### SDS-00 · [선행·독립] /api/track slug 유실 패치 — **라이브 버그**

비평 발견 (blocker · 2 critic 교차 확인): beacon 은 `page_path` 로 `window.location.pathname` 을 그대로 보내는데, 커스텀/파생 도메인 루트 서빙에서는 경로에 slug prefix 가 없다. 서버 `extractSlugFromPagePath` 가 첫 segment(`treatments` 등)를 slug 로 오인 → instance 미존재 → **204 silent drop**. 홈 `/` 는 zod min(2) 에서 거부.

→ **구 커스텀 도메인 라이브(당시 bupyeong.key-mom.kr)에서 전환 이벤트(전화/예약 클릭)가 전량 유실 중이던 버그**. 파생 도입 시 전 인스턴스로 확대. `TRACK_ORIGIN_ALLOWLIST` 추가로는 해결 안 됨 (Origin 통과 후 slug 해석 단계에서 죽음).

수정 (구현): **서버가 `x-forwarded-host ?? host` 를 `slugForHost` 로 우선 해석**하고 page_path 첫 segment 파싱은 fallback 으로 유지, `page_path` zod `min(2)→min(1)` (커스텀/파생 도메인 홈 `/` 허용). beacon 은 무변경 — host 는 Vercel 플랫폼이 설정하므로 클라이언트 제어 body-slug 보다 보안상 우위이고 구버전 beacon 번들도 자동 커버 (구현: `resolveTrackInstanceSlug`). **파생 도입과 무관하게 즉시 패치 대상.**

### SDS-03 · GSC 정합

- `matchesInstanceDomain` (visibility-metrics/sync-actions.ts) 은 `PUBLIC_SITE_ORIGIN` 단일 host 만 비교 — 커스텀/파생 host 의 URL-prefix property 등록이 거부된다. → `canonicalHostForSlug(instanceSlug)` host 비교 추가 (파생 host `daeatdiet-incheon.onwell.site` 를 허용).
- **property 전략 (G0-3)**: 서브도메인별 URL-prefix property 유지 (인스턴스별 데이터 분리). 소유확인은 전역 meta 토큰(verification-tokens.ts · 전 페이지 출력)으로 자동 통과 — 동일 Glitzy GSC 계정 전제.
- per-instance 절차에 GSC 온보딩 명시 (§ 운영): property 등록 → SA 권한 → 어드민 addSearchProperty.

### SDS-04 · 어드민 인스턴스 생성/복제 검증

- CreateInstanceSection + clone-instance + seed 에 파생 관점 검증 추가: RESERVED 라벨 · DNS 라벨 유효성(≤63·끝 하이픈) · 명시맵 라벨 충돌 (`slugSubdomainIssue`) — 위반 slug 는 생성 차단.
- 안내 문구 갱신: "URL `/<slug>` 에 사용" → "서브도메인 `<slug>.<BASE>` 로 서빙" 규약 안내.

### SDS-05 · env 문서화 + 문서/테스트 정합

- `.env.example` 에 도메인/트래킹 env 문서화: `CUSTOM_DOMAIN_MAP`(임의 고객 도메인용 · 라벨≠slug 일 때만) · `BASE_SITE_DOMAIN`(`onwell.site`) · `BASE_DOMAIN_EXCLUDE_SLUGS` · `PUBLIC_SITE_ORIGIN` · `TRACK_ORIGIN_ALLOWLIST`(`*.onwell.site`) · `NAVER_INDEXNOW_KEY`.
- CLAUDE.md 회귀 방지 규칙에 BASE_SITE_DOMAIN 반영.
- vitest: custom-domains(파생 우선순위·RESERVED·denylist·DNS 라벨 경계·명시맵 선점·환경 가드·apex/다중레벨 거부) · middleware 전이표(순수 함수) · track(resolveTrackInstanceSlug) · site-metadata/indexnow 간접 커버(canonicalHostForSlug 단일 경로). 테스트 fixture 는 예시 host 로 `onwell.site` 계열 사용(key-mom.kr 흔적 제거).

## 운영 (1회성) — Vercel 와일드카드 runbook (BASE = onwell.site)

**BASE 도메인 (2026-07-03)**: 4-렌즈 네이밍 리서치(네이밍·네이버 SEO/신뢰·의료법/상표·경쟁 선점) 후 **`onwell.site` 구매 확정** — 범용(병의원 주력·브랜드 비종속). notion.site 형 "조용한 인프라" 문법으로 `<slug>.onwell.site` 가 지점명처럼 읽힘. 리서치 규칙: 메디/닥터/-닥 계열 포화·클리닉은 의료법 제42조 유사명칭(복지부 유권해석)·최상급/유인성 단어 금지. 잔여 권고: KIPRIS 상표(35/42/44류) 조회 + `onwell.kr` 방어 등록.

Vercel 공식 문서 확인: **와일드카드 도메인은 nameservers 방식 검증 필수** — 저장 시 Vercel 이 자동으로 NS 방식 활성화 + ns1/ns2.vercel-dns.com 제공. env 변경은 **redeploy 해야 반영**(자동 적용 안 됨). (vercel.com/docs/domains/working-with-domains/add-a-domain · /environment-variables)

**신규 도메인의 운영 보너스**: onwell.site 는 레코드 0 의 백지라 기존 레코드 이관·무중단 모니터링 단계가 없다. **key-mom.kr 은 NS 위임 없이 그대로 폐기**(아래).

**runbook (onwell.site)**:
1. Vercel 프로젝트에 `*.onwell.site` (와일드카드) 도메인 추가. **apex `onwell.site` 는 추가하지 않음**(연결 시 RootLanding 노출 — SDS-DEFER-04).
2. onwell.site 레지스트라에서 NS 를 Vercel(ns1/ns2.vercel-dns.com)로 변경 (신규 도메인이라 이관 리스크 없음).
3. 전파 후 와일드카드 TLS 발급 확인 — `curl -sI https://test.onwell.site` 가 TLS 성립(응답 404 무관).
4. Vercel **Production 환경 전용** env 설정 → redeploy 1회:
   - `BASE_SITE_DOMAIN=onwell.site`
   - `TRACK_ORIGIN_ALLOWLIST=*.onwell.site`
   - `CUSTOM_DOMAIN_MAP` — **비우거나 삭제** (명시맵 불필요 · key-mom.kr 흔적 제거). 미래 임의 고객 도메인 생길 때만 재설정.
   - `BASE_DOMAIN_EXCLUDE_SLUGS` 미설정 유지(코드 기본값 demo).
   - **순서 강제: 와일드카드 TLS 라이브 전에 BASE 설정 금지** (역순이면 vercel.app 301 이 dead host 행).
5. 로컬 `vercel env pull` 오염 대응: pull 후 .env 에서 BASE_SITE_DOMAIN 제거 (코드 가드가 2중 방어).

**배포 후 스모크 (명시맵 없음 — daeatdiet-incheon 은 파생 canonical=자기 자신)**:
- `curl -sI https://daeatdiet-incheon.onwell.site/insights` → **200** (파생 rewrite · 301 아님)
- `curl -sI https://daeatdiet-incheon.onwell.site/daeatdiet-incheon/insights` → **301 → /insights** (규칙 2 slug-strip)
- `curl -sI https://demo.onwell.site` · `https://mail.onwell.site` → **404** (규칙 5)
- `curl -sI https://<vercel-도메인>/daeatdiet-incheon/insights` → **301 → daeatdiet-incheon.onwell.site/insights** (규칙 3)
- sitemap.xml loc / robots.txt Sitemap / rss.xml link 가 `https://daeatdiet-incheon.onwell.site` 기준 · IndexNow 발사 URL 정합 · 어드민 PublicSiteLink 정합 · /api/track 이벤트 적재 (SDS-00 fix)

### key-mom.kr 완전 폐기 (2026-07-03 결정 · 301 브릿지 없음)

즉시 완전 폐기 — 기존 색인 자산(발행 아티클 등) 소멸 감수(사용자 결정). 순서:

1. **코드/문서**: key-mom.kr 문자열 제거 완료 (별도 커밋 — 테스트 fixture·주석·.env·문서). 프로덕션 명시맵 삭제로 라우팅에서 key-mom.kr 소멸.
2. **DB 재등록** (daeatdiet-incheon 인스턴스):
   - `search_property.property_url` — 구 `https://bupyeong.key-mom.kr/` row 를 `https://daeatdiet-incheon.onwell.site/` 로 교체 (GSC·네이버 각각). 관련: sync-actions.ts `matchesInstanceDomain` 이 canonicalHostForSlug(=파생 host) 와 비교하므로 신규 host row 만 매칭됨.
   - `clinic_profile.naver_site_verification` — onwell.site 를 네이버 서치어드바이저에 새 사이트로 등록해 받은 토큰으로 교체 (어드민 의원정보 폼).
3. **외부 대시보드**:
   - 네이버 서치어드바이저: `daeatdiet-incheon.onwell.site` 새 사이트 등록 + 사이트맵/RSS 재제출 (구 사이트 삭제).
   - GSC: `https://daeatdiet-incheon.onwell.site/` URL-prefix property 신규 등록 (전역 meta 토큰 재사용) → SA 권한 → 어드민 addSearchProperty. 구 property 삭제.
   - `public/naver…html` — 소유확인이 meta 방식이면 이 파일 삭제, 파일 방식이면 새 토큰 파일로 교체.
4. **도메인 해지**: key-mom.kr 등록 해지 (또는 자동 만료 방치). Vercel 프로젝트에서 key-mom.kr 도메인 제거.
5. **유지**: IndexNow 키 파일(`4830…bfb6.txt`)은 도메인 무관 — 그대로 둠.

## 운영 (per-instance · 이후 반복 절차)

1. 어드민 `/admin/super` 복제 — slug = 원하는 서브도메인 라벨 (SDS-04 검증 통과). **코드/env/DNS/redeploy 불필요**.
2. 네이버 서치어드바이저: 신규 서브도메인 사이트 등록 + 소유확인 토큰을 어드민 의원정보 폼 입력 (C0051 per-instance 컬럼) + sitemap/RSS 제출.
3. GSC: URL-prefix property 등록 (전역 meta 토큰으로 소유확인 자동) → SA email 권한 부여 → 어드민 검색노출 addSearchProperty.
4. `TRACK_ORIGIN_ALLOWLIST` 는 `*.onwell.site` 1회 등록으로 이후 자동 커버 (site-tracking suffix 와일드카드 기지원).

## 리스크 & 트레이드오프 (기록)

- **key-mom.kr 색인 자산 소멸**: 301 브릿지 없이 즉시 폐기라 그동안 쌓은 검색 노출(아티클 색인·링크)이 사라지고 onwell.site 가 백지에서 재색인을 시작한다. 사용자가 트레이드오프 인지 후 선택(2026-07-03). 이 프로젝트 진입 전략(정보형 롱테일+AI 브리핑 인용)은 도메인 권위 의존이 낮아 재출발 비용이 상대적으로 작다는 점이 판단 근거.
- **공유 도메인 구조**: 단일 도메인 아래 서로 다른 의료기관(제3자) N개는 Google **site reputation abuse** 정책의 표적 패턴과 형태가 같다. BASE 권위가 낮은 초기엔 리스크 약함. (a) 한 서브도메인의 제재가 도메인 전체에 파급될 수 있고, (b) 네이버는 대표주소별 별개 사이트로 취급하므로 신규 인스턴스가 BASE 권위를 상속하지 않는다. **exit 경로**: 성과 나는 클라이언트는 독립 도메인 구매 → CUSTOM_DOMAIN_MAP 명시 등록 (우선 규칙이 그대로 escape hatch).
- 어드민 세션은 host-only cookie — 서브도메인마다 별도 로그인. 어드민은 지정 host(vercel.app 또는 추후 admin 전용 host)에서만 사용 (SDS-DEFER-03).
- Google 소유확인 전역 하드코드 토큰: 동일 Glitzy GSC 계정 전제. 클라이언트별 계정 필요 시 C0051 패턴 컬럼 이관 (SDS-DEFER-02).

## G0 — 사용자 결정

| # | 결정 | 확정 |
|---|---|---|
| G0-2 | `BASE_DOMAIN_EXCLUDE_SLUGS` 초기값 | ✅ `demo` 제외 (코드 기본값도 `{"demo"}`) |
| G0-3 | GSC property 전략 | ✅ 서브도메인별 URL-prefix 유지 |
| G0-4 | 운영 옵션 | ✅ A(NS 위임) — 적용 대상 `onwell.site` (백지 도메인이라 이관 리스크 소멸) |
| G0-5 | BASE 도메인 확정 (2026-07-03) | ✅ `onwell.site` 구매 완료 (4-렌즈 네이밍 리서치) |
| G0-6 | key-mom.kr 처리 + 클라이언트 새 주소 (2026-07-03) | ✅ **즉시 완전 폐기**(301 없음) + 클라이언트 **`daeatdiet-incheon.onwell.site`**(현 slug 그대로 파생 · 명시맵 불필요) |

> 구 G0-1(apex key-mom.kr 서빙)은 key-mom.kr 폐기로 무의미해져 삭제.

## 비범위 / DEFER

- **SDS-DEFER-01**: `instance.custom_domain` DB 컬럼 + RLS 승격 — 임의 고객 도메인 대량화 시.
- **SDS-DEFER-02**: Google 소유확인 토큰 per-instance 컬럼화.
- **SDS-DEFER-03**: 어드민 전용 host 단일화 (admin.onwell.site 등 — RESERVED 선점).
- **SDS-DEFER-04**: apex `onwell.site` 서비스 소개 랜딩 — 연결 전까지 apex 미연결 유지.

## 구현 순서 & 수용 기준

| Phase | 내용 | 검증 | 상태 |
|---|---|---|---|
| 0 | SDS-00 track 패치 + SDS-05 .env.example | vitest + 배포 후 실이벤트 적재 | ✅ 코드 완료 |
| 1 | SDS-01 파생 + SDS-02 middleware + SDS-03 GSC + SDS-04 어드민 검증 | typecheck 0 · vitest · build | ✅ 완료 (vitest 383) |
| 1.5 | key-mom.kr 코드/문서 흔적 제거 (완전 폐기) | key-mom 문자열 0 · vitest 유지 | 🔄 진행 중 |
| 2 | onwell.site 와일드카드 + BASE env + key-mom.kr DB/대시보드 재등록·폐기 | 배포 후 스모크 전항 | ⏳ 사용자 플랫폼 작업 |
| 3 | per-instance 절차 첫 실행 (2호 인스턴스) 으로 zero-touch 실증 | 신규 서브도메인 200 + NSA/GSC 온보딩 | ⏳ Phase 2 이후 |

## 변경 이력

- **2026-07-02 v1.0**: 최초 작성. 5-agent 구조 감사 + 3-lens 적대적 비평 반영 — track slug 유실·파생 대칭 불변식·환경 가드·명시맵 선점·전이표·재색인 절차·공유 도메인 트레이드오프 수록.
- **2026-07-02 v1.1**: G0 확정 + Phase 0/1 구현 완료. isCustomDomainHost 삭제. 구현 후 3-lens 리뷰(3/3 approve) 반영: SDS-00 host 우선 해석·규칙 (5) 404·claimed 검사 강화·seed 검증·EXCLUDE replace 경고.
- **2026-07-03 v1.2**: BASE 도메인 onwell.site 구매 확정(G0-5). runbook 을 onwell.site 기준으로 재작성.
- **2026-07-03 v1.3**: **key-mom.kr 완전 폐기 결정(G0-6)** — 301 브릿지 없이 즉시, 색인 자산 소멸 감수. 클라이언트는 `daeatdiet-incheon.onwell.site`(현 slug 파생 · **명시맵 불필요**). 프로덕션 CUSTOM_DOMAIN_MAP 비움(코드 기능은 미래 임의 고객 도메인용 유지). 스모크 반전(daeatdiet-incheon.onwell.site → 200), key-mom.kr DB/대시보드 재등록·도메인 해지 절차 추가, 전이표/예시 host 를 onwell.site 계열로 교체, 구 G0-1 삭제. 코드 흔적 제거는 Phase 1.5(별도 커밋).
