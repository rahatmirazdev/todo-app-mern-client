import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeSettings = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="mb-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-medium text-gray-700 dark:text-gray-300">Theme Preference</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Choose your preferred theme
                    </p>
                </div>

                <select
                    value={theme}
                    onChange={(e) => {
                        // If the new value is different from current theme, toggle it
                        if ((e.target.value === 'dark' && theme === 'light') ||
                            (e.target.value === 'light' && theme === 'dark')) {
                            toggleTheme();
                        }
                    }}
                    className="block w-32 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-md">
                <p className="flex items-center">
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    You can also toggle the theme using the sun/moon icon in the header.
                </p>
            </div>
        </div>
    );
};

export default ThemeSettings;
