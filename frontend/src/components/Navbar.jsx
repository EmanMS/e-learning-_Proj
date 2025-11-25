import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, Bell } from 'lucide-react';
import api from '../services/api';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll for notifications every minute
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/communication/notifications/');
            setNotifications(response.data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await api.post(`/communication/notifications/${id}/mark_read/`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error("Failed to mark read", error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <nav className="bg-gray-800 text-white p-4 shadow-md relative z-50">
            <div className="container mx-auto flex justify-between items-center flex-wrap">
                <Link to="/" className="text-xl font-bold">E-Learning Platform</Link>
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                    {user ? (
                        <>
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2 hover:bg-gray-700 rounded-full"
                                >
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white text-black rounded shadow-lg overflow-hidden border z-50">
                                        <div className="p-2 border-b font-bold bg-gray-50">Notifications</div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map(notification => (
                                                    <div
                                                        key={notification.id}
                                                        className={`p-3 border-b text-sm hover:bg-gray-50 cursor-pointer ${!notification.is_read ? 'bg-blue-50' : ''}`}
                                                        onClick={() => handleMarkRead(notification.id)}
                                                    >
                                                        <p>{notification.message}</p>
                                                        <span className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-gray-500">No notifications</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link to="/dashboard" className="hover:text-gray-300 text-sm sm:text-base">Dashboard</Link>
                            {user.role === 'INSTRUCTOR' && (
                                <>
                                    <Link to="/courses/new" className="hover:text-gray-300 text-sm sm:text-base">Create Course</Link>
                                    <Link to="/analytics" className="hover:text-gray-300 text-sm sm:text-base">Analytics</Link>
                                </>
                            )}
                            {user.role === 'STUDENT' && (
                                <Link to="/payment-history" className="hover:text-gray-300 text-sm sm:text-base">Payments</Link>
                            )}
                            <Link to="/profile" className="flex items-center gap-1 sm:gap-2 hover:text-gray-300 text-sm sm:text-base">
                                <User size={18} />
                                <span className="hidden sm:inline">Profile</span>
                            </Link>
                            <button onClick={handleLogout} className="flex items-center gap-1 hover:text-red-400 text-sm sm:text-base">
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-gray-300 text-sm sm:text-base">Login</Link>
                            <Link to="/register" className="bg-blue-600 px-3 py-2 sm:px-4 rounded hover:bg-blue-700 text-sm sm:text-base">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
