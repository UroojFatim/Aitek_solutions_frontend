// src/redux/actions/sheets.actions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { SHEETS_REDUX } from '../../constants/sheets.constants';
import sheetsService from '../../services/sheets.service';
import { spinnerActivate, spinnerDeactivate } from '../reducers/system.reducers';
import toast from 'react-hot-toast';

export const fetchAccountRows = createAsyncThunk(
  SHEETS_REDUX.FETCH_ACCOUNT_ROWS,
  async ({ spreadsheet, accountId, params }, { rejectWithValue, dispatch }) => {
    const spinnerKey = `${SHEETS_REDUX.FETCH_ACCOUNT_ROWS}:${spreadsheet}:${accountId}`;
    dispatch(spinnerActivate(spinnerKey));
    try {
      const res = await sheetsService.getAccountRows(spreadsheet, accountId, params);
      return res.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to fetch account rows');
      return rejectWithValue(err?.response?.data || { message: 'Request failed' });
    } finally {
      dispatch(spinnerDeactivate(spinnerKey));
    }
  }
);

export const createOrFetchUserSheet = createAsyncThunk(
  SHEETS_REDUX.CREATE_OR_FETCH_USER_SHEET,
  async ({ businessId, businessEmail }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(SHEETS_REDUX.CREATE_OR_FETCH_USER_SHEET));

    try {
      const record = await sheetsService.createOrFetchUserSheet({
        businessId,
        businessEmail,
      });
      return record;
    } catch (error) {
      const errorMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create spreadsheet";

      toast.error(errorMsg);

      return rejectWithValue(
        error?.response?.data || { message: error.message }
      );
    } finally {
      dispatch(spinnerDeactivate(SHEETS_REDUX.CREATE_OR_FETCH_USER_SHEET));
    }
  }
);

export const fetchUserSheet = createAsyncThunk(
  SHEETS_REDUX.GET_USER_SHEET,
      async ({ businessId }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(SHEETS_REDUX.GET_USER_SHEET));

    try {
      // backend uses auth user; userId param is optional
      const record = await sheetsService.getUserSheet(businessId);
      
      // If record is an array (multiple sheets), find active or last inactive
      if (Array.isArray(record)) {
        const activeSheet = record.find(sheet => sheet.status === 'active');
        if (activeSheet) {
          return activeSheet;
        }
        // If no active sheet, return the last inactive one
        const inactiveSheets = record.filter(sheet => sheet.status === 'inactive');
        if (inactiveSheets.length > 0) {
          return inactiveSheets[inactiveSheets.length - 1];
        }
        // If no active or inactive, return the last one (deleted status)
        return record[record.length - 1] || null;
      }
      
      return record; // sheetsService should already unwrap data
    } catch (error) {
      const errorMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch user sheet";

      toast.error(errorMsg);

      return rejectWithValue(
        error?.response?.data || { message: error.message }
      );
    } finally {
      dispatch(spinnerDeactivate(SHEETS_REDUX.GET_USER_SHEET));
    }
  }
);

export const syncUserSheets = createAsyncThunk(
  SHEETS_REDUX.SYNC_USER_SHEET,
  async ({ businessId } = {}, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(SHEETS_REDUX.SYNC_USER_SHEET));

    try {
      const result = await sheetsService.syncUserSheets(businessId);

      // Optional: success toast
      const msg =
        result?.message ||
        result?.data?.message ||
        "Sheets synced successfully";
      toast.success(msg);

      return result;
    } catch (error) {
      const errorMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to sync sheets";

      toast.error(errorMsg);

      return rejectWithValue(
        error?.response?.data || { message: error.message }
      );
    } finally {
      dispatch(spinnerDeactivate(SHEETS_REDUX.SYNC_USER_SHEET));
    }
  }
);
