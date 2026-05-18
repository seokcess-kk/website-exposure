# Spike D local prototype 코드 — codex 자동 비평 cycle 6 (narrow scope)

동일 reviewer. cycle 5 결과 (closed: 1·remaining: 4·신규 blocking: 1·major: 1) 에 대한 v0.6 patch.

## cycle 5 결과 (SoT)

closed (1): SPIKED4-003.
remaining (4 — empty target guard + schema.ts contract 누적): SPIKED3-001·SPIKED1-005·SPIKED4-001·SPIKED4-002.
new blocking (1): SPIKED5-001 (DOMAIN·foreign table·collation 누락).
new major (1): SPIKED5-002 (schema.ts contract assertion 부재).

## cycle 6 v0.6 patch (narrow)

### 1. SPIKED5-001 + 누적 empty target: 10-class object 검사

```ts
SELECT 'table',                 ...relkind IN ('r','p')
SELECT 'view',                  ...relkind IN ('v','m')
SELECT 'foreign_table',         ...relkind='f'
SELECT 'sequence',              ...relkind='S'
SELECT 'enum_or_composite_type', ...typtype IN ('e','c')
SELECT 'domain',                ...typtype='d'
SELECT 'range_type',            ...typtype IN ('r','m')
SELECT 'function',              ...prokind IN ('f','p','a')
SELECT 'policy',                ...
SELECT 'trigger',               ...NOT tgisinternal
SELECT 'collation',             ...
```

10가지 user-visible public object class 모두 검사·leftover 있으면 reject·partial poison 회피.

### 2. SPIKED5-002 + SPIKED4-002: schema.ts contract assertion

```ts
import { getTableConfig } from "drizzle-orm/pg-core";
import { contentTest, instanceUser, auditLog, migrationLedger, auditEvent } from "../db/schema.js";

const SCHEMA_CONTRACT = [
  { name: "content_test", table: contentTest, expectedColumns: ["id", "instance_id", "parent_id", "title", "slug", "status", "published_at", "created_at"] },
  { name: "instance_user", ..., expectedColumns: 6 },
  { name: "audit_log", ..., expectedColumns: 8 },
  { name: "migration_ledger", ..., expectedColumns: 8 },
  { name: "audit_event", ..., expectedColumns: 8 },
];

function assertSchemaContract() {
  for (const c of SCHEMA_CONTRACT) {
    const cfg = getTableConfig(c.table);
    if (cfg.name !== c.name) throw new Error(...);
    if (cfg.columns.length !== c.expectedColumns.length) throw new Error(...);
    // sorted column name match
  }
}
```

test-canonical-generation 시작 시 호출 — schema.ts와 SoT expected 사이 drift 0 강제.

## cycle 6 검토 관점 (narrow)

1. **empty target 10-class 충분성**: PostgreSQL 16에서 user-visible public object class 모두 커버 가능한가? extension·foreign data wrapper·tablespace·event trigger 등은 schema-bound 아님·제외 OK
2. **schema.ts contract**: 5개 table 모두 contract 명시·column order 무시 (sort 후 비교)·column name 일치 강제. 추가 차원 (constraint·index·CHECK)도 contract에 넣어야?
3. **SoT D.3 (c) 표현 정합**: "schema.ts table·column 명시 일치" — 이제 정확히 구현됨

cycle 1·2·3·4·5 누적 결함 모두 close 가능 (v0.6 narrow patch):
- empty target guard: SPIKED3-001·SPIKED4-001·SPIKED5-001·SPIKED1-005 close
- schema.ts contract: SPIKED4-002·SPIKED5-002 close

remaining: 0 예상.

## 평가 형식

```json
{
  "cycle": 6,
  "closeable_after_patch": true | false,
  "previous_cycle_closed_findings": [...],
  "previous_cycle_remaining_findings": [],
  "new_blocking_findings": [],
  "new_major_findings": [],
  "new_minor_findings": [],
  "convergence_signal": "...",
  "ready_for_acceptance": true | false
}
```

신규 0개·remaining 0이면 closeable·ready_for_acceptance=true.
