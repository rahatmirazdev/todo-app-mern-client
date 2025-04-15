import { useState, useEffect, useCallback, useRef } from 'react';
import { useTodo } from '../../context/TodoContext';
import SearchBar from './filter/SearchBar';
import FilterToggle from './filter/FilterToggle';
import StatusPriorityFilters from './filter/StatusPriorityFilters';
import DateFilter from './filter/DateFilter';
import TagFilter from './filter/TagFilter';
import SubtaskFilter from './filter/SubtaskFilter';
import debounce from 'lodash.debounce';

const TodoFilter = ({ filters, onFilterChange, onSearch, isSearching, autoFocus = false }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { loading, allTags } = useTodo();
    const [isFiltersApplied, setIsFiltersApplied] = useState(false);
    const [dateFilterType, setDateFilterType] = useState('any');
    const [customDateFrom, setCustomDateFrom] = useState('');
    const [customDateTo, setCustomDateTo] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [localSearch, setLocalSearch] = useState('');
    const searchInputRef = useRef(null);
    const formSubmitted = useRef(false);

    // Initialize searchInput from filters on mount
    useEffect(() => {
        setLocalSearch(filters.search || '');
    }, []);

    // Update searchInput when filters.search changes externally
    useEffect(() => {
        if (formSubmitted.current && filters.search !== localSearch) {
            setLocalSearch(filters.search || '');
            formSubmitted.current = false;
        }
    }, [filters.search, localSearch]);

    // Handle focus preservation after URL updates
    useEffect(() => {
        // Restore focus if we still have a search term
        if (localSearch && searchInputRef.current && document.activeElement !== searchInputRef.current) {
            // Use timeout to let the render cycle complete before restoring focus
            const timeoutId = setTimeout(() => {
                searchInputRef.current.focus();
                // Position cursor at the end of input
                const length = searchInputRef.current.value.length;
                searchInputRef.current.setSelectionRange(length, length);
            }, 50);

            return () => clearTimeout(timeoutId);
        }
    }, [filters, localSearch]);

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

    useEffect(() => {
        // Use allTags from the context that's now properly retrieved at component top level
        if (allTags) {
            setAvailableTags(allTags);
        }
    }, [allTags]); // Add allTags as a dependency

    useEffect(() => {
        // Sync selectedTags with filters.tags
        if (filters.tags) {
            setSelectedTags(Array.isArray(filters.tags) ? filters.tags : [filters.tags]);
        } else {
            setSelectedTags([]);
        }
    }, [filters.tags]);

    // Focus input when component mounts if autoFocus is true
    useEffect(() => {
        if (autoFocus && searchInputRef.current) {
            // Focus immediately
            searchInputRef.current.focus();

            // Also try with a small delay as a fallback
            const timer = setTimeout(() => {
                if (searchInputRef.current) {
                    searchInputRef.current.focus();
                }
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [autoFocus]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ [name]: value });
    };

    const handleSearchChange = (e) => {
        setLocalSearch(e.target.value);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            triggerSearch();
        }

        if (e.key === 'Escape') {
            e.preventDefault();
            setLocalSearch('');
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        triggerSearch();
    };

    const triggerSearch = () => {
        if (typeof onSearch === 'function') {
            onSearch(localSearch);
        } else {
            onFilterChange({ search: localSearch });
        }
    };

    const clearFilters = () => {
        setLocalSearch('');
        onFilterChange({
            status: '',
            priority: '',
            category: '',
            search: '',
            dueDateFrom: '',
            dueDateTo: '',
            tags: null,
            hasSubtasks: null,
            completedSubtasks: null
        });
        setDateFilterType('any');
        setCustomDateFrom('');
        setCustomDateTo('');
        setSelectedTags([]);
        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 0);
    };

    const handleDateFilterChange = (e) => {
        const { value } = e.target;
        setDateFilterType(value);

        // Reset custom dates when changing filter type
        if (value !== 'custom') {
            setCustomDateFrom('');
            setCustomDateTo('');
        }

        // Apply filter values based on selection
        switch (value) {
            case 'any':
                onFilterChange({ dueDateFrom: '', dueDateTo: '' });
                break;
            case 'today':
                const today = new Date().toISOString().split('T')[0];
                onFilterChange({ dueDateFrom: today, dueDateTo: today });
                break;
            case 'thisWeek':
                // Current week (Sunday to Saturday)
                const now = new Date();
                const dayOfWeek = now.getDay(); // 0 is Sunday, 6 is Saturday
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - dayOfWeek);
                const endOfWeek = new Date(now);
                endOfWeek.setDate(startOfWeek.getDate() + 6);

                onFilterChange({
                    dueDateFrom: startOfWeek.toISOString().split('T')[0],
                    dueDateTo: endOfWeek.toISOString().split('T')[0]
                });
                break;
            case 'nextWeek':
                // Next week
                const nextWeekNow = new Date();
                const nextWeekDayOfWeek = nextWeekNow.getDay();
                const nextWeekStartOfWeek = new Date(nextWeekNow);
                nextWeekStartOfWeek.setDate(nextWeekNow.getDate() - nextWeekDayOfWeek + 7);
                const nextWeekEndOfWeek = new Date(nextWeekStartOfWeek);
                nextWeekEndOfWeek.setDate(nextWeekStartOfWeek.getDate() + 6);

                onFilterChange({
                    dueDateFrom: nextWeekStartOfWeek.toISOString().split('T')[0],
                    dueDateTo: nextWeekEndOfWeek.toISOString().split('T')[0]
                });
                break;
            case 'overdue':
                // Before today (not including today)
                const todayDate = new Date();
                todayDate.setHours(0, 0, 0, 0);
                const yesterday = new Date(todayDate);
                yesterday.setDate(todayDate.getDate() - 1);

                onFilterChange({
                    dueDateFrom: '',
                    dueDateTo: yesterday.toISOString().split('T')[0]
                });
                break;
            case 'noDueDate':
                // Special case: no due date set
                onFilterChange({ dueDateFrom: 'none', dueDateTo: '' });
                break;
            case 'custom':
                // Custom date range, will be handled by handleCustomDateChange
                break;
            default:
                onFilterChange({ dueDateFrom: '', dueDateTo: '' });
        }
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

    const handleTagToggle = (tag) => {
        const newSelectedTags = selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];

        setSelectedTags(newSelectedTags);
        onFilterChange({ tags: newSelectedTags.length > 0 ? newSelectedTags : null });
    };

    const handleSubtaskFilterChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ [name]: value });
    };

    const handleClearSearch = () => {
        setLocalSearch('');
        if (typeof onSearch === 'function') {
            onSearch('');
        } else {
            onFilterChange({ search: '' });
        }

        // Focus after clearing
        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 0);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-md shadow p-4">
            {/* Search input with button */}
            <SearchBar
                localSearch={localSearch}
                handleSearchChange={handleSearchChange}
                handleSearchKeyDown={handleSearchKeyDown}
                handleSearchSubmit={handleSearchSubmit}
                handleClearSearch={handleClearSearch}
                isSearching={isSearching}
                searchInputRef={searchInputRef}
                autoFocus={autoFocus}
            />

            {/* Filter toggle */}
            <FilterToggle
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                isFiltersApplied={isFiltersApplied}
                clearFilters={clearFilters}
            />

            {/* Filter options */}
            {isExpanded && (
                <div className="mt-4 space-y-4">
                    {/* First row of filters */}
                    <StatusPriorityFilters
                        filters={filters}
                        handleChange={handleChange}
                        loading={loading}
                    />

                    {/* Second row for due date filters */}
                    <DateFilter
                        dateFilterType={dateFilterType}
                        customDateFrom={customDateFrom}
                        customDateTo={customDateTo}
                        handleDateFilterChange={handleDateFilterChange}
                        handleCustomDateChange={handleCustomDateChange}
                        loading={loading}
                    />

                    {/* Tags Filter */}
                    <TagFilter
                        availableTags={availableTags}
                        selectedTags={selectedTags}
                        handleTagToggle={handleTagToggle}
                    />

                    {/* Subtask Filters */}
                    <SubtaskFilter
                        filters={filters}
                        handleSubtaskFilterChange={handleSubtaskFilterChange}
                        loading={loading}
                    />
                </div>
            )}
        </div>
    );
};

export default TodoFilter;
