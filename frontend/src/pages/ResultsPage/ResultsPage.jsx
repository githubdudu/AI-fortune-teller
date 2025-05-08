import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Text, Heading } from 'gestalt';
import Card from '../../components/Card/Card';
import './ResultsPage.css';
import axios from 'axios';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';

const ResultsPage = () => {
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

      // 获取卡片ID用于API请求
      const cardIds = cards.map((card) => card.id.toString());
      const question = sessionStorage.getItem('userQuestion') || null;
      const themeId = sessionStorage.getItem('selectedThemeId');

      console.log('Question:', question);
      console.log('Theme ID:', themeId);
      console.log('Card IDs:', cardIds);

      // 设置为加载状态
      setIsLoading(true);

      // 增加2秒延迟
      setTimeout(() => {
        // 发送POST请求获取解读结果，添加认证头部
        axios
          .post(
            'http://localhost:5000/api/v1/Fortunes/ask',
            {
              question: question || null,
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
            // 根据API返回的格式解析数据
            const { id, result, cardsIds, createdAt } = response.data;
            setReadingResult(result);
            setResponseId(id);
            setCreatedAt(new Date(createdAt).toLocaleDateString());
            setError(null);
            setIsLoading(false); // 设置加载完成
            console.log('API response:', response.data);
            console.log('Reading result:', result);
            console.log('Created at:', createdAt);
            console.log('Cards IDs:', cardsIds);

            // 如果API返回了卡片ID，可以用这个更新显示的卡片
            // 这里保留原有的卡片，因为API可能只返回ID而没有详细信息
          })
          .catch((error) => {
            console.error('Error fetching reading result:', error);

            // 检查是否有响应并且是否有详细的错误消息
            let errorMessage =
              'Unable to fetch your reading. Please try again later.';

            if (error.response && error.response.data) {
              // 如果是 OpenAI API 错误，显示更具体的信息
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
            // 请求失败时使用默认解读文本
            setReadingResult(
              'Based on your selected cards, you are at a point of new beginnings with great potential ahead. Trust your intuition and use your resources wisely to manifest your desires.',
            );
            setIsLoading(false); // 设置加载完成
          });
      }, 2000); // 添加2秒延迟
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

      // 模拟加载效果，即使是使用默认数据
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

  // 如果正在加载，显示加载动画

  return (
    <div className="results-container">
      <h1>Your Tarot Reading Results</h1>

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
            Reading ID: {responseId} • {createdAt}
          </Text>
        </Box>
      )}

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
          <Text align="center" size="lg" color="darkGray"></Text>
        </div>
      ) : (
        <Box marginTop={8} marginBottom={4}>
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
