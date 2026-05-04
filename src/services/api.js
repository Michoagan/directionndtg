import axios from 'axios';

const baseURL = import.meta.env.PROD 
    ? 'https://schoolndtg.onrender.com/api' 
    : '/api';

const api = axios.create({
    baseURL: baseURL, // Uses real backend in production, and local proxy in development
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Important for Sanctum cookie
});

// Set to track pending mutating requests
const pendingRequests = new Set();

const generateRequestKey = (config) => {
    return `${config.method.toLowerCase()}:${config.url}`;
};

// Interceptor to add token and prevent duplicate submissions
api.interceptors.request.use((config) => {
    // Prevent duplicate requests for mutating methods
    if (['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
        const requestKey = generateRequestKey(config);
        
        if (pendingRequests.has(requestKey)) {
            // Cancel this duplicate request
            const controller = new AbortController();
            config.signal = controller.signal;
            controller.abort('Duplicate request prevented');
        } else {
            pendingRequests.add(requestKey);
            config.requestKey = requestKey;
        }
    }

    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        // Cleanup pending request
        if (response.config && response.config.requestKey) {
            pendingRequests.delete(response.config.requestKey);
        }
        return response;
    },
    (error) => {
        // Cleanup pending request on error
        if (error.config && error.config.requestKey) {
            pendingRequests.delete(error.config.requestKey);
        }

        // Silently drop canceled duplicate requests so they don't trigger error alerts
        if (axios.isCancel(error)) {
            return new Promise(() => {}); // Returns a promise that never resolves/rejects
        }

        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Auto logout on 401 (Unauthenticated) or 403 (Unauthorized Role)
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
