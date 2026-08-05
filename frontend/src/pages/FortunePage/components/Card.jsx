import './Card.css';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const Card = ({
  frontImage,
  backImage,
  backImageSmall,
  disabled,
  description,
  name,
  isShowFront,
  cardNumber,
}) => {
  const [isNumberShow, setIsNumberShow] = useState(false);
  return (
    <div
      className={`tarot-card ${isShowFront ? 'flipped' : ''} ${disabled ? 'disabled' : ''} ${isShowFront ? 'no-flip-back' : ''}`}
      onTransitionEnd={() => {
        if (isShowFront) {
          setIsNumberShow(true);
        }
      }}
    >
      <div className="tarot-card-inner">
        <div className="tarot-card-back">
          <img
            src={backImage}
            srcSet={
              backImageSmall
                ? `${backImageSmall} 240w, ${backImage} 416w`
                : undefined
            }
            sizes="208px"
            width={208}
            height={312}
            decoding="async"
            fetchPriority="high"
            alt="Tarot Card Back"
          />
        </div>
        <div className="tarot-card-front">
          <img
            src={frontImage}
            width={208}
            height={312}
            decoding="async"
            alt="Tarot Card Front"
          />
          <div className="tarot-card-description">
            <h3>{name}</h3>
            <p>{description}</p>
          </div>
        </div>
        {isNumberShow && cardNumber != undefined && (
          <div className="card-number">{cardNumber}</div>
        )}
      </div>
    </div>
  );
};

Card.propTypes = {
  frontImage: PropTypes.string,
  backImage: PropTypes.string,
  backImageSmall: PropTypes.string,
  disabled: PropTypes.bool,
  description: PropTypes.string,
  name: PropTypes.string,
  isShowFront: PropTypes.bool,
  cardNumber: PropTypes.string,
};

Card.defaultProps = {
  frontImage: null,
  backImage: null,
  backImageSmall: null,
  disabled: false,
  description: '',
  name: '',
};

export default Card;
