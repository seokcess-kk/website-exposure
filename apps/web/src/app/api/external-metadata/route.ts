// @glitzy/web/api/external-metadata — ADMIN_UX_REDESIGN v1.0 § 12
// CrossRef · PubMed · YouTube 자동 메타 fetch endpoint.
// site-meta-fetch 와 동일 패턴: Origin 검증 · 세션 검증 · 4KB body limit.

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
  AuthDeniedError,
  getActiveSession,
} from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { getAuthCfg } from "@/lib/env";
import {
  fetchCrossRefByDoi,
  fetchPubMedById,
  fetchYouTubeMeta,
  ExternalMetadataError,
} from "@/lib/external-metadata";

const BodySchema = z.discriminatedUnion("provider", [
  z.object({ provider: z.literal("crossref"), doi: z.string().min(1).max(200) }),
  z.object({ provider: z.literal("pubmed"), pmid: z.string().min(1).max(20) }),
  z.object({ provider: z.literal("youtube"), url: z.string().min(1).max(2048) }),
]);

const MAX_REQUEST_BYTES = 4 * 1024;

async function readBodyWithLimit(req: NextRequest): Promise<string | null> {
  const reader = req.body?.getReader();
  if (!reader) return null;
  let total = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_REQUEST_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks.map((c) => Buffer.from(c))).toString("utf-8");
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const origin = req.headers.get("origin");
  if (!origin || origin !== req.nextUrl.origin) {
    return NextResponse.json({ ok: false, error: "외부 도메인 요청 차단" }, { status: 403 });
  }

  const signedToken = req.cookies.get("glitzy_session")?.value ?? null;
  if (!signedToken) {
    return NextResponse.json({ ok: false, error: "로그인 필요" }, { status: 401 });
  }

  try {
    await getActiveSession(getSqlBase(), getAuthCfg(), signedToken);
  } catch (err) {
    if (err instanceof AuthDeniedError) {
      return NextResponse.json({ ok: false, error: "세션 만료" }, { status: 401 });
    }
    throw err;
  }

  const rawBody = await readBodyWithLimit(req);
  if (rawBody === null) {
    return NextResponse.json({ ok: false, error: "요청 크기 초과 (4KB)" }, { status: 413 });
  }

  let parsed;
  try {
    parsed = BodySchema.safeParse(JSON.parse(rawBody));
  } catch {
    return NextResponse.json({ ok: false, error: "JSON 파싱 실패" }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "요청 형식 오류" }, { status: 400 });
  }

  try {
    let meta;
    if (parsed.data.provider === "crossref") {
      meta = await fetchCrossRefByDoi(parsed.data.doi);
    } else if (parsed.data.provider === "pubmed") {
      meta = await fetchPubMedById(parsed.data.pmid);
    } else {
      meta = await fetchYouTubeMeta(parsed.data.url);
    }
    return NextResponse.json({ ok: true, meta });
  } catch (err) {
    if (err instanceof ExternalMetadataError) {
      return NextResponse.json({ ok: false, error: err.message, code: err.code }, { status: 400 });
    }
    console.error("[external-metadata] fetch error", err);
    return NextResponse.json({ ok: false, error: "외부 API 호출 실패" }, { status: 502 });
  }
}
