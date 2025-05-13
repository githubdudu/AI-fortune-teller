import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import LoginForm from '../LoginForm/LoginForm';
import { AppContext } from '$/context/AppContextProvider';
import { API_CONFIG } from '$/constants/config';

// Mock firebase utils
vi.mock('$/utils/firebase.js', () => ({
  logInWithEmailAndPassword: vi.fn(),
  signInWithGoogle: vi.fn(),
}));

vi.mock('$/components/LoadingAnimation', () => ({
  default: () => <div data-testid="loading-animation">Loading...</div>,
}));

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const axiosMock = new MockAdapter(axios);

// Setup function to render the LoginForm component with mocked context
function setup(
  contextValue = {
    login: vi.fn(),
    isLoggedIn: false,
  },
) {
  return render(
    <AppContext.Provider value={contextValue}>
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    </AppContext.Provider>,
  );
}

describe('LoginForm component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    navigateMock.mockClear();
  });

  afterEach(() => {
    // Reset mock adapter
    axiosMock.reset();
  });

  it('renders login form with all required elements', () => {
    setup();

    // Check for form inputs
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    expect(screen.getByText("I don't have an account")).toBeInTheDocument();

    // Check for divider
    expect(screen.getByText('Or')).toBeInTheDocument();
  });

  it('allows user to input email and password', () => {
    setup();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('calls login function with correct credentials when Sign in button is clicked', async () => {
    const mockLogin = vi.fn();
    setup({ login: mockLogin, isLoggedIn: false });

    // Mock firebase login
    const { logInWithEmailAndPassword } = await import('$/utils/firebase.js');
    logInWithEmailAndPassword.mockResolvedValue({ accessToken: 'test-token' });

    // Mock axios response for login API
    const AUTH_LOGIN_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`;
    axiosMock.onPost(AUTH_LOGIN_URL).reply(200, {
      user: { id: '123', email: 'test@example.com' },
    });

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const signInButton = screen.getByText('Sign in');
    fireEvent.click(signInButton);

    expect(logInWithEmailAndPassword).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
    );

    // Wait for the API call to complete and the login callback to be called
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        id: '123',
        email: 'test@example.com',
      });
    });
  });

  it('triggers Google sign in when Google button is clicked', async () => {
    const mockLogin = vi.fn();
    setup({ login: mockLogin, isLoggedIn: false });

    // Mock firebase Google login
    const { signInWithGoogle } = await import('$/utils/firebase.js');
    signInWithGoogle.mockResolvedValue({ accessToken: 'google-token' });

    // Mock axios response for login API
    const AUTH_LOGIN_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`;
    axiosMock.onPost(AUTH_LOGIN_URL).reply(200, {
      user: { id: '456', email: 'google@example.com' },
    });

    const googleButton = screen.getByText('Sign in with Google');
    fireEvent.click(googleButton);

    expect(signInWithGoogle).toHaveBeenCalled();

    // Wait for the API call to complete and the login callback to be called
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        id: '456',
        email: 'google@example.com',
      });
    });
  });

  it('shows loading state during authentication', async () => {
    // Mock console.log to avoid cluttering test output
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    setup();

    // Mock slow firebase login response
    const { logInWithEmailAndPassword } = await import('$/utils/firebase.js');
    let resolveFirebaseLogin;

    logInWithEmailAndPassword.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFirebaseLogin = () => resolve({ accessToken: 'token' });
          // Don't resolve immediately to keep loading state active
        }),
    );

    // Input credentials and sign in
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const signInButton = screen.getByText('Sign in');
    fireEvent.click(signInButton);

    expect(logInWithEmailAndPassword).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
    );

    if (resolveFirebaseLogin) resolveFirebaseLogin();

    consoleLogSpy.mockRestore();
  });

  it('handles authentication errors correctly', async () => {
    // Mock console.error to verify error logging
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    setup();

    // Mock firebase login failure
    const { logInWithEmailAndPassword } = await import('$/utils/firebase.js');
    logInWithEmailAndPassword.mockRejectedValue(
      new Error('Invalid credentials'),
    );

    // Input credentials and sign in
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong-password' } });

    const signInButton = screen.getByText('Sign in');
    fireEvent.click(signInButton);

    // Wait for the error to be logged
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('handles API error during login process', async () => {
    // Mock console.error to verify error logging
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    setup();

    // Mock successful firebase login but failed API response
    const { logInWithEmailAndPassword } = await import('$/utils/firebase.js');
    logInWithEmailAndPassword.mockResolvedValue({ accessToken: 'test-token' });

    // Mock axios response for login API - simulate error
    const AUTH_LOGIN_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`;
    axiosMock.onPost(AUTH_LOGIN_URL).reply(401, { message: 'Unauthorized' });

    // Input credentials and sign in
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const signInButton = screen.getByText('Sign in');
    fireEvent.click(signInButton);

    // Wait for the error to be logged
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('navigates to sign-up page when signup button is clicked', () => {
    setup();

    const signUpButton = screen.getByText("I don't have an account");
    fireEvent.click(signUpButton);

    // Verify navigation was called with the correct path
    expect(navigateMock).toHaveBeenCalledWith('/sign-up');
  });
});
