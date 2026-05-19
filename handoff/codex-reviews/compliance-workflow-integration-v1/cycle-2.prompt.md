Review 4 entity workflow 통합 — **cycle 2**. cycle 1 2 finding patch 검증 + 새 finding 확인. 짧게.

## Cycle 1 patches

| # | severity | patch |
|---|---|---|
| CWI-01 | blocking | 5 form (Article/TreatmentPage/FAQ/Publication/MediaAppearance) status input `name="status"` 제거 → FormData 안 status 미포함. zod schema 안 status field 제거 (Article actions PUBLICATION_STATUSES · TreatmentPage 동일 · FAQ/Publication/MediaAppearance EatStatusSchema). EatStatusSchema 는 deprecated 표기만 유지. |
| CWI-02 | minor | LegalDocument 별 cycle marker `LL-WORKFLOW-INTEGRATION` 명시 — plan § 8 작업 #11 정정 (4 entity + LegalDocument 분리 별 cycle) |

## Output (한국어 · 간결)

```
# COMPLIANCE_WORKFLOW_INTEGRATION code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=2 → cycle2=N

## cycle 1 patch 검증
- CWI-01: PASS/FAIL + 한 줄
- CWI-02: PASS/FAIL

## new findings (있을 경우)

## acceptance 판정
```

cycle 1 2건 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true 확정.
