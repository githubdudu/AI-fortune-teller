import { Box } from 'gestalt';
import UserQuestionInput from '../../components/UserQuestionInput';
import ThemeView from '../../components/ThemeView';
import { useEffect, useState, useContext } from 'react';
import FloatingPrompt from '../../components/FloatingPrompt/FloatingPrompt';
import axios from 'axios';
import PropTypes from 'prop-types';
import { AppContext } from '$/context/AppContextProvider';

/**
 * This a page where user either selects from themes of fortune telling, or ask his own question.
 * @returns
 */

function UserInputPage() {
  const { isModalOpen, toggleModalOpen } = useContext(AppContext);
  const [dailyFortune, setDailyFortune] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDailyFortune = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'http://localhost:5000/api/v1/DailyFortunes/me',
        {
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZmNmYjk2Ny02ZmJmLTRkYWItOWRiMi1mNWMzMDQ2YzM1YzEiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6IkFkbWluIiwibmJmIjoxNzQ1NjQxNDAzLCJleHAiOjIwNjExNzQyMDMsImlhdCI6MTc0NTY0MTQwMywiaXNzIjoieW91ci1pc3N1ZXIiLCJhdWQiOiJ5b3VyLWF1ZGllbmNlIn0.q4vXBQp1JmjLfNUvEzFBgdTPrw_AGRAKRRoQ1ryoDoo',
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

  const FloatingContent = () => {
    return (
      <DailyFortuneContent
        loading={loading}
        error={error}
        dailyFortune={dailyFortune}
        onClick={toggleModalOpen}
      />
    );
  };

  return (
    <>
      <FloatingPrompt visible={isModalOpen} shouldReduceMotion={false}>
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

function DailyFortuneContent({ loading, error, dailyFortune, onClick }) {
  return (
    <>
      <p className="prompt-text">The future is calling.</p>
      <p className="prompt-text">Are you ready to unlock it?</p>
      {loading && <p>Loading themes...</p>}
      {error ? (
        <p className="prompt-text error">{error}</p>
      ) : dailyFortune ? (
        <>
          <p className="prompt-text">
            Your Lucky Color: {dailyFortune.luckyColor}
          </p>
          <p className="prompt-text">
            Your Lucky Number: {dailyFortune.luckyNumber}
          </p>
          <p className="prompt-text">Piece of Advice: {dailyFortune.advice}</p>
        </>
      ) : (
        <p className="prompt-text">Loading your daily fortune...</p>
      )}

      <button className="prompt-button" onClick={onClick}>
        Start Reading
      </button>
    </>
  );
}

DailyFortuneContent.propTypes = {
  onClick: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  dailyFortune: PropTypes.shape({
    luckyColor: PropTypes.string.isRequired,
    luckyNumber: PropTypes.number.isRequired,
    advice: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
  }),
};
