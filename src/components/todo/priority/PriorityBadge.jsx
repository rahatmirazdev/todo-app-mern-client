import React from 'react';

const PriorityBadge = ({ priority }) => {
    // Get priority class
    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'medium':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
            case 'low':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityClass(priority)}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
    );
};

export default PriorityBadge;
