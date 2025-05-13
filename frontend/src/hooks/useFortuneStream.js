import { useState, useRef } from 'react';
import { API_CONFIG } from '../constants/config';

/**
 * Custom hook for handling fortune reading streaming functionality
 * @param {Object} options - Configuration options
 * @param {Function} options.onStreamComplete - Callback function when stream completes
 * @param {number} options.timeoutMs - Timeout in milliseconds before aborting stream (default: 60000)
 * @returns {Object} Streaming utilities and state
 */
const useFortuneStream = ({ onStreamComplete, timeoutMs = 60000 }) => {
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Default fallback text when stream fails
  const fallbackText =
    'Based on your selected cards, you are at a point of new beginnings with great potential ahead. Trust your intuition and use your resources wisely to manifest your desires.';

  // Clean up function to abort any existing requests
  const cleanupStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  // Function to start streaming fortune reading
  const startFortuneStream = (requestBody) => {
    setIsLoading(true);
    setIsStreaming(true);
    setStreamingText('');
    setError(null);

    // Abort any existing requests
    cleanupStream();

    // Create a new AbortController for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Use fetch with streaming response handler
    fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FORTUNES_STREAM}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream', // Explicitly accept SSE format
      },
      body: JSON.stringify(requestBody),
      credentials: 'include', // This is important for sending cookies
      signal: abortController.signal,
    })
      .then((response) => {
        if (!response.ok) {
          console.error(`Server responded with status: ${response.status}`);
          // Try to read the error response
          return response.text().then((text) => {
            console.error('Error response:', text);
            throw new Error(`HTTP error! Status: ${response.status}`);
          });
        }

        console.log(
          'Stream connected, response headers:',
          Object.fromEntries([...response.headers]),
        );

        // Check if we got the expected content type
        const contentType = response.headers.get('content-type') || '';
        if (
          !contentType.includes('text/event-stream') &&
          !contentType.includes('application/json')
        ) {
          console.warn(`Unexpected content type: ${contentType}`);
        }

        // Setup stream processing
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        // Mark when we've received the first data to stop loading state
        let receivedFirstData = false;

        function processStream() {
          return reader
            .read()
            .then(({ value, done }) => {
              if (done) {
                console.log('Stream completed');
                completeReading();
                return;
              }

              // Decode the chunk and add to buffer
              const chunk = decoder.decode(value, { stream: true });
              console.log('Received chunk:', chunk);
              buffer += chunk;

              // Process all complete lines in the buffer
              let processedLines = false;
              let startIndex = 0;
              let endIndex;

              while ((endIndex = buffer.indexOf('\n', startIndex)) !== -1) {
                const line = buffer.substring(startIndex, endIndex).trim();
                startIndex = endIndex + 1;

                if (line) {
                  processedLines = true;
                  console.log('Processing line:', line);

                  // Handle SSE format (data: {...})
                  if (line.startsWith('data:')) {
                    // Extract text content after "data:" prefix
                    const textContent = line.substring(5).trim();

                    // Try to parse as JSON first in case it is JSON format
                    try {
                      const data = JSON.parse(textContent);
                      if (data.content) {
                        if (!receivedFirstData) {
                          setIsLoading(false);
                          receivedFirstData = true;
                        }
                        setStreamingText((prev) => prev + data.content);
                      }
                      if (data.type === 'complete') {
                        completeReading();
                        return;
                      }
                    } catch (error) {
                      // Not JSON, treat as plain text content
                      console.log('Failed to parse as JSON:', error.message);
                      if (!receivedFirstData) {
                        setIsLoading(false);
                        receivedFirstData = true;
                      }
                      // Add the text content to the streaming text
                      setStreamingText((prev) => prev + textContent);
                    }
                  } else {
                    console.log('Unrecognized line format:', line);
                  }
                }
              }

              // If we processed some lines, update the buffer
              if (processedLines) {
                buffer = buffer.substring(startIndex);
              }

              // Continue reading
              return processStream();
            })
            .catch((error) => {
              console.error('Error reading stream:', error);
              completeReading();
            });
        }

        // Start processing the stream
        return processStream();
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Error with streaming request:', error);
          setError('Failed to stream fortune reading');

          // Use fallback
          setStreamingText(fallbackText);
          completeReading();
        }
      });

    // Fallback timeout in case the stream never completes
    setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        console.log('Stream timeout - aborting request');
        completeReading();
      }
    }, timeoutMs);

    // Function to finalize the reading process
    function completeReading() {
      const result = streamingText || fallbackText;

      setIsStreaming(false);
      setIsLoading(false);

      abortControllerRef.current = null;

      // Call the completion callback with the final text
      if (onStreamComplete) {
        onStreamComplete(result);
      }
    }
  };

  // Return hook state and functions
  return {
    streamingText,
    isStreaming,
    isLoading,
    error,
    startFortuneStream,
    cleanupStream,
  };
};

export default useFortuneStream;
