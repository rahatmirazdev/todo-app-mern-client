import { useState } from 'react';
import { useTodo } from '../../context/TodoContext';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import toast from 'react-hot-toast';

// Task card component that can be dragged
const TaskCard = ({ todo, onEdit }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'TASK',
        item: { id: todo._id, status: todo.status },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    // Calculate if a task is overdue
    const isOverdue = (dueDate) => {
        if (!dueDate || todo.status === 'completed') return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDateObj = new Date(dueDate);
        dueDateObj.setHours(0, 0, 0, 0);
        return dueDateObj < today;
    };

    // Get priority class
    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'high': return 'border-l-4 border-red-500';
            case 'medium': return 'border-l-4 border-orange-500';
            case 'low': return 'border-l-4 border-green-500';
            default: return '';
        }
    };

    return (
        <div
            ref={drag}
            className={`p-3 mb-2 bg-white dark:bg-gray-700 rounded-md shadow cursor-move ${getPriorityClass(todo.priority)} ${isDragging ? 'opacity-50' : 'opacity-100'}`}
            onClick={() => onEdit(todo)}
        >
            <h3 className="font-medium text-gray-900 dark:text-white text-sm">{todo.title}</h3>

            {todo.dueDate && (
                <div className={`mt-2 text-xs flex items-center ${isOverdue(todo.dueDate) ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(todo.dueDate).toLocaleDateString()}
                </div>
            )}

            <div className="mt-2 flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded-full ${todo.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        todo.priority === 'medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                </span>

                {todo.completedAt && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        Completed on {new Date(todo.completedAt).toLocaleDateString()}
                    </span>
                )}
            </div>
        </div>
    );
};

// Column component that can receive dropped tasks
const Column = ({ status, title, todos, onDrop, onEdit }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'TASK',
        drop: (item) => onDrop(item.id, status),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    // Filter todos by status
    const filteredTodos = todos.filter(todo => todo.status === status);

    return (
        <div className="flex-1 min-w-[250px] mx-2 first:ml-0 last:mr-0">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-t-md px-3 py-2 font-medium">
                <div className="flex items-center justify-between">
                    <h2 className="text-gray-700 dark:text-gray-300">{title}</h2>
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded-full">
                        {filteredTodos.length}
                    </span>
                </div>
            </div>

            <div
                ref={drop}
                className={`bg-gray-50 dark:bg-gray-800/50 p-2 rounded-b-md min-h-[300px] transition-colors ${isOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
            >
                {filteredTodos.map(todo => (
                    <TaskCard key={todo._id} todo={todo} onEdit={onEdit} />
                ))}

                {filteredTodos.length === 0 && (
                    <div className="flex items-center justify-center h-20 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-md">
                        <p className="text-sm text-gray-400 dark:text-gray-500">No tasks</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const KanbanBoard = ({ todos, onEdit }) => {
    const { updateTodoStatus } = useTodo();
    const [actionInProgress, setActionInProgress] = useState(false);

    const handleDrop = async (id, newStatus) => {
        if (actionInProgress) return;

        // Find the todo with the given id
        const todo = todos.find(t => t._id === id);

        // Check if todo exists before accessing its properties
        if (!todo) {
            console.error(`Todo with id ${id} not found`);
            toast.error('Error updating task status');
            return;
        }

        // Skip if the status hasn't changed
        if (todo.status === newStatus) return;

        setActionInProgress(true);
        try {
            await updateTodoStatus(id, newStatus);
            toast.success(`Task moved to ${newStatus.replace('_', ' ')}`);
        } catch (error) {
            toast.error('Failed to update status');
            console.error('Error updating status:', error);
        } finally {
            setActionInProgress(false);
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="overflow-x-auto pb-4">
                <div className="flex min-w-max">
                    <Column
                        status="todo"
                        title="To Do"
                        todos={todos}
                        onDrop={handleDrop}
                        onEdit={onEdit}
                    />
                    <Column
                        status="in_progress"
                        title="In Progress"
                        todos={todos}
                        onDrop={handleDrop}
                        onEdit={onEdit}
                    />
                    <Column
                        status="completed"
                        title="Completed"
                        todos={todos}
                        onDrop={handleDrop}
                        onEdit={onEdit}
                    />
                </div>
            </div>
        </DndProvider>
    );
};

export default KanbanBoard;
