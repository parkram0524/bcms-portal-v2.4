(function (global) {
  'use strict';

  // Standardized storage keys for BCMS Portal data.
  const KEY_SERVICE_REGISTRY = 'bcms_service_registry_v1';
  const KEY_INCIDENTS = 'bcms_incidents_v1';
  const KEY_INCIDENT_LOGS = 'bcms_incident_logs_v1';
  const KEY_EVIDENCE = 'bcms_audit_evidence_v1';
  const KEY_CAPA = 'bcms_capa_v1';
  const KEY_THEME = 'bcms_theme';
  const KEY_DEMO_MODE = 'bcms_demo_mode';
  const KEY_RTO_THRESHOLD = 'bcms_rto_threshold_minutes';
  const KEY_ORG_REGISTRY = 'bcms_org_registry_v1';
  const KEY_EOP_ROLE_MAPPING = 'bcms_eop_role_mapping_v1';
  const KEY_BCP_MODE = 'bcms_bcp_mode';
  const KEY_BIA = 'bcmsBIAData';
  const KEY_RISK_ASSESSMENT = 'bcmsRiskAssessment';

  // Returns the current timestamp as an ISO-8601 string.
  const nowISO = () => new Date().toISOString();

  // Creates a compact ID string such as INC-20260305-1A2B.
  const uid = (prefix = 'ID') => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `${prefix}-${date}-${random}`;
  };

  // Reads and parses a JSON value; returns fallback on missing data or parse errors.
  const get = (key, fallback = null) => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  };

  // Serializes and stores a value; returns the same value for convenient chaining.
  const set = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  };

  // Updates a stored value via updater function and persists the result.
  const update = (key, updaterFn) => {
    const current = get(key, null);
    const next = updaterFn(current);
    return set(key, next);
  };

  // Removes a key from storage.
  const remove = (key) => {
    localStorage.removeItem(key);
  };

  // Resets a key to a specific seed value and returns it.
  const reset = (key, seedValue) => set(key, seedValue);

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const normalizeText = (v) => String(v || '').trim().toLowerCase();

  const inferThreat = (functionName) => {
    const name = String(functionName || '').trim();
    if (!name) return '업무 중단';
    if (/ups|전력|전원|발전기/i.test(name)) return '전력 공급 장애';
    if (/네트워크|통신|망/i.test(name)) return '네트워크 장애';
    if (/시스템|서버|서비스/i.test(name)) return '시스템 장애';
    return `${name} 중단`;
  };

  // BIA 저장값 기반으로 Risk Register를 자동 동기화한다.
  const syncRiskFromBIA = () => {
    const biaRows = get(KEY_BIA, []);
    const riskRows = get(KEY_RISK_ASSESSMENT, []);

    const safeBiaRows = Array.isArray(biaRows) ? biaRows : [];
    const safeRiskRows = Array.isArray(riskRows) ? riskRows : [];

    const next = safeRiskRows.map((row) => ({
      team: String(row.team || '').trim(),
      risks: Array.isArray(row.risks) ? row.risks.map((risk) => ({ ...risk })) : []
    })).filter((row) => row.team);

    safeBiaRows.forEach((biaRow) => {
      const team = String(biaRow.team || '').trim();
      if (!team) return;

      let riskRow = next.find((row) => row.team === team);
      if (!riskRow) {
        riskRow = { team, risks: [] };
        next.push(riskRow);
      }

      const existing = new Set(
        riskRow.risks.map((risk) => {
          const functionName = normalizeText(risk.function || risk.functionName);
          const threat = normalizeText(risk.threat || risk.risk);
          return `${functionName}::${threat}`;
        })
      );

      const functions = Array.isArray(biaRow.functions) ? biaRow.functions : [];
      functions.forEach((fn) => {
        const functionName = String(fn.name || fn.function || '').trim();
        if (!functionName) return;

        const importance = String(fn.importance || '').trim();
        const grade = String(fn.grade || '').trim();
        const isAutoTarget = importance === '중요' || grade === '핵심';
        if (!isAutoTarget) return;

        const impact = clamp(Number(fn.overallImpact || fn.impact || 3), 1, 5);
        const likelihood = 3;
        const threat = inferThreat(functionName);
        const dedupeKey = `${normalizeText(functionName)}::${normalizeText(threat)}`;
        if (existing.has(dedupeKey)) return;

        riskRow.risks.push({
          team,
          functionName,
          function: functionName,
          threat,
          risk: threat,
          impact,
          likelihood,
          riskScore: impact * likelihood,
          source: 'BIA',
          riskLevel: impact * likelihood >= 13 ? '높음' : (impact * likelihood <= 5 ? '낮음' : '보통'),
          critical: impact * likelihood >= 13
        });
        existing.add(dedupeKey);
      });
    });

    set(KEY_RISK_ASSESSMENT, next);
    return next;
  };

  global.DataStore = {
    KEY_SERVICE_REGISTRY,
    KEY_INCIDENTS,
    KEY_INCIDENT_LOGS,
    KEY_EVIDENCE,
    KEY_CAPA,
    KEY_THEME,
    KEY_DEMO_MODE,
    KEY_RTO_THRESHOLD,
    KEY_ORG_REGISTRY,
    KEY_EOP_ROLE_MAPPING,
    KEY_BCP_MODE,
    KEY_BIA,
    KEY_RISK_ASSESSMENT,
    get,
    set,
    update,
    remove,
    reset,
    nowISO,
    uid,
    syncRiskFromBIA,
  };
})(window);
