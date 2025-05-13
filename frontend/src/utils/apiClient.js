import axios from 'axios';
import { API_CONFIG } from '../constants/config';

// Create a configured instance of axios
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true, // Always include credentials (cookies)
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
});

// Store logout function when it's provided
let logoutHandler = null;

// Function to set the logout handler from AppContext
export const setLogoutHandler = (handler) => {
  logoutHandler = handler;
};

// Request interceptor for logging or adding dynamic headers
apiClient.interceptors.request.use(
  (config) => {
    // Log request details for debugging
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, {
      withCredentials: config.withCredentials,
      headers: config.headers,
    });

    // Always ensure withCredentials is true to send cookies with every request
    config.withCredentials = true;

    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  },
);

// Response interceptor for handling common response patterns
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} for ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        `API Error ${error.response.status} for ${error.config?.url}:`,
        error.response.data,
      );

      // Handle 401 Unauthorized errors globally
      if (error.response.status === 401) {
        console.log('Session expired or unauthorized. Logging out user.');

        // Execute logout if handler is available
        if (logoutHandler) {
          logoutHandler();

          // Optionally redirect to login page
          if (window && window.location && window.location.pathname !== '/') {
            window.location.href = '/';
          }
        } else {
          console.warn('No logout handler available to handle 401 error');
        }
      }

      // Handle 404 errors for user/me endpoint specifically
      if (
        error.response.status === 404 &&
        error.config?.url?.includes('/user/me')
      ) {
        console.log(
          'User not found (404). Logging out user and cleaning cookies.',
        );

        // Execute logout if handler is available to clean up app state and cookies
        if (logoutHandler) {
          logoutHandler();

          // Clear cookies related to authentication
          document.cookie.split(';').forEach((cookie) => {
            const [name] = cookie.split('=');
            document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
          });

          // Optionally redirect to login page
          if (window && window.location && window.location.pathname !== '/') {
            window.location.href = '/';
          }
        } else {
          console.warn(
            'No logout handler available to handle 404 error for user/me',
          );
        }
      }
    } else if (error.request) {
      console.error(
        `API Error (No Response) for ${error.config?.url}:`,
        error.request,
      );
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  },
);

/**
 * Tarot Card API Service
 */
export const tarotCardService = {
  /**
   * Fetch random cards for reading
   * @param {number} limit - Number of cards to fetch
   * @returns {Promise<Array>} - Array of card objects
   */
  fetchRandomCards: (limit = 5) => {
    return apiClient
      .get(API_CONFIG.ENDPOINTS.RANDOM_CARDS + `?limit=${limit}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error fetching random cards:', error);
        // Return fallback cards in case of error
        return [
          {
            id: 3,
            name: 'The High Priestess',
            imageSource:
              'https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20High%20Priestess%20(II).png',
          },
          {
            id: 4,
            name: 'The Empress',
            imageSource:
              'https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20Empress%20(III).png',
          },
          {
            id: 5,
            name: 'The Emperor',
            imageSource:
              'https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20Hierophant%20(V).png',
          },
        ];
      });
  },

  /**
   * Get a reading interpretation based on selected cards (non-streaming)
   * @param {Object} params - Reading request parameters
   * @param {Array<number>} params.cardIds - IDs of selected cards
   * @param {string} [params.question] - Optional user question
   * @param {number} [params.themeId] - Optional theme ID
   * @returns {Promise<Object>} - Reading result
   */
  getReading: ({ cardIds, question = '', themeId = null }) => {
    return apiClient
      .post(API_CONFIG.ENDPOINTS.FORTUNES_STREAM, {
        question,
        cardIds,
        themeId,
      })
      .then((response) => response.data);
  },

  /**
   * Get a streaming reading interpretation based on selected cards using SSE
   * Note: This function doesn't return a Promise, but instead uses callbacks to handle the stream.
   * Use the AppContext's streaming functionality to consume this properly.
   *
   * @param {Object} params - Stream request parameters
   * @param {Array<number>} params.cardIds - IDs of selected cards
   * @param {string} [params.question] - Optional user question
   * @param {number} [params.themeId] - Optional theme ID
   * @param {AbortSignal} [params.signal] - Optional AbortController signal to cancel the request
   * @param {Function} [params.onStreamStart] - Callback when stream starts
   * @param {Function} [params.onStreamError] - Callback when stream errors
   */
  streamReading: ({
    cardIds,
    question = '',
    themeId = null,
    signal = null,
    onStreamStart = null,
    onStreamError = null,
  }) => {
    // Using native fetch API for better streaming support
    return fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FORTUNES_STREAM}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({
          cardIds,
          question,
          themeId,
        }),
        credentials: 'include', // Include cookies
        signal: signal, // For aborting the request
      },
    )
      .then((response) => {
        if (!response.ok) {
          // Handle 401 errors in fetch API
          if (response.status === 401 && logoutHandler) {
            console.log(
              'Session expired or unauthorized (in stream). Logging out user.',
            );
            logoutHandler();

            // Optionally redirect to login page
            if (window && window.location && window.location.pathname !== '/') {
              window.location.href = '/';
            }
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        if (onStreamStart) {
          onStreamStart(response);
        }

        return response;
      })
      .catch((error) => {
        if (onStreamError) {
          onStreamError(error);
        } else {
          console.error('Streaming error:', error);
        }
      });
  },
};

export default apiClient;
