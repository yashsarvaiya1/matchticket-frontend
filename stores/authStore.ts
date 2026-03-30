// stores/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PendingAuth } from '@/models/auth'

interface AuthStore {
  access:       string | null
  refresh:      string | null
  name:         string | null
  is_staff:     boolean
  is_superuser: boolean
  pending:      PendingAuth | null

  setAuth:    (data: { access: string; refresh: string; name: string | null; is_staff: boolean; is_superuser: boolean }) => void
  setAccess:  (access: string) => void
  setPending: (pending: PendingAuth) => void
  clearAuth:  () => void
  isAdmin:    () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      access:       null,
      refresh:      null,
      name:         null,
      is_staff:     false,
      is_superuser: false,
      pending:      null,

      setAuth: (data) => set({
        access:       data.access,
        refresh:      data.refresh,
        name:         data.name,
        is_staff:     data.is_staff,
        is_superuser: data.is_superuser,
        pending:      null,
      }),

      setAccess:  (access) => set({ access }),
      setPending: (pending) => set({ pending }),
      clearAuth:  () => set({ access: null, refresh: null, name: null, is_staff: false, is_superuser: false, pending: null }),
      isAdmin:    () => get().is_staff || get().is_superuser,
    }),
    { name: 'matchticket-auth' }
  )
)
