import { createAsyncThunk } from '@reduxjs/toolkit';
import businessService from '../../services/business.service';
import { BUSINESS_REDUX } from '../../constants/business.constants';
import { spinnerActivate, spinnerDeactivate } from '../reducers/system.reducers';
import toast from 'react-hot-toast';

export const fetchBusinesses = createAsyncThunk(
  BUSINESS_REDUX.FETCH_ALL,
  async (_, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(BUSINESS_REDUX.FETCH_ALL));
    try {
      const response = await businessService.getAllBusinesses();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(BUSINESS_REDUX.FETCH_ALL));
    }
  }
);

export const fetchBusinessById = createAsyncThunk(
  BUSINESS_REDUX.FETCH_BY_ID,
  async (id, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(BUSINESS_REDUX.FETCH_BY_ID));
    try {
      const response = await businessService.getBusinessById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(BUSINESS_REDUX.FETCH_BY_ID));
    }
  }
);

export const fetchBusinessesByUser = createAsyncThunk(
  'business/fetchByUser',
  async (userId, { rejectWithValue, dispatch }) => {
    // no global constant currently, so use a custom bookkeeping key for spinner
    dispatch(spinnerActivate('business/fetchByUser'));
    try {
      const response = await businessService.getBusinessesByUser(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate('business/fetchByUser'));
    }
  }
);

export const createBusiness = createAsyncThunk(
  BUSINESS_REDUX.CREATE,
  async ({data, callback}, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(BUSINESS_REDUX.CREATE));
    try {
      const response = await businessService.createBusiness(data);
      callback?.();
      toast.success("Business created successfully");
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(BUSINESS_REDUX.CREATE));
    }
  }
);

export const updateBusiness = createAsyncThunk(
  BUSINESS_REDUX.UPDATE,
  async ({ id, businessData, callback }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(BUSINESS_REDUX.UPDATE));
    try {
      const response = await businessService.updateBusiness(id, businessData);
      callback?.();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(BUSINESS_REDUX.UPDATE));
    }
  }
);

export const updateOnboardingStep = createAsyncThunk(
  BUSINESS_REDUX.UPDATE_ONBOARDING_STEP,
  async ({ businessId, stepId, status, callback }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(BUSINESS_REDUX.UPDATE_ONBOARDING_STEP));
    try {
      const response = await businessService.updateOnboardingStep(businessId, stepId, status);
      if (callback) callback();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(BUSINESS_REDUX.UPDATE_ONBOARDING_STEP));
    }
  }
);

export const fetchBusinessDetails = createAsyncThunk(
  BUSINESS_REDUX.FETCH_DETAILS,
  async (_, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(BUSINESS_REDUX.FETCH_DETAILS));
    try {
      const response = await businessService.getBusinessDetails();
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch business details");
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(BUSINESS_REDUX.FETCH_DETAILS));
    }
  }
);

export const updateOnboardingSteps = createAsyncThunk(
  BUSINESS_REDUX.UPDATE_ONBOARDING_STEPS,
  async ({ businessId, steps, callback }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(BUSINESS_REDUX.UPDATE_ONBOARDING_STEPS));
    try {
      const response = await businessService.updateOnboardingSteps(businessId, steps);
      if (callback) callback();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(spinnerDeactivate(BUSINESS_REDUX.UPDATE_ONBOARDING_STEPS));
    }
  }
);