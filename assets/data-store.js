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

  const uniqueIds = (list) => uniq(safeArray(list).map((x) => asText(x)).filter(Boolean));
  const toTeamId = (value) => {
    const v = asText(value);
    if (!v) return '';
    return /^TEAM-/i.test(v) ? v : `TEAM-${slug(v)}`;
  };
  const toFunctionId = (value) => {
    const v = asText(value);
    if (!v) return '';
    return /^CF-/i.test(v) ? v : `CF-${slug(v)}`;
  };
  const toRiskId = (value) => {
    const v = asText(value);
    if (!v) return '';
    return /^RISK-/i.test(v) ? v : `RISK-${slug(v)}`;
  };
  const safeIdArray = (value, kind = 'generic') => {
    const rows = normalizeStringList(value);
    if (kind === 'team') return uniqueIds(rows.map(toTeamId));
    if (kind === 'function') return uniqueIds(rows.map(toFunctionId));
    if (kind === 'risk') return uniqueIds(rows.map(toRiskId));
    return uniqueIds(rows);
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
    const relatedTeamNames = normalizeStringList(src.relatedTeamNames || src.relatedTeams || src.relatedOrgUnits || src.responseTeams || src.selectedTeams || src.organizations);
    const relatedFunctionNames = normalizeStringList(src.relatedFunctionNames || src.relatedCoreFunctions || src.functions || src.coreFunctions);
    const relatedRiskNames = normalizeStringList(src.relatedRiskNames || src.matchedRisks || src.relatedRisks);

    return {
      id,
      title: asText(pickFirst(src, ['title', 'incidentTitle', 'name'], '')),
      serviceName,
      severity: asText(pickFirst(src, ['severity', 'level'], '-')) || '-',
      status: asText(pickFirst(src, ['status', 'currentStatus', 'state'], '-')) || '-',
      relatedTeamIds: safeIdArray(src.relatedTeamIds?.length ? src.relatedTeamIds : relatedTeamNames, 'team'),
      relatedFunctionIds: safeIdArray(src.relatedFunctionIds?.length ? src.relatedFunctionIds : relatedFunctionNames, 'function'),
      relatedRiskIds: safeIdArray(src.relatedRiskIds?.length ? src.relatedRiskIds : relatedRiskNames, 'risk'),
      relatedTeamNames,
      relatedFunctionNames,
      relatedRiskNames,
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

    const byAutoRef = new Map();
    existingRisks.forEach((risk) => {
      const ref = asText(risk.sourceRefId || '');
      if (ref) byAutoRef.set(ref, risk);
      const fnKey = `${asText(risk.teamId)}||${asText(risk.functionId)}`;
      if (fnKey !== '||' && !byAutoRef.has(fnKey)) byAutoRef.set(fnKey, risk);
    });
    const next = existingRisks.filter((risk) => asText(risk.source) !== 'BIA_AUTO');

    const activeRefs = new Set();
    biaRecords.forEach((bia) => {
      const sourceRefId = bia.id;
      activeRefs.add(sourceRefId);
      const prev = byAutoRef.get(sourceRefId) || byAutoRef.get(`${asText(bia.teamId)}||${asText(bia.functionId)}`);
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

  const getIncidentById = (incidentId) => {
    const id = asText(incidentId);
    if (!id) return null;
    return readIncidentRecords().find((row) => asText(row.id) === id) || null;
  };

  const resolveIncidentTeams = (incident) => {
    const row = normalizeIncidentRecord(incident || {});
    const teamMap = new Map(readBiaRecords().map((r) => [asText(r.teamId), r.teamName]));
    row.relatedTeamNames.forEach((name) => teamMap.set(toTeamId(name), name));
    return uniqueIds(row.relatedTeamIds).map((id) => ({ id, name: teamMap.get(id) || id.replace(/^TEAM-/, '') }));
  };

  const resolveIncidentFunctions = (incident) => {
    const row = normalizeIncidentRecord(incident || {});
    const fnMap = new Map(readBiaRecords().map((r) => [asText(r.functionId), r]));
    row.relatedFunctionNames.forEach((name) => {
      const id = toFunctionId(name);
      if (!fnMap.has(id)) fnMap.set(id, { functionName: name, teamId: '', teamName: '', serviceName: '' });
    });
    return uniqueIds(row.relatedFunctionIds).map((id) => ({
      id,
      name: asText(fnMap.get(id)?.functionName || id.replace(/^CF-/, '')),
      teamId: asText(fnMap.get(id)?.teamId || ''),
      teamName: asText(fnMap.get(id)?.teamName || ''),
      serviceName: asText(fnMap.get(id)?.serviceName || '')
    }));
  };

  const resolveIncidentRisks = (incident) => {
    const row = normalizeIncidentRecord(incident || {});
    const riskMap = new Map(readRiskRecords().map((r) => [asText(r.id), r]));
    row.relatedRiskNames.forEach((name) => {
      const id = toRiskId(name);
      if (!riskMap.has(id)) riskMap.set(id, { threat: name, riskScore: 0, teamId: '', functionId: '' });
    });
    return uniqueIds(row.relatedRiskIds).map((id) => ({
      id,
      threat: asText(riskMap.get(id)?.threat || id.replace(/^RISK-/, '')),
      riskScore: toNum(riskMap.get(id)?.riskScore, 0) || 0,
      teamId: asText(riskMap.get(id)?.teamId || ''),
      functionId: asText(riskMap.get(id)?.functionId || '')
    }));
  };

  const resolveIncidentContext = (incident) => {
    const base = normalizeIncidentRecord(incident || {});
    const teams = resolveIncidentTeams(base);
    const functions = resolveIncidentFunctions(base);
    const risks = resolveIncidentRisks(base);
    const serviceName = base.serviceName || functions.find((f) => f.serviceName)?.serviceName || '';
    return { ...base, teams, functions, risks, serviceName };
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
    safeIdArray,
    uniqueIds,
    readCoreFunctions,
    readBiaRecords,
    writeBiaRecords,
    readRiskRecords,
    writeRiskRecords,
    syncRiskWithBia,
    readIncidentRecords,
    getIncidentById,
    getSelectedIncidentId,
    setSelectedIncidentId,
    resolveIncidentTeams,
    resolveIncidentFunctions,
    resolveIncidentRisks,
    resolveIncidentContext
  };
})(window);
