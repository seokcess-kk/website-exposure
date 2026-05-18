# M0 schema v0.4 — codex 비평 cycle 4 (acceptance scope)

동일 reviewer. cycle 3 (closed: 11·deferred: 11·new minor: 1·M0-23) 에 대한 v0.4 micro patch.

## cycle 3 결과

closed (11): M0-01·02·03·05·06·15·16·17·18·21·22.
remaining (11·deferred): M0-04·07·08·09·10·11·12·13·14·19·20.
new minor (1): M0-23 — deferred 11항 개별 SoT marker 부재.

## v0.4 patch

### M0-23: M0_SCHEMA_PLAN에 deferred 11항 개별 marker 추가

`docs/decisions/M0_SCHEMA_PLAN.md` 신규 section "Deferred 11 findings 개별 SoT cascade markers (M0-23 cycle4)":
- 11 finding × (Defer to·Reason) 표 명시
- 각 항의 cycle/milestone target·근거·M0 v0.x scope 외 명시

| Finding | Defer to | Reason |
|---|---|---|
| M0-04 | Phase 0 Week 4 M0 v1.0 | clinic-location architecture decision |
| M0-07 | packages/migrations-runner v0.3 | Spike D 승격 별도 작업 |
| M0-08 | M0 v1.0 Phase 0 Week 4 | 본 v0.x는 minimum scope |
| M0-09 | M0 v1.0 Phase 0 Week 4 | TreatmentPage typed sub-tables |
| M0-10 | M0 v1.0 Phase 0 Week 4 | DoctorProfile typed sub-tables |
| M0-11 | M0 v1.0 Phase 0 Week 4 | M0-04와 함께 archi 결정 |
| M0-12 | M0 v1.0 Phase 0 Week 4 | LocationProfile typed sub-tables |
| M0-13 | C-08 별도 entity (M0 v0.5+) | InstanceManifest 매우 큰 spec |
| M0-14 | packages/db v0.2 | audit_log extension REVIEW_WORKFLOW transition 시점 |
| M0-19 | post-hardening (Phase 0 Week 5+) | trigger 부수 효과 |
| M0-20 | M0 v1.0 Phase 0 Week 4 LOCAL_PASS 실측 | apply·RLS·drizzle-kit diff 0 |

## cycle 4 검토

cycle 1·2·3 누적 23개 결함 중:
- close (11): M0-01·02·03·05·06·15·16·17·18·21·22
- deferred-with-marker (11): M0-04·07·08·09·10·11·12·13·14·19·20

이제 deferred 11항이 plan 문서에 개별 marker로 명시·추적 가능. 신규 0이면 ready_for_acceptance=true.

## 평가 형식

```json
{
  "cycle": 4,
  "closeable_after_patch": true | false,
  "scope_narrow_acceptable": true | false,
  "previous_cycle_closed_findings": [...],
  "previous_cycle_remaining_findings": [],
  "new_blocking_findings": [],
  "new_major_findings": [],
  "new_minor_findings": [],
  "convergence_signal": "...",
  "ready_for_acceptance": true | false
}
```
