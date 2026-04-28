// src/services/userAudit.service.js
import httpClient from "./httpClient";
import { USER_AUDIT_ENDPOINTS } from "../constants/userAudit.constants";

const UserAuditService = {
  // Super User scoped logs
  getUserAuditLogs: async (params = {}) => {
    try {
      const {
        page = 1,
        limit = 50,
        userId,
        operation,
        days = 30,
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        days: days.toString(),
      });

      if (userId) queryParams.append("userId", userId);
      if (operation) queryParams.append("operation", operation);

      const response = await httpClient.get(
        `${USER_AUDIT_ENDPOINTS.GET_LOGS}?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserAuditStats: async (days = 7) => {
    try {
      const response = await httpClient.get(
        USER_AUDIT_ENDPOINTS.GET_STATS(days)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default UserAuditService;
