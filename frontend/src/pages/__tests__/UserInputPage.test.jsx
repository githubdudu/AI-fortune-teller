import '@testing-library/jest-dom';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AppContext } from '$/context/AppContextProvider';
import UserInputPage from '../UserInputPage/UserInputPage';

// Mock axios requests
const axiosMock = new MockAdapter(axios);

// Mock child components to simplify testing
vi.mock('../../components/UserQuestionInput', () => ({
  default: () => <div data-testid="user-question-input">UserQuestionInput</div>,
}));

vi.mock('../../components/ThemeView', () => ({
  default: () => <div data-testid="theme-view">ThemeView</div>,
}));

vi.mock('../../components/FloatingPrompt/FloatingPrompt', () => ({
  default: ({ children, visible, shouldReduceMotion }) => (
    <div
      data-testid="floating-prompt"
      data-visible={visible.toString()}
      data-reduce-motion={shouldReduceMotion.toString()}
    >
      {children}
    </div>
  ),
}));

vi.mock('../../components/DailyFortuneContent/DailyFortuneContent', () => ({
  default: ({ loading, error, dailyFortune, onClick }) => (
    <div
      data-testid="daily-fortune-content"
      data-loading={loading.toString()}
      data-error={error || 'none'}
      data-has-fortune={Boolean(dailyFortune).toString()}
    >
      DailyFortuneContent
      <button onClick={onClick}>Toggle Modal</button>
    </div>
  ),
}));

vi.mock('$/components/LoginForm', () => ({
  default: () => <div data-testid="login-form">LoginForm</div>,
}));

// Mock navigate
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// Mock API responses
const mockDailyFortune = {
  luckyNumber: 7,
  luckyColor: 'Blue',
  advice: 'Trust your intuition today.',
};

const mockUserProfile = {
  id: '123',
  email: 'test@example.com',
  displayName: 'Test User',
  bornCountry: 'US',
  dateOfBirth: '1990-01-01',
  gender: 'Male',
  residenceCountry: 'US',
};

function setup({
  isLoggedIn = true,
  isModalOpen = false,
  userProfile = mockUserProfile,
  toggleModalOpen = vi.fn(),
  setUserProfile = vi.fn(),
  logout = vi.fn(),
} = {}) {
  return render(
    <AppContext.Provider
      value={{
        isLoggedIn,
        isModalOpen,
        userProfile,
        toggleModalOpen,
        setUserProfile,
        logout,
      }}
    >
      <BrowserRouter>
        <UserInputPage />
      </BrowserRouter>
    </AppContext.Provider>,
  );
}

