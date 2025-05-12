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

import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { login } = useContext(AppContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

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

  async function handleSignIn(loginFunction, ...params) {
    try {
      const user = await loginFunction(...params);
      if (!user || !user.accessToken) {
        throw new Error('Error: no user data or no access token');
      }

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
      // login
      login(loginResponse.data.user);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  }

  return (
    <FormContainer withBackground={false}>
      <FormTitle title="Login" subtitle="Please enter your credentials" />
      <div className="flex flex-col gap-4 min-w-[500px]">
        {Email()}
        {Password()}
        {SignInButton()}
        <AuthDivider />
        {SignInWithGoogleButton()}
        {IDontHaveAnAccountButton()}
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
        onClick={async () =>
          handleSignIn(logInWithEmailAndPassword, email, password)
        }
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
        onClick={async () => handleSignIn(signInWithGoogle)}
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
