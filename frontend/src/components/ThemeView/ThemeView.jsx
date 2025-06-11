import { Flex } from 'gestalt';
import { useState, useEffect, useCallback } from 'react';
import ThemeCard from '../ThemeCard';
import ThemeDescription from '../ThemeDescription/ThemeDescription';
import { API_CONFIG } from '../../constants/config';
import apiClient from '../../utils/apiClient';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper modules
import { Navigation, Pagination } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './ThemeView.css';
import useRem from '$/hooks/useRem';

// Hardcoded themes as fallback
const hardcodedThemes = [
  {
    id: 1,
    name: 'general',
    image: 'icons/general.png',
    description:
      'Embrace your optimism and strive for fulfilment, but stay open to new experiences along your journey.',
  },
  {
    id: 2,
    name: 'love',
    image: 'icons/love.png',
    description:
      'Open your heart to deep emotional connections, and reflect on current feelings or new romantic beginnings.',
  },
  {
    id: 3,
    name: 'finance',
    image: 'icons/finance.png',
    description:
      'Evaluate your financial habits with an eye on long-term security, and consider how ambition and stability align.',
  },
  {
    id: 4,
    name: 'career',
    image: 'icons/career.png',
    description:
      'Discover your unique strengths and explore what drives your ambition, building clarity in your career direction.',
  },
  {
    id: 5,
    name: 'relationships',
    image: 'icons/relationships.png',
    description:
      'Reflect on how you connect with those around you, and consider ways to nurture and grow your personal bonds.',
  },
  {
    id: 6,
    name: 'health',
    image: 'icons/health.png',
    description:
      'Tune into your body and emotions, and explore how balance and mindful habits shape your overall well-being.',
  },
  {
    id: 7,
    name: 'decisions',
    image: 'icons/decisions.png',
    description:
      "Gain clarity and confidence when facing life's turning points, and uncover what truly aligns with your path.",
  },
  {
    id: 8,
    name: 'travel',
    image: 'icons/travel.png',
    description:
      'Explore new environments and shifting paths, and reflect on how movement and change inspire transformation.',
  },
];

function ThemeView() {
  const defaultTheme = {
    id: 0,
    name: 'Explore the themes',
    image: null,
    description: 'Hover over any theme card for its explanation.',
  };

  const CSS_REM_VALUE = useRem();
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(defaultTheme);

  const handleThemeHover = useCallback((theme) => {
    setSelectedTheme(theme);
  }, []);

  useEffect(() => {
    const fetchThemes = async () => {
      if (!API_CONFIG.USE_API_THEMES) {
        setThemes(hardcodedThemes);
        return;
      }

      setLoading(true);
      try {
        // Using apiClient instead of direct axios calls
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.THEMES);

        // Map API response to format compatible with the component
        const apiThemes = response.data.map((theme) => ({
          id: theme.id,
          name: theme.name,
          image: theme.imageSource,
          description: theme.description,
        }));
        setThemes(apiThemes);
        setError(null);
      } catch (err) {
        console.error('Error fetching themes:', err);
        setError('Service is not available. Please try again later.');
        setThemes(hardcodedThemes);
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="center"
        direction="column"
        gap={6}
      >
        {/* Display loading state or error message */}
        {loading && <p>Loading themes...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Fixed className typo (removed space after md:) */}
        <div className="swiper-container w-screen px-4">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={true}
            pagination={{ clickable: true }}
            slidesPerView={1}
            spaceBetween={10}
            loop={true}
            initialSlide={0}
            className="py-4"
            breakpoints={{
              [40 * CSS_REM_VALUE]: {
                slidesPerView: 3,
                spaceBetween: 5,
              },
              [48 * CSS_REM_VALUE]: {
                slidesPerView: 4,
                spaceBetween: 5,
              },
              [64 * CSS_REM_VALUE]: {
                slidesPerView: 5,
                spaceBetween: 10,
              },
            }}
          >
            {themes.map((theme) => (
              <SwiperSlide
                key={theme.id}
                className="flex items-center justify-center"
              >
                <ThemeCard
                  theme={theme}
                  onHover={handleThemeHover}
                  disabled={!!error}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* Show description for the currently selected or hovered theme */}
        <ThemeDescription theme={selectedTheme} />
      </Flex>
    </>
  );
}

export default ThemeView;
