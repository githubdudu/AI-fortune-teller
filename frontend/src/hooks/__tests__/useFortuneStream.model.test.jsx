import { renderHook, act, waitFor } from '@testing-library/react';

import { useFortuneStream } from '$/hooks/useFortuneStream';

// Bytes captured from a real backend stream response, BOM included
const SSE_BYTES =
  '﻿data: {"type":"model","model":"poolside/laguna-xs-2.1:free"}\n\n' +
  'data: #\n\n' +
  'data:  The\n\n' +
  'data:  Fool\n\n';

function mockStreamResponse(text) {
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text));
      controller.close();
    },
  });

  return {
    ok: true,
    status: 200,
    headers: { get: () => 'text/event-stream' },
    body,
  };
}

describe('useFortuneStream model event', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve(mockStreamResponse(SSE_BYTES)),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('exposes the model reported by the backend and still renders the text', async () => {
    const { result } = renderHook(() => useFortuneStream());

    await act(async () => {
      result.current.startFortuneStream({ cardIds: ['a'], question: 'hi' });
    });

    await waitFor(() =>
      expect(result.current.streamModel).toBe('poolside/laguna-xs-2.1:free'),
    );

    expect(result.current.streamingText).toContain('The');
    expect(result.current.streamingText).not.toContain('model');
  });
});
