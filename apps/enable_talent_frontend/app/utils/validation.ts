/**
 * Form Validation Utilities
 *
 * Provides reusable validation functions for forms across the application.
 */

/**
 * Validate email address format
 *
 * @param email - Email address to validate
 * @returns True if valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 *
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 *
 * @param password - Password to validate
 * @returns Object with isValid boolean and error message
 */
export const validatePassword = (
  password: string
): { isValid: boolean; error?: string } => {
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  return { isValid: true };
};

/**
 * Validate required field
 *
 * @param value - Value to check
 * @param fieldName - Name of the field for error message
 * @returns Object with isValid boolean and error message
 */
export const validateRequired = (
  value: any,
  fieldName: string
): { isValid: boolean; error?: string } => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
};

/**
 * Validate minimum length
 *
 * @param value - Value to check
 * @param minLength - Minimum required length
 * @param fieldName - Name of the field for error message
 * @returns Object with isValid boolean and error message
 */
export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string
): { isValid: boolean; error?: string } => {
  if (value.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }
  return { isValid: true };
};

/**
 * Validate maximum length
 *
 * @param value - Value to check
 * @param maxLength - Maximum allowed length
 * @param fieldName - Name of the field for error message
 * @returns Object with isValid boolean and error message
 */
export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string
): { isValid: boolean; error?: string } => {
  if (value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must be no more than ${maxLength} characters`,
    };
  }
  return { isValid: true };
};

/**
 * Validate URL format
 *
 * @param url - URL to validate
 * @returns True if valid, false otherwise
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate phone number (basic format)
 *
 * @param phone - Phone number to validate
 * @returns True if valid, false otherwise
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};
