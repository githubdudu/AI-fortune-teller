import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing tarot card selection
 * @param {number} totalCounts - Total number of cards available for selection
 * @param {number} maxSelection - Maximum number of cards that can be selected
 * @returns {Object} Card selection state and handlers
 */
const useCardSelection = (totalCounts, maxSelection = 3) => {
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
