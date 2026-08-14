import { useCallback, useEffect } from 'react';

import audioEngine from '$/utils/audioEngine';
import { useAudioStore } from '$/stores/audioStore';

/**
 * Arms the audio engine on the first user gesture of the session.
 *
 * Mounted once, by RootLayoutPage. An AudioContext created before a gesture is
 * born suspended and every later `resume()` is a coin flip, so the engine is
 * not built at all until something is clicked, tapped or typed — at which
 * point the persisted preferences are pushed into it and, if music was left
 * on, the ambient bed starts.
 */
export function useAudioBootstrap() {
  useEffect(() => {
    const arm = () => {
      const { musicEnabled, sfxEnabled, volume } = useAudioStore.getState();

      audioEngine.setSfxEnabled(sfxEnabled);
      audioEngine.setVolume(volume);
      audioEngine.setMusicEnabled(musicEnabled);
      // unlock() last: it reads the flags above when it builds the graph
      audioEngine.unlock();
    };

    const events = ['pointerdown', 'keydown', 'touchstart'];
    events.forEach((event) =>
      window.addEventListener(event, arm, { once: true, passive: true }),
    );

    return () => {
      events.forEach((event) => window.removeEventListener(event, arm));
    };
  }, []);

  // The tab going to the background should not leave a pad droning in it
  useEffect(() => {
    const onVisibilityChange = () => {
      if (!audioEngine.isReady) return;
      const { musicEnabled } = useAudioStore.getState();
      if (document.hidden) audioEngine.setMusicEnabled(false);
      else if (musicEnabled) audioEngine.setMusicEnabled(true);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);
}

/**
 * Returns a stable `play(name)` for the one-shot effects defined in
 * audioEngine: 'hover' | 'select' | 'deselect' | 'flip' | 'reveal' |
 * 'confirm' | 'click' | 'error'.
 *
 * Safe to call unconditionally — it is a no-op while sound is off or before
 * the engine has been armed, so call sites need no guards of their own.
 */
export default function useSound() {
  return useCallback((name) => audioEngine.play(name), []);
}
