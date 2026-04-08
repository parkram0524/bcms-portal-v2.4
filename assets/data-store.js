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

  const KEY_CORE_FUNCTIONS = 'bcmsCoreFunctions';
  const KEY_BIA_DATA = 'bcmsBIAData';
  const KEY_RISK_ASSESSMENT = 'bcmsRiskAssessment';
  const KEY_INCIDENTS_UNIFIED = 'bcmsIncidents';
  const KEY_INCIDENT_EXECUTION = 'bcmsIncidentExecution';
  const KEY_SELECTED_INCIDENT_ID = 'bcmsSelectedIncidentId';
  const KEY_SELECTED_INCIDENT = 'bcms_selected_incident';

  // Returns the current timestamp as an ISO-8601 string.
  const nowISO = () => new Date().toISOString();

  // Creates a compact ID string such as INC-20260305-1A2B.
  const uid = (prefix = 'ID') => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `${prefix}-${date}-${random}`;
  };

  const asText = (value) => String(value ?? '').trim();
  const hasValue = (value) => value !== null && value !== undefined && String(value).trim() !== '';
  const safeArray = (value) => Array.isArray(value) ? value : [];
  const safeObject = (value) => (value && typeof value === 'object' && !Array.isArray(value)) ? value : {};
  const uniq = (arr) => [...new Set(safeArray(arr).filter(Boolean))];
  const toNum = (value, fallback = null) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  };
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const pickFirst = (obj, keys, fallback = '') => {
    const source = safeObject(obj);
    for (const key of keys) {
      if (hasValue(source[key])) return source[key];
    }
    return fallback;
  };
  const slug = (input) => asText(input).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9가-힣_-]/g, '');

  const toMinutes = (value, unit = '') => {
    if (!hasValue(value)) return null;
    if (typeof value === 'number' && Number.isFinite(value)) return Math.round(value);
    const s = String(value).trim();
    const nMatch = s.match(/[0-9]+(?:\.[0-9]+)?/);
    const n = toNum(nMatch ? nMatch[0] : value);
    if (n === null || n <= 0) return null;
    const merged = `${s}${unit}`;
    if (merged.includes('일') || merged.toLowerCase().includes('day')) return Math.round(n * 1440);
    if (merged.includes('시간') || merged.toLowerCase().includes('hour')) return Math.round(n * 60);
    return Math.round(n);
  };

  const normalizeStringList = (value) => {
    if (Array.isArray(value)) return uniq(value.map((x) => asText(x?.id || x?.name || x?.teamName || x)));
    if (typeof value === 'string') return uniq(value.split(',').map((x) => asText(x)).filter(Boolean));
    return [];
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

  const upsertById = (rows, nextRow) => {
    const list = safeArray(rows);
    const row = safeObject(nextRow);
    const id = asText(row.id);
    if (!id) return list;
    const idx = list.findIndex((item) => asText(item?.id) === id);
    if (idx < 0) return [...list, row];
    const copy = list.slice();
    copy[idx] = { ...safeObject(copy[idx]), ...row };
    return copy;
  };

  const normalizeTeam = (record = {}) => {
    const src = safeObject(record);
    const name = asText(pickFirst(src, ['teamName', 'name', 'team', 'ownerTeam', 'department'], ''));
    const idSeed = asText(pickFirst(src, ['id', 'teamId'], '')) || (name ? `TEAM-${slug(name)}` : '');
    return {
      id: idSeed || uid('TEAM'),
      name: name || '미지정 팀',
      division: asText(pickFirst(src, ['division', 'divisionName', 'ownerDivision'], ''))
    };
  };

  const normalizeCoreFunction = (record = {}, teamHint = null) => {
    const src = safeObject(record);
    const seed = { ...(teamHint || {}), ...src };
    const team = normalizeTeam({ ...seed, name: pickFirst(seed, ['teamName', 'name', 'team', 'ownerTeam', 'department'], teamHint?.name || '') });
    const name = asText(pickFirst(seed, ['name', 'functionName', 'coreFunction', 'function', 'title'], ''));
    const idSeed = asText(pickFirst(src, ['id', 'functionId'], '')) || (team.id && name ? `CF-${slug(`${team.id}-${name}`)}` : '');
    return {
      id: idSeed || uid('CF'),
      teamId: team.id,
      teamName: team.name,
      name: name || '미지정 업무',
      serviceName: asText(pickFirst(src, ['serviceName', 'service', 'serviceId'], ''))
    };
  };

  const normalizeBiaRecord = (record = {}, context = {}) => {
    const src = safeObject(record);
    const seed = { ...(context.team || {}), ...src, teamName: src.teamName || context.teamName || '' };
    const team = normalizeTeam({ ...seed, name: pickFirst(seed, ['teamName', 'name', 'team', 'ownerTeam', 'department'], context.teamName || '') });
    const core = normalizeCoreFunction(src, team);
    const importance = asText(pickFirst(src, ['importance'], src.coreFinal ? '중요' : '일반')) || '일반';
    const overallImpact = clamp(toNum(pickFirst(src, ['overallImpact', 'impact'], 3), 3), 1, 5);
    const rtoValueRaw = pickFirst(src, ['rtoValue'], null);
    const rtoUnit = asText(pickFirst(src, ['rtoUnit'], '분')) || '분';
    const mtpdMinutes = toMinutes(pickFirst(src, ['mtpdMinutes', 'mtpd'], null));
    const rtoMinutes = toMinutes(rtoValueRaw !== null ? rtoValueRaw : pickFirst(src, ['rto', 'rtoMinutes'], null), rtoUnit);
    const idSeed = asText(pickFirst(src, ['id', 'biaId'], '')) || (core.id ? `BIA-${core.id}` : '');

    const timeImpactSrc = safeObject(src.timeImpact);
    const timeImpact = {
      immediate: clamp(toNum(timeImpactSrc.immediate, 1), 1, 5),
      min30: clamp(toNum(timeImpactSrc.min30, 1), 1, 5),
      hour1: clamp(toNum(timeImpactSrc.hour1, 1), 1, 5),
      hour4: clamp(toNum(timeImpactSrc.hour4, 1), 1, 5),
      day1: clamp(toNum(timeImpactSrc.day1, 1), 1, 5),
      week1: clamp(toNum(timeImpactSrc.week1, 1), 1, 5)
    };

    return {
      id: idSeed || uid('BIA'),
      teamId: team.id,
      teamName: team.name,
      functionId: core.id,
      functionName: core.name,
      serviceName: asText(pickFirst(src, ['serviceName', 'service'], core.serviceName)),
      importance,
      overallImpact,
      timeImpact,
      mtpdMinutes,
      rtoValue: hasValue(rtoValueRaw) ? Number(rtoValueRaw) : null,
      rtoUnit,
      rtoMinutes,
      grade: asText(pickFirst(src, ['grade'], '일반')) || '일반',
      requiredResources: uniq(safeArray(src.requiredResources).map((x) => asText(x)).filter(Boolean)),
      sourceRefId: asText(pickFirst(src, ['sourceRefId'], '')),
      syncedAt: nowISO()
    };
  };

  const normalizeRiskRecord = (record = {}, context = {}) => {
    const src = safeObject(record);
    const seed = { ...(context.team || {}), ...src, teamName: src.teamName || context.teamName || '' };
    const team = normalizeTeam({ ...seed, name: pickFirst(seed, ['teamName', 'name', 'team', 'ownerTeam', 'department'], context.teamName || '') });
    const core = normalizeCoreFunction(src, team);
    const impact = clamp(toNum(pickFirst(src, ['impact', 'overallImpact'], context.impact || 3), 3), 1, 5);
    const likelihood = clamp(toNum(pickFirst(src, ['likelihood'], 1), 1), 1, 5);
    const riskScore = toNum(pickFirst(src, ['riskScore'], impact * likelihood), impact * likelihood);
    const idSeed = asText(pickFirst(src, ['id', 'riskId'], '')) || (asText(src.sourceRefId) ? `RISK-${slug(src.sourceRefId)}` : (core.id ? `RISK-${core.id}` : ''));
    return {
      id: idSeed || uid('RISK'),
      teamId: team.id,
      teamName: team.name,
      functionId: core.id,
      functionName: core.name,
      serviceName: asText(pickFirst(src, ['serviceName', 'service'], core.serviceName)),
      threat: asText(pickFirst(src, ['threat', 'risk', 'riskName', 'title'], '')),
      impact,
      likelihood,
      riskScore,
      source: asText(pickFirst(src, ['source'], 'MANUAL')) || 'MANUAL',
      sourceRefId: asText(pickFirst(src, ['sourceRefId'], '')),
      critical: src.critical === undefined ? riskScore >= 13 : !!src.critical,
      riskLevel: asText(pickFirst(src, ['riskLevel'], riskScore >= 13 ? '높음' : '보통')),
      stale: !!src.stale,
      syncedAt: nowISO()
    };
  };

  const normalizeIncidentRecord = (record = {}, idx = 0) => {
    const src = safeObject(record);
    const id = asText(pickFirst(src, ['id', 'incidentId', 'incidentRef', 'incidentCode'], `INC-${idx + 1}`));
    const serviceName = asText(pickFirst(src, ['serviceName', 'service', 'impacted'], ''));
    return {
      id,
      title: asText(pickFirst(src, ['title', 'incidentTitle', 'name'], '')),
      serviceName,
      severity: asText(pickFirst(src, ['severity', 'level'], '-')) || '-',
      status: asText(pickFirst(src, ['status', 'currentStatus', 'state'], '-')) || '-',
      relatedTeamIds: normalizeStringList(src.relatedTeamIds || src.relatedTeams || src.relatedOrgUnits),
      relatedFunctionIds: normalizeStringList(src.relatedFunctionIds || src.relatedCoreFunctions),
      relatedRiskIds: normalizeStringList(src.relatedRiskIds || src.matchedRisks),
      startedAt: pickFirst(src, ['startedAt', 'startTime', 'createdAt', 'incidentStartTime', 'openedAt'], null),
      endedAt: pickFirst(src, ['endedAt', 'endTime', 'closedAt', 'resolvedAt'], null),
      raw: src
    };
  };

  const readCoreFunctions = () => {
    const raw = get(KEY_CORE_FUNCTIONS, []);
    const rows = safeArray(raw);
    const out = [];
    rows.forEach((row) => {
      const team = normalizeTeam(row);
      const functions = safeArray(row?.functions);
      if (functions.length) {
        functions.forEach((fn) => out.push(normalizeCoreFunction(typeof fn === 'string' ? { name: fn } : fn, team)));
      } else {
        const maybeName = asText(pickFirst(row, ['name', 'functionName', 'coreFunction'], ''));
        if (maybeName) out.push(normalizeCoreFunction(row, team));
      }
    });
    return out;
  };

  const readBiaRecords = () => {
    const raw = get(KEY_BIA_DATA, []);
    const rows = safeArray(raw);
    if (!rows.length && raw && typeof raw === 'object') rows.push(raw);
    const out = [];
    rows.forEach((row) => {
      if (Array.isArray(row?.functions)) {
        const team = normalizeTeam(row);
        row.functions.forEach((fn) => out.push(normalizeBiaRecord(fn, { team, teamName: team.name })));
      } else {
        out.push(normalizeBiaRecord(row));
      }
    });
    return out.filter((row) => hasValue(row.functionName));
  };

  const writeBiaRecords = (records) => set(KEY_BIA_DATA, safeArray(records).map((row) => normalizeBiaRecord(row)));

  const readRiskRecords = () => {
    const raw = get(KEY_RISK_ASSESSMENT, []);
    const rows = safeArray(raw);
    if (!rows.length && raw && typeof raw === 'object') rows.push(raw);
    const out = [];
    rows.forEach((row) => {
      if (Array.isArray(row?.risks)) {
        const team = normalizeTeam(row);
        row.risks.forEach((risk) => out.push(normalizeRiskRecord(risk, { team, teamName: team.name })));
      } else {
        out.push(normalizeRiskRecord(row));
      }
    });
    return out.filter((row) => hasValue(row.functionName));
  };

  const writeRiskRecords = (records) => set(KEY_RISK_ASSESSMENT, safeArray(records).map((row) => normalizeRiskRecord(row)));

  const syncRiskWithBia = (biaRecordsInput = null) => {
    const biaRecords = safeArray(biaRecordsInput && biaRecordsInput.length ? biaRecordsInput : readBiaRecords()).map((row) => normalizeBiaRecord(row));
    const existingRisks = readRiskRecords();

    const byAutoRef = new Map(existingRisks.map((risk) => [asText(risk.sourceRefId || ''), risk]).filter(([key]) => key));
    const next = existingRisks.filter((risk) => asText(risk.source) !== 'BIA_AUTO');

    const activeRefs = new Set();
    biaRecords.forEach((bia) => {
      const sourceRefId = bia.id;
      activeRefs.add(sourceRefId);
      const prev = byAutoRef.get(sourceRefId);
      const merged = normalizeRiskRecord({
        ...prev,
        teamId: bia.teamId,
        teamName: bia.teamName,
        functionId: bia.functionId,
        functionName: bia.functionName,
        serviceName: bia.serviceName,
        impact: bia.overallImpact,
        likelihood: clamp(toNum(prev?.likelihood, 2), 1, 5),
        threat: asText(prev?.threat || ''),
        source: 'BIA_AUTO',
        sourceRefId,
        stale: false
      });
      merged.riskScore = merged.impact * merged.likelihood;
      merged.critical = merged.riskScore >= 13;
      merged.riskLevel = merged.riskScore >= 13 ? '높음' : '보통';
      next.push(merged);
    });

    existingRisks
      .filter((risk) => asText(risk.source) === 'BIA_AUTO' && !activeRefs.has(asText(risk.sourceRefId)))
      .forEach((risk) => {
        next.push(normalizeRiskRecord({ ...risk, stale: true, source: 'BIA_AUTO' }));
      });

    writeRiskRecords(next);
    return next;
  };

  const readIncidentRecords = () => {
    const rows = [];
    const unified = get(KEY_INCIDENTS_UNIFIED, null);
    if (Array.isArray(unified)) rows.push(...unified);
    if (unified && typeof unified === 'object') {
      if (unified.currentIncident) rows.push(unified.currentIncident);
      if (Array.isArray(unified.logs)) rows.push(...unified.logs);
    }

    const legacy = get(KEY_INCIDENTS, null);
    if (legacy && typeof legacy === 'object') {
      if (legacy.currentIncident) rows.push(legacy.currentIncident);
      if (Array.isArray(legacy.logs)) rows.push(...legacy.logs);
    }

    const execRows = get(KEY_INCIDENT_EXECUTION, []);
    safeArray(execRows).forEach((row) => {
      if (!row || typeof row !== 'object') return;
      rows.push({
        incidentId: row.incidentId || row.id || row.incidentRef || '',
        status: row.status || row.currentStatus || '',
        severity: row.severity || row.level || '',
        serviceName: row.serviceName || row.service || '',
        startedAt: row.startedAt || row.createdAt || '',
        endedAt: row.endedAt || ''
      });
    });

    const normalized = rows.map((row, idx) => normalizeIncidentRecord(row, idx)).filter((row) => hasValue(row.id));
    const dedup = new Map();
    normalized.forEach((row) => {
      const prev = dedup.get(row.id);
      dedup.set(row.id, prev ? { ...prev, ...row, raw: { ...safeObject(prev.raw), ...safeObject(row.raw) } } : row);
    });
    return [...dedup.values()];
  };

  const getSelectedIncidentId = () => {
    const id = asText(localStorage.getItem(KEY_SELECTED_INCIDENT_ID));
    if (id) return id;
    const selected = safeObject(get(KEY_SELECTED_INCIDENT, {}));
    return asText(selected.incidentId || selected.incidentRef || selected.id || '');
  };

  const setSelectedIncidentId = (incidentId) => {
    const id = asText(incidentId);
    if (!id) return;
    localStorage.setItem(KEY_SELECTED_INCIDENT_ID, id);
    set(KEY_SELECTED_INCIDENT, { incidentId: id });
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
    KEY_CORE_FUNCTIONS,
    KEY_BIA_DATA,
    KEY_RISK_ASSESSMENT,
    KEY_INCIDENTS_UNIFIED,
    KEY_INCIDENT_EXECUTION,
    KEY_SELECTED_INCIDENT_ID,
    KEY_SELECTED_INCIDENT,
    get,
    set,
    update,
    remove,
    reset,
    nowISO,
    uid,
    safeArray,
    safeObject,
    upsertById,
    normalizeTeam,
    normalizeCoreFunction,
    normalizeBiaRecord,
    normalizeRiskRecord,
    normalizeIncidentRecord,
    readCoreFunctions,
    readBiaRecords,
    writeBiaRecords,
    readRiskRecords,
    writeRiskRecords,
    syncRiskWithBia,
    readIncidentRecords,
    getSelectedIncidentId,
    setSelectedIncidentId
  };
})(window);
