// services/authService.ts
import api from '@/lib/axios'
import type { LoginResponse } from '@/models/auth'

export const authService = {
  checkNumber: (mobile_number: string) =>
    api.post<{ password_set: boolean; name: string | null }>('/auth/check-number/', { mobile_number }),

  login: (mobile_number: string, password: string) =>
    api.post<LoginResponse>('/auth/login/', { mobile_number, password }),

  setPassword: (mobile_number: string, password: string, confirm_password: string) =>
    api.post<LoginResponse>('/auth/set-password/', { mobile_number, password, confirm_password }),

  refresh: (refresh: string) =>
    api.post<{ access: string }>('/auth/refresh/', { refresh }),

  logout: (refresh: string) =>
    api.post('/auth/logout/', { refresh }),
}
