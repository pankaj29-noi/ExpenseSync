import axios from 'axios';
import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
        // console.log(' Token attached to request:', config.url);
      } else {
        // console.warn(' No session found for request:', config.url);
      }
    } catch (error) {
      // console.error('Error getting session:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // console.log(' Token expired, attempting refresh...');
        const { data: { session } } = await supabase.auth.refreshSession();
        
        if (session?.access_token) {
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
          // console.log(' Token refreshed, retrying request');
          return axiosInstance(originalRequest);
        } else {
          // Redirect to login if refresh fails
          // console.log(' Refresh failed, redirecting to login');
          window.location.href = '/log';
        }
      } catch (refreshError) {
        // console.error('Token refresh error:', refreshError);
        window.location.href = '/log';
      }
    }
    
    return Promise.reject(error);
  }
);
