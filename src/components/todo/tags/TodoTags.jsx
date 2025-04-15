import React from 'react';

const TodoTags = ({ tags, searchHighlight }) => {
    if (!tags || tags.length === 0) return null;

    return (
        <div className="mt-1 flex flex-wrap gap-1">
            {tags.map((tag, idx) => (
                <span
                    key={idx}
                    className={`px-2 py-0.5 rounded-full text-xs ${searchHighlight && tag.toLowerCase().includes(searchHighlight.toLowerCase())
                            ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                >
                    {tag}
                </span>
            ))}
        </div>
    );
};

export default TodoTags;
