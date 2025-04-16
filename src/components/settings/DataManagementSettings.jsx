import React, { useState } from 'react';
import { useTodo } from '../../context/TodoContext';
import axiosPrivate from '../../services/api/axiosPrivate';
import pdfExportService from '../../services/pdfExportService';

const DataManagementSettings = () => {
    const { todos, fetchTodos } = useTodo();
    const [exporting, setExporting] = useState(false);
    const [exportingPDF, setExportingPDF] = useState(false);
    const [importing, setImporting] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [exportDateRange, setExportDateRange] = useState({
        from: '',
        to: '',
        enabled: false
    });
    const [includeCompleted, setIncludeCompleted] = useState(true);

    // Export todos to JSON file
    const handleExport = async () => {
        try {
            setExporting(true);
            setMessage({ type: '', text: '' });

            let filteredTodos = [...todos];

            // Apply date filtering if enabled
            if (exportDateRange.enabled && exportDateRange.from && exportDateRange.to) {
                const fromDate = new Date(exportDateRange.from);
                const toDate = new Date(exportDateRange.to);
                toDate.setHours(23, 59, 59, 999); // End of day

                filteredTodos = filteredTodos.filter(todo => {
                    const createdDate = new Date(todo.createdAt);
                    return createdDate >= fromDate && createdDate <= toDate;
                });
            }

            // Apply status filtering if needed
            if (!includeCompleted) {
                filteredTodos = filteredTodos.filter(todo => todo.status !== 'completed');
            }

            // Create a JSON blob with the filtered todos data
            const exportData = JSON.stringify(filteredTodos, null, 2);
            const blob = new Blob([exportData], { type: 'application/json' });

            // Create download link and trigger download
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `todos-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setMessage({ type: 'success', text: 'Tasks exported successfully!' });
        } catch (error) {
            console.error('Export error:', error);
            setMessage({ type: 'error', text: 'Failed to export tasks. Please try again.' });
        } finally {
            setExporting(false);
        }
    };

    // Export todos to PDF file
    const handleExportPDF = async () => {
        try {
            setExportingPDF(true);
            setMessage({ type: '', text: '' });

            // Generate title based on date range
            let title = 'My Tasks';
            if (exportDateRange.enabled && exportDateRange.from && exportDateRange.to) {
                const fromDate = new Date(exportDateRange.from).toLocaleDateString();
                const toDate = new Date(exportDateRange.to).toLocaleDateString();
                title = `My Tasks (${fromDate} - ${toDate})`;
            }

            // Export to PDF using our service
            pdfExportService.exportToPDF(todos, {
                title,
                dateRange: exportDateRange.enabled ? {
                    from: exportDateRange.from,
                    to: exportDateRange.to
                } : null,
                includeCompleted,
                fileName: `tasks-export-${new Date().toISOString().split('T')[0]}.pdf`
            });

            setMessage({ type: 'success', text: 'Tasks exported to PDF successfully!' });
        } catch (error) {
            console.error('PDF export error:', error);
            setMessage({ type: 'error', text: 'Failed to export tasks to PDF. Please try again.' });
        } finally {
            setExportingPDF(false);
        }
    };

    // Handle file selection for import
    const handleFileChange = (e) => {
        setImportFile(e.target.files[0]);
        setMessage({ type: '', text: '' });
    };

    // Import todos from JSON file
    const handleImport = async () => {
        if (!importFile) {
            setMessage({ type: 'error', text: 'Please select a file to import' });
            return;
        }

        try {
            setImporting(true);
            setMessage({ type: '', text: '' });

            // Read the file content
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);

                    // Send imported data to the server
                    await axiosPrivate.post('/todos/import', { todos: importedData });

                    // Refresh todos list
                    await fetchTodos();

                    setMessage({ type: 'success', text: 'Tasks imported successfully!' });
                    setImportFile(null);
                } catch (parseError) {
                    console.error('Parse error:', parseError);
                    setMessage({ type: 'error', text: 'Invalid JSON file. Please check the file and try again.' });
                }
                setImporting(false);
            };

            reader.onerror = () => {
                setMessage({ type: 'error', text: 'Failed to read file. Please try again.' });
                setImporting(false);
            };

            reader.readAsText(importFile);
        } catch (error) {
            console.error('Import error:', error);
            setMessage({ type: 'error', text: 'Failed to import tasks. Please try again.' });
            setImporting(false);
        }
    };

    // Toggle date range filter
    const handleToggleDateRange = () => {
        setExportDateRange(prev => ({
            ...prev,
            enabled: !prev.enabled
        }));
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Data Management</h2>

            {message.text && (
                <div className={`mb-4 p-3 rounded-md ${message.type === 'error'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 border dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium text-gray-800 dark:text-white mb-2">Export Tasks</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Download your tasks as a JSON or PDF file that you can back up or import later.
                    </p>

                    {/* Export Filters */}
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-md">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Export Options</h4>

                        <div className="mb-3">
                            <label className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    checked={includeCompleted}
                                    onChange={() => setIncludeCompleted(!includeCompleted)}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Include completed tasks</span>
                            </label>
                        </div>

                        <div className="mb-3">
                            <label className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    checked={exportDateRange.enabled}
                                    onChange={handleToggleDateRange}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Filter by date range</span>
                            </label>

                            {exportDateRange.enabled && (
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div>
                                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">From</label>
                                        <input
                                            type="date"
                                            value={exportDateRange.from}
                                            onChange={(e) => setExportDateRange(prev => ({ ...prev, from: e.target.value }))}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">To</label>
                                        <input
                                            type="date"
                                            value={exportDateRange.to}
                                            onChange={(e) => setExportDateRange(prev => ({ ...prev, to: e.target.value }))}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={handleExport}
                            disabled={exporting || todos.length === 0}
                            className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-300 disabled:opacity-70"
                        >
                            {exporting ? "Exporting..." : "Export JSON"}
                        </button>

                        <button
                            onClick={handleExportPDF}
                            disabled={exportingPDF || todos.length === 0}
                            className="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors duration-300 disabled:opacity-70"
                        >
                            {exportingPDF ? "Creating PDF..." : "Export PDF"}
                        </button>
                    </div>

                    {todos.length === 0 && (
                        <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                            You don't have any tasks to export yet.
                        </p>
                    )}
                </div>

                <div className="p-4 border dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium text-gray-800 dark:text-white mb-2">Import Tasks</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Import tasks from a previously exported JSON file.
                    </p>

                    <div className="mb-4">
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                        />
                    </div>

                    <button
                        onClick={handleImport}
                        disabled={importing || !importFile}
                        className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-300 disabled:opacity-70"
                    >
                        {importing ? "Importing..." : "Import Tasks"}
                    </button>
                </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 rounded-md">
                <h4 className="text-sm font-medium mb-2">Important Note</h4>
                <p className="text-sm">
                    Importing tasks will not delete your existing tasks but might create duplicates if the same task exists in both places.
                </p>
            </div>
        </div>
    );
};

export default DataManagementSettings;
