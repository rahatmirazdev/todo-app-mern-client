import React from 'react';

const LoadingState = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-96 flex justify-center items-center">
        <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading analytics data...</p>
        </div>
    </div>
);

export default LoadingState;
