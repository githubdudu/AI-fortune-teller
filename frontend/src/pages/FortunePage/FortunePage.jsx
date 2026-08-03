import Card from './components/Card';
import './FortunePage.css';
import { useNavigate } from 'react-router-dom';
import { Button, Box } from 'gestalt';
import React, { useState, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';
import ErrorMessage from './components/ErrorMessage';
import { AppContext } from '../../context/AppContextProvider';
import useCardSelection from '../../hooks/useCardSelection';
import useFetchTarotCards from '../../hooks/useFetchTarotCards';
import { useFortuneStream } from '../../hooks/useFortuneStream';
import { markdownToHtml, createMarkup } from '../../utils/markdownUtils';

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
const CardsDisplay = ({ cards, onCardSelect, selectionMark }) => {
  return (
    <div className="card-container relative flex w-full justify-between gap-4 my-10">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className="min-w-0 shrink flex flex-col items-center"
          onClick={() => onCardSelect(card.id, index)}
        >
          <Card
            backImage="/cards/back-416.webp"
            backImageSmall="/cards/back-240.webp"
            frontImage={card.imageSource || '/defaultFrontCard.png'}
            isSelected={selectionMark[index]}
            name={card.name}
            description={card.description}
            cardNumber={selectionMark.indexOf(true) + 1}
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
  selectionMark: PropTypes.arrayOf(PropTypes.bool).isRequired,
};

/**
 * Card selection screen
 */
const SelectionDisplay = ({
  cards,
  taroCardsError,
  streamError,
  selectionMark,
  handleCardSelect,
  handleReadButton,
}) => {
  // Local click handler without event parameter
  const onReadButtonClick = () => {
    console.log(
      'Read button clicked with selected cards:',
      cards.filter((card, index) => selectionMark[index]),
    );
    handleReadButton();
  };

  return (
    <div className="selection-container flex flex-col items-center p-5 max-w-screen sm:w-xl md:w-2xl lg:w-4xl xl:w-6xl min-h-[70vh]">
      <h1 className="selection-title mb-5 text-3xl md:text-4xl text-center font-bold font-cormorant text-ink-900">
        Select Three Cards for your Reading
      </h1>

      {taroCardsError && (
        <ErrorMessage
          message="Could not fetch cards from server. Using demo cards instead."
          type="warning"
        />
      )}

      {streamError && <ErrorMessage message={streamError} type="error" />}

      <CardsDisplay
        cards={cards}
        onCardSelect={handleCardSelect}
        selectionMark={selectionMark}
      />

      <div className="action-container">
        {selectionMark.filter((mark) => mark).length === 3 ? (
          <Button
            text="See Your Reading"
            name="edit-button"
            color="blue"
            onClick={onReadButtonClick}
            size="lg"
            accessibilityLabel="Get your tarot reading"
            disabled={selectionMark.filter((mark) => mark).length !== 3}
          />
        ) : (
          <div className="cards-remaining px-5 py-2 mb-2 rounded-full shadow-lg bg-mist-200 font-medium  text-ink-900">
            <span>
              {3 - selectionMark.filter((mark) => mark).length} cards remaining
            </span>
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
  taroCardsError: PropTypes.object,
  streamError: PropTypes.string,
  selectionMark: PropTypes.arrayOf(PropTypes.bool).isRequired,
  handleCardSelect: PropTypes.func.isRequired,
  handleReadButton: PropTypes.func.isRequired,
};

/**
 * Reading results screen
 */
const ResultsDisplay = ({
  readingResult,
  userChosenCards,
  onNewReading,
  isStreamLoading,
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

      {isStreamLoading && (
        <div className="loading-wrapper">
          <LoadingAnimation />
        </div>
      )}

      {!isStreamLoading && (
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
  isStreamLoading: PropTypes.bool,
};

/**
 * Main FortunePage component
 */
const FortunePage = () => {
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AppContext provides user theme, prompt, and methods to save/clear reading results
  const {
    saveUserChosenCards,
    userChosenTheme,
    userPrompt,
    clearQuestionAndTheme,
    userChosenCards,
  } = useContext(AppContext);

  // Streaming state is local to this page so chunk updates don't re-render the app
  const {
    streamingText,
    streamLoading: isStreamLoading,
    streamError,
    startFortuneStream,
  } = useFortuneStream();

  // Use custom hooks for cards and selection
  const {
    cards,
    isLoading: isCardsLoading,
    error: taroCardsError,
    fetchCards,
  } = useFetchTarotCards(5);
  const { selectedCounts, selectionMark, handleCardSelect } = useCardSelection(
    cards.length,
    3,
  );

  /**
   * Handle reading button click
   */
  const handleReadButton = useCallback(async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;

    // Set submitting state
    setIsSubmitting(true);

    console.log('Read button clicked - processing reading request');

    // Handle case when no cards are selected (fallback to defaults)
    if (!selectedCounts) {
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

      saveUserChosenCards(defaultCards);
      setShowResults(true);
      setIsSubmitting(false);
      return;
    }

    // Save the selected cards to context first (before streaming starts)
    const selectedCards = cards.filter((card, index) => selectionMark[index]);
    saveUserChosenCards(selectedCards);

    // Switch to results view immediately with loading state
    setShowResults(true);

    // Store current selection data for async callback
    const currentCardIds = selectedCards.map((card) => card.id);
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
    selectedCounts,
    userPrompt,
    userChosenTheme,
    saveUserChosenCards,
    startFortuneStream,
    cards,
    selectionMark,
  ]);

  /**
   * Reset all state for a new reading
   */
  const handleNewReading = useCallback(() => {
    // Reset context
    clearQuestionAndTheme();
    saveUserChosenCards(null);

    // Reset component state
    setShowResults(false);

    // Get new cards
    fetchCards();

    // Navigate back to landing page
    navigate('/');
  }, [clearQuestionAndTheme, saveUserChosenCards, fetchCards, navigate]);

  // Show loading animation when fetching cards or submitting reading request
  if (isCardsLoading || (isSubmitting && !showResults)) {
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
        readingResult={streamingText || ''}
        userChosenCards={userChosenCards}
        onNewReading={handleNewReading}
        isStreamLoading={isStreamLoading}
      />
    );
  }

  // Show card selection
  return (
    <SelectionDisplay
      cards={cards}
      taroCardsError={taroCardsError}
      streamError={streamError}
      selectionMark={selectionMark}
      handleCardSelect={handleCardSelect}
      handleReadButton={handleReadButton}
    />
  );
};

export default FortunePage;
