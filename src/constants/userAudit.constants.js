// src/constants/userAudit.constants.js

export const USER_AUDIT_ENDPOINTS = {
  GET_LOGS: "/audit/user/logs",
  GET_STATS: (days) => `/audit/user/stats?days=${days}`,
};

export const USER_AUDIT_REDUX = {
  GET_USER_AUDIT_LOGS: "userAudit/getAuditLogs",
  GET_USER_AUDIT_STATS: "userAudit/getAuditStats",
  SET_USER_AUDIT_FILTERS: "userAudit/setAuditFilters",
  CLEAR_USER_AUDIT_DATA: "userAudit/clearAuditData",
};

// Filter options (no userRole here, it's always 'User')
export const USER_AUDIT_CRUD_OPERATIONS = [
  { value: "CREATE", label: "Create" },
  { value: "READ", label: "Read" },
  { value: "UPDATE", label: "Update" },
  { value: "DELETE", label: "Delete" },
];

export const USER_AUDIT_TIME_PERIODS = [
  { value: "1", label: "Last 24 hours" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];
