// services/userService.ts
import api from '@/lib/axios'
import type { User, TicketTransaction } from '@/models/user'
import type { PaginatedResponse } from '@/models/common'

export const userService = {
  list:          (page = 1)  => api.get<PaginatedResponse<User>>(`/auth/users/?page=${page}`),
  get:           (id: number) => api.get<User>(`/auth/users/${id}/`),
  create:        (data: { mobile_number: string; name?: string; is_staff?: boolean }) =>
                   api.post<User>('/auth/users/', data),
  activate:      (id: number) => api.patch(`/auth/users/${id}/activate/`),
  deactivate:    (id: number) => api.delete(`/auth/users/${id}/`),
  clearPassword: (id: number) => api.patch(`/auth/users/${id}/clear-password/`),
  addTickets:    (id: number, amount: string, note?: string) =>
                   api.post(`/auth/users/${id}/add-tickets/`, { amount, note }),
  removeTickets: (id: number, amount: string, note?: string) =>
                   api.post(`/auth/users/${id}/remove-tickets/`, { amount, note }),
  transactions:  (id: number, page = 1) =>
                   api.get<PaginatedResponse<TicketTransaction>>(`/auth/users/${id}/transactions/?page=${page}`),

  // Profile
  me:               ()     => api.get<User>('/auth/profile/me/'),
  updateMe:         (data: { name: string }) => api.patch<User>('/auth/profile/me/', data),
  clearMyPassword:  ()     => api.patch('/auth/profile/me/clear-password/'),
  myTransactions:   (page = 1) =>
                      api.get<PaginatedResponse<TicketTransaction>>(`/auth/profile/me/transactions/?page=${page}`),
}
