import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import axiosPrivate from '../../services/api/axiosPrivate';
import TodoSummaryWidget from '../../components/dashboard/TodoSummaryWidget';
import { useNotification } from '../../context/NotificationContext';
import NotificationPermissionPrompt from '../../components/notifications/NotificationPermissionPrompt';

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

  return (
    <>
      <div className="container mx-auto px-4 py-8 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome, {user?.name}!</h2>
          <p className="mb-4">You've successfully logged in to your account.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Profile</h3>
              <p>View and manage your profile information</p>
              <a href="/dashboard/profile" className="text-blue-600 dark:text-blue-400 mt-2 inline-block">Go to Profile →</a>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Todos</h3>
              <p>Manage your tasks and stay organized</p>
              {loading ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Loading stats...</p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  You have {todoCounts.active} active and {todoCounts.completed} completed todos
                </p>
              )}
              <Link to="/dashboard/todos" className="text-indigo-600 dark:text-indigo-400 mt-2 inline-block">Go to Todos →</Link>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Settings</h3>
              <p>Configure your account settings</p>
              <span className="text-purple-600 dark:text-purple-400 mt-2 inline-block cursor-pointer">Coming Soon</span>
            </div>
          </div>

          {/* Todo Priority and Due Date Summary Widget */}
          <div className="mt-8">
            <TodoSummaryWidget />
          </div>
        </div>
      </div>

      {/* Show notification permission prompt if permission is default */}
      {permissionState === 'default' && notificationContext && <NotificationPermissionPrompt />}
    </>
  );
};

export default Dashboard;