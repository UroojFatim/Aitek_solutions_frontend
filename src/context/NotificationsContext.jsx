import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { connectSocket, disconnectSocket, getSocket } from '@/services/socket.service';
import notificationService from '@/services/notification.service';

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch stored notifications from database
  const fetchNotifications = async () => {
    if (!isAuthenticated || !user?.id) return;
    
    try {
      setLoading(true);
      const response = await notificationService.getNotifications({ limit: 50 });
      
      if (response.success && response.data.notifications) {
        // Transform database notifications to match your existing format
        const transformedNotifications = response.data.notifications.map(notification => ({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          time: notification.created_at,
          type: notification.type, // Will always be 'notification' now
          isRead: notification.is_read,
          data: notification.data || {}
        }));
        
        setNotifications(transformedNotifications);
        
        // Get unread count
        const unreadResponse = await notificationService.getUnreadCount();
        if (unreadResponse.success) {
          setUnreadCount(unreadResponse.data.count);
        }
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      disconnectSocket();
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    // Fetch stored notifications on mount/login
    fetchNotifications();

    const socket = connectSocket(user.id);

   
    const handleNotification = (payload) => {
      const newNotification = {
        id: `notification-${Date.now()}-${Math.random()}`,
        title: payload.title,
        message: payload.message,
        time: payload.timestamp || new Date().toISOString(),
        type: 'notification', // Static type for all notifications
        isRead: false,
        data: payload.data || {}
      };
      
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

  
    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [isAuthenticated, user?.id]);

  // Mark all notifications as read
  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      // Update local state to mark all as read
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    
      setUnreadCount(0);
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    }
  };

  // Mark specific notification as read
  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
 
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true } 
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Clear all notifications
  const clearNotifications = async () => {
    try {
      await notificationService.clearNotifications();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to clear notifications:', error);

      setNotifications([]);
      setUnreadCount(0);
    }
  };

  // Delete specific notification
  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      // Update local state
      const deletedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      
      // Update unread count if the deleted notification was unread
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    loading,
    markAllRead,
    markAsRead,
    clearNotifications,
    deleteNotification,
    refreshNotifications: fetchNotifications,
  }), [notifications, unreadCount, loading]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}