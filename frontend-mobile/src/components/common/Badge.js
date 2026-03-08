import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Spacing } from '../../constants';

export default function Badge({ label, icon, color = Colors.primary, size = 'md' }) {
  const sz = size === 'sm' ? 40 : 56;
  const iconSz = size === 'sm' ? 18 : 24;

  return (
    <View style={styles.container}>
      <View style={[styles.circle, { width: sz, height: sz, backgroundColor: color + '20' }]}>
        <MaterialIcons name={icon} size={iconSz} color={color} />
      </View>
      {label && (
        <Text style={[size === 'sm' ? Typography.small : Typography.caption, styles.label]} numberOfLines={1}>
          {label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: Spacing.xs },
  circle: { borderRadius: BorderRadius.full, alignItems: 'center', justifyContent: 'center' },
  label: { color: Colors.textSecondary, textAlign: 'center', maxWidth: 64 },
});
