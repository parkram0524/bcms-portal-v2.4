(function () {
  // =========================================================
  // ✅ Deploy-safe base prefix
  // - Netlify root:      /governance/index.html
  // - GitHub Pages repo: /BCMS-PORTAL-V2/governance/index.html
  // =========================================================
  const path = window.location.pathname || "/";
  const m = path.match(/^(\/[^\/]+)(?=\/(governance|risk-bia|strategy-plans|op-center|library|training|audit|admin)\/)/);
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
        <a href="${H("/governance/org.html")}">조직/역할</a>
        <a href="${H("/governance/docs.html")}">문서체계</a>
        <a href="${H("/governance/requirements.html")}">법규·요구사항</a>
        <a href="${H("/governance/bcms-map.html")}">BCMS 체계 맵</a>
        <a href="${H("/governance/system-registry.html")}">업무 시스템 목록</a>
      </div>
    </div>

    <div class="sidebar-section" data-section="risk-bia">
      <a href="${H("/risk-bia/index.html")}" class="sidebar-section-title">🧩 2. Risk & BIA (리스크·업무영향분석)</a>
      <div class="sub-menu">
        <a href="${H("/risk-bia/risk.html")}">리스크 평가</a>
        <a href="${H("/risk-bia/bia.html")}">BIA</a>
        <a href="${H("/risk-bia/priority.html")}">중요도 / 우선순위</a>
        <a href="${H("/risk-bia/dependency.html")}">자원 / 의존성</a>
      </div>
    </div>

    <div class="sidebar-section" data-section="strategy-plans">
      <a href="${H("/strategy-plans/index.html")}" class="sidebar-section-title">🧱 3. Strategy & Plans (전략·계획)</a>
    </div>

    <div class="sidebar-section" data-section="op-center">
      <a href="${H("/op-center/index.html")}" class="sidebar-section-title">🚨 4. Operation Center (운영센터)</a>
      <div class="sub-menu">
        <a href="${H("/op-center/ops-status.html")}">상황판(운영 현황)</a>
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
    </div>

    <div class="sidebar-section" data-section="admin">
      <a href="${H("/admin/index.html")}" class="sidebar-section-title">⚙️ 8. Admin (관리)</a>
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
    { key: "admin", match: "/admin/" },
  ];

  const activeKey = (() => {
    const p = path.replace(BASE, "");
    const hit = sections.find(s => p.includes(s.match));
    return hit ? hit.key : "home";
  })();

  document.querySelectorAll(".sidebar-section").forEach(section => {
    const key = section.getAttribute("data-section");
    if (key === activeKey) section.classList.add("active");
  });
})();