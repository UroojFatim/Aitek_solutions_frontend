export const AUDIT_ENDPOINTS = {
  GET_LOGS: '/audit/logs',
  GET_STATS: (days) => `/audit/stats?days=${days}`
};

export const AUDIT_REDUX = {
  GET_AUDIT_LOGS: 'audit/getAuditLogs',
  GET_AUDIT_STATS: 'audit/getAuditStats',
  SET_AUDIT_FILTERS: 'audit/setAuditFilters',
  CLEAR_AUDIT_DATA: 'audit/clearAuditData'
};

// Legacy action types (kept for backward compatibility if needed)
export const AUDIT_ACTIONS = {
  GET_AUDIT_LOGS_REQUEST: 'GET_AUDIT_LOGS_REQUEST',
  GET_AUDIT_LOGS_SUCCESS: 'GET_AUDIT_LOGS_SUCCESS',
  GET_AUDIT_LOGS_FAILURE: 'GET_AUDIT_LOGS_FAILURE',

  GET_AUDIT_STATS_REQUEST: 'GET_AUDIT_STATS_REQUEST',
  GET_AUDIT_STATS_SUCCESS: 'GET_AUDIT_STATS_SUCCESS',
  GET_AUDIT_STATS_FAILURE: 'GET_AUDIT_STATS_FAILURE',

  CLEAR_AUDIT_DATA: 'CLEAR_AUDIT_DATA',
  SET_AUDIT_FILTERS: 'SET_AUDIT_FILTERS'
};

// Filter options
export const CRUD_OPERATIONS = [
  { value: 'CREATE', label: 'Create' },
  { value: 'READ', label: 'Read' },
  { value: 'UPDATE', label: 'Update' },
  { value: 'DELETE', label: 'Delete' }
];

export const USER_ROLES_VALUES = [
  { value: 'User', label: 'User' },
  { value: 'SuperUser', label: 'Super User' },
  { value: 'Admin', label: 'Admin' },
  { value: 'SuperAdmin', label: 'Super Admin' }
];

export const TIME_PERIODS = [
  { value: '1', label: 'Last 24 hours' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' }
];
