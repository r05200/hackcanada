import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';

const CATEGORIES = [
  { id: 'pothole', label: 'Pothole', icon: 'warning', color: Colors.accentOrange },
  { id: 'streetlight', label: 'Streetlight', icon: 'lightbulb', color: Colors.accentYellow },
  { id: 'graffiti', label: 'Graffiti', icon: 'brush', color: Colors.accentPurple },
  { id: 'trash', label: 'Trash', icon: 'delete', color: Colors.accent },
  { id: 'leaking_pipe', label: 'Leaking Pipe', icon: 'water-drop', color: Colors.accentBlue },
  { id: 'other', label: 'Other', icon: 'more-horiz', color: Colors.textSecondary },
];

export default function CategorySelector({ selected, onSelect }) {
  return (
    <View style={styles.grid}>
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.item, isActive && { borderColor: cat.color, backgroundColor: cat.color + '10' }]}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, { backgroundColor: cat.color + '20' }]}>
              <MaterialIcons name={cat.icon} size={24} color={cat.color} />
            </View>
            <Text style={[Typography.captionBold, { color: isActive ? cat.color : Colors.text }]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export { CATEGORIES };

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  item: {
    width: '30%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surface,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
