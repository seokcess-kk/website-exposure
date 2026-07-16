-- daeatdiet-incheon SEO consolidation (idempotent)
-- One instance, one home-page head term, and one canonical article per search intent.

DO $$
DECLARE
  iid UUID;
  home_description TEXT := '인천 부평에 위치한 다이트한의원 인천 부평점의 다이어트 진료 안내입니다. 신수용 대표원장이 체질과 건강 상태를 확인하고 한약·생활 관리 방향을 상담합니다.';
  n INT;
BEGIN
  SELECT id INTO iid FROM instance WHERE slug = 'daeatdiet-incheon';
  IF iid IS NULL THEN RAISE EXCEPTION 'instance daeatdiet-incheon not found'; END IF;

  -- Homepage SoT: localKeywords[0] drives exact title; following terms support
  -- natural local context without creating another instance or doorway page.
  UPDATE clinic_profile
     SET description = home_description,
         metadata = jsonb_set(
           COALESCE(metadata, '{}'::jsonb),
           '{localKeywords}',
           '["인천다이어트한의원","다이어트한의원인천","부평다이어트한의원","다이어트한의원부평점","부평 다이어트 한약","인천 한방 다이어트"]'::jsonb,
           true
         ),
         updated_at = NOW()
   WHERE instance_id = iid AND slug = 'clinic';

  -- Track the requested query set and declare a single target path in metadata.
  INSERT INTO keyword_target
    (id, instance_id, slug, label, keyword_type, intent, priority, status, metadata, created_at, updated_at)
  SELECT gen_random_uuid(), iid, v.slug, v.label, v.kind, v.intent, v.priority, 'active',
         jsonb_build_object('targetPath', v.path), NOW(), NOW()
    FROM (VALUES
      ('인천다이어트한의원','인천다이어트한의원','primary','local','P0','/'),
      ('다이어트한의원인천','다이어트한의원인천','secondary','local','P1','/'),
      ('부평다이어트한의원','부평다이어트한의원','secondary','local','P0','/'),
      ('다이어트한의원부평점','다이어트한의원부평점','secondary','local','P1','/'),
      ('부천다이어트한의원','부천다이어트한의원','secondary','local','P1','/insights/diet/bucheon-diet-korean-medicine'),
      ('부평의원다이어트','부평의원다이어트','secondary','informational','P2','/insights/diet/bupyeong-uiwon-diet-guide'),
      ('부평비만클리닉다이어트','부평비만클리닉다이어트','secondary','informational','P1','/insights/diet/bupyeong-obesity-clinic-diet'),
      ('인천다이어트약','인천다이어트약','secondary','informational','P1','/insights/diet/incheon-diet-medication-guide'),
      ('인천지방분해주사가격','인천지방분해주사가격','secondary','comparison','P1','/insights/diet/incheon-fat-dissolving-injection-cost'),
      ('부평다이어트한약','부평다이어트한약','secondary','informational','P1','/insights/herbal-prescription/bupyeong-diet-herbal-medicine'),
      ('인천식욕억제제','인천식욕억제제','secondary','informational','P1','/insights/diet/incheon-appetite-suppressant-guide'),
      ('부평다이어트한의원가격','부평다이어트한의원가격','secondary','comparison','P1','/insights/diet/incheon-diet-clinic-price-guide'),
      ('부평한방다이어트','부평한방다이어트','secondary','informational','P1','/insights/diet/bupyeong-korean-medicine-diet')
    ) AS v(slug,label,kind,intent,priority,path)
  ON CONFLICT (instance_id, slug) DO UPDATE
    SET label = EXCLUDED.label, keyword_type = EXCLUDED.keyword_type,
        intent = EXCLUDED.intent, priority = EXCLUDED.priority, status = 'active',
        metadata = keyword_target.metadata || EXCLUDED.metadata, updated_at = NOW();

  -- One canonical article per intent. Stale duplicates preserve a permanent
  -- redirect target in metadata; published-only sitemap queries remove them.
  UPDATE article a
     SET status = 'stale',
         metadata = jsonb_set(COALESCE(a.metadata, '{}'::jsonb), '{redirectPath}', to_jsonb(v.target), true),
         updated_at = NOW()
    FROM (VALUES
      ('incheon-diet-korean-medicine-2','/'),
      ('incheon-diet-korean-medicine','/'),
      ('diet-korean-medicine-incheon-guide','/'),
      ('diet-korean-medicine-incheon-constitution','/'),
      ('bucheon-diet-korean-medicine-guide','/insights/diet/bucheon-diet-korean-medicine'),
      ('diet-clinic-bucheon-guide','/insights/diet/bucheon-diet-korean-medicine'),
      ('bupyeong-obesity-clinic-diet-guide','/insights/diet/bupyeong-obesity-clinic-diet'),
      ('bupyeong-diet-clinic-guide','/insights/diet/bupyeong-obesity-clinic-diet'),
      ('incheon-diet-medicine-guide','/insights/diet/incheon-diet-medication-guide'),
      ('incheon-fat-dissolving-injection-price','/insights/diet/incheon-fat-dissolving-injection-cost'),
      ('korean-herbal-diet-bupyeong','/insights/herbal-prescription/bupyeong-diet-herbal-medicine'),
      ('bupyeong-diet-herbal-medicine-checklist','/insights/herbal-prescription/bupyeong-diet-herbal-medicine'),
      ('byeongpyeong-diet-clinic-price','/insights/diet/incheon-diet-clinic-price-guide')
    ) AS v(slug,target)
   WHERE a.instance_id = iid AND a.slug = v.slug
     AND (a.status <> 'stale' OR a.metadata->>'redirectPath' IS DISTINCT FROM v.target);

  -- Remove keyword links that still nominate a stale article as primary.
  DELETE FROM keyword_content_link kcl
   USING article a
   WHERE kcl.instance_id = iid
     AND a.instance_id = iid AND a.id = kcl.entity_id
     AND kcl.entity_type = 'Article' AND a.status = 'stale';

  -- Canonical article titles contain the intended query naturally.
  UPDATE article a SET title = v.title, updated_at = NOW()
    FROM (VALUES
      ('bucheon-diet-korean-medicine','부천다이어트한의원 선택 전 확인할 진료·접근 기준'),
      ('bupyeong-uiwon-diet-guide','부평의원다이어트, 의원·한의원 선택 전 확인할 사항'),
      ('bupyeong-obesity-clinic-diet','부평비만클리닉다이어트 선택 전 확인할 관리 기준'),
      ('incheon-diet-medication-guide','인천다이어트약의 종류와 복용 전 확인할 주의사항'),
      ('incheon-fat-dissolving-injection-cost','인천지방분해주사가격, 시술 전 확인할 비용·기간·주의사항'),
      ('bupyeong-diet-herbal-medicine','부평다이어트한약 상담 전 확인할 처방 과정과 주의사항'),
      ('incheon-appetite-suppressant-guide','인천식욕억제제의 올바른 이해와 복용 시 주의사항'),
      ('incheon-diet-clinic-price-guide','부평다이어트한의원가격, 비용과 기간을 결정하는 요소'),
      ('bupyeong-korean-medicine-diet','부평한방다이어트의 원리와 상담 전 확인할 사항')
    ) AS v(slug,title)
   WHERE a.instance_id = iid AND a.slug = v.slug AND a.title IS DISTINCT FROM v.title;

  SELECT COUNT(*) INTO n FROM article
   WHERE instance_id = iid AND status = 'stale' AND metadata ? 'redirectPath';
  RAISE NOTICE 'redirected stale articles: %', n;
END $$;
