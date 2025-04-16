import axiosPrivate from './api/axiosPrivate';

/**
 * Parse a natural language task description into structured task data
 * @param {string} text - The natural language task description
 * @returns {Promise<Object>} - Structured task data
 */
export const parseNaturalLanguageTask = async (text) => {
    try {
        const response = await axiosPrivate.post('/todos/parse-natural-language', { text });
        return response.data.task;
    } catch (error) {
        console.error('Error parsing natural language task:', error);
        // Provide more specific error message based on status code
        if (error.response) {
            if (error.response.status === 500) {
                throw new Error('Server error processing your task. Please try a simpler description.');
            } else if (error.response.status === 400) {
                throw new Error(error.response.data.message || 'Invalid input. Please try again.');
            }
        }
        throw new Error('Failed to parse your task. Please try again with different wording.');
    }
};
