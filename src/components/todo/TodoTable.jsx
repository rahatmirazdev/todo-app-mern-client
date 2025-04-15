import React, { memo } from 'react';
import TodoItem from './TodoItem';

const TodoTable = memo(({
    todos,
    sortConfig,
    handleSort,
    renderSortIndicator,
    handleStatusChange,
    handleDelete,
    onEdit,
    onViewHistory,
    actionLoading
}) => {
    return (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={(e) => handleSort('title', e.ctrlKey || e.metaKey)}
                    >
                        <div className="flex items-center">
                            Title {renderSortIndicator('title')}
                        </div>
                    </th>
                    <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={(e) => handleSort('status', e.ctrlKey || e.metaKey)}
                    >
                        <div className="flex items-center">
                            Status {renderSortIndicator('status')}
                        </div>
                    </th>
                    <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={(e) => handleSort('priority', e.ctrlKey || e.metaKey)}
                    >
                        <div className="flex items-center">
                            Priority {renderSortIndicator('priority')}
                        </div>
                    </th>
                    <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={(e) => handleSort('dueDate', e.ctrlKey || e.metaKey)}
                    >
                        <div className="flex items-center">
                            Due Date {renderSortIndicator('dueDate')}
                        </div>
                    </th>
                    <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={(e) => handleSort('createdAt', e.ctrlKey || e.metaKey)}
                    >
                        <div className="flex items-center">
                            Created {renderSortIndicator('createdAt')}
                        </div>
                    </th>
                    <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={(e) => handleSort('completedAt', e.ctrlKey || e.metaKey)}
                    >
                        <div className="flex items-center">
                            Completed {renderSortIndicator('completedAt')}
                        </div>
                    </th>
                    <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {todos.map(todo => (
                    <TodoItem
                        key={todo._id}
                        todo={todo}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                        onEdit={onEdit}
                        onViewHistory={onViewHistory}
                        isLoading={actionLoading === todo._id}
                    />
                ))}
            </tbody>
        </table>
    );
});

TodoTable.displayName = 'TodoTable';

export default TodoTable;
