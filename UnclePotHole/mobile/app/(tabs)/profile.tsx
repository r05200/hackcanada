import { useState, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import api from '@/services/api'
import { useAuth } from '@/services/auth'
import { Colors } from '@/constants/colors'
import { CATEGORY_MAP } from '@/constants/categories'
import type { Report, ProfileStats, Category } from '@/types'
import EmptyState from '@/components/empty-state'

export default function ProfileScreen() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [stats, setStats] = useState<ProfileStats | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      loadProfile()
    }, []),
  )

  async function loadProfile() {
    try {
      setLoading(true)
      const [statsRes, reportsRes] = await Promise.all([
        api.get('/profile/me'),
        api.get('/profile/me/reports'),
      ])
      setStats(statsRes.data)
      setReports(reportsRes.data.data ?? reportsRes.data)
    } catch {
      // handle error
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-pulse-bg items-center justify-center">
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-pulse-bg">
      <FlatList
        data={reports}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListHeaderComponent={
          <View>
            {/* Profile header */}
            <View className="items-center pt-6 pb-4 px-4">
              <View className="w-20 h-20 rounded-full bg-pulse-accent items-center justify-center mb-3">
                <Text className="text-white text-3xl font-bold">
                  {user?.displayName?.charAt(0)?.toUpperCase() ?? '?'}
                </Text>
              </View>
              <Text className="text-text-primary text-xl font-bold">
                {user?.displayName}
              </Text>
              <Text className="text-text-secondary text-sm mt-1">
                {user?.email}
              </Text>
            </View>

            {/* Stats cards */}
            <View className="flex-row px-4 gap-3 mb-4">
              <View className="flex-1 bg-pulse-card rounded-xl p-4 border border-pulse-border items-center">
                <Ionicons name="star" size={24} color={Colors.yellow} />
                <Text className="text-text-primary text-2xl font-bold mt-1">
                  {stats?.user?.totalPoints ?? 0}
                </Text>
                <Text className="text-text-muted text-xs mt-1">Points</Text>
              </View>
              <View className="flex-1 bg-pulse-card rounded-xl p-4 border border-pulse-border items-center">
                <Ionicons name="flag" size={24} color={Colors.green} />
                <Text className="text-text-primary text-2xl font-bold mt-1">
                  {stats?.user?.totalReports ?? 0}
                </Text>
                <Text className="text-text-muted text-xs mt-1">Reports</Text>
              </View>
            </View>

            {/* Category breakdown */}
            {stats?.categoryBreakdown && stats.categoryBreakdown.length > 0 && (
              <View className="px-4 mb-4">
                <Text className="text-text-primary font-semibold text-base mb-3">
                  Issue Breakdown
                </Text>
                <View className="bg-pulse-card rounded-xl border border-pulse-border p-4">
                  {stats.categoryBreakdown.map((cat) => {
                    const info = CATEGORY_MAP[cat._id as Category]
                    return (
                      <View
                        key={cat._id}
                        className="flex-row items-center justify-between py-2"
                      >
                        <View className="flex-row items-center">
                          <View
                            className="w-3 h-3 rounded-full mr-3"
                            style={{
                              backgroundColor: info?.color ?? Colors.accent,
                            }}
                          />
                          <Text className="text-text-primary">
                            {info?.label ?? cat._id}
                          </Text>
                        </View>
                        <Text className="text-text-secondary font-medium">
                          {cat.count}
                        </Text>
                      </View>
                    )
                  })}
                </View>
              </View>
            )}

            {/* Section header */}
            <View className="px-4 mb-2 flex-row items-center">
              <Ionicons
                name="document-text"
                size={18}
                color={Colors.textSecondary}
              />
              <Text className="text-text-primary font-semibold text-base ml-2">
                Recent Reports
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const info = CATEGORY_MAP[item.category as Category]
          return (
            <TouchableOpacity
              className="mx-4 mb-2 bg-pulse-card rounded-xl border border-pulse-border p-4"
              onPress={() => router.push(`/report/${item._id}`)}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View
                    className="w-2.5 h-2.5 rounded-full mr-3"
                    style={{
                      backgroundColor: info?.color ?? Colors.accent,
                    }}
                  />
                  <View className="flex-1">
                    <Text className="text-text-primary font-medium">
                      {info?.label ?? item.category}
                    </Text>
                    <Text
                      className="text-text-muted text-xs mt-0.5"
                      numberOfLines={1}
                    >
                      {item.description || 'No description'}
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-pulse-accent text-sm font-semibold">
                    +{item.pointsAwarded} pts
                  </Text>
                  <Text className="text-text-muted text-xs mt-0.5">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        }}
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title="No reports yet"
            subtitle="Tap the + button on the map to file your first report!"
          />
        }
        ListFooterComponent={
          <View className="px-4 mt-4">
            <TouchableOpacity
              className="rounded-xl py-3 items-center border border-pulse-red"
              onPress={() => signOut()}
            >
              <Text className="text-pulse-red font-semibold">Sign Out</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  )
}
