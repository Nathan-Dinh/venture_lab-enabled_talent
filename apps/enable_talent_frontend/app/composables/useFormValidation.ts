/**
 * Form Validation Composable
 *
 * Provides reusable validation functions for forms.
 * Ready to be extended with backend validation rules when API is implemented.
 */

export interface ValidationResult {
  isValid: boolean;
  error: string;
}

/**
 * Validates email format
 * @param email - Email string to validate
 * @returns Validation result with error message if invalid
 */
export function useEmailValidation() {
  const validateEmail = (email: string): ValidationResult => {
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }

    // TODO: Add backend email validation check when API is ready
    // This would check if email exists, is verified, etc.

    return { isValid: true, error: '' };
  };

  return { validateEmail };
}

/**
 * Validates password strength
 * @param password - Password string to validate
 * @returns Validation result with strength indicator
 */
export function usePasswordValidation() {
  const validatePassword = (password: string): ValidationResult & { strength: 'weak' | 'medium' | 'strong' | null } => {
    if (!password) {
      return { isValid: false, error: 'Password is required', strength: null };
    }

    if (password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters', strength: 'weak' };
    }

    // Calculate password strength
    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strengthScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

    if (strengthScore >= 3 && password.length >= 12) {
      strength = 'strong';
    } else if (strengthScore >= 2 && password.length >= 8) {
      strength = 'medium';
    }

    // TODO: Add backend password policy validation when API is ready
    // This would check against compromised passwords, enforce company policies, etc.

    return { isValid: true, error: '', strength };
  };

  return { validatePassword };
}

/**
 * Generic form field validation
 * @param value - Field value to validate
 * @param fieldName - Name of the field for error messages
 * @param minLength - Minimum length requirement
 */
export function useFieldValidation() {
  const validateRequired = (value: string, fieldName: string): ValidationResult => {
    if (!value || value.trim().length === 0) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    return { isValid: true, error: '' };
  };

  const validateMinLength = (value: string, minLength: number, fieldName: string): ValidationResult => {
    if (value.length < minLength) {
      return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
    }
    return { isValid: true, error: '' };
  };

  return { validateRequired, validateMinLength };
}
