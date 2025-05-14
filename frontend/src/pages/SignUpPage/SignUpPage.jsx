/**
 * React component for the sign up form.
 *
 * This component displays a form that allows the user to sign up for a new account with the
 * application. The form may include fields for the user's name, email address, password, and
 * other relevant information, as well as validation and error handling logic to ensure that
 * the user's inputs are accurate and complete.
 *
 * The component may interact with other components or services to provide additional functionality,
 * such as social media integrations or email verification, and may communicate with the backend
 * server to create a new user account and store the user's information securely. The component may
 * also use third-party libraries or services, such as form validation or password strength
 * indicators, to enhance the user experience and provide additional security features.
 */

import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from 'gestalt';

import { registerWithEmailAndPassword } from '$/utils/firebase.js';

import Loading from '$/components/LoadingAnimation';
import FormContainer from '../../components/FormContainer';
import FormTitle from '../../components/FormTitle';
import { AppContext } from '$/context/AppContextProvider';
import { API_CONFIG } from '$/constants/config';
import apiClient from '$/utils/apiClient';
import { validateEmail } from '$/utils';
import { SEO_TITLE } from '$/constants/seo';

const SignUp = () => {
  const { isLoggedIn, login } = useContext(AppContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [usernameErrorMsg, setUsernameErrorMsg] = useState(null);
  const [emailErrorMsg, setEmailErrorMsg] = useState(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState(null);
  const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState(null);

  const navigate = useNavigate();

  // This hook captures the callback from the Firebase authentication provider.
  // It detects if the User has been authenticated and redirects to the home page.
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // While Firebase is trying to load the existing session, this shows a loadding message.
  if (loading) {
    return (
      <div className="View">
        <Loading />
      </div>
    );
  }

  if (error) {
    console.error('Error signing up:', error);
  }

  function handleNameChange(event) {
    const { value } = event;
    console.log(event);

    if (value.length > 50) {
      return;
    }
    setUsername(value);
  }

  async function handleSignUpWithEmail(userName, email, password) {
    setLoading(true);
    try {
      const user = await registerWithEmailAndPassword(
        userName,
        email,
        password,
      );

      if (!user) {
        throw new Error('Error: registering by email and password failed');
      }
      // Send the user access token to our own backend server using centralized endpoint config
      const loginResponse = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
        firebaseToken: user.accessToken,
      });

      if (!loginResponse.data.user) {
        throw new Error('Error: No user data returned from the server');
      }

      // display the success message and redirect to the login page
      alert('User created successfully! Automatically logging in...');

      login(loginResponse.data.user);
    } catch (error) {
      setError(error);
      console.error('Sign up error:', error);
    }
    setLoading(false);
  }
  return (
    <div className="bg-gradient-to-br from-yellow-100 via-pink-100 to-green-100 rounded-2xl border-2 border-white py-12 px-6 lg:px-8 font-sans">
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-10 lg:p-16 w-full">
          <title>{SEO_TITLE.SIGN_UP}</title>
          <FormContainer>
            <FormTitle title="Sign up" subtitle="Sign up to ArcanaVerse" />
            <div className="flex flex-col gap-4 min-w-[500px]">
              {Username()}
              {Email()}
              {Password()}
              {ConfirmPassword()}
              {SignUpButton()}
              {IHaveAnAccountButton()}
            </div>
          </FormContainer>
        </div>
      </div>
    </div>
  );

  function Username() {
    return (
      <div>
        <TextField
          id="username"
          label="Name"
          placeholder="Please enter your name"
          name="username"
          size="lg"
          onChange={handleNameChange}
          onBlur={(e) => {
            if (!e.value) {
              setUsernameErrorMsg('User name is required');
            } else {
              setUsernameErrorMsg(null);
            }
          }}
          onFocus={() => setUsernameErrorMsg(null)}
          errorMessage={usernameErrorMsg}
          value={username}
        />
      </div>
    );
  }

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
          placeholder="Please create your password"
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

  function ConfirmPassword() {
    return (
      <div>
        <TextField
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Please confirm your password"
          name="confirmPassword"
          size="lg"
          type="password"
          onChange={(e) => setConfirmPassword(e.value)}
          onBlur={(e) => {
            if (!e.value) {
              setConfirmPasswordErrorMsg('Confirm password is required');
            } else if (e.value !== password) {
              setConfirmPasswordErrorMsg('Passwords do not match');
            } else {
              setConfirmPasswordErrorMsg(null);
            }
          }}
          onFocus={() => setConfirmPasswordErrorMsg(null)}
          errorMessage={confirmPasswordErrorMsg}
          value={confirmPassword}
        />
      </div>
    );
  }

  function SignUpButton() {
    return (
      <Button
        text="Continue"
        name="edit-button"
        onClick={() => handleSignUpWithEmail(username, email, password)}
        size="lg"
        color="red"
      />
    );
  }

  function IHaveAnAccountButton() {
    return (
      <Button
        text="I already have an account"
        size="lg"
        color="transparent"
        onClick={() => navigate('/')}
      />
    );
  }
};

export default SignUp;
