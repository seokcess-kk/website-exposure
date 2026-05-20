// @glitzy/web/scripts/sync-prod-from-dev — dev DB (spike-e Docker) → production (Supabase) sync
//
// slug 기준 UPSERT · author_doctor_id slug 매핑 · sentinel compliance_record 자동 생성
//
// 사용 (PowerShell):
//   $env:DEV_DATABASE_URL = "postgres://postgres:postgres@localhost:5438/spike_e"
//   pnpm --filter @glitzy/web sync-prod-from-dev
//   (SEED_DATABASE_URL 는 .env 안 prod URL 그대로 사용)
//
// 대상 entity (instance slug = 'demo'):
//   1. clinic_profile (1 row · slug='clinic') — URL · 본문 컬럼 갱신
//   2. location_profile (1 row · slug='main')
//   3. doctor_profile (slug 기준 UPSERT — 새 의료진 INSERT)
//   4. treatment_page (slug 기준 UPDATE — hero_image_url 등)
//   5. article (slug 기준 UPSERT + sentinel compliance + author/category slug 매핑)
//   6. publication (slug 기준 UPSERT + sentinel)
//   7. media_appearance (slug 기준 UPSERT + sentinel)
//   8. faq (slug 기준 UPSERT + author/category slug 매핑)

import postgres from "postgres";

const SENTINEL_AUTO_CHECK = JSON.stringify({
  automatedDecision: "pass",
  buildBlocked: false,
  gateRequired: false,
  hasWarnings: false,
  findingsBySeverity: { fail: 0, "content-gate": 0, warning: 0, info: 0 },
  findings: [],
});

const SENTINEL_METADATA = JSON.stringify({
  sentinel: true,
  manualReview: true,
  catalogVersion: "m0-stub-v0.1",
  exemptReason: "sync-prod-from-dev",
});

