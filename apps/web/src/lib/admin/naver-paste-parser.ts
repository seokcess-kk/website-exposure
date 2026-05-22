// @glitzy/web/lib/admin/naver-paste-parser — NSA TOP30 paste ingestion parser
// NAVER_SEARCH_INGEST_PLAN v0.4 § 4.3·4.2 — plain text primary + HTML secondary + zod 5컬럼 + No skip + CTR /100
// cycle 3 (e)·(f) 정합 — 반환 타입 { validRows, skippedRows, errors }

import { z } from "zod";
import * as cheerio from "cheerio";

// === Schema (G1·G2 확정 — 5컬럼) ===

export const NaverPasteRowSchema = z.object({
  검색키워드: z.string().trim().min(1).max(500),
  클릭: z.coerce.number().int().min(0),
  노출: z.coerce.number().int().min(0),
  CTR: z.coerce.number().min(0).max(100),  // 정수 % — ingestion 단계에서 /100 변환
});

export type NaverPasteRow = z.infer<typeof NaverPasteRowSchema>;

export type PasteParseResult = {
  validRows: NaverPasteRow[];
  skippedRows: number;
  errors: Array<{ rowIndex: number; reason: string }>;
  /** parser 가 감지한 입력 형식 — UI 표시 + audit */
  detectedFormat: "tsv" | "multi-space" | "html" | "csv" | "unknown";
};

// === Entry point — format detect + parse ===

export function detectAndParse(paste: string): PasteParseResult {
  const trimmed = paste.trim();
  if (trimmed.length === 0) {
    return { validRows: [], skippedRows: 0, errors: [], detectedFormat: "unknown" };
  }

  // 1. HTML 우선 — Claude Code 등 일부 환경이 HTML 보존
  if (/<table|<tr/i.test(trimmed)) {
    return parseHtmlTable(trimmed);
  }

  // 2. plain text — primary (v1 main · <textarea> paste)
  const firstLine = trimmed.split(/\r?\n/)[0] ?? "";
  if (firstLine.includes("\t")) {
    return parseDelimited(trimmed, "\t", "tsv");
  }
  if (/\s{2,}/.test(firstLine)) {
    return parseDelimited(trimmed, /\s{2,}/, "multi-space");
  }

  // 3. CSV fallback (엑셀 거쳐 paste)
  return parseDelimited(trimmed, ",", "csv");
}

// === parseDelimited — plain text / TSV / CSV / multi-space ===

function parseDelimited(
  text: string,
  delim: string | RegExp,
  format: "tsv" | "multi-space" | "csv",
): PasteParseResult {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length === 0) {
    return { validRows: [], skippedRows: 0, errors: [], detectedFormat: format };
  }

  // 첫 행 = header (NSA: "No\t검색 키워드\t클릭\t노출\tCTR(%)" 또는 한국어 variants).
  // header 자체는 검증 안 — data row 가 5 토큰 만족하면 OK.
  const headerTokens = lines[0]!.split(delim);
  const headerLooksLikeHeader = !isNumeric(headerTokens[0]?.trim() ?? "");

  const dataLines = headerLooksLikeHeader ? lines.slice(1) : lines;

  const validRows: NaverPasteRow[] = [];
  const errors: Array<{ rowIndex: number; reason: string }> = [];

  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i]!;
    const tokens = line.split(delim).map((t) => t.trim());

    // NSA 검색 키워드 안 공백 포함 가능 (예: "병원 마케팅 에이전시") — multi-space 구분 시 토큰 5개 초과 가능
    // → 마지막 3개 (CTR · 노출 · 클릭) 가 숫자라 가정하고 역방향 추출
    const parsed = extractRowTokens(tokens);
    if (!parsed) {
      errors.push({
        rowIndex: i + 1,
        reason: `토큰 ${tokens.length}개 — 5개 (No · 검색 키워드 · 클릭 · 노출 · CTR) 필요`,
      });
      continue;
    }

    const result = NaverPasteRowSchema.safeParse({
      검색키워드: parsed.query,
      클릭: parsed.clicks,
      노출: parsed.impressions,
      CTR: parsed.ctr,
    });
    if (!result.success) {
      errors.push({
        rowIndex: i + 1,
        reason: result.error.issues.map((iss) => `${iss.path.join(".")}: ${iss.message}`).join("; "),
      });
      continue;
    }
    validRows.push(result.data);
  }

  return { validRows, skippedRows: errors.length, errors, detectedFormat: format };
}

