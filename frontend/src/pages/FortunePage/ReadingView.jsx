import { Box, Button } from 'gestalt';
import PropTypes from 'prop-types';
import { NavLink, Navigate } from 'react-router-dom';
import { useState, useContext, useCallback } from 'react';

import LoadingAnimation from '$/components/LoadingAnimation/LoadingAnimation';
import ErrorMessage from './components/ErrorMessage';

import { markdownToHtml, createMarkup } from '$/utils/markdownUtils';
import { AppContext } from '$/context/AppContextProvider';
import { useFortuneStream } from '$/hooks/useFortuneStream';
import useStickToBottom from '$/hooks/useStickToBottom';
import { stoneClasses } from '$/constants/themeStone';
import './ReadingView.css';

/**
 * Reading results screen
 */
const ReadingView = ({ selectedCardIds }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRead, setHasRead] = useState(false);

  // AppContext provides user theme, prompt, and methods to save/clear reading results
  const { userChosenTheme, userPrompt } = useContext(AppContext);

  // Streaming state is local to this page so chunk updates don't re-render the app
  const {
    streamingText: readingResult = '',
    streamLoading: isStreamLoading,
    streamError,
    streamModel,
    startFortuneStream,
  } = useFortuneStream();

  // Follow the interpretation as it streams in; the page itself is the scroller
  useStickToBottom(readingResult, { active: hasRead && !streamError });

  /**
   * Handle reading button click
   */
  const handleReadButton = useCallback(async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;

    // Set submitting state
    setIsSubmitting(true);
    setHasRead(true);

    console.log('Read button clicked - processing reading request');

    const currentPrompt = userPrompt || '';
    const currentTheme = userChosenTheme?.id || null;

    // Started in the same tick as setHasRead so both land in one render —
    // deferring it let the interpretation box mount and repaint first
    startFortuneStream({
      cardIds: selectedCardIds,
      question: currentPrompt,
      themeId: currentTheme,
    });
  }, [
    isSubmitting,
    userPrompt,
    userChosenTheme,
    startFortuneStream,
    selectedCardIds,
  ]);

  // Keep the page reachable without cards while developing
  const isDevelopment =
    import.meta.env.DEV || import.meta.env.VITE_ENVIRONMENT === 'development';

  if (!selectedCardIds.length && !isDevelopment)
    return <Navigate to="/fortune" replace />;

  return (
    <div className="results-container contents">
      <h1 className="reading-title order-0 text-4xl font-bold font-cormorant text-ink">
        Your ArcanaVerse Reading
      </h1>

      <p className="reading-subtitle-text my-1 font-cormorant text-xl text-ink/70">
        The cards have spoken. Here is your path forward.
      </p>

      <div className="order-2 flex flex-col items-center w-full">
        {streamError && <ErrorMessage message={streamError} type="error" />}

        {!hasRead && (
          <Button
            text="See Your Reading"
            name="edit-button"
            color="blue"
            onClick={handleReadButton}
            size="lg"
            accessibilityLabel="Get your tarot reading"
          />
        )}

        {isStreamLoading && <LoadingAnimation />}
        {streamModel && (
          <p className="interpretation-model mt-4 text-xs text-ink/65 text-right">
            Channelled via {streamModel}
          </p>
        )}

        {hasRead && (
          <ReadingInterpretationDisplay readingText={readingResult} />
        )}

        {/* Button to start a new reading */}
        {hasRead && (
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
        )}
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

  // Read the theme here rather than take it as a prop: the box is rendered from
  // two places in this file and the accent should never be one of the two.
  const { userChosenTheme } = useContext(AppContext);

  return (
    <div
      /* The top edge repeats the chosen theme's stone, closing the loop that
         started on the theme card. `?.name` because a reading can be reached
         with no theme stored, and stoneClasses falls back to amethyst. */
      className={`interpretation-box w-full max-w-3xl min-h-40 mx-auto mb-2 p-6 rounded-2xl bg-bg/70 backdrop-blur-sm border border-ink/12 border-t-4 ${stoneClasses(userChosenTheme?.name).edge} shadow-sm`}
    >
      <h2 className="interpretation-title text-xl font-bold text-ink mb-3">
        ✦ Interpretation ✦
      </h2>
      <div
        className="interpretation-text text-base text-ink markdown-content"
        dangerouslySetInnerHTML={createMarkup(htmlContent)}
      />
    </div>
  );
};

ReadingInterpretationDisplay.propTypes = {
  readingText: PropTypes.string.isRequired,
};

export default ReadingView;
