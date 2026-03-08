import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import * as SecureStore from 'expo-secure-store'
import api from './api'
import type { User, AuthResponse } from '@/types'

const TOKEN_KEY = 'civic_pulse_token'

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY)
}

async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token)
}

async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY)
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  register: (
    displayName: string,
    email: string,
    password: string,
    ridingId?: string, // how users are stored in the db
  ) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({ // Create context for auth
  user: null,
  token: null,
  isLoading: true,
  signIn: async () => {},
  register: async () => {},
  signOut: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStoredAuth()
  }, [])

  async function loadStoredAuth() {
    try {
      const stored = await getToken()
      if (stored) {
        setTokenState(stored)
        const { data } = await api.get('/users/me')
        setUser(data.user)
      }
    } catch {
      await removeToken()
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    })
    await setToken(data.token)
    setTokenState(data.token)
    setUser(data.user)
  }, [])

  const register = useCallback(
    async (
      displayName: string,
      email: string,
      password: string,
      ridingId?: string,
    ) => {
      const { data } = await api.post<AuthResponse>('/auth/register', {
        displayName,
        email,
        password,
        ridingId,
      })
      await setToken(data.token)
      setTokenState(data.token)
      setUser(data.user)
    },
    [],
  )

  const signOut = useCallback(async () => {
    await removeToken()
    setTokenState(null)
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
