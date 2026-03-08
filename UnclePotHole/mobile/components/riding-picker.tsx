import { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/colors'
import type { Riding } from '@/types'

interface RidingPickerProps {
  ridings: Riding[]
  selected: string | undefined
  onSelect: (ridingId: string | undefined) => void
}

export default function RidingPicker({
  ridings,
  selected,
  onSelect,
}: RidingPickerProps) {
  const [visible, setVisible] = useState(false)

  const selectedRiding = ridings.find((r) => r._id === selected)

  return (
    <>
      <TouchableOpacity
        className="bg-pulse-surface border border-pulse-border rounded-xl px-4 py-3.5 flex-row items-center justify-between"
        onPress={() => setVisible(true)}
      >
        <Text
          className={
            selectedRiding ? 'text-text-primary text-base' : 'text-text-muted text-base'
          }
        >
          {selectedRiding?.name ?? 'Select your riding'}
        </Text>
        <Ionicons name="chevron-down" size={18} color={Colors.textMuted} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-pulse-card rounded-t-2xl max-h-[70%]">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-pulse-border">
              <Text className="text-text-primary text-lg font-bold">
                Select Riding
              </Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Skip option */}
            <TouchableOpacity
              className="px-4 py-4 border-b border-pulse-border flex-row items-center"
              onPress={() => {
                onSelect(undefined)
                setVisible(false)
              }}
            >
              <Ionicons
                name={!selected ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={!selected ? Colors.accent : Colors.textMuted}
              />
              <Text className="text-text-secondary ml-3">Skip for now</Text>
            </TouchableOpacity>

            {/* Riding list */}
            <FlatList
              data={ridings}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => {
                const isSelected = item._id === selected
                return (
                  <TouchableOpacity
                    className="px-4 py-4 border-b border-pulse-border flex-row items-center"
                    onPress={() => {
                      onSelect(item._id)
                      setVisible(false)
                    }}
                  >
                    <Ionicons
                      name={
                        isSelected ? 'radio-button-on' : 'radio-button-off'
                      }
                      size={20}
                      color={isSelected ? Colors.accent : Colors.textMuted}
                    />
                    <View className="ml-3">
                      <Text className="text-text-primary">{item.name}</Text>
                      <Text className="text-text-muted text-xs uppercase">
                        {item.type}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  )
}
