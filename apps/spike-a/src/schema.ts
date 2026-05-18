// Spike A — Drizzle schema (typed accessor)

import { pgTable, uuid, text, timestamp, jsonb, integer, boolean } from "drizzle-orm/pg-core";

export const contentTest = pgTable("content_test", {
  id: uuid("id").primaryKey().defaultRandom(),
  instanceId: uuid("instance_id").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  instanceId: uuid("instance_id").notNull(),
  actorId: text("actor_id").notNull(),
  actorRole: text("actor_role").notNull(),
  action: text("action").notNull(),
  contentRef: text("content_ref"),
  metadata: jsonb("metadata").notNull().default({}),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
});

export const invariantLog = pgTable("invariant_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  runId: uuid("run_id").notNull(),
  iteration: integer("iteration").notNull(),
  workerIdx: integer("worker_idx").notNull(),
  expectedInstanceId: uuid("expected_instance_id").notNull(),
  pgBackendPid: integer("pg_backend_pid").notNull(),
  currentUserName: text("current_user_name").notNull(),
  currentSettingValue: text("current_setting_value"),
  scenario: text("scenario").notNull(),
  resultCount: integer("result_count").notNull(),
  foreignInstanceCount: integer("foreign_instance_count").notNull(),
  passed: boolean("passed").notNull(),
  errorMessage: text("error_message"),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
});
