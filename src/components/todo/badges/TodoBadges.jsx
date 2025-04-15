import React from 'react';

const TodoBadges = ({ todo, subtaskProgress }) => {
    return (
        <div className="flex items-center">
            {/* Recurring indicator */}
            {todo.isRecurring && (
                <span className="ml-2 text-xs px-1.5 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {todo.recurringPattern}
                </span>
            )}

            {/* Subtask progress indicator */}
            {subtaskProgress && !todo.isRecurring && (
                <span className="ml-2 text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full flex items-center">
                    {subtaskProgress.completed}/{subtaskProgress.total}
                </span>
            )}
        </div>
    );
};

export default TodoBadges;
