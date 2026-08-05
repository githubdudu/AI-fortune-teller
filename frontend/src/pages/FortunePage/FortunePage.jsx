import { Routes, Route, useLocation } from 'react-router-dom';

import './FortunePage.css';
import SelectionView from './SelectionView';
import ReadingView from './ReadingView';
import CardLayer from './components/CardLayer';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';
import ErrorMessage from './components/ErrorMessage';

import useCardSelection from '../../hooks/useCardSelection';
import useFetchTarotCards from '../../hooks/useFetchTarotCards';

/**
 * Main FortunePage component
 */
const FortunePage = () => {
  // Use custom hooks for cards and selection
  const {
    cards,
    isLoading: isCardsLoading,
    error: taroCardsError,
  } = useFetchTarotCards(5);
  const { selectionMark, handleCardSelect, selectedCounts } = useCardSelection(
    cards,
    3,
  );

  const { pathname } = useLocation();
  const isReading = pathname.endsWith('fortune/reading');

  // Turn an axios error into something readable, keeping the HTTP status
  // (e.g. 429 rate limiting) visible on the page instead of only in the console.
  const describeCardsError = (error) => {
    const status = error?.response?.status;
    const detail =
      error?.response?.data?.message ||
      error?.response?.data?.title ||
      (typeof error?.response?.data === 'string'
        ? error.response.data
        : null) ||
      error?.message;

    if (status === 429) {
      return `Too many requests (429) — the server is rate limiting card draws. Please wait a moment and try again. Showing demo cards for now.`;
    }
    if (status) {
      return `Could not fetch cards from server (${status}${detail ? `: ${detail}` : ''}). Using demo cards instead.`;
    }
    return `Could not fetch cards from server${detail ? ` (${detail})` : ''}. Using demo cards instead.`;
  };

  // Show loading animation when fetching cards or submitting reading request
  if (isCardsLoading) {
    return (
      <div className="selection-container">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    // The page shell: it owns the column width and centring for every child
    // route, so the card layer and the views below it share one measuring
    // stick.
    <div className="fortune-page flex flex-col items-center p-5 max-w-screen sm:w-xl md:w-2xl lg:w-4xl xl:w-6xl min-h-[70vh] text-center">
      {taroCardsError && (
        <ErrorMessage
          message={describeCardsError(taroCardsError)}
          type={taroCardsError?.response?.status === 429 ? 'error' : 'warning'}
        />
      )}
      {/*
       * The persistent card layer. It sits outside <Routes> on purpose: the
       * child routes swap around it while these card elements stay mounted,
       * which is what lets the selected cards animate from the selection row
       * into the reading row instead of being torn down and rebuilt.
       */}
      <CardLayer
        cards={cards}
        isReading={isReading}
        selectionMark={selectionMark}
        onCardSelect={handleCardSelect}
        className="order-1"
      />

      {/* TODO: migrate to Outlet and useOutletContext when the props are less */}
      <Routes>
        <Route
          index
          element={<SelectionView selectedCounts={selectedCounts} />}
        />
        <Route
          path="reading"
          element={
            <ReadingView
              // TODO: managed by useCardSelection, and the sequence should managed, same as the number
              userChosenCards={cards
                .filter((card, index) => selectionMark[index])
                .map((card) => ({ id: card.id }))}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default FortunePage;