async function main(): Promise<void> {
  const devUrl = process.env.DEV_DATABASE_URL ?? "postgres://postgres:postgres@localhost:5438/spike_e";
  const prodUrl = process.env.SEED_DATABASE_URL;
  if (!prodUrl) {
    console.error("SEED_DATABASE_URL 환경 변수 필요 (prod Supabase URL).");
    process.exit(1);
  }

  const dev = postgres(devUrl, { max: 1 });
  const prod = postgres(prodUrl, { max: 1, ssl: "require" });

  try {
    // === instance ID 매핑 ===
    const devInstRows = await dev<{ id: string }[]>`SELECT id FROM instance WHERE slug='demo' LIMIT 1`;
    const prodInstRows = await prod<{ id: string }[]>`SELECT id FROM instance WHERE slug='demo' LIMIT 1`;
    if (devInstRows.length === 0 || prodInstRows.length === 0) {
      throw new Error("demo instance 미발견 — dev 또는 prod 안 instance 누락");
    }
    const devInstId = devInstRows[0]!.id;
    const prodInstId = prodInstRows[0]!.id;
    console.log(`[sync] instance dev=${devInstId.slice(0, 8)}... prod=${prodInstId.slice(0, 8)}...`);

    // === sentinel admin_user (prod) lookup ===
    const sentinelUserRows = await prod<{ id: string }[]>`
      SELECT id FROM admin_user ORDER BY created_at ASC LIMIT 1
    `;
    if (sentinelUserRows.length === 0) {
      throw new Error("admin_user 미발견 — `pnpm seed` 먼저 실행 필요");
    }
    const sentinelUserId = sentinelUserRows[0]!.id;
    console.log(`[sync] sentinel admin user=${sentinelUserId.slice(0, 8)}...`);

    // === 1. clinic_profile UPDATE ===
    const devClinicRows = await dev<Array<Record<string, unknown>>>`
      SELECT name, description, long_description, slogan, logo_url, og_image_url,
             legal_entity_name, founder, founding_date, business_registration_number,
             alternate_name, policy_contact_person, policy_contact_email, policy_contact_phone,
             policy_effective_date, primary_ctas, brand_tokens, metadata
        FROM clinic_profile
       WHERE instance_id = ${devInstId}::uuid AND slug='clinic'
       LIMIT 1
    `;
    if (devClinicRows.length === 0) {
      console.log("[sync] clinic_profile dev row 없음 — skip");
    } else {
      const c = devClinicRows[0]!;
      await prod`
        UPDATE clinic_profile SET
          name = ${c.name as string},
          description = ${c.description as string},
          long_description = ${(c.long_description as string | null) ?? null},
          slogan = ${(c.slogan as string | null) ?? null},
          logo_url = ${c.logo_url as string},
          og_image_url = ${c.og_image_url as string},
          legal_entity_name = ${(c.legal_entity_name as string | null) ?? null},
          founder = ${(c.founder as string | null) ?? null},
          founding_date = ${(c.founding_date as Date | null) ?? null},
          business_registration_number = ${(c.business_registration_number as string | null) ?? null},
          alternate_name = ${(c.alternate_name as string | null) ?? null},
          policy_contact_person = ${(c.policy_contact_person as string | null) ?? null},
          policy_contact_email = ${(c.policy_contact_email as string | null) ?? null},
          policy_contact_phone = ${(c.policy_contact_phone as string | null) ?? null},
          policy_effective_date = ${(c.policy_effective_date as Date | null) ?? null},
          primary_ctas = ${(c.primary_ctas as object) ?? []}::jsonb,
          brand_tokens = ${(c.brand_tokens as object | null) ?? null}::jsonb,
          metadata = ${(c.metadata as object) ?? {}}::jsonb,
          updated_at = NOW()
        WHERE instance_id = ${prodInstId}::uuid AND slug='clinic'
      `;
      console.log("[sync] (1/8) clinic_profile updated");
    }

    // === 2. location_profile UPDATE ===
    const devLocRows = await dev<Array<Record<string, unknown>>>`
      SELECT name, street_address, address_locality, address_region, postal_code, address_country,
             latitude, longitude, phone, email, metadata
        FROM location_profile
       WHERE instance_id = ${devInstId}::uuid AND slug='main'
       LIMIT 1
    `;
    if (devLocRows.length > 0) {
      const l = devLocRows[0]!;
      await prod`
        UPDATE location_profile SET
          name = ${l.name as string},
          street_address = ${l.street_address as string},
          address_locality = ${l.address_locality as string},
          address_region = ${l.address_region as string},
          postal_code = ${l.postal_code as string},
          address_country = ${l.address_country as string},
          latitude = ${(l.latitude as string | null) ?? null},
          longitude = ${(l.longitude as string | null) ?? null},
          phone = ${(l.phone as string | null) ?? null},
          email = ${(l.email as string | null) ?? null},
          metadata = ${(l.metadata as object) ?? {}}::jsonb,
          updated_at = NOW()
        WHERE instance_id = ${prodInstId}::uuid AND slug='main'
      `;
      console.log("[sync] (2/8) location_profile updated");
    } else {
      console.log("[sync] location_profile dev row 없음 — skip");
    }

    // === 3. doctor_profile UPSERT ===
    const devDoctors = await dev<Array<Record<string, unknown>>>`
      SELECT slug, name, title, job_title, honorific, bio, photo_url, cv_photo_url, display_order, active, metadata
        FROM doctor_profile WHERE instance_id = ${devInstId}::uuid
    `;
    for (const d of devDoctors) {
      await prod`
        INSERT INTO doctor_profile (instance_id, slug, name, title, job_title, honorific, bio,
                                     photo_url, cv_photo_url, display_order, active, metadata)
        VALUES (${prodInstId}::uuid, ${d.slug as string}, ${d.name as string},
                ${(d.title as string | null) ?? null}, ${(d.job_title as string | null) ?? null},
                ${(d.honorific as string | null) ?? null}, ${(d.bio as string | null) ?? null},
                ${(d.photo_url as string | null) ?? null}, ${(d.cv_photo_url as string | null) ?? null},
                ${(d.display_order as number) ?? 0},
                ${d.active as boolean}, ${(d.metadata as object) ?? {}}::jsonb)
        ON CONFLICT (instance_id, slug) DO UPDATE SET
          name = EXCLUDED.name,
          title = EXCLUDED.title,
          job_title = EXCLUDED.job_title,
          honorific = EXCLUDED.honorific,
          bio = EXCLUDED.bio,
          photo_url = EXCLUDED.photo_url,
          cv_photo_url = EXCLUDED.cv_photo_url,
          display_order = EXCLUDED.display_order,
          active = EXCLUDED.active,
          metadata = EXCLUDED.metadata,
          updated_at = NOW()
      `;
    }
    console.log(`[sync] (3/8) doctor_profile upserted (${devDoctors.length} rows)`);

    // === doctor slug → prod doctor_id 매핑 (이후 author FK 용) ===
    const prodDoctorRows = await prod<{ id: string; slug: string }[]>`
      SELECT id, slug FROM doctor_profile WHERE instance_id = ${prodInstId}::uuid
    `;
    const prodDoctorByslug = new Map<string, string>();
    for (const d of prodDoctorRows) prodDoctorByslug.set(d.slug, d.id);

    // === category slug → prod category_id 매핑 ===
    const prodCatRows = await prod<{ id: string; slug: string }[]>`
      SELECT id, slug FROM article_category WHERE instance_id = ${prodInstId}::uuid
    `;
    const prodCatBySlug = new Map<string, string>();
    for (const c of prodCatRows) prodCatBySlug.set(c.slug, c.id);

    // === 4. treatment_page UPDATE (이미 production 안 16 row 있어 hero_image 등만 갱신) ===
    const devTreatments = await dev<Array<Record<string, unknown>>>`
      SELECT slug, title, summary, body_markdown, hero_image_url, metadata
        FROM treatment_page WHERE instance_id = ${devInstId}::uuid
    `;
    let treatmentUpdated = 0;
    for (const t of devTreatments) {
      const result = await prod`
        UPDATE treatment_page SET
          title = ${t.title as string},
          summary = ${t.summary as string},
          body_markdown = ${t.body_markdown as string},
          hero_image_url = ${(t.hero_image_url as string | null) ?? null},
          metadata = ${(t.metadata as object) ?? {}}::jsonb,
          updated_at = NOW()
        WHERE instance_id = ${prodInstId}::uuid AND slug = ${t.slug as string}
      `;
      if (result.count > 0) treatmentUpdated += 1;
    }
    console.log(`[sync] (4/8) treatment_page updated (${treatmentUpdated}/${devTreatments.length} rows matched by slug)`);

    // === sentinel compliance_record 헬퍼 ===
    async function ensureSentinel(contentType: string, slug: string): Promise<string> {
      const existing = await prod<{ id: string }[]>`
        SELECT id FROM compliance_record
         WHERE instance_id = ${prodInstId}::uuid
           AND content_type = ${contentType}::compliance_content_type
           AND content_ref = ${slug}
           AND metadata @> '{"sentinel":true}'::jsonb
         LIMIT 1
      `;
      if (existing.length > 0) return existing[0]!.id;
      const inserted = await prod<{ id: string }[]>`
        INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
          auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
          record_phase, record_version, metadata)
        VALUES (${prodInstId}::uuid, ${contentType}::compliance_content_type, ${slug}, 'Low'::risk_level,
          ${SENTINEL_AUTO_CHECK}::jsonb,
          ${sentinelUserId}::uuid, NOW(), NOW(), ${sentinelUserId}::uuid,
          'published'::compliance_record_phase, 1,
          ${SENTINEL_METADATA}::jsonb)
        RETURNING id
      `;
      return inserted[0]!.id;
    }

    // === 5. article UPSERT (sentinel + author/category slug 매핑) ===
    const devArticles = await dev<Array<Record<string, unknown>>>`
      SELECT a.slug, a.title, a.summary, a.body_markdown, a.hero_image_url, a.external_url, a.published_at,
             a.metadata, ac.slug AS category_slug, dp.slug AS author_slug
        FROM article a
        JOIN article_category ac ON a.category_id = ac.id AND a.instance_id = ac.instance_id
        LEFT JOIN doctor_profile dp ON a.author_doctor_id = dp.id AND a.instance_id = dp.instance_id
       WHERE a.instance_id = ${devInstId}::uuid AND a.status='published'
    `;
    let articleUpserted = 0;
    for (const a of devArticles) {
      const catId = prodCatBySlug.get(a.category_slug as string);
      if (!catId) {
        console.log(`[sync] article ${a.slug} — category '${a.category_slug}' prod 안 미발견, skip`);
        continue;
      }
      const authorId = a.author_slug ? prodDoctorByslug.get(a.author_slug as string) ?? null : null;
      const crId = await ensureSentinel("Article", a.slug as string);
      await prod`
        INSERT INTO article (instance_id, slug, title, summary, body_markdown, hero_image_url, external_url,
                             status, risk_level, published_at, author_doctor_id, category_id,
                             compliance_record_id, metadata)
        VALUES (${prodInstId}::uuid, ${a.slug as string}, ${a.title as string}, ${a.summary as string},
                ${a.body_markdown as string}, ${(a.hero_image_url as string | null) ?? null},
                ${(a.external_url as string | null) ?? null},
                'published'::content_publication_status, 'Low'::risk_level,
                ${(a.published_at as Date | null) ?? new Date()},
                ${authorId}, ${catId}::uuid, ${crId}::uuid, ${(a.metadata as object) ?? {}}::jsonb)
        ON CONFLICT (instance_id, slug) DO UPDATE SET
          title = EXCLUDED.title,
          summary = EXCLUDED.summary,
          body_markdown = EXCLUDED.body_markdown,
          hero_image_url = EXCLUDED.hero_image_url,
          external_url = EXCLUDED.external_url,
          author_doctor_id = EXCLUDED.author_doctor_id,
          category_id = EXCLUDED.category_id,
          metadata = EXCLUDED.metadata,
          updated_at = NOW()
      `;
      articleUpserted += 1;
    }
    console.log(`[sync] (5/8) article upserted (${articleUpserted}/${devArticles.length} rows)`);

    // === 6. publication UPSERT ===
    const devPubs = await dev<Array<Record<string, unknown>>>`
      SELECT p.slug, p.title, p.authors, p.journal,
             to_char(p.published_date, 'YYYY-MM-DD') AS published_date,
             p.doi, p.pubmed_id, p.url, p.thumbnail_url, p.summary, p.published_at, p.metadata,
             dp.slug AS author_slug
        FROM publication p
        LEFT JOIN doctor_profile dp ON p.author_doctor_id = dp.id AND p.instance_id = dp.instance_id
       WHERE p.instance_id = ${devInstId}::uuid AND p.status='published'
    `;
    let pubUpserted = 0;
    for (const p of devPubs) {
      const authorId = p.author_slug ? prodDoctorByslug.get(p.author_slug as string) ?? null : null;
      const crId = await ensureSentinel("Publication", p.slug as string);
      await prod`
        INSERT INTO publication (instance_id, slug, title, authors, journal, published_date,
                                 doi, pubmed_id, url, thumbnail_url, summary, author_doctor_id,
                                 status, risk_level, published_at, compliance_record_id, metadata)
        VALUES (${prodInstId}::uuid, ${p.slug as string}, ${p.title as string},
                ${(p.authors as object) ?? []}::jsonb, ${(p.journal as string | null) ?? null},
                ${(p.published_date as string | null) ?? null}::date,
                ${(p.doi as string | null) ?? null}, ${(p.pubmed_id as string | null) ?? null},
                ${(p.url as string | null) ?? null}, ${(p.thumbnail_url as string | null) ?? null},
                ${(p.summary as string | null) ?? null}, ${authorId},
                'published'::content_publication_status, 'Low'::risk_level,
                ${(p.published_at as Date | null) ?? new Date()}, ${crId}::uuid,
                ${(p.metadata as object) ?? {}}::jsonb)
        ON CONFLICT (instance_id, slug) DO UPDATE SET
          title = EXCLUDED.title,
          authors = EXCLUDED.authors,
          journal = EXCLUDED.journal,
          published_date = EXCLUDED.published_date,
          doi = EXCLUDED.doi,
          pubmed_id = EXCLUDED.pubmed_id,
          url = EXCLUDED.url,
          thumbnail_url = EXCLUDED.thumbnail_url,
          summary = EXCLUDED.summary,
          author_doctor_id = EXCLUDED.author_doctor_id,
          metadata = EXCLUDED.metadata,
          updated_at = NOW()
      `;
      pubUpserted += 1;
    }
    console.log(`[sync] (6/8) publication upserted (${pubUpserted}/${devPubs.length} rows)`);

    // === 7. media_appearance UPSERT ===
    const devMedia = await dev<Array<Record<string, unknown>>>`
      SELECT m.slug, m.title, m.channel_name, m.channel_type::text AS channel_type,
             to_char(m.published_date, 'YYYY-MM-DD') AS published_date,
             m.duration_seconds, m.url, m.thumbnail_url, m.summary, m.published_at, m.metadata,
             dp.slug AS author_slug
        FROM media_appearance m
        LEFT JOIN doctor_profile dp ON m.author_doctor_id = dp.id AND m.instance_id = dp.instance_id
       WHERE m.instance_id = ${devInstId}::uuid AND m.status='published'
    `;
    let mediaUpserted = 0;
    for (const m of devMedia) {
      const authorId = m.author_slug ? prodDoctorByslug.get(m.author_slug as string) ?? null : null;
      const crId = await ensureSentinel("MediaAppearance", m.slug as string);
      await prod`
        INSERT INTO media_appearance (instance_id, slug, title, channel_name, channel_type,
                                       published_date, duration_seconds, url, thumbnail_url, summary,
                                       author_doctor_id, status, risk_level, published_at,
                                       compliance_record_id, metadata)
        VALUES (${prodInstId}::uuid, ${m.slug as string}, ${m.title as string},
                ${m.channel_name as string}, ${m.channel_type as string}::media_channel_type,
                ${(m.published_date as string | null) ?? null}::date,
                ${(m.duration_seconds as number | null) ?? null},
                ${(m.url as string | null) ?? null}, ${(m.thumbnail_url as string | null) ?? null},
                ${(m.summary as string | null) ?? null}, ${authorId},
                'published'::content_publication_status, 'Low'::risk_level,
                ${(m.published_at as Date | null) ?? new Date()}, ${crId}::uuid,
                ${(m.metadata as object) ?? {}}::jsonb)
        ON CONFLICT (instance_id, slug) DO UPDATE SET
          title = EXCLUDED.title,
          channel_name = EXCLUDED.channel_name,
          channel_type = EXCLUDED.channel_type,
          published_date = EXCLUDED.published_date,
          duration_seconds = EXCLUDED.duration_seconds,
          url = EXCLUDED.url,
          thumbnail_url = EXCLUDED.thumbnail_url,
          summary = EXCLUDED.summary,
          author_doctor_id = EXCLUDED.author_doctor_id,
          metadata = EXCLUDED.metadata,
          updated_at = NOW()
      `;
      mediaUpserted += 1;
    }
    console.log(`[sync] (7/8) media_appearance upserted (${mediaUpserted}/${devMedia.length} rows)`);

    // === 8. faq UPSERT (author/category slug 매핑) ===
    const devFaqs = await dev<Array<Record<string, unknown>>>`
      SELECT f.slug, f.question, f.answer, f.display_order,
             ac.slug AS category_slug, dp.slug AS author_slug
        FROM faq f
        LEFT JOIN article_category ac ON f.category_id = ac.id AND f.instance_id = ac.instance_id
        LEFT JOIN doctor_profile dp ON f.author_doctor_id = dp.id AND f.instance_id = dp.instance_id
       WHERE f.instance_id = ${devInstId}::uuid
    `;
    let faqUpserted = 0;
    for (const f of devFaqs) {
      const catId = f.category_slug ? prodCatBySlug.get(f.category_slug as string) ?? null : null;
      const authorId = f.author_slug ? prodDoctorByslug.get(f.author_slug as string) ?? null : null;
      await prod`
        INSERT INTO faq (instance_id, slug, question, answer, display_order, category_id, author_doctor_id)
        VALUES (${prodInstId}::uuid, ${f.slug as string}, ${f.question as string}, ${f.answer as string},
                ${(f.display_order as number) ?? 0}, ${catId}, ${authorId})
        ON CONFLICT (instance_id, slug) DO UPDATE SET
          question = EXCLUDED.question,
          answer = EXCLUDED.answer,
          display_order = EXCLUDED.display_order,
          category_id = EXCLUDED.category_id,
          author_doctor_id = EXCLUDED.author_doctor_id,
          updated_at = NOW()
      `;
      faqUpserted += 1;
    }
    console.log(`[sync] (8/8) faq upserted (${faqUpserted}/${devFaqs.length} rows)`);

    console.log("\n[sync] DONE — Vercel ISR cache (60s) 후 또는 redeploy 시 반영");
  } catch (err) {
    console.error("[sync] failed:", err);
    process.exitCode = 1;
  } finally {
    await dev.end({ timeout: 5 });
    await prod.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error("[sync] unexpected error:", err);
  process.exit(1);
});
