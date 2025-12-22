import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout for video uploads
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

