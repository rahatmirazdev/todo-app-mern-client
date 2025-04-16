import axiosPrivate from './api/axiosPrivate';

const schedulerService = {
    /**
     * Get scheduling recommendations for a task
     * @param {string} taskId - The task ID
     * @returns {Promise<Object>} - The recommendations data
     */
    getRecommendations: async (taskId) => {
        const response = await axiosPrivate.get(`/scheduler/recommendations/${taskId}`);
        return response.data;
    },

    /**
     * Schedule a task for a specific time
     * @param {string} taskId - The task ID
     * @param {Date} scheduledTime - The time to schedule the task
     * @returns {Promise<Object>} - The updated task
     */
    scheduleTask: async (taskId, scheduledTime) => {
        const response = await axiosPrivate.patch(`/scheduler/schedule/${taskId}`, {
            scheduledTime: scheduledTime.toISOString()
        });
        return response.data;
    },

    /**
     * Mark a task as started to begin tracking time
     * @param {string} taskId - The task ID
     * @returns {Promise<Object>} - The updated task
     */
    startTask: async (taskId) => {
        const response = await axiosPrivate.patch(`/scheduler/start-task/${taskId}`);
        return response.data;
    },

    /**
     * Format time of day for display
     * @param {string} timeOfDay - Time of day value (morning, afternoon, evening)
     * @returns {string} - Formatted display string
     */
    formatTimeOfDay: (timeOfDay) => {
        switch (timeOfDay) {
            case 'morning':
                return 'Morning (8am-12pm)';
            case 'afternoon':
                return 'Afternoon (12pm-5pm)';
            case 'evening':
                return 'Evening (5pm-9pm)';
            default:
                return 'Any time';
        }
    },

    /**
     * Format day of week for display
     * @param {number} dayOfWeek - Day of week (0-6)
     * @returns {string} - Formatted day name
     */
    formatDayOfWeek: (dayOfWeek) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayOfWeek] || 'Unknown';
    },

    /**
     * Format a time slot for display
     * @param {Object} timeSlot - Time slot with start and end properties
     * @returns {string} - Formatted time slot string
     */
    formatTimeSlot: (timeSlot) => {
        if (!timeSlot || !timeSlot.start || !timeSlot.end) return 'Invalid time';

        const start = new Date(timeSlot.start);
        const end = new Date(timeSlot.end);

        return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
};

export default schedulerService;
