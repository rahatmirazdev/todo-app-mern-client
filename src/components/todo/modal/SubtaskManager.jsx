import React from 'react';

const SubtaskManager = ({
    formData,
    newSubtask,
    setNewSubtask,
    handleAddSubtask,
    handleRemoveSubtask,
    handleToggleSubtask
}) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subtasks
            </label>
            <div className="flex">
                <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Add a subtask..."
                    className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                >
                    Add
                </button>
            </div>
            {formData.subtasks.length > 0 && (
                <ul className="mt-2 space-y-2">
                    {formData.subtasks.map((subtask, index) => (
                        <li key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={subtask.completed}
                                    onChange={() => handleToggleSubtask(index)}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <span className={`ml-2 text-sm ${subtask.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {subtask.title}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveSubtask(index)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SubtaskManager;
