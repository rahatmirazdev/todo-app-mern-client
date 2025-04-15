import React from 'react';

const OverdueTasksCard = ({ overdueCount, showHelp, navigate }) => {
    return (
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg shadow-sm relative">
            <div className="flex items-center">
                <h3 className="font-semibold text-lg mb-2 text-purple-700 dark:text-purple-300">Overdue Tasks</h3>
                <button
                    className="ml-1 text-purple-600 dark:text-purple-400 focus:outline-none"
                    onClick={() => showHelp('overdue')}
                    aria-label="Help about overdue tasks"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>

            <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">{overdueCount}</p>

            <div className="flex items-center mt-2 text-sm text-purple-600 dark:text-purple-400">
                <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Requires attention
                </span>
                {overdueCount > 0 && (
                    <button
                        onClick={() => navigate('/dashboard/todos?dateFilter=overdue')}
                        className="ml-auto px-2 py-0.5 bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 text-xs rounded hover:bg-purple-300 dark:hover:bg-purple-700 transition-colors"
                    >
                        View All
                    </button>
                )}
            </div>
        </div>
    );
};

export default OverdueTasksCard;
