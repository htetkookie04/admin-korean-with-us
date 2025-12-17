'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Check, Trash2, CheckCheck, Bell, CreditCard, UserPlus, MessageSquare, AlertTriangle } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Enrollment Request',
    message: 'David Lee has requested to enroll in Korean Beginner Level 1',
    type: 'info',
    read: false,
    createdAt: '2024-12-20T10:30:00Z',
  },
  {
    id: '2',
    title: 'Payment Received',
    message: 'Payment of $299 confirmed for student Alice Johnson',
    type: 'success',
    read: false,
    createdAt: '2024-12-20T09:15:00Z',
  },
  {
    id: '3',
    title: 'New Inquiry Received',
    message: 'Sarah Connor sent a message about course fees',
    type: 'info',
    read: false,
    createdAt: '2024-12-19T16:45:00Z',
  },
  {
    id: '4',
    title: 'Course Schedule Updated',
    message: 'Korean Intermediate Conversation schedule has been changed',
    type: 'success',
    read: true,
    createdAt: '2024-12-19T14:20:00Z',
  },
  {
    id: '5',
    title: 'Low Enrollment Warning',
    message: 'TOPIK Preparation course has only 3 enrollments this month',
    type: 'warning',
    read: true,
    createdAt: '2024-12-18T11:00:00Z',
  },
];

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setSelectedNotification(selectedNotification?.id === notification.id ? null : notification);
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      'info': <UserPlus className="w-5 h-5 text-blue-500" />,
      'success': <CreditCard className="w-5 h-5 text-green-500" />,
      'warning': <AlertTriangle className="w-5 h-5 text-yellow-500" />,
      'error': <Bell className="w-5 h-5 text-red-500" />,
    };
    return icons[type] || icons['info'];
  };

  const getTypeBg = (type: string, read: boolean) => {
    if (read) return 'bg-white';
    const colors: Record<string, string> = {
      'info': 'bg-blue-50',
      'success': 'bg-green-50',
      'warning': 'bg-yellow-50',
      'error': 'bg-red-50',
    };
    return colors[type] || colors['info'];
  };

  const getTypeBorder = (type: string) => {
    const colors: Record<string, string> = {
      'info': 'border-l-blue-500',
      'success': 'border-l-green-500',
      'warning': 'border-l-yellow-500',
      'error': 'border-l-red-500',
    };
    return colors[type] || colors['info'];
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-screen w-[420px] bg-gray-50 shadow-2xl z-50 flex flex-col animate-slide-in-right"
        style={{
          animation: 'slideInRight 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="px-4 py-2 bg-white border-b border-gray-200">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No notifications</p>
              <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`
                  p-4 rounded-xl shadow-sm border-l-4 cursor-pointer transition-all
                  ${getTypeBg(notification.type, notification.read)}
                  ${getTypeBorder(notification.type)}
                  ${selectedNotification?.id === notification.id ? 'ring-2 ring-brand-300' : ''}
                  hover:shadow-md
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5 relative">
                    {getTypeIcon(notification.type)}
                    {/* NEW indicator for unread messages */}
                    {!notification.read && (
                      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-[8px] font-bold text-white">N</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notification.title}
                        </h3>
                      <button
                        onClick={(e) => deleteNotification(notification.id, e)}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDateTime(notification.createdAt)}
                    </p>

                    {/* Expanded view when selected */}
                    {selectedNotification?.id === notification.id && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                            >
                              <Check className="w-3 h-3" />
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={(e) => deleteNotification(notification.id, e)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-200">
          <p className="text-xs text-center text-gray-400">
            Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}

