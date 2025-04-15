import axios from 'axios';

// Get base URL from environment variables or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create an axios instance for public API calls (no auth required)
const axiosPublic = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Add a request interceptor if needed
axiosPublic.interceptors.request.use(
    (config) => {
        // You can modify request config here (like adding timestamps, etc.)
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor if needed
axiosPublic.interceptors.response.use(
    (response) => {
        // You can modify successful responses here
        return response;
    },
    (error) => {
        // Handle common errors here (like 404, 500, etc.)
        const customError = {
            message: error.response?.data?.message || 'Something went wrong',
            status: error.response?.status || 500,
            data: error.response?.data || null,
        };

        return Promise.reject(customError);
    }
);

export default axiosPublic;