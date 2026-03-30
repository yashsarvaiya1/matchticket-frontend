// services/teamService.ts
import api from '@/lib/axios'
import type { Team, TeamList, Player } from '@/models/team'
import type { PaginatedResponse } from '@/models/common'

export const teamService = {
  listTeams:    ()              => api.get<PaginatedResponse<TeamList>>('/teams/teams/'),
  getTeam:      (id: number)    => api.get<Team>(`/teams/teams/${id}/`),
  createTeam:   (data: { name: string; icon: string }) => api.post<Team>('/teams/teams/', data),
  updateTeam:   (id: number, data: Partial<{ name: string; icon: string }>) =>
                  api.patch<Team>(`/teams/teams/${id}/`, data),
  deactivateTeam: (id: number)  => api.delete(`/teams/teams/${id}/`),
  activateTeam:   (id: number)  => api.patch(`/teams/teams/${id}/activate/`),

  listPlayers:      (teamId?: number) =>
                      api.get<PaginatedResponse<Player>>(`/teams/players/${teamId ? `?team=${teamId}` : ''}`),
  createPlayer:     (data: { name: string; team: number }) => api.post<Player>('/teams/players/', data),
  updatePlayer:     (id: number, data: { name: string })   => api.patch<Player>(`/teams/players/${id}/`, data),
  deactivatePlayer: (id: number) => api.delete(`/teams/players/${id}/`),
  activatePlayer:   (id: number) => api.patch(`/teams/players/${id}/activate/`),
}
