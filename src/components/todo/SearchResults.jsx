import React from 'react';
import { useTodo } from '../../context/TodoContext';
import TodoItem from './TodoItem';

const SearchResults = ({ search, onEditTodo, onViewHistory }) => {
    const { todos, loading, error } = useTodo();

    // Get search results count
    const resultsCount = todos.length;

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-md shadow p-6 mt-4">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Searching...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-md shadow p-6 mt-4">
                <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded">
                    <p>Error searching todos: {error}</p>
                </div>
            </div>
        );
    }

    if (todos.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-md shadow p-6 mt-4 text-center">
                <div className="mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No results found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                    No todos match your search "{search}". Try using different keywords or filters.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-md shadow mt-4">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">
                    {resultsCount} {resultsCount === 1 ? 'result' : 'results'} for "{search}"
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Task
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Priority
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Due Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {todos.map(todo => (
                            <TodoItem
                                key={todo._id}
                                todo={todo}
                                onStatusChange={() => { }}
                                onDelete={() => { }}
                                onEdit={onEditTodo}
                                onViewHistory={onViewHistory}
                                isLoading={false}
                                searchHighlight={search}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SearchResults;
