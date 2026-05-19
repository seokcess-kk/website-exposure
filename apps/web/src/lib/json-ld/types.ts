// @glitzy/web/lib/json-ld/types — JSON-LD graph builder types
// SoT: SCHEMA_MAPPING § 1.2 @id 네이밍 + § 2.5 공통 entity 출력 정책 + PUBLIC_SITE_RENDER_PLAN § 5.4

export type JsonLdGraph = {
  "@context": "https://schema.org";
  "@graph": JsonLdEntity[];
};

export type JsonLdEntity = {
  "@type": string;
  "@id": string;
  [key: string]: unknown;
};

export type GraphBuilderContext = {
  /** v0.1 path-based — `https://<host>/<instanceSlug>` (M0 도메인 매핑 합류 시 `https://<customDomain>` cascade · PSR-CASCADE-02) */
  readonly siteBaseUrl: string;
  /** current page path relative to siteBaseUrl (예: `/about`, `/doctors/hong`) */
  readonly pagePath: string;
};
