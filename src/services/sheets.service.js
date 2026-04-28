// src/services/sheets.service.js
import httpClient from './httpClient';
import { SHEETS_ENDPOINTS } from '../constants/sheets.constants';

const sheetsService = {
  getAccountRows: (spreadsheet, accountId, params = {}) => {
    const search = new URLSearchParams(params).toString();
    const url =
      SHEETS_ENDPOINTS.GET_ACCOUNT_ROWS(spreadsheet, accountId) +
      (search ? `?${search}` : '');
    return httpClient.get(url);
  },
  createOrFetchUserSheet: async ({ businessId, businessEmail }) => {
    const res = await httpClient.post(
      SHEETS_ENDPOINTS.CREATE_OR_FETCH_USER_SHEET(),
      {
        business_id: businessId,
        business_email: businessEmail,
      }
    );
    return res.data?.data || res.data;
  },
  getUserSheet: async (businessId) => {
      const res = await httpClient.get(
        SHEETS_ENDPOINTS.GET_USER_SHEET(),
        { businessId }
    );
    return res.data?.data || res.data;
  },
  getAllUserSheets: async () => {
    const res = await httpClient.get(SHEETS_ENDPOINTS.GET_ALL_SHEETS());
    return res.data?.data || res.data;
  },
  syncUserSheets: async (businessId) => {
    const res = await httpClient.post(
      SHEETS_ENDPOINTS.SYNC_USER_SHEET(),    {
      business_id: businessId
    }
    );
    return res.data?.data || res.data;
  },
    getBookedForCurrentUser: async (businessId, sheetId) => {
    const res = await httpClient.get(SHEETS_ENDPOINTS.GET_BOOKED_FOR_CURRENT_USER(),    
      { businessId, sheetId }
    );
    // ApiResponse.ok => { success, message, data }
    return res.data || [];
  },
  getLeadsForCurrentUser: async (businessId, sheetId) => {
    const res = await httpClient.get(SHEETS_ENDPOINTS.GET_LEADS_FOR_CURRENT_USER(),    {
      businessId, 
      sheetId
    });
    return res.data || [];
  },
  deleteUserSheet: async (id) => {
    const res = await httpClient.delete(SHEETS_ENDPOINTS.DELETE_SHEET(id));
    return res.data || res;
  },
  restoreUserSheet: async (id) => {
    const res = await httpClient.patch(SHEETS_ENDPOINTS.RESTORE_SHEET(id));
    return res.data || res;
  },
  activateUserSheet: async (id) => {
    const res = await httpClient.patch(SHEETS_ENDPOINTS.ACTIVATE_SHEET(id));
    return res.data || res;
  },
  updateSheetStatus: async (id, status) => {
    const res = await httpClient.patch(SHEETS_ENDPOINTS.UPDATE_SHEET_STATUS(id), { status });
    return res.data || res;
  },
  shareSheetAccess: async (id, email, role = 'writer') => {
    const res = await httpClient.post(SHEETS_ENDPOINTS.SHARE_SHEET_ACCESS(id), { email, role });
    return res.data || res;
  },
};

export default sheetsService;
