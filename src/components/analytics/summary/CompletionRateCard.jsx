import React from 'react';

const CompletionRateCard = ({ completionRate, trend, showHelp }) => {
    return (
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg shadow-sm relative">
            <div className="flex items-center">
                <h3 className="font-semibold text-lg mb-2 text-green-700 dark:text-green-300">Completion Rate</h3>
                <button
                    className="ml-1 text-green-600 dark:text-green-400 focus:outline-none"
                    onClick={() => showHelp('completion')}
                    aria-label="Help about completion rate"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>

            <div className="flex items-center">
                <p className="text-3xl font-bold text-green-800 dark:text-green-200">{completionRate}%</p>
                <div className="w-20 h-20 ml-auto">
                    {/* Mini donut chart */}
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                        <path className="stroke-current text-green-200 dark:text-green-900"
                            fill="none"
                            strokeWidth="3.8"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            strokeDasharray="100, 100" />
                        <path className="stroke-current text-green-500"
                            fill="none"
                            strokeWidth="3.8"
                            strokeLinecap="round"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            strokeDasharray={`${completionRate}, 100`} />
                    </svg>
                </div>
            </div>

            <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
                <span className="flex items-center">
                    <svg className={`w-3 h-3 mr-1 ${trend >= 0 ? '' : 'transform rotate-180'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5l7 7-7 7-7-7 7-7z" fill="currentColor" />
                    </svg>
                    {Math.abs(trend)}%
                </span>
                <span className="ml-2">vs last week</span>
            </div>
        </div>
    );
};

export default CompletionRateCard;
