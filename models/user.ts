// models/user.ts
export interface User {
  id:            number
  mobile_number: string
  name:          string
  tickets:       string
  is_active:     boolean
  is_staff:      boolean
  is_superuser:  boolean
  date_joined:   string
}

export interface TicketTransaction {
  id:               number
  user:             number
  user_name:        string
  transaction_type: 'credit' | 'debit'
  reason:           'admin_add' | 'admin_debit' | 'draw_entry' | 'refund' | 'win'
  amount:           string
  match:            number | null
  drawbox:          number | null
  draw_entry:       number | null
  created_by:       number | null
  note:             string
  created_at:       string
}
