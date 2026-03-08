import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/colors'
import type { LeaderboardEntry } from '@/types'

interface LeaderboardRowProps {
  entry: LeaderboardEntry
  rank: number
}

function getRankStyle(rank: number) {
  switch (rank) {
    case 1:
      return { bg: 'bg-yellow-500/10', color: Colors.yellow, icon: 'trophy' }
    case 2:
      return { bg: 'bg-gray-300/10', color: '#C0C0C0', icon: 'medal' }
    case 3:
      return { bg: 'bg-orange-400/10', color: '#CD7F32', icon: 'medal' }
    default:
      return { bg: 'bg-pulse-surface', color: Colors.textMuted, icon: null }
  }
}

export default function LeaderboardRow({
  entry,
  rank,
}: LeaderboardRowProps) {
  const style = getRankStyle(rank)

  return (
    <View className={`${style.bg} rounded-xl p-4 flex-row items-center border border-pulse-border`}>
      {/* Rank */}
      <View className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: style.color + '20' }}
      >
        {style.icon ? (
          <Ionicons name={style.icon as any} size={20} color={style.color} />
        ) : (
          <Text className="text-text-secondary font-bold text-base">
            {rank}
          </Text>
        )}
      </View>

      {/* Name */}
      <View className="flex-1">
        <Text className="text-text-primary font-semibold text-base">
          {entry.displayName}
        </Text>
        <Text className="text-text-muted text-xs mt-0.5">
          {entry.totalReports} report{entry.totalReports !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Points */}
      <View className="items-end">
        <Text className="text-pulse-accent font-bold text-lg">
          {entry.totalPoints}
        </Text>
        <Text className="text-text-muted text-xs">pts</Text>
      </View>
    </View>
  )
}
