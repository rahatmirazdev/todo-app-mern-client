import React from 'react';

const ChartPlaceholder = () => (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse">
        <div className="h-full flex flex-col">
            <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded-t-lg w-1/3 mx-4 mt-4"></div>
            <div className="flex-grow flex items-center justify-center p-6">
                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-600"></div>
            </div>
        </div>
    </div>
);

export default ChartPlaceholder;
