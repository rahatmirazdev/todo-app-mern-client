import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/shared/ThemeToggle';
import { Toaster } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

const DashboardLayout = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const { user } = useAuth();
    const { theme } = useTheme();
    const location = useLocation();
    
    // Check if current route is analytics page
    const isAnalyticsPage = location.pathname === '/dashboard/analytics';

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
    }, []);

    const toggleSidebar = () => {
        setSidebarExpanded(!sidebarExpanded);
    };

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

                        {/* Notifications */}
                        <button className="p-1.5 rounded-md text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Profile Button */}
                        <div className="relative">
                            <button className="flex items-center">
                                <img
                                    src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0D8ABC&color=fff`}
                                    alt="User Avatar"
                                    className="w-8 h-8 rounded-full border-2 border-transparent hover:border-indigo-500 transition-colors"
                                />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main content area */}
                <main className="flex-1 overflow-auto p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;