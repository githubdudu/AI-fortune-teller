import { renderHook, act, waitFor } from '@testing-library/react';

import { useFortuneStream } from '$/hooks/useFortuneStream';

/**
 * Feeds the hook a canned SSE response and returns once the stream has drained.
 * `parts` are enqueued as separate reads so event boundaries can be split
 * across chunks, the way they arrive over a real connection.
 */
async function runStream(parts) {
  const body = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      parts.forEach((part) => controller.enqueue(encoder.encode(part)));
      controller.close();
    },
  });

  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      headers: { get: () => 'text/event-stream' },
      body,
    }),
  );

  const { result } = renderHook(() => useFortuneStream());

  await act(async () => {
    result.current.startFortuneStream({ cardIds: ['a'], question: 'hi' });
  });

  await waitFor(() => expect(result.current.streamLoading).toBe(false));

  return result;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useFortuneStream', () => {
  it('exposes the model reported by the backend without mixing it into the text', async () => {
    // Bytes captured from a real backend stream response, BOM included
    const result = await runStream([
      '﻿data: {"type":"model","model":"poolside/laguna-xs-2.1:free"}\n\n',
      'data: {"content":"# The Fool"}\n\n',
    ]);

    await waitFor(() =>
      expect(result.current.streamModel).toBe('poolside/laguna-xs-2.1:free'),
    );

    expect(result.current.streamingText).toBe('# The Fool');
    expect(result.current.streamingText).not.toContain('model');
  });

  it('keeps newlines inside a JSON-framed chunk', async () => {
    const result = await runStream([
      'data: {"content":"# The Fool\\n\\n**Interpretation:**"}\n\n',
      'data: {"content":"\\n\\n---\\n"}\n\n',
    ]);

    expect(result.current.streamingText).toBe(
      '# The Fool\n\n**Interpretation:**\n\n---\n',
    );
  });

  it('does not stall when a chunk arrives with unescaped newlines', async () => {
    // Legacy framing: the model emitted a multi-line delta and the backend
    // wrote it raw, so the second line has no "data:" prefix
    const result = await runStream([
      'data: Hello\nWorld\n\n',
      'data: {"content":" after"}\n\n',
    ]);

    expect(result.current.streamingText).toBe('Hello\nWorld after');
  });

  it('renders chunks that happen to be valid JSON scalars', async () => {
    const result = await runStream([
      'data: {"content":"in "}\n\n',
      'data: 2026\n\n',
      'data: null\n\n',
      'data: {"content":" ok"}\n\n',
    ]);

    expect(result.current.streamingText).toBe('in 2026null ok');
  });

  it('does not drop a trailing event that lacks its blank line', async () => {
    const result = await runStream([
      'data: {"content":"the end"}\n\n',
      'data: {"content":" is here"}',
    ]);

    expect(result.current.streamingText).toBe('the end is here');
  });

  it('reassembles an event split across reads', async () => {
    const result = await runStream([
      'data: {"conte',
      'nt":"split ok"}\n',
      '\ndata: {"content":"!"}\n\n',
    ]);

    expect(result.current.streamingText).toBe('split ok!');
  });

  it('surfaces a JSON error event instead of rendering it', async () => {
    const result = await runStream([
      'data: {"type":"error","message":"Error: OpenAI exploded"}\n\n',
    ]);

    await waitFor(() => expect(result.current.streamError).toBeTruthy());
    expect(result.current.streamingText).not.toContain('exploded');
  });
});