/**
 * 5 또는 그 이상의 토큰에서 NSA TOP30 row 추출.
 *  - 첫 토큰 (No) skip
 *  - 마지막 3개 (클릭 · 노출 · CTR) 는 숫자
 *  - 중간 (검색 키워드) 는 나머지 토큰 합쳐서 — multi-space 구분 시 공백 포함 query 정합
 */
function extractRowTokens(
  tokens: string[],
): { query: string; clicks: string; impressions: string; ctr: string } | null {
  if (tokens.length < 5) return null;
  // No 가 첫 토큰. 마지막 3개 = clicks, impressions, ctr. 가운데 = query (1+ 토큰)
  const ctr = tokens[tokens.length - 1]!;
  const impressions = tokens[tokens.length - 2]!;
  const clicks = tokens[tokens.length - 3]!;
  const queryTokens = tokens.slice(1, tokens.length - 3);
  const query = queryTokens.join(" ").trim();
  if (query.length === 0) return null;
  // 마지막 3개가 숫자 형태인지 sanity check (regex)
  if (!/^\d+(\.\d+)?$/.test(clicks) || !/^\d+(\.\d+)?$/.test(impressions) || !/^\d+(\.\d+)?$/.test(ctr)) {
    return null;
  }
  return { query, clicks, impressions, ctr };
}

function isNumeric(s: string): boolean {
  return /^\d+$/.test(s);
}

// === parseHtmlTable — cheerio (site-meta-fetch 패턴) ===

function parseHtmlTable(html: string): PasteParseResult {
  const $ = cheerio.load(html);
  const rows = $("tbody tr");
  const validRows: NaverPasteRow[] = [];
  const errors: Array<{ rowIndex: number; reason: string }> = [];

  rows.each((idx, el) => {
    const cells = $(el).find("td");
    if (cells.length < 5) {
      errors.push({ rowIndex: idx + 1, reason: `td ${cells.length}개 — 5개 필요` });
      return;
    }
    // cells[0] = No (skip) · cells[1] = 검색 키워드 (wrapper div 안 텍스트) · cells[2] = 클릭 · cells[3] = 노출 · cells[4] = CTR
    const queryRaw = $(cells[1]!).text().trim();
    const clicks = $(cells[2]!).text().trim();
    const impressions = $(cells[3]!).text().trim();
    const ctr = $(cells[4]!).text().trim();

    const result = NaverPasteRowSchema.safeParse({
      검색키워드: queryRaw,
      클릭: clicks,
      노출: impressions,
      CTR: ctr,
    });
    if (!result.success) {
      errors.push({
        rowIndex: idx + 1,
        reason: result.error.issues.map((iss) => `${iss.path.join(".")}: ${iss.message}`).join("; "),
      });
      return;
    }
    validRows.push(result.data);
  });

  return { validRows, skippedRows: errors.length, errors, detectedFormat: "html" };
}

// === Normalize — ingestion 단계 sentinel + CTR /100 ===

export type NormalizedNaverRow = {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;  // 0~1 (/100 변환 후)
  pageUrl: "";  // sentinel (§ 4.5)
  avgPosition: 1000;  // sentinel (§ 4.6)
};

export function normalizeRow(row: NaverPasteRow): NormalizedNaverRow {
  return {
    query: row.검색키워드,
    clicks: row.클릭,
    impressions: row.노출,
    ctr: row.CTR / 100,
    pageUrl: "",
    avgPosition: 1000,
  };
}

// === metadata builder (§ 4.4 INSERT) ===

export function buildNaverRowMetadata(referenceDate: string): {
  dataGrain: "naver-top30-cumulative";
  collectionDate: string;
  sourceWindowLabel: string;
  positionUnavailable: true;
} {
  return {
    dataGrain: "naver-top30-cumulative",
    collectionDate: referenceDate,
    sourceWindowLabel: "NSA TOP30 누적",
    positionUnavailable: true,
  };
}
