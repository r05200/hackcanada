import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../common/Card';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';

export default function DailyQuestCard({ onReport }) {
  return (
    <Card>
      <View style={styles.header}>
        <MaterialIcons name="check-circle" size={20} color={Colors.primary} />
        <Text style={[Typography.h4, { color: Colors.text }]}>Daily Quest</Text>
      </View>

      <TouchableOpacity style={styles.questItem} onPress={onReport} activeOpacity={0.7}>
        <View style={styles.questIcon}>
          <MaterialIcons name="report-problem" size={20} color={Colors.accentOrange} />
        </View>
        <View style={styles.questContent}>
          <Text style={[Typography.bodyBold, { color: Colors.text }]}>Report 1 local issue</Text>
          <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
            Potholes, lights, or graffiti
          </Text>
        </View>
        <View style={styles.reward}>
          <Text style={styles.rewardText}>+50</Text>
          <Text style={[Typography.small, { color: Colors.textSecondary }]}>Points</Text>
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  questItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  questIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.accentOrange + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questContent: { flex: 1, gap: 2 },
  reward: { alignItems: 'center' },
  rewardText: { ...Typography.h4, color: Colors.primary },
});
