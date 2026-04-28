import httpClient from './httpClient';
import { SERVICES_ENDPOINTS } from '../constants/services.constants';

const servicesService = {
  getAllServices: () => {
    return httpClient.get(SERVICES_ENDPOINTS.GET_ALL);
  },

  updateBusinessServices: (businessId, businessServices) => {
    return httpClient.put(SERVICES_ENDPOINTS.UPDATE_BUSINESS_SERVICE(businessId), { businessServices });
  }
};

export default servicesService;
