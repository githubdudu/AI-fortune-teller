import './Card.css';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import FloatingDescription from './FloatingDescription';
import useCardTilt from '$/hooks/useCardTilt';
import useIdleFloat from '$/hooks/useIdleFloat';
import useSound from '$/hooks/useAudio';

// Controls the physical feel of the card's flip
const FLIP_SPRING = { type: 'spring', visualDuration: 1, bounce: 0.25 };

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

// Reading drops the lift back to 0. A slow tween instead of LIFT_SPRING, so the
// offset dissolves during the flight into the reading row rather than snapping
// down the instant the phase changes.
const LIFT_SETTLE = { duration: 2, ease: 'easeInOut' };

// Pressing punches through the hover scale rather than replacing it, and snaps
// there faster than hover does so the click feels immediate
const TAP_SPRING = { type: 'spring', visualDuration: 0.08, bounce: 0.5 };

const HOVER_SCALE = 1.06;
const TAP_SCALE = HOVER_SCALE + 0.06;

// The flight back to the slot after the card is let go.
//
// Defaults are 200/40, i.e. overdamped (damping ratio ~1.4) — that is the
// sluggish return. 900/32 puts the ratio near 0.53: fast, with a small
// overshoot. Raise bounceStiffness for more speed, lower bounceDamping for
// more overshoot.
const DRAG_RETURN_TRANSITION = {
  bounceStiffness: 900,
  bounceDamping: 40,
};

/**
 * Card component
 *
 * It is a container for the card's front and back, with tilt effects, hover and tap animations, and flip animations.
 *
 * The first div is the container. It has the setting of cursor, the size of the card, and perspective. it also has the idle drift effect.
 * The second layer is for the tilt effect and drag.
 * The third layer carries the lift and hover scale.
 * The fourth layer carries the flip, and the shadow.
 * The fifth layer is for the front and back of the card.
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
  flipDelay,
  ringColor,
}) => {
  const [isNumberShow, setIsNumberShow] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);
  // Set for the lifetime of one press that turned into a drag
  const didDragRef = useRef(false);

  // Tilt lives on `.tarot-card`; the flip stays on `.tarot-card-inner` so the
  // two transforms never overwrite each other.
  const {
    ref: tiltRef,
    rotateX,
    rotateY,
    isHovered,
    isPressed,
    tiltHandlers,
  } = useCardTilt({ enabled: !isDragging });

  const scale = isPressed ? TAP_SCALE : isHovered ? HOVER_SCALE : 1;

  // A blip on the way in only. Firing on the way out too would double every
  // sweep across the row into a stutter.
  const playSound = useSound();
  useEffect(() => {
    if (isHovered) playSound('hover');
  }, [isHovered, playSound]);

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
      // A drag could end in a click.
      // Caught here so letting go of a dragged card never reads as picking it.
      onClickCapture={(event) => {
        if (!didDragRef.current) return;
        didDragRef.current = false;
        event.stopPropagation();
      }}
      // 13rem x 21.75rem is 208x348, the 500x836 aspect of the card artwork
      className={`w-[13rem] h-[21.75rem] perspective-distant select-none ${isDragging ? 'cursor-grabbing z-30' : 'cursor-pointer'}`}
    >
      <motion.div
        ref={tiltRef}
        {...tiltHandlers}
        style={{ rotateX, rotateY }}
        // Drag rides on this layer
        drag
        dragSnapToOrigin
        dragMomentum={false}
        dragTransition={DRAG_RETURN_TRANSITION}
        onDragStart={() => {
          setIsDragging(true);
          didDragRef.current = true;
        }}
        onDragEnd={() => setIsDragging(false)}
        className="tarot-card size-full transform-3d relative"
      >
        {/* Lift and hover scale live one layer above the flip. Sharing an
            element with `rotateY` made `onAnimationComplete` fire whenever the
            (much shorter) scale animation settled, which showed the number
            mid-flip. Split apart, each layer's completion means one thing. */}
        <motion.div
          className="tarot-card-lift size-full relative transform-3d"
          // `scale` used to live in `whileHover`, but that competes with
          // `animate`: this object is rebuilt on each render, and re-applying it
          // has no `scale` key, so motion kept resetting the hover scale and
          // re-running it — the flicker.
          animate={{
            y: isSelected && !isShowFront ? LIFT_DISTANCE : 0,
            scale,
          }}
          transition={{
            y: isShowFront ? LIFT_SETTLE : LIFT_SPRING,
            // Picked per direction: these flags are already the direction of
            // travel at the moment the target changes. Press wins over hover,
            // since releasing onto a still-hovered card should spring back up.
            scale: isPressed
              ? TAP_SPRING
              : isHovered
                ? HOVER_IN_SPRING
                : HOVER_OUT_SPRING,
          }}
        >
          <motion.div
            // Shadow follows the same hover state as the scale. A CSS `:hover`
            // here would flicker for the same reason the cursor did.
            className={`tarot-card-inner relative w-full h-full text-center rounded-lg transform-3d ${isHovered ? 'shadow-xl' : 'shadow-md'}`}
            animate={{ rotateY: isShowFront ? 180 : 0 }}
            transition={{
              // Held back by `flipDelay` so the reveal reads as two beats: the
              // row rearranges first, then the cards turn over.
              rotateY: { ...FLIP_SPRING, delay: flipDelay },
            }}
            // Scoped to this element's own animation, which is now the flip and
            // nothing else. The `transitionend` this replaced bubbled, so the
            // holo layers' opacity fade used to trip it.
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
                height={348}
                // The back art is still 2:3, so it fills the taller box by
                // cropping the sides rather than letterboxing.
                className="size-full object-cover"
                decoding="async"
                fetchPriority="high"
                // Images's own drag-and-drop conflicts with motion's drag
                draggable={false}
                alt="Tarot Card Back"
              />
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute ${ringColor} ring-12 inset-2 inset-ring-1 rounded-md`}
              />
            </div>
            <div
              ref={cardRef}
              className={`tarot-card-front absolute size-full backface-hidden overflow-hidden rounded-lg ${isSelected ? 'shadow-md shadow-core' : ''}  rotate-y-180 ring-2 ring-core`}
            >
              <img
                src={frontImage}
                width={208}
                height={348}
                className="size-full object-cover"
                decoding="async"
                draggable={false}
                alt="Tarot Card Front"
              />
              {/* Holographic refraction, layered over the artwork only */}
              <div className="card-holo" aria-hidden="true" />
              <div className="card-glare" aria-hidden="true" />
              <FloatingDescription anchorRef={cardRef} enabled={!!description}>
                <div className="tarot-card-description  w-3xs p-3 rounded-lg text-bg bg-ink/75">
                  <h3 className="text-base mb-2 text-quartz font-bold">
                    {name}
                  </h3>
                  <p className="text-sm">{description}</p>
                </div>
              </FloatingDescription>
            </div>
            {isNumberShow && cardNumber != undefined && (
              <div className="card-number text-2xl">{cardNumber}</div>
            )}
          </motion.div>
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
  flipDelay: PropTypes.number,
  ringColor: PropTypes.string,
};

Card.defaultProps = {
  frontImage: null,
  backImage: null,
  backImageSmall: null,
  description: '',
  name: '',
  index: 0,
  flipDelay: 0,
  ringColor: '',
};

export default Card;
