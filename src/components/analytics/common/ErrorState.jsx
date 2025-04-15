import React from 'react';

const ErrorState = ({ message, onRetry }) => (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center">
        <div className="text-red-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-center mb-4">{message}</p>
        <button
            onClick={onRetry}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
            Try Again
        </button>
    </div>
);

export default ErrorState;
