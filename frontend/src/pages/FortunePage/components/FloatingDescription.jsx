import PropTypes from 'prop-types';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  FloatingPortal,
  flip,
  shift,
  useClientPoint,
  useFloating,
  useTransitionStyles,
} from '@floating-ui/react';
import { motion, useSpring } from 'motion/react';

// Lower stiffness / higher mass = more lag behind the cursor
const SPRING = { stiffness: 1000, damping: 60, mass: 0.6 };

/**
 * Shows the card description in a block that trails the cursor while hovering
 * `anchorRef`. Renders nothing in place — the block itself goes to a portal.
 */
const FloatingDescription = ({ anchorRef, enabled, children }) => {
  const [mousePos, setMousePos] = useState(null);

  const { refs, x, y, strategy, isPositioned, context } = useFloating({
    placement: 'right-start',
    open: mousePos !== null,
    middleware: [flip(), shift({ padding: 8 })],
  });

  // Let the floating element follow the mouse position
  useClientPoint(context, {
    enabled: mousePos !== null,
    x: mousePos?.x ?? null,
    y: mousePos?.y ?? null,
  });

  // Fade in/out on open/close, using Floating UI's defaults
  const { isMounted, styles: transitionStyles } = useTransitionStyles(context);

  // Springs trail the position Floating UI computes, instead of snapping to it
  const springX = useSpring(0, SPRING);
  const springY = useSpring(0, SPRING);
  const settled = useRef(false);

  useLayoutEffect(() => {
    if (!isPositioned) {
      settled.current = false;
      return;
    }
    if (settled.current) {
      springX.set(x);
      springY.set(y);
    } else {
      // First position of a hover: land directly, don't fly in from (0, 0)
      springX.jump(x);
      springY.jump(y);
      settled.current = true;
    }
  }, [x, y, isPositioned, springX, springY]);

  // Update mouse position
  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor || !enabled || !children) {
      return undefined;
    }

    const handleMove = (event) =>
      setMousePos({ x: event.clientX, y: event.clientY });
    const handleLeave = () => setMousePos(null);

    anchor.addEventListener('mousemove', handleMove);
    anchor.addEventListener('mouseleave', handleLeave);
    return () => {
      anchor.removeEventListener('mousemove', handleMove);
      anchor.removeEventListener('mouseleave', handleLeave);
      setMousePos(null);
    };
  }, [anchorRef, enabled, children]);

  if (!isMounted) {
    return null;
  }

  return (
    <FloatingPortal>
      <motion.div
        ref={refs.setFloating}
        className="pointer-events-none"
        style={{
          position: strategy,
          top: 0,
          left: 0,
          x: springX,
          y: springY,
          ...transitionStyles,
        }}
      >
        {children}
      </motion.div>
    </FloatingPortal>
  );
};

FloatingDescription.propTypes = {
  anchorRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  enabled: PropTypes.bool,
  children: PropTypes.node,
};

FloatingDescription.defaultProps = {
  enabled: true,
  children: null,
};

export default FloatingDescription;
