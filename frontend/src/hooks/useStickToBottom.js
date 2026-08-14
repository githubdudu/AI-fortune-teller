import { useRef, useEffect, useLayoutEffect } from 'react';

// How close to the bottom still counts as "following". Generous enough that a
// smooth scroll landing a few pixels short isn't read as the user opting out.
const BOTTOM_THRESHOLD = 80;

const isAtBottom = () =>
  window.innerHeight + window.scrollY >=
  document.documentElement.scrollHeight - BOTTOM_THRESHOLD;

/**
 * Keeps the window scrolled to the bottom as `dep` grows, so streamed text
 * stays in view. Scrolling up hands control back to the user; scrolling near
 * the bottom again resumes following.
 *
 * @param {*} dep value that changes on every new chunk (e.g. the streamed text)
 * @param {Object} options
 * @param {boolean} options.active whether following is currently wanted
 */
const useStickToBottom = (dep, { active = true } = {}) => {
  const stickRef = useRef(true);

  // A fresh run starts following again, even if the previous one was opted out of
  useEffect(() => {
    if (active) stickRef.current = true;
  }, [active]);

  useEffect(() => {
    if (!active) return undefined;

    const handleScroll = () => {
      stickRef.current = isAtBottom();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [active]);

  // Layout effect so the scroll lands in the same frame the new text paints
  useLayoutEffect(() => {
    if (!active || !stickRef.current) return;

    const prefersReducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    )?.matches;

    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [dep, active]);
};

export default useStickToBottom;
