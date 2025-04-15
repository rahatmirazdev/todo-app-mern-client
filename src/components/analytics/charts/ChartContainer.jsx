import React, { Suspense } from 'react';
import ChartPlaceholder from '../common/ChartPlaceholder';

const ChartContainer = ({ title, height = 'h-64', children }) => {
    return (
        <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{title}</h3>
            <div className={height}>
                <Suspense fallback={<ChartPlaceholder />}>
                    {children}
                </Suspense>
            </div>
        </div>
    );
};

export default ChartContainer;
