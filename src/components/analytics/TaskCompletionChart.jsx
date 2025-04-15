import React, { useMemo, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const TaskCompletionChart = React.memo(({ active, completed, onSegmentClick = () => { } }) => {
    const [focusedSegment, setFocusedSegment] = useState(null);

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
                        size: 12,
                        weight: 500
                    },
                    generateLabels: (chart) => {
                        const datasets = chart.data.datasets;
                        return chart.data.labels.map((label, i) => {
                            const meta = chart.getDatasetMeta(0);
                            const value = datasets[0].data[i];
                            const total = datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);

                            return {
                                text: `${label} (${percentage}%)`,
                                fillStyle: datasets[0].backgroundColor[i],
                                strokeStyle: datasets[0].borderColor[i],
                                lineWidth: 1,
                                hidden: meta.data[i].hidden,
                                index: i
                            };
                        });
                    }
                },
                onClick: (e, legendItem, legend) => {
                    onSegmentClick(legendItem.index === 0 ? 'active' : 'completed');
                },
            },
            tooltip: {
                backgroundColor: 'rgba(60, 60, 60, 0.8)',
                titleColor: 'rgba(255, 255, 255, 0.9)',
                bodyColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: 'rgba(100, 100, 100, 0.8)',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                    label: function (context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const value = context.raw;
                        const percentage = Math.round((value / total) * 100);
                        return `${context.label}: ${value} (${percentage}%)`;
                    },
                    afterLabel: function (context) {
                        return context.dataIndex === 0
                            ? 'Tasks that are not yet completed'
                            : 'Tasks that have been marked as complete';
                    }
                }
            }
        },
        animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1000
        },
        onClick: (e, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                onSegmentClick(index === 0 ? 'active' : 'completed');
                setFocusedSegment(index);
            }
        },
        onHover: (e, elements) => {
            if (elements.length > 0) {
                e.native.target.style.cursor = 'pointer';
            } else {
                e.native.target.style.cursor = 'default';
            }
        }
    }), [onSegmentClick]);

    // Memoize data to prevent recreation on each render
    const data = useMemo(() => {
        const activeColor = focusedSegment === 0 ? 'rgba(59, 130, 246, 0.9)' : 'rgba(59, 130, 246, 0.6)';
        const completedColor = focusedSegment === 1 ? 'rgba(16, 185, 129, 0.9)' : 'rgba(16, 185, 129, 0.6)';

        return {
            labels: ['Active', 'Completed'],
            datasets: [
                {
                    data: [active, completed],
                    backgroundColor: [
                        activeColor,  // blue-500 with transparency
                        completedColor // green-500 with transparency
                    ],
                    borderColor: [
                        'rgba(59, 130, 246, 1)',   // blue-500
                        'rgba(16, 185, 129, 1)'    // green-500
                    ],
                    borderWidth: 1,
                    hoverOffset: 15,
                    hoverBorderWidth: 2,
                },
            ],
        };
    }, [active, completed, focusedSegment]);

    // No data state
    if (active === 0 && completed === 0) {
        return (
            <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                    No task data available yet.<br />
                    Create and complete tasks to see stats.
                </p>
            </div>
        );
    }

    return (
        <div
            className="w-full h-full bg-white dark:bg-gray-800 rounded-lg p-4"
            role="figure"
            aria-label={`Task status chart showing ${active} active tasks and ${completed} completed tasks`}
        >
            <Pie data={data} options={options} />

            <div className="sr-only">
                <p>Chart showing task completion status</p>
                <ul>
                    <li>{active} tasks ({Math.round((active / (active + completed)) * 100)}%) are active</li>
                    <li>{completed} tasks ({Math.round((completed / (active + completed)) * 100)}%) are completed</li>
                </ul>
            </div>
        </div>
    );
});

TaskCompletionChart.displayName = 'TaskCompletionChart';

export default TaskCompletionChart;
