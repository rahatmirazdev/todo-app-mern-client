import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import axiosPrivate from '../../services/api/axiosPrivate';
import TodoSummaryWidget from '../../components/dashboard/TodoSummaryWidget';
import { useNotification } from '../../context/NotificationContext';
import NotificationPermissionPrompt from '../../components/notifications/NotificationPermissionPrompt';
import Todo from './todo/Todo';
import Analytics from './analytics/Analytics';
import Calendar from './calendar/Calendar';
import Settings from './settings/Settings';

const Dashboard = () => {
  const { user } = useAuth();
  const [todoCounts, setTodoCounts] = useState({ total: 0, active: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  // Safely access the notification context
  const notificationContext = useNotification();
  const permissionState = notificationContext?.permissionState || 'default';

  useEffect(() => {
    const fetchTodoCounts = async () => {
      try {
        const response = await axiosPrivate.get('/todos/stats');
        setTodoCounts(response.data);
      } catch (error) {
        console.error('Error fetching todo stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodoCounts();
  }, []);

  // Create a DashboardOverview component to show at the index route
  const DashboardOverview = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard Overview</h1>

      {/* Show notification permission prompt if needed */}
      {notificationContext && permissionState === 'default' && (
        <NotificationPermissionPrompt />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Todo Summary */}
        <TodoSummaryWidget />

        {/* Quick Actions Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/dashboard/todos"
              className="flex items-center p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-800/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Manage Tasks
            </Link>
            <Link
              to="/dashboard/calendar"
              className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              View Calendar
            </Link>
            <Link
              to="/dashboard/analytics"
              className="flex items-center p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md hover:bg-green-100 dark:hover:bg-green-800/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              View Analytics
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Task Stats</h3>
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{todoCounts.total}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Tasks</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{todoCounts.active}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(todoCounts.active / todoCounts.total * 100) || 0}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Tasks</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{todoCounts.completed}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(todoCounts.completed / todoCounts.total * 100) || 0}%` }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Routes>
      <Route index element={<DashboardOverview />} />
      <Route path="todos" element={<Todo />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/dashboard/todos" replace />} />
    </Routes>
  );
};

export default Dashboard;