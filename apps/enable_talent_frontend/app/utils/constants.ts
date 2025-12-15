/**
 * Application Constants
 *
 * Central location for all constant values used across the application.
 */

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/auth/login',
  ME: '/api/auth/me',
  LOGOUT: '/api/auth/logout',

  // Mentors
  MENTORS: '/api/mentors',
  MENTOR_BY_ID: (id: string | number) => `/api/mentors/${id}`,

  // User Profile
  PROFILE: '/api/profile',
  FOLLOWS: '/api/follows',

  // Sessions
  SESSIONS: '/api/sessions',
  SESSION_BY_ID: (id: string | number) => `/api/sessions/${id}`,
} as const;

/**
 * Routes
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  MENTORS: '/dashboard/mentors',
  MENTOR_DETAIL: (id: string | number) => `/dashboard/mentors/${id}`,
  MENTOR_BOOKING: (id: string | number) => `/dashboard/mentors/booking/${id}`,
  SESSIONS: '/dashboard/sessions',
  PROFILE: '/dashboard/user/profile',
  FOLLOWING: '/dashboard/user/following',
  SETTINGS: '/dashboard/user/settings',
  PRICING: '/dashboard/pricing',
  AVAILABILITY: '/dashboard/availability',
  USER_JOURNEY: '/journey/setup/user',
  MENTOR_JOURNEY: '/journey/setup/mentor',
} as const;

/**
 * User Roles
 */
export const USER_ROLES = {
  USER: 'User',
  MENTOR: 'Mentor',
  ADMIN: 'Admin',
} as const;

/**
 * Experience Levels
 */
export const EXPERIENCE_LEVELS = [
  { value: '0-1', label: '0-1 years (Just starting)' },
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5-10', label: '5-10 years' },
  { value: '10+', label: '10+ years' },
] as const;

/**
 * Timezones
 */
export const TIMEZONES = [
  { value: 'EST', label: 'EST (Eastern Standard Time)' },
  { value: 'CST', label: 'CST (Central Standard Time)' },
  { value: 'MST', label: 'MST (Mountain Standard Time)' },
  { value: 'PST', label: 'PST (Pacific Standard Time)' },
  { value: 'GMT', label: 'GMT (Greenwich Mean Time)' },
  { value: 'CET', label: 'CET (Central European Time)' },
  { value: 'IST', label: 'IST (Indian Standard Time)' },
  { value: 'JST', label: 'JST (Japan Standard Time)' },
] as const;

/**
 * Session Frequencies
 */
export const SESSION_FREQUENCIES = [
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Bi-weekly', label: 'Bi-weekly' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'As needed', label: 'As needed' },
] as const;

/**
 * Budget Ranges
 */
export const BUDGET_RANGES = [
  { value: '0-50', label: '$0-$50' },
  { value: '50-100', label: '$50-$100' },
  { value: '100-200', label: '$100-$200' },
  { value: '200+', label: '$200+' },
] as const;

/**
 * Learning Styles
 */
export const LEARNING_STYLES = [
  { value: '1-on-1', label: 'One-on-one mentoring' },
  { value: 'structured', label: 'Structured courses' },
  { value: 'discussion', label: 'Discussion & feedback' },
  { value: 'practical', label: 'Hands-on projects' },
] as const;

/**
 * Areas of Interest
 */
export const AREAS_OF_INTEREST = [
  { value: 'Technical Skills', label: 'Technical Skills' },
  { value: 'Career Strategy', label: 'Career Strategy' },
  { value: 'Leadership', label: 'Leadership & Management' },
  { value: 'Entrepreneurship', label: 'Entrepreneurship' },
  { value: 'Work-Life Balance', label: 'Work-Life Balance' },
] as const;

/**
 * Rating Thresholds
 */
export const RATING_FILTERS = [
  { value: 0, label: 'Any' },
  { value: 4, label: '4.0+' },
  { value: 4.5, label: '4.5+' },
  { value: 4.8, label: '4.8+' },
] as const;

/**
 * Default Values
 */
export const DEFAULTS = {
  AVATAR: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
  MENTOR_AVATAR: 'https://randomuser.me/api/portraits/men/1.jpg',
  COVER_IMAGE: 'https://images.unsplash.com/photo-1503264116251-35a269479413',
  CURRENCY: 'USD',
  PAGE_SIZE: 20,
  MAX_PROFILE_BIO_LENGTH: 500,
  MAX_HEADLINE_LENGTH: 100,
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LAST_ROUTE: 'last_route',
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  LOGIN_FAILED: 'Login failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  LOAD_MENTORS_FAILED: 'Failed to load mentors',
  LOAD_PROFILE_FAILED: 'Failed to load profile',
  LOAD_SESSIONS_FAILED: 'Failed to load sessions',
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
  SESSION_BOOKED: 'Session booked successfully!',
} as const;
