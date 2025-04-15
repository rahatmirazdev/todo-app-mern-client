import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import axiosPrivate from '../../../services/api/axiosPrivate';
import { useTodo } from '../../../context/TodoContext';

// Lazy load chart components
const TaskCompletionChart = lazy(() => import('../../../components/analytics/TaskCompletionChart'));
const TasksByPriorityChart = lazy(() => import('../../../components/analytics/TasksByPriorityChart'));
const TasksOverTimeChart = lazy(() => import('../../../components/analytics/TasksOverTimeChart'));

// Loading fallback component
const ChartPlaceholder = () => (
  <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
    <p className="text-gray-500 dark:text-gray-400">Loading chart...</p>
  </div>
);

const Analytics = () => {
  const { todos } = useTodo();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0
  });
  const [summary, setSummary] = useState({
    priority: { high: 0, medium: 0, low: 0 },
    dueDate: { overdue: 0, today: 0, upcoming: 0, later: 0, noDueDate: 0 }
  });
  const [completionRate, setCompletionRate] = useState(0);
  const [taskTrend, setTaskTrend] = useState({
    weekly: 0,
    monthly: 0
  });

  // Memoize fetch function to avoid recreation on each render
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch basic stats
      const statsResponse = await axiosPrivate.get('/todos/stats');
      setStats(statsResponse.data);

      // Calculate completion rate
      const total = statsResponse.data.total;
      const completed = statsResponse.data.completed;
      setCompletionRate(total > 0 ? Math.round((completed / total) * 100) : 0);

      // Fetch summary data
      const summaryResponse = await axiosPrivate.get('/todos/summary');
      setSummary(summaryResponse.data);

      // Calculate task trend
      // This is a mockup - in a real app, you'd have historical data
      setTaskTrend({
        weekly: Math.floor(Math.random() * 30) - 10, // Random number between -10 and 20
        monthly: Math.floor(Math.random() * 40) - 15 // Random number between -15 and 25
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-96 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Task Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2 text-blue-700 dark:text-blue-300">Total Tasks</h3>
          <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">{stats.total}</p>
          <div className="flex items-center mt-2 text-sm text-blue-600 dark:text-blue-400">
            <span className="flex items-center">
              <svg className={`w-3 h-3 mr-1 ${taskTrend.monthly >= 0 ? '' : 'transform rotate-180'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5l7 7-7 7-7-7 7-7z" fill="currentColor" />
              </svg>
              {Math.abs(taskTrend.monthly)}%
            </span>
            <span className="ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2 text-green-700 dark:text-green-300">Completion Rate</h3>
          <p className="text-3xl font-bold text-green-800 dark:text-green-200">{completionRate}%</p>
          <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
            <span className="flex items-center">
              <svg className={`w-3 h-3 mr-1 ${taskTrend.weekly >= 0 ? '' : 'transform rotate-180'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5l7 7-7 7-7-7 7-7z" fill="currentColor" />
              </svg>
              {Math.abs(taskTrend.weekly)}%
            </span>
            <span className="ml-2">vs last week</span>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2 text-purple-700 dark:text-purple-300">Overdue Tasks</h3>
          <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">{summary.dueDate.overdue}</p>
          <div className="flex items-center mt-2 text-sm text-purple-600 dark:text-purple-400">
            <span>Requires immediate attention</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Tasks by Status</h3>
          <div className="h-64">
            <Suspense fallback={<ChartPlaceholder />}>
              <TaskCompletionChart active={stats.active} completed={stats.completed} />
            </Suspense>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Tasks by Priority</h3>
          <div className="h-64">
            <Suspense fallback={<ChartPlaceholder />}>
              <TasksByPriorityChart
                high={summary.priority.high}
                medium={summary.priority.medium}
                low={summary.priority.low}
              />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Tasks Over Time</h3>
        <div className="h-80">
          <Suspense fallback={<ChartPlaceholder />}>
            <TasksOverTimeChart todos={todos} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Analytics);
