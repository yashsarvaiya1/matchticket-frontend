// models/auth.ts
export interface PendingAuth {
  mobile_number: string
  password_set:  boolean
  name:          string | null
}

export interface AuthUser {
  name:         string | null
  is_staff:     boolean
  is_superuser: boolean
  access:       string
}

export interface LoginResponse extends AuthUser {
  refresh: string
}
