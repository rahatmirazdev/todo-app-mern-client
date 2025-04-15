import React from 'react';

const TodoActions = ({ todo, onEdit, onDelete, onViewHistory, onViewSeries, isLoading }) => {
    return (
        <div className="flex space-x-2">
            <button
                onClick={() => onEdit(todo)}
                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                disabled={isLoading}
            >
                Edit
            </button>
            <button
                onClick={() => onDelete(todo._id, todo.title)}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                disabled={isLoading}
            >
                Delete
            </button>
            <button
                onClick={() => onViewHistory(todo._id, todo.title)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                disabled={isLoading}
            >
                History
            </button>

            {/* Add recurring series button */}
            {todo.isRecurring && (
                <button
                    onClick={() => onViewSeries(todo._id, todo.title)}
                    className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                    disabled={isLoading}
                >
                    Series
                </button>
            )}
        </div>
    );
};

export default TodoActions;
