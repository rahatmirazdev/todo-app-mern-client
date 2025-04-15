import React from 'react';

const SubtaskFilter = ({ filters, handleSubtaskFilterChange, loading }) => {
    return (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subtasks
                </label>
                <select
                    name="hasSubtasks"
                    value={filters.hasSubtasks || ''}
                    onChange={handleSubtaskFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    disabled={loading}
                >
                    <option value="">Any</option>
                    <option value="true">Has subtasks</option>
                    <option value="false">No subtasks</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subtask Completion
                </label>
                <select
                    name="completedSubtasks"
                    value={filters.completedSubtasks || ''}
                    onChange={handleSubtaskFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    disabled={loading || filters.hasSubtasks === 'false'}
                >
                    <option value="">Any</option>
                    <option value="all">All completed</option>
                    <option value="none">None completed</option>
                    <option value="some">Some completed</option>
                </select>
            </div>
        </div>
    );
};

export default SubtaskFilter;
