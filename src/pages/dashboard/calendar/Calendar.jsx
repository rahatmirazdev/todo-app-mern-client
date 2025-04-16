import React, { useState, useEffect } from 'react';
import { useTodo } from '../../../context/TodoContext';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import schedulerService from '../../../services/schedulerService';

const Calendar = () => {
    const { todos, fetchTodos } = useTodo();
    const [date, setDate] = useState(new Date());
    const [scheduledTasks, setScheduledTasks] = useState([]);

    // Fetch todos when component mounts
    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    // Filter scheduled tasks for selected date
    useEffect(() => {
        if (!todos) return;

        // Get all scheduled tasks
        const allScheduled = todos.filter(todo => todo.scheduledTime);

        // If a date is selected, filter for that date
        if (date) {
            const selectedDate = new Date(date);
            selectedDate.setHours(0, 0, 0, 0);

            const nextDay = new Date(selectedDate);
            nextDay.setDate(nextDay.getDate() + 1);

            const forSelectedDate = allScheduled.filter(todo => {
                const todoDate = new Date(todo.scheduledTime);
                return todoDate >= selectedDate && todoDate < nextDay;
            });

            setScheduledTasks(forSelectedDate);
        } else {
            setScheduledTasks(allScheduled);
        }
    }, [todos, date]);

    // Mark days with scheduled tasks
    const tileContent = ({ date }) => {
        // Check if there are tasks scheduled for this date
        const hasTask = todos.some(todo => {
            if (!todo.scheduledTime) return false;

            const todoDate = new Date(todo.scheduledTime);
            return (
                todoDate.getDate() === date.getDate() &&
                todoDate.getMonth() === date.getMonth() &&
                todoDate.getFullYear() === date.getFullYear()
            );
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Task Calendar</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <ReactCalendar
                        onChange={setDate}
                        value={date}
                        className="w-full bg-white dark:bg-gray-800 border-0 rounded-lg shadow-sm"
                        tileContent={tileContent}
                        tileClassName={({ date }) => {
                            return 'relative flex items-center justify-center h-12';
                        }}
                    />
                </div>

                <div className="md:col-span-2">
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                        <h2 className="text-md font-medium text-gray-800 dark:text-white mb-4">
                            {date.toLocaleDateString(undefined, {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </h2>

                        {scheduledTasks.length === 0 ? (
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
                                    .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime))
                                    .map(task => (
                                        <div key={task._id} className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm border-l-4 border-indigo-500">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-gray-800 dark:text-white">{task.title}</h3>

                                                    <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        {new Date(task.scheduledTime).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}

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

                                                <div>
                                                    <button
                                                        className="text-xs py-1 px-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300 rounded"
                                                        onClick={() => schedulerService.startTask(task._id)}
                                                    >
                                                        Start Task
                                                    </button>
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
        </div>
    );
};

export default Calendar;
