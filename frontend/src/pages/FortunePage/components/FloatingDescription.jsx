import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  FloatingPortal,
  flip,
  offset,
  shift,
  useClientPoint,
  useFloating,
} from '@floating-ui/react';

/**
 * Shows the card description in a block that follows the cursor while hovering
 * `anchorRef`. Renders nothing in place — the block itself goes to a portal.
 */
const FloatingDescription = ({ anchorRef, enabled, children }) => {
  const [mousePos, setMousePos] = useState(null);

  const { refs, floatingStyles, context } = useFloating({
    open: mousePos !== null,
    middleware: [offset(16), flip(), shift({ padding: 8 })],
  });

  // Let the floating element follow the mouse position
  useClientPoint(context, {
    enabled: mousePos !== null,
    x: mousePos?.x ?? null,
    y: mousePos?.y ?? null,
  });

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

  if (mousePos === null) {
    return null;
  }

  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        style={{
          ...floatingStyles,
        }}
      >
        {children}
      </div>
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
