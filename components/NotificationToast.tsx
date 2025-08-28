
import React, { useEffect, useState } from 'react';
import type { Notification } from '../types';
import { CheckCircleIcon, XCircleIcon, InfoIcon, XIcon } from './Icons';

interface NotificationToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const icons = {
  success: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
  error: <XCircleIcon className="w-6 h-6 text-red-400" />,
  info: <InfoIcon className="w-6 h-6 text-blue-400" />,
};

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(notification.id), 300); // Wait for fade out
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  return (
    <div
      className={`flex items-start w-full max-w-sm p-4 mb-4 text-gray-200 bg-gray-800 rounded-lg shadow-lg border border-gray-700 transition-all duration-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
        {icons[notification.type]}
      </div>
      <div className="ml-3 mr-4 text-sm font-normal flex-1">{notification.message}</div>
      <button
        type="button"
        className="-mx-1.5 -my-1.5 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg p-1.5 inline-flex h-8 w-8"
        aria-label="Close"
        onClick={handleDismiss}
      >
        <span className="sr-only">Close</span>
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default NotificationToast;
