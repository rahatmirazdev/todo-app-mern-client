import React, { useMemo, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TasksByPriorityChart = React.memo(({ high, medium, low, onPriorityClick = () => { } }) => {
    const [hoveredBar, setHoveredBar] = useState(null);

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
                    precision: 0,
                    font: {
                        size: 11
                    },
                    callback: function (value) {
                        return value % 1 === 0 ? value : '';
                    }
                },
                grid: {
                    color: 'rgba(156, 163, 175, 0.2)', // Very light grid lines
                    drawBorder: false,
                },
                border: {
                    display: false
                }
            },
            x: {
                ticks: {
                    color: '#9CA3AF', // text-gray-400 equivalent
                    font: {
                        size: 12,
                        weight: 500
                    }
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
                display: false
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
                        const priority = context[0].label;
                        return `${priority} Priority Tasks`;
                    },
                    label: function (context) {
                        const value = context.parsed.y;
                        return `Count: ${value} task${value !== 1 ? 's' : ''}`;
                    },
                    afterLabel: function (context) {
                        const priorities = [high, medium, low];
                        const total = priorities.reduce((a, b) => a + b, 0);
                        if (total === 0) return '';

                        const percentage = Math.round((context.parsed.y / total) * 100);
                        return `${percentage}% of all tasks`;
                    }
                }
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        },
        onClick: (e, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const priorityMap = ['high', 'medium', 'low'];
                onPriorityClick(priorityMap[index]);
            }
        },
        onHover: (e, elements) => {
            if (elements.length > 0) {
                e.native.target.style.cursor = 'pointer';
                setHoveredBar(elements[0].index);
            } else {
                e.native.target.style.cursor = 'default';
                setHoveredBar(null);
            }
        }
    }), [high, medium, low, onPriorityClick]);

    // Memoize data to prevent recreation on each render
    const data = useMemo(() => {
        const baseHighOpacity = 0.6;
        const baseMediumOpacity = 0.6;
        const baseLowOpacity = 0.6;

        const highOpacity = hoveredBar === 0 ? 0.9 : baseHighOpacity;
        const mediumOpacity = hoveredBar === 1 ? 0.9 : baseMediumOpacity;
        const lowOpacity = hoveredBar === 2 ? 0.9 : baseLowOpacity;

        return {
            labels: ['High', 'Medium', 'Low'],
            datasets: [
                {
                    data: [high, medium, low],
                    backgroundColor: [
                        `rgba(239, 68, 68, ${highOpacity})`,  // red-500 with transparency
                        `rgba(245, 158, 11, ${mediumOpacity})`, // amber-500 with transparency
                        `rgba(16, 185, 129, ${lowOpacity})`, // green-500 with transparency
                    ],
                    borderColor: [
                        'rgba(239, 68, 68, 1)',  // red-500
                        'rgba(245, 158, 11, 1)', // amber-500
                        'rgba(16, 185, 129, 1)', // green-500
                    ],
                    borderWidth: 1,
                    borderRadius: 6,
                    hoverBorderWidth: 2,
                    barThickness: 36,
                },
            ],
        };
    }, [high, medium, low, hoveredBar]);

    // No data state
    if (high === 0 && medium === 0 && low === 0) {
        return (
            <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                    No priority data available yet.<br />
                    Create tasks with priorities to see stats.
                </p>
            </div>
        );
    }

    return (
        <div
            className="w-full h-full bg-white dark:bg-gray-800 rounded-lg p-4"
            role="figure"
            aria-label={`Task priority chart showing ${high} high priority, ${medium} medium priority, and ${low} low priority tasks`}
        >
            <div className="mb-3 flex items-center justify-between">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    Click on a bar to filter tasks by priority
                </div>
                <div className="flex space-x-4">
                    <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                        <span className="text-xs text-gray-600 dark:text-gray-300">High</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-amber-500 mr-1"></span>
                        <span className="text-xs text-gray-600 dark:text-gray-300">Medium</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                        <span className="text-xs text-gray-600 dark:text-gray-300">Low</span>
                    </div>
                </div>
            </div>

            <Bar data={data} options={options} />

            <div className="sr-only">
                <p>Chart showing tasks by priority</p>
                <ul>
                    <li>{high} tasks are high priority</li>
                    <li>{medium} tasks are medium priority</li>
                    <li>{low} tasks are low priority</li>
                </ul>
            </div>
        </div>
    );
});

TasksByPriorityChart.displayName = 'TasksByPriorityChart';

export default TasksByPriorityChart;
