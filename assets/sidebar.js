(function () {
  // =========================================================
  // 프로젝트 서브디렉토리 감지 (Live Server / file:// / 일반 서버 모두 동작)
  // 슬래시 개수 대신 알려진 서브디렉토리명으로 판별:
  //   /index.html          → inSubDir=false → prefix=''
  //   /admin/index.html    → inSubDir=true  → prefix='../'
  //   file:///...../admin/index.html → inSubDir=true → prefix='../'
  // =========================================================
  const _SUBDIRS = ['admin','governance','risk-bia','strategy-plans','op-center',
                    'library','training','audit','reports','education'];
  const _inSubDir = _SUBDIRS.some(d => window.location.pathname.includes('/' + d + '/'));
  const _relPrefix = _inSubDir ? '../' : '';

  // =========================================================
  // ✅ Supabase 인증 게이트 (빠른 경로 – SDK 없이 localStorage 확인)
  // =========================================================
  (function authGate() {
    const PUBLIC_PAGES = ['auth.html', 'privacy.html', 'terms.html'];
    const isPublic = PUBLIC_PAGES.some(p => window.location.pathname.includes(p));
    if (isPublic) return;
    try {
      const session = localStorage.getItem('bcms_supabase_session');
      if (!session) {
        window.location.replace(_relPrefix + 'auth.html');
      }
    } catch (e) { /* localStorage 사용 불가 환경에서는 통과 */ }
  })();

  // =========================================================
  // ✅ Supabase SDK + supabase.js 동적 주입
  // =========================================================
  (function injectSupabase() {
    const PUBLIC_PAGES = ['auth.html', 'privacy.html', 'terms.html'];
    if (PUBLIC_PAGES.some(p => window.location.pathname.includes(p))) return;
    if (document.querySelector('script[data-bcms-supabase]')) return; // 이미 주입됨

    const cdn = document.createElement('script');
    cdn.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    cdn.setAttribute('data-bcms-supabase', 'cdn');
    cdn.onload = function () {
      const s = document.createElement('script');
      s.src = _relPrefix + 'assets/supabase.js';
      s.setAttribute('data-bcms-supabase', 'init');
      document.head.appendChild(s);
    };
    cdn.onerror = function () {
      console.error('[BCMS] Supabase CDN 로드 실패. 네트워크를 확인하세요.');
    };
    document.head.appendChild(cdn);
  })();

  // =========================================================
  // ✅ Deploy-safe base prefix
  // - Netlify root:      /governance/index.html
  // - GitHub Pages repo: /BCMS-PORTAL-V2/governance/index.html
  // =========================================================
  const path = window.location.pathname || "/";
  const m = path.match(/^(\/[^\/]+)(?=\/(governance|risk-bia|strategy-plans|op-center|library|training|audit|admin|reports|education)\/)/);
  const BASE = m ? m[1] : ""; // e.g. "/BCMS-PORTAL-V2" or ""
  const H = (p) => `${BASE}${p}`;

  // ── 사이드바 배지용 등록 건수 (로컬스토리지 즉시 읽기) ──
  const _biaCount = (() => {
    try {
      const d = JSON.parse(localStorage.getItem('bcmsBIAData') || '[]');
      return Array.isArray(d) ? d.flatMap(t => t.functions || []).length : 0;
    } catch(e) { return 0; }
  })();
  const _riskCount = (() => {
    try {
      const ra = JSON.parse(localStorage.getItem('bcmsRiskAssessment') || '[]');
      const rl = JSON.parse(localStorage.getItem('bcmsRiskList') || '[]');
      const a  = Array.isArray(ra) ? ra.flatMap(t => t.risks || []).length : 0;
      const b  = Array.isArray(rl) ? rl.length : 0;
      return a || b;
    } catch(e) { return 0; }
  })();

  const sidebarHTML = `
  <div class="sidebar">

    <!-- ✅ 상단 타이틀 클릭 → BCMS 대시보드로 이동 -->
    <a href="${H("/index.html")}" class="sidebar-brand-link" aria-label="BCMS Dashboard로 이동">
      <div class="sidebar-brand">
        <span class="sidebar-brand-icon">🛡️</span>
        <span class="sidebar-brand-text">
          <span class="sidebar-brand-bcms">BCMS</span><span class="sidebar-brand-portal"> Portal</span>
        </span>
      </div>
    </a>

    <!-- 회사명 칩 -->
    <div class="sidebar-company" id="sidebarCompanyChip"></div>

    <div class="sidebar-section" data-section="home">
      <a href="${H("/index.html")}" class="sidebar-section-title">🏠 BCMS Home</a>
    </div>

    <div class="sidebar-section" data-section="education">
      <a href="${H("/education/index.html")}" class="sidebar-section-title">📚 0. Education Center (교육센터)</a>
    </div>

    <div class="sidebar-section" data-section="governance">
      <a href="${H("/governance/index.html")}" class="sidebar-section-title">🧭 1. Governance (거버넌스)</a>
      <div class="sub-menu">
        <a href="${H("/governance/policy.html")}">정책/목표/범위</a>
        <a href="${H("/governance/org-registry.html")}">조직 관리</a>
        <a href="${H("/governance/org.html")}">조직도 (평상시/비상대응)</a>
        <a href="${H("/governance/docs.html")}">문서체계</a>
        <a href="${H("/governance/requirements.html")}">법규·요구사항</a>
        <a href="${H("/governance/bcms-map.html")}">BCMS 체계 맵</a>
        <a href="${H("/governance/system-registry.html")}">업무 시스템 목록</a>
        <a href="${H("/governance/service-registry.html")}">서비스 레지스트리(서비스 목록)</a>
      </div>
    </div>

    <div class="sidebar-section" data-section="risk-bia">
      <a href="${H("/risk-bia/index.html")}" class="sidebar-section-title">🧩 2. BIA & RA</a>
      <div class="sub-menu">
        <a href="${H("/risk-bia/index.html")}">대시보드</a>
        <a href="${H("/risk-bia/bia.html")}">업무영향분석 (BIA)${_biaCount > 0 ? `<span class="sbBadge">${_biaCount}</span>` : ''}</a>
        <a href="${H("/risk-bia/risk.html")}">리스크 평가 (RA)${_riskCount > 0 ? `<span class="sbBadge">${_riskCount}</span>` : ''}</a>
        <a href="${H("/risk-bia/priority.html")}">통합 우선순위</a>
        <a href="${H("/risk-bia/core-functions.html")}">핵심업무 관리</a>
      </div>
    </div>

    <div class="sidebar-section" data-section="strategy-plans">
      <a href="${H("/strategy-plans/index.html")}" class="sidebar-section-title">🧱 3. Strategy & Plans (전략·계획)</a>
      <div class="sub-menu">
        <a href="${H("/strategy-plans/index.html")}">전략 대시보드</a>
        <a href="${H("/strategy-plans/bcp.html")}">BCP 전략</a>
        <a href="${H("/strategy-plans/drp.html")}">DRP (연속성 절차)</a>
      </div>
    </div>

    <div class="sidebar-section" data-section="op-center">
      <a href="${H("/op-center/index.html")}" class="sidebar-section-title">🚨 4. Operation Center (운영센터)</a>
    </div>

    <div class="sidebar-section" data-section="library">
      <a href="${H("/library/index.html")}" class="sidebar-section-title">📚 5. Procedure Library (절차·문서)</a>
      <div class="sub-menu">
        <a href="${H("/library/sop.html")}">SOP (평시 운영)</a>
        <a href="${H("/library/eop.html")}">EOP (비상 대응)</a>
        <a href="${H("/library/bcp.html")}">BCP (업무 연속)</a>
        <a href="${H("/library/drp.html")}">DRP (IT 복구)</a>
      </div>
    </div>

    <div class="sidebar-section" data-section="training">
      <a href="${H("/training/index.html")}" class="sidebar-section-title">🎯 6. Training & Exercise (훈련·점검)</a>
    </div>

    <div class="sidebar-section" data-section="audit">
      <a href="${H("/audit/index.html")}" class="sidebar-section-title">📈 7. Performance & Audit (평가·감사)</a>
      <div class="sub-menu">
        <a href="${H("/audit/evidence.html")}">증적 관리</a>
        <a href="${H("/audit/capa.html")}">개선조치(CAPA)</a>
      </div>
    </div>

    <div class="sidebar-section" data-section="reports">
      <a href="${H("/reports/executive-summary.html")}" class="sidebar-section-title">🗂 8. Reports (경영진/감사 요약)</a>
      <div class="sub-menu">
        <a href="${H("/reports/executive-summary.html")}">Executive Summary</a>
        <a href="${H("/reports/doc-package.html")}">📦 심사용 문서 패키지</a>
      </div>
    </div>

    <div class="sidebar-section" data-section="admin">
      <a href="${H("/admin/index.html")}" class="sidebar-section-title">⚙️ 9. Admin (관리)</a>
      <div class="sub-menu">
        <a href="${H("/admin/index.html")}">CAPA 관리</a>
      </div>
    </div>

    <div class="sidebar-guide-wrap">
      <button class="sidebar-guide-btn" id="bcmsGuideBtn" type="button">📋 수립 가이드</button>
    </div>

    <div class="sidebar-security">
      <div class="sidebar-security-badge">
        <span class="sidebar-security-icon">🔒</span>
        <span class="sidebar-security-text">클라우드 암호화 저장 · TLS 전송</span>
      </div>
      <div class="sidebar-security-desc">
        데이터는 AES-256 암호화로 저장되며 TLS로 전송됩니다. 귀사 데이터는 타 기업과 완전히 격리됩니다.
      </div>
    </div>

    <div class="sidebar-contact">
      문의·피드백: <a href="mailto:drogdembaba@naver.com" class="sidebar-contact-link">drogdembaba@naver.com</a>
    </div>

    <div class="sidebar-legal">
      <a href="${H("/privacy.html")}" class="sidebar-legal-link">개인정보처리방침</a>
      <span class="sidebar-legal-sep">|</span>
      <a href="${H("/terms.html")}" class="sidebar-legal-link">이용약관</a>
    </div>

  </div>
  `;

  const mount = document.getElementById("sidebarMount");
  if (mount) mount.innerHTML = sidebarHTML;

  // ── 회사명 칩 채우기 ─────────────────────────────────────────
  (function renderCompanyChip() {
    const chip = document.getElementById('sidebarCompanyChip');
    if (!chip) return;

    function getCompanyName() {
      // 1순위: Supabase 프로필 캐시
      try {
        const p = JSON.parse(localStorage.getItem('bcms_user_profile'));
        if (p?.company_name) return p.company_name;
      } catch {}
      // 2순위: 단독 키
      const c = localStorage.getItem('bcmsCompanyName');
      if (c) return c;
      // 3순위: 조직 레지스트리
      try {
        const org = JSON.parse(localStorage.getItem('bcms_org_registry_v1'));
        if (org?.companyName) return org.companyName;
      } catch {}
      // 4순위: 이메일 앞부분
      try {
        const u = JSON.parse(localStorage.getItem('bcms_supabase_user'));
        if (u?.email) return u.email.split('@')[0];
      } catch {}
      return null;
    }

    const name = getCompanyName();
    if (name) {
      chip.textContent = '🏢 ' + name;
    } else {
      const depth = (window.location.pathname.match(/\//g) || []).length - 1;
      const prefix = depth > 1 ? '../' : '';
      chip.innerHTML = `<span class="sidebar-company-setup">회사명 미설정 · <a href="${prefix}admin/index.html">설정하기 →</a></span>`;
    }
  })();

  // ✅ 링크가 h1 스타일을 망치지 않게 보정 (style.css 수정 없이)
  const st = document.createElement("style");
  st.textContent = `
    .sidebar-brand-link{ display:block; text-decoration:none; color:inherit; padding:4px 0 12px; border-bottom:0.5px solid rgba(100,116,139,.18); margin-bottom:2px; }
    .sidebar-company {
      padding: 5px 14px 10px;
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-bottom: 0.5px solid rgba(100,116,139,.1);
      margin-bottom: 4px;
      min-height: 28px;
    }
    .sidebar-company-setup {
      font-size: 11px;
      font-weight: 400;
      color: #94a3b8;
    }
    .sidebar-company-setup a {
      color: var(--accent);
      text-decoration: none;
    }
    .sidebar-company-setup a:hover { text-decoration: underline; }
    .sidebar-brand{ display:flex; align-items:center; gap:11px; }
    .sidebar-brand-icon{ font-size:28px; line-height:1; flex-shrink:0; }
    .sidebar-brand-text{ display:flex; align-items:baseline; gap:5px; line-height:1; }
    .sidebar-brand-bcms{ font-size:24px; font-weight:800; letter-spacing:-.03em; background:linear-gradient(135deg,#2563eb 0%,#7c3aed 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .sidebar-brand-portal{ font-size:16px; font-weight:300; color:#64748b; letter-spacing:.01em; }

    /* ── 1-2: 다크모드 버튼 오른쪽 상단 통일 ── */
    .theme-toggle {
      bottom: auto !important;
      top: 16px !important;
      right: 16px !important;
    }

    /* ── 1-3: 사이드바 긴 텍스트 줄바꿈 허용 ── */
    .sidebar-section-title {
      white-space: normal !important;
      line-height: 1.4 !important;
      align-items: flex-start !important;
    }
    .sub-menu a {
      white-space: normal !important;
      line-height: 1.4 !important;
      display: flex !important;
      align-items: center !important;
    }

    /* ── 1-4: BIA·리스크 등록 건수 배지 ── */
    .sbBadge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--accent);
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      min-width: 18px;
      height: 16px;
      border-radius: 999px;
      padding: 0 5px;
      margin-left: 6px;
      line-height: 1;
      flex-shrink: 0;
    }

    /* ── 1-5: 문의 메일 ── */
    .sidebar-contact {
      padding: 8px 14px 12px;
      font-size: 11px;
      color: var(--sb-sub);
      text-align: center;
      border-top: 0.5px solid var(--sb-border);
      line-height: 1.6;
    }
    .sidebar-contact-link {
      color: var(--accent);
      text-decoration: none;
    }
    .sidebar-contact-link:hover { text-decoration: underline; }

    /* ── 보안 배지 ── */
    .sidebar-security {
      margin: 0 10px 2px;
      padding: 9px 12px;
      border-radius: 8px;
      border: 0.5px solid rgba(34,197,94,.22);
      background: rgba(34,197,94,.05);
    }
    .sidebar-security-badge {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 5px;
    }
    .sidebar-security-icon { font-size: 11px; line-height: 1; flex-shrink: 0; }
    .sidebar-security-text {
      font-size: 10.5px;
      font-weight: 700;
      color: #16a34a;
      letter-spacing: .01em;
    }
    .sidebar-security-desc {
      font-size: 10px;
      color: var(--sb-sub);
      line-height: 1.55;
      word-break: keep-all;
    }

    .sidebar-legal {
      padding: 7px 14px 10px;
      font-size: 11px;
      color: var(--sb-sub);
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .sidebar-legal-sep {
      color: var(--sb-border);
      font-size: 10px;
    }
    .sidebar-legal-link {
      color: var(--sb-sub);
      text-decoration: none;
      transition: color .12s;
    }
    .sidebar-legal-link:hover {
      color: var(--accent);
      text-decoration: underline;
    }

    .sidebar-guide-wrap {
      position:sticky;
      bottom:0;
      padding:10px 14px 14px;
      background:inherit;
    }
    .sidebar-guide-btn {
      display:block;
      width:100%;
      padding:9px 0;
      text-align:center;
      font-size:12.5px;
      font-weight:600;
      color:#60a5fa;
      background:rgba(96,165,250,.1);
      border:1px solid rgba(96,165,250,.22);
      border-radius:8px;
      cursor:pointer;
      font-family:inherit;
      transition:background .14s, border-color .14s;
      white-space:nowrap;
    }
    .sidebar-guide-btn:hover {
      background:rgba(96,165,250,.2);
      border-color:rgba(96,165,250,.4);
    }
  `;
  document.head.appendChild(st);

  /* ── 수립 가이드 버튼: 클릭 시 Step 3 로드맵 팝업 ── */
  const guideBtn = document.getElementById("bcmsGuideBtn");
  if (guideBtn) {
    guideBtn.addEventListener("click", () => {
      if (window.BCMSOnboarding && typeof window.BCMSOnboarding.showRoadmap === "function") {
        window.BCMSOnboarding.showRoadmap();
      }
    });
  }

  // =========================================================
  // ✅ 페이지 하단 법적 푸터 주입
  // =========================================================
  (function injectPageFooter() {
    const footerSt = document.createElement("style");
    footerSt.textContent = `
      .pageFooter {
        margin-top: 40px;
        padding-top: 16px;
        border-top: 0.5px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 10px;
        font-size: 12px;
        color: var(--text-3);
      }
      .pageFooterLeft { display: flex; align-items: center; gap: 6px; }
      .pageFooterLinks { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
      .pageFooterLink {
        color: var(--text-3);
        text-decoration: none;
        transition: color .12s;
        font-size: 12px;
      }
      .pageFooterLink:hover { color: var(--accent); text-decoration: underline; }
      .pageFooterSep { color: var(--border-strong); }
      @media print { .pageFooter { display: none !important; } }
    `;
    document.head.appendChild(footerSt);

    function tryInjectFooter() {
      const wrap = document.querySelector(".main .wrap") || document.querySelector(".wrap");
      if (!wrap) return false;
      if (wrap.querySelector(".pageFooter")) return true;
      const footer = document.createElement("footer");
      footer.className = "pageFooter";
      footer.innerHTML =
        `<span class="pageFooterLeft">© 2026 BCMS Portal v2. All rights reserved.</span>` +
        `<span class="pageFooterLinks">` +
          `<a href="${H("/privacy.html")}" class="pageFooterLink">개인정보처리방침</a>` +
          `<span class="pageFooterSep">|</span>` +
          `<a href="${H("/terms.html")}" class="pageFooterLink">이용약관</a>` +
          `<span class="pageFooterSep">|</span>` +
          `<a href="mailto:drogdembaba@naver.com" class="pageFooterLink">문의</a>` +
        `</span>`;
      wrap.appendChild(footer);
      return true;
    }

    if (!tryInjectFooter()) {
      document.addEventListener("DOMContentLoaded", tryInjectFooter);
    }
  })();

  // =========================================================
  // ✅ Active section detection (folder-based)
  // =========================================================
  const sections = [
    { key: "education",       match: "/education/" },
    { key: "governance", match: "/governance/" },
    { key: "risk-bia", match: "/risk-bia/" },
    { key: "strategy-plans", match: "/strategy-plans/" },
    { key: "op-center", match: "/op-center/" },
    { key: "library", match: "/library/" },
    { key: "training", match: "/training/" },
    { key: "audit", match: "/audit/" },
    { key: "reports", match: "/reports/" },
    { key: "admin", match: "/admin/" },
  ];

  const currentPath = path.replace(BASE, "");

  const activeKey = (() => {
    const hit = sections.find(s => currentPath.includes(s.match));
    return hit ? hit.key : "home";
  })();

  document.querySelectorAll(".sidebar-section").forEach(section => {
    const key = section.getAttribute("data-section");
    if (key === activeKey) section.classList.add("active");
  });

  // ✅ 현재 페이지와 일치하는 링크 하이라이트 + 접근성 속성 지정
  document.querySelectorAll(".sidebar a[href]").forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;

    const normalizedHref = href.replace(BASE, "");
    if (normalizedHref === currentPath) {
      link.classList.add("active-link");
      link.setAttribute("aria-current", "page");
    }
  });

  // =========================================================
  // ✅ 페이지별 도움말 버튼
  // =========================================================
  const HELP_DATA = {
    "governance/policy.html": {
      title: "BCMS 정책 관리",
      iso: "ISO 22301 5.2조 (정책), 6.2조 (목표)",
      todos: [
        "BCMS 정책서 작성 (경영진 승인 필요)",
        "업무연속성 목표 및 KPI 설정",
        "적용 범위 명확히 정의",
      ],
      tip: "정책서는 최고경영자 명의로 작성해야 ISO 심사 통과에 유리합니다.",
    },
    "governance/org.html": {
      title: "조직도 관리",
      iso: "ISO 22301 5.3조 (역할과 책임)",
      todos: [
        "평상시 조직도 등록",
        "비상대응 조직도 별도 구성",
        "각 역할별 책임자 지정",
      ],
      tip: "비상대응 조직은 평상시와 다른 지휘체계를 가져야 합니다.",
    },
    "governance/docs.html": {
      title: "문서 관리",
      iso: "ISO 22301 7.5조 (문서화된 정보)",
      todos: [
        "BCMS 필수 문서 목록 등록",
        "검토 주기 설정 (보통 연 1회)",
        "문서 버전 관리",
      ],
      tip: "ISO 심사 시 문서 목록과 실제 문서가 일치해야 합니다.",
    },
    "risk-bia/bia.html": {
      title: "업무영향분석 (BIA)",
      iso: "ISO 22301 8.2조 (사업영향분석)",
      todos: [
        "팀별 핵심업무 등록",
        "업무 중단 시 영향도 평가 (1~5점)",
        "MTPD/RTO 설정",
      ],
      tip: "MTPD는 업무가 중단되어도 조직이 버틸 수 있는 최대 시간입니다.\nRTO는 반드시 MTPD보다 짧아야 합니다.",
    },
    "risk-bia/risk.html": {
      title: "리스크 평가",
      iso: "ISO 22301 8.2조 (리스크평가)",
      todos: [
        "업무별 중단 위협 식별",
        "발생가능성 × 영향도로 위험도 산출",
        "15점 이상: 중점관리 대상",
      ],
      tip: "리스크는 자연재해/IT장애/인적요인/공급망 등\n4가지 유형으로 분류하면 빠짐없이 식별할 수 있습니다.",
    },
    "risk-bia/priority.html": {
      title: "우선순위 확정",
      iso: "ISO 22301 8.2조",
      todos: [
        "자동 산정된 우선순위 검토",
        "BCP 수립 대상 업무 토글 ON",
        "경영진 검토 후 확정",
      ],
      tip: "BCP 대상은 예산과 인력을 고려해 현실적으로 선택하세요.\n모든 업무를 BCP 대상으로 할 필요는 없습니다.",
    },
    "strategy-plans/bcp.html": {
      title: "BCP 전략 수립",
      iso: "ISO 22301 8.3조 (업무연속성전략)",
      todos: [
        "중점관리 리스크별 연속성 전략 선택",
        "구체적 BCP 전략 내용 입력",
        "필요자원 체크",
      ],
      tip: "6가지 전략 유형 중 실제 실행 가능한 것을 선택하세요.\n\"대체 수작업\" 전략도 ISO 심사에서 인정됩니다.",
    },
    "strategy-plans/drp.html": {
      title: "연속성 절차 관리",
      iso: "ISO 22301 8.4조 (업무연속성계획)",
      todos: [
        "BCP 발동 조건 및 절차 등록",
        "대체운영 방법 기술",
        "IT 복구 절차 (RTO/RPO) 등록",
      ],
      tip: "발동 조건은 구체적일수록 좋습니다.\n\"재난 발생 시\"보다 \"데이터센터 전력 2시간 이상 중단 시\"처럼 명확히 작성하세요.",
    },
    "training/index.html": {
      title: "훈련 및 점검",
      iso: "ISO 22301 8.5조 (훈련 및 테스팅)",
      todos: [
        "연간 훈련 계획 수립",
        "탁상훈련/기능훈련/전사훈련 구분",
        "훈련 결과 기록",
      ],
      tip: "ISO 22301은 연 1회 이상 훈련을 요구합니다.\n탁상훈련(토론식)부터 시작하는 것을 권장합니다.",
    },
    "audit/index.html": {
      title: "갭분석 및 내부심사",
      iso: "ISO 22301 9조 (성과평가)",
      todos: [
        "ISO 22301 조항별 갭분석 실시",
        "내부심사 계획 수립 및 실시",
        "미충족 항목 CAPA 등록",
      ],
      tip: "갭분석은 최소 연 1회 실시해야 합니다.\n미충족 항목은 반드시 CAPA로 연결해야 ISO 심사에서 지적받지 않습니다.",
    },
    "op-center/index.html": {
      title: "BCMS 운영센터",
      iso: "ISO 22301 9.1조 (모니터링)",
      todos: [
        "전체 BCMS 진행률 주기적 확인",
        "오늘 할 일 체크 후 해당 페이지 이동",
        "경영진 보고 시 운영센터 화면 활용",
      ],
      tip: "운영센터는 BCMS 담당자가 매일 확인하는 습관을 들이면 좋습니다.",
    },
    "reports/executive-summary.html": {
      title: "경영 현황 보고서",
      iso: "ISO 22301 9.3조 (경영검토)",
      todos: [
        "분기별 경영진 보고 시 활용",
        "인쇄 버튼으로 PDF 출력",
        "경영진 코멘트 입력 후 저장",
      ],
      tip: "ISO 심사 시 경영검토 기록이 필요합니다.\n이 보고서를 출력해 경영진 서명 후 보관하세요.",
    },
  };

  (function initHelpButton() {
    const pagePath = window.location.pathname;
    let helpContent = null;
    for (const key of Object.keys(HELP_DATA)) {
      if (pagePath.includes(key)) { helpContent = HELP_DATA[key]; break; }
    }
    if (!helpContent) return;

    const helpSt = document.createElement("style");
    helpSt.textContent = `
      #bcmsHelpBtn {
        position:fixed;right:24px;bottom:72px;z-index:999;
        width:40px;height:40px;border-radius:50%;
        background:#0070f3;color:#fff;
        border:none;cursor:pointer;
        font-size:20px;
        box-shadow:0 2px 12px rgba(0,112,243,.3);
        display:flex;align-items:center;justify-content:center;
        transition:transform .14s ease,box-shadow .14s ease;
        font-family:inherit;line-height:1;
      }
      #bcmsHelpBtn:hover {
        transform:scale(1.1);
        box-shadow:0 4px 18px rgba(0,112,243,.45);
      }
      #bcmsHelpBtn::after {
        content:"이 페이지 사용 가이드";
        position:absolute;
        right:calc(100% + 10px);
        top:50%;
        transform:translateY(-50%);
        background:#333;
        color:#fff;
        font-size:12px;
        font-weight:500;
        padding:5px 10px;
        border-radius:6px;
        white-space:nowrap;
        pointer-events:none;
        opacity:0;
        transition:opacity .14s ease;
      }
      #bcmsHelpBtn:hover::after { opacity:1; }
      .bcms-help-backdrop {
        position:fixed;inset:0;z-index:10000;
        background:rgba(0,0,0,.5);
        backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);
        display:flex;align-items:center;justify-content:center;
        padding:20px;box-sizing:border-box;
        animation:bcmshb-fade .18s ease;
      }
      @keyframes bcmshb-fade  { from{opacity:0} to{opacity:1} }
      @keyframes bcmshb-slide { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
      .bcms-help-card {
        background:#fff;border-radius:16px;
        box-shadow:0 24px 64px rgba(0,0,0,.18);
        width:100%;max-width:480px;
        display:flex;flex-direction:column;
        max-height:calc(100vh - 40px);
        overflow:hidden;
        animation:bcmshb-slide .2s cubic-bezier(.4,0,.2,1);
      }
      .bcms-help-head {
        background:linear-gradient(135deg,#0070f3 0%,#0050d4 100%);
        padding:22px 24px 18px;color:#fff;flex-shrink:0;
        border-radius:16px 16px 0 0;
        display:flex;align-items:flex-start;justify-content:space-between;gap:12px;
      }
      .bcms-help-head-left { flex:1;min-width:0 }
      .bcms-help-title { font-size:17px;font-weight:800;letter-spacing:-.02em;word-break:keep-all }
      .bcms-help-iso   { font-size:11.5px;opacity:.82;margin-top:4px;word-break:keep-all }
      .bcms-help-close {
        width:30px;height:30px;border-radius:50%;
        background:rgba(255,255,255,.2);border:none;
        color:#fff;cursor:pointer;font-size:16px;
        display:flex;align-items:center;justify-content:center;
        flex-shrink:0;transition:background .12s;font-family:inherit;
      }
      .bcms-help-close:hover { background:rgba(255,255,255,.32) }
      .bcms-help-body { padding:22px 24px;overflow-y:auto }
      .bcms-help-section-label {
        font-size:11px;font-weight:700;color:#0070f3;
        letter-spacing:.06em;margin-bottom:8px;
      }
      .bcms-help-todos {
        list-style:none;margin:0 0 18px;padding:0;
        display:flex;flex-direction:column;gap:6px;
      }
      .bcms-help-todos li {
        font-size:13.5px;color:#222;
        padding:8px 12px 8px 34px;
        background:#f5f8ff;border-radius:8px;
        position:relative;line-height:1.5;word-break:keep-all;
      }
      .bcms-help-todos li::before {
        content:'✓';position:absolute;left:10px;
        color:#0070f3;font-weight:800;font-size:12px;top:9px;
      }
      .bcms-help-tip {
        background:#fffbea;border:1px solid #f0d060;
        border-radius:10px;padding:12px 14px;
        font-size:12.5px;color:#7a5c00;line-height:1.65;
        word-break:keep-all;white-space:pre-line;
      }
      .bcms-help-tip::before { content:'💡 팁  ';font-weight:700; }
      [data-theme="dark"] .bcms-help-card  { background:#1a1a2e }
      [data-theme="dark"] .bcms-help-body  { background:#1a1a2e }
      [data-theme="dark"] .bcms-help-todos li { background:#1e2a4a;color:#e0e0e0 }
      [data-theme="dark"] .bcms-help-tip   { background:#2a2500;border-color:#5a4a00;color:#d4b040 }
    `;
    document.head.appendChild(helpSt);

    const btn = document.createElement("button");
    btn.id = "bcmsHelpBtn";
    btn.setAttribute("aria-label", "도움말");
    btn.textContent = "💡";
    document.body.appendChild(btn);

    let modalEl = null;

    function openModal() {
      if (modalEl) return;
      document.body.style.overflow = "hidden";
      modalEl = document.createElement("div");
      modalEl.className = "bcms-help-backdrop";
      modalEl.innerHTML = `
        <div class="bcms-help-card" role="dialog" aria-modal="true" aria-labelledby="bcmsHelpTitle">
          <div class="bcms-help-head">
            <div class="bcms-help-head-left">
              <div class="bcms-help-title" id="bcmsHelpTitle">📋 ${helpContent.title}</div>
              <div class="bcms-help-iso">${helpContent.iso}</div>
            </div>
            <button class="bcms-help-close" id="bcmsHelpClose" aria-label="닫기">✕</button>
          </div>
          <div class="bcms-help-body">
            <div class="bcms-help-section-label">이 페이지에서 할 일</div>
            <ul class="bcms-help-todos">
              ${helpContent.todos.map(function(t){ return "<li>" + t + "</li>"; }).join("")}
            </ul>
            <div class="bcms-help-section-label">작성 팁</div>
            <div class="bcms-help-tip">${helpContent.tip}</div>
          </div>
        </div>`;
      document.body.appendChild(modalEl);
      modalEl.querySelector("#bcmsHelpClose").addEventListener("click", closeModal);
      modalEl.addEventListener("click", function(e){ if (e.target === modalEl) closeModal(); });
    }

    function closeModal() {
      if (!modalEl) return;
      document.body.style.overflow = "";
      modalEl.remove();
      modalEl = null;
    }

    btn.addEventListener("click", openModal);
    document.addEventListener("keydown", function(e){ if (e.key === "Escape" && modalEl) closeModal(); });
  })();

  // =========================================================
  // ✅ 페이지별 컨텍스트 배너
  // =========================================================
  (function initContextBanner() {
    const BANNER_DATA = {
      "governance/policy.html": {
        iso: "📋 ISO 22301 5.2 · 6.2조",
        task: "BCMS 정책 작성 후 경영진 서명을 받으세요",
        nextLabel: "다음: 조직 관리",
        nextHref: H("/governance/org.html"),
      },
      "governance/org.html": {
        iso: "📋 ISO 22301 5.3조",
        task: "평상시 조직도와 비상대응 조직도를 모두 작성하세요",
        nextLabel: "다음: 문서체계",
        nextHref: H("/governance/docs.html"),
      },
      "governance/docs.html": {
        iso: "📋 ISO 22301 7.5조",
        task: "BCMS 필수 문서를 등록하고 검토 주기를 설정하세요",
        nextLabel: "다음: BIA 시작",
        nextHref: H("/risk-bia/bia.html"),
      },
      "risk-bia/bia.html": {
        iso: "📋 ISO 22301 8.2조",
        task: "팀별 핵심업무를 등록하고 MTPD와 RTO를 설정하세요",
        nextLabel: "다음: 리스크 평가",
        nextHref: H("/risk-bia/risk.html"),
      },
      "risk-bia/risk.html": {
        iso: "📋 ISO 22301 8.2조",
        task: "핵심업무별 중단 위협을 식별하고 위험도를 산출하세요",
        nextLabel: "다음: 우선순위 확정",
        nextHref: H("/risk-bia/priority.html"),
      },
      "risk-bia/priority.html": {
        iso: "📋 ISO 22301 8.2조",
        task: "BCP 수립 대상 업무를 확정하고 토글을 ON으로 설정하세요",
        nextLabel: "다음: BCP 전략 수립",
        nextHref: H("/strategy-plans/bcp.html"),
      },
      "strategy-plans/bcp.html": {
        iso: "📋 ISO 22301 8.3조",
        task: "중점관리 리스크별 연속성 전략을 선택하고 내용을 입력하세요",
        nextLabel: "다음: 연속성 절차",
        nextHref: H("/strategy-plans/drp.html"),
      },
      "strategy-plans/drp.html": {
        iso: "📋 ISO 22301 8.4조",
        task: "BCP 발동 조건과 대체운영 절차를 등록하세요",
        nextLabel: "다음: 훈련 계획",
        nextHref: H("/training/index.html"),
      },
      "training/index.html": {
        iso: "📋 ISO 22301 8.5조",
        task: "연간 훈련 계획을 수립하고 훈련을 실시 후 결과를 기록하세요",
        nextLabel: "다음: 갭분석 실시",
        nextHref: H("/audit/index.html"),
      },
      "audit/index.html": {
        iso: "📋 ISO 22301 9조",
        task: "ISO 22301 조항별 갭분석을 실시하고 미충족 항목은 CAPA로 등록하세요",
        nextLabel: "다음: 경영 보고서",
        nextHref: H("/reports/executive-summary.html"),
      },
      "reports/executive-summary.html": {
        iso: "📋 ISO 22301 9.3조",
        task: "경영진 보고서를 작성하고 PDF로 출력해 경영진 서명을 받으세요",
        nextLabel: "다음: 운영센터 확인",
        nextHref: H("/op-center/index.html"),
      },
      "op-center/index.html": {
        iso: "📋 ISO 22301 9.1조",
        task: "BCMS 전체 진행률을 확인하고 오늘 할 일을 처리하세요",
        nextLabel: null,
        nextHref: null,
      },
      "library/bcp.html": {
        iso: "📋 ISO 22301 8.4조",
        task: "BCP 절차서를 작성하고 인쇄하여 심사 제출용으로 보관하세요",
        nextLabel: "다음: EOP 절차서",
        nextHref: H("/library/eop.html"),
      },
      "library/eop.html": {
        iso: "📋 ISO 22301 8.4조",
        task: "비상대응절차서를 작성하고 비상시 접근 가능한 곳에 보관하세요",
        nextLabel: "다음: SOP 절차서",
        nextHref: H("/library/sop.html"),
      },
      "library/sop.html": {
        iso: "📋 ISO 22301 8.4조",
        task: "BCMS 운영 관련 표준절차를 등록하세요",
        nextLabel: "다음: 절차서 라이브러리",
        nextHref: H("/library/index.html"),
      },
    };

    const pagePath = window.location.pathname;
    let bannerData = null;
    for (const key of Object.keys(BANNER_DATA)) {
      if (pagePath.includes(key)) { bannerData = BANNER_DATA[key]; break; }
    }
    if (!bannerData) return;

    const bannerSt = document.createElement("style");
    bannerSt.textContent = `
      .contextBanner {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 20px;
        height: 36px;
        background: rgba(0,112,243,0.06);
        box-shadow: 0 1px 0 rgba(0,112,243,0.15);
        font-size: 12px;
        color: var(--text-2);
        flex-shrink: 0;
        white-space: nowrap;
        overflow: hidden;
        margin-bottom: 8px;
      }
      .isoTag {
        font-weight: 700;
        color: var(--accent);
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        cursor: default;
      }
      .isoTagIcon { flex-shrink: 0; }
      .isoTagText {
        display: inline-block;
        max-width: 0;
        overflow: hidden;
        white-space: nowrap;
        transition: max-width 0.28s ease;
        vertical-align: middle;
      }
      .isoTag:hover .isoTagText { max-width: 240px; }
      .bannerDivider {
        color: var(--border-strong);
        flex-shrink: 0;
      }
      .bannerTask {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .bannerNext {
        font-weight: 600;
        color: var(--accent);
        text-decoration: none;
        flex-shrink: 0;
      }
      .bannerNext:hover { text-decoration: underline; }
      @media print { .contextBanner { display: none !important; } }
    `;
    document.head.appendChild(bannerSt);

    const banner = document.createElement("div");
    banner.className = "contextBanner";
    const _isoParts = bannerData.iso.split(' ');
    const _isoIcon  = _isoParts[0];
    const _isoRest  = ' ' + _isoParts.slice(1).join(' ');
    banner.innerHTML =
      `<span class="isoTag"><span class="isoTagIcon">${_isoIcon}</span><span class="isoTagText">${_isoRest}</span></span>` +
      `<span class="bannerDivider">|</span>` +
      `<span class="bannerTask">${bannerData.task}</span>` +
      (bannerData.nextLabel
        ? `<a class="bannerNext" href="${bannerData.nextHref}">→ ${bannerData.nextLabel} →</a>`
        : "");

    function tryInsert() {
      const target = document.querySelector(".main") || document.querySelector(".wrap");
      if (!target) return false;
      const demoBanner = target.querySelector(".demoBanner") ||
        Array.from(target.children).find(el =>
          el !== banner &&
          el.style && el.style.background && el.style.background.includes("rgba")
        );
      if (demoBanner) {
        demoBanner.insertAdjacentElement("afterend", banner);
      } else {
        target.prepend(banner);
      }
      return true;
    }

    if (!tryInsert()) {
      document.addEventListener("DOMContentLoaded", tryInsert);
    }
  })();

  // =========================================================
  // ✅ 모바일 햄버거 메뉴
  // =========================================================
  (function initHamburger() {
    const hamburgerBtn = document.createElement('button');
    hamburgerBtn.className = 'sidebar-hamburger';
    hamburgerBtn.setAttribute('aria-label', '메뉴 열기');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.textContent = '☰';
    document.body.appendChild(hamburgerBtn);

    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    const sidebar = document.querySelector('.sidebar');

    function openSidebar() {
      if (!sidebar) return;
      sidebar.classList.add('sidebar-open');
      overlay.classList.add('sidebar-overlay-visible');
      hamburgerBtn.textContent = '✕';
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      hamburgerBtn.setAttribute('aria-label', '메뉴 닫기');
      document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
      if (!sidebar) return;
      sidebar.classList.remove('sidebar-open');
      overlay.classList.remove('sidebar-overlay-visible');
      hamburgerBtn.textContent = '☰';
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      hamburgerBtn.setAttribute('aria-label', '메뉴 열기');
      document.body.style.overflow = '';
    }

    hamburgerBtn.addEventListener('click', function () {
      if (sidebar && sidebar.classList.contains('sidebar-open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    overlay.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar && sidebar.classList.contains('sidebar-open')) {
        closeSidebar();
      }
    });

    if (sidebar) {
      sidebar.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          if (window.innerWidth <= 960) closeSidebar();
        });
      });
    }
  })();

})();
