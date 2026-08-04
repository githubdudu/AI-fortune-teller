import { Box, Button } from 'gestalt';
import PropTypes from 'prop-types';

import Card from './components/Card';
import LoadingAnimation from '$/components/LoadingAnimation/LoadingAnimation';

import { markdownToHtml, createMarkup } from '$/utils/markdownUtils';

/**
 * Reading results screen
 */
const ReadingView = ({
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

ReadingView.propTypes = {
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

export default ReadingView;
