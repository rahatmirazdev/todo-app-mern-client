import { useState, useEffect } from 'react';
import { useTodo } from '../../context/TodoContext';
import BasicInfo from './modal/BasicInfo';
import StatusPrioritySelector from './modal/StatusPrioritySelector';
import DateCategory from './modal/DateCategory';
import TagManager from './modal/TagManager';
import RecurringOptions from './modal/RecurringOptions';
import SubtaskManager from './modal/SubtaskManager';
import DependencySelector from './modal/DependencySelector';
import ModalActions from './modal/ModalActions';
import axiosPrivate from '../../services/api/axiosPrivate';
import { getSubtaskSuggestions, shouldShowSubtaskSuggestions } from '../../services/subtaskSuggestionService';
import { toast } from 'react-hot-toast';
import DurationEstimateField from './modal/DurationEstimateField';
import OptimalTimeField from './scheduling/OptimalTimeField';
import TaskTypeField from './scheduling/TaskTypeField';
import TimeRecommendations from './scheduling/TimeRecommendations';
import schedulerService from '../../services/schedulerService';
import NaturalLanguageInput from './natural-language/NaturalLanguageInput';

const TodoModal = ({ isOpen, onClose, mode = 'create', todo = null, onSuccess, onError }) => {
    const { createTodo, updateTodo, allTodos, fetchAllTodos } = useTodo();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium', // Will be overridden by user preferences
        dueDate: '',
        category: 'general', // Will be overridden by user preferences
        tags: [],
        isRecurring: false,
        recurringPattern: 'daily',
        recurringEndDate: '',
        subtasks: [],
        dependencies: [],
        // Add new scheduling fields
        estimatedDuration: 30,
        optimalTimeOfDay: 'any',
        taskType: 'general',
        scheduledTime: null
    });
    const [newTag, setNewTag] = useState('');
    const [newSubtask, setNewSubtask] = useState('');
    const [loadingPreferences, setLoadingPreferences] = useState(true);
    const [loadingSubtaskSuggestions, setLoadingSubtaskSuggestions] = useState(false);
    const [subtaskSuggestions, setSubtaskSuggestions] = useState([]);
    const [showAIAssistant, setShowAIAssistant] = useState(false);

    // Ensure we have the latest list of todos for dependency selection
    useEffect(() => {
        fetchAllTodos();
    }, [fetchAllTodos]);

    useEffect(() => {
        if (mode === 'edit' && todo) {
            // Format the dates for input elements
            const formattedDueDate = todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '';
            const formattedRecurringEndDate = todo.recurringEndDate ? new Date(todo.recurringEndDate).toISOString().split('T')[0] : '';

            setFormData({
                title: todo.title || '',
                description: todo.description || '',
                status: todo.status || 'todo',
                priority: todo.priority || 'medium',
                dueDate: formattedDueDate,
                category: todo.category || 'general',
                tags: todo.tags || [],
                isRecurring: todo.isRecurring || false,
                recurringPattern: todo.recurringPattern || 'daily',
                recurringEndDate: formattedRecurringEndDate,
                subtasks: todo.subtasks || [],
                dependencies: todo.dependencies || [],
                estimatedDuration: todo.estimatedDuration || 30,
                optimalTimeOfDay: todo.optimalTimeOfDay || 'any',
                taskType: todo.taskType || 'general',
                scheduledTime: todo.scheduledTime || null
            });
        }
    }, [mode, todo]);

    useEffect(() => {
        const fetchPreferences = async () => {
            // Only fetch preferences for new tasks
            if (mode !== 'create') {
                setLoadingPreferences(false);
                return;
            }

            try {
                setLoadingPreferences(true);
                const response = await axiosPrivate.get('/users/preferences');

                if (response.data && response.data.taskDefaults) {
                    const taskDefaults = response.data.taskDefaults;

                    // Only update the form for new tasks
                    setFormData(prev => ({
                        ...prev,
                        priority: taskDefaults.defaultPriority || prev.priority,
                        category: taskDefaults.defaultCategory || prev.category,
                        // Don't set status here as it's usually "todo" for new tasks
                    }));
                }
            } catch (err) {
                console.error('Error fetching preferences:', err);

                // Fall back to localStorage
                setFormData(prev => ({
                    ...prev,
                    priority: localStorage.getItem('taskDefaultPriority') || prev.priority,
                    category: localStorage.getItem('taskDefaultCategory') || prev.category,
                }));
            } finally {
                setLoadingPreferences(false);
            }
        };

        fetchPreferences();
    }, [mode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleAddTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, newTag.trim()]
            });
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(tag => tag !== tagToRemove)
        });
    };

    const handleAddSubtask = () => {
        if (newSubtask.trim()) {
            setFormData({
                ...formData,
                subtasks: [
                    ...formData.subtasks,
                    {
                        title: newSubtask.trim(),
                        completed: false,
                        completedAt: null
                    }
                ]
            });
            setNewSubtask('');
        }
    };

    const handleRemoveSubtask = (index) => {
        const updatedSubtasks = [...formData.subtasks];
        updatedSubtasks.splice(index, 1);
        setFormData({ ...formData, subtasks: updatedSubtasks });
    };

    const handleToggleSubtask = (index) => {
        const updatedSubtasks = [...formData.subtasks];
        updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
        updatedSubtasks[index].completedAt = updatedSubtasks[index].completed ? new Date().toISOString() : null;
        setFormData({ ...formData, subtasks: updatedSubtasks });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Prepare the data
            const todoData = { ...formData };

            // Convert empty strings to null for dates
            if (!todoData.dueDate) todoData.dueDate = null;
            if (!todoData.recurringEndDate) todoData.recurringEndDate = null;

            if (mode === 'create') {
                await createTodo(todoData);
                if (onSuccess) onSuccess();
            } else {
                await updateTodo(todo._id, todoData);
                if (onSuccess) onSuccess();
            }
            onClose();
        } catch (err) {
            const errorMessage = err.message || 'Something went wrong';
            setError(errorMessage);
            if (onError) onError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Function to get subtask suggestions
    const fetchSubtaskSuggestions = async () => {
        if (!formData.description || formData.description.trim() === '') {
            return;
        }

        try {
            setLoadingSubtaskSuggestions(true);
            const suggestions = await getSubtaskSuggestions(formData.description, formData.title);
            setSubtaskSuggestions(suggestions);
        } catch (error) {
            console.error('Failed to get subtask suggestions:', error);
        } finally {
            setLoadingSubtaskSuggestions(false);
        }
    };

    // Check for preference and automatically suggest subtasks when description changes
    useEffect(() => {
        const checkPreferenceAndFetchSuggestions = async () => {
            if (mode !== 'create') return;

            const autoSuggestEnabled = await shouldShowSubtaskSuggestions();

            if (autoSuggestEnabled &&
                formData.description &&
                formData.description.length > 20 &&
                formData.subtasks.length === 0) {
                fetchSubtaskSuggestions();
            }
        };

        const debounceTimer = setTimeout(() => {
            checkPreferenceAndFetchSuggestions();
        }, 1000);

        return () => clearTimeout(debounceTimer);
    }, [formData.description, mode, formData.subtasks.length]);

    // Add suggested subtasks to the form
    const handleAddSuggestedSubtasks = () => {
        if (subtaskSuggestions.length === 0) return;

        setFormData({
            ...formData,
            subtasks: [...formData.subtasks, ...subtaskSuggestions]
        });

        toast.success(`Added ${subtaskSuggestions.length} suggested subtask${subtaskSuggestions.length > 1 ? 's' : ''}`);
        setSubtaskSuggestions([]);
    };

    // New function to handle scheduling a task
    const handleScheduleTask = async (scheduledTime) => {
        try {
            if (mode === 'edit' && todo?._id) {
                const updatedTask = await schedulerService.scheduleTask(todo._id, scheduledTime);

                // Update the form data
                setFormData(prev => ({
                    ...prev,
                    scheduledTime: updatedTask.scheduledTime
                }));

                toast.success('Task scheduled successfully');
            }
        } catch (error) {
            console.error('Error scheduling task:', error);
            toast.error('Failed to schedule task');
        }
    };

    // Add handler for parsed task data
    const handleTaskParsed = (parsedTask) => {
        // Format dates if they exist in the parsed task
        if (parsedTask.dueDate) {
            parsedTask.dueDate = new Date(parsedTask.dueDate).toISOString().split('T')[0];
        }

        // Update the form data with the parsed task information
        setFormData(prev => ({
            ...prev,
            ...parsedTask,
        }));

        // Close the assistant
        setShowAIAssistant(false);

        // Show success message
        toast.success('Task details extracted with AI');
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
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                    {mode === 'create' ? 'Create New Todo' : 'Edit Todo'}
                                </h3>

                                {/* Add AI Assistant toggle button */}
                                <div className="flex justify-end mt-1">
                                    <button
                                        type="button"
                                        onClick={() => setShowAIAssistant(!showAIAssistant)}
                                        className="text-sm flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                        </svg>
                                        {showAIAssistant ? 'Hide AI Assistant' : 'Use AI Assistant'}
                                    </button>
                                </div>

                                {error && (
                                    <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                                        {error}
                                    </div>
                                )}

                                {/* Add AI Assistant component */}
                                {showAIAssistant && (
                                    <div className="mb-4 mt-3">
                                        <NaturalLanguageInput
                                            onTaskParsed={handleTaskParsed}
                                            onClose={() => setShowAIAssistant(false)}
                                        />
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="mt-4">
                                    {loadingPreferences && mode === 'create' && (
                                        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                            Loading your preferences...
                                        </div>
                                    )}
                                    <BasicInfo formData={formData} handleChange={handleChange} />
                                    <StatusPrioritySelector formData={formData} handleChange={handleChange} />
                                    <DateCategory formData={formData} handleChange={handleChange} />
                                    <TagManager
                                        formData={formData}
                                        newTag={newTag}
                                        setNewTag={setNewTag}
                                        handleAddTag={handleAddTag}
                                        handleRemoveTag={handleRemoveTag}
                                    />
                                    <DependencySelector
                                        allTodos={allTodos}
                                        currentTodoId={todo?._id || ''}
                                        selectedDependencies={formData.dependencies}
                                        onDependenciesChange={(deps) => setFormData({ ...formData, dependencies: deps })}
                                    />
                                    <RecurringOptions formData={formData} handleChange={handleChange} />
                                    {subtaskSuggestions.length > 0 && (
                                        <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                                                    AI Suggested Subtasks
                                                </h4>
                                                <div className="flex space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={handleAddSuggestedSubtasks}
                                                        className="text-xs py-1 px-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                                    >
                                                        Add All
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setSubtaskSuggestions([])}
                                                        className="text-xs py-1 px-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                                                    >
                                                        Dismiss
                                                    </button>
                                                </div>
                                            </div>
                                            <ul className="space-y-1">
                                                {subtaskSuggestions.map((suggestion, index) => (
                                                    <li key={index} className="text-sm text-indigo-600 dark:text-indigo-400 flex items-center">
                                                        <span className="mr-2">•</span>
                                                        {suggestion.title}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {loadingSubtaskSuggestions && (
                                        <div className="mb-4 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-md">
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Analyzing task description...
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={fetchSubtaskSuggestions}
                                        className="mb-4 text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
                                        disabled={loadingSubtaskSuggestions || !formData.description}
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                        </svg>
                                        Suggest subtasks with AI
                                    </button>
                                    <SubtaskManager
                                        formData={formData}
                                        newSubtask={newSubtask}
                                        setNewSubtask={setNewSubtask}
                                        handleAddSubtask={handleAddSubtask}
                                        handleRemoveSubtask={handleRemoveSubtask}
                                        handleToggleSubtask={handleToggleSubtask}
                                    />
                                    <div className="mt-4 border-t dark:border-gray-700 pt-4">
                                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
                                            Task Scheduling
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <DurationEstimateField
                                                    value={formData.estimatedDuration}
                                                    onChange={handleChange}
                                                />

                                                <OptimalTimeField
                                                    value={formData.optimalTimeOfDay}
                                                    onChange={handleChange}
                                                />

                                                <TaskTypeField
                                                    value={formData.taskType}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div>
                                                {mode === 'edit' && todo?._id && (
                                                    <TimeRecommendations
                                                        todoId={todo._id}
                                                        onSchedule={handleScheduleTask}
                                                    />
                                                )}

                                                {formData.scheduledTime && (
                                                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                                                        <h3 className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                                                            <span role="img" aria-label="calendar">📅</span> Scheduled Time
                                                        </h3>
                                                        <div className="text-sm text-gray-800 dark:text-gray-200">
                                                            {new Date(formData.scheduledTime).toLocaleString(undefined, {
                                                                weekday: 'long',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <ModalActions mode={mode} loading={loading} onClose={onClose} />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoModal;
