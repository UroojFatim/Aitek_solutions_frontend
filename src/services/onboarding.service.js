
import { ONBOARDING_ENDPOINTS } from '../constants/onboarding.constants';
import httpClient from './httpClient';

const onboardingService = {
  getOnboardingStepDetails: async (stepId) => {
    return await httpClient.get(ONBOARDING_ENDPOINTS.GET_STEP_DETAILS(stepId));
  },

  getBusinessStepDetails: async (stepId, businessId) => {
    return await httpClient.get(ONBOARDING_ENDPOINTS.GET_BUSINESS_STEP_DETAILS(stepId, businessId));
  },

  updateBusinessSection: async (sectionName, businessId, data) => {
    return await httpClient.put(
      ONBOARDING_ENDPOINTS.UPDATE_BUSINESS_SECTION(sectionName, businessId),
      data
    );
  },

  submitOnboardingStep: async (data, endpoint) => {
    return await httpClient.post(`${ONBOARDING_ENDPOINTS.SUBMIT_STEP}/${endpoint}`, data);
  },

  trackStepProgress: async (stepId) => {
    return await httpClient.get(ONBOARDING_ENDPOINTS.TRACK_PROGRESS(stepId));
  },
};

export default onboardingService; 