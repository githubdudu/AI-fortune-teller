import { Box } from 'gestalt';
import UserQuestionInput from '../../components/UserQuestionInput';
import ThemeView from '../../components/ThemeView';
import { useEffect, useState, useContext, useRef } from 'react';
import FloatingPrompt from '../../components/FloatingPrompt/FloatingPrompt';
import { AppContext } from '$/context/AppContextProvider';
import DailyFortuneContent from '../../components/DailyFortuneContent/DailyFortuneContent';
import LoginForm from '$/components/LoginForm';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG } from '$/constants/config';
import apiClient from '$/utils/apiClient';
import { SEO_TITLE } from '$/constants/seo';
import './UserInputPage.css';

/**
 * This a page where user either selects from themes of fortune telling, or ask his own question.
 * @returns
 */
function UserInputPage() {
  const {
    isModalOpen,
    setIsModalOpen,
    toggleModalOpen,
    isLoggedIn,
    setUserProfile,
    logout,
    profileFetched,
    setProfileFetched,
    loginLoading,
    setLoginLoading,
  } = useContext(AppContext);

  const [noMotionFlag, setNoMotionFlag] = useState(true);
  const [dailyFortune, setDailyFortune] = useState(null);
  /**
   * One loading state for login and another for daily fortune.
   * login has an internal loading state that will replace all the login forms.
   * Daily fortune has a loading state only displayed as a message.
   */
  const [dailyFortuneLoading, setDailyFortuneLoading] = useState(true);
  const [error, setError] = useState(null);
  const fortuneFetchedRef = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDailyFortune = async () => {
      if (fortuneFetchedRef.current || !isLoggedIn) return; // Prevent multiple fetches

      setDailyFortuneLoading(true);
      try {
        // Using the FORTUNES endpoint which is available
        // For non-authenticated users, we'll use the general FORTUNES endpoint
        // For authenticated users, we can still use it with auth cookies
        const response = await apiClient.get(
          API_CONFIG.ENDPOINTS.DAILY_FORTUNES_ME,
        );
        setDailyFortune(response.data);
      } catch (err) {
        console.error('Error fetching daily fortune:', err);
        setError('Failed to load your daily fortune');
      } finally {
        fortuneFetchedRef.current = true; // Mark as fetched
        setDailyFortuneLoading(false);
      }
    };

    fetchDailyFortune();
  }, [isLoggedIn]); // Only re-run if login status changes

  useEffect(() => {
    // Only fetch user profile once when logged in and not already fetched
    if (!isLoggedIn || profileFetched) return;

    setIsModalOpen(false);
    const getUserProfile = async () => {
      try {
        setLoginLoading(true);
        // Using centralized endpoint from config
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.USER_ME);
        setUserProfile(response.data);

        // If the user is logged in, but the information is missing, showing a form
        if (missingProfileInfo(response.data)) {
          navigate('/user-info-input');
          setIsModalOpen(true);
          return;
        }

        // Put this setting after the navigation to avoid flickering
        setProfileFetched(true); // Mark profile as fetched
        setIsModalOpen(true);
      } catch (err) {
        console.error('Error fetching user profile:', err);

        // If we get a 401 Unauthorized error, log the user out
        if (
          (err.response && err.response.status === 401) ||
          (err.response && err.response.status === 404)
        ) {
          console.log('Session expired or unauthorized. Logging out user.');
          logout(); // Log the user out
          navigate('/'); // Redirect to landing page
          return;
        }

        setError('Failed to load user profile');
      }
      // Put this setting out of the finally block to avoid flickering
      setLoginLoading(false);
    };

    getUserProfile();
  }, [
    isLoggedIn,
    dailyFortuneLoading,
    navigate,
    setUserProfile,
    profileFetched,
    setProfileFetched,
    logout,
    setLoginLoading,
  ]);

  useEffect(() => {
    setNoMotionFlag(!isLoggedIn);
  }, [isLoggedIn]);

  const FloatingContent = () => {
    // If the user is not logged in, display the login form
    // the fetching of user profile process uses the loginLoading state too.
    if (!isLoggedIn || !profileFetched) {
      return (
        <>
          <title>{SEO_TITLE.LOGIN}</title>
          <LoginForm
            loginLoading={loginLoading}
            setLoginLoading={setLoginLoading}
          />
        </>
      );
    }

    // Display the daily fortune content if the user is logged in
    return (
      <>
        <title>{SEO_TITLE.DAILY_FORTUNE}</title>
        <DailyFortuneContent
          loading={dailyFortuneLoading}
          error={error}
          dailyFortune={dailyFortune}
          onClick={toggleModalOpen}
        />
      </>
    );
  };

  const missingProfileInfo = (userProfile) => {
    // Check if any of the required fields are nullish
    // Use == instead of === to check for both null and undefined
    return (
      !userProfile ||
      userProfile.bornCountry == null ||
      userProfile.dateOfBirth == null ||
      userProfile.gender == null ||
      userProfile.residenceCountry == null
    );
  };

  return (
    <>
      <title>{SEO_TITLE.HOME}</title>
      <FloatingPrompt visible={isModalOpen} shouldReduceMotion={noMotionFlag}>
        <FloatingContent />
      </FloatingPrompt>
      <div className="w-165">
        <UserQuestionInput />
      </div>
      <Box marginBottom={2} />
      <h2 className="divider-text">- or -</h2>
      <Box marginBottom={2} />
      <h2 className="theme-instruction-text">
        Select a theme to let fate speak first.
      </h2>
      <div className="w-250">
        <ThemeView />
      </div>
      <div
        className="fixed top-115 left-1/2 -translate-x-1/2 w-1200 h-1200 bg-[#FFF9F7] rounded-full z-[-1] pointer-events-none"
        style={{ boxShadow: '0px 80px 300px rgba(0, 0, 0, 0.75)' }}
      />
    </>
  );
}

export default UserInputPage;
