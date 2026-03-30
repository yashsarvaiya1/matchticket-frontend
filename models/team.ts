// models/team.ts
export interface Team {
  id:              number
  name:            string
  icon:            string
  is_active:       boolean
  created_by:      number | null
  created_by_name: string
  created_at:      string
  players:         Player[]
}

export interface TeamList {
  id:         number
  name:       string
  icon:       string
  is_active:  boolean
  created_at: string
}

export interface Player {
  id:         number
  name:       string
  team:       number
  team_name:  string
  is_active:  boolean
  created_at: string
}
