import './Card.css';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import FloatingDescription from './FloatingDescription';
import useCardTilt from '$/hooks/useCardTilt';

const Card = ({
  frontImage,
  backImage,
  backImageSmall,
  description,
  name,
  isShowFront,
  isSelected,
  cardNumber,
}) => {
  const [isNumberShow, setIsNumberShow] = useState(false);
  const cardRef = useRef(null);
  // Tilt lives on `.tarot-card`; the flip stays on `.tarot-card-inner` so the
  // two transforms never overwrite each other.
  const { ref: tiltRef, rotateX, rotateY, tiltHandlers } = useCardTilt();

  return (
    <div className="w-[13rem] h-[19.5rem] perspective-distant ">
      <motion.div
        ref={tiltRef}
        {...tiltHandlers}
        style={{ rotateX, rotateY }}
        className={`tarot-card size-full transform-3d relative ${isShowFront ? 'flipped' : ''} ${isSelected ? 'no-flip-back' : ''}`}
        onTransitionEnd={() => {
          if (isShowFront) {
            setIsNumberShow(true);
          }
        }}
      >
        <div
          className={`tarot-card-inner relative w-full h-full text-center rounded-lg cursor-pointer transition-transform duration-600 transform-3d shadow-md hover:shadow-xl ${isShowFront ? 'rotate-y-180' : ''} ${isSelected ? '-translate-y-9 rotate-y-180' : ''}`}
        >
          <div
            className={`tarot-card-back absolute size-full backface-hidden overflow-hidden rounded-lg bg-pink-600 rotate-y-0`}
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
            className={`tarot-card-front absolute size-full backface-hidden overflow-hidden rounded-lg ${isSelected ? 'shadow-md shadow-pink-800' : ''} bg-blue-500 rotate-y-180`}
          >
            <img
              src={frontImage}
              width={208}
              height={312}
              decoding="async"
              alt="Tarot Card Front"
            />
            {/* Holographic refraction, layered over the artwork only */}
            <div className="card-holo" aria-hidden="true" />
            <div className="card-glare" aria-hidden="true" />
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
      </motion.div>
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
  isSelected: PropTypes.bool,
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
