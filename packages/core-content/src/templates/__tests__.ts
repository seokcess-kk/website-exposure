// @glitzy/core-content/templates/__tests__ — LL-ACTION-12 + cycle3 LL-24 + cycle4 LL-55
//
// build-time unit test cascade — packages/core-content test runner 가
// 모든 표준 템플릿의 unknown variable key 부재 + render round-trip 검증.
//
// 단순 실행: `node dist/templates/__tests__.js` 또는 vitest. 본 파일은 module 로 export 하는 함수만 제공.
// (test runner 추가는 별도 cascade — packages/core-content/package.json 에 test script.)

import { TEMPLATES, CLOSED_DOCUMENT_TYPES } from "./index.js";
import { listTemplateVariables, renderTemplate, type RenderContext } from "./render.js";

const VARIABLE_WHITELIST: ReadonlySet<string> = new Set([
  "clinic.name",
  "clinic.legalEntityName",
  "clinic.businessRegistrationNumber",
  "clinic.founder",
  "location.main.address",
  "location.main.telephone",
  "location.main.email",
  "policy.contactPerson",
  "policy.contactEmail",
  "policy.contactPhone",
  "policy.effectiveDate",
]);

export type TemplateTestFailure = {
  documentType: string;
  reason: "unknown-variable" | "render-error";
  detail: string;
};

export function validateAllTemplates(): TemplateTestFailure[] {
  const failures: TemplateTestFailure[] = [];

  for (const docType of CLOSED_DOCUMENT_TYPES) {
    const template = TEMPLATES[docType];
    const variables = listTemplateVariables(template.body);
    for (const v of variables) {
      if (!VARIABLE_WHITELIST.has(v)) {
        failures.push({
          documentType: docType,
          reason: "unknown-variable",
          detail: `template contains unknown variable: ${v}`,
        });
      }
    }
  }

  // round-trip render — 모든 변수 채운 ctx 로 5종 렌더링 시도
  const ctx: RenderContext = {
    clinic: {
      name: "테스트 의원",
      legalEntityName: "(주)테스트의료",
      businessRegistrationNumber: "123-45-67890",
      founder: "홍길동",
    },
    location: {
      main: {
        address: "서울특별시 강남구 테스트로 1",
        telephone: "02-1234-5678",
        email: "info@example.test",
      },
    },
    policy: {
      contactPerson: "김보호",
      contactEmail: "privacy@example.test",
      contactPhone: "02-1234-5678",
      effectiveDate: "2026-05-16",
    },
  };

  for (const docType of CLOSED_DOCUMENT_TYPES) {
    try {
      const rendered = renderTemplate(TEMPLATES[docType].body, ctx);
      if (rendered.includes("{{") || rendered.includes("}}")) {
        failures.push({
          documentType: docType,
          reason: "render-error",
          detail: "rendered output still contains {{...}} placeholders",
        });
      }
    } catch (err) {
      failures.push({
        documentType: docType,
        reason: "render-error",
        detail: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return failures;
}

// CLI runner — `node dist/templates/__tests__.js` 직접 실행 시 결과 출력 + exit code.
const isMainModule =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  process.argv[1] !== undefined &&
  process.argv[1].endsWith("__tests__.js");

if (isMainModule) {
  const failures = validateAllTemplates();
  if (failures.length === 0) {
    console.log("[core-content/templates] all 5 templates PASS — 0 failures");
    process.exit(0);
  } else {
    console.error(`[core-content/templates] FAIL — ${failures.length} failure(s):`);
    for (const f of failures) {
      console.error(`  - [${f.documentType}] ${f.reason}: ${f.detail}`);
    }
    process.exit(1);
  }
}
