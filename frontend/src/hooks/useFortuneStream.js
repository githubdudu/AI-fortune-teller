import { useState, useCallback, useRef, useEffect } from 'react';
import { API_CONFIG } from '../constants/config';

/**
 * Custom hook for handling fortune streaming functionality
 * @param {Object} options - Options for the hook
 * @param {Function} options.onSaveResult - Function to save the result to persistent storage
 * @param {string} options.fallbackText - Text to use if streaming fails
 * @returns {Object} - Streaming state and controls
 */
export function useFortuneStream({ onSaveResult, fallbackText }) {
  // Default fallback if not provided
  const defaultFallback =
    'Based on your selected cards, you are at a point of new beginnings with great potential ahead. Trust your intuition and use your resources wisely to manifest your desires.';

  const actualFallback = fallbackText || defaultFallback;

  // State for streaming
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [streamError, setStreamError] = useState(null);
  const [streamLoading, setStreamLoading] = useState(false);

  // Refs for stream control
  const abortControllerRef = useRef(null);
  const timeoutRef = useRef(null);

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

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupStream();
    };
  }, [cleanupStream]);

  // Function to start a fortune stream
  const startFortuneStream = useCallback(
    (requestBody, onComplete) => {
      // Clean up any existing streams
      cleanupStream();

      console.log('Starting fortune stream');
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
        setStreamingText(actualFallback);

        if (onSaveResult) {
          onSaveResult(actualFallback);
        }

        if (onComplete) {
          onComplete(actualFallback);
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
                    const finalText = streamingText || actualFallback;

                    if (onSaveResult) {
                      onSaveResult(finalText);
                    }

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
                    } catch {
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
          setStreamingText(actualFallback);

          if (onSaveResult) {
            onSaveResult(actualFallback);
          }

          cleanupStream();

          if (onComplete) {
            onComplete(actualFallback);
          }
        });

      function completeStream() {
        console.log('Completing stream with:', streamingText);

        const finalText = streamingText || actualFallback;
        setIsStreaming(false);
        setStreamLoading(false);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        // Save to persistent state if provided
        if (onSaveResult) {
          onSaveResult(finalText);
        }

        // Callback if provided
        if (onComplete) {
          onComplete(finalText);
        }
      }
    },
    [cleanupStream, actualFallback, streamingText, onSaveResult],
  );

  // Clear streaming text
  const clearStreamingText = useCallback(() => {
    setStreamingText('');
  }, []);

  return {
    // State
    streamingText,
    isStreaming,
    streamLoading,
    streamError,
    // Actions
    startFortuneStream,
    cleanupStream,
    clearStreamingText,
  };
}

export default useFortuneStream;
