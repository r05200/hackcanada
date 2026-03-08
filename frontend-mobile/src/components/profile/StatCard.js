import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../common/Card';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';

export default function StatCard({ icon, label, value, color = Colors.primary }) {
  return (
    <Card style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
        <MaterialIcons name={icon} size={22} color={color} />
      </View>
      <Text style={[Typography.caption, { color: Colors.textSecondary }]}>{label}</Text>
      <Text style={[Typography.h2, { color: Colors.text }]}>{value}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, alignItems: 'center', gap: Spacing.xs, paddingVertical: Spacing.lg },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
});
