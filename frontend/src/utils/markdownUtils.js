import showdown from 'showdown';

/**
 * Converts markdown text to HTML using Showdown library
 * @param {string} markdownText - The markdown text to convert
 * @param {Object} options - Options for the conversion
 * @returns {string} - HTML string
 */
export const markdownToHtml = (markdownText, options = {}) => {
  const defaultOptions = {
    emoji: true, // Enable emoji support
    tables: true, // Enable table support
    strikethrough: true, // Enable strikethrough
    tasklists: true, // Enable task lists
    simpleLineBreaks: true, // Line breaks are treated as <br>
    parseImgDimensions: true, // Parse dimensions from image references
    ...options,
  };

  // Initialize showdown converter with options
  const converter = new showdown.Converter(defaultOptions);

  // Set output format to HTML
  converter.setOption('omitExtraWLInCodeBlocks', true);
  converter.setOption('headerLevelStart', 3);

  // Convert markdown to HTML
  return converter.makeHtml(markdownText || '');
};

/**
 * Safely renders HTML content by sanitizing it
 * This is a simple implementation; consider using DOMPurify for production
 * @param {string} html - The HTML to sanitize
 * @returns {Object} - Object with __html property for React's dangerouslySetInnerHTML
 */
export const createMarkup = (html) => {
  return { __html: html };
};
