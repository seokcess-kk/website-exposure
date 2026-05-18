// @glitzy/web — Tailwind v3.4 config (Plan v1.0 Tailwind v4 → v3.4 implementation drift · cycle12 cascade marker)
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // M0 walking skeleton — DESIGN_TOKENS v1.0 integration 은 M1+ (Plan § 1.3 deferred)
        // 임시 brand palette · 본 구현 시점에 packages/design-tokens cascade
        primary: {
          DEFAULT: "#0F172A",
          fg: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};

export default config;
