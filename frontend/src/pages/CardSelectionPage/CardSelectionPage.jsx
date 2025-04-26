import Card from '../../components/Card/Card';
import './CardSelectionPage.css';
import { useNavigate } from 'react-router-dom';
import { Button, Box } from 'gestalt';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CardSelectionPage() {
  const [selectedCards, setSelectedCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        setIsLoading(false);
        console.log('Cards fetched:', response.data);
      })
      .catch((error) => {
        console.error('Error fetching cards:', error);
        setError(error);
        setIsLoading(false);

        // Fallback to demo cards if API fails
        setCards([
          { id: 1, name: 'The Fool', imageSource: '/defautFrontCard.png' },
          { id: 2, name: 'The Magician', imageSource: '/defautFrontCard.png' },
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
    if (selectedCards.length >= 3 && !selectedCards.includes(cardId)) {
      return;
    }

    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter((id) => id !== cardId));
    } else if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, cardId]);
    }
  };

  const handleCardFlip = (cardId, isFlipped) => {
    if (isFlipped) {
      setFlippedCards([...flippedCards, cardId]);
    } else {
      setFlippedCards(flippedCards.filter((id) => id !== cardId));
    }
  };

  const handleContinue = () => {
    navigate('/');
  };

  const isCardDisabled = (cardId) => {
    return selectedCards.length >= 3 && !selectedCards.includes(cardId);
  };

  // Display a loading state while fetching cards
  if (isLoading && !cards.length) {
    return (
      <div className="selection-container">
        <div className="mystical-orb"></div>
        <h1 className="selection-title">Loading Cards...</h1>
      </div>
    );
  }

  return (
    <div className="selection-container">
      <div className="mystical-orb"></div>

      <h1 className="selection-title">Select three Cards for your reading</h1>

      {error && (
        <div className="error-message">
          Could not fetch cards from server. Using demo cards instead.
        </div>
      )}

      <div className="cards-remaining">
        <span>{3 - selectedCards.length} cards remaining</span>
      </div>

      <div className="card-container">
        {cards.map((card) => (
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

      <p className="mystical-quote">Find The Magic Within</p>

      <Box marginTop={6}>
        <Button
          text="Continue to Reading"
          color="blue"
          disabled={selectedCards.length !== 3}
          onClick={handleContinue}
        />
      </Box>
    </div>
  );
}
