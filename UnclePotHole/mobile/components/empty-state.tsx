import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/colors'

interface EmptyStateProps {
  icon: string
  title: string
  subtitle: string
}

export default function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Ionicons
        name={icon as any}
        size={56}
        color={Colors.textMuted}
      />
      <Text className="text-text-primary text-lg font-semibold mt-4 text-center">
        {title}
      </Text>
      <Text className="text-text-muted text-sm mt-2 text-center">
        {subtitle}
      </Text>
    </View>
  )
}
