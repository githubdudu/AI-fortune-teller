import { useEffect } from 'react';
import { useSpring, useTime, useTransform } from 'motion/react';

// Amplitudes: a few px of drift and a degree or so of sway. Deliberately small —
// this should register as "alive", not as an animation the user has to watch.
const FLOAT_DISTANCE = 4;
const FLOAT_ROTATION = 1.2;

// Periods in ms. Kept coprime-ish so the two axes drift in and out of phase
// instead of tracing the same closed loop over and over.
const FLOAT_PERIOD = 3800;
const SWAY_PERIOD = 5300;

// How the drift fades out when the card is picked up, and back in when released
const AMPLITUDE_SPRING = { stiffness: 90, damping: 18 };

/**
 * Unlike reduced-motion checks elsewhere in the app this does *not* bail on
 * coarse pointers: idle drift is ambient and has nothing to do with hovering,
 * so it is just as welcome on touch. `matchMedia` is absent in jsdom.
 */
const prefersReducedMotion = () => {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * A slow sine drift that keeps a resting card feeling buoyant rather than
 * pinned to the page.
 *
 * Driven by elapsed time rather than by state, so it never competes with the
 * flip/lift/hover animations — apply the returned values to a *different*
 * element than the one carrying those, and the two compose instead of
 * overwriting each other.
 *
 * @param {Object} options
 * @param {number} options.index - Position in the row; offsets the phase so
 *   neighbouring cards never bob in unison
 * @param {boolean} options.enabled - False while the card is being interacted
 *   with, which eases the drift out rather than cutting it
 * @returns {Object} `y` and `rotate` motion values
 */
const useIdleFloat = ({ index = 0, enabled = true } = {}) => {
  const time = useTime();

  // Scales both axes at once: 1 while drifting, 0 once the card is engaged
  const amplitude = useSpring(enabled ? 1 : 0, AMPLITUDE_SPRING);

  useEffect(() => {
    amplitude.set(prefersReducedMotion() || !enabled ? 0 : 1);
  }, [amplitude, enabled]);

  // Roughly a fifth of a cycle between neighbours — enough to look uncorrelated
  const phase = index * 1.3;

  const y = useTransform(
    () =>
      Math.sin((time.get() / FLOAT_PERIOD) * Math.PI * 2 + phase) *
      FLOAT_DISTANCE *
      amplitude.get(),
  );

  const rotate = useTransform(
    () =>
      Math.sin((time.get() / SWAY_PERIOD) * Math.PI * 2 + phase) *
      FLOAT_ROTATION *
      amplitude.get(),
  );

  return { y, rotate };
};

export default useIdleFloat;
