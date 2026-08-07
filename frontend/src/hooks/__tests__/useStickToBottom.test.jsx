import { renderHook, act } from '@testing-library/react';

import useStickToBottom from '$/hooks/useStickToBottom';

const PAGE_HEIGHT = 2000;
const VIEWPORT = 800;

/** Places the window at `scrollY` and fires a scroll event, as a user would. */
function scrollTo(scrollY) {
  window.scrollY = scrollY;
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
}

beforeEach(() => {
  vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(
    PAGE_HEIGHT,
  );
  window.innerHeight = VIEWPORT;
  window.scrollY = PAGE_HEIGHT - VIEWPORT;
  window.scrollTo = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('scrolls to the bottom when the streamed text grows', () => {
  const { rerender } = renderHook(({ text }) => useStickToBottom(text), {
    initialProps: { text: 'a' },
  });

  window.scrollTo.mockClear();
  rerender({ text: 'ab' });

  expect(window.scrollTo).toHaveBeenCalledWith(
    expect.objectContaining({ top: PAGE_HEIGHT }),
  );
});

it('does nothing while inactive', () => {
  const { rerender } = renderHook(
    ({ text }) => useStickToBottom(text, { active: false }),
    { initialProps: { text: 'a' } },
  );

  rerender({ text: 'ab' });

  expect(window.scrollTo).not.toHaveBeenCalled();
});

it('stops following once the user scrolls up, and resumes at the bottom', () => {
  const { rerender } = renderHook(({ text }) => useStickToBottom(text), {
    initialProps: { text: 'a' },
  });

  scrollTo(200); // user scrolls well away from the bottom
  window.scrollTo.mockClear();
  rerender({ text: 'ab' });
  expect(window.scrollTo).not.toHaveBeenCalled();

  scrollTo(PAGE_HEIGHT - VIEWPORT); // back at the bottom
  rerender({ text: 'abc' });
  expect(window.scrollTo).toHaveBeenCalled();
});

it('removes the scroll listener on unmount', () => {
  const removeSpy = vi.spyOn(window, 'removeEventListener');

  const { unmount } = renderHook(() => useStickToBottom('a'));
  unmount();

  expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
});
