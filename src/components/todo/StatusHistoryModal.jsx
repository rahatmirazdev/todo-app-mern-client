import { useState, useEffect } from 'react';
import axiosPrivate from '../../services/api/axiosPrivate';

const StatusHistoryModal = ({ isOpen, onClose, todoId, todoTitle }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && todoId) {
            fetchHistory();
        }
    }, [isOpen, todoId]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await axiosPrivate.get(`/todos/${todoId}/history`);
            setHistory(response.data);
        } catch (err) {
            setError('Failed to load status history');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatStatusName = (status) => {
        return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'todo':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="fixed inset-0 bg-black opacity-50"></div>

                <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Status History: {todoTitle}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md">
                            {error}
                        </div>
                    ) : history.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            No status changes have been recorded for this task.
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Timeline */}
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                            <ul className="space-y-6">
                                {history.map((record, index) => (
                                    <li key={index} className="relative pl-12">
                                        {/* Timeline dot */}
                                        <div className="absolute left-[29px] w-4 h-4 bg-indigo-500 rounded-full"></div>

                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                <span className={`text-xs px-2 py-1 rounded ${getStatusClass(record.fromStatus)}`}>
                                                    {formatStatusName(record.fromStatus)}
                                                </span>
                                                <span className="text-gray-500 dark:text-gray-400">→</span>
                                                <span className={`text-xs px-2 py-1 rounded ${getStatusClass(record.toStatus)}`}>
                                                    {formatStatusName(record.toStatus)}
                                                </span>
                                            </div>

                                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                                Changed on {new Date(record.changedAt).toLocaleString()}
                                            </div>

                                            {record.comment && (
                                                <div className="mt-2 text-sm text-gray-700 dark:text-gray-400 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                                    {record.comment}
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatusHistoryModal;
