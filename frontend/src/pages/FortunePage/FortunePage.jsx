import { Routes, Route, useNavigate } from 'react-router-dom';
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
    // saveUserChosenCards, TODO: delete all of these
    userChosenTheme,
    userPrompt,
    // clearQuestionAndTheme, TODO: auto clear at home page, check usage
    // userChosenCards, TODO: delete the one in AppContext.
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
  } = useFetchTarotCards(5);
  const { selectionMark, handleCardSelect } = useCardSelection(cards, 3);

  /**
   * Handle reading button click
   */
  const handleReadButton = useCallback(async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;

    // Set submitting state
    setIsSubmitting(true);

    console.log('Read button clicked - processing reading request');

    // Save the selected cards to context first (before streaming starts)
    const selectedCards = cards.filter((card, index) => selectionMark[index]);

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
    userPrompt,
    userChosenTheme,
    startFortuneStream,
    cards,
    selectionMark,
  ]);

  /**
   * Reset all state for a new reading
   */
  const handleNewReading = useCallback(() => {
    // Reset component state
    setShowResults(false);

    // Navigate back to landing page
    navigate('/');
  }, [navigate]);

  // Show loading animation when fetching cards or submitting reading request
  if (isCardsLoading || (isSubmitting && !showResults)) {
    return (
      <div className="selection-container">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    // TODO: migrate to Outlet and useOutletContext when the props are less
    <Routes>
      <Route
        index
        element={
          <SelectionView
            cards={cards}
            taroCardsError={taroCardsError}
            selectionMark={selectionMark}
            handleCardSelect={handleCardSelect}
          />
        }
      />
      <Route
        path="reading"
        element={
          <ReadingView
            readingResult={streamingText || ''}
            userChosenCards={cards.filter(
              (card, index) => selectionMark[index],
            )}
            onNewReading={handleNewReading}
            isStreamLoading={isStreamLoading}
            streamError={streamError}
            handleReadButton={handleReadButton}
          />
        }
      />
    </Routes>
  );
};

export default FortunePage;
