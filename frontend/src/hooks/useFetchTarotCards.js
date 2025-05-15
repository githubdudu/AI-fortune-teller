import { useState, useCallback, useEffect } from 'react';
import { tarotCardService } from '../utils/apiClient';

/**
 * Custom hook for fetching tarot cards
 * @param {number} limit - Number of cards to fetch
 * @returns {Object} Cards data, loading state, and control functions
 */
const useFetchTarotCards = (limit = 5) => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch random cards from the API
   */
  const fetchCards = useCallback(async () => {
    setIsLoading(true);

    try {
      const cardsData = await tarotCardService.fetchRandomCards(limit);
      setCards(cardsData);
      console.log('Cards fetched:', cardsData);

      // Add a delay before showing cards to allow for animation
      setTimeout(() => setIsLoading(false), 2000);
    } catch (err) {
      console.error('Error in useFetchTarotCards:', err);
      setError(err);
      setIsLoading(false);
    }
  }, [limit]);

  // Fetch cards on mount
  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return {
    cards,
    isLoading,
    error,
    fetchCards,
    setIsLoading,
  };
};

export default useFetchTarotCards;
