import React, { useState } from 'react';

const PrivacySettings = () => {
    const [settings, setSettings] = useState({
        allowAnalytics: localStorage.getItem('allowAnalytics') !== 'false',
        storeHistory: localStorage.getItem('storeHistory') !== 'false',
        autoDeleteCompleted: localStorage.getItem('autoDeleteCompleted') === 'true',
        deleteAfterDays: localStorage.getItem('deleteAfterDays') || '30',
    });

    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value
        });
        setSaved(false);
    };

    const saveSettings = () => {
        Object.entries(settings).forEach(([key, value]) => {
            localStorage.setItem(key, value);
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Privacy Settings</h2>

            <div className="space-y-4 mb-6">
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="allowAnalytics"
                            checked={settings.allowAnalytics}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                            Allow anonymous usage data collection
                        </span>
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-6">
                        Help us improve by allowing anonymous data collection about how you use the app.
                        No personal data or task contents are collected.
                    </p>
                </div>

                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="storeHistory"
                            checked={settings.storeHistory}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                            Store task edit and status history
                        </span>
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-6">
                        Keep a history of changes to your tasks for tracking progress and activity.
                    </p>
                </div>

                <div className="pt-2 border-t dark:border-gray-700">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="autoDeleteCompleted"
                            checked={settings.autoDeleteCompleted}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                            Automatically delete completed tasks
                        </span>
                    </label>

                    {settings.autoDeleteCompleted && (
                        <div className="mt-3 ml-6">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                Delete completed tasks after:
                            </label>
                            <div className="flex items-center mt-1">
                                <input
                                    type="number"
                                    name="deleteAfterDays"
                                    min="1"
                                    max="365"
                                    value={settings.deleteAfterDays}
                                    onChange={handleChange}
                                    className="w-20 px-3 py-2 border dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                />
                                <span className="ml-2 text-gray-700 dark:text-gray-300">days</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center">
                <button
                    onClick={saveSettings}
                    className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-300"
                >
                    Save Privacy Settings
                </button>

                {saved && (
                    <span className="ml-3 text-green-600 dark:text-green-400 text-sm">
                        ✓ Settings saved successfully
                    </span>
                )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-md">
                <h4 className="text-sm font-medium mb-2">About Your Data</h4>
                <p className="text-sm">
                    Your task data is stored securely in our database. You can export your data at any time
                    from the Data Management section. For more information, review our privacy policy.
                </p>
            </div>
        </div>
    );
};

export default PrivacySettings;
