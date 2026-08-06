import { useState, useCallback, useRef, useEffect } from 'react';
import { API_CONFIG } from '$/constants/config';

// Default fallback if not provided
const DEFAULT_READING_TEXT =
  'Based on your selected cards, you are at a point of new beginnings with great potential ahead. Trust your intuition and use your resources wisely to manifest your desires.';

// Give up on a stream that goes this long without delivering any data
const STREAM_IDLE_TIMEOUT_MS = 30000;

const NO_RECORDING = { rawChunk() {}, event() {}, dump() {} };

/**
 * Custom hook for handling fortune streaming functionality
 *
 * Server-sent events Specification:
 * https://html.spec.whatwg.org/multipage/server-sent-events.html
 * Streams must be decoded using the UTF-8 decode algorithm.
 * The UTF-8 decode algorithm strips one leading UTF-8 Byte Order Mark (BOM), if any.
 *
 * @param {Object} options - Options for the hook
 * @param {string} options.fallbackText - Text to use if streaming fails
 * @returns {Object} - Streaming state and controls
 */
export function useFortuneStream({ fallbackText = DEFAULT_READING_TEXT } = {}) {
  // State for streaming
  const [streamingText, setStreamingText] = useState(fallbackText);
  const [streamError, setStreamError] = useState(null);
  const [streamLoading, setStreamLoading] = useState(false);
  // Model OpenRouter actually resolved the request to, sent as a JSON
  // "model" event before the first text chunk
  const [streamModel, setStreamModel] = useState(null);

  // Refs for stream control
  const abortControllerRef = useRef(null);
  const timeoutRef = useRef(null);

  // Abort the in-flight stream, if any
  const cleanupStream = useCallback(() => {
    clearTimer(timeoutRef);

    if (abortControllerRef.current) {
      try {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      } catch (error) {
        console.warn('Error aborting controller:', error);
      }
    }

    setStreamLoading(false);
  }, []);

  // Cleanup on component unmount
  useEffect(() => cleanupStream, [cleanupStream]);

  const startFortuneStream = useCallback(
    async (requestBody) => {
      // Clean up any existing stream before starting a new one
      cleanupStream();

      console.log('Starting fortune stream');
      setStreamLoading(true);
      setStreamingText('');
      setStreamError(null);
      setStreamModel(null);

      const recorder = createRecorder();
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // A stream that was superseded by a newer one must not touch the state
      // that now belongs to its replacement
      const isCurrent = () => abortControllerRef.current === abortController;

      const restartIdleTimeout = () => {
        clearTimer(timeoutRef);
        timeoutRef.current = setTimeout(() => {
          console.log('Stream idle timeout reached');
          // cleanupStream() drops the "current" marker, so restore the fallback
          // here rather than leaving the reader with an empty result
          setStreamingText((previous) => previous || fallbackText);
          cleanupStream();
        }, STREAM_IDLE_TIMEOUT_MS);
      };

      const appendText = (text) => {
        setStreamLoading(false);
        setStreamingText((previous) => previous + text);
      };

      /** @returns {boolean} true when the event ends the stream */
      const handleEvent = (eventLines) => {
        const payload = readEventPayload(eventLines);
        recorder.event(payload);

        const event = decodeEvent(payload);

        if (event.kind === 'text') appendText(event.text);
        if (event.kind === 'model') setStreamModel(event.model);
        if (event.kind === 'error') {
          setStreamError(toErrorMessage({ status: 200, body: event.message }));
        }

        return event.kind === 'error' || event.kind === 'complete';
      };

      const readEvents = async (reader) => {
        const decoder = new TextDecoder();
        let buffer = '';

        for (;;) {
          const { value, done } = await reader.read();
          restartIdleTimeout();

          // The final decode() flushes any half-decoded multi-byte character
          const chunk = done
            ? decoder.decode()
            : decoder.decode(value, { stream: true });
          recorder.rawChunk(chunk);
          buffer += chunk;

          const { events, rest } = splitSseEvents(buffer, { flush: done });
          buffer = rest;

          for (const eventLines of events) {
            if (handleEvent(eventLines)) return;
          }

          if (done) {
            console.log('Stream completed normally');
            return;
          }
        }
      };

      restartIdleTimeout();

      try {
        const reader = await openFortuneStream(
          requestBody,
          abortController.signal,
        );
        console.log('Stream connected successfully');
        await readEvents(reader);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Stream aborted');
          return;
        }

        console.error('Error with streaming request:', error);
        if (isCurrent()) {
          setStreamError(toErrorMessage(error));
        }
      } finally {
        recorder.dump();

        if (isCurrent()) {
          console.log('Completing stream.');
          clearTimer(timeoutRef);
          setStreamingText((previous) => previous || fallbackText);
          setStreamLoading(false);
        }
      }
    },
    [cleanupStream, fallbackText],
  );

  return {
    // State
    streamingText,
    streamLoading,
    streamError,
    streamModel,
    // Actions
    startFortuneStream,
  };
}

/**
 * Map a failed stream response to a user-facing message.
 *
 * The backend (FortunesController.StreamFortuneAsync) reports most errors
 * with HTTP 200: pre-stream validation failures are written as plain text
 * without SSE framing, and mid-stream exceptions arrive as JSON "error"
 * events. Non-2xx statuses only come from model binding (400), middleware
 * (429/500), or the proxy (502/503/504).
 */
