// hooks/useTeams.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { teamService } from '@/services/teamService'
import { toast } from 'sonner'

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn:  () => teamService.listTeams(),
    select:   (res) => res.data.results,
  })
}

export function useTeam(id: number) {
  return useQuery({
    queryKey: ['team', id],
    queryFn:  () => teamService.getTeam(id),
    select:   (res) => res.data,
  })
}

export function useCreateTeam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: teamService.createTeam,
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['teams'] }); toast.success('Team created.') },
    onError:    () => toast.error('Failed to create team.'),
  })
}

export function usePlayers(teamId?: number) {
  return useQuery({
    queryKey: ['players', teamId],
    queryFn:  () => teamService.listPlayers(teamId),
    select:   (res) => res.data.results,
  })
}

export function useCreatePlayer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: teamService.createPlayer,
    onSuccess:  (_, vars) => { qc.invalidateQueries({ queryKey: ['players', vars.team] }); toast.success('Player added.') },
    onError:    () => toast.error('Failed to add player.'),
  })
}
