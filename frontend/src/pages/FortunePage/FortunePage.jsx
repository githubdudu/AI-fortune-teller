import Card from '../../components/Card/Card';
import './FortunePage.css';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Text, Heading } from 'gestalt';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';

import { AppContext } from '../../context/AppContextProvider';

const FortunePage = () => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [readingResult, setReadingResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const {
    saveUserChosenCards,
    saveReadingResult,
    userChosenTheme,
    userPrompt,
    clearReadingResult,
    clearQuestionAndTheme,
    readingResult: contextReadingResult,
    userChosenCards,
  } = useContext(AppContext);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = () => {
    setIsLoading(true);

    axios
      .get('http://localhost:5000/api/v1/cards/random?limit=5', {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZmNmYjk2Ny02ZmJmLTRkYWItOWRiMi1mNWMzMDQ2YzM1YzEiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6IkFkbWluIiwibmJmIjoxNzQ1NjQxNDAzLCJleHAiOjIwNjExNzQyMDMsImlhdCI6MTc0NTY0MTQwMywiaXNzIjoieW91ci1pc3N1ZXIiLCJhdWQiOiJ5b3VyLWF1ZGllbmNlIn0.q4vXBQp1JmjLfNUvEzFBgdTPrw_AGRAKRRoQ1ryoDoo',
        },
      })
      .then((response) => {
        setCards(response.data || []);
        console.log('Cards fetched:', response.data);

        // Add a 2-second delay before fetching cards
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      })
      .catch((error) => {
        console.error('Error fetching cards:', error);
        setError(error);
        setIsLoading(false);

        // Fallback to demo cards if API fails
        setCards([
          { id: 1, name: 'The Fool', imageSource: '/defautFrontCard.png' },
          {
            id: 2,
            name: 'The Magician',
            imageSource: '/defautFrontCard.png',
          },
          {
            id: 3,
            name: 'The High Priestess',
            imageSource: '/defautFrontCard.png',
          },
          { id: 4, name: 'The Empress', imageSource: '/defautFrontCard.png' },
          { id: 5, name: 'The Emperor', imageSource: '/defautFrontCard.png' },
        ]);
      });
  };

  const handleCardSelect = (cardId) => {
    // Prevent selection if already have 3 cards selected and this card is not selected
    if (selectedCards.length >= 3 && !selectedCards.includes(cardId)) {
      return;
    }

    // Only allow adding cards, not removing them
    if (!selectedCards.includes(cardId) && selectedCards.length < 3) {
      const newSelectedCards = [...selectedCards, cardId];
      setSelectedCards(newSelectedCards);

      // If 3 cards are selected, automatically navigate to the results page
      if (newSelectedCards.length === 4) {
        setTimeout(() => {
          handleReadButton(newSelectedCards);
        }, 1000); // Delay for 1 second to let the user see the third card being selected
      }
    }
  };

  const handleCardFlip = (cardId, isFlipped) => {
    if (isFlipped) {
      setFlippedCards([...flippedCards, cardId]);
    } else {
      setFlippedCards(flippedCards.filter((id) => id !== cardId));
    }
  };

  // Function to get selected card details
  // This function will return the card details for the selected IDs
  const getSelectedCardDetails = (selectedIds) => {
    return selectedIds.map((id) => {
      const card = cards.find((c) => c.id === id);
      return card || { id };
    });
  };

  const handleReadButton = (cardsIds = selectedCards) => {
    if (!cardsIds?.length) {
      const defaultCards = [
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
      ];

      const defaultResult =
        'Based on your selected cards, you are at a point of new beginnings with great potential ahead. Trust your intuition and use your resources wisely to manifest your desires.';

      setReadingResult(defaultResult);
      saveUserChosenCards(defaultCards);
      saveReadingResult(defaultResult);
      setShowResults(true);
      return;
    }

    const question = userPrompt || '';
    const themeId = userChosenTheme ? userChosenTheme.id : null;

    setIsLoading(true);

    axios
      .post(
        'http://localhost:5000/api/v1/Fortunes/ask',
        {
          question: question || '',
          cardIds: cardsIds,
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
        const { result, cardsIds: returnedCardIds } = response.data;
        setReadingResult(result);
        setError(null);
        setIsLoading(false);

        const selectedCardDetails = getSelectedCardDetails(
          returnedCardIds || cardsIds,
        );
        saveUserChosenCards(selectedCardDetails);
        saveReadingResult(result);

        setShowResults(true);

        console.log('Reading result fetched successfully');
        console.log('API response:', response.data);
        console.log('Reading result:', result);
        console.log('Cards IDs:', returnedCardIds);
      })
      .catch((error) => {
        console.error('Error fetching reading result:', error);

        let errorMessage =
          'Unable to fetch your reading. Please try again later.';

        if (error.response && error.response.data) {
          // If it's an OpenAI API error, display more specific information
          if (
            error.response.data.includes('Failed to generate text from OpenAI')
          ) {
            errorMessage =
              'The AI service is currently unavailable. Please try again later or contact support if the problem persists.';
          } else {
            errorMessage = `Server error: ${error.response.data}`;
          }
        }

        setError(errorMessage);

        // Use default reading text when request fails
        const defaultResult =
          'Based on your selected cards, you are at a point of new beginnings with great potential ahead. Trust your intuition and use your resources wisely to manifest your desires.';
        setReadingResult(defaultResult);

        // Save fallback data to context
        const selectedCardDetails = getSelectedCardDetails(cardsIds);
        saveUserChosenCards(selectedCardDetails);
        saveReadingResult(defaultResult);

        // Switch to results view even with the error
        setShowResults(true);
        setIsLoading(false);
      });
  };

  const handleNewReading = () => {
    // Reset everything for a new reading
    clearQuestionAndTheme();
    clearReadingResult();
    saveUserChosenCards(null);
    setSelectedCards([]);
    setFlippedCards([]);
    setReadingResult(null);
    setShowResults(false);
    fetchCards();
    navigate('/');
  };

  const isCardDisabled = (cardId) => {
    return selectedCards.length >= 3 && !selectedCards.includes(cardId);
  };

  if (isLoading) {
    return (
      <div className="selection-container">
        <LoadingAnimation />
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="results-container">
        <h1>Your Tarot Reading Results</h1>

        <Box>
          <Text align="center">
            The cards have revealed your path. Here is your personalized
            reading.
          </Text>
        </Box>

        <div className="selected-cards-display">
          {userChosenCards?.map((card) => (
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

        <Box marginTop={8} marginBottom={4}>
          <Heading size="md" accessibilityLevel={2}>
            Your Reading Interpretation
          </Heading>
          <Box marginTop={2} marginBottom={6}>
            <Text>{contextReadingResult || readingResult}</Text>
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
  }

  return (
    <div className="selection-container">
      <h1 className="selection-title">Select Three Cards for your Reading</h1>

      {error && (
        <div className="error-message">
          Could not fetch cards from server. Using demo cards instead.
        </div>
      )}

      <div className="card-container">
        {cards.map((card) => (
          // Check if the card is already selected
          <div
            key={card.id}
            className={`card-wrapper ${selectedCards.includes(card.id) ? 'selected' : ''}`}
            onClick={() => handleCardSelect(card.id)}
          >
            <Card
              frontImage="/defautFrontCard.png"
              backImage={card.imageSource || '/defaultBackCard.png'}
              disabled={isCardDisabled(card.id)}
              onCardFlip={(flipped) => handleCardFlip(card.id, flipped)}
              name={card.name}
              description={card.description}
            />
            {selectedCards.includes(card.id) && (
              <div className="card-number">
                {selectedCards.indexOf(card.id) + 1}
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedCards.length === 3 ? (
        <div>
          <Button
            text="See Your Reading"
            color="blue"
            onClick={() => handleReadButton()}
            size="lg"
          />
        </div>
      ) : (
        <div className="cards-remaining">
          <span>{3 - selectedCards.length} cards remaining</span>
        </div>
      )}
    </div>
  );
};

export default FortunePage;
