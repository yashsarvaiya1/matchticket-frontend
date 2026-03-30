// models/match.ts
export type MatchStatus = 'upcoming' | 'active' | 'draw_closed' | 'ended' | 'concluded'

export interface CommonMatch {
  id:         number
  team1:      number
  team1_name: string
  team2:      number
  team2_name: string
  date:       string
  start_time: string
  end_time:   string
  note:       string
  created_at: string
}

export interface MatchPosition {
  id:             number
  slot:           number
  team:           number
  team_name:      string
  position_label: string
  player:         number | null
  player_name:    string | null
  score:          string | null
}

export interface Match {
  id:                      number
  common_match:            number
  team1:                   number
  team1_name:              string
  team2:                   number
  team2_name:              string
  entry_ticket:            number
  date:                    string
  status:                  MatchStatus
  note:                    string
  common_match_start_time: string
  common_match_end_time:   string
  created_by:              number | null
  created_by_name:         string
  created_at:              string
  positions:               MatchPosition[]
}

export interface MatchList {
  id:                      number
  team1_name:              string
  team2_name:              string
  entry_ticket:            number
  date:                    string
  status:                  MatchStatus
  common_match_start_time: string
  created_at:              string
}

export interface DrawBox {
  id:              number
  box_number:      number
  status:          'open' | 'full' | 'counted' | 'void'
  entries_count:   number
  slots_remaining: number
  created_at:      string
}

export interface MyDraw {
  id:              number
  box_number:      number
  status:          'open' | 'full' | 'counted' | 'void'
  my_slot:         number | null
  position_label:  string | null
  entries_count:   number
  slots_remaining: number
  winner_slots:    number[]
}
