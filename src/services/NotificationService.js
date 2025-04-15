/**
 * Service for handling browser notifications
 */
class NotificationService {
    constructor() {
        this.isSupported = 'Notification' in window;
        this.permission = this.isSupported ? Notification.permission : 'denied';
    }

    /**
     * Check if browser notifications are supported
     * @returns {boolean} True if notifications are supported
     */
    checkSupport() {
        if (!this.isSupported) {
            console.log('This browser does not support notifications');
        }
        return this.isSupported;
    }

    /**
     * Request permission to show notifications
     * @returns {Promise<string>} The permission state
     */
    async requestPermission() {
        if (!this.checkSupport()) return 'denied';

        if (this.permission === 'granted') {
            return this.permission;
        }

        try {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            return permission;
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return 'denied';
        }
    }

    /**
     * Show a notification
     * @param {string} title The notification title
     * @param {Object} options Notification options
     * @returns {Notification|null} The notification object or null
     */
    async showNotification(title, options = {}) {
        if (!this.checkSupport()) return null;

        // If permission is not granted, try to request it
        if (this.permission !== 'granted') {
            const newPermission = await this.requestPermission();
            if (newPermission !== 'granted') {
                console.log('Notification permission denied');
                return null;
            }
        }

        // Set default options
        const defaultOptions = {
            icon: '/logo192.png', // Default icon
            badge: '/logo192.png',
            silent: false,
            ...options
        };

        // Create and show the notification
        try {
            const notification = new Notification(title, defaultOptions);

            // Handle notification interactions
            notification.onclick = (event) => {
                event.preventDefault();
                window.focus();
                if (options.onClick) options.onClick(event);
                notification.close();
            };

            return notification;
        } catch (error) {
            console.error('Error showing notification:', error);
            return null;
        }
    }

    /**
     * Show a todo task reminder notification
     * @param {Object} todo The todo object
     * @param {Function} onClick Callback when notification is clicked
     */
    async showTaskReminder(todo, onClick) {
        const title = 'Task Reminder';
        const options = {
            body: todo.title,
            tag: `todo-reminder-${todo._id}`,
            data: { todoId: todo._id },
            onClick: onClick
        };

        return this.showNotification(title, options);
    }

    /**
     * Show a task update notification
     * @param {string} message The notification message
     * @param {string} todoId The todo ID
     * @param {Function} onClick Callback when notification is clicked
     */
    async showTaskUpdate(message, todoId, onClick) {
        const title = 'Task Update';
        const options = {
            body: message,
            tag: `todo-update-${todoId}`,
            data: { todoId },
            onClick: onClick
        };

        return this.showNotification(title, options);
    }
}

export default new NotificationService();
