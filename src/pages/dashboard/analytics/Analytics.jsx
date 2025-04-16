import React, { useState, useEffect, useCallback, lazy, useRef } from 'react';
import axiosPrivate from '../../../services/api/axiosPrivate';
import { useTodo } from '../../../context/TodoContext';
import { useNavigate } from 'react-router-dom';
import { toPng } from 'html-to-image';

// Custom components
import LoadingState from '../../../components/analytics/common/LoadingState';
import ErrorState from '../../../components/analytics/common/ErrorState';
import HelpTooltip from '../../../components/analytics/common/HelpTooltip';
import AnalyticsHeader from '../../../components/analytics/AnalyticsHeader';
import TotalTasksCard from '../../../components/analytics/summary/TotalTasksCard';
import CompletionRateCard from '../../../components/analytics/summary/CompletionRateCard';
import OverdueTasksCard from '../../../components/analytics/summary/OverdueTasksCard';
import ChartContainer from '../../../components/analytics/charts/ChartContainer';

// Lazy load chart components
const TaskCompletionChart = lazy(() => import('../../../components/analytics/TaskCompletionChart'));
const TasksByPriorityChart = lazy(() => import('../../../components/analytics/TasksByPriorityChart'));
const TasksOverTimeChart = lazy(() => import('../../../components/analytics/TasksOverTimeChart'));

const Analytics = () => {
  const { todos } = useTodo();
  const navigate = useNavigate();
  const analyticsRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const [isExporting, setIsExporting] = useState(false);
  const [tooltip, setTooltip] = useState(null);

  // Memoize fetch function to avoid recreation on each render
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

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
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [axiosPrivate]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Handle clicks on chart segments to filter tasks
  const handleStatusClick = useCallback((status) => {
    navigate(`/dashboard/todos?status=${status}`);
  }, [navigate]);

  const handlePriorityClick = useCallback((priority) => {
    navigate(`/dashboard/todos?priority=${priority}`);
  }, [navigate]);

  // Export dashboard as image
  const handleExportImage = useCallback(async () => {
    if (!analyticsRef.current) return;

    try {
      setIsExporting(true);
      const dataUrl = await toPng(analyticsRef.current, { quality: 0.95 });

      // Create download link
      const link = document.createElement('a');
      link.download = `task-analytics-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
    } finally {
      setIsExporting(false);
    }
  }, []);

  // Show tooltip with help text
  const showHelp = (helpType) => {
    switch (helpType) {
      case 'completion':
        setTooltip({
          type: 'completion',
          text: 'Shows the percentage of tasks marked as completed out of all tasks. Higher is better!'
        });
        break;
      case 'trend':
        setTooltip({
          type: 'trend',
          text: 'Shows how your task metrics have changed compared to the previous period.'
        });
        break;
      case 'overdue':
        setTooltip({
          type: 'overdue',
          text: 'Tasks whose due dates have passed without being completed. Should be addressed soon!'
        });
        break;
      default:
        setTooltip(null);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <ErrorState message={error} onRetry={fetchAnalytics} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 pb-2 mb-0" ref={analyticsRef}>
      <AnalyticsHeader
        onExport={handleExportImage}
        onRefresh={fetchAnalytics}
        isExporting={isExporting}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <TotalTasksCard
          total={stats.total}
          trend={taskTrend.monthly}
          showHelp={showHelp}
        />

        <CompletionRateCard
          completionRate={completionRate}
          trend={taskTrend.weekly}
          showHelp={showHelp}
        />

        <OverdueTasksCard
          overdueCount={summary.dueDate.overdue}
          showHelp={showHelp}
          navigate={navigate}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <ChartContainer title="Tasks by Status">
          <TaskCompletionChart
            active={stats.active}
            completed={stats.completed}
            onSegmentClick={handleStatusClick}
          />
        </ChartContainer>

        <ChartContainer title="Tasks by Priority">
          <TasksByPriorityChart
            high={summary.priority.high}
            medium={summary.priority.medium}
            low={summary.priority.low}
            onPriorityClick={handlePriorityClick}
          />
        </ChartContainer>
      </div>

      <ChartContainer title="Tasks Over Time" height="h-80">
        <TasksOverTimeChart todos={todos} />
      </ChartContainer>

      <HelpTooltip tooltip={tooltip} setTooltip={setTooltip} />
    </div>
  );
};

export default React.memo(Analytics);
