import PropTypes from 'prop-types';
import { AppContext } from './AppContext.jsx';
import { useLocalStorage, useSessionStorage } from 'react-use';
import { useState, useCallback, useRef, useEffect } from 'react';
import { API_CONFIG } from '$/constants/config';

import { logout as firebaseLogout } from '$/utils/firebase.js';

export function AppContextProvider({ children }) {
  // Original state
  const [userPrompt, setUserPrompt] = useSessionStorage('userPrompt', '');
  const [userChosenTheme, setUserChosenTheme] = useSessionStorage(
    'userChosenTheme',
    null,
  );

  const [userChosenCards, setUserChosenCards] = useSessionStorage(
    'userChosenCards',
    null,
  );

  const [readingResult, setReadingResult] = useSessionStorage(
    'readingResult',
    null,
  );

  const [userInfo, setUserInfo] = useSessionStorage('userInfo', null);
  const [userProfile, setUserProfile] = useSessionStorage('userProfile', null);

  const [isModalOpen, setIsModalOpen] = useSessionStorage('isModalOpen', true);

  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('isLoggedIn', null);

  // New streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [streamError, setStreamError] = useState(null);
  const [streamLoading, setStreamLoading] = useState(false);

  // Refs for stream control
  const abortControllerRef = useRef(null);
  const timeoutRef = useRef(null);

  // Default fallback text when stream fails
  const fallbackText =
    'Based on your selected cards, you are at a point of new beginnings with great potential ahead. Trust your intuition and use your resources wisely to manifest your desires.';

  // Cleanup function for streams
  const cleanupStream = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (abortControllerRef.current) {
      try {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      } catch (error) {
        console.warn('Error aborting controller:', error);
      }
    }

    setIsStreaming(false);
    setStreamLoading(false);
  }, []);

  // Cleanup on app unmount (rare, but good practice)
  useEffect(() => {
    return () => {
      cleanupStream();
    };
  }, [cleanupStream]);

  // Function to start a fortune stream (will persist even if components unmount)
  const startFortuneStream = useCallback(
    (requestBody, onComplete) => {
      // Clean up any existing streams
      cleanupStream();

      console.log('Starting fortune stream from context');
      setIsStreaming(true);
      setStreamLoading(true);
      setStreamingText('');
      setStreamError(null);

      // Create new abort controller
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Set timeout (30 seconds)
      timeoutRef.current = setTimeout(() => {
        console.log('Stream timeout reached');
        cleanupStream();
        setStreamingText(fallbackText);
        setReadingResult(fallbackText);

        if (onComplete) {
          onComplete(fallbackText);
        }
      }, 30000);

      // Start the actual stream
      fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FORTUNES_STREAM}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          Connection: 'keep-alive',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include',
        signal: abortController.signal,
        keepalive: true,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          console.log('Stream connected successfully');

          // Process stream
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let receivedFirstData = false;

          function processStream() {
            return reader
              .read()
              .then(({ value, done }) => {
                // Reset timeout on new data
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                  timeoutRef.current = setTimeout(() => {
                    console.log('Stream timeout reached during processing');
                    cleanupStream();

                    // Use what we have, or fallback text
                    const finalText = streamingText || fallbackText;
                    setReadingResult(finalText);

                    if (onComplete) {
                      onComplete(finalText);
                    }
                  }, 30000);
                }

                if (done) {
                  console.log('Stream completed normally');
                  completeStream();
                  return;
                }

                // Process data
                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                let startIndex = 0;
                let endIndex;

                while ((endIndex = buffer.indexOf('\n', startIndex)) !== -1) {
                  const line = buffer.substring(startIndex, endIndex).trim();
                  startIndex = endIndex + 1;

                  if (line && line.startsWith('data:')) {
                    // Handle space after "data:" prefix without removing spaces from content
                    // The regex matches "data:" followed by optional whitespace
                    console.log('Received line:', line);
                    const textContent = line.replace(/^data:\s?/, '');
                    console.log('Parsed text content:', textContent);

                    try {
                      const data = JSON.parse(textContent);
                      if (data.content) {
                        if (!receivedFirstData) {
                          setStreamLoading(false);
                          receivedFirstData = true;
                        }

                        // Ensure line breaks in the content are preserved
                        setStreamingText((prev) => {
                          // If data.content contains \n characters, they will be preserved
                          const newText = prev + data.content;
                          return newText;
                        });
                      }

                      if (data.type === 'complete') {
                        completeStream();
                        return;
                      }
                    } catch (error) {
                      console.error('Error parsing JSON:', error);
                      // Not JSON, treat as plain text
                      if (!receivedFirstData) {
                        setStreamLoading(false);
                        receivedFirstData = true;
                      }

                      // Ensure line breaks in plain text are preserved
                      setStreamingText((prev) => prev + textContent);
                    }
                  }
                }

                buffer = buffer.substring(startIndex);
                return processStream();
              })
              .catch((error) => {
                if (error.name === 'AbortError') {
                  console.log('Stream read aborted');
                } else {
                  console.error('Error reading stream:', error);
                  setStreamError('Error processing stream');
                }

                completeStream();
              });
          }

          return processStream();
        })
        .catch((error) => {
          console.error('Error with streaming request:', error);
          setStreamError('Failed to connect to streaming service');

          // Use fallback text
          setStreamingText(fallbackText);
          setReadingResult(fallbackText);
          cleanupStream();

          if (onComplete) {
            onComplete(fallbackText);
          }
        });

      function completeStream() {
        console.log('Completing stream with:', streamingText);

        const finalText = streamingText || fallbackText;
        setIsStreaming(false);
        setStreamLoading(false);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        // Save to persistent state
        setReadingResult(finalText);

        // Callback if provided
        if (onComplete) {
          onComplete(finalText);
        }
      }
    },
    [cleanupStream, fallbackText, streamingText, setReadingResult],
  );

  const clearQuestionAndTheme = () => {
    setUserPrompt('');
    setUserChosenTheme(null);
  };

  const clearReadingResult = () => {
    setReadingResult(null);
    setStreamingText('');
  };

  const toggleModalOpen = () => {
    setIsModalOpen((prev) => !prev);
  };

  const login = (profile) => {
    setIsLoggedIn(true);
    setUserProfile(profile);
  };

  const logout = () => {
    // Clear the local storage
    setIsLoggedIn(false);
    // Log out from Firebase
    firebaseLogout();

    // Clear the session storage
    setUserProfile(null);
    setUserInfo(null);
    setUserChosenCards(null);
    setUserPrompt('');
    setUserChosenTheme(null);
    setReadingResult(null);

    // Clear the modal state
    setIsModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        userChosenCards,
        saveUserChosenCards: setUserChosenCards,
        userPrompt,
        saveUserPrompt: setUserPrompt,
        userChosenTheme,
        saveUserChosenTheme: setUserChosenTheme,
        userInfo,
        saveUserInfo: setUserInfo,
        clearQuestionAndTheme,
        userProfile,
        setUserProfile,
        readingResult,
        saveReadingResult: setReadingResult,
        clearReadingResult,
        isModalOpen,
        toggleModalOpen,
        login,
        logout,
        isLoggedIn,
        // New streaming API
        streamingText,
        isStreaming,
        streamLoading,
        streamError,
        startFortuneStream,
        cleanupStream,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
