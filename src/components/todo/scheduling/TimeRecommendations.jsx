import React, { useState, useEffect } from 'react';
import schedulerService from '../../../services/schedulerService';

const TimeRecommendations = ({ todoId, onSchedule }) => {
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!todoId) return;

            try {
                setLoading(true);
                setError(null);

                const data = await schedulerService.getRecommendations(todoId);
                setRecommendations(data);
            } catch (err) {
                console.error('Error fetching recommendations:', err);
                setError('Failed to get scheduling recommendations');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [todoId]);

    const handleSchedule = async (timeSlot) => {
        if (!timeSlot || !timeSlot.start) return;

        try {
            await onSchedule(new Date(timeSlot.start));
        } catch (err) {
            console.error('Error scheduling task:', err);
        }
    };

    if (loading) {
        return (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
                <p>{error}</p>
            </div>
        );
    }

    if (!recommendations) {
        return null;
    }

    // If no good data yet, show a message
    if (recommendations.confidence < 0.3) {
        return (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-md">
                <p className="text-sm mb-2 font-medium">Not enough productivity data yet</p>
                <p className="text-xs">
                    Start tracking your task completions to get personalized scheduling recommendations.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
            <h3 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                <span role="img" aria-label="sparkles">✨</span> AI Scheduling Recommendations
            </h3>

            <div className="mb-3">
                <div className="text-xs text-gray-600 dark:text-gray-400">Best time of day:</div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {schedulerService.formatTimeOfDay(recommendations.bestTimeOfDay)}
                </div>
            </div>

            <div className="mb-3">
                <div className="text-xs text-gray-600 dark:text-gray-400">Best day:</div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {schedulerService.formatDayOfWeek(recommendations.bestDayOfWeek)}
                </div>
            </div>

            <div className="mb-4">
                <div className="text-xs text-gray-600 dark:text-gray-400">Recommendation confidence:</div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-1">
                    <div
                        className="bg-indigo-600 h-1.5 rounded-full"
                        style={{ width: `${recommendations.confidence * 100}%` }}
                    ></div>
                </div>
                <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {Math.round(recommendations.confidence * 100)}%
                </div>
            </div>

            {recommendations.recommendedTimeSlots && recommendations.recommendedTimeSlots.length > 0 && (
                <div>
                    <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Recommended time slots:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {recommendations.recommendedTimeSlots.slice(0, 4).map((slot, index) => (
                            <button
                                key={index}
                                onClick={() => handleSchedule(slot)}
                                className="text-xs py-2 px-3 bg-white dark:bg-gray-700 rounded border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition-colors"
                            >
                                <div className="font-medium">
                                    {new Date(slot.start).toLocaleDateString(undefined, {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                                <div>
                                    {schedulerService.formatTimeSlot(slot)}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimeRecommendations;
