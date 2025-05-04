import { useState } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from './AppContext.jsx';
import { useSessionStorage } from 'react-use';

export function AppContextProvider({ children }) {
  const [count, setCount] = useState(0);

  const [userPrompt, setUserPrompt] = useSessionStorage('userPrompt', '');

  return (
    <AppContext.Provider value={{ count, setCount, userPrompt, setUserPrompt }}>
      {children}
    </AppContext.Provider>
  );
}

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
