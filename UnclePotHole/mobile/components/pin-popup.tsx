import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { CATEGORY_MAP } from '@/constants/categories'
import { Colors } from '@/constants/colors'
import type { Report, Category } from '@/types'

interface PinPopupProps {
  report: Report
  onClose: () => void
  onDetail: () => void
}

export default function PinPopup({ report, onClose, onDetail }: PinPopupProps) {
  const info = CATEGORY_MAP[report.category as Category]

  return (
    <View className="absolute bottom-28 left-4 right-4 bg-pulse-card rounded-2xl border border-pulse-border p-4 shadow-lg">
      {/* Close button */}
      <TouchableOpacity
        className="absolute top-3 right-3 z-10"
        onPress={onClose}
      >
        <Ionicons name="close" size={20} color={Colors.textMuted} />
      </TouchableOpacity>

      <View className="flex-row items-start">
        {/* Category icon */}
        <View
          className="w-12 h-12 rounded-xl items-center justify-center mr-3"
          style={{ backgroundColor: (info?.color ?? Colors.accent) + '20' }}
        >
          <Ionicons
            name={(info?.icon as any) ?? 'alert-circle'}
            size={24}
            color={info?.color ?? Colors.accent}
          />
        </View>

        <View className="flex-1">
          <Text className="text-text-primary font-semibold text-base">
            {info?.label ?? report.category}
          </Text>
          <Text className="text-text-secondary text-sm mt-0.5">
            Confidence: {Math.round((report.confidence ?? 0) * 100)}%
          </Text>
          {report.description && (
            <Text className="text-text-muted text-xs mt-1" numberOfLines={2}>
              {report.description}
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        className="bg-pulse-accent rounded-xl py-3 items-center mt-3"
        onPress={onDetail}
      >
        <Text className="text-white font-semibold text-sm">View Details</Text>
      </TouchableOpacity>
    </View>
  )
}
