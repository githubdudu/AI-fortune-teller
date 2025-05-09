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

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import { TextField, Button } from 'gestalt';

import { registerWithEmailAndPassword } from '$/utils/firebase.js';

import Loading from '$/components/LoadingAnimation';
import FormContainer from '../../components/FormContainer';
import FormTitle from '../../components/FormTitle';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginToken] = useLocalStorage('auth_token', null);

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
      // display the success message and redirect to the login page
      alert(
        'User created successfully! After close this message, you will be redirected to the login page.',
      );
      navigate('/login');
      setLoading(false); // Move setLoading(false) here to ensure it's called after navigation
    } catch (error) {
      setError(error);
      console.error('Sign up error:', error);
    }
    setLoading(false);
  }
  return (
    <FormContainer>
      <FormTitle title="Sign up" subtitle="Sign up to ArcanaVerse" />
      <div className="flex flex-col gap-4 min-w-[500px]">
        <Username />
        <Email />
        <Password />
        <SignUpButton />
        <IHaveAnAccountButton />
      </div>
    </FormContainer>
  );

  function Username() {
    return (
      <div>
        <TextField
          id="username"
          label="User Name"
          placeholder="Please create your user name"
          name="username"
          size="lg"
          onChange={handleNameChange}
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
          placeholder="Please create your password"
          name="password"
          size="lg"
          type="password"
          onChange={(e) => setPassword(e.value)}
          value={password}
        />
      </div>
    );
  }

  function SignUpButton() {
    return (
      <Button
        text="Continue"
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
        onClick={() => navigate('/login')}
      />
    );
  }
};

export default SignUp;
