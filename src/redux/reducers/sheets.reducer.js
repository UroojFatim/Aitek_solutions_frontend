// src/redux/reducers/sheets.slice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchAccountRows,createOrFetchUserSheet,syncUserSheets,fetchUserSheet } from '../actions/sheets.actions';

const initialState = {
  spreadsheet: null,
  table: null,
  accountId: null,
  pagination: { total: 0, page: 1, limit: 50, totalPages: 0 },
  order_by: null,
  order_dir: 'DESC',
  rows: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  lastFetchedAt: null,

  sheetRecord: null,
  loading: false,
  lastSyncedAt: null,
  error: null,

};

const sheetsSlice = createSlice({
  name: 'sheets',
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountRows.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAccountRows.fulfilled, (state, action) => {
        const payload = action.payload || {};
        state.status = 'succeeded';
        state.spreadsheet = payload.spreadsheet ?? null;
        state.table = payload.table ?? null;
        state.accountId = payload.accountId ?? null;
        state.pagination = payload.pagination ?? initialState.pagination;
        state.order_by = payload.order_by ?? null;
        state.order_dir = payload.order_dir ?? 'DESC';
        state.rows = Array.isArray(payload.rows) ? payload.rows : [];
        state.error = null;
        state.lastFetchedAt = new Date().toISOString();
      })
      .addCase(fetchAccountRows.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload?.message ||
          action.error?.message ||
          'Failed to fetch account rows';
      })
      .addCase(createOrFetchUserSheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrFetchUserSheet.fulfilled, (state, action) => {
        state.loading = false;
        state.sheetRecord = action.payload;
      })
      .addCase(createOrFetchUserSheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create spreadsheet";
      })

            // NEW: fetchUserSheet
      .addCase(fetchUserSheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSheet.fulfilled, (state, action) => {
        state.loading = false;
        state.sheetRecord = action.payload; // record from backend (or null)
      })
      .addCase(fetchUserSheet.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch user sheet";
      })

      // NEW: syncUserSheets
      .addCase(syncUserSheets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncUserSheets.fulfilled, (state) => {
        state.loading = false;
        state.lastSyncedAt = new Date().toISOString();
      })
      .addCase(syncUserSheets.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to sync sheets";
      });
  },
});

export default sheetsSlice.reducer;