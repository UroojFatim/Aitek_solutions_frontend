// src/services/user.service.js
import httpClient from './httpClient';
import { USER_ENDPOINTS } from '@/constants/user.constants';

const userService = {
  getAllUsers: async () => {
    return await httpClient.get(USER_ENDPOINTS.GET_ALL);
  },

  addAdmin: async (userData) => {
    return await httpClient.post(USER_ENDPOINTS.ADD_ADMIN, userData);
  },

  deleteAdmin: async (id) => {
    return await httpClient.delete(USER_ENDPOINTS.DELETE_ADMIN(id));
  },

  // Optionally pass businessId as query param
  getBusinessUsers: async (businessId = null) => {
    const url = businessId ? `${USER_ENDPOINTS.GET_BUSINESS_USERS}?business_id=${businessId}` : USER_ENDPOINTS.GET_BUSINESS_USERS;
    const res = await httpClient.get(url);
    return res.data?.data || res.data;
  },

  getUsersBySuperUser: async (superUserId) => {
    const res = await httpClient.get(USER_ENDPOINTS.GET_USERS_BY_SUPERUSER(superUserId));
    return res.data?.data || res.data;
  },

  addUser: async (payload) => {
    const res = await httpClient.post(USER_ENDPOINTS.ADD_USER, payload);
    return res.data?.data || res.data;
  },

  updateUserServices: async (id, payload) => {
    const res = await httpClient.put(USER_ENDPOINTS.UPDATE_USER_SERVICES(id), payload);
    return res.data?.data || res.data;
  },

  // Optionally pass businessId as query param
  getBusinessServices: async (businessId = null) => {
    const url = businessId ? `${USER_ENDPOINTS.GET_BUSINESS_SERVICES}?business_id=${businessId}` : USER_ENDPOINTS.GET_BUSINESS_SERVICES;
    const res = await httpClient.get(url);
    // backend ApiResponse usually wraps in { data: [...] }
    return res.data?.data || res.data;
  },

  deleteUser: async (id) => {
    return await httpClient.delete(USER_ENDPOINTS.DELETE_USER(id));
  },

  restoreUser: async (id) => {
    const res = await httpClient.put(USER_ENDPOINTS.RESTORE_USER(id));
    return res.data?.data || res.data;
  },

  restoreAdmin: async (id) => {
    const res = await httpClient.put(USER_ENDPOINTS.RESTORE_ADMIN(id));
    return res.data?.data || res.data;
  },

  changeUserPassword: async (userId, payload) => {
    const res = await httpClient.put(`/users/${userId}/password`, payload);
    return res.data?.data || res.data;
  },
};

export default userService;
