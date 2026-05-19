// @glitzy/web — Tailwind v3.4 config v0.2
// SoT: DESIGN_TOKENS v1.0 § 3.2 semantic 22 + PUBLIC_SITE_RENDER_PLAN v1.0 § 4.5 PSR-COMP-10·11·12
// 22 semantic alias 가 round-trip 보장: Tailwind class ↔ semantic token ↔ CSS custom property (globals.css)

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // === Surface ===
        canvas: "var(--color-surface-background)",
        surface: "var(--color-surface-background)",
        elevated: "var(--color-surface-elevated)",
        subtle: "var(--color-surface-subtle)",

        // === Text (fg) ===
        fg: {
          DEFAULT: "var(--color-text-primary)",
          default: "var(--color-text-primary)",
          muted: "var(--color-text-secondary)",
          disabled: "var(--color-text-disabled)",
          inverse: "var(--color-text-inverse)",
        },

        // === Border ===
        border: {
          DEFAULT: "var(--color-border-default)",
          default: "var(--color-border-default)",
          subtle: "var(--color-border-subtle)",
        },

        // === Brand ===
        brand: {
          DEFAULT: "var(--color-brand-primary)",
          primary: "var(--color-brand-primary)",
          "primary-hover": "var(--color-brand-primary-hover)",
          "primary-soft": "var(--color-brand-primary-soft)",
          secondary: "var(--color-brand-secondary)",
          accent: "var(--color-brand-accent)",
          "accent-soft": "var(--color-brand-accent-soft)",
        },

        // === Ink (serif heading depth) ===
        ink: {
          strong: "var(--color-ink-strong)",
        },

        // === Status ===
        success: {
          DEFAULT: "var(--color-status-success)",
          subtle: "var(--color-status-success-subtle)",
        },
        warning: {
          DEFAULT: "var(--color-status-warning)",
          subtle: "var(--color-status-warning-subtle)",
        },
        error: {
          DEFAULT: "var(--color-status-error)",
          subtle: "var(--color-status-error-subtle)",
        },
        info: {
          DEFAULT: "var(--color-status-info)",
          subtle: "var(--color-status-info-subtle)",
        },

        // === Focus ring (semantic) ===
        focus: "var(--color-focus-ring)",

        // === Overlay (semantic raw rgba — DESIGN_TOKENS § 3.2 overlay 예외 룰) ===
        overlay: {
          modal: "var(--color-overlay-modal)",
          scrim: "var(--color-overlay-scrim)",
        },

        // === Backwards-compatibility (어드민 기존 코드의 임시 alias — 점진적 마이그레이션) ===
        // ADMIN_UI_SKELETON code v1.0 의 `bg-slate-*` 사용처는 그대로 유지 (Tailwind 기본 팔레트).
        primary: {
          DEFAULT: "#0F172A",
          fg: "#FFFFFF",
        },
      },
      // 2026-05-19 L0a — 한의원 톤 폴리시 (여유 spacing · 부드러운 radius · 따뜻한 shadow)
      borderRadius: {
        // 한의원 톤 안 부드러운 corner — Tailwind default 보다 살짝 큼
        DEFAULT: "0.5rem",
        sm: "0.375rem",
        md: "0.625rem",
        lg: "0.875rem",
        xl: "1.125rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        // 따뜻한 그림자 — 차가운 슬레이트 그림자 회피. brand-secondary (golden ochre) 베이스
        sm: "0 1px 2px 0 rgb(28 38 32 / 0.04)",
        DEFAULT: "0 2px 6px -1px rgb(28 38 32 / 0.06), 0 1px 4px -1px rgb(28 38 32 / 0.04)",
        md: "0 4px 12px -2px rgb(28 38 32 / 0.08), 0 2px 6px -2px rgb(28 38 32 / 0.05)",
        lg: "0 10px 24px -4px rgb(28 38 32 / 0.10), 0 4px 8px -2px rgb(28 38 32 / 0.06)",
        xl: "0 20px 40px -8px rgb(28 38 32 / 0.14), 0 8px 16px -4px rgb(28 38 32 / 0.08)",
        // hover lift — micro motion
        "card-hover": "0 12px 28px -6px rgb(28 38 32 / 0.14), 0 6px 12px -3px rgb(28 38 32 / 0.08)",
      },
      // Pretendard 안 weight: 한의원 안 heavy weight 안 무거움 회피. light~bold range 활용.
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      fontFamily: {
        sans: [
          "Pretendard Variable", "Pretendard", "-apple-system", "BlinkMacSystemFont",
          "system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans KR", "sans-serif",
        ],
        serif: ["Noto Serif KR", "EB Garamond", "Times New Roman", "serif"],
      },
      letterSpacing: {
        tightest: "-0.035em",
        tight: "-0.02em",
        normal: "0",
        wide: "0.05em",
        wider: "0.12em",
        widest: "0.18em",
      },
      maxWidth: {
        prose: "65ch",
      },
      transitionTimingFunction: {
        // Supanova motion signature — spring physics
        supanova: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        500: "500ms",
        700: "700ms",
        900: "900ms",
      },
    },
  },
  plugins: [],
};

export default config;
