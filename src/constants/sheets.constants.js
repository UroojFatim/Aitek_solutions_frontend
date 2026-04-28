export const SHEETS_ENDPOINTS = {
  GET_ACCOUNT_ROWS: (spreadsheet, accountId) =>
    `/sheets/${spreadsheet}/accounts/${accountId}`,
  CREATE_OR_FETCH_USER_SHEET: () => `/sheets/create`,
  SYNC_USER_SHEET: () => `/sheets/sync`,
  GET_USER_SHEET: () => `/sheets/me`,
  GET_ALL_SHEETS: () => `/sheets/all`,
  GET_BOOKED_FOR_CURRENT_USER: () => `/sheets/booked`,
  GET_LEADS_FOR_CURRENT_USER: () => `/sheets/leads`,
  DELETE_SHEET: (id) => `/sheets/${id}`,
  RESTORE_SHEET: (id) => `/sheets/${id}/restore`,
  ACTIVATE_SHEET: (id) => `/sheets/${id}/activate`,
  UPDATE_SHEET_STATUS: (id) => `/sheets/${id}/status`,
  SHARE_SHEET_ACCESS: (id) => `/sheets/${id}/share`,

};

export const SHEETS_REDUX = {
  FETCH_ACCOUNT_ROWS: 'sheets/fetchAccountRows',
  CLEAR: 'sheets/clear',
  CREATE_OR_FETCH_USER_SHEET: "sheets/createOrFetchUserSheet",
  SYNC_USER_SHEET: "sheets/syncUserSheet",
  GET_USER_SHEET: "sheets/getUserSheet",
  GET_BOOKED_FOR_CURRENT_USER: "sheets/getBookedForCurrentUser",
  GET_LEADS_FOR_CURRENT_USER: "sheets/getLeadsForCurrentUser",
};
