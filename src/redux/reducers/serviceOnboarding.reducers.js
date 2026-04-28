import { createSlice } from "@reduxjs/toolkit";
import { fetchServices, trackServiceProgress, fetchServiceDetails, fetchBusinessServiceDetails , updateSectionAnswers} from "../actions/serviceOnboarding.actions";

const initialState = {
  pages: [],
  serviceDetails: null,
  progressTracking: {},

  // Admin/business scoped
  businessServiceDetails: null,
  lastUpdatedSectionId: null,

  // UX flags:
  isLoading: false,
  sections: [],
  error: null,

};

const serviceOnboardingSlice = createSlice({
  name: "service_onboarding",
  initialState,
  reducers: {
    clearServiceOnboardingState: (state) => {
      state.pages = [];
      state.serviceDetails = null;
      state.sections = [];
      state.error = null;
      state.businessServiceDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Services list
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.pages = action.payload;
        state.error = null;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Single service schema
      .addCase(fetchServiceDetails.fulfilled, (state, action) => {
        state.serviceDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchServiceDetails.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Progress
      .addCase(trackServiceProgress.fulfilled, (state, action) => {
        state.progressTracking = action.payload;
        state.error = null;
      })
      .addCase(trackServiceProgress.rejected, (state, action) => {
        state.progressTracking = {};
        state.error = action.payload;
      })

      // Business filled answers for admin view
      .addCase(fetchBusinessServiceDetails.fulfilled, (state, action) => {
        state.businessServiceDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchBusinessServiceDetails.rejected, (state, action) => {
        state.businessServiceDetails = null;
        state.error = action.payload;
      })

      // Update section answers (pending/fulfilled/rejected)
      .addCase(updateSectionAnswers.pending, (state) => {
        state.isSavingSection = true;
        state.lastUpdatedSectionId = null;
      })
      .addCase(updateSectionAnswers.fulfilled, (state, action) => {
        state.isSavingSection = false;
        state.lastUpdatedSectionId = action.payload?.sectionId || null;
        state.error = null;
      })
      .addCase(updateSectionAnswers.rejected, (state, action) => {
        state.isSavingSection = false;
        state.lastUpdatedSectionId = null;
        state.error = action.payload;
      });
  },
});

export const { clearServiceOnboardingState } = serviceOnboardingSlice.actions;
export default serviceOnboardingSlice.reducer;
