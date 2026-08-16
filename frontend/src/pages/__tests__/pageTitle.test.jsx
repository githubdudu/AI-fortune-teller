import { render, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SEO_TITLE } from '$/constants/seo';
import { AppContext } from '$/context/AppContextProvider';
import { useModalStore } from '$/stores/modalStore';
import UserInfoInputPage from '../UserInfoInputPage';
import UserInputPage from '../UserInputPage';
import SignUpPage from '../SignUpPage';
import FortunePage from '../FortunePage';
import UserProfile from '../UserProfile';
import NotFoundPage from '../NotFoundPage';

// Stub children that need context/network — the title is all we assert.
vi.mock('$/pages/UserInfoInputPage/components/UserDetailsForm', () => ({
  default: () => null,
}));
vi.mock('$/pages/UserInputPage/components/LoginForm', () => ({
  default: () => null,
}));

// Template: one row per route. React 19 hoists <title> to document.head,
// so rendering the page is enough — no helmet, no router needed beyond
// whatever the page itself uses.
//
// To add a route: copy a row. If the page needs mocks (firebase, axios,
// context), add the vi.mock calls at the top the same way
// UserInputPage.test.jsx does, then render it here.
const routes = [
  {
    name: 'user-info-input',
    title: SEO_TITLE.PROFILE,
    render: () => <UserInfoInputPage />,
  },
  {
    // Logged out, so UserInputPage renders the LoginForm branch and its title
    // wins over the page-level HOME title.
    name: 'login',
    title: SEO_TITLE.LOGIN,
    render: () => (
      <AppContext.Provider value={{ isLoggedIn: false }}>
        <UserInputPage />
      </AppContext.Provider>
    ),
  },
  {
    // The modal's nested title wins whenever it's open, and logging out forces
    // it back open — so HOME needs a logged-in user with the modal dismissed.
    name: 'home',
    title: SEO_TITLE.HOME,
    before: () => {
      sessionStorage.setItem('profileFetched', 'true');
      useModalStore.setState({ isModalOpen: false });
    },
    render: () => (
      <AppContext.Provider
        value={{ isLoggedIn: true, setUserProfile: () => {}, logout: () => {} }}
      >
        <UserInputPage />
      </AppContext.Provider>
    ),
  },
  {
    name: 'sign-up',
    title: SEO_TITLE.SIGN_UP,
    render: () => (
      <AppContext.Provider value={{ isLoggedIn: false }}>
        <SignUpPage />
      </AppContext.Provider>
    ),
  },
  { name: 'fortune', title: SEO_TITLE.FORTUNE, render: () => <FortunePage /> },
  { name: 'profile', title: SEO_TITLE.PROFILE, render: () => <UserProfile /> },
  { name: '*', title: SEO_TITLE.NOT_FOUND, render: () => <NotFoundPage /> },
];

describe('page titles', () => {
  afterEach(cleanup);

  it.each(routes)(
    '$name sets the tab title',
    async ({ title, before, render: r }) => {
      before?.();
      render(<MemoryRouter>{r()}</MemoryRouter>);
      await waitFor(() => expect(document.title).toBe(title));
    },
  );
});
