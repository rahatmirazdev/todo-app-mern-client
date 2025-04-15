import React, { useState } from 'react';

const DependencySelector = ({
    allTodos,
    currentTodoId,
    selectedDependencies,
    onDependenciesChange
}) => {
    const [search, setSearch] = useState('');

    // Make component resilient to empty allTodos
    const availableTodos = (allTodos || []).filter(todo =>
        todo._id !== currentTodoId &&
        !selectedDependencies.includes(todo._id) &&
        todo.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddDependency = (todoId) => {
        onDependenciesChange([...selectedDependencies, todoId]);
    };

    const handleRemoveDependency = (todoId) => {
        onDependenciesChange(selectedDependencies.filter(id => id !== todoId));
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dependencies
            </label>

            {/* Search for todos */}
            <div className="mb-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for a task..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            {/* Selected dependencies */}
            {selectedDependencies.length > 0 && (
                <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Selected Dependencies:
                    </h4>
                    <ul className="space-y-1">
                        {selectedDependencies.map(depId => {
                            const todo = allTodos.find(t => t._id === depId);
                            return todo ? (
                                <li key={depId} className="flex items-center justify-between py-1 px-2 bg-gray-50 dark:bg-gray-700 rounded">
                                    <span className="text-sm dark:font-bold text-gray-700 dark:text-gray-300">{todo.title}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveDependency(depId)}
                                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ) : null;
                        })}
                    </ul>
                </div>
            )}

            {/* Available todos to add as dependencies */}
            {availableTodos.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Available Tasks:
                    </h4>
                    <ul className="max-h-40 overflow-y-auto space-y-1">
                        {availableTodos.map(todo => (
                            <li key={todo._id} className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700">
                                <span className="text-sm">{todo.title}</span>
                                <button
                                    type="button"
                                    onClick={() => handleAddDependency(todo._id)}
                                    className="text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                >
                                    Add
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {availableTodos.length === 0 && search && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No matching tasks found.
                </p>
            )}
        </div>
    );
};

export default DependencySelector;
