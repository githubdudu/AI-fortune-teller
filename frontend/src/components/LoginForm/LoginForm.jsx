/**
 * React component for the login view.
 *
 * This component displays a form that allows the user to log in with their username and password.
 * The component handles form submission, validation, and error handling, and communicates with
 * the backend server to authenticate the user and redirect them to the appropriate page.
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
import { validateEmail } from '$/utils';

const Login = () => {
  const { login } = useContext(AppContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSignInError, setEmailSignInError] = useState(null);
  const [googleSignInError, setGoogleSignInError] = useState(null);

  const [emailErrorMsg, setEmailErrorMsg] = useState(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState(null);

  const navigate = useNavigate();

  // While Firebase is trying to load the existing session, this shows a loadding message.
  if (loading) {
    return (
      <div className="View">
        <Loading />
      </div>
    );
  }

  async function handleSignIn(loginFunction, ...params) {
    try {
      setLoading(true);
      const user = await loginFunction(...params);
      if (!user || !user.accessToken) {
        throw new Error('Could not get user access token from Firebase');
      }

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
      if (error.cause === 'sign_in_with_google') {
        setGoogleSignInError(error);
        setEmailSignInError();
      } else if (error.cause === 'sign_in_with_email') {
        setEmailSignInError(error);
        setGoogleSignInError();
      }
    }
    setLoading(false);
  }

  return (
    <FormContainer withBackground={false}>
      <FormTitle title="Login" subtitle="Please enter your credentials" />
      <div className="flex flex-col gap-4 min-w-[500px]">
        {Email()}
        {Password()}
        {ErrorMessage(emailSignInError)}
        {SignInButton()}
        <AuthDivider />
        {ErrorMessage(googleSignInError)}
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
          type="email"
          size="lg"
          onChange={(e) => setEmail(e.value)}
          onBlur={validateEmail(setEmailErrorMsg)}
          onFocus={() => setEmailErrorMsg(null)}
          value={email}
          errorMessage={emailErrorMsg}
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
          onBlur={(e) => {
            if (!e.value) {
              setPasswordErrorMsg('Password is required');
            } else {
              setPasswordErrorMsg(null);
            }
          }}
          onFocus={() => setPasswordErrorMsg(null)}
          errorMessage={passwordErrorMsg}
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

  function ErrorMessage(error) {
    return (
      error &&
      error.message && (
        <div className="text-red-500 text-center">{error.message}</div>
      )
    );
  }

  function SignInButton() {
    return (
      <Button
        name="login-button"
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
