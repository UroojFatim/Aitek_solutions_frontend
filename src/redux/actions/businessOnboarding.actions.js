import { createAsyncThunk } from '@reduxjs/toolkit';
import businessOnboardingService from '@/services/businessOnboarding.service';
import { BUSINESS_ONBOARDING_REDUX } from '@/constants/businessOnboarding.constants';
import { spinnerActivate, spinnerDeactivate } from '../reducers/system.reducers';
import toast from 'react-hot-toast';

export const fetchOnboardingClients = createAsyncThunk(
  BUSINESS_ONBOARDING_REDUX.FETCH_CLIENTS,
  async (_, { rejectWithValue, dispatch }) => {
    dispatch(spinnerActivate(BUSINESS_ONBOARDING_REDUX.FETCH_CLIENTS));
    try {
      const response = await businessOnboardingService.getAllClients();
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch onboarding clients');
      return rejectWithValue(error?.response?.data || { message: error.message });
    } finally {
      dispatch(spinnerDeactivate(BUSINESS_ONBOARDING_REDUX.FETCH_CLIENTS));
    }
  }
);
