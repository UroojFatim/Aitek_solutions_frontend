import { createAsyncThunk } from '@reduxjs/toolkit';
import AuditService from '../../services/audit.service';
import { AUDIT_REDUX } from '../../constants/audit.constants';
import { spinnerActivate, spinnerDeactivate } from '../reducers/system.reducers';
import toast from 'react-hot-toast';

export const getAuditLogs = createAsyncThunk(
  AUDIT_REDUX.GET_AUDIT_LOGS,
  async (params, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(AUDIT_REDUX.GET_AUDIT_LOGS));
    try {
      const response = await AuditService.getAuditLogs(params);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch Audit Logs");
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(AUDIT_REDUX.GET_AUDIT_LOGS));
    }
  }
);

export const getAuditStats = createAsyncThunk(
  AUDIT_REDUX.GET_AUDIT_STATS,
  async (days = 7, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(AUDIT_REDUX.GET_AUDIT_STATS));
    try {
      const response = await AuditService.getAuditStats(days);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch Audit stats");
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(AUDIT_REDUX.GET_AUDIT_STATS));
    }
  }
);

export const setAuditFilters = createAsyncThunk(
  AUDIT_REDUX.SET_AUDIT_FILTERS,
  async (filters, { rejectWithValue }) => {
    try {
      return filters;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const clearAuditData = createAsyncThunk(
  AUDIT_REDUX.CLEAR_AUDIT_DATA,
  async (_, { rejectWithValue }) => {
    try {
      return null;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
