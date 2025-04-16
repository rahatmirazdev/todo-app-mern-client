import axiosPrivate from './api/axiosPrivate';

/**
 * Get AI-generated subtask suggestions for a task
 * @param {string} description - The task description 
 * @param {string} title - The task title
 * @returns {Promise<Array>} - A list of suggested subtasks
 */
export const getSubtaskSuggestions = async (description, title = '') => {
    try {
        const response = await axiosPrivate.post('/todos/suggest-subtasks', {
            description,
            title
        });

        return response.data.suggestions || [];
    } catch (error) {
        console.error('Error getting subtask suggestions:', error);
        throw error;
    }
};

/**
 * Check if subtask suggestions should be automatically shown
 * @returns {Promise<boolean>} Whether auto-suggestions are enabled
 */
export const shouldShowSubtaskSuggestions = async () => {
    try {
        // Get user preferences
        const response = await axiosPrivate.get('/users/preferences');
        return response.data?.taskDefaults?.autoCreateSubtasks || false;
    } catch (error) {
        console.error('Error checking subtask preferences:', error);
        // Fall back to localStorage if API fails
        return localStorage.getItem('autoCreateSubtasks') === 'true';
    }
};
