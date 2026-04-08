(function (global) {
  'use strict';

  const KEY_FOCUS_TARGET = 'bcmsFocusTarget';
  const asText = (v) => String(v ?? '').trim();
  const safeArray = (v) => Array.isArray(v) ? v : [];
  const uniqueIds = (list) => [...new Set(safeArray(list).map((x) => asText(x)).filter(Boolean))];
  const normalizeTextList = (value) => {
    if (Array.isArray(value)) return uniqueIds(value);
    if (typeof value === 'string') return uniqueIds(value.split(',').map((x) => x.trim()));
    return [];
  };

  const normalizeResponseAsset = (asset = {}) => {
    const src = asset && typeof asset === 'object' ? asset : {};
    return {
      id: asText(src.id),
      type: asText(src.type).toUpperCase(),
      collection: asText(src.collection).toLowerCase(),
      title: asText(src.title),
      href: asText(src.href),
      teamIds: normalizeTextList(src.teamIds),
      functionIds: normalizeTextList(src.functionIds),
      serviceNames: normalizeTextList(src.serviceNames).map((x) => x.toLowerCase()),
      riskTags: normalizeTextList(src.riskTags).map((x) => x.toLowerCase()),
      severityTriggers: normalizeTextList(src.severityTriggers).map((x) => x.toLowerCase()),
      keywords: normalizeTextList(src.keywords).map((x) => x.toLowerCase()),
      priority: Number(src.priority || 0) || 0,
      active: src.active !== false,
      label: asText(src.label || ''),
      description: asText(src.description || '')
    };
  };

  const RESPONSE_ASSETS = [
    {
      id: 'library-sop-main', type: 'SOP', collection: 'library', title: 'SOP (평시 운영)', href: '../library/sop.html',
      keywords: ['표준', '운영', '점검', '절차'], riskTags: ['운영', '절차'], severityTriggers: ['sev3', 'sev4', 'sev5'],
      priority: 40, active: true
    },
    {
      id: 'library-eop-main', type: 'EOP', collection: 'library', title: 'EOP (비상 대응)', href: '../library/eop.html',
      keywords: ['비상', '상황전파', '보고', '화재', '안전'], riskTags: ['안전', '시설', '보안'], severityTriggers: ['sev1', 'sev2', '심각', '치명'],
      priority: 80, active: true
    },
    {
      id: 'library-drp-main', type: 'DRP', collection: 'library', title: 'DRP (IT 복구) 참고 문서', href: '../library/drp.html',
      keywords: ['복구', '전환', 'runbook', '네트워크', '서버', 'db'], riskTags: ['복구', '전환', '장애'], severityTriggers: ['sev1', 'sev2', '심각', '치명'],
      priority: 85, active: true
    },
    {
      id: 'strategy-drp-main', type: 'DRP', collection: 'strategy', title: 'DRP 절차 관리 (실행계획)', href: '../strategy-plans/drp.html',
      keywords: ['실행계획', '발동', '복구절차', 'drp'], riskTags: ['복구', 'drp'], severityTriggers: ['sev1', 'sev2', '심각', '치명'],
      priority: 90, active: true
    },
    {
      id: 'strategy-bcp-main', type: 'BCP', collection: 'strategy', title: 'BCP 전략 관리', href: '../strategy-plans/bcp.html',
      keywords: ['업무연속', '대체', '자원', '인력', '우회'], riskTags: ['연속성', '자원', '중단'], severityTriggers: ['sev1', 'sev2', '심각', '치명'],
      priority: 88, active: true
    }
  ].map((row) => normalizeResponseAsset(row)).filter((row) => row.id && row.type && row.collection && row.href && row.active);

  const getAllResponseAssets = () => RESPONSE_ASSETS.slice();
  const getResponseAssetById = (id) => getAllResponseAssets().find((row) => row.id === asText(id)) || null;
  const getAssetsByType = (type) => getAllResponseAssets().filter((row) => row.type === asText(type).toUpperCase());
  const getAssetsByCollection = (collection) => getAllResponseAssets().filter((row) => row.collection === asText(collection).toLowerCase());

  const normalizeFocusTarget = (value = {}) => {
    const src = value && typeof value === 'object' ? value : {};
    return {
      source: asText(src.source || ''),
      incidentId: asText(src.incidentId || src.id || ''),
      assetId: asText(src.assetId || ''),
      assetType: asText(src.assetType || '').toUpperCase(),
      assetCollection: asText(src.assetCollection || '').toLowerCase(),
      serviceName: asText(src.serviceName || ''),
      relatedTeamIds: uniqueIds(src.relatedTeamIds),
      relatedFunctionIds: uniqueIds(src.relatedFunctionIds),
      relatedRiskIds: uniqueIds(src.relatedRiskIds),
      createdAt: asText(src.createdAt || '')
    };
  };

  const readFocusTarget = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY_FOCUS_TARGET) || 'null');
      return normalizeFocusTarget(parsed || {});
    } catch {
      return normalizeFocusTarget({});
    }
  };

  const writeFocusTarget = (payload = {}) => {
    const next = normalizeFocusTarget(payload);
    localStorage.setItem(KEY_FOCUS_TARGET, JSON.stringify(next));
    return next;
  };

  global.ResponseAssetRegistry = {
    normalizeResponseAsset,
    getAllResponseAssets,
    getResponseAssetById,
    getAssetsByType,
    getAssetsByCollection,
    normalizeFocusTarget,
    readFocusTarget,
    writeFocusTarget,
    KEY_FOCUS_TARGET
  };
})(window);
