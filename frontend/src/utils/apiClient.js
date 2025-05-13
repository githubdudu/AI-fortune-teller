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
   * Get a reading interpretation based on selected cards
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
};

export default apiClient;
