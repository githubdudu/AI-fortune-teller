import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'motion/react';

import Card from './Card';

// How the cards sit in each phase. Only the container's layout changes between them
// The card elements themselves are the same DOM nodes throughout, which
// is what lets motion tween them from one arrangement to the other.
const LAYOUTS = {
  select: 'flex w-full justify-between gap-4 my-10',
  reveal: 'flex flex-wrap max-md:flex-col justify-center gap-8 w-full my-10',
};

// Cards landing/init animation
const DEAL_FROM = { opacity: 0, y: 80, scale: 0.85 };
const DEAL_TO = { opacity: 1, y: 0, scale: 1 };
const DEAL_SPRING = { type: 'spring', visualDuration: 0.45, bounce: 0.35 };

// Gap between one card landing and the next leaving, in seconds
const DEAL_STAGGER = 0.09;

// Cards leaving animation. The unselected cards leaving the row when the selection is confirmed
const EXIT = { opacity: 0, scale: 0.9, transition: { duration: 2 } };

// Cards flying animation when page change.
// Position changes are driven by layout reflow, so this is the tween for the
// flight from the selection row into the reading row
const LAYOUT_SPRING = { type: 'spring', visualDuration: 3, bounce: 0.25 };

// Delay the flip animation after the layout reflow
const FLIP_AFTER_LAYOUT = 3.5;

/**
 * The persistent card layer.
 *
 * Rendered once by FortunePage and kept mounted across the child routes, so the
 * three selected cards are the same elements in the selection view and the
 * reading view. Each view supplies only its own chrome around this layer.
 *
 * `isReading` is a prop that controls the phase of the layer:
 *   false, mode: 'select' — every drawn card, clickable, face down until picked
 *   true, mode: 'reveal' — only the picked cards, face up, inert
 *
 * Dropping from one mode to the other unmounts the unpicked cards (animated out
 * by AnimatePresence) and re-flows the survivors, which `layout` then tweens.
 */
const CardLayer = ({
  cards,
  isReading: isReveal,
  selectionMark,
  selectedCardIds,
  onCardSelect,
  className,
}) => {
  const mode = isReveal ? 'reveal' : 'select';

  const entries = cards
    .map((card, index) => ({ card, index }))
    .filter(({ index }) => !isReveal || selectionMark[index]);

  return (
    <div className={`card-layer relative ${LAYOUTS[mode]} ${className}`}>
      <AnimatePresence mode="popLayout">
        {entries.map(({ card, index }) => (
          <motion.div
            // Stable across both modes: this is what ties a card in the
            // selection row to the same card in the reading row.
            key={card.id}
            layout
            initial={DEAL_FROM}
            animate={DEAL_TO}
            exit={EXIT}
            transition={{
              layout: LAYOUT_SPRING,
              default: { ...DEAL_SPRING, delay: index * DEAL_STAGGER },
            }}
            className="min-w-0 shrink flex flex-col items-center"
            onClick={isReveal ? undefined : () => onCardSelect(card.id, index)}
          >
            <Card
              backImage="/cards/back-416.webp"
              backImageSmall="/cards/back-240.webp"
              frontImage={card.imageSource || '/defaultFrontCard.png'}
              isShowFront={isReveal}
              flipDelay={isReveal ? FLIP_AFTER_LAYOUT + index * 0.1 : 0}
              isSelected={selectionMark[index]}
              name={card.name}
              description={card.description}
              cardNumber={selectedCardIds.indexOf(card.id) + 1}
              index={index}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

CardLayer.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string,
      description: PropTypes.string,
      imageSource: PropTypes.string,
    }),
  ).isRequired,
  isReading: PropTypes.bool.isRequired,
  selectionMark: PropTypes.arrayOf(PropTypes.bool).isRequired,
  selectedCardIds: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  ),
  onCardSelect: PropTypes.func,
  className: PropTypes.string,
};

CardLayer.defaultProps = {
  onCardSelect: () => {},
  className: '',
};

export default CardLayer;
