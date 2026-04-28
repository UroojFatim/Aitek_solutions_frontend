export const SERVICES_ENDPOINTS = {
  GET_ALL: '/services',
  UPDATE_BUSINESS_SERVICE: (businessId) => `/business/${businessId}/services`
};

export const SERVICES_REDUX = {
  FETCH_ALL: 'services/fetchServices',
  UPDATE_BUSINESS_SERVICE: 'services/updateBusinessService',
  FETCH_SERVICE_STATUS: 'services/fetchServiceStatus'
};


export const BusinessServiceStatus = {
  UNASSIGNED: 1,
  INITIAL: 2,
  ONBOARDING: 3,
  ACTIVATED: 4,
  DEACTIVATED: 5,
  FINISHED: 6
};

export const BusinessServiceStatusLabels = {
  1: 'Unassigned',
  2: 'Initial',
  3: 'Onboarding',
  4: 'Activated',
  5: 'Deactivated',
  6: 'Finished'
};
