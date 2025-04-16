import React from 'react';

// Import the context directly at the top level - no dynamic imports
import { useNotification } from '../../context/NotificationContext';

const NotificationSettings = () => {
    // Call the hook directly
    const notificationContext = useNotification();

    // If notification context is not available, show a message
    if (!notificationContext ||
        typeof notificationContext.notificationsEnabled === 'undefined') {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Notification Settings</h2>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 rounded-md">
                    <p className="flex items-center">
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Notification system is not available
                    </p>
                    <p className="mt-2 text-sm">
                        The notification system could not be initialized. Make sure you have the NotificationContext properly set up.
                    </p>
                </div>
            </div>
        );
    }

    // Safely extract properties with fallbacks
    const {
        notificationsEnabled = false,
        desktopNotificationsEnabled = false,
        browserNotificationsEnabled = false,
        toggleNotifications = () => { },
        toggleDesktopNotifications = () => { },
        toggleBrowserNotifications = () => { },
        permissionState = 'default'
    } = notificationContext;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Notification Settings</h2>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-gray-700 dark:text-gray-300">Enable All Notifications</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Toggle all notifications on or off
                        </p>
                    </div>
                    <div className="relative">
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={notificationsEnabled}
                                onChange={toggleNotifications}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-gray-700 dark:text-gray-300">Desktop Notifications</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Show notifications within the app
                        </p>
                    </div>
                    <div className="relative">
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={desktopNotificationsEnabled}
                                onChange={toggleDesktopNotifications}
                                disabled={!notificationsEnabled}
                            />
                            <div className={`w-11 h-6 ${!notificationsEnabled ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600`}></div>
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-gray-700 dark:text-gray-300">Browser Notifications</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Show notifications from your browser
                        </p>
                        {permissionState === 'denied' && (
                            <p className="text-xs text-red-500 mt-1">
                                Notification permission denied. Please update your browser settings.
                            </p>
                        )}
                    </div>
                    <div className="relative">
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={browserNotificationsEnabled}
                                onChange={toggleBrowserNotifications}
                                disabled={!notificationsEnabled || permissionState === 'denied'}
                            />
                            <div className={`w-11 h-6 ${!notificationsEnabled || permissionState === 'denied' ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600`}></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">About Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Notifications keep you updated about important changes to your tasks, including due date reminders, status updates, and more.
                </p>
            </div>
        </div>
    );
};

export default NotificationSettings;
