import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosPrivate from '../services/api/axiosPrivate';
import { useAuth } from './AuthContext';

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        category: '',
        search: '',
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });
    const [sortConfig, setSortConfig] = useState({
        field: 'createdAt',
        direction: 'desc'
    });

    const { user } = useAuth();

    // Fetch todos with filters, sorting, and pagination
    const fetchTodos = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            // Build query params
            const params = new URLSearchParams();

            // Add filters
            if (filters.status) params.append('status', filters.status);
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.category) params.append('category', filters.category);
            if (filters.search) params.append('search', filters.search);

            // Add pagination
            params.append('page', pagination.page);
            params.append('limit', pagination.limit);

            // Add sorting
            params.append('sortBy', sortConfig.field);
            params.append('order', sortConfig.direction);

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
    }, [user, filters, pagination.page, pagination.limit, sortConfig]);

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

    // Update todo status
    const updateTodoStatus = useCallback(async (id, status) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosPrivate.patch(`/todos/${id}/status`, { status });

            // Update todo in the list
            setTodos(todos.map(todo =>
                todo._id === id ? response.data : todo
            ));

            return response.data;
        } catch (err) {
            setError(err.message || 'Failed to update todo status');
            console.error('Error updating todo status:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [todos]);

    // Update filters
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        // Reset to first page when filters change
        setPagination(prev => ({ ...prev, page: 1 }));
    }, []);

    // Update sort config
    const updateSortConfig = useCallback((field) => {
        setSortConfig(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    }, []);

    // Change page
    const changePage = useCallback((newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    }, []);

    // Context value
    const value = {
        todos,
        loading,
        error,
        filters,
        pagination,
        sortConfig,
        fetchTodos,
        createTodo,
        updateTodo,
        deleteTodo,
        updateTodoStatus,
        updateFilters,
        updateSortConfig,
        changePage
    };

    return (
        <TodoContext.Provider value={value}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodo = () => useContext(TodoContext);
