import httpClient from './httpClient';
import { BUSINESS_ENDPOINTS } from '../constants/business.constants';

const businessService = {
  getAllBusinesses: () => {
    return httpClient.get(BUSINESS_ENDPOINTS.GET_ALL);
  },

  getBusinessesByUser: async (userId) => {
    const res = await httpClient.get(`/business/by-user/${userId}`);
    return res.data?.data || res.data;
  },

  getBusinessById: (id) => {
    return httpClient.get(BUSINESS_ENDPOINTS.GET_BY_ID(id));
  },

  createBusiness: (data) => {
    return httpClient.post(BUSINESS_ENDPOINTS.CREATE, data);
  },

  updateBusiness: (id, businessData) => {
    return httpClient.put(BUSINESS_ENDPOINTS.UPDATE(id), businessData);
  },

  updateOnboardingStep: (businessId, stepId, status) => {
    return httpClient.put(BUSINESS_ENDPOINTS.UPDATE_ONBOARDING_STEP(businessId, stepId, status));
  },

  updateOnboardingSteps: (businessId, steps) => {
    return httpClient.put(BUSINESS_ENDPOINTS.UPDATE_ONBOARDING_STEPS(businessId), { steps });
  },

  getBusinessDetails: () => {
    return httpClient.get(BUSINESS_ENDPOINTS.GET_DETAILS);
  },

  getBusinessServiceStatus: (serviceId) => {
    return httpClient.get(`business/service-status/${serviceId}`);
  }
};

export default businessService; 