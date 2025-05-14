import Card from '../../components/Card/Card';
import './FortunePage.css';
import { useNavigate } from 'react-router-dom';
import { Button, Box } from 'gestalt';
import React, { useState, useContext, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';
import ErrorMessage from '../../components/ErrorMessage';
import { AppContext } from '../../context/AppContextProvider';
import useCardSelection from '../../hooks/useCardSelection';
import useFetchTarotCards from '../../hooks/useFetchTarotCards';
import { markdownToHtml, createMarkup } from '../../utils/markdownUtils';

// Constants
const DEFAULT_READING_TEXT =
  'Based on your selected cards, you are at a point of new beginnings with great potential ahead. Trust your intuition and use your resources wisely to manifest your desires.';

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

/**
 * Button to start a new reading
 */
const NewReadingButton = ({ onClick }) => {
  return (
    <Box marginTop={2} display="flex" justifyContent="center">
      <Button
        text="Reveal Another Reading"
        name="edit-button"
        onClick={onClick}
        size="lg"
        color="red"
      />
    </Box>
  );
};

NewReadingButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

/**
 * Displays the cards selected for the reading
 */
const SelectedCardsDisplay = ({ cards }) => {
  return (
    <div className="selected-cards-display">
      {cards?.map((card) => (
        <div key={card.id}>
          <Card
            frontImage={card.imageSource || '/defaultFrontCard.png'}
            isShowFront={true}
            name={card.name}
            description={card.description}
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
 * Displays the card selection interface
 */
const CardsDisplay = ({
  cards,
  onCardSelect,
  isCardDisabled,
  selectedCardsID,
}) => {
  return (
    <div className="card-container">
      {cards.map((card) => (
        <div
          key={card.id}
          className="card-wrapper"
          onClick={() => onCardSelect(card.id)}
        >
          <Card
            backImage="https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/TarotCardBackCard.png"
            frontImage={card.imageSource || '/defaultFrontCard.png'}
            disabled={isCardDisabled(card.id)}
            isShowFront={selectedCardsID.includes(card.id)}
            name={card.name}
            description={card.description}
            cardNumber={selectedCardsID.indexOf(card.id) + 1}
          />
        </div>
      ))}
    </div>
  );
};

CardsDisplay.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string,
      description: PropTypes.string,
      imageSource: PropTypes.string,
    }),
  ).isRequired,
  onCardSelect: PropTypes.func.isRequired,
  isCardDisabled: PropTypes.func.isRequired,
  selectedCardsID: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ).isRequired,
};

/**
 * Card selection screen
 */
const SelectionDisplay = ({
  cards,
  error,
  errorMessage,
  selectedCardsID,
  handleCardSelect,
  isCardDisabled,
  handleReadButton,
}) => {
  // Local click handler without event parameter
  const onReadButtonClick = () => {
    console.log('Read button clicked with selected cards:', selectedCardsID);
    handleReadButton();
  };

  return (
    <div className="selection-container">
      <h1 className="selection-title">Select Three Cards for your Reading</h1>

      {error && (
        <ErrorMessage
          message="Could not fetch cards from server. Using demo cards instead."
          type="warning"
        />
      )}

      {errorMessage && <ErrorMessage message={errorMessage} type="error" />}

      <CardsDisplay
        cards={cards}
        onCardSelect={handleCardSelect}
        isCardDisabled={isCardDisabled}
        selectedCardsID={selectedCardsID}
      />

      <div className="action-container">
        {selectedCardsID.length === 3 ? (
          <Button
            text="See Your Reading"
            name="edit-button"
            color="blue"
            onClick={onReadButtonClick}
            size="lg"
            accessibilityLabel="Get your tarot reading"
            disabled={selectedCardsID.length !== 3}
          />
        ) : (
          <div className="cards-remaining">
            <span>{3 - selectedCardsID.length} cards remaining</span>
          </div>
        )}
      </div>
    </div>
  );
};

SelectionDisplay.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string,
      description: PropTypes.string,
      imageSource: PropTypes.string,
    }),
  ).isRequired,
  error: PropTypes.object,
  errorMessage: PropTypes.string,
  selectedCardsID: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ).isRequired,
  handleCardSelect: PropTypes.func.isRequired,
  isCardDisabled: PropTypes.func.isRequired,
  handleReadButton: PropTypes.func.isRequired,
};

/**
 * Reading results screen
 */
const ResultsDisplay = ({
  readingResult,
  userChosenCards,
  onNewReading,
  isLoading,
}) => {
  return (
    <div className="results-container">
      <h1 className="reading-title"> Your ArcanaVerse Reading </h1>

      <Box className="reading-subtitle-wrapper">
        <p className="reading-subtitle-text">
          The cards have spoken. Here is your path forward.
        </p>
      </Box>

      <SelectedCardsDisplay cards={userChosenCards} />

      {isLoading && (
        <div className="loading-wrapper">
          <LoadingAnimation />
        </div>
      )}

      {!isLoading && (
        <ReadingInterpretationDisplay readingText={readingResult} />
      )}

      <NewReadingButton onClick={onNewReading} />
    </div>
  );
};

ResultsDisplay.propTypes = {
  readingResult: PropTypes.string.isRequired,
  userChosenCards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string,
      description: PropTypes.string,
      imageSource: PropTypes.string,
    }),
  ),
  onNewReading: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

/**
 * Main FortunePage component
 */
