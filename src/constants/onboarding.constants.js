export const ONBOARDING_ENDPOINTS = {
  GET_STEP_DETAILS: (stepId) => `/onboarding-steps/${stepId}`,
  SUBMIT_STEP: '/onboarding-steps',
  TRACK_PROGRESS: (stepId) => `/onboarding-section/progress/${stepId}`,
  GET_BUSINESS_STEP_DETAILS: (stepId, businessId) => `/onboarding-steps/admin/${stepId}/${businessId}`,
  UPDATE_BUSINESS_SECTION: (sectionName, businessId) => `/onboarding-steps/admin/${sectionName}/${businessId}`,
};

export const ONBOARDING_REDUX = {
  FETCH_STEP_DETAILS: 'onboarding/fetchStepDetails',
  TRACK_STEP_PROGRESS: 'onboarding/trackStepProgress',
  FETCH_BUSINESS_STEP_DETAILS: 'onboarding/fetchBusinessStepDetails',
};

export const OnboardingStatus = {
  NOT_STARTED: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
  SKIPPED: 4
}; 

export const OnboardingStatusLabels = {
  1: 'Not Started',
  2: 'In Progress',
  3: 'Completed',
  4: 'Skipped'
}; 