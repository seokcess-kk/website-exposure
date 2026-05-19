#!/usr/bin/env node
// @glitzy/compliance-rules/scripts/build — yaml → dist/catalog.json 사전 변환
// SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN v1.0 § 3.3
// Next.js fs 미지원 환경 회피용. dev 시 fs fallback.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(here, "..");
const monorepoRoot = resolve(pkgRoot, "..", "..");
const rootDir = resolve(monorepoRoot, "data", "compliance-rules");
const distDir = resolve(pkgRoot, "dist");
const outFile = resolve(distDir, "catalog.json");

async function main() {
  await mkdir(distDir, { recursive: true });

  const metaContent = await readFile(resolve(rootDir, "meta.yaml"), "utf-8");
  const meta = parse(metaContent);

  const output = {
    meta,
    rules: [],
    overrides: [],
    contextExceptions: [],
    medicalLawTracking: [],
    slotMatches: [],
    rawFiles: { "meta.yaml": metaContent },
  };

  for (const f of meta.loadOrder.rules) {
    const content = await readFile(resolve(rootDir, f), "utf-8");
    output.rawFiles[f] = content;
    const data = parse(content);
    if (data.rules) output.rules.push(...data.rules);
    if (data.overrides) output.overrides.push(...data.overrides);
  }
  for (const f of meta.loadOrder.contextExceptions) {
    const content = await readFile(resolve(rootDir, f), "utf-8");
    output.rawFiles[f] = content;
    const data = parse(content);
    output.contextExceptions.push(...(data.exceptions ?? []));
  }
  for (const f of meta.loadOrder.tracking) {
    const content = await readFile(resolve(rootDir, f), "utf-8");
    output.rawFiles[f] = content;
    const data = parse(content);
    output.medicalLawTracking.push(...(data.revisions ?? []));
  }
  for (const f of meta.loadOrder.slotMatches) {
    const content = await readFile(resolve(rootDir, f), "utf-8");
    output.rawFiles[f] = content;
    const data = parse(content);
    output.slotMatches.push(...(data.slots ?? []));
  }

  await writeFile(outFile, JSON.stringify(output, null, 2), "utf-8");
  console.log(`✓ catalog.json built (${output.rules.length} rules · ${output.contextExceptions.length} exceptions)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
