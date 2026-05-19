// @glitzy/migrations-runner — Spike D LOCAL_PASS 승격 (placeholder·v0.1) + manifest spec (v0.1 — LL-CASCADE-05)
// SoT: memory/milestone_spike_d_local_pass.md · LOCATION_LEGAL_PLAN v1.0 § 6 · § 10 LL-CASCADE-05
//
// 향후 module:
//   - runner.ts (loadMigrations·runMigrate·migrationsDir·stopAfter·forward-only guard·per-file tx)
//   - deploy.ts (runDeploy·deploy coordinator lock·pending N-1·empty target 11-class guard·pre/post-drift)
//   - drift-check.ts (snapshotSchema·diffSnapshots·checkDriftAgainstShadow — definition-aware)
//   - schema-reset.ts (DROP SCHEMA public CASCADE)
//   - service-role-emit.ts (audit_event 1:1 per migration)
//
// 현재 acceptance 강도:
//   - manifest spec (`manifest.ts`) — plan v1.0 acceptance precondition (작성 완료)
//   - 실 runner 코드 — LL-DEFER-20 (M0 v1.0 본 구현)

export { orderedMigrations, validateManifest, type MigrationDescriptor } from "./manifest.js";
