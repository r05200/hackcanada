import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';

export default function CommunityImpactBanner({ percentile = 5, trend = 12 }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Community Impact</Text>
      <View style={styles.row}>
        <Text style={styles.value}>Top {percentile}%</Text>
        <View style={styles.trend}>
          <MaterialIcons name="trending-up" size={14} color={Colors.success} />
          <Text style={styles.trendText}>+{trend}% this week</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  label: { ...Typography.caption, color: Colors.textSecondary },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.xs },
  value: { ...Typography.h3, color: Colors.primaryDark },
  trend: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trendText: { ...Typography.caption, color: Colors.success },
});
