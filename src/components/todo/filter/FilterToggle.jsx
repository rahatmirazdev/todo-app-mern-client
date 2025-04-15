import React from 'react';

const FilterToggle = ({ isExpanded, setIsExpanded, isFiltersApplied, clearFilters }) => {
    return (
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
    );
};

export default FilterToggle;
