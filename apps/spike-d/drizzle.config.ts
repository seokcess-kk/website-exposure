// Spike D — drizzle-kit config
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL_DEV ?? "postgres://postgres:postgres@localhost:5437/spike_d_dev",
  },
  verbose: true,
  strict: true,
  // generated SQL은 raw RLS·composite FK·CHECK 등 추가가 필요할 수 있음 (mixin pattern)
});
