import httpClient from "./httpClient";
import { SERVICE_ENDPOINTS } from "../constants/serviceOnboarding.constants";

const ServiceOnboarding = {
  getAllServices: async () => {
    return await httpClient.get(SERVICE_ENDPOINTS.GET_ALL_SERVICES);
  },

  trackServiceProgress: async (serviceId) => {
    return await httpClient.get(SERVICE_ENDPOINTS.TRACK_SERVICE_PROGRESS(serviceId));
  },

  getServiceDetails: async (pageId) => {
    return await httpClient.get(SERVICE_ENDPOINTS.GET_SERVICE_DETAILS(pageId));
  },

  submitServiceOnboarding: async (data, endpoint) => {
    return await httpClient.post(`${SERVICE_ENDPOINTS.SUBMIT_STEP}/${endpoint}`, data);
  },

  getBusinessServiceDetails: async (serviceId, businessId) => {
    return await httpClient.get(SERVICE_ENDPOINTS.GET_BUSINESS_SERVICE_DETAILS(serviceId, businessId));
  },

  updateSectionAnswers: (serviceId, businessId, sectionId, answers) =>
    httpClient.put(
      SERVICE_ENDPOINTS.UPDATE_SECTION_ANSWERS(serviceId, businessId, sectionId),
      { answers }
    ),
};

export default ServiceOnboarding;
