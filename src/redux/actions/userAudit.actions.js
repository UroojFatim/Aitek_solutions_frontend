// src/redux/actions/userAudit.actions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import UserAuditService from "../../services/userAudit.service";
import { USER_AUDIT_REDUX } from "../../constants/userAudit.constants";
import { spinnerActivate, spinnerDeactivate } from "../reducers/system.reducers";
import toast from "react-hot-toast";

export const getUserAuditLogs = createAsyncThunk(
  USER_AUDIT_REDUX.GET_USER_AUDIT_LOGS,
  async (params, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(USER_AUDIT_REDUX.GET_USER_AUDIT_LOGS));
    try {
      const response = await UserAuditService.getUserAuditLogs(params);
      return response;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch User Audit Logs"
      );
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(USER_AUDIT_REDUX.GET_USER_AUDIT_LOGS));
    }
  }
);

export const getUserAuditStats = createAsyncThunk(
  USER_AUDIT_REDUX.GET_USER_AUDIT_STATS,
  async (days = 7, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(USER_AUDIT_REDUX.GET_USER_AUDIT_STATS));
    try {
      const response = await UserAuditService.getUserAuditStats(days);
      return response;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch User Audit stats"
      );
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(USER_AUDIT_REDUX.GET_USER_AUDIT_STATS));
    }
  }
);

export const setUserAuditFilters = createAsyncThunk(
  USER_AUDIT_REDUX.SET_USER_AUDIT_FILTERS,
  async (filters, { rejectWithValue }) => {
    try {
      return filters;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const clearUserAuditData = createAsyncThunk(
  USER_AUDIT_REDUX.CLEAR_USER_AUDIT_DATA,
  async (_, { rejectWithValue }) => {
    try {
      return null;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
