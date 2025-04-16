import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import notificationService from '../services/NotificationService';

// Create context with default values
const NotificationContext = createContext({
    notificationsEnabled: false,
    desktopNotificationsEnabled: false,
    browserNotificationsEnabled: false,
    permissionState: 'default',
    notifications: [],
    requestPermission: () => Promise.resolve('default'),
    toggleNotifications: () => { },
    toggleDesktopNotifications: () => { },
    toggleBrowserNotifications: () => { },
    showTaskReminder: () => null,
    showTaskUpdate: () => null,
    markAsRead: () => { },
    clearAll: () => { }
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [desktopNotificationsEnabled, setDesktopNotificationsEnabled] = useState(false);
    const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(false);
    const [permissionState, setPermissionState] = useState('default');
    const [notifications, setNotifications] = useState([]);

    // We can safely use useNavigate() now that NotificationProvider is inside Router
    const navigate = useNavigate();

    // Check permission state on mount
    useEffect(() => {
        const isSupported = notificationService.checkSupport();
        if (isSupported) {
            setPermissionState(Notification.permission);
            const isGranted = Notification.permission === 'granted';
            setNotificationsEnabled(isGranted);
            setBrowserNotificationsEnabled(isGranted);
        }
    }, []);

    // Request permission for notifications
    const requestPermission = useCallback(async () => {
        const permission = await notificationService.requestPermission();
        setPermissionState(permission);
        setNotificationsEnabled(permission === 'granted');
        setBrowserNotificationsEnabled(permission === 'granted');
        return permission;
    }, []);

    // Toggle all notifications
    const toggleNotifications = useCallback(() => {
        if (!notificationsEnabled && permissionState !== 'granted') {
            requestPermission();
        } else {
            setNotificationsEnabled(!notificationsEnabled);
            if (!notificationsEnabled) {
                // Enable sub-settings when enabling all
                setDesktopNotificationsEnabled(true);
                setBrowserNotificationsEnabled(true);
            }
        }
    }, [notificationsEnabled, permissionState, requestPermission]);

    // Toggle desktop notifications (in-app)
    const toggleDesktopNotifications = useCallback(() => {
        setDesktopNotificationsEnabled(!desktopNotificationsEnabled);
    }, [desktopNotificationsEnabled]);

    // Toggle browser notifications
    const toggleBrowserNotifications = useCallback(() => {
        if (!browserNotificationsEnabled && permissionState !== 'granted') {
            requestPermission();
        } else {
            setBrowserNotificationsEnabled(!browserNotificationsEnabled);
        }
    }, [browserNotificationsEnabled, permissionState, requestPermission]);

    // Show a task reminder notification
    const showTaskReminder = useCallback((todo) => {
        if (!notificationsEnabled || !browserNotificationsEnabled) return null;

        return notificationService.showTaskReminder(todo, () => {
            navigate(`/dashboard/todos?id=${todo._id}`);
        });
    }, [navigate, notificationsEnabled, browserNotificationsEnabled]);

    // Show a task update notification
    const showTaskUpdate = useCallback((message, todoId) => {
        if (!notificationsEnabled || !browserNotificationsEnabled) return null;

        return notificationService.showTaskUpdate(message, todoId, () => {
            navigate(`/dashboard/todos?id=${todoId}`);
        });
    }, [navigate, notificationsEnabled, browserNotificationsEnabled]);

    // Mock functions for notification management
    const markAsRead = useCallback((id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    // Value to be provided to consumers
    const value = {
        notificationsEnabled,
        desktopNotificationsEnabled,
        browserNotificationsEnabled,
        permissionState,
        notifications,
        requestPermission,
        toggleNotifications,
        toggleDesktopNotifications,
        toggleBrowserNotifications,
        showTaskReminder,
        showTaskUpdate,
        markAsRead,
        clearAll
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
