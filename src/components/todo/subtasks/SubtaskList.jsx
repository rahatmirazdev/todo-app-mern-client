import React from 'react';

const SubtaskList = ({ subtasks, todoId, onToggleSubtask, isLoading, searchHighlight, highlightText }) => {
    if (!subtasks || subtasks.length === 0) return null;

    const completedCount = subtasks.filter(subtask => subtask.completed).length;
    const totalCount = subtasks.length;
    const percent = Math.round((completedCount / totalCount) * 100);

    const getProgressColor = (percent) => {
        if (percent < 30) return 'bg-red-500';
        if (percent < 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtasks</h4>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div
                    className={`h-2 rounded-full ${getProgressColor(percent)}`}
                    style={{ width: `${percent}%` }}
                ></div>
            </div>

            <ul className="space-y-1 mt-2">
                {subtasks.map((subtask, index) => (
                    <li key={index} className="flex items-center">
                        <input
                            type="checkbox"
                            checked={subtask.completed}
                            onChange={() => onToggleSubtask(todoId, index)}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
                            disabled={isLoading}
                        />
                        <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {searchHighlight ? highlightText(subtask.title, searchHighlight) : subtask.title}
                        </span>
                        {subtask.completed && subtask.completedAt && (
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                (completed {new Date(subtask.completedAt).toLocaleDateString()})
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SubtaskList;
