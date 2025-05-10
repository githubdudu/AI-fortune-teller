import { useContext } from 'react';
import { AppContext } from '$/context/AppContextProvider';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function AuthRoute({ children }) {
  const { isLoggedIn } = useContext(AppContext);

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }
  return children;
}
export default AuthRoute;

AuthRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
