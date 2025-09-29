import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from '../../config/axios';
import { BellIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

    // Fetch unread notifications count
    const { data: unreadCount } = useQuery(
        'notifications-unread-count',
        () => axios.get('/api/notifications/unread-count').then(res => res.data.count),
        {
            refetchInterval: 30000, // Refetch every 30 seconds
        }
    );

    // Fetch notifications
    const { data: notifications } = useQuery(
        'notifications',
        () => axios.get('/api/notifications').then(res => res.data),
        {
            enabled: isOpen,
        }
    );

    // Mark as read mutation
    const markAsReadMutation = useMutation(
        (notificationId) => axios.put(`/api/notifications/${notificationId}/read`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('notifications-unread-count');
                queryClient.invalidateQueries('notifications');
            },
        }
    );

    // Mark all as read mutation
    const markAllAsReadMutation = useMutation(
        () => axios.put('/api/notifications/mark-all-read'),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('notifications-unread-count');
                queryClient.invalidateQueries('notifications');
                toast.success('All notifications marked as read');
            },
        }
    );

    // Delete notification mutation
    const deleteNotificationMutation = useMutation(
        (notificationId) => axios.delete(`/api/notifications/${notificationId}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('notifications-unread-count');
                queryClient.invalidateQueries('notifications');
                toast.success('Notification deleted');
            },
        }
    );

    const handleNotificationClick = (notification) => {
        if (!notification.read_at) {
            markAsReadMutation.mutate(notification.id);
        }
    };

    const handleMarkAllAsRead = () => {
        markAllAsReadMutation.mutate();
    };

    const handleDeleteNotification = (notificationId, e) => {
        e.stopPropagation();
        deleteNotificationMutation.mutate(notificationId);
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const notificationDate = new Date(date);
        const diffInSeconds = Math.floor((now - notificationDate) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-black hover:text-blue-300 transition-colors"
            >
                {unreadCount > 0 ? (
                    <BellIconSolid className="w-6 h-6" />
                ) : (
                    <BellIcon className="w-6 h-6" />
                )}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl shadow-lg z-50">
                    <div className="p-4 border-b border-white/20">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-black">Notifications</h3>
                            {notifications?.data?.length > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications?.data?.length > 0 ? (
                            <div className="divide-y divide-white/10">
                                {notifications.data.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                                            !notification.read_at ? 'bg-blue-500/10' : ''
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-black text-sm font-medium">
                                                    {notification.data.message}
                                                </p>
                                                <p className="text-gray-600 text-xs mt-1">
                                                    {formatTimeAgo(notification.created_at)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => handleDeleteNotification(notification.id, e)}
                                                className="text-gray-600 hover:text-red-400 transition-colors ml-2"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <BellIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-600">No notifications yet</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default NotificationBell;
