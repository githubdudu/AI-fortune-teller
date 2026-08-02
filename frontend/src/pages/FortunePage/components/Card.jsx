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
      className={`tarot-card w-[13rem] h-[19.5rem] perspective-distant cursor-pointer relative  ${isShowFront ? 'flipped' : ''} ${disabled ? 'disabled' : ''} ${isShowFront ? 'no-flip-back' : ''}`}
      onTransitionEnd={() => {
        if (isShowFront) {
          setIsNumberShow(true);
        }
      }}
    >
      <div
        className={`tarot-card-inner relative w-full h-full text-center rounded-lg transition-transform duration-600 transform-3d shadow-md hover:shadow-xl ${isShowFront ? 'rotate-y-180 -translate-y-9' : ''} `}
      >
        <div
          className={`tarot-card-back z-10 absolute size-full backface-hidden overflow-hidden rounded-lg bg-pink rotate-y-0`}
        >
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
        <div
          className={`tarot-card-front absolute size-full backface-hidden overflow-hidden rounded-lg ${isShowFront ? 'shadow-md shadow-pink-800' : ''} bg-blue rotate-y-180`}
        >
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
