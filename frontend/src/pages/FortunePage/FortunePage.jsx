import { Routes, Route, useLocation } from 'react-router-dom';

import './FortunePage.css';
import SelectionView from './SelectionView';
import ReadingView from './ReadingView';
import CardLayer from './components/CardLayer';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';

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
  const { selectionMark, handleCardSelect } = useCardSelection(cards, 3);

  const { pathname } = useLocation();
  const isReading = pathname.endsWith('fortune/reading');

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
    <div className="fortune-page flex flex-col items-center p-5 max-w-screen sm:w-xl md:w-2xl lg:w-4xl xl:w-6xl min-h-[70vh]">
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
      />

      {/* TODO: migrate to Outlet and useOutletContext when the props are less */}
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
              userChosenCards={cards.filter(
                (card, index) => selectionMark[index],
              )}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default FortunePage;
