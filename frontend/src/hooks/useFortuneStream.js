import { useState, useCallback, useRef, useEffect } from 'react';
import { API_CONFIG } from '../constants/config';

/**
 * Custom hook for handling fortune streaming functionality
 * @param {Object} options - Options for the hook
 * @param {string} options.fallbackText - Text to use if streaming fails
 * @returns {Object} - Streaming state and controls
 */
export function useFortuneStream({ fallbackText } = {}) {
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

                // Process any complete events (terminate with double newlines)
                const events = [];
                let currentEvent = [];
                let lines = buffer.split('\n');
                let remainingLines = [];

                // Group lines into events based on empty line separator
                for (let i = 0; i < lines.length; i++) {
                  const line = lines[i];

                  if (line === '') {
                    // Empty line marks end of an event
                    if (currentEvent.length > 0) {
                      events.push(currentEvent);
                      currentEvent = [];
                    }
                  } else if (line.startsWith('data:')) {
                    // Add data line to current event
                    currentEvent.push(line);
                  } else {
                    // Incomplete line, keep for next buffer
                    remainingLines = lines.slice(i);
                    break;
                  }
                }

                // Add the last event if it's not empty and we processed all lines
                if (currentEvent.length > 0 && remainingLines.length === 0) {
                  events.push(currentEvent);
                }

                // Update buffer with remaining incomplete lines
                buffer = remainingLines.join('\n');
                if (currentEvent.length > 0 && remainingLines.length > 0) {
                  // Keep the last incomplete event
                  buffer = currentEvent.join('\n') + '\n' + buffer;
                }

                // Process each complete event
                events.forEach(processEvent);

                function processEvent(eventLines) {
                  // Extract content directly as strings
                  let contents = eventLines.map((line) => {
                    if (line.startsWith('data:')) {
                      // Get everything after "data:" preserving all values
                      const content = line.substring(5);
                      // Only trim the standard SSE space if it exists
                      return content.startsWith(' ')
                        ? content.substring(1)
                        : content;
                    }
                    return '';
                  });

                  // Log for debugging
                  console.log(
                    'Processing event lines:',
                    JSON.stringify(eventLines),
                  );
                  console.log('Extracted contents:', JSON.stringify(contents));

                  // Special handling for "---" horizontal rule and empty "data:" lines
                  for (let i = 0; i < contents.length; i++) {
                    if (contents[i] === '---') {
                      // Add line breaks before and after "---"
                      contents[i] = '\n---\n';
                    } else if (contents[i] === '') {
                      // Insert a new line when seeing empty "data:" lines
                      contents[i] = '\n';
                    }
                  }

                  // Each "data:" line should start a new line in the output
                  // Join with newlines to preserve the line structure
                  const rawContent = contents.join('\n');

                  console.log(
                    'Raw combined content with newlines:',
                    JSON.stringify(rawContent),
                  );

                  try {
                    // Try to parse as JSON first
                    const data = JSON.parse(rawContent);

                    // Handle numeric values by converting them to string
                    if (typeof data === 'number') {
                      if (!receivedFirstData) {
                        setStreamLoading(false);
                        receivedFirstData = true;
                      }
                      setStreamingText((prev) => prev + String(data));
                      return;
                    }

                    if (data.content) {
                      if (!receivedFirstData) {
                        setStreamLoading(false);
                        receivedFirstData = true;
                      }
                      setStreamingText((prev) => prev + data.content);
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

                    // Log previous content for comparison
                    setStreamingText((prev) => {
                      const newContent = prev + rawContent;
                      return newContent;
                    });
                  }
                }

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

        // Callback if provided
        if (onComplete) {
          onComplete(finalText);
        }
      }
    },
    [cleanupStream, actualFallback, streamingText],
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
