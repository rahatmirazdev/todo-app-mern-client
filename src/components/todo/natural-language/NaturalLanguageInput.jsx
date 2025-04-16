import React, { useState } from 'react';
import { parseNaturalLanguageTask } from '../../../services/naturalLanguageService';

const NaturalLanguageInput = ({ onTaskParsed, onClose }) => {
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!inputText.trim()) {
            setError('Please enter a task description');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const parsedTask = await parseNaturalLanguageTask(inputText);

            if (parsedTask) {
                onTaskParsed(parsedTask);
                onClose(); // Close after successful parsing
            } else {
                setError('Could not understand the task. Please try again with more details.');
            }
        } catch (err) {
            console.error('Error parsing task:', err);
            setError(err.message || 'Failed to parse task. Please try again with simpler language.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    AI Task Assistant
                </h3>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                    <span className="sr-only">Close</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                Describe your task in natural language and let AI help you fill out the form. For example:
            </p>

            <div className="mb-3 grid grid-cols-1 gap-2">
                <div
                    className="text-xs p-2 bg-gray-100 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                    onClick={() => setInputText("Schedule a high priority meeting with the team tomorrow at 3pm for 1 hour")}
                >
                    "Schedule a high priority meeting with the team tomorrow at 3pm for 1 hour"
                </div>
                <div
                    className="text-xs p-2 bg-gray-100 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                    onClick={() => setInputText("Submit quarterly report by next Friday, medium priority, work category")}
                >
                    "Submit quarterly report by next Friday, medium priority, work category"
                </div>
                <div
                    className="text-xs p-2 bg-gray-100 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                    onClick={() => setInputText("Grocery shopping this weekend: buy milk, eggs, bread and vegetables #personal #shopping")}
                >
                    "Grocery shopping this weekend: buy milk, eggs, bread and vegetables #personal #shopping"
                </div>
            </div>

            {error && (
                <div className="mb-3 p-2 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Describe your task here..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        rows="3"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : 'Create Task with AI'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NaturalLanguageInput;
