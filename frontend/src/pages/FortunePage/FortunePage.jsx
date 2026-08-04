import { Routes, Route } from 'react-router-dom';

import './FortunePage.css';
import SelectionView from './SelectionView';
import ReadingView from './ReadingView';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';

import useCardSelection from '../../hooks/useCardSelection';
import useFetchTarotCards from '../../hooks/useFetchTarotCards';

/**
 * Main FortunePage component
 */
const FortunePage = () => {
  // AppContext provides user theme, prompt, and methods to save/clear reading results
  // const {
  // saveUserChosenCards, TODO: delete all of these
  // clearQuestionAndTheme, TODO: auto clear at home page, check usage
  // userChosenCards, TODO: delete the one in AppContext.
  // } = useContext(AppContext);

  // Use custom hooks for cards and selection
  const {
    cards,
    isLoading: isCardsLoading,
    error: taroCardsError,
  } = useFetchTarotCards(5);
  const { selectionMark, handleCardSelect } = useCardSelection(cards, 3);

  // Show loading animation when fetching cards or submitting reading request
  if (isCardsLoading) {
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
            userChosenCards={cards.filter(
              (card, index) => selectionMark[index],
            )}
          />
        }
      />
    </Routes>
  );
};

export default FortunePage;
