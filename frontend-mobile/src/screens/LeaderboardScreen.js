import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LeaderboardItem } from '../components/leaderboard';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';

const TABS = ['All Time', 'Monthly', 'Weekly'];

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Marcus Volt', reports: 42, points: 8920 },
  { rank: 2, name: 'Sarah Jenkins', reports: 38, points: 7450 },
  { rank: 3, name: 'David Kim', reports: 35, points: 6810 },
  { rank: 4, name: 'Alex Chen', reports: 31, points: 5200, isYou: true },
  { rank: 5, name: "Riley O'Connell", reports: 28, points: 4950 },
  { rank: 6, name: 'Sam Smith', reports: 22, points: 4120 },
];

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[Typography.h3, { color: Colors.text }]}>Toronto Centre</Text>
          <TouchableOpacity>
            <MaterialIcons name="share" size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Milestone banner */}
        <View style={styles.milestoneBanner}>
          <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Daily Milestone Reached</Text>
          <Text style={[Typography.small, { color: Colors.accentOrange, fontWeight: '700' }]}>HIGH SCORE</Text>
          <Text style={[Typography.h1, { color: Colors.primary }]}>12,450</Text>
          <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Neighborhood Points</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {TABS.map((tab, i) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === i && styles.tabActive]}
              onPress={() => setActiveTab(i)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  Typography.captionBold,
                  { color: activeTab === i ? Colors.textOnPrimary : Colors.textSecondary },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Rankings */}
        <Text style={[Typography.h2, { color: Colors.text, marginBottom: Spacing.lg }]}>Leaderboard</Text>
        {LEADERBOARD_DATA.map((item) => (
          <LeaderboardItem key={item.rank} {...item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.xl, paddingBottom: Spacing.xxxl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  milestoneBanner: {
    alignItems: 'center',
    backgroundColor: Colors.primaryBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  tabActive: { backgroundColor: Colors.primary },
});
