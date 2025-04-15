import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import notificationService from '../services/NotificationService';
import { useTodo } from './TodoContext';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [permissionState, setPermissionState] = useState('default');
    const { todos } = useTodo();
    const navigate = useNavigate();

    // Check permission state on mount
    useEffect(() => {
        const isSupported = notificationService.checkSupport();
        if (isSupported) {
            setPermissionState(Notification.permission);
            setNotificationsEnabled(Notification.permission === 'granted');
        }
    }, []);

    // Request permission for notifications
    const requestPermission = useCallback(async () => {
        const permission = await notificationService.requestPermission();
        setPermissionState(permission);
        setNotificationsEnabled(permission === 'granted');
        return permission;
    }, []);

    // Show a task reminder notification
    const showTaskReminder = useCallback((todo) => {
        if (!notificationsEnabled) return null;

        return notificationService.showTaskReminder(todo, () => {
            navigate(`/dashboard/todos?id=${todo._id}`);
        });
    }, [navigate, notificationsEnabled]);

    // Show a task update notification
    const showTaskUpdate = useCallback((message, todoId) => {
        if (!notificationsEnabled) return null;

        return notificationService.showTaskUpdate(message, todoId, () => {
            navigate(`/dashboard/todos?id=${todoId}`);
        });
    }, [navigate, notificationsEnabled]);

    // Check for due tasks and send reminders
    useEffect(() => {
        if (!notificationsEnabled || !todos.length) return;

        // Check for tasks due today
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const todayStr = now.toISOString().split('T')[0];

        const dueTasks = todos.filter(todo => {
            if (!todo.dueDate || todo.status === 'completed') return false;

            const dueDate = new Date(todo.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            const dueDateStr = dueDate.toISOString().split('T')[0];
            return dueDateStr === todayStr;
        });

        // Send notifications for tasks due today that haven't been notified yet
        if (dueTasks.length > 0) {
            // Use localStorage to track which tasks we've already sent notifications for
            const notifiedTasks = JSON.parse(localStorage.getItem('notifiedTasks') || '{}');
            const today = new Date().toISOString().split('T')[0];

            dueTasks.forEach(task => {
                // Check if we've already notified for this task today
                if (!notifiedTasks[task._id] || notifiedTasks[task._id] !== today) {
                    showTaskReminder(task);

                    // Mark as notified
                    notifiedTasks[task._id] = today;
                }
            });

            localStorage.setItem('notifiedTasks', JSON.stringify(notifiedTasks));
        }
    }, [todos, notificationsEnabled, showTaskReminder]);

    // Value to be provided to consumers
    const value = {
        notificationsEnabled,
        permissionState,
        requestPermission,
        showTaskReminder,
        showTaskUpdate
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
