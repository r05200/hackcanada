import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import api from '../api'
import type { User } from '../types'

interface AuthCtx {
  user: User | null
  token: string | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  register: (
    displayName: string,
    email: string,
    password: string,
    ridingId?: string,
  ) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  token: null,
  isLoading: true,
  signIn: async () => {},
  register: async () => {},
  signOut: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('civic_token'),
  )
  const [isLoading, setIsLoading] = useState(true)

  // restore session
  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }
    api
      .get('/users/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('civic_token')
        setToken(null)
      })
      .finally(() => setIsLoading(false))
  }, [token])

  const signIn = useCallback(async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('civic_token', data.token)
    setToken(data.token)
    setUser(data.user)
  }, [])

  const register = useCallback(
    async (
      displayName: string,
      email: string,
      password: string,
      ridingId?: string,
    ) => {
      const { data } = await api.post('/auth/register', {
        displayName,
        email,
        password,
        ridingId,
      })
      localStorage.setItem('civic_token', data.token)
      setToken(data.token)
      setUser(data.user)
    },
    [],
  )

  const signOut = useCallback(() => {
    localStorage.removeItem('civic_token')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, signIn, register, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}
