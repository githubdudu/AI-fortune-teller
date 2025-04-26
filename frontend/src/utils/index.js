// Example of utils
/**
 * Gets random item from array
 * @param {Array} array - Array to pick from
 */
export const getRandomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];
