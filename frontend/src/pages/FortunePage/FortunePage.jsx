import Card from '../../components/Card/Card';
import './FortunePage.css';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Text, Heading } from 'gestalt';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';

import { AppContext } from '../../context/AppContextProvider';

const FortunePage = () => {
  const [selectedCardsID, setSelectedCardsID] = useState([]);

  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [readingResult, setReadingResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);
  const [isSelectDisabled, setIsSelectDisabled] = useState(false);
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
          {
            id: 3,
            name: 'The High Priestess',
            imageSource:
              'https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20High%20Priestess%20(II).png',
          },
          {
            id: 4,
            name: 'The Empress',
            imageSource:
              'https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20Empress%20(III).png',
          },
          {
            id: 5,
            name: 'The Emperor',
            imageSource:
              'https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/Minor_Major/4.%20The%20Hierophant%20(V).png',
          },
        ]);
      });
  };

  useEffect(() => {
    setIsSelectDisabled(selectedCardsID.length >= 3);
  }, [selectedCardsID]);

  const handleCardSelect = (cardId) => {
    // Prevent selection if already have 3 cards selected and this card has been selected
    if (isSelectDisabled || selectedCardsID.includes(cardId)) {
      return;
    }

    setSelectedCardsID((cards) => [...cards, cardId]);
  };

  // Function to get selected card details
  // This function will return the card details for the selected IDs
  const getSelectedCardDetails = (selectedIds) => {
    return selectedIds.map((id) => {
      const card = cards.find((c) => c.id === id);
      return card || { id };
    });
  };

  const handleReadButton = (cardsIds = selectedCardsID) => {
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
    setSelectedCardsID([]);
    setReadingResult(null);
    setShowResults(false);
    fetchCards();
    navigate('/');
  };

  const isCardDisabled = (cardId) => {
    return isSelectDisabled && !selectedCardsID.includes(cardId);
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
        <h1 className="reading-title"> Your ArcanaVerse Reading </h1>

        <Box className="reading-subtitle-wrapper">
          <p className="reading-subtitle-text">
            The cards have spoken. Here is your path forward.
          </p>
        </Box>

        <SelectedCardsDisplay />
        <ReadingInterpretationDisplay />

        <NewReadingButton />
      </div>
    );
  }

  return <SelectionDisplay />;

  function ReadingInterpretationDisplay() {
    const fullText = contextReadingResult || readingResult;
    const [typedText, setTypedText] = useState('');
    const [isDoneTyping, setIsDoneTyping] = useState(false);

    useEffect(() => {
      let i = 0;
      const interval = setInterval(() => {
        setTypedText((prev) => prev + fullText.charAt(i));
        i++;
        if (i >= fullText.length) clearInterval(interval);
        setIsDoneTyping(true);
      }, 60);
      return () => clearInterval(interval);
    }, [fullText]);
    return (
      <div className="interpretation-box">
        <h2 className="interpretation-title">✦ Interpretation ✦</h2>
        <p className={`interpretation-text ${isDoneTyping ? '' : 'typing'}`}>
          {typedText}
        </p>
      </div>
    );
  }

  function NewReadingButton() {
    return (
      <Box marginTop={2} display="flex" justifyContent="center">
        <button className="new-reading-button" onClick={handleNewReading}>
          Reveal Another Reading
        </button>
      </Box>
    );
  }

  function SelectedCardsDisplay() {
    return (
      <div className="selected-cards-display">
        {userChosenCards?.map((card) => (
          <div key={card.id}>
            <div>
              <Card
                frontImage={card.imageSource || '/defautFrontCard.png'}
                isShowFront={true}
                name={card.name}
                description={card.description}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  function SelectionDisplay() {
    return (
      <div className="selection-container">
        <h1 className="selection-title">Select Three Cards for your Reading</h1>

        {error && (
          <div className="error-message">
            Could not fetch cards from server. Using demo cards instead.
          </div>
        )}

        <CardsDisplay />
        {selectedCardsID.length === 3 ? (
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
            <span>{3 - selectedCardsID.length} cards remaining</span>
          </div>
        )}
      </div>
    );
  }

  function CardsDisplay() {
    return (
      <div className="card-container">
        {cards.map((card) => (
          // Check if the card is already selected
          <div
            key={card.id}
            className={`card-wrapper ${selectedCardsID.includes(card.id) ? 'selected' : ''}`}
            onClick={() => handleCardSelect(card.id)}
          >
            <Card
              backImage="https://tarot-card-images-all.s3.ap-southeast-2.amazonaws.com/TarotCardBackCard.png"
              frontImage={card.imageSource || '/defautFrontCard.png'}
              disabled={isCardDisabled(card.id)}
              isShowFront={selectedCardsID.includes(card.id)}
              name={card.name}
              description={card.description}
            />
            {selectedCardsID.includes(card.id) && (
              <div className="card-number">
                {selectedCardsID.indexOf(card.id) + 1}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
};

export default FortunePage;
