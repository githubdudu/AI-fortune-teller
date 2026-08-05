import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Modal open/close state for the FloatingPrompt on the landing page.
 * Lives outside AppContext so toggling the modal only re-renders subscribers.
 * Persisted to sessionStorage to survive page refreshes, matching the
 * previous useSessionStorage behavior.
 */
export const useModalStore = create(
  persist(
    (set) => ({
      isModalOpen: true,
      setIsModalOpen: (isModalOpen) => set({ isModalOpen }),
      toggleModalOpen: () =>
        set((state) => ({ isModalOpen: !state.isModalOpen })),
    }),
    {
      name: 'modal-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
