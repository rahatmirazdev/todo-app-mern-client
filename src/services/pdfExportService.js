import jsPDF from 'jspdf';

/**
 * Format a date for display in the PDF
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    return new Date(dateString).toLocaleDateString();
};

/**
 * Generate a PDF document from todo items
 * @param {Array} todos - The list of todo items
 * @param {Object} options - PDF generation options
 * @returns {jsPDF} The generated PDF document
 */
const generateTodoPDF = (todos, options = {}) => {
    const {
        title = 'My Tasks',
        dateRange = null,
        includeCompleted = true,
        fileName = `tasks-export-${new Date().toISOString().split('T')[0]}.pdf`
    } = options;

    // Filter todos based on options
    let filteredTodos = [...todos];

    // Filter by date range if provided
    if (dateRange && dateRange.from && dateRange.to) {
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999); // End of day

        filteredTodos = filteredTodos.filter(todo => {
            const createdDate = new Date(todo.createdAt);
            return createdDate >= fromDate && createdDate <= toDate;
        });
    }

    // Filter by status if needed
    if (!includeCompleted) {
        filteredTodos = filteredTodos.filter(todo => todo.status !== 'completed');
    }

    // Create new PDF document
    const doc = new jsPDF();
    let yPos = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    // Define textX here in the outer scope so it's available throughout the function
    const textX = 15;

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80); // Dark blue color
    doc.text(title, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    // Add date range if provided
    if (dateRange && dateRange.from && dateRange.to) {
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        const dateRangeText = `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`;
        doc.text(dateRangeText, pageWidth / 2, yPos, { align: 'center' });
        yPos += 15;
    } else {
        yPos += 10;
    }

    // Add export date
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Exported on: ${new Date().toLocaleString()}`, pageWidth - 15, yPos, { align: 'right' });
    yPos += 15;

    // No tasks case
    if (filteredTodos.length === 0) {
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text('No tasks found for the selected criteria.', pageWidth / 2, yPos, { align: 'center' });
        return { doc, fileName };
    }

    // Group todos by status
    const taskGroups = {
        todo: filteredTodos.filter(todo => todo.status === 'todo'),
        in_progress: filteredTodos.filter(todo => todo.status === 'in_progress'),
        completed: filteredTodos.filter(todo => todo.status === 'completed')
    };

    // Function to add a task to the PDF
    const addTask = (task, index) => {
        const lineHeight = 7;
        let currentY = yPos;

        // Check if we need a new page
        if (currentY > 270) {
            doc.addPage();
            currentY = 20;
            yPos = 20;
        }

        // Task number and title
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(44, 62, 80);
        doc.text(`${index + 1}. ${task.title}`, textX, currentY);
        currentY += lineHeight;

        // Task details
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(100, 100, 100);

        // Priority and Category
        const priorityColor = task.priority === 'high' ? 'High priority' :
            task.priority === 'medium' ? 'Medium priority' : 'Low priority';
        doc.text(`Priority: ${priorityColor} | Category: ${task.category || 'General'}`, textX + 5, currentY);
        currentY += lineHeight - 1;

        // Due date
        if (task.dueDate) {
            doc.text(`Due: ${formatDate(task.dueDate)}`, textX + 5, currentY);
            currentY += lineHeight - 1;
        }

        // Creation/Completion date
        doc.text(`Created: ${formatDate(task.createdAt)}${task.completedAt ? ` | Completed: ${formatDate(task.completedAt)}` : ''}`, textX + 5, currentY);
        currentY += lineHeight;

        // Description (if exists)
        if (task.description && task.description.trim()) {
            doc.setFontSize(9);
            const descLines = doc.splitTextToSize(task.description, pageWidth - 40);
            doc.text(descLines, textX + 5, currentY);
            currentY += (descLines.length * (lineHeight - 2)) + 2;
        }

        // Subtasks (if exists)
        if (task.subtasks && task.subtasks.length > 0) {
            doc.setFontSize(9);
            doc.text('Subtasks:', textX + 5, currentY);
            currentY += 5;

            for (const subtask of task.subtasks) {
                const checkbox = subtask.completed ? '☑' : '☐';
                doc.text(`${checkbox} ${subtask.title}`, textX + 10, currentY);
                currentY += lineHeight - 2;
            }
            currentY += 2;
        }

        // Tags (if exists)
        if (task.tags && task.tags.length > 0) {
            doc.setFontSize(9);
            doc.text(`Tags: ${task.tags.join(', ')}`, textX + 5, currentY);
            currentY += lineHeight;
        }

        // Add a separator line
        currentY += 2;
        doc.setDrawColor(220, 220, 220);
        doc.line(textX, currentY, pageWidth - 15, currentY);
        currentY += 5;

        return currentY;
    };

    // Add tasks by status group
    const statusLabels = {
        todo: 'To Do',
        in_progress: 'In Progress',
        completed: 'Completed'
    };

    for (const [status, tasks] of Object.entries(taskGroups)) {
        if (tasks.length > 0) {
            // Add section header for status
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(52, 73, 94);
            doc.text(statusLabels[status], textX, yPos);
            yPos += 7;

            // Add all tasks in this status
            for (let i = 0; i < tasks.length; i++) {
                yPos = addTask(tasks[i], i);
            }

            // Add some space between status sections
            yPos += 5;
        }
    }

    return { doc, fileName };
};

/**
 * Generate and download a PDF document
 * @param {Array} todos - The list of todo items
 * @param {Object} options - PDF generation options
 */
const exportToPDF = (todos, options = {}) => {
    const { doc, fileName } = generateTodoPDF(todos, options);
    doc.save(fileName);
};

export default {
    generateTodoPDF,
    exportToPDF
};
