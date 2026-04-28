export const GHL_REDUX = {
  GET_BUSINESSES: 'ghl/getBusinesses',
  GET_PIPELINES: 'ghl/getPipelines',
  ASSIGN_PIPELINE: 'ghl/assignPipeline',
  GET_ASSIGNED_PIPELINES: 'ghl/getAssignedPipelines',
  GET_BUSINESS_PIPELINES_BY_ID: 'ghl/getBusinessPipelinesById',
  DELETE_PIPELINE: 'ghl/deletePipeline',
};

export const GHL_ENDPOINTS = {
  GET_BUSINESS: '/business/get',
  GET_PIPELINES: '/ghl-pipelines/get_pipeline',
  ASSIGN_PIPELINE: '/business-pipelines/assign_pipeline',
  GET_ASSIGNED_PIPELINES: '/business-pipelines/get_assign_pipelines',
  GET_BUSINESS_PIPELINES_BY_ID: (businessId) => `/business-pipelines/get_business_pipeline/${businessId}`,
  DELETE_PIPELINE: (id) => `/business-pipelines/delete/${id}`
};
