// constants/notification.constants.js

export const NOTIFICATION_ENDPOINTS = {
  GET_ALL: '/notifications',
  GET_UNREAD_COUNT: '/notifications/unread-count',
  MARK_AS_READ: (id) => `/notifications/${id}/read`,
  MARK_ALL_AS_READ: '/notifications/mark-all-read',
  DELETE: (id) => `/notifications/${id}`,
  CLEAR: '/notifications/clear'
};

export const NOTIFICATION_REDUX = {
  FETCH_ALL: 'notifications/fetchNotifications',
  GET_UNREAD_COUNT: 'notifications/getUnreadCount',
  MARK_AS_READ: 'notifications/markAsRead',
  MARK_ALL_AS_READ: 'notifications/markAllAsRead',
  DELETE: 'notifications/deleteNotification',
  CLEAR: 'notifications/clearNotifications'
};

export const NotificationTypes = {
  NOTIFICATION: 'notification' // Single type for all notifications
};