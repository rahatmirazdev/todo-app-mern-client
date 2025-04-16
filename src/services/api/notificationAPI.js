import axiosPrivate from './axiosPrivate';

// Service for sending desktop notifications through the backend
const notificationAPI = {
    /**
     * Send a test notification to verify desktop notification setup
     */
    sendTestNotification: async () => {
        return axiosPrivate.post('/api/notifications/test');
    },

    /**
     * Send notifications for all tasks due today
     */
    sendDueTasksNotifications: async () => {
        return axiosPrivate.post('/api/notifications/due-tasks');
    }
};

export default notificationAPI;
