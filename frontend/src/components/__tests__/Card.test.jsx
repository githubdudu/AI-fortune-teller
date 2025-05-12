import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '../Card/Card';

/**
 * Tests that the card is initially displayed showing the back of the card.
 */
it('renders correctly with back side showing initially', () => {
  const { getByAltText, queryByText } = render(
    <Card
      name="The Fool"
      description="The Fool symbolizes key aspects of the human journey."
      frontImage="path/to/front-image.png"
      backImage="path/to/back-image.png"
    />,
  );

  // Should show the back image
  expect(getByAltText('Tarot Card Back')).toBeInTheDocument();

  // Should not show the title or description since card is not flipped
  expect(queryByText('The Fool')).toBeNull();
  expect(
    queryByText('The Fool symbolizes key aspects of the human journey.'),
  ).toBeNull();
});

/**
 * Tests that clicking the card flips it and shows the front side with description.
 */
it('flips and shows front side with description when clicked', () => {
  const { getByAltText, getByText, container } = render(
    <Card
      name="The Fool"
      description="The Fool symbolizes key aspects of the human journey."
      frontImage="path/to/front-image.png"
      backImage="path/to/back-image.png"
    />,
  );

  // Click the card to flip it
  const card = container.querySelector('.tarot-card');
  fireEvent.click(card);

  // Should show the front image
  expect(getByAltText('Tarot Card Front')).toBeInTheDocument();

  // Should now show the title and description
  expect(getByText('The Fool')).toBeInTheDocument();
  expect(
    getByText('The Fool symbolizes key aspects of the human journey.'),
  ).toBeInTheDocument();
});

/**
 * Tests that the card respects the initialFlipped prop.
 */
it('shows front side initially when initialFlipped is true', () => {
  const { getByAltText, getByText } = render(
    <Card
      name="The Fool"
      description="The Fool symbolizes key aspects of the human journey."
      frontImage="path/to/front-image.png"
      backImage="path/to/back-image.png"
      initialFlipped={true}
    />,
  );

  // Should show the front image
  expect(getByAltText('Tarot Card Front')).toBeInTheDocument();

  // Should show the title and description since card is flipped
  expect(getByText('The Fool')).toBeInTheDocument();
  expect(
    getByText('The Fool symbolizes key aspects of the human journey.'),
  ).toBeInTheDocument();
});

/**
 * Tests that the card does not flip when disabled.
 */
it('does not flip when disabled prop is true', () => {
  const { getByAltText, queryByText, container } = render(
    <Card
      name="The Fool"
      description="The Fool symbolizes key aspects of the human journey."
      frontImage="path/to/front-image.png"
      backImage="path/to/back-image.png"
      disabled={true}
    />,
  );

  // Click the card to attempt flipping
  const card = container.querySelector('.tarot-card');
  fireEvent.click(card);

  // Should still show the back image
  expect(getByAltText('Tarot Card Back')).toBeInTheDocument();

  // Should not show the title or description since card did not flip
  expect(queryByText('The Fool')).toBeNull();
  expect(
    queryByText('The Fool symbolizes key aspects of the human journey.'),
  ).toBeNull();
});

/**
 * Tests that the card calls the onCardFlip callback with the correct value.
 */
it('calls onCardFlip with correct value when flipped', () => {
  const mockFlipHandler = vi.fn();
  const { container } = render(
    <Card
      name="The Fool"
      description="The Fool symbolizes key aspects of the human journey."
      frontImage="path/to/front-image.png"
      backImage="path/to/back-image.png"
      onCardFlip={mockFlipHandler}
    />,
  );

  // Click the card to flip it
  const card = container.querySelector('.tarot-card');
  fireEvent.click(card);

  // Should call the flip handler with true (flipped to front)
  expect(mockFlipHandler).toHaveBeenCalledWith(true);
});

/**
 * Tests that the card does not flip back once it has been flipped to the front.
 */
it('does not flip back once flipped to front', () => {
  const { getByAltText, getByText, container } = render(
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
  expect(getByText('The Fool')).toBeInTheDocument();

  // Click the card again to try to flip it back
  fireEvent.click(card);

  // Should still show the front image and text (not flipping back)
  expect(getByAltText('Tarot Card Front')).toBeInTheDocument();
  expect(getByText('The Fool')).toBeInTheDocument();
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
    />,
  );

  // Initially should not have 'flipped' or 'disabled' classes
  let cardElement = container.querySelector('.tarot-card');
  expect(cardElement.classList.contains('flipped')).toBe(false);
  expect(cardElement.classList.contains('disabled')).toBe(false);
  expect(cardElement.classList.contains('no-flip-back')).toBe(false);

  // Click to flip
  fireEvent.click(cardElement);

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
