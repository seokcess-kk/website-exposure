Review code of `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 — **cycle 2**. cycle 1 13 finding (blocking 3·major 6·minor 4) patch 검증 + 새 finding 확인.

## Cycle 1 patches

| # | severity | title | patch |
|---|---|---|---|
| CAMC-01 | blocking | publishContentAction publish 흐름 막힘 | entity.compliance_record_id 선행 요구 제거 — publish 시 채움 |
| CAMC-02 | blocking | C0016 sentinel backfill 6 entity | LegalDocument · FAQ 도 sentinel INSERT/UPDATE 추가 |
| CAMC-03 | blocking | approveContent required_roles 검증 | entry.required_roles 잠금 조회 + 본인 role 포함 검증 |
| CAMC-04 | major | submitForReviewAction FOR UPDATE | SELECT 안 FOR UPDATE 추가 |
| CAMC-05 | major | UPDATE row count 검증 | publish UPDATE WHERE status='publishable' AND_clause + row count 1 검증 |
| CAMC-06 | major | assertTransitionAllowed 일관 | publish 안 entity current status assert |
| CAMC-07 | major | audit payload shape | finalRoles·pageRiskLevel·recordVersion 포함 |
| CAMC-08 | major | exempt envelope maxRisk | buildLegalDocumentExemptEnvelope 안 maxRisk |
| CAMC-09 | major | review detail content preview | PREVIEW_QUERIES allowlist · title/summary/body read-only |
| CAMC-10 | minor | SubmitForReviewResult shape | finalRoles · pageRiskLevel return |
| CAMC-11 | minor | publishContent recordVersion return | PublishContentResult.recordVersion |
| CAMC-12 | minor | saveArticle audit current status | locked row.status 사용 (form 변조 방지) |
| CAMC-13 | minor | vitest spawn EPERM | (codex 환경 — 우리 환경 vitest 72/72 PASS) |

## Output (한국어 · 간결)

```
# COMPLIANCE_ASSISTANT_M0 code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=13 → cycle2=N

## cycle 1 patch 검증
- CAMC-01: PASS/FAIL + 한 줄
... (CAMC-01 ~ CAMC-13)

## new findings

## acceptance 판정
```

cycle 1 13건 모두 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true 확정.
