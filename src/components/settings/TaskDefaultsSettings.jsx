import React, { useState, useEffect } from 'react';
import axiosPrivate from '../../services/api/axiosPrivate';
import toast from 'react-hot-toast';

const TaskDefaultsSettings = () => {
    const [defaults, setDefaults] = useState({
        defaultPriority: 'medium',
        defaultCategory: 'general',
        defaultView: 'list',
        autoCreateSubtasks: false,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);

    // Fetch user preferences from backend
    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                setLoading(true);
                const response = await axiosPrivate.get('/users/preferences');

                // Extract taskDefaults from the response
                if (response.data && response.data.taskDefaults) {
                    setDefaults(response.data.taskDefaults);
                }
            } catch (err) {
                console.error('Error fetching preferences:', err);
                setError('Failed to load preferences. Using defaults.');

                // Fall back to localStorage
                setDefaults({
                    defaultPriority: localStorage.getItem('taskDefaultPriority') || 'medium',
                    defaultCategory: localStorage.getItem('taskDefaultCategory') || 'general',
                    defaultView: localStorage.getItem('taskDefaultView') || 'list',
                    autoCreateSubtasks: localStorage.getItem('autoCreateSubtasks') === 'true',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPreferences();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDefaults({
            ...defaults,
            [name]: type === 'checkbox' ? checked : value
        });
        setSaved(false);
    };

    const saveDefaults = async () => {
        try {
            setSaving(true);

            // Call backend API to update preferences
            await axiosPrivate.put('/users/preferences', {
                taskDefaults: defaults
            });

            // Also update localStorage as fallback
            Object.entries(defaults).forEach(([key, value]) => {
                localStorage.setItem(key, value);
            });

            setSaved(true);
            toast.success('Task defaults saved successfully');

            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error('Error saving preferences:', err);
            toast.error('Failed to save preferences to server. Saved locally only.');

            // Still save to localStorage as fallback
            Object.entries(defaults).forEach(([key, value]) => {
                localStorage.setItem(key, value);
            });
        } finally {
            setSaving(false);
        }
    };

    // Show loading spinner while fetching preferences
    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Task Default Settings</h2>

            {error && (
                <div className="mb-4 p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded-md">
                    {error}
                </div>
            )}

            <div className="space-y-4 mb-6">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Default Priority
                    </label>
                    <select
                        name="defaultPriority"
                        value={defaults.defaultPriority}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Default Category
                    </label>
                    <select
                        name="defaultCategory"
                        value={defaults.defaultCategory}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="general">General</option>
                        <option value="work">Work</option>
                        <option value="personal">Personal</option>
                        <option value="shopping">Shopping</option>
                        <option value="health">Health</option>
                        <option value="education">Education</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Default View
                    </label>
                    <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="defaultView"
                                value="list"
                                checked={defaults.defaultView === 'list'}
                                onChange={handleChange}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">List View</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="defaultView"
                                value="kanban"
                                checked={defaults.defaultView === 'kanban'}
                                onChange={handleChange}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">Kanban View</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="autoCreateSubtasks"
                            checked={defaults.autoCreateSubtasks}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                            Automatically suggest subtasks from task description
                        </span>
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-6">
                        When enabled, the system will analyze your task description to suggest potential subtasks.
                    </p>
                </div>
            </div>

            <div className="flex items-center">
                <button
                    onClick={saveDefaults}
                    disabled={saving}
                    className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-300 disabled:opacity-70"
                >
                    {saving ? "Saving..." : "Save Defaults"}
                </button>

                {saved && (
                    <span className="ml-3 text-green-600 dark:text-green-400 text-sm">
                        ✓ Settings saved successfully
                    </span>
                )}
            </div>
        </div>
    );
};

export default TaskDefaultsSettings;
