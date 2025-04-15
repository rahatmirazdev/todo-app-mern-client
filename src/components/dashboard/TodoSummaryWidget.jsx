import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosPrivate from '../../services/api/axiosPrivate';

const TodoSummaryWidget = () => {
    const [summary, setSummary] = useState({
        priority: { high: 0, medium: 0, low: 0 },
        dueDate: { overdue: 0, today: 0, upcoming: 0, later: 0, noDueDate: 0 }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoading(true);
                const response = await axiosPrivate.get('/todos/summary');
                setSummary(response.data);
            } catch (error) {
                console.error('Error fetching todo summary:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/6"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Todo Summary</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">By Priority</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Link
                                to="/dashboard/todos?priority=high"
                                className="text-sm text-red-600 dark:text-red-400 hover:underline"
                            >
                                High Priority
                            </Link>
                            <span className="text-sm font-medium">{summary.priority.high}</span>
                        </div>
                        <div className="flex justify-between">
                            <Link
                                to="/dashboard/todos?priority=medium"
                                className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
                            >
                                Medium Priority
                            </Link>
                            <span className="text-sm font-medium">{summary.priority.medium}</span>
                        </div>
                        <div className="flex justify-between">
                            <Link
                                to="/dashboard/todos?priority=low"
                                className="text-sm text-green-600 dark:text-green-400 hover:underline"
                            >
                                Low Priority
                            </Link>
                            <span className="text-sm font-medium">{summary.priority.low}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">By Due Date</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Link
                                to="/dashboard/todos?dateFilter=overdue"
                                className="text-sm text-red-600 dark:text-red-400 hover:underline"
                            >
                                Overdue
                            </Link>
                            <span className="text-sm font-medium">{summary.dueDate.overdue}</span>
                        </div>
                        <div className="flex justify-between">
                            <Link
                                to="/dashboard/todos?dateFilter=today"
                                className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
                            >
                                Due Today
                            </Link>
                            <span className="text-sm font-medium">{summary.dueDate.today}</span>
                        </div>
                        <div className="flex justify-between">
                            <Link
                                to="/dashboard/todos?dateFilter=upcoming"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Upcoming
                            </Link>
                            <span className="text-sm font-medium">{summary.dueDate.upcoming}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-3 text-center">
                <Link
                    to="/dashboard/todos"
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                    View All Todos →
                </Link>
            </div>
        </div>
    );
};

export default TodoSummaryWidget;
