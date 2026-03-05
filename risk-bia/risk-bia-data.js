/* risk-bia-data.js
 * - Seed + CRUD
 * - Storage keys:
 *   - risk_bia_processes_v2 : BIA 원천데이터
 *   - bcp_core_processes    : BCP 연계(CoreFinal만 동기화)
 */

(function(){
  const KEY = "risk_bia_processes_v2";
  const KEY_BCP = "bcp_core_processes";

  const TIME_BUCKETS = [
    "즉시","10분","30분","90분","4h","8h","1d","3d","5d","7d","1개월","1개월+"
  ];

  // ===== Seed (체험용: 값이 "이미 채워져 있음" + 언제든 수정 가능) =====
  // impact: 0~5, timeflow: 1~5 (단조증가 규칙은 bia.html에서 강제)
  const SEED = [
    {
      id: "seed-001",
      dept: "재난안전팀",
      work: "비상상황 초기대응 및 상황전파",
      impact: { financial:2, legal:3, customer:4, reputation:4, operations:4 },
      timeflow: { "즉시":3,"10분":3,"30분":4,"90분":5,"4h":5,"8h":5,"1d":5,"3d":5,"5d":5,"7d":5,"1개월":5,"1개월+":5 },
      rtoMin: 60,
      coreManual: false,
      resourcesText: "인력: 상황반 2명 / 시스템: 비상연락망·메신저 / 시설: 상황실",
      notes: ""
    },
    {
      id: "seed-002",
      dept: "서비스품질관리팀",
      work: "대고객 장애 공지 및 CS 대응",
      impact: { financial:2, legal:1, customer:5, reputation:5, operations:3 },
      timeflow: { "즉시":2,"10분":3,"30분":3,"90분":4,"4h":5,"8h":5,"1d":5,"3d":5,"5d":5,"7d":5,"1개월":5,"1개월+":5 },
      rtoMin: 90,
      coreManual: true,
      resourcesText: "인력: CS 3명 / 시스템: 공지페이지·CRM / 외부: 콜센터 협력사",
      notes: ""
    },
    {
      id: "seed-003",
      dept: "전기팀",
      work: "전원 장애 대응(UPS/발전기 전환)",
      impact: { financial:4, legal:3, customer:4, reputation:4, operations:5 },
      timeflow: { "즉시":4,"10분":4,"30분":5,"90분":5,"4h":5,"8h":5,"1d":5,"3d":5,"5d":5,"7d":5,"1개월":5,"1개월+":5 },
      rtoMin: 30,
      coreManual: false,
      resourcesText: "인력: 전기 2명 / 시설: 전기실 / 장비: UPS·발전기 / 외부: 유지보수 업체",
      notes: ""
    },
    {
      id: "seed-004",
      dept: "방재팀",
      work: "화재/연기 감지 및 초기 소화·대피유도",
      impact: { financial:3, legal:5, customer:4, reputation:5, operations:5 },
      timeflow: { "즉시":5,"10분":5,"30분":5,"90분":5,"4h":5,"8h":5,"1d":5,"3d":5,"5d":5,"7d":5,"1개월":5,"1개월+":5 },
      rtoMin: 0,
      coreManual: true,
      resourcesText: "인력: 방재 2명 / 시설: 방재실 / 장비: 소화설비 / 외부: 소방서",
      notes: ""
    }
  ];

  function safeParse(raw, fallback){
    try{ return JSON.parse(raw); }catch(e){ return fallback; }
  }
  function load(){
    const raw = sessionStorage.getItem(KEY);
    const arr = raw ? safeParse(raw, []) : [];
    return Array.isArray(arr) ? arr : [];
  }
  function save(arr){
    sessionStorage.setItem(KEY, JSON.stringify(arr));
  }

  function ensureSeed(){
    const arr = load();
    if (!arr.length){
      // Deep clone seed to avoid mutation issues
      const cloned = SEED.map(x=>JSON.parse(JSON.stringify(x)));
      save(cloned);
      return cloned;
    }
    return arr;
  }

  function uid(){
    return "bia-" + Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
  }

  function upsert(proc){
    const arr = ensureSeed();
    const id = proc.id || uid();
    proc.id = id;
    const idx = arr.findIndex(x=>x.id===id);
    if (idx >= 0) arr[idx] = proc;
    else arr.push(proc);
    save(arr);
    return proc;
  }

  function remove(id){
    const arr = ensureSeed().filter(x=>x.id!==id);
    save(arr);
  }

  function resetToSeed(){
    const cloned = SEED.map(x=>JSON.parse(JSON.stringify(x)));
    save(cloned);
    // also clear BCP sync? keep to avoid confusion; we overwrite on next sync anyway
    return cloned;
  }

  // ===== BCP sync helper (CoreFinal only) =====
  function syncToBcp(coreRows){
    // coreRows: [{dept, work, coreFinal, mtpdMin, rtoMin, resourcesText, impactScore}]
    sessionStorage.setItem(KEY_BCP, JSON.stringify(coreRows));
  }

  // expose
  window.RiskBiaData = {
    KEY,
    TIME_BUCKETS,
    ensureSeed,
    getAll: ensureSeed,
    load: ensureSeed,
    saveAll: save,
    upsert,
    remove,
    resetToSeed,
    syncToBcp
  };
})();