import axios from 'axios';

// Base URL that can be configured from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || (
    import.meta.env.PROD
        ? 'https://todo-app-mern-server-a9rx.onrender.com'
        : ''  // Empty base URL to use the proxy in development
);

// Check if the backend server is available
export const checkBackendStatus = async () => {
    try {
        // In production, use the API_BASE_URL/api endpoint instead of root
        // This helps avoid CORS issues since our API routes have proper CORS setup
        const endpoint = import.meta.env.PROD ? `${API_BASE_URL}/api/users/status` : API_BASE_URL;

        const response = await axios.get(endpoint, {
            timeout: 5000,  // 5 second timeout for slower server startup
            validateStatus: () => true, // Accept any status code
        });

        // Consider the API available if we got any response at all
        return response.status < 500;
    } catch (error) {
        console.warn('Backend server not available:', error.message);
        return false;
    }
};

// Initialize our API with proper error handling
export const initializeApi = async () => {
    const isBackendAvailable = await checkBackendStatus();

    if (!isBackendAvailable) {
        console.warn('Using Firebase authentication fallback mode (backend unavailable)');
    }

    return {
        isBackendAvailable,
        message: isBackendAvailable
            ? 'Connected to backend server'
            : 'Backend server unavailable - Firebase authentication will be used for login'
    };
};
