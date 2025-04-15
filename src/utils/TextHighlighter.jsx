import React from 'react';

export const highlightText = (text, highlight) => {
    if (!highlight || !text) return text;

    // Escape special regex characters
    const sanitizedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${sanitizedHighlight})`, 'gi'));

    return parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase()
            ? <mark key={index} className="bg-yellow-200 dark:bg-yellow-700 px-1 rounded">{part}</mark>
            : part
    );
};
