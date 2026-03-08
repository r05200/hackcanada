import axios from 'axios'
import { getToken } from './auth'

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(async (config) => {
  const token = await getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — handled by auth context
    }
    return Promise.reject(error)
  },
)

export default api
