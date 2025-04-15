import { useState, useEffect } from 'react';
import { useTodo } from '../../context/TodoContext';

const RecurringSeriesModal = ({ isOpen, onClose, todoId, todoTitle }) => {
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { getRecurringSeries } = useTodo();

    useEffect(() => {
        if (isOpen && todoId) {
            fetchSeries();
        }
    }, [isOpen, todoId]);

    const fetchSeries = async () => {
        try {
            setLoading(true);
            const seriesData = await getRecurringSeries(todoId);
            setSeries(seriesData);
        } catch (err) {
            setError('Failed to load recurring series');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start w-full">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                    Recurring Task Series: {todoTitle}
                                </h3>

                                <div className="mt-4">
                                    {loading ? (
                                        <div className="flex justify-center py-4">
                                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                                        </div>
                                    ) : error ? (
                                        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md">
                                            {error}
                                        </div>
                                    ) : series.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                            No recurring tasks found in this series.
                                        </div>
                                    ) : (
                                        <div className="mt-2">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-700">
                                                    <tr>
                                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Due Date</th>
                                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                    {series.map((todo) => (
                                                        <tr key={todo._id}>
                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                <div className="font-medium text-gray-900 dark:text-white">
                                                                    {todo.title}
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                {todo.dueDate 
                                                                    ? new Date(todo.dueDate).toLocaleDateString() 
                                                                    : 'No due date'}
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                                    todo.status === 'completed' 
                                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                                                        : todo.status === 'in_progress'
                                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                                }`}>
                                                                    {todo.status === 'in_progress' ? 'In Progress' : 
                                                                    todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecurringSeriesModal;
