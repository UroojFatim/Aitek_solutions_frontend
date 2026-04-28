// src/redux/actions/ghl.actions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import ghlService from '@/services/ghl.service';
import { spinnerActivate, spinnerDeactivate } from '../reducers/system.reducers';
import { GHL_REDUX } from '@/constants/ghl.constants';

// Fetch GHL Pipelines
export const fetchGhlPipelines = createAsyncThunk(
  GHL_REDUX.FETCH_PIPELINES,
  async (locationId, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(GHL_REDUX.FETCH_PIPELINES));
    try {
      const pipelines = await ghlService.fetchPipelines(locationId);
      return pipelines;
    } catch (error) {
      const errorMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Failed to fetch pipelines';

      toast.error(errorMsg);

      return rejectWithValue(error?.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(GHL_REDUX.FETCH_PIPELINES));
    }
  }
);

export const fetchGhlOpportunitiesByPipelineId = createAsyncThunk(
  GHL_REDUX.FETCH_OPPORTUNIRIES_BY_PIPELINE_ID,
  async ({ locationId, pipelineId }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(GHL_REDUX.FETCH_OPPORTUNIRIES_BY_PIPELINE_ID));
    try {
      const opportunities = await ghlService.fetchOpportunitiesByPipelineId(locationId, pipelineId);
      return opportunities;
    } catch (error) {

      const errorMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Failed to fetch opportunities';

      toast.error(errorMsg);

      return rejectWithValue(error?.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(GHL_REDUX.FETCH_OPPORTUNIRIES_BY_PIPELINE_ID));
    }
  }
);

export const silentlyFetchGhlOpportunitiesByPipelineId = createAsyncThunk(
  "GHL/SILENT_FETCH_OPPORTUNITIES",
  async ({ locationId, pipelineId }) => {
    try {
      const opportunities = await ghlService.fetchOpportunitiesByPipelineId(
        locationId,
        pipelineId
      );

      return opportunities;
    } catch (error) {
      console.warn("Silent polling error:", error?.message);
      return []; // return empty array but DO NOT break UI
    }
  }
);


export const fetchGhlConversations = createAsyncThunk(
  GHL_REDUX.FETCH_CONVERSATIONS,
  async (locationId, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(GHL_REDUX.FETCH_CONVERSATIONS));
    try {
      const conversations = await ghlService.fetchConversations(locationId);
      return conversations;
    } catch (error) {
      const errorMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Failed to fetch conversations';

      toast.error(errorMsg);

      return rejectWithValue(error?.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(GHL_REDUX.FETCH_CONVERSATIONS));
    }
  }
);

export const fetchMessages = createAsyncThunk(
  GHL_REDUX.FETCH_MESSAGES,
  async (conversationId, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(GHL_REDUX.FETCH_MESSAGES));
    try {
      const messages = await ghlService.fetchMessages(conversationId);
      return messages;
    } catch (error) {
      const errorMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Failed to fetch messages';

      toast.error(errorMsg);

      return rejectWithValue(error?.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(GHL_REDUX.FETCH_MESSAGES));
    }
  }
);

export const fetchUsers = createAsyncThunk(
  GHL_REDUX.FETCH_USERS,
  async (locationId, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(GHL_REDUX.FETCH_USERS));
    try {
      const users = await ghlService.fetchUsers(locationId);
      return users;
    } catch (error) {
      const errorMsg =
        error?.response?.data?.error ||
        error?.response?.data?.users ||
        error?.message ||
        'Failed to fetch users';

      toast.error(errorMsg);

      return rejectWithValue(error?.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(GHL_REDUX.FETCH_USERS));
    }
  }
);