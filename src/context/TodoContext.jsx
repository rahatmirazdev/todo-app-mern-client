import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosPrivate from '../services/api/axiosPrivate';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// Import useNotification conditionally to prevent circular dependencies
let useNotification;
try {
    useNotification = require('./NotificationContext').useNotification;
} catch (error) {
    useNotification = () => null;
}

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [allTags, setAllTags] = useState([]);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        category: '',
        search: '',
        tags: null,
        hasSubtasks: null,
        completedSubtasks: null
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });
    const [sortConfig, setSortConfig] = useState({
        primaryField: 'createdAt',
        primaryDirection: 'desc',
        secondaryField: null,
        secondaryDirection: 'asc'
    });
    const [allTodos, setAllTodos] = useState([]); // For dependency selection

    const { user } = useAuth();

    // Safely access the notification context if available
    const notificationContext = useNotification ? useNotification() : null;
    const showTaskUpdate = notificationContext?.showTaskUpdate || (() => { });

    // Fetch todos with filters, sorting, and pagination
    const fetchTodos = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            // Build query params
            const params = new URLSearchParams();

            // Add basic filters
            if (filters.status) params.append('status', filters.status);
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.category) params.append('category', filters.category);
            if (filters.search) params.append('search', filters.search);

            // Add tag filters
            if (filters.tags) {
                if (Array.isArray(filters.tags)) {
                    filters.tags.forEach(tag => params.append('tags', tag));
                } else {
                    params.append('tags', filters.tags);
                }
            }

            // Add subtask filters
            if (filters.hasSubtasks) {
                params.append('hasSubtasks', filters.hasSubtasks);
            }

            if (filters.completedSubtasks) {
                params.append('completedSubtasks', filters.completedSubtasks);
            }

            // Add pagination
            params.append('page', pagination.page);
            params.append('limit', pagination.limit);

            // Add sorting (primary and secondary)
            params.append('sortBy', sortConfig.primaryField);
            params.append('order', sortConfig.primaryDirection);

            if (sortConfig.secondaryField) {
                params.append('secondarySortBy', sortConfig.secondaryField);
                params.append('secondaryOrder', sortConfig.secondaryDirection);
            }

            const response = await axiosPrivate.get(`/todos?${params.toString()}`);

            setTodos(response.data.todos);
            setPagination(prev => ({
                ...prev,
                total: response.data.pagination.total,
                pages: response.data.pagination.pages
            }));
        } catch (err) {
            setError(err.message || 'Failed to fetch todos');
            console.error('Error fetching todos:', err);
        } finally {
            setLoading(false);
        }
    }, [user, filters, pagination.page, pagination.limit, sortConfig, axiosPrivate]);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    // Create a new todo
    const createTodo = useCallback(async (todoData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosPrivate.post('/todos', todoData);

            // Add new todo to the list and refresh
            fetchTodos();
            return response.data;
        } catch (err) {
            setError(err.message || 'Failed to create todo');
            console.error('Error creating todo:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchTodos]);

    // Update a todo
    const updateTodo = useCallback(async (id, todoData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosPrivate.put(`/todos/${id}`, todoData);

            // Update todo in the list
            setTodos(todos.map(todo =>
                todo._id === id ? response.data : todo
            ));

            return response.data;
        } catch (err) {
            setError(err.message || 'Failed to update todo');
            console.error('Error updating todo:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [todos]);

    // Delete a todo
    const deleteTodo = useCallback(async (id) => {
        setLoading(true);
        setError(null);

        try {
            await axiosPrivate.delete(`/todos/${id}`);

            // Remove todo from the list
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (err) {
            setError(err.message || 'Failed to delete todo');
            console.error('Error deleting todo:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [todos]);

    // Update todo status with recurring task support
    const updateTodoStatus = useCallback(async (id, status, comment = '') => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosPrivate.patch(`/todos/${id}/status`, {
                status,
                comment
            });

            // Check if response includes a new recurring task
            if (response.data.newRecurringTask) {
                // Add the new recurring task to the list
                setTodos(prevTodos => [
                    response.data.newRecurringTask,
                    ...prevTodos.map(todo =>
                        todo._id === id ? response.data.updatedTodo : todo
                    )
                ]);

                // Show notification about the new task
                toast.success('Recurring task completed. New task created!');
                showTaskUpdate('Recurring task completed. New task created!', id);

                return response.data.updatedTodo;
            } else {
                // Update todo in the list (no recurring)
                setTodos(todos.map(todo =>
                    todo._id === id ? response.data : todo
                ));

                // Show notification about status change
                if (status === 'completed') {
                    showTaskUpdate('Task marked as completed', id);
                } else if (status === 'in_progress') {
                    showTaskUpdate('Task moved to in progress', id);
                }

                return response.data;
            }
        } catch (err) {
            setError(err.message || 'Failed to update todo status');
            console.error('Error updating todo status:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [todos, axiosPrivate, showTaskUpdate]);

    // New function to get recurring series without affecting global loading state
    const getRecurringSeries = useCallback(async (recurringId) => {
        try {
            // Don't set the global loading state
            // setLoading(true);
            // setError(null);

            const response = await axiosPrivate.get(`/todos/series/${recurringId}`);
            return response.data;
        } catch (err) {
            // Just log the error locally, don't set global error state
            console.error('Error fetching recurring series:', err);
            throw err;
        } finally {
            // Don't reset global loading state
            // setLoading(false);
        }
    }, [axiosPrivate]);

    // Toggle subtask completion
    const toggleSubtask = useCallback(async (todoId, subtaskIndex) => {
        setLoading(true);
        setError(null);

        try {
            const todoToUpdate = todos.find(todo => todo._id === todoId);
            if (!todoToUpdate) {
                throw new Error('Todo not found');
            }

            // Create a deep copy of the todo's subtasks
            const updatedSubtasks = JSON.parse(JSON.stringify(todoToUpdate.subtasks));

            // Toggle the completion status
            updatedSubtasks[subtaskIndex].completed = !updatedSubtasks[subtaskIndex].completed;

            // Set the completedAt timestamp
            updatedSubtasks[subtaskIndex].completedAt = updatedSubtasks[subtaskIndex].completed
                ? new Date().toISOString()
                : null;

            // Send update to the server
            const response = await axiosPrivate.put(`/todos/${todoId}`, {
                subtasks: updatedSubtasks
            });

            // Update todo in the local state
            setTodos(todos.map(todo =>
                todo._id === todoId ? response.data : todo
            ));

            return response.data;
        } catch (err) {
            setError(err.message || 'Failed to toggle subtask');
            console.error('Error toggling subtask:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [todos, axiosPrivate]);

    // Update filters
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        // Reset to first page when filters change
        setPagination(prev => ({ ...prev, page: 1 }));
    }, []);

    // Enhanced sorting function to handle multi-column sorting
    const updateSortConfig = useCallback((field, isSecondary = false) => {
        setSortConfig(prev => {
            // If clicking on current primary sort field
            if (!isSecondary && prev.primaryField === field) {
                // Toggle direction
                return {
                    ...prev,
                    primaryDirection: prev.primaryDirection === 'asc' ? 'desc' : 'asc'
                };
            }

            // If clicking on current secondary sort field
            if (isSecondary && prev.secondaryField === field) {
                // Toggle direction
                return {
                    ...prev,
                    secondaryDirection: prev.secondaryDirection === 'asc' ? 'desc' : 'asc'
                };
            }

            // If setting a new primary field
            if (!isSecondary) {
                return {
                    ...prev,
                    primaryField: field,
                    primaryDirection: 'asc',
                    // Move current primary to secondary if there isn't already a secondary
                    secondaryField: prev.secondaryField || prev.primaryField !== field ? prev.primaryField : null,
                };
            }

            // If setting a new secondary field
            return {
                ...prev,
                secondaryField: field,
                secondaryDirection: 'asc'
            };
        });
    }, []);

    // Change page
    const changePage = useCallback((newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    }, []);

    // Function to fetch all tags
    const fetchAllTags = useCallback(async () => {
        if (!user) return;

        try {
            const response = await axiosPrivate.get('/todos/tags');
            setAllTags(response.data.tags);
        } catch (err) {
            console.error('Error fetching tags:', err);
        }
    }, [user, axiosPrivate]);

    // Fetch tags when user changes
    useEffect(() => {
        if (user) {
            fetchAllTags();
        }
    }, [user, fetchAllTags]);

    // Fetch all todos (for dependency selection) - with improved error handling
    const fetchAllTodos = useCallback(async () => {
        if (!user) return;

        try {
            const response = await axiosPrivate.get('/todos/all');
            setAllTodos(response.data);
        } catch (err) {
            console.error('Error fetching all todos:', err);
            // Don't set error in the context for this operation to avoid UI disruption
            // Just use an empty array as fallback
            setAllTodos([]);
        }
    }, [user, axiosPrivate]);

    // Check if a todo can be completed based on its dependencies
    const canCompleteTodo = useCallback((todoId) => {
        const todo = todos.find(t => t._id === todoId);
        if (!todo || !todo.dependencies || todo.dependencies.length === 0) {
            return true;
        }

        // Check if all dependencies are completed
        return todo.dependencies.every(depId => {
            const dependency = allTodos.find(t => t._id === depId);
            return dependency && dependency.status === 'completed';
        });
    }, [todos, allTodos]);

    // Fetch all todos when context is mounted
    useEffect(() => {
        if (user) {
            fetchAllTodos();
        }
    }, [user, fetchAllTodos]);

    // Context value
    const value = {
        todos,
        loading,
        error,
        allTodos,
        filters,
        pagination,
        sortConfig,
        fetchTodos,
        fetchAllTodos,
        createTodo,
        updateTodo,
        deleteTodo,
        updateTodoStatus,
        getRecurringSeries,
        toggleSubtask,
        updateFilters,
        updateSortConfig,
        changePage,
        canCompleteTodo
    };

    return (
        <TodoContext.Provider value={value}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodo = () => useContext(TodoContext);
