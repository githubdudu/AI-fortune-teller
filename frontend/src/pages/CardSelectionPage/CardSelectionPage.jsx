import Card from '../../components/Card/Card';
import './CardSelectionPage.css';
import { useNavigate } from 'react-router-dom';
import { Button, Box } from 'gestalt';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';

import { AppContext } from '../../context/AppContextProvider';

export default function CardSelectionPage() {
  const [selectedCards, setSelectedCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [readingResult, setReadingResult] = useState(null);

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const {
    saveUserChosenCards,
    saveReadingResult,
    userChosenTheme,
    userPrompt,
  } = useContext(AppContext);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = () => {
    setIsLoading(true);

    // Add a 2-second delay before fetching cards
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2-second delay
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
          navigateToResults(newSelectedCards);
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

  // Function to navigate to results page
  const navigateToResults = (
    cardsIds = selectedCards,
    result = readingResult,
  ) => {
    const selectedCardDetails = getSelectedCardDetails(cardsIds);

    // Save selected cards to context (which uses sessionStorage internally)
    saveUserChosenCards(selectedCardDetails);
    saveReadingResult(result);

    navigate('/results');
  };
  const handleContinue = () => {
    // Use these values to make the API call to AI fortune teller

    if (selectedCards && selectedCards.length > 0) {
      console.log('Selected cards:', selectedCards);

      // Get card IDs for API request
      const cardIds = selectedCards;
      const question = userPrompt || '';
      const themeId = userChosenTheme ? userChosenTheme.id : null;
      console.log('Question:', question);
      console.log('Theme ID:', themeId);
      console.log('Card IDs:', cardIds);

      // Set to loading state
      setIsLoading(true);

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
          const { result, cardsIds } = response.data;
          setReadingResult(result);

          setError(null);
          setIsLoading(false); // Set loading to complete
          console.log('Reading result fetched successfully');
          console.log('API response:', response.data);
          console.log('Reading result:', result);
          console.log('Cards IDs:', cardsIds);

          navigateToResults(cardsIds, result);

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
    }
  };

  const isCardDisabled = (cardId) => {
    return selectedCards.length >= 3 && !selectedCards.includes(cardId);
  };

  // Display a loading state while fetching cards
  if (isLoading) {
    return (
      <div className="selection-container">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="selection-container">
      <h1 className="selection-title">Select three Cards for your reading</h1>

      {error && (
        <div className="error-message">
          Could not fetch cards from server. Using demo cards instead.
        </div>
      )}

      {selectedCards.length === 3 ? (
        <div className="next-button-container">
          <Button
            text="See Your Reading"
            color="blue"
            onClick={handleContinue}
            size="lg"
          />
        </div>
      ) : (
        <div className="cards-remaining">
          <span>{3 - selectedCards.length} cards remaining</span>
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
    </div>
  );
}
