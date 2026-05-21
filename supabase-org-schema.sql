-- ================================================================
-- BCMS Portal – 멀티유저 조직 스키마
-- Supabase Dashboard > SQL Editor에서 실행하세요
-- ================================================================

-- ── 1. organizations 테이블 ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS organizations (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT        NOT NULL,
  industry     TEXT        DEFAULT '',
  cert_goal    TEXT        DEFAULT '',
  created_by   UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. org_members 테이블 ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS org_members (
  org_id      UUID        REFERENCES organizations(id) ON DELETE CASCADE,
  user_id     UUID        REFERENCES auth.users(id)    ON DELETE CASCADE,
  role        TEXT        NOT NULL CHECK (role IN ('admin','editor','viewer')),
  department  TEXT        DEFAULT '',
  invited_by  UUID        REFERENCES auth.users(id)    ON DELETE SET NULL,
  joined_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (org_id, user_id)
);

-- ── 3. org_invitations 테이블 (초대 토큰) ──────────────────────
CREATE TABLE IF NOT EXISTS org_invitations (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id      UUID        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL,
  role        TEXT        NOT NULL DEFAULT 'editor' CHECK (role IN ('editor','viewer')),
  department  TEXT        DEFAULT '',
  token       TEXT        NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  invited_by  UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  accepted_at TIMESTAMPTZ,
  expires_at  TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. 기존 테이블에 org_id 컬럼 추가 ─────────────────────────
ALTER TABLE bcms_bia       ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id) ON DELETE SET NULL;
ALTER TABLE bcms_risk      ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id) ON DELETE SET NULL;
ALTER TABLE bcms_bcp       ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id) ON DELETE SET NULL;
ALTER TABLE bcms_training  ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id) ON DELETE SET NULL;
ALTER TABLE bcms_audit     ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id) ON DELETE SET NULL;
ALTER TABLE bcms_user_data ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id) ON DELETE SET NULL;

-- ── 5. bcms_users에 org_id 추가 (현재 소속 조직) ───────────────
ALTER TABLE bcms_users ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id) ON DELETE SET NULL;

-- ── 6. RLS 활성화 ───────────────────────────────────────────────
ALTER TABLE organizations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members     ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_invitations ENABLE ROW LEVEL SECURITY;

-- ── 7. organizations RLS ────────────────────────────────────────
-- 내 조직만 조회
CREATE POLICY "org_member_select" ON organizations
  FOR SELECT USING (
    id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  );
-- admin만 조직 생성 (created_by 본인)
CREATE POLICY "org_creator_insert" ON organizations
  FOR INSERT WITH CHECK (created_by = auth.uid());
