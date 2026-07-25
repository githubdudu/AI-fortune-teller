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

  const [readingResult, setReadingResult] = useSessionStorage(
    'readingResult',
    null,
  );

  const [userInfo, setUserInfo] = useSessionStorage('userInfo', null);
  const [userProfile, setUserProfile] = useSessionStorage('userProfile', null);

  const [isModalOpen, setIsModalOpen] = useSessionStorage('isModalOpen', true);

  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('isLoggedIn', null);

  const [profileFetched, setProfileFetched] = useSessionStorage(
    'profileFetched',
    false,
  );

  const [loginLoading, setLoginLoading] = useSessionStorage(
    'loginLoading',
    false,
  );

  const clearQuestionAndTheme = () => {
    setUserPrompt('');
    setUserChosenTheme(null);
  };

  const clearReadingResult = () => {
    setReadingResult(null);
  };

  const toggleModalOpen = () => {
    setIsModalOpen((prev) => !prev);
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
    setUserInfo(null);
    setUserChosenCards(null);
    setUserPrompt('');
    setUserChosenTheme(null);
    setReadingResult(null);

    setProfileFetched(false);
    setLoginLoading(false);

    // Clear the modal state
    setIsModalOpen(true);
  }, [
    setIsLoggedIn,
    setUserProfile,
    setUserInfo,
    setUserChosenCards,
    setUserPrompt,
    setUserChosenTheme,
    setReadingResult,
    setProfileFetched,
    setLoginLoading,
    setIsModalOpen,
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
        userInfo,
        saveUserInfo: setUserInfo,
        clearQuestionAndTheme,
        userProfile,
        setUserProfile,
        readingResult,
        saveReadingResult: setReadingResult,
        clearReadingResult,
        isModalOpen,
        setIsModalOpen,
        toggleModalOpen,
        login,
        logout,
        isLoggedIn,
        profileFetched,
        setProfileFetched,
        loginLoading,
        setLoginLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
