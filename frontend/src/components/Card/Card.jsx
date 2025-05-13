import React, { useState, useEffect } from 'react';
import './Card.css';
import PropTypes from 'prop-types';

const TarotCard = ({
  frontImage,
  backImage,
  disabled,
  onCardFlip,
  description,
  name,
  initialFlipped,
}) => {
  const [isFlipped, setIsFlipped] = useState(initialFlipped || false);
  const [hasBeenFlipped, setHasBeenFlipped] = useState(initialFlipped || false);

  // 当initialFlipped属性改变时更新状态
  useEffect(() => {
    if (initialFlipped) {
      setIsFlipped(true);
      setHasBeenFlipped(true);
    }
  }, [initialFlipped]);

  const handleCardClick = () => {
    if (disabled) return;

    // 如果卡牌已经翻转过了，不再允许翻转
    if (hasBeenFlipped && isFlipped) return;

    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);

    // 如果从背面翻到正面，标记该卡牌已经被翻转过
    if (newFlipped) {
      setHasBeenFlipped(true);
    }

    if (onCardFlip) {
      onCardFlip(newFlipped);
    }
  };

  return (
    <div
      className={`tarot-card ${isFlipped ? 'flipped' : ''} ${disabled ? 'disabled' : ''} ${hasBeenFlipped && isFlipped ? 'no-flip-back' : ''}`}
      onClick={handleCardClick}
    >
      <div className="tarot-card-inner">
        <div className="tarot-card-back">
          <img src={backImage} alt="Tarot Card Back" />
        </div>
        <div className="tarot-card-front">
          <img src={frontImage} alt="Tarot Card Front" />
          <div className="tarot-card-description">
            <h3>{name}</h3>
            <p>{description}</p>
          </div>
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
  description: PropTypes.string,
  name: PropTypes.string,
  initialFlipped: PropTypes.bool,
};

TarotCard.defaultProps = {
  frontImage: null,
  backImage: null,
  disabled: false,
  onCardFlip: null,
  description: '',
  name: '',
  initialFlipped: false,
};

export default TarotCard;
