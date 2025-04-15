import React from 'react';

const HelpTooltip = ({ tooltip, setTooltip }) => {
    if (!tooltip) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-30 flex items-center justify-center p-4" onClick={() => setTooltip(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-sm shadow-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {tooltip.type === 'completion' && 'Completion Rate'}
                        {tooltip.type === 'trend' && 'Trend Indicators'}
                        {tooltip.type === 'overdue' && 'Overdue Tasks'}
                    </h4>
                    <button
                        onClick={() => setTooltip(null)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{tooltip.text}</p>
            </div>
        </div>
    );
};

export default HelpTooltip;
