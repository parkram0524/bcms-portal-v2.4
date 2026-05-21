/**
 * BCMS Portal – Supabase 연동 레이어 (멀티유저 조직 지원)
 * CDN: https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2
 */
(function (global) {
  'use strict';

  const SUPABASE_URL      = 'https://otgqizneyzpwqsgdtwzv.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_owe_kg_7eEE16I51QHOFxA_vo4acx4d';

  const PUBLIC_PAGES  = ['auth.html', 'privacy.html', 'terms.html'];
  const isPublicPage  = () => PUBLIC_PAGES.some(p => window.location.pathname.includes(p));

  const _SUBDIRS = ['admin','governance','risk-bia','strategy-plans','op-center',
                    'library','training','audit','reports','education'];
  const getAuthPath = () => {
    const inSub = _SUBDIRS.some(d => window.location.pathname.includes('/' + d + '/'));
    return (inSub ? '../' : '') + 'auth.html';
  };

  // ── 캐시 키 ──────────────────────────────────────────────────
  const LS_SESSION_KEY = 'bcms_supabase_session';
  const LS_USER_KEY    = 'bcms_supabase_user';
  const LS_PROFILE_KEY = 'bcms_user_profile';
  const LS_ORG_KEY     = 'bcms_org';        // { id, name, industry, cert_goal }
  const LS_MEMBER_KEY  = 'bcms_org_member'; // { org_id, role, department }

  let _cachedSession = null;
  try { _cachedSession = JSON.parse(localStorage.getItem(LS_SESSION_KEY)); } catch {}

  // 빠른 인증 게이트
  if (!isPublicPage() && !_cachedSession) {
    window.location.replace(getAuthPath());
  }

  // ── 클라이언트 ───────────────────────────────────────────────
  let _client = null;
  function getClient() {
    if (_client) return _client;
    if (!global.supabase) { console.error('[BCMS] Supabase SDK 미로드'); return null; }
    _client = global.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    return _client;
  }

  // ── BCMSAuth ─────────────────────────────────────────────────
  const BCMSAuth = {
    async getSession() {
      const c = getClient(); if (!c) return null;
      const { data } = await c.auth.getSession();
      const s = data?.session || null;
      if (s) {
        localStorage.setItem(LS_SESSION_KEY, JSON.stringify(s));
        if (s.user) localStorage.setItem(LS_USER_KEY, JSON.stringify(s.user));
      } else {
        localStorage.removeItem(LS_SESSION_KEY);
        localStorage.removeItem(LS_USER_KEY);
      }
      return s;
    },
    getCurrentUser() {
      try { return JSON.parse(localStorage.getItem(LS_USER_KEY)); } catch { return null; }
    },
    async signIn(email, password) {
      const c = getClient(); if (!c) return { error: { message: 'SDK 초기화 실패' } };
      const { data, error } = await c.auth.signInWithPassword({ email, password });
      if (!error && data.session) {
        localStorage.setItem(LS_SESSION_KEY, JSON.stringify(data.session));
        localStorage.setItem(LS_USER_KEY,    JSON.stringify(data.user));
      }
      return { data, error };
    },
    async signUp(email, password, meta = {}) {
      const c = getClient(); if (!c) return { error: { message: 'SDK 초기화 실패' } };
      return c.auth.signUp({ email, password, options: { data: meta } });
    },
    async signOut() {
      const c = getClient();
      if (c) await c.auth.signOut();
      [LS_SESSION_KEY, LS_USER_KEY, LS_PROFILE_KEY, LS_ORG_KEY, LS_MEMBER_KEY]
        .forEach(k => localStorage.removeItem(k));
      window.location.replace(getAuthPath());
    },
    onAuthStateChange(cb) {
      const c = getClient(); if (!c) return;
      return c.auth.onAuthStateChange((event, session) => {
        if (session) {
          localStorage.setItem(LS_SESSION_KEY, JSON.stringify(session));
          localStorage.setItem(LS_USER_KEY,    JSON.stringify(session.user));
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem(LS_SESSION_KEY);
          localStorage.removeItem(LS_USER_KEY);
          if (!isPublicPage()) window.location.replace(getAuthPath());
        }
        if (cb) cb(event, session);
      });
    }
  };

  // ── BCMSProfile ──────────────────────────────────────────────
  const BCMSProfile = {
    async get(userId) {
      const c = getClient(); if (!c) return null;
      const { data, error } = await c.from('bcms_users').select('*').eq('id', userId).single();
      if (error && error.code !== 'PGRST116') console.error('[BCMSProfile] get:', error);
      if (data) localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(data));
      return data;
    },
    async save(profile) {
      const c = getClient(); if (!c) return null;
      const user = BCMSAuth.getCurrentUser();
      if (!user) return null;
      const payload = { id: user.id, ...profile, updated_at: new Date().toISOString() };
      const { data, error } = await c.from('bcms_users').upsert(payload).select().single();
      if (error) console.error('[BCMSProfile] save:', error);
      if (data) {
        localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(data));
        if (data.company_name) localStorage.setItem('bcmsCompanyName', data.company_name);
        if (data.industry)     localStorage.setItem('bcmsIndustry',    data.industry);
      }
      return data;
    },
    getCached() {
      try { return JSON.parse(localStorage.getItem(LS_PROFILE_KEY)); } catch { return null; }
    }
  };

  // ── BCMSOrg ──────────────────────────────────────────────────
  const BCMSOrg = {
    /** 현재 사용자의 조직 + 역할 로드 */
    async loadMyOrg(userId) {
      const c = getClient(); if (!c) return null;
      const { data, error } = await c
        .from('org_members')
        .select('org_id, role, department, organizations(id, name, industry, cert_goal, created_by)')
        .eq('user_id', userId)
        .single();
      if (error && error.code !== 'PGRST116') console.error('[BCMSOrg] loadMyOrg:', error);
      if (!data) return null;
      const org    = data.organizations;
      const member = { org_id: data.org_id, role: data.role, department: data.department };
      localStorage.setItem(LS_ORG_KEY,    JSON.stringify(org));
      localStorage.setItem(LS_MEMBER_KEY, JSON.stringify(member));
      return { org, member };
    },

    /** 캐시에서 조직 정보 반환 */
    getCached() {
      let org    = null; try { org    = JSON.parse(localStorage.getItem(LS_ORG_KEY));    } catch {}
      let member = null; try { member = JSON.parse(localStorage.getItem(LS_MEMBER_KEY)); } catch {}
      return { org, member };
    },

    /** 현재 사용자 역할 반환 ('admin' | 'editor' | 'viewer' | null) */
    getRole() {
      try { return JSON.parse(localStorage.getItem(LS_MEMBER_KEY))?.role || null; } catch { return null; }
    },

    /** 새 조직 생성 (가입자를 admin으로 등록) */
    async create(userId, { name, industry = '', cert_goal = '' }) {
      const c = getClient(); if (!c) return { error: 'SDK 없음' };
      const { data: org, error: orgErr } = await c
        .from('organizations')
        .insert({ name, industry, cert_goal, created_by: userId })
        .select().single();
      if (orgErr) return { error: orgErr };

      const { error: memErr } = await c
        .from('org_members')
        .insert({ org_id: org.id, user_id: userId, role: 'admin' });
      if (memErr) return { error: memErr };

      // bcms_users에 org_id 연결
      await c.from('bcms_users').upsert({ id: userId, org_id: org.id, updated_at: new Date().toISOString() });

      localStorage.setItem(LS_ORG_KEY,    JSON.stringify(org));
      localStorage.setItem(LS_MEMBER_KEY, JSON.stringify({ org_id: org.id, role: 'admin', department: '' }));
      return { org };
    },

    /** 조직 정보 수정 (admin 전용) */
    async update(orgId, updates) {
      const c = getClient(); if (!c) return { error: 'SDK 없음' };
      const { data, error } = await c
        .from('organizations')
        .update(updates)
        .eq('id', orgId)
        .select().single();
      if (!error && data) localStorage.setItem(LS_ORG_KEY, JSON.stringify(data));
      return { data, error };
    },

    /** 멤버 목록 조회 (org_id 기준, auth.users 이메일 포함) */
    async getMembers(orgId) {
      const c = getClient(); if (!c) return [];
      const { data, error } = await c
        .from('org_members')
        .select('user_id, role, department, joined_at, bcms_users(company_name)')
        .eq('org_id', orgId);
      if (error) { console.error('[BCMSOrg] getMembers:', error); return []; }
      return data || [];
    },

    /** 초대장 생성 (이메일 발송은 Supabase Edge Function 또는 앱 레이어에서 처리) */
    async inviteMember(orgId, email, role = 'editor', department = '') {
      const c = getClient(); if (!c) return { error: 'SDK 없음' };
      const user = BCMSAuth.getCurrentUser();
      const { data, error } = await c
        .from('org_invitations')
        .insert({ org_id: orgId, email, role, department, invited_by: user?.id })
        .select().single();
      return { data, error };
    },

    /** 초대 토큰으로 조직 가입 */
    async acceptInvite(token, userId) {
      const c = getClient(); if (!c) return { error: 'SDK 없음' };

      // 토큰 조회
      const { data: inv, error: invErr } = await c
        .from('org_invitations')
        .select('*')
        .eq('token', token)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString())
        .single();
      if (invErr || !inv) return { error: '유효하지 않거나 만료된 초대 링크입니다.' };

      // 멤버 등록
      const { error: memErr } = await c
        .from('org_members')
        .upsert({ org_id: inv.org_id, user_id: userId, role: inv.role, department: inv.department, invited_by: inv.invited_by });
      if (memErr) return { error: memErr };

      // 토큰 만료 처리
      await c.from('org_invitations').update({ accepted_at: new Date().toISOString() }).eq('id', inv.id);

      // bcms_users에 org_id 연결
      await c.from('bcms_users').upsert({ id: userId, org_id: inv.org_id, updated_at: new Date().toISOString() });

      return { org_id: inv.org_id, role: inv.role };
    },

    /** 멤버 역할 변경 (admin 전용) */
    async changeRole(orgId, targetUserId, newRole) {
      const c = getClient(); if (!c) return { error: 'SDK 없음' };
      return c.from('org_members')
        .update({ role: newRole })
        .eq('org_id', orgId)
        .eq('user_id', targetUserId);
    },

    /** 멤버 제거 (admin 전용, 또는 본인 탈퇴) */
    async removeMember(orgId, targetUserId) {
      const c = getClient(); if (!c) return { error: 'SDK 없음' };
      return c.from('org_members')
        .delete()
        .eq('org_id', orgId)
        .eq('user_id', targetUserId);
    },

    /** 초대 목록 조회 */
    async getInvitations(orgId) {
      const c = getClient(); if (!c) return [];
      const { data } = await c
        .from('org_invitations')
        .select('id, email, role, department, expires_at, accepted_at, created_at')
        .eq('org_id', orgId)
        .is('accepted_at', null)
        .order('created_at', { ascending: false });
      return data || [];
    },

    /** 초대 취소 */
    async cancelInvitation(invId) {
      const c = getClient();
      if (!c) return { error: new Error('Supabase 클라이언트 없음') };
      const { error } = await c.from('org_invitations').delete().eq('id', invId);
      return { error: error || null };
    }
  };

  // ── BCMSPerm (권한 헬퍼) ─────────────────────────────────────
  const BCMSPerm = {
    /** 현재 역할이 편집 가능한지 */
    canEdit() {
      const role = BCMSOrg.getRole();
      return role === 'admin' || role === 'editor' || role === null; // null = 개인 모드
    },
    /** 현재 역할이 admin인지 */
    isAdmin() { return BCMSOrg.getRole() === 'admin'; },

    /** viewer이면 페이지 내 모든 저장 버튼을 비활성화 */
    applyViewerLock() {
      if (this.canEdit()) return;
      document.querySelectorAll(
        'button.btn.primary, button[id*="Save"], button[id*="save"], button[id*="Add"], button[id*="add"], .btn.primary'
      ).forEach(btn => {
        btn.disabled = true;
        btn.title    = '조회 권한만 있습니다. 관리자에게 문의하세요.';
        btn.style.opacity = '0.4';
      });
      // 입력 필드 비활성화
      document.querySelectorAll('input:not([type=search]):not([type=text][id*="filter"]):not([id*="search"]), select, textarea')
        .forEach(el => {
          if (el.closest('.filterBar') || el.closest('#fSearch')) return;
          el.disabled = true;
        });
      // 뱃지 주입
      const bar = document.querySelector('.pageHeader, .wrap > .kpiGrid, .wrap > div:first-child');
      if (bar) {
        const badge = document.createElement('div');
        badge.style.cssText = 'display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:rgba(245,158,11,.1);border:0.5px solid rgba(245,158,11,.3);border-radius:8px;font-size:12px;font-weight:600;color:#92400e;margin-bottom:12px;';
        badge.textContent = '👁 조회 전용 모드 — 데이터 수정 권한이 없습니다.';
        bar.parentElement?.insertBefore(badge, bar);
      }
    }
  };

  // ── BCMSSync ─────────────────────────────────────────────────
  const DATA_KEY_MAP = {
    bcmsBIAData:              { table: 'bcms_bia',       col: 'data' },
    bcmsRiskAssessment:       { table: 'bcms_risk',      col: 'data' },
    bcmsBCP:                  { table: 'bcms_bcp',       col: 'data' },
    bcmsBCPMeta:              { table: 'bcms_bcp',       col: 'meta' },
    bcmsTrainingData:         { table: 'bcms_training',  col: 'data' },
    bcmsAuditData:            { table: 'bcms_audit',     col: 'data' },
    bcmsCoreFunctions:        { table: 'bcms_user_data', key: 'coreFunctions' },
    bcmsIncidents:            { table: 'bcms_user_data', key: 'incidents' },
    bcmsIncidentExecution:    { table: 'bcms_user_data', key: 'incidentExecution' },
    bcmsCapaItems:            { table: 'bcms_user_data', key: 'capaItems' },
    bcmsEvidenceItems:        { table: 'bcms_user_data', key: 'evidenceItems' },
    bcms_org_registry_v1:     { table: 'bcms_user_data', key: 'orgRegistry' },
    bcms_service_registry_v1: { table: 'bcms_user_data', key: 'serviceRegistry' },
    bcmsGapAnalysis:          { table: 'bcms_user_data', key: 'gapAnalysis' },
    bcmsDisasterReduction:    { table: 'bcms_user_data', key: 'disasterReduction' },
    bcmsPriorityConfirmed:    { table: 'bcms_user_data', key: 'priorityConfirmed' },
    bcmsMBCOData:             { table: 'bcms_user_data', key: 'mbcoData' },
    bcmsEducationProgress:    { table: 'bcms_user_data', key: 'educationProgress' },
    bcms_eop_role_mapping_v1: { table: 'bcms_user_data', key: 'eopRoleMapping' },
    bcmsRiskList:             { table: 'bcms_user_data', key: 'riskList' }
  };

  const BCMSSync = {
    /** Supabase → localStorage */
    async pull(userId, orgId) {
      const c = getClient(); if (!c) return;
      const errors = [];

      // 전용 테이블: org_id 우선, 없으면 user id 기준
      for (const table of ['bcms_bia','bcms_risk','bcms_bcp','bcms_training','bcms_audit']) {
        try {
          let q = c.from(table).select('*');
          q = orgId ? q.eq('org_id', orgId) : q.eq('id', userId);
          const { data, error } = await q.maybeSingle();
          if (error) { errors.push({ table, error }); continue; }
          if (!data) continue;
          for (const [lsKey, m] of Object.entries(DATA_KEY_MAP)) {
            if (m.table === table && data[m.col] != null)
              localStorage.setItem(lsKey, JSON.stringify(data[m.col]));
          }
        } catch (e) { errors.push({ table, error: e }); }
      }

      // 범용 테이블
      try {
        let q = c.from('bcms_user_data').select('key, value');
        q = orgId ? q.eq('org_id', orgId) : q.eq('user_id', userId);
        const { data, error } = await q;
        if (error) { errors.push({ table: 'bcms_user_data', error }); }
        else if (data) {
          for (const row of data) {
            const lsKey = Object.entries(DATA_KEY_MAP).find(([, m]) => m.key === row.key)?.[0];
            if (lsKey && row.value != null) localStorage.setItem(lsKey, JSON.stringify(row.value));
          }
        }
      } catch (e) { errors.push({ table: 'bcms_user_data', error: e }); }

      if (errors.length) console.warn('[BCMSSync] pull 일부 실패:', errors);
    },

    /** localStorage → Supabase (단일 키) */
    async pushKey(userId, lsKey) {
      if (!BCMSPerm.canEdit()) return; // viewer는 쓰기 차단
      const c = getClient(); if (!c) return;
      const mapping = DATA_KEY_MAP[lsKey]; if (!mapping) return;

      let value;
      try { value = JSON.parse(localStorage.getItem(lsKey)); } catch { return; }
      if (value === null || value === undefined) return;

      const { member } = BCMSOrg.getCached();
      const orgId = member?.org_id || null;

      try {
        if (mapping.table === 'bcms_user_data') {
          const row = { user_id: userId, key: mapping.key, value, updated_at: new Date().toISOString() };
          if (orgId) row.org_id = orgId;
          await c.from('bcms_user_data').upsert(row, { onConflict: 'user_id,key' });
        } else {
          const row = { id: userId, [mapping.col]: value, updated_at: new Date().toISOString() };
          if (orgId) row.org_id = orgId;
          await c.from(mapping.table).upsert(row, { onConflict: 'id' });
        }
      } catch (e) { console.error('[BCMSSync] pushKey 실패:', lsKey, e); }
    },

    async pushAll(userId) {
      if (!BCMSPerm.canEdit()) return;
      const c = getClient(); if (!c) return;
      const { member } = BCMSOrg.getCached();
      const orgId = member?.org_id || null;
      const kvBatch = [];
      const tableBatch = {};

      for (const [lsKey, m] of Object.entries(DATA_KEY_MAP)) {
        let value;
        try { value = JSON.parse(localStorage.getItem(lsKey)); } catch { continue; }
        if (value === null || value === undefined) continue;

        if (m.table === 'bcms_user_data') {
          const row = { user_id: userId, key: m.key, value, updated_at: new Date().toISOString() };
          if (orgId) row.org_id = orgId;
          kvBatch.push(row);
        } else {
          if (!tableBatch[m.table]) tableBatch[m.table] = { id: userId, updated_at: new Date().toISOString() };
          tableBatch[m.table][m.col] = value;
          if (orgId) tableBatch[m.table].org_id = orgId;
        }
      }

      for (const [table, row] of Object.entries(tableBatch)) {
        try { await c.from(table).upsert(row, { onConflict: 'id' }); }
        catch (e) { console.error('[BCMSSync] pushAll 테이블 실패:', table, e); }
      }
      if (kvBatch.length) {
        try { await c.from('bcms_user_data').upsert(kvBatch, { onConflict: 'user_id,key' }); }
        catch (e) { console.error('[BCMSSync] pushAll kv 실패:', e); }
      }
    }
  };

  // ── DataStore 후킹 ───────────────────────────────────────────
  function hookDataStore() {
    if (!global.DataStore) return;
    const orig = global.DataStore.set;
    global.DataStore.set = function (key, value) {
      const result = orig(key, value);
      const user   = BCMSAuth.getCurrentUser();
      if (user && DATA_KEY_MAP[key]) BCMSSync.pushKey(user.id, key).catch(() => {});
      return result;
    };
  }

  // ── 사이드바 사용자/역할 칩 ──────────────────────────────────
  function injectUserBar() {
    const user    = BCMSAuth.getCurrentUser();
    const profile = BCMSProfile.getCached();
    const { member } = BCMSOrg.getCached();
    if (!user) return;

    const displayName = profile?.company_name || user.email || '사용자';
    const roleLabel   = { admin: '관리자', editor: '편집자', viewer: '조회자' }[member?.role] || '';
    const roleCls     = { admin: '#0070f3', editor: '#16a34a', viewer: '#94a3b8' }[member?.role] || '#94a3b8';

    const style = document.createElement('style');
    style.textContent = `
      .bcmsUserBar { display:flex;align-items:center;justify-content:space-between;padding:8px 14px;margin:0 0 4px;background:rgba(0,112,243,.06);border-bottom:0.5px solid rgba(0,112,243,.12);font-size:11px;color:var(--text-2,#64748b);gap:8px; }
      .bcmsUserBar-info { display:flex;flex-direction:column;gap:2px;overflow:hidden;flex:1; }
      .bcmsUserBar-name { font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
      .bcmsUserBar-role { font-size:10px; }
      .bcmsUserBar-logout { font-size:10px;font-weight:600;color:#dc2626;background:none;border:none;cursor:pointer;padding:2px 6px;border-radius:4px;font-family:inherit;flex-shrink:0;opacity:.7;transition:opacity .12s; }
      .bcmsUserBar-logout:hover { opacity:1;background:rgba(220,38,38,.08); }
    `;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.className = 'bcmsUserBar';
    bar.innerHTML = `
      <div class="bcmsUserBar-info">
        <span class="bcmsUserBar-name">👤 ${displayName}</span>
        ${roleLabel ? `<span class="bcmsUserBar-role" style="color:${roleCls}">${roleLabel}</span>` : ''}
      </div>
      <button class="bcmsUserBar-logout" id="bcmsLogoutBtn">로그아웃</button>`;

    function tryInsert() {
      const sb = document.querySelector('.sidebar');
      if (!sb) return false;
      sb.insertBefore(bar, sb.firstChild);
      document.getElementById('bcmsLogoutBtn')?.addEventListener('click', () => BCMSAuth.signOut());
      return true;
    }
    if (!tryInsert()) document.addEventListener('DOMContentLoaded', tryInsert);
  }

  // ── 보안 배지 업데이트 ───────────────────────────────────────
  function updateSecurityBadge() {
    const textEl = document.querySelector('.sidebar-security-text');
    const descEl = document.querySelector('.sidebar-security-desc');
    if (textEl) textEl.textContent = '클라우드 암호화 저장 · TLS 전송';
    if (descEl) descEl.textContent = '데이터는 AES-256 암호화로 서버에 저장되며 TLS로 전송됩니다. 귀사 데이터는 타 기업과 완전히 격리됩니다.';
    const dashBadge = document.querySelector('.dashSecurityMsg');
    if (dashBadge) dashBadge.textContent = '모든 데이터는 AES-256 암호화하여 저장되며, TLS 암호화 프로토콜로 전송됩니다.';
  }

  // ── 초기화 ───────────────────────────────────────────────────
  async function init() {
    if (isPublicPage()) return;
    const c = getClient(); if (!c) return;

    const session = await BCMSAuth.getSession();
    if (!session) { window.location.replace(getAuthPath()); return; }

    const userId = session.user.id;

    // 프로필 + 조직 로드
    const [profile, orgCtx] = await Promise.all([
      BCMSProfile.get(userId),
      BCMSOrg.loadMyOrg(userId)
    ]);

    const orgId = orgCtx?.member?.org_id || null;

    // 조직 업종 상속: 개인 업종 미설정 시 조직 업종 자동 적용 (초대 가입 등)
    if (orgCtx?.org?.industry && !profile?.industry) {
      const updated = { ...(profile || {}), industry: orgCtx.org.industry };
      localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(updated));
      localStorage.setItem('bcmsIndustry', orgCtx.org.industry);
    }

    // 데이터 없으면 Supabase에서 pull
    if (!localStorage.getItem('bcmsBIAData')) {
      await BCMSSync.pull(userId, orgId);
    }

    const run = () => {
      hookDataStore();
      injectUserBar();
      updateSecurityBadge();
      BCMSPerm.applyViewerLock();
      // 프로필·조직 로드 완료 → 같은 탭의 대시보드 재렌더 트리거
      window.dispatchEvent(new CustomEvent('bcms:ready'));
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }

    BCMSAuth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') window.location.replace(getAuthPath());
    });
  }

  // ── 공개 API ─────────────────────────────────────────────────
  global.BCMSAuth    = BCMSAuth;
  global.BCMSProfile = BCMSProfile;
  global.BCMSOrg     = BCMSOrg;
  global.BCMSPerm    = BCMSPerm;
  global.BCMSSync    = BCMSSync;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window);
