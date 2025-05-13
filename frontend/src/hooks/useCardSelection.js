import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing tarot card selection
 * @param {number} maxCards - Maximum number of cards that can be selected
 * @returns {Object} Card selection state and handlers
 */
const useCardSelection = (maxCards = 3) => {
  const [selectedCardsID, setSelectedCardsID] = useState([]);
  const [isSelectDisabled, setIsSelectDisabled] = useState(false);

  // Update disabled state when selection changes
  useEffect(() => {
    setIsSelectDisabled(selectedCardsID.length >= maxCards);
  }, [selectedCardsID, maxCards]);

  /**
   * Handle card selection
   * @param {number} cardId - ID of the card being selected
   */
  const handleCardSelect = useCallback(
    (cardId) => {
      // Prevent selection if already have max cards selected and this card is not already selected
      if (isSelectDisabled && !selectedCardsID.includes(cardId)) {
        return;
      }

      // Don't re-select an already selected card
      if (selectedCardsID.includes(cardId)) {
        return;
      }

      setSelectedCardsID((prevCards) => [...prevCards, cardId]);
    },
    [isSelectDisabled, selectedCardsID],
  );

  /**
   * Check if a card should be disabled based on selection state
   * @param {number} cardId - ID of the card to check
   * @returns {boolean} True if card should be disabled
   */
  const isCardDisabled = useCallback(
    (cardId) => {
      return isSelectDisabled && !selectedCardsID.includes(cardId);
    },
    [isSelectDisabled, selectedCardsID],
  );

  /**
   * Reset card selection
   */
  const resetSelection = useCallback(() => {
    setSelectedCardsID([]);
  }, []);

  return {
    selectedCardsID,
    isSelectDisabled,
    handleCardSelect,
    isCardDisabled,
    resetSelection,
  };
};

export default useCardSelection;
