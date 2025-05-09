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
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import axios from 'axios';
import { TextField, Button } from 'gestalt';

import {
  logInWithEmailAndPassword,
  signInWithGoogle,
} from '$/utils/firebase.js';

import Loading from '$/components/LoadingAnimation';
import { API_CONFIG } from '$/constants/config';
import { AppContext } from '$/context/AppContextProvider';
import FormContainer from '../../components/FormContainer';
import FormTitle from '../../components/FormTitle';

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
    <FormContainer>
      <FormTitle title="Login" subtitle="Please enter your credentials" />
      <div className="flex flex-col gap-4 min-w-[500px]">
        <Email />
        <Password />
        <SignInButton />
        <AuthDivider />
        <SignInWithGoogleButton />
        <IDontHaveAnAccountButton />
      </div>
    </FormContainer>
  );

  function Email() {
    return (
      <div>
        <TextField
          id="email"
          label="Email"
          placeholder="Please enter your email address"
          name="email"
          size="lg"
          onChange={(e) => setEmail(e.value)}
          value={email}
        />
      </div>
    );
  }

  function Password() {
    return (
      <div>
        <TextField
          id="password"
          label="Password"
          placeholder="Please enter your password"
          name="password"
          size="lg"
          type="password"
          onChange={(e) => setPassword(e.value)}
          value={password}
        />
      </div>
    );
  }

  function AuthDivider() {
    return (
      <div
        className="flex items-center text-center mt-3 
          before:relative before:inline-block  before:w-1/2 before:h-px before:bg-gray-300 before:right-[0.5em]
          after:relative after:inline-block  after:w-1/2 after:h-px after:bg-gray-300 after:left-[0.5em]"
      >
        Or
      </div>
    );
  }
  function SignInButton() {
    return (
      <Button
        text="Sign in"
        onClick={() => logInWithEmailAndPassword(email, password)}
        size="lg"
        color="red"
      />
    );
  }

  function SignInWithGoogleButton() {
    return (
      <Button
        text="Sign in with Google"
        type="button"
        size="lg"
        onClick={handleSignInWithGoogle}
      />
    );
  }

  function IDontHaveAnAccountButton() {
    return (
      <Button
        text="I don't have an account"
        size="lg"
        color="transparent"
        onClick={() => navigate('/sign-up')}
      />
    );
  }
};

export default Login;
