import { Flex } from 'gestalt';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ThemeCard from '../ThemeCard';
import ThemeDescription from '../ThemeDescription/ThemeDescription';
import { API_CONFIG } from '../../constants/config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

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
  /*   {
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
      'Gain clarity and confidence when facing life's turning points, and uncover what truly aligns with your path.',
  },
  {
    id: 8,
    name: 'travel',
    image: 'icons/travel.png',
    description:
      'Explore new environments and shifting paths, and reflect on how movement and change inspire transformation.',
  }, */
];

function ThemeView() {
  const defaultTheme = {
    id: 0,
    name: 'Explore the themes',
    image: null,
    description: 'Hover over any theme card for its explanation.',
  };

  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(defaultTheme);

  useEffect(() => {
    const fetchThemes = async () => {
      if (!API_CONFIG.USE_API_THEMES) {
        setThemes(hardcodedThemes);
        return;
      }

      setLoading(true);
      try {
        const apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.THEMES}`;
        const response = await axios.get(apiUrl);

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
        setError(
          'Failed to load themes from API. Using hardcoded themes instead.',
        );
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
        justifyContent="start"
        direction="column"
        gap={6}
      >
        {/* Display loading state or error message */}
        {loading && <p>Loading themes...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* TODO: Add buttons (right & left) and animation to scroll through the theme cards, and prevent Theme cards overflowing & getting squashed */}
        <Flex
          alignItems="center"
          justifyContent="start"
          direction="row"
          gap={6}
        >
          <div
            className="swiper-container"
            style={{ width: '100%', maxWidth: '1200px' }}
          >
            <Swiper
              navigation={true}
              modules={[Navigation]}
              slidesPerView={3}
              spaceBetween={-550}
              loop={true}
              initialSlide={1}
              style={{ padding: '70px 500px' }}
              // breakpoints={{
              //   320: {
              //     slidesPerView: 3,
              //   },
              //   768: {
              //     slidesPerView: 3,
              //   },
              //   1024: {
              //     slidesPerView: 3,
              //   },
              // }}
            >
              {themes.map((theme) => (
                <SwiperSlide key={theme.id}>
                  <ThemeCard theme={theme} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </Flex>
        <ThemeDescription theme={selectedTheme} />
      </Flex>
    </>
  );
}

export default ThemeView;
