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
    get,
    set,
    update,
    remove,
    reset,
    nowISO,
    uid,
  };
})(window);
