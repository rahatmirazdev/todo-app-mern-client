import { useState } from 'react';

const TodoItem = ({ todo, onStatusChange, onDelete, onEdit, onViewHistory, onViewSeries, isLoading, searchHighlight }) => {
    const [showDetails, setShowDetails] = useState(false);

    // Format date
    const formatDate = (date) => {
        if (!date) return 'No date set';
        return new Date(date).toLocaleDateString();
    };

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

    // Display status in a more readable format
    const formatStatus = (status) => {
        switch (status) {
            case 'todo':
                return 'To Do';
            case 'in_progress':
                return 'In Progress';
            case 'completed':
                return 'Completed';
            default:
                return status;
        }
    };

    // Check if due date is overdue
    const isOverdue = (dueDate) => {
        if (!dueDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDateObj = new Date(dueDate);
        dueDateObj.setHours(0, 0, 0, 0);
        return dueDateObj < today && todo.status !== 'completed';
    };

    // Check if due date is today
    const isDueToday = (dueDate) => {
        if (!dueDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDateObj = new Date(dueDate);
        dueDateObj.setHours(0, 0, 0, 0);
        return dueDateObj.getTime() === today.getTime();
    };

    // Get due date class
    const getDueDateClass = (dueDate) => {
        if (isOverdue(dueDate)) {
            return 'text-red-600 font-medium dark:text-red-400';
        } else if (isDueToday(dueDate)) {
            return 'text-orange-600 font-medium dark:text-orange-400';
        }
        return 'text-gray-500 dark:text-gray-400';
    };

    // Highlight search terms in text
    const highlightText = (text, highlight) => {
        if (!highlight || !text) return text;

        // Escape special regex characters
        const sanitizedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const parts = text.split(new RegExp(`(${sanitizedHighlight})`, 'gi'));

        return parts.map((part, index) =>
            part.toLowerCase() === highlight.toLowerCase()
                ? <mark key={index} className="bg-yellow-200 dark:bg-yellow-700 px-1 rounded">{part}</mark>
                : part
        );
    };

    return (
        <tr className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${isLoading ? 'opacity-60' : ''}`}>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-start">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        {showDetails ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                    <div>
                        <div className="font-medium text-gray-900 dark:text-white flex items-center">
                            {searchHighlight ? highlightText(todo.title, searchHighlight) : todo.title}

                            {/* Recurring indicator */}
                            {todo.isRecurring && (
                                <span className="ml-2 text-xs px-1.5 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    {todo.recurringPattern}
                                </span>
                            )}
                        </div>
                        {showDetails && todo.description && (
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {searchHighlight ? highlightText(todo.description, searchHighlight) : todo.description}
                            </p>
                        )}
                        {/* Show tags with highlight if search is active */}
                        {(showDetails || searchHighlight) && todo.tags && todo.tags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                                {todo.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className={`px-2 py-0.5 rounded-full text-xs ${searchHighlight && tag.toLowerCase().includes(searchHighlight.toLowerCase())
                                            ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200'
                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <select
                    value={todo.status}
                    onChange={(e) => onStatusChange(todo._id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded ${getStatusClass(todo.status)} border-0 outline-none ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    disabled={isLoading}
                >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityClass(todo.priority)}`}>
                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className={`flex items-center ${getDueDateClass(todo.dueDate)}`}>
                    {isOverdue(todo.dueDate) && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    )}
                    {isDueToday(todo.dueDate) && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                    )}
                    {formatDate(todo.dueDate)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {isLoading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : (
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
                )}
            </td>
        </tr>
    );
};

export default TodoItem;
