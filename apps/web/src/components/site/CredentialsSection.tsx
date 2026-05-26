// @glitzy/web/components/site/CredentialsSection — 의료진 인증·자격·전문분야 노출 섹션
// SoT: SCHEMA_MAPPING § 2.5 Physician + EAT_CONTENT 의료기관 인증 스키마 cycle
//   metadata.credentials[] · metadata.medicalSpecialties[] 를 4 그룹 (면허 / 전문의 / 인증 / 학력) + 학회 회원 + 전문분야 chip 으로 분류 렌더.

import type { CredentialMeta } from "@/lib/db-projection";

const GROUP_LABEL: Record<CredentialMeta["type"], string> = {
  license: "면허",
  board: "전문의·세부전문의",
  certification: "학회·협회 인증",
  membership: "학회 회원",
  education: "학력",
};

// 노출 순서 (운영자가 입력한 순서와 별개로 schema.org 의미 비중 순)
const GROUP_ORDER: CredentialMeta["type"][] = ["license", "board", "certification", "membership", "education"];

export function CredentialsSection({
  credentials,
  specialties,
}: {
  credentials: ReadonlyArray<CredentialMeta>;
  specialties: ReadonlyArray<string>;
}) {
  if (credentials.length === 0 && specialties.length === 0) return null;

  const grouped: Record<CredentialMeta["type"], CredentialMeta[]> = {
    license: [],
    board: [],
    certification: [],
    membership: [],
    education: [],
  };
  for (const c of credentials) grouped[c.type].push(c);

  return (
    <section id="credentials" className="mt-12 scroll-mt-24">
      <h2 className="mb-4 text-xl font-semibold text-fg-default">자격·인증</h2>

      {specialties.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {specialties.map((s) => (
            <span
              key={s}
              className="rounded-full border border-brand-primary/30 bg-brand-primary-soft px-3 py-1 text-xs font-medium text-brand-primary"
            >
              {s}
            </span>
          ))}
        </div>
      ) : null}

      <dl className="flex flex-col gap-4">
        {GROUP_ORDER.filter((g) => grouped[g].length > 0).map((g) => (
          <div key={g} className="grid gap-2 border-b border-border pb-4 last:border-b-0 sm:grid-cols-[8rem_minmax(0,1fr)]">
            <dt className="text-sm font-semibold uppercase tracking-wider text-fg-muted">{GROUP_LABEL[g]}</dt>
            <dd>
              <ul className="flex flex-col gap-2">
                {grouped[g].map((c, i) => (
                  <li key={`${g}-${i}`} className="text-sm text-fg-default">
                    <span className="font-medium">{c.name}</span>
                    {c.issuer ? <span className="text-fg-muted"> · {c.issuer}</span> : null}
                    {c.issuedAt ? <span className="text-fg-muted"> · {c.issuedAt}</span> : null}
                    {c.identifier ? (
                      <span className="ml-2 rounded bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-fg-muted">
                        {c.identifier}
                      </span>
                    ) : null}
                    {c.url ? (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="ml-2 text-xs text-brand-primary hover:text-brand-primary-hover"
                      >
                        확인 →
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
