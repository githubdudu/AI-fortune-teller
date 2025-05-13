import PropTypes from 'prop-types';
import { AppContext } from './AppContext.jsx';
import { useLocalStorage, useSessionStorage } from 'react-use';
import { useFortuneStream } from '$/hooks/useFortuneStream';

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

  // Default fallback text when stream fails
  const fallbackText =
    'Based on your selected cards, you are at a point of new beginnings with great potential ahead. Trust your intuition and use your resources wisely to manifest your desires.';

  // Use our custom hook for streaming functionality
  const {
    streamingText,
    isStreaming,
    streamLoading,
    streamError,
    startFortuneStream,
    cleanupStream,
    clearStreamingText,
  } = useFortuneStream({
    onSaveResult: setReadingResult,
    fallbackText,
  });

  const clearQuestionAndTheme = () => {
    setUserPrompt('');
    setUserChosenTheme(null);
  };

  const clearReadingResult = () => {
    setReadingResult(null);
    clearStreamingText();
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

    // Clear the modal state
    setIsModalOpen(true);
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
        // Streaming API from custom hook
        streamingText,
        isStreaming,
        streamLoading,
        streamError,
        startFortuneStream,
        cleanupStream,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
