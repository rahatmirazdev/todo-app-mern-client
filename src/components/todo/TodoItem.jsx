import { useState } from 'react';
import ExpandButton from './common/ExpandButton';
import StatusDropdown from './status/StatusDropdown';
import PriorityBadge from './priority/PriorityBadge';
import TodoDueDate from './date/TodoDueDate';
import TodoActions from './actions/TodoActions';
import TodoBadges from './badges/TodoBadges';
import TodoTags from './tags/TodoTags';
import SubtaskList from './subtasks/SubtaskList';
import { highlightText } from '../../utils/TextHighlighter';

const TodoItem = ({
    todo,
    onStatusChange,
    onDelete,
    onEdit,
    onViewHistory,
    onViewSeries,
    isLoading,
    searchHighlight,
    onToggleSubtask
}) => {
    const [showDetails, setShowDetails] = useState(false);

    // Calculate subtask completion percentage
    const getSubtaskProgress = () => {
        if (!todo.subtasks || todo.subtasks.length === 0) return null;

        const completedCount = todo.subtasks.filter(subtask => subtask.completed).length;
        const totalCount = todo.subtasks.length;
        return {
            percent: Math.round((completedCount / totalCount) * 100),
            completed: completedCount,
            total: totalCount
        };
    };

    const subtaskProgress = getSubtaskProgress();

    return (
        <tr className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${isLoading ? 'opacity-60' : ''}`}>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-start">
                    <ExpandButton
                        isExpanded={showDetails}
                        onClick={() => setShowDetails(!showDetails)}
                    />
                    <div>
                        <div className="font-medium text-gray-900 dark:text-white flex items-center">
                            {searchHighlight ? highlightText(todo.title, searchHighlight) : todo.title}
                            <TodoBadges todo={todo} subtaskProgress={subtaskProgress} />
                        </div>
                        {showDetails && todo.description && (
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {searchHighlight ? highlightText(todo.description, searchHighlight) : todo.description}
                            </p>
                        )}

                        {/* Show tags with highlight if search is active */}
                        {(showDetails || searchHighlight) && todo.tags && todo.tags.length > 0 && (
                            <TodoTags tags={todo.tags} searchHighlight={searchHighlight} />
                        )}

                        {/* Subtasks section */}
                        {showDetails && todo.subtasks && todo.subtasks.length > 0 && (
                            <SubtaskList
                                subtasks={todo.subtasks}
                                todoId={todo._id}
                                onToggleSubtask={onToggleSubtask}
                                isLoading={isLoading}
                                searchHighlight={searchHighlight}
                                highlightText={highlightText}
                            />
                        )}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <StatusDropdown
                    status={todo.status}
                    onStatusChange={onStatusChange}
                    todoId={todo._id}
                    isLoading={isLoading}
                />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <PriorityBadge priority={todo.priority} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                <TodoDueDate dueDate={todo.dueDate} status={todo.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {todo.createdAt && new Date(todo.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {todo.completedAt && new Date(todo.completedAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {isLoading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : (
                    <TodoActions
                        todo={todo}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onViewHistory={onViewHistory}
                        onViewSeries={onViewSeries}
                        isLoading={isLoading}
                    />
                )}
            </td>
        </tr>
    );
};

export default TodoItem;
