import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTodo } from '../../../context/TodoContext';
import TodoFilter from '../../../components/todo/TodoFilter';
import SearchResults from '../../../components/todo/SearchResults';
import TodoModal from '../../../components/todo/TodoModal';
import StatusHistoryModal from '../../../components/todo/StatusHistoryModal';
import toast from 'react-hot-toast';

const Search = () => {
    const {
        todos,
        loading,
        error,
        filters,
        fetchTodos,
        updateFilters,
    } = useTodo();

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [editingTodo, setEditingTodo] = useState(null);
    const [historyModal, setHistoryModal] = useState({ isOpen: false, todoId: null, todoTitle: '' });
    const [initialLoad, setInitialLoad] = useState(true);
    const urlUpdateTimeoutRef = useRef(null);
    const isMountedRef = useRef(true);
    const [isSearching, setIsSearching] = useState(false);

    const searchQuery = searchParams.get('q') || '';

    // Function to execute search
    const handleSearch = useCallback((searchTerm) => {
        // Clear any existing timeout
        if (urlUpdateTimeoutRef.current) {
            clearTimeout(urlUpdateTimeoutRef.current);
            urlUpdateTimeoutRef.current = null;
        }

        setIsSearching(true);

        // Batch these operations to minimize re-renders
        setTimeout(() => {
            // Update URL first
            if (searchTerm) {
                setSearchParams({ q: searchTerm });
            } else {
                setSearchParams({});
            }

            // Then update filters and fetch
            updateFilters({ search: searchTerm });

            fetchTodos()
                .then(() => {
                    if (isMountedRef.current) {
                        setIsSearching(false);
                    }
                })
                .catch(() => {
                    if (isMountedRef.current) {
                        setIsSearching(false);
                    }
                });
        }, 0);
    }, [fetchTodos, updateFilters, setSearchParams]);

    // Apply URL search parameter on initial load
    useEffect(() => {
        if (initialLoad && searchQuery) {
            updateFilters({ search: searchQuery });
            fetchTodos().then(() => setInitialLoad(false));
        } else if (initialLoad) {
            setInitialLoad(false);
        }
    }, [initialLoad, searchQuery, updateFilters, fetchTodos]);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            if (urlUpdateTimeoutRef.current) {
                clearTimeout(urlUpdateTimeoutRef.current);
            }
        };
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
    };

    // Handle view history action
    const handleViewHistory = (todoId, todoTitle) => {
        setHistoryModal({
            isOpen: true,
            todoId,
            todoTitle
        });
    };

    // Handle successful edit action
    const handleEditSuccess = () => {
        setEditingTodo(null);
        toast.success('Todo updated successfully!');
    };

    // Close modals on errors
    const handleError = (message) => {
        setEditingTodo(null);
        toast.error(message || 'An error occurred');
    };

    // Filter change handler - now only used for non-search filters
    const handleFilterChange = useCallback((filterUpdate) => {
        // For search changes, we don't want to trigger automatic searching
        if ('search' in filterUpdate && filterUpdate.search === '') {
            // For explicit search clear, we run the search with empty term
            handleSearch('');
        } else if (!('search' in filterUpdate)) {
            // For non-search filters, update them immediately
            updateFilters(filterUpdate);
        }
    }, [updateFilters, handleSearch]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Search Todos</h1>
                <button
                    onClick={() => navigate('/dashboard/todos')}
                    className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    Back to Todos
                </button>
            </div>

            {/* TodoFilter component with search trigger */}
            <TodoFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                isSearching={isSearching}
            />

            {/* Search Results component */}
            <SearchResults
                search={filters.search}
                onEditTodo={handleEditTodo}
                onViewHistory={handleViewHistory}
            />

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

export default Search;
