export const BUSINESS_ENDPOINTS = {
  GET_ALL: '/business',
  GET_BY_ID: (id) => `/business/${id}`,
  CREATE: '/business/create',
  UPDATE: (id) => `/business/${id}`,
  UPDATE_ONBOARDING_STEP: (id, stepId, status) => `/business/${id}/${stepId}/${status}`,
  UPDATE_ONBOARDING_STEPS: (businessId) => `/business/${businessId}/onboarding-steps`,
  GET_DETAILS: '/business/details'
};

export const BUSINESS_REDUX = {
  FETCH_ALL: 'business/fetchBusinesses',
  FETCH_BY_ID: 'business/fetchBusinessById',
  CREATE: 'business/createBusiness',
  UPDATE: 'business/updateBusiness',
  UPDATE_ONBOARDING_STEP: 'business/updateOnboardingStep',
  UPDATE_ONBOARDING_STEPS: 'business/updateOnboardingSteps',
  FETCH_DETAILS: 'business/fetchDetails'
};

export const BusinessStatus = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  ONBOARDING: 'Onboarding'
};