import React, { useState } from 'react';
import NotificationSettings from '../../../components/settings/NotificationSettings';
import ThemeSettings from '../../../components/settings/ThemeSettings';
import AccountSettings from '../../../components/settings/AccountSettings';
import TaskDefaultsSettings from '../../../components/settings/TaskDefaultsSettings';
import DataManagementSettings from '../../../components/settings/DataManagementSettings';
import PrivacySettings from '../../../components/settings/PrivacySettings';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('account');

    const tabClasses = (tabName) =>
        `px-4 py-2 font-medium text-sm rounded-md transition-colors ${activeTab === tabName
            ? 'bg-indigo-600 text-white'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                {/* Tabs Navigation */}
                <div className="border-b dark:border-gray-700">
                    <div className="flex space-x-2 p-4 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('account')}
                            className={tabClasses('account')}
                        >
                            Account
                        </button>
                        <button
                            onClick={() => setActiveTab('appearance')}
                            className={tabClasses('appearance')}
                        >
                            Appearance
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={tabClasses('notifications')}
                        >
                            Notifications
                        </button>
                        <button
                            onClick={() => setActiveTab('taskDefaults')}
                            className={tabClasses('taskDefaults')}
                        >
                            Task Defaults
                        </button>
                        <button
                            onClick={() => setActiveTab('data')}
                            className={tabClasses('data')}
                        >
                            Data Management
                        </button>
                        <button
                            onClick={() => setActiveTab('privacy')}
                            className={tabClasses('privacy')}
                        >
                            Privacy
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'account' && <AccountSettings />}

                    {activeTab === 'appearance' && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Display Settings</h2>
                            <ThemeSettings />
                        </div>
                    )}

                    {activeTab === 'notifications' && <NotificationSettings />}

                    {activeTab === 'taskDefaults' && <TaskDefaultsSettings />}

                    {activeTab === 'data' && <DataManagementSettings />}

                    {activeTab === 'privacy' && <PrivacySettings />}
                </div>
            </div>
        </div>
    );
};

export default Settings;
