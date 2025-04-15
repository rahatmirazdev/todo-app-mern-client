import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTodo } from '../../../context/TodoContext';
import TodoList from '../../../components/todo/TodoList';
import TodoFilter from '../../../components/todo/TodoFilter';
import TodoModal from '../../../components/todo/TodoModal';
import KanbanBoard from '../../../components/todo/KanbanBoard';
import StatusHistoryModal from '../../../components/todo/StatusHistoryModal';
import toast from 'react-hot-toast';

const Todo = () => {
    const {
        todos,
        loading,
        error,
        filters,
        pagination,
        sortConfig,
        fetchTodos,
        updateFilters,
        updateSortConfig,
        changePage
    } = useTodo();
    const [searchParams] = useSearchParams();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'
    const [historyModal, setHistoryModal] = useState({ isOpen: false, todoId: null, todoTitle: '' });

    // Apply URL parameters as filters
    useEffect(() => {
        if (initialLoad) {
            const urlFilters = {
                priority: searchParams.get('priority') || '',
                status: searchParams.get('status') || '',
                category: searchParams.get('category') || '',
                search: searchParams.get('search') || ''
            };

            // Handle date filter from URL
            const dateFilter = searchParams.get('dateFilter');
            if (dateFilter) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                switch (dateFilter) {
                    case 'today':
                        urlFilters.dueDateFrom = today.toISOString().split('T')[0];
                        urlFilters.dueDateTo = today.toISOString().split('T')[0];
                        break;
                    case 'overdue':
                        urlFilters.dueDateTo = new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0];
                        break;
                    case 'upcoming':
                        const tomorrow = new Date(today);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const nextWeek = new Date(today);
                        nextWeek.setDate(nextWeek.getDate() + 7);
                        urlFilters.dueDateFrom = tomorrow.toISOString().split('T')[0];
                        urlFilters.dueDateTo = nextWeek.toISOString().split('T')[0];
                        break;
                }
            }

            // Only update filters if there's at least one filter in the URL
            if (Object.values(urlFilters).some(value => value !== '')) {
                updateFilters(urlFilters);
            }

            fetchTodos().then(() => setInitialLoad(false));
        }
    }, [fetchTodos, initialLoad, searchParams, updateFilters]);

    // Show any API errors as toast notifications
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // Handle the edit action
    const handleEditTodo = (todo) => {
        setEditingTodo(todo);
    };

    // Handle view history action
    const handleViewHistory = (todoId, todoTitle) => {
        setHistoryModal({
            isOpen: true,
            todoId,
            todoTitle
        });
    };

    // Handle successful create action
    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        toast.success('Todo created successfully!');
    };

    // Handle successful edit action
    const handleEditSuccess = () => {
        setEditingTodo(null);
        toast.success('Todo updated successfully!');
    };

    // Close modals on errors too
    const handleError = (message) => {
        setIsCreateModalOpen(false);
        setEditingTodo(null);
        toast.error(message || 'An error occurred');
    };

    // Add a handler for search in the Todo component
    const handleSearch = useCallback((searchTerm) => {
        updateFilters({ search: searchTerm });
        fetchTodos();
    }, [updateFilters, fetchTodos]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Todo List</h1>
                <div className="flex space-x-2">
                    {/* View Mode Toggle */}
                    <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-2 text-sm ${viewMode === 'list'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                        >
                            List View
                        </button>
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`px-3 py-2 text-sm ${viewMode === 'kanban'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                        >
                            Kanban
                        </button>
                    </div>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Create Todo
                    </button>
                </div>
            </div>

            {/* TodoFilter component (only shown in list view) */}
            {viewMode === 'list' && (
                <TodoFilter
                    filters={filters}
                    onFilterChange={updateFilters}
                    onSearch={handleSearch}
                    isSearching={loading}
                />
            )}

            {/* View Switcher */}
            {viewMode === 'list' ? (
                <TodoList
                    todos={todos}
                    loading={loading || initialLoad}
                    sortConfig={sortConfig}
                    onSortChange={updateSortConfig}
                    onEdit={handleEditTodo}
                    onViewHistory={handleViewHistory}
                    pagination={pagination}
                    onPageChange={changePage}
                />
            ) : (
                <KanbanBoard
                    todos={todos}
                    onEdit={handleEditTodo}
                />
            )}

            {/* Create Todo Modal */}
            {isCreateModalOpen && (
                <TodoModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    mode="create"
                    onSuccess={handleCreateSuccess}
                    onError={handleError}
                />
            )}

            {/* Edit Todo Modal */}
            {editingTodo && (
                <TodoModal
                    isOpen={!!editingTodo}
                    onClose={() => setEditingTodo(null)}
                    mode="edit"
                    todo={editingTodo}
                    onSuccess={handleEditSuccess}
                    onError={handleError}
                />
            )}

            {/* Status History Modal */}
            {historyModal.isOpen && (
                <StatusHistoryModal
                    isOpen={historyModal.isOpen}
                    onClose={() => setHistoryModal({ isOpen: false, todoId: null, todoTitle: '' })}
                    todoId={historyModal.todoId}
                    todoTitle={historyModal.todoTitle}
                />
            )}
        </div>
    );
};

export default Todo;
