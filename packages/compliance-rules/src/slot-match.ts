// @glitzy/compliance-rules — slot-match
// SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 9 (CAP-09 - v0.1 빈 배열 · Phase Beta CA-DEFER-18)

import type { SlotMatch, SlotMatchDefinition } from "./types.js";

export type SlotEvaluationInput = {
  pageTypeId: string;
  body: string;
  entityFields?: Record<string, unknown>;
};

function getByPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function evaluateSlots(input: SlotEvaluationInput, slots: SlotMatchDefinition[]): SlotMatch[] {
  // v0.1 안 slot-matches.yaml 비어 있음 → 항상 빈 배열 (Phase Beta CA-DEFER-18)
  const matches: SlotMatch[] = [];
  for (const slot of slots) {
    if (slot.pageTypeId !== input.pageTypeId) continue;
    let matched = false;
    if (slot.matchCondition.kind === "field-non-empty") {
      const value = getByPath(input.entityFields ?? {}, slot.matchCondition.fieldPath);
      matched = value !== undefined && value !== null && value !== "";
    } else if (slot.matchCondition.kind === "body-regex") {
      try {
        matched = new RegExp(slot.matchCondition.pattern, "u").test(input.body);
      } catch {
        matched = false;
      }
    } else if (slot.matchCondition.kind === "field-regex") {
      const value = getByPath(input.entityFields ?? {}, slot.matchCondition.fieldPath);
      if (typeof value === "string") {
        try {
          matched = new RegExp(slot.matchCondition.pattern, "u").test(value);
        } catch {
          matched = false;
        }
      }
    }
    if (matched) {
      matches.push({
        pageTypeId: slot.pageTypeId,
        slotId: slot.slotId,
        triggeredLevel: slot.triggeredLevel,
      });
    }
  }
  return matches;
}
