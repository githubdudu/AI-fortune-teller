import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing tarot card selection
 * @typedef {Object} Card - Tarot card object
 * @property {number} id - Unique ID
 * @property {string} name - Card name
 * @property {string} description - Card description
 * @property {string} imageSource - URL
 *
 * @param {Card[]} cards - Array of cards available for selection
 * @param {number} maxSelection - Maximum number of cards that can be selected
 * @returns {{selectedCounts: number, selectionMark: boolean[], handleCardSelect: (cardId: number, index: number) => boolean}}
 */
const useCardSelection = (cards, maxSelection = 3) => {
  const totalCounts = cards.length;

  const [selectedCounts, setSelectedCounts] = useState(0);
  const [selectionMark, setSelectionMark] = useState(
    Array(totalCounts).fill(false),
  );

  useEffect(() => {
    setSelectionMark(Array(totalCounts).fill(false));
    setSelectedCounts(0);
  }, [totalCounts]);

  /**
   * Handle card selection
   * @param {number} cardId - ID of the card being selected
   * @param {number} index - Index of the card in the selection array
   * @returns {boolean} True if selection was successful, false otherwise
   */
  const handleCardSelect = useCallback(
    (cardId, index) => {
      // Toggle selected cards
      if (selectionMark[index]) {
        setSelectionMark((prevMark) =>
          prevMark.map((mark, i) => (i === index ? false : mark)),
        );
        setSelectedCounts((prevCounts) => prevCounts - 1);
        return true;
      }

      if (!selectionMark[index] && selectedCounts < maxSelection) {
        setSelectionMark((prevMark) =>
          prevMark.map((mark, i) => (i === index ? true : mark)),
        );
        setSelectedCounts((prevCounts) => prevCounts + 1);
        return true;
      }

      return false;
    },
    [selectionMark, selectedCounts, maxSelection],
  );

  return {
    selectedCounts,
    selectionMark,
    handleCardSelect,
  };
};

export default useCardSelection;
