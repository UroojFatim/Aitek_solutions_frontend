import httpClient from './httpClient';
import { BUSINESS_ONBOARDING_ENDPOINTS } from '../constants/businessOnboarding.constants';

const businessOnboardingService = {
  getAllClients: async () => {
    return await httpClient.get(BUSINESS_ONBOARDING_ENDPOINTS.GET_ALL);
  },
};

export default businessOnboardingService;
