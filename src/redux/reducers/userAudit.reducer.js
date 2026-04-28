// src/redux/reducers/userAudit.reducer.js
import { createSlice } from "@reduxjs/toolkit";
import {
  getUserAuditLogs,
  getUserAuditStats,
  setUserAuditFilters,
  clearUserAuditData,
} from "../actions/userAudit.actions";

const initialState = {
  logs: [],
  stats: {
    roleStats: [],
    userStats: [],
    period: "",
  },
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  },
  filters: {
    userId: "",
    operation: "",
    days: 30,
  },
  error: null,
};

const userAuditReducer = createSlice({
  name: "userAudit",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Logs
      .addCase(getUserAuditLogs.fulfilled, (state, action) => {
        state.logs = action.payload.logs;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
        state.error = null;
      })
      .addCase(getUserAuditLogs.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Stats
      .addCase(getUserAuditStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(getUserAuditStats.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Filters
      .addCase(setUserAuditFilters.fulfilled, (state, action) => {
        state.filters = { ...state.filters, ...action.payload };
      })
      .addCase(setUserAuditFilters.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Clear
      .addCase(clearUserAuditData.fulfilled, () => initialState)
      .addCase(clearUserAuditData.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default userAuditReducer.reducer;
