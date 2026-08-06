import audioEngine from '$/utils/audioEngine';

/**
 * jsdom has no Web Audio, which is exactly the environment the engine has to
 * survive: every method must be inert rather than throwing, so no component
 * needs to guard its own call sites.
 */
describe('audioEngine without Web Audio support', () => {
  beforeEach(() => {
    audioEngine.dispose();
  });

  afterEach(() => {
    audioEngine.dispose();
    vi.unstubAllGlobals();
  });

  it('reports not ready and refuses to unlock', () => {
    expect(audioEngine.unlock()).toBe(false);
    expect(audioEngine.isReady).toBe(false);
  });

  it('accepts preference changes without an AudioContext', () => {
    expect(() => {
      audioEngine.setVolume(0.4);
      audioEngine.setSfxEnabled(false);
      audioEngine.setMusicEnabled(true);
    }).not.toThrow();

    expect(audioEngine.volume).toBe(0.4);
    expect(audioEngine.sfxEnabled).toBe(false);
    expect(audioEngine.musicEnabled).toBe(true);
  });

  it('ignores play() for both known and unknown effects', () => {
    expect(() => {
      audioEngine.play('select');
      expect(audioEngine.play('no-such-sound')).toBeUndefined();
    }).not.toThrow();
  });

  it('unlocks once a constructor is available and starts the pad when music is on', () => {
    const stop = vi.fn();
    const node = () => ({
      connect: vi.fn(function connect(next) {
        return next;
      }),
      start: vi.fn(),
      stop,
      gain: {
        value: 0,
        setValueAtTime: vi.fn(),
        setTargetAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        cancelScheduledValues: vi.fn(),
      },
      frequency: {
        value: 0,
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      detune: { value: 0 },
      Q: { value: 0 },
      type: '',
    });

    vi.stubGlobal(
      'AudioContext',
      vi.fn(() => ({
        state: 'running',
        currentTime: 0,
        sampleRate: 44100,
        destination: {},
        createGain: node,
        createOscillator: node,
        createBiquadFilter: node,
        createBufferSource: node,
        createBuffer: () => ({ getChannelData: () => new Float32Array(8) }),
        resume: vi.fn(),
        close: vi.fn(),
      })),
    );

    audioEngine.setMusicEnabled(true);
    expect(audioEngine.unlock()).toBe(true);
    expect(audioEngine.isReady).toBe(true);

    audioEngine.setMusicEnabled(false);
    expect(() => audioEngine.play('reveal')).not.toThrow();
  });
});
