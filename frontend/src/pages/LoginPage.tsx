import { type FormEvent, useState } from 'react'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { login } from '../api/authApi'
import { IconButton } from '../components/ui/IconButton'
import { useComingSoon } from '../hooks/useComingSoon'
import type { ApiResponse } from '../types/api'

export function LoginPage() {
  const navigate = useNavigate()
  const { showComingSoon } = useComingSoon()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [password, setPassword] = useState('')

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      await login({ email, password })
      toast.success('Login successful')
      navigate('/dashboard')
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data as ApiResponse<unknown> | undefined)?.message ?? 'Unable to sign in. Please try again.'
          : 'Unable to sign in. Please try again.'

      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden bg-surface relative">
      <div className="absolute inset-0 bg-texture"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
      <main className="relative z-10 w-full max-w-[420px] px-container-padding">
        <div className="bg-surface-container-lowest p-8 flex flex-col gap-6 shadow-md border border-outline-variant">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary !text-4xl">newspaper</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-on-surface">Telangana Today</h1>
            <p className="text-sm text-on-surface-variant">Management Portal Access</p>
          </div>
          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="email">Email</label>
              <div className="relative flex items-center group">
                <div className="absolute left-3 text-outline group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined" aria-hidden="true">person</span>
                </div>
                <input
                  id="email"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant focus:outline-none focus:border-primary text-sm"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@demo.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="password">Password</label>
                <button className="text-[10px] font-bold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" onClick={() => showComingSoon('Password Recovery')} type="button">Forgot?</button>
              </div>
              <div className="relative flex items-center group">
                <div className="absolute left-3 text-outline group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined" aria-hidden="true">lock</span>
                </div>
                <input
                  id="password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2 bg-surface-container-low border border-outline-variant focus:outline-none focus:border-primary text-sm"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={password}
                />
                <IconButton
                  className="absolute right-2 h-8 w-8 text-outline hover:text-on-surface"
                  icon={isPasswordVisible ? 'visibility_off' : 'visibility'}
                  label={isPasswordVisible ? 'Hide password' : 'Show password'}
                  onClick={() => setIsPasswordVisible((value) => !value)}
                />
              </div>
            </div>
            <button className="w-full bg-primary text-on-primary py-3 font-bold hover:bg-primary-container transition-all flex items-center justify-center gap-2 group" type="submit" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Sign In'}
              {!isLoading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" aria-hidden="true">arrow_forward</span>}
            </button>
          </form>
          <div className="border border-outline-variant bg-surface-container-low p-4 text-left">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Demo Credentials</p>
            <div className="mt-3 grid gap-3 text-xs text-on-surface-variant">
              <div>
                <p className="font-bold text-on-surface">Admin</p>
                <p>Email: <span className="font-medium text-on-surface">admin@demo.com</span></p>
                <p>Password: <span className="font-medium text-on-surface">admin123</span></p>
              </div>
              <div>
                <p className="font-bold text-on-surface">Staff</p>
                <p>Email: <span className="font-medium text-on-surface">staff@demo.com</span></p>
                <p>Password: <span className="font-medium text-on-surface">staff123</span></p>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-outline-variant text-center space-y-4">
            <p className="text-xs text-on-secondary-container">Having trouble? <button className="text-primary font-semibold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" onClick={() => showComingSoon('Contact Support')} type="button">Contact Support</button></p>
            <div className="flex justify-center gap-4 opacity-50 text-[10px]">
              <span>v4.12.0</span>
              <span>•</span>
              <span>Enterprise Security</span>
            </div>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 px-4 py-2 bg-secondary-container/30 backdrop-blur-sm border border-outline-variant/30">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] font-bold text-on-secondary-fixed-variant uppercase">All systems operational</span>
        </div>
      </main>
    </div>
  )
}
