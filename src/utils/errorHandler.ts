import { AxiosError } from 'axios';
import { APIErrorResponse } from '../types/api';

/**
 * Extract user-friendly error message from API error response
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<APIErrorResponse>;
    
    // Check for specific error responses
    if (axiosError.response?.data) {
      const data = axiosError.response.data;
      return data.message || data.error || data.detail || 'An error occurred';
    }
    
    // Check for network errors
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timeout. Please check your internet connection.';
    }
    
    if (axiosError.code === 'ERR_NETWORK') {
      return 'Network error. Please check your internet connection.';
    }
    
    // Check for HTTP status codes
    if (axiosError.response?.status === 401) {
      return 'Unauthorized. Please login again.';
    }
    
    if (axiosError.response?.status === 403) {
      return 'Access denied. You do not have permission to perform this action.';
    }
    
    if (axiosError.response?.status === 404) {
      return 'Resource not found.';
    }
    
    if (axiosError.response?.status === 500) {
      return 'Server error. Please try again later.';
    }
    
    // Generic axios error message
    return axiosError.message || 'An error occurred';
  }
  
  // Handle non-axios errors
  if (error instanceof Error) {
    return error.message;
  }
  
  // Fallback for unknown error types
  return 'An unexpected error occurred';
};

/**
 * Log error to console with context
 */
export const logError = (context: string, error: unknown): void => {
  console.error(`[${context}]`, error);
  
  if (error instanceof AxiosError) {
    console.error('Response data:', error.response?.data);
    console.error('Response status:', error.response?.status);
  }
};

/**
 * Check if error is due to network issues
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return (
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      error.message.includes('Network Error')
    );
  }
  return false;
};

/**
 * Check if error is authentication related
 */
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
};

