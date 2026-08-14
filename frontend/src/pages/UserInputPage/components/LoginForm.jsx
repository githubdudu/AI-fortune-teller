/**
 * React component for the login view.
 *
 * This component displays a form that allows the user to log in with their username and password.
 * The component handles form submission, validation, and error handling, and communicates with
 * the backend server to authenticate the user and redirect them to the appropriate page.
 */

import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, IconButton, FixedZIndex } from 'gestalt';
import PropTypes from 'prop-types';

import {
  logInWithEmailAndPassword,
  signInWithGoogle,
} from '$/utils/firebase.js';

import Loading from '$/components/LoadingAnimation';
import { API_CONFIG } from '$/constants/config';
import { AppContext } from '$/context/AppContextProvider';
import FormContainer from '$/components/FormContainer';
import FormTitle from '$/components/FormTitle';
import { validateEmail } from '$/utils';
import apiClient from '$/utils/apiClient';

const Login = ({ loginLoading = false, setLoginLoading }) => {
  const { login } = useContext(AppContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailSignInError, setEmailSignInError] = useState(null);
  const [googleSignInError, setGoogleSignInError] = useState(null);

  const [emailErrorMsg, setEmailErrorMsg] = useState(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState(null);

  const navigate = useNavigate();

  // While Firebase is trying to load the existing session, this shows a loading message.
  if (loginLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center w-full h-full">
        <Loading text="Logging in..." />
      </div>
    );
  }

  async function handleSignIn(loginFunction, ...params) {
    try {
      setLoginLoading(true);
      const user = await loginFunction(...params);
      const { cause } = params[params.length - 1];
      if (!user || !user.accessToken) {
        throw new Error('Could not get user access token from Firebase', {
          cause,
        });
      }

      setLoginLoading(true);
      // Send the user access token to our own backend server using centralized endpoint config
      const loginResponse = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
        firebaseToken: user.accessToken,
      });

      if (!loginResponse.data.user) {
        throw new Error('Error: No user data returned from the server', {
          cause,
        });
      }
      // login
      login(loginResponse.data.user);
    } catch (error) {
      console.error(error);
      if (error.cause === 'sign_in_with_google') {
        setGoogleSignInError(error);
        setEmailSignInError();
      } else if (error.cause === 'sign_in_with_email') {
        setEmailSignInError(error);
        setGoogleSignInError();
      }
      // In a normal flow if there is no error, the loading state won't be set to false.
      // The "getUserProfile" function will set it to false.
      setLoginLoading(false);
    }
  }

  return (
    <div className={`flex flex-col items-center rounded-xl`}>
      <FormTitle title="Login" subtitle="Please enter your credentials" />
      <div className="flex flex-col gap-4 sm:min-w-[500px] w-full select-text">
        {Email()}
        {Password()}
        {ErrorMessage(emailSignInError)}
        {SignInButton()}
        <AuthDivider />
        {ErrorMessage(googleSignInError)}
        {SignInWithGoogleButton()}
        {IDontHaveAnAccountButton()}
      </div>
    </div>
  );

  function Email() {
    return (
      <div>
        <DemoAccountLabel
          htmlFor="email"
          text="Email"
          demoLabel="demo account: "
          demoValue="arcanaverse-demo@email.com"
        />
        <TextField
          id="email"
          label="Email"
          labelDisplay="hidden"
          placeholder="Please enter your email address"
          name="email"
          type="email"
          size="lg"
          onChange={(e) => setEmail(e.value)}
          onBlur={validateEmail(setEmailErrorMsg)}
          onFocus={() => setEmailErrorMsg(null)}
          value={email}
          errorMessage={emailErrorMsg}
          helperText="Please enter your email address"
        />
      </div>
    );
  }

  function Password() {
    return (
      <div>
        <DemoAccountLabel
          htmlFor="password"
          text="Password"
          demoLabel="demo account: "
          demoValue="p@ssword-demo"
        />
        <TextField
          id="password"
          label="Password"
          labelDisplay="hidden"
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
          before:relative before:inline-block  before:w-1/2 before:h-px before:bg-ink/15 before:right-[0.5em]
          after:relative after:inline-block  after:w-1/2 after:h-px after:bg-ink/15 after:left-[0.5em]"
      >
        Or
      </div>
    );
  }

  function ErrorMessage(error) {
    return (
      error &&
      error.message && (
        <div className="text-danger text-center">{error.message}</div>
      )
    );
  }

  function SignInButton() {
    return (
      <Button
        name="login-button"
        text="Sign in"
        onClick={async () =>
          handleSignIn(logInWithEmailAndPassword, email, password, {
            cause: 'sign_in_with_email',
          })
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
        onClick={async () =>
          handleSignIn(signInWithGoogle, { cause: 'sign_in_with_google' })
        }
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

/**
 * A visible label for a Gestalt TextField whose built-in label is hidden, so we
 * can mix in an underlined demo-account hint and a click-to-copy icon button.
 */
// LoginForm renders inside FloatingPrompt, whose overlay sits at `z-5`
const TOOLTIP_ZINDEX = new FixedZIndex(10);

function DemoAccountLabel({ htmlFor, text, demoLabel, demoValue }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(demoValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mb-1 flex max-[360px]:flex-col flex-wrap items-center max-[360px]:items-start gap-x-1 text-sm">
      <label htmlFor={htmlFor} className="font-medium">
        {text}
      </label>
      <span className="flex max-[360px]:flex-col items-center max-[360px]:items-start gap-x-1 min-w-fit">
        <span className="decoration-dotted underline-offset-2 opacity-80">
          {demoLabel}
        </span>
        <div className="flex items-center ">
          <span className="text-core underline decoration-dotted underline-offset-2 ">
            {demoValue}
          </span>
          <IconButton
            accessibilityLabel={copied ? 'Copied' : `Copy ${demoValue}`}
            icon="copy-to-clipboard"
            size="xs"
            tooltip={{
              text: copied ? 'Copied!' : 'Copy',
              idealDirection: 'up',
              inline: true,
              zIndex: TOOLTIP_ZINDEX,
            }}
            onClick={copy}
          />
        </div>
      </span>
    </div>
  );
}

DemoAccountLabel.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  demoLabel: PropTypes.string.isRequired,
  demoValue: PropTypes.string.isRequired,
};

Login.propTypes = {
  loginLoading: PropTypes.bool.isRequired,
  setLoginLoading: PropTypes.func.isRequired,
};

export default Login;
