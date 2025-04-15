import React from 'react';

const TotalTasksCard = ({ total, trend, showHelp }) => {
    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow-sm relative">
            <h3 className="font-semibold text-lg mb-2 text-blue-700 dark:text-blue-300">Total Tasks</h3>
            <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">{total}</p>
            <div className="flex items-center mt-2 text-sm text-blue-600 dark:text-blue-400">
                <span className="flex items-center">
                    <svg className={`w-3 h-3 mr-1 ${trend >= 0 ? '' : 'transform rotate-180'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5l7 7-7 7-7-7 7-7z" fill="currentColor" />
                    </svg>
                    {Math.abs(trend)}%
                </span>
                <span className="ml-2">vs last month</span>
                <button
                    className="ml-1 text-blue-600 dark:text-blue-400 focus:outline-none"
                    onClick={() => showHelp('trend')}
                    aria-label="Help about trend"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default TotalTasksCard;
