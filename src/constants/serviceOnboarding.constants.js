export const SERVICE_ENDPOINTS = {
  GET_ALL_SERVICES: "/services",
  GET_SERVICE_DETAILS: (serviceId) => `/service-onboarding/${serviceId}`,
  TRACK_SERVICE_PROGRESS: (serviceId) => `/service-onboarding/progress/${serviceId}`,
  SUBMIT_STEP: '/service-onboarding',
  GET_BUSINESS_SERVICE_DETAILS: (serviceId, businessId) => `/service-onboarding/admin/${serviceId}/${businessId}`,
  UPDATE_SECTION_ANSWERS: (serviceId, businessId, sectionId) =>
    `/service-onboarding/admin/${serviceId}/${businessId}/section/${sectionId}`,
};

export const SERVICE_REDUX = {
  FETCH_SERVICES: "serviceOnboarding/fetchService",
  FETCH_SERVICE_DETAILS: "serviceOnboarding/fetchServiceDetails",
  TRACK_SERVICE_PROGRESS: "serviceOnboarding/trackServiceProgress",
  FETCH_BUSINESS_SERVICE_DETAILS: 'serviceOnboarding/fetchBusinessServiceDetails',
  UPDATE_SECTION_ANSWERS: "serviceOnboarding/updateSectionAnswers",
};
