import React from 'react';

const TodoDueDate = ({ dueDate, status }) => {
    // Format date
    const formatDate = (date) => {
        if (!date) return 'No date set';
        return new Date(date).toLocaleDateString();
    };

    // Check if due date is overdue
    const isOverdue = (dueDate) => {
        if (!dueDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDateObj = new Date(dueDate);
        dueDateObj.setHours(0, 0, 0, 0);
        return dueDateObj < today && status !== 'completed';
    };

    // Check if due date is today
    const isDueToday = (dueDate) => {
        if (!dueDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDateObj = new Date(dueDate);
        dueDateObj.setHours(0, 0, 0, 0);
        return dueDateObj.getTime() === today.getTime();
    };

    // Get due date class
    const getDueDateClass = (dueDate) => {
        if (isOverdue(dueDate)) {
            return 'text-red-600 font-medium dark:text-red-400';
        } else if (isDueToday(dueDate)) {
            return 'text-orange-600 font-medium dark:text-orange-400';
        }
        return 'text-gray-500 dark:text-gray-400';
    };

    return (
        <div className={`flex items-center ${getDueDateClass(dueDate)}`}>
            {isOverdue(dueDate) && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            )}
            {isDueToday(dueDate) && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
            )}
            {formatDate(dueDate)}
        </div>
    );
};

export default TodoDueDate;
