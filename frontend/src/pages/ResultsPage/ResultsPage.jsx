import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Text, Heading } from 'gestalt';
import Card from '../../components/Card/Card';
import './ResultsPage.css';

const ResultsPage = () => {
  const navigate = useNavigate();
  const [selectedCards, setSelectedCards] = useState([]);

  useEffect(() => {
    const storedCards = sessionStorage.getItem('selectedCards');
    if (storedCards) {
      setSelectedCards(JSON.parse(storedCards));
    } else {
      setSelectedCards([
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
      ]);
    }
  }, []);

  const readingResult =
    'Based on your selected cards, you are at a point of new beginnings with great potential ahead. Trust your intuition and use your resources wisely to manifest your desires. The combination of these cards suggests a journey of self-discovery where your inner wisdom will guide you to unlock your potential. Be open to unexpected opportunities and trust the process of personal growth.';

  const handleNewReading = () => {
    sessionStorage.removeItem('selectedCards');
    navigate('/selection');
  };

  return (
    <div className="results-container">
      <h1>Your Tarot Reading Results</h1>

      <Box>
        <Text align="center">
          The cards have revealed your path. Here is your personalized reading.
        </Text>
      </Box>

      <div className="selected-cards-display">
        {selectedCards.map((card) => (
          <div key={card.id}>
            <div>
              <Card
                frontImage={card.imageSource || '/defautFrontCard.png'}
                backImage={card.imageSource || '/defaultBackCard.png'}
                disabled={true}
                initialFlipped={true}
                name={card.name}
                description={card.description}
              />
            </div>
          </div>
        ))}
      </div>

      <Box marginTop={8} marginBottom={4}>
        <Heading size="md" accessibilityLevel={2}>
          Your Reading Interpretation
        </Heading>
        <Box marginTop={2} marginBottom={6}>
          <Text>{readingResult}</Text>
        </Box>
      </Box>

      <Box marginTop={6} display="flex" justifyContent="center">
        <Button
          text="Start New Reading"
          color="blue"
          onClick={handleNewReading}
          size="lg"
        />
      </Box>
    </div>
  );
};

export default ResultsPage;
