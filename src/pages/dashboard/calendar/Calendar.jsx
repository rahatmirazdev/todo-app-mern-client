import React, { useState, useEffect } from 'react';
import { useTodo } from '../../../context/TodoContext';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import schedulerService from '../../../services/schedulerService';
import axiosPrivate from '../../../services/api/axiosPrivate';

const Calendar = () => {
    const { todos, fetchTodos } = useTodo();
    const [date, setDate] = useState(new Date());
    const [scheduledTasks, setScheduledTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all todos when component mounts
    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    // Load tasks for the selected date
    useEffect(() => {
        const loadTasksForDate = async () => {
            if (!date) return;

            setLoading(true);
            setError(null);

            try {
                // Create date range for the selected day (from start of day to end of day)
                const selectedDate = new Date(date);

                // Ensure we're working with local time, not UTC
                const startOfDay = new Date(selectedDate);
                startOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date(selectedDate);
                endOfDay.setHours(23, 59, 59, 999);

                // Format dates to ISO strings
                const fromDate = startOfDay.toISOString();
                const toDate = endOfDay.toISOString();

                // Fetch tasks that have either scheduledTime OR dueDate within the selected date range
                const response = await axiosPrivate.get('/todos', {
                    params: {
                        limit: 100, // Increase limit to get all tasks for the day
                        status: 'todo,in_progress,completed', // Get all task statuses
                        $or: JSON.stringify([
                            { scheduledTime: { $gte: fromDate, $lt: toDate } },
                            { dueDate: { $gte: fromDate, $lt: toDate } }
                        ])
                    }
                });

                // Check if we actually have data
                if (response.data && response.data.todos) {
                    setScheduledTasks(response.data.todos);

                    // Additional debugging
                    const tasksWithScheduledTime = response.data.todos.filter(t => t.scheduledTime);
                    const tasksWithDueDate = response.data.todos.filter(t => t.dueDate && !t.scheduledTime);
                } else {
                    console.warn('Response data structure is not as expected:', response.data);
                    setScheduledTasks([]);
                }
            } catch (err) {
                console.error('Error loading tasks for date:', err);
                setError(`Failed to load tasks: ${err.message}`);
                setScheduledTasks([]);
            } finally {
                setLoading(false);
            }
        };

        loadTasksForDate();
    }, [date, axiosPrivate]);

    // Mark days with scheduled tasks or due dates
    const tileContent = ({ date }) => {
        // Check if there are tasks scheduled for this date
        const hasTask = todos.some(todo => {
            // Check scheduledTime
            if (todo.scheduledTime) {
                const todoDate = new Date(todo.scheduledTime);
                if (
                    todoDate.getDate() === date.getDate() &&
                    todoDate.getMonth() === date.getMonth() &&
                    todoDate.getFullYear() === date.getFullYear()
                ) {
                    return true;
                }
            }

            // Check dueDate
            if (todo.dueDate) {
                const todoDate = new Date(todo.dueDate);
                return (
                    todoDate.getDate() === date.getDate() &&
                    todoDate.getMonth() === date.getMonth() &&
                    todoDate.getFullYear() === date.getFullYear()
                );
            }

            return false;
        });

        if (hasTask) {
            return (
                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                    <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full"></div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Task Calendar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <ReactCalendar
                        onChange={setDate}
                        value={date}
                        tileContent={tileContent}
                        className="rounded border-0 shadow w-full"
                    />
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Tasks for {date.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </h2>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading tasks...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md">
                            {error}
                        </div>
                    ) : scheduledTasks.length === 0 ? (
                        <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                            <svg className="w-10 h-10 mx-auto mb-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <p>No tasks scheduled for this day</p>
                            <p className="text-sm mt-1">Use the task scheduler to plan your day</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {scheduledTasks
                                .sort((a, b) => {
                                    // Sort by scheduledTime first, then by dueDate
                                    if (a.scheduledTime && b.scheduledTime) {
                                        return new Date(a.scheduledTime) - new Date(b.scheduledTime);
                                    }
                                    if (a.scheduledTime) return -1;
                                    if (b.scheduledTime) return 1;
                                    if (a.dueDate && b.dueDate) {
                                        return new Date(a.dueDate) - new Date(b.dueDate);
                                    }
                                    if (a.dueDate) return -1;
                                    if (b.dueDate) return 1;
                                    return 0;
                                })
                                .map(task => (
                                    <div key={task._id} className={`p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm border-l-4 ${task.scheduledTime ? 'border-indigo-500' : 'border-amber-500'}`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-gray-800 dark:text-white">{task.title}</h3>
                                                <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                    {task.scheduledTime ? (
                                                        <>
                                                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                            </svg>
                                                            {new Date(task.scheduledTime).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </>
                                                    ) : task.dueDate ? (
                                                        <>
                                                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                            </svg>
                                                            Due today
                                                        </>
                                                    ) : null}

                                                    {task.estimatedDuration && (
                                                        <span className="ml-3">
                                                            {task.estimatedDuration >= 60
                                                                ? `${Math.floor(task.estimatedDuration / 60)}h ${task.estimatedDuration % 60 > 0 ? `${task.estimatedDuration % 60}m` : ''}`
                                                                : `${task.estimatedDuration}m`
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <span className={`text-xs px-2 py-1 rounded-full 
                                                    ${task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                                        task.priority === 'medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                                                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}
                                                >
                                                    {task.priority}
                                                </span>
                                            </div>
                                        </div>

                                        {task.description && (
                                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                {task.description.length > 100
                                                    ? `${task.description.substring(0, 100)}...`
                                                    : task.description
                                                }
                                            </div>
                                        )}

                                        <div className="flex justify-between mt-3">
                                            <div className="space-x-1">
                                                {task.taskType && task.taskType !== 'general' && (
                                                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                                                        {task.taskType}
                                                    </span>
                                                )}

                                                {task.category && task.category !== 'general' && (
                                                    <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full">
                                                        {task.category}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
