import React, { useState } from 'react';
import './Card.css';
import PropTypes from 'prop-types';

const TarotCard = ({ frontImage, backImage, disabled, onCardFlip }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    if (disabled) return;

    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);

    if (onCardFlip) {
      onCardFlip(newFlipped);
    }
  };

  return (
    <div
      className={`tarot-card ${isFlipped ? 'flipped' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={handleCardClick}
    >
      <div className="tarot-card-inner">
        <div className="tarot-card-front">
          <img src={frontImage} alt="Tarot Card Front" />
        </div>
        <div className="tarot-card-back">
          <img src={backImage} alt="Tarot Card Back" />
        </div>
      </div>
    </div>
  );
};

TarotCard.propTypes = {
  frontImage: PropTypes.string,
  backImage: PropTypes.string,
  disabled: PropTypes.bool,
  onCardFlip: PropTypes.func,
};

TarotCard.defaultProps = {
  frontImage: null,
  backImage: null,
  disabled: false,
  onCardFlip: null,
};

export default TarotCard;
