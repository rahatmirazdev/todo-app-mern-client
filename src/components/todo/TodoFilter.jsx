import { useState, useEffect } from 'react';
import { useTodo } from '../../context/TodoContext';

const TodoFilter = ({ filters, onFilterChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { loading } = useTodo();
    const [isFiltersApplied, setIsFiltersApplied] = useState(false);
    const [dateFilterType, setDateFilterType] = useState('any');
    const [customDateFrom, setCustomDateFrom] = useState('');
    const [customDateTo, setCustomDateTo] = useState('');

    useEffect(() => {
        // Check if any filter is applied
        const hasFilters = 
            filters.status !== '' || 
            filters.priority !== '' || 
            filters.category !== '' || 
            filters.search !== '' ||
            filters.dueDateFrom !== '' ||
            filters.dueDateTo !== '';
        
        setIsFiltersApplied(hasFilters);
    }, [filters]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ [name]: value });
    };

    const handleSearchChange = (e) => {
        // Debounce search input
        const searchTerm = e.target.value;
        onFilterChange({ search: searchTerm });
    };

    const clearFilters = () => {
        onFilterChange({
            status: '',
            priority: '',
            category: '',
            search: '',
            dueDateFrom: '',
            dueDateTo: ''
        });
        setDateFilterType('any');
        setCustomDateFrom('');
        setCustomDateTo('');
    };

    const handleDateFilterChange = (e) => {
        const value = e.target.value;
        setDateFilterType(value);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let fromDate = '';
        let toDate = '';
        
        switch(value) {
            case 'today':
                fromDate = today.toISOString().split('T')[0];
                toDate = today.toISOString().split('T')[0];
                break;
            case 'thisWeek':
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay());
                const endOfWeek = new Date(today);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                fromDate = startOfWeek.toISOString().split('T')[0];
                toDate = endOfWeek.toISOString().split('T')[0];
                break;
            case 'nextWeek':
                const startOfNextWeek = new Date(today);
                startOfNextWeek.setDate(today.getDate() - today.getDay() + 7);
                const endOfNextWeek = new Date(today);
                endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
                fromDate = startOfNextWeek.toISOString().split('T')[0];
                toDate = endOfNextWeek.toISOString().split('T')[0];
                break;
            case 'overdue':
                toDate = new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0];
                break;
            case 'noDueDate':
                fromDate = 'none';
                break;
            case 'custom':
                // Will be handled by separate inputs
                break;
            default:
                // Any - clear both
                break;
        }
        
        onFilterChange({
            dueDateFrom: fromDate,
            dueDateTo: toDate
        });
    };

    const handleCustomDateChange = (e) => {
        const { name, value } = e.target;
        if (name === 'customDateFrom') {
            setCustomDateFrom(value);
            onFilterChange({ dueDateFrom: value });
        } else if (name === 'customDateTo') {
            setCustomDateTo(value);
            onFilterChange({ dueDateTo: value });
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-md shadow p-4">
            {/* Search input */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search todos..."
                    value={filters.search}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    disabled={loading}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {loading ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Filter toggle */}
            <div className="mt-4 flex items-center justify-between">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    {isExpanded ? 'Hide Filters' : 'Show Filters'}
                    {isFiltersApplied && !isExpanded && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                            Filters applied
                        </span>
                    )}
                </button>

                {isFiltersApplied && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {/* Filter options */}
            {isExpanded && (
                <div className="mt-4 space-y-4">
                    {/* First row of filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-70"
                                disabled={loading}
                            >
                                <option value="">All Statuses</option>
                                <option value="todo">To Do</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Priority
                            </label>
                            <select
                                name="priority"
                                value={filters.priority}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-70"
                                disabled={loading}
                            >
                                <option value="">All Priorities</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Category
                            </label>
                            <select
                                name="category"
                                value={filters.category}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-70"
                                disabled={loading}
                            >
                                <option value="">All Categories</option>
                                <option value="general">General</option>
                                <option value="work">Work</option>
                                <option value="personal">Personal</option>
                                <option value="shopping">Shopping</option>
                                <option value="health">Health</option>
                                <option value="education">Education</option>
                            </select>
                        </div>
                    </div>

                    {/* Second row for due date filters */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Due Date
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <select
                                name="dateFilterType"
                                value={dateFilterType}
                                onChange={handleDateFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-70"
                                disabled={loading}
                            >
                                <option value="any">Any Date</option>
                                <option value="today">Today</option>
                                <option value="thisWeek">This Week</option>
                                <option value="nextWeek">Next Week</option>
                                <option value="overdue">Overdue</option>
                                <option value="noDueDate">No Due Date</option>
                                <option value="custom">Custom Range</option>
                            </select>

                            {dateFilterType === 'custom' && (
                                <>
                                    <div className="md:col-span-1">
                                        <input
                                            type="date"
                                            name="customDateFrom"
                                            value={customDateFrom}
                                            onChange={handleCustomDateChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-70"
                                            placeholder="From"
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <input
                                            type="date"
                                            name="customDateTo"
                                            value={customDateTo}
                                            onChange={handleCustomDateChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-70"
                                            placeholder="To"
                                            disabled={loading}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TodoFilter;
