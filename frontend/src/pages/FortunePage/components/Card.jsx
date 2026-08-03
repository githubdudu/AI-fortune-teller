import './Card.css';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import FloatingDescription from './FloatingDescription';

const Card = ({
  frontImage,
  backImage,
  backImageSmall,
  description,
  name,
  isShowFront,
  cardNumber,
}) => {
  const [isNumberShow, setIsNumberShow] = useState(false);
  const cardRef = useRef(null);
  return (
    <div
      className={`tarot-card w-[13rem] h-[19.5rem] perspective-distant relative ${isShowFront ? 'flipped' : ''} ${isShowFront ? 'no-flip-back' : ''}`}
      onTransitionEnd={() => {
        if (isShowFront) {
          setIsNumberShow(true);
        }
      }}
    >
      <div
        className={`tarot-card-inner relative w-full h-full text-center rounded-lg cursor-pointer transition-transform duration-600 transform-3d shadow-md hover:shadow-xl ${isShowFront ? 'rotate-y-180 -translate-y-9' : ''} `}
      >
        <div
          className={`tarot-card-back absolute size-full backface-hidden overflow-hidden rounded-lg bg-pink rotate-y-0`}
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
          ref={cardRef}
          className={`tarot-card-front absolute size-full backface-hidden overflow-hidden rounded-lg ${isShowFront ? 'shadow-md shadow-pink-800' : ''} bg-blue rotate-y-180`}
        >
          <img
            src={frontImage}
            width={208}
            height={312}
            decoding="async"
            alt="Tarot Card Front"
          />
          <FloatingDescription anchorRef={cardRef} enabled={!!description}>
            <div className="tarot-card-description  w-3xs p-3 rounded-lg text-white bg-mist-900/70">
              <h3 className="text-base mb-2 text-[#ffd7ec] font-bold">
                {name}
              </h3>
              <p className="text-sm">{description}</p>
            </div>
          </FloatingDescription>
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
  description: PropTypes.string,
  name: PropTypes.string,
  isShowFront: PropTypes.bool,
  cardNumber: PropTypes.string,
};

Card.defaultProps = {
  frontImage: null,
  backImage: null,
  backImageSmall: null,
  description: '',
  name: '',
};

export default Card;
