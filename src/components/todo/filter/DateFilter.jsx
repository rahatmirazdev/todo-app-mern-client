import React from 'react';

const DateFilter = ({
    dateFilterType,
    customDateFrom,
    customDateTo,
    handleDateFilterChange,
    handleCustomDateChange,
    loading
}) => {
    return (
        <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
            </label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                    name="dateFilterType"
                    value={dateFilterType}
                    onChange={handleDateFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-70"
                    disabled={loading}
                >
                    <option value="any">Any Date</option>
                    <option value="today">Today</option>
                    <option value="thisWeek">This Week</option>
                    <option value="nextWeek">Next Week</option>
                    <option value="overdue">Overdue</option>
                    <option value="noDueDate">No Due Date</option>
                    <option value="custom">Custom Range</option>
                </select>

                {dateFilterType === 'custom' && (
                    <>
                        <div className="md:col-span-1">
                            <input
                                type="date"
                                name="customDateFrom"
                                value={customDateFrom}
                                onChange={handleCustomDateChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-70"
                                placeholder="From"
                                disabled={loading}
                            />
                        </div>
                        <div className="md:col-span-1">
                            <input
                                type="date"
                                name="customDateTo"
                                value={customDateTo}
                                onChange={handleCustomDateChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-70"
                                placeholder="To"
                                disabled={loading}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DateFilter;
