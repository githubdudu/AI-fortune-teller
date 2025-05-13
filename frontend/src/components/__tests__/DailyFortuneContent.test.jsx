import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import DailyFortuneContent from '../DailyFortuneContent/DailyFortuneContent';

/**
 * Tests that the component renders initial prompt text when no data is supplied.
 */
it('renders initial prompt text correctly', () => {
  const onClick = vi.fn();
  const { getByText } = render(<DailyFortuneContent onClick={onClick} />);

  expect(getByText('Start Reading')).toBeInTheDocument();

  // Should show loading message when no fortune data is provided
  expect(getByText('Loading your daily fortune...')).toBeInTheDocument();
});

/**
 * Tests that loading state is displayed correctly.
 */
it('renders loading state correctly', () => {
  const onClick = vi.fn();
  const { getByText } = render(
    <DailyFortuneContent onClick={onClick} loading={true} />,
  );

  // Check that loading message appears
  expect(getByText('Loading themes...')).toBeInTheDocument();
});

/**
 * Tests that error state is displayed correctly.
 */
it('renders error state correctly', () => {
  const onClick = vi.fn();
  const errorMessage = 'Could not load fortune';
  const { getByText } = render(
    <DailyFortuneContent onClick={onClick} error={errorMessage} />,
  );

  // Check that error message appears
  expect(getByText(errorMessage)).toBeInTheDocument();
});

/**
 * Tests that daily fortune data is displayed correctly.
 */
it('renders fortune data correctly', () => {
  const onClick = vi.fn();
  const mockFortune = {
    luckyNumber: 7,
    luckyColor: 'Purple',
    advice: 'Trust your instincts today.',
  };

  const { getByText } = render(
    <DailyFortuneContent onClick={onClick} dailyFortune={mockFortune} />,
  );

  // Check that fortune data appears correctly
  expect(getByText('Your lucky number')).toBeInTheDocument();
  expect(getByText('7')).toBeInTheDocument();

  expect(getByText('Your lucky colour')).toBeInTheDocument();
  expect(getByText('Purple')).toBeInTheDocument();

  expect(getByText('Piece of advice:')).toBeInTheDocument();
  expect(getByText('Trust your instincts today.')).toBeInTheDocument();
});

/**
 * Tests that the button calls the onClick function when clicked.
 */
it('calls onClick when button is clicked', () => {
  const onClick = vi.fn();
  const { getByText } = render(<DailyFortuneContent onClick={onClick} />);

  const button = getByText('Start Reading');
  fireEvent.click(button);

  // Check that onClick was called
  expect(onClick).toHaveBeenCalledTimes(1);
});

/**
 * Tests that the color swatch has the correct background color.
 */
it('displays the correct color for the color swatch', () => {
  const onClick = vi.fn();
  const mockFortune = {
    luckyNumber: 12,
    luckyColor: 'Blue',
    advice: 'Take a chance on something new today.',
  };

  const { container } = render(
    <DailyFortuneContent onClick={onClick} dailyFortune={mockFortune} />,
  );

  // Find the color swatch element and check its background color
  const colorSwatch = container.querySelector('.color-swatch');
  expect(colorSwatch).toHaveStyle('background-color: #0000FF');
});
