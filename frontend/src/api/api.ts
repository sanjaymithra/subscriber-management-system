import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1',
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(error),
)
