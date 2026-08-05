import { useState, useCallback, useEffect } from 'react';
import { tarotCardService } from '../utils/apiClient';

/**
 * Custom hook for fetching tarot cards
 * @param {number} limit - Number of cards to fetch
 * @returns {Object} Cards data, loading state, and control functions
 */
const useFetchTarotCards = (limit = 5) => {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);

  /**
   * Fetch random cards from the API
   */
  const fetchCards = useCallback(async () => {
    setError(null);

    try {
      const cardsData = await tarotCardService.fetchRandomCards(limit);
      setCards(cardsData);
      console.log('Cards fetched:', cardsData);
    } catch (err) {
      console.error('Error in useFetchTarotCards:', err);
      setError(err);
      // Still show the demo cards the API layer prepared, if any
      setCards(err.fallbackCards || []);
    }
  }, [limit]);

  // Fetch cards on mount
  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return {
    cards,
    error,
  };
};

export default useFetchTarotCards;
