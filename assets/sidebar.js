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
        <a href="${H("/governance/org.html")}">평상시 조직도</a>
        <a href="${H("/governance/eop-org-chart.html")}">비상대응 조직도</a>
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
        <a href="${H("/strategy-plans/drp.html")}">DRP 절차</a>
        <a href="${H("/strategy-plans/priority.html")}">복구 우선순위(통합)</a>
        <a href="${H("/strategy-plans/recovery-priority.html")}">Recovery Priority</a>
      </div>
    </div>

    <div class="sidebar-section" data-section="op-center">
      <a href="${H("/op-center/index.html")}" class="sidebar-section-title">🚨 4. Operation Center (운영센터)</a>
      <div class="sub-menu">
        <a href="${H("/op-center/ops-status.html")}">상황판(운영 현황)</a>
        <a href="${H("/op-center/service-health.html")}">서비스 상태 맵</a>
        <a href="${H("/op-center/incident-dashboard.html")}">Incident Dashboard (사고 대응 현황)</a>
      </div>
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
        <a href="${H("/admin/capa.html")}">CAPA 관리 (개선항목)</a>
      </div>
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
  `;
  document.head.appendChild(st);

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
})();
