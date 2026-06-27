export type AuthSession = {
  isAuthenticated: boolean
}

export type AuthUser = {
  id: string
  email: string
  role: string
}

export type LoginInput = {
  email: string
  password: string
}

export type LoginResponse = {
  user: AuthUser
}
