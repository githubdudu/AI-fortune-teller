import PropTypes from 'prop-types';
import { AppContext } from './AppContext.jsx';
import { useLocalStorage, useSessionStorage } from 'react-use';
import { useEffect, useCallback } from 'react';
import { setLogoutHandler } from '$/utils/apiClient';

import { logout as firebaseLogout } from '$/utils/firebase.js';

export function AppContextProvider({ children }) {
  // Original state
  const [userPrompt, setUserPrompt] = useSessionStorage('userPrompt', '');
  const [userChosenTheme, setUserChosenTheme] = useSessionStorage(
    'userChosenTheme',
    null,
  );

  const [userChosenCards, setUserChosenCards] = useSessionStorage(
    'userChosenCards',
    null,
  );

  const [userProfile, setUserProfile] = useSessionStorage('userProfile', null);

  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('isLoggedIn', null);

  const clearQuestionAndTheme = () => {
    setUserPrompt('');
    setUserChosenTheme(null);
  };

  const login = (profile) => {
    setIsLoggedIn(true);
    setUserProfile(profile);
  };

  const logout = useCallback(() => {
    // Clear the local storage
    setIsLoggedIn(false);
    // Log out from Firebase
    firebaseLogout();

    // Clear the session storage
    setUserProfile(null);
    setUserChosenCards(null);
    setUserPrompt('');
    setUserChosenTheme(null);
  }, [
    setIsLoggedIn,
    setUserProfile,
    setUserChosenCards,
    setUserPrompt,
    setUserChosenTheme,
  ]);

  // Register logout handler with API client
  useEffect(() => {
    // Register the logout function with the API client to handle 401 errors globally
    setLogoutHandler(logout);

    return () => {
      // Clean up by unsetting the handler when component unmounts
      setLogoutHandler(null);
    };
  }, [logout]);

  return (
    <AppContext.Provider
      value={{
        userChosenCards,
        saveUserChosenCards: setUserChosenCards,
        userPrompt,
        saveUserPrompt: setUserPrompt,
        userChosenTheme,
        saveUserChosenTheme: setUserChosenTheme,
        clearQuestionAndTheme,
        userProfile,
        setUserProfile,
        login,
        logout,
        isLoggedIn,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
