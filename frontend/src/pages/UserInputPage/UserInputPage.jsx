import { Box } from 'gestalt';
import UserQuestionInput from '../../components/UserQuestionInput';
import ThemeView from '../../components/ThemeView';
import { useEffect, useState, useContext } from 'react';
import FloatingPrompt from '../../components/FloatingPrompt/FloatingPrompt';
import axios from 'axios';
import { AppContext } from '$/context/AppContextProvider';
import DailyFortuneContent from '../../components/DailyFortuneContent/DailyFortuneContent';
import LoginForm from '$/components/LoginForm';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG } from '$/constants/config';
import { SEO_TITLE } from '$/constants/seo';

const BEARER_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZmNmYjk2Ny02ZmJmLTRkYWItOWRiMi1mNWMzMDQ2YzM1YzEiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6IkFkbWluIiwibmJmIjoxNzQ1NjQxNDAzLCJleHAiOjIwNjExNzQyMDMsImlhdCI6MTc0NTY0MTQwMywiaXNzIjoieW91ci1pc3N1ZXIiLCJhdWQiOiJ5b3VyLWF1ZGllbmNlIn0.q4vXBQp1JmjLfNUvEzFBgdTPrw_AGRAKRRoQ1ryoDoo';
/**
 * This a page where user either selects from themes of fortune telling, or ask his own question.
 * @returns
 */

function UserInputPage() {
  const {
    isModalOpen,
    toggleModalOpen,
    isLoggedIn,
    userProfile,
    setUserProfile,
  } = useContext(AppContext);
  const [noMotionFlag, setNoMotionFlag] = useState(true);
  const [dailyFortune, setDailyFortune] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchDailyFortune = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'http://localhost:5000/api/v1/DailyFortunes/me',
        {
          headers: {
            Authorization: BEARER_TOKEN,
          },
        },
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
    // do user me request
    if (!isLoggedIn) return;
    const getUserProfile = async () => {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER}${userProfile?.id ? `/${userProfile.id}` : ''}`,
        {
          headers: {
            Authorization: BEARER_TOKEN,
          },
          withCredentials: true,
        },
      );
      if (response.status !== 200) {
        throw new Error('Failed to fetch user profile');
      }
      console.log('data: ', response.data);
      setUserProfile(response.data);
    };

    try {
      setLoading(true);
      getUserProfile();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user profile');
    }
    // If the user is logged in, but the information is missing, showing a form
    if (isLoggedIn && missingProfileInfo(userProfile)) {
      navigate('/user-info-input');
      return;
    }
    setLoading(false);
  }, [isLoggedIn]);

  useEffect(() => {
    setNoMotionFlag(!isLoggedIn);
  }, [isLoggedIn]);

  const FloatingContent = () => {
    // If the user is not logged in, display the login form
    if (!isLoggedIn) {
      return (
        <>
          <title>{SEO_TITLE.LOGIN}</title>
          <LoginForm />
        </>
      );
    }

    // Display the daily fortune content if the user is logged in
    return (
      <>
        <title>{SEO_TITLE.DAILY_FORTUNE}</title>
        <DailyFortuneContent
          loading={loading}
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
