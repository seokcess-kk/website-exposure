// @glitzy/web/lib/doctor-metadata — doctor_profile.metadata 안 credentials / medicalSpecialties 공용 변환
//   admin form ↔ DB JSONB ↔ site projection 사이 단일 SoT.

import type { CredentialMeta } from "@/lib/db-projection";

export const CREDENTIAL_TYPES = ["license", "board", "certification", "membership", "education"] as const;
export type CredentialType = (typeof CREDENTIAL_TYPES)[number];

export const CREDENTIAL_TYPE_LABEL: Record<CredentialType, string> = {
  license: "면허",
  board: "전문의·세부전문의",
  certification: "학회·협회 인증",
  membership: "학회 회원",
  education: "학력",
};

/** form initial 용 — empty 도 포함 (입력 슬롯 유지) 하지 않고 저장된 것만. */
export type CredentialFormEntry = {
  type: CredentialType;
  name: string;
  issuer: string;
  issuedAt: string;
  identifier: string;
  url: string;
};

export type DoctorMetadataForm = {
  credentials: CredentialFormEntry[];
  medicalSpecialties: string[];
};

function pickStr(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** DB JSONB → form 입력값 (모두 string, missing 은 "") */
export function parseDoctorMetadataForForm(raw: unknown): DoctorMetadataForm {
  if (typeof raw !== "object" || raw === null) {
    return { credentials: [], medicalSpecialties: [] };
  }
  const o = raw as Record<string, unknown>;
  const credentials: CredentialFormEntry[] = [];
  if (Array.isArray(o.credentials)) {
    for (const item of o.credentials) {
      if (typeof item !== "object" || item === null) continue;
      const c = item as Record<string, unknown>;
      const t = pickStr(c.type);
      if (!CREDENTIAL_TYPES.includes(t as CredentialType)) continue;
      const name = pickStr(c.name);
      if (!name) continue;
      credentials.push({
        type: t as CredentialType,
        name,
        issuer: pickStr(c.issuer),
        issuedAt: pickStr(c.issuedAt),
        identifier: pickStr(c.identifier),
        url: pickStr(c.url),
      });
    }
  }
  const specialties: string[] = [];
  if (Array.isArray(o.medicalSpecialties)) {
    for (const s of o.medicalSpecialties) {
      const t = pickStr(s);
      if (t) specialties.push(t);
    }
  }
  return { credentials, medicalSpecialties: specialties };
}

/** form 입력값 → DB JSONB shape. empty entry 는 drop. */
export function serializeDoctorMetadata(input: {
  credentials: ReadonlyArray<CredentialFormEntry>;
  medicalSpecialties: ReadonlyArray<string>;
}): { credentials: CredentialMeta[]; medicalSpecialties: string[] } {
  const credentials: CredentialMeta[] = [];
  for (const c of input.credentials) {
    const name = c.name.trim();
    if (!name) continue;
    const entry: CredentialMeta = { type: c.type, name };
    if (c.issuer.trim()) entry.issuer = c.issuer.trim();
    if (c.issuedAt.trim()) entry.issuedAt = c.issuedAt.trim();
    if (c.identifier.trim()) entry.identifier = c.identifier.trim();
    if (c.url.trim()) entry.url = c.url.trim();
    credentials.push(entry);
  }
  const specialties = input.medicalSpecialties
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return { credentials, medicalSpecialties: specialties };
}

/** comma-separated input → string[] */
export function parseSpecialtiesInput(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** FormData 안 prefixed entries → credentials[]. form name 컨벤션: `credentials[i].type` 등. */
export function readCredentialsFromFormData(formData: FormData): CredentialFormEntry[] {
  const indexMap = new Map<number, Partial<CredentialFormEntry>>();
  for (const [key, value] of formData.entries()) {
    const m = /^credentials\[(\d+)\]\.(type|name|issuer|issuedAt|identifier|url)$/.exec(key);
    if (!m) continue;
    const idx = Number(m[1]);
    const field = m[2] as keyof CredentialFormEntry;
    const v = typeof value === "string" ? value : "";
    const existing = indexMap.get(idx) ?? {};
    existing[field] = v as never;
    indexMap.set(idx, existing);
  }
  const out: CredentialFormEntry[] = [];
  const ordered = [...indexMap.keys()].sort((a, b) => a - b);
  for (const idx of ordered) {
    const e = indexMap.get(idx)!;
    const type = e.type ?? "";
    if (!CREDENTIAL_TYPES.includes(type as CredentialType)) continue;
    out.push({
      type: type as CredentialType,
      name: e.name ?? "",
      issuer: e.issuer ?? "",
      issuedAt: e.issuedAt ?? "",
      identifier: e.identifier ?? "",
      url: e.url ?? "",
    });
  }
  return out;
}