-- admin만 조직 수정
CREATE POLICY "org_admin_update" ON organizations
  FOR UPDATE USING (
    id IN (
      SELECT org_id FROM org_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ── 8. org_members RLS ──────────────────────────────────────────
-- 같은 조직 멤버 조회
CREATE POLICY "members_same_org_select" ON org_members
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  );
-- admin만 멤버 추가/수정/삭제
CREATE POLICY "members_admin_insert" ON org_members
  FOR INSERT WITH CHECK (
    org_id IN (
      SELECT org_id FROM org_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
CREATE POLICY "members_admin_update" ON org_members
  FOR UPDATE USING (
    org_id IN (
      SELECT org_id FROM org_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
CREATE POLICY "members_admin_delete" ON org_members
  FOR DELETE USING (
    org_id IN (
      SELECT org_id FROM org_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
    OR user_id = auth.uid() -- 본인 탈퇴
  );

-- ── 9. org_invitations RLS ──────────────────────────────────────
CREATE POLICY "inv_admin_manage" ON org_invitations
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM org_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
-- 초대 토큰으로 조회 (비인증 포함) – service_role에서만 실제 처리
CREATE POLICY "inv_token_select" ON org_invitations
  FOR SELECT USING (true); -- 토큰 검증은 앱 레이어에서 처리

-- ── 10. 기존 데이터 테이블 RLS 재설계 ──────────────────────────
-- org_id 기반: 같은 조직 멤버 접근 허용
-- 기존 user_id 단독 정책은 유지 (org_id 없는 레거시 데이터 호환)

-- bcms_bia
DROP POLICY IF EXISTS "bia_own_row" ON bcms_bia;
CREATE POLICY "bia_org_or_own" ON bcms_bia
  FOR ALL USING (
    auth.uid() = id
    OR (
      org_id IS NOT NULL AND
      org_id IN (
        SELECT org_id FROM org_members
        WHERE user_id = auth.uid() AND role IN ('admin','editor','viewer')
      )
    )
  )
  WITH CHECK (
    auth.uid() = id
    OR (
      org_id IS NOT NULL AND
      org_id IN (
        SELECT org_id FROM org_members
        WHERE user_id = auth.uid() AND role IN ('admin','editor')
      )
    )
  );

-- bcms_risk
DROP POLICY IF EXISTS "risk_own_row" ON bcms_risk;
CREATE POLICY "risk_org_or_own" ON bcms_risk
  FOR ALL USING (
    auth.uid() = id
    OR (org_id IS NOT NULL AND org_id IN (
      SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role IN ('admin','editor','viewer')
    ))
  )
  WITH CHECK (
    auth.uid() = id
    OR (org_id IS NOT NULL AND org_id IN (
      SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role IN ('admin','editor')
    ))
  );

-- bcms_bcp
DROP POLICY IF EXISTS "bcp_own_row" ON bcms_bcp;
CREATE POLICY "bcp_org_or_own" ON bcms_bcp
  FOR ALL USING (
    auth.uid() = id
    OR (org_id IS NOT NULL AND org_id IN (
      SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role IN ('admin','editor','viewer')
    ))
  )
  WITH CHECK (
    auth.uid() = id
    OR (org_id IS NOT NULL AND org_id IN (
      SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role IN ('admin','editor')
    ))
  );

-- bcms_training
DROP POLICY IF EXISTS "training_own_row" ON bcms_training;
CREATE POLICY "training_org_or_own" ON bcms_training
  FOR ALL USING (
    auth.uid() = id
    OR (org_id IS NOT NULL AND org_id IN (
      SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role IN ('admin','editor','viewer')
    ))
  )
  WITH CHECK (
    auth.uid() = id
    OR (org_id IS NOT NULL AND org_id IN (
      SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role IN ('admin','editor')
    ))
  );

-- bcms_audit
DROP POLICY IF EXISTS "audit_own_row" ON bcms_audit;
CREATE POLICY "audit_org_or_own" ON bcms_audit
  FOR ALL USING (
    auth.uid() = id
    OR (org_id IS NOT NULL AND org_id IN (
      SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role IN ('admin','editor','viewer')
    ))
  )
  WITH CHECK (
    auth.uid() = id
    OR (org_id IS NOT NULL AND org_id IN (
      SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role IN ('admin','editor')
    ))
  );

-- bcms_user_data
DROP POLICY IF EXISTS "user_data_own_rows" ON bcms_user_data;
CREATE POLICY "user_data_org_or_own" ON bcms_user_data
  FOR ALL USING (
    auth.uid() = user_id
    OR (org_id IS NOT NULL AND org_id IN (
      SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role IN ('admin','editor','viewer')
    ))
  )
  WITH CHECK (
    auth.uid() = user_id
    OR (org_id IS NOT NULL AND org_id IN (
      SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role IN ('admin','editor')
    ))
  );

-- ── 11. 마이그레이션: 기존 사용자 → 개인 조직 자동 생성 ────────
-- 기존 bcms_users 데이터를 가진 사용자를 위해
-- 각 사용자를 자신만의 조직 admin으로 등록
-- (수동 실행 권장 — 데이터 확인 후 실행)

/*
-- 아래 블록을 확인 후 실행하세요:
DO $$
DECLARE
  r RECORD;
  new_org_id UUID;
BEGIN
  FOR r IN
    SELECT u.id, u.company_name, u.industry, u.certification_goal
    FROM bcms_users u
    WHERE u.org_id IS NULL
  LOOP
    -- 조직 생성
    INSERT INTO organizations (name, industry, cert_goal, created_by)
    VALUES (
      COALESCE(NULLIF(r.company_name,''), '내 조직'),
      COALESCE(r.industry, ''),
      COALESCE(r.certification_goal, ''),
      r.id
    )
    RETURNING id INTO new_org_id;

    -- admin 멤버로 등록
    INSERT INTO org_members (org_id, user_id, role)
    VALUES (new_org_id, r.id, 'admin');

    -- bcms_users에 org_id 연결
    UPDATE bcms_users SET org_id = new_org_id WHERE id = r.id;

    -- 기존 데이터에 org_id 연결
    UPDATE bcms_bia      SET org_id = new_org_id WHERE id = r.id;
    UPDATE bcms_risk     SET org_id = new_org_id WHERE id = r.id;
    UPDATE bcms_bcp      SET org_id = new_org_id WHERE id = r.id;
    UPDATE bcms_training SET org_id = new_org_id WHERE id = r.id;
    UPDATE bcms_audit    SET org_id = new_org_id WHERE id = r.id;
    UPDATE bcms_user_data SET org_id = new_org_id WHERE user_id = r.id;
  END LOOP;
END $$;
*/

-- ── 12. 인덱스 ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON org_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org_id  ON org_members(org_id);
CREATE INDEX IF NOT EXISTS idx_org_inv_token        ON org_invitations(token);
CREATE INDEX IF NOT EXISTS idx_org_inv_email        ON org_invitations(email);

-- ── 완료 ────────────────────────────────────────────────────────
SELECT 'BCMS 멀티유저 조직 스키마 생성 완료' AS result;
