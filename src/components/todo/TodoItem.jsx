import { useState } from 'react';

const TodoItem = ({ todo, onStatusChange, onDelete, onEdit, isLoading }) => {
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
                        <div className="font-medium text-gray-900 dark:text-white">{todo.title}</div>
                        {showDetails && todo.description && (
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{todo.description}</p>
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
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {formatDate(todo.dueDate)}
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
                    </div>
                )}
            </td>
        </tr>
    );
};

export default TodoItem;
