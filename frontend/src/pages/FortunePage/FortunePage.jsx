import { useNavigate } from 'react-router-dom';
import React, { useState, useContext, useCallback } from 'react';

import './FortunePage.css';
import SelectionView from './SelectionView';
import ReadingView from './ReadingView';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';

import { AppContext } from '../../context/AppContextProvider';
import useCardSelection from '../../hooks/useCardSelection';
import useFetchTarotCards from '../../hooks/useFetchTarotCards';
import { useFortuneStream } from '../../hooks/useFortuneStream';

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
      <ReadingView
        readingResult={streamingText || ''}
        userChosenCards={userChosenCards}
        onNewReading={handleNewReading}
        isStreamLoading={isStreamLoading}
      />
    );
  }

  // Show card selection
  return (
    <SelectionView
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
