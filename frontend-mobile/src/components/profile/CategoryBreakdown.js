import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';

const DEFAULT_CATEGORIES = [
  { id: 'potholes', label: 'Potholes', icon: 'warning', count: 10, color: Colors.accentOrange },
  { id: 'streetlights', label: 'Streetlights', icon: 'lightbulb', count: 5, color: Colors.accentYellow },
  { id: 'graffiti', label: 'Graffiti', icon: 'brush', count: 3, color: Colors.accentPurple },
];

export default function CategoryBreakdown({ categories = DEFAULT_CATEGORIES }) {
  return (
    <View style={styles.container}>
      {categories.map((cat) => (
        <View key={cat.id} style={styles.item}>
          <View style={[styles.icon, { backgroundColor: cat.color + '20' }]}>
            <MaterialIcons name={cat.icon} size={22} color={cat.color} />
          </View>
          <View style={styles.info}>
            <Text style={[Typography.bodyBold, { color: Colors.text }]}>{cat.label}</Text>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>{cat.count} Reports</Text>
          </View>
          <Text style={[Typography.h3, { color: cat.color }]}>{cat.count}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.md },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 2 },
});
