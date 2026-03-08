import { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { Link } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@/services/auth'
import api from '@/services/api'
import type { Riding } from '@/types'
import RidingPicker from '@/components/riding-picker'

export default function RegisterScreen() {
  const { register } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [ridings, setRidings] = useState<Riding[]>([])
  const [selectedRiding, setSelectedRiding] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadRidings()
  }, [])

  async function loadRidings() {
    try {
      const { data } = await api.get('/ridings')
      setRidings(data)
    } catch {
      // Ridings are optional for registration
    }
  }

  async function handleRegister() {
    if (!displayName || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields')
      return
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await register(
        displayName.trim(),
        email.trim().toLowerCase(),
        password,
        selectedRiding,
      )
    } catch (err: any) {
      Alert.alert(
        'Registration Failed',
        err.response?.data?.error ?? 'Something went wrong',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-pulse-bg"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-8 py-12">
          {/* Header */}
          <View className="items-center mb-10">
            <View className="w-20 h-20 rounded-2xl bg-pulse-accent items-center justify-center mb-4">
              <Ionicons name="people" size={40} color="#fff" />
            </View>
            <Text className="text-3xl font-bold text-text-primary">
              Join Civic Pulse
            </Text>
            <Text className="text-text-secondary mt-2 text-center">
              Start your civic quest today
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            <View>
              <Text className="text-text-secondary text-sm mb-2 ml-1">
                Display Name
              </Text>
              <TextInput
                className="bg-pulse-surface border border-pulse-border rounded-xl px-4 py-3.5 text-text-primary text-base"
                placeholder="Your name"
                placeholderTextColor="#64748B"
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>

            <View>
              <Text className="text-text-secondary text-sm mb-2 ml-1">
                Email
              </Text>
              <TextInput
                className="bg-pulse-surface border border-pulse-border rounded-xl px-4 py-3.5 text-text-primary text-base"
                placeholder="you@example.com"
                placeholderTextColor="#64748B"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View>
              <Text className="text-text-secondary text-sm mb-2 ml-1">
                Password
              </Text>
              <TextInput
                className="bg-pulse-surface border border-pulse-border rounded-xl px-4 py-3.5 text-text-primary text-base"
                placeholder="Min 6 characters"
                placeholderTextColor="#64748B"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View>
              <Text className="text-text-secondary text-sm mb-2 ml-1">
                Your Riding (optional)
              </Text>
              <RidingPicker
                ridings={ridings}
                selected={selectedRiding}
                onSelect={setSelectedRiding}
              />
            </View>

            <TouchableOpacity
              className={`rounded-xl py-4 items-center mt-4 ${
                loading ? 'bg-pulse-accent/60' : 'bg-pulse-accent'
              }`}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text className="text-white font-semibold text-base">
                {loading ? 'Creating Account...' : 'Start Your Quest'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-text-secondary">
              Already have an account?{' '}
            </Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity>
                <Text className="text-pulse-accent font-semibold">
                  Sign In
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
