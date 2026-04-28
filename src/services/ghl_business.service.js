  import httpClient from './httpClient';
  import { GHL_ENDPOINTS } from '../constants/ghl_business.constants';

  const ghlService = {
    getAllBusinesses: () => httpClient.get(GHL_ENDPOINTS.GET_BUSINESS),

    getAllPipelines: () => httpClient.get(GHL_ENDPOINTS.GET_PIPELINES),

    assignPipelineToBusiness: (payload) => httpClient.post(GHL_ENDPOINTS.ASSIGN_PIPELINE, payload),

    getAssignedPipelines: () => httpClient.get(GHL_ENDPOINTS.GET_ASSIGNED_PIPELINES),

    getBusinessPipelinesByBusinessId: (businessId) => 
      httpClient.get(GHL_ENDPOINTS.GET_BUSINESS_PIPELINES_BY_ID(businessId)),

    deletePipeline: async (id) => {
        return await httpClient.delete(GHL_ENDPOINTS.DELETE_PIPELINE(id));
      },
  };

  export default ghlService;
