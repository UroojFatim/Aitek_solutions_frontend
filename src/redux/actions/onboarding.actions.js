import { createAsyncThunk } from '@reduxjs/toolkit';
import onboardingService from '../../services/onboarding.service';
import { ONBOARDING_REDUX } from '../../constants/onboarding.constants';
import { spinnerActivate, spinnerDeactivate } from '../reducers/system.reducers';
import toast from 'react-hot-toast';

export const fetchStepDetails = createAsyncThunk(
  ONBOARDING_REDUX.FETCH_STEP_DETAILS,
  async (stepId, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(ONBOARDING_REDUX.FETCH_STEP_DETAILS));
    try {
      const response = await onboardingService.getOnboardingStepDetails(stepId);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch step details");
      return rejectWithValue(error.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(ONBOARDING_REDUX.FETCH_STEP_DETAILS));
    }
  }
); 

export const fetchBusinessStepDetails = createAsyncThunk(
  ONBOARDING_REDUX.FETCH_BUSINESS_STEP_DETAILS,
  async ({ stepId, businessId }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(ONBOARDING_REDUX.FETCH_BUSINESS_STEP_DETAILS));
    try {
      const response = await onboardingService.getBusinessStepDetails(stepId, businessId);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch business step details");
      return rejectWithValue(error.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(ONBOARDING_REDUX.FETCH_BUSINESS_STEP_DETAILS));
    }
  }
); 

export const updateBusinessSection = createAsyncThunk(
  'onboarding/updateBusinessSection',
  async ({ sectionName, businessId, data }, { rejectWithValue, dispatch }) => {
    const spinnerKey = `onboarding/updateBusinessSection/${sectionName}`;
    dispatch(spinnerActivate(spinnerKey));
    try {
      const response = await onboardingService.updateBusinessSection(sectionName, businessId, data);
      toast.success('Section updated');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update section');
      return rejectWithValue(error.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(spinnerKey));
    }
  }
);

export const submitOnboardingStep = createAsyncThunk(
  ONBOARDING_REDUX.SUBMIT_STEP,
  async ({ data, endpoint }, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(ONBOARDING_REDUX.SUBMIT_STEP));
    try {
      const response = await onboardingService.submitOnboardingStep(data, endpoint);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit onboarding step");
      return rejectWithValue(error.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(ONBOARDING_REDUX.SUBMIT_STEP));
    }
  }
);

export const trackStepProgress = createAsyncThunk(
  ONBOARDING_REDUX.TRACK_STEP_PROGRESS,
  async (stepId, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(ONBOARDING_REDUX.TRACK_STEP_PROGRESS));
    try {
      const response = await onboardingService.trackStepProgress(stepId);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to track step progress");
      return rejectWithValue(error.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(ONBOARDING_REDUX.TRACK_STEP_PROGRESS));
    }
  }
);