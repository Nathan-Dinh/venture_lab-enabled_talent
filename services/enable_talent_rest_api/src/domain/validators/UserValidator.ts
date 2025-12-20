/**
 * User Validator
 * Contains business rules and validation logic for users
 */
export class UserValidator {
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   * Must be at least 8 characters with uppercase, lowercase, and number
   */
  static isValidPassword(password: string): boolean {
    if (password.length < 8) return false;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return hasUpperCase && hasLowerCase && hasNumber;
  }

  /**
   * Validate name
   */
  static isValidName(name: string): boolean {
    return name.trim().length >= 2 && name.trim().length <= 100;
  }

  /**
   * Validate headline
   */
  static isValidHeadline(headline: string): boolean {
    return headline.trim().length >= 5 && headline.trim().length <= 200;
  }

  /**
   * Validate bio
   */
  static isValidBio(bio: string): boolean {
    return bio.trim().length >= 10 && bio.trim().length <= 2000;
  }

  /**
   * Validate location
   */
  static isValidLocation(location: string): boolean {
    return location.trim().length >= 2 && location.trim().length <= 100;
  }

  /**
   * Validate profile image URL
   */
  static isValidProfileImageUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get password strength score (0-4)
   */
  static getPasswordStrength(password: string): number {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return Math.min(score, 4);
  }
}
