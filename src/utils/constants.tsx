export const COLORS = {
  primary: '#0066cc',
  primaryDark: '#004d99',
  secondary: '#ff6600',
  success: '#28a745',
  error: '#dc3545',
  warning: '#ffc107',
  background: '#f5f5f5',
  white: '#ffffff',
  black: '#000000',
  gray: '#6c757d',
  lightGray: '#e9ecef',
  darkGray: '#343a40',
  border: '#ced4da',
  text: '#212529',
  textSecondary: '#6c757d',
  placeholder: '#adb5bd',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const STORAGE_KEYS = {
  USER_DATA: '@user_data',
  SESSION_TOKEN: '@session_token',
  REGISTRATION_DRAFT: '@registration_draft',
  FAILED_ATTEMPTS: '@failed_attempts',
  LOCKOUT_TIME: '@lockout_time',
};