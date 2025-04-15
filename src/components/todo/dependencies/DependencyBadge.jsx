import React from 'react';

const DependencyBadge = ({ todo, allTodos }) => {
    if (!todo.dependencies || todo.dependencies.length === 0) return null;

    const incompleteCount = todo.dependencies.filter(depId => {
        const dep = allTodos.find(t => t._id === depId);
        return dep && dep.status !== 'completed';
    }).length;

    if (incompleteCount === 0) return null;

    return (
        <span className="ml-2 text-xs px-1.5 py-0.5 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded-full flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {incompleteCount} dependenc{incompleteCount === 1 ? 'y' : 'ies'}
        </span>
    );
};

export default DependencyBadge;
