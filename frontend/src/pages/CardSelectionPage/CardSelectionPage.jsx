import Card from '../../components/Card/Card';
import './CardSelectionPage.css';
import { useNavigate } from 'react-router-dom';
import { Button, Box } from 'gestalt';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';
import { AppContext } from '../../context/AppContextProvider';

import { AppContext } from '../../context/AppContextProvider';

export default function CardSelectionPage() {
  const [selectedCards, setSelectedCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { userPrompt, userChosenTheme, userInfo } = useContext(AppContext);

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
    // Prevent selection if already have 3 cards selected and this card is not selected
    if (selectedCards.length >= 3 && !selectedCards.includes(cardId)) {
      return;
    }

    // Only allow adding cards, not removing them
    if (!selectedCards.includes(cardId) && selectedCards.length < 3) {
      const newSelectedCards = [...selectedCards, cardId];
      setSelectedCards(newSelectedCards);

      // 如果选择了3张卡片，自动跳转到结果页面
      if (newSelectedCards.length === 3) {
        setTimeout(() => {
          navigateToResults(newSelectedCards);
        }, 1000); // 延迟一秒后跳转，让用户看到第三张卡片被选中
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
  const navigateToResults = (selectedIds = selectedCards) => {
    const selectedCardDetails = getSelectedCardDetails(selectedIds);

    // Store selected cards in sessionStorage
    // This will allow us to access the selected cards in the results page
    sessionStorage.setItem(
      'selectedCards',
      JSON.stringify(selectedCardDetails),
    );

    navigate('/results');
  };

  const handleContinue = () => {
    // Use these values to make the API call to AI fortune teller
    console.log(userPrompt, userChosenTheme, userInfo, selectedCards);
    navigateToResults();
  };

  const isCardDisabled = (cardId) => {
    return selectedCards.length >= 3 && !selectedCards.includes(cardId);
  };

  // Display a loading state while fetching cards
  if (isLoading && !cards.length) {
    return (
      <div className="selection-container">
        <div className="mystical-orb"></div>
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
