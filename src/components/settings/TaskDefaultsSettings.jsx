import React, { useState } from 'react';

const TaskDefaultsSettings = () => {
    const [defaults, setDefaults] = useState({
        defaultPriority: localStorage.getItem('taskDefaultPriority') || 'medium',
        defaultCategory: localStorage.getItem('taskDefaultCategory') || 'general',
        defaultView: localStorage.getItem('taskDefaultView') || 'list',
        autoCreateSubtasks: localStorage.getItem('autoCreateSubtasks') === 'true',
    });

    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDefaults({
            ...defaults,
            [name]: type === 'checkbox' ? checked : value
        });
        setSaved(false);
    };

    const saveDefaults = () => {
        Object.entries(defaults).forEach(([key, value]) => {
            localStorage.setItem(key, value);
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Task Default Settings</h2>

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
                    className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-300"
                >
                    Save Defaults
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
