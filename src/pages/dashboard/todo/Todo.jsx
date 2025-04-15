import { useState, useEffect } from 'react';
import { useTodo } from '../../../context/TodoContext';
import TodoList from '../../../components/todo/TodoList';
import TodoFilter from '../../../components/todo/TodoFilter';
import TodoModal from '../../../components/todo/TodoModal';
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
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);

    // Handle initial data loading
    useEffect(() => {
        if (initialLoad) {
            fetchTodos().then(() => setInitialLoad(false));
        }
    }, [fetchTodos, initialLoad]);

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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Todo List</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                    Create Todo
                </button>
            </div>

            {/* TodoFilter component */}
            <TodoFilter
                filters={filters}
                onFilterChange={updateFilters}
            />

            {/* TodoList component with loading state */}
            <TodoList
                todos={todos}
                loading={loading || initialLoad}
                sortConfig={sortConfig}
                onSortChange={updateSortConfig}
                onEdit={handleEditTodo}
                pagination={pagination}
                onPageChange={changePage}
            />

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
        </div>
    );
};

export default Todo;
