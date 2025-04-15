import { useState } from 'react';
import { useTodo } from '../../context/TodoContext';
import TodoItem from './TodoItem';
import toast from 'react-hot-toast';

const TodoList = ({ todos, loading, sortConfig, onSortChange, onEdit, pagination, onPageChange }) => {
    const { updateTodoStatus, deleteTodo } = useTodo();
    const [actionLoading, setActionLoading] = useState(null);

    const handleStatusChange = async (id, status) => {
        setActionLoading(id);
        try {
            await updateTodoStatus(id, status);
            toast.success(`Status updated to ${status.replace('_', ' ')}`);
        } catch (error) {
            toast.error('Failed to update status');
            console.error('Failed to update status:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            setActionLoading(id);
            try {
                await deleteTodo(id);
                toast.success('Todo deleted successfully');
            } catch (error) {
                toast.error('Failed to delete todo');
                console.error('Failed to delete todo:', error);
            } finally {
                setActionLoading(null);
            }
        }
    };

    // Handle sorting
    const handleSort = (field) => {
        onSortChange(field);
    };

    // Render sort indicator
    const renderSortIndicator = (field) => {
        if (sortConfig.field !== field) return null;

        return (
            <span className="ml-1">
                {sortConfig.direction === 'asc' ? '↑' : '↓'}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-md shadow p-6">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading your todos...</p>
                </div>
            </div>
        );
    }

    if (todos.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-md shadow p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No todos found.</p>
                <p className="text-gray-400 dark:text-gray-500">
                    {pagination.total === 0
                        ? "Create your first todo to get started!"
                        : "Try changing your filters to see more results."}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-md shadow overflow-hidden">
            {/* Table Header */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('title')}
                            >
                                <div className="flex items-center">
                                    Title {renderSortIndicator('title')}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('status')}
                            >
                                <div className="flex items-center">
                                    Status {renderSortIndicator('status')}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('priority')}
                            >
                                <div className="flex items-center">
                                    Priority {renderSortIndicator('priority')}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('dueDate')}
                            >
                                <div className="flex items-center">
                                    Due Date {renderSortIndicator('dueDate')}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {todos.map(todo => (
                            <TodoItem
                                key={todo._id}
                                todo={todo}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDelete}
                                onEdit={onEdit}
                                isLoading={actionLoading === todo._id}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Showing <span className="font-medium">{pagination.page}</span> of <span className="font-medium">{pagination.pages}</span> pages
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onPageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => onPageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.pages}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TodoList;
