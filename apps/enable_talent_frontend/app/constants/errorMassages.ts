export const ERROR_MESSAGES = Object.freeze({
  409: 'An account with this email already exists.',
  400: 'Invalid signup information. Please check your details.',
  429: 'Too many signup attempts. Please try again later.',
  500: 'Server error. Please try again later.',
});

export const LOGIN_ERROR_MESSAGES = {
  401: 'Invalid email or password. Please try again.',
  429: 'Too many login attempts. Please try again later.',
  500: 'Server error. Please try again later.',
};
