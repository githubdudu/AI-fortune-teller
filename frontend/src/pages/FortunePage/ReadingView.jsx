import { Box, Button } from 'gestalt';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { useState, useContext, useCallback } from 'react';

import Card from './components/Card';
import LoadingAnimation from '$/components/LoadingAnimation/LoadingAnimation';
import ErrorMessage from './components/ErrorMessage';

import { markdownToHtml, createMarkup } from '$/utils/markdownUtils';
import { AppContext } from '$/context/AppContextProvider';
import { useFortuneStream } from '$/hooks/useFortuneStream';

/**
 * Reading results screen
 */
const ReadingView = ({ userChosenCards }) => {
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

    // Store current selection data for async callback
    const currentCardIds = userChosenCards.map((card) => card.id);
    const currentPrompt = userPrompt || '';
    const currentTheme = userChosenTheme?.id || null;

    // Add a small delay to ensure state updates complete before starting stream
    // This helps prevent the "Component unmounted" issue during navigation
    setTimeout(() => {
      // Only start stream if component is still mounted
      console.log('Component is mounted, starting stream');
      startFortuneStream({
        cardIds: currentCardIds,
        question: currentPrompt,
        themeId: currentTheme,
      });
    }, 150);
  }, [
    isSubmitting,
    userPrompt,
    userChosenTheme,
    startFortuneStream,
    userChosenCards,
  ]);

  // Show loading animation when fetching cards or submitting reading request
  if (isSubmitting) {
    return (
      <div className="selection-container">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="results-container">
      <h1 className="reading-title"> Your ArcanaVerse Reading </h1>

      <Box className="reading-subtitle-wrapper">
        <p className="reading-subtitle-text">
          The cards have spoken. Here is your path forward.
        </p>
      </Box>

      <SelectedCardsDisplay cards={userChosenCards} />

      {streamError && <ErrorMessage message={streamError} type="error" />}

      <Button
        text="See Your Reading"
        name="edit-button"
        color="blue"
        onClick={handleReadButton}
        size="lg"
        accessibilityLabel="Get your tarot reading"
      />

      {isStreamLoading && (
        <div className="loading-wrapper">
          <LoadingAnimation />
        </div>
      )}

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
  );
};

ReadingView.propTypes = {
  userChosenCards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string,
      description: PropTypes.string,
      imageSource: PropTypes.string,
    }),
  ),
};

/**
 * Displays the cards selected for the reading
 */
const SelectedCardsDisplay = ({ cards }) => {
  return (
    <div className="selected-cards-display">
      {cards?.map((card, index) => (
        <div key={card.id}>
          <Card
            frontImage={card.imageSource || '/defaultFrontCard.png'}
            isShowFront={true}
            name={card.name}
            description={card.description}
            index={index}
          />
        </div>
      ))}
    </div>
  );
};

SelectedCardsDisplay.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string,
      description: PropTypes.string,
      imageSource: PropTypes.string,
    }),
  ),
};

/**
 * Displays reading interpretation with markdown formatting
 */
const ReadingInterpretationDisplay = ({ readingText }) => {
  // Convert markdown text to HTML
  const htmlContent = markdownToHtml(readingText);

  return (
    <div className="interpretation-box">
      <h2 className="interpretation-title">✦ Interpretation ✦</h2>
      <div
        className="interpretation-text markdown-content"
        dangerouslySetInnerHTML={createMarkup(htmlContent)}
      />
    </div>
  );
};

ReadingInterpretationDisplay.propTypes = {
  readingText: PropTypes.string.isRequired,
};

export default ReadingView;