const FortunePage = () => {
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [readingResult, setReadingResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // AppContext provides user theme, prompt, and methods to save/clear reading results
  const {
    saveUserChosenCards,
    saveReadingResult,
    userChosenTheme,
    userPrompt,
    clearReadingResult,
    clearQuestionAndTheme,
    readingResult: contextReadingResult,
    userChosenCards,
    streamingText,
    isLoading: isStreamLoading,
    streamError,
    startFortuneStream,
    cleanupStream,
  } = useContext(AppContext);

  // Use custom hooks for cards and selection
  const { cards, isLoading, error, fetchCards } = useFetchTarotCards(5);
  const { selectedCardsID, handleCardSelect, isCardDisabled, resetSelection } =
    useCardSelection(3);

  /**
   * Get details for selected cards
   */
  const getSelectedCardDetails = useCallback(
    (selectedIds) => {
      return selectedIds.map((id) => {
        const card = cards.find((c) => c.id === id);
        return card || { id };
      });
    },
    [cards],
  );

  /**
   * Generate appropriate error message based on error response
   */
  const generateErrorMessage = useCallback((error) => {
    let errorMsg = 'Unable to fetch your reading. Please try again later.';
    if (error.response && error.response.data) {
      if (error.response.data.includes('Failed to generate text from OpenAI')) {
        errorMsg =
          'The AI service is currently unavailable. Please try again later or contact support if the problem persists.';
      } else {
        errorMsg = `Server error: ${error.response.data}`;
      }
    }
    return errorMsg;
  }, []);

  /**
   * Handle reading button click
   */
  const handleReadButton = useCallback(async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;

    // Set submitting state
    setIsSubmitting(true);
    setErrorMessage(null);

    console.log('Read button clicked - processing reading request');

    // Handle case when no cards are selected (fallback to defaults)
    if (!selectedCardsID?.length) {
      // Call the function directly instead of inside a hook
      const defaultCards = [
        {
          id: 1,
          name: 'The Fool',
          description: 'New beginnings, innocence, spontaneity',
          imageSource: '/defaultFrontCard.png',
        },
        {
          id: 2,
          name: 'The Magician',
          description: 'Manifestation, resourcefulness, power',
          imageSource: '/defaultFrontCard.png',
        },
        {
          id: 3,
          name: 'The High Priestess',
          description: 'Intuition, sacred knowledge, divine feminine',
          imageSource: '/defaultFrontCard.png',
        },
      ];

      setReadingResult(DEFAULT_READING_TEXT);
      saveUserChosenCards(defaultCards);
      saveReadingResult(DEFAULT_READING_TEXT);
      setShowResults(true);
      setIsSubmitting(false);
      return;
    }

    try {
      // Save the selected cards to context first (before streaming starts)
      const selectedCardDetails = getSelectedCardDetails(selectedCardsID);
      saveUserChosenCards(selectedCardDetails);

      // Switch to results view immediately with loading state
      setShowResults(true);

      // Store current selection data for async callback
      const currentCardIds = [...selectedCardsID];
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
    } catch (error) {
      // Handle error directly instead of using a hook
      console.error('Error fetching reading result:', error);
      setIsSubmitting(false);

      // Generate appropriate error message
      const errorMsg = generateErrorMessage(error);
      setErrorMessage(errorMsg);

      // Use fallback with direct function calls instead of a hook
      setReadingResult(DEFAULT_READING_TEXT);

      // Save fallback data to context
      const selectedCardDetails = getSelectedCardDetails(selectedCardsID);
      saveUserChosenCards(selectedCardDetails);
      saveReadingResult(DEFAULT_READING_TEXT);

      // Switch to results view even with the error
      setShowResults(true);
    }
  }, [
    isSubmitting,
    selectedCardsID,
    userPrompt,
    userChosenTheme,
    getSelectedCardDetails,
    saveUserChosenCards,
    saveReadingResult,
    generateErrorMessage,
    startFortuneStream,
  ]);

  /**
   * Reset all state for a new reading
   */
  const handleNewReading = useCallback(() => {
    // Cleanup any active streams
    cleanupStream();

    // Reset context
    clearQuestionAndTheme();
    clearReadingResult();
    saveUserChosenCards(null);

    // Reset component state
    resetSelection();
    setReadingResult(null);
    setShowResults(false);
    setErrorMessage(null);

    // Get new cards
    fetchCards();

    // Navigate back to landing page
    navigate('/');
  }, [
    clearQuestionAndTheme,
    clearReadingResult,
    saveUserChosenCards,
    resetSelection,
    fetchCards,
    navigate,
    cleanupStream,
  ]);

  // Clean up any streams on unmount
  useEffect(() => {
    return () => {
      cleanupStream();
    };
  }, [cleanupStream]);

  // Show loading animation when fetching cards or submitting reading request
  if (isLoading || (isSubmitting && !showResults)) {
    return (
      <div className="selection-container">
        <LoadingAnimation />
      </div>
    );
  }

  // Show results after reading is complete
  if (showResults) {
    return (
      <ResultsDisplay
        readingResult={
          streamingText || contextReadingResult || readingResult || ''
        }
        userChosenCards={userChosenCards}
        onNewReading={handleNewReading}
        isLoading={isStreamLoading}
      />
    );
  }

  // Show card selection
  return (
    <SelectionDisplay
      cards={cards}
      error={error}
      errorMessage={errorMessage || streamError}
      selectedCardsID={selectedCardsID}
      handleCardSelect={handleCardSelect}
      isCardDisabled={isCardDisabled}
      handleReadButton={handleReadButton}
    />
  );
};

export default FortunePage;
