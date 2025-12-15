/**
 * Error Handler Utilities
 *
 * Provides centralized error handling and logging functionality.
 */

import { ERROR_MESSAGES } from './constants';

export interface ApiError {
  status?: number;
  message: string;
  data?: any;
}

/**
 * Parse API error response and return user-friendly message
 *
 * @param error - Error object from API call
 * @returns User-friendly error message
 */
export const parseApiError = (error: any): string => {
  // Check for network errors
  if (!error) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // Check for status code errors
  if (error.status) {
    switch (error.status) {
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 500:
      case 502:
      case 503:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        break;
    }
  }

  // Check for custom error message from API
  if (error.data?.error) {
    return error.data.error;
  }

  if (error.data?.message) {
    return error.data.message;
  }

  if (error.message) {
    return error.message;
  }

  // Default error message
  return ERROR_MESSAGES.NETWORK_ERROR;
};

/**
 * Log error to console (and optionally to external service)
 *
 * @param error - Error to log
 * @param context - Additional context about where the error occurred
 */
export const logError = (error: any, context?: string): void => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    context,
    error: {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      ...error,
    },
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('Error occurred:', errorInfo);
  }

  // TODO: Send to external error tracking service (e.g., Sentry)
  // sendToErrorTracking(errorInfo);
};

/**
 * Handle API errors with consistent logging and user feedback
 *
 * @param error - Error from API call
 * @param context - Context about where the error occurred
 * @returns User-friendly error message
 */
export const handleApiError = (error: any, context?: string): string => {
  logError(error, context);
  return parseApiError(error);
};

/**
 * Check if error is a network error
 *
 * @param error - Error to check
 * @returns True if network error
 */
export const isNetworkError = (error: any): boolean => {
  return (
    !error ||
    error.message === 'Network Error' ||
    error.message === 'Failed to fetch' ||
    !navigator.onLine
  );
};

/**
 * Check if error is an authentication error
 *
 * @param error - Error to check
 * @returns True if authentication error
 */
export const isAuthError = (error: any): boolean => {
  return error?.status === 401 || error?.status === 403;
};

/**
 * Create a standardized error response
 *
 * @param message - Error message
 * @param status - HTTP status code
 * @param data - Additional error data
 * @returns Standardized error object
 */
export const createError = (message: string, status?: number, data?: any): ApiError => {
  return {
    message,
    status,
    data,
  };
};
