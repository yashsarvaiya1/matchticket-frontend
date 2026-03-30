// services/matchService.ts
import api from '@/lib/axios'
import type { CommonMatch, Match, MatchList, MatchPosition, DrawBox, MyDraw } from '@/models/match'
import type { PaginatedResponse } from '@/models/common'

export const matchService = {
  // Common Matches
  listCommonMatches:   ()              => api.get<PaginatedResponse<CommonMatch>>('/match/common-matches/'),
  getCommonMatch:      (id: number)    => api.get<CommonMatch>(`/match/common-matches/${id}/`),
  createCommonMatch:   (data: { team1: number; team2: number; date: string; start_time: string; end_time: string; note?: string }) =>
                         api.post<CommonMatch>('/match/common-matches/', data),
  updateCommonMatch:   (id: number, data: Partial<CommonMatch>) =>
                         api.patch<CommonMatch>(`/match/common-matches/${id}/`, data),
  deleteCommonMatch:   (id: number)    => api.delete(`/match/common-matches/${id}/`),

  // Matches
  listMatches:   (params?: { common_match?: number; status?: string }) =>
                   api.get<PaginatedResponse<MatchList>>('/match/matches/', { params }),
  getMatch:      (id: number) => api.get<Match>(`/match/matches/${id}/`),
  createMatch:   (data: { common_match: number; entry_ticket: number; note?: string }) =>
                   api.post<Match>('/match/matches/', data),
  updateMatch:   (id: number, data: Partial<{ entry_ticket: number; note: string }>) =>
                   api.patch<Match>(`/match/matches/${id}/`, data),
  activate:      (id: number) => api.post<Match>(`/match/matches/${id}/activate/`),
  end:           (id: number) => api.post<Match>(`/match/matches/${id}/end/`),
  revealWinner:  (id: number) => api.post<Match>(`/match/matches/${id}/reveal-winner/`),

  // Positions
  listPositions:  (matchId: number) =>
                    api.get<PaginatedResponse<MatchPosition>>(`/match/positions/?match=${matchId}`),
  updatePosition: (id: number, data: { player?: number | null; score?: string | null }, scope: 'mine' | 'all' = 'mine') =>
                    api.patch<MatchPosition>(`/match/positions/${id}/?scope=${scope}`, data),

  // DrawBoxes
  listDrawBoxes: (matchId: number) =>
                   api.get<PaginatedResponse<DrawBox>>(`/match/drawboxes/?match=${matchId}`),

  // Draw Entries
  openDraw:  (matchId: number) => api.post('/match/draws/open-draw/', { match: matchId }),
  myDraws:   (matchId: number) => api.get<MyDraw[]>(`/match/draws/my-draws/?match=${matchId}`),
}
