import './Card.css';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import FloatingDescription from './FloatingDescription';
import useCardTilt from '$/hooks/useCardTilt';
import useIdleFloat from '$/hooks/useIdleFloat';

// Controls the physical feel of the card's flip
const FLIP_SPRING = { type: 'spring', stiffness: 120, damping: 16 };

// `bounce` (0 = none, 1 = extreme) with `visualDuration` (seconds to visually reach the target)
// 0.5 gives a clear overshoot-and-settle; push towards 0.7 for more, 0.3 for less.
const LIFT_SPRING = { type: 'spring', visualDuration: 0.1, bounce: 0.4 };

// Hover is asymmetric on purpose: growing has a pronounced bounce, mimicking
// the feel of Balatro, while shrinking settles almost flat. Springing on the
// way out too would make the whole row twitch as the cursor sweeps across it.
const HOVER_IN_SPRING = { type: 'spring', visualDuration: 0.1, bounce: 0.8 };
const HOVER_OUT_SPRING = { type: 'spring', visualDuration: 0.1, bounce: 0.4 };

// How far a selected card rises out of the row, in px
const LIFT_DISTANCE = -50;

// Pressing punches through the hover scale rather than replacing it, and snaps
// there faster than hover does so the click feels immediate
const TAP_SPRING = { type: 'spring', visualDuration: 0.08, bounce: 0.5 };

const HOVER_SCALE = 1.06;
const TAP_SCALE = HOVER_SCALE + 0.06;

/**
 * Card component
 *
 * It is a container for the card's front and back, with tilt effects, hover and tap animations, and flip animations.
 *
 * The first div is the container. It has the setting of cursor, the size of the card, and perspective. it also has the idle drift effect.
 * The second layer is for the tilt effect.
 * The third layer has animation for the flip, lift and hover effect. And shadow.
 * The fourth layer is for the front and back of the card.
 * The back is simple, just an image.
 * The front contains the image, the holo and glare effect, and the floating description.
 */
const Card = ({
  frontImage,
  backImage,
  backImageSmall,
  description,
  name,
  isShowFront,
  isSelected,
  cardNumber,
  index,
}) => {
  const [isNumberShow, setIsNumberShow] = useState(false);
  const cardRef = useRef(null);
  // Tilt lives on `.tarot-card`; the flip stays on `.tarot-card-inner` so the
  // two transforms never overwrite each other.
  const {
    ref: tiltRef,
    rotateX,
    rotateY,
    isHovered,
    isPressed,
    tiltHandlers,
  } = useCardTilt();

  const scale = isPressed ? TAP_SCALE : isHovered ? HOVER_SCALE : 1;

  // Eased out while the card is engaged, so the drift never fights the cursor
  const { y: floatY, rotate: floatRotate } = useIdleFloat({
    index,
    enabled: !isHovered && !isPressed,
  });

  return (
    // Set `cursor-pointer` on this untransformed box is more stable.
    // Then there are two layers with motion transforms
    // Then the card's front and back
    //
    // The idle drift rides on this outermost box
    <motion.div
      style={{ y: floatY, rotate: floatRotate }}
      className="w-[13rem] h-[19.5rem] perspective-distant cursor-pointer"
    >
      <motion.div
        ref={tiltRef}
        {...tiltHandlers}
        style={{ rotateX, rotateY }}
        // Raised while hovered so the scaled-up card is not clipped by the
        // neighbours it overlaps — driven by the same state as the scale, so
        // the two can never disagree the way a CSS `:hover` could.
        className={`tarot-card size-full transform-3d relative ${isHovered ? 'z-20' : ''}`}
      >
        <motion.div
          // Shadow follows the same hover state as the scale. A CSS `:hover`
          // here would flicker for the same reason the cursor did.
          className={`tarot-card-inner relative w-full h-full text-center rounded-lg transform-3d ${isHovered ? 'shadow-xl' : 'shadow-md'}`}
          // Every animated axis goes through this one object. `scale` used to
          // live in `whileHover`, but that competes with `animate`: this object
          // is rebuilt on each render, and re-applying it has no `scale` key, so
          // motion kept resetting the hover scale and re-running it — the flicker.
          animate={{
            rotateY: isShowFront ? 180 : 0,
            y: isSelected ? LIFT_DISTANCE : 0,
            scale,
          }}
          transition={{
            rotateY: FLIP_SPRING,
            y: LIFT_SPRING,
            // Picked per direction: these flags are already the direction of
            // travel at the moment the target changes. Press wins over hover,
            // since releasing onto a still-hovered card should spring back up.
            scale: isPressed
              ? TAP_SPRING
              : isHovered
                ? HOVER_IN_SPRING
                : HOVER_OUT_SPRING,
          }}
          // Scoped to this element's own animation. The `transitionend` this
          // replaced bubbled, so the holo layers' opacity fade used to trip it.
          onAnimationComplete={() => {
            if (isShowFront) {
              setIsNumberShow(true);
            }
          }}
        >
          <div
            className={`tarot-card-back absolute size-full backface-hidden overflow-hidden rounded-lg rotate-y-0`}
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
            className={`tarot-card-front absolute size-full backface-hidden overflow-hidden rounded-lg ${isSelected ? 'shadow-md shadow-pink-800' : ''}  rotate-y-180`}
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
        </motion.div>
      </motion.div>
    </motion.div>
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
  index: PropTypes.number,
};

Card.defaultProps = {
  frontImage: null,
  backImage: null,
  backImageSmall: null,
  description: '',
  name: '',
  index: 0,
};

export default Card;
