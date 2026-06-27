import { api } from './api'
import type { ApiResponse } from '../types/api'
import type { AuthSession, LoginInput, LoginResponse } from '../types/auth'

export async function login(input: LoginInput): Promise<LoginResponse> {
  const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', input)

  window.sessionStorage.setItem('demoUser', JSON.stringify(response.data.data.user))

  return response.data.data
}

export async function getSession(): Promise<AuthSession> {
  return Promise.resolve({ isAuthenticated: false })
}

export function getCurrentDemoUserEmail() {
  return getCurrentDemoUser()?.email ?? ''
}

export function getCurrentDemoUser() {
  const rawUser = window.sessionStorage.getItem('demoUser')

  if (!rawUser) {
    return {
      email: 'admin@demo.com',
      id: 'demo-admin',
      role: 'Admin',
    }
  }

  try {
    const user = JSON.parse(rawUser) as { email?: string; id?: string; role?: string }
    return {
      email: user.email ?? 'admin@demo.com',
      id: user.id ?? 'demo-user',
      role: user.role ?? 'Admin',
    }
  } catch {
    return {
      email: 'admin@demo.com',
      id: 'demo-admin',
      role: 'Admin',
    }
  }
}
