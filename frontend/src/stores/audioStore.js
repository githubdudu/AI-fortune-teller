import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import audioEngine from '$/utils/audioEngine';

/**
 * User-facing sound preferences.
 *
 * Persisted to localStorage (not sessionStorage like the modal state) — a mute
 * is a standing preference, not something to re-ask on every visit.
 *
 * Music starts off. Autoplaying a soundtrack at someone who just opened the
 * page is the behaviour every browser's autoplay policy exists to prevent;
 * they turn it on from the speaker button in the header.
 */
export const useAudioStore = create(
  persist(
    (set, get) => ({
      musicEnabled: false,
      sfxEnabled: true,
      volume: 0.7,

      setMusicEnabled: (musicEnabled) => {
        audioEngine.unlock();
        audioEngine.setMusicEnabled(musicEnabled);
        set({ musicEnabled });
      },
      toggleMusic: () => get().setMusicEnabled(!get().musicEnabled),

      setSfxEnabled: (sfxEnabled) => {
        audioEngine.setSfxEnabled(sfxEnabled);
        set({ sfxEnabled });
      },
      toggleSfx: () => get().setSfxEnabled(!get().sfxEnabled),

      setVolume: (volume) => {
        audioEngine.setVolume(volume);
        set({ volume });
      },
    }),
    {
      name: 'audio-store',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ musicEnabled, sfxEnabled, volume }) => ({
        musicEnabled,
        sfxEnabled,
        volume,
      }),
    },
  ),
);
