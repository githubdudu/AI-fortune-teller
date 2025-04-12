import { useState, useCallback } from 'react';

/**
 * A simple hook to toggle a boolean state
 * @param {boolean} initialValue - Initial state value
 * @returns {[boolean, () => void]} State and toggle function
 */
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle];
};
