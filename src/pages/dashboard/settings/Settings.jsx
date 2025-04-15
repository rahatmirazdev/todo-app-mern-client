import React from 'react';
import NotificationSettings from '../../../components/settings/NotificationSettings';
import ThemeSettings from '../../../components/settings/ThemeSettings';

const Settings = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>

            <NotificationSettings />

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Display Settings</h2>

                <ThemeSettings />

                {/* Add other display settings here */}
            </div>
        </div>
    );
};

export default Settings;
