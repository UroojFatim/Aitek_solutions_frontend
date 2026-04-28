import httpClient from './httpClient';
import { NOTIFICATION_ENDPOINTS } from '../constants/notification.constants';

const notificationService = {
  // Get user notifications with pagination
  getNotifications: async (params = {}) => {
    return await httpClient.get(NOTIFICATION_ENDPOINTS.GET_ALL, params);
  },

  // Get unread notification count
  getUnreadCount: async () => {
    return await httpClient.get(NOTIFICATION_ENDPOINTS.GET_UNREAD_COUNT);
  },

  // Mark specific notification as read
  markAsRead: async (notificationId) => {
    return await httpClient.put(NOTIFICATION_ENDPOINTS.MARK_AS_READ(notificationId));
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    return await httpClient.put(NOTIFICATION_ENDPOINTS.MARK_ALL_AS_READ);
  },

  // Delete specific notification
  deleteNotification: async (notificationId) => {
    return await httpClient.delete(NOTIFICATION_ENDPOINTS.DELETE(notificationId));
  },

  // Clear old/read notifications
  clearNotifications: async (olderThanDays = 30) => {
    return await httpClient.delete(NOTIFICATION_ENDPOINTS.CLEAR, { older_than_days: olderThanDays });
  }
};

export default notificationService;