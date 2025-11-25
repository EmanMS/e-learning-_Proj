import { useState, useEffect } from 'react';
import api from '../services/api';
import { Bell, Check, Trash2 } from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/communication/notifications/');
            setNotifications(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.post(`/communication/notifications/${id}/mark_read/`);
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, is_read: true } : n
            ));
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/communication/notifications/${id}/`);
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (error) {
            console.error('Failed to delete notification', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const unreadNotifications = notifications.filter(n => !n.is_read);
            await Promise.all(
                unreadNotifications.map(n =>
                    api.post(`/communication/notifications/${n.id}/mark_read/`)
                )
            );
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    if (loading) return <div className="p-8">Loading notifications...</div>;

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Notifications</h1>
                        {unreadCount > 0 && (
                            <p className="text-sm text-gray-600 mt-1">
                                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Check size={16} />
                            Mark all as read
                        </button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <Bell size={48} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500 text-lg">No notifications yet</p>
                        <p className="text-gray-400 text-sm mt-2">
                            You'll see updates about your courses and activities here
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`bg-white rounded-lg shadow-md p-4 flex items-start gap-4 ${!notification.is_read ? 'border-l-4 border-blue-500' : ''
                                    }`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!notification.is_read ? 'bg-blue-100' : 'bg-gray-100'
                                        }`}
                                >
                                    <Bell
                                        size={20}
                                        className={!notification.is_read ? 'text-blue-600' : 'text-gray-600'}
                                    />
                                </div>

                                <div className="flex-1">
                                    <p className={`${!notification.is_read ? 'font-semibold' : 'text-gray-700'}`}>
                                        {notification.message}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(notification.created_at).toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    {!notification.is_read && (
                                        <button
                                            onClick={() => markAsRead(notification.id)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                            title="Mark as read"
                                        >
                                            <Check size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(notification.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
