import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTodo } from '../../../context/TodoContext';
import TodoList from '../../../components/todo/TodoList';
import TodoFilter from '../../../components/todo/TodoFilter';
import TodoModal from '../../../components/todo/TodoModal';
import KanbanBoard from '../../../components/todo/KanbanBoard';
import StatusHistoryModal from '../../../components/todo/StatusHistoryModal';
import toast from 'react-hot-toast';
import axiosPrivate from '../../../services/api/axiosPrivate';

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
    const [viewMode, setViewMode] = useState('list'); // Default
    const [historyModal, setHistoryModal] = useState({ isOpen: false, todoId: null, todoTitle: '' });
    const autoFocusSearch = useRef(true);
    const [shouldFocusSearch, setShouldFocusSearch] = useState(true);
    const [loadingPreferences, setLoadingPreferences] = useState(true);

    // Apply URL parameters as filters and focus search box on initial load
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

            fetchTodos().then(() => {
                setInitialLoad(false);
                // Set autoFocus flag to true when component first mounts
                autoFocusSearch.current = true;
            });
        }
    }, [fetchTodos, initialLoad, searchParams, updateFilters]);

    // Fetch user preferences on mount
    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const response = await axiosPrivate.get('/users/preferences');

                if (response.data && response.data.taskDefaults && response.data.taskDefaults.defaultView) {
                    setViewMode(response.data.taskDefaults.defaultView);
                } else {
                    // Fall back to localStorage if no preferences from server
                    const savedView = localStorage.getItem('taskDefaultView');
                    if (savedView) {
                        setViewMode(savedView);
                    }
                }
            } catch (err) {
                console.error('Error fetching preferences:', err);

                // Fall back to localStorage
                const savedView = localStorage.getItem('taskDefaultView');
                if (savedView) {
                    setViewMode(savedView);
                }
            } finally {
                setLoadingPreferences(false);
            }
        };

        fetchPreferences();
    }, []);

    // Reset focus flag when this component unmounts and remounts
    useEffect(() => {
        setShouldFocusSearch(true);
        return () => setShouldFocusSearch(false);
    }, []);

    // Show any API errors as toast notifications
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // Handle the edit action
    const handleEditTodo = (todo) => {
        setEditingTodo(todo);
        setShouldFocusSearch(false); // Prevent refocusing search when editing
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
                    autoFocus={shouldFocusSearch}
                />
            )}

            {/* View Switcher */}
            {!loadingPreferences && (
                <>
                    {/* View toggle button */}
                    <div className="mb-4">
                        <button
                            onClick={() => setViewMode(viewMode === 'list' ? 'kanban' : 'list')}
                            className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                        >
                            {viewMode === 'list' ? 'Switch to Kanban View' : 'Switch to List View'}
                        </button>
                    </div>

                    {/* View content */}
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
                </>
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
