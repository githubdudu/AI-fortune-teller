// Example of utils
/**
 * Gets random item from array
 * @param {Array} array - Array to pick from
 */
export const getRandomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];

/**
 * Email validation function for onBlur event
 * @param {function} errorSetter - Error setter function
 */
export const validateEmail = (errorSetter) => (e) => {
  console.log('Validating email: ' + e.value);
  if (!e.value) {
    errorSetter('Email is required');
  } else if (!/\S+@\S+\.\S+/.test(e.value)) {
    errorSetter('Email is invalid');
  } else {
    errorSetter(null);
  }
};
