import React from 'react';

const DependencyList = ({ todo, allTodos }) => {
    if (!todo.dependencies || todo.dependencies.length === 0) return null;

    return (
        <div className="mt-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dependencies:</h4>
            <ul className="space-y-1">
                {todo.dependencies.map(depId => {
                    const dependency = allTodos.find(t => t._id === depId);
                    if (!dependency) return null;

                    return (
                        <li key={depId} className="text-sm flex items-center">
                            <span className={`${dependency.status === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} mr-2`}>
                                {dependency.status === 'completed' ? '✓' : '⨯'}
                            </span>
                            <span>{dependency.title}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default DependencyList;
