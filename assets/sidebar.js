(function () {
  // =========================================================
  // ✅ Deploy-safe base prefix
  // - Netlify root:      /governance/index.html
  // - GitHub Pages repo: /BCMS-PORTAL-V2/governance/index.html
  // =========================================================
  const path = window.location.pathname || "/";
  const m = path.match(/^(\/[^\/]+)(?=\/(governance|risk-bia|strategy-plans|op-center|library|training|audit|admin|reports)\/)/);
  const BASE = m ? m[1] : ""; // e.g. "/BCMS-PORTAL-V2" or ""
  const H = (p) => `${BASE}${p}`;

  const sidebarHTML = `
  <div class="sidebar">

    <!-- ✅ 상단 타이틀 클릭 → BCMS 대시보드로 이동 -->
    <a href="${H("/index.html")}" class="sidebar-brand-link" aria-label="BCMS Dashboard로 이동">
      <h1>BCMS Portal v2</h1>
    </a>

    <div class="sidebar-section" data-section="home">
      <a href="${H("/index.html")}" class="sidebar-section-title">🏠 BCMS Home</a>
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
      <a href="${H("/risk-bia/index.html")}" class="sidebar-section-title">🧩 2. BIA & RA (업무영향분석·리스크평가)</a>
      <div class="sub-menu">
        <a href="${H("/risk-bia/index.html")}">대시보드</a>
        <a href="${H("/risk-bia/bia.html")}">업무영향분석 (BIA)</a>
        <a href="${H("/risk-bia/risk.html")}">리스크 평가 (RA)</a>
        <a href="${H("/risk-bia/priority.html")}">통합 우선순위</a>
        <a href="${H("/risk-bia/core-functions.html")}">핵심업무 관리</a>
      </div>
    </div>

    <div class="sidebar-section" data-section="strategy-plans">
      <a href="${H("/strategy-plans/index.html")}" class="sidebar-section-title">🧱 3. Strategy & Plans (전략·계획)</a>
      <div class="sub-menu">
        <a href="${H("/strategy-plans/index.html")}">전략 대시보드</a>
        <a href="${H("/strategy-plans/bcp.html")}">BCP 전략</a>
        <a href="${H("/strategy-plans/drp.html")}">연속성 절차</a>
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

  </div>
  `;

  const mount = document.getElementById("sidebarMount");
  if (mount) mount.innerHTML = sidebarHTML;

  // ✅ 링크가 h1 스타일을 망치지 않게 보정 (style.css 수정 없이)
  const st = document.createElement("style");
  st.textContent = `
    .sidebar-brand-link{ display:block; text-decoration:none; color:inherit; }
    .sidebar-brand-link:hover{ opacity:.95; }
    .sidebar-brand-link h1{ cursor:pointer; }
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
  // ✅ Active section detection (folder-based)
  // =========================================================
  const sections = [
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

})();
