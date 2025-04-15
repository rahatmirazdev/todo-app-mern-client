import React, { useState } from 'react';
import { useTodo } from '../../context/TodoContext';
import axiosPrivate from '../../services/api/axiosPrivate';

const DataManagementSettings = () => {
    const { todos, fetchTodos } = useTodo();
    const [exporting, setExporting] = useState(false);
    const [importing, setImporting] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Export todos to JSON file
    const handleExport = async () => {
        try {
            setExporting(true);
            setMessage({ type: '', text: '' });

            // Create a JSON blob with the todos data
            const exportData = JSON.stringify(todos, null, 2);
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
                        Download your tasks as a JSON file that you can back up or import later.
                    </p>
                    <button
                        onClick={handleExport}
                        disabled={exporting || todos.length === 0}
                        className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-300 disabled:opacity-70"
                    >
                        {exporting ? "Exporting..." : "Export Tasks"}
                    </button>
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
                    <div className="flex flex-col space-y-3">
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 dark:text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-medium
                                file:bg-indigo-50 file:text-indigo-700
                                dark:file:bg-indigo-900/50 dark:file:text-indigo-400
                                hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/70"
                        />
                        <button
                            onClick={handleImport}
                            disabled={importing || !importFile}
                            className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-300 disabled:opacity-70"
                        >
                            {importing ? "Importing..." : "Import Tasks"}
                        </button>
                    </div>
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
