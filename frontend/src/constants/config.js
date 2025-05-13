/**
 * Global configuration settings for the application
 */

// API Configuration
export const API_CONFIG = {
  USE_API_THEMES: true, // Set to false to use hardcoded themes
  BASE_URL: 'http://localhost:5000/api/v1', // Base API URL
  ENDPOINTS: {
    // Authentication endpoints
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',

    // User endpoints
    USER: '/users', // Endpoint for user information
    USER_ME: '/users/me', // Endpoint for current user

    // Theme endpoints
    THEMES: '/Themes', // Endpoint for themes

    // Card endpoints
    CARDS: '/Cards',
    RANDOM_CARDS: '/Cards/random',

    // Fortune endpoints
    FORTUNES: '/Fortunes',
    FORTUNES_ASK: '/Fortunes/ask',
    FORTUNES_STREAM: '/Fortunes/stream', // Endpoint for streaming fortune readings
    DAILY_FORTUNES: '/DailyFortunes',
    DAILY_FORTUNES_ME: '/DailyFortunes/me',
  },
};
