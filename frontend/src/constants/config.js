/**
 * Global configuration settings for the application
 */

// API Configuration
export const API_CONFIG = {
  USE_API_THEMES: true, // Set to false to use hardcoded themes
  BASE_URL: 'http://localhost:5000/api/v1', // Base API URL
  ENDPOINTS: {
    THEMES: '/Themes', // Endpoint for themes
    LOGIN: '/auth/login',
  },
};
