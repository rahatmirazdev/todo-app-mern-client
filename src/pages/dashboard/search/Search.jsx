import { useState, useEffect } from 'react';
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

    const searchQuery = searchParams.get('q') || '';

    // Apply URL search parameter
    useEffect(() => {
        if (initialLoad && searchQuery) {
            updateFilters({ search: searchQuery });
            fetchTodos().then(() => setInitialLoad(false));
        }
    }, [initialLoad, searchQuery, updateFilters, fetchTodos]);

    // Update URL when filters.search changes
    useEffect(() => {
        if (!initialLoad && filters.search !== searchQuery) {
            if (filters.search) {
                setSearchParams({ q: filters.search });
            } else {
                setSearchParams({});
            }
        }
    }, [filters.search, initialLoad, searchQuery, setSearchParams]);

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

            {/* TodoFilter component */}
            <TodoFilter
                filters={filters}
                onFilterChange={updateFilters}
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
