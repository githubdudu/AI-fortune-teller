// The motion.div stand-in below is a test double, not a real component
/* eslint-disable react/prop-types */
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';
import Card from '$/pages/FortunePage/components/Card';

/**
 * Springs never settle inside a jsdom test, so `motion.div` is swapped for a
 * plain div that resolves its animation immediately. The target values are
 * mirrored onto `data-animate` so tests can assert the state -> animation
 * mapping that used to live in `flipped` / `no-flip-back` class names.
 *
 * `useSpring` and friends are left untouched — Card and FloatingDescription
 * both rely on the real implementations.
 */
vi.mock('motion/react', async () => {
  const actual = await vi.importActual('motion/react');

  // Props motion consumes itself and that a plain <div> must not receive
  const MOTION_ONLY_PROPS = [
    'animate',
    'initial',
    'exit',
    'transition',
    'style',
    'onAnimationComplete',
  ];

  const MotionDiv = React.forwardRef((props, ref) => {
    const { animate, onAnimationComplete, children } = props;
    const domProps = Object.fromEntries(
      Object.entries(props).filter(
        ([key]) => !MOTION_ONLY_PROPS.includes(key) && key !== 'children',
      ),
    );

    React.useEffect(() => {
      if (onAnimationComplete) onAnimationComplete(animate);
    });

    return (
      <div
        ref={ref}
        data-animate={animate && JSON.stringify(animate)}
        {...domProps}
      >
        {children}
      </div>
    );
  });
  MotionDiv.displayName = 'MotionDiv';

  return { ...actual, motion: { ...actual.motion, div: MotionDiv } };
});

/**
 * Tests that the card is initially displayed showing the back of the card.
 */
it('renders correctly with back side showing initially', () => {
  const { getByAltText } = render(
    <Card
      name="The Fool"
      description="The Fool symbolizes key aspects of the human journey."
      frontImage="path/to/front-image.png"
      backImage="path/to/back-image.png"
    />,
  );

  // Should show the back image
  expect(getByAltText('Tarot Card Back')).toBeInTheDocument();
});

/**
 * Tests that hovering a flipped card shows the description in a floating block.
 */
it('shows the description in a floating block on hover', async () => {
  const user = userEvent.setup();
  const { getByAltText, container } = render(
    <Card
      name="The Fool"
      description="The Fool symbolizes key aspects of the human journey."
      frontImage="path/to/front-image.png"
      backImage="path/to/back-image.png"
      isShowFront={true}
    />,
  );

  // Should show the front image
  expect(getByAltText('Tarot Card Front')).toBeInTheDocument();

  // Hovering the front face should reveal the title and description
  const cardFront = container.querySelector('.tarot-card-front');
  await user.hover(cardFront);

  expect(await screen.findByText('The Fool')).toBeInTheDocument();
  expect(
    screen.getByText('The Fool symbolizes key aspects of the human journey.'),
  ).toBeInTheDocument();
});

/**
 * Tests that the description is not rendered until the card is hovered.
 */
it('does not show the description until hovered', () => {
  const { getByAltText, queryByText } = render(
    <Card
      name="The Fool"
      description="The Fool symbolizes key aspects of the human journey."
      frontImage="path/to/front-image.png"
      backImage="path/to/back-image.png"
      isShowFront={true}
    />,
  );

  // Should show the front image
  expect(getByAltText('Tarot Card Front')).toBeInTheDocument();

  // But the description block should not be mounted yet
  expect(queryByText('The Fool')).not.toBeInTheDocument();
  expect(
    queryByText('The Fool symbolizes key aspects of the human journey.'),
  ).not.toBeInTheDocument();
});

/**
 * Tests that the card rendering the number with the correct value.
 */
it('renders the number with correct value when flipped', async () => {
  const { getByText, container, rerender } = render(
    <Card
      name="The Fool"
      description="The Fool symbolizes key aspects of the human journey."
      frontImage="path/to/front-image.png"
      backImage="path/to/back-image.png"
      isShowFront={false}
      cardNumber={99}
    />,
  );

  // Initially should not show the card number
  const card = container.querySelector('.card-number');
  expect(card).not.toBeInTheDocument();

  // Should show the front image and number once the flip animation completes
  rerender(
    <Card
      name="The Fool"
      description="The Fool symbolizes key aspects of the human journey."
      frontImage="path/to/front-image.png"
      backImage="path/to/back-image.png"
      isShowFront={true}
      cardNumber={99}
    />,
  );
  await waitFor(() =>
    expect(container.querySelector('.card-number')).toBeInTheDocument(),
  );
  expect(getByText('99')).toBeInTheDocument();

  // should not show the card number when flipped without cardNumber
  rerender(
    <Card
      name="The Fool"
      description="The Fool symbolizes key aspects of the human journey."
      frontImage="path/to/front-image.png"
      backImage="path/to/back-image.png"
      isShowFront={true}
    />,
  );
  const flippedCard2 = container.querySelector('.card-number');
  expect(flippedCard2).not.toBeInTheDocument();
});

/**
 * Tests that the card does not flip back once it has been flipped to the front.
 */
it('does not flip back once flipped to front', () => {
  const { getByAltText, container } = render(
    <Card
      name="The Fool"
      description="The Fool symbolizes key aspects of the human journey."
      frontImage="path/to/front-image.png"
      backImage="path/to/back-image.png"
    />,
  );

  // Click the card to flip it to front
  const card = container.querySelector('.tarot-card');
  fireEvent.click(card);

  // Verify it's showing the front
  expect(getByAltText('Tarot Card Front')).toBeInTheDocument();

  // Click the card again to try to flip it back
  fireEvent.click(card);

  // Should still show the front image (not flipping back)
  expect(getByAltText('Tarot Card Front')).toBeInTheDocument();
});

/**
 * Tests that the card animates to the right target for each state: face down
 * and flat at rest, turned over when showing the front, and additionally
 * lifted when selected.
 */
it('animates to the correct target for each state', () => {
  const targetOf = (container) =>
    JSON.parse(
      container.querySelector('.tarot-card-inner').getAttribute('data-animate'),
    );

  const { container, rerender } = render(
    <Card
      name="The Fool"
      frontImage="path/to/front-image.png"
      backImage="path/to/back-image.png"
      isShowFront={false}
    />,
  );

  // At rest: back facing the viewer, sitting flat
  expect(targetOf(container)).toEqual({ rotateY: 0, y: 0 });

  // Showing the front turns the card over but does not lift it
  rerender(
    <Card
      name="The Fool"
      frontImage="path/to/front-image.png"
      backImage="path/to/back-image.png"
      isShowFront={true}
    />,
  );
  expect(targetOf(container)).toEqual({ rotateY: 180, y: 0 });

  // Selecting lifts the card clear of the row as well
  rerender(
    <Card
      name="The Fool"
      frontImage="path/to/front-image.png"
      backImage="path/to/back-image.png"
      isShowFront={true}
      isSelected={true}
    />,
  );
  expect(targetOf(container)).toEqual({ rotateY: 180, y: -50 });
});
