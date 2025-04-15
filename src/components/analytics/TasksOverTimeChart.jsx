import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TasksOverTimeChart = ({ todos }) => {
    // Use a neutral configuration that works in both themes
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#9CA3AF', // text-gray-400 equivalent
                    stepSize: 1,
                },
                grid: {
                    color: 'rgba(156, 163, 175, 0.2)', // Very light grid lines
                },
            },
            x: {
                ticks: {
                    color: '#9CA3AF', // text-gray-400 equivalent
                    maxRotation: 45,
                    minRotation: 45,
                },
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#9CA3AF', // text-gray-400 equivalent
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
            }
        },
    };

    // Process data for chart
    const chartData = useMemo(() => {
        // Group tasks by creation date (by day)
        const last30Days = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            date.setHours(0, 0, 0, 0);
            last30Days.push({
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

                const day = last30Days.find(d => d.dateString === createdDateString);
                if (day) {
                    day.created++;
                }
            }

            if (todo.completedAt) {
                const completedDate = new Date(todo.completedAt);
                completedDate.setHours(0, 0, 0, 0);
                const completedDateString = completedDate.toISOString().split('T')[0];

                const day = last30Days.find(d => d.dateString === completedDateString);
                if (day) {
                    day.completed++;
                }
            }
        });

        // Format labels as dates
        const labels = last30Days.map(day => {
            const date = new Date(day.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        return {
            labels,
            datasets: [
                {
                    label: 'Tasks Created',
                    data: last30Days.map(day => day.created),
                    borderColor: 'rgb(59, 130, 246)',     // blue-500
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    tension: 0.3,
                },
                {
                    label: 'Tasks Completed',
                    data: last30Days.map(day => day.completed),
                    borderColor: 'rgb(16, 185, 129)',     // green-500
                    backgroundColor: 'rgba(16, 185, 129, 0.5)',
                    tension: 0.3,
                },
            ],
        };
    }, [todos]);

    return (
        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg p-4">
            <Line data={chartData} options={options} />
        </div>
    );
};

export default TasksOverTimeChart;
