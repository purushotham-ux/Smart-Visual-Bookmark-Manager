import React from 'react';
import Button from './Button';
import Icon from './Icon';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}) => {
  if (!isOpen) return null;

  // Style based on type
  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'trash',
          iconColor: 'text-red-500',
          buttonColor: 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
        };
      case 'warning':
        return {
          icon: 'warning',
          iconColor: 'text-yellow-500',
          buttonColor: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500'
        };
      case 'info':
      default:
        return {
          icon: 'info',
          iconColor: 'text-blue-500',
          buttonColor: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
        };
    }
  };

  const { icon, iconColor, buttonColor } = getTypeStyles();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="dialog-title" role="dialog" aria-modal="true">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 sm:mx-0 sm:h-10 sm:w-10 ${iconColor}`}>
                <Icon name={icon as any} size="md" />
              </div>
              
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="dialog-title">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
            <Button
              variant="primary"
              className={`w-full sm:w-auto ${buttonColor} text-white`}
              onClick={handleConfirm}
            >
              {confirmText}
            </Button>
            <Button
              variant="secondary"
              className="w-full sm:w-auto mt-3 sm:mt-0"
              onClick={onClose}
            >
              {cancelText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 