import PropTypes from 'prop-types';
import { AppContext } from './AppContext.jsx';
import { useLocalStorage, useSessionStorage } from 'react-use';

import { logout as firebaseLogout } from '$/utils/firebase.js';

export function AppContextProvider({ children }) {
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

  const logout = () => {
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
  };

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
        toggleModalOpen,
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
