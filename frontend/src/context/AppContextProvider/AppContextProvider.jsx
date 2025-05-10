import PropTypes from 'prop-types';
import { AppContext } from './AppContext.jsx';
import { useSessionStorage } from 'react-use';

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
