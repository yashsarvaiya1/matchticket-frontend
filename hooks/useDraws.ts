// hooks/useDraws.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { matchService } from '@/services/matchService'
import { toast } from 'sonner'

export function useDrawBoxes(matchId: number) {
  return useQuery({
    queryKey:            ['drawboxes', matchId],
    queryFn:             () => matchService.listDrawBoxes(matchId),
    staleTime:           15_000,
    refetchOnWindowFocus: true,
    select:              (res) => res.data.results,
  })
}

export function useMyDraws(matchId: number) {
  return useQuery({
    queryKey:            ['my-draws', matchId],
    queryFn:             () => matchService.myDraws(matchId),
    staleTime:           15_000,
    refetchOnWindowFocus: true,
    select:              (res) => res.data,
  })
}

export function useOpenDraw(matchId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => matchService.openDraw(matchId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-draws', matchId] })
      qc.invalidateQueries({ queryKey: ['drawboxes', matchId] })
      qc.invalidateQueries({ queryKey: ['match', matchId] })
    },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Failed to open draw.'),
  })
}
