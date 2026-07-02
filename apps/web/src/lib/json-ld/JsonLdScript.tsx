// @glitzy/web/lib/json-ld/JsonLdScript — 통합 graph 단일 <script> 출력
// SoT: SCHEMA_MAPPING § 1.1 + PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4

import type { JsonLdGraph } from "./types";

export function JsonLdScript({ graph }: { graph: JsonLdGraph }) {
  // `<` → < — JSON 값 안 "</script>" 가 ld+json 블록을 조기 종료시키는 것 방지 (표준 관행)
  const json = JSON.stringify(graph).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
