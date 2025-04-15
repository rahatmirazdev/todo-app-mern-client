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

const TodoModal = ({ isOpen, onClose, mode = 'create', todo = null, onSuccess, onError }) => {
    const { createTodo, updateTodo, allTodos, fetchAllTodos } = useTodo();
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
        subtasks: [],
        dependencies: []
    });
    const [newTag, setNewTag] = useState('');
    const [newSubtask, setNewSubtask] = useState('');

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
                dependencies: todo.dependencies || []
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
                                    <SubtaskManager
                                        formData={formData}
                                        newSubtask={newSubtask}
                                        setNewSubtask={setNewSubtask}
                                        handleAddSubtask={handleAddSubtask}
                                        handleRemoveSubtask={handleRemoveSubtask}
                                        handleToggleSubtask={handleToggleSubtask}
                                    />
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
