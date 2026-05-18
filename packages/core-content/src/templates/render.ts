// @glitzy/core-content/templates/render — LOCATION_LEGAL_PLAN v1.0 § 4.2
//
// 변수 치환 엔진. 화이트리스트 strict — 등록되지 않은 키는 throw.
//
// cycle1 LL-06 + cycle2 LL-33 + cycle3 LL-45 patch:
//   policy.* 변수 정당화 (admin/ARCH § 3.8.2 contactPerson 입력 섹션 SoT).
//
// cycle3 LL-24 + cycle4 LL-55 patch:
//   검출 시점 = server action runtime (renderTemplate throw → formError).
//   build-time test 도 packages/core-content test runner 에서 cascade.

export type RenderContext = {
  clinic: {
    name: string;
    legalEntityName: string | null;
    businessRegistrationNumber: string | null;
    founder: string | null;
  };
  location: {
    main: {
      address: string;
      telephone: string;
      email: string | null;
    };
  };
  policy: {
    contactPerson: string;
    contactEmail: string;
    contactPhone: string;
    effectiveDate: string;
  };
};

const VARIABLE_WHITELIST = new Set<string>([
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

export class TemplateRenderError extends Error {
  override readonly name = "TemplateRenderError";
  constructor(
    public readonly reason: "unknown-variable" | "missing-required-value",
    public readonly variableKey: string,
    message: string,
  ) {
    super(message);
  }
}

function resolveVariable(key: string, ctx: RenderContext): string | null {
  switch (key) {
    case "clinic.name": return ctx.clinic.name;
    case "clinic.legalEntityName": return ctx.clinic.legalEntityName;
    case "clinic.businessRegistrationNumber": return ctx.clinic.businessRegistrationNumber;
    case "clinic.founder": return ctx.clinic.founder;
    case "location.main.address": return ctx.location.main.address;
    case "location.main.telephone": return ctx.location.main.telephone;
    case "location.main.email": return ctx.location.main.email;
    case "policy.contactPerson": return ctx.policy.contactPerson;
    case "policy.contactEmail": return ctx.policy.contactEmail;
    case "policy.contactPhone": return ctx.policy.contactPhone;
    case "policy.effectiveDate": return ctx.policy.effectiveDate;
    default:
      throw new TemplateRenderError("unknown-variable", key, `unknown variable: ${key}`);
  }
}

// LL-ACTION-13: 단순 fallback `(미기재)` — 옵셔널 변수 NULL 시 표기.
function nullFallback(key: string): string {
  if (key === "clinic.legalEntityName") return "(법인명 미기재)";
  if (key === "clinic.businessRegistrationNumber") return "(사업자등록번호 미기재)";
  if (key === "clinic.founder") return "(대표자 미기재)";
  if (key === "location.main.email") return "(이메일 미기재)";
  return "(미기재)";
}

// LL-ACTION-14: 1차 치환만 (no recursive expansion).
const VARIABLE_PATTERN = /\{\{\s*([a-zA-Z][a-zA-Z0-9_.-]*)\s*\}\}/g;

export function renderTemplate(template: string, ctx: RenderContext): string {
  return template.replace(VARIABLE_PATTERN, (_, key: string) => {
    // 화이트리스트 검증 (strict)
    if (!VARIABLE_WHITELIST.has(key)) {
      throw new TemplateRenderError("unknown-variable", key, `unknown variable: ${key}`);
    }
    const value = resolveVariable(key, ctx);
    if (value === null) return nullFallback(key);
    return value;
  });
}

// build-time unit test cascade — packages/core-content test runner 가 모든 템플릿의 unknown key 부재 검증.
export function listTemplateVariables(template: string): string[] {
  const keys = new Set<string>();
  let match: RegExpExecArray | null;
  const re = new RegExp(VARIABLE_PATTERN.source, "g");
  while ((match = re.exec(template)) !== null) {
    keys.add(match[1]!);
  }
  return [...keys];
}
