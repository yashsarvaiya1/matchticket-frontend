// hooks/useMatches.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { matchService } from '@/services/matchService'
import { toast } from 'sonner'

export function useMatches(params?: { common_match?: number; status?: string }) {
  return useQuery({
    queryKey:            ['matches', params],
    queryFn:             () => matchService.listMatches(params),
    staleTime:           30_000,
    refetchOnWindowFocus: true,
    select:              (res) => res.data,
  })
}

export function useMatch(id: number) {
  return useQuery({
    queryKey:            ['match', id],
    queryFn:             () => matchService.getMatch(id),
    staleTime:           15_000,
    refetchOnWindowFocus: true,
    select:              (res) => res.data,
  })
}

export function useCreateMatch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: matchService.createMatch,
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['matches'] }); toast.success('Match created.') },
    onError:    () => toast.error('Failed to create match.'),
  })
}

export function useActivateMatch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => matchService.activate(id),
    onSuccess:  (_, id) => { qc.invalidateQueries({ queryKey: ['match', id] }); qc.invalidateQueries({ queryKey: ['matches'] }) },
    onError:    () => toast.error('Failed to activate match.'),
  })
}

export function useEndMatch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => matchService.end(id),
    onSuccess:  (_, id) => { qc.invalidateQueries({ queryKey: ['match', id] }); toast.success('Match ended.') },
    onError:    (err: any) => toast.error(err.response?.data?.detail || 'Failed to end match.'),
  })
}

export function useRevealWinner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => matchService.revealWinner(id),
    onSuccess:  (_, id) => { qc.invalidateQueries({ queryKey: ['match', id] }); toast.success('Winners revealed!') },
    onError:    (err: any) => toast.error(err.response?.data?.detail || 'Failed to reveal winners.'),
  })
}

export function usePositions(matchId: number) {
  return useQuery({
    queryKey: ['positions', matchId],
    queryFn:  () => matchService.listPositions(matchId),
    select:   (res) => res.data.results,
  })
}

export function useUpdatePosition(matchId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data, scope }: { id: number; data: { player?: number | null; score?: string | null }; scope: 'mine' | 'all' }) =>
      matchService.updatePosition(id, data, scope),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['positions', matchId] }); qc.invalidateQueries({ queryKey: ['match', matchId] }) },
    onError:   () => toast.error('Failed to update position.'),
  })
}

export function useCommonMatches() {
  return useQuery({
    queryKey: ['common-matches'],
    queryFn:  () => matchService.listCommonMatches(),
    select:   (res) => res.data.results,
  })
}

export function useCreateCommonMatch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: matchService.createCommonMatch,
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['common-matches'] }); toast.success('Common match created.') },
    onError:    (err: any) => toast.error(err.response?.data?.non_field_errors?.[0] || 'Failed to create.'),
  })
}
