import React, { useMemo, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const RANGE_OPTIONS = [
    { label: '7 Days', value: 7 },
    { label: '14 Days', value: 14 },
    { label: '30 Days', value: 30 },
    { label: '90 Days', value: 90 }
];

const TasksOverTimeChart = React.memo(({ todos }) => {
    const [dateRange, setDateRange] = useState(30);

    // Memoize options to prevent recreation on each render
    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#9CA3AF', // text-gray-400 equivalent
                    stepSize: 1,
                    precision: 0,
                    font: {
                        size: 11
                    },
                    callback: function (value) {
                        return value % 1 === 0 ? value : '';
                    }
                },
                grid: {
                    color: 'rgba(156, 163, 175, 0.15)', // Very light grid lines
                    drawBorder: false,
                },
                border: {
                    display: false
                }
            },
            x: {
                ticks: {
                    color: '#9CA3AF', // text-gray-400 equivalent
                    maxRotation: 45,
                    minRotation: 45,
                    font: {
                        size: 10
                    },
                    autoSkipPadding: 20,
                },
                grid: {
                    display: false,
                },
                border: {
                    display: false
                }
            },
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#9CA3AF', // text-gray-400 equivalent
                    boxWidth: 12,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(60, 60, 60, 0.8)',
                titleColor: 'rgba(255, 255, 255, 0.9)',
                bodyColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: 'rgba(100, 100, 100, 0.8)',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                    title: function (context) {
                        return context[0].label;
                    },
                    label: function (context) {
                        const datasetLabel = context.dataset.label;
                        const value = context.parsed.y;
                        return `${datasetLabel}: ${value} task${value !== 1 ? 's' : ''}`;
                    }
                }
            }
        },
        animation: {
            duration: 1500,
            easing: 'easeOutQuart'
        },
        elements: {
            point: {
                radius: 3,
                hoverRadius: 5,
                hitRadius: 30
            },
            line: {
                tension: 0.3
            }
        }
    }), []);

    // Process data for chart
    const chartData = useMemo(() => {
        // Group tasks by creation date (by day)
        const lastNDays = [];
        for (let i = 0; i < dateRange; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (dateRange - 1 - i));
            date.setHours(0, 0, 0, 0);
            lastNDays.push({
                date: date,
                dateString: date.toISOString().split('T')[0],
                created: 0,
                completed: 0
            });
        }

        // Count tasks created and completed on each day
        todos.forEach(todo => {
            if (todo.createdAt) {
                const createdDate = new Date(todo.createdAt);
                createdDate.setHours(0, 0, 0, 0);
                const createdDateString = createdDate.toISOString().split('T')[0];

                const day = lastNDays.find(d => d.dateString === createdDateString);
                if (day) {
                    day.created++;
                }
            }

            if (todo.completedAt) {
                const completedDate = new Date(todo.completedAt);
                completedDate.setHours(0, 0, 0, 0);
                const completedDateString = completedDate.toISOString().split('T')[0];

                const day = lastNDays.find(d => d.dateString === completedDateString);
                if (day) {
                    day.completed++;
                }
            }
        });

        // Format labels as dates
        const labels = lastNDays.map(day => {
            const date = new Date(day.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        // Create a rolling average for the "completed" data to show trend
        const completedData = lastNDays.map(day => day.completed);
        const movingAvg = [];
        const windowSize = Math.min(7, completedData.length);

        for (let i = 0; i < completedData.length; i++) {
            if (i < windowSize - 1) {
                movingAvg.push(null); // Not enough data points for the average yet
            } else {
                let sum = 0;
                for (let j = 0; j < windowSize; j++) {
                    sum += completedData[i - j];
                }
                movingAvg.push(sum / windowSize);
            }
        }

        return {
            labels,
            datasets: [
                {
                    label: 'Tasks Created',
                    data: lastNDays.map(day => day.created),
                    borderColor: 'rgb(59, 130, 246)',     // blue-500
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                    pointHoverBackgroundColor: 'white',
                    pointHoverBorderColor: 'rgb(59, 130, 246)',
                    pointHoverBorderWidth: 2,
                    fill: false,
                },
                {
                    label: 'Tasks Completed',
                    data: lastNDays.map(day => day.completed),
                    borderColor: 'rgb(16, 185, 129)',     // green-500
                    backgroundColor: 'rgba(16, 185, 129, 0.5)',
                    pointBackgroundColor: 'rgb(16, 185, 129)',
                    pointHoverBackgroundColor: 'white',
                    pointHoverBorderColor: 'rgb(16, 185, 129)',
                    pointHoverBorderWidth: 2,
                    fill: false,
                },
                {
                    label: 'Trend (7-day avg)',
                    data: movingAvg,
                    borderColor: 'rgb(139, 92, 246)',     // purple-500
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderDash: [6, 3],
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    fill: false,
                    tension: 0.4
                }
            ],
        };
    }, [todos, dateRange]);

    // Empty state
    const hasData = todos.some(todo => todo.createdAt || todo.completedAt);

    if (!hasData) {
        return (
            <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                    No task history data available yet.<br />
                    Create and complete tasks to see trends over time.
                </p>
            </div>
        );
    }

    return (
        <div
            className="w-full h-full bg-white dark:bg-gray-800 rounded-lg p-4"
            role="figure"
            aria-label="Chart showing task creation and completion trends over time"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    Track your productivity trends over time
                </div>
                <div className="flex">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(Number(e.target.value))}
                        className="text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-1 px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Select date range"
                    >
                        {RANGE_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <Line data={chartData} options={options} />

            <div className="sr-only">
                <p>Line chart showing tasks created and completed over the past {dateRange} days</p>
                <p>The chart also includes a 7-day moving average to show the general trend.</p>
            </div>

            <div className="flex flex-wrap gap-6 justify-center mt-4 text-xs">
                <div className="flex flex-col items-center">
                    <div className="text-blue-500 font-semibold text-base">
                        {chartData.datasets[0].data.reduce((sum, val) => sum + val, 0)}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                        Tasks Created
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-green-500 font-semibold text-base">
                        {chartData.datasets[1].data.reduce((sum, val) => sum + val, 0)}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                        Tasks Completed
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-purple-500 font-semibold text-base">
                        {(chartData.datasets[1].data.slice(-7).reduce((sum, val) => sum + val, 0) / 7).toFixed(1)}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                        Daily Avg (Last 7d)
                    </div>
                </div>
            </div>
        </div>
    );
});

TasksOverTimeChart.displayName = 'TasksOverTimeChart';

export default TasksOverTimeChart;
