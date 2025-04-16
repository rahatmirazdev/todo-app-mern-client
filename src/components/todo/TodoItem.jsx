import { useState, memo } from 'react';
import { useTodo } from '../../context/TodoContext';
import toast from 'react-hot-toast';
import ExpandButton from './common/ExpandButton';
import StatusDropdown from './status/StatusDropdown';
import PriorityBadge from './priority/PriorityBadge';
import TodoDueDate from './date/TodoDueDate';
import TodoActions from './actions/TodoActions';
import TodoBadges from './badges/TodoBadges';
import TodoTags from './tags/TodoTags';
import SubtaskList from './subtasks/SubtaskList';
import DependencyBadge from './dependencies/DependencyBadge';
import DependencyList from './dependencies/DependencyList';
import { highlightText } from '../../utils/TextHighlighter';

const TodoItem = ({
    todo,
    onStatusChange,
    onDelete,
    onEdit,
    onViewHistory,
    onViewSeries,
    searchHighlight,
    onToggleSubtask,
    allTodos,
    canCompleteTodo
}) => {
    const [showDetails, setShowDetails] = useState(false);
    const { todoLoadingStates } = useTodo();

    // Get loading state for this specific todo
    const isLoading = todoLoadingStates[todo._id];

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

    // Handle status change with dependency check
    const handleStatusChange = (id, newStatus) => {
        // Skip dependency check if allTodos isn't available yet
        if (newStatus === 'completed' && allTodos && allTodos.length > 0 && !canCompleteTodo(id)) {
            toast.error('Cannot complete this task. Please complete all dependencies first.');
            return;
        }
        onStatusChange(id, newStatus);
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
                        <div className="flex items-center mb-1">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                {searchHighlight ? highlightText(todo.title, searchHighlight) : todo.title}
                            </h3>
                        </div>

                        {/* Add scheduled time badge */}
                        {todo.scheduledTime && (
                            <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mr-2 mb-1">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Scheduled: {new Date(todo.scheduledTime).toLocaleString(undefined, {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        )}

                        {/* Badges row */}
                        <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400">
                            <TodoBadges todo={todo} subtaskProgress={subtaskProgress} />

                            {/* Task duration */}
                            {todo.estimatedDuration && (
                                <span className="inline-flex items-center mr-2 text-xs text-gray-500 dark:text-gray-400">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    {todo.estimatedDuration >= 60
                                        ? `${Math.floor(todo.estimatedDuration / 60)}h ${todo.estimatedDuration % 60 > 0 ? `${todo.estimatedDuration % 60}m` : ''}`
                                        : `${todo.estimatedDuration}m`
                                    }
                                </span>
                            )}

                            <DependencyBadge todo={todo} allTodos={allTodos} />
                        </div>

                        {/* Render badges only if allTodos is available */}
                        <div className="font-medium text-gray-900 dark:text-white flex items-center">
                            {searchHighlight ? highlightText(todo.title, searchHighlight) : todo.title}
                            <TodoBadges todo={todo} subtaskProgress={subtaskProgress} />
                            {allTodos && allTodos.length > 0 && (
                                <DependencyBadge todo={todo} allTodos={allTodos} />
                            )}
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

                        {/* Show dependencies in details */}
                        {showDetails && allTodos && allTodos.length > 0 && (
                            <DependencyList todo={todo} allTodos={allTodos} />
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
                    onStatusChange={handleStatusChange}
                    todoId={todo._id}
                    isLoading={isLoading}
                    disableComplete={!canCompleteTodo(todo._id)}
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
                    />
                )}
            </td>
        </tr>
    );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(TodoItem, (prevProps, nextProps) => {
    // Only re-render if these props changed
    return (
        prevProps.todo._id === nextProps.todo._id &&
        prevProps.todo.status === nextProps.todo.status &&
        prevProps.todo.title === nextProps.todo.title &&
        prevProps.todo.description === nextProps.todo.description &&
        prevProps.todo.priority === nextProps.todo.priority &&
        prevProps.todo.dueDate === nextProps.todo.dueDate &&
        prevProps.todo.completedAt === nextProps.todo.completedAt &&
        JSON.stringify(prevProps.todo.subtasks) === JSON.stringify(nextProps.todo.subtasks) &&
        prevProps.isLoading === nextProps.isLoading
    );
});
