import React, { createContext, useState, useContext, useCallback } from 'react';
import Notification, { NotificationType } from '../components/ui/Notification';

interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationContextProps {
  showNotification: (type: NotificationType, message: string, duration?: number) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextProps>({
  showNotification: () => {},
  clearNotifications: () => {},
});

export const useNotification = (): NotificationContextProps => {
  return useContext(NotificationContext);
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Add a notification
  const showNotification = useCallback((type: NotificationType, message: string, duration = 3000) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
    
    // Automatically remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
      }, duration + 500); // Add 500ms to account for exit animation
    }
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Remove a specific notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, clearNotifications }}>
      {children}
      {/* Render all active notifications */}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
          isVisible={true}
        />
      ))}
    </NotificationContext.Provider>
  );
};

export default NotificationContext; 