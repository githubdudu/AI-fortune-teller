import { useState, useEffect, useRef } from 'react';
import { Box, Heading, Text, Spinner } from 'gestalt';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Card from '../../components/Card/Card';
import './GalleryPage.css';
import { API_CONFIG } from '$/constants/config';

function GalleryPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [displayMode, setDisplayMode] = useState('fan'); // 'stack', 'fan', 'pure-stack'
  const cardBoxRef = useRef(null);

  // Fetch all cards from the API
  useEffect(() => {
    const fetchAllCards = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_CONFIG.BASE_URL}/Cards`, {
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZmNmYjk2Ny02ZmJmLTRkYWItOWRiMi1mNWMzMDQ2YzM1YzEiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6IkFkbWluIiwibmJmIjoxNzQ1NjQxNDAzLCJleHAiOjIwNjExNzQyMDMsImlhdCI6MTc0NTY0MTQwMywiaXNzIjoieW91ci1pc3N1ZXIiLCJhdWQiOiJ5b3VyLWF1ZGllbmNlIn0.q4vXBQp1JmjLfNUvEzFBgdTPrw_AGRAKRRoQ1ryoDoo',
          },
        });

        setCards(response.data);
        console.log('Cards fetched:', response.data);
      } catch (err) {
        console.error('Error fetching cards:', err);
        setError('Unable to load cards. Please try again later.');
        console.log('Error:', error);

        // Use demo cards as fallback
        setCards([
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
        ]);
      } finally {
        // Small delay to ensure card box is rendered
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    };

    fetchAllCards();
  }, []);

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
      >
        <Spinner show accessibilityLabel="Loading cards" />
        <Text align="center" weight="bold" size="lg">
          Preparing your card gallery...
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
          margin: '0 auto',
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
                  frontImage={card.imageSource || '/defautFrontCard.png'}
                  backImage="/defaultBackCard.png"
                  name={card.name}
                  description={card.description}
                  initialFlipped={animationComplete}
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
                  frontImage={card.imageSource || '/defautFrontCard.png'}
                  backImage="/defaultBackCard.png"
                  name={card.name}
                  description={card.description}
                  initialFlipped={animationComplete}
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
          margin: '0 auto',
          padding: '20px',
          display: 'flex',
          marginRight: '200px',
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
                  frontImage={card.imageSource || '/defautFrontCard.png'}
                  backImage="/defaultBackCard.png"
                  name={card.name}
                  description={card.description}
                  initialFlipped={animationComplete}
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
                  frontImage={card.imageSource || '/defautFrontCard.png'}
                  backImage="/defaultBackCard.png"
                  name={card.name}
                  description={card.description}
                  initialFlipped={animationComplete}
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
        padding={3}
        display="flex"
        justifyContent="center"
        gap={4}
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
