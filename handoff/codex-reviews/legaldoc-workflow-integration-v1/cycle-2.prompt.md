Review **LL-WORKFLOW-INTEGRATION** code — **cycle 2**. cycle 1 3 finding patch 검증 + 새 finding. 짧게.

## Cycle 1 patches

| # | severity | patch |
|---|---|---|
| LWI-01 | blocking | saveClinicProfile LegalDocument UPSERT DO UPDATE 안 status='draft'\|'rejected' 일 때만 본문 갱신 (CASE WHEN). 검수 큐 진입 후 본문 drift 차단. |
| LWI-02 | major | entity-actions (submitForReview · publishContent) + review-queue actions (approveEntry · rejectEntry) 안 contentType==='LegalDocument' 분기 — `/admin/${slug}/clinic-profile` revalidatePath 추가 |
| LWI-03 | minor | 5종 invariant 검증 — 누락 시 amber 경고 배너 + 누락 row 안 amber placeholder 표시 |

## Output (한국어 · 간결)

```
# LEGALDOC_WORKFLOW_INTEGRATION code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=3 → cycle2=N

## cycle 1 patch 검증
- LWI-01: PASS/FAIL + 한 줄
- LWI-02: PASS/FAIL
- LWI-03: PASS/FAIL

## new findings (있을 경우)

## acceptance 판정
```

cycle 1 3건 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true 확정.
