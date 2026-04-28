import { createSlice } from '@reduxjs/toolkit';
import { getAuditLogs, getAuditStats, setAuditFilters, clearAuditData } from '../actions/audit.actions';

const initialState = {
  logs: [],
  stats: {
    roleStats: [],
    userStats: [],
    period: ''
  },
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  },
  filters: {
    businessId: '',
    userId: '',
    userRole: '',
    operation: '',
    days: 30
  },
  error: null
};

const auditReducer = createSlice({
  name: 'audit',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get audit logs
      .addCase(getAuditLogs.fulfilled, (state, action) => {
        state.logs = action.payload.logs;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        };
        state.error = null;
      })
      .addCase(getAuditLogs.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Get audit stats
      .addCase(getAuditStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(getAuditStats.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Set audit filters
      .addCase(setAuditFilters.fulfilled, (state, action) => {
        state.filters = { ...state.filters, ...action.payload };
      })
      .addCase(setAuditFilters.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Clear audit data
      .addCase(clearAuditData.fulfilled, (state) => {
        return initialState;
      })
      .addCase(clearAuditData.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});

export default auditReducer.reducer;
