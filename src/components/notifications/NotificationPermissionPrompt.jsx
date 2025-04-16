import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';

const NotificationPermissionPrompt = () => {
    const { permissionState, requestPermission } = useNotification();
    const [dismissed, setDismissed] = useState(false);

    // Only show the prompt if permission hasn't been granted or denied yet
    // and it hasn't been dismissed
    if (permissionState !== 'default' || dismissed) {
        return null;
    }

    const handleRequestPermission = async () => {
        await requestPermission();
    };

    const handleDismiss = () => {
        setDismissed(true);
    };

    return (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 max-w-sm z-50 border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Enable Notifications</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Get notified about task updates, reminders, and upcoming deadlines.
            </p>
            <div className="flex justify-end space-x-3">
                <button
                    onClick={handleDismiss}
                    className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                    Not Now
                </button>
                <button
                    onClick={handleRequestPermission}
                    className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                    Enable
                </button>
            </div>
        </div>
    );
};

export default NotificationPermissionPrompt;
