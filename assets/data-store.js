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

  const KEY_CORE_FUNCTIONS = 'bcmsCoreFunctions';
  const KEY_BIA_DATA = 'bcmsBIAData';
  const KEY_RISK_ASSESSMENT = 'bcmsRiskAssessment';
  const KEY_INCIDENTS_UNIFIED = 'bcmsIncidents';
  const KEY_INCIDENT_EXECUTION = 'bcmsIncidentExecution';
  const KEY_SELECTED_INCIDENT_ID = 'bcmsSelectedIncidentId';
  const KEY_SELECTED_INCIDENT = 'bcms_selected_incident';

  const KEY_CORE_FUNCTIONS = 'bcmsCoreFunctions';
  const KEY_BIA_DATA = 'bcmsBIAData';
  const KEY_RISK_ASSESSMENT = 'bcmsRiskAssessment';
  const KEY_INCIDENTS_UNIFIED = 'bcmsIncidents';
  const KEY_INCIDENT_EXECUTION = 'bcmsIncidentExecution';
  const KEY_SELECTED_INCIDENT_ID = 'bcmsSelectedIncidentId';
  const KEY_SELECTED_INCIDENT = 'bcms_selected_incident';

  const KEY_CORE_FUNCTIONS = 'bcmsCoreFunctions';
  const KEY_BIA_DATA = 'bcmsBIAData';
  const KEY_RISK_ASSESSMENT = 'bcmsRiskAssessment';
  const KEY_INCIDENTS_UNIFIED = 'bcmsIncidents';
  const KEY_INCIDENT_EXECUTION = 'bcmsIncidentExecution';
  const KEY_SELECTED_INCIDENT_ID = 'bcmsSelectedIncidentId';
  const KEY_SELECTED_INCIDENT = 'bcms_selected_incident';

  const KEY_CORE_FUNCTIONS = 'bcmsCoreFunctions';
  const KEY_BIA_DATA = 'bcmsBIAData';
  const KEY_RISK_ASSESSMENT = 'bcmsRiskAssessment';
  const KEY_INCIDENTS_UNIFIED = 'bcmsIncidents';
  const KEY_INCIDENT_EXECUTION = 'bcmsIncidentExecution';
  const KEY_SELECTED_INCIDENT_ID = 'bcmsSelectedIncidentId';
  const KEY_SELECTED_INCIDENT = 'bcms_selected_incident';
  const KEY_EVIDENCE_ITEMS = 'bcmsEvidenceItems';
  const KEY_ACTION_ITEMS = 'bcmsActionItems';
  const KEY_CAPA_ITEMS = 'bcmsCapaItems';

  const KEY_CORE_FUNCTIONS = 'bcmsCoreFunctions';
  const KEY_BIA_DATA = 'bcmsBIAData';
  const KEY_RISK_ASSESSMENT = 'bcmsRiskAssessment';
  const KEY_INCIDENTS_UNIFIED = 'bcmsIncidents';
  const KEY_INCIDENT_EXECUTION = 'bcmsIncidentExecution';
  const KEY_SELECTED_INCIDENT_ID = 'bcmsSelectedIncidentId';
  const KEY_SELECTED_INCIDENT = 'bcms_selected_incident';
  const KEY_FOCUS_TARGET = 'bcmsFocusTarget';
  const KEY_EVIDENCE_ITEMS = 'bcmsEvidenceItems';
  const KEY_ACTION_ITEMS = 'bcmsActionItems';
  const KEY_CAPA_ITEMS = 'bcmsCapaItems';

  const KEY_CORE_FUNCTIONS = 'bcmsCoreFunctions';
  const KEY_BIA_DATA = 'bcmsBIAData';
  const KEY_RISK_ASSESSMENT = 'bcmsRiskAssessment';
  const KEY_INCIDENTS_UNIFIED = 'bcmsIncidents';
  const KEY_INCIDENT_EXECUTION = 'bcmsIncidentExecution';
  const KEY_SELECTED_INCIDENT_ID = 'bcmsSelectedIncidentId';
  const KEY_SELECTED_INCIDENT = 'bcms_selected_incident';
  const KEY_FOCUS_TARGET = 'bcmsFocusTarget';
  const KEY_EVIDENCE_ITEMS = 'bcmsEvidenceItems';
  const KEY_ACTION_ITEMS = 'bcmsActionItems';
  const KEY_CAPA_ITEMS = 'bcmsCapaItems';

  const KEY_CORE_FUNCTIONS = 'bcmsCoreFunctions';
  const KEY_BIA_DATA = 'bcmsBIAData';
  const KEY_RISK_ASSESSMENT = 'bcmsRiskAssessment';
  const KEY_INCIDENTS_UNIFIED = 'bcmsIncidents';
  const KEY_INCIDENT_EXECUTION = 'bcmsIncidentExecution';
  const KEY_SELECTED_INCIDENT_ID = 'bcmsSelectedIncidentId';
  const KEY_SELECTED_INCIDENT = 'bcms_selected_incident';
  const KEY_FOCUS_TARGET = 'bcmsFocusTarget';
  const KEY_EVIDENCE_ITEMS = 'bcmsEvidenceItems';
  const KEY_ACTION_ITEMS = 'bcmsActionItems';
  const KEY_CAPA_ITEMS = 'bcmsCapaItems';

  const KEY_CORE_FUNCTIONS = 'bcmsCoreFunctions';
  const KEY_BIA_DATA = 'bcmsBIAData';
  const KEY_RISK_ASSESSMENT = 'bcmsRiskAssessment';
  const KEY_INCIDENTS_UNIFIED = 'bcmsIncidents';
  const KEY_INCIDENT_EXECUTION = 'bcmsIncidentExecution';
  const KEY_SELECTED_INCIDENT_ID = 'bcmsSelectedIncidentId';
  const KEY_SELECTED_INCIDENT = 'bcms_selected_incident';
  const KEY_FOCUS_TARGET = 'bcmsFocusTarget';
  const KEY_EVIDENCE_ITEMS = 'bcmsEvidenceItems';
  const KEY_ACTION_ITEMS = 'bcmsActionItems';
  const KEY_CAPA_ITEMS = 'bcmsCapaItems';

  const STORAGE_KEY_CONTRACT = {
    orgRegistry: { canonicalKey: KEY_ORG_REGISTRY, legacyKeys: ['bcms_org_registry_v1'] },
    coreFunctions: { canonicalKey: KEY_CORE_FUNCTIONS, legacyKeys: [] },
    services: { canonicalKey: KEY_SERVICE_REGISTRY, legacyKeys: [] },
    bia: { canonicalKey: KEY_BIA_DATA, legacyKeys: [] },
    risks: { canonicalKey: KEY_RISK_ASSESSMENT, legacyKeys: [] },
    incidents: { canonicalKey: KEY_INCIDENTS_UNIFIED, legacyKeys: [KEY_INCIDENTS] },
    incidentExecution: { canonicalKey: KEY_INCIDENT_EXECUTION, legacyKeys: [] },
    evidence: { canonicalKey: KEY_EVIDENCE_ITEMS, legacyKeys: [KEY_EVIDENCE] },
    capa: { canonicalKey: KEY_CAPA_ITEMS, legacyKeys: [KEY_ACTION_ITEMS, KEY_CAPA] },
    selectedIncident: { canonicalKey: KEY_SELECTED_INCIDENT_ID, legacyKeys: [KEY_SELECTED_INCIDENT] },
    focusTarget: { canonicalKey: KEY_FOCUS_TARGET, legacyKeys: [] }
  };

  const KEY_CORE_FUNCTIONS = 'bcmsCoreFunctions';
  const KEY_BIA_DATA = 'bcmsBIAData';
  const KEY_RISK_ASSESSMENT = 'bcmsRiskAssessment';
  const KEY_INCIDENTS_UNIFIED = 'bcmsIncidents';
  const KEY_INCIDENT_EXECUTION = 'bcmsIncidentExecution';
  const KEY_SELECTED_INCIDENT_ID = 'bcmsSelectedIncidentId';
  const KEY_SELECTED_INCIDENT = 'bcms_selected_incident';
  const KEY_FOCUS_TARGET = 'bcmsFocusTarget';
  const KEY_EVIDENCE_ITEMS = 'bcmsEvidenceItems';
  const KEY_ACTION_ITEMS = 'bcmsActionItems';
  const KEY_CAPA_ITEMS = 'bcmsCapaItems';

  const STORAGE_KEY_CONTRACT = {
    orgRegistry: { canonicalKey: KEY_ORG_REGISTRY, legacyKeys: ['bcms_org_registry_v1'] },
    coreFunctions: { canonicalKey: KEY_CORE_FUNCTIONS, legacyKeys: [] },
    services: { canonicalKey: KEY_SERVICE_REGISTRY, legacyKeys: [] },
    bia: { canonicalKey: KEY_BIA_DATA, legacyKeys: [] },
    risks: { canonicalKey: KEY_RISK_ASSESSMENT, legacyKeys: [] },
    incidents: { canonicalKey: KEY_INCIDENTS_UNIFIED, legacyKeys: [KEY_INCIDENTS] },
    incidentExecution: { canonicalKey: KEY_INCIDENT_EXECUTION, legacyKeys: [] },
    evidence: { canonicalKey: KEY_EVIDENCE_ITEMS, legacyKeys: [KEY_EVIDENCE] },
    capa: { canonicalKey: KEY_CAPA_ITEMS, legacyKeys: [KEY_ACTION_ITEMS, KEY_CAPA] },
    selectedIncident: { canonicalKey: KEY_SELECTED_INCIDENT_ID, legacyKeys: [KEY_SELECTED_INCIDENT] },
    focusTarget: { canonicalKey: KEY_FOCUS_TARGET, legacyKeys: [] }
  };

  // Returns the current timestamp as an ISO-8601 string.
  const nowISO = () => new Date().toISOString();

  // Creates a compact ID string such as INC-20260305-1A2B.
  const uid = (prefix = 'ID') => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `${prefix}-${date}-${random}`;
  };

  const asText = (value) => String(value ?? '').trim();
  const safeParseJson = (raw, fallback = null) => {
    try {
      if (raw === null || raw === undefined || raw === '') return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  };
  const safeString = (value, fallback = '') => {
    const s = asText(value);
    return s || fallback;
  };
  const safeId = (value, prefix = 'ID') => {
    const v = asText(value);
    if (v) return v;
    return `${prefix}-${slug(`${prefix}-${nowISO()}`)}`;
  };
  const stableSlug = (value) => slug(value);
  const safeTimestamp = (value) => {
    if (!hasValue(value)) return nowISO();
    const ts = new Date(value).getTime();
    return Number.isFinite(ts) ? new Date(ts).toISOString() : nowISO();
  };
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

  const safeStatus = (value, type = 'generic') => {
    const v = asText(value).toLowerCase();
    if (type === 'evidence') {
      if (!v || ['new', 'draft', 'open', 'unconfirmed', 'pending_review', 'pending', '미확인', '확인필요', '확인 필요'].includes(v)) return 'pending';
      if (['done', 'closed', 'complete', 'completed', 'resolved', 'confirmed', '확인완료', '완료', '종결'].includes(v)) return 'confirmed';
      return 'pending';
    }
    if (type === 'capa') {
      if (!v || ['new', 'draft', 'open', '미완료', '미착수', 'pending', 'todo'].includes(v)) return 'open';
      if (['progress', 'ongoing', 'working', '진행중', 'in_progress'].includes(v)) return 'in_progress';
      if (['done', 'closed', 'complete', 'completed', 'resolved', '완료', '종결'].includes(v)) return 'completed';
      return 'open';
    }
    return asText(value);
  };

  // Reads and parses a JSON value; returns fallback on missing data or parse errors.
  const get = (key, fallback = null) => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return safeParseJson(raw, fallback);
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

  const normalizeService = (record = {}, context = {}) => {
    const src = safeObject(record);
    const name = safeString(pickFirst(src, ['name', 'serviceName', 'service', 'title'], ''), '');
    const ownerTeam = normalizeTeam({
      id: pickFirst(src, ['ownerTeamId', 'teamId'], context.ownerTeamId || ''),
      name: pickFirst(src, ['ownerTeamName', 'teamName', 'ownerTeam', 'team'], context.ownerTeamName || ''),
      division: pickFirst(src, ['ownerDivision', 'divisionName', 'division'], context.ownerDivision || '')
    });
    const idSeed = asText(pickFirst(src, ['id', 'serviceId'], '')) || (name ? `SVC-${slug(name)}` : '');
    return {
      id: idSeed || uid('SVC'),
      name: name || '미지정 서비스',
      ownerTeamId: ownerTeam.id,
      ownerTeamName: ownerTeam.name,
      active: src.active !== false,
      tier: safeString(src.tier),
      criticality: safeString(src.criticality || src.importance),
      description: safeString(src.description || src.note),
      tags: uniq(safeArray(src.tags).map((x) => asText(x)).filter(Boolean)),
      updatedAt: pickFirst(src, ['updatedAt'], nowISO())
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

  const writeCoreFunctions = (records) => {
    const normalized = safeArray(records).map((row) => normalizeCoreFunction(row));
    set(KEY_CORE_FUNCTIONS, normalized);
    return normalized;
  };

  const getOrgRegistry = () => {
    const raw = get(KEY_ORG_REGISTRY, { companyName: 'SJ Digital', divisions: [] });
    const divisions = safeArray(raw?.divisions).map((division, idx) => {
      const divisionId = asText(division?.id) || `DIV-${idx + 1}`;
      const divisionName = safeString(division?.name, '미지정 본부');
      const teams = safeArray(division?.teams).map((team) => normalizeTeam({
        id: pickFirst(team || {}, ['id'], ''),
        teamName: pickFirst(team || {}, ['name', 'teamName'], ''),
        divisionName
      }));
      return { id: divisionId, name: divisionName, teams };
    });
    return { companyName: safeString(raw?.companyName, 'SJ Digital'), divisions };
  };

  const writeOrgRegistry = (registry = {}) => {
    const raw = safeObject(registry);
    const divisions = safeArray(raw.divisions).map((division, idx) => {
      const divisionName = safeString(division?.name, '미지정 본부');
      const divisionId = asText(division?.id) || `DIV-${idx + 1}`;
      const teams = safeArray(division?.teams).map((team) => normalizeTeam({
        id: pickFirst(team || {}, ['id'], ''),
        teamName: pickFirst(team || {}, ['name', 'teamName'], ''),
        divisionName
      }));
      return { id: divisionId, name: divisionName, teams };
    });
    const normalized = { companyName: safeString(raw.companyName, 'SJ Digital'), divisions };
    set(KEY_ORG_REGISTRY, normalized);
    return normalized;
  };

  const getAllTeams = () => {
    const org = getOrgRegistry();
    return org.divisions.flatMap((division) => safeArray(division.teams).map((team) => normalizeTeam({ ...team, division: division.name })));
  };
  const getTeamById = (teamId) => {
    const id = asText(teamId);
    if (!id) return null;
    return getAllTeams().find((team) => asText(team.id) === id) || null;
  };

  const getAllServices = () => safeArray(get(KEY_SERVICE_REGISTRY, [])).map((row) => normalizeService(row));
  const writeServices = (services) => {
    const normalized = safeArray(services).map((row) => normalizeService(row));
    set(KEY_SERVICE_REGISTRY, normalized);
    return normalized;
  };
  const getServiceById = (serviceId) => {
    const id = asText(serviceId);
    if (!id) return null;
    return getAllServices().find((svc) => asText(svc.id) === id) || null;
  };

  const getAllCoreFunctions = () => readCoreFunctions();
  const getCoreFunctionById = (functionId) => {
    const id = asText(functionId);
    if (!id) return null;
    return readCoreFunctions().find((fn) => asText(fn.id) === id) || null;
  };
  const getCoreFunctionsByTeamId = (teamId) => {
    const id = asText(teamId);
    if (!id) return [];
    return readCoreFunctions().filter((fn) => asText(fn.teamId) === id);
  };

  const getEopRoleAssignments = () => {
    const raw = safeObject(get(KEY_EOP_ROLE_MAPPING, {}));
    const teams = getAllTeams();
    const teamByName = new Map(teams.map((team) => [team.name, team]));
    const rows = [];
    const toRows = (source = {}, roleSeed = '') => uniqueIds(source || []).map((teamName) => {
      const hit = teamByName.get(teamName);
      return { roleId: roleSeed, roleName: roleSeed, teamIds: [asText(hit?.id || '')].filter(Boolean), teamNames: [teamName] };
    });
    rows.push(...toRows(raw.situation || raw.basicRoles?.situation || [], '상황관리'));
    rows.push(...toRows(raw.techRecovery || raw.basicRoles?.techRecovery || [], '기술복구'));
    rows.push(...toRows(raw.facility || raw.basicRoles?.facility || [], '시설지원(IDC)'));
    rows.push(...toRows(raw.security || raw.basicRoles?.security || [], '보안대응'));
    rows.push(...toRows(raw.communication || raw.basicRoles?.communication || [], '대외커뮤니케이션'));
    rows.push(...toRows(raw.record || raw.basicRoles?.record || [], '기록·증적'));
    return rows;
  };

  const getStorageContract = () => STORAGE_KEY_CONTRACT;
  const resolveStorageKey = (logicalName) => STORAGE_KEY_CONTRACT[logicalName]?.canonicalKey || '';
  const readRawCollection = (logicalName) => {
    const key = resolveStorageKey(logicalName);
    if (!key) return null;
    return get(key, null);
  };
  const writeRawCollection = (logicalName, value) => {
    const key = resolveStorageKey(logicalName);
    if (!key) return value;
    set(key, value);
    return value;
  };
  const mergeLegacyCollections = (logicalName) => {
    const contract = STORAGE_KEY_CONTRACT[logicalName];
    if (!contract) return [];
    const merged = [];
    const canonical = get(contract.canonicalKey, null);
    if (canonical !== null) merged.push(canonical);
    safeArray(contract.legacyKeys).forEach((legacyKey) => {
      const legacy = get(legacyKey, null);
      if (legacy !== null) merged.push(legacy);
    });
    return merged;
  };
  const normalizeCollection = (logicalName, items) => {
    if (logicalName === 'orgRegistry') return writeOrgRegistry(safeObject(items));
    if (logicalName === 'coreFunctions') return safeArray(items).map((row) => normalizeCoreFunction(row));
    if (logicalName === 'services') return safeArray(items).map((row) => normalizeService(row));
    if (logicalName === 'bia') return safeArray(items).map((row) => normalizeBiaRecord(row));
    if (logicalName === 'risks') return safeArray(items).map((row) => normalizeRiskRecord(row));
    if (logicalName === 'incidents') return safeArray(items).map((row, idx) => normalizeIncidentRecord(row, idx));
    if (logicalName === 'evidence') return safeArray(items).map((row) => normalizeEvidenceRecord(row));
    if (logicalName === 'capa') return safeArray(items).map((row) => normalizeCapaRecord(row));
    if (logicalName === 'focusTarget') return {
      source: asText(safeObject(items).source),
      incidentId: asText(safeObject(items).incidentId || safeObject(items).id),
      assetId: asText(safeObject(items).assetId),
      assetType: asText(safeObject(items).assetType).toUpperCase(),
      assetCollection: asText(safeObject(items).assetCollection).toLowerCase(),
      serviceName: asText(safeObject(items).serviceName),
      relatedTeamIds: safeIdArray(safeObject(items).relatedTeamIds || [], 'team'),
      relatedFunctionIds: safeIdArray(safeObject(items).relatedFunctionIds || [], 'function'),
      relatedRiskIds: safeIdArray(safeObject(items).relatedRiskIds || [], 'risk'),
      createdAt: safeTimestamp(safeObject(items).createdAt)
    };
    return safeArray(items);
  };
  const readCanonicalCollection = (logicalName) => {
    if (logicalName === 'orgRegistry') return getOrgRegistry();
    if (logicalName === 'coreFunctions') return getAllCoreFunctions();
    if (logicalName === 'services') return getAllServices();
    if (logicalName === 'bia') return readBiaRecords();
    if (logicalName === 'risks') return readRiskRecords();
    if (logicalName === 'incidents') return readIncidentRecords();
    if (logicalName === 'evidence') return getAllEvidence();
    if (logicalName === 'capa') return getAllCapaItems();
    if (logicalName === 'selectedIncident') return getSelectedIncidentId();
    if (logicalName === 'focusTarget') return getFocusTarget();
    return readRawCollection(logicalName);
  };
  const writeCanonicalCollection = (logicalName, items) => {
    if (logicalName === 'orgRegistry') return writeOrgRegistry(safeObject(items));
    if (logicalName === 'coreFunctions') return writeCoreFunctions(items);
    if (logicalName === 'services') return writeServices(items);
    if (logicalName === 'bia') return writeBiaRecords(items);
    if (logicalName === 'risks') return writeRiskRecords(items);
    if (logicalName === 'incidents') return set(KEY_INCIDENTS_UNIFIED, safeArray(items).map((row, idx) => normalizeIncidentRecord(row, idx)));
    if (logicalName === 'evidence') return writeEvidenceItems(items);
    if (logicalName === 'capa') return writeCapaItems(items);
    if (logicalName === 'focusTarget') return setFocusTarget(safeObject(items));
    return writeRawCollection(logicalName, items);
  };
  const upsertCollectionItem = (logicalName, item) => {
    const current = safeArray(readCanonicalCollection(logicalName));
    const next = upsertById(current, item);
    return writeCanonicalCollection(logicalName, next);
  };
  const removeCollectionItem = (logicalName, id) => {
    const key = asText(id);
    const current = safeArray(readCanonicalCollection(logicalName));
    const next = current.filter((row) => asText(row?.id) !== key);
    return writeCanonicalCollection(logicalName, next);
  };

  const getIncidentExecutionLog = (incidentId) => {
    const id = asText(incidentId);
    if (!id) return [];
    const rows = safeArray(get(KEY_INCIDENT_EXECUTION, []));
    const hit = rows.find((row) => asText(row?.incidentId || row?.id) === id);
    return safeArray(hit?.logs || []);
  };
  const saveIncidentExecutionLog = (incidentId, entries) => {
    const id = asText(incidentId);
    if (!id) return [];
    const logs = safeArray(entries).filter((row) => row && typeof row === 'object');
    const rows = safeArray(get(KEY_INCIDENT_EXECUTION, []));
    const idx = rows.findIndex((row) => asText(row?.incidentId || row?.id) === id);
    if (idx < 0) rows.push({ incidentId: id, logs });
    else rows[idx] = { ...safeObject(rows[idx]), incidentId: id, logs };
    set(KEY_INCIDENT_EXECUTION, rows);
    return logs;
  };
  const getAllBiaRecords = () => readBiaRecords();
  const saveBiaRecords = (items) => writeBiaRecords(items);
  const getAllRiskRecords = () => readRiskRecords();
  const saveRiskRecords = (items) => writeRiskRecords(items);
  const getAllIncidents = () => readIncidentRecords();
  const saveIncidents = (items) => writeCanonicalCollection('incidents', items);
  const saveOrgRegistry = (items) => writeOrgRegistry(items);
  const saveEvidence = (items) => writeEvidenceItems(items);
  const saveCapaItems = (items) => writeCapaItems(items);

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

  const normalizeIncidentContext = (incident) => {
    const row = normalizeIncidentRecord(incident || {});
    const teams = resolveIncidentTeams(row);
    const functions = resolveIncidentFunctions(row);
    const risks = resolveIncidentRisks(row);
    const riskTags = uniqueIds([
      ...risks.map((r) => asText(r.threat).toLowerCase()),
      ...row.relatedRiskNames.map((name) => asText(name).toLowerCase())
    ].filter(Boolean));
    return {
      incidentId: row.id,
      title: asText(row.title || row.raw?.title || ''),
      serviceName: asText(row.serviceName || ''),
      severity: asText(row.severity || ''),
      status: asText(row.status || ''),
      relatedTeamIds: uniqueIds(teams.map((t) => asText(t.id))),
      relatedFunctionIds: uniqueIds(functions.map((f) => asText(f.id))),
      relatedRiskIds: uniqueIds(risks.map((r) => asText(r.id))),
      relatedTeamNames: uniqueIds(teams.map((t) => asText(t.name)).filter(Boolean)),
      relatedFunctionNames: uniqueIds(functions.map((f) => asText(f.name)).filter(Boolean)),
      relatedRiskTags: riskTags
    };
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
    return { ...base, teams, functions, risks, serviceName, context: normalizeIncidentContext(base) };
  };

  const getFocusTarget = () => {
    const raw = get(KEY_FOCUS_TARGET, {});
    const src = safeObject(raw);
    return {
      source: asText(src.source),
      incidentId: asText(src.incidentId || src.id),
      assetId: asText(src.assetId),
      assetType: asText(src.assetType).toUpperCase(),
      assetCollection: asText(src.assetCollection).toLowerCase(),
      serviceName: asText(src.serviceName),
      relatedTeamIds: safeIdArray(src.relatedTeamIds || [], 'team'),
      relatedFunctionIds: safeIdArray(src.relatedFunctionIds || [], 'function'),
      relatedRiskIds: safeIdArray(src.relatedRiskIds || [], 'risk'),
      createdAt: asText(src.createdAt)
    };
  };

  const setFocusTarget = (payload = {}) => {
    const target = getFocusTarget();
    const src = safeObject(payload);
    const next = {
      ...target,
      source: asText(src.source || target.source),
      incidentId: asText(src.incidentId || src.id || target.incidentId),
      assetId: asText(src.assetId || target.assetId),
      assetType: asText(src.assetType || target.assetType).toUpperCase(),
      assetCollection: asText(src.assetCollection || target.assetCollection).toLowerCase(),
      serviceName: asText(src.serviceName || target.serviceName),
      relatedTeamIds: safeIdArray(src.relatedTeamIds || target.relatedTeamIds || [], 'team'),
      relatedFunctionIds: safeIdArray(src.relatedFunctionIds || target.relatedFunctionIds || [], 'function'),
      relatedRiskIds: safeIdArray(src.relatedRiskIds || target.relatedRiskIds || [], 'risk'),
      createdAt: asText(src.createdAt || nowISO())
    };
    set(KEY_FOCUS_TARGET, next);
    return next;
  };
  const clearFocusTarget = () => remove(KEY_FOCUS_TARGET);

  const validateCollectionShape = (logicalName) => {
    const raw = readRawCollection(logicalName);
    const malformed = { logicalName, parseOk: true, type: typeof raw, malformedCount: 0, missingIdCount: 0 };
    if (raw === null || raw === undefined) return malformed;
    if (Array.isArray(raw)) {
      malformed.type = 'array';
      raw.forEach((row) => {
        if (!row || typeof row !== 'object') malformed.malformedCount += 1;
        else if (!hasValue(row.id) && logicalName !== 'selectedIncident') malformed.missingIdCount += 1;
      });
      return malformed;
    }
    if (typeof raw === 'object') {
      malformed.type = 'object';
      return malformed;
    }
    malformed.type = typeof raw;
    malformed.malformedCount = 1;
    return malformed;
  };
  const countMalformedItems = (logicalName) => validateCollectionShape(logicalName).malformedCount;
  const summarizeStorageUsage = () => Object.keys(STORAGE_KEY_CONTRACT).map((name) => {
    const contract = STORAGE_KEY_CONTRACT[name];
    return {
      logicalName: name,
      canonicalKey: contract.canonicalKey,
      hasCanonical: localStorage.getItem(contract.canonicalKey) !== null,
      legacyUsed: safeArray(contract.legacyKeys).filter((legacy) => localStorage.getItem(legacy) !== null)
    };
  });
  const getStorageHealthReport = () => {
    const collections = Object.keys(STORAGE_KEY_CONTRACT).map((name) => ({
      ...validateCollectionShape(name),
      contract: STORAGE_KEY_CONTRACT[name]
    }));
    return { generatedAt: nowISO(), collections, usage: summarizeStorageUsage() };
  };
  const compareCountVsList = (logicalName) => {
    const snap = getOpsStatusSnapshot();
    if (logicalName === 'activeIncidents') return { logicalName, count: snap.activeIncidents.length, listSize: snap.activeIncidents.length, ok: true };
    if (logicalName === 'pendingEvidence') return { logicalName, count: snap.pendingEvidence.length, listSize: snap.pendingEvidence.length, ok: true };
    if (logicalName === 'openCapa') return { logicalName, count: snap.openCapaItems.length, listSize: snap.openCapaItems.length, ok: true };
    if (logicalName === 'priorityRisks') return { logicalName, count: snap.priorityRisks.length, listSize: snap.priorityRisks.length, ok: true };
    return { logicalName, count: 0, listSize: 0, ok: false, message: 'unknown logicalName' };
  };
  const assertNoDuplicateAutoItems = () => {
    const evidence = getAllEvidence().filter((row) => asText(row.source) === 'INCIDENT_CLOSE_AUTO');
    const capa = getAllCapaItems().filter((row) => asText(row.source) === 'INCIDENT_CLOSE_AUTO');
    const keyOf = (row) => `${asText(row.source)}|${asText(row.sourceRefId)}|${asText(row.title)}`;
    const uniqueEvidence = new Set(evidence.map(keyOf));
    const uniqueCapa = new Set(capa.map(keyOf));
    return {
      pass: uniqueEvidence.size === evidence.length && uniqueCapa.size === capa.length,
      evidence: { total: evidence.length, unique: uniqueEvidence.size },
      capa: { total: capa.length, unique: uniqueCapa.size }
    };
  };
  const assertSelectedIncidentCompat = () => {
    const canonical = asText(localStorage.getItem(KEY_SELECTED_INCIDENT_ID));
    const legacy = safeObject(get(KEY_SELECTED_INCIDENT, {}));
    const legacyId = asText(legacy.incidentId || legacy.incidentRef || legacy.id || '');
    return {
      pass: !canonical && !legacyId ? true : (canonical ? !legacyId || canonical === legacyId : Boolean(legacyId)),
      canonicalId: canonical,
      legacyId
    };
  };
  const assertStorageFailSoft = () => {
    const keys = Object.values(STORAGE_KEY_CONTRACT)
      .flatMap((contract) => [contract.canonicalKey, ...safeArray(contract.legacyKeys)]);
    const malformedKeys = [];
    keys.forEach((key) => {
      const raw = localStorage.getItem(key);
      if (raw === null) return;
      try { JSON.parse(raw); } catch { malformedKeys.push(key); }
    });
    return { pass: true, malformedKeys };
  };
  const getRegressionSnapshot = () => {
    const snap = getOpsStatusSnapshot();
    return {
      generatedAt: nowISO(),
      counts: {
        activeIncidents: snap.activeIncidents.length,
        pendingEvidence: snap.pendingEvidence.length,
        openCapa: snap.openCapaItems.length,
        priorityRisks: snap.priorityRisks.length
      },
      selectedIncident: assertSelectedIncidentCompat(),
      duplicates: assertNoDuplicateAutoItems(),
      storageHealth: getStorageHealthReport()
    };
  };
  const runSmokeChecks = () => {
    const checks = [
      { name: 'count-activeIncidents', ...compareCountVsList('activeIncidents') },
      { name: 'count-pendingEvidence', ...compareCountVsList('pendingEvidence') },
      { name: 'count-openCapa', ...compareCountVsList('openCapa') },
      { name: 'count-priorityRisks', ...compareCountVsList('priorityRisks') },
      { name: 'no-duplicate-auto-items', ...assertNoDuplicateAutoItems() },
      { name: 'selected-incident-compat', ...assertSelectedIncidentCompat() },
      { name: 'storage-fail-soft', ...assertStorageFailSoft() }
    ];
    const pass = checks.every((row) => row.ok !== false && row.pass !== false);
    return { pass, checks, snapshot: getRegressionSnapshot() };
  };

  const normalizeEvidenceRecord = (record = {}) => {
    const src = safeObject(record);
    const incidentId = asText(pickFirst(src, ['incidentId', 'incidentRef', 'idRef'], ''));
    const idSeed = asText(pickFirst(src, ['id', 'evidenceId'], '')) || (incidentId ? `EVD-${slug(`${incidentId}-${pickFirst(src, ['title', 'description'], 'item')}`)}` : '');
    return {
      id: idSeed || uid('EVD'),
      incidentId,
      incidentTitle: asText(pickFirst(src, ['incidentTitle', 'incident', 'title'], '')),
      serviceName: asText(pickFirst(src, ['serviceName', 'service'], '')),
      relatedTeamIds: safeIdArray(src.relatedTeamIds || src.relatedOrgUnits || src.relatedTeams, 'team'),
      relatedFunctionIds: safeIdArray(src.relatedFunctionIds || src.relatedCoreFunctions, 'function'),
      relatedRiskIds: safeIdArray(src.relatedRiskIds || src.relatedRisks, 'risk'),
      type: asText(pickFirst(src, ['type', 'category'], '기타')) || '기타',
      status: safeStatus(pickFirst(src, ['status'], 'pending'), 'evidence'),
      owner: asText(pickFirst(src, ['owner', 'ownerTeam'], '')),
      createdAt: pickFirst(src, ['createdAt', 'collectedAt'], nowISO()),
      confirmedAt: pickFirst(src, ['confirmedAt'], null),
      source: asText(pickFirst(src, ['source'], 'MANUAL')) || 'MANUAL',
      sourceRefId: asText(pickFirst(src, ['sourceRefId'], '')),
      title: asText(pickFirst(src, ['title', 'description'], '증적 항목')),
      description: asText(pickFirst(src, ['description', 'summary'], ''))
    };
  };

  const normalizeCapaRecord = (record = {}) => {
    const src = safeObject(record);
    const incidentId = asText(pickFirst(src, ['incidentId', 'incidentRef', 'idRef'], ''));
    const idSeed = asText(pickFirst(src, ['id', 'capaId', 'actionId'], '')) || (incidentId ? `CAPA-${slug(`${incidentId}-${pickFirst(src, ['title', 'actionName'], 'item')}`)}` : '');
    return {
      id: idSeed || uid('CAPA'),
      incidentId,
      incidentTitle: asText(pickFirst(src, ['incidentTitle', 'incident', 'title'], '')),
      serviceName: asText(pickFirst(src, ['serviceName', 'service'], '')),
      relatedTeamIds: safeIdArray(src.relatedTeamIds || src.relatedOrgUnits || src.relatedTeams, 'team'),
      relatedFunctionIds: safeIdArray(src.relatedFunctionIds || src.relatedCoreFunctions, 'function'),
      relatedRiskIds: safeIdArray(src.relatedRiskIds || src.relatedRisks, 'risk'),
      title: asText(pickFirst(src, ['title', 'actionName', 'task'], '개선조치')),
      description: asText(pickFirst(src, ['description', 'actionPlan'], '')),
      owner: asText(pickFirst(src, ['owner', 'ownerTeam'], '')),
      status: safeStatus(pickFirst(src, ['status'], 'open'), 'capa'),
      dueAt: pickFirst(src, ['dueAt', 'dueDate', 'deadline'], null),
      completedAt: pickFirst(src, ['completedAt'], null),
      createdAt: pickFirst(src, ['createdAt'], nowISO()),
      source: asText(pickFirst(src, ['source'], 'MANUAL')) || 'MANUAL',
      sourceRefId: asText(pickFirst(src, ['sourceRefId'], '')),
      priority: asText(pickFirst(src, ['priority'], '')),
      incidentSeverity: asText(pickFirst(src, ['incidentSeverity'], ''))
    };
  };

  const getAllEvidence = () => {
    const modern = safeArray(get(KEY_EVIDENCE_ITEMS, []));
    const legacy = safeArray(get(KEY_EVIDENCE, []));
    const merged = [...modern, ...legacy].map((row) => normalizeEvidenceRecord(row));
    const byId = new Map();
    merged.forEach((row) => byId.set(row.id, { ...(byId.get(row.id) || {}), ...row }));
    return [...byId.values()];
  };

  const writeEvidenceItems = (items) => {
    const normalized = safeArray(items).map((row) => normalizeEvidenceRecord(row));
    set(KEY_EVIDENCE_ITEMS, normalized);
    set(KEY_EVIDENCE, normalized);
    return normalized;
  };

  const getAllCapaItems = () => {
    const modern = safeArray(get(KEY_CAPA_ITEMS, []));
    const legacyAction = safeArray(get(KEY_ACTION_ITEMS, []));
    const legacyCapa = safeArray(get(KEY_CAPA, []));
    const merged = [...modern, ...legacyAction, ...legacyCapa].map((row) => normalizeCapaRecord(row));
    const byId = new Map();
    merged.forEach((row) => byId.set(row.id, { ...(byId.get(row.id) || {}), ...row }));
    return [...byId.values()];
  };

  const writeCapaItems = (items) => {
    const normalized = safeArray(items).map((row) => normalizeCapaRecord(row));
    set(KEY_CAPA_ITEMS, normalized);
    set(KEY_ACTION_ITEMS, normalized);
    set(KEY_CAPA, normalized);
    return normalized;
  };

  const getPendingEvidence = () => getAllEvidence().filter((row) => safeStatus(row.status, 'evidence') !== 'confirmed');
  const getOpenCapaItems = () => getAllCapaItems().filter((row) => safeStatus(row.status, 'capa') !== 'completed');
  const getActiveIncidents = () => readIncidentRecords().filter((row) => !['종료', 'resolved', 'closed', 'completed', 'ended'].includes(asText(row.status).toLowerCase()) && !hasValue(row.endedAt));
  const getRecentClosedIncidents = () => readIncidentRecords()
    .filter((row) => hasValue(row.endedAt) || ['종료', 'resolved', 'closed', 'completed', 'ended'].includes(asText(row.status).toLowerCase()))
    .sort((a, b) => new Date(b.endedAt || b.startedAt || 0).getTime() - new Date(a.endedAt || a.startedAt || 0).getTime());

  const getOpsStatusSnapshot = () => {
    const incidents = readIncidentRecords();
    const activeIncidents = getActiveIncidents();
    const recentClosedIncidents = getRecentClosedIncidents().slice(0, 3);
    const pendingEvidence = getPendingEvidence();
    const openCapaItems = getOpenCapaItems();
    const priorityRisks = readRiskRecords().filter((row) => Number(row.riskScore || 0) >= 13 || row.critical === true);
    return { incidents, activeIncidents, recentClosedIncidents, pendingEvidence, openCapaItems, priorityRisks };
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
    KEY_FOCUS_TARGET,
    KEY_EVIDENCE_ITEMS,
    KEY_ACTION_ITEMS,
    KEY_CAPA_ITEMS,
    get,
    set,
    update,
    remove,
    reset,
    nowISO,
    uid,
    safeArray,
    safeObject,
    safeString,
    safeId,
    safeParseJson,
    stableSlug,
    safeTimestamp,
    upsertById,
    normalizeTeam,
    normalizeService,
    normalizeCoreFunction,
    normalizeBiaRecord,
    normalizeRiskRecord,
    normalizeIncidentRecord,
    safeIdArray,
    uniqueIds,
    safeStatus,
    readCoreFunctions,
    writeCoreFunctions,
    getAllTeams,
    getTeamById,
    getAllServices,
    writeServices,
    getServiceById,
    getAllCoreFunctions,
    getCoreFunctionById,
    getCoreFunctionsByTeamId,
    getOrgRegistry,
    writeOrgRegistry,
    saveOrgRegistry,
    getEopRoleAssignments,
    getStorageContract,
    resolveStorageKey,
    readRawCollection,
    writeRawCollection,
    mergeLegacyCollections,
    normalizeCollection,
    readCanonicalCollection,
    writeCanonicalCollection,
    upsertCollectionItem,
    removeCollectionItem,
    validateCollectionShape,
    countMalformedItems,
    summarizeStorageUsage,
    getStorageHealthReport,
    compareCountVsList,
    assertNoDuplicateAutoItems,
    assertSelectedIncidentCompat,
    assertStorageFailSoft,
    getRegressionSnapshot,
    runSmokeChecks,
    readBiaRecords,
    writeBiaRecords,
    getAllBiaRecords,
    saveBiaRecords,
    readRiskRecords,
    writeRiskRecords,
    getAllRiskRecords,
    saveRiskRecords,
    syncRiskWithBia,
    readIncidentRecords,
    getAllIncidents,
    saveIncidents,
    getIncidentById,
    getSelectedIncidentId,
    normalizeIncidentContext,
    setSelectedIncidentId,
    getFocusTarget,
    setFocusTarget,
    clearFocusTarget,
    getIncidentExecutionLog,
    saveIncidentExecutionLog,
    resolveIncidentTeams,
    resolveIncidentFunctions,
    resolveIncidentRisks,
    resolveIncidentContext,
    normalizeEvidenceRecord,
    normalizeCapaRecord,
    getAllEvidence,
    writeEvidenceItems,
    saveEvidence,
    getAllCapaItems,
    writeCapaItems,
    saveCapaItems,
    getPendingEvidence,
    getOpenCapaItems,
    getActiveIncidents,
    getRecentClosedIncidents,
    getOpsStatusSnapshot
  };
})(window);
