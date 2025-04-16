import React from 'react';

const StatusDropdown = ({ status, onStatusChange, todoId, isLoading, disableComplete }) => {
    // Get status class
    const getStatusClass = (status) => {
        switch (status) {
            case 'todo':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <select
            value={status}
            onChange={(e) => onStatusChange(todoId, e.target.value)}
            className={`text-xs px-2 py-1 rounded dark:text-white ${getStatusClass(status)} border-0 outline-none ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={isLoading}
        >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed" disabled={disableComplete}>Completed</option>
        </select>
    );
};

export default StatusDropdown;
