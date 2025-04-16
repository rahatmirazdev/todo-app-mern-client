/**
 * Service to generate celebration messages when tasks are completed
 */

/**
 * Generate a celebration message based on the completed task
 * @param {Object} task - The completed task
 * @returns {Object} A celebration message object with title, message, and type
 */
export const generateCelebrationMessage = (task) => {
    const messages = [
        {
            title: "Great job!",
            message: "You've completed a task. Keep up the momentum!",
            type: "basic"
        },
        {
            title: "Task complete!",
            message: "One less thing to worry about. Well done!",
            type: "basic"
        },
        {
            title: "Achievement unlocked!",
            message: "You're making great progress. Keep it up!",
            type: "achievement"
        },
        {
            title: "Fantastic work!",
            message: "Successfully completed a task. You're on fire!",
            type: "achievement"
        },
        {
            title: "Mission accomplished!",
            message: "You're crushing your to-do list today!",
            type: "achievement"
        }
    ];

    // Add personalized messages based on task properties
    if (task.priority === 'high') {
        messages.push({
            title: "Major achievement!",
            message: "You've completed a high-priority task. Impressive work!",
            type: "important"
        });
    }

    if (task.category) {
        messages.push({
            title: `${task.category} progress!`,
            message: `You're making strides in your ${task.category} tasks!`,
            type: "category"
        });
    }

    // If task has subtasks and all are complete
    if (task.subtasks && task.subtasks.length > 0 &&
        task.subtasks.every(subtask => subtask.completed)) {
        messages.push({
            title: "Full completion!",
            message: "You completed all subtasks too. That's thorough work!",
            type: "subtasks"
        });
    }

    // Return a random message from the array
    return messages[Math.floor(Math.random() * messages.length)];
};
