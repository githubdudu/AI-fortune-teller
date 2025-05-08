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
import { Link, useNavigate } from 'react-router-dom';
import { useSessionStorage } from 'react-use';

import { registerWithEmailAndPassword } from '$/utils/firebase.js';

import Loading from '$/components/LoadingAnimation';

const SignUp = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginToken] = useSessionStorage('auth_token', null);

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
    <div className="View">
      <h1>Sign Up</h1>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="User Name"
      />
      <br />
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
      <button onClick={() => handleSignUpWithEmail(userName, email, password)}>
        Submit
      </button>
      <br />
      <br />
      <Link to="/login">
        <button>I already have an account</button>
      </Link>
    </div>
  );
};

export default SignUp;
