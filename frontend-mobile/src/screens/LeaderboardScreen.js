import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LeaderboardItem } from '../components/leaderboard';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';
import { leaderboardApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TABS = ['All Time', 'Monthly', 'Weekly'];

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const { user } = useAuth();

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (user?.neighborhood) {
        data = await leaderboardApi.getByNeighborhood(user.neighborhood);
      } else {
        data = await leaderboardApi.getGlobal();
      }
      const ranked = data.map((entry, index) => ({
        rank: index + 1,
        name: entry.username,
        reports: 0,
        points: entry.xp || 0,
        isYou: entry.id === user?.id,
      }));
      setLeaders(ranked);
      const total = ranked.reduce((sum, e) => sum + e.points, 0);
      setTotalPoints(total);
    } catch (e) {
      // Fall back to empty list on error
      setLeaders([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[Typography.h3, { color: Colors.text }]}>
            {user?.neighborhood || 'Global'}
          </Text>
          <TouchableOpacity>
            <MaterialIcons name="share" size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Milestone banner */}
        <View style={styles.milestoneBanner}>
          <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Community Total</Text>
          <Text style={[Typography.small, { color: Colors.accentOrange, fontWeight: '700' }]}>HIGH SCORE</Text>
          <Text style={[Typography.h1, { color: Colors.primary }]}>
            {totalPoints.toLocaleString()}
          </Text>
          <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
            {user?.neighborhood ? 'Neighborhood Points' : 'Global Points'}
          </Text>
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
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: Spacing.xxl }} />
        ) : leaders.length === 0 ? (
          <Text style={[Typography.body, { color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.xxl }]}>
            No rankings yet. Be the first!
          </Text>
        ) : (
          leaders.map((item) => (
            <LeaderboardItem key={item.rank} {...item} />
          ))
        )}
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
