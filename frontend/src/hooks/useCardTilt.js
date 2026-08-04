import { useCallback, useEffect, useRef, useState } from 'react';
import { useSpring } from 'motion/react';

// Low-ish stiffness with light damping so the card overshoots slightly and
// settles — that overshoot is what reads as physical weight.
const TILT_SPRING = { stiffness: 220, damping: 18, mass: 0.6 };

/**
 * True when the visitor asked for less motion, or is on a touch-only device
 * where there is no hover to drive the tilt in the first place.
 * `matchMedia` is absent in jsdom, so treat a missing implementation as "fine".
 */
const prefersNoTilt = () => {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return false;
  }
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.matchMedia('(pointer: coarse)').matches
  );
};

/**
 * Cursor-following 3D tilt with spring inertia, plus the pointer position
 * published as CSS custom properties for the holographic layers to read.
 *
 * The returned `rotateX`/`rotateY` are motion values meant for a `motion.div`
 * that owns *only* the tilt — keep the flip transform on a child element so the
 * two never compete for the same `transform`.
 *
 * @param {Object} options
 * @param {number} options.max - Maximum tilt in degrees on each axis
 * @param {boolean} options.enabled - Set false while the card is being dragged.
 *   The tilt maths works off a rect cached on pointer enter, which a moving
 *   card invalidates immediately — left running, the tilt would spin wildly.
 * @returns {Object} ref, motion values and pointer handlers to spread on the element
 */
const useCardTilt = ({ max = 13, enabled = true } = {}) => {
  const ref = useRef(null);
  // Cached on pointer enter so the move handler never forces a layout
  const rectRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const rotateX = useSpring(0, TILT_SPRING);
  const rotateY = useSpring(0, TILT_SPRING);

  // Drop the tilt while disabled rather than freezing it at its last angle
  useEffect(() => {
    if (enabled) return;
    rectRef.current = null;
    rotateX.set(0);
    rotateY.set(0);
  }, [enabled, rotateX, rotateY]);

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
    if (!ref.current || prefersNoTilt()) return;
    rectRef.current = ref.current.getBoundingClientRect();
  }, []);

  const handlePointerMove = useCallback(
    (event) => {
      const element = ref.current;
      const rect = rectRef.current;
      if (!enabled || !element || !rect) return;

      // Pointer position inside the card, 0..1 on each axis
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;

      rotateY.set((px - 0.5) * 2 * max);
      rotateX.set(-(py - 0.5) * 2 * max);

      // Consumed by the holo/glare gradients in Card.css
      element.style.setProperty('--mx', `${px * 100}%`);
      element.style.setProperty('--my', `${py * 100}%`);
      // 0 at the centre, ~1 at the corners — drives how hot the sheen gets
      const distance = Math.min(
        1,
        Math.hypot(px - 0.5, py - 0.5) / Math.SQRT1_2,
      );
      element.style.setProperty('--pointer-from-center', `${distance}`);
    },
    [enabled, max, rotateX, rotateY],
  );

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    // Dragging off the card counts as releasing it — otherwise a card the
    // pointer left mid-press would stay stuck in its pressed state
    setIsPressed(false);
    rectRef.current = null;
    // Spring back to flat rather than snapping
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  const handlePointerDown = useCallback(() => setIsPressed(true), []);
  const handlePointerUp = useCallback(() => setIsPressed(false), []);

  return {
    ref,
    rotateX,
    rotateY,
    // Exposed so hover- and press-driven animations can go through the same
    // `animate` object as everything else, instead of competing `whileHover` /
    // `whileTap` props
    isHovered,
    isPressed,
    tiltHandlers: {
      onPointerEnter: handlePointerEnter,
      onPointerMove: handlePointerMove,
      onPointerLeave: handlePointerLeave,
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      // Fires when the browser takes the pointer away (scroll, gesture)
      onPointerCancel: handlePointerUp,
    },
  };
};

export default useCardTilt;
