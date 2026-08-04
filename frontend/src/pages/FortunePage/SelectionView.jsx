import { Button } from 'gestalt';
import ErrorMessage from './components/ErrorMessage';
import Card from './components/Card';
import PropTypes from 'prop-types';

/**
 * Card selection screen
 * /fortune
 */
const SelectionView = ({
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

SelectionView.propTypes = {
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
            index={index}
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

export default SelectionView;
