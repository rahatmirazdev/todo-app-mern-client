import React from 'react';

const TagFilter = ({ availableTags, selectedTags, handleTagToggle }) => {
    return (
        <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
                {availableTags.length > 0 ? (
                    availableTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${selectedTags.includes(tag)
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                }`}
                        >
                            {tag}
                        </button>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No tags available</p>
                )}
            </div>
        </div>
    );
};

export default TagFilter;
