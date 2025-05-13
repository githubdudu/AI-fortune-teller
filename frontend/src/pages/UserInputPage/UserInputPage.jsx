import { Box } from 'gestalt';
import UserQuestionInput from '../../components/UserQuestionInput';
import ThemeView from '../../components/ThemeView';
import { useEffect, useState, useContext } from 'react';
import FloatingPrompt from '../../components/FloatingPrompt/FloatingPrompt';
import { AppContext } from '$/context/AppContextProvider';
import DailyFortuneContent from '../../components/DailyFortuneContent/DailyFortuneContent';
import LoginForm from '$/components/LoginForm';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG } from '$/constants/config';
import apiClient from '$/utils/apiClient';

/**
 * This a page where user either selects from themes of fortune telling, or ask his own question.
 * @returns
 */
function UserInputPage() {
  const { isModalOpen, toggleModalOpen, isLoggedIn, setUserProfile, logout } =
    useContext(AppContext);
  const [noMotionFlag, setNoMotionFlag] = useState(true);
  const [dailyFortune, setDailyFortune] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileFetched, setProfileFetched] = useState(false);

  const navigate = useNavigate();

  const fetchDailyFortune = async () => {
    setLoading(true);
    try {
      // Using centralized endpoint from config
      const response = await apiClient.get(
        API_CONFIG.ENDPOINTS.DAILY_FORTUNES_ME,
      );
      setDailyFortune(response.data);
    } catch (err) {
      console.error('Error fetching daily fortune:', err);
      setError('Failed to load your daily fortune');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyFortune();
  }, []);

  useEffect(() => {
    // Only fetch user profile once when logged in and not already fetched
    if (!isLoggedIn || loading || profileFetched) return;

    const getUserProfile = async () => {
      try {
        setLoading(true);
        // Using centralized endpoint from config
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.USER_ME);
        setUserProfile(response.data);
        setProfileFetched(true); // Mark profile as fetched

        // If the user is logged in, but the information is missing, showing a form
        if (missingProfileInfo(response.data)) {
          navigate('/user-info-input');
          return;
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);

        // If we get a 401 Unauthorized error, log the user out
        if (err.response && err.response.status === 401) {
          console.log('Session expired or unauthorized. Logging out user.');
          logout(); // Log the user out
          navigate('/'); // Redirect to landing page
          return;
        }

        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, [isLoggedIn, loading, navigate, setUserProfile, profileFetched]);

  const FloatingContent = () => {
    // If the user is not logged in, display the login form
    if (!isLoggedIn) {
      return <LoginForm />;
    }

    // Display the daily fortune content if the user is logged in
    return (
      <DailyFortuneContent
        loading={loading}
        error={error}
        dailyFortune={dailyFortune}
        onClick={toggleModalOpen}
      />
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
      <FloatingPrompt visible={isModalOpen} shouldReduceMotion={noMotionFlag}>
        <FloatingContent />
      </FloatingPrompt>
      <div className="w-165">
        <UserQuestionInput />
      </div>
      <Box marginBottom={2} />
      <h2 className="text-[#261060] text-2xl font-bold text-center mb-7">
        - or -
      </h2>
      <Box marginBottom={2} />
      <h2 className="text-[#261060] text-4xl font-bold text-center mb-7">
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
