import React, { useState, useEffect } from 'react';
import Icon from './Icon';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  type: NotificationType;
  message: string;
  duration?: number;
  onClose?: () => void;
  isVisible?: boolean;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  duration = 3000,
  onClose,
  isVisible = true
}) => {
  const [isShowing, setIsShowing] = useState(isVisible);
  
  // Auto-hide notification after duration
  useEffect(() => {
    setIsShowing(isVisible);
    
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setIsShowing(false);
        if (onClose) {
          setTimeout(onClose, 300); // Call onClose after fade out animation
        }
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);
  
  // Handle close
  const handleClose = () => {
    setIsShowing(false);
    if (onClose) {
      setTimeout(onClose, 300); // Call onClose after fade out animation
    }
  };
  
  if (!isShowing && !isVisible) return null;
  
  // Get styling based on notification type
  const getTypeStyles = (): { icon: string; bgColor: string; textColor: string; borderColor: string } => {
    switch (type) {
      case 'success':
        return {
          icon: 'check',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          textColor: 'text-green-800 dark:text-green-300',
          borderColor: 'border-green-500'
        };
      case 'error':
        return {
          icon: 'close',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          textColor: 'text-red-800 dark:text-red-300',
          borderColor: 'border-red-500'
        };
      case 'warning':
        return {
          icon: 'info',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          textColor: 'text-yellow-800 dark:text-yellow-300',
          borderColor: 'border-yellow-500'
        };
      case 'info':
      default:
        return {
          icon: 'info',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          textColor: 'text-blue-800 dark:text-blue-300',
          borderColor: 'border-blue-500'
        };
    }
  };
  
  const { icon, bgColor, textColor, borderColor } = getTypeStyles();
  
  return (
    <div 
      className={`
        fixed bottom-6 right-6 z-50 flex items-center p-4 rounded-lg
        shadow-lg border-l-4 ${borderColor} ${bgColor}
        transition-all duration-300 ease-in-out
        ${isShowing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        max-w-md
      `}
      role="alert"
    >
      <div className={`flex-shrink-0 w-8 h-8 ${textColor} rounded-full flex items-center justify-center bg-white/30 dark:bg-black/20`}>
        <Icon name={icon as any} size="md" />
      </div>
      <div className="ml-3 flex-grow">
        <p className={`text-sm ${textColor} font-medium`}>
          {message}
        </p>
      </div>
      <button
        type="button"
        className={`ml-4 flex-shrink-0 ${textColor} hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none`}
        onClick={handleClose}
        aria-label="Close"
      >
        <Icon name="close" size="sm" />
      </button>
    </div>
  );
};

export default Notification; 