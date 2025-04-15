import React from 'react';

const SearchBar = ({
    localSearch,
    handleSearchChange,
    handleSearchKeyDown,
    handleSearchSubmit,
    handleClearSearch,
    isSearching,
    searchInputRef,
    autoFocus
}) => {
    return (
        <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center">
                <div className="relative flex-grow">
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search todos..."
                        value={localSearch}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchKeyDown}
                        autoComplete="off"
                        autoFocus={autoFocus}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        disabled={isSearching}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {isSearching ? (
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

                <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-r-md hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70"
                    disabled={isSearching}
                >
                    {isSearching ? "Searching..." : "Search"}
                </button>
            </div>

            {/* Clear search button - only show if there's text */}
            {localSearch && (
                <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    disabled={isSearching}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </button>
            )}
        </form>
    );
};

export default SearchBar;
