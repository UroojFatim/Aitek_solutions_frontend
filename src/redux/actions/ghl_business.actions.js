import { createAsyncThunk } from '@reduxjs/toolkit';
import { GHL_REDUX } from '@/constants/ghl_business.constants';
import ghlService from '@/services/ghl_business.service';
import { spinnerActivate, spinnerDeactivate } from '../reducers/system.reducers';

export const getAllBusinesses = createAsyncThunk(
  GHL_REDUX.GET_BUSINESSES,
  async (_, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(GHL_REDUX.GET_BUSINESSES));
    try {
      const response = await ghlService.getAllBusinesses();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(GHL_REDUX.GET_BUSINESSES));
    }
  }
);

export const getAllPipelines = createAsyncThunk(
  GHL_REDUX.GET_PIPELINES,
  async (_, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(GHL_REDUX.GET_PIPELINES));
    try {
      const response = await ghlService.getAllPipelines();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(GHL_REDUX.GET_PIPELINES));
    }
  }
);

export const assignPipelineToBusiness = createAsyncThunk(
  GHL_REDUX.ASSIGN_PIPELINE,
  async ({ business_id, pipeline_id, callback }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(GHL_REDUX.ASSIGN_PIPELINE));
    try {
      const response = await ghlService.assignPipelineToBusiness({ business_id, pipeline_id });
      callback?.();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(GHL_REDUX.ASSIGN_PIPELINE));
    }
  }
);

export const getAssignedPipelines = createAsyncThunk(
  GHL_REDUX.GET_ASSIGNED_PIPELINES,
  async (_, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(GHL_REDUX.GET_ASSIGNED_PIPELINES));
    try {
      const response = await ghlService.getAssignedPipelines();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(GHL_REDUX.GET_ASSIGNED_PIPELINES));
    }
  }
);

export const getBusinessPipelinesByBusinessId = createAsyncThunk(
  GHL_REDUX.GET_BUSINESS_PIPELINES_BY_ID,
  async (businessId, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(GHL_REDUX.GET_BUSINESS_PIPELINES_BY_ID));
    try {
      const response = await ghlService.getBusinessPipelinesByBusinessId(businessId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(GHL_REDUX.GET_BUSINESS_PIPELINES_BY_ID));
    }
  }
);

export const deletePipeline = createAsyncThunk(
  GHL_REDUX.DELETE_PIPELINE,
  async (id, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(GHL_REDUX.DELETE_PIPELINE));
    try {
      await ghlService.deletePipeline(id);
      toast.success('Assign Pipeline deleted successfully!');
      return id;
    } catch (error) {
      const errorMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete Pipeline';
      toast.error(errorMsg);
      return rejectWithValue(error?.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(GHL_REDUX.DELETE_PIPELINE));
    }
  }
);