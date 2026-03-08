import '../global.css'
import { Slot, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, ActivityIndicator } from 'react-native'
import { AuthProvider, useAuth } from '@/services/auth'

function RootLayoutNav() {
  const { user, isLoading } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/sign-in')
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)/map')
    }
  }, [user, isLoading, segments])

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-pulse-bg">
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    )
  }

  return (
    <>
      <StatusBar style="light" />
      <Slot />
    </>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  )
}
