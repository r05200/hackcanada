import { useState } from 'react'
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

export default function SignInScreen() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignIn() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      await signIn(email.trim().toLowerCase(), password)
    } catch (err: any) {
      Alert.alert(
        'Sign In Failed',
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
        <View className="flex-1 justify-center px-8">
          {/* Header */}
          <View className="items-center mb-12">
            <View className="w-20 h-20 rounded-2xl bg-pulse-accent items-center justify-center mb-4">
              <Ionicons name="shield-checkmark" size={40} color="#fff" />
            </View>
            <Text className="text-3xl font-bold text-text-primary">
              Civic Pulse
            </Text>
            <Text className="text-text-secondary mt-2 text-center">
              Report issues. Earn points. Fix Toronto.
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
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
                placeholder="••••••••"
                placeholderTextColor="#64748B"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity
              className={`rounded-xl py-4 items-center mt-4 ${
                loading ? 'bg-pulse-accent/60' : 'bg-pulse-accent'
              }`}
              onPress={handleSignIn}
              disabled={loading}
            >
              <Text className="text-white font-semibold text-base">
                {loading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-text-secondary">
              Don't have an account?{' '}
            </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text className="text-pulse-accent font-semibold">
                  Join Civic Pulse
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
