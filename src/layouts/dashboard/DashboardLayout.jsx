import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useTodo } from '../../context/TodoContext';
import ThemeToggle from '../../components/shared/ThemeToggle';
import { Toaster } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import TaskCompletionCelebration from '../../components/celebrations/TaskCompletionCelebration';

const DashboardLayout = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const { user } = useAuth();
    const { theme } = useTheme();
    const location = useLocation();
    const notificationRef = useRef(null);

    // Get notification context
    const notificationContext = useNotification();

    // Provide fallback functions if context is not available
    const notifications = notificationContext?.notifications || [];
    const markAsRead = notificationContext?.markAsRead || (() => { });
    const clearAll = notificationContext?.clearAll || (() => { });

    // Count unread notifications
    const unreadCount = notifications.filter(n => !n.read).length || 0;

    // Check if current route is analytics page
    const isAnalyticsPage = location.pathname === '/dashboard/analytics';

    // Close notifications when clicking outside
    useEffect(() => {
        if (!notificationRef.current) return;

        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Check if mobile on first render
    useLayoutEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    // Responsive sidebar handling
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            // Auto collapse sidebar on mobile
            if (mobile && sidebarExpanded) {
                setSidebarExpanded(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [sidebarExpanded]);

    const toggleSidebar = () => {
        setSidebarExpanded(!sidebarExpanded);
    };

    // Get celebration state from todo context
    const todoContext = useTodo();
    const { celebration, hideCelebration } = todoContext || {};

    return (
        <div className={`${isAnalyticsPage ? '' : 'h-screen overflow-hidden'} bg-gray-50 dark:bg-gray-900`}>
            {/* Add Toaster component for notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: theme === 'dark' ? '#374151' : '#fff',
                        color: theme === 'dark' ? '#fff' : '#000',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10B981',
                            secondary: 'white',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: 'white',
                        },
                    }
                }}
            />

            {/* Sidebar */}
            <Sidebar isExpanded={sidebarExpanded} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <div
                className={`flex flex-col h-full transition-all duration-300 ease-in-out
                    ${isMobile
                        ? 'ml-0'
                        : (sidebarExpanded ? 'ml-64' : 'ml-20')
                    }`
                }
            >
                {/* Top Header */}
                <header className="bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center justify-between px-4 md:px-6 z-10">
                    {/* Mobile Menu Button - visible only on mobile */}
                    {isMobile && (
                        <button
                            onClick={toggleSidebar}
                            className="text-gray-600 dark:text-gray-300 focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    )}

                    {/* Page Title */}
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-3">
                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Notifications - Only show if notification context is available */}
                        {notificationContext && (
                            <div className="relative" ref={notificationRef}>
                                <button
                                    className="p-1.5 rounded-md text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 relative"
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    aria-label="Notifications"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                                    )}
                                </button>

                                {/* Notification Dropdown */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                            <h3 className="font-medium text-gray-800 dark:text-gray-200">Notifications</h3>
                                            {notifications.length > 0 && (
                                                <button
                                                    onClick={clearAll}
                                                    className="text-xs text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                                                >
                                                    Clear all
                                                </button>
                                            )}
                                        </div>

                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                                    No notifications
                                                </div>
                                            ) : (
                                                <ul>
                                                    {notifications.map(notification => (
                                                        <li
                                                            key={notification.id}
                                                            className={`border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${!notification.read ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                                                        >
                                                            <Link
                                                                to={notification.link || '#'}
                                                                className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                                                onClick={() => {
                                                                    markAsRead(notification.id);
                                                                    setShowNotifications(false);
                                                                }}
                                                            >
                                                                <div className="flex">
                                                                    <div className="flex-shrink-0">
                                                                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                    <div className="ml-3 flex-1">
                                                                        <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                                                            {notification.title}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                            {notification.message}
                                                                        </p>
                                                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                                            {new Date(notification.createdAt).toLocaleString()}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Profile Button */}
                        <div className="relative">
                            <button className="flex items-center">
                                <img
                                    src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0D8ABC&color=fff`}
                                    alt="User Avatar"
                                    className="w-8 h-8 rounded-full border-2 border-transparent hover:border-indigo-500 transition-colors"
                                    referrerPolicy="no-referrer"
                                />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main content area */}
                <main className="flex-1 overflow-auto p-4 md:p-6">
                    <Outlet />
                </main>

                {/* Task Completion Celebration */}
                {celebration && celebration.isVisible && celebration.message && (
                    <TaskCompletionCelebration
                        isVisible={celebration.isVisible}
                        message={celebration.message}
                        onClose={hideCelebration}
                    />
                )}
            </div>
        </div>
    );
};

export default DashboardLayout;