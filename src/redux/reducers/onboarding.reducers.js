import { createSlice } from '@reduxjs/toolkit';
import { fetchStepDetails, trackStepProgress, fetchBusinessStepDetails } from '../actions/onboarding.actions';

const initialState = {
  stepDetails: null,
  businessStepDetails: null,
  error: null,
  progressTracking: {}
};

const onboardingReducer = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    clearStepDetails: (state) => {
      state.stepDetails = null;
      state.businessStepDetails = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStepDetails.fulfilled, (state, action) => {
        state.stepDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchStepDetails.rejected, (state, action) => {
        state.stepDetails = null;
        state.error = action.payload;
      })
      .addCase(fetchBusinessStepDetails.fulfilled, (state, action) => {
        state.businessStepDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchBusinessStepDetails.rejected, (state, action) => {
        state.businessStepDetails = null;
        state.error = action.payload;
      })
      .addCase(trackStepProgress.fulfilled, (state, action) => {
        state.progressTracking = action.payload;
        state.error = null;
      })
      .addCase(trackStepProgress.rejected, (state, action) => {
        state.progressTracking = {};
        state.error = action.payload;
      });
  },
});

export const { clearStepDetails } = onboardingReducer.actions;
export default onboardingReducer.reducer; 