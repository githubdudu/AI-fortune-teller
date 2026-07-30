import '@testing-library/jest-dom';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AppContext } from '$/context/AppContextProvider';
import { useModalStore } from '$/stores/modalStore';
import UserInputPage from '../UserInputPage/UserInputPage';

// Mock axios requests
const axiosMock = new MockAdapter(axios);

// Mock child components to simplify testing
vi.mock('$/pages/UserInputPage/components/UserQuestionInput', () => ({
  default: () => <div data-testid="user-question-input">UserQuestionInput</div>,
}));

vi.mock('$/pages/UserInputPage/components/ThemeView', () => ({
  default: () => <div data-testid="theme-view">ThemeView</div>,
}));

vi.mock('$/pages/UserInputPage/components/FloatingPrompt', () => ({
  default: ({ children, visible }) => (
    <div data-testid="floating-prompt" data-visible={visible.toString()}>
      {children}
    </div>
  ),
}));

vi.mock('$/pages/UserInputPage/components/DailyFortuneContent', () => ({
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

vi.mock('$/pages/UserInputPage/components/LoginForm', () => ({
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
  setUserProfile = vi.fn(),
  profileFetched = false,
  logout = vi.fn(),
} = {}) {
  // Modal state lives in the zustand store, not in AppContext
  useModalStore.setState({ isModalOpen });

  // profileFetched is page-local state read from sessionStorage
  // (react-use useSessionStorage stores JSON-serialized values)
  sessionStorage.setItem('profileFetched', JSON.stringify(profileFetched));

  return render(
    <AppContext.Provider
      value={{
        isLoggedIn,
        userProfile,
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
    sessionStorage.clear();
    useModalStore.setState({ isModalOpen: true });

    axiosMock.onGet(/.*\/api\/v1\/Users\/\d+/).reply(200, mockUserProfile);
    axiosMock.onGet(/.*\/api\/v1\/Users\/me/).reply(200, mockUserProfile);
    axiosMock.onGet(/.*\/api\/v1\/Users.*/).reply(200, mockUserProfile);
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

    setup({ isLoggedIn: false, profileFetched: false });

    await waitFor(() => {
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    // Should not show DailyFortuneContent
    expect(
      screen.queryByTestId('daily-fortune-content'),
    ).not.toBeInTheDocument();
  });

  it('shows DailyFortuneContent when user is logged in and profile is fetched', async () => {
    // Mock API responses
    axiosMock
      .onGet('http://localhost:5000/api/v1/Users/me')
      .reply(200, mockUserProfile);

    axiosMock
      .onGet('http://localhost:5000/api/v1/DailyFortunes/me')
      .reply(200, mockDailyFortune);

    setup({ isLoggedIn: true, profileFetched: true });

    expect(screen.getByTestId('daily-fortune-content')).toBeInTheDocument();

    // Should not show LoginForm
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });

  it('handles error state when daily fortune fetch fails', async () => {
    // Mock API error
    axiosMock.onGet('http://localhost:5000/api/v1/DailyFortunes/me').reply(500);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    setup({ isLoggedIn: true, profileFetched: true });

    await waitFor(() => {
      const fortuneContent = screen.getByTestId('daily-fortune-content');
      expect(fortuneContent).toHaveAttribute(
        'data-error',
        'Failed to load your daily fortune',
      );
    });

    consoleSpy.mockRestore();
  });

  it('passes correct visibility state to FloatingPrompt', async () => {
    // Mock API responses
    axiosMock
      .onGet('http://localhost:5000/api/v1/DailyFortunes/me')
      .reply(200, mockDailyFortune);

    // profileFetched: true so the profile-fetch effect doesn't overwrite
    // the modal state we seed into the store
    setup({ isModalOpen: true, profileFetched: true });

    const floatingPrompt = screen.getByTestId('floating-prompt');
    expect(floatingPrompt).toHaveAttribute('data-visible', 'true');

    // Reset and test with modal closed
    cleanup();
    setup({ isModalOpen: false, profileFetched: true });

    const closedFloatingPrompt = screen.getByTestId('floating-prompt');
    expect(closedFloatingPrompt).toHaveAttribute('data-visible', 'false');
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
