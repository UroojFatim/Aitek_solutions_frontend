import httpClient from "./httpClient";

const AuditService = {
  // Get audit logs with filtering and pagination
  getAuditLogs: async (params = {}) => {
    try {
      const {
        page = 1,
        limit = 50,
        businessId,
        userId,
        userRole,
        operation,
        days = 30
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        days: days.toString()
      });

      if (businessId) queryParams.append('businessId', businessId);
      if (userId) queryParams.append('userId', userId);
      if (userRole) queryParams.append('userRole', userRole);
      if (operation) queryParams.append('operation', operation);

      const response = await httpClient.get(`/audit/logs?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get audit statistics
  getAuditStats: async (days = 7) => {
    try {
      const response = await httpClient.get(`/audit/stats?days=${days}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default AuditService;
