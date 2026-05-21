// @glitzy/web/components/admin/EvidenceLinkPanel — EVIDENCE_LINKING_PLAN v0.2 § 3
//
// relation_type 별 grouping (cites · related-to · derived-from) — sourceType 별 matrix 정합.
// MultiSelectField (client) 를 wrapping 하는 server component. 직렬화 가능한 plain props.
// FormData key:
//   - evidenceLinks_cites
//   - evidenceLinks_relatedTo
//   - evidenceLinks_derivedFrom

import { MultiSelectField, type MultiSelectOption } from "@/components/forms/Field";
import {
  RELATION_TARGET_MATRIX,
  type EvidenceLink,
} from "@/lib/admin/content-entity-link";
import type { EvidenceLinkOptions } from "@/lib/admin/evidence-link-options";
import type { SeoLinkRelationType, SeoLinkSourceType, SeoLinkTargetType } from "@glitzy/core-content";

type RelationGroupSpec = {
  relation: SeoLinkRelationType;
  formKey: string;
  title: string;
  description: string;
};

const RELATION_GROUPS: ReadonlyArray<RelationGroupSpec> = [
  {
    relation: "cites",
    formKey: "evidenceLinks_cites",
    title: "인용 (cites)",
    description: "학술 논문·미디어 출연 등 본문에서 인용한 자료. JSON-LD 안 citation 으로 자동 반영 (Phase B).",
  },
  {
    relation: "derived-from",
    formKey: "evidenceLinks_derivedFrom",
    title: "임상 근거 (derived-from)",
    description: "이 시술이 기반으로 하는 protocol·임상 연구. Publication 만 연결 가능.",
  },
  {
    relation: "related-to",
    formKey: "evidenceLinks_relatedTo",
    title: "관련 콘텐츠 (related-to)",
    description: "주제가 인접한 다른 글·FAQ·시술. 사이트 SSR 안 자동 내부 링크.",
  },
];

function targetOptionsFor(
  allowedTargets: ReadonlyArray<SeoLinkTargetType>,
  options: EvidenceLinkOptions,
): MultiSelectOption[] {
  const groups: Partial<Record<SeoLinkTargetType, MultiSelectOption[]>> = {
    Publication: options.publications,
    MediaAppearance: options.mediaAppearances,
    FAQ: options.faqs,
    TreatmentPage: options.treatmentPages,
    Article: options.articles,
  };
  const out: MultiSelectOption[] = [];
  for (const target of allowedTargets) {
    for (const opt of groups[target] ?? []) out.push(opt);
  }
  return out;
}

function defaultValuesFor(
  relation: SeoLinkRelationType,
  existingLinks: ReadonlyArray<EvidenceLink>,
): string[] {
  return existingLinks
    .filter((l) => l.relationType === relation)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((l) => `${l.targetType}:${l.targetId}`);
}

export function EvidenceLinkPanel({
  sourceType,
  options,
  existingLinks,
}: {
  sourceType: SeoLinkSourceType;
  options: EvidenceLinkOptions;
  existingLinks: ReadonlyArray<EvidenceLink>;
}) {
  const matrix = RELATION_TARGET_MATRIX[sourceType];
  const activeGroups = RELATION_GROUPS.filter((g) => {
    const allowed = matrix[g.relation];
    return Array.isArray(allowed) && allowed.length > 0;
  });

  if (activeGroups.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-3 rounded-md border border-slate-200 bg-slate-50/30 p-4">
      <header className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-slate-800">근거·관련 자료</h3>
        <p className="text-xs text-slate-500">
          이 콘텐츠의 신뢰도(E-E-A-T)를 강화할 논문·미디어·관련 글을 연결하세요.
          published 가 아닌 항목은 “(미발행)” 표시되며 공개 사이트엔 노출되지 않습니다.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {activeGroups.map((group) => {
          const allowed = matrix[group.relation] ?? [];
          const groupOptions = targetOptionsFor(allowed, options);
          const defaults = defaultValuesFor(group.relation, existingLinks);
          return (
            <MultiSelectField
              key={group.relation}
              name={group.formKey}
              label={group.title}
              options={groupOptions}
              defaultValue={defaults}
              description={group.description}
              emptyLabel="해당 종류의 항목이 아직 등록되지 않았습니다."
              maxItems={20}
            />
          );
        })}
      </div>
    </section>
  );
}
