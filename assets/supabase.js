/**
 * BCMS Portal – Supabase 연동 레이어
 * CDN: https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2
 *
 * 의존성 로딩 순서 (각 HTML 파일의 <head> 최상단):
 *   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 *   <script src="assets/supabase.js"></script>  ← 이 파일
 */
(function (global) {
  'use strict';

  // ── 설정 ──────────────────────────────────────────────────────
  const SUPABASE_URL     = 'https://otgqizneyzpwqsgdtwzv.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_owe_kg_7eEE16I51QHOFxA_vo4acx4d';

  // ── 공개 페이지 (인증 불필요) ─────────────────────────────────
  const PUBLIC_PAGES = ['auth.html', 'privacy.html', 'terms.html'];
  const isPublicPage = () => PUBLIC_PAGES.some(p => window.location.pathname.includes(p));

  // ── auth.html 리다이렉트 경로 자동 계산 ─────────────────────
  const getAuthPath = () => {
    const depth = (window.location.pathname.match(/\//g) || []).length - 1;
    return '../'.repeat(Math.max(0, depth - 1)) + 'auth.html';
  };

  // ── 캐시 키 ──────────────────────────────────────────────────
  const LS_SESSION_KEY  = 'bcms_supabase_session';
  const LS_USER_KEY     = 'bcms_supabase_user';
  const LS_PROFILE_KEY  = 'bcms_user_profile';

  // localStorage 세션 캐시 (SDK 로드 전 빠른 경로)
  let _cachedSession = null;
  try { _cachedSession = JSON.parse(localStorage.getItem(LS_SESSION_KEY)); } catch {}

  // ── 빠른 인증 게이트 (SDK 로드 대기 없이 즉시 리다이렉트) ──
  if (!isPublicPage() && !_cachedSession) {
    window.location.replace(getAuthPath());
  }

  // ── 클라이언트 초기화 ─────────────────────────────────────────
  let _client = null;

  function getClient() {
    if (_client) return _client;
    if (!global.supabase) {
      console.error('[BCMSAuth] Supabase SDK가 로드되지 않았습니다. CDN 스크립트를 먼저 추가하세요.');
      return null;
    }
    _client = global.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession:    true,
        autoRefreshToken:  true,
        detectSessionInUrl: true
      }
    });
    return _client;
  }

  // ── 인증 API ─────────────────────────────────────────────────
  const BCMSAuth = {
    /** 현재 세션 반환 */
    async getSession() {
      const client = getClient(); if (!client) return null;
      const { data } = await client.auth.getSession();
      const session = data?.session || null;
      if (session) {
        localStorage.setItem(LS_SESSION_KEY, JSON.stringify(session));
        if (session.user) localStorage.setItem(LS_USER_KEY, JSON.stringify(session.user));
      } else {
        localStorage.removeItem(LS_SESSION_KEY);
        localStorage.removeItem(LS_USER_KEY);
      }
      return session;
    },

    /** 현재 사용자 반환 (캐시 우선) */
    getCurrentUser() {
      try { return JSON.parse(localStorage.getItem(LS_USER_KEY)); } catch { return null; }
    },

    /** 이메일 + 비밀번호 로그인 */
    async signIn(email, password) {
      const client = getClient(); if (!client) return { error: { message: 'SDK 초기화 실패' } };
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (!error && data.session) {
        localStorage.setItem(LS_SESSION_KEY, JSON.stringify(data.session));
        localStorage.setItem(LS_USER_KEY, JSON.stringify(data.user));
      }
      return { data, error };
    },

    /** 이메일 + 비밀번호 회원가입 */
    async signUp(email, password, meta = {}) {
      const client = getClient(); if (!client) return { error: { message: 'SDK 초기화 실패' } };
      const { data, error } = await client.auth.signUp({
        email, password,
        options: { data: meta }
      });
      return { data, error };
    },

    /** 로그아웃 */
    async signOut() {
      const client = getClient();
      if (client) await client.auth.signOut();
      localStorage.removeItem(LS_SESSION_KEY);
      localStorage.removeItem(LS_USER_KEY);
      localStorage.removeItem(LS_PROFILE_KEY);
      window.location.replace(getAuthPath());
    },

    /** 인증 상태 변경 리스너 */
    onAuthStateChange(callback) {
      const client = getClient(); if (!client) return;
      return client.auth.onAuthStateChange((event, session) => {
        if (session) {
          localStorage.setItem(LS_SESSION_KEY, JSON.stringify(session));
          localStorage.setItem(LS_USER_KEY, JSON.stringify(session.user));
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem(LS_SESSION_KEY);
          localStorage.removeItem(LS_USER_KEY);
          if (!isPublicPage()) window.location.replace(getAuthPath());
        }
        if (callback) callback(event, session);
      });
    }
  };

  // ── 사용자 프로필 API ─────────────────────────────────────────
  const BCMSProfile = {
    /** 사용자 프로필 조회 */
    async get(userId) {
      const client = getClient(); if (!client) return null;
      const { data, error } = await client
        .from('bcms_users')
        .select('*')
        .eq('id', userId)
        .single();
      if (error && error.code !== 'PGRST116') console.error('[BCMSProfile] get:', error);
      if (data) localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(data));
      return data;
    },

    /** 사용자 프로필 저장/업데이트 (upsert) */
    async save(userId, profile) {
      const client = getClient(); if (!client) return null;
      const { data, error } = await client
        .from('bcms_users')
        .upsert({ id: userId, ...profile, updated_at: new Date().toISOString() })
        .select()
        .single();
      if (error) console.error('[BCMSProfile] save:', error);
      if (data) {
        localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(data));
        if (data.company_name) localStorage.setItem('bcmsCompanyName', data.company_name);
        if (data.industry)     localStorage.setItem('bcmsIndustry',    data.industry);
      }
      return data;
    },

    /** 캐시에서 프로필 반환 */
    getCached() {
      try { return JSON.parse(localStorage.getItem(LS_PROFILE_KEY)); } catch { return null; }
    }
  };

  // ── 데이터 동기화 API ─────────────────────────────────────────
  // localStorage 키 → Supabase 테이블·컬럼 매핑
  const DATA_KEY_MAP = {
    // 전용 테이블 사용
    bcmsBIAData:           { table: 'bcms_bia',      col: 'data' },
    bcmsRiskAssessment:    { table: 'bcms_risk',     col: 'data' },
    bcmsBCP:               { table: 'bcms_bcp',      col: 'data' },
    bcmsBCPMeta:           { table: 'bcms_bcp',      col: 'meta' },
    bcmsTrainingData:      { table: 'bcms_training', col: 'data' },
    bcmsAuditData:         { table: 'bcms_audit',    col: 'data' },
    // bcms_user_data 범용 테이블 사용
    bcmsCoreFunctions:     { table: 'bcms_user_data', key: 'coreFunctions' },
    bcmsIncidents:         { table: 'bcms_user_data', key: 'incidents' },
    bcmsIncidentExecution: { table: 'bcms_user_data', key: 'incidentExecution' },
    bcmsCapaItems:         { table: 'bcms_user_data', key: 'capaItems' },
    bcmsEvidenceItems:     { table: 'bcms_user_data', key: 'evidenceItems' },
    bcms_org_registry_v1:  { table: 'bcms_user_data', key: 'orgRegistry' },
    bcms_service_registry_v1: { table: 'bcms_user_data', key: 'serviceRegistry' },
    bcmsGapAnalysis:       { table: 'bcms_user_data', key: 'gapAnalysis' },
    bcmsDisasterReduction: { table: 'bcms_user_data', key: 'disasterReduction' },
    bcmsPriorityConfirmed: { table: 'bcms_user_data', key: 'priorityConfirmed' },
    bcmsMBCOData:          { table: 'bcms_user_data', key: 'mbcoData' },
    bcmsEducationProgress: { table: 'bcms_user_data', key: 'educationProgress' },
    bcms_eop_role_mapping_v1: { table: 'bcms_user_data', key: 'eopRoleMapping' },
    bcmsRiskList:          { table: 'bcms_user_data', key: 'riskList' }
  };

  const BCMSSync = {
    /** Supabase → localStorage (로그인 후 최초 데이터 로드) */
    async pull(userId) {
      const client = getClient(); if (!client) return;
      const errors = [];

      // 전용 테이블 조회
      const dedicatedTables = ['bcms_bia','bcms_risk','bcms_bcp','bcms_training','bcms_audit'];
      for (const table of dedicatedTables) {
        try {
          const { data, error } = await client.from(table).select('*').eq('id', userId).single();
          if (error && error.code !== 'PGRST116') { errors.push({ table, error }); continue; }
          if (!data) continue;
          // localStorage로 복원
          for (const [lsKey, mapping] of Object.entries(DATA_KEY_MAP)) {
            if (mapping.table === table && data[mapping.col] != null) {
              localStorage.setItem(lsKey, JSON.stringify(data[mapping.col]));
            }
          }
        } catch (e) { errors.push({ table, error: e }); }
      }

      // 범용 테이블 조회
      try {
        const { data, error } = await client
          .from('bcms_user_data')
          .select('key, value')
          .eq('user_id', userId);
        if (error) { errors.push({ table: 'bcms_user_data', error }); }
        else if (data) {
          for (const row of data) {
            const lsKey = Object.entries(DATA_KEY_MAP).find(([, m]) => m.key === row.key)?.[0];
            if (lsKey && row.value != null) localStorage.setItem(lsKey, JSON.stringify(row.value));
          }
        }
      } catch (e) { errors.push({ table: 'bcms_user_data', error: e }); }

      if (errors.length) console.warn('[BCMSSync] pull 일부 실패:', errors);
      console.log('[BCMSSync] 데이터 로드 완료');
    },

    /** localStorage → Supabase (특정 키 저장) */
    async pushKey(userId, lsKey) {
      const client   = getClient(); if (!client) return;
      const mapping  = DATA_KEY_MAP[lsKey];
      if (!mapping) return; // 매핑 없으면 무시

      let value;
      try { value = JSON.parse(localStorage.getItem(lsKey)); } catch { return; }
      if (value === null || value === undefined) return;

      try {
        if (mapping.table === 'bcms_user_data') {
          await client.from('bcms_user_data').upsert(
            { user_id: userId, key: mapping.key, value, updated_at: new Date().toISOString() },
            { onConflict: 'user_id,key' }
          );
        } else {
          // 전용 테이블: 현재 레코드를 읽어서 해당 컬럼만 업데이트
          const update = { id: userId, [mapping.col]: value, updated_at: new Date().toISOString() };
          await client.from(mapping.table).upsert(update, { onConflict: 'id' });
        }
      } catch (e) { console.error('[BCMSSync] pushKey 실패:', lsKey, e); }
    },

    /** localStorage 전체 → Supabase (로그인/세션 복구 시) */
    async pushAll(userId) {
      const client = getClient(); if (!client) return;
      const kvBatch = [];
      const tableBatch = {};

      for (const [lsKey, mapping] of Object.entries(DATA_KEY_MAP)) {
        let value;
        try { value = JSON.parse(localStorage.getItem(lsKey)); } catch { continue; }
        if (value === null || value === undefined) continue;

        if (mapping.table === 'bcms_user_data') {
          kvBatch.push({ user_id: userId, key: mapping.key, value, updated_at: new Date().toISOString() });
        } else {
          if (!tableBatch[mapping.table]) tableBatch[mapping.table] = { id: userId, updated_at: new Date().toISOString() };
          tableBatch[mapping.table][mapping.col] = value;
        }
      }

      // 전용 테이블 배치 저장
      for (const [table, row] of Object.entries(tableBatch)) {
        try { await client.from(table).upsert(row, { onConflict: 'id' }); }
        catch (e) { console.error('[BCMSSync] pushAll 테이블 실패:', table, e); }
      }

      // 범용 테이블 배치 저장
      if (kvBatch.length) {
        try { await client.from('bcms_user_data').upsert(kvBatch, { onConflict: 'user_id,key' }); }
        catch (e) { console.error('[BCMSSync] pushAll kv 실패:', e); }
      }

      console.log('[BCMSSync] 전체 데이터 업로드 완료');
    }
  };

  // ── DataStore.set 후킹 (저장 시 자동 Supabase 동기화) ────────
  function hookDataStore() {
    if (!global.DataStore) return;
    const originalSet = global.DataStore.set;
    global.DataStore.set = function (key, value) {
      const result = originalSet(key, value);
      const user   = BCMSAuth.getCurrentUser();
      if (user && DATA_KEY_MAP[key]) {
        // 비동기 fire-and-forget (UI를 블로킹하지 않음)
        BCMSSync.pushKey(user.id, key).catch(() => {});
      }
      return result;
    };
  }

  // ── 사이드바 사용자 정보 주입 ─────────────────────────────────
  function injectUserBar() {
    const user    = BCMSAuth.getCurrentUser();
    const profile = BCMSProfile.getCached();
    if (!user) return;

    const displayName = profile?.company_name || user.email || '사용자';

    const style = document.createElement('style');
    style.textContent = `
      .bcmsUserBar {
        display: flex; align-items: center; justify-content: space-between;
        padding: 8px 14px; margin: 0 0 4px;
        background: rgba(0,112,243,.06);
        border-bottom: 0.5px solid rgba(0,112,243,.12);
        font-size: 11px; color: var(--text-2, #64748b);
        gap: 8px;
      }
      .bcmsUserBar-name { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
      .bcmsUserBar-logout {
        font-size: 10px; font-weight: 600; color: #dc2626;
        background: none; border: none; cursor: pointer;
        padding: 2px 6px; border-radius: 4px;
        font-family: inherit; flex-shrink: 0;
        opacity: .7; transition: opacity .12s;
      }
      .bcmsUserBar-logout:hover { opacity: 1; background: rgba(220,38,38,.08); }
    `;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.className = 'bcmsUserBar';
    bar.innerHTML = `<span class="bcmsUserBar-name">👤 ${displayName}</span><button class="bcmsUserBar-logout" id="bcmsLogoutBtn">로그아웃</button>`;

    function tryInsert() {
      const sidebar = document.querySelector('.sidebar');
      if (!sidebar) return false;
      sidebar.insertBefore(bar, sidebar.firstChild);
      document.getElementById('bcmsLogoutBtn')?.addEventListener('click', () => BCMSAuth.signOut());
      return true;
    }

    if (!tryInsert()) document.addEventListener('DOMContentLoaded', tryInsert);
  }

  // ── 보안 배지 텍스트 업데이트 ────────────────────────────────
  function updateSecurityBadge() {
    const textEl = document.querySelector('.sidebar-security-text');
    const descEl = document.querySelector('.sidebar-security-desc');
    if (textEl) textEl.textContent = '클라우드 암호화 저장 · TLS 전송';
    if (descEl) descEl.textContent = '데이터는 AES-256 암호화로 서버에 저장되며, TLS로 전송됩니다. 귀사 데이터는 타 기업과 완전히 격리됩니다.';

    const dashBadge = document.querySelector('.dashSecurityMsg');
    if (dashBadge) dashBadge.textContent = '모든 데이터는 AES-256 암호화하여 저장되며, TLS 암호화 프로토콜로 전송됩니다. 인프라는 SOC 2 Type 2 인증 AWS 서버를 사용합니다.';
  }

  // ── 초기화 ────────────────────────────────────────────────────
  async function init() {
    if (isPublicPage()) return; // auth.html 등은 초기화 스킵

    const client = getClient();
    if (!client) return;

    // 세션 검증
    const session = await BCMSAuth.getSession();
    if (!session) {
      window.location.replace(getAuthPath());
      return;
    }

    const userId = session.user.id;

    // 프로필 로드
    const profile = await BCMSProfile.get(userId);

    // 기존 localStorage 데이터가 없으면 Supabase에서 로드
    const hasBiaData = !!localStorage.getItem('bcmsBIAData');
    if (!hasBiaData) {
      await BCMSSync.pull(userId);
    }

    // DataStore 후킹 (저장 자동 동기화)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => { hookDataStore(); injectUserBar(); updateSecurityBadge(); });
    } else {
      hookDataStore(); injectUserBar(); updateSecurityBadge();
    }

    // 세션 만료 모니터링
    BCMSAuth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') window.location.replace(getAuthPath());
    });
  }

  // ── 공개 API ─────────────────────────────────────────────────
  global.BCMSAuth    = BCMSAuth;
  global.BCMSProfile = BCMSProfile;
  global.BCMSSync    = BCMSSync;

  // 페이지 로드 시 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window);
