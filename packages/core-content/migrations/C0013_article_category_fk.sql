-- @glitzy/core-content — C0013 Article.category_id staged migration
-- EC-SCHEMA-05·06·07 · cycle 1 ECP-03·09 정합: PSR-DEFER-15 해소.
-- staged 4 step (단일 migration 안 · idempotent — 부분 실패 재실행 안전 · cycle 1 ECC-01 patch):
--   (1) ADD COLUMN nullable (IF NOT EXISTS)
--   (2) default `general` ArticleCategory 행 backfill (instance 별 idempotent INSERT)
--   (3) 기존 article row 의 category_id 를 default category 로 backfill (NULL row 만)
--   (4) NULL 잔존 검증 → SET NOT NULL + composite FK + index (NOT EXISTS guard)
-- Precondition: C0005 article · C0009 article_category

-- (1) ADD COLUMN nullable — 재실행 안전
ALTER TABLE article ADD COLUMN IF NOT EXISTS category_id UUID;

-- (2) instance 별 default `general` ArticleCategory 행 INSERT (idempotent — ON CONFLICT DO NOTHING)
--   seed.ts 가 신규 instance 에서 자동 INSERT 책임 (EC-SCHEMA-03). 본 step 은 기존 instance backfill.
INSERT INTO article_category (instance_id, slug, name, display_order)
SELECT i.id, 'general', '일반', 0
FROM instance i
ON CONFLICT (instance_id, slug) DO NOTHING;

-- (3) 기존 article row 의 category_id 를 default category 로 backfill — NULL row 만 UPDATE
UPDATE article a
SET category_id = ac.id
FROM article_category ac
WHERE a.instance_id = ac.instance_id
  AND ac.slug = 'general'
  AND a.category_id IS NULL;

-- (4) NULL 잔존 검증 — 운영 중 backfill 실패한 row 가 있으면 SET NOT NULL 가 실패하므로 명시 raise.
DO $$
DECLARE
  null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count FROM article WHERE category_id IS NULL;
  IF null_count > 0 THEN
    RAISE EXCEPTION 'C0013: article.category_id 가 NULL 인 row % 건이 backfill 후에도 잔존합니다. article_category seed 누락 instance 확인 필요.', null_count;
  END IF;
END $$;

-- (4-1) SET NOT NULL — IS NULL 0 인 상태에서만 진입. 재실행 시 이미 NOT NULL 이어도 PostgreSQL 은 빠르게 no-op.
ALTER TABLE article ALTER COLUMN category_id SET NOT NULL;

-- (4-2) composite FK (same-tenant) — 존재 guard (cycle 2 ECC-07 patch: conrelid 한정).
--   동명 constraint 가 다른 table 에 있어도 article 에 정확히 부착되도록 조건 강화.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = 'article_category_fk'
       AND conrelid = 'article'::regclass
  ) THEN
    ALTER TABLE article ADD CONSTRAINT article_category_fk
      FOREIGN KEY (instance_id, category_id)
      REFERENCES article_category (instance_id, id)
      ON DELETE NO ACTION;
  END IF;
END $$;

-- (4-3) index — IF NOT EXISTS
CREATE INDEX IF NOT EXISTS article_category_idx ON article (instance_id, category_id);
