You are reviewing the **plan** `docs/decisions/EAT_CONTENT_PLAN.md` v0.1 (draft). This is the **first** Codex critique cycle. Produce a strict, broad review covering plan SoT cascade, data model, schema.org JSON-LD, admin form patterns, public render integration, scenarios.

## SoT to read first

1. `docs/decisions/EAT_CONTENT_PLAN.md` v0.1 — plan under review (EC-SCHEMA-01~19, EC-FORM-01~08, EC-RENDER-01~10, EC-SEO-01~04, EC-CONTENT-01~03, EC-CASCADE-01~09)
2. `docs/core/DATA_MODEL.md` v0.9 — § 4 C-01~C-22 풀명세 패턴 (C-25/26/27 신설 SoT)
3. `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ + § 3 페이지 본문 (M0 미합류 → 본 plan 합류)
4. `docs/core/SCHEMA_MAPPING.md` § 1.2 @id · § 2 entity 카탈로그 · § 3 P-011 graph
5. `docs/core/SEARCH_STANDARDIZATION.md` § 4.3 sitemap changefreq/priority
6. `docs/core/CONTENT_STANDARDS.md` v1.3 § 7.1.1 ContentType 예외
7. `docs/compliance/RISK_LEVELS.md` v1.1 § 2 자동 추론
8. `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 § 1.3 PSR-DEFER-11 (FAQ) + PSR-DEFER-15 (Article category)
9. `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LegalDocument 패턴 (status='draft' + RLS published only) 비교
10. `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 SSR 재사용 표
11. `packages/db/migrations/D0011_public_reader.sql` — D0014 cascade target
12. `packages/migrations-runner/src/manifest.ts` — 14 단계 cascade
13. `packages/core-content/src/schema.ts` v0.3 — Drizzle SoT 패턴
14. `apps/web/src/lib/json-ld/__tests__/validate.ts` — cross-page allowlist 확장 target
15. `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts` — 어드민 server action 패턴
16. `apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx` — Article category URL `[category]` 매핑

## What to check (cycle 1)

### Plan SoT 합치
- 모든 EC-* 결정이 reference SoT 와 일관
- C-25/26/27 신규 entity ID 번호 — DATA_MODEL § 1.1 인벤토리 정합 (기존 C-23 AdminUser · C-24 미사용 또는 사용 여부 확인)
- C-22 ArticleCategory — 기존 DATA_MODEL § 4 C-22 풀명세와 본 plan EC-SCHEMA-01~04 의 column 정합
- PSR-DEFER-11 (FAQ) · PSR-DEFER-15 (Article category) 해소 — PUBLIC_SITE_RENDER_PLAN cascade 정합
- D0014 cascade — D0011 의 per-table policy 패턴 정확 재현
- migration 의존성 (C0009~C0013 · D0014) 순서 정합

### 데이터 모델 결정
- Publication / MediaAppearance / Faq 의 column 필수성 (`url required` · `summary required` · authors[] min 1)
- DOI 정규식 `10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$` 정확성 (CrossRef 표준)
- PubMed ID 정규식 `^[0-9]{1,9}$` 의 실 운영 범위
- `media_channel_type` enum 4종 (broadcast/youtube/podcast/press) — JSON-LD 분기 (VideoObject vs BroadcastEvent vs NewsArticle) 정합
- composite FK (instance_id, author_doctor_id) → doctor_profile 의 same-tenant 보장
- `risk_level='Low'` CHECK — Publication/Media 강제. Faq 는 자동 추론 대상 (default Low)
- ArticleCategory flat 1-level — parent_id 없음 결정
- article.category_id ALTER + backfill 데이터 마이그레이션 결정 — 기존 row 있을 시 default `general` row 의 id 로 backfill

### JSON-LD / SEO
- ScholarlyArticle 의 `@id` 패턴 — `{base}/publications/{slug}#scholarly` · v0.1 단계 별도 페이지 없으므로 cross-page allowlist 추가 정합
- VideoObject vs BroadcastEvent vs NewsArticle 분기 SoT — channel_type 별 entity type
- FAQPage `mainEntity` Question/Answer array — Markdown 본문을 text 로 strip 변환 결정 (HTML stripped vs Markdown 그대로)
- Doctor Profile P-004 의 Physician.subjectOf / Physician.knownFor — schema.org 표준 vs 운영 단순화
- About P-002 의 MedicalClinic.subjectOf — 모든 published Publication/Media 출력 정합
- cross-page allowlist 확장 (`#faqpage` · `#scholarly` · `#video`) — multi-tenant tenant base path 검사 정합 (PSRC-20 정합)

### 어드민 폼 / server action
- M0 3-entity 폼 패턴 재사용 (zod schema · server action · isNextControlFlowError · mapDbErrorToResult)
- audit emit payload shape `{contentType, slug, mode, status, originalSlug}` 통일 (4 신규 contentType — Publication/MediaAppearance/Faq/ArticleCategory)
- status 9-state 운영 — review-queued 차단 (compliance-assistant 합류 전) marker
- Faq displayOrder · publication/media authorDoctorId dropdown · faq categoryId dropdown — 어드민 UI 정합

### CONTENT_STANDARDS · RISK_LEVELS
- Publication/MediaAppearance 면제 vs Faq 적용 — 외부 인용 vs 클리닉 자체 답변 구분 정합
- Faq Q/A 광고 표현 검수 — MEDICAL_AD_COMPLIANCE_COMMON 정합 (의료법 제56조 광고 표현)
- Faq risk_level 자동 추론 — RISK_LEVELS § 2 의 의료 질문 분류 정합

### 시나리오 24~33
- 통과 기준 정확성 + DB CHECK 정합

### Cascade markers (acceptance precondition)
- EC-CASCADE-01: DATA_MODEL § 4 C-25/26/27 풀명세 추가
- EC-CASCADE-02: SCHEMA_MAPPING § 2/§ 3
- EC-CASCADE-03: CONTENT_STANDARDS § 7.1.1.x
- EC-CASCADE-04: M0_BUILD_EXPORT_PLAN § 2.1
- EC-CASCADE-05: D0014 신규 migration (D0011 cascade)
- EC-CASCADE-06: manifest 14 단계
- EC-CASCADE-07: PUBLIC_SITE_RENDER PSR-DEFER 해소
- EC-CASCADE-08: PAGE_TYPES P-011
- EC-CASCADE-09: ARCH § 3 Vertical Slice

## Output format

```
# EAT_CONTENT_PLAN v0.1 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>

## blocking
- **ECP-01**: <짧은 제목>
  - 위치: <file>:<line> 또는 <doc § ...>
  - 근거(SoT): <인용>
  - 문제: ...
  - 권장 patch: ...

## major
## minor

## cascade marker / acceptance precondition 점검
- EC-CASCADE-01~09: <PASS|FAIL|TBD>
```

가능한 한 광범위하게 보고, 추측이 아니라 SoT 파일을 직접 line 단위로 인용하라. 한국어로 응답.
