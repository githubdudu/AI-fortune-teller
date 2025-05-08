import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Text, Heading } from 'gestalt';
import Card from '../../components/Card/Card';
import './ResultsPage.css';
import axios from 'axios';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';

const ResultsPage = () => {
  // Check if the user is authenticated
  const navigate = useNavigate();
  const [selectedCards, setSelectedCards] = useState([]);
  const [readingResult, setReadingResult] = useState('');
  const [responseId, setResponseId] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(sessionStorage);
    const storedCards = sessionStorage.getItem('selectedCards');
    if (storedCards) {
      const cards = JSON.parse(storedCards);
      setSelectedCards(cards);
      console.log('Selected cards:', cards);

      // Get card IDs for API request
      const cardIds = cards.map((card) => card.id.toString());
      const question = sessionStorage.getItem('userQuestion') || null;
      const themeId = sessionStorage.getItem('selectedThemeId');

      console.log('Question:', question);
      console.log('Theme ID:', themeId);
      console.log('Card IDs:', cardIds);

      // Set to loading state
      setIsLoading(true);

      // Add a 2-second delay
      setTimeout(() => {
        // Send POST request to get reading result with authentication header
        axios
          .post(
            'http://localhost:5000/api/v1/Fortunes/ask',
            {
              question: question || '',
              cardIds: cardIds,
              themeId: themeId || null,
            },
            {
              headers: {
                Authorization:
                  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZmNmYjk2Ny02ZmJmLTRkYWItOWRiMi1mNWMzMDQ2YzM1YzEiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6IkFkbWluIiwibmJmIjoxNzQ1NjQxNDAzLCJleHAiOjIwNjExNzQyMDMsImlhdCI6MTc0NTY0MTQwMywiaXNzIjoieW91ci1pc3N1ZXIiLCJhdWQiOiJ5b3VyLWF1ZGllbmNlIn0.q4vXBQp1JmjLfNUvEzFBgdTPrw_AGRAKRRoQ1ryoDoo',
              },
            },
          )
          .then((response) => {
            // Parse data according to API response format
            const { id, result, cardsIds, createdAt } = response.data;
            setReadingResult(result);
            setResponseId(id);
            setCreatedAt(new Date(createdAt).toLocaleDateString());
            setError(null);
            setIsLoading(false); // Set loading to complete
            console.log('Reading result fetched successfully');
            console.log('API response:', response.data);
            console.log('Reading result:', result);
            console.log('Created at:', createdAt);
            console.log('Cards IDs:', cardsIds);

            // If the API returns card IDs, we could use them to update the displayed cards
            // Keeping the original cards here since the API might only return IDs without detailed information
          })
          .catch((error) => {
            console.error('Error fetching reading result:', error);

            // Check if there's a response with detailed error message
            let errorMessage =
              'Unable to fetch your reading. Please try again later.';

            if (error.response && error.response.data) {
              // If it's an OpenAI API error, display more specific information
              if (
                error.response.data.includes(
                  'Failed to generate text from OpenAI',
                )
              ) {
                errorMessage =
                  'The AI service is currently unavailable. Please try again later or contact support if the problem persists.';
              } else {
                errorMessage = `Server error: ${error.response.data}`;
              }
            }

            setError(errorMessage);
            // Use default reading text when request fails
            setReadingResult(
              'Based on your selected cards, you are at a point of new beginnings with great potential ahead. Trust your intuition and use your resources wisely to manifest your desires.',
            );
            setIsLoading(false); // Set loading to complete
          });
      }, 2000); // Add 2-second delay
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
      setReadingResult(
        'Based on your selected cards, you are at a point of new beginnings with great potential ahead. Trust your intuition and use your resources wisely to manifest your desires.',
      );

      // Simulate loading effect, even when using default data
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }, []);

  const handleNewReading = () => {
    sessionStorage.removeItem('selectedCards');
    sessionStorage.removeItem('userQuestion');
    sessionStorage.removeItem('selectedThemeId');
    navigate('/selection');
  };

  // If loading, show the loading animation

  return (
    <div className="results-container">
      <Heading size="xl" accessibilityLevel={1}>
        Your Tarot Reading Results
      </Heading>

      {error && (
        <Box marginBottom={4} padding={2} color="red">
          <Text align="center" color="light">
            {error}
          </Text>
        </Box>
      )}

      {responseId && (
        <Box marginBottom={2}>
          <Text align="center" size="sm" color="gray">
            {/* Reading ID: {responseId} • {createdAt} */}
          </Text>
        </Box>
      )}

      <Box>
        <Text align="center">
          The cards have revealed your path. Here is your personalized reading.
        </Text>
      </Box>

      <div
        className="fixed top-115 left-1/2 -translate-x-1/2 w-1200 h-1200 bg-[#FFF9F7] rounded-full z-[-1] pointer-events-none"
        style={{ boxShadow: '0px 80px 300px rgba(0, 0, 0, 0.75)' }}
      />

      <div className="selected-cards-display">
        {selectedCards.map((card) => (
          <div key={card.id}>
            <div>
              <Card
                frontImage={card.imageSource || '/defautFrontCard.png'}
                backImage={card.imageSource || '/defaultBackCard.png'}
                initialFlipped={true}
                name={card.name}
                description={card.description}
              />
            </div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="loading-interpretation" style={{ marginTop: '20px' }}>
          <LoadingAnimation />
          <Text align="center" size="lg" color="darkGray">
            Interpreting your cards...
          </Text>
        </div>
      ) : (
        <Box marginTop={8} marginBottom={4} width="90%" maxWidth={800}>
          <Heading size="md" accessibilityLevel={2}>
            Your Reading Interpretation
          </Heading>
          <Box marginTop={2} marginBottom={6}>
            <Text>{readingResult}</Text>
            {error && (
              <Text italic color="gray" size="sm">
                Note: This is a default reading. The personalized reading could
                not be generated due to a technical issue.
              </Text>
            )}
          </Box>
        </Box>
      )}

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
