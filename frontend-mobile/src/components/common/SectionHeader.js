import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../../constants';

export default function SectionHeader({ icon, title, action, onAction }) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {icon && <MaterialIcons name={icon} size={20} color={Colors.primary} />}
        <Text style={[Typography.h4, { color: Colors.text }]}>{title}</Text>
      </View>
      {action && (
        <Text style={styles.action} onPress={onAction}>
          {action}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  action: { ...Typography.captionBold, color: Colors.primary },
});
