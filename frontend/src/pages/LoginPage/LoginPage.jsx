/**
 * React component for the login view.
 *
 * This component displays a form that allows the user to log in with their username and password.
 * The component handles form submission, validation, and error handling, and communicates with
 * the backend server to authenticate the user and redirect them to the appropriate page.
 *
 * The component uses the React Bootstrap library for styling and UI components, and includes
 * several custom components for handling form input, authentication requests, and error messages.
 * The component may also use third-party libraries or services, such as Google or Facebook,
 * for social authentication or single sign-on.
 */

import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import axios from 'axios';

import {
  logInWithEmailAndPassword,
  signInWithGoogle,
} from '$/utils/firebase.js';

import Loading from '$/components/LoadingAnimation';
import { API_CONFIG } from '$/constants/config';
import { AppContext } from '$/context/AppContextProvider';

const Login = () => {
  const { setUserProfile } = useContext(AppContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginToken, setLoginToken] = useLocalStorage('auth_token', null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // This hook captures the callback from the Firebase authentication provider.
  // It detects if the User has been authenticated and redirects to the home page.
  useEffect(() => {
    if (loginToken) {
      navigate('/');
    }
  }, [loginToken]);

  // While Firebase is trying to load the existing session, this shows a loadding message.
  if (loading) {
    return (
      <div className="View">
        <Loading />
      </div>
    );
  }

  if (error) {
    console.error('Error logging in:', error);
  }

  async function handleSignInWithGoogle() {
    try {
      const user = await signInWithGoogle();

      setLoading(true);
      // Send the user access token to our own backend server.
      const AUTH_LOGIN_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`;
      const loginResponse = await axios.post(
        AUTH_LOGIN_URL,
        {
          firebaseToken: user.accessToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            'Access-Control-Allow-Origin': '*',
          },
          withCredentials: true,
        },
      );
      if (loginResponse.status !== 200) {
        throw new Error('Error calling the "auth/login" endpoint');
      }
      if (!loginResponse.data.user) {
        throw new Error('Error: No user data returned from the server');
      }
      // Store the access token in session storage
      setLoginToken(true);
      setUserProfile(loginResponse.data.user);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  }

  return (
    <div className="View">
      <h1>Login</h1>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email Address"
      />
      <br />
      <br />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <br />
      <br />
      <button onClick={() => logInWithEmailAndPassword(email, password)}>
        Submit
      </button>
      <br />
      <br />
      <button onClick={handleSignInWithGoogle}>Login with Google</button>
      <br />
      <br />
      <Link to="/sign-up">
        <button>I don&apos;t have an account</button>
      </Link>
    </div>
  );
};

export default Login;
