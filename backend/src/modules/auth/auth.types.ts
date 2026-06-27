export type AuthModuleStatus = 'ready'

export type AuthUser = {
  id: string
  email: string
  role: string
}

export type LoginInput = {
  email: string
  password: string
}

export type LoginResult = {
  user: AuthUser
}
