// stores/uiStore.ts
import { create } from 'zustand'

interface UIStore {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useUIStore = create<UIStore>((set) => ({
  theme:    'system',
  setTheme: (theme) => set({ theme }),
}))
