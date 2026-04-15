// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/userService'
import { toast } from 'sonner'

export function useUsers(page = 1) {
  return useQuery({
    queryKey: ['users', page],
    queryFn:  () => userService.list(page),
    select:   (res) => res.data,
  })
}

export function useUser(id: number) {
  return useQuery({
    queryKey:  ['user', id],
    queryFn:   () => userService.get(id),
    enabled:   !!id && !isNaN(id),   // ← add this line
    select:    (res) => res.data,
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: userService.create,
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('User created.') },
    onError: (err: any) => toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to create user.'),
  })
}

export function useAddTickets(userId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ amount, note }: { amount: string; note?: string }) =>
      userService.addTickets(userId, amount, note),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['user', userId] }); toast.success('Tickets added.') },
    onError:   () => toast.error('Failed to add tickets.'),
  })
}

export function useRemoveTickets(userId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ amount, note }: { amount: string; note?: string }) =>
      userService.removeTickets(userId, amount, note),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['user', userId] }); toast.success('Tickets removed.') },
    onError:   (err: any) => toast.error(err.response?.data?.amount?.[0] || 'Failed to remove tickets.'),
  })
}

export function useUserTransactions(userId: number, page = 1) {
  return useQuery({
    queryKey: ['user-transactions', userId, page],
    queryFn:  () => userService.transactions(userId, page),
    select:   (res) => res.data,
  })
}

export function useProfile() {
  return useQuery({
    queryKey:            ['me'],
    queryFn:             () => userService.me(),
    staleTime:           60_000,
    refetchOnWindowFocus: true,
    select:              (res) => res.data,
  })
}

export function useMyTransactions(page = 1) {
  return useQuery({
    queryKey: ['my-transactions', page],
    queryFn:  () => userService.myTransactions(page),
    select:   (res) => res.data,
  })
}