describe('UserInputPage component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    axiosMock.reset();
    navigateMock.mockClear();

    axiosMock.onGet(/.*\/api\/v1\/users\/\d+/).reply(200, mockUserProfile);
    axiosMock.onGet(/.*\/api\/v1\/users\/me/).reply(200, mockUserProfile);
    axiosMock.onGet(/.*\/api\/v1\/users.*/).reply(200, mockUserProfile);
  });

  it('renders basic UI elements correctly', async () => {
    // Mock API responses
    axiosMock
      .onGet('http://localhost:5000/api/v1/DailyFortunes/me')
      .reply(200, mockDailyFortune);

    setup();

    // Check main UI components
    expect(screen.getByTestId('user-question-input')).toBeInTheDocument();
    expect(screen.getByTestId('theme-view')).toBeInTheDocument();
    expect(screen.getByTestId('floating-prompt')).toBeInTheDocument();

    // Check theme selection headers
    expect(screen.getByText('- or -')).toBeInTheDocument();
    expect(
      screen.getByText('Select a theme to let fate speak first.'),
    ).toBeInTheDocument();
  });

  it('shows LoginForm when user is not logged in', async () => {
    // Mock API responses
    axiosMock
      .onGet('http://localhost:5000/api/v1/DailyFortunes/me')
      .reply(200, mockDailyFortune);

    setup({ isLoggedIn: false });

    await waitFor(() => {
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    // Should not show DailyFortuneContent
    expect(
      screen.queryByTestId('daily-fortune-content'),
    ).not.toBeInTheDocument();
  });

  it('shows DailyFortuneContent when user is logged in', async () => {
    // Mock API responses
    axiosMock
      .onGet('http://localhost:5000/api/v1/DailyFortunes/me')
      .reply(200, mockDailyFortune);

    setup({ isLoggedIn: true });

    await waitFor(() => {
      expect(screen.getByTestId('daily-fortune-content')).toBeInTheDocument();
    });

    // Should not show LoginForm
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });

  it('handles error state when daily fortune fetch fails', async () => {
    // Mock API error
    axiosMock.onGet('http://localhost:5000/api/v1/DailyFortunes/me').reply(500);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    setup();

    await waitFor(() => {
      const fortuneContent = screen.getByTestId('daily-fortune-content');
      expect(fortuneContent).toHaveAttribute(
        'data-error',
        'Failed to load your daily fortune',
      );
    });

    consoleSpy.mockRestore();
  });

  it('redirects to user-info-input when profile information is missing', async () => {
    // Mock API responses
    axiosMock
      .onGet('http://localhost:5000/api/v1/DailyFortunes/me')
      .reply(200, mockDailyFortune);

    // Mock incomplete user profile
    const incompleteProfile = {
      id: '123',
      email: 'test@example.com',
      // Missing required fields: bornCountry, dateOfBirth, gender, residenceCountry
    };

    // Mock user profile API response
    axiosMock.onGet(/.*\/api\/v1\/Users.*/).reply(200, incompleteProfile);

    setup({ userProfile: incompleteProfile });

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/user-info-input');
    });
  });

  it('calls toggleModalOpen when modal toggle button is clicked', async () => {
    // Mock API responses
    axiosMock
      .onGet('http://localhost:5000/api/v1/DailyFortunes/me')
      .reply(200, mockDailyFortune);

    const toggleModalOpen = vi.fn();
    setup({ toggleModalOpen });

    await waitFor(() => {
      expect(screen.getByTestId('daily-fortune-content')).toBeInTheDocument();
    });

    // Click the toggle button in DailyFortuneContent
    const toggleButton = screen.getByText('Toggle Modal');
    toggleButton.click();

    expect(toggleModalOpen).toHaveBeenCalled();
  });

  it('passes correct visibility state to FloatingPrompt', async () => {
    // Mock API responses
    axiosMock
      .onGet('http://localhost:5000/api/v1/DailyFortunes/me')
      .reply(200, mockDailyFortune);

    // Test with modal open
    setup({ isModalOpen: true });

    const floatingPrompt = screen.getByTestId('floating-prompt');
    expect(floatingPrompt).toHaveAttribute('data-visible', 'true');

    // Reset and test with modal closed
    cleanup();
    setup({ isModalOpen: false });

    const closedFloatingPrompt = screen.getByTestId('floating-prompt');
    expect(closedFloatingPrompt).toHaveAttribute('data-visible', 'false');
  });

  it('sets noMotionFlag correctly based on login state', async () => {
    // Mock API responses
    axiosMock
      .onGet('http://localhost:5000/api/v1/DailyFortunes/me')
      .reply(200, mockDailyFortune);

    // When logged in
    setup({ isLoggedIn: true });

    let floatingPrompt = screen.getByTestId('floating-prompt');
    expect(floatingPrompt).toHaveAttribute('data-reduce-motion', 'false');

    // Reset and test when not logged in
    cleanup();
    setup({ isLoggedIn: false });

    floatingPrompt = screen.getByTestId('floating-prompt');
    expect(floatingPrompt).toHaveAttribute('data-reduce-motion', 'true');
  });

  describe('Cleanup behavior', () => {
    it('cleans up API calls on unmount', async () => {
      // Mock API responses
      axiosMock
        .onGet('http://localhost:5000/api/v1/DailyFortunes/me')
        .reply(200, mockDailyFortune);

      const { unmount } = setup();

      unmount();
    });
  });
});
