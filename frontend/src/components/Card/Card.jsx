import React, { useState } from 'react';
import './Card.css';
import PropTypes from 'prop-types';

const TarotCard = ({ frontImage, backImage }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className={`tarot-card ${isFlipped ? 'flipped' : ''}`}
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
};

TarotCard.defaultProps = {
  frontImage: null,
  backImage: null,
};

export default TarotCard;