function toErrorMessage(error) {
  const status = error.status ?? 0;
  const body = error.body || error.message || '';

  if (body.includes('must be logged in')) {
    return 'Please log in to get your fortune reading.';
  }
  if (status === 429 || body.includes('rate limit')) {
    return 'You have reached the reading limit. Please try again later.';
  }
  if (body.includes('OpenAI')) {
    return 'The AI service is currently unavailable. Please try again later or contact support if the problem persists.';
  }
  if (status === 400 || body.includes('Request must include')) {
    return 'Invalid reading request. Please select your cards and try again.';
  }
  if (status === 502 || status === 503 || status === 504) {
    return 'The fortune service is temporarily unavailable. Please try again later.';
  }
  if (status >= 500) {
    try {
      const message = JSON.parse(body).Message;
      if (message) {
        return `Server error: ${message}`;
      }
    } catch {
      // Non-JSON 5xx body (e.g. proxy HTML) — use the generic message below
    }
    return 'Server error. Please try again later.';
  }
  return 'Unable to fetch your reading. Please try again later.';
}

/**
 * Cut complete SSE events out of the buffer. An event ends at a blank line;
 * whatever follows the last one is incomplete and stays in `rest` — never
 * dropped, never processed twice. `flush` releases that remainder, for when
 * the connection closed without a trailing blank line.
 *
 * @returns {{ events: string[][], rest: string }} events as their raw lines
 */
function splitSseEvents(buffer, { flush = false } = {}) {
  const events = [];
  let rest = buffer;
  let separatorIndex;

  while ((separatorIndex = rest.indexOf('\n\n')) !== -1) {
    const rawEvent = rest.slice(0, separatorIndex);
    rest = rest.slice(separatorIndex + 2);
    if (rawEvent.length > 0) {
      events.push(rawEvent.split('\n'));
    }
  }

  if (flush && rest.length > 0) {
    events.push(rest.split('\n'));
    rest = '';
  }

  return { events, rest };
}

/**
 * An event's payload is its "data:" lines joined with newlines, per the SSE
 * spec. A line without the prefix is kept verbatim so text from a backend that
 * didn't escape its newlines still comes through instead of being dropped.
 */
function readEventPayload(eventLines) {
  return eventLines
    .map((line) => {
      if (!line.startsWith('data:')) return line;
      const content = line.substring(5);
      // Only trim the single optional space after the colon
      return content.startsWith(' ') ? content.substring(1) : content;
    })
    .join('\n');
}

/**
 * Turn one event payload into an intent, so the decoding stays pure and the
 * React state updates all live in one place.
 *
 * @returns {{ kind: 'text'|'model'|'error'|'complete', ... }}
 */
function decodeEvent(payload) {
  let data;
  try {
    data = JSON.parse(payload);
  } catch {
    // Not JSON — plain text from the legacy framing. Mid-stream exceptions
    // from an older backend arrive as "data: Error: ..." events.
    if (payload.startsWith('Error:')) {
      return { kind: 'error', message: payload };
    }
    return { kind: 'text', text: payload === '' ? '\n' : payload };
  }

  // A payload that parses but isn't one of our envelopes is still reading text
  // — "42", "true" and "null" are all things a model can emit as a chunk, and
  // dropping them silently truncates the reading.
  if (data === null || typeof data !== 'object') {
    return { kind: 'text', text: payload };
  }

  if (data.type === 'model' && data.model) {
    return { kind: 'model', model: data.model };
  }

  if (data.type === 'error') {
    return { kind: 'error', message: data.message || '' };
  }

  if (data.type === 'complete') {
    return { kind: 'complete' };
  }

  // Check the type, not truthiness: an empty string is a legitimate (if
  // useless) chunk, and "0" must not be swallowed
  if (typeof data.content === 'string') {
    return { kind: 'text', text: data.content };
  }

  return { kind: 'ignore' };
}

/** Cancel a pending timeout held in a ref, if any. */
function clearTimer(timeoutRef) {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }
}

/**
 * Records everything read off the wire so a finished stream can be inspected in
 * the console. Disabled outside development: logging the arrays keeps them
 * alive for as long as devtools holds the reference.
 */
function createRecorder() {
  const startedAt = Date.now();
  const rawChunks = [];
  const events = [];
  let dumped = false;

  return {
    rawChunk: (text) => rawChunks.push(text),
    event: (payload) => events.push(payload),
    dump() {
      // The stream can finish more than once (normal end, then abort)
      if (dumped) return;
      dumped = true;

      console.group('[useFortuneStream] stream recording');
      console.log('duration (ms):', Date.now() - startedAt);
      console.log('raw chunks read:', rawChunks.length);
      console.log('SSE events parsed:', events.length);
      console.log('raw stream text:', rawChunks.join(''));
      console.log('raw chunks:', rawChunks);
      console.log('events:', events);
      console.groupEnd();
    },
  };
}

/**
 * Open the fortune stream and hand back a reader over its body.
 * Throws an error carrying `status` and `body` if the response isn't a stream.
 */
async function openFortuneStream(requestBody, signal) {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FORTUNES_STREAM}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(requestBody),
      credentials: 'include',
      signal,
      keepalive: true,
    },
  );

  // Pre-stream validation failures (e.g. not logged in) come back as HTTP 200
  // plain text without the text/event-stream content type
  const contentType = response.headers.get('content-type') || '';

  if (!response.ok || !contentType.includes('text/event-stream')) {
    const body = await response.text().catch(() => '');
    const error = new Error(
      response.ok
        ? body || 'Unexpected response'
        : `HTTP error! Status: ${response.status}`,
    );
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return response.body.getReader();
}

export default useFortuneStream;
