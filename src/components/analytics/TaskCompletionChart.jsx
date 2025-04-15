import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const TaskCompletionChart = React.memo(({ active, completed }) => {
    // Memoize options to prevent recreation on each render
    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#9CA3AF', // text-gray-400 equivalent
                    padding: 20,
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
                callbacks: {
                    label: function (context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const value = context.raw;
                        const percentage = Math.round((value / total) * 100);
                        return `${context.label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    }), []);

    // Memoize data to prevent recreation on each render
    const data = useMemo(() => ({
        labels: ['Active', 'Completed'],
        datasets: [
            {
                data: [active, completed],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.6)', // blue-500 with transparency
                    'rgba(16, 185, 129, 0.6)'  // green-500 with transparency
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',   // blue-500
                    'rgba(16, 185, 129, 1)'    // green-500
                ],
                borderWidth: 1,
            },
        ],
    }), [active, completed]);

    return (
        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg p-4">
            <Pie data={data} options={options} />
        </div>
    );
});

TaskCompletionChart.displayName = 'TaskCompletionChart';

export default TaskCompletionChart;
