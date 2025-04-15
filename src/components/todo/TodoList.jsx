import { useState } from 'react';
import { useTodo } from '../../context/TodoContext';
import TodoTable from './TodoTable';
import toast from 'react-hot-toast';

const TodoList = ({ todos, loading, sortConfig, onSortChange, onEdit, pagination, onPageChange, onViewHistory }) => {
    const { updateTodoStatus, deleteTodo } = useTodo();
    const [actionLoading, setActionLoading] = useState(null);
    const [statusModal, setStatusModal] = useState({ visible: false, todoId: null, currentStatus: null });

    const handleStatusChange = async (id, status) => {
        // If moving to completed, show comment modal
        if (status === 'completed') {
            const todo = todos.find(t => t._id === id);
            setStatusModal({
                visible: true,
                todoId: id,
                currentStatus: todo.status,
                newStatus: status
            });
            return;
        }

        // Otherwise update directly
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

    const handleStatusModalSubmit = async (comment) => {
        setActionLoading(statusModal.todoId);
        try {
            await updateTodoStatus(statusModal.todoId, statusModal.newStatus, comment);
            toast.success(`Status updated to ${statusModal.newStatus.replace('_', ' ')}`);
        } catch (error) {
            toast.error('Failed to update status');
            console.error('Failed to update status:', error);
        } finally {
            setActionLoading(null);
            setStatusModal({ visible: false, todoId: null, currentStatus: null });
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

    // Enhanced sorting handler
    const handleSort = (field, isSecondary = false) => {
        onSortChange(field, isSecondary);
    };

    // Enhanced sort indicator
    const renderSortIndicator = (field) => {
        const isPrimary = sortConfig.primaryField === field;
        const isSecondary = sortConfig.secondaryField === field;

        if (!isPrimary && !isSecondary) return null;

        const direction = isPrimary
            ? sortConfig.primaryDirection
            : sortConfig.secondaryDirection;

        return (
            <span className={`ml-1 ${isPrimary ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {direction === 'asc' ? '↑' : '↓'}
                {isPrimary && <span className="text-xs ml-1">1</span>}
                {isSecondary && <span className="text-xs ml-1">2</span>}
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
            {/* Sort instructions */}
            <div className="p-3 bg-gray-50 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
                <span className="font-medium">Tip:</span> Click column headers to sort.
                <span className="ml-1">Hold Ctrl/Cmd while clicking for secondary sort.</span>
            </div>

            {/* Table Header */}
            <div className="overflow-x-auto">
                <TodoTable
                    todos={todos}
                    sortConfig={sortConfig}
                    handleSort={handleSort}
                    renderSortIndicator={renderSortIndicator}
                    handleStatusChange={handleStatusChange}
                    handleDelete={handleDelete}
                    onEdit={onEdit}
                    onViewHistory={onViewHistory}
                    actionLoading={actionLoading}
                />
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

            {/* Status Change Modal */}
            {statusModal.visible && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="fixed inset-0 bg-black opacity-50"></div>

                        <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Complete this task?
                            </h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Add a comment (optional)
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                    rows="3"
                                    placeholder="Add details about this status change..."
                                    id="statusComment"
                                ></textarea>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                                    onClick={() => setStatusModal({ visible: false, todoId: null })}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                    onClick={() => {
                                        const comment = document.getElementById('statusComment').value;
                                        handleStatusModalSubmit(comment);
                                    }}
                                >
                                    Complete Task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TodoList;
