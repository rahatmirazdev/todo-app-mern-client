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
        console.log('Checking backend status at:', API_BASE_URL);

        // Try multiple different approaches to handle potential CORS issues
        try {
            // First try a simple GET request to the root
            const response = await axios.get(API_BASE_URL, {
                timeout: 8000,  // 8 second timeout for render.com cold start
                validateStatus: () => true, // Accept any status code
                withCredentials: false, // Don't send cookies for the status check
            });

            console.log('Backend response status:', response.status);
            if (response.status < 400) {
                return true;
            }
        } catch (firstError) {
            console.log('First check failed:', firstError.message);
        }

        // If that fails, try a different approach with no-cors mode through a HEAD request
        try {
            const headResponse = await fetch(API_BASE_URL, {
                method: 'HEAD',
                mode: 'no-cors', // This might help with CORS preflight issues
            });
            console.log('HEAD response received');
            return true; // If we get here without error, connection is likely good
        } catch (secondError) {
            console.log('Second check failed:', secondError.message);
        }

        // As a last resort, try fetching via a proxy if available in development mode
        if (!import.meta.env.PROD) {
            try {
                const proxyResponse = await axios.get('/api/users/status', {
                    timeout: 5000,
                });
                console.log('Proxy check succeeded');
                return true;
            } catch (thirdError) {
                console.log('Proxy check failed:', thirdError.message);
            }
        }

        // If all checks fail, return false
        return false;
    } catch (error) {
        console.warn('Backend server not available:', error.message);
        console.error('Error details:', error);
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
