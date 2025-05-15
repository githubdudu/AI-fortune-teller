import { useState, useEffect, useRef } from 'react';
import { Box, Heading, Text, Spinner } from 'gestalt';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/Card/Card';
import './GalleryPage.css';
import { API_CONFIG } from '$/constants/config';
import apiClient from '$/utils/apiClient';

function GalleryPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [displayMode, setDisplayMode] = useState('fan'); // 'stack', 'fan', 'pure-stack'
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);
  const cardBoxRef = useRef(null);

  // Function to preload all card images
  const preloadImages = (cardsData) => {
    // Reset counter when starting to load a new set of images
    setLoadedImagesCount(0);

    if (!cardsData || cardsData.length === 0) {
      setImagesLoaded(true);
      return;
    }

    const totalImages = cardsData.length;
    let loadedCount = 0;

    // Preload the common back card image first
    const backCardImage = new Image();
    backCardImage.src =
      'https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/TarotCardBackCard.png';

    backCardImage.onload = () => {
      // After back card is loaded, start loading all front card images
      cardsData.forEach((card) => {
        const img = new Image();
        img.src = card.imageSource || '/defaultFrontCard.png';

        img.onload = () => {
          loadedCount++;
          setLoadedImagesCount(loadedCount);

          // When all images are loaded, set the imagesLoaded flag
          if (loadedCount === totalImages) {
            console.log('All card images loaded successfully');
            setImagesLoaded(true);
          }
        };

        img.onerror = () => {
          console.error(
            `Failed to load image: ${card.imageSource || '/defaultFrontCard.png'}`,
          );
          loadedCount++;
          setLoadedImagesCount(loadedCount);

          // Even if some images fail, continue with the ones that loaded
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
        };
      });
    };

    backCardImage.onerror = () => {
      console.error('Failed to load back card image');
      // Continue with front images even if back image fails
      setImagesLoaded(true);
    };
  };

  // Fetch all cards from the API
  useEffect(() => {
    const fetchAllCards = async () => {
      setLoading(true);
      setImagesLoaded(false); // Reset images loaded state
      try {
        // Using apiClient with centralized endpoint config
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.CARDS);

        setCards(response.data);
        console.log('Cards fetched:', response.data);

        // Start preloading images after cards data is fetched
        preloadImages(response.data);
      } catch (err) {
        console.error('Error fetching cards:', err);
        setErrorMessage('Unable to load cards. Please try again later.');
        // Using local variable instead of state to avoid dependency cycle
        console.log('Error:', err);

        // Use demo cards as fallback
        const demoCards = [
          {
            id: 1,
            name: 'The Fool',
            description: 'New beginnings, innocence, spontaneity',
            imageSource: '/defautFrontCard.png',
          },
          {
            id: 2,
            name: 'The Magician',
            description: 'Manifestation, resourcefulness, power',
            imageSource: '/defautFrontCard.png',
          },
          {
            id: 3,
            name: 'The High Priestess',
            description: 'Intuition, sacred knowledge, divine feminine',
            imageSource: '/defautFrontCard.png',
          },
          {
            id: 4,
            name: 'The Empress',
            description: 'Fertility, nurturing, abundance',
            imageSource: '/defautFrontCard.png',
          },
          {
            id: 5,
            name: 'The Emperor',
            description: 'Authority, structure, control, fatherhood',
            imageSource: '/defautFrontCard.png',
          },
          {
            id: 6,
            name: 'The Hierophant',
            description: 'Tradition, conformity, morality, ethics',
            imageSource: '/defautFrontCard.png',
          },
          {
            id: 7,
            name: 'The Lovers',
            description: 'Relationships, choices, alignment of values',
            imageSource: '/defautFrontCard.png',
          },
          {
            id: 8,
            name: 'The Chariot',
            description: 'Direction, control, willpower',
            imageSource: '/defautFrontCard.png',
          },
        ];

        setCards(demoCards);

        // Start preloading demo card images if API fails
        preloadImages(demoCards);
      }
    };

    fetchAllCards();
  }, []);

  // Only finish loading when both cards data is fetched and images are loaded
  useEffect(() => {
    if (cards.length > 0 && imagesLoaded) {
      // Small delay to ensure card box is rendered
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [cards, imagesLoaded]);

  // Start cards animation after loading is complete
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(
        () => {
          setAnimationComplete(true);
        },
        cards.length * 150 + 1000,
      ); // Allow time for all card animations + extra time

      return () => clearTimeout(timer);
    }
  }, [loading, cards.length]);

  if (loading) {
    return (
      <Box
        padding={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        direction="column"
        gap={4}
      >
        <Spinner show accessibilityLabel="Loading cards" />
        <Text align="center" weight="bold" size="lg">
          Preparing your card gallery...
        </Text>
        {cards.length > 0 && !imagesLoaded && (
          <Box padding={2}>
            <Text align="center">
              Loading card images: {loadedImagesCount}/{cards.length}
            </Text>
            <Box
              padding={2}
              marginTop={2}
              color="lightGray"
              rounding={2}
              width={300}
              height={10}
            >
              <Box
                color="purple"
                height="100%"
                width={`${(loadedImagesCount / cards.length) * 100}%`}
                rounding={2}
              />
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  if (errorMessage) {
    return (
      <Box
        padding={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        direction="column"
      >
        <Text align="center" weight="bold" size="lg" color="red">
          {errorMessage}
        </Text>
      </Box>
    );
  }

  // Render cards in stack mode
  const renderStackedCards = () => {
    // Number of cards to display per row
    const cardsPerRow = 5;
    // Horizontal and vertical overlap (in pixels)
    const horizontalOverlap = 60;
    const verticalOverlap = 40;

    // Calculate width and height needed to display all cards
    const totalRows = Math.ceil(cards.length / cardsPerRow);
    const gridWidth =
      (208 - horizontalOverlap) * cardsPerRow + horizontalOverlap;
    const gridHeight = (312 - verticalOverlap) * totalRows + verticalOverlap;

    return (
      <div
        className="stack-container"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          margin: '50px auto',
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          className="cards-grid-container"
          style={{
            position: 'relative',
            width: `${gridWidth}px`,
            height: `${gridHeight}px`,
          }}
        >
          {cards.map((card, index) => {
            // Calculate which row and column the card is in
            const row = Math.floor(index / cardsPerRow);
            const col = index % cardsPerRow;

            // Calculate card position considering overlap
            const left = col * (208 - horizontalOverlap); // 208px is card width
            const top = row * (312 - verticalOverlap); // 312px is card height

            // Slight random rotation for natural arrangement
            const rotate = (Math.random() * 4 - 2) * 0.8;

            return (
              <motion.div
                key={card.id}
                className="gallery-card-wrapper"
                initial={{
                  opacity: 0,
                  x: cardBoxRef.current
                    ? cardBoxRef.current.getBoundingClientRect().x - left - 100
                    : 0,
                  y: cardBoxRef.current
                    ? cardBoxRef.current.getBoundingClientRect().y - top - 150
                    : 0,
                  rotate: Math.random() * 20 - 10,
                  scale: 0.6,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  rotate: rotate,
                  scale: 1,
                  transition: {
                    delay: index * 0.1,
                    duration: 0.8,
                    type: 'spring',
                    stiffness: 100,
                  },
                }}
                style={{
                  position: 'absolute',
                  left: left,
                  top: top,
                  zIndex: index,
                  width: '208px', // Card container width
                  height: '312px', // Card container height
                  transformOrigin: 'center center',
                }}
                whileHover={{
                  scale: 1.1,
                  zIndex: 1000,
                  rotate: 0,
                  transition: { duration: 0.3 },
                }}
              >
                <Card
                  backImage="https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/TarotCardBackCard.png"
                  frontImage={card.imageSource || '/defaultFrontCard.png'}
                  name={card.name}
                  description={card.description}
                  isShowFront={animationComplete}
                />
                <div className="card-hover-caption">
                  <Text color="white" weight="bold">
                    {card.name}
                  </Text>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render cards in pure stack mode (previous stack implementation)
  const renderPureStackedCards = () => {
    // Create a reversed card array so cards at the front of the array (typically more important) are shown on top
    const reversedCards = [...cards].reverse();

    return (
      <div
        className="stack-container"
        style={{
          position: 'relative',
          height: '500px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative', width: '280px', height: '400px' }}>
          {reversedCards.map((card, index) => {
            // Calculate stack position and rotation angle
            // All cards have fixed positioning relative to the container, not to the previous card
            const offsetX = (index % 2 === 0 ? 1 : -1) * index * 2; // Slight staggered horizontal offset
            const offsetY = index * 10; // Vertical stack, top cards offset down more
            const rotate =
              (index % 2 === 0 ? 1 : -1) * Math.min(index * 0.8, 4); // Slight staggered rotation, but limit max angle

            return (
              <motion.div
                key={card.id}
                className="gallery-card-wrapper"
                initial={{
                  opacity: 0,
                  x: cardBoxRef.current
                    ? cardBoxRef.current.getBoundingClientRect().x -
                      window.innerWidth / 2
                    : 0,
                  y: cardBoxRef.current
                    ? cardBoxRef.current.getBoundingClientRect().y - 250
                    : 0,
                  rotate: Math.random() * 30 - 15,
                  scale: 0.6,
                }}
                animate={{
                  opacity: 1,
                  x: offsetX,
                  y: offsetY,
                  rotate: rotate,
                  scale: 1,
                  transition: {
                    delay: (cards.length - index - 1) * 0.15,
                    duration: 0.8,
                    type: 'spring',
                    stiffness: 100,
                  },
                }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  zIndex: reversedCards.length - index, // Ensure correct stacking order
                }}
                whileHover={{
                  y: offsetY - 30, // Move up on hover
                  scale: 1.05,
                  zIndex: 1000, // Ensure hovered card is on top
                  transition: { duration: 0.3 },
                }}
              >
                <Card
                  backImage="https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/TarotCardBackCard.png"
                  frontImage={card.imageSource || '/defaultFrontCard.png'}
                  name={card.name}
                  description={card.description}
                  isShowFront={animationComplete}
                />
                <div className="card-hover-caption">
                  <Text color="white" weight="bold">
                    {card.name}
                  </Text>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render cards in fan mode
  const renderFanCards = () => {
    const totalCards = cards.length;

    // Top row contains 60% of cards, bottom row contains 40%
    const firstRowCount = Math.ceil(totalCards * 0.6);

    // Divide cards into two rows, more on top, fewer at bottom
    const firstRowCards = cards.slice(0, firstRowCount);
    const secondRowCards = cards.slice(firstRowCount);

    // Set fan angle for each row
    const calculateFanAngle = (cardsCount) => Math.min(120, cardsCount * 6.5);

    const firstRowAngle = calculateFanAngle(firstRowCards.length);
    const secondRowAngle = calculateFanAngle(secondRowCards.length);

    // Calculate the size of fan container
    const fanWidth = Math.max(900, totalCards * 40);
    const fanHeight = 680; // Increase height to accommodate two rows

    // Vertical distance between two rows
    const rowGap = 250;

    return (
      <div
        className="fan-container"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 200px 0 0',
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          className="cards-fan-container"
          style={{
            position: 'relative',
            width: `${fanWidth}px`,
            height: `${fanHeight}px`,
          }}
        >
          {/* First row of cards (top row, more cards) */}
          {firstRowCards.map((card, index) => {
            const totalInRow = firstRowCards.length;
            const anglePerCard = firstRowAngle / (totalInRow - 1 || 1);
            const startAngle = -firstRowAngle / 2;
            const angle = startAngle + anglePerCard * index;

            // Increase precision of base horizontal offset calculation
            const centerIndex = Math.floor(totalInRow / 2);
            const baseXOffset = (index - centerIndex) * 12; // Increase base offset

            // Adjust vertical and horizontal offsets for better fan effect
            const verticalOffset = Math.abs(angle) * 0.6;
            // Add correction factor to ensure centering
            const centeringFactor = -20;
            const horizontalOffset =
              angle * 2.2 + baseXOffset + centeringFactor;

            return (
              <motion.div
                key={card.id}
                className="gallery-card-wrapper"
                initial={{
                  opacity: 0,
                  x: cardBoxRef.current
                    ? cardBoxRef.current.getBoundingClientRect().x
                    : 0,
                  y: cardBoxRef.current
                    ? cardBoxRef.current.getBoundingClientRect().y
                    : 0,
                  rotate: 0,
                  scale: 0.6,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  rotate: angle,
                  scale: 1,
                  transition: {
                    delay: index * 0.12,
                    duration: 0.8,
                    type: 'spring',
                    stiffness: 100,
                  },
                }}
                style={{
                  zIndex: index,
                  position: 'absolute',
                  transformOrigin: 'bottom center',
                  left: `calc(50% + ${baseXOffset}px)`,
                  bottom: `${rowGap + 50}px`, // Top row position
                  transform: `rotate(${angle}deg) translateY(-${20 + verticalOffset}%) translateX(${horizontalOffset}px)`,
                }}
                whileHover={{
                  scale: 1.1,
                  zIndex: 1000,
                  rotate: angle,
                  transition: { duration: 0.3 },
                }}
              >
                <Card
                  backImage="https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/TarotCardBackCard.png"
                  frontImage={card.imageSource || '/defaultFrontCard.png'}
                  name={card.name}
                  description={card.description}
                  isShowFront={animationComplete}
                />
                <div className="card-hover-caption">
                  <Text color="white" weight="bold">
                    {card.name}
                  </Text>
                </div>
              </motion.div>
            );
          })}

          {/* Second row of cards (bottom row, fewer cards) */}
          {secondRowCards.map((card, index) => {
            const totalInRow = secondRowCards.length;
            // Ensure angle is correctly calculated even with just one card
            const anglePerCard =
              totalInRow > 1 ? secondRowAngle / (totalInRow - 1) : 0;
            const startAngle = -secondRowAngle / 2;
            const angle = startAngle + anglePerCard * index;

            // Add more base horizontal offset for bottom row cards for more even distribution
            const centerIndex = Math.floor(totalInRow / 2);
            const baseXOffset = (index - centerIndex) * 15; // Bottom row has larger spacing between cards

            const verticalOffset = Math.abs(angle) * 0.6;
            // Horizontal centering correction for bottom row
            const centeringFactor = -10;
            const horizontalOffset =
              angle * 2.2 + baseXOffset + centeringFactor;

            return (
              <motion.div
                key={card.id}
                className="gallery-card-wrapper"
                initial={{
                  opacity: 0,
                  x: cardBoxRef.current
                    ? cardBoxRef.current.getBoundingClientRect().x
                    : 0,
                  y: cardBoxRef.current
                    ? cardBoxRef.current.getBoundingClientRect().y
                    : 0,
                  rotate: 0,
                  scale: 0.6,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  rotate: angle,
                  scale: 1,
                  transition: {
                    delay: (firstRowCards.length + index) * 0.12,
                    duration: 0.8,
                    type: 'spring',
                    stiffness: 100,
                  },
                }}
                style={{
                  zIndex: index + firstRowCards.length,
                  position: 'absolute',
                  transformOrigin: 'bottom center',
                  left: `calc(50% + ${baseXOffset}px)`,
                  bottom: '50px', // Bottom row position
                  transform: `rotate(${angle}deg) translateY(-${20 + verticalOffset}%) translateX(${horizontalOffset}px)`,
                }}
                whileHover={{
                  scale: 1.1,
                  zIndex: 1000,
                  rotate: angle,
                  transition: { duration: 0.3 },
                }}
              >
                <Card
                  backImage="https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/TarotCardBackCard.png"
                  frontImage={card.imageSource || '/defaultFrontCard.png'}
                  name={card.name}
                  description={card.description}
                  isShowFront={animationComplete}
                />
                <div className="card-hover-caption">
                  <Text color="white" weight="bold">
                    {card.name}
                  </Text>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  // Choose rendering method based on display mode
  const renderCards = () => {
    switch (displayMode) {
      case 'stack':
        return renderStackedCards();
      case 'pure-stack':
        return renderPureStackedCards();
      case 'fan':
      default:
        return renderFanCards();
    }
  };

  // Display mode toggle buttons
  const renderDisplayModeButtons = () => {
    return (
      <Box
        padding={20}
        display="flex"
        justifyContent="center"
        gap={2}
        margin={0}
      >
        <button
          onClick={() => setDisplayMode('fan')}
          className={`display-mode-btn ${displayMode === 'fan' ? 'active' : ''}`}
          style={{
            padding: '8px 16px',
            background: displayMode === 'fan' ? '#8e24aa' : '#3a204a',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Fan Display
        </button>
        <button
          onClick={() => setDisplayMode('stack')}
          className={`display-mode-btn ${displayMode === 'stack' ? 'active' : ''}`}
          style={{
            padding: '8px 16px',
            background: displayMode === 'stack' ? '#8e24aa' : '#3a204a',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Grid Stack
        </button>
        <button
          onClick={() => setDisplayMode('pure-stack')}
          className={`display-mode-btn ${displayMode === 'pure-stack' ? 'active' : ''}`}
          style={{
            padding: '8px 16px',
            background: displayMode === 'pure-stack' ? '#8e24aa' : '#3a204a',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Pure Stack
        </button>
      </Box>
    );
  };

  return (
    <div className="gallery-container">
      <Box padding={4}>
        {/* <Heading size="md" accessibilityLevel={1} align="center">
          Tarot Card Gallery
        </Heading>
        <Text align="center" size="lg" color="gray">
          Explore the Mystical World of Tarot
        </Text> */}

        {renderDisplayModeButtons()}

        {/* Card box animation */}
        <div className="card-display-area">
          {!animationComplete && (
            <div className="card-box" ref={cardBoxRef}>
              <div className="card-box-lid" />
              <div className="card-box-container" />
            </div>
          )}

          {renderCards()}
        </div>
      </Box>
    </div>
  );
}

export default GalleryPage;
