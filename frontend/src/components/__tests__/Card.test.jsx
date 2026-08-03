import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Card from '$/pages/FortunePage/components/Card';

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
it('renders the number with correct value when flipped', () => {
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
  vi.useFakeTimers();

  // Should show the front image and number
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
  const cardElement = container.querySelector('.tarot-card');
  fireEvent.transitionEnd(cardElement);
  vi.advanceTimersByTime(5000);
  const flippedCard = container.querySelector('.card-number');
  expect(flippedCard).toBeInTheDocument();
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
  const cardElement2 = container.querySelector('.tarot-card');
  fireEvent.transitionEnd(cardElement2);
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
 * Tests that the card has the appropriate CSS classes based on its state.
 */
it('applies correct CSS classes based on state', () => {
  const { container, rerender } = render(
    <Card
      name="The Fool"
      frontImage="path/to/front-image.png"
      backImage="path/to/back-image.png"
      isShowFront={false}
    />,
  );

  // Initially should not have 'flipped' or 'disabled' classes
  let cardElement = container.querySelector('.tarot-card');
  expect(cardElement.classList.contains('flipped')).toBe(false);
  expect(cardElement.classList.contains('disabled')).toBe(false);
  expect(cardElement.classList.contains('no-flip-back')).toBe(false);

  // flip
  rerender(
    <Card
      name="The Fool"
      frontImage="path/to/front-image.png"
      backImage="path/to/back-image.png"
      isShowFront={true}
    />,
  );
  cardElement = container.querySelector('.tarot-card');
  // Should now have 'flipped' and 'no-flip-back' classes
  expect(cardElement.classList.contains('flipped')).toBe(true);
  expect(cardElement.classList.contains('no-flip-back')).toBe(true);

  // Rerender with disabled prop
  rerender(
    <Card
      name="The Fool"
      frontImage="path/to/front-image.png"
      backImage="path/to/back-image.png"
      disabled={true}
    />,
  );

  // Should now have the 'disabled' class
  cardElement = container.querySelector('.tarot-card');
  expect(cardElement.classList.contains('disabled')).toBe(true);
});
