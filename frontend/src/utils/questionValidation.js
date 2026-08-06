/**
 * Question length validation that works for both space-delimited languages
 * (English, French, ...) and scripts written without spaces between words
 * (Chinese, Japanese, Korean).
 *
 * Splitting on /\s+/ counts a whole Chinese sentence as a single "word", so a
 * perfectly complete question like "我最近的事业运势如何？" would be rejected.
 * Instead we count "meaningful units": one per space-delimited word, and one
 * per CHARS_PER_WORD characters of a scriptless language.
 */

// Han (Chinese / kanji), kana and Hangul are written without word separators.
const SCRIPTLESS_CHAR =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu;

// A word is a run of letters/digits, so punctuation and emoji don't count.
const WORD = /[\p{L}\p{N}][\p{L}\p{N}'’._-]*/gu;

// Rough average word length in Chinese/Japanese/Korean, used to convert a
// character count into a comparable word count.
const CHARS_PER_WORD = 2;

/**
 * Counts how many word-equivalents a question contains.
 * @param {string} text - Raw user input
 * @returns {number} Word count, where CJK characters count as fractions of a word
 */
export const countMeaningfulUnits = (text) => {
  if (!text) return 0;

  const scriptlessChars = text.match(SCRIPTLESS_CHAR) ?? [];
  // Replace them with spaces so the remaining text still tokenises correctly.
  const remainder = text.replace(SCRIPTLESS_CHAR, ' ');
  const words = remainder.match(WORD) ?? [];

  return words.length + scriptlessChars.length / CHARS_PER_WORD;
};

/**
 * Checks whether a question is substantial enough to submit.
 * @param {string} text - Raw user input
 * @param {number} [minUnits] - Minimum number of word-equivalents required
 * @returns {boolean} True if the question looks complete enough
 */
export const isMeaningfulQuestion = (text, minUnits = 4) =>
  countMeaningfulUnits(text.trim()) >= minUnits;
