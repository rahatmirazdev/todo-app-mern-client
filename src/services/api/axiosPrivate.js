import axios from 'axios';

// Get base URL from environment variables or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || (
    import.meta.env.PROD
        ? 'https://todo-app-mern-server-a9rx.onrender.com'
        : ''  // Empty base URL to use the proxy in development
);

// Create an axios instance for authenticated API calls
const axiosPrivate = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedRequestsQueue = [];

const processFailedRequests = (token) => {
    failedRequestsQueue.forEach(request => {
        request.headers['Authorization'] = `Bearer ${token}`;
    });
    failedRequestsQueue = [];
};

// Add a request interceptor to add authorization header with token
axiosPrivate.interceptors.request.use(
    (config) => {
        // Only add the Authorization header if it doesn't exist already
        if (!config.headers['Authorization']) {
            // Get token from localStorage
            const token = localStorage.getItem('userToken');

            // If token exists, add it to the headers
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosPrivate.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 (Unauthorized) and we haven't tried refreshing token
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (error.response.data.message === 'Token expired' && !isRefreshing) {
                isRefreshing = true;
                originalRequest._retry = true; try {
                    // Try to refresh the token
                    const response = await axios.post(
                        `/api/auth/refresh-token`,
                        {},
                        { withCredentials: true }
                    );

                    const newAccessToken = response.data.token;

                    // Store the new token
                    localStorage.setItem('userToken', newAccessToken);

                    // Update the failed request with new token
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    // Process any queued requests with the new token
                    processFailedRequests(newAccessToken);

                    // Reset the flag
                    isRefreshing = false;

                    // Retry the original request with new token
                    return axiosPrivate(originalRequest);
                } catch (refreshError) {
                    // If refresh fails, logout the user
                    isRefreshing = false;
                    localStorage.removeItem('userInfo');
                    localStorage.removeItem('userToken');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else if (isRefreshing) {
                // Queue up requests while we're refreshing
                return new Promise((resolve) => {
                    failedRequestsQueue.push(originalRequest);
                    const interval = setInterval(() => {
                        if (!isRefreshing) {
                            clearInterval(interval);
                            resolve(axiosPrivate(originalRequest));
                        }
                    }, 100);
                });
            } else {
                // If not a token expiration issue or refresh already failed
                localStorage.removeItem('userInfo');
                localStorage.removeItem('userToken');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosPrivate;
