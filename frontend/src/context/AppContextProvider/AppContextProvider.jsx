import { useState } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from './AppContext.jsx';

export function AppContextProvider({ children }) {
  const [count, setCount] = useState(0);

  return (
    <AppContext.Provider value={{ count, setCount }}>
      {children}
    </AppContext.Provider>
  );
}

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
