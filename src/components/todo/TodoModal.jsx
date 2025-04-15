import { useState, useEffect } from 'react';
import { useTodo } from '../../context/TodoContext';

const TodoModal = ({ isOpen, onClose, mode = 'create', todo = null, onSuccess, onError }) => {
    const { createTodo, updateTodo } = useTodo();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
        category: 'general',
        tags: [],
        isRecurring: false,
        recurringPattern: 'daily',
        recurringEndDate: '',
        subtasks: []
    });
    const [newTag, setNewTag] = useState('');
    const [newSubtask, setNewSubtask] = useState('');

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
                subtasks: todo.subtasks || []
            });
        }
    }, [mode, todo]);

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

                                {error && (
                                    <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="mt-4">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                        ></textarea>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Status
                                            </label>
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="todo">To Do</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Priority
                                            </label>
                                            <select
                                                name="priority"
                                                value={formData.priority}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Due Date
                                            </label>
                                            <input
                                                type="date"
                                                name="dueDate"
                                                value={formData.dueDate}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Category
                                            </label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="general">General</option>
                                                <option value="work">Work</option>
                                                <option value="personal">Personal</option>
                                                <option value="shopping">Shopping</option>
                                                <option value="health">Health</option>
                                                <option value="education">Education</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Tags
                                        </label>
                                        <div className="flex">
                                            <input
                                                type="text"
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                                placeholder="Add a tag..."
                                                className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddTag}
                                                className="px-3 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        {formData.tags.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {formData.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                                                    >
                                                        {tag}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveTag(tag)}
                                                            className="ml-1 text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="isRecurring"
                                                name="isRecurring"
                                                checked={formData.isRecurring}
                                                onChange={handleChange}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                                Recurring Task
                                            </label>
                                        </div>
                                    </div>

                                    {formData.isRecurring && (
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Repeat Pattern
                                                </label>
                                                <select
                                                    name="recurringPattern"
                                                    value={formData.recurringPattern}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                                >
                                                    <option value="daily">Daily</option>
                                                    <option value="weekly">Weekly</option>
                                                    <option value="monthly">Monthly</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    End Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="recurringEndDate"
                                                    value={formData.recurringEndDate}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Subtasks
                                        </label>
                                        <div className="flex">
                                            <input
                                                type="text"
                                                value={newSubtask}
                                                onChange={(e) => setNewSubtask(e.target.value)}
                                                placeholder="Add a subtask..."
                                                className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddSubtask}
                                                className="px-3 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        {formData.subtasks.length > 0 && (
                                            <ul className="mt-2 space-y-2">
                                                {formData.subtasks.map((subtask, index) => (
                                                    <li key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={subtask.completed}
                                                                onChange={() => handleToggleSubtask(index)}
                                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                            />
                                                            <span className={`ml-2 text-sm ${subtask.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                                {subtask.title}
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveSubtask(index)}
                                                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                        >
                                                            Remove
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 disabled:opacity-70"
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                                                </>
                                            ) : (
                                                mode === 'create' ? 'Create' : 'Update'
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
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
