import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import api from '@/services/api'
import { Colors } from '@/constants/colors'
import type { Riding, LeaderboardEntry } from '@/types'
import LeaderboardRow from '@/components/leaderboard-row'
import EmptyState from '@/components/empty-state'

export default function LeaderboardScreen() {
  const [ridings, setRidings] = useState<Riding[]>([])
  const [selectedRiding, setSelectedRiding] = useState<string | null>(null)
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRidings()
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (selectedRiding) {
        loadLeaderboard(selectedRiding)
      }
    }, [selectedRiding]),
  )

  async function loadRidings() {
    try {
      const { data } = await api.get('/ridings')
      setRidings(data)
      if (data.length > 0) {
        setSelectedRiding(data[0]._id)
      }
    } catch {
      setLoading(false)
    }
  }

  async function loadLeaderboard(ridingId: string) {
    try {
      setLoading(true)
      const { data } = await api.get(`/leaderboard/${ridingId}`)
      setEntries(data)
    } catch {
      setEntries([])
    } finally {
      setLoading(false)
    }
  }

  function renderRidingTab(riding: Riding) {
    const isActive = riding._id === selectedRiding
    return (
      <TouchableOpacity
        key={riding._id}
        className={`px-4 py-2 rounded-full mr-2 ${
          isActive ? 'bg-pulse-accent' : 'bg-pulse-surface'
        }`}
        onPress={() => setSelectedRiding(riding._id)}
      >
        <Text
          className={`text-sm font-medium ${
            isActive ? 'text-white' : 'text-text-secondary'
          }`}
        >
          {riding.name.split('—')[0].trim()}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View className="flex-1 bg-pulse-bg">
      {/* Riding tabs */}
      <View className="px-4 pt-4 pb-2">
        <FlatList
          data={ridings}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => renderRidingTab(item)}
          keyExtractor={(item) => item._id}
        />
      </View>

      {/* Header */}
      <View className="px-4 py-3 flex-row items-center">
        <Ionicons name="trophy" size={22} color={Colors.yellow} />
        <Text className="text-text-primary text-lg font-bold ml-2">
          Riding Champions
        </Text>
      </View>

      {/* List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : entries.length === 0 ? (
        <EmptyState
          icon="trophy-outline"
          title="No champions yet"
          subtitle="Be the first to report an issue in this riding!"
        />
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          renderItem={({ item, index }) => (
            <LeaderboardRow entry={item} rank={index + 1} />
          )}
          ItemSeparatorComponent={() => <View className="h-2" />}
        />
      )}
    </View>
  )
}
