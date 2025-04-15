import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TasksByPriorityChart = React.memo(({ high, medium, low }) => {
    // Memoize options to prevent recreation on each render
    const options = useMemo(() => ({
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
    }), []);

    // Memoize data to prevent recreation on each render
    const data = useMemo(() => ({
        labels: ['High', 'Medium', 'Low'],
        datasets: [
            {
                label: 'Number of Tasks',
                data: [high, medium, low],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.6)',  // red-500 with transparency
                    'rgba(245, 158, 11, 0.6)', // amber-500 with transparency
                    'rgba(16, 185, 129, 0.6)', // green-500 with transparency
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',  // red-500
                    'rgba(245, 158, 11, 1)', // amber-500
                    'rgba(16, 185, 129, 1)', // green-500
                ],
                borderWidth: 1,
            },
        ],
    }), [high, medium, low]);

    return (
        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg p-4">
            <Bar data={data} options={options} />
        </div>
    );
});

TasksByPriorityChart.displayName = 'TasksByPriorityChart';

export default TasksByPriorityChart;
