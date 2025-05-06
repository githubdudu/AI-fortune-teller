import PropTypes from 'prop-types';
import { AppContext } from './AppContext.jsx';
import { useSessionStorage } from 'react-use';

export function AppContextProvider({ children }) {
  const [userPrompt, setUserPrompt] = useSessionStorage('userPrompt', '');
  const [userChosenTheme, setUserChosenTheme] = useSessionStorage(
    'userChosenTheme',
    null,
  );

  const [userInfo, setUserInfo] = useSessionStorage('userInfo', null);

  return (
    <AppContext.Provider
      value={{
        userPrompt,
        saveUserPrompt: setUserPrompt,
        userChosenTheme,
        saveUserChosenTheme: setUserChosenTheme,
        userInfo,
        saveUserInfo: setUserInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
