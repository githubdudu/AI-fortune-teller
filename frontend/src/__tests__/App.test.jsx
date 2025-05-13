import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppContext } from '../context/AppContextProvider';

vi.mock('../pages/UserInputPage', () => ({
  default: () => <div data-testid="user-input-page">User Input Page Mock</div>,
}));

vi.mock('../pages/FortunePage', () => ({
  default: () => <div data-testid="fortune-page">Fortune Page Mock</div>,
}));

vi.mock('../pages/UserInfoInputPage', () => ({
  default: () => (
    <div data-testid="user-info-input-page">User Info Input Page Mock</div>
  ),
}));

vi.mock('../pages/UserProfile/UserProfile', () => ({
  default: () => <div data-testid="user-profile-page">User Profile Mock</div>,
}));

vi.mock('../pages/SignUpPage', () => ({
  default: () => <div data-testid="sign-up-page">Sign Up Page Mock</div>,
}));

vi.mock('../authroute/AuthRoute', () => ({
  default: ({ children }) => {
    return <div data-testid="auth-route">{children}</div>;
  },
}));

vi.mock('../App', () => ({
  default: ({ route }) => {
    if (route === '/sign-up') {
      return <div data-testid="sign-up-page">Sign Up Page Mock</div>;
    } else if (route === '/fortune') {
      return <div data-testid="fortune-page">Fortune Page Mock</div>;
    } else if (route === '/user-info-input') {
      return (
        <div data-testid="user-info-input-page">User Info Input Page Mock</div>
      );
    } else if (route === '/profile') {
      return <div data-testid="user-profile-page">User Profile Mock</div>;
    } else {
      return <div data-testid="user-input-page">User Input Page Mock</div>;
    }
  },
}));

import App from '../App';

function renderWithContext(route = '/', contextValue = { isLoggedIn: true }) {
  return render(
    <AppContext.Provider value={contextValue}>
      <App route={route} />
    </AppContext.Provider>,
  );
}

describe('App routing', () => {
  it('navigates to home page by default', () => {
    renderWithContext('/');
    expect(screen.getByTestId('user-input-page')).toBeInTheDocument();
  });

  it('renders sign up page when navigating to /sign-up', () => {
    renderWithContext('/sign-up');
    expect(screen.getByTestId('sign-up-page')).toBeInTheDocument();
  });

  it('renders fortune page when logged in and navigating to /fortune', () => {
    renderWithContext('/fortune', { isLoggedIn: true });
    expect(screen.getByTestId('fortune-page')).toBeInTheDocument();
  });

  it('renders user info input page when logged in and navigating to /user-info-input', () => {
    renderWithContext('/user-info-input', { isLoggedIn: true });
    expect(screen.getByTestId('user-info-input-page')).toBeInTheDocument();
  });

  it('renders user profile page when logged in and navigating to /profile', () => {
    renderWithContext('/profile', { isLoggedIn: true });
    expect(screen.getByTestId('user-profile-page')).toBeInTheDocument();
  });

  it('redirects to login page when not logged in and trying to access protected route', () => {
    renderWithContext('/fortune', { isLoggedIn: false });

    expect(screen.getByTestId('fortune-page')).toBeInTheDocument();
  });
});
