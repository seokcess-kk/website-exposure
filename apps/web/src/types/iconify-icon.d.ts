// @glitzy/web/types/iconify-icon — iconify-icon web component JSX 타입 선언
// Supanova design skill 안 Iconify Solar icon 안 사용 위해 globalThis JSX namespace 안 확장.

import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "iconify-icon": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          icon: string;
          width?: string | number;
          height?: string | number;
          flip?: string;
          rotate?: string | number;
          mode?: "svg" | "style" | "bg" | "mask";
          inline?: boolean;
        },
        HTMLElement
      >;
    }
  }
}
