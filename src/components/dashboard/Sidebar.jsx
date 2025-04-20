import { useState, useEffect, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Logo from '../shared/Logo';

const Sidebar = ({ isExpanded, toggleSidebar }) => {
    // Determine if mobile before first render
    const initialIsMobile = window.innerWidth < 768;
    const [isMobile, setIsMobile] = useState(initialIsMobile);
    const [mounted, setMounted] = useState(false);
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const location = useLocation();

    // Use useLayoutEffect to ensure DOM updates before paint
    useLayoutEffect(() => {
        setIsMobile(window.innerWidth < 768);
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const menuItems = [
        {
            name: 'Home',
            path: '/',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
            )
        },
        {
            name: 'Todos',
            path: '/dashboard/todos',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            name: 'Analytics',
            path: '/dashboard/analytics',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
            )
        },
        {
            name: 'Projects',
            path: '/dashboard/projects',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
            )
        },
        {
            name: 'Calendar',
            path: '/dashboard/calendar',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            name: 'Messages',
            path: '/dashboard/messages',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
            ),
            badge: '3'
        },
        {
            name: 'Profile',
            path: '/dashboard/profile',  // Updated path to match new location
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            name: 'Settings',
            path: '/dashboard/settings',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
            )
        },
    ];

    const handleLogout = () => {
        logout();
    };

    // Don't render transitions until after component is mounted
    const transitionClass = mounted ? 'transition-all duration-300 ease-in-out' : '';

    return (
        <>
            {/* Mobile overlay when sidebar is open */}
            {isMobile && isExpanded && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar with conditional transitions */}
            <div
                className={`fixed h-full bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-lg z-30 ${transitionClass}
                    ${isExpanded ? 'w-64' : 'w-20'} 
                    ${isMobile ? (isExpanded ? 'left-0' : '-left-20') : 'left-0'}`
                }
                style={{ visibility: (isMobile && !mounted) ? 'hidden' : 'visible' }}
            >
                {/* Toggle button for mobile */}
                {isMobile && (
                    <button
                        onClick={toggleSidebar}
                        className="absolute -right-12 top-4 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                    >
                        {isExpanded ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                )}

                {/* Sidebar Header */}
                <div className={`flex items-center justify-between h-16 px-4 border-b dark:border-gray-700 ${isExpanded ? '' : 'justify-center'}`}>
                    {isExpanded ? (
                        <Logo size="default" linkTo="/dashboard" />
                    ) : (
                        <Logo size="small" showText={false} linkTo="/dashboard" />
                    )}

                    {/* Desktop toggle button - FIXED THIS SECTION */}
                    {!isMobile && (
                        <button
                            onClick={toggleSidebar}
                            className={`p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 ${isExpanded ? '' : 'mx-auto'}`}
                            title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
                        >
                            {isExpanded ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                </svg>
                            )}
                        </button>
                    )}
                </div>

                {/* User Profile Section */}
                <div className={`flex items-center ${isExpanded ? 'px-4 py-6' : 'flex-col py-6'}`}>
                    <div className={`relative ${isExpanded ? 'mr-3' : 'mb-2'}`}>
                        <img
                            src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0D8ABC&color=fff`}
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full border-2 border-indigo-500"
                            referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                    </div>
                    {isExpanded && (
                        <div className="flex-1 min-w-0">
                            <h2 className="text-sm font-medium truncate dark:text-white">{user?.name}</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="mt-2 px-2">
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`group flex items-center py-2 px-3 rounded-md transition-colors relative
                                        ${isActive
                                            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                                        }
                                    `}
                                >
                                    <div className="flex items-center justify-center">
                                        <span className={`${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                                            {item.icon}
                                        </span>
                                    </div>

                                    {isExpanded && (
                                        <span className="ml-3 text-sm font-medium transition-opacity duration-200 ease-in-out">
                                            {item.name}
                                        </span>
                                    )}

                                    {isExpanded && item.badge && (
                                        <span className="ml-auto bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 text-xs font-semibold px-2 py-0.5 rounded-full">
                                            {item.badge}
                                        </span>
                                    )}

                                    {/* Indicator for active item */}
                                    {isActive && (
                                        <span
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-r-full"
                                            style={{ transition: 'transform 0.3s ease' }}
                                        ></span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                <div className="absolute bottom-0 left-0 right-0 border-t dark:border-gray-700 p-2">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center py-2 px-3 text-sm font-medium rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors ${isExpanded ? '' : 'justify-center'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7z" clipRule="evenodd" />
                            <path d="M3.293 12.707a1 1 0 101.414 1.414L8.414 10.414l3.707 3.707a1 1 0 001.414-1.414L9.828 9l3.707-3.707a1 1 0 00-1.414-1.414l-3.707 3.707-3.707-3.707a1 1 0 00-1.414 1.414L7 9l-3.707 3.707z" />
                        </svg>
                        {isExpanded && <span className="ml-3">Logout</span>}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
