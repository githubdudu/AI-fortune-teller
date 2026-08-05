import { Box, Button } from 'gestalt';
import PropTypes from 'prop-types';
import { NavLink, Navigate } from 'react-router-dom';
import { useState, useContext, useCallback } from 'react';

import LoadingAnimation from '$/components/LoadingAnimation/LoadingAnimation';
import ErrorMessage from './components/ErrorMessage';

import { markdownToHtml, createMarkup } from '$/utils/markdownUtils';
import { AppContext } from '$/context/AppContextProvider';
import { useFortuneStream } from '$/hooks/useFortuneStream';
import './ReadingView.css';

/**
 * Reading results screen
 */
const ReadingView = ({ selectedCardIds }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AppContext provides user theme, prompt, and methods to save/clear reading results
  const { userChosenTheme, userPrompt } = useContext(AppContext);

  // Streaming state is local to this page so chunk updates don't re-render the app
  const {
    streamingText: readingResult = '',
    streamLoading: isStreamLoading,
    streamError,
    startFortuneStream,
  } = useFortuneStream();

  /**
   * Handle reading button click
   */
  const handleReadButton = useCallback(async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;

    // Set submitting state
    setIsSubmitting(true);

    console.log('Read button clicked - processing reading request');

    const currentPrompt = userPrompt || '';
    const currentTheme = userChosenTheme?.id || null;

    // Add a small delay to ensure state updates complete before starting stream
    // This helps prevent the "Component unmounted" issue during navigation
    setTimeout(() => {
      // Only start stream if component is still mounted
      console.log('Component is mounted, starting stream');
      startFortuneStream({
        cardIds: selectedCardIds,
        question: currentPrompt,
        themeId: currentTheme,
      });
    }, 150);
  }, [
    isSubmitting,
    userPrompt,
    userChosenTheme,
    startFortuneStream,
    selectedCardIds,
  ]);

  if (!selectedCardIds.length) return <Navigate to="/fortune" replace />;

  return (
    <div className="results-container contents">
      <h1 className="reading-title order-0 text-4xl font-bold font-cormorant text-ink-800">
        Your ArcanaVerse Reading
      </h1>

      <p className="reading-subtitle-text mt-1 mb-15 font-cormorant text-xl text-ink-700">
        The cards have spoken. Here is your path forward.
      </p>

      <div className="order-2 flex flex-col items-center w-full">
        {streamError && <ErrorMessage message={streamError} type="error" />}

        <Button
          text="See Your Reading"
          name="edit-button"
          color="blue"
          onClick={handleReadButton}
          size="lg"
          accessibilityLabel="Get your tarot reading"
        />

        {isStreamLoading && <LoadingAnimation />}

        {!isStreamLoading && (
          <ReadingInterpretationDisplay readingText={readingResult} />
        )}

        {/* Button to start a new reading */}
        <NavLink to="/" prefetch="intent">
          <Box marginTop={2} display="flex" justifyContent="center">
            <Button
              text="Reveal Another Reading"
              name="edit-button"
              size="lg"
              color="red"
            />
          </Box>
        </NavLink>
      </div>
    </div>
  );
};

ReadingView.propTypes = {
  selectedCardIds: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  ).isRequired,
};

/**
 * Displays reading interpretation with markdown formatting
 */
const ReadingInterpretationDisplay = ({ readingText }) => {
  // Convert markdown text to HTML
  const htmlContent = markdownToHtml(readingText);

  return (
    <div className="interpretation-box w-full max-w-3xl min-h-40 mx-auto mb-2 p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-sm">
      <h2 className="interpretation-title text-xl font-bold text-mist-800 mb-3">
        ✦ Interpretation ✦
      </h2>
      <div
        className="interpretation-text text-base text-mist-800 markdown-content"
        dangerouslySetInnerHTML={createMarkup(htmlContent)}
      />
    </div>
  );
};

ReadingInterpretationDisplay.propTypes = {
  readingText: PropTypes.string.isRequired,
};

export default ReadingView;
