import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Text, Heading } from 'gestalt';
import Card from '../../components/Card/Card';
import './ResultsPage.css';
import { AppContext } from '../../context/AppContextProvider';

const ResultsPage = () => {
  const navigate = useNavigate();
  const {
    clearReadingResult,
    clearQuestionAndTheme,
    saveUserChosenCards,
    readingResult,
    userChosenCards,
  } = useContext(AppContext);

  const handleNewReading = () => {
    clearQuestionAndTheme();
    clearReadingResult();
    saveUserChosenCards(null);
    navigate('/');
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
        {userChosenCards.map((card) => (
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
