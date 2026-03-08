import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../common/Card';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';

export default function TrendingActionCard({
  title = 'Park Clean-up tomorrow',
  time = '9:00 AM',
  location = 'Central Park',
  type = 'Volunteering',
  onPress,
}) {
  return (
    <Card>
      <View style={styles.header}>
        <MaterialIcons name="local-fire-department" size={20} color={Colors.accent} />
        <Text style={[Typography.h4, { color: Colors.text }]}>Trending Action</Text>
      </View>

      <TouchableOpacity style={styles.content} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{type}</Text>
        </View>
        <Text style={[Typography.bodyBold, { color: Colors.text, marginTop: Spacing.sm }]}>{title}</Text>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <MaterialIcons name="event" size={14} color={Colors.textTertiary} />
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>{time}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="location-on" size={14} color={Colors.textTertiary} />
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>{location}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  content: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentPurple + '20',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  typeText: { ...Typography.captionBold, color: Colors.accentPurple },
  meta: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.sm },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
