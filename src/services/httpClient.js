import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Enable sending cookies with requests
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // The httpOnly cookie will be automatically included in requests
    // No need to manually set the Authorization header
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // For httpOnly cookies, we should call the backend logout endpoint
      // to clear the cookie properly
      // window.location.href = '/auth/sign-in';
    }
    
    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('Server Error:', error.response?.data);
      // You might want to show a notification or handle it in a specific way
    }

    return Promise.reject(error);
  }
);

// Generic HTTP methods
const httpClient = {
  /**
   * GET request
   * @param {string} url - The URL to send the request to
   * @param {Object} params - Query parameters
   */
  get: async (url, params = {}) => {
    try {
      return await axiosInstance.get(url, { params });
    } catch (error) {
      throw error;
    }
  },

  /**
   * POST request
   * @param {string} url - The URL to send the request to
   * @param {Object} data - The data to send
   */
  post: async (url, data = {}) => {
    try {
      return await axiosInstance.post(url, data);
    } catch (error) {
      throw error;
    }
  },

  /**
   * PUT request
   * @param {string} url - The URL to send the request to
   * @param {Object} data - The data to send
   */
  put: async (url, data = {}) => {
    try {
      return await axiosInstance.put(url, data);
    } catch (error) {
      throw error;
    }
  },

  /**
   * PATCH request
   * @param {string} url - The URL to send the request to
   * @param {Object} data - The data to send
   */
  patch: async (url, data = {}) => {
    try {
      return await axiosInstance.patch(url, data);
    } catch (error) {
      throw error;
    }
  },

  /**
   * DELETE request
   * @param {string} url - The URL to send the request to
   */
  delete: async (url) => {
    try {
      return await axiosInstance.delete(url);
    } catch (error) {
      throw error;
    }
  },
};

export default httpClient; 